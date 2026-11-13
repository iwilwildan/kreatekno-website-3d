import * as THREE from "three";

export const SCENE_Z_SHIFT = 1.9;
export const LIP_Y = 0.88;
export const LIP_GAP = 8;

type CameraTarget = { pos: THREE.Vector3; look: THREE.Vector3; fov: number };

const shifted = (x: number, y: number, z: number) => new THREE.Vector3(x, y, z - SCENE_Z_SHIFT);

/** Exact v1 hero target, shifted with the shop into the repo's front-lip-at-z=0 coordinates. */
export function heroCameraTarget(height: number, phone: boolean): CameraTarget {
  const fov = phone ? 41 : 35;
  const protoPos = phone ? new THREE.Vector3(1.95, 3.1, 7.2) : new THREE.Vector3(0.32, 2.3, 6.5);
  const protoLook = phone ? new THREE.Vector3(1.95, 2.85, 0) : new THREE.Vector3(0.32, 2.12, 0);
  const dist = protoPos.z - 1.9;
  const ppu = height / (2 * dist * Math.tan(THREE.MathUtils.degToRad(fov / 2)));
  const axis = protoPos.y + ((protoLook.y - protoPos.y) * dist) / protoPos.z;
  const d = LIP_Y + (height / 2 - LIP_GAP) / ppu - axis;
  return {
    pos: shifted(protoPos.x, protoPos.y + d, protoPos.z),
    look: shifted(protoLook.x, protoLook.y + d, protoLook.z),
    fov,
  };
}

export function focusCameraTarget(phone: boolean): CameraTarget {
  return phone
    ? { pos: shifted(1.95, 4.3, 5.6), look: shifted(1.95, 1.45, -0.2), fov: 46 }
    : { pos: shifted(1.4, 3.9, 6.3), look: shifted(1.4, 1.35, 0.15), fov: 36 };
}

export function servedPhoneCameraTarget(): CameraTarget {
  return { pos: shifted(1.95, 3.45, 4.75), look: shifted(1.95, 1.3, -0.1), fov: 46 };
}

export function applyCamera(camera: THREE.PerspectiveCamera, target: CameraTarget, aspect: number) {
  camera.clearViewOffset();
  camera.position.copy(target.pos);
  camera.fov = target.fov;
  camera.aspect = aspect;
  camera.lookAt(target.look);
  camera.updateProjectionMatrix();
}

/**
 * The v1 camera formula preserves its documented position and angle. Correct the
 * small perspective/tilt approximation in that formula with a sub-pixel crop so
 * the physical counter lip still lands exactly LIP_GAP pixels above the stage.
 */
export function pinHeroLip(camera: THREE.PerspectiveCamera, width: number, height: number) {
  camera.updateMatrixWorld(true);
  const lip = new THREE.Vector3(camera.position.x, LIP_Y, 0).project(camera);
  const gap = ((lip.y + 1) / 2) * height;
  camera.setViewOffset(width, height, 0, -(gap - LIP_GAP), width, height);
}
