// Kreatekno's lobby (beats 6–9a, tahap 7), its own chunk, built as the camera nears Kreatekno's door. From the
// team's videos k6 - k5a.6, K6 -K7, K7 - K8, K8 - K9.1 and Master 10a/10b (where the videos never look), at the
// sizes of sets/lobbyLayout: light wood floor, lavender walls with a purple skirting, a ceiling with light panels,
// the glass facade from inside with two low steps (its frames and glass are Kreatekno's own, sets/row), the
// corkboard (K6: 7 polaroids, the strip, 4 corner notes, purple pins), the two-tier rack with 6 open books and the
// wooden sign with brass nails (K7), potted plants, the meeting room behind its purple-framed glass (K8: the glass
// door, the long table, lilac chairs, two laptops, the whiteboard, a window to the garden, the 8 sticky notes on
// the glass), the reception desk with its slatted wall (Master 10a), and light backdrops: the park across the road
// (K9.1, seen through the facade) and the garden behind the meeting room's window. The copy (testimonials,
// articles, FAQ) is HTML on these props (langkah 5); the people are stand-ins until langkah 3–4.
// Draw calls: most parts are vertex-coloured (one mesh per area, culled per area); the big flat surfaces carry baked
// AO maps (lobby-*). The meeting room, the garden and the park show only while the camera is inside (setView).
import * as THREE from "three";
import { aoPlane, type AoTarget } from "../core/ao";
import { Batch, clean, G, mtx, rng, roundRect, type Kit, type Vec3 } from "../core/kit";
import { GOLDEN_DIR } from "../core/light";
import { glassMaterial } from "./glass";
import { BOARD_ITEMS, GLASS_ITEMS, LOBBY, lx, RACK_ITEMS } from "./lobbyLayout";
import { KREATEKNO } from "./rowLayout";
import { Tint, type RowMaterials } from "./shop";

const L = LOBBY,
  R = L.room;

const COL = {
  wall: "#d3c3ef",
  ceil: "#f3eff8",
  skirt: "#7b4fc9",
  frame: "#7550c6",
  wood: "#e8b986",
  woodDark: "#d29c66",
  floor: "#e2ae7a",
  cork: "#c98c52",
  paper: "#fbfaf8",
  photo: "#bdbcc8",
  pin: "#7a4fd0",
  brass: "#c9a14a",
  lilac: "#b9a8dc",
  lilacDark: "#a693d0",
  page: "#f7f0dc",
  pot: "#f3f1ee",
  leaf: "#5e9f4e",
  leafLight: "#79b964",
  soil: "#6b4b36",
  grass: "#86bd68",
  hedge: "#5c9a4b",
  trunk: "#8a6747",
  laptop: "#a3a8b4",
  screen: "#2e3140",
  board: "#fdfdfd",
  alu: "#c9ccd4",
  desk: "#a88bdc",
  deskTop: "#f6f4f9",
  slat: "#dba46a",
  slatBack: "#b9814e",
  plaza: "#dcd6e4",
} as const;

/** Flat-shaded copy (each face its own normal): the low-poly look of the videos' plants and trees. */
function flat(g: THREE.BufferGeometry) {
  const n = g.index ? g.toNonIndexed() : g;
  n.computeVertexNormals();
  return n;
}

/** A leaf: a folded diamond (rib raised toward +z), both sides, base at the origin, pointing up (+y). */
function leafGeo(len: number, w: number) {
  const a = len * 0.42,
    c = w * 0.35;
  const B = [0, 0, 0],
    T = [0, len, 0],
    Lp = [-w, a, 0],
    Rp = [w, a, 0],
    M = [0, a, c];
  const front = [B, Rp, M, M, Rp, T, B, M, Lp, M, T, Lp];
  const back = [B, M, Rp, M, T, Rp, B, Lp, M, M, Lp, T].map(([x, y, z]) => [x, y, z - 0.004]);
  const g = new THREE.BufferGeometry();
  g.setAttribute("position", new THREE.Float32BufferAttribute([...front, ...back].flat(), 3));
  g.computeVertexNormals();
  return g;
}

/** A faceted tree crown: an icosphere stretched up, its corners nudged (the same corner moves the same way). */
function crownGeo(r: number, stretch: number, seed: number) {
  const g = new THREE.IcosahedronGeometry(r, 1),
    p = g.attributes.position as THREE.BufferAttribute;
  for (let i = 0; i < p.count; i++) {
    const x = p.getX(i),
      y = p.getY(i),
      z = p.getZ(i),
      h = Math.sin(Math.round(x * 97 + y * 131 + z * 173 + seed * 7) * 12.9898) * 43758.5453,
      k = 1 + 0.12 * (h - Math.floor(h) - 0.5);
    p.setXYZ(i, x * k, y * k * stretch, z * k);
  }
  return flat(g);
}

/** A potted plant (white pot, long low-poly leaves) of height h, its pot's base centre at (x, y, z). */
function plant(T: Tint, x: number, y: number, z: number, h: number, seed: number) {
  const r = rng(seed),
    potH = Math.min(0.42, h * 0.27),
    potR = potH * 0.5;
  T.add(G.cyl(potR, potR * 0.78, potH, 14), COL.pot, mtx([x, y + potH / 2, z]));
  T.add(G.cyl(potR * 0.92, potR * 0.92, 0.02, 14), COL.soil, mtx([x, y + potH - 0.03, z]));
  const n = Math.round(12 + h * 9);
  for (let i = 0; i < n; i++) {
    const yaw = i * 2.39996 + r() * 0.4,
      tilt = 0.25 + 0.75 * (i / n) * (0.7 + 0.3 * r()),
      len = (h - potH) * (0.45 + 0.55 * (1 - i / n)) * (0.85 + 0.25 * r()),
      base = y + potH - 0.02 + (h - potH) * 0.35 * (1 - i / n) * r();
    // leaning out by `tilt`, turned round the stem by `yaw`
    const m = new THREE.Matrix4().makeRotationY(yaw).multiply(new THREE.Matrix4().makeRotationX(tilt));
    T.add(leafGeo(len * 0.8, len * 0.17), r() < 0.5 ? COL.leaf : COL.leafLight, m.setPosition(x, base, z));
  }
}

/** A low-poly tree: trunk and one or two faceted crowns, its base at (x, y, z). */
function tree(T: Tint, x: number, y: number, z: number, h: number, seed: number) {
  const r = rng(seed),
    cr = h * (0.26 + 0.05 * r()),
    green = ["#7cb36a", "#86bd6f", "#6fa95f", "#8fc277"][Math.floor(r() * 4)];
  T.add(G.cyl(0.07 * h * 0.3, 0.1 * h * 0.3, h * 0.55, 6), COL.trunk, mtx([x, y + h * 0.275, z]));
  T.add(crownGeo(cr, 1.3, seed), green, mtx([x, y + h - cr * 1.25, z]));
  if (r() < 0.5) T.add(crownGeo(cr * 0.7, 1.2, seed + 1), green, mtx([x + cr * 0.35, y + h - cr * 0.4, z + 0.1]));
}

/** A lilac chair facing yaw (0 = +z), its seat's centre at (x, z). */
function chair(T: Tint, x: number, y: number, z: number, yaw: number) {
  const o = new THREE.Matrix4().compose(
    new THREE.Vector3(x, y, z),
    new THREE.Quaternion().setFromEuler(new THREE.Euler(0, yaw, 0)),
    new THREE.Vector3(1, 1, 1),
  );
  const at = (p: Vec3, rot: Vec3 = [0, 0, 0]) => mtx(p, rot).premultiply(o);
  T.add(G.rbox(0.46, 0.07, 0.44, 0.03), COL.lilac, at([0, 0.46, 0]));
  T.add(G.rbox(0.44, 0.42, 0.06, 0.03), COL.lilac, at([0, 0.74, -0.21], [-0.12, 0, 0]));
  for (const [sx, sz] of [
    [-1, -1],
    [1, -1],
    [-1, 1],
    [1, 1],
  ])
    T.add(G.cyl(0.018, 0.016, 0.44, 6), COL.wood, at([sx * 0.18, 0.21, sz * 0.17], [sz * 0.08, 0, -sx * 0.06]));
}

export function buildLobby(kit: Kit, M: RowMaterials, ao: AoTarget[]) {
  const { mat, canvasTex } = kit;
  const group = new THREE.Group();
  group.name = "lobby";
  const occ: THREE.BufferGeometry[] = [];
  const x0 = lx(R.farX),
    x1 = lx(L.right),
    xf = lx(L.leftFront),
    xg = lx(R.glassX),
    z0 = L.front,
    z1 = L.back,
    yF = L.floor,
    yC = L.ceil,
    zS = z0 - 2 * L.steps.depth;
  const mid = (a: Vec3, b: Vec3): Vec3 => [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2, (a[2] + b[2]) / 2];
  const size = (a: Vec3, b: Vec3) => G.box(b[0] - a[0], b[1] - a[1], b[2] - a[2]);
  /** An occluder for the AO tracer only (the parts drawn are vertex-coloured, not in a Batch). */
  const occBox = (a: Vec3, b: Vec3) => occ.push(clean(size(a, b)).applyMatrix4(mtx(mid(a, b))));
  /** A tinted box between two corners (optionally an occluder of the AO). */
  const tbox = (T: Tint, hex: string, a: Vec3, b: Vec3, occluder = false) => {
    T.add(size(a, b), hex, mtx(mid(a, b)));
    if (occluder) occBox(a, b);
  };

  // ---------- shell: floor, walls, ceiling (AO planes), skirting, steps, light panels ----------
  const shell = new THREE.Group();
  shell.name = "lobby-shell";
  const wallMat = mat(COL.wall, { roughness: 0.92 });
  {
    // the floor: light planks along the depth (video K9.1), a little glossy
    const PLANK = 1.6;
    const tiles = canvasTex(512, 512, (g, w, h) => {
      // 8 planks across the tile, two lengths down each column (the tile repeats: drawn wrapped at the bottom)
      const r = rng(7),
        cols = 8,
        cw = w / cols,
        base = new THREE.Color(COL.floor);
      for (let c = 0; c < cols; c++) {
        const o = r() * h,
          len = h * (0.45 + 0.2 * r());
        for (const [ya, yb] of [
          [o, o + len],
          [o + len, o + h],
        ]) {
          const col = base.clone().offsetHSL(0.004 * (r() - 0.5), 0.06 * (r() - 0.5), 0.05 * (r() - 0.5));
          for (const dy of [0, -h]) {
            g.fillStyle = `#${col.getHexString()}`;
            g.fillRect(c * cw, ya + dy, cw, yb - ya);
            // faint grain along the plank, the joint at its end
            g.fillStyle = "rgba(150,90,40,0.07)";
            for (let s = 0; s < 4; s++) g.fillRect(c * cw + ((s * 0.23 + c * 0.17) % 1) * cw, ya + dy, 1.2, yb - ya);
            g.fillStyle = "rgba(110,62,28,0.35)";
            g.fillRect(c * cw, ya + dy, cw, 1.5);
          }
        }
        g.fillStyle = "rgba(110,62,28,0.3)";
        g.fillRect(c * cw, 0, 1.5, h);
      }
    });
    tiles.wrapS = tiles.wrapT = THREE.RepeatWrapping;
    const fw = x1 - x0,
      fd = zS - z1;
    tiles.repeat.set(fw / PLANK, fd / PLANK);
    aoPlane(
      ao,
      "lobby-floor",
      shell,
      fw,
      fd,
      new THREE.MeshStandardMaterial({ map: tiles, roughness: 0.62 }),
      mtx([(x0 + x1) / 2, yF, (z1 + zS) / 2], [-Math.PI / 2, 0, 0]),
      { res: 0.8, maxDist: 1.1, strength: 0.75 },
    );
    const H = yC - yF,
      wy = (yF + yC) / 2;
    const wall = (id: string, w: number, m: THREE.Matrix4) => {
      const mesh = aoPlane(ao, id, shell, w, H, wallMat, m, { res: 0.7, maxDist: 1.0, strength: 0.7, shadow: true });
      occ.push(clean(mesh.geometry).applyMatrix4(mesh.matrix));
      return mesh;
    };
    wall("lobby-back", x1 - x0, mtx([(x0 + x1) / 2, wy, z1]));
    wall("lobby-right", z0 - z1, mtx([x1, wy, (z0 + z1) / 2], [0, -Math.PI / 2, 0]));
    wall("lobby-left", z0 - L.roomFrom, mtx([xf, wy, (z0 + L.roomFrom) / 2], [0, Math.PI / 2, 0]));
    wall("lobby-room-front", xg + 0.15 - x0, mtx([(x0 + xg + 0.15) / 2, wy, L.roomFrom], [0, Math.PI, 0]));
    // the meeting room's far wall, with the window to the garden: a shape with a hole (local x = world -z)
    {
      const w = L.roomFrom - z1,
        cz = (z1 + L.roomFrom) / 2,
        W = R.window,
        hx0 = -(W.z[0] - cz),
        hx1 = -(W.z[1] - cz),
        hy0 = W.y[0] - wy,
        hy1 = W.y[1] - wy;
      const shape = new THREE.Shape();
      shape.moveTo(-w / 2, -H / 2);
      shape.lineTo(w / 2, -H / 2);
      shape.lineTo(w / 2, H / 2);
      shape.lineTo(-w / 2, H / 2);
      shape.closePath();
      const hole = new THREE.Path();
      hole.moveTo(hx0, hy0);
      hole.lineTo(hx0, hy1);
      hole.lineTo(hx1, hy1);
      hole.lineTo(hx1, hy0);
      hole.closePath();
      shape.holes.push(hole);
      const far = new THREE.Mesh(new THREE.ShapeGeometry(shape), wallMat.clone());
      far.matrixAutoUpdate = false;
      far.matrix.copy(mtx([x0, wy, cz], [0, Math.PI / 2, 0]));
      far.receiveShadow = far.castShadow = true;
      far.material.shadowSide = THREE.DoubleSide;
      shell.add(far);
      occ.push(clean(far.geometry).applyMatrix4(far.matrix));
      ao.push({
        id: "lobby-room-far",
        mesh: far as THREE.Mesh<THREE.BufferGeometry, THREE.MeshStandardMaterial>,
        shapeUV: [-w / 2, -H / 2, w, H],
        local: [
          [-w / 2, -H / 2],
          [w / 2, -H / 2],
          [-w / 2, H / 2],
        ],
        res: [Math.round(w * 10), Math.round(H * 10)],
        maxDist: 1.0,
        strength: 0.7,
        skip: (x, y) => x > hx0 && x < hx1 && y > hy0 && y < hy1,
      });
    }
    // the ceiling: one plane over the lobby and the meeting room (it casts the sun's shadow: nothing is built above
    // the back of the lobby)
    const ceil = new THREE.Mesh(new THREE.PlaneGeometry(x1 - x0 + 0.4, z0 - z1 + 0.2), mat(COL.ceil, { roughness: 1 }));
    ceil.matrixAutoUpdate = false;
    ceil.matrix.copy(mtx([(x0 + x1) / 2, yC - 0.02, (z0 + z1) / 2], [Math.PI / 2, 0, 0]));
    ceil.castShadow = ceil.receiveShadow = true;
    shell.add(ceil);
    occ.push(clean(ceil.geometry).applyMatrix4(ceil.matrix));

    const SB = new Batch(shell),
      skirt = mat(COL.skirt, { roughness: 0.55 });
    const sk = (a: Vec3, b: Vec3) => SB.add(size(a, b), skirt, mtx(mid(a, b)), { occ: false, shadow: false });
    sk([x0, yF, z1], [x1, yF + 0.1, z1 + 0.025]);
    sk([x1 - 0.025, yF, z1], [x1, yF + 0.1, zS]);
    sk([xf, yF, L.roomFrom], [xf + 0.025, yF + 0.1, zS]);
    sk([x0, yF, z1], [x0 + 0.025, yF + 0.1, L.roomFrom]);
    sk([x0, yF, L.roomFrom - 0.025], [xg, yF + 0.1, L.roomFrom]);
    // the skirting climbs the two steps along both side walls (Master 10b)
    for (const [xa, xb] of [
      [xf, xf + 0.025],
      [x1 - 0.025, x1],
    ]) {
      sk([xa, yF, zS], [xb, yF + 0.25, z0 - L.steps.depth]);
      sk([xa, -L.steps.rise, z0 - L.steps.depth], [xb, 0.1, z0]);
    }
    // the bit of wall facing the lobby between its left wall and the meeting room's corner column
    {
      const a: Vec3 = [xf, yF, L.roomFrom - 0.2],
        b: Vec3 = [xg - 0.15, yC, L.roomFrom];
      SB.add(size(a, b), wallMat, mtx(mid(a, b)));
    }
    // the facade's solid parts from inside, in the walls' lavender (Kreatekno's own wall and pillar are purple)
    SB.add(size([xf, 0, -0.3], [lx(4.05), yC, -0.28]), wallMat, mtx(mid([xf, 0, -0.3], [lx(4.05), yC, -0.28])), {
      occ: false,
    });
    SB.add(size([lx(11.85), 0, -0.3], [x1, yC, -0.12]), wallMat, mtx(mid([lx(11.85), 0, -0.3], [x1, yC, -0.12])), {
      occ: false,
    });
    // two steps of light wood up to the facade, the length of the glass front (a paler nosing on each)
    const stepWood = mat(COL.wood, { roughness: 0.5 }),
      nose = mat("#f0cda4", { roughness: 0.5 });
    for (let k = 0; k < 2; k++) {
      const top = -k * L.steps.rise,
        za = z0 - (k + 1) * L.steps.depth,
        zb = z0 - k * L.steps.depth,
        a: Vec3 = [xf + 0.025, yF, za],
        b: Vec3 = [x1 - 0.025, top - 0.015, zb];
      SB.add(size(a, b), stepWood, mtx(mid(a, b)), { shadow: false });
      SB.add(G.box(b[0] - a[0], 0.015, 0.06), nose, mtx([(a[0] + b[0]) / 2, top - 0.0075, za + 0.03]), {
        shadow: false,
      });
      SB.add(
        G.box(b[0] - a[0], 0.015, zb - za - 0.06),
        stepWood,
        mtx([(a[0] + b[0]) / 2, top - 0.0075, (za + zb + 0.06) / 2]),
        {
          shadow: false,
        },
      );
    }
    // light panels: three columns down the lobby, three in the meeting room along its length
    const lamp = mat("#ffffff", { emissive: "#ffffff", emissiveIntensity: 1.25, roughness: 1 }),
      rim = mat("#d9d5e2", { roughness: 0.6 });
    const panel = (x: number, z: number, w: number, d: number) => {
      SB.add(G.box(w + 0.06, 0.012, d + 0.06), rim, mtx([x, yC - 0.026, z]), { occ: false, shadow: false });
      SB.add(G.box(w, 0.012, d), lamp, mtx([x, yC - 0.03, z]), { occ: false, shadow: false });
    };
    for (const z of [-2.0, -5.2, -8.4, -11.6]) for (const x of [5.45, 8.15, 10.85]) panel(lx(x), z, 1.2, 0.3);
    // (near the room's far wall: from K8 they show through the glass under its head, as in the video)
    for (const z of [-7.6, -10.1, -12.6]) panel(lx(R.farX + 0.75), z, 0.3, 1.2);
    SB.build();
    occ.push(...SB.occ);
  }

  // ---------- corkboard (K6): purple frame, cork, the strip, 7 polaroids, 4 corner notes, purple pins ----------
  const TB = new Tint();
  const Bd = L.board,
    bx = lx(Bd.cx),
    bz = z1 + 0.03;
  {
    const fw = Bd.frame,
      hw = Bd.w / 2,
      hh = Bd.h / 2;
    for (const [cx, cy, w, h] of [
      [0, hh - fw / 2, Bd.w, fw],
      [0, -hh + fw / 2, Bd.w, fw],
      [-hw + fw / 2, 0, fw, Bd.h - 2 * fw],
      [hw - fw / 2, 0, fw, Bd.h - 2 * fw],
    ])
      TB.add(G.rbox(w, h, 0.045, 0.012), COL.frame, mtx([bx + cx, Bd.cy + cy, z1 + 0.0225]));
    occBox([bx - hw, Bd.cy - hh, z1], [bx + hw, Bd.cy + hh, z1 + 0.045]);
    const cw = Bd.w - 2 * fw,
      ch = Bd.h - 2 * fw;
    const cork = canvasTex(512, Math.round((512 * ch) / cw), (g, w, h) => {
      const r = rng(11);
      g.fillStyle = COL.cork;
      g.fillRect(0, 0, w, h);
      for (let i = 0; i < 2600; i++) {
        const l = r();
        g.fillStyle = l < 0.5 ? `rgba(120,70,30,${0.15 + 0.2 * r()})` : `rgba(240,190,130,${0.12 + 0.2 * r()})`;
        const s = 1 + r() * 2.2;
        g.fillRect(r() * w, r() * h, s, s * (0.6 + r() * 0.8));
      }
    });
    const face = new THREE.Mesh(
      new THREE.PlaneGeometry(cw, ch),
      new THREE.MeshStandardMaterial({ map: cork, roughness: 1 }),
    );
    face.position.set(bx, Bd.cy, bz);
    face.receiveShadow = true;
    face.matrixAutoUpdate = false;
    face.updateMatrix();
    shell.add(face);
    TB.add(G.box(cw, ch, 0.025), "#a8713f", mtx([bx, Bd.cy, z1 + 0.0165]));
    const card = (r: { x: number; y: number; w: number; h: number }, hex: string, dz = 0.004, z = bz) =>
      TB.add(G.box(r.w, r.h, dz), hex, mtx([bx + r.x, Bd.cy + r.y, z + dz / 2]));
    const pin = (x: number, y: number, z: number) => {
      TB.add(G.sph(0.017, 10, 8), COL.pin, mtx([bx + x, Bd.cy + y, z + 0.016], [0, 0, 0], [1, 1, 0.8]));
      TB.add(G.cyl(0.006, 0.006, 0.014, 6), "#5b3aa0", mtx([bx + x, Bd.cy + y, z + 0.006], [Math.PI / 2, 0, 0]));
    };
    const S = BOARD_ITEMS.strip;
    card(S, COL.paper);
    for (const sx of [-1, 1]) pin(S.x + sx * (S.w / 2 - 0.05), S.y, bz + 0.004);
    for (const p of BOARD_ITEMS.polaroids) {
      card(p, COL.paper, 0.005);
      card({ x: p.x, y: p.y + 0.08, w: p.w * 0.84, h: p.h * 0.52 }, COL.photo, 0.001, bz + 0.005);
      pin(p.x, p.y + p.h / 2 - 0.02, bz + 0.005);
    }
    for (const n of BOARD_ITEMS.notes) {
      card(n, "#f6f5f2", 0.003);
      pin(n.x, n.y + n.h / 2 - 0.035, bz + 0.003);
    }
  }
  const board = TB.mesh(M.tint);
  board.castShadow = false;
  shell.add(board);

  // ---------- rack, sign, plant (K7) ----------
  const TR = new Tint();
  {
    const Rk = L.rack,
      rx = lx(Rk.cx),
      hw = Rk.w / 2,
      rz0 = z1,
      rz1 = z1 + Rk.d,
      th = 0.05;
    const wb = (a: Vec3, b: Vec3, hex: string = COL.wood) => {
      TR.add(G.rbox(b[0] - a[0], b[1] - a[1], b[2] - a[2], 0.012), hex, mtx(mid(a, b)));
    };
    wb([rx - hw, yF, rz0], [rx - hw + th, yF + Rk.h, rz1]);
    wb([rx + hw - th, yF, rz0], [rx + hw, yF + Rk.h, rz1]);
    wb([rx - hw - 0.005, yF + Rk.h - th, rz0], [rx + hw + 0.005, yF + Rk.h, rz1 + 0.01]);
    wb([rx - hw + th, yF, rz0 + 0.02], [rx + hw - th, yF + Rk.tiers[0], rz1 - 0.01], COL.woodDark);
    wb([rx - hw + th, yF + Rk.tiers[1] - 0.035, rz0 + 0.02], [rx + hw - th, yF + Rk.tiers[1], rz1 - 0.01]);
    wb([rx - hw + th, yF + Rk.tiers[0] - 0.035, rz0 + 0.02], [rx + hw - th, yF + Rk.tiers[0], rz1 - 0.01]);
    tbox(TR, "#dcab78", [rx - hw + th, yF + Rk.tiers[0], rz0], [rx + hw - th, yF + Rk.h - th, rz0 + 0.02]);
    occBox([rx - hw, yF, rz0], [rx + hw, yF + Rk.h, rz1]);
    // six open books standing on the tiers (top: purple, navy, teal; bottom: teal, purple, navy; video K7)
    const covers = ["#8a5cc8", "#2f4f8a", "#2aa79a", "#2aa79a", "#8a5cc8", "#2f4f8a"];
    const bz0 = rz0 + 0.14,
      tilt = 0.12;
    RACK_ITEMS.books.forEach((b, i) => {
      const cy = yF + b.y,
        cx = rx + b.x;
      TR.add(G.rbox(b.w + 0.05, b.h + 0.036, 0.014, 0.006), covers[i], mtx([cx, cy, bz0 - 0.007]));
      for (const s of [-1, 1]) {
        const q = b.w / 4;
        TR.add(
          G.box(b.w / 2 - 0.006, b.h, 0.022),
          COL.page,
          mtx([cx + s * q * Math.cos(tilt), cy, bz0 + 0.011 + q * Math.sin(tilt)], [0, -s * tilt, 0]),
        );
      }
      // the spine's shadow line and a low stand in front of the book
      TR.add(G.box(0.006, b.h * 0.98, 0.004), "#d8ccb0", mtx([cx, cy, bz0 + 0.012]));
      TR.add(G.box(b.w + 0.03, 0.012, 0.06), COL.woodDark, mtx([cx, yF + b.y - b.h / 2 + 0.006, bz0 + 0.04]));
    });
    // the sign above the rack, its four brass nails
    const S = L.sign;
    TR.add(G.rbox(S.w, S.h, 0.03, 0.008), "#e6b580", mtx([lx(S.cx), S.cy, z1 + 0.015]));
    for (const sx of [-1, 1])
      for (const sy of [-1, 1])
        TR.add(
          G.cyl(0.013, 0.013, 0.008, 10),
          COL.brass,
          mtx([lx(S.cx) + sx * (S.w / 2 - 0.045), S.cy + sy * (S.h / 2 - 0.04), z1 + 0.033], [Math.PI / 2, 0, 0]),
        );
    plant(TR, lx(L.plant.x), yF, L.plant.z, L.plant.h, 21);
    occBox([lx(L.plant.x) - 0.2, yF, L.plant.z - 0.2], [lx(L.plant.x) + 0.2, yF + 0.4, L.plant.z + 0.2]);
  }
  const rack = TR.mesh(M.tint);
  rack.castShadow = false;
  shell.add(rack);

  // ---------- reception desk with its slatted wall and cove light, plants (Master 10a) ----------
  const TD = new Tint();
  {
    const D = L.desk,
      dx0 = lx(D.x[0]),
      dx1 = lx(D.x[1]) - 0.2,
      dz0 = D.z[1],
      dz1 = D.z[0],
      w = dx1 - dx0,
      d = dz1 - dz0,
      cx = (dx0 + dx1) / 2,
      cz = (dz0 + dz1) / 2;
    const slab = (sw: number, sd: number, r: number, h: number, y: number, hex: string) => {
      const g = new THREE.ExtrudeGeometry(roundRect(sw, sd, r), { depth: h, bevelEnabled: false, curveSegments: 5 });
      TD.add(g, hex, mtx([cx, y, cz], [-Math.PI / 2, 0, 0]));
    };
    slab(w - 0.08, d - 0.08, 0.36, 0.08, yF, COL.deskTop);
    slab(w, d, 0.4, D.h - 0.13, yF + 0.08, COL.desk);
    slab(w + 0.08, d + 0.08, 0.44, 0.05, yF + D.h - 0.05, COL.deskTop);
    occBox([dx0, yF, dz0], [dx1, yF + D.h, dz1]);
    // a monitor and a small plant on the desk
    TD.add(G.box(0.5, 0.32, 0.03), "#3a3d4a", mtx([cx - 0.1, yF + D.h + 0.28, cz - 0.15], [0, -0.5, 0]));
    TD.add(G.box(0.06, 0.12, 0.06), "#9aa0ad", mtx([cx - 0.1, yF + D.h + 0.06, cz - 0.15]));
    plant(TD, cx + 0.35, yF + D.h, cz + 0.3, 0.42, 31);
    // vertical slats on the right wall behind the desk, a warm cove light along their top
    const sz0 = -9.6,
      xw = x1 - 0.03;
    tbox(TD, COL.slatBack, [xw, yF, z1], [x1, yC - 0.14, sz0]);
    for (let z = sz0 + 0.05, k = 0; z > z1 + 0.04; z -= 0.1, k++)
      tbox(TD, k % 3 ? COL.slat : "#d39b60", [xw - 0.045, yF + 0.1, z - 0.03], [xw, yC - 0.16, z + 0.03]);
    plant(TD, lx(11.6), yF, -11.9, 1.25, 41);
  }
  const deskArea = TD.mesh(M.tint);
  deskArea.castShadow = false;
  shell.add(deskArea);
  {
    const cove = new THREE.Mesh(
      G.box(0.1, 0.03, -9.6 - z1),
      mat("#ffe7bf", { emissive: "#ffd79a", emissiveIntensity: 1.4, roughness: 1 }),
    );
    cove.position.set(x1 - 0.1, yC - 0.13, (z1 - 9.6) / 2);
    cove.matrixAutoUpdate = false;
    cove.updateMatrix();
    shell.add(cove);
  }
  group.add(shell);

  // ---------- meeting room (shown from inside only): glass wall and door, table, chairs, laptops, whiteboard,
  // window, the sticky notes on the lobby side of the glass ----------
  const room = new THREE.Group();
  room.name = "lobby-room";
  const TM = new Tint();
  const glassIn = glassMaterial(kit, { sheen: 1, tint: "#eef0ff", side: THREE.DoubleSide });
  const GB = new Batch(room);
  const roomDoor = new THREE.Group();
  const seatMeshes: THREE.Mesh[] = [];
  {
    const gTop = R.glassTop,
      frame = COL.frame,
      [dz0, dz1] = R.door;
    // sill (not across the door), head, the wall above it, the corner column, mullions
    tbox(TM, frame, [xg - 0.05, yF, z1], [xg + 0.05, yF + 0.06, dz1], true);
    tbox(TM, frame, [xg - 0.06, gTop, z1], [xg + 0.06, gTop + 0.08, L.roomFrom], true);
    tbox(TM, COL.wall, [xg - 0.08, gTop + 0.08, z1], [xg + 0.08, yC, L.roomFrom], true);
    tbox(TM, frame, [xg - 0.15, yF, dz0], [xg + 0.15, yC, L.roomFrom], true);
    for (const z of [dz1, R.glass[0], R.glass[1], z1 + 0.04]) {
      const w = z === R.glass[0] || z === R.glass[1] ? 0.06 : 0.04;
      tbox(TM, frame, [xg - 0.055, yF, z - w], [xg + 0.055, gTop, z + w], true);
    }
    // three panes: by the door, the framed section of K8, by the back wall
    for (const [a, b] of [
      [dz1, R.glass[0]],
      [R.glass[0], R.glass[1]],
      [R.glass[1], z1],
    ])
      GB.add(
        new THREE.PlaneGeometry(a - b, gTop - yF - 0.06),
        glassIn,
        mtx([xg, (gTop + yF + 0.06) / 2, (a + b) / 2], [0, Math.PI / 2, 0]),
        { occ: false, shadow: false },
      );
    // the glass door: a leaf on its hinge at the front jamb (swings out into the lobby, langkah 4)
    const leafW = dz0 - dz1,
      LT = new Tint(),
      LB = new Batch(roomDoor);
    roomDoor.position.set(xg, 0, dz0);
    for (const [cz, cy, w, h] of [
      [-0.03, (gTop + yF) / 2, 0.06, gTop - yF],
      [-leafW + 0.03, (gTop + yF) / 2, 0.06, gTop - yF],
      [-leafW / 2, gTop - 0.04, leafW, 0.08],
      [-leafW / 2, yF + 0.05, leafW, 0.1],
    ])
      LT.add(G.box(0.05, h, w), frame, mtx([0, cy, cz]));
    // the long pull handle on the lobby side (video K9.1), near the free edge
    LT.add(G.cyl(0.014, 0.014, 0.75, 8), "#dfe2e8", mtx([0.07, 1.0 + yF, -leafW + 0.14]));
    for (const y of [0.66, 1.34])
      LT.add(G.cyl(0.01, 0.01, 0.07, 6), "#dfe2e8", mtx([0.035, y + yF, -leafW + 0.14], [0, 0, Math.PI / 2]));
    LB.add(
      new THREE.PlaneGeometry(leafW - 0.12, gTop - yF - 0.18),
      glassIn,
      mtx([0, (gTop + yF) / 2 - 0.01, -leafW / 2], [0, Math.PI / 2, 0]),
      { occ: false, shadow: false },
    );
    LB.build();
    const leaf = LT.mesh(M.tint);
    leaf.castShadow = false;
    roomDoor.add(leaf);
    room.add(roomDoor);

    // long table, chairs round it, two laptops where Wildan and Andi sit (facing the glass)
    const T = R.table,
      tx = lx(T.x),
      top = T.top;
    TM.add(G.rbox(T.w, 0.05, T.z[0] - T.z[1], 0.015), COL.wood, mtx([tx, top - 0.025, (T.z[0] + T.z[1]) / 2]));
    TM.add(G.box(T.w - 0.12, 0.06, T.z[0] - T.z[1] - 0.2), COL.woodDark, mtx([tx, top - 0.08, (T.z[0] + T.z[1]) / 2]));
    for (const sz of [T.z[0] - 0.12, T.z[1] + 0.12])
      for (const sx of [-1, 1])
        TM.add(
          G.box(0.06, top - yF - 0.05, 0.06),
          COL.woodDark,
          mtx([tx + sx * (T.w / 2 - 0.1), (top + yF) / 2 - 0.025, sz]),
        );
    occBox([tx - T.w / 2, top - 0.1, T.z[1]], [tx + T.w / 2, top, T.z[0]]);
    const seatY = yF;
    // the chairs' seats as occluders (contact shade on the floor round the table)
    const chairOcc = (x: number, z: number) => occBox([x - 0.23, yF + 0.42, z - 0.22], [x + 0.23, yF + 0.5, z + 0.22]);
    const seats: [number, number, number][] = [
      ...[-8.05, -10.05, -12.05].map((z) => [tx + 0.72, z, -Math.PI / 2] as [number, number, number]),
      [tx - 0.72, -12.35, Math.PI / 2],
      [tx, T.z[0] + 0.45, Math.PI],
      [tx, T.z[1] - 0.45, 0],
    ];
    for (const [x, z, yaw] of seats) {
      chair(TM, x, seatY, z, yaw);
      chairOcc(x, z);
    }
    // Wildan's and Andi's chairs and laptops: one mesh each, moved to their seat for the format (placeSeats; not
    // in the AO, which is baked once)
    for (const s of R.seats) {
      const TS = new Tint(),
        TL = new Tint(),
        lx0 = tx - 0.16;
      chair(TS, tx - 0.72, seatY, 0, Math.PI / 2);
      TL.add(G.rbox(0.24, 0.016, 0.34, 0.006), COL.laptop, mtx([lx0, top + 0.008, 0]));
      TL.add(G.rbox(0.012, 0.23, 0.34, 0.006), COL.laptop, mtx([lx0 + 0.12 + 0.02, top + 0.12, 0], [0, 0, -0.22]));
      TL.add(G.box(0.002, 0.2, 0.31), COL.screen, mtx([lx0 + 0.12 + 0.012, top + 0.12, 0], [0, 0, -0.22]));
      // the chair and the laptop apart: Wildan pushes his chair back as he gets up (langkah 4)
      for (const T of [TS, TL]) {
        const m = T.mesh(M.tint);
        m.castShadow = false;
        m.position.z = s.z.pc;
        m.updateMatrix();
        seatMeshes.push(m);
        room.add(m);
      }
    }
    // whiteboard on the far wall: white face, aluminium frame and tray
    const W = R.whiteboard,
      wcz = (W.z[0] + W.z[1]) / 2,
      ww = W.z[0] - W.z[1],
      wh = W.y[1] - W.y[0],
      wcy = (W.y[0] + W.y[1]) / 2;
    TM.add(G.box(0.02, wh, ww), COL.board, mtx([x0 + 0.012, wcy, wcz]));
    for (const [cy, h] of [
      [W.y[0], 0.035],
      [W.y[1], 0.035],
    ])
      TM.add(G.box(0.03, h, ww + 0.035), COL.alu, mtx([x0 + 0.016, cy, wcz]));
    for (const z of [W.z[0], W.z[1]]) TM.add(G.box(0.03, wh + 0.035, 0.035), COL.alu, mtx([x0 + 0.016, wcy, z]));
    TM.add(G.box(0.07, 0.025, ww * 0.7), COL.alu, mtx([x0 + 0.04, W.y[0] - 0.01, wcz]));
    // the window to the garden: purple frame, sill, the glass
    const Wn = R.window,
      ncz = (Wn.z[0] + Wn.z[1]) / 2,
      nw = Wn.z[0] - Wn.z[1],
      nh = Wn.y[1] - Wn.y[0],
      ncy = (Wn.y[0] + Wn.y[1]) / 2;
    for (const z of [Wn.z[0], Wn.z[1]]) tbox(TM, frame, [x0 - 0.12, Wn.y[0], z - 0.04], [x0 + 0.03, Wn.y[1], z + 0.04]);
    tbox(TM, frame, [x0 - 0.12, Wn.y[1] - 0.04, Wn.z[1]], [x0 + 0.03, Wn.y[1] + 0.04, Wn.z[0]]);
    tbox(TM, frame, [x0 - 0.12, Wn.y[0] - 0.05, Wn.z[1] - 0.04], [x0 + 0.08, Wn.y[0] + 0.02, Wn.z[0] + 0.04]);
    GB.add(
      new THREE.PlaneGeometry(nw, nh),
      glassMaterial(kit, { sheen: 0.6, side: THREE.DoubleSide }),
      mtx([x0 - 0.06, ncy, ncz], [0, Math.PI / 2, 0]),
      { occ: false, shadow: false },
    );
    // 8 sticky notes on the lobby side of the glass (4 × 2, video K8), a deeper band where they stick
    const gz = (R.glass[0] + R.glass[1]) / 2,
      cols = ["#f3df6b", "#f7aec6", "#6fd8ec", "#c9a3f2", "#6fd8ec", "#c9a3f2", "#f3df6b", "#f7aec6"];
    GLASS_ITEMS.notes.forEach((n, i) => {
      const z = gz - n.x,
        y = yF + n.y,
        c = new THREE.Color(cols[i]);
      TM.add(G.box(0.003, n.h, n.w), cols[i], mtx([xg + 0.008, y, z]));
      TM.add(
        G.box(0.004, n.h * 0.09, n.w),
        `#${c.clone().offsetHSL(0, 0.04, -0.07).getHexString()}`,
        mtx([xg + 0.009, y + n.h * 0.455, z]),
      );
    });
  }
  GB.build();
  const roomTint = TM.mesh(M.tint);
  roomTint.castShadow = false;
  room.add(roomTint);
  group.add(room);

  // ---------- shafts of golden light (langkah 4; no post-processing): additive quads with a soft gradient, the
  // window's patch on the meeting room's floor and table and the slab of light between (K8), the facade's bays on the
  // lobby floor (K9.1). Laid out along the golden-hour sun (core/light GOLDEN), faded in with it (setBeams) ----------
  const beamTex = canvasTex(8, 128, (g, w, h) => {
    const gr = g.createLinearGradient(0, 0, 0, h);
    gr.addColorStop(0, "rgba(255,255,255,1)");
    gr.addColorStop(0.35, "rgba(255,255,255,0.55)");
    gr.addColorStop(1, "rgba(255,255,255,0)");
    g.fillStyle = gr;
    g.fillRect(0, 0, w, h);
  });
  const beamMat = (color: string) =>
    new THREE.MeshBasicMaterial({
      color,
      map: beamTex,
      transparent: true,
      opacity: 0,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      side: THREE.DoubleSide,
      fog: false,
    });
  /** Travel of the golden sun's light (from −x and the street, 18° up). */
  const SUN = new THREE.Vector3(GOLDEN_DIR.x, GOLDEN_DIR.y, GOLDEN_DIR.z).negate().normalize();
  const along = (p: THREE.Vector3, y: number) =>
    p
      .clone()
      .addScaledVector(SUN, (p.y - y) / -SUN.y)
      .setY(y);
  /** Quads (4 corners each, v = 0 at the bright end) merged into one mesh. */
  const quads = (
    list: [THREE.Vector3, THREE.Vector3, THREE.Vector3, THREE.Vector3, number?][],
    mat: THREE.Material,
  ) => {
    const pos: number[] = [],
      uv: number[] = [],
      idx: number[] = [];
    for (const [a, b, c, d, fade = 1] of list) {
      const i = pos.length / 3;
      pos.push(...a.toArray(), ...b.toArray(), ...c.toArray(), ...d.toArray());
      // a, b at the bright end (v 1 in the texture's flipped rows), c, d where it fades
      uv.push(0, 1, 1, 1, 0, 1 - fade, 1, 1 - fade);
      idx.push(i, i + 1, i + 2, i + 2, i + 1, i + 3);
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.Float32BufferAttribute(pos, 3));
    g.setAttribute("uv", new THREE.Float32BufferAttribute(uv, 2));
    g.setIndex(idx);
    const m = new THREE.Mesh(g, mat);
    m.renderOrder = 2;
    m.frustumCulled = true;
    return m;
  };
  const roomBeamMat = beamMat("#ffbf63"),
    roomSlabMat = beamMat("#ffd08a"),
    frontBeamMat = beamMat("#ffc483");
  {
    // the meeting room: the window's light on the floor (cut at the glass wall), on the table, and the slab between
    const Wn = R.window,
      wx = x0 + 0.02,
      T = R.table,
      tx = lx(T.x),
      list: Parameters<typeof quads>[0] = [];
    const corner = (y: number, z: number) => new THREE.Vector3(wx, y, z);
    const onPlane = (y: number, z: number, plane: number) => along(corner(y, z), plane);
    // floor: the window's lower part (its upper part lands beyond the glass wall)
    const yCut = Math.min(Wn.y[1], yF + ((xg - 0.08 - wx) / SUN.x) * -SUN.y);
    list.push([
      onPlane(Wn.y[0], Wn.z[0], yF + 0.004),
      onPlane(Wn.y[0], Wn.z[1], yF + 0.004),
      onPlane(yCut, Wn.z[0], yF + 0.004),
      onPlane(yCut, Wn.z[1], yF + 0.004),
      0.85,
    ]);
    // table top: the rows of the window whose light lands between its edges
    const ty = T.top + 0.003,
      yAt = (x: number) => ty + ((x - wx) / SUN.x) * -SUN.y,
      ya = Math.max(Wn.y[0], yAt(tx - T.w / 2)),
      yb = Math.min(Wn.y[1], yAt(tx + T.w / 2));
    if (yb > ya)
      list.push([
        onPlane(ya, Wn.z[0], ty),
        onPlane(ya, Wn.z[1], ty),
        onPlane(yb, Wn.z[0], ty),
        onPlane(yb, Wn.z[1], ty),
        0.9,
      ]);
    room.add(quads(list, roomBeamMat));
    // the slab of light from the window: its top and its two sides, faint, from a little in front of the window
    // (not over its glass) and fading toward the floor
    const reach = (p: THREE.Vector3) => along(p, yF + 0.01),
      slab: Parameters<typeof quads>[0] = [];
    for (const [a, b] of [
      [corner(Wn.y[1], Wn.z[0]), corner(Wn.y[1], Wn.z[1])],
      [corner(Wn.y[0], Wn.z[0]), corner(Wn.y[1], Wn.z[0])],
      [corner(Wn.y[0], Wn.z[1]), corner(Wn.y[1], Wn.z[1])],
    ])
      slab.push([
        a.clone().lerp(reach(a), 0.12),
        b.clone().lerp(reach(b), 0.12),
        a.clone().lerp(reach(a), 0.65),
        b.clone().lerp(reach(b), 0.65),
        1,
      ]);
    room.add(quads(slab, roomSlabMat));
  }
  const frontBeams = new THREE.Group();
  {
    // the facade's bays (sets/row: glass from 4.1 m to 0.6 m short of Kreatekno's right edge, the door between,
    // mullions halfway on either side): each bay's glass up to the band throws a long patch on the lobby floor
    const K = KREATEKNO,
      D = K.door,
      g0 = K.x0 + 4.1,
      g1 = K.x0 + K.w - 0.6,
      d0 = D.cx - D.w / 2,
      d1 = D.cx + D.w / 2,
      xs = [g0, (g0 + d0) / 2, d0, d1, (d1 + g1) / 2, g1],
      list: Parameters<typeof quads>[0] = [];
    for (let i = 0; i < xs.length - 1; i++) {
      const xa = xs[i] + 0.07,
        xb = xs[i + 1] - 0.07,
        ya = 0.2,
        // the bay's light up to where it would reach the right wall
        yb = Math.min(2.9, yF + ((x1 - 0.1 - xb) / SUN.x) * -SUN.y);
      if (yb <= ya) continue;
      const p = (x: number, y: number) => along(new THREE.Vector3(x, y, -0.3), yF + 0.004);
      list.push([p(xa, ya), p(xb, ya), p(xa, yb), p(xb, yb), 1]);
    }
    frontBeams.add(quads(list, frontBeamMat));
  }
  group.add(frontBeams);
  /** Golden light through the meeting room's window (K8) and the facade (K9.1), 0 … 1 each. */
  const setBeams = (roomK: number, frontK: number) => {
    roomBeamMat.opacity = 0.5 * roomK;
    roomSlabMat.opacity = 0.09 * roomK;
    frontBeamMat.opacity = 0.3 * frontK;
    roomBeamMat.visible = roomSlabMat.visible = roomK > 0.001;
    frontBeams.visible = frontBeams.matrixWorldAutoUpdate = frontK > 0.001;
  };

  // ---------- the garden behind the meeting room's window: grass, a fence, trees, bushes ----------
  const garden = new THREE.Group();
  garden.name = "lobby-garden";
  {
    const TG = new Tint(),
      gy = -0.15;
    tbox(TG, COL.grass, [lx(-14), gy - 0.1, -22], [x0 - 0.2, gy, -3]);
    const fx = lx(-2.6);
    for (let z = -3.5; z > -18; z -= 1.2) TG.add(G.box(0.08, 0.95, 0.08), "#e2c39a", mtx([fx, gy + 0.475, z]));
    for (const y of [0.35, 0.75])
      tbox(TG, "#e9cca4", [fx - 0.03, gy + y - 0.04, -18], [fx + 0.03, gy + y + 0.04, -3.5]);
    for (const [x, z, s] of [
      [-1.2, -6.4, 0.55],
      [-1.5, -8.4, 0.7],
      [-1.0, -10.2, 0.5],
    ])
      TG.add(crownGeo(s, 0.75, Math.round(x * 10)), COL.hedge, mtx([lx(x), gy + s * 0.55, z]));
    tree(TG, lx(-1.8), gy, -7.3, 3.6, 51);
    tree(TG, lx(-5.2), gy, -9.6, 4.6, 52);
    tree(TG, lx(-6.0), gy, -5.2, 4.2, 53);
    tree(TG, lx(-9.5), gy, -8.0, 5.2, 54);
    tree(TG, lx(-4.0), gy, -13.0, 4.4, 55);
    const m = TG.mesh(M.tint);
    m.castShadow = false;
    garden.add(m);
  }
  group.add(garden);

  // ---------- the park across the road (video K9.1, Master 10b): plaza, hedges, low-poly trees ----------
  const park = new THREE.Group();
  park.name = "lobby-park";
  {
    const TP = new Tint(),
      zp = 15.1;
    tbox(TP, COL.grass, [lx(-40), -0.08, zp], [lx(52), 0.0, 75]);
    tbox(TP, COL.plaza, [lx(-4), -0.04, zp], [lx(16), 0.03, zp + 3.6]);
    tbox(TP, "#c9c2d6", [lx(-4), 0.0, zp + 3.6], [lx(16), 0.08, zp + 3.75]);
    // hedges along the plaza and the park's edge, a gap in front of the plaza
    for (const [a, b, z] of [
      [-40, -4.6, zp + 0.6],
      [16.6, 52, zp + 0.6],
      [-4, 16, zp + 4.3],
    ])
      TP.add(G.rbox(b - a, 0.75, 0.8, 0.25), COL.hedge, mtx([lx((a + b) / 2), 0.375, z]));
    const r = rng(61);
    let k = 0;
    for (let x = -26; x < 40; x += 5.5 + r() * 2.5)
      tree(TP, lx(x), 0, zp + 6.5 + r() * 3.5 + (Math.abs(x - 6) < 8 ? 0 : 1), 4.6 + r() * 1.6, 70 + k++);
    for (let x = -30; x < 46; x += 6 + r() * 3) tree(TP, lx(x), 0, zp + 18 + r() * 8, 5.5 + r() * 2, 70 + k++);
    const m = TP.mesh(M.tint);
    m.castShadow = false;
    park.add(m);
  }
  group.add(park);

  // ---------- stand-in figures, shown per phase (the people come in langkah 3–4; the seated pair is replaced by
  // Wildan and Andi once they are built, see dropSeated) ----------
  const figure = (color: string, height: number, seated = false) => {
    const g = new THREE.Group();
    const h = seated ? height * 0.72 : height;
    const cap = new THREE.Mesh(new THREE.CapsuleGeometry(0.2, h - 0.62, 4, 12), mat(color, { roughness: 0.6 }));
    cap.position.y = (h - 0.22) / 2;
    const head = new THREE.Mesh(G.sph(0.13, 16, 12), mat("#e7c3a0"));
    head.position.y = h - 0.1;
    g.add(cap, head);
    return g;
  };
  const k8 = new THREE.Group();
  const place = (g: THREE.Group, f: THREE.Group, x: number, z: number, yaw: number, y: number = yF) => {
    f.position.set(x, y, z);
    f.rotation.y = yaw;
    g.add(f);
  };
  for (const s of R.seats)
    place(
      k8,
      figure(s.who === "wildan" ? "#8f6ad8" : "#3f7fc4", 1.72, true),
      lx(R.table.x) - 0.75,
      s.z.pc,
      Math.PI / 2,
      yF + 0.2,
    );
  group.add(k8);
  k8.traverse((c) => ((c as THREE.Mesh).castShadow = false));

  /** The seated stand-ins show from the walk in until Wildan and Andi are built (dropSeated). */
  const setPhase = (phase: "k6" | "k8" | "k91" | "none") => {
    k8.visible = phase !== "none";
  };
  /**
   * What is drawn: the meeting room and the garden behind its window (`room`), the park across the road (`park`:
   * only once the camera, inside, turns to the facade, K8 → K9.1).
   */
  const setView = (roomOn: boolean, parkOn: boolean) => {
    for (const [o, on] of [
      [room, roomOn],
      [garden, roomOn],
      [park, parkOn],
    ] as const)
      o.visible = o.matrixWorldAutoUpdate = on;
  };
  /** Wildan and Andi took their seats (cast/lobbyCast.ts): the seated stand-ins go. */
  const dropSeated = () => {
    for (const f of [...k8.children]) {
      k8.remove(f);
      f.traverse((o) => (o as THREE.Mesh).geometry?.dispose());
    }
  };
  /**
   * Wildan's and Andi's chairs and laptops at their seats for the format (lobbyLayout `seats`); `back` pushes a
   * chair back from the table (m, per seat: Wildan getting up).
   */
  const placeSeats = (fmt: "pc" | "hp", back: readonly number[] = [0, 0]) =>
    R.seats.forEach((s, i) => {
      for (const [k, m] of [seatMeshes[2 * i], seatMeshes[2 * i + 1]].entries()) {
        m.position.set(k === 0 ? -back[i] : 0, 0, s.z[fmt]);
        // (Tint meshes do not update their matrix on their own)
        m.updateMatrix();
        m.updateMatrixWorld();
      }
    });
  setPhase("none");
  setView(false, false);
  return { group, occ, roomDoor, setPhase, setView, setBeams, dropSeated, placeSeats };
}
export type Lobby = ReturnType<typeof buildLobby>;
