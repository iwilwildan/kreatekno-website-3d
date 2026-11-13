"use client";

import { ArrowRight, MagnifyingGlass, Shuffle, Sparkle, X } from "@phosphor-icons/react/ssr";
import { useLocale, useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState, type PointerEvent } from "react";
import { catalogCopy } from "@/content/solusi/catalog";
import { KARTU } from "@/content/solusi/kartu";
import { SOLUSI } from "@/content/solusi";
import type { App, Industri, Kartu, SolusiLocale, Tim } from "@/content/solusi/schema";
import { APPS, INDUSTRI, STATUS, TIM } from "@/content/solusi/taksonomi";
import { answersQuery } from "@/lib/solusi/url";
import { CARDS_PER_ROUND, pickRound, ROUNDS } from "@/lib/solusi/kartu";
import { searchPage, type SearchFilters } from "@/lib/solusi/search";
import type { SolusiWorld } from "@/world/solusi";
import { KontakModal } from "./KontakModal";
import { Etalase } from "./Etalase";

type Mode = "shop" | "cari" | "kartu";
type AnswerKind = "yes" | "no" | "solution";

const emptyFilters: SearchFilters = { term: "", industri: "", tim: "", app: "", status: "" };
const boxColor = (team: Tim) => TIM.find((item) => item.id === team)?.color || "#CDB8F8";
const worldItems = (items: typeof SOLUSI) =>
  items.map((item) => ({ id: item.slug, color: boxColor(item.tim[0]), status: item.status }));

function modeFromHash(): Mode {
  return window.location.hash === "#cari" ? "cari" : window.location.hash === "#kartu" ? "kartu" : "shop";
}

export function SolusiPage() {
  const locale = useLocale() as SolusiLocale;
  const t = useTranslations("pages.solutions");
  const [mode, setMode] = useState<Mode>("shop");
  const [searchOpen, setSearchOpen] = useState(false);
  const [filters, setFilters] = useState<SearchFilters>(emptyFilters);
  const [page, setPage] = useState(1);
  const [worldReady, setWorldReady] = useState(false);
  const hero = useRef<HTMLElement>(null);
  const world = useRef<SolusiWorld | null>(null);

  useEffect(() => {
    const sync = () => {
      const next = modeFromHash();
      setMode(next);
      if (next !== "cari") setSearchOpen(false);
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
    let mounted: SolusiWorld | null = null;
    if (!hero.current) return;
    import("@/world/solusi").then(({ mountSolusiWorld }) => {
      if (cancelled || !hero.current) return;
      mounted = mountSolusiWorld(hero.current, () => !cancelled && setWorldReady(true));
      world.current = mounted;
      mounted.setMode(modeFromHash());
    });
    return () => {
      cancelled = true;
      mounted?.dispose();
      world.current = null;
    };
    // The world is mounted once; mode updates through its small controller below.
  }, []);

  useEffect(() => {
    world.current?.setMode(mode);
  }, [mode]);

  const openMode = (next: Exclude<Mode, "shop">) => {
    window.scrollTo(0, 0);
    window.location.hash = next;
  };
  const closeMode = () => {
    history.pushState(null, "", window.location.pathname + window.location.search);
    window.dispatchEvent(new PopStateEvent("popstate"));
    window.scrollTo(0, 0);
  };
  const detailHref = (slug: string) => (locale === "id" ? `/solusi/${slug}` : `/en/solutions/${slug}`);

  return (
    <div
      className={`solusi-page mode-${mode} ${mode !== "shop" ? "focus" : ""} ${searchOpen ? "served" : ""} ${worldReady ? "solusi-world-ready" : ""}`}
    >
      <section ref={hero} className="toko-hero" aria-labelledby="toko-h">
        <div className="toko-copy">
          <p className="solusi-kicker">{t("hero.eyebrow")}</p>
          <h1 id="toko-h">{t("hero.headline")}</h1>
          <p className="toko-lead">{t("hero.body")}</p>
          <div className="toko-actions">
            <button type="button" className="solusi-button is-primary" onClick={() => openMode("cari")}>
              <MagnifyingGlass aria-hidden weight="bold" /> {t("hero.search")}
            </button>
            <button type="button" className="solusi-button is-paper" onClick={() => openMode("kartu")}>
              <Shuffle aria-hidden weight="bold" /> {t("hero.cards")}
            </button>
          </div>
        </div>
        <div className="toko-stage no3d" role="img" aria-label={`${t("hero.shop")}. ${t("hero.cashier")}.`}>
          <div className="shop-sign">
            KREATEKNO <span>SOLUTION SHOP</span>
          </div>
          <div className="shop-shelves" aria-hidden="true">
            <i />
            <i />
            <i />
            <i />
            <i />
            <i />
          </div>
          <div className="cashier-css" aria-hidden="true">
            <span />
            <b />
          </div>
          <div className="shop-counter" aria-hidden="true">
            <span>KREATEKNO</span>
          </div>
        </div>
      </section>

      <Etalase locale={locale} detailHref={detailHref} />

      <section className="solusi-band" aria-labelledby="band-h">
        <div>
          <p className="solusi-kicker">KREATEKNO</p>
          <h2 id="band-h">{t("band.title")}</h2>
          <p>{t("band.body")}</p>
        </div>
        <div className="toko-actions">
          <button type="button" className="solusi-button is-light" onClick={() => openMode("cari")}>
            {t("band.search")}
          </button>
          <button type="button" className="solusi-button is-ghost" onClick={() => openMode("kartu")}>
            {t("band.cards")}
          </button>
        </div>
      </section>

      {mode === "cari" && (
        <SearchPanel
          locale={locale}
          filters={filters}
          setFilters={setFilters}
          page={page}
          setPage={setPage}
          open={searchOpen}
          setOpen={setSearchOpen}
          onClose={closeMode}
          detailHref={detailHref}
          world={world}
        />
      )}
      {mode === "kartu" && <CardPanel locale={locale} onClose={closeMode} world={world} />}
      <KontakModal />
    </div>
  );
}

function SearchPanel({
  locale,
  filters,
  setFilters,
  page,
  setPage,
  open,
  setOpen,
  onClose,
  detailHref,
  world,
}: {
  locale: SolusiLocale;
  filters: SearchFilters;
  setFilters: (value: SearchFilters) => void;
  page: number;
  setPage: (value: number) => void;
  open: boolean;
  setOpen: (value: boolean) => void;
  onClose: () => void;
  detailHref: (slug: string) => string;
  world: React.RefObject<SolusiWorld | null>;
}) {
  const t = useTranslations("pages.solutions");
  const [receiptNo, setReceiptNo] = useState(1);
  const [termFocused, setTermFocused] = useState(false);
  const [selected, setSelected] = useState<number | null>(null);
  const result = searchPage(SOLUSI, filters, page, locale);
  const receipt = String(receiptNo).padStart(4, "0");
  const update = <K extends keyof SearchFilters>(key: K, value: SearchFilters[K]) =>
    setFilters({ ...filters, [key]: value });

  useEffect(() => {
    world.current?.setSearchState({ typing: Boolean(filters.term), focused: termFocused, served: open });
  }, [filters.term, open, termFocused, world]);

  useEffect(() => {
    const select = (event: Event) => setSelected((event as CustomEvent<number | null>).detail);
    window.addEventListener("solusi-box-select", select);
    return () => window.removeEventListener("solusi-box-select", select);
  }, []);

  useEffect(() => {
    const close = (event: KeyboardEvent) => {
      if (event.key === "Escape" && selected !== null) {
        setSelected(null);
        world.current?.selectBox(null);
      }
    };
    window.addEventListener("keydown", close);
    return () => window.removeEventListener("keydown", close);
  }, [selected, world]);

  const selectResult = (index: number | null) => {
    setSelected(index);
    world.current?.selectBox(index);
  };

  const changePage = (nextPage: number) => {
    const next = searchPage(SOLUSI, filters, nextPage, locale);
    setPage(nextPage);
    setSelected(null);
    world.current?.setSearchItems(worldItems(next.items));
  };

  const selectedSolution = selected === null ? null : result.items[selected];

  return (
    <section className="focus-panel search-panel" aria-labelledby="search-h">
      <button type="button" className="panel-close" onClick={onClose} aria-label={t("search.close")}>
        <X aria-hidden />
      </button>
      <div className="focus-heading">
        <p className="solusi-kicker">{t("search.eyebrow")}</p>
        <h2 id="search-h">{t("search.title")}</h2>
      </div>
      <form
        className="receipt"
        role="search"
        onSubmit={(event) => {
          event.preventDefault();
          const first = searchPage(SOLUSI, filters, 1, locale);
          setPage(1);
          setReceiptNo((value) => value + 1);
          setOpen(true);
          setSelected(null);
          world.current?.search(worldItems(first.items));
        }}
      >
        <header>
          <b>KREATEKNO</b>
          <span>{t("search.receiptLine")}</span>
          <small>No. {receipt}</small>
        </header>
        <label className={filters.term ? "active" : ""}>
          <span>{t("search.term")}</span>
          <input
            value={filters.term || ""}
            onChange={(e) => update("term", e.target.value)}
            onFocus={() => setTermFocused(true)}
            onBlur={() => setTermFocused(false)}
            placeholder={t("search.termPlaceholder")}
          />
        </label>
        <div className="receipt-grid">
          <ReceiptSelect
            label={t("search.industry")}
            value={filters.industri || ""}
            onChange={(v) => update("industri", v as Industri | "")}
            options={INDUSTRI.map((x) => [x.id, x.label[locale]])}
            all={t("search.all")}
          />
          <ReceiptSelect
            label={t("search.team")}
            value={filters.tim || ""}
            onChange={(v) => update("tim", v as Tim | "")}
            options={TIM.map((x) => [x.id, x.label[locale]])}
            all={t("search.all")}
          />
          <ReceiptSelect
            label={t("search.app")}
            value={filters.app || ""}
            onChange={(v) => update("app", v as App | "")}
            options={APPS.map((x) => [x.id, x.label[locale]])}
            all={t("search.all")}
          />
          <ReceiptSelect
            label={t("search.status")}
            value={filters.status || ""}
            onChange={(v) => update("status", v as "jalan" | "ide" | "")}
            options={(Object.keys(STATUS) as (keyof typeof STATUS)[]).map((id) => [id, STATUS[id][locale]])}
            all={t("search.all")}
          />
        </div>
        <button className="receipt-submit" type="submit">
          <MagnifyingGlass aria-hidden weight="bold" /> {t("search.submit")}
        </button>
      </form>

      {open && (
        <div className="search-results" aria-live="polite">
          <div className="result-bar">
            <div>
              <b>{t("search.found", { count: result.total })}</b>
              {result.total > 0 && (
                <span>
                  {t("search.range", {
                    from: (result.page - 1) * 6 + 1,
                    to: Math.min(result.page * 6, result.total),
                    count: result.total,
                  })}
                </span>
              )}
            </div>
            <button
              type="button"
              onClick={() => {
                setOpen(false);
                setSelected(null);
                world.current?.searchAgain();
              }}
            >
              {t("search.again")}
            </button>
          </div>
          {result.items.length ? (
            <>
              <div className="box-tags" aria-label={t("search.found", { count: result.total })}>
                {result.items.map((solution, index) => (
                  <button
                    type="button"
                    className={selected === index ? "box-tag selected" : "box-tag"}
                    data-box-tag={index}
                    key={solution.slug}
                    aria-label={t("search.tagLabel", {
                      number: (result.page - 1) * 6 + index + 1,
                      title: catalogCopy(solution, locale).title,
                    })}
                    onPointerEnter={() => selectResult(index)}
                    onFocus={() => selectResult(index)}
                    onClick={() => selectResult(index)}
                  >
                    {(result.page - 1) * 6 + index + 1}
                  </button>
                ))}
              </div>
              <div className="result-grid">
                {result.items.map((solution, index) => {
                  const copy = catalogCopy(solution, locale);
                  return (
                    <article className="result-card" key={solution.slug}>
                      <span className="result-number">{(result.page - 1) * 6 + index + 1}</span>
                      <span className={`status status-${solution.status}`}>{STATUS[solution.status][locale]}</span>
                      <h3>{copy.title}</h3>
                      <p>{copy.summary}</p>
                      <a href={detailHref(solution.slug)}>
                        {t("catalog.detail")} <ArrowRight aria-hidden />
                      </a>
                    </article>
                  );
                })}
              </div>
              {result.pageCount > 1 && (
                <nav className="pagination" aria-label={t("search.found", { count: result.total })}>
                  <button type="button" disabled={!result.hasPrevious} onClick={() => changePage(result.page - 1)}>
                    {t("search.previous")}
                  </button>
                  <span>
                    {result.page} / {result.pageCount}
                  </span>
                  <button type="button" disabled={!result.hasNext} onClick={() => changePage(result.page + 1)}>
                    {t("search.next")}
                  </button>
                </nav>
              )}
            </>
          ) : (
            <div className="empty-result">
              <Sparkle aria-hidden />
              <h3>{t("search.empty")}</h3>
              <p>{t("search.emptyBody")}</p>
            </div>
          )}
        </div>
      )}
      {selectedSolution && (
        <aside
          className="box-summary"
          data-box-summary
          role="dialog"
          aria-label={catalogCopy(selectedSolution, locale).title}
        >
          <button
            type="button"
            className="box-summary-close"
            onClick={() => selectResult(null)}
            aria-label={t("search.close")}
          >
            <X aria-hidden />
          </button>
          <small>KREATEKNO · {String((result.page - 1) * 6 + (selected || 0) + 1).padStart(2, "0")}</small>
          <h3>{catalogCopy(selectedSolution, locale).title}</h3>
          <div className="box-summary-apps">
            {selectedSolution.apps.map((app) => (
              <span key={app}>{APPS.find((item) => item.id === app)?.label[locale] || app}</span>
            ))}
          </div>
          <p>{catalogCopy(selectedSolution, locale).summary}</p>
          <a href={detailHref(selectedSolution.slug)}>
            {t("catalog.detail")} <ArrowRight aria-hidden />
          </a>
        </aside>
      )}
    </section>
  );
}

function ReceiptSelect({
  label,
  value,
  onChange,
  options,
  all,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: readonly (readonly [string, string])[];
  all: string;
}) {
  return (
    <label className={value ? "active" : ""}>
      <span>{label}</span>
      <select value={value} onChange={(e) => onChange(e.target.value)}>
        <option value="">{all}</option>
        {options.map(([id, name]) => (
          <option value={id} key={id}>
            {name}
          </option>
        ))}
      </select>
    </label>
  );
}

function CardPanel({
  locale,
  onClose,
  world,
}: {
  locale: SolusiLocale;
  onClose: () => void;
  world: React.RefObject<SolusiWorld | null>;
}) {
  const t = useTranslations("pages.solutions");
  const router = useRouter();
  const [industry, setIndustry] = useState<Industri | "">("");
  const [yes, setYes] = useState<Kartu[]>([]);
  const [no, setNo] = useState<Kartu[]>([]);
  const [seen, setSeen] = useState<Set<string>>(new Set());
  const [deck, setDeck] = useState<Kartu[]>([]);
  const [dealing, setDealing] = useState(false);
  const [index, setIndex] = useState(0);
  const [locked, setLocked] = useState(false);
  const card = deck[index];
  const pointer = useRef({ id: -1, x: 0, y: 0 });
  const cardRef = useRef<HTMLDivElement>(null);
  const dealTimer = useRef<number | null>(null);
  const answered = yes.length + no.length;
  const round = Math.min(ROUNDS, Math.floor(answered / CARDS_PER_ROUND) + 1);

  const begin = () => {
    const initial = pickRound(KARTU, { industri: industry, yes: [], no: [], seen: new Set() }, () => 0.12);
    setYes([]);
    setNo([]);
    setSeen(new Set(initial.map((c) => c.id)));
    setDeck([]);
    setDealing(true);
    setIndex(0);
    world.current?.cards("begin");
    if (dealTimer.current) window.clearTimeout(dealTimer.current);
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setDeck(initial);
      setDealing(false);
    } else
      dealTimer.current = window.setTimeout(() => {
        setDeck(initial);
        setDealing(false);
      }, 1080);
  };

  const goResults = (nextYes: Kartu[], nextNo: Kartu[]) => {
    const query = answersQuery({ industri: industry, yes: nextYes, no: nextNo });
    router.push(`${locale === "id" ? "/solusi/hasil" : "/en/solutions/results"}?${query}`);
  };

  const answer = (kind: AnswerKind) => {
    if (!card || locked) return;
    const nextYes = kind === "no" ? yes : [...yes, card];
    const nextNo = kind === "no" ? [...no, card] : no;
    setLocked(true);
    if (kind === "yes") world.current?.cards("yes");
    else if (kind === "solution") world.current?.cards("offer");
    if (kind === "solution") {
      goResults(nextYes, nextNo);
      return;
    }
    const total = nextYes.length + nextNo.length;
    setYes(nextYes);
    setNo(nextNo);
    window.setTimeout(() => {
      if (total >= ROUNDS * CARDS_PER_ROUND) {
        goResults(nextYes, nextNo);
        return;
      }
      if (index < deck.length - 1) setIndex(index + 1);
      else {
        const next = pickRound(KARTU, { industri: industry, yes: nextYes, no: nextNo, seen }, () => 0.12);
        setDeck(next);
        setIndex(0);
        setSeen(new Set([...seen, ...next.map((c) => c.id)]));
        world.current?.cards("offer");
      }
      setLocked(false);
    }, 240);
  };

  useEffect(() => {
    return () => {
      if (dealTimer.current) window.clearTimeout(dealTimer.current);
    };
  }, []);

  useEffect(() => {
    if (!card) return;
    const key = (event: KeyboardEvent) => {
      if ((event.target as HTMLElement).matches("input,select,button,a")) return;
      if (event.key === "ArrowLeft") answer("no");
      if (event.key === "ArrowRight") answer("yes");
      if (event.key === "ArrowUp") answer("solution");
    };
    window.addEventListener("keydown", key);
    return () => window.removeEventListener("keydown", key);
  });

  const pointerDown = (event: PointerEvent<HTMLDivElement>) => {
    pointer.current = { id: event.pointerId, x: event.clientX, y: event.clientY };
    event.currentTarget.setPointerCapture(event.pointerId);
  };
  const pointerUp = (event: PointerEvent<HTMLDivElement>) => {
    if (pointer.current.id !== event.pointerId) return;
    const dx = event.clientX - pointer.current.x;
    const dy = event.clientY - pointer.current.y;
    if (dx > 70) answer("yes");
    else if (dx < -70) answer("no");
    else if (dy < -70) answer("solution");
    pointer.current.id = -1;
  };

  return (
    <section className="focus-panel card-panel" aria-labelledby="cards-h">
      <button type="button" className="panel-close" onClick={onClose} aria-label={t("cards.close")}>
        <X aria-hidden />
      </button>
      <div className="focus-heading">
        <p className="solusi-kicker">{t("cards.eyebrow")}</p>
        <h2 id="cards-h">{t("cards.title")}</h2>
        <p>{t("cards.intro")}</p>
      </div>
      {!deck.length && dealing ? (
        <div className="deal-placeholder" aria-hidden="true" />
      ) : !deck.length ? (
        <div className="industry-sheet">
          <span>{t("cards.industry")}</span>
          <div className="industry-grid">
            {INDUSTRI.map((item) => (
              <button
                type="button"
                className={industry === item.id ? "selected" : ""}
                key={item.id}
                onClick={() => setIndustry(item.id)}
              >
                {item.label[locale]}
              </button>
            ))}
          </div>
          <button type="button" className="solusi-button is-primary" onClick={begin}>
            {t("cards.start")} <ArrowRight aria-hidden />
          </button>
        </div>
      ) : (
        <div className="deck-area">
          <div className="deck-meta">
            <span>{t("cards.round", { round })}</span>
            <b>{t("cards.progress", { current: Math.min(9, answered + 1) })}</b>
          </div>
          <div className="deck-stack">
            {deck
              .slice(index, index + 3)
              .reverse()
              .map((item, reverseIndex, visible) => {
                const top = reverseIndex === visible.length - 1;
                return (
                  <div
                    ref={top ? cardRef : undefined}
                    className={`problem-card ${top ? "is-top" : ""} ${locked && top ? "is-leaving" : ""}`}
                    tabIndex={top ? 0 : -1}
                    key={item.id}
                    onPointerDown={top ? pointerDown : undefined}
                    onPointerUp={top ? pointerUp : undefined}
                    style={{ "--depth": visible.length - reverseIndex - 1 } as React.CSSProperties}
                  >
                    <small>KREATEKNO · {item.id.toUpperCase()}</small>
                    <p>{item.text[locale] || item.text.id}</p>
                    <span>{t("cards.solution")}</span>
                  </div>
                );
              })}
          </div>
          <div className="card-actions">
            <button type="button" className="answer-no" onClick={() => answer("no")}>
              {t("cards.no")}
            </button>
            <button type="button" className="answer-solution" onClick={() => answer("solution")}>
              {t("cards.solution")}
            </button>
            <button type="button" className="answer-yes" onClick={() => answer("yes")}>
              {t("cards.yes")}
            </button>
          </div>
          <p className="deck-hint">{t("cards.hint")}</p>
        </div>
      )}
    </section>
  );
}
