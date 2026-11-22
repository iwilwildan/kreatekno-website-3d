import type { Locale } from "@/i18n/routing";

/**
 * Article keys (the Home rack's books, components/home/props/MagazineRack.tsx) and their URL slug per language.
 * Plain data with no MDX, so client components (LangSwitch) can import it.
 */
export const ARTICLE_SLUGS = {
  admin: { id: "pekerjaan-admin-yang-bisa-dikerjakan-ai", en: "admin-tasks-ai-can-do" },
  service: { id: "asisten-ai-untuk-balas-chat-pembeli", en: "ai-assistant-for-customer-chats" },
  team: { id: "melatih-staf-bekerja-bareng-ai", en: "training-staff-to-work-with-ai" },
  promo: { id: "ide-konten-promosi-dengan-ai", en: "weekly-promo-ideas-with-ai" },
  money: { id: "catat-penjualan-harian-otomatis", en: "record-daily-sales-automatically" },
} as const satisfies Record<string, Record<Locale, string>>;

export type ArticleKey = keyof typeof ARTICLE_SLUGS;
export const ARTICLE_KEYS = Object.keys(ARTICLE_SLUGS) as ArticleKey[];

export function articleKeyOf(locale: Locale, slug: string): ArticleKey | undefined {
  return ARTICLE_KEYS.find((key) => ARTICLE_SLUGS[key][locale] === slug);
}
