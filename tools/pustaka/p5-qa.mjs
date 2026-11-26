// Pustaka P5: QA of /artikel and /en/articles with the 3D library desk, in 11 viewports.
// Per viewport (ID; EN on 1440 and 390): the world is up, the hero lip gap is 8 px, Andi is on screen, the budget
// (< 60 draw calls, < 80k triangles), no sideways scroll; the 3D shelf matches the HTML books and lifts the focused
// book 6 px; Tanya by keyboard (button, heading focus, card, Enter), one result and the "nothing matches" five,
// number tags inside the window and not on top of each other, a tag focused by Tab opens its summary inside the
// window, Escape closes the summary then the panel, Back returns to the shelf; axe on the shelf view and on Tanya
// served; reduced motion (books placed at once, Andi does not turn, no stamping); console clean.
// Usage: BASE=http://localhost:3200 node tools/pustaka/p5-qa.mjs <absolute scratch dir>
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { launch } from "../render/lib.mjs";

const OUT = process.argv[2];
if (!OUT) throw new Error("usage: node tools/pustaka/p5-qa.mjs OUT");
mkdirSync(OUT, { recursive: true });
const base = process.env.BASE || "http://localhost:3200";
const AXE = readFileSync(
  new URL("../../site/node_modules/axe-core/axe.min.js", import.meta.url),
  "utf8",
);
const VIEWPORTS = [
  [1920, 1080],
  [1440, 900],
  [1280, 800],
  [1180, 820],
  [1024, 1366],
  [820, 1180],
  [768, 1024],
  [414, 896],
  [390, 844],
  [375, 812],
  [360, 740],
];
const TERM = { id: "admin", en: "admin" };
const results = [];
const check = (name, ok, detail = "") => {
  results.push({ name, ok: Boolean(ok), detail });
  if (!ok) console.log("FAIL", name, detail);
};

const axe = async (page, include) => {
  await page.addScriptTag({ content: AXE });
  return page.evaluate(async (include) => {
    const r = await window.axe.run(
      { include },
      { resultTypes: ["violations"] },
    );
    return r.violations
      .filter((v) => v.impact === "serious" || v.impact === "critical")
      .map((v) => ({
        id: v.id,
        nodes: v.nodes.map((n) => n.target.join(" ")).slice(0, 3),
      }));
  }, include);
};
const tags = (page) =>
  page.evaluate(() =>
    [...document.querySelectorAll("[data-book-tag]:not([hidden])")].map((t) => {
      const r = t.getBoundingClientRect();
      return {
        x: r.left + r.width / 2,
        y: r.top + r.height / 2,
        w: r.width,
        h: r.height,
      };
    }),
  );
const tagsOk = (list, width, height) => {
  const inside = list.every(
    (t) =>
      t.x - t.w / 2 >= 0 &&
      t.x + t.w / 2 <= width &&
      t.y - t.h / 2 >= 0 &&
      t.y + t.h / 2 <= height,
  );
  let apart = true;
  for (let i = 0; i < list.length; i++)
    for (let j = i + 1; j < list.length; j++)
      if (
        Math.abs(list[i].x - list[j].x) < list[i].w &&
        Math.abs(list[i].y - list[j].y) < list[i].h
      )
        apart = false;
  return { inside, apart };
};
const settle = (page) =>
  page.waitForFunction(
    () => window.__pustaka.books.visible && !window.__pustaka.books.moving,
    null,
    {
      timeout: 30000,
    },
  );

const browser = await launch();
for (const [width, height] of VIEWPORTS) {
  const locales = width === 1440 || width === 390 ? ["id", "en"] : ["id"];
  for (const locale of locales) {
    for (const reduced of width === 1440 || width === 390
      ? [false, true]
      : [false]) {
      const tag = `${locale} ${width}x${height}${reduced ? " reduced" : ""}`;
      const page = await browser.newPage({
        viewport: { width, height },
        hasTouch: width <= 1180,
        reducedMotion: reduced ? "reduce" : "no-preference",
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
      await page.goto(
        `${base}${locale === "id" ? "/artikel" : "/en/articles"}`,
        { waitUntil: "networkidle" },
      );
      const up = await page
        .waitForFunction(
          () =>
            window.__pustaka?.ready &&
            document.querySelector(".pustaka-world-ready"),
          null,
          {
            timeout: 60000,
          },
        )
        .then(() => true)
        .catch(() => false);
      check(`${tag} world up`, up);
      if (!up) {
        await page.close();
        continue;
      }
      await page.evaluate(() => document.fonts.ready);
      await page.waitForTimeout(400);
      const hero = await page.evaluate(() => {
        window.__pustaka.render();
        const s = window.__pustaka;
        return {
          lip: s.lipGap,
          calls: s.drawCalls,
          tris: s.renderTriangles,
          chest: s.librarianScreen,
          head: s.headScreen,
          scrollX: document.documentElement.scrollWidth - innerWidth,
        };
      });
      check(
        `${tag} hero lip 8 px`,
        Math.abs(hero.lip - 8) < 0.5,
        hero.lip.toFixed(3),
      );
      check(
        `${tag} Andi on screen`,
        hero.head.x > 0 &&
          hero.head.x < width &&
          hero.head.y > 0 &&
          hero.chest.y < height,
        JSON.stringify(hero.head),
      );
      check(
        `${tag} hero < 60 draw calls, < 80k triangles`,
        hero.calls < 60 && hero.tris < 80000,
        `${hero.calls} / ${hero.tris}`,
      );
      check(
        `${tag} no sideways scroll`,
        hero.scrollX <= 0,
        `${hero.scrollX}px`,
      );

      // the shelf: 3D books where the HTML books are; Tab to the first book lifts it 6 px
      await page.locator(".rak-buku .track").scrollIntoViewIfNeeded();
      await page.waitForTimeout(300);
      const shelf = await page.evaluate(() => {
        window.__pustaka.render();
        const s = window.__pustaka;
        const b = document
          .querySelector(".rak-buku .buku")
          .getBoundingClientRect();
        return {
          visible: s.rackVisible,
          boxes: s.rak.boxes,
          first: s.rak.firstBox,
          dom: { left: b.left, top: b.top },
        };
      });
      check(
        `${tag} 3D shelf: five books on the HTML books`,
        shelf.visible &&
          shelf.boxes === 5 &&
          Math.abs(shelf.first.left - shelf.dom.left) < 1 &&
          Math.abs(shelf.first.top - shelf.dom.top) < 1,
        JSON.stringify(shelf),
      );
      // a real Tab (focus by script does not match :focus-visible, which lifts the book)
      await page.locator(".rak-buku .buku-link").nth(1).focus();
      await page.keyboard.press("Shift+Tab");
      // SwiftShader draws few frames, so the 200 ms CSS lift can take a second to show: wait for it (3 s at most)
      // (the HTML book first, without forcing renders; then the 3D book must follow it)
      const lifted = () =>
        page
          .waitForFunction(
            () => {
              const book = document.activeElement?.querySelector(".buku");
              const slot = document.activeElement?.closest(".slot");
              return (
                book &&
                slot &&
                Math.abs(
                  slot.getBoundingClientRect().bottom -
                    book.getBoundingClientRect().bottom -
                    6,
                ) < 0.6
              );
            },
            null,
            { timeout: 3000, polling: 100 },
          )
          .then(() => true)
          .catch(() => false);
      // once more if the frames stalled (SwiftShader under load; a direct probe lifts in 0.25-0.75 s every time)
      if (!(await lifted())) {
        await page.keyboard.press("Tab");
        await page.keyboard.press("Shift+Tab");
        await lifted();
      }
      const lift = await page.evaluate(() => {
        window.__pustaka.render();
        return window.__pustaka.rak.firstLift;
      });
      check(
        `${tag} focused book lifts 6 px`,
        Math.abs(lift - 6) < 0.6,
        String(lift),
      );
      if (!reduced && locale === "id") {
        const v = await axe(page, [[".rak-buku"]]);
        check(`${tag} axe shelf`, v.length === 0, JSON.stringify(v));
      }

      // Tanya by keyboard
      await page.evaluate(() => window.scrollTo(0, 0));
      await page.locator(".pustaka-actions .pustaka-button.is-primary").focus();
      await page.keyboard.press("Enter");
      await page.waitForFunction(
        () =>
          window.__pustaka?.focus && document.activeElement?.id === "tanya-h",
        null,
        {
          timeout: 10000,
        },
      );
      check(`${tag} Tanya opens with the heading focused`, true);
      await page.locator(".kartu-pinjam input").fill(TERM[locale]);
      await page.locator(".kartu-pinjam input").press("Enter");
      await settle(page);
      await page.waitForTimeout(500);
      const found = await page.evaluate(() => ({
        books: window.__pustaka.books.count,
        turn: window.__pustaka.turn,
        calls: window.__pustaka.drawCalls,
      }));
      const t1 = await tags(page);
      const t1ok = tagsOk(t1, width, height);
      check(
        `${tag} Tanya finds 1 book`,
        found.books === 1 && t1.length === 1,
        JSON.stringify(found),
      );
      check(
        `${tag} Tanya tag inside the window`,
        t1ok.inside,
        JSON.stringify(t1),
      );
      check(
        `${tag} Tanya < 60 draw calls`,
        found.calls < 60,
        String(found.calls),
      );
      if (reduced)
        check(
          `${tag} reduced: Andi does not turn`,
          Math.abs(found.turn) < 1e-6,
          String(found.turn),
        );
      await page.screenshot({
        path: join(OUT, `${locale}-${width}${reduced ? "-r" : ""}-tanya.png`),
      });
      if (!reduced && locale === "id") {
        const v = await axe(page, [[".tanya-panel"]]);
        check(`${tag} axe Tanya served`, v.length === 0, JSON.stringify(v));
      }
      // Tab to the tag: its summary, inside the window; Escape closes it, the panel stays
      await page.locator("[data-book-tag]").first().focus();
      await page.waitForSelector("[data-book-summary]", { timeout: 5000 });
      await page.waitForTimeout(250);
      const box = await page.locator("[data-book-summary]").boundingBox();
      check(
        `${tag} summary inside the window`,
        box &&
          box.x >= 0 &&
          box.y >= 0 &&
          box.x + box.width <= width + 0.5 &&
          box.y + box.height <= height + 0.5,
        JSON.stringify(box),
      );
      await page.keyboard.press("Escape");
      await page.waitForTimeout(200);
      const afterEsc = await page.evaluate(() => ({
        summary: Boolean(document.querySelector("[data-book-summary]")),
        tanya: location.hash === "#tanya",
      }));
      check(
        `${tag} Escape closes the summary first`,
        !afterEsc.summary && afterEsc.tanya,
        JSON.stringify(afterEsc),
      );
      // nothing matches: Andi shrugs, then all five books
      await page.locator(".result-bar button").click();
      await page.waitForFunction(() => !window.__pustaka.books.visible, null, {
        timeout: 20000,
      });
      await page.locator(".kartu-pinjam input").fill("zzqqxx");
      await page.locator(".kartu-pinjam input").press("Enter");
      await page.waitForFunction(
        () => window.__pustaka.books.count === 5,
        null,
        { timeout: 20000 },
      );
      await settle(page);
      await page.waitForTimeout(500);
      const t5 = await tags(page);
      const t5ok = tagsOk(t5, width, height);
      check(`${tag} empty: five books`, t5.length === 5, String(t5.length));
      check(
        `${tag} empty: tags inside the window and apart`,
        t5ok.inside && t5ok.apart,
        JSON.stringify(t5),
      );
      await page.screenshot({
        path: join(OUT, `${locale}-${width}${reduced ? "-r" : ""}-kosong.png`),
      });
      // Back returns to the shelf
      await page.goBack();
      await page.waitForFunction(
        () => !window.__pustaka.focus && !location.hash,
        null,
        { timeout: 10000 },
      );
      check(`${tag} Back returns to the shelf`, true);
      check(`${tag} console clean`, errors.length === 0, errors.join(" | "));
      await page.close();
    }
  }
}
await browser.close();
writeFileSync(join(OUT, "p5-qa.json"), JSON.stringify(results, null, 2));
const ok = results.filter((r) => r.ok).length;
console.log(`${ok}/${results.length} lulus`);
process.exit(ok === results.length ? 0 : 1);
