# Detail Solusi: Ide konten mingguan dari tren media sosial

Tanggal: 7 Nov 2026. Status: **RK1 selesai teknis 21 Nov 2026** (cerita Tonton pastel dari rancangan workflow, copy ID/EN diselaraskan, status `ide`, lihat bagian 7); menunggu review user dan tes HP.

Induk: [PLAN-SOLUSI](../../../PLAN-SOLUSI.md). Kontrak template, route, mesin, dan QA: [PLAN-DETAIL](PLAN-DETAIL.md). Dokumen ini hanya menjabarkan kebutuhan khusus `riset-konten`.

## 1. Identitas dan sumber

| Item | Nilai dari sumber |
|---|---|
| Slug | `riset-konten` |
| Status layanan | Sudah berjalan (bukan status pengerjaan website) |
| Route target | `/solusi/riset-konten` dan `/en/solutions/riset-konten` |
| Industri | Retail & F&B, Jasa, Klinik |
| Tim | Marketing |
| Aplikasi | Instagram, Google Sheets |
| Sumber konten | [COPY katalog bagian 19.4](../../SOLUSI-V1-COPY.md#194-riset-konten) |
| Ringkasan | [COPY katalog bagian 15](../../SOLUSI-V1-COPY.md#15-ringkasan-pendek-di-kartu-ringkasan-ringkas-data-baru) |
| Referensi detail khusus | Belum diberikan; prototipe Order Grup hanya acuan template bersama |

Pertanyaan utama: **Bagaimana menemukan ide konten media sosial setiap minggu tanpa riset manual?**

Jawaban dari sumber: Setiap minggu, tren dan pertanyaan yang ramai di media sosial dikumpulkan sesuai topik usaha Anda, lalu disusun menjadi daftar ide konten di Google Sheets lengkap dengan sudut pandang dan contoh judul. Tim marketing tinggal memilih dan menulis.

## 2. Lingkup HTML pertama

Gunakan hero/jawaban, ringkasan, masalah, langkah berikut, perbandingan, kecocokan, persiapan, aplikasi, FAQ, CTA kontekstual, dan solusi terkait dari template bersama. Konten lengkap tetap dibaca dari sumber bagian 19.4, bukan disalin menjadi sumber data kedua di plan.

Sumber memuat status layanan Sudah berjalan dan contoh hasil. Verifikasi status, angka, kutipan, dan izin publikasi; label contoh tidak boleh hilang hanya karena statusnya sudah berjalan.

Field tambahan template baru (`painsLead`, `built`, terjemahan EN, dan kutipan opsional) diaudit pada P0; buat draf hanya berdasarkan sumber lalu review. Jika belum tersedia, tandai kekurangannya. Kontak, SEO, fallback, dan navigasi mengikuti PLAN-DETAIL.

## 3. Alur yang sudah tersedia

Ini daftar langkah HTML dari katalog, **belum** storyboard atau keputusan jumlah adegan 3D.

| Langkah | Judul | Penjelasan |
|---|---|---|
| 1 | Topik usaha ditentukan | Anda memilih topik dan akun yang ingin dipantau. |
| 2 | Tren dikumpulkan | Pembahasan yang sedang ramai dirangkum setiap minggu. |
| 3 | Ide konten disusun | Setiap ide punya sudut pandang dan contoh judul. |
| 4 | Tim memilih | Ide yang dipilih masuk ke kalender konten. |

Catatan khusus untuk review: Bedakan temuan tren, usulan ide, dan konten yang sudah disetujui. Jangan menambahkan klaim peningkatan engagement dari contoh ide.

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
- Belum ada prototipe/storyboard, daftar set/aktor, teks dunia, kamera maupun timing khusus `riset-konten`. Jumlah adegan tidak diasumsikan sembilan seperti Order Grup.
- Jika akan memiliki cerita: selesaikan hubungan inline/Tonton sesuai induk, tujuan adegan, data fiktif yang dipakai, serta batas performa sebelum membangun set.
- Ikuti kebijakan solusi terkait yang disepakati bersama; override editorial harus berupa data eksplisit dengan slug valid.

## 6. Kriteria selesai dan log

- [ ] P0–P2 selesai dan checklist PLAN-DETAIL terpenuhi untuk ID/EN.
- [ ] Isi dan batas layanan sesuai sumber; contoh tidak berubah menjadi klaim hasil nyata.
- [ ] Cara kerja dapat dibaca tanpa 3D; CTA dan navigasi berfungsi.
- [ ] Review mencatat tanggal, screenshot, build/perangkat yang diuji, serta kekurangan yang masih terbuka.
- [ ] Status cerita dilaporkan terpisah: belum tersedia / direncanakan / berjalan / direview / selesai.

7 Nov 2026: subplan awal dibuat dari konten katalog atas permintaan pemisahan plan. Belum ada implementasi atau persetujuan storyboard baru.

## 7. RK1: cerita Tonton dari workflow nyata (disetujui 21 Nov 2026, selesai teknis, menunggu review user)

Permintaan user 21 Nov: setelah pencocokan workflow di instance `n8n-kreatekno` dengan 12 halaman Solusi, user memilih `riset-konten` sebagai cerita Tonton berikutnya. Gaya dan mesin mengikuti Order Grup OG5c dan Booking Jasa BJ1 (panggung pastel, caption `h3` + `p`, rel workflow, studi kasus di bawah tanpa tab) serta skill `n8n-portfolio-prototype`. Tidak ada library baru.

### 7.1 Workflow yang dibaca (hanya baca, tidak dijalankan)

| Workflow (nama disamarkan) | Node | Status | Peran |
|---|---|---|---|
| Riset utama | 22 | Nonaktif, 0 eksekusi | Topik bergilir → AI riset tren → kata kunci → cari post ramai → AI membaca pola → tabel riset → notifikasi tim |
| Persetujuan | 5 | Nonaktif, 0 eksekusi | Tombol setuju/lewati dari tim → baris riset diberi status DISETUJUI/DILEWATI → pesan diedit |

Alur riset utama (urutan asli):
1. **Topik bergilir** (Code): 15 topik pebisnis kecil (keuangan, marketing, tim, mindset, strategi, teknologi). Dua sesi sehari, pagi 08.00 dan malam 20.00; sesi malam memakai topik lain (geser 7), siklus 15 hari A/B. Tiap topik punya umur riset sendiri (7, 14 atau 30 hari).
2. **AI riset tren** (model riset web): ringkasan faktual tren, isu yang ramai dan pergeseran cara pandang di Indonesia untuk topik itu.
3. **AI membuat kata kunci** → disimpan ke tabel bank kata kunci.
4. **Cari post ramai** (scraper media sosial): cari dengan kata kunci, urutkan menurut jumlah suka, ambil 5 akun teratas, lalu ambil post mereka dan simpan 10 post teratas.
5. **AI membaca pola** dari 10 post: keluhan audiens, skor ramai (dari 10), sudut konten, kata kunci utama.
6. **Tabel riset mentah** (Sheets, append) → **notifikasi** ke grup tim: topik, kata kunci, keluhan, skor ramai, sudut konten, ID sesi.

Temuan yang mengubah halaman:
- **Workflow belum pernah berjalan.** Keduanya nonaktif dan tanpa eksekusi. Pemicu masih manual (belum terjadwal), ID tabel masih placeholder, aktor scraper kosong, prompt kata kunci dan analisis kosong, satu node riset HTTP tidak tersambung. Status katalog "Sudah berjalan" dan klien "Brand edukasi bisnis, Jakarta" tidak didukung bukti dari instance ini.
- **Persetujuan belum tersambung.** Notifikasi riset tidak memuat tombol, padahal workflow persetujuan menunggu klik tombol. Cerita boleh menampilkan langkah ini sebagai rancangan, bukan sebagai fakta yang sudah berjalan.
- **Ritme dua kali sehari dengan topik bergilir**, bukan "setiap minggu" / "daftar siap setiap Senin".
- **Platform yang dibaca Threads**, bukan Instagram. `AppSchema` belum punya `threads`.
- **Hasil per sesi berupa satu baris riset** (keluhan audiens, sudut konten, skor ramai, kata kunci), bukan "20 ide dengan contoh judul". Tidak ada kalender konten; yang ada status disetujui/dilewati di tabel.

Yang tidak masuk halaman: nama klien atau brand, nama bot, daftar topik asli secara utuh, isi prompt, ID tabel/kredensial/webhook, model dan nama layanan di Tonton (hanya di "Alat yang dipakai").

### 7.2 Langkah (rel workflow, 6 node, `--gaps: 5`)

| # | Rel | Isi | AI |
|---|---|---|---|
| 1 | Topik dipilih | Topik berganti tiap sesi pagi dan malam | |
| 2 | AI riset tren | Ringkasan tren terbaru + kata kunci | ya |
| 3 | Post ramai | Post dengan suka terbanyak dikumpulkan | |
| 4 | AI membaca pola | Keluhan audiens, sudut konten, skor ramai | ya |
| 5 | Tabel riset | Hasil tersimpan satu baris per sesi | |
| 6 | Tim memilih | Setuju atau lewati dari grup tim | |

### 7.3 Adegan ("satu topik berjalan")

| # | Kicker | Caption (draf) | Kanvas |
|---|---|---|---|
| 1 | Sebelum | Ide konten dicari dari nol, berjam-jam setiap minggu. | Catatan ide berserakan dengan tanda tanya, penghitung "jam riset" naik ke 4 j |
| 2 | Langkah 1 · Topik | Setiap pagi dan malam, topik riset berganti sendiri. | Catatan merapat jadi daftar topik yang bergulir; satu berhenti dan menyala: "Cashflow usaha", pil "Pagi" |
| 3 | Langkah 2 · AI riset tren | AI merangkum apa yang sedang ramai soal topik itu. | Pil topik melebar jadi kartu ringkasan; stabilo di tiga frasa yang lepas jadi chip kata kunci ("telat bayar", "modal kerja", "tagihan") |
| 4 | Langkah 3 · Post ramai | Post yang paling banyak disukai dikumpulkan. | Chip kata kunci menarik kartu post kecil dengan angka suka; kartu berurut, 10 teratas tinggal, sisanya pudar |
| 5 | Langkah 4 · AI membaca pola | AI membaca keluhan audiens dan sudut kontennya. | 10 kartu menyatu jadi kartu analisis: 3 keluhan, 1 sudut konten, skor ramai 8/10 |
| 6 | Langkah 5 · Tabel riset | Hasil riset tersimpan rapi, satu baris tiap sesi. | Kartu analisis melipat jadi baris tabel (Topik, Keluhan, Sudut, Skor, Status "Baru") di bawah baris sesi sebelumnya |
| 7 | Langkah 6 · Tim memilih | Sesi malam masuk ke grup tim. Tim cukup memilih. | Panggung malam (sesi 20.00); kartu ringkasan dengan Setuju/Lewati; Setuju ditekan, status baris jadi "Disetujui" (hijau) |
| 8 | Hasil · angka contoh | Tim marketing mulai menulis dari riset, bukan dari tebakan. | Tiga angka dari `metrics` + pil "angka contoh" |
| 9 | Untuk bisnis Anda | Mau riset konten otomatis seperti ini untuk usaha Anda? | Angka diredupkan; CTA di caption |

Contoh di kanvas: topik "Cashflow usaha", kata kunci dan keluhan fiktif, angka suka fiktif. Usulan `metrics` (angka contoh): 14 riset per minggu (pagi dan malam), 10 post teratas dibaca tiap riset, 4 jam riset manual per minggu yang tidak perlu lagi.

### 7.4 Perubahan file (rencana)

- `content/solusi/cerita/schema.ts`: `RisetCeritaSchema` + panggung riset; `index.ts` mendaftarkan `riset-konten` di `storyFor`.
- `content/solusi/cerita/riset-konten.ts` baru: 9 adegan + teks panggung ID/EN.
- `components/solusi/detail/`: `PanggungRiset.tsx` + `ceritaFilmRiset.ts` baru, konfigurasi slug di `CeritaScroll.tsx` (ikon rel, adegan malam 7), gaya `rk-*` di `detail.css`. Jalur Order Grup dan Booking Jasa tidak berubah.
- `content/solusi/items/riset-konten.ts`: copy disesuaikan dengan keputusan 7.6, ditambah `painsLead`, `built`, kutipan contoh, dan `en`.
- `tools/solusi/rk1-qa.mjs` baru (pola `bj1-qa.mjs`), tes cerita dan anonimitas di `logic.test.mjs`.

### 7.5 Cek

Sama dengan BJ1: 9 adegan maju/mundur di 1440×900, 1024×1366, 390×844, 360×740 dan 1897×940; malam; node dan tombol; reduced motion; GSAP diblokir; EN; tanpa scroll ke samping; regresi Order Grup dan Booking Jasa; typecheck, ESLint, Prettier, `logic.test.mjs`, `next build`. Screenshot hanya di chat.

### 7.6 Keputusan user (21 Nov 2026)

- Status layanan jadi `ide`; klien ditulis sebagai contoh: "Brand edukasi bisnis (contoh)". Cerita memakai rancangan workflow apa adanya, dan langkah persetujuan ditulis sebagai bagian rancangan.
- Copy diselaraskan dengan workflow: riset pagi dan malam dengan topik bergilir, hasil berupa keluhan audiens, sudut konten dan skor ramai, tim memilih Setuju/Lewati. Tanpa "20 ide setiap minggu", "setiap Senin" dan "kalender konten". Ditambah `painsLead`, `built`, kutipan contoh dan `en`.
- Aplikasi: tambah `threads` ke `AppSchema` dan taksonomi (ikon `ThreadsLogo` Phosphor); `riset-konten` memakai Threads + Google Sheets.
- Contoh kanvas: topik "Cashflow usaha", kata kunci dan post fiktif.

### 7.7 Hasil implementasi (21 Nov)

- Baru: `content/solusi/cerita/riset-konten.ts`, `components/solusi/detail/PanggungRiset.tsx`, `ceritaFilmRiset.ts`, gaya `rk-*` di `detail.css`, `tools/solusi/rk1-qa.mjs`.
- Diubah: `cerita/schema.ts` (`RisetCeritaSchema`: kata kunci sama dengan frasa yang distabilo, topik dan skor sama di kartu, baris dan ringkasan), `cerita/index.ts`, `ceritaTiming.ts` (`RISET_KONTEN`), `CeritaScroll.tsx` (ikon rel, malam di adegan 2, film lazy), `items/riset-konten.ts` (status `ide`, Threads + Sheets, copy ID/EN baru, `painsLead`, `built`, kutipan contoh), `catalog.ts` (EN), `schema.ts` + `taksonomi.ts` (`threads`, ikon `ThreadsLogo`, warna #1C1C1C), `RakBox.tsx` dan `SolutionDetail.tsx` (ikon Threads), `tools/solusi/logic.test.mjs` (riset-konten keluar dari tes kesamaan sumber v1, tes cerita dan isi baru, jumlah "Sudah berjalan" 4 → 3).
- Panggung: catatan ide berserakan + penghitung 4 jam → daftar 5 topik, sorotan berhenti di "Cashflow usaha" (malam) → pil topik, ringkasan tren, tiga frasa jadi chip kata kunci → chip naik, 6 post masuk acak lalu berurut menurut suka, dua terbawah meredup → 4 post teratas menyatu jadi kartu pola audiens (3 keluhan, sudut konten, skor 8/10) → kartu jadi baris baru tabel riset → ringkasan ke grup tim, Setuju ditekan, status Baru → Disetujui → tiga angka contoh.
- Kartu post dinaikkan ke 108 px setelah cek visual (angka suka tertimpa teks dua baris).
