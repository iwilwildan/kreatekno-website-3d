// Turnaround renders of a cast member from the dev lab (/?lab=NAME), for review in chat only.
// Writes OUT/NAME_sheet.png (front, three-quarter, side, back at 1400×788, the turnaround layout) and
// OUT/NAME_face.png (close-up), OUT/NAME_flat.png (no floor shadow, for render/castprofile.py), plus OUT/NAME_vs.png: the turnaround above the render when python -I
// render/castvs.py runs afterwards. Keep OUT outside the repo (team references must not be committed).
// Usage: node render/cast.mjs NAME OUT [hemat]
import { join } from "node:path";
import { BASE, launch, open, writeDataUrl } from "./lib.mjs";

const name = process.argv[2] || "heru",
  OUT = process.argv[3],
  saver = process.argv[4] === "hemat" ? "&hemat" : "";
if (!OUT) throw new Error("usage: node render/cast.mjs NAME OUT [hemat]");
const browser = await launch();
for (const view of ["sheet", "face", "flat"]) {
  const q = view === "flat" ? "view=sheet&flat" : `view=${view}`;
  const { page, errors } = await open(browser, `${BASE}/?lab=${name}&${q}${saver}`, { width: 1400, height: 788 });
  await page.waitForFunction(() => window.__lab?.ready, null, { timeout: 120000, polling: 200 });
  await page.waitForTimeout(300);
  const info = await page.evaluate(() => {
    window.__lab.render();
    return window.__lab.info;
  });
  writeDataUrl(join(OUT, `${name}_${view}.png`), await page.evaluate(() => window.__lab.png()));
  console.log(view, info, errors);
  await page.close();
}
await browser.close();
