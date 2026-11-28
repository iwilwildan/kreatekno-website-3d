// BJ1 QA: Booking Jasa motion graphic (same checks as og5-qa.mjs). Scene poses, scroll back, night, reduced motion,
// GSAP failure, EN, overflow. BJ2 (28 Nov 2026): eleven scenes (approval, takeover, summary), eight rail nodes.
// Usage: node --import ./tools/solusi/register.mjs tools/solusi/bj1-qa.mjs <output directory>
// (screenshots stay in that directory, never in the repo)
import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { setTimeout as wait } from "node:timers/promises";
import { launch } from "../render/lib.mjs";
import { BOOKING_JASA } from "../../site/components/solusi/detail/ceritaTiming.ts";

const { SC, START, TOTAL, restTime } = BOOKING_JASA;

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
  [".og-pile", ".og-count", ".og-tag"],
  [".bj-ask", ".bj-ask .og-ring", ".bj-clock"],
  [".bj-ask", ".bj-chips .og-chip", ".bj-reply"],
  [".bj-day", ".bj-slot.is-pick", ".bj-rules li", ".bj-offer"],
  [".bj-loc", ".bj-card", ".bj-ok"],
  [".bj-tbl", ".bj-tr.is-new", ".bj-toast"],
  [
    ".bj-tbl",
    ".bj-req",
    ".bj-req .bj-tick",
    ".bj-decided",
    ".bj-done",
    ".bj-tr.is-new .og-now",
  ],
  [".bj-tk-ask", ".bj-tk-staff", ".bj-pause", ".bj-tk-price", ".bj-tk-agree"],
  [
    ".bj-tbl",
    ".bj-sum",
    ".bj-sum .bj-tick",
    ".bj-svc-now",
    ".bj-tr.is-new .og-now",
  ],
  [".og-mx", ".og-m"],
  [".og-mx"],
];
const HIDDEN = [
  [".bj-ask", ".bj-tbl", ".og-m", ".bj-card"],
  [".og-pile", ".og-count", ".bj-chips .og-chip"],
  [".bj-clock", ".bj-day", ".og-pile"],
  [".bj-ask", ".bj-reply", ".bj-chips .og-chip", ".bj-card"],
  [".bj-day", ".bj-offer", ".bj-tbl"],
  [".bj-card", ".bj-loc", ".bj-req", ".bj-tr.is-new .og-now"],
  [
    ".bj-toast",
    ".bj-ask2",
    ".bj-tr.is-new .og-was",
    ".bj-tap",
    ".bj-pause",
    ".bj-sum",
  ],
  [".bj-tbl", ".bj-req", ".bj-done", ".bj-sum"],
  [".bj-tk-staff", ".bj-pause", ".bj-req", ".bj-svc-was"],
  [".bj-tbl", ".bj-req", ".bj-sum"],
  [".bj-tbl", ".bj-sum"],
];

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
    ({ EXPECT, HIDDEN }) => {
      const cv = document.querySelector(".bj-cv");
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
      if (scene >= 1 && scene <= 8 && node !== scene - 1)
        missing.push(`rail node ${node}`);
      const extra = HIDDEN[scene].filter((sel) => shown(sel));
      return {
        scene,
        film: cv.classList.contains("is-film"),
        missing,
        extra,
        stage,
        sw: document.documentElement.scrollWidth,
      };
    },
    { EXPECT, HIDDEN },
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
    `${base}${locale}/${locale ? "solutions" : "solusi"}/booking-jasa`,
    { waitUntil: "networkidle" },
  );
  if (!blockGsap) {
    // GSAP loads when the story nears the viewport (after a font wait of up to 1.5 s): wait for it,
    // so the first check measures the film and not the static pose or the first smoothing tween.
    await pg.evaluate(() =>
      document.querySelector(".story-reel").scrollIntoView(),
    );
    await pg.waitForSelector(".bj-cv.is-film", { timeout: 15000 });
    await pg.evaluate(() => scrollTo(0, 0));
    await wait(700);
  }
  return { context, page: pg };
}

// 1. Scene poses on every viewport, forward then back.
for (const [name, viewport] of Object.entries(VIEWPORTS)) {
  const { context, page: pg } = await page(viewport);
  for (let i = 0; i < 11; i++) {
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
  for (const i of [9, 7, 3, 0, 8, 6, 1]) {
    await goScene(pg, i);
    const r = await pose(pg);
    check(
      `${name} jump back to scene ${i + 1}`,
      r.scene === i && !r.missing.length && !r.extra.length,
      JSON.stringify(r),
    );
  }
  const rail = await pg.evaluate(() => {
    const flow = document.querySelector(".story-flow").getBoundingClientRect();
    const nodes = [...document.querySelectorAll(".story-node")].map((n) =>
      n.getBoundingClientRect(),
    );
    const overlap = nodes.some(
      (n, i) => i > 0 && n.left < nodes[i - 1].right - 0.5,
    );
    return {
      count: nodes.length,
      inside: nodes.every(
        (n) => n.left >= flow.left - 0.5 && n.right <= flow.right + 0.5,
      ),
      overlap,
    };
  });
  check(
    `${name} rail has 8 nodes inside the flow`,
    rail.count === 8 && rail.inside && !rail.overlap,
    JSON.stringify(rail),
  );
  await goScene(pg, 1);
  const night = await pose(pg);
  check(
    `${name} night background at the late-night message`,
    night.stage === "rgb(59, 63, 134)",
    night.stage,
  );
  await goScene(pg, 2);
  await wait(400);
  const day = await pose(pg);
  check(
    `${name} day background at the answer`,
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
  for (const i of [0, 4, 6, 7, 8, 10, 2]) {
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
  for (let i = 0; i < 11; i++) {
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
  const text = await pg.locator(".bj-ask").innerText();
  check(
    "EN stage copy",
    /sofa wash/.test(text) && /Maya/.test(text),
    text.slice(0, 120),
  );
  await pg.screenshot({ path: join(out, "en-3.png") });
  await goScene(pg, 7);
  const pauseText = await pg.locator(".bj-pause").innerText();
  check("EN takeover pause copy", /paused/.test(pauseText), pauseText);
  await goScene(pg, 8);
  const sumText = await pg.locator(".bj-sum").innerText();
  check("EN summary copy", /Rp400,000/.test(sumText), sumText.slice(0, 120));
  await pg.screenshot({ path: join(out, "en-9.png") });
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
