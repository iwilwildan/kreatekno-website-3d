# Detail Solusi: Order Grup

Tanggal: 8 Nov 2026. Status: **OG0–OG4 selesai teknis; QA pilot menunggu review final user**. 20 Nov 2026: **OG5 (cerita 3D diganti motion graphic pastel) selesai teknis, menunggu review user** (bagian 8).

Induk: [PLAN-SOLUSI](../../../PLAN-SOLUSI.md). Kontrak bersama: [PLAN-DETAIL](PLAN-DETAIL.md). Urutan kerja mengikuti induk; dokumen ini tidak memulai implementasi.

## 1. Identitas dan sumber

| Item                         | Nilai                                                                                                                                                           |
| ---------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Slug                         | `order-grup`                                                                                                                                                    |
| Judul                        | Order dari grup WhatsApp tercatat sendiri ke Google Sheets                                                                                                      |
| Status layanan dalam katalog | Sudah berjalan; status pengerjaan website tetap belum                                                                                                           |
| Route target                 | `/solusi/order-grup` dan `/en/solutions/order-grup`                                                                                                             |
| Tim / industri               | Operasional, Penjualan / Logistik, Retail & F&B                                                                                                                 |
| Aplikasi                     | WhatsApp, Google Sheets                                                                                                                                         |
| Prototipe                    | [Detail Solusi Order Grup Scroll](https://claude.ai/artifact/VBVY47Dr2AuRdz3YkBwwgC)                                                                            |
| Spesifikasi                  | [LOGIKA](../../SOLUSI-DETAIL-ORDER-GRUP-V1-LOGIKA.md), [VISUAL](../../SOLUSI-DETAIL-ORDER-GRUP-V1-VISUAL.md), [COPY](../../SOLUSI-DETAIL-ORDER-GRUP-V1-COPY.md) |
| Data katalog lama            | [COPY katalog bagian 19.1](../../SOLUSI-V1-COPY.md#191-order-grup)                                                                                              |

Dokumen sumber bertanggal 4 Nov; user menyerahkannya di chat 7 Nov. Salinan markdown disimpan persis. Artifact sudah ditinjau langsung: navigasi adegan, pemisahan data, status pengiriman, rekap malam, layout desktop/HP, dan modal kontak. HTML sumber artifact belum tersedia di repo; jangan menyebut `prototype/solusi-detail-order-grup-v1.html` sebagai file yang sudah ada.

## 2. Lingkup pilot

Target rencana: satu halaman detail ID/EN dengan cerita inline 9 adegan, konten HTML lengkap, kontak, solusi terkait, fallback dan reduced motion. Ini bukan kode otomasi WhatsApp/Sheets yang benar-benar memproses order; seluruh perjalanan di halaman adalah ilustrasi.

Prototipe memakai figur manusia sederhana, robot ungu, papan chat/tabel, mobil kurir dan rumah pemilik. Pilihan mempertahankan figur tersebut atau mengadaptasi karakter Home/ORB belum diputuskan untuk implementasi. Jangan mengganti diam-diam karena gaya yang berbeda akan memengaruhi komposisi, pose, dan anggaran.

Overlay Tonton lama belum otomatis dibatalkan. OG0 harus menyelesaikan hubungannya dengan inline sebelum ada implementasi cerita ganda. Untuk 11 solusi lain, konten dan storyboard Order Grup tidak diwariskan.

## 3. Konten HTML dan bukti

- Hero: judul, status/tim/industri/tanggal, pertanyaan dan jawaban ringkas, konsultasi dan kembali ke etalase.
- Cerita: pembuka, 9 kartu, rel, teks dunia HTML. Struktur isi berikutnya mengikuti template fondasi.
- Tambahan konten: `painsLead`, `built`, kutipan opsional, `cerita.intro`, `scenes`, `areas`, `world`; semua ID/EN. Angka hasil menggunakan data `metrics` yang sama di dunia dan bagian hasil.
- Contoh order utama: Bu Rina, 3 dus air mineral 600ml, Jl. Sudirman No. 12, transfer, nomor 0412. Contoh revisi "jadi 12 dus ya" merujuk order Toko Berkah yang berbeda; jangan menerapkannya ke Bu Rina.
- Angka contoh: 3 jam, sekitar 120 order/hari, 1 rekap/malam. Rekap satu hari: 118 masuk, 112 selesai, 6 menunggu, Rp14,2 jt. Label papan 66 order mewakili keadaan lebih awal. Putuskan konsistensi narasi; jangan menyatakan semuanya metrik terverifikasi.
- Kutipan pemilik dan data proyek diberi penanda contoh sesuai sumber sampai ada persetujuan data nyata. Frasa "disamarkan" tidak menggantikan penanda contoh.
- Solusi terkait prototipe (`rekap-penjualan`, `stok-menipis`) berbeda dari hasil rumus (`asisten-sop`, `stok-menipis`). Pilihan editorial vs algoritme dicatat di OG0.

## 4. Storyboard dari prototipe

Angka timing adalah baseline sumber, bukan jaminan hasil render repo. Scroll memilih adegan, lalu jam lokal memutar aksi; kembali ke adegan mengulang aksi. Tabel kamera lengkap tetap di LOGIKA 5.3; dimensi/set/anchor di VISUAL 9 agar tidak ada dua salinan angka yang menyimpang.

| # / ID usulan   | Fokus dan aksi                                                            | Keadaan akhir / yang harus diuji                                                          |
| --------------- | ------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------- |
| 1 `sebelum`     | Papan chat berantakan, 6 bubble, label terlewat, admin mengetik ulang     | Keadaan awal manual; gerak ambient mati saat reduced motion                               |
| 2 `pesan-masuk` | Pesan Andi membawa order Bu Rina; terbang ke papan pada 0,3–1,5 dtk       | Bubble utuh di slot, isi dapat dibaca                                                     |
| 3 `ai-membaca`  | Pesan masuk robot; 5 field muncul bertahap sekitar 1,4–2,74 dtk           | Pelanggan/barang/jumlah/alamat/bayar tepat; tidak ada data tersisa dari adegan sebelumnya |
| 4 `tersimpan`   | Field menuju tabel; baris 0412 muncul 1,35 dtk, penjelasan revisi 1,6 dtk | Order 0412 berstatus Baru, revisi tidak membuat order duplikat dalam narasi               |
| 5 `konfirmasi`  | Balasan Asisten Order terbang ke grup, label Tercatat muncul 1,6 dtk      | Nomor, pelanggan dan barang sama dengan tabel                                             |
| 6 `status`      | Bayu mengirim `kirim 0412`, mobil bergerak, lalu `selesai 0412`           | Baru → Dikirim (1,15 dtk) → Selesai (2,55 dtk); mundur ke adegan 4 mengembalikan Baru     |
| 7 `rekap`       | Langit malam, amplop menuju HP, rekap muncul sekitar 1,4–2 dtk            | 118 = 112 + 6, angka contoh terbaca; layar HP tidak terpotong                             |
| 8 `hasil`       | Angka naik pada 0,3–1,8 dtk, laptop ditutup, admin melayani               | 3/120/1 dengan label contoh; reduced motion langsung angka akhir                          |
| 9 `untuk-anda`  | Kamera membuka pandangan seluruh dunia, CTA pada kartu                    | Keadaan akhir lengkap walaupun langsung melompat dari adegan 1; CTA bisa diklik/keyboard  |

Lima area klik: grup → adegan 2, asisten → 3, tabel → 4, kurir → 6, rumah → 7. Rel HTML menyediakan akses setara tanpa raycast. Teks penting adalah konten HTML; teks laptop hanya dekorasi.

## 5. Penyesuaian yang perlu direview

| ID   | Temuan / pertanyaan keputusan                              | Usulan atau langkah pembuktian                                                                                                                |
| ---- | ---------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------- |
| OG-A | Inline vs Tonton overlay lama                              | Tentukan penggantian, koeksistensi dengan fungsi berbeda, atau pengembangan berikutnya; jangan menganggap lampiran membatalkan keputusan lama |
| OG-B | Figur/robot prototipe vs karakter Home/ORB                 | Setujui gaya dan peran sebelum greybox dikunci; jika berubah, ukur ulang komposisi/anggaran                                                   |
| OG-C | Tablet tegak 768–1024 px kurang ruang; teks HP kecil       | Uji layout bertumpuk untuk semua tablet tegak yang perlu, termasuk 1024 px; perbesar fokus teks atau sediakan bacaan HTML setara              |
| OG-D | CSS3D zoom dan node DOM dikelola React                     | Buktikan D3 pada navigate/unmount/zoom; jangan memindahkan node secara ad hoc                                                                 |
| OG-E | Tombol rel prototipe 19×28 px                              | Usulan hitbox ≥24×28 px, tetap muat di 360 px; titik visual boleh kecil                                                                       |
| OG-F | Teks rekap terpotong pada ukuran tertentu                  | Koreksi kamera/anchor pada adegan 7; toleransi lama tidak berlaku untuk bug yang sengaja diperbaiki                                           |
| OG-G | Label AI/asisten, warna platform, angka dan kutipan contoh | Review copy/brand; jangan mengubah sumber asli atau mengubah contoh menjadi klaim nyata                                                       |
| OG-H | Solusi terkait manual vs rumus                             | Pilih satu kebijakan; jika override, data eksplisit dan validasi slug, bukan hardcode di komponen                                             |
| OG-I | Semua CTA termasuk header memakai pesan detail             | Usulan ikuti prototipe dengan judul solusi; konfirmasi konsistensi komponen kontak bersama                                                    |
| OG-J | Bahan HTML sumber belum disimpan                           | Dapatkan ekspor sumber artifact sebelum port persis; bila membangun dari spesifikasi, catat pendekatan dan baseline yang tersedia             |

Poin-poin ini belum merupakan keputusan user. Pilihan yang berdampak pada desain disajikan bersama hasil audit/greybox konkret, bukan meminta persetujuan untuk setiap detail rutin.

## 6. Tahapan pilot

| Tahap                    | Dependensi                                              | Pekerjaan dan bukti selesai                                                                                                                      | Status                                                                                               |
| ------------------------ | ------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------ | ---------------------------------------------------------------------------------------------------- |
| OG0 — Bahan dan batas    | D0, sumber tersedia                                     | Verifikasi repo/ekspor artifact, selesaikan OG-A/B dan kebijakan konten, kunci anggaran serta daftar viewport; catat sumber keputusan            | Selesai teknis 8 Nov; artifact HTML tetap tidak tersedia, implementasi memakai tiga spesifikasi repo |
| OG1 — Detail HTML        | D1–D2, OG0                                              | Isi ID/EN, 9 kartu dan teks dunia, bagian hasil/contoh, CTA dan terkait; screenshot HP/desktop; alur bisa dipakai tanpa 3D                       | Selesai teknis 8 Nov                                                                                 |
| OG2 — Greybox dan kamera | OG1, kontrak D3                                         | Lima area, 9 framing, rig kamera; uji tablet tegak, header/rel, CSS3D/zoom dan keterbacaan; review sebelum material/gerak final                  | Selesai teknis 8 Nov; HTML overlay diuji, CSS3D final sengaja belum dikunci                          |
| OG3 — Koreografi         | OG2 direview; kontrak dan implementasi awal D3 tersedia | Semua aksi tabel storyboard, siang/malam, label/tabel/rekap, lompatan maju/mundur dan input cepat; sekaligus memvalidasi D3; review rekaman alur | Disetujui user 8 Nov melalui “lanjut”; 21/21 cek koreografi lulus                                    |
| OG4 — QA pilot           | OG3, D3; checklist bersama                              | Fallback, reduced motion, lifecycle, route/bahasa/kontak, perangkat nyata, build dan anggaran; bukti serta review final                          | Selesai teknis 8 Nov; 47/47 cek lulus, perangkat fisik dan kanal kontak asli tetap batas prarilis    |

Hasil OG4 menjadi masukan D4; OG4 tidak menunggu regresi seluruh slug selesai.

Target performa awal mewarisi PLAN-DETAIL bagian 6; baseline sumber 61–114 draw call/±11–23 ribu segitiga. Material dan bayangan prototipe memakai NeutralToneMapping dan PCFShadowMap; jangan menerapkan preset etalase tanpa pengujian karena sumber keduanya berbeda.

## 7. Kriteria selesai khusus

- [ ] Checklist bersama PLAN-DETAIL terpenuhi; HTML dan cerita dilaporkan terpisah.
- [ ] Setiap order/field/nomor/status konsisten; contoh revisi tidak tertukar dengan order utama.
- [ ] Adegan 1 → 9 → 4 → 7 menghasilkan keadaan benar; masuk ulang memutar dari awal; submit kontak tidak mengganggu state.
- [ ] Font lambat, load chunk lambat/gagal, resize saat animasi, keluar route sebelum mount, context lost dan reduced motion tetap memberi pengalaman yang dapat dibaca.
- [ ] Teks penting setiap adegan terbaca; rekap tidak terpotong, kontrol rel dapat diketuk, kartu tidak menutup informasi utama.
- [ ] Angka/kutipan tetap berlabel contoh sampai bukti dan izin tersedia; CTA memakai kontak asli sebelum rilis.
- [ ] OG-A sampai OG-J ditutup dengan keputusan atau batas yang eksplisit; tidak ada persetujuan yang diasumsikan dari lampiran.
- [ ] Bukti akhir mencantumkan build, bahasa, ukuran layar, perangkat, performa dan tanggal review.

## 8. OG5 — Cerita motion graphic pastel (pengganti 3D)

Permintaan user 20 Nov 2026: bagian cerita 3D Order Grup diubah jadi motion graphic dengan warna pastel yang sama dengan 3D. Status: **plan disetujui 20 Nov ("Setuju, mulai"); implementasi selesai teknis, menunggu review user**.

### 8.1 Keputusan user (20 Nov)

| Topik | Keputusan |
| --- | --- |
| Mesin gerak | `gsap` 3.15.1 (rilis 4 Nov 2026) dari paket `gsap`. ScrollTrigger ternyata tidak dipakai (lihat 8.6). Tanpa Lenis, tanpa `@gsap/react`. Library baru ini dicatat di aturan 8 `CLAUDE.md` saat implementasi |
| Gaya | UI saja: bubble chat, balok data, tabel, chat kecil, notifikasi HP, kartu angka. Tanpa figur, robot, mobil, rumah |
| Gerak | Scrub mengikuti scroll (maju-mundur sesuai posisi scroll) |
| Layout | Tetap: panggung sticky + rel 9 langkah + kartu adegan yang di-scroll. Hanya isi panggung yang diganti |
| Malam | Adegan Rekap: latar panggung bergeser `#E9E4F8` → `#3B3F86`, kembali terang di Hasil |
| Area klik | Lima area 3D dibuang. Lompat adegan cukup lewat rel. Field `areas` dihapus dari schema |
| Kode 3D | `site/world/cerita/` dihapus (tetap ada di riwayat git). Label "greybox" dan pesan "tanpa 3D" dibuang |

Riset 20 Nov: GSAP gratis untuk pemakaian komersial (lisensi "no charge" GreenSock, bukan MIT), 3.15.1 adalah rilis stabil terbaru. CSS scroll-driven animation sudah Baseline (Firefox 159), tapi tidak dipilih karena timeline 9 adegan dengan angka naik dan pengukuran tinggi lebih mudah dijaga di GSAP. Gerak hanya `transform` dan `opacity` (plus `background-color` latar malam), dites di HP murah.

### 8.2 Palet (dari VISUAL 2.1–2.4, tidak ada warna baru)

| Elemen | Warna |
| --- | --- |
| Latar panggung siang / malam | `#E9E4F8` / `#3B3F86`, titik grid `#C5B8F0` |
| Kartu (chat, tabel, asisten, HP) | `#FFFFFF`, bayangan `0 18px 30px -18px rgba(19,25,81,.55)`, teks `--navy`, jam `--muted` |
| Bubble balasan sistem | `#E9FBF6`; bubble target ring `#9F0ED6` |
| Nama pengirim | warna peran VISUAL 2.2 (Sales `#3B6FE0`, Gudang `#B7800A`, CS `#C2307A`, Kurir `#C2560F`, Admin `#0E7F74`, Asisten `#9F0ED6`) |
| Balok data | Pelanggan `#EADCFD`, Barang `#D6F6FD`, Jumlah `#FFE2EE`, Alamat `#FFF1C9`, Bayar `#FBD9DF` |
| Status | Baru `#EADCFD`/`#5B1BB5`, Dikirim `#DDF0FF`/`#1D5FB8`, Selesai `#E1F4E8`/`#1C7A43` |
| Tabel | kepala `#2E9E5B`, garis `#E4E2EE`, baris baru `rgba(159,14,214,.08)` nomor `#9F0ED6` |
| Rekap | `#161B55`, kotak pesan putih, pengirim `#9F0ED6` |
| Pil merah / hijau / gold | `#B4233A` / `#1C7A43` / `#FFD983` |

Temuan VISUAL 16.6 (kepala grup `#12B5A6` dan tabel `#2E9E5B` mirip warna platform) tetap terbuka seperti di 3D; tidak diubah di OG5.

### 8.3 Adegan

| # | Adegan | Yang bergerak di panggung |
| --- | --- | --- |
| 1 | Sebelum | Chat grup terus bergulir (6 bubble acak), penghitung naik ke 120, pil merah "terlewat" muncul, kartu tabel admin miring dengan kursor mengetik ulang |
| 2 | Pesan masuk | Chat berhenti di pesan Bu Rina, bubble lain meredup, ring ungu |
| 3 | AI membaca | Chat bergeser keluar, kartu Asisten Order masuk, garis pindai, teks distabilo, lima balok data muncul berurutan |
| 4 | Tersimpan | Balok melipat jadi baris baru #0412 di tabel; contoh revisi "jadi 12 dus ya" mengubah baris order lain (bukan #0412) |
| 5 | Konfirmasi | Chat kecil di bawah tabel, balasan "Order #0412 tercatat." |
| 6 | Status | Balasan kurir "kirim 0412" lalu "selesai 0412", chip status Baru → Dikirim → Selesai |
| 7 | Rekap | Latar ke malam, HP pemilik naik, notifikasi 21.00 dengan baris rekap (angka contoh) |
| 8 | Hasil | Latar kembali terang, tiga kartu angka naik (label contoh) |
| 9 | Untuk Anda | Kartu angka tetap, diredupkan; CTA tetap di kartu adegan |

Pemetaan scroll: timeline punya label akhir tiap adegan. Saat kartu adegan i mencapai garis aktif yang sama dengan sekarang (56% tinggi layar, 70% di HP/tablet tegak), timeline tepat di akhir adegan i; di antara dua kartu, timeline di-scrub linear. Rel dan kartu aktif tetap memakai logika yang ada.

### 8.4 Perubahan file

- `site/package.json`: tambah `gsap` 3.15.1 (versi persis).
- `site/components/solusi/detail/CeritaScroll.tsx`: panggung jadi HTML motion graphic (server-render, teks dari konten), GSAP di-import dinamis saat cerita mendekati layar, ScrollTrigger dibersihkan saat unmount.
- File baru untuk timeline (mis. `site/components/solusi/detail/ceritaTimeline.ts`) dan gaya panggung di `detail.css`; gaya 3D lama (`story-world-host`, `no3d`, `greybox`) dihapus.
- `site/content/solusi/cerita/schema.ts` dan `order-grup.ts`: hapus `areas`; `world` diperluas dengan semua teks yang terlihat (6 pesan acak, penghitung, label balok, baris tabel, status, rekap, angka hasil) dalam ID dan EN. Teks yang dulu tertulis langsung di kode 3D (hanya ID) pindah ke konten.
- `site/content/solusi/detail-copy.ts` dan `SolutionDetail.tsx`: buang label `no3d`/`greybox`.
- Hapus `site/world/cerita/`. `tools/solusi/logic.test.mjs` disesuaikan (tanpa `areas`).

### 8.5 Cek

- Scrub maju-mundur, lompat lewat rel (1 → 9 → 4 → 7), resize di tengah adegan, keluar-masuk route (ScrollTrigger tidak bocor).
- Reduced motion: tanpa scrub, panggung langsung di pose akhir adegan aktif.
- GSAP gagal dimuat: panggung tetap menampilkan pose akhir adegan aktif (CSS statis), kartu teks tetap terbaca.
- Viewport 1440×900, 1024×1366 tegak, 390×844, 360×740; ID dan EN; tidak ada scroll ke samping; teks panggung tidak terpotong.
- Ukuran chunk cerita dibanding 3D (159.235 byte); FPS emulasi HP dan HP Android user.
- Typecheck, ESLint, Prettier, `logic.test.mjs`, `next build`. Screenshot hanya di chat.

### 8.6 Hasil implementasi (20 Nov)

- Panggung motion graphic: `site/components/solusi/detail/Panggung.tsx` (HTML server-render, teks dari konten), `ceritaFilm.ts` (timeline GSAP, 9 adegan), gaya `og-*` di `detail.css`. `CeritaScroll.tsx` memetakan scroll ke timeline dan memuat GSAP secara dinamis saat cerita mendekati layar.
- Pemetaan: adegan i mulai saat kartu i melewati garis aktif (56%, HP/tablet tegak 70%), dimainkan pada 65% pertama jalan ke kartu berikutnya, lalu ditahan. Adegan 1 dimainkan saat panggung masuk layar. Perpindahan dihaluskan 0,45 detik. ScrollTrigger tidak dipakai karena pemetaannya per kartu, yang sudah diukur oleh handler scroll yang ada; chunk jadi lebih kecil.
- Reduced motion: tanpa scrub, langsung pose akhir adegan aktif. GSAP gagal dimuat: CSS menampilkan pose akhir tiap adegan dari `data-scene`.
- Penyesuaian di luar tabel 8.4: label adegan aktif di panggung (`story-active-label`) dihapus karena kartu adegan sudah terlihat di samping/bawah panggung; panggung sticky di HP/tablet tegak naik dari 55svh ke 62svh supaya teks panggung terbaca (skala 0,77 di 390×844, sebelumnya 0,66).
- Konten: `stage` ID/EN menggantikan `areas` dan `world`; angka hasil memakai `metrics` solusi (satu sumber dengan bagian Hasil).
- Dihapus: `site/world/cerita/`, label `no3d`/`greybox`. Skrip QA lama `s6-og3.mjs`/`s6-og4.mjs` menguji 3D dan tidak berlaku lagi; QA baru `tools/solusi/og5-qa.mjs`.
- Dicek: `og5-qa.mjs` 87/87 lulus di dev dan build produksi (9 adegan maju dan lompat mundur di 1440×900, 1024×1366, 390×844, 360×740; malam di Rekap dan terang lagi di Hasil; reduced motion; GSAP diblokir; EN; tanpa scroll ke samping). Chunk cerita produksi 75.713 byte (28.753 gzip), sebelumnya 3D 159.235 byte. Typecheck, ESLint, Prettier, `logic.test.mjs` 13/13, `next build` lulus.
- Belum: FPS dan rasa scroll di HP Android user, review visual tim.

### 8.7 Revisi OG5b: satu order berjalan (disetujui 20 Nov, selesai teknis, menunggu review user)

Review user setelah OG5: desktop terlalu banyak ruang kosong tapi sekaligus terlalu banyak yang dibaca, kesan mockup UI, gerak terputus seperti ganti slide. Audit memakai skill `design-taste-frontend` menemukan hal yang sama, ditambah terlalu banyak warna (toska, hijau, ungu, 5 pastel, merah, kuning, navy) dan teks panggung 9-12 px di layar.

Keputusan user (20 Nov): arah "satu order berjalan"; desktop "panggung besar"; copy kartu adegan tetap (yang dipangkas hanya teks panggung); halaman detail masuk `sitemap.xml`.

Design read: halaman studi kasus solusi untuk pemilik usaha kecil-menengah, bahasa visual pastel ramah dengan ungu Kreatekno, scroll storytelling GSAP. Dial: variance 6, motion 6, density 3.

**Prinsip**

- Satu objek utama per adegan, dan objek itu berasal dari objek adegan sebelumnya (pesan → chip data → baris tabel → notifikasi → angka). Tidak ada objek yang hilang lalu diganti objek baru tanpa hubungan.
- Tanpa kerangka mockup: header grup, jam pesan, bingkai HP, kepala tabel berwarna dan label huruf kecil dibuang. Yang tersisa hanya data order.
- Warna: satu aksen ungu `#9F0ED6`, teks navy, objek putih di latar lilac `#E9E4F8`. Lima pastel hanya untuk chip data. Hijau `#1C7A43` hanya untuk status Selesai, merah `#B4233A` hanya untuk penanda "terlewat". Toska `#12B5A6` dan hijau tabel `#2E9E5B` hilang, sehingga temuan VISUAL 16.6 (warna mirip platform) ikut selesai.
- Ukuran desain: bubble 17 px, chip dan baris 15-16 px, angka hasil 64 px. Sudut: bubble dan kartu 20 px, chip dan status pil penuh.
- Panggung desktop mengisi sisa lebar sampai rel; skala kanvas maksimum naik 1,35 → 1,5; garis grid dekorasi dihapus. HP tetap 62svh.
- Posisi tujuan dihitung dari ukuran desain kanvas yang tetap (bukan GSAP Flip), jadi tidak perlu dibangun ulang saat resize.

**Storyboard (copy kartu tidak berubah)**

| # | Kartu | Yang bergerak |
| --- | --- | --- |
| 1 | Sebelum | Enam bubble pendek (≤ 5 kata) menumpuk dan terus bergulir, penghitung besar naik ke 120, satu pil merah "terlewat" |
| 2 | Pesan masuk | Bubble lain jatuh dan memudar; bubble Bu Rina pindah ke tengah dan membesar |
| 3 | AI membaca | Sapuan stabilo melewati bubble; lima kata data lepas dari bubble jadi lima chip pastel |
| 4 | Tersimpan | Chip terbang masuk ke slot baris tabel (3 baris, tanpa kepala berwarna), nomor #0412 muncul; di baris 0409 angka 10 berganti 12 dengan pil kecil "revisi" |
| 5 | Konfirmasi | Dari baris #0412 keluar bubble ungu "Order #0412 tercatat" |
| 6 | Status | Dua bubble kurir pendek ("kirim 0412", "selesai 0412"), pil status di baris berganti Baru → Dikirim → Selesai |
| 7 | Rekap | Latar meredup ke malam; tabel menyusut jadi satu kartu notifikasi "21.00 · Rekap order" dengan 4 angka besar |
| 8 | Hasil | Latar terang lagi; notifikasi pecah jadi tiga angka besar tanpa kartu (3 jam, 120 order, 1 pesan) + pil "angka contoh" |
| 9 | Untuk Anda | Angka tetap, diredupkan; CTA di kartu |

**SEO** (pertanyaan user): semua teks cerita sudah ada di HTML dari server, termasuk judul dan isi 9 kartu, FAQ JSON-LD dan canonical. Panggung tetap `aria-hidden` karena isinya mengulang kartu; teks yang dihitung Google adalah kartu dan bagian HTML lain. Celahnya: 12 halaman detail belum ada di `sitemap.xml` (TODO tahap 12/14). OG5b menambahkan 12 slug × ID/EN dengan hreflang di `site/app/sitemap.ts`.

**File**: `Panggung.tsx` (markup baru), `ceritaFilm.ts` (timeline baru), gaya `og-*` di `detail.css`, `content/solusi/cerita/{schema,order-grup}.ts` (teks panggung dipangkas, ID/EN), `app/sitemap.ts`, `tools/solusi/og5-qa.mjs` (selector baru).

**Cek**: `og5-qa.mjs` disesuaikan (9 adegan maju/mundur di 4 viewport, malam, reduced motion, GSAP diblokir, EN), sitemap berisi 24 URL detail, typecheck/ESLint/Prettier/`logic.test.mjs`/`next build`, screenshot 9 adegan desktop dan HP di chat.

### 8.8 OG5c: bingkai Tonton pastel (disetujui 20 Nov, selesai teknis, menunggu review user)

Masukan user: motion Tonton di artifact Carousel Konten (dibuat dengan skill `n8n-portfolio-prototype`, `claude.ai/artifact/QGp5VHHKeBm3MxPhbDAEcr`) sudah bagus; tinggal warna. Keputusan user 20 Nov: Order Grup dulu (Carousel Konten menyusul dengan pola yang sama); panggung pastel terang; tanpa tab Tonton/Baca; isi kanvas tetap "satu order berjalan" (OG5b); blok intro dipertahankan tanpa kotak putih.

**SEO (pertanyaan user).** Di artifact, 9 caption (judul + paragraf) dan studi kasus Baca ada di HTML, tapi panel Baca memakai atribut `hidden` dan artifact di claude.ai sendiri tidak diindeks. Di situs, panggung dirender server: caption adegan jadi `h3` + `p` di HTML (copy kartu sekarang, tidak berubah), bagian studi kasus tetap tampil di bawah tanpa tab. Caption yang belum aktif hanya disembunyikan dengan opacity/visibility, tetap ada di HTML. Paragraf caption tetap tampil di HP (template skill menyembunyikannya dengan `display:none`), karena Google memakai tampilan HP.

**Yang diambil dari artifact**

- Panggung sticky satu layar dengan grid: kolom caption kiri (≈38%), kanvas kanan (≈62%), rel workflow selebar kontainer di bawah, progress bar tipis di atas. Lebar dibatasi kontainer, sehingga di layar lebar kartu, kanvas dan rel sejajar (masalah layar 1897 px selesai).
- Caption per adegan: label kecil (eyebrow adegan), judul, paragraf; berganti dengan crossfade. Tombol sebelumnya/berikutnya + "n dari 9" di desktop.
- Rel workflow: 6 node langkah (Pesan masuk, AI membaca, Tersimpan, Konfirmasi, Status, Rekap; label dari `rail` adegan) dengan titik paket yang berjalan; node aktif bercincin, node selesai terisi. Node bisa diklik untuk lompat. Rel titik kanan dan kartu adegan yang di-scroll dihapus.
- HP dan tablet tegak: caption, kanvas, rel bertumpuk; rel hanya ikon + nama langkah aktif.

**Yang diubah dari artifact**

- Warna: latar lilac `#E9E4F8` dengan grid titik halus, teks navy, aksen ungu `#9F0ED6` (cyan diganti ungu), rel dan tombol putih transparan. Saat Rekap latar ke `#3B3F86` dan teks caption/rel berganti terang supaya kontras tetap terjaga.
- Mesin: `gsap` 3.15.1 yang sudah disetujui, tanpa Lenis dan tanpa ScrollTrigger (artifact memakai CDN 3.12.5 + Lenis). Posisi scroll di sepanjang reel dipetakan linear ke waktu timeline, seperti artifact.
- Caption dan rel dikendalikan state React (adegan aktif), bukan GSAP, jadi tetap berfungsi kalau GSAP gagal dimuat. Reduced motion: tanpa scrub, pose akhir adegan.
- Tanpa petunjuk roda mouse di panggung; "Gulir, sekitar 1 menit" sudah ada di intro.

**Intro**: teks sama, kotak putih dibuang, langsung di atas latar lilac.

**File**: `CeritaScroll.tsx` (struktur panggung baru), gaya `story-*` di `detail.css`, `detail-copy.ts` (label tombol sebelumnya/berikutnya ID/EN), `ceritaFilm.ts` (pemetaan waktu), `og5-qa.mjs`. Kanvas (`Panggung.tsx`) dan konten adegan tidak berubah.

**Cek**: QA 9 adegan maju/mundur di 4 viewport + 1897×940, lompat lewat node dan tombol, malam (kontras caption), reduced motion, GSAP diblokir, EN, tanpa scroll ke samping; screenshot di chat; typecheck/ESLint/Prettier/`next build`.

## 9. Log

- 7 Nov 2026: prototipe dan tiga dokumen dipelajari; subplan pilot disusun atas permintaan pemisahan plan. Dokumen sumber disalin tanpa perubahan. Belum membuat halaman/engine, belum mengukur performa repo, dan belum mengubah status persetujuan desain.
- 8 Nov 2026: OG0 menetapkan cerita inline sebagai pengalaman utama pilot; overlay Tonton lama tidak dibuat ganda dan tetap pengembangan tersendiri. Figur greybox abstrak dipakai tanpa mengunci gaya final. OG1 menambah copy ID/EN, sembilan kartu, label contoh, CTA detail dan terkait berbasis algoritme. OG2 menambah lima area kode-native, sembilan framing kamera, layout tablet tegak bertumpuk, rel minimum 24×28 px dan lazy WebGL. QA browser 39/39 lulus pada 1440, 1024 tegak, 390 dan 360 px; OG3 menunggu review user.
- 8 Nov 2026: user menyetujui checkpoint greybox melalui “lanjut”. OG3 menambah material/cahaya, CSS3D presentasional, bubble/field terbang, pembentukan tabel, konfirmasi, status Baru→Dikirim→Selesai, mobil kurir, langit malam, amplop/rekap, angka naik, laptop tertutup, hover/raycast lima area, pause/resume loop dan cleanup. QA `s6-og3.mjs` lulus 21/21; adegan 9 memakai 53 draw call/8.252 segitiga. OG4 belum dimulai.
- 8 Nov 2026: user menyetujui OG3 melalui “lanjut”. OG4 menyatukan fallback gagal chunk dan context lost, membatasi tunggu font 1,5 detik, menguji resize/reflow 200%, ID/EN/kontak/riwayat, tiga siklus lifecycle, serta benchmark emulasi HP 60 detik. `s6-og4.mjs` lulus 47/47; detail bukti di `REVIEW-S6-OG4.md`. Perangkat Android/iOS fisik dan suhu belum diuji; nomor WhatsApp, email, dan Instagram produksi belum dikonfigurasi.
- 20 Nov 2026: user meminta cerita 3D diganti motion graphic pastel. Keputusan dan plan OG5 ditulis di bagian 8. Belum ada kode yang diubah.
- 20 Nov 2026: user menyetujui plan OG5. Implementasi selesai teknis (bagian 8.6); QA 87/87, menunggu review user dan tes HP.
- 20 Nov 2026: review user atas OG5 (ruang kosong desktop, terlalu banyak teks, kesan mockup, gerak terputus). Rencana revisi OG5b ditulis di 8.7, menunggu persetujuan.
- 20 Nov 2026: user menyetujui OG5b ("Setuju, mulai"). Panggung baru: pesan → chip → baris tabel → balasan/status → notifikasi rekap → tiga angka; kerangka mockup dibuang, satu aksen ungu, skala maksimum 1,5. Konten panggung ID/EN dipangkas (bubble ≤ 5 kata, schema memeriksa urutan chip dan satu penanda terlewat). 24 URL detail masuk `sitemap.xml` (`solutionUrl` di `lib/seo.ts`). Perbaikan setelah cek visual: posisi bubble balasan/kurir (`position: relative` menimpa absolut), kolom barang dua baris, celah stabilo sebelum koma. `og5-qa.mjs` 87/87 di build produksi; chunk cerita 75.496 byte. Belum: tes HP user, review user.
- 20 Nov 2026: user menunjuk gaya Tonton artifact Carousel Konten sebagai acuan. Rencana OG5c (bingkai Tonton pastel untuk Order Grup) ditulis di 8.8, menunggu persetujuan.
- 20 Nov 2026: user menyetujui OG5c. Panggung Tonton pastel: reel 11 layar, caption `h3`+`p` per adegan (crossfade, state React), tombol sebelumnya/berikutnya, rel 6 node dengan paket, progress bar, malam di Rekap dengan teks terang; kartu adegan dan rel titik lama dihapus, intro tanpa kotak putih. Timing adegan dipindah ke `ceritaTiming.ts` (dipakai halaman, film dan QA). `og5-qa.mjs` 106/106 di build produksi (5 viewport termasuk 1897×940, node dan tombol, reduced motion, GSAP diblokir, EN). Belum: tes HP user, review user.
- 20 Nov 2026: judul bagian cerita jadi "Cara kerjanya" (pertanyaan solusi hanya di kotak jawaban hero); detail lain memakai "Langkah kerja" sebagai judul.
