// BASE=http://localhost:3320 node --import ./tools/solusi/register.mjs tools/solusi/bd1-qa.mjs <output directory>
import assert from "node:assert/strict";
import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { launch } from "../render/lib.mjs";
import { BERKAS_DOKUMEN as timing } from "../../site/components/solusi/detail/ceritaTiming.ts";
import { berkasDokumenStory as story } from "../../site/content/solusi/cerita/berkas-dokumen.ts";

const base = process.env.BASE || "http://localhost:3320";
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
const panels = [
  "bd-before",
  "bd-receive",
  "bd-folder",
  "bd-read",
  "bd-request",
  "bd-update",
  "bd-review",
  "og-mx",
  "og-mx",
];
const routes = {
  id: "/solusi/berkas-dokumen",
  en: "/en/solutions/berkas-dokumen",
};
const browser = await launch();
const report = { checks: [], errors: [] };
const gsapChunks = new Set();
const check = (name, pass, detail) =>
  report.checks.push({ name, pass, detail });

async function open(
  viewport,
  { locale = "id", reduced = false, blockGsap = false } = {},
) {
  const page = await browser.newPage({
    viewport,
    reducedMotion: reduced ? "reduce" : "no-preference",
  });
  page.on("pageerror", (error) => report.errors.push(error.message));
  const scripts = [];
  if (!gsapChunks.size) {
    page.on("response", (response) => {
      if (
        response.request().resourceType() === "script" &&
        response.url().startsWith(`${base}/_next/static/`)
      ) {
        scripts.push(response);
      }
    });
  }
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
  const response = await page.goto(`${base}${routes[locale]}`, {
    waitUntil: "domcontentloaded",
  });
  assert.equal(response.status(), 200);
  await page.locator(".story-reel").evaluate((reel) => reel.scrollIntoView());
  if (blockGsap) await blocked;
  else if (!reduced) await page.waitForSelector(".bd-cv.is-film");
  await Promise.allSettled(
    scripts.map(async (script) => {
      if (/GreenSock|gsap\.com\/standard-license/.test(await script.text()))
        gsapChunks.add(script.url());
    }),
  );
  return page;
}

async function goScene(page, scene, time = timing.restTime(scene)) {
  const progress = time / timing.TOTAL;
  await page.locator(".story-reel").evaluate((reel, progress) => {
    const top = scrollY + reel.getBoundingClientRect().top;
    scrollTo({
      top: top + (reel.offsetHeight - innerHeight) * progress,
      behavior: "instant",
    });
  }, progress);
  await waitAt(page, scene, progress);
}

async function waitAt(
  page,
  scene,
  progress = timing.restTime(scene) / timing.TOTAL,
) {
  await page.waitForFunction(
    ({ progress, scene }) => {
      const bar = document.querySelector(".story-bar i");
      const applied = Number(
        bar?.style.transform.match(/^scaleX\((.*)\)$/)?.[1],
      );
      return (
        Math.abs(applied - progress) < 0.001 &&
        document.querySelector(".bd-cv")?.getAttribute("data-scene") ===
          String(scene)
      );
    },
    { progress, scene },
  );
}

async function verify(page, run, scene, film) {
  const result = await page.locator(".bd-cv").evaluate(
    (canvas, { expected, scene, film }) => {
      const visible = [...canvas.children].filter((panel) => {
        const style = getComputedStyle(panel);
        return style.visibility === "visible" && Number(style.opacity) >= 0.4;
      });
      const bounds = canvas.getBoundingClientRect();
      const inside = visible.every((panel) => {
        const box = panel.getBoundingClientRect();
        return (
          box.left >= bounds.left - 2 &&
          box.right <= bounds.right + 2 &&
          box.top >= bounds.top - 2 &&
          box.bottom <= bounds.bottom + 2 &&
          panel.scrollWidth <= panel.clientWidth + 2
        );
      });
      return {
        scene:
          Number(canvas.dataset.scene) === scene &&
          document
            .querySelectorAll(".story-caps > li")
            [scene]?.classList.contains("is-live"),
        panel: visible.length === 1 && visible[0].classList.contains(expected),
        inside: inside && document.documentElement.scrollWidth <= innerWidth,
        mode: canvas.classList.contains("is-film") === film,
      };
    },
    { expected: panels[scene], scene, film },
  );
  check(
    `${run}, scene ${scene + 1}`,
    Object.values(result).every(Boolean),
    result,
  );
}

async function capture(page, name) {
  await page.waitForFunction(() =>
    [...document.querySelectorAll(".story-caps > li")].every(
      (item) =>
        getComputedStyle(item).opacity ===
        (item.classList.contains("is-live") ? "1" : "0"),
    ),
  );
  await page.screenshot({ path: join(output, `${name}.png`) });
}

try {
  const page = await open(viewports.wide);
  assert.ok(gsapChunks.size, "Identify the GSAP chunk before blocking it");
  for (const [name, viewport] of Object.entries(viewports)) {
    await page.setViewportSize(viewport);
    for (const scene of panels.keys()) {
      await goScene(page, scene);
      await verify(page, `${name} forward`, scene, true);
      if ([3, 4, 5, 6].includes(scene) && ["desktop", "phone"].includes(name)) {
        await capture(page, `${name}-${scene + 1}`);
      }
    }
    for (let scene = panels.length - 2; scene >= 0; scene--) {
      await goScene(page, scene);
      await verify(page, `${name} reverse`, scene, true);
    }
  }

  await page.setViewportSize(viewports.desktop);
  await goScene(page, 5, timing.START[5] + 1.17);
  check(
    "Replacement photo and PDF appear before the ready status",
    (await page.locator(".bd-update .bd-files li").last().isVisible()) &&
      !(await page.locator(".bd-update .bd-summary").isVisible()),
  );
  await goScene(page, 6, timing.START[6] + 1.26);
  check(
    "Sari's verification appears before the complete status",
    (await page.locator(".bd-verification").isVisible()) &&
      !(await page.locator(".bd-complete").isVisible()),
  );
  await goScene(page, 6);
  check(
    "Final status is visible after verification",
    (await page.locator(".bd-verification").isVisible()) &&
      (await page.locator(".bd-complete").isVisible()),
  );

  await page.locator(".story-node").nth(2).press("Enter");
  await waitAt(page, 3);
  check(
    "Keyboard selects the checklist",
    (await page.locator(".story-node").nth(2).getAttribute("aria-current")) ===
      "step",
  );
  await page.locator(".story-ctrl button").nth(1).click();
  await waitAt(page, 4);
  check(
    "Next opens Sari's request",
    (await page.locator("#scene-minta-dilengkapi.is-live").count()) === 1,
  );
  await page.locator(".story-ctrl button").first().click();
  await waitAt(page, 3);
  check(
    "Previous returns to the checklist",
    (await page.locator("#scene-baca-dan-catat.is-live").count()) === 1,
  );
  await goScene(page, 8);
  await page.waitForFunction(() => {
    const caption = document.querySelector("#scene-konsultasi.is-live");
    return caption && getComputedStyle(caption).opacity === "1";
  });
  await page
    .locator("#scene-konsultasi.is-live")
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
    for (const scene of panels.keys()) {
      await goScene(
        fallback,
        scene,
        timing.START[scene] + timing.SC[scene].in * 0.61,
      );
      await verify(fallback, name, scene, false);
    }
    await goScene(fallback, 5);
    check(
      `${name} shows ready status before the staff check`,
      (await fallback.locator(".bd-update .is-ready").isVisible()) &&
        !(await fallback.locator(".bd-complete").isVisible()),
    );
    await fallback.close();
  }

  for (const locale of ["id", "en"]) {
    const localPage = await open(viewports.phone, { locale });
    const { stage, scenes } = story[locale];
    const { documents, labels } = stage;
    if (locale === "en") {
      for (const scene of panels.keys()) {
        await goScene(localPage, scene);
        await verify(localPage, "EN phone", scene, true);
      }
    }
    await goScene(localPage, 1);
    check(
      `${locale} first submission contains the original photo and the certificate PDF`,
      (await localPage
        .locator(".bd-receive [data-format=photo] small")
        .innerText()) === documents.identity.first &&
        (await localPage
          .locator(".bd-receive [data-format=pdf] small")
          .innerText()) === documents.certificate.file,
    );
    await goScene(localPage, 2);
    check(
      `${locale} the same two files are stored in the customer folder`,
      (await localPage.locator(".bd-folder code").innerText()) ===
        stage.reference &&
        (
          await localPage
            .locator(".bd-folder .bd-files small")
            .allTextContents()
        ).join("|") ===
          [documents.identity.first, documents.certificate.file].join("|"),
    );
    await goScene(localPage, 3);
    const initial = localPage.locator(".bd-read");
    const rows = await initial.locator(".bd-checklist li b").allTextContents();
    check(
      `${locale} first pass shows one readable, one missing and one to resend`,
      (await initial.locator(".bd-count").innerText()).includes("1/3") &&
        (await initial.locator(".bd-checklist .is-missing").innerText()) ===
          labels.missing &&
        (await initial.locator(".bd-checklist .is-resend").innerText()) ===
          labels.resend &&
        (await initial.locator(".bd-checklist .is-read").count()) === 1,
    );
    await goScene(localPage, 4);
    check(
      `${locale} Sari asks for the replacement and missing file in one message`,
      (await localPage.locator(".bd-bubble b").innerText()) ===
        stage.reviewer &&
        (await localPage.locator(".bd-bubble p").innerText()) === stage.request,
    );
    await goScene(localPage, 5);
    const updated = localPage.locator(".bd-update");
    check(
      `${locale} both new files update the original checklist and are ready for staff`,
      (await updated.locator("code").innerText()) === stage.reference &&
        (await updated.locator(".bd-update-heading b").innerText()) ===
          labels.checklist &&
        (await updated.locator(".bd-files small").allTextContents()).join(
          "|",
        ) ===
          [documents.identity.replacement, documents.family.file].join("|") &&
        (await updated.locator(".bd-checklist li b").allTextContents()).join(
          "|",
        ) === rows.join("|") &&
        (await updated.locator(".bd-checklist .is-read").count()) === 3 &&
        (await updated.locator(".bd-count").innerText()).includes("3/3") &&
        (await updated.locator(".is-ready").innerText()) === labels.ready &&
        !(await localPage.locator(".bd-complete").isVisible()),
    );
    if (locale === "en") await capture(localPage, "en-phone-6");
    await goScene(localPage, 6);
    check(
      `${locale} staff review marks the same case complete for processing`,
      (await localPage.locator(".bd-review code").innerText()) ===
        stage.reference &&
        (await localPage.locator(".bd-review-note b").innerText()) ===
          stage.reviewer &&
        (await localPage.locator(".bd-complete .bd-tag").innerText()) ===
          labels.complete,
    );
    const html = await (
      await localPage.request.get(`${base}${routes[locale]}`)
    ).text();
    check(
      `${locale} server HTML contains the nine scenes and the sample case`,
      scenes.every(({ title }) => html.includes(title)) &&
        html.includes(stage.reference),
    );
    await localPage.close();
  }
} finally {
  writeFileSync(join(output, "report.json"), JSON.stringify(report, null, 2));
  await browser.close();
}

const failed = report.checks.filter(({ pass }) => !pass);
console.log(
  `${report.checks.length - failed.length}/${report.checks.length} passed; page errors ${report.errors.length}`,
);
for (const failure of failed) console.error(failure.name, failure.detail);
for (const error of report.errors) console.error(error);
if (failed.length || report.errors.length) process.exitCode = 1;
