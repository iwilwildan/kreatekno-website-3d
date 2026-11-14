// One two-storey shophouse of the row (Master 7 and the team's videos K5a.1–K5a.6): pillars, the first-floor band,
// the white panel upstairs (the customer journey's copy sits on it as HTML, tahap 6 langkah 4), and the open shop
// front with white folding doors pushed aside and the shop's goods inside. Shared by the main bundle (the fruit
// shop and the laundry are seen from K0/K1 on) and the row chunk (./row, the other six).
// Per shop: the front wall (its own material for its baked AO map), trim, body colour, white parts, and one
// vertex-coloured mesh for the inside and the goods: ±6 draw calls, culled per shop.
import * as THREE from "three";
import { mergeGeometries } from "three/addons/utils/BufferGeometryUtils.js";
import { aoPlane, type AoTarget } from "../core/ao";
import { Batch, clean, G, mtx, rng, type Kit, type Vec3 } from "../core/kit";
import { ROW, shopX, type Shop } from "./rowLayout";

type Part = [THREE.BufferGeometry, string, THREE.Matrix4];

/** Small coloured parts merged into one geometry with a vertex colour each (one draw call). */
export class Tint {
  private parts: THREE.BufferGeometry[] = [];
  private c = new THREE.Color();
  add(g: THREE.BufferGeometry, hex: string, m: THREE.Matrix4) {
    const n = clean(g).applyMatrix4(m),
      k = n.attributes.position.count,
      a = new Float32Array(k * 3);
    this.c.set(hex);
    for (let i = 0; i < k; i++) a.set([this.c.r, this.c.g, this.c.b], i * 3);
    n.setAttribute("color", new THREE.Float32BufferAttribute(a, 3));
    this.parts.push(n);
    return this;
  }
  addAll(parts: Part[]) {
    for (const [g, h, m] of parts) this.add(g, h, m);
  }
  get empty() {
    return this.parts.length === 0;
  }
  mesh(material: THREE.Material) {
    const m = new THREE.Mesh(mergeGeometries(this.parts), material);
    m.castShadow = true;
    m.receiveShadow = true;
    m.matrixAutoUpdate = false;
    this.parts = [];
    return m;
  }
}

/** The shared materials of the row (built once per world). */
export function rowMaterials() {
  return {
    tint: new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 0.75 }),
    // the shop insides are lit from the street and by their own strip lights
    inside: new THREE.MeshStandardMaterial({
      vertexColors: true,
      roughness: 0.8,
    }),
  };
}
export type RowMaterials = ReturnType<typeof rowMaterials>;

const lighten = (hex: string, k: number) =>
  "#" + new THREE.Color(hex).lerp(new THREE.Color("#ffffff"), k).getHexString();
const darken = (hex: string, k: number) =>
  "#" + new THREE.Color(hex).lerp(new THREE.Color("#2a2433"), k).getHexString();

/** The depth of the shop space behind the opening (m). */
export const SHOP_DEEP = 1.9;

/**
 * Builds shop i into a new group: facade, opening, inside and goods. Its AO planes (front wall, inside floor) are
 * appended to `ao`; its occluders (for the AO tracer) to `occ`.
 */
export function buildShop(kit: Kit, M: RowMaterials, s: Shop, i: number, ao: AoTarget[], occ: THREE.BufferGeometry[]) {
  const { mat } = kit;
  const { x0, x1, cx } = shopX(i),
    W = ROW.w,
    H = ROW.h,
    ow = ROW.opening.w,
    oh = ROW.opening.h,
    P = ROW.panel,
    deep = SHOP_DEEP;
  const g = new THREE.Group();
  g.name = `shop-${s.id}`;
  const B = new Batch(g),
    T = new Tint(),
    I = new Tint(),
    trim = mat(s.trim, { roughness: 0.7 }),
    body = mat(s.body);

  // front wall: one shape with the opening, its own material for the baked AO map
  {
    const shape = new THREE.Shape();
    shape.moveTo(x0, 0);
    shape.lineTo(x1, 0);
    shape.lineTo(x1, H);
    shape.lineTo(x0, H);
    shape.closePath();
    const ox0 = cx - ow / 2,
      ox1 = cx + ow / 2;
    const hole = new THREE.Path();
    hole.moveTo(ox0, 0);
    hole.lineTo(ox0, oh);
    hole.lineTo(ox1, oh);
    hole.lineTo(ox1, 0);
    hole.closePath();
    shape.holes.push(hole);
    const wall = new THREE.Mesh(new THREE.ShapeGeometry(shape, 2), body.clone());
    wall.position.z = -0.02;
    wall.receiveShadow = true;
    wall.castShadow = true;
    wall.matrixAutoUpdate = false;
    wall.updateMatrix();
    g.add(wall);
    occ.push(clean(wall.geometry).applyMatrix4(wall.matrix));
    ao.push({
      id: `row-${s.id}-wall`,
      mesh: wall as THREE.Mesh<THREE.BufferGeometry, THREE.MeshStandardMaterial>,
      shapeUV: [x0, 0, W, H],
      local: [
        [x0, 0],
        [x1, 0],
        [x0, H],
      ],
      res: [Math.round(W * 10), Math.round(H * 10)],
      maxDist: 1.0,
      strength: 0.8,
      skip: (x, y) => x > ox0 && x < ox1 && y < oh,
    });
    // reveals of the opening, the body behind
    B.add(G.box(0.04, oh, deep), body, mtx([ox0 - 0.02, oh / 2, -deep / 2 - 0.02]));
    B.add(G.box(0.04, oh, deep), body, mtx([ox1 + 0.02, oh / 2, -deep / 2 - 0.02]));
    B.add(G.box(W, H, ROW.depth - deep), body, mtx([cx, H / 2, -deep - (ROW.depth - deep) / 2 - 0.02]), {
      occ: false,
    });
  }
  // the roof (tahap 8: the camera rises over the row): a grey deck over the whole depth inside a parapet in the trim
  T.add(G.box(W, 0.06, ROW.depth), ROOF_DECK, mtx([cx, H + 0.03, -ROW.depth / 2]));
  roofRims(B, trim, x0, x1, H);
  // pillars with bases and capitals, cornice and parapet, the first-floor band, the hood over the opening
  for (const x of [x0 + ROW.pillar / 2, x1 - ROW.pillar / 2]) {
    B.add(G.rbox(ROW.pillar, H - 0.7, 0.22, 0.07), trim, mtx([x, (H - 0.7) / 2, 0.08]));
    B.add(G.rbox(ROW.pillar + 0.1, 0.55, 0.3, 0.08), trim, mtx([x, 0.275, 0.1]));
    B.add(G.rbox(ROW.pillar + 0.1, 0.22, 0.3, 0.06), trim, mtx([x, ROW.band[0] - 0.11, 0.1]));
  }
  B.add(G.rbox(W + 0.04, 0.42, 0.4, 0.09), trim, mtx([cx, H - 0.21, 0.13]));
  B.add(G.rbox(W + 0.1, 0.12, 0.46, 0.04), trim, mtx([cx, H - 0.48, 0.15]));
  B.add(G.rbox(W, ROW.band[1] - ROW.band[0], 0.32, 0.08), trim, mtx([cx, (ROW.band[0] + ROW.band[1]) / 2, 0.12]));
  B.add(G.rbox(ow + 0.36, 0.36, 0.3, 0.07), trim, mtx([cx, oh + 0.2, 0.1]));
  B.add(G.rbox(ow + 0.2, 0.08, 0.2, 0.03), trim, mtx([cx, oh + 0.42, 0.08]));
  // the panel: a raised frame in the trim colour and the white face (its front at P.z)
  B.add(G.rbox(P.w + 0.34, P.h + 0.34, 0.14, 0.06), trim, mtx([cx, P.y, P.z - 0.08]));
  T.add(G.box(P.w, P.h, 0.04), "#fdfcfa", mtx([cx, P.y, P.z - 0.02]));
  B.add(G.rbox(P.w + 0.5, 0.1, 0.24, 0.04), trim, mtx([cx, P.y - P.h / 2 - 0.22, P.z - 0.02]));

  // white folding doors, folded back against both sides of the opening (zig-zag leaves with a dark gap)
  for (const sgn of [-1, 1]) {
    const edge = cx + (sgn * ow) / 2;
    for (let k = 0; k < 3; k++) {
      const a = (k % 2 ? -1 : 1) * 0.35,
        x = edge - sgn * (0.07 + k * 0.1);
      T.add(G.box(0.05, oh - 0.12, 0.42), "#f4f3f1", mtx([x, (oh - 0.12) / 2 + 0.04, 0.05 - 0.12], [0, a, 0]));
    }
    T.add(G.box(0.03, oh - 0.2, 0.36), "#5c6170", mtx([edge - sgn * 0.33, oh / 2, -0.05]));
  }

  // inside: tiled floor (AO plane), back wall in a pale tint of the shop's colour, ceiling with a strip light
  {
    const floor = aoPlane(
      ao,
      `row-${s.id}-floor`,
      g,
      ow,
      deep,
      mat("#ddd8d4", { roughness: 0.9 }),
      mtx([cx, 0.005, -deep / 2 - 0.02], [-Math.PI / 2, 0, 0]),
      { res: 0.9, maxDist: 0.8, strength: 0.85 },
    );
    occ.push(clean(floor.geometry).applyMatrix4(floor.matrix));
    I.add(G.box(ow, oh, 0.04), lighten(s.body, 0.3), mtx([cx, oh / 2, -deep - 0.02]));
    I.add(G.box(ow, 0.04, deep), lighten(s.body, 0.15), mtx([cx, oh - 0.02, -deep / 2 - 0.02]));
    I.add(G.box(ow * 0.7, 0.03, 0.12), "#fffdf5", mtx([cx, oh - 0.05, -deep / 2]));
  }
  goods(s.id, I, cx, ow, oh, deep, i);
  B.build();
  occ.push(...B.occ);
  // the panel, the folding doors and the goods inside take shadows but cast none: in the shadow pass along the row
  // they cost draw calls and triangles for shadows no one sees (inside the shops' openings)
  const tint = T.mesh(M.tint),
    inside = I.mesh(M.inside);
  tint.castShadow = inside.castShadow = false;
  g.add(tint, inside);
  return g;
}

/** Roof deck colour (video 12.5 s: a light warm grey). */
export const ROOF_DECK = "#b4b0b4";
/** A parapet round a flat roof from x0 to x1 at height h, over the row's depth (its front over the cornice). */
export function roofRims(B: Batch, m: THREE.Material, x0: number, x1: number, h: number) {
  const W = x1 - x0,
    cx = (x0 + x1) / 2,
    D = ROW.depth,
    rh = 0.3,
    t = 0.18;
  B.add(G.rbox(W, rh, t, 0.04), m, mtx([cx, h + rh / 2, 0.08]));
  B.add(G.rbox(W, rh, t, 0.04), m, mtx([cx, h + rh / 2, -D + t / 2]));
  for (const x of [x0 + t / 2, x1 - t / 2]) B.add(G.rbox(t, rh, D, 0.04), m, mtx([x, h + rh / 2, -D / 2]));
}

/** The goods of each shop (videos K5a.1–K5a.5), in the shop's own space: x across the opening, z into it. */
function goods(id: Shop["id"], I: Tint, cx: number, ow: number, oh: number, deep: number, seed: number) {
  const r = rng(101 + seed);
  const z = (d: number) => -0.02 - d; // depth into the shop from the facade
  const pick = <T>(a: T[]) => a[Math.floor(r() * a.length)];
  const wood = "#d9a467",
    woodDark = "#b98048";
  const shelf = (x: number, w: number, h: number, d: number, rows: number, color: string, back = true) => {
    // uprights, boards and a back panel
    for (const sx of [x - w / 2, x + w / 2]) I.add(G.box(0.04, h, d), color, mtx([sx, h / 2, z(deep - d / 2 - 0.02)]));
    for (let k = 0; k <= rows; k++)
      I.add(G.box(w, 0.03, d), color, mtx([x, 0.08 + (k * (h - 0.12)) / rows, z(deep - d / 2 - 0.02)]));
    if (back) I.add(G.box(w, h, 0.02), darken(color, 0.12), mtx([x, h / 2, z(deep - 0.03)]));
    return (k: number) => 0.08 + (k * (h - 0.12)) / rows + 0.015;
  };
  switch (id) {
    case "buah": {
      // wooden crates in three steps rising to the back, heaped with fruit; bananas on the top step
      const fruit = ["#f2a33a", "#e94d3d", "#f28a2e", "#7cc35a", "#f4d24a", "#d93a2f"];
      const ball = new THREE.IcosahedronGeometry(1, 0);
      const crate = (x: number, y: number, d: number, w: number, kind: string) => {
        I.add(G.box(w, 0.4, 0.5), wood, mtx([x, y + 0.2, z(d)]));
        for (let k = 0; k < 3; k++)
          I.add(G.box(w + 0.01, 0.07, 0.02), k % 2 ? woodDark : wood, mtx([x, y + 0.08 + k * 0.12, z(d - 0.255)]));
        if (kind === "banana") {
          for (let k = 0; k < 4; k++)
            I.add(
              new THREE.CapsuleGeometry(0.035, 0.2, 2, 6),
              "#f4d24a",
              mtx([x - w / 2 + 0.13 + k * ((w - 0.26) / 3), y + 0.45, z(d)], [0.3, 0, Math.PI / 2 - 0.4]),
            );
          return;
        }
        for (let k = 0; k < 8; k++)
          I.add(
            ball,
            r() < 0.85 ? kind : pick(fruit),
            mtx(
              [
                x - w / 2 + 0.1 + (k % 4) * ((w - 0.2) / 3),
                y + 0.44 + 0.02 * r(),
                z(d - 0.12 + 0.24 * Math.floor(k / 4)),
              ],
              [r(), r(), 0],
              0.085,
            ),
          );
      };
      const n = 5,
        w = (ow - 0.5) / n;
      for (let c = 0; c < n; c++) {
        const x = cx - ow / 2 + 0.25 + w * (c + 0.5);
        crate(x, 0, 0.5, w - 0.05, pick(fruit));
        crate(x, 0.45, 1.0, w - 0.05, pick(fruit));
        crate(x, 0.9, 1.5, w - 0.05, c >= 3 ? "banana" : pick(fruit));
      }
      break;
    }
    case "laundry": {
      // shelves of folded clothes on the left, a hanging rail in the middle, a washing machine on the right
      const level = shelf(cx - 1.55, 1.7, 2.4, 0.5, 4, "#f2ece2");
      const cloth = ["#7fb7d8", "#f0a8b8", "#f2d27a", "#a7d8b8", "#c9b2e2", "#ffffff"];
      for (let k = 0; k < 4; k++)
        for (let c = 0; c < 4; c++)
          I.add(
            G.box(0.34, 0.2 + 0.1 * r(), 0.36),
            pick(cloth),
            mtx([cx - 2.2 + c * 0.42, level(k) + 0.13, z(deep - 0.28)]),
          );
      I.add(G.cyl(0.02, 0.02, 1.5, 6), "#b9bcc4", mtx([cx + 0.15, 2.1, z(deep - 0.45)], [0, 0, Math.PI / 2]));
      for (const sx of [cx - 0.6, cx + 0.9])
        I.add(G.cyl(0.02, 0.02, 2.1, 6), "#b9bcc4", mtx([sx, 1.05, z(deep - 0.45)]));
      for (let k = 0; k < 8; k++)
        I.add(
          G.box(0.05, 1.0, 0.42),
          pick(["#3f6fb5", "#d64d4d", "#e8e2d6", "#4a8a6a", "#2f2f3a", "#f2d27a"]),
          mtx([cx - 0.45 + k * 0.18, 1.55, z(deep - 0.45)], [0, 0.25 * (r() - 0.5), 0]),
        );
      const wx = cx + 1.75;
      I.add(G.rbox(0.7, 0.95, 0.66, 0.05), "#f4f5f7", mtx([wx, 0.475, z(0.95)]));
      I.add(G.cyl(0.23, 0.23, 0.03, 20), "#9aa3b2", mtx([wx, 0.47, z(0.62)], [Math.PI / 2, 0, 0]));
      I.add(G.cyl(0.17, 0.17, 0.035, 20), "#5b6576", mtx([wx, 0.47, z(0.62)], [Math.PI / 2, 0, 0]));
      I.add(G.box(0.56, 0.09, 0.02), "#cfd4dc", mtx([wx, 0.86, z(0.62)]));
      break;
    }
    case "sepatu": {
      // a wall of white cubby shelves with pairs of shoes
      const cols = 6,
        rows = 5,
        w = ow - 0.5,
        h = 2.3;
      const level = shelf(cx, w, h, 0.4, rows, "#f4f1ec");
      for (let c = 1; c < cols; c++)
        I.add(G.box(0.03, h - 0.1, 0.4), "#f4f1ec", mtx([cx - w / 2 + (c * w) / cols, h / 2, z(deep - 0.22)]));
      const shoe = ["#3b3b46", "#8a4b2f", "#f2f2f2", "#d64d4d", "#3f6fb5", "#e0a33c", "#6b8f5e"];
      for (let k = 0; k < rows; k++)
        for (let c = 0; c < cols; c++) {
          const col = pick(shoe),
            x = cx - w / 2 + (c + 0.5) * (w / cols);
          for (const dx of [-0.07, 0.07])
            I.add(G.rbox(0.1, 0.09, 0.26, 0.04), col, mtx([x + dx, level(k) + 0.045, z(deep - 0.22)]));
        }
      break;
    }
    case "warteg": {
      // the steel display case of dishes on the left (glass top and sides, open to the eye), a bench on the right
      const x = cx - 0.95,
        d = 0.9;
      I.add(G.rbox(1.7, 0.75, 0.62, 0.03), "#c9ccd3", mtx([x, 0.375, z(d)]));
      I.add(G.box(1.7, 0.03, 0.62), "#dde9ee", mtx([x, 1.36, z(d)]));
      for (const sx of [-0.84, 0.84]) I.add(G.box(0.03, 0.6, 0.6), "#d6e6ec", mtx([x + sx, 1.06, z(d)]));
      I.add(G.box(1.66, 0.02, 0.56), "#b9bcc4", mtx([x, 1.05, z(d)]));
      const dish = ["#e8a33d", "#c9542c", "#7aa64a", "#f2d27a", "#9a5b33"];
      for (const y of [0.77, 1.07])
        for (let k = 0; k < 3; k++) {
          I.add(G.cyl(0.2, 0.18, 0.04, 16), "#f4f4f4", mtx([x - 0.52 + k * 0.52, y, z(d)]));
          I.add(G.sph(0.15, 10, 6), pick(dish), mtx([x - 0.52 + k * 0.52, y + 0.03, z(d)], [0, 0, 0], [1, 0.35, 0.8]));
        }
      const bx = cx + 1.25;
      I.add(G.box(1.5, 0.06, 0.38), wood, mtx([bx, 0.45, z(1.3)]));
      for (const dx of [-0.65, 0.65]) I.add(G.box(0.06, 0.45, 0.32), woodDark, mtx([bx + dx, 0.22, z(1.3)]));
      I.add(G.box(1.2, 0.5, 0.02), "#f4efe6", mtx([cx + 1.0, 1.75, z(deep - 0.02)]));
      break;
    }
    case "kosmetik": {
      // shelves of bottles and jars, a small white counter in front on the right
      const level = shelf(cx - 0.45, ow - 1.4, 2.2, 0.32, 5, "#f7f3ef");
      const bottle = ["#f2b8c6", "#e88aa6", "#f4e1d2", "#c9a0dc", "#ffffff", "#d64d6d", "#f2d27a"];
      for (let k = 0; k < 5; k++)
        for (let c = 0; c < 14; c++) {
          const h = 0.1 + 0.08 * r();
          I.add(
            G.cyl(0.03, 0.035, h, 8),
            pick(bottle),
            mtx([cx - 0.45 - (ow - 1.5) / 2 + 0.1 + c * ((ow - 1.6) / 13), level(k) + h / 2, z(deep - 0.18)]),
          );
        }
      I.add(G.rbox(0.9, 0.95, 0.5, 0.04), "#fbfafa", mtx([cx + 1.75, 0.48, z(0.6)]));
      I.add(G.cyl(0.06, 0.06, 0.2, 10), "#e88aa6", mtx([cx + 1.6, 1.05, z(0.6)]));
      I.add(G.cyl(0.05, 0.05, 0.14, 10), "#c9a0dc", mtx([cx + 1.85, 1.02, z(0.6)]));
      break;
    }
    case "elektronik": {
      // dark shelves with TVs, microwaves and speakers
      const level = shelf(cx, ow - 0.4, 2.2, 0.5, 4, "#3a3d47");
      const items: [number, number, string][] = [
        [0.62, 0.38, "#1e2028"],
        [0.5, 0.3, "#c9ccd3"],
        [0.3, 0.42, "#2b2d36"],
        [0.55, 0.34, "#1e2028"],
      ];
      for (let k = 0; k < 4; k++) {
        let x = cx - (ow - 0.6) / 2;
        while (x < cx + (ow - 0.6) / 2 - 0.3) {
          const [w, h, col] = pick(items);
          I.add(G.box(w, h, 0.36), col, mtx([x + w / 2, level(k) + h / 2, z(deep - 0.28)]));
          if (col === "#1e2028")
            I.add(G.box(w - 0.06, h - 0.06, 0.01), "#3d4766", mtx([x + w / 2, level(k) + h / 2, z(deep - 0.465)]));
          x += w + 0.08;
        }
      }
      break;
    }
  }
}

/** Corners of shop i's panel face (world): the copy's anchor surface. */
export function panelFace(i: number): { cx: number; cy: number; z: number; hw: number; hh: number } {
  const { cx } = shopX(i),
    P = ROW.panel;
  return { cx, cy: P.y, z: P.z, hw: P.w / 2, hh: P.h / 2 };
}
export type { Vec3 };
