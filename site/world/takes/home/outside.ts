// Beats 5a–5b (tahap 6, the team's videos K4 → K5a.6): the camera rises off the binder turning half round and
// tilts up over Heru's shoulder to Bu Dewi nodding (K4.1), dollies straight back down the middle of the room and out
// through the door to the facade (K4.2, passed slowly), dollies out and up as Heru and Bu Dewi come out (K5a.1),
// then trucks right along the row of shophouses facing the facades square on, keeping Heru and Bu Dewi in the
// middle of the frame as they walk (issue #2: it used to stand still on K5a.2–K5a.4, two panels each), and settles
// on K5a.6 at Kreatekno's door. Their walk on the street is bound to the scroll (./outsideCast), and the camera
// follows their clock, so they stay in the middle however the visitor scrolls.
// The street cameras were measured on the videos' last frames (vanishing point of the paving joints, scale of the
// door and the shops, depth from the kerb), with the site's set held as built.
import * as THREE from "three";
import { lerp } from "../../core/kit";
import { clamp01, ease, segmentStart, smoothstep } from "../../core/segments";
import type { CamPose } from "../../core/take";
import { KREATEKNO } from "../../sets/rowLayout";
import { counterLayout, k4View, monotone } from "./counter";
import { counterSpots } from "./counterCast";
import { SEG, type KeyName } from "./timing";

const D2R = THREE.MathUtils.degToRad;
const rig = (yaw: number, pitch: number) =>
  new THREE.Quaternion().setFromEuler(new THREE.Euler(Math.max(-Math.PI / 2, pitch), yaw, 0, "YXZ"));
const yawTo = (from: THREE.Vector3, to: THREE.Vector3) => Math.atan2(-(to.x - from.x), -(to.z - from.z));
const pitchTo = (from: THREE.Vector3, to: THREE.Vector3) =>
  Math.atan2(to.y - from.y, Math.hypot(to.x - from.x, to.z - from.z));

const idx = (from: KeyName, type: "move" | "hold") => SEG.findIndex((s) => s.from === from && s.type === type);
/** Screens where beat 5 starts (the move off K4) and where each of its pieces starts. */
export const B5 = {
  rise: segmentStart(SEG, idx("K4", "move")),
  back: segmentStart(SEG, idx("K4.1", "move")),
  truck: segmentStart(SEG, idx("K5a.1", "hold")),
  /** The front room of COMPANY is let go from the K5a.2 hold on (built again when the visitor scrolls back). */
  release: segmentStart(SEG, idx("K5a.2", "hold")),
  end: segmentStart(SEG, SEG.length),
};
/** Move K4 → K4.1 (screens) and the dolly K4.1 → K4.2 → K5a.1. */
const RISE = SEG[idx("K4", "move")].screens,
  BACK = SEG[idx("K4.1", "move")].screens + SEG[idx("K4.2", "move")].screens,
  K42_AT = SEG[idx("K4.1", "move")].screens;

// ---------- keyframe cameras outside (pc 16:9 measured on the videos; hp 9:16 designed) ----------
type Lens = { y: number; z: number; fov: number };
const OUT = {
  // K4.2: frontal on the facade at eye height, a little right of the door (paving joints meet at x +0.62 m, 1.40 m
  // up; the kerb puts the camera 5.8 m out), looking up 1°
  K42: { pc: { x: 0.62, y: 1.4, z: 5.8, fov: 43.6, pitch: 1 }, hp: { x: -0.45, y: 1.9, z: 8.0, fov: 58, pitch: 2 } },
  // K5a.1: COMPANY's door left of centre, the fruit shop whole on the right
  K51: { pc: { x: 3.82, y: 3.27, z: 10.9, fov: 43.9 }, hp: { x: -0.2, y: 3.0, z: 10.5, fov: 58 } },
  // the truck: level, square on to the facades; pc frames 2.35 shops, hp a panel at ±84% of the width
  truck: { pc: { y: 3.63, z: 12.7, fov: 40.3 } as Lens, hp: { y: 4.0, z: 11.0, fov: 53 } as Lens },
};

/** Frame centre at K5a.6 (pc 0.42 of Kreatekno's width, as the video; 9:16 just left of its door). */
const k56X = (t: number) => lerp(KREATEKNO.x0 + 0.42 * KREATEKNO.w, KREATEKNO.door.cx - 0.4, t);

/** Screens of each hold of the truck (start, length), from the K5a.1 hold on. */
const holds = (["K5a.1", "K5a.2", "K5a.3", "K5a.4", "K5a.6"] as const).map((k) => {
  const i = idx(k, "hold");
  return { s: segmentStart(SEG, i), len: SEG[i].screens };
});

/** hp: which panels each hold shows, as shop indices (for the copy's on-screen size, panelArrivals). */
const HP_PANELS = [
  [0, 1],
  [2, 3],
  [4, 5],
];
/** On 9:16 the share of a hold between its first panel and its second (screens). */
const HP_SHIFT = 0.16;

/** Smooth minimum of a and b over a blend of r (metres): no kink where the camera starts or stops following. */
function smin(a: number, b: number, r: number) {
  const h = clamp01(0.5 + (0.5 * (b - a)) / r);
  return lerp(b, a, h) - r * h * (1 - h);
}

/**
 * Camera x on the street for the pair's x (their middle, from ./outsideCast pairX): it stays on K5a.1 until they
 * walk into the middle of its frame, follows them, and stops on K5a.6's framing at Kreatekno.
 */
export const truckX = (pair: number, t: number) =>
  -smin(-smin(pair, k56X(t), 1.2), -lerp(OUT.K51.pc.x, OUT.K51.hp.x, t), 1.2);

/**
 * Field of view for a frontal street camera: the keyframe's vertical fov at its own aspect (16:9 … 9:16 by t),
 * widened on a narrower screen so the width it frames is kept (the panels stay whole on 375 × 812).
 */
export function fitFov(fov: number, t: number, aspect: number) {
  const akey = Math.exp(lerp(Math.log(16 / 9), Math.log(9 / 16), t));
  if (aspect >= akey) return fov;
  return THREE.MathUtils.radToDeg(2 * Math.atan(Math.tan(D2R(fov) / 2) * (akey / aspect)));
}

// ---------- K4 → K4.1 → K4.2 inside ----------
const blendLens = <T extends Record<string, number>>(a: T, b: T, t: number) =>
  Object.fromEntries(Object.keys(a).map((k) => [k, lerp(a[k], b[k], t)])) as T;

/** Over Heru's left shoulder at the counter, looking at Bu Dewi (video K4.1: she is in the middle, he at the right). */
export function k41View(step: number, t: number): CamPose {
  const L = counterLayout(step),
    { stand } = counterSpots(L),
    dewi = L.f.dewi;
  // 1.8 m behind him (9:16 1.6 m), she is in the middle, the counter's front edge near the bottom of the frame;
  // always on the same side (a blend of a left and a right camera put it right behind him on in-between screens):
  // pc 1.2 m to his left, 9:16 1.0 m, so his head stays at the right of the frame and clear of her face; on 9:16
  // lower, under the pendant lamps' shades (from 2.2 m)
  const pos = new THREE.Vector3(stand.x - lerp(1.2, 1.0, t), lerp(2.1, 1.9, t), stand.z + lerp(1.8, 1.6, t));
  const look = new THREE.Vector3(dewi.x, dewi.y + lerp(1.0, 1.1, t), dewi.z);
  return { pos, quat: rig(yawTo(pos, look), pitchTo(pos, look)), fov: lerp(30, 50, t) };
}
const k42View = (t: number, aspect: number): CamPose => {
  const c = blendLens(OUT.K42.pc, OUT.K42.hp, t);
  return { pos: new THREE.Vector3(c.x, c.y, c.z), quat: rig(0, D2R(c.pitch)), fov: fitFov(c.fov, t, aspect) };
};

const cache = new Map<string, (s: number) => CamPose>();
/** Share of the curve's length at each of its control points (for a timing by distance along it). */
function pointShares(curve: THREE.CatmullRomCurve3) {
  const n = curve.points.length - 1,
    div = n * 60,
    L = curve.getLengths(div);
  return curve.points.map((_, i) => L[i * 60] / L[div]);
}

/** K4 → K4.1 for screens s (0..RISE): rise off the binder turning half round looking down, then tilt up behind Heru. */
function riseCam(step: number, t: number, aspect: number) {
  const id = `r ${step} ${t.toFixed(3)} ${aspect.toFixed(3)}`;
  let fn = cache.get(id);
  if (fn) return fn;
  const a = k4View(t, aspect),
    b = k41View(step, t),
    L = counterLayout(step),
    eb = new THREE.Euler().setFromQuaternion(b.quat, "YXZ");
  // kept under the pendant lamps' shades (from 2.2 m) and clear of them sideways: over the binder, then across
  // to K4.1's side first and back along it
  const top = new THREE.Vector3(L.binderK4.x, L.f.top + 1.05, L.binderK4.z + 0.15),
    behind = new THREE.Vector3(b.pos.x, lerp(top.y, b.pos.y, 0.5), lerp(top.z, b.pos.z, 0.35));
  const curve = new THREE.CatmullRomCurve3([a.pos, top, behind, b.pos], false, "centripetal");
  // rises over the binder while it turns (first half), then swings back behind Heru while it tilts up (video:
  // 0–3 s, 3–5 s)
  const at = monotone(
    [0, 0.5, 0.8, 1].map((k) => k * RISE),
    pointShares(curve),
  );
  // the turn: yaw π → 2π looking straight down (the picture turns clockwise), then the tilt up
  let yawB = eb.y;
  while (yawB < Math.PI) yawB += 2 * Math.PI;
  fn = (s: number) => {
    const turn = ease(clamp01(s / (0.5 * RISE))),
      tilt = smoothstep(0.45 * RISE, 0.85 * RISE, s);
    const yaw = lerp(Math.PI, 2 * Math.PI, turn) + (yawB - 2 * Math.PI) * tilt,
      pitch = lerp(-Math.PI / 2, eb.x, tilt);
    return {
      pos: curve.getPointAt(clamp01(at(s))),
      quat: rig(yaw, pitch),
      fov: lerp(a.fov, b.fov, ease(clamp01(s / RISE))),
    };
  };
  if (cache.size > 40) cache.clear();
  cache.set(id, fn);
  return fn;
}

/** K4.1 → K4.2 → K5a.1 for screens s (0..BACK): straight back through the gap and the door, out to the facade. */
function backCam(step: number, t: number, aspect: number) {
  const id = `b ${step} ${t.toFixed(3)} ${aspect.toFixed(3)}`;
  let fn = cache.get(id);
  if (fn) return fn;
  const a = k41View(step, t),
    L = counterLayout(step),
    ea = new THREE.Euler().setFromQuaternion(a.quat, "YXZ"),
    k42 = k42View(t, aspect),
    k51 = blendLens(OUT.K51.pc, OUT.K51.hp, t);
  k51.fov = fitFov(k51.fov, t, aspect);
  // back over the desks' row through the gap between Bayu's and Nadia's desks (the camera starts above it or
  // just behind it), then the door
  const pts = [
    a.pos,
    new THREE.Vector3(lerp(a.pos.x, L.f.gapX, 0.7), 1.8, Math.max(L.f.gapZ, a.pos.z) + 0.9),
    new THREE.Vector3(0.05, 1.55, -0.6),
    new THREE.Vector3(0.2, 1.48, 1.3),
    new THREE.Vector3(lerp(0.2, k42.pos.x, 0.8), lerp(1.48, k42.pos.y, 0.8), k42.pos.z - 1.0),
    k42.pos,
    new THREE.Vector3(k51.x, k51.y, k51.z),
  ];
  const curve = new THREE.CatmullRomCurve3(pts, false, "centripetal");
  // through the gap, the door (fast, as in the video), out, slowing to a standstill at K4.2 (a pass, not a hold:
  // the scroll goes straight on), then easing out to K5a.1
  const F = pointShares(curve),
    first = monotone([0, 0.12, 0.22, 0.3, 0.42, K42_AT], F.slice(0, 6)),
    at = (s: number) => (s <= K42_AT ? first(s) : lerp(F[5], 1, ease(clamp01((s - K42_AT) / (BACK - K42_AT)))));
  fn = (s: number) => {
    const out = smoothstep(K42_AT, BACK, s),
      k42Pitch = D2R(lerp(OUT.K42.pc.pitch, OUT.K42.hp.pitch, t));
    const yaw = lerp(ea.y, 0, ease(clamp01(s / 0.3))),
      pitch = lerp(lerp(ea.x, k42Pitch, ease(clamp01(s / 0.36))), 0, out);
    const fov = lerp(lerp(a.fov, k42.fov, smoothstep(0.2, K42_AT, s)), k51.fov, out);
    return { pos: curve.getPointAt(clamp01(at(s))), quat: rig(yaw, pitch), fov };
  };
  if (cache.size > 40) cache.clear();
  cache.set(id, fn);
  return fn;
}

/** The truck from the K5a.1 hold on (screens s since its start), following the pair at x `pair`. */
function truckCam(s: number, t: number, aspect: number, pair: number): CamPose {
  const a = blendLens(OUT.K51.pc, OUT.K51.hp, t),
    b = blendLens(OUT.truck.pc, OUT.truck.hp, t),
    k = ease(clamp01((s - holds[0].len) / SEG[idx("K5a.1", "move")].screens));
  return {
    pos: new THREE.Vector3(lerp(a.x, truckX(pair, t), k), lerp(a.y, b.y, k), lerp(a.z, b.z, k)),
    quat: rig(0, 0),
    fov: fitFov(lerp(a.fov, b.fov, k), t, aspect),
  };
}

/**
 * Camera of beat 5 for screens x into the take (≥ B5.rise), layout step, format blend t, screen aspect, and the x of
 * Heru and Bu Dewi out on the street (their middle, which the truck follows).
 */
export function beat5Camera(x: number, step: number, t: number, aspect: number, pair: number): CamPose {
  if (x < B5.back) return riseCam(step, t, aspect)(Math.min(RISE, x - B5.rise));
  if (x < B5.truck) return backCam(step, t, aspect)(x - B5.back);
  return truckCam(x - B5.truck, t, aspect, pair);
}

/**
 * 0 … 1 as the camera tilts up off the top view of K4 toward K4.1: Heru's and Bu Dewi's right hands leave the spots
 * by the binder (where the close-up hands lay in the top view) for a natural pose seen from the side.
 */
export const b5Relax = (x: number) => smoothstep(B5.rise + 0.45 * RISE, B5.rise + 0.85 * RISE, x);

/**
 * Scroll points on the row near each panel (screens): pc one per hold K5a.2–K5a.4, 9:16 one per panel (two in a
 * hold). The world measures the copy's on-screen size from the cameras there (the truck faces the panels square on,
 * so the size is the same wherever it passes them).
 */
export function panelArrivals(hp: boolean) {
  return holds.slice(1, -1).flatMap((h, i) => {
    if (!hp || HP_PANELS[i].length === 1) return [h.s];
    return [h.s, h.s + (h.len - HP_SHIFT) / 2 + HP_SHIFT];
  });
}

/** Screens of the truck's holds (start, length), K5a.1 … K5a.6. */
export const TRUCK_HOLDS = holds;
/** Screens where the dolly passes K4.2. */
export const K42_PASS = B5.back + K42_AT;
