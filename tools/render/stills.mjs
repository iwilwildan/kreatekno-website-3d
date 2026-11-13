// Renders the keyframe stills (first paint / LCP, no-WebGL fallback, stacked version) from the site's own 3D
// scene into site/public/stills/{pc,hp}/k0..k4.webp, and writes where the anchors sit on them
// (site/components/home/stills.json): the billboard on K0, so the copy is placed on the still before the world
// loads; the leaflet on K3, the binder's page on K4 and the journey's panels on K5a.2–K5a.4, for the stills
// fallback. 9:16 also gets K5a.2b, K5a.3b and K5a.4b (the second panel of those holds). The lobby (tahap 7): K6, K7,
// K8, K9.1 with the copy on K6–K8; on 9:16 one still per stop of a hold (K6 … K6h, K7 … K7e, K8, K8b).
// Bake the AO first. Usage: node render/stills.mjs [quality, default 80] [keys, comma separated, default all]
import { mkdtempSync, readFileSync, statSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { BASE, FORMATS, HP_AT, JOURNEY, KEYS, LOBBY_COPY, LOBBY_HP, SITE, launch, open, stopMid, toWebp, waitWorld, writeDataUrl } from "./lib.mjs";

const QUALITY = Number(process.argv[2] || 80);
const ONLY = process.argv[3] ? new Set(process.argv[3].split(",")) : null;
const tmp = mkdtempSync(join(tmpdir(), "kt-stills-"));
const dataFile = join(SITE, "components", "home", "stills.json");
const data = JSON.parse(readFileSync(dataFile, "utf8"));

const browser = await launch();
for (const [fmt, vp] of Object.entries(FORMATS)) {
  data[fmt].w = vp.width;
  data[fmt].h = vp.height;
  // 9:16 stops on each item of a lobby hold: a still per stop, in place of the hold's middle (between two stops)
  const lobbyStops = {};
  for (const [hold, { len, keys }] of Object.entries(LOBBY_HP))
    keys.forEach((k, i) => (lobbyStops[k] = { hold, len, at: stopMid(len, keys.length, i) }));
  const keys = fmt === "hp" ? [...KEYS.filter((k) => !(k in LOBBY_HP)), "K5a.2b", "K5a.3b", "K5a.4b", ...Object.keys(lobbyStops)] : KEYS;
  for (const k of keys.filter((k) => !ONLY || ONLY.has(k))) {
    const stop = fmt === "hp" ? lobbyStops[k] : undefined;
    const at = fmt === "hp" ? HP_AT[k] : undefined;
    const { page, errors } = await open(browser, `${BASE}/?shot&fmt=${fmt}${at == null && !stop ? `&k=${k}` : ""}`, vp);
    await waitWorld(page);
    if (at != null || stop)
      await page.evaluate(
        async ([s, stop]) => {
          const W = window.__world,
            // screens of the take's own (9:16) timeline, the unit of p in the world (--take is 16:9's scroll since
            // the lobby's timelines parted)
            take = Number(document.querySelector(".take").style.getPropertyValue("--take-hp"));
          const x = stop ? W.keyP(stop.hold) * take - stop.len / 2 + stop.at : s;
          W.world.jump(x / take);
          // the lobby's chunk and its AO load on the way
          for (let i = 0; i < 400 && !W.aoDone(); i++) await new Promise((r) => requestAnimationFrame(r));
          for (let i = 0; i < 12; i++) await new Promise((r) => requestAnimationFrame(r));
        },
        [at, stop],
      );
    else
      await page.evaluate(async () => {
        for (let i = 0; i < 400 && !window.__world.aoDone(); i++) await new Promise((r) => requestAnimationFrame(r));
        for (let i = 0; i < 12; i++) await new Promise((r) => requestAnimationFrame(r));
      });
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
    // and the lobby's on its stills (tahap 7)
    const props = { K3: ["leaflet"], K4: ["page"], ...Object.fromEntries(Object.entries(JOURNEY[fmt]).map(([key, v]) => [key, v.map((n) => `journey-${n}`)])), ...LOBBY_COPY[fmt] }[k];
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
