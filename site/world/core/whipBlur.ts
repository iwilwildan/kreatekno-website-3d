// Motion blur for the whip pan only (tahap 4): while the camera turns fast, the scene is drawn into a render
// target and then onto the screen through one pass that smears it along the pan (a camera-only blur, no velocity
// buffer) and does the tone mapping and sRGB output the renderer would otherwise do. The rest of the take renders
// straight to the screen as before. Off in saver mode.
import * as THREE from "three";

const SAMPLES = 12;

export function createWhipBlur(renderer: THREE.WebGLRenderer) {
  let rt: THREE.WebGLRenderTarget | null = null;
  const material = new THREE.ShaderMaterial({
    uniforms: { tDiffuse: { value: null }, dir: { value: new THREE.Vector2() } },
    vertexShader: /* glsl */ `
      varying vec2 vUv;
      void main() { vUv = uv; gl_Position = vec4(position.xy, 0.0, 1.0); }`,
    fragmentShader: /* glsl */ `
      uniform sampler2D tDiffuse;
      uniform vec2 dir;
      varying vec2 vUv;
      void main() {
        vec4 c = vec4(0.0);
        for (int i = 0; i < ${SAMPLES}; i++) c += texture2D(tDiffuse, vUv + dir * (float(i) / ${SAMPLES - 1}.0 - 0.5));
        gl_FragColor = c / ${SAMPLES}.0;
        #include <tonemapping_fragment>
        #include <colorspace_fragment>
      }`,
    depthTest: false,
    depthWrite: false,
  });
  const quad = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), material);
  quad.frustumCulled = false;
  const quadScene = new THREE.Scene().add(quad);
  const quadCam = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
  const size = new THREE.Vector2();

  /** Renders the scene smeared by `amount` (fraction of the screen width, signed: + = image moving right). */
  const render = (scene: THREE.Scene, camera: THREE.Camera, amount: number) => {
    renderer.getDrawingBufferSize(size);
    if (!rt || rt.width !== size.x || rt.height !== size.y) {
      rt?.dispose();
      // no MSAA: the blur hides the edges anyway, and the target stays small on phones
      rt = new THREE.WebGLRenderTarget(size.x, size.y, { type: THREE.HalfFloatType, depthBuffer: true });
    }
    renderer.setRenderTarget(rt);
    renderer.render(scene, camera);
    renderer.setRenderTarget(null);
    material.uniforms.tDiffuse.value = rt.texture;
    material.uniforms.dir.value.set(amount, 0);
    renderer.render(quadScene, quadCam);
  };
  const dispose = () => {
    rt?.dispose();
    rt = null;
    material.dispose();
    quad.geometry.dispose();
  };
  return { render, dispose };
}
