// Pustaka P4: Andi fetching books from the wall bookcase, frame by frame at a steady 60 fps (SwiftShader alone runs
// ±8 fps), with his turn, his pose and the books per frame and canvas snapshots at chosen times. Snapshots stay in
// OUT (chat only). Usage: BASE=http://localhost:3000 node tools/pustaka/p4-fetch.mjs <absolute OUT> [term] [width height]
import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { launch } from "../render/lib.mjs";

const [OUT, TERM = "", W = "1440", H = "900"] = process.argv.slice(2);
if (!OUT)
  throw new Error(
    "usage: node tools/pustaka/p4-fetch.mjs OUT [term] [width height]",
  );
mkdirSync(OUT, { recursive: true });
const base = process.env.BASE || "http://localhost:3000";
const SHOTS = [0.2, 0.6, 1.0, 1.4, 1.8, 2.3, 3.0, 3.8];
const browser = await launch();
const page = await browser.newPage({ viewport: { width: +W, height: +H } });
const errors = [];
page.on("pageerror", (e) => errors.push(e.message));
await page.goto(`${base}/artikel`, { waitUntil: "networkidle" });
await page.waitForFunction(
  () =>
    window.__pustaka?.ready && document.querySelector(".pustaka-world-ready"),
  null,
  {
    timeout: 120000,
  },
);
await page.evaluate(() => (location.hash = "tanya"));
await page.waitForFunction(
  () => window.__pustaka.focus && document.querySelector(".kartu-pinjam input"),
);
await page.waitForTimeout(2000);
await page.locator(".kartu-pinjam input").fill(TERM);
await page.waitForTimeout(300);
const result = await page.evaluate((shots) => {
  const s = () => window.__pustaka;
  const canvas = document.querySelector(".pustaka-gl");
  document.querySelector(".kartu-pinjam").requestSubmit();
  const t0 = performance.now();
  const frames = [];
  const images = {};
  for (let k = 0; k <= 4.2 * 60; k++) {
    const t = k / 60;
    s().render(t0 + t * 1000);
    frames.push({
      t: +t.toFixed(3),
      pose: s().pose,
      turn: +s().turn.toFixed(2),
      books: s().books.count,
    });
    const shot = shots.find((x) => Math.abs(x - t) < 0.5 / 60);
    if (shot !== undefined) images[shot] = canvas.toDataURL("image/png");
  }
  return { frames, images };
}, SHOTS);
for (const [t, url] of Object.entries(result.images))
  writeFileSync(
    join(OUT, `fetch-${Number(t).toFixed(1)}.png`),
    Buffer.from(url.split(",")[1], "base64"),
  );
const poses = [];
for (const f of result.frames)
  if (poses.at(-1)?.pose !== f.pose) poses.push({ t: f.t, pose: f.pose });
console.log({
  poses,
  maxTurn: Math.max(...result.frames.map((f) => f.turn)),
  end: result.frames.at(-1),
  errors,
});
await browser.close();
