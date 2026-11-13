import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { launch } from "../render/lib.mjs";

const base = process.env.BASE || "http://localhost:3100";
const out = process.argv[2];
if (!out) throw new Error("Pass an output directory");
mkdirSync(out, { recursive: true });
const browser = await launch();
const report = { checks: [], viewports: [], errors: [] };
const check = (name, pass, detail = "") => {
  report.checks.push({ name, pass, detail });
  if (!pass) throw new Error(`${name}: ${detail}`);
};

try {
  for (const [width, height] of [
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
  ]) {
    const page = await browser.newPage({
      viewport: { width, height },
      deviceScaleFactor: 1,
    });
    const errors = [];
    page.on("pageerror", (error) => errors.push(error.message));
    page.on("console", (message) => {
      const url = message.location().url;
      if (message.type() === "error" && !url.includes("/_vercel/insights/"))
        errors.push(`${message.text()} ${url}`);
    });
    page.on(
      "response",
      (response) =>
        response.status() >= 400 &&
        !response.url().includes("/_vercel/insights/") &&
        errors.push(`HTTP ${response.status()} ${response.url()}`),
    );
    await page.goto(`${base}/solusi`, { waitUntil: "networkidle" });
    const data = await page.evaluate(() => ({
      h1: document.querySelector("h1")?.textContent,
      hero: document
        .querySelector(".toko-hero")
        ?.getBoundingClientRect()
        .toJSON(),
      stage: document
        .querySelector(".toko-stage")
        ?.getBoundingClientRect()
        .toJSON(),
      scrollWidth: document.documentElement.scrollWidth,
      clientWidth: document.documentElement.clientWidth,
    }));
    report.viewports.push({ width, height, ...data, errors });
    check(`${width}x${height} has h1`, Boolean(data.h1), String(data.h1));
    check(
      `${width}x${height} no horizontal overflow`,
      data.scrollWidth <= data.clientWidth + 1,
      `${data.scrollWidth}/${data.clientWidth}`,
    );
    check(
      `${width}x${height} console clean`,
      errors.length === 0,
      errors.join("\n"),
    );
    if (
      (width === 1440 && height === 900) ||
      (width === 820 && height === 1180) ||
      (width === 375 && height === 812)
    ) {
      await page.screenshot({
        path: join(out, `${width}x${height}-hero.png`),
        fullPage: false,
      });
    }
    await page.close();
  }

  const page = await browser.newPage({
    viewport: { width: 1440, height: 900 },
  });
  const errors = [];
  page.on("pageerror", (error) => errors.push(error.message));
  page.on("console", (message) => {
    const url = message.location().url;
    if (message.type() === "error" && !url.includes("/_vercel/insights/"))
      errors.push(`${message.text()} ${url}`);
  });
  page.on(
    "response",
    (response) =>
      response.status() >= 400 &&
      !response.url().includes("/_vercel/insights/") &&
      errors.push(`HTTP ${response.status()} ${response.url()}`),
  );
  await page.goto(`${base}/solusi#cari`, { waitUntil: "networkidle" });
  check("hash opens Search", await page.locator(".search-panel").isVisible());
  const enHash = await page
    .locator('a[lang="en"]')
    .first()
    .getAttribute("href");
  check(
    "language switch preserves Search hash",
    enHash?.endsWith("#cari"),
    String(enHash),
  );
  await page.locator(".receipt-submit").click();
  check(
    "Search shows six of twelve",
    (await page.locator(".result-card").count()) === 6,
    String(await page.locator(".result-card").count()),
  );
  check(
    "Search reports total",
    (await page.locator(".result-bar").innerText()).includes("12"),
  );
  await page.screenshot({
    path: join(out, "1440x900-search.png"),
    fullPage: false,
  });
  await page.getByRole("button", { name: "Berikutnya" }).click();
  check(
    "next page starts at seven",
    (await page.locator(".result-number").first().innerText()) === "7",
  );

  await page.goto(`${base}/solusi#kartu`, { waitUntil: "networkidle" });
  await page.locator(".industry-grid button").first().click();
  await page.getByRole("button", { name: "Bagikan kartu" }).click();
  check(
    "Cards starts at one of nine",
    (await page.locator(".deck-meta").innerText()).includes("1 DARI 9"),
  );
  await page.screenshot({
    path: join(out, "1440x900-cards.png"),
    fullPage: false,
  });
  await page.locator(".problem-card.is-top").focus();
  await page.keyboard.press("ArrowRight");
  await page.waitForTimeout(280);
  check(
    "right arrow answers Yes",
    (await page.locator(".deck-meta").innerText()).includes("2 DARI 9"),
  );
  const cardBox = await page.locator(".problem-card.is-top").boundingBox();
  await page.mouse.move(
    cardBox.x + cardBox.width / 2,
    cardBox.y + cardBox.height / 2,
  );
  await page.mouse.down();
  await page.mouse.move(
    cardBox.x + cardBox.width / 2 + 120,
    cardBox.y + cardBox.height / 2,
    { steps: 5 },
  );
  await page.mouse.up();
  await page.waitForTimeout(280);
  check(
    "pointer swipe answers Yes",
    (await page.locator(".deck-meta").innerText()).includes("3 DARI 9"),
  );
  for (let index = 0; index < 7; index++) {
    await page.locator(".answer-yes").click();
    if (index < 6) await page.waitForTimeout(280);
  }
  await page.waitForURL(/\/solusi\/hasil\?/);
  await page.waitForTimeout(350);
  check(
    "nine answers reach results",
    await page.locator(".hasil-page").isVisible(),
  );
  check(
    "results have no percentages",
    !(await page.locator("body").innerText()).includes("%"),
  );
  const enQuery = await page
    .locator('a[lang="en"]')
    .first()
    .getAttribute("href");
  check(
    "language switch preserves results query",
    Boolean(
      enQuery?.includes("/en/solutions/results?") && enQuery.includes("y="),
    ),
    String(enQuery),
  );
  await page.screenshot({
    path: join(out, "1440x900-results.png"),
    fullPage: false,
  });

  const contactTrigger = page.locator("[data-contact]").first();
  await contactTrigger.click();
  check(
    "contact dialog opens modally",
    (await page.locator(".contact-dialog[open]").count()) === 1,
  );
  check(
    "dialog focuses close button",
    await page
      .locator(".contact-dialog[open] .contact-close")
      .evaluate((node) => node === document.activeElement),
  );
  await page.screenshot({
    path: join(out, "1440x900-contact.png"),
    fullPage: false,
  });
  await page.keyboard.press("Escape");
  check(
    "Escape closes contact dialog",
    (await page.locator(".contact-dialog[open]").count()) === 0,
  );
  await page.waitForTimeout(50);
  check(
    "dialog restores trigger focus",
    await contactTrigger.evaluate((node) => node === document.activeElement),
  );
  check("interaction console clean", errors.length === 0, errors.join("\n"));
  await page.close();

  const en = await browser.newPage({ viewport: { width: 390, height: 844 } });
  await en.goto(`${base}/en/solutions`, { waitUntil: "networkidle" });
  check(
    "English route renders English h1",
    (await en.locator("h1").innerText()).includes("Repetitive"),
  );
  await en.screenshot({
    path: join(out, "390x844-en-hero.png"),
    fullPage: false,
  });
  await en.close();

  const drag = await browser.newPage({ viewport: { width: 375, height: 812 } });
  await drag.goto(`${base}/solusi`, { waitUntil: "networkidle" });
  const rack = drag.locator(".etalase .track").first();
  await rack.scrollIntoViewIfNeeded();
  const before = await rack.evaluate((node) => node.scrollLeft);
  const rackBox = await rack.boundingBox();
  await drag.mouse.move(
    rackBox.x + rackBox.width * 0.75,
    rackBox.y + rackBox.height / 2,
  );
  await drag.mouse.down();
  await drag.mouse.move(
    rackBox.x + rackBox.width * 0.25,
    rackBox.y + rackBox.height / 2,
    { steps: 8 },
  );
  await drag.mouse.up();
  const after = await rack.evaluate((node) => node.scrollLeft);
  check(
    "mouse drag scrolls shelf",
    after > before + 20,
    `${before} -> ${after}`,
  );
  await drag.close();
} finally {
  await browser.close();
  writeFileSync(join(out, "report.json"), JSON.stringify(report, null, 2));
}

console.log(
  `S2 browser QA: ${report.checks.length} checks passed across ${report.viewports.length} viewports`,
);
