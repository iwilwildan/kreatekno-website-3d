// Gathers the parts of one cast member (built in rest-pose space, metres) into a single SkinnedMesh: one atlas,
// one material, one draw call. Each part says how its vertices follow the bones: rigid to one bone, or blended
// between bones along an axis (sleeves bend at the elbow, trousers at the knee), like a jointed vinyl toy.
import * as THREE from "three";
import type { Vec3 } from "../core/kit";
import type { UvMap } from "./atlas";
import type { Rig } from "./rig";

/**
 * Up to three bones: [a, b, weight of b] or [a, b, weight of b, c, weight of c]; a gets the rest. A third bone
 * lets soft parts blend between two neighbouring spring bones as well as their parent (hair, hijab hems).
 */
export type Weights = (p: THREE.Vector3) => [number, number, number] | [number, number, number, number, number];

type Part = { geo: THREE.BufferGeometry; uv: UvMap; w: Weights; planar?: Planar };
/** Replaces the part's uv with a front projection of x, y over this box (faces, hair). */
export type Planar = { x0: number; x1: number; y0: number; y1: number };

const smooth = (t: number) => (t <= 0 ? 0 : t >= 1 ? 1 : t * t * (3 - 2 * t));

/** Moves a vertex (and its normal) from the reference space the parts were modelled in to the character. */
export type Warp = (p: THREE.Vector3, n: THREE.Vector3) => void;

export class Figure {
  private parts: Part[] = [];
  /**
   * `warp` maps the modelling space to the character (see member.ts); weights and planar uv are worked out
   * before it, so parts and weights can be written once for the 1.8 m reference body.
   */
  constructor(
    readonly rig: Rig,
    readonly warp?: Warp,
  ) {}

  add(geo: THREE.BufferGeometry, uv: UvMap, w: Weights | string, planar?: Planar) {
    this.parts.push({ geo, uv, w: typeof w === "string" ? this.rigid(w) : w, planar });
  }

  rigid(bone: string): Weights {
    const i = this.rig.index(bone);
    return () => [i, i, 0];
  }

  /**
   * Hangs the lower part of a soft part (below `top`, fully at `bottom`) on spring bones placed around the body
   * axis: each vertex blends between the two bones nearest in angle (0 = straight back, + toward the left side),
   * so neighbouring springs share the cloth without a seam. `base` weights the part above.
   */
  hem(base: Weights, bones: [string, number][], top: number, bottom: number, axisZ = 0): Weights {
    const ring = bones.map(([b, a]) => [this.rig.index(b), a] as const).sort((x, y) => x[1] - y[1]);
    return (p) => {
      const w = smooth((top - p.y) / (top - bottom));
      if (w <= 0 || !ring.length) return base(p);
      const a = Math.atan2(p.x, -(p.z - axisZ));
      let i = ring.findIndex(([, ra]) => ra > a);
      if (i < 0) i = ring.length;
      const [b1, a1] = ring[(i - 1 + ring.length) % ring.length],
        [b2, a2] = ring[i % ring.length];
      const span = (((a2 - a1) % (2 * Math.PI)) + 2 * Math.PI) % (2 * Math.PI) || 2 * Math.PI,
        t = ((((a - a1) % (2 * Math.PI)) + 2 * Math.PI) % (2 * Math.PI)) / span;
      const [pa] = base(p);
      return [pa, b1, w * (1 - t), b2, w * t];
    };
  }

  /**
   * Weights along a chain of bones: `knots` are [bone, point] pairs on an axis; between two knots the weight
   * blends over `band` metres around the joint of the next bone.
   */
  chain(knots: [string, Vec3][], band = 0.06): Weights {
    const idx = knots.map(([b]) => this.rig.index(b)),
      pts = knots.map(([, p]) => new THREE.Vector3(...p)),
      a = pts[0],
      axis = pts[pts.length - 1].clone().sub(a),
      L = axis.length();
    axis.normalize();
    const at = pts.map((p) => p.clone().sub(a).dot(axis));
    const v = new THREE.Vector3();
    return (p) => {
      const t = v.copy(p).sub(a).dot(axis);
      for (let k = 1; k < at.length; k++) {
        const j = at[k];
        if (t < j + band / 2 || k === at.length - 1) {
          const w = smooth((t - (j - band / 2)) / band);
          return t < j - band / 2 || L === 0 ? [idx[k - 1], idx[k - 1], 0] : [idx[k - 1], idx[k], w];
        }
      }
      return [idx[idx.length - 1], idx[idx.length - 1], 0];
    };
  }

  /** Builds the mesh; the skeleton is bound in the rest pose the parts were modelled in. */
  build(material: THREE.Material) {
    let count = 0,
      tris = 0;
    const geos = this.parts.map((p) => {
      const g = p.geo.index ? p.geo : indexed(p.geo);
      count += g.attributes.position.count;
      tris += g.index!.count / 3;
      return g;
    });
    const partTris = geos.map((g) => g.index!.count / 3);
    const pos = new Float32Array(count * 3),
      nor = new Float32Array(count * 3),
      uv = new Float32Array(count * 2),
      si = new Uint16Array(count * 4),
      sw = new Float32Array(count * 4),
      idx = new Uint32Array(tris * 3);
    let o = 0,
      t = 0;
    const v = new THREE.Vector3(),
      nv = new THREE.Vector3();
    this.parts.forEach((part, n) => {
      const g = geos[n],
        P = g.attributes.position,
        N = g.attributes.normal,
        U = g.attributes.uv,
        I = g.index!;
      for (let i = 0; i < I.count; i++) idx[t++] = I.getX(i) + o;
      for (let i = 0; i < P.count; i++, o++) {
        v.fromBufferAttribute(P, i);
        nv.fromBufferAttribute(N, i);
        let u = U ? U.getX(i) : 0.5,
          vv = U ? U.getY(i) : 0.5;
        if (part.planar) {
          const b = part.planar;
          u = (v.x - b.x0) / (b.x1 - b.x0);
          vv = (v.y - b.y0) / (b.y1 - b.y0);
        }
        const m = part.uv(Math.min(1, Math.max(0, u)), Math.min(1, Math.max(0, vv)));
        uv.set(m, o * 2);
        const r = part.w(v),
          c = r[3] ?? r[0],
          wc = r[4] ?? 0;
        si.set([r[0], r[1], c, 0], o * 4);
        sw.set([1 - r[2] - wc, r[2], wc, 0], o * 4);
        this.warp?.(v, nv);
        pos.set([v.x, v.y, v.z], o * 3);
        nor.set([nv.x, nv.y, nv.z], o * 3);
      }
    });
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    geo.setAttribute("normal", new THREE.BufferAttribute(nor, 3));
    geo.setAttribute("uv", new THREE.BufferAttribute(uv, 2));
    geo.setAttribute("skinIndex", new THREE.Uint16BufferAttribute(si, 4));
    geo.setAttribute("skinWeight", new THREE.BufferAttribute(sw, 4));
    geo.setIndex(new THREE.BufferAttribute(idx, 1));
    for (const g of geos) g.dispose();
    this.parts = [];

    const mesh = new THREE.SkinnedMesh(geo, material);
    mesh.add(this.rig.root);
    this.rig.pose();
    mesh.updateMatrixWorld(true);
    mesh.bind(new THREE.Skeleton(this.rig.bones));
    mesh.castShadow = mesh.receiveShadow = true;
    return { mesh, triangles: tris, partTris };
  }
}

function indexed(g: THREE.BufferGeometry) {
  const n = g.attributes.position.count;
  g.setIndex([...Array(n).keys()]);
  return g;
}
