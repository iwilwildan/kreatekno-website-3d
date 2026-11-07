// Set A continued (beats 5a–5b), its own chunk, built as the camera nears K4.1: the shophouses from the shoe shop
// to the electronics shop (the fruit shop and the laundry, seen from K1 on, are built with the street), Kreatekno's
// office and the end house, with the pavement, kerb and road running on past them. Master 7 and the team's videos
// K5a.1–K5a.6. The lobby inside Kreatekno is built in tahap 7; here a lit backdrop shows through the glass.
import * as THREE from "three";
import { aoPlane, type AoTarget } from "../core/ao";
import { Batch, C, clean, G, mtx, type Kit } from "../core/kit";
import { END_HOUSE, KREATEKNO, ROW, SHOPS, shopX, STREET_END } from "./rowLayout";
import { buildShop, Tint, type RowMaterials } from "./shop";
import { drawPaveTiles, PAVE_TILE } from "./street";

/** Where the pavement of sets/street.ts (with its own baked AO) ends; the row's pavement starts there. */
const PAVE_FROM = 15;

/** One pavement segment from x0 to x1 (an AO plane), its tiles lined up with the street's. */
function pave(tiles: THREE.Texture, parent: THREE.Object3D, ao: AoTarget[], id: string, x0: number, x1: number) {
  const w = x1 - x0,
    t = tiles.clone();
  t.repeat.set(w / PAVE_TILE.x, 1.2);
  t.offset.set(((x0 + 15) / PAVE_TILE.x) % 1, 0);
  return aoPlane(
    ao,
    id,
    parent,
    w,
    1.7,
    new THREE.MeshStandardMaterial({ map: t, roughness: 0.9 }),
    mtx([x0 + w / 2, 0, 0.85], [-Math.PI / 2, 0, 0]),
    { res: 0.6, maxDist: 1.2, strength: 0.75 },
  );
}

/** The KREATEKNO name in white letters, drawn with the site's display font (falls back to a bold sans). */
function nameTexture(kit: Kit) {
  const fam = getComputedStyle(document.documentElement).getPropertyValue("--font-display").trim() || "sans-serif";
  return kit.canvasTex(1024, 128, (g, w, h) => {
    g.font = `800 100px ${fam}`;
    g.textAlign = "center";
    g.textBaseline = "middle";
    // a darker copy below: the letters read as standing a little off the band
    g.fillStyle = "rgba(60,30,110,.55)";
    g.fillText("KREATEKNO", w / 2 + 3, h / 2 + 6);
    g.fillStyle = "#ffffff";
    g.fillText("KREATEKNO", w / 2, h / 2);
  });
}

export function buildRow(kit: Kit, M: RowMaterials, ao: AoTarget[]) {
  const { mat, canvasTex } = kit;
  const group = new THREE.Group();
  group.name = "row";
  const occ: THREE.BufferGeometry[] = [];
  for (let i = 2; i < SHOPS.length; i++) group.add(buildShop(kit, M, SHOPS[i], i, ao, occ));

  // ---------- Kreatekno ----------
  const K = KREATEKNO,
    kg = new THREE.Group(),
    KB = new Batch(kg),
    KT = new Tint(),
    kx1 = K.x0 + K.w,
    kcx = K.x0 + K.w / 2;
  kg.name = "kreatekno";
  const purple = mat("#7a4cc4", { roughness: 0.7 }),
    purpleL = mat("#9064d6", { roughness: 0.65 }),
    frame = mat("#5e33a6", { roughness: 0.5 }),
    handle = mat("#d8dbe2", { roughness: 0.25, metalness: 0.8 }),
    glassUp = new THREE.MeshStandardMaterial({ color: "#26234a", roughness: 0.35, metalness: 0.2 }),
    glassDown = new THREE.MeshStandardMaterial({
      color: "#3a2f6e",
      roughness: 0.08,
      metalness: 0.3,
      transparent: true,
      opacity: 0.68,
      depthWrite: false,
    });
  // the door: right of the middle, two glass leaves; the right one swings in on its hinge (Heru opens it, K5a.6)
  const D = K.door,
    dx0 = D.cx - D.w / 2,
    dx1 = D.cx + D.w / 2,
    glassX0 = K.x0 + 4.1,
    glassX1 = kx1 - 0.6;
  // body behind, pillars, cornice, the name band
  KB.add(G.box(K.w, K.h, ROW.depth - 2.2), purple, mtx([kcx, K.h / 2, -2.2 - (ROW.depth - 2.2) / 2 - 0.02]), {
    occ: false,
  });
  for (const x of [K.x0 + 0.3, kx1 - 0.3])
    KB.add(G.rbox(0.6, K.h - 0.5, 0.26, 0.06), purpleL, mtx([x, (K.h - 0.5) / 2, 0.08]));
  KB.add(G.rbox(K.w + 0.06, 0.5, 0.42, 0.08), purpleL, mtx([kcx, K.h - 0.25, 0.14]));
  KB.add(G.rbox(K.w, K.band[1] - K.band[0], 0.34, 0.07), purpleL, mtx([kcx, (K.band[0] + K.band[1]) / 2, 0.13]));
  // upstairs: one long window, framed, with mullions and a transom, a pilaster in the middle
  {
    const y0 = K.band[1] + 0.4,
      y1 = K.h - 0.75,
      fx0 = K.x0 + 0.8,
      fx1 = kx1 - 0.8,
      n = 10;
    KB.add(G.box(K.w - 1.2, K.h - K.band[1], 0.1), purple, mtx([kcx, (K.band[1] + K.h) / 2, -0.06]));
    KB.add(G.box(fx1 - fx0, y1 - y0, 0.04), glassUp, mtx([kcx, (y0 + y1) / 2, 0.0]), { occ: false });
    for (const y of [y0, y1, y1 - 0.55]) KB.add(G.box(fx1 - fx0, 0.1, 0.12), frame, mtx([kcx, y, 0.05]));
    for (let k = 0; k <= n; k++)
      KB.add(G.box(0.09, y1 - y0, 0.12), frame, mtx([fx0 + ((fx1 - fx0) * k) / n, (y0 + y1) / 2, 0.05]));
    KB.add(G.rbox(0.28, y1 - y0 + 0.3, 0.22, 0.05), purpleL, mtx([kcx, (y0 + y1) / 2, 0.1]));
  }
  // downstairs: the solid wall with the plaque and lamp on the left, then the glass shop front with the door
  {
    KB.add(
      G.box(glassX0 - (K.x0 + 0.6), K.band[0], 0.3),
      purple,
      mtx([(K.x0 + 0.6 + glassX0) / 2, K.band[0] / 2, -0.13]),
    );
    KB.add(G.box(K.w - 1.2, 0.18, 0.34), frame, mtx([kcx, 0.09, -0.1]));
    const top = D.h + 0.05;
    for (const y of [top, K.band[0] - 0.08])
      KB.add(G.box(glassX1 - glassX0, 0.1, 0.14), frame, mtx([(glassX0 + glassX1) / 2, y, -0.05]));
    for (const x of [glassX0, (glassX0 + dx0) / 2, dx0, dx1, (dx1 + glassX1) / 2, glassX1])
      KB.add(G.box(0.1, K.band[0], 0.14), frame, mtx([x, K.band[0] / 2, -0.05]));
    // fixed glass either side of the door and the transom above it
    for (const [a, b] of [
      [glassX0, dx0],
      [dx1, glassX1],
    ])
      KB.add(G.box(b - a, K.band[0], 0.02), glassDown, mtx([(a + b) / 2, K.band[0] / 2, -0.06]), {
        occ: false,
        shadow: false,
      });
    KB.add(G.box(D.w, K.band[0] - top, 0.02), glassDown, mtx([D.cx, (top + K.band[0]) / 2, -0.06]), {
      occ: false,
      shadow: false,
    });
    // plaque (its face left empty for beat 9b) and the brass lamp above it
    const pq = K.plaque;
    KT.add(G.rbox(pq.w + 0.12, pq.h + 0.12, 0.07, 0.03), "#b97a45", mtx([pq.cx, pq.y, 0.06]));
    KT.add(G.box(pq.w, pq.h, 0.04), "#f4ead6", mtx([pq.cx, pq.y, 0.09]));
    KT.add(G.box(0.05, 0.05, 0.32), "#c8963c", mtx([pq.cx, pq.y + 0.8, 0.14]));
    KT.add(G.cyl(0.05, 0.15, 0.2, 16), "#d8a84a", mtx([pq.cx, pq.y + 0.68, 0.3]));
    KT.add(G.sph(0.05, 10, 8), "#fff4cc", mtx([pq.cx, pq.y + 0.58, 0.3]));
    // the lobby through the glass (built in tahap 7): a lit back wall with the corkboard facing the door
    const lobby = canvasTex(512, 160, (g, w, h) => {
      const gr = g.createLinearGradient(0, 0, 0, h);
      gr.addColorStop(0, "#efe7f7");
      gr.addColorStop(1, "#d7c9ea");
      g.fillStyle = gr;
      g.fillRect(0, 0, w, h);
      g.fillStyle = "#c69a6a";
      g.fillRect(w * ((D.cx - glassX0) / (glassX1 - glassX0) - 0.08), h * 0.22, w * 0.16, h * 0.36);
      g.fillStyle = "#b7a3d6";
      g.fillRect(0, h * 0.86, w, h * 0.14);
    });
    const back = new THREE.Mesh(
      new THREE.PlaneGeometry(glassX1 - glassX0, K.band[0]),
      new THREE.MeshStandardMaterial({
        map: lobby,
        roughness: 0.9,
        emissive: "#ffffff",
        emissiveMap: lobby,
        emissiveIntensity: 0.2,
      }),
    );
    back.position.set((glassX0 + glassX1) / 2, K.band[0] / 2, -2.2);
    kg.add(back);
    KT.add(G.box(glassX1 - glassX0, 0.02, 2.2), "#cdbfe0", mtx([(glassX0 + glassX1) / 2, 0.01, -1.1]));
  }
  {
    const name = new THREE.Mesh(
      new THREE.PlaneGeometry(4.6, 0.575),
      new THREE.MeshStandardMaterial({ map: nameTexture(kit), transparent: true, roughness: 0.5, depthWrite: false }),
    );
    name.position.set(kcx + 0.15, (K.band[0] + K.band[1]) / 2, 0.31);
    kg.add(name);
  }
  // door leaves: the left one fixed, the right one on a hinge at the door's right edge
  const doorHinge = new THREE.Group();
  {
    const leaf = (parent: THREE.Object3D, x0: number, w: number, handleAt: number) => {
      const LB = new Batch(parent);
      for (const [cx, cy, ww, hh] of [
        [x0 + 0.04, D.h / 2, 0.08, D.h],
        [x0 + w - 0.04, D.h / 2, 0.08, D.h],
        [x0 + w / 2, D.h - 0.05, w, 0.1],
        [x0 + w / 2, 0.06, w, 0.12],
      ])
        LB.add(G.box(ww, hh, 0.06), frame, mtx([cx, cy, 0]));
      LB.add(G.box(0.03, 0.5, 0.03), handle, mtx([handleAt, 1.05, 0.06]));
      LB.add(G.box(w - 0.12, D.h - 0.2, 0.02), glassDown, mtx([x0 + w / 2, D.h / 2 + 0.01, 0]), {
        occ: false,
        shadow: false,
      });
      LB.build();
    };
    const fixed = new THREE.Group();
    leaf(fixed, dx0, D.w / 2, dx0 + D.w / 2 - 0.14);
    kg.add(fixed);
    doorHinge.position.set(dx1, 0, -0.04);
    leaf(doorHinge, -D.w / 2, D.w / 2, -D.w / 2 + 0.14);
    kg.add(doorHinge);
  }
  KB.build();
  occ.push(...KB.occ);
  const kt = KT.mesh(M.tint);
  kt.castShadow = false;
  kg.add(kt);
  group.add(kg);

  // ---------- the end house: pale blue-grey, a balcony upstairs, a rolling shutter below ----------
  {
    const E = END_HOUSE,
      eg = new THREE.Group(),
      EB = new Batch(eg),
      ex1 = E.x0 + E.w,
      ecx = E.x0 + E.w / 2,
      body = mat("#d3dae6"),
      trimE = mat("#e7ecf3"),
      dark = mat("#4b5466", { roughness: 0.3, metalness: 0.2 });
    eg.name = "end-house";
    EB.add(G.box(E.w, E.h, ROW.depth), body, mtx([ecx, E.h / 2, -ROW.depth / 2 - 0.02]));
    for (const x of [E.x0 + 0.3, ex1 - 0.3])
      EB.add(G.rbox(0.6, E.h - 0.4, 0.2, 0.05), trimE, mtx([x, (E.h - 0.4) / 2, 0.06]));
    EB.add(G.rbox(E.w + 0.04, 0.4, 0.38, 0.07), trimE, mtx([ecx, E.h - 0.2, 0.12]));
    EB.add(G.rbox(E.w, 0.36, 0.3, 0.06), trimE, mtx([ecx, 3.25, 0.1]));
    EB.add(G.rbox(E.w - 1.3, 0.3, 0.3, 0.05), trimE, mtx([ecx, 2.95, 0.08]));
    const shutter = canvasTex(64, 256, (g, w, h) => {
      g.fillStyle = "#dfe4ec";
      g.fillRect(0, 0, w, h);
      g.fillStyle = "rgba(90,100,120,.28)";
      for (let y = 0; y < h; y += 8) g.fillRect(0, y, w, 2);
    });
    const sh = new THREE.Mesh(
      new THREE.PlaneGeometry(E.w - 1.6, 2.8),
      new THREE.MeshStandardMaterial({ map: shutter, roughness: 0.55, metalness: 0.3 }),
    );
    sh.position.set(ecx, 1.4, 0.01);
    sh.receiveShadow = true;
    eg.add(sh);
    // balcony: slab, rail and balusters, the glass door and window behind it
    EB.add(G.box(E.w - 1.2, 2.2, 0.04), dark, mtx([ecx, 5.35, 0.02]), { occ: false });
    for (const x of [ecx - 0.9, ecx + 0.9]) EB.add(G.box(0.08, 2.2, 0.08), trimE, mtx([x, 5.35, 0.05]));
    EB.add(G.box(E.w - 0.9, 0.14, 0.9), trimE, mtx([ecx, 4.2, 0.45]));
    EB.add(G.box(E.w - 0.9, 0.08, 0.08), trimE, mtx([ecx, 5.15, 0.86]));
    for (let k = 0; k <= 22; k++)
      EB.add(G.box(0.05, 0.86, 0.05), trimE, mtx([E.x0 + 0.5 + (k * (E.w - 1.0)) / 22, 4.7, 0.86]));
    EB.build();
    occ.push(...EB.occ);
    group.add(eg);
  }

  // ---------- pavement, kerb, road on past the street set ----------
  {
    const tiles = canvasTex(512, 512, drawPaveTiles);
    tiles.wrapS = tiles.wrapT = THREE.RepeatWrapping;
    const cuts = [
      PAVE_FROM,
      ...SHOPS.slice(2).map((_, k) => shopX(k + 2).x0 - ROW.gap / 2),
      KREATEKNO.x0 - ROW.gap / 2,
      END_HOUSE.x0 - ROW.gap / 2,
      END_HOUSE.x0 + END_HOUSE.w + ROW.gap / 2,
      STREET_END,
    ];
    const pv = new THREE.Group();
    for (let k = 0; k < cuts.length - 1; k++) {
      const m = pave(tiles, pv, ao, `row-pave-${k}`, cuts[k], cuts[k + 1]);
      occ.push(clean(m.geometry).applyMatrix4(m.matrix));
    }
    group.add(pv);
    const SB = new Batch(group),
      L = STREET_END - PAVE_FROM;
    // the kerb starts under the rounded end of the street's (a hair lower, so the joint shows no notch)
    SB.add(G.rbox(L + 1, 0.178, 0.3, 0.05), mat(C.curb), mtx([PAVE_FROM - 1 + (L + 1) / 2, -0.071, 1.82]), {
      occ: false,
    });
    // the road box of sets/street.ts reaches x 30, its centre dashes 29.8
    SB.add(
      G.box(STREET_END - 30, 0.1, 30),
      mat(C.road, { roughness: 0.95 }),
      mtx([(30 + STREET_END) / 2, -0.2, 18.2]),
      {
        occ: false,
      },
    );
    SB.add(G.box(STREET_END - 30, 0.15, 3), mat(C.pave), mtx([(30 + STREET_END) / 2, -0.075, 13.6]), { occ: false });
    const dash = mat("#f6f4f2", { roughness: 0.6 });
    for (let x = -28 + 18 * 3.4; x < STREET_END; x += 3.4)
      SB.add(G.box(1.8, 0.01, 0.1), dash, mtx([x, -0.145, 3.3]), { occ: false, shadow: false });
    SB.build();
  }
  return { group, occ, doorHinge };
}
export type Row = ReturnType<typeof buildRow>;
