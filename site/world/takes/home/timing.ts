// Timing of the Home take in screens of scroll, beats 1–2: hold on K0 (hero on the billboard), crane down to the
// door (K1, Heru facing the camera), short hold, follow Heru as he turns round and walks through the door into
// COMPANY (K2; 1.2 screens, so he goes up to twice his natural pace on an unhurried scroll), short hold, dolly in and pan left to
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
import { holdP, scrollTotal, segmentsTotal, type Segment } from "../../core/segments";

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
  | "K5a.6"
  | "K6"
  | "K7"
  | "K8"
  | "K9.1";

export const SEG: Segment<KeyName>[] = [
  // issue #5: K0 → K1 in 1.0 screen (was 0.9 + 1.0): a short hold, then the scroll moves the camera at once
  { type: "hold", from: "K0", screens: 0.3 },
  { type: "move", from: "K0", to: "K1", screens: 0.7 },
  { type: "hold", from: "K1", screens: 0.3 },
  // issue #6: 1.2 screens (was 2.0), so the turn and the push on the door take ±0.5 screen of scroll
  { type: "move", from: "K1", to: "K2", screens: 1.2 },
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
  // Beats 6–9a (tahap 7, the team's videos K5a.6 → K9.1): through Kreatekno's door to the corkboard (K6), truck
  // left to the rack (K7), on left and round to the meeting room's glass (K8), turn to the facade (K9.1). Separate
  // timelines (user, 11 Nov): `screens` is 9:16's, which stops on each item of a hold (3 polaroids, the sign and 3
  // books + the button, 2 × 4 sticky notes); `pc` is the scroll 16:9 takes, standing still on each keyframe with all
  // its items in frame (PLAN tahap 7, total ±5.1 screens). The dolly in is 2.0 screens (langkah 6, was 0.9): the
  // camera waits for Bu Dewi to be in and clear of its way, and at her pace (at most 1.8×) that takes ±2 s, so on a
  // steady scroll of 2 s per screen the camera no longer stands at the door while the scroll runs on.
  { type: "move", from: "K5a.6", to: "K6", screens: 2.0 },
  // issue #17: 3 polaroids (was 7), 4 stops in 1.1 screens (was 8 in 2.3): each stop takes the same scroll as before
  { type: "hold", from: "K6", screens: 1.1, pc: 0.6 },
  { type: "move", from: "K6", to: "K7", screens: 0.5 },
  { type: "hold", from: "K7", screens: 1.4, pc: 0.5 },
  { type: "move", from: "K7", to: "K8", screens: 0.6 },
  { type: "hold", from: "K8", screens: 0.75, pc: 0.8 },
  { type: "move", from: "K8", to: "K9.1", screens: 0.9 },
  { type: "hold", from: "K9.1", screens: 0.3 },
];
/** Length of the take on its own timeline (9:16): the unit of p in the world. */
export const TAKE_SCREENS = segmentsTotal(SEG);
/** Screens of scroll of the take per format (the page's height): landscape is shorter in the lobby. */
export const TAKE_SCROLL = { pc: scrollTotal(SEG, false), hp: scrollTotal(SEG, true) };
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
  "K6",
  "K7",
  "K8",
  "K9.1",
];
export const keyP = (k: KeyName) => holdP(SEG, k);

/**
 * On 9:16 a hold of the lobby stops on each of its n items in turn (tahap 7): a dwell on each, a short move between
 * (shares of one stop's unit). Plain numbers, shared by the camera (takes/home/lobby) and the page (stills fallback,
 * jump marks, copy sizes).
 */
export const STOP = { dwell: 0.17, move: 0.13 };
/** Where the camera rests on stop i of a hold of `len` screens with n stops: from, to (screens into the hold). */
export function stopSpan(len: number, n: number, i: number) {
  if (n === 1) return { from: 0, to: len };
  const unit = len / (n * STOP.dwell + (n - 1) * STOP.move),
    from = i * (STOP.dwell + STOP.move) * unit;
  return { from, to: from + STOP.dwell * unit };
}
/** Number of 9:16 stops of each lobby hold (the strip and 3 polaroids; the sign, 3 books and the button; 2 × 4 notes). */
export const LOBBY_STOPS = { K6: 4, K7: 5, K8: 2 } as const;
/** Where the whip pan to K2.2 fires, as a fraction of the K2.1 → K2.2 move (time-based from there, ±0.45 s). */
export const WHIP_AT = 0.3;
