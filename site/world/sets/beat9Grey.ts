// Greybox of beats 9b–11 (tahap 8 langkah 1): stand-ins for Heru, Bu Dewi and Wildan walking from Kreatekno to
// COMPANY, and the plaque's two copy areas, labelled. Replaced by the people themselves and the HTML copy in
// langkah 2–3.
import * as THREE from "three";
import { KREATEKNO } from "./rowLayout";
import { PLAQUE_COLS } from "../takes/home/beat9";

function label(text: string, color: string) {
  const c = document.createElement("canvas");
  c.width = 512;
  c.height = 512;
  const g = c.getContext("2d")!;
  g.fillStyle = color;
  g.fillRect(0, 0, 512, 512);
  g.strokeStyle = "rgba(0,0,0,.45)";
  g.lineWidth = 10;
  g.strokeRect(5, 5, 502, 502);
  g.fillStyle = "#2a1d4a";
  g.font = "600 44px sans-serif";
  g.textAlign = "center";
  text.split("\n").forEach((l, i, a) => g.fillText(l, 256, 256 + (i - (a.length - 1) / 2) * 58));
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}

export function buildBeat9Grey() {
  const group = new THREE.Group();
  group.name = "beat9-grey";
  // the three: Heru 1.8 m (purple jacket), Bu Dewi 1.6 m (cream tunic), Wildan 1.77 m (purple shirt, white trousers)
  const who = [
    { body: "#5b3aa8", h: 1.8 },
    { body: "#efe3cc", h: 1.6 },
    { body: "#8a63d6", h: 1.77 },
  ];
  const people = who.map(({ body, h }) => {
    const f = new THREE.Group();
    const cap = new THREE.Mesh(
      new THREE.CapsuleGeometry(0.2, h - 0.62, 4, 12),
      new THREE.MeshStandardMaterial({ color: body, roughness: 0.6 }),
    );
    cap.position.y = (h - 0.22) / 2;
    const head = new THREE.Mesh(
      new THREE.SphereGeometry(0.13, 16, 12),
      new THREE.MeshStandardMaterial({ color: "#d9a77c", roughness: 0.6 }),
    );
    head.position.y = h - 0.1;
    cap.castShadow = head.castShadow = true;
    f.add(cap, head);
    group.add(f);
    return f;
  });
  // the plaque's copy areas, a few mm in front of its face (z 0.11)
  const P = KREATEKNO.plaque;
  const areas = PLAQUE_COLS.map((c, i) => {
    const m = new THREE.Mesh(
      new THREE.PlaneGeometry(c.w - 0.06, P.h - 0.06),
      new THREE.MeshBasicMaterial({
        map: label(
          i === 0 ? "Kolom 1\nTentang Kreatekno\n+ paragraf" : "Kolom 2\n4 fakta\n+ Kenali kami",
          i === 0 ? "#f6e7b8" : "#d8ecf6",
        ),
        transparent: true,
        opacity: 0.85,
        toneMapped: false,
      }),
    );
    m.position.set(c.cx, P.y, 0.115);
    group.add(m);
    return m;
  });
  /** Puts the three where trioAt says (null: hidden). */
  const place = (at: { x: number; z: number }[] | null) => {
    people.forEach((f, i) => {
      f.visible = !!at;
      if (at) f.position.set(at[i].x, 0, at[i].z);
    });
  };
  const dispose = () =>
    group.traverse((o) => {
      const m = o as THREE.Mesh;
      m.geometry?.dispose();
      const mat = m.material as THREE.MeshBasicMaterial | undefined;
      mat?.map?.dispose();
      mat?.dispose();
    });
  place(null);
  return { group, place, areas, dispose };
}
