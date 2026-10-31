// src/page.html -> ../kreatekno-solusi.html (as is)
// src/tonton/main.js + three -> ../kreatekno-solusi-3d.js (one minified module, loaded by the page only when Tonton opens)
import { build } from 'esbuild';
import { copyFileSync, readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { gzipSync } from 'node:zlib';

const at = p => fileURLToPath(new URL(p, import.meta.url));
await build({
  entryPoints: [at('src/tonton/main.js')], outfile: at('../kreatekno-solusi-3d.js'),
  bundle: true, minify: true, format: 'esm', target: 'es2020', legalComments: 'none', logLevel: 'warning',
});
copyFileSync(at('src/page.html'), at('../kreatekno-solusi.html'));
const js = readFileSync(at('../kreatekno-solusi-3d.js'));
console.log('3d bundle', Math.round(js.length / 1024), 'KB, gzip', Math.round(gzipSync(js, { level: 9 }).length / 1024), 'KB');
