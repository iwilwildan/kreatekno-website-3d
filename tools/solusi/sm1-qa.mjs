// BASE=http://localhost:3321 node --import ./tools/solusi/register.mjs tools/solusi/sm1-qa.mjs <output directory>
import assert from "node:assert/strict";
import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { launch } from "../render/lib.mjs";
import { STOK_MENIPIS as timing } from "../../site/components/solusi/detail/ceritaTiming.ts";
import { stokMenipisStory as story } from "../../site/content/solusi/cerita/stok-menipis.ts";

const base = process.env.BASE || "http://localhost:3321";
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
  "sm-before",
  "sm-movement",
  "sm-table",
  "sm-threshold",
  "sm-alert",
  "sm-order",
  "sm-receipt",
  "og-mx",
  "og-mx",
];
const routes = {
  id: "/solusi/stok-menipis",
  en: "/en/solutions/stok-menipis",
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
  else if (!reduced) await page.waitForSelector(".sm-cv.is-film");
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
        document.querySelector(".sm-cv")?.getAttribute("data-scene") ===
          String(scene)
      );
    },
    { progress, scene },
  );
}

async function verify(page, run, scene, film) {
  const result = await page.locator(".sm-cv").evaluate(
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

const resultCopy = {
  id: "Peringatan stok rendah untuk pesan ulang",
  en: "Low-stock alerts for reordering",
};
const triggerCopy = {
  id: "turun di bawah batas minimum",
  en: "falls below the minimum",
};

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
  await goScene(page, 3, timing.START[3] + 1.27);
  check(
    "The threshold is visible before the estimate",
    (await page.locator(".sm-threshold .is-low").isVisible()) &&
      !(await page.locator(".sm-estimate").isVisible()),
  );
  await goScene(page, 6, timing.START[6] + 1.16);
  check(
    "Bimo records the receipt before the balance rises",
    (await page.locator(".sm-receipt .sm-transaction").isVisible()) &&
      !(await page.locator(".sm-receipt .sm-stock-change").isVisible()),
  );
  await goScene(page, 6);
  check(
    "The new balance is visible after the receipt",
    await page.locator(".sm-receipt .sm-stock-change").isVisible(),
  );

  await page.locator(".story-node").nth(2).press("Enter");
  await waitAt(page, 3);
  check(
    "Keyboard selects the threshold",
    (await page.locator(".story-node").nth(2).getAttribute("aria-current")) ===
      "step",
  );
  await page.locator(".story-ctrl button").nth(1).click();
  await waitAt(page, 4);
  check(
    "Next opens the alert",
    (await page.locator("#scene-peringatkan-pembelian.is-live").count()) === 1,
  );
  await page.locator(".story-ctrl button").first().click();
  await waitAt(page, 3);
  check(
    "Previous returns to the threshold",
    (await page.locator("#scene-bandingkan-minimum.is-live").count()) === 1,
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
      `${name} shows an order awaiting delivery at the original balance`,
      (await fallback.locator(".sm-order .sm-facts dd").innerText()) ===
        "16 karton" && !(await fallback.locator(".sm-receipt").isVisible()),
    );
    await fallback.close();
  }

  for (const locale of ["id", "en"]) {
    const localPage = await open(viewports.phone, { locale });
    const { stage, scenes } = story[locale];
    const { stock, labels } = stage;
    if (locale === "en") {
      for (const scene of panels.keys()) {
        await goScene(localPage, scene);
        await verify(localPage, "EN phone", scene, true);
      }
    }
    await goScene(localPage, 1);
    check(
      `${locale} the movement form records the outbound quantity and SKU`,
      (await localPage.locator(".sm-movement code").innerText()) ===
        stage.sku &&
        (await localPage
          .locator(".sm-movement .sm-transaction b")
          .innerText()) === `−${stock.outbound} ${labels.unit}`,
    );
    await goScene(localPage, 2);
    check(
      `${locale} the table drops from 24 to 16`,
      (await localPage
        .locator(".sm-table .sm-stock-change span")
        .innerText()) === String(stock.opening) &&
        (await localPage
          .locator(".sm-table .sm-stock-change b")
          .innerText()) === String(stock.remaining),
    );
    await goScene(localPage, 3);
    const comparison = await localPage
      .locator(".sm-gauge")
      .evaluate((gauge) => {
        const bar = gauge.querySelector("i").getBoundingClientRect();
        const marker = gauge.querySelector("span").getBoundingClientRect();
        return bar.right < marker.left;
      });
    check(
      `${locale} the bar is below the marker and the estimate is labelled as a design step`,
      comparison &&
        (await localPage.locator(".sm-gauge-values dd").allTextContents()).join(
          "|",
        ) ===
          [stock.remaining, stock.minimum]
            .map((amount) => `${amount} ${labels.unit}`)
            .join("|") &&
        (await localPage.locator(".sm-estimate .sm-status").innerText()) ===
          labels.design &&
        (await localPage.locator(".sm-estimate p").innerText()) ===
          labels.estimateBasis &&
        (await localPage.locator(".sm-estimate b").innerText()) ===
          labels.estimate,
    );
    if (locale === "en") await capture(localPage, "en-phone-4");
    await goScene(localPage, 4);
    const message = localPage.locator(".sm-message");
    check(
      `${locale} Rina's alert has the item and two stock figures`,
      (await localPage.locator(".sm-alert .sm-head > span").innerText()) ===
        stage.buyer &&
        (await message.locator("strong").innerText()) === stage.item &&
        (await message.locator("dd").allTextContents()).join("|") ===
          [stock.remaining, stock.minimum]
            .map((amount) => `${amount} ${labels.unit}`)
            .join("|") &&
        !(await localPage.locator(".sm-estimate").isVisible()),
    );
    await goScene(localPage, 5);
    check(
      `${locale} the purchasing order holds the balance at 16 during delivery`,
      (await localPage.locator(".sm-order .sm-head > span").innerText()) ===
        stage.buyer &&
        (await localPage.locator(".sm-pending-order b").innerText()) ===
          `${stock.ordered} ${labels.unit}` &&
        (await localPage
          .locator(".sm-pending-order .sm-status")
          .innerText()) === labels.waiting &&
        (await localPage.locator(".sm-order .sm-facts dd").innerText()) ===
          `${stock.remaining} ${labels.unit}`,
    );
    await goScene(localPage, 6);
    check(
      `${locale} receipt adds the ordered quantity to the same SKU`,
      (await localPage.locator(".sm-receipt code").innerText()) === stage.sku &&
        (await localPage.locator(".sm-receipt .sm-head > span").innerText()) ===
          stage.clerk &&
        (await localPage
          .locator(".sm-receipt .sm-transaction b")
          .innerText()) === `+${stock.ordered} ${labels.unit}` &&
        (await localPage
          .locator(".sm-receipt .sm-stock-change b")
          .innerText()) === String(stock.closing),
    );
    const html = await (
      await localPage.request.get(`${base}${routes[locale]}`)
    ).text();
    check(
      `${locale} server HTML has nine scenes and the updated Baca copy`,
      scenes.every(({ title }) => html.includes(title)) &&
        html.includes(triggerCopy[locale]) &&
        html.includes(resultCopy[locale]),
    );
    await localPage.goto(
      `${base}${locale === "id" ? "/solusi" : "/en/solutions"}?no3d`,
      { waitUntil: "domcontentloaded" },
    );
    check(
      `${locale} etalase uses the updated result`,
      (await localPage
        .locator('a.prod[data-slug="stok-menipis"] .cover .sub')
        .innerText()) === resultCopy[locale],
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
