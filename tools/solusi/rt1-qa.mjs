// RT1 QA: the "Solusi terkait" shelf on every detail page. Boxes = related(), team colours, links, plank label,
// no sideways scroll, arrows only when the shelf overflows, click to the detail and Back, axe on the shelf.
// Usage: BASE=http://localhost:3300 node --import ./tools/solusi/register.mjs tools/solusi/rt1-qa.mjs <output directory>
// (screenshots stay in that directory, never in the repo)
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { setTimeout as wait } from "node:timers/promises";
import { launch } from "../render/lib.mjs";
import { SOLUSI } from "../../site/content/solusi/index.ts";
import { TIM } from "../../site/content/solusi/taksonomi.ts";
import { related } from "../../site/lib/solusi/related.ts";

const base = process.env.BASE || "http://localhost:3300";
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
const hex = (c) => {
  const [r, g, b] = c.match(/\d+/g).map(Number);
  return `#${[r, g, b].map((v) => v.toString(16).padStart(2, "0")).join("")}`.toUpperCase();
};
const colorOf = (s) => TIM.find((t) => t.id === s.tim[0]).color.toUpperCase();
const path = (locale, slug) =>
  locale === "id" ? `/solusi/${slug}` : `/en/solutions/${slug}`;

const browser = await launch({ gpu: false });

async function open(viewport, url) {
  const context = await browser.newContext({ viewport });
  const page = await context.newPage();
  page.on("pageerror", (e) =>
    report.errors.push(`${url} ${viewport.width}: ${e.message}`),
  );
  await page.goto(base + url, { waitUntil: "networkidle" });
  await page.evaluate(() =>
    document
      .querySelector(".detail-related")
      ?.scrollIntoView({ block: "center" }),
  );
  await wait(300);
  return { context, page };
}

const shelf = (page) =>
  page.evaluate(() => {
    const root = document.querySelector(".detail-related .etalase.is-mini");
    if (!root) return null;
    const track = root.querySelector(".track");
    const arrows = [...root.querySelectorAll(".arr")].map((a) => !a.hidden);
    return {
      boxes: [...root.querySelectorAll(".slot")].map((li) => ({
        href: li.querySelector("a.prod").getAttribute("href"),
        slug: li.querySelector("a.prod").dataset.slug,
        color: getComputedStyle(li.querySelector(".pk")).backgroundColor,
        title: li.querySelector(".ttl").textContent,
      })),
      plank: root.querySelector(".plank").textContent.trim(),
      overflow: track.scrollWidth > track.clientWidth + 2,
      arrows,
      sw: document.documentElement.scrollWidth,
      w: innerWidth,
      rootRight: root.getBoundingClientRect().right,
    };
  });

// 1. Every detail, ID and EN, desktop: boxes, colours, links, plank.
for (const locale of ["id", "en"]) {
  for (const solution of SOLUSI) {
    const url = path(locale, solution.slug);
    const { context, page } = await open({ width: 1440, height: 900 }, url);
    const r = await shelf(page);
    const want = related(solution, SOLUSI);
    check(
      `${url} shelf`,
      r &&
        r.boxes.length === want.length &&
        r.boxes.every(
          (b, i) =>
            b.slug === want[i].slug &&
            b.href === path(locale, want[i].slug) &&
            hex(b.color) === colorOf(want[i]),
        ) &&
        r.plank ===
          (locale === "id"
            ? "Sering dipakai bersama"
            : "Often used together") &&
        r.sw <= r.w &&
        r.arrows.every((a) => a === r.overflow),
      JSON.stringify(r),
    );
    await context.close();
  }
}

// 2. Viewports: no sideways scroll, the shelf stays inside the page, arrows only on desktop overflow.
for (const [name, viewport] of Object.entries({
  wide: { width: 1897, height: 940 },
  tablet: { width: 1024, height: 1366 },
  phone: { width: 390, height: 844 },
  small: { width: 360, height: 740 },
})) {
  const { context, page } = await open(viewport, "/solusi/booking-jasa");
  const r = await shelf(page);
  check(
    `${name} fits`,
    r && r.sw <= viewport.width && r.rootRight <= viewport.width + 0.5,
    JSON.stringify(r),
  );
  await page.screenshot({ path: join(out, `${name}.png`) });
  await context.close();
}

// 3. Click a box → its detail page; Back returns.
{
  const { context, page } = await open(
    { width: 1440, height: 900 },
    "/solusi/booking-jasa",
  );
  const first = await page
    .locator(".detail-related .prod")
    .first()
    .getAttribute("href");
  await page.locator(".detail-related .prod").first().click();
  await page.waitForURL((u) => u.pathname === first, { timeout: 15000 });
  check(
    "click opens the detail",
    new URL(page.url()).pathname === first,
    page.url(),
  );
  await page.goBack({ waitUntil: "networkidle" });
  check(
    "Back returns",
    new URL(page.url()).pathname === "/solusi/booking-jasa",
    page.url(),
  );
  // 4. axe on the shelf.
  await page.addScriptTag({ content: AXE });
  const axe = await page.evaluate(async () => {
    const res = await window.axe.run(".detail-related", {
      resultTypes: ["violations"],
    });
    return res.violations.map((v) => `${v.id} (${v.nodes.length})`);
  });
  check("axe shelf", axe.length === 0, axe.join(", "));
  await page.screenshot({ path: join(out, "desktop.png") });
  await context.close();
}

await browser.close();
const failed = report.checks.filter((c) => !c.ok);
writeFileSync(join(out, "report.json"), JSON.stringify(report, null, 2));
console.log(
  `${report.checks.length - failed.length}/${report.checks.length} passed; errors ${report.errors.length}`,
);
for (const c of failed) console.log("FAIL", c.name, c.detail);
for (const e of report.errors.slice(0, 10)) console.log("ERR", e);
