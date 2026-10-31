import type { Metadata } from "next";
import { getLocale, getTranslations } from "next-intl/server";
import { PagePlaceholder } from "@/components/PagePlaceholder";
import { pageMetadata } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("meta.portfolio");
  return pageMetadata({
    locale: await getLocale(),
    href: "/portofolio",
    title: t("title"),
    description: t("description"),
  });
}

export default async function PortfolioPage() {
  const t = await getTranslations("pages.portfolio");
  return <PagePlaceholder title={t("title")} />;
}
