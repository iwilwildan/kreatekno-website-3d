// The people in Kreatekno's meeting room (beats 6–9a, tahap 7): Wildan and Andi, in a chunk of their own that the
// world loads with the lobby (the cast chunk of beats 1–5 does not carry them), and their poses at the K8 hold.
import * as THREE from "three";
import { lerp, type Vec3 } from "../core/kit";
import { LOBBY, lobbyFloor, lx } from "../sets/lobbyLayout";
import { blinkAt, setBlink } from "./acts";
import { ANDI } from "./andi";
import type { CastMember } from "./member";
import { applyPose, type Pose } from "./poses";
import { onFloor, TimedWalk, turnStride, walkPose, type Stride } from "./walk";
import { WILDAN } from "./wildan";

export const LOBBY_CAST = { wildan: WILDAN, andi: ANDI };
export type LobbyCastName = keyof typeof LOBBY_CAST;

/** Seat top of the meeting room chairs (sets/lobby.ts), above the lobby floor. */
const SEAT = 0.495;

/**
 * K8 (video K7 - K8, last frame): both sit at their laptops on the long table, facing the glass, heads a little
 * down toward the screens, hands on the keyboards. Calm and focused. Targets in the member's own frame (metres,
 * facing +z, the origin on the floor under the pelvis); the laptop's keys are 0.45–0.7 m in front, 0.77 m up.
 */
export const K8_POSES: Record<LobbyCastName, Pose> = {
  wildan: {
    seat: SEAT,
    spine: [0.1, 0, 0],
    head: [0.16, 0.04, 0],
    L: { at: [0.1, 0.81, 0.46], fingers: [-0.1, -0.45, 1] },
    R: { at: [-0.09, 0.81, 0.47], fingers: [0.1, -0.45, 1] },
    face: { smile: 0.3, browLift: 0.002 },
    lids: 0.12,
  },
  andi: {
    seat: SEAT,
    spine: [0.1, 0, 0],
    head: [0.16, -0.05, 0.04],
    L: { at: [0.09, 0.81, 0.47], fingers: [-0.1, -0.45, 1] },
    R: { at: [-0.1, 0.81, 0.46], fingers: [0.1, -0.45, 1] },
    face: { smile: 0.38 },
    lids: 0.1,
  },
};

/**
 * Seats a member on its chair at the long table (on the table's side away from the glass, facing it; the seat moves
 * with the format, see lobbyLayout) in its K8 pose.
 */
export function seatK8(m: CastMember, name: LobbyCastName, fmt: "pc" | "hp") {
  const R = LOBBY.room,
    seat = R.seats.find((s) => s.who === name)!;
  m.mesh.position.set(lx(R.table.x) - 0.72, LOBBY.floor, seat.z[fmt]);
  m.mesh.rotation.y = Math.PI / 2;
  // the pose works in world space: a hidden member (no automatic world matrix) is posed with its matrix brought up
  // to date, or its hips drop twice
  const auto = m.mesh.matrixWorldAutoUpdate;
  m.mesh.matrixWorldAutoUpdate = true;
  m.mesh.updateMatrixWorld(true);
  applyPose(m, K8_POSES[name]);
  m.mesh.matrixWorldAutoUpdate = auto;
}

export { buildMemberSliced } from "./member";

// ---------- motion (tahap 7 langkah 4) ----------
// Andi types on at his laptop the whole time, glancing up now and then (and at Wildan once he gets up). Wildan
// types too until the turn to the facade (K8 → K9.1, video): he pushes his chair back, stands up, turns, walks
// round the end of the table to the room's glass door, pushes it open into the lobby and steps out (K9.1); the door
// swings shut behind him. His part runs on a clock of his own (seconds), which the world moves after the scroll
// (wildanTarget) like Heru's; Andi's loop runs on time.

const TAU = Math.PI * 2;
const burst = (t: number, period: number, on: number, phase = 0) => {
  const x = (((t + phase) % period) + period) % period;
  return x < on ? Math.sin((Math.PI * x) / on) ** 2 : 0;
};
const add = (a: Vec3 | undefined, b: Vec3): Vec3 => [(a?.[0] ?? 0) + b[0], (a?.[1] ?? 0) + b[1], (a?.[2] ?? 0) + b[2]];
const tap = (h: Pose["L"], dy: number): Pose["L"] => (h ? { ...h, at: add(h.at, [0, dy, 0]) } : h);
const ph = (c: number, a: number, b: number) => THREE.MathUtils.smoothstep(c, a, b);

/** The seated pose at time t: typing in bursts, breathing, a glance up now and then (`look`: extra head yaw). */
function seatedAt(name: LobbyCastName, t: number, look: number, typing = 1): Pose {
  const p = K8_POSES[name],
    seed = name === "andi" ? 2 : 1,
    k = (1 - burst(t, 6.8, 1.8, seed * 2.3) * 0.85) * typing,
    key = (ph0: number) => Math.max(0, Math.sin(TAU * (4.4 + seed * 0.3) * t + ph0)) * 0.007 * k;
  const glance = burst(t, 6.8, 1.8, seed * 2.3);
  return {
    ...p,
    L: tap(p.L, key(seed)),
    R: tap(p.R, key(seed + 1.9)),
    chest: add(p.chest, [0.012 * Math.sin(TAU * 0.24 * t + seed * 1.7), 0, 0]),
    head: add(p.head, [
      -0.14 * glance + 0.015 * Math.sin(TAU * 0.3 * t),
      look + 0.25 * glance * (seed === 2 ? 1 : -1),
      0,
    ]),
  };
}

/** Andi at time t: typing, glancing up; `look` turns his head (toward Wildan when he gets up). */
export function poseAndi(m: CastMember, t: number, look: number) {
  applyPose(m, seatedAt("andi", t, look), false);
  setBlink(m, Math.max(K8_POSES.andi.lids ?? 0, blinkAt(t, 7)));
}

/** Wildan's timeline (clock seconds): chair back, up, turn, the walk, the door. */
const W_PUSH = [0, 0.6] as const,
  W_RISE = [0.6, 1.6] as const,
  W_TURN = [1.6, 2.3] as const,
  /** How far the chair goes back, and how far forward of the seat he stands (over his feet). */
  CHAIR_BACK = 0.45,
  STAND_AT = 0.38;
const R = LOBBY.room;
const seatX = lx(R.table.x) - 0.72;
const V2 = (x: number, z: number) => new THREE.Vector3(x, 0, z);
/** Where he stops outside the room's door (the end of the take until tahap 8). */
const OUT_SPOT = V2(lx(R.glassX) + 0.85, -6.3);
const walks = new Map<string, { walk: TimedWalk; door: number; end: number }>();
/** His walk for a format (his seat moves with it), when he reaches the door, when he is done. */
function wildanWalk(fmt: "pc" | "hp") {
  let w = walks.get(fmt);
  if (w) return w;
  const z = R.seats[0].z[fmt],
    stand = V2(seatX - CHAIR_BACK + STAND_AT, z),
    gx = lx(R.glassX);
  const walk = new TimedWalk(
    [
      stand,
      V2(stand.x + 0.04, z + 0.9),
      V2(seatX + 0.05, -7.05),
      V2(lx(2.15), -6.35),
      V2(gx - 0.6, -6.28),
      V2(gx + 0.05, -6.28),
      OUT_SPOT,
    ],
    () => 1.2,
    0.4,
    "R",
  );
  const door = W_TURN[1] + walk.timeAt((p) => p.x >= gx - 0.4);
  w = { walk, door, end: W_TURN[1] + walk.dur + 0.4 };
  walks.set(fmt, w);
  return w;
}
/** End of Wildan's part (s), and when he is in the doorway (K9.1, video), for the world's scroll mapping. */
export function wildanTimes(fmt: "pc" | "hp") {
  const w = wildanWalk(fmt);
  return { up: W_TURN[1], doorway: w.door + 0.55, end: w.end + 1.6 };
}

/** The room's glass door (radians it stands open into the lobby) at Wildan's clock w. */
export function roomDoorAt(w: number, fmt: "pc" | "hp") {
  const { door, end } = wildanWalk(fmt);
  return 1.35 * (ph(w, door - 0.45, door + 0.55) - ph(w, end - 0.2, end + 1.4));
}
/** How far back (m) Wildan's chair stands at his clock w. */
export const chairBackAt = (w: number) => CHAIR_BACK * ph(w, W_PUSH[0], W_PUSH[1]);

const FORWARD = Math.PI / 2;
const KEEP = ["spine", "chest", "neck", "head", "upperArmL", "lowerArmL", "handL", "upperArmR", "lowerArmR", "handR"];
/**
 * Wildan at his clock w (format: his seat), typing time t: seated (typing until he gets up), pushing back, rising
 * over his feet, turning and walking out through the room's door (his left hand pushes it open).
 */
export function poseWildan(
  m: CastMember,
  w: number,
  t: number,
  fmt: "pc" | "hp",
  doorPush: (w: number) => THREE.Vector3,
) {
  const z = R.seats[0].z[fmt],
    floor = LOBBY.floor;
  if (w < W_RISE[0]) {
    // typing, then sliding back with the chair (hands leave the keys, feet with him)
    m.mesh.position.set(seatX - chairBackAt(w), floor, z);
    m.mesh.rotation.set(0, FORWARD, 0);
    m.mesh.updateMatrixWorld(true);
    applyPose(m, seatedAt("wildan", t, 0, 1 - ph(w, 0, 0.3)), false);
    setBlink(m, Math.max(K8_POSES.wildan.lids ?? 0, blinkAt(t, 5)));
    return;
  }
  setBlink(m, blinkAt(t, 5));
  const stand = V2(seatX - CHAIR_BACK + STAND_AT, z);
  if (w < W_RISE[1]) {
    // up over his feet: the seated pose (pushed back) and the standing one, the upper body blended with a lean
    // forward at the middle, the hips lifted and carried forward, the feet where they are on the floor
    const k = (w - W_RISE[0]) / (W_RISE[1] - W_RISE[0]),
      e = k * k * (3 - 2 * k);
    const seat = V2(seatX - CHAIR_BACK, z);
    m.mesh.position.set(seat.x, floor, z);
    m.mesh.rotation.set(0, FORWARD, 0);
    m.mesh.updateMatrixWorld(true);
    applyPose(m, seatedAt("wildan", t, 0, 0), false);
    const a = snapshot(m);
    walkPose(m, onFloor(turnStride(stand, FORWARD, 0, 1), lobbyFloor));
    const b = snapshot(m);
    m.mesh.position.lerpVectors(seat, stand, e).setY(floor);
    m.mesh.updateMatrixWorld(true);
    for (const n of KEEP) m.rig.bone(n).quaternion.copy(a.q.get(n)!).slerp(b.q.get(n)!, e);
    m.rig.bone("spine").rotateX(0.5 * Math.sin(Math.PI * k));
    m.rig.root.position.y = lerp(a.root, b.root, e);
    m.rig.root.updateMatrixWorld(true);
    for (const n of ["L", "R"] as const) {
      const foot = a.feet[n].clone().lerp(b.feet[n], e),
        pole = m.mesh.localToWorld(new THREE.Vector3(n === "L" ? 0.1 : -0.1, 0.5, 1.2));
      m.rig.ik("thigh" + n, "shin" + n, "foot" + n, foot, pole);
      m.rig.level("foot" + n);
    }
    return;
  }
  const { walk } = wildanWalk(fmt);
  let s: Stride;
  if (w < W_TURN[1]) s = turnStride(stand, FORWARD, turnTo(FORWARD, walk.yaw0), ph(w, W_TURN[0], W_TURN[1]));
  else s = walk.stride(w - W_TURN[1]);
  const { door } = wildanWalk(fmt),
    push = ph(w, door - 0.7, door - 0.35) * (1 - ph(w, door + 0.35, door + 0.75));
  walkPose(m, onFloor(s, lobbyFloor), {
    head: [0.05, 0],
    reachL: push > 0 ? { at: doorPush(w), weight: push, pole: new THREE.Vector3(0.6, 0.8, -0.4) } : undefined,
  });
}
const turnTo = (a: number, b: number) => Math.atan2(Math.sin(b - a), Math.cos(b - a));
function snapshot(m: CastMember) {
  const q = new Map<string, THREE.Quaternion>();
  for (const n of KEEP) q.set(n, m.rig.bone(n).quaternion.clone());
  const feet = {
    L: m.rig.bone("footL").getWorldPosition(new THREE.Vector3()),
    R: m.rig.bone("footR").getWorldPosition(new THREE.Vector3()),
  };
  return { q, root: m.rig.root.position.y, feet };
}

/**
 * Wildan's clock for scroll screens x: seated through K8, up and turned in the first third of the turn to the
 * facade (video: he stands as the camera starts to turn), to the doorway at K9.1 (the middle of its hold), out by
 * the end of it. `turn` and `k91` are the segments' start and length (screens).
 */
export function wildanTarget(
  x: number,
  fmt: "pc" | "hp",
  turn: { s: number; len: number },
  k91: { s: number; len: number },
) {
  const W = wildanTimes(fmt),
    a = turn.s + 0.05 * turn.len,
    b = turn.s + 0.35 * turn.len,
    c = k91.s + k91.len / 2,
    d = k91.s + k91.len;
  if (x <= a) return 0;
  if (x <= b) return lerp(0, W.up, (x - a) / (b - a));
  if (x <= c) return lerp(W.up, W.doorway, (x - b) / (c - b));
  return lerp(W.doorway, W.end, Math.min(1, (x - c) / (d - c)));
}

/** Andi's head turn toward a world point (radians, limited), his own frame. */
export function andiLook(m: CastMember, at: THREE.Vector3) {
  const local = m.mesh.worldToLocal(at.clone());
  return Math.max(-0.7, Math.min(0.7, Math.atan2(local.x, local.z)));
}
