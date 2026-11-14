// The night's stills (tahap 10, beats 14–16) for the page: when each comes in on the stills fallback and where the
// jump mark lands. Plain numbers from the take's timeline (no three.js), like classStills.ts: screens on the take's
// own (9:16) timeline.
import { segmentStart } from "@/world/core/segments";
import { SEG, type KeyName } from "@/world/takes/home/timing";

const idx = (from: KeyName, type: "move" | "hold") => SEG.findIndex((s) => s.from === from && s.type === type);
const start = (from: KeyName, type: "move" | "hold") => segmentStart(SEG, idx(from, type));
const len = (from: KeyName, type: "move" | "hold") => SEG[idx(from, type)].screens;

/** The night street at K16, including the lit billboard and the epilogue. */
export const NIGHT_KEYS = ["K16"] as const;

/** Stills fallback: crossfade to K16 during the continuous crane up and pull back. */
export function nightStillFades(): Record<string, [number, number]> {
  const wide = start("K15", "move");
  return {
    K16: [wide + 0.6 * len("K15", "move"), start("K16", "hold")],
  };
}

export const NIGHT_STILLS = { pc: ["K16"], hp: ["K16"] };
/** Screens where the epilogue is shown on the stills fallback: from the K16 still in. */
export const epilogueStill = () => nightStillFades().K16;
