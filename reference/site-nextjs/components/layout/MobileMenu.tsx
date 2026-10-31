"use client";

import { List, X } from "@phosphor-icons/react/ssr";
import { useEffect, useRef, useState, useSyncExternalStore, type ReactNode } from "react";
import { createPortal } from "react-dom";

type Props = {
  openLabel: string;
  closeLabel: string;
  /** Logo, links, language switch and CTA, rendered on the server. */
  children: ReactNode;
};

const noop = () => () => {};

/**
 * Full-screen navy menu for screens under 960px. The panel is portalled to <body>: the header's
 * transform and backdrop-filter would otherwise trap a position:fixed child inside the pill.
 */
export function MobileMenu({ openLabel, closeLabel, children }: Props) {
  const [open, setOpen] = useState(false);
  const mounted = useSyncExternalStore(
    noop,
    () => true,
    () => false,
  );
  const burger = useRef<HTMLButtonElement>(null);
  const panel = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const root = document.documentElement;
    const opener = burger.current;
    const prev = root.style.overflow;
    root.style.overflow = "hidden";
    panel.current?.querySelector<HTMLElement>("[data-close]")?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      root.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
      opener?.focus();
    };
  }, [open]);

  return (
    <>
      <button
        ref={burger}
        type="button"
        aria-label={openLabel}
        aria-controls="mobile-menu"
        aria-expanded={open}
        onClick={() => setOpen(true)}
        className="grid size-11 flex-none cursor-pointer place-items-center rounded-full bg-navy text-white min-[961px]:hidden"
      >
        <List aria-hidden weight="bold" className="size-[22px]" />
      </button>

      {mounted &&
        createPortal(
          <div
            ref={panel}
            id="mobile-menu"
            role="dialog"
            aria-modal="true"
            aria-label={openLabel}
            inert={!open}
            data-lenis-prevent
            // Close after following any link inside the menu.
            onClick={(e) => {
              if ((e.target as HTMLElement).closest("a")) setOpen(false);
            }}
            className={`fixed inset-0 z-40 flex flex-col bg-navy-3/96 px-5 pt-[calc(env(safe-area-inset-top,0px)+24px)] pb-[calc(env(safe-area-inset-bottom,0px)+24px)] text-on-night backdrop-blur-xl transition-[opacity,visibility] duration-[260ms] ease-(--ease-out) min-[961px]:hidden ${
              open ? "visible opacity-100" : "invisible opacity-0"
            }`}
          >
            <button
              data-close
              type="button"
              aria-label={closeLabel}
              onClick={() => setOpen(false)}
              className="absolute top-[calc(env(safe-area-inset-top,0px)+20px)] right-5 grid size-12 cursor-pointer place-items-center rounded-full bg-white/10 text-white"
            >
              <X aria-hidden weight="bold" className="size-[22px]" />
            </button>
            {children}
          </div>,
          document.body,
        )}
    </>
  );
}
