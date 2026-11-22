import type { Metadata } from "next";
import { getLocale, getTranslations } from "next-intl/server";
import { AboutPage } from "@/components/about/AboutPage";
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

export default function Page() {
  return <AboutPage />;
}
