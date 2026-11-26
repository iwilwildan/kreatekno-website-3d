// Pustaka P3 step 2: the stamp action frame by frame at a steady 60 fps (SwiftShader alone runs ±8 fps, too slow
// to judge the motion), with the book and the stamp's height per frame and canvas snapshots at chosen times.
// Snapshots stay in OUT (chat only). Usage: BASE=http://localhost:3000 node tools/pustaka/p3-stamp.mjs <absolute OUT>
import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { launch } from "../render/lib.mjs";

const OUT = process.argv[2];
if (!OUT) throw new Error("usage: node tools/pustaka/p3-stamp.mjs OUT");
mkdirSync(OUT, { recursive: true });
const base = process.env.BASE || "http://localhost:3000";
const SHOTS = [0, 0.35, 0.7, 0.85, 1.1, 1.4, 1.9];
const browser = await launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
const errors = [];
page.on("pageerror", (e) => errors.push(e.message));
await page.goto(`${base}/artikel`, { waitUntil: "networkidle" });
await page.waitForFunction(
  () => document.querySelector(".pustaka-world-ready"),
  null,
  { timeout: 120000 },
);
await page.waitForTimeout(1500);
const result = await page.evaluate((shots) => {
  const s = () => window.__pustaka;
  const canvas = document.querySelector(".pustaka-gl");
  const t0 = performance.now();
  s().render(t0);
  s().stamp();
  const frames = [];
  const images = {};
  for (let k = 0; k <= 130; k++) {
    const t = k / 60;
    s().render(t0 + t * 1000);
    frames.push({
      t: +t.toFixed(3),
      pose: s().pose,
      stampY: +s().stampY.toFixed(3),
      held: +s().stampHeld.toFixed(2),
      book: +s().book.toFixed(2),
    });
    const shot = shots.find((x) => Math.abs(x - t) < 0.5 / 60);
    if (shot !== undefined) images[shot] = canvas.toDataURL("image/png");
  }
  return { frames, images };
}, SHOTS);
for (const [t, url] of Object.entries(result.images))
  writeFileSync(
    join(OUT, `stamp-${Number(t).toFixed(2)}.png`),
    Buffer.from(url.split(",")[1], "base64"),
  );
const pressed = result.frames.filter((f) => f.pose === "stamp");
console.log({
  lowestPress: Math.min(...pressed.map((f) => f.stampY)),
  poses: [...new Set(result.frames.map((f) => f.pose))],
  end: result.frames.at(-1),
  errors,
});
writeFileSync(join(OUT, "stamp.json"), JSON.stringify(result.frames, null, 1));
await browser.close();
