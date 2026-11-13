// The row of shophouses from COMPANY to Kreatekno (beats 5a–5b, Master 7 and the team's videos): plain numbers
// only (no three.js), shared by the world (set, camera, copy anchors) and the page. Metres, the world frame of
// sets/street.ts: x along the street, y up, z toward the street, the facades at z 0.
// Every shop is 7 m wide like the fruit shop and the laundry of K1 (Master 7: 0.62 × COMPANY's 11.6 m); its
// first-floor panel carries the customer journey: fruit = kicker and heading, laundry … cosmetics = steps 1–4,
// electronics = the "Konsultasi gratis" button pointing on to Kreatekno's door. The videos' internet café and stall
// (blank panels) are left out (user, 7 Nov): six shops, then Kreatekno.
import { DATA } from "../takes/home/data";

export type PanelCopy = "intro" | "talk" | "map" | "build" | "launch" | "cta" | null;
export type Shop = {
  id: "buah" | "laundry" | "sepatu" | "warteg" | "kosmetik" | "elektronik";
  /** Facade colour and its lighter trim (pillars, bands). */
  body: string;
  trim: string;
  copy: PanelCopy;
};

export const SHOPS: Shop[] = [
  { id: "buah", body: "#86cdb6", trim: "#9fd9c5", copy: "intro" },
  { id: "laundry", body: "#efd9bd", trim: "#f6e6d0", copy: "talk" },
  { id: "sepatu", body: "#f0a9c6", trim: "#f6c3d8", copy: "map" },
  { id: "warteg", body: "#a6dbe6", trim: "#bfe7ef", copy: "build" },
  { id: "kosmetik", body: "#b6d58f", trim: "#c9e2a8", copy: "launch" },
  { id: "elektronik", body: "#93dcc8", trim: "#ade6d6", copy: "cta" },
];

const X0 = DATA.ext.xfR + 0.06;
export const ROW = {
  /** Left edge of the fruit shop, shop width, gap between shops, two-storey height and depth. */
  x0: X0,
  w: 7.0,
  gap: 0.05,
  pitch: 7.05,
  h: 8.0,
  depth: 6,
  /** Pillar width, the first-floor band (y range), the shop opening (width, height). */
  pillar: 0.64,
  band: [3.15, 3.65] as const,
  opening: { w: 4.9, h: 2.75 },
  /**
   * The white panel on the first floor (videos K5a.2–K5a.5: ±74% of the shop's width, 2.5:1), centred on the
   * shop; its face stands a little proud of the wall.
   */
  panel: { w: 5.2, h: 2.06, y: 5.25, z: 0.12 },
} as const;

/** Left and right edge and centre of shop i (0 = fruit … 7 = electronics). */
export function shopX(i: number) {
  const x0 = ROW.x0 + i * ROW.pitch;
  return { x0, x1: x0 + ROW.w, cx: x0 + ROW.w / 2 };
}

/** Kreatekno's office after the electronics shop (video K5a.6: ±1.75 shops wide), its door, plaque and lamp. */
const KX0 = shopX(SHOPS.length - 1).x1 + ROW.gap;
export const KREATEKNO = {
  x0: KX0,
  w: 12.4,
  h: 8.0,
  /** Glass door (two leaves), right of the middle; the wooden plaque and brass lamp left of it. */
  door: { cx: KX0 + 0.52 * 12.4, w: 2.1, h: 2.5 },
  // (tahap 8: 1.7 × 0.85 m, was 1.5 × 0.9: with its frame ±1.9:1 like the plaque filling the frame at K9b, the
  // team's continuation video at 8 s)
  plaque: { cx: KX0 + 0.2 * 12.4, y: 1.75, w: 1.7, h: 0.85 },
  band: [3.0, 3.75] as const,
};
/** The pale blue-grey end house with a balcony, right of Kreatekno. */
export const END_HOUSE = { x0: KREATEKNO.x0 + KREATEKNO.w + ROW.gap, w: 7.0, h: 8.4 };
/** Where the street (pavement, kerb, road) ends on the right. */
export const STREET_END = END_HOUSE.x0 + END_HOUSE.w + 12;
