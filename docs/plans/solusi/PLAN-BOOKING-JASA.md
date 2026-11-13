# Detail Solusi: Booking jasa langsung dari chat pelanggan

Tanggal: 7 Nov 2026. Status: **rencana awal HTML dari katalog; belum diimplementasikan; storyboard 3D belum tersedia**.

Induk: [PLAN-SOLUSI](../../../PLAN-SOLUSI.md). Kontrak template, route, mesin, dan QA: [PLAN-DETAIL](PLAN-DETAIL.md). Dokumen ini hanya menjabarkan kebutuhan khusus `booking-jasa`.

## 1. Identitas dan sumber

| Item | Nilai dari sumber |
|---|---|
| Slug | `booking-jasa` |
| Status layanan | Sudah berjalan (bukan status pengerjaan website) |
| Route target | `/solusi/booking-jasa` dan `/en/solutions/booking-jasa` |
| Industri | Jasa |
| Tim | Layanan pelanggan, Operasional |
| Aplikasi | WhatsApp, Google Calendar, Google Sheets |
| Sumber konten | [COPY katalog bagian 19.2](../../SOLUSI-V1-COPY.md#192-booking-jasa) |
| Ringkasan | [COPY katalog bagian 15](../../SOLUSI-V1-COPY.md#15-ringkasan-pendek-di-kartu-ringkasan-ringkas-data-baru) |
| Referensi detail khusus | Belum diberikan; prototipe Order Grup hanya acuan template bersama |

Pertanyaan utama: **Bagaimana usaha jasa menerima booking dari WhatsApp tanpa admin standby?**

Jawaban dari sumber: Asisten booking menjawab pelanggan di WhatsApp, menawarkan jadwal yang masih kosong, lalu mencatat booking ke kalender tim. Pertanyaan yang tidak bisa dijawab diteruskan ke admin lengkap dengan ringkasan chat, sehingga pelanggan tidak perlu mengulang ceritanya.

## 2. Lingkup HTML pertama

Gunakan hero/jawaban, ringkasan, masalah, langkah berikut, perbandingan, kecocokan, persiapan, aplikasi, FAQ, CTA kontekstual, dan solusi terkait dari template bersama. Konten lengkap tetap dibaca dari sumber bagian 19.2, bukan disalin menjadi sumber data kedua di plan.

Sumber memuat status layanan Sudah berjalan dan contoh hasil. Verifikasi status, angka, kutipan, dan izin publikasi; label contoh tidak boleh hilang hanya karena statusnya sudah berjalan.

Field tambahan template baru (`painsLead`, `built`, terjemahan EN, dan kutipan opsional) diaudit pada P0; buat draf hanya berdasarkan sumber lalu review. Jika belum tersedia, tandai kekurangannya. Kontak, SEO, fallback, dan navigasi mengikuti PLAN-DETAIL.

## 3. Alur yang sudah tersedia

Ini daftar langkah HTML dari katalog, **belum** storyboard atau keputusan jumlah adegan 3D.

| Langkah | Judul | Penjelasan |
|---|---|---|
| 1 | Pelanggan bertanya lewat chat | Pelanggan menghubungi nomor usaha seperti biasa. |
| 2 | Asisten menawarkan jadwal | Pelanggan memilih dari jadwal yang memang masih kosong. |
| 3 | Booking masuk ke kalender | Tim melihat booking baru di Google Calendar dan tabel booking. |
| 4 | Admin menangani yang khusus | Permintaan di luar kebiasaan diteruskan ke admin dengan ringkasannya. |

Catatan khusus untuk review: Jadwal kosong, pembatalan, dan penerusan ke admin harus jelas. Angka 24 jam / 0 bentrok / 5 menit dari sumber belum boleh diperlakukan sebagai hasil terverifikasi tanpa bukti.

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
- Belum ada prototipe/storyboard, daftar set/aktor, teks dunia, kamera maupun timing khusus `booking-jasa`. Jumlah adegan tidak diasumsikan sembilan seperti Order Grup.
- Jika akan memiliki cerita: selesaikan hubungan inline/Tonton sesuai induk, tujuan adegan, data fiktif yang dipakai, serta batas performa sebelum membangun set.
- Ikuti kebijakan solusi terkait yang disepakati bersama; override editorial harus berupa data eksplisit dengan slug valid.

## 6. Kriteria selesai dan log

- [ ] P0–P2 selesai dan checklist PLAN-DETAIL terpenuhi untuk ID/EN.
- [ ] Isi dan batas layanan sesuai sumber; contoh tidak berubah menjadi klaim hasil nyata.
- [ ] Cara kerja dapat dibaca tanpa 3D; CTA dan navigasi berfungsi.
- [ ] Review mencatat tanggal, screenshot, build/perangkat yang diuji, serta kekurangan yang masih terbuka.
- [ ] Status cerita dilaporkan terpisah: belum tersedia / direncanakan / berjalan / direview / selesai.

7 Nov 2026: subplan awal dibuat dari konten katalog atas permintaan pemisahan plan. Belum ada implementasi atau persetujuan storyboard baru.
