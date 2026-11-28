// BASE=http://localhost:3300 node --import ./tools/solusi/register.mjs tools/solusi/bk1-qa.mjs <output directory>
import assert from "node:assert/strict";
import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { launch } from "../render/lib.mjs";
import { BALAS_KOMENTAR as timing } from "../../site/components/solusi/detail/ceritaTiming.ts";

const base = process.env.BASE || "http://localhost:3000";
const out = process.argv[2];
if (!out) throw new Error("Pass an output directory");
mkdirSync(out, { recursive: true });

const browser = await launch();
const report = { checks: [], errors: [] };
const gsapChunks = new Set();
const viewports = {
  wide: { width: 1897, height: 940 },
  desktop: { width: 1440, height: 900 },
  tablet: { width: 1024, height: 1366 },
  phone: { width: 390, height: 844 },
  small: { width: 360, height: 740 },
};

const objects = [
  [".bk-post", ".bk-missed", ".bk-packing"],
  [".bk-post", ".bk-schedule", ".bk-packet"],
  [".bk-packet", ".bk-history", ".bk-duplicate"],
  [".bk-packet", ".bk-filter", ".bk-keywords .is-match", ".bk-ignored"],
  [".bk-public", ".bk-packet", ".bk-reply"],
  [".bk-inbox", ".bk-message", ".bk-catalog"],
  [".bk-inbox", ".bk-message", ".bk-customer", ".bk-staff", ".bk-log"],
  [".og-mx", ".og-m"],
  [".og-mx"],
];
const mainObjects = [
  ".bk-schedule",
  ".bk-post",
  ".bk-packing",
  ".bk-history",
  ".bk-filter",
  ".bk-public",
  ".bk-packet",
  ".bk-inbox",
  ".bk-log",
  ".og-mx",
  ".bk-customer",
  ".bk-staff",
];
const separated = {
  1: [
    [".bk-schedule", ".bk-post"],
    [".bk-post", ".bk-packet"],
  ],
  2: [[".bk-packet", ".bk-history"]],
  3: [[".bk-packet", ".bk-filter"]],
  4: [
    [".bk-public .bk-panel-title", ".bk-packet"],
    [".bk-packet", ".bk-reply"],
  ],
  6: [[".bk-handoff", ".bk-log"]],
};

function check(name, pass, detail = "") {
  report.checks.push({ name, pass, detail });
}

async function open(
  viewport,
  { locale = "id", reduced = false, blockGsap = false } = {},
) {
  const page = await browser.newPage({ viewport });
  await page.emulateMedia({
    reducedMotion: reduced ? "reduce" : "no-preference",
  });
  page.on("pageerror", (error) => report.errors.push(error.message));
  const scriptResponses = [];
  const recordScripts = gsapChunks.size === 0;
  if (recordScripts) {
    page.on("response", (response) => {
      if (
        response.request().resourceType() === "script" &&
        response.url().startsWith(`${base}/_next/static/`)
      ) {
        scriptResponses.push(response);
      }
    });
  }
  let blocked;
  if (blockGsap) {
    const isGsapChunk = (url) => gsapChunks.has(url.href);
    await page.route(isGsapChunk, (route) => route.abort());
    blocked = page.waitForEvent("requestfailed", (request) =>
      gsapChunks.has(request.url()),
    );
  }
  const path = locale === "id" ? "/solusi" : "/en/solutions";
  const response = await page.goto(`${base}${path}/balas-komentar`, {
    waitUntil: "domcontentloaded",
  });
  assert.equal(response.status(), 200);
  assert.equal(
    await page.evaluate(
      () => matchMedia("(prefers-reduced-motion: reduce)").matches,
    ),
    reduced,
  );
  await page.locator(".story-reel").evaluate((reel) => reel.scrollIntoView());
  if (!blockGsap && !reduced) {
    await page.waitForSelector(".bk-cv.is-film");
    if (recordScripts) {
      await Promise.allSettled(
        scriptResponses.map(async (script) => {
          if (/GreenSock|gsap\.com\/standard-license/.test(await script.text()))
            gsapChunks.add(script.url());
        }),
      );
      assert.ok(
        gsapChunks.size,
        "Identify the loaded GSAP chunk before testing its failure",
      );
    }
  } else if (blockGsap) {
    await blocked;
  }
  return page;
}

async function goScene(page, scene, at = timing.restTime(scene)) {
  await page.locator(".story-reel").evaluate(async (reel, progress) => {
    const top = scrollY + reel.getBoundingClientRect().top;
    scrollTo({
      top: top + progress * (reel.offsetHeight - innerHeight),
      behavior: "instant",
    });
    await new Promise((resolve) =>
      requestAnimationFrame(() => requestAnimationFrame(resolve)),
    );
  }, at / timing.TOTAL);
  await page.waitForFunction(
    (index) => Number(document.querySelector(".bk-cv").dataset.scene) === index,
    scene,
  );
}

function pose(page, scene) {
  return page.evaluate(
    ({ scene, expected, mainObjects, separated, nodes }) => {
      const canvas = document.querySelector(".bk-cv");
      const visible = (selector) => {
        let node = canvas.querySelector(selector);
        if (!node) return false;
        while (node && node !== canvas) {
          const { visibility, opacity } = getComputedStyle(node);
          if (visibility !== "visible" || Number(opacity) < 0.4) return false;
          node = node.parentElement;
        }
        return true;
      };
      const bounds = (selector) =>
        canvas.querySelector(selector).getBoundingClientRect();
      const missing = expected.filter((selector) => !visible(selector));
      const extras = mainObjects.filter(
        (selector) => !expected.includes(selector) && visible(selector),
      );
      const live = document.querySelector(".story-caps > li.is-live");
      if (Array.from(live.parentElement.children).indexOf(live) !== scene)
        missing.push("matching caption");
      const step = document.querySelector(".story-node[aria-current='step']");
      if (
        scene > 0 &&
        scene <= nodes &&
        step !== document.querySelectorAll(".story-node")[scene - 1]
      )
        missing.push("matching rail step");
      const frame = canvas.getBoundingClientRect();
      for (const selector of expected.filter(visible)) {
        const box = bounds(selector);
        if (
          box.left < frame.left - 2 ||
          box.right > frame.right + 2 ||
          box.top < frame.top - 2 ||
          box.bottom > frame.bottom + 2
        )
          missing.push(`outside canvas: ${selector}`);
      }
      for (const [a, b] of separated) {
        if (bounds(a).bottom > bounds(b).top + 1)
          missing.push(`overlap: ${a} and ${b}`);
      }
      return {
        issues: [...missing, ...extras.map((selector) => `extra: ${selector}`)],
        film: canvas.classList.contains("is-film"),
        day: !document
          .querySelector(".story-stage")
          .classList.contains("is-night"),
        fits: document.documentElement.scrollWidth <= innerWidth,
      };
    },
    {
      scene,
      expected: objects[scene],
      mainObjects,
      separated: separated[scene] || [],
      nodes: timing.NODES,
    },
  );
}

async function checkPose(page, name, scene, film = true) {
  const result = await pose(page, scene);
  check(
    `${name}, scene ${scene + 1}`,
    result.issues.length === 0 &&
      result.film === film &&
      result.day &&
      result.fits,
    result,
  );
}

async function capture(page, file) {
  await page.waitForFunction(() => {
    const captions = Array.from(document.querySelectorAll(".story-caps > li"));
    return captions.every(
      (caption) =>
        getComputedStyle(caption).opacity ===
        (caption.classList.contains("is-live") ? "1" : "0"),
    );
  });
  await page.screenshot({ path: join(out, file) });
}

try {
  const page = await open(viewports.wide);
  for (const [name, viewport] of Object.entries(viewports)) {
    await page.setViewportSize(viewport);
    for (const scene of objects.keys()) {
      await goScene(page, scene);
      await checkPose(page, `${name} forward`, scene);
      if (name === "desktop" || name === "phone")
        await capture(page, `${name}-${scene + 1}.png`);
    }
    for (let scene = objects.length - 2; scene >= 0; scene--) {
      await goScene(page, scene);
      await checkPose(page, `${name} back`, scene);
    }
  }

  await page.setViewportSize(viewports.desktop);
  const keyNode = page.locator(".story-node").nth(2);
  await keyNode.focus();
  await keyNode.press("Enter");
  await page.waitForFunction(
    () =>
      document
        .querySelectorAll(".story-node")[2]
        .getAttribute("aria-current") === "step",
  );
  check(
    "Enter activates the third workflow step",
    (await keyNode.getAttribute("aria-current")) === "step",
  );
  const caption = page.locator(".story-caps > li.is-live");
  await page.locator(".story-ctrl button").nth(1).click();
  await page.waitForSelector("#scene-balas-publik.is-live");
  check(
    "Next opens the public reply scene",
    (await caption.getAttribute("id")) === "scene-balas-publik",
  );
  await page.locator(".story-ctrl button").first().click();
  await page.waitForSelector("#scene-cek-kata-kunci.is-live");
  check(
    "Previous returns to keyword checking",
    (await caption.getAttribute("id")) === "scene-cek-kata-kunci",
  );

  await goScene(page, 2);
  const duplicate = await page.locator(".bk-duplicate").innerText();
  check(
    "Previously recorded ID is skipped",
    /K-019/.test(duplicate) && /Sudah ditangani/.test(duplicate),
  );
  await goScene(page, 5);
  check(
    "One initial private bubble and its catalog",
    (await page.locator(".bk-message").count()) === 1 &&
      (await page.locator(".bk-catalog").isVisible()),
  );
  await goScene(page, 6, timing.START[6] + 1.15);
  check(
    "Customer replies before staff join",
    (await page.locator(".bk-customer").isVisible()) &&
      !(await page.locator(".bk-staff").isVisible()),
  );
  await goScene(page, 6);
  check(
    "Log retains the triggering comment ID",
    (await page.locator(".bk-log code").innerText()) ===
      (await page.locator(".bk-packet code").textContent()),
  );
  await goScene(page, 8);
  await caption
    .getByRole("button", { name: "Konsultasi gratis", exact: true })
    .click();
  check(
    "Final CTA opens the contact dialog",
    (await page.locator("dialog[open]").count()) === 1,
  );
  await page.close();

  const reduced = await open(viewports.phone, { reduced: true });
  for (const scene of objects.keys()) {
    await goScene(
      reduced,
      scene,
      timing.START[scene] + timing.SC[scene].in * 0.57,
    );
    await checkPose(reduced, "reduced motion", scene, false);
  }
  await reduced.close();

  for (const name of ["desktop", "phone"]) {
    const blocked = await open(viewports[name], { blockGsap: true });
    for (const scene of objects.keys()) {
      await goScene(blocked, scene);
      await checkPose(blocked, `${name} without GSAP`, scene, false);
    }
    await blocked.close();
  }

  const en = await open(viewports.phone, { locale: "en" });
  for (const scene of objects.keys()) {
    await goScene(en, scene);
    await checkPose(en, "EN phone", scene);
  }
  await goScene(en, 6);
  check(
    "EN handoff copy",
    /Handled by staff/.test(await en.locator(".bk-staff").innerText()) &&
      /Is sage still in stock/.test(
        await en.locator(".bk-customer").innerText(),
      ),
  );
  await capture(en, "en-phone-7.png");
  await en.close();
} finally {
  writeFileSync(join(out, "report.json"), JSON.stringify(report, null, 2));
  await browser.close();
}

const failed = report.checks.filter(({ pass }) => !pass);
console.log(
  `${report.checks.length - failed.length}/${report.checks.length} passed; page errors ${report.errors.length}`,
);
for (const { name, detail } of failed) console.error(name, detail);
for (const error of report.errors) console.error(error);
if (failed.length || report.errors.length) process.exitCode = 1;
