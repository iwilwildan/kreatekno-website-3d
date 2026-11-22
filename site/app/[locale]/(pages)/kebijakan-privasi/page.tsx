import type { Metadata } from "next";
import { getLocale, getTranslations } from "next-intl/server";
import { LegalPage } from "@/components/legal/LegalPage";
import { privacyPolicy } from "@/content/legal";
import { pageMetadata } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("meta.privacy");
  const locale = await getLocale();
  const { meta } = privacyPolicy(locale);
  return {
    ...pageMetadata({ locale, href: "/kebijakan-privasi", title: t("title"), description: t("description") }),
    // A draft stays out of search results until Kreatekno has reviewed it (content/legal/schema.ts `status`).
    ...(meta.status === "draft" ? { robots: { index: false, follow: true } } : {}),
  };
}

export default async function PrivacyPage() {
  const t = await getTranslations("meta.privacy");
  const locale = await getLocale();
  return <LegalPage doc={privacyPolicy(locale)} href="/kebijakan-privasi" description={t("description")} />;
}
