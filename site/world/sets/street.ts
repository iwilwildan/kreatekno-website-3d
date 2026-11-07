// Set A, the shophouse street (K0, K1): the COMPANY facade with its door, sign, awning, roof and billboard,
// the neighbours, the pavement and the road. Ported from prototype/k0-k2/src/scene.js ("EXTERIOR").
import * as THREE from "three";
import { aoPlane, type AoTarget } from "../core/ao";
import { Batch, C, G, mtx, rectPath, rng, roundRect, type Kit } from "../core/kit";
import { DATA } from "../takes/home/data";

const E = DATA.ext;
export const DOOR_H = 2.2;
export const WALL_T = 0.3;

/** The billboard face (inside the frame), in world units: where the hero copy sits. */
export function billboardFace() {
  const w = E.xbR - E.xbL,
    h = E.ybT - E.ybB,
    cx = (E.xbL + E.xbR) / 2,
    ledge = 0.17,
    panelH = h - ledge,
    cy = E.ybB + ledge + panelH / 2,
    z = E.zb - 0.05 + 0.016;
  const hw = (w - 0.2) / 2,
    hh = (panelH - 0.2) / 2;
  return { cx, cy, z, hw, hh };
}

export function buildStreet(kit: Kit, ao: AoTarget[]) {
  const { mat, canvasTex } = kit;
  const ext = new THREE.Group();
  const X = new Batch(ext);
  const dw = E.dw,
    doorH = DOOR_H,
    wallT = WALL_T;

  // facade front (one shape with the openings, so the AO map can follow it)
  {
    const s = new THREE.Shape();
    s.moveTo(E.xfL, 0);
    s.lineTo(E.xfR, 0);
    s.lineTo(E.xfR, E.yP);
    s.lineTo(E.xfL, E.yP);
    s.closePath();
    s.holes.push(
      rectPath(-dw, 0.0, dw, doorH),
      rectPath(E.xwL, E.ywB, E.xwR, E.ywT),
      rectPath(E.xu1L, E.yuB, E.xu1R, E.yuT),
      rectPath(E.xu2L, E.yuB, E.xu2R, E.yuT),
    );
    const m = new THREE.Mesh(new THREE.ShapeGeometry(s, 6), mat(C.facade).clone());
    m.material.shadowSide = THREE.DoubleSide;
    m.receiveShadow = true;
    m.castShadow = true;
    ext.add(m);
    const W = E.xfR - E.xfL,
      H = E.yP,
      R = 14;
    ao.push({
      id: "ext-facade",
      mesh: m,
      shapeUV: [E.xfL, 0, W, H],
      local: [
        [E.xfL, 0],
        [E.xfR, 0],
        [E.xfL, H],
      ],
      res: [Math.round(W * R), Math.round(H * R)],
      maxDist: 1.4,
      strength: 0.85,
      skip: (x, y) =>
        (Math.abs(x) < dw && y < doorH) ||
        (x > E.xwL && x < E.xwR && y > E.ywB && y < E.ywT) ||
        (y > E.yuB && y < E.yuT && ((x > E.xu1L && x < E.xu1R) || (x > E.xu2L && x < E.xu2R))),
    });
    // reveals (jambs) so the openings have depth
    const rev = (x0: number, y0: number, x1: number, y1: number) => {
      const d = wallT,
        mt = mat(C.trim);
      X.add(G.box(0.04, y1 - y0, d), mt, mtx([x0 + 0.02, (y0 + y1) / 2, -d / 2]));
      X.add(G.box(0.04, y1 - y0, d), mt, mtx([x1 - 0.02, (y0 + y1) / 2, -d / 2]));
      X.add(G.box(x1 - x0, 0.04, d), mt, mtx([(x0 + x1) / 2, y1 - 0.02, -d / 2]));
      if (y0 > 0.01) X.add(G.box(x1 - x0, 0.04, d), mt, mtx([(x0 + x1) / 2, y0 + 0.02, -d / 2]));
    };
    rev(-dw, 0, dw, doorH);
    rev(E.xwL, E.ywB, E.xwR, E.ywT);
    rev(E.xu1L, E.yuB, E.xu1R, E.yuT);
    rev(E.xu2L, E.yuB, E.xu2R, E.yuT);
  }
  // band between the floors, cornice and parapet, plinth, side pillars
  {
    const W = E.xfR - E.xfL,
      cx = (E.xfL + E.xfR) / 2;
    X.add(G.rbox(W + 0.14, 1.0, 0.16, 0.05), mat(C.trim), mtx([cx, 3.42, -0.05]));
    X.add(G.rbox(W + 0.2, 0.12, 0.22, 0.05), mat(C.trim), mtx([cx, 2.95, -0.04]));
    X.add(G.rbox(W + 0.24, 0.42, 0.5, 0.07), mat(C.trim), mtx([cx, E.yP - 0.21, E.zc - 0.13]));
    X.add(G.rbox(W + 0.3, 0.1, 0.56, 0.04), mat(C.trim), mtx([cx, E.yP - 0.42, E.zc - 0.1]));
    for (const [x0, x1] of [
      [E.xfL, E.xwL - 0.02],
      [E.xwR + 0.02, -dw - 0.02],
      [dw + 0.02, E.xfR],
    ]) {
      if (x1 - x0 < 0.05) continue;
      X.add(G.rbox(x1 - x0, 0.16, 0.08, 0.025), mat(C.plinth), mtx([(x0 + x1) / 2, 0.08, 0.02]));
    }
    X.add(G.rbox(0.62, 2.88, 0.12, 0.04), mat(C.trim), mtx([E.xfR - 0.31, 1.44, 0.03]));
    X.add(G.rbox(0.66, 0.16, 0.16, 0.03), mat(C.plinth), mtx([E.xfR - 0.31, 0.08, 0.05]));
    X.add(G.rbox(0.62, 2.88, 0.12, 0.04), mat(C.trim), mtx([E.xfL + 0.31, 1.44, 0.03]));
  }
  // shop window (frosted, lit from inside) and the upper windows
  const glowTex = canvasTex(256, 128, (g, w, h) => {
    const r = g.createRadialGradient(w * 0.32, h * 0.38, 4, w * 0.4, h * 0.5, w * 0.7);
    r.addColorStop(0, "#fff3d6");
    r.addColorStop(0.35, "#ffd9a6");
    r.addColorStop(0.75, "#c99b8e");
    r.addColorStop(1, "#8f7a86");
    g.fillStyle = r;
    g.fillRect(0, 0, w, h);
    const bar = g.createLinearGradient(0, h * 0.05, 0, h * 0.2);
    bar.addColorStop(0, "rgba(255,250,235,0)");
    bar.addColorStop(0.5, "rgba(255,250,235,.85)");
    bar.addColorStop(1, "rgba(255,250,235,0)");
    g.fillStyle = bar;
    g.fillRect(w * 0.04, h * 0.05, w * 0.92, h * 0.15);
  });
  const glowMat = new THREE.MeshStandardMaterial({
    color: "#000000",
    roughness: 0.35,
    emissive: "#ffffff",
    emissiveMap: glowTex,
    emissiveIntensity: 1.35,
  });
  const orangeFrame = (
    x0: number,
    y0: number,
    x1: number,
    y1: number,
    t = 0.08,
    z = 0.02,
    d = 0.1,
    mullion = false,
  ) => {
    const o = mat(C.orange, { roughness: 0.55 });
    X.add(G.rbox(x1 - x0 + t, t, d, 0.025), o, mtx([(x0 + x1) / 2, y1, z]));
    X.add(G.rbox(x1 - x0 + t, t, d, 0.025), o, mtx([(x0 + x1) / 2, y0, z]));
    X.add(G.rbox(t, y1 - y0, d, 0.025), o, mtx([x0, (y0 + y1) / 2, z]));
    X.add(G.rbox(t, y1 - y0, d, 0.025), o, mtx([x1, (y0 + y1) / 2, z]));
    if (mullion) X.add(G.rbox(t * 0.8, y1 - y0, d * 0.8, 0.02), o, mtx([(x0 + x1) / 2, (y0 + y1) / 2, z - 0.03]));
  };
  {
    orangeFrame(E.xwL, E.ywB, E.xwR, E.ywT, 0.09);
    const gw = new THREE.Mesh(new THREE.PlaneGeometry(E.xwR - E.xwL, E.ywT - E.ywB), glowMat);
    gw.position.set((E.xwL + E.xwR) / 2, (E.ywB + E.ywT) / 2, -0.12);
    gw.castShadow = true;
    gw.material.shadowSide = THREE.DoubleSide;
    ext.add(gw);
    X.add(G.rbox(E.xwR - E.xwL + 0.3, 0.1, 0.22, 0.04), mat(C.trim), mtx([(E.xwL + E.xwR) / 2, E.ywB - 0.06, 0.06]));
    const up = new THREE.MeshStandardMaterial({
      color: C.glassUp,
      roughness: 0.2,
      metalness: 0.1,
      envMapIntensity: 0.6,
    });
    for (const [x0, x1] of [
      [E.xu1L, E.xu1R],
      [E.xu2L, E.xu2R],
    ]) {
      orangeFrame(x0, E.yuB, x1, E.yuT, 0.08, 0.02, 0.1, true);
      X.add(G.box(x1 - x0, E.yuT - E.yuB, 0.02), up, mtx([(x0 + x1) / 2, (E.yuB + E.yuT) / 2, -0.12]), { occ: false });
      X.add(G.rbox(x1 - x0 + 0.34, 0.1, 0.24, 0.04), mat(C.trim), mtx([(x0 + x1) / 2, E.yuT + 0.1, 0.07]));
      X.add(G.rbox(x1 - x0 + 0.22, 0.07, 0.16, 0.03), mat(C.trim), mtx([(x0 + x1) / 2, E.yuB - 0.06, 0.05]));
    }
  }
  // door: metal frame, two frosted leaves; the right leaf swings inward on its hinge
  const doorGlass = new THREE.MeshStandardMaterial({
    color: "#a39aa6",
    roughness: 0.25,
    metalness: 0.15,
    emissive: "#ffffff",
    emissiveMap: glowTex,
    emissiveIntensity: 0.32,
  });
  const hinge = new THREE.Group();
  hinge.position.set(dw - 0.05, 0, -0.1);
  ext.add(hinge);
  const leafL = new THREE.Group();
  leafL.position.set(-dw + 0.05, 0, -0.1);
  ext.add(leafL);
  const doorLeaf = (parent: THREE.Object3D, sign: number) => {
    const B = new Batch(parent),
      w = dw - 0.07,
      met = mat(C.metal, { roughness: 0.42, metalness: 0.35 });
    const cx = (sign * w) / 2;
    B.add(G.box(w - 0.1, doorH - 0.2, 0.02), doorGlass, mtx([cx, doorH / 2, 0]), { occ: false });
    for (const [dx, dy, ww, hh] of [
      [0, doorH / 2 - 0.08, w, 0.08],
      [0, -doorH / 2 + 0.07, w, 0.12],
      [-w / 2 + 0.04, 0, 0.08, doorH - 0.04],
      [w / 2 - 0.04, 0, 0.08, doorH - 0.04],
    ])
      B.add(G.box(ww, hh, 0.05), met, mtx([cx + dx, doorH / 2 + dy, 0]));
    B.add(
      G.rbox(0.035, 0.42, 0.035, 0.016),
      mat("#d8dbe2", { roughness: 0.25, metalness: 0.8 }),
      mtx([sign * (w - 0.1), 1.08, 0.07]),
    );
    B.build();
  };
  doorLeaf(leafL, 1);
  doorLeaf(hinge, -1);
  {
    const met = mat(C.metal, { roughness: 0.42, metalness: 0.35 });
    X.add(G.box(0.08, doorH, 0.34), met, mtx([-dw - 0.0, doorH / 2, -0.12]));
    X.add(G.box(0.08, doorH, 0.34), met, mtx([dw, doorH / 2, -0.12]));
    X.add(G.box(2 * dw + 0.08, 0.09, 0.34), met, mtx([0, doorH - 0.045, -0.12]));
    X.add(G.box(2 * dw, 0.03, 0.34), met, mtx([0, 0.015, -0.12]));
  }
  // sign: white pill plaque, orange rim, extruded COMPANY letters (Nunito ExtraBold outlines)
  {
    const w = E.xsR - E.xsL,
      h = E.ysT - E.ysB,
      cx = (E.xsL + E.xsR) / 2,
      cy = (E.ysB + E.ysT) / 2;
    const plaque = new THREE.ExtrudeGeometry(roundRect(w, h, h / 2), {
      depth: 0.08,
      bevelEnabled: true,
      bevelThickness: 0.03,
      bevelSize: 0.03,
      bevelSegments: 3,
      curveSegments: 24,
    });
    X.add(plaque, mat(C.plaque, { roughness: 0.6 }), mtx([cx, cy, 0.06]));
    const ring = roundRect(w, h, h / 2);
    ring.holes.push(roundRect(w - 0.12, h - 0.12, (h - 0.12) / 2));
    X.add(
      new THREE.ExtrudeGeometry(ring, {
        depth: 0.02,
        bevelEnabled: true,
        bevelThickness: 0.025,
        bevelSize: 0.02,
        bevelSegments: 3,
        curveSegments: 24,
      }),
      mat(C.orange, { roughness: 0.5 }),
      mtx([cx, cy, 0.15]),
    );
    const sp = new THREE.ShapePath();
    for (const c of DATA.glyphs.cmds as [string, ...number[]][]) {
      if (c[0] === "M") sp.moveTo(c[1], c[2]);
      else if (c[0] === "L") sp.lineTo(c[1], c[2]);
      else if (c[0] === "Q") sp.quadraticCurveTo(c[1], c[2], c[3], c[4]);
      else if (c[0] === "C") sp.bezierCurveTo(c[1], c[2], c[3], c[4], c[5], c[6]);
    }
    const [bx0, by0, bx1, by1] = DATA.glyphs.bbox,
      k = (0.596 * h) / (by1 - by0);
    const letters = new THREE.ExtrudeGeometry(sp.toShapes(), {
      depth: 0.04 / k,
      bevelEnabled: true,
      bevelThickness: 0.03 / k,
      bevelSize: 0.022 / k,
      bevelSegments: 3,
      curveSegments: 8,
    });
    letters.translate(-(bx0 + bx1) / 2, -(by0 + by1) / 2, 0);
    X.add(letters, mat(C.orange, { roughness: 0.5 }), mtx([cx, cy, 0.16], [0, 0, 0], k), { occ: false });
  }
  // awning: ribbed orange canopy; side profile extruded along the street in short segments with a groove between
  {
    const za = E.za,
      r = (E.yaT - E.yaB) / 2,
      cyF = (E.yaT + E.yaB) / 2,
      zF = za - r;
    const prof = new THREE.Shape();
    prof.moveTo(-0.0, E.yaT + 0.16);
    prof.lineTo(-zF, E.yaT);
    prof.absarc(-zF, cyF, r, Math.PI / 2, Math.PI * 1.5, false);
    prof.lineTo(-0.0, E.yaB + 0.04);
    prof.closePath();
    const L = E.xaR - E.xaL,
      n = Math.max(6, Math.round(L / 0.43)),
      segL = L / n;
    const seg = new THREE.ExtrudeGeometry(prof, {
      depth: segL - 0.03,
      bevelEnabled: true,
      bevelThickness: 0.012,
      bevelSize: 0.012,
      bevelSegments: 2,
      curveSegments: 16,
    });
    seg.rotateY(Math.PI / 2);
    const o = mat(C.orange, { roughness: 0.5 });
    for (let i = 0; i < n; i++) X.add(seg, o, mtx([E.xaL + i * segL + 0.015, 0, 0]));
    X.add(
      G.rbox(0.06, E.yaT - E.yaB + 0.1, za + 0.02, 0.025),
      mat(C.orangeDeep, { roughness: 0.5 }),
      mtx([E.xaR - 0.02, cyF, za / 2]),
    );
  }
  // roof, roof box, billboard with its truss
  const roofY = E.yP - 0.36;
  {
    X.add(
      G.box(E.xfR - E.xfL, 0.1, 12),
      mat("#f1dad8", { roughness: 1 }),
      mtx([(E.xfL + E.xfR) / 2, roofY - 0.05, -6.3]),
    );
    X.add(
      G.rbox(E.xrR - E.xrL, E.yrT - roofY, E.drb, 0.06),
      mat(C.trim),
      mtx([(E.xrL + E.xrR) / 2, (E.yrT + roofY) / 2, E.zr - E.drb / 2]),
    );
    X.add(
      G.rbox(E.xrR - E.xrL + 0.12, 0.08, E.drb + 0.12, 0.035),
      mat(C.trim),
      mtx([(E.xrL + E.xrR) / 2, E.yrT - 0.02, E.zr - E.drb / 2]),
    );
    const w = E.xbR - E.xbL,
      h = E.ybT - E.ybB,
      cx = (E.xbL + E.xbR) / 2,
      zb = E.zb,
      fr = mat(C.frame, { roughness: 0.48, metalness: 0.35 });
    const ledge = 0.17,
      panelH = h - ledge;
    const ring = roundRect(w, panelH, 0.09);
    ring.holes.push(roundRect(w - 0.2, panelH - 0.2, 0.05));
    X.add(
      new THREE.ExtrudeGeometry(ring, {
        depth: 0.06,
        bevelEnabled: true,
        bevelThickness: 0.035,
        bevelSize: 0.03,
        bevelSegments: 3,
        curveSegments: 10,
      }),
      fr,
      mtx([cx, E.ybB + ledge + panelH / 2, zb - 0.06]),
    );
    X.add(
      G.box(w - 0.18, panelH - 0.18, 0.03),
      new THREE.MeshStandardMaterial({
        color: "#f2f0fa",
        roughness: 0.7,
        emissive: "#ece8fa",
        emissiveIntensity: 0.38,
      }),
      mtx([cx, E.ybB + ledge + panelH / 2, zb - 0.05]),
    );
    X.add(G.rbox(w + 0.12, ledge, 0.36, 0.06), fr, mtx([cx, E.ybB + ledge / 2, zb]));
    const legs = [0.106, 0.503, 0.887].map((f) => E.xbL + f * w),
      legTop = E.ybB,
      legBot = roofY;
    for (const x of legs) {
      X.add(G.cyl(0.05, 0.06, legTop - legBot, 12), fr, mtx([x, (legTop + legBot) / 2, zb]));
      X.add(G.cyl(0.035, 0.04, legTop - legBot, 10), fr, mtx([x, (legTop + legBot) / 2, zb - 0.55]));
    }
    const beam = (x0: number, y0: number, x1: number, y1: number, z: number, r = 0.025) => {
      const dx = x1 - x0,
        dy = y1 - y0,
        len = Math.hypot(dx, dy);
      X.add(G.cyl(r, r, len, 8), fr, mtx([(x0 + x1) / 2, (y0 + y1) / 2, z], [0, 0, Math.atan2(dx, dy) * -1]));
    };
    const yA = legTop - 0.22,
      yB = legBot + 0.15;
    for (const z of [zb, zb - 0.55]) {
      beam(legs[0], yA, legs[2], yA, z, 0.03);
      for (let i = 0; i < 2; i++) {
        beam(legs[i], yA, legs[i + 1], yB, z);
        beam(legs[i], yB, legs[i + 1], yA, z);
      }
    }
  }
  // neighbour on the left: the yellow end house
  {
    const ny = E.xfL - 0.05,
      yw = 2.7,
      H = 5.9;
    X.add(G.box(yw, H, 6), mat(C.yellow), mtx([ny - yw / 2, H / 2, -3]));
    X.add(G.rbox(yw + 0.1, 0.25, 0.4, 0.05), mat(C.yellowDeep), mtx([ny - yw / 2, H - 0.1, 0.05]));
    X.add(G.rbox(yw + 0.1, 0.2, 0.36, 0.05), mat(C.yellowDeep), mtx([ny - yw / 2, 3.2, 0.05]));
    X.add(G.box(yw - 0.6, 2.6, 0.04), mat("#e3d8c6"), mtx([ny - yw / 2, 1.4, 0.03]));
    for (const x of [ny - 0.75, ny - 1.95])
      X.add(G.box(0.7, 1.15, 0.04), mat("#c9cdd7", { roughness: 0.3 }), mtx([x, 5.0, 0.03]));
    // the fruit shop, the laundry and the rest of the row are in ./row
  }
  // pavement (AO plane), kerb, road with a dashed centre line
  {
    const tiles = canvasTex(512, 512, drawPaveTiles, { repeat: [11, 1.2] });
    aoPlane(
      ao,
      "ext-pave",
      ext,
      30,
      1.7,
      new THREE.MeshStandardMaterial({ map: tiles, roughness: 0.9 }),
      mtx([0, 0, 0.85], [-Math.PI / 2, 0, 0]),
      { res: 0.6, maxDist: 1.4, strength: 0.75 },
    );
    X.add(G.rbox(30, 0.18, 0.3, 0.05), mat(C.curb), mtx([0, -0.07, 1.82]));
    X.add(G.box(60, 0.1, 30), mat(C.road, { roughness: 0.95 }), mtx([0, -0.2, 18.2]), { occ: false });
    const dash = mat("#f6f4f2", { roughness: 0.6 });
    for (let x = -28; x < 30; x += 3.4)
      X.add(G.box(1.8, 0.01, 0.1), dash, mtx([x, -0.145, 3.3]), { occ: false, shadow: false });
    X.add(G.box(60, 0.15, 3), mat(C.pave), mtx([0, -0.075, 13.6]), { occ: false });
  }
  // invisible shadow caster across the street, for the diagonal morning shadow on the facade
  {
    const zo = 20,
      slope = 0.43,
      hx = (x: number) => 8.4 + slope * (x + 11.2);
    const shape = new THREE.Shape();
    // it ends at x 5: the diagonal on COMPANY (K0–K2) is kept whole (checked from x 5 on), and out on the row of
    // shophouses (beat 5, where the sun is higher) it casts nothing
    const xe = 5;
    shape.moveTo(-28, -1);
    shape.lineTo(xe, -1);
    shape.lineTo(xe, hx(xe));
    shape.lineTo(-28, hx(-28));
    shape.closePath();
    const caster = new THREE.Mesh(
      new THREE.ShapeGeometry(shape),
      new THREE.MeshBasicMaterial({ colorWrite: false, depthWrite: false, side: THREE.DoubleSide }),
    );
    caster.position.z = zo;
    caster.castShadow = true;
    caster.material.shadowSide = THREE.DoubleSide;
    ext.add(caster);
  }
  // what shows through the open door while the room behind it is not drawn (beat 5, camera outside): the lit
  // front room in soft shapes (warm wall, the orange counter, a pendant lamp)
  const backdrop = new THREE.Mesh(
    new THREE.PlaneGeometry(2 * dw + 0.2, doorH + 0.1),
    new THREE.MeshBasicMaterial({
      map: canvasTex(256, 256, (g, w, h) => {
        const gr = g.createLinearGradient(0, 0, 0, h);
        gr.addColorStop(0, "#f2e4e6");
        gr.addColorStop(0.62, "#efdcd8");
        gr.addColorStop(0.63, "#e9d3c9");
        gr.addColorStop(1, "#dcc2bb");
        g.fillStyle = gr;
        g.fillRect(0, 0, w, h);
        g.fillStyle = "#ef6b2c";
        g.fillRect(w * 0.3, h * 0.55, w * 0.42, h * 0.14);
        g.fillStyle = "#fbf7f8";
        g.fillRect(w * 0.28, h * 0.53, w * 0.46, h * 0.03);
        g.fillStyle = "#f2742f";
        g.beginPath();
        g.moveTo(w * 0.46, h * 0.12);
        g.lineTo(w * 0.56, h * 0.12);
        g.lineTo(w * 0.6, h * 0.2);
        g.lineTo(w * 0.42, h * 0.2);
        g.fill();
      }),
    }),
  );
  backdrop.position.set(0, (doorH + 0.1) / 2, -1.6);
  backdrop.visible = false;
  ext.add(backdrop);
  X.build();

  return { group: ext, batch: X, hinge, leafL, backdrop };
}

/** The paving tiles (one tile per texture; the pavement repeats it every 30 / 11 m along the street). */
export const PAVE_TILE = { x: 30 / 11, z: 1.7 / 1.2 };
export function drawPaveTiles(g: CanvasRenderingContext2D, w: number, h: number) {
  g.fillStyle = C.pave;
  g.fillRect(0, 0, w, h);
  const r = rng(3);
  for (let i = 0; i < 1400; i++) {
    g.fillStyle = `rgba(120,100,130,${0.025 + r() * 0.03})`;
    g.fillRect(r() * w, r() * h, 2, 2);
  }
  g.strokeStyle = "rgba(120,108,150,.7)";
  g.lineWidth = 5;
  g.strokeRect(0, 0, w, h);
  g.strokeStyle = "rgba(255,255,255,.35)";
  g.lineWidth = 3;
  g.beginPath();
  g.moveTo(4, 6);
  g.lineTo(w - 4, 6);
  g.stroke();
}
