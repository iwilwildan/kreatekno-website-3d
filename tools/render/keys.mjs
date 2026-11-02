// Canvas renders of the site at keyframe holds (?shot), for review in chat only.
// Usage: node render/keys.mjs OUT [K1,K2] [pc,hp]
import { join } from "node:path";
import { BASE, launch, open, waitWorld, writeDataUrl } from "./lib.mjs";

const OUT = process.argv[2],
  keys = (process.argv[3] || "K0,K1,K2").split(","),
  fmts = (process.argv[4] || "pc,hp").split(",");
if (!OUT) throw new Error("usage: node render/keys.mjs OUT [keys] [formats]");
const VP = { pc: { width: 1280, height: 720 }, hp: { width: 450, height: 800 } };
const browser = await launch();
for (const fmt of fmts)
  for (const k of keys) {
    const { page, errors } = await open(browser, `${BASE}/?shot&fmt=${fmt}&k=${k}`, VP[fmt]);
    await waitWorld(page);
    writeDataUrl(join(OUT, `${fmt}_${k}.png`), await page.evaluate(() => window.__world.canvasPNG()));
    // one more frame without the shadow pass, so the count is the frame a visitor sees while nothing moves
    const s = await page.evaluate(async () => {
      window.__world.world.redraw();
      await new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)));
      return window.__world.world.stats();
    });
    console.log(
      fmt,
      k,
      `${s.calls} draw call, ${(s.triangles / 1000).toFixed(1)} k tris (frame with shadow pass ${s.shadow.calls})`,
      errors,
    );
    await page.close();
  }
await browser.close();
