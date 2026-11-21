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

/** Booking field: picks the pastel chip colour. */
export const BookingFieldSchema = z.enum(["service", "day", "time"]);
const say = z.strictObject({ who: text, text: short });

/**
 * Every word visible on the Booking Jasa stage (BJ1 "one booking travels"): a customer chat becomes a priced
 * answer, a schedule check, a numbered booking, a row in the team schedule, then a change the team approves.
 * Only booking data: no chat chrome, timestamps on bubbles or table headers.
 */
export const BookingPanggungSchema = z.strictObject({
  messages: z.array(z.strictObject({ who: text, text: short, tag: text.optional() })).length(6),
  counter: z.strictObject({ value: z.number().int().positive(), label: text }),
  clock: text,
  ask: z.strictObject({
    who: text,
    parts: z.array(z.union([text, z.strictObject({ field: BookingFieldSchema, text })])).min(4),
  }),
  chips: z.array(z.strictObject({ field: BookingFieldSchema, value: text })).length(3),
  reply: say,
  day: z.strictObject({
    title: text,
    slots: z.array(z.strictObject({ time: text, state: z.enum(["taken", "asked", "free", "pick"]) })).length(4),
    taken: text,
    free: text,
  }),
  rules: z.array(text).length(3),
  offer: say,
  location: say,
  card: z.strictObject({
    no: text,
    lines: z.array(z.strictObject({ label: text, value: text })).length(4),
    status: text,
  }),
  table: z.strictObject({
    rows: z.array(z.strictObject({ day: text, time: text, customer: text, service: text })).length(2),
    added: z.strictObject({ day: text, moved: text, time: text, customer: text, service: text }),
  }),
  toast: z.strictObject({ title: text, text }),
  change: z.strictObject({
    ask: say,
    title: text,
    from: text,
    to: text,
    yes: text,
    no: text,
    done: say,
  }),
  sample: text,
});

export const BookingCeritaLocaleSchema = z.strictObject({
  intro: text,
  scenes: z.array(CeritaSceneSchema).length(9),
  stage: BookingPanggungSchema,
});

export const BookingCeritaSchema = z
  .strictObject({
    slug: z.literal("booking-jasa"),
    id: BookingCeritaLocaleSchema,
    en: BookingCeritaLocaleSchema,
  })
  .superRefine((story, ctx) => {
    for (const locale of ["id", "en"] as const) {
      const copy = story[locale];
      if (new Set(copy.scenes.map((scene) => scene.id)).size !== copy.scenes.length)
        ctx.addIssue({ code: "custom", message: `${locale}: scene IDs must be unique` });
      if (copy.scenes.filter((scene) => scene.cta).length !== 1 || !copy.scenes.at(-1)?.cta)
        ctx.addIssue({ code: "custom", message: `${locale}: the final scene must be the only CTA` });
      if (copy.stage.messages.filter((message) => message.tag).length !== 1)
        ctx.addIssue({ code: "custom", message: `${locale}: exactly one bubble carries the waiting tag` });
      const fields = copy.stage.ask.parts.flatMap((part) => (typeof part === "string" ? [] : [part.field]));
      if (copy.stage.chips.map((chip) => chip.field).join() !== fields.join())
        ctx.addIssue({ code: "custom", message: `${locale}: chips must follow the highlighted words in order` });
      const states = copy.stage.day.slots.map((slot) => slot.state);
      if (states.filter((v) => v === "asked").length !== 1 || states.filter((v) => v === "pick").length !== 1)
        ctx.addIssue({ code: "custom", message: `${locale}: the day needs one asked (taken) and one picked slot` });
    }
  });

const kwPart = z.strictObject({ kw: text });

/**
 * Every word visible on the Riset Konten stage (RK1 "one topic travels"): scattered idea notes become a topic
 * list, the picked topic becomes a trend summary whose key phrases lift out as keywords, the keywords pull in
 * the most-liked posts, the posts fold into an audience-pattern card, the card becomes a row in the research
 * table, and the team approves it. Only research data: no app chrome, timestamps on posts or table headers.
 * Posts are listed from most to least liked; the film starts them shuffled.
 */
export const RisetPanggungSchema = z.strictObject({
  notes: z.array(short).length(6),
  counter: z.strictObject({ value: z.number().int().positive(), label: text }),
  clock: text,
  topics: z.array(text).length(5),
  pick: z.number().int().min(1).max(4),
  research: z.strictObject({
    title: text,
    parts: z.array(z.union([text, kwPart])).min(4),
  }),
  keywords: z.array(text).length(3),
  posts: z.array(z.strictObject({ who: text, text: short, likes: text })).length(6),
  sort: text,
  analysis: z.strictObject({
    title: text,
    complaintsLabel: text,
    complaints: z.array(short).length(3),
    angleLabel: text,
    angle: text,
    scoreLabel: text,
    score: z.number().int().min(1).max(10),
    of: text,
  }),
  table: z.strictObject({
    rows: z
      .array(z.strictObject({ topic: text, angle: text, score: text, status: z.enum(["approved", "skipped"]) }))
      .length(2),
    added: z.strictObject({ topic: text, angle: text, score: text }),
  }),
  status: z.strictObject({ new: text, approved: text, skipped: text }),
  notify: z.strictObject({ title: text, topic: text, angle: text, score: text, yes: text, no: text }),
  sample: text,
});

export const RisetCeritaLocaleSchema = z.strictObject({
  intro: text,
  scenes: z.array(CeritaSceneSchema).length(9),
  stage: RisetPanggungSchema,
});

export const RisetCeritaSchema = z
  .strictObject({
    slug: z.literal("riset-konten"),
    id: RisetCeritaLocaleSchema,
    en: RisetCeritaLocaleSchema,
  })
  .superRefine((story, ctx) => {
    for (const locale of ["id", "en"] as const) {
      const copy = story[locale];
      const { stage } = copy;
      if (new Set(copy.scenes.map((scene) => scene.id)).size !== copy.scenes.length)
        ctx.addIssue({ code: "custom", message: `${locale}: scene IDs must be unique` });
      if (copy.scenes.filter((scene) => scene.cta).length !== 1 || !copy.scenes.at(-1)?.cta)
        ctx.addIssue({ code: "custom", message: `${locale}: the final scene must be the only CTA` });
      const words = stage.research.parts.flatMap((part) => (typeof part === "string" ? [] : [part.kw]));
      if (words.length !== stage.keywords.length)
        ctx.addIssue({ code: "custom", message: `${locale}: one highlighted phrase per keyword` });
      if (stage.table.added.topic !== stage.topics[stage.pick] || stage.notify.topic !== stage.topics[stage.pick])
        ctx.addIssue({ code: "custom", message: `${locale}: the new row and the summary carry the picked topic` });
      if (
        stage.table.added.score !== stage.notify.score ||
        !stage.notify.score.startsWith(String(stage.analysis.score))
      )
        ctx.addIssue({ code: "custom", message: `${locale}: the score is the same on the card, row and summary` });
    }
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
export type BookingCerita = z.infer<typeof BookingCeritaSchema>;
export type BookingCeritaLocale = z.infer<typeof BookingCeritaLocaleSchema>;
export type BookingPanggung = z.infer<typeof BookingPanggungSchema>;
export type BookingField = z.infer<typeof BookingFieldSchema>;
export type RisetCerita = z.infer<typeof RisetCeritaSchema>;
export type RisetCeritaLocale = z.infer<typeof RisetCeritaLocaleSchema>;
export type RisetPanggung = z.infer<typeof RisetPanggungSchema>;
