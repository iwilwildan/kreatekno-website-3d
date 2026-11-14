// Places the hero copy on the billboard. Each [data-anchor] element names the anchor it sits on in landscape
// (data-landscape) and portrait (data-portrait, empty = not anchored: it stays a card in the bottom band).
//
// `placeHero` is self-contained on purpose: HomeStage inlines it as a tiny script right after the markup, so the
// copy already sits on the billboard of the K0 still before React and the 3D world load (no jump, no CLS).
// The client runtime then calls `placeAnchors` with the live quads from the world every rendered frame.

export type Quad = [[number, number], [number, number], [number, number], [number, number]];
type StillAnchors = {
  w: number;
  h: number;
  K0: Record<string, Quad>;
} & {
  /**
   * Copy on other stills (stills fallback): the leaflet on K3, the binder's page on K4, the journey's panels on
   * K5a.2–K5a.4 (on 9:16 also K5a.2b, K5a.3b, K5a.4b).
   */
  [still: string]: Record<string, Quad> | number;
};
export type StillsData = {
  /** Width / height of each billboard anchor. */
  aspect: Record<string, number>;
  /** Normalised quads (0..1 of the still) of each anchor on the keyframe stills, per format. */
  pc: StillAnchors;
  hp: StillAnchors;
};

/**
 * Anchors with the shape of a billboard anchor (tahap 10: the CTA on the billboard's face at night, in the hero's
 * boxes): their width / height, where the stills' data only has the billboard's.
 */
const SAME_SHAPE: Record<string, string> = { "cta-face": "face", "cta-top": "faceTop", "cta-bottom": "faceBottom" };
/** CSS width of the anchored boxes; the text inside is styled at this size (≈ on-screen size at K0). */
export const BOX_W = { landscape: 560, portrait: 280 };
export const PORTRAIT_QUERY = "(max-aspect-ratio: 1/1)";

export function placeHero(root: HTMLElement, data: StillsData) {
  if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  const portrait = matchMedia("(max-aspect-ratio: 1/1)").matches;
  const stage = root.querySelector<HTMLElement>("[data-stage]");
  if (!stage) return;
  const W = stage.clientWidth,
    H = stage.clientHeight,
    still = portrait ? data.hp : data.pc;
  // the still covers the stage (object-fit: cover, centred)
  const s = Math.max(W / still.w, H / still.h),
    ox = (W - still.w * s) / 2,
    oy = (H - still.h * s) / 2;
  root.querySelectorAll<HTMLElement>("[data-anchor]").forEach((el) => {
    if (el.hasAttribute("data-fade")) return;
    const name = (portrait ? el.dataset.portrait : el.dataset.landscape) || "";
    const q = still.K0[name];
    if (!name || !q) {
      el.style.cssText = "";
      return;
    }
    const w = portrait ? 280 : 560,
      h = w / data.aspect[name];
    const P = q.map(([u, v]) => [ox + u * still.w * s, oy + v * still.h * s]);
    // square-to-quad homography (Heckbert), prescaled by the box size; corners TL, TR, BL, BR
    const [[x0, y0], [x1, y1], [x3, y3], [x2, y2]] = P;
    const dx1 = x1 - x2,
      dx2 = x3 - x2,
      dy1 = y1 - y2,
      dy2 = y3 - y2,
      sx = x0 - x1 + x2 - x3,
      sy = y0 - y1 + y2 - y3,
      den = dx1 * dy2 - dx2 * dy1 || 1e-9,
      g = (sx * dy2 - dx2 * sy) / den,
      k = (dx1 * sy - sx * dy1) / den;
    const m = [
      (x1 - x0 + g * x1) / w,
      (y1 - y0 + g * y1) / w,
      0,
      g / w,
      (x3 - x0 + k * x3) / h,
      (y3 - y0 + k * y3) / h,
      0,
      k / h,
      0,
      0,
      1,
      0,
      x0,
      y0,
      0,
      1,
    ];
    el.style.cssText = `width:${w}px;height:${h}px;transform:matrix3d(${m.map((v) => +v.toFixed(9)).join(",")})`;
  });
}

// one query object for the page (placeAnchors runs every rendered frame; matchMedia() each time showed in profiles)
let portraitMQ: MediaQueryList | undefined;

/** Same placement with live quads from the world (null = anchor off screen, so the copy hides). */
export function placeAnchors(
  root: HTMLElement,
  quads: Record<string, Quad | null>,
  aspect: Record<string, number>,
  toMatrix: (q: Quad, w: number, h: number) => string,
  props?: { fade: Record<string, number>; sizes: Record<string, { w: number; h: number }> },
) {
  const portrait = (portraitMQ ??= matchMedia(PORTRAIT_QUERY)).matches;
  root.querySelectorAll<HTMLElement>("[data-anchor]").forEach((el) => {
    const name = (portrait ? el.dataset.portrait : el.dataset.landscape) || "";
    if (!name) {
      // not anchored in this orientation, but faded with another (tahap 10: the CTA's card on 9:16 with the title
      // on the billboard, the epilogue over the road): the CSS places it, the world's fade shows it
      const by = el.dataset.fadeBy,
        o = by ? (props?.fade[by] ?? 0) : 1;
      el.style.cssText = !by ? "" : o < 0.01 ? "visibility:hidden" : `visibility:visible;opacity:${o.toFixed(3)}`;
      return;
    }
    const q = quads[name];
    // copy on the props of beats 3–4: boxed at its on-screen size at the hold (sharp text there), faded by the
    // world, out of reach (tab, tap, screen reader focus) while hidden. `data-fixed` (tahap 10, the CTA on the
    // billboard): a box of the hero's fixed size instead (BOX_W, the anchor's shape), its text styled in px
    if (el.hasAttribute("data-fade")) {
      const fixed = el.hasAttribute("data-fixed"),
        bw = portrait ? BOX_W.portrait : BOX_W.landscape,
        shape = aspect[name] ?? aspect[SAME_SHAPE[name]],
        size = fixed ? (shape ? { w: bw, h: bw / shape } : undefined) : props?.sizes[name],
        o = props?.fade[name] ?? 0;
      if (!q || !size || o < 0.01) {
        el.style.cssText = "visibility:hidden";
        return;
      }
      el.dataset.shape = size.w < size.h ? "portrait" : "landscape";
      el.style.cssText = `width:${size.w.toFixed(1)}px;height:${size.h.toFixed(1)}px;visibility:visible;opacity:${o.toFixed(3)};transform:${toMatrix(q, size.w, size.h)}`;
      return;
    }
    const w = portrait ? BOX_W.portrait : BOX_W.landscape,
      h = w / aspect[name];
    el.style.cssText = q
      ? `width:${w}px;height:${h}px;transform:${toMatrix(q, w, h)}`
      : `width:${w}px;height:${h}px;visibility:hidden`;
  });
}

/**
 * CSS matrix3d that maps a w × h box onto the quad (corners TL, TR, BL, BR, in px): the square-to-quad homography
 * of placeHero, for the stills fallback where the world (and its quadToMatrix3d) is not loaded.
 */
export function quadMatrix3d(q: Quad, w: number, h: number) {
  const [[x0, y0], [x1, y1], [x3, y3], [x2, y2]] = q;
  const dx1 = x1 - x2,
    dx2 = x3 - x2,
    dy1 = y1 - y2,
    dy2 = y3 - y2,
    sx = x0 - x1 + x2 - x3,
    sy = y0 - y1 + y2 - y3,
    den = dx1 * dy2 - dx2 * dy1 || 1e-9,
    g = (sx * dy2 - dx2 * sy) / den,
    k = (dx1 * sy - sx * dy1) / den;
  const m = [
    (x1 - x0 + g * x1) / w,
    (y1 - y0 + g * y1) / w,
    0,
    g / w,
    (x3 - x0 + k * x3) / h,
    (y3 - y0 + k * y3) / h,
    0,
    k / h,
    0,
    0,
    1,
    0,
    x0,
    y0,
    0,
    1,
  ];
  return `matrix3d(${m.map((v) => +v.toFixed(9)).join(",")})`;
}
