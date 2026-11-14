// Heru and Bu Dewi out on the street (beats 5a–5b, the team's videos k5a.1 - k4.2 … k5a.5 - k5a.6), on their own
// clock (revision 7 Nov): once the scroll has passed K4.2 they come out of COMPANY's door, Heru first, pushing the
// left leaf open and holding it while Bu Dewi steps out; the leaf swings shut and they walk side by side along the
// row at a natural pace (1.3 m/s), Heru on the shop side; near Kreatekno he quickens, swings round her on the road
// side, pushes Kreatekno's door open, steps in and turns to face her, holding the leaf; she walks up to the door.
// The same clock goes on into Kreatekno's lobby (tahap 7, beats 6–9a): she walks in past him to the corkboard, he
// lets the leaf go once she is well in and waits out of view beside her; at K8 → K9.1 they walk side by side toward
// the facade's door. In the lobby the clock follows the scroll at most 1.8× their pace, moved only out of view.
// The clock is seconds of that walk and follows the scroll both ways (revision 7 Nov, after a first take on a free
// clock): the scroll sets where it should be, they walk there at their pace (at most 1.5× to catch up) and stop when
// they get there; scrolling up walks them back. Far behind or ahead and out of view, they are moved (stepOutClock).
// Along the row (issue #2) the clock is bound to the scroll itself, and the camera follows them (pairX).
// Everything is a pure function of the clock (stills and review shots set it from the scroll, scrollClock), and
// every walk is laid out by distance (cast/walk.ts), so the feet never slide, forward or back.
import * as THREE from "three";
import type { CastMember } from "../../cast/member";
import { onFloor, TimedWalk, turnStride, Walk, walkPose, type Stride } from "../../cast/walk";
import { lerp } from "../../core/kit";
import { clamp01, segmentStart, smoothstep } from "../../core/segments";
import { LOBBY, lobbyFloor, lx } from "../../sets/lobbyLayout";
import { KREATEKNO } from "../../sets/rowLayout";
import { DATA } from "./data";
import { followClock } from "./heru";
import { DOOR_GATES, DOOR_OPEN } from "./lobby";
import { K42_PASS, TRUCK_HOLDS } from "./outside";
import { B9, PASS_AT } from "./beat9";
import { B12, INTO } from "./beat12";
import { SEG, type KeyName } from "./timing";
import { dampStep, type Damped } from "../../motion/damp";

/** Natural walking pace (m/s), how much faster they may go to catch up with the scroll, and Heru's quickened pace. */
export const OUT_SPEED = 1.3,
  OUT_PACE = 1.5;
const HURRY = 1.8;
/** Screens where they start coming out (the door opens a moment after the camera has passed K4.2). */
export const OUT_START = K42_PASS + 0.15;

const V = (x: number, z: number) => new THREE.Vector3(x, 0, z);

// ---------- the doors ----------
const DW = DATA.ext.dw;
/** COMPANY's left leaf: hinge, leaf width, and its free edge for an angle (it opens outward, toward the street). */
const LEFT = { hinge: V(-DW + 0.05, -0.1), w: DW - 0.07, open: -1.4 };
/** COMPANY's right leaf opened outward on the way out (its hinge is at the door's right edge; sets/street.ts). */
const RIGHT_OPEN = 1.4;
const leftEdge = (angle: number) =>
  new THREE.Vector3(LEFT.w, 1.0, 0).applyAxisAngle(new THREE.Vector3(0, 1, 0), angle).add(LEFT.hinge);
/** COMPANY's right leaf: hinge at the door's right edge, the leaf toward −x (sets/street.ts). */
const RIGHT = { hinge: V(DW - 0.05, -0.1), w: DW - 0.07 };
const rightEdge = (angle: number) =>
  new THREE.Vector3(-RIGHT.w, 1.0, 0).applyAxisAngle(new THREE.Vector3(0, 1, 0), angle).add(RIGHT.hinge);
/**
 * Kreatekno's hinged leaf (sets/row.ts): hinge at the door's right edge, opening inward, nearly square to the
 * facade when open (tahap 7: the camera passes through the opening beside it).
 */
const KD = KREATEKNO.door;
export const KRE = { hinge: V(KD.cx + KD.w / 2, -0.04), w: KD.w / 2, open: -1.45 };
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
/** Heru's spot inside Kreatekno's door, holding its leaf open with his left hand (video k6 - k5a.6). */
const HS = V(KD.cx + 0.75, -1.55);
const H3 = new TimedWalk([hDoor, V(KD.cx + 0.3, -0.3), V(KD.cx + 0.5, -1.05), HS], () => 0.9, 0.38, "L");
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
/**
 * The clock at K5a.6 (the middle of its hold): Heru inside the door facing her, holding the leaf, Bu Dewi at the
 * door. The street's part of the clock ends here; the lobby's follows (tahap 7).
 */
export const OUT_END = T.end;

// ---------- in the lobby (tahap 7, videos k6 - k5a.6 and K8 - K9.1) ----------
// Bu Dewi walks in past Heru (on his right), on into the lobby and round on its right side to the corkboard, where
// she stops at its front right, smiling at it (K6: her head and shoulder at the right edge of the frame). The camera
// passes her on her left. Heru lets the leaf go once she is past, follows her in on the far right and waits out of
// view beside her. At K8 → K9.1 she turns round and walks toward the facade's door, Heru a moment later on her left.
const kc = KD.cx;
/** Where Bu Dewi stands at the corkboard (K6), where Heru waits (out of every frame from K6 to K8). */
export const DEWI_K6 = V(kc + 2.35, -12.95),
  HERU_WAIT = V(kc + 3.1, -12.95);
const D3 = new TimedWalk(
  [
    dEnd,
    V(kc + 0.12, 0.3),
    V(kc + 0.27, -0.35),
    V(kc + 0.25, -1.4),
    V(kc + 0.4, -2.2),
    V(kc + 1.0, -3.0),
    V(kc + 2.2, -4.8),
    V(kc + 2.7, -7.5),
    V(kc + 2.85, -10.4),
    V(kc + 2.6, -12.2),
    DEWI_K6,
  ],
  () => OUT_SPEED,
  0.36,
  "R",
);
const H4 = new TimedWalk(
  [HS, V(kc + 1.4, -2.7), V(kc + 3.2, -5.5), V(kc + 3.45, -10.0), HERU_WAIT],
  () => OUT_SPEED,
  0.42,
  "L",
);
/** Where they stop near the facade's door (the end of the take until tahap 8). */
const D4 = new TimedWalk(
  [
    DEWI_K6,
    V(kc + 2.4, -11.3),
    V(kc + 2.15, -9.3),
    V(kc + 1.2, -7.6),
    V(kc + 0.1, -5.0),
    V(kc - 0.3, -3.2),
    V(kc - 0.35, -2.0),
  ],
  () => OUT_SPEED,
  0.36,
  "L",
);
const H5 = new TimedWalk(
  // a step to her left all the way (video K9.1: side by side), a little quicker as he starts after her
  [
    HERU_WAIT,
    V(kc + 3.15, -11.3),
    V(kc + 2.9, -9.3),
    V(kc + 1.95, -7.6),
    V(kc + 0.85, -5.0),
    V(kc + 0.45, -3.2),
    V(kc + 0.4, -2.0),
  ],
  () => 1.38,
  0.42,
  "R",
);
/** Yaw facing the corkboard (−z), and Heru's toward her while he waits. */
const FACE_BOARD = Math.PI,
  HERU_WAIT_YAW = Math.atan2(DEWI_K6.x - HERU_WAIT.x, DEWI_K6.z - HERU_WAIT.z);

/** The lobby's timeline (clock seconds, after OUT_END). */
export const LT = (() => {
  const l0 = T.end,
    // she turns from the door to her way in, then walks
    dTurnIn: [number, number] = [l0 + 0.2, l0 + 0.8],
    d3 = dTurnIn[1],
    // the camera may pass the door once she is this far in (z −3, right of its way: takes/home/lobby.ts)
    inside = d3 + D3.timeAt((p) => p.z <= -3.0),
    // he holds the leaf until she is well in (the camera comes through meanwhile, video), turns round and follows
    release = d3 + D3.timeAt((p) => p.z <= -5.0),
    kreShut: [number, number] = [release + 0.3, release + 1.8],
    hTurnIn: [number, number] = [release + 0.15, release + 1.25],
    h4 = hTurnIn[1],
    dFace: [number, number] = [d3 + D3.dur, d3 + D3.dur + 0.8],
    hFace: [number, number] = [h4 + H4.dur, h4 + H4.dur + 0.8],
    k6 = Math.max(dFace[1], hFace[1]) + 0.2,
    // K8 → K9.1: she turns round and walks to the door; he a moment later, quicker, on her left
    dTurnOut: [number, number] = [k6, k6 + 1.1],
    d4 = dTurnOut[1],
    hTurnOut: [number, number] = [k6 + 0.5, k6 + 1.4],
    h5 = hTurnOut[1],
    // K9.1: they are ±6 m ahead of the camera, side by side (video K9.1)
    k91 = d4 + D4.timeAt((p) => p.z >= -6.0),
    end = Math.max(d4 + D4.dur, h5 + H5.dur) + 0.2;
  return {
    l0,
    dTurnIn,
    d3,
    inside,
    release,
    kreShut,
    hTurnIn,
    h4,
    dFace,
    hFace,
    k6,
    dTurnOut,
    d4,
    hTurnOut,
    h5,
    k91,
    end,
  };
})();

// ---------- beats 9b–11 (tahap 8, the team's continuation video 0–21 s) ----------
// From where the lobby's part stopped them (a step inside the facade's door), Kreatekno's leaf swings open (its
// closer, inward) and Heru, Bu Dewi and Wildan (out of the meeting room behind them) walk out through its open half
// one after another, turn left and walk along the pavement, Heru in front on the street side, Bu Dewi, Wildan on the
// shop side. They pass the plaque before the camera dollies in to it (a gate), and go on along the row while the
// camera rises into the sky. There the clock jumps (unseen: the camera looks at the sky only) to the last metres
// along COMPANY's pavement: they walk up to its door from the right and stop side by side facing it, Heru at its
// left leaf, Bu Dewi a step behind in the middle, Wildan at its right leaf (K11, video 19–21 s).
/** Where Wildan stops outside the meeting room (cast/lobbyCast OUT_SPOT) and where the walk along the row ends (x). */
const W_SPOT = V(lx(LOBBY.room.glassX) + 0.85, -6.3),
  ROW_END = 38;
const LANE9 = { heru: 1.2, dewi: 0.8, wildan: 0.45 };
const H6 = new TimedWalk(
  [
    V(kc + 0.4, -2.0),
    V(kc + 0.46, -0.9),
    V(kc + 0.44, 0.25),
    V(kc - 0.15, 0.95),
    V(kc - 1.3, LANE9.heru),
    V(ROW_END, LANE9.heru),
  ],
  () => OUT_SPEED,
  0.42,
  "L",
);
const D5 = new TimedWalk(
  [
    V(kc - 0.35, -2.0),
    V(kc + 0.2, -1.35),
    V(kc + 0.42, -0.5),
    V(kc + 0.4, 0.3),
    V(kc - 0.3, LANE9.dewi),
    V(kc - 1.5, LANE9.dewi),
    V(ROW_END + 0.9, LANE9.dewi),
  ],
  () => OUT_SPEED,
  0.36,
  "R",
);
const W2 = new TimedWalk(
  [
    W_SPOT,
    V(W_SPOT.x + 1.0, -4.7),
    V(kc + 0.15, -2.7),
    V(kc + 0.42, -1.0),
    V(kc + 0.4, 0.25),
    V(kc - 0.4, LANE9.wildan),
    V(kc - 1.6, LANE9.wildan),
    V(ROW_END + 1.8, LANE9.wildan),
  ],
  () => OUT_SPEED,
  0.4,
  "L",
);
/** COMPANY: along its pavement from the right to the door (DATA: the door's middle at x 0), the three in a line. */
// (Heru and Wildan just outside the leaves' swing, at their free edges once open: video 22–23 s)
const C_SPOT = { heru: V(-1.15, 1.15), dewi: V(0.05, 1.45), wildan: V(1.2, 1.15) };
const HC = new TimedWalk([V(8.6, LANE9.heru), V(1.6, LANE9.heru), C_SPOT.heru], () => OUT_SPEED, 0.42, "R");
const DC = new TimedWalk([V(9.6, 1.3), V(2.1, 1.3), C_SPOT.dewi], () => OUT_SPEED, 0.36, "L");
const WC = new TimedWalk([V(10.6, 0.95), V(2.7, 0.95), C_SPOT.wildan], () => OUT_SPEED, 0.4, "R");
/** Facing COMPANY's door (−z). */
const FACE_DOOR = Math.PI;
/** The plaque's left edge less half a metre: past it, the three are out of the K9b frame. */
const PLAQUE_CLEAR = KREATEKNO.plaque.cx - KREATEKNO.plaque.w / 2 - 0.5;

/** Their timeline in beats 9b–11 (clock seconds, after LT.end). */
export const BT = (() => {
  const b0 = LT.end,
    // the leaf swings open as Heru comes to it; he goes first, Bu Dewi a little after, Wildan behind them
    kreOpen: [number, number] = [b0 - 0.4, b0 + 0.5],
    h6 = b0 + 0.2,
    d5 = b0 + 0.9,
    // (Wildan sets off from the meeting room a little before them: he has further to go)
    w2 = b0 - 2.0,
    heruOut = h6 + H6.timeAt((p) => p.z >= 0.3),
    wildanOut = w2 + W2.timeAt((p) => p.z >= 0.4),
    kreShut: [number, number] = [wildanOut + 0.4, wildanOut + 1.9],
    passed = w2 + W2.timeAt((p) => p.z > 0 && p.x <= PLAQUE_CLEAR),
    rowEnd = Math.max(h6 + H6.dur, d5 + D5.dur, w2 + W2.dur),
    // COMPANY (the clock jumps here while the camera is in the sky)
    c0 = rowEnd + 0.05,
    hc = c0,
    dc = c0 + 0.35,
    wc = c0 + 0.6,
    hFace: [number, number] = [hc + HC.dur, hc + HC.dur + 0.7],
    dFace: [number, number] = [dc + DC.dur, dc + DC.dur + 0.7],
    wFace: [number, number] = [wc + WC.dur, wc + WC.dur + 0.7],
    end = Math.max(hFace[1], dFace[1], wFace[1]) + 0.2;
  return {
    b0,
    kreOpen,
    h6,
    d5,
    w2,
    heruOut,
    wildanOut,
    kreShut,
    passed,
    rowEnd,
    c0,
    hc,
    dc,
    wc,
    hFace,
    dFace,
    wFace,
    end,
  };
})();
/** Clock when Heru is near the electronics shop (the camera's high view, video 10.5 s). */
const BT_HIGH = BT.h6 + H6.timeAt((p) => p.z > 0 && p.x <= KREATEKNO.x0 - 3.5);

// ---------- beats 12–13 (tahap 9, the continuation video 21–24 s; greybox) ----------
// At COMPANY's door Heru and Wildan pull its two leaves open outward (they stand clear of their swing), and Bu Dewi
// walks in between them into the front room and stops a few steps in, where the camera passes over her head.
const DI = new TimedWalk([C_SPOT.dewi, V(0.02, 0.4), V(0.0, -0.8), V(0.12, -2.6)], () => OUT_SPEED, 0.36, "R");
/** Their timeline at COMPANY's door (clock seconds, after BT.end). */
export const BT2 = (() => {
  const open: [number, number] = [BT.end + 0.2, BT.end + 1.4],
    di = open[1] - 0.3,
    inside = di + DI.timeAt((p) => p.z <= -0.8);
  return { open, di, inside, end: di + DI.dur + 0.3 };
})();

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
  // beats 9b–11 (tahap 8): out of the door as the camera, out through the pillar, watches the facade; past the plaque
  // by the time it dollies in; along the row as it rises; at COMPANY's door as it comes down (K11)
  if (x > B9.out.s) {
    const c0 = Math.min(LT.end, LT.k91 + 1.2),
      pass = B9.out.s + PASS_AT * B9.out.len,
      high = B9.up.s + 0.45 * B9.up.len;
    if (x <= pass) return lerp(c0, BT.passed, (x - B9.out.s) / (pass - B9.out.s));
    if (x <= high) return lerp(BT.passed, BT_HIGH, (x - pass) / (high - pass));
    if (x <= B9.down.s) return lerp(BT_HIGH, BT.rowEnd, (x - high) / (B9.down.s - high));
    // (the jump to COMPANY: the camera sees the sky only from here to well into its way down)
    if (x <= B12.into.s) return lerp(BT.c0, BT.end, clamp01((x - B9.down.s) / (B9.k11.s + B9.k11.len - B9.down.s)));
    // tahap 9: the leaves open and Bu Dewi is in before the camera reaches the door
    return lerp(BT.end, BT2.end, clamp01((x - B12.into.s) / ((INTO.door - 0.08) * B12.into.len)));
  }
  // in the lobby (tahap 7): in to the corkboard over the dolly (done as it arrives at K6), still through K6–K7; from
  // the K8 hold (the camera faces the meeting room, they are behind it) round and on toward the facade's door, half
  // way there at K9.1 (they come into the frame from the left as the camera turns, video), a little further through
  // its hold
  if (x > LOBBY_CHASE) {
    const S = LOBBY_SEG,
      turn = S.k8.s,
      k91 = S.k91.s + S.k91.len / 2;
    // (through the door: she is in and clear of the camera's way at each of its gates, takes/home/lobby.ts, and Heru
    // still holds the leaf as the camera comes through)
    const [g1, g2] = DOOR_GATES;
    if (x <= g1.x) return lerp(LT.l0, LT.inside - g1.lead + 0.3, (x - LOBBY_CHASE) / (g1.x - LOBBY_CHASE));
    if (x <= g2.x) return lerp(LT.inside - g1.lead + 0.3, LT.inside + 0.3, (x - g1.x) / (g2.x - g1.x));
    if (x <= DOOR_OPEN.to) return lerp(LT.inside + 0.3, LT.release - 0.2, (x - g2.x) / (DOOR_OPEN.to - g2.x));
    if (x <= S.k6.s) return lerp(LT.release - 0.2, LT.k6, (x - DOOR_OPEN.to) / (S.k6.s - DOOR_OPEN.to));
    if (x <= turn) return LT.k6;
    if (x <= k91) return lerp(LT.k6, LT.k91, (x - turn) / (k91 - turn));
    return lerp(LT.k91, Math.min(LT.end, LT.k91 + 1.2), clamp01((x - k91) / (S.k91.len / 2)));
  }
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
  // the camera is back at the door or inside: they are at the counter. Still in view in the doorway (scrolled back
  // while they were coming out), they first walk back in and the leaves shut behind them (the world holds the camera
  // at K4.2 meanwhile, OUT_BACK_GATE); then they are moved, unseen behind the frosted door (tahap 7: before, they
  // vanished there in one frame)
  if (x < K42_PASS) {
    if (c.x <= OUT_BACK_GATE || !seen(c.x)) c.x = c.v = 0;
    else followClock(c, 0, dt);
    return c;
  }
  const target = scrollClock(x),
    gap = target - c.x;
  // along the row (issue #2) they walk as the scroll goes, at its pace, and the camera keeps them in the middle; a
  // stiff spring only takes up what the paced walk out of the door left behind, without a jump. In the lobby (and on
  // the way back out of it) they follow the scroll at their own pace, moved only out of view (tahap 7).
  const lobby = x > LOBBY_CHASE || c.x > OUT_END + 1e-3;
  if (x >= STREET && !lobby) {
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
  return followClock(c, target, dt, lobby ? LOBBY_PACE : undefined);
}
/** How much faster than their pace they may walk to catch up with the scroll in the lobby (2.3 m/s, no sliding). */
const LOBBY_PACE = 1.8;
const segOf = (from: KeyName, type: "move" | "hold") => {
  const i = SEG.findIndex((g) => g.from === from && g.type === type);
  return { s: segmentStart(SEG, i), len: SEG[i].screens };
};
/** The lobby's segments (screens): the K6 hold, the K8 hold, the turn to the facade, the K9.1 hold. */
const LOBBY_SEG = {
  k6: segOf("K6", "hold"),
  k8: segOf("K8", "hold"),
  turn: segOf("K8", "move"),
  k91: segOf("K9.1", "hold"),
};
/** Screens from which their clock is the lobby's: the middle of the K5a.6 hold (OUT_END there). */
const LOBBY_CHASE = TRUCK_HOLDS[TRUCK_HOLDS.length - 1].s + TRUCK_HOLDS[TRUCK_HOLDS.length - 1].len / 2;
/** Seconds of walk between them and the scroll's point beyond which they may be moved while out of view. */
const SNAP_GAP = 3;
/**
 * Their clock below which COMPANY's leaves are shut again with them inside, behind the frosted glass (T.leafOpen
 * starts at 0.35): on the way back in they may be moved to the counter from there (stepOutClock).
 */
export const OUT_BACK_GATE = 0.3;
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
  /**
   * Heru's right hand on a door (world point and weight), his left on Kreatekno's leaf while he holds it from
   * inside, and their heads turned toward each other.
   */
  reach: { at: THREE.Vector3; weight: number } | null;
  hold: { at: THREE.Vector3; weight: number } | null;
  look: number;
};

const ph = (c: number, [a, b]: readonly [number, number]) => smoothstep(a, b, c);

/**
 * COMPANY's right leaf on the way out (radians about its hinge; issue #8). It swung shut once the camera was out
 * (video k4.2 - k4.1); as in video k5a.1 - k4.2 both leaves then open outward together and Bu Dewi comes out
 * through the right half, stepping out past the leaf's end before she turns right (D1); it shuts with the left one.
 * Beat 1 is unchanged: there Heru pushes this leaf inward.
 */
export const rightLeaf = (c: number) =>
  c <= 0 ? 0 : RIGHT_OPEN * (ph(c, T.leafOpen) - ph(c, T.leafShut) + ph(c, BT2.open));
/** The shortest turn from yaw a to yaw b. */
const turnTo = (a: number, b: number) => Math.atan2(Math.sin(b - a), Math.cos(b - a));

/** Their whole state at clock c (null while still inside). */
export function outsideState(c: number): OutsideState | null {
  if (c <= 0) return null;
  // Kreatekno's leaf: pushed open by Heru, held, and shut by its closer once he lets go (the world keeps it open
  // while the camera comes through, see kreLeafFor)
  const leftLeaf = LEFT.open * (ph(c, T.leafOpen) - ph(c, T.leafShut) + ph(c, BT2.open)),
    kreLeaf = kreAt(c);
  const turn = (at: THREE.Vector3, from: number, to: number, span: readonly [number, number]) =>
    turnStride(at, from, turnTo(from, to), ph(c, span));
  // Heru: out to the leaf, hold it, walk the row, the door, in, turn round to face her holding the leaf; then (the
  // lobby) round again and in after her, waiting beside her out of view; at K8 → K9.1 on toward the facade's door
  let heru: Stride;
  if (c < T.h2) heru = H1.stride(c - T.h1);
  else if (c < T.h3 + 0.6) heru = H2h.stride(c - T.h2);
  else if (c < T.turn[0]) heru = H3.stride(c - T.h3 - 0.6);
  else if (c < LT.hTurnIn[0]) heru = turn(HS, H3.yaw1, 0, T.turn);
  else if (c < LT.h4) heru = turn(HS, 0, H4.yaw0, LT.hTurnIn);
  else if (c < LT.hFace[0]) heru = H4.stride(c - LT.h4);
  else if (c < LT.hTurnOut[0]) heru = turn(HERU_WAIT, H4.yaw1, HERU_WAIT_YAW, LT.hFace);
  else if (c < LT.h5) heru = turn(HERU_WAIT, HERU_WAIT_YAW, H5.yaw0, LT.hTurnOut);
  else if (c < BT.h6) heru = H5.stride(c - LT.h5);
  else if (c < BT.c0) heru = H6.stride(c - BT.h6);
  else if (c < BT.hFace[0]) heru = HC.stride(c - BT.hc);
  else heru = turn(C_SPOT.heru, HC.yaw1, FACE_DOOR, BT.hFace);
  // Bu Dewi: out, along the row to the door, facing it; in past Heru to the corkboard, facing it; round and on
  let dewi: Stride;
  if (c < T.d2) dewi = D1.stride(c - T.d1);
  else if (c < T.dTurn[0]) dewi = D2.stride(c - T.d2);
  else if (c < LT.dTurnIn[0]) dewi = turn(dEnd, D2.yaw1, Math.PI, T.dTurn);
  else if (c < LT.d3) dewi = turn(dEnd, Math.PI, D3.yaw0, LT.dTurnIn);
  else if (c < LT.dFace[0]) dewi = D3.stride(c - LT.d3);
  else if (c < LT.dTurnOut[0]) dewi = turn(DEWI_K6, D3.yaw1, FACE_BOARD, LT.dFace);
  else if (c < LT.d4) dewi = turn(DEWI_K6, FACE_BOARD, D4.yaw0, LT.dTurnOut);
  else if (c < BT.d5) dewi = D4.stride(c - LT.d4);
  else if (c < BT.c0) dewi = D5.stride(c - BT.d5);
  else if (c < BT.dFace[0]) dewi = DC.stride(c - BT.dc);
  else if (c < BT2.di) dewi = turn(C_SPOT.dewi, DC.yaw1, FACE_DOOR, BT.dFace);
  else dewi = DI.stride(c - BT2.di);
  // (the lobby's floor is two steps down)
  heru = onFloor(heru, lobbyFloor);
  dewi = onFloor(dewi, lobbyFloor);
  // his right hand: on the left leaf's edge while he holds it, on Kreatekno's handle while he pushes it
  let reach: OutsideState["reach"] = null;
  const holdLeft = smoothstep(T.leafOpen[0], T.leafOpen[0] + 0.5, c) * (1 - smoothstep(T.h2 - 0.1, T.h2 + 0.3, c));
  if (holdLeft > 0) reach = { at: leftEdge(leftLeaf), weight: holdLeft };
  const push =
    smoothstep(T.kreOpen[0] - 0.3, T.kreOpen[0], c) * (1 - smoothstep(T.kreOpen[1] - 0.2, T.kreOpen[1] + 0.3, c));
  if (push > 0) reach = { at: kreHandle(kreLeaf), weight: push };
  // tahap 9: his right hand on the left leaf's free edge as he pulls it open and holds it
  const pull = smoothstep(BT2.open[0] - 0.4, BT2.open[0], c);
  if (pull > 0) reach = { at: leftEdge(leftLeaf), weight: pull };
  // his left hand on the open leaf's handle from inside, once he has turned round to her, until she is past him
  const held = smoothstep(T.turn[1] - 0.5, T.turn[1], c) * (1 - smoothstep(LT.release - 0.1, LT.release + 0.3, c));
  const hold = held > 0 ? { at: kreHandle(kreLeaf), weight: held } : null;
  // walking side by side they turn to each other now and then
  const walking =
    (c > T.d2 + 1 && c < T.h3 - 3) || (c > LT.h5 + 1 && c < LT.end - 1.5) || (c > BT.passed && c < BT.rowEnd - 1);
  const look = walking ? 0.3 * smoothstep(0.55, 0.85, Math.sin(c * 0.45)) : 0;
  return { heru, dewi, leftLeaf, kreLeaf, reach, hold, look };
}

/**
 * Kreatekno's leaf for clock c and the camera's passage through the door (`camOpen` 0..1, from the scroll: 1 from
 * just before the camera reaches the door until it is past the leaf). Fully open while either holds (issue #10's
 * rule: never a closed or closing leaf as the camera comes through).
 */
export const kreLeafFor = (c: number, camOpen: number) => {
  const st = c > 0 ? kreAt(c) : 0;
  return Math.min(st, KRE.open * camOpen * ph(c, T.kreOpen));
};
/** Kreatekno's leaf at clock c: in for Bu Dewi (tahap 7), and again as the three walk out (tahap 8). */
function kreAt(c: number) {
  return KRE.open * (ph(c, T.kreOpen) - ph(c, LT.kreShut) + ph(c, BT.kreOpen) - ph(c, BT.kreShut));
}

/**
 * Wildan walking out with them at clock c (tahap 8: from where his own part in the lobby left him, outside the
 * meeting room), null before BT.w2. The world runs him a little behind their clock when his own part ended late
 * (wildanOut there), so he never jumps from one to the other.
 */
export function wildanStride(c: number): Stride | null {
  if (c <= BT.w2) return null;
  const turn = (at: THREE.Vector3, from: number, to: number, span: readonly [number, number]) =>
    turnStride(at, from, turnTo(from, to), ph(c, span));
  let s: Stride;
  if (c < BT.c0) s = W2.stride(c - BT.w2);
  else if (c < BT.wFace[0]) s = WC.stride(c - BT.wc);
  else s = turn(C_SPOT.wildan, WC.yaw1, FACE_DOOR, BT.wFace);
  return onFloor(s, lobbyFloor);
}
/** Wildan's left hand on COMPANY's right leaf as he pulls it open and holds it (tahap 9), null before. */
export function wildanReach(c: number) {
  const w = smoothstep(BT2.open[0] - 0.4, BT2.open[0], c);
  return w > 0 ? { at: rightEdge(rightLeaf(c)), weight: w } : null;
}
/** Poses Wildan on his stride (his head turned like theirs while they walk side by side; his hand on a leaf). */
export function poseWildanOut(m: CastMember, s: Stride, look: number, reach: ReturnType<typeof wildanReach> = null) {
  walkPose(m, s, {
    head: [0.05, look * 0.6],
    reachL: reach ? { at: reach.at, weight: reach.weight, pole: new THREE.Vector3(0.6, 0.9, -0.4) } : undefined,
  });
}

/** Poses both on their state (Heru's arms reaching when they are set). */
export function poseOutside(heru: CastMember, dewi: CastMember, s: OutsideState) {
  walkPose(heru, s.heru, {
    head: [0.04, -s.look],
    reachR: s.reach ? { at: s.reach.at, weight: s.reach.weight, pole: new THREE.Vector3(-0.6, 0.9, -0.4) } : undefined,
    reachL: s.hold ? { at: s.hold.at, weight: s.hold.weight, pole: new THREE.Vector3(0.6, 0.9, -0.4) } : undefined,
  });
  walkPose(dewi, s.dewi, { head: [0.06, s.look * 0.8] });
}
