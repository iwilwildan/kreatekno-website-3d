const { chromium } = require('playwright'); const path = require('path');
const [,, page_, out, fmt, ...ps] = process.argv;
(async () => {
  const b = await chromium.launch({ args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'] });
  const p = await b.newPage({ viewport: fmt === 'pc' ? { width: 1280, height: 720 } : { width: 450, height: 800 } });
  p.on('pageerror', e => console.log('pageerror', e.message));
  await p.goto('file://' + path.resolve(page_) + `?shot&fmt=${fmt}&k=K0`);
  await p.waitForFunction(() => window.__k02 && window.__k02.aoState().done, null, { timeout: 240000, polling: 500 });
  for (const v of ps) { await p.evaluate(v => window.__k02.setP(Number(v)), v); await p.waitForTimeout(300); await p.screenshot({ path: `${out}/mid_${fmt}_${v}.png` }); }
  await b.close();
})();
