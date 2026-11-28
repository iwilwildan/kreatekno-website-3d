// Home copy fit: sweeps the whole Home take and reports every copy block placed on a prop whose text spills out of
// its box, and every clamped line (polaroids) that cuts its text. Usage: start the site, then:
// node render/copy-fit.mjs [id,en] [pc,tablet,hp-375,hp-360] [step, default 0.002 of p]
import { BASE, launch, open, waitWorld } from "./lib.mjs";

const LOCALES = (process.argv[2] || "id,en").split(",");
const CASES = {
  pc: { viewport: { width: 1280, height: 720 }, fmt: "pc" },
  tablet: { viewport: { width: 768, height: 1024 }, fmt: "hp" },
  "hp-375": { viewport: { width: 375, height: 812 }, fmt: "hp" },
  "hp-360": { viewport: { width: 360, height: 740 }, fmt: "hp" },
};
const NAMES = (process.argv[3] || Object.keys(CASES).join(",")).split(",");
const STEP = Number(process.argv[4] || 0.002);

const browser = await launch({ gpu: true });
let failures = 0;
for (const locale of LOCALES)
  for (const name of NAMES) {
    const c = CASES[name];
    const path = locale === "id" ? "/" : "/en";
    const { page, errors } = await open(
      browser,
      `${BASE}${path}?hud&fmt=${c.fmt}`,
      c.viewport,
    );
    await waitWorld(page);
    const report = await page.evaluate(async (step) => {
      const W = window.__world;
      const frame = () => new Promise((r) => requestAnimationFrame(r));
      const seen = {};
      const label = (el) =>
        el.dataset.landscape
          ? `${el.dataset.landscape}|${el.dataset.portrait}`
          : el.id || el.className.toString().slice(0, 40);
      for (let p = 0; p <= 1.0001; p += step) {
        W.world.jump(Math.min(p, 1));
        await frame();
        await frame();
        for (const el of document.querySelectorAll("[data-anchor]")) {
          const cs = getComputedStyle(el);
          if (
            cs.visibility === "hidden" ||
            cs.display === "none" ||
            Number(cs.opacity) < 0.9
          )
            continue;
          const r = el.getBoundingClientRect();
          if (r.width < 4 || r.height < 4) continue;
          if (
            r.right < 0 ||
            r.bottom < 0 ||
            r.left > innerWidth ||
            r.top > innerHeight
          )
            continue;
          const key = label(el);
          const s = (seen[key] ??= { visible: 0, spill: 0, clamped: [] });
          s.visible++;
          // text that leaves the box: the box's own scroll size, or any text line past its edges
          let spill = Math.max(
            el.scrollHeight - el.clientHeight,
            el.scrollWidth - el.clientWidth,
            0,
          );
          const range = document.createRange();
          for (const t of el.querySelectorAll(
            "h2, h3, p, li, span, a, button, blockquote",
          )) {
            if (t.offsetParent === null) continue;
            range.selectNodeContents(t);
            for (const lr of range.getClientRects()) {
              if (lr.width === 0) continue;
              spill = Math.max(
                spill,
                lr.bottom - r.bottom,
                r.top - lr.top,
                lr.right - r.right,
                r.left - lr.left,
              );
            }
          }
          s.spill = Math.max(s.spill, Math.round(spill * 10) / 10);
          for (const q of el.querySelectorAll(".polaroid blockquote p")) {
            if (getComputedStyle(q).display === "none") continue;
            if (
              q.scrollHeight > q.clientHeight + 1 &&
              !s.clamped.includes(q.className || "quote")
            )
              s.clamped.push(q.className || "quote");
          }
        }
      }
      return seen;
    }, STEP);
    const bad = Object.entries(report).filter(
      ([, s]) => s.spill > 1 || s.clamped.length,
    );
    console.log(
      `\n${locale} ${name}: ${Object.keys(report).length} blocks seen, ${bad.length} with issues`,
    );
    for (const [k, s] of bad)
      console.log(
        `  ${k}: spill ${s.spill}px${s.clamped.length ? `, clamped ${s.clamped}` : ""}`,
      );
    if (errors.length) console.log("  errors:", errors.slice(0, 3));
    failures += bad.length;
    await page.close();
  }
await browser.close();
console.log(`\n${failures} block(s) with issues`);
