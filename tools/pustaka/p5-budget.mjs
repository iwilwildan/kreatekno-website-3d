// Pustaka P5: the budget of the library page on the production build.
// - JavaScript: gzip size of the chunks /artikel loads, and of the 3D world chunk with three (target ≤ 230 KB).
// - Andi's build time in the page (7 loads, median and p95; target ≤ 150 ms), with the GPU.
// - Mobile LCP of /artikel (and /solusi for comparison): 390x844, CPU slowed 4x and a slow 4G network through CDP,
//   LCP from PerformanceObserver, 5 loads each, median (target < 2.5 s). Lab numbers, not field data.
// Usage: BASE=http://localhost:3200 node tools/pustaka/p5-budget.mjs
import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { gzipSync } from "node:zlib";
import { launch, SITE } from "../render/lib.mjs";

const base = process.env.BASE || "http://localhost:3200";
const CHUNKS = join(SITE, ".next", "static", "chunks");
const gz = (file) => gzipSync(readFileSync(file)).length;
const kb = (n) => Math.round(n / 102.4) / 10;
const median = (a) =>
  [...a].sort((x, y) => x - y)[Math.floor((a.length - 1) / 2)];
const p95 = (a) =>
  [...a].sort((x, y) => x - y)[
    Math.min(a.length - 1, Math.floor((a.length - 1) * 0.95))
  ];

// ---------- JavaScript ----------
const browser = await launch({ gpu: true });
{
  const page = await browser.newPage({
    viewport: { width: 1440, height: 900 },
  });
  const scripts = new Set();
  page.on("response", (r) => {
    const u = new URL(r.url());
    if (
      u.pathname.startsWith("/_next/static/chunks/") &&
      u.pathname.endsWith(".js")
    )
      scripts.add(u.pathname);
  });
  await page.goto(`${base}/artikel`, { waitUntil: "networkidle" });
  await page.waitForFunction(
    () => document.querySelector(".pustaka-world-ready"),
    null,
    { timeout: 60000 },
  );
  await page.waitForTimeout(500);
  const files = [...scripts].map((p) =>
    join(SITE, ".next", p.replace("/_next/", "")),
  );
  const sizes = files.map((f) => ({
    f: f.split(/[\\/]/).pop(),
    gz: gz(f),
    src: readFileSync(f, "utf8"),
  }));
  const world = sizes.filter(
    (s) => s.src.includes("pustaka-gl") || s.src.includes("WebGLRenderer"),
  );
  console.log(
    "JS /artikel total gzip",
    kb(sizes.reduce((a, s) => a + s.gz, 0)),
    "KB in",
    sizes.length,
    "files",
  );
  console.log(
    "3D world chunks (pustaka + three):",
    world.map((s) => `${s.f} ${kb(s.gz)} KB`).join(", "),
    "= ",
    kb(world.reduce((a, s) => a + s.gz, 0)),
    "KB (target ≤ 230)",
  );
  await page.close();
  void readdirSync(CHUNKS);
}

// ---------- Andi's build time ----------
{
  const times = [];
  for (let i = 0; i < 7; i++) {
    const page = await browser.newPage({
      viewport: { width: 1440, height: 900 },
    });
    await page.goto(`${base}/artikel`, { waitUntil: "networkidle" });
    await page.waitForFunction(() => window.__pustaka?.ready, null, {
      timeout: 60000,
    });
    times.push(await page.evaluate(() => window.__pustaka.buildMs));
    await page.close();
  }
  console.log(
    "Andi build ms",
    times.join(", "),
    "median",
    median(times),
    "p95",
    p95(times),
    "(target ≤ 150)",
  );
}

// ---------- mobile LCP ----------
for (const path of ["/artikel", "/solusi"]) {
  const lcps = [];
  for (let i = 0; i < 5; i++) {
    const context = await browser.newContext({
      viewport: { width: 390, height: 844 },
      isMobile: true,
      hasTouch: true,
    });
    const page = await context.newPage();
    const cdp = await context.newCDPSession(page);
    await cdp.send("Network.enable");
    await cdp.send("Network.emulateNetworkConditions", {
      offline: false,
      latency: 150,
      downloadThroughput: (1.6 * 1024 * 1024) / 8,
      uploadThroughput: (750 * 1024) / 8,
    });
    await cdp.send("Emulation.setCPUThrottlingRate", { rate: 4 });
    await page.addInitScript(() => {
      window.__lcp = 0;
      new PerformanceObserver((list) => {
        for (const e of list.getEntries()) window.__lcp = e.startTime;
      }).observe({ type: "largest-contentful-paint", buffered: true });
    });
    await page.goto(`${base}${path}`, { waitUntil: "load" });
    await page.waitForTimeout(3000);
    // LCP stops at the first input; read it now
    lcps.push(Math.round(await page.evaluate(() => window.__lcp)));
    await context.close();
  }
  console.log(
    `LCP ${path} ms`,
    lcps.join(", "),
    "median",
    median(lcps),
    "(target < 2500)",
  );
}
await browser.close();
