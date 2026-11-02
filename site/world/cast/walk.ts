// Walking along a path on the floor, as a pure function of the distance walked (not of time), so a scrolled
// walk can be played backwards and the feet never slide when the pace changes. Footprints are laid along the
// path: both feet start together, the first step is a half step, every next step moves the back foot past the
// other one, and the last step brings the trailing foot alongside. A planted foot stays put in the world while
// the body passes over it; the legs reach their prints with the two-bone IK of the rig, and the pelvis drops
// just enough that no leg is ever straight (a leg at full stretch makes the knee snap). `turnStride` turns a
// standing member on the spot in three small steps.
import * as THREE from "three";
import type { CastMember } from "./member";

/** `yaw`: the way the foot points (world heading), when it differs from the body's. */
export type Foot = { at: THREE.Vector3; lift: number; yaw?: number };
export type Stride = {
  /** Ground point under the pelvis and the heading (yaw, character faces +z at 0). */
  body: THREE.Vector3;
  yaw: number;
  L: Foot;
  R: Foot;
  /** −1 … 1: which foot is ahead (left positive); drives the hips and the arm swing. */
  swing: number;
};

export class Walk {
  readonly curve: THREE.CatmullRomCurve3;
  readonly length: number;
  private steps: { foot: "L" | "R"; from: number; to: number; a: number; b: number }[] = [];

  /** `points` on the floor (y ignored); `step` the target step length; `first` the foot that moves first. */
  constructor(
    points: THREE.Vector3[],
    readonly opts: { step?: number; side?: number; first?: "L" | "R"; lift?: number } = {},
  ) {
    this.curve = new THREE.CatmullRomCurve3(
      points.map((p) => new THREE.Vector3(p.x, 0, p.z)),
      false,
      "centripetal",
    );
    this.length = this.curve.getLength();
    const n = Math.max(2, Math.round(this.length / (opts.step ?? 0.42))),
      sl = this.length / n,
      first = opts.first ?? "R",
      other = first === "R" ? "L" : "R";
    // step k (1 … n+1) moves one foot to k·sl (the last one to the end) while the body walks from (k−1.5)·sl to
    // (k−0.5)·sl, clamped to the path
    const at: Record<"L" | "R", number> = { L: 0, R: 0 };
    for (let k = 1; k <= n + 1; k++) {
      const foot = k % 2 ? first : other,
        to = Math.min(k, n) * sl;
      this.steps.push({
        foot,
        from: at[foot],
        to,
        a: Math.max(0, (k - 1.5) * sl),
        b: Math.min(this.length, (k - 0.5) * sl),
      });
      at[foot] = to;
    }
  }

  /** Where the body and both feet are after walking `d` metres along the path. */
  at(d: number): Stride {
    d = Math.min(this.length, Math.max(0, d));
    const side = this.opts.side ?? 0.096,
      lift = this.opts.lift ?? 0.06;
    const feet: Record<"L" | "R", { d: number; lift: number }> = { L: { d: 0, lift: 0 }, R: { d: 0, lift: 0 } };
    for (const s of this.steps) {
      if (d >= s.b) feet[s.foot] = { d: s.to, lift: 0 };
      else if (d > s.a) {
        // the swing takes the middle 80% of the step; both feet are down around its ends
        const t = Math.min(1, Math.max(0, ((d - s.a) / (s.b - s.a) - 0.1) / 0.8)),
          e = t * t * (3 - 2 * t);
        feet[s.foot] = { d: s.from + (s.to - s.from) * e, lift: lift * Math.sin(Math.PI * t) };
      }
    }
    const point = (dd: number) => this.curve.getPointAt(Math.min(1, Math.max(0, dd / this.length)));
    const tangent = (dd: number) => this.curve.getTangentAt(Math.min(1, Math.max(0, dd / this.length)));
    const foot = (f: "L" | "R"): Foot => {
      const p = point(feet[f].d),
        t = tangent(feet[f].d),
        s = f === "L" ? side : -side;
      // the character's left of a heading (tx, tz) is (tz, −tx)
      // each foot points along the path where it stands
      return { at: p.add(new THREE.Vector3(t.z * s, 0, -t.x * s)), lift: feet[f].lift, yaw: Math.atan2(t.x, t.z) };
    };
    const t = tangent(d),
      sl = this.length / Math.max(1, this.steps.length - 1);
    return {
      body: point(d),
      yaw: Math.atan2(t.x, t.z),
      L: foot("L"),
      R: foot("R"),
      swing: Math.max(-1, Math.min(1, (feet.L.d - feet.R.d) / sl)),
    };
  }
}

/**
 * Turning on the spot at `at` from heading `from` by `by` radians (k 0..1): the foot on the turning side opens
 * half way, the other one closes the whole way, then the first comes alongside. The body turns smoothly over the
 * steps; `feetBy` (default `by`) is where the feet end up, when the body ends turned against its feet.
 */
export function turnStride(at: THREE.Vector3, from: number, by: number, k: number, feetBy = by, side = 0.096): Stride {
  const lead = by < 0 ? "R" : "L",
    other = lead === "R" ? "L" : "R";
  const step = (a: number, b: number) => {
    const t = Math.min(1, Math.max(0, ((k - a) / (b - a) - 0.1) / 0.8));
    return { e: t * t * (3 - 2 * t), lift: 0.04 * Math.sin(Math.PI * t) };
  };
  const s1 = step(0, 1 / 3),
    s2 = step(1 / 3, 2 / 3),
    s3 = step(2 / 3, 1);
  const yaws = {
    [lead]: from + feetBy * (0.5 * s1.e + 0.5 * s3.e),
    [other]: from + feetBy * s2.e,
  } as Record<"L" | "R", number>;
  const lifts = { [lead]: s1.lift + s3.lift, [other]: s2.lift } as Record<"L" | "R", number>;
  const foot = (f: "L" | "R"): Foot => {
    const y = yaws[f],
      s = f === "L" ? side : -side;
    // the character's left of heading y is (cos y, −sin y)
    return { at: at.clone().add(new THREE.Vector3(Math.cos(y) * s, 0, -Math.sin(y) * s)), lift: lifts[f], yaw: y };
  };
  const e = k * k * (3 - 2 * k);
  return { body: at.clone(), yaw: from + by * e, L: foot("L"), R: foot("R"), swing: 0 };
}

/** Extra pose on top of the stride: lean, head, breathing, and an arm reaching for a world point. */
export type WalkExtra = {
  yaw?: number;
  lean?: number;
  head?: [number, number];
  breathe?: number;
  /** `pole` (where the elbow points) is in the member's own frame. */
  reachL?: { at: THREE.Vector3; weight: number; pole: THREE.Vector3 };
};

const _q = [new THREE.Quaternion(), new THREE.Quaternion(), new THREE.Quaternion()];

/** Poses a standing member on a stride (mesh placed and turned, legs on their prints, arms swinging). */
export function walkPose(m: CastMember, s: Stride, x: WalkExtra = {}) {
  const { rig, mesh } = m;
  mesh.position.set(s.body.x, 0, s.body.z);
  mesh.rotation.set(0, s.yaw + (x.yaw ?? 0), 0);
  mesh.updateMatrixWorld(true);
  const sw = s.swing,
    arm = 0.32 * sw;
  rig.pose({
    hips: [0, 0.07 * sw, 0],
    spine: [x.lean ?? 0, 0, 0],
    chest: [x.breathe ?? 0, -0.05 * sw, 0],
    head: [x.head?.[0] ?? 0, x.head?.[1] ?? 0, 0],
    upperArmL: [arm, 0, 0.06],
    lowerArmL: [-0.18 - Math.max(0, -arm) * 0.4, 0, 0],
    upperArmR: [-arm, 0, -0.06],
    lowerArmR: [-0.18 - Math.max(0, arm) * 0.4, 0, 0],
  });
  rig.root.position.y = 0;
  rig.root.updateMatrixWorld(true);
  const rest = restOf(m),
    targets = { L: s.L.at.clone().setY(rest.ankle + s.L.lift), R: s.R.at.clone().setY(rest.ankle + s.R.lift) };
  // lowest pelvis drop that keeps each leg at most REACH of its length from hip to ankle (a soft minimum of
  // both, so the pelvis does not kink where the legs trade over)
  const reach = rest.leg * REACH,
    drop = (["L", "R"] as const).map((n) => {
      const hip = rig.bone("thigh" + n).getWorldPosition(new THREE.Vector3()),
        t = targets[n],
        h2 = (hip.x - t.x) ** 2 + (hip.z - t.z) ** 2;
      return t.y + Math.sqrt(Math.max(0, reach * reach - h2)) - hip.y;
    });
  rig.root.position.y = softMin(softMin(drop[0], drop[1], 0.03), 0, 0.01);
  rig.root.updateMatrixWorld(true);
  const yaw = mesh.rotation.y;
  for (const n of ["L", "R"] as const) {
    const pole = mesh.localToWorld(new THREE.Vector3(n === "L" ? rest.side : -rest.side, 0.5, 1.2));
    rig.ik("thigh" + n, "shin" + n, "foot" + n, targets[n], pole);
    rig.level("foot" + n, s[n].yaw == null ? 0 : s[n].yaw! - yaw);
  }
  const r = x.reachL;
  if (r && r.weight > 0) {
    const names = ["upperArmL", "lowerArmL", "handL"].map((b) => rig.bone(b));
    names.forEach((b, i) => _q[i].copy(b.quaternion));
    rig.ik("upperArmL", "lowerArmL", "handL", r.at, mesh.localToWorld(r.pole.clone()));
    if (r.weight < 1) names.forEach((b, i) => b.quaternion.copy(_q[i].slerp(b.quaternion, r.weight)));
    rig.root.updateMatrixWorld(true);
  }
}

/** Longest a leg gets from hip to ankle, as a share of its length: the knee always keeps a little bend. */
const REACH = 0.985;
/** Smooth minimum (k: width of the blend, metres). */
const softMin = (a: number, b: number, k: number) => {
  const h = Math.max(k - Math.abs(a - b), 0) / k;
  return Math.min(a, b) - (h * h * k) / 4;
};

/** Ankle height, foot spacing and leg length (hip to knee to ankle) of the member's rest pose (measured once). */
const RESTS = new WeakMap<CastMember, { ankle: number; side: number; leg: number }>();
function restOf(m: CastMember) {
  let r = RESTS.get(m);
  if (!r) {
    // rest positions are relative to the parent; summing them up the chain gives the rest-pose joint
    const restAt = (name: string) => {
      const p = new THREE.Vector3();
      for (let o: THREE.Object3D | null = m.rig.bone(name); o && o !== m.mesh; o = o.parent)
        p.add(m.rig.rest.get(o.name) ?? o.position);
      return p;
    };
    const ankle = restAt("footL"),
      knee = restAt("shinL"),
      hip = restAt("thighL");
    r = { ankle: ankle.y, side: ankle.x, leg: hip.distanceTo(knee) + knee.distanceTo(ankle) };
    RESTS.set(m, r);
  }
  return r;
}
