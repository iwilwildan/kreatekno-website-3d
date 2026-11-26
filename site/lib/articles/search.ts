import type { ArticleKey } from "../../content/articles/slugs";

/** What the library card searches: one article's words, in the page's language. */
export type SearchableBook = {
  key: ArticleKey;
  title: string;
  summary: string;
  category: string;
  keywords: readonly string[];
};

export type BookQuery = { term?: string; topic?: ArticleKey | "" };

/** Lower case, accents dropped, anything that is not a letter or digit becomes a space. */
export function normalize(text: string) {
  return text
    .normalize("NFD")
    .replace(/\p{M}/gu, "")
    .toLowerCase()
    .replace(/[^\p{L}\p{N}]+/gu, " ")
    .trim();
}

const words = (text: string) => normalize(text).split(" ").filter(Boolean);

/**
 * Every word of the question must start a word of the book (title, summary, category or keywords), in any order:
 * "chat pembeli" finds the chat article, "beli" alone does not match "pembeli". The topic is one book (each
 * starter article has its own category). Books keep the shelf order. An empty question with no topic is all books.
 */
export function searchBooks<T extends SearchableBook>(books: readonly T[], query: BookQuery = {}) {
  const asked = words(query.term ?? "");
  const items = books.filter((book) => {
    if (query.topic && book.key !== query.topic) return false;
    if (!asked.length) return true;
    const own = words([book.title, book.summary, book.category, ...book.keywords].join(" "));
    return asked.every((word) => own.some((w) => w.startsWith(word)));
  });
  return { items, total: items.length };
}
