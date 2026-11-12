// Plain-number helpers shared by the world and the page (no three.js here, so the page can import them without
// pulling the engine into its first bundle). A take is a list of segments measured in screens of scroll.

export const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
export const ease = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
export const smoothstep = (e0: number, e1: number, x: number) => {
  const t = clamp01((x - e0) / (e1 - e0));
  return t * t * (3 - 2 * t);
};

/**
 * `screens` is the segment's length on the take's own timeline (9:16, and the unit of p everywhere in the world);
 * `pc`, when given, is its length in screens of scroll on landscape, which then has a timeline of its own (tahap 7:
 * 9:16 stops on each item of a hold, 16:9 frames them all at once and needs less scroll).
 */
export type Segment<K extends string> = { type: "hold" | "move"; from: K; to?: K; screens: number; pc?: number };

export function segmentsTotal<K extends string>(seg: Segment<K>[]) {
  return seg.reduce((a, s) => a + s.screens, 0);
}

/** Screens of scroll segment g takes: portrait its own length, landscape its `pc` length when it has one. */
const scrollLen = <K extends string>(g: Segment<K>, portrait: boolean) => (portrait || g.pc == null ? g.screens : g.pc);

/** Screens of scroll of the whole take on a format. */
export function scrollTotal<K extends string>(seg: Segment<K>[], portrait: boolean) {
  return seg.reduce((a, g) => a + scrollLen(g, portrait), 0);
}

/** Where the take is (screens on its own timeline) after s screens of scroll on a format. */
export function screensAtScroll<K extends string>(seg: Segment<K>[], s: number, portrait: boolean) {
  let x = 0,
    acc = 0;
  for (const g of seg) {
    const len = scrollLen(g, portrait);
    if (s <= acc + len) return x + (len > 0 ? clamp01((s - acc) / len) : 1) * g.screens;
    acc += len;
    x += g.screens;
  }
  return x;
}

/** Screens of scroll on a format at which the take is at x (screens on its own timeline): screensAtScroll's inverse. */
export function scrollAtScreens<K extends string>(seg: Segment<K>[], x: number, portrait: boolean) {
  let s = 0,
    acc = 0;
  for (const g of seg) {
    const len = scrollLen(g, portrait);
    if (x <= acc + g.screens) return s + (g.screens > 0 ? clamp01((x - acc) / g.screens) : 1) * len;
    acc += g.screens;
    s += len;
  }
  return s;
}

/** The segment under p (0..1 over the take), with u = 0..1 inside it. */
export function segmentAt<K extends string>(seg: Segment<K>[], p: number) {
  const total = segmentsTotal(seg),
    s = clamp01(p) * total;
  let acc = 0;
  for (let i = 0; i < seg.length; i++) {
    const g = seg[i];
    if (s <= acc + g.screens || i === seg.length - 1) return { seg: g, u: clamp01((s - acc) / g.screens), start: acc };
    acc += g.screens;
  }
  throw new Error("empty take");
}

/**
 * p at the middle of the hold on keyframe k (for ?k= and the stills); a keyframe the camera passes without a
 * hold (a junction without copy) is at the end of the move into it.
 */
export function holdP<K extends string>(seg: Segment<K>[], k: K) {
  const total = segmentsTotal(seg);
  let acc = 0,
    passed = -1;
  for (const g of seg) {
    if (g.type === "hold" && g.from === k) return (acc + g.screens / 2) / total;
    acc += g.screens;
    if (g.type === "move" && g.to === k && passed < 0) passed = acc;
  }
  return passed < 0 ? 0 : passed / total;
}

/** Start of segment i in screens. */
export function segmentStart<K extends string>(seg: Segment<K>[], i: number) {
  return seg.slice(0, i).reduce((a, s) => a + s.screens, 0);
}

/** 0 at 16:9 (pc keyframes) … 1 at 9:16 (hp keyframes), on a log scale of the aspect ratio. */
export function formatT(aspect: number) {
  const a = Math.log(16 / 9),
    b = Math.log(9 / 16);
  return clamp01((a - Math.log(aspect)) / (a - b));
}
