// Camera of the Home take (timing in ./timing): plain interpolations between the solved keyframe cameras on the
// way down (K0 → K1), a follow through the door (K1 → K2), a dolly in over Heru's head that pans left to Sinta
// and Bayu (K2 → K2.1) and keeps drifting, then the whip pan right to Nadia and Fajar (K2.1 → K2.2). The whip
// itself is time-based (the world runs it for ±0.45 s once the scroll passes WHIP_AT); here it is a blend
// `whip` 0..1 between the drift after K2.1 and the settle into K2.2, both sampled from the scroll.
import * as THREE from "three";
import { lerp } from "../../core/kit";
import { clamp01, ease, segmentAt } from "../../core/segments";
import { blendCam, type CamPose } from "../../core/take";
import { DATA } from "./data";
import { SEG, TAKE_SCREENS, WHIP_AT, type KeyName } from "./timing";

export { SEG, TAKE_SCREENS, KEYS, keyP, WHIP_AT } from "./timing";
export { followClock, heruAt, heruClock, poseHeru, type HeruState } from "./heru";

const SEG_K2 = SEG.find((s) => s.from === "K2" && s.type === "move")!.screens,
  SEG_K21 = SEG.find((s) => s.from === "K2.1")!.screens;
const kf = (k: KeyName, t: number) => blendCam(DATA.cams.pc[k], DATA.cams.hp[k], t);
const UP = new THREE.Vector3(0, 1, 0);
const yawQ = (a: number) => new THREE.Quaternion().setFromAxisAngle(UP, a);

/** Ease with zero speed at the start and speed `m` (in units of the whole move) at the end. */
const easeTo = (u: number, m: number) => (m - 2) * u ** 3 + (3 - m) * u ** 2;
/** End speed of the dolly into K2.1 (in units of the whole move), so the camera arrives moving and drifts on. */
const ARRIVE = 0.25;
/** Turn the drift after K2.1 keeps going (radians), and how far before K2.2 the settle starts (metres). */
const DRIFT = { yaw: 0.05, settle: 0.14 };

const paths = new Map<string, { curve: THREE.CatmullRomCurve3; atB: number }>();
/** Dolly path K2 → over Heru's head → K2.1 → on, measured by length; `atB` is K2.1's share of it. */
function panPath(t: number, heru: { x: number; z: number }) {
  const A = kf("K2", t),
    B = kf("K2.1", t),
    id = `${t.toFixed(3)} ${heru.x.toFixed(3)} ${heru.z.toFixed(3)}`;
  let c = paths.get(id);
  if (!c) {
    // over Heru's head (hair top 1.8 m), then down to the seated staff
    const over = new THREE.Vector3(lerp(heru.x, B.pos.x, 0.25), 2.02, heru.z - 0.15);
    const dir = B.pos.clone().sub(over).setY(0).normalize();
    const curve = new THREE.CatmullRomCurve3(
      [A.pos, over, B.pos, B.pos.clone().addScaledVector(dir, 0.6)],
      false,
      "centripetal",
    );
    const n = 300,
      L = curve.getLengths(n);
    c = { curve, atB: L[(2 * n) / 3] / L[n] };
    if (paths.size > 40) paths.clear();
    paths.set(id, c);
  }
  return { A, B, ...c };
}

/** Camera after K2.1, before the whip: still drifting forward and left, slowing down (u over the K2.1 move). */
function drift(t: number, heru: { x: number; z: number }, u: number): CamPose {
  const { B, curve, atB } = panPath(t, heru);
  // the same speed per screen as on arrival, easing off over the move
  const k = (1 - (1 - u) ** 2) / 2,
    g = atB * ARRIVE * (SEG_K21 / SEG_K2) * k;
  return { pos: curve.getPointAt(atB + g), quat: yawQ(DRIFT.yaw * 2 * k).multiply(B.quat.clone()), fov: B.fov };
}
/** Camera coming into K2.2 after the whip: a little short of it and still turning right, at rest at u = 1. */
function settle(t: number, u: number): CamPose {
  const C = kf("K2.2", t),
    k = (1 - u) ** 2,
    back = new THREE.Vector3(0, 0, 1).applyQuaternion(C.quat).setY(0).normalize();
  return {
    pos: C.pos.clone().addScaledVector(back, DRIFT.settle * k),
    quat: yawQ(DRIFT.yaw * k).multiply(C.quat.clone()),
    fov: C.fov,
  };
}

/**
 * Camera for p; `heru` bends the K1 → K2 path so the camera follows him through the door and lifts the dolly
 * over his head; `whip` is the eased whip pan (0 = still at K2.1, 1 = at K2.2).
 */
export function cameraAt(
  p: number,
  t: number,
  heru: { x: number; z: number },
  whip: number,
): CamPose & { key: KeyName } {
  const { seg, u } = segmentAt(SEG, p);
  if (seg.type === "hold") return { ...kf(seg.from, t), key: seg.from };
  if (seg.from === "K2") {
    const { A, B, curve, atB } = panPath(t, heru),
      e = easeTo(u, ARRIVE);
    return {
      pos: curve.getPointAt(atB * e),
      quat: A.quat.clone().slerp(B.quat, e),
      fov: lerp(A.fov, B.fov, e),
      key: u < 0.5 ? "K2" : "K2.1",
    };
  }
  if (seg.from === "K2.1") {
    const a = drift(t, heru, u),
      b = settle(t, u);
    return {
      pos: a.pos.lerp(b.pos, whip),
      quat: a.quat.slerp(b.quat, whip),
      fov: lerp(a.fov, b.fov, whip),
      key: whip < 0.5 ? "K2.1" : "K2.2",
    };
  }
  const A = kf(seg.from, t),
    B = kf(seg.to!, t),
    e = ease(u);
  let pos: THREE.Vector3;
  if (seg.from === "K0") pos = A.pos.clone().lerp(B.pos, e);
  else {
    const curve = new THREE.CatmullRomCurve3(
      [A.pos, new THREE.Vector3(heru.x * 0.6, 1.85, 3.2), new THREE.Vector3(heru.x * 0.4, 1.78, 0.4), B.pos],
      false,
      "centripetal",
    );
    pos = curve.getPoint(e);
  }
  return { pos, quat: A.quat.clone().slerp(B.quat, e), fov: lerp(A.fov, B.fov, e), key: u < 0.5 ? seg.from : seg.to! };
}

/** 1 once the scroll is past the whip point (the world eases its whip toward this over ±0.45 s). */
export function whipTarget(p: number) {
  const { seg, u } = segmentAt(SEG, p);
  if (seg.from === "K2.1") return u >= WHIP_AT ? 1 : 0;
  return SEG.indexOf(seg) > SEG.findIndex((s) => s.from === "K2.1") ? 1 : 0;
}

/** Progress of the crane down (K0 → K1), 0..1, for the pigeons flying out of the frame. */
export function craneAt(p: number) {
  const { seg, u } = segmentAt(SEG, p);
  if (seg.from === "K0" && seg.type === "move") return u;
  return SEG.indexOf(seg) > 1 ? 1 : 0;
}

/** True while the camera is inside COMPANY or looking in through the door (the room's actions run). */
export const roomInView = (p: number) => p * TAKE_SCREENS > SEG[0].screens + SEG[1].screens + SEG[2].screens + 0.3;
export { clamp01 };
