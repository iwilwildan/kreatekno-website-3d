// S6 OG4 pilot hardening: fallbacks, navigation, reflow, lifecycle and sustained rendering.
// Usage: node tools/solusi/s6-og4.mjs <output directory>
import { mkdirSync, readFileSync, readdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { setTimeout as wait } from "node:timers/promises";
import { launch, SITE } from "../render/lib.mjs";

const base = process.env.BASE || "http://localhost:3000";
const out = process.argv[2];
if (!out) throw new Error("Pass an output directory");
mkdirSync(out, { recursive: true });

const browser = await launch({ gpu: true });
const report = {
  checks: [],
  errors: [],
  storyScripts: [],
  performance: [],
  limits: {
    storyTransferBytes: 300 * 1024,
    mobileAverageFps: 30,
    drawCalls: 120,
    triangles: 35000,
  },
};
const check = (name, pass, detail = "") =>
  report.checks.push({ name, pass: Boolean(pass), detail });

function collectErrors(page, bucket, { allowNetwork = false } = {}) {
  page.on("pageerror", (error) => bucket.push(error.message));
  page.on("console", (message) => {
    const source = message.location().url;
    if (
      message.type() === "error" &&
      !source.includes("/_vercel/insights") &&
      !(
        allowNetwork &&
        /Failed to load resource|Loading chunk/i.test(message.text())
      )
    )
      bucket.push(message.text());
  });
}

async function showStory(page) {
  await page.locator(".story-stage").scrollIntoViewIfNeeded();
  await page
    .locator(".story-canvas")
    .waitFor({ state: "attached", timeout: 30000 });
  await page
    .locator(".story-css3d")
    .waitFor({ state: "attached", timeout: 30000 });
}

async function scene(page, index, pause = 200) {
  await page.locator(".story-rail button").nth(index).click();
  await page.waitForFunction(
    (sceneIndex) =>
      document
        .querySelectorAll(".story-card")
        [sceneIndex]?.classList.contains("is-active"),
    index,
  );
  await page.waitForTimeout(pause);
}

async function installStoryRoutes(page, urls, handler) {
  for (const url of urls) await page.route(url, handler);
}

function builtStoryUrls() {
  const chunkDir = join(SITE, ".next", "static", "chunks");
  const scripts = readdirSync(chunkDir).filter((name) => name.endsWith(".js"));
  const loader = scripts.find((name) => {
    const source = readFileSync(join(chunkDir, name), "utf8");
    return (
      source.includes("CeritaScroll") && source.includes("mountOrderGroupStory")
    );
  });
  if (!loader) return [];
  const source = readFileSync(join(chunkDir, loader), "utf8");
  return [
    ...new Set(
      [...source.matchAll(/static\/chunks\/[^"']+\.js/g)].map(
        ([path]) => `${base}/_next/${path}`,
      ),
    ),
  ];
}

async function sampleFrames(page, duration) {
  return page.evaluate(
    (ms) =>
      new Promise((resolve) => {
        let frames = 0;
        let slow = 0;
        let longest = 0;
        let total = 0;
        const start = performance.now();
        let previous = start;
        const tick = (now) => {
          const delta = now - previous;
          previous = now;
          if (frames > 0) {
            total += delta;
            if (delta > 33.34) slow += 1;
            longest = Math.max(longest, delta);
          }
          frames += 1;
          if (now - start >= ms) {
            resolve({
              durationMs: now - start,
              frames,
              averageFps: frames / ((now - start) / 1000),
              slowFrames: slow,
              slowPercent: frames > 1 ? (slow / (frames - 1)) * 100 : 0,
              longestFrameMs: longest,
              averageFrameMs: frames > 1 ? total / (frames - 1) : 0,
            });
            return;
          }
          requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
      }),
    duration,
  );
}

try {
  // Establish the dynamic story chunk URLs and cold-cache transfer size.
  const storyUrls = builtStoryUrls();
  const probe = await browser.newPage({
    viewport: { width: 1440, height: 900 },
  });
  const probeErrors = [];
  collectErrors(probe, probeErrors);
  await probe.goto(`${base}/solusi/order-grup`, { waitUntil: "networkidle" });
  await showStory(probe);
  const storyResources = await probe.evaluate((urls) => {
    const wanted = new Set(urls);
    return performance
      .getEntriesByType("resource")
      .filter((entry) => wanted.has(entry.name))
      .map((entry) => ({
        url: entry.name,
        transferSize: entry.transferSize,
        encodedBodySize: entry.encodedBodySize,
      }));
  }, storyUrls);
  report.storyScripts = storyResources;
  const storyTransfer = storyResources.reduce(
    (sum, resource) =>
      sum + (resource.transferSize || resource.encodedBodySize || 0),
    0,
  );
  check(
    "story remains a lazy JS chunk",
    storyUrls.length > 0,
    JSON.stringify(storyResources),
  );
  check(
    "Three, renderer and pilot world fit cold-cache budget",
    storyTransfer > 0 && storyTransfer <= report.limits.storyTransferBytes,
    `${storyTransfer} bytes`,
  );
  check(
    "probe console clean",
    probeErrors.length === 0,
    probeErrors.join(" | "),
  );
  await probe.close();

  // A slow dynamic chunk must leave the HTML story readable, then recover.
  const slow = await browser.newPage({
    viewport: { width: 1440, height: 900 },
  });
  const slowErrors = [];
  collectErrors(slow, slowErrors);
  let delayed = false;
  let delayDuration = 0;
  await installStoryRoutes(slow, storyUrls, async (route) => {
    if (!delayed) {
      delayed = true;
      const started = Date.now();
      await wait(1800);
      delayDuration = Date.now() - started;
    }
    await route.continue();
  });
  await slow.goto(`${base}/solusi/order-grup`, {
    waitUntil: "domcontentloaded",
  });
  await slow.locator(".story-stage").scrollIntoViewIfNeeded();
  await slow.waitForTimeout(250);
  check(
    "HTML card stays readable during slow chunk",
    await slow.locator(".story-card.is-active").isVisible(),
  );
  check(
    "slow chunk does not create a partial canvas",
    (await slow.locator(".story-canvas").count()) === 0,
  );
  await slow
    .locator(".story-canvas")
    .waitFor({ state: "attached", timeout: 10000 });
  check(
    "slow chunk recovers after its delay",
    delayed && delayDuration >= 1700,
    `${delayDuration}ms`,
  );
  check(
    "slow-chunk console clean",
    slowErrors.length === 0,
    slowErrors.join(" | "),
  );
  await slow.close();

  // An unavailable dynamic chunk must expose the React fallback without losing the HTML controls.
  const failed = await browser.newPage({
    viewport: { width: 1440, height: 900 },
  });
  const failureErrors = [];
  collectErrors(failed, failureErrors, { allowNetwork: true });
  await installStoryRoutes(failed, storyUrls, (route) => route.abort("failed"));
  await failed.goto(`${base}/solusi/order-grup`, {
    waitUntil: "domcontentloaded",
  });
  await failed.locator(".story-stage").scrollIntoViewIfNeeded();
  await failed
    .locator(".story-no3d")
    .waitFor({ state: "visible", timeout: 10000 });
  check(
    "chunk failure shows readable fallback",
    await failed.locator(".story-no3d").isVisible(),
  );
  check(
    "chunk failure keeps nine HTML scenes",
    (await failed.locator(".story-card").count()) === 9,
  );
  await failed.locator(".story-rail button").nth(3).click();
  check(
    "chunk failure keeps rail usable",
    await failed.locator(".story-card").nth(3).isVisible(),
  );
  await failed.screenshot({ path: join(out, "chunk-fallback.png") });
  await failed.close();

  // Fonts may remain unresolved for longer than the 1.5 s mount ceiling.
  const fonts = await browser.newPage({
    viewport: { width: 1440, height: 900 },
  });
  const fontErrors = [];
  collectErrors(fonts, fontErrors);
  await fonts.route("**/*.woff2", async (route) => {
    await wait(2600);
    await route.continue();
  });
  await fonts.goto(`${base}/solusi/order-grup`, {
    waitUntil: "domcontentloaded",
  });
  const fontStarted = Date.now();
  await fonts.locator(".story-stage").scrollIntoViewIfNeeded();
  await fonts
    .locator(".story-canvas")
    .waitFor({ state: "attached", timeout: 6000 });
  const fontMountElapsed = Date.now() - fontStarted;
  const fontWaitElapsed = Number(
    await fonts.locator(".story-world-host").getAttribute("data-font-wait-ms"),
  );
  check(
    "font wait is capped near 1.5 seconds",
    fontWaitElapsed <= 1700,
    `${fontWaitElapsed}ms font gate; ${fontMountElapsed}ms to canvas`,
  );
  check(
    "slow-font HTML remains readable",
    await fonts.locator(".story-card.is-active").isVisible(),
  );
  check(
    "slow-font console clean",
    fontErrors.length === 0,
    fontErrors.join(" | "),
  );
  await fonts.close();

  // Leaving the route while the font gate is still pending must cancel the mount.
  const early = await browser.newPage({
    viewport: { width: 1440, height: 900 },
  });
  const earlyErrors = [];
  collectErrors(early, earlyErrors);
  await early.route("**/*.woff2", async (route) => {
    await wait(2600);
    await route.continue();
  });
  await early.goto(`${base}/solusi/order-grup`, {
    waitUntil: "domcontentloaded",
  });
  await early.locator(".story-stage").scrollIntoViewIfNeeded();
  await early.waitForTimeout(100);
  await early.goto(`${base}/solusi`, { waitUntil: "domcontentloaded" });
  await early.waitForTimeout(1700);
  check(
    "early route exit leaves no story renderer",
    (await early.locator(".story-canvas,.story-css3d").count()) === 0,
  );
  check(
    "early route exit console clean",
    earlyErrors.length === 0,
    earlyErrors.join(" | "),
  );
  await early.close();

  // Runtime GPU loss must switch to the same fallback and preserve the story.
  const context = await browser.newPage({
    viewport: { width: 1440, height: 900 },
  });
  const contextErrors = [];
  collectErrors(context, contextErrors);
  await context.goto(`${base}/solusi/order-grup`, { waitUntil: "networkidle" });
  await showStory(context);
  const lost = await context.locator(".story-canvas").evaluate((canvas) => {
    const gl = canvas.getContext("webgl2") || canvas.getContext("webgl");
    const extension = gl?.getExtension("WEBGL_lose_context");
    extension?.loseContext();
    return Boolean(extension);
  });
  await context
    .locator(".story-no3d")
    .waitFor({ state: "visible", timeout: 5000 });
  check("browser exposes controlled context-loss hook", lost);
  check(
    "context loss shows fallback message",
    await context.locator(".story-no3d").isVisible(),
  );
  check(
    "context loss hides 3D host",
    await context
      .locator(".story-world-host")
      .evaluate((el) => getComputedStyle(el).display === "none"),
  );
  await context.locator(".story-rail button").nth(6).click();
  check(
    "context loss keeps HTML navigation",
    await context.locator(".story-card").nth(6).isVisible(),
  );
  await context.screenshot({ path: join(out, "context-loss-fallback.png") });
  await context.close();

  // Resize during a timed scene, then verify the final state and renderer dimensions.
  const resize = await browser.newPage({
    viewport: { width: 1440, height: 900 },
  });
  const resizeErrors = [];
  collectErrors(resize, resizeErrors);
  await resize.goto(`${base}/solusi/order-grup`, { waitUntil: "networkidle" });
  await showStory(resize);
  await scene(resize, 5, 250);
  await resize.setViewportSize({ width: 1024, height: 768 });
  await resize.waitForTimeout(250);
  await resize.setViewportSize({ width: 390, height: 844 });
  await resize.waitForTimeout(2600);
  check(
    "resize during animation reaches final status",
    (await resize.locator(".world-status").innerText()) === "Selesai",
  );
  const resized = await resize.locator(".story-world-host").evaluate((host) => {
    const canvas = host.querySelector("canvas");
    const stage = host.getBoundingClientRect();
    const surface = canvas?.getBoundingClientRect();
    return {
      stage: [Math.round(stage.width), Math.round(stage.height)],
      canvas: surface
        ? [Math.round(surface.width), Math.round(surface.height)]
        : [],
      overflow: document.documentElement.scrollWidth - innerWidth,
    };
  });
  check(
    "renderer follows resized stage",
    resized.stage.join("x") === resized.canvas.join("x"),
    JSON.stringify(resized),
  );
  check(
    "resized page has no horizontal overflow",
    resized.overflow <= 1,
    JSON.stringify(resized),
  );
  check(
    "resize console clean",
    resizeErrors.length === 0,
    resizeErrors.join(" | "),
  );
  await resize.close();

  // 360 CSS px represents the reflow width of a 720 px layout at 200% zoom.
  const reflow = await browser.newPage({
    viewport: { width: 360, height: 800 },
    deviceScaleFactor: 2,
  });
  await reflow.goto(`${base}/solusi/order-grup`, { waitUntil: "networkidle" });
  await showStory(reflow);
  await scene(reflow, 6, 2200);
  const reflowData = await reflow.evaluate(() => {
    const button = document
      .querySelector(".story-rail button")
      ?.getBoundingClientRect();
    const card = document
      .querySelector(".story-card.is-active")
      ?.getBoundingClientRect();
    const recap = document
      .querySelector(".world-recap")
      ?.getBoundingClientRect();
    return {
      scrollWidth: document.documentElement.scrollWidth,
      viewport: innerWidth,
      rail: button ? [button.width, button.height] : [],
      card: card ? [card.left, card.right] : [],
      recap: recap ? [recap.left, recap.right, recap.top, recap.bottom] : [],
    };
  });
  check(
    "200% equivalent reflow has no horizontal overflow",
    reflowData.scrollWidth <= reflowData.viewport + 1,
    JSON.stringify(reflowData),
  );
  check(
    "rail target remains at least 24 by 28",
    reflowData.rail[0] >= 24 && reflowData.rail[1] >= 28,
    JSON.stringify(reflowData.rail),
  );
  check(
    "active HTML card remains inside viewport",
    reflowData.card[0] >= 0 && reflowData.card[1] <= 360,
    JSON.stringify(reflowData.card),
  );
  check(
    "recap remains horizontally visible",
    reflowData.recap[0] >= -1 && reflowData.recap[1] <= 361,
    JSON.stringify(reflowData.recap),
  );
  await reflow.screenshot({ path: join(out, "reflow-360-recap.png") });
  await reflow.close();

  // Language, route and modal contact behavior on the detail page.
  const locale = await browser.newPage({
    viewport: { width: 1440, height: 900 },
  });
  const localeErrors = [];
  collectErrors(locale, localeErrors);
  await locale.goto(`${base}/solusi/order-grup`, { waitUntil: "networkidle" });
  await locale.locator('a[lang="en"]').first().click();
  await locale.waitForURL(/\/en\/solutions\/order-grup/);
  check(
    "language switch keeps detail slug",
    new URL(locale.url()).pathname === "/en/solutions/order-grup",
  );
  check(
    "English detail copy renders",
    (await locale.locator("h1").innerText()).startsWith("Group-chat orders"),
  );
  const trigger = locale.locator(".detail-hero [data-contact]");
  await trigger.click();
  check(
    "English contact dialog opens",
    (await locale.locator(".contact-dialog[open]").count()) === 1,
  );
  check(
    "contact dialog focuses close",
    await locale
      .locator(".contact-close")
      .evaluate((el) => el === document.activeElement),
  );
  const waMessage = await locale
    .locator('.contact-dialog a[href^="https://wa.me"]')
    .getAttribute("href");
  check(
    "English contact carries detail title",
    Boolean(
      waMessage && decodeURIComponent(waMessage).includes("Group-chat orders"),
    ),
    String(waMessage),
  );
  await locale.keyboard.press("Escape");
  await locale.waitForTimeout(50);
  check(
    "contact closes and restores trigger focus",
    await trigger.evaluate((el) => el === document.activeElement),
  );
  await locale.goBack({ waitUntil: "networkidle" });
  check(
    "browser history restores Indonesian route",
    new URL(locale.url()).pathname === "/solusi/order-grup",
  );
  check(
    "locale/contact console clean",
    localeErrors.length === 0,
    localeErrors.join(" | "),
  );
  await locale.close();

  // Repeat client unmount and cold remount to catch leaked canvases/listeners.
  const lifecycle = await browser.newPage({
    viewport: { width: 1180, height: 820 },
  });
  const lifecycleErrors = [];
  collectErrors(lifecycle, lifecycleErrors);
  await lifecycle.goto(`${base}/solusi/order-grup`, {
    waitUntil: "networkidle",
  });
  for (let cycle = 1; cycle <= 3; cycle += 1) {
    await showStory(lifecycle);
    check(
      `lifecycle ${cycle} has one renderer pair`,
      (await lifecycle.locator(".story-canvas").count()) === 1 &&
        (await lifecycle.locator(".story-css3d").count()) === 1,
    );
    await lifecycle.locator('a[href="/solusi"]').first().click();
    await lifecycle.waitForURL((url) => url.pathname === "/solusi");
    await lifecycle
      .locator(".story-canvas")
      .first()
      .waitFor({ state: "detached", timeout: 5000 });
    const leftoverLayers = await lifecycle
      .locator(".story-canvas,.story-css3d")
      .count();
    check(
      `lifecycle ${cycle} unmounts renderer`,
      leftoverLayers === 0,
      `${leftoverLayers} layers remain`,
    );
    if (cycle < 3) {
      await lifecycle.goto(`${base}/solusi/order-grup`, {
        waitUntil: "networkidle",
      });
    }
  }
  check(
    "repeated lifecycle console clean",
    lifecycleErrors.length === 0,
    lifecycleErrors.join(" | "),
  );
  await lifecycle.close();

  // Sustained 60 s mobile run: two samples with a scene transition in between.
  const perf = await browser.newPage({
    viewport: { width: 390, height: 844 },
    deviceScaleFactor: 1,
  });
  const perfErrors = [];
  collectErrors(perf, perfErrors);
  await perf.goto(`${base}/solusi/order-grup`, { waitUntil: "networkidle" });
  await showStory(perf);
  await scene(perf, 7, 2000);
  report.performance.push(await sampleFrames(perf, 30000));
  await scene(perf, 5, 2800);
  report.performance.push(await sampleFrames(perf, 30000));
  const renderInfo = await perf.locator(".story-world-host").evaluate((el) => ({
    calls: Number(el.dataset.drawCalls),
    triangles: Number(el.dataset.triangles),
  }));
  const totalDuration = report.performance.reduce(
    (sum, sample) => sum + sample.durationMs,
    0,
  );
  const totalFrames = report.performance.reduce(
    (sum, sample) => sum + sample.frames,
    0,
  );
  const averageFps = totalFrames / (totalDuration / 1000);
  const slowFrames = report.performance.reduce(
    (sum, sample) => sum + sample.slowFrames,
    0,
  );
  check(
    "mobile sustained run covers at least 60 seconds",
    totalDuration >= 60000,
    `${totalDuration.toFixed(1)}ms`,
  );
  check(
    "mobile sustained average stays at or above 30 fps",
    averageFps >= report.limits.mobileAverageFps,
    `${averageFps.toFixed(2)} fps`,
  );
  check(
    "mobile sustained slow-frame ratio is recorded",
    Number.isFinite(slowFrames / totalFrames),
    `${slowFrames}/${totalFrames} (${((slowFrames / totalFrames) * 100).toFixed(2)}%)`,
  );
  check(
    "GPU counts remain within pilot budget",
    renderInfo.calls <= report.limits.drawCalls &&
      renderInfo.triangles <= report.limits.triangles,
    JSON.stringify(renderInfo),
  );
  check(
    "sustained-run console clean",
    perfErrors.length === 0,
    perfErrors.join(" | "),
  );
  await perf.close();
} catch (error) {
  const detail =
    error instanceof Error ? error.stack || error.message : String(error);
  report.errors.push(detail);
  check("OG4 suite completes without a fatal error", false, detail);
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
