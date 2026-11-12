// Review of the lobby (tahap 7, beats 6–9a): canvas renders at K5a.6, K6, K7, K8, K9.1 and points along the moves,
// and the draw calls and triangles of the main pass at every point from K5a.6 to the end of the take, both ways
// (forward, then back to K5a.4: the sets let go and built again on the way). Renders go to OUT (keep them out of the
// repo: review shots are for the chat only).
// Usage: start the site (npm run dev in site/), then: node render/lobby.mjs [OUT] [pc,hp] [step, default 0.002 of p]
import { mkdtempSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { BASE, launch, open, waitWorld, writeDataUrl } from "./lib.mjs";

const OUT = process.argv[2] || mkdtempSync(join(tmpdir(), "kt-lobby-"));
const FMTS = (process.argv[3] || "pc,hp").split(",");
const STEP = Number(process.argv[4] || 0.002);
const VP = {
  pc: { width: 1280, height: 720 },
  hp: { width: 375, height: 812 },
};
const KEYS = ["K5a.6", "K6", "K7", "K8", "K9.1"];

const browser = await launch();
for (const fmt of FMTS) {
  const { page, errors } = await open(browser, `${BASE}/?shot&hud&fmt=${fmt}&k=K5a.6`, VP[fmt]);
  await waitWorld(page);
  /** Jumps to p, waits until the lobby's chunk and AO are in and a frame without the shadow pass is drawn. */
  const at = (p) =>
    page.evaluate(async (p) => {
      const W = window.__world,
        w = W.world;
      const frame = () => new Promise((r) => requestAnimationFrame(() => r(null)));
      w.jump(p);
      for (let i = 0; i < 400 && !W.aoDone(); i++) await frame();
      w.redraw();
      await frame();
      w.redraw();
      await frame();
      const s = w.stats();
      return { key: s.key, calls: s.calls, tris: s.triangles };
    }, p);
  const keyP = await page.evaluate((ks) => ks.map((k) => window.__world.keyP(k)), KEYS);
  // warm: the lobby's chunk loads near K5a.6, its AO with it
  await at(keyP[1]);
  await at(keyP[0]);
  for (const [i, k] of KEYS.entries()) {
    const s = await at(keyP[i]);
    writeDataUrl(join(OUT, `${fmt}_${k}.png`), await page.evaluate(() => window.__world.canvasPNG()));
    console.log(fmt, k, `${s.calls} draw call, ${(s.tris / 1000).toFixed(1)} rb segitiga`);
  }
  // 9:16 stops on each item of a hold: its first stop too (the hold's start; hold lengths of timing.ts, in screens of
  // the 22.95-screen take)
  if (fmt === "hp")
    for (const [i, k, len] of [
      [1, "K6", 2.3],
      [2, "K7", 1.4],
      [3, "K8", 0.75],
    ]) {
      await at(keyP[i] - (len / 2 - 0.03) / 22.95);
      writeDataUrl(join(OUT, `${fmt}_${k}_awal.png`), await page.evaluate(() => window.__world.canvasPNG()));
    }
  // the moves: four points each, between the keyframes
  for (let i = 0; i < KEYS.length - 1; i++)
    for (const f of [0.2, 0.4, 0.6, 0.8]) {
      const p = keyP[i] + (keyP[i + 1] - keyP[i]) * f;
      await at(p);
      writeDataUrl(
        join(OUT, `${fmt}_${KEYS[i]}-${KEYS[i + 1]}_${f}.png`),
        await page.evaluate(() => window.__world.canvasPNG()),
      );
    }
  // budget sweep, forward to the end and back to K5a.4
  const start = await page.evaluate(() => window.__world.keyP("K5a.4"));
  let worst = { calls: 0 },
    worstT = { tris: 0 };
  const pts = [];
  for (let p = keyP[0]; p <= 1; p += STEP) pts.push(p);
  pts.push(1);
  for (let p = 1; p >= start; p -= STEP) pts.push(p);
  for (const p of pts) {
    const s = await at(p);
    if (s.calls > worst.calls) worst = { ...s, p };
    if (s.tris > worstT.tris) worstT = { ...s, p };
  }
  console.log(fmt, "terberat (draw call):", worst, "terberat (segitiga):", worstT, `${pts.length} titik`);
  console.log(fmt, "error:", errors);
  await page.close();
}
await browser.close();
console.log("render di", OUT);
