// S4 final shop, cashier interaction, reduced-motion and budget QA.
// Usage: BASE=http://localhost:3000 node tools/solusi/s4-final.mjs <output directory>
import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { launch } from "../render/lib.mjs";

const base = process.env.BASE || "http://localhost:3000";
const out = process.argv[2];
if (!out) throw new Error("Pass an output directory");
mkdirSync(out, { recursive: true });

const browser = await launch({ gpu: true });
const report = { checks: [], errors: [], samples: {} };
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
  await page.waitForFunction(() => window.__solusi?.ready, null, {
    timeout: 120000,
  });
  await page.waitForTimeout(1300);
  let data = await page.evaluate(() => window.__solusi);
  const heroColor = await page
    .locator(".toko-copy h1")
    .evaluate((node) => getComputedStyle(node).color);
  report.samples.hero = data;
  check(
    "hero copy is white on final navy wall",
    heroColor === "rgb(255, 255, 255)",
    heroColor,
  );
  check(
    "shop starts in idle",
    data.mode === "shop" && data.pose === "idle",
    `${data.mode}/${data.pose}`,
  );
  check(
    "shop uses final draw-call budget",
    data.drawCalls < 60,
    String(data.drawCalls),
  );
  check(
    "shop uses final triangle budget",
    data.renderTriangles < 80000,
    String(data.renderTriangles),
  );
  check(
    "cashier remains under character budget",
    data.triangles <= 16000,
    String(data.triangles),
  );
  check(
    "GPU headless ambient stays above 20 fps",
    data.fps >= 20,
    String(data.fps),
  );
  const lampA = data.lampAngle;
  await page.waitForTimeout(420);
  data = await page.evaluate(() => window.__solusi);
  check(
    "lamp swings in normal motion",
    Math.abs(data.lampAngle - lampA) > 0.001,
    `${lampA} -> ${data.lampAngle}`,
  );

  await page.locator(".toko-actions .is-primary").first().click();
  await page.waitForFunction(
    () => window.__solusi?.mode === "cari" && window.__solusi?.pose === "wave",
  );
  check("entering Search waves", true);
  const term = page.locator(".receipt input");
  await term.fill("stok");
  await page.waitForFunction(() => window.__solusi?.pose === "ready", null, {
    timeout: 4000,
  });
  check("typing lowers cashier to ready", true);
  await page.screenshot({
    path: join(out, "1440x900-ready.png"),
    fullPage: false,
  });

  await page.locator(".receipt-submit").click();
  await page.waitForFunction(
    () => document.querySelectorAll(".result-card").length === 1,
  );
  await page.waitForFunction(() => window.__solusi?.pose === "lift", null, {
    timeout: 3000,
  });
  check("successful Search lifts results", true);
  await page.waitForFunction(() => window.__solusi?.registerX < -3.7, null, {
    timeout: 3000,
  });
  data = await page.evaluate(() => window.__solusi);
  check(
    "register exits after Search is served",
    data.registerX < -3.7,
    String(data.registerX),
  );
  await page.screenshot({
    path: join(out, "1440x900-served.png"),
    fullPage: false,
  });

  await page.locator(".result-bar button").click();
  await page.waitForFunction(() => window.__solusi?.registerX > -2.5, null, {
    timeout: 3000,
  });
  check("Search again returns register", true);
  await term.fill("tidak-ada-hasil-xyz");
  await page.locator(".receipt-submit").click();
  await page.waitForFunction(() => window.__solusi?.pose === "shrug", null, {
    timeout: 2000,
  });
  check("empty Search shrugs", true);

  await page.locator(".panel-close").click();
  await page.waitForFunction(
    () => window.__solusi?.mode === "shop" && !window.__solusi?.focus,
  );
  await page.waitForTimeout(900);
  data = await page.evaluate(() => window.__solusi);
  await page.mouse.move(data.cashierScreen.x, data.cashierScreen.y);
  await page.waitForTimeout(180);
  check(
    "cashier hitbox shows pointer state",
    await page.locator(".solusi-page.cashier-hit").isVisible(),
  );
  await page.mouse.click(data.cashierScreen.x, data.cashierScreen.y);
  await page.waitForFunction(() => window.__solusi?.hit === true);
  check("cashier reacts to click", true);
  await page.screenshot({
    path: join(out, "1440x900-hit.png"),
    fullPage: false,
  });
  const followPoint = {
    x: data.cashierScreen.x + 180,
    y: data.cashierScreen.y - 80,
  };
  await page.mouse.move(followPoint.x, followPoint.y);
  await page.evaluate(({ x, y }) => {
    window.dispatchEvent(
      new PointerEvent("pointermove", {
        bubbles: true,
        clientX: x,
        clientY: y,
        pointerType: "mouse",
      }),
    );
  }, followPoint);
  await page.waitForFunction(
    () => Math.abs(window.__solusi?.head?.yaw || 0) > 0.05,
  );
  data = await page.evaluate(() => window.__solusi);
  check(
    "cashier follows fine pointer",
    Math.abs(data.head.yaw) > 0.05,
    String(data.head.yaw),
  );
  check(
    "desktop interaction console clean",
    errors.length === 0,
    errors.join("\n"),
  );
  report.errors.push(...errors);
  report.samples.desktop = data;
  await page.close();

  const mobile = await browser.newPage({
    viewport: { width: 375, height: 812 },
    deviceScaleFactor: 1,
  });
  const mobileErrors = watchErrors(mobile);
  await mobile.goto(`${base}/solusi#cari`, { waitUntil: "networkidle" });
  await mobile.waitForFunction(
    () => window.__solusi?.ready && window.__solusi?.focus,
  );
  await mobile.waitForFunction(() => window.__solusi?.registerX < -3.7, null, {
    timeout: 3000,
  });
  data = await mobile.evaluate(() => ({
    world: window.__solusi,
    scrollWidth: document.documentElement.scrollWidth,
    clientWidth: document.documentElement.clientWidth,
  }));
  check(
    "mobile Search moves register offscreen",
    data.world.registerX < -3.7,
    String(data.world.registerX),
  );
  check(
    "mobile final has no horizontal overflow",
    data.scrollWidth <= data.clientWidth + 1,
    `${data.scrollWidth}/${data.clientWidth}`,
  );
  check(
    "mobile final console clean",
    mobileErrors.length === 0,
    mobileErrors.join("\n"),
  );
  report.errors.push(...mobileErrors);
  report.samples.mobile = data;
  await mobile.screenshot({
    path: join(out, "375x812-search.png"),
    fullPage: false,
  });
  await mobile.close();

  const throttled = await browser.newPage({
    viewport: { width: 1280, height: 800 },
    deviceScaleFactor: 1,
  });
  const throttledErrors = watchErrors(throttled);
  const cdp = await throttled.context().newCDPSession(throttled);
  await cdp.send("Emulation.setCPUThrottlingRate", { rate: 4 });
  await throttled.goto(`${base}/solusi`, { waitUntil: "networkidle" });
  await throttled.waitForFunction(() => window.__solusi?.ready);
  await throttled.waitForTimeout(2400);
  data = await throttled.evaluate(() => window.__solusi);
  check("CPU 4x ambient remains interactive", data.fps >= 15, String(data.fps));
  check(
    "CPU 4x console clean",
    throttledErrors.length === 0,
    throttledErrors.join("\n"),
  );
  report.errors.push(...throttledErrors);
  report.samples.cpu4x = data;
  await cdp.send("Emulation.setCPUThrottlingRate", { rate: 1 });
  await throttled.close();

  const reduced = await browser.newPage({
    viewport: { width: 1440, height: 900 },
    deviceScaleFactor: 1,
  });
  const reducedErrors = watchErrors(reduced);
  await reduced.emulateMedia({ reducedMotion: "reduce" });
  await reduced.goto(`${base}/solusi`, { waitUntil: "networkidle" });
  await reduced.waitForFunction(
    () => window.__solusi?.ready && window.__solusi?.reduced,
  );
  const reducedA = await reduced.evaluate(() => window.__solusi);
  await reduced.waitForTimeout(500);
  const reducedB = await reduced.evaluate(() => window.__solusi);
  check(
    "reduced motion disables lamp swing",
    reducedA.lampAngle === 0 && reducedB.lampAngle === 0,
    `${reducedA.lampAngle}/${reducedB.lampAngle}`,
  );
  await reduced.locator(".toko-actions .is-primary").first().click();
  await reduced.waitForFunction(() => window.__solusi?.mode === "cari");
  data = await reduced.evaluate(() => window.__solusi);
  check("reduced motion skips wave action", data.pose === "idle", data.pose);
  const reducedTerm = reduced.locator(".receipt input");
  await reducedTerm.fill("stok");
  await reduced.waitForFunction(() => window.__solusi?.pose === "ready");
  check("reduced motion applies ready pose directly", true);
  check(
    "reduced motion console clean",
    reducedErrors.length === 0,
    reducedErrors.join("\n"),
  );
  report.errors.push(...reducedErrors);
  report.samples.reduced = await reduced.evaluate(() => window.__solusi);
  await reduced.close();
} finally {
  await browser.close();
}

writeFileSync(
  join(out, "final-report.json"),
  JSON.stringify({ failures, ...report }, null, 2),
);
if (failures)
  throw new Error(`${failures} S4 final checks failed; see final-report.json`);
console.log(`S4 final: ${report.checks.length} checks passed`);
