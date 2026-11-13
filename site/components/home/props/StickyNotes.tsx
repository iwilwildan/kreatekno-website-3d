"use client";

import { X } from "@phosphor-icons/react/ssr";
import { useEffect, useRef, useState } from "react";
import { WhatsAppButton } from "@/components/layout/WhatsAppButton";

type Props = {
  title: string;
  help: string;
  closeLabel: string;
  items: { q: string; a: string }[];
};

/**
 * Beat 8 · FAQ (tahap 7): one question on each of the 8 sticky notes on the meeting room's glass (K8, 4 × 2), the
 * heading on the frosted band over the left notes, the help line and "Konsultasi gratis" on the band over the right
 * ones. A click, a tap or Enter opens a note's answer: the note grows over its three neighbours (toward the middle of
 * the two columns in view, so on 9:16 it stays on screen), one at a time, with a Close button; Escape closes it too
 * and the focus goes back to the question. Ported from reference/site-nextjs/components/story/FaqNotes.tsx. In the
 * film the world places each block on the glass (anchors "faq-title", "faq-help", "faq-0..7") and shows it at the
 * K8 hold. Without JavaScript the answers show under their questions (stage.css).
 */
export function StickyNotes({ title, help, closeLabel, items }: Props) {
  const [open, setOpen] = useState<number | null>(null);
  const questions = useRef<(HTMLButtonElement | null)[]>([]);
  const notes = useRef<(HTMLLIElement | null)[]>([]);

  useEffect(() => {
    if (open === null) return;
    const close = () => {
      setOpen(null);
      questions.current[open]?.focus({ preventScroll: true });
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    // the camera moves on and the world hides the note (not reachable): it closes, so it is not open when the visitor
    // comes back. Checked each frame while open: the world hides it on its own frame, after the last scroll event.
    let raf = 0;
    const watch = () => {
      if (notes.current[open]?.style.visibility === "hidden") setOpen(null);
      else raf = requestAnimationFrame(watch);
    };
    if (!matchMedia("(prefers-reduced-motion: reduce)").matches) raf = requestAnimationFrame(watch);
    addEventListener("keydown", onKey);
    return () => {
      cancelAnimationFrame(raf);
      removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <>
      <div
        data-anchor
        data-landscape="faq-title"
        data-portrait="faq-title"
        data-fade
        className="prop-copy lobby-copy glass-band faq-title"
        suppressHydrationWarning
      >
        <h2 id="h-faq">{title}</h2>
      </div>
      <ul className="lobby-list note-list" aria-labelledby="h-faq" data-has-open={open !== null || undefined}>
        {items.map((item, i) => {
          const isOpen = open === i;
          return (
            <li
              key={i}
              ref={(el) => {
                notes.current[i] = el;
              }}
              data-anchor
              data-landscape={`faq-${i}`}
              data-portrait={`faq-${i}`}
              data-fade
              data-col={i % 4}
              data-row={i < 4 ? 0 : 1}
              data-open={isOpen || undefined}
              className="prop-copy lobby-copy note"
              suppressHydrationWarning
            >
              <div className="note-in">
                <h3 className="note-h">
                  <button
                    ref={(el) => {
                      questions.current[i] = el;
                    }}
                    className="note-q"
                    type="button"
                    id={`faq-q${i + 1}`}
                    aria-expanded={isOpen}
                    aria-controls={`faq-a${i + 1}`}
                    onClick={() => setOpen(isOpen ? null : i)}
                  >
                    {item.q}
                  </button>
                </h3>
                <div className="note-a" id={`faq-a${i + 1}`} role="region" aria-labelledby={`faq-q${i + 1}`}>
                  <p>{item.a}</p>
                  <button
                    type="button"
                    className="note-x"
                    aria-label={closeLabel}
                    onClick={() => {
                      setOpen(null);
                      questions.current[i]?.focus({ preventScroll: true });
                    }}
                  >
                    <X aria-hidden weight="bold" className="note-x-ic" />
                  </button>
                </div>
              </div>
            </li>
          );
        })}
      </ul>
      <div
        data-anchor
        data-landscape="faq-help"
        data-portrait="faq-help"
        data-fade
        className="prop-copy lobby-copy glass-band faq-help"
        suppressHydrationWarning
      >
        <p>{help}</p>
        <WhatsAppButton section="faq" />
      </div>
    </>
  );
}
