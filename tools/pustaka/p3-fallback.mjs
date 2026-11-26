// Pustaka P3: the CSS desk stays (or comes back) when there is no 3D: a browser without WebGL, and a context lost
// after the world is up (WEBGL_lose_context). Also checks leaving the page before the world has mounted.
// Usage: BASE=http://localhost:3200 node tools/pustaka/p3-fallback.mjs
import { chromium } from "playwright";
import { launch } from "../render/lib.mjs";

const base = process.env.BASE || "http://localhost:3200";
let failed = 0;
const check = (ok, label) => {
  console.log(ok ? "ok  " : "GAGAL", label);
  if (!ok) failed++;
};
const watchErrors = (page) => {
  const errors = [];
  page.on("pageerror", (e) => errors.push(e.message));
  page.on("console", (m) => {
    if (
      m.type() === "error" &&
      !/_vercel|insights|Failed to load resource/.test(m.text())
    )
      errors.push(m.text());
  });
  return errors;
};
const cssDeskShown = (page) =>
  page.evaluate(() => {
    const stage = document.querySelector(".pustaka-stage");
    return (
      !document.querySelector(".pustaka-world-ready") &&
      !!stage &&
      getComputedStyle(stage).opacity === "1" &&
      !document.querySelector(".pustaka-gl")
    );
  });

// 1. no WebGL at all
{
  let browser;
  for (const channel of ["msedge", "chrome", undefined])
    try {
      browser = await chromium.launch({
        channel,
        args: ["--disable-3d-apis", "--disable-webgl"],
      });
      break;
    } catch {
      /* next */
    }
  const page = await browser.newPage({
    viewport: { width: 1440, height: 900 },
  });
  const errors = watchErrors(page);
  await page.goto(`${base}/artikel`, { waitUntil: "networkidle" });
  await page.waitForTimeout(2500);
  check(await cssDeskShown(page), "tanpa WebGL: meja CSS tampil, tanpa kanvas");
  // Tanya without 3D: the result cards of P1, no number tags
  await page.evaluate(() => (location.hash = "tanya"));
  await page.waitForSelector(".kartu-pinjam input");
  await page.locator(".kartu-pinjam input").fill("admin");
  await page.locator(".kartu-submit").click();
  await page.waitForSelector(".tanya-results .result-card");
  const tanya = await page.evaluate(() => ({
    cards: [...document.querySelectorAll(".tanya-results .result-card")].filter(
      (c) => c.offsetParent,
    ).length,
    tags: [...document.querySelectorAll("[data-book-tag]")].filter(
      (t) => t.offsetParent,
    ).length,
  }));
  check(
    tanya.cards > 0 && tanya.tags === 0,
    `tanpa WebGL: Tanya memakai kartu HTML ${JSON.stringify(tanya)}`,
  );
  check(
    errors.length === 0,
    `tanpa WebGL: console bersih ${JSON.stringify(errors)}`,
  );
  await browser.close();
}

const browser = await launch();
// 2. context lost after the world is up
{
  const page = await browser.newPage({
    viewport: { width: 1440, height: 900 },
  });
  const errors = watchErrors(page);
  await page.goto(`${base}/artikel`, { waitUntil: "networkidle" });
  await page.waitForFunction(
    () => document.querySelector(".pustaka-world-ready"),
    null,
    { timeout: 60000 },
  );
  check(true, "dunia 3D siap");
  await page.evaluate(() => {
    const gl =
      document.querySelector(".pustaka-gl").getContext("webgl2") ||
      document.querySelector(".pustaka-gl").getContext("webgl");
    gl.getExtension("WEBGL_lose_context").loseContext();
  });
  await page.waitForTimeout(800);
  check(
    await cssDeskShown(page),
    "konteks hilang: dunia dibuang, meja CSS kembali tanpa reload",
  );
  check(
    !(await page.evaluate(() => "__pustaka" in window)),
    "konteks hilang: __pustaka dihapus",
  );
  check(
    errors.length === 0,
    `konteks hilang: console bersih ${JSON.stringify(errors)}`,
  );
  await page.close();
}
// 3. leave before the world mounts, then come back
{
  const page = await browser.newPage({
    viewport: { width: 1440, height: 900 },
  });
  const errors = watchErrors(page);
  await page.goto(`${base}/artikel`, { waitUntil: "commit" });
  await page.goto(`${base}/solusi`, { waitUntil: "networkidle" });
  await page.waitForTimeout(1000);
  check(
    !(await page.evaluate(() => document.querySelector(".pustaka-gl"))),
    "keluar sebelum mount: tidak ada kanvas tertinggal",
  );
  await page.goBack({ waitUntil: "networkidle" });
  await page.waitForFunction(
    () => document.querySelector(".pustaka-world-ready"),
    null,
    { timeout: 60000 },
  );
  check(
    (await page.evaluate(
      () => document.querySelectorAll(".pustaka-gl").length,
    )) === 1,
    "kembali: satu kanvas",
  );
  check(
    errors.length === 0,
    `navigasi: console bersih ${JSON.stringify(errors)}`,
  );
  await page.close();
}
await browser.close();
console.log(failed ? `${failed} gagal` : "semua lulus");
process.exit(failed ? 1 : 0);
