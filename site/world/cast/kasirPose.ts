import type { Pose } from "./poses";

const smile = { browTilt: 0.02, smile: 0.52, browLift: 0.002 };

/** Seven cashier poses translated from the v1 Raka silhouette to Heru's narrower rig. */
export const KASIR_POSES = {
  idle: { seat: null, head: [0, 0, 0], face: smile },
  ready: {
    seat: 0.18,
    spine: [0.18, 0, 0],
    chest: [0.08, 0, 0],
    head: [0.3, 0, 0],
    L: { at: [0.13, 0.68, 0.28], fingers: [0, -0.4, 1] },
    R: { at: [-0.13, 0.68, 0.28], fingers: [0, -0.4, 1] },
    face: smile,
  },
  lift: {
    seat: null,
    spine: [0.14, 0, 0],
    head: [-0.02, 0, 0],
    L: { at: [0.17, 1.05, 0.36], fingers: [0, -0.15, 1] },
    R: { at: [-0.17, 1.05, 0.36], fingers: [0, -0.15, 1] },
    face: smile,
  },
  offer: {
    seat: null,
    spine: [0.2, 0, 0],
    head: [0.12, 0, 0],
    L: { at: [0.14, 0.98, 0.42], fingers: [0, -0.2, 1] },
    R: { at: [-0.14, 0.98, 0.42], fingers: [0, -0.2, 1] },
    face: smile,
  },
  wave: {
    seat: null,
    head: [-0.05, 0, -0.06],
    R: { at: [-0.28, 1.55, 0.12], fingers: [-0.1, 1, 0.15], elbow: [-0.32, 1.3, 0.02] },
    face: smile,
  },
  shrug: {
    seat: null,
    head: [0.16, 0, 0],
    L: { at: [0.35, 1.12, 0.24], fingers: [0, 0.25, 1], elbow: [0.33, 1.0, 0] },
    R: { at: [-0.35, 1.12, 0.24], fingers: [0, 0.25, 1], elbow: [-0.33, 1.0, 0] },
    face: { browTilt: 0.3, smile: 0.08, browLift: 0.008 },
  },
  nod: { seat: null, spine: [0.06, 0, 0], head: [0.2, 0, 0], face: smile },
} satisfies Record<string, Pose>;

export type KasirPoseName = keyof typeof KASIR_POSES;
