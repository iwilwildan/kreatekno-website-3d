"use client";

import { ArrowRight, BookOpenText, Clock, MagnifyingGlass, Sparkle, X } from "@phosphor-icons/react/ssr";
import { useTranslations } from "next-intl";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { RakTrack } from "@/components/solusi/RakTrack";
import type { ArticleKey } from "@/content/articles/slugs";
import { Link } from "@/i18n/navigation";
import { searchBooks } from "@/lib/articles/search";
import type { PustakaWorld } from "@/world/pustaka";
import { ArticleCover } from "./ArticleCover";

/** One article as a book on the shelf: plain data from the server page. */
export type ShelfBook = {
  key: ArticleKey;
  slug: string;
  title: string;
  summary: string;
  keywords: readonly string[];
  category: string;
  minutes: number;
  /** The Home rack book's cover colour (RackArt). */
  cover: string;
};

type Mode = "shop" | "tanya";

const modeFromHash = (): Mode => (window.location.hash === "#tanya" ? "tanya" : "shop");

/**
 * The library page: hero with the librarian's desk, the shelf of books, the band passed in as children, and
 * "Tanya pustakawan" as a hash mode like Cari on /solusi. The 3D desk with Andi (world/pustaka, P3) draws behind
 * the hero once loaded; until then, without WebGL or after a lost context the CSS desk shows. The 3D books (P4)
 * will draw behind this same markup.
 */
export function PustakaPage({ books, children }: { books: ShelfBook[]; children: ReactNode }) {
  const t = useTranslations("pages.articles");
  const tl = useTranslations("pages.articles.library");
  const [mode, setMode] = useState<Mode>("shop");
  const [served, setServed] = useState(false);
  const [worldReady, setWorldReady] = useState(false);
  const hero = useRef<HTMLElement>(null);
  const world = useRef<PustakaWorld | null>(null);

  useEffect(() => {
    const sync = () => {
      const next = modeFromHash();
      setMode(next);
      if (next !== "tanya") setServed(false);
    };
    sync();
    window.addEventListener("hashchange", sync);
    window.addEventListener("popstate", sync);
    return () => {
      window.removeEventListener("hashchange", sync);
      window.removeEventListener("popstate", sync);
    };
  }, []);

  useEffect(() => {
    let cancelled = false;
    let mounted: PustakaWorld | null = null;
    const stage = hero.current;
    if (!stage) return;
    const lose = () => {
      mounted?.dispose();
      mounted = world.current = null;
      setWorldReady(false);
    };
    import("@/world/pustaka").then(({ mountPustakaWorld }) => {
      if (cancelled || !hero.current) return;
      const style = getComputedStyle(stage);
      const font = style.getPropertyValue("--font-mono").trim() || "monospace";
      const display = style.getPropertyValue("--font-display").trim() || "system-ui, sans-serif";
      mounted = mountPustakaWorld(stage, {
        sign: { title: "KREATEKNO", sub: tl("sign") },
        font,
        display,
        onReady: () => !cancelled && setWorldReady(true),
        onLost: lose,
      });
      world.current = mounted;
      mounted?.setMode(modeFromHash());
    });
    return () => {
      cancelled = true;
      mounted?.dispose();
      world.current = null;
    };
    // The world is mounted once; the mode reaches it through setMode below.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    world.current?.setMode(mode);
  }, [mode]);

  const openTanya = () => {
    window.scrollTo(0, 0);
    window.location.hash = "tanya";
  };
  const closeTanya = () => {
    history.pushState(null, "", window.location.pathname + window.location.search);
    window.dispatchEvent(new PopStateEvent("popstate"));
    window.scrollTo(0, 0);
  };

  return (
    <div
      className={`pustaka-page mode-${mode} ${mode !== "shop" ? "focus" : ""} ${served ? "served" : ""} ${worldReady ? "pustaka-world-ready" : ""}`}
    >
      <section ref={hero} className="pustaka-hero" aria-labelledby="pustaka-h">
        <div className="pustaka-copy">
          <p className="pustaka-kicker">{t("kicker")}</p>
          <h1 id="pustaka-h">{t("title")}</h1>
          <p className="pustaka-lead">{t("lead")}</p>
          <div className="pustaka-actions">
            <button type="button" className="pustaka-button is-primary" onClick={openTanya}>
              <MagnifyingGlass aria-hidden weight="bold" /> {tl("ask")}
            </button>
            <a className="pustaka-button is-paper" href="#rak">
              <BookOpenText aria-hidden weight="bold" /> {tl("shelf")}
            </a>
          </div>
        </div>
        <div className="pustaka-stage no3d" role="img" aria-label={`${tl("stage")}. ${tl("librarian")}.`}>
          <div className="library-sign">
            KREATEKNO <span>{tl("sign")}</span>
          </div>
          <div className="library-shelves" aria-hidden="true">
            {Array.from({ length: 2 }, (_, row) => (
              <div key={row}>
                {Array.from({ length: 11 }, (_, i) => (
                  <i key={i} />
                ))}
              </div>
            ))}
          </div>
          <div className="librarian-css" aria-hidden="true">
            <span />
            <b />
          </div>
          <div className="library-desk" aria-hidden="true">
            <i />
            <span>KREATEKNO</span>
          </div>
        </div>
      </section>

      <Shelf books={books} />

      {children}

      {mode === "tanya" && <TanyaPanel books={books} onClose={closeTanya} onServed={setServed} world={world} />}
    </div>
  );
}

/** The shelf: one row of books, as the etalase on /solusi (RakTrack for swipe, arrows and drag). */
function Shelf({ books }: { books: ShelfBook[] }) {
  const tl = useTranslations("pages.articles.library");
  return (
    <section className="rak-buku" id="rak" aria-labelledby="rak-h">
      <div className="room">
        <div className="counter">
          <h2 className="counter-h" id="rak-h">
            {tl("shelfTitle")}
          </h2>
          <div className="frame">
            <div className="tiers">
              <section className="tier" aria-labelledby="rak-all">
                <RakTrack previous={tl("previous")} next={tl("next")}>
                  {books.map((book) => (
                    <BookSlot key={book.key} book={book} />
                  ))}
                </RakTrack>
                <div className="plank">
                  <h3 id="rak-all">{tl("plank")}</h3>
                </div>
              </section>
            </div>
          </div>
        </div>
        <div className="plinth" />
      </div>
    </section>
  );
}

/**
 * One book, cover facing out: category, the rack picture, title, summary and reading time. `data-slot` and
 * `data-color` are for the 3D shelf pass (P4); until then CSS paints the book.
 */
function BookSlot({ book }: { book: ShelfBook }) {
  const t = useTranslations("pages.articles");
  return (
    <li className="slot" style={{ "--c": book.cover } as React.CSSProperties}>
      <Link
        className="buku-link"
        href={{ pathname: "/artikel/[slug]", params: { slug: book.slug } }}
        data-key={book.key}
      >
        <span className="buku" data-slot data-kind="article" data-color={book.cover}>
          <span className="buku-cat">
            <span className="sr-only">{t("category")}: </span>
            {book.category}
          </span>
          <span className="sampul">
            <span className="sampul-art">
              <ArticleCover k={book.key} />
            </span>
            <b className="ttl">{book.title}</b>
            <span className="sub">{book.summary}</span>
          </span>
          <span className="buku-time">
            <Clock aria-hidden weight="bold" />
            {t("minutes", { n: book.minutes })}
          </span>
        </span>
      </Link>
    </li>
  );
}

/**
 * "Tanya pustakawan": the library card, then the matching books (all books when nothing matches). With the 3D desk
 * Andi fetches them from the wall bookcase and the numbered tags over the books open a summary card; without it the
 * results are the list of cards.
 */
function TanyaPanel({
  books,
  onClose,
  onServed,
  world,
}: {
  books: ShelfBook[];
  onClose: () => void;
  onServed: (served: boolean) => void;
  world: React.RefObject<PustakaWorld | null>;
}) {
  const t = useTranslations("pages.articles");
  const tl = useTranslations("pages.articles.library");
  const tHome = useTranslations("home.articles");
  const [term, setTerm] = useState("");
  const [topic, setTopic] = useState<ArticleKey | "">("");
  const [asked, setAsked] = useState<{ term: string; topic: ArticleKey | "" } | null>(null);
  const [cardNo, setCardNo] = useState(1);
  const [termFocused, setTermFocused] = useState(false);
  const [selected, setSelected] = useState<number | null>(null);
  const heading = useRef<HTMLHeadingElement>(null);
  const input = useRef<HTMLInputElement>(null);
  const results = useRef<HTMLDivElement>(null);
  const closeRef = useRef(onClose);
  useEffect(() => {
    closeRef.current = onClose;
  }, [onClose]);

  const selectedRef = useRef<number | null>(null);
  useEffect(() => {
    selectedRef.current = selected;
  }, [selected]);

  // Once, when the panel opens: the heading takes focus (no keyboard pops up on phones). Escape closes an open
  // book summary first, then goes back to the shelf.
  useEffect(() => {
    heading.current?.focus();
    const close = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      if (selectedRef.current !== null) {
        setSelected(null);
        world.current?.selectBook(null);
      } else closeRef.current();
    };
    window.addEventListener("keydown", close);
    return () => window.removeEventListener("keydown", close);
  }, [world]);

  // the 3D desk: Andi leans in while you type; hovering or touching a book there selects it here
  useEffect(() => {
    world.current?.setAsking({ typing: Boolean(term), focused: termFocused, served: Boolean(asked) });
  }, [term, termFocused, asked, world]);
  useEffect(() => {
    const select = (event: Event) => setSelected((event as CustomEvent<number | null>).detail);
    window.addEventListener("pustaka-book-select", select);
    return () => window.removeEventListener("pustaka-book-select", select);
  }, []);

  // After each question, bring the result bar into view (on phones it sits below the card).
  useEffect(() => {
    if (!asked) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    results.current?.scrollIntoView({ block: "start", behavior: reduced ? "auto" : "smooth" });
  }, [asked]);

  const result = asked ? searchBooks(books, asked) : null;
  const shown = result ? (result.total ? result.items : books) : [];

  const again = () => {
    setAsked(null);
    setSelected(null);
    onServed(false);
    world.current?.askAgain();
    input.current?.focus();
  };
  const selectBook = (index: number | null) => {
    setSelected(index);
    world.current?.selectBook(index);
  };
  const selectedBook = selected === null ? null : shown[selected];

  return (
    <section className="focus-panel tanya-panel" aria-labelledby="tanya-h">
      <button type="button" className="panel-close" onClick={onClose} aria-label={tl("close")}>
        <X aria-hidden />
      </button>
      <div className="focus-heading">
        <p className="pustaka-kicker">{tl("eyebrow")}</p>
        <h2 id="tanya-h" ref={heading} tabIndex={-1}>
          {tl("title")}
        </h2>
        <p>{tl("body")}</p>
      </div>

      <search>
        <form
          className="kartu-pinjam"
          onSubmit={(event) => {
            event.preventDefault();
            const question = { term, topic };
            const found = searchBooks(books, question);
            const served = found.total ? found.items : books;
            setAsked(question);
            setSelected(null);
            setCardNo((n) => n + 1);
            onServed(true);
            world.current?.search(
              served.map((book) => ({ key: book.key, color: book.cover, category: book.category, title: book.title })),
              !found.total,
            );
          }}
        >
          <header>
            <b>{tl("cardLibrary")}</b>
            <span>{tl("cardLine", { name: "Andi" })}</span>
            <small>{tl("cardNo", { no: String(cardNo).padStart(4, "0") })}</small>
          </header>
          <label className={term ? "active" : ""}>
            <span>{tl("term")}</span>
            <input
              ref={input}
              type="search"
              value={term}
              onChange={(e) => setTerm(e.target.value)}
              onFocus={() => setTermFocused(true)}
              onBlur={() => setTermFocused(false)}
              placeholder={tl("termPlaceholder")}
              enterKeyHint="search"
            />
          </label>
          <label className={topic ? "active" : ""}>
            <span>{tl("topic")}</span>
            <select value={topic} onChange={(e) => setTopic(e.target.value as ArticleKey | "")}>
              <option value="">{tl("allTopics")}</option>
              {books.map((book) => (
                <option value={book.key} key={book.key}>
                  {tHome(`${book.key}.category`)}
                </option>
              ))}
            </select>
          </label>
          <button className="kartu-submit" type="submit">
            <MagnifyingGlass aria-hidden weight="bold" /> {tl("submit")}
          </button>
        </form>
      </search>

      <div className="tanya-status" role="status" aria-atomic="true">
        {result && (result.total ? tl("found", { count: result.total }) : `${tl("empty")}. ${tl("emptyBody")}`)}
      </div>

      {result && (
        <div className="tanya-results">
          <div className="result-bar" ref={results}>
            <div>
              <b>{result.total ? tl("found", { count: result.total }) : tl("empty")}</b>
              <span>{result.total ? tl("foundBody") : tl("emptyBody")}</span>
            </div>
            <button type="button" onClick={again}>
              {tl("again")}
            </button>
          </div>
          {!result.total && (
            <h3 className="tanya-all">
              <Sparkle aria-hidden /> {tl("allBooks")}
            </h3>
          )}
          <div className="buku-tags" aria-label={result.total ? tl("found", { count: result.total }) : tl("allBooks")}>
            {shown.map((book, index) => (
              <button
                type="button"
                className={selected === index ? "box-tag selected" : "box-tag"}
                data-book-tag={index}
                key={book.key}
                hidden
                aria-label={`${tl("bookLabel", { number: index + 1 })}: ${book.title}`}
                onPointerEnter={() => selectBook(index)}
                onFocus={() => selectBook(index)}
                onClick={() => selectBook(index)}
              >
                {index + 1}
              </button>
            ))}
          </div>
          <ol className="result-grid">
            {shown.map((book, index) => (
              <li className="result-card" key={book.key} style={{ "--c": book.cover } as React.CSSProperties}>
                <span className="result-number" aria-hidden>
                  {index + 1}
                </span>
                <p className="result-cat">
                  <span className="sr-only">{tl("bookLabel", { number: index + 1 })}. </span>
                  {book.category}
                </p>
                <h3>
                  <Link className="result-link" href={{ pathname: "/artikel/[slug]", params: { slug: book.slug } }}>
                    {book.title}
                  </Link>
                </h3>
                <p>{book.summary}</p>
                <p className="result-meta">
                  <Clock aria-hidden weight="bold" />
                  {t("minutes", { n: book.minutes })}
                  <span className="result-read" aria-hidden>
                    {t("read")} <ArrowRight />
                  </span>
                </p>
              </li>
            ))}
          </ol>
        </div>
      )}
      {selectedBook && (
        <aside className="box-summary buku-summary" data-book-summary role="dialog" aria-label={selectedBook.title}>
          <button
            type="button"
            className="box-summary-close"
            onClick={() => selectBook(null)}
            aria-label={tl("closeBook")}
          >
            <X aria-hidden />
          </button>
          <small>
            {tl("bookLabel", { number: (selected ?? 0) + 1 })} · {selectedBook.category}
          </small>
          <h3>{selectedBook.title}</h3>
          <p>{selectedBook.summary}</p>
          <p className="result-meta">
            <Clock aria-hidden weight="bold" />
            {t("minutes", { n: selectedBook.minutes })}
          </p>
          <Link href={{ pathname: "/artikel/[slug]", params: { slug: selectedBook.slug } }}>
            {t("read")} <ArrowRight aria-hidden />
          </Link>
        </aside>
      )}
    </section>
  );
}
