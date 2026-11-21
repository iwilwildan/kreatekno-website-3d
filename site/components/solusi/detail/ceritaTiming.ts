/**
 * Scene timing of the Tonton motion graphics, shared by the page (scroll → scene, rail, captions), the lazily
 * loaded GSAP films and QA. `in` = transition from the previous scene, `hold` = reading time (timeline seconds).
 * Every story has nine scenes and six rail nodes (scenes 1-6).
 */
export type SceneTiming = ReadonlyArray<{ readonly in: number; readonly hold: number }>;

export type Timing = ReturnType<typeof makeTiming>;

export function makeTiming(sc: SceneTiming) {
  const start: number[] = [];
  const end: number[] = [];
  sc.reduce((t, s, i) => {
    start[i] = t;
    end[i] = t + s.in + s.hold;
    return end[i];
  }, 0);
  const total = end[end.length - 1];

  /** Scene shown at timeline time `t`: a scene counts once half its transition has played. */
  const sceneAt = (t: number) => {
    let scene = 0;
    sc.forEach((s, i) => {
      if (t >= start[i] + s.in * 0.5 - 1e-4) scene = i;
    });
    return scene;
  };

  /** Time to rest on when jumping to a scene: mid-way through its reading hold. */
  const restTime = (scene: number) => end[scene] - sc[scene].hold * 0.5;

  /**
   * Data packet on the workflow rail at time `t`, as a fractional node index (rail nodes are scenes 1-6),
   * or null while it is off the rail.
   */
  const packetAt = (t: number): number | null => {
    if (t < start[1] || t >= start[7]) return null;
    let k = 1;
    for (let i = 1; i <= 6; i++) if (t >= start[i]) k = i;
    if (k === 1) return 0;
    return k - 2 + Math.min(1, (t - start[k]) / sc[k].in);
  };

  return { SC: sc, START: start, END: end, TOTAL: total, sceneAt, restTime, packetAt };
}

/** Order Grup (OG5b/OG5c). */
export const SC = [
  { in: 1.6, hold: 0.6 },
  { in: 1.0, hold: 0.6 },
  { in: 1.4, hold: 0.7 },
  { in: 1.4, hold: 0.6 },
  { in: 0.8, hold: 0.6 },
  { in: 1.3, hold: 0.6 },
  { in: 1.2, hold: 0.7 },
  { in: 1.0, hold: 0.6 },
  { in: 0.6, hold: 0.9 },
] as const;

export const ORDER_GRUP = makeTiming(SC);
export const { START, END, TOTAL, sceneAt, restTime, packetAt } = ORDER_GRUP;

/** Booking Jasa (BJ1 "one booking travels"). */
export const BOOKING_JASA = makeTiming([
  { in: 1.6, hold: 0.6 },
  { in: 1.0, hold: 0.6 },
  { in: 1.6, hold: 0.7 },
  { in: 1.6, hold: 0.7 },
  { in: 1.2, hold: 0.6 },
  { in: 1.2, hold: 0.6 },
  { in: 1.8, hold: 0.7 },
  { in: 1.0, hold: 0.6 },
  { in: 0.6, hold: 0.9 },
]);

/** Riset Konten (RK1 "one topic travels"). */
export const RISET_KONTEN = makeTiming([
  { in: 1.6, hold: 0.6 },
  { in: 1.6, hold: 0.6 },
  { in: 2.0, hold: 0.7 },
  { in: 2.0, hold: 0.7 },
  { in: 1.5, hold: 0.7 },
  { in: 1.2, hold: 0.6 },
  { in: 1.4, hold: 0.7 },
  { in: 1.0, hold: 0.6 },
  { in: 0.6, hold: 0.9 },
]);

export const TIMING = { "order-grup": ORDER_GRUP, "booking-jasa": BOOKING_JASA, "riset-konten": RISET_KONTEN } as const;
