/**
 * Scroll lock while the Home world boots (issue #4): the visitor stays on the K0 still and the hero copy, with the
 * loading bar, instead of scrolling through a take that has nothing to show yet. Run inline before the take is
 * parsed (HomeStage), so there is no gap before React hydrates; HomeTake releases it once the world is live, or
 * falls back to the stills at BOOT_LIMIT_MS. If the page never hydrates, the script releases itself a second later.
 *
 * It must stay self-contained: it is inlined with Function.prototype.toString.
 * Reduced motion gets the stacked stills (stage.css) and is never locked; nor are the review tools.
 * `overflow: hidden` on the root (stage.css) stops the scroll on most browsers; iOS Safari does not always honour
 * it, so wheel, touch and scroll keys are also cancelled, except inside a dialog (the phone menu) and on controls.
 */
export function bootLock(limitMs: number) {
  const root = document.documentElement;
  if (!matchMedia("(prefers-reduced-motion: no-preference)").matches) return;
  if (/[?&](lab|shot|bake)(=|&|$)/.test(location.search)) return;
  const keys: Record<string, 1> = { " ": 1, PageDown: 1, PageUp: 1, End: 1, Home: 1, ArrowDown: 1, ArrowUp: 1 };
  const stop = (e: Event) => {
    const t = e.target instanceof Element ? e.target : null;
    if (t?.closest('[role="dialog"]')) return;
    if (e.type === "keydown") {
      if (!keys[(e as KeyboardEvent).key]) return;
      if (t?.closest("a,button,input,textarea,select,summary,[contenteditable],[role=tab]")) return;
    }
    if (e.cancelable) e.preventDefault();
  };
  const o: AddEventListenerOptions = { passive: false, capture: true };
  let done = false;
  const unlock = () => {
    if (done) return;
    done = true;
    root.removeAttribute("data-booting");
    for (const type of ["wheel", "touchmove", "keydown"]) removeEventListener(type, stop, o);
  };
  root.setAttribute("data-booting", "");
  for (const type of ["wheel", "touchmove", "keydown"]) addEventListener(type, stop, o);
  (window as Window & { __takeUnlock?: () => void }).__takeUnlock = unlock;
  setTimeout(unlock, Math.max(0, limitMs - performance.now()) + 1000);
}

/** The longest the visitor waits on the loading bar, from the start of the navigation (ms). */
export const BOOT_LIMIT_MS = 15_000;

/** Releases the lock (the world is live, or the stills took over, or the take unmounted). */
export function bootUnlock() {
  (window as Window & { __takeUnlock?: () => void }).__takeUnlock?.();
}
