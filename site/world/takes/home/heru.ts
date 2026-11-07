// Heru in beats 1–2. At K1 he stands on the pavement facing the camera; when the visitor scrolls on he turns
// round in three small steps, puts his left hand on the bar handle of the right leaf, pushes the leaf inward in
// one push, lets go as it swings, walks in and stops near the door looking into the shop; from K2 to K2.2 he
// stays there and turns his head with the camera, left to Sinta and Bayu, then right to Nadia and Fajar.
// His part runs on his own clock (seconds at a natural pace): the scroll sets where the clock should be, and
// the world moves it there no faster than PACE × real time, so a fast scroll or a mouse wheel never makes him
// sprint or jerk. Everything is a pure function of the clock, so scrolling up plays it backwards.
import * as THREE from "three";
import { clamp01, ease, segmentStart, smoothstep } from "../../core/segments";
import { dampStep, type Damped } from "../../motion/damp";
import { turnStride, Walk, walkPose } from "../../cast/walk";
import type { CastMember } from "../../cast/member";
import { DATA } from "./data";
import { SEG, TAKE_SCREENS } from "./timing";

const iMove = SEG.findIndex((s) => s.from === "K1" && s.to === "K2"),
  iPan = SEG.findIndex((s) => s.from === "K2" && s.to === "K2.1");
const MOVE = { start: segmentStart(SEG, iMove), len: SEG[iMove].screens };
const PAN = { start: segmentStart(SEG, iPan), len: SEG[iPan].screens };

/** Door: hinge of the right leaf and its handle in the leaf's frame (sets/street.ts). */
const DW = DATA.ext.dw;
export const HINGE = new THREE.Vector3(DW - 0.05, 0, -0.1);
// the wrist, a hand's width outside the bar
const HANDLE = new THREE.Vector3(-(DW - 0.07 - 0.1), 1.03, 0.16);
const DOOR_OPEN = -1.45;
/** Heru stands turned this much toward the handle before he walks (his body seen from behind, a little from the side). */
const TURN = 0.32;

/** His clock (seconds): turning round, hand to the handle, the push, letting go, the first step. */
const T = { turn: [0, 1.0], reach: [0.7, 1.2], door: [1.1, 2.1], letGo: [1.5, 1.9], walk: 1.3 } as const;
/** Walking pace (m/s) and the time to get up to it (and to stop). */
const SPEED = 1.0,
  ACCEL = 0.6;
/** How much faster than his natural pace he may go to catch up with the scroll, and how soon he follows it. */
const PACE = 1.5,
  FOLLOW = 3.5;

const walks = new Map<number, Walk>();
/** Path from his K1 spot through the right half of the doorway to his K2 spot (blended pc → hp). */
function walkFor(t: number) {
  const key = Math.round(t * 20) / 20;
  let w = walks.get(key);
  if (!w) {
    const k2 = new THREE.Vector3(...DATA.heruK2.pc).lerp(new THREE.Vector3(...DATA.heruK2.hp), key);
    const k1 = new THREE.Vector3(DATA.heru.k1[0], 0, DATA.heru.k1[2]);
    w = new Walk(
      [
        k1,
        new THREE.Vector3(k1.x - 0.06, 0, -0.2),
        new THREE.Vector3(lerp(k1.x, k2.x, 0.45), 0, -1.1),
        new THREE.Vector3(k2.x + 0.02, 0, k2.z + 0.45),
        new THREE.Vector3(k2.x, 0, k2.z),
      ],
      { step: 0.42, first: "R" },
    );
    walks.set(key, w);
  }
  return w;
}
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const wrap = (a: number) => Math.atan2(Math.sin(a), Math.cos(a));
const phase = (k: number, [a, b]: readonly [number, number]) => clamp01((k - a) / (b - a));

/** Seconds of walking for the path (up to speed, on at speed, slowing to a stop). */
export const walkTime = (w: Walk) => w.length / SPEED + ACCEL;
/** Metres walked after s seconds of walking: speed ramps up and down smoothly over ACCEL. */
export function walked(w: Walk, s: number) {
  const dur = walkTime(w);
  s = Math.min(dur, Math.max(0, s));
  // the speed eases in (smoothstep) over ACCEL, holds and eases out the same way; R integrates the ramp
  const R = (x: number) => {
    const k = clamp01(x / ACCEL);
    return ACCEL * (k ** 3 - k ** 4 / 2);
  };
  return SPEED * (s <= dur - ACCEL ? R(s) + Math.max(0, s - ACCEL) : dur - ACCEL - R(dur - s));
}

/** Where he stands at the end of his walk in (K2, facing into the shop) for a format blend. */
export const heruK2Spot = (t: number) => walkFor(t).curve.getPointAt(1);

/** Length of his part on his clock (seconds) for a format blend. */
export const heruEnd = (t: number) => T.walk + walkTime(walkFor(t));

/** Where his clock should be for the scroll position p (0..1). */
export function heruClock(p: number, t: number) {
  return clamp01((p * TAKE_SCREENS - MOVE.start) / MOVE.len) * heruEnd(t);
}

/** Moves his clock toward the scroll's over dt seconds: smoothly, and at most PACE × his natural pace. */
export function followClock(s: Damped, target: number, dt: number) {
  const x = s.x;
  dampStep(s, target, FOLLOW, dt);
  const max = PACE * dt;
  if (Math.abs(s.x - x) > max) {
    s.x = x + Math.sign(s.x - x) * max;
    s.v = Math.sign(s.v) * Math.min(Math.abs(s.v), PACE);
  }
  if (Math.abs(s.x - target) < 1e-4 && Math.abs(s.v) < 1e-3) {
    s.x = target;
    s.v = 0;
  }
  return s;
}

export type HeruState = {
  /** His clock (seconds) and the share of the walk done (0..1). */
  c: number;
  q: number;
  d: number;
  door: number;
  hand: number;
  x: number;
  z: number;
  pan: number;
};

/** Heru's part at clock c (default: where the scroll at p puts it), with the head turn of p, for a format blend t. */
export function heruAt(p: number, t: number, c = heruClock(p, t)): HeruState {
  const w = walkFor(t);
  c = Math.min(heruEnd(t), Math.max(0, c));
  const d = walked(w, c - T.walk);
  const b = w.curve.getPointAt(Math.min(1, d / w.length));
  return {
    c,
    q: d / w.length,
    d,
    door: DOOR_OPEN * ease(phase(c, T.door)),
    // the push: the hand reaches the handle, stays on it until the leaf swings past his reach, then lets go
    hand: smoothstep(T.reach[0], T.reach[1], c) * (1 - smoothstep(T.letGo[0], T.letGo[1], c)),
    x: b.x,
    z: b.z,
    pan: ease(clamp01((p * TAKE_SCREENS - PAN.start) / PAN.len)),
  };
}

/** Facing the K1 camera from his K1 spot (blended pc → hp). */
function facingCamera(t: number) {
  const cam = new THREE.Vector3(...DATA.cams.pc.K1.pos).lerp(new THREE.Vector3(...DATA.cams.hp.K1.pos), t);
  return Math.atan2(cam.x - DATA.heru.k1[0], cam.z - DATA.heru.k1[2]);
}

/**
 * Poses Heru for a state; `whip` is the eased whip pan (0 at K2.1 … 1 at K2.2) and `breath` a breathing angle.
 */
export function poseHeru(m: CastMember, h: HeruState, t: number, whip: number, breath = 0) {
  const w = walkFor(t),
    walk = w.at(h.d);
  // turned toward the handle while he stands at the door, straight into the shop at the end of the walk
  const yawEnd = Math.PI - walk.yaw;
  let stride = walk,
    yaw = TURN * (1 - smoothstep(0, 0.24, h.q)) + wrap(yawEnd) * smoothstep(0.66, 1, h.q);
  if (h.c < T.turn[1]) {
    // turning round from the camera to the door, the short way (to his right), feet ending on the path
    const from = facingCamera(t),
      by = wrap(walk.yaw + TURN - from);
    stride = turnStride(walk.body, from, by, phase(h.c, T.turn), by - TURN);
    yaw = 0;
  }
  const atDoor = smoothstep(0.5, 1, phase(h.c, T.turn)) * (1 - smoothstep(0, 0.2, h.q));
  walkPose(m, stride, {
    yaw,
    lean: 0.05 * smoothstep(0, 0.12, h.q) * (1 - smoothstep(0.85, 1, h.q)),
    // looks at the door, then ahead, then left with the camera to Sinta and Bayu, then right to Nadia and Fajar
    head: [0.12 * atDoor, 0.15 * atDoor + 0.45 * h.pan - 0.85 * whip],
    breathe: breath,
    reachL: {
      at: handleAt(h.door),
      weight: h.hand,
      // elbow out to his left and down
      pole: new THREE.Vector3(0.5, 0.8, -0.1),
    },
  });
  return { stride, yaw: stride.yaw + yaw };
}

/** Handle position (world) for a door angle. */
export function handleAt(angle: number) {
  return HANDLE.clone()
    .applyAxisAngle(new THREE.Vector3(0, 1, 0), angle)
    .add(HINGE);
}
