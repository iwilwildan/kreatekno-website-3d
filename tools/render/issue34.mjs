// Issue #34: verify the K9b About plaque and its integrated client-logo area at the four review viewports (one stop
// on the whole plaque on every format since 17 Nov; the phone's copy in three bands across it).
// Screenshots are written only to the OS temp directory. Usage: node render/issue34.mjs
import assert from "node:assert/strict";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { BASE, launch, open, stopMid, waitWorld } from "./lib.mjs";

const cases = [
  { name: "pc", viewport: { width: 1280, height: 720 }, fmt: "pc" },
  {
    name: "tablet",
    viewport: { width: 768, height: 1024 },
    fmt: "hp",
    stops: [0],
  },
  {
    name: "hp-375",
    viewport: { width: 375, height: 812 },
    fmt: "hp",
    stops: [0],
  },
  {
    name: "hp-360",
    viewport: { width: 360, height: 740 },
    fmt: "hp",
    stops: [0],
  },
];

const browser = await launch();
const results = [];
for (const locale of ["id", "en"])
  for (const c of cases) {
    const path = locale === "id" ? "" : "/en";
    const suffix = c.fmt === "pc" ? "&k=K9b" : "";
    const { page, errors } = await open(
      browser,
      `${BASE}${path}?shot&fmt=${c.fmt}${suffix}`,
      c.viewport,
    );
    await waitWorld(page);
    for (const stop of c.stops ?? [null]) {
      if (stop != null)
        await page.evaluate(
          async ([len, at]) => {
            const W = window.__world;
            const take = Number(
              document
                .querySelector(".take")
                .style.getPropertyValue("--take-hp"),
            );
            W.world.jump((W.keyP("K9b") * take - len / 2 + at) / take);
            for (let i = 0; i < 400 && !W.aoDone(); i++)
              await new Promise((r) => requestAnimationFrame(r));
            for (let i = 0; i < 12; i++)
              await new Promise((r) => requestAnimationFrame(r));
          },
          [0.6, stopMid(0.6, 1, stop)],
        );
      await page.waitForFunction(() =>
        [...document.querySelectorAll(".plaque-trusted img")].every(
          (img) => img.complete && img.naturalWidth > 0,
        ),
      );
      const measured = await page.evaluate(() => {
        const stage = document
          .querySelector("[data-stage]")
          .getBoundingClientRect();
        const read = (name) => {
          const el = document.querySelector(`[data-landscape="${name}"]`);
          const r = el.getBoundingClientRect();
          const s = getComputedStyle(el);
          return {
            left: +r.left.toFixed(1),
            top: +r.top.toFixed(1),
            right: +r.right.toFixed(1),
            bottom: +r.bottom.toFixed(1),
            opacity: +s.opacity,
            visible: s.visibility !== "hidden" && +s.opacity > 0.01,
            inside:
              r.left >= stage.left - 1 &&
              r.top >= stage.top - 1 &&
              r.right <= stage.right + 1 &&
              r.bottom <= stage.bottom + 1,
          };
        };
        const logoItems = [...document.querySelectorAll(".plaque-trusted li")];
        const logoImages = [
          ...document.querySelectorAll(".plaque-trusted img"),
        ];
        const logoLabels = [
          ...document.querySelectorAll(".plaque-trusted li > span"),
        ];
        const trustedLabel = document.querySelector(".plaque-trusted-label");
        return {
          panels: {
            about: read("about-0"),
            facts: read("about-1"),
            trusted: read("about-2"),
          },
          factsFont: parseFloat(
            getComputedStyle(document.querySelector(".plaque-facts li"))
              .fontSize,
          ),
          logoCount: logoImages.length,
          loadedLogos: logoImages.filter((img) => img.naturalWidth > 0).length,
          transparentSources: logoImages.filter((img) =>
            img.currentSrc.includes("-transparent.png"),
          ).length,
          logoLabels: logoLabels.map((label) => label.textContent.trim()),
          logosInside: logoImages.every((img) => {
            const image = img.getBoundingClientRect();
            const item = img.closest("li").getBoundingClientRect();
            return (
              image.left >= item.left - 1 &&
              image.top >= item.top - 1 &&
              image.right <= item.right + 1 &&
              image.bottom <= item.bottom + 1
            );
          }),
          tileBackgrounds: logoItems.map(
            (item) => getComputedStyle(item).backgroundColor,
          ),
          trustedLabel: trustedLabel.textContent.trim(),
          trustedAlign: getComputedStyle(trustedLabel).textAlign,
        };
      });
      assert.equal(measured.logoCount, 13);
      assert.equal(measured.loadedLogos, 13);
      assert.equal(measured.transparentSources, 13);
      assert.equal(measured.logoLabels.length, 13);
      assert.ok(measured.logoLabels.every(Boolean));
      assert.ok(
        measured.logosInside,
        `${locale} ${c.name}: no logo is clipped`,
      );
      assert.ok(
        measured.tileBackgrounds.every((color) => color === "rgba(0, 0, 0, 0)"),
        `${locale} ${c.name}: logo tiles stay transparent`,
      );
      // Home copy v4 (28 Nov): the label follows the language (was "Trusted By" in both)
      assert.equal(
        measured.trustedLabel,
        locale === "id" ? "Dipercaya oleh" : "Trusted by",
      );
      assert.equal(measured.trustedAlign, "left");
      // user 17 Nov: one stop on the whole plaque on every format (the phone had three)
      {
        assert.ok(
          measured.panels.about.visible && measured.panels.about.inside,
          `${locale} ${c.name}: About`,
        );
        assert.ok(
          measured.panels.facts.visible && measured.panels.facts.inside,
          `${locale} ${c.name}: facts`,
        );
        assert.ok(
          measured.panels.trusted.visible && measured.panels.trusted.inside,
          `${locale} ${c.name}: logo area`,
        );
        assert.ok(
          measured.panels.trusted.top >= measured.panels.about.bottom - 2,
          `${locale} ${c.name}: integrated area order`,
        );
      }
      assert.ok(
        measured.factsFont <= 13,
        `${locale} ${c.name}: checklist remains compact`,
      );
      // Vercel Analytics is intentionally unavailable in local production previews; every client image is checked
      // separately above, so the generic analytics 404 can be ignored without hiding a missing logo.
      const relevantErrors = errors.filter(
        (error) =>
          error !==
          "console Failed to load resource: the server responded with a status of 404 (Not Found)",
      );
      assert.equal(
        relevantErrors.length,
        0,
        `${locale} ${c.name}: ${relevantErrors.join(" | ")}`,
      );
      const stopName = stop == null ? "all" : `stop-${stop + 1}`;
      const screenshot = join(
        tmpdir(),
        `kreatekno-issue34-${locale}-${c.name}-${stopName}.png`,
      );
      await page.screenshot({ path: screenshot });
      results.push({ locale, case: c.name, stop, screenshot, ...measured });
    }
    await page.close();
  }
await browser.close();
console.log(JSON.stringify(results, null, 2));
