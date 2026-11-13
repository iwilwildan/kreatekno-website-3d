// COMPANY's classroom behind the front room's wooden back door (tahap 9, the team's continuation video 28–31 s):
// plain numbers only, from the front room's layout step (sets/companyFront roomFrame), shared by the set, the camera
// and the copy anchor. The camera comes in through the door at the class's back and looks at its front wall: the
// TV on its wheeled stand a little right of the middle with Wildan beside it on the left, four small desks 2 × 2
// with the staff at them facing the TV (far row Sinta and Nadia, near row Bayu and Fajar, as seen from the door), a
// wide window along the left wall, a shelf of coloured binders on the right wall, pendant lamps.
import { roomFrame } from "./companyFront";

/** Depth of the classroom behind the front room's back wall, and the wall's thickness. */
export const CLASS = { depth: 5.7, wall: 0.15, ceil: 3.0 };

export function classFrame(step: number) {
  const R = roomFrame(step),
    doorX = (R.door.x0 + R.door.x1) / 2,
    back = R.backZ - CLASS.wall,
    front = back - CLASS.depth,
    tvX = doorX + 0.55;
  // (video 30 s: a small room, narrower than the front room: 3 m left of the door, 3.3 m right of it)
  const ixL = Math.max(R.ixL, doorX - 3.0),
    ixR = Math.min(R.ixR, doorX + 3.3);
  const desk = (dx: number, row: 0 | 1) => ({ x: tvX + dx, z: front + (row === 0 ? 2.2 : 3.6) });
  return {
    room: R,
    doorX,
    /** The classroom's floor plan: side walls (as the front room's), back (door side) and front (TV) walls. */
    ixL,
    ixR,
    back,
    front,
    /** The TV's screen (centre, size) on its stand near the front wall. */
    tv: { x: tvX, y: 1.4, z: front + 0.5, w: 1.6, h: 0.9 },
    /** Wildan teaching left of the TV, facing the class. */
    wildan: { x: tvX - 1.25, z: front + 0.95 },
    /** Desks (centre of the top) and who sits at each, as seen from the door: far row then near row. */
    desks: [
      { ...desk(-1.15, 0), who: "sinta" },
      { ...desk(1.05, 0), who: "nadia" },
      { ...desk(-1.15, 1), who: "bayu" },
      { ...desk(1.05, 1), who: "fajar" },
    ] as const,
    deskSize: { w: 1.0, d: 0.55, h: 0.72 },
    window: { x: ixL, z0: front + 0.8, z1: front + 4.4, y0: 0.9, y1: 2.4 },
    shelf: { x: ixR - 0.2, z0: front + 1.2, z1: front + 4.2, h: 2.0 },
  };
}
export type ClassFrame = ReturnType<typeof classFrame>;
