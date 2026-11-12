// Production loading/lifecycle cases for issue #4. Uses the same BASE/OUT options as issue4.mjs.
import assert from "node:assert/strict";
import { readdirSync, readFileSync, mkdirSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { launch, SITE } from "./lib.mjs";

const BASE = process.env.BASE || "http://localhost:3300";
const OUT = resolve(process.env.OUT || process.env.TEMP, "issue4");
mkdirSync(OUT, { recursive: true });
const chunks = join(SITE, ".next/static/chunks");
const findChunk = (test) => {
  const name = readdirSync(chunks).find(
    (n) => n.endsWith(".js") && test(readFileSync(join(chunks, n), "utf8")),
  );
  assert.ok(name, "production chunk found");
  return `**/_next/static/chunks/${name}`;
};
const worldChunk = findChunk(
  (s) => s.includes("clock3:") && s.includes("webglcontextlost"),
);
// (the cast module's own chunk: its export list names buildCloseHands. Since tahap 7 the cast shares modules with
// Wildan's and Andi's chunk, so Turbopack lists the exports as "name,id" pairs in a small chunk of its own)
const castChunk = findChunk((s) => /["',]buildCloseHands[,"']/.test(s));
const browser = await launch({ gpu: true });
const results = [];
const check = (name, ok, detail) => {
  results.push({ name, ok: !!ok, detail });
  console.log(JSON.stringify(results.at(-1)));
  assert.ok(ok, name);
};
const wait = (page, ms) =>
  page.evaluate((ms) => new Promise((r) => setTimeout(r, ms)), ms);
async function open() {
  const page = await browser.newPage({ viewport: { width: 375, height: 812 } });
  const errors = [];
  page.on("pageerror", (e) => errors.push(e.message));
  return { page, errors };
}
const ready = (page) =>
  page.waitForFunction(() => window.__world?.ready(), null, { timeout: 30000 });
async function fullCopy(page, name) {
  return page.locator(`.${name}-copy`).evaluate((el) => {
    const s = getComputedStyle(el);
    return s.visibility === "visible" && Number(s.opacity) >= 0.99;
  });
}

try {
  for (const [label, pattern] of [
    ["world", worldChunk],
    ["cast", castChunk],
  ]) {
    const { page, errors } = await open();
    await page.route(pattern, (route) => route.abort());
    await page.goto(`${BASE}/?hud#layanan`, { waitUntil: "domcontentloaded" });
    await page.waitForSelector('.take[data-mode="stills"]', { timeout: 25000 });
    check(
      `failed ${label}: usable stills with copy`,
      await fullCopy(page, "leaflet"),
    );
    check(
      `failed ${label}: canvas removed`,
      (await page.locator(".take-canvas canvas").count()) === 0,
    );
    check(`failed ${label}: no unhandled errors`, errors.length === 0, errors);
    await page.close();
  }
  {
    const { page, errors } = await open();
    let release;
    const gate = new Promise((r) => {
      release = r;
    });
    let requested = false;
    await page.route(castChunk, async (route) => {
      requested = true;
      await gate;
      await route.continue();
    });
    await page.goto(`${BASE}/?hud#layanan`, { waitUntil: "domcontentloaded" });
    await wait(page, 2500);
    check(
      "delayed cast: does not reveal partial world",
      requested &&
        (await page.locator(".take").getAttribute("data-mode")) === "boot",
    );
    release();
    await ready(page);
    await wait(page, 600);
    check(
      "delayed cast: deep link opens with full leaflet",
      await fullCopy(page, "leaflet"),
    );
    check("delayed cast: no unhandled errors", errors.length === 0, errors);
    await page.close();
  }
  {
    const { page, errors } = await open();
    let release;
    const gate = new Promise((r) => {
      release = r;
    });
    await page.route("**/*.woff2", async (route) => {
      await gate;
      await route.continue();
    });
    await page.goto(`${BASE}/?hud`, { waitUntil: "domcontentloaded" });
    await page.waitForSelector('.take[data-mode="stills"]', { timeout: 26000 });
    check(
      "stalled fonts: timeout removes canvas",
      (await page.locator(".take-canvas canvas").count()) === 0,
    );
    release();
    await wait(page, 1500);
    check(
      "stalled fonts: late response does not revive world",
      (await page.locator(".take").getAttribute("data-mode")) === "stills" &&
        (await page.locator(".take-canvas canvas").count()) === 0,
    );
    check("stalled fonts: no unhandled errors", errors.length === 0, errors);
    await page.close();
  }
  {
    const { page, errors } = await open();
    let release;
    const gate = new Promise((r) => {
      release = r;
    });
    await page.route(castChunk, async (route) => {
      await gate;
      await route.continue();
    });
    await page.goto(`${BASE}/?hud`, { waitUntil: "domcontentloaded" });
    await page.waitForFunction(() => !!window.__world);
    const url = await page
      .locator('header a[href*="tentang"]')
      .first()
      .getAttribute("href");
    // A DOM click uses the app router even though the mobile menu link is collapsed.
    await page
      .locator(`header a[href="${url}"]`)
      .first()
      .evaluate((a) => a.click());
    await page.waitForURL("**/tentang");
    release();
    await wait(page, 2000);
    check(
      "navigate during cast load: world stays disposed",
      (await page.locator(".take-canvas canvas").count()) === 0,
    );
    check(
      "navigate during cast load: no unhandled errors",
      errors.length === 0,
      errors,
    );
    await page.close();
  }
  {
    const { page, errors } = await open();
    await page.goto(`${BASE}/en?hud&k=K4`, { waitUntil: "domcontentloaded" });
    await ready(page);
    await wait(page, 1000);
    check("English cold K4: full binder", await fullCopy(page, "binder"));
    for (const [width, height] of [
      [1280, 720],
      [768, 1024],
      [375, 812],
    ]) {
      await page.setViewportSize({ width, height });
      await page.evaluate(() => {
        const el = document.getElementById("beranda"),
          p = window.__world.keyP("K4");
        // tahap 7: the take is 20.4 screens of scroll on landscape and 22.95 on portrait; K4 is before the lobby,
        // where both run screen for screen with the world's 22.95-screen timeline
        const portrait = matchMedia("(max-aspect-ratio: 1/1)").matches,
          total = Number(
            el.style.getPropertyValue(portrait ? "--take-hp" : "--take"),
          );
        scrollTo(
          0,
          el.offsetTop +
            ((p * 22.95) / total) *
              (el.offsetHeight - el.querySelector("[data-stage]").clientHeight),
        );
        window.__world.world.jump(p);
      });
      await wait(page, 1500);
      check(
        `resize K4 ${width}x${height}: copy remains ready`,
        await fullCopy(page, "binder"),
      );
    }
    for (let i = 0; i < 2; i++) {
      await page.evaluate(() =>
        window.__world.world.renderer.forceContextLoss(),
      );
      if (i === 0) {
        await wait(page, 300);
        await page.evaluate(() =>
          window.__world.world.renderer.forceContextRestore(),
        );
        await wait(page, 1500);
      }
    }
    await page.waitForSelector('.take[data-mode="stills"]');
    check(
      "repeated context loss: usable binder fallback",
      await fullCopy(page, "binder"),
    );
    check(
      "English/resize/context loss: no runtime errors",
      errors.length === 0,
      errors,
    );
    await page.close();
  }
  {
    const { page, errors } = await open();
    let release;
    const gate = new Promise((r) => {
      release = r;
    });
    await page.route("**/brand/kreatekno-logo.webp", async (route) => {
      await gate;
      await route.continue();
    });
    await page.goto(`${BASE}/?hud&k=K3`, { waitUntil: "domcontentloaded" });
    await wait(page, 3500);
    check(
      "delayed leaflet texture: still booting",
      (await page.locator(".take").getAttribute("data-mode")) === "boot",
    );
    release();
    await ready(page);
    await wait(page, 600);
    check(
      "delayed leaflet texture: ready with copy",
      await fullCopy(page, "leaflet"),
    );
    check(
      "delayed leaflet texture: no runtime errors",
      errors.length === 0,
      errors,
    );
    await page.close();
  }
  {
    const { page, errors } = await open();
    const cdp = await page.context().newCDPSession(page);
    await cdp.send("Network.enable");
    await cdp.send("Network.setCacheDisabled", { cacheDisabled: true });
    await cdp.send("Network.emulateNetworkConditions", {
      offline: false,
      latency: 150,
      downloadThroughput: 200000,
      uploadThroughput: 93750,
    });
    await cdp.send("Emulation.setCPUThrottlingRate", { rate: 4 });
    await page.goto(`${BASE}/?hud&k=K3`, {
      waitUntil: "domcontentloaded",
      timeout: 60000,
    });
    await ready(page);
    await wait(page, 700);
    const stats = await page.evaluate(() => ({
      elapsed: performance.now(),
      cast: window.__world.world.stats().cast,
      ao: window.__world.aoDone(),
      fonts: document.fonts.status,
    }));
    check(
      "cold 1.6 Mbps/150ms/CPU4x: full leaflet",
      (await fullCopy(page, "leaflet")) &&
        stats.cast.done &&
        stats.ao &&
        stats.fonts === "loaded",
      stats,
    );
    check("cold slow load: no runtime errors", errors.length === 0, errors);
    await page.close();
  }
} finally {
  writeFileSync(
    join(OUT, "loading-results.json"),
    JSON.stringify(results, null, 2),
  );
  await browser.close();
}
