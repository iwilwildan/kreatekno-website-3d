import type { Metadata } from "next";
import { getLocale, getTranslations } from "next-intl/server";
import { HomeStage } from "@/components/home/HomeStage";
import { Footer } from "@/components/layout/Footer";
import { pageMetadata } from "@/lib/seo";

export const ensureStatic = "navigation";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("meta.home");
  return pageMetadata({ locale: await getLocale(), href: "/", title: t("title"), description: t("description") });
}

// FAQPage JSON-LD is in HomeStage with the FAQ beat (K8, tahap 7): the questions are visible on the sticky notes.
export default async function HomePage() {
  return (
    <>
      <main id="main">
        <HomeStage />
      </main>
      {/* After the night road of beat 16 (tahap 10): the take ends on the epilogue fading into this colour. */}
      <Footer />
    </>
  );
}
