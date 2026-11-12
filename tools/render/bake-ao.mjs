// Bakes the AO maps of the Home world into site/public/world/ao/ (grey PNGs, one per AO plane).
// The exterior, the row of shophouses (beats 5a–5b) and Kreatekno's lobby (beats 6–9a) come from layout step 0; each interior layout step (pc … hp blend) gets its own maps.
// Usage: start the site (npm run dev or start in site/), then: node render/bake-ao.mjs [steps, default 0-4]
import { mkdirSync, readdirSync, rmSync } from "node:fs";
import { join } from "node:path";
import { BASE, SITE, launch, open, writeDataUrl } from "./lib.mjs";

const STEPS = (process.argv[2] || "0,1,2,3,4").split(",").map(Number);
const OUT = join(SITE, "public", "world", "ao");
mkdirSync(OUT, { recursive: true });

const browser = await launch();
for (const step of STEPS) {
  const t0 = Date.now();
  const { page, errors } = await open(browser, `${BASE}/?bake=${step}&shot`, { width: 640, height: 360 });
  await page.waitForFunction(() => window.__world?.aoDone(), null, { timeout: 900000, polling: 1000 });
  const maps = await page.evaluate(() => window.__world.aoExport());
  const once = (id) => id.startsWith("ext-") || id.startsWith("row-") || id.startsWith("lobby-");
  if (step === 0) for (const f of readdirSync(OUT)) if (once(f)) rmSync(join(OUT, f));
  for (const f of readdirSync(OUT)) if (f.startsWith(`int-${step}-`)) rmSync(join(OUT, f));
  let n = 0;
  for (const m of maps) {
    // the street, the row of shophouses and the lobby do not change with the layout: baked once, with step 0
    if (once(m.id) && step !== 0) continue;
    writeDataUrl(join(OUT, `${m.id}.png`), m.png);
    n++;
  }
  console.log(`step ${step}: ${n} maps in ${((Date.now() - t0) / 1000).toFixed(1)} s`, errors.length ? errors : "");
  await page.close();
}
await browser.close();
