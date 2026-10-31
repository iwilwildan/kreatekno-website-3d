#!/bin/sh
# src/scene.js + three + three-mesh-bvh -> one minified module inlined into ../k0-k2-3d.html
set -e
cd "$(dirname "$0")"
npx esbuild src/scene.js --bundle --minify --format=esm --target=es2020 --legal-comments=none --outfile=bundle.js --log-level=warning
python3 - <<'PY'
import gzip
page = open('src/page.html').read(); js = open('bundle.js').read().replace('</script', '<\\/script')
open('../k0-k2-3d.html', 'w').write(page.replace('/*BUNDLE*/', js))
print('bundle', len(js) // 1024, 'KB, gzip', len(gzip.compress(js.encode(), 9)) // 1024, 'KB')
PY
rm -f bundle.js
