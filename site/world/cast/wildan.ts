// Wildan (Kreatekno, the trainer): 1.77 m, black hair with a high quiff swept back over a skin fade at the sides
// and back, chin goatee, purple shirt with a spread collar, white buttons and a chest pocket, sleeves rolled
// below the elbow, purple lanyard with a white card, white trousers with a white belt, white sneakers.
// Measured on refs/KARKATER/wildan.png (front, three-quarter, side, back); in the team's videos (K7 - K8,
// K8 - K9.1) he sits at a laptop in the meeting room and later walks out of its glass door.
import { G, mtx, type Vec3 } from "../core/kit";
import { weave } from "./atlas";
import { ribbon, SIDES } from "./body";
import type { Weights } from "./figure";
import { HERU } from "./heru";
import { loft } from "./loft";
import { buildMember, frontU, type Ctx, type MemberSpec } from "./member";
import { intersect, sd, subtract, union, type Sdf } from "./sdf";
import { axesY, shirtRings, sleeveRings } from "./wardrobe";

const P = {
  skin: "#bd7c5c",
  hair: "#34313a",
  shirt: "#6c44b2",
  shirtDark: "#52338f",
  shirtLight: "#7c55c2",
  button: "#f3f1f6",
  trousers: "#eceaf0",
  trousersDark: "#d3d0da",
  belt: "#e3e1e8",
  shoe: "#f7f6fa",
  sole: "#e2dfe6",
  lanyard: "#5f3a9c",
  metal: "#b9b8c4",
  brow: "#232022",
  beard: "#262022",
  lip: "#a55848",
};

/** Boxes of the fade and the top hair: their meshing grids and their textures' front projection. */
type Box = { x0: number; x1: number; y0: number; y1: number };
const FADE_BOX: Box = { x0: -0.2, x1: 0.2, y0: 1.32, y1: 1.8 },
  TOP_BOX: Box = { x0: -0.22, x1: 0.22, y0: 1.54, y1: 1.84 };

/**
 * Top hair: a quiff over the forehead swept up and back over the crown, sitting on the skull above the fade line
 * (the temples at the front, a little above the ears at the sides, the occiput behind). Shallow grooves run
 * front to back, like the combed locks on the turnaround.
 */
function quiffSdf(): Sdf {
  const top = sd.ellipsoid([0, 1.695, -0.02], [0.172, 0.105, 0.196]);
  // the quiff: highest just behind the hairline, leaning back, swept a little toward his left
  const quiff = sd.ellipsoid([0.018, 1.752, 0.06], [0.145, 0.06, 0.115]);
  const crest = sd.ellipsoid([0.0, 1.755, -0.06], [0.13, 0.05, 0.12]);
  // the back of the top hair rounds over the occiput and overhangs the fade a little (side and back views)
  const back = sd.ellipsoid([0, 1.665, -0.055], [0.168, 0.1, 0.162]);
  let f: Sdf = union(0.04, top, quiff, crest, back);
  // the fade line: hair only above it (lower toward the back), the forehead clear below the hairline
  f = intersect(0.015, f, (_x, y, z) => 1.655 + Math.max(0, z + 0.02) * 0.25 - Math.max(0, -z - 0.06) * 0.45 - y);
  f = subtract(0.02, f, sd.roundBox([0, 1.52, 0.2], [0.135, 0.165, 0.12], 0.07));
  return (x, y, z) => {
    // a few broad combed locks in two frequencies (so they do not read as stripes), by angle round the head:
    // front to back over the top, downward at the back, so no part is left smooth and glossy
    const a = Math.atan2(x, z + 0.02) + 0.12 * Math.sin(y * 40),
      g = 0.65 * Math.abs(Math.sin(a * 7)) + 0.35 * Math.abs(Math.sin(a * 16 + 1.3));
    return f(x, y, z) + 0.006 * g * Math.max(0, Math.min(1, (y - 1.6) / 0.05));
  };
}

/** The fade: a thin shell over the sides and back of the skull, under the top hair, ending at the nape. */
function fadeSdf(): Sdf {
  // the skull, and the back of the head down to the nape (the skull ellipsoid narrows too soon there)
  const skull = union(
    0.03,
    sd.ellipsoid([0, 1.585, -0.016], [0.157, 0.192, 0.165]),
    sd.ellipsoid([0, 1.47, -0.015], [0.116, 0.1, 0.122]),
  );
  // down to the nape behind, rising past the ears to the sideburns in front
  const line = (z: number) => 1.372 + 0.103 * Math.min(1, Math.max(0, (z + 0.15) / 0.09)) + Math.max(0, z) * 0.9;
  let f: Sdf = intersect(0.01, skull, (_x, y, z) => line(z) - y);
  f = subtract(0.02, f, sd.roundBox([0, 1.52, 0.22], [0.125, 0.165, 0.12], 0.07));
  // round the ears
  f = subtract(0.01, f, (x, y, z) =>
    Math.min(
      sd.ellipsoid([0.15, 1.522, -0.012], [0.04, 0.058, 0.044])(x, y, z),
      sd.ellipsoid([-0.15, 1.522, -0.012], [0.04, 0.058, 0.044])(x, y, z),
    ),
  );
  return f;
}

/**
 * Hair texture: dark with combed lines; with `fade` it runs from the hair colour down to the skin below the fade
 * line (the top hair goes without: at the back it reaches below that line).
 */
function paintHair(g: CanvasRenderingContext2D, w: number, h: number, B: Box, fade: boolean) {
  const px = (x: number) => ((x - B.x0) / (B.x1 - B.x0)) * w,
    py = (y: number) => ((B.y1 - y) / (B.y1 - B.y0)) * h;
  weave(g, w, h, P.hair, 0.03, 61);
  // fade: from the fade line down to the nape
  if (fade) {
    const gr = g.createLinearGradient(0, py(1.64), 0, py(1.45));
    gr.addColorStop(0, "rgba(52,49,58,1)");
    gr.addColorStop(0.45, "rgba(92,72,70,0.9)");
    gr.addColorStop(1, "rgba(160,110,86,0.85)");
    g.fillStyle = gr;
    g.fillRect(0, py(1.64), w, h - py(1.64));
  }
  // combed lines over the top, swept from the front up and back
  g.lineCap = "round";
  const m = w / (B.x1 - B.x0);
  for (let k = 0; k < 11; k++) {
    const x = -0.15 + k * 0.03;
    for (const [dx, style, lw] of [
      [0, "rgba(10,8,14,0.4)", 0.004],
      [0.012, "rgba(255,255,255,0.07)", 0.009],
    ] as const) {
      g.strokeStyle = style;
      g.lineWidth = lw * m;
      g.beginPath();
      g.moveTo(px(x + dx), py(1.67));
      g.quadraticCurveTo(px(x * 1.1 + dx + 0.01), py(1.74), px(x * 0.9 + dx + 0.03), py(1.8));
      g.stroke();
    }
  }
}

const torsoU = (w: number) => frontU(w, 0.185);
const SHIRT = { y0: 0.78, y1: 1.335 };

function paintShirt(g: CanvasRenderingContext2D, w: number, h: number) {
  const fx = torsoU(w),
    fy = axesY(h, SHIRT.y0, SHIRT.y1);
  weave(g, w, h, P.shirt, 0.06, 62);
  // placket and white buttons down the front
  g.fillStyle = P.shirtDark;
  g.fillRect(fx(0.012), 0, 2, h);
  g.fillRect(fx(-0.012), 0, 2, h);
  g.fillStyle = P.button;
  for (const y of [1.285, 1.18, 1.075, 0.97, 0.865]) {
    g.beginPath();
    g.arc(fx(0), fy(y), 3.2, 0, Math.PI * 2);
    g.fill();
  }
  // chest pocket on his left, with a pointed bottom
  g.strokeStyle = P.shirtDark;
  g.lineWidth = 2;
  g.beginPath();
  g.moveTo(fx(0.065), fy(1.17));
  g.lineTo(fx(0.065), fy(1.09));
  g.lineTo(fx(0.1), fy(1.075));
  g.lineTo(fx(0.135), fy(1.09));
  g.lineTo(fx(0.135), fy(1.17));
  g.stroke();
  g.fillStyle = "rgba(40,20,80,0.3)";
  g.fillRect(fx(0.065), fy(1.17), fx(0.135) - fx(0.065), 2);
  // back: yoke seam across the shoulders and the centre pleat (u 0 and 1 are the back)
  g.fillStyle = "rgba(40,20,80,0.32)";
  g.fillRect(0, fy(1.215), w * 0.2, 2);
  g.fillRect(w * 0.8, fy(1.215), w * 0.2, 2);
  g.fillRect(0, fy(1.215), 2, h - fy(1.215));
  g.fillRect(w - 2, fy(1.215), 2, h - fy(1.215));
  // tucked in: the cloth bunches a little above the belt
  const tuck = g.createLinearGradient(0, fy(0.84), 0, h);
  tuck.addColorStop(0, "rgba(30,15,60,0)");
  tuck.addColorStop(1, "rgba(30,15,60,0.22)");
  g.fillStyle = tuck;
  g.fillRect(0, fy(0.84), w, h - fy(0.84));
}

/** Shirt with a spread collar, rolled sleeves, belt, trousers, shoes. */
function dressWildan(c: Ctx) {
  const { fig } = c;
  const shirtCell = (g: CanvasRenderingContext2D, w: number, h: number) => weave(g, w, h, P.shirt, 0.06, 63);
  c.torso(shirtRings(SHIRT.y0, { flare: 0.006 }), c.cell(512, 256, paintShirt), [SHIRT.y0, SHIRT.y1]);
  // collar stand round the neck, open at the front
  fig.add(
    loft(
      [
        { y: 1.3, rx: 0.086, rz: 0.08, z: 0.002 },
        { y: 1.35, rx: 0.08, rz: 0.075, z: -0.006 },
        { y: 1.37, rx: 0.075, rz: 0.069, z: -0.01 },
      ],
      20,
      { caps: false },
    ),
    c.cell(
      128,
      24,
      (g, w, h) => {
        weave(g, w, h, P.shirt, 0.06, 64);
        // the front of the stand is open (skin of the neck shows in the V)
        g.fillStyle = P.skin;
        g.beginPath();
        g.moveTo(w * 0.42, 0);
        g.lineTo(w * 0.58, 0);
        g.lineTo(w * 0.52, h);
        g.lineTo(w * 0.48, h);
        g.fill();
        g.fillStyle = P.shirtDark;
        g.fillRect(0, 0, w, 2);
      },
      0.8,
    ),
    "chest",
  );
  // collar points lying on the chest either side of the opening
  const collar = c.swatch(P.shirtLight, 0.78);
  for (const [, s] of SIDES)
    fig.add(
      G.rbox(0.064, 0.058, 0.012, 0.005).applyMatrix4(mtx([s * 0.05, 1.312, 0.083], [-0.42, s * 0.5, s * 0.55])),
      collar,
      "chest",
    );
  // sleeves rolled up just below the elbow (turnaround: the roll at 0.55 of the arm), bare forearms below
  const r = 0.063,
    end = 0.56;
  c.arms(
    sleeveRings(r, { end: 0.47 })
      .slice(0, -1)
      .concat([
        [0.475, r * 0.93, r * 0.91],
        [0.49, r * 1.1, r * 1.08],
        [0.545, r * 1.1, r * 1.08],
        [end, r * 0.98, r * 0.96],
      ]),
    c.cell(128, 128, shirtCell, 0.8),
    { end },
  );
  // ---------- belt, trousers, shoes ----------
  const trousers = c.cell(
    128,
    128,
    (g, w, h) => {
      weave(g, w, h, P.trousers, 0.03, 65);
      // side seam and a soft crease
      g.fillStyle = "rgba(120,110,140,0.18)";
      g.fillRect(0, 0, 2, h);
      g.fillRect(w * 0.5 - 1, 0, 2, h);
    },
    0.85,
  );
  fig.add(
    loft(
      [
        { y: 0.655, rx: 0.098, rz: 0.075 },
        { y: 0.69, rx: 0.148, rz: 0.1 },
        { y: 0.79, rx: 0.158, rz: 0.107 },
      ],
      20,
    ),
    trousers,
    "hips",
  );
  fig.add(
    loft(
      [
        { y: 0.775, rx: 0.186, rz: 0.128, z: 0.004 },
        { y: 0.8, rx: 0.187, rz: 0.129, z: 0.004 },
      ],
      24,
      { caps: false },
    ),
    c.cell(
      128,
      16,
      (g, w, h) => {
        weave(g, w, h, P.belt, 0.03, 66);
        // buckle at the front, loops round the waist
        g.fillStyle = "#f8f8fb";
        g.fillRect(w * 0.47, 1, w * 0.06, h - 2);
        g.strokeStyle = "#bdbac6";
        g.lineWidth = 1.5;
        g.strokeRect(w * 0.47, 1.5, w * 0.06, h - 3);
        g.fillStyle = "rgba(120,110,140,0.25)";
        for (const u of [0.1, 0.3, 0.7, 0.9]) g.fillRect(w * u, 0, 2, h);
      },
      0.6,
    ),
    "hips",
  );
  c.legs(
    [
      [0, 0.088, 0.092],
      [0.3, 0.083, 0.087],
      [0.6, 0.077, 0.08],
      [0.9, 0.074, 0.077],
      [0.91, 0.079, 0.082],
      [1, 0.079, 0.082],
    ],
    trousers,
    { hem: 0.14 },
  );
  c.shoes(
    0.29,
    0.165,
    0.12,
    c.cell(
      128,
      128,
      (g, w, h) => {
        g.fillStyle = P.shoe;
        g.fillRect(0, 0, w, h);
        g.fillStyle = P.sole;
        g.fillRect(w * 0.36, 0, w * 0.28, h);
        // laces over the instep
        g.strokeStyle = "rgba(150,145,160,0.6)";
        g.lineWidth = 2;
        for (let k = 0; k < 4; k++) {
          const y = h * (0.45 + k * 0.07);
          for (const x0 of [0, w]) {
            g.beginPath();
            g.moveTo(x0, y);
            g.lineTo(x0 + (x0 ? -1 : 1) * w * 0.08, y + 2);
            g.stroke();
          }
        }
      },
      0.55,
    ),
  );
}

/** Purple lanyard round the neck (under the collar) and a white card holder with a purple band. */
export function lanyard(c: Ctx, color: string, path: (s: number) => Vec3[], cardY: number, cardZ: number) {
  const { fig, atlas } = c;
  const chest = fig.rigid("chest"),
    lan = fig.rig.index("lanyard"),
    top = path(1)[2][1];
  // the lower cords and the card swing from where the cords meet
  const hangs: Weights = (p) => {
    const [a] = chest(p);
    return [a, lan, Math.min(1, Math.max(0, (top + 0.02 - p.y) / 0.12))];
  };
  const strap = c.swatch(color, 0.6),
    metal = c.swatch(P.metal, 0.3);
  for (const [, s] of SIDES) fig.add(ribbon(path(s), 0.018, 0.004), strap, hangs);
  fig.add(G.box(0.016, 0.026, 0.008).applyMatrix4(mtx([0, cardY + 0.07, cardZ + 0.001])), metal, "lanyard");
  fig.add(
    G.rbox(0.084, 0.114, 0.008, 0.007).applyMatrix4(mtx([0, cardY, cardZ], [-0.06, 0, 0])),
    atlas.uv(
      atlas.cell(
        64,
        96,
        (g, w, h) => {
          g.fillStyle = "#f4f4f8";
          g.fillRect(0, 0, w, h);
          g.fillStyle = "#7d57c0";
          g.fillRect(w * 0.12, h * 0.1, w * 0.76, h * 0.1);
          g.strokeStyle = "#c4c3d0";
          g.lineWidth = 4;
          g.strokeRect(2, 2, w - 4, h - 4);
        },
        0.3,
      ),
    ),
    "lanyard",
    { x0: -0.042, x1: 0.042, y0: cardY - 0.057, y1: cardY + 0.057 },
  );
}

/** The goatee: a short strip under the lower lip widening into a pointed tuft on the chin (turnaround close-up). */
function paintGoatee(g: CanvasRenderingContext2D, w: number, h: number) {
  // the face cell's box (member.ts) for the reference head
  const x0 = -(HERU.headRx + 0.014),
    x1 = -x0,
    y0 = HERU.chin - 0.009,
    y1 = HERU.crown + 0.015,
    px = (x: number) => ((x - x0) / (x1 - x0)) * w,
    py = (y: number) => ((y1 - y) / (y1 - y0)) * h;
  g.fillStyle = P.beard;
  g.globalAlpha = 0.85;
  g.beginPath();
  g.moveTo(px(-0.008), py(1.432));
  g.lineTo(px(0.008), py(1.432));
  g.quadraticCurveTo(px(0.012), py(1.415), px(0.03), py(1.405));
  g.quadraticCurveTo(px(0.022), py(1.39), px(0), py(1.385));
  g.quadraticCurveTo(px(-0.022), py(1.39), px(-0.03), py(1.405));
  g.quadraticCurveTo(px(-0.012), py(1.415), px(-0.008), py(1.432));
  g.fill();
  g.globalAlpha = 1;
}

export const WILDAN: MemberSpec = {
  name: "wildan",
  height: 1.77,
  body: { ...HERU, shoulder: [0.178, 1.232, 0] },
  skin: P.skin,
  face: {
    skin: P.skin,
    blush: "rgba(214,112,92,0.18)",
    brow: { y: 1.608, x: 0.077, w: 0.074, thick: 0.019, tilt: 0.0, arch: 0.006, color: P.brow },
    mouth: { y: 1.452, w: 0.096, color: P.lip, lip: "#c47a66" },
    beard: { color: P.beard, chin: { y: HERU.chin + 0.03, w: 0.05, h: 0.04 }, stubble: 0.7 },
    extra: paintGoatee,
  },
  extraJoints: [
    { name: "lanyard", parent: "chest", at: [0, 1.2, 0.132] },
    { name: "lanyardTip", parent: "lanyard", at: [0, 0.98, 0.138] },
  ],
  springs: [{ bone: "lanyard", tip: "lanyardTip", stiffness: 0.9, gravity: 1.0, drag: 0.3, radius: 0.03 }],
  colliders: [
    { bone: "chest", at: [0, 1.05, -0.02], r: 0.125 },
    { bone: "spine", at: [0, 0.8, 0], to: [0, 1.0, 0], r: 0.15 },
  ],
  dress(c) {
    // (each part is front-projected over its own box; the top hair has no fade in its texture: at the back it
    // reaches below the fade line)
    const F = FADE_BOX,
      T = TOP_BOX;
    c.soft(
      fadeSdf(),
      [F.x0, F.y0, -0.22],
      [F.x1, F.y1, 0.2],
      [28, 20],
      c.cell(256, 256, (g, w, h) => paintHair(g, w, h, F, true), 0.64),
    );
    c.soft(
      quiffSdf(),
      [T.x0, T.y0, -0.24],
      [T.x1, T.y1, 0.22],
      [30, 20],
      c.cell(256, 192, (g, w, h) => paintHair(g, w, h, T, false), 0.6),
    );
    dressWildan(c);
    lanyard(
      c,
      P.lanyard,
      (s) => [
        [s * 0.058, 1.355, -0.035],
        [s * 0.074, 1.33, 0.045],
        [s * 0.042, 1.2, 0.128],
        [0, 1.075, 0.136],
      ],
      1.0,
      0.137,
    );
  },
};

export const buildWildan = (opts: { saver?: boolean } = {}) => buildMember(WILDAN, opts);
