import type { Metadata } from "next";
import { getLocale, getTranslations } from "next-intl/server";
import { SolusiPage } from "@/components/solusi/SolusiPage";
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
  return <SolusiPage />;
}
