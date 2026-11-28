import { gsap } from "gsap";
import type { Film } from "./ceritaFilm";
import { BALAS_KOMENTAR } from "./ceritaTiming";

const { START, END } = BALAS_KOMENTAR;

/** A paused timeline that follows the same comment from the post into a private conversation. */
export function createFilm(stage: HTMLElement): Film {
  const canvas = stage.querySelector<HTMLElement>(".bk-cv")!;
  let timeline: gsap.core.Timeline;
  const context = gsap.context(() => {
    timeline = gsap.timeline({ paused: true });
    const show = (target: string, at: number, y = 18) => {
      timeline.fromTo(target, { autoAlpha: 0, y }, { autoAlpha: 1, y: 0, duration: 0.4, immediateRender: false }, at);
    };
    const hide = (target: string, at: number) => {
      timeline.to(target, { autoAlpha: 0, duration: 0.28 }, at);
    };

    canvas.classList.add("is-film");
    gsap.set(canvas.children, { autoAlpha: 0 });
    gsap.set(".bk-handoff, .bk-customer, .bk-staff", { autoAlpha: 0 });

    timeline.set(".bk-post", { autoAlpha: 1 }, START[0]);
    timeline.from(".bk-post-comments li", { y: -10, autoAlpha: 0, duration: 0.3, stagger: 0.16 }, START[0] + 0.12);
    show(".bk-packing", START[0] + 0.55);

    // The original question leaves the busy comment list. Its card stays with the viewer.
    hide(".bk-packing, .bk-missed", START[1]);
    show(".bk-schedule", START[1] + 0.1);
    timeline.fromTo(
      ".bk-packet",
      { y: 150, scale: 0.82, autoAlpha: 0 },
      { y: 310, scale: 1, autoAlpha: 1, duration: 0.62, ease: "power3.out", immediateRender: false },
      START[1] + 0.38,
    );

    hide(".bk-post, .bk-schedule", START[2]);
    timeline.to(".bk-packet", { y: 0, duration: 0.62, ease: "power2.inOut" }, START[2] + 0.06);
    show(".bk-history", START[2] + 0.36);
    timeline.from(".bk-duplicate", { x: 18, autoAlpha: 0, duration: 0.35 }, START[2] + 0.85);

    hide(".bk-history", START[3]);
    show(".bk-filter", START[3] + 0.3);
    timeline.to(".bk-packet mark", { backgroundSize: "100% 100%", duration: 0.38 }, START[3] + 0.68);
    timeline.from(".bk-keywords .is-match", { scale: 0.84, duration: 0.4, ease: "back.out(2)" }, START[3] + 0.68);
    timeline.from(".bk-ignored", { y: 8, autoAlpha: 0, duration: 0.3 }, START[3] + 1.03);

    hide(".bk-filter", START[4]);
    show(".bk-public", START[4] + 0.22, 0);
    timeline.to(".bk-packet", { y: 66, duration: 0.54, ease: "power2.inOut" }, START[4] + 0.13);
    timeline.to(".bk-packet mark", { backgroundSize: "0% 100%", duration: 0.25 }, START[4] + 0.23);
    timeline.from(".bk-reply", { x: -15, autoAlpha: 0, duration: 0.46 }, START[4] + 0.76);

    hide(".bk-public", START[5]);
    timeline.to(".bk-packet", { x: 108, y: 37, scale: 0.42, autoAlpha: 0, duration: 0.55 }, START[5]);
    show(".bk-inbox", START[5] + 0.34);
    timeline.from(".bk-message", { y: 16, autoAlpha: 0, duration: 0.4 }, START[5] + 0.72);
    timeline.from(".bk-catalog", { y: 9, autoAlpha: 0, duration: 0.3 }, START[5] + 1.13);

    timeline.to(".bk-inbox", { y: -83, duration: 0.56, ease: "power2.inOut" }, START[6]);
    show(".bk-log", START[6] + 0.28);
    show(".bk-handoff", START[6] + 0.77, 0);
    show(".bk-customer", START[6] + 0.83, 9);
    show(".bk-staff", START[6] + 1.34, 9);

    hide(".bk-inbox, .bk-log", START[7]);
    show(".og-mx", START[7] + 0.24);
    timeline.from(".og-m", { autoAlpha: 0, y: 12, duration: 0.34, stagger: 0.12 }, START[7] + 0.32);
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
