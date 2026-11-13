// Greybox of beats 12–13 (tahap 9 langkah 1): COMPANY's classroom behind the front room's back door as coloured
// boxes (floor, walls with the window, TV on its stand with the copy area labelled, 2 × 2 desks with chairs, the
// binder shelf, pendant lamps), stand-ins for Wildan and the four staff, and the holograms over the front room's empty
// desks as plain purple cubes. Built per layout step of the front room (sets/classLayout). The set, the people and
// the holograms themselves come in langkah 2.
import * as THREE from "three";
import { classFrame } from "./classLayout";

function label(text: string, bg: string) {
  const c = document.createElement("canvas");
  c.width = 512;
  c.height = 288;
  const g = c.getContext("2d")!;
  g.fillStyle = bg;
  g.fillRect(0, 0, 512, 288);
  g.strokeStyle = "rgba(0,0,0,.4)";
  g.lineWidth = 8;
  g.strokeRect(4, 4, 504, 280);
  g.fillStyle = "#2a1d4a";
  g.font = "600 38px sans-serif";
  g.textAlign = "center";
  text.split("\n").forEach((l, i, a) => g.fillText(l, 256, 150 + (i - (a.length - 1) / 2) * 50));
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}

export function buildClassroomGrey(step: number) {
  const C = classFrame(step),
    group = new THREE.Group();
  group.name = "classroom-grey";
  const m = (color: string, extra: THREE.MeshStandardMaterialParameters = {}) =>
    new THREE.MeshStandardMaterial({ color, roughness: 0.8, ...extra });
  const box = (w: number, h: number, d: number, color: string, x: number, y: number, z: number) => {
    const b = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), m(color));
    b.position.set(x, y, z);
    b.castShadow = b.receiveShadow = true;
    group.add(b);
    return b;
  };
  const W = C.ixR - C.ixL,
    D = C.back - C.front,
    cx = (C.ixL + C.ixR) / 2,
    cz = (C.back + C.front) / 2,
    H = 3.0;
  // shell: floor (terrazzo cream), walls (warm white), ceiling; the window as a pale orange pane (late sun)
  box(W, 0.02, D, "#efe3d6", cx, 0.01, cz);
  box(W, 0.04, D, "#f5efe9", cx, H, cz);
  box(0.1, H, D, "#f2e7df", C.ixL - 0.05, H / 2, cz);
  box(0.1, H, D, "#f2e7df", C.ixR + 0.05, H / 2, cz);
  box(W, H, 0.1, "#f2e7df", cx, H / 2, C.front - 0.05);
  const w = C.window;
  box(0.04, w.y1 - w.y0, w.z1 - w.z0, "#ffb070", C.ixL + 0.03, (w.y0 + w.y1) / 2, (w.z0 + w.z1) / 2);
  // the TV: stand with wheels, black bezel, white screen with the copy area labelled
  const tv = C.tv;
  box(0.12, tv.y, 0.12, "#3b3d46", tv.x, tv.y / 2, tv.z - 0.05);
  box(0.9, 0.06, 0.55, "#3b3d46", tv.x, 0.06, tv.z - 0.05);
  box(tv.w + 0.12, tv.h + 0.12, 0.08, "#24262e", tv.x, tv.y, tv.z);
  const screen = new THREE.Mesh(
    new THREE.PlaneGeometry(tv.w, tv.h),
    new THREE.MeshBasicMaterial({ map: label("Layar TV\nPraktik naik kelas\n+ isi", "#fbfbfd"), toneMapped: false }),
  );
  screen.position.set(tv.x, tv.y, tv.z + 0.045);
  group.add(screen);
  // desks and orange chairs behind them (the staff face the TV, −z)
  const S = C.deskSize;
  for (const d of C.desks) {
    box(S.w, 0.05, S.d, "#e2c49b", d.x, S.h, d.z);
    for (const sx of [-1, 1]) box(0.05, S.h, S.d - 0.05, "#c9a97f", d.x + sx * (S.w / 2 - 0.04), S.h / 2, d.z);
    box(0.5, 0.45, 0.45, "#ef7f2c", d.x, 0.23, d.z + 0.55);
    box(0.5, 0.45, 0.06, "#ef7f2c", d.x, 0.68, d.z + 0.78);
  }
  // binder shelf on the right wall, a band of colours
  const sh = C.shelf;
  box(0.35, sh.h, sh.z1 - sh.z0, "#c8a77e", sh.x - 0.17, sh.h / 2, (sh.z0 + sh.z1) / 2);
  box(0.03, sh.h - 0.2, sh.z1 - sh.z0 - 0.1, "#6a7ee0", sh.x - 0.36, sh.h / 2, (sh.z0 + sh.z1) / 2);
  // pendant lamps: orange shades over the desks and the front
  for (const [x, z] of [
    [C.desks[0].x, C.desks[0].z],
    [C.desks[1].x, C.desks[1].z],
    [tv.x - 1.4, tv.z + 0.6],
    [tv.x + 1.3, tv.z + 0.6],
  ]) {
    box(0.01, 0.5, 0.01, "#333", x, H - 0.25, z);
    const shade = new THREE.Mesh(new THREE.ConeGeometry(0.28, 0.22, 16, 1, true), m("#f07a2a"));
    shade.position.set(x, H - 0.6, z);
    group.add(shade);
  }
  // stand-ins: the four staff seated at their desks, Wildan standing beside the TV
  const figure = (color: string, h: number, x: number, z: number, seated: boolean) => {
    const f = new THREE.Group();
    const hh = seated ? h * 0.72 : h;
    const cap = new THREE.Mesh(new THREE.CapsuleGeometry(0.19, hh - 0.6, 4, 12), m(color));
    cap.position.y = (hh - 0.22) / 2 + (seated ? 0.2 : 0);
    const head = new THREE.Mesh(new THREE.SphereGeometry(0.13, 16, 12), m("#d9a77c"));
    head.position.y = hh - 0.1 + (seated ? 0.2 : 0);
    f.add(cap, head);
    f.position.set(x, 0, z);
    f.traverse((o) => ((o as THREE.Mesh).castShadow = true));
    group.add(f);
  };
  const colors: Record<string, string> = { sinta: "#e9c25c", nadia: "#f29bb6", bayu: "#6b4a3a", fajar: "#6f8a4e" };
  for (const d of C.desks) figure(colors[d.who], 1.6, d.x, d.z + 0.55, true);
  figure("#8a63d6", 1.77, C.wildan.x, C.wildan.z, false);

  // the holograms over the front room's desks (purple cubes, unlit)
  const holo = new THREE.Group();
  holo.name = "holograms-grey";
  for (const d of C.room.desks) {
    const c = new THREE.Mesh(
      new THREE.BoxGeometry(0.28, 0.28, 0.28),
      new THREE.MeshBasicMaterial({ color: "#b45cff", transparent: true, opacity: 0.85, toneMapped: false }),
    );
    c.position.set(d.x, 1.55, d.z);
    c.rotation.set(0.6, 0.7, 0);
    holo.add(c);
  }
  const dispose = () =>
    [group, holo].forEach((g) =>
      g.traverse((o) => {
        const me = o as THREE.Mesh;
        me.geometry?.dispose();
        const mat = me.material as THREE.MeshBasicMaterial | undefined;
        mat?.map?.dispose();
        mat?.dispose();
      }),
    );
  return { group, holo, step, dispose };
}
export type ClassroomGrey = ReturnType<typeof buildClassroomGrey>;
