// BASE=http://localhost:3318 node --import ./tools/solusi/register.mjs tools/solusi/as1-qa.mjs <output directory>
import assert from "node:assert/strict";
import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { launch } from "../render/lib.mjs";
import { ASISTEN_SOP as timing } from "../../site/components/solusi/detail/ceritaTiming.ts";
import { asistenSopStory as story } from "../../site/content/solusi/cerita/asisten-sop.ts";

const base = process.env.BASE || "http://localhost:3318";
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
  "as-before",
  "as-folder",
  "as-library",
  "as-ask",
  "as-answered",
  "as-outside",
  "as-log",
  "og-mx",
  "og-mx",
];
const routes = { id: "/solusi/asisten-sop", en: "/en/solutions/asisten-sop" };
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
  else if (!reduced) await page.waitForSelector(".as-cv.is-film");
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
        document.querySelector(".as-cv")?.getAttribute("data-scene") ===
          String(scene)
      );
    },
    { progress, scene },
  );
}

async function verify(page, run, scene, film) {
  const result = await page.locator(".as-cv").evaluate(
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
      if ([4, 5, 6].includes(scene) && ["desktop", "phone"].includes(name))
        await capture(page, `${name}-${scene + 1}`);
    }
    for (let scene = panels.length - 2; scene >= 0; scene--) {
      await goScene(page, scene);
      await verify(page, `${name} reverse`, scene, true);
    }
  }
  await page.setViewportSize(viewports.desktop);
  await goScene(page, 4, timing.START[4] + 1.02);
  check(
    "Reply appears before the source card",
    (await page.locator(".as-answered .as-reply").isVisible()) &&
      !(await page.locator(".as-source").isVisible()),
  );
  await goScene(page, 5, timing.START[5] + 1.41);
  check(
    "The bot's guidance appears before Wulan contacts the branch manager",
    (await page.locator(".as-outside .as-reply").isVisible()) &&
      !(await page.locator(".as-staff-action").isVisible()),
  );
  await page.locator(".story-node").nth(2).press("Enter");
  await waitAt(page, 3);
  check(
    "Keyboard selects the staff question",
    (await page.locator(".story-node").nth(2).getAttribute("aria-current")) ===
      "step",
  );
  await page.locator(".story-ctrl button").nth(1).click();
  await waitAt(page, 4);
  check(
    "Next selects the cited answer",
    (await page.locator(".as-cv").getAttribute("data-scene")) === "4",
  );
  await page.locator(".story-ctrl button").first().click();
  await waitAt(page, 3);
  check(
    "Previous returns to the staff question",
    (await page.locator(".as-cv").getAttribute("data-scene")) === "3",
  );
  await goScene(page, 8);
  await page
    .locator("#scene-konsultasi")
    .getByRole("button", { name: "Konsultasi gratis" })
    .click();
  check(
    "CTA opens the contact dialog",
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
    await fallback.close();
  }

  for (const locale of ["id", "en"]) {
    const localPage = await open(viewports.phone, { locale });
    const copy = story[locale].stage;
    if (locale === "en") {
      for (const scene of panels.keys()) {
        await goScene(localPage, scene);
        await verify(localPage, "EN phone", scene, true);
      }
    }
    await goScene(localPage, 2);
    check(
      `${locale} shows the processed document version`,
      (await localPage.locator(".as-library .as-file").innerText()).includes(
        `v${copy.document.version}`,
      ) &&
        (await localPage.locator(".as-library .as-ready").innerText()) ===
          copy.labels.ready,
    );
    await goScene(localPage, 4);
    check(
      `${locale} cites the document and section under all three steps`,
      (await localPage.locator(".as-source").innerText()).includes(
        copy.document.title,
      ) &&
        (await localPage.locator(".as-source").innerText()).includes(
          `${copy.labels.source} ${copy.document.section} · ${copy.document.heading}`,
        ) &&
        (
          await localPage.locator(".as-answered .as-reply li").allTextContents()
        ).join("|") === copy.answer.join("|"),
    );
    if (locale === "en") await capture(localPage, "en-phone-5");
    await goScene(localPage, 5);
    check(
      `${locale} shows guidance and a separate action by Wulan`,
      (await localPage.locator(".as-outside .as-reply").innerText()).includes(
        copy.guidance,
      ) &&
        (await localPage.locator(".as-staff-action").innerText()).includes(
          copy.labels.staffAction,
        ),
    );
    await goScene(localPage, 6);
    check(
      `${locale} marks the Sheets example as proposed`,
      (await localPage.locator(".as-log .as-design").innerText()) ===
        copy.labels.design &&
        (await localPage.locator(".as-log-entry").innerText()).includes(
          copy.logTopic,
        ),
    );
    const html = await (
      await localPage.request.get(`${base}${routes[locale]}`)
    ).text();
    check(
      `${locale} server HTML has all nine scene headings and the copy qualifier`,
      story[locale].scenes.every(({ title }) => html.includes(title)) &&
        html.includes(
          locale === "id"
            ? "Dalam rancangan, topik tersebut"
            : "The proposed workflow can also log the topic",
        ),
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
