// Beats 14–16 (tahap 10, the team's continuation video VID_20261113_185210, 33.5–38.7 s; greybox, langkah 1). From
// K13 (K2's view of the four desks at dusk, issue #23) the camera dollies straight back and out through COMPANY's open
// door (video 33.5–35 s) to the facade frontal at night (K15, passed: 36 s), then cranes up and back
// continuously to the night street (K16, 38.7 s: the road across the lower third, COMPANY on the left, the row with
// its rolling doors shut, the lit billboard carrying the K0 hero copy, the stars; the epilogue on the road).
import * as THREE from "three";
import { segmentStart, smoothstep } from "../../core/segments";
import type { CamPose } from "../../core/take";
import { fitFov } from "./outside";
import { mix, rig, track, v, type View } from "./beat9";
import { k13View, k2Roll } from "./beat12";
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
  wide: seg("K15", "move"),
  k16: seg("K16", "hold"),
};
/** Screens where beats 14–16 start: the move off K13. */
export const B15_START = B15.exit.s;
/** Share of the move out at which the camera is through COMPANY's door (the facade at z 0). */
export const EXIT_DOOR = 0.4;

// K15 (video 36 s): COMPANY's facade frontal at night, the sign near the top, the open door in the middle, the next
// shop's rolling door at the right edge. 9:16: the door and the window's right half, the sign above
const K15_PC = v(-0.6, 2.2, 11.5, 0, D2R(4), 38),
  K15_HP = v(-0.4, 2.1, 9.5, 0, D2R(9), 56);
export const k15View = (t: number) => mix(K15_PC, K15_HP, t);
// K16 (video 38.7 s): from high across the road looking a little down, COMPANY ±35% of the width at the left (its
// base at ±64% of the height), three shops on its right, the road across the lower third (the far pavement, z 12.1,
// just below the frame), the stars above the roofs (their tops at ±21%). 9:16: COMPANY and its billboard, the road under them
// (issue #32: the billboard 25% larger: 16:9 looks 3.7° less down and 9:16 stands 0.7 m further left, so it stays whole
// below the page's header and inside the left edge)
const K16_PC = v(7.0, 8.4, 25.5, 0, D2R(-8.8), 38.6),
  K16_HP = v(-1.7, 6.8, 17.5, 0, D2R(-13), 60);
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

/**
 * K13 → K15: from K2's view (0.9 m inside, 2.25 m high) straight back and down under the lintel (2.2 m) out through
 * the open door (±1 m wide), on to the facade.
 */
const exitTrack = (t: number, aspect: number) =>
  cached(`exit ${t.toFixed(3)} ${aspect.toFixed(3)}`, () => {
    const a = k13View(t, aspect),
      end = k15View(t);
    return track([
      { at: 0, view: a },
      { at: EXIT_DOOR - 0.12, view: v(0, 1.92, -0.15, a.yaw * 0.3, -0.06, (a.fov + 46) / 2) },
      { at: EXIT_DOOR, view: v(0, 1.78, 0.4, 0, -0.02, 46) },
      { at: 0.7, view: v(-0.2, 1.95, 5.5, 0, D2R(2), 42) },
      { at: 1, view: end },
    ]);
  });

/** K15 → K16: crane up while pulling back, widening continuously without approaching or stopping on the billboard. */
const wideTrack = (t: number) =>
  cached(`wide ${t.toFixed(3)}`, () => {
    const a = k15View(t),
      end = k16View(t);
    return track([
      { at: 0, view: a },
      { at: 0.5, view: mix(v(1.6, 5.8, 18.5, 0, D2R(-4), 36), v(-0.7, 4.7, 13.2, 0, D2R(-3), 60), t) },
      { at: 1, view: end },
    ]);
  });

/** Camera of beats 14–16 for screens x (≥ B15_START), format blend t, screen aspect. */
export function beat15Camera(x: number, t: number, aspect: number): CamPose {
  let view: View;
  if (x < B15.wide.s) view = exitTrack(t, aspect)((x - B15.exit.s) / B15.exit.len);
  else if (x < B15.k16.s) view = wideTrack(t)((x - B15.wide.s) / B15.wide.len);
  else view = k16View(t);
  // (K2's roll fading out as the camera leaves K13)
  return { pos: view.pos, quat: rig(view.yaw, view.pitch).multiply(k2Roll(x, t)), fov: fitFov(view.fov, t, aspect) };
}

/** 0 at dusk (K13) … 1 at night, as the camera comes out through the door (video 34–36 s). */
export const nightAt = (x: number) => smoothstep(B15.exit.s + 0.1 * B15.exit.len, B15.exit.s + 0.75 * B15.exit.len, x);

/** Opacity of the epilogue: in as the camera settles on the night street. */
export const epilogueFade = (x: number) => smoothstep(B15.k16.s - 0.2, B15.k16.s, x);
