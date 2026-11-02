// Soft headwear shared by the cast, as SDFs in modelling space (the 1.8 m reference head, see member.ts).
import { sd, smax, subtract, union, type Sdf } from "./sdf";

const smooth = (e0: number, e1: number, v: number) => {
  const t = Math.max(0, Math.min(1, (v - e0) / (e1 - e0)));
  return t * t * (3 - 2 * t);
};

/**
 * Hijab: a hood over the skull with an oval opening for the face, wrapped under the chin, and a cape over the
 * neck and shoulders whose hem hangs to `front`, `side` and `back` heights (pointed at the back when lower).
 * One shape, meshed in one go so the hood and the cape have no seam.
 */
export function hijab({
  front,
  side,
  back,
  width = 0.19,
  face = [0.15, 0.168],
}: {
  front: number;
  side: number;
  back: number;
  width?: number;
  face?: [number, number];
}) {
  const skull = sd.ellipsoid([0, 1.585, -0.005], [0.183, 0.2, 0.2]);
  // hair gathered under the hood gives it volume at the back
  const bun = sd.ellipsoid([0, 1.585, -0.11], [0.15, 0.15, 0.13]);
  // the face oval, cut straight back to just in front of the ears so the cheeks stay clear
  const opening: Sdf = (x, y, z) =>
    Math.max((Math.hypot(x / face[0], (y - 1.505) / face[1]) - 1) * Math.min(face[0], face[1]), 0.03 - z);
  const hood: Sdf = subtract(
    0.02,
    union(0.03, skull, bun, sd.ellipsoid([0, 1.42, -0.01], [0.13, 0.09, 0.15])),
    opening,
  );
  const cape: Sdf = (x, y, z) => {
    const rho = Math.hypot(x, z * 1.08),
      a = Math.atan2(x, -z), // 0 = straight back
      c = Math.cos(a),
      // hem height around the body: back (c = 1), sides (c = 0), front (c = -1)
      hem = c > 0 ? side + (back - side) * c ** 5 : side + (front - side) * (-c) ** 1.2,
      // from a narrow ring under the chin to the shoulders, then hanging straight; narrower in front, where
      // the cloth falls from the chin instead of resting on the shoulders
      wide = width * (0.9 + 0.1 * Math.abs(Math.sin(a))),
      out = 0.095 + (wide - 0.095) * smooth(1.41, 1.28, y) + 0.01 * smooth(1.25, 1.0, y);
    return smax(smax(rho - out, hem - y, 0.02), y - 1.43, 0.02);
  };
  return subtract(0.015, union(0.04, hood, cape), opening);
}

/**
 * Spring bones for the hem of a hijab cape (tahap 4): back, both sides and front, hanging from the shoulders to
 * the hem heights of `hijab()`. Stiff, so the cloth only sways a little; `bones` feeds `Figure.hem`.
 */
export function hijabHem({ front, side, back }: { front: number; side: number; back: number }) {
  const at: [string, number, number][] = [
    ["hemB", 0, back],
    ["hemL", Math.PI / 2, side],
    ["hemF", Math.PI, front],
    ["hemR", -Math.PI / 2, side],
  ];
  const pt = (a: number, r: number, y: number): [number, number, number] => [r * Math.sin(a), y, -r * Math.cos(a)];
  return {
    joints: at.flatMap(([n, a, y]) => [
      { name: n, parent: "chest", at: pt(a, 0.15, 1.3) },
      { name: n + "Tip", parent: n, at: pt(a, 0.2, y + 0.02) },
    ]),
    springs: at.map(([n]) => ({ bone: n, tip: n + "Tip", stiffness: 3.2, gravity: 0.2, drag: 0.5, radius: 0.02 })),
    colliders: [{ bone: "chest", at: [0, 1.15, 0] as [number, number, number], r: 0.15 }],
    bones: at.map(([n, a]) => [n, a] as [string, number]),
  };
}
