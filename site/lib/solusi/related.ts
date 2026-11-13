import type { Solusi } from "../../content/solusi/schema";

export function related(solution: Solusi, items: readonly Solusi[]) {
  return items
    .filter((s) => s.slug !== solution.slug)
    .map((s) => ({
      solution: s,
      score:
        2 * s.tim.filter((t) => solution.tim.includes(t)).length +
        s.industri.filter((i) => solution.industri.includes(i)).length,
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 2)
    .map((r) => r.solution);
}
