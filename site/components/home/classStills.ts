// The classroom's stills (tahap 9, beats 12–13) for the page: when each comes in on the stills fallback and where
// the jump mark lands. Plain numbers from the take's timeline (no three.js), like plaqueStills.ts: screens on the
// take's own (9:16) timeline.
import { segmentStart } from "@/world/core/segments";
import { K111_DESKS, SEG, type KeyName } from "@/world/takes/home/timing";

const idx = (from: KeyName, type: "move" | "hold") => SEG.findIndex((s) => s.from === from && s.type === type);
const start = (from: KeyName, type: "move" | "hold") => segmentStart(SEG, idx(from, type));
const len = (from: KeyName, type: "move" | "hold") => SEG[idx(from, type)].screens;

/**
 * The classroom's stills: K11.1 (K2's view of the four desks, Bu Dewi just in; issue #23), K12 (the class at the TV,
 * its copy; 9:16 the TV), K13 (K2's view again at dusk).
 */
export const CLASS_KEYS = ["K11.1", "K12", "K13"] as const;

/**
 * Stills fallback: screens over which each crossfades in. K11.1 as the camera comes in through COMPANY's door, K12 as
 * it comes through the back door, K13 as it comes back over the counter into the room (in by the K13 hold).
 */
export function classStillFades(): Record<string, [number, number]> {
  // (the way in, K11 → K11.1 → K12, measured as the single move it replaced; 9:16's reading of the desks after the
  // K11.1 stop is not counted in it, beat12 intoX)
  const i0 = start("K11", "move"),
    il = start("K12", "hold") - i0 - K111_DESKS.len,
    o0 = start("K12", "move"),
    ol = len("K12", "move");
  return {
    "K11.1": [i0 + 0.6 * len("K11", "move"), start("K11.1", "hold")],
    K12: [i0 + 0.93 * il + K111_DESKS.len, start("K12", "hold")],
    K13: [o0 + 0.5 * ol, o0 + ol],
  };
}

/** The stills with the TV's copy and the ones around it, in order per format (the copy goes as the next comes). */
export const CLASS_STILLS = { pc: ["K11.1", "K12", "K13"], hp: ["K11.1", "K12", "K13"] };

/** Jump mark #praktik: the middle of the K12 hold. */
export function classMark() {
  const h0 = start("K12", "hold");
  return { key: "K12" as const, pc: h0 + len("K12", "hold") / 2, hp: h0 + len("K12", "hold") / 2 };
}
