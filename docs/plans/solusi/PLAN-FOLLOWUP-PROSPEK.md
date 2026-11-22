# Detail Solusi: Calon pembeli properti tidak lagi lupa di-follow-up

Tanggal: 7 Nov 2026. Status: **rencana awal HTML dari katalog; belum diimplementasikan; storyboard 3D belum tersedia**.

Induk: [PLAN-SOLUSI](../../../PLAN-SOLUSI.md). Kontrak template, route, mesin, dan QA: [PLAN-DETAIL](PLAN-DETAIL.md). Dokumen ini hanya menjabarkan kebutuhan khusus `followup-prospek`.

## 1. Identitas dan sumber

| Item | Nilai dari sumber |
|---|---|
| Slug | `followup-prospek` |
| Status layanan | Siap dibuat (bukan status pengerjaan website) |
| Route target | `/solusi/followup-prospek` dan `/en/solutions/followup-prospek` |
| Industri | Properti |
| Tim | Penjualan, Marketing |
| Aplikasi | WhatsApp, Google Sheets |
| Sumber konten | [COPY katalog bagian 19.8](../../SOLUSI-V1-COPY.md#198-followup-prospek) |
| Ringkasan | [COPY katalog bagian 15](../../SOLUSI-V1-COPY.md#15-ringkasan-pendek-di-kartu-ringkasan-ringkas-data-baru) |
| Referensi detail khusus | Belum diberikan; prototipe Order Grup hanya acuan template bersama |

Pertanyaan utama: **Bagaimana tim marketing properti menindaklanjuti setiap calon pembeli tepat waktu?**

Jawaban dari sumber: Setiap calon pembeli yang masuk dari iklan atau survei lokasi tercatat di Google Sheets beserta minatnya. Tim marketing menerima pengingat kapan harus menghubungi kembali, dan pesan lanjutan bisa disiapkan sesuai tipe unit yang diminati.

## 2. Lingkup HTML pertama

Gunakan hero/jawaban, ringkasan, masalah, langkah berikut, perbandingan, kecocokan, persiapan, aplikasi, FAQ, CTA kontekstual, dan solusi terkait dari template bersama. Konten lengkap tetap dibaca dari sumber bagian 19.8, bukan disalin menjadi sumber data kedua di plan.

Status layanan Siap dibuat: tampilkan sebagai usulan solusi. Jangan membuat klien, testimoni, atau hasil implementasi nyata. Section hasil hanya muncul bila jenis bukti dan labelnya telah disepakati.

Field tambahan template baru (`painsLead`, `built`, terjemahan EN, dan kutipan opsional) diaudit pada P0; buat draf hanya berdasarkan sumber lalu review. Jika belum tersedia, tandai kekurangannya. Kontak, SEO, fallback, dan navigasi mengikuti PLAN-DETAIL.

## 3. Alur yang sudah tersedia

Ini daftar langkah HTML dari katalog, **belum** storyboard atau keputusan jumlah adegan 3D.

| Langkah | Judul | Penjelasan |
|---|---|---|
| 1 | Prospek masuk | Dari iklan, chat, atau survei lokasi. |
| 2 | Prospek tercatat | Nama, minat, dan sumbernya tersimpan di tabel. |
| 3 | Pengingat follow-up | Tim menerima pengingat sesuai jadwal. |
| 4 | Tim menghubungi | Pesan lanjutan sesuai unit yang diminati. |

Catatan khusus untuk review: Tunjukkan pencatatan prospek dan jadwal tindak lanjut sesuai sumber. Hindari klaim bahwa pengingat pasti menghasilkan penjualan; identitas calon pembeli dalam ilustrasi harus contoh.

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
- Belum ada prototipe/storyboard, daftar set/aktor, teks dunia, kamera maupun timing khusus `followup-prospek`. Jumlah adegan tidak diasumsikan sembilan seperti Order Grup.
- Jika akan memiliki cerita: selesaikan hubungan inline/Tonton sesuai induk, tujuan adegan, data fiktif yang dipakai, serta batas performa sebelum membangun set.
- Ikuti kebijakan solusi terkait yang disepakati bersama; override editorial harus berupa data eksplisit dengan slug valid.

## 6. Kriteria selesai dan log

- [ ] P0–P2 selesai dan checklist PLAN-DETAIL terpenuhi untuk ID/EN.
- [ ] Isi dan batas layanan sesuai sumber; contoh tidak berubah menjadi klaim hasil nyata.
- [ ] Cara kerja dapat dibaca tanpa 3D; CTA dan navigasi berfungsi.
- [ ] Review mencatat tanggal, screenshot, build/perangkat yang diuji, serta kekurangan yang masih terbuka.
- [ ] Status cerita dilaporkan terpisah: belum tersedia / direncanakan / berjalan / direview / selesai.

7 Nov 2026: subplan awal dibuat dari konten katalog atas permintaan pemisahan plan. Belum ada implementasi atau persetujuan storyboard baru.

## 7. FP1: cerita Tonton dari workflow nyata (disetujui dan di-commit 22 Nov 2026)

Permintaan user 22 Nov: lanjutkan `followup-prospek` dengan pola CK1 (panggung pastel, caption `h3` + `p`, rel workflow, studi kasus di bawah). Sumber: workflow "The Sales Rep" di instance `n8n-mcp`. Tidak ada library baru.

### 7.1 Workflow yang dibaca (hanya baca, tidak dijalankan)

7 node, nonaktif, belum pernah dipicu, diubah terakhir 24 Des 2025.

| # | Node | Isi |
|---|---|---|
| 1 | Jadwal | Setiap hari pukul 10.00 |
| 2 | Ambil prospek | Satu tabel pipeline penjualan, kolom: nama klien, ringkasan chat terakhir, status deal, tanggal chat terakhir |
| 3 | Saring | Status "Pending" dan tanggal chat terakhir sudah lewat (nama node "lewat 3 hari") |
| 4 | Agen AI | Menulis satu pesan pendek (2–3 kalimat) yang menyebut isi chat terakhir; santai tapi sopan, sapaan "Kak/Pak", hanya menyenggol halus, tidak mendesak, menunjukkan pengertian bahwa klien mungkin sibuk |
| 5 | Kirim | Pesan dikirim lewat WhatsApp |

Aturan prompt diparafrasekan, isinya tidak masuk halaman.

Temuan yang mengubah halaman:
- **Batas 3 hari belum terpasang.** Nama node dan prompt menyebut 3 hari, tetapi kondisinya membandingkan dengan hari ini (minus 0 hari), jadi semua prospek Pending lolos. Kemungkinan sisa uji. Halaman memakai 3 hari sebagai aturan rancangan.
- **Penerima masih satu nomor tetap (mode uji).** Pesan belum dikirim ke nomor prospek dari tabel.
- **Aturan WhatsApp Business:** di luar jendela 24 jam sejak pelanggan terakhir chat, bisnis hanya boleh mengirim template yang sudah disetujui. Prospek yang diam 3 hari pasti di luar jendela, jadi pesan bebas tulisan AI akan ditolak bila dikirim langsung ke prospek. Pilihan aman: pesan dikirim sebagai draf ke tim marketing, yang lalu mengirimnya dari nomor sendiri. Ini juga cocok dengan katalog ("tim menerima pengingat, pesan lanjutan disiapkan").
- **Tabel tidak diperbarui setelah kirim.** Prospek yang masih Pending akan disapa lagi besok. Perlu langkah rancangan: tandai "sudah disapa" dan tanggalnya.
- **Prospek tidak masuk otomatis.** Workflow hanya membaca tabel; klaim katalog "prospek dari iklan tercatat" tidak ada. Copy menyebut tabel diisi tim setelah chat atau survei.
- **Contoh prompt bukan properti** (paket, portofolio, budget). Halaman memakai contoh properti dengan label contoh; status tetap `ide`.

Yang tidak masuk halaman: nomor telepon, ID tabel/kredensial, nama kredensial, isi prompt, nama model di Tonton.

### 7.2 Langkah (rel workflow, draf)

| # | Rel | Isi | AI |
|---|---|---|---|
| 1 | Setiap pagi | Daftar prospek dibaca pukul 10.00 | |
| 2 | Ambil prospek | Nama, ringkasan chat terakhir, status, tanggal | |
| 3 | Saring | Pending dan diam lebih dari 3 hari | |
| 4 | AI menulis | Satu pesan pendek dari isi chat terakhir | ya |
| 5 | Draf ke tim | Pengingat + draf pesan ke tim marketing | |
| 6 | Tabel diperbarui (rancangan) | Status "Sudah disapa" + tanggal | |

### 7.3 Adegan ("satu baris prospek berjalan", draf 10 adegan)

| # | Kicker | Caption (draf) | Kanvas |
|---|---|---|---|
| 1 | Sebelum | Calon pembeli yang sudah survei lupa dihubungi lagi. | Tabel prospek; tanggal chat terakhir makin lama, penghitung "belum disapa" naik |
| 2 | Langkah 1 · Setiap pagi | Pukul sepuluh pagi, daftar prospek dibaca. | Jam 10.00, tumpukan jadi satu tabel rapi |
| 3 | Langkah 2 · Ambil prospek | Setiap baris berisi nama, ringkasan chat dan status. | Empat baris, kolom muncul berurutan |
| 4 | Langkah 3 · Saring | Hanya yang masih ragu dan diam lebih dari tiga hari. | Baris "Deal" dan "2 hari" meredup; satu baris contoh menyala |
| 5 | Langkah 4 · AI membaca | AI membaca ringkasan chat terakhir prospek itu. | Ringkasan baris distabilo, dua chip (unit, alasan menunda) |
| 6 | Langkah 4 · AI menulis | Satu pesan pendek yang menyambung obrolan terakhir. | Chip melebur jadi bubble pesan 2 kalimat |
| 7 | Langkah 5 · Draf ke tim | Tim marketing menerima draf, lalu mengirimnya sendiri. | Bubble masuk kartu tim marketing, tombol kirim ditekan |
| 8 | Langkah 6 · Tabel diperbarui (rancangan) | Prospek yang sudah disapa tidak disapa lagi besok. | Status baris berubah, tanggal hari ini, tanda "Rancangan" |
| 9 | Hasil · angka contoh | Setiap pagi, tidak ada prospek yang terlewat. | Tiga angka contoh |
| 10 | Untuk bisnis Anda | Mau setiap calon pembeli dihubungi tepat waktu? | Angka diredupkan, CTA |

Panggung siang (tidak ada adegan malam). Usulan `metrics` contoh: 10.00 (daftar dicek setiap pagi), 3 hari (batas sebelum disapa), 1 pesan (per prospek, dari chat terakhir).

### 7.4 Keputusan user (22 Nov 2026)

- Pesan AI dikirim sebagai **draf ke tim marketing**, yang mengirimnya dari nomornya sendiri (aman dari aturan jendela 24 jam). FAQ menyebut kirim otomatis langsung ke prospek hanya bisa lewat template yang disetujui.
- Langkah "tabel diperbarui" **dijadikan adegan Tonton bertanda rancangan**. Mesin memetakan satu adegan per node rel, jadi cerita menjadi 9 adegan dengan rel 6 node (AI membaca dan menulis digabung dalam satu adegan), bukan 10 seperti draf 7.3.
- Contoh kanvas: rumah tipe 45, sudah survei, mau diskusi dengan istri dulu. Klien "Developer perumahan (contoh)".

### 7.5 Perubahan file (rencana) dan cek

Sama dengan CK1 7.4–7.5: `ProspekCeritaSchema` di `cerita/schema.ts`, `cerita/followup-prospek.ts`, `PanggungProspek.tsx`, `ceritaFilmProspek.ts`, gaya `fp-*`, `FOLLOWUP_PROSPEK` di `ceritaTiming.ts`, `KIND` di `CeritaScroll.tsx` (tanpa malam), `items/followup-prospek.ts` (copy ID/EN lengkap, `painsLead`, `built`, kutipan dan angka contoh, `metricsKind: "example"`), `catalog.ts`, `tools/solusi/fp1-qa.mjs`, tes di `logic.test.mjs`. Cek: 5 viewport maju/mundur, node dan tombol, reduced motion, GSAP diblokir, EN, regresi cerita lain dan etalase, typecheck, ESLint, Prettier, `next build`.

### 7.6 Hasil implementasi (22 Nov)

- Baru: `content/solusi/cerita/followup-prospek.ts`, `components/solusi/detail/PanggungProspek.tsx`, `ceritaFilmProspek.ts`, gaya `fp-*` di `detail.css`, `tools/solusi/fp1-qa.mjs`.
- Diubah: `cerita/schema.ts` (`ProspekCeritaSchema`: hanya baris terpilih yang menunggu dan diam lebih dari batas hari, kartu prospek = nama dan ringkasan baris itu, chip mengikuti frasa yang distabilo, draf maksimal 20 kata dan menyebut nama, unit, alasan), `cerita/index.ts`, `ceritaTiming.ts` (`FOLLOWUP_PROSPEK`, 9 adegan, 6 node), `CeritaScroll.tsx` (ikon rel, tanpa malam: `night: -1`), `items/followup-prospek.ts` (copy ID/EN baru, `painsLead`, `built`, kutipan dan angka contoh, klien "Developer perumahan (contoh)", FAQ aturan template), `catalog.ts` (EN), `tools/solusi/logic.test.mjs` (followup-prospek keluar dari tes kesamaan sumber v1, tes FP1, batas jumlah field 250 → 225).
- Panggung: tumpukan chat "nanti saya kabari" + penghitung 9 → kartu 10.00 "Setiap pagi" → kartu melipat ke kepala tabel, empat baris prospek → dua filter, tiga baris meredup, baris Pak Dimas menyala → baris naik jadi kartu, frasa "rumah tipe 45" dan "diskusi dengan istri" jadi chip, chip melebur ke draf AI → draf masuk kartu "Tim marketing", tombol Kirim ditekan, "Terkirim dari nomor tim" → kartu melipat ke baris, status "Sudah disapa", tanggal "Hari ini", tanda "Rancangan" → tiga angka contoh.
- Perbaikan dari cek visual: dua chip filter dan dua chip ringkasan membungkus ke baris kedua (402 px di ruang 400 px), kini satu baris; pil "Sudah disapa" menabrak "Hari ini"; baris Pak Dimas sudah berlatar ungu sebelum disaring (latar dihapus, hanya sorotan saat saring); jarak kosong antara kartu prospek dan draf dipersempit.
- Dicek: `fp1-qa.mjs` 107/107 di dev dan build produksi (5 viewport maju/mundur, latar siang, node dan tombol, reduced motion, GSAP diblokir, EN); regresi build produksi: `ck1` 114/114, `rk1`/`bj1`/`og5` 106/106, `rt1` 31/31, `etalase` 114/114 (error console hanya GSAP yang sengaja diblokir dan 404 analytics Vercel lokal); HTML server 11 `h3` (9 caption + 2 kecocokan), canonical ID/EN, tanpa nomor, prompt, nama model, em dash; typecheck, ESLint, Prettier, `logic.test.mjs` 17/17, `next build`. Screenshot hanya di chat.
- 22 Nov: user menyatakan sudah sesuai dan meminta commit (tanpa push). Belum: tes HP Android user, review tim.
