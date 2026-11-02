// Skeleton of a cast member: plain three.js Bones placed at the joints of the rest pose (standing, arms down,
// facing +z; L is the character's left, +x). Poses are local Euler rotations per bone; arms and legs can also be
// placed with an analytic two-bone IK (law of cosines, with a pole point that picks the bend plane).
import * as THREE from "three";
import type { Vec3 } from "../core/kit";

export type Joint = { name: string; parent: string | null; at: Vec3 };
export type Pose = Record<string, Vec3>;

export class Rig {
  readonly bones: THREE.Bone[] = [];
  readonly byName = new Map<string, THREE.Bone>();
  readonly rest = new Map<string, THREE.Vector3>();

  constructor(joints: Joint[]) {
    for (const j of joints) {
      const b = new THREE.Bone();
      b.name = j.name;
      const p = j.parent ? joints.find((k) => k.name === j.parent)!.at : ([0, 0, 0] as Vec3);
      b.position.set(j.at[0] - p[0], j.at[1] - p[1], j.at[2] - p[2]);
      this.rest.set(j.name, b.position.clone());
      if (j.parent) this.byName.get(j.parent)!.add(b);
      this.bones.push(b);
      this.byName.set(j.name, b);
    }
  }

  get root() {
    return this.bones[0];
  }
  bone(name: string) {
    const b = this.byName.get(name);
    if (!b) throw new Error(`no bone ${name}`);
    return b;
  }
  index(name: string) {
    return this.bones.indexOf(this.bone(name));
  }

  /** Back to the rest pose, then the given rotations (radians, XYZ order). */
  pose(p: Pose = {}) {
    for (const b of this.bones) {
      b.quaternion.identity();
      b.position.copy(this.rest.get(b.name)!);
    }
    for (const [n, r] of Object.entries(p)) this.bone(n).rotation.set(r[0], r[1], r[2]);
    this.root.updateMatrixWorld(true);
  }

  /**
   * Bends upper → lower so that `end` reaches `target` (world), bending toward `pole` (world). Out-of-reach
   * targets get a straight limb pointing at them.
   */
  ik(upper: string, lower: string, end: string, target: THREE.Vector3, pole: THREE.Vector3) {
    const U = this.bone(upper),
      L = this.bone(lower),
      E = this.bone(end);
    this.root.updateMatrixWorld(true);
    const a = U.getWorldPosition(new THREE.Vector3()),
      b = L.getWorldPosition(new THREE.Vector3()),
      e = E.getWorldPosition(new THREE.Vector3());
    const la = a.distanceTo(b),
      lb = b.distanceTo(e);
    const dir = target.clone().sub(a);
    const c = Math.min(Math.max(dir.length(), Math.abs(la - lb) + 1e-4), la + lb - 1e-4);
    dir.normalize();
    const side = pole.clone().sub(a);
    side.sub(dir.clone().multiplyScalar(side.dot(dir)));
    if (side.lengthSq() < 1e-10) side.set(0, 0, 1).sub(dir.clone().multiplyScalar(dir.z));
    side.normalize();
    const cosA = (la * la + c * c - lb * lb) / (2 * la * c),
      sinA = Math.sqrt(Math.max(0, 1 - cosA * cosA));
    const knee = a
      .clone()
      .add(dir.clone().multiplyScalar(la * cosA))
      .add(side.multiplyScalar(la * sinA));
    const endAt = a.clone().add(dir.multiplyScalar(c));
    aim(U, b.clone().sub(a), knee.clone().sub(a));
    this.root.updateMatrixWorld(true);
    const b2 = L.getWorldPosition(new THREE.Vector3()),
      e2 = E.getWorldPosition(new THREE.Vector3());
    aim(L, e2.sub(b2), endAt.sub(knee));
    this.root.updateMatrixWorld(true);
  }

  /** Turns a bone so its rest direction `axis` (bone space, e.g. fingers along −y) points along `dir` (world). */
  point(name: string, dir: THREE.Vector3, axis = new THREE.Vector3(0, -1, 0)) {
    const b = this.bone(name);
    this.root.updateMatrixWorld(true);
    const now = axis.clone().applyQuaternion(b.getWorldQuaternion(new THREE.Quaternion()));
    aim(b, now, dir.clone());
    this.root.updateMatrixWorld(true);
  }

  /** Gives a bone the same world orientation as the root, turned `yaw` more (feet flat after leg IK). */
  level(name: string, yaw = 0) {
    const b = this.bone(name);
    this.root.updateMatrixWorld(true);
    const want = this.root.getWorldQuaternion(new THREE.Quaternion());
    if (yaw) want.premultiply(new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), yaw));
    const parent = b.parent!.getWorldQuaternion(new THREE.Quaternion());
    b.quaternion.copy(parent.invert().multiply(want));
    this.root.updateMatrixWorld(true);
  }
}

/** Rotates bone `b` in world space so that world direction `from` turns into `to`. */
function aim(b: THREE.Bone, from: THREE.Vector3, to: THREE.Vector3) {
  const d = new THREE.Quaternion().setFromUnitVectors(from.normalize(), to.normalize());
  const world = b.getWorldQuaternion(new THREE.Quaternion());
  const parent = b.parent ? b.parent.getWorldQuaternion(new THREE.Quaternion()) : new THREE.Quaternion();
  b.quaternion.copy(parent.invert().multiply(d.multiply(world)));
}
