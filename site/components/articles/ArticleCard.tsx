import { ArrowRight, Clock } from "@phosphor-icons/react/ssr";
import { getTranslations } from "next-intl/server";
import type { Article } from "@/content/articles";
import { Link } from "@/i18n/navigation";
import { ArticleCover } from "./ArticleCover";

/**
 * An article in a list: cover, category, title, summary, reading time. The title's link covers the whole card;
 * `featured` lays it out wide (cover beside the text) for the first article on /artikel.
 */
export async function ArticleCard({
  article,
  featured = false,
  headingLevel = 2,
}: {
  article: Article;
  featured?: boolean;
  headingLevel?: 2 | 3;
}) {
  const t = await getTranslations("pages.articles");
  const tHome = await getTranslations("home.articles");
  const H = headingLevel === 2 ? "h2" : "h3";
  return (
    <article className="article-card" data-featured={featured || undefined}>
      <ArticleCover k={article.key} size={featured ? "lg" : "md"} />
      <div className="article-card-text">
        <p className="article-cat">
          <span className="sr-only">{t("category")}: </span>
          {tHome(`${article.key}.category`)}
        </p>
        <H className="article-card-title">
          <Link href={{ pathname: "/artikel/[slug]", params: { slug: article.slug } }} className="article-card-link">
            {article.meta.title}
          </Link>
        </H>
        <p className="article-card-summary">{article.meta.summary}</p>
        <p className="article-card-meta">
          <Clock aria-hidden weight="bold" className="size-4" />
          {t("minutes", { n: article.minutes })}
          <span className="article-card-read" aria-hidden>
            {t("read")}
            <ArrowRight weight="bold" className="size-4" />
          </span>
        </p>
      </div>
    </article>
  );
}
