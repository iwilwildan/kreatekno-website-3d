"use client";

import { Books, CalendarDots, Receipt, Users } from "@phosphor-icons/react/ssr";
import { useEffect, useRef, useState, type KeyboardEvent, type ReactNode } from "react";
import { Lit, Prop } from "./Prop";
import { cx } from "@/lib/cx";

export type Industry = { key: string; name: string; uses: { label: string; text: string }[] };

const ICONS = [Users, Receipt, CalendarDots, Books];

type Props = {
  title: string;
  intro: string;
  note: string;
  tabsLabel: string;
  industries: Industry[];
  /** The WhatsApp button, rendered by the parent. */
  cta: ReactNode;
};

/** Beat 4 · open ring binder held up by Heru; its coloured tabs switch the examples per industry. */
export function Binder({ title, intro, note, tabsLabel, industries, cta }: Props) {
  const [active, setActive] = useState(0);
  const [shown, setShown] = useState(0);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const ind = industries[shown];

  // fade the examples out, swap them, fade back in; then let the stage re-fit the binder
  useEffect(() => {
    if (active === shown) return;
    const t = window.setTimeout(() => {
      setShown(active);
      window.dispatchEvent(new Event("story:refit"));
    }, 180);
    return () => window.clearTimeout(t);
  }, [active, shown]);

  const onKey = (e: KeyboardEvent, i: number) => {
    if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
    e.preventDefault();
    const next = (i + (e.key === "ArrowRight" ? 1 : industries.length - 1)) % industries.length;
    setActive(next);
    tabs.current[next]?.focus();
  };

  return (
    <Prop
      kind="binder"
      label="Binder bertab dipegang Heru"
      noBlur
      data-ind={industries[active].key}
      desk={{ x: 40, y: 12, w: 46 }}
      phone={{ x: 4, b: 3, w: 92 }}
    >
      <i className="bd-cover deco" aria-hidden="true" />
      <div className="tabs" role="tablist" aria-label={tabsLabel}>
        {industries.map((x, i) => (
          <button
            key={x.key}
            ref={(el) => {
              tabs.current[i] = el;
            }}
            className={`tab t-${x.key}`}
            role="tab"
            type="button"
            id={`tab-${x.key}`}
            aria-controls="uc-panel"
            aria-selected={i === active}
            tabIndex={i === active ? 0 : -1}
            onClick={() => setActive(i)}
            onKeyDown={(e) => onKey(e, i)}
          >
            {x.name}
          </button>
        ))}
      </div>
      <div className="page">
        <span className="bd-rings deco" aria-hidden="true">
          <i />
          <i />
          <i />
        </span>
        <h2 id="h-uc">{title}</h2>
        <p className="intro">{intro}</p>
        <ul
          className={cx("uses", active !== shown && "out")}
          id="uc-panel"
          role="tabpanel"
          aria-labelledby={`tab-${industries[active].key}`}
          aria-live="polite"
        >
          {ind.uses.map((u, i) => {
            const Icon = ICONS[i];
            return (
              <li key={i}>
                <span className="lbl">
                  <Icon className="ic" aria-hidden />
                  <span>{u.label}</span>
                </span>
                <p>{u.text}</p>
              </li>
            );
          })}
        </ul>
        <div className="page-cta">
          {cta}
          <small>{note}</small>
        </div>
        <Lit />
      </div>
    </Prop>
  );
}
