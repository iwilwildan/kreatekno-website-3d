import { gsap } from "gsap";
import type { Film } from "./ceritaFilm";
import { ULASAN_PELANGGAN } from "./ceritaTiming";

const { START, END } = ULASAN_PELANGGAN;
const panels = [
  ".up-before",
  ".up-intake",
  ".up-table",
  ".up-dedupe",
  ".up-topics",
  ".up-queue",
  ".up-report",
  ".og-mx",
];

export function createFilm(stage: HTMLElement): Film {
  const canvas = stage.querySelector<HTMLElement>(".up-cv")!;
  let timeline: gsap.core.Timeline;
  const context = gsap.context(() => {
    canvas.classList.add("is-film");
    gsap.set(canvas.children, { autoAlpha: 0 });
    timeline = gsap.timeline({ paused: true });
    timeline.set(panels[0], { autoAlpha: 1 }, 0);
    panels.slice(1).forEach((panel, index) => {
      const at = START[index + 1];
      timeline.to(panels[index], { autoAlpha: 0, duration: 0.25 }, at);
      timeline.fromTo(
        panel,
        { autoAlpha: 0, y: 15 },
        { autoAlpha: 1, y: 0, duration: 0.34, immediateRender: false },
        at + 0.16,
      );
    });

    const reveal = (selector: string, at: number, stagger = 0) => {
      timeline.from(selector, { y: 8, autoAlpha: 0, duration: 0.3, stagger }, at);
    };
    reveal(".up-before .up-channels li", START[0] + 0.32, 0.13);
    reveal(".up-intake .up-channels li", START[1] + 0.4, 0.13);
    reveal(".up-intake-record", START[1] + 0.98);
    reveal(".up-table .up-records li", START[2] + 0.48, 0.22);
    reveal(".up-dedupe .up-copy", START[3] + 0.44, 0.22);
    reveal(".up-duplicate small", START[3] + 1.04);
    reveal(".up-dedup-count", START[3] + 1.43);
    reveal(".up-topic-list li", START[4] + 0.43, 0.17);
    reveal(".up-queue .up-records li", START[5] + 0.47);
    reveal(".up-staff", START[5] + 1.11);
    reveal(".up-report table", START[6] + 0.5);
    reveal(".up-action", START[6] + 1.38);
    reveal(".og-m", START[7] + 0.34, 0.1);
    timeline.to(".og-mx", { opacity: 0.45, duration: 0.38 }, START[8]);
    timeline.set({}, {}, END[8]);
  }, canvas);

  return {
    seek(time) {
      timeline.seek(time, false);
    },
    dispose() {
      context.revert();
      canvas.classList.remove("is-film");
    },
  };
}
