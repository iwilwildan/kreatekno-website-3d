// Heru (Kreatekno): 1.80 m, chin-length wavy black hair with a side part, thin moustache and chin beard,
// purple blazer open over a white tee, purple lanyard with an ID card, black crossbody bag, dark grey trousers
// and shoes. Measured on refs/KARKATER/heru.png (front, side, back).
import { G, mtx, type Vec3 } from "../core/kit";
import { weave } from "./atlas";
import { ribbon, SIDES, type Body } from "./body";
import type { FaceSpec } from "./face";
import type { Weights } from "./figure";
import { loft } from "./loft";
import { buildMember, frontU, type Ctx, type MemberSpec } from "./member";
import { sd, subtract, union, type Sdf } from "./sdf";

export const HERU: Body = {
  crown: 1.765,
  chin: 1.379,
  headRx: 0.146,
  headRz: 0.15,
  faceZ: 0.165,
  eye: { y: 1.552, x: 0.069, rx: 0.0175, ry: 0.0235 },
  nose: { y: 1.5, r: 0.021 },
  ear: { y: 1.525, x: 0.138, h: 0.1 },
  neck: { y0: 1.29, y1: 1.41, r: 0.062 },
  shoulder: [0.18, 1.228, 0],
  elbow: [0.232, 0.99, -0.01],
  wrist: [0.262, 0.735, 0.005],
  hip: [0.096, 0.74, 0],
  knee: [0.096, 0.43, 0.005],
  ankle: [0.096, 0.1, -0.01],
  hipsY: 0.8,
  spineY: 0.95,
  chestY: 1.12,
  hand: { len: 0.18, w: 0.094 },
};

const P = {
  skin: "#b8754f",
  hair: "#3b3842",
  blazer: "#5c3e9a",
  blazerDark: "#4b3182",
  tee: "#f1eef2",
  trousers: "#47464f",
  shoe: "#4d4b56",
  sole: "#5f5c68",
  lanyard: "#6a46aa",
  bag: "#3a3740",
  metal: "#b9b8c4",
  brow: "#2a2222",
  lip: "#8e4a3c",
};

export function heruFace(): Omit<FaceSpec, "box"> {
  const b = HERU;
  return {
    skin: P.skin,
    blush: "rgba(214,112,92,0.22)",
    brow: { y: 1.606, x: 0.078, w: 0.074, thick: 0.017, tilt: -0.05, arch: 0.006, color: P.brow },
    mouth: { y: 1.452, w: 0.104, color: P.lip, lip: "#c47a66" },
    beard: { color: "#3a2a25", mustache: true, chin: { y: b.chin + 0.028, w: 0.062, h: 0.05 }, stubble: 0.45 },
  };
}

/**
 * Hair: a full cap widest at the temples and a fringe swept from a side part. Behind the ears the hair is one
 * shell that falls to the nape and flares out like a bell, with shallow strand grooves flowing down from the
 * crown and flat, scalloped lock ends (turnaround back and side views). Cut away over the face, the temples
 * and the ears.
 */
const LOCKS = 9,
  SWIRL = 0.35,
  HAIR_BOX = { x0: -0.24, x1: 0.24, y0: 1.37, y1: 1.83 };

/**
 * Hair texture, front-projected like the hair mesh: the strand grooves of hairSdf painted as soft dark lines
 * with a lighter ridge between them, so the locks read without AO.
 */
function paintHair(g: CanvasRenderingContext2D, w: number, h: number, B: typeof HAIR_BOX) {
  const px = (x: number) => ((x - B.x0) / (B.x1 - B.x0)) * w,
    py = (y: number) => ((B.y1 - y) / (B.y1 - B.y0)) * h;
  weave(g, w, h, P.hair, 0.02, 7);
  g.lineCap = "round";
  const m2px = w / (B.x1 - B.x0);
  for (let m = 0; m < LOCKS; m++) {
    // grooves sit where the strand pattern peaks: a = (2m + 1)π / LOCKS, drifting with the swirl as they fall;
    // seen from behind they fan out from the crown and flare at the ends. Each lock wobbles a little.
    const a0 = ((2 * m + 1) * Math.PI) / LOCKS - Math.PI,
      wob = Math.sin(m * 2.7) * 0.06;
    for (const [shift, style, width] of [
      [0, "rgba(10,8,14,0.42)", 0.005],
      [0.5, "rgba(255,255,255,0.06)", 0.014],
    ] as const) {
      g.strokeStyle = style;
      g.beginPath();
      for (let k = 0; k <= 30; k++) {
        const y = 1.69 - k * 0.01,
          a = a0 + (shift * 2 * Math.PI) / LOCKS - SWIRL * (1.7 - y) + wob * Math.sin((1.79 - y) * 12),
          r = 0.185 * Math.sqrt(Math.min(1, (1.79 - y) / 0.17)) + 0.022 * Math.max(0, (1.5 - y) / 0.09),
          x = r * Math.sin(a);
        if (k === 0) g.moveTo(px(x), py(y));
        else g.lineTo(px(x), py(y));
      }
      g.lineWidth = width * m2px;
      g.stroke();
    }
  }
  // above the temples the same texture covers the fringe in front and the crown behind: lines sweep from the
  // side part across, which reads as the fringe from the front and a crown swirl from behind
  for (let k = 0; k < 7; k++) {
    const x1 = -0.2 + k * 0.045,
      y1 = 1.64 + 0.01 * Math.sin(k * 1.9);
    for (const [dx, style, width] of [
      [0, "rgba(10,8,14,0.38)", 0.005],
      [0.02, "rgba(255,255,255,0.06)", 0.012],
    ] as const) {
      g.strokeStyle = style;
      g.lineWidth = width * m2px;
      g.beginPath();
      g.moveTo(px(0.065 + dx * 0.5), py(1.8));
      g.quadraticCurveTo(px(0.02 + x1 * 0.4 + dx), py(1.77), px(x1 + dx), py(y1));
      g.stroke();
    }
  }
}

/** Spring bones of the hair below the ears: name and angle around the head (0 = straight back, + his left). */
export const HERU_HAIR_SPRINGS: [string, number][] = [
  ["hairC", 0],
  ["hairL", 1.1],
  ["hairR", -1.1],
];

export function heruHairSdf(): Sdf {
  // same axis as the crown dome, so the shell never bulges out of the cap (a bulge reads as a flat patch)
  const z0 = -0.015;
  /** Angle around the head (0 = straight back) and a groove pattern that swirls a little as it falls. */
  const strands = (x: number, y: number, z: number) => {
    const a = Math.atan2(x, -(z - z0)) + SWIRL * (1.7 - y);
    return 1 - Math.abs(Math.cos((a * LOCKS) / 2));
  };
  const crown = sd.ellipsoid([0, 1.6, -0.015], [0.192, 0.205, 0.188]);
  const cap: Sdf = (x, y, z) => {
    // grooves only on the back half below the crown top
    const w = Math.max(0, Math.min(1, (1.76 - y) / 0.08)) * Math.max(0, Math.min(1, (0.04 - z) / 0.08));
    return crown(x, y, z) + w * 0.008 * strands(x, y, z);
  };
  const smooth = (e0: number, e1: number, v: number) => {
    const t = Math.max(0, Math.min(1, (v - e0) / (e1 - e0)));
    return t * t * (3 - 2 * t);
  };
  const shell: Sdf = (x, y, z) => {
    const rho = Math.hypot(x, ((z - z0) * 0.192) / 0.188),
      g = strands(x, y, z);
    // outer radius: full at the temples, a little in at the nape, flaring out toward the ends
    // above the temples it follows the crown dome, so the shell closes into the cap
    const dome = 0.192 * Math.sqrt(Math.max(0, 1 - ((y - 1.6) / 0.205) ** 2)) - 0.002;
    // back silhouette stays within ±0.20 m like the turnaround back view (and the K2 camera solve)
    const fall = 0.178 - 0.008 * smooth(1.62, 1.5, y) + 0.024 * smooth(1.5, 1.41, y) - 0.016 * g * smooth(1.7, 1.5, y);
    const out = y > 1.6 ? Math.min(dome, fall) : fall;
    // open underneath: the neck stays inside, the ends are a thin lip
    const inner = 0.145 + 0.012 * smooth(1.5, 1.41, y);
    const hollow = y < 1.52 ? inner - rho - 0.035 * smooth(1.47, 1.53, y) : -1;
    // scalloped hem: lock tips hang lower than the gaps between them, the sides end a little higher
    const side = Math.abs(Math.atan2(x, -(z - z0)));
    const hem = 1.418 + 0.026 * Math.pow(g, 0.7) + 0.012 * smooth(1.2, 1.9, side) - y;
    // only behind the ears: the front edge leans forward above the ear toward the temple
    const front = z - (-0.035 + Math.max(0, y - 1.47) * 0.8);
    return Math.max(rho - out, hollow, hem, front);
  };
  const fringe = sd.ellipsoid([-0.03, 1.725, 0.07], [0.14, 0.055, 0.088]);
  const sweep = sd.ellipsoid([0.07, 1.68, 0.1], [0.075, 0.034, 0.055]);
  const face = sd.roundBox([0, 1.48, 0.19], [0.138, 0.2, 0.16], 0.085);
  const temples = (s: number) => sd.roundBox([s * 0.18, 1.47, 0.085], [0.07, 0.13, 0.085], 0.03);
  const ears = (s: number) => sd.ellipsoid([s * 0.15, 1.522, -0.008], [0.04, 0.058, 0.045]);
  let f: Sdf = union(0.035, cap, fringe);
  f = union(0.03, f, shell);
  f = union(0.03, f, sweep);
  f = subtract(0.025, f, face);
  f = subtract(0.02, f, (x, y, z) => Math.min(temples(1)(x, y, z), temples(-1)(x, y, z)));
  f = subtract(0.012, f, (x, y, z) => Math.min(ears(1)(x, y, z), ears(-1)(x, y, z)));
  return f;
}

export const HERU_HAIR_JOINTS = HERU_HAIR_SPRINGS.flatMap(([n, a]) => [
  { name: n, parent: "head", at: [0.16 * Math.sin(a), 1.57, -0.015 - 0.16 * Math.cos(a)] as Vec3 },
  { name: n + "Tip", parent: n, at: [0.19 * Math.sin(a), 1.42, -0.015 - 0.19 * Math.cos(a)] as Vec3 },
]);

export const HERU_HAIR_SPRING_SPECS = HERU_HAIR_SPRINGS.map(([n]) => ({
  bone: n,
  tip: n + "Tip",
  stiffness: 2.2,
  gravity: 0.3,
  drag: 0.4,
  radius: 0.02,
}));

export const HERU_COLLIDERS = [
  { bone: "head", at: [0, 1.58, -0.015] as Vec3, r: 0.17 },
  { bone: "chest", at: [-0.17, 1.3, -0.01] as Vec3, to: [0.17, 1.3, -0.01] as Vec3, r: 0.07 },
  { bone: "chest", at: [0, 1.05, -0.02] as Vec3, r: 0.125 },
  { bone: "spine", at: [0, 0.8, 0] as Vec3, to: [0, 1.0, 0] as Vec3, r: 0.15 },
];

/** Hair shared by Home Heru and his Solutions cashier uniform. */
export function heruHair(c: Ctx) {
  const { fig } = c;
  c.soft(
    heruHairSdf(),
    [-0.24, 1.37, -0.25],
    [0.24, 1.83, 0.23],
    [30, 22],
    c.cell(256, 256, (g, w, h) => paintHair(g, w, h, HAIR_BOX), 0.56),
    fig.hem(fig.rigid("head"), HERU_HAIR_SPRINGS, 1.56, 1.43, -0.015),
  );
}

/** Trousers and shoes shared by both Heru outfits. */
export function heruLegs(c: Ctx) {
  const { fig } = c;
  const trousers = c.cell(128, 128, (g, w, h) => weave(g, w, h, P.trousers, 0.035, 5), 0.86);
  fig.add(
    loft(
      [
        { y: 0.655, rx: 0.1, rz: 0.075 },
        { y: 0.69, rx: 0.15, rz: 0.1 },
        { y: 0.79, rx: 0.16, rz: 0.108 },
      ],
      20,
    ),
    trousers,
    "hips",
  );
  c.legs(
    [
      [0, 0.088, 0.092],
      [0.25, 0.085, 0.09],
      [0.5, 0.081, 0.085],
      [1, 0.079, 0.083],
    ],
    trousers,
  );
  c.shoes(
    0.3,
    0.17,
    0.13,
    c.cell(
      128,
      128,
      (g, w, h) => {
        g.fillStyle = P.shoe;
        g.fillRect(0, 0, w, h);
        g.fillStyle = P.sole;
        g.fillRect(w * 0.36, 0, w * 0.28, h);
        g.strokeStyle = "rgba(20,20,26,0.55)";
        g.lineWidth = 2;
        for (let k = 0; k < 4; k++) {
          const y = h * (0.42 + k * 0.08);
          for (const x0 of [0, w]) {
            g.beginPath();
            g.moveTo(x0, y);
            g.lineTo(x0 + (x0 ? -1 : 1) * w * 0.07, y + 2);
            g.stroke();
          }
        }
      },
      0.7,
    ),
  );
}

export const HERU_SPEC: MemberSpec = {
  name: "heru",
  height: 1.8,
  body: HERU,
  skin: P.skin,
  face: heruFace(),
  extraJoints: [
    ...HERU_HAIR_JOINTS,
    { name: "lanyard", parent: "chest", at: [0, 1.2, 0.132] },
    { name: "lanyardTip", parent: "lanyard", at: [0, 0.98, 0.138] },
    { name: "bag", parent: "spine", at: [0.175, 0.9, 0.09] },
    { name: "bagTip", parent: "bag", at: [0.195, 0.74, 0.085] },
  ],
  springs: [
    ...HERU_HAIR_SPRING_SPECS,
    { bone: "lanyard", tip: "lanyardTip", stiffness: 0.9, gravity: 1.0, drag: 0.3, radius: 0.03 },
    { bone: "bag", tip: "bagTip", stiffness: 0.7, gravity: 1.0, drag: 0.45, radius: 0.05 },
  ],
  colliders: HERU_COLLIDERS,
  dress(c) {
    const { fig, atlas } = c;
    heruHair(c);

    // ---------- blazer over a tee ----------
    const BLZ = { y0: 0.68, y1: 1.335 };
    const tee = c.swatch(P.tee, 0.85);
    fig.add(
      loft(
        [
          { y: 1.3, rx: 0.088, rz: 0.083, z: 0.004 },
          { y: 1.345, rx: 0.08, rz: 0.075, z: -0.004 },
          { y: 1.365, rx: 0.074, rz: 0.069, z: -0.008 },
        ],
        20,
        { caps: false },
      ),
      c.cell(
        128,
        24,
        (g, w, h) => {
          weave(g, w, h, P.blazer, 0.07, 4);
          // the front of the ring is the tee neckline, lower than the collar behind it
          g.fillStyle = P.tee;
          g.beginPath();
          g.moveTo(w * 0.37, 0);
          g.lineTo(w * 0.63, 0);
          g.lineTo(w * 0.6, h);
          g.lineTo(w * 0.4, h);
          g.fill();
          g.fillStyle = P.blazerDark;
          g.fillRect(0, h - 2, w * 0.37, 2);
          g.fillRect(w * 0.63, h - 2, w * 0.37, 2);
        },
        0.82,
      ),
      "chest",
    );
    c.torso(
      [
        [0.68, 0.187, 0.127],
        [0.74, 0.183, 0.124],
        [0.85, 0.178, 0.118],
        [0.95, 0.178, 0.118],
        [1.06, 0.186, 0.124],
        [1.15, 0.19, 0.126],
        [1.2, 0.195, 0.124],
        [1.25, 0.2, 0.12],
        [1.28, 0.18, 0.11],
        [1.305, 0.14, 0.096],
        [1.325, 0.1, 0.082],
        [1.335, 0.075, 0.07],
      ],
      c.cell(
        512,
        256,
        (g, w, h) => paintBlazer(g, w, h, BLZ),
        (g, w, h) => paintBlazerRough(g, w, h, BLZ),
      ),
      [BLZ.y0, BLZ.y1],
    );
    c.arms(
      [
        [-0.04, 0.001, 0.001],
        [-0.035, 0.03, 0.029],
        [-0.018, 0.052, 0.05],
        [0, 0.064, 0.062],
        [0.3, 0.062, 0.06],
        [0.55, 0.058, 0.057],
        [0.85, 0.055, 0.054],
        [0.985, 0.056, 0.055],
      ],
      c.cell(
        256,
        128,
        (g, w, h) => {
          weave(g, w, h, P.blazer, 0.07, 3);
          g.fillStyle = "#2c2234";
          for (const u of [0.17, 0.83])
            for (let k = 0; k < 3; k++) {
              g.beginPath();
              g.arc(u * w, h * (0.8 + k * 0.055), 2.2, 0, Math.PI * 2);
              g.fill();
            }
        },
        0.82,
      ),
      { cuff: tee },
    );

    heruLegs(c);

    // ---------- lanyard, card, bag ----------
    // the lower lanyard and the card swing from where the cords meet; the bag from the end of its strap
    const chest = fig.rigid("chest"),
      lan = fig.rig.index("lanyard"),
      bagB = fig.rig.index("bag");
    const hangs: Weights = (p) => {
      const [a] = chest(p);
      return [a, lan, Math.min(1, Math.max(0, (1.22 - p.y) / 0.12))];
    };
    const strap: Weights = (p) => {
      const [a] = chest(p);
      return [a, bagB, Math.min(1, Math.max(0, (0.98 - p.y) / 0.1))];
    };
    const lanyard = c.swatch(P.lanyard, 0.6),
      metal = c.swatch(P.metal, 0.3),
      bag = c.swatch(P.bag, 0.55);
    for (const [, s] of SIDES)
      fig.add(
        ribbon(
          [
            [s * 0.06, 1.35, -0.03],
            [s * 0.072, 1.33, 0.05],
            [s * 0.04, 1.2, 0.128],
            [0, 1.075, 0.136],
          ],
          0.016,
          0.004,
        ),
        lanyard,
        hangs,
      );
    fig.add(G.box(0.016, 0.026, 0.008).applyMatrix4(mtx([0, 1.064, 0.137])), metal, "lanyard");
    fig.add(
      G.rbox(0.072, 0.1, 0.007, 0.006).applyMatrix4(mtx([0, 1.0, 0.136], [-0.06, 0, 0])),
      atlas.uv(
        atlas.cell(
          64,
          96,
          (g, w, h) => {
            g.fillStyle = "#f4f4f8";
            g.fillRect(0, 0, w, h);
            g.fillStyle = "#7d57c0";
            g.fillRect(w * 0.12, h * 0.1, w * 0.76, h * 0.1);
            g.strokeStyle = "#b9b9c8";
            g.lineWidth = 4;
            g.strokeRect(2, 2, w - 4, h - 4);
          },
          0.3,
        ),
      ),
      "lanyard",
      { x0: -0.036, x1: 0.036, y0: 0.95, y1: 1.05 },
    );
    fig.add(G.rbox(0.095, 0.125, 0.05, 0.015).applyMatrix4(mtx([0.19, 0.8, 0.085], [0, 0.55, 0])), bag, "bag");
    fig.add(
      ribbon(
        [
          [0.18, 0.86, 0.11],
          [0.1, 0.97, 0.132],
          [-0.02, 1.1, 0.138],
          [-0.12, 1.215, 0.118],
          [-0.165, 1.296, 0.02],
          [-0.13, 1.26, -0.07],
          [-0.02, 1.1, -0.1],
          [0.1, 0.95, -0.095],
          [0.17, 0.87, -0.02],
        ],
        0.024,
        0.005,
      ),
      bag,
      strap,
    );
  },
};

export const buildHeru = (opts: { saver?: boolean } = {}) => buildMember(HERU_SPEC, opts);

const torsoU = (w: number) => frontU(w, 0.185);

// The blazer is painted around the torso: u from the back (0) through the left side (0.25) to the front (0.5)
// and the right side (0.75); v by height. The open front shows the tee, the belt and the trousers.
function paintBlazer(g: CanvasRenderingContext2D, w: number, h: number, Y: { y0: number; y1: number }) {
  const fx = torsoU(w),
    fy = (y: number) => ((Y.y1 - y) / (Y.y1 - Y.y0)) * h;
  weave(g, w, h, P.blazer, 0.07, 2);
  // back seam and hem shade
  g.fillStyle = "rgba(30,15,60,0.25)";
  g.fillRect(0, 0, 2, h);
  g.fillRect(w - 2, 0, 2, h);
  const hem = g.createLinearGradient(0, fy(0.74), 0, h);
  hem.addColorStop(0, "rgba(30,15,60,0)");
  hem.addColorStop(1, "rgba(30,15,60,0.25)");
  g.fillStyle = hem;
  g.fillRect(0, fy(0.74), w, h - fy(0.74));
  // open front: tee down to the belt, then trousers
  // the fronts part a little more toward the hem (cutaway)
  const open = (y: number) => 0.042 + Math.max(0, y - 1.26) * 0.25 + Math.max(0, 0.86 - y) * 0.35;
  g.fillStyle = P.tee;
  g.beginPath();
  for (const y of [1.34, 1.26, 1.0, 0.86, 0.8]) g.lineTo(fx(open(y)), fy(y));
  for (const y of [0.8, 0.86, 1.0, 1.26, 1.34]) g.lineTo(fx(-open(y) - 0.005), fy(y));
  g.fill();
  g.fillStyle = P.trousers;
  g.beginPath();
  for (const y of [0.802, 0.74, 0.66]) g.lineTo(fx(open(y)), fy(y));
  for (const y of [0.66, 0.74, 0.802]) g.lineTo(fx(-open(y) - 0.005), fy(y));
  g.fill();
  g.fillStyle = "#3a3840";
  g.fillRect(fx(open(0.79)), fy(0.802), fx(-open(0.79) - 0.005) - fx(open(0.79)), fy(0.776) - fy(0.802));
  g.fillStyle = "#26252b";
  g.fillRect(fx(0.02), fy(0.8), fx(-0.02) - fx(0.02), fy(0.778) - fy(0.8));
  // fly seam
  g.fillStyle = "rgba(0,0,0,0.25)";
  g.fillRect(fx(0.004), fy(0.776), 2, fy(0.7) - fy(0.776));
  // lapels: lighter wedges from the collar down to the chest, with a fold shadow on their outer edge
  for (const s of [1, -1]) {
    g.fillStyle = "#6e4fb0";
    g.beginPath();
    g.moveTo(fx(s * 0.06), fy(1.31));
    g.lineTo(fx(s * 0.135), fy(1.22));
    g.lineTo(fx(s * 0.105), fy(1.17));
    g.lineTo(fx(s * 0.062), fy(1.0));
    g.closePath();
    g.fill();
    g.strokeStyle = P.blazerDark;
    g.lineWidth = 2.5;
    g.beginPath();
    g.moveTo(fx(s * 0.135), fy(1.22));
    g.lineTo(fx(s * 0.105), fy(1.17));
    g.lineTo(fx(s * 0.062), fy(1.0));
    g.stroke();
    // lower pocket flaps
    g.fillStyle = "rgba(40,20,80,0.35)";
    g.fillRect(fx(s * 0.16), fy(0.875), fx(s * 0.09) - fx(s * 0.16), 3);
    g.fillStyle = "rgba(255,255,255,0.06)";
    g.fillRect(fx(s * 0.16), fy(0.875) + 3, fx(s * 0.09) - fx(s * 0.16), 10);
  }
  // chest pocket (left), button (right front edge)
  g.fillStyle = "rgba(40,20,80,0.35)";
  g.fillRect(fx(0.125), fy(1.13), fx(0.075) - fx(0.125), 3);
  g.fillStyle = "#2a2133";
  g.beginPath();
  g.arc(fx(-0.085), fy(0.915), 3.2, 0, Math.PI * 2);
  g.fill();
  // fabric edge of the opening
  g.strokeStyle = P.blazerDark;
  g.lineWidth = 2;
  for (const s of [1, -1]) {
    g.beginPath();
    g.moveTo(fx(s * open(1.0) + (s < 0 ? -0.005 : 0)), fy(1.0));
    g.lineTo(fx(s * open(0.86) + (s < 0 ? -0.005 : 0)), fy(0.86));
    g.lineTo(fx(s * open(0.68) + (s < 0 ? -0.005 : 0)), fy(0.68));
    g.stroke();
  }
}

function paintBlazerRough(g: CanvasRenderingContext2D, w: number, h: number, Y: { y0: number; y1: number }) {
  const fx = torsoU(w),
    fy = (y: number) => ((Y.y1 - y) / (Y.y1 - Y.y0)) * h;
  g.fillStyle = "rgb(209,209,209)";
  g.fillRect(0, 0, w, h);
  g.fillStyle = "rgb(120,120,120)";
  g.fillRect(fx(0.065), fy(0.802), fx(-0.07) - fx(0.065), fy(0.776) - fy(0.802));
}
