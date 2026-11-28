# Detail Solusi: Booking jasa langsung dari chat pelanggan

Tanggal: 7 Nov 2026. Status: **BJ1 selesai teknis 21 Nov 2026** (cerita Tonton pastel dari workflow nyata, copy ID/EN, lihat bagian 7); menunggu review user dan tes HP.

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

## 7. BJ1: cerita Tonton dari workflow nyata (disetujui 21 Nov 2026, selesai teknis, menunggu review user)

Permintaan user 21 Nov: lengkapi halaman detail `booking-jasa` dengan mengacu ke workflow n8n klien jasa kebersihan (instance `n8n-kreatekno`). Nama klien dan detail sensitif tidak boleh tampil. Gaya mengikuti Order Grup OG5c (panggung Tonton pastel, caption `h3` + `p`, rel workflow, studi kasus di bawah tanpa tab) dan skill `n8n-portfolio-prototype`.

### 7.1 Workflow yang dibaca (hanya baca, tidak dijalankan)

Sistemnya terdiri dari belasan workflow aktif. Yang membentuk cerita:

| Workflow (nama disamarkan) | Node | Peran |
|---|---|---|
| CS kirim (aktif) | 78 | Pesan chat masuk, buang duplikat, gerbang ambil alih admin 30 menit, gabung pesan beruntun 30 detik, anti-banjir, media diteruskan ke tim, panggil "otak", kirim balasan |
| CS otak | 24 | Ambil riwayat 10 pesan + pengaturan, AI menganalisis pesan (tulis ulang pencarian + deteksi eskalasi), cari basis pengetahuan (hybrid vektor + teks), agen CS dengan tool `cari_kb`, `cek_jadwal`, `cari_booking`, `catat_booking`, `ajukan_perubahan` |
| Cek jadwal | 5 | Aturan pasti di kode, bukan AI: minimal H-1, mulai 08.00 dan selesai sebelum 18.00 sesuai durasi, survey 13.00-20.00 berjarak 1 jam, Minggu/libur, periode tutup, bentrok. Hasil BOLEH/TIDAK + saran |
| Catat booking | 8 | Pengaman: H-1, format, link lokasi wajib, satu pelanggan satu booking per tanggal, slot terisi. Simpan dengan nomor booking |
| Sinkron booking | 8 | Tiap 2 menit menyalin booking ke tabel jadwal (Sheets) dan mengirim laporan booking baru ke grup tim (Telegram) |
| Ajukan perubahan → Tombol → Putuskan | 16 + 4 + 20 | Batal/reschedule/ganti/tambah layanan divalidasi, dikirim ke grup tim dengan tombol Ya/Tidak (pengingat menit 15 dan 25). Ya: booking diubah (slot dicek ulang) dan pelanggan dikabari otomatis dalam jendela 24 jam; lewat dari itu tim diminta mengabari manual |
| Notif internal, ambil alih, rangkum | 30 + … | Eskalasi diam-diam (layanan khusus, luar area, komplain, minta manusia) dengan ringkasan AI ke grup tim; balasan manual admin mematikan bot 30 menit untuk pelanggan itu |

Temuan yang mengubah halaman sekarang:
- **Tidak ada Google Calendar.** Booking disimpan di tabel data, disalin ke tabel jadwal (Sheets), dan dilaporkan ke grup tim. Copy sekarang ("kalender tim", `apps: calendar`) tidak sesuai workflow.
- **Pembatalan tidak otomatis membebaskan slot.** Pembatalan dan perubahan selalu lewat persetujuan tim (Ya/Tidak). FAQ "slotnya kembali tersedia" benar setelah tim menyetujui.
- **Booking minimal H-1** dan ada dua jenis: pengerjaan (harga pasti) dan survey gratis (harga setelah survey). Layanan konsultasi (kontrak, kapal) tidak dibooking, diserahkan ke tim.
- Asisten memperkenalkan diri sebagai asisten virtual bila ditanya; permintaan bicara dengan manusia diarahkan ke telepon nomor yang sama.

Yang tidak masuk halaman: nama klien, nama asisten, nama layanan khusus klien, harga asli, ID grup/tabel/kredensial, isi prompt, data eksekusi.

### 7.2 Langkah (rel workflow, 6 node)

| # | Rel | Isi | AI |
|---|---|---|---|
| 1 | Pesan masuk | Pelanggan chat kapan saja; pesan beruntun digabung jadi satu | |
| 2 | AI menjawab | AI memahami kebutuhan, mencari layanan dan harga di daftar layanan | ya |
| 3 | Cek jadwal | Aturan jadwal dicek pasti: H-1, jam kerja sesuai durasi, slot kosong | |
| 4 | Tercatat | Setelah lokasi dikirim, booking tersimpan dengan nomor sendiri | |
| 5 | Tim menerima | Booking masuk tabel jadwal dan laporan ke grup tim | |
| 6 | Perubahan | Reschedule/batal diputuskan tim dengan Ya/Tidak; pelanggan dikabari | |

### 7.3 Adegan ("satu booking berjalan")

| # | Kicker | Caption (draf) | Kanvas |
|---|---|---|---|
| 1 | Sebelum | Chat booking menunggu admin. Jadwal tim tercatat di beberapa tempat. | Bubble pelanggan menumpuk ("besok bisa?", "harga sofa?"), penghitung "chat belum dibalas" naik, satu pil merah "bentrok" |
| 2 | Langkah 1 · Pesan masuk | Pelanggan bertanya kapan saja, malam juga. | Latar ke malam; satu bubble pelanggan naik ke tengah: "cuci sofa 3 dudukan, Sabtu jam 10 bisa?" |
| 3 | Langkah 2 · AI menjawab | AI memahami kebutuhan lalu menyebut harga dari daftar layanan. | Latar terang lagi; stabilo di kata kunci, chip Layanan / Hari / Jam lepas; bubble asisten dengan harga contoh |
| 4 | Langkah 3 · Cek jadwal | Jadwal dicek dengan aturan pasti, bukan tebakan AI. | Strip slot Sabtu: 10.00 sudah terisi (pil "terisi"), 13.00 kosong menyala; tiga centang aturan (H-1, selesai sebelum 18.00, slot kosong) |
| 5 | Langkah 4 · Tercatat | Pelanggan mengirim lokasi, booking tersimpan dengan nomornya. | Pin lokasi; chip bergabung jadi kartu booking #0918 |
| 6 | Langkah 5 · Tim menerima | Tim melihat booking baru di tabel jadwal dan grup tim. | Kartu masuk ke baris tabel jadwal Sabtu; notifikasi "Booking baru" |
| 7 | Langkah 6 · Perubahan | Mau pindah jadwal? Tim cukup menekan Ya. | Bubble "bisa diundur ke Senin?"; kartu permintaan dengan Ya/Tidak; Ya ditekan, baris berubah Sab → Sen, bubble "jadwal sudah diubah" |
| 8 | Hasil · angka contoh | Pelanggan dapat jawaban saat itu, admin fokus ke yang khusus. | Tiga angka besar dari `metrics` + pil "angka contoh" |
| 9 | Untuk bisnis Anda | Mau booking otomatis seperti ini untuk usaha Anda? | Angka diredupkan; CTA di caption |

Contoh di kanvas: pelanggan fiktif "Bu Maya", layanan "Cuci sofa 3 dudukan", harga contoh "Rp250.000" (bukan harga klien), nomor booking contoh.

### 7.4 Perubahan file (rencana)

- `content/solusi/cerita/schema.ts`: schema per slug (union `order-grup` | `booking-jasa`), panggung booking punya schema sendiri. `index.ts` mendaftarkan cerita baru.
- `content/solusi/cerita/booking-jasa.ts` baru: 9 adegan + teks panggung ID/EN.
- `components/solusi/detail/`: `CeritaScroll.tsx` menerima konfigurasi per cerita (node rel + ikon, adegan malam, ukuran kanvas, panggung, film); timing per cerita (`ceritaTiming.ts` jadi fungsi dari daftar durasi); `PanggungBooking.tsx` + `ceritaFilmBooking.ts` baru; gaya `bj-*` di `detail.css`. Jalur Order Grup tidak berubah perilakunya.
- `content/solusi/items/booking-jasa.ts`: copy disesuaikan dengan workflow, ditambah `painsLead`, `built`, `quote` (kutipan contoh), dan `en`.
- `tools/solusi/og5-qa.mjs`: dibuat bisa menguji dua slug, atau QA baru `bj1-qa.mjs`.

### 7.5 Cek

Sama dengan OG5c: 9 adegan maju/mundur di 1440×900, 1024×1366, 390×844, 360×740 dan 1897×940; malam; node dan tombol; reduced motion; GSAP diblokir; EN; tanpa scroll ke samping; regresi Order Grup; typecheck, ESLint, Prettier, `logic.test.mjs`, `next build`. Screenshot hanya di chat.

### 7.6 Keputusan user (21 Nov 2026)

- Copy diselaraskan dengan workflow: "kalender" diganti "tabel jadwal", `apps` jadi WhatsApp + Google Sheets, FAQ pembatalan menyebut persetujuan tim, FAQ baru soal booking minimal H-1.
- Label klien tanpa daerah: "Usaha jasa kebersihan rumah". Tanpa "(contoh)", karena kliennya nyata dan statusnya sudah berjalan; yang berlabel contoh adalah nama, kutipan dan angka.
- Adegan malam di Langkah 1 (pesan masuk pukul 21.40); adegan lain terang.
- Dilengkapi `painsLead`, `built` (5 poin), kutipan berlabel "kutipan contoh", dan seluruh copy `en`.

### 7.7 Hasil implementasi (21 Nov)

- Baru: `content/solusi/cerita/booking-jasa.ts`, `components/solusi/detail/PanggungBooking.tsx`, `ceritaFilmBooking.ts`, gaya `bj-*` di `detail.css`, `tools/solusi/bj1-qa.mjs`.
- Diubah: `ceritaTiming.ts` (`makeTiming` per cerita; ekspor Order Grup tetap), `CeritaScroll.tsx` (konfigurasi per slug: ikon rel, adegan malam, film lazy), `cerita/schema.ts` (`BookingCeritaSchema`), `cerita/index.ts` (`storyFor` mengembalikan `{ slug, copy }`), `SolutionDetail.tsx`, `items/booking-jasa.ts`, `catalog.ts` (EN tanpa calendar), `tools/solusi/logic.test.mjs` (booking-jasa dikecualikan dari tes kesamaan dengan sumber v1, tes cerita booking dan anonimitas baru, filter aplikasi `sheets`).
- Panggung memakai ulang kelas visual Order Grup (`og-bub`, `og-chip`, `og-mx`) dengan objek sendiri: bubble menumpuk, jam malam, stabilo → chip, slot hari Sabtu (10.00 terisi, 13.00 ditawarkan), tiga aturan, lokasi, kartu booking #0918, tabel jadwal + laporan, permintaan pindah jadwal dengan Ya/Tidak, tiga angka contoh.
- Temuan di luar halaman ini: testimoni Home (`messages/*.json`) dan plakat "Trusted by" (`Plaque.tsx`) sudah menyebut nama klien ini. Halaman booking-jasa tidak menautkannya.

## 8. BJ2: approval dan ambil alih ditonjolkan (disetujui 28 Nov 2026, selesai teknis, menunggu review user)

Permintaan user 28 Nov: approval dan takeover ditonjolkan di `/solusi/booking-jasa`. User memilih opsi B (Tonton 11 adegan). Sumbernya 16 workflow aktif yang dibaca ulang 28 Nov (hanya dibaca). Sejak BJ1 ada tambahan: booking di luar jadwal normal (hari yang sama, Minggu atau libur, di luar jam kerja) sekarang diajukan ke staf (`BOOKING_BARU`), klik tombol pertama yang berlaku, permintaan kedaluwarsa saat jam jadwal lewat, dan chat yang diambil alih staf dirangkum AI menjadi usulan bertombol.

### 8.1 Riset

- Serah terima ke manusia: konteks harus ikut pindah, jangan sampai pelanggan mengulang cerita, dan jalur ke manusia harus jelas ([TechTarget](https://www.techtarget.com/enterprise-software/tip/Best-practices-for-initiating-chatbot-to-human-handoff), [Freshworks](https://www.freshworks.com/theworks/ai-assisted-service/ai-human-handoff/)).
- Tombol persetujuan: tampilkan bukti di samping tombol, klik pertama yang berlaku, siapkan jalur tolak dan habis waktu, dan tegakkan di workflow, bukan hanya di prompt ([Elastic](https://www.elastic.co/observability-labs/blog/incident-response-automation-human-approval-gate), [DEV](https://dev.to/traviticus/how-i-built-human-approval-into-automated-workflows-answer-in-slack-or-in-the-app-dde), [n8n](https://blog.n8n.io/production-ai-playbook-human-oversight)).
- Ketiganya sudah ada di workflow klien, jadi halaman cukup memperlihatkannya. Tidak ada library baru.

### 8.2 Adegan (draf)

| # | Rel | Caption (draf) | Kanvas |
|---|---|---|---|
| 1–6 | Sebelum s.d. Staf menerima | Tetap seperti BJ1 | Tetap |
| 7 | Langkah 6 · Persetujuan | Perubahan jadwal diputuskan staf, bukan AI. Permintaan sampai ke grup staf dengan jadwal lama, jadwal baru dan alasannya. Tombol yang pertama ditekan yang berlaku, lalu pelanggan dikabari otomatis. | Bubble "bisa diundur ke Senin?"; kartu permintaan (Sabtu 13.00 → Senin 13.00, alasan) dengan Ya/Tidak; Dina menekan Ya; tekanan kedua dari Rudi mendapat pil "Sudah diputuskan Dina"; baris Sab → Sen; bubble AI "Jadwal diubah ke Senin" |
| 8 | Langkah 7 · Ambil alih | Staf bisa membalas sendiri kapan saja, dan AI langsung diam. Begitu staf mengetik dari HP, AI berhenti membalas pelanggan itu selama 30 menit. Kalau pelanggan menunggu terlalu lama, grup staf diingatkan. | Bubble "bisa tambah cuci karpet?"; bubble Staf "Bisa Bu, saya bantu langsung"; penanda AI berubah jadi "AI diam 30 menit" dengan cincin hitung mundur; pelanggan dan staf sepakat (karpet 2×3 m, Rp150.000) |
| 9 | Langkah 8 · Rangkuman | AI merangkum chat staf, lalu jadwal ikut diperbarui. Setelah chat selesai, kesepakatannya diringkas jadi satu usulan bertombol, jadi staf tidak perlu mengetik ulang. | Chat meredup; kartu "Rangkuman chat staf" (disepakati, usulan "Cuci sofa + karpet, Rp400.000") dengan Ya/Tidak; Ya ditekan; baris tabel berubah jadi "Sofa + karpet" |
| 10 | Hasil · angka contoh | Tetap | Tetap |
| 11 | Untukmu | Tetap | Tetap |

Rel menjadi 8 node (adegan 2–9 dan adegan 1 tetap di luar rel seperti sekarang; dicek ulang terhadap `nodes` di `makeTiming`). Panjang scroll naik dari 11 ke 13 layar.

### 8.3 Baca (draf)

- `built.points`: poin 4 dan 5 ditulis ulang, ditambah poin 6 soal rangkuman bertombol (batas skema 6 poin).
- `steps`: langkah 4 menjadi "Staf memutuskan dengan satu tombol", ditambah langkah 5 "Staf bisa mengambil alih chat".
- `compare`: baris baru "Perubahan jadwal": dicatat ulang manual → satu tombol, jadwal ikut berubah.
- `faq`: FAQ hari yang sama dikoreksi (bisa, dengan persetujuan staf). FAQ baru: "Bagaimana kalau staf ingin membalas sendiri?"
- `answer` dan `seoDescription` disesuaikan supaya menyebut persetujuan staf dan ambil alih.

### 8.4 Perubahan file (rencana)

`cerita/schema.ts` (`BookingPanggungSchema`: `takeover`, `summary`, `change.second`; adegan 11), `cerita/booking-jasa.ts` (ID/EN), `PanggungBooking.tsx`, `ceritaFilmBooking.ts`, `ceritaTiming.ts` (11 adegan), `CeritaScroll.tsx` (ikon rel, `screens`), gaya `bj-*` di `detail.css`, `items/booking-jasa.ts`, `tools/solusi/bj1-qa.mjs` dan `logic.test.mjs`.

### 8.5 Cek

Sama dengan 7.5 untuk 11 adegan, ditambah lebar rel 8 node di 360 px, mode gerak dikurangi, EN, regresi cerita lain dan etalase. Screenshot hanya di chat.

### 8.6 Keputusan user (28 Nov 2026)

- Urutan adegan baru: Persetujuan → Ambil alih → Rangkuman.
- Adegan Persetujuan memperlihatkan klik pertama yang berlaku (staf kedua mendapat pil "Sudah diputuskan Dina").
- Skenario ambil alih: pelanggan minta tambah cuci karpet, staf menyebut harganya Rp150.000, rangkuman mengusulkan "Cuci sofa + karpet, Rp400.000".
- Baca memakai field yang sudah ada. Template bersama tidak diubah.

### 8.7 Hasil implementasi (28 Nov 2026)

- Tonton 11 adegan, rel 8 node, panjang scroll 13 layar. Adegan 7: kartu permintaan dengan alasan, label Dina dan Rudi di tombol Ya, pil "Sudah diputuskan Dina", baris Sab → Sen. Adegan 8: bubble staf "Dina · dari HP" berwarna cyan, pil "AI diam 30 menit" dengan bar yang menyusut. Adegan 9: kartu "Rangkuman chat staf" bertombol, baris tabel berubah jadi "Sofa + karpet". Copy panggung ID/EN.
- Skema: `change` mendapat `reason`, `first`, `second`, `decided`; objek baru `takeover` dan `summary`; `table.added.merged`. Pengecekan baru: pil keputusan menyebut orang yang menekan pertama, dan harga rangkuman = harga booking + harga dari staf.
- Rel: `--nw` di `.story-track` menjadi `min(120px, 100% / jumlah node)`. Di tablet 1024 px, rel 8 node sempat keluar 22 px dari kotaknya. Cerita lain tidak berubah selama 120 px masih muat.
- Baca ID/EN: jawaban pembuka, meta description (154 karakter), poin built (6), langkah (5), baris perbandingan "Perubahan jadwal", FAQ hari yang sama dikoreksi, FAQ baru soal staf membalas sendiri. `updated` jadi 2026-11-28.
- QA `bj1-qa.mjs` diperluas untuk 11 adegan, rel 8 node di semua viewport, dan copy EN adegan 8 dan 9. `logic.test.mjs` memakai 11 adegan.
