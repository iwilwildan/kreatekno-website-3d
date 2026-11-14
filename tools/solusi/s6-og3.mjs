// S6 OG3 choreography and CSS3D browser QA.
// Usage: node tools/solusi/s6-og3.mjs <output directory>
import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { launch } from "../render/lib.mjs";

const base = process.env.BASE || "http://localhost:3000";
const out = process.argv[2];
if (!out) throw new Error("Pass an output directory");
mkdirSync(out, { recursive: true });
const browser = await launch({ gpu: true });
const report = { checks: [], errors: [] };
const check = (name, pass, detail = "") =>
  report.checks.push({ name, pass: Boolean(pass), detail });

async function activeScene(page, id, wait = 250) {
  const ids = [
    "sebelum",
    "pesan-masuk",
    "ai-membaca",
    "tersimpan",
    "konfirmasi",
    "status",
    "rekap",
    "hasil",
    "untuk-anda",
  ];
  await page.locator(".story-rail button").nth(ids.indexOf(id)).click();
  await page.waitForFunction(
    (sceneId) =>
      document
        .querySelector(`#scene-${sceneId} article`)
        ?.classList.contains("is-active"),
    id,
  );
  await page.waitForTimeout(wait);
}

try {
  const page = await browser.newPage({
    viewport: { width: 1440, height: 900 },
    deviceScaleFactor: 1,
  });
  const errors = [];
  page.on("pageerror", (error) => errors.push(error.message));
  page.on("console", (message) => {
    const source = message.location().url;
    if (message.type() === "error" && !source.includes("/_vercel/insights"))
      errors.push(message.text());
  });
  await page.goto(`${base}/solusi/order-grup`, { waitUntil: "networkidle" });
  await page.locator(".story-stage").scrollIntoViewIfNeeded();
  await page
    .locator(".story-css3d")
    .waitFor({ state: "attached", timeout: 30000 });
  check(
    "WebGL and CSS3D layers",
    (await page.locator(".story-canvas").count()) === 1 &&
      (await page.locator(".story-css3d").count()) === 1,
  );
  check(
    "visible CSS3D labels present",
    (await page.locator(".story-world").count()) >= 10,
    String(await page.locator(".story-world").count()),
  );

  await activeScene(page, "sebelum", 150);
  check(
    "scene 1 messy messages",
    (await page.locator(".world-bubble:visible").count()) >= 6,
  );
  await page.screenshot({ path: join(out, "01-sebelum.png") });

  await activeScene(page, "ai-membaca", 2900);
  check(
    "scene 3 parsed fields",
    await page
      .locator(".world-fields")
      .evaluate((el) => getComputedStyle(el).opacity === "1"),
  );
  await page.screenshot({ path: join(out, "03-ai-membaca.png") });

  await activeScene(page, "tersimpan", 1900);
  check(
    "scene 4 table row",
    await page
      .locator(".world-table")
      .evaluate((el) => getComputedStyle(el).opacity === "1"),
  );
  check(
    "scene 4 status new",
    (await page.locator(".world-status").innerText()) === "Baru",
  );

  await activeScene(page, "status", 2900);
  check(
    "scene 6 courier reply",
    await page
      .locator(".world-bubble.is-courier")
      .evaluate((el) => getComputedStyle(el).opacity === "1"),
  );
  check(
    "scene 6 status complete",
    (await page.locator(".world-status").innerText()) === "Selesai",
  );
  await page.screenshot({ path: join(out, "06-status.png") });

  await activeScene(page, "rekap", 2200);
  check(
    "scene 7 recap visible",
    await page
      .locator(".world-recap")
      .evaluate((el) => getComputedStyle(el).opacity === "1"),
  );
  await page.screenshot({ path: join(out, "07-rekap.png") });

  await activeScene(page, "hasil", 2000);
  const metrics = await page.locator(".world-metric").allInnerTexts();
  check(
    "scene 8 sample metrics",
    metrics.join("|") === "3 jam|120 order|1 pesan",
    metrics.join("|"),
  );
  const navCta = await page
    .locator('header [data-src="nav"] > span')
    .first()
    .evaluate((el) => {
      const rect = el.getBoundingClientRect();
      const style = getComputedStyle(el);
      return {
        text: el.textContent,
        width: rect.width,
        color: style.color,
        opacity: style.opacity,
      };
    });
  check(
    "fixed header CTA remains intact",
    navCta.text === "Konsultasi gratis" &&
      navCta.width > 100 &&
      navCta.opacity === "1",
    JSON.stringify(navCta),
  );
  await page.screenshot({ path: join(out, "08-hasil.png") });

  await activeScene(page, "untuk-anda", 300);
  check(
    "scene 9 CTA keyboard target",
    await page.locator("#scene-untuk-anda [data-contact]").isVisible(),
  );
  const renderInfo = await page.locator(".story-world-host").evaluate((el) => ({
    calls: Number(el.dataset.drawCalls),
    triangles: Number(el.dataset.triangles),
  }));
  check(
    "scene 9 within GPU budget",
    renderInfo.calls <= 120 && renderInfo.triangles <= 35000,
    JSON.stringify(renderInfo),
  );
  await page.screenshot({ path: join(out, "09-untuk-anda.png") });

  await activeScene(page, "tersimpan", 1600);
  check(
    "jump 9 to 4 resets status",
    (await page.locator(".world-status").innerText()) === "Baru",
  );
  await activeScene(page, "rekap", 2100);
  check(
    "jump 4 to 7 restores recap",
    await page
      .locator(".world-recap")
      .evaluate((el) => getComputedStyle(el).opacity === "1"),
  );
  check("desktop console clean", errors.length === 0, errors.join(" | "));
  report.errors.push(...errors);
  await page.goto(`${base}/solusi`, { waitUntil: "networkidle" });
  check(
    "unmount removes story layers",
    (await page.locator(".story-canvas,.story-css3d").count()) === 0,
  );
  await page.close();

  const mobile = await browser.newPage({
    viewport: { width: 390, height: 844 },
    deviceScaleFactor: 1,
  });
  await mobile.goto(`${base}/solusi/order-grup`, { waitUntil: "networkidle" });
  await activeScene(mobile, "rekap", 2200);
  check(
    "mobile stage and recap",
    (await mobile.locator(".story-stage").isVisible()) &&
      (await mobile.locator(".world-recap").isVisible()),
  );
  check(
    "mobile no horizontal overflow",
    await mobile.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth + 1,
    ),
  );
  await mobile.screenshot({ path: join(out, "mobile-rekap.png") });
  await mobile.close();

  const reduced = await browser.newPage({
    viewport: { width: 390, height: 844 },
  });
  await reduced.emulateMedia({ reducedMotion: "reduce" });
  await reduced.goto(`${base}/solusi/order-grup`, { waitUntil: "networkidle" });
  await activeScene(reduced, "status", 100);
  check(
    "reduced motion status final",
    (await reduced.locator(".world-status").innerText()) === "Selesai",
  );
  await activeScene(reduced, "hasil", 100);
  check(
    "reduced motion metrics final",
    (await reduced.locator(".world-metric").allInnerTexts()).join("|") ===
      "3 jam|120 order|1 pesan",
  );
  await reduced.close();
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
