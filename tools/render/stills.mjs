// Renders the keyframe stills (first paint / LCP, no-WebGL fallback, stacked version) from the site's own 3D
// scene into site/public/stills/{pc,hp}/k0..k4.webp, and writes where the anchors sit on them
// (site/components/home/stills.json): the billboard on K0, so the copy is placed on the still before the world
// loads; the leaflet on K3, the binder's page on K4 and the journey's panels on K5a.2–K5a.4, for the stills
// fallback. 9:16 also gets K5a.2b, K5a.3b and K5a.4b (the second panel of those holds).
// Bake the AO first. Usage: node render/stills.mjs [quality, default 80]
import { mkdtempSync, readFileSync, statSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { BASE, FORMATS, HP_AT, JOURNEY, KEYS, SITE, launch, open, toWebp, waitWorld, writeDataUrl } from "./lib.mjs";

const QUALITY = Number(process.argv[2] || 80);
const tmp = mkdtempSync(join(tmpdir(), "kt-stills-"));
const dataFile = join(SITE, "components", "home", "stills.json");
const data = JSON.parse(readFileSync(dataFile, "utf8"));

const browser = await launch();
for (const [fmt, vp] of Object.entries(FORMATS)) {
  data[fmt].w = vp.width;
  data[fmt].h = vp.height;
  const keys = fmt === "hp" ? [...KEYS, "K5a.2b", "K5a.3b", "K5a.4b"] : KEYS;
  for (const k of keys) {
    const at = fmt === "hp" ? HP_AT[k] : undefined;
    const { page, errors } = await open(browser, `${BASE}/?shot&fmt=${fmt}${at == null ? `&k=${k}` : ""}`, vp);
    await waitWorld(page);
    if (at != null)
      await page.evaluate(async (s) => {
        const take = Number(document.querySelector(".take").style.getPropertyValue("--take"));
        window.__world.world.jump(s / take);
        for (let i = 0; i < 12; i++) await new Promise((r) => requestAnimationFrame(r));
      }, at);
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
        Object.entries(anchors)
          .filter(([, q]) => q) // the billboard only: the leaflet and the binder are not in the K0 frame
          .map(([n, q]) => [n, q.map(([x, y]) => [+(x / stage.w).toFixed(5), +(y / stage.h).toFixed(5)])]),
      );
    }
    // the copy on its still: the leaflet at K3, the binder's page at K4, the journey's panels on K5a.2–K5a.4
    const props = { K3: ["leaflet"], K4: ["page"], ...Object.fromEntries(Object.entries(JOURNEY[fmt]).map(([key, v]) => [key, v.map((n) => `journey-${n}`)])) }[k];
    if (props) {
      const { anchors, stage } = await page.evaluate(() => ({
        anchors: window.__world.anchors(),
        stage: window.__world.stage(),
      }));
      data[fmt][k] = {};
      for (const prop of props) {
        const q = anchors[prop];
        if (!q) throw new Error(`no ${prop} anchor on ${fmt} ${k}`);
        data[fmt][k][prop] = q.map(([x, y]) => [+(x / stage.w).toFixed(5), +(y / stage.h).toFixed(5)]);
      }
    }
    console.log(fmt, k, `${(statSync(webp).size / 1024).toFixed(1)} KB`, errors.length ? errors : "");
    await page.close();
  }
}
await browser.close();
writeFileSync(dataFile, JSON.stringify(data, null, 2) + "\n");
console.log("anchors written to", dataFile);
