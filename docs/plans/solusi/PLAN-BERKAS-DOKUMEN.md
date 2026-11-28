# Detail Solusi: Berkas dokumen pelanggan dirapikan otomatis

Per 28 Nov 2026, **Baca dan Tonton ID/EN tersedia. N9 lulus QA browser 135/135. Review ditutup saat user meminta lanjut.**

Induk: [PLAN-SOLUSI](../../../PLAN-SOLUSI.md). Kontrak template, route, mesin, dan QA: [PLAN-DETAIL](PLAN-DETAIL.md). Dokumen ini hanya menjabarkan kebutuhan khusus `berkas-dokumen`.

Bagian 1–6 menyimpan rencana katalog awal 7 Nov. Status layanan dan alur yang berlaku untuk Tonton ada di bagian 7.

## 1. Identitas dan sumber

| Item | Nilai dari sumber |
|---|---|
| Slug | `berkas-dokumen` |
| Status layanan | Sudah berjalan (bukan status pengerjaan website) |
| Route target | `/solusi/berkas-dokumen` dan `/en/solutions/berkas-dokumen` |
| Industri | Perjalanan, Jasa |
| Tim | Operasional, Keuangan & admin |
| Aplikasi | WhatsApp, Google Drive, Google Sheets |
| Sumber konten | [COPY katalog bagian 19.3](../../SOLUSI-V1-COPY.md#193-berkas-dokumen) |
| Ringkasan | [COPY katalog bagian 15](../../SOLUSI-V1-COPY.md#15-ringkasan-pendek-di-kartu-ringkasan-ringkas-data-baru) |
| Referensi detail khusus | Belum diberikan; prototipe Order Grup hanya acuan template bersama |

Pertanyaan utama: **Bagaimana mengumpulkan dokumen pelanggan dari chat tanpa berantakan?**

Jawaban dari sumber: Pelanggan cukup mengirim foto dokumennya lewat WhatsApp. Foto dirapikan ke ukuran yang dibutuhkan, disimpan ke folder Google Drive per pelanggan, dan kelengkapannya tercatat di Google Sheets. Tim tinggal memeriksa dan memproses berkas yang sudah lengkap.

## 2. Lingkup HTML pertama

Gunakan hero/jawaban, ringkasan, masalah, langkah berikut, perbandingan, kecocokan, persiapan, aplikasi, FAQ, CTA kontekstual, dan solusi terkait dari template bersama. Konten lengkap tetap dibaca dari sumber bagian 19.3, bukan disalin menjadi sumber data kedua di plan.

Sumber memuat status layanan Sudah berjalan dan contoh hasil. Verifikasi status, angka, kutipan, dan izin publikasi; label contoh tidak boleh hilang hanya karena statusnya sudah berjalan.

Field tambahan template baru (`painsLead`, `built`, terjemahan EN, dan kutipan opsional) diaudit pada P0; buat draf hanya berdasarkan sumber lalu review. Jika belum tersedia, tandai kekurangannya. Kontak, SEO, fallback, dan navigasi mengikuti PLAN-DETAIL.

## 3. Alur yang sudah tersedia

Ini daftar langkah HTML dari katalog, **belum** storyboard atau keputusan jumlah adegan 3D.

| Langkah | Judul | Penjelasan |
|---|---|---|
| 1 | Pelanggan mengirim foto dokumen | Lewat chat WhatsApp, tanpa aplikasi tambahan. |
| 2 | Foto dirapikan | Dokumen disimpan dengan ukuran dan nama file yang seragam. |
| 3 | Berkas tersimpan per pelanggan | Setiap pelanggan punya foldernya sendiri di Google Drive. |
| 4 | Tim melihat kelengkapan | Tabel menunjukkan berkas yang sudah lengkap dan yang masih kurang. |

Catatan khusus untuk review: Pisahkan dokumen diterima, kelengkapan diperiksa, dan berkas benar-benar lengkap. Contoh dokumen untuk halaman harus fiktif atau disamarkan, bukan berkas pelanggan asli.

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
- Belum ada prototipe/storyboard, daftar set/aktor, teks dunia, kamera maupun timing khusus `berkas-dokumen`. Jumlah adegan tidak diasumsikan sembilan seperti Order Grup.
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

## 7. N9 Berkas Dokumen

### 7.1 Riset 28 Nov 2026

- Keputusan N1b menetapkan kantor notaris dan PPAT sebagai contoh dengan status layanan **Siap dibuat**. Template 4827 memberi contoh menerima foto dan PDF dari WhatsApp. Template 4868 memberi contoh membaca file di Drive dan mengisi kolom yang ditentukan di Sheets. N9 memakai pola penerimaan, penyimpanan, dan pembacaan tersebut untuk contoh berkas pelanggan. [Audit dan keputusan N1b](PLAN-KATALOG-N8N.md#11-n1b-copy-baca-iden-7-halaman-lama-selesai-teknis-24-nov-menunggu-review) · [Template 4827](https://n8n.io/workflows/4827-ai-powered-whatsapp-chatbot-for-text-voice-images-and-pdf-with-rag/) · [Template 4868](https://n8n.io/workflows/4868-extract-invoice-data-from-google-drive-to-sheets-with-mistral-ocr-and-gemini/)
- Template 20432 memperlihatkan satu folder dan satu daftar kelengkapan per permintaan, serta pemberitahuan tentang berkas yang masih kurang. Dokumentasi Sheets menjelaskan cara memperbarui baris yang cocok. N9 memakai satu kode berkas internal sepanjang cerita. Foto pengganti memperbarui entri KTP yang sama di tabel, sementara PDF KK mengisi entri yang masih kosong. [Template 20432](https://n8n.io/workflows/20432-chase-client-documents-with-whatsapp-gmail-google-sheets-and-gpt-4o-mini/) · [Dokumentasi pembaruan baris Sheets](https://docs.n8n.io/integrations/builtin/app-nodes/n8n-nodes-base.googlesheets/sheet-operations#append-or-update-row)
- Copy Baca menyebut pemeriksaan data oleh staf dan permintaan kirim ulang sebelum berkas dianggap lengkap. N9 memakai status **Perlu dilengkapi** → **Siap dicek staf** → **Lengkap untuk diproses**. Status terakhir menunjuk pada kelengkapan daftar contoh kantor dan muncul setelah staf mengecek data.

### 7.2 Data contoh

- **Maya** adalah pelanggan fiktif dan **Sari** staf kantor notaris dan PPAT contoh. Daftar untuk berkas internal **BD-031** terdiri dari **KTP**, **Kartu Keluarga (KK)**, dan **sertifikat tanah**. Visual hanya memuat label jenis berkas, nama file, dan status. Data identitas serta isi dokumen tidak ditampilkan.
- Kiriman awal berisi foto KTP dan PDF sertifikat. Folder **BD-031** menyimpan `KTP-foto-01.jpg` dan `Sertifikat-01.pdf`. Tabel mencatat **KTP · Kirim ulang**, **KK · Belum masuk**, dan **Sertifikat · Terbaca**. Ringkasan menunjukkan **1 dari 3 terbaca** dan **Perlu dilengkapi**.
- Sari mengirim satu pesan ke Maya, “Mohon kirim ulang foto KTP yang lebih jelas dan lampirkan PDF Kartu Keluarga.” Maya mengirim foto pengganti dan PDF KK. File `KTP-foto-02.jpg` dan `KK-01.pdf` masuk ke folder yang sama.
- Tabel menampilkan **3 dari 3 terbaca** dan **Siap dicek staf**. Sari mencocokkan data yang tercatat dengan dokumen versi terbaru, lalu menandai **Lengkap untuk diproses**.

### 7.3 Rel dan adegan

Rel: terima berkas → simpan ke folder → baca dan catat → minta dilengkapi → perbarui berkas → periksa kelengkapan.

| Adegan | Isi layar | Yang dipahami pengunjung |
|---|---|---|
| Sebelum | Sari mencari lampiran di riwayat chat dan mencocokkannya dengan catatan. | Kiriman bertahap membuat staf sulit melihat berkas yang masih kurang. |
| Terima berkas | WhatsApp menampilkan foto KTP dan PDF sertifikat dari Maya. | Pelanggan mengirim foto atau PDF lewat chat. |
| Simpan ke folder | Dua file masuk ke folder Drive BD-031 dengan pola nama yang seragam. | Staf bisa menemukan kiriman di satu folder. |
| Baca dan catat | Tabel menampilkan sertifikat terbaca, KTP perlu dikirim ulang, dan KK belum masuk. | Berkas yang sudah diterima tampil dengan hasil pembacaan masing-masing. |
| Minta dilengkapi | Sari mengirim satu pesan untuk meminta foto KTP lebih jelas dan PDF KK. | Maya tahu dua hal yang perlu dikirim. |
| Perbarui berkas | File baru masuk ke folder yang sama. Tabel naik menjadi 3 dari 3 terbaca, dengan status Siap dicek staf. | Kiriman tambahan mengisi daftar yang sudah ada. |
| Periksa kelengkapan | Sari mengecek data dengan dokumen terbaru sebelum menandai Lengkap untuk diproses. | Staf menentukan kapan paket siap untuk langkah berikutnya. |
| Ringkasan | Tiga kartu contoh Baca menampilkan satu folder, satu tabel, dan dua format. | Pengunjung melihat cara tim membuka dan memeriksa berkas. |
| Konsultasi | Ajak pengunjung membawa daftar dokumen dan aturan penamaan yang dipakai. | Pengunjung tahu bahan yang bisa disiapkan. |

### 7.4 Implementasi dan QA setelah persetujuan

- Gunakan panggung HTML/CSS dengan GSAP yang dimuat saat diperlukan. Adegan ID/EN memakai kartu lampiran fiktif, folder, daftar kelengkapan, dan panel pemeriksaan. Caption dan tampilan statis tetap memuat perbedaan status.
- Uji lima viewport, dua format lampiran, satu kode folder sepanjang cerita, dan pembaruan daftar yang sama. Pastikan status Lengkap untuk diproses muncul setelah cek staf. Cek juga keyboard, CTA, reduced motion, GSAP diblokir, regresi cerita dan etalase, serta ukuran modul animasi.
- 28 Nov 2026. Storyboard siap direview.
- User memilih “Setuju, implementasikan N9”.

### 7.5 Hasil implementasi (28 Nov 2026)

- Tonton ID/EN mengikuti folder BD-031 dari dua kiriman awal sampai permintaan kirim ulang dan pemeriksaan Sari. Daftar menunjukkan 1 dari 3 dokumen terbaca, lalu 3 dari 3 terbaca dengan status Siap dicek staf. Status Lengkap untuk diproses muncul setelah pemeriksaan staf. Visual memakai nama file dan data contoh.
- Build produksi, TypeScript, ESLint, Prettier untuk berkas N9, dan tes logika 27/27 lulus. QA N9 lulus 135/135 tanpa error halaman pada lima viewport. Uji mencakup gulir maju/mundur, foto dan PDF, pembaruan daftar, urutan pemeriksaan, keyboard, CTA, ID/EN, reduced motion, dan GSAP diblokir.
- Regresi dua belas cerita sebelumnya lulus 96/96 dan etalase lulus 114/114. Frame desktop dan viewport HP diperiksa secara visual. Modul animasi N9 berukuran 739 byte gzip dan dimuat saat cerita mendekati viewport. Bundle UI bersama berukuran 44.150 byte gzip.
- User meminta lanjut setelah preview N9 tersedia. Review ditutup untuk melanjutkan N10. Tes HP fisik masih terbuka. [Preview ID](http://localhost:3320/solusi/berkas-dokumen#story-title) · [Preview EN](http://localhost:3320/en/solutions/berkas-dokumen#story-title)
