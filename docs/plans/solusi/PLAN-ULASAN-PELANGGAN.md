# Detail Solusi: Keluhan pelanggan terkumpul di satu tempat

Per 28 Nov 2026, **Baca dan Tonton ID/EN tersedia. N12 lulus QA browser 134/134. Review ditutup saat user meminta lanjut.**

Induk: [PLAN-SOLUSI](../../../PLAN-SOLUSI.md). Kontrak template, route, mesin, dan QA: [PLAN-DETAIL](PLAN-DETAIL.md). Dokumen ini hanya menjabarkan kebutuhan khusus `ulasan-pelanggan`.

Bagian 1–6 menyimpan rencana katalog awal 7 Nov. Alur yang diusulkan untuk Tonton ada di bagian 7.

## 1. Identitas dan sumber

| Item | Nilai dari sumber |
|---|---|
| Slug | `ulasan-pelanggan` |
| Status layanan | Siap dibuat (bukan status pengerjaan website) |
| Route target | `/solusi/ulasan-pelanggan` dan `/en/solutions/ulasan-pelanggan` |
| Industri | Retail & F&B, Klinik, Jasa |
| Tim | Layanan pelanggan, Manajemen |
| Aplikasi | Google Sheets, Gmail |
| Sumber konten | [COPY katalog bagian 19.12](../../SOLUSI-V1-COPY.md#1912-ulasan-pelanggan) |
| Ringkasan | [COPY katalog bagian 15](../../SOLUSI-V1-COPY.md#15-ringkasan-pendek-di-kartu-ringkasan-ringkas-data-baru) |
| Referensi detail khusus | Belum diberikan; prototipe Order Grup hanya acuan template bersama |

Pertanyaan utama: **Bagaimana pemilik usaha tahu keluhan pelanggan yang paling sering muncul?**

Jawaban dari sumber: Keluhan dan ulasan dari chat, email, dan formulir dikumpulkan ke satu tabel, lalu dikelompokkan per topik. Setiap minggu pemilik menerima ringkasan keluhan yang paling sering muncul, sehingga perbaikan bisa diprioritaskan.

## 2. Lingkup HTML pertama

Gunakan hero/jawaban, ringkasan, masalah, langkah berikut, perbandingan, kecocokan, persiapan, aplikasi, FAQ, CTA kontekstual, dan solusi terkait dari template bersama. Konten lengkap tetap dibaca dari sumber bagian 19.12, bukan disalin menjadi sumber data kedua di plan.

Status layanan Siap dibuat: tampilkan sebagai usulan solusi. Jangan membuat klien, testimoni, atau hasil implementasi nyata. Section hasil hanya muncul bila jenis bukti dan labelnya telah disepakati.

Field tambahan template baru (`painsLead`, `built`, terjemahan EN, dan kutipan opsional) diaudit pada P0; buat draf hanya berdasarkan sumber lalu review. Jika belum tersedia, tandai kekurangannya. Kontak, SEO, fallback, dan navigasi mengikuti PLAN-DETAIL.

## 3. Alur yang sudah tersedia

Ini daftar langkah HTML dari katalog, **belum** storyboard atau keputusan jumlah adegan 3D.

| Langkah | Judul | Penjelasan |
|---|---|---|
| 1 | Keluhan masuk | Dari chat, email, atau formulir. |
| 2 | Keluhan terkumpul | Dalam satu tabel, dikelompokkan per topik. |
| 3 | Ringkasan mingguan | Pemilik menerima topik keluhan teratas. |
| 4 | Perbaikan diprioritaskan | Tim fokus pada masalah yang paling sering muncul. |

Catatan khusus untuk review: Bedakan pesan pelanggan, pengelompokan keluhan, dan ringkasan pola. Gunakan contoh yang disamarkan dan jangan menggambarkan sentimen otomatis sebagai penilaian pasti.

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
- Belum ada prototipe/storyboard, daftar set/aktor, teks dunia, kamera maupun timing khusus `ulasan-pelanggan`. Jumlah adegan tidak diasumsikan sembilan seperti Order Grup.
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

## 7. N12 Ulasan Pelanggan

### 7.1 Riset 28 Nov 2026

- Catatan N1b memakai template 6112 untuk pengumpulan harian dan penghapusan duplikat, 4032 untuk topik keluhan dan pujian, dan 9290 untuk laporan berkala. Ketiga tautan singkat tidak dapat dibuka ulang. Template 20560 memperlihatkan formulir masuk ke Sheets, 21128 memperlihatkan ekstraksi topik, dan 17827 memperlihatkan ringkasan terjadwal lewat Gmail. N12 memakai kategori yang dapat diperiksa dari isi ulasan dan membandingkan dua minggu dengan rentang yang sama. [Catatan S8](PLAN-KATALOG-N8N.md#411-ulasan-pelanggan-lama) · [Template 20560](https://n8n.io/workflows/20560-manage-customer-complaints-and-sla-escalations-with-gmail-and-google-sheets/) · [Template 21128](https://n8n.io/workflows/21128-analyze-customer-feedback-sentiment-with-openai-google-sheets-and-slack/) · [Template 17827](https://n8n.io/workflows/17827-send-weekly-kpi-summary-emails-from-google-sheets-using-gemini-and-gmail/)
- Kebijakan Google Business Profile membatasi penyimpanan konten API di luar proyek dan melarang manipulasi atau agregasi atas konten yang disimpan dalam pengecualian penyimpanan sementara. N12 memakai data contoh dari formulir saran, chat layanan, dan email yang dikelola restoran. Penyesuaian Baca memperjelas bahwa sumber eksternal bergantung pada akses dan izin penggunaan untuk pengolahan dan ringkasan. [Kebijakan penyimpanan konten Google Business Profile](https://developers.google.com/my-business/content/policies#content-storage)
- Pengulangan pengambilan formulir dapat menghasilkan kiriman dengan identitas sumber yang sama. Storyboard memakai pasangan **kanal + ID kiriman** untuk mengenali salinan pada contoh. Dua pelanggan dengan komentar serupa tetap dicatat sebagai dua kiriman. Masukan tanpa rating menampilkan **Tanpa rating**. Staf melihat daftar yang belum dibalas dan menangani balasan.

### 7.2 Data contoh

- Restoran keluarga contoh punya **Cabang 1** dan **Cabang 2**. **Dita** menangani layanan pelanggan. **Fajar** adalah pemilik. Pengumpulan harian berlangsung pukul **10.00 WIB** seperti di Baca.
- Kiriman **UP-031** dari formulir Cabang 2 memiliki rating **2 bintang** dan isi “Menunggu lama saat makan siang.” Pemeriksaan mengambil kiriman itu dua kali. Baris kedua dilewati, sehingga **7 kiriman masuk menjadi 6 catatan unik**. Salah satu catatan chat Cabang 2 menampilkan Tanpa rating.
- Pada **16–22 Nov 2026**, keluhan **Waktu tunggu** berjumlah **3**, semuanya dari Cabang 2. Minggu sebelumnya, **9–15 Nov**, topik yang sama berjumlah **1**. Untuk kedua minggu, **Rasa** mendapat **2 pujian** dan **Kebersihan** mendapat **1 keluhan**. Setiap catatan contoh dihitung dalam satu topik, sehingga totalnya **6 minggu ini** dan **4 minggu lalu**.
- **UP-031** adalah satu-satunya catatan yang masih **Belum dibalas** dalam contoh minggu ini. Dita membukanya untuk ditindaklanjuti. Fajar menerima ringkasan mingguan via Gmail pada **23 Nov** dan mengatur tambahan satu staf pada jam makan siang di Cabang 2.

### 7.3 Rel dan adegan

Rel: kumpulkan masukan → seragamkan data → lewati duplikat → kelompokkan topik → tandai belum dibalas → kirim ringkasan.

| Adegan | Isi layar | Yang dipahami pengunjung |
|---|---|---|
| Sebelum | Dita membuka formulir, chat layanan dan email secara terpisah. | Masukan dari dua cabang perlu dikumpulkan agar bisa dibandingkan. |
| Kumpulkan masukan | Tiga kanal masuk pada pemeriksaan harian 10.00 WIB. Contoh formulir memperlihatkan UP-031. | Pengumpulan memakai kanal yang dikelola tim. |
| Seragamkan data | Dua kartu contoh menampilkan isi, tanggal, kanal, cabang dan rating bila tersedia. | Catatan dari beberapa kanal dapat dibaca dengan format yang sama. |
| Lewati duplikat | Dua salinan formulir punya ID UP-031. Satu dilewati dan jumlah berubah dari 7 kiriman menjadi 6 catatan. | Salinan yang sama tidak menggandakan hitungan. |
| Kelompokkan topik | Enam catatan dikelompokkan menjadi tiga keluhan waktu tunggu, dua pujian rasa dan satu keluhan kebersihan. | Topik berasal dari isi, dengan cabang yang bisa ditelusuri. |
| Tandai belum dibalas | Dita membuka UP-031 yang masih perlu ditindaklanjuti. | Penanda membantu staf mengetahui masukan yang perlu ditangani. |
| Kirim ringkasan | Gmail ke Fajar membandingkan 16–22 Nov dengan 9–15 Nov. Waktu tunggu Cabang 2 naik dari 1 ke 3. Fajar menambah satu staf saat makan siang. | Pemilik memilih tindakan berdasarkan pola dan lokasi. |
| Ringkasan | Tiga kartu contoh Baca menunjukkan satu tabel, satu ringkasan mingguan dan pengumpulan harian pukul 10.00 WIB. | Tim melihat jadwal dan keluaran alur. |
| Konsultasi | Ajak pengunjung membawa daftar kanal, topik yang ingin dipantau, dan penerima ringkasan. | Pengunjung tahu bahan untuk memulai. |

### 7.4 Usulan penyesuaian Baca

- Sesuaikan jawaban pembuka dan FAQ sumber ID/EN untuk memberi contoh formulir saran, chat layanan dan email milik usaha. Kanal eksternal dipertimbangkan sesuai akses dan izin pengolahan serta ringkasan. Bidang bintang ditampilkan bila tersedia.
- Perjelas bahwa perbandingan mingguan memakai masukan dari sumber yang tercakup serta staf menindaklanjuti ulasan yang ditandai. Penyesuaian copy menghindari cakupan “semua” pada deskripsi tabel.

### 7.5 Implementasi dan QA setelah persetujuan

- Gunakan panggung HTML/CSS dan GSAP yang dimuat saat diperlukan. Siapkan kartu sumber, baris tabel, dua salinan kiriman yang sama, kelompok topik, daftar belum dibalas, dan email mingguan dengan dua periode.
- Uji lima viewport, urutan 7 → 6, cabang dan status rating, hitungan 3/2/1, perbandingan 1 → 3, UP-031, serta tindakan pemilik. Jalankan QA ID/EN, keyboard, CTA, reduced motion, GSAP diblokir, regresi cerita dan etalase, serta cek ukuran modul.
- 28 Nov 2026. Storyboard dan penyesuaian Baca siap direview.
- User meminta “lanjutkan” setelah menerima storyboard dan usulan copy Baca.

### 7.6 Hasil implementasi (28 Nov 2026)

- Tonton ID/EN memperlihatkan pengumpulan formulir, chat layanan dan email pada 10.00 WIB, rating sesuai data sumber, tujuh kiriman menjadi enam catatan unik, serta topik dengan hitungan 3/2/1. Dita membuka UP-031 yang belum dibalas. Fajar membandingkan dua minggu dan menambah satu staf pada jam makan siang di Cabang 2.
- Baca ID/EN menyebut kanal yang tercakup, rating bila tersedia, dan syarat akses serta izin pengolahan untuk sumber eksternal.
- Build produksi, TypeScript, ESLint, format berkas N12, dan tes logika 30/30 lulus. QA N12 lulus 134/134 tanpa error halaman pada lima viewport. Uji mencakup format catatan, penghapusan duplikat, penanda belum dibalas, jumlah per topik dan periode, keyboard, CTA, reduced motion, dan GSAP diblokir.
- Regresi lima belas cerita sebelumnya lulus 120/120 dan etalase lulus 114/114. Frame desktop dan viewport HP diperiksa secara visual. Modul animasi N12 berukuran 730 byte gzip dan dimuat saat cerita mendekati viewport. Bundle UI bersama berukuran 53.105 byte gzip.
- User meminta lanjut setelah preview N12 tersedia. Review ditutup untuk melanjutkan N13. Tes HP fisik masih terbuka. [Preview ID](http://localhost:3323/solusi/ulasan-pelanggan#story-title) · [Preview EN](http://localhost:3323/en/solutions/ulasan-pelanggan#story-title)
