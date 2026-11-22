// 14C QA: Artikel / Articles. List and the five articles in ID and EN: one H1, no sideways scroll, links to the
// per-language slugs, canonical + hreflang to the translated slug, JSON-LD BlogPosting + BreadcrumbList, Open Graph
// image renders, drop cap, full-bleed bands, reading progress fills, related solutions and "read next" resolve,
// WhatsApp CTA per article, no em dash or platform names in the text, language switch keeps the article, the other
// language's slug is a 404, the Home rack links each book to its article, axe, no cookies, console clean.
// Usage: BASE=http://localhost:3000 node tools/legal/artikel-qa.mjs <output directory>
// (screenshots stay in that directory, never in the repo)
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { setTimeout as wait } from "node:timers/promises";
import { launch } from "../render/lib.mjs";

const base = process.env.BASE || "http://localhost:3000";
const out = process.argv[2];
if (!out) throw new Error("Pass an output directory");
mkdirSync(out, { recursive: true });
const AXE = readFileSync(
  fileURLToPath(
    new URL("../../site/node_modules/axe-core/axe.min.js", import.meta.url),
  ),
  "utf8",
);

const SLUGS = {
  admin: {
    id: "pekerjaan-admin-yang-bisa-dikerjakan-ai",
    en: "admin-tasks-ai-can-do",
  },
  service: {
    id: "asisten-ai-untuk-balas-chat-pembeli",
    en: "ai-assistant-for-customer-chats",
  },
  team: {
    id: "melatih-staf-bekerja-bareng-ai",
    en: "training-staff-to-work-with-ai",
  },
  promo: {
    id: "ide-konten-promosi-dengan-ai",
    en: "weekly-promo-ideas-with-ai",
  },
  money: {
    id: "catat-penjualan-harian-otomatis",
    en: "record-daily-sales-automatically",
  },
};
const KEYS = Object.keys(SLUGS);
const LIST = { id: "/artikel", en: "/en/articles" };
const path = (locale, key) =>
  locale === "id"
    ? `/artikel/${SLUGS[key].id}`
    : `/en/articles/${SLUGS[key].en}`;
const PLATFORMS =
  /\b(WhatsApp|Excel|Instagram|Google|Canva|ChatGPT|TikTok|Facebook|n8n)\b/;
const VIEWPORTS = [
  { width: 360, height: 740 },
  { width: 375, height: 812 },
  { width: 768, height: 1024 },
  { width: 1280, height: 720 },
  { width: 1440, height: 900 },
];

const report = { checks: [], errors: [] };
const check = (name, ok, detail = "") =>
  report.checks.push({ name, ok: Boolean(ok), detail });

const browser = await launch({ gpu: false });

async function openPage(viewport, url, tag) {
  const context = await browser.newContext({ viewport });
  const page = await context.newPage();
  const consoleErrors = [];
  page.on("pageerror", (e) => report.errors.push(`${tag}: ${e.message}`));
  page.on("console", (m) => {
    if (
      m.type() === "error" &&
      !/_vercel\/insights/.test(m.text() + m.location().url)
    )
      consoleErrors.push(m.text());
  });
  const res = await page.goto(base + url, { waitUntil: "networkidle" });
  return { context, page, res, consoleErrors };
}

const status = async (url) =>
  (await fetch(base + url, { redirect: "manual" })).status;

// ---------- list ----------
for (const locale of ["id", "en"]) {
  for (const viewport of VIEWPORTS) {
    const tag = `list ${locale} ${viewport.width}`;
    const { context, page, res, consoleErrors } = await openPage(
      viewport,
      LIST[locale],
      tag,
    );
    check(`${tag} status 200`, res?.status() === 200, String(res?.status()));
    const info = await page.evaluate(() => ({
      h1: document.querySelectorAll("h1").length,
      overflow: document.documentElement.scrollWidth - window.innerWidth,
      links: [...document.querySelectorAll(".article-card-link")].map(
        (a) => new URL(a.href).pathname,
      ),
      emDash: (document.querySelector("main").innerText.match(/—/g) || [])
        .length,
      cookie: document.cookie,
    }));
    check(`${tag} one h1`, info.h1 === 1, String(info.h1));
    check(
      `${tag} no sideways scroll`,
      info.overflow <= 0,
      `${info.overflow}px`,
    );
    check(
      `${tag} five cards to this language's slugs`,
      JSON.stringify(info.links) ===
        JSON.stringify(KEYS.map((k) => path(locale, k))),
      info.links.join(", "),
    );
    check(`${tag} no em dash`, info.emDash === 0, String(info.emDash));
    check(
      `${tag} no cookies`,
      info.cookie === "" && (await context.cookies()).length === 0,
    );
    if (viewport.width === 375 || viewport.width === 1440) {
      await page.screenshot({
        path: join(out, `list-${locale}-${viewport.width}.png`),
        fullPage: true,
      });
    }
    if (viewport.width === 1280) {
      await page.addScriptTag({ content: AXE });
      const axe = await page.evaluate(async () => {
        const r = await window.axe.run(
          { include: [["main"], ["footer"]] },
          { resultTypes: ["violations"] },
        );
        return r.violations.map((v) => ({
          id: v.id,
          impact: v.impact,
          nodes: v.nodes.length,
        }));
      });
      check(
        `${tag} axe serious/critical`,
        !axe.some((v) => v.impact === "serious" || v.impact === "critical"),
        JSON.stringify(axe),
      );
    }
    check(
      `${tag} console clean`,
      consoleErrors.length === 0,
      consoleErrors.join(" | "),
    );
    await context.close();
  }
}

// ---------- articles ----------
for (const locale of ["id", "en"]) {
  for (const key of KEYS) {
    // every article at phone and desktop; the first one at all five widths
    const views = key === "admin" ? VIEWPORTS : [VIEWPORTS[1], VIEWPORTS[4]];
    for (const viewport of views) {
      const tag = `${key} ${locale} ${viewport.width}`;
      const url = path(locale, key);
      const { context, page, res, consoleErrors } = await openPage(
        viewport,
        url,
        tag,
      );
      check(`${tag} status 200`, res?.status() === 200, String(res?.status()));
      const info = await page.evaluate(() => {
        const main = document.querySelector("main");
        const ld = [
          ...document.querySelectorAll('script[type="application/ld+json"]'),
        ].map((s) => JSON.parse(s.textContent));
        const first = document.querySelector(".article-body > p");
        const bands = [...document.querySelectorAll(".prose-band")].map((b) => {
          const r = b.getBoundingClientRect();
          return Math.round(r.width);
        });
        return {
          h1: document.querySelectorAll("h1").length,
          overflow: document.documentElement.scrollWidth - window.innerWidth,
          canonical:
            document.querySelector('link[rel="canonical"]')?.href || "",
          hreflang: Object.fromEntries(
            [
              ...document.querySelectorAll('link[rel="alternate"][hreflang]'),
            ].map((l) => [l.hreflang, new URL(l.href).pathname]),
          ),
          og:
            document.querySelector('meta[property="og:image"]')?.content || "",
          ogType:
            document.querySelector('meta[property="og:type"]')?.content || "",
          ld: ld.map((d) => d["@type"] || "graph"),
          posting: ld.find((d) => d["@type"] === "BlogPosting"),
          dropCap: first ? getComputedStyle(first, "::first-letter").float : "",
          bands,
          docWidth: document.documentElement.clientWidth,
          related: [...document.querySelectorAll(".article-solution")].map(
            (a) => new URL(a.href).pathname,
          ),
          next: [
            ...document.querySelectorAll(".article-next .article-card-link"),
          ].map((a) => new URL(a.href).pathname),
          cta: [...main.querySelectorAll(".prose-cta a[data-contact]")].map(
            (a) => a.dataset.src,
          ),
          // the article's own copy (related solutions quote the Solusi catalog, checked on its own pages)
          text: [...main.querySelectorAll(".article-hero, .article-body-wrap")]
            .map((e) => e.innerText)
            .join(" "),
          cookie: document.cookie,
          lang: document.documentElement.lang,
        };
      });
      const other = locale === "id" ? "en" : "id";
      check(`${tag} one h1`, info.h1 === 1, String(info.h1));
      check(
        `${tag} no sideways scroll`,
        info.overflow <= 0,
        `${info.overflow}px`,
      );
      check(
        `${tag} canonical`,
        new URL(info.canonical).pathname === url,
        info.canonical,
      );
      check(
        `${tag} hreflang`,
        info.hreflang.id === path("id", key) &&
          info.hreflang.en === path("en", key),
        JSON.stringify(info.hreflang),
      );
      check(`${tag} og type article`, info.ogType === "article", info.ogType);
      check(
        `${tag} json-ld`,
        info.ld.includes("BlogPosting") &&
          info.ld.includes("BreadcrumbList") &&
          info.posting?.author?.name === "Kreatekno" &&
          info.posting?.datePublished,
        info.ld.join(", "),
      );
      check(`${tag} drop cap`, info.dropCap === "left", info.dropCap);
      check(
        `${tag} bands full bleed`,
        info.bands.length > 0 &&
          info.bands.every((w) => Math.abs(w - info.docWidth) <= 1),
        `${info.bands.join(",")} vs ${info.docWidth}`,
      );
      check(
        `${tag} two related solutions`,
        info.related.length === 2,
        info.related.join(", "),
      );
      check(
        `${tag} read next = two other articles`,
        info.next.length === 2 && !info.next.includes(url),
        info.next.join(", "),
      );
      check(
        `${tag} cta section`,
        info.cta.includes(`artikel-${key}`),
        info.cta.join(","),
      );
      check(`${tag} no em dash`, !/—/.test(info.text));
      check(
        `${tag} no platform names`,
        !PLATFORMS.test(info.text),
        info.text.match(PLATFORMS)?.[0],
      );
      check(`${tag} lang`, info.lang === locale, info.lang);
      check(
        `${tag} no cookies`,
        info.cookie === "" && (await context.cookies()).length === 0,
      );

      // reading progress: empty at the top, full at the end of the text
      const progress = async () =>
        page.evaluate(() => {
          const m = getComputedStyle(
            document.querySelector(".read-progress-bar"),
          ).transform;
          return m === "none" ? 0 : Number(m.match(/matrix\(([^,]+)/)[1]);
        });
      const top = await progress();
      await page.evaluate(() =>
        document
          .querySelector(".article-author")
          .scrollIntoView({ block: "end" }),
      );
      await wait(300);
      const end = await progress();
      check(
        `${tag} reading progress`,
        top < 0.05 && end > 0.95,
        `${top.toFixed(2)} → ${end.toFixed(2)}`,
      );

      if (
        viewport.width === 1440 ||
        (viewport.width === 375 && key === "admin")
      ) {
        await page.evaluate(() => window.scrollTo(0, 0));
        await wait(200);
        await page.screenshot({
          path: join(out, `${key}-${locale}-${viewport.width}.png`),
          fullPage: true,
        });
      }

      if (viewport.width === 1440) {
        // related, next and Open Graph image resolve
        for (const p of [...info.related, ...info.next])
          check(`${tag} link ${p}`, (await status(p)) === 200);
        // og:image points at the production origin; ask this server for the same path (ID follows a 307)
        const ogUrl = new URL(info.og);
        const og = await fetch(base + ogUrl.pathname + ogUrl.search);
        check(
          `${tag} og image`,
          og.status === 200 && og.headers.get("content-type") === "image/png",
          `${new URL(info.og).pathname} ${og.status}`,
        );
        // the slug in the other language is a 404 under this language
        const wrong =
          locale === "id"
            ? `/artikel/${SLUGS[key].en}`
            : `/en/articles/${SLUGS[key].id}`;
        check(
          `${tag} other-language slug 404`,
          (await status(wrong)) === 404,
          wrong,
        );
        // language switch keeps the article
        await page.evaluate(() => window.scrollTo(0, 0));
        await page.locator(`header a[hreflang="${other}"]`).first().click();
        await page
          .waitForURL(`**${path(other, key)}`, { timeout: 15000 })
          .catch(() => {});
        check(
          `${tag} lang switch`,
          new URL(page.url()).pathname === path(other, key),
          page.url(),
        );
      }

      if (viewport.width === 1280) {
        await page.addScriptTag({ content: AXE });
        const axe = await page.evaluate(async () => {
          const r = await window.axe.run(
            { include: [["main"], ["footer"]] },
            { resultTypes: ["violations"] },
          );
          return r.violations.map((v) => ({
            id: v.id,
            impact: v.impact,
            nodes: v.nodes.length,
          }));
        });
        check(
          `${tag} axe serious/critical`,
          !axe.some((v) => v.impact === "serious" || v.impact === "critical"),
          JSON.stringify(axe),
        );
      }
      check(
        `${tag} console clean`,
        consoleErrors.length === 0,
        consoleErrors.join(" | "),
      );
      await context.close();
    }
  }
}

// ---------- Home rack (K7): each book links to its article ----------
for (const locale of ["id", "en"]) {
  const context = await browser.newContext({
    viewport: { width: 1280, height: 720 },
  });
  const page = await context.newPage();
  await page.goto(base + (locale === "id" ? "/" : "/en"), {
    waitUntil: "domcontentloaded",
  });
  const rack = await page.evaluate(() => ({
    books: [...document.querySelectorAll(".book-link")].map(
      (a) => new URL(a.href).pathname,
    ),
    all: [...document.querySelectorAll(".rack-all a")].map(
      (a) => new URL(a.href).pathname,
    ),
  }));
  check(
    `home rack ${locale} books`,
    JSON.stringify(rack.books) ===
      JSON.stringify(KEYS.map((k) => path(locale, k))),
    rack.books.join(", "),
  );
  check(
    `home rack ${locale} see all`,
    rack.all[0] === LIST[locale],
    rack.all.join(","),
  );
  await context.close();
}

// ---------- sitemap ----------
{
  const xml = await (await fetch(base + "/sitemap.xml")).text();
  const missing = ["id", "en"].flatMap((l) =>
    KEYS.map((k) => path(l, k)).filter((p) => !xml.includes(`${p}<`)),
  );
  check(
    "sitemap has the ten article URLs",
    missing.length === 0,
    missing.join(", "),
  );
}

await browser.close();
writeFileSync(join(out, "report.json"), JSON.stringify(report, null, 2));
const failed = report.checks.filter((c) => !c.ok);
console.log(
  `${report.checks.length - failed.length}/${report.checks.length} passed`,
);
for (const f of failed) console.log("FAIL", f.name, f.detail);
for (const e of report.errors) console.log("ERROR", e);
process.exit(failed.length || report.errors.length ? 1 : 0);
