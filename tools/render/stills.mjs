// Renders the keyframe stills (first paint / LCP, no-WebGL fallback, stacked version) from the site's own 3D
// scene into site/public/stills/{pc,hp}/k0..k2.webp, and writes where the billboard anchors sit on the K0 stills
// (site/components/home/stills.json) so the copy is placed on the still before the world loads.
// Bake the AO first. Usage: node render/stills.mjs [quality, default 80]
import { mkdtempSync, readFileSync, statSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { BASE, FORMATS, KEYS, SITE, launch, open, toWebp, waitWorld, writeDataUrl } from "./lib.mjs";

const QUALITY = Number(process.argv[2] || 80);
const tmp = mkdtempSync(join(tmpdir(), "kt-stills-"));
const dataFile = join(SITE, "components", "home", "stills.json");
const data = JSON.parse(readFileSync(dataFile, "utf8"));

const browser = await launch();
for (const [fmt, vp] of Object.entries(FORMATS)) {
  data[fmt].w = vp.width;
  data[fmt].h = vp.height;
  for (const k of KEYS) {
    const { page, errors } = await open(browser, `${BASE}/?shot&fmt=${fmt}&k=${k}`, vp);
    await waitWorld(page);
    const png = join(tmp, `${fmt}_${k}.png`),
      webp = join(SITE, "public", "stills", fmt, `${k.toLowerCase()}.webp`);
    writeDataUrl(png, await page.evaluate(() => window.__world.canvasPNG()));
    toWebp(png, webp, QUALITY);
    if (k === "K0") {
      const { anchors, stage, aspect } = await page.evaluate(() => ({
        anchors: window.__world.anchors(),
        stage: window.__world.stage(),
        aspect: window.__world.aspect,
      }));
      data.aspect = Object.fromEntries(Object.entries(aspect).map(([n, a]) => [n, +a.toFixed(4)]));
      data[fmt].K0 = Object.fromEntries(
        Object.entries(anchors).map(([n, q]) => [n, q.map(([x, y]) => [+(x / stage.w).toFixed(5), +(y / stage.h).toFixed(5)])]),
      );
    }
    console.log(fmt, k, `${(statSync(webp).size / 1024).toFixed(1)} KB`, errors.length ? errors : "");
    await page.close();
  }
}
await browser.close();
writeFileSync(dataFile, JSON.stringify(data, null, 2) + "\n");
console.log("anchors written to", dataFile);
