// S0 reference capture. Originals remain untouched; instrumentation exists only in HTTP memory.
// Usage: node tools/solusi/measure.mjs <absolute scratch output directory> [WxH]
//        node tools/solusi/measure.mjs <absolute scratch output directory> [WxH] --site <page url>
// --site measures the site with the same selectors (S5b R0). Only the hero and etalase states are
// captured there for now; Search, cards and contact follow in R5.
import { createServer } from "node:http";
import { mkdirSync, readFileSync, writeFileSync, existsSync } from "node:fs";
import { isAbsolute, join } from "node:path";
import { launch } from "../render/lib.mjs";

const args = process.argv.slice(2);
const siteAt = args.indexOf("--site");
const siteUrl = siteAt >= 0 ? args.splice(siteAt, 2)[1] : "";
if (siteAt >= 0 && !siteUrl) throw new Error("--site needs a page URL");
const out = args[0];
if (!out || !isAbsolute(out))
  throw new Error(
    "Pass an absolute scratch output directory (outside public/git)",
  );
mkdirSync(out, { recursive: true });
export const viewports = [
  [1920, 1080],
  [1440, 900],
  [1280, 800],
  [1180, 820],
  [1024, 1366],
  [820, 1180],
  [768, 1024],
  [414, 896],
  [390, 844],
  [375, 812],
  [360, 740],
];
const selectors = {
  hero: [
    ".toko",
    ".hero-copy",
    ".screen",
    ".screen h1",
    ".screen p",
    ".hero-btns .btn",
    ".counter-h",
    ".frame",
    ".tier",
    ".track",
    ".prod",
    ".pk",
    ".cover",
    ".plank",
    ".band",
    // S5b: the 13 Nov box face
    ".st",
    ".cover .ttl",
    ".cover .sub",
    ".cover .fit",
    ".cover .fit small",
    ".cover .chips > span",
    ".apps",
    ".apps i",
    ".arr",
  ],
  cari: [
    ".exit",
    ".paper",
    ".rc-h",
    "#q",
    ".flt select",
    ".paper button[type=submit]",
  ],
  served: [".pbar", ".tags a", ".sum"],
  sheet: [".deckwrap", ".sheet", ".sheet h2", ".ind"],
  cards: [
    ".deckwrap",
    ".deck",
    '.pc[data-depth="0"]',
    '.pc[data-depth="0"] h2',
    ".cue",
    ".prog",
  ],
  contact: [".modal-card", "#ct-h", ".ct", ".modal-x"],
  hasil: [".res", ".res h1", ".res .empty"],
};
const hook = `
window.__measureSolusi = {
  snapshot() {
    scene.updateMatrixWorld(true);
    const r = toko.getBoundingClientRect();
    const point = v => { v.project(cam); return {x:r.left+(v.x+1)*r.width/2,y:r.top+(1-v.y)*r.height/2}; };
    const bounds = new THREE.Box3().setFromObject(headG);
    return { camera: {pos:cam.position.toArray(),look:camState.look.toArray(),fov:cam.fov},
      headTop:point(new THREE.Vector3(kasirRoot.position.x,bounds.max.y,kasirRoot.position.z)),
      shoulders:[-.43,.43].map(x=>point(hips.localToWorld(new THREE.Vector3(x,1.04,0)))),
      lip:point(new THREE.Vector3(kasirRoot.position.x,.88,1.9)),
      tags:[...tagsEl.children].map(a=>{const b=a.getBoundingClientRect();return {x:b.x+b.width/2,y:b.y+b.height/2};}) };
  }
};`;
// Site selectors that differ from the prototype. The etalase keeps the v1 class names (scoped under
// .etalase in toko.css), so only the blocks outside it need a mapping.
const SITE_SELECTORS = { ".band": ".solusi-band" };
const toSite = (s) => SITE_SELECTORS[s] || s;

const original = readFileSync(
  new URL("../../prototype/solusi-etalase-v1.html", import.meta.url),
  "utf8",
);
const html = original.replace(
  "onRoute();\n\n</script>",
  "onRoute();\n" + hook + "\n</script>",
);
if (html === original) throw new Error("Instrumentation marker changed");
const server = createServer((req, res) => {
  res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
  res.end(html);
});
if (!siteUrl) await new Promise((r) => server.listen(0, "127.0.0.1", r));
const browser = await launch();
const reportFile = join(out, "measurements.json");
const only = args[1];
const report =
  only && existsSync(reportFile)
    ? JSON.parse(readFileSync(reportFile, "utf8"))
    : {
        source: siteUrl || "prototype/solusi-etalase-v1.html",
        browser: browser.version(),
        reducedMotion: true,
        views: [],
      };
try {
  for (const [width, height] of viewports) {
    if (only && only !== `${width}x${height}`) continue;
    const page = await browser.newPage({
      viewport: { width, height },
      deviceScaleFactor: 1,
      hasTouch: width < 1200,
      reducedMotion: "reduce",
    });
    const errors = [];
    page.on("pageerror", (e) => errors.push(e.message));
    await page.addInitScript(() => {
      Math.random = () => 0;
    });
    await page.goto(siteUrl || `http://127.0.0.1:${server.address().port}`, {
      waitUntil: "networkidle",
      timeout: 120000,
    });
    if (!siteUrl)
      await page.waitForFunction(
        () => !!window.__measureSolusi,
        {},
        { timeout: 45000 },
      );
    const fonts = await page.evaluate(async () => {
      await document.fonts.ready;
      await Promise.all(
        [
          '400 19.2px "Plus Jakarta Sans"',
          '700 65.6px "Bricolage Grotesque"',
          '500 12px "JetBrains Mono"',
        ].map((font) => document.fonts.load(font)),
      );
      await document.fonts.ready;
      return [...document.fonts].map((f) => ({
        family: f.family,
        weight: f.weight,
        status: f.status,
      }));
    });
    const data = { width, height, errors, fonts, states: {} };
    async function capture(name, group, screenshot = true) {
      await page.waitForTimeout(160);
      await page.evaluate(
        () =>
          new Promise((resolve) =>
            requestAnimationFrame(() => requestAnimationFrame(resolve)),
          ),
      );
      const list = selectors[group].map((s) => [s, siteUrl ? toSite(s) : s]);
      data.states[name] = await page.evaluate((list) => {
        const elements = Object.fromEntries(
          list.map(([s, query]) => [
            s,
            [...document.querySelectorAll(query)].map((el) => {
              const b = el.getBoundingClientRect(),
                c = getComputedStyle(el);
              return {
                x: b.x,
                y: b.y + scrollY,
                width: b.width,
                height: b.height,
                fontSize: parseFloat(c.fontSize),
                lineHeight: c.lineHeight,
                weight: c.fontWeight,
                display: c.display,
              };
            }),
          ]),
        );
        return {
          elements,
          world: window.__measureSolusi
            ? window.__measureSolusi.snapshot()
            : null,
        };
      }, list);
      if (screenshot)
        await page.screenshot({
          path: join(out, `${width}x${height}-${name}.png`),
        });
    }
    await capture("hero", "hero");
    await page.locator(".frame").scrollIntoViewIfNeeded();
    await capture("etalase", "hero");
    if (siteUrl) {
      report.views = report.views.filter(
        (v) => v.width !== width || v.height !== height,
      );
      report.views.push(data);
      writeFileSync(reportFile, JSON.stringify(report, null, 2));
      console.log(
        `${width}x${height}: captured hero and etalase; errors=${errors.length}`,
      );
      await page.close();
      continue;
    }
    await page.evaluate(() => (location.hash = "cari"));
    await capture("cari", "cari");
    for (const [i, term] of [
      "stok",
      "dokumen",
      "pemilik",
      "jadwal",
      "pelanggan",
      "",
    ].entries()) {
      if (i) await page.locator("#pb-again").click();
      await page.locator("#q").fill(term);
      await page.locator("#paper").evaluate((el) => el.requestSubmit());
      await page.waitForFunction((n) => {
        const tags = [...document.querySelectorAll(".tags a.on")];
        return (
          tags.length === n &&
          tags.every((a) => a.getBoundingClientRect().width === 30)
        );
      }, i + 1);
      await capture(`hasil-${i + 1}`, "served", i === 5);
    }
    await page.locator("#pb-help").click();
    await capture("contact", "contact");
    await page.keyboard.press("Escape");
    await page.evaluate(() => (location.hash = "kartu"));
    await page.locator(".sheet").waitFor();
    await capture("sheet", "sheet");
    await page.locator('.ind[data-ind="retail"]').click();
    await page.locator('.pc[data-depth="0"]').waitFor();
    await capture("cards", "cards");
    await page.keyboard.press("ArrowUp");
    await page.locator(".res").waitFor();
    await capture("hasil", "hasil");
    report.views = report.views.filter(
      (v) => v.width !== width || v.height !== height,
    );
    report.views.push(data);
    writeFileSync(reportFile, JSON.stringify(report, null, 2));
    console.log(
      `${width}x${height}: captured ${Object.keys(data.states).length} states; errors=${errors.length}`,
    );
    await page.close();
  }
} finally {
  await browser.close();
  if (server.listening) await new Promise((r) => server.close(r));
}
