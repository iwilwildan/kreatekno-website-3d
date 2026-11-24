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
  TelegramLogo,
  ThreadsLogo,
  Truck,
  WhatsappLogo,
} from "@phosphor-icons/react/ssr";
import type { Icon } from "@phosphor-icons/react";
import { useTranslations } from "next-intl";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { catalogCopy } from "@/content/solusi/catalog";
import type { Solusi, SolusiLocale } from "@/content/solusi/schema";
import { APPS, INDUSTRI, STATUS } from "@/content/solusi/taksonomi";
import { fitIndustries } from "@/lib/solusi/tiers";

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
  ThreadsLogo,
  TelegramLogo,
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

/**
 * One shelf box of the etalase (v1 13 Nov): status, cover (title, result, "Cocok untuk" chips) and app icons.
 * Shared by the etalase tiers and the "Solusi terkait" shelf on detail pages. `data-slot` and `data-color`
 * are read by the 3D shelf pass on `/solusi`; elsewhere CSS paints the box.
 */
export function RakBox({
  solution,
  locale,
  href,
  color,
}: {
  solution: Solusi;
  locale: SolusiLocale;
  href: string;
  color: string;
}) {
  const t = useTranslations("pages.solutions.catalog");
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
    <li className="slot" style={{ "--c": color } as React.CSSProperties}>
      <a className="prod" href={href} data-slug={solution.slug}>
        <span className="pk" data-slot data-kind="solution" data-color={color}>
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
}
