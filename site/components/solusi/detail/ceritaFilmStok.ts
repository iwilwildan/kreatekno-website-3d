import { gsap } from "gsap";
import type { Film } from "./ceritaFilm";
import { STOK_MENIPIS } from "./ceritaTiming";

const { START, END } = STOK_MENIPIS;
const panels = [
  ".sm-before",
  ".sm-movement",
  ".sm-table",
  ".sm-threshold",
  ".sm-alert",
  ".sm-order",
  ".sm-receipt",
  ".og-mx",
];

export function createFilm(stage: HTMLElement): Film {
  const canvas = stage.querySelector<HTMLElement>(".sm-cv")!;
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

    const reveal = (target: string, at: number, stagger = 0) => {
      timeline.from(target, { y: 8, autoAlpha: 0, duration: 0.3, stagger }, at);
    };
    reveal(".sm-before .sm-facts > div", START[0] + 0.32, 0.15);
    reveal(".sm-movement .sm-transaction", START[1] + 0.52);
    reveal(".sm-table .sm-stock-change", START[2] + 0.53);
    timeline.from(".sm-gauge i", { scaleX: 0, duration: 0.38 }, START[3] + 0.48);
    reveal(".sm-threshold .is-low", START[3] + 0.92);
    reveal(".sm-estimate", START[3] + 1.42);
    reveal(".sm-message", START[4] + 0.46);
    reveal(".sm-message .sm-facts > div", START[4] + 0.67, 0.14);
    reveal(".sm-pending-order, .sm-order .sm-facts", START[5] + 0.54, 0.34);
    reveal(".sm-receipt .sm-transaction", START[6] + 0.63);
    reveal(".sm-receipt .sm-stock-change", START[6] + 1.39);
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
