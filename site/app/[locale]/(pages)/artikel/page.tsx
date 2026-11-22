import type { Metadata } from "next";
import { getLocale, getTranslations } from "next-intl/server";
import { ArticlesPage } from "@/components/articles/ArticlesPage";
import { pageMetadata } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("meta.articles");
  return pageMetadata({
    locale: await getLocale(),
    href: "/artikel",
    title: t("title"),
    description: t("description"),
  });
}

export default function Page() {
  return <ArticlesPage />;
}
