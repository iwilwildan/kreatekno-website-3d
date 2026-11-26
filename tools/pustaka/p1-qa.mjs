// Pustaka P1 QA: /artikel and /en/articles as the library without 3D. Hero (one H1, both buttons, desk picture
// with a name), the shelf (five books in shelf order, each fully inside its book, reachable by keyboard and by
// swiping on phones), "Tanya pustakawan" (#tanya: heading focus, library card fields with labels, a typical
// question finds its book, a topic narrows, no match shows every book, the status region announces, "Tanya lagi",
// Escape and Back return to the shelf), reduced motion, axe in both modes, no em dash, console clean.
// Usage: BASE=http://localhost:3200 node tools/pustaka/p1-qa.mjs <absolute scratch directory>
// (screenshots stay in that directory, never in the repo)
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright";

const base = process.env.BASE || "http://localhost:3200";
const out = process.argv[2];
if (!out) throw new Error("Pass an output directory");
mkdirSync(out, { recursive: true });
const AXE = readFileSync(
  fileURLToPath(
    new URL("../../site/node_modules/axe-core/axe.min.js", import.meta.url),
  ),
  "utf8",
);

const LIST = { id: "/artikel", en: "/en/articles" };
const KEYS = ["admin", "service", "team", "promo", "money"];
const ASK = {
  id: {
    term: "chat pembeli",
    key: "service",
    slug: "asisten-ai-untuk-balas-chat-pembeli",
    none: "kucing terbang",
    topic: "promo",
  },
  en: {
    term: "customer chats",
    key: "service",
    slug: "ai-assistant-for-customer-chats",
    none: "flying cats",
    topic: "promo",
  },
};
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
// Since P4 the HTML-only page (CSS desk, result cards) is what a browser without WebGL gets; the 3D desk and
// Tanya on it are checked by p4-shots.mjs.
let browser;
for (const channel of ["msedge", "chrome", undefined])
  try {
    browser = await chromium.launch({
      channel,
      args: ["--disable-3d-apis", "--disable-webgl"],
    });
    break;
  } catch {
    /* next */
  }

async function open(viewport, url, tag, options = {}) {
  const context = await browser.newContext({
    viewport,
    hasTouch: viewport.width < 1024,
    ...options,
  });
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
  await page.goto(base + url, { waitUntil: "networkidle" });
  await page.evaluate(() => document.fonts.ready);
  return { context, page, consoleErrors };
}

async function axe(page) {
  await page.addScriptTag({ content: AXE });
  return page.evaluate(async () => {
    const r = await window.axe.run(
      { include: [["main"]] },
      { resultTypes: ["violations"] },
    );
    return r.violations.map((v) => ({
      id: v.id,
      impact: v.impact,
      nodes: v.nodes.map((n) =>
        `${n.target.join(" ")} ${n.any[0]?.message ?? ""}`.slice(0, 220),
      ),
    }));
  });
}
const serious = (list) =>
  list.some((v) => v.impact === "serious" || v.impact === "critical");

const statusText = (page) => page.locator(".tanya-status").textContent();
const cardKeys = (page) =>
  page.$$eval(".tanya-results .result-link", (links) =>
    links.map((a) => decodeURI(new URL(a.href).pathname)),
  );

for (const locale of ["id", "en"]) {
  for (const viewport of VIEWPORTS) {
    const tag = `${locale} ${viewport.width}`;
    const { context, page, consoleErrors } = await open(
      viewport,
      LIST[locale],
      tag,
    );

    // ---------- hero and shelf ----------
    const shop = await page.evaluate(() => {
      const books = [...document.querySelectorAll(".rak-buku .buku")];
      const inside = books.every((book) => {
        const b = book.getBoundingClientRect();
        return [
          ...book.querySelectorAll(".buku-cat, .sampul, .buku-time"),
        ].every((part) => {
          const r = part.getBoundingClientRect();
          return (
            r.left >= b.left - 0.5 &&
            r.right <= b.right + 0.5 &&
            r.top >= b.top - 0.5 &&
            r.bottom <= b.bottom + 0.5
          );
        });
      });
      const clipped = [...document.querySelectorAll(".rak-buku .ttl")].filter(
        (el) => el.scrollHeight > el.clientHeight + 1,
      );
      const stage = document.querySelector(".pustaka-stage");
      const hero = document
        .querySelector(".pustaka-hero")
        .getBoundingClientRect();
      const actions = document
        .querySelector(".pustaka-actions")
        .getBoundingClientRect();
      return {
        h1: document.querySelectorAll("h1").length,
        overflow: document.documentElement.scrollWidth - window.innerWidth,
        books: books.map((b) => b.closest("a").dataset.key),
        colors: books.map((b) => b.dataset.color),
        inside,
        clippedTitles: clipped.length,
        stageName:
          stage.getAttribute("role") === "img" &&
          stage.getAttribute("aria-label")?.length > 10,
        buttons: document.querySelectorAll(".pustaka-actions > *").length,
        actionsInHero: actions.bottom <= hero.bottom,
        emDash: (document.querySelector("main").innerText.match(/—/g) || [])
          .length,
        jsonLd: [
          ...document.querySelectorAll('script[type="application/ld+json"]'),
        ].map((s) => JSON.parse(s.textContent)["@type"]),
      };
    });
    check(`${tag} one h1`, shop.h1 === 1, String(shop.h1));
    check(
      `${tag} no sideways scroll`,
      shop.overflow <= 0,
      `${shop.overflow}px`,
    );
    check(
      `${tag} five books in shelf order`,
      JSON.stringify(shop.books) === JSON.stringify(KEYS),
      shop.books.join(),
    );
    check(
      `${tag} book colours set for the 3D pass`,
      shop.colors.every((c) => /^#[0-9a-f]{6}$/i.test(c)),
      shop.colors.join(),
    );
    check(`${tag} chip, cover and time inside each book`, shop.inside);
    check(
      `${tag} no title cut off`,
      shop.clippedTitles === 0,
      String(shop.clippedTitles),
    );
    check(`${tag} desk picture has a name`, shop.stageName);
    check(
      `${tag} two hero buttons inside the hero`,
      shop.buttons === 2 && shop.actionsInHero,
    );
    check(`${tag} no em dash`, shop.emDash === 0, String(shop.emDash));
    check(
      `${tag} JSON-LD CollectionPage + BreadcrumbList`,
      shop.jsonLd.includes("CollectionPage") &&
        shop.jsonLd.includes("BreadcrumbList"),
      shop.jsonLd.join(),
    );

    if (viewport.width === 375) {
      // the last book can be swiped into view on a phone
      const reach = await page.evaluate(async () => {
        const track = document.querySelector(".rak-buku .track");
        track.scrollLeft = track.scrollWidth;
        await new Promise((r) => setTimeout(r, 400));
        const last = document
          .querySelector(".rak-buku .slot:last-child")
          .getBoundingClientRect();
        const first =
          ((track.scrollLeft = 0),
          await new Promise((r) => setTimeout(r, 400)),
          document.querySelector(".rak-buku .slot").getBoundingClientRect());
        return {
          lastIn: last.right <= innerWidth + 1 && last.left >= -1,
          firstIn: first.left >= 0,
        };
      });
      check(
        `${tag} shelf swipes to the last book and back`,
        reach.lastIn && reach.firstIn,
        JSON.stringify(reach),
      );
    }
    if (viewport.width === 1440) {
      const centred = await page.evaluate(() => {
        const track = document.querySelector(".rak-buku .track");
        return track.scrollWidth <= track.clientWidth + 1;
      });
      check(`${tag} all five books fit on a wide screen`, centred);
      // keyboard: the first book link is reachable and lifts
      await page.locator(".rak-buku .buku-link").first().focus();
      await page.keyboard.press("Tab");
      await page.keyboard.press("Shift+Tab");
      const lifted = await page.evaluate(
        () =>
          getComputedStyle(document.activeElement.querySelector(".buku"))
            .transform !== "none",
      );
      check(`${tag} focused book lifts`, lifted);
    }
    if (viewport.width === 1280) {
      const result = await axe(page);
      check(
        `${tag} axe shop serious/critical`,
        !serious(result),
        JSON.stringify(result),
      );
    }
    if (viewport.width === 375 || viewport.width === 1440)
      await page.screenshot({
        path: join(out, `shop-${locale}-${viewport.width}.png`),
        fullPage: true,
      });

    // ---------- Tanya pustakawan ----------
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.locator(".pustaka-actions .is-primary").click();
    await page.waitForSelector(".tanya-panel");
    const opened = await page.evaluate(() => ({
      hash: location.hash,
      focus: document.activeElement?.id,
      hidden: [".pustaka-hero", ".rak-buku", ".articles-band"].every(
        (s) => getComputedStyle(document.querySelector(s)).display === "none",
      ),
      labels: [
        ...document.querySelectorAll(".kartu-pinjam :is(input, select)"),
      ].map((el) => el.labels?.[0]?.textContent?.trim()),
      search: Boolean(document.querySelector("search form")),
      status: document.querySelector(".tanya-status")?.getAttribute("role"),
    }));
    check(
      `${tag} Tanya opens on #tanya`,
      opened.hash === "#tanya" && opened.hidden,
      JSON.stringify(opened),
    );
    check(
      `${tag} Tanya heading takes focus`,
      opened.focus === "tanya-h",
      String(opened.focus),
    );
    check(
      `${tag} card fields have labels`,
      opened.labels.length === 2 && opened.labels.every(Boolean),
      opened.labels.join("|"),
    );
    check(
      `${tag} card is a search landmark with a status region`,
      opened.search && opened.status === "status",
    );

    const ask = ASK[locale];
    await page.locator(".kartu-pinjam input").fill(ask.term);
    await page.locator(".kartu-submit").click();
    await page.waitForSelector(".tanya-results");
    const found = await cardKeys(page);
    check(
      `${tag} "${ask.term}" finds the ${ask.key} book`,
      found.length === 1 && found[0] === `${LIST[locale]}/${ask.slug}`,
      found.join(),
    );
    check(
      `${tag} status announces the count`,
      /1/.test(await statusText(page)),
      await statusText(page),
    );
    // smooth scrolling takes a moment: wait for the bar to land under the header
    const barVisible = await page
      .waitForFunction(
        () => {
          const r = document
            .querySelector(".tanya-results .result-bar")
            .getBoundingClientRect();
          return r.top >= 0 && r.top < innerHeight / 2;
        },
        null,
        { timeout: 4000 },
      )
      .then(() => true)
      .catch(() => false);
    const barAt = await page.evaluate(
      () =>
        `scrollY ${Math.round(scrollY)}, bar top ${Math.round(document.querySelector(".tanya-results .result-bar").getBoundingClientRect().top)}`,
    );
    check(`${tag} result bar scrolled into view`, barVisible, barAt);
    if (viewport.width === 375 || viewport.width === 1440)
      await page.screenshot({
        path: join(out, `tanya-found-${locale}-${viewport.width}.png`),
      });

    await page.locator(".tanya-results .result-bar button").click();
    const again = await page.evaluate(() => ({
      results: Boolean(document.querySelector(".tanya-results")),
      focus: document.activeElement?.tagName,
    }));
    check(
      `${tag} Tanya lagi clears results and returns to the field`,
      !again.results && again.focus === "INPUT",
      JSON.stringify(again),
    );

    await page.locator(".kartu-pinjam input").fill(ask.none);
    await page.locator(".kartu-submit").click();
    await page.waitForSelector(".tanya-results");
    const empty = await cardKeys(page);
    check(
      `${tag} no match shows all five books`,
      empty.length === 5 && (await page.locator(".tanya-all").count()) === 1,
      String(empty.length),
    );
    check(
      `${tag} status announces no match`,
      (await statusText(page)).length > 10,
      await statusText(page),
    );
    if (viewport.width === 375 || viewport.width === 1440)
      await page.screenshot({
        path: join(out, `tanya-empty-${locale}-${viewport.width}.png`),
        fullPage: true,
      });

    await page.locator(".tanya-results .result-bar button").click();
    await page.locator(".kartu-pinjam input").fill("");
    await page.locator(".kartu-pinjam select").selectOption(ask.topic);
    await page.locator(".kartu-submit").click();
    await page.waitForSelector(".tanya-results");
    check(
      `${tag} topic alone narrows to one book`,
      (await cardKeys(page)).length === 1,
    );

    if (viewport.width === 1280) {
      const result = await axe(page);
      check(
        `${tag} axe Tanya serious/critical`,
        !serious(result),
        JSON.stringify(result),
      );
    }

    await page.keyboard.press("Escape");
    await page.waitForFunction(
      () =>
        location.hash === "" &&
        document.querySelector(".pustaka-hero").offsetParent,
    );
    check(`${tag} Escape returns to the shelf`, true);
    await page.locator(".pustaka-actions .is-primary").click();
    await page.waitForSelector(".tanya-panel");
    await page.goBack();
    await page.waitForFunction(() => !document.querySelector(".tanya-panel"));
    check(
      `${tag} Back returns to the shelf`,
      await page.evaluate(() => location.hash === ""),
    );

    check(
      `${tag} console clean`,
      consoleErrors.length === 0,
      consoleErrors.join(" | "),
    );
    await context.close();
  }
}

// ---------- reduced motion and direct #tanya ----------
for (const locale of ["id", "en"]) {
  const tag = `${locale} reduced #tanya`;
  const { context, page, consoleErrors } = await open(
    { width: 390, height: 844 },
    `${LIST[locale]}#tanya`,
    tag,
    {
      reducedMotion: "reduce",
    },
  );
  // the hash is read after hydration, so wait for the panel instead of reading it right after load
  const panel = await page
    .waitForSelector(".tanya-panel", { timeout: 10000 })
    .catch(() => null);
  check(`${tag} opens Tanya directly`, Boolean(panel));
  await page.locator(".kartu-pinjam input").fill(ASK[locale].term);
  await page.locator(".kartu-submit").click();
  await page.waitForSelector(".tanya-results");
  check(`${tag} search works`, (await cardKeys(page)).length === 1);
  check(
    `${tag} console clean`,
    consoleErrors.length === 0,
    consoleErrors.join(" | "),
  );
  await context.close();
}

await browser.close();
writeFileSync(join(out, "p1-qa.json"), JSON.stringify(report, null, 2));
const failed = report.checks.filter((c) => !c.ok);
console.log(
  `${report.checks.length - failed.length}/${report.checks.length} lulus`,
);
for (const f of failed) console.log("FAIL", f.name, f.detail);
for (const e of report.errors) console.log("ERROR", e);
process.exitCode = failed.length || report.errors.length ? 1 : 0;
