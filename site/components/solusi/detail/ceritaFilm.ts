import { gsap } from "gsap";
import { END, START } from "./ceritaTiming";

/**
 * Order Grup motion graphic (OG5b "one order travels"): one paused GSAP timeline over the server-rendered
 * stage (`Panggung.tsx`). Every scene's main object comes from the previous one: the order bubble's words
 * become chips, the chips fly into the table row, the row answers in the group, the table folds into the
 * recap. Scroll never plays the timeline; `seek(t, scene)` moves it to the time the page derives from the scroll.
 * Only transform/opacity move, plus the stage background for the night scene.
 */

export type Film = {
  /** Move to timeline time `t` (seconds); with reduced motion, jump to the end pose of `scene` instead. */
  seek(t: number, scene: number): void;
  dispose(): void;
};

const DAY = "#e9e4f8";
const NIGHT = "#3b3f86";

export function createFilm(stage: HTMLElement, reduced: boolean): Film {
  const cv = stage.querySelector<HTMLElement>(".og-cv")!;
  const $ = (selector: string) => cv.querySelector<HTMLElement>(selector)!;
  const $$ = (selector: string) => Array.from(cv.querySelectorAll<HTMLElement>(selector));
  // Layout position inside the canvas in design px (offsets ignore transforms, so the scale does not matter).
  const pos = (el: HTMLElement) => {
    let x = 0;
    let y = 0;
    for (let node: HTMLElement | null = el; node && node !== cv; node = node.offsetParent as HTMLElement | null) {
      x += node.offsetLeft;
      y += node.offsetTop;
    }
    return { x, y };
  };
  const delta = (from: HTMLElement, to: HTMLElement) => {
    const a = pos(from);
    const b = pos(to);
    return { x: b.x - a.x, y: b.y - a.y };
  };
  let tl: gsap.core.Timeline;

  const ctx = gsap.context(() => {
    const pile = $(".og-pile");
    const list = $(".og-list");
    const bubbles = $$(".og-list .og-bub");
    const tag = $(".og-tag");
    const count = $(".og-count");
    const cnt = $(".og-cnt");
    const order = $(".og-order");
    const ring = $(".og-ring");
    const hls = $$(".og-hl");
    const chips = $$(".og-chip");
    const tbl = $(".og-tbl");
    const newRow = $(".og-tr.is-new");
    const newCells = Array.from(newRow.children) as HTMLElement[];
    const cell = {
      customer: $(".og-tr.is-new .og-c-customer"),
      item: $(".og-tr.is-new .og-c-item"),
    };
    const rev = $(".og-rev");
    const was = $(".og-was");
    const now = $(".og-now");
    const sNew = $(".og-st.is-live .og-s-new");
    const sSent = $(".og-st.is-live .og-s-sent");
    const sDone = $(".og-st.is-live .og-s-done");
    const reply = $(".og-reply");
    const courier = $$(".og-courier");
    const ntf = $(".og-ntf");
    const ntfItems = $$(".og-ntf dl > div, .og-ntf .og-sample");
    const ms = $$(".og-m");
    const note = $(".og-mx .og-sample");
    const nums = $$(".og-num[data-to]");

    // One full copy of the pile, so the scroll loops into identical bubbles.
    const half = bubbles[bubbles.length / 2].offsetTop - bubbles[0].offsetTop;
    const wordOf = (field: string) => $(`.og-hl[data-field="${field}"]`);

    cv.classList.add("is-film");
    gsap.set([order, ring, ...chips, tbl, ...newCells, rev, now, sSent, sDone, reply, ...courier, ntf, ...ms, note], {
      autoAlpha: 0,
    });
    gsap.set(hls, { backgroundSize: "0% 60%" });
    gsap.set(stage, { backgroundColor: DAY });
    cnt.textContent = "0";
    nums.forEach((el) => (el.textContent = "0"));

    const t = gsap.timeline({ paused: true, defaults: { ease: "power2.out", duration: 0.4 } });
    tl = t;
    const countUp = (el: HTMLElement, to: number, at: number, duration: number) => {
      const o = { v: 0 };
      t.fromTo(
        o,
        { v: 0 },
        {
          v: to,
          duration,
          ease: "power1.out",
          onUpdate: () => {
            el.textContent = String(Math.round(o.v));
          },
        },
        at,
      );
    };

    /* 1 · before: the group keeps scrolling, the counter climbs, one change is missed, a new order lands */
    t.fromTo(list, { y: 0 }, { y: -half, duration: 1.8, ease: "none" }, 0);
    t.fromTo(count, { autoAlpha: 0, y: -10 }, { autoAlpha: 1, y: 0, duration: 0.3 }, 0.1);
    countUp(cnt, Number(cnt.dataset.to), 0.15, 1.3);
    t.fromTo(tag, { scale: 0 }, { scale: 1, duration: 0.25, ease: "back.out(2)" }, 0.5);
    t.fromTo(order, { autoAlpha: 0, y: 330 }, { autoAlpha: 1, y: 300, duration: 0.4 }, 1.2);

    /* 2 · one message: the rest of the group falls away, the order rises to the centre */
    let s = START[1];
    t.to(pile, { autoAlpha: 0, y: 50, duration: 0.5, ease: "power2.in" }, s);
    t.to(count, { autoAlpha: 0, y: -10, duration: 0.3, ease: "power2.in" }, s);
    t.to(order, { y: 0, duration: 0.8, ease: "power3.inOut" }, s + 0.1);
    t.fromTo(ring, { autoAlpha: 0, scale: 1.04 }, { autoAlpha: 1, scale: 1, duration: 0.3 }, s + 0.75);

    /* 3 · AI reads: the data words are marked, then lift out of the bubble as chips */
    s = START[2];
    t.to(ring, { autoAlpha: 0, duration: 0.25 }, s);
    t.to(hls, { backgroundSize: "100% 60%", duration: 0.22, stagger: 0.08, ease: "none" }, s + 0.1);
    chips.forEach((chip, k) => {
      const from = delta(chip, wordOf(chip.dataset.field!));
      t.fromTo(
        chip,
        { autoAlpha: 0, x: from.x, y: from.y, scale: 0.85 },
        { autoAlpha: 1, x: 0, y: 0, scale: 1, duration: 0.55, ease: "power3.out" },
        s + 0.55 + k * 0.1,
      );
    });

    /* 4 · saved: the bubble leaves, the chips fly into a new table row; a change updates another row */
    s = START[3];
    t.to(order, { autoAlpha: 0, y: -24, duration: 0.4, ease: "power2.in" }, s);
    t.fromTo(tbl, { autoAlpha: 0, y: 30 }, { autoAlpha: 1, y: 0, duration: 0.45 }, s + 0.15);
    chips.forEach((chip, k) => {
      const into = delta(chip, chip.dataset.field === "customer" ? cell.customer : cell.item);
      t.to(
        chip,
        { x: into.x, y: into.y, scale: 0.6, autoAlpha: 0, duration: 0.5, ease: "power2.inOut" },
        s + 0.45 + k * 0.06,
      );
    });
    t.fromTo(newCells, { autoAlpha: 0, x: -10 }, { autoAlpha: 1, x: 0, duration: 0.25, stagger: 0.06 }, s + 0.8);
    t.fromTo(
      rev,
      { autoAlpha: 0, scale: 0.6 },
      { autoAlpha: 1, scale: 1, duration: 0.25, ease: "back.out(2)" },
      s + 1.0,
    );
    t.to(was, { autoAlpha: 0, y: -10, duration: 0.2 }, s + 1.1);
    t.fromTo(now, { autoAlpha: 0, y: 10 }, { autoAlpha: 1, y: 0, duration: 0.2 }, s + 1.15);

    /* 5 · confirmed: the new row answers in the group */
    s = START[4];
    t.to(rev, { autoAlpha: 0, duration: 0.2 }, s);
    const out = delta(reply, newRow);
    t.fromTo(
      reply,
      { autoAlpha: 0, x: out.x, y: out.y, scale: 0.5 },
      { autoAlpha: 1, x: 0, y: 0, scale: 1, duration: 0.55, ease: "power3.out" },
      s + 0.05,
    );

    /* 6 · status: two short courier replies move the status pill */
    s = START[5];
    t.fromTo(courier[0], { autoAlpha: 0, y: 14 }, { autoAlpha: 1, y: 0, duration: 0.3 }, s + 0.05);
    t.to(sNew, { autoAlpha: 0, y: -8, duration: 0.2 }, s + 0.4);
    t.fromTo(sSent, { autoAlpha: 0, y: 8 }, { autoAlpha: 1, y: 0, duration: 0.2 }, s + 0.45);
    t.fromTo(courier[1], { autoAlpha: 0, y: 14 }, { autoAlpha: 1, y: 0, duration: 0.3 }, s + 0.7);
    t.to(sSent, { autoAlpha: 0, y: -8, duration: 0.2 }, s + 1.05);
    t.fromTo(sDone, { autoAlpha: 0, y: 8 }, { autoAlpha: 1, y: 0, duration: 0.2 }, s + 1.1);

    /* 7 · recap: night falls, the day folds into one message for the owner */
    s = START[6];
    t.to(stage, { backgroundColor: NIGHT, duration: 0.6, ease: "none" }, s);
    t.to(
      [tbl, reply, ...courier],
      { autoAlpha: 0, y: 40, scale: 0.9, duration: 0.45, stagger: 0.04, ease: "power2.in" },
      s,
    );
    t.fromTo(ntf, { autoAlpha: 0, y: 40, scale: 0.88 }, { autoAlpha: 1, y: 0, scale: 1, duration: 0.5 }, s + 0.4);
    t.fromTo(ntfItems, { autoAlpha: 0, y: 8 }, { autoAlpha: 1, y: 0, duration: 0.25, stagger: 0.07 }, s + 0.7);

    /* 8 · results: day again, the recap gives way to three sample figures */
    s = START[7];
    t.to(ntf, { autoAlpha: 0, scale: 1.04, duration: 0.35, ease: "power2.in" }, s);
    t.to(stage, { backgroundColor: DAY, duration: 0.5, ease: "none" }, s + 0.05);
    t.fromTo(ms, { autoAlpha: 0, y: 24 }, { autoAlpha: 1, y: 0, duration: 0.4, stagger: 0.12 }, s + 0.3);
    t.fromTo(note, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.2 }, s + 0.75);
    nums.forEach((el, k) => countUp(el, Number(el.dataset.to), s + 0.35 + k * 0.12, 0.6));

    /* 9 · for you: the figures stay, dimmed; the CTA lives in the card */
    t.to(ms, { opacity: 0.45, duration: 0.4 }, START[8]);

    t.set({}, {}, END[8]);
  }, stage);

  let current = -1;

  return {
    seek(time, scene) {
      if (reduced) {
        if (scene !== current) tl.seek(END[scene], false);
      } else {
        gsap.to(tl, { time, duration: 0.45, ease: "power3.out", overwrite: true });
      }
      current = scene;
    },
    dispose() {
      gsap.killTweensOf(tl);
      ctx.revert();
      cv.classList.remove("is-film");
    },
  };
}
