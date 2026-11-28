import { z } from "zod";

/**
 * `export const meta` of an article (content/articles/{id,en}/KEY.mdx). Parsed when the module loads, so a wrong
 * field fails the build. The slug, category label and cover come from the key (slugs.ts, the Home rack).
 */
export const articleMeta = z.object({
  title: z.string().min(1),
  // SEO copy v1 (28 Nov 2026): search-result title (" | Kreatekno" is added) and snippet. Platform names are allowed here only.
  seoTitle: z.string().min(1).optional(),
  seoDescription: z.string().min(40).max(170).optional(),
  /** One or two sentences under the title; also the meta description (≤ 170 characters). */
  summary: z.string().min(40).max(170),
  /**
   * Words a reader might type at the library card ("Tanya pustakawan", lib/articles/search.ts), in the article's
   * language. Never shown on the page, so they may name platforms people search for.
   */
  keywords: z.array(z.string().min(2)).min(4).max(16),
  published: z.iso.date(),
  updated: z.iso.date(),
  /** Solusi detail slugs (content/solusi) shown under "Solusi terkait". */
  solutions: z.array(z.string()).min(1).max(3),
});

export type ArticleMeta = z.infer<typeof articleMeta>;
