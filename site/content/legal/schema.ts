import { z } from "zod";

/**
 * `export const meta` of a legal page MDX file (content/legal/{id,en}/*.mdx). Parsed when the module loads, so a
 * wrong or missing field fails the build.
 */
export const legalMeta = z.object({
  title: z.string().min(1),
  lead: z.string().min(1),
  /** Short points shown in the summary card above the full text. */
  summary: z.array(z.string().min(1)).min(3).max(5),
  /** Every `##` heading of the file, in order. The table of contents links to them (ids from `slugify`). */
  sections: z.array(z.string().min(1)).min(3),
  effective: z.iso.date(),
  updated: z.iso.date(),
  /** `draft`: a notice is shown and the page is kept out of search engines until Kreatekno has reviewed it. */
  status: z.enum(["draft", "final"]),
});

export type LegalMeta = z.infer<typeof legalMeta>;
