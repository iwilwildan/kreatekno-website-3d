import { gsap } from "gsap";
import type { Film } from "./ceritaFilm";
import { CATAT_PENGELUARAN } from "./ceritaTiming";

/**
 * Catat Pengeluaran motion graphic (CP1 "one receipt travels"): one paused GSAP timeline over the server-rendered
 * stage (`PanggungNota.tsx`). The receipt pile gives way to three ways to send, the photo is picked and lands in
 * the chat, the photo grows into the receipt which a scan line reads, the shop, date and total lift out as chips and
 * AI adds the category, the receipt folds into a card that passes the check beside a blurry one that is asked
 * again, the passing card folds into a new row of the spending table with a confirmation, and the owner's morning
 * recap fills its bars. `seek(t, scene)` moves the timeline to the time the page derives from the scroll. Only
 * transform/opacity (and the highlight background size) move.
 */

const { START, END } = CATAT_PENGELUARAN;

export function createFilm(stage: HTMLElement, reduced: boolean): Film {
  const cv = stage.querySelector<HTMLElement>(".cp-cv")!;
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
    const slips = $$(".og-list .og-bub");
    const tag = $(".og-tag");
    const count = $(".og-count");
    const cnt = $(".og-cnt");
    const ways = $(".cp-ways");
    const wayItems = $$(".cp-ways li");
    const photoWay = $(".cp-ways li.is-pick");
    const pick = $(".cp-pick");
    const chat = $(".cp-chat");
    const msg = $(".cp-msg");
    const chatThumb = $(".cp-msg .cp-thumb");
    const receipt = $(".cp-receipt");
    const scan = $(".cp-scan");
    const hls = $$(".cp-receipt .og-hl");
    const itemHls = $$(".cp-receipt .og-hl[data-field=item]");
    const word = (field: string) => $(`.cp-receipt .og-hl[data-field="${field}"]`);
    const chips = $$(".cp-chips .og-chip");
    const ok = $(".cp-ok");
    const okThumb = $(".cp-ok .cp-thumb");
    const okPill = $(".cp-ok .cp-pill");
    const bad = $(".cp-bad");
    const badPill = $(".cp-bad .cp-pill");
    const ask = $(".cp-ask");
    const table = $(".cp-table");
    const newRow = $(".cp-tr.is-new");
    const oldRows = $$(".cp-tr").filter((row) => row !== newRow);
    const glow = $(".cp-glow");
    const confirm = $(".cp-confirm");
    const clock = $(".cp-clock");
    const recap = $(".cp-recap");
    const bars = $$(".cp-bar-t i");
    const ms = $$(".og-m");
    const note = $(".og-mx .og-sample");
    const nums = $$(".og-num[data-to]");

    // One full copy of the pile, so the scroll loops into identical slips.
    const half = slips[slips.length / 2].offsetTop - slips[0].offsetTop;

    cv.classList.add("is-film");
    gsap.set([ways, pick, chat, receipt, ...chips, ok, bad, ask, table, newRow, glow, confirm, clock, recap], {
      autoAlpha: 0,
    });
    gsap.set([...ms, note], { autoAlpha: 0 });
    gsap.set(hls, { backgroundSize: "0% 60%" });
    gsap.set(bars, { scaleX: 0 });
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

    /* 1 · before: receipts pile up, the counter of unrecorded receipts climbs */
    t.fromTo(list, { y: 0 }, { y: -half, duration: 1.8, ease: "none" }, 0);
    t.fromTo(count, { autoAlpha: 0, y: -10 }, { autoAlpha: 1, y: 0, duration: 0.3 }, 0.1);
    countUp(cnt, Number(cnt.dataset.to), 0.15, 1.3);
    t.fromTo(tag, { scale: 0 }, { scale: 1, duration: 0.25, ease: "back.out(2)" }, 0.5);

    /* 2 · receipt sent: three ways to send, the photo is picked and lands in the chat */
    let s = START[1];
    t.to(pile, { autoAlpha: 0, y: 50, duration: 0.45, ease: "power2.in" }, s);
    t.to(count, { autoAlpha: 0, y: -10, duration: 0.3, ease: "power2.in" }, s);
    t.fromTo(ways, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.01 }, s + 0.2);
    t.fromTo(wayItems, { autoAlpha: 0, y: 14 }, { autoAlpha: 1, y: 0, duration: 0.3, stagger: 0.1 }, s + 0.2);
    t.fromTo(pick, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.25 }, s + 0.6);
    t.fromTo(photoWay, { scale: 1 }, { keyframes: { scale: [1, 1.06, 1] }, duration: 0.3, ease: "none" }, s + 0.6);
    t.fromTo(chat, { autoAlpha: 0, y: 20 }, { autoAlpha: 1, y: 0, duration: 0.4 }, s + 0.8);
    const fromWay = centre(msg, photoWay);
    t.fromTo(
      msg,
      { x: fromWay.x, y: fromWay.y, scale: 0.4 },
      { x: 0, y: 0, scale: 1, duration: 0.55, ease: "power3.out" },
      s + 0.9,
    );

    /* 3 · receipt read: the photo grows into the receipt, a scan line reads it line by line */
    s = START[2];
    t.to(ways, { autoAlpha: 0, y: -12, duration: 0.3, ease: "power2.in" }, s);
    const fromThumb = centre(receipt, chatThumb);
    const shrink = chatThumb.offsetWidth / receipt.offsetWidth;
    t.fromTo(
      receipt,
      { autoAlpha: 0, x: fromThumb.x, y: fromThumb.y, scale: shrink },
      { autoAlpha: 1, x: 0, y: 0, scale: 1, duration: 0.6, ease: "power3.inOut" },
      s + 0.1,
    );
    t.to(chat, { autoAlpha: 0, y: 16, duration: 0.3, ease: "power2.in" }, s + 0.15);
    t.fromTo(scan, { autoAlpha: 0, y: 0 }, { autoAlpha: 1, duration: 0.1 }, s + 0.7);
    t.to(scan, { y: receipt.offsetHeight - 3, duration: 0.9, ease: "none" }, s + 0.75);
    t.to(scan, { autoAlpha: 0, duration: 0.15 }, s + 1.65);
    t.to(hls, { backgroundSize: "100% 60%", duration: 0.18, stagger: 0.14, ease: "none" }, s + 0.8);

    /* 4 · AI sorts: the shop, date and total lift out as chips, AI adds the category */
    s = START[3];
    t.to(itemHls, { backgroundSize: "0% 60%", duration: 0.25, ease: "none" }, s);
    chips.forEach((el, k) => {
      const field = el.dataset.field!;
      if (field === "category") {
        t.fromTo(
          el,
          { autoAlpha: 0, scale: 0.4 },
          { autoAlpha: 1, scale: 1, duration: 0.45, ease: "back.out(2)" },
          s + 1.0,
        );
        t.fromTo(el.querySelector("svg"), { rotate: -90 }, { rotate: 0, duration: 0.5 }, s + 1.0);
        return;
      }
      const from = delta(el, word(field));
      t.fromTo(
        el,
        { autoAlpha: 0, x: from.x, y: from.y, scale: 0.85 },
        { autoAlpha: 1, x: 0, y: 0, scale: 1, duration: 0.5, ease: "power3.out" },
        s + 0.25 + k * 0.15,
      );
    });

    /* 5 · checked: the receipt folds into a passing card; a blurry receipt is asked again */
    s = START[4];
    const intoOk = centre(receipt, okThumb);
    t.to(
      receipt,
      { x: intoOk.x, y: intoOk.y, scale: okThumb.offsetWidth / receipt.offsetWidth, autoAlpha: 0, duration: 0.55 },
      s + 0.1,
    );
    chips.forEach((el, k) => {
      const into = centre(el, okThumb);
      t.to(
        el,
        { x: into.x, y: into.y, scale: 0.5, autoAlpha: 0, duration: 0.45, ease: "power2.in" },
        s + 0.1 + k * 0.05,
      );
    });
    t.fromTo(ok, { autoAlpha: 0, y: 16 }, { autoAlpha: 1, y: 0, duration: 0.4 }, s + 0.35);
    t.fromTo(okPill, { scale: 0.5 }, { scale: 1, duration: 0.3, ease: "back.out(2.4)" }, s + 0.8);
    t.fromTo(bad, { autoAlpha: 0, x: 20 }, { autoAlpha: 1, x: 0, duration: 0.4 }, s + 0.6);
    t.fromTo(badPill, { scale: 0.5 }, { scale: 1, duration: 0.3, ease: "back.out(2.4)" }, s + 1.0);
    t.fromTo(ask, { autoAlpha: 0, y: 14 }, { autoAlpha: 1, y: 0, duration: 0.35 }, s + 1.2);

    /* 6 · recorded: the passing card folds into a new row of the spending table, Rina gets a confirmation */
    s = START[5];
    t.to([bad, ask], { autoAlpha: 0, y: -10, duration: 0.3, ease: "power2.in" }, s);
    t.fromTo(table, { autoAlpha: 0, y: 20 }, { autoAlpha: 1, y: 0, duration: 0.4 }, s + 0.15);
    t.fromTo(oldRows, { autoAlpha: 0, x: -10 }, { autoAlpha: 1, x: 0, duration: 0.25, stagger: 0.08 }, s + 0.3);
    const intoRow = centre(ok, newRow);
    t.to(ok, { x: intoRow.x, y: intoRow.y, scale: 0.3, autoAlpha: 0, duration: 0.5, ease: "power2.in" }, s + 0.55);
    t.fromTo(newRow, { autoAlpha: 0, x: -10 }, { autoAlpha: 1, x: 0, duration: 0.3 }, s + 0.85);
    t.fromTo(glow, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.25 }, s + 0.95);
    t.fromTo(confirm, { autoAlpha: 0, y: 14 }, { autoAlpha: 1, y: 0, duration: 0.35 }, s + 1.15);

    /* 7 · morning recap: the clock turns eight, the owner's recap fills its bars */
    s = START[6];
    t.to([table, confirm], { autoAlpha: 0, y: 20, duration: 0.35, ease: "power2.in" }, s);
    t.fromTo(
      clock,
      { autoAlpha: 0, scale: 0.8 },
      { autoAlpha: 1, scale: 1, duration: 0.4, ease: "back.out(1.6)" },
      s + 0.2,
    );
    t.fromTo($(".cp-clock svg"), { rotate: -40 }, { rotate: 0, duration: 0.5 }, s + 0.2);
    t.fromTo(recap, { autoAlpha: 0, y: 20 }, { autoAlpha: 1, y: 0, duration: 0.4 }, s + 0.45);
    t.to(bars, { scaleX: 1, duration: 0.45, stagger: 0.12, ease: "power2.out" }, s + 0.8);

    /* 8 · results: the recap gives way to three sample figures */
    s = START[7];
    t.to([recap, clock], { autoAlpha: 0, y: 30, duration: 0.4, ease: "power2.in" }, s);
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
