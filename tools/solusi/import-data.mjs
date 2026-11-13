// One-time migration helper, explicit --write required. Does not execute the HTML.
import { mkdirSync, writeFileSync, existsSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { readPrototype } from "./source.mjs";

const data = readPrototype();
const root = fileURLToPath(
  new URL("../../site/content/solusi/", import.meta.url),
);
if (!process.argv.includes("--write")) {
  console.log(
    `Validated literal source: ${data.SOLUSI.length} solutions, ${data.KARTU.length} cards. Use --write for initial import.`,
  );
  process.exit(0);
}
function save(file, content) {
  const path = join(root, file);
  if (existsSync(path)) throw new Error(`Refusing to overwrite ${file}`);
  writeFileSync(path, content);
}
const json = (value) => JSON.stringify(value, null, 2);
mkdirSync(join(root, "items"), { recursive: true });
const names = [];
for (const s of data.SOLUSI) {
  const { slug, status, industri, tim, apps } = s;
  const id = {
    title: s.title,
    question: s.q,
    result: s.result,
    summary: data.RINGKAS[slug],
    answer: s.answer,
    ...(s.client ? { client: s.client } : {}),
    pains: s.pains,
    steps: s.steps.map(([title, body]) => ({ title, body })),
    compare: s.compare.map(([aspect, before, after]) => ({
      aspect,
      before,
      after,
    })),
    fit: s.fit,
    notFit: s.notFit,
    prep: s.prep,
    ...(s.metrics
      ? {
          metrics: s.metrics.map(([value, unit, label]) => ({
            value,
            unit,
            label,
          })),
        }
      : {}),
    faq: s.faq.map(([q, a]) => ({ q, a })),
  };
  const item = {
    slug,
    status,
    updated: `2026-10-${s.updated.slice(0, 2)}`,
    industri,
    tim,
    apps,
    ...(s.metrics ? { metricsKind: "example" } : {}),
    id,
  };
  const name = slug.replace(/-([a-z])/g, (_, c) => c.toUpperCase());
  names.push(name);
  save(
    `items/${slug}.ts`,
    `// Source: Solusi v1 COPY 19; client metrics remain examples.\nimport type { Solusi } from "../schema";\n\nexport const ${name}: Solusi = ${json(item)};\n`,
  );
}
save(
  "index.ts",
  data.SOLUSI.map(
    (s, i) => `import { ${names[i]} } from "./items/${s.slug}";`,
  ).join("\n") + `\n\nexport const SOLUSI = [${names.join(", ")}];\n`,
);
save(
  "kartu.ts",
  `// Source: Solusi v1 COPY 16. English follows in S2.\nimport type { Kartu } from "./schema";\n\nexport const KARTU: Kartu[] = ${json(data.KARTU.map((c) => ({ id: c.id, text: { id: c.t }, industri: c.ind, tim: c.tim, solusi: c.sol })))};\n`,
);
const industryEn = [
  "Retail & food service",
  "Clinics",
  "Property",
  "Logistics",
  "Services",
  "Travel",
];
const industryIcons = [
  "Storefront",
  "FirstAid",
  "Buildings",
  "Truck",
  "Handshake",
  "GlobeSimple",
];
const teamEn = [
  "Marketing",
  "Sales",
  "Customer service",
  "Operations",
  "Finance & admin",
  "Management",
  "Human resources",
];
const icons = [
  "WhatsappLogo",
  "Table",
  "InstagramLogo",
  "Envelope",
  "CalendarDots",
  "Folder",
];
save(
  "taksonomi.ts",
  `// IDs and order are stable across locales; English labels are draft.\n` +
    `export const INDUSTRI = ${json(data.INDUSTRI.map(([id, label], i) => ({ id, label: { id: label, en: industryEn[i] }, icon: industryIcons[i] })))} as const;\n` +
    `export const TIM = ${json(data.TIM.map(([id, label], i) => ({ id, label: { id: label, en: teamEn[i] }, color: data.TEAMCOL[id] })))} as const;\n` +
    `export const APPS = ${json(data.APPS.map(([id, label], i) => ({ id, label: { id: label, en: label }, icon: icons[i] })))} as const;\n` +
    `export const STATUS = {jalan:{id:"Sudah berjalan",en:"In use"},ide:{id:"Siap dibuat",en:"Ready to build"}} as const;\n`,
);
console.log("Imported 12 solutions, 24 cards and taxonomy; no watch URLs.");
