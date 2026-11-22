import { getLocale, getTranslations } from "next-intl/server";
import { JsonLd } from "@/components/JsonLd";
import { WhatsAppButton } from "@/components/layout/WhatsAppButton";
import { articles } from "@/content/articles";
import { absoluteUrl, articleUrl, breadcrumbJsonLd } from "@/lib/seo";
import { ArticleCard } from "./ArticleCard";
import "./articles.css";

/**
 * /artikel: hero, the first article wide, the others in a grid, then a consultation band. No category filter yet:
 * each of the five starter articles has its own category, so a filter would only ever show one article.
 */
export async function ArticlesPage() {
  const locale = await getLocale();
  const t = await getTranslations("pages.articles");
  const tLegal = await getTranslations("legal");
  const list = articles(locale);
  const [first, ...rest] = list;

  return (
    <div className="articles">
      <header className="articles-hero">
        <div className="articles-inner">
          <p className="articles-kicker">{t("kicker")}</p>
          <h1 className="articles-title">{t("title")}</h1>
          <p className="articles-lead">{t("lead")}</p>
        </div>
      </header>

      <section className="articles-inner articles-featured" aria-label={t("featured")}>
        <ArticleCard article={first} featured />
      </section>

      <section className="articles-inner articles-more" aria-labelledby="articles-more">
        <h2 id="articles-more" className="articles-h2">
          {t("more")}
        </h2>
        <ul className="articles-grid">
          {rest.map((a) => (
            <li key={a.key}>
              <ArticleCard article={a} headingLevel={3} />
            </li>
          ))}
        </ul>
      </section>

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
