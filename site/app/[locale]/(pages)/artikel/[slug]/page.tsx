import type { Metadata } from "next";
import { getLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { ArticlePage } from "@/components/articles/ArticlePage";
import { article } from "@/content/articles";
import { ARTICLE_KEYS, ARTICLE_SLUGS, articleKeyOf } from "@/content/articles/slugs";
import type { Locale } from "@/i18n/routing";
import { articleMetadata } from "@/lib/seo";

// Each language has its own slugs (content/articles/slugs.ts); a slug from the other language is a 404.
export async function generateStaticParams({ params }: { params: { locale: string } }) {
  const locale = params.locale as Locale;
  return ARTICLE_KEYS.map((key) => ({ slug: ARTICLE_SLUGS[key][locale] }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const locale = await getLocale();
  const key = articleKeyOf(locale, slug);
  if (!key) return {};
  const { meta } = article(locale, key);
  return articleMetadata({
    locale,
    key,
    title: meta.title,
    description: meta.summary,
    published: meta.published,
    updated: meta.updated,
  });
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const locale = await getLocale();
  const key = articleKeyOf(locale, slug);
  if (!key) notFound();
  return <ArticlePage article={article(locale, key)} />;
}
