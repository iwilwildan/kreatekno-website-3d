// Compare S0/S2 captures to the immutable tables in VISUAL (CSS boxes ±1px, fonts ±0.5px).
// S2 can keep the same scoped selector names or adapt capture keys without changing these fixtures.
// S5b (13 Nov): VISUAL 8 (etalase) and 7.5 (tags) are replaced by fixtures/etalase-2026-11-13.json,
// measured from the 13 Nov prototype. VISUAL itself is the user's copy and stays untouched.
// Usage: node tools/solusi/compare.mjs <measurements.json> [--scope etalase] [--hp-tags skip]
//   --scope etalase  only the etalase fixture (site measured with measure.mjs --site)
//   --hp-tags skip   no tag positions at ≤ 760 px (decision 17: two rows on phones)
import { readFileSync, writeFileSync } from "node:fs";
import { join, dirname } from "node:path";
const args = process.argv.slice(2);
const option = (name) => {
  const i = args.indexOf(name);
  return i >= 0 ? args.splice(i, 2)[1] : "";
};
const scope = option("--scope");
const hpTags = option("--hp-tags");
const reportPath = args[0];
if (!reportPath) throw new Error("Pass measurements.json");
const actual = JSON.parse(readFileSync(reportPath, "utf8"));
const visual = readFileSync(
  new URL("../../docs/SOLUSI-V1-VISUAL.md", import.meta.url),
  "utf8",
);
const fixture = JSON.parse(
  readFileSync(
    new URL("./fixtures/etalase-2026-11-13.json", import.meta.url),
    "utf8",
  ),
);
const mappings = {
  6: {
    "Toko (stage hero)": ["hero", ".toko"],
    "Blok hero-copy": ["hero", ".hero-copy"],
    "Screen (kartu TV di HP)": ["hero", ".screen"],
    H1: ["hero", ".screen h1"],
    "Paragraf hero": ["hero", ".screen p"],
    'Tombol "Cari solusi"': ["hero", ".hero-btns .btn"],
  },
  // 8 (etalase) comes from the fixture below.
  9: {
    'Tombol "Kembali ke etalase"': ["cari", ".exit"],
    "Kertas struk (.paper)": ["cari", ".paper"],
    "Kepala struk": ["cari", ".rc-h"],
    "Input pencarian": ["cari", "#q"],
    "Select filter": ["cari", ".flt select"],
    "Bar hasil (.pbar)": ["hasil-6", ".pbar"],
  },
  10: {
    "Kartu pop up": ["contact", ".modal-card"],
    "Judul pop up": ["contact", "#ct-h"],
    "Baris kontak": ["contact", ".ct"],
  },
  11: {
    "Wadah deck (bidang usaha)": ["sheet", ".deckwrap"],
    "Kertas bidang usaha": ["sheet", ".sheet"],
    "Judul kertas": ["sheet", ".sheet h2"],
    "Tombol bidang usaha": ["sheet", ".ind"],
    "Wadah deck (kartu)": ["cards", ".deckwrap"],
    Deck: ["cards", ".deck"],
    "Kartu teratas": ["cards", '.pc[data-depth="0"]'],
    'Progres "Kartu x dari 9"': ["cards", ".prog"],
  },
};
let section = 0,
  viewports = [],
  checks = 0;
const failures = [];
function check(view, label, property, expected, value, tolerance) {
  checks++;
  if (!Number.isFinite(value) || Math.abs(value - expected) > tolerance)
    failures.push({
      view,
      label,
      property,
      expected,
      actual: value,
      delta: value - expected,
    });
}
for (const line of scope === "etalase" ? [] : visual.split(/\r?\n/)) {
  const heading = line.match(/^## (\d+)\./);
  if (heading) {
    section = Number(heading[1]);
    viewports = [];
  }
  if (!line.startsWith("|")) continue;
  const cells = line
    .split("|")
    .slice(1, -1)
    .map((x) => x.trim());
  if (cells[0] === "Elemen") {
    viewports = cells.slice(1);
    continue;
  }
  const mapping = mappings[section]?.[cells[0]];
  if (!mapping || !viewports.length) continue;
  cells.slice(1).forEach((cell, i) => {
    const view = actual.views.find(
      (v) => `${v.width}×${v.height}` === viewports[i],
    );
    if (!view) return;
    const [state, selector] = mapping,
      box = view.states[state]?.elements[selector]?.[0];
    if (!box) {
      failures.push({ view: viewports[i], label: cells[0], missing: selector });
      return;
    }
    const size = cell.match(/([\d.]+)×([\d.]+)/);
    if (size) {
      check(viewports[i], cells[0], "width", +size[1], box.width, 1);
      check(viewports[i], cells[0], "height", +size[2], box.height, 1);
    }
    const font = cell.match(/· ([\d.]+)\/(?:[\d.]+|normal) (\d+)/);
    if (font) {
      check(viewports[i], cells[0], "fontSize", +font[1], box.fontSize, 0.5);
      check(viewports[i], cells[0], "weight", +font[2], +box.weight, 0);
    }
    for (const axis of ["x", "y"]) {
      const p = cell.match(new RegExp(`(?:^|· )${axis} ([\\d.]+)`));
      if (p) check(viewports[i], cells[0], axis, +p[1], box[axis], 1);
    }
  });
}
// Etalase, fixture 13 Nov (replaces VISUAL 8): size, font and, inside the first box, offset from it.
const tol = fixture.tolerance;
for (const [name, ref] of Object.entries(fixture.views)) {
  const view = actual.views.find((v) => `${v.width}×${v.height}` === name);
  if (!view) continue;
  const els = view.states.etalase?.elements || {};
  const pk = els[".pk"]?.[0];
  check(name, "etalase", "tiers", ref.counts.tiers, els[".tier"]?.length, 0);
  check(name, "etalase", "boxes", ref.counts.boxes, els[".pk"]?.length, 0);
  for (const [selector, want] of Object.entries(ref.elements)) {
    // The band sits below the etalase and is outside the S5b scope on the site.
    if (scope === "etalase" && selector === ".band") continue;
    const box = els[selector]?.[0];
    if (!box) {
      failures.push({ view: name, label: selector, missing: selector });
      continue;
    }
    check(name, selector, "width", want.width, box.width, tol.box);
    check(name, selector, "height", want.height, box.height, tol.box);
    check(name, selector, "fontSize", want.fontSize, box.fontSize, tol.font);
    check(name, selector, "weight", want.weight, +box.weight, 0);
    if ("dx" in want && pk) {
      check(name, selector, "dx", want.dx, box.x - pk.x, tol.box);
      check(name, selector, "dy", want.dy, box.y - pk.y, tol.box);
    }
  }
}
// Tags, fixture 13 Nov (replaces VISUAL 7.5): centres for one through six boxes (±2px).
for (const [name, ref] of scope === "etalase"
  ? []
  : Object.entries(fixture.views)) {
  const view = actual.views.find((v) => `${v.width}×${v.height}` === name);
  if (!view || (hpTags === "skip" && view.width <= 760)) continue;
  for (let n = 1; n <= 6; n++) {
    const tags = view.states[`hasil-${n}`]?.world?.tags || [];
    check(name, `tags-${n}`, "count", ref.tags[n].length, tags.length, 0);
    ref.tags[n].forEach((want, j) => {
      for (const axis of ["x", "y"])
        check(
          name,
          `tags-${n}.${j}`,
          axis,
          want[axis],
          tags[j]?.[axis],
          tol.tag,
        );
    });
  }
}
for (const line of scope === "etalase"
  ? []
  : visual.split("### 7.4")[1].split("### 7.5")[0].split(/\r?\n/)) {
  const cells = line
    .split("|")
    .slice(1, -1)
    .map((x) => x.trim());
  const view = actual.views.find((v) => `${v.width}×${v.height}` === cells[0]);
  if (!view) continue;
  const camera = view.states.hero.world.camera;
  for (const [key, index] of [
    ["pos", 3],
    ["look", 4],
  ]) {
    cells[index]
      .split(",")
      .map(Number)
      .forEach((n, i) =>
        check(cells[0], `camera.${key}`, String(i), n, camera[key][i], 0.002),
      );
  }
  check(cells[0], "camera", "fov", parseFloat(cells[5]), camera.fov, 0.002);
}
const result = {
  checks,
  failures,
  scope:
    scope === "etalase"
      ? "Etalase fixture 13 Nov only (sizes, fonts, offsets inside the first box)."
      : "VISUAL 6/9/10/11: core boxes and typography; VISUAL 7.4: hero cameras; etalase and tag centres: fixture 13 Nov" +
        (hpTags === "skip" ? " (tags ≤ 760 px skipped)" : "") +
        ".",
};
writeFileSync(
  join(dirname(reportPath), "comparison.json"),
  JSON.stringify(result, null, 2),
);
console.log(
  JSON.stringify(
    { checks, failures: failures.length, examples: failures.slice(0, 12) },
    null,
    2,
  ),
);
if (failures.length) process.exitCode = 1;
