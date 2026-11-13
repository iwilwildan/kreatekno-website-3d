// S4 greybox camera/lip/cashier capture at the 11 canonical viewports.
// Usage: BASE=http://localhost:3001 node tools/solusi/s4-greybox.mjs <output directory>
import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { launch } from "../render/lib.mjs";

const base = process.env.BASE || "http://localhost:3000";
const out = process.argv[2];
if (!out) throw new Error("Pass an output directory");
mkdirSync(out, { recursive: true });

const expected = [
  [1920, 1080, 800, 0.32, 2.429, 6.5, 35],
  [1440, 900, 792, 0.32, 2.428, 6.5, 35],
  [1280, 800, 704, 0.32, 2.425, 6.5, 35],
  [1180, 820, 721.6, 0.32, 2.426, 6.5, 35],
  [1024, 1366, 800, 0.32, 2.429, 6.5, 35],
  [820, 1180, 800, 0.32, 2.429, 6.5, 35],
  [768, 1024, 800, 0.32, 2.429, 6.5, 35],
  [414, 896, 896, 1.95, 3.01, 7.2, 41],
  [390, 844, 844, 1.95, 3.008, 7.2, 41],
  [375, 812, 812, 1.95, 3.007, 7.2, 41],
  [360, 740, 740, 1.95, 3.003, 7.2, 41],
];
const browser = await launch();
const report = [];
let failures = 0;
const close = (actual, wanted, tolerance) =>
  Math.abs(actual - wanted) <= tolerance;

for (const [width, height, heroHeight, x, y, z, fov] of expected) {
  const page = await browser.newPage({
    viewport: { width, height },
    deviceScaleFactor: 1,
  });
  const errors = [];
  page.on("pageerror", (error) => errors.push(error.message));
  page.on("console", (message) => {
    const url = message.location().url;
    if (message.type() === "error" && !url.includes("/_vercel/insights/"))
      errors.push(`${message.text()} ${url}`);
  });
  await page.goto(`${base}/solusi`, { waitUntil: "networkidle" });
  await page.waitForFunction(() => window.__solusi?.ready, null, {
    timeout: 120000,
    polling: 100,
  });
  await page.waitForTimeout(350);
  await page.evaluate(() => window.__solusi.render());
  const data = await page.evaluate(() => window.__solusi);
  const checks = {
    height: close(data.stage.height, heroHeight, 0.2),
    x: close(data.camera.pos[0], x, 0.002),
    y: close(data.camera.pos[1], y, 0.002),
    z: close(data.camera.pos[2], z - 1.9, 0.002),
    fov: close(data.camera.fov, fov, 0.01),
    lip: close(data.lipGap, 8, 1.2),
    triangles: data.triangles <= 16000,
    errors: errors.length === 0,
  };
  failures += Object.values(checks).filter((value) => !value).length;
  report.push({
    viewport: `${width}x${height}`,
    expected: { heroHeight, pos: [x, y, z - 1.9], fov },
    actual: data,
    checks,
    errors,
  });
  if ([1920, 1440, 820, 375].includes(width))
    await page.screenshot({
      path: join(out, `${width}x${height}-hero.png`),
      fullPage: false,
    });
  if (width === 1440 || width === 375) {
    await page.goto(`${base}/solusi#cari`, { waitUntil: "networkidle" });
    await page.waitForFunction(
      () => window.__solusi?.ready && window.__solusi?.focus,
      null,
      { timeout: 120000, polling: 100 },
    );
    await page.screenshot({
      path: join(out, `${width}x${height}-focus.png`),
      fullPage: false,
    });
  }
  await page.close();
}
await browser.close();
writeFileSync(
  join(out, "report.json"),
  JSON.stringify({ failures, report }, null, 2),
);
if (failures)
  throw new Error(`${failures} greybox checks failed; see report.json`);
console.log(
  `S4 greybox: ${report.length * 8} checks passed across ${report.length} viewports`,
);
