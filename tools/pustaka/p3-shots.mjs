// Pustaka P3: the library desk hero in several viewports (reduced motion, so frames are deterministic), with the
// numbers the world reports (lip gap, draw calls, triangles, Andi and his head on screen). Screenshots stay in OUT
// (chat only, never site/public or git).
// Usage: BASE=http://localhost:3200 node tools/pustaka/p3-shots.mjs <absolute OUT> [motion]
import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { launch } from "../render/lib.mjs";

const OUT = process.argv[2];
if (!OUT) throw new Error("usage: node tools/pustaka/p3-shots.mjs OUT");
const motion = process.argv[3] === "motion";
mkdirSync(OUT, { recursive: true });
const base = process.env.BASE || "http://localhost:3200";
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
const browser = await launch();
const result = {};
for (const [width, height] of VIEWPORTS) {
  const key = `${width}x${height}`;
  const page = await browser.newPage({
    viewport: { width, height },
    hasTouch: width <= 1180,
    reducedMotion: motion ? "no-preference" : "reduce",
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
  await page.goto(`${base}/artikel`, { waitUntil: "networkidle" });
  await page.waitForFunction(
    () =>
      window.__pustaka?.ready && document.querySelector(".pustaka-world-ready"),
    null,
    {
      timeout: 60000,
    },
  );
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(500);
  const info = await page.evaluate(() => {
    window.__pustaka.render();
    const s = window.__pustaka;
    return {
      lipGap: +s.lipGap.toFixed(3),
      drawCalls: s.drawCalls,
      renderTriangles: s.renderTriangles,
      triangles: s.triangles,
      librarian: s.librarianScreen,
      head: s.headScreen,
      pose: s.pose,
      scrollX: document.documentElement.scrollWidth > innerWidth,
    };
  });
  await page.screenshot({ path: join(OUT, `${key}.png`) });
  result[key] = { ...info, errors };
  console.log(key, JSON.stringify(result[key]));
  await page.close();
}
await browser.close();
writeFileSync(join(OUT, "p3.json"), JSON.stringify(result, null, 2));
