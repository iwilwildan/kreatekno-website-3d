# Kreatekno Solusi: rencana

_Disusun 31 Okt 2026. Menggantikan `PORTFOLIO.md`. Halaman Solusi mengganti halaman Portofolio. Status: tahap 1 (fondasi) selesai, menunggu review._

## 1. Ide

Satu halaman Solusi, dua mode:

- **Baca**: artefak Solusi (sumber asli https://claude.ai/artifact/EeT5SJVBzWwjUt6KukE58t, dibuat di akun lain) dipakai apa adanya. Isinya katalog 12 solusi dengan cari dan filter (`#solusi`), halaman detail per solusi (`#s-<slug>`) dan pencari kartu masalah (`#cari`).
- **Tonton**: take 3D Three.js per solusi, di dunia yang sama dengan Home (deret ruko pastel, props gaya clay, cahaya dan AO seperti `prototype/k0-k2`), **tanpa karakter manusia**. Digerakkan scroll, dengan klik untuk lompat langkah dan melihat benda dari dekat.

Naskah take diturunkan dari data solusi yang sudah ada di mode Baca (`pains`, `steps`, `metrics`), jadi teksnya hanya ditulis sekali.

## 2. Keputusan (31 Okt 2026)

| Topik | Keputusan |
|---|---|
| Pilot | `order-grup` (distributor air minum). Tonton hanya untuk solusi **Sudah berjalan** (4 dari 12); solusi Siap dibangun tidak punya Tonton |
| Lokasi | Ruko milik klien sendiri di deret ruko yang sama dengan Home, gaya Master 3–6 (fasad generik). Bidang yang tidak ada di denah Master 8 mendapat ruko baru di luar bingkai denah, jadi denah Home tidak berubah |
| Tanpa karakter | Tidak ada manusia. **ORB** (`Assets/KARKATER/ORB.png`) boleh tampil sebagai wujud asisten AI. Aksi manusia ditunjukkan lewat benda: HP menyala, kursi kosong, kertas atau kartu berpindah |
| Klik | Rail langkah untuk lompat, dan hotspot di benda (HP, monitor, rak) yang mendekatkan kamera dan membuka kartu detail. Tidak ada putar otomatis |
| Pintu masuk | Tombol "Tonton cara kerjanya" di halaman detail membuka overlay layar penuh (`#tonton-<slug>`). Tombol back dan Esc menutupnya. Katalog versi 3D (menyusuri deret ruko lalu klik toko) baru setelah pilot |
| Copy di 3D | Ikut aturan Home: di desktop jadi props fisik (kertas lebar di stand akrilik, binder, map ungu dari `Assets/Properti`), di HP jadi kartu di pita bawah. Teksnya judul dan deskripsi `steps` dari data Baca |
| Nama platform | Mode Baca boleh menyebut WhatsApp dan Google Sheets, seperti di artefak. Layar di dalam 3D netral: chat warna Kreatekno (bukan hijau WhatsApp), tabel generik, tanpa logo |
| Cara kerja | Sama dengan k0-k2: riset di awal tiap tahap, berhenti untuk review di akhir tiap tahap, screenshot dikirim di chat |

## 3. Bentuk take (per solusi, sekitar 7–8 layar scroll)

1. **Datang**: kamera di trotoar depan ruko klien, lalu masuk lewat pintu.
2. **Masalah**: ruangan terlihat kacau (dari `pains`): HP bergetar, kertas menumpuk, notifikasi berderet.
3. **Langkah 1–4**: kamera pindah dari satu meja ke meja lain. Kerja asisten diperlihatkan lewat benda, misalnya kartu order terbang dari layar HP ke baris tabel lalu status berubah warna. ORB berpindah bersama kamera.
4. **Hasil**: angka `metrics` di props. Khusus `order-grup`, cahaya bergeser ke senja lalu malam saat langkah "rekap setiap malam" (versi malam dari master).
5. **Penutup**: kartu HTML dengan Konsultasi gratis (pesan sudah menyebut solusinya) dan Baca detail.

Scroll menggerakkan kamera dan animasi benda dan bisa diputar mundur. Gerakan dihitung dari posisi scroll, bukan dari waktu, sama seperti k0-k2.

## 4. Teknis

- **Stack** sama dengan k0-k2: three 0.186.1, three-mesh-bvh 0.9.16 (bake AO, mulai tahap 2), esbuild 0.28.2. Semua dari kode, tanpa model 3D.
- **Struktur**:
  ```
  prototype/solusi/
    src/page.html            mode Baca (dari artefak) + overlay Tonton
    src/tonton/main.js       entry: mount(), lompat langkah, hotspot, loop render, dispose
    src/tonton/kit.js        renderer, mat, Batch, canvasTex (disalin dari k0-k2/src/scene.js)
    src/tonton/takes/*.js    satu file per solusi: set, titik kamera, hotspot
    build.mjs                node build.mjs -> ../kreatekno-solusi.html + ../kreatekno-solusi-3d.js
  ```
- **Kode bersama** dengan k0-k2 disalin, tidak diekstrak dari file k0-k2, karena k0-k2 sedang di tahap 3. Disatukan setelah keduanya stabil.
- **Lazy load**: bundle 3D baru dimuat (`import()`) saat Tonton dibuka, jadi mode Baca tetap ringan dan bisa diindeks.
- **Satu canvas WebGL** per halaman. Saat overlay ditutup, geometri, material dan konteks WebGL dilepas.
- **Render hanya saat ada perubahan** (scroll, animasi hotspot, resize). Resolusi turun otomatis kalau FPS rendah; ada mode hemat.
- **HP**: FOV dan posisi kamera menyesuaikan rasio layar supaya lebar adegan tetap muat. Di tahap 4 layout interior di-blend menurut aspect seperti k0-k2.
- **Aksesibilitas**: overlay memakai `<dialog>` (fokus terkunci, Esc). Hotspot adalah tombol HTML yang ditempel ke posisi 3D, jadi bisa dipilih dengan Tab. Kartu langkah memakai `aria-live`.
- **Fallback**: tanpa WebGL, atau saat file dibuka langsung dari disk, overlay menampilkan langkah-langkah sebagai teks. Reduced motion: lompat langkah tanpa animasi kamera.
- **Anggaran**: di bawah 80 draw call dan 100 ribu segitiga per take.
- **Preview lokal**: `preview_start` dengan konfigurasi `prototype` (port 8765), lalu buka `/kreatekno-solusi.html#tonton-order-grup`. Build: `cd prototype/solusi && npm ci && node build.mjs`.
- **Artefak preview (privat)**: https://claude.ai/artifact/6zrMsws7ats1DjsHfa2FAS, berisi `kreatekno-solusi.html` dan bundle 3D. Untuk update, publish ulang dari file yang sama supaya link tetap.
- **URL dev**: `?hud` (fps, draw call, segitiga, pixel ratio), `?fmt=pc|hp` (paksa kamera 16:9 atau 9:16), `?hemat`, `?shot`. Di window: `__tonton.setP(p)`, `__tonton.keyP(i)`, `__tonton.jump(i)`.

## 5. Tahapan

| # | Isi | Status |
|---|---|---|
| 1 | Fondasi: mode Baca masuk repo, tombol Tonton dan overlay layar penuh, rail, kartu langkah, hotspot, lazy load three, set greybox `order-grup` dengan titik kamera per langkah, build | ✅ selesai, menunggu review |
| 2 | Lokasi dan props `order-grup`: fasad ruko depot air, interior, galon, meja, HP, monitor, ORB; AO dan cahaya seperti k0-k2; gambar diam per langkah | ⬜ |
| 3 | Take: animasi benda per langkah, copy sebagai props, cahaya siang ke malam, hotspot mendekatkan kamera, kartu penutup | ⬜ |
| 4 | Versi HP, mode hemat, fallback, aksesibilitas; tes FPS di HP Android user | ⬜ |
| 5 | Tiga solusi Sudah berjalan lainnya dari template yang sama | ⬜ |
| 6 | Publish artefak, `PLAN.md`, commit | ⬜ |

## 6. Catatan

- Link Tonton lama di artefak (`NdWfRQpV3D8d6QNdzanTBT`) tidak bisa dibuka dari akun ini; diganti overlay Tonton.
- Tombol bahasa English di artefak belum punya logika (hanya tampilan).
