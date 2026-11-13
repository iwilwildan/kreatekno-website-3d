# Review S5: etalase, Cari, dan Kartu 3D

Tanggal: 8 November 2026. Status: **disetujui user melalui instruksi “lanjutkan”; S6 dimulai**.

## Hasil

- `world/solusi/rak.ts` menggambar etalase dengan kamera ortografis 1 unit = 1 CSS px, scissor per track, instancing per warna tim, panel sampul, dekor 2×2, papan rak, bayangan kontak, kemiringan 0,2 rad, dan lift hover 6 px.
- `world/solusi/kotak.ts` menyajikan 1–6 kotak dari kasir dengan jeda berurutan, dua baris untuk 4–6 hasil, menariknya kembali, dan menghitung ulang layout 250 ms setelah resize.
- Posisi tag nomor diproyeksikan dari objek 3D setiap frame. Enam hasil per tampilan memakai pagination sebelumnya/berikutnya; halaman kedua menampilkan nomor 7–12.
- Ringkasan dapat dibuka melalui hover kotak pada pointer halus, tap/klik kotak, klik/fokus tag nomor, ditutup setelah pointer keluar 240 ms atau dengan Esc. Isinya judul, aplikasi, ringkasan, dan tautan detail.
- Daftar HTML hasil tetap menjadi fallback ketika WebGL belum siap/gagal. Saat world siap, tag HTML yang bisa difokus dan ringkasan bertaut menjadi representasi aksesibel tanpa menutupi objek 3D.
- `world/solusi/kartu3d.ts` menerbangkan kartu dari kasir sebelum deck HTML tampil. Jawaban Ya memicu pose `nod`; ronde baru memicu `offer`. Reduced motion melewati kartu terbang dan menampilkan deck langsung.
- Struk desktop dipindahkan ke kiri, struk HP menjadi lembar bawah, dan setelah submit digantikan bar hasil agar meja serta kotak tidak tertutup. Pagination fixed berada di atas bar; ringkasan HP tetap di dalam viewport.

## Bukti otomatis

`tools/solusi/s5-final.mjs`: **122/122 pemeriksaan lulus**.

- 66 keadaan posisi tag: 1–6 hasil pada 11 viewport canonical (1920, 1440, 1280, 1180, 1024, 820, 768, 414, 390, 375, dan 360 px).
- Selisih maksimum terhadap acuan v1: **0,060 px horizontal** dan **0,050 px vertikal**, di bawah toleransi 2 px.
- Etalase terlihat: 8 draw call dan 9.012 segitiga.
- Sajian enam kotak: 32 draw call dan 17.434 segitiga; run GPU mencatat ±62,6 fps.
- Hover, klik/fokus tag, ringkasan/tautan, Esc, jeda tutup, pagination 7–12, recall, resize 250 ms, kartu 3D, nod, reduced motion, overflow horizontal, dan console bersih semuanya lulus.
- Build produksi, TypeScript, ESLint, dan Prettier lulus; build menghasilkan 54 halaman.

Laporan, screenshot, frame demo, dan video `s5-search-cards.webm` berada di scratchpad lokal `solusi-s5`, bukan di `public/` atau Git.

## Batas tahap

- Pengujian HP Android fisik tetap membutuhkan perangkat user; bukti sekarang memakai viewport browser desktop.
- S6 detail solusi dan cerita inline Order Grup belum dimulai.
- Tidak ada commit, push, deploy, atau publish.
