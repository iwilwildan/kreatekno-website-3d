// Pustaka P3: the cashier's behaviour on /solusi in normal motion (the reduced-motion baseline in
// solusi-baseline.mjs never runs it), recorded before and after the character controller moves to
// world/meja/tokoh.ts. Per viewport it records the pose sequence (consecutive duplicates collapsed) for:
// arriving, opening Cari (wave), typing (ready), a search with results (ready → lift), "search again" (lift),
// an empty search (shrug), and back to the shop; then a click on the cashier (hit reaction and how long it
// lasts) and, with a fine pointer, where the head turns for two mouse positions.
//
// Usage: BASE=http://localhost:3200 node tools/pustaka/solusi-tokoh.mjs record <absolute dir>
//        node tools/pustaka/solusi-tokoh.mjs compare <before dir> <after dir>
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { isAbsolute, join } from "node:path";
import { launch } from "../render/lib.mjs";

const VIEWPORTS = [
  [1440, 900, false],
  [390, 844, true],
];
const [command, ...rest] = process.argv.slice(2);
if (command === "record") await record(rest[0]);
else if (command === "compare") compare(rest[0], rest[1]);
else throw new Error("Usage: record <dir> | compare <before> <after>");

/** Samples __solusi.pose every frame for ms milliseconds; returns the distinct poses in order. */
function watch(page, ms) {
  return page.evaluate(
    (ms) =>
      new Promise((done) => {
        const seq = [];
        const t0 = performance.now();
        const tick = () => {
          const p = window.__solusi.pose;
          if (seq[seq.length - 1] !== p) seq.push(p);
          if (performance.now() - t0 < ms) requestAnimationFrame(tick);
          else done(seq);
        };
        tick();
      }),
    ms,
  );
}

async function record(dir) {
  if (!dir || !isAbsolute(dir)) throw new Error("Pass an absolute directory");
  mkdirSync(dir, { recursive: true });
  const base = process.env.BASE || "http://localhost:3200";
  const browser = await launch();
  const out = {};
  for (const [width, height, touch] of VIEWPORTS) {
    const key = `${width}x${height}`;
    const page = await browser.newPage({
      viewport: { width, height },
      hasTouch: touch,
      isMobile: touch,
    });
    const errors = [];
    page.on("pageerror", (e) => errors.push(e.message));
    page.on("console", (m) => {
      if (
        m.type() === "error" &&
        !/_vercel|insights|Failed to load resource/.test(m.text())
      )
        errors.push(m.text());
    });
    await page.goto(`${base}/solusi`, { waitUntil: "networkidle" });
    await page.waitForFunction(
      () =>
        window.__solusi?.ready && document.querySelector(".solusi-world-ready"),
      null,
      {
        timeout: 60000,
      },
    );
    const v = { reduced: await page.evaluate(() => window.__solusi.reduced) };
    v.arrive = await watch(page, 800);
    await page.evaluate(() => (window.location.hash = "cari"));
    v.openCari = await watch(page, 1800);
    await page.locator(".receipt input").first().click();
    await page
      .locator(".receipt input")
      .first()
      .pressSequentially("dok", { delay: 40 });
    v.typing = await watch(page, 700);
    await page.locator(".receipt input").first().fill("dokumen");
    await page.locator(".receipt-submit").click();
    v.results = await watch(page, 2000);
    await page.locator(".result-bar button").first().click();
    v.again = await watch(page, 1200);
    await page.locator(".receipt input").first().fill("zzqqxxk");
    await page.locator(".receipt-submit").click();
    v.empty = await watch(page, 1600);
    await page.evaluate(() => {
      history.pushState(null, "", location.pathname);
      window.dispatchEvent(new PopStateEvent("popstate"));
      window.scrollTo(0, 0);
    });
    v.shop = await watch(page, 1000);
    // click the cashier's chest
    await page.waitForTimeout(600);
    const at = await page.evaluate(() => window.__solusi.cashierScreen);
    await page.mouse.click(at.x, at.y);
    v.hit = await page.evaluate(
      () =>
        new Promise((done) => {
          const t0 = performance.now();
          let first = -1,
            last = -1;
          const tick = () => {
            const t = performance.now() - t0;
            if (window.__solusi.hit) {
              if (first < 0) first = t;
              last = t;
            }
            if (t < 1400) requestAnimationFrame(tick);
            else
              done({
                seen: first >= 0,
                lastsMs: Math.round((last - first) / 100) * 100,
              });
          };
          tick();
        }),
    );
    if (!touch) {
      v.head = [];
      for (const [x, y] of [
        [width * 0.95, height * 0.2],
        [width * 0.4, height * 0.7],
      ]) {
        await page.mouse.move(x, y);
        await page.waitForTimeout(1500);
        const h = await page.evaluate(() => window.__solusi.head);
        v.head.push({ yaw: +h.yaw.toFixed(2), pitch: +h.pitch.toFixed(2) });
      }
    }
    v.errors = errors;
    out[key] = v;
    console.log(key, JSON.stringify(v));
    await page.close();
  }
  await browser.close();
  writeFileSync(join(dir, "tokoh.json"), JSON.stringify(out, null, 2));
}

/**
 * Pose sequences as the behaviour, not the frame timing: SwiftShader draws ±8 fps, so the first sample of a step
 * may still show the pose the previous step ended in, and the "ready" the typed term gives before a search may be
 * too short to be drawn. Both are dropped before comparing (P5).
 */
function normalize(view) {
  const STEPS = [
    "arrive",
    "openCari",
    "typing",
    "results",
    "again",
    "empty",
    "shop",
  ];
  const out = { ...view };
  let previous = null;
  for (const step of STEPS) {
    let seq = [...(view[step] || [])];
    if (seq.length > 1 && seq[0] === previous) seq = seq.slice(1);
    if (
      (step === "results" || step === "empty") &&
      seq.length > 1 &&
      seq[0] === "ready"
    )
      seq = seq.slice(1);
    if (step === "typing" && seq.length > 1 && seq[0] === "idle")
      seq = seq.slice(1);
    previous = view[step]?.at(-1) ?? previous;
    out[step] = seq;
  }
  return out;
}

function compare(a, b) {
  const read = (dir) =>
    Object.fromEntries(
      Object.entries(
        JSON.parse(readFileSync(join(dir, "tokoh.json"), "utf8")),
      ).map(([k, v]) => [k, normalize(v)]),
    );
  const A = read(a);
  const B = read(b);
  let same = true;
  for (const key of Object.keys(A))
    for (const k of Object.keys(A[key])) {
      const a = A[key][k],
        b = B[key]?.[k];
      // frame timing: the hit lasts ±150 ms, the head settles within ±0.03 rad
      const eq =
        k === "hit"
          ? a.seen === b?.seen && Math.abs(a.lastsMs - b.lastsMs) <= 150
          : k === "head"
            ? a.every(
                (h, i) =>
                  Math.abs(h.yaw - b?.[i]?.yaw) <= 0.03 &&
                  Math.abs(h.pitch - b?.[i]?.pitch) <= 0.03,
              )
            : JSON.stringify(a) === JSON.stringify(b);
      same &&= eq;
      console.log(
        eq ? "sama" : "BEDA",
        key,
        k,
        eq
          ? JSON.stringify(A[key][k])
          : JSON.stringify([A[key][k], B[key]?.[k]]),
      );
    }
  console.log(same ? "SEMUA SAMA" : "ADA PERBEDAAN");
  process.exit(same ? 0 : 1);
}
