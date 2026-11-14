// Beats 14–16 (tahap 10, the team's continuation video VID_20261113_185210, 33.5–38.7 s; greybox, langkah 1). From
// K13 (the counter frontal at dusk, passed) the camera dollies straight back through the front room and out through
// COMPANY's open door (video 33.5–35 s) to the facade frontal at night (K15, passed: 36 s), then cranes up to the lit
// billboard on its roof (K15.1: the CTA on its face, framed as the hero at K0, so the take ends where it began; user
// 14 Nov: in the video's wide frame the billboard is ±10% of the width, too small to read), then up and back to the
// night street (K16, 38.7 s: the road across the lower third, COMPANY on the left, the row with its rolling doors
// shut, the billboard lit, the stars; the epilogue on the road, the site's footer after the stage).
// Frames of the video were read by eye; K15.1 is the solved K0 camera (takes/home/data.json).
import * as THREE from "three";
import { rectAnchor, type Anchor } from "../../core/anchors";
import { segmentStart, smoothstep } from "../../core/segments";
import type { CamPose } from "../../core/take";
import { LAYOUT_STEPS } from "../../sets/companyFront";
import { billboardFace } from "../../sets/street";
import { DATA } from "./data";
import { fitFov } from "./outside";
import { mix, rig, track, v, type View } from "./beat9";
import { k13View } from "./beat12";
import { SEG } from "./timing";

const D2R = THREE.MathUtils.degToRad;
const idx = (from: string, type: "move" | "hold") => SEG.findIndex((s) => s.from === from && s.type === type);
const seg = (from: string, type: "move" | "hold") => {
  const i = idx(from, type);
  return { s: segmentStart(SEG, i), len: SEG[i].screens };
};
/** The segments of beats 14–16 (screens on the take's own timeline). */
export const B15 = {
  exit: seg("K13", "move"),
  up: seg("K15", "move"),
  k151: seg("K15.1", "hold"),
  back: seg("K15.1", "move"),
  k16: seg("K16", "hold"),
};
/** Screens where beats 14–16 start: the move off K13. */
export const B15_START = B15.exit.s;
/** Share of the move out at which the camera is through COMPANY's door (the facade at z 0). */
export const EXIT_DOOR = 0.4;

/** A solved keyframe camera as a yaw/pitch view. */
function solved(k: "K0", fmt: "pc" | "hp"): View {
  const c = DATA.cams[fmt][k],
    e = new THREE.Euler().setFromQuaternion(new THREE.Quaternion(...c.quat), "YXZ");
  return { pos: new THREE.Vector3(...c.pos), yaw: e.y, pitch: e.x, fov: c.fov };
}

// K15 (video 36 s): COMPANY's facade frontal at night, the sign near the top, the open door in the middle, the next
// shop's rolling door at the right edge. 9:16: the door and the window's right half, the sign above
const K15_PC = v(-0.6, 2.2, 11.5, 0, D2R(4), 38),
  K15_HP = v(-0.4, 2.1, 9.5, 0, D2R(9), 56);
export const k15View = (t: number) => mix(K15_PC, K15_HP, t);
/** K15.1: the billboard, as the hero's K0 (16:9 the face ±43% of the width on the left; 9:16 the face across it). */
export const k151View = (t: number) => mix(solved("K0", "pc"), solved("K0", "hp"), t);
// K16 (video 38.7 s): from high across the road looking a little down, COMPANY ±35% of the width at the left (its
// base at ±64% of the height), three shops on its right, the road across the lower third (the far pavement, z 12.1,
// just below the frame), the stars above the roofs (their tops at ±21%). 9:16: COMPANY and its billboard, the road under them
const K16_PC = v(7.0, 8.4, 25.5, 0, D2R(-12.5), 38.6),
  K16_HP = v(-1.0, 6.8, 17.5, 0, D2R(-14), 60);
export const k16View = (t: number) => mix(K16_PC, K16_HP, t);

const tracks = new Map<string, ReturnType<typeof track>>();
function cached(id: string, make: () => ReturnType<typeof track>) {
  let f = tracks.get(id);
  if (!f) {
    if (tracks.size > 30) tracks.clear();
    tracks.set(id, (f = make()));
  }
  return f;
}

/** K13 → K15: straight back across the room and out through the open door (2.2 m high, ±1 m wide), on to the facade. */
const exitTrack = (step: number, t: number) =>
  cached(`exit ${step} ${t.toFixed(3)}`, () => {
    const a = k13View(step, t),
      end = k15View(t);
    return track([
      { at: 0, view: a },
      { at: EXIT_DOOR - 0.12, view: v(0, 1.75, -1.0, 0, -0.04, a.fov) },
      { at: EXIT_DOOR, view: v(0, 1.78, 0.4, 0, -0.02, 46) },
      { at: 0.7, view: v(-0.2, 1.95, 5.5, 0, D2R(2), 42) },
      { at: 1, view: end },
    ]);
  });

/** K15 → K15.1: craning up the facade past the sign and the roof's edge to the billboard. */
const upTrack = (t: number) =>
  cached(`up ${t.toFixed(3)}`, () => {
    const a = k15View(t),
      end = k151View(t);
    return track([
      { at: 0, view: a },
      { at: 0.5, view: mix(v(-1.4, 5.4, 12.4, end.yaw * 0.5, D2R(6), 30), v(-2.6, 5.8, 9.4, 0, D2R(10), 56), t) },
      { at: 1, view: end },
    ]);
  });

/** K15.1 → K16: up and back, ever wider, to the night street. */
const backTrack = (t: number) =>
  cached(`back ${t.toFixed(3)}`, () => {
    const a = k151View(t),
      end = k16View(t);
    return track([
      { at: 0, view: a },
      { at: 0.45, view: mix(v(2.5, 8.6, 22, 0, D2R(-4), 28), v(-2.4, 8.4, 16, 0, D2R(-6), 58), t) },
      { at: 1, view: end },
    ]);
  });

/** Camera of beats 14–16 for screens x (≥ B15_START), format blend t, screen aspect. */
export function beat15Camera(x: number, t: number, aspect: number): CamPose {
  const step = Math.round(t * LAYOUT_STEPS);
  let view: View;
  if (x < B15.up.s) view = exitTrack(step, t)((x - B15.exit.s) / B15.exit.len);
  else if (x < B15.k151.s) view = upTrack(t)((x - B15.up.s) / B15.up.len);
  else if (x < B15.back.s) view = k151View(t);
  else if (x < B15.k16.s) view = backTrack(t)((x - B15.back.s) / B15.back.len);
  else view = k16View(t);
  return { pos: view.pos, quat: rig(view.yaw, view.pitch), fov: fitFov(view.fov, t, aspect) };
}

/** 0 at dusk (K13) … 1 at night, as the camera comes out through the door (video 34–36 s). */
export const nightAt = (x: number) => smoothstep(B15.exit.s + 0.1 * B15.exit.len, B15.exit.s + 0.75 * B15.exit.len, x);

// ---------- copy (langkah 3): the CTA on the billboard's face, the epilogue over the dark road ----------
// K15.1 is the K0 camera, so the CTA takes the hero's boxes on the face, the same shapes (fixed CSS boxes scaled by
// matrix3d, sized as the hero's: fitted at 1280 × 720, 1920 × 1080, 375 × 812 and 360 × 640, ID and EN): 16:9 the
// title above, the paragraph and the two buttons below; 9:16 the title on the whole face, the rest in a card at the
// bottom of the screen. The epilogue is a line set straight on the screen over the road's band at K16 (flat on the
// road it would be ±11 px and sheared), fading into the footer's colour under it.
/** Share of the face's height for the title on 16:9 (the hero's FACE_SPLIT, world/index). */
const CTA_SPLIT = 0.56;
/** The CTA's boxes on the billboard's face (anchors cta-top, cta-bottom on 16:9; cta-face on 9:16). */
export function ctaAnchors(): Anchor[] {
  const f = billboardFace(),
    topH = f.hh * CTA_SPLIT,
    botH = f.hh - topH;
  return [
    rectAnchor("cta-face", f.cx, f.cy, f.z, f.hw, f.hh),
    rectAnchor("cta-top", f.cx, f.cy + f.hh - topH, f.z, f.hw, topH),
    rectAnchor("cta-bottom", f.cx, f.cy - f.hh + botH, f.z, f.hw, botH),
  ];
}
/** Screens where the CTA's copy is read (the middle of the K15.1 hold). */
export const ctaAt = () => B15.k151.s + B15.k151.len / 2;
/** Opacity of the CTA's copy at screens x: in at the end of the crane up, out as the camera pulls back. */
export const ctaFade = (x: number) =>
  smoothstep(B15.k151.s - 0.15, B15.k151.s - 0.01, x) * (1 - smoothstep(B15.back.s + 0.02, B15.back.s + 0.12, x));
/** Opacity of the epilogue: in as the camera settles on the night street. */
export const epilogueFade = (x: number) => smoothstep(B15.k16.s - 0.2, B15.k16.s, x);
