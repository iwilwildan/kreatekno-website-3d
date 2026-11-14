# Review S4: greybox toko

Tanggal: 7 November 2026. Status: checkpoint greybox disetujui user 8 November 2026; detail/material dan interaksi dilanjutkan di S4 final.

## Lingkup checkpoint

- `site/world/sets/toko.ts`: dinding, lis, meja, depan konter, dan bibir meja sebagai massa greybox.
- `site/world/solusi/kamera.ts`: kamera hero desktop/HP, kamera fokus, rumus tinggi hero, dan pin bibir meja 8 px.
- `site/world/solusi/index.ts`: satu canvas fixed dengan scissor, render hero/fokus, resize/scroll/visibility, crossfade, debug contract, dan dispose.
- Heru kasir memakai hasil S3 pada skala root `1,77`, posisi `(1,95, −0,47, −2,85)`, pose idle, 11.750 segitiga.
- Halaman HTML S2 tetap menjadi fallback dan lapisan semantik. Detail material, rak final, mesin kasir final, lampu ayun, pose per mode, follow-cursor, hit reaction, dan animasi belum termasuk checkpoint ini.

## Bukti otomatis

`node tools/solusi/s4-greybox.mjs <scratchpad>` lulus **88 pemeriksaan pada 11 viewport**:

- desktop/tablet: 1920×1080, 1440×900, 1280×800, 1180×820, 1024×1366, 820×1180, 768×1024;
- HP: 414×896, 390×844, 375×812, 360×740;
- tinggi stage dan preset kamera sesuai tabel v1;
- posisi kamera X/Y/Z dan FOV dalam toleransi ±0,002;
- bibir meja tepat 8 px di atas tepi bawah stage;
- karakter 11.750 segitiga dan skala 1,77;
- tidak ada page error atau console error.

Laporan mesin: `solusi-s4-greybox/report.json` di scratchpad visualisasi lokal. Screenshot yang diperiksa: hero 1920, 1440, 820, 375 serta fokus 1440 dan 375. Artefak review tidak dimasukkan ke `public/` atau Git.

## Validasi build

- `next build`: lulus, 54 halaman.
- TypeScript: lulus sebagai bagian build.
- Next dibatasi menjadi dua worker lewat `experimental.cpus` karena 15 worker menghabiskan commit memory mesin Windows pada tahap pengumpulan data halaman. Ini hanya membatasi paralelisme build.

## Keputusan review yang diminta

1. Skala dan posisi Heru: `k = 1,77`, pinggul tersembunyi di balik meja.
2. Komposisi kamera hero desktop/tablet/HP dan kamera fokus.
3. Hubungan bibir meja 3D dengan band etalase HTML.

Sesudah disetujui, S4 dilanjutkan ke material/cahaya, properti toko, pose per mode, interaksi kasir, reduced motion, dan pemeriksaan performa. Tidak ada commit, push, atau publish pada checkpoint ini.
