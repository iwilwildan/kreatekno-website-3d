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

// FAQPage JSON-LD comes back with the FAQ beat (9a): Google only accepts it when the questions are visible.
export default async function HomePage() {
  const t = await getTranslations("home");
  const tPages = await getTranslations("pages");

  // Targets of the "Layanan" and "Cara kerja" menu links until those beats exist.
  const soon = [
    { id: "layanan", title: t("services.title") },
    { id: "cara-kerja", title: t("journey.title") },
  ];

  return (
    <>
      <main id="main">
        <HomeStage />
        {soon.map(({ id, title }) => (
          <section
            key={id}
            id={id}
            className="mx-auto max-w-(--container-site) scroll-mt-[calc(var(--nav-top)+var(--nav-h)+16px)] px-6 py-20"
          >
            <h2 className="text-[clamp(1.75rem,4vw,3rem)] text-navy">{title}</h2>
            <p className="mt-3 text-lg text-muted">{tPages("soon")}</p>
          </section>
        ))}
      </main>
      {/* Replaced by the footer on the night road (beat 16). */}
      <Footer />
    </>
  );
}
