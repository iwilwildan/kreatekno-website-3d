// Heru and Bu Dewi in beats 3–4 (blockout K2.2 - K3, keyframes K3/K4). Heru walks from where he stopped in K2
// through the gap between Bayu's and Nadia's desks to the counter with empty hands; there he brings the leaflet
// up from below the counter's edge, lets it fall forward onto the counter and slides it to Bu Dewi, keeping his
// fingers on its corner (revision 6 Nov: he is not seen carrying it). Bu Dewi looks up as he comes, down at the
// leaflet when he lays it, and takes its other corner. In beat 4 (top view) the props and the close-up hands
// move instead (sets/counterProps.ts): the leaflet slides out, the binder comes to the middle and opens.
// Heru's walk runs on his own clock like beat 1 (see ./heru): the scroll sets where it should be, he follows at
// his own pace. Bu Dewi's part is sampled from the scroll directly (she hardly moves).
import * as THREE from "three";
import type { CastMember } from "../../cast/member";
import type { Pose } from "../../cast/poses";
import { Walk, walkPose } from "../../cast/walk";
import type { Vec3 } from "../../core/kit";
import { clamp01, ease, segmentStart, smoothstep } from "../../core/segments";
import { counterLayout, type CounterLayout } from "./counter";
import { heruK2Spot, walked, walkTime } from "./heru";
import { SEG, TAKE_SCREENS } from "./timing";

const i22 = SEG.findIndex((s) => s.from === "K2.2" && s.type === "move"),
  i34 = SEG.findIndex((s) => s.from === "K3" && s.type === "move");
/** Beat 3: the moves K2.2 → K2.4 → K3 (screens); beat 4: the move K3 → K4. */
const B3 = { start: segmentStart(SEG, i22), len: SEG[i22].screens + SEG[i22 + 1].screens },
  B4 = { start: segmentStart(SEG, i34), len: SEG[i34].screens };

/**
 * Beat 4 runs on its own clock too (seconds at a natural pace), like Heru's walk: the scroll sets where it should
 * be and the world follows no faster than 1.5× (scrolled straight from the K3 → K4 move, the binder opened in a
 * blink). Its phases, as shares of the clock: Bu Dewi lets go, Heru slides the leaflet out, moves his hand to the
 * binder, pulls it to the middle, its cover opens and folds under, both hands come to rest.
 */
export const B4_SECONDS = 5.5;
export const B4_PHASES = {
  letGo: [0, 0.35],
  slide: [0.04, 0.3],
  toBinder: [0.3, 0.42],
  pull: [0.42, 0.58],
  open: [0.58, 0.92],
  rest: [0.88, 1],
} as const;
/** Where the beat-4 clock should be for scroll p. */
export const beat4Clock = (p: number) => beatAt(p).u * B4_SECONDS;
/** Share 0..1 of a beat-4 phase done at beat-4 progress k (clock / B4_SECONDS). */
export const phase4 = (k: number, ph: keyof typeof B4_PHASES) =>
  clamp01((k - B4_PHASES[ph][0]) / (B4_PHASES[ph][1] - B4_PHASES[ph][0]));

/** Screens into beat 3 (0 … 2 at K3), the share of beat 4 done, and whether the scroll is past K2.2. */
export function beatAt(p: number) {
  const x = p * TAKE_SCREENS;
  return { s: Math.min(B3.len, Math.max(0, x - B3.start)), u: clamp01((x - B4.start) / B4.len), on: x > B3.start };
}

/** Heru's clock in beat 3 (seconds): the walk, then laying the leaflet down (LAY s, starting just before he stops). */
const LAY = 1.3,
  LAY_EARLY = 0;
/** Where on the scroll (screens into beat 3) he arrives and has laid the leaflet down: K2.4 is at 1.15. */
const ARRIVE = 1.0,
  LAID = 1.3;

/** Where Heru stands at the counter and the leaflet corner his right hand holds (world). */
export function counterSpots(L: CounterLayout) {
  return {
    stand: new THREE.Vector3(L.leaflet.x - 0.03, 0, L.f.zFront + 0.2),
    grip: new THREE.Vector3(L.leaflet.x + L.leafX / 2, L.f.top + 0.0036, L.leaflet.z + L.leafZ / 2),
  };
}

const walks = new Map<string, Walk>();
/** His path to the counter for layout step `step` and format blend t (from his K2 spot, ending facing -z). */
function walkFor(step: number, t: number) {
  const key = `${step} ${Math.round(t * 20)}`;
  let w = walks.get(key);
  if (!w) {
    const L = counterLayout(step),
      { stand } = counterSpots(L),
      k2 = heruK2Spot(Math.round(t * 20) / 20);
    w = new Walk(
      [
        k2,
        new THREE.Vector3(k2.x + (L.f.gapX - k2.x) * 0.6, 0, (k2.z + L.f.gapZ) / 2),
        new THREE.Vector3(L.f.gapX, 0, L.f.gapZ),
        new THREE.Vector3(stand.x, 0, stand.z + 0.7),
        stand,
      ],
      { step: 0.42, first: "L" },
    );
    if (walks.size > 30) walks.clear();
    walks.set(key, w);
  }
  return w;
}

/** Where Heru's beat-3 clock should be for scroll p. */
export function heru3Clock(p: number, step: number, t: number) {
  const { s } = beatAt(p),
    tw = walkTime(walkFor(step, t));
  if (s <= ARRIVE) return (s / ARRIVE) * tw;
  return tw + Math.min(1, (s - ARRIVE) / (LAID - ARRIVE)) * (LAY - LAY_EARLY);
}

const FLAT_Q = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), Math.PI);
const X = new THREE.Vector3(1, 0, 0);

export type Beat3 = {
  /** Heru's clock and how far the leaflet is laid down (0 hidden below the counter … 1 in its place). */
  c: number;
  lay: number;
  /** Leaflet centre and turn (world; the mesh is a unit box scaled to the sheet), and the corner he holds. */
  leaflet: { pos: THREE.Vector3; quat: THREE.Quaternion };
  grip: THREE.Vector3;
};

/**
 * The leaflet as Heru brings it out (k 0..1), as rotations about the counter's front edge: standing on its near
 * edge (the one with the strip, toward Heru) just in front of the counter, it rises from below the edge (hidden
 * by the counter from Bu Dewi's side), tips forward onto the counter top, and slides in to its place.
 */
function leafletRise(L: CounterLayout, k: number) {
  const rise = smoothstep(0, 0.4, k),
    tip = smoothstep(0.35, 0.72, k),
    slide = smoothstep(0.7, 1, k),
    edgeZ = L.f.zFront + 0.006,
    // the near edge's middle: below the edge (sheet all hidden) → on the edge → in place
    pivot = new THREE.Vector3(
      L.leaflet.x,
      THREE.MathUtils.lerp(L.f.top - L.leafZ - 0.03, L.f.top + 0.0036, rise),
      THREE.MathUtils.lerp(edgeZ, L.leaflet.z + L.leafZ / 2, slide),
    ),
    quat = new THREE.Quaternion().setFromAxisAngle(X, (Math.PI / 2) * (1 - tip)).multiply(FLAT_Q),
    pos = pivot.clone().add(new THREE.Vector3(0, 0, -L.leafZ / 2).applyAxisAngle(X, (Math.PI / 2) * (1 - tip)));
  return { pos, quat, grip: pivot.clone().add(new THREE.Vector3(L.leafX / 2, 0, 0)) };
}

/**
 * Poses Heru on his beat-3 clock c (layout step, format blend t) and returns where the leaflet is. `slide` (beat
 * 4) moves the laid leaflet aside, out of the top view to its left.
 */
export function poseHeru3(m: CastMember, c: number, step: number, t: number, breath = 0, slide = 0, relax = 0): Beat3 {
  const L = counterLayout(step),
    w = walkFor(step, t),
    tw = walkTime(w),
    d = walked(w, c),
    stride = w.at(d),
    walking = smoothstep(0, 0.4, c) * (1 - smoothstep(tw - 0.6, tw, c)),
    k = clamp01((c - (tw - LAY_EARLY)) / LAY),
    lay = ease(k);
  const leaf = leafletRise(L, k);
  leaf.pos.x += 0.42 * slide;
  leaf.grip.x += 0.42 * slide;
  // his right hand on the corner nearest him (on his right), the wrist behind it and a little above
  const wrist = leaf.grip.clone().add(new THREE.Vector3(0, 0.04, 0.085));
  walkPose(m, stride, {
    // leaning over the counter to lay it down, then a little more upright (his head stays out of the top views)
    lean: 0.05 * walking + 0.28 * lay - 0.18 * smoothstep(0.85, 1, lay),
    // looks at Bu Dewi as he comes, down at the leaflet as he lays it
    head: [0.08 + 0.32 * lay, 0],
    breathe: breath,
    // empty-handed while he walks; the hand goes down below the edge as he arrives and brings the sheet up
    // elbow out to his right side at about shoulder height, so the arm reads as reaching over the counter (on
    // the 9:16 counter, chest-high, a dropped elbow looked like a hand at his chin)
    // beat 5 (relax 0 → 1, as the camera tilts up off the top view): his hand leaves the binder, the arm hangs
    reachR: { at: wrist, weight: smoothstep(0, 0.12, k) * (1 - relax), pole: new THREE.Vector3(-0.9, 1.15, 0.05) },
  });
  return { c, lay: k, leaflet: { pos: leaf.pos, quat: leaf.quat }, grip: leaf.grip };
}
export const heru3End = (step: number, t: number) => walkTime(walkFor(step, t)) + LAY - LAY_EARLY;

/** Screens into beat 3 by which Bu Dewi's hand rests on the leaflet's corner (her close-up hand may show). */
export const DEWI_HOLDS = 1.75;

/** Bu Dewi's face once Heru lays the leaflet down: interested (brows up, a small smile). */
const INTERESTED = { browTilt: 0.06, browLift: 0.008, smile: 0.32 };

/**
 * Bu Dewi's pose for scroll p from her K2 pose: head up as Heru comes (blockout ±3 s), down at the leaflet when
 * he lays it, her right hand to the leaflet's corner nearest her (during the tilt down) and, in beat 4, to the
 * counter beside the binder. Her hand targets are world points turned into her own frame.
 */
export function dewiPose3(m: CastMember, base: Pose, p: number, step: number, k4 = beatAt(p).u, relax = 0): Pose {
  const { s } = beatAt(p),
    L = counterLayout(step);
  const lift = smoothstep(0.55, 0.85, s) * (1 - smoothstep(1.0, 1.3, s)),
    down = smoothstep(1.0, 1.3, s),
    reach = smoothstep(1.35, DEWI_HOLDS, s),
    rest = smoothstep(0, 1, phase4(k4, "letGo"));
  const local = (v: THREE.Vector3) => m.mesh.worldToLocal(v.clone()).toArray() as Vec3;
  // her wrist behind the corner (toward her) and a little above the counter
  const corner = new THREE.Vector3(L.leaflet.x - L.leafX / 2, L.f.top, L.leaflet.z - L.leafZ / 2),
    atCorner = corner.clone().add(new THREE.Vector3(0.02, 0.045, -0.085)),
    atRest = new THREE.Vector3(L.binderK4.x - 0.25, L.f.top + 0.04, L.binderK4.z - 0.165),
    target = new THREE.Vector3(...local(atCorner)).lerp(new THREE.Vector3(...local(atRest)), rest);
  const R0 = base.R!;
  const lerp3 = (a: Vec3, b: Vec3, k: number) => a.map((v, i) => v + (b[i] - v) * k) as Vec3;
  const head = base.head ?? [0, 0, 0];
  return {
    ...base,
    // beat 5 (relax): both hands back on the counter in front of her as in K2 (video K4.1), upright again
    spine: [0.32 * reach * (1 - relax), 0, 0],
    head: [head[0] - 0.14 * lift + 0.4 * down - 0.2 * reach, head[1], head[2] * (1 - Math.max(lift, down))],
    R: {
      at: lerp3(R0.at, target.toArray() as Vec3, reach * (1 - relax)),
      fingers: lerp3(R0.fingers, [0, -0.6, 1], reach * (1 - relax)),
    },
    face: s >= 1.0 ? INTERESTED : base.face,
  };
}
