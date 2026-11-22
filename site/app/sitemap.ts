import type { MetadataRoute } from "next";
import { articles } from "@/content/articles";
import { privacyPolicy } from "@/content/legal";
import { SOLUSI } from "@/content/solusi";
import { routing } from "@/i18n/routing";
import { absoluteUrl, articleUrl, solutionUrl, type StaticPathname } from "@/lib/seo";

type Page = { href: StaticPathname; priority: number };

const PAGES = (
  [
    { href: "/", priority: 1 },
    { href: "/solusi", priority: 0.8 },
    { href: "/artikel", priority: 0.8 },
    { href: "/tentang", priority: 0.6 },
    { href: "/kebijakan-privasi", priority: 0.2 },
  ] satisfies Page[] as Page[]
).filter(
  // A draft policy is noindex (content/legal/schema.ts), so it stays out of the sitemap until it is final.
  ({ href }) => href !== "/kebijakan-privasi" || privacyPolicy("id").meta.status === "final",
);

export default function sitemap(): MetadataRoute.Sitemap {
  const pages = PAGES.flatMap(({ href, priority }) =>
    routing.locales.map((locale) => ({
      url: absoluteUrl(locale, href),
      priority,
      alternates: {
        languages: Object.fromEntries(routing.locales.map((l) => [l, absoluteUrl(l, href)])),
      },
    })),
  );
  const solutions = SOLUSI.flatMap(({ slug, updated }) =>
    routing.locales.map((locale) => ({
      url: solutionUrl(locale, slug),
      lastModified: updated,
      priority: 0.6,
      alternates: {
        languages: Object.fromEntries(routing.locales.map((l) => [l, solutionUrl(l, slug)])),
      },
    })),
  );
  const posts = articles("id").flatMap(({ key, meta }) =>
    routing.locales.map((locale) => ({
      url: articleUrl(locale, key),
      lastModified: meta.updated,
      priority: 0.6,
      alternates: {
        languages: Object.fromEntries(routing.locales.map((l) => [l, articleUrl(l, key)])),
      },
    })),
  );
  return [...pages, ...posts, ...solutions];
}
