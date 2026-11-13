import type { MetadataRoute } from "next";
import { routing, type Pathname } from "@/i18n/routing";
import { absoluteUrl } from "@/lib/seo";

const PAGES: { href: Exclude<Pathname, "/solusi/[slug]">; priority: number }[] = [
  { href: "/", priority: 1 },
  { href: "/solusi", priority: 0.8 },
  { href: "/artikel", priority: 0.8 },
  { href: "/tentang", priority: 0.6 },
  { href: "/kebijakan-privasi", priority: 0.2 },
];

// TODO (tahap 12 dan 14): add solution and article detail pages from content/.
export default function sitemap(): MetadataRoute.Sitemap {
  return PAGES.flatMap(({ href, priority }) =>
    routing.locales.map((locale) => ({
      url: absoluteUrl(locale, href),
      priority,
      alternates: {
        languages: Object.fromEntries(routing.locales.map((l) => [l, absoluteUrl(l, href)])),
      },
    })),
  );
}
