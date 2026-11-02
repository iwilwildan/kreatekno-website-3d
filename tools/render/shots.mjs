// Review shots. Two kinds, written to OUT (default: a temp folder; keep them out of the repo):
//   compare: canvas-only renders of the site at K0, K1, K2 (pc 1280×720, hp 450×800), the same renders of
//            prototype/k0-k2-3d.html, and the pixel difference between them (compare.py);
//   page:    full-page screenshots with the HTML copy at 1280×720 and 375×812 for each keyframe.
// Usage: node render/shots.mjs [compare|page|all] [OUT]
import { mkdtempSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { pathToFileURL } from "node:url";
import { BASE, KEYS, ROOT, launch, open, waitWorld, writeDataUrl } from "./lib.mjs";

const what = process.argv[2] || "all";
const OUT = process.argv[3] || mkdtempSync(join(tmpdir(), "kt-shots-"));
const VP = { pc: { width: 1280, height: 720 }, hp: { width: 450, height: 800 } };
const browser = await launch();

if (what === "compare" || what === "all") {
  const proto = pathToFileURL(join(ROOT, "prototype", "k0-k2-3d.html")).href;
  for (const [fmt, vp] of Object.entries(VP))
    for (const k of KEYS) {
      const site = await open(browser, `${BASE}/?shot&fmt=${fmt}&k=${k}`, vp);
      await waitWorld(site.page);
      writeDataUrl(join(OUT, `site_${fmt}_${k}.png`), await site.page.evaluate(() => window.__world.canvasPNG()));
      const info = await site.page.evaluate(() => window.__world.world.stats());
      await site.page.close();
      const pr = await open(browser, `${proto}?shot&fmt=${fmt}&k=${k}`, vp);
      await pr.page.waitForFunction(() => window.__k02?.aoState().done, null, { timeout: 600000, polling: 500 });
      await pr.page.evaluate(() => window.__k02.setP(window.__k02.keyP[new URLSearchParams(location.search).get("k")]));
      await pr.page.waitForTimeout(400);
      await pr.page.screenshot({ path: join(OUT, `proto_${fmt}_${k}.png`) });
      await pr.page.close();
      console.log(fmt, k, `site: ${info.calls} draw call, ${(info.triangles / 1000).toFixed(1)} k tris`, [...site.errors, ...pr.errors]);
    }
}

if (what === "page" || what === "all") {
  for (const [fmt, vp] of Object.entries({ pc: VP.pc, hp: { width: 375, height: 812 } }))
    for (const k of KEYS) {
      const { page, errors } = await open(browser, `${BASE}/?k=${k}`, vp, { dpr: fmt === "hp" ? 2 : 1 });
      await waitWorld(page);
      await page.waitForTimeout(1200);
      await page.screenshot({ path: join(OUT, `page_${fmt}_${k}.png`) });
      console.log("page", fmt, k, errors);
      await page.close();
    }
}
await browser.close();
console.log("shots in", OUT);
