// BASE=http://localhost:3324 node --import ./tools/solusi/register.mjs tools/solusi/rp1-qa.mjs <output directory>
import assert from "node:assert/strict";
import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { launch } from "../render/lib.mjs";
import { REKAP_PENJUALAN as timing } from "../../site/components/solusi/detail/ceritaTiming.ts";
import { rekapPenjualanStory as story } from "../../site/content/solusi/cerita/rekap-penjualan.ts";

const base = process.env.BASE || "http://localhost:3324";
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
  ".rp-before",
  ".rp-sheet",
  ".rp-sum",
  ".rp-comparison",
  ".rp-recap",
  ".rp-ask",
  ".rp-answer",
  ".og-mx",
  ".og-mx",
];
const routes = {
  id: "/solusi/rekap-penjualan",
  en: "/en/solutions/rekap-penjualan",
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
  else if (!reduced) await page.waitForSelector(".rp-cv.is-film");
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
        document.querySelector(".rp-cv")?.getAttribute("data-scene") ===
          String(scene)
      );
    },
    { progress, scene },
  );
}

async function verify(page, run, scene, film) {
  const result = await page.locator(".rp-cv").evaluate(
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
        panel: visible.length === 1 && visible[0].matches(expected),
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
      if ([1, 3, 4, 6].includes(scene) && ["desktop", "phone"].includes(name)) {
        await capture(page, `${name}-${scene + 1}`);
      }
    }
    for (let scene = panels.length - 2; scene >= 0; scene--) {
      await goScene(page, scene);
      await verify(page, `${name} reverse`, scene, true);
    }
  }

  await page.setViewportSize(viewports.desktop);
  await goScene(page, 2, timing.START[2] + 1.05);
  check(
    "The total is visible before the top product",
    (await page.locator(".rp-sum .rp-total").isVisible()) &&
      !(await page.locator(".rp-top").isVisible()),
  );
  await goScene(page, 6, timing.START[6] + 1.15);
  check(
    "The answer appears before its source card",
    (await page.locator(".rp-response").isVisible()) &&
      !(await page.locator(".rp-source").isVisible()),
  );

  await page.locator(".story-node").nth(2).press("Enter");
  await waitAt(page, 3);
  check(
    "Keyboard selects the two comparisons",
    (await page.locator(".story-node").nth(2).getAttribute("aria-current")) ===
      "step",
  );
  await page.locator(".story-ctrl button").nth(1).click();
  await waitAt(page, 4);
  check(
    "Next opens the recap",
    (await page.locator("#scene-kirim-rekap.is-live").count()) === 1,
  );
  await page.locator(".story-ctrl button").first().click();
  await waitAt(page, 3);
  check(
    "Previous returns to the comparisons",
    (await page.locator("#scene-bandingkan-periode.is-live").count()) === 1,
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
    await goScene(fallback, 6);
    check(
      `${name} preserves the answer and source`,
      (await fallback.locator(".rp-response strong").innerText()) ===
        "240 karton" &&
        (await fallback.locator(".rp-source b").innerText()) ===
          story.id.stage.history.source,
    );
    await fallback.close();
  }

  for (const locale of ["id", "en"]) {
    const localPage = await open(viewports.phone, { locale });
    const { stage, scenes } = story[locale];
    const { products, areas, history, labels } = stage;
    const money = (amount) => `Rp${amount.toLocaleString(stage.locale)}`;
    if (locale === "en") {
      for (const scene of panels.keys()) {
        await goScene(localPage, scene);
        await verify(localPage, "EN phone", scene, true);
      }
    }
    await goScene(localPage, 1);
    const rows = await localPage
      .locator(".rp-sheet tbody tr")
      .evaluateAll((items) =>
        items.map((row) => [...row.cells].map((cell) => cell.textContent)),
      );
    check(
      `${locale} the recap reads the four expected rows at the sample time`,
      JSON.stringify(rows) ===
        JSON.stringify(
          stage.rows.map(({ product, area, cartons, amount }) => [
            products[product],
            areas[area],
            String(cartons),
            money(amount),
          ]),
        ) &&
        (await localPage
          .locator(".rp-sheet .rp-run time")
          .getAttribute("datetime")) === stage.date &&
        (await localPage.locator(".rp-sheet .rp-run span").innerText()) ===
          stage.at,
    );
    await goScene(localPage, 2);
    check(
      `${locale} totals and the top product match the source`,
      (await localPage.locator(".rp-sum .rp-total b").innerText()) ===
        money(stage.total) &&
        (
          await localPage.locator(".rp-sum .rp-facts dd").allTextContents()
        ).join("|") === Object.values(stage.areaTotals).map(money).join("|") &&
        (await localPage.locator(".rp-top b").innerText()) ===
          products[stage.top.product] &&
        (await localPage.locator(".rp-top strong").innerText()) ===
          `${stage.top.cartons} ${labels.cartons}`,
    );
    await goScene(localPage, 3);
    check(
      `${locale} the two comparisons use the correct dates, values and changes`,
      (
        await localPage
          .locator(".rp-periods time")
          .evaluateAll((items) =>
            items.map((item) => item.getAttribute("datetime")),
          )
      ).join("|") === stage.periods.map(({ date }) => date).join("|") &&
        (await localPage.locator(".rp-periods strong").allTextContents()).join(
          "|",
        ) === stage.periods.map(({ amount }) => money(amount)).join("|") &&
        (await localPage.locator(".rp-periods .rp-change").allTextContents())
          .map((v) => v.trim())
          .join("|") === "+20%|−20%",
    );
    await goScene(localPage, 4);
    check(
      `${locale} one recap carries the same amounts and comparison values`,
      (await localPage.locator(".rp-recap .rp-bubble").count()) === 1 &&
        (await localPage.locator(".rp-recap .rp-total b").innerText()) ===
          money(stage.total) &&
        (
          await localPage.locator(".rp-recap .rp-facts dd").allTextContents()
        ).join("|") === `${stage.top.cartons} ${labels.cartons}|+20%|−20%`,
    );
    await goScene(localPage, 5);
    check(
      `${locale} Nita asks about the previous month`,
      (await localPage.locator(".rp-ask .rp-question b").innerText()) ===
        stage.owner &&
        (await localPage.locator(".rp-ask .rp-question p").innerText()) ===
          stage.question &&
        !(await localPage.locator(".rp-response").isVisible()),
    );
    await goScene(localPage, 6);
    check(
      `${locale} the answer has the month, cartons and cited source`,
      (await localPage.locator(".rp-response p").innerText()).includes(
        history.month,
      ) &&
        (await localPage.locator(".rp-response strong").innerText()) ===
          `${history.cartons} ${labels.cartons}` &&
        (await localPage.locator(".rp-response dd").allTextContents()).join(
          "|",
        ) ===
          [history.north, history.south]
            .map((cartons) => `${cartons} ${labels.cartons}`)
            .join("|") &&
        (await localPage.locator(".rp-source b").innerText()) ===
          history.source,
    );
    if (locale === "en") await capture(localPage, "en-phone-7");
    const html = await (
      await localPage.request.get(`${base}${routes[locale]}`)
    ).text();
    check(
      `${locale} server HTML has all nine headings and the updated Baca`,
      scenes.every(({ title }) => html.includes(title)) &&
        html.includes(
          locale === "id"
            ? "periode yang tersedia di tabel"
            : "periods available in the table",
        ) &&
        html.includes(
          locale === "id"
            ? // SEO copy v1 (28 Nov 2026) reworded the 24-hour window without the platform term.
              "dalam 24 jam sejak pesan terakhir pemilik"
            : "24-hour customer service window",
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
