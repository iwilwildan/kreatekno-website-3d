import type { Metadata } from "next";
import { getLocale, getTranslations } from "next-intl/server";
import { PagePlaceholder } from "@/components/PagePlaceholder";
import { pageMetadata } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("meta.solutions");
  return pageMetadata({
    locale: await getLocale(),
    href: "/solusi",
    title: t("title"),
    description: t("description"),
  });
}

export default async function SolutionsPage() {
  const t = await getTranslations("pages.solutions");
  return <PagePlaceholder title={t("title")} />;
}
