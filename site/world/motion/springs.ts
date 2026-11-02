// Secondary motion of the cast (hair, ponytail, lanyard, bag, hijab hems) with @pixiv/three-vrm-springbone,
// without a VRM file: joints and colliders are made here from the member's spec. The library damps per call,
// not per second, so it is stepped at a fixed 60 Hz whatever the frame rate, and frames in between show the
// joints part way between the last two steps (on a 120 Hz screen a step every other frame would make the hair
// shake); tails live in world space, so a walking body leaves its hair behind. Teleports (layout change,
// keyframe jumps) reset the tails.
import * as THREE from "three";
import {
  VRMSpringBoneCollider,
  VRMSpringBoneColliderShapeCapsule,
  VRMSpringBoneColliderShapeSphere,
  VRMSpringBoneJoint,
  VRMSpringBoneManager,
} from "@pixiv/three-vrm-springbone";
import type { Vec3 } from "../core/kit";
import type { Rig } from "../cast/rig";

export type SpringSpec = {
  /** The bone that swings and the joint its tip points to (both extra joints of the member). */
  bone: string;
  tip: string;
  /** Pull back to the rest direction (per second), gravity, drag per step, and the tip radius for colliders. */
  stiffness?: number;
  gravity?: number;
  drag?: number;
  radius?: number;
};
/** A sphere (or a capsule to `to`) on a bone, in the member's own space (metres, rest pose). */
export type ColliderSpec = { bone: string; at: Vec3; r: number; to?: Vec3 };

const STEP = 1 / 60;

export class Springs {
  private manager = new VRMSpringBoneManager();
  private acc = 0;
  /** Joint rotations before and after the last step, for the frames in between. */
  private bones: THREE.Bone[] = [];
  private prev: THREE.Quaternion[] = [];
  private next: THREE.Quaternion[] = [];
  /** Seconds of motion left to show: the loop keeps rendering while the springs still swing. */
  busy = 0;

  constructor(rig: Rig, springs: SpringSpec[], colliders: ColliderSpec[], at: (v: Vec3) => Vec3) {
    rig.root.updateMatrixWorld(true);
    const group = {
      colliders: colliders.map((c) => {
        const bone = rig.bone(c.bone),
          origin = bone.getWorldPosition(new THREE.Vector3());
        const local = (v: Vec3) => new THREE.Vector3(...at(v)).sub(origin);
        const shape = c.to
          ? new VRMSpringBoneColliderShapeCapsule({ offset: local(c.at), tail: local(c.to), radius: c.r })
          : new VRMSpringBoneColliderShapeSphere({ offset: local(c.at), radius: c.r });
        const col = new VRMSpringBoneCollider(shape);
        bone.add(col);
        return col;
      }),
    };
    for (const s of springs) this.bones.push(rig.bone(s.bone));
    this.prev = this.bones.map((b) => b.quaternion.clone());
    this.next = this.bones.map((b) => b.quaternion.clone());
    for (const s of springs)
      this.manager.addJoint(
        new VRMSpringBoneJoint(
          rig.bone(s.bone),
          rig.bone(s.tip),
          {
            stiffness: s.stiffness ?? 1.2,
            gravityPower: s.gravity ?? 0.4,
            dragForce: s.drag ?? 0.35,
            hitRadius: s.radius ?? 0.02,
          },
          group.colliders.length ? [group] : [],
        ),
      );
    this.manager.setInitState();
  }

  /** Advances the simulation by dt seconds in fixed steps (at most four per frame), shown part way into the next. */
  update(dt: number) {
    this.acc = Math.min(this.acc + dt, STEP * 4);
    while (this.acc >= STEP) {
      this.prev.forEach((q, i) => q.copy(this.next[i]));
      this.manager.update(STEP);
      this.bones.forEach((b, i) => this.next[i].copy(b.quaternion));
      this.acc -= STEP;
    }
    // the step after the next one is not known yet: show the last two steps blended, one step behind
    const k = this.acc / STEP;
    this.bones.forEach((b, i) => b.quaternion.slerpQuaternions(this.prev[i], this.next[i], k));
    this.busy = Math.max(0, this.busy - dt);
  }

  /** Back to rest where the body is now, then `seconds` of settling (stills, jumps, layout changes). */
  reset(seconds = 0) {
    this.manager.reset();
    this.acc = 0;
    for (let t = 0; t < seconds; t += STEP) this.manager.update(STEP);
    this.bones.forEach((b, i) => {
      this.prev[i].copy(b.quaternion);
      this.next[i].copy(b.quaternion);
    });
  }

  /** The body moved: keep simulating for a while after it stops. */
  poke(seconds = 1.5) {
    this.busy = Math.max(this.busy, seconds);
  }
}
