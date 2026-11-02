// Nadia (staff): 1.57 m, black hair in a high ponytail with a red scrunchie and side-swept bangs, pink top with
// a band collar and bell sleeves, red waist bag, red-and-pink zigzag trousers, white sneakers.
// Measured on refs/KARKATER/NADIA.png.
import * as THREE from "three";
import { G, mtx } from "../core/kit";
import { weave } from "./atlas";
import type { Figure, Weights } from "./figure";
import { loft } from "./loft";
import { buildMember, frontU, type MemberSpec } from "./member";
import { intersect, sd, subtract, union, type Sdf } from "./sdf";
import { axesY, shirtRings, sleeveRings, WOMAN, zigzag } from "./wardrobe";

const P = {
  skin: "#c98c72",
  hair: "#2b2a2f",
  scrunchie: "#a52a33",
  top: "#d98089",
  topDark: "#b8606a",
  bag: "#ad323c",
  zigA: "#c03f48",
  zigB: "#e98aa2",
  shoe: "#f3eff4",
  sole: "#dcd6de",
  brow: "#26212a",
  lip: "#c0606a",
};

/** Hair pulled back to a high ponytail; bangs swept across the forehead from a part on her right. */
function hairSdf(): Sdf {
  const cap = sd.ellipsoid([0, 1.6, -0.018], [0.18, 0.2, 0.188]);
  // bangs swept down across the forehead from her right
  const bangs = sd.capsule([-0.07, 1.72, 0.11], [0.1, 1.66, 0.125], 0.035);
  // thin locks in front of the ears, down to the jaw
  const sides = (s: number) => sd.capsule([s * 0.138, 1.64, 0.07], [s * 0.148, 1.46, 0.09], 0.018);
  let f: Sdf = union(0.03, cap, bangs, sides(1), sides(-1));
  f = subtract(0.025, f, sd.roundBox([0, 1.5, 0.2], [0.122, 0.165, 0.16], 0.07));
  // pulled back tight: nothing below the ears at the back
  f = intersect(0.02, f, (_x, y, z) => 1.5 - Math.max(0, -z) * 0.4 + Math.max(0, z) * 0.3 - y);
  // ponytail: up from the crown, then down the back
  const tail = union(
    0.03,
    sd.capsule([0, 1.77, -0.1], [0, 1.745, -0.215], 0.055),
    sd.capsule([0, 1.745, -0.215], [0, 1.58, -0.255], 0.05),
    sd.capsule([0, 1.58, -0.255], [0, 1.42, -0.23], 0.038),
    sd.capsule([0, 1.42, -0.23], [0, 1.37, -0.205], 0.018),
  );
  return union(0.02, f, tail);
}

/** The ponytail behind the skull swings on two spring bones; the rest of the hair stays on the head. */
function tailWeights(fig: Figure): Weights {
  const head = fig.rig.index("head"),
    chain = fig.chain(
      [
        ["head", [0, 1.79, -0.2]],
        ["tail1", [0, 1.745, -0.215]],
        ["tail2", [0, 1.58, -0.255]],
      ],
      0.06,
    );
  return (p) => {
    const k = Math.min(1, Math.max(0, (-0.205 - p.z) / 0.03));
    if (k <= 0) return [head, head, 0];
    const [a, b, w] = chain(p);
    return [head, a, k * (1 - w), b, k * w];
  };
}

export const NADIA: MemberSpec = {
  name: "nadia",
  extraJoints: [
    { name: "tail1", parent: "head", at: [0, 1.745, -0.215] },
    { name: "tail2", parent: "tail1", at: [0, 1.58, -0.255] },
    { name: "tailTip", parent: "tail2", at: [0, 1.39, -0.22] },
  ],
  springs: [
    { bone: "tail1", tip: "tail2", stiffness: 1.4, gravity: 0.6, drag: 0.4, radius: 0.045 },
    { bone: "tail2", tip: "tailTip", stiffness: 1.0, gravity: 0.6, drag: 0.4, radius: 0.035 },
  ],
  colliders: [
    { bone: "head", at: [0, 1.6, -0.018], r: 0.19 },
    { bone: "chest", at: [0, 1.33, -0.05], to: [0, 1.15, -0.08], r: 0.1 },
  ],
  height: 1.57,
  body: { ...WOMAN, hip: [0.1, 0.74, 0], knee: [0.1, 0.43, 0.005], ankle: [0.1, 0.1, -0.01] },
  skin: P.skin,
  face: {
    skin: P.skin,
    blush: "rgba(228,112,110,0.34)",
    brow: { y: 1.612, x: 0.075, w: 0.07, thick: 0.009, tilt: 0.03, arch: 0.008, color: P.brow },
    mouth: { y: 1.452, w: 0.08, color: P.lip, lip: "#de8e92" },
  },
  dress(c) {
    const { fig } = c;
    c.soft(
      hairSdf(),
      [-0.24, 1.38, -0.33],
      [0.24, 1.86, 0.23],
      [26, 20],
      c.cell(128, 128, (g, w, h) => weave(g, w, h, P.hair, 0.03, 41), 0.5),
      tailWeights(c.fig),
    );
    // scrunchie round the base of the ponytail
    fig.add(
      new THREE.TorusGeometry(0.052, 0.02, 8, 16).applyMatrix4(mtx([0, 1.772, -0.115], [-0.25, 0, 0])),
      c.cell(64, 64, (g, w, h) => weave(g, w, h, P.scrunchie, 0.1, 42), 0.7),
      "head",
    );
    // ---------- top ----------
    const Y = { y0: 0.72, y1: 1.335 };
    const top = (g: CanvasRenderingContext2D, w: number, h: number) => weave(g, w, h, P.top, 0.05, 43);
    c.torso(
      shirtRings(Y.y0, { w: 0.98, flare: 0.015 }),
      c.cell(512, 256, (g, w, h) => {
        const fx = frontU(w, 0.18),
          fy = axesY(h, Y.y0, Y.y1);
        top(g, w, h);
        g.fillStyle = P.topDark;
        g.fillRect(fx(0) - 1, fy(1.335), 2, h - fy(1.335));
      }),
      [Y.y0, Y.y1],
    );
    fig.add(
      loft(
        [
          { y: 1.315, rx: 0.078, rz: 0.073 },
          { y: 1.36, rx: 0.07, rz: 0.066 },
        ],
        20,
        { caps: false },
      ),
      c.swatch(P.top, 0.8),
      "chest",
    );
    c.arms(sleeveRings(0.058, { bell: 0.03 }), c.cell(128, 128, top, 0.82));
    // ---------- waist bag on a belt ----------
    const bag = c.swatch(P.bag, 0.55);
    fig.add(
      loft(
        [
          { y: 0.785, rx: 0.186, rz: 0.128, z: 0.004 },
          { y: 0.81, rx: 0.186, rz: 0.128, z: 0.004 },
        ],
        24,
        { caps: false },
      ),
      bag,
      "hips",
    );
    fig.add(G.rbox(0.1, 0.07, 0.045, 0.015).applyMatrix4(mtx([0.09, 0.79, 0.14], [0, -0.35, 0])), bag, "hips");
    // ---------- zigzag trousers, sneakers ----------
    c.legs(
      [
        [0, 0.1, 0.104],
        [0.5, 0.1, 0.104],
        [1, 0.104, 0.108],
      ],
      c.cell(256, 256, (g, w, h) => zigzag(g, w, h, 6, 9, P.zigA, P.zigB), 0.85),
      { top: 0.74, hem: 0.1 },
    );
    c.shoes(
      0.27,
      0.15,
      0.1,
      c.cell(
        64,
        64,
        (g, w, h) => {
          g.fillStyle = P.shoe;
          g.fillRect(0, 0, w, h);
          g.fillStyle = P.sole;
          g.fillRect(w * 0.36, 0, w * 0.28, h);
        },
        0.55,
      ),
    );
  },
};

export const buildNadia = (opts: { saver?: boolean } = {}) => buildMember(NADIA, opts);
