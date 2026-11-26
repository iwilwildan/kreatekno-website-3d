// The Solutions boxes served on the counter: a rounded box in the team colour with its status badge, hopping up
// from under the counter (behind the cashier) and back. Layout, flight, tags and summary: world/meja/kotak.ts.
import * as THREE from "three";
import { RoundedBoxGeometry } from "three/addons/geometries/RoundedBoxGeometry.js";
import { STATUS } from "@/content/solusi/taksonomi";
import { buildDeskObjects } from "../meja/kotak";

export type SearchBoxInput = { id: string; color: string; status: keyof typeof STATUS };

// v1 13 Nov: same proportions as the shelf boxes (216 x 305 x 64 px). Site z = v1 z - 1.9.
export const BOX = { w: 0.5, h: 0.706, d: 0.148 };
const START = new THREE.Vector3(1.95, 0.45, -2.25);
const RETURN = new THREE.Vector3(1.95, 0.5, -2.3);

/**
 * Status badge (white pill, coloured dot, label) drawn once per status on a canvas, at twice the v1
 * resolution (512 x 112) so it stays sharp on dense screens; redrawn once the web font is ready.
 */
function badgeTexture(label: string, dot: string) {
  const c = document.createElement("canvas");
  c.width = 512;
  c.height = 112;
  const g = c.getContext("2d");
  const texture = new THREE.CanvasTexture(c);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = 4;
  const family =
    getComputedStyle(document.body).getPropertyValue("--font-jakarta").trim() || '"Plus Jakarta Sans", system-ui';
  const draw = () => {
    if (!g) return;
    g.clearRect(0, 0, 512, 112);
    g.fillStyle = "#fff";
    g.beginPath();
    g.roundRect(0, 0, 512, 112, 56);
    g.fill();
    g.fillStyle = dot;
    g.beginPath();
    g.arc(60, 56, 18, 0, Math.PI * 2);
    g.fill();
    // v1 draws 26 px on a 256 px pill; shrink only if a label would not fit the pill
    let size = 52;
    g.font = "700 " + size + "px " + family;
    const room = 512 - 100 - 24;
    if (g.measureText(label).width > room) {
      size = Math.floor((size * room) / g.measureText(label).width);
      g.font = "700 " + size + "px " + family;
    }
    g.fillStyle = "#131951";
    g.textBaseline = "middle";
    g.fillText(label, 100, 60);
    texture.needsUpdate = true;
  };
  draw();
  document.fonts?.load("700 52px " + family).then(draw, () => {});
  return texture;
}

export function buildSearchBoxes(scene: THREE.Scene) {
  const geometry = new RoundedBoxGeometry(BOX.w, BOX.h, BOX.d, 3, 0.014);
  const locale = document.documentElement.lang.startsWith("en") ? "en" : "id";
  const badgeTextures = {
    jalan: badgeTexture(STATUS.jalan[locale], "#06606C"),
    ide: badgeTexture(STATUS.ide[locale], "#5B1BB5"),
  };
  const badgeMaterials = {
    jalan: new THREE.MeshBasicMaterial({ map: badgeTextures.jalan, transparent: true }),
    ide: new THREE.MeshBasicMaterial({ map: badgeTextures.ide, transparent: true }),
  };
  const badgeW = BOX.w * 0.5;
  const badgeH = (badgeW * 56) / 256;
  const badgeGeometry = new THREE.PlaneGeometry(badgeW, badgeH);
  const bodyMaterials: THREE.MeshStandardMaterial[] = [];

  return buildDeskObjects<SearchBoxInput>(scene, {
    size: BOX,
    make() {
      const group = new THREE.Group();
      const material = new THREE.MeshStandardMaterial({ color: "#ad96dd", roughness: 0.6, metalness: 0 });
      bodyMaterials.push(material);
      const body = new THREE.Mesh(geometry, material);
      const badge = new THREE.Mesh(badgeGeometry, badgeMaterials.jalan);
      badge.position.set(-BOX.w / 2 + 0.037 + badgeW / 2, BOX.h / 2 - 0.037 - badgeH / 2, BOX.d / 2 + 0.002);
      group.add(body, badge);
      return {
        group,
        body,
        set(input) {
          material.color.set(input.color);
          badge.material = badgeMaterials[input.status] ?? badgeMaterials.jalan;
        },
      };
    },
    from: () => START,
    back: () => RETURN,
    delay: (index) => 0.42 + index * 0.15,
    duration: 0.56,
    arc: 0.55,
    backDuration: 0.46,
    backArc: 0.35,
    tag: "[data-box-tag]",
    summary: "[data-box-summary]",
    dispose() {
      geometry.dispose();
      badgeGeometry.dispose();
      for (const m of Object.values(badgeMaterials)) m.dispose();
      for (const t of Object.values(badgeTextures)) t.dispose();
      for (const m of bodyMaterials) m.dispose();
    },
  });
}
