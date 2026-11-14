// The classroom's stills (tahap 9, beats 12–13) for the page: when each comes in on the stills fallback and where
// the jump mark lands. Plain numbers from the take's timeline (no three.js), like plaqueStills.ts: screens on the
// take's own (9:16) timeline.
import { segmentStart } from "@/world/core/segments";
import { SEG, type KeyName } from "@/world/takes/home/timing";

const idx = (from: KeyName, type: "move" | "hold") => SEG.findIndex((s) => s.from === from && s.type === type);
const start = (from: KeyName, type: "move" | "hold") => segmentStart(SEG, idx(from, type));
const len = (from: KeyName, type: "move" | "hold") => SEG[idx(from, type)].screens;

/** The classroom's stills: K12 (the class at the TV, its copy; 9:16 the TV), K13 (the front room at dusk). */
export const CLASS_KEYS = ["K12", "K13"] as const;

/**
 * Stills fallback: screens over which each crossfades in. K12 as the camera comes through the back door, K13 as it
 * comes back over the counter into the room.
 */
export function classStillFades(): Record<string, [number, number]> {
  const i0 = start("K11", "move"),
    il = len("K11", "move"),
    o0 = start("K12", "move"),
    ol = len("K12", "move");
  return {
    K12: [i0 + 0.93 * il, start("K12", "hold")],
    K13: [o0 + 0.5 * ol, start("K13", "hold")],
  };
}

/** The stills with the TV's copy and the one after, in order per format (the copy goes as the next comes). */
export const CLASS_STILLS = { pc: ["K12", "K13"], hp: ["K12", "K13"] };

/** Jump mark #praktik: the middle of the K12 hold. */
export function classMark() {
  const h0 = start("K12", "hold");
  return { key: "K12" as const, pc: h0 + len("K12", "hold") / 2, hp: h0 + len("K12", "hold") / 2 };
}
