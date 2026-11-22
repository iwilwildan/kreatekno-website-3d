"use client";

import { useEffect } from "react";

/**
 * Marks the table-of-contents link of the section being read (`aria-current="true"`). Without JavaScript the links
 * still jump to their sections; this only adds the highlight.
 */
export function TocSpy({ tocId }: { tocId: string }) {
  useEffect(() => {
    const toc = document.getElementById(tocId);
    if (!toc) return;
    const links = [...toc.querySelectorAll<HTMLAnchorElement>('a[href^="#"]')];
    const headings = links
      .map((a) => document.getElementById(decodeURIComponent(a.hash.slice(1))))
      .filter((h): h is HTMLElement => h !== null);
    if (!headings.length) return;

    const mark = () => {
      // The section whose heading most recently passed the band below the floating header.
      const line = window.innerHeight * 0.3;
      let current = headings[0];
      for (const h of headings) if (h.getBoundingClientRect().top <= line) current = h;
      for (const a of links) {
        if (a.hash.slice(1) === current.id) a.setAttribute("aria-current", "true");
        else a.removeAttribute("aria-current");
      }
    };
    let frame = 0;
    const onScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(mark);
    };
    mark();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [tocId]);
  return null;
}
