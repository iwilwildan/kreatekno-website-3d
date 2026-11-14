# Review S4: toko 3D final

Tanggal: 8 November 2026. Status: disetujui user melalui instruksi “lanjutkan”; S5 diteruskan setelah review ini.

## Hasil

- Set final mengikuti warna/material dan koordinat VISUAL 7.1–7.2: dinding, wainscot, rail, meja, mesin kasir, dua papan rak dengan delapan kotak stok, dan lampu gantung.
- Satu canvas fixed/scissor dengan DPR maksimum 2 desktop dan 1,5 HP, crossfade dari fallback HTML, render berhenti saat tersembunyi, resize/scroll/visibility lifecycle, serta dispose seluruh listener/resource.
- Kamera hero mempertahankan tabel v1 dan bibir meja 8 px. Kamera fokus memakai preset desktop/HP dengan lerp eksponensial; reduced motion langsung ke target.
- Heru skala 1,77 pada posisi toko yang disetujui. Pose `idle`, `ready`, `lift`, `offer`, `wave`, `shrug`, dan `nod` terhubung ke state UI.
- Ambient: napas, kedip, menoleh, rambut springbone, dan lampu ayun. Desktop pointer-fine menambahkan follow-cursor dan cursor hitbox; klik/tap Heru memicu wobble, mata terpejam, dan ekspresi mulut terbuka tanpa raycast ke SkinnedMesh.
- Mesin kasir bersembunyi di belakang struk sebelum submit dan keluar layar saat hasil disajikan/di HP. “Cari kembali” mengembalikannya.
- Reduced motion menonaktifkan ambient/action tween, tetapi state pose akhir, HTML, dan seluruh alur Cari/Kartu tetap bekerja.

## Perbaikan dari review

- Copy hero menjadi putih/cyan saat WebGL aktif agar kontras pada dinding navy; fallback tetap memakai warna aslinya.
- Akses langsung `/solusi#cari` pada HP memakai tinggi hero fallback sebelum stage tersembunyi, sehingga kamera fokus tidak menerima nilai `NaN`.
- Transform ambient/hit dipulihkan setelah setiap render agar wobble tidak terakumulasi dan menjatuhkan tubuh.
- Masuk/keluar Cari atau Kartu mengembalikan scroll ke atas.
- Screenshot otomatis menunggu crossfade 300 ms sehingga tidak merekam dua set bertumpuk.

## Bukti otomatis

### Kamera dan layout

`tools/solusi/s4-greybox.mjs`: **88/88 cek lulus pada 11 viewport** (1920, 1440, 1280, 1180, 1024, 820, 768, 414, 390, 375, dan 360 px).

- tinggi stage, posisi kamera X/Y/Z, dan FOV sesuai tabel;
- bibir meja tepat 8 px;
- 11.750 segitiga karakter;
- console bersih.

### Interaksi dan performa

`tools/solusi/s4-final.mjs`: **26/26 cek lulus**.

- idle, wave, ready, lift, shrug, offer/nod, hit reaction, follow-cursor;
- mesin kasir desktop/HP, direct-link HP, tidak ada overflow horizontal;
- reduced motion: lampu diam, wave dilewati, ready langsung;
- Edge GPU otomatis: ±26,4 fps pada target ambient 30 fps;
- profil CPU 4×: ±25,4 fps;
- 26 draw call dan 12.510 segitiga total per frame, jauh di bawah batas 60/80 ribu;
- tidak ada page error atau console error.

Laporan dan screenshot berada di scratchpad lokal `solusi-s4-final`, bukan di `public/` atau Git.

## Validasi source

- `next build`: lulus, 54 halaman.
- TypeScript: lulus.
- ESLint: lulus tanpa warning.
- Prettier: seluruh site lulus.
- `localhost:3000/solusi`: build produksi terbaru.

## Batas saat review S4

- Saat review ini dibuat, S5 belum dimulai. Implementasi berikutnya dicatat terpisah di `REVIEW-S5.md`.
- Pengujian HP Android fisik tetap membutuhkan perangkat user; bukti sekarang memakai viewport browser desktop.
- Tidak ada commit, push, deploy, atau publish.
