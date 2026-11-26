// The character behind the desk, shared by the Solutions shop (Heru the cashier) and the Articles library
// (Andi the librarian): a queue of poses blended over the base pose, breathing, an idle head sway or a head that
// follows the mouse, blinking, the wave and nod overlays, the reaction when clicked, and the invisible hitboxes
// used for hover and click. The page keeps its own loop, camera and pointer listeners and calls into this.
import * as THREE from "three";
import type { CastMember } from "../cast/member";
import { applyPose, type Pose } from "../cast/poses";

type Rect = { left: number; top: number; right: number; bottom: number; width: number; height: number };
type Queued<N> = { name: N; start: number; end: number };

export type Tokoh<N extends string> = ReturnType<typeof createTokoh<N>>;

export function createTokoh<N extends string>(member: CastMember, poses: Record<N, Pose>, scale: number, base: N) {
  const hitMaterial = new THREE.MeshBasicMaterial({ transparent: true, opacity: 0, depthWrite: false });
  const hitHead = new THREE.Mesh(new THREE.SphereGeometry(0.31, 8, 6), hitMaterial);
  const hitChest = new THREE.Mesh(new THREE.SphereGeometry(0.34, 8, 6), hitMaterial);

  let basePose: N = base;
  let shownPose: N = base;
  let queue: Queued<N>[] = [];
  let hit: { start: number; direction: number; mouth: boolean } | null = null;
  let headYaw = 0;
  let headPitch = 0;

  const poseAt = (now: number) => {
    queue = queue.filter((item) => item.end > now);
    return queue.find((item) => item.start <= now)?.name ?? basePose;
  };

  const setFace = (name: N) => {
    const face = poses[name].face;
    if (face) member.express(face);
  };

  const blendPose = (name: N, amount: number) => {
    const bones = member.rig.bones;
    const positions = bones.map((bone) => bone.position.clone());
    const rotations = bones.map((bone) => bone.quaternion.clone());
    const scales = bones.map((bone) => bone.scale.clone());
    applyPose(member, poses[name], false);
    const targetPositions = bones.map((bone) => bone.position.clone());
    const targetRotations = bones.map((bone) => bone.quaternion.clone());
    const targetScales = bones.map((bone) => bone.scale.clone());
    bones.forEach((bone, index) => {
      bone.position.copy(positions[index]).lerp(targetPositions[index], amount);
      bone.quaternion.copy(rotations[index]).slerp(targetRotations[index], amount);
      bone.scale.copy(scales[index]).lerp(targetScales[index], amount);
    });
    member.rig.root.updateMatrixWorld(true);
  };

  const updateHitboxes = () => {
    member.mesh.updateMatrixWorld(true);
    member.rig.bone("head").getWorldPosition(hitHead.position);
    member.rig.bone("chest").getWorldPosition(hitChest.position);
    hitHead.scale.setScalar(scale);
    hitChest.scale.setScalar(scale);
    hitHead.updateMatrixWorld(true);
    hitChest.updateMatrixWorld(true);
  };

  return {
    member,
    hitHead,
    hitChest,
    get pose() {
      return shownPose;
    },
    get base() {
      return basePose;
    },
    get queued() {
      return queue.length > 0;
    },
    get hit() {
      return Boolean(hit);
    },
    get head() {
      return { yaw: headYaw, pitch: headPitch };
    },
    /** The pose the character returns to between actions. */
    setBase(name: N) {
      basePose = name;
    },
    /** Plays poses one after another from now (none under reduced motion). */
    act(items: Array<[N, number]>, reduced: boolean) {
      if (reduced) {
        queue = [];
        return;
      }
      const now = performance.now() / 1000;
      let cursor = now;
      queue = items.map(([name, duration]) => {
        const item = { name, start: cursor, end: cursor + duration };
        cursor = item.end;
        return item;
      });
    },
    clearQueue() {
      queue = [];
    },
    /** Reduced motion switched: drop actions and the reaction, show the base pose's face. */
    reset() {
      queue = [];
      hit = null;
      setFace(basePose);
    },
    /**
     * Poses the character for this frame. Returns a function that takes the frame-only overlays (breathing, head,
     * blink, wave, nod, reaction) off again after rendering, so the blend starts from the plain pose next frame.
     */
    update(
      now: number,
      dt: number,
      o: {
        first: boolean;
        reduced: boolean;
        camera: THREE.Camera;
        rect: Rect;
        mouse: { x: number; y: number; active: boolean };
        finePointer: boolean;
      },
    ) {
      const desired = poseAt(now);
      if (desired !== shownPose) {
        shownPose = desired;
        setFace(desired);
      }
      const amount = o.first || o.reduced ? 1 : 1 - Math.exp(-dt * 9);
      blendPose(desired, amount);
      const rig = member.rig;
      const head = rig.bone("head");
      const eyeL = rig.bone("eyeL");
      const eyeR = rig.bone("eyeR");
      const overlayBones = [
        rig.root,
        head,
        eyeL,
        eyeR,
        rig.bone("upperArmL"),
        rig.bone("upperArmR"),
        rig.bone("lowerArmR"),
      ];
      const overlayBase = overlayBones.map((bone) => ({
        position: bone.position.clone(),
        quaternion: bone.quaternion.clone(),
        scale: bone.scale.clone(),
      }));

      if (!o.reduced) {
        rig.root.position.y += Math.sin(now * 1.7) * (0.012 / scale);

        const { rect, mouse } = o;
        let targetYaw = 0;
        let targetPitch = 0;
        if (mouse.active && o.finePointer && rect.bottom > 0 && rect.top < innerHeight) {
          const headPoint = head.getWorldPosition(new THREE.Vector3()).project(o.camera);
          const hx = rect.left + ((headPoint.x + 1) / 2) * rect.width;
          const hy = rect.top + ((1 - headPoint.y) / 2) * rect.height;
          targetYaw = THREE.MathUtils.clamp(((mouse.x - hx) / (rect.width * 0.45)) * 0.61, -0.61, 0.61);
          targetPitch = THREE.MathUtils.clamp(((mouse.y - hy) / (rect.height * 0.5)) * 0.26, -0.26, 0.26);
        }
        const follow = 1 - Math.exp(-dt * 7);
        headYaw = THREE.MathUtils.lerp(headYaw, targetYaw, follow);
        headPitch = THREE.MathUtils.lerp(headPitch, targetPitch, follow);
        head.rotation.y += mouse.active ? headYaw : Math.sin(now * 0.45) * 0.14;
        head.rotation.x += headPitch;
        eyeL.position.x += headYaw * (0.01 / 0.61) - headPitch * 0.002;
        eyeR.position.x += headYaw * (0.01 / 0.61) - headPitch * 0.002;

        if (now % 4.2 < 0.12) {
          eyeL.scale.y *= 0.15;
          eyeR.scale.y *= 0.15;
        }
        const active = queue.find((item) => item.start <= now && item.end > now);
        if (active?.name === "wave") rig.bone("lowerArmR").rotation.z += Math.sin((now - active.start) / 0.09) * 0.4;
        if (active?.name === "nod") head.rotation.x += Math.sin((now - active.start) / 0.11) * 0.12;
      }

      if (hit && !o.reduced) {
        const u = now - hit.start;
        if (u >= 0.85) hit = null;
        else {
          const env = Math.exp(-u * 5.5);
          const wob = Math.cos(u * 22);
          rig.root.rotation.z += -hit.direction * 0.22 * env * wob;
          rig.root.rotation.x -= 0.12 * env;
          rig.root.position.x += (-hit.direction * 0.06 * env * wob) / scale;
          rig.root.position.y -= (0.04 * env) / scale;
          head.rotation.x -= 0.28 * Math.exp(-u * 7);
          head.rotation.z += -hit.direction * 0.3 * env * Math.cos(u * 18 + 0.6);
          rig.bone("upperArmL").rotation.z -= 0.5 * env;
          rig.bone("upperArmR").rotation.z += 0.5 * env;
          if (u < 0.45) eyeL.scale.y = eyeR.scale.y = 0.12;
          if (hit.mouth && u >= 0.6) {
            hit.mouth = false;
            setFace(shownPose);
          }
        }
      }
      rig.root.updateMatrixWorld(true);
      member.springs?.update(dt);
      updateHitboxes();
      return () => {
        overlayBones.forEach((bone, index) => {
          bone.position.copy(overlayBase[index].position);
          bone.quaternion.copy(overlayBase[index].quaternion);
          bone.scale.copy(overlayBase[index].scale);
        });
        rig.root.updateMatrixWorld(true);
      };
    },
    /** Whether the ray through a screen point (inside rect) hits the character. */
    hits(x: number, y: number, rect: Rect, camera: THREE.Camera, raycaster: THREE.Raycaster, ndc: THREE.Vector2) {
      if (rect.width <= 0 || rect.height <= 0 || x < rect.left || x > rect.right || y < rect.top || y > rect.bottom)
        return false;
      ndc.set(((x - rect.left) / rect.width) * 2 - 1, -((y - rect.top) / rect.height) * 2 + 1);
      raycaster.setFromCamera(ndc, camera);
      return raycaster.intersectObjects([hitHead, hitChest], false).length > 0;
    },
    /** The chest's point on screen. */
    chestOnScreen(rect: Rect, camera: THREE.Camera) {
      const chest = hitChest.position.clone().project(camera);
      return { x: rect.left + ((chest.x + 1) / 2) * rect.width, y: rect.top + ((1 - chest.y) / 2) * rect.height };
    },
    /** Clicked: a startled wobble away from the side that was hit, mouth open, hair and accessories poked. */
    poke(clientX: number, rect: Rect, camera: THREE.Camera) {
      const chestX = this.chestOnScreen(rect, camera).x;
      hit = { start: performance.now() / 1000, direction: clientX >= chestX ? 1 : -1, mouth: true };
      member.express({ browTilt: 0.16, browLift: 0.012, smile: 0, open: 0.52 });
      member.springs?.poke();
    },
    dispose() {
      member.dispose();
      hitHead.geometry.dispose();
      hitChest.geometry.dispose();
      hitMaterial.dispose();
    },
  };
}
