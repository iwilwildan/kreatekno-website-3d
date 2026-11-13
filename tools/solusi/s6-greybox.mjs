// S6 Order Grup HTML + greybox checkpoint QA.
// Usage: node tools/solusi/s6-greybox.mjs <output directory>
import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { launch } from "../render/lib.mjs";

const base = process.env.BASE || "http://localhost:3000";
const out = process.argv[2];
if (!out) throw new Error("Pass an output directory");
mkdirSync(out, { recursive: true });

const browser = await launch({ gpu: true });
const report = { checks: [], views: [], errors: [] };
const check = (name, pass, detail = "") =>
  report.checks.push({ name, pass: Boolean(pass), detail });

try {
  for (const [width, height] of [
    [1440, 900],
    [1024, 1366],
    [390, 844],
    [360, 800],
  ]) {
    const page = await browser.newPage({
      viewport: { width, height },
      deviceScaleFactor: 1,
    });
    const errors = [];
    page.on("pageerror", (error) => errors.push(error.message));
    page.on("console", (message) => {
      const source = message.location().url;
      if (
        message.type() === "error" &&
        !message.text().includes("/_vercel/insights") &&
        !source.includes("/_vercel/insights")
      )
        errors.push(message.text());
    });
    page.on("response", (response) => {
      if (
        response.status() === 404 &&
        !response.url().includes("/_vercel/insights/")
      )
        errors.push(`404 ${response.url()}`);
    });
    await page.goto(`${base}/solusi/order-grup`, { waitUntil: "networkidle" });
    await page.locator("h1").waitFor();
    check(`${width} h1`, (await page.locator("h1").count()) === 1);
    check(
      `${width} nine scenes`,
      (await page.locator(".story-card").count()) === 9,
    );
    check(
      `${width} nine rail controls`,
      (await page.locator(".story-rail button").count()) === 9,
    );
    check(
      `${width} no horizontal overflow`,
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth + 1,
      ),
      `${await page.evaluate(() => `${document.documentElement.scrollWidth}/${innerWidth}`)}`,
    );
    await page.locator(".story-stage").scrollIntoViewIfNeeded();
    await page
      .locator(".story-canvas")
      .waitFor({ state: "attached", timeout: 30000 });
    check(
      `${width} WebGL canvas`,
      (await page.locator(".story-canvas").count()) === 1,
    );
    const rail = await page.locator(".story-rail button").evaluateAll((items) =>
      items.map((item) => {
        const r = item.getBoundingClientRect();
        return [r.width, r.height];
      }),
    );
    check(
      `${width} rail target >=24x28`,
      rail.every(([w, h]) => w >= 24 && h >= 28),
      JSON.stringify(rail[0]),
    );
    await page.locator("#scene-rekap").scrollIntoViewIfNeeded();
    await page.waitForTimeout(700);
    check(
      `${width} recap active`,
      await page
        .locator("#scene-rekap")
        .evaluate((el) =>
          el.querySelector("article")?.classList.contains("is-active"),
        ),
    );
    check(`${width} console clean`, errors.length === 0, errors.join(" | "));
    report.errors.push(
      ...errors.map((error) => `${width}x${height}: ${error}`),
    );
    report.views.push({
      width,
      height,
      rail: rail[0],
      scrollWidth: await page.evaluate(
        () => document.documentElement.scrollWidth,
      ),
    });
    if (width === 1440 || width === 390)
      await page.screenshot({
        path: join(out, `${width}x${height}-rekap.png`),
        fullPage: false,
      });
    await page.close();
  }

  const page = await browser.newPage({
    viewport: { width: 1280, height: 800 },
    deviceScaleFactor: 1,
  });
  await page.goto(`${base}/en/solutions/order-grup`, {
    waitUntil: "networkidle",
  });
  check(
    "English route",
    (await page.locator("h1").innerText()).includes("Group-chat orders"),
  );
  check(
    "English nine scenes",
    (await page.locator(".story-card").count()) === 9,
  );
  await page.locator(".detail-hero [data-contact]").click();
  check(
    "contact opens",
    await page.locator("dialog.contact-dialog").evaluate((el) => el.open),
  );
  const wa = await page
    .locator("dialog a[href^='https://wa.me']")
    .getAttribute("href");
  check(
    "contact detail message",
    wa?.includes("Group-chat%20orders") || wa?.includes("Group-chat+orders"),
    wa || "",
  );
  await page.keyboard.press("Escape");
  check(
    "contact closes",
    !(await page.locator("dialog.contact-dialog").evaluate((el) => el.open)),
  );
  await page.close();

  const reduced = await browser.newPage({
    viewport: { width: 390, height: 844 },
  });
  await reduced.emulateMedia({ reducedMotion: "reduce" });
  await reduced.goto(`${base}/solusi/order-grup`, { waitUntil: "networkidle" });
  await reduced.locator("#scene-untuk-anda").scrollIntoViewIfNeeded();
  await reduced.waitForTimeout(100);
  check(
    "reduced motion reaches scene 9",
    await reduced
      .locator("#scene-untuk-anda")
      .evaluate((el) =>
        el.querySelector("article")?.classList.contains("is-active"),
      ),
  );
  await reduced.close();

  const missing = await browser.newPage();
  const response = await missing.goto(`${base}/solusi/tidak-ada`, {
    waitUntil: "networkidle",
  });
  check(
    "unknown slug 404",
    response?.status() === 404,
    String(response?.status()),
  );
  await missing.close();
} finally {
  await browser.close();
}

report.failed = report.checks.filter((item) => !item.pass).length;
writeFileSync(join(out, "report.json"), JSON.stringify(report, null, 2));
console.log(
  `${report.checks.length - report.failed}/${report.checks.length} checks passed`,
);
for (const item of report.checks.filter((entry) => !entry.pass))
  console.log(`FAIL ${item.name}: ${item.detail}`);
process.exitCode = report.failed ? 1 : 0;
