// Poses of the cast at the K2 hold (from the team's footage): the staff seated at their desks, slumped and
// worn out by the manual work piling up on them (brows up in the middle, mouths down, heavy lids), Bu Dewi
// with both hands on the counter, sad and concerned (team document, K2). Targets are in the character's own frame (metres, facing +z, origin on the floor
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
  /** Heavy eyelids: 0 open … 1 shut (the eye squash a blink uses). */
  lids?: number;
};

/** Seat top of the desk chairs in companyFront.ts. */
const SEAT = 0.505;

export const K2_POSES: Record<string, Pose> = {
  // typing on her phone, held low over the desk edge, head down, overwhelmed (brows high, mouth a little open)
  sinta: {
    seat: SEAT,
    spine: [0.16, 0, 0],
    head: [0.38, 0, 0],
    L: { at: [0.05, 0.84, 0.3], fingers: [-0.4, 0.1, 1] },
    R: { at: [-0.06, 0.84, 0.3], fingers: [0.4, 0.1, 1] },
    face: { browTilt: 0.45, smile: -0.55, browLift: 0.008, open: 0.18 },
    lids: 0.05,
  },
  // at his monitor (to his right on the desk), hands on the keyboard, the slips piling up beside him; weary
  bayu: {
    seat: SEAT,
    spine: [0.16, 0, 0],
    head: [0.14, -0.25, 0],
    L: { at: [-0.04, 0.8, 0.34], fingers: [0, -0.35, 1] },
    R: { at: [-0.3, 0.8, 0.32], fingers: [0, -0.35, 1] },
    face: { browTilt: 0.32, smile: -0.5, browLift: -0.004 },
    lids: 0.32,
  },
  // chin on her right hand, elbow on the desk, the other hand on the laptop; no idea coming, sad
  nadia: {
    seat: SEAT,
    spine: [0.24, 0, 0],
    head: [0.2, 0.05, -0.2],
    R: { at: [-0.04, 0.95, 0.2], fingers: [0.1, 1, 0.25], elbow: [-0.12, 0.8, 0.32] },
    L: { at: [0.12, 0.8, 0.33], fingers: [-0.2, -0.3, 1] },
    face: { browTilt: 0.42, smile: -0.45 },
    lids: 0.28,
  },
  // scratching his head with his right hand, the left on the desk by the tray; puzzled and fed up
  fajar: {
    seat: SEAT,
    spine: [0.14, 0, 0],
    head: [0.16, 0, 0.18],
    R: { at: [-0.16, 1.22, 0.0], fingers: [0.3, 1, -0.3], elbow: [-0.35, 1.05, 0.1] },
    L: { at: [0.1, 0.8, 0.32], fingers: [0, -0.35, 1] },
    face: { browTilt: 0.3, smile: -0.45, mouthShift: 0.014, open: 0.08 },
    lids: 0.15,
  },
  // standing on the cashier floor, both hands on the counter top; sad and concerned for her staff, head a
  // little tilted
  dewi: {
    seat: null,
    head: [0.04, 0, 0.1],
    L: { at: [0.17, 0.79, 0.3], fingers: [0, -0.5, 1] },
    R: { at: [-0.17, 0.79, 0.3], fingers: [0, -0.5, 1] },
    face: { browTilt: 0.36, browLift: 0.004, smile: -0.35 },
  },
};

/**
 * Poses of the staff in COMPANY's classroom (tahap 9, the team's continuation video 29–31 s): seated upright at the
 * small desks facing the TV, heads level toward it, hands resting on the desk by the notebook; Bayu writing in his,
 * Nadia's hands folded. Attentive, a small smile (seen from behind and from the class's back: the posture reads,
 * not the face). Same seat as K2 (the classroom's desks are the front room's height, sets/classLayout).
 */
export const CLASS_POSES: Record<string, Pose> = {
  sinta: {
    seat: SEAT,
    spine: [0.05, 0, 0],
    head: [-0.04, 0, 0.04],
    L: { at: [0.16, 0.79, 0.4], fingers: [-0.2, -0.4, 1] },
    R: { at: [-0.12, 0.79, 0.4], fingers: [0.2, -0.4, 1] },
    face: { browTilt: -0.05, smile: 0.25 },
    lids: 0,
  },
  bayu: {
    seat: SEAT,
    spine: [0.1, 0, 0],
    head: [0.1, 0.05, 0],
    // the right hand writing on the notebook (left of him on the desk), the left holding its corner
    R: { at: [0.06, 0.79, 0.46], fingers: [0.1, -0.6, 1] },
    L: { at: [0.27, 0.79, 0.4], fingers: [-0.1, -0.5, 1] },
    face: { browTilt: -0.05, smile: 0.15 },
    lids: 0.1,
  },
  nadia: {
    seat: SEAT,
    spine: [0.06, 0, 0],
    head: [-0.03, 0, -0.05],
    // hands folded on the desk's front edge
    L: { at: [0.05, 0.8, 0.36], fingers: [-1, -0.2, 0.4] },
    R: { at: [-0.05, 0.8, 0.38], fingers: [1, -0.2, 0.4] },
    face: { browTilt: -0.05, smile: 0.3 },
    lids: 0,
  },
  fajar: {
    seat: SEAT,
    spine: [0.04, 0, 0],
    head: [-0.05, 0, 0],
    L: { at: [0.18, 0.79, 0.38], fingers: [0, -0.4, 1] },
    R: { at: [-0.16, 0.79, 0.36], fingers: [0, -0.4, 1] },
    face: { browTilt: -0.05, smile: 0.25 },
    lids: 0,
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
  for (const n of ["eyeL", "eyeR"]) rig.bone(n).scale.y = 1 - 0.88 * (p.lids ?? 0);
  if (face && p.face) m.express(p.face);
}
