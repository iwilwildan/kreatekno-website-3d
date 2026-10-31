"use client";

import { X } from "@phosphor-icons/react/ssr";
import { useEffect, useRef, useState } from "react";
import { cx } from "@/lib/cx";

type Props = { items: { q: string; a: string }[]; closeLabel: string };

/** Beat 8 · one sticky note per question; the answer opens on a lifted note. */
export function FaqNotes({ items, closeLabel }: Props) {
  const [open, setOpen] = useState<number | null>(null);
  const questions = useRef<(HTMLButtonElement | null)[]>([]);

  useEffect(() => {
    if (open === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <ul className={cx("notes", open !== null && "has-open")}>
      {items.map((item, i) => {
        const isOpen = open === i;
        return (
          <li key={i} className={cx("note", isOpen && "open")}>
            <button
              ref={(el) => {
                questions.current[i] = el;
              }}
              className="note-q"
              type="button"
              id={`q${i + 1}`}
              aria-expanded={isOpen}
              aria-controls={`a${i + 1}`}
              onClick={() => setOpen(isOpen ? null : i)}
            >
              {item.q}
            </button>
            <div className="note-a" id={`a${i + 1}`} role="region" aria-labelledby={`q${i + 1}`} hidden={!isOpen}>
              <p>{item.a}</p>
              <button
                type="button"
                className="note-x"
                aria-label={closeLabel}
                onClick={() => {
                  setOpen(null);
                  questions.current[i]?.focus();
                }}
              >
                <X className="ic" aria-hidden />
              </button>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
