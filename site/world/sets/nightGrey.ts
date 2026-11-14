// Greybox of beats 14–16 (tahap 10 langkah 1): the night street as stand-ins. The billboard's face lit white with the
// CTA's copy area labelled and a grey rolling door shut over each shop's opening of the row. The lit billboard, the rolling doors, the roof lamps and the stars themselves come in langkah 2.
import * as THREE from "three";
import { billboardFace } from "./street";
import { ROW, SHOPS, shopX } from "./rowLayout";

function label(text: string, bg: string, w = 512, h = 288) {
  const c = document.createElement("canvas");
  c.width = w;
  c.height = h;
  const g = c.getContext("2d")!;
  g.fillStyle = bg;
  g.fillRect(0, 0, w, h);
  g.strokeStyle = "rgba(60,40,120,.55)";
  g.lineWidth = 6;
  g.setLineDash([18, 12]);
  g.strokeRect(6, 6, w - 12, h - 12);
  g.fillStyle = "#2a1d4a";
  g.font = `600 ${Math.round(h / 7.5)}px sans-serif`;
  g.textAlign = "center";
  text.split("\n").forEach((l, i, a) => g.fillText(l, w / 2, h / 2 + 12 + (i - (a.length - 1) / 2) * (h / 5.6)));
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}

export function buildNightGrey() {
  const group = new THREE.Group();
  group.name = "night-grey";
  const f = billboardFace();
  // the billboard's face, lit (unlit material, white), its copy areas labelled: 16:9 title above, paragraph and
  // buttons below; 9:16 the title across it
  const face = new THREE.Mesh(
    new THREE.PlaneGeometry(2 * f.hw, 2 * f.hh),
    new THREE.MeshBasicMaterial({
      map: label("CTA billboard\njudul (atas)\nisi + 2 tombol (bawah)", "#fbfaff", 1024, 458),
      toneMapped: false,
    }),
  );
  face.position.set(f.cx, f.cy, f.z + 0.002);
  group.add(face);
  // the rolling doors, shut over each shop's opening
  const doorMat = new THREE.MeshStandardMaterial({ color: "#8d93a6", roughness: 0.7 });
  const door = new THREE.BoxGeometry(ROW.opening.w, ROW.opening.h, 0.06);
  SHOPS.forEach((_, i) => {
    const m = new THREE.Mesh(door, doorMat);
    m.position.set(shopX(i).cx, ROW.opening.h / 2, 0.05);
    group.add(m);
  });
  group.visible = false;
  return {
    group,
    setNight: (k: number) => (group.visible = k > 0.01),
    dispose: () =>
      group.traverse((o) => {
        const m = o as THREE.Mesh;
        if (!m.isMesh) return;
        m.geometry.dispose();
        const mt = m.material as THREE.MeshBasicMaterial;
        mt.map?.dispose();
        mt.dispose();
      }),
  };
}
