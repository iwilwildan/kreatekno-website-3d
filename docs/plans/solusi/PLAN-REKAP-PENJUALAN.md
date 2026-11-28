# Detail Solusi: Rekap penjualan harian tanpa hitung manual

Per 28 Nov 2026, **Baca dan Tonton ID/EN tersedia. N13 lulus QA browser 134/134 dan menunggu review hasil.**

Induk: [PLAN-SOLUSI](../../../PLAN-SOLUSI.md). Kontrak template, route, mesin, dan QA: [PLAN-DETAIL](PLAN-DETAIL.md). Dokumen ini hanya menjabarkan kebutuhan khusus `rekap-penjualan`.

Bagian 1–6 menyimpan rencana katalog awal 7 Nov. Alur yang diusulkan untuk Tonton ada di bagian 7.

## 1. Identitas dan sumber

| Item | Nilai dari sumber |
|---|---|
| Slug | `rekap-penjualan` |
| Status layanan | Siap dibuat (bukan status pengerjaan website) |
| Route target | `/solusi/rekap-penjualan` dan `/en/solutions/rekap-penjualan` |
| Industri | Retail & F&B, Logistik |
| Tim | Manajemen, Keuangan & admin |
| Aplikasi | Google Sheets, WhatsApp |
| Sumber konten | [COPY katalog bagian 19.7](../../SOLUSI-V1-COPY.md#197-rekap-penjualan) |
| Ringkasan | [COPY katalog bagian 15](../../SOLUSI-V1-COPY.md#15-ringkasan-pendek-di-kartu-ringkasan-ringkas-data-baru) |
| Referensi detail khusus | Belum diberikan; prototipe Order Grup hanya acuan template bersama |

Pertanyaan utama: **Bagaimana pemilik usaha menerima rekap penjualan setiap hari tanpa menghitung sendiri?**

Jawaban dari sumber: Data penjualan dari tabel yang sudah dipakai tim dirangkum setiap malam menjadi satu pesan WhatsApp untuk pemilik: total penjualan, produk terlaris, dan perbandingan dengan hari sebelumnya. Pemilik tidak perlu membuka laptop atau menunggu laporan admin.

## 2. Lingkup HTML pertama

Gunakan hero/jawaban, ringkasan, masalah, langkah berikut, perbandingan, kecocokan, persiapan, aplikasi, FAQ, CTA kontekstual, dan solusi terkait dari template bersama. Konten lengkap tetap dibaca dari sumber bagian 19.7, bukan disalin menjadi sumber data kedua di plan.

Status layanan Siap dibuat: tampilkan sebagai usulan solusi. Jangan membuat klien, testimoni, atau hasil implementasi nyata. Section hasil hanya muncul bila jenis bukti dan labelnya telah disepakati.

Field tambahan template baru (`painsLead`, `built`, terjemahan EN, dan kutipan opsional) diaudit pada P0; buat draf hanya berdasarkan sumber lalu review. Jika belum tersedia, tandai kekurangannya. Kontak, SEO, fallback, dan navigasi mengikuti PLAN-DETAIL.

## 3. Alur yang sudah tersedia

Ini daftar langkah HTML dari katalog, **belum** storyboard atau keputusan jumlah adegan 3D.

| Langkah | Judul | Penjelasan |
|---|---|---|
| 1 | Penjualan tercatat seperti biasa | Tim tetap memakai tabel atau catatan yang sudah ada. |
| 2 | Angka dirangkum | Total, produk terlaris, dan perbandingan harian disusun. |
| 3 | Rekap dikirim | Pemilik menerima satu pesan setiap malam. |
| 4 | Pemilik memutuskan | Keputusan stok dan promosi diambil dari angka hari itu. |

Catatan khusus untuk review: Definisikan sumber dan periode angka contoh, serta konsistensi total dan perbandingannya. Jangan memakai angka rekap Order Grup seolah data solusi ini.

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
- Belum ada prototipe/storyboard, daftar set/aktor, teks dunia, kamera maupun timing khusus `rekap-penjualan`. Jumlah adegan tidak diasumsikan sembilan seperti Order Grup.
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

## 7. N13 Rekap Penjualan

### 7.1 Riset 28 Nov 2026

- Template 6679 memakai tabel terstruktur untuk menjumlahkan dan membandingkan beberapa periode. Chat menerima masukan periode untuk membuat laporan. Template 13486 memperlihatkan rekap harian dari Sheets, pemilihan baris berdasarkan tanggal, total dan produk teratas, lalu pengiriman lewat WhatsApp. N13 memakai perbandingan **kemarin** dan **hari yang sama minggu lalu** sesuai Baca. [Template 6679](https://n8n.io/workflows/6679-generate-multi-period-financial-reports-from-google-sheets-with-ai-analysis/) · [Template 13486](https://n8n.io/workflows/13486-send-a-daily-sales-report-to-whatsapp-from-google-sheets-with-moltflow/)
- Hitung total, jumlah karton, dan selisih persentase dari tabel sebelum merangkai kalimat ringkasan. Peringkat produk dalam contoh memakai jumlah karton terjual. Jawaban lanjutan mencantumkan produk, periode, satuan, dan tabel sumber supaya angkanya bisa ditelusuri.
- Pemilik contoh sudah menyetujui penerimaan rekap lewat WhatsApp. Pesan terjadwal memakai template yang disetujui. Pertanyaan lanjutan datang dari pemilik dan dijawab dalam jendela layanan 24 jam. [Kebijakan WhatsApp Business](https://whatsappbusiness.com/policy/)

### 7.2 Data contoh

- **Bayu** mencatat penjualan dan **Nita** adalah pemilik distributor minuman contoh. Rekap mengambil catatan yang sudah masuk sampai **Kamis, 26 Nov 2026, pukul 21.00 WIB**. Empat baris di bawah merupakan nilai penjualan yang tercatat pada tanggal tersebut.

| Produk | Wilayah | Karton | Nilai tercatat |
|---|---|---:|---:|
| Teh melati 350 ml | Utara | 30 | Rp3.600.000 |
| Teh melati 350 ml | Selatan | 20 | Rp2.400.000 |
| Air mineral 600 ml | Utara | 40 | Rp3.200.000 |
| Sari jeruk 250 ml | Selatan | 20 | Rp2.800.000 |

- Total hari ini **Rp12.000.000**. Utara **Rp6.800.000**, Selatan **Rp5.200.000**. Teh melati terlaris dengan **50 karton**. Dibandingkan **Rabu, 25 Nov** dengan Rp10.000.000, nilai naik **20%**. Dibandingkan **Kamis, 19 Nov** dengan Rp15.000.000, nilai turun **20%**. Persentase memakai nilai periode pembanding sebagai penyebut.
- Nita menerima satu rekap dan bertanya, “Bulan lalu teh melati terjual berapa karton?” Jawabannya **240 karton pada Oktober 2026**, dari **Utara 140 karton** dan **Selatan 100 karton** di tab **Rekap produk Oktober**.

### 7.3 Rel dan adegan

Rel: baca tabel → jumlahkan penjualan → bandingkan periode → kirim rekap → pemilik bertanya → jawab dari tabel.

| Adegan | Isi layar | Yang dipahami pengunjung |
|---|---|---|
| Sebelum | Bayu masih mengumpulkan angka dari tabel saat Nita menunggu kabar. | Catatan penjualan menjadi sumber rekap. |
| Baca tabel | Empat baris 26 Nov masuk pemeriksaan 21.00 WIB. | Tim memakai tabel yang sudah digunakan. |
| Jumlahkan penjualan | Tampilkan Rp12 juta, wilayah Utara Rp6,8 juta dan Selatan Rp5,2 juta, serta Teh melati 50 karton sebagai produk terlaris. | Total dan peringkat punya dasar yang bisa diperiksa. |
| Bandingkan periode | Tampilkan Rp10 juta pada 25 Nov dan Rp15 juta pada 19 Nov, beserta perubahan +20% dan −20%. | Pemilik melihat dua pembanding dengan tanggal jelas. |
| Kirim rekap | Satu pesan WhatsApp merangkum total, produk terlaris, dan kedua perbandingan. | Pesan merangkum angka yang sudah dihitung. |
| Pemilik bertanya | Nita membalas dan menanyakan jumlah karton teh melati bulan lalu. | Pemilik bisa menelusuri detail dari chat. |
| Jawab dari tabel | Balasan menunjukkan Oktober 2026, jumlah 240 karton, rincian 140 dan 100, serta tab sumber. | Jawaban terkait dengan produk dan periode yang diminta. |
| Ringkasan | Tiga kartu contoh Baca menampilkan 21.00 WIB, dua pembanding, dan satu pesan. | Tim mengetahui jadwal dan isi rekap. |
| Konsultasi | Ajak pengunjung membawa tabel penjualan, angka yang ingin dipantau, dan jam rekap. | Pengunjung tahu bahan untuk menyiapkan alur. |

### 7.4 Usulan penyesuaian Baca

- Selaraskan FAQ WhatsApp ID/EN dengan N11. Pemilik menyetujui penerimaan rekap, pesan terjadwal memakai template yang disetujui, dan balasan bebas mengikuti jendela layanan 24 jam.
- Perjelas jawaban pembuka dan bagian Cara dibangun. Angka dihitung dari tabel sebelum AI menulis ringkasan, dan pertanyaan lanjutan dijawab dari periode yang tersedia di tabel. Jam contoh di ID/EN menunjukkan WIB.

### 7.5 Implementasi dan QA setelah persetujuan

- Gunakan panggung HTML/CSS dan GSAP yang dimuat saat diperlukan. Siapkan tabel data, panel total dan produk terlaris, pembanding berlabel tanggal, pesan malam, dan jawaban yang menyebut tabel sumber.
- Uji jumlah empat baris, pembagian wilayah, peringkat karton, tanggal pembanding, perubahan +20% dan −20%, serta jumlah bulanan 140 + 100. Jalankan QA lima viewport, ID/EN, keyboard, CTA, reduced motion, GSAP diblokir, regresi cerita dan etalase, serta cek ukuran modul.
- 28 Nov 2026. Storyboard dan penyesuaian Baca siap direview.
- User memilih “Setuju, implementasikan N13”.

### 7.6 Hasil implementasi (28 Nov 2026)

- Tonton ID/EN memperlihatkan empat baris sumber, total Rp12 juta, dua wilayah, dan Teh melati dengan 50 karton sebagai produk terlaris. Nita mendapat perbandingan +20% dengan Rabu dan −20% dengan Kamis sebelumnya. Balasan menyebut Oktober 2026, 240 karton, rincian dua wilayah, dan tab sumber.
- Baca ID/EN memperjelas perhitungan dari tabel, periode yang tersedia untuk pertanyaan lanjutan, jam contoh dalam WIB, serta izin pemilik, template, dan jendela layanan WhatsApp.
- Build produksi, TypeScript, ESLint, format berkas N13, dan tes logika 31/31 lulus. QA N13 lulus 134/134 tanpa error halaman di lima viewport. Uji mencakup sumber, jumlah dan persentase, periode, pesan rekap dan jawaban, keyboard, CTA, reduced motion, serta GSAP diblokir.
- Regresi enam belas cerita sebelumnya lulus 128/128, QA 12 detail S8 lulus 1.320/1.320, dan etalase lulus 114/114. Frame desktop dan viewport HP diperiksa secara visual. Modul animasi N13 berukuran 705 byte gzip dan dimuat saat cerita mendekati viewport. Bundle UI bersama berukuran 55.505 byte gzip.
- Review hasil dan tes HP fisik masih terbuka. [Preview ID](http://localhost:3324/solusi/rekap-penjualan#story-title) · [Preview EN](http://localhost:3324/en/solutions/rekap-penjualan#story-title)
