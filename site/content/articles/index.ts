import { readFileSync } from "node:fs";
import { join } from "node:path";
import type { MDXContent } from "mdx/types";
import { SOLUSI } from "@/content/solusi";
import type { Locale } from "@/i18n/routing";
import AdminEn, * as adminEn from "./en/admin.mdx";
import MoneyEn, * as moneyEn from "./en/money.mdx";
import PromoEn, * as promoEn from "./en/promo.mdx";
import ServiceEn, * as serviceEn from "./en/service.mdx";
import TeamEn, * as teamEn from "./en/team.mdx";
import AdminId, * as adminId from "./id/admin.mdx";
import MoneyId, * as moneyId from "./id/money.mdx";
import PromoId, * as promoId from "./id/promo.mdx";
import ServiceId, * as serviceId from "./id/service.mdx";
import TeamId, * as teamId from "./id/team.mdx";
import { articleMeta, type ArticleMeta } from "./schema";
import { ARTICLE_KEYS, ARTICLE_SLUGS, type ArticleKey } from "./slugs";

export type Article = {
  key: ArticleKey;
  locale: Locale;
  slug: string;
  Body: MDXContent;
  meta: ArticleMeta;
  /** Minutes at 200 words a minute, counted from the MDX source (prose only). */
  minutes: number;
};

const MODULES: Record<Locale, Record<ArticleKey, [MDXContent, object]>> = {
  id: {
    admin: [AdminId, adminId],
    service: [ServiceId, serviceId],
    team: [TeamId, teamId],
    promo: [PromoId, promoId],
    money: [MoneyId, moneyId],
  },
  en: {
    admin: [AdminEn, adminEn],
    service: [ServiceEn, serviceEn],
    team: [TeamEn, teamEn],
    promo: [PromoEn, promoEn],
    money: [MoneyEn, moneyEn],
  },
};

/** Words of the prose: the `meta` export, JSX tags and markdown marks left out. */
function minutesOf(locale: Locale, key: ArticleKey) {
  const source = readFileSync(join(process.cwd(), "content/articles", locale, `${key}.mdx`), "utf8");
  const prose = source
    .replace(/^export const meta = \{[\s\S]*?\n\};/m, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/[#*_>`-]/g, " ");
  const words = prose.split(/\s+/).filter((w) => /\p{L}/u.test(w)).length;
  return Math.max(1, Math.round(words / 200));
}

const slugs = new Set<string>(SOLUSI.map((s) => s.slug));

function load(locale: Locale, key: ArticleKey): Article {
  const [Body, mod] = MODULES[locale][key];
  const meta = articleMeta.parse((mod as { meta?: unknown }).meta);
  for (const s of meta.solutions) {
    if (!slugs.has(s)) throw new Error(`Article ${locale}/${key}: unknown solution "${s}"`);
  }
  return { key, locale, slug: ARTICLE_SLUGS[key][locale], Body, meta, minutes: minutesOf(locale, key) };
}

/** Every article in the rack's order. Newest first would reshuffle the Home rack, so the order is fixed. */
export function articles(locale: Locale): Article[] {
  return ARTICLE_KEYS.map((key) => load(locale, key));
}

export function article(locale: Locale, key: ArticleKey): Article {
  return load(locale, key);
}
