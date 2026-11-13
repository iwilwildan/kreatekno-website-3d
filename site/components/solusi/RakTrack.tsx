"use client";

import { ArrowRight } from "@phosphor-icons/react/ssr";
import { useEffect, useRef, useState, type ReactNode } from "react";

const reduceMotion = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/**
 * One shelf row (v1 13 Nov, LOGIKA 7): arrows only when the boxes overflow, mouse drag over 6 px with a
 * snap to the nearest slot, a click swallowed for 300 ms after a drag, native scrolling for touch.
 */
export function RakTrack({ children, previous, next }: { children: ReactNode; previous: string; next: string }) {
  const track = useRef<HTMLUListElement>(null);
  const [edges, setEdges] = useState({ start: true, end: false, overflow: false });

  useEffect(() => {
    const el = track.current;
    if (!el) return;
    const sync = () =>
      setEdges({
        start: el.scrollLeft < 4,
        end: el.scrollLeft > el.scrollWidth - el.clientWidth - 4,
        overflow: el.scrollWidth > el.clientWidth + 2,
      });
    const step = () =>
      (el.querySelector(".slot")?.getBoundingClientRect().width || 220) +
      (parseFloat(getComputedStyle(el).columnGap) || 16);
    let down: { x: number; left: number } | null = null;
    let moved = false;
    let dragEnd = 0;
    const onClick = (e: MouseEvent) => {
      if (performance.now() - dragEnd < 300) {
        e.preventDefault();
        e.stopPropagation();
      }
    };
    const onDown = (e: PointerEvent) => {
      if (e.pointerType !== "mouse" || e.button !== 0 || el.scrollWidth <= el.clientWidth + 2) return;
      down = { x: e.clientX, left: el.scrollLeft };
      moved = false;
    };
    const onMove = (e: PointerEvent) => {
      if (!down) return;
      const dx = e.clientX - down.x;
      if (!moved && Math.abs(dx) > 6) {
        moved = true;
        el.classList.add("drag");
      }
      if (moved) el.scrollLeft = down.left - dx;
    };
    const onUp = () => {
      if (!down) return;
      down = null;
      if (!moved) return;
      el.classList.remove("drag");
      const st = step();
      el.scrollTo({ left: Math.round(el.scrollLeft / st) * st, behavior: reduceMotion() ? "auto" : "smooth" });
      dragEnd = performance.now();
      moved = false;
    };
    const resize = new ResizeObserver(sync);
    resize.observe(el);
    el.addEventListener("scroll", sync, { passive: true });
    el.addEventListener("click", onClick, true);
    el.addEventListener("pointerdown", onDown);
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
    sync();
    (el as HTMLUListElement & { rakStep?: () => number }).rakStep = step;
    return () => {
      resize.disconnect();
      el.removeEventListener("scroll", sync);
      el.removeEventListener("click", onClick, true);
      el.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
    };
  }, []);

  const move = (direction: -1 | 1) => {
    const el = track.current as (HTMLUListElement & { rakStep?: () => number }) | null;
    if (!el) return;
    el.scrollBy({ left: direction * (el.rakStep?.() || 230), behavior: reduceMotion() ? "auto" : "smooth" });
  };

  return (
    <div className="row">
      <button
        className="arr prev"
        type="button"
        aria-label={previous}
        hidden={!edges.overflow}
        disabled={edges.start}
        onClick={() => move(-1)}
      >
        <ArrowRight aria-hidden className="ic" />
      </button>
      <ul ref={track} className="track" onDragStart={(event) => event.preventDefault()}>
        {children}
      </ul>
      <button
        className="arr next"
        type="button"
        aria-label={next}
        hidden={!edges.overflow}
        disabled={edges.end}
        onClick={() => move(1)}
      >
        <ArrowRight aria-hidden className="ic" />
      </button>
    </div>
  );
}
