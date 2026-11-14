"use client";

import {
  Buildings,
  CalendarDots,
  Envelope,
  FirstAid,
  Folder,
  GlobeSimple,
  Handshake,
  InstagramLogo,
  Storefront,
  Table,
  Truck,
  WhatsappLogo,
} from "@phosphor-icons/react/ssr";
import type { Icon } from "@phosphor-icons/react";
import { useTranslations } from "next-intl";
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { SOLUSI } from "@/content/solusi";
import { catalogCopy } from "@/content/solusi/catalog";
import type { SolusiLocale } from "@/content/solusi/schema";
import { APPS, INDUSTRI, STATUS } from "@/content/solusi/taksonomi";
import { buildTiers, fitIndustries } from "@/lib/solusi/tiers";
import { RakTrack } from "./RakTrack";

const ICONS: Record<string, Icon> = {
  Storefront,
  FirstAid,
  Buildings,
  Truck,
  Handshake,
  GlobeSimple,
  WhatsappLogo,
  Table,
  InstagramLogo,
  Envelope,
  CalendarDots,
  Folder,
};
const industryOf = (id: string) => INDUSTRI.find((i) => i.id === id)!;
const appOf = (id: string) => APPS.find((a) => a.id === id)!;

type Chip = { key: string; icon: string; label: string };

/**
 * "Cocok untuk" chips, at most two rows; the rest folds into "+N" (v1 13 Nov clampChips). The chips are
 * presentational: the full list is read from the sr-only text next to them.
 */
function FitChips({ chips }: { chips: Chip[] }) {
  const box = useRef<HTMLSpanElement>(null);
  const [shown, setShown] = useState(chips.length);
  const [pass, setPass] = useState(0);

  useEffect(() => {
    let alive = true;
    // Chip widths change once the web font arrives: measure again from the full list.
    document.fonts?.ready.then(() => {
      if (!alive) return;
      setShown(chips.length);
      setPass((p) => p + 1);
    });
    return () => {
      alive = false;
    };
  }, [chips.length]);

  useLayoutEffect(() => {
    const el = box.current;
    const items = el ? ([...el.children] as HTMLElement[]) : [];
    if (!items.length) return;
    // The block sits at the panel bottom, so rows move when it shrinks: measure from the first chip.
    const third = items[0].offsetTop + (items[0].offsetHeight + 4) * 2;
    if (shown > 1 && items.some((c) => c.offsetTop >= third)) setShown(shown - 1);
  }, [shown, pass]);

  const hidden = chips.length - shown;
  return (
    <span className="chips" ref={box} aria-hidden="true">
      {chips.slice(0, shown).map((chip) => {
        const Glyph = ICONS[chip.icon];
        return (
          <span key={chip.key}>
            {Glyph && <Glyph className="ic" />}
            {chip.label}
          </span>
        );
      })}
      {hidden > 0 && <span className="more">+{hidden}</span>}
    </span>
  );
}

/** Etalase as in the v1 prototype of 13 Nov: one tier per team, tall boxes, no decor slots. */
export function Etalase({ locale, detailHref }: { locale: SolusiLocale; detailHref: (slug: string) => string }) {
  const t = useTranslations("pages.solutions.catalog");
  const tiers = useMemo(() => buildTiers(SOLUSI), []);

  return (
    <section className="etalase" aria-labelledby="et-h">
      <div className="room">
        <div className="counter">
          <h2 className="counter-h" id="et-h">
            {t("title")}
          </h2>
          <div className="frame">
            <div className="tiers">
              {tiers.map(({ team, solutions }) => {
                const teamName = team.label[locale];
                return (
                  <section
                    className="tier"
                    key={team.id}
                    data-team={team.id}
                    style={{ "--c": team.color } as React.CSSProperties}
                    aria-labelledby={`t-${team.id}`}
                  >
                    <RakTrack previous={t("previous", { team: teamName })} next={t("next", { team: teamName })}>
                      {solutions.map((solution) => {
                        const copy = catalogCopy(solution, locale);
                        const fit = fitIndustries(solution);
                        const chips: Chip[] =
                          fit === "all"
                            ? [{ key: "all", icon: "GlobeSimple", label: t("allIndustries") }]
                            : fit.map((id) => ({
                                key: id,
                                icon: industryOf(id).icon,
                                label: industryOf(id).label[locale],
                              }));
                        const apps = solution.apps.map(appOf);
                        return (
                          <li className="slot" key={solution.slug}>
                            <a className="prod" href={detailHref(solution.slug)} data-slug={solution.slug}>
                              <span className="pk" data-slot data-kind="solution" data-color={team.color}>
                                <span className={solution.status === "ide" ? "st ide" : "st"}>
                                  <i />
                                  {STATUS[solution.status][locale]}
                                </span>
                                <span className="cover">
                                  <b className="ttl">{copy.title}</b>
                                  <span className="sub">{copy.result}</span>
                                  <span className="fit">
                                    <small>{t("fitFor")}</small>
                                    <FitChips chips={chips} />
                                    <span className="sr-only">{chips.map((c) => c.label).join(", ")}</span>
                                  </span>
                                </span>
                                <span
                                  className="apps"
                                  role="img"
                                  aria-label={t("apps", { list: apps.map((a) => a.label[locale]).join(", ") })}
                                >
                                  {apps.map((app) => {
                                    const Glyph = ICONS[app.icon];
                                    return <i key={app.id}>{Glyph && <Glyph className="ic" color={app.color} />}</i>;
                                  })}
                                </span>
                              </span>
                            </a>
                          </li>
                        );
                      })}
                    </RakTrack>
                    <div className="plank">
                      <h3 id={`t-${team.id}`}>{teamName}</h3>
                    </div>
                  </section>
                );
              })}
            </div>
          </div>
        </div>
        <div className="plinth" />
      </div>
    </section>
  );
}
