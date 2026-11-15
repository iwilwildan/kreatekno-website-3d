"use client";

import { Camera, X } from "@phosphor-icons/react/ssr";
import { useEffect, useRef, useState } from "react";

type Testimonial = { quote: string; name: string; business: string };

type Props = {
  items: Testimonial[];
  photo: string;
  closeLabel: string;
};

/**
 * The whole testimonial of a polaroid (beat 6, Home copy v3): on the corkboard a quote shows its first lines only, so
 * a tap on the polaroid ("Baca cerita", `[data-story]`) opens it here in a modal dialog, outside the anchors (their
 * transform, fade and hiding don't reach it). Escape, the close button and a click beside the card close it, and the
 * focus goes back to the polaroid; scrolling on closes it too, since the camera then leaves the board.
 */
export function TestimonialStory({ items, photo, closeLabel }: Props) {
  const dialog = useRef<HTMLDialogElement>(null);
  const close = useRef<HTMLButtonElement>(null);
  const trigger = useRef<HTMLElement | null>(null);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const target = (e.target as HTMLElement).closest<HTMLElement>("[data-story]");
      if (!target) return;
      trigger.current = target;
      setIndex(Number(target.dataset.story) || 0);
      dialog.current?.showModal();
      requestAnimationFrame(() => close.current?.focus());
    };
    const onScroll = () => {
      if (dialog.current?.open) dialog.current.close();
    };
    document.addEventListener("click", onClick);
    addEventListener("scroll", onScroll, { passive: true });
    return () => {
      document.removeEventListener("click", onClick);
      removeEventListener("scroll", onScroll);
    };
  }, []);

  const it = items[index];
  return (
    <dialog
      ref={dialog}
      className="story-dialog"
      aria-labelledby="story-name"
      data-tone={index % 4}
      onClose={() => trigger.current?.focus({ preventScroll: true })}
      onClick={(e) => {
        if (e.target === dialog.current) dialog.current.close();
      }}
    >
      <div className="story-card">
        <button ref={close} type="button" className="story-close" onClick={() => dialog.current?.close()}>
          <X aria-hidden weight="bold" />
          <span className="sr-only">{closeLabel}</span>
        </button>
        <div className="story-head">
          <div className="story-photo" aria-hidden>
            <Camera weight="duotone" />
            <span>{photo}</span>
          </div>
          <p className="story-who">
            <span id="story-name" className="story-name">
              {it?.name}
            </span>
            <span className="story-biz">{it?.business}</span>
          </p>
        </div>
        <blockquote>
          <p>“{it?.quote}”</p>
        </blockquote>
      </div>
    </dialog>
  );
}
