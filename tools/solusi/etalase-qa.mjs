// S5b R5: browser QA of the Solusi page after the 13 Nov etalase revision (v1 artefak 13 Nov).
// Etalase (HTML + 3D), contact dialog, Cari, Kartu masalah, hasil, ID/EN, reduced motion, no WebGL,
// budgets and axe. Run against a production build.
// Usage: BASE=http://localhost:3100 node tools/solusi/etalase-qa.mjs <output directory>
import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright";

const base = process.env.BASE || "http://localhost:3100";
const out = process.argv[2];
if (!out) throw new Error("Pass an output directory (outside public/git)");
mkdirSync(out, { recursive: true });
const AXE = fileURLToPath(
  new URL("../../site/node_modules/axe-core/axe.min.js", import.meta.url),
);
const VIEWS = {
  desktop: [1440, 900, false],
  tablet: [820, 1180, false],
  hp: [390, 844, true],
};
const IGNORE = /_vercel\/insights|favicon/;

const results = [];
const check = (scope, name, ok, note = "") => {
  results.push({
    scope,
    name,
    ok: Boolean(ok),
    note: typeof note === "string" ? note : JSON.stringify(note),
  });
};
const wait = (page, ms) => page.waitForTimeout(ms);

async function open(browser, view, path, { reduced = false, init } = {}) {
  const [width, height, touch] = VIEWS[view];
  const ctx = await browser.newContext({
    viewport: { width, height },
    hasTouch: touch,
    isMobile: touch,
    reducedMotion: reduced ? "reduce" : "no-preference",
  });
  if (init) await ctx.addInitScript(init);
  const page = await ctx.newPage();
  const errors = [];
  page.on("pageerror", (e) => errors.push(e.message));
  // A failed request shows in the console without its URL, so 404s are judged by URL here instead:
  // the Vercel analytics script only exists on Vercel.
  page.on(
    "console",
    (m) =>
      m.type() === "error" &&
      !/Failed to load resource/.test(m.text()) &&
      !IGNORE.test(m.text()) &&
      errors.push(m.text()),
  );
  page.on(
    "response",
    (r) =>
      r.status() >= 400 &&
      !IGNORE.test(r.url()) &&
      errors.push(`${r.status()} ${r.url()}`),
  );
  await page.goto(`${base}${path}`, {
    waitUntil: "networkidle",
    timeout: 120000,
  });
  await page.evaluate(() => document.fonts.ready);
  return { ctx, page, errors };
}
const worldReady = (page) =>
  page.waitForFunction(() => window.__solusi?.ready, null, { timeout: 60000 });

async function axe(page, scope, name) {
  await page.addScriptTag({ path: AXE });
  const run = (context, contrast = true) =>
    page.evaluate(
      async ([context, contrast]) => {
        const r = await window.axe.run(context, {
          runOnly: {
            type: "tag",
            values: ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"],
          },
          rules: { "color-contrast": { enabled: contrast } },
        });
        return r.violations
          .filter((x) => x.impact === "serious" || x.impact === "critical")
          .map(
            (x) =>
              `${x.id} (${x.nodes.length}): ${x.nodes[0]?.target?.join(" ")}`,
          );
      },
      [context, contrast],
    );
  // The site-wide header (shared with Home) is reported on its own, outside the Solusi verdict.
  // With WebGL the shop room, shelf boxes and face panels are painted on the canvas, which axe cannot see (it
  // reads the transparent CSS behind them), so the shelves' contrast is judged in the no-WebGL run,
  // where the same colours are CSS backgrounds.
  const gl = await page.evaluate(() =>
    Boolean(document.querySelector(".solusi-world-ready")),
  );
  const v = [
    ...(await run({ exclude: [["header"]] }, false)),
    ...(await run({
      exclude: gl
        ? [["header"], [".etalase .tiers"], [".toko-hero"]]
        : [["header"]],
    })),
  ].filter((x, i, all) => all.indexOf(x) === i);
  check(
    scope,
    `axe ${name}: tanpa pelanggaran serius/kritis`,
    v.length === 0,
    v.join(" | "),
  );
  const header = await run({ include: [["header"]] });
  if (header.length) headerAxe.add(header.join(" | "));
}
const headerAxe = new Set();

async function etalase(browser, view, locale) {
  const scope = `${view}/${locale}`;
  const touch = VIEWS[view][2];
  const { ctx, page, errors } = await open(
    browser,
    view,
    locale === "id" ? "/solusi" : "/en/solutions",
  );
  await worldReady(page);
  await page.evaluate(() => {
    const h = document.querySelector(".etalase .counter-h");
    scrollTo(0, h.getBoundingClientRect().top + scrollY - 92);
  });
  await wait(page, 900);
  const et = await page.evaluate(() => {
    const prods = [...document.querySelectorAll(".etalase .prod")];
    return {
      prods: prods.length,
      tiers: document.querySelectorAll(".etalase .tier").length,
      ide: document.querySelectorAll(".etalase .st.ide").length,
      clipped: prods.filter((a) => {
        const c = a.querySelector(".cover").getBoundingClientRect();
        return [...a.querySelectorAll(".ttl,.sub,.fit")].some(
          (e) => e.getBoundingClientRect().bottom > c.bottom + 0.5,
        );
      }).length,
      chipRows: Math.max(
        ...prods.map(
          (a) =>
            new Set(
              [...a.querySelectorAll(".chips > span")].map((s) => s.offsetTop),
            ).size,
        ),
      ),
      overflowX: document.documentElement.scrollWidth > innerWidth + 1,
      rak: window.__solusi.rak,
      drawCalls: window.__solusi.drawCalls,
      tris: window.__solusi.renderTriangles,
    };
  });
  check(
    scope,
    "etalase: 12 kotak di 7 rak, 8 Siap dibuat",
    et.prods === 12 && et.tiers === 7 && et.ide === 8,
    et,
  );
  check(
    scope,
    "etalase: isi sampul tidak meluap, chip ≤ 2 baris",
    et.clipped === 0 && et.chipRows <= 2,
    et,
  );
  check(scope, "etalase: tanpa scroll horizontal halaman", !et.overflowX);
  check(
    scope,
    "rak 3D: 12 kotak dan 7 papan tergambar",
    et.rak.boxes === 12 && et.rak.planks === 7 && et.rak.rows > 0,
    et.rak,
  );
  check(
    scope,
    "anggaran: < 60 draw call, < 80 ribu segitiga",
    et.drawCalls < 60 && et.tris < 80000,
    `${et.drawCalls} / ${et.tris}`,
  );
  const name = (
    await page.locator(".etalase .prod").first().ariaSnapshot()
  ).replace(/\s+/g, " ");
  check(
    scope,
    "nama tautan kotak: status, judul, bidang usaha, aplikasi",
    /(Sudah berjalan|In use)/.test(name) &&
      /(Jasa|Services)/.test(name) &&
      /(Aplikasi|Apps):/.test(name),
    name.slice(0, 200),
  );
  const rel = () =>
    page.evaluate(() => {
      const s = document.querySelector(".etalase .slot");
      return (
        s.getBoundingClientRect().top -
        s.querySelector(".pk").getBoundingClientRect().top
      );
    });
  if (!touch) {
    const b = await page.locator(".etalase .prod").first().boundingBox();
    await page.mouse.move(b.x + b.width / 2, b.y + b.height / 2);
    await wait(page, 450);
    const lift = {
      html: await rel(),
      gl: await page.evaluate(() => window.__solusi.rak.firstLift),
    };
    check(
      scope,
      "hover: kotak HTML dan 3D naik 6 px",
      Math.abs(lift.html - 6) < 0.6 && Math.abs(lift.gl - 6) < 0.6,
      lift,
    );
    await page.screenshot({
      path: join(out, `${scope.replace("/", "-")}-etalase-hover.png`),
    });
    await page.mouse.move(4, VIEWS[view][1] - 4);
    await wait(page, 450);
  } else
    await page.screenshot({
      path: join(out, `${scope.replace("/", "-")}-etalase.png`),
    });
  await page.evaluate(() => document.querySelector(".etalase .prod").focus());
  await page.keyboard.press("Shift+Tab");
  await page.keyboard.press("Tab");
  await wait(page, 450);
  const fv = await page.evaluate(() => ({
    visible: document.activeElement.matches(".prod:focus-visible"),
    outline: getComputedStyle(document.activeElement.querySelector(".cover"))
      .outlineStyle,
  }));
  check(
    scope,
    "fokus keyboard: naik 6 px, outline cyan",
    Math.abs((await rel()) + 0 - 6) < 0.6 &&
      fv.visible &&
      fv.outline === "solid",
    fv,
  );
  await page.evaluate(() => document.activeElement.blur());
  const arrows = await page.evaluate(() =>
    [...document.querySelectorAll(".etalase .tier")].every((t) => {
      const tr = t.querySelector(".track");
      const nx = t.querySelector(".arr.next");
      const shown = !nx.hidden && getComputedStyle(nx).display !== "none";
      return (
        shown === (tr.scrollWidth > tr.clientWidth + 2 && innerWidth > 760)
      );
    }),
  );
  check(scope, "panah rak hanya saat overflow (tidak di HP)", arrows);
  if (touch) {
    const tr = page.locator(".etalase .track").first();
    await tr.evaluate((e) => e.scrollBy({ left: 230 }));
    await wait(page, 700);
    const left = await tr.evaluate((e) => e.scrollLeft);
    check(
      scope,
      "rak HP bergeser dan berhenti di kotak",
      left > 0 && left % 230 < 2,
      String(left),
    );
  }
  if (locale === "id") await axe(page, scope, "etalase");
  if (view === "desktop" && locale === "id") {
    await page.locator(".etalase .prod").first().click();
    await page
      .waitForURL(/\/solusi\/booking-jasa$/, { timeout: 30000 })
      .catch(() => {});
    check(
      scope,
      "klik kotak membuka detail",
      /\/solusi\/booking-jasa$/.test(page.url()),
      page.url(),
    );
    await page.goBack();
    await page.waitForURL(/\/solusi$/, { timeout: 30000 }).catch(() => {});
    check(
      scope,
      "Back kembali ke etalase",
      /\/solusi$/.test(page.url()),
      page.url(),
    );
  }
  check(
    scope,
    "console bersih (etalase)",
    errors.length === 0,
    errors.slice(0, 3).join(" | "),
  );
  await ctx.close();
}

async function chipsMore(browser) {
  // Data today never needs a third chip row, so widen the chips to exercise the "+N" fold.
  const { ctx, page } = await open(browser, "desktop", "/solusi", {
    init: () =>
      document.addEventListener("DOMContentLoaded", () => {
        const s = document.createElement("style");
        s.textContent =
          ".etalase .cover .chips > span{padding:0 26px 0 22px!important}";
        document.head.append(s);
      }),
  });
  await wait(page, 1500);
  const r = await page.evaluate(() =>
    [...document.querySelectorAll(".etalase .prod")].map((a) => ({
      rows: new Set(
        [...a.querySelectorAll(".chips > span")].map((s) => s.offsetTop),
      ).size,
      more: a.querySelector(".chips .more")?.textContent || "",
      shown: a.querySelectorAll(".chips > span:not(.more)").length,
      sr: a.querySelector(".fit .sr-only").textContent,
    })),
  );
  const folded = r.filter((x) => x.more);
  check(
    "desktop/id",
    "chip lebar: muncul '+N', tetap ≤ 2 baris, daftar lengkap di sr-only",
    folded.length > 0 &&
      r.every((x) => x.rows <= 2) &&
      folded.every(
        (x) => x.sr.split(", ").length === x.shown + Number(x.more.slice(1)),
      ),
    folded.slice(0, 3),
  );
  await ctx.close();
}

async function contactAndSearch(browser, view) {
  const scope = `${view}/id`;
  const touch = VIEWS[view][2];
  const { ctx, page, errors } = await open(browser, view, "/solusi");
  await worldReady(page);
  // contact dialog from the header button
  const header = page.locator("header [data-contact]").first();
  if (await header.isVisible()) {
    await header.click();
    await wait(page, 300);
    const d = await page.evaluate(() => {
      const dlg = document.querySelector("dialog.contact-dialog");
      return {
        open: !!dlg?.open,
        focus: document.activeElement?.className || "",
        channels: dlg?.querySelectorAll(".contact-list a, .contact-list button")
          .length,
      };
    });
    check(
      scope,
      "Header 'Konsultasi gratis' membuka pop up kontak, fokus ke tombol tutup",
      d.open && /contact-close/.test(d.focus),
      d,
    );
    await page.keyboard.press("Escape");
    await wait(page, 250);
    check(
      scope,
      "Esc menutup pop up kontak",
      !(await page.evaluate(
        () => document.querySelector("dialog.contact-dialog")?.open,
      )),
    );
  }
  // Cari
  await page.locator(".toko-hero .toko-actions .is-primary").click();
  await page.waitForFunction(() => location.hash === "#cari");
  await page.locator(".receipt-submit").click();
  await page.waitForFunction(
    () =>
      window.__solusi?.boxes?.count === 6 &&
      !window.__solusi.boxes.moving &&
      document.querySelectorAll("[data-box-tag]:not([hidden])").length === 6,
    null,
    { timeout: 15000 },
  );
  await wait(page, 300);
  const served = await page.evaluate(() => {
    const tags = [
      ...document.querySelectorAll("[data-box-tag]:not([hidden])"),
    ].map((t) => t.getBoundingClientRect());
    const overlap = tags.some((a, i) =>
      tags.some(
        (b, j) =>
          j > i &&
          a.left < b.right &&
          b.left < a.right &&
          a.top < b.bottom &&
          b.top < a.bottom,
      ),
    );
    return {
      overlap,
      inside: tags.every(
        (r) =>
          r.left >= 0 &&
          r.right <= innerWidth &&
          r.top >= 0 &&
          r.bottom <= innerHeight,
      ),
      rows: window.__solusi.boxes.rows,
      drawCalls: window.__solusi.drawCalls,
      tris: window.__solusi.renderTriangles,
    };
  });
  check(
    scope,
    `Cari: 6 kotak, ${touch ? "2 baris" : "1 baris"}, tag terpisah dan di layar`,
    !served.overlap && served.inside && served.rows === (touch ? 2 : 1),
    served,
  );
  check(
    scope,
    "anggaran saat 6 kotak: < 60 draw call, < 80 ribu segitiga",
    served.drawCalls < 60 && served.tris < 80000,
    `${served.drawCalls} / ${served.tris}`,
  );
  await page.screenshot({ path: join(out, `${view}-cari-6.png`) });
  // summary: tag, then (fine pointer) the 3D box itself
  await page.locator("[data-box-tag='0']").click();
  await page.waitForSelector("[data-box-summary]");
  const sum = await page.locator("[data-box-summary]").boundingBox();
  check(
    scope,
    "tag 1 membuka ringkasan di dalam layar",
    sum &&
      sum.x >= 0 &&
      sum.y >= 0 &&
      sum.x + sum.width <= VIEWS[view][0] + 0.5 &&
      sum.y + sum.height <= VIEWS[view][1] + 0.5,
    sum,
  );
  await page.screenshot({ path: join(out, `${view}-ringkasan.png`) });
  await page.keyboard.press("Escape");
  await page.waitForFunction(
    () => !document.querySelector("[data-box-summary]"),
  );
  check(scope, "Esc menutup ringkasan", true);
  if (!touch) {
    const t = await page.locator("[data-box-tag='2']").boundingBox();
    await page.mouse.move(t.x + t.width / 2, t.y + t.height / 2 + 70);
    const hovered = await page
      .waitForSelector("[data-box-summary]", { timeout: 2000 })
      .then(
        () => true,
        () => false,
      );
    check(scope, "hover kotak 3D di meja membuka ringkasan", hovered);
    await page.mouse.move(4, 4);
    await wait(page, 500);
  } else {
    await page.locator("[data-box-tag='1']").tap();
    await page.locator(".box-summary-close").tap();
    check(
      scope,
      "tombol X menutup ringkasan HP",
      !(await page.locator("[data-box-summary]").count()),
    );
  }
  // pagination 7-12
  await page.locator(".pagination button").last().click();
  await page.waitForFunction(() =>
    document.querySelector(".pagination span")?.textContent?.includes("2 / 2"),
  );
  await page.waitForFunction(() => !window.__solusi.boxes.moving);
  check(
    scope,
    "halaman 2 menyajikan 7 sampai 12",
    (await page.locator("[data-box-tag]").allTextContents()).join(",") ===
      "7,8,9,10,11,12",
  );
  await page.locator(".pagination button").first().click();
  await page.waitForFunction(() =>
    document.querySelector(".pagination span")?.textContent?.includes("1 / 2"),
  );
  // keywords via "Cari kembali"
  const counts = {};
  for (const [term, n] of [
    ["stok", 1],
    ["dokumen", 2],
    ["pemilik", 3],
    ["jadwal", 4],
    ["pelanggan", 5],
  ]) {
    await page.locator(".result-bar button").click();
    await page.waitForFunction(
      () => !document.querySelector(".solusi-page.served"),
    );
    await page.locator(".receipt input").fill(term);
    await page.locator(".receipt-submit").click();
    await page
      .waitForFunction(
        (k) =>
          window.__solusi?.boxes?.count === k && !window.__solusi.boxes.moving,
        n,
        { timeout: 15000 },
      )
      .catch(() => {});
    counts[term] = await page.evaluate(() => window.__solusi.boxes.count);
  }
  check(
    scope,
    "Cari kembali + kata kunci memberi 1/2/3/4/5 hasil",
    Object.values(counts).join() === "1,2,3,4,5",
    counts,
  );
  await axe(page, scope, "Cari tersaji");
  await page.locator(".panel-close").click();
  await page.waitForFunction(
    () => !location.hash && !document.querySelector(".solusi-page.focus"),
  );
  check(scope, "tutup panel Cari kembali ke etalase", true);
  check(
    scope,
    "console bersih (Cari)",
    errors.length === 0,
    errors.slice(0, 3).join(" | "),
  );
  await ctx.close();
}

async function cards(browser, view) {
  const scope = `${view}/id`;
  const { ctx, page, errors } = await open(browser, view, "/solusi");
  await worldReady(page);
  await page.locator(".toko-hero .toko-actions .is-paper").click();
  await page.waitForSelector(".industry-grid button");
  await page.locator(".industry-grid button").first().click();
  await page.locator(".industry-sheet .solusi-button").click();
  await page.waitForSelector(".problem-card.is-top", { timeout: 6000 });
  await axe(page, scope, "Kartu masalah");
  let answered = 0;
  for (let i = 0; i < 9; i++) {
    const top = page.locator(".problem-card.is-top");
    if (!(await top.count())) break;
    if (i % 3 === 0) {
      const b = await top.boundingBox();
      await page.mouse.move(b.x + b.width / 2, b.y + b.height / 2);
      await page.mouse.down();
      await page.mouse.move(b.x + b.width / 2 + 160, b.y + b.height / 2, {
        steps: 8,
      });
      await page.mouse.up();
    } else if (i % 3 === 1) {
      await page.locator(".answer-no").click();
    } else {
      await top.focus();
      await page.keyboard.press("ArrowRight");
    }
    answered++;
    await wait(page, 600);
  }
  await page
    .waitForURL(/\/solusi\/hasil\?/, { timeout: 15000 })
    .catch(() => {});
  check(
    scope,
    "9 kartu (geser, tombol Tidak, panah kanan) lalu ke hasil",
    /\/solusi\/hasil\?/.test(page.url()) && answered === 9,
    page.url(),
  );
  await page.waitForSelector(".rank-card", { timeout: 15000 }).catch(() => {});
  check(
    scope,
    "hasil: ada rekomendasi berurutan tanpa persen",
    (await page.locator(".rank-card").count()) > 0 &&
      !(await page.locator(".hasil-page").innerText()).includes("%"),
  );
  await page.screenshot({ path: join(out, `${view}-hasil.png`) });
  await axe(page, scope, "hasil");
  await page.locator(".hasil-actions [data-contact]").click();
  await wait(page, 300);
  const msg = await page.evaluate(
    () => document.querySelector("dialog.contact-dialog")?.open,
  );
  check(scope, "hasil: 'Konsultasi gratis' membuka pop up kontak", msg);
  await page.keyboard.press("Escape");
  await page.locator(".hasil-actions .is-paper").click();
  await page.waitForURL(/\/solusi#kartu$/, { timeout: 15000 }).catch(() => {});
  check(
    scope,
    "hasil: Ulangi kembali ke Kartu masalah",
    /#kartu$/.test(page.url()),
    page.url(),
  );
  await page.waitForSelector(".industry-sheet .solusi-button");
  await page.locator(".industry-sheet .solusi-button").click();
  await page.waitForSelector(".problem-card.is-top", { timeout: 6000 });
  await page.locator(".problem-card.is-top").focus();
  await page.keyboard.press("ArrowUp");
  await page
    .waitForURL(/\/solusi\/hasil\?/, { timeout: 15000 })
    .catch(() => {});
  check(
    scope,
    "panah atas (Solusi) langsung ke hasil",
    /\/solusi\/hasil\?/.test(page.url()),
  );
  await page.locator(".text-back").click();
  await page.waitForURL(/\/solusi$/, { timeout: 15000 }).catch(() => {});
  check(
    scope,
    "hasil: Kembali ke etalase",
    /\/solusi$/.test(page.url()),
    page.url(),
  );
  check(
    scope,
    "console bersih (Kartu, hasil)",
    errors.length === 0,
    errors.slice(0, 3).join(" | "),
  );
  await ctx.close();
}

async function fallbacks(gpuBrowser, noGlBrowser) {
  // reduced motion: boxes land at once, no 3D card flight
  const r = await open(gpuBrowser, "hp", "/solusi#cari", { reduced: true });
  await worldReady(r.page);
  await r.page.locator(".receipt-submit").click();
  await r.page.waitForFunction(
    () => window.__solusi?.boxes?.count === 6,
    null,
    { timeout: 10000 },
  );
  // the world keeps a 160 ms settle window after a layout; the boxes themselves land at once
  await wait(r.page, 250);
  check(
    "hp/id",
    "reduced motion: kotak langsung di meja",
    !(await r.page.evaluate(() => window.__solusi.boxes.moving)),
  );
  await r.ctx.close();
  // no WebGL: flat etalase, Cari as HTML cards, Kartu still works
  const n = await open(noGlBrowser, "desktop", "/solusi");
  await wait(n.page, 2500);
  const flat = await n.page.evaluate(() => ({
    ready: document
      .querySelector(".solusi-page")
      .classList.contains("solusi-world-ready"),
    pkBg: getComputedStyle(document.querySelector(".etalase .pk"))
      .backgroundColor,
    coverBg: getComputedStyle(document.querySelector(".etalase .cover"))
      .backgroundColor,
  }));
  check(
    "desktop/no-webgl",
    "etalase versi datar: kotak warna tim, sampul #F1F1F5",
    !flat.ready &&
      flat.pkBg !== "rgba(0, 0, 0, 0)" &&
      flat.coverBg === "rgb(241, 241, 245)",
    flat,
  );
  await n.page.screenshot({ path: join(out, "desktop-no-webgl-etalase.png") });
  await n.page.evaluate(() =>
    document.querySelector(".etalase").scrollIntoView(),
  );
  await axe(n.page, "desktop/no-webgl", "etalase (kontras rak)");
  await n.page.locator(".toko-hero .toko-actions .is-primary").click();
  await n.page.locator(".receipt-submit").click();
  await n.page.waitForSelector(".result-card");
  check(
    "desktop/no-webgl",
    "Cari tanpa WebGL: daftar kartu HTML",
    (await n.page.locator(".result-card").count()) === 6,
  );
  await n.ctx.close();
}

const gpu = await chromium.launch({ channel: "msedge" });
const noGl = await chromium.launch({
  channel: "msedge",
  args: ["--disable-3d-apis", "--disable-webgl"],
});
try {
  for (const view of Object.keys(VIEWS)) await etalase(gpu, view, "id");
  for (const view of ["desktop", "hp"]) await etalase(gpu, view, "en");
  await chipsMore(gpu);
  for (const view of Object.keys(VIEWS)) await contactAndSearch(gpu, view);
  for (const view of ["desktop", "hp"]) await cards(gpu, view);
  await fallbacks(gpu, noGl);
} finally {
  await gpu.close();
  await noGl.close();
}
writeFileSync(join(out, "etalase-qa.json"), JSON.stringify(results, null, 2));
for (const r of results)
  console.log(
    `${r.ok ? "ok   " : "GAGAL"} ${r.scope.padEnd(16)} ${r.name}${r.ok ? "" : "  " + r.note}`,
  );
const failed = results.filter((r) => !r.ok).length;
console.log(`\n${results.length - failed}/${results.length} lulus`);
if (headerAxe.size)
  console.log(
    `Catatan axe header seluruh situs (di luar lingkup Solusi): ${[...headerAxe].join(" || ")}`,
  );
if (failed) process.exitCode = 1;
