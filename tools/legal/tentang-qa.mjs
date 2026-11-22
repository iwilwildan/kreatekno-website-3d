// 14B QA: Tentang / About. One H1, no sideways scroll, sections in order, team portraits and client logos load,
// canonical + hreflang, JSON-LD AboutPage (3 founders) + BreadcrumbList, WhatsApp buttons carry their section, no
// em dash, no cookies or storage, reveal animation never hides content (reduced motion and after scrolling), axe on
// main + footer, console clean. Home plaque (K9b) still lists the 13 logos and links here.
// Usage: BASE=http://localhost:3000 node tools/legal/tentang-qa.mjs <output directory>
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
  { locale: "id", path: "/tentang", other: "/en/about" },
  { locale: "en", path: "/en/about", other: "/tentang" },
];
const VIEWPORTS = [
  { width: 360, height: 740 },
  { width: 375, height: 812 },
  { width: 768, height: 1024 },
  { width: 1280, height: 720 },
  { width: 1440, height: 900 },
];
const SECTIONS = 7; // story, team, belief, process, trusted, office, cta (h2)

const browser = await launch({ gpu: false });

async function scrollThrough(page) {
  await page.evaluate(async () => {
    const step = innerHeight * 0.6;
    for (let y = 0; y < document.body.scrollHeight; y += step) {
      window.scrollTo(0, y);
      await new Promise((r) => setTimeout(r, 60));
    }
    window.scrollTo(0, document.body.scrollHeight);
  });
  await wait(600);
}

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
        !/_vercel\/insights/.test(m.text() + m.location().url)
      )
        consoleErrors.push(m.text());
    });
    const res = await page.goto(base + pg.path, { waitUntil: "networkidle" });
    check(`${tag} status 200`, res?.status() === 200, String(res?.status()));
    await scrollThrough(page);

    const info = await page.evaluate(() => {
      const main = document.querySelector("main");
      const ld = [
        ...document.querySelectorAll('script[type="application/ld+json"]'),
      ].map((s) => JSON.parse(s.textContent));
      const about = ld.find((d) => d["@type"] === "AboutPage");
      const imgs = (sel) =>
        [...document.querySelectorAll(sel)].map((i) => ({
          ok: i.complete && i.naturalWidth > 0,
          alt: i.alt,
        }));
      // every reveal card fully shown once the page has been scrolled through
      const reveal = [...document.querySelectorAll(".about-reveal")].map((el) =>
        Number(getComputedStyle(el).opacity),
      );
      return {
        h1: document.querySelectorAll("h1").length,
        h2: main.querySelectorAll("h2").length,
        overflow: document.documentElement.scrollWidth - window.innerWidth,
        canonical: document.querySelector('link[rel="canonical"]')?.href || "",
        hreflang: [
          ...document.querySelectorAll('link[rel="alternate"][hreflang]'),
        ].map((l) => [l.hreflang, new URL(l.href).pathname]),
        ldTypes: ld.map((d) => d["@type"] || "graph"),
        founders: about?.mainEntity?.founder?.map((f) => f.name) || [],
        team: imgs(".about-member-photo img"),
        logos: imgs(".about-logos img"),
        facade: imgs(".about-facade img"),
        wa: [...main.querySelectorAll("a[data-contact]")].map(
          (a) => `${a.dataset.src}:${a.dataset.intent}`,
        ),
        emDash: (main.innerText.match(/—/g) || []).length,
        storage: localStorage.length + sessionStorage.length,
        cookie: document.cookie,
        reveal,
        lang: document.documentElement.lang,
      };
    });

    check(`${tag} one h1`, info.h1 === 1, String(info.h1));
    check(`${tag} sections`, info.h2 === SECTIONS, String(info.h2));
    check(
      `${tag} no sideways scroll`,
      info.overflow <= 0,
      `${info.overflow}px`,
    );
    check(
      `${tag} canonical`,
      new URL(info.canonical).pathname === pg.path,
      info.canonical,
    );
    check(
      `${tag} hreflang`,
      info.hreflang.some(([l, p]) => l === "id" && p === "/tentang") &&
        info.hreflang.some(([l, p]) => l === "en" && p === "/en/about"),
      JSON.stringify(info.hreflang),
    );
    check(
      `${tag} json-ld`,
      info.ldTypes.includes("AboutPage") &&
        info.ldTypes.includes("BreadcrumbList") &&
        info.founders.join() === "Heru,Wildan,Andi",
      `${info.ldTypes.join(", ")} / ${info.founders.join()}`,
    );
    check(
      `${tag} portraits`,
      info.team.length === 3 &&
        info.team.every((i) => i.ok && i.alt.length > 10),
      JSON.stringify(info.team),
    );
    check(
      `${tag} logos`,
      info.logos.length === 13 && info.logos.every((i) => i.ok),
      `${info.logos.filter((i) => i.ok).length}/${info.logos.length}`,
    );
    check(
      `${tag} facade`,
      info.facade.every((i) => i.ok && i.alt),
      JSON.stringify(info.facade),
    );
    check(
      `${tag} whatsapp buttons`,
      [
        "about-hero:chat",
        "about-hero:meet",
        "about-office:meet",
        "about-cta:chat",
      ].every((w) => info.wa.includes(w)),
      info.wa.join(", "),
    );
    check(`${tag} no em dash`, info.emDash === 0, String(info.emDash));
    check(`${tag} lang`, info.lang === pg.locale, info.lang);
    check(
      `${tag} no cookies or storage`,
      info.storage === 0 &&
        info.cookie === "" &&
        (await context.cookies()).length === 0,
      `${info.storage} / "${info.cookie}"`,
    );
    check(
      `${tag} reveal leaves content visible`,
      info.reveal.every((o) => o > 0.99),
      info.reveal.map((o) => o.toFixed(2)).join(","),
    );

    if (viewport.width === 375 || viewport.width === 1440) {
      await page.evaluate(() => window.scrollTo(0, 0));
      await wait(300);
      await page.screenshot({
        path: join(out, `${pg.locale}-${viewport.width}-top.png`),
      });
      // full page with motion off, so no card is caught mid-reveal
      await page.emulateMedia({ reducedMotion: "reduce" });
      await wait(200);
      await page.screenshot({
        path: join(out, `${pg.locale}-${viewport.width}-full.png`),
        fullPage: true,
      });
      await page.emulateMedia({ reducedMotion: "no-preference" });
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
      const serious = axe.filter(
        (v) => v.impact === "serious" || v.impact === "critical",
      );
      check(
        `${tag} axe serious/critical`,
        serious.length === 0,
        JSON.stringify(axe),
      );

      // reduced motion: every reveal card visible without scrolling
      const rm = await browser.newContext({
        viewport,
        reducedMotion: "reduce",
      });
      const rp = await rm.newPage();
      await rp.goto(base + pg.path, { waitUntil: "networkidle" });
      const hidden = await rp.evaluate(
        () =>
          [...document.querySelectorAll(".about-reveal")].filter(
            (el) => Number(getComputedStyle(el).opacity) < 0.99,
          ).length,
      );
      check(`${tag} reduced motion shows all`, hidden === 0, String(hidden));
      await rm.close();

      // language switch keeps the visitor on About
      await page.evaluate(() => window.scrollTo(0, 0));
      const link = page.locator(`header a[href="${pg.other}"]`).first();
      if (await link.count()) {
        await link.click();
        await page.waitForURL(`**${pg.other}`);
        check(
          `${tag} lang switch`,
          new URL(page.url()).pathname === pg.other,
          page.url(),
        );
      } else check(`${tag} lang switch link`, false, "not found");
    }

    check(
      `${tag} console clean`,
      consoleErrors.length === 0,
      consoleErrors.join(" | "),
    );
    await context.close();
  }
}

// Home plaque (K9b) after the CLIENTS move: still 13 logos and a link to About
{
  const context = await browser.newContext({
    viewport: { width: 1280, height: 720 },
  });
  const page = await context.newPage();
  await page.goto(base + "/", { waitUntil: "domcontentloaded" });
  const plaque = await page.evaluate(() => ({
    logos: document.querySelectorAll(".plaque-trusted li").length,
    link: [...document.querySelectorAll("a")].some(
      (a) => new URL(a.href).pathname === "/tentang",
    ),
  }));
  check("home plaque logos", plaque.logos === 13, String(plaque.logos));
  check("home plaque links to /tentang", plaque.link);
  await context.close();
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
