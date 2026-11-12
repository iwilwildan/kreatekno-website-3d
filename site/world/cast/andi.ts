// Andi (Kreatekno): 1.69 m, layered black hair to the nape with orange tips (a long fringe parted a little to his
// right, locks framing the face, one strand sticking up), black headphones round his neck, purple hoodie with
// the hood down, drawstrings and a kangaroo pocket over a white tee, purple lanyard with a white card, wide black
// trousers, chunky white sneakers. Measured on refs/KARKATER/andi.png (front, three-quarter, side, back); in the
// team's video K7 - K8 he sits at a laptop in the meeting room.
import * as THREE from "three";
import { G, mtx, type Vec3 } from "../core/kit";
import { weave } from "./atlas";
import { limb, SIDES } from "./body";
import { HERU, HERU_HAIR_JOINTS, HERU_HAIR_SPRING_SPECS, HERU_HAIR_SPRINGS } from "./heru";
import { loft } from "./loft";
import { buildMember, frontU, type Ctx, type MemberSpec } from "./member";
import { intersect, sd, subtract, union, type Sdf } from "./sdf";
import { axesY, shirtRings } from "./wardrobe";
import { lanyard } from "./wildan";

const P = {
  skin: "#b8775a",
  hair: "#29282d",
  tip: "#d65a26",
  tipDeep: "#a8401c",
  hoodie: "#6441a2",
  hoodieDark: "#4d3083",
  tee: "#f0eef3",
  trousers: "#2a2930",
  phones: "#2a2a31",
  cushion: "#1d1d22",
  shoe: "#f7f6fa",
  sole: "#e4e1e8",
  lanyard: "#6b3aaa",
  brow: "#232225",
  lip: "#a05744",
};

const LOCKS = 11,
  HAIR_BOX = { x0: -0.24, x1: 0.24, y0: 1.36, y1: 1.86 };

/** The part: a little off the middle, toward his right (the viewer's left), as on the turnaround close-up. */
const XP = -0.012;

/**
 * Lower edge of the fringe over the face (front view, modelling space): the forehead shows in an arch from the
 * part; the bangs sweep away to both sides, the bigger sweep to his left reaching the outer end of the brow, the
 * other down the temple.
 */
const fringeEdge = (x: number) => {
  // rounded at the part (it leaves the part steeply, then turns out to the side)
  const t = Math.min(1, Math.abs(x - XP) / (x < XP ? 0.13 : 0.15)),
    r = 1 - (1 - t) ** 1.8;
  return x < XP ? 1.715 - 0.14 * (0.55 * r + 0.45 * t ** 1.6) : 1.715 - 0.105 * r;
};

/**
 * Hair: a full cap, locks framing the face in front of the ears and one shell behind the ears that falls to the
 * nape and flares into pointed locks; the long fringe down to the brows is a part of its own (`fringe`), so its
 * orange ends are painted on it alone (the textures are front-projected: on one part they would ring the head).
 * Cut away over the face and the ears.
 */
function hairSdf(fringeOnly = false): Sdf {
  const z0 = -0.015;
  const strands = (x: number, y: number, z: number) => {
    const a = Math.atan2(x, -(z - z0)) + 0.25 * (1.7 - y);
    return 1 - Math.abs(Math.cos((a * LOCKS) / 2));
  };
  const smooth = (e0: number, e1: number, v: number) => {
    const t = Math.max(0, Math.min(1, (v - e0) / (e1 - e0)));
    return t * t * (3 - 2 * t);
  };
  const crown = sd.ellipsoid([0, 1.605, -0.012], [0.19, 0.206, 0.19]);
  const cap: Sdf = (x, y, z) => crown(x, y, z) + 0.007 * strands(x, y, z) * Math.max(0, Math.min(1, (1.77 - y) / 0.08));
  // behind the ears: full at the temples, in at the nape, flaring toward the lock ends
  const shell: Sdf = (x, y, z) => {
    const rho = Math.hypot(x, z - z0),
      g = strands(x, y, z);
    const dome = 0.19 * Math.sqrt(Math.max(0, 1 - ((y - 1.605) / 0.206) ** 2)) - 0.002;
    const fall = 0.18 - 0.01 * smooth(1.6, 1.48, y) + 0.03 * smooth(1.48, 1.38, y) - 0.018 * g * smooth(1.68, 1.45, y);
    const out = y > 1.6 ? Math.min(dome, fall) : fall;
    const inner = 0.147 + 0.014 * smooth(1.5, 1.4, y);
    const hollow = y < 1.52 ? inner - rho - 0.035 * smooth(1.47, 1.53, y) : -1;
    // pointed lock ends: tips hang lower than the gaps
    const hem = 1.392 + 0.04 * Math.pow(g, 0.6) - y;
    const front = z - (-0.03 + Math.max(0, y - 1.47) * 0.9);
    return Math.max(rho - out, hollow, hem, front);
  };
  // the fringe: the front of the cap, a little fuller, with a sweep to each side of the part (the bigger one to
  // his left); its locks fan out from the part
  const full = union(
    0.03,
    sd.ellipsoid([0, 1.605, -0.012], [0.198, 0.214, 0.198]),
    sd.ellipsoid([0.07, 1.675, 0.115], [0.125, 0.065, 0.08]),
    sd.ellipsoid([-0.085, 1.66, 0.105], [0.095, 0.065, 0.075]),
  );
  const fan = (x: number, y: number) => 1 - Math.abs(Math.cos(Math.atan2(x - XP, 1.86 - y) * 9));
  const fringe: Sdf = (x, y, z) => full(x, y, z) + 0.006 * fan(x, y);
  // locks framing the face, in front of the ears, ending at the cheeks
  const sideLock = (s: number) =>
    union(
      0.03,
      sd.capsule([s * 0.148, 1.66, 0.06], [s * 0.158, 1.53, 0.058], 0.022),
      sd.capsule([s * 0.158, 1.53, 0.058], [s * 0.164, 1.48, 0.045], 0.012),
    );
  // the strand sticking up from the crown
  const tuft = union(
    0.01,
    sd.capsule([0.01, 1.8, 0.0], [0.0, 1.84, -0.015], 0.012),
    sd.capsule([0.0, 1.84, -0.015], [-0.012, 1.86, -0.04], 0.006),
  );
  const part = sd.capsule([XP, 1.74, 0.17], [XP - 0.004, 1.815, -0.02], 0.007);
  // the face below the fringe's edge (an arch from the part)
  const faceBox = sd.roundBox([0, 1.3, 0.2], [0.132, 0.5, 0.16], 0.07);
  const face: Sdf = (x, y, z) => Math.max(faceBox(x, y, z), y - fringeEdge(x));
  if (fringeOnly)
    return subtract(
      0.02,
      subtract(
        0.008,
        intersect(0.02, fringe, (_x, y, z) => Math.max(0.05 - z, 1.5 - y)),
        part,
      ),
      face,
    );
  let f: Sdf = union(0.03, cap, shell);
  f = union(0.025, f, sideLock(1), sideLock(-1));
  // the part; over the forehead the fringe takes over
  f = subtract(0.008, f, part);
  f = intersect(0.015, f, (_x, y, z) => z - 0.07 - Math.max(0, 1.62 - y) * 10 - Math.max(0, y - 1.76) * 3);
  f = subtract(0.02, f, face);
  // the ears show between the side locks and the shell
  f = subtract(0.012, f, (x, y, z) =>
    Math.min(
      sd.ellipsoid([0.152, 1.522, -0.008], [0.04, 0.06, 0.042])(x, y, z),
      sd.ellipsoid([-0.152, 1.522, -0.008], [0.04, 0.06, 0.042])(x, y, z),
    ),
  );
  return union(0.012, f, tuft);
}

/**
 * Hair texture (front-projected): black with strand lines; orange lock ends on the hair, orange ends toward the
 * temples on the fringe.
 */
function paintHair(g: CanvasRenderingContext2D, w: number, h: number, fringe: boolean) {
  const B = HAIR_BOX,
    px = (x: number) => ((x - B.x0) / (B.x1 - B.x0)) * w,
    py = (y: number) => ((B.y1 - y) / (B.y1 - B.y0)) * h,
    m = w / (B.x1 - B.x0);
  weave(g, w, h, P.hair, 0.025, 71);
  // orange tips: the last few centimetres of the locks at the nape and the cheeks (one tongue per lock)
  const tips = (y0: number, y1: number) => {
    g.beginPath();
    g.moveTo(0, py(y1));
    for (let k = 0; k <= 30; k++) {
      const x = B.x0 + ((B.x1 - B.x0) * k) / 30;
      g.lineTo(px(x), py(y0 + 0.022 * Math.abs(Math.sin(k * 1.7)) + 0.012 * Math.min(1, Math.abs(x) / 0.2)));
    }
    g.lineTo(w, py(y1));
    g.fill();
  };
  const tipFill = g.createLinearGradient(0, py(1.49), 0, py(1.38));
  tipFill.addColorStop(0, "rgba(214,90,38,0)");
  tipFill.addColorStop(0.35, P.tip);
  tipFill.addColorStop(1, P.tipDeep);
  g.fillStyle = tipFill;
  if (!fringe) tips(1.455, 1.36);
  if (fringe) paintFringe(g, px, py, m);
  else {
    // strand lines falling from the part over the crown and down the back
    g.lineCap = "round";
    for (let k = 0; k < 15; k++) {
      const x0 = XP + Math.sin(k * 2.3) * 0.015,
        x1 = -0.22 + k * 0.031;
      for (const [dx, style, lw] of [
        [0, "rgba(8,6,10,0.45)", 0.004],
        [0.01, "rgba(255,255,255,0.07)", 0.008],
      ] as const) {
        g.strokeStyle = style;
        g.lineWidth = lw * m;
        g.beginPath();
        g.moveTo(px(x0 + dx * 0.3), py(1.83));
        g.quadraticCurveTo(px(x1 * 0.7 + dx), py(1.74), px(x1 + dx), py(1.4 + Math.abs(x1) * 0.4));
        g.stroke();
      }
    }
  }
}

/**
 * The fringe: locks fanning out from the part to both sides and down (dark grooves, lighter ridges), the part
 * line, and orange toward the ends of each sweep just above its edge.
 */
function paintFringe(g: CanvasRenderingContext2D, px: (x: number) => number, py: (y: number) => number, m: number) {
  // orange ends: from the edge up a few centimetres, away from the part (more on the bigger sweep)
  for (const s of [1, -1]) {
    const gr = g.createLinearGradient(px(XP + s * (s > 0 ? 0.04 : 0.07)), 0, px(XP + s * 0.17), 0);
    gr.addColorStop(0, "rgba(214,90,38,0)");
    gr.addColorStop(0.55, "rgba(214,90,38,0.85)");
    gr.addColorStop(1, P.tip);
    g.fillStyle = gr;
    g.beginPath();
    const n = 16,
      span = 0.24;
    for (let k = 0; k <= n; k++) {
      const x = XP + s * (0.03 + (span * k) / n);
      g.lineTo(px(x), py(fringeEdge(x) + (s > 0 ? 0.045 : 0.025) - 0.014 * Math.abs(Math.sin(k * 1.9))));
    }
    for (let k = n; k >= 0; k--) {
      const x = XP + s * (0.03 + (span * k) / n);
      g.lineTo(px(x), py(fringeEdge(x) - 0.03));
    }
    g.fill();
  }
  // locks fanning out from the part: each a curve from the part out and down to the fringe's edge
  g.lineCap = "round";
  for (const s of [1, -1])
    for (let k = 0; k < 9; k++) {
      const x1 = XP + s * (0.02 + k * 0.028),
        y1 = (Math.abs(x1) < 0.15 ? fringeEdge(x1) : 1.5) - 0.01;
      for (const [dx, style, lw] of [
        [0, "rgba(8,6,10,0.5)", 0.004],
        [0.011, "rgba(255,255,255,0.09)", 0.008],
      ] as const) {
        g.strokeStyle = style;
        g.lineWidth = lw * m;
        g.beginPath();
        g.moveTo(px(XP + s * (0.004 + dx * 0.3)), py(1.84));
        g.quadraticCurveTo(px(XP + s * (0.01 + k * 0.012) + s * dx), py(1.77), px(x1 + s * dx), py(y1));
        g.stroke();
      }
    }
  // the part line
  g.strokeStyle = "rgba(4,3,6,0.7)";
  g.lineWidth = 0.004 * m;
  g.beginPath();
  g.moveTo(px(XP), py(1.84));
  g.lineTo(px(XP - 0.002), py(1.715));
  g.stroke();
}

const HOOD = { y0: 0.72, y1: 1.335 };

function paintHoodie(g: CanvasRenderingContext2D, w: number, h: number) {
  const fx = frontU(w, 0.19),
    fy = axesY(h, HOOD.y0, HOOD.y1);
  weave(g, w, h, P.hoodie, 0.06, 72);
  // kangaroo pocket: a trapezoid with slanted openings at the sides
  g.strokeStyle = P.hoodieDark;
  g.lineWidth = 2.5;
  g.beginPath();
  g.moveTo(fx(0.13), fy(0.785));
  g.lineTo(fx(0.115), fy(0.92));
  g.lineTo(fx(-0.115), fy(0.92));
  g.lineTo(fx(-0.13), fy(0.785));
  g.stroke();
  g.fillStyle = "rgba(30,15,60,0.25)";
  for (const s of [1, -1]) {
    g.beginPath();
    g.moveTo(fx(s * 0.115), fy(0.92));
    g.lineTo(fx(s * 0.15), fy(0.83));
    g.lineTo(fx(s * 0.14), fy(0.83));
    g.lineTo(fx(s * 0.107), fy(0.91));
    g.fill();
  }
  // ribbed hem band
  g.fillStyle = P.hoodieDark;
  g.fillRect(0, fy(0.77), w, 2);
  g.fillStyle = "rgba(30,15,60,0.18)";
  for (let x = 0; x < w; x += 5) g.fillRect(x, fy(0.77), 1.5, h - fy(0.77));
}

/** The hood lying down round the neck and over the upper back, open in a V at the front. */
function hoodSdf(): Sdf {
  const zc = -0.03;
  const cowl: Sdf = (x, y, z) => {
    const a = Math.atan2(x, -(z - zc)),
      back = (1 + Math.cos(a)) / 2,
      rho = Math.hypot(x, (z - zc) * 1.05);
    const r0 = 0.1 + 0.025 * back,
      yR = 1.3 + 0.075 * back * back,
      rt = 0.024 + 0.04 * back;
    return Math.hypot(rho - r0, (y - yR) * 0.9) - rt;
  };
  // the hood's bag flat on the upper back
  const bag = sd.ellipsoid([0, 1.25, -0.145], [0.13, 0.12, 0.045]);
  let f: Sdf = union(0.04, cowl, bag);
  // keep the neck clear
  f = subtract(0.015, f, sd.capsule([0, 1.25, -0.0], [0, 1.5, -0.01], 0.07));
  return f;
}

/** Headphones round the neck: a band behind, the cups resting on the collar either side of the chin. */
function headphones(c: Ctx) {
  const { fig } = c;
  const shell = c.swatch(P.phones, 0.4),
    cushion = c.swatch(P.cushion, 0.75);
  for (const [, s] of SIDES) {
    // the cup faces out and a little forward, tipped back onto the hood
    const at = mtx([s * 0.088, 1.36, 0.078], [0.25, s * 0.6, Math.PI / 2]);
    fig.add(G.cyl(0.045, 0.045, 0.034, c.seg(18, 12)).applyMatrix4(at), shell, "chest");
    fig.add(
      G.cyl(0.04, 0.042, 0.022, c.seg(18, 12))
        .applyMatrix4(mtx([0, -0.026, 0]))
        .applyMatrix4(at),
      cushion,
      "chest",
    );
    // hinge arm up from the cup toward the band
    fig.add(
      G.rbox(0.014, 0.05, 0.012, 0.005).applyMatrix4(mtx([s * 0.108, 1.405, 0.04], [0.3, 0, s * -0.35])),
      shell,
      "chest",
    );
  }
  // band round the back of the neck, over the hood
  const pts: Vec3[] = [];
  for (let k = 0; k <= 10; k++) {
    const a = -1.45 + (2.9 * k) / 10;
    pts.push([Math.sin(a) * 0.12, 1.405 - 0.012 * Math.cos(a), -0.03 - Math.cos(a) * 0.115]);
  }
  const curve = new THREE.CatmullRomCurve3(pts.map((p) => new THREE.Vector3(...p)));
  fig.add(new THREE.TubeGeometry(curve, c.seg(16, 10), 0.012, 6), shell, "chest");
}

export const ANDI: MemberSpec = {
  name: "andi",
  height: 1.69,
  body: { ...HERU, shoulder: [0.176, 1.232, 0] },
  skin: P.skin,
  face: {
    skin: P.skin,
    blush: "rgba(214,112,92,0.2)",
    brow: { y: 1.612, x: 0.076, w: 0.072, thick: 0.017, tilt: -0.06, arch: 0.006, color: P.brow },
    mouth: { y: 1.452, w: 0.09, color: P.lip, lip: "#c07a64" },
  },
  extraJoints: [
    ...HERU_HAIR_JOINTS,
    { name: "lanyard", parent: "chest", at: [0, 1.2, 0.14] },
    { name: "lanyardTip", parent: "lanyard", at: [0, 0.98, 0.146] },
  ],
  springs: [
    ...HERU_HAIR_SPRING_SPECS,
    { bone: "lanyard", tip: "lanyardTip", stiffness: 0.9, gravity: 1.0, drag: 0.3, radius: 0.03 },
  ],
  colliders: [
    { bone: "head", at: [0, 1.58, -0.015], r: 0.17 },
    { bone: "chest", at: [-0.17, 1.3, -0.03], to: [0.17, 1.3, -0.03], r: 0.08 },
    { bone: "chest", at: [0, 1.05, -0.02], r: 0.13 },
    { bone: "spine", at: [0, 0.8, 0], to: [0, 1.0, 0], r: 0.155 },
  ],
  dress(c) {
    const { fig } = c;
    const B = HAIR_BOX;
    c.soft(
      hairSdf(),
      [B.x0, B.y0, -0.25],
      [B.x1, B.y1, 0.23],
      [26, 20],
      c.cell(256, 256, (g, w, h) => paintHair(g, w, h, false), 0.5),
      fig.hem(fig.rigid("head"), HERU_HAIR_SPRINGS, 1.56, 1.42, -0.015),
    );
    // (the fringe's grid only spans the front of the head)
    c.soft(
      hairSdf(true),
      [B.x0, B.y0, 0.0],
      [B.x1, B.y1, 0.23],
      [28, 18],
      c.cell(256, 256, (g, w, h) => paintHair(g, w, h, true), 0.5),
    );
    // ---------- hoodie over a white tee ----------
    const hoodie = (g: CanvasRenderingContext2D, w: number, h: number) => weave(g, w, h, P.hoodie, 0.06, 73);
    c.torso(shirtRings(HOOD.y0, { w: 1.04, flare: -0.01 }), c.cell(512, 256, paintHoodie), [HOOD.y0, HOOD.y1]);
    // the tee's neckline inside the hood's V
    fig.add(
      loft(
        [
          { y: 1.29, rx: 0.08, rz: 0.077, z: 0.006 },
          { y: 1.335, rx: 0.072, rz: 0.069, z: -0.002 },
        ],
        16,
        { caps: false },
      ),
      c.swatch(P.tee, 0.85),
      "chest",
    );
    c.soft(hoodSdf(), [-0.24, 1.08, -0.22], [0.24, 1.5, 0.14], [20, 14], c.cell(128, 128, hoodie, 0.86), "chest");
    // drawstrings from the hood's V, with tips
    const cord = c.swatch("#8462c4", 0.7);
    for (const [, s] of SIDES)
      fig.add(
        limb(
          [s * 0.026, 1.305, 0.112],
          [s * 0.03, 1.15, 0.142],
          [
            [0, 0.0055, 0.0055],
            [0.9, 0.0055, 0.0055],
            [0.92, 0.0075, 0.0075],
            [1, 0.007, 0.007],
          ],
          6,
        ),
        cord,
        "chest",
      );
    // full sleeves gathered into ribbed cuffs
    c.arms(
      [
        [-0.04, 0.001, 0.001],
        [-0.035, 0.034, 0.033],
        [-0.018, 0.058, 0.056],
        [0, 0.07, 0.068],
        [0.3, 0.067, 0.065],
        [0.6, 0.064, 0.062],
        [0.86, 0.062, 0.06],
        [0.92, 0.053, 0.052],
        [0.985, 0.049, 0.048],
      ],
      c.cell(128, 128, hoodie, 0.86),
      { cuff: c.swatch(P.hoodieDark, 0.85) },
    );
    headphones(c);
    lanyard(
      c,
      P.lanyard,
      (s) => [
        [s * 0.06, 1.33, -0.02],
        [s * 0.078, 1.3, 0.07],
        [s * 0.058, 1.2, 0.138],
        [0, 1.075, 0.148],
      ],
      1.0,
      0.147,
    );
    // ---------- wide black trousers, chunky sneakers ----------
    const trousers = c.cell(128, 128, (g, w, h) => weave(g, w, h, P.trousers, 0.05, 74), 0.88);
    fig.add(
      loft(
        [
          { y: 0.655, rx: 0.105, rz: 0.08 },
          { y: 0.69, rx: 0.155, rz: 0.105 },
          { y: 0.74, rx: 0.17, rz: 0.115 },
        ],
        20,
      ),
      trousers,
      "hips",
    );
    c.legs(
      [
        [0, 0.098, 0.1],
        [0.45, 0.098, 0.1],
        [1, 0.104, 0.104],
      ],
      trousers,
      { top: 0.74, hem: 0.085 },
    );
    c.shoes(
      0.3,
      0.175,
      0.135,
      c.cell(
        128,
        128,
        (g, w, h) => {
          g.fillStyle = P.shoe;
          g.fillRect(0, 0, w, h);
          g.fillStyle = P.sole;
          g.fillRect(w * 0.33, 0, w * 0.34, h);
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
  },
};

export const buildAndi = (opts: { saver?: boolean } = {}) => buildMember(ANDI, opts);
