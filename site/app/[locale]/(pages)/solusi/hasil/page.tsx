import type { Metadata } from "next";
import { getLocale, getTranslations } from "next-intl/server";
import { HasilKartu } from "@/components/solusi/HasilKartu";
import { pageMetadata } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("meta.solutionsResults");
  return {
    ...pageMetadata({
      locale: await getLocale(),
      href: "/solusi/hasil",
      title: t("title"),
      description: t("description"),
    }),
    robots: { index: false, follow: true },
  };
}

export default function ResultsPage() {
  return <HasilKartu />;
}
