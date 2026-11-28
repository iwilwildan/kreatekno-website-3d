# Detail Solusi: Staf baru menemukan jawaban SOP sendiri

Per 27 Nov 2026, **Tonton N7 tersedia dalam ID/EN dan lulus QA browser 128/128. Review ditutup saat user meminta lanjut.**

Induk: [PLAN-SOLUSI](../../../PLAN-SOLUSI.md). Kontrak template, route, mesin, dan QA: [PLAN-DETAIL](PLAN-DETAIL.md). Dokumen ini hanya menjabarkan kebutuhan khusus `asisten-sop`.

Bagian 1–6 menyimpan rencana katalog awal 7 Nov. Keputusan N1b dan storyboard yang berlaku ada di bagian 7.

## 1. Identitas dan sumber

| Item | Nilai dari sumber |
|---|---|
| Slug | `asisten-sop` |
| Status layanan | Siap dibuat (bukan status pengerjaan website) |
| Route target | `/solusi/asisten-sop` dan `/en/solutions/asisten-sop` |
| Industri | Retail & F&B, Klinik, Properti, Logistik, Jasa, Perjalanan |
| Tim | SDM, Operasional |
| Aplikasi | WhatsApp, Google Drive |
| Sumber konten | [COPY katalog bagian 19.10](../../SOLUSI-V1-COPY.md#1910-asisten-sop) |
| Ringkasan | [COPY katalog bagian 15](../../SOLUSI-V1-COPY.md#15-ringkasan-pendek-di-kartu-ringkasan-ringkas-data-baru) |
| Referensi detail khusus | Belum diberikan; prototipe Order Grup hanya acuan template bersama |

Pertanyaan utama: **Bagaimana staf baru bisa memahami SOP tanpa terus bertanya ke atasan?**

Jawaban dari sumber: Dokumen SOP yang sudah Anda punya dijadikan asisten tanya-jawab untuk staf. Staf bertanya lewat WhatsApp dengan bahasa sehari-hari dan mendapat jawaban dari SOP Anda, lengkap dengan bagian dokumen yang menjadi sumbernya.

## 2. Lingkup HTML pertama

Gunakan hero/jawaban, ringkasan, masalah, langkah berikut, perbandingan, kecocokan, persiapan, aplikasi, FAQ, CTA kontekstual, dan solusi terkait dari template bersama. Konten lengkap tetap dibaca dari sumber bagian 19.10, bukan disalin menjadi sumber data kedua di plan.

Status layanan Siap dibuat: tampilkan sebagai usulan solusi. Jangan membuat klien, testimoni, atau hasil implementasi nyata. Section hasil hanya muncul bila jenis bukti dan labelnya telah disepakati.

Field tambahan template baru (`painsLead`, `built`, terjemahan EN, dan kutipan opsional) diaudit pada P0; buat draf hanya berdasarkan sumber lalu review. Jika belum tersedia, tandai kekurangannya. Kontak, SEO, fallback, dan navigasi mengikuti PLAN-DETAIL.

## 3. Alur yang sudah tersedia

Ini daftar langkah HTML dari katalog, **belum** storyboard atau keputusan jumlah adegan 3D.

| Langkah | Judul | Penjelasan |
|---|---|---|
| 1 | SOP dikumpulkan | Dokumen yang sudah ada di Google Drive. |
| 2 | Staf bertanya | Lewat chat dengan bahasa sehari-hari. |
| 3 | Jawaban dari SOP Anda | Lengkap dengan bagian dokumen sumbernya. |
| 4 | SOP diperbarui | Pertanyaan yang belum terjawab menjadi bahan perbaikan SOP. |

Catatan khusus untuk review: Pertahankan sumber dokumen pada jawaban dan alur pertanyaan yang belum terjawab. Jangan menampilkan jawaban rekaan seolah berasal dari SOP usaha pengguna.

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
- Belum ada prototipe/storyboard, daftar set/aktor, teks dunia, kamera maupun timing khusus `asisten-sop`. Jumlah adegan tidak diasumsikan sembilan seperti Order Grup.
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

## 7. N7: cerita Tonton Asisten SOP

### 7.1 Riset 27 Nov 2026

- Audit N1b mencatat SOP dari Drive dimasukkan manual ke basis pengetahuan. Bot Telegram menjawab dengan judul dan bagian sumber. Bila materi tidak tercakup, bot memberi tahu staf siapa yang bisa dihubungi. Pencatatan di Sheets masih berupa rancangan. Riset N7 memakai catatan audit 24 Nov untuk workflow privat tersebut. [Audit N1b](PLAN-KATALOG-N8N.md#11-n1b-copy-baca-iden-7-halaman-lama-selesai-teknis-24-nov-menunggu-review)
- Template 4551 menunjukkan tahap mengambil dokumen dari Drive, menyiapkan potongan berkonteks, lalu mengambil bagian yang relevan untuk menjawab. Dokumentasi n8n menjelaskan cara menyertakan metadata seperti judul dan bagian saat mengambil sumber. Template 4966 memberi pembanding berupa Google Docs yang dibaca setiap kali ada pertanyaan. Untuk mengikuti workflow N1b, N7 memperlihatkan versi baru siap dipakai setelah diproses ulang. [Template 4551](https://n8n.io/workflows/4551-ai-powered-rag-document-processing-and-chatbot-with-google-drive-supabase-openai/) · [Dokumentasi basis pengetahuan n8n](https://docs.n8n.io/build/integrate-ai/understand-ai-components/retrieve-relevant-context) · [Template 4966](https://n8n.io/workflows/4966-customer-support-whatsapp-bot-with-google-docs-knowledge-base-and-gemini-ai/)
- Usulan penyesuaian Baca ID/EN mencakup jawaban pembuka, langkah terakhir, dan FAQ pertama. Ketiganya menjelaskan bahwa staf dapat menghubungi penanggung jawab. Pertanyaan yang belum terjawab dapat dicatat sebagai **Rancangan** untuk membantu tim melengkapi SOP.

### 7.2 Data dan dialog contoh

- **Wulan** adalah staf baru di klinik gigi tiga cabang (contoh). Adegan memakai pertanyaan administrasi pendaftaran. Kartu dokumen berjudul **SOP Pendaftaran Pasien**, versi **1.2**. Sumber jawaban adalah **Bagian 2.1 · Kedatangan terjadwal**. Layar hanya menampilkan data contoh alur kerja.
- Wulan bertanya di Telegram, “Kalau pasien datang sesuai jadwal, saya tandai di mana?” Bot membalas, “Buka daftar janji, cocokkan nama dan jadwal, lalu tandai Hadir pada baris yang sesuai.” Judul dokumen dan bagian tercantum tepat di bawah langkah tersebut.
- Wulan bertanya lagi, “Kalau pasien datang ke cabang lain dari jadwal?” Bot menjawab, “Belum tercakup di SOP. Hubungi kepala cabang.” Wulan yang menghubungi kepala cabang. Contoh catatan Sheets hanya memuat topik **Kedatangan di cabang lain** dan label **Rancangan**.

### 7.3 Rel dan adegan

Rel: pilih SOP → proses dokumen → staf bertanya → jawaban dan sumber → arahan ke penanggung jawab → rancangan catatan.

| Adegan | Isi layar | Yang dipahami pengunjung |
|---|---|---|
| Sebelum | Wulan membuka folder SOP dan belum tahu bagian yang harus dibaca. | Staf perlu menemukan aturan saat bekerja. |
| Pilih SOP | Folder Drive memperlihatkan SOP Pendaftaran Pasien v1.2. | Tim memilih dokumen yang akan dipakai. |
| Proses dokumen | SOP v1.2 ditandai siap setelah diproses. Bagian kedatangan terjadwal terlihat. | Asisten memakai dokumen yang sudah diproses. |
| Staf bertanya | Pertanyaan pertama Wulan muncul di Telegram. | Staf bisa bertanya dengan bahasa sehari-hari. |
| Jawaban dan sumber | Langkah menandai kehadiran disertai judul dan bagian 2.1. | Staf bisa memeriksa sumber jawaban. |
| Di luar SOP | Bot menyarankan Wulan menghubungi kepala cabang. | Staf tahu tindakan berikutnya bila SOP belum mencakup kasusnya. |
| Rancangan catatan | Contoh baris berlabel Rancangan berisi topik yang belum tercakup. | Tim dapat memakai topik itu untuk melengkapi SOP. |
| Ringkasan | Tiga kartu merangkum folder SOP, sumber jawaban, dan pertanyaan yang diarahkan. | Pengunjung melihat hasil pada contoh ini. |
| CTA | Tawarkan bantuan menyiapkan asisten dari dokumen SOP yang sudah ada. | Pengunjung tahu apa yang perlu disiapkan. |

### 7.4 Implementasi dan QA setelah persetujuan

- Ikuti panggung HTML/CSS bersama dengan GSAP yang dimuat saat diperlukan. Siapkan cerita ID/EN, rel dan tombol adegan, serta tampilan teks statis untuk reduced motion dan ketika GSAP diblokir.
- Uji lima viewport untuk baca sumber, urutan pertanyaan dan jawaban, label Rancangan, CTA, serta navigasi keyboard dan gulir maju/mundur. Jalankan pemeriksaan build, logika, regresi cerita, dan etalase sesuai tahap S8.
- 27 Nov 2026: user menyetujui storyboard dan penyesuaian Baca dengan memilih “Setuju, implementasikan N7”.

### 7.5 Hasil implementasi (27 Nov 2026)

- Tonton ID/EN menampilkan versi SOP 1.2 yang sudah diproses, jawaban Telegram beserta Bagian 2.1, dan pertanyaan kedua yang Wulan teruskan sendiri ke kepala cabang. Contoh catatan topik diberi label Rancangan.
- Jawaban pembuka, langkah terakhir, dan FAQ pertama di Baca memperjelas arahan ke penanggung jawab dan status rancangan untuk pencatatan. Build produksi, TypeScript, ESLint, dan format berkas yang berubah lulus. Tes logika lulus 25/25.
- QA N7 lulus 128/128 tanpa error halaman pada lima viewport. Cakupan meliputi gulir maju/mundur, urutan munculnya jawaban dan sumber, keyboard, CTA, ID/EN, reduced motion, dan GSAP diblokir. Regresi sepuluh cerita sebelumnya lulus 80/80 dan etalase 114/114. Frame desktop dan viewport HP diperiksa secara visual.
- Modul animasi khusus N7 berukuran 705 byte gzip dan dimuat saat cerita mendekati viewport. Bundle UI bersama yang memuat panggung berukuran 39.472 byte gzip. N7 memakai GSAP yang sudah ada.
- User meminta lanjut setelah preview N7 tersedia. Review ditutup untuk melanjutkan N8. Tes HP fisik masih terbuka. [Preview ID](http://localhost:3318/solusi/asisten-sop#story-title) · [Preview EN](http://localhost:3318/en/solutions/asisten-sop#story-title)
