import { Analytics } from "@vercel/analytics/next";
import type { Metadata, Viewport } from "next";
import { NextIntlClientProvider } from "next-intl";
import { getLocale, getTranslations } from "next-intl/server";
import { Bricolage_Grotesque, Plus_Jakarta_Sans } from "next/font/google";
import { JsonLd } from "@/components/JsonLd";
import { Header } from "@/components/layout/Header";
import { routing } from "@/i18n/routing";
import { organizationJsonLd } from "@/lib/seo";
import { BRAND, SITE_URL } from "@/lib/site";
import "@/styles/globals.css";

const bricolage = Bricolage_Grotesque({
  subsets: ["latin"],
  axes: ["opsz"],
  variable: "--font-bricolage",
  display: "swap",
});

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
  display: "swap",
});

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("meta");
  return {
    metadataBase: new URL(SITE_URL),
    applicationName: t("siteName"),
    title: { default: t("home.title"), template: `%s | ${t("siteName")}` },
    description: t("home.description"),
    formatDetection: { telephone: false },
  };
}

export const viewport: Viewport = {
  themeColor: BRAND.navy,
  viewportFit: "cover",
};

export default async function LocaleLayout({ children }: LayoutProps<"/[locale]">) {
  const locale = await getLocale();
  const t = await getTranslations("nav");
  const tMeta = await getTranslations("meta");

  return (
    <html lang={locale} className={`${bricolage.variable} ${jakarta.variable}`}>
      <body>
        <NextIntlClientProvider>
          <a
            href="#main"
            className="fixed top-3 left-3 z-50 -translate-y-24 rounded-full bg-navy px-5 py-3 font-semibold text-white focus:translate-y-0"
          >
            {t("skip")}
          </a>
          <Header />
          {children}
        </NextIntlClientProvider>
        <JsonLd data={organizationJsonLd(locale, tMeta("home.description"))} />
        <Analytics />
      </body>
    </html>
  );
}
