// Beats 9b–11 (tahap 8, the team's continuation video VID_20261113_185210, 0–21 s; greybox, langkah 1). From K9.1
// the camera follows Heru, Bu Dewi and Wildan through the open right leaf, turns right toward COMPANY, then faces
// the facade and dollies in to the wooden plaque left of the door (K9b: the plaque fills
// the frame, the lamp over it; 9:16 the whole plaque too, user 17 Nov, with its own layout of the copy). Then back and up over Kreatekno and the
// golden sky (K10, passed: sky only, 13–15 s), left along the row up there, and down at COMPANY past its billboard,
// roof and sign (15–18.5 s) to the facade as the three reach its door (K11, 19–21 s).
// Frames of the video were read by eye (852 × 480, no labels): the plaque ±80% of the width at K9b, COMPANY's facade
// filling the width at K11. The set's sizes come from the earlier stages; 9:16 is designed.
import * as THREE from "three";
import { rectAnchor, type Anchor } from "../../core/anchors";
import { clamp01, segmentStart, smoothstep } from "../../core/segments";
import type { CamPose } from "../../core/take";
import { KREATEKNO, SHOPS, shopX } from "../../sets/rowLayout";
import { monotone } from "./counter";
import { k91View } from "./lobby";
import { fitFov } from "./outside";
import { SEG } from "./timing";

const D2R = THREE.MathUtils.degToRad;
export const rig = (yaw: number, pitch: number) =>
  new THREE.Quaternion().setFromEuler(new THREE.Euler(pitch, yaw, 0, "YXZ"));

export type View = { pos: THREE.Vector3; yaw: number; pitch: number; fov: number };
export const v = (x: number, y: number, z: number, yaw: number, pitch: number, fov: number): View => ({
  pos: new THREE.Vector3(x, y, z),
  yaw,
  pitch,
  fov,
});
const lerp = (a: number, b: number, k: number) => a + (b - a) * k;
export function mix(a: View, b: View, k: number): View {
  return {
    pos: a.pos.clone().lerp(b.pos, k),
    yaw: lerp(a.yaw, b.yaw, k),
    pitch: lerp(a.pitch, b.pitch, k),
    fov: lerp(a.fov, b.fov, k),
  };
}

const idx = (from: string, type: "move" | "hold") => SEG.findIndex((s) => s.from === from && s.type === type);
const seg = (from: string, type: "move" | "hold") => {
  const i = idx(from, type);
  return { s: segmentStart(SEG, i), len: SEG[i].screens };
};
/** The segments of beats 9b–11 (screens on the take's own timeline). */
export const B9 = {
  out: seg("K9.1", "move"),
  k9b: seg("K9b", "hold"),
  up: seg("K9b", "move"),
  down: seg("K10", "move"),
  k11: seg("K11", "hold"),
};
/** Screens where beats 9b–11 start: the move off K9.1. */
export const B9_START = B9.out.s;

// ---------- the plaque (K9b) ----------
const P = KREATEKNO.plaque,
  /** The plaque's face (z): its wooden frame 0.07 deep at z 0.06, the face 0.04 deep at 0.09. */
  PZ = 0.11;
/** The plaque's top edge: it stays put when the plaque's height changes (the lamp hangs over it). */
const P_TOP = P.y + P.h / 2;
// The upper copy columns keep the size and place (from the top) they had on the 2.05 m plaque of issue #34, so the
// 16:9 copy is drawn as before; the logo area keeps its size too and sits on the bottom, so the shorter plaque (user
// 17 Nov) takes 0.2 m out of the space between the paragraph and "Trusted By".
const TOP_H = 0.738,
  TOP_CY = P_TOP - 0.0615 - TOP_H / 2,
  TRUSTED_H = 1.312,
  TRUSTED = { cx: P.cx, cy: P.y - P.h / 2 + TRUSTED_H / 2, w: P.w, h: TRUSTED_H };
/** The plaque's upper copy columns: the title and paragraph left, the facts and link right. */
export const PLAQUE_COLS = [
  { cx: P.cx - P.w / 4, cy: TOP_CY, w: P.w / 2, h: TOP_H },
  { cx: P.cx + P.w / 4, cy: TOP_CY, w: P.w / 2, h: TOP_H },
];
/**
 * 9:16 (user 17 Nov: one stop on the whole plaque, as on 16:9, with its own layout): the title and paragraph across
 * the face's width, the facts under them, then the logos (two rows, no names), each band from the top down.
 */
const HP_BANDS = (() => {
  const edge = 0.06,
    gap = 0.03,
    hs = [0.42, 0.57],
    out: { cy: number; h: number }[] = [];
  let y = P_TOP - edge;
  for (const h of hs) {
    out.push({ cy: y - h / 2, h });
    y -= h + gap;
  }
  const bottom = P.y - P.h / 2 + edge;
  out.push({ cy: (y + bottom) / 2, h: y - bottom });
  return out;
})();
// 16:9: the plaque wholly in frame with the lamp over it below the page's floating header (user 17 Nov; issue #34
// framed the plaque alone, the lamp under the header): from the frame's bottom edge to the shade's top and a little
// of the wall above, the plaque ±67% of the height.
const PC_FOV = 36,
  PC_LOW = P.y - P.h / 2 - 0.075 - 0.08,
  PC_HIGH = P_TOP + 0.45,
  PC_SPAN = (PC_HIGH - PC_LOW) / (1 - 0.13),
  PC_DIST = PC_SPAN / 2 / Math.tan(D2R(PC_FOV / 2));
const K9B_PC = v(P.cx, PC_LOW + PC_SPAN / 2, PZ + PC_DIST, 0, 0, PC_FOV);
// 9:16: the plaque's frame (0.075 m round the face) at 96% of the width at 50°, a little high so the lamp shows too
const HP_FOV = 50,
  HP_HTAN = Math.tan(D2R(HP_FOV / 2)) * (9 / 16);
const K9B_HP = v(P.cx, P.y + 0.15, PZ + (P.w + 0.15) / 0.96 / 2 / HP_HTAN, 0, 0, HP_FOV);

// ---------- K11: COMPANY's facade, the three at its door ----------
// 16:9: frontal, the facade (−6.9 … 4.7 m) across the width, the sign near the top, the door a little right of the
// middle (video 20 s). 9:16: the door and the three in the middle, the sign's middle above
const K11_PC = v(-1.2, 1.7, 8.7, 0, D2R(2), 36),
  K11_HP = v(0, 1.75, 7.2, 0, D2R(6), 52);
/** The K11 view for format blend t (where beats 12–13 start, takes/home/beat12). */
export const k11View = (t: number) => mix(K11_PC, K11_HP, t);

/** A move through views at times `at` (0..1): positions on a centripetal curve, paced and turned by monotone cubics. */
export function track(keys: { at: number; view: View }[]) {
  const curve = new THREE.CatmullRomCurve3(
    keys.map((k) => k.view.pos),
    false,
    "centripetal",
  );
  const n = keys.length - 1,
    L = curve.getLengths(n * 60),
    ats = keys.map((k) => k.at);
  const s = monotone(
      ats,
      keys.map((_, i) => L[i * 60] / L[n * 60]),
    ),
    yaw = monotone(
      ats,
      keys.map((k) => k.view.yaw),
    ),
    pitch = monotone(
      ats,
      keys.map((k) => k.view.pitch),
    ),
    fov = monotone(
      ats,
      keys.map((k) => k.view.fov),
    );
  return (u: number): View => ({
    pos: curve.getPointAt(clamp01(s(clamp01(u)))),
    yaw: yaw(clamp01(u)),
    pitch: pitch(clamp01(u)),
    fov: fov(clamp01(u)),
  });
}

/** Kreatekno's door, the way out for the camera's three. */
const DOOR = KREATEKNO.door;
/** Only the right leaf opens: its clear centre, away from the fixed left leaf and the open leaf's hinge. */
const EXIT_X = DOOR.cx + DOOR.w / 4;
/** End of the forward approach (on the pavement, z EXIT_Z); the remaining track turns toward the plaque. */
const EXIT_AT = 0.66,
  EXIT_Z = 1.7;
/** Camera height following the three: over their heads (Wildan's hair at 1.77 m), well under the lintel (2.5 m). */
const FOLLOW_Y = 1.95;

/**
 * Share of the move out by which the three are past the plaque: the camera looks along the pavement after them
 * there, and the world holds it there until they are (outsideCast BT.passed), before it turns on to the plaque.
 */
export const PASS_AT = 0.74;
/** Screens where the camera leaves its view along the pavement for the plaque (a gate, see PASS_AT). */
export const PLAQUE_GATE = B9.out.s + PASS_AT * B9.out.len;

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
 * K9.1 → K9b (issue #22): follow the trio through the door below its lintel. Keep x straight through the whole
 * leaf's swing, then turn right (decreasing YXZ yaw) along the pavement toward COMPANY, and on to the plaque.
 */
const outTrack = (t: number, first: View) =>
  cached(`out ${t.toFixed(3)}`, () => {
    const end = mix(K9B_PC, K9B_HP, t);
    // frontal on the facade between the plaque and the door, both in frame (video 3.6–5.5 s)
    const watch = new THREE.Vector3((P.cx + DOOR.cx) / 2, 1.6, 5.2);
    // (on the pavement the three walk left at z ±0.5–1.3; 9:16's narrow frame needs the camera nearer their line)
    const lane = 1.85 - 0.35 * t;
    return track([
      { at: 0, view: first },
      // over their heads behind them, down the lobby to the open right leaf
      { at: 0.18, view: v(EXIT_X, FOLLOW_Y, -9.4, Math.PI, -0.1, first.fov) },
      { at: 0.36, view: v(EXIT_X, FOLLOW_Y, -5.0, Math.PI, -0.09, 48) },
      { at: 0.49, view: v(EXIT_X, FOLLOW_Y, -1.5, Math.PI, -0.08, 52) },
      { at: 0.55, view: v(EXIT_X, FOLLOW_Y, -0.35, Math.PI, -0.08, 52) },
      // out on the pavement, turning right after them toward COMPANY
      { at: 0.6, view: v(EXIT_X - 0.2, 1.9, 0.9, Math.PI - 0.35, -0.08, 52) },
      { at: EXIT_AT, view: v(DOOR.cx - 0.3, 1.85, EXIT_Z, Math.PI / 2 - 0.08, -0.08, 50) },
      // watching them walk away along the facade (held here until they are past the plaque, PASS_AT), then on round
      // to the facade and in to the plaque
      { at: PASS_AT, view: v(DOOR.cx - 1.4, 1.8, lane, Math.PI / 2 - 0.12, -0.07, 48) },
      { at: 0.84, view: v(DOOR.cx - 2.3, 1.78, lane + 0.1, Math.PI / 2 - 0.2, -0.06, 46) },
      { at: 0.92, view: v(watch.x - 0.6, watch.y, watch.z - 1.3, 0, -0.02, 36) },
      { at: 1, view: end },
    ]);
  });

/** Cap scroll by the last walker's safe forward distance; invert only the monotonic approach to the pavement. */
export function exitCameraLimit(maxZ: number, t: number) {
  if (maxZ >= EXIT_Z) return Infinity;
  const path = outTrack(t, k91View(t));
  let lo = 0,
    hi = EXIT_AT;
  for (let i = 0; i < 16; i++) {
    const mid = (lo + hi) / 2;
    if (path(mid).pos.z <= maxZ) lo = mid;
    else hi = mid;
  }
  return B9.out.s + lo * B9.out.len;
}

/** Open before the camera reaches the inward-swinging leaf; close only once it is safely on the pavement. */
export const exitCameraOpen = (x: number) =>
  smoothstep(B9.out.s + 0.4 * B9.out.len, B9.out.s + 0.46 * B9.out.len, x) *
  (1 - smoothstep(B9.out.s + EXIT_AT * B9.out.len, PLAQUE_GATE, x));

/** K9b → K10: back and up over Kreatekno and the row to the sky (K10: sky only, looking up over the roofs). */
const K10 = v(32, 15.5, 7.5, 0, D2R(24), 40);
const upTrack = (t: number) =>
  cached(`up ${t.toFixed(3)}`, () => {
    const a = mix(K9B_PC, K9B_HP, t);
    // (the last shop left of Kreatekno: the electronics shop until it was taken out, user 14 Nov)
    const e5 = shopX(SHOPS.length - 1);
    return track([
      { at: 0, view: a },
      { at: 0.12, view: v(P.cx - 0.6, 2.4, 4.6, -0.05, D2R(-6), 40) },
      // high in front of the last shop, looking down at Kreatekno's front and the three on the pavement
      { at: 0.38, view: v(e5.cx, 9.5, 14.5, -0.42, D2R(-30), 40) },
      { at: 0.6, view: v(e5.cx - 1.5, 12.5, 12.0, -0.3, D2R(-26), 40) },
      // over the roofs, looking along them (video 12.5–13 s)
      { at: 0.82, view: v(e5.x0 - 2, 13.5, 6.0, -0.15, D2R(-10), 40) },
      { at: 1, view: K10 },
    ]);
  });

/** K10 → K11: left along the row in the sky, down at COMPANY past the billboard, the roof and the sign. */
const downTrack = (t: number) =>
  cached(`down ${t.toFixed(3)}`, () => {
    const end = mix(K11_PC, K11_HP, t);
    return track([
      { at: 0, view: K10 },
      { at: 0.35, view: v(-4.0, 13.4, 10.0, 0, D2R(20), 40) },
      // the billboard rises into the frame (video 15.5–16.5 s), then the roof and the first floor
      { at: 0.6, view: v(-3.4, 9.6, 9.6, 0, D2R(6), 38) },
      { at: 0.8, view: v(-2.2, 5.4, 9.2, 0, D2R(2), 37) },
      { at: 1, view: end },
    ]);
  });

/** Camera of beats 9b–11 for screens x (≥ B9_START), format blend t, screen aspect. */
export function beat9Camera(x: number, t: number, aspect: number): CamPose {
  let view: View;
  if (x < B9.k9b.s) view = outTrack(t, k91View(t))((x - B9.out.s) / B9.out.len);
  else if (x < B9.up.s) view = mix(K9B_PC, K9B_HP, t);
  else if (x < B9.down.s) view = upTrack(t)((x - B9.up.s) / B9.up.len);
  else if (x < B9.k11.s) view = downTrack(t)((x - B9.down.s) / B9.down.len);
  else view = mix(K11_PC, K11_HP, t);
  return { pos: view.pos, quat: rig(view.yaw, view.pitch), fov: fitFov(view.fov, t, aspect) };
}

/** Screens where the plaque's copy is framed as it will be read (the copy boxes are sized there): its hold's middle. */
export const plaqueStopAt = () => B9.k9b.s + B9.k9b.len / 2;

// ---------- the copy on the plaque (langkah 3): "Tentang Kreatekno" ----------
/**
 * The plaque's copy boxes on its face, a few mm in front of it, a little in from its edges and the middle. 16:9: the
 * title and the paragraph left (`about-0`), the four facts and the link right (`about-1`), all client logos in the
 * lower area (`about-2`, issue #34). 9:16 (user 17 Nov): the same three, each a band across the face from the top
 * (`about-hp-0..2`), read at once on the one stop.
 */
export function plaqueAnchors(): Anchor[] {
  const edge = 0.05,
    seam = 0.03,
    z = PZ + 0.004;
  const columns = PLAQUE_COLS.map((c, i) => {
    const x0 = i === 0 ? P.cx - P.w / 2 + edge : P.cx + seam,
      x1 = i === 0 ? P.cx - seam : P.cx + P.w / 2 - edge;
    return rectAnchor(`about-${i}`, (x0 + x1) / 2, c.cy, z, (x1 - x0) / 2, c.h / 2);
  });
  columns.push(rectAnchor("about-2", TRUSTED.cx, TRUSTED.cy, z, TRUSTED.w / 2 - edge, TRUSTED.h / 2));
  HP_BANDS.forEach((b, i) => columns.push(rectAnchor(`about-hp-${i}`, P.cx, b.cy, z, P.w / 2 - 0.07, b.h / 2)));
  return columns;
}
/** Opacity of the plaque's copy at screens x: in as the dolly settles on the plaque, out as the camera pulls back. */
export const plaqueCopyFade = (x: number) =>
  smoothstep(B9.k9b.s - 0.15, B9.k9b.s, x) * (1 - smoothstep(B9.up.s, B9.up.s + 0.06, x));
