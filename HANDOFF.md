# Serah-terima antar sesi

_Tahap 4 (gerak beat 1–2) dibangun 1 Nov dan menunggu review: lihat log `PLAN.md` "tahap 4, implementasi" (modul baru `world/motion/`, `cast/walk.ts`, `cast/acts.ts`, `takes/home/heru.ts`, `core/whipBlur.ts`; build produksi baru di `site-prod-3300`)._

_Ditulis 1 Nov 2026 di awal tahap 3, dari sesi tahap 1–2. Tahap 3 selesai dan disetujui 1 Nov; rinciannya (pembangun tokoh `site/world/cast/`, kamera K2 baru, anggaran, hal yang masih terbuka) ada di log `PLAN.md`. Baca juga `PLAN.md` sampai habis dan `prototype/k0-k2/HANDOFF.md` (ciri tokoh, pose K2, ID Drive yang disetujui)._

## Status repo

- Tahap 0, 1 dan 2 selesai (tahap 2 disetujui user 1 Nov). Semua pekerjaan sampai revisi beat 1 sudah di-commit dan di-push ke `iwilwildan/kreatekno-website-3d` (2 Nov).
- Commit dan push hanya kalau user minta. `refs/` tidak pernah masuk git.

## Situs (`site/`)

- Next.js 16.4.3 statis, next-intl (ID di `/`, EN di `/en`, `/solusi` ↔ `/en/solutions`), Tailwind 4. `ensureStatic = "navigation"` dipasang di layout `(pages)` dan di Home.
- Home memakai `components/home/`:
  - `HomeStage` (server): copy dan still `<picture>`, ditambah skrip inline `placeHero` yang menaruh copy di billboard still K0 sebelum hidrasi;
  - `HomeTake` (client): panggung sticky, scroll, `import('@/world')` saat idle, crossfade, fallback still tanpa WebGL, HUD;
  - `stage.css`: versi tumpuk untuk reduced motion dan tanpa JS.
- `site/README.md` menjelaskan semuanya.

## Engine (`site/world/`, TypeScript, three 0.186.1)

- `core/`:
  - `kit` (Batch per material, material cache, `disposeTree` dengan `kit.shared`);
  - `ao` dan `bake` (three-mesh-bvh, chunk terpisah);
  - `light`, `anchors` (homografi `matrix3d`), `segments` (tanpa three), `take`.
- `sets/`: `street`, `companyFront` (interior di-blend pc/hp dalam 5 langkah layout, masing-masing dengan AO), `sky`. Burung K0 punya sayap terpisah, mengepak 3,2 Hz, terbang ke kanan lalu wrap dari kiri; titik wrap dihitung dari kamera K0 lewat `setFlight`; animasinya mati di `?shot`.
- `cast/standIn.ts`: figur abu-abu pengganti, **yang diganti di tahap 3**.
- `takes/home/`: `data.json` hasil solver, `timing.ts`, `index.ts` (`cameraAt`, `heruAt`). Opsi (c) skala Heru 1,8 m ada di `heruAt`.
- API: `mount(host, opts)`. Loop render hanya saat ada perubahan, ditambah loop ambient 30 fps selama burung terlihat.

## Aset hasil bake

- `site/public/world/ao/*.png` dibuat dengan `cd tools && npm run bake-ao`.
- `site/public/stills/{pc,hp}/k0..k2.webp` dan `site/components/home/stills.json` dibuat dengan `npm run stills`.
- Jalankan ulang keduanya kalau set atau kamera berubah. Karakter yang menghasilkan bayangan atau AO kemungkinan perlu bake ulang, begitu pula still.

## Alat (`tools/`)

- Playwright 1.64.1 memakai Edge lokal dengan SwiftShader. Isi `render/`: `bake-ao.mjs`, `stills.mjs`, `shots.mjs compare|page OUT`, `diff.py`, `perf.mjs` (profil HP lambat). Lihat `tools/README.md`.
- `camera-solve/` adalah salinan solver dari `prototype/k0-k2/tools/`. **OpenCV dan SciPy belum terpasang** di laptop (PIL dan numpy ada); keduanya diperlukan untuk menghitung ulang kamera K2.
- Shot review disimpan di scratchpad, tidak pernah di repo.

## Preview

- `preview_start`:
  - `site`: dev, port 3000;
  - `site-prod`: build produksi, port 3100, `--hostname 0.0.0.0`.
- HP user membuka `http://192.168.1.10:3100/?hud` lewat Wi-Fi.
- URL dev: `?hud`, `?k=K0|K1|K2`, `?fmt=pc|hp`, `?hemat`, `?noao`, `?shot`, `?bake=n`. Dengan salah satunya aktif, `window.__world` tersedia.

## Angka terakhir (akhir tahap 2)

- Render situs vs prototype: K0 dan K1 sama, kecuali sayap burung (0,2%). Di K2 selisih 1–2% karena prototype punya bug kepala figur di lantai (`g.add(...).position.set`); di situs sudah benar.
- Draw call maksimal 107 (batas 120), segitiga maksimal 118 ribu (batas 150 ribu, tiap karakter ±5–15 ribu). JS halaman 333 KB gzip. LCP profil HP lambat 0,8–1,9 s.
- POCO X6: diam di K0 30 fps, 85 draw call, dpr 1,5. Belum ada tes di HP murah. FPS saat scroll dan kondisi panas belum dilaporkan.

## Referensi untuk tahap 3

- `refs/KARKATER/` berisi `heru.png`, `wildan.png`, `andi.png`, `BUK DEWI.png`, `SINTA.png`, `BAYU.png`, `NADIA.png`, `FAJAR.png`, `ORB.png`, `CUST 1 WOMEN.png`, `CUST 2 MAN.png`, `ALL KARAKTER.png`, plus `ARYA.png`, `DIMAS.png`, `RAKA.png` yang identitasnya belum diketahui.
- Ciri tiap tokoh dan pose di K2 ada di `prototype/k0-k2/HANDOFF.md`.
- **`refs/keyframes/pc` dan `refs/keyframes/hp` masih kosong.** Keyframe K0–K2.2 diperlukan. Bisa diunduh dari ID Drive yang sudah disetujui di `prototype/k0-k2/HANDOFF.md` (maksimal 3 file per giliran), atau diminta ke user.
- Footage tim ada di `refs/footage/{desktop,mobile}/`. Gambar keyframe dan master tim hanya boleh dikirim di chat.

## Pertanyaan terbuka di awal tahap 3

- Tinggi Bu Dewi (di K2 terhitung ±2,2 m, padahal skala Heru 1,8 m) dan seberapa jauh kamera K2 dinaikkan (opsi c).
- Siapa ARYA, DIMAS dan RAKA.
- Apakah merpati ikut dibangun ulang sebagai karakter. Di `sky.ts` sekarang sudah ada versi sederhana yang terbang.

Ketiganya dijawab user 1 Nov (Bu Dewi 1,60 m + lantai kasir ±25 cm, ARYA/DIMAS/RAKA desain lama, merpati cukup dirapikan). Keputusan lengkap dan plan tahap 3 ada di `PLAN.md` bagian 5.
