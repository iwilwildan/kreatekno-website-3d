import type { Metadata } from "next";
import { getLocale, getTranslations } from "next-intl/server";
import { JsonLd } from "@/components/JsonLd";
import { HomeStory } from "@/components/story/HomeStory";
import { pageMetadata } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("meta.home");
  return pageMetadata({ locale: await getLocale(), href: "/", title: t("title"), description: t("description") });
}

export default async function HomePage() {
  const t = await getTranslations("home.faq");
  const faq = t.raw("items") as { q: string; a: string }[];

  return (
    <>
      <HomeStory />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: faq.map(({ q, a }) => ({
            "@type": "Question",
            name: q,
            acceptedAnswer: { "@type": "Answer", text: a },
          })),
        }}
      />
    </>
  );
}
