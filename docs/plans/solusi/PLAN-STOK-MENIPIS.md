# Detail Solusi: Peringatan stok menipis sebelum habis

Per 28 Nov 2026, **Baca dan Tonton ID/EN tersedia. N10 lulus QA browser 137/137. Review ditutup saat user meminta lanjut.**

Induk: [PLAN-SOLUSI](../../../PLAN-SOLUSI.md). Kontrak template, route, mesin, dan QA: [PLAN-DETAIL](PLAN-DETAIL.md). Dokumen ini hanya menjabarkan kebutuhan khusus `stok-menipis`.

Bagian 1–6 menyimpan rencana katalog awal 7 Nov. Alur yang diusulkan untuk Tonton ada di bagian 7.

## 1. Identitas dan sumber

| Item | Nilai dari sumber |
|---|---|
| Slug | `stok-menipis` |
| Status layanan | Siap dibuat (bukan status pengerjaan website) |
| Route target | `/solusi/stok-menipis` dan `/en/solutions/stok-menipis` |
| Industri | Retail & F&B, Logistik |
| Tim | Operasional, Manajemen |
| Aplikasi | Google Sheets, WhatsApp |
| Sumber konten | [COPY katalog bagian 19.11](../../SOLUSI-V1-COPY.md#1911-stok-menipis) |
| Ringkasan | [COPY katalog bagian 15](../../SOLUSI-V1-COPY.md#15-ringkasan-pendek-di-kartu-ringkasan-ringkas-data-baru) |
| Referensi detail khusus | Belum diberikan; prototipe Order Grup hanya acuan template bersama |

Pertanyaan utama: **Bagaimana tahu stok akan habis sebelum terlambat memesan ulang?**

Jawaban dari sumber: Stok di tabel gudang dipantau setiap hari. Saat sebuah barang mendekati batas minimum, tim pembelian menerima pesan WhatsApp berisi barang, sisa stok, dan perkiraan kapan habis, sehingga pemesanan ulang bisa dilakukan sebelum stok kosong.

## 2. Lingkup HTML pertama

Gunakan hero/jawaban, ringkasan, masalah, langkah berikut, perbandingan, kecocokan, persiapan, aplikasi, FAQ, CTA kontekstual, dan solusi terkait dari template bersama. Konten lengkap tetap dibaca dari sumber bagian 19.11, bukan disalin menjadi sumber data kedua di plan.

Status layanan Siap dibuat: tampilkan sebagai usulan solusi. Jangan membuat klien, testimoni, atau hasil implementasi nyata. Section hasil hanya muncul bila jenis bukti dan labelnya telah disepakati.

Field tambahan template baru (`painsLead`, `built`, terjemahan EN, dan kutipan opsional) diaudit pada P0; buat draf hanya berdasarkan sumber lalu review. Jika belum tersedia, tandai kekurangannya. Kontak, SEO, fallback, dan navigasi mengikuti PLAN-DETAIL.

## 3. Alur yang sudah tersedia

Ini daftar langkah HTML dari katalog, **belum** storyboard atau keputusan jumlah adegan 3D.

| Langkah | Judul | Penjelasan |
|---|---|---|
| 1 | Stok tercatat | Di tabel gudang yang sudah dipakai. |
| 2 | Stok dipantau | Setiap hari, tanpa dicek manual. |
| 3 | Peringatan dikirim | Tim menerima pesan saat stok mendekati batas. |
| 4 | Tim memesan ulang | Sebelum barang benar-benar habis. |

Catatan khusus untuk review: Jelaskan ambang stok dan tindakan tim setelah peringatan. Jangan menambahkan pembelian otomatis atau jaminan tidak pernah kehabisan stok tanpa keputusan lingkup.

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
- Belum ada prototipe/storyboard, daftar set/aktor, teks dunia, kamera maupun timing khusus `stok-menipis`. Jumlah adegan tidak diasumsikan sembilan seperti Order Grup.
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

## 7. N10 Stok Menipis

### 7.1 Riset 28 Nov 2026

- Template 3979 mencatat pergerakan melalui form dan memeriksa jumlah yang sudah diperbarui. Pemeriksaan memicu peringatan saat jumlah **di bawah minimum**. Template memakai email. N10 memakai WhatsApp sesuai Baca dan memperlihatkan tiga isi pesan yang sudah disepakati: nama barang, stok tersisa, dan batas minimum. [Template 3979](https://n8n.io/workflows/3979-raw-materials-inventory-management-with-google-sheets-supabase-and-approvals/) · [Dokumentasi WhatsApp n8n](https://docs.n8n.io/integrations/builtin/app-nodes/n8n-nodes-base.whatsapp)
- Template 11055 memakai pesan suara untuk hitung fisik per lokasi rak. Itu mendukung opsi hitung berkala di Baca. Contoh N10 mengikuti satu transaksi barang keluar, pemesanan oleh staf pembelian, dan pencatatan barang masuk saat diterima. [Template 11055](https://n8n.io/workflows/11055-ai-warehouse-inventory-cycle-count-bot-using-gpt-telegram-and-google-sheets/)
- Template 18067 memberi pembanding untuk menghitung lama stok bertahan dari jumlah tersedia dan laju penjualan. N10 mengusulkan kartu **Rancangan** terpisah dari pesan WhatsApp. Kartu memakai rata-rata barang keluar selama tujuh hari terakhir dan mencantumkan asumsi laju yang sama. [Template 18067](https://n8n.io/workflows/18067-forecast-stockouts-and-draft-purchase-orders-with-gemini-sheets-slack-and-gmail/)

### 7.2 Data contoh

- **Bimo** mencatat pergerakan barang di toko grosir sembako contoh. **Rina** menangani pembelian. Produk **Minyak goreng 1 L**, kode **MG-01**, memiliki stok awal **24 karton** dan minimum **20 karton**.
- Bimo mencatat **8 karton keluar**. Tabel berubah dari **24 menjadi 16 karton**. Karena **16 < 20**, WhatsApp mengirim peringatan kepada Rina berisi **Minyak goreng 1 L**, **Sisa 16 karton**, dan **Minimum 20 karton**.
- Kartu **Rancangan** memakai contoh **56 karton keluar selama 7 hari**, rata-rata **8 karton per hari**. Dengan sisa **16 karton**, stok diperkirakan bertahan **sekitar 2 hari jika laju keluar tetap**. Kartu ditampilkan di adegan perbandingan stok dan minimum.
- Rina memilih jumlah lalu memesan **40 karton** ke pemasok. Tabel masih menunjukkan **16 karton** saat pesanan dibuat. Ketika 40 karton diterima, Bimo mencatat penerimaan. Tanpa mutasi lain dalam contoh, stok menjadi **56 karton**.

### 7.3 Rel dan adegan

Rel: catat barang keluar → perbarui stok → bandingkan minimum → peringatkan pembelian → staf memesan ulang → catat barang masuk.

| Adegan | Isi layar | Yang dipahami pengunjung |
|---|---|---|
| Sebelum | Bimo melihat catatan pengeluaran di samping tabel stok yang masih menyebut 24 karton. | Angka gudang perlu diperbarui saat barang bergerak. |
| Catat barang keluar | Form MG-01 menerima 8 karton keluar. | Staf mencatat barang dan jumlah dalam satu form. |
| Perbarui stok | Baris MG-01 berubah dari 24 menjadi 16 karton. | Tabel memakai jumlah yang tersisa setelah pengeluaran. |
| Bandingkan minimum | Tampilkan 16 karton di bawah garis minimum 20. Kartu Rancangan menunjukkan perkiraan 2 hari beserta rata-rata 7 hari. | Tim melihat alasan peringatan dan bisa membaca asumsi perkiraannya. |
| Peringatkan pembelian | WhatsApp untuk Rina menampilkan barang, sisa 16 karton, dan minimum 20. | Staf pembelian mendapat angka yang diperlukan untuk tindak lanjut. |
| Pesan ulang | Rina memilih 40 karton dan memesan. Tabel menunjukkan 16 karton dengan pesanan menunggu datang. | Jumlah dipesan dicatat terpisah dari stok yang tersedia. |
| Catat barang masuk | Setelah 40 karton diterima, Bimo mencatat barang masuk dan tabel menampilkan 56 karton. | Stok tersedia naik setelah penerimaan tercatat. |
| Ringkasan | Tiga kartu Baca menunjukkan satu batas per barang, tiga isi pesan, dan satu form pergerakan. | Tim melihat data yang diperlukan untuk menjalankan alur ini. |
| Konsultasi | Ajak pengunjung membawa tabel stok, batas minimum, dan nama penerima peringatan. | Pengunjung tahu bahan untuk memulai. |

### 7.4 Usulan penyesuaian Baca dan etalase

- Samakan pemicu di ID/EN. Ringkasan, jawaban pembuka, penjelasan Cara dibangun, dan langkah peringatan memakai “turun di bawah batas minimum” / “falls below the minimum”. Ringkasan etalase memakai aturan yang sama.
- Ganti copy hasil di detail dan etalase menjadi “Peringatan stok rendah untuk pesan ulang” / “Low-stock alerts for reordering”. Keputusan pembelian tetap dilakukan staf. Perkiraan dua hari tetap berlabel Rancangan.

### 7.5 Implementasi dan QA setelah persetujuan

- Gunakan panggung HTML/CSS dan GSAP yang dimuat saat diperlukan. Siapkan form pergerakan, tabel Sheets, penanda ambang, kartu Rancangan, peringatan WhatsApp, dan catatan pemesanan serta penerimaan.
- Uji aritmetika 24 − 8 = 16 dan 16 + 40 = 56, batas 20, perhitungan perkiraan, urutan pesan dan pesanan, serta stok yang masih 16 sebelum penerimaan. Jalankan QA ID/EN di lima viewport, cek keyboard, CTA, reduced motion, GSAP diblokir, regresi cerita dan etalase, serta ukuran modul animasi.
- 28 Nov 2026. Storyboard dan penyesuaian Baca siap direview.
- User meminta “lanjut” setelah menerima storyboard dan usulan copy Baca.

### 7.6 Hasil implementasi (28 Nov 2026)

- Tonton ID/EN mengikuti MG-01 dari 24 karton ke 16. Peringatan WhatsApp muncul saat stok di bawah minimum 20. Kartu Rancangan menampilkan sekitar dua hari berdasarkan laju keluar tujuh hari. Rina memesan 40 karton dan tabel naik ke 56 setelah Bimo mencatat barang diterima.
- Baca dan etalase ID/EN memakai pemicu di bawah minimum serta copy hasil yang berfokus pada peringatan untuk pemesanan ulang.
- Build produksi, TypeScript, ESLint, Prettier untuk berkas N10, dan tes logika 28/28 lulus. QA N10 lulus 137/137 tanpa error halaman pada lima viewport. Uji mencakup perhitungan stok, urutan peringatan dan penerimaan, copy detail dan etalase, gulir maju/mundur, keyboard, CTA, ID/EN, reduced motion, serta GSAP diblokir.
- Regresi tiga belas cerita sebelumnya lulus 104/104 dan etalase lulus 114/114. Frame desktop dan viewport HP diperiksa secara visual. Modul animasi N10 berukuran 749 byte gzip dan dimuat saat cerita mendekati viewport. Bundle UI bersama berukuran 47.491 byte gzip.
- User meminta lanjut setelah preview N10 tersedia. Review ditutup untuk melanjutkan N11. Tes HP fisik masih terbuka. [Preview ID](http://localhost:3321/solusi/stok-menipis#story-title) · [Preview EN](http://localhost:3321/en/solutions/stok-menipis#story-title)
