// BASE=http://localhost:3322 node --import ./tools/solusi/register.mjs tools/solusi/pt1-qa.mjs <output directory>
import assert from "node:assert/strict";
import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { launch } from "../render/lib.mjs";
import { PENGINGAT_TAGIHAN as timing } from "../../site/components/solusi/detail/ceritaTiming.ts";
import { pengingatTagihanStory as story } from "../../site/content/solusi/cerita/pengingat-tagihan.ts";

const base = process.env.BASE || "http://localhost:3322";
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
  ".pt-before",
  ".pt-morning",
  '.pt-reminder[data-reminder="0"]',
  '.pt-reminder[data-reminder="1"]',
  '.pt-reminder[data-reminder="2"]',
  ".pt-payment",
  ".pt-handoff",
  ".og-mx",
  ".og-mx",
];
const routes = {
  id: "/solusi/pengingat-tagihan",
  en: "/en/solutions/pengingat-tagihan",
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
  else if (!reduced) await page.waitForSelector(".pt-cv.is-film");
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
        document.querySelector(".pt-cv")?.getAttribute("data-scene") ===
          String(scene)
      );
    },
    { progress, scene },
  );
}

async function verify(page, run, scene, film) {
  const result = await page.locator(".pt-cv").evaluate(
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
      if ([2, 4, 5, 6].includes(scene) && ["desktop", "phone"].includes(name)) {
        await capture(page, `${name}-${scene + 1}`);
      }
    }
    for (let scene = panels.length - 2; scene >= 0; scene--) {
      await goScene(page, scene);
      await verify(page, `${name} reverse`, scene, true);
    }
  }

  await page.setViewportSize(viewports.desktop);
  await goScene(page, 2, timing.START[2] + 0.93);
  const first = page.locator(panels[2]);
  check(
    "The first reminder appears before its history row",
    (await first.locator(".pt-message").isVisible()) &&
      !(await first.locator(".pt-log").isVisible()),
  );
  await goScene(page, 5, timing.START[5] + 0.92);
  check(
    "Payment is confirmed before marking the invoice Paid",
    (await page.locator(".pt-confirm").isVisible()) &&
      !(await page.locator(".pt-paid-row").isVisible()),
  );
  await goScene(page, 6, timing.START[6] + 1.0);
  check(
    "The unpaid invoice appears before the owner handoff",
    (await page.locator(".pt-handoff .pt-invoices li").last().isVisible()) &&
      !(await page.locator(".pt-owner").isVisible()),
  );

  await page.locator(".story-node").nth(1).press("Enter");
  await waitAt(page, 2);
  check(
    "Keyboard selects the first reminder",
    (await page.locator(".story-node").nth(1).getAttribute("aria-current")) ===
      "step",
  );
  await page.locator(".story-ctrl button").nth(1).click();
  await waitAt(page, 3);
  check(
    "Next opens the due date reminder",
    (await page.locator("#scene-ingatkan-hari-h.is-live").count()) === 1,
  );
  await page.locator(".story-ctrl button").first().click();
  await waitAt(page, 2);
  check(
    "Previous returns to the first reminder",
    (await page.locator("#scene-ingatkan-h-3.is-live").count()) === 1,
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
      `${name} preserves the paid and skipped statuses`,
      (await fallback.locator(".pt-paid-row .is-paid").innerText()) ===
        story.id.stage.labels.paid &&
        (await fallback.locator(".pt-skip").innerText()) ===
          story.id.stage.labels.skipped,
    );
    await fallback.close();
  }

  for (const locale of ["id", "en"]) {
    const localPage = await open(viewports.phone, { locale });
    const { stage, scenes } = story[locale];
    const { labels, primary, overdue } = stage;
    if (locale === "en") {
      for (const scene of panels.keys()) {
        await goScene(localPage, scene);
        await verify(localPage, "EN phone", scene, true);
      }
    }
    await goScene(localPage, 1);
    check(
      `${locale} the morning check shows two unpaid invoices and their due date`,
      (await localPage.locator(".pt-morning .is-open").count()) === 2 &&
        (await localPage.locator(".pt-clock").innerText()) === stage.morning &&
        (await localPage.locator(".pt-due time").getAttribute("datetime")) ===
          stage.due.iso,
    );
    for (const [index, reminder] of stage.messages.entries()) {
      await goScene(localPage, 2 + index);
      const panel = localPage.locator(panels[2 + index]);
      check(
        `${locale} ${reminder.stage} has the message and one dated sent record`,
        (await panel.locator(".pt-message b").innerText()) ===
          `${primary.code} · ${primary.amount}` &&
          (await panel.locator(".pt-message p").innerText()) ===
            reminder.body &&
          (await panel.locator(".pt-message small").innerText()) ===
            labels.paymentInstructions &&
          (await panel.locator(".pt-log-row").count()) === 1 &&
          (await panel.locator(".pt-log-row time").getAttribute("datetime")) ===
            reminder.date.iso &&
          (await panel.locator(".pt-log-row .is-sent").innerText()) ===
            labels.sent &&
          (await panel.locator(".pt-head .pt-tag").innerText()) ===
            reminder.stage &&
          !(await localPage.locator(".pt-payment").isVisible()),
      );
    }
    await goScene(localPage, 5);
    check(
      `${locale} Lia records payment on the right invoice and future reminders stop`,
      (await localPage.locator(".pt-payment time").getAttribute("datetime")) ===
        stage.paidOn.iso &&
        (await localPage.locator(".pt-confirm b").innerText()) ===
          stage.finance &&
        (await localPage.locator(".pt-paid-row small").innerText()).includes(
          primary.code,
        ) &&
        (await localPage.locator(".pt-paid-row .is-paid").innerText()) ===
          labels.paid &&
        (await localPage.locator(".pt-skip").innerText()) === labels.skipped,
    );
    await goScene(localPage, 6);
    check(
      `${locale} only the still-open invoice is handed to Arif at H+30`,
      (await localPage.locator(".pt-handoff time").getAttribute("datetime")) ===
        stage.handedOffOn.iso &&
        (await localPage.locator(".pt-retained .is-paid").innerText()) ===
          labels.paid &&
        (await localPage.locator(".pt-retained small").innerText()) ===
          primary.code &&
        (await localPage.locator(".pt-handoff li").last().innerText()).includes(
          overdue.code,
        ) &&
        (await localPage.locator(".pt-handoff .is-open").innerText()) ===
          labels.open &&
        (await localPage.locator(".pt-owner b").innerText()).startsWith(
          stage.owner,
        ) &&
        (await localPage.locator(".pt-reminder:visible").count()) === 0,
    );
    if (locale === "en") await capture(localPage, "en-phone-7");
    const html = await (
      await localPage.request.get(`${base}${routes[locale]}`)
    ).text();
    check(
      `${locale} server HTML has nine headings and updated Baca`,
      scenes.every(({ title }) => html.includes(title)) &&
        html.includes(
          locale === "id"
            ? "hari ke-30 setelah jatuh tempo"
            : "30 days after the due date",
        ) &&
        html.includes(
          locale === "id"
            ? "Minta izin pelanggan"
            : "permission to receive WhatsApp messages",
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
