import { BOOK_ART } from "@/components/home/props/RackArt";
import type { ArticleKey } from "@/content/articles/slugs";

/**
 * An article's cover: the picture from its book on the Home rack (RackArt) on a cream page inside the book's cover
 * colour, so the rack and the article page look like the same book. Decorative.
 */
export function ArticleCover({ k, size = "md" }: { k: ArticleKey; size?: "md" | "lg" }) {
  const { draw: Draw, cover } = BOOK_ART[k];
  return (
    <div className="article-cover" data-size={size} style={{ "--cover": cover } as React.CSSProperties} aria-hidden>
      <div className="article-cover-page">
        <svg
          viewBox="0 0 120 100"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
          focusable="false"
          className="article-cover-art"
        >
          <Draw />
        </svg>
      </div>
    </div>
  );
}

/** The book's cover colour, for tinting an article's hero and bands. */
export function coverOf(k: ArticleKey): string {
  return BOOK_ART[k].cover;
}
