import type { Industri, Kartu, Solusi, SolusiSlug } from "../../content/solusi/schema";
import { liveFirst } from "./tiers";

export const ROUNDS = 3;
export const CARDS_PER_ROUND = 3;
export type Answers = { industri: Industri | ""; yes: readonly Kartu[]; no: readonly Kartu[] };
export type CardState = Answers & { seen: ReadonlySet<string> };
const slugs = (card: Kartu) => Object.keys(card.solusi) as SolusiSlug[];

export function cardScore(card: Kartu, state: Answers, random: () => number = Math.random) {
  let score = !state.industri || !card.industri.length ? 1 : card.industri.includes(state.industri) ? 3 : -2;
  const keys = slugs(card);
  for (const yes of state.yes)
    score += card.tim.filter((t) => yes.tim.includes(t)).length + keys.filter((k) => k in yes.solusi).length * 1.5;
  for (const no of state.no) score -= keys.filter((k) => k in no.solusi).length * 1.5;
  const touched = new Set([...state.yes, ...state.no].flatMap(slugs));
  if (!keys.some((k) => touched.has(k))) score += 0.8;
  return score + random() * 0.3;
}

/** Pure selection: caller records the returned IDs as seen when the round starts. */
export function pickRound(bank: readonly Kartu[], state: CardState, random: () => number = Math.random) {
  const pool = bank
    .filter((c) => !state.seen.has(c.id))
    .map((card) => ({ card, score: cardScore(card, state, random) }))
    .sort((a, b) => b.score - a.score);
  const picked: Kartu[] = [];
  const used = new Set<string>();
  for (const { card } of pool) {
    const main = slugs(card).sort((a, b) => card.solusi[b]! - card.solusi[a]!)[0];
    if (used.has(main)) continue;
    picked.push(card);
    used.add(main);
    if (picked.length === CARDS_PER_ROUND) break;
  }
  for (const { card } of pool) {
    if (picked.length === CARDS_PER_ROUND) break;
    if (!picked.includes(card)) picked.push(card);
  }
  return picked;
}

/** Ranking only. Scores are internal weights, never percentages or probabilities. */
export function results(items: readonly Solusi[], state: Answers) {
  const scores = new Map<SolusiSlug, number>();
  for (const c of state.yes) for (const slug of slugs(c)) scores.set(slug, (scores.get(slug) || 0) + c.solusi[slug]!);
  for (const c of state.no)
    for (const slug of slugs(c)) if (scores.has(slug)) scores.set(slug, scores.get(slug)! - c.solusi[slug]! * 0.5);
  return items
    .map((solution) => ({ solution, score: scores.get(solution.slug) || 0 }))
    .filter((r) => r.score > 0)
    .sort((a, b) => b.score - a.score || liveFirst(a.solution, b.solution))
    .slice(0, 4)
    .map((r, index) => ({ ...r, rank: index + 1 }));
}
