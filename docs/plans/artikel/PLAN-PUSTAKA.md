# Artikel 3D: meja perpustakaan dengan Andi (Pustaka)

_Disusun 24 Nov 2026 dari permintaan user dan jawaban interview hari yang sama. Status: plan disetujui 24 Nov ("Setuju, mulai P0"); P0 selesai dan di-commit 24 Nov; P1 selesai dan disetujui 24 Nov ("Mulai P2 di sesi baru"), belum di-commit (hasil di bagian 7); P2 selesai dan disetujui 24 Nov ("Setuju, lanjut P3"), belum di-commit (hasil di bagian 8); greybox P3 disetujui 25 Nov ("Lanjut langkah 2"); P3 selesai dan disetujui 25 Nov ("Setuju, P3 selesai"), belum di-commit (bagian 9). P4 selesai dan disetujui 26 Nov ("Setuju, lanjut P5"), belum di-commit (bagian 10); P5 selesai teknis (bagian 11). P1–P5 di-commit dan di-push ke `main` 26 Nov atas permintaan user ("commit semua dan push ke main"); **tes HP fisik belum**._

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

## 7. Hasil P1 (24 Nov)

### 7.1 Keputusan user di awal P1

| Topik | Keputusan |
| --- | --- |
| Pencocokan kata kunci | Semua kata harus cocok, urutan bebas. Tiap kata dicocokkan ke awal kata di judul, ringkasan, kategori dan `meta.keywords`; huruf besar/kecil dan aksen diabaikan ("beli" tidak cocok dengan "pembeli", "pembel" cocok) |
| Rak di HP dan tablet | Satu baris yang digeser (swipe, panah, drag mouse) memakai `RakTrack` Solusi; di layar lebar kelima buku terlihat sekaligus dan rak di tengah |
| Daftar lama | "Artikel pilihan" dan grid "Artikel lainnya" diganti rak. JSON-LD `CollectionPage` dan `BreadcrumbList` tetap |
| Tombol hero | "Tanya pustakawan" (membuka `#tanya`) dan "Lihat rak" (`#rak`) |

### 7.2 Riset

- `<search>` Baseline sejak 2023 dan masuk "widely available" di digest Baseline April 2026; memberi landmark `search` tanpa `role` ([MDN](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/search), [web.dev](https://web.dev/blog/baseline-digest-apr-2026)). Hasil pencarian tidak ditaruh di dalam `<search>`.
- Jumlah hasil diumumkan lewat `role="status"` yang sudah ada di DOM sebelum diisi, `aria-atomic="true"` ([W3C ARIA22](https://www.w3.org/WAI/WCAG21/working-examples/aria-role-status-searchresults), [Scott O'Hara](https://www.scottohara.me/blog/2022/02/05/dynamic-results.html)).

### 7.3 Yang dibangun

- **Data:** `meta.keywords` (4–16 kata, ID dan EN, tidak tampil di halaman) di 10 MDX; skema zod diperbarui. `lib/articles/search.ts` (`normalize`, `searchBooks`).
- **Halaman:** `ArticlesPage` (server: data buku, band, JSON-LD) memanggil `PustakaPage` (client). Hero dengan meja pustakawan versi CSS (papan KREATEKNO PERPUSTAKAAN, rak dinding, Andi berkardigan dan berkacamata, meja dengan lampu), rak buku (sampul menghadap depan: kategori, gambar `RackArt`, judul sampai 5 baris, ringkasan 2 baris, waktu baca; punggung buku gelap di kiri), band Konsultasi gratis. Kelas rak mengikuti etalase (`.frame`, `.plank`, `.track`, `.slot`, `[data-slot]`, `data-color`) untuk pass 3D P4. Font mono dimuat di halaman ini saja.
- **Tanya pustakawan (`#tanya`):** judul panel mendapat fokus saat dibuka (keyboard HP tidak muncul), kartu peminjaman di `<search>` (kata kunci + topik, label terlihat, "Kartu peminjaman · Pustakawan: Andi", nomor kartu naik tiap pertanyaan), hasil bernomor dengan judul sebagai tautan, baris hasil digulir ke bawah header, hasil kosong menampilkan kelima buku di bawah "Semua buku di rak", "Tanya lagi" kembali ke kolom kata kunci, Escape dan Back kembali ke rak.
- **Copy:** `pages.articles.library.*` ID/EN, draf Claude ("kamu", tanpa em dash, tanpa nama platform), direview user.
- **QA:** `tools/pustaka/search.test.mjs` (8 tes dari meta asli), `tools/pustaka/p1-qa.mjs` (256 cek). `tools/legal/artikel-qa.mjs` membaca tautan buku di rak, bukan kartu lama.
- Solusi tidak diubah (`RakTrack` hanya diimpor).

## 8. Hasil P2 (24 Nov)

### 8.1 Keputusan user di awal P2

| Topik | Keputusan |
| --- | --- |
| Kardigan | Leher V, dikancing 4 dari dada ke pinggang, kaus putih terlihat di V |
| Warna | Ungu hoodie Andi (`#6441a2`), rib sedikit lebih gelap (`#4d3083`) |
| Kacamata | Di mata, bingkai tipis bulat-kotak gelap (`#23264a`), tanpa lensa |
| Properti | Pose saja di lab; buku, kartu dan stempel dibuat di set P3, lalu titik tangan disetel ke benda itu |

Riset: tidak ada rilis three r188 yang ditemukan (tetap 0.186.1); pembangun tokoh sudah menggabung semua bagian jadi satu `SkinnedMesh` dengan satu atlas, jadi kacamata dari `TubeGeometry` tidak menambah draw call. Tidak perlu library baru.

### 8.2 Yang dibangun

- **Refactor `cast/andi.ts`:** diekspor `ANDI_COLORS`, `ANDI_BODY`, `andiFace()`, `ANDI_COLLIDERS`, `andiHair()` (rambut berlapis + poni, pegas Heru), `andiHeadphones()`, `andiLegs()` (celana lebar, sepatu putih). `ANDI.dress` memanggil helper dengan urutan yang sama.
- **`cast/andiPustakawan.ts`:** kardigan dari potongan torso hoodie (hem 0,72 m) dengan tekstur rajut, V putih, garis leher kaus, plaket, dua saku tempel dengan atas rib dan hem rib; neckband rib (ribbon) dari V mengelilingi tengkuk; plaket rib dan 4 kancing; saku timbul; lengan rajut dengan manset rib; papan nama putih polos di dada kiri Andi; kacamata (dua bingkai, jembatan, gagang ke atas telinga, tulang `head`); headphone dan kaki Andi. Tanpa hoodie dan lanyard. Mode hemat: tanpa kancing dan saku timbul (tetap dilukis).
- **`cast/pustakawanPose.ts`:** `idle` (membaca buku terbuka di dada, kepala menunduk, kelopak turun), `ready` (menengadah, condong, kedua tangan di meja), `lift`, `offer`, `wave`, `shrug`, `nod`, `stamp` (tangan kanan menekan stempel, tangan kiri menahan kartu). Titik tangan dari pose kasir diskalakan 1,69/1,80.
- **Lab:** `?lab=andiPustakawan` (tokoh hanya dikenal lab, tidak masuk `roster` Home), `&pose=NAMA` atau `&pose=all`, `&rot=` untuk deretan pose. Tabel pose per tokoh (`heruKasir`, `andiPustakawan`).
- **Alat:** `tools/pustaka/andi-snap.mjs` (render Andi Home sheet/face/flat/hemat/K8/potret dpr 2 + SHA-256, `compare`), `tools/pustaka/andi-poses.mjs` (deretan 8 pose depan, ¾, samping).

### 8.3 Bukti dan anggaran

- **Andi Home identik:** 6 render sebelum vs sesudah refactor identik byte-for-byte (sheet, face, flat, hemat, pose K8, potret Tentang dpr 2), 15.070 segitiga (hemat 9.686) dan `partTris` sama. Dua rekaman sebelum refactor juga identik (alat deterministik). Karena potret identik, `public/team/andi.webp` tidak perlu dan tidak dirender ulang.
- **Andi pustakawan:** 15.646 segitiga (hemat 9.218), di bawah 16 ribu; satu `SkinnedMesh` dengan satu material (lab mencatat 2 call: pass utama + bayangan). Waktu bangun di build produksi (`cast-bench.mjs`, 7 kali, SwiftShader): median 109 ms, p95 131 ms (Andi Home: median 77 ms).
- Render depan, ¾, samping, belakang berdampingan dengan `andi.png`, close-up wajah dan deretan pose hanya di chat (scratchpad).
- Typecheck, ESLint, Prettier (file P2), `next build` (75 halaman) lulus. Console lab tanpa error.

### 8.4 Belum / catatan review

- Titik tangan `idle`, `ready`, `lift`, `offer`, `stamp` disetel ke buku, kartu, stempel dan tinggi meja di P3 (skala ±1,89).
- Gagang kacamata masuk ke rambut samping; cup headphone kiri di tampak ¾ menonjol seperti di Andi Home (tanpa tudung di bawahnya cup tampak sedikit melayang dari belakang).

## 9. P3 (24 Nov)

### 9.1 Keputusan user di awal P3

| Topik | Keputusan |
| --- | --- |
| Susunan | Cermin toko: lampu gantung ungu kiri atas; di meja kiri Andi lampu meja, stempel dan bantalan, tumpukan buku (pengganti mesin kasir); rak buku dinding 3 tingkat di kanan Andi; papan nama KREATEKNO PERPUSTAKAAN di dinding atas rak; laci katalog berdiri di ujung kanan |
| Pengendali tokoh | Dipindah ke `world/meja/tokoh.ts` di awal P3 sesuai 6.3: rekam urutan pose Solusi di mode normal dulu, lalu baseline 11 viewport dan `etalase-qa` harus identik |
| Stempel | Saat idle membaca, Andi mengecap stempel tiap 9–14 detik (acak, ±0,8 detik), tidak jalan saat reduced motion |
| Tanpa WebGL | Pembuatan renderer di try/catch; konteks hilang membuang dunia dan meja CSS P1 tampil lagi tanpa reload. Solusi tidak diubah (temuan: Solusi belum menangani keduanya) |

### 9.2 Riset

- Buku dekor rak: satu `InstancedMesh` (satu geometri kotak, skala dan warna per instance lewat `setColorAt`) = 1 draw call; menggabung geometri juga bisa, tapi instance lebih hemat memori untuk bentuk yang sama ([dokumen InstancedMesh](https://threejs.org/docs/pages/InstancedMesh.html), [diskusi merge vs instance](https://discourse.threejs.org/t/merging-or-instancing-geometries/28713)).
- Konteks WebGL bisa hilang kapan saja (GPU kehabisan memori, tab di latar belakang di iOS); aplikasi produksi sebaiknya menangani `webglcontextlost` ([MDN WebGL best practices](https://developer.mozilla.org/en-US/docs/WebGL/WebGL_best_practices), [three.js forum](https://discourse.threejs.org/t/how-to-fix-context-lost-android-iphone-ios/56829)).

### 9.3 Langkah 1: pemindahan modul bersama dan greybox

- **`world/meja/`:** `kamera.ts` dipindah dari `world/solusi/` apa adanya; `tokoh.ts` baru berisi pengendali tokoh dari `solusi/index.ts` (antrean pose, blend, napas, menoleh/ayun kepala, kedip, overlay lambai dan angguk, reaksi diklik, hitbox, raycast) dengan parameter tabel pose, skala dan pose dasar. Ayunan lampu gantung tetap di halaman masing-masing. `solusi/index.ts` memanggil `createTokoh`.
- **Bukti Solusi tidak berubah** (build produksi): `solusi-baseline.mjs compare` P3-sebelum vs sesudah identik dalam toleransi di 11 viewport (rekaman pertama 0,135% piksel di Cari 390×844, derau yang sama dengan P1; rekaman ulang identik); `etalase-qa` 114/114; alat baru `tools/pustaka/solusi-tokoh.mjs` merekam urutan pose di mode normal (buka Cari → lambai, mengetik → ready, hasil → ready/lift, Cari lagi → lift, kosong → shrug, kembali, klik kasir, kepala mengikuti mouse) dan rekaman pertama sesudah refactor sama dengan sebelumnya (toleransi waktu: reaksi ±150 ms, kepala ±0,03 rad). Rekaman berikutnya kadang kehilangan pose transisi di awal (misalnya `ready` sebelum `shrug`), dan dua rekaman dari build yang sama juga berbeda satu sama lain: SwiftShader hanya ±8 fps di 1440 px, jadi perekam per frame melewatkan pose pendek. Reaksi klik diukur langsung 4 kali: 0,75–0,8 detik. Alat ini perlu merekam pose awal sebelum tiap aksi supaya stabil (P5).
- **`sets/pustaka.ts`:** dinding, wainscot, rel, meja dan lampu gantung milik toko; di meja kiri Andi lampu meja (kap ungu, tiang kuningan), stempel di bantalan, tumpukan 4 buku; rak dinding 3 tingkat (buku dekor satu `InstancedMesh`, warna sampul rak artikel, satu buku miring di celah); papan nama KREATEKNO PERPUSTAKAAN (kanvas, font mono halaman setelah dimuat; EN: LIBRARY); laci katalog berdiri di ujung kanan (laci, label, pegangan: tiga `InstancedMesh`); buku terbuka yang dibaca Andi.
- **`world/pustaka/index.ts`:** kanvas fixed di-scissor ke hero, loop 30 fps saat diam, kamera hero toko (bibir 8 px), Andi skala 1,9 di titik kasir (puncak kepala dan pinggul sejajar Heru: pinggul, dagu, bahu memberi 1,904, puncak rambut 1,885), pengendali tokoh bersama (napas, kedip, kepala mengikuti mouse, reaksi diklik, lambai saat `#tanya`), buku di antara kedua tangan saat idle. Papan nama hanya tampil bila seluruhnya masuk layar (di HP tertimpa copy, di tablet sempit terpotong). WebGL2 diminta sendiri sebelum three (tanpa WebGL: `null`, tanpa error console); `webglcontextlost` membuang dunia dan meja CSS tampil lagi.
- **`PustakaPage`:** memuat dunia lewat `import()`, kelas `pustaka-world-ready` (crossfade 300 ms, H1 putih, kicker cyan seperti toko), kursor tangan saat di atas Andi.
- **Pose:** titik tangan `ready` dan `stamp` disetel ke meja (permukaan meja y 0,805 di bingkai Andi).
- **Dicek** (build produksi): `p3-shots.mjs` 11 viewport: bibir 8,000 px, tanpa scroll samping, console bersih; desktop 42 draw call · 18,0 rb segitiga, tablet 35–36 · 17,5 rb, HP 28–29 · 16,8 rb (laci katalog sebagai instance menurunkan 66–80 → 42). `p3-fallback.mjs`: tanpa WebGL, konteks hilang, keluar sebelum mount dan kembali, lulus. `p1-qa` 256/256, `artikel-qa` 617/617. Typecheck, ESLint seluruh situs, Prettier, `next build`.
- **Belum (langkah 2 setelah review greybox):** material dan cahaya final (Andi tampak lebih gelap dari Heru), stempel tiap 9–14 detik dengan stempel di tangan, transisi buku saat berganti pose, reduced motion untuk gerak baru, tes HP fisik.

### 9.4 Langkah 2: cahaya, stempel, buku (25 Nov)

- **Stempel:** bantalan pindah ke jangkauan tangan kanan Andi, kartu peminjaman (putih, strip ungu, garis) di depannya. Tiap 9–14 detik (acak) saat mode toko, Andi diam membaca dan tidak sedang bereaksi, dia memainkan `stampLift` 0,6 s → `stamp` 0,3 s → `stampLift` 0,35 s lalu kembali membaca; pose baru `stampLift` (tangan terangkat di atas kartu) supaya gerak angkat-tekan lewat IK, tanpa overlay baru di pengendali bersama. Stempel ikut kepalan tangan kanan selama pose stempel dan kembali ke bantalan; cap ungu muncul di kartu setelah tekanan pertama. Tidak jalan di reduced motion.
- **Buku:** meluncur halus antara kedua tangan (idle) dan meja (terbuka, rebah) saat pose berganti, termasuk lambai, angkat bahu dan reaksi lain.
- **Cahaya dan material:** fill hangat rendah dari depan (`#ffe2c4`, 0,65) karena Andi membaca dengan kepala menunduk menjauhi key light; wajahnya kini setara Heru di kasir. Lampu meja diganti kap kubah dengan bola lampu, ditambah genangan cahaya hangat di meja (decal radial aditif, tanpa lampu shader tambahan).
- **Kontras hero:** saat dunia 3D siap, `.pustaka-hero` diberi latar navy dinding. axe tidak bisa melihat kanvas dan membaca teks putih di atas latar halaman terang (`p1-qa` 1280 gagal sekali); latar navy juga menjaga teks terbaca kalau kanvas belum tergambar.
- **Alat:** `tools/pustaka/p3-stamp.mjs` merender aksi stempel frame demi frame pada 60 fps sintetis (SwiftShader sendiri ±8 fps) dengan snapshot kanvas.- **Dicek** (build produksi): `p3-shots` 11 viewport bibir 8 px, tanpa scroll samping, console bersih; desktop 48 draw call · 18,7 rb segitiga, tablet 41–42 · 18,1 rb, HP 34–35 · 16,9 rb (di bawah anggaran P5 < 60 dan < 80 rb). `p3-stamp`: urutan idle → stampLift → stamp → idle, alas stempel turun ke 1,075–1,087 m di atas kartu 1,066 m (laju 60 fps sintetis), buku kembali ke tangan. Reduced motion: lewat jadwal dan dipanggil paksa, stempel tidak jalan, buku tetap di tangan. `p3-fallback` lulus. `p1-qa` 256/256 dan `artikel-qa` 617/617 dua kali berturut-turut setelah latar navy (sebelumnya satu run `artikel-qa` 616/617 tanpa baris FAIL tersimpan; tiga run berikutnya lulus). Solusi: `solusi-baseline compare` identik dalam toleransi (pengendali bersama tidak diubah di langkah 2). ESLint seluruh situs, typecheck, Prettier file yang diubah, `next build`.
- **Disetujui user 25 Nov** ("Setuju, P3 selesai"), setelah tes HP fisik lewat `site-prod-3300`. Rak 3D dan Tanya 3D tetap P4.

## 10. P4 (25 Nov)

### 10.1 Keputusan user di awal P4

| Topik | Keputusan |
| --- | --- |
| Mengambil buku | Andi berbalik ke rak dinding di kanannya (`ready`), buku hasil keluar dari rak satu per satu dan melayang ke meja sambil dia meraih (`lift`), lalu menghadap depan lagi dan menyajikan (`offer`). Putaran badan hanya di dunia Pustaka, pengendali bersama tidak berubah |
| Buku di meja | Berdiri, sampul ke depan, miring bergantian seperti kotak Solusi: warna kategori, gambar `RackArt`, label kategori; tag nomor di atasnya; sentuh/hover = kartu ringkasan dengan tautan ke artikel |
| Hasil kosong | Andi mengangkat bahu, lalu meletakkan kelima buku sebagai tawaran (teks "Semua buku di rak" seperti P1) |

Mengikuti Cari di Solusi (tanpa ditanyakan ulang): kamera fokus toko saat `#tanya`, kartu hasil HTML disembunyikan saat 3D siap (tanpa WebGL tetap daftar P1), rak 3D di belakang buku HTML dengan naik 6 px saat hover/fokus dan bayangan kontak.

### 10.2 Riset

- Sinkron kanvas dengan DOM: satu kanvas fixed yang di-scissor dan rect DOM dibaca dalam loop frame adalah pola umum; alternatifnya observer untuk mengurangi `getBoundingClientRect` ([WebGL Scroll Sync](https://github.com/lusionltd/WebGL-Scroll-Sync), [r3f-scroll-rig](https://docsearch.algolia.com/mcp/docs/repo/14islands/r3f-scroll-rig)). Etalase Solusi sudah memakai pola pertama dan lulus anggaran, jadi tidak diubah.
- Aksesibilitas hasil 3D: tombol nyata berlabel per objek di atas kanvas, fokus disinkronkan dengan sorotan 3D, satu region status untuk jumlah hasil ([three.js forum](https://discourse.threejs.org/t/accessibility-for-3d-websites/87092), [Needle Engine](https://engine.needle.tools/docs/how-to-guides/accessibility)). Sama dengan tag nomor dan `role="status"` yang sudah ada.

### 10.3 Yang dibangun

- **Modul bersama (`world/meja/`):** `rak.ts` dipindah dari `world/solusi/` dengan opsi `RakOptions` (selector section, frame, papan, item, sampul, slot, track; kedalaman, radius, warna papan dan panel) dan opsi `pages` untuk buku (papan depan dan belakang setebal `board` dengan blok halaman krem di antaranya); default `ETALASE` sama persis dengan Solusi. `kotak.ts` dipecah: tata letak 1–2 baris, lompatan, jalan pulang, tag nomor, kartu ringkasan dan raycast ada di `world/meja/kotak.ts` (`buildDeskObjects`, dengan pabrik benda, asal/tujuan, jeda dan lengkung); kotak bertanda status Solusi tetap di `world/solusi/kotak.ts`.
- **Bukti Solusi tidak berubah:** `solusi-baseline compare` identik dalam toleransi di 11 viewport, `etalase-qa` 114/114.
- **Rak 3D Pustaka:** pass rak dengan opsi buku (`depth` 40, papan 6, blok halaman krem 5 px ke dalam, panel sampul `#fffdf6`); CSS membuat badan buku, sampul dan papan transparan saat 3D siap; punggung buku CSS tetap di atas papan depan; naik 6 px saat hover/fokus dan bayangan kontak dari pass yang sama.
- **Buku di meja (`world/pustaka/buku.ts`):** papan depan dan belakang, blok halaman, sampul kanvas (warna kategori, punggung, label kategori, panel krem dengan gambar `RackArt` dari SVG rak di halaman, judul sampai 6 baris dengan font display halaman). Asal dan tujuan pulang: rak dinding (rak tengah dan atas), jeda 0,55 + 0,2 s per buku, terbang 0,75 s.
- **Tanya 3D (`world/pustaka/index.ts`):** kamera fokus toko; mengetik di kolom kata kunci = Andi `ready` (mendengarkan); kirim = Andi berbalik 1,25 rad ke rak (`ready` → `lift` sambil buku melayang ke meja) lalu menghadap depan dan `offer`; hasil kosong = `shrug` 1,1 s lalu kelima buku; "Tanya lagi" = buku kembali ke rak; barang di depan meja (tumpukan, bantalan, stempel, kartu) disingkirkan selama buku tersaji. Hover/sentuh buku atau tag nomor = kartu ringkasan (kategori, judul, ringkasan, waktu baca, tautan "Baca artikel"); Escape menutup ringkasan dulu, lalu panel.
- **Halaman:** kartu peminjaman pindah ke kiri meja (HP: lembar bawah) dan terlipat saat buku tersaji, bilah hasil di bawah, tag nomor tombol nyata dengan label "Buku N: judul", kartu hasil HTML dan "Semua buku di rak" hanya tanpa 3D. Pesan baru `pages.articles.library.closeBook` (ID/EN).
- **Alat:** `tools/pustaka/p4-shots.mjs` (rak, Tanya berhasil, ringkasan, kosong di 4 viewport), `tools/pustaka/p4-fetch.mjs` (koreografi mengambil buku per frame pada 60 fps sintetis).

### 10.4 Dicek (build produksi, 25 Nov)

- `p4-shots` (1440, 1180, 768, 390): rak 3D 5 buku, pass rak 6 call; Tanya "admin" = 1 buku dan 1 tag; ringkasan di dalam layar; kosong = kelima buku dan 5 tag (HP dua baris); tanpa scroll samping; console bersih. Draw call tampilan rak 54 (hero ikut terlihat) / 47 / 40, Tanya 37 / 30 / 25 (anggaran < 60).
- `p4-fetch`: urutan `ready` → `lift` → `offer` → `idle`, putaran sampai 1,25 rad lalu kembali 0, lima buku di meja.
- Hero `p3-shots` 11 viewport: bibir 8 px, desktop 54 draw call (rak di bawah ikut terhitung saat terlihat), HP 34–35.
- `p3-fallback`: tanpa WebGL (hero CSS dan Tanya memakai kartu HTML, tanpa tag), konteks hilang, keluar sebelum mount, lulus.
- `p1-qa` 256/256 sekarang di browser tanpa WebGL (halaman HTML P1 adalah versi tanpa 3D; alur 3D di `p4-shots`); `artikel-qa` 617/617 dua kali setelah label papan rak diberi latar (axe membaca teks navy label "Semua artikel" di atas bingkai gelap saat papan CSS transparan).
- Solusi: `solusi-baseline compare` identik dalam toleransi, `etalase-qa` 114/114. ESLint seluruh situs, typecheck, Prettier file yang diubah, `next build`.
- **Disetujui user 26 Nov** ("Setuju, lanjut P5"). P5 (QA dan pengerasan) berikutnya.

## 11. P5 (26 Nov)

### 11.1 Keputusan user dan riset

| Topik | Keputusan |
| --- | --- |
| LCP | Diukur di lab dengan Playwright + CDP: build produksi lokal, 390×844, CPU 4× lebih lambat, jaringan setara 4G lambat (150 ms, 1,6 Mbps turun, 750 kbps naik), LCP dari `PerformanceObserver`, 5 kali, median. Tanpa library baru |
| `s5-final.mjs` | Dibiarkan (usang sejak S8: 12 Solusi, penantian yang kadang habis); regresi Solusi memakai `solusi-baseline`, `solusi-tokoh` dan `etalase-qa`. Diusulkan sebagai pekerjaan terpisah |

Riset: batas LCP "baik" ≤ 2,5 s pada persentil 75; angka lab bisa berbeda dari data lapangan (cache, bfcache) ([web.dev](https://web.dev/articles/lab-and-field-data-differences)); LCP di Playwright lewat `PerformanceObserver` `largest-contentful-paint` dan throttling CDP `Emulation.setCPUThrottlingRate` / `Network.emulateNetworkConditions` ([Checkly](https://www.checklyhq.com/learn/playwright/performance/), [Chrome for Developers](https://developer.chrome.com/blog/devtools-realtime-cwv)).

### 11.2 Anggaran (build produksi)

| Ukuran | Hasil | Target |
| --- | --- | --- |
| JS dunia 3D (chunk Pustaka + three) | 171,9 KB gzip (19,4 + 82,5 + 70) | ≤ 230 KB |
| JS seluruh /artikel | 367,7 KB gzip, 15 file | — |
| Bangun Andi di halaman (7 kali) | median 91 ms, p95 106 ms | ≤ 150 ms |
| LCP HP /artikel (lab) | median 924 ms (888–948) | < 2,5 s |
| LCP HP /solusi (pembanding) | median 1.224 ms | — |
| Draw call / segitiga | hero desktop 54, Tanya 37, HP 34 / ≤ 18,7 rb | < 60 / < 80 rb |

Waktu bangun Andi kini tercatat di `window.__pustaka.buildMs`.

### 11.3 QA dan regresi (build produksi)

- **`tools/pustaka/p5-qa.mjs` 315/315** di 11 viewport (ID; EN dan reduced motion di 1440 dan 390): dunia siap, bibir hero 8 px, Andi di layar, hero < 60 draw call dan < 80 rb segitiga, tanpa scroll samping; rak 3D tepat di atas buku HTML dan buku yang difokus Tab naik 6 px; Tanya lewat keyboard (tombol, fokus judul, Enter), 1 hasil dan kelima buku saat kosong, tag di dalam layar dan tidak bertumpuk, Tab ke tag membuka ringkasan di dalam layar, Escape menutup ringkasan dulu, Back kembali ke rak; axe di rak dan Tanya tersaji; reduced motion: Andi tidak berbalik; console bersih.
- Catatan alat: fokus lewat skrip tidak memicu `:focus-visible`, jadi cek angkat memakai Shift+Tab sungguhan; di bawah beban suite SwiftShader kadang menahan transisi CSS > 3 s, jadi cek itu mengulang fokus sekali (probe langsung: naik 6 px dalam 0,25–0,75 s, 3 dari 3).
- `p3-fallback` (tanpa WebGL termasuk Tanya HTML, konteks hilang, keluar sebelum mount) lulus; `p1-qa` 256/256 (tanpa WebGL); `artikel-qa` 617/617.
- Solusi: `solusi-baseline compare` identik dalam toleransi, `solusi-tokoh compare` sama (perbandingan kini mengabaikan pose sisa langkah sebelumnya dan `ready` singkat yang terlewat di ±8 fps; seluruh rekaman ulang P3 juga sama, kecuali satu durasi reaksi 0 ms saat frame sangat jarang), `etalase-qa` 114/114.
- Home: modul baru tidak diimpor dunia Home (hanya `andi.ts`, yang terbukti identik di P2); render K7 PC dan HP tampil normal, console bersih.
- Typecheck, ESLint seluruh situs, Prettier file yang diubah, `next build` lulus.
- **Belum:** persetujuan akhir user dan tes HP fisik (`site-prod-3300`). `s5-final.mjs` tetap usang (diusulkan terpisah). Tidak ada commit/push.

