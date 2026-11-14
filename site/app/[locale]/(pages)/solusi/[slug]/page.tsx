import type { Metadata } from "next";
import { getLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { SolutionDetail } from "@/components/solusi/detail/SolutionDetail";
import { catalogCopy } from "@/content/solusi/catalog";
import { SOLUSI } from "@/content/solusi";
import type { SolusiLocale } from "@/content/solusi/schema";
import { solutionDetailMetadata } from "@/lib/seo";

export function generateStaticParams() {
  return SOLUSI.map((solution) => ({ slug: solution.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const locale = (await getLocale()) as SolusiLocale;
  const solution = SOLUSI.find((item) => item.slug === slug);
  if (!solution) return {};
  const copy = locale === "en" && solution.en ? solution.en : solution.id;
  const catalog = catalogCopy(solution, locale);
  return solutionDetailMetadata({
    locale,
    slug,
    title: `${copy.title} | Kreatekno Solusi`,
    description: copy.answer || catalog.summary,
  });
}

export default async function SolutionPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const locale = (await getLocale()) as SolusiLocale;
  const solution = SOLUSI.find((item) => item.slug === slug);
  if (!solution) notFound();
  return <SolutionDetail solution={solution} locale={locale} />;
}
