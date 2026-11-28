import { gsap } from "gsap";
import type { Film } from "./ceritaFilm";
import { BERKAS_DOKUMEN } from "./ceritaTiming";

const { START, END } = BERKAS_DOKUMEN;
const panels = [
  ".bd-before",
  ".bd-receive",
  ".bd-folder",
  ".bd-read",
  ".bd-request",
  ".bd-update",
  ".bd-review",
  ".og-mx",
];

export function createFilm(stage: HTMLElement): Film {
  const canvas = stage.querySelector<HTMLElement>(".bd-cv")!;
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
        { autoAlpha: 1, y: 0, duration: 0.33, immediateRender: false },
        at + 0.16,
      );
    });

    const reveal = (target: string, at: number, stagger = 0) => {
      timeline.from(target, { y: 8, autoAlpha: 0, duration: 0.3, stagger }, at);
    };
    reveal(".bd-inbox li", START[0] + 0.29, 0.14);
    reveal(".bd-receive .bd-files li", START[1] + 0.42, 0.17);
    reveal(".bd-folder .bd-files li", START[2] + 0.45, 0.17);
    reveal(".bd-read .bd-checklist li", START[3] + 0.44, 0.17);
    reveal(".bd-read .bd-summary", START[3] + 1.15);
    reveal(".bd-bubble", START[4] + 0.49);
    reveal(".bd-update .bd-files li", START[5] + 0.39, 0.17);
    reveal(".bd-update-heading", START[5] + 0.73);
    reveal(".bd-updated-checklist li", START[5] + 0.81, 0.13);
    reveal(".bd-update .bd-summary", START[5] + 1.35);
    reveal(".bd-review-note", START[6] + 0.44);
    reveal(".bd-verification", START[6] + 0.91);
    reveal(".bd-complete", START[6] + 1.46);
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
