// Team portraits for the About page (tahap 14B): Heru, Wildan and Andi from the dev lab (/?lab=NAME&view=portrait),
// a three-quarter bust on a transparent background, 640×800 CSS px at device pixel ratio 2. Writes OUT/NAME.png and
// site/public/team/NAME.webp (1280×1600 with alpha, the file the page loads).
// These are renders of our own scene (no team reference images), so the WebP files may live in site/public/.
// Usage: node render/team.mjs OUT
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { BASE, launch, open, toWebp, writeDataUrl } from "./lib.mjs";

const PUBLIC = fileURLToPath(
  new URL("../../site/public/team/", import.meta.url),
);

const OUT = process.argv[2];
if (!OUT) throw new Error("usage: node render/team.mjs OUT");
const browser = await launch();
for (const name of ["heru", "wildan", "andi"]) {
  const { page, errors } = await open(
    browser,
    `${BASE}/?lab=${name}&view=portrait`,
    { width: 640, height: 800 },
    { dpr: 2 },
  );
  await page.waitForFunction(() => window.__lab?.ready, null, {
    timeout: 120000,
    polling: 200,
  });
  await page.waitForTimeout(300);
  const info = await page.evaluate(() => {
    window.__lab.render();
    return window.__lab.info;
  });
  const png = join(OUT, `${name}.png`);
  writeDataUrl(png, await page.evaluate(() => window.__lab.png()));
  toWebp(png, join(PUBLIC, `${name}.webp`), 82);
  console.log(name, info.triangles, errors);
  await page.close();
}
await browser.close();
