// Next/Previous buttons on the take (user 17 Nov): each press scrolls the page to the next (or previous) stop at the
// pace of an unhurried scroll, so the world plays the take as if the visitor scrolled it. The page scrolls for real
// (window.scrollTo every frame), so everything that follows the scroll (the world, the stills, the hero) is unchanged.
// A motion of the visitor's own (a touch, the wheel, a scroll key, a jump link) takes the scroll back at once.

/** Seconds per screen of scroll: the steady scroll every measurement of the take was made at (PLAN log, 2 s/layar). */
export const SECONDS_PER_SCREEN = 2;
/** Seconds to reach that pace from rest, and to come to rest from it. */
const RAMP_S = 0.35;
/** Pixels within which the page counts as on a stop. */
const EPS = 2;
const SCROLL_KEYS = new Set(["ArrowUp", "ArrowDown", "PageUp", "PageDown", "Home", "End", " "]);

/**
 * Wires the buttons inside `nav` ([data-nav="prev"], [data-nav="next"]). `stops` gives the stops' scroll tops (px,
 * ascending) for the current format; `screen` the height of one screen of scroll (px).
 */
export function mountTakeNav(nav: HTMLElement, stops: () => number[], screen: () => number) {
  const prev = nav.querySelector<HTMLButtonElement>('[data-nav="prev"]')!,
    next = nav.querySelector<HTMLButtonElement>('[data-nav="next"]')!;
  let target: number | null = null,
    y = 0,
    v = 0,
    last = 0,
    written = 0,
    raf = 0;

  const halt = () => {
    cancelAnimationFrame(raf);
    raf = 0;
    target = null;
    v = 0;
    nav.removeAttribute("data-moving");
  };
  /** Enables each button while there is a stop on its side (past the one being scrolled to). */
  const update = () => {
    const list = stops(),
      lo = Math.min(scrollY, target ?? scrollY),
      hi = Math.max(scrollY, target ?? scrollY);
    prev.disabled = !list.some((s) => s < lo - EPS);
    next.disabled = !list.some((s) => s > hi + EPS);
  };
  const step = (now: number) => {
    raf = 0;
    if (target == null) return;
    // the page moved under us (a jump link, the scrollbar, the browser): the scroll is the visitor's again
    if (Math.abs(scrollY - written) > 3) return halt();
    // (on the frames' own clock: the first frame of a motion only starts it)
    const dt = last ? Math.min(0.05, (now - last) / 1000) : 0,
      vmax = screen() / SECONDS_PER_SCREEN,
      acc = vmax / RAMP_S,
      d = target - y,
      dir = Math.sign(d),
      // as fast as the pace allows, and slow enough to come to rest on the stop
      want = dir * Math.min(vmax, Math.sqrt(2 * acc * Math.abs(d)));
    last = now;
    v += Math.max(-acc * dt, Math.min(acc * dt, want - v));
    y += v * dt;
    if (Math.abs(d) < 0.5 || (target - y) * dir <= 0) {
      scrollTo(0, target);
      halt();
      update();
      return;
    }
    scrollTo(0, y);
    written = scrollY;
    raf = requestAnimationFrame(step);
  };
  const go = (dir: 1 | -1) => {
    const list = stops();
    // pressed again while moving: on from the stop it is going to, or back from where it is
    const from = dir > 0 ? Math.max(scrollY, target ?? scrollY) : Math.min(scrollY, target ?? scrollY);
    const to = dir > 0 ? list.find((s) => s > from + EPS) : list.findLast((s) => s < from - EPS);
    if (to == null) return;
    if (target == null) {
      y = written = scrollY;
      v = 0;
    }
    target = to;
    nav.setAttribute("data-moving", "");
    if (!raf) {
      last = 0;
      raf = requestAnimationFrame(step);
    }
    update();
  };

  const own = (e: Event) => e.target instanceof Node && nav.contains(e.target);
  const onUser = (e: Event) => {
    if (target != null && !own(e)) halt();
  };
  const onKey = (e: KeyboardEvent) => {
    if (SCROLL_KEYS.has(e.key)) onUser(e);
  };
  const onPrev = () => go(-1),
    onNext = () => go(1);
  prev.addEventListener("click", onPrev);
  next.addEventListener("click", onNext);
  addEventListener("wheel", onUser, { passive: true });
  addEventListener("touchstart", onUser, { passive: true });
  addEventListener("keydown", onKey);
  update();

  return {
    /** Call on scroll and resize. */
    update,
    dispose() {
      halt();
      prev.removeEventListener("click", onPrev);
      next.removeEventListener("click", onNext);
      removeEventListener("wheel", onUser);
      removeEventListener("touchstart", onUser);
      removeEventListener("keydown", onKey);
    },
  };
}
