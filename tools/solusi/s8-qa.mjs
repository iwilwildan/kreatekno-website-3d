// S8 QA (N1a 23 Nov, N1b 24 Nov 2026): the twelve S8 detail pages in ID and EN across five viewports.
// Checks: 200, one h1 with the locale's title, canonical, sample client and quote, three metrics with the example
// label, built points, FAQ, no sideways scroll, no em dash or template/platform-vendor names in the visible text,
// console clean apart from local analytics 404s.
// Usage: BASE=http://localhost:3100 node --import ./tools/solusi/register.mjs tools/solusi/s8-qa.mjs <output directory>
// (screenshots stay in that directory, never in the repo)
import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { launch } from "../render/lib.mjs";
import { SOLUSI } from "../../site/content/solusi/index.ts";

const base = process.env.BASE || "http://localhost:3100";
const out = process.argv[2];
if (!out) throw new Error("Pass an output directory");
mkdirSync(out, { recursive: true });

const S8 = [
  "catat-pengeluaran",
  "balas-komentar",
  "faktur-pemasok",
  "layanan-sdm",
  "onboarding-klien",
  // N1b (24 Nov 2026): the seven pages rewritten from real workflows or templates.
  "asisten-sop",
  "carousel-konten",
  "berkas-dokumen",
  "stok-menipis",
  "pengingat-tagihan",
  "ulasan-pelanggan",
  "rekap-penjualan",
];
const VIEWS = {
  hp: { width: 375, height: 812 },
  "hp-kecil": { width: 360, height: 740 },
  tablet: { width: 768, height: 1024 },
  laptop: { width: 1280, height: 720 },
  desktop: { width: 1440, height: 900 },
};
const report = { checks: [], errors: [] };
const check = (name, ok, detail = "") =>
  report.checks.push({ name, ok: Boolean(ok), detail });
const browser = await launch({ gpu: false });

for (const slug of S8) {
  const solution = SOLUSI.find((s) => s.slug === slug);
  for (const locale of ["id", "en"]) {
    const copy = solution[locale];
    const url = `${base}${locale === "id" ? `/solusi/${slug}` : `/en/solutions/${slug}`}`;
    for (const [view, viewport] of Object.entries(VIEWS)) {
      const context = await browser.newContext({ viewport });
      const page = await context.newPage();
      const errors = [];
      page.on("console", (m) => {
        if (m.type() === "error" && !/404|insights/i.test(m.text()))
          errors.push(m.text());
      });
      const res = await page.goto(url, { waitUntil: "networkidle" });
      const scope = `${slug}/${locale}/${view}`;
      const info = await page.evaluate(() => ({
        h1: [...document.querySelectorAll("h1")].map((h) =>
          h.textContent.trim(),
        ),
        canonical: document.querySelector('link[rel="canonical"]')?.href || "",
        overflowX: document.documentElement.scrollWidth > innerWidth + 1,
        text: document.querySelector("main")?.innerText || "",
      }));
      check(`${scope}: 200`, res.status() === 200, res.status());
      check(
        `${scope}: satu h1 = judul`,
        info.h1.length === 1 && info.h1[0] === copy.title,
        info.h1.join(" | "),
      );
      check(
        `${scope}: canonical`,
        info.canonical.endsWith(slug),
        info.canonical,
      );
      check(`${scope}: tanpa scroll samping`, !info.overflowX);
      const t = info.text;
      check(`${scope}: klien contoh`, t.includes(copy.client), copy.client);
      check(`${scope}: kutipan`, t.includes(copy.quote.text.slice(0, 40)));
      check(
        `${scope}: angka contoh`,
        copy.metrics.every((m) => t.includes(m.label)),
      );
      check(
        `${scope}: poin dibangun`,
        copy.built.points.every((p) => t.includes(p.slice(0, 30))),
      );
      check(
        `${scope}: FAQ`,
        copy.faq.every((f) => t.includes(f.q)),
      );
      check(
        `${scope}: tanpa em dash dan nama template`,
        !/—|n8n|upload-post|HubSpot|NocoDB|Airtable/i.test(t),
      );
      check(
        `${scope}: console bersih`,
        errors.length === 0,
        errors.slice(0, 2).join(" | "),
      );
      if (view === "hp" || view === "desktop")
        await page.screenshot({
          path: join(out, `${slug}-${locale}-${view}.png`),
          fullPage: true,
        });
      await context.close();
    }
  }
}
await browser.close();
writeFileSync(join(out, "report.json"), JSON.stringify(report, null, 2));
const failed = report.checks.filter((c) => !c.ok);
for (const c of failed) console.log("FAIL", c.name, c.detail);
console.log(
  `${report.checks.length - failed.length}/${report.checks.length} passed`,
);
