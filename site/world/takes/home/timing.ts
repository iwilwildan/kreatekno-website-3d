// Timing of the Home take in screens of scroll, beats 1–2: hold on K0 (hero on the billboard), crane down to the
// door (K1, Heru facing the camera), short hold, follow Heru as he turns round and walks through the door into
// COMPANY (K2; two screens, so a natural walking pace fits an unhurried scroll), short hold, dolly in and pan left to
// Sinta and Bayu (K2.1, no hold: the camera keeps drifting), whip pan right to Nadia and Fajar (K2.2), hold.
// Plain numbers only: the page imports this for the stage height and the stills fallback.
import { holdP, segmentsTotal, type Segment } from "../../core/segments";

export type KeyName = "K0" | "K1" | "K2" | "K2.1" | "K2.2";

export const SEG: Segment<KeyName>[] = [
  { type: "hold", from: "K0", screens: 0.9 },
  { type: "move", from: "K0", to: "K1", screens: 1.0 },
  { type: "hold", from: "K1", screens: 0.3 },
  { type: "move", from: "K1", to: "K2", screens: 2.0 },
  { type: "hold", from: "K2", screens: 0.3 },
  { type: "move", from: "K2", to: "K2.1", screens: 0.8 },
  { type: "move", from: "K2.1", to: "K2.2", screens: 0.7 },
  { type: "hold", from: "K2.2", screens: 0.6 },
];
export const TAKE_SCREENS = segmentsTotal(SEG);
export const KEYS: KeyName[] = ["K0", "K1", "K2", "K2.1", "K2.2"];
export const keyP = (k: KeyName) => holdP(SEG, k);
/** Where the whip pan to K2.2 fires, as a fraction of the K2.1 → K2.2 move (time-based from there, ±0.45 s). */
export const WHIP_AT = 0.3;
