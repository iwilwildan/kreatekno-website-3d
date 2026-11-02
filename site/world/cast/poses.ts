// Poses of the cast at the K2 hold (from the team's footage): the staff seated at their desks, Bu Dewi with
// both hands on the counter. Targets are in the character's own frame (metres, facing +z, origin on the floor
// under the pelvis); the member's mesh must already stand in its spot.
import * as THREE from "three";
import type { Vec3 } from "../core/kit";
import type { Expression } from "./face";
import type { CastMember } from "./member";

type Hand = { at: Vec3; fingers: Vec3; elbow?: Vec3 };
export type Pose = {
  /** Seat height (top of the cushion) or null when standing. */
  seat: number | null;
  spine?: Vec3;
  chest?: Vec3;
  head?: Vec3;
  L?: Hand;
  R?: Hand;
  face?: Expression;
};

/** Seat top of the desk chairs in companyFront.ts. */
const SEAT = 0.505;

export const K2_POSES: Record<string, Pose> = {
  // typing on her phone, held low over the desk edge, head down, worried
  sinta: {
    seat: SEAT,
    spine: [0.12, 0, 0],
    head: [0.38, 0, 0],
    L: { at: [0.05, 0.84, 0.3], fingers: [-0.4, 0.1, 1] },
    R: { at: [-0.06, 0.84, 0.3], fingers: [0.4, 0.1, 1] },
    face: { browTilt: 0.22, smile: -0.35, browLift: 0.004 },
  },
  // at his monitor (to his right on the desk), hands on the keyboard, worried
  bayu: {
    seat: SEAT,
    spine: [0.1, 0, 0],
    head: [0.08, -0.25, 0],
    L: { at: [-0.04, 0.8, 0.34], fingers: [0, -0.35, 1] },
    R: { at: [-0.3, 0.8, 0.32], fingers: [0, -0.35, 1] },
    face: { browTilt: 0.2, smile: -0.25 },
  },
  // chin on her right hand, elbow on the desk, the other hand on the laptop; sad
  nadia: {
    seat: SEAT,
    spine: [0.2, 0, 0],
    head: [0.18, 0.05, -0.18],
    R: { at: [-0.04, 0.95, 0.2], fingers: [0.1, 1, 0.25], elbow: [-0.12, 0.8, 0.32] },
    L: { at: [0.12, 0.8, 0.33], fingers: [-0.2, -0.3, 1] },
    face: { browTilt: 0.28, smile: -0.4 },
  },
  // scratching his head with his right hand, the left on the desk by the tray; puzzled
  fajar: {
    seat: SEAT,
    spine: [0.08, 0, 0],
    head: [0.12, 0, 0.18],
    R: { at: [-0.16, 1.22, 0.0], fingers: [0.3, 1, -0.3], elbow: [-0.35, 1.05, 0.1] },
    L: { at: [0.1, 0.8, 0.32], fingers: [0, -0.35, 1] },
    face: { browTilt: -0.12, smile: -0.2, mouthShift: 0.012 },
  },
  // standing on the cashier floor, both hands on the counter top, a friendly smile
  dewi: {
    seat: null,
    L: { at: [0.17, 0.79, 0.3], fingers: [0, -0.5, 1] },
    R: { at: [-0.17, 0.79, 0.3], fingers: [0, -0.5, 1] },
    face: { smile: 0.45 },
  },
};

/**
 * Applies a pose to a member standing in its spot (mesh position and rotation already set). The face is painted
 * only when asked (it redraws the atlas, too slow for every frame of an action).
 */
export function applyPose(m: CastMember, p: Pose, face = true) {
  const { rig, mesh } = m;
  const W = (v: Vec3) => mesh.localToWorld(new THREE.Vector3(...v));
  const D = (v: Vec3) => new THREE.Vector3(...v).normalize().transformDirection(mesh.matrixWorld);
  rig.pose({ spine: p.spine ?? [0, 0, 0], chest: p.chest ?? [0, 0, 0], head: p.head ?? [0, 0, 0] });
  mesh.updateMatrixWorld(true);
  if (p.seat != null) {
    // lower the body so the thighs rest on the cushion, then place the feet on the floor in front
    const hip = rig.bone("thighL").getWorldPosition(new THREE.Vector3());
    const drop = hip.y - mesh.position.y - (p.seat + 0.07);
    rig.root.position.y -= drop / mesh.scale.y;
    rig.root.updateMatrixWorld(true);
    for (const [n, s] of [
      ["L", 1],
      ["R", -1],
    ] as const) {
      const x = rig.bone("thigh" + n).getWorldPosition(new THREE.Vector3());
      const lx = mesh.worldToLocal(x.clone()).x;
      rig.ik("thigh" + n, "shin" + n, "foot" + n, W([lx + s * 0.02, 0.1, 0.42]), W([lx, 0.6, 1.2]));
      rig.level("foot" + n);
    }
  }
  for (const [n, s] of [
    ["L", 1],
    ["R", -1],
  ] as const) {
    const h = p[n];
    if (!h) continue;
    const sh = mesh.worldToLocal(rig.bone("upperArm" + n).getWorldPosition(new THREE.Vector3()));
    const pole = h.elbow ?? ([sh.x + s * 0.35, sh.y - 0.35, -0.25] as Vec3);
    rig.ik("upperArm" + n, "lowerArm" + n, "hand" + n, W(h.at), W(pole));
    rig.point("hand" + n, D(h.fingers));
  }
  if (face && p.face) m.express(p.face);
}
