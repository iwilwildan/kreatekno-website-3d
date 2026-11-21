import type { SolusiLocale, SolusiSlug } from "../schema";
import { bookingJasaStory } from "./booking-jasa";
import { csKlinikStory } from "./cs-klinik";
import { orderGrupStory } from "./order-grup";
import { risetKontenStory } from "./riset-konten";
import {
  BookingCeritaSchema,
  CeritaSchema,
  KlinikCeritaSchema,
  RisetCeritaSchema,
  type BookingCeritaLocale,
  type CeritaLocale,
  type KlinikCeritaLocale,
  type RisetCeritaLocale,
} from "./schema";

const stories = {
  "order-grup": CeritaSchema.parse(orderGrupStory),
  "booking-jasa": BookingCeritaSchema.parse(bookingJasaStory),
  "riset-konten": RisetCeritaSchema.parse(risetKontenStory),
  "cs-klinik": KlinikCeritaSchema.parse(csKlinikStory),
} satisfies Partial<Record<SolusiSlug, unknown>>;

/** One story in one locale, tagged with its slug so the page picks the matching stage and film. */
export type StoryEntry =
  | { slug: "order-grup"; copy: CeritaLocale }
  | { slug: "booking-jasa"; copy: BookingCeritaLocale }
  | { slug: "riset-konten"; copy: RisetCeritaLocale }
  | { slug: "cs-klinik"; copy: KlinikCeritaLocale };

export function storyFor(slug: SolusiSlug, locale: SolusiLocale): StoryEntry | undefined {
  if (slug === "order-grup") return { slug, copy: stories[slug][locale] };
  if (slug === "booking-jasa") return { slug, copy: stories[slug][locale] };
  if (slug === "riset-konten") return { slug, copy: stories[slug][locale] };
  if (slug === "cs-klinik") return { slug, copy: stories[slug][locale] };
  return undefined;
}

export { stories as CERITA };
