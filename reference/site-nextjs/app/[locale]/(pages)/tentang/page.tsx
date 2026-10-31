import type { Metadata } from "next";
import { getLocale, getTranslations } from "next-intl/server";
import { PagePlaceholder } from "@/components/PagePlaceholder";
import { pageMetadata } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("meta.about");
  return pageMetadata({
    locale: await getLocale(),
    href: "/tentang",
    title: t("title"),
    description: t("description"),
  });
}

export default async function AboutPage() {
  const t = await getTranslations("pages.about");
  return <PagePlaceholder title={t("title")} />;
}
