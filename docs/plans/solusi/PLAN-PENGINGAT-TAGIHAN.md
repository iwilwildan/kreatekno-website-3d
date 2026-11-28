# Detail Solusi: Tagihan jatuh tempo diingatkan otomatis

Per 28 Nov 2026, **Baca dan Tonton ID/EN tersedia. N11 lulus QA browser 135/135. Review ditutup saat user meminta lanjut.**

Induk: [PLAN-SOLUSI](../../../PLAN-SOLUSI.md). Kontrak template, route, mesin, dan QA: [PLAN-DETAIL](PLAN-DETAIL.md). Dokumen ini hanya menjabarkan kebutuhan khusus `pengingat-tagihan`.

Bagian 1–6 menyimpan rencana katalog awal 7 Nov. Alur yang diusulkan untuk Tonton ada di bagian 7.

## 1. Identitas dan sumber

| Item | Nilai dari sumber |
|---|---|
| Slug | `pengingat-tagihan` |
| Status layanan | Siap dibuat (bukan status pengerjaan website) |
| Route target | `/solusi/pengingat-tagihan` dan `/en/solutions/pengingat-tagihan` |
| Industri | Jasa, Properti, Logistik |
| Tim | Keuangan & admin |
| Aplikasi | WhatsApp, Google Sheets, Gmail |
| Sumber konten | [COPY katalog bagian 19.6](../../SOLUSI-V1-COPY.md#196-pengingat-tagihan) |
| Ringkasan | [COPY katalog bagian 15](../../SOLUSI-V1-COPY.md#15-ringkasan-pendek-di-kartu-ringkasan-ringkas-data-baru) |
| Referensi detail khusus | Belum diberikan; prototipe Order Grup hanya acuan template bersama |

Pertanyaan utama: **Bagaimana mengingatkan pelanggan soal tagihan tanpa terasa sungkan?**

Jawaban dari sumber: Pengingat tagihan dikirim ke pelanggan lewat WhatsApp atau email sebelum dan saat jatuh tempo, dengan bahasa yang sopan dan sesuai gaya usaha Anda. Status pembayaran diperbarui di Google Sheets, sehingga tim keuangan tahu siapa yang perlu dihubungi langsung.

## 2. Lingkup HTML pertama

Gunakan hero/jawaban, ringkasan, masalah, langkah berikut, perbandingan, kecocokan, persiapan, aplikasi, FAQ, CTA kontekstual, dan solusi terkait dari template bersama. Konten lengkap tetap dibaca dari sumber bagian 19.6, bukan disalin menjadi sumber data kedua di plan.

Status layanan Siap dibuat: tampilkan sebagai usulan solusi. Jangan membuat klien, testimoni, atau hasil implementasi nyata. Section hasil hanya muncul bila jenis bukti dan labelnya telah disepakati.

Field tambahan template baru (`painsLead`, `built`, terjemahan EN, dan kutipan opsional) diaudit pada P0; buat draf hanya berdasarkan sumber lalu review. Jika belum tersedia, tandai kekurangannya. Kontak, SEO, fallback, dan navigasi mengikuti PLAN-DETAIL.

## 3. Alur yang sudah tersedia

Ini daftar langkah HTML dari katalog, **belum** storyboard atau keputusan jumlah adegan 3D.

| Langkah | Judul | Penjelasan |
|---|---|---|
| 1 | Tagihan tercatat | Daftar tagihan dan jatuh tempo ada di Google Sheets. |
| 2 | Pengingat dikirim | Pelanggan menerima pengingat yang sopan sebelum jatuh tempo. |
| 3 | Status diperbarui | Tagihan yang sudah dibayar ditandai lunas. |
| 4 | Tim menindaklanjuti yang tersisa | Tim keuangan hanya menghubungi pelanggan yang belum membayar. |

Catatan khusus untuk review: Bedakan pengingat terkirim dengan pembayaran benar-benar diterima. Pesan pengingat dalam detail hanya ilustrasi, bukan mengirim pesan atau menagih pengguna.

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
- Belum ada prototipe/storyboard, daftar set/aktor, teks dunia, kamera maupun timing khusus `pengingat-tagihan`. Jumlah adegan tidak diasumsikan sembilan seperti Order Grup.
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

## 7. N11 Pengingat Tagihan

### 7.1 Riset 28 Nov 2026

- Template 14313 memeriksa tagihan setiap pagi pukul 07.00, memakai kecocokan hari untuk tahap pengingat, dan menyimpan riwayat per tahap. N11 mengikuti keputusan N1b untuk tiga pengingat pelanggan pada H-3, H, dan H+7. H+30 menjadi serah terima internal ke pemilik jika tagihan masih terbuka. [Template 14313](https://n8n.io/workflows/14313-send-multi-stage-overdue-invoice-reminders-with-nocodb-gmail-and-postgrid/) · [Keputusan N1b](PLAN-KATALOG-N8N.md#11-n1b-copy-baca-iden-7-halaman-lama-selesai-teknis-24-nov-menunggu-review)
- Tautan template 9879 tidak dapat dibuka ulang. Template 23185 memperlihatkan status pembayaran disimpan terpisah dari riwayat komunikasi, dan template 22171 memberi contoh log per tagihan dan tahap untuk mencegah pengingat ganda saat pemeriksaan diulang. N11 memperlihatkan status Lunas berasal dari pencatatan staf setelah pembayaran dikonfirmasi. [Template 23185](https://n8n.io/workflows/23185-send-stripe-pdf-invoices-and-recover-failed-payments-with-whatsapp-and-sheets/) · [Template 22171](https://n8n.io/workflows/22171-control-invoice-reminders-and-escalations-with-google-sheets-and-gmail/)
- Kebijakan WhatsApp mensyaratkan izin penerima serta template yang disetujui untuk pesan pembuka bisnis dan pengiriman di luar jendela layanan 24 jam. Pesan dalam cerita merupakan simulasi untuk pelanggan yang sudah menyetujui kanal itu. Petunjuk pembayaran merujuk ke invoice. [Kebijakan WhatsApp Business](https://whatsappbusiness.com/policy/)

### 7.2 Data contoh

- **Lia** menangani keuangan dan **Arif** adalah pemilik jasa servis AC kontrak bulanan contoh. **AC-028 · Ruko A · Rp450.000** dan **AC-029 · Ruko B · Rp600.000** sama-sama jatuh tempo **10 Nov 2026**. Tabel diperiksa setiap pagi pukul **07.00 WIB**, memakai zona waktu usaha contoh seperti di Baca. [Dokumentasi jadwal n8n](https://docs.n8n.io/integrations/builtin/core-nodes/n8n-nodes-base.scheduletrigger#timezone-settings)
- Untuk AC-028, **H-3 (7 Nov)** memberi tahu tanggal jatuh tempo, **H (10 Nov)** menyebut jatuh tempo hari ini, dan **H+7 (17 Nov)** mengingatkan bahwa tagihan masih tercatat terbuka. Setiap pesan menyebut nomor tagihan, jumlah, dan “Lihat petunjuk bayar di invoice”. Setelah setiap kiriman, tahap dan tanggal dicatat satu kali.
- Pada **18 Nov**, Lia mengonfirmasi pembayaran AC-028 lalu menandainya **Lunas**. Pemeriksaan berikutnya melewati AC-028. Pada **H+30 (10 Des)**, AC-029 masih terbuka sehingga catatannya diserahkan ke **Arif** untuk tindak lanjut langsung.

### 7.3 Rel dan adegan

Rel: cek tagihan terbuka → H-3 → hari jatuh tempo → H+7 → catat pembayaran → serahkan H+30.

| Adegan | Isi layar | Yang dipahami pengunjung |
|---|---|---|
| Sebelum | Lia mencari tagihan berikutnya dan riwayat pesan di tempat terpisah. | Tanggal dan riwayat per tagihan perlu terlihat dari satu tempat. |
| Cek pagi | Tabel menunjukkan AC-028 dan AC-029 yang masih terbuka. Jadwal contoh menunjukkan 07.00 WIB. | Pemeriksaan memilih tagihan yang belum lunas. |
| H-3 | Contoh pesan WhatsApp AC-028 menyebut tanggal jatuh tempo dan detail tagihan. Log mencatat 7 Nov. | Pengingat pertama dikirim tiga hari sebelumnya. |
| Hari jatuh tempo | Pesan AC-028 mengingatkan jatuh tempo hari ini. Log mencatat 10 Nov. | Isi pesan sesuai tahap tanggal. |
| H+7 | Pesan AC-028 menyebut tagihan masih terbuka dan cara melihat petunjuk bayar. Log mencatat 17 Nov. | Riwayat kirim tetap terpisah dari status pembayaran. |
| Catat pembayaran | Lia mencatat pembayaran AC-028 pada 18 Nov. Baris beralih ke Lunas. | Pemeriksaan berikutnya melewati tagihan yang sudah lunas. |
| Serahkan H+30 | Pada 10 Des, AC-028 tetap Lunas dan kartu serah terima AC-029 muncul atas nama Arif. | Pemilik menerima tagihan yang masih terbuka untuk ditindaklanjuti. |
| Ringkasan | Tiga kartu contoh Baca menunjukkan tiga tahap, 07.00 WIB, dan H+30. | Tim dapat melihat jadwal pengingat dan tindak lanjutnya. |
| Konsultasi | Ajak pengunjung membawa daftar tagihan, tanggal jatuh tempo, dan contoh bahasa pengingat. | Pengunjung tahu bahan untuk menyiapkan alur. |

### 7.4 Usulan penyesuaian Baca

- Samakan jawaban pembuka, langkah terakhir, dan keterangan lain yang menyebut 30 hari di ID/EN agar jelas bahwa penyerahan terjadi **pada H+30 jika tagihan masih belum lunas**.
- Perjelas FAQ WhatsApp untuk menyebut izin pelanggan dan penggunaan template pesan yang telah disetujui. FAQ pembayaran tetap memakai pencatatan Lunas oleh staf sebagai kondisi berhenti.

### 7.5 Implementasi dan QA setelah persetujuan

- Gunakan panggung HTML/CSS dan GSAP yang dimuat saat diperlukan. Siapkan panel tabel, tiga pesan dengan tanggalnya, perubahan status ke Lunas, dan kartu serah terima internal. Pesan dan tanggal tersedia dalam ID/EN dan tampilan statis.
- Uji tanggal H-3/H/H+7/H+30, isi pesan dan satu catatan per tahap, pemisahan status terkirim dan lunas, pemberhentian AC-028, serta serah terima AC-029 ke Arif. Jalankan QA lima viewport, keyboard, CTA, reduced motion, GSAP diblokir, regresi cerita dan etalase, serta cek ukuran modul.
- 28 Nov 2026. Storyboard dan penyesuaian Baca siap direview.
- User meminta “lanjut” setelah menerima storyboard dan usulan copy Baca.

### 7.6 Hasil implementasi (28 Nov 2026)

- Tonton ID/EN memperlihatkan pemeriksaan pukul 07.00 WIB, ketiga pengingat dan riwayat AC-028, perubahan ke Lunas setelah Lia mengonfirmasi pembayaran, serta serah terima AC-029 yang masih terbuka ke Arif pada H+30.
- Baca ID/EN menyebut hari ke-30 setelah jatuh tempo sebagai waktu serah terima bagi tagihan yang masih belum lunas. FAQ WhatsApp menyebut izin pelanggan dan penggunaan template yang disetujui.
- Build produksi, TypeScript, ESLint, format berkas N11, dan tes logika 29/29 lulus. QA N11 lulus 135/135 tanpa error halaman pada lima viewport. Uji mencakup tanggal dan urutan pengingat, pencatatan pembayaran, pemisahan status, serah terima, keyboard, CTA, reduced motion, serta GSAP diblokir.
- Regresi empat belas cerita sebelumnya lulus 112/112 dan etalase lulus 114/114. Frame desktop dan viewport HP diperiksa secara visual. Modul animasi N11 berukuran 736 byte gzip dan dimuat saat cerita mendekati viewport. Bundle UI bersama berukuran 49.568 byte gzip.
- User meminta lanjut setelah preview N11 tersedia. Review ditutup untuk melanjutkan N12. Tes HP fisik masih terbuka. [Preview ID](http://localhost:3322/solusi/pengingat-tagihan#story-title) · [Preview EN](http://localhost:3322/en/solutions/pengingat-tagihan#story-title)
