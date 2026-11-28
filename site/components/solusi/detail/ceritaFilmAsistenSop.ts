import { gsap } from "gsap";
import type { Film } from "./ceritaFilm";
import { ASISTEN_SOP } from "./ceritaTiming";

const { START, END } = ASISTEN_SOP;
const poses = [
  ".as-before",
  ".as-folder",
  ".as-library",
  ".as-ask",
  ".as-answered",
  ".as-outside",
  ".as-log",
  ".og-mx",
];

export function createFilm(stage: HTMLElement): Film {
  const canvas = stage.querySelector<HTMLElement>(".as-cv")!;
  let timeline: gsap.core.Timeline;
  const context = gsap.context(() => {
    canvas.classList.add("is-film");
    gsap.set(canvas.children, { autoAlpha: 0 });
    timeline = gsap.timeline({ paused: true });
    timeline.set(poses[0], { autoAlpha: 1 }, 0);
    poses.slice(1).forEach((pose, offset) => {
      const at = START[offset + 1];
      timeline.to(poses[offset], { autoAlpha: 0, duration: 0.25 }, at);
      timeline.fromTo(
        pose,
        { autoAlpha: 0, y: 15 },
        { autoAlpha: 1, y: 0, duration: 0.34, immediateRender: false },
        at + 0.16,
      );
    });

    const reveal = (target: string, at: number, stagger = 0) => {
      timeline.from(target, { y: 8, autoAlpha: 0, duration: 0.3, stagger }, at);
    };
    reveal(".as-before .as-staff", START[0] + 0.32);
    reveal(".as-library .as-excerpt, .as-library .as-ready", START[2] + 0.55, 0.17);
    reveal(".as-ask .as-staff", START[3] + 0.57);
    reveal(".as-answered .as-reply", START[4] + 0.55);
    reveal(".as-answered .as-reply li", START[4] + 0.7, 0.12);
    reveal(".as-source", START[4] + 1.24);
    reveal(".as-outside .as-staff, .as-outside .as-reply", START[5] + 0.57, 0.41);
    reveal(".as-staff-action", START[5] + 1.55);
    reveal(".as-log-entry", START[6] + 0.6);
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
