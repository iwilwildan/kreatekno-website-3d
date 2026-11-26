// Andi as the librarian of the Articles page (Pustaka): a purple V-neck cardigan buttoned from the chest down
// (ribbed neckband, placket, hem and cuffs, two patch pockets) over his white tee, a blank white name badge and
// thin reading glasses. Hair, face, body, headphones, trousers and shoes are Home Andi's own (andi.ts); no hoodie
// and no lanyard.
import * as THREE from "three";
import { G, mtx, type Vec3 } from "../core/kit";
import { ANDI_BODY, ANDI_COLLIDERS, ANDI_COLORS, andiFace, andiHair, andiHeadphones, andiLegs } from "./andi";
import { weave } from "./atlas";
import { ribbon, SIDES } from "./body";
import { HERU_HAIR_JOINTS, HERU_HAIR_SPRING_SPECS } from "./heru";
import { buildMember, frontU, type Ctx, type MemberSpec } from "./member";
import { axesY, shirtRings } from "./wardrobe";

const KNIT = ANDI_COLORS.hoodie,
  RIB = ANDI_COLORS.hoodieDark,
  FRAME = "#23264a",
  BUTTON = "#efe9f7";

/** Cardigan body from the hem to the neck, the same cut as the hoodie. */
const CARDI = { y0: 0.72, y1: 1.335 };
const RINGS = shirtRings(CARDI.y0, { w: 1.04, flare: -0.01 });
/** Bottom of the V, where the buttoning starts. */
const V_Y = 1.05;
/** The V's half width at the neck. */
const V_X = 0.074;

/** Front of the cardigan's surface at (x, y) (the torso loft: superellipse p 2.6, shifted 4 mm forward). */
function frontZ(x: number, y: number) {
  let k = 0;
  while (k < RINGS.length - 2 && RINGS[k + 1][0] < y) k++;
  const [ya, rxa, rza] = RINGS[k],
    [yb, rxb, rzb] = RINGS[k + 1],
    t = Math.max(0, Math.min(1, (y - ya) / (yb - ya))),
    rx = rxa + (rxb - rxa) * t,
    rz = rza + (rzb - rza) * t;
  return 0.004 + rz * Math.max(0, 1 - Math.min(1, Math.abs(x) / rx) ** 2.6) ** (1 / 2.6);
}

/** Point on the V edge at height y (side s), a little proud of the knit. */
const vEdge = (s: number, y: number, lift = 0.004): Vec3 => {
  const x = s * V_X * ((y - V_Y) / (CARDI.y1 - V_Y));
  return [x, y, frontZ(x, y) + lift];
};

function paintCardigan(g: CanvasRenderingContext2D, w: number, h: number) {
  const fx = frontU(w, 0.19),
    fy = axesY(h, CARDI.y0, CARDI.y1);
  weave(g, w, h, KNIT, 0.06, 75);
  // fine vertical knit ribs all over
  g.fillStyle = "rgba(40,20,80,0.07)";
  for (let x = 0; x < w; x += 4) g.fillRect(x, 0, 1, h);
  // the white tee in the V
  g.fillStyle = ANDI_COLORS.tee;
  g.beginPath();
  g.moveTo(fx(-V_X - 0.01), fy(CARDI.y1 + 0.01));
  g.lineTo(fx(0), fy(V_Y));
  g.lineTo(fx(V_X + 0.01), fy(CARDI.y1 + 0.01));
  g.fill();
  // the tee's crew neckline under the V
  g.strokeStyle = "rgba(150,140,170,0.55)";
  g.lineWidth = 2;
  g.beginPath();
  g.moveTo(fx(-0.06), fy(1.318));
  g.quadraticCurveTo(fx(0), fy(1.285), fx(0.06), fy(1.318));
  g.stroke();
  // placket below the V (the neckband geometry covers the V edges)
  g.fillStyle = RIB;
  g.fillRect(fx(0.016), fy(V_Y), fx(-0.016) - fx(0.016), fy(CARDI.y0) - fy(V_Y));
  // patch pockets with ribbed tops
  for (const s of [1, -1]) {
    const a = fx(s * 0.055),
      b = fx(s * 0.145),
      [l, r] = a < b ? [a, b] : [b, a];
    g.fillStyle = "rgba(30,15,60,0.22)";
    g.fillRect(l - 1, fy(0.905), r - l + 2, fy(0.79) - fy(0.905) + 2);
    g.fillStyle = KNIT;
    g.fillRect(l, fy(0.9), r - l, fy(0.79) - fy(0.9));
    g.fillStyle = RIB;
    g.fillRect(l, fy(0.9), r - l, fy(0.88) - fy(0.9));
  }
  // ribbed hem band
  g.fillStyle = RIB;
  g.fillRect(0, fy(0.765), w, h - fy(0.765));
  g.fillStyle = "rgba(20,10,45,0.25)";
  for (let x = 0; x < w; x += 5) g.fillRect(x, fy(0.765), 1.5, h - fy(0.765));
}

/** Thin reading glasses on the eyes: two rounded-square rims, a bridge and temples back over the ears. */
function glasses(c: Ctx) {
  const { fig, b } = c;
  const frame = c.swatch(FRAME, 0.35),
    r = 0.0032,
    radial = c.seg(5, 4);
  const tube = (pts: Vec3[], n: number, closed = false) =>
    new THREE.TubeGeometry(
      new THREE.CatmullRomCurve3(
        pts.map((p) => new THREE.Vector3(...p)),
        closed,
        "catmullrom",
        0.5,
      ),
      n,
      r,
      radial,
      closed,
    );
  const hw = 0.034,
    hh = 0.029,
    cr = 0.013,
    yaw = 0.3,
    cz = 0.168;
  for (const [, s] of SIDES) {
    // a rounded square in the rim's plane, turned to follow the face
    const rim: Vec3[] = [];
    for (let k = 0; k < 4; k++) {
      const ox = (k === 0 || k === 3 ? 1 : -1) * (hw - cr),
        oy = (k < 2 ? 1 : -1) * (hh - cr);
      for (let j = 0; j <= 3; j++) {
        const a = (k * Math.PI) / 2 + (j / 3) * (Math.PI / 2);
        rim.push([ox + Math.cos(a) * cr, oy + Math.sin(a) * cr, 0]);
      }
    }
    const at = mtx([s * b.eye.x, b.eye.y, cz], [0, s * yaw, 0]);
    fig.add(tube(rim, c.seg(32, 20), true).applyMatrix4(at), frame, "head");
    // temple: from the rim's outer edge round the side of the head to the top of the ear
    const outer = new THREE.Vector3(s * hw, 0.006, 0).applyMatrix4(at);
    fig.add(
      tube(
        [
          [outer.x, outer.y, outer.z],
          [s * 0.142, b.eye.y + 0.008, 0.122],
          [s * 0.158, b.eye.y + 0.002, 0.04],
          [s * 0.156, b.ear.y + 0.03, -0.025],
        ],
        c.seg(12, 8),
      ),
      frame,
      "head",
    );
  }
  // bridge over the nose, a little above the rims' middle
  const inner = (s: number) =>
    new THREE.Vector3(-s * hw, 0.008, 0).applyMatrix4(mtx([s * b.eye.x, b.eye.y, cz], [0, s * yaw, 0]));
  const L = inner(1),
    R = inner(-1);
  fig.add(
    tube(
      [
        [R.x, R.y, R.z],
        [0, b.eye.y + 0.016, cz + 0.012],
        [L.x, L.y, L.z],
      ],
      c.seg(8, 6),
    ),
    frame,
    "head",
  );
}

export const ANDI_PUSTAKAWAN_SPEC: MemberSpec = {
  name: "andiPustakawan",
  height: 1.69,
  body: ANDI_BODY,
  skin: ANDI_COLORS.skin,
  face: andiFace(),
  extraJoints: HERU_HAIR_JOINTS,
  springs: HERU_HAIR_SPRING_SPECS,
  colliders: ANDI_COLLIDERS,
  dress(c) {
    const { fig, b } = c;
    andiHair(c);
    glasses(c);

    // ---------- cardigan over the white tee ----------
    c.torso(RINGS, c.cell(512, 256, paintCardigan), [CARDI.y0, CARDI.y1]);
    const knit = c.cell(128, 128, (g, w, h) => weave(g, w, h, KNIT, 0.06, 76), 0.88);
    const rib = c.swatch(RIB, 0.9);
    const body = fig.chain(
      [
        ["hips", [0, b.hipsY - 0.1, 0]],
        ["spine", [0, b.spineY, 0]],
        ["chest", [0, b.chestY, 0]],
      ],
      0.12,
    );
    // ribbed neckband: up one side of the V, round the back of the neck, down the other
    const band: Vec3[] = [];
    for (let k = 0; k <= 6; k++) band.push(vEdge(-1, V_Y + ((CARDI.y1 - 0.01 - V_Y) * k) / 6));
    for (let k = 1; k < 8; k++) {
      const a = -Math.PI / 2 + (k / 8) * Math.PI;
      band.push([Math.sin(a) * 0.08, 1.33 + 0.006 * Math.cos(a), -0.012 - Math.cos(a) * 0.072]);
    }
    for (let k = 6; k >= 0; k--) band.push(vEdge(1, V_Y + ((CARDI.y1 - 0.01 - V_Y) * k) / 6));
    fig.add(ribbon(band, 0.022, 0.009, undefined, c.seg(40, 28)), rib, body);
    // placket from the V down to the hem, with four buttons
    const placket: Vec3[] = [];
    for (let k = 0; k <= 6; k++) {
      const y = V_Y + 0.004 - ((V_Y + 0.004 - CARDI.y0 - 0.004) * k) / 6;
      placket.push([0, y, frontZ(0, y) + 0.003]);
    }
    fig.add(
      ribbon(placket, 0.028, 0.006, () => new THREE.Vector3(0, 0, 1), c.seg(12, 8)),
      rib,
      body,
    );
    if (!c.saver) {
      const button = c.swatch(BUTTON, 0.3);
      for (const y of [1.015, 0.935, 0.855, 0.775])
        fig.add(
          G.cyl(0.0085, 0.0085, 0.005, 10).applyMatrix4(mtx([0, y, frontZ(0, y) + 0.008], [Math.PI / 2, 0, 0])),
          button,
          body,
        );
      // patch pockets stand off the knit a little
      for (const s of [1, -1]) {
        const x = s * 0.1,
          z = frontZ(x, 0.845);
        const at = mtx([x, 0.845, z + 0.002], [0, s * 0.42, 0]);
        fig.add(G.rbox(0.09, 0.11, 0.006, 0.003).applyMatrix4(at), knit, body);
        fig.add(
          G.rbox(0.092, 0.018, 0.008, 0.003)
            .applyMatrix4(mtx([0, 0.047, 0.001]))
            .applyMatrix4(at),
          rib,
          body,
        );
      }
    }
    // blank white name badge on Andi's left chest
    {
      const x = 0.098,
        y = 1.16;
      fig.add(
        G.rbox(0.088, 0.044, 0.008, 0.006).applyMatrix4(mtx([x, y, frontZ(x, y) + 0.006], [0, 0.42, 0])),
        c.swatch("#ffffff", 0.38),
        "chest",
      );
    }
    // knit sleeves gathered into ribbed cuffs
    c.arms(
      [
        [-0.04, 0.001, 0.001],
        [-0.035, 0.033, 0.032],
        [-0.018, 0.056, 0.054],
        [0, 0.067, 0.065],
        [0.3, 0.064, 0.062],
        [0.6, 0.061, 0.059],
        [0.86, 0.058, 0.056],
        [0.92, 0.051, 0.05],
        [0.985, 0.048, 0.047],
      ],
      knit,
      { cuff: rib },
    );
    andiHeadphones(c);
    andiLegs(c);
  },
};

export const buildAndiPustakawan = (opts: { saver?: boolean } = {}) => buildMember(ANDI_PUSTAKAWAN_SPEC, opts);
