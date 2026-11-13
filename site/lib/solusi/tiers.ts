import type { Industri, Solusi } from "../../content/solusi/schema";
import { INDUSTRI, TIM } from "../../content/solusi/taksonomi";

export function liveFirst(a: Solusi, b: Solusi) {
  return Number(b.status === "jalan") - Number(a.status === "jalan");
}
/** One tier per first team, fullest first. Since 13 Nov the shelves hold only real solutions (no decor). */
export function buildTiers(items: readonly Solusi[]) {
  return TIM.map((team) => ({ team, solutions: items.filter((s) => s.tim[0] === team.id).sort(liveFirst) }))
    .filter((t) => t.solutions.length > 0)
    .sort((a, b) => b.solutions.length - a.solutions.length);
}
/** "Cocok untuk" chips on a shelf box: one "all industries" chip when a solution covers every industry. */
export function fitIndustries(solution: Pick<Solusi, "industri">): "all" | readonly Industri[] {
  return solution.industri.length >= INDUSTRI.length ? "all" : solution.industri;
}
