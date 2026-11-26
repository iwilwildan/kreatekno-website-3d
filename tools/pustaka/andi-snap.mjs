// Pustaka P2: proof that refactoring cast/andi.ts into shared helpers leaves Home Andi unchanged.
// Renders Andi from the dev lab (sheet, face, flat, hemat, K8 seated pose, About portrait at dpr 2) and writes
// OUT/<view>.png plus OUT/snap.json (SHA-256 of every PNG, triangles, partTris). Run once before and once after
// the refactor, then compare the two snap.json files: `node tools/pustaka/andi-snap.mjs compare A B`.
// Keep OUT outside the repo (renders are shown in chat only).
// Usage: node tools/pustaka/andi-snap.mjs OUT [name]   |   node tools/pustaka/andi-snap.mjs compare A B
import { createHash } from "node:crypto";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { BASE, launch, open } from "../render/lib.mjs";

if (process.argv[2] === "compare") {
  const [a, b] = process.argv
    .slice(3)
    .map((d) => JSON.parse(readFileSync(join(d, "snap.json"), "utf8")));
  let same = true;
  for (const k of Object.keys(a)) {
    const eq = JSON.stringify(a[k]) === JSON.stringify(b[k]);
    same &&= eq;
    console.log(
      eq ? "identik" : "BEDA   ",
      k,
      eq ? "" : JSON.stringify({ before: a[k], after: b[k] }),
    );
  }
  console.log(same ? "SEMUA IDENTIK" : "ADA PERBEDAAN");
  process.exit(same ? 0 : 1);
}

const OUT = process.argv[2],
  name = process.argv[3] || "andi";
if (!OUT) throw new Error("usage: node tools/pustaka/andi-snap.mjs OUT [name]");
mkdirSync(OUT, { recursive: true });
const shots = [
  ["sheet", "view=sheet", { width: 1400, height: 788 }, 1],
  ["face", "view=face", { width: 1400, height: 788 }, 1],
  ["flat", "view=sheet&flat", { width: 1400, height: 788 }, 1],
  ["hemat", "view=sheet&hemat", { width: 1400, height: 788 }, 1],
  ["k8", "view=sheet&pose=k8", { width: 1400, height: 788 }, 1],
  ["portrait", "view=portrait", { width: 640, height: 800 }, 2],
];
const browser = await launch();
const snap = {};
for (const [view, q, viewport, dpr] of shots) {
  const { page, errors } = await open(
    browser,
    `${BASE}/?lab=${name}&${q}`,
    viewport,
    { dpr },
  );
  await page.waitForFunction(() => window.__lab?.ready, null, {
    timeout: 180000,
    polling: 200,
  });
  await page.waitForTimeout(300);
  const info = await page.evaluate(() => {
    window.__lab.render();
    return window.__lab.info;
  });
  const url = await page.evaluate(() => window.__lab.png());
  const png = Buffer.from(url.split(",")[1], "base64");
  writeFileSync(join(OUT, `${view}.png`), png);
  snap[view] = {
    sha256: createHash("sha256").update(png).digest("hex"),
    triangles: info.triangles,
    calls: info.calls,
    parts: info.parts,
  };
  console.log(
    view,
    snap[view].sha256.slice(0, 16),
    info.triangles,
    info.calls,
    errors,
  );
  await page.close();
}
await browser.close();
writeFileSync(join(OUT, "snap.json"), JSON.stringify(snap, null, 2));
