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
