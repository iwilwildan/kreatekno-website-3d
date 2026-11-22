import { ArrowRight, Clock } from "@phosphor-icons/react/ssr";
import { getTranslations } from "next-intl/server";
import { JsonLd } from "@/components/JsonLd";
import { Prose } from "@/components/mdx/Prose";
import { articles, type Article } from "@/content/articles";
import { SOLUSI } from "@/content/solusi";
import { catalogCopy } from "@/content/solusi/catalog";
import { Link } from "@/i18n/navigation";
import { absoluteUrl, articleUrl, blogPostingJsonLd, breadcrumbJsonLd } from "@/lib/seo";
import { ArticleCard } from "./ArticleCard";
import { ArticleCover, coverOf } from "./ArticleCover";
import { ReadingProgress } from "./ReadingProgress";
import "./articles.css";

/**
 * One article (/artikel/[slug]): reading progress, a hero tinted with the book's cover colour, the MDX text with a
 * drop cap, pull quotes and full-bleed bands (the Maglr reference), then the author line, related solutions and two
 * more articles.
 */
export async function ArticlePage({ article }: { article: Article }) {
  const { key, locale, Body, meta, minutes } = article;
  const t = await getTranslations("pages.articles");
  const tHome = await getTranslations("home.articles");
  const tLegal = await getTranslations("legal");
  const category = tHome(`${key}.category`);
  const date = new Intl.DateTimeFormat(locale === "id" ? "id-ID" : "en-GB", {
    dateStyle: "long",
    timeZone: "UTC",
  }).format(new Date(`${meta.published}T00:00:00Z`));

  const all = articles(locale);
  const at = all.findIndex((a) => a.key === key);
  const next = [all[(at + 1) % all.length], all[(at + 2) % all.length]];
  const related = meta.solutions
    .map((slug) => SOLUSI.find((s) => s.slug === slug))
    .filter((s) => s !== undefined)
    .map((s) => ({ slug: s.slug, ...catalogCopy(s, locale) }));
  const url = articleUrl(locale, key);

  return (
    <article className="article" style={{ "--cover": coverOf(key) } as React.CSSProperties}>
      <ReadingProgress targetId="article-body" />
      <header className="article-hero">
        <div className="articles-inner article-hero-grid">
          <div>
            <nav aria-label={tLegal("breadcrumb")} className="article-crumbs">
              <Link href="/">{tLegal("home")}</Link>
              <span aria-hidden>/</span>
              <Link href="/artikel">{t("title")}</Link>
            </nav>
            <p className="article-cat">
              <span className="sr-only">{t("category")}: </span>
              {category}
            </p>
            <h1 className="article-title">{meta.title}</h1>
            <p className="article-summary">{meta.summary}</p>
            <p className="article-meta">
              <span>{t("by")}</span>
              <span aria-hidden>·</span>
              <span>
                <span className="sr-only">{t("published")} </span>
                <time dateTime={meta.published}>{date}</time>
              </span>
              <span aria-hidden>·</span>
              <span className="article-meta-time">
                <Clock aria-hidden weight="bold" className="size-4" />
                {t("minutes", { n: minutes })}
              </span>
            </p>
          </div>
          <ArticleCover k={key} size="lg" />
        </div>
      </header>

      <div id="article-body" className="article-body-wrap">
        <Prose className="article-body">
          <Body />
        </Prose>
        <p className="article-author">{t("author")}</p>
      </div>

      <section className="article-related" aria-labelledby="article-related">
        <div className="articles-inner">
          <h2 id="article-related" className="articles-h2">
            {t("related")}
          </h2>
          <p className="article-related-body">{t("relatedBody")}</p>
          <ul className="article-related-list">
            {related.map((s) => (
              <li key={s.slug}>
                <Link href={{ pathname: "/solusi/[slug]", params: { slug: s.slug } }} className="article-solution">
                  <span className="article-solution-title">{s.title}</span>
                  <span className="article-solution-summary">{s.summary}</span>
                  <span className="article-solution-go" aria-hidden>
                    {t("relatedLink")}
                    <ArrowRight weight="bold" className="size-4" />
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="articles-inner article-next" aria-labelledby="article-next">
        <h2 id="article-next" className="articles-h2">
          {t("next")}
        </h2>
        <ul className="articles-grid is-two">
          {next.map((a) => (
            <li key={a.key}>
              <ArticleCard article={a} headingLevel={3} />
            </li>
          ))}
        </ul>
        <Link href="/artikel" className="mt-8 btn btn-line text-navy">
          {t("all")}
          <ArrowRight aria-hidden weight="bold" className="size-[18px]" />
        </Link>
      </section>

      <JsonLd
        data={blogPostingJsonLd({
          locale,
          key,
          title: meta.title,
          description: meta.summary,
          published: meta.published,
          updated: meta.updated,
          section: category,
        })}
      />
      <JsonLd
        data={breadcrumbJsonLd([
          { name: tLegal("home"), url: absoluteUrl(locale, "/") },
          { name: t("title"), url: absoluteUrl(locale, "/artikel") },
          { name: meta.title, url },
        ])}
      />
    </article>
  );
}
