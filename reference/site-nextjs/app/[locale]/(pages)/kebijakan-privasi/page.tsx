import type { Metadata } from "next";
import { getLocale, getTranslations } from "next-intl/server";
import { PagePlaceholder } from "@/components/PagePlaceholder";
import { pageMetadata } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("meta.privacy");
  return pageMetadata({
    locale: await getLocale(),
    href: "/kebijakan-privasi",
    title: t("title"),
    description: t("description"),
  });
}

export default async function PrivacyPage() {
  const t = await getTranslations("pages.privacy");
  return <PagePlaceholder title={t("title")} />;
}
