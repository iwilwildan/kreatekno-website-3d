// Pustaka P4: the 3D shelf and Tanya pustakawan on the desk, in a few viewports, with the numbers the world
// reports (books on the desk, tags on screen, shelf pass). Screenshots stay in OUT (chat only).
// Usage: BASE=http://localhost:3200 node tools/pustaka/p4-shots.mjs <absolute OUT> [term]
import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { launch } from "../render/lib.mjs";

const OUT = process.argv[2];
if (!OUT) throw new Error("usage: node tools/pustaka/p4-shots.mjs OUT [term]");
const TERM = process.argv[3] || "admin";
mkdirSync(OUT, { recursive: true });
const base = process.env.BASE || "http://localhost:3200";
const VIEWPORTS = [
  [1440, 900],
  [1180, 820],
  [768, 1024],
  [390, 844],
];
const browser = await launch();
const result = {};
const tagRects = (page) =>
  page.evaluate(() =>
    [...document.querySelectorAll("[data-book-tag]:not([hidden])")].map((t) => {
      const r = t.getBoundingClientRect();
      return [Math.round(r.left), Math.round(r.top)];
    }),
  );
for (const [width, height] of VIEWPORTS) {
  const key = `${width}x${height}`;
  const page = await browser.newPage({
    viewport: { width, height },
    hasTouch: width <= 1180,
    reducedMotion: "reduce",
  });
  const errors = [];
  page.on("pageerror", (e) => errors.push(e.message));
  page.on("console", (m) => {
    if (
      m.type() === "error" &&
      !/_vercel|insights|Failed to load resource/.test(m.text())
    )
      errors.push(m.text());
  });
  await page.goto(`${base}/artikel`, { waitUntil: "networkidle" });
  await page.waitForFunction(
    () =>
      window.__pustaka?.ready && document.querySelector(".pustaka-world-ready"),
    null,
    {
      timeout: 120000,
    },
  );
  await page.evaluate(() => document.fonts.ready);
  const v = {};
  // the shelf
  await page.locator(".rak-buku .track").scrollIntoViewIfNeeded();
  await page.waitForTimeout(500);
  v.shelf = await page.evaluate(() => {
    window.__pustaka.render();
    return {
      rackVisible: window.__pustaka.rackVisible,
      rak: window.__pustaka.rak,
      calls: window.__pustaka.drawCalls,
    };
  });
  await page.screenshot({ path: join(OUT, `${key}-rak.png`) });
  // Tanya with results
  await page.evaluate(() => {
    window.scrollTo(0, 0);
    location.hash = "tanya";
  });
  await page.waitForFunction(
    () =>
      window.__pustaka?.focus && document.querySelector(".kartu-pinjam input"),
  );
  await page.locator(".kartu-pinjam input").fill(TERM);
  await page.locator(".kartu-submit").click();
  await page.waitForFunction(
    () => window.__pustaka.books.visible && !window.__pustaka.books.moving,
    null,
    {
      timeout: 20000,
    },
  );
  await page.waitForTimeout(600);
  v.found = await page.evaluate(() => ({
    books: window.__pustaka.books,
    calls: window.__pustaka.drawCalls,
  }));
  v.foundTags = await tagRects(page);
  await page.screenshot({ path: join(OUT, `${key}-tanya.png`) });
  // the first book's summary
  await page.locator("[data-book-tag]").first().click();
  await page.waitForTimeout(400);
  const summary = await page.locator("[data-book-summary]").boundingBox();
  v.summary = summary && {
    inside:
      summary.x >= 0 &&
      summary.y >= 0 &&
      summary.x + summary.width <= width &&
      summary.y + summary.height <= height,
  };
  await page.screenshot({ path: join(OUT, `${key}-ringkasan.png`) });
  await page.keyboard.press("Escape");
  // nothing matches: all books
  await page.locator(".result-bar button").click();
  await page.waitForFunction(() => !window.__pustaka.books.visible, null, {
    timeout: 20000,
  });
  await page.locator(".kartu-pinjam input").fill("zzqqxx");
  await page.locator(".kartu-submit").click();
  await page.waitForFunction(
    () => window.__pustaka.books.count === 5 && !window.__pustaka.books.moving,
    null,
    {
      timeout: 20000,
    },
  );
  await page.waitForTimeout(600);
  v.empty = await page.evaluate(() => window.__pustaka.books);
  v.emptyTags = await tagRects(page);
  await page.screenshot({ path: join(OUT, `${key}-kosong.png`) });
  v.scrollX = await page.evaluate(
    () => document.documentElement.scrollWidth > innerWidth,
  );
  v.errors = errors;
  result[key] = v;
  console.log(key, JSON.stringify(v));
  await page.close();
}
await browser.close();
writeFileSync(join(OUT, "p4.json"), JSON.stringify(result, null, 2));
