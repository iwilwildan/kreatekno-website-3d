"use client";

import { useEffect, useRef, useState } from "react";

type State = "idle" | "live" | "off";

/**
 * The mini office under the footer's logo (world/footer/office.ts): Heru, Andi and Wildan at work, loaded only when
 * the footer comes near the screen. Decorative (aria-hidden); without WebGL the box collapses and the footer stays
 * as it was. With reduced motion it shows one still frame.
 */
export function FooterOffice() {
  const box = useRef<HTMLDivElement>(null);
  const [state, setState] = useState<State>("idle");

  useEffect(() => {
    const host = box.current;
    if (!host) return;
    let office: { dispose: () => void } | null = null;
    let cancelled = false;
    const start = async () => {
      const probe = document.createElement("canvas");
      if (!probe.getContext("webgl2")) {
        setState("off");
        return;
      }
      try {
        const { mountOffice } = await import("@/world/footer/office");
        if (cancelled) return;
        const o = await mountOffice(host, {
          reduced: matchMedia("(prefers-reduced-motion: reduce)").matches,
          saver: matchMedia("(pointer: coarse)").matches,
          onReady: () => setState("live"),
          hud: new URLSearchParams(location.search).has("hud"),
        });
        if (cancelled) o.dispose();
        else office = o;
      } catch {
        setState("off");
      }
    };
    const io = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return;
        io.disconnect();
        void start();
      },
      { rootMargin: "800px 0px" },
    );
    io.observe(host);
    return () => {
      cancelled = true;
      io.disconnect();
      office?.dispose();
    };
  }, []);

  if (state === "off") return null;
  return (
    <div
      ref={box}
      aria-hidden
      className={`footer-office -mx-2 aspect-[16/10] w-[calc(100%+1rem)] max-w-[30rem] transition-opacity duration-700 ${
        state === "live" ? "opacity-100" : "opacity-0"
      }`}
    />
  );
}
