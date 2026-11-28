# Detail Solusi: Carousel konten dari satu topik

Per 28 Nov 2026, **Baca dan Tonton ID/EN tersedia. N8 lulus QA browser 130/130. Review ditutup saat user meminta lanjut.**

Induk: [PLAN-SOLUSI](../../../PLAN-SOLUSI.md). Kontrak template, route, mesin, dan QA: [PLAN-DETAIL](PLAN-DETAIL.md). Dokumen ini hanya menjabarkan kebutuhan khusus `carousel-konten`.

Bagian 1–6 menyimpan rencana katalog awal 7 Nov. Alur yang berlaku untuk Tonton ada di bagian 7.

## 1. Identitas dan sumber

| Item | Nilai dari sumber |
|---|---|
| Slug | `carousel-konten` |
| Status layanan | Siap dibuat (bukan status pengerjaan website) |
| Route target | `/solusi/carousel-konten` dan `/en/solutions/carousel-konten` |
| Industri | Retail & F&B, Klinik |
| Tim | Marketing |
| Aplikasi | Instagram, Google Drive |
| Sumber konten | [COPY katalog bagian 19.9](../../SOLUSI-V1-COPY.md#199-carousel-konten) |
| Ringkasan | [COPY katalog bagian 15](../../SOLUSI-V1-COPY.md#15-ringkasan-pendek-di-kartu-ringkasan-ringkas-data-baru) |
| Referensi detail khusus | Belum diberikan; prototipe Order Grup hanya acuan template bersama |

Pertanyaan utama: **Bagaimana membuat carousel Instagram lebih cepat tanpa desainer?**

Jawaban dari sumber: Anda cukup mengirim satu topik. Isi slide ditulis dengan gaya bahasa brand Anda, diisi ke template desain milik Anda, lalu dikirim sebagai pratinjau untuk disetujui. Yang disetujui disimpan ke Google Drive dan siap diposting.

## 2. Lingkup HTML pertama

Gunakan hero/jawaban, ringkasan, masalah, langkah berikut, perbandingan, kecocokan, persiapan, aplikasi, FAQ, CTA kontekstual, dan solusi terkait dari template bersama. Konten lengkap tetap dibaca dari sumber bagian 19.9, bukan disalin menjadi sumber data kedua di plan.

Status layanan Siap dibuat: tampilkan sebagai usulan solusi. Jangan membuat klien, testimoni, atau hasil implementasi nyata. Section hasil hanya muncul bila jenis bukti dan labelnya telah disepakati.

Field tambahan template baru (`painsLead`, `built`, terjemahan EN, dan kutipan opsional) diaudit pada P0; buat draf hanya berdasarkan sumber lalu review. Jika belum tersedia, tandai kekurangannya. Kontak, SEO, fallback, dan navigasi mengikuti PLAN-DETAIL.

## 3. Alur yang sudah tersedia

Ini daftar langkah HTML dari katalog, **belum** storyboard atau keputusan jumlah adegan 3D.

| Langkah | Judul | Penjelasan |
|---|---|---|
| 1 | Anda mengirim topik | Satu kalimat sudah cukup. |
| 2 | Isi slide ditulis | Mengikuti gaya bahasa brand Anda. |
| 3 | Slide dibuat dari template | Memakai warna dan font brand Anda. |
| 4 | Anda menyetujui | Carousel yang disetujui siap diposting. |

Catatan khusus untuk review: Pisahkan draf, persetujuan, dan penerbitan. Copy katalog menyebut hitungan menit; review sebagai klaim waktu sebelum tayang, bukan dianggap jaminan otomatis.

## 4. Tahapan per solusi

| Tahap | Dependensi | Hasil dan syarat selesai | Status |
|---|---|---|---|
| P0 — Audit isi | S1, D0–D1 | Cocokkan data sumber, status layanan, klaim/contoh, field tambahan, sumber bukti dan draf ID/EN | Belum |
| P1 — Detail HTML | P0, D2 | Halaman lengkap memakai langkah HTML; review copy dan screenshot HP/tablet/desktop | Belum |
| P2 — QA detail | P1; kontrak uji D1–D2 | Checklist bersama lulus; route langsung, bahasa, Back/Forward, kontak, SEO dan tanpa JS diuji | Belum |
| P3 — Perluasan cerita opsional | Bahan khusus tersedia, P2, D3 | Susun storyboard, set, karakter, kamera, timing, fallback dan anggaran; review sebelum implementasi 3D | Belum direncanakan rinci |

Hasil P2 menjadi masukan D4 (regresi lintas solusi); P2 tidak menunggu D4 selesai. P3 bukan syarat menyelesaikan versi HTML. Halaman tidak menampilkan panggung kosong atau tombol Tonton yang belum punya tujuan. Jika cerita disetujui, rincikan fase greybox → koreografi → QA dalam dokumen ini tanpa menyalin ulang fondasi mesin.

## 5. Keputusan dan bahan yang belum ada

- Validasi isi layanan dan semua klaim khusus di bagian 2–3; tetapkan label contoh dan kebutuhan izin untuk data nyata.
- Review draf EN serta field baru template; jangan menganggap kunci yang disebut "ada" pada dokumen sumber sudah ada di repo ini.
- Belum ada prototipe/storyboard, daftar set/aktor, teks dunia, kamera maupun timing khusus `carousel-konten`. Jumlah adegan tidak diasumsikan sembilan seperti Order Grup.
- Jika akan memiliki cerita: selesaikan hubungan inline/Tonton sesuai induk, tujuan adegan, data fiktif yang dipakai, serta batas performa sebelum membangun set.
- Ikuti kebijakan solusi terkait yang disepakati bersama; override editorial harus berupa data eksplisit dengan slug valid.

## 6. Kriteria selesai dan log

- [ ] P0–P2 selesai dan checklist PLAN-DETAIL terpenuhi untuk ID/EN.
- [ ] Isi dan batas layanan sesuai sumber; contoh tidak berubah menjadi klaim hasil nyata.
- [ ] Cara kerja dapat dibaca tanpa 3D; CTA dan navigasi berfungsi.
- [ ] Review mencatat tanggal, screenshot, build/perangkat yang diuji, serta kekurangan yang masih terbuka.
- [ ] Status cerita dilaporkan terpisah: belum tersedia / direncanakan / berjalan / direview / selesai.

7 Nov 2026: subplan awal dibuat dari konten katalog atas permintaan pemisahan plan. Belum ada implementasi atau persetujuan storyboard baru.

24 Nov 2026 (S8 N1b): copy ID/EN ditulis ulang dari workflow nyata atau template n8n.io, status `ide`, klien contoh. Sumber, keputusan dan hasil di [PLAN-KATALOG-N8N](PLAN-KATALOG-N8N.md) bagian 11; cerita Tonton direncanakan di tahap S8 berikutnya.

## 7. N8 Carousel Konten

### 7.1 Riset 27 Nov 2026

- Audit N1b mencatat bahwa jadwal mengambil satu baris topik, menyiapkan folder dan bingkai yang memuat logo, warna serta footer, lalu membuat gambar per slide dan caption. Hasil dikirim ke folder dan grup Telegram sebelum baris diberi status `Pending Review`. N8 memakai catatan audit workflow privat tersebut dan menutup contoh pada status **Menunggu dicek**, sesuai Baca. [Audit N1b](PLAN-KATALOG-N8N.md#11-n1b-copy-baca-iden-7-halaman-lama-selesai-teknis-24-nov-menunggu-review)
- Halaman template 4028 tidak dapat dibuka ulang. Catatan audit dan unggahan penulisnya memberi konteks awal alur carousel. Template 22250 memperlihatkan satu bingkai sebagai acuan semua slide, dengan kerangka yang berisi pembuka, satu poin per slide, penutup, serta caption. Template 22321 memperlihatkan cara menyiapkan paket gambar berurutan dan caption untuk pemeriksaan tim. Untuk N8, kerangka ditampilkan terpisah dari hasil desain, lalu tim menerima satu paket draf. [Unggahan penulis template 4028](https://community.n8n.io/t/automated-ai-image-carousel-creation-instant-social-media-publishing/116830) · [Template 22250](https://n8n.io/workflows/22250-turn-articles-into-instagram-and-linkedin-carousels-with-genmagic-google-drive-and-google-sheets/) · [Template 22321](https://n8n.io/workflows/22321-create-reviewed-instagram-carousel-pngs-with-openai-and-bannerbear-v5/)
- Telegram dapat mengirim beberapa gambar sebagai satu kelompok dan Drive menyediakan operasi unggah file. Rancangan layar memperlihatkan pratinjau di grup marketing bersama caption serta rujukan ke folder yang memuat kelima slide. Copy Baca N1b sudah mencakup alur ini. [Dokumentasi Telegram n8n](https://docs.n8n.io/integrations/builtin/app-nodes/n8n-nodes-base.telegram/) · [Dokumentasi Drive n8n](https://docs.n8n.io/integrations/builtin/app-nodes/n8n-nodes-base.googledrive/file-operations)

### 7.2 Data contoh

- **Kopi Contoh**, brand kopi kemasan fiktif. Mira dari tim marketing mengisi baris **CR-028** dengan judul **3 cara seduh kopi di rumah**, jenis **Edukasi**, dan jumlah **5 slide**. Isi singkatnya meminta pengenalan cara seduh dari alat yang berbeda.
- Urutan isi adalah **3 cara seduh kopi di rumah** → **Kopi tubruk** (seduh langsung di gelas) → **French press** (seduh lalu tekan plunger) → **Pour-over** (tuang air lewat saringan kertas) → **Simpan untuk seduhan berikutnya**. Cerita memberi pengenalan singkat tanpa takaran atau waktu seduh. [Kopi tubruk](https://ottencoffee.co.id/majalah/es-kopi-tubruk-segar-cara-membuat-dan-tips-penyajian) · [French press](https://sca.coffee/s/best-practices-three-cup-french-press.pdf) · [Pour-over](https://www.hario-usa.com/blogs/recipes-and-more-from-friends/james-hoffmann-uitimate-v60-technique)
- Kelima kartu memakai logo teks Kopi Contoh, warna krem dan cokelat kopi, serta footer di posisi yang sama. Visual alat seduh dan judul berubah per kartu. Contoh caption, “Tubruk, french press, atau pour-over? Simpan panduan ini, lalu pilih cara seduhmu. #KopiRumah #SeduhKopi”
- Folder draf **CR-028** memuat lima slide berurutan dan caption. Grup marketing menerima pratinjau. Baris CR-028 berakhir pada status **Menunggu dicek**.

### 7.3 Rel dan adegan

Rel: isi topik → susun kerangka → pakai bingkai brand → buat lima slide → tulis caption → kirim draf untuk dicek.

| Adegan | Isi layar | Yang dipahami pengunjung |
|---|---|---|
| Sebelum | Mira membuka catatan isi, contoh desain, dan draf caption yang terpisah. | Satu carousel perlu menyatukan beberapa bahan. |
| Isi topik | Baris CR-028 memuat brief, jenis Edukasi, dan lima slide. | Tim cukup mengisi satu baris yang bisa diambil saat jadwal berjalan. |
| Susun kerangka | Lima judul muncul berurutan, dari pembuka sampai ajakan simpan. | Isi ditentukan sebelum hasil desain diperlihatkan. |
| Pakai bingkai brand | Bingkai krem dan cokelat memuat logo teks dan footer tetap. | Elemen brand diulang pada kelima slide. |
| Buat lima slide | Slide desain muncul berurutan dan terlihat sebagai satu rangkaian. | Setiap judul dan ilustrasi berubah dalam bingkai yang sama. |
| Tulis caption | Caption dan dua tagar tampil bersama topik yang sama. | Tim menerima teks posting bersama gambar. |
| Kirim draf untuk dicek | Drive berisi lima slide dan caption, Telegram menampilkan pratinjau, lalu tabel mencatat Menunggu dicek. | Tim tahu lokasi paket dan bahwa pemeriksaan masih perlu dilakukan. |
| Ringkasan | Tampilkan tiga kartu metrik contoh Baca, satu baris, tiga jenis konten, dan satu bingkai brand. | Pengunjung punya gambaran input dan bagian yang bisa dipakai ulang. |
| Konsultasi | Ajak pengunjung membawa topik, logo, dan contoh konten brand. | Pengunjung tahu apa yang bisa dibawa saat konsultasi. |

### 7.4 Implementasi dan QA setelah persetujuan

- Gunakan panggung HTML/CSS bersama dan GSAP yang dimuat saat mendekati viewport. Siapkan kartu visual contoh dengan bingkai lokal yang dapat dipakai ulang. Judul, isi slide, dan caption tersedia dalam ID/EN sebagai teks, termasuk ketika animasi dinonaktifkan.
- Uji lima viewport, urutan kelima slide, konsistensi bingkai, keterbacaan di HP, caption dan status akhir, keyboard, CTA, reduced motion, GSAP diblokir, regresi cerita dan etalase. Periksa juga ukuran modul animasi episode.
- 27 Nov 2026. Storyboard siap direview.
- User meminta “lanjutkan” setelah menerima storyboard. Implementasi N8 mengikuti alur yang diajukan.

### 7.5 Hasil implementasi (27 Nov 2026)

- Tonton ID/EN mengikuti CR-028 dari baris topik edukasi sampai menjadi paket lima slide dan satu caption. Kelima kartu memakai ukuran, logo, warna dan footer yang sama. Contoh Drive dan Telegram memperlihatkan penyerahan paket sebelum status berubah menjadi Menunggu dicek.
- Build produksi, TypeScript, ESLint, Prettier untuk berkas N8, dan tes logika 26/26 lulus. QA N8 lulus 130/130 tanpa error halaman. Uji mencakup lima viewport, gulir maju/mundur, urutan dan ukuran kartu, urutan penyerahan, keyboard, CTA, ID/EN, reduced motion, serta GSAP diblokir.
- Regresi sebelas cerita sebelumnya lulus 88/88 dan etalase lulus 114/114. Frame desktop dan viewport HP diperiksa secara visual. Modul animasi N8 berukuran 696 byte gzip dan dimuat saat cerita mendekati viewport. Bundle UI bersama berukuran 42.891 byte gzip.
- Pada 28 Nov user meminta lanjut setelah preview N8 tersedia. Review ditutup untuk melanjutkan N9. Tes HP fisik masih terbuka. [Preview ID](http://localhost:3319/solusi/carousel-konten#story-title) · [Preview EN](http://localhost:3319/en/solutions/carousel-konten#story-title)
