// Beats 6–9a (tahap 7, the team's videos k6 - k5a.6, K6 -K7, K7 - K8, K8 - K9.1). From K5a.6 (still a moment,
// waiting for Bu Dewi to go in) the camera dollies in over Heru's head through Kreatekno's door, which he holds open
// (the leaf stands fully open as it passes), passes Bu Dewi on her left and comes to the corkboard (K6); trucks
// left and down to the rack (K7); goes on left and swings round ±90° to face the meeting room's glass (K8, the room
// on the lobby's left wall: langkah 1's plan); then, after a moment still, turns another ±90° to the facade backing
// off a little and ends easing forward (K9.1) as Bu Dewi and Heru walk toward the door and Wildan comes out of the
// meeting room. Every move starts and stops smoothly. 16:9 stands still on each keyframe; 9:16 stops on each item of
// it in turn (text fit test 11 Nov: one polaroid, one book, four sticky notes per stop). The two have their own
// timelines (timing.ts `pc`, user 11 Nov): landscape (t < 0.5, as the page's PORTRAIT_QUERY) stands still on the
// keyframe through its shorter hold, portrait walks its stops.
// The 16:9 keyframes were measured on the videos' last frames with the set's sizes chosen from them (see
// sets/lobbyLayout); 9:16 is designed.
import * as THREE from "three";
import { lerp } from "../../core/kit";
import { clamp01, ease, segmentStart, smoothstep } from "../../core/segments";
import type { CamPose } from "../../core/take";
import { BOARD_ITEMS, GLASS_ITEMS, LOBBY, lx, RACK_ITEMS } from "../../sets/lobbyLayout";
import { KREATEKNO } from "../../sets/rowLayout";
import { monotone } from "./counter";
import { fitFov } from "./outside";
import { LOBBY_STOPS, SEG, STOP, stopSpan, type KeyName } from "./timing";
import { rectAnchor, type Anchor } from "../../core/anchors";

const D2R = THREE.MathUtils.degToRad;
const rig = (yaw: number, pitch: number) => new THREE.Quaternion().setFromEuler(new THREE.Euler(pitch, yaw, 0, "YXZ"));

type View = { pos: THREE.Vector3; yaw: number; pitch: number; fov: number };
const v = (x: number, y: number, z: number, yaw: number, pitch: number, fov: number): View => ({
  pos: new THREE.Vector3(x, y, z),
  yaw,
  pitch,
  fov,
});

const L = LOBBY,
  F = L.floor,
  BACK = L.back;
/** Centre (z) of the glass section framed at K8, and the board's world x. */
const GZ = (L.room.glass[0] + L.room.glass[1]) / 2,
  BX = lx(L.board.cx),
  RX = lx(L.rack.cx);

// ---------- 16:9 keyframes (video last frames) ----------
const PC = {
  // the board 2.6 m wide fills 83% of the width at 36° (vertical): 2.72 m off the wall, level with its centre
  K6: v(BX, L.board.cy, BACK + 2.72, 0, 0, 36),
  // the rack 1.7 m wide fills 90% of the width (1.63 m off its front), the camera low (0.5 m up: the video's
  // horizon is level with the lower tier). Langkah 5: 0.12 m higher and a hair wider, so the sign (the title) comes
  // out from under the page's floating header (its bottom at ±76 px of 720) with the floor still in frame
  K7: v(RX, F + 0.62, BACK + L.rack.d + 1.63, 0, 0, 36.4),
  // the framed glass 4.9 × 2.7 m fills the frame: 4.34 m off it, level with its middle, facing -x. Langkah 6: 6 cm
  // higher, so the bands over the notes (the FAQ's title) come out from under the page's floating header (±15 px
  // lower at 720 px; their top was 5 px under it)
  K8: v(lx(L.room.glassX) + 4.34, F + 1.46, GZ, Math.PI / 2, 0, 36),
  // vanishing point and the facade's floor and ceiling lines: eye 1.33 m over the pavement's level, 13.4 m from the
  // glass, looking down 3° (the horizon is above the middle); the facade 9 m wide at 830 px gives 32°
  K91: v(lx(6.0), 1.33, -13.7, Math.PI, D2R(-3), 32),
};

// ---------- 9:16 stops (designed: the item at 80–90% of the width at 50°) ----------
const HP_FOV = 50,
  HP_HTAN = Math.tan(D2R(HP_FOV / 2)) * (9 / 16);
/** Distance at which a width w fills the 9:16 frame's width. */
const fill = (w: number) => w / 2 / HP_HTAN;
const boardStop = (x: number, y: number, w: number) => v(BX + x, L.board.cy + y, BACK + 0.05 + fill(w), 0, 0, HP_FOV);
const rackStop = (x: number, y: number, w: number) => v(RX + x, F + y, BACK + 0.12 + fill(w), 0, 0, HP_FOV);
const glassStop = (x: number, y: number, w: number) =>
  v(lx(L.room.glassX) + fill(w), F + y, GZ - x, Math.PI / 2, 0, HP_FOV);
const P = BOARD_ITEMS.polaroids,
  B = RACK_ITEMS.books;
const HP: Record<"K6" | "K7" | "K8", View[]> = {
  // the strip with the title over the polaroids, then the 3 polaroids left to right (issue #17: the row sits lower
  // than the old top row, so the first stop looks lower too, the whole board in frame under the header)
  K6: [boardStop(0, 0.18, BOARD_ITEMS.strip.w / 0.87), ...P.map((p) => boardStop(p.x, p.y, p.w / 0.8))],
  // the sign with the title, the three articles right to left, then the button on the bottom tier's left
  K7: [
    rackStop(0, L.sign.cy - F - 0.12, L.sign.w / 0.85),
    ...[2, 1, 0].map((i) => rackStop(B[i].x, B[i].y, B[i].w / 0.86)),
    rackStop(RACK_ITEMS.button.x, RACK_ITEMS.button.y + 0.05, B[3].w / 0.86),
  ],
  // two columns of notes at a time with the band over them (title, then help line and button)
  K8: [
    glassStop((GLASS_ITEMS.notes[0].x + GLASS_ITEMS.notes[1].x) / 2, 1.43, 1.9 / 0.9),
    glassStop((GLASS_ITEMS.notes[2].x + GLASS_ITEMS.notes[3].x) / 2, 1.43, 1.9 / 0.9),
  ],
};
const HP91 = v(lx(6.0), 1.45, -13.7, Math.PI, D2R(-3), 58);

const idx = (from: KeyName, type: "move" | "hold") => SEG.findIndex((s) => s.from === from && s.type === type);
// ---------- copy on the props (langkah 5): anchors, where each is framed, when it shows ----------
/** Plain hold starts (screens) of the three holds with copy, and when their copy leaves. */
const holdOf = (k: "K6" | "K7" | "K8") => segmentStart(SEG, idx(k, "hold"));
/**
 * The copy's anchors, each a rectangle on its prop's face, a few mm in front of it: the strip and the 3 polaroids
 * (K6), the sign, the top tier's 3 open books and the bottom tier's left book ("Lihat semua artikel", K7), the 8
 * sticky notes and the two bands over them on the meeting room's glass (K8, facing +x, so built here).
 */
export function lobbyAnchors(): { anchor: Anchor; hold: "K6" | "K7" | "K8"; stop: number }[] {
  const bz = BACK + 0.03,
    by = L.board.cy;
  const out: { anchor: Anchor; hold: "K6" | "K7" | "K8"; stop: number }[] = [];
  const S = BOARD_ITEMS.strip;
  out.push({
    anchor: rectAnchor("board-strip", BX + S.x, by + S.y, bz + 0.0045, S.w / 2, S.h / 2),
    hold: "K6",
    stop: 0,
  });
  // 9:16: left to right after the strip (HP stops above)
  BOARD_ITEMS.polaroids.forEach((p, i) =>
    out.push({
      anchor: rectAnchor(`testi-${i}`, BX + p.x, by + p.y, bz + 0.0065, p.w / 2, p.h / 2),
      hold: "K6",
      stop: i + 1,
    }),
  );
  const Sg = L.sign;
  out.push({
    anchor: rectAnchor("rack-sign", lx(Sg.cx), Sg.cy, BACK + 0.031, Sg.w / 2 - 0.07, Sg.h / 2 - 0.012),
    hold: "K7",
    stop: 0,
  });
  // the books' pages stand open in a shallow V from the spine (sets/lobby): the plane through their outer edges
  const pz = BACK + 0.14 + 0.04;
  B.slice(0, 3).forEach((b, i) =>
    out.push({
      anchor: rectAnchor(`article-${i}`, RX + b.x, F + b.y, pz, b.w / 2 - 0.006, b.h / 2 - 0.004),
      hold: "K7",
      stop: [2, 1, 0].indexOf(i) + 1,
    }),
  );
  const all = B[3];
  out.push({
    anchor: rectAnchor("rack-all", RX + all.x, F + all.y, pz, all.w / 2 - 0.006, all.h / 2 - 0.004),
    hold: "K7",
    stop: 4,
  });
  // the glass faces the lobby (+x); seen from there, right is toward the back wall (−z)
  const gx = lx(L.room.glassX) + 0.013;
  const onGlass = (name: string, r: { x: number; y: number; w: number; h: number }): Anchor => {
    const z = GZ - r.x,
      y = F + r.y;
    return {
      name,
      corners: [
        new THREE.Vector3(gx, y + r.h / 2, z + r.w / 2),
        new THREE.Vector3(gx, y + r.h / 2, z - r.w / 2),
        new THREE.Vector3(gx, y - r.h / 2, z + r.w / 2),
        new THREE.Vector3(gx, y - r.h / 2, z - r.w / 2),
      ],
    };
  };
  out.push({ anchor: onGlass("faq-title", GLASS_ITEMS.title), hold: "K8", stop: 0 });
  out.push({ anchor: onGlass("faq-help", GLASS_ITEMS.help), hold: "K8", stop: 1 });
  GLASS_ITEMS.notes.forEach((n, i) =>
    out.push({
      anchor: onGlass(`faq-${i}`, { ...n, w: n.w - 0.01, h: n.h - 0.01 }),
      hold: "K8",
      stop: i % 4 < 2 ? 0 : 1,
    }),
  );
  return out;
}

/**
 * Screens where an item's copy is framed as it will be read: on 9:16 its own stop, on 16:9 (t < 0.5) its hold (the
 * camera stands still on the keyframe). The copy boxes are sized there, so the text is drawn about 1:1.
 */
export function copyStopAt(hold: "K6" | "K7" | "K8", stop: number, t: number) {
  const len = SEG[idx(hold, "hold")].screens;
  if (t < 0.5) return holdOf(hold) + len / 2;
  const s = stopSpan(len, LOBBY_STOPS[hold], stop);
  return holdOf(hold) + (s.from + s.to) / 2;
}

/**
 * Opacity of each hold's copy at screens x: in as the camera settles on the hold (the move's last stretch), out as
 * the next move starts (K8: once the camera starts to turn, after its moment still).
 */
export function lobbyCopyFade(x: number) {
  const f = (from: number, to: number) => smoothstep(from - 0.12, from, x) * (1 - smoothstep(to, to + 0.06, x));
  return {
    K6: f(LOBBY_MARKS.k6, LOBBY_MARKS.truck),
    K7: f(holdOf("K7"), LOBBY_MARKS.k7end),
    K8: f(holdOf("K8"), LOBBY_MARKS.turn + TURN_STILL * LOBBY_MARKS.turnLen),
  };
}

/** Screens where the lobby starts (the move off K5a.6). */
export const LOBBY_START = segmentStart(SEG, idx("K5a.6", "move"));
/**
 * Starts (screens) of the K6 hold, the K6 → K7 move, the K7 → K8 move, the K8 → K9.1 move and the K9.1 hold, with
 * the last two's lengths: for what shows when, the light and the people's clocks.
 */
export const LOBBY_MARKS = {
  k6: segmentStart(SEG, idx("K6", "hold")),
  truck: segmentStart(SEG, idx("K6", "move")),
  k7end: segmentStart(SEG, idx("K7", "move")),
  turn: segmentStart(SEG, idx("K8", "move")),
  turnLen: SEG[idx("K8", "move")].screens,
  k91: segmentStart(SEG, idx("K9.1", "hold")),
  k91Len: SEG[idx("K9.1", "hold")].screens,
};

/** On 9:16, where in its hold the camera is: on stop i, or between i and i + 1 (k 0..1). */
function stopAt(s: number, len: number, n: number) {
  if (n === 1) return { i: 0, k: 0 };
  const DW = STOP.dwell,
    MV = STOP.move,
    unit = len / (n * DW + (n - 1) * MV);
  const per = (DW + MV) * unit,
    i = Math.min(n - 1, Math.floor(s / per)),
    r = s - i * per;
  if (i === n - 1 || r <= DW * unit) return { i, k: 0 };
  return { i, k: ease(clamp01((r - DW * unit) / (MV * unit))) };
}

function mix(a: View, b: View, k: number): View {
  return {
    pos: a.pos.clone().lerp(b.pos, k),
    yaw: lerp(a.yaw, b.yaw, k),
    pitch: lerp(a.pitch, b.pitch, k),
    fov: lerp(a.fov, b.fov, k),
  };
}
/** The views a hold stops on: portrait each item's, landscape (its own, shorter timeline) the keyframe alone. */
const stopsOf = (key: "K6" | "K7" | "K8", t: number) => (t >= 0.5 ? HP[key] : [PC[key]]);
function holdView(key: "K6" | "K7" | "K8", s: number, len: number, t: number): View {
  const stops = stopsOf(key, t),
    { i, k } = stopAt(s, len, stops.length),
    hp = mix(stops[i], stops[Math.min(stops.length - 1, i + 1)], k);
  return mix(PC[key], hp, t);
}
const first = (key: "K6" | "K7" | "K8", t: number) => mix(PC[key], stopsOf(key, t)[0], t);
const last = (key: "K6" | "K7" | "K8", t: number) => mix(PC[key], stopsOf(key, t).at(-1)!, t);

/** A path through points by distance (centripetal), eased, with the view's angles and lens eased between ends. */
function along(points: THREE.Vector3[], a: View, b: View, u: number): View {
  const e = ease(u),
    curve = new THREE.CatmullRomCurve3(points, false, "centripetal");
  return {
    pos: curve.getPointAt(e),
    yaw: lerp(a.yaw, b.yaw, e),
    pitch: lerp(a.pitch, b.pitch, e),
    fov: lerp(a.fov, b.fov, e),
  };
}

/**
 * Camera in the lobby for screens x (≥ LOBBY_START), format blend t, screen aspect; `k56` is the camera at K5a.6
 * (the end of the truck), where the dolly in starts.
 */
export function lobbyCamera(x: number, t: number, aspect: number, k56: CamPose): CamPose {
  let acc = LOBBY_START,
    i = idx("K5a.6", "move");
  while (i < SEG.length - 1 && x > acc + SEG[i].screens) acc += SEG[i++].screens;
  const seg = SEG[i],
    s = Math.min(seg.screens, x - acc),
    u = clamp01(s / seg.screens);
  let view: View;
  if (seg.type === "hold") {
    if (seg.from === "K9.1") view = mix(PC.K91, HP91, t);
    else view = holdView(seg.from as "K6" | "K7" | "K8", s, seg.screens, t);
  } else if (seg.from === "K5a.6") {
    // (its lens is fitted to the screen already: it starts from the truck's)
    const d = dollyIn(t, aspect, k56)(u);
    return { pos: d.pos, quat: rig(d.yaw, d.pitch), fov: d.fov };
  } else if (seg.from === "K6") {
    const a = last("K6", t),
      b = first("K7", t);
    view = mix(a, b, ease(u));
  } else if (seg.from === "K7") {
    const a = last("K7", t),
      b = first("K8", t);
    // on left, then round to the glass (the plant passes by the lens)
    view = along([a.pos, new THREE.Vector3(lx(5.4), lerp(a.pos.y, b.pos.y, 0.4), BACK + 2.4), b.pos], a, b, u);
  } else {
    const a = last("K8", t),
      b = mix(PC.K91, HP91, t);
    // still at first (video: 0.8 s), then the turn to the facade backing off a little, and on toward the door at the
    // end (video)
    view = along(
      [a.pos, new THREE.Vector3(lx(7.4), 1.3, BACK + 1.8), new THREE.Vector3(lx(6.7), b.pos.y, BACK + 0.35), b.pos],
      a,
      b,
      clamp01((u - TURN_STILL) / (1 - TURN_STILL)),
    );
  }
  return { pos: view.pos, quat: rig(view.yaw, view.pitch), fov: fitFov(view.fov, t, aspect) };
}
/** Share of the K8 → K9.1 move the camera stays on K8 before it turns (video: 0.8 of 3 s). */
const TURN_STILL = 0.2;

// ---------- K5a.6 → K6: through Kreatekno's door ----------
/** x of the camera through the door: the open right half's left part (the leaf, open, stands at its right edge). */
const DOOR_X = KREATEKNO.door.cx + 0.22;
/**
 * Where along the dolly (share of the move) the camera leaves K5a.6, stands in front of the door, is through it, and
 * arrives at K6 (video: 1.2 s still, then fast through the door, slowing to the board).
 */
const DOLLY = { leave: 0.15, front: 0.45, through: 0.58 };
const dollies = new Map<string, (u: number) => View>();
/** The dolly from K5a.6 (`k56`, where the truck stopped) through the door to the corkboard, timed by its points. */
function dollyIn(t: number, aspect: number, k56: CamPose) {
  const id = `${t.toFixed(3)} ${aspect.toFixed(4)} ${k56.pos.x.toFixed(4)} ${k56.fov.toFixed(3)}`;
  let fn = dollies.get(id);
  if (fn) return fn;
  const e = new THREE.Euler().setFromQuaternion(k56.quat, "YXZ");
  const a: View = { pos: k56.pos.clone(), yaw: e.y, pitch: e.x, fov: k56.fov },
    b = first("K6", t);
  // straight at the door, through its open half under the transom, on in a line beside Bu Dewi's way
  // (she goes round to the right) and to the board
  const curve = new THREE.CatmullRomCurve3(
    [
      a.pos,
      // (over Heru's head as it passes him: he stands a step in, holding the leaf, his head at 1.5 m)
      new THREE.Vector3(DOOR_X, 1.95, 2.4),
      new THREE.Vector3(DOOR_X, 1.9, -1.6),
      new THREE.Vector3(lerp(DOOR_X, b.pos.x, 0.25), lerp(1.9, b.pos.y, 0.5), -5.0),
      b.pos,
    ],
    false,
    "centripetal",
  );
  const n = curve.points.length - 1,
    L = curve.getLengths(n * 60),
    shares = curve.points.map((_, i) => L[i * 60] / L[n * 60]);
  const at = monotone([DOLLY.leave, DOLLY.front, DOLLY.through, 0.72, 1], shares);
  fn = (u: number) => {
    const k = clamp01((u - DOLLY.leave) / (1 - DOLLY.leave)),
      e2 = ease(k);
    return {
      pos: curve.getPointAt(clamp01(u <= DOLLY.leave ? 0 : at(u))),
      yaw: lerp(a.yaw, b.yaw, e2),
      pitch: lerp(a.pitch, b.pitch, e2),
      fov: lerp(a.fov, fitFov(b.fov, t, aspect), smoothstep(DOLLY.front, 1, u)),
    };
  };
  if (dollies.size > 20) dollies.clear();
  dollies.set(id, fn);
  return fn;
}

const DOLLY_SEG = SEG[idx("K5a.6", "move")].screens;
/**
 * Gates on the camera's way in (screens; issue #10's rule): it may not leave K5a.6 until Bu Dewi is nearly in,
 * nor reach the door until she is in and clear of its way (outsideCast LT.inside). `need` is her clock there.
 */
export const DOOR_GATES = [
  { x: LOBBY_START + DOLLY.leave * DOLLY_SEG, lead: 1.2 },
  { x: LOBBY_START + (DOLLY.front - 0.04) * DOLLY_SEG, lead: 0 },
];
/**
 * Scroll (screens) over which the leaf must stand fully open: from a little before the camera nears the door to
 * when it is past the open leaf's end (1.1 m in).
 */
export const DOOR_OPEN = {
  from: LOBBY_START + (DOLLY.front - 0.12) * DOLLY_SEG,
  to: LOBBY_START + (DOLLY.through + 0.04) * DOLLY_SEG,
};
