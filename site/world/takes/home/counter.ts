// Beats 3–4 on the till counter (tahap 5): where the leaflet, the binder and the pencils lie, and the camera from
// K2.2 down to the top views of the leaflet (K3) and the binder (K4).
// The path follows the team's blockout (K2.2 - K3 blockout v3): dolly down the aisle between Nadia's and Fajar's
// desks while panning left, orbit behind Bu Dewi to her right shoulder, slow down there (K2.4, Heru lays the
// leaflet down), then tilt down and push in until the camera looks straight down at the leaflet. The camera is
// a yaw/pitch rig (Euler YXZ), not lookAt, which is unstable looking straight down.
// The top views are framed from the keyframes: the paper's share of the frame and the field of view give the
// height above the counter (no solve: a flat sheet has no depth cues).
import * as THREE from "three";
import { lerp } from "../../core/kit";
import { ease } from "../../core/segments";
import type { CamPose } from "../../core/take";
import { counterFrame, LAYOUT_STEPS } from "../../sets/companyFront";

/** A4 leaflet (landscape on the counter: long side along x) and the closed ring binder (metres). */
export const A4 = { long: 0.297, short: 0.21 };
export const BINDER = { w: 0.27, d: 0.32, h: 0.055 };

/**
 * Where things lie on the counter of layout step `step` (world space). The leaflet is landscape on 16:9 layouts
 * and portrait on 9:16 ones, as in the keyframes; it lies in front of Bu Dewi, kept clear of the till so the
 * top view of K3 does not show it (the 9:16 counter is narrow). The closed binder lies to its right (seen from
 * above, Bu Dewi's side down), toward Heru; for K4 Heru slides it to the middle, as far right as the counter
 * allows. The pencils flank the binder's K4 spot as in K4 pc; on the narrow counter they lie along Heru's edge,
 * outside both top views.
 */
export function counterLayout(step: number) {
  const f = counterFrame(step);
  const portrait = step >= 3;
  // the till's left edge (seen from above) is 0.45 m in from the counter's end (sets/companyFront.ts)
  const leaflet = new THREE.Vector3(Math.min(f.dewi.x, f.x1 - 0.45 - (portrait ? 0.125 : 0.25)), f.top, f.zMid);
  const binderK4 = new THREE.Vector3(Math.max(leaflet.x - 0.5, f.x0 + 0.04 + BINDER.w / 2), f.top, f.zMid);
  // yellow and pink pencil, [x, z] of both ends; K4 pc has them beside the binder, the yellow one on the left
  const z = f.zFront - 0.03,
    pencils = portrait
      ? [
          { color: "#f5e33a", a: [leaflet.x - 0.02, z + 0.006], b: [leaflet.x - 0.21, z] },
          { color: "#f39ad6", a: [leaflet.x - 0.25, z - 0.004], b: [leaflet.x - 0.44, z + 0.003] },
        ]
      : [
          { color: "#f5e33a", a: [binderK4.x + 0.207, f.zMid + 0.116], b: [binderK4.x + 0.183, f.zMid - 0.082] },
          { color: "#f39ad6", a: [binderK4.x - 0.218, f.zMid + 0.133], b: [binderK4.x - 0.191, f.zMid - 0.079] },
        ];
  // the lilac desk pad under both, reaching past the top views of K3 and K4 (except toward the till)
  const till = f.x1 - 0.45;
  const pad = portrait
    ? { x0: Math.max(binderK4.x - 0.2, f.x0 - 0.03), x1: Math.min(leaflet.x + 0.2, till - 0.01) }
    : { x0: Math.max(binderK4.x - 0.36, f.x0 - 0.03), x1: Math.min(leaflet.x + 0.3, till - 0.01) };
  return {
    f,
    portrait,
    pad: { ...pad, z0: f.zMid - 0.33, z1: f.zMid + 0.33 },
    leaflet,
    /** Leaflet size along x and z. */
    leafX: portrait ? A4.short : A4.long,
    leafZ: portrait ? A4.long : A4.short,
    // K3 pc shows its spine at the frame's right edge, but there the yellow pencil of K4 would lie under it: it
    // lies just clear of the pencil (outside the K3 view), so Heru only slides it a little sideways and to the
    // middle for K4
    binderK3: new THREE.Vector3(
      portrait ? leaflet.x - 0.345 : Math.min(leaflet.x - 0.345, binderK4.x + 0.183 - 0.016 - BINDER.w / 2),
      f.top,
      f.zMid + 0.15,
    ),
    binderK4,
    pencils: pencils as { color: string; a: [number, number]; b: [number, number] }[],
  };
}
export type CounterLayout = ReturnType<typeof counterLayout>;

const D2R = THREE.MathUtils.degToRad;
const LOG_PC = Math.log(16 / 9),
  LOG_HP = Math.log(9 / 16);
/** Frame height (m) on the paper and vertical field of view per keyframe, pc and hp (measured in the keyframes). */
const TOP = {
  // K3: the A4 sheet fills 78.5% of the pc frame's height (21 cm) and 89.6% of the hp frame's width (21 cm)
  K3: { pc: 0.21 / 0.785, hp: (0.21 / 0.896) * (16 / 9) },
  // K4: the binder's page (A4 portrait) fills 84.6% of the pc height and 76.9% of the hp width
  K4: { pc: 0.297 / 0.846, hp: (0.21 / 0.769) * (16 / 9) },
};
/** pc keeps K2.2's field of view; hp narrows from 74° (too wide for a top view) to 45°. */
const FOV = { pc: 34.22, hp: 45 };

const rig = (yaw: number, pitch: number) =>
  new THREE.Quaternion().setFromEuler(new THREE.Euler(Math.max(-Math.PI / 2, pitch), yaw, 0, "YXZ"));

let SAFE_TOP = 0;
/**
 * Share of the screen's height under the page's floating header. The top views keep their paper below it: the
 * view widens a little and shifts so the paper is centred in what is left (else the binder's heading sat under
 * the header at K4).
 */
export function setSafeTop(share: number) {
  const s = Math.min(0.2, Math.max(0, share));
  if (s === SAFE_TOP) return;
  SAFE_TOP = s;
  cache.clear();
}

/**
 * Camera looking straight down at (x, z), framed like keyframe `k` on a sheet lying `lift` above the counter:
 * the keyframe's frame on the paper is kept whole (on a screen narrower than the keyframe the width is kept, so
 * the paper never runs off the sides).
 */
function topView(k: "K3" | "K4", x: number, z: number, top: number, lift: number, t: number, aspect: number): CamPose {
  const fov = lerp(FOV.pc, FOV.hp, t),
    akey = Math.exp(lerp(LOG_PC, LOG_HP, t));
  let h = lerp(TOP[k].pc, TOP[k].hp, t);
  if (aspect < akey) h *= akey / aspect;
  h *= 1 + 0.8 * SAFE_TOP;
  const d = h / (2 * Math.tan(D2R(fov) / 2));
  // yaw π: facing the door, so the top of the frame is Heru's side and the paper reads upright for Bu Dewi;
  // shifted toward the top of the frame by half the header's share, which moves the paper down below it
  return {
    pos: new THREE.Vector3(x, top + lift + d, z + (h * SAFE_TOP) / 2),
    quat: rig(Math.PI, -Math.PI / 2),
    fov,
  };
}

export function k3View(t: number, aspect: number) {
  const L = counterLayout(Math.round(t * LAYOUT_STEPS));
  return topView("K3", L.leaflet.x, L.leaflet.z, L.f.top, 0.004, t, aspect);
}
/** K4 frames the binder's open page, a binder's thickness above the counter. */
export function k4View(t: number, aspect: number) {
  const L = counterLayout(Math.round(t * LAYOUT_STEPS));
  return topView("K4", L.binderK4.x, L.binderK4.z, L.f.top, 0.041, t, aspect);
}

/** Monotone cubic (Fritsch–Carlson) through (xs, ys), flat at both ends: no overshoot between knots. */
export function monotone(xs: number[], ys: number[]) {
  const n = xs.length,
    d = xs.slice(1).map((x, i) => (ys[i + 1] - ys[i]) / (x - xs[i])),
    m = ys.map((_, i) => (i === 0 || i === n - 1 ? 0 : d[i - 1] * d[i] <= 0 ? 0 : (d[i - 1] + d[i]) / 2));
  for (let i = 0; i < n - 1; i++) {
    if (d[i] === 0) {
      m[i] = m[i + 1] = 0;
      continue;
    }
    const a = m[i] / d[i],
      b = m[i + 1] / d[i],
      s = a * a + b * b;
    if (s > 9) {
      const k = 3 / Math.sqrt(s);
      m[i] = k * a * d[i];
      m[i + 1] = k * b * d[i];
    }
  }
  return (x: number) => {
    let i = 0;
    while (i < n - 2 && x > xs[i + 1]) i++;
    const h = xs[i + 1] - xs[i],
      u = Math.min(1, Math.max(0, (x - xs[i]) / h)),
      u2 = u * u,
      u3 = u2 * u;
    return (
      (2 * u3 - 3 * u2 + 1) * ys[i] +
      (u3 - 2 * u2 + u) * h * m[i] +
      (-2 * u3 + 3 * u2) * ys[i + 1] +
      (u3 - u2) * h * m[i + 1]
    );
  };
}

/** Screens of the K2.2 → K3 move at each knot of the path (K2.4 is passed slowly between 1.0 and 1.3). */
const KNOTS = [0, 0.25, 0.5, 0.8, 1.0, 1.3, 1.7, 2.0];
/** Share of the way from K2.2's field of view to K3's at each knot (hp narrows during the orbit and the tilt). */
const FOV_AT = [0, 0.1, 0.25, 0.4, 0.55, 0.62, 0.82, 1];

const yawTo = (from: THREE.Vector3, to: THREE.Vector3) => Math.atan2(-(to.x - from.x), -(to.z - from.z));
const pitchTo = (from: THREE.Vector3, to: THREE.Vector3) =>
  Math.atan2(to.y - from.y, Math.hypot(to.x - from.x, to.z - from.z));

const cache = new Map<string, (s: number) => CamPose>();
/** The K2.2 → K3 path for format blend t on a screen of this aspect, as a function of screens 0..2. */
function descent(t: number, aspect: number, k22: CamPose) {
  const id = `${t.toFixed(3)} ${aspect.toFixed(3)} ${SAFE_TOP.toFixed(4)}`;
  let fn = cache.get(id);
  if (fn) return fn;
  const L = counterLayout(Math.round(t * LAYOUT_STEPS)),
    { f, leaflet } = L,
    dw = f.dewi,
    k3 = k3View(t, aspect);
  const e0 = new THREE.Euler().setFromQuaternion(k22.quat, "YXZ");
  // over her right shoulder (her right is -x: she faces the door), above it, looking at Heru's hands over the
  // counter; then on past her head toward the top view
  const shoulder = new THREE.Vector3(dw.x - 0.55, 1.92, dw.z - 0.55),
    past = new THREE.Vector3(dw.x - 0.48, 1.88, dw.z - 0.38),
    hands = new THREE.Vector3(leaflet.x - 0.05, f.top + 0.3, leaflet.z + 0.35);
  const pts = [
    k22.pos.clone(),
    new THREE.Vector3(f.aisleX, 1.3, f.aisleZ),
    new THREE.Vector3(f.aisleX - 0.05, 1.45, dw.z - 0.15),
    new THREE.Vector3(dw.x + 0.35, 1.6, Math.max(dw.z - 0.85, f.backZ + 0.35)),
    shoulder,
    past,
    new THREE.Vector3(lerp(dw.x - 0.3, leaflet.x, 0.55), lerp(1.7, k3.pos.y, 0.6), lerp(dw.z + 0.1, leaflet.z, 0.6)),
    k3.pos.clone(),
  ];
  // yaw counted from facing the back wall, turning left (+); unwrapped from K2.2 on
  const yaw = [e0.y, D2R(30), D2R(100), D2R(175), yawTo(shoulder, hands), yawTo(past, hands), D2R(186), Math.PI];
  for (let i = 1; i < yaw.length; i++) while (yaw[i] < yaw[i - 1] - Math.PI) yaw[i] += 2 * Math.PI;
  const pitch = [
    e0.x,
    0,
    D2R(-2),
    D2R(-5),
    pitchTo(shoulder, hands),
    pitchTo(past, hands) - D2R(4),
    D2R(-62),
    -Math.PI / 2,
  ];
  const curve = new THREE.CatmullRomCurve3(pts, false, "centripetal");
  const at = monotone(
    KNOTS,
    KNOTS.map((_, i) => i / (KNOTS.length - 1)),
  );
  const yawAt = monotone(KNOTS, yaw),
    pitchAt = monotone(KNOTS, pitch),
    fovAt = monotone(
      KNOTS,
      FOV_AT.map((k) => lerp(k22.fov, k3.fov, k)),
    );
  fn = (s: number) => ({ pos: curve.getPoint(at(s)), quat: rig(yawAt(s), pitchAt(s)), fov: fovAt(s) });
  if (cache.size > 20) cache.clear();
  cache.set(id, fn);
  return fn;
}

/**
 * Camera on beats 3–4: `s` is screens into the K2.2 → K3 move (0..2), or `k34` 0..1 over the truck from K3 to
 * K4 (the camera rises a little: the binder's page is framed wider than the leaflet).
 */
export function beat34Camera(t: number, aspect: number, k22: CamPose, s: number | null, k34 = 0): CamPose {
  if (s != null) return descent(t, aspect, k22)(s);
  const a = k3View(t, aspect),
    b = k4View(t, aspect),
    e = ease(k34);
  return { pos: a.pos.lerp(b.pos, e), quat: a.quat, fov: lerp(a.fov, b.fov, e) };
}
