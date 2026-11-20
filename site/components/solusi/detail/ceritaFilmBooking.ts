import { gsap } from "gsap";
import type { Film } from "./ceritaFilm";
import { BOOKING_JASA } from "./ceritaTiming";

/**
 * Booking Jasa motion graphic (BJ1 "one booking travels"): one paused GSAP timeline over the server-rendered
 * stage (`PanggungBooking.tsx`). The customer's late-night question becomes data chips, the chips land on the
 * day's slots, the accepted slot becomes a numbered booking, the booking becomes a row in the team schedule,
 * and an approved change moves that row. `seek(t, scene)` moves the timeline to the time the page derives
 * from the scroll. Only transform/opacity move, plus the stage background for the night scene.
 */

const { START, END } = BOOKING_JASA;
const DAY = "#e9e4f8";
const NIGHT = "#3b3f86";

export function createFilm(stage: HTMLElement, reduced: boolean): Film {
  const cv = stage.querySelector<HTMLElement>(".bj-cv")!;
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
    const clock = $(".bj-clock");
    const ask = $(".bj-ask");
    const ring = $(".bj-ask .og-ring");
    const hls = $$(".bj-ask .og-hl");
    const chips = $$(".bj-chips .og-chip");
    const chip = (field: string) => $(`.bj-chips .og-chip[data-field="${field}"]`);
    const word = (field: string) => $(`.bj-ask .og-hl[data-field="${field}"]`);
    const reply = $(".bj-reply");
    const day = $(".bj-day");
    const dayHead = $(".bj-day-h");
    const slots = $$(".bj-slot");
    const asked = $(".bj-slot.is-asked");
    const askedPill = $(".bj-slot.is-asked .bj-pill");
    const pick = $(".bj-slot.is-pick");
    const rules = $$(".bj-rules li");
    const rulesBox = $(".bj-rules");
    const offer = $(".bj-offer");
    const loc = $(".bj-loc");
    const card = $(".bj-card");
    const cardItems = $$(".bj-card dl > div");
    const ok = $(".bj-ok");
    const tbl = $(".bj-tbl");
    const newRow = $(".bj-tr.is-new");
    const newCells = Array.from(newRow.children) as HTMLElement[];
    const was = $(".bj-tr.is-new .og-was");
    const now = $(".bj-tr.is-new .og-now");
    const toast = $(".bj-toast");
    const ask2 = $(".bj-ask2");
    const req = $(".bj-req");
    const yes = $(".bj-yes");
    const tick = $(".bj-tick");
    const done = $(".bj-done");
    const ms = $$(".og-m");
    const note = $(".og-mx .og-sample");
    const nums = $$(".og-num[data-to]");

    // One full copy of the pile, so the scroll loops into identical bubbles.
    const half = bubbles[bubbles.length / 2].offsetTop - bubbles[0].offsetTop;

    cv.classList.add("is-film");
    gsap.set(
      [clock, ask, ring, ...chips, reply, day, rulesBox, offer, loc, card, tbl, now, toast, ask2, req, tick, done],
      { autoAlpha: 0 },
    );
    gsap.set([...ms, note], { autoAlpha: 0 });
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

    /* 1 · before: chats pile up, the waiting counter climbs, one chat goes unanswered */
    t.fromTo(list, { y: 0 }, { y: -half, duration: 1.8, ease: "none" }, 0);
    t.fromTo(count, { autoAlpha: 0, y: -10 }, { autoAlpha: 1, y: 0, duration: 0.3 }, 0.1);
    countUp(cnt, Number(cnt.dataset.to), 0.15, 1.3);
    t.fromTo(tag, { scale: 0 }, { scale: 1, duration: 0.25, ease: "back.out(2)" }, 0.5);

    /* 2 · night: the other chats fall away, one question rises to the centre */
    let s = START[1];
    t.to(stage, { backgroundColor: NIGHT, duration: 0.5, ease: "none" }, s);
    t.to(pile, { autoAlpha: 0, y: 50, duration: 0.45, ease: "power2.in" }, s);
    t.to(count, { autoAlpha: 0, y: -10, duration: 0.3, ease: "power2.in" }, s);
    t.fromTo(clock, { autoAlpha: 0, y: -8 }, { autoAlpha: 1, y: 0, duration: 0.3 }, s + 0.3);
    t.fromTo(ask, { autoAlpha: 0, y: 240 }, { autoAlpha: 1, y: 0, duration: 0.7, ease: "power3.out" }, s + 0.2);
    t.fromTo(ring, { autoAlpha: 0, scale: 1.04 }, { autoAlpha: 1, scale: 1, duration: 0.3 }, s + 0.75);

    /* 3 · AI answers: day again, the request words lift out as chips, a priced reply follows */
    s = START[2];
    t.to(stage, { backgroundColor: DAY, duration: 0.5, ease: "none" }, s);
    t.to([clock, ring], { autoAlpha: 0, duration: 0.25 }, s);
    t.to(hls, { backgroundSize: "100% 60%", duration: 0.22, stagger: 0.08, ease: "none" }, s + 0.15);
    chips.forEach((el, k) => {
      const from = delta(el, word(el.dataset.field!));
      t.fromTo(
        el,
        { autoAlpha: 0, x: from.x, y: from.y, scale: 0.85 },
        { autoAlpha: 1, x: 0, y: 0, scale: 1, duration: 0.55, ease: "power3.out" },
        s + 0.5 + k * 0.1,
      );
    });
    t.fromTo(reply, { autoAlpha: 0, y: 16 }, { autoAlpha: 1, y: 0, duration: 0.35 }, s + 1.1);

    /* 4 · slot check: the day opens, the requested time is taken, the next free slot lights up */
    s = START[3];
    t.to([ask, reply], { autoAlpha: 0, y: -20, duration: 0.35, ease: "power2.in" }, s);
    t.fromTo(day, { autoAlpha: 0, y: 24 }, { autoAlpha: 1, y: 0, duration: 0.4 }, s + 0.1);
    t.fromTo(slots, { autoAlpha: 0, x: -10 }, { autoAlpha: 1, x: 0, duration: 0.25, stagger: 0.05 }, s + 0.2);
    const toHead = delta(chip("day"), dayHead);
    const toSlot = delta(chip("time"), asked);
    t.to(chip("service"), { autoAlpha: 0, scale: 0.8, duration: 0.3, ease: "power2.in" }, s + 0.05);
    t.to(
      chip("day"),
      { x: toHead.x, y: toHead.y, scale: 0.6, autoAlpha: 0, duration: 0.5, ease: "power2.inOut" },
      s + 0.25,
    );
    t.to(
      chip("time"),
      { x: toSlot.x + 60, y: toSlot.y, scale: 0.7, autoAlpha: 0, duration: 0.55, ease: "power2.inOut" },
      s + 0.35,
    );
    t.fromTo(askedPill, { scale: 0.4 }, { scale: 1, duration: 0.25, ease: "back.out(2.4)" }, s + 0.8);
    t.fromTo(asked, { x: 0 }, { keyframes: { x: [0, -6, 6, -3, 0] }, duration: 0.3, ease: "none" }, s + 0.85);
    t.fromTo(pick, { scale: 0.96 }, { scale: 1, duration: 0.3, ease: "back.out(2)" }, s + 1.05);
    t.fromTo(rulesBox, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.01 }, s + 0.9);
    t.fromTo(rules, { autoAlpha: 0, y: 10 }, { autoAlpha: 1, y: 0, duration: 0.25, stagger: 0.08 }, s + 0.9);
    t.fromTo(offer, { autoAlpha: 0, y: 16 }, { autoAlpha: 1, y: 0, duration: 0.35 }, s + 1.2);

    /* 5 · saved: the location arrives, the accepted slot becomes a numbered booking */
    s = START[4];
    t.to([day, rulesBox, offer], { autoAlpha: 0, y: -20, duration: 0.35, stagger: 0.04, ease: "power2.in" }, s);
    t.fromTo(loc, { autoAlpha: 0, y: 16 }, { autoAlpha: 1, y: 0, duration: 0.35 }, s + 0.2);
    t.fromTo(card, { autoAlpha: 0, y: 30, scale: 0.92 }, { autoAlpha: 1, y: 0, scale: 1, duration: 0.45 }, s + 0.45);
    t.fromTo(cardItems, { autoAlpha: 0, y: 8 }, { autoAlpha: 1, y: 0, duration: 0.22, stagger: 0.06 }, s + 0.65);
    t.fromTo(ok, { scale: 0.5 }, { scale: 1, duration: 0.25, ease: "back.out(2.4)" }, s + 0.95);

    /* 6 · team sees: the booking folds into the team schedule, a report reaches the team group */
    s = START[5];
    t.to(loc, { autoAlpha: 0, y: -16, duration: 0.3, ease: "power2.in" }, s);
    t.fromTo(tbl, { autoAlpha: 0, y: 20 }, { autoAlpha: 1, y: 0, duration: 0.4 }, s + 0.1);
    const into = delta(card, newRow);
    t.to(
      card,
      { x: into.x, y: into.y, scale: 0.5, autoAlpha: 0, duration: 0.55, ease: "power2.inOut", transformOrigin: "0 0" },
      s + 0.2,
    );
    t.fromTo(newCells, { autoAlpha: 0, x: -10 }, { autoAlpha: 1, x: 0, duration: 0.25, stagger: 0.06 }, s + 0.6);
    t.fromTo(toast, { autoAlpha: 0, y: 24 }, { autoAlpha: 1, y: 0, duration: 0.4 }, s + 0.75);

    /* 7 · change: the customer asks to move, the team taps Yes, the row moves and the customer is told */
    s = START[6];
    t.to(toast, { autoAlpha: 0, y: 16, duration: 0.3, ease: "power2.in" }, s);
    t.fromTo(ask2, { autoAlpha: 0, y: 16 }, { autoAlpha: 1, y: 0, duration: 0.35 }, s + 0.15);
    t.fromTo(req, { autoAlpha: 0, y: 24 }, { autoAlpha: 1, y: 0, duration: 0.4 }, s + 0.45);
    t.fromTo(yes, { scale: 1 }, { keyframes: { scale: [1, 0.9, 1] }, duration: 0.3, ease: "none" }, s + 0.95);
    t.fromTo(tick, { scale: 0 }, { autoAlpha: 1, scale: 1, duration: 0.25, ease: "back.out(2.4)" }, s + 1.05);
    t.to(was, { autoAlpha: 0, y: -10, duration: 0.2 }, s + 1.15);
    t.fromTo(now, { autoAlpha: 0, y: 10 }, { autoAlpha: 1, y: 0, duration: 0.2 }, s + 1.2);
    t.to(ask2, { autoAlpha: 0, y: -10, duration: 0.25, ease: "power2.in" }, s + 1.3);
    t.fromTo(done, { autoAlpha: 0, y: 16 }, { autoAlpha: 1, y: 0, duration: 0.35 }, s + 1.45);

    /* 8 · results: the schedule gives way to three sample figures */
    s = START[7];
    t.to([tbl, req, done], { autoAlpha: 0, y: 30, scale: 0.94, duration: 0.4, stagger: 0.04, ease: "power2.in" }, s);
    t.fromTo(ms, { autoAlpha: 0, y: 24 }, { autoAlpha: 1, y: 0, duration: 0.4, stagger: 0.12 }, s + 0.3);
    t.fromTo(note, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.2 }, s + 0.75);
    nums.forEach((el, k) => countUp(el, Number(el.dataset.to), s + 0.35 + k * 0.12, 0.6));

    /* 9 · for you: the figures stay, dimmed; the CTA lives in the caption */
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
