// Timing of the Home take in screens of scroll, beats 1–2: hold on K0 (hero on the billboard), crane down to the
// door (K1, Heru facing the camera), short hold, follow Heru as he turns round and walks through the door into
// COMPANY (K2; two screens, so a natural walking pace fits an unhurried scroll), short hold, dolly in and pan left to
// Sinta and Bayu (K2.1, no hold: the camera keeps drifting), whip pan right to Nadia and Fajar (K2.2), hold.
// Beats 3–4 (blockout K2.2 → K3): dolly down the right aisle and orbit behind Bu Dewi to her right shoulder,
// slowing at K2.4 while Heru lays the leaflet on the counter (no hold), tilt down and push in to the top view of
// the leaflet (K3), short hold, truck right to the binder (K4), short hold. The holds only give the copy room to be
// read; the camera never waits on the copy (issue #4: no dwell).
// Beats 5a–5b (the team's videos K4 → K5a.6): rise and turn to look over Heru's shoulder at Bu Dewi nodding (K4.1,
// short hold), dolly straight back through the door out to the facade (K4.2, passed slowly, no hold), dolly out as
// Heru and Bu Dewi come out (K5a.1, short hold), then truck right along the row: K5a.2–K5a.4 frame two panels each
// and the camera stands still there, and K5a.6 settles at Kreatekno's door. The videos' K5a.5 (the stall and the
// electronics shop) is gone with the blank shops (user, 7 Nov): K5a.4 frames the cosmetics and electronics shops.
// Plain numbers only: the page imports this for the stage height and the stills fallback.
import { holdP, segmentsTotal, type Segment } from "../../core/segments";

export type KeyName =
  | "K0"
  | "K1"
  | "K2"
  | "K2.1"
  | "K2.2"
  | "K2.4"
  | "K3"
  | "K4"
  | "K4.1"
  | "K4.2"
  | "K5a.1"
  | "K5a.2"
  | "K5a.3"
  | "K5a.4"
  | "K5a.6";

export const SEG: Segment<KeyName>[] = [
  { type: "hold", from: "K0", screens: 0.9 },
  { type: "move", from: "K0", to: "K1", screens: 1.0 },
  { type: "hold", from: "K1", screens: 0.3 },
  { type: "move", from: "K1", to: "K2", screens: 2.0 },
  { type: "hold", from: "K2", screens: 0.3 },
  { type: "move", from: "K2", to: "K2.1", screens: 0.8 },
  { type: "move", from: "K2.1", to: "K2.2", screens: 0.7 },
  { type: "hold", from: "K2.2", screens: 0.6 },
  { type: "move", from: "K2.2", to: "K2.4", screens: 1.15 },
  { type: "move", from: "K2.4", to: "K3", screens: 0.85 },
  { type: "hold", from: "K3", screens: 0.4 },
  { type: "move", from: "K3", to: "K4", screens: 0.6 },
  { type: "hold", from: "K4", screens: 0.5 },
  { type: "move", from: "K4", to: "K4.1", screens: 1.0 },
  { type: "hold", from: "K4.1", screens: 0.3 },
  { type: "move", from: "K4.1", to: "K4.2", screens: 0.6 },
  { type: "move", from: "K4.2", to: "K5a.1", screens: 0.7 },
  { type: "hold", from: "K5a.1", screens: 0.2 },
  { type: "move", from: "K5a.1", to: "K5a.2", screens: 0.5 },
  { type: "hold", from: "K5a.2", screens: 0.6 },
  { type: "move", from: "K5a.2", to: "K5a.3", screens: 0.5 },
  { type: "hold", from: "K5a.3", screens: 0.6 },
  { type: "move", from: "K5a.3", to: "K5a.4", screens: 0.5 },
  { type: "hold", from: "K5a.4", screens: 0.6 },
  { type: "move", from: "K5a.4", to: "K5a.6", screens: 0.5 },
  { type: "hold", from: "K5a.6", screens: 0.3 },
];
export const TAKE_SCREENS = segmentsTotal(SEG);
export const KEYS: KeyName[] = [
  "K0",
  "K1",
  "K2",
  "K2.1",
  "K2.2",
  "K2.4",
  "K3",
  "K4",
  "K4.1",
  "K4.2",
  "K5a.1",
  "K5a.2",
  "K5a.3",
  "K5a.4",
  "K5a.6",
];
export const keyP = (k: KeyName) => holdP(SEG, k);
/** Where the whip pan to K2.2 fires, as a fraction of the K2.1 → K2.2 move (time-based from there, ±0.45 s). */
export const WHIP_AT = 0.3;
