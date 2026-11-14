// S5 orthographic catalogue, served boxes, summaries and dealt-card QA.
// S5b (14 Nov): tag positions come from fixtures/etalase-2026-11-13.json (v1 13 Nov). Phones (≤ 760 px)
// serve two rows from four results (decision 17), so their tags are checked for rows, overlap and bounds.
// Usage: BASE=http://localhost:3000 node tools/solusi/s5-final.mjs <output directory>
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { launch } from "../render/lib.mjs";

const base = process.env.BASE || "http://localhost:3000";
const out = process.argv[2];
if (!out) throw new Error("Pass an output directory");
mkdirSync(out, { recursive: true });
const fixture = JSON.parse(
  readFileSync(
    new URL("./fixtures/etalase-2026-11-13.json", import.meta.url),
    "utf8",
  ),
);
const expected = new Map(
  Object.entries(fixture.views).map(([name, view]) => [
    name.replace("×", "x"),
    view,
  ]),
);
const viewports = [
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
const searches = [
  ["stok", 1],
  ["dokumen", 2],
  ["pemilik", 3],
  ["jadwal", 4],
  ["pelanggan", 5],
  ["", 6],
];

const browser = await launch({ gpu: true });
const report = { checks: [], tagSamples: [], errors: [] };
let failures = 0;
const check = (name, pass, detail = "") => {
  report.checks.push({ name, pass, detail });
  if (!pass) failures += 1;
};
const watchErrors = (page) => {
  const errors = [];
  page.on("pageerror", (error) => errors.push(error.message));
  page.on("console", (message) => {
    const url = message.location().url;
    if (message.type() === "error" && !url.includes("/_vercel/insights/"))
      errors.push(`${message.text()} ${url}`);
  });
  return errors;
};
const waitWorld = (page) =>
  page.waitForFunction(() => window.__solusi?.ready, null, {
    timeout: 120000,
    polling: 50,
  });
const centers = (page) =>
  page.locator("[data-box-tag]:not([hidden])").evaluateAll((tags) =>
    tags.map((tag) => {
      const rect = tag.getBoundingClientRect();
      return { x: rect.x + rect.width / 2, y: rect.y + rect.height / 2 };
    }),
  );

try {
  const page = await browser.newPage({
    viewport: { width: 1440, height: 900 },
    deviceScaleFactor: 1,
  });
  await page.addInitScript(() => {
    const nativeMatchMedia = window.matchMedia.bind(window);
    window.matchMedia = (query) => {
      if (query !== "(hover: hover) and (pointer: fine)")
        return nativeMatchMedia(query);
      return {
        matches: true,
        media: query,
        onchange: null,
        addListener() {},
        removeListener() {},
        addEventListener() {},
        removeEventListener() {},
        dispatchEvent: () => true,
      };
    };
  });
  const errors = watchErrors(page);
  await page.goto(`${base}/solusi`, { waitUntil: "networkidle" });
  await waitWorld(page);
  await page.locator(".etalase").scrollIntoViewIfNeeded();
  await page.waitForFunction(() => window.__solusi?.rackVisible);
  let world = await page.evaluate(() => window.__solusi);
  check("orthographic catalogue renders", world.rackVisible === true);
  check(
    "catalogue remains under draw-call budget",
    world.drawCalls < 60,
    String(world.drawCalls),
  );
  check(
    "catalogue remains under triangle budget",
    world.renderTriangles < 80000,
    String(world.renderTriangles),
  );
  await page.screenshot({
    path: join(out, "1440x900-etalase.png"),
    fullPage: false,
  });

  await page.goto(`${base}/solusi#cari`, { waitUntil: "networkidle" });
  await waitWorld(page);
  await page.locator(".receipt-submit").click();
  await page.waitForFunction(() => window.__solusi?.boxes?.moving === true);
  check("six boxes animate from the cashier", true);
  await page.waitForFunction(
    () =>
      window.__solusi?.boxes?.count === 6 && !window.__solusi?.boxes?.moving,
    null,
    {
      timeout: 5000,
    },
  );
  check(
    "first result view serves six boxes",
    (await centers(page)).length === 6,
  );
  world = await page.evaluate(() => window.__solusi);
  check(
    "served boxes remain under draw-call budget",
    world.drawCalls < 60,
    String(world.drawCalls),
  );
  check(
    "served boxes remain under triangle budget",
    world.renderTriangles < 80000,
    String(world.renderTriangles),
  );
  check(
    "served-box animation remains interactive",
    world.fps >= 20,
    String(world.fps),
  );
  await page.screenshot({
    path: join(out, "1440x900-six-boxes.png"),
    fullPage: false,
  });

  const firstTag = await page.locator("[data-box-tag='0']").boundingBox();
  await page.locator("[data-box-tag='0']").click();
  await page.waitForSelector("[data-box-summary]");
  check(
    "number tag opens accessible summary",
    await page.locator("[data-box-summary][role=dialog]").isVisible(),
  );
  check(
    "summary exposes detail link",
    (
      await page.locator("[data-box-summary] a").getAttribute("href")
    )?.startsWith("/solusi/") === true,
  );
  await page.screenshot({
    path: join(out, "1440x900-summary.png"),
    fullPage: false,
  });
  await page.keyboard.press("Escape");
  await page.waitForFunction(
    () => !document.querySelector("[data-box-summary]"),
  );
  check("Escape closes summary", true);
  await page.mouse.move(0, 0);
  await page.mouse.move(
    firstTag.x + firstTag.width / 2,
    firstTag.y + firstTag.height / 2 + 58,
  );
  await page.waitForSelector("[data-box-summary]");
  check("fine-pointer hover opens summary from the 3D box", true);
  await page.mouse.move(720, 45);
  await page.waitForFunction(
    () => !document.querySelector("[data-box-summary]"),
    null,
    { timeout: 1000 },
  );
  check("leaving a 3D box closes its summary after 240ms", true);

  await page.locator(".pagination button").last().click();
  await page.waitForFunction(() =>
    document.querySelector(".pagination span")?.textContent?.includes("2 / 2"),
  );
  check(
    "next page serves results 7 through 12",
    (await page.locator("[data-box-tag]").allTextContents()).join(",") ===
      "7,8,9,10,11,12",
  );
  await page.setViewportSize({ width: 1280, height: 800 });
  await page.waitForTimeout(330);
  const resized = await centers(page);
  const resizedWanted = expected.get("1280x800").tags[6];
  check(
    "served boxes relayout 250ms after resize",
    resized.every(
      (point, index) =>
        Math.abs(point.x - resizedWanted[index].x) <= 2 &&
        Math.abs(point.y - resizedWanted[index].y) <= 2,
    ),
  );
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.waitForTimeout(330);
  await page.locator(".result-bar button").click();
  await page.waitForFunction(
    () => window.__solusi?.boxes?.visible === false,
    null,
    { timeout: 3000 },
  );
  check("Search again recalls all boxes", true);

  await page.locator(".panel-close").click();
  await page.goto(`${base}/solusi#kartu`, { waitUntil: "networkidle" });
  await waitWorld(page);
  await page.locator(".industry-grid button").first().click();
  await page.locator(".industry-sheet .solusi-button").click();
  await page.waitForFunction(() => window.__solusi?.cardFlying === true);
  check(
    "cashier deals a 3D card before the HTML deck",
    await page.locator(".deal-placeholder").isVisible(),
  );
  await page.waitForSelector(".problem-card.is-top", { timeout: 3000 });
  check(
    "HTML deck appears after the 3D deal",
    await page.locator(".problem-card.is-top").isVisible(),
  );
  await page.locator(".answer-yes").click();
  await page.waitForFunction(() => window.__solusi?.pose === "nod");
  check("Yes answer makes cashier nod", true);
  await page.screenshot({
    path: join(out, "1440x900-cards.png"),
    fullPage: false,
  });
  check("desktop S5 console clean", errors.length === 0, errors.join("\n"));
  report.errors.push(...errors);
  await page.close();

  for (const [width, height] of viewports) {
    const key = `${width}x${height}`;
    const ref = expected.get(key);
    if (!ref) {
      check(`${key} has S0 reference`, false);
      continue;
    }
    const reduced = await browser.newPage({
      viewport: { width, height },
      deviceScaleFactor: 1,
      hasTouch: width <= 1180,
      reducedMotion: "reduce",
    });
    const reducedErrors = watchErrors(reduced);
    await reduced.goto(`${base}/solusi#cari`, { waitUntil: "networkidle" });
    await waitWorld(reduced);
    for (const [term, count] of searches) {
      if (count > 1) {
        await reduced
          .locator(".result-bar button")
          .evaluate((button) => button.click());
        await reduced.waitForFunction(
          () => !document.querySelector(".solusi-page.served"),
        );
      }
      await reduced.locator(".receipt input").fill(term);
      await reduced.locator(".receipt-submit").click();
      await reduced.waitForFunction(
        (wanted) =>
          window.__solusi?.boxes?.count === wanted &&
          !window.__solusi?.boxes?.moving &&
          document.querySelectorAll("[data-box-tag]:not([hidden])").length ===
            wanted,
        count,
      );
      const actual = await centers(reduced);
      if (width <= 760) {
        const phone = await reduced.evaluate(() => {
          const tags = [
            ...document.querySelectorAll("[data-box-tag]:not([hidden])"),
          ].map((tag) => tag.getBoundingClientRect());
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
          const inside = tags.every(
            (r) =>
              r.left >= 0 &&
              r.right <= innerWidth &&
              r.top >= 0 &&
              r.bottom <= innerHeight,
          );
          return { rows: window.__solusi.boxes.rows, overlap, inside };
        });
        check(
          `${key} ${count}-box phone layout: ${count > 3 ? 2 : 1} row(s), tags apart and on screen`,
          phone.rows === (count > 3 ? 2 : 1) && !phone.overlap && phone.inside,
          JSON.stringify(phone),
        );
        continue;
      }
      const wanted = ref.tags[count];
      const deltas = actual.map((point, index) => ({
        x: Math.abs(point.x - wanted[index].x),
        y: Math.abs(point.y - wanted[index].y),
      }));
      const pass =
        actual.length === wanted.length &&
        deltas.every((delta) => delta.x <= 2 && delta.y <= 2);
      check(
        `${key} ${count}-box tags match v1 within 2px`,
        pass,
        JSON.stringify(deltas),
      );
      report.tagSamples.push({ viewport: key, count, actual, wanted, deltas });
    }
    const overflow = await reduced.evaluate(() => ({
      scroll: document.documentElement.scrollWidth,
      client: document.documentElement.clientWidth,
      cardFlying: window.__solusi?.cardFlying,
    }));
    check(
      `${key} has no horizontal overflow`,
      overflow.scroll <= overflow.client + 1,
      `${overflow.scroll}/${overflow.client}`,
    );
    check(
      `${key} reduced motion skips active box animation`,
      !(await reduced.evaluate(() => window.__solusi?.boxes?.moving)),
    );
    check(
      `${key} console clean`,
      reducedErrors.length === 0,
      reducedErrors.join("\n"),
    );
    report.errors.push(...reducedErrors);
    if (width === 375) {
      await reduced.locator("[data-box-tag='0']").click();
      const box = await reduced.locator("[data-box-summary]").boundingBox();
      check(
        "mobile summary stays inside viewport",
        Boolean(box && box.x >= 0 && box.y >= 0 && box.x + box.width <= width),
      );
      await reduced.screenshot({
        path: join(out, "375x812-summary.png"),
        fullPage: false,
      });
      await reduced.goto(`${base}/solusi#kartu`, { waitUntil: "networkidle" });
      await waitWorld(reduced);
      await reduced.locator(".industry-grid button").first().click();
      await reduced.locator(".industry-sheet .solusi-button").click();
      check(
        "reduced motion skips the 3D card flight",
        !(await reduced.evaluate(() => window.__solusi?.cardFlying)),
      );
      check(
        "reduced motion shows the HTML deck immediately",
        await reduced.locator(".problem-card.is-top").isVisible(),
      );
    }
    await reduced.close();
  }
} finally {
  await browser.close();
}

writeFileSync(
  join(out, "report.json"),
  JSON.stringify({ failures, ...report }, null, 2),
);
if (failures) throw new Error(`${failures} S5 checks failed; see report.json`);
console.log(`S5 final: ${report.checks.length} checks passed`);
