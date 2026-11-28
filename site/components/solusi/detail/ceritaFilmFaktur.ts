import { gsap } from "gsap";
import type { Film } from "./ceritaFilm";
import { FAKTUR_PEMASOK } from "./ceritaTiming";

const { START, END } = FAKTUR_PEMASOK;

export function createFilm(stage: HTMLElement): Film {
  const canvas = stage.querySelector<HTMLElement>(".fk-cv")!;
  let timeline: gsap.core.Timeline;
  const context = gsap.context(() => {
    canvas.classList.add("is-film");
    gsap.set(canvas.children, { autoAlpha: 0 });
    gsap.set(".fk-scan, .fk-rejected, .fk-reason", { autoAlpha: 0 });
    timeline = gsap.timeline({ paused: true });

    const show = (target: string, at: number, from: gsap.TweenVars = { y: 18 }) => {
      timeline.fromTo(
        target,
        { ...from, autoAlpha: 0 },
        { autoAlpha: 1, x: 0, y: 0, scale: 1, duration: 0.38, immediateRender: false },
        at,
      );
    };
    const hide = (target: string, at: number) => {
      timeline.to(target, { autoAlpha: 0, duration: 0.27 }, at);
    };

    timeline.set(".fk-before", { autoAlpha: 1 }, 0);
    timeline.from(".fk-pile", { y: -18, duration: 0.45 }, START[0]);
    timeline.from(".fk-manual > div", { x: -12, autoAlpha: 0, duration: 0.28, stagger: 0.13 }, START[0] + 0.28);

    hide(".fk-before", START[1]);
    show(".fk-sources", START[1] + 0.18);
    show(".fk-file", START[1] + 0.55, { x: -55, y: -85, scale: 0.65 });

    hide(".fk-sources", START[2]);
    timeline.to(".fk-file", { y: -126, scale: 0.75, autoAlpha: 0, duration: 0.4 }, START[2]);
    show(".fk-document", START[2] + 0.28, { scale: 0.9 });
    timeline.fromTo(
      ".fk-scan",
      { y: 0, autoAlpha: 0 },
      { y: 215, autoAlpha: 1, duration: 0.76, immediateRender: false },
      START[2] + 0.55,
    );
    timeline.to(".fk-read", { backgroundSize: "100% 100%", duration: 0.26, stagger: 0.1 }, START[2] + 0.57);
    hide(".fk-scan", START[2] + 1.24);

    hide(".fk-document", START[3]);
    show(".fk-fields", START[3] + 0.2);
    timeline.from(".fk-fields dl > div", { y: 14, autoAlpha: 0, duration: 0.29, stagger: 0.12 }, START[3] + 0.37);

    hide(".fk-fields", START[4]);
    show(".fk-compare", START[4] + 0.22);
    timeline.from(".fk-price-row", { x: 15, autoAlpha: 0, duration: 0.38, stagger: 0.15 }, START[4] + 0.49);
    timeline.from(
      ".fk-variance",
      { scale: 0.86, autoAlpha: 0, duration: 0.48, ease: "back.out(1.5)" },
      START[4] + 1.05,
    );

    hide(".fk-compare", START[5]);
    show(".fk-ledger", START[5] + 0.22);
    show(".fk-duplicate", START[5] + 0.66, { x: 26, y: 10 });

    hide(".fk-duplicate", START[6]);
    timeline.to(".fk-ledger", { y: 227, duration: 0.6, ease: "power2.inOut" }, START[6]);
    show(".fk-decision", START[6] + 0.24);
    timeline.from(".fk-actions", { autoAlpha: 0, y: 9, duration: 0.34 }, START[6] + 0.71);
    timeline.to(
      ".fk-reject",
      { backgroundColor: "#f8dce2", scale: 0.96, duration: 0.14, repeat: 1, yoyo: true },
      START[6] + 1.14,
    );
    timeline.to(".fk-reject", { backgroundColor: "#f8dce2", duration: 0.18 }, START[6] + 1.41);
    hide(".fk-pending", START[6] + 1.3);
    show(".fk-reason, .fk-rejected", START[6] + 1.38, { y: 7 });

    hide(".fk-decision, .fk-ledger", START[7]);
    show(".og-mx", START[7] + 0.23);
    timeline.from(".og-m", { autoAlpha: 0, y: 12, duration: 0.3, stagger: 0.1 }, START[7] + 0.3);
    timeline.to(".og-mx", { opacity: 0.45, duration: 0.4 }, START[8]);
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
