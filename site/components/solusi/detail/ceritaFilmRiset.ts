import { gsap } from "gsap";
import type { Film } from "./ceritaFilm";
import { RISET_KONTEN } from "./ceritaTiming";

/**
 * Riset Konten motion graphic (RK1 "one topic travels"): one paused GSAP timeline over the server-rendered
 * stage (`PanggungRiset.tsx`). Idea notes gather into the topic list, the evening session picks a topic, the
 * topic becomes a trend summary whose phrases lift out as keywords, the keywords pull in posts that sort by
 * likes, the top posts fold into an audience-pattern card, the card becomes a row in the research table, and
 * the team approves it. `seek(t, scene)` moves the timeline to the time the page derives from the scroll. Only
 * transform/opacity move, plus the stage background for the night scene.
 */

const { START, END } = RISET_KONTEN;
const DAY = "#e9e4f8";
const NIGHT = "#3b3f86";
/** Slot each post (listed from most to least liked) starts in before the sort. */
const SHUFFLE = [3, 0, 5, 1, 4, 2];
/** Posts that make the cut and feed the audience pattern. */
const TOP = 4;

export function createFilm(stage: HTMLElement, reduced: boolean): Film {
  const cv = stage.querySelector<HTMLElement>(".rk-cv")!;
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
    const notes = $$(".rk-note");
    const count = $(".og-count");
    const cnt = $(".og-cnt");
    const clock = $(".rk-clock");
    const topics = $(".rk-topics");
    const rows = $$(".rk-topics li");
    const pickRow = $(".rk-topics li.is-pick");
    const sel = $(".rk-sel");
    const pick = rows.indexOf(pickRow);
    const pill = $(".rk-topic");
    const sum = $(".rk-sum");
    const hls = $$(".rk-sum .og-hl");
    const kws = $(".rk-kws");
    const chips = $$(".rk-kws .og-chip");
    const word = (k: string) => $(`.rk-sum .og-hl[data-k="${k}"]`);
    const posts = $$(".rk-post");
    const sort = $(".rk-sort");
    const ana = $(".rk-ana");
    const anaItems = $$(".rk-ana :is(.rk-lbl, .rk-cmp li, .rk-angle)");
    const sc = $(".rk-sc");
    const tbl = $(".rk-tbl");
    const newRow = $(".rk-tr.is-new");
    const newCells = Array.from(newRow.children) as HTMLElement[];
    const was = $(".rk-tr.is-new .og-was");
    const now = $(".rk-tr.is-new .og-now");
    const ntf = $(".rk-ntf");
    const yes = $(".bj-yes");
    const tick = $(".bj-tick");
    const ms = $$(".og-m");
    const note = $(".og-mx .og-sample");
    const nums = $$(".og-num[data-to]");

    cv.classList.add("is-film");
    gsap.set([clock, topics, pill, sum, ...chips, ...posts, sort, ana, tbl, ntf, now, tick], { autoAlpha: 0 });
    gsap.set([...ms, note], { autoAlpha: 0 });
    gsap.set(hls, { backgroundSize: "0% 60%" });
    gsap.set(stage, { backgroundColor: DAY });
    cnt.textContent = "0";
    sc.textContent = "0";
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

    /* 1 · before: idea notes pile up while the hours spent looking for ideas climb */
    t.fromTo(
      notes,
      { autoAlpha: 0, y: 18, scale: 0.9 },
      { autoAlpha: 1, y: 0, scale: 1, duration: 0.35, stagger: 0.12, ease: "back.out(1.6)" },
      0,
    );
    t.fromTo(count, { autoAlpha: 0, y: -10 }, { autoAlpha: 1, y: 0, duration: 0.3 }, 0.1);
    countUp(cnt, Number(cnt.dataset.to), 0.2, 1.2);

    /* 2 · night: the notes gather into the topic list, the evening session lands on the next topic */
    let s = START[1];
    t.to(stage, { backgroundColor: NIGHT, duration: 0.5, ease: "none" }, s);
    t.to(count, { autoAlpha: 0, y: -10, duration: 0.3, ease: "power2.in" }, s);
    notes.forEach((el, k) => {
      const into = centre(el, topics);
      t.to(
        el,
        { x: into.x, y: into.y, scale: 0.4, autoAlpha: 0, duration: 0.5, ease: "power2.in" },
        s + 0.05 + k * 0.04,
      );
    });
    t.fromTo(clock, { autoAlpha: 0, y: -8 }, { autoAlpha: 1, y: 0, duration: 0.3 }, s + 0.3);
    t.fromTo(topics, { autoAlpha: 0, scale: 0.92 }, { autoAlpha: 1, scale: 1, duration: 0.4 }, s + 0.4);
    t.fromTo(rows, { autoAlpha: 0, x: -10 }, { autoAlpha: 1, x: 0, duration: 0.25, stagger: 0.05 }, s + 0.5);
    t.fromTo(sel, { autoAlpha: 0, y: -pick * 58 }, { autoAlpha: 1, duration: 0.2 }, s + 0.75);
    t.to(sel, { y: 0, duration: 0.6, ease: "power2.inOut" }, s + 0.9);
    t.fromTo(sel, { scale: 1 }, { keyframes: { scale: [1, 1.04, 1] }, duration: 0.25, ease: "none" }, s + 1.35);

    /* 3 · AI research: day again, the topic becomes a pill, a trend summary arrives, its phrases lift out */
    s = START[2];
    t.to(stage, { backgroundColor: DAY, duration: 0.5, ease: "none" }, s);
    t.to(clock, { autoAlpha: 0, duration: 0.25 }, s);
    const fromRow = delta(pill, pickRow);
    t.fromTo(
      pill,
      { autoAlpha: 0, x: fromRow.x, y: fromRow.y },
      { autoAlpha: 1, x: 0, y: 0, duration: 0.6, ease: "power3.inOut" },
      s + 0.1,
    );
    t.to([topics, sel], { autoAlpha: 0, y: 20, duration: 0.35, ease: "power2.in" }, s + 0.1);
    t.fromTo(sum, { autoAlpha: 0, y: 20 }, { autoAlpha: 1, y: 0, duration: 0.4 }, s + 0.5);
    t.to(hls, { backgroundSize: "100% 60%", duration: 0.22, stagger: 0.1, ease: "none" }, s + 0.9);
    chips.forEach((el, k) => {
      const from = delta(el, word(el.dataset.k!));
      t.fromTo(
        el,
        { autoAlpha: 0, x: from.x, y: from.y, scale: 0.85 },
        { autoAlpha: 1, x: 0, y: 0, scale: 1, duration: 0.55, ease: "power3.out" },
        s + 1.2 + k * 0.1,
      );
    });

    /* 4 · popular posts: the keywords rise, posts arrive and sort by likes, the weakest fade */
    s = START[3];
    t.to([sum, pill], { autoAlpha: 0, y: -20, duration: 0.35, stagger: 0.04, ease: "power2.in" }, s);
    t.to(kws, { y: -280, duration: 0.55, ease: "power2.inOut" }, s + 0.1);
    const offsets = posts.map((el, k) => delta(el, posts[SHUFFLE[k]]));
    posts.forEach((el, k) => {
      t.fromTo(
        el,
        { autoAlpha: 0, x: offsets[k].x, y: offsets[k].y + 16, scale: 0.9 },
        { autoAlpha: 1, x: offsets[k].x, y: offsets[k].y, scale: 1, duration: 0.3 },
        s + 0.45 + SHUFFLE[k] * 0.06,
      );
    });
    t.to(posts, { x: 0, y: 0, duration: 0.6, ease: "power2.inOut", stagger: 0.03 }, s + 1.05);
    t.fromTo(sort, { autoAlpha: 0, y: 8 }, { autoAlpha: 1, y: 0, duration: 0.3 }, s + 1.05);
    t.to(posts.slice(TOP), { opacity: 0.35, scale: 0.97, duration: 0.3 }, s + 1.65);

    /* 5 · audience pattern: the top posts fold into one card with complaints, an angle and a score */
    s = START[4];
    t.to([kws, sort], { autoAlpha: 0, duration: 0.3, ease: "power2.in" }, s);
    t.to(posts.slice(TOP), { autoAlpha: 0, duration: 0.3, ease: "power2.in" }, s);
    posts.slice(0, TOP).forEach((el, k) => {
      const into = centre(el, ana);
      t.to(
        el,
        { x: into.x, y: into.y, scale: 0.45, autoAlpha: 0, duration: 0.5, ease: "power2.in" },
        s + 0.1 + k * 0.05,
      );
    });
    t.fromTo(ana, { autoAlpha: 0, scale: 0.92 }, { autoAlpha: 1, scale: 1, duration: 0.4 }, s + 0.5);
    t.fromTo(anaItems, { autoAlpha: 0, y: 8 }, { autoAlpha: 1, y: 0, duration: 0.22, stagger: 0.05 }, s + 0.7);
    countUp(sc, Number(sc.dataset.to), s + 0.8, 0.6);

    /* 6 · research table: the card folds into a new row under the earlier sessions */
    s = START[5];
    t.fromTo(tbl, { autoAlpha: 0, y: 20 }, { autoAlpha: 1, y: 0, duration: 0.4 }, s + 0.1);
    const into = delta(ana, newRow);
    t.to(
      ana,
      { x: into.x, y: into.y, scale: 0.5, autoAlpha: 0, duration: 0.55, ease: "power2.inOut", transformOrigin: "0 0" },
      s + 0.2,
    );
    t.fromTo(newCells, { autoAlpha: 0, x: -10 }, { autoAlpha: 1, x: 0, duration: 0.25, stagger: 0.06 }, s + 0.6);

    /* 7 · the team picks: the summary reaches the team group, Approve is tapped, the row turns approved */
    s = START[6];
    t.fromTo(ntf, { autoAlpha: 0, y: 24 }, { autoAlpha: 1, y: 0, duration: 0.4 }, s + 0.15);
    t.fromTo(yes, { scale: 1 }, { keyframes: { scale: [1, 0.9, 1] }, duration: 0.3, ease: "none" }, s + 0.75);
    t.fromTo(tick, { scale: 0 }, { autoAlpha: 1, scale: 1, duration: 0.25, ease: "back.out(2.4)" }, s + 0.85);
    t.to(was, { autoAlpha: 0, y: -10, duration: 0.2 }, s + 0.95);
    t.fromTo(now, { autoAlpha: 0, y: 10 }, { autoAlpha: 1, y: 0, duration: 0.2 }, s + 1.0);

    /* 8 · results: the table gives way to three sample figures */
    s = START[7];
    t.to([tbl, ntf], { autoAlpha: 0, y: 30, scale: 0.94, duration: 0.4, stagger: 0.04, ease: "power2.in" }, s);
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
