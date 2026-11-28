# Detail Solusi: Nota belanja tercatat cukup dengan satu foto

Status 27 Nov 2026: **N0 dan N1a disetujui. Cerita Tonton N2 selesai teknis dan sudah direview user. Tes HP Android belum tercatat.**

Induk: [PLAN-KATALOG-N8N](PLAN-KATALOG-N8N.md) bagian 4.1 (sumber, rel draf, temuan, keputusan). Kontrak template, route, mesin dan QA: [PLAN-DETAIL](PLAN-DETAIL.md). Dokumen ini hanya mencatat status dan keputusan khusus `catat-pengeluaran`.

## 1. Identitas

| Item | Nilai |
|---|---|
| Slug | `catat-pengeluaran` |
| Status layanan | Siap dibuat (`ide`); bukan pekerjaan klien |
| Route | `/solusi/catat-pengeluaran` dan `/en/solutions/catat-pengeluaran` |
| Industri | Retail & F&B, Jasa |
| Tim | Keuangan & admin, Manajemen |
| Aplikasi | WhatsApp, Google Sheets |
| Sumber | Template publik n8n.io [5201](https://n8n.io/workflows/5201), [4136](https://n8n.io/workflows/4136), [4020](https://n8n.io/workflows/4020) |
| Data | `site/content/solusi/items/catat-pengeluaran.ts`, EN katalog di `catalog.ts` |
| Kode Tonton | `cp` (prefix CSS `cp-*`, QA `tools/solusi/cp1-qa.mjs`) |

## 2. Tahapan

| Tahap | Isi | Status |
|---|---|---|
| N0 | Slug, copy katalog ID (pertanyaan, jawaban, masalah, langkah, perbandingan, kecocokan, persiapan, FAQ), ringkasan EN, kartu masalah, kotak etalase | Disetujui 23 Nov |
| N1a | Copy ID/EN lengkap seperti FP1: `painsLead`, `built`, kutipan contoh, angka contoh, klien "(contoh)", `en` | Disetujui 24 Nov |
| N2 | Storyboard → review → cerita Tonton → QA → review | Selesai teknis 24 Nov (bagian 4.5), direview 27 Nov |

## 3. Log

- 23 Nov 2026 (N0): item dan subplan dibuat. Copy katalog ditulis dari alur template, tanpa menyalin teks atau prompt template.
- 23 Nov 2026 (N1a): copy ID/EN lengkap dengan klien set A; rincian di PLAN-KATALOG-N8N bagian 10.
- 27 Nov 2026 (N2): user menyatakan review sudah dilakukan dan meminta lanjut ke N3.

## 4. N2: cerita Tonton "satu nota berjalan" (selesai teknis 24 Nov 2026, direview 27 Nov)

Permintaan user 24 Nov: "Sesuai, mulai N2". Pola sama dengan FP1/CK1: panggung pastel HTML/CSS, film GSAP yang dimuat belakangan, caption `h3` + `p`, rel workflow di atas panggung, studi kasus Baca di bawahnya. Tidak ada library baru. Sumber alur: template n8n.io 5201, 4136, 4020 (lihat PLAN-KATALOG-N8N 4.1); data contoh, bukan klien nyata.

Riset awal tahap: tidak ada temuan baru yang mengubah plan. Aturan yang sudah dicatat tetap berlaku: rekap pagi ke pemilik di luar jendela 24 jam memakai template pesan yang disetujui; bot dengan tugas sempit (mencatat nota) diizinkan kebijakan WhatsApp Business 2026.

### 4.1 Keputusan user (24 Nov)

- Data contoh set usulan: staf **Rina, Cabang Sudirman**, nota **Toko Sumber Makmur**: susu UHT 2 karton Rp112.000, gula aren 2 kg Rp52.000, es batu 3 kantong Rp22.500, **total Rp186.500**, kategori **Bahan baku**. Rekap pagi 08.00: pengeluaran kemarin **Rp642.500** (Bahan baku Rp412.500, Operasional Rp150.000, Kemasan Rp80.000).
- Langkah "Dicek" menampilkan dua jalur: nota Rina lolos ("Total terbaca"), dan nota buram dari staf lain dibalas "Total tidak terbaca, kirim ulang ya".
- Langkah "Nota dikirim" menampilkan tiga ikon cara kirim (foto, ketikan, pesan suara), lalu foto nota yang dipilih.

### 4.2 Rel workflow (6 node, satu adegan per node)

| # | Rel | Isi | AI |
|---|---|---|---|
| 1 | Nota dikirim | Foto, ketikan, atau pesan suara ke nomor usaha | |
| 2 | Isi dibaca | Teks dibaca dari foto (atau suara ditranskrip) | |
| 3 | AI menyusun | Toko, tanggal, total, kategori | ya |
| 4 | Dicek | Total terbaca? Kalau tidak, minta kirim ulang | |
| 5 | Tercatat | Satu baris di tabel pengeluaran + balasan konfirmasi | |
| 6 | Rekap pagi | Ringkasan pengeluaran kemarin ke pemilik, 08.00 | |

### 4.3 Adegan (9)

| # | Kicker | Caption (draf) | Kanvas |
|---|---|---|---|
| 1 | Sebelum | Nota belanja menumpuk sampai akhir bulan. | Tumpukan nota miring di dompet dan kisi galeri foto; penghitung "nota belum dicatat" naik sampai 23; label kalender "Akhir bulan" |
| 2 | Langkah 1 · Nota dikirim | Rina memotret nota, lalu mengirimnya ke nomor usaha. | Tiga ikon (foto, ketikan, suara) muncul, ikon foto menyala; bubble foto nota Toko Sumber Makmur masuk ke chat "Catat pengeluaran", pengirim "Rina · Cabang Sudirman" |
| 3 | Langkah 2 · Isi dibaca | Isi nota dibaca: toko, tanggal, barang, dan total. | Foto nota membesar; garis pindai turun; baris toko, tanggal, tiga barang, dan total distabilo bergantian |
| 4 | Langkah 3 · AI menyusun | AI menyusun catatan yang rapi dan memberi kategori. | Frasa yang distabilo terbang jadi empat chip: Toko Sumber Makmur, 23 Nov, Rp186.500, kategori "Bahan baku" (chip kategori muncul terakhir dengan tanda AI) |
| 5 | Langkah 4 · Dicek | Nota yang totalnya tidak terbaca diminta dikirim ulang. | Kiri: kartu Rina dengan centang "Total terbaca". Kanan: nota buram dari staf lain, tanda silang, balasan "Total tidak terbaca, kirim ulang ya" |
| 6 | Langkah 5 · Tercatat | Catatan masuk ke tabel, dan Rina menerima konfirmasi. | Chip melipat jadi baris baru di tabel "Pengeluaran" (tanggal, cabang, toko, kategori, total); balasan ke Rina: "Tercatat: Toko Sumber Makmur, Rp186.500, Bahan baku" |
| 7 | Langkah 6 · Rekap pagi | Pukul delapan pagi, pemilik menerima rekap pengeluaran kemarin. | Jam 08.00; kartu pesan untuk pemilik: total Rp642.500 dengan tiga batang kategori (Bahan baku Rp412.500, Operasional Rp150.000, Kemasan Rp80.000) |
| 8 | Hasil · angka contoh | Setiap nota tercatat di hari yang sama. | Tiga angka contoh dari item: 1 foto, 3 cara kirim, 1 rekap pukul 08.00 |
| 9 | Untuk bisnis Anda | Mau nota belanja tidak lagi menumpuk? | Angka meredup, CTA "Konsultasi gratis" |

Panggung siang (tanpa adegan malam). Teks panggung dan caption tanpa nama platform; label chat "Catat pengeluaran" dan "Pemilik".

### 4.4 Perubahan file (rencana) dan cek

- Baru: `content/solusi/cerita/catat-pengeluaran.ts` (ID/EN), `components/solusi/detail/PanggungNota.tsx`, `ceritaFilmNota.ts`, gaya `cp-*` di `detail.css`, `tools/solusi/cp1-qa.mjs`.
- Diubah: `cerita/schema.ts` (`NotaCeritaSchema` dengan aturan silang: jumlah barang = total, kategori rekap = total rekap, total nota termasuk di bahan baku, balasan konfirmasi menyebut toko/total/kategori, tepat satu nota buram), `cerita/index.ts`, `ceritaTiming.ts` (`CATAT_PENGELUARAN`, 9 adegan, 6 node), `CeritaScroll.tsx` (ikon rel, tanpa malam), `SolutionDetail.tsx` bila perlu, `logic.test.mjs` (tes CP1).
- Cek: `cp1-qa.mjs` (5 viewport maju/mundur, node dan tombol rel, reduced motion, GSAP diblokir, EN), regresi `og5`/`bj1`/`rk1`/`ck1`/`fp1`, `rt1`, `etalase`, `s8`, typecheck, ESLint, Prettier, `next build`; QA cerita dijalankan saat CPU sepi. Screenshot hanya di chat.

### 4.5 Hasil implementasi (24 Nov)

- User menyetujui storyboard ("Sesuai, implementasi").
- Baru: `content/solusi/cerita/catat-pengeluaran.ts`, `components/solusi/detail/PanggungNota.tsx`, `ceritaFilmNota.ts`, gaya `cp-*` di `detail.css`, `tools/solusi/cp1-qa.mjs`.
- Diubah: `cerita/schema.ts` (`NotaCeritaSchema`: tiga barang = total nota, chip toko/tanggal/total = isi nota, chip kategori = kategori nota, baris baru = nota, konfirmasi menyebut toko/total/kategori, rincian rekap = total rekap dan memuat nota; helper `rupiah`), `cerita/index.ts`, `ceritaTiming.ts` (`CATAT_PENGELUARAN`, 9 adegan, 6 node), `CeritaScroll.tsx` (ikon rel Kamera, Pindai, AI, Centang, Tabel, Matahari; tanpa malam), `logic.test.mjs` (tes CP1, termasuk aturan skema yang harus menolak harga yang tidak menjumlah).
- Panggung: slip nota bergulir + penghitung 23 → tiga cara kirim, foto dipilih dan masuk ke chat "Catat pengeluaran" → foto membesar menjadi nota, garis pindai turun, baris distabilo → toko, tanggal, total terangkat jadi chip, chip kategori "Bahan baku" muncul dengan tanda AI → nota melipat ke kartu "Total terbaca", di sampingnya nota buram "Total tidak terbaca" dan balasan minta kirim ulang → kartu melipat ke baris baru tabel Pengeluaran + konfirmasi ke Rina → jam 08.00 dan rekap Rp642.500 dengan tiga batang kategori → tiga angka contoh.
- `PanggungNota` menyalin helper `rupiah` secara lokal, karena impor runtime dari modul skema akan memasukkan zod ke bundle client (dicek: tidak ada chunk client berisi zod).
- Perbaikan dari cek visual: nama toko di nota mini chat terpotong, thumbnail dilebarkan ke 190 px.
- Dicek di build produksi: `cp1-qa.mjs` 107/107 (5 viewport maju/mundur, latar siang, node dan tombol rel, reduced motion, GSAP diblokir, EN; run pertama 104/107 saat CPU 61% sesudah build, kegagalan caption tertinggal), regresi `og5`/`bj1`/`rk1` 106/106, `ck1` 114/114, `fp1` 107/107, `rt1` 41/41, `etalase` 114/114, `s8` 1320/1320 (error console hanya GSAP yang sengaja diblokir dan 404 analytics lokal); `logic.test.mjs` 20/20, typecheck, ESLint, Prettier, `next build`. Screenshot hanya di chat.
- Belum: review user, tes HP Android. Tidak ada commit/push.
