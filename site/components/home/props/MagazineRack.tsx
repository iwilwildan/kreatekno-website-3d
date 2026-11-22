import { ArrowRight } from "@phosphor-icons/react/ssr";
import { getLocale, getTranslations } from "next-intl/server";
import { ARTICLE_SLUGS } from "@/content/articles/slugs";
import { Link } from "@/i18n/navigation";
import { BookArt, RackAllArt } from "./RackArt";

const ARTICLES = ["admin", "service", "team", "promo", "money"] as const;

/**
 * Beat 7 · Artikel (tahap 7): the heading on the wooden sign above the lobby's rack (K7), the five starter articles
 * on its open books, left to right (the top tier's three, the bottom tier's left two; issue #33), category and title
 * on the left page, its picture and "Baca artikel" on the right; "Lihat semua artikel" under the five pictures as a
 * fan of small cards, on the open book at the bottom tier's right (pictures: RackArt).
 * Each book links to its article (tahap 14C), "Lihat semua artikel" to /artikel. Real HTML rendered on the server; the world places
 * each block on its book (anchors "rack-sign", "article-0..4", "rack-all") and shows it at the K7 hold.
 */
export async function MagazineRack() {
  const t = await getTranslations("home.articles");
  const locale = await getLocale();
  return (
    <>
      <div
        data-anchor
        data-landscape="rack-sign"
        data-portrait="rack-sign"
        data-fade
        className="prop-copy lobby-copy rack-sign"
        suppressHydrationWarning
      >
        <h2 id="h-artikel">{t("title")}</h2>
      </div>
      <ul className="lobby-list article-list" aria-labelledby="h-artikel">
        {ARTICLES.map((k, i) => (
          <li
            key={k}
            data-anchor
            data-landscape={`article-${i}`}
            data-portrait={`article-${i}`}
            data-fade
            data-book={i}
            className="prop-copy lobby-copy book"
            suppressHydrationWarning
          >
            <article className="book-in">
              <div className="book-left">
                <p className="book-cat">
                  <span className="sr-only">{t("category")} </span>
                  {t(`${k}.category`)}
                </p>
                <h3 className="book-title">{t(`${k}.title`)}</h3>
              </div>
              <div className="book-right">
                <BookArt k={k} />
                <Link
                  href={{ pathname: "/artikel/[slug]", params: { slug: ARTICLE_SLUGS[k][locale] } }}
                  className="book-link"
                >
                  <span>{t("read")}</span>
                  <span className="sr-only">: {t(`${k}.title`)}</span>
                  <ArrowRight aria-hidden weight="bold" className="book-arrow" />
                </Link>
              </div>
            </article>
          </li>
        ))}
      </ul>
      <div
        data-anchor
        data-landscape="rack-all"
        data-portrait="rack-all"
        data-fade
        className="prop-copy lobby-copy book rack-all"
        suppressHydrationWarning
      >
        <RackAllArt keys={ARTICLES} />
        <Link href="/artikel" className="btn btn-line text-navy">
          <span>{t("all")}</span>
          <ArrowRight aria-hidden className="size-[18px]" />
        </Link>
      </div>
    </>
  );
}
