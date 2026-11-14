"use client";

import { ArrowLeft, ArrowRight, ChatCircleDots, Repeat } from "@phosphor-icons/react/ssr";
import { useLocale, useTranslations } from "next-intl";
import { useEffect, useMemo, useState } from "react";
import { catalogCopy } from "@/content/solusi/catalog";
import { KARTU } from "@/content/solusi/kartu";
import { SOLUSI } from "@/content/solusi";
import type { SolusiLocale } from "@/content/solusi/schema";
import { STATUS } from "@/content/solusi/taksonomi";
import { results } from "@/lib/solusi/kartu";
import { cardsMessage } from "@/lib/solusi/pesan";
import { parseAnswers } from "@/lib/solusi/url";
import { KontakModal } from "./KontakModal";

export function HasilKartu() {
  const locale = useLocale() as SolusiLocale;
  const t = useTranslations("pages.solutions");
  const [search, setSearch] = useState("");
  useEffect(() => {
    const sync = () => setSearch(window.location.search);
    sync();
    window.addEventListener("popstate", sync);
    return () => window.removeEventListener("popstate", sync);
  }, []);
  const state = useMemo(() => parseAnswers(search, KARTU), [search]);
  const ranked = useMemo(() => results(SOLUSI, state), [state]);
  const shop = locale === "id" ? "/solusi" : "/en/solutions";
  const detailHref = (slug: string) => `${shop}/${slug}`;
  const message = cardsMessage(state, locale);

  return (
    <div className="solusi-page hasil-page">
      <section className="hasil-hero">
        <p className="solusi-kicker">{t("results.eyebrow")}</p>
        <h1>{ranked.length ? t("results.title") : t("results.emptyTitle")}</h1>
        <p>{ranked.length ? t("results.body") : t("results.emptyBody")}</p>
      </section>

      {ranked.length > 0 && (
        <section className="hasil-layout">
          <div className="rank-list">
            {ranked.map(({ solution, rank }) => {
              const copy = catalogCopy(solution, locale);
              return (
                <article className="rank-card" key={solution.slug}>
                  <div className="rank-no">{String(rank).padStart(2, "0")}</div>
                  <div>
                    <span className={`status status-${solution.status}`}>{STATUS[solution.status][locale]}</span>
                    <p className="rank-label">{t("results.rank", { rank })}</p>
                    <h2>{copy.title}</h2>
                    <p>{copy.result}</p>
                    <a href={detailHref(solution.slug)}>
                      {t("catalog.detail")} <ArrowRight aria-hidden />
                    </a>
                  </div>
                </article>
              );
            })}
          </div>
          <aside className="issue-receipt">
            <p>{t("results.issues")}</p>
            <ul>
              {state.yes.map((card) => (
                <li key={card.id}>{card.text[locale] || card.text.id}</li>
              ))}
            </ul>
          </aside>
        </section>
      )}

      <section className="hasil-actions">
        <a
          href="#contact"
          className="solusi-button is-primary"
          data-contact
          data-src="solutions-results"
          data-intent="results"
          data-msg={message}
        >
          <ChatCircleDots aria-hidden weight="bold" /> {t("results.consult")}
        </a>
        <a className="solusi-button is-paper" href={`${shop}#kartu`}>
          <Repeat aria-hidden /> {t("results.repeat")}
        </a>
        <a className="text-back" href={shop}>
          <ArrowLeft aria-hidden /> {t("results.back")}
        </a>
      </section>
      <KontakModal />
    </div>
  );
}
