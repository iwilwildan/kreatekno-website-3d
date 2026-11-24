# Artikel 3D: meja perpustakaan dengan Andi (Pustaka)

_Disusun 24 Nov 2026 dari permintaan user dan jawaban interview hari yang sama. Status: plan disetujui 24 Nov ("Setuju, mulai P0"); **P0 selesai, menunggu review** (hasil di bagian 6)._

Permintaan user: halaman depan `/artikel` dijadikan 3D seperti halaman depan Solusi. Solusi adalah meja kasir dengan Heru sebagai kasir; Artikel menjadi meja penjaga perpustakaan dengan Andi sebagai pustakawan, dan etalasenya berisi buku-buku artikel.

## 1. Keputusan (jawaban user 24 Nov)

| Topik | Keputusan |
| --- | --- |
| Lingkup | Hanya halaman depan `/artikel` dan `/en/articles`. Detail `/artikel/[slug]` tetap layout editorial tahap 14C, tanpa 3D |
| Andi | Baju pustakawan: kardigan ungu di atas kaus putih, papan nama polos, kacamata baca. Rambut berujung oranye dan headphone di leher tetap seperti turnaround. Badan, wajah dan rambut sama persis dengan `cast/andi.ts` (pola `heruKasir.ts`) |
| Rak | Buku tegak dengan **sampul menghadap depan** (ilustrasi `RackArt` dan warna sampul rak Home K7), judul, ringkasan, kategori dan waktu baca terbaca. Satu rak pajangan sekarang; rak per kategori menyusul kalau satu kategori punya ≥ 2 artikel |
| Interaksi | Satu mode **Tanya pustakawan** (`#tanya`), pengganti Cari dan Kartu di Solusi |
| Cara tanya | **Kartu peminjaman** seperti struk Cari: kolom kata kunci + pilihan topik (5 kategori) + baris "Pustakawan: Andi". Andi mengambil 1–5 buku yang cocok ke meja, buku diberi nomor, ringkasan muncul saat disentuh. Hasil kosong: Andi mengangkat bahu dan menawarkan semua artikel |
| Suasana | Navy seperti toko Solusi (dinding navy, meja lavender, lampu gantung ungu), ditambah rak buku dinding, lampu meja, stempel dan laci katalog. Kedua halaman terasa satu dunia |
| Copy | Draf Claude ID dan EN ("kamu", tanpa em dash, tanpa nama platform, CTA "Konsultasi gratis"). Kicker, H1 dan lead hero lama dipertahankan. Direview di akhir tahap |

## 2. Temuan riset (24 Nov)

- **three.js:** tetap 0.186.1 (keputusan tahap 2: r187 mengganti PMREM). Tidak ada fitur baru yang dibutuhkan halaman ini; halaman ini tidak memakai environment map, jadi alasan menahan versi tetap berlaku. Changelog r188+ tidak ditemukan lewat pencarian, dicek ulang di [rilis GitHub](https://www.github.com/mrdoob/three.js/releases) dan [Migration Guide](https://github.com/mrdoob/three.js/wiki/Migration-Guide) di awal P0.
- **Aksesibilitas kanvas:** pola yang dianjurkan adalah daftar HTML asli (tautan, urutan fokus) yang mencerminkan isi 3D, kanvas hanya lapisan visual, plus versi tanpa 3D ([diskusi three.js](https://discourse.threejs.org/t/accessibility-for-3d-websites/87092), [Quorum](https://quorumlanguage.com/tutorials/accessibility/accessibleGraphicsWebGL.html)). Ini sama dengan etalase Solusi (kotak HTML + pass 3D di belakangnya), jadi tidak ada perubahan arsitektur.
- **Library baru:** tidak perlu. `@react-three/a11y` hanya untuk React Three Fiber, tidak relevan untuk three vanilla.

## 3. Yang dipakai ulang dari Solusi

| Bagian Solusi | Di Pustaka |
| --- | --- |
| `world/solusi/index.ts` (canvas fixed, scissor, loop 30 fps idle, mode, dispose) | `world/pustaka/index.ts` baru dengan struktur sama; bagian yang identik dipindah ke modul bersama **hanya kalau** regresi Solusi tetap lulus |
| `kamera.ts` (rumus bibir meja 8 px, kamera hero/fokus/HP) | Dipakai lewat parameter (tinggi meja, posisi tokoh), bukan disalin |
| `rak.ts` (pass ortho, rect dari DOM, scissor per track) | Diberi parameter selector dan bentuk (buku: tebal, punggung, sampul bertekstur) |
| `kotak.ts` (sajian di meja, layout 1–2 baris, nomor tag) | Pola sama untuk buku di meja; badge status diganti label kategori |
| `heruKasir.ts` + `kasirPose.ts` | `andiPustakawan.ts` + pose pustakawan (idle membaca, ready, lift, offer, wave, shrug, nod, stamp) |
| `lib/solusi/search.ts` | `lib/articles/search.ts` (kata kunci + topik), tes `node:test` |
| Stage CSS `no3d`, crossfade 300 ms, reduced motion, tanpa WebGL | Sama |

Home (rak K7 dan `RackArt`) tidak diubah. `RackArt` dipakai sebagai sumber tekstur sampul (SVG → kanvas, tanpa teks).

## 4. Tahapan

Tiap tahap berhenti untuk review; screenshot hanya di chat.

### P0. Audit dan baseline

1. Cek ulang rilis three.js dan Next.js (tanpa upgrade kecuali disetujui).
2. Ukur toko Solusi sekarang (kamera, bibir meja, posisi kasir) di 11 viewport sebagai baseline regresi: `s5-final.mjs`, `etalase-qa.mjs`.
3. Putuskan batas modul bersama (`kamera`, `rak`, loop) dari kode, catat di plan ini.

### P1. Data dan HTML tanpa 3D

1. `meta.keywords` (ID dan EN) di 5 artikel, skema zod diperbarui; `lib/articles/search.ts` + tes (kata kunci literal seperti Cari, topik, hasil kosong, urutan).
2. `ArticlesPage` jadi: hero (copy lama, stage `no3d` CSS: dinding, meja, papan "Perpustakaan Kreatekno", siluet pustakawan), rak pajangan HTML (buku dengan sampul `RackArt`, judul, ringkasan, kategori, waktu baca, tautan ke artikel), band CTA. JSON-LD `CollectionPage` dan `BreadcrumbList` tetap.
3. Mode `#tanya`: kartu peminjaman (`role="search"`, kata kunci, select topik, tombol), hasil sebagai daftar kartu HTML (tanpa 3D), tombol kembali, Back browser.
4. Copy draf ID/EN di `messages` (`pages.articles.library.*`).
5. Cek: Playwright 360/375/768/1280/1440 × ID/EN, keyboard, axe, tanpa scroll samping, tanpa em dash, build statis.

### P2. Andi pustakawan

1. `cast/andi.ts` direfactor jadi helper rambut/headphone/kaki bersama tanpa mengubah hasil (render lab sebelum/sesudah identik, segitiga sama), seperti refactor `heru.ts` di S3.
2. `cast/andiPustakawan.ts`: kardigan ungu (kancing, saku, manset rib), kaus putih, papan nama polos, kacamata baca (bingkai tipis, tanpa lensa memantul). Tanpa hoodie dan lanyard.
3. Pose pustakawan di lab (`?lab=andiPustakawan&pose=...`).
4. **Berhenti untuk review di chat**: depan, ¾, samping, belakang berdampingan dengan `andi.png`. Target ≤ 16 ribu segitiga, 1 draw call.

### P3. Set perpustakaan

1. Greybox `sets/pustaka.ts`: dinding navy, meja sirkulasi lavender, rak buku dinding (buku dekor instanced), lampu gantung, lampu meja, stempel dan bantalan, laci katalog, papan nama perpustakaan. Skala Andi (1,69 m) disetel supaya kepala dan bahu sebesar Heru di layar. **Review greybox** hero desktop/tablet/HP.
2. Material dan cahaya final, pose idle (membaca, sesekali mengecap stempel), napas, kedip, menoleh ke kursor, reaksi klik, reduced motion.

### P4. Rak 3D dan Tanya pustakawan

1. Pass rak: buku 3D di belakang kotak HTML, hover/fokus naik 6 px, bayangan kontak.
2. Tanya: Andi `ready` → mengambil buku dari rak dinding → `lift` → buku di meja bernomor (layout 1–5, HP dua baris mulai 4), tag nomor, ringkasan saat disentuh, kosong = `shrug` dan tawaran semua artikel.
3. Tanpa WebGL: hasil tetap daftar HTML dari P1.

### P5. QA dan pengerasan

- Playwright 11 viewport: kamera, bibir meja, tag tidak bertumpuk dan di dalam layar, keyboard, axe, reduced motion, tanpa WebGL, context lost, keluar route sebelum mount, console bersih.
- Anggaran (sama dengan Solusi): chunk world Pustaka ≤ 230 KB gzip dengan three bersama, < 60 draw call, < 80 ribu segitiga, bangun Andi ≤ 150 ms di GPU laptop, LCP mobile < 2,5 s.
- Regresi: `artikel-qa.mjs`, `etalase-qa.mjs`, `s5-final.mjs`, rak Home K7.
- Typecheck, ESLint, Prettier, `next build`; tes HP fisik lewat `site-prod-3300`.

**Selesai bila** `/artikel` dan `/en/articles` tampil sebagai meja perpustakaan dengan Andi, rak buku dan Tanya pustakawan berfungsi di desktop, tablet dan HP (juga tanpa WebGL dan reduced motion), Solusi tidak regresi, dan user menyetujui.

## 5. Risiko

| Risiko | Mitigasi |
| --- | --- |
| Refactor modul bersama menggeser toko Solusi | Baseline P0, regresi Solusi tiap tahap, refactor hanya kalau hasil identik |
| 5 artikel membuat rak terlihat kosong | Satu rak pajangan berisi 5 buku + rak dinding dekor di set; rak per kategori menunggu artikel bertambah |
| Kacamata dan kardigan menambah segitiga | Kacamata dari tabung tipis; mode hemat tanpa kancing dan saku |
| Kata kunci artikel tidak menjangkau isi | `meta.keywords` ditulis per artikel dan direview bersama copy |

## 6. Hasil P0 (24 Nov)

### 6.1 Rilis library

| Library | Temuan | Keputusan |
| --- | --- | --- |
| three | r187 rilis 30 Okt: PMREM pindah ke cube render target (tampilan material berubah), `setViewport()`/`setScissor()` tidak lagi dikali pixel ratio saat render target terpasang. Wiki Migration Guide (diubah 19 Nov) sudah punya bagian 187 → 188: `HemisphereLight` dan `AmbientLight` kini menambah pantulan specular pada `MeshStandardMaterial`, dan AO multi-bounce | Tetap **0.186.1**. Toko memakai `HemisphereLight` + `MeshStandardMaterial`, jadi r188 akan mengubah tampilan toko dan pustaka. Pass rak dan toko memakai scissor/viewport, jadi r187 juga perlu dicek ulang kalau suatu saat dinaikkan |
| Next.js | Situs memakai 16.4.3. Rilis keamanan 3 Nov (16.4.5) memperbaiki GHSA-mfr8-8qww-v76h (High, cache `unstable_cache` + `use cache`) dan beberapa advisory Moderate (cache, `x-middleware-set-cookie`, SVG Image Optimization). `next build` juga menampilkan rekomendasi upgrade keamanan | **Tidak diubah di tahap ini.** Upgrade ke 16.4.5 diusulkan ke user sebagai pekerjaan terpisah (perlu persetujuan, menyentuh seluruh situs) |

### 6.2 Baseline Solusi

- Alat baru `tools/pustaka/solusi-baseline.mjs` (`record` / `compare`): 11 viewport, reduced motion, build produksi. Per viewport merekam kamera, celah bibir meja, posisi kasir di layar, draw call, segitiga, pass rak dan Cari "dokumen" di meja (kotak dan rect tag), plus screenshot hero, etalase dan Cari. `compare` membandingkan angka (toleransi 0,001) dan piksel (≤ 0,1% piksel berbeda > 8/255).
- Dua rekaman berturut-turut **identik**, jadi alat ini deterministik. Screenshot hanya di scratchpad.
- Angka baseline: celah bibir 8,000 px di 11 viewport; hero 30 draw call / 27.098 segitiga (≥ 1180 px), 31 / 37.546 (1024×1366), 24 / 27.026 (tablet), 19 / 12.118 (HP); Cari "dokumen" 3 kotak. Console hanya 404 analytics lokal.
- `etalase-qa.mjs` 114/114 lulus.
- Skrip lama yang tidak bisa dipakai sebagai regresi apa adanya: `s5-final.mjs` masih mengharapkan 12 Solusi (cek "2 / 2" dan "7–12"; sejak S8 ada 17) dan satu penantian 1 detik yang kadang habis; `s4-final.mjs` gagal acak di SwiftShader (langkah berbeda tiap run: tombol tutup, mesin kasir). Diprobe: halaman berperilaku benar, kegagalannya soal waktu tunggu skrip. Tidak diubah di P0.

### 6.3 Batas modul bersama

Dari membaca `world/solusi/{index,kamera,rak,kotak}.ts`:

1. **Komposisi sama dengan toko.** Meja pustaka memakai bibir 0,88 m, permukaan 1,06 m, depan di z 0, dan target kamera hero/fokus/HP yang sama. Dengan begitu `kamera.ts` dipakai **tanpa perubahan** (rumus bibir 8 px, view offset, kamera HP). Andi berdiri di titik kasir; skala dicari supaya puncak kepala dan pinggul sejajar Heru kasir (perkiraan 1,77 × 1,80 / 1,69 ≈ 1,89), ditetapkan di greybox P3.
2. **Folder bersama `world/meja/`.** `kamera.ts`, `rak.ts` dan `kotak.ts` dipindah ke sana; Solusi dan Pustaka sama-sama mengimpor dari situ.
3. **`rak.ts` diberi opsi**: selector (section, frame, papan, item, sampul, slot, track), kedalaman dan radius benda, warna panel dan papan, serta tepi halaman krem opsional untuk buku. Nilai default sama persis dengan Solusi.
4. **`kotak.ts` diberi pabrik benda**: geometri badan, hiasan muka (Solusi: badge status; Pustaka: label kategori) dan ukuran. Tata letak 1–2 baris, lompatan dari rak, tag nomor dan posisi ringkasan tetap bersama.
5. **Pengendali tokoh** dari `solusi/index.ts` (antrean pose, blend, napas, kedip, menoleh ke kursor, lambai, angguk, reaksi diklik, hitbox) dipindah ke `world/meja/tokoh.ts` dengan parameter tabel pose dan skala. Loop, ukuran canvas, scissor dan pointer tetap per halaman (`pustaka/index.ts` mengikuti struktur Solusi).
6. **Urutan dan syarat.** P1 dan P2 tidak menyentuh Solusi. Pengendali tokoh dipindah di awal P3, `rak`/`kotak` di awal P4. Tiap pemindahan wajib: `solusi-baseline.mjs compare` identik dan `etalase-qa` 114/114. Karena reduced motion tidak menjalankan gerak tokoh, sebelum pengendali tokoh dipindah baseline ditambah rekaman urutan pose di mode normal (masuk Cari → lambai, mengetik → ready, hasil → lift, kosong → shrug, klik kasir → reaksi).
