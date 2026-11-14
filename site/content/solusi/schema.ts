import { z } from "zod";

export const IndustriSchema = z.enum(["retail", "klinik", "properti", "logistik", "jasa", "perjalanan"]);
export const TimSchema = z.enum(["marketing", "penjualan", "cs", "operasional", "keuangan", "manajemen", "sdm"]);
export const AppSchema = z.enum(["whatsapp", "sheets", "instagram", "gmail", "calendar", "drive"]);
export const SlugSchema = z.enum([
  "order-grup",
  "booking-jasa",
  "berkas-dokumen",
  "riset-konten",
  "cs-klinik",
  "pengingat-tagihan",
  "rekap-penjualan",
  "followup-prospek",
  "carousel-konten",
  "asisten-sop",
  "stok-menipis",
  "ulasan-pelanggan",
]);
export const KartuIdSchema = z.string().regex(/^k([1-9]|1\d|2[0-4])$/);
const text = z.string().min(1);
const strings = z.array(text).min(1);
export const SolusiCopySchema = z.strictObject({
  title: text,
  question: text,
  result: text,
  summary: text.refine((v) => v.trim().split(/\s+/).length <= 20, "Summary exceeds 20 words"),
  answer: text,
  client: text.optional(),
  painsLead: text.optional(),
  pains: strings,
  built: z.strictObject({ h: text, lead: text, points: z.array(text).min(2).max(6) }).optional(),
  quote: z.strictObject({ text, by: text }).optional(),
  steps: z.array(z.strictObject({ title: text, body: text })).min(1),
  compare: z.array(z.strictObject({ aspect: text, before: text, after: text })).min(1),
  fit: strings,
  notFit: strings,
  prep: strings,
  // Prototype metrics are examples, never verified client evidence.
  metrics: z.array(z.strictObject({ value: text, unit: text, label: text })).optional(),
  faq: z.array(z.strictObject({ q: text, a: text })).min(1),
});
export const SolusiSchema = z
  .strictObject({
    slug: SlugSchema,
    status: z.enum(["jalan", "ide"]),
    updated: z.iso.date(),
    industri: z.array(IndustriSchema).min(1),
    tim: z.array(TimSchema).min(1),
    apps: z.array(AppSchema).min(1),
    metricsKind: z.literal("example").optional(),
    id: SolusiCopySchema,
    // English copy is drafted/reviewed with the bilingual HTML stage S2.
    en: SolusiCopySchema.optional(),
  })
  .refine((s) => !s.id.metrics || s.metricsKind === "example", "Metrics need an explicit example label");
export const KartuSchema = z.strictObject({
  id: KartuIdSchema,
  text: z.strictObject({ id: text, en: text.optional() }),
  industri: z.array(IndustriSchema),
  tim: z.array(TimSchema).min(1),
  solusi: z
    .partialRecord(SlugSchema, z.number().int().min(1).max(3))
    .refine((v) => Object.keys(v).length > 0, "Card needs at least one solution"),
});
export type Industri = z.infer<typeof IndustriSchema>;
export type Tim = z.infer<typeof TimSchema>;
export type App = z.infer<typeof AppSchema>;
export type SolusiSlug = z.infer<typeof SlugSchema>;
export type Solusi = z.infer<typeof SolusiSchema>;
export type Kartu = z.infer<typeof KartuSchema>;
export type SolusiLocale = "id" | "en";
