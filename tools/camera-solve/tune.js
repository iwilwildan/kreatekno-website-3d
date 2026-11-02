// Render one keyframe under several lighting variants (JSON list) for comparison.
const { chromium } = require('playwright');
const path = require('path');
const [,, page_, outDir, fmt, key, variantsJson] = process.argv;
const variants = JSON.parse(require('fs').readFileSync(variantsJson, 'utf8'));
(async () => {
  const b = await chromium.launch({ args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'] });
  const vp = fmt === 'pc' ? { width: 1280, height: 720 } : { width: 450, height: 800 };
  const p = await b.newPage({ viewport: vp });
  p.on('pageerror', e => console.log('pageerror', e.message));
  await p.goto('file://' + path.resolve(page_) + `?shot&fmt=${fmt}&k=${key}`);
  await p.waitForFunction(() => window.__k02 && window.__k02.aoState().done, null, { timeout: 240000, polling: 500 });
  for (const [i, v] of variants.entries()) {
    await p.evaluate(v => {
      const k = window.__k02, { sun, hemi } = k.lights, T = k.renderer.constructor;
      if (v.sun) { sun.position.set(...v.sun.pos); sun.color.set(v.sun.color); sun.intensity = v.sun.i; }
      if (v.sunc) { sun.color.set(v.sunc); sun.intensity = v.suni; }
      if (v.hemi) { k.lights.HEMI_OUT.sky.set(v.hemi.sky); k.lights.HEMI_OUT.ground.set(v.hemi.ground); k.lights.HEMI_OUT.i = v.hemi.i; }
      if (v.hemi) { hemi.color.set(v.hemi.sky); hemi.groundColor.set(v.hemi.ground); hemi.intensity = v.hemi.i; }
      if (v.env != null) k.scene.environmentIntensity = v.env;
      if (v.exp != null) k.renderer.toneMappingExposure = v.exp;
      if (v.tone) k.renderer.toneMapping = { neutral: 7, agx: 6, aces: 4 }[v.tone];
      k.renderer.shadowMap.needsUpdate = true;
      k.scene.traverse(o => { if (o.material) [].concat(o.material).forEach(m => m.needsUpdate = true); });
      k.setP(k.keyP[new URLSearchParams(location.search).get('k')] + 1e-4);
    }, v);
    await p.waitForTimeout(500);
    await p.screenshot({ path: `${outDir}/tune_${fmt}_${key}_${i}.png` });
    console.log('variant', i, 'done');
  }
  await b.close();
})();
