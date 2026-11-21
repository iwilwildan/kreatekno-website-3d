# Detail Solusi: Pertanyaan pasien terjawab di luar jam kerja

Tanggal: 7 Nov 2026. Status: **rencana awal HTML dari katalog; belum diimplementasikan; storyboard 3D belum tersedia**.

Induk: [PLAN-SOLUSI](../../../PLAN-SOLUSI.md). Kontrak template, route, mesin, dan QA: [PLAN-DETAIL](PLAN-DETAIL.md). Dokumen ini hanya menjabarkan kebutuhan khusus `cs-klinik`.

## 1. Identitas dan sumber

| Item | Nilai dari sumber |
|---|---|
| Slug | `cs-klinik` |
| Status layanan | Siap dibuat (bukan status pengerjaan website) |
| Route target | `/solusi/cs-klinik` dan `/en/solutions/cs-klinik` |
| Industri | Klinik |
| Tim | Layanan pelanggan |
| Aplikasi | WhatsApp, Google Calendar |
| Sumber konten | [COPY katalog bagian 19.5](../../SOLUSI-V1-COPY.md#195-cs-klinik) |
| Ringkasan | [COPY katalog bagian 15](../../SOLUSI-V1-COPY.md#15-ringkasan-pendek-di-kartu-ringkasan-ringkas-data-baru) |
| Referensi detail khusus | Belum diberikan; prototipe Order Grup hanya acuan template bersama |

Pertanyaan utama: **Bagaimana klinik menjawab chat pasien di malam hari tanpa menambah staf?**

Jawaban dari sumber: Asisten CS menjawab pertanyaan pasien yang paling sering muncul, seperti jam praktik, harga, dan jadwal dokter, dari data klinik Anda sendiri. Pasien bisa langsung membuat janji temu, dan pertanyaan medis selalu diteruskan ke staf klinik.

## 2. Lingkup HTML pertama

Gunakan hero/jawaban, ringkasan, masalah, langkah berikut, perbandingan, kecocokan, persiapan, aplikasi, FAQ, CTA kontekstual, dan solusi terkait dari template bersama. Konten lengkap tetap dibaca dari sumber bagian 19.5, bukan disalin menjadi sumber data kedua di plan.

Status layanan Siap dibuat: tampilkan sebagai usulan solusi. Jangan membuat klien, testimoni, atau hasil implementasi nyata. Section hasil hanya muncul bila jenis bukti dan labelnya telah disepakati.

Field tambahan template baru (`painsLead`, `built`, terjemahan EN, dan kutipan opsional) diaudit pada P0; buat draf hanya berdasarkan sumber lalu review. Jika belum tersedia, tandai kekurangannya. Kontak, SEO, fallback, dan navigasi mengikuti PLAN-DETAIL.

## 3. Alur yang sudah tersedia

Ini daftar langkah HTML dari katalog, **belum** storyboard atau keputusan jumlah adegan 3D.

| Langkah | Judul | Penjelasan |
|---|---|---|
| 1 | Pasien bertanya lewat chat | Lewat nomor WhatsApp klinik yang sudah dikenal pasien. |
| 2 | Asisten menjawab dari data klinik | Jam praktik, harga, dan jadwal dokter sesuai data Anda. |
| 3 | Janji temu tercatat | Pasien memilih jadwal dan janji temu masuk ke kalender. |
| 4 | Staf menangani pertanyaan medis | Pertanyaan medis selalu diteruskan ke staf klinik. |

Catatan khusus untuk review: Narasi hanya menjelaskan informasi administratif dan janji temu; pertanyaan medis diteruskan ke staf sesuai isi sumber. Jangan membuat adegan asisten mendiagnosis atau memberi saran medis.

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
- Belum ada prototipe/storyboard, daftar set/aktor, teks dunia, kamera maupun timing khusus `cs-klinik`. Jumlah adegan tidak diasumsikan sembilan seperti Order Grup.
- Jika akan memiliki cerita: selesaikan hubungan inline/Tonton sesuai induk, tujuan adegan, data fiktif yang dipakai, serta batas performa sebelum membangun set.
- Ikuti kebijakan solusi terkait yang disepakati bersama; override editorial harus berupa data eksplisit dengan slug valid.

## 6. Kriteria selesai dan log

- [ ] P0–P2 selesai dan checklist PLAN-DETAIL terpenuhi untuk ID/EN.
- [ ] Isi dan batas layanan sesuai sumber; contoh tidak berubah menjadi klaim hasil nyata.
- [ ] Cara kerja dapat dibaca tanpa 3D; CTA dan navigasi berfungsi.
- [ ] Review mencatat tanggal, screenshot, build/perangkat yang diuji, serta kekurangan yang masih terbuka.
- [ ] Status cerita dilaporkan terpisah: belum tersedia / direncanakan / berjalan / direview / selesai.

7 Nov 2026: subplan awal dibuat dari konten katalog atas permintaan pemisahan plan. Belum ada implementasi atau persetujuan storyboard baru.

## 7. CK1: cerita Tonton dari workflow nyata (disetujui dan di-commit 21 Nov 2026)

Permintaan user 21 Nov: buat cerita Tonton `cs-klinik` dari workflow di instance `n8n-mcp`. Gaya dan mesin mengikuti Order Grup OG5c, Booking Jasa BJ1 dan Riset Konten RK1 (panggung pastel, caption `h3` + `p`, rel workflow, studi kasus di bawah tanpa tab) serta skill `n8n-portfolio-prototype`. Tidak ada library baru.

### 7.1 Workflow yang dibaca (hanya baca, tidak dijalankan)

| Workflow | Node | Status | Peran |
|---|---|---|---|
| Agen CS | 11 | Aktif, eksekusi terakhir 19 Nov (error) | Sub-workflow: chat masuk → agen AI dengan ingatan per nomor dan tiga alat (cek harga di tabel, cek jadwal kosong, buat janji di kalender) → balasan ke chat + ringkasan ke tabel leads (bersamaan) |
| Induk chat bisnis | 20 | Aktif | Webhook chat bisnis (mode co-existence: aplikasi bisnis dan API di nomor yang sama). Pesan pelanggan diteruskan ke agen CS; balasan admin dari aplikasi terdeteksi sebagai "echo" |

Aturan dari prompt agen (diparafrasekan): balasan sopan, singkat, sapaan "kak", tanpa emoji dan markdown; harga dan stok wajib dari alat cek harga, tidak boleh menebak; booking: cek jadwal dulu, kalau penuh tawarkan maksimal 3 alternatif; data booking nama, tanggal, waktu, tujuan. Keluaran: ringkasan chat satu paragraf + teks balasan. Jadwal dicek dari sekarang sampai seminggu ke depan.

Temuan yang mengubah halaman:
- **Workflow aslinya dipakai untuk booking konsultasi, bukan klinik.** Untuk halaman ini alurnya dipakai apa adanya dengan contoh klinik (status tetap `ide`, klien "(contoh)").
- **Masih mode uji.** Induk hanya meneruskan chat dari satu nomor tertentu, dan agen memakai nilai cadangan nomor serta pesan uji.
- **Alih ke admin belum selesai.** Balasan admin terdeteksi, tetapi langkah "AI berhenti membalas" masih TODO (tidak menulis status ke database). Klaim katalog "Pertanyaan medis selalu diteruskan ke staf" dan "Asisten meneruskan chat ke admin" tidak ada di workflow.
- **Ada tabel ketiga.** Selain kalender, workflow memakai tabel harga dan tabel leads (nomor, tanggal chat terakhir, ringkasan); apps halaman perlu `sheets`.

Yang tidak masuk halaman: nomor telepon, nama persona bot, alamat kalender, ID tabel/kredensial/webhook, isi prompt, nama model di Tonton (hanya di "Aplikasi yang dipakai").

### 7.2 Langkah (rel workflow, 6 node, `--gaps: 5`)

| # | Rel | Isi | AI |
|---|---|---|---|
| 1 | Chat masuk | Pesan pasien diterima kapan saja | |
| 2 | AI membaca chat | Paham maksud, ingat obrolan sebelumnya | ya |
| 3 | Cek harga | Harga diambil dari tabel layanan | |
| 4 | Cek jadwal | Jam kosong seminggu ke depan, maks 3 alternatif | |
| 5 | Janji tercatat | Janji temu masuk ke kalender | |
| 6 | Balas dan catat | Balasan terkirim, ringkasan masuk tabel (bersamaan) | |

### 7.3 Adegan ("satu chat berjalan")

| # | Kicker | Caption (draf) | Kanvas |
|---|---|---|---|
| 1 | Sebelum | Chat pasien yang masuk malam baru dibalas besok pagi. | Bubble pertanyaan menumpuk, penghitung "belum dibalas" naik ke 12 |
| 2 | Langkah 1 · Chat masuk | Pukul sembilan malam, chat pasien tetap diterima. | Panggung malam; tumpukan menyusut jadi satu chat: "Scaling berapa kak? Besok jam 7 malam bisa?" |
| 3 | Langkah 2 · AI membaca | AI memahami pertanyaan dan mengingat obrolan sebelumnya. | Stabilo di "Scaling" dan "besok jam 7 malam", dua frasa lepas jadi chip (layanan, waktu) |
| 4 | Langkah 3 · Cek harga | Harga diambil dari tabel layanan klinik, bukan ditebak. | Chip "Scaling" terbang ke daftar layanan; baris "Scaling · Rp350.000" menyala |
| 5 | Langkah 4 · Cek jadwal | Jam yang diminta penuh? Tiga jam lain ditawarkan. | Chip waktu jatuh ke deret slot besok; 19.00 "terisi", tiga slot alternatif menyala |
| 6 | Langkah 5 · Janji tercatat | Pasien memilih jam, janji temu langsung masuk kalender. | Bubble "19.30 aja kak"; slot 19.30 jadi blok janji "Scaling" |
| 7 | Langkah 6 · Balas dan catat | Balasan terkirim, ringkasan chat tercatat untuk admin. | Bubble balasan "Siap kak, besok 19.30" + baris leads (nomor disamarkan, tanggal, ringkasan) muncul bersamaan |
| 8 | Hasil · angka contoh | Admin datang pagi, janji temu sudah tersusun. | Tiga angka dari `metrics` + pil "angka contoh" |
| 9 | Untuk bisnis Anda | Mau chat pasien terjawab di luar jam kerja? | Angka diredupkan; CTA di caption |

Usulan `metrics` (angka contoh): 1 menit (balasan pertama, termasuk malam hari), 3 pilihan jam (ditawarkan saat jadwal penuh), 1 baris (catatan per pasien, dengan ringkasan chat).

### 7.4 Perubahan file (rencana)

- `content/solusi/cerita/schema.ts`: `KlinikCeritaSchema` + panggung klinik; `index.ts` mendaftarkan `cs-klinik` di `storyFor`.
- `content/solusi/cerita/cs-klinik.ts` baru: 9 adegan + teks panggung ID/EN.
- `components/solusi/detail/`: `PanggungKlinik.tsx` + `ceritaFilmKlinik.ts` baru, konfigurasi slug di `CeritaScroll.tsx` (ikon rel, malam di adegan 2, film lazy), `ceritaTiming.ts`, gaya `ck-*` di `detail.css`. Jalur Order Grup, Booking Jasa dan Riset Konten tidak berubah.
- `content/solusi/items/cs-klinik.ts`: copy disesuaikan dengan workflow dan keputusan 7.6, apps + `sheets`, ditambah `painsLead`, `built`, kutipan contoh, `metrics` contoh dan `en`; `catalog.ts` (EN) bila perlu.
- `tools/solusi/ck1-qa.mjs` baru (pola `rk1-qa.mjs`), tes cerita dan anonimitas di `logic.test.mjs`.

### 7.5 Cek

Sama dengan RK1: 9 adegan maju/mundur di 1440×900, 1024×1366, 390×844, 360×740 dan 1897×940; malam; node dan tombol; reduced motion; GSAP diblokir; EN; tanpa scroll ke samping; regresi Order Grup, Booking Jasa, Riset Konten, rak terkait dan etalase; typecheck, ESLint, Prettier, `logic.test.mjs`, `next build`. Screenshot hanya di chat.

### 7.6 Keputusan user (21 Nov 2026)

- Pertanyaan medis dan alih ke staf **dijadikan adegan Tonton** dengan tanda rancangan (cerita jadi 10 adegan, rel 7 node, `--gaps: 6`): adegan 8 "Langkah 7 · Ke staf". Chat kedua pasien berisi pertanyaan medis, AI tidak menjawabnya, chat diteruskan ke staf dan status baris leads jadi "Ke staf". Copy Baca dan FAQ menyebut langkah ini sebagai rancangan untuk klinik (belum ada di workflow asli).
- Contoh kanvas: klinik gigi, chat "Scaling berapa kak? Besok jam 7 malam bisa?", harga Rp350.000, 19.00 terisi, alternatif 18.00, 19.30, 20.00. Klien "Klinik gigi (contoh)".
- Panggung malam di adegan 2 (Langkah 1 · Chat masuk).
- Status layanan tetap `ide`; apps WhatsApp + Google Calendar + Google Sheets.

### 7.7 Hasil implementasi (21 Nov)

- Baru: `content/solusi/cerita/cs-klinik.ts`, `components/solusi/detail/PanggungKlinik.tsx`, `ceritaFilmKlinik.ts`, gaya `ck-*` di `detail.css`, `tools/solusi/ck1-qa.mjs`.
- Diubah: `cerita/schema.ts` (`KlinikCeritaSchema`: chip mengikuti frasa yang distabilo, baris harga = layanan yang ditanya, satu slot terisi dan satu slot dipilih, jam pilihan ada di chat pasien dan balasan, ringkasan memuat harga dan jam), `cerita/index.ts`, `ceritaTiming.ts` (`makeTiming(sc, nodes)` dengan jumlah node rel, `CS_KLINIK` 10 adegan 7 node), `CeritaScroll.tsx` (panjang reel per cerita, 12 layar untuk CS Klinik; status node dan paket rel memakai jumlah ikon), `detail.css` (paket rel memakai `--gaps`), `SolutionDetail.tsx` (ikon kalender di Aplikasi), `items/cs-klinik.ts` (apps + Sheets, copy ID/EN baru, `painsLead`, `built`, kutipan dan angka contoh, klien "Klinik gigi (contoh)"), `catalog.ts` (EN), `tools/solusi/logic.test.mjs` (cs-klinik keluar dari tes kesamaan sumber v1, tes CK1, batas jumlah field 300 → 250).
- Panggung: tumpukan chat + penghitung 12 → malam, satu chat "Scaling berapa kak? Besok jam 7 malam bisa?" → dua chip (layanan, waktu) → chip layanan masuk baris Scaling di tabel layanan, chip waktu menunggu di bawah → tabel jadi pil harga, chip waktu jatuh ke 19.00 yang terisi, tiga jam lain menyala, tawaran asisten → pasien memilih 19.30, slot jadi janji "Rina · Scaling" → hari dan pil harga melipat ke baris pasien baru, balasan terkirim bersamaan → chat kedua soal gusi bengkak, chip "Pertanyaan medis" masuk kartu "Staf klinik" bertanda "Rancangan", ringkasan baris pasien diperbarui → tiga angka contoh.
- Perbaikan dari cek visual: cincin ungu juga muncul di slot yang terisi (elemen sorotan kini hanya di slot alternatif).
- Perbaikan kedua dari cek visual: slot 19.30 sudah tampil sebagai pilihan (gaya `is-pick` Booking Jasa) sebelum pasien memilih; gaya itu dinetralkan untuk `.ck-slot`.
- Dicek: `ck1-qa.mjs` 114/114 di dev dan dua kali di build produksi (5 viewport maju/mundur, malam, node dan tombol, reduced motion, GSAP diblokir, EN; satu kali gagal 1 cek di run pertama sebelum build ulang: adegan 1 layar 1897 px diukur sebelum penghitung muncul, tidak terulang); regresi build produksi: `rk1-qa.mjs`, `bj1-qa.mjs`, `og5-qa.mjs` 106/106, `rt1-qa.mjs` 31/31, `etalase-qa.mjs` 114/114 (error console hanya GSAP yang sengaja diblokir dan 404 analytics Vercel lokal); HTML server berisi 12 `h3` (10 caption + 2 kecocokan) dan canonical, tanpa nama persona, nomor, model; Baca HP 375 px tanpa scroll samping; typecheck, ESLint, Prettier (file yang diubah), `logic.test.mjs` 16/16, `next build`. Screenshot hanya di chat.
- 21 Nov: user menyatakan sudah sesuai dan meminta commit (tanpa push). Belum: review tim.
