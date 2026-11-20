import type { SolusiLocale, SolusiSlug } from "../schema";
import { bookingJasaStory } from "./booking-jasa";
import { orderGrupStory } from "./order-grup";
import { BookingCeritaSchema, CeritaSchema, type BookingCeritaLocale, type CeritaLocale } from "./schema";

const stories = {
  "order-grup": CeritaSchema.parse(orderGrupStory),
  "booking-jasa": BookingCeritaSchema.parse(bookingJasaStory),
} satisfies Partial<Record<SolusiSlug, unknown>>;

/** One story in one locale, tagged with its slug so the page picks the matching stage and film. */
export type StoryEntry =
  { slug: "order-grup"; copy: CeritaLocale } | { slug: "booking-jasa"; copy: BookingCeritaLocale };

export function storyFor(slug: SolusiSlug, locale: SolusiLocale): StoryEntry | undefined {
  if (slug === "order-grup") return { slug, copy: stories[slug][locale] };
  if (slug === "booking-jasa") return { slug, copy: stories[slug][locale] };
  return undefined;
}

export { stories as CERITA };
