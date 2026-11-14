// COMPANY's classroom behind the front room's wooden back door (tahap 9, beats 12–13; the team's continuation video
// 28–31 s), its own chunk: a small warm room lit by the late sun through a wide window on the left, a TV on a wheeled
// stand at the front (white screen: the practice copy is HTML on it), four small desks 2 × 2 with orange chairs, a
// shelf of coloured binders on the right wall, orange skirting, pendant lamps with orange shades. Laid out per layout
// step of the front room (sets/classLayout). The staff and Wildan are the cast themselves (world/index.ts). Most of it
// is one vertex-coloured mesh; the screen, the window's sunset and the lamps' bulbs are unlit, so it draws in four
// calls. The holograms over the front room's desks (sets/holograms) ride in the same chunk.
import * as THREE from "three";
import { Batch, G, mtx, rng, type Kit } from "../core/kit";
import { classFrame, CLASS } from "./classLayout";
import { Tint } from "./shop";

export { buildHolograms } from "./holograms";

const BINDERS = ["#6c7be0", "#e9c94a", "#5fc4c9", "#ef6f9e", "#9b7be0", "#5aa36a", "#f08a3c"];

export function buildClassroom(kit: Kit, step: number) {
  const C = classFrame(step),
    group = new THREE.Group();
  group.name = "classroom";
  const T = new Tint(),
    U = new Batch(group),
    r = rng(331 + step);
  const W = C.ixR - C.ixL,
    D = C.back - C.front,
    cx = (C.ixL + C.ixR) / 2,
    cz = (C.back + C.front) / 2,
    H = CLASS.ceil;
  const wall = "#f4e9e2",
    orange = "#ee7d2e",
    wood = "#e3c49b",
    woodDark = "#c49e72";
  // ---------- shell ----------
  T.add(G.box(W, 0.02, D), "#efe3d7", mtx([cx, 0.01, cz]));
  T.add(G.box(W, 0.04, D), "#f8f2ed", mtx([cx, H + 0.02, cz]));
  T.add(G.box(W, H, 0.08), wall, mtx([cx, H / 2, C.front - 0.04]));
  // the right wall, the left wall round the window (below, above, either side)
  T.add(G.box(0.08, H, D), wall, mtx([C.ixR + 0.04, H / 2, cz]));
  const w = C.window;
  for (const [y0, y1, z0, z1] of [
    [0, w.y0, C.front, C.back],
    [w.y1, H, C.front, C.back],
    [w.y0, w.y1, C.front, w.z0],
    [w.y0, w.y1, w.z1, C.back],
  ])
    T.add(G.box(0.08, y1 - y0, z1 - z0), wall, mtx([C.ixL - 0.04, (y0 + y1) / 2, (z0 + z1) / 2]));
  // orange skirting round the room
  T.add(G.box(W, 0.1, 0.03), orange, mtx([cx, 0.05, C.front + 0.015]));
  for (const x of [C.ixL + 0.015, C.ixR - 0.015]) T.add(G.box(0.03, 0.1, D), orange, mtx([x, 0.05, cz]));
  // ---------- the window: orange frame, mullions, a sill; the late sky beyond (unlit) ----------
  {
    const wz = (w.z0 + w.z1) / 2,
      wl = w.z1 - w.z0,
      wh = w.y1 - w.y0,
      x = C.ixL + 0.02;
    for (const y of [w.y0, w.y1]) T.add(G.box(0.1, 0.07, wl + 0.07), orange, mtx([x, y, wz]));
    for (const z of [w.z0, w.z1, wz]) T.add(G.box(0.1, wh, 0.06), orange, mtx([x, (w.y0 + w.y1) / 2, z]));
    T.add(G.box(0.18, 0.04, wl + 0.1), "#f6efe8", mtx([x + 0.05, w.y0 - 0.04, wz]));
    const sky = kit.canvasTex(16, 256, (g, cw, ch) => {
      const gr = g.createLinearGradient(0, 0, 0, ch);
      gr.addColorStop(0, "#f7a37c");
      gr.addColorStop(0.45, "#ffc277");
      gr.addColorStop(0.7, "#ffd894");
      gr.addColorStop(1, "#e8a26f");
      g.fillStyle = gr;
      g.fillRect(0, 0, cw, ch);
    });
    U.add(
      new THREE.PlaneGeometry(wl, wh),
      new THREE.MeshBasicMaterial({ map: sky, toneMapped: false }),
      mtx([C.ixL - 0.06, (w.y0 + w.y1) / 2, wz], [0, Math.PI / 2, 0]),
      { occ: false, shadow: false },
    );
  }
  // ---------- the TV on its wheeled stand ----------
  const tv = C.tv;
  T.add(G.box(0.1, tv.y - 0.1, 0.08), "#3a3c45", mtx([tv.x, (tv.y - 0.1) / 2 + 0.08, tv.z - 0.08]));
  T.add(G.box(0.95, 0.05, 0.5), "#3a3c45", mtx([tv.x, 0.09, tv.z - 0.08]));
  for (const sx of [-0.42, 0.42])
    for (const sz of [-0.2, 0.2])
      T.add(G.cyl(0.035, 0.035, 0.03, 10), "#1f2128", mtx([tv.x + sx, 0.035, tv.z - 0.08 + sz], [Math.PI / 2, 0, 0]));
  T.add(G.rbox(tv.w + 0.1, tv.h + 0.1, 0.07, 0.02), "#1f2128", mtx([tv.x, tv.y, tv.z]));
  U.add(
    new THREE.PlaneGeometry(tv.w, tv.h),
    new THREE.MeshBasicMaterial({ color: "#fbfbfd", toneMapped: false }),
    mtx([tv.x, tv.y, tv.z + 0.037]),
    { occ: false, shadow: false },
  );
  // ---------- desks and chairs (the staff face the TV, −z) ----------
  const S = C.deskSize;
  for (const d of C.desks) {
    T.add(G.rbox(S.w, 0.04, S.d, 0.01), wood, mtx([d.x, S.h - 0.02, d.z]));
    for (const sx of [-1, 1])
      for (const sz of [-1, 1])
        T.add(
          G.box(0.04, S.h - 0.04, 0.04),
          woodDark,
          mtx([d.x + sx * (S.w / 2 - 0.05), (S.h - 0.04) / 2, d.z + sz * (S.d / 2 - 0.05)]),
        );
    // a notebook and a pen on each desk
    T.add(G.box(0.24, 0.012, 0.32), "#fbf8f2", mtx([d.x - 0.18, S.h + 0.006, d.z + 0.02], [0, 0.15 - r() * 0.3, 0]));
    const cz2 = d.z + S.d / 2 + 0.28;
    T.add(G.rbox(0.46, 0.06, 0.44, 0.02), "#f07c2c", mtx([d.x, 0.46, cz2]));
    T.add(G.rbox(0.46, 0.42, 0.05, 0.02), "#f07c2c", mtx([d.x, 0.72, cz2 + 0.22], [-0.08, 0, 0]));
    for (const sx of [-0.19, 0.19])
      for (const sz of [-0.17, 0.17]) T.add(G.box(0.03, 0.44, 0.03), "#5b4a3e", mtx([d.x + sx, 0.22, cz2 + sz]));
  }
  // ---------- the binder shelf on the right wall ----------
  {
    const sh = C.shelf,
      sz = (sh.z0 + sh.z1) / 2,
      sl = sh.z1 - sh.z0,
      x = sh.x - 0.16,
      rows = 4;
    T.add(G.box(0.34, sh.h, 0.04), woodDark, mtx([x, sh.h / 2, sh.z0]));
    T.add(G.box(0.34, sh.h, 0.04), woodDark, mtx([x, sh.h / 2, sh.z1]));
    T.add(G.box(0.02, sh.h, sl), wood, mtx([x + 0.16, sh.h / 2, sz]));
    for (let k = 0; k <= rows; k++) {
      const y = 0.06 + (k * (sh.h - 0.1)) / rows;
      T.add(G.box(0.34, 0.03, sl), woodDark, mtx([x, y, sz]));
      if (k === rows) break;
      // binders standing on the board, spines to the room
      let z = sh.z0 + 0.06;
      while (z < sh.z1 - 0.1) {
        const bw = 0.06 + r() * 0.03,
          bh = (sh.h - 0.1) / rows - 0.08 - r() * 0.04;
        T.add(
          G.box(0.28, bh, bw),
          BINDERS[Math.floor(r() * BINDERS.length)],
          mtx([x - 0.01, y + 0.015 + bh / 2, z + bw / 2]),
        );
        z += bw + 0.01;
      }
    }
  }
  // ---------- pendant lamps: cords, orange shades, warm bulbs ----------
  const bulbs = new THREE.MeshBasicMaterial({ color: "#ffe2a8", toneMapped: false });
  for (const [x, z] of [
    [C.desks[2].x, C.desks[2].z],
    [C.desks[3].x, C.desks[3].z],
    [tv.x - 1.6, C.front + 1.1],
    [tv.x + 1.3, C.front + 1.1],
  ]) {
    T.add(G.box(0.012, 0.55, 0.012), "#2e2e33", mtx([x, H - 0.27, z]));
    T.add(G.cyl(0.06, 0.24, 0.2, 18, true), orange, mtx([x, H - 0.64, z]));
    U.add(G.sph(0.05, 10, 8), bulbs, mtx([x, H - 0.72, z]), { occ: false, shadow: false });
  }
  U.build();
  const mesh = T.mesh(new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 0.8 }));
  mesh.name = "classroom-body";
  group.add(mesh);
  return { group, step };
}
export type Classroom = ReturnType<typeof buildClassroom>;
