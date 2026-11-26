// Pustaka P2: the eight librarian poses of Andi in one dev-lab strip per view (front, three-quarter, side), for
// review in chat only. Usage: node tools/pustaka/andi-poses.mjs OUT
import { mkdirSync } from "node:fs";
import { join } from "node:path";
import { BASE, launch, open, writeDataUrl } from "../render/lib.mjs";

const OUT = process.argv[2];
if (!OUT) throw new Error("usage: node tools/pustaka/andi-poses.mjs OUT");
mkdirSync(OUT, { recursive: true });
const browser = await launch();
for (const [view, rot] of [
  ["front", 0],
  ["threeq", -0.5],
  ["side", -Math.PI / 2],
]) {
  const { page, errors } = await open(
    browser,
    `${BASE}/?lab=andiPustakawan&view=pose&pose=all&flat&rot=${rot}`,
    {
      width: 2000,
      height: 720,
    },
  );
  await page.waitForFunction(() => window.__lab?.ready, null, {
    timeout: 120000,
    polling: 200,
  });
  await page.waitForTimeout(250);
  const info = await page.evaluate(() => {
    window.__lab.render();
    return window.__lab.info;
  });
  writeDataUrl(
    join(OUT, `poses_${view}.png`),
    await page.evaluate(() => window.__lab.png()),
  );
  console.log(view, { triangles: info.triangles, calls: info.calls }, errors);
  await page.close();
}
await browser.close();
console.log("order: idle, ready, lift, offer, wave, shrug, nod, stamp");
