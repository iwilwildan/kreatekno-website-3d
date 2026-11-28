import { gsap } from "gsap";
import type { Film } from "./ceritaFilm";
import { CAROUSEL_KONTEN } from "./ceritaTiming";

const { START, END } = CAROUSEL_KONTEN;
const panels = [
  ".cr-before",
  ".cr-topics",
  ".cr-outline",
  ".cr-frame-sample",
  ".cr-gallery",
  ".cr-caption",
  ".cr-handoff",
  ".og-mx",
];

export function createFilm(stage: HTMLElement): Film {
  const canvas = stage.querySelector<HTMLElement>(".cr-cv")!;
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
        { autoAlpha: 0, y: 14 },
        { autoAlpha: 1, y: 0, duration: 0.34, immediateRender: false },
        at + 0.15,
      );
    });

    const reveal = (target: string, at: number, stagger = 0) => {
      timeline.from(target, { y: 9, autoAlpha: 0, duration: 0.3, stagger }, at);
    };
    reveal(".cr-materials li", START[0] + 0.28, 0.14);
    reveal(".cr-brief, .cr-meta", START[1] + 0.42, 0.15);
    reveal(".cr-outline li", START[2] + 0.38, 0.16);
    reveal(".cr-swatches i", START[3] + 0.48, 0.14);
    reveal(".cr-gallery li", START[4] + 0.44, 0.19);
    reveal(".cr-caption-body", START[5] + 0.48);
    reveal(".cr-handoff-folder, .cr-handoff-chat, .cr-handoff-status", START[6] + 0.44, 0.36);
    reveal(".og-m", START[7] + 0.32, 0.1);
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
