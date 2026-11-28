import type { SolusiLocale, SolusiSlug } from "../schema";
import { asistenSopStory } from "./asisten-sop";
import { balasKomentarStory } from "./balas-komentar";
import { berkasDokumenStory } from "./berkas-dokumen";
import { bookingJasaStory } from "./booking-jasa";
import { carouselKontenStory } from "./carousel-konten";
import { catatPengeluaranStory } from "./catat-pengeluaran";
import { csKlinikStory } from "./cs-klinik";
import { fakturPemasokStory } from "./faktur-pemasok";
import { followupProspekStory } from "./followup-prospek";
import { layananSdmStory } from "./layanan-sdm";
import { onboardingKlienStory } from "./onboarding-klien";
import { orderGrupStory } from "./order-grup";
import { pengingatTagihanStory } from "./pengingat-tagihan";
import { rekapPenjualanStory } from "./rekap-penjualan";
import { risetKontenStory } from "./riset-konten";
import { stokMenipisStory } from "./stok-menipis";
import { ulasanPelangganStory } from "./ulasan-pelanggan";
import {
  AsistenSopCeritaSchema,
  BerkasCeritaSchema,
  BookingCeritaSchema,
  CarouselCeritaSchema,
  CeritaSchema,
  FakturCeritaSchema,
  KlinikCeritaSchema,
  KomentarCeritaSchema,
  NotaCeritaSchema,
  OnboardingCeritaSchema,
  ProspekCeritaSchema,
  RekapCeritaSchema,
  RisetCeritaSchema,
  SdmCeritaSchema,
  StokCeritaSchema,
  TagihanCeritaSchema,
  UlasanCeritaSchema,
  type AsistenSopCeritaLocale,
  type BerkasCeritaLocale,
  type BookingCeritaLocale,
  type CarouselCeritaLocale,
  type CeritaLocale,
  type FakturCeritaLocale,
  type KlinikCeritaLocale,
  type KomentarCeritaLocale,
  type NotaCeritaLocale,
  type OnboardingCeritaLocale,
  type ProspekCeritaLocale,
  type RekapCeritaLocale,
  type RisetCeritaLocale,
  type SdmCeritaLocale,
  type StokCeritaLocale,
  type TagihanCeritaLocale,
  type UlasanCeritaLocale,
} from "./schema";

const stories = {
  "order-grup": CeritaSchema.parse(orderGrupStory),
  "booking-jasa": BookingCeritaSchema.parse(bookingJasaStory),
  "riset-konten": RisetCeritaSchema.parse(risetKontenStory),
  "cs-klinik": KlinikCeritaSchema.parse(csKlinikStory),
  "followup-prospek": ProspekCeritaSchema.parse(followupProspekStory),
  "catat-pengeluaran": NotaCeritaSchema.parse(catatPengeluaranStory),
  "balas-komentar": KomentarCeritaSchema.parse(balasKomentarStory),
  "faktur-pemasok": FakturCeritaSchema.parse(fakturPemasokStory),
  "layanan-sdm": SdmCeritaSchema.parse(layananSdmStory),
  "onboarding-klien": OnboardingCeritaSchema.parse(onboardingKlienStory),
  "asisten-sop": AsistenSopCeritaSchema.parse(asistenSopStory),
  "carousel-konten": CarouselCeritaSchema.parse(carouselKontenStory),
  "berkas-dokumen": BerkasCeritaSchema.parse(berkasDokumenStory),
  "stok-menipis": StokCeritaSchema.parse(stokMenipisStory),
  "pengingat-tagihan": TagihanCeritaSchema.parse(pengingatTagihanStory),
  "ulasan-pelanggan": UlasanCeritaSchema.parse(ulasanPelangganStory),
  "rekap-penjualan": RekapCeritaSchema.parse(rekapPenjualanStory),
} satisfies Partial<Record<SolusiSlug, unknown>>;

/** One story in one locale, tagged with its slug so the page picks the matching stage and film. */
export type StoryEntry =
  | { slug: "order-grup"; copy: CeritaLocale }
  | { slug: "booking-jasa"; copy: BookingCeritaLocale }
  | { slug: "riset-konten"; copy: RisetCeritaLocale }
  | { slug: "cs-klinik"; copy: KlinikCeritaLocale }
  | { slug: "followup-prospek"; copy: ProspekCeritaLocale }
  | { slug: "catat-pengeluaran"; copy: NotaCeritaLocale }
  | { slug: "balas-komentar"; copy: KomentarCeritaLocale }
  | { slug: "faktur-pemasok"; copy: FakturCeritaLocale }
  | { slug: "layanan-sdm"; copy: SdmCeritaLocale }
  | { slug: "onboarding-klien"; copy: OnboardingCeritaLocale }
  | { slug: "asisten-sop"; copy: AsistenSopCeritaLocale }
  | { slug: "carousel-konten"; copy: CarouselCeritaLocale }
  | { slug: "berkas-dokumen"; copy: BerkasCeritaLocale }
  | { slug: "stok-menipis"; copy: StokCeritaLocale }
  | { slug: "pengingat-tagihan"; copy: TagihanCeritaLocale }
  | { slug: "ulasan-pelanggan"; copy: UlasanCeritaLocale }
  | { slug: "rekap-penjualan"; copy: RekapCeritaLocale };

export function storyFor(slug: SolusiSlug, locale: SolusiLocale): StoryEntry | undefined {
  if (slug === "order-grup") return { slug, copy: stories[slug][locale] };
  if (slug === "booking-jasa") return { slug, copy: stories[slug][locale] };
  if (slug === "riset-konten") return { slug, copy: stories[slug][locale] };
  if (slug === "cs-klinik") return { slug, copy: stories[slug][locale] };
  if (slug === "followup-prospek") return { slug, copy: stories[slug][locale] };
  if (slug === "catat-pengeluaran") return { slug, copy: stories[slug][locale] };
  if (slug === "balas-komentar") return { slug, copy: stories[slug][locale] };
  if (slug === "faktur-pemasok") return { slug, copy: stories[slug][locale] };
  if (slug === "layanan-sdm") return { slug, copy: stories[slug][locale] };
  if (slug === "onboarding-klien") return { slug, copy: stories[slug][locale] };
  if (slug === "asisten-sop") return { slug, copy: stories[slug][locale] };
  if (slug === "carousel-konten") return { slug, copy: stories[slug][locale] };
  if (slug === "berkas-dokumen") return { slug, copy: stories[slug][locale] };
  if (slug === "stok-menipis") return { slug, copy: stories[slug][locale] };
  if (slug === "pengingat-tagihan") return { slug, copy: stories[slug][locale] };
  if (slug === "ulasan-pelanggan") return { slug, copy: stories[slug][locale] };
  if (slug === "rekap-penjualan") return { slug, copy: stories[slug][locale] };
  return undefined;
}

export { stories as CERITA };
