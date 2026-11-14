# Revisi etalase v1 (13 Nov 2026)

_Status: **plan disetujui user 13 Nov ("Setuju, mulai"). S5b selesai dan disetujui user 14 Nov ("Setuju").** Selisih di luar etalase (8.1) belum diputuskan. Plan induk: [PLAN-SOLUSI.md](../../../PLAN-SOLUSI.md), tahap S5b._

## 1. Latar

Artefak v1 `AZX3Jy8e9Bmmdnu9tLL8Jb` diperbarui. Dibandingkan dengan salinan 4 Nov, perubahannya hanya pada kotak etalase dan kotak di meja kasir. Hero, Cari, Kartu masalah, kasir, kamera, kontak, data dan copy tidak berubah.

| Bagian | v1 4 Nov | v1 13 Nov |
| --- | --- | --- |
| Kotak etalase `.pk` | lebar slot (232,8 / 228 / 216) × 142 | tetap 216 × 305 |
| Sampul `.cover` | hanya `result`, 13 px, panel putih | judul (display 18 px, maks. 4 baris), ringkasan (13 px, maks. 3 baris), blok "Cocok untuk" berisi chip bidang usaha dengan ikon (maks. 2 baris, sisanya "+N"; kalau semua bidang: "Semua bidang usaha"), panel `#F1F1F5` |
| Status | kanan atas, tinggi 18 px | kiri atas, tinggi 20 px, 11 px |
| Ikon aplikasi | 24 px, navy | 28 px, warna per aplikasi (glyph, bukan logo brand) |
| Track | kolom `max(216px, 1/5 rak)`, HP 228 | kolom 216 di semua viewport |
| Slot dekor | pengisi sampai 5 per tier | dihapus |
| Rak 3D | radius kotak 11, panel putih radius 9 | radius kotak 6, panel `#F1F1F5` radius 10 |
| Kotak di meja | 0,78 × 0,4 × 0,44 dengan panel putih; 2 baris kalau > 3 | 0,5 × 0,706 × 0,148 (proporsi kotak rak) dengan badge status dari tekstur kanvas; selalu 1 baris; jarak 0,09; skala 0,3–0,9 |

Bukti perilaku (13 Nov, Playwright GPU, artefak lama dan baru): 38 cek di desktop, tablet dan HP lulus di kedua versi. Rinciannya ada di log `PLAN.md` 13 Nov.

Salinan repo: `prototype/solusi-etalase-v1.html` sekarang versi 13 Nov (preamble runtime artefak dibuang, isi lain sama byte per byte). Versi 4 Nov disimpan sebagai `prototype/solusi-etalase-v1-2026-11-04.html`.

## 2. Temuan yang memengaruhi plan

1. **Etalase situs belum pernah sama dengan v1.** Langkah 10 S2 (`measure.mjs` terhadap VISUAL) tidak dijalankan di situs. Keadaan sekarang di desktop:
   - Kotak `.solution-box` 230 × 251 dengan border navy, rotasi, judul, ringkasan dan "Lihat detail".
   - Status memakai huruf mono kapital hijau/oranye.
   - Panel putih 3D tidak sejajar dengan teks.
   - Panah kiri menutupi judul.
   - Judul etalase "Solusi untuk tiap bagian tim" plus eyebrow dan paragraf. Menurut COPY v1, judulnya "Pilih solusi sesuai kebutuhan bisnis Anda".
2. **Acuan VISUAL lama tidak berlaku untuk etalase.** `compare.mjs` terhadap prototipe 13 Nov: dari 1.771 cek, 538 gagal. Semua kegagalan ada di frame/tier/track/slot/`.pk`/`.cover` (VISUAL 8) dan posisi tag 7.5. Hero, struk, kartu, kontak, hasil dan kamera tetap cocok. Ada satu selisih kecil: tinggi band di 1920×1080 156,6 lawan 162,8 px. Ini belum dijelaskan karena kode band tidak berubah, jadi dicek ulang di R0.
3. **Riset:**
   - `line-clamp` tanpa prefix belum Baseline dan Firefox masih butuh `-webkit-line-clamp`. Pakai bentuk berprefix seperti artefak, ditambah `line-clamp` sebagai peningkatan bertahap ([MDN](https://developer.mozilla.org/docs/Web/CSS/line-clamp), [Bugzilla 1540681](https://bugzilla.mozilla.org/show_bug.cgi?id=1540681)).
   - Teks di tekstur kanvas tetap tajam kalau kanvas digambar dengan resolusi lebih tinggi dari ukuran tampil, ditambah anisotropi maksimum renderer ([forum three.js](https://discourse.threejs.org/t/why-doesnt-my-canvas-texture-look-crisper-and-accurate-when-i-zoom-it/46122)). Badge dibuat 2× (512 × 112), dan tampilannya tetap sama dengan v1.
   - Teks yang dipotong (clamp, "+N") sebaiknya tetap utuh di DOM atau tersedia lewat nama aksesibel ([Chrome, single-line overflow](https://developer.chrome.com/docs/modern-web-guidance/guides/ui-atoms/single-line-overflow)). Nama tautan kotak akan memuat daftar bidang usaha lengkap, termasuk yang tersembunyi di "+N".
   - Kontras warna ikon aplikasi di lingkaran putih 4,14–5,25:1, lulus 3:1 untuk WCAG 1.4.11. Teks ringkasan di `#F1F1F5` 7,59:1 dan label "Cocok untuk" 5,81:1.
4. **Kotak meja di HP:** pada 390 px, 6 kotak satu baris hanya sekitar 55 × 64 px dan badge tidak terbaca. Diputuskan user 13 Nov: HP memakai dua baris (lihat 3).

## 3. Keputusan (user, 13 Nov 2026)

| # | Topik | Keputusan |
| --- | --- | --- |
| 15 | Bentuk etalase | Ikuti v1 13 Nov persis: markup, CSS dan pass rak 3D dibangun ulang, diukur terhadap acuan baru. Termasuk judul etalase sesuai COPY v1 |
| 16 | Slot dekor | Dihapus, ikut artefak |
| 17 | Kotak di meja | Proporsi dan badge ikut artefak. Desktop dan tablet satu baris. **HP (≤ 760 px) dua baris.** Selisih dari v1 yang dicatat untuk Heru |
| 18 | Commit | Tidak ada commit sebelum revisi. Revisi dikerjakan di working tree yang sama |

Keputusan pakai default (bisa dikoreksi saat review):
- EN: "Cocok untuk" menjadi "Good for", "Semua bidang usaha" menjadi "All industries". Label status EN tetap "In use" / "Ready to build", termasuk di badge 3D (tekstur per bahasa). Draf direview user seperti keputusan 11.
- Dokumen VISUAL/LOGIKA/COPY v1 adalah salinan dari user, jadi tidak diedit. Acuan baru ditulis di bagian 5 dokumen ini, dan `compare.mjs` membaca bagian itu untuk tabel yang berubah.
- Pagination Cari 6 per halaman (keputusan 13) tetap.

## 4. Lingkup

**Masuk:** blok etalase `/solusi` dan `/en/solutions` (judul, frame, tier, track, kotak, panah, `no3d`), `lib/solusi/tiers.ts`, data ikon/warna aplikasi, pass rak 3D (`world/solusi/rak.ts`), kotak di meja dan layout tag (`world/solusi/kotak.ts`), ringkasan yang posisinya bergantung kotak, alat ukur dan QA.

**Tidak masuk:** hero, struk Cari, Kartu masalah, kontak, halaman hasil, detail dan cerita Order Grup. Selisih S2 di luar etalase yang ditemukan pengukuran R5 dicatat sebagai daftar untuk diputuskan, tidak diperbaiki diam-diam.

## 5. Acuan baru (prototipe 13 Nov, 11 viewport)

Diukur dengan `tools/solusi/measure.mjs` (RNG 0, reduced motion, font siap). Ukuran dalam px CSS.

| Viewport | `.pk` | `.cover` | Satu tier | Frame | Pusat tag x (6 hasil) / y |
| --- | --- | --- | --- | --- | --- |
| 1920×1080 | 216×305 | 196×211 | 1240×353 | 1240×2481 | 575 729 883 1037 1191 1345 / 493 |
| 1440×900 | 216×305 | 196×211 | 1240×353 | 1240×2481 | 399 527 656 784 913 1041 / 411 |
| 1280×800 | 216×305 | 196×211 | 1216×353 | 1216×2481 | 355 469 583 697 811 926 / 366 |
| 1180×820 | 216×305 | 196×211 | 1116×353 | 1116×2481 | 297 414 532 649 766 883 / 375 |
| 1024×1366 | 216×305 | 196×211 | 960×353 | 960×2481 | 147 293 439 585 731 877 / 677 |
| 820×1180 | 216×305 | 196×211 | 756×353 | 756×2481 | 118 235 352 468 585 702 / 595 |
| 768×1024 | 216×305 | 196×211 | 704×353 | 704×2481 | 110 220 329 439 548 658 / 507 |
| 414×896 | 216×305 | 196×211 | 394×349 | 394×2453 | 42 108 174 240 306 372 / 442 |
| 390×844 | 216×305 | 196×211 | 370×349 | 370×2453 | 41 102 164 226 288 349 / 417 |
| 375×812 | 216×305 | 196×211 | 355×349 | 355×2453 | 40 99 158 217 276 335 / 402 |
| 360×740 | 216×305 | 196×211 | 340×349 | 340×2453 | 39 95 152 208 265 321 / 363 |

Tag 1–5 hasil, font dan posisi dalam sampul ikut disimpan sebagai fixture JSON di R0. Baris HP berlaku untuk etalase. Tag HP tidak dibandingkan dengan tabel ini karena keputusan 17. Cek HP: tag tidak bertumpuk, semua di dalam layar, dan kotak minimal 1,6× luas versi satu baris.

## 6. Tahapan

_Status: ⬜ belum · 🟡 berjalan · ✅ selesai._ Berhenti untuk review di akhir R2 dan R5. Screenshot hanya di chat.

| # | Tahap | Status |
| --- | --- | --- |
| R0 | Acuan dan alat ukur | ✅ fixture, `compare.mjs` dan `measure.mjs --site` selesai 13 Nov; prototipe ulang 2.497 cek lulus |
| R1 | Data, copy dan logika | ✅ 13 tes lulus |
| R2 | Etalase HTML dan `no3d` | ✅ disetujui 13 Nov; 924 cek ukur etalase situs lulus |
| R3 | Rak 3D | ✅ disetujui 13 Nov; sampel piksel vs v1 selisih maks. 10/255 |
| R4 | Kotak di meja, badge, layout HP dua baris | ✅ disetujui 14 Nov (greybox HP apa adanya, `PHONE_BACK_LIFT` 0); 178 cek lulus |
| R5 | QA dan review | ✅ disetujui 14 Nov; QA 114/114, regresi S2/S5/S6 dan build lulus |

### R0. Acuan dan alat ukur
1. Simpan hasil ukur prototipe 13 Nov sebagai fixture `tools/solusi/fixtures/etalase-2026-11-13.json`, berisi angka saja, tanpa screenshot.
2. `compare.mjs`: tabel VISUAL 8 dan 7.5 diganti fixture ini. Tabel lain tetap dari VISUAL.
3. `measure.mjs --site <url>`: peta selector v1 ke situs, supaya etalase situs bisa diukur dengan alat yang sama. Selector situs dibuat mengikuti v1 (`.prod`, `.pk`, `.cover`, `.track`, `.tier`), jadi petanya minimal.
4. Cek ulang selisih band 1920×1080 (6,2 px) dengan dua pengukuran. **Hasil 13 Nov:** tiga pengukuran sama, 162,78 px di 1920×1080 (sesuai VISUAL). Selisih sebelumnya berasal dari pembacaan kolom tabel VISUAL 8 oleh `compare.mjs` (nilai 156,9 adalah kolom 1024×1366), bukan perubahan band. Tabel 8 kini diganti fixture.

### R1. Data, copy dan logika
1. `lib/solusi/tiers.ts`: hapus `PER_TIER` dan `decorations`. Urutan tier tetap (jumlah solusi menurun, "Sudah berjalan" dulu).
2. `content/solusi/taksonomi.ts`: warna per aplikasi (`#128C7E`, `#1E8E3E`, `#C2307A`, `#D93025`, `#1A73E8`, `#A86F00`). Ikon bidang usaha sudah ada (Storefront, FirstAid, Buildings, Truck, Handshake, GlobeSimple), sama dengan v1.
3. Messages ID/EN:
   - Judul etalase "Pilih solusi sesuai kebutuhan bisnis Anda" (COPY v1 `shelf.title`).
   - `catalog.fitFor` dan `catalog.allIndustries` baru.
   - Eyebrow dan paragraf etalase yang tidak ada di v1 dihapus, beserta kunci yang tidak terpakai.
4. Tes `node:test`: tier tanpa dekor (7 tier, jumlah per tier), fungsi chip (semua bidang menjadi satu chip).

### R2. Etalase HTML dan `no3d`
1. Markup per kotak mengikuti v1: `a.prod > .pk > .st + .cover(.ttl, .sub, .fit > small + .chips) + .apps`. Tautan berisi judul yang terlihat, ditambah teks `sr-only` berisi status, daftar bidang usaha lengkap dan aplikasi. "Lihat detail" dihapus.
2. CSS di `toko.css` mengikuti artefak:
   - Track 216 dan panah `top: calc(20px + 152px)`.
   - Focus-visible pada sampul, hover dan fokus naik 6 px 200 ms.
   - `line-clamp` berprefix plus tanpa prefix.
   - Gaya `no3d` (kotak warna tim radius 6, sampul `#F1F1F5`).
   - Gaya lama `.solution-box`/`.decor-box` dihapus.
3. Klip chip "+N": komponen client kecil yang mengukur ulang setelah `document.fonts.ready`, saat resize dan saat ganti bahasa. Logikanya sama dengan `clampChips` v1.
4. Cek: `measure.mjs --site` terhadap fixture (±1 px kotak, ±0,5 px font) di 11 viewport, `no3d` dan reduced motion. **Berhenti untuk review** dengan screenshot situs berdampingan dengan v1.

### R3. Rak 3D
1. `rak.ts`: radius kotak 6, panel `#F1F1F5` radius 10 diposisikan dari rect `.cover` (memperbaiki panel yang tidak sejajar), instanced dekor dihapus, bayangan kontak per v1.
2. Hover dan fokus: kotak 3D dan bayangan mengikuti transform `.pk` (naik 6 px, bayangan mengecil 25%).
3. Cek: selisih posisi kotak 3D terhadap rect HTML ≤ 0,5 px, draw call etalase ≤ v1 + 1, scroll rak HP tanpa jank, console bersih.

### R4. Kotak di meja, badge, layout HP dua baris
1. `kotak.ts`: geometri 0,5 × 0,706 × 0,148 radius 0,014. Panel putih diganti badge status dari tekstur kanvas 512 × 112, satu material per status per bahasa, digambar ulang setelah font Plus Jakarta Sans siap, anisotropi maksimum.
2. Layout desktop dan tablet: satu baris, jarak 0,09, skala `max(0,3, min(0,9, ...))` seperti v1.
3. Layout HP (≤ 760 px, keputusan 17): dua baris 3 + 3 (4–5 hasil: 3 + sisanya), dengan skala dihitung dari lebar tiga kotak. Baris belakang diangkat dan digeser setengah langkah supaya badge dan sisi atas tetap terlihat. **Greybox dulu**: screenshot 4, 5 dan 6 hasil di 414, 390, 375 dan 360 px, lalu angkanya disetujui sebelum dipoles.
4. Tag dan ringkasan mengikuti layout baru. Relayout tetap 250 ms setelah resize, dan pindah layout terjadi saat melewati batas 760 px.

### R5. QA dan review
1. Port skenario uji perilaku 13 Nov (`scratchpad/qa/behave.mjs`) ke `tools/solusi/etalase-qa.mjs` untuk situs:
   - hover/fokus kotak HTML dan 3D, panah, drag, klik ke detail, Back;
   - kontak dari empat pemicu;
   - Cari (kosong, kata kunci 1–5, pagination 7–12, tag tidak bertumpuk, ringkasan hover/tap, Esc/X);
   - Kartu (bidang, swipe, panah, atas, hasil, Ulangi, Kembali);
   - "+N", ID/EN, console.
2. Perbarui ekspektasi `s2-qa.mjs` dan `s5-final.mjs` (ukuran kotak, satu/dua baris), lalu jalankan regresi S6 (`s6-og4.mjs`) karena halaman detail memakai kontak dan route yang sama.
3. `measure.mjs --site` seluruh halaman di 11 viewport. Selisih di luar etalase dilaporkan sebagai daftar, tanpa diperbaiki.
4. Aksesibilitas: axe, nama tautan kotak, fokus, kontras. Reduced motion, tanpa WebGL. Anggaran draw call dan segitiga. `typecheck`, `lint`, `format:check`, `build`.
5. **Review user** dengan screenshot desktop, tablet dan HP berdampingan dengan v1, ditambah video pendek Cari di HP.

**Selesai bila** etalase situs cocok dengan fixture dalam toleransi, kotak di meja sesuai keputusan 17, semua skenario QA lulus, dan user menyetujui.

## 7. Risiko

| Risiko | Akibat | Mitigasi |
| --- | --- | --- |
| Kotak tegak dua baris di HP saling menutupi | Badge dan kotak belakang tidak terlihat | Greybox R4.3 dengan screenshot sebelum dipoles; baris belakang diangkat |
| Etalase jauh lebih panjang (± 2.450 px di HP) | Scroll panjang sebelum band dan footer | Sesuai artefak; dilaporkan di review |
| Rak setengah kosong di desktop tanpa dekor | Kesan kosong | Sesuai keputusan 16; dicatat untuk Heru |
| Klip chip bergantung font | "+N" salah sebelum font siap | Ukur ulang setelah `fonts.ready` dan resize, seperti v1 |
| Ekspektasi tes S2/S5 lama | Regresi palsu | Ekspektasi diperbarui di R5 dengan acuan fixture, bukan dilonggarkan |
| Label badge EN lebih panjang | Teks keluar dari pil | Lebar pil dihitung dari `measureText` per label |

## 8. Hasil R5 (14 Nov 2026)

Semua cek dijalankan pada build produksi (`npm run build`, `site-prod` port 3100) dengan Playwright Edge GPU. Screenshot dan video hanya di chat.

| Cek | Hasil |
| --- | --- |
| `tools/solusi/etalase-qa.mjs` (baru) | 114/114 lulus. Desktop 1440, tablet 820, HP 390, ID dan EN. Isinya: etalase dan rak 3D, hover/fokus 6 px, nama tautan, panah, rak HP, klik ke detail dan Back, chip "+N" (dipaksa lewat chip yang dilebarkan), pop up kontak, Cari (6 kotak, 1/2 baris, tag, ringkasan, halaman 7–12, kata kunci 1–5), Kartu (geser, tombol, panah, panah atas, hasil, Ulangi, Kembali), reduced motion, tanpa WebGL, anggaran, axe |
| Regresi | S2 51/51, S5 122/122 (acuan tag kini fixture 13 Nov; HP dicek baris, jarak dan batas layar), S6 greybox 39/39, OG3 21/21, OG4 47/47 |
| Ukur etalase | `measure.mjs --site` + `compare.mjs --scope etalase`: 924 cek di 11 viewport, 0 selisih (R2) |
| Tag meja | 178 cek di 11 viewport (R4) |
| Anggaran | Etalase dan 6 kotak di meja < 60 draw call dan < 80 ribu segitiga di semua viewport yang dites |
| Kode | TypeScript, ESLint, Prettier, 13 tes `node:test`, `next build` (54 halaman) lulus |

Perbaikan selama R5:
- Tombol tag nomor di meja kini bernama "1. {judul}, lihat ringkasan" (EN "see summary"), seperti v1. Sebelumnya nama aksesibel hanya judul, sehingga tidak memuat angka yang terlihat (WCAG 2.5.3, axe `label-content-name-mismatch`).
- `etalase-qa.mjs` menilai kontras rak dan hero di mode tanpa WebGL. Di mode 3D latar keduanya digambar di kanvas yang tidak terbaca axe, sehingga axe membandingkan dengan CSS transparan di belakangnya (misalnya teks navy di `#2a2f6b`). Tanpa WebGL: 0 pelanggaran kontras.

Temuan di luar lingkup (tidak diubah):
- Pemilih bahasa ID/EN di header seluruh situs: label terlihat "ID"/"EN", nama aksesibel "Bahasa Indonesia"/"English" (axe `label-content-name-mismatch`). Berlaku juga di Home.

### 8.1 Selisih situs dari v1 di luar etalase (warisan S2, untuk diputuskan)

Diambil dari screenshot v1 dan situs berdampingan (1440×900 dan 390×844). Keputusan 12 (4 Nov) berbunyi "ikut v1 semua", jadi selisih ini perlu diputuskan: disamakan dengan v1, atau dipertahankan dan dicatat.

| # | Bagian | v1 13 Nov | Situs sekarang |
| --- | --- | --- | --- |
| 1 | Copy hero | Eyebrow "SOLUSI", H1 "Solusi AI untuk pekerjaan berulang di bisnis Anda", paragraf "Cari solusi yang Anda butuhkan, atau ceritakan masalahnya lewat kartu. Kasir kami siap mengambilkannya." | "ETALASE SOLUSI", H1 "Masalah berulang punya jalan keluar.", paragraf lain |
| 1a | Ukuran judul hero | `clamp(2.4rem, 4.6vw, 4.1rem)` | **Disamakan 14 Nov** atas permintaan user: sebelumnya `clamp(3.4rem, 6.4vw, 6.7rem)` di kolom ±430 px membuat judul 5 baris dan memotong isi hero mulai 1366 px (39–85 px melewati hero, tombol tertutup etalase). Copy dan tombol belum diubah |
| 2 | Tombol hero | "Cari solusi" ungu dengan ikon kaca pembesar, "Kartu masalah" putih, berdampingan | "Cari dari masalah Anda" navy dan "Cocokkan lewat kartu" putih, bertumpuk |
| 3 | Hero di HP | Copy di kartu TV gelap di atas stage | Teks langsung di atas stage |
| 4 | Band | "Masalah Anda belum ada di etalase?" + "Konsultasi gratis" | Judul dan tombol lain (Mulai Cari, Kartu) |
| 5 | Mode Cari/Kartu | Ruang 3D tetap terang; tombol "Kembali ke etalase" di kiri atas | Lapisan putih menutupi dunia; tombol X bulat di kanan atas |
| 6 | Struk Cari | Label "CARI SOLUSI", input dengan bingkai ungu saat aktif, 4 select tanpa label ("Semua bidang usaha", dst.), tombol ungu "Ambilkan solusinya" | Label "MASALAH ATAU PEKERJAAN", 4 select berlabel dengan opsi "Semua", tombol navy "Cari solusi" huruf mono, tepi bawah bergerigi |
| 7 | Bar hasil Cari | "Cari kembali" dan "Belum dapat solusi" (membuka kontak) | Jumlah dan rentang hasil + "Cari kembali"; **"Belum dapat solusi" tidak ada**. Pagination adalah keputusan 13 |
| 8 | Pop up kontak | Kartu di tengah, judul "Konsultasi gratis", tiga kanal dengan ikon berwarna dan keterangan | Kartu di kiri atas, "Lanjutkan obrolan"; Instagram/Email nonaktif "Detail kanal menyusul" sampai kanal asli diisi |
| 9 | Kertas bidang usaha | "Usaha Anda bergerak di bidang apa?", tombol berikon, memilih langsung membagikan kartu, tautan "Lewati, pakai kartu umum" | Judul "Masalah mana yang terasa dekat?", tombol teks, tombol terpisah "Bagikan kartu", tanpa "Lewati" |
| 10 | Kartu masalah | Kartu dengan "RONDE 1 DARI 3 · APAKAH INI TERJADI?", chip bidang/tim, penanda Tidak (kiri), Ya (kanan), Solusi (atas) di sekitar kartu, progres "Kartu 1 dari 9" di kanan atas | Kartu besar dengan ID "K1" dan stempel "SOLUSI", tiga tombol di bawah, label ronde/kartu di atas |
| 11 | Halaman hasil | Breadcrumb, H1 tengah "Solusi yang paling cocok untuk usaha Anda", chip masalah, daftar ringkas, tombol "Konsultasi gratis / Ulangi / Kembali ke etalase", catatan "Pesan chat sudah berisi masalah yang Anda pilih." | "HASIL KARTU / Urutan solusi untuk Anda", kartu peringkat "01", struk "MASALAH YANG ANDA TANDAI", tombol "Ulangi Kartu" |
| 12 | Footer | Footer navy dengan catatan prototipe dan pilihan bahasa | Footer situs (catatan prototipe v1 memang tidak perlu ikut) |
| 13 | Header | Menu "Solusi" disorot | Menu tidak disorot; ada pemilih bahasa ID/EN (komponen seluruh situs) |
