import { gsap } from "gsap";
import type { Film } from "./ceritaFilm";
import { CS_KLINIK } from "./ceritaTiming";

/**
 * CS Klinik motion graphic (CK1 "one patient chat travels"): one paused GSAP timeline over the server-rendered
 * stage (`PanggungKlinik.tsx`). The late-night chat lifts out two chips, the service chip finds its row in the
 * service table, the table folds into a price pill, the time chip lands on a taken slot and three other times
 * light up, the picked time becomes an appointment, the day and the price fold into the patient's row while
 * the reply goes out, and a medical question goes to the staff. `seek(t, scene)` moves the timeline to the
 * time the page derives from the scroll. Only transform/opacity move, plus the stage background at night.
 */

const { START, END } = CS_KLINIK;
const DAY = "#e9e4f8";
const NIGHT = "#3b3f86";

export function createFilm(stage: HTMLElement, reduced: boolean): Film {
  const cv = stage.querySelector<HTMLElement>(".ck-cv")!;
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
    const clock = $(".ck-clock");
    const ask = $(".ck-ask");
    const ring = $(".ck-ask .og-ring");
    const hls = $$(".ck-ask .og-hl");
    const chips = $$(".ck-chips .og-chip");
    const chip = (field: string) => $(`.ck-chips .og-chip[data-field="${field}"]`);
    const word = (field: string) => $(`.ck-ask .og-hl[data-field="${field}"]`);
    const prices = $(".ck-prices");
    const priceRows = $$(".ck-pr");
    const pickRow = $(".ck-pr.is-pick");
    const pickGlow = $(".ck-pr.is-pick .ck-glow");
    const pill = $(".ck-price");
    const day = $(".ck-day");
    const slots = $$(".ck-slot");
    const asked = $(".ck-slot.is-asked");
    const askedPill = $(".ck-slot.is-asked .bj-pill");
    const offered = $$(".ck-slot:not(.is-asked) .ck-glow");
    const pickSlotGlow = $(".ck-slot.is-pick .ck-glow");
    const others = offered.filter((el) => el !== pickSlotGlow);
    const ev = $(".ck-ev");
    const offer = $(".ck-offer");
    const choose = $(".ck-choose");
    const reply = $(".ck-reply");
    const leads = $(".ck-leads");
    const newRow = $(".ck-tr.is-new");
    const newCells = Array.from(newRow.children) as HTMLElement[];
    const sum = $(".ck-tr.is-new .ck-sum");
    const was = $(".ck-tr.is-new .og-was");
    const now = $(".ck-tr.is-new .og-now");
    const med = $(".ck-med");
    const medChip = $(".ck-medchip");
    const staff = $(".ck-staff");
    const staffIcon = $(".ck-staff-i");
    const staffTag = $(".ck-staff .og-sample");
    const ms = $$(".og-m");
    const note = $(".og-mx .og-sample");
    const nums = $$(".og-num[data-to]");

    // One full copy of the pile, so the scroll loops into identical bubbles.
    const half = bubbles[bubbles.length / 2].offsetTop - bubbles[0].offsetTop;

    cv.classList.add("is-film");
    gsap.set(
      [clock, ask, ring, ...chips, prices, pickGlow, pill, day, ...offered, ev, offer, choose, reply, leads, now],
      { autoAlpha: 0 },
    );
    gsap.set([med, medChip, staff, ...ms, note], { autoAlpha: 0 });
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

    /* 1 · before: patient chats pile up after closing, the waiting counter climbs */
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
    t.fromTo(ring, { autoAlpha: 0, scale: 1.04 }, { autoAlpha: 1, scale: 1, duration: 0.3 }, s + 0.8);

    /* 3 · AI reads: day again, the service and the time lift out of the chat as chips */
    s = START[2];
    t.to(stage, { backgroundColor: DAY, duration: 0.5, ease: "none" }, s);
    t.to([clock, ring], { autoAlpha: 0, duration: 0.25 }, s);
    t.to(hls, { backgroundSize: "100% 60%", duration: 0.22, stagger: 0.1, ease: "none" }, s + 0.2);
    chips.forEach((el, k) => {
      const from = delta(el, word(el.dataset.field!));
      t.fromTo(
        el,
        { autoAlpha: 0, x: from.x, y: from.y, scale: 0.85 },
        { autoAlpha: 1, x: 0, y: 0, scale: 1, duration: 0.55, ease: "power3.out" },
        s + 0.55 + k * 0.12,
      );
    });

    /* 4 · price check: the service chip finds its row in the service table, the time chip waits below */
    s = START[3];
    t.to(ask, { autoAlpha: 0, y: -20, duration: 0.35, ease: "power2.in" }, s);
    t.to(chip("time"), { y: 200, duration: 0.5, ease: "power2.inOut" }, s + 0.05);
    t.fromTo(prices, { autoAlpha: 0, y: 20 }, { autoAlpha: 1, y: 0, duration: 0.4 }, s + 0.2);
    t.fromTo(priceRows, { autoAlpha: 0, x: -10 }, { autoAlpha: 1, x: 0, duration: 0.25, stagger: 0.05 }, s + 0.3);
    const toRow = centre(chip("service"), pickRow);
    t.to(
      chip("service"),
      { x: toRow.x, y: toRow.y, scale: 0.7, autoAlpha: 0, duration: 0.55, ease: "power2.inOut" },
      s + 0.65,
    );
    t.fromTo(pickGlow, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.25 }, s + 1.05);
    t.fromTo(pickRow, { scale: 1 }, { keyframes: { scale: [1, 1.04, 1] }, duration: 0.3, ease: "none" }, s + 1.05);

    /* 5 · schedule check: the table folds into a price pill, the time is taken, three other times light up */
    s = START[4];
    const fromRow = delta(pill, pickRow);
    t.fromTo(
      pill,
      { autoAlpha: 0, x: fromRow.x, y: fromRow.y },
      { autoAlpha: 1, x: 0, y: 0, duration: 0.6, ease: "power3.inOut" },
      s + 0.05,
    );
    t.to(prices, { autoAlpha: 0, y: -16, scale: 0.96, duration: 0.35, ease: "power2.in" }, s + 0.05);
    t.fromTo(day, { autoAlpha: 0, y: 24 }, { autoAlpha: 1, y: 0, duration: 0.4 }, s + 0.4);
    t.fromTo(slots, { autoAlpha: 0, x: -10 }, { autoAlpha: 1, x: 0, duration: 0.25, stagger: 0.05 }, s + 0.5);
    const toSlot = delta(chip("time"), asked);
    t.to(
      chip("time"),
      { x: toSlot.x + 70, y: toSlot.y, scale: 0.7, autoAlpha: 0, duration: 0.55, ease: "power2.inOut" },
      s + 0.7,
    );
    t.fromTo(askedPill, { scale: 0.4 }, { scale: 1, duration: 0.25, ease: "back.out(2.4)" }, s + 1.15);
    t.fromTo(asked, { x: 0 }, { keyframes: { x: [0, -6, 6, -3, 0] }, duration: 0.3, ease: "none" }, s + 1.2);
    t.fromTo(offered, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.2, stagger: 0.08 }, s + 1.35);
    t.fromTo(offer, { autoAlpha: 0, y: 16 }, { autoAlpha: 1, y: 0, duration: 0.35 }, s + 1.45);

    /* 6 · booked: the patient picks a time, that slot becomes the appointment */
    s = START[5];
    t.to(offer, { autoAlpha: 0, y: -12, duration: 0.3, ease: "power2.in" }, s);
    t.fromTo(choose, { autoAlpha: 0, y: 16 }, { autoAlpha: 1, y: 0, duration: 0.35 }, s + 0.2);
    t.to(others, { autoAlpha: 0, duration: 0.25 }, s + 0.6);
    t.fromTo(
      ev,
      { autoAlpha: 0, scaleX: 0.2, transformOrigin: "0 50%" },
      { autoAlpha: 1, scaleX: 1, duration: 0.4, ease: "power3.out" },
      s + 0.7,
    );
    t.to(pickSlotGlow, { autoAlpha: 0, duration: 0.2 }, s + 1.1);

    /* 7 · reply and log: the reply goes out while the day and the price fold into the patient's row */
    s = START[6];
    t.to(choose, { autoAlpha: 0, y: -12, duration: 0.3, ease: "power2.in" }, s);
    t.fromTo(leads, { autoAlpha: 0, y: 20 }, { autoAlpha: 1, y: 0, duration: 0.4 }, s + 0.15);
    const into = delta(day, newRow);
    t.to(
      day,
      { x: into.x, y: into.y, scale: 0.4, autoAlpha: 0, duration: 0.55, ease: "power2.inOut", transformOrigin: "0 0" },
      s + 0.25,
    );
    const toSum = centre(pill, sum);
    t.to(pill, { x: toSum.x, y: toSum.y, scale: 0.7, autoAlpha: 0, duration: 0.55, ease: "power2.inOut" }, s + 0.3);
    t.fromTo(newCells, { autoAlpha: 0, x: -10 }, { autoAlpha: 1, x: 0, duration: 0.25, stagger: 0.06 }, s + 0.75);
    t.fromTo(reply, { autoAlpha: 0, y: 16 }, { autoAlpha: 1, y: 0, duration: 0.35 }, s + 0.75);

    /* 8 · to staff (design step): a medical question is passed on, the patient's summary follows */
    s = START[7];
    t.to(reply, { autoAlpha: 0, y: -12, duration: 0.3, ease: "power2.in" }, s);
    t.fromTo(med, { autoAlpha: 0, y: 16 }, { autoAlpha: 1, y: 0, duration: 0.35 }, s + 0.2);
    const fromMed = delta(medChip, med);
    t.fromTo(
      medChip,
      { autoAlpha: 0, x: fromMed.x + 40, y: fromMed.y + 30, scale: 0.85 },
      { autoAlpha: 1, x: 0, y: 0, scale: 1, duration: 0.45, ease: "power3.out" },
      s + 0.55,
    );
    t.fromTo(staff, { autoAlpha: 0, y: 16 }, { autoAlpha: 1, y: 0, duration: 0.35 }, s + 0.95);
    const toStaff = centre(medChip, staffIcon);
    t.to(
      medChip,
      { x: toStaff.x, y: toStaff.y, scale: 0.4, autoAlpha: 0, duration: 0.45, ease: "power2.in" },
      s + 1.05,
    );
    t.fromTo(staffTag, { scale: 0.5 }, { scale: 1, duration: 0.25, ease: "back.out(2.4)" }, s + 1.3);
    t.to(was, { autoAlpha: 0, y: -10, duration: 0.2 }, s + 1.35);
    t.fromTo(now, { autoAlpha: 0, y: 10 }, { autoAlpha: 1, y: 0, duration: 0.2 }, s + 1.4);

    /* 9 · results: the table and the staff card give way to three sample figures */
    s = START[8];
    t.to([med, staff, leads], { autoAlpha: 0, y: 30, scale: 0.94, duration: 0.4, stagger: 0.04, ease: "power2.in" }, s);
    t.fromTo(ms, { autoAlpha: 0, y: 24 }, { autoAlpha: 1, y: 0, duration: 0.4, stagger: 0.12 }, s + 0.3);
    t.fromTo(note, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.2 }, s + 0.75);
    nums.forEach((el, k) => countUp(el, Number(el.dataset.to), s + 0.35 + k * 0.12, 0.6));

    /* 10 · for you: the figures stay, dimmed; the CTA lives in the caption */
    t.to(ms, { opacity: 0.45, duration: 0.4 }, START[9]);

    t.set({}, {}, END[9]);
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
