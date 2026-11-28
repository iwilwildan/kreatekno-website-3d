// BASE=http://localhost:3315 node --import ./tools/solusi/register.mjs tools/solusi/fk1-qa.mjs <output directory>
import assert from "node:assert/strict";
import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { launch } from "../render/lib.mjs";
import { FAKTUR_PEMASOK as timing } from "../../site/components/solusi/detail/ceritaTiming.ts";

const base = process.env.BASE || "http://localhost:3315";
const output = process.argv[2];
if (!output) throw new Error("Pass an output directory");
mkdirSync(output, { recursive: true });

const viewports = {
  wide: { width: 1897, height: 940 },
  desktop: { width: 1440, height: 900 },
  tablet: { width: 1024, height: 1366 },
  phone: { width: 390, height: 844 },
  small: { width: 360, height: 740 },
};
const visibleByScene = [
  [".fk-before"],
  [".fk-sources", ".fk-file"],
  [".fk-document"],
  [".fk-fields"],
  [".fk-compare"],
  [".fk-ledger", ".fk-duplicate"],
  [".fk-decision", ".fk-ledger"],
  [".og-mx"],
  [".og-mx"],
];
const browser = await launch();
const report = { checks: [], errors: [] };
const gsapChunks = new Set();
const check = (name, pass, detail) =>
  report.checks.push({ name, pass, detail });

async function open(
  viewport,
  { locale = "id", reduced = false, blockGsap = false } = {},
) {
  const page = await browser.newPage({ viewport });
  await page.emulateMedia({
    reducedMotion: reduced ? "reduce" : "no-preference",
  });
  page.on("pageerror", (error) => report.errors.push(error.message));
  const scripts = [];
  if (!gsapChunks.size)
    page.on("response", (response) => {
      if (
        response.request().resourceType() === "script" &&
        response.url().startsWith(`${base}/_next/static/`)
      )
        scripts.push(response);
    });
  let blocked;
  if (blockGsap) {
    await page.route(
      (url) => gsapChunks.has(url.href),
      (route) => route.abort(),
    );
    blocked = page.waitForEvent("requestfailed", (request) =>
      gsapChunks.has(request.url()),
    );
  }
  const route = locale === "id" ? "/solusi" : "/en/solutions";
  const response = await page.goto(`${base}${route}/faktur-pemasok`, {
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
  if (blockGsap) await blocked;
  else if (!reduced) await page.waitForSelector(".fk-cv.is-film");
  if (scripts.length)
    await Promise.allSettled(
      scripts.map(async (response) => {
        if (/GreenSock|gsap\.com\/standard-license/.test(await response.text()))
          gsapChunks.add(response.url());
      }),
    );
  return page;
}

async function goScene(page, scene, time = timing.restTime(scene)) {
  const canvas = page.locator(`.fk-cv[data-scene='${scene}']`);
  await page.locator(".story-reel").evaluate((reel, progress) => {
    const top = scrollY + reel.getBoundingClientRect().top;
    scrollTo({
      top: top + (reel.offsetHeight - innerHeight) * progress,
      behavior: "instant",
    });
  }, time / timing.TOTAL);
  await canvas.waitFor();
  await canvas.evaluate(
    () =>
      new Promise((resolve) =>
        requestAnimationFrame(() => requestAnimationFrame(resolve)),
      ),
  );
}

async function verifyPose(page, scope, scene, isFilm) {
  const result = await page.locator(".fk-cv").evaluate(
    (canvas, { expected, scene, isFilm }) => {
      const shown = (element) => {
        const style = getComputedStyle(element);
        return style.visibility === "visible" && Number(style.opacity) >= 0.4;
      };
      const actual = [...canvas.children].filter(shown);
      const bounds = canvas.getBoundingClientRect();
      const checks = [
        Number(canvas.dataset.scene) === scene,
        expected.every((selector) =>
          actual.includes(canvas.querySelector(selector)),
        ) && actual.length === expected.length,
        actual.every((element) => {
          const box = element.getBoundingClientRect();
          return (
            box.left >= bounds.left - 2 &&
            box.right <= bounds.right + 2 &&
            box.top >= bounds.top - 2 &&
            box.bottom <= bounds.bottom + 2 &&
            element.scrollWidth <= element.clientWidth + 2
          );
        }),
        canvas.classList.contains("is-film") === isFilm,
        document.documentElement.scrollWidth <= innerWidth,
        document
          .querySelectorAll(".story-caps > li")
          [scene].classList.contains("is-live"),
      ];
      if (scene === 5 || scene === 6) {
        const first = canvas.querySelector(
          scene === 5 ? ".fk-ledger" : ".fk-decision",
        );
        const second = canvas.querySelector(
          scene === 5 ? ".fk-duplicate" : ".fk-ledger",
        );
        checks.push(
          first.getBoundingClientRect().bottom + 2 <=
            second.getBoundingClientRect().top,
        );
        checks.push(
          shown(
            canvas.querySelector(scene === 5 ? ".fk-pending" : ".fk-rejected"),
          ),
        );
        checks.push(
          !shown(
            canvas.querySelector(scene === 6 ? ".fk-pending" : ".fk-rejected"),
          ),
        );
      }
      return { checks, actual: actual.map(({ className }) => className) };
    },
    { expected: visibleByScene[scene], scene, isFilm },
  );
  check(`${scope}, scene ${scene + 1}`, result.checks.every(Boolean), result);
}

async function capture(page, path) {
  await page.waitForFunction(() =>
    [...document.querySelectorAll(".story-caps > li")].every(
      (caption) =>
        getComputedStyle(caption).opacity ===
        (caption.classList.contains("is-live") ? "1" : "0"),
    ),
  );
  await page.screenshot({ path: join(output, path) });
}

try {
  const page = await open(viewports.wide);
  assert.ok(gsapChunks.size, "Identify the GSAP chunk for the fallback test");
  for (const [name, viewport] of Object.entries(viewports)) {
    await page.setViewportSize(viewport);
    for (const scene of visibleByScene.keys()) {
      await goScene(page, scene);
      await verifyPose(page, `${name} forward`, scene, true);
      if ([2, 4, 6].includes(scene) && ["desktop", "phone"].includes(name))
        await capture(page, `${name}-${scene + 1}.png`);
    }
    for (let scene = visibleByScene.length - 2; scene >= 0; scene--) {
      await goScene(page, scene);
      await verifyPose(page, `${name} reverse`, scene, true);
    }
  }
  await page.setViewportSize(viewports.desktop);
  await page.locator(".story-node").nth(3).press("Enter");
  await page.waitForSelector("#scene-harga-dicocokkan.is-live");
  check(
    "Keyboard opens the price check",
    (await page.locator(".story-node").nth(3).getAttribute("aria-current")) ===
      "step",
  );
  check(
    "The variance is 20 × Rp1.500 = Rp30.000",
    /20 sak × Rp1.500\s*Rp30.000/.test(
      await page.locator(".fk-variance").innerText(),
    ),
  );
  await page.locator(".story-ctrl button").nth(1).click();
  await page.waitForSelector("#scene-masuk-tabel.is-live");
  await goScene(page, 5);
  check(
    "One ledger row for FP-028",
    (await page.locator(".fk-record").count()) === 1 &&
      (await page.locator(".fk-record code").innerText()) === "FP-028",
  );
  check(
    "The copy has the same identity and is skipped",
    /FP-028 · Pemasok S-02\s*Sudah tercatat/.test(
      await page.locator(".fk-duplicate").innerText(),
    ),
  );
  await goScene(page, 6, timing.START[6] + 1.11);
  check(
    "Owner sees both choices before the decision is recorded",
    (await page.locator(".fk-actions").isVisible()) &&
      (await page.locator(".fk-pending").isVisible()) &&
      !(await page.locator(".fk-rejected").isVisible()),
  );
  await goScene(page, 6);
  check(
    "Reject records the new status and reason for FP-028",
    (await page.locator(".fk-decision code").innerText()) === "FP-028" &&
      (await page.locator(".fk-reason").isVisible()) &&
      /Ditolak/.test(await page.locator(".fk-rejected").innerText()),
  );
  await page.locator(".story-ctrl button").first().click();
  check(
    "Previous returns to the ledger",
    (await page.waitForSelector("#scene-masuk-tabel.is-live")) !== null,
  );
  await goScene(page, 8);
  await page
    .locator("#scene-konsultasi")
    .getByRole("button", { name: "Konsultasi gratis" })
    .click();
  check(
    "Final CTA opens the contact dialog",
    (await page.waitForSelector("dialog[open]")) !== null,
  );
  await page.close();

  for (const [name, options] of [
    ["reduced motion", { reduced: true }],
    ["GSAP blocked", { blockGsap: true }],
  ]) {
    const fallback = await open(viewports.phone, options);
    for (const scene of visibleByScene.keys()) {
      await goScene(
        fallback,
        scene,
        timing.START[scene] + timing.SC[scene].in * 0.61,
      );
      await verifyPose(fallback, name, scene, false);
    }
    await fallback.close();
  }

  const en = await open(viewports.phone, { locale: "en" });
  for (const scene of visibleByScene.keys()) {
    await goScene(en, scene);
    await verifyPose(en, "EN phone", scene, true);
  }
  await goScene(en, 6);
  check(
    "English decision and amounts",
    /Rejected · needs correction/.test(
      await en.locator(".fk-rejected").innerText(),
    ) && /Rp1,740,000/.test(await en.locator(".fk-decision").innerText()),
  );
  await capture(en, "en-phone-7.png");
  await en.close();
} finally {
  writeFileSync(join(output, "report.json"), JSON.stringify(report, null, 2));
  await browser.close();
}

const failed = report.checks.filter(({ pass }) => !pass);
console.log(
  `${report.checks.length - failed.length}/${report.checks.length} passed; page errors ${report.errors.length}`,
);
for (const { name, detail } of failed) console.error(name, detail);
for (const error of report.errors) console.error(error);
if (failed.length || report.errors.length) process.exitCode = 1;
