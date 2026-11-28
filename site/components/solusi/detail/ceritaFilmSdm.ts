import { gsap } from "gsap";
import type { Film } from "./ceritaFilm";
import { LAYANAN_SDM } from "./ceritaTiming";

const { START, END } = LAYANAN_SDM;

export function createFilm(stage: HTMLElement): Film {
  const canvas = stage.querySelector<HTMLElement>(".sd-cv")!;
  let timeline: gsap.core.Timeline;
  const context = gsap.context(() => {
    canvas.classList.add("is-film");
    gsap.set(canvas.children, { autoAlpha: 0 });
    gsap.set(".sd-stamp", { autoAlpha: 0 });
    timeline = gsap.timeline({ paused: true });

    const show = (target: string, at: number, y = 16) => {
      timeline.fromTo(target, { autoAlpha: 0, y }, { autoAlpha: 1, y: 0, duration: 0.38, immediateRender: false }, at);
    };
    const hide = (target: string, at: number) => {
      timeline.to(target, { autoAlpha: 0, duration: 0.26 }, at);
    };

    timeline.set(".sd-before", { autoAlpha: 1 }, START[0]);
    timeline.from(".sd-branches li", { y: -14, autoAlpha: 0, duration: 0.32, stagger: 0.15 }, START[0] + 0.24);

    hide(".sd-before", START[1]);
    show(".sd-inbox", START[1] + 0.2);
    timeline.from(".sd-inbox .sd-message", { y: 10, autoAlpha: 0, duration: 0.3 }, START[1] + 0.45);
    show(".sd-packet", START[1] + 0.79, -45);

    hide(".sd-inbox, .sd-packet", START[2]);
    show(".sd-route", START[2] + 0.15);
    timeline.from(".sd-leave-route", { scale: 0.8, duration: 0.4, ease: "back.out(2)" }, START[2] + 0.32);
    timeline.from(".sd-route-ticket", { x: -20, autoAlpha: 0, duration: 0.32 }, START[2] + 0.52);
    timeline.from(
      ".sd-policy-question, .sd-policy-answer, .sd-policy-followup",
      { y: 9, autoAlpha: 0, duration: 0.3, stagger: 0.3 },
      START[2] + 0.65,
    );

    hide(".sd-route", START[3]);
    show(".sd-balance", START[3] + 0.2);
    timeline.from(".sd-balances > div", { y: 14, autoAlpha: 0, duration: 0.35, stagger: 0.14 }, START[3] + 0.45);

    hide(".sd-balance", START[4]);
    show(".sd-manager", START[4] + 0.19);
    timeline.from(".sd-summary > div", { y: 8, autoAlpha: 0, duration: 0.29, stagger: 0.1 }, START[4] + 0.43);
    timeline.from(".sd-actions", { y: 10, autoAlpha: 0, duration: 0.32 }, START[4] + 0.93);

    timeline.to(".sd-approve", { backgroundColor: "#d4ecde", duration: 0.32 }, START[5] + 0.42);
    timeline.to(".sd-approve", { scale: 0.95, duration: 0.13, repeat: 1, yoyo: true }, START[5] + 0.42);
    hide(".sd-manager .sd-pending", START[5] + 0.63);
    show(".sd-stamp", START[5] + 0.75, 7);

    hide(".sd-manager", START[6]);
    show(".sd-register", START[6] + 0.2);
    timeline.from(".sd-change", { y: 10, autoAlpha: 0, duration: 0.32 }, START[6] + 0.55);
    timeline.from(".sd-change strong", { scale: 0.82, duration: 0.35, ease: "back.out(1.6)" }, START[6] + 0.63);
    show(".sd-confirm", START[6] + 1.03);

    hide(".sd-register, .sd-confirm", START[7]);
    show(".og-mx", START[7] + 0.2);
    timeline.from(".og-m", { y: 9, autoAlpha: 0, duration: 0.31, stagger: 0.1 }, START[7] + 0.29);
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
