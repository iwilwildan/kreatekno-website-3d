// Pustaka P0: baseline of the Solusi shop before any module it shares with the library page is refactored.
// Records, per viewport and with reduced motion (no breathing, sway or tweens, so frames are deterministic):
// hero camera, lip gap, cashier on screen, draw calls and triangles, the 3D rack pass, Search served on the
// counter (boxes and tag rects), and a screenshot of each state. Run it before and after a refactor, then compare.
//
// Usage: BASE=http://localhost:3200 node tools/pustaka/solusi-baseline.mjs record <absolute scratch dir>
//        node tools/pustaka/solusi-baseline.mjs compare <before dir> <after dir>
// Screenshots stay in the scratch dir (never site/public or git).
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { isAbsolute, join } from "node:path";
import { launch } from "../render/lib.mjs";

const VIEWPORTS = [
  [1920, 1080],
  [1440, 900],
  [1280, 800],
  [1180, 820],
  [1024, 1366],
  [820, 1180],
  [768, 1024],
  [414, 896],
  [390, 844],
  [375, 812],
  [360, 740],
];
const TERM = "dokumen";
const NUMBER_TOLERANCE = 1e-3;
const PIXEL_TOLERANCE = 0.001; // share of pixels allowed to differ (> 8/255 on any channel)

const [command, ...rest] = process.argv.slice(2);
if (command === "record") await record(rest[0]);
else if (command === "compare") await compare(rest[0], rest[1]);
else throw new Error("Usage: record <dir> | compare <before> <after>");

async function settle(page) {
  // Two animation frames after the world reports it is idle.
  await page.evaluate(
    () =>
      new Promise((done) =>
        requestAnimationFrame(() => requestAnimationFrame(done)),
      ),
  );
}

function snapshot(page) {
  return page.evaluate(() => {
    const s = window.__solusi;
    return {
      mode: s.mode,
      focus: s.focus,
      dpr: s.dpr,
      camera: s.camera,
      stage: s.stage,
      lipGap: s.lipGap,
      cashierScreen: s.cashierScreen,
      cashierScale: s.cashierScale,
      triangles: s.triangles,
      renderTriangles: s.renderTriangles,
      drawCalls: s.drawCalls,
      pose: s.pose,
      registerX: s.registerX,
      boxes: s.boxes,
      rackVisible: s.rackVisible,
      rak: s.rak,
      tags: [...document.querySelectorAll("[data-box-tag]:not([hidden])")].map(
        (tag) => {
          const r = tag.getBoundingClientRect();
          return [r.left, r.top, r.width, r.height];
        },
      ),
    };
  });
}

async function record(dir) {
  if (!dir || !isAbsolute(dir))
    throw new Error("Pass an absolute scratch directory");
  mkdirSync(dir, { recursive: true });
  const base = process.env.BASE || "http://localhost:3200";
  const browser = await launch();
  const result = { base, term: TERM, views: {} };
  for (const [width, height] of VIEWPORTS) {
    const key = `${width}x${height}`;
    const page = await browser.newPage({
      viewport: { width, height },
      deviceScaleFactor: 1,
      hasTouch: width <= 1180,
      reducedMotion: "reduce",
    });
    const errors = [];
    page.on("pageerror", (e) => errors.push(e.message));
    page.on("console", (m) => {
      if (m.type() === "error" && !/_vercel|insights/.test(m.text()))
        errors.push(m.text());
    });
    await page.goto(`${base}/solusi`, { waitUntil: "networkidle" });
    await page.waitForFunction(
      () =>
        window.__solusi?.ready && document.querySelector(".solusi-world-ready"),
      null,
      { timeout: 60000 },
    );
    await page.evaluate(() => document.fonts.ready);
    await page.waitForTimeout(400); // crossfade 300 ms
    await settle(page);
    const view = { hero: await snapshot(page) };
    await page.screenshot({ path: join(dir, `${key}-hero.png`) });

    await page.locator(".tier").first().scrollIntoViewIfNeeded();
    await page.waitForTimeout(300);
    await settle(page);
    view.etalase = await snapshot(page);
    await page.screenshot({ path: join(dir, `${key}-etalase.png`) });

    await page.evaluate(() => {
      window.scrollTo(0, 0);
      window.location.hash = "cari";
    });
    await page.waitForFunction(
      () => window.__solusi?.mode === "cari" && window.__solusi.focus,
    );
    await page.locator(".receipt input").fill(TERM);
    await page.locator(".receipt-submit").click();
    await page.waitForFunction(
      () => {
        const s = window.__solusi;
        return (
          s?.boxes?.visible &&
          !s.boxes.moving &&
          document.querySelector("[data-box-tag]:not([hidden])")
        );
      },
      null,
      { timeout: 20000 },
    );
    await page.waitForTimeout(300);
    await settle(page);
    view.cari = await snapshot(page);
    await page.screenshot({ path: join(dir, `${key}-cari.png`) });
    view.errors = errors;
    result.views[key] = view;
    console.log(
      `${key}: lip ${view.hero.lipGap.toFixed(3)} px, hero ${view.hero.drawCalls} dc / ${view.hero.renderTriangles} tri, cari ${view.cari.boxes.count} boxes, errors ${errors.length}`,
    );
    await page.close();
  }
  await browser.close();
  writeFileSync(join(dir, "baseline.json"), JSON.stringify(result, null, 2));
  console.log(`saved ${join(dir, "baseline.json")}`);
}

function diffValues(path, a, b, out) {
  if (typeof a === "number" && typeof b === "number") {
    if (Math.abs(a - b) > NUMBER_TOLERANCE) out.push(`${path}: ${a} → ${b}`);
  } else if (Array.isArray(a) || (a && typeof a === "object")) {
    const keys = new Set([...Object.keys(a || {}), ...Object.keys(b || {})]);
    for (const k of keys) diffValues(`${path}.${k}`, a?.[k], b?.[k], out);
  } else if (a !== b)
    out.push(`${path}: ${JSON.stringify(a)} → ${JSON.stringify(b)}`);
}

async function compare(before, after) {
  const a = JSON.parse(readFileSync(join(before, "baseline.json"), "utf8"));
  const b = JSON.parse(readFileSync(join(after, "baseline.json"), "utf8"));
  const numbers = [];
  for (const key of Object.keys(a.views))
    diffValues(key, a.views[key], b.views[key], numbers);

  const browser = await launch();
  const page = await browser.newPage();
  const pixels = [];
  for (const key of Object.keys(a.views)) {
    for (const state of ["hero", "etalase", "cari"]) {
      const file = `${key}-${state}.png`;
      const share = await page.evaluate(
        async ([x, y]) => {
          const load = (src) =>
            new Promise((done, fail) => {
              const img = new Image();
              img.onload = () => done(img);
              img.onerror = fail;
              img.src = src;
            });
          const [ia, ib] = await Promise.all([load(x), load(y)]);
          if (ia.width !== ib.width || ia.height !== ib.height) return 1;
          const read = (img) => {
            const c = new OffscreenCanvas(img.width, img.height);
            const g = c.getContext("2d");
            g.drawImage(img, 0, 0);
            return g.getImageData(0, 0, img.width, img.height).data;
          };
          const da = read(ia);
          const db = read(ib);
          let changed = 0;
          for (let i = 0; i < da.length; i += 4) {
            if (
              Math.abs(da[i] - db[i]) > 8 ||
              Math.abs(da[i + 1] - db[i + 1]) > 8 ||
              Math.abs(da[i + 2] - db[i + 2]) > 8
            )
              changed += 1;
          }
          return changed / (da.length / 4);
        },
        [
          "data:image/png;base64," +
            readFileSync(join(before, file)).toString("base64"),
          "data:image/png;base64," +
            readFileSync(join(after, file)).toString("base64"),
        ],
      );
      if (share > PIXEL_TOLERANCE)
        pixels.push(`${file}: ${(share * 100).toFixed(3)}% pixels differ`);
    }
  }
  await browser.close();
  for (const line of numbers) console.log(`angka  ${line}`);
  for (const line of pixels) console.log(`piksel ${line}`);
  const ok = numbers.length === 0 && pixels.length === 0;
  console.log(
    ok
      ? "identik dalam toleransi"
      : `${numbers.length} selisih angka, ${pixels.length} selisih piksel`,
  );
  process.exitCode = ok ? 0 : 1;
}
