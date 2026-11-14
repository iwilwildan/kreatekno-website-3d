// Beats 12–13 (tahap 9, the team's continuation video VID_20261113_185210, 21–34 s; greybox, langkah 1). From K11
// the camera moves in on COMPANY's door as Heru and Wildan pull its leaves open, follows Bu Dewi through it (video
// 22–24 s), takes in the front room at the end of the day from just inside (24–26 s: the staff's desks empty, a
// hologram over each), goes on over her head through the gap between the middle desks, round the right end of the
// counter and behind it to the wooden back door, and through it into the classroom (26.5–29 s). K12: from the
// classroom's back, Wildan at the TV and the staff at their desks (29–31 s; 9:16 frames the TV, its copy). Then
// straight back out through the door and over the counter into the front room as dusk falls (31–33.5 s, K13: the
// counter frontal from the middle of the room).
// The room is the front room of beats 1–5 (its layout step per format: sets/companyFront), the classroom behind it
// (sets/classLayout); camera points are read from the video by eye.
import * as THREE from "three";
import { rectAnchor, type Anchor } from "../../core/anchors";
import { segmentStart, smoothstep } from "../../core/segments";
import type { CamPose } from "../../core/take";
import { classFrame } from "../../sets/classLayout";
import { counterFrame, LAYOUT_STEPS } from "../../sets/companyFront";
import { fitFov } from "./outside";
import { k11View, mix, rig, track, v, type View } from "./beat9";
import { SEG } from "./timing";

const D2R = THREE.MathUtils.degToRad;
const idx = (from: string, type: "move" | "hold") => SEG.findIndex((s) => s.from === from && s.type === type);
const seg = (from: string, type: "move" | "hold") => {
  const i = idx(from, type);
  return { s: segmentStart(SEG, i), len: SEG[i].screens };
};
/** The segments of beats 12–13 (screens on the take's own timeline). */
export const B12 = {
  k11: seg("K11", "hold"),
  into: seg("K11", "move"),
  k12: seg("K12", "hold"),
  out: seg("K12", "move"),
};
/** Screens where beats 12–13 start: the move off K11. */
export const B12_START = B12.into.s;
/** Shares of the move in at which the camera is through COMPANY's door and through the back door. */
export const INTO = { door: 0.36, backDoor: 0.92 };

const yawTo = (a: THREE.Vector3, b: THREE.Vector3) => Math.atan2(-(b.x - a.x), -(b.z - a.z));
const pitchTo = (a: THREE.Vector3, b: THREE.Vector3) => Math.atan2(b.y - a.y, Math.hypot(b.x - a.x, b.z - a.z));
const look = (pos: THREE.Vector3, at: THREE.Vector3, fov: number): View => ({
  pos,
  yaw: yawTo(pos, at),
  pitch: pitchTo(pos, at),
  fov,
});

/** K12 for layout step `step` and format blend t: 16:9 the whole class from its back, 9:16 the TV and Wildan. */
export function k12View(step: number, t: number): View {
  const C = classFrame(step);
  // (video 30 s: from the back a little above the staff's heads, the near desks' backs at the bottom, the window
  // on the left wall, the binder shelf on the right, Wildan left of the TV, the TV ±a quarter of the width)
  const pc = look(
    new THREE.Vector3(C.tv.x - 0.1, 1.85, C.back - 0.45),
    new THREE.Vector3(C.tv.x - 0.3, 1.0, C.front + 0.6),
    50,
  );
  // 9:16: the screen at 88% of the width at 50° (its copy), the near desks under it
  const hpPos = new THREE.Vector3(C.tv.x, 1.5, C.tv.z + C.tv.w / 0.88 / 2 / (Math.tan(D2R(25)) * (9 / 16)));
  const hp = look(hpPos, new THREE.Vector3(C.tv.x, C.tv.y - 0.05, C.tv.z), 50);
  return mix(pc, hp, t);
}
/** K13 (passed) for layout step `step`: the counter frontal from the middle of the room, as dusk falls. */
export function k13View(step: number, t: number): View {
  const F = counterFrame(step);
  const pos = new THREE.Vector3(F.cx + 0.2, 1.8, F.zFront + 5.6 - 1.2 * t);
  return look(pos, new THREE.Vector3(F.cx, 1.05, F.backZ), 46 + 8 * t);
}

const tracks = new Map<string, ReturnType<typeof track>>();
function cached(id: string, make: () => ReturnType<typeof track>) {
  let f = tracks.get(id);
  if (!f) {
    if (tracks.size > 30) tracks.clear();
    tracks.set(id, (f = make()));
  }
  return f;
}

/** K11 → K12: in through COMPANY's door after Bu Dewi, across the room and through the back door. */
const intoTrack = (step: number, t: number) =>
  cached(`into ${step} ${t.toFixed(3)}`, () => {
    const F = counterFrame(step),
      C = classFrame(step),
      a = k11View(t),
      end = k12View(step, t),
      T = 2 * Math.PI;
    // (yaws kept continuous: from facing the facade (0) round to the left (+) behind the counter, back to 2π at the
    // back door)
    return track([
      { at: 0, view: a },
      { at: 0.18, view: v(-0.25, 1.7, 4.6, 0, D2R(1), 40) },
      // the leaves stand open now: through behind Bu Dewi (door 2.2 m high)
      { at: INTO.door - 0.07, view: v(0, 1.72, 1.4, 0, -0.02, 44) },
      { at: INTO.door, view: v(0, 1.72, -0.35, 0, -0.04, 46) },
      // just inside, the whole room (video 24–26 s), drifting in slowly
      { at: 0.5, view: v(0.05, 1.72, -1.8, 0.02, -0.08, 48) },
      { at: 0.66, view: v(F.gapX * 0.5, 1.8, -3.0, 0.02, -0.06, 48) },
      // over Bu Dewi's head, through the gap between the middle desks, round the counter's right end
      { at: 0.75, view: v(F.gapX, 1.85, F.gapZ, 0.05, -0.05, 48) },
      { at: 0.83, view: v(F.x1 + 0.55, 1.8, F.zMid - 0.4, 0.45, -0.04, 46) },
      { at: 0.88, view: v(F.x1 - 0.1, 1.75, F.zMid - 0.55, 0.8, -0.04, 46) },
      // turned to the back door, and through it (the leaf open into the classroom)
      { at: INTO.backDoor, view: v(C.doorX + 0.15, 1.7, F.backZ + 0.75, 0.15, -0.04, 46) },
      { at: 0.96, view: v(C.doorX, 1.72, F.backZ - 0.35, 0.02, -0.06, 48) },
      { at: 1, view: { ...end, yaw: end.yaw < -Math.PI / 2 ? end.yaw + T : end.yaw } },
    ]);
  });

/** K12 → K13: straight back out through the back door, over the counter, into the room. */
const outTrack = (step: number, t: number) =>
  cached(`out ${step} ${t.toFixed(3)}`, () => {
    const F = counterFrame(step),
      C = classFrame(step),
      a = k12View(step, t),
      end = k13View(step, t);
    return track([
      { at: 0, view: a },
      { at: 0.11, view: v(C.doorX, 1.75, F.backZ - 0.4, 0, -0.05, 48) },
      { at: 0.24, view: v(C.doorX, 1.78, F.backZ + 0.8, 0, -0.08, 48) },
      // over the counter (video 32 s: from behind it, the open door at the back), on back into the room
      { at: 0.55, view: v((C.doorX + F.cx) / 2, 1.85, F.zFront + 0.9, 0, -0.12, 48) },
      { at: 1, view: end },
    ]);
  });

/** Camera of beats 12–13 for screens x (≥ B12_START), format blend t, screen aspect. */
export function beat12Camera(x: number, t: number, aspect: number): CamPose {
  const step = Math.round(t * LAYOUT_STEPS);
  let view: View;
  if (x < B12.k12.s) view = intoTrack(step, t)((x - B12.into.s) / B12.into.len);
  else if (x < B12.out.s) view = k12View(step, t);
  else if (x < B12.out.s + B12.out.len) view = outTrack(step, t)((x - B12.out.s) / B12.out.len);
  else view = k13View(step, t);
  return { pos: view.pos, quat: rig(view.yaw, view.pitch), fov: fitFov(view.fov, t, aspect) };
}

// ---------- the copy on the TV (langkah 3): "Praktik naik kelas" ----------
/**
 * The TV's copy box for layout step `step` (anchor "practice"): on its white screen, a few mm in front of it, a
 * little in from the bezel. One box, read at the K12 hold (16:9 the whole class, 9:16 the TV filling the width).
 */
export function practiceAnchor(step: number): Anchor {
  const tv = classFrame(step).tv,
    edge = 0.06;
  return rectAnchor("practice", tv.x, tv.y, tv.z + 0.044, tv.w / 2 - edge, tv.h / 2 - edge);
}
/** Screens where the copy on the TV is measured: the middle of the K12 hold. */
export const practiceAt = () => B12.k12.s + B12.k12.len / 2;
/** Opacity of the TV's copy at screens x: in as the camera settles in the classroom, out as it backs away. */
export const practiceCopyFade = (x: number) =>
  smoothstep(B12.k12.s - 0.12, B12.k12.s - 0.01, x) * (1 - smoothstep(B12.out.s + 0.01, B12.out.s + 0.08, x));
