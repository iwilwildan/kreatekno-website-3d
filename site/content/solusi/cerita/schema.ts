import { z } from "zod";

const text = z.string().min(1);

export const CeritaSceneSchema = z.strictObject({
  id: z.string().regex(/^[a-z0-9-]+$/),
  rail: text,
  eyebrow: text,
  title: text,
  body: text,
  cta: z.boolean().optional(),
});

/** Sender role: picks the name colour (VISUAL 2.2). */
export const RoleSchema = z.enum(["sales", "gudang", "cs", "kurir", "admin", "asisten"]);
/** Order field: picks the pastel block colour (VISUAL 2.3). */
export const FieldSchema = z.enum(["customer", "item", "qty", "address", "pay"]);
export const StatusSchema = z.enum(["new", "sent", "done"]);

const short = text.refine((v) => v.trim().split(/\s+/).length <= 5, "Stage bubble exceeds 5 words");
const bubble = z.strictObject({ who: text, role: RoleSchema, text: short });

/**
 * Every word visible on the motion-graphic stage (OG5b "one order travels"), so ID and EN stay in content.
 * Only order data: no chat chrome, timestamps or table headers.
 */
export const PanggungSchema = z.strictObject({
  messages: z.array(bubble.extend({ tag: text.optional() })).length(6),
  counter: z.strictObject({ value: z.number().int().positive(), label: text }),
  order: z.strictObject({
    who: text,
    role: RoleSchema,
    parts: z.array(z.union([text, z.strictObject({ field: FieldSchema, text })])).min(5),
  }),
  chips: z.array(z.strictObject({ field: FieldSchema, value: text })).length(5),
  table: z.strictObject({
    order: z.strictObject({ no: text, customer: text, item: text }),
    rows: z
      .array(z.strictObject({ no: text, customer: text, item: text, status: StatusSchema, revised: text.optional() }))
      .length(2),
    revision: text,
  }),
  status: z.strictObject({ new: text, sent: text, done: text }),
  reply: bubble,
  courier: z.array(bubble).length(2),
  recap: z.strictObject({
    time: text,
    title: text,
    lines: z.array(z.strictObject({ label: text, value: text })).length(4),
  }),
  sample: text,
});

export const CeritaLocaleSchema = z.strictObject({
  intro: text,
  scenes: z.array(CeritaSceneSchema).length(9),
  stage: PanggungSchema,
});

export const CeritaSchema = z
  .strictObject({
    slug: z.literal("order-grup"),
    id: CeritaLocaleSchema,
    en: CeritaLocaleSchema,
  })
  .superRefine((story, ctx) => {
    for (const locale of ["id", "en"] as const) {
      const copy = story[locale];
      if (new Set(copy.scenes.map((scene) => scene.id)).size !== copy.scenes.length)
        ctx.addIssue({ code: "custom", message: `${locale}: scene IDs must be unique` });
      if (copy.scenes.filter((scene) => scene.cta).length !== 1 || !copy.scenes.at(-1)?.cta)
        ctx.addIssue({ code: "custom", message: `${locale}: the final scene must be the only CTA` });
      if (copy.stage.table.rows.filter((row) => row.revised).length !== 1)
        ctx.addIssue({ code: "custom", message: `${locale}: exactly one table row shows the revision` });
      if (copy.stage.messages.filter((message) => message.tag).length !== 1)
        ctx.addIssue({ code: "custom", message: `${locale}: exactly one bubble carries the missed tag` });
      const fields = copy.stage.order.parts.flatMap((part) => (typeof part === "string" ? [] : [part.field]));
      if (copy.stage.chips.map((chip) => chip.field).join() !== fields.join())
        ctx.addIssue({ code: "custom", message: `${locale}: chips must follow the highlighted words in order` });
    }
  });

export type Cerita = z.infer<typeof CeritaSchema>;
export type CeritaLocale = z.infer<typeof CeritaLocaleSchema>;
export type Panggung = z.infer<typeof PanggungSchema>;
export type Role = z.infer<typeof RoleSchema>;
export type Field = z.infer<typeof FieldSchema>;
