// RK1 QA: Riset Konten motion graphic (same checks as bj1-qa.mjs). Scene poses, scroll back, night, reduced
// motion, GSAP failure, EN, overflow, plus the post sort and no overlap between stacked objects.
// Usage: node --import ./tools/solusi/register.mjs tools/solusi/rk1-qa.mjs <output directory>
// (screenshots stay in that directory, never in the repo)
import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { setTimeout as wait } from "node:timers/promises";
import { launch } from "../render/lib.mjs";
import { RISET_KONTEN } from "../../site/components/solusi/detail/ceritaTiming.ts";

const { SC, START, TOTAL, restTime } = RISET_KONTEN;

const base = process.env.BASE || "http://localhost:3000";
const out = process.argv[2];
if (!out) throw new Error("Pass an output directory");
mkdirSync(out, { recursive: true });

const browser = await launch({ gpu: false });
const report = { checks: [], errors: [], gsapBytes: 0 };
const check = (name, ok, detail = "") =>
  report.checks.push({ name, ok: Boolean(ok), detail });

const VIEWPORTS = {
  desktop: { width: 1440, height: 900 },
  wide: { width: 1897, height: 940 },
  tablet: { width: 1024, height: 1366 },
  phone: { width: 390, height: 844 },
  small: { width: 360, height: 740 },
};

// Visible objects expected at the end of each scene (opacity > .5 and visibility visible).
const EXPECT = [
  [".rk-note", ".og-count"],
  [".rk-topics", ".rk-sel", ".rk-clock"],
  [".rk-topic", ".rk-sum", ".rk-kws .og-chip"],
  [".rk-kws .og-chip", ".rk-post", ".rk-sort"],
  [".rk-ana", ".rk-cmp li", ".rk-angle"],
  [".rk-tbl", ".rk-tr.is-new", ".rk-tr.is-new .og-was"],
  [".rk-tbl", ".rk-ntf", ".bj-tick", ".rk-tr.is-new .og-now"],
  [".og-mx", ".og-m"],
  [".og-mx"],
];
const HIDDEN = [
  [".rk-topics", ".rk-sum", ".og-m", ".rk-tbl"],
  [".rk-note", ".og-count", ".rk-sum"],
  [".rk-clock", ".rk-topics", ".rk-post"],
  [".rk-sum", ".rk-topic", ".rk-ana"],
  [".rk-post", ".rk-kws .og-chip", ".rk-tbl"],
  [".rk-ana", ".rk-ntf", ".rk-tr.is-new .og-now"],
  [".rk-ana", ".rk-tr.is-new .og-was"],
  [".rk-tbl", ".rk-ntf"],
  [".rk-tbl"],
];
// Objects that share a scene and must not overlap (upper, lower).
const STACK = {
  2: [
    [".rk-topic", ".rk-sum"],
    [".rk-sum", ".rk-kws"],
  ],
  3: [
    [".rk-kws", ".rk-posts"],
    [".rk-posts", ".rk-sort"],
  ],
  5: [[".rk-tbl", ".rk-ntf"]],
  6: [[".rk-tbl", ".rk-ntf"]],
};

// Scroll the Tonton reel to a timeline time: "rest" = mid reading hold, "start" = just after the scene starts.
async function goScene(page, i, at = "rest") {
  const t = at === "rest" ? restTime(i) : START[i] + SC[i].in * 0.5 + 0.02;
  await page.evaluate(
    ({ t, total }) => {
      const reel = document.querySelector(".story-reel");
      const top = scrollY + reel.getBoundingClientRect().top;
      scrollTo(0, top + (t / total) * (reel.offsetHeight - innerHeight));
    },
    { t, total: TOTAL },
  );
  await wait(1100);
}

async function pose(page) {
  return page.evaluate(
    ({ EXPECT, HIDDEN, STACK }) => {
      const cv = document.querySelector(".rk-cv");
      const scene = Number(cv.dataset.scene);
      const shown = (sel) => {
        const el = cv.querySelector(sel);
        if (!el) return false;
        let node = el;
        while (node && node !== cv) {
          const cs = getComputedStyle(node);
          if (
            cs.visibility === "hidden" ||
            Number(cs.opacity) < 0.5 ||
            cs.display === "none"
          )
            return false;
          node = node.parentElement;
        }
        return true;
      };
      const stage = getComputedStyle(
        document.querySelector(".story-stage"),
      ).backgroundColor;
      const live = [...document.querySelectorAll(".story-caps > li")].findIndex(
        (li) => getComputedStyle(li).visibility === "visible",
      );
      const node = [...document.querySelectorAll(".story-node")].findIndex(
        (n) => n.dataset.s === "on",
      );
      const missing = EXPECT[scene].filter((sel) => !shown(sel));
      if (live !== scene) missing.push(`caption ${live}`);
      if (scene >= 1 && scene <= 6 && node !== scene - 1)
        missing.push(`rail node ${node}`);
      const extra = HIDDEN[scene].filter((sel) => shown(sel));
      const box = (sel) => cv.querySelector(sel).getBoundingClientRect();
      for (const [a, b] of STACK[scene] || [])
        if (shown(a) && shown(b) && box(a).bottom > box(b).top + 1)
          missing.push(`overlap ${a} / ${b}`);
      // Every canvas object stays inside the canvas.
      const frame = cv.getBoundingClientRect();
      for (const el of cv.children) {
        const r = el.getBoundingClientRect();
        const cs = getComputedStyle(el);
        if (cs.visibility === "hidden" || Number(cs.opacity) < 0.5 || !r.width)
          continue;
        if (
          r.left < frame.left - 2 ||
          r.right > frame.right + 2 ||
          r.bottom > frame.bottom + 2
        )
          missing.push(`outside ${el.className}`);
      }
      if (scene === 3) {
        const posts = [...cv.querySelectorAll(".rk-post")].map((el) => ({
          top: Math.round(el.getBoundingClientRect().top),
          left: Math.round(el.getBoundingClientRect().left),
          op: Number(getComputedStyle(el).opacity),
        }));
        const rank = (p) => p.top * 10000 + p.left;
        if (!posts.every((p, k) => k === 0 || rank(posts[k - 1]) < rank(p)))
          missing.push("posts not sorted by likes");
        if (!(posts[5].op < 0.5 && posts[3].op > 0.9))
          missing.push("weakest posts not dimmed");
      }
      return {
        scene,
        film: cv.classList.contains("is-film"),
        missing,
        extra,
        stage,
        sw: document.documentElement.scrollWidth,
      };
    },
    { EXPECT, HIDDEN, STACK },
  );
}

async function page(
  viewport,
  { reduced = false, blockGsap = false, locale = "" } = {},
) {
  const context = await browser.newContext({
    viewport,
    reducedMotion: reduced ? "reduce" : "no-preference",
  });
  const pg = await context.newPage();
  pg.on("pageerror", (error) =>
    report.errors.push(`${viewport.width}: ${error.message}`),
  );
  pg.on(
    "console",
    (msg) =>
      msg.type() === "error" &&
      report.errors.push(`${viewport.width}: ${msg.text()}`),
  );
  await pg.route("**/*.js", async (route) => {
    const response = await route.fetch();
    const body = await response.text();
    const isGsap =
      body.includes("GreenSock") || body.includes("gsap.com/standard-license");
    if (isGsap)
      report.gsapBytes = Math.max(report.gsapBytes, Buffer.byteLength(body));
    if (blockGsap && isGsap) return route.abort();
    return route.fulfill({ response, body });
  });
  await pg.goto(
    `${base}${locale}/${locale ? "solutions" : "solusi"}/riset-konten`,
    { waitUntil: "networkidle" },
  );
  if (!blockGsap) {
    // GSAP loads when the story nears the viewport (after a font wait of up to 1.5 s): wait for it,
    // so the first check measures the film and not the static pose or the first smoothing tween.
    await pg.evaluate(() =>
      document.querySelector(".story-reel").scrollIntoView(),
    );
    await pg.waitForSelector(".rk-cv.is-film", { timeout: 15000 });
    await pg.evaluate(() => scrollTo(0, 0));
    await wait(700);
  }
  return { context, page: pg };
}

// 1. Scene poses on every viewport, forward then back.
for (const [name, viewport] of Object.entries(VIEWPORTS)) {
  const { context, page: pg } = await page(viewport);
  for (let i = 0; i < 9; i++) {
    await goScene(pg, i);
    const r = await pose(pg);
    check(
      `${name} scene ${i + 1} forward`,
      r.scene === i &&
        r.film &&
        !r.missing.length &&
        !r.extra.length &&
        r.sw <= viewport.width,
      JSON.stringify(r),
    );
    if (name === "desktop" || name === "phone")
      await pg.screenshot({ path: join(out, `${name}-${i + 1}.png`) });
  }
  for (const i of [7, 3, 0, 6, 1]) {
    await goScene(pg, i);
    const r = await pose(pg);
    check(
      `${name} jump back to scene ${i + 1}`,
      r.scene === i && !r.missing.length && !r.extra.length,
      JSON.stringify(r),
    );
  }
  await goScene(pg, 1);
  const night = await pose(pg);
  check(
    `${name} night background at the evening session`,
    night.stage === "rgb(59, 63, 134)",
    night.stage,
  );
  await goScene(pg, 2);
  await wait(400);
  const day = await pose(pg);
  check(
    `${name} day background at the trend summary`,
    day.stage === "rgb(233, 228, 248)",
    day.stage,
  );
  await context.close();
}

// 1b. Rail node and next/previous buttons jump to their scene.
{
  const { context, page: pg } = await page(VIEWPORTS.desktop);
  await pg.locator(".story-node").nth(2).click();
  await wait(2000);
  let r = await pose(pg);
  check(
    "rail node 3 jumps to scene 4",
    r.scene === 3 && !r.missing.length,
    JSON.stringify(r),
  );
  await pg.locator(".story-ctrl button").nth(1).click();
  await wait(2000);
  r = await pose(pg);
  check(
    "next button goes to scene 5",
    r.scene === 4 && !r.missing.length,
    JSON.stringify(r),
  );
  await pg.locator(".story-ctrl button").nth(0).click();
  await wait(2000);
  r = await pose(pg);
  check("previous button returns to scene 4", r.scene === 3, JSON.stringify(r));
  await context.close();
}

// 2. Reduced motion: jumps straight to each scene's end pose.
{
  const { context, page: pg } = await page(VIEWPORTS.phone, { reduced: true });
  for (const i of [0, 4, 8, 2]) {
    await goScene(pg, i, "start");
    const r = await pose(pg);
    check(
      `reduced motion scene ${i + 1} end pose at segment start`,
      r.scene === i && !r.missing.length && !r.extra.length,
      JSON.stringify(r),
    );
  }
  await context.close();
}

// 3. GSAP blocked: static CSS poses from data-scene.
for (const [name, viewport] of [
  ["desktop", VIEWPORTS.desktop],
  ["phone", VIEWPORTS.phone],
]) {
  const { context, page: pg } = await page(viewport, { blockGsap: true });
  for (let i = 0; i < 9; i++) {
    await goScene(pg, i);
    const r = await pose(pg);
    check(
      `${name} without GSAP scene ${i + 1}`,
      r.scene === i && !r.film && !r.missing.length && !r.extra.length,
      JSON.stringify(r),
    );
  }
  await pg.screenshot({ path: join(out, `${name}-nogsap-7.png`) });
  await context.close();
}

// 4. EN copy on the stage.
{
  const { context, page: pg } = await page(VIEWPORTS.desktop, {
    locale: "/en",
  });
  await goScene(pg, 2);
  const text = await pg.locator(".rk-sum").innerText();
  const caption = await pg.locator(".story-caps > li.is-live h3").innerText();
  check(
    "EN stage copy",
    /working capital/.test(text) && /AI summarises/.test(caption),
    `${text.slice(0, 80)} | ${caption}`,
  );
  await pg.screenshot({ path: join(out, "en-3.png") });
  await context.close();
}

await browser.close();
const failed = report.checks.filter((c) => !c.ok);
writeFileSync(join(out, "report.json"), JSON.stringify(report, null, 2));
console.log(
  `${report.checks.length - failed.length}/${report.checks.length} passed; gsap chunk ${report.gsapBytes} bytes; errors ${report.errors.length}`,
);
for (const c of failed) console.log("FAIL", c.name, c.detail);
for (const e of report.errors.slice(0, 10)) console.log("ERR", e);
