// Issue #4 regression: real scrolling, counter copy/tabs, loading and non-WebGL fallbacks.
// BASE=http://localhost:3300 OUT=<absolute scratch directory> node render/issue4.mjs
import assert from "node:assert/strict";
import { mkdirSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { launch } from "./lib.mjs";

const BASE = process.env.BASE || "http://localhost:3300";
const OUT = resolve(process.env.OUT || process.env.TEMP, "issue4");
mkdirSync(OUT, { recursive: true });
const results = [];
const browser = await launch({ gpu: true });
const check = (name, ok, detail) => {
  results.push({ name, ok: !!ok, detail });
  console.log(JSON.stringify(results.at(-1)));
  assert.ok(ok, name);
};
const wait = (page, ms) =>
  page.evaluate((ms) => new Promise((r) => setTimeout(r, ms)), ms);
const ready = (page) =>
  page.waitForFunction(() => window.__world?.ready(), null, { timeout: 30000 });
// Tahap 7 (lengths as of tahap 10): the take has a timeline per format (lobby holds), 36.3 screens of scroll on landscape and 37.45 on
// portrait (max-aspect-ratio 1/1, the page's PORTRAIT_QUERY). Up to the lobby both run screen for screen with the
// world's own timeline (TAKE_SCREENS, 37.45; tahap 8), which is what jump() takes.
const TAKE = { pc: 36.3, hp: 37.45 };
async function open(viewport, options = {}) {
  const page = await browser.newPage({ viewport, ...options });
  const errors = [];
  page.on("pageerror", (e) => errors.push(e.message));
  return { page, errors };
}
async function at(page, key) {
  await page.evaluate((key) => {
    const el = document.getElementById("beranda");
    const stage = el.querySelector("[data-stage]");
    const p = window.__world.keyP(key);
    const portrait = matchMedia("(max-aspect-ratio: 1/1)").matches,
      total = Number(
        el.style.getPropertyValue(portrait ? "--take-hp" : "--take"),
      );
    // (keys before the lobby: the same screens of scroll on both formats)
    scrollTo({
      top:
        el.offsetTop +
        ((p * 37.45) / total) * (el.offsetHeight - stage.clientHeight),
      behavior: "instant",
    });
    window.__world.world.jump(p);
  }, key);
  await wait(page, 1000);
}
async function copy(page, name) {
  return page.locator(`.${name}-copy`).evaluate((el) => {
    const s = getComputedStyle(el),
      r = el.getBoundingClientRect();
    return {
      visibility: s.visibility,
      opacity: Number(s.opacity),
      rect: { x: r.x, y: r.y, right: r.right, bottom: r.bottom },
    };
  });
}
async function scrollRun(page, secondsPerScreen, reverse = false) {
  return page.evaluate(
    async ({ secondsPerScreen, reverse }) => {
      const el = document.getElementById("beranda"),
        stage = el.querySelector("[data-stage]");
      const portrait = matchMedia("(max-aspect-ratio: 1/1)").matches,
        total = Number(
          el.style.getPropertyValue(portrait ? "--take-hp" : "--take"),
        ),
        world = 37.45;
      const range = el.offsetHeight - stage.clientHeight;
      const from = reverse ? 9.2 : 6.5,
        to = reverse ? 6.5 : 9.2;
      const go = (s) =>
        scrollTo({
          top: el.offsetTop + (s / total) * range,
          behavior: "instant",
        });
      go(from);
      window.__world.world.jump(from / world);
      await new Promise((r) => setTimeout(r, 500));
      const start = performance.now(),
        duration = Math.abs(to - from) * secondsPerScreen,
        rows = [];
      await new Promise((resolve) => {
        function tick() {
          const t = (performance.now() - start) / 1000;
          go(from + (to - from) * Math.min(1, t / duration));
          const d = window.__world.world.debug();
          rows.push({
            t,
            shown: d.scroll.shown * world,
            target: d.scroll.target * world,
            counter: d.counter,
          });
          if (t < duration + 1.5) requestAnimationFrame(tick);
          else resolve();
        }
        requestAnimationFrame(tick);
      });
      const moving = rows.filter((r) => r.t < duration);
      const settled = rows.find(
        (r) => r.t >= duration && Math.abs(r.shown - r.target) < 0.01,
      );
      return {
        secondsPerScreen,
        reverse,
        rows,
        maxLag: Math.max(...moving.map((r) => Math.abs(r.target - r.shown))),
        settleSeconds: settled ? settled.t - duration : null,
        reversals: rows.filter(
          (r, i) =>
            i > 0 &&
            (r.shown - rows[i - 1].shown) * (reverse ? -1 : 1) < -0.001,
        ).length,
      };
    },
    { secondsPerScreen, reverse },
  );
}

try {
  for (const [label, width, height] of [
    ["hp-small", 360, 640],
    ["hp", 375, 812],
    ["tablet", 768, 1024],
    ["pc", 1280, 720],
  ]) {
    const { page, errors } = await open({ width, height });
    await page.goto(`${BASE}/?hud`, { waitUntil: "domcontentloaded" });
    await ready(page);
    const boot = await page.evaluate(() => ({
      total: Number(
        document.getElementById("beranda").style.getPropertyValue("--take"),
      ),
      totalHp: Number(
        document.getElementById("beranda").style.getPropertyValue("--take-hp"),
      ),
      cast: window.__world.world.stats().cast.done,
      fonts: document.fonts.status,
      ao: window.__world.aoDone(),
    }));
    check(
      `${label}: ready includes cast/fonts/AO and ${TAKE.pc}/${TAKE.hp} screens`,
      boot.cast &&
        boot.fonts === "loaded" &&
        boot.ao &&
        Math.abs(boot.total - TAKE.pc) < 1e-8 &&
        Math.abs(boot.totalHp - TAKE.hp) < 1e-8,
      boot,
    );
    await wait(page, 2500);
    check(
      `${label}: next-set assets prepared during intro`,
      await page.evaluate(() =>
        performance
          .getEntriesByType("resource")
          .some((r) => r.name.includes("row-sepatu-wall.png")),
      ),
    );
    for (const [key, name] of [
      ["K3", "leaflet"],
      ["K4", "binder"],
    ]) {
      await at(page, key);
      const state = await copy(page, name);
      check(
        `${label}: ${key} copy ready and within viewport`,
        state.visibility === "visible" &&
          state.opacity >= 0.99 &&
          state.rect.x >= -2 &&
          state.rect.right <= width + 2 &&
          state.rect.y >= 0 &&
          state.rect.bottom <= height + 2,
        state,
      );
      await page.screenshot({ path: join(OUT, `${label}-${key}.png`) });
    }
    const tabs = page.locator('.binder-copy [role="tab"]');
    for (let i = 0; i < (await tabs.count()); i++) {
      await tabs.nth(i).click();
      check(
        `${label}: binder tab ${i + 1}`,
        (await tabs.nth(i).getAttribute("aria-selected")) === "true",
      );
    }
    await tabs.last().press("Home");
    check(
      `${label}: binder keyboard Home`,
      (await tabs.first().getAttribute("aria-selected")) === "true",
    );
    for (const [speed, reverse] of [
      [2, false],
      [1, false],
      [1, true],
    ]) {
      const run = await scrollRun(page, speed, reverse);
      writeFileSync(
        join(OUT, `${label}-${speed}-${reverse}.json`),
        JSON.stringify(run),
      );
      check(
        `${label}: ${speed}s/screen ${reverse ? "back" : "forward"} follows scroll`,
        run.maxLag < 0.4 &&
          run.settleSeconds !== null &&
          run.settleSeconds < 1 &&
          run.reversals === 0,
        {
          maxLag: run.maxLag,
          settleSeconds: run.settleSeconds,
          reversals: run.reversals,
        },
      );
    }
    await page.evaluate(() => {
      location.hash = "layanan";
    });
    await wait(page, 1500);
    const linked = await copy(page, "leaflet");
    check(
      `${label}: #layanan shows copy`,
      linked.visibility === "visible" && linked.opacity >= 0.99,
      linked,
    );
    await page.evaluate(() => {
      location.hash = "cara-kerja";
    });
    await wait(page, 1500);
    check(
      `${label}: #cara-kerja reaches journey`,
      await page
        .locator(".journey-intro")
        .evaluate((el) => getComputedStyle(el).visibility === "visible"),
    );
    check(`${label}: no runtime errors`, errors.length === 0, errors);
    await page.close();
  }

  for (const [label, options] of [
    ["no-webgl", {}],
    ["reduced-motion", { reducedMotion: "reduce" }],
    ["no-js", { javaScriptEnabled: false }],
  ]) {
    const { page, errors } = await open({ width: 375, height: 812 }, options);
    if (label === "no-webgl")
      await page.addInitScript(() => {
        const original = HTMLCanvasElement.prototype.getContext;
        HTMLCanvasElement.prototype.getContext = function (type, ...args) {
          return type.startsWith("webgl")
            ? null
            : original.call(this, type, ...args);
        };
      });
    await page.goto(`${BASE}/?hud`, { waitUntil: "load" });
    if (label === "no-webgl") {
      await page.waitForSelector('.take[data-mode="stills"]');
      for (const [s, name] of [
        [6.9, "leaflet"],
        [7.9, "binder"],
        [6.9, "leaflet"],
      ]) {
        await page.evaluate((s) => {
          const el = document.getElementById("beranda");
          scrollTo(
            0,
            el.offsetTop + s * el.querySelector("[data-stage]").clientHeight,
          );
        }, s);
        await wait(page, 400);
        const state = await copy(page, name);
        check(
          `${label}: ${name} at ${s}`,
          state.visibility === "visible" && state.opacity >= 0.99,
          state,
        );
      }
    } else {
      check(
        `${label}: readable stacked copy`,
        (await page.locator(".leaflet-copy").isVisible()) &&
          (await page.locator(".binder-copy").isVisible()),
      );
    }
    check(
      `${label}: no live WebGL canvas`,
      (await page.locator(".take-canvas canvas").count()) === 0,
    );
    check(`${label}: no runtime errors`, errors.length === 0, errors);
    await page.close();
  }

  // Hold font responses to prove 3D cannot be revealed before text metrics are ready.
  {
    const { page, errors } = await open({ width: 375, height: 812 });
    let release;
    const gate = new Promise((r) => {
      release = r;
    });
    await page.route("**/*.woff2", async (route) => {
      await gate;
      await route.continue();
    });
    await page.goto(`${BASE}/?hud`, { waitUntil: "domcontentloaded" });
    await wait(page, 3500);
    check(
      "slow fonts: still booting",
      (await page.locator(".take").getAttribute("data-mode")) === "boot",
    );
    release();
    await ready(page);
    check("slow fonts: recovers to live", errors.length === 0, errors);
    await page.close();
  }
} finally {
  writeFileSync(join(OUT, "results.json"), JSON.stringify(results, null, 2));
  await browser.close();
}
