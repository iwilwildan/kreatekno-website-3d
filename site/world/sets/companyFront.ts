// Set B, the front room of COMPANY (K2): solved in its own frame, then shifted so the K2 camera sits just inside
// the front wall. The 9:16 keyframe needs a narrower room, so the layout is blended between the pc and hp
// solves; the blend is quantised to LAYOUT_STEPS so each step can ship its own baked AO.
// Ported from prototype/k0-k2/src/scene.js ("INTERIOR").
import * as THREE from "three";
import { aoPlane, type AoTarget } from "../core/ao";
import { Batch, C, G, lerp, mtx, rectPath, rng, type Kit, type Vec3 } from "../core/kit";
import { DATA } from "../takes/home/data";
import { DOOR_H, WALL_T } from "./street";

export const LAYOUT_STEPS = 4;
/** Raised floor behind the till counter (height and depth, metres); Bu Dewi stands on it. */
export const CASHIER_FLOOR = { h: 0.25, d: 0.8 };
/** Nearest layout step (0 = pc keyframes … LAYOUT_STEPS = hp keyframes) for a format blend 0..1. */
export const layoutStep = (t: number) => Math.round(t * LAYOUT_STEPS);

export function createCompanyFront(kit: Kit) {
  const { mat, canvasTex } = kit;
  const E = DATA.ext;
  const floorTex = canvasTex(
    1024,
    1024,
    (g, w, h) => {
      g.fillStyle = "#f3e6e6";
      g.fillRect(0, 0, w, h);
      const r = rng(21),
        cols = ["#ec8a42", "#ea7a33", "#a9b0bb", "#93a7c4", "#d9bfa6", "#c6c3cc"];
      for (let i = 0; i < 1100; i++) {
        const s = 1.2 + r() * 3.6;
        g.fillStyle = cols[Math.floor(r() * cols.length)];
        g.globalAlpha = 0.45 + r() * 0.4;
        g.beginPath();
        g.ellipse(r() * w, r() * h, s * 1.4, s * 0.8, r() * 3, 0, 7);
        g.fill();
      }
      g.globalAlpha = 1;
    },
    { repeat: [2.4, 2.4] },
  );
  // morning light that falls in through the shop window (soft additive patches on floor and left wall)
  const patchTex = canvasTex(128, 256, (g, w, h) => {
    const gr = g.createLinearGradient(0, 0, w, 0);
    gr.addColorStop(0, "rgba(255,240,220,0)");
    gr.addColorStop(0.2, "rgba(255,240,220,1)");
    gr.addColorStop(0.8, "rgba(255,240,220,1)");
    gr.addColorStop(1, "rgba(255,240,220,0)");
    g.fillStyle = gr;
    g.fillRect(0, 0, w, h);
    const v = g.createLinearGradient(0, 0, 0, h);
    v.addColorStop(0, "rgba(0,0,0,1)");
    v.addColorStop(0.12, "rgba(0,0,0,0)");
    v.addColorStop(0.88, "rgba(0,0,0,0)");
    v.addColorStop(1, "rgba(0,0,0,1)");
    g.globalCompositeOperation = "destination-out";
    g.fillStyle = v;
    g.fillRect(0, 0, w, h);
  });

  /** Builds the room for layout step `step`; its AO planes are appended to `ao`. */
  return function build(step: number, ao: AoTarget[]) {
    const t = step / LAYOUT_STEPS;
    const P: Record<string, number> = {},
      pc = DATA.int.pc,
      hp = DATA.int.hp;
    for (const k in pc) P[k] = lerp(pc[k], hp[k], t);
    const B0 = P.izB;
    for (const i of [1, 2, 3]) P["lz" + i] = B0 + P["ld" + i];
    P.czF = B0 + P.cd;
    P.s1z = B0 + P.s1d;
    P.s2z = B0 + P.s2d;
    for (const k of ["D1", "D2", "D3", "D4"]) P[k + "z"] = B0 + P[k + "d"];
    const off = [0, 1, 2].map((i) => lerp(DATA.intOffset.pc[i], DATA.intOffset.hp[i], t)) as Vec3;
    const grp = new THREE.Group();
    grp.position.set(...off);
    grp.updateMatrixWorld(true);
    const B = new Batch(grp);
    const dw = E.dw,
      doorH = DOOR_H;
    const zFront = -WALL_T - off[2],
      W = P.ixR - P.ixL,
      D = zFront - P.izB,
      H = P.Hc,
      cxR = (P.ixL + P.ixR) / 2;
    const id = (name: string) => `int-${step}-${name}`;
    const wallM = new THREE.MeshStandardMaterial({ color: C.wall, roughness: 0.92 });
    aoPlane(
      ao,
      id("floor"),
      grp,
      W,
      D,
      new THREE.MeshStandardMaterial({ map: floorTex, roughness: 0.62, metalness: 0 }),
      mtx([cxR, 0, (zFront + P.izB) / 2], [-Math.PI / 2, 0, 0]),
      { res: 0.9, maxDist: 1.1, strength: 0.95 },
    );
    aoPlane(ao, id("back"), grp, W, H, wallM, mtx([cxR, H / 2, P.izB]), { res: 0.75, maxDist: 1.2, shadow: true });
    aoPlane(ao, id("left"), grp, D, H, wallM, mtx([P.ixL, H / 2, (zFront + P.izB) / 2], [0, Math.PI / 2, 0]), {
      res: 0.75,
      maxDist: 1.2,
      shadow: true,
    });
    aoPlane(ao, id("right"), grp, D, H, wallM, mtx([P.ixR, H / 2, (zFront + P.izB) / 2], [0, -Math.PI / 2, 0]), {
      res: 0.75,
      maxDist: 1.2,
      shadow: true,
    });
    aoPlane(
      ao,
      id("ceiling"),
      grp,
      W,
      D,
      new THREE.MeshStandardMaterial({ color: C.ceiling, roughness: 0.95 }),
      mtx([cxR, H, (zFront + P.izB) / 2], [Math.PI / 2, 0, 0]),
      { res: 0.35, maxDist: 1.0, strength: 0.6, shadow: true },
    );
    {
      // front wall seen from inside, with the door and shop-window openings
      const s = new THREE.Shape();
      s.moveTo(P.ixL, 0);
      s.lineTo(P.ixR, 0);
      s.lineTo(P.ixR, H);
      s.lineTo(P.ixL, H);
      s.closePath();
      const dL = -dw - off[0],
        dR = dw - off[0];
      s.holes.push(rectPath(dL, 0, dR, doorH));
      const wL = Math.max(P.ixL + 0.05, E.xwL - off[0]),
        wR = Math.min(P.ixR - 0.05, E.xwR - off[0]);
      if (wR > wL + 0.1) s.holes.push(rectPath(wL, E.ywB, wR, E.ywT));
      const m = new THREE.Mesh(new THREE.ShapeGeometry(s), wallM.clone());
      m.material.side = THREE.DoubleSide;
      m.position.z = zFront;
      m.receiveShadow = true;
      m.castShadow = true;
      grp.add(m);
      for (const [x0, x1] of [
        [P.ixL, dL],
        [dR, P.ixR],
      ])
        B.add(G.box(x1 - x0, 0.1, 0.03), mat(C.base), mtx([(x0 + x1) / 2, 0.05, zFront - 0.015]));
    }
    // baseboards
    B.add(G.box(W, 0.1, 0.03), mat(C.base), mtx([cxR, 0.05, P.izB + 0.015]));
    B.add(G.box(0.03, 0.1, D), mat(C.base), mtx([P.ixL + 0.015, 0.05, (zFront + P.izB) / 2]));
    B.add(G.box(0.03, 0.1, D), mat(C.base), mtx([P.ixR - 0.015, 0.05, (zFront + P.izB) / 2]));
    // back door
    {
      const w = P.dxR - P.dxL,
        x = (P.dxL + P.dxR) / 2;
      B.add(G.rbox(w + 0.14, P.dH + 0.07, 0.05, 0.02), mat("#f1e3dc"), mtx([x, (P.dH + 0.07) / 2, P.izB + 0.025]));
      B.add(
        G.rbox(w - 0.04, P.dH - 0.04, 0.05, 0.015),
        mat(C.door, { roughness: 0.7 }),
        mtx([x, P.dH / 2, P.izB + 0.05]),
      );
      for (const yy of [P.dH * 0.72, P.dH * 0.3])
        B.add(G.rbox(w - 0.3, P.dH * 0.34, 0.02, 0.01), mat("#d39770", { roughness: 0.7 }), mtx([x, yy, P.izB + 0.08]));
      B.add(
        G.sph(0.035, 10, 8),
        mat("#d8c2a0", { roughness: 0.35, metalness: 0.5 }),
        mtx([P.dxR - 0.12, 1.02, P.izB + 0.1]),
      );
    }
    // shelves with stacked stationery, paper rolls
    const shelf = (x0: number, x1: number, top: number, zF: number, depth: number, rows: string[][]) => {
      const wood = mat(C.woodDark, { roughness: 0.72 }),
        w = x1 - x0,
        cx = (x0 + x1) / 2,
        zc = zF - depth / 2,
        th = 0.035;
      B.add(G.box(w, top, 0.02), mat(C.woodPanel, { roughness: 0.8 }), mtx([cx, top / 2, zF - depth + 0.01]));
      for (const x of [x0 + th / 2, x1 - th / 2]) B.add(G.rbox(th, top, depth, 0.01), wood, mtx([x, top / 2, zc]));
      const n = rows.length;
      for (let i = 0; i <= n; i++) {
        const y = i === n ? top - th / 2 : 0.06 + (i * (top - 0.08)) / n;
        B.add(G.rbox(w, th, depth, 0.008), wood, mtx([cx, y, zc]));
      }
      rows.forEach((row, i) => {
        const y0 = 0.06 + (i * (top - 0.08)) / n + th / 2,
          slot = (w - 0.12) / row.length;
        row.forEach((it, k) => {
          const x = x0 + 0.06 + slot * (k + 0.5);
          if (it.startsWith("mug")) {
            B.add(G.cyl(0.055, 0.05, 0.12, 14), mat("#fbfafa", { roughness: 0.35 }), mtx([x, y0 + 0.06, zc + 0.02]));
            return;
          }
          const [col, hgt] = it.split(":");
          const hh = Number(hgt || 0.18);
          B.add(G.box(slot * 0.82, hh, depth * 0.72), mat(col, { roughness: 0.75 }), mtx([x, y0 + hh / 2, zc + 0.02]));
          if (hh > 0.1)
            for (let s = 0; s < 3; s++)
              B.add(
                G.box(slot * 0.84, 0.004, depth * 0.73),
                mat("#ffffff"),
                mtx([x, y0 + hh * (0.25 + s * 0.25), zc + 0.02]),
                {
                  occ: false,
                  shadow: false,
                },
              );
        });
      });
    };
    shelf(P.s1xL, P.s1xR, P.s1H, P.s1z, 0.34, [
      ["#ffffff:0.16", "#9fc6e8:0.2", "#ffffff:0.14"],
      ["#5b8fd6:0.18", "#ef8db0:0.16", "#67bf72:0.2", "#f7f4f2:0.18"],
      ["#f7f3f3:0.17", "#f7f3f3:0.24", "#f2cf46:0.14", "#5b8fd6:0.15"],
      ["#ffffff:0.1"],
    ]);
    shelf(P.s2xL, P.s2xR, P.s2H, P.s2z, 0.32, [
      ["#f4eef4:0.2", "mug", "#cfd8e6:0.24"],
      ["mug", "#c9cbd6:0.12", "#f3a7b6:0.14", "#96c7e9:0.16"],
      ["#8fd09b:0.15", "mug", "#f1a5c0:0.12", "#a6dc8f:0.12"],
      ["#f2f0f4:0.16", "#f4f0f4:0.16", "#f1e4f0:0.24", "#f6d65a:0.24"],
    ]);
    for (let i = 0; i < 4; i++)
      B.add(
        G.cyl(0.07, 0.07, 1.36 + (i % 2) * 0.16, 16),
        mat(C.paper, { roughness: 0.6 }),
        mtx([
          P.s1xL - 0.42 + (i % 2) * 0.17 + Math.floor(i / 2) * 0.08,
          (1.36 + (i % 2) * 0.16) / 2,
          P.izB + 0.22 + Math.floor(i / 2) * 0.1,
        ]),
      );
    // till counter
    {
      const w = P.cxR - P.cxL,
        x = (P.cxL + P.cxR) / 2,
        z = P.czF - 0.3;
      B.add(
        G.rbox(w, P.ch - 0.16, 0.6, 0.03),
        mat(C.counter, { roughness: 0.6 }),
        mtx([x, 0.1 + (P.ch - 0.16) / 2, z]),
      );
      B.add(G.rbox(w + 0.1, 0.07, 0.7, 0.03), mat(C.counterTop, { roughness: 0.45 }), mtx([x, P.ch - 0.035, z]));
      B.add(G.box(w - 0.06, 0.1, 0.54), mat(C.plinthGrey), mtx([x, 0.05, z - 0.01]));
      B.add(G.rbox(0.26, 0.06, 0.2, 0.02), mat(C.black), mtx([P.cxR - 0.32, P.ch + 0.03, z - 0.05]));
      B.add(G.rbox(0.24, 0.17, 0.025, 0.012), mat(C.black), mtx([P.cxR - 0.32, P.ch + 0.17, z - 0.12], [-0.25, 0, 0]));
      // raised cashier floor behind the counter, with a step at its right end: Bu Dewi is 1.60 m, and standing on
      // it her head stays near where the K2 keyframe has it (tahap 3)
      const wood = mat(C.wood, { roughness: 0.62 });
      B.add(
        G.rbox(w + 0.1, CASHIER_FLOOR.h, CASHIER_FLOOR.d, 0.02),
        wood,
        mtx([x, CASHIER_FLOOR.h / 2, z - 0.3 - CASHIER_FLOOR.d / 2]),
      );
      B.add(G.rbox(0.4, 0.12, 0.45, 0.02), wood, mtx([P.cxR + 0.25, 0.06, z - 0.3 - CASHIER_FLOOR.d / 2]));
    }
    // desks, chairs and what sits on them
    const desk = (k: string, items: string) => {
      const g = new THREE.Group();
      g.position.set(P[k + "x"], 0, P[k + "z"]);
      g.rotation.y = P[k + "r"];
      g.updateMatrix();
      const L = (pos: Vec3, rot: Vec3 = [0, 0, 0], s = 1) =>
        new THREE.Matrix4().multiplyMatrices(g.matrix, mtx(pos, rot, s));
      const w = P.dW,
        d = P.dD,
        h = P.dHt,
        wood = mat(C.wood, { roughness: 0.62 });
      B.add(G.rbox(w, 0.045, d, 0.018), wood, L([0, h - 0.0225, 0]));
      B.add(G.rbox(w - 0.1, 0.28, 0.025, 0.01), mat(C.woodPanel, { roughness: 0.7 }), L([0, h - 0.19, d / 2 - 0.05]));
      for (const sx of [-1, 1])
        B.add(
          G.rbox(0.025, 0.22, d - 0.12, 0.01),
          mat(C.woodPanel, { roughness: 0.7 }),
          L([sx * (w / 2 - 0.07), h - 0.16, 0]),
        );
      for (const [sx, sz] of [
        [-1, 1],
        [1, 1],
        [-1, -1],
        [1, -1],
      ])
        B.add(
          G.cyl(0.026, 0.024, h - 0.04, 12),
          mat(C.woodDark, { roughness: 0.6 }),
          L([sx * (w / 2 - 0.07), (h - 0.04) / 2, sz * (d / 2 - 0.07)]),
        );
      const cz = -(d / 2 + 0.36);
      B.add(G.rbox(0.46, 0.07, 0.44, 0.03), mat(C.chair, { roughness: 0.55 }), L([0, 0.47, cz]));
      B.add(G.rbox(0.46, 0.46, 0.06, 0.04), mat(C.chair, { roughness: 0.55 }), L([0, 0.78, cz - 0.22], [0.08, 0, 0]));
      B.add(G.cyl(0.025, 0.025, 0.36, 8), mat(C.black), L([0, 0.26, cz]));
      for (let i = 0; i < 5; i++) {
        const a = (i / 5) * Math.PI * 2;
        B.add(
          G.rbox(0.28, 0.03, 0.04, 0.012),
          mat(C.black),
          L([Math.cos(a) * 0.13, 0.04, cz + Math.sin(a) * 0.13], [0, -a, 0]),
        );
      }
      if (items.includes("monitor")) {
        B.add(G.rbox(0.56, 0.36, 0.04, 0.018), mat(C.black, { roughness: 0.4 }), L([-0.18, h + 0.3, 0.02]));
        B.add(G.rbox(0.07, 0.16, 0.04, 0.01), mat(C.black), L([-0.18, h + 0.1, -0.02]));
        B.add(G.rbox(0.24, 0.015, 0.16, 0.006), mat(C.black), L([-0.18, h + 0.01, -0.02]));
      }
      if (items.includes("stack"))
        for (let i = 0; i < 11; i++)
          B.add(
            G.box(0.27, 0.022, 0.21),
            mat(i % 3 ? C.paper : "#f2eef0"),
            L([0.36 + Math.sin(i * 2.3) * 0.012, h + 0.012 + i * 0.023, 0.04], [0, Math.sin(i * 1.7) * 0.1, 0]),
            { occ: i === 0 },
          );
      if (items.includes("laptop")) {
        const al = mat("#9b9ba6", { roughness: 0.35, metalness: 0.4 });
        B.add(G.rbox(0.42, 0.018, 0.3, 0.008), al, L([0, h + 0.01, 0.0]));
        B.add(G.rbox(0.42, 0.29, 0.014, 0.008), al, L([0, h + 0.15, -0.15], [-0.22, 0, 0]));
      }
      if (items.includes("tray")) {
        B.add(
          G.rbox(0.42, 0.1, 0.3, 0.02),
          mat(C.chair, { roughness: 0.55 }),
          L([-0.12, h + 0.05, -0.02], [0.1, 0, 0]),
        );
        B.add(G.box(0.36, 0.01, 0.26), mat(C.paper), L([-0.12, h + 0.09, -0.02], [0.1, 0, 0]), { occ: false });
        B.add(G.rbox(0.3, 0.018, 0.21, 0.01), mat(C.black, { roughness: 0.3 }), L([0.36, h + 0.01, 0.08], [0, 0.2, 0]));
        B.add(G.box(0.26, 0.004, 0.17), mat("#e9edf4", { roughness: 0.2 }), L([0.36, h + 0.021, 0.08], [0, 0.2, 0]), {
          occ: false,
        });
      }
      if (items.includes("phone"))
        B.add(
          G.rbox(0.08, 0.012, 0.16, 0.006),
          mat(C.black, { roughness: 0.3 }),
          L([0.16, h + 0.006, 0.1], [0, 0.4, 0]),
        );
    };
    desk("D1", "monitor");
    desk("D2", "monitor stack");
    desk("D3", "laptop");
    desk("D4", "tray");
    // pendant lamps (glow + a warm point light each)
    const lampLights: THREE.PointLight[] = [];
    for (const i of [1, 2, 3]) {
      const x = P["lx" + i],
        y = P["ly" + i],
        z = P["lz" + i],
        rr = P.lr,
        sh = 0.3;
      B.add(G.cyl(0.006, 0.006, H - (y + sh), 6), mat("#3b3a40"), mtx([x, (H + y + sh) / 2, z]), { occ: false });
      B.add(G.cyl(0.05, 0.06, 0.03, 12), mat("#3b3a40"), mtx([x, H - 0.015, z]), { occ: false });
      B.add(
        G.cyl(rr * 0.24, rr, sh, 32, true),
        mat(C.orangeDeep, { roughness: 0.55, side: THREE.DoubleSide }),
        mtx([x, y + sh / 2, z]),
        { occ: false },
      );
      B.add(
        new THREE.CircleGeometry(rr * 0.96, 32),
        mat("#fff6e6", { emissive: "#fff1d6", emissiveIntensity: 2.2, roughness: 1 }),
        mtx([x, y + 0.01, z], [Math.PI / 2, 0, 0]),
        { occ: false, shadow: false },
      );
      const pl = new THREE.PointLight("#ffd7a3", 2.0, 6, 1.8);
      pl.position.set(x, y - 0.15, z);
      grp.add(pl);
      lampLights.push(pl);
    }
    const patchMat = new THREE.MeshBasicMaterial({
      map: patchTex,
      transparent: true,
      opacity: 0.15,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      toneMapped: true,
    });
    const patch = (w: number, h: number, m: THREE.Matrix4) => {
      const p = new THREE.Mesh(new THREE.PlaneGeometry(w, h), patchMat);
      p.matrixAutoUpdate = false;
      p.matrix.copy(m);
      p.renderOrder = 1;
      grp.add(p);
    };
    for (const [x, z, a, len, wid] of [
      [P.ixL + 1.6, P.izB + 5.2, 0.62, 4.2, 1.3],
      [P.ixL + 2.9, P.izB + 4.1, 0.62, 4.6, 1.0],
      [cxR + 0.9, P.izB + 5.6, 0.62, 5.2, 0.9],
    ])
      patch(wid, len, mtx([x, 0.004, z], [-Math.PI / 2, 0, a]));
    for (const [z, w] of [
      [P.izB + 5.6, 1.1],
      [P.izB + 4.2, 0.8],
    ])
      patch(w, 2.2, mtx([P.ixL + 0.004, 1.35, z], [0, Math.PI / 2, 0]));
    // yellow mat just inside the door
    B.add(
      G.rbox(1.5, 0.012, 0.85, 0.006),
      mat("#f2c94c", { roughness: 0.95 }),
      mtx([0.1 - off[0], 0.006, zFront - 0.5]),
      {
        occ: false,
      },
    );
    B.build();
    // where the cast stands or sits in this layout (world space; the cast itself lives outside the room):
    // the staff sit toward the front of their chairs facing their desks, Bu Dewi stands on the cashier floor
    const spots: Record<"sinta" | "bayu" | "nadia" | "fajar" | "dewi", { pos: THREE.Vector3; rotY: number }> =
      {} as never;
    const seat = (k: string, back: number, side = 0) => {
      const rr = P[k + "r"],
        dd = -back - P.dD / 2,
        c = Math.cos(rr),
        s = Math.sin(rr);
      return {
        pos: new THREE.Vector3(P[k + "x"] + s * dd + c * side, 0, P[k + "z"] + c * dd - s * side).add(grp.position),
        rotY: rr,
      };
    };
    for (const [name, k] of [
      ["sinta", "D1"],
      ["bayu", "D2"],
      ["nadia", "D3"],
      ["fajar", "D4"],
    ] as const)
      // Sinta sits to the right of her monitor, as in the footage
      spots[name] = seat(k, 0.25, name === "sinta" ? 0.16 : 0);
    spots.dewi = {
      pos: new THREE.Vector3(
        (P.cxL + P.cxR) / 2 + (DATA.figs.dewi.x - (DATA.int.pc.cxL + DATA.int.pc.cxR) / 2),
        CASHIER_FLOOR.h,
        P.czF - 0.6 - CASHIER_FLOOR.d / 2,
      ).add(grp.position),
      rotY: 0,
    };
    return { group: grp, batch: B, lampLights, step, spots };
  };
}
export type CompanyFront = ReturnType<ReturnType<typeof createCompanyFront>>;
