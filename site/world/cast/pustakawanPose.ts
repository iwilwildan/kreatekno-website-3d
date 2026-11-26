import type { Pose } from "./poses";

const smile = { browTilt: 0.02, smile: 0.5, browLift: 0.002 };

/**
 * Librarian poses for Andi (Pustaka P2), in his own frame (1.69 m; the cashier poses scaled from Heru's 1.8 m).
 * At the library desk he stands at scale 1.9 with his feet 0.47 m below the floor line, so the desk top (1.06 m)
 * is at y 0.805 in his frame (P3).
 */
export const PUSTAKAWAN_POSES = {
  // reading an open book held at the chest, head down, eyes lowered
  idle: {
    seat: null,
    spine: [0.05, 0, 0],
    head: [0.36, 0, 0],
    L: { at: [0.11, 0.95, 0.24], fingers: [0.15, 1, 0.45], elbow: [0.4, 0.8, -0.1] },
    R: { at: [-0.11, 0.95, 0.24], fingers: [-0.15, 1, 0.45], elbow: [-0.4, 0.8, -0.1] },
    lids: 0.35,
    face: { browTilt: 0.04, smile: 0.32, browLift: 0 },
  },
  // looks up from the book, leaning in with both hands on the desk: listening to the question
  ready: {
    seat: null,
    spine: [0.14, 0, 0],
    chest: [0.04, 0, 0],
    head: [-0.12, 0, 0],
    L: { at: [0.14, 0.835, 0.36], fingers: [0, -0.25, 1] },
    R: { at: [-0.14, 0.835, 0.36], fingers: [0, -0.25, 1] },
    face: { browTilt: 0.04, smile: 0.5, browLift: 0.006 },
  },
  // books held up at the chest, brought from the shelf
  lift: {
    seat: null,
    spine: [0.1, 0, 0],
    head: [-0.02, 0, 0],
    L: { at: [0.13, 0.98, 0.33], fingers: [0, -0.15, 1] },
    R: { at: [-0.13, 0.98, 0.33], fingers: [0, -0.15, 1] },
    face: smile,
  },
  // books held out over the desk
  offer: {
    seat: null,
    spine: [0.2, 0, 0],
    head: [0.1, 0, 0],
    L: { at: [0.12, 0.9, 0.4], fingers: [0, -0.2, 1] },
    R: { at: [-0.12, 0.9, 0.4], fingers: [0, -0.2, 1] },
    face: smile,
  },
  wave: {
    seat: null,
    head: [-0.05, 0, -0.06],
    R: { at: [-0.26, 1.46, 0.11], fingers: [-0.1, 1, 0.15], elbow: [-0.3, 1.22, 0.02] },
    face: smile,
  },
  shrug: {
    seat: null,
    head: [0.16, 0, 0],
    L: { at: [0.33, 1.05, 0.23], fingers: [0, 0.25, 1], elbow: [0.31, 0.94, 0] },
    R: { at: [-0.33, 1.05, 0.23], fingers: [0, 0.25, 1], elbow: [-0.31, 0.94, 0] },
    face: { browTilt: 0.3, smile: 0.08, browLift: 0.008 },
  },
  nod: { seat: null, spine: [0.06, 0, 0], head: [0.2, 0, 0], face: smile },
  // pressing the stamp onto the loan card on the desk, the other hand resting on the desk
  stamp: {
    seat: null,
    spine: [0.18, 0, 0],
    head: [0.28, 0, 0],
    L: { at: [0.15, 0.83, 0.36], fingers: [-0.25, -0.2, 1] },
    R: { at: [-0.09, 0.985, 0.37], fingers: [0.05, -1, 0.1], elbow: [-0.45, 1.0, -0.05] },
    face: { browTilt: 0.02, smile: 0.4, browLift: 0 },
  },
  // the stamp held up over the card, before and after the press
  stampLift: {
    seat: null,
    spine: [0.16, 0, 0],
    head: [0.26, 0, 0],
    L: { at: [0.15, 0.83, 0.36], fingers: [-0.25, -0.2, 1] },
    R: { at: [-0.1, 1.07, 0.36], fingers: [0.05, -1, 0.1], elbow: [-0.45, 1.05, -0.05] },
    face: { browTilt: 0.02, smile: 0.45, browLift: 0.002 },
  },
} satisfies Record<string, Pose>;

export type PustakawanPoseName = keyof typeof PUSTAKAWAN_POSES;
