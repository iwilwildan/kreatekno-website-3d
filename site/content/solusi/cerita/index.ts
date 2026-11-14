import type { SolusiLocale, SolusiSlug } from "../schema";
import { orderGrupStory } from "./order-grup";
import { CeritaSchema, type CeritaLocale } from "./schema";

const stories = { "order-grup": CeritaSchema.parse(orderGrupStory) } satisfies Partial<Record<SolusiSlug, unknown>>;

export function storyFor(slug: SolusiSlug, locale: SolusiLocale): CeritaLocale | undefined {
  const story = stories[slug as keyof typeof stories];
  return story?.[locale];
}

export { stories as CERITA };
