// The plaque's stills (tahap 8, beat 9b) and K11 for the page: when each comes in on the stills fallback and where
// the jump mark lands. Plain numbers from the take's timeline (no three.js), like lobbyStills.ts: screens on the
// take's own (9:16) timeline.
import { segmentStart } from "@/world/core/segments";
import { SEG, type KeyName } from "@/world/takes/home/timing";

const idx = (from: KeyName, type: "move" | "hold") => SEG.findIndex((s) => s.from === from && s.type === type);
const start = (from: KeyName, type: "move" | "hold") => segmentStart(SEG, idx(from, type));
const len = (from: KeyName, type: "move" | "hold") => SEG[idx(from, type)].screens;

/** K9b stills: the whole plaque on both formats (user 17 Nov; the phone had three stops). */
export const PLAQUE_KEYS = ["K9b", "K11"] as const;

/** Stills fallback: K9b as the dolly reaches the plaque, then K11 as the camera comes down to COMPANY's door. */
export function plaqueStillFades(): Record<string, [number, number]> {
  const o = start("K9.1", "move"),
    ol = len("K9.1", "move"),
    h0 = start("K9b", "hold"),
    d0 = start("K10", "move"),
    dl = len("K10", "move");
  return {
    K9b: [o + 0.9 * ol, h0],
    K11: [d0 + 0.75 * dl, start("K11", "hold")],
  };
}

/** The stills with the plaque's copy and the one after, in order per format (each copy goes as the next comes). */
export const PLAQUE_STILLS = { pc: ["K9b", "K11"], hp: ["K9b", "K11"] };

/** Jump mark #tentang: the middle of the hold (the whole plaque) on both formats. */
export function plaqueMark() {
  const h0 = start("K9b", "hold"),
    hl = len("K9b", "hold");
  return { key: "K9b" as const, pc: h0 + hl / 2, hp: h0 + hl / 2 };
}
