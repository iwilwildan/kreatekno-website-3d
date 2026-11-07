"use client";

import { useRef, useState, type CSSProperties, type KeyboardEvent, type ReactNode } from "react";
import { PAGE_COPY } from "@/world/sets/binderLayout";

export type Industry = { key: string; name: string; uses: { label: string; text: string }[] };

type Props = {
  title: string;
  intro: string;
  note: string;
  tabsLabel: string;
  industries: Industry[];
  /** The Konsultasi gratis button, rendered by the parent. */
  cta: ReactNode;
};

/**
 * Beat 4 · Use case: the copy on the binder's open page (K4), with the binder's four coloured tabs as the
 * industry tabs (ARIA tabs: click, tap, arrow keys, Home and End). In the film the world places it on the page
 * and its tabs (anchor "page"); each tab button lies over its 3D tab, its touch area reaching past the page edge.
 * Ported from reference/site-nextjs/components/story/Binder.tsx (the binder there was a flat HTML prop).
 */
export function Binder({ title, intro, note, tabsLabel, industries, cta }: Props) {
  const [active, setActive] = useState(0);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const ind = industries[active];

  const onKey = (e: KeyboardEvent, i: number) => {
    const n = industries.length;
    const next =
      e.key === "ArrowDown" || e.key === "ArrowRight"
        ? (i + 1) % n
        : e.key === "ArrowUp" || e.key === "ArrowLeft"
          ? (i + n - 1) % n
          : e.key === "Home"
            ? 0
            : e.key === "End"
              ? n - 1
              : -1;
    if (next < 0) return;
    e.preventDefault();
    setActive(next);
    tabs.current[next]?.focus();
  };

  return (
    <div
      data-anchor
      data-landscape="page"
      data-portrait="page"
      data-fade
      className="prop-copy binder-copy"
      data-ind={ind.key}
      suppressHydrationWarning
    >
      {/* the box's own style is written by the world each frame, so the layout variable sits one level in */}
      <div className="binder-in" style={{ "--page-w": PAGE_COPY.pageW } as CSSProperties}>
        <div className="page">
          <h2 id="h-usecase">{title}</h2>
          <p className="intro">{intro}</p>
          <ul className="uses" id="uc-panel" role="tabpanel" aria-labelledby={`tab-${ind.key}`} tabIndex={0}>
            {ind.uses.map((u, i) => (
              <li key={`${ind.key}-${i}`}>
                <span className="lbl">{u.label}</span>
                <p>{u.text}</p>
              </li>
            ))}
          </ul>
          <div className="page-cta">
            {cta}
            <small>{note}</small>
          </div>
        </div>
        <div className="tabs" role="tablist" aria-label={tabsLabel} aria-orientation="vertical">
          {industries.map((x, i) => (
            <button
              key={x.key}
              ref={(el) => {
                tabs.current[i] = el;
              }}
              className="tab"
              role="tab"
              type="button"
              id={`tab-${x.key}`}
              aria-controls="uc-panel"
              aria-selected={i === active}
              tabIndex={i === active ? 0 : -1}
              onClick={() => setActive(i)}
              onKeyDown={(e) => onKey(e, i)}
              style={
                {
                  "--t0": PAGE_COPY.tabs[i].top,
                  "--t1": PAGE_COPY.tabs[i].bottom,
                  "--tab": PAGE_COPY.tabs[i].color,
                } as CSSProperties
              }
            >
              <span>{x.name}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
