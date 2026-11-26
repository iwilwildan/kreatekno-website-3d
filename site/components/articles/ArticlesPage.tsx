import { JetBrains_Mono } from "next/font/google";
import { getLocale, getTranslations } from "next-intl/server";
import { JsonLd } from "@/components/JsonLd";
import { WhatsAppButton } from "@/components/layout/WhatsAppButton";
import { articles } from "@/content/articles";
import { absoluteUrl, articleUrl, breadcrumbJsonLd } from "@/lib/seo";
import { coverOf } from "./ArticleCover";
import { PustakaPage, type ShelfBook } from "./PustakaPage";
import "./articles.css";
import "./pustaka.css";

const mono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-mono", display: "swap" });

/**
 * /artikel as the Kreatekno library (Pustaka, docs/plans/artikel/PLAN-PUSTAKA.md): a librarian's desk in the hero,
 * the articles as books on one shelf, "Tanya pustakawan" (#tanya), then the consultation band. Every text is
 * rendered here or by the client page during prerender, so the page reads without JavaScript or WebGL.
 */
export async function ArticlesPage() {
  const locale = await getLocale();
  const t = await getTranslations("pages.articles");
  const tHome = await getTranslations("home.articles");
  const tLegal = await getTranslations("legal");
  const list = articles(locale);
  const books: ShelfBook[] = list.map((a) => ({
    key: a.key,
    slug: a.slug,
    title: a.meta.title,
    summary: a.meta.summary,
    keywords: a.meta.keywords,
    category: tHome(`${a.key}.category`),
    minutes: a.minutes,
    cover: coverOf(a.key),
  }));

  return (
    <div className={mono.variable}>
      <PustakaPage books={books}>
        <section className="articles-band" aria-labelledby="articles-cta">
          <div className="articles-inner articles-band-in">
            <div>
              <h2 id="articles-cta" className="articles-h2">
                {t("cta.title")}
              </h2>
              <p>{t("cta.body")}</p>
            </div>
            <WhatsAppButton section="artikel-daftar" />
          </div>
        </section>
      </PustakaPage>

      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          name: t("title"),
          url: absoluteUrl(locale, "/artikel"),
          inLanguage: locale === "id" ? "id-ID" : "en-US",
          mainEntity: {
            "@type": "ItemList",
            itemListElement: list.map((a, i) => ({
              "@type": "ListItem",
              position: i + 1,
              url: articleUrl(locale, a.key),
              name: a.meta.title,
            })),
          },
        }}
      />
      <JsonLd
        data={breadcrumbJsonLd([
          { name: tLegal("home"), url: absoluteUrl(locale, "/") },
          { name: t("title"), url: absoluteUrl(locale, "/artikel") },
        ])}
      />
    </div>
  );
}
