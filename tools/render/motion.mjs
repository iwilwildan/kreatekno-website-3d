// Review frames of the moving take (tahap 4), for chat only: canvas shots at scroll positions between two
// keyframes, the whip pan frame by frame, and a foot-slide check of Heru's walk.
// Frames come from scrolling the page (as a visitor would), so the HTML copy and the camera's inertia are real.
// With FPS=1 the page also scrolls K1 → K2.2 in 6 s and reports the frame rate (CPU=4 slows the CPU down 4×).
// Usage: node render/motion.mjs OUT [pc|hp] [from=K1] [to=K2.2] [n=16]
import { join } from "node:path";
import { BASE, launch, open } from "./lib.mjs";

const OUT = process.argv[2],
  fmt = process.argv[3] || "pc",
  from = process.argv[4] || "K1",
  to = process.argv[5] || "K2.2",
  n = Number(process.argv[6] || 16);
if (!OUT) throw new Error("usage: node render/motion.mjs OUT [pc|hp] [from] [to] [n]");
const VP = { pc: { width: 960, height: 540 }, hp: { width: 405, height: 720 } };
const browser = await launch({ gpu: true });
const { page, errors } = await open(browser, `${BASE}/?hud&fmt=${fmt}`, VP[fmt]);
await page.waitForFunction(() => window.__world?.ready() && window.__world.world.stats().cast.done, null, {
  timeout: 300000,
  polling: 500,
});
const shot = async (file) => page.screenshot({ path: join(OUT, file) });
/** Scrolls the page to take position p (0..1) and waits for the camera to settle. */
const go = async (p, wait = 1300) => {
  await page.evaluate((q) => {
    const el = document.getElementById("beranda"),
      stage = el.querySelector("[data-stage]");
    scrollTo(0, el.offsetTop + q * (el.offsetHeight - stage.clientHeight));
  }, p);
  if (wait) await page.waitForTimeout(wait);
};
const [a, b] = await page.evaluate(([f, t]) => [window.__world.keyP(f), window.__world.keyP(t)], [from, to]);

// 1. scroll positions from `from` to `to`
for (let i = 0; i < n; i++) {
  await go(a + ((b - a) * i) / (n - 1));
  await shot(`${fmt}_seq_${String(i).padStart(2, "0")}.png`);
}

// 2. the whip pan: settle just before its point, then scroll past it and take a frame every 60 ms
const w = await page.evaluate(() => {
  const k21 = window.__world.keyP("K2.1"),
    k22 = window.__world.keyP("K2.2");
  return [k21 + (k22 - k21) * 0.15, k21 + (k22 - k21) * 0.5];
});
await go(w[0], 1500);
await go(w[1], 0);
for (let i = 0; i < 10; i++) {
  await page.waitForTimeout(60);
  await shot(`${fmt}_whip_${i}.png`);
}

// 3. Heru's feet: world position of each foot while it is down, over fine steps of the walk, forward and back
const slide = await page.evaluate(() => {
  const W = window.__world,
    d = W.world.debug(),
    k1 = W.keyP("K1"),
    k2 = W.keyP("K2"),
    V = d.camera.position.constructor,
    out = { fwd: 0, back: 0, steps: 0 };
  const run = async (dir) => {
    const prints = { L: null, R: null };
    let worst = 0;
    for (let i = 0; i <= 400; i++) {
      const p = dir > 0 ? k1 + ((k2 - k1) * i) / 400 : k2 - ((k2 - k1) * i) / 400;
      W.world.jump(p);
      await new Promise((r) => requestAnimationFrame(r));
      for (const n of ["L", "R"]) {
        const f = d.heru.rig.bone("foot" + n).getWorldPosition(new V());
        const down = f.y < 0.115;
        if (down && prints[n]) worst = Math.max(worst, Math.hypot(f.x - prints[n].x, f.z - prints[n].z));
        prints[n] = down ? (prints[n] ?? f.clone()) : null;
      }
    }
    return worst;
  };
  return (async () => {
    out.fwd = await run(1);
    out.back = await run(-1);
    return out;
  })();
});
console.log("foot slide while planted (m):", JSON.stringify(slide));

// 4. frame rate while scrolling K1 → K2.2 in 6 s (optionally with a 4× slower CPU), then 3 s still at K2.2
if (process.env.FPS) {
  const cdp = await page.context().newCDPSession(page);
  if (process.env.CPU) await cdp.send("Emulation.setCPUThrottlingRate", { rate: Number(process.env.CPU) });
  await go(a, 1500);
  const fps = await page.evaluate(
    async ([p0, p1]) => {
      const el = document.getElementById("beranda"),
        stage = el.querySelector("[data-stage]"),
        y = (q) => el.offsetTop + q * (el.offsetHeight - stage.clientHeight);
      const gaps = [];
      let last = performance.now(),
        t0 = last;
      return await new Promise((done) => {
        const tick = (ts) => {
          gaps.push(ts - last);
          last = ts;
          const k = (ts - t0) / 6000;
          if (k < 1) scrollTo(0, y(p0 + (p1 - p0) * k));
          if (k < 1.5) requestAnimationFrame(tick);
          else {
            const s = window.__world.world.stats();
            gaps.sort((m, n) => m - n);
            done({
              meanFps: Math.round(1000 / (gaps.reduce((m, n) => m + n, 0) / gaps.length)),
              p95ms: Math.round(gaps[Math.floor(gaps.length * 0.95)]),
              worstMs: Math.round(gaps[gaps.length - 1]),
              calls: s.calls,
              shadowCalls: s.shadow.calls,
              triangles: s.triangles,
            });
          }
        };
        requestAnimationFrame(tick);
      });
    },
    [a, b],
  );
  console.log(`scroll ${from} → ${to}${process.env.CPU ? ` (CPU ${process.env.CPU}×)` : ""}:`, JSON.stringify(fps));
}
console.log("errors:", errors);
await browser.close();
