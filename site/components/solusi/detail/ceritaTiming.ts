/**
 * Scene timing of the Order Grup motion graphic, shared by the page (scroll → scene, rail, captions) and the
 * lazily loaded GSAP film. `in` = transition from the previous scene, `hold` = reading time (timeline seconds).
 */
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

export const START: number[] = [];
export const END: number[] = [];
SC.reduce((t, s, i) => {
  START[i] = t;
  END[i] = t + s.in + s.hold;
  return END[i];
}, 0);
export const TOTAL = END[END.length - 1];

/** Scene shown at timeline time `t`: a scene counts once half its transition has played. */
export function sceneAt(t: number) {
  let scene = 0;
  SC.forEach((s, i) => {
    if (t >= START[i] + s.in * 0.5 - 1e-4) scene = i;
  });
  return scene;
}

/** Time to rest on when jumping to a scene: mid-way through its reading hold. */
export function restTime(scene: number) {
  return END[scene] - SC[scene].hold * 0.5;
}

/**
 * Data packet on the workflow rail at time `t`, as a fractional node index (rail nodes are scenes 1-6),
 * or null while it is off the rail.
 */
export function packetAt(t: number): number | null {
  if (t < START[1] || t >= START[7]) return null;
  let k = 1;
  for (let i = 1; i <= 6; i++) if (t >= START[i]) k = i;
  if (k === 1) return 0;
  return k - 2 + Math.min(1, (t - START[k]) / SC[k].in);
}
