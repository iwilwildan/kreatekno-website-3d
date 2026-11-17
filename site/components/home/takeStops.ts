// The stops of the Next/Previous buttons (user 17 Nov): where the take is read, on the take's own (9:16) timeline in
// screens, per format (30 on 9:16, 19 on 16:9). Each is a keyframe's copy or an important scene; the rest is scrolled past (K2's four desks,
// Bu Dewi's nod K4.1, out of COMPANY's door K5a.1, the turn to the facade K9.1, the sky K10). Plain numbers from the
// take's timeline (no three.js), like the jump marks: the page turns them into scroll positions (HomeTake).
import { segmentStart } from "@/world/core/segments";
import { K111_DESKS, LOBBY_STOPS, SEG, stopSpan, type KeyName } from "@/world/takes/home/timing";

const idx = (from: KeyName, type: "move" | "hold") => SEG.findIndex((s) => s.from === from && s.type === type);
const start = (from: KeyName, type: "move" | "hold") => segmentStart(SEG, idx(from, type));
const len = (from: KeyName, type: "move" | "hold") => SEG[idx(from, type)].screens;
/** The middle of keyframe k's (first) hold. */
const holdMid = (k: KeyName) => start(k, "hold") + len(k, "hold") / 2;

/**
 * 9:16 frames one panel of the row at a time, as the camera follows Heru and Bu Dewi along it: they walk at a steady
 * pace with the scroll, so the panels come to the middle of the screen at even steps (measured 14 Nov on 375 × 812,
 * tools/render/lib.mjs HP_AT: the first just into the K5a.2 hold, then every 0.4775 screen).
 */
const ROW_HP = { first: 0.08, step: 0.4775, panels: 5 };
/**
 * K11: Heru and Wildan pull COMPANY's leaves open for Bu Dewi only as the scroll goes on past the hold (their clock
 * reaches the leaves fully open, BT2.open, 0.24 screen after it; measured 17 Nov). The camera's gate holds it on K11
 * until then (world/index.ts), so a stop just past it shows the leaves opening, then the room inside through them.
 */
const K11_PAST = 0.25;

export type TakeStop = { key: string; at: number };

export function takeStops(hp: boolean): TakeStop[] {
  const out: TakeStop[] = [
    { key: "K0", at: 0 },
    { key: "K1", at: holdMid("K1") },
    // no hold on K2.1: the camera drifts on to the whip pan; Sinta's and Bayu's plaques are read where the move
    // into it ends (world/takes/home/desks.ts deskReadAt)
    { key: "K2.1", at: start("K2.1", "move") },
    { key: "K2.2", at: holdMid("K2.2") },
    { key: "K3", at: holdMid("K3") },
    { key: "K4", at: holdMid("K4") },
  ];
  if (hp) {
    const s0 = start("K5a.2", "hold") + ROW_HP.first;
    for (let i = 0; i < ROW_HP.panels; i++) out.push({ key: `row-${i}`, at: s0 + i * ROW_HP.step });
  } else for (const k of ["K5a.2", "K5a.3", "K5a.4"] as const) out.push({ key: k, at: holdMid(k) });
  out.push({ key: "K5a.6", at: holdMid("K5a.6") });
  for (const h of ["K6", "K7", "K8"] as const) {
    if (!hp) {
      out.push({ key: h, at: holdMid(h) });
      continue;
    }
    const h0 = start(h, "hold"),
      hl = len(h, "hold");
    for (let i = 0; i < LOBBY_STOPS[h]; i++) {
      const s = stopSpan(hl, LOBBY_STOPS[h], i);
      out.push({ key: `${h}-${i}`, at: h0 + (s.from + s.to) / 2 });
    }
  }
  out.push(
    { key: "K9b", at: holdMid("K9b") },
    { key: "K11", at: start("K11", "hold") + len("K11", "hold") + K11_PAST },
    { key: "K11.1", at: holdMid("K11.1") },
  );
  // 9:16 reads the desks again after K11.1 (K111_DESKS), where the "after" plaques are read as beat 2 reads the
  // "before" ones (world/takes/home/desks.ts): Sinta's and Bayu's at the end of the dolly, Nadia's and Fajar's
  // halfway through the hold after the whip pan. 16:9 stays on K11.1's wide view.
  if (hp)
    out.push(
      { key: "K11.1-left", at: K111_DESKS.s + K111_DESKS.dolly },
      { key: "K11.1-right", at: K111_DESKS.s + K111_DESKS.dolly + K111_DESKS.whip + K111_DESKS.hold / 2 },
    );
  out.push({ key: "K12", at: holdMid("K12") }, { key: "K13", at: holdMid("K13") }, { key: "K16", at: holdMid("K16") });
  return out;
}
