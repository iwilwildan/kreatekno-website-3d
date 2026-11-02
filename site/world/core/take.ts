// Keyframe cameras: each keyframe has a pc (16:9) and an hp (9:16) solve, blended by the screen's format.
import * as THREE from "three";
import { lerp } from "./kit";

export type CamPose = { pos: THREE.Vector3; quat: THREE.Quaternion; fov: number };

/** Keyframe camera blended between its pc and hp solves. */
export function blendCam(
  pc: { pos: number[]; quat: number[]; fov: number },
  hp: { pos: number[]; quat: number[]; fov: number },
  t: number,
): CamPose {
  return {
    pos: new THREE.Vector3().fromArray(pc.pos).lerp(new THREE.Vector3().fromArray(hp.pos), t),
    quat: new THREE.Quaternion().fromArray(pc.quat).slerp(new THREE.Quaternion().fromArray(hp.quat), t),
    fov: lerp(pc.fov, hp.fov, t),
  };
}
