import { gsap } from "gsap";
import type { Film } from "./ceritaFilm";
import { PENGINGAT_TAGIHAN } from "./ceritaTiming";

const { START, END } = PENGINGAT_TAGIHAN;
const panels = [
  ".pt-before",
  ".pt-morning",
  '.pt-reminder[data-reminder="0"]',
  '.pt-reminder[data-reminder="1"]',
  '.pt-reminder[data-reminder="2"]',
  ".pt-payment",
  ".pt-handoff",
  ".og-mx",
];

export function createFilm(stage: HTMLElement): Film {
  const canvas = stage.querySelector<HTMLElement>(".pt-cv")!;
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
    reveal(".pt-before .pt-card", START[0] + 0.31, 0.14);
    reveal(".pt-morning .pt-invoices li", START[1] + 0.48, 0.16);
    for (const scene of [2, 3, 4]) {
      reveal(`${panels[scene]} .pt-message`, START[scene] + 0.44);
      reveal(`${panels[scene]} .pt-log`, START[scene] + 1.11);
    }
    reveal(".pt-confirm", START[5] + 0.53);
    reveal(".pt-paid-row", START[5] + 0.95);
    reveal(".pt-skip", START[5] + 1.35);
    reveal(".pt-handoff .pt-invoices li", START[6] + 0.49, 0.19);
    reveal(".pt-owner", START[6] + 1.25);
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
