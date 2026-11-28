// BASE=http://localhost:3316 node --import ./tools/solusi/register.mjs tools/solusi/sd1-qa.mjs <output directory>
import assert from "node:assert/strict";
import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { launch } from "../render/lib.mjs";
import { LAYANAN_SDM as timing } from "../../site/components/solusi/detail/ceritaTiming.ts";

const base = process.env.BASE || "http://localhost:3316";
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
const poses = [
  [".sd-before"],
  [".sd-inbox", ".sd-packet"],
  [".sd-route"],
  [".sd-balance"],
  [".sd-manager"],
  [".sd-manager"],
  [".sd-register", ".sd-confirm"],
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
  const path = locale === "id" ? "/solusi" : "/en/solutions";
  assert.equal(
    (
      await page.goto(`${base}${path}/layanan-sdm`, {
        waitUntil: "domcontentloaded",
      })
    ).status(),
    200,
  );
  assert.equal(
    await page.evaluate(
      () => matchMedia("(prefers-reduced-motion: reduce)").matches,
    ),
    reduced,
  );
  await page.locator(".story-reel").evaluate((reel) => reel.scrollIntoView());
  if (blockGsap) await blocked;
  else if (!reduced) await page.waitForSelector(".sd-cv.is-film");
  await Promise.allSettled(
    scripts.map(async (response) => {
      if (/GreenSock|gsap\.com\/standard-license/.test(await response.text()))
        gsapChunks.add(response.url());
    }),
  );
  return page;
}

async function goScene(page, scene, time = timing.restTime(scene)) {
  await page.locator(".story-reel").evaluate((reel, progress) => {
    const top = scrollY + reel.getBoundingClientRect().top;
    scrollTo({
      top: top + (reel.offsetHeight - innerHeight) * progress,
      behavior: "instant",
    });
  }, time / timing.TOTAL);
  const active = page.locator(`.sd-cv[data-scene='${scene}']`);
  await active.waitFor();
  await active.evaluate(
    () =>
      new Promise((resolve) =>
        requestAnimationFrame(() => requestAnimationFrame(resolve)),
      ),
  );
}

async function verify(page, name, scene, film) {
  const result = await page.locator(".sd-cv").evaluate(
    (canvas, { expected, scene, film }) => {
      const shown = (element) => {
        const style = getComputedStyle(element);
        return style.visibility === "visible" && Number(style.opacity) >= 0.4;
      };
      const actual = [...canvas.children].filter(shown);
      const bounds = canvas.getBoundingClientRect();
      const checks = [
        Number(canvas.dataset.scene) === scene,
        actual.length === expected.length &&
          expected.every((selector) =>
            actual.includes(canvas.querySelector(selector)),
          ),
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
        film === canvas.classList.contains("is-film"),
        document
          .querySelectorAll(".story-caps > li")
          [scene].classList.contains("is-live"),
        document.documentElement.scrollWidth <= innerWidth,
      ];
      if (scene === 4 || scene === 5) {
        checks.push(shown(canvas.querySelector(".sd-stamp")) === (scene === 5));
        checks.push(
          shown(canvas.querySelector(".sd-manager .sd-pending")) ===
            (scene === 4),
        );
      }
      if (scene === 1 || scene === 6) {
        checks.push(
          actual[0]?.getBoundingClientRect().bottom + 2 <=
            actual[1]?.getBoundingClientRect().top,
        );
      }
      return { checks, actual: actual.map(({ className }) => className) };
    },
    { expected: poses[scene], scene, film },
  );
  check(`${name}, scene ${scene + 1}`, result.checks.every(Boolean), result);
}

async function capture(page, name) {
  await page.waitForFunction(() =>
    [...document.querySelectorAll(".story-caps > li")].every(
      (caption) =>
        getComputedStyle(caption).opacity ===
        (caption.classList.contains("is-live") ? "1" : "0"),
    ),
  );
  await page.screenshot({ path: join(output, `${name}.png`) });
}

try {
  const page = await open(viewports.wide);
  assert.ok(gsapChunks.size, "Identify the GSAP chunk before blocking it");
  for (const [name, viewport] of Object.entries(viewports)) {
    await page.setViewportSize(viewport);
    for (const scene of poses.keys()) {
      await goScene(page, scene);
      await verify(page, `${name} forward`, scene, true);
      if ([2, 4, 6].includes(scene) && ["desktop", "phone"].includes(name))
        await capture(page, `${name}-${scene + 1}`);
    }
    for (let scene = poses.length - 2; scene >= 0; scene--) {
      await goScene(page, scene);
      await verify(page, `${name} reverse`, scene, true);
    }
  }
  await page.setViewportSize(viewports.desktop);
  await page.locator(".story-node").nth(1).press("Enter");
  await page.waitForSelector("#scene-pesan-diarahkan.is-live");
  check(
    "Keyboard selects the routing step",
    (await page.locator(".story-node").nth(1).getAttribute("aria-current")) ===
      "step",
  );
  await goScene(page, 2);
  check(
    "Three routes, a policy reference, and HR handoff",
    (await page.locator(".sd-route-chips > span").count()) === 3 &&
      /Bagian 3\.2/.test(await page.locator(".sd-source").innerText()) &&
      (await page.locator(".sd-handoff").innerText()) === "Diteruskan ke SDM",
  );
  await page.locator(".story-ctrl button").nth(1).click();
  check(
    "Next opens the original balance",
    (await page.waitForSelector("#scene-cek-sisa-cuti.is-live")) !== null,
  );
  await goScene(page, 4);
  check(
    "CT-017 is pending with five days and both choices",
    (await page.locator(".sd-manager code").innerText()) === "CT-017" &&
      (await page.locator(".sd-manager .sd-original").innerText()) ===
        "5 hari" &&
      /Setujui\s*Tolak/.test(await page.locator(".sd-actions").innerText()) &&
      !(await page.locator(".sd-register").isVisible()),
  );
  await goScene(page, 5);
  check(
    "Approval happens before the balance update",
    (await page.locator(".sd-stamp").isVisible()) &&
      (await page.locator(".sd-manager .sd-original").innerText()) ===
        "5 hari" &&
      !(await page.locator(".sd-confirm").isVisible()),
  );
  await goScene(page, 6);
  check(
    "One approved record updates five to four and notifies Dina",
    (await page.locator(".sd-record").count()) === 1 &&
      (await page.locator(".sd-record code").innerText()) === "CT-017" &&
      /5 hari\s*4 hari/.test(await page.locator(".sd-change").innerText()) &&
      /Sisa cuti · 4 hari/.test(await page.locator(".sd-confirm").innerText()),
  );
  await page.locator(".story-ctrl button").first().click();
  check(
    "Previous returns to manager decision",
    (await page.waitForSelector("#scene-atasan-memutuskan.is-live")) !== null,
  );
  await goScene(page, 8);
  await page
    .locator("#scene-konsultasi")
    .getByRole("button", { name: "Konsultasi gratis" })
    .click();
  check(
    "The CTA opens the contact dialog",
    (await page.waitForSelector("dialog[open]")) !== null,
  );
  await page.close();

  for (const [name, options] of [
    ["reduced motion", { reduced: true }],
    ["GSAP blocked", { blockGsap: true }],
  ]) {
    const fallback = await open(viewports.phone, options);
    for (const scene of poses.keys()) {
      await goScene(
        fallback,
        scene,
        timing.START[scene] + timing.SC[scene].in * 0.61,
      );
      await verify(fallback, name, scene, false);
    }
    await fallback.close();
  }
  const en = await open(viewports.phone, { locale: "en" });
  for (const scene of poses.keys()) {
    await goScene(en, scene);
    await verify(en, "EN phone", scene, true);
  }
  await goScene(en, 6);
  check(
    "English notice shows the approved four-day balance",
    /approved/.test(await en.locator(".sd-confirm").innerText()) &&
      /Leave balance · 4 days/.test(
        await en.locator(".sd-confirm").innerText(),
      ),
  );
  await capture(en, "en-phone-7");
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
