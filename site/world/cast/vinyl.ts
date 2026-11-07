// The cast material: MeshStandardMaterial with the character atlas (colour and roughness maps) and wrap
// lighting on the direct diffuse term, so light rolls softly past the terminator like on painted vinyl.
// Without wrap (saver mode) it is a plain standard material.
import * as THREE from "three";

const DIFFUSE =
  "reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseContribution ) * ( 1.0 - F );";

export function vinylMaterial(
  map: THREE.Texture,
  roughnessMap: THREE.Texture,
  { wrap = 0.35 }: { wrap?: number } = {},
) {
  // the roughness canvas is grey, so its green channel (what three reads) is the roughness
  return withWrap(new THREE.MeshStandardMaterial({ map, roughnessMap, roughness: 1, metalness: 0 }), wrap);
}

/** Adds the wrap lighting to a standard material (none when wrap is 0). */
export function withWrap(m: THREE.MeshStandardMaterial, wrap: number) {
  m.onBeforeCompile = (s) => {
    if (wrap > 0) {
      const chunk = THREE.ShaderChunk.lights_physical_pars_fragment;
      if (chunk.includes(DIFFUSE))
        s.fragmentShader = s.fragmentShader.replace(
          "#include <lights_physical_pars_fragment>",
          chunk.replace(
            DIFFUSE,
            `reflectedLight.directDiffuse += saturate( ( dot( geometryNormal, directLight.direction ) + ${wrap.toFixed(3)} ) / ${(1 + wrap).toFixed(3)} ) * directLight.color * BRDF_Lambert( material.diffuseContribution ) * ( 1.0 - F );`,
          ),
        );
    }
  };
  m.customProgramCacheKey = () => `vinyl${wrap}${m.vertexColors ? "c" : ""}`;
  return m;
}
