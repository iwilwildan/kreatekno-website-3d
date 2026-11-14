// The night's stills (tahap 10, beats 14–16) for the page: when each comes in on the stills fallback and where the
// jump mark lands. Plain numbers from the take's timeline (no three.js), like classStills.ts: screens on the take's
// own (9:16) timeline.
import { segmentStart } from "@/world/core/segments";
import { SEG, type KeyName } from "@/world/takes/home/timing";

const idx = (from: KeyName, type: "move" | "hold") => SEG.findIndex((s) => s.from === from && s.type === type);
const start = (from: KeyName, type: "move" | "hold") => segmentStart(SEG, idx(from, type));
const len = (from: KeyName, type: "move" | "hold") => SEG[idx(from, type)].screens;

/** The night's stills: K15.1 (the lit billboard, the CTA on it), K16 (the night street, the epilogue). */
export const NIGHT_KEYS = ["K15.1", "K16"] as const;

/** Stills fallback: screens over which each crossfades in, at the end of the crane up and of the pull back. */
export function nightStillFades(): Record<string, [number, number]> {
  const up = start("K15", "move"),
    back = start("K15.1", "move");
  return {
    "K15.1": [up + 0.8 * len("K15", "move"), start("K15.1", "hold")],
    K16: [back + 0.6 * len("K15.1", "move"), start("K16", "hold")],
  };
}

/** The stills with copy (the CTA on K15.1), then K16, per format: the CTA goes as K16 comes. */
export const NIGHT_STILLS = { pc: ["K15.1", "K16"], hp: ["K15.1", "K16"] };

/** Jump mark #kontak: the middle of the K15.1 hold (the CTA). */
export function nightMark() {
  const h0 = start("K15.1", "hold"),
    at = h0 + len("K15.1", "hold") / 2;
  return { key: "K15.1" as const, pc: at, hp: at };
}
/** Screens where the epilogue is shown on the stills fallback: from the K16 still in. */
export const epilogueStill = () => nightStillFades().K16;
