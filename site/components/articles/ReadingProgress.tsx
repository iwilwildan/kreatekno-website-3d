"use client";

import { useEffect, useRef } from "react";

/**
 * A thin bar at the top of the window that fills as the article (the element with `targetId`) is read.
 * Decorative: the scroll position is already visible to every visitor, so it is hidden from screen readers.
 */
export function ReadingProgress({ targetId }: { targetId: string }) {
  const bar = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const target = document.getElementById(targetId);
    if (!target || !bar.current) return;
    let frame = 0;
    const update = () => {
      const rect = target.getBoundingClientRect();
      // 0 when the text's top reaches the top of the window, 1 when its end reaches the bottom
      const total = rect.height - window.innerHeight;
      const read = Math.min(1, Math.max(0, -rect.top / Math.max(1, total)));
      bar.current?.style.setProperty("transform", `scaleX(${read})`);
    };
    const onScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [targetId]);
  return (
    <div className="read-progress" aria-hidden>
      <div ref={bar} className="read-progress-bar" />
    </div>
  );
}
