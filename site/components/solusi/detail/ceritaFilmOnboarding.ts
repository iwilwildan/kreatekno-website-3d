import { gsap } from "gsap";
import type { Film } from "./ceritaFilm";
import { ONBOARDING_KLIEN } from "./ceritaTiming";

const { START, END } = ONBOARDING_KLIEN;

export function createFilm(stage: HTMLElement): Film {
  const canvas = stage.querySelector<HTMLElement>(".ok-cv")!;
  let timeline: gsap.core.Timeline;
  const context = gsap.context(() => {
    canvas.classList.add("is-film");
    gsap.set(canvas.children, { autoAlpha: 0 });
    timeline = gsap.timeline({ paused: true });

    const show = (target: string, at: number, y = 16) => {
      timeline.fromTo(target, { autoAlpha: 0, y }, { autoAlpha: 1, y: 0, duration: 0.35, immediateRender: false }, at);
    };
    const hide = (target: string, at: number) => {
      timeline.to(target, { autoAlpha: 0, duration: 0.26 }, at);
    };

    timeline.set(".ok-before", { autoAlpha: 1 }, START[0]);
    timeline.from(".ok-chat-stack li", { x: 12, autoAlpha: 0, duration: 0.31, stagger: 0.16 }, START[0] + 0.23);

    hide(".ok-before", START[1]);
    show(".ok-deal", START[1] + 0.17, 58);
    timeline.from(
      ".ok-deal .ok-pill",
      { scale: 0.84, autoAlpha: 0, duration: 0.34, ease: "back.out(1.6)" },
      START[1] + 0.64,
    );

    hide(".ok-deal", START[2]);
    show(".ok-checklist", START[2] + 0.18);
    timeline.from(".ok-prep li", { x: -13, autoAlpha: 0, duration: 0.31, stagger: 0.14 }, START[2] + 0.42);

    hide(".ok-checklist", START[3]);
    show(".ok-draft", START[3] + 0.18);
    timeline.from(
      ".ok-letter > *, .ok-slot-pending",
      { y: 8, autoAlpha: 0, duration: 0.29, stagger: 0.14 },
      START[3] + 0.43,
    );

    hide(".ok-draft", START[4]);
    show(".ok-calendar", START[4] + 0.15);
    timeline.from(".ok-slots li", { x: 11, autoAlpha: 0, duration: 0.3, stagger: 0.12 }, START[4] + 0.4);
    timeline.from(".ok-slots .is-free", { scale: 0.91, duration: 0.35, ease: "back.out(1.6)" }, START[4] + 0.8);
    show(".ok-proposal", START[4] + 1.03, -22);

    hide(".ok-calendar, .ok-proposal", START[5]);
    show(".ok-review", START[5] + 0.19);
    timeline.from(".ok-check-slot", { y: 8, autoAlpha: 0, duration: 0.31 }, START[5] + 0.63);
    timeline.to(".ok-send", { scale: 0.95, duration: 0.12, repeat: 1, yoyo: true }, START[5] + 1.24);
    timeline.to(".ok-send", { backgroundColor: "#dac9f2", duration: 0.18 }, START[5] + 1.49);
    show(".ok-delivery", START[5] + 1.5);

    hide(".ok-review, .ok-delivery", START[6]);
    show(".ok-register", START[6] + 0.19);
    timeline.from(".ok-final-row > div", { x: -10, autoAlpha: 0, duration: 0.28, stagger: 0.13 }, START[6] + 0.46);
    timeline.from(".ok-awaiting", { y: 8, autoAlpha: 0, duration: 0.29 }, START[6] + 0.86);

    hide(".ok-register", START[7]);
    show(".og-mx", START[7] + 0.22);
    timeline.from(".og-m", { y: 10, autoAlpha: 0, duration: 0.29, stagger: 0.1 }, START[7] + 0.32);
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
