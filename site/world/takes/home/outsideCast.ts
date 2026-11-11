// Heru and Bu Dewi out on the street (beats 5a–5b, the team's videos k5a.1 - k4.2 … k5a.5 - k5a.6), on their own
// clock (revision 7 Nov): once the scroll has passed K4.2 they come out of COMPANY's door, Heru first, pushing the
// left leaf open and holding it while Bu Dewi steps out; the leaf swings shut and they walk side by side along the
// row at a natural pace (1.3 m/s), Heru on the shop side; near Kreatekno he quickens, swings round her on the road
// side, pushes Kreatekno's door open, steps in and turns to face her; she walks up to the door.
// The clock is seconds of that walk and follows the scroll both ways (revision 7 Nov, after a first take on a free
// clock): the scroll sets where it should be, they walk there at their pace (at most 1.5× to catch up) and stop when
// they get there; scrolling up walks them back. Far behind or ahead and out of view, they are moved (stepOutClock).
// Along the row (issue #2) the clock is bound to the scroll itself, and the camera follows them (pairX).
// Everything is a pure function of the clock (stills and review shots set it from the scroll, scrollClock), and
// every walk is laid out by distance (cast/walk.ts), so the feet never slide, forward or back.
import * as THREE from "three";
import type { CastMember } from "../../cast/member";
import { turnStride, Walk, walkPose, type Stride } from "../../cast/walk";
import { clamp01, smoothstep } from "../../core/segments";
import { KREATEKNO } from "../../sets/rowLayout";
import { DATA } from "./data";
import { followClock } from "./heru";
import { K42_PASS, TRUCK_HOLDS } from "./outside";
import { dampStep, type Damped } from "../../motion/damp";

/** Natural walking pace (m/s), how much faster they may go to catch up with the scroll, and Heru's quickened pace. */
export const OUT_SPEED = 1.3,
  OUT_PACE = 1.5;
const HURRY = 1.8;
/** Screens where they start coming out (the door opens a moment after the camera has passed K4.2). */
export const OUT_START = K42_PASS + 0.15;

const V = (x: number, z: number) => new THREE.Vector3(x, 0, z);

/**
 * A walk along a path laid out in time: the pace eases toward vOf(d) (accel m/s²) and down to a stop at the end.
 * Integrated once at 120 Hz; at(t) is the distance walked t seconds after it starts.
 */
class TimedWalk {
  readonly walk: Walk;
  readonly dur: number;
  private ds: number[] = [0];
  constructor(points: THREE.Vector3[], vOf: (d: number) => number, step: number, first: "L" | "R", accel = 1.6) {
    this.walk = new Walk(points, { step, first });
    const L = this.walk.length,
      dt = 1 / 120;
    let d = 0,
      v = 0;
    while (d < L - 1e-4 && this.ds.length < 120 * 300) {
      const want = Math.min(vOf(d), Math.sqrt(2 * accel * Math.max(0, L - d)));
      v = want > v ? Math.min(want, v + accel * dt) : Math.max(want, v - accel * dt);
      d = Math.min(L, d + Math.max(v, 0.02) * dt);
      this.ds.push(d);
    }
    this.dur = (this.ds.length - 1) * dt;
  }
  at(t: number) {
    const k = clamp01(t / this.dur) * (this.ds.length - 1),
      i = Math.floor(k),
      f = k - i;
    return this.ds[Math.min(i, this.ds.length - 1)] * (1 - f) + this.ds[Math.min(i + 1, this.ds.length - 1)] * f;
  }
  stride(t: number): Stride {
    return this.walk.at(this.at(t));
  }
}

// ---------- the doors ----------
const DW = DATA.ext.dw;
/** COMPANY's left leaf: hinge, leaf width, and its free edge for an angle (it opens outward, toward the street). */
const LEFT = { hinge: V(-DW + 0.05, -0.1), w: DW - 0.07, open: -1.4 };
/** COMPANY's right leaf opened outward on the way out (its hinge is at the door's right edge; sets/street.ts). */
const RIGHT_OPEN = 1.4;
const leftEdge = (angle: number) =>
  new THREE.Vector3(LEFT.w, 1.0, 0).applyAxisAngle(new THREE.Vector3(0, 1, 0), angle).add(LEFT.hinge);
/** Kreatekno's hinged leaf (sets/row.ts): hinge at the door's right edge, opening inward. */
const KD = KREATEKNO.door;
const KRE = { hinge: V(KD.cx + KD.w / 2, -0.04), w: KD.w / 2, open: -1.3 };
const kreHandle = (angle: number) =>
  new THREE.Vector3(-KRE.w + 0.14, 1.05, 0.09).applyAxisAngle(new THREE.Vector3(0, 1, 0), angle).add(KRE.hinge);

// ---------- paths and the timeline (clock seconds) ----------
/** Heru's spot holding the left leaf, and where the walk along the row runs (z) for each of them. */
const HOLD = V(-0.45, 0.5);
const LANE = { heru: 0.55, dewi: 0.95 };
const H1 = new TimedWalk([V(-0.4, -1.3), V(-0.5, -0.4), HOLD], () => OUT_SPEED, 0.42, "L");
// along the row; 10 m before the door he quickens and swings round her on the road side, then in to the door
const hDoor = V(KD.cx + 0.2, 0.32);
const H2pts = [
  HOLD,
  V(0.6, LANE.heru + 0.05),
  V(3.0, LANE.heru),
  V(KD.cx - 11, LANE.heru),
  V(KD.cx - 6.5, 1.15),
  V(KD.cx - 2.2, 1.0),
  V(KD.cx - 0.5, 0.55),
  hDoor,
];
// the hurry is set by distance: the last 11 m at HURRY
const H2len = new Walk(H2pts).length;
const H2h = new TimedWalk(H2pts, (d) => (d > H2len - 11 ? HURRY : OUT_SPEED), 0.42, "R");
const H3 = new TimedWalk([hDoor, V(KD.cx + 0.3, -0.25), V(KD.cx + 0.4, -0.8)], () => 0.9, 0.38, "L");
const D1 = new TimedWalk(
  // out through the right half and on past the end of the right leaf (open outward to z 0.83) before turning right
  [V(0.4, -1.9), V(0.38, -0.6), V(0.36, 0.75), V(0.5, 1.25), V(1.05, 1.22), V(1.4, LANE.dewi)],
  () => OUT_SPEED,
  0.36,
  "R",
);
const dEnd = V(KD.cx - 0.35, 0.62);
const D2 = new TimedWalk(
  [V(1.4, LANE.dewi), V(4.0, LANE.dewi), V(KD.cx - 3.0, LANE.dewi), V(KD.cx - 1.2, 0.85), dEnd],
  () => OUT_SPEED,
  0.36,
  "L",
);

/** When each part starts (clock seconds). */
const T = (() => {
  const h1 = 0,
    leafOpen: [number, number] = [0.35, 1.0],
    d1 = 0.9,
    // Heru lets go once she is past the leaf, and walks on; she waits by the shop until he is beside her
    h2 = d1 + D1.dur - 0.3,
    leafShut: [number, number] = [h2, h2 + 1.1],
    d2 = h2 + 1.3,
    h3 = h2 + H2h.dur,
    kreOpen: [number, number] = [h3 - 0.25, h3 + 0.9],
    turn: [number, number] = [h3 + 0.6 + H3.dur, h3 + 0.6 + H3.dur + 1.2],
    dTurn: [number, number] = [d2 + D2.dur, d2 + D2.dur + 0.8];
  return { h1, leafOpen, d1, h2, leafShut, d2, h3, kreOpen, turn, dTurn, end: Math.max(turn[1], dTurn[1]) + 0.3 };
})();
/** The clock when everything is done (Heru inside the door facing her, Bu Dewi at the door). */
export const OUT_END = T.end;

/**
 * Where the clock would be for scroll screens x if they kept up with it: coming out over the K4.2 → K5a.1 move and
 * the K5a.1 hold, then along the row so that each hold of the truck finds them in the frame, done at K5a.6.
 */
export function scrollClock(x: number) {
  const h1 = TRUCK_HOLDS[0],
    k6 = TRUCK_HOLDS[TRUCK_HOLDS.length - 1],
    outDone = h1.s + h1.len,
    walkFrom = T.h2 + 0.6;
  if (x <= OUT_START) return 0;
  if (x <= outDone) return ((x - OUT_START) / (outDone - OUT_START)) * walkFrom;
  return walkFrom + clamp01((x - outDone) / (k6.s + k6.len * 0.5 - outDone)) * (OUT_END - walkFrom);
}

/**
 * Moves their clock toward the scroll's (scrollClock) over dt seconds, forward or back, at most OUT_PACE × their
 * pace (revision 7 Nov: they follow the scroll both ways, like Heru in beats 1 and 3). When they are far from where
 * the scroll wants them and out of the camera's view (`seen` says whether a clock's state is on screen), they are
 * moved straight to a point short of it that is also out of view, and walk the rest in sight: a long scroll never
 * makes them march backwards for half a minute, and the move is never seen.
 */
export function stepOutClock(c: Damped, x: number, dt: number, seen: (clock: number) => boolean) {
  // the camera is back inside (or at the door): they are at the counter
  if (x < K42_PASS) {
    c.x = c.v = 0;
    return c;
  }
  const target = scrollClock(x),
    gap = target - c.x;
  // along the row (issue #2) they walk as the scroll goes, at its pace, and the camera keeps them in the middle; a
  // stiff spring only takes up what the paced walk out of the door left behind, without a jump
  if (x >= STREET) {
    dampStep(c, target, BOUND, dt);
    if (Math.abs(c.x - target) < 1e-4 && Math.abs(c.v) < 1e-3) {
      c.x = target;
      c.v = 0;
    }
    return c;
  }
  if (Math.abs(gap) > SNAP_GAP && !seen(c.x)) {
    for (const lead of [1.5, 3, 5, 8, 12]) {
      const k = Math.max(0, target - Math.sign(gap) * lead);
      // only a move that brings them closer (else a clock just moved there would be put back every frame)
      if (Math.abs(target - k) > Math.abs(gap) - 1) break;
      if (!seen(k)) {
        c.x = k;
        c.v = 0;
        break;
      }
    }
  }
  return followClock(c, target, dt);
}
/** Seconds of walk between them and the scroll's point beyond which they may be moved while out of view. */
const SNAP_GAP = 3;
/** Screens from which their clock is bound to the scroll (the end of the K5a.1 hold: the walk along the row). */
const STREET = TRUCK_HOLDS[0].s + TRUCK_HOLDS[0].len;
/** Stiffness of that binding (1/s). */
const BOUND = 12;

let pairTable: Float32Array | null = null;
const PAIR_HZ = 30;
/**
 * The x the camera keeps in the middle on the street at clock c: halfway between Heru and Bu Dewi, smoothed over
 * ±0.6 s of their walk (their steps, her wait at the door, his hurry) and never going back while they walk on.
 */
export function pairX(c: number) {
  if (!pairTable) {
    const n = Math.ceil(OUT_END * PAIR_HZ) + 1,
      raw = new Float32Array(n);
    for (let i = 0; i < n; i++) {
      const st = outsideState(Math.max(1e-3, i / PAIR_HZ))!;
      raw[i] = (st.heru.body.x + st.dewi.body.x) / 2;
    }
    const w = Math.round(0.6 * PAIR_HZ);
    pairTable = new Float32Array(n);
    let top = -Infinity;
    for (let i = 0; i < n; i++) {
      let sum = 0,
        k = 0;
      for (let j = Math.max(0, i - w); j <= Math.min(n - 1, i + w); j++, k++) sum += raw[j];
      top = Math.max(top, sum / k);
      pairTable[i] = top;
    }
  }
  const k = Math.min(Math.max(0, c), OUT_END) * PAIR_HZ,
    i = Math.min(Math.floor(k), pairTable.length - 2),
    f = Math.min(1, k - i);
  return pairTable[i] * (1 - f) + pairTable[i + 1] * f;
}

export type OutsideState = {
  heru: Stride;
  dewi: Stride;
  /** COMPANY's left leaf and Kreatekno's leaf (radians about their hinges). */
  leftLeaf: number;
  kreLeaf: number;
  /** Heru's right hand on a door (world point and weight), and their heads turned toward each other. */
  reach: { at: THREE.Vector3; weight: number } | null;
  look: number;
};

const ph = (c: number, [a, b]: readonly [number, number]) => smoothstep(a, b, c);

/**
 * COMPANY's right leaf on the way out (radians about its hinge; issue #8). It swung shut once the camera was out
 * (video k4.2 - k4.1); as in video k5a.1 - k4.2 both leaves then open outward together and Bu Dewi comes out
 * through the right half, stepping out past the leaf's end before she turns right (D1); it shuts with the left one.
 * Beat 1 is unchanged: there Heru pushes this leaf inward.
 */
export const rightLeaf = (c: number) => (c <= 0 ? 0 : RIGHT_OPEN * (ph(c, T.leafOpen) - ph(c, T.leafShut)));
/** The shortest turn from yaw a to yaw b. */
const turnTo = (a: number, b: number) => Math.atan2(Math.sin(b - a), Math.cos(b - a));

/** Their whole state at clock c (null while still inside). */
export function outsideState(c: number): OutsideState | null {
  if (c <= 0) return null;
  const leftLeaf = LEFT.open * (ph(c, T.leafOpen) - ph(c, T.leafShut)),
    kreLeaf = KRE.open * ph(c, T.kreOpen);
  // Heru: out to the leaf, hold it, walk the row, the door, in, turn round to face her
  let heru: Stride;
  if (c < T.h2) heru = H1.stride(c - T.h1);
  else if (c < T.h3 + 0.6) heru = H2h.stride(c - T.h2);
  else if (c < T.turn[0]) heru = H3.stride(c - T.h3 - 0.6);
  else {
    const at = H3.walk.curve.getPointAt(1),
      from = H3.stride(H3.dur).yaw;
    // round to face the street (yaw 0) and her
    heru = turnStride(at, from, turnTo(from, 0), ph(c, T.turn));
  }
  let dewi: Stride;
  if (c < T.d2) dewi = D1.stride(c - T.d1);
  else if (c < T.dTurn[0]) dewi = D2.stride(c - T.d2);
  else {
    const from = D2.stride(D2.dur).yaw;
    // a small turn to face the door (yaw π)
    dewi = turnStride(dEnd, from, turnTo(from, Math.PI), ph(c, T.dTurn));
  }
  // his right hand: on the left leaf's edge while he holds it, on Kreatekno's handle while he pushes it
  let reach: OutsideState["reach"] = null;
  const hold = smoothstep(T.leafOpen[0], T.leafOpen[0] + 0.5, c) * (1 - smoothstep(T.h2 - 0.1, T.h2 + 0.3, c));
  if (hold > 0) reach = { at: leftEdge(leftLeaf), weight: hold };
  const push =
    smoothstep(T.kreOpen[0] - 0.3, T.kreOpen[0], c) * (1 - smoothstep(T.kreOpen[1] - 0.2, T.kreOpen[1] + 0.3, c));
  if (push > 0) reach = { at: kreHandle(kreLeaf), weight: push };
  // walking side by side they turn to each other now and then
  const walking = c > T.d2 + 1 && c < T.h3 - 3;
  const look = walking ? 0.3 * smoothstep(0.55, 0.85, Math.sin(c * 0.45)) : 0;
  return { heru, dewi, leftLeaf, kreLeaf, reach, look };
}

/** Poses both on their state (Heru's right arm reaching when it is set). */
export function poseOutside(heru: CastMember, dewi: CastMember, s: OutsideState) {
  walkPose(heru, s.heru, {
    head: [0.04, -s.look],
    reachR: s.reach ? { at: s.reach.at, weight: s.reach.weight, pole: new THREE.Vector3(-0.6, 0.9, -0.4) } : undefined,
  });
  walkPose(dewi, s.dewi, { head: [0.06, s.look * 0.8] });
}
