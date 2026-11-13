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
import { clamp01, segmentStart } from "../../core/segments";
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
/** x of the camera's way out: Kreatekno's right-hand corner pillar (0.6 m wide at the facade's right end). */
const PILLAR_X = KREATEKNO.x0 + KREATEKNO.w - 0.3;

/** Shares of the move out by which Heru is out of the door and they are all past the plaque (the camera dollies in after). */
const OUT_AT = 0.45,
  PASS_AT = 0.84,
  /** Their pace after (m per screen). */
  ON_PACE = 3.5;

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
 * K9.1 → K9b: on toward the facade right of the three's way to the door, out through its right-hand corner pillar
 * (video 2.5 s: the pillar right of the door), round to look back left along the facade (3 s), then facing it as the
 * three come out and walk left (3.5–6.5 s), and in to the plaque once they are past it (7–8.5 s).
 */
const outTrack = (t: number, first: View) =>
  cached(`out ${t.toFixed(3)}`, () => {
    const end = t < 0.5 ? K9B_PC : mix(K9B_PC, K9B_HP[0], t);
    // frontal on the facade between the plaque and the door, both in frame (video 3.6–5.5 s)
    const watch = new THREE.Vector3((P.cx + DOOR.cx) / 2, 1.6, 5.2);
    const watchYaw = 0.04;
    return track([
      { at: 0, view: first },
      { at: 0.12, view: v(lerp(first.pos.x, PILLAR_X, 0.35), 1.45, -9.4, Math.PI, 0, first.fov) },
      { at: 0.24, view: v(PILLAR_X - 0.4, 1.6, -3.0, Math.PI - 0.05, 0, 40) },
      // through the pillar (0.6 m wide, z −0.05 … 0.21), turning right to look back along the facade
      { at: 0.29, view: v(PILLAR_X, 1.65, 0.1, Math.PI - 0.7, 0, 40) },
      { at: 0.34, view: v(PILLAR_X - 0.4, 1.68, 1.6, Math.PI / 2 - 0.35, -0.02, 38) },
      { at: 0.45, view: v(watch.x, watch.y, watch.z, watchYaw, -0.03, 36) },
      // still watching them come out and walk left, a little on toward the plaque
      { at: PASS_AT, view: v(watch.x - 0.6, watch.y, watch.z - 1.3, 0.02, -0.02, 36) },
      { at: 1, view: end },
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

// ---------- the three walking (greybox stand-ins; Heru, Bu Dewi and Wildan themselves in langkah 2) ----------
type Pt = [number, number];
/** A polyline walked at a constant pace: point at distance d (clamped to its ends), `side` metres to its left. */
function along(pts: Pt[], d: number, side = 0): Pt {
  let rest = Math.max(0, d);
  for (let i = 0; i < pts.length - 1; i++) {
    const [ax, az] = pts[i],
      [bx, bz] = pts[i + 1],
      l = Math.hypot(bx - ax, bz - az);
    if (rest <= l || i === pts.length - 2) {
      const k = Math.min(rest, l) / l,
        dx = (bx - ax) / l,
        dz = (bz - az) / l;
      // (left of the way: walking −x along the pavement, toward the street)
      return [ax + (bx - ax) * k + dz * side, az + (bz - az) * k - dx * side];
    }
    rest -= l;
  }
  return pts[pts.length - 1];
}
/** Each one's place in the walk: Heru a little ahead on the left (the street side out on the pavement), Bu Dewi, Wildan. */
const WHO = [
  { lag: 0, side: 0.6 },
  { lag: 0.35, side: 0 },
  { lag: 0.7, side: -0.6 },
] as const;
/** Their way out (m): from inside the door, out, and left along the pavement (its kerb is at z 1.82). */
const OUT_WAY: Pt[] = [
  [DOOR.cx - 0.3, -7.5],
  [DOOR.cx - 0.3, 0.5],
  [DOOR.cx - 1.3, 1.2],
  [shopX(4).x0, 1.2],
];
/** At COMPANY (K10 → K11): along the pavement from the fruit shop to the door, side by side at the end. */
const COMPANY_WAY: Pt[] = [
  [7.5, 1.3],
  [1.2, 1.3],
  [0.1, 0.7],
];
const wayLen = (pts: Pt[]) => pts.slice(1).reduce((a, [x, z], i) => a + Math.hypot(x - pts[i][0], z - pts[i][1]), 0);
/** Distance along OUT_WAY to the pavement outside the door, and where the last of them (Wildan) is past the plaque. */
const OUTSIDE = wayLen(OUT_WAY.slice(0, 2)),
  PASSED = wayLen(OUT_WAY.slice(0, 3)) + (DOOR.cx - 1.3 - (P.cx - P.w / 2 - 0.5)) + WHO[2].lag;
/**
 * Where the three stand at screens x (greybox): out of the door and left along the pavement from K9.1 on, past the
 * plaque before the camera dollies in to it, on along the row while it cranes up; moved (out of sight, the camera in
 * the sky) to the fruit shop for K10 → K11, then to COMPANY's door. Null before the move off K9.1.
 */
export function trioAt(x: number): { x: number; z: number }[] | null {
  if (x < B9.out.s) return null;
  const jump = B9.down.s + 0.4 * B9.down.len;
  if (x < jump) {
    const u = (x - B9.out.s) / B9.out.len,
      d =
        u < OUT_AT
          ? (u / OUT_AT) * OUTSIDE
          : u < PASS_AT
            ? lerp(OUTSIDE, PASSED, (u - OUT_AT) / (PASS_AT - OUT_AT))
            : PASSED + (u - PASS_AT) * B9.out.len * ON_PACE;
    return WHO.map((w) => {
      const [px, pz] = along(OUT_WAY, d - w.lag, w.side);
      return { x: px, z: pz };
    });
  }
  const k = clamp01((x - jump) / (B9.k11.s - jump)),
    total = wayLen(COMPANY_WAY);
  return WHO.map((w, i) => {
    const [px, pz] = along(COMPANY_WAY, k * total - w.lag * (1 - k), w.side * (1 - k));
    // side by side at the door: Heru at its left leaf, Bu Dewi in the middle, Wildan at the right leaf
    return { x: px + (i - 1) * 0.55 * k, z: pz };
  });
}
