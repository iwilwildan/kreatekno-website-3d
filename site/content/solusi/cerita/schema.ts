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
 * Every word visible on the Booking Jasa stage (BJ1 "one booking travels", BJ2 approval and takeover): a customer
 * chat becomes a priced answer, a schedule check, a numbered booking and a row in the team schedule. The team
 * approves a reschedule (the first tap counts), a staff member takes the chat over from their phone while the AI
 * pauses, and the AI sums that chat up as a proposal the team approves. Only booking data: no chat chrome,
 * timestamps on bubbles or table headers.
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
    added: z.strictObject({ day: text, moved: text, time: text, customer: text, service: text, merged: text }),
  }),
  toast: z.strictObject({ title: text, text }),
  change: z.strictObject({
    ask: say,
    title: text,
    from: text,
    to: text,
    reason: text,
    yes: text,
    no: text,
    /** Who taps first (their tap counts) and who taps second (told it is already decided). */
    first: text,
    second: text,
    decided: text,
    done: say,
  }),
  takeover: z.strictObject({
    ask: say,
    staff: say,
    pause: text,
    price: say,
    agree: say,
  }),
  summary: z.strictObject({
    title: text,
    agreedLabel: text,
    agreed: text,
    proposalLabel: text,
    proposal: text,
    price: text,
  }),
  sample: text,
});

export const BookingCeritaLocaleSchema = z.strictObject({
  intro: text,
  scenes: z.array(CeritaSceneSchema).length(11),
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
      const { change, takeover, summary, card } = copy.stage;
      if (change.first === change.second || !change.decided.includes(change.first))
        ctx.addIssue({ code: "custom", message: `${locale}: the second tap is told the first person decided` });
      // BJ2: the summary price is the booked price plus the price the staff member agreed in the chat.
      const digits = (v: string) => Number(v.replace(/\D/g, "") || NaN);
      const booked = digits(card.lines.find((line) => /Rp/.test(line.value))?.value ?? "");
      const extra = digits(takeover.price.text.match(/Rp[\d.,]+/)?.[0] ?? "");
      if (booked + extra !== digits(summary.price))
        ctx.addIssue({ code: "custom", message: `${locale}: the summary price adds the staff price to the booking` });
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

/** Clinic chat field: picks the pastel chip colour. */
export const KlinikFieldSchema = z.enum(["service", "time"]);

/**
 * Every word visible on the CS Klinik stage (CK1 "one patient chat travels"): a late-night patient chat
 * becomes two chips, the service chip finds its price in the service table, the time chip lands on a taken
 * slot and three other times are offered, the picked slot becomes an appointment, the reply goes out while
 * the patient's row is saved, and a medical question is passed to the staff (a design step, marked as such).
 * Only chat and schedule data: no chat chrome, timestamps on bubbles or table headers.
 */
export const KlinikPanggungSchema = z.strictObject({
  messages: z.array(z.strictObject({ who: text, text: short, tag: text.optional() })).length(6),
  counter: z.strictObject({ value: z.number().int().positive(), label: text }),
  clock: text,
  ask: z.strictObject({
    who: text,
    parts: z.array(z.union([text, z.strictObject({ field: KlinikFieldSchema, text })])).min(3),
  }),
  chips: z.array(z.strictObject({ field: KlinikFieldSchema, value: text })).length(2),
  prices: z.strictObject({
    title: text,
    rows: z.array(z.strictObject({ name: text, price: text })).length(4),
    pick: z.number().int().min(0).max(3),
  }),
  day: z.strictObject({
    title: text,
    slots: z.array(z.strictObject({ time: text, state: z.enum(["asked", "alt", "pick"]) })).length(4),
    taken: text,
    free: text,
    booked: text,
  }),
  offer: say,
  choose: say,
  reply: say,
  leads: z.strictObject({
    rows: z.array(z.strictObject({ no: text, last: text, summary: text })).length(2),
    added: z.strictObject({ no: text, last: text, summary: text, next: text }),
  }),
  medical: z.strictObject({
    ask: say,
    chip: text,
    staff: text,
    line: text,
    tag: text,
  }),
  sample: text,
});

export const KlinikCeritaLocaleSchema = z.strictObject({
  intro: text,
  scenes: z.array(CeritaSceneSchema).length(10),
  stage: KlinikPanggungSchema,
});

export const KlinikCeritaSchema = z
  .strictObject({
    slug: z.literal("cs-klinik"),
    id: KlinikCeritaLocaleSchema,
    en: KlinikCeritaLocaleSchema,
  })
  .superRefine((story, ctx) => {
    for (const locale of ["id", "en"] as const) {
      const copy = story[locale];
      const { stage } = copy;
      if (new Set(copy.scenes.map((scene) => scene.id)).size !== copy.scenes.length)
        ctx.addIssue({ code: "custom", message: `${locale}: scene IDs must be unique` });
      if (copy.scenes.filter((scene) => scene.cta).length !== 1 || !copy.scenes.at(-1)?.cta)
        ctx.addIssue({ code: "custom", message: `${locale}: the final scene must be the only CTA` });
      if (stage.messages.filter((message) => message.tag).length !== 1)
        ctx.addIssue({ code: "custom", message: `${locale}: exactly one bubble carries the waiting tag` });
      const fields = stage.ask.parts.flatMap((part) => (typeof part === "string" ? [] : [part.field]));
      if (stage.chips.map((chip) => chip.field).join() !== fields.join())
        ctx.addIssue({ code: "custom", message: `${locale}: chips must follow the highlighted words in order` });
      if (stage.prices.rows[stage.prices.pick].name !== stage.chips[0].value)
        ctx.addIssue({ code: "custom", message: `${locale}: the picked price row is the asked service` });
      const states = stage.day.slots.map((slot) => slot.state);
      if (states.filter((v) => v === "asked").length !== 1 || states.filter((v) => v === "pick").length !== 1)
        ctx.addIssue({ code: "custom", message: `${locale}: the day needs one asked (taken) and one picked slot` });
      const picked = stage.day.slots.find((slot) => slot.state === "pick")!.time;
      if (!stage.choose.text.includes(picked) || !stage.reply.text.includes(picked))
        ctx.addIssue({ code: "custom", message: `${locale}: the patient's choice and the reply name the picked slot` });
      const price = stage.prices.rows[stage.prices.pick].price;
      if (!stage.leads.added.summary.includes(price) || !stage.leads.added.summary.includes(picked))
        ctx.addIssue({ code: "custom", message: `${locale}: the saved summary carries the price and the slot` });
    }
  });

/** Prospect summary field: picks the pastel chip colour. */
export const ProspekFieldSchema = z.enum(["unit", "reason"]);
export const ProspekStatusSchema = z.enum(["pending", "deal", "lost"]);
const words = (max: number) => text.refine((v) => v.trim().split(/\s+/).length <= max, `Exceeds ${max} words`);

/**
 * Every word visible on the Follow-up Prospek stage (FP1 "one prospect row travels"): prospects who asked for
 * time pile up, the morning check reads the prospect table, the filter keeps the one row that is still pending
 * and quiet for more than three days, its chat summary lifts out two chips that become a short AI draft, the
 * draft lands with the marketing team who send it themselves, and the row is marked as contacted (a design
 * step, marked as such). Only prospect data: no chat chrome, timestamps on bubbles or table headers.
 */
export const ProspekPanggungSchema = z.strictObject({
  messages: z.array(z.strictObject({ who: text, text: short, tag: text.optional() })).length(6),
  counter: z.strictObject({ value: z.number().int().positive(), label: text }),
  alarm: z.strictObject({ time: text, label: text }),
  table: z.strictObject({
    title: text,
    time: text,
    rows: z
      .array(
        z.strictObject({
          name: text,
          summary: text,
          status: ProspekStatusSchema,
          last: text,
          days: z.number().int().min(0),
        }),
      )
      .length(4),
    pick: z.number().int().min(0).max(3),
  }),
  status: z.strictObject({ pending: text, deal: text, lost: text }),
  filters: z.array(text).length(2),
  quietDays: z.number().int().positive(),
  lead: z.strictObject({
    name: text,
    parts: z.array(z.union([text, z.strictObject({ field: ProspekFieldSchema, text })])).min(3),
  }),
  chips: z.array(z.strictObject({ field: ProspekFieldSchema, value: text })).length(2),
  draft: z.strictObject({ who: text, text: words(20) }),
  team: z.strictObject({ title: text, line: text, send: text, sent: text }),
  update: z.strictObject({ status: text, last: text, tag: text }),
  sample: text,
});

export const ProspekCeritaLocaleSchema = z.strictObject({
  intro: text,
  scenes: z.array(CeritaSceneSchema).length(9),
  stage: ProspekPanggungSchema,
});

export const ProspekCeritaSchema = z
  .strictObject({
    slug: z.literal("followup-prospek"),
    id: ProspekCeritaLocaleSchema,
    en: ProspekCeritaLocaleSchema,
  })
  .superRefine((story, ctx) => {
    for (const locale of ["id", "en"] as const) {
      const copy = story[locale];
      const { stage } = copy;
      if (new Set(copy.scenes.map((scene) => scene.id)).size !== copy.scenes.length)
        ctx.addIssue({ code: "custom", message: `${locale}: scene IDs must be unique` });
      if (copy.scenes.filter((scene) => scene.cta).length !== 1 || !copy.scenes.at(-1)?.cta)
        ctx.addIssue({ code: "custom", message: `${locale}: the final scene must be the only CTA` });
      if (stage.messages.filter((message) => message.tag).length !== 1)
        ctx.addIssue({ code: "custom", message: `${locale}: exactly one bubble carries the waiting tag` });
      const passes = stage.table.rows.flatMap((row, index) =>
        row.status === "pending" && row.days > stage.quietDays ? [index] : [],
      );
      if (passes.join() !== String(stage.table.pick))
        ctx.addIssue({ code: "custom", message: `${locale}: only the picked row is pending and quiet too long` });
      const row = stage.table.rows[stage.table.pick];
      const said = stage.lead.parts.map((part) => (typeof part === "string" ? part : part.text)).join("");
      if (row.name !== stage.lead.name || row.summary !== said)
        ctx.addIssue({ code: "custom", message: `${locale}: the lead card is the picked row's name and summary` });
      const fields = stage.lead.parts.flatMap((part) => (typeof part === "string" ? [] : [part.field]));
      if (stage.chips.map((chip) => chip.field).join() !== fields.join())
        ctx.addIssue({ code: "custom", message: `${locale}: chips must follow the highlighted words in order` });
      const draft = stage.draft.text.toLowerCase();
      if (
        !draft.includes(row.name.toLowerCase()) ||
        stage.chips.some((chip) => !draft.includes(chip.value.toLowerCase()))
      )
        ctx.addIssue({ code: "custom", message: `${locale}: the draft names the prospect, the unit and the reason` });
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
export type KlinikCerita = z.infer<typeof KlinikCeritaSchema>;
export type KlinikCeritaLocale = z.infer<typeof KlinikCeritaLocaleSchema>;
export type KlinikPanggung = z.infer<typeof KlinikPanggungSchema>;
export type KlinikField = z.infer<typeof KlinikFieldSchema>;
export type ProspekCerita = z.infer<typeof ProspekCeritaSchema>;
export type ProspekCeritaLocale = z.infer<typeof ProspekCeritaLocaleSchema>;
export type ProspekPanggung = z.infer<typeof ProspekPanggungSchema>;
export type ProspekField = z.infer<typeof ProspekFieldSchema>;

/** Receipt field lifted out by AI: picks the pastel chip colour. */
export const NotaFieldSchema = z.enum(["shop", "date", "total", "category"]);
/** Spending category: picks the pill colour in the table and the bar colour in the recap. */
export const NotaCategorySchema = z.enum(["bahan", "operasional", "kemasan"]);
/** Ways to send a receipt; the story follows the photo. */
export const NotaWaySchema = z.enum(["photo", "text", "voice"]);
/** Rupiah amount as shown ("Rp186.500" / "Rp186,500"); the digits are the value the cross-checks use. */
const money = text.regex(/^Rp\d{1,3}([.,]\d{3})+$/, "Amount must read like Rp186.500");
export const rupiah = (value: string) => Number(value.replace(/\D/g, ""));
const expenseRow = z.strictObject({ shop: text, meta: text, category: NotaCategorySchema, total: money });

/**
 * Every word visible on the Catat Pengeluaran stage (CP1 "one receipt travels"): receipts pile up until the end
 * of the month, a staff member picks the photo out of three ways to send and sends it, the receipt is read line by
 * line, AI lifts out the shop, date and total and adds a category, a blurry receipt from another branch is asked
 * again while this one passes, the entry becomes a row in the spending table with a confirmation, and the owner
 * receives the morning recap. Only receipt data: no chat chrome, timestamps on bubbles or table headers.
 */
export const NotaPanggungSchema = z.strictObject({
  slips: z.array(z.strictObject({ who: text, text: short, tag: text.optional() })).length(6),
  counter: z.strictObject({ value: z.number().int().positive(), label: text }),
  ways: z.array(z.strictObject({ kind: NotaWaySchema, label: text })).length(3),
  chat: z.strictObject({ title: text, sender: text, photo: text }),
  receipt: z.strictObject({
    shop: text,
    date: text,
    items: z.array(z.strictObject({ name: text, price: money })).length(3),
    totalLabel: text,
    total: money,
  }),
  categories: z.strictObject({ bahan: text, operasional: text, kemasan: text }),
  category: NotaCategorySchema,
  chips: z.array(z.strictObject({ field: NotaFieldSchema, value: text })).length(4),
  check: z.strictObject({ ok: text, bad: text, blurWho: text, ask: z.strictObject({ who: text, text: words(8) }) }),
  table: z.strictObject({ title: text, time: text, rows: z.array(expenseRow).length(3), added: expenseRow }),
  confirm: z.strictObject({ who: text, text: words(12) }),
  recap: z.strictObject({
    time: text,
    to: text,
    title: text,
    date: text,
    total: money,
    lines: z.array(z.strictObject({ category: NotaCategorySchema, value: money })).length(3),
  }),
  sample: text,
});

export const NotaCeritaLocaleSchema = z.strictObject({
  intro: text,
  scenes: z.array(CeritaSceneSchema).length(9),
  stage: NotaPanggungSchema,
});

export const NotaCeritaSchema = z
  .strictObject({
    slug: z.literal("catat-pengeluaran"),
    id: NotaCeritaLocaleSchema,
    en: NotaCeritaLocaleSchema,
  })
  .superRefine((story, ctx) => {
    for (const locale of ["id", "en"] as const) {
      const copy = story[locale];
      const { stage } = copy;
      const issue = (message: string) => ctx.addIssue({ code: "custom", message: `${locale}: ${message}` });
      if (new Set(copy.scenes.map((scene) => scene.id)).size !== copy.scenes.length) issue("scene IDs must be unique");
      if (copy.scenes.filter((scene) => scene.cta).length !== 1 || !copy.scenes.at(-1)?.cta)
        issue("the final scene must be the only CTA");
      if (stage.slips.filter((slip) => slip.tag).length !== 1) issue("exactly one slip carries the tag");
      if (stage.ways.map((way) => way.kind).join() !== "photo,text,voice") issue("ways are photo, text, voice");
      const { receipt, chips, table, recap } = stage;
      const items = receipt.items.reduce((sum, item) => sum + rupiah(item.price), 0);
      if (items !== rupiah(receipt.total)) issue("the three items add up to the receipt total");
      if (chips.map((chip) => chip.field).join() !== "shop,date,total,category")
        issue("chips are shop, date, total, category");
      const chip = (field: string) => chips.find((c) => c.field === field)!.value;
      const label = stage.categories[stage.category];
      if (chip("shop") !== receipt.shop || chip("date") !== receipt.date || chip("total") !== receipt.total)
        issue("the shop, date and total chips repeat the receipt");
      if (chip("category") !== label) issue("the category chip is the receipt's category");
      const { added } = table;
      if (added.shop !== receipt.shop || added.total !== receipt.total || added.category !== stage.category)
        issue("the added row is the receipt");
      const confirm = stage.confirm.text;
      if (!confirm.includes(receipt.shop) || !confirm.includes(receipt.total) || !confirm.includes(label))
        issue("the confirmation names the shop, total and category");
      const lines = recap.lines.reduce((sum, line) => sum + rupiah(line.value), 0);
      if (lines !== rupiah(recap.total)) issue("the recap lines add up to the recap total");
      if (recap.lines.map((line) => line.category).join() !== "bahan,operasional,kemasan")
        issue("the recap lists every category once, in order");
      const own = recap.lines.find((line) => line.category === stage.category)!;
      if (rupiah(own.value) < rupiah(receipt.total)) issue("the recap includes the receipt in its category");
    }
  });

export type NotaCerita = z.infer<typeof NotaCeritaSchema>;
export type NotaCeritaLocale = z.infer<typeof NotaCeritaLocaleSchema>;
export type NotaPanggung = z.infer<typeof NotaPanggungSchema>;
export type NotaField = z.infer<typeof NotaFieldSchema>;
export type NotaCategory = z.infer<typeof NotaCategorySchema>;

const KomentarPanggungSchema = z.strictObject({
  post: z.strictObject({
    collection: text,
    shop: text,
    packing: text,
    schedule: text,
    otherComments: z.array(text).length(2),
  }),
  question: z.strictObject({ id: text, who: text, keyword: text, after: text }),
  history: z.strictObject({ title: text, duplicateId: text, pending: text, handled: text }),
  filter: z.strictObject({ title: text, keywords: z.array(text).length(3), ignored: text }),
  public: z.strictObject({ title: text, reply: text }),
  inbox: z.strictObject({
    title: text,
    message: text,
    catalog: text,
    order: text,
    customerReply: text,
    staff: text,
    staffReply: text,
  }),
  log: z.strictObject({ title: text, publicStatus: text, privateStatus: text }),
  sample: text,
});

const KomentarCeritaLocaleSchema = z.strictObject({
  intro: text,
  scenes: z.array(CeritaSceneSchema).length(9),
  stage: KomentarPanggungSchema,
});

export const KomentarCeritaSchema = z
  .strictObject({ slug: z.literal("balas-komentar"), id: KomentarCeritaLocaleSchema, en: KomentarCeritaLocaleSchema })
  .superRefine((story, ctx) => {
    const ids = story.id.scenes.map(({ id }) => id);
    for (const locale of ["id", "en"] as const) {
      const { scenes, stage } = story[locale];
      const issue = (message: string) => ctx.addIssue({ code: "custom", path: [locale], message });
      if (new Set(scenes.map(({ id }) => id)).size !== scenes.length || scenes.some((scene, i) => scene.id !== ids[i]))
        issue("scene IDs must be unique and match across locales");
      if (scenes.filter(({ cta }) => cta).length !== 1 || !scenes.at(-1)?.cta)
        issue("the final scene must be the only CTA");
      if (stage.question.id === stage.history.duplicateId)
        issue("the new and previously handled comments have distinct IDs");
      const keywords = stage.filter.keywords.map((keyword) => keyword.toLowerCase());
      if (new Set(keywords).size !== keywords.length || !keywords.includes(stage.question.keyword.toLowerCase()))
        issue("one of the distinct keywords must match the featured comment");
    }
  });

export type KomentarCerita = z.infer<typeof KomentarCeritaSchema>;
export type KomentarCeritaLocale = z.infer<typeof KomentarCeritaLocaleSchema>;
export type KomentarPanggung = z.infer<typeof KomentarPanggungSchema>;

const price = z.number().int().nonnegative();
const FakturPanggungSchema = z.strictObject({
  locale: z.enum(["id-ID", "en-US"]),
  invoice: z.strictObject({
    number: text,
    supplier: text,
    issued: text,
    due: text,
    total: price,
    agreedTotal: price,
    lines: z
      .array(
        z.strictObject({
          item: text,
          quantity: z.number().int().positive(),
          unit: text,
          billed: price,
          agreed: price,
        }),
      )
      .length(2),
  }),
  labels: z.strictObject({ number: text, supplier: text, issued: text, due: text, items: text, total: text }),
  source: z.strictObject({ email: text, folder: text, pdf: text, copy: text }),
  compare: z.strictObject({ title: text, billed: text, agreed: text, match: text, difference: text }),
  ledger: z.strictObject({ title: text, pending: text, rejected: text, duplicate: text }),
  approval: z.strictObject({ title: text, accept: text, reject: text, reason: text }),
  manual: text,
  document: text,
  extracted: text,
  sample: text,
});

const FakturCeritaLocaleSchema = z.strictObject({
  intro: text,
  scenes: z.array(CeritaSceneSchema).length(9),
  stage: FakturPanggungSchema,
});

export const FakturCeritaSchema = z
  .strictObject({ slug: z.literal("faktur-pemasok"), id: FakturCeritaLocaleSchema, en: FakturCeritaLocaleSchema })
  .superRefine((story, ctx) => {
    const ids = story.id.scenes.map(({ id }) => id);
    for (const locale of ["id", "en"] as const) {
      const { scenes, stage } = story[locale];
      const { invoice } = stage;
      const issue = (message: string) => ctx.addIssue({ code: "custom", path: [locale], message });
      if (new Set(scenes.map(({ id }) => id)).size !== scenes.length || scenes.some((scene, i) => scene.id !== ids[i]))
        issue("scene IDs must be unique and match across locales");
      if (scenes.filter(({ cta }) => cta).length !== 1 || !scenes.at(-1)?.cta)
        issue("the final scene must be the only CTA");
      if (invoice.lines.reduce((sum, line) => sum + line.quantity * line.billed, 0) !== invoice.total)
        issue("billed subtotals must equal the invoice total");
      if (invoice.lines.reduce((sum, line) => sum + line.quantity * line.agreed, 0) !== invoice.agreedTotal)
        issue("agreed subtotals must equal the price-list total");
      if (invoice.lines[0]?.billed <= invoice.lines[0]?.agreed || invoice.lines[1]?.billed !== invoice.lines[1]?.agreed)
        issue("the first line shows an overcharge and the second line matches");
    }
  });

export type FakturCerita = z.infer<typeof FakturCeritaSchema>;
export type FakturCeritaLocale = z.infer<typeof FakturCeritaLocaleSchema>;
export type FakturPanggung = z.infer<typeof FakturPanggungSchema>;

const SdmPanggungSchema = z.strictObject({
  locale: z.enum(["id-ID", "en-US"]),
  request: z.strictObject({
    number: text,
    employee: text,
    branch: text,
    manager: text,
    date: z.iso.date(),
    days: z.number().int().positive(),
    before: z.number().int().nonnegative(),
    after: z.number().int().nonnegative(),
  }),
  messages: z.array(z.strictObject({ branch: text, body: text })).length(3),
  chat: z.strictObject({ title: text, ask: text, accepted: text }),
  routes: z.strictObject({ leave: text, policy: text, other: text }),
  policy: z.strictObject({ question: text, answer: text, source: text, followup: text, handoff: text }),
  labels: z.strictObject({
    schedule: text,
    leave: text,
    date: text,
    requested: text,
    balance: text,
    pending: text,
    approved: text,
    approve: text,
    reject: text,
    register: text,
    day: text,
    days: text,
    sample: text,
  }),
});

const SdmCeritaLocaleSchema = z.strictObject({
  intro: text,
  scenes: z.array(CeritaSceneSchema).length(9),
  stage: SdmPanggungSchema,
});

export const SdmCeritaSchema = z
  .strictObject({ slug: z.literal("layanan-sdm"), id: SdmCeritaLocaleSchema, en: SdmCeritaLocaleSchema })
  .superRefine((story, ctx) => {
    const sceneIds = story.id.scenes.map(({ id }) => id);
    const reference = story.id.stage.request;
    for (const locale of ["id", "en"] as const) {
      const { scenes, stage } = story[locale];
      const { request } = stage;
      const issue = (message: string) => ctx.addIssue({ code: "custom", path: [locale], message });
      if (new Set(scenes.map(({ id }) => id)).size !== scenes.length || scenes.some(({ id }, i) => id !== sceneIds[i]))
        issue("scenes must be unique and match across locales");
      if (scenes.filter(({ cta }) => cta).length !== 1 || !scenes.at(-1)?.cta)
        issue("the final scene must be the only CTA");
      if (request.before - request.days !== request.after)
        issue("approved leave must deduct exactly the requested days");
      const shared = ["number", "employee", "date", "before", "days", "after"] as const;
      if (shared.some((key) => request[key] !== reference[key])) issue("both locales must use the same leave request");
    }
  });

export type SdmCerita = z.infer<typeof SdmCeritaSchema>;
export type SdmCeritaLocale = z.infer<typeof SdmCeritaLocaleSchema>;
export type SdmPanggung = z.infer<typeof SdmPanggungSchema>;

const clockTime = z.string().regex(/^(?:[01]\d|2[0-3]):[0-5]\d$/);
const OnboardingPanggungSchema = z.strictObject({
  locale: z.enum(["id-ID", "en-US"]),
  deal: z.strictObject({
    number: text,
    client: text,
    company: text,
    owner: text,
    package: text,
    signed: z.iso.date(),
    kickoff: z.iso.date(),
    zone: z.literal("WITA"),
  }),
  prep: z.array(text).length(3),
  slots: z.array(z.strictObject({ start: clockTime, end: clockTime, state: z.enum(["busy", "free"]) })).length(3),
  messages: z.array(text).length(3),
  draft: z.strictObject({ subject: text, greeting: text, body: text }),
  labels: z.strictObject({
    deals: text,
    won: text,
    package: text,
    checklist: text,
    draft: text,
    schedulePending: text,
    calendar: text,
    busy: text,
    free: text,
    proposed: text,
    review: text,
    slotChecked: text,
    send: text,
    emailSent: text,
    inviteSent: text,
    register: text,
    owner: text,
    awaitingReply: text,
    sample: text,
  }),
});

const OnboardingCeritaLocaleSchema = z.strictObject({
  intro: text,
  scenes: z.array(CeritaSceneSchema).length(9),
  stage: OnboardingPanggungSchema,
});

export const OnboardingCeritaSchema = z
  .strictObject({
    slug: z.literal("onboarding-klien"),
    id: OnboardingCeritaLocaleSchema,
    en: OnboardingCeritaLocaleSchema,
  })
  .superRefine((story, ctx) => {
    const ids = story.id.scenes.map(({ id }) => id);
    const reference = story.id.stage;
    for (const locale of ["id", "en"] as const) {
      const { scenes, stage } = story[locale];
      const { deal, slots, prep } = stage;
      const issue = (message: string) => ctx.addIssue({ code: "custom", path: [locale], message });
      if (
        new Set(scenes.map(({ id }) => id)).size !== scenes.length ||
        scenes.some(({ id }, index) => id !== ids[index])
      )
        issue("scene IDs must be unique and match across locales");
      if (scenes.filter(({ cta }) => cta).length !== 1 || !scenes.at(-1)?.cta)
        issue("the final scene must be the only CTA");
      if (new Set(prep).size !== prep.length) issue("the package checklist must have three distinct items");
      if (
        slots.filter(({ state }) => state === "free").length !== 1 ||
        slots.some((slot, i) => slot.start >= slot.end || (i > 0 && slots[i - 1].end > slot.start))
      )
        issue("calendar slots must be ordered, non-overlapping, and contain one free option");
      if (deal.kickoff <= deal.signed) issue("the kickoff is later than the day the invitation is sent");
      const shared = ["number", "client", "owner", "signed", "kickoff", "zone"] as const;
      if (
        shared.some((key) => deal[key] !== reference.deal[key]) ||
        slots.some((slot, i) => {
          const other = reference.slots[i];
          return !other || slot.start !== other.start || slot.end !== other.end || slot.state !== other.state;
        })
      )
        issue("both locales must use the same deal and calendar slots");
    }
  });

export type OnboardingCerita = z.infer<typeof OnboardingCeritaSchema>;
export type OnboardingCeritaLocale = z.infer<typeof OnboardingCeritaLocaleSchema>;
export type OnboardingPanggung = z.infer<typeof OnboardingPanggungSchema>;

const AsistenSopPanggungSchema = z.strictObject({
  staff: text,
  document: z.strictObject({ title: text, version: text, section: text, heading: text }),
  question: text,
  answer: z.tuple([text, text, text]),
  followUp: text,
  guidance: text,
  logTopic: text,
  labels: z.strictObject({
    folder: text,
    searching: text,
    knowledgeBase: text,
    ready: text,
    chat: text,
    assistant: text,
    source: text,
    outsideSop: text,
    staffAction: text,
    log: text,
    design: text,
    topic: text,
    sample: text,
  }),
});

const AsistenSopCeritaLocaleSchema = z.strictObject({
  intro: text,
  scenes: z.array(CeritaSceneSchema).length(9),
  stage: AsistenSopPanggungSchema,
});

export const AsistenSopCeritaSchema = z.strictObject({
  slug: z.literal("asisten-sop"),
  id: AsistenSopCeritaLocaleSchema,
  en: AsistenSopCeritaLocaleSchema,
});

export type AsistenSopCerita = z.infer<typeof AsistenSopCeritaSchema>;
export type AsistenSopCeritaLocale = z.infer<typeof AsistenSopCeritaLocaleSchema>;
export type AsistenSopPanggung = z.infer<typeof AsistenSopPanggungSchema>;

const CarouselSlideSchema = z.strictObject({
  kind: z.enum(["cover", "tubruk", "press", "pour", "save"]),
  title: text,
  body: text,
});

const CarouselPanggungSchema = z.strictObject({
  number: z.string().regex(/^CR-\d{3}$/),
  brand: text,
  owner: text,
  brief: text,
  slides: z.array(CarouselSlideSchema).length(5),
  caption: text,
  hashtags: z.tuple([text, text]),
  labels: z.strictObject({
    before: text,
    notes: text,
    design: text,
    table: text,
    education: text,
    slideCount: text,
    outline: text,
    frame: text,
    footer: text,
    slides: text,
    caption: text,
    folder: text,
    group: text,
    preview: text,
    review: text,
    sample: text,
  }),
});

const CarouselCeritaLocaleSchema = z.strictObject({
  intro: text,
  scenes: z.array(CeritaSceneSchema).length(9),
  stage: CarouselPanggungSchema,
});

export const CarouselCeritaSchema = z.strictObject({
  slug: z.literal("carousel-konten"),
  id: CarouselCeritaLocaleSchema,
  en: CarouselCeritaLocaleSchema,
});

export type CarouselCerita = z.infer<typeof CarouselCeritaSchema>;
export type CarouselCeritaLocale = z.infer<typeof CarouselCeritaLocaleSchema>;
export type CarouselPanggung = z.infer<typeof CarouselPanggungSchema>;

const BerkasPanggungSchema = z.strictObject({
  reference: z.string().regex(/^BD-\d{3}$/),
  customer: text,
  reviewer: text,
  documents: z.strictObject({
    identity: z.strictObject({ label: text, first: text, replacement: text }),
    family: z.strictObject({ label: text, file: text }),
    certificate: z.strictObject({ label: text, file: text }),
  }),
  request: text,
  labels: z.strictObject({
    before: text,
    searching: text,
    chat: text,
    firstBatch: text,
    folder: text,
    checklist: text,
    unreadable: text,
    missing: text,
    read: text,
    resend: text,
    needsMore: text,
    ready: text,
    checked: text,
    complete: text,
    newFiles: text,
    review: text,
    compareData: text,
    sample: text,
  }),
});

const BerkasCeritaLocaleSchema = z.strictObject({
  intro: text,
  scenes: z.array(CeritaSceneSchema).length(9),
  stage: BerkasPanggungSchema,
});

export const BerkasCeritaSchema = z.strictObject({
  slug: z.literal("berkas-dokumen"),
  id: BerkasCeritaLocaleSchema,
  en: BerkasCeritaLocaleSchema,
});

export type BerkasCerita = z.infer<typeof BerkasCeritaSchema>;
export type BerkasCeritaLocale = z.infer<typeof BerkasCeritaLocaleSchema>;
export type BerkasPanggung = z.infer<typeof BerkasPanggungSchema>;

const StokPanggungSchema = z.strictObject({
  sku: text,
  item: text,
  clerk: text,
  buyer: text,
  stock: z.strictObject({
    opening: z.number().int().positive(),
    outbound: z.number().int().positive(),
    remaining: z.number().int().positive(),
    minimum: z.number().int().positive(),
    ordered: z.number().int().positive(),
    closing: z.number().int().positive(),
    weeklyOutflow: z.number().int().positive(),
    observedDays: z.number().int().positive(),
    dailyOutflow: z.number().positive(),
    coverDays: z.number().positive(),
  }),
  labels: z.strictObject({
    unit: text,
    before: text,
    movement: text,
    outbound: text,
    received: text,
    inventory: text,
    recorded: text,
    remaining: text,
    minimum: text,
    threshold: text,
    below: text,
    estimate: text,
    design: text,
    estimateBasis: text,
    estimateCondition: text,
    chat: text,
    alert: text,
    order: text,
    waiting: text,
    sample: text,
  }),
});

const StokCeritaLocaleSchema = z.strictObject({
  intro: text,
  scenes: z.array(CeritaSceneSchema).length(9),
  stage: StokPanggungSchema,
});

export const StokCeritaSchema = z.strictObject({
  slug: z.literal("stok-menipis"),
  id: StokCeritaLocaleSchema,
  en: StokCeritaLocaleSchema,
});

export type StokCerita = z.infer<typeof StokCeritaSchema>;
export type StokCeritaLocale = z.infer<typeof StokCeritaLocaleSchema>;
export type StokPanggung = z.infer<typeof StokPanggungSchema>;

const TagihanSceneDateSchema = z.strictObject({ iso: z.iso.date(), label: text });
const TagihanInvoiceSchema = z.strictObject({ code: text, customer: text, amount: text });
const TagihanMessageSchema = z.strictObject({ stage: text, date: TagihanSceneDateSchema, body: text });

const TagihanPanggungSchema = z.strictObject({
  finance: text,
  owner: text,
  morning: text,
  due: TagihanSceneDateSchema,
  paidOn: TagihanSceneDateSchema,
  handedOffOn: TagihanSceneDateSchema,
  primary: TagihanInvoiceSchema,
  overdue: TagihanInvoiceSchema,
  messages: z.tuple([TagihanMessageSchema, TagihanMessageSchema, TagihanMessageSchema]),
  labels: z.strictObject({
    before: text,
    history: text,
    ledger: text,
    open: text,
    due: text,
    chat: text,
    paymentInstructions: text,
    logged: text,
    sent: text,
    payment: text,
    confirmed: text,
    paid: text,
    skipped: text,
    handoff: text,
    owner: text,
    followUp: text,
    sample: text,
  }),
});

const TagihanCeritaLocaleSchema = z.strictObject({
  intro: text,
  scenes: z.array(CeritaSceneSchema).length(9),
  stage: TagihanPanggungSchema,
});

export const TagihanCeritaSchema = z.strictObject({
  slug: z.literal("pengingat-tagihan"),
  id: TagihanCeritaLocaleSchema,
  en: TagihanCeritaLocaleSchema,
});

export type TagihanCerita = z.infer<typeof TagihanCeritaSchema>;
export type TagihanCeritaLocale = z.infer<typeof TagihanCeritaLocaleSchema>;
export type TagihanPanggung = z.infer<typeof TagihanPanggungSchema>;

const UlasanReviewSchema = z.strictObject({
  id: text,
  source: z.enum(["form", "chat", "email"]),
  branch: z.union([z.literal(1), z.literal(2)]),
  date: z.iso.date(),
  rating: z.number().int().min(1).max(5).nullable(),
  topic: z.enum(["wait", "taste", "clean"]),
  replied: z.boolean(),
  body: text,
});

const UlasanPanggungSchema = z.strictObject({
  locale: z.enum(["id-ID", "en-GB"]),
  staff: text,
  owner: text,
  daily: text,
  reviews: z.array(UlasanReviewSchema).length(6),
  previousCounts: z.strictObject({
    wait: z.number().int().nonnegative(),
    taste: z.number().int().nonnegative(),
    clean: z.number().int().nonnegative(),
  }),
  currentWeek: text,
  previousWeek: text,
  reportDate: z.iso.date(),
  labels: z.strictObject({
    channels: z.strictObject({ form: text, chat: text, email: text }),
    topics: z.strictObject({ wait: text, taste: text, clean: text }),
    branch: text,
    before: text,
    intake: text,
    table: text,
    stars: text,
    unrated: text,
    duplicates: text,
    duplicateSkipped: text,
    incoming: text,
    kept: text,
    grouped: text,
    complaint: text,
    praise: text,
    queue: text,
    unanswered: text,
    followUp: text,
    report: text,
    current: text,
    previous: text,
    total: text,
    action: text,
    sample: text,
  }),
});

const UlasanCeritaLocaleSchema = z.strictObject({
  intro: text,
  scenes: z.array(CeritaSceneSchema).length(9),
  stage: UlasanPanggungSchema,
});

export const UlasanCeritaSchema = z.strictObject({
  slug: z.literal("ulasan-pelanggan"),
  id: UlasanCeritaLocaleSchema,
  en: UlasanCeritaLocaleSchema,
});

export type UlasanCerita = z.infer<typeof UlasanCeritaSchema>;
export type UlasanCeritaLocale = z.infer<typeof UlasanCeritaLocaleSchema>;
export type UlasanPanggung = z.infer<typeof UlasanPanggungSchema>;

const RekapProductSchema = z.enum(["tea", "water", "juice"]);
const RekapAreaSchema = z.enum(["north", "south"]);
const RekapPanggungSchema = z.strictObject({
  locale: z.enum(["id-ID", "en-GB"]),
  clerk: text,
  owner: text,
  at: text,
  date: z.iso.date(),
  products: z.strictObject({ tea: text, water: text, juice: text }),
  areas: z.strictObject({ north: text, south: text }),
  rows: z
    .array(
      z.strictObject({
        product: RekapProductSchema,
        area: RekapAreaSchema,
        cartons: z.number().int().positive(),
        amount: z.number().int().positive(),
      }),
    )
    .length(4),
  total: z.number().int().positive(),
  areaTotals: z.strictObject({ north: z.number().int().positive(), south: z.number().int().positive() }),
  top: z.strictObject({ product: RekapProductSchema, cartons: z.number().int().positive() }),
  periods: z.tuple([
    z.strictObject({ date: z.iso.date(), amount: z.number().int().positive(), change: z.number(), label: text }),
    z.strictObject({ date: z.iso.date(), amount: z.number().int().positive(), change: z.number(), label: text }),
  ]),
  question: text,
  history: z.strictObject({
    product: RekapProductSchema,
    month: text,
    source: text,
    north: z.number().int().positive(),
    south: z.number().int().positive(),
    cartons: z.number().int().positive(),
  }),
  labels: z.strictObject({
    before: text,
    waiting: text,
    sheet: text,
    product: text,
    area: text,
    cartons: text,
    amount: text,
    grouped: text,
    total: text,
    top: text,
    compare: text,
    today: text,
    whatsapp: text,
    recap: text,
    assistant: text,
    source: text,
    sample: text,
  }),
});

const RekapCeritaLocaleSchema = z.strictObject({
  intro: text,
  scenes: z.array(CeritaSceneSchema).length(9),
  stage: RekapPanggungSchema,
});

export const RekapCeritaSchema = z.strictObject({
  slug: z.literal("rekap-penjualan"),
  id: RekapCeritaLocaleSchema,
  en: RekapCeritaLocaleSchema,
});

export type RekapCerita = z.infer<typeof RekapCeritaSchema>;
export type RekapCeritaLocale = z.infer<typeof RekapCeritaLocaleSchema>;
export type RekapPanggung = z.infer<typeof RekapPanggungSchema>;
