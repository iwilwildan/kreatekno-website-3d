// OG5/OG5b QA: Order Grup motion graphic. Scene poses, scroll back, reduced motion, GSAP failure, EN, overflow, chunk size.
// Usage: node --import ./tools/solusi/register.mjs tools/solusi/og5-qa.mjs <output directory>
// (screenshots stay in that directory, never in the repo)
import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { setTimeout as wait } from "node:timers/promises";
import { launch } from "../render/lib.mjs";
import {
  SC,
  START,
  TOTAL,
  restTime,
} from "../../site/components/solusi/detail/ceritaTiming.ts";

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
  [".og-order", ".og-ring"],
  [".og-order", ".og-chip"],
  [".og-tbl", ".og-c-customer", ".og-now"],
  [".og-tbl", ".og-reply"],
  [".og-tbl", ".og-k1", ".og-st.is-live .og-s-done"],
  [".og-ntf", ".og-ntf dd"],
  [".og-mx", ".og-m"],
  [".og-mx"],
];
const HIDDEN = [
  [".og-tbl", ".og-chip", ".og-ntf", ".og-m"],
  [".og-pile", ".og-count", ".og-chip"],
  [".og-ring", ".og-tbl", ".og-pile"],
  [".og-order", ".og-chip", ".og-was"],
  [".og-k0", ".og-st.is-live .og-s-done"],
  [".og-ntf", ".og-st.is-live .og-s-new"],
  [".og-tbl", ".og-reply", ".og-m"],
  [".og-ntf", ".og-tbl"],
  [".og-ntf"],
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
      const cv = document.querySelector(".og-cv");
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
    `${base}${locale}/${locale ? "solutions" : "solusi"}/order-grup`,
    { waitUntil: "networkidle" },
  );
  if (!blockGsap) {
    // GSAP loads when the story nears the viewport (after a font wait of up to 1.5 s): wait for it,
    // so the first check measures the film and not the static pose or the first smoothing tween.
    await pg.evaluate(() =>
      document.querySelector(".story-reel").scrollIntoView(),
    );
    await pg.waitForSelector(".og-cv.is-film", { timeout: 15000 });
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
  await goScene(pg, 6);
  const night = await pose(pg);
  check(
    `${name} night background at recap`,
    night.stage === "rgb(59, 63, 134)",
    night.stage,
  );
  await goScene(pg, 7);
  await wait(400);
  const day = await pose(pg);
  check(
    `${name} day background at results`,
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
  const text = await pg.locator(".og-order").innerText();
  check(
    "EN stage copy",
    /600ml water/.test(text) && /Andi/.test(text),
    text.slice(0, 120),
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
