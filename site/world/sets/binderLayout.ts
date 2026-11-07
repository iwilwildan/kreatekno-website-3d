// Plain numbers of the binder's open page (no three.js here: the page's HTML imports them to lay the copy and the
// tab buttons over the 3D page and tabs). Metres in the binder's frame: x toward the spine (the rings are on the
// left of the top view K4), z toward Heru (the top of the page as read).

/** The page (A4 portrait), its centre's x, and the strip next to the rings where the page curls up. */
export const PAGE = { w: 0.203, d: 0.297, x: 0.11 - 0.203 / 2, curl: 0.02 };
/** Tabs on the dividers, top to bottom: colour and z range (from the page's middle, K4 pc). */
export const TABS: [string, number, number][] = [
  ["#fff346", 0.145, 0.09],
  ["#23f5ee", 0.074, 0.029],
  ["#ff9ad8", 0.02, -0.036],
  ["#b986dc", -0.047, -0.145],
];
/** How far the tabs stick out past the page's right edge (seen from above). */
export const TAB_OUT = 0.0145;

/**
 * The copy surface on the page: from the end of the curl to the outer edge of the tabs, the page's full height.
 * `tabs` are the tab buttons' spans as shares of it (top and bottom), `pageW` the share that is page.
 */
export const PAGE_COPY = (() => {
  const x0 = PAGE.x + PAGE.w / 2 - PAGE.curl,
    x1 = PAGE.x - PAGE.w / 2 - TAB_OUT,
    w = x0 - x1;
  return {
    x0,
    x1,
    aspect: w / PAGE.d,
    pageW: (w - TAB_OUT) / w,
    tabs: TABS.map(([color, z0, z1]) => ({
      color,
      top: (PAGE.d / 2 - z0) / PAGE.d,
      bottom: (PAGE.d / 2 - z1) / PAGE.d,
    })),
  };
})();
