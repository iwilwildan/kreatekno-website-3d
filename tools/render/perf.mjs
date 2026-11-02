// First-load measurement of Home on a throttled phone profile (CPU 4× slower, 150 ms RTT, 1.6 Mbps down: the
// "slow 4G" profile Lighthouse uses for mobile). Reports LCP, JS transferred before and for the world, AO and
// still bytes, and when the 3D world crossfaded in. Run against a production build (site-prod, port 3100).
// Usage: BASE=http://localhost:3100 node render/perf.mjs [runs, default 3]
import { BASE, launch } from "./lib.mjs";

const RUNS = Number(process.argv[2] || 3);
const browser = await launch({ gpu: true });
const results = [];
for (let i = 0; i < RUNS; i++) {
  const ctx = await browser.newContext({ viewport: { width: 375, height: 812 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true });
  const page = await ctx.newPage();
  const cdp = await ctx.newCDPSession(page);
  await cdp.send("Network.enable");
  await cdp.send("Network.setCacheDisabled", { cacheDisabled: true });
  await cdp.send("Network.emulateNetworkConditions", {
    offline: false,
    latency: 150,
    downloadThroughput: (1.6 * 1024 * 1024) / 8,
    uploadThroughput: (750 * 1024) / 8,
  });
  await cdp.send("Emulation.setCPUThrottlingRate", { rate: 4 });
  const bytes = new Map();
  const kinds = new Map();
  cdp.on("Network.responseReceived", (e) => kinds.set(e.requestId, { url: e.response.url, t: e.timestamp }));
  cdp.on("Network.loadingFinished", (e) => {
    const k = kinds.get(e.requestId);
    if (k) bytes.set(e.requestId, { ...k, size: e.encodedDataLength });
  });
  await page.addInitScript(() => {
    window.__lcp = 0;
    new PerformanceObserver((l) => {
      for (const e of l.getEntries()) window.__lcp = e.startTime;
    }).observe({ type: "largest-contentful-paint", buffered: true });
  });
  const t0 = Date.now();
  await page.goto(BASE + "/", { waitUntil: "load" });
  await page.waitForFunction(() => document.querySelector(".take-canvas[data-live]"), null, { timeout: 120000 });
  const liveMs = Date.now() - t0;
  await page.waitForTimeout(1500);
  const lcp = await page.evaluate(() => window.__lcp);
  const sum = (f) => [...bytes.values()].filter(f).reduce((a, b) => a + b.size, 0) / 1024;
  const js = [...bytes.values()].filter((b) => /\.js(\?|$)/.test(b.url));
  results.push({
    lcp: Math.round(lcp),
    live: liveMs,
    jsTotal: +sum((b) => /\.js(\?|$)/.test(b.url)).toFixed(1),
    ao: +sum((b) => b.url.includes("/world/ao/")).toFixed(1),
    stills: +sum((b) => b.url.includes("/stills/")).toFixed(1),
    jsFiles: js.length,
  });
  await ctx.close();
}
await browser.close();
console.table(results);
