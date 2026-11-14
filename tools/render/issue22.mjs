// Issue #22: record real scrolling through Kreatekno's exit, including the independent Wildan clock.
// BASE=http://localhost:3400 OUT=<scratch directory> BASELINE=1 node render/issue22.mjs
import assert from "node:assert/strict";
import { mkdirSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { launch } from "./lib.mjs";

const BASE = process.env.BASE || "http://localhost:3400";
const OUT = resolve(process.env.OUT || process.env.TEMP, "issue22");
mkdirSync(OUT, { recursive: true });
const browser = await launch({ gpu: true });
const results = [];
try {
  for (const [name, width, height] of [["pc", 1280, 720], ["tablet", 768, 1024], ["hp", 375, 812]]) {
    if (process.env.VIEW && process.env.VIEW !== name) continue;
    const page = await browser.newPage({ viewport: { width, height } });
    const errors = [];
    page.on("pageerror", (e) => errors.push(e.message));
    console.log(`Loading ${name}`);
    await page.goto(`${BASE}/?hud`, { waitUntil: "load" });
    await page.waitForFunction(() => window.__world?.ready(), null, { timeout: 30000 });
    await page.evaluate(() => {
      const api = window.__world, el = document.getElementById("beranda"), stage = el.querySelector("[data-stage]");
      const portrait = matchMedia("(max-aspect-ratio: 1/1)").matches;
      const total = Number(el.style.getPropertyValue(portrait ? "--take-hp" : "--take"));
      const world = Number(el.style.getPropertyValue("--take-hp"));
      const x = api.keyP("K9.1") * world;
      scrollTo({ top: el.offsetTop + ((x - (portrait ? 0 : 1.35)) / total) * (el.offsetHeight - stage.clientHeight), behavior: "instant" });
      api.world.jump(x / world);
    });
    await page.waitForFunction(() => window.__world.world.debug().pair.length === 2, null, { timeout: 30000 });
    console.log(`Ready ${name}`);
    for (const pace of process.env.PACE ? [Number(process.env.PACE)] : process.env.BASELINE ? [2] : [2, 0.6, 4]) {
      for (const reverse of process.env.BASELINE ? [false] : [false, true]) {
        const run = await page.evaluate(async ({ pace, reverse }) => {
          const api = window.__world, w = api.world;
          const el = document.getElementById("beranda"), stage = el.querySelector("[data-stage]");
          const portrait = matchMedia("(max-aspect-ratio: 1/1)").matches;
          const total = Number(el.style.getPropertyValue(portrait ? "--take-hp" : "--take"));
          const world = Number(el.style.getPropertyValue("--take-hp"));
          const k91 = api.keyP("K9.1") * world;
          // The format timelines differ only before this move; use the current K9.1 hash landing as its offset.
          const offset = portrait ? 0 : 1.35;
          const from = reverse ? k91 + 3.15 : k91;
          const to = reverse ? k91 : k91 + 3.15;
          const go = (x) => scrollTo({ top: el.offsetTop + ((x - offset) / total) * (el.offsetHeight - stage.clientHeight), behavior: "instant" });
          go(from); w.jump(from / world);
          await new Promise((r) => setTimeout(r, 800));
          const rows = [], start = performance.now(), duration = Math.abs(to - from) * pace * 1000;
          await new Promise((resolve) => {
            const frame = (now) => {
              const t = now - start, u = Math.min(1, t / duration);
              go(from + (to - from) * u);
              const d = w.debug(), c = d.camera;
              const direction = c.getWorldDirection(c.position.clone());
              const people = [d.heru, d.crew.find((m) => m.name === "dewi"), d.pair.find((m) => m.name === "wildan")].map((m) => {
                const body = m.mesh.position.clone();
                const head = body.clone(); head.y += 1.3;
                const ndc = head.project(c);
                return { name: m.name, pos: body.toArray(), ndc: ndc.toArray(), visible: m.mesh.visible };
              });
              rows.push({ t: t / 1000, x: d.scroll.shown * world, camera: c.position.toArray(), yaw: Math.atan2(-direction.x, -direction.z), door: d.doors.kre, people, clocks: d.clocks, calls: w.stats().calls, triangles: w.stats().triangles });
              if (t < duration + 16000 && (t < duration + 1500 || Math.abs(d.scroll.shown * world - to) > 0.002)) requestAnimationFrame(frame);
              else resolve();
            };
            requestAnimationFrame(frame);
          });
          return { rows, from, to, world };
        }, { pace, reverse });
        const id = `${name}-${pace}-${reverse ? "back" : "forward"}`;
        writeFileSync(join(OUT, `${id}.json`), JSON.stringify(run));
        const rows = run.rows;
        const crossings = (get) => rows.find((r, i) => i && (reverse ? get(rows[i - 1]) >= 0 && get(r) < 0 : get(rows[i - 1]) <= 0 && get(r) > 0));
        const cam = crossings((r) => r.camera[2]);
        const cast = [0, 1, 2].map((i) => crossings((r) => r.people[i].pos[2])?.t);
        let yaw = rows[0].yaw, turn = 0, wrongTurn = 0;
        for (const r of rows.slice(1)) {
          const delta = Math.atan2(Math.sin(r.yaw - yaw), Math.cos(r.yaw - yaw));
          turn += delta; wrongTurn += Math.max(0, reverse ? -delta : delta); yaw = r.yaw;
        }
        const result = { id, crossing: cam && { t: cam.t, pos: cam.camera, door: cam.door }, cast, turn, wrongTurn,
          maxCalls: Math.max(...rows.map((r) => r.calls)), maxTriangles: Math.max(...rows.map((r) => r.triangles)),
          finalError: Math.abs(rows.at(-1).x - run.to), errors };
        results.push(result);
        console.log(JSON.stringify(result));
        await page.screenshot({ path: join(OUT, `${id}.png`) });
        if (!process.env.BASELINE) {
          assert.ok(cam, `${id}: camera crosses the doorway`);
          assert.ok(cam.camera[0] > 46.9 && cam.camera[0] < 47.8, `${id}: through the open right leaf`);
          assert.ok(cam.camera[1] < 2.4, `${id}: below the lintel`);
          assert.ok(Math.abs(cam.door) > 1.35, `${id}: door open at crossing`);
          if (!reverse) assert.ok(cast.every((t) => t !== undefined && t < cam.t), `${id}: camera follows all three`);
          assert.ok(wrongTurn < 0.02, `${id}: only turns right (left when reversing)`);
          assert.ok(result.finalError < 0.005, `${id}: reaches its destination`);
          assert.deepEqual(errors, [], `${id}: no page errors`);
        }
      }
    }
    await page.close();
  }
} finally {
  writeFileSync(join(OUT, "results.json"), JSON.stringify(results, null, 2));
  await browser.close();
}
