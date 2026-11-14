// Records a short, local-only S5 Search and Cards walkthrough.
// Usage: BASE=http://localhost:3000 node tools/solusi/s5-demo.mjs <output directory>
import { spawnSync } from "node:child_process";
import { mkdirSync } from "node:fs";
import { join } from "node:path";
import { launch } from "../render/lib.mjs";

const base = process.env.BASE || "http://localhost:3000";
const out = process.argv[2];
if (!out) throw new Error("Pass an output directory");
mkdirSync(out, { recursive: true });
const frames = join(out, "demo-frames");
mkdirSync(frames, { recursive: true });

const browser = await launch({ gpu: true });
const page = await browser.newPage({
  viewport: { width: 1280, height: 720 },
  deviceScaleFactor: 1,
});
let frame = 0;
const capture = async (seconds) => {
  const count = Math.ceil(seconds * 12);
  for (let index = 0; index < count; index += 1) {
    await page.screenshot({
      path: join(frames, `frame-${String(frame++).padStart(4, "0")}.png`),
    });
    await page.waitForTimeout(1000 / 12);
  }
};

await page.goto(`${base}/solusi#cari`, { waitUntil: "networkidle" });
await page.waitForFunction(() => window.__solusi?.ready);
await capture(0.7);
await page.locator(".receipt-submit").click();
await capture(2.25);
await page.locator("[data-box-tag='0']").click();
await capture(1);
await page.keyboard.press("Escape");
await page.locator(".pagination button").last().click();
await capture(0.9);
await page.locator(".panel-close").click();
await page.goto(`${base}/solusi#kartu`, { waitUntil: "networkidle" });
await page.waitForFunction(() => window.__solusi?.ready);
await capture(0.6);
await page.locator(".industry-grid button").first().click();
await page.locator(".industry-sheet .solusi-button").click();
await capture(1.4);
await page.locator(".answer-yes").click();
await capture(0.8);

await page.close();
await browser.close();
const output = join(out, "s5-search-cards.webm");
const ffmpeg =
  "C:/Users/wilda/AppData/Local/Microsoft/WinGet/Packages/Gyan.FFmpeg_Microsoft.Winget.Source_8wekyb3d8bbwe/ffmpeg-9.0.2-full_build/bin/ffmpeg.exe";
const encoded = spawnSync(
  ffmpeg,
  [
    "-y",
    "-framerate",
    "12",
    "-i",
    join(frames, "frame-%04d.png"),
    "-c:v",
    "libvpx-vp9",
    "-crf",
    "30",
    "-b:v",
    "0",
    "-pix_fmt",
    "yuv420p",
    "-an",
    output,
  ],
  { stdio: "inherit" },
);
if (encoded.status !== 0)
  throw new Error(`ffmpeg exited with ${encoded.status}`);
console.log(output);
