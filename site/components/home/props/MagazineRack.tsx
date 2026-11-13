import { ArrowRight, BookOpenText } from "@phosphor-icons/react/ssr";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";

const ARTICLES = ["admin", "service", "team"] as const;

/**
 * Beat 7 · Artikel (tahap 7): the heading on the wooden sign above the lobby's rack (K7), the three starter articles
 * on the open books of its top tier (category and title on the left page, "Baca artikel" on the right), "Lihat semua
 * artikel" on the open book at the bottom tier's left (the truck goes on left from there). The links go to /artikel
 * until the articles exist (tahap 14). Real HTML rendered on the server; the world places each block on its book
 * (anchors "rack-sign", "article-0..2", "rack-all") and shows it at the K7 hold.
 */
export async function MagazineRack() {
  const t = await getTranslations("home.articles");
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
                {/* (no numbers: on 9:16 the camera reads the books right to left) */}
                <BookOpenText aria-hidden weight="duotone" className="book-icon" />
                <Link href="/artikel" className="book-link">
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
        <Link href="/artikel" className="btn btn-line text-navy">
          <span>{t("all")}</span>
          <ArrowRight aria-hidden className="size-[18px]" />
        </Link>
      </div>
    </>
  );
}
