// Beats 9b–11 (tahap 8, the team's continuation video VID_20261113_185210, 0–21 s; greybox, langkah 1). From K9.1
// the camera goes on toward the facade behind Heru, Bu Dewi and Wildan, out through the facade's solid wall (left of
// the glass front, seen from the street) and round in an arc to face the facade as the three come out of the door
// and walk left past it (video 3–7 s), then dollies in to the wooden plaque left of the door (K9b: the plaque fills
// the frame; 9:16 stops on its two columns). Then back and up over Kreatekno and the row (video 9–12.5 s), into the
// golden sky (K10, passed: sky only, 13–15 s), left along the row up there, and down at COMPANY past its billboard,
// roof and sign (15–18.5 s) to the facade as the three reach its door (K11, 19–21 s).
// Frames of the video were read by eye (852 × 480, no labels): the plaque ±80% of the width at K9b, COMPANY's facade
// filling the width at K11. The set's sizes come from the earlier stages; 9:16 is designed.
import * as THREE from "three";
import { rectAnchor, type Anchor } from "../../core/anchors";
import { clamp01, segmentStart, smoothstep } from "../../core/segments";
import type { CamPose } from "../../core/take";
import { KREATEKNO, shopX } from "../../sets/rowLayout";
import { monotone } from "./counter";
import { k91View } from "./lobby";
import { fitFov } from "./outside";
import { PLAQUE_STOPS, SEG, STOP } from "./timing";

const D2R = THREE.MathUtils.degToRad;
const rig = (yaw: number, pitch: number) => new THREE.Quaternion().setFromEuler(new THREE.Euler(pitch, yaw, 0, "YXZ"));

type View = { pos: THREE.Vector3; yaw: number; pitch: number; fov: number };
const v = (x: number, y: number, z: number, yaw: number, pitch: number, fov: number): View => ({
  pos: new THREE.Vector3(x, y, z),
  yaw,
  pitch,
  fov,
});
const lerp = (a: number, b: number, k: number) => a + (b - a) * k;
function mix(a: View, b: View, k: number): View {
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
/** The plaque's two copy columns (centre x, width): the title and the paragraph left, the facts and the link right. */
export const PLAQUE_COLS = [
  { cx: P.cx - P.w / 4, w: P.w / 2 },
  { cx: P.cx + P.w / 4, w: P.w / 2 },
];
// 16:9: the plaque with its frame (w + 0.12) fills 75% of the width at 36° (vertical), a little below the middle
// with the lamp above it in frame (video 8 s: ±80%, the lamp just in)
const PC_FOV = 36,
  PC_HTAN = Math.tan(D2R(PC_FOV / 2)) * (16 / 9);
const K9B_PC = v(P.cx, P.y + 0.17, PZ + (P.w + 0.12) / 0.75 / 2 / PC_HTAN, 0, 0, PC_FOV);
// 9:16: each column at 88% of the width at 50°
const HP_FOV = 50,
  HP_HTAN = Math.tan(D2R(HP_FOV / 2)) * (9 / 16);
const K9B_HP = PLAQUE_COLS.map((c) => v(c.cx, P.y, PZ + c.w / 0.88 / 2 / HP_HTAN, 0, 0, HP_FOV));

// ---------- K11: COMPANY's facade, the three at its door ----------
// 16:9: frontal, the facade (−6.9 … 4.7 m) across the width, the sign near the top, the door a little right of the
// middle (video 20 s). 9:16: the door and the three in the middle, the sign's middle above
const K11_PC = v(-1.2, 1.7, 8.7, 0, D2R(2), 36),
  K11_HP = v(-0.2, 1.75, 7.2, 0, D2R(6), 52);

/** A move through views at times `at` (0..1): positions on a centripetal curve, paced and turned by monotone cubics. */
function track(keys: { at: number; view: View }[]) {
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
/** x of the camera's way out through the facade's solid wall (inside, the lobby's left wall is at x0 + 3.1). */
const WALL_X = KREATEKNO.x0 + 3.6;

/**
 * Share of the move out by which the three are past the plaque, where the camera starts its dolly in to it (the world
 * holds it there until they are, outsideCast BT.passed).
 */
export const PASS_AT = 0.84;
/** Screens where the camera leaves its watch on the facade for the dolly in to the plaque (a gate, see PASS_AT). */
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
 * K9.1 → K9b: on toward the facade left of the three's way to the door, out through its solid wall left of the glass
 * (behind the plaque's side), turning right as it comes out to look along the facade at the door (video 2.5–3 s),
 * frontal on it between the plaque and the door as the three come out and walk left (3.5–6.5 s), and in to the
 * plaque once they are past it (7–8.5 s). The video goes out through a pillar right of the door and turns back
 * left along the facade; turned that way the frame held the whole row, the lobby and the meeting room behind the
 * glass at once (155 draw calls, 207 rb triangles), so the camera goes out on the plaque's side and turns right.
 */
const outTrack = (t: number, first: View) =>
  cached(`out ${t.toFixed(3)}`, () => {
    const end = t < 0.5 ? K9B_PC : mix(K9B_PC, K9B_HP[0], t);
    // frontal on the facade between the plaque and the door, both in frame (video 3.6–5.5 s)
    const watch = new THREE.Vector3((P.cx + DOOR.cx) / 2, 1.6, 5.2);
    const T = 2 * Math.PI;
    return track([
      { at: 0, view: first },
      // (over the heads, down the middle of the lobby's left half: Wildan sets off below and to the right, from the
      // meeting room to the door, his hair at 1.77 m; well clear of the meeting room's glass and its corner post)
      { at: 0.12, view: v(WALL_X + 1.3, 1.92, -9.4, Math.PI, -0.04, first.fov) },
      { at: 0.22, view: v(WALL_X + 0.95, 1.9, -3.6, Math.PI, -0.02, 40) },
      // across to the facade's solid part and through it (0.3 m thick, z −0.28 … 0.02), turning right to the door
      { at: 0.27, view: v(WALL_X + 0.1, 1.78, -0.9, Math.PI + 0.12, 0, 40) },
      { at: 0.3, view: v(WALL_X - 0.05, 1.68, 0.5, Math.PI + 0.55, 0, 40) },
      { at: 0.36, view: v(WALL_X - 0.3, 1.68, 2.6, (3 * Math.PI) / 2 + 0.45, -0.02, 38) },
      { at: 0.45, view: v(watch.x, watch.y, watch.z, T + 0.04, -0.03, 36) },
      // still watching them come out and walk left, a little on toward the plaque
      { at: PASS_AT, view: v(watch.x - 0.6, watch.y, watch.z - 1.3, T + 0.02, -0.02, 36) },
      { at: 1, view: { ...end, yaw: end.yaw + T } },
    ]);
  });

/** K9b → K10: back and up over Kreatekno and the row to the sky (K10: sky only, looking up over the roofs). */
const K10 = v(32, 15.5, 7.5, 0, D2R(24), 40);
const upTrack = (t: number) =>
  cached(`up ${t.toFixed(3)}`, () => {
    const a = t < 0.5 ? K9B_PC : mix(K9B_PC, K9B_HP[1], t);
    const e5 = shopX(5);
    return track([
      { at: 0, view: a },
      { at: 0.12, view: v(P.cx - 0.6, 2.4, 4.6, -0.05, D2R(-6), 40) },
      // high in front of the electronics shop, looking down at Kreatekno's front and the three on the pavement
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

/** On 9:16, where in the K9b hold the camera is: on column 0, moving (k), or on column 1. */
function plaqueStop(s: number, len: number) {
  const unit = len / (PLAQUE_STOPS * STOP.dwell + (PLAQUE_STOPS - 1) * STOP.move);
  const k = clamp01((s - STOP.dwell * unit) / (STOP.move * unit));
  return k * k * (3 - 2 * k);
}

/** Camera of beats 9b–11 for screens x (≥ B9_START), format blend t, screen aspect. */
export function beat9Camera(x: number, t: number, aspect: number): CamPose {
  let view: View;
  if (x < B9.k9b.s) view = outTrack(t, k91View(t))((x - B9.out.s) / B9.out.len);
  else if (x < B9.up.s) {
    const hp = t < 0.5 ? K9B_PC : mix(K9B_HP[0], K9B_HP[1], plaqueStop(x - B9.k9b.s, B9.k9b.len));
    view = mix(K9B_PC, hp, t);
  } else if (x < B9.down.s) view = upTrack(t)((x - B9.up.s) / B9.up.len);
  else if (x < B9.k11.s) view = downTrack(t)((x - B9.down.s) / B9.down.len);
  else view = mix(K11_PC, K11_HP, t);
  return { pos: view.pos, quat: rig(view.yaw, view.pitch), fov: fitFov(view.fov, t, aspect) };
}

/** Screens where a 9:16 stop on plaque column i is framed as it will be read (the copy box is sized there). */
export function plaqueStopAt(i: number, t: number) {
  if (t < 0.5) return B9.k9b.s + B9.k9b.len / 2;
  const unit = B9.k9b.len / (PLAQUE_STOPS * STOP.dwell + (PLAQUE_STOPS - 1) * STOP.move);
  return B9.k9b.s + (i * (STOP.dwell + STOP.move) + STOP.dwell / 2) * unit;
}

// ---------- the copy on the plaque (langkah 3): "Tentang Kreatekno" in two columns ----------
/**
 * The plaque's two copy boxes on its face, a few mm in front of it, a little in from its edges and the middle: the
 * title and the paragraph left (`about-0`), the four facts and the link right (`about-1`). On 9:16 each is read at
 * its own stop (stop i = column i).
 */
export function plaqueAnchors(): { anchor: Anchor; stop: number }[] {
  const edge = 0.05,
    seam = 0.03,
    hh = P.h / 2 - edge,
    z = PZ + 0.004;
  return PLAQUE_COLS.map((c, i) => {
    const x0 = i === 0 ? P.cx - P.w / 2 + edge : P.cx + seam,
      x1 = i === 0 ? P.cx - seam : P.cx + P.w / 2 - edge;
    return { anchor: rectAnchor(`about-${i}`, (x0 + x1) / 2, P.y, z, (x1 - x0) / 2, hh), stop: i };
  });
}
/** Opacity of the plaque's copy at screens x: in as the dolly settles on the plaque, out as the camera pulls back. */
export const plaqueCopyFade = (x: number) =>
  smoothstep(B9.k9b.s - 0.15, B9.k9b.s, x) * (1 - smoothstep(B9.up.s, B9.up.s + 0.06, x));
