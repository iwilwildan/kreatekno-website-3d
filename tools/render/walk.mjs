// Side view of a cast member walking in the dev lab (/?lab=NAME&walk=tool), as a strip of frames for review.
// Usage: node render/walk.mjs OUT [name=heru] [n=12]
import { join } from "node:path";
import { BASE, launch, open, writeDataUrl } from "./lib.mjs";

const OUT = process.argv[2],
  name = process.argv[3] || "heru",
  n = Number(process.argv[4] || 12);
if (!OUT) throw new Error("usage: node render/walk.mjs OUT [name] [n]");
const browser = await launch({ gpu: true });
const { page, errors } = await open(browser, `${BASE}/?lab=${name}&walk=tool`, { width: 1280, height: 520 });
await page.waitForFunction(() => window.__lab?.ready, null, { timeout: 120000 });
for (let i = 0; i < n; i++) {
  // the middle metre of the path, where the gait is in full swing; springs stepped between frames
  const d = 1.1 + (1.2 * i) / (n - 1);
  await page.evaluate(async (dd) => {
    // walk up to it at 0.9 m/s (one spring step per frame), so the hair and lanyard swing as they would
    for (let k = 0; k < 60; k++) window.__lab.walkAt(dd - 0.015 * (59 - k));
  }, d);
  writeDataUrl(join(OUT, `${name}_walk_${String(i).padStart(2, "0")}.png`), await page.evaluate(() => window.__lab.png()));
}
console.log("errors:", errors);
await browser.close();
