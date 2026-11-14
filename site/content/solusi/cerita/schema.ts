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

export const CeritaLocaleSchema = z.strictObject({
  intro: text,
  scenes: z.array(CeritaSceneSchema).min(5).max(9),
  areas: z.array(z.strictObject({ id: z.string(), label: text, scene: z.number().int().min(0) })).min(1),
  world: z.record(z.string(), text),
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
      for (const area of copy.areas)
        if (!copy.scenes[area.scene]) ctx.addIssue({ code: "custom", message: `${locale}: invalid area scene` });
    }
  });

export type Cerita = z.infer<typeof CeritaSchema>;
export type CeritaLocale = z.infer<typeof CeritaLocaleSchema>;
