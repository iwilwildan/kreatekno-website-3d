// Critically damped spring, solved in closed form: x(t) = target + (c1 + c2·t)·e^(−ω·t). The step is exact for
// any dt, so the camera's inertia is the same at 20, 30 or 120 fps, and the velocity carries over when the target
// moves (scroll), so the camera never jerks when the visitor scrolls again mid-move.

export type Damped = { x: number; v: number };

/** Moves `s` toward `target` over dt seconds; `omega` = 2 / smoothing time (s⁻¹). */
export function dampStep(s: Damped, target: number, omega: number, dt: number) {
  const c1 = s.x - target,
    c2 = s.v + omega * c1,
    e = Math.exp(-omega * dt);
  s.x = target + (c1 + c2 * dt) * e;
  s.v = (c2 - omega * (c1 + c2 * dt)) * e;
  return s;
}
