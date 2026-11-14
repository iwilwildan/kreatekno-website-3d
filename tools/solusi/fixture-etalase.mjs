// S5b R0: freeze the 13 Nov etalase reference (prototype measurements) as a numbers-only fixture.
// Usage: node tools/solusi/fixture-etalase.mjs <measurements.json of the prototype>
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";

const src = process.argv[2];
if (!src) throw new Error("Pass the prototype measurements.json");
const report = JSON.parse(readFileSync(src, "utf8"));
if (!String(report.source).startsWith("prototype/"))
  throw new Error("The fixture must come from the prototype, not the site");

// Boxes compared by size; the ones inside the first box are also compared by offset from that box.
const ETALASE_ELEMENTS = [
  ".counter-h",
  ".frame",
  ".tier",
  ".track",
  ".prod",
  ".pk",
  ".cover",
  ".plank",
  ".band",
  ".st",
  ".cover .ttl",
  ".cover .sub",
  ".cover .fit",
  ".cover .fit small",
  ".cover .chips > span",
  ".apps",
  ".apps i",
];
const INSIDE_BOX = new Set([
  ".st",
  ".cover",
  ".cover .ttl",
  ".cover .sub",
  ".cover .fit",
  ".cover .fit small",
  ".cover .chips > span",
  ".apps",
  ".apps i",
]);
const round = (n) => Math.round(n * 100) / 100;

const views = {};
for (const view of report.views) {
  const el = view.states.etalase.elements;
  const pk = el[".pk"][0];
  const elements = {};
  for (const s of ETALASE_ELEMENTS) {
    const box = el[s]?.[0];
    if (!box) throw new Error(`${view.width}×${view.height}: ${s} missing`);
    elements[s] = {
      width: round(box.width),
      height: round(box.height),
      fontSize: box.fontSize,
      weight: Number(box.weight),
      ...(INSIDE_BOX.has(s)
        ? { dx: round(box.x - pk.x), dy: round(box.y - pk.y) }
        : {}),
    };
  }
  const tags = {};
  for (let n = 1; n <= 6; n++)
    tags[n] = view.states[`hasil-${n}`].world.tags.map((t) => ({
      x: round(t.x),
      y: round(t.y),
    }));
  views[`${view.width}×${view.height}`] = {
    elements,
    counts: { tiers: el[".tier"].length, boxes: el[".pk"].length },
    tags,
  };
}

mkdirSync(new URL("./fixtures/", import.meta.url), { recursive: true });
const fixture = {
  source:
    "prototype/solusi-etalase-v1.html (artefak AZX3Jy8e9Bmmdnu9tLL8Jb, 13 Nov 2026)",
  browser: report.browser,
  note: "Numbers only. Replaces VISUAL 8 and 7.5 for the etalase and the tags (PLAN-REVISI-ETALASE.md section 5).",
  tolerance: { box: 1, font: 0.5, tag: 2 },
  views,
};
writeFileSync(
  new URL("./fixtures/etalase-2026-11-13.json", import.meta.url),
  JSON.stringify(fixture, null, 2) + "\n",
);
console.log(
  `fixture: ${Object.keys(views).length} viewports, ${ETALASE_ELEMENTS.length} elements each`,
);
