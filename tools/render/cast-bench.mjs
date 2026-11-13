// Warm production benchmark for one cast member. Reports median/p95 build time and geometry budget.
// Usage: node tools/render/cast-bench.mjs NAME [runs]
import { BASE, launch, open } from "./lib.mjs";

const name = process.argv[2] || "heruKasir";
const runs = Number(process.argv[3] || 7);
const browser = await launch();
const times = [];
let geometry = null;
for (let index = 0; index < runs; index++) {
  const { page, errors } = await open(
    browser,
    `${BASE}/?lab=${name}&view=pose&flat`,
    { width: 900, height: 720 },
  );
  await page.waitForFunction(() => window.__lab?.ready, null, {
    timeout: 120000,
    polling: 100,
  });
  const info = await page.evaluate(() => window.__lab.info);
  times.push(info.buildMs);
  geometry = { triangles: info.triangles, calls: info.calls };
  const unexpected = errors.filter(
    (message) => !message.includes("Failed to load resource"),
  );
  if (unexpected.length) throw new Error(unexpected.join("\n"));
  await page.close();
}
await browser.close();
times.sort((a, b) => a - b);
const percentile = (p) =>
  times[Math.min(times.length - 1, Math.floor((times.length - 1) * p))];
console.log({
  name,
  runs,
  times,
  medianMs: percentile(0.5),
  p95Ms: percentile(0.95),
  ...geometry,
});
