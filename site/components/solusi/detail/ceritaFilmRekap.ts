import { gsap } from "gsap";
import type { Film } from "./ceritaFilm";
import { REKAP_PENJUALAN } from "./ceritaTiming";

const { START, END } = REKAP_PENJUALAN;
const panels = [".rp-before", ".rp-sheet", ".rp-sum", ".rp-comparison", ".rp-recap", ".rp-ask", ".rp-answer", ".og-mx"];

export function createFilm(stage: HTMLElement): Film {
  const canvas = stage.querySelector<HTMLElement>(".rp-cv")!;
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
    reveal(".rp-before-row", START[0] + 0.32, 0.18);
    reveal(".rp-sheet tbody tr", START[1] + 0.44, 0.16);
    reveal(".rp-sum .rp-total, .rp-sum .rp-facts", START[2] + 0.49, 0.22);
    reveal(".rp-top", START[2] + 1.17);
    reveal(".rp-periods li", START[3] + 0.49, 0.38);
    reveal(".rp-recap .rp-bubble", START[4] + 0.49);
    reveal(".rp-ask .rp-question", START[5] + 0.55);
    reveal(".rp-response", START[6] + 0.61);
    reveal(".rp-source", START[6] + 1.38);
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
