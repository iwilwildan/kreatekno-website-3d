// 14A QA: Kebijakan Privasi / Privacy Policy. One H1, no sideways scroll, table of contents = every `##` heading and
// each link lands below the floating header, draft is noindex, canonical + hreflang, JSON-LD, no cookies or browser
// storage (also after switching language), no em dash in visible text, axe on the page, console clean.
// Usage: BASE=http://localhost:3000 node tools/legal/privasi-qa.mjs <output directory>
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

const report = { checks: [], errors: [] };
const check = (name, ok, detail = "") =>
  report.checks.push({ name, ok: Boolean(ok), detail });

const PAGES = [
  { locale: "id", path: "/kebijakan-privasi", other: "/en/privacy-policy" },
  { locale: "en", path: "/en/privacy-policy", other: "/kebijakan-privasi" },
];
const VIEWPORTS = [
  { width: 360, height: 740 },
  { width: 375, height: 812 },
  { width: 768, height: 1024 },
  { width: 1280, height: 720 },
  { width: 1440, height: 900 },
];

const browser = await launch({ gpu: false });

for (const pg of PAGES) {
  for (const viewport of VIEWPORTS) {
    const tag = `${pg.locale} ${viewport.width}`;
    const context = await browser.newContext({ viewport });
    const page = await context.newPage();
    const consoleErrors = [];
    page.on("pageerror", (e) => report.errors.push(`${tag}: ${e.message}`));
    page.on("console", (m) => {
      if (
        m.type() === "error" &&
        !/_vercel\/insights/.test(m.text()) &&
        !/_vercel\/insights/.test(m.location().url)
      )
        consoleErrors.push(m.text());
    });
    const res = await page.goto(base + pg.path, { waitUntil: "networkidle" });
    await wait(300);
    check(`${tag} status 200`, res?.status() === 200, String(res?.status()));

    const info = await page.evaluate(() => {
      const visible = (el) =>
        !!el &&
        getComputedStyle(el).display !== "none" &&
        el.getClientRects().length > 0;
      const h2 = [...document.querySelectorAll(".prose-k h2")].map((h) => h.id);
      const tocSide = document.querySelector(".legal-toc-side");
      const tocFold = document.querySelector(".legal-toc-fold");
      const tocLinks = [
        ...(visible(tocSide) ? tocSide : tocFold).querySelectorAll("a"),
      ].map((a) => a.hash.slice(1));
      const ld = [
        ...document.querySelectorAll('script[type="application/ld+json"]'),
      ].map((s) => {
        try {
          return JSON.parse(s.textContent);
        } catch {
          return null;
        }
      });
      const main = document.querySelector("main");
      return {
        h1: document.querySelectorAll("h1").length,
        overflow: document.documentElement.scrollWidth - window.innerWidth,
        h2,
        tocLinks,
        sideVisible: visible(tocSide),
        foldVisible: visible(tocFold),
        robots: document.querySelector('meta[name="robots"]')?.content || "",
        canonical: document.querySelector('link[rel="canonical"]')?.href || "",
        hreflang: [
          ...document.querySelectorAll('link[rel="alternate"][hreflang]'),
        ].map((l) => [l.hreflang, new URL(l.href).pathname]),
        ldTypes: ld.map((d) =>
          d
            ? d["@type"] || (d["@graph"] || []).map((g) => g["@type"]).join("+")
            : "BAD",
        ),
        emDash: (main.innerText.match(/—/g) || []).length,
        storage: localStorage.length + sessionStorage.length,
        cookie: document.cookie,
        pending: [...document.querySelectorAll(".prose-pending")].map(
          (e) => e.textContent,
        ),
        lang: document.documentElement.lang,
      };
    });

    check(`${tag} one h1`, info.h1 === 1, String(info.h1));
    check(
      `${tag} no sideways scroll`,
      info.overflow <= 0,
      `${info.overflow}px`,
    );
    check(
      `${tag} toc = headings`,
      info.h2.length > 0 &&
        JSON.stringify(info.h2) === JSON.stringify(info.tocLinks),
      `${info.h2.length} h2, ${info.tocLinks.length} links`,
    );
    check(
      `${tag} toc variant`,
      viewport.width >= 1024
        ? info.sideVisible && !info.foldVisible
        : info.foldVisible && !info.sideVisible,
    );
    check(`${tag} draft noindex`, /noindex/.test(info.robots), info.robots);
    check(
      `${tag} canonical`,
      new URL(info.canonical).pathname === pg.path,
      info.canonical,
    );
    check(
      `${tag} hreflang`,
      info.hreflang.some(
        ([l, p]) => l === "id" && p === "/kebijakan-privasi",
      ) &&
        info.hreflang.some(
          ([l, p]) => l === "en" && p === "/en/privacy-policy",
        ),
      JSON.stringify(info.hreflang),
    );
    check(
      `${tag} json-ld`,
      ["WebPage", "BreadcrumbList"].every((t) => info.ldTypes.includes(t)) &&
        !info.ldTypes.includes("BAD"),
      info.ldTypes.join(", "),
    );
    check(`${tag} no em dash`, info.emDash === 0, String(info.emDash));
    check(`${tag} lang`, info.lang === pg.locale, info.lang);
    check(
      `${tag} no browser storage`,
      info.storage === 0 && info.cookie === "",
      `${info.storage} / "${info.cookie}"`,
    );
    check(
      `${tag} no cookies set`,
      (await context.cookies()).length === 0,
      JSON.stringify(await context.cookies()),
    );

    // the table of contents: open the fold on phones, then jump to the sixth section
    if (!info.sideVisible) await page.click(".legal-toc-fold > summary");
    const target = info.tocLinks[5];
    await page.click(
      `${info.sideVisible ? ".legal-toc-side" : ".legal-toc-fold"} a[href="#${target}"]`,
    );
    await wait(500);
    const landed = await page.evaluate((id) => {
      const h = document.getElementById(id).getBoundingClientRect();
      const header = document.querySelector("header")?.getBoundingClientRect();
      const current =
        document
          .querySelector(".legal-toc-side a[aria-current]")
          ?.hash.slice(1) || null;
      return {
        top: h.top,
        headerBottom: header ? header.bottom : 0,
        current,
        hash: location.hash,
      };
    }, target);
    check(
      `${tag} toc jump below header`,
      landed.top >= landed.headerBottom && landed.top < viewport.height / 2,
      `heading ${Math.round(landed.top)} px, header ${Math.round(landed.headerBottom)} px`,
    );
    if (info.sideVisible)
      check(
        `${tag} toc highlights section`,
        landed.current === target,
        String(landed.current),
      );

    if (viewport.width === 375 || viewport.width === 1440) {
      await page.evaluate(() => window.scrollTo(0, 0));
      await wait(200);
      await page.screenshot({
        path: join(out, `${pg.locale}-${viewport.width}-top.png`),
      });
      await page.screenshot({
        path: join(out, `${pg.locale}-${viewport.width}-full.png`),
        fullPage: true,
      });
    }

    if (viewport.width === 1280) {
      await page.addScriptTag({ content: AXE });
      const axe = await page.evaluate(async () => {
        // The page itself (main + footer). The shared header is reported apart: its ID/EN buttons carry a known,
        // pre-existing label-content-name-mismatch that this page didn't introduce.
        const run = async (include) => {
          const r = await window.axe.run(
            { include },
            { resultTypes: ["violations"] },
          );
          return r.violations.map((v) => ({
            id: v.id,
            impact: v.impact,
            nodes: v.nodes.length,
          }));
        };
        return {
          page: await run([["main"], ["footer"]]),
          header: await run([["body > header, header"]]),
        };
      });
      const serious = axe.page.filter(
        (v) => v.impact === "serious" || v.impact === "critical",
      );
      check(
        `${tag} axe serious/critical`,
        serious.length === 0,
        JSON.stringify(axe.page),
      );
      report.axeHeader = axe.header;

      // language switch keeps the visitor on the policy and still sets no cookie
      const link = page.locator(`a[href="${pg.other}"]`).first();
      if (await link.count()) {
        await link.click();
        await page.waitForURL(`**${pg.other}`);
        await wait(300);
        check(
          `${tag} lang switch`,
          new URL(page.url()).pathname === pg.other,
          page.url(),
        );
        check(
          `${tag} no cookies after switch`,
          (await context.cookies()).length === 0,
          JSON.stringify(await context.cookies()),
        );
      } else check(`${tag} lang switch link`, false, "not found");
    }

    check(
      `${tag} console clean`,
      consoleErrors.length === 0,
      consoleErrors.join(" | "),
    );
    report.pending = { ...(report.pending || {}), [pg.locale]: info.pending };
    await context.close();
  }
}

await browser.close();
writeFileSync(join(out, "report.json"), JSON.stringify(report, null, 2));
const failed = report.checks.filter((c) => !c.ok);
console.log(
  `${report.checks.length - failed.length}/${report.checks.length} passed`,
);
for (const f of failed) console.log("FAIL", f.name, f.detail);
for (const e of report.errors) console.log("ERROR", e);
console.log("pending facts:", JSON.stringify(report.pending));
process.exit(failed.length || report.errors.length ? 1 : 0);
