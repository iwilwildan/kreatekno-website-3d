// The lobby's stills (tahap 7) for the page: which exist, when each comes in on the stills fallback, where the jump
// marks land. Plain numbers from the take's timeline (no three.js): screens on the take's own (9:16) timeline, the
// unit the page maps the scroll to (HomeTake readS).
import { segmentStart } from "@/world/core/segments";
import { LOBBY_STOPS, SEG, stopSpan, type KeyName } from "@/world/takes/home/timing";

type Hold = keyof typeof LOBBY_STOPS;
const HOLDS: Hold[] = ["K6", "K7", "K8"];
const SUFFIX = "bcdefgh";
/** Stills of one hold: on 9:16 one per stop (K6, K6b … K6d); on 16:9 the first, the others repeat it. */
const stopsOf = (h: Hold) => Array.from({ length: LOBBY_STOPS[h] }, (_, i) => (i ? `${h}${SUFFIX[i - 1]}` : h));
export const LOBBY_KEYS = ["K6", "K6b", "K6c", "K6d", "K7", "K7b", "K7c", "K7d", "K7e", "K8", "K8b"] as const;

const idx = (from: KeyName, type: "move" | "hold") => SEG.findIndex((s) => s.from === from && s.type === type);
const start = (from: KeyName, type: "move" | "hold") => segmentStart(SEG, idx(from, type));
const len = (from: KeyName, type: "move" | "hold") => SEG[idx(from, type)].screens;

/**
 * Stills fallback: screens over which each still crossfades in. A hold's first still during the last stretch of the
 * move into it, each later stop's (9:16) during the short move onto that stop, K9.1 as the camera turns to the facade.
 */
export function lobbyStillFades(): Record<string, [number, number]> {
  const out: Record<string, [number, number]> = {};
  const into: Record<Hold, KeyName> = { K6: "K5a.6", K7: "K6", K8: "K7" };
  for (const h of HOLDS) {
    const m0 = start(into[h], "move"),
      ml = len(into[h], "move"),
      h0 = start(h, "hold"),
      hl = len(h, "hold"),
      keys = stopsOf(h);
    out[h] = [m0 + 0.6 * ml, h0];
    for (let i = 1; i < keys.length; i++)
      out[keys[i]] = [h0 + stopSpan(hl, keys.length, i - 1).to, h0 + stopSpan(hl, keys.length, i).from];
  }
  const t0 = start("K8", "move"),
    tl = len("K8", "move");
  out["K9.1"] = [t0 + 0.45 * tl, t0 + 0.85 * tl];
  return out;
}

/** The lobby's stills in order, per format (each still's copy goes as the next one comes in). */
export const LOBBY_STILLS = {
  pc: ["K6", "K7", "K8", "K9.1"],
  hp: [...LOBBY_KEYS, "K9.1"],
};

/**
 * Jump marks #testimoni, #artikel, #faq: screens on the take's timeline where each lands, per format. 16:9 the middle
 * of the hold (the keyframe, all its copy in), 9:16 the hold's first stop (the strip, the sign, the left notes with
 * the heading), a little in so the copy has come in.
 */
export function lobbyMarks() {
  return HOLDS.map((h) => {
    const h0 = start(h, "hold"),
      hl = len(h, "hold"),
      s = stopSpan(hl, LOBBY_STOPS[h], 0);
    return { key: h, pc: h0 + hl / 2, hp: h0 + (s.from + s.to) / 2 };
  });
}
