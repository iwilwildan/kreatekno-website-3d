// Kreatekno's lobby (beats 6–9a, tahap 7): plain numbers only (no three.js), shared by the world (set, cameras,
// copy anchors) and later the page. Metres in the world frame of sets/street.ts (x along the street, y up, z toward
// the street, the facades at z 0); x is given from Kreatekno's left edge (KREATEKNO.x0).
// Laid out from the team's videos k6 - k5a.6, K6 -K7, K7 - K8, K8 - K9.1 (last frames measured, tahap 7 langkah 1)
// and Master 10a/10b where the videos never look: the corkboard on the back wall facing the door, the two-tier rack
// and a potted plant left of it, the meeting room along the left wall (seen from the door) behind a glass wall with
// its door near the front, the glass facade from inside with two low steps down into the lobby, the reception desk
// in the back right corner (Master 10a; never in the videos' frames). The lobby floor is two steps below the
// pavement, the ceiling at the first-floor band (3.0 m).
import { KREATEKNO } from "./rowLayout";

const KX = KREATEKNO.x0;
type Rect = { x: number; y: number; w: number; h: number };

export const LOBBY = {
  kx: KX,
  /** Lobby floor (two steps of 0.15 m down from the pavement), ceiling. */
  floor: -0.3,
  ceil: 3.0,
  /** Inside face of the facade, back wall, right wall (+x) from Kreatekno's left edge. */
  front: -0.3,
  back: -14.4,
  right: 12.1,
  /** Steps along the facade: top at the pavement's level, each 0.4 m deep. */
  steps: { depth: 0.4, rise: 0.15 },
  /** Left wall of the front part (solid, behind Kreatekno's plaque) and where it meets the meeting room. */
  leftFront: 3.1,
  roomFrom: -5.5,
  /** The meeting room: its glass wall (x), the door in it near the front (z range), the glass's top. */
  room: {
    glassX: 3.6,
    farX: 0.3,
    door: [-5.7, -6.7] as const,
    /** Mullions of the glass section framed at K8 (video: 4.9 m between frames, sticky notes 4 × 2 on it). */
    glass: [-7.6, -12.5] as const,
    glassTop: 2.4,
    /** Long table along the glass (x centre, z range, top), whiteboard and window on the far wall. */
    table: { x: 2.2, z: [-7.4, -12.7] as const, top: 0.45, w: 0.9 },
    whiteboard: { z: [-8.2, -12.0] as const, y: [0.85, 2.0] as const },
    window: { z: [-6.2, -7.6] as const, y: [0.55, 2.1] as const },
    /**
     * Seated Wildan and Andi behind the table, facing the glass (video K8: their heads show in the gaps between the
     * first and second and the third and fourth note columns), per format (langkah 3). They sit 2.1 m behind the
     * glass: from the 16:9 K8 camera (4.34 m off the glass, at the section's centre) a gap at glass offset g lines
     * up with z offset g · 6.46 / 4.34; the 9:16 stops look straight at each gap, so there they sit right behind it.
     */
    seats: [
      { who: "wildan", z: { pc: -8.48, hp: -8.995 } },
      { who: "andi", z: { pc: -11.65, hp: -11.125 } },
    ] as const,
  },
  /** Corkboard on the back wall (video K6): 2.6 × 1.75 m, its centre. */
  board: { cx: 7.7, cy: 1.25, w: 2.6, h: 1.75, frame: 0.07 },
  /** Two-tier rack and its wooden sign (video K7), the plant in the corner by the meeting room glass. */
  rack: { cx: 5.15, w: 1.7, h: 0.8, d: 0.38, tiers: [0.07, 0.45] as const },
  // (raised 0.1 m in langkah 2: from the low K7 camera the rack's top hid its lower half; video: clear above it)
  sign: { cx: 5.15, cy: 0.72, w: 0.95, h: 0.18 },
  plant: { x: 3.95, z: -14.05, h: 1.5 },
  /** Reception desk (Master 10a), back right corner, out of every keyframe's view. */
  desk: { x: [10.3, 12.1] as const, z: [-12.6, -14.2] as const, h: 1.05 },
} as const;

/** World x from Kreatekno's left edge. */
export const lx = (x: number) => KX + x;

/**
 * Height of the floor under a point (people walking in, tahap 7 langkah 4): the pavement and the top step at 0
 * (the inside face of the facade to 0.4 m in), the second step at −0.15, then the lobby floor (the meeting room's
 * too). Beside Kreatekno's front (x) everything is the pavement.
 */
export function lobbyFloor(x: number, z: number) {
  const left = lx(z < LOBBY.roomFrom ? LOBBY.room.farX : LOBBY.leftFront);
  if (z > LOBBY.front - LOBBY.steps.depth || x < left || x > lx(LOBBY.right)) return 0;
  return z > LOBBY.front - 2 * LOBBY.steps.depth ? -LOBBY.steps.rise : LOBBY.floor;
}

// ---------- copy surfaces, each a rectangle on its prop (centre and size in metres) ----------

/** Corkboard, from its centre (x right as seen from the lobby, y up): the strip, 7 polaroids (4 + 3), 4 corner notes. */
export const BOARD_ITEMS = {
  strip: { x: 0, y: 0.62, w: 1.22, h: 0.15 } as Rect,
  polaroids: [
    { x: -0.8, y: 0.17 },
    { x: -0.27, y: 0.17 },
    { x: 0.27, y: 0.17 },
    { x: 0.8, y: 0.17 },
    { x: -0.53, y: -0.44 },
    { x: 0, y: -0.44 },
    { x: 0.53, y: -0.44 },
  ].map((p) => ({ ...p, w: 0.41, h: 0.54 })) as Rect[],
  notes: [
    [-1.1, 0.67],
    [1.1, 0.67],
    [-1.1, -0.68],
    [1.1, -0.68],
  ].map(([x, y]) => ({ x, y, w: 0.17, h: 0.2 })) as Rect[],
};

/** Rack, from its centre at floor level (x right as seen from the lobby): 3 open books per tier (top: the articles). */
export const RACK_ITEMS = {
  books: [0.45, 0.07].flatMap((y0) => [-0.48, 0, 0.48].map((x) => ({ x, y: y0 + 0.135, w: 0.43, h: 0.26 }))) as Rect[],
  /** "Lihat semua artikel": a card standing in the bottom tier's left place (the truck goes on left). */
  button: { x: -0.48, y: 0.2, w: 0.43, h: 0.12 } as Rect,
};

/**
 * Glass of the meeting room, from the centre of its framed section at floor level, seen from the lobby (x right =
 * toward the back wall): 8 sticky notes 4 × 2 (video K8), the title band over them.
 */
export const GLASS_ITEMS = {
  notes: [1.555, 0.585].flatMap((y) => [-1.58, -0.53, 0.54, 1.61].map((x) => ({ x, y, w: 0.835, h: 0.835 }))) as Rect[],
  /** The band above the notes (2.0–2.7 m): the title on the left, the help line and the button on the right. */
  title: { x: -1.06, y: 2.33, w: 1.9, h: 0.4 } as Rect,
  help: { x: 1.07, y: 2.33, w: 1.9, h: 0.4 } as Rect,
};
