// BASE=http://localhost:3319 node --import ./tools/solusi/register.mjs tools/solusi/cr1-qa.mjs <output directory>
import assert from "node:assert/strict";
import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { launch } from "../render/lib.mjs";
import { CAROUSEL_KONTEN as timing } from "../../site/components/solusi/detail/ceritaTiming.ts";
import { carouselKontenStory as story } from "../../site/content/solusi/cerita/carousel-konten.ts";

const base = process.env.BASE || "http://localhost:3319";
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
  "cr-before",
  "cr-topics",
  "cr-outline",
  "cr-frame-sample",
  "cr-gallery",
  "cr-caption",
  "cr-handoff",
  "og-mx",
  "og-mx",
];
const routes = {
  id: "/solusi/carousel-konten",
  en: "/en/solutions/carousel-konten",
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
  else if (!reduced) await page.waitForSelector(".cr-cv.is-film");
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
        document.querySelector(".cr-cv")?.getAttribute("data-scene") ===
          String(scene)
      );
    },
    { progress, scene },
  );
}

async function verify(page, run, scene, film) {
  const result = await page.locator(".cr-cv").evaluate(
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
  await goScene(page, 4, timing.START[4] + 1.01);
  const visibleCards = await page
    .locator(".cr-gallery .cr-frame")
    .evaluateAll((cards) =>
      cards.map((card) => getComputedStyle(card).visibility),
    );
  check(
    "Early gallery shows the opener before the last card",
    visibleCards[0] === "visible" && visibleCards.at(-1) === "hidden",
    visibleCards,
  );
  await goScene(page, 6, timing.START[6] + 1.07);
  const handoff = await page
    .locator(".cr-handoff > div")
    .evaluateAll((steps) =>
      steps.map((step) => getComputedStyle(step).visibility),
    );
  check(
    "Folder and preview appear before the review status",
    handoff.join(",") === "visible,visible,hidden",
    handoff,
  );

  await page.locator(".story-node").nth(3).press("Enter");
  await waitAt(page, 4);
  check(
    "Keyboard selects the gallery",
    (await page.locator(".story-node").nth(3).getAttribute("aria-current")) ===
      "step",
  );
  await page.locator(".story-ctrl button").nth(1).click();
  await waitAt(page, 5);
  check(
    "Next opens the caption",
    (await page.locator("#scene-tulis-caption.is-live").count()) === 1,
  );
  await page.locator(".story-ctrl button").first().click();
  await waitAt(page, 4);
  check(
    "Previous returns to the gallery",
    (await page.locator("#scene-buat-lima-slide.is-live").count()) === 1,
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
    for (const scene of panels.keys()) {
      await goScene(
        fallback,
        scene,
        timing.START[scene] + timing.SC[scene].in * 0.61,
      );
      await verify(fallback, name, scene, false);
    }
    await goScene(fallback, 4);
    check(
      `${name} preserves all slide titles and bodies`,
      (await fallback.locator(".cr-gallery .cr-frame").allTextContents()).every(
        (card, index) =>
          card.includes(story.id.stage.slides[index].title) &&
          card.includes(story.id.stage.slides[index].body),
      ) && (await fallback.locator(".cr-gallery .cr-frame").count()) === 5,
    );
    await fallback.close();
  }

  for (const locale of ["id", "en"]) {
    const localPage = await open(viewports.phone, { locale });
    const { stage, scenes } = story[locale];
    if (locale === "en") {
      for (const scene of panels.keys()) {
        await goScene(localPage, scene);
        await verify(localPage, "EN phone", scene, true);
      }
    }
    await goScene(localPage, 1);
    check(
      `${locale} brief carries the row, type, and slide count`,
      (await localPage.locator(".cr-topics code").innerText()) ===
        stage.number &&
        (await localPage.locator(".cr-meta").innerText()).includes(
          stage.labels.education,
        ) &&
        (await localPage.locator(".cr-meta").innerText()).includes(
          stage.labels.slideCount,
        ),
    );
    await goScene(localPage, 3);
    const sampleFrame = await localPage
      .locator(".cr-frame-sample .cr-frame")
      .evaluate((frame) => ({
        background: getComputedStyle(frame).backgroundColor,
        border: getComputedStyle(frame).borderTopColor,
        brand: frame.querySelector(".cr-brand").textContent,
        footer: frame.querySelector(".cr-footer").textContent,
      }));
    await goScene(localPage, 4);
    const gallery = await localPage
      .locator(".cr-gallery .cr-frame")
      .evaluateAll((cards) =>
        cards.map((card) => ({
          title: card.querySelector(".cr-slide-title").textContent,
          body: card.querySelector("p").textContent,
          kind: card.dataset.kind,
          frame: {
            background: getComputedStyle(card).backgroundColor,
            border: getComputedStyle(card).borderTopColor,
            brand: card.querySelector(".cr-brand").textContent,
            footer: card.querySelector(".cr-footer").textContent,
          },
          size: [card.offsetWidth, card.offsetHeight].join("x"),
          contained:
            card.scrollWidth <= card.clientWidth + 2 &&
            card.scrollHeight <= card.clientHeight + 2,
        })),
      );
    check(
      `${locale} shows all five slides in order with the same frame`,
      gallery.length === 5 &&
        gallery.every(
          ({ title, body, kind, frame, size, contained }, index) =>
            title === stage.slides[index].title &&
            body === stage.slides[index].body &&
            kind === stage.slides[index].kind &&
            contained &&
            size === gallery[0].size &&
            JSON.stringify(frame) === JSON.stringify(sampleFrame),
        ),
      gallery,
    );
    if (locale === "en") await capture(localPage, "en-phone-5");
    await goScene(localPage, 5);
    check(
      `${locale} shows the draft caption and both hashtags`,
      (await localPage.locator(".cr-caption-body p").innerText()) ===
        stage.caption &&
        (await localPage.locator(".cr-caption-body span").innerText()) ===
          stage.hashtags.join(" "),
    );
    await goScene(localPage, 6);
    check(
      `${locale} final handoff has the same folder, five previews and pending review`,
      (await localPage.locator(".cr-handoff-folder code").innerText()) ===
        stage.number &&
        (await localPage.locator(".cr-handoff-status code").innerText()) ===
          stage.number &&
        (
          await localPage.locator(".cr-preview-strip span").allTextContents()
        ).join("") === "12345" &&
        (await localPage.locator(".cr-review").innerText()).trim() ===
          stage.labels.review,
    );
    const html = await (
      await localPage.request.get(`${base}${routes[locale]}`)
    ).text();
    check(
      `${locale} server HTML has nine scene headings and caption`,
      scenes.every(({ title }) => html.includes(title)) &&
        html.includes(stage.caption),
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
