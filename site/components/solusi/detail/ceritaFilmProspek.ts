import { gsap } from "gsap";
import type { Film } from "./ceritaFilm";
import { FOLLOWUP_PROSPEK } from "./ceritaTiming";

/**
 * Follow-up Prospek motion graphic (FP1 "one prospect row travels"): one paused GSAP timeline over the
 * server-rendered stage (`PanggungProspek.tsx`). The morning clock folds into the prospect table, two filters dim
 * every row but one, that row rises as a card whose summary lifts out two chips, the chips fold into a short AI
 * draft, the draft lands with the marketing team who send it, and the team card folds back into the row, which is
 * marked as contacted. `seek(t, scene)` moves the timeline to the time the page derives from the scroll. Only
 * transform/opacity move.
 */

const { START, END } = FOLLOWUP_PROSPEK;

export function createFilm(stage: HTMLElement, reduced: boolean): Film {
  const cv = stage.querySelector<HTMLElement>(".fp-cv")!;
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
  /** Offset that puts the centre of `from` on the centre of `to`. */
  const centre = (from: HTMLElement, to: HTMLElement) => {
    const d = delta(from, to);
    return { x: d.x + (to.offsetWidth - from.offsetWidth) / 2, y: d.y + (to.offsetHeight - from.offsetHeight) / 2 };
  };
  let tl: gsap.core.Timeline;

  const ctx = gsap.context(() => {
    const pile = $(".og-pile");
    const list = $(".og-list");
    const bubbles = $$(".og-list .og-bub");
    const tag = $(".og-tag");
    const count = $(".og-count");
    const cnt = $(".og-cnt");
    const alarm = $(".fp-alarm");
    const filters = $(".fp-filters");
    const filterChips = $$(".fp-filters .og-chip");
    const table = $(".fp-table");
    const thTime = $(".fp-th small");
    const thTag = $(".fp-th .og-sample");
    const rows = $$(".fp-tr");
    const pickRow = $(".fp-tr.is-pick");
    const others = rows.filter((row) => row !== pickRow);
    const glow = $(".fp-glow");
    const was = $$(".fp-tr.is-pick .og-was");
    const now = $$(".fp-tr.is-pick .og-now");
    const lead = $(".fp-lead");
    const hls = $$(".fp-lead .og-hl");
    const chips = $$(".fp-chips .og-chip");
    const word = (field: string) => $(`.fp-lead .og-hl[data-field="${field}"]`);
    const draft = $(".fp-draft");
    const team = $(".fp-team");
    const slot = $(".fp-slot");
    const send = $(".fp-send");
    const sent = $(".fp-sent");
    const ms = $$(".og-m");
    const note = $(".og-mx .og-sample");
    const nums = $$(".og-num[data-to]");

    // One full copy of the pile, so the scroll loops into identical bubbles.
    const half = bubbles[bubbles.length / 2].offsetTop - bubbles[0].offsetTop;
    // The team card keeps a slot exactly as tall as the draft that lands in it.
    slot.style.height = `${draft.offsetHeight}px`;

    cv.classList.add("is-film");
    gsap.set([alarm, filters, table, glow, thTag, ...now, lead, ...chips, draft, team, sent], { autoAlpha: 0 });
    gsap.set([...ms, note], { autoAlpha: 0 });
    gsap.set(hls, { backgroundSize: "0% 60%" });
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

    /* 1 · before: "I'll let you know" chats pile up, the counter of prospects never contacted again climbs */
    t.fromTo(list, { y: 0 }, { y: -half, duration: 1.8, ease: "none" }, 0);
    t.fromTo(count, { autoAlpha: 0, y: -10 }, { autoAlpha: 1, y: 0, duration: 0.3 }, 0.1);
    countUp(cnt, Number(cnt.dataset.to), 0.15, 1.3);
    t.fromTo(tag, { scale: 0 }, { scale: 1, duration: 0.25, ease: "back.out(2)" }, 0.5);

    /* 2 · every morning: the chats fall away, the ten o'clock check appears */
    let s = START[1];
    t.to(pile, { autoAlpha: 0, y: 50, duration: 0.45, ease: "power2.in" }, s);
    t.to(count, { autoAlpha: 0, y: -10, duration: 0.3, ease: "power2.in" }, s);
    t.fromTo(
      alarm,
      { autoAlpha: 0, scale: 0.8 },
      { autoAlpha: 1, scale: 1, duration: 0.5, ease: "back.out(1.6)" },
      s + 0.3,
    );
    t.fromTo($(".fp-alarm svg"), { rotate: -40 }, { rotate: 0, duration: 0.6 }, s + 0.3);

    /* 3 · read prospects: the clock folds into the table header, the rows come in */
    s = START[2];
    const toTime = centre(alarm, thTime);
    t.to(alarm, { x: toTime.x, y: toTime.y, scale: 0.2, autoAlpha: 0, duration: 0.55, ease: "power2.inOut" }, s);
    t.fromTo(table, { autoAlpha: 0, y: 20 }, { autoAlpha: 1, y: 0, duration: 0.4 }, s + 0.2);
    t.fromTo(rows, { autoAlpha: 0, x: -10 }, { autoAlpha: 1, x: 0, duration: 0.25, stagger: 0.08 }, s + 0.4);

    /* 4 · filter: two conditions, every row but one dims */
    s = START[3];
    t.fromTo(filters, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.01 }, s);
    t.fromTo(filterChips, { autoAlpha: 0, y: -10 }, { autoAlpha: 1, y: 0, duration: 0.3, stagger: 0.12 }, s + 0.05);
    t.to(others, { opacity: 0.35, duration: 0.3, stagger: 0.08 }, s + 0.5);
    t.fromTo(glow, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.25 }, s + 0.85);
    t.fromTo(pickRow, { scale: 1 }, { keyframes: { scale: [1, 1.03, 1] }, duration: 0.3, ease: "none" }, s + 0.85);

    /* 5 · AI writes: the row rises as a card, two phrases lift out and fold into a short draft */
    s = START[4];
    t.to(filters, { autoAlpha: 0, y: -10, duration: 0.25, ease: "power2.in" }, s);
    const fromRow = delta(lead, pickRow);
    t.fromTo(
      lead,
      { autoAlpha: 0, x: fromRow.x, y: fromRow.y, scale: 0.96 },
      { autoAlpha: 1, x: 0, y: 0, scale: 1, duration: 0.6, ease: "power3.inOut" },
      s + 0.05,
    );
    t.to(table, { autoAlpha: 0, y: 12, scale: 0.97, duration: 0.35, ease: "power2.in" }, s + 0.05);
    t.to(hls, { backgroundSize: "100% 60%", duration: 0.22, stagger: 0.12, ease: "none" }, s + 0.65);
    chips.forEach((el, k) => {
      const from = delta(el, word(el.dataset.field!));
      t.fromTo(
        el,
        { autoAlpha: 0, x: from.x, y: from.y, scale: 0.85 },
        { autoAlpha: 1, x: 0, y: 0, scale: 1, duration: 0.5, ease: "power3.out" },
        s + 0.95 + k * 0.12,
      );
    });
    t.fromTo(draft, { autoAlpha: 0, y: 16 }, { autoAlpha: 1, y: 0, duration: 0.35 }, s + 1.45);
    chips.forEach((el, k) => {
      const into = centre(el, draft);
      t.to(
        el,
        { x: into.x, y: into.y, scale: 0.6, autoAlpha: 0, duration: 0.45, ease: "power2.in" },
        s + 1.55 + k * 0.08,
      );
    });

    /* 6 · draft to team: the draft lands in the marketing team card, the team sends it */
    s = START[5];
    t.to(lead, { autoAlpha: 0, y: -20, duration: 0.3, ease: "power2.in" }, s);
    t.fromTo(team, { autoAlpha: 0, y: 20 }, { autoAlpha: 1, y: 0, duration: 0.4 }, s + 0.15);
    const toSlot = delta(draft, slot);
    t.to(draft, { x: toSlot.x, y: toSlot.y, duration: 0.6, ease: "power3.inOut" }, s + 0.3);
    t.fromTo(send, { scale: 0.6 }, { scale: 1, duration: 0.25, ease: "back.out(2.4)" }, s + 0.9);
    t.to(send, { keyframes: { scale: [1, 0.9, 1] }, duration: 0.25, ease: "none" }, s + 1.15);
    t.to(send, { autoAlpha: 0, duration: 0.15 }, s + 1.35);
    t.fromTo(sent, { autoAlpha: 0, scale: 0.8 }, { autoAlpha: 1, scale: 1, duration: 0.25 }, s + 1.4);

    /* 7 · table updated (design step): the sent card folds into the row, which is marked as contacted */
    s = START[6];
    t.to(glow, { autoAlpha: 0, duration: 0.01 }, s);
    t.to(table, { autoAlpha: 1, y: 0, scale: 1, duration: 0.4 }, s + 0.1);
    t.to(others, { opacity: 1, duration: 0.3 }, s + 0.1);
    const intoTeam = centre(team, pickRow);
    const intoDraft = centre(draft, pickRow);
    t.to(team, { x: intoTeam.x, y: intoTeam.y, scale: 0.2, autoAlpha: 0, duration: 0.55, ease: "power2.in" }, s + 0.2);
    t.to(
      draft,
      { x: intoDraft.x, y: intoDraft.y, scale: 0.2, autoAlpha: 0, duration: 0.55, ease: "power2.in" },
      s + 0.2,
    );
    t.fromTo(pickRow, { scale: 1 }, { keyframes: { scale: [1, 1.03, 1] }, duration: 0.3, ease: "none" }, s + 0.75);
    t.to(was, { autoAlpha: 0, y: -10, duration: 0.2, stagger: 0.08 }, s + 0.8);
    t.fromTo(now, { autoAlpha: 0, y: 10 }, { autoAlpha: 1, y: 0, duration: 0.2, stagger: 0.08 }, s + 0.85);
    t.fromTo(
      thTag,
      { autoAlpha: 0, scale: 0.5 },
      { autoAlpha: 1, scale: 1, duration: 0.25, ease: "back.out(2.4)" },
      s + 1.05,
    );

    /* 8 · results: the table gives way to three sample figures */
    s = START[7];
    t.to(table, { autoAlpha: 0, y: 30, scale: 0.94, duration: 0.4, ease: "power2.in" }, s);
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
