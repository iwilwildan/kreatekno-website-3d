// Camera of the Home take (timing in ./timing): plain interpolations between the solved keyframe cameras on the
// way down (K0 → K1), a follow through the door (K1 → K2), a dolly in over Heru's head that pans left to Sinta
// and Bayu (K2 → K2.1) and keeps drifting, then the whip pan right to Nadia and Fajar (K2.1 → K2.2). The whip
// itself is time-based (the world runs it for ±0.45 s once the scroll passes WHIP_AT); here it is a blend
// `whip` 0..1 between the drift after K2.1 and the settle into K2.2, both sampled from the scroll. Beats 3–4
// (K2.2 → K2.4 → K3 → K4) are in ./counter.
import * as THREE from "three";
import { lerp } from "../../core/kit";
import { clamp01, ease, segmentAt } from "../../core/segments";
import { blendCam, type CamPose } from "../../core/take";
import { beat34Camera, k3View, k4View } from "./counter";
import { DATA, type SolvedKey } from "./data";
import { LOBBY_START, lobbyCamera } from "./lobby";
import { B5, beat5Camera } from "./outside";
import { B9_START, beat9Camera } from "./beat9";
import { pairX, scrollClock } from "./outsideCast";
import { LAYOUT_STEPS } from "../../sets/companyFront";
import { SEG, TAKE_SCREENS, WHIP_AT, type KeyName } from "./timing";

export { SEG, TAKE_SCREENS, KEYS, keyP, WHIP_AT } from "./timing";
export { followDoorClock, heruAt, heruClock, heruGate, poseHeru, type HeruState } from "./heru";

const SEG_K2 = SEG.find((s) => s.from === "K2" && s.type === "move")!.screens,
  SEG_K21 = SEG.find((s) => s.from === "K2.1")!.screens;
const UP = new THREE.Vector3(0, 1, 0),
  RIGHT = new THREE.Vector3(1, 0, 0);
const yawQ = (a: number) => new THREE.Quaternion().setFromAxisAngle(UP, a);
const pitchQ = (a: number) => new THREE.Quaternion().setFromAxisAngle(RIGHT, a);

// Issue #15: the front panels of the desks get copy, so they stay whole, a little clear of the edges of the frame,
// at K2.1 and K2.2 and on the way there.
/** pc: the solved K2.1 and K2.2 cameras tilt down this much (radians; none on hp, where the panels sit mid-frame). */
const TILT: Partial<Record<SolvedKey, number>> = { "K2.1": 0.07, "K2.2": 0.062 },
  /** pc: extra tilt down at the middle of the dolly K2 → K2.1 (radians), as the camera comes down past Heru. */
  DIP = 0.1;
/**
 * Phones narrower than 9:16 (most of them): the two panels of each shot already span the screen's width, so K2.1
 * and K2.2 step back (metres) and K2.2 turns a little left (radians) to keep both whole. `narrow` is 0 at 9:16 and
 * wider (the hp keyframes' own format, where they fit), 1 at 375 × 812.
 */
const BACK: Partial<Record<SolvedKey, number>> = { "K2.1": 0.45, "K2.2": 0.6 },
  TURN: Partial<Record<SolvedKey, number>> = { "K2.2": 0.013 };
const narrowness = (aspect: number) => Math.min(1.5, Math.max(0, (9 / 16 - aspect) / (9 / 16 - 375 / 812)));
const kf = (k: SolvedKey, t: number, narrow = 0) => {
  const c = blendCam(DATA.cams.pc[k], DATA.cams.hp[k], t);
  if (narrow > 0 && BACK[k]) {
    const fwd = new THREE.Vector3(0, 0, -1).applyQuaternion(c.quat).setY(0).normalize();
    c.pos.addScaledVector(fwd, -BACK[k] * narrow);
    c.quat.premultiply(yawQ((TURN[k] ?? 0) * narrow));
  }
  if (TILT[k]) c.quat.multiply(pitchQ(-TILT[k] * (1 - t)));
  return c;
};

/** Ease with zero speed at the start and speed `m` (in units of the whole move) at the end. */
const easeTo = (u: number, m: number) => (m - 2) * u ** 3 + (3 - m) * u ** 2;
/** End speed of the dolly into K2.1 (in units of the whole move), so the camera arrives moving and drifts on. */
const ARRIVE = 0.25;
/** Turn the drift after K2.1 keeps going (radians), and how far before K2.2 the settle starts (metres). */
const DRIFT = { yaw: 0.05, settle: 0.14 };

const paths = new Map<string, { curve: THREE.CatmullRomCurve3; atB: number }>();
/** Dolly path K2 → over Heru's head → K2.1 → on, measured by length; `atB` is K2.1's share of it. */
function panPath(t: number, heru: { x: number; z: number }, narrow: number) {
  const A = kf("K2", t),
    B = kf("K2.1", t, narrow),
    id = `${t.toFixed(3)} ${narrow.toFixed(3)} ${heru.x.toFixed(3)} ${heru.z.toFixed(3)}`;
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
function drift(t: number, heru: { x: number; z: number }, u: number, narrow: number): CamPose {
  const { B, curve, atB } = panPath(t, heru, narrow);
  // the same speed per screen as on arrival, easing off over the move
  const k = (1 - (1 - u) ** 2) / 2,
    g = atB * ARRIVE * (SEG_K21 / SEG_K2) * k;
  return { pos: curve.getPointAt(atB + g), quat: yawQ(DRIFT.yaw * 2 * k).multiply(B.quat.clone()), fov: B.fov };
}
/** Camera coming into K2.2 after the whip: a little short of it and still turning right, at rest at u = 1. */
function settle(t: number, u: number, narrow: number): CamPose {
  const C = kf("K2.2", t, narrow),
    k = (1 - u) ** 2,
    back = new THREE.Vector3(0, 0, 1).applyQuaternion(C.quat).setY(0).normalize();
  return {
    pos: C.pos.clone().addScaledVector(back, DRIFT.settle * k),
    quat: yawQ(DRIFT.yaw * k).multiply(C.quat.clone()),
    fov: C.fov,
  };
}

const SEG_K22 = SEG.find((s) => s.from === "K2.2" && s.type === "move")!.screens;

/**
 * Camera for p; `heru` bends the K1 → K2 path so the camera follows him through the door and lifts the dolly
 * over his head; `whip` is the eased whip pan (0 = still at K2.1, 1 = at K2.2); `aspect` (width / height of the
 * screen) keeps the paper whole in the top views of beats 3–4; `outClock` is Heru's and Bu Dewi's clock out on the
 * street (default: where the scroll puts it), whose pair the truck follows along the row.
 */
export function cameraAt(
  p: number,
  t: number,
  heru: { x: number; z: number },
  whip: number,
  aspect = 16 / 9,
  outClock?: number,
): CamPose & { key: KeyName } {
  const { seg, u, start } = segmentAt(SEG, p);
  const x = start + u * seg.screens,
    narrow = narrowness(aspect);
  // beats 9b–11 (tahap 8, greybox): out of the lobby to the plaque, up into the sky and down at COMPANY
  if (x > B9_START) return { ...beat9Camera(x, t, aspect), key: seg.type === "hold" || u < 0.5 ? seg.from : seg.to! };
  // beats 6–9a (tahap 7): in through Kreatekno's door from where the truck stopped at K5a.6
  if (x >= LOBBY_START) {
    const k56 = beat5Camera(LOBBY_START, Math.round(t * LAYOUT_STEPS), t, aspect, pairX(scrollClock(LOBBY_START)));
    const key = seg.type === "hold" || u < 0.5 ? seg.from : seg.to!;
    return { ...lobbyCamera(x, t, aspect, k56), key };
  }
  if (x > B5.rise) {
    const key = seg.type === "hold" || u < 0.5 ? seg.from : seg.to!;
    const pair = x >= B5.truck ? pairX(outClock ?? scrollClock(x)) : 0;
    return { ...beat5Camera(x, Math.round(t * LAYOUT_STEPS), t, aspect, pair), key };
  }
  if (seg.from === "K3" || seg.from === "K4") {
    if (seg.type === "hold") return { ...(seg.from === "K3" ? k3View : k4View)(t, aspect), key: seg.from };
    return { ...beat34Camera(t, aspect, kf("K2.2", t, narrow), null, u), key: u < 0.5 ? "K3" : "K4" };
  }
  if (seg.type === "move" && (seg.from === "K2.2" || seg.from === "K2.4")) {
    const s = seg.from === "K2.2" ? u * seg.screens : SEG_K22 + u * seg.screens;
    const key = s < SEG_K22 * 0.6 ? "K2.2" : s < SEG_K22 + seg.screens * 0.5 ? "K2.4" : "K3";
    return { ...beat34Camera(t, aspect, kf("K2.2", t, narrow), s), key };
  }
  if (seg.type === "hold") return { ...kf(seg.from as SolvedKey, t, narrow), key: seg.from };
  if (seg.from === "K2") {
    const { A, B, curve, atB } = panPath(t, heru, narrow),
      e = easeTo(u, ARRIVE),
      // issue #15: coming down past Heru's head the camera looks a little lower, so Sinta's and Bayu's panels do
      // not dip under the bottom edge on the way (most at e = 2/3, none at either end)
      dip = DIP * (1 - t) * (27 / 4) * e ** 2 * (1 - e);
    return {
      pos: curve.getPointAt(atB * e),
      quat: A.quat.clone().slerp(B.quat, e).multiply(pitchQ(-dip)),
      fov: lerp(A.fov, B.fov, e),
      key: u < 0.5 ? "K2" : "K2.1",
    };
  }
  if (seg.from === "K2.1") {
    const a = drift(t, heru, u, narrow),
      b = settle(t, u, narrow);
    return {
      pos: a.pos.lerp(b.pos, whip),
      quat: a.quat.slerp(b.quat, whip),
      fov: lerp(a.fov, b.fov, whip),
      key: whip < 0.5 ? "K2.1" : "K2.2",
    };
  }
  const A = kf(seg.from as SolvedKey, t),
    B = kf(seg.to as SolvedKey, t),
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
export const roomInView = (p: number) =>
  p * TAKE_SCREENS > SEG[0].screens + SEG[1].screens + SEG[2].screens + 0.3 && p * TAKE_SCREENS < B5.truck;
export { clamp01 };
