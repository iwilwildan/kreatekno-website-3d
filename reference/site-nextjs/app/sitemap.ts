import type { MetadataRoute } from "next";
import { routing, type Pathname } from "@/i18n/routing";
import { absoluteUrl } from "@/lib/seo";

const PAGES: { href: Pathname; priority: number }[] = [
  { href: "/", priority: 1 },
  { href: "/portofolio", priority: 0.8 },
  { href: "/artikel", priority: 0.8 },
  { href: "/tentang", priority: 0.6 },
  { href: "/kebijakan-privasi", priority: 0.2 },
];

// TODO (M7): add article and portfolio detail pages from content/.
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
