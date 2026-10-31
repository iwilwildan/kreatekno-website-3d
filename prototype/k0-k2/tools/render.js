// Render keyframes of the built page with CDN requests served from local node_modules.
const { chromium } = require('playwright');
const path = require('path');
const [,, page_, outDir, which = 'pc,hp', keys = 'K0,K1,K2', extra = ''] = process.argv;
const NM = path.join(__dirname, '..', 'node_modules') + '/';
(async () => {
  const b = await chromium.launch({ args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'] });
  for (const fmt of which.split(',')) {
    const vp = fmt === 'pc' ? { width: 1280, height: 720 } : fmt === 'hp' ? { width: 450, height: 800 } : { width: 375, height: 812 };
    for (const k of keys.split(',')) {
      const p = await b.newPage({ viewport: vp });
      const errs = [];
      p.on('pageerror', e => errs.push('pageerror ' + e.message)); p.on('console', m => { if (m.type() === 'error' || m.type() === 'warning') errs.push(m.type() + ' ' + m.text()); });
      await p.route('https://cdn.jsdelivr.net/npm/**', r => {
        const u = new URL(r.request().url()).pathname.replace('/npm/', '');
        const m = u.match(/^((?:@[^/]+\/)?[^@/]+)@[^/]+\/(.*)$/);
        r.fulfill({ path: NM + m[1] + '/' + m[2], contentType: 'application/javascript' });
      });
      const f = fmt === 'dev' ? 'hp' : fmt;
      const t0 = Date.now();
      await p.goto('file://' + path.resolve(page_) + `?shot&fmt=${f}&k=${k}${extra}`);
      await p.waitForFunction(() => window.__k02, null, { timeout: 60000 });
      const tReady = Date.now() - t0;
      await p.waitForFunction(() => window.__k02.aoState().done, null, { timeout: 240000, polling: 500 });
      const tAO = Date.now() - t0;
      await p.evaluate(() => window.__k02.setP(window.__k02.keyP[new URLSearchParams(location.search).get('k')]));
      await p.waitForTimeout(400);
      const info = await p.evaluate(() => { const r = window.__k02.renderer.info.render; return { calls: r.calls, tris: r.triangles }; });
      await p.screenshot({ path: `${outDir}/${fmt}_${k}.png` });
      console.log(fmt, k, 'ready', tReady, 'ms; AO done', tAO, 'ms;', JSON.stringify(info), errs.length ? errs.slice(0, 6) : 'no errors');
      await p.close();
    }
  }
  await b.close();
})();
