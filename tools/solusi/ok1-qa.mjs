// BASE=http://localhost:3317 node --import ./tools/solusi/register.mjs tools/solusi/ok1-qa.mjs <output directory>
import assert from "node:assert/strict";
import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { launch } from "../render/lib.mjs";
import { ONBOARDING_KLIEN as timing } from "../../site/components/solusi/detail/ceritaTiming.ts";

const base = process.env.BASE || "http://localhost:3317";
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
  [".ok-before"],
  [".ok-deal"],
  [".ok-checklist"],
  [".ok-draft"],
  [".ok-calendar", ".ok-proposal"],
  [".ok-review", ".ok-delivery"],
  [".ok-register"],
  [".og-mx"],
  [".og-mx"],
];
const browser = await launch();
const report = { checks: [], errors: [] };
const gsapChunks = new Set();
const check = (name, pass, detail) =>
  report.checks.push({ name, pass, detail });
const routes = { id: "/solusi", en: "/en/solutions" };
const resultCopy = {
  id: "Sambutan, checklist, dan undangan di hari yang sama",
  en: "Welcome, checklist, and kickoff invite sent the same day",
};

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
  assert.equal(
    (
      await page.goto(`${base}${routes[locale]}/onboarding-klien`, {
        waitUntil: "domcontentloaded",
      })
    ).status(),
    200,
  );
  await page.locator(".story-reel").evaluate((reel) => reel.scrollIntoView());
  if (blockGsap) await blocked;
  else if (!reduced) await page.waitForSelector(".ok-cv.is-film");
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
  const active = page.locator(`.ok-cv[data-scene='${scene}']`);
  await active.waitFor();
  await active.evaluate(
    () =>
      new Promise((resolve) =>
        requestAnimationFrame(() => requestAnimationFrame(resolve)),
      ),
  );
}

async function verify(page, name, scene, film) {
  const result = await page.locator(".ok-cv").evaluate(
    (canvas, { expected, scene, film }) => {
      const actual = [...canvas.children].filter((element) => {
        const style = getComputedStyle(element);
        return style.visibility === "visible" && Number(style.opacity) >= 0.4;
      });
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
      if (scene === 4 || scene === 5)
        checks.push(
          actual[0]?.getBoundingClientRect().bottom + 2 <=
            actual[1]?.getBoundingClientRect().top,
        );
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
      if ([3, 4, 5, 6].includes(scene) && ["desktop", "phone"].includes(name))
        await capture(page, `${name}-${scene + 1}`);
    }
    for (let scene = poses.length - 2; scene >= 0; scene--) {
      await goScene(page, scene);
      await verify(page, `${name} reverse`, scene, true);
    }
  }
  await page.setViewportSize(viewports.desktop);
  await page.locator(".story-node").nth(1).press("Enter");
  await page.waitForSelector("#scene-checklist-disiapkan.is-live");
  await goScene(page, 2);
  const prep = await page.locator(".ok-prep li").allTextContents();
  check(
    "Keyboard opens the three-item package checklist",
    prep.length === 3 &&
      (await page
        .locator(".story-node")
        .nth(1)
        .getAttribute("aria-current")) === "step",
  );
  await page.locator(".story-ctrl button").nth(1).click();
  check(
    "Next opens the email draft",
    (await page.waitForSelector("#scene-draf-email.is-live")) !== null,
  );
  await goScene(page, 3);
  check(
    "Draft keeps the package checklist and waits for a time",
    (await page.locator(".ok-letter li").allTextContents()).every(
      (item, i) => item.trim() === prep[i].trim(),
    ) &&
      /Halo, Rani/.test(await page.locator(".ok-letter").innerText()) &&
      /Jadwal menyusul/.test(
        await page.locator(".ok-slot-pending").innerText(),
      ) &&
      !(await page.locator(".ok-delivery").isVisible()),
  );
  await goScene(page, 4);
  check(
    "Only 10.00–10.30 is free and the draft carries WITA",
    (await page.locator(".ok-slots .is-free").count()) === 1 &&
      /10\.00–10\.30/.test(
        await page.locator(".ok-slots .is-free").innerText(),
      ) &&
      /10\.00–10\.30 WITA/.test(await page.locator(".ok-proposal").innerText()),
  );
  await goScene(page, 5, timing.START[5] + 1.11);
  check(
    "Nadia and the slot check appear before delivery",
    (await page.locator(".ok-review code").innerText()) === "Nadia" &&
      (await page.locator(".ok-check-slot").isVisible()) &&
      !(await page.locator(".ok-delivery").isVisible()),
  );
  await goScene(page, 5);
  check(
    "Email and invitation are sent on Friday",
    (await page.locator(".ok-delivery").isVisible()) &&
      /Email terkirim\s*Undangan terkirim[\s\S]*27 Nov 2026/.test(
        await page.locator(".ok-delivery").innerText(),
      ),
  );
  await goScene(page, 6);
  check(
    "OB-024 records Nadia and the future kickoff with response pending",
    (await page.locator(".ok-register code").innerText()) === "OB-024" &&
      /Nadia[\s\S]*30 Nov 2026 · 10\.00–10\.30 WITA[\s\S]*Menunggu respons klien/.test(
        await page.locator(".ok-register").innerText(),
      ),
  );
  await page.locator(".story-ctrl button").first().click();
  check(
    "Previous returns to staff review",
    (await page.waitForSelector("#scene-staf-cek-dan-kirim.is-live")) !== null,
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
  check(
    "ID detail copy describes an invitation",
    (await page.getByText(resultCopy.id, { exact: true }).count()) >= 1,
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
    "EN status and WITA use the same story slot",
    /Nov 30, 2026 · 10:00–10:30 WITA[\s\S]*Awaiting client response/.test(
      await en.locator(".ok-register").innerText(),
    ),
  );
  check(
    "EN detail copy describes an invitation",
    (await en.getByText(resultCopy.en, { exact: true }).count()) >= 1,
  );
  await capture(en, "en-phone-7");
  for (const locale of ["id", "en"]) {
    await en.goto(`${base}${routes[locale]}?no3d`, {
      waitUntil: "domcontentloaded",
    });
    check(
      `${locale.toUpperCase()} etalase uses the updated result`,
      (await en
        .locator('a.prod[data-slug="onboarding-klien"] .cover .sub')
        .innerText()) === resultCopy[locale],
    );
  }
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
