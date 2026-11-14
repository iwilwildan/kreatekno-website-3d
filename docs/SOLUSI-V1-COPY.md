# Halaman Solusi v1: semua copy

| Info | Isi |
|---|---|
| Tanggal | 4 November 2026 |
| Sumber | `prototype/solusi-etalase-v1.html` (versi final v1 yang disetujui Heru) |
| Pembaca | Wildan (integrasi ke `kreatekno-website-3d`) |
| Kolom "Kunci / file" | Kunci next-intl di `site/messages/id.json`, atau file data di `site/content/solusi/` |
| Kolom "Status" | **ada** = kunci sudah ada dengan teks sama · **ubah** = kunci sudah ada, teks v1 berbeda · **baru** = usulan kunci baru · **data** = ada di file data dengan teks sama · **data baru** = belum ada di file data · **tidak dipakai v1** = kunci ada tapi tidak tampil di v1 · **prototipe** = hanya untuk prototipe, jangan dibawa |
| Aturan copy | Sapaan "Anda", tanpa em dash, tanpa janji waktu, hanya aplikasi yang dilihat klien (lihat `.claude/rules/content.md`) |
| Placeholder ICU | `{nama}` ditulis dengan format ICU next-intl, contoh `t("count", { n: 3 })` |
| Pembanding | Isi 12 solusi dan 24 kartu di prototipe sudah dicocokkan otomatis dengan `site/content/solusi/` (4 Nov): semua teks sama. Beda hanya format tanggal (`28 Okt 2026` di prototipe, `2026-10-28` di data) dan link `watch` (ada di prototipe untuk order-grup, sengaja tidak dipasang di data, SOLUSI-SPEC bagian 3 no. 5) |

## 1. Metadata dan judul tab

| Lokasi | Teks v1 | Kunci / file | Status | Catatan |
|---|---|---|---|---|
| `<title>` /solusi | Solusi Otomasi AI & WhatsApp untuk UMKM \| Kreatekno | `meta.solutions.title` | ada | Prototipe memakai "Kreatekno Etalase Solusi" (judul prototipe saja) |
| meta description /solusi | Kumpulan solusi asisten AI dan otomasi WhatsApp untuk UMKM. Cari masalah yang mirip dengan usaha Anda, lalu lihat cara kerja tiap solusi. | `meta.solutions.description` | ada | Prototipe: "Prototype halaman Solusi Kreatekno sebagai toko…" (prototipe) |
| `<title>` /solusi/hasil | Hasil kartu masalah \| Kreatekno | `meta.solutions.results.title` | ada |  |
| meta description /solusi/hasil | Solusi yang paling cocok dengan masalah yang Anda pilih di kartu masalah Kreatekno. | `meta.solutions.results.description` | ada |  |
| `<title>` detail | {title} \| Kreatekno Solusi | `meta.solutions.detail.title` | baru | Fase 2 (Wildan). `{title}` = judul solusi |
| `<title>` saat prototipe | Kreatekno Etalase Solusi | – | prototipe |  |

## 2. Navigasi dan tombol umum

| Lokasi | Teks v1 | Kunci / file | Status | Catatan |
|---|---|---|---|---|
| Logo nav (aria-label + alt) | Kreatekno | `nav.home` ("Kreatekno, ke beranda") | ada | Header Wildan memakai teks kunci ini |
| Menu 1 | Layanan | `nav.services` | ada |  |
| Menu 2 | Cara kerja | `nav.how` | ada |  |
| Menu 3 (aktif) | Solusi | `nav.solutions` | ada | `aria-current="page"` |
| Menu 4 | Artikel | `nav.articles` | ada |  |
| Menu 5 | Tentang | `nav.about` | ada |  |
| Tombol nav | Konsultasi gratis | `cta.free` | ada | v1: membuka pop up kontak, bukan langsung WhatsApp |
| Tombol band etalase | Konsultasi gratis | `cta.free` | ada | Sama, membuka pop up kontak |
| Tombol fokus (Cari dan Kartu) | Kembali ke etalase | `pages.solutions.focus.back` | baru | Teksnya sama dengan `pages.solutions.results.back`, boleh dipakai bersama |

## 3. Hero toko

| Lokasi | Teks v1 | Kunci / file | Status | Catatan |
|---|---|---|---|---|
| Section aria-label | Toko solusi Kreatekno | `pages.solutions.hero.label` | baru | Repo S2 memakai `aria-labelledby="toko-h"` ke H1; boleh tetap begitu |
| Eyebrow | Solusi | `pages.solutions.hero.eyebrow` | ada | Huruf kapital lewat CSS |
| H1 | Solusi AI untuk pekerjaan berulang di bisnis Anda | `pages.solutions.hero.headline` | ada |  |
| Paragraf | Cari solusi yang Anda butuhkan, atau ceritakan masalahnya lewat kartu. Kasir kami siap mengambilkannya. | `pages.solutions.hero.body` | ada |  |
| Grup tombol (aria-label) | Cara mencari solusi | `pages.solutions.hero.modes` | ada | Tidak ada di prototipe, sudah ada di repo |
| Tombol 1 | Cari solusi | `pages.solutions.hero.search` | ada |  |
| Tombol 2 | Kartu masalah | `pages.solutions.hero.cards` | ada |  |
| Catatan di bawah tombol | Segera hadir | `pages.solutions.hero.soon` | tidak dipakai v1 | Di v1 kedua tombol sudah jalan |

## 4. Etalase (rak di depan meja)

| Lokasi | Teks v1 | Kunci / file | Status | Catatan |
|---|---|---|---|---|
| Judul di atas jendela rak (H2 `#et-h`) | Pilih solusi sesuai kebutuhan bisnis Anda | `pages.solutions.shelf.title` | ubah | Teks repo saat ini: "Etalase solusi" |
| Jumlah solusi | – | `pages.solutions.shelf.count` | tidak dipakai v1 | "{total} solusi · {live} sudah berjalan, {idea} siap dibuat" |
| Legenda status | – | `pages.solutions.shelf.legendLive`, `legendIdea` | tidak dipakai v1 | v1 memakai badge status di tiap kotak |
| Catatan disamarkan | – | `pages.solutions.shelf.disguised` | tidak dipakai v1 | v1 menaruh catatan ini di halaman detail |
| Label papan rak (H3 per tier) | Nama tim, lihat tabel 13.2 | `content/solusi/taksonomi.ts` → `TIM[].label.id` | data | Urutan tier: lihat SOLUSI-V1-LOGIKA.md |
| Badge status di kotak | Sudah berjalan / Siap dibuat | `content/solusi/taksonomi.ts` → `STATUS` | data |  |
| Teks sampul kotak | `result` tiap solusi, lihat bagian 14 | `items/<slug>.ts` → `id.result` | data |  |
| Teks tersembunyi di link kotak (sr-only) | {title}.  | `items/<slug>.ts` → `id.title` | data | Dibaca screen reader sebelum isi kotak |
| aria-label ikon aplikasi | Aplikasi: {apps} | `pages.solutions.shelf.apps` | ada | `{apps}` = label aplikasi dipisah koma |
| Panah kiri (aria-label) | Geser rak {team} ke kiri | `pages.solutions.shelf.prev` | baru | `{team}` = label tim |
| Panah kanan (aria-label) | Geser rak {team} ke kanan | `pages.solutions.shelf.next` | baru |  |
| Petunjuk kotak belum bisa diklik | – | `pages.solutions.shelf.soon` | tidak dipakai v1 | Di v1 kotak link ke detail. Di website: tunggu halaman detail fase 2 |

## 5. Band di bawah etalase

| Lokasi | Teks v1 | Kunci / file | Status | Catatan |
|---|---|---|---|---|
| H2 | Masalah Anda belum ada di etalase? | `pages.solutions.band.title` | ada |  |
| Paragraf | Ceritakan satu pekerjaan yang paling ingin Anda otomatiskan. Kami bantu petakan solusinya, gratis. | `pages.solutions.band.body` | ada |  |
| Tombol | Konsultasi gratis | `cta.free` | ada | Membuka pop up kontak (pesan WA default) |

## 6. Mode Cari: kertas struk

| Lokasi | Teks v1 | Kunci / file | Status | Catatan |
|---|---|---|---|---|
| Kepala struk baris 1 | KREATEKNO | `pages.solutions.search.receiptBrand` | baru | Font mono |
| Kepala struk baris 2 | Etalase Solusi · Kasir: Raka | `pages.solutions.search.receiptLine` | baru | Usul ICU: "Etalase Solusi · Kasir: {name}". Di website kasirnya Heru, jadi nama ikut keputusan Heru |
| Kepala struk baris 3 | No. 0001 | `pages.solutions.search.receiptNo` | baru | Usul ICU: "No. {n}", `n` 4 digit dengan nol di depan, naik setiap Enter (mulai 0002 setelah Enter pertama) |
| Label input | Cari solusi | `pages.solutions.search.label` | baru | Kapital lewat CSS |
| Placeholder input | Misalnya: tagihan, booking, stok | `pages.solutions.search.placeholder` | baru |  |
| Label filter 1 (sr-only) | Bidang usaha | `pages.solutions.search.filter.industri` | baru |  |
| Opsi kosong filter 1 | Semua bidang usaha | `pages.solutions.search.all.industri` | baru | Opsi lain: label industri, tabel 13.1 |
| Label filter 2 (sr-only) | Tim | `pages.solutions.search.filter.tim` | baru |  |
| Opsi kosong filter 2 | Semua tim | `pages.solutions.search.all.tim` | baru | Opsi lain: tabel 13.2 |
| Label filter 3 (sr-only) | Aplikasi | `pages.solutions.search.filter.app` | baru |  |
| Opsi kosong filter 3 | Semua aplikasi | `pages.solutions.search.all.app` | baru | Opsi lain: tabel 13.3 |
| Label filter 4 (sr-only) | Status | `pages.solutions.search.filter.status` | baru |  |
| Opsi kosong filter 4 | Semua status | `pages.solutions.search.all.status` | baru | Opsi lain: Sudah berjalan, Siap dibuat |
| Tombol kirim | Ambilkan solusinya | `pages.solutions.search.submit` | baru |  |
| Tombol "Lihat daftar dan filter" | Lihat daftar dan filter | – | prototipe | Sisa versi lama (struk ringkas di HP). Tidak pernah tampil di v1 |

## 7. Mode Cari: setelah pencarian

| Lokasi | Teks v1 | Kunci / file | Status | Catatan |
|---|---|---|---|---|
| Bar hasil (aria-label region) | Hasil pencarian | `pages.solutions.search.region` | baru | `aria-live="polite"` |
| Pesan tanpa hasil | Belum ada solusi yang cocok | `pages.solutions.search.empty` | baru | Muncul di atas dua tombol bar |
| Tombol kiri | Cari kembali | `pages.solutions.search.again` | baru |  |
| Tombol kanan | Belum dapat solusi | `pages.solutions.search.help` | baru | Membuka pop up kontak dengan pesan template 12.2 |
| Tag nomor di atas kotak | 1 sampai 6 | – | – | Angka saja |
| aria-label tag nomor | {n}. {title}, lihat ringkasan | `pages.solutions.search.tag` | baru |  |

## 8. Kartu ringkasan (mode Cari)

| Lokasi | Teks v1 | Kunci / file | Status | Catatan |
|---|---|---|---|---|
| aria-label kartu | Ringkasan {title} | `pages.solutions.summary.label` | baru | `role="dialog"` |
| Tombol tutup (HP, aria-label) | Tutup ringkasan | `pages.solutions.summary.close` | baru |  |
| Judul | `title` solusi | `items/<slug>.ts` → `id.title` | data |  |
| aria-label chip aplikasi | Platform | `pages.solutions.summary.platform` | baru | Isi chip: label aplikasi, tabel 13.3 |
| Ringkasan (maks. 20 kata) | Lihat bagian 15 | `items/<slug>.ts` → `id.summary` | data baru | Perlu field baru `summary` di `lib/solusi/schema.ts`. Kalau kosong, prototipe memakai `result` |
| Tombol | Lihat detail | `pages.solutions.summary.detail` | baru | Link ke detail solusi (fase 2) |

## 9. Pop up kontak

| Lokasi | Teks v1 | Kunci / file | Status | Catatan |
|---|---|---|---|---|
| Judul (H2) | Konsultasi gratis | `cta.free` | ada |  |
| Paragraf | Pilih cara yang paling nyaman untuk Anda. Tim kami akan membantu memetakan solusinya. | `pages.solutions.contact.body` | baru |  |
| Tombol X (aria-label) | Tutup | `pages.solutions.contact.close` | baru | Bisa memakai `nav.close` ("Tutup menu") kalau mau satu kunci, tapi teksnya beda |
| Kanal 1 | WhatsApp | `pages.solutions.contact.wa.name` | baru |  |
| Keterangan kanal 1 | Chat langsung dengan tim kami | `pages.solutions.contact.wa.desc` | baru |  |
| Kanal 2 | Instagram | `pages.solutions.contact.ig.name` | baru |  |
| Keterangan kanal 2 | Kirim pesan langsung ke akun kami | `pages.solutions.contact.ig.desc` | baru |  |
| Kanal 3 | Email | `pages.solutions.contact.email.name` | baru |  |
| Keterangan kanal 3 | Ceritakan kebutuhan Anda lewat email | `pages.solutions.contact.email.desc` | baru |  |
| Subjek email | Konsultasi gratis | `pages.solutions.contact.email.subject` | baru | Isi badan email = pesan WA yang sama (bagian 12) |
| Nomor WhatsApp | 6280000000000 | `lib/site.ts` → `WA_NUMBER` | prototipe | GANTI. Contoh saja |
| Akun Instagram | ganti_akun_instagram | `lib/site.ts` | prototipe | GANTI. Link `https://ig.me/m/<akun>` |
| Alamat email | ganti-email@contoh.com | `lib/site.ts` | prototipe | GANTI |

## 10. Mode Kartu masalah

| Lokasi | Teks v1 | Kunci / file | Status | Catatan |
|---|---|---|---|---|
| Kertas bidang usaha: H2 | Usaha Anda bergerak di bidang apa? | `pages.solutions.cards.sheetTitle` | baru |  |
| Kertas bidang usaha: paragraf | Pilih satu. Setelah itu kasir menyiapkan 9 kartu masalah untuk Anda. | `pages.solutions.cards.sheetBody` | baru | Usul ICU: "…menyiapkan {count} kartu masalah…", `count` = 9 |
| Tombol bidang usaha | Label industri (6), tabel 13.1 | `content/solusi/taksonomi.ts` → `INDUSTRI` | data | Dengan ikon, lihat SOLUSI-V1-VISUAL.md |
| Link lewati | Lewati, pakai kartu umum | `pages.solutions.cards.skip` | baru |  |
| Progres | Kartu {n} dari {total} | `pages.solutions.cards.progress` | baru | `total` = 9 |
| Baris atas kartu (kiri) | Ronde {round} dari {rounds} | `pages.solutions.cards.round` | baru | `rounds` = 3 |
| Baris atas kartu (kanan) | Apakah ini terjadi? | `pages.solutions.cards.ask` | baru |  |
| Pertanyaan kartu (H2) | Teks kartu, bagian 16 | `content/solusi/kartu.ts` → `text.id` | data |  |
| Chip di kartu | Label industri (kalau kartu cocok dengan bidang usaha yang dipilih) + label tim pertama kartu | taksonomi | data |  |
| Stempel kanan | Ya, terjadi | `pages.solutions.cards.stampYes` | baru | Kapital lewat CSS |
| Stempel kiri | Tidak | `pages.solutions.cards.stampNo` | baru |  |
| Stempel atas | Lihat solusi | `pages.solutions.cards.stampUp` | baru |  |
| Penanda atas | Solusi | `pages.solutions.cards.cueUp` | baru | Penanda saja, bukan tombol (`aria-hidden`) |
| Penanda kiri | Tidak | `pages.solutions.cards.cueNo` | baru |  |
| Penanda kanan | Ya | `pages.solutions.cards.cueYes` | baru |  |
| Petunjuk di bawah kartu | Swipe/drag pertanyaannya untuk menjawab atau melihat solusi | `pages.solutions.cards.hint` | baru |  |
| aria-roledescription kartu | kartu masalah | `pages.solutions.cards.role` | baru |  |

## 11. Halaman hasil kartu masalah

| Lokasi | Teks v1 | Kunci / file | Status | Catatan |
|---|---|---|---|---|
| Breadcrumb 1 | Solusi | `nav.solutions` | ada |  |
| Breadcrumb 2 | Hasil kartu masalah | `pages.solutions.results.title` | ada |  |
| Breadcrumb (aria-label) | Breadcrumb | `pages.solutions.crumb` | baru |  |
| H1 (ada hasil) | Solusi yang paling cocok untuk usaha Anda | `pages.solutions.results.heading` | baru | Repo S2 menaruh `results.title` di H1; v1 memakai kalimat ini |
| H1 (tidak ada hasil) | Belum ada solusi yang pas di etalase kami | `pages.solutions.results.headingEmpty` | baru |  |
| Label jawaban | Masalah yang Anda pilih | `pages.solutions.results.picked` | baru | Isi chip: teks kartu yang dijawab "Ya" atau "Lihat solusi", tanpa tanda tanya |
| Kartu hasil: judul | `title` solusi | `items/<slug>.ts` → `id.title` | data |  |
| Kartu hasil: badge | Sudah berjalan / Siap dibuat | taksonomi `STATUS` | data |  |
| Kartu hasil: kecocokan | Kecocokan {pct}% | `pages.solutions.results.match` | baru |  |
| Kartu hasil: teks | `result` solusi | `items/<slug>.ts` → `id.result` | data |  |
| Kotak tanpa hasil: judul | Masalah Anda mungkin belum ada di etalase. | `pages.solutions.results.noneTitle` | baru |  |
| Kotak tanpa hasil: teks | Ceritakan langsung lewat chat. Kami bantu petakan solusinya, gratis. | `pages.solutions.results.noneBody` | baru |  |
| Tombol 1 | Konsultasi gratis | `cta.free` | ada | Pop up kontak, pesan template 12.3 |
| Tombol 2 | Ulangi | `pages.solutions.results.again` | baru | Kembali ke mode Kartu |
| Tombol 3 | Kembali ke etalase | `pages.solutions.results.back` | ada |  |
| Catatan bawah | Pesan chat sudah berisi masalah yang Anda pilih. | `pages.solutions.results.waNote` | baru |  |
| Paragraf repo S2 | – | `pages.solutions.results.body`, `results.empty` | tidak dipakai v1 | "Solusi yang paling cocok… tampil di sini." dan "Anda belum menjawab kartu masalah." |

## 12. Template pesan WhatsApp dan email

Pesan yang sama dipakai untuk link WhatsApp (`wa.me/<nomor>?text=`) dan badan email (`mailto:`). Baris baru ditulis `\n`.

| No. | Dipicu dari | Teks v1 | Kunci / file | Status |
|---|---|---|---|---|
| 12.1 | Tombol nav, tombol band, semua tombol tanpa konteks | Halo Kreatekno, saya mau konsultasi otomasi untuk bisnis saya. | `wa.chat` | ada |
| 12.2 | "Belum dapat solusi" setelah mencari dengan kata kunci | Halo Kreatekno, saya mencari solusi untuk: {term}. Saya mau konsultasi. | `pages.solutions.wa.search` | baru |
| 12.2b | "Belum dapat solusi" dengan kotak pencarian kosong | sama dengan 12.1 | `wa.chat` | ada |
| 12.3 | Halaman hasil, ada jawaban "Ya" | Halo Kreatekno, saya baru mencoba kartu masalah di website. Masalah di usaha saya ({industri}):\n- {masalah 1}\n- {masalah 2}\nSaya mau konsultasi. | `pages.solutions.wa.cards` | baru |
| 12.3b | Sama, tanpa bidang usaha (dilewati) | Halo Kreatekno, saya baru mencoba kartu masalah di website. Masalah di usaha saya:\n- {masalah 1}\nSaya mau konsultasi. | `pages.solutions.wa.cards` | baru |
| 12.3c | Halaman hasil tanpa jawaban "Ya" | sama dengan 12.1 | `wa.chat` | ada |
| 12.4 | Tombol CTA halaman detail | Halo Kreatekno, saya lihat solusi "{title}". Saya mau konsultasi solusi serupa untuk bisnis saya. | `pages.solutions.wa.detail` | baru |
| 12.5 | Jadwal ketemu (tidak dipakai v1) | Halo Kreatekno, saya mau jadwalkan ketemu langsung di Pekanbaru. | `wa.meet` | tidak dipakai v1 |

## 13. Taksonomi

### 13.1 Bidang usaha (`INDUSTRI`)

| id | Label | Ikon Phosphor | Status |
|---|---|---|---|
| retail | Retail & F&B | Storefront | data |
| klinik | Klinik | FirstAid | data |
| properti | Properti | Buildings | data |
| logistik | Logistik | Truck | data |
| jasa | Jasa | Handshake | data |
| perjalanan | Perjalanan | GlobeSimple | data |

### 13.2 Tim (`TIM`)

| id | Label | Status |
|---|---|---|
| marketing | Marketing | data |
| penjualan | Penjualan | data |
| cs | Layanan pelanggan | data |
| operasional | Operasional | data |
| keuangan | Keuangan & admin | data |
| manajemen | Manajemen | data |
| sdm | SDM | data |

### 13.3 Aplikasi (`APPS`)

| id | Label | Ikon Phosphor | Status |
|---|---|---|---|
| whatsapp | WhatsApp | WhatsappLogo | data |
| sheets | Google Sheets | Table | data |
| instagram | Instagram | InstagramLogo | data |
| gmail | Gmail | Envelope | data |
| calendar | Google Calendar | CalendarDots | data |
| drive | Google Drive | Folder | data |

### 13.4 Status (`STATUS`)

| id | Label | Status |
|---|---|---|
| jalan | Sudah berjalan | data |
| ide | Siap dibuat | data |

## 14. Ringkasan 12 solusi (urutan data)

| No. | slug | Status | Tim pertama (tier) | Judul (`title`) | Teks sampul (`result`) |
|---|---|---|---|---|---|
| 1 | order-grup | Sudah berjalan | Operasional | Order dari grup WhatsApp tercatat sendiri ke Google Sheets | Order tercatat tanpa diketik ulang |
| 2 | booking-jasa | Sudah berjalan | Layanan pelanggan | Booking jasa langsung dari chat pelanggan | Booking terkonfirmasi tanpa menunggu admin |
| 3 | berkas-dokumen | Sudah berjalan | Operasional | Berkas dokumen pelanggan dirapikan otomatis | Berkas lengkap dan rapi per pelanggan |
| 4 | riset-konten | Sudah berjalan | Marketing | Ide konten mingguan dari tren media sosial | Daftar ide konten siap pakai setiap minggu |
| 5 | cs-klinik | Siap dibuat | Layanan pelanggan | Pertanyaan pasien terjawab di luar jam kerja | Pasien dilayani 24 jam, admin fokus ke pasien yang datang |
| 6 | pengingat-tagihan | Siap dibuat | Keuangan & admin | Tagihan jatuh tempo diingatkan otomatis | Pembayaran lebih tepat waktu tanpa menagih manual |
| 7 | rekap-penjualan | Siap dibuat | Manajemen | Rekap penjualan harian tanpa hitung manual | Angka penjualan sampai di HP pemilik setiap malam |
| 8 | followup-prospek | Siap dibuat | Penjualan | Calon pembeli properti tidak lagi lupa di-follow-up | Setiap prospek dihubungi kembali sesuai jadwal |
| 9 | carousel-konten | Siap dibuat | Marketing | Carousel Instagram dari satu topik | Draf carousel siap disetujui dalam hitungan menit |
| 10 | asisten-sop | Siap dibuat | SDM | Staf baru menemukan jawaban SOP sendiri | Atasan tidak lagi menjawab pertanyaan yang sama |
| 11 | stok-menipis | Siap dibuat | Operasional | Peringatan stok menipis sebelum habis | Pesan ulang tepat waktu, stok tidak kosong |
| 12 | ulasan-pelanggan | Siap dibuat | Layanan pelanggan | Keluhan pelanggan terkumpul di satu tempat | Pemilik melihat pola keluhan setiap minggu |

## 15. Ringkasan pendek di kartu ringkasan (`RINGKAS`, data baru)

| slug | Teks (maks. 20 kata) | Jumlah kata | Usulan tempat |
|---|---|---|---|
| order-grup | Order yang ditulis sales di grup WhatsApp otomatis tercatat ke Google Sheets, dan pemilik menerima rekap setiap malam. | 18 | items/order-grup.ts → `id.summary` |
| booking-jasa | Pelanggan memilih jadwal kosong langsung di chat WhatsApp, lalu booking tercatat otomatis ke kalender tim Anda. | 16 | items/booking-jasa.ts → `id.summary` |
| berkas-dokumen | Pelanggan cukup mengirim foto dokumen lewat WhatsApp. Berkas dirapikan, disimpan per pelanggan, dan kelengkapannya tercatat. | 15 | items/berkas-dokumen.ts → `id.summary` |
| riset-konten | Setiap minggu, tren media sosial di bidang Anda disusun menjadi daftar ide konten siap pakai untuk tim marketing. | 18 | items/riset-konten.ts → `id.summary` |
| cs-klinik | Pertanyaan pasien soal jam praktik, harga, dan jadwal dokter terjawab di luar jam kerja, pertanyaan medis tetap diteruskan. | 18 | items/cs-klinik.ts → `id.summary` |
| pengingat-tagihan | Pengingat tagihan terkirim sopan lewat WhatsApp atau email sebelum jatuh tempo, dan status pembayaran diperbarui di Google Sheets. | 18 | items/pengingat-tagihan.ts → `id.summary` |
| rekap-penjualan | Setiap malam pemilik menerima rekap penjualan di WhatsApp: total, produk terlaris, dan perbandingan dengan hari sebelumnya. | 16 | items/rekap-penjualan.ts → `id.summary` |
| followup-prospek | Calon pembeli dari iklan dan survei tercatat rapi, dan tim marketing diingatkan kapan harus menghubungi kembali. | 16 | items/followup-prospek.ts → `id.summary` |
| carousel-konten | Anda cukup mengirim satu topik. Isi slide ditulis sesuai gaya brand Anda, lalu dikirim untuk disetujui. | 16 | items/carousel-konten.ts → `id.summary` |
| asisten-sop | Staf bertanya lewat WhatsApp dengan bahasa sehari-hari dan mendapat jawaban dari SOP Anda, lengkap dengan sumbernya. | 16 | items/asisten-sop.ts → `id.summary` |
| stok-menipis | Stok gudang dipantau setiap hari, dan tim pembelian menerima peringatan WhatsApp sebelum barang habis. | 14 | items/stok-menipis.ts → `id.summary` |
| ulasan-pelanggan | Keluhan dari chat, email, dan formulir terkumpul di satu tabel, dengan ringkasan topik teratas setiap minggu. | 16 | items/ulasan-pelanggan.ts → `id.summary` |

## 16. Bank kartu masalah (24 kartu)

File: `site/content/solusi/kartu.ts` (teks sama). Industri kosong = cocok untuk semua bidang usaha. Bobot 1 sampai 3.

| id | Pertanyaan (`text.id`) | Industri | Tim | Solusi dan bobot |
|---|---|---|---|---|
| k1 | Order dari grup chat sering terlewat? | Logistik, Retail & F&B | Operasional, Penjualan | order-grup 3 |
| k2 | Admin mengetik ulang pesanan ke Excel setiap hari? | Logistik, Retail & F&B, Jasa | Operasional, Keuangan & admin | order-grup 3, rekap-penjualan 1 |
| k3 | Angka penjualan baru Anda ketahui keesokan harinya? | Retail & F&B, Logistik | Manajemen | rekap-penjualan 3, order-grup 1 |
| k4 | Pelanggan menunggu lama hanya untuk tahu jadwal yang kosong? | Jasa, Klinik | Layanan pelanggan | booking-jasa 3, cs-klinik 2 |
| k5 | Chat pelanggan menumpuk di luar jam kerja? | Klinik, Jasa, Retail & F&B, Properti | Layanan pelanggan | cs-klinik 3, booking-jasa 2 |
| k6 | Pertanyaan harga dan jam buka dijawab berulang kali? | Klinik, Retail & F&B, Jasa | Layanan pelanggan | cs-klinik 3, booking-jasa 1 |
| k7 | Jadwal tim lapangan sering bentrok? | Jasa | Operasional | booking-jasa 3 |
| k8 | Dokumen pelanggan dikirim berantakan lewat chat? | Perjalanan, Jasa, Properti | Operasional, Keuangan & admin | berkas-dokumen 3 |
| k9 | Foto dokumen harus dirapikan satu per satu? | Perjalanan | Operasional | berkas-dokumen 3 |
| k10 | Sulit melihat berkas pelanggan mana yang belum lengkap? | Perjalanan, Properti, Jasa | Keuangan & admin, Operasional | berkas-dokumen 3 |
| k11 | Bingung mau posting apa minggu ini? | Retail & F&B, Klinik, Jasa | Marketing | riset-konten 3, carousel-konten 1 |
| k12 | Membuat satu carousel makan waktu berjam-jam? | Retail & F&B, Klinik | Marketing | carousel-konten 3 |
| k13 | Posting media sosial tidak rutin? | Retail & F&B, Klinik, Jasa, Properti | Marketing | carousel-konten 2, riset-konten 2 |
| k14 | Tagihan pelanggan sering telat dibayar? | Jasa, Properti, Logistik | Keuangan & admin | pengingat-tagihan 3 |
| k15 | Mengingatkan tagihan satu per satu terasa sungkan? | Jasa, Properti | Keuangan & admin | pengingat-tagihan 3 |
| k16 | Calon pembeli lupa dihubungi lagi setelah survei? | Properti | Penjualan | followup-prospek 3 |
| k17 | Prospek dari iklan tidak tercatat rapi? | Properti, Retail & F&B | Penjualan, Marketing | followup-prospek 3 |
| k18 | Staf baru terus bertanya hal yang sama? | (semua) | SDM, Operasional | asisten-sop 3 |
| k19 | SOP ada, tapi jarang dibuka? | (semua) | SDM, Manajemen | asisten-sop 3 |
| k20 | Stok habis sebelum sempat dipesan ulang? | Retail & F&B, Logistik | Operasional | stok-menipis 3 |
| k21 | Cek stok gudang masih manual? | Retail & F&B, Logistik | Operasional, Manajemen | stok-menipis 2, rekap-penjualan 1 |
| k22 | Keluhan pelanggan tercecer di banyak tempat? | Retail & F&B, Klinik, Jasa | Layanan pelanggan, Manajemen | ulasan-pelanggan 3 |
| k23 | Tidak tahu apa yang paling sering dikeluhkan pelanggan? | Retail & F&B, Klinik, Jasa | Manajemen | ulasan-pelanggan 3 |
| k24 | Anda sendiri masih ikut membalas chat setiap hari? | (semua) | Manajemen, Layanan pelanggan | cs-klinik 2, booking-jasa 1, order-grup 1 |

## 17. Halaman detail solusi (label tetap)

Halaman detail adalah fase 2 (Wildan). Di v1 sudah ada di prototipe, jadi label tetapnya dicatat di sini.

| Lokasi | Teks v1 | Kunci / file | Status | Catatan |
|---|---|---|---|---|
| Breadcrumb 1 | Solusi | `nav.solutions` | ada | Breadcrumb 2 = label industri pertama |
| Tanggal | Diperbarui {date} | `pages.solutions.detail.updated` | baru | Format v1: "28 Okt 2026". Data menyimpan ISO, format di UI |
| Judul aside | Ringkasan | `pages.solutions.detail.summary` | baru |  |
| Catatan "Sudah berjalan" | Nama dan detail klien disamarkan atas permintaan klien. | `pages.solutions.detail.veilLive` | baru | Mirip `shelf.disguised` tapi kalimatnya beda |
| Catatan "Siap dibuat" | Ide solusi yang siap dibuat. Belum ada klien yang memakai versi ini. | `pages.solutions.detail.veilIdea` | baru |  |
| Tombol video | Tonton cara kerjanya | `pages.solutions.detail.watch` | baru | Hanya kalau ada `watch`. Data tidak memasang link (privat) |
| Fakta 1 | Klien | `pages.solutions.detail.client` | baru | Hanya "Sudah berjalan" |
| Fakta 2 | Bidang usaha | `pages.solutions.detail.industri` | baru |  |
| Fakta 3 | Tim | `pages.solutions.detail.tim` | baru |  |
| Fakta 4 | Hasil utama | `pages.solutions.detail.result` | baru |  |
| Section 1 eyebrow | Masalahnya | `pages.solutions.detail.pains.eb` | baru |  |
| Section 1 H2 | Kenapa pekerjaan ini menyita waktu tim? | `pages.solutions.detail.pains.h` | baru |  |
| Section 2 eyebrow | Cara kerjanya | `pages.solutions.detail.steps.eb` | baru | H2 = `question` solusi, lead = `answer` |
| Section 3 eyebrow | Sebelum dan sesudah | `pages.solutions.detail.compare.eb` | baru |  |
| Section 3 H2 | Apa bedanya dengan cara manual? | `pages.solutions.detail.compare.h` | baru |  |
| Tabel kolom 1 | Pekerjaan | `pages.solutions.detail.compare.aspect` | baru |  |
| Tabel kolom 2 | Cara manual | `pages.solutions.detail.compare.before` | baru |  |
| Tabel kolom 3 | Dengan asisten | `pages.solutions.detail.compare.after` | baru |  |
| Section 4 eyebrow | Cocok untuk siapa | `pages.solutions.detail.fit.eb` | baru |  |
| Section 4 H2 | Apakah solusi ini cocok untuk usaha saya? | `pages.solutions.detail.fit.h` | baru |  |
| Section 4 kolom kiri | Cocok untuk | `pages.solutions.detail.fit.yes` | baru |  |
| Section 4 kolom kanan | Kurang cocok untuk | `pages.solutions.detail.fit.no` | baru |  |
| Section 5 eyebrow | Yang perlu disiapkan | `pages.solutions.detail.prep.eb` | baru |  |
| Section 5 H2 | Apa yang perlu saya siapkan? | `pages.solutions.detail.prep.h` | baru |  |
| Section 6 eyebrow | Hasilnya | `pages.solutions.detail.metrics.eb` | baru | Hanya "Sudah berjalan" |
| Section 6 H2 | Apa yang berubah setelah berjalan? | `pages.solutions.detail.metrics.h` | baru |  |
| Section 6 catatan | Angka contoh. Angka asli dipakai setelah klien memberi izin. | `pages.solutions.detail.metrics.note` | baru |  |
| Section 7 eyebrow | Aplikasi yang dipakai | `pages.solutions.detail.apps.eb` | baru |  |
| Section 7 H2 | Tetap di aplikasi yang tim Anda pakai | `pages.solutions.detail.apps.h` | baru |  |
| Section 8 eyebrow | Pertanyaan umum | `pages.solutions.detail.faq.eb` | baru |  |
| Section 8 H2 | Yang sering ditanyakan | `pages.solutions.detail.faq.h` | baru |  |
| CTA H2 | Mau solusi seperti ini untuk usaha Anda? | `pages.solutions.detail.cta.h` | baru |  |
| CTA paragraf | Ceritakan alur kerja Anda. Kami bantu petakan solusinya, gratis. | `pages.solutions.detail.cta.body` | baru |  |
| CTA tombol 1 | Konsultasi gratis | `cta.free` | ada | Pesan template 12.4 |
| CTA tombol 2 | Kembali ke etalase | `pages.solutions.results.back` | ada |  |
| Section terkait eyebrow | Solusi terkait | `pages.solutions.detail.related.eb` | baru |  |
| Section terkait H2 | Biasanya juga dibutuhkan | `pages.solutions.detail.related.h` | baru | 2 solusi, rumus di SOLUSI-V1-LOGIKA.md |

## 18. Footer

| Lokasi | Teks v1 | Kunci / file | Status | Catatan |
|---|---|---|---|---|
| Logo (alt) | Kreatekno | – | ada | Footer Wildan |
| Catatan prototipe | Prototipe halaman Solusi (etalase). Nama klien disamarkan; isi dan angka adalah contoh. | – | prototipe | Jangan dibawa ke website |
| Grup bahasa (aria-label) | Bahasa | `lang.*` (repo Wildan) | ada | LangSwitch Wildan |
| Pilihan bahasa | Indonesia / English | LangSwitch Wildan | ada | Di prototipe tombolnya tidak berfungsi |
| Isi footer lain | – | `footer.*` | ada | v1 tidak mengubah footer Wildan |

## 19. Isi lengkap 12 solusi

Semua teks sudah ada di `site/content/solusi/items/<slug>.ts` di bawah `id`. Kolom "Field" memakai nama field di file data.

### 19.1 order-grup

| Field | Teks |
|---|---|
| status | Sudah berjalan |
| updated | 28 Okt 2026 (data: ISO) |
| industri | Logistik, Retail & F&B |
| tim | Operasional, Penjualan |
| apps | WhatsApp, Google Sheets |
| id.title | Order dari grup WhatsApp tercatat sendiri ke Google Sheets |
| id.question | Bagaimana order dari grup WhatsApp bisa tercatat otomatis? |
| id.result | Order tercatat tanpa diketik ulang |
| id.summary (baru) | Order yang ditulis sales di grup WhatsApp otomatis tercatat ke Google Sheets, dan pemilik menerima rekap setiap malam. |
| id.answer | Asisten order dipasang di grup WhatsApp yang sudah dipakai tim. Setiap order yang ditulis sales dicatat ke Google Sheets, tim diberi kabar di grup, dan pemilik menerima rekap setiap malam. Tim tidak perlu mengubah cara mereka mengirim order. |
| id.client | Distributor air minum, Pekanbaru |
| id.pains[0] | Satu admin membaca seluruh grup lalu mengetik ulang setiap order ke tabel. |
| id.pains[1] | Revisi order tertimbun obrolan, sehingga ada order yang terlewat. |
| id.pains[2] | Pemilik baru tahu angka penjualan keesokan paginya. |
| id.steps[0].title | Tim mengirim order seperti biasa |
| id.steps[0].body | Sales tetap menulis di grup WhatsApp yang sama, tanpa format khusus. |
| id.steps[1].title | Asisten mencatat ordernya |
| id.steps[1].body | Order tersusun rapi di Google Sheets. Kalau ada yang kurang jelas, tim ditanya dulu. |
| id.steps[2].title | Status selalu terbaru |
| id.steps[2].body | Kurir cukup membalas di grup, dan status di tabel ikut berubah. |
| id.steps[3].title | Pemilik menerima rekap |
| id.steps[3].body | Setiap malam, ringkasan order hari itu dikirim ke pemilik. |
| id.compare[0].aspect | Mencatat order |
| id.compare[0].before | Admin mengetik ulang dari chat |
| id.compare[0].after | Tercatat dari chat yang sama |
| id.compare[1].aspect | Tahu status pengiriman |
| id.compare[1].before | Bertanya ke admin atau kurir |
| id.compare[1].after | Terlihat di tabel |
| id.compare[2].aspect | Angka harian |
| id.compare[2].before | Dihitung keesokan pagi |
| id.compare[2].after | Dikirim malam itu juga |
| id.fit[0] | Usaha yang menerima puluhan order sehari lewat grup chat tim. |
| id.fit[1] | Tim sales dan kurir yang sudah terbiasa memakai WhatsApp. |
| id.notFit[0] | Usaha yang sudah memakai aplikasi kasir atau order online untuk semua pesanan. |
| id.prep[0] | Grup WhatsApp yang dipakai untuk order |
| id.prep[1] | Daftar produk dan harga |
| id.prep[2] | Google Sheets tujuan, atau kami yang buatkan |
| id.metrics[0] | 3 jam · waktu admin kembali setiap hari |
| id.metrics[1] | 120 order · tercatat sehari tanpa diketik ulang |
| id.metrics[2] | 1 pesan · rekap untuk pemilik setiap malam |
| id.faq[0].q | Apakah sales harus menulis order dengan format tertentu? |
| id.faq[0].a | Tidak. Asisten membaca order yang ditulis dengan bahasa sehari-hari, termasuk singkatan. |
| id.faq[1].q | Bagaimana kalau pesan ordernya kurang jelas? |
| id.faq[1].a | Asisten tidak menebak. Tim ditanya dulu, dan order baru dicatat setelah datanya jelas. |
| id.faq[2].q | Di mana data order disimpan? |
| id.faq[2].a | Di Google Sheets milik Anda sendiri, jadi data tetap bisa Anda buka dan bagikan kapan saja. |
| watch (tidak dipasang) | Ada link privat di prototipe, sengaja tidak dipasang di data |

### 19.2 booking-jasa

| Field | Teks |
|---|---|
| status | Sudah berjalan |
| updated | 27 Okt 2026 (data: ISO) |
| industri | Jasa |
| tim | Layanan pelanggan, Operasional |
| apps | WhatsApp, Google Calendar, Google Sheets |
| id.title | Booking jasa langsung dari chat pelanggan |
| id.question | Bagaimana usaha jasa menerima booking dari WhatsApp tanpa admin standby? |
| id.result | Booking terkonfirmasi tanpa menunggu admin |
| id.summary (baru) | Pelanggan memilih jadwal kosong langsung di chat WhatsApp, lalu booking tercatat otomatis ke kalender tim Anda. |
| id.answer | Asisten booking menjawab pelanggan di WhatsApp, menawarkan jadwal yang masih kosong, lalu mencatat booking ke kalender tim. Pertanyaan yang tidak bisa dijawab diteruskan ke admin lengkap dengan ringkasan chat, sehingga pelanggan tidak perlu mengulang ceritanya. |
| id.client | Usaha jasa perawatan rumah, Riau |
| id.pains[0] | Pelanggan menunggu berjam-jam hanya untuk tahu jadwal yang tersedia. |
| id.pains[1] | Jadwal tim lapangan sering bentrok karena dicatat di beberapa tempat. |
| id.pains[2] | Chat di malam hari baru dibalas keesokan paginya. |
| id.steps[0].title | Pelanggan bertanya lewat chat |
| id.steps[0].body | Pelanggan menghubungi nomor usaha seperti biasa. |
| id.steps[1].title | Asisten menawarkan jadwal |
| id.steps[1].body | Pelanggan memilih dari jadwal yang memang masih kosong. |
| id.steps[2].title | Booking masuk ke kalender |
| id.steps[2].body | Tim melihat booking baru di Google Calendar dan tabel booking. |
| id.steps[3].title | Admin menangani yang khusus |
| id.steps[3].body | Permintaan di luar kebiasaan diteruskan ke admin dengan ringkasannya. |
| id.compare[0].aspect | Konfirmasi jadwal |
| id.compare[0].before | Menunggu admin membalas |
| id.compare[0].after | Dijawab saat itu juga |
| id.compare[1].aspect | Jadwal tim |
| id.compare[1].before | Dicatat di beberapa tempat |
| id.compare[1].after | Satu kalender bersama |
| id.compare[2].aspect | Chat malam hari |
| id.compare[2].before | Dibalas besok pagi |
| id.compare[2].after | Langsung dilayani |
| id.fit[0] | Usaha jasa dengan tim lapangan dan jadwal kunjungan. |
| id.fit[1] | Usaha yang sebagian besar pelanggannya menghubungi lewat WhatsApp. |
| id.notFit[0] | Jasa yang harganya selalu dinegosiasi kasus per kasus. |
| id.prep[0] | Daftar layanan dan harga |
| id.prep[1] | Jam kerja dan kapasitas tim per hari |
| id.prep[2] | Kalender tim, atau kami yang buatkan |
| id.metrics[0] | 24 jam · pelanggan bisa booking kapan saja |
| id.metrics[1] | 0 bentrok · jadwal ganda sejak memakai satu kalender |
| id.metrics[2] | 5 menit · rata-rata sampai booking terkonfirmasi |
| id.faq[0].q | Apakah pelanggan tahu sedang dilayani asisten? |
| id.faq[0].a | Ya. Asisten memperkenalkan diri dan pelanggan bisa meminta bicara dengan admin kapan saja. |
| id.faq[1].q | Bagaimana kalau pelanggan membatalkan? |
| id.faq[1].a | Pembatalan tercatat dan slotnya kembali tersedia untuk pelanggan lain. |

### 19.3 berkas-dokumen

| Field | Teks |
|---|---|
| status | Sudah berjalan |
| updated | 26 Okt 2026 (data: ISO) |
| industri | Perjalanan, Jasa |
| tim | Operasional, Keuangan & admin |
| apps | WhatsApp, Google Drive, Google Sheets |
| id.title | Berkas dokumen pelanggan dirapikan otomatis |
| id.question | Bagaimana mengumpulkan dokumen pelanggan dari chat tanpa berantakan? |
| id.result | Berkas lengkap dan rapi per pelanggan |
| id.summary (baru) | Pelanggan cukup mengirim foto dokumen lewat WhatsApp. Berkas dirapikan, disimpan per pelanggan, dan kelengkapannya tercatat. |
| id.answer | Pelanggan cukup mengirim foto dokumennya lewat WhatsApp. Foto dirapikan ke ukuran yang dibutuhkan, disimpan ke folder Google Drive per pelanggan, dan kelengkapannya tercatat di Google Sheets. Tim tinggal memeriksa dan memproses berkas yang sudah lengkap. |
| id.client | Agen perjalanan, Sumatra |
| id.pains[0] | Foto dokumen dikirim miring, buram, atau terpotong. |
| id.pains[1] | Tim merapikan dan memberi nama file satu per satu. |
| id.pains[2] | Sulit melihat pelanggan mana yang berkasnya belum lengkap. |
| id.steps[0].title | Pelanggan mengirim foto dokumen |
| id.steps[0].body | Lewat chat WhatsApp, tanpa aplikasi tambahan. |
| id.steps[1].title | Foto dirapikan |
| id.steps[1].body | Dokumen disimpan dengan ukuran dan nama file yang seragam. |
| id.steps[2].title | Berkas tersimpan per pelanggan |
| id.steps[2].body | Setiap pelanggan punya foldernya sendiri di Google Drive. |
| id.steps[3].title | Tim melihat kelengkapan |
| id.steps[3].body | Tabel menunjukkan berkas yang sudah lengkap dan yang masih kurang. |
| id.compare[0].aspect | Merapikan foto |
| id.compare[0].before | Satu per satu di komputer |
| id.compare[0].after | Sudah rapi saat tersimpan |
| id.compare[1].aspect | Mencari berkas |
| id.compare[1].before | Menggulir chat lama |
| id.compare[1].after | Satu folder per pelanggan |
| id.compare[2].aspect | Cek kelengkapan |
| id.compare[2].before | Dihitung manual |
| id.compare[2].after | Terlihat di tabel |
| id.fit[0] | Usaha yang mengumpulkan dokumen dari banyak pelanggan sekaligus. |
| id.fit[1] | Tim kecil yang memproses berkas untuk pengajuan ke pihak lain. |
| id.notFit[0] | Dokumen yang wajib diserahkan dalam bentuk fisik asli. |
| id.prep[0] | Daftar dokumen yang dibutuhkan per layanan |
| id.prep[1] | Aturan ukuran dan format file |
| id.prep[2] | Akun Google Drive usaha |
| id.metrics[0] | 60 % · waktu merapikan berkas berkurang |
| id.metrics[1] | 1 folder · per pelanggan, nama file seragam |
| id.metrics[2] | 0 berkas · yang terselip di chat lama |
| id.faq[0].q | Apakah dokumen pelanggan aman? |
| id.faq[0].a | Dokumen disimpan di Google Drive milik usaha Anda dengan akses yang Anda atur sendiri. |
| id.faq[1].q | Bagaimana kalau fotonya buram? |
| id.faq[1].a | Pelanggan diminta mengirim ulang sebelum berkas dianggap lengkap. |

### 19.4 riset-konten

| Field | Teks |
|---|---|
| status | Sudah berjalan |
| updated | 24 Okt 2026 (data: ISO) |
| industri | Retail & F&B, Jasa, Klinik |
| tim | Marketing |
| apps | Instagram, Google Sheets |
| id.title | Ide konten mingguan dari tren media sosial |
| id.question | Bagaimana menemukan ide konten media sosial setiap minggu tanpa riset manual? |
| id.result | Daftar ide konten siap pakai setiap minggu |
| id.summary (baru) | Setiap minggu, tren media sosial di bidang Anda disusun menjadi daftar ide konten siap pakai untuk tim marketing. |
| id.answer | Setiap minggu, tren dan pertanyaan yang ramai di media sosial dikumpulkan sesuai topik usaha Anda, lalu disusun menjadi daftar ide konten di Google Sheets lengkap dengan sudut pandang dan contoh judul. Tim marketing tinggal memilih dan menulis. |
| id.client | Brand edukasi bisnis, Jakarta |
| id.pains[0] | Tim marketing menghabiskan berjam-jam mencari ide sebelum mulai menulis. |
| id.pains[1] | Konten dibuat berdasarkan tebakan, bukan yang sedang dibicarakan audiens. |
| id.steps[0].title | Topik usaha ditentukan |
| id.steps[0].body | Anda memilih topik dan akun yang ingin dipantau. |
| id.steps[1].title | Tren dikumpulkan |
| id.steps[1].body | Pembahasan yang sedang ramai dirangkum setiap minggu. |
| id.steps[2].title | Ide konten disusun |
| id.steps[2].body | Setiap ide punya sudut pandang dan contoh judul. |
| id.steps[3].title | Tim memilih |
| id.steps[3].body | Ide yang dipilih masuk ke kalender konten. |
| id.compare[0].aspect | Mencari ide |
| id.compare[0].before | Berjam-jam setiap minggu |
| id.compare[0].after | Daftar siap setiap Senin |
| id.compare[1].aspect | Dasar ide |
| id.compare[1].before | Tebakan |
| id.compare[1].after | Pembahasan yang sedang ramai |
| id.compare[2].aspect | Kalender konten |
| id.compare[2].before | Sering kosong |
| id.compare[2].after | Terisi dari daftar ide |
| id.fit[0] | Usaha yang ingin posting rutin tapi kehabisan ide. |
| id.fit[1] | Tim marketing kecil tanpa waktu riset. |
| id.notFit[0] | Brand yang kontennya sepenuhnya mengikuti kampanye dari kantor pusat. |
| id.prep[0] | Topik dan audiens utama usaha |
| id.prep[1] | Akun pesaing atau referensi yang ingin dipantau |
| id.metrics[0] | 20 ide · konten baru setiap minggu |
| id.metrics[1] | 4 jam · riset mingguan yang tidak perlu lagi |
| id.metrics[2] | 1 tabel · kalender konten untuk seluruh tim |
| id.faq[0].q | Apakah kontennya ditulis otomatis? |
| id.faq[0].a | Tidak. Yang disiapkan adalah ide dan sudut pandangnya; tim Anda yang menulis dengan gaya brand. |
| id.faq[1].q | Bisa untuk platform apa saja? |
| id.faq[1].a | Ide bisa dipakai untuk Instagram, TikTok, maupun platform lain yang Anda gunakan. |

### 19.5 cs-klinik

| Field | Teks |
|---|---|
| status | Siap dibuat |
| updated | 30 Okt 2026 (data: ISO) |
| industri | Klinik |
| tim | Layanan pelanggan |
| apps | WhatsApp, Google Calendar |
| id.title | Pertanyaan pasien terjawab di luar jam kerja |
| id.question | Bagaimana klinik menjawab chat pasien di malam hari tanpa menambah staf? |
| id.result | Pasien dilayani 24 jam, admin fokus ke pasien yang datang |
| id.summary (baru) | Pertanyaan pasien soal jam praktik, harga, dan jadwal dokter terjawab di luar jam kerja, pertanyaan medis tetap diteruskan. |
| id.answer | Asisten CS menjawab pertanyaan pasien yang paling sering muncul, seperti jam praktik, harga, dan jadwal dokter, dari data klinik Anda sendiri. Pasien bisa langsung membuat janji temu, dan pertanyaan medis selalu diteruskan ke staf klinik. |
| id.pains[0] | Admin menjawab pertanyaan yang sama puluhan kali sehari. |
| id.pains[1] | Chat yang masuk malam hari baru dibalas keesokan paginya. |
| id.steps[0].title | Pasien bertanya lewat chat |
| id.steps[0].body | Lewat nomor WhatsApp klinik yang sudah dikenal pasien. |
| id.steps[1].title | Asisten menjawab dari data klinik |
| id.steps[1].body | Jam praktik, harga, dan jadwal dokter sesuai data Anda. |
| id.steps[2].title | Janji temu tercatat |
| id.steps[2].body | Pasien memilih jadwal dan janji temu masuk ke kalender. |
| id.steps[3].title | Staf menangani pertanyaan medis |
| id.steps[3].body | Pertanyaan medis selalu diteruskan ke staf klinik. |
| id.compare[0].aspect | Pertanyaan rutin |
| id.compare[0].before | Dijawab admin satu per satu |
| id.compare[0].after | Dijawab saat itu juga |
| id.compare[1].aspect | Chat malam hari |
| id.compare[1].before | Dibalas besok pagi |
| id.compare[1].after | Dilayani langsung |
| id.compare[2].aspect | Janji temu |
| id.compare[2].before | Dicatat manual |
| id.compare[2].after | Masuk ke kalender |
| id.fit[0] | Klinik yang menerima banyak pertanyaan berulang lewat WhatsApp. |
| id.notFit[0] | Layanan yang membutuhkan diagnosis lewat chat. |
| id.prep[0] | Daftar layanan, harga, dan jadwal dokter |
| id.prep[1] | Pertanyaan yang paling sering diajukan pasien |
| id.faq[0].q | Apakah asisten memberi saran medis? |
| id.faq[0].a | Tidak. Pertanyaan medis selalu diteruskan ke staf klinik. |
| id.faq[1].q | Apakah pasien bisa bicara dengan manusia? |
| id.faq[1].a | Bisa, kapan saja. Asisten meneruskan chat ke admin. |

### 19.6 pengingat-tagihan

| Field | Teks |
|---|---|
| status | Siap dibuat |
| updated | 30 Okt 2026 (data: ISO) |
| industri | Jasa, Properti, Logistik |
| tim | Keuangan & admin |
| apps | WhatsApp, Google Sheets, Gmail |
| id.title | Tagihan jatuh tempo diingatkan otomatis |
| id.question | Bagaimana mengingatkan pelanggan soal tagihan tanpa terasa sungkan? |
| id.result | Pembayaran lebih tepat waktu tanpa menagih manual |
| id.summary (baru) | Pengingat tagihan terkirim sopan lewat WhatsApp atau email sebelum jatuh tempo, dan status pembayaran diperbarui di Google Sheets. |
| id.answer | Pengingat tagihan dikirim ke pelanggan lewat WhatsApp atau email sebelum dan saat jatuh tempo, dengan bahasa yang sopan dan sesuai gaya usaha Anda. Status pembayaran diperbarui di Google Sheets, sehingga tim keuangan tahu siapa yang perlu dihubungi langsung. |
| id.pains[0] | Tim keuangan menagih satu per satu dan sering merasa sungkan. |
| id.pains[1] | Tagihan terlupa karena jadwal jatuh tempo berbeda-beda. |
| id.steps[0].title | Tagihan tercatat |
| id.steps[0].body | Daftar tagihan dan jatuh tempo ada di Google Sheets. |
| id.steps[1].title | Pengingat dikirim |
| id.steps[1].body | Pelanggan menerima pengingat yang sopan sebelum jatuh tempo. |
| id.steps[2].title | Status diperbarui |
| id.steps[2].body | Tagihan yang sudah dibayar ditandai lunas. |
| id.steps[3].title | Tim menindaklanjuti yang tersisa |
| id.steps[3].body | Tim keuangan hanya menghubungi pelanggan yang belum membayar. |
| id.compare[0].aspect | Mengingatkan |
| id.compare[0].before | Menagih satu per satu |
| id.compare[0].after | Terkirim sesuai jadwal |
| id.compare[1].aspect | Status pembayaran |
| id.compare[1].before | Dicek manual |
| id.compare[1].after | Terlihat di tabel |
| id.compare[2].aspect | Beban tim |
| id.compare[2].before | Semua pelanggan |
| id.compare[2].after | Hanya yang belum membayar |
| id.fit[0] | Usaha dengan tagihan rutin bulanan atau termin. |
| id.notFit[0] | Usaha yang semua pembayarannya tunai di tempat. |
| id.prep[0] | Daftar pelanggan dan jadwal tagihan |
| id.prep[1] | Contoh kalimat pengingat yang biasa dipakai |
| id.faq[0].q | Apakah pelanggan merasa ditagih mesin? |
| id.faq[0].a | Kalimat pengingat mengikuti gaya bahasa usaha Anda dan bisa Anda ubah kapan saja. |

### 19.7 rekap-penjualan

| Field | Teks |
|---|---|
| status | Siap dibuat |
| updated | 30 Okt 2026 (data: ISO) |
| industri | Retail & F&B, Logistik |
| tim | Manajemen, Keuangan & admin |
| apps | Google Sheets, WhatsApp |
| id.title | Rekap penjualan harian tanpa hitung manual |
| id.question | Bagaimana pemilik usaha menerima rekap penjualan setiap hari tanpa menghitung sendiri? |
| id.result | Angka penjualan sampai di HP pemilik setiap malam |
| id.summary (baru) | Setiap malam pemilik menerima rekap penjualan di WhatsApp: total, produk terlaris, dan perbandingan dengan hari sebelumnya. |
| id.answer | Data penjualan dari tabel yang sudah dipakai tim dirangkum setiap malam menjadi satu pesan WhatsApp untuk pemilik: total penjualan, produk terlaris, dan perbandingan dengan hari sebelumnya. Pemilik tidak perlu membuka laptop atau menunggu laporan admin. |
| id.pains[0] | Pemilik baru tahu angka penjualan setelah admin selesai menghitung. |
| id.pains[1] | Laporan mingguan sering terlambat atau tidak dibuat. |
| id.steps[0].title | Penjualan tercatat seperti biasa |
| id.steps[0].body | Tim tetap memakai tabel atau catatan yang sudah ada. |
| id.steps[1].title | Angka dirangkum |
| id.steps[1].body | Total, produk terlaris, dan perbandingan harian disusun. |
| id.steps[2].title | Rekap dikirim |
| id.steps[2].body | Pemilik menerima satu pesan setiap malam. |
| id.steps[3].title | Pemilik memutuskan |
| id.steps[3].body | Keputusan stok dan promosi diambil dari angka hari itu. |
| id.compare[0].aspect | Melihat angka harian |
| id.compare[0].before | Menunggu admin |
| id.compare[0].after | Langsung di HP |
| id.compare[1].aspect | Laporan mingguan |
| id.compare[1].before | Sering terlambat |
| id.compare[1].after | Terbentuk dari rekap harian |
| id.fit[0] | Pemilik toko atau distributor yang ingin memantau penjualan dari HP. |
| id.notFit[0] | Usaha yang belum mencatat penjualan sama sekali. |
| id.prep[0] | Tabel penjualan yang sudah dipakai tim |
| id.prep[1] | Angka apa saja yang ingin dilihat pemilik |
| id.faq[0].q | Kalau data penjualan masih di buku tulis? |
| id.faq[0].a | Kami bantu pindahkan ke tabel sederhana lebih dulu. |

### 19.8 followup-prospek

| Field | Teks |
|---|---|
| status | Siap dibuat |
| updated | 30 Okt 2026 (data: ISO) |
| industri | Properti |
| tim | Penjualan, Marketing |
| apps | WhatsApp, Google Sheets |
| id.title | Calon pembeli properti tidak lagi lupa di-follow-up |
| id.question | Bagaimana tim marketing properti menindaklanjuti setiap calon pembeli tepat waktu? |
| id.result | Setiap prospek dihubungi kembali sesuai jadwal |
| id.summary (baru) | Calon pembeli dari iklan dan survei tercatat rapi, dan tim marketing diingatkan kapan harus menghubungi kembali. |
| id.answer | Setiap calon pembeli yang masuk dari iklan atau survei lokasi tercatat di Google Sheets beserta minatnya. Tim marketing menerima pengingat kapan harus menghubungi kembali, dan pesan lanjutan bisa disiapkan sesuai tipe unit yang diminati. |
| id.pains[0] | Prospek dari iklan tercecer di banyak chat. |
| id.pains[1] | Calon pembeli lupa dihubungi kembali setelah survei. |
| id.steps[0].title | Prospek masuk |
| id.steps[0].body | Dari iklan, chat, atau survei lokasi. |
| id.steps[1].title | Prospek tercatat |
| id.steps[1].body | Nama, minat, dan sumbernya tersimpan di tabel. |
| id.steps[2].title | Pengingat follow-up |
| id.steps[2].body | Tim menerima pengingat sesuai jadwal. |
| id.steps[3].title | Tim menghubungi |
| id.steps[3].body | Pesan lanjutan sesuai unit yang diminati. |
| id.compare[0].aspect | Mencatat prospek |
| id.compare[0].before | Tercecer di chat |
| id.compare[0].after | Satu tabel |
| id.compare[1].aspect | Follow-up |
| id.compare[1].before | Mengandalkan ingatan |
| id.compare[1].after | Ada pengingat |
| id.fit[0] | Developer dan agen properti dengan banyak prospek dari iklan. |
| id.notFit[0] | Penjualan yang seluruhnya lewat agen luar. |
| id.prep[0] | Sumber prospek yang dipakai sekarang |
| id.prep[1] | Daftar unit dan tipe |
| id.faq[0].q | Apakah pesan follow-up dikirim otomatis? |
| id.faq[0].a | Bisa otomatis atau hanya disiapkan untuk dikirim tim, sesuai pilihan Anda. |

### 19.9 carousel-konten

| Field | Teks |
|---|---|
| status | Siap dibuat |
| updated | 30 Okt 2026 (data: ISO) |
| industri | Retail & F&B, Klinik |
| tim | Marketing |
| apps | Instagram, Google Drive |
| id.title | Carousel Instagram dari satu topik |
| id.question | Bagaimana membuat carousel Instagram lebih cepat tanpa desainer? |
| id.result | Draf carousel siap disetujui dalam hitungan menit |
| id.summary (baru) | Anda cukup mengirim satu topik. Isi slide ditulis sesuai gaya brand Anda, lalu dikirim untuk disetujui. |
| id.answer | Anda cukup mengirim satu topik. Isi slide ditulis dengan gaya bahasa brand Anda, diisi ke template desain milik Anda, lalu dikirim sebagai pratinjau untuk disetujui. Yang disetujui disimpan ke Google Drive dan siap diposting. |
| id.pains[0] | Satu carousel bisa makan waktu setengah hari. |
| id.pains[1] | Posting jadi tidak rutin karena prosesnya panjang. |
| id.steps[0].title | Anda mengirim topik |
| id.steps[0].body | Satu kalimat sudah cukup. |
| id.steps[1].title | Isi slide ditulis |
| id.steps[1].body | Mengikuti gaya bahasa brand Anda. |
| id.steps[2].title | Slide dibuat dari template |
| id.steps[2].body | Memakai warna dan font brand Anda. |
| id.steps[3].title | Anda menyetujui |
| id.steps[3].body | Carousel yang disetujui siap diposting. |
| id.compare[0].aspect | Membuat carousel |
| id.compare[0].before | Setengah hari |
| id.compare[0].after | Draf dalam hitungan menit |
| id.compare[1].aspect | Konsistensi desain |
| id.compare[1].before | Tergantung siapa yang membuat |
| id.compare[1].after | Selalu memakai template brand |
| id.fit[0] | Usaha yang rutin membuat konten edukasi atau promosi. |
| id.notFit[0] | Konten yang selalu membutuhkan foto produk baru. |
| id.prep[0] | Template desain brand |
| id.prep[1] | Contoh konten yang pernah disukai audiens |
| id.faq[0].q | Apakah langsung terposting? |
| id.faq[0].a | Tidak. Setiap carousel menunggu persetujuan Anda. |

### 19.10 asisten-sop

| Field | Teks |
|---|---|
| status | Siap dibuat |
| updated | 30 Okt 2026 (data: ISO) |
| industri | Retail & F&B, Klinik, Properti, Logistik, Jasa, Perjalanan |
| tim | SDM, Operasional |
| apps | WhatsApp, Google Drive |
| id.title | Staf baru menemukan jawaban SOP sendiri |
| id.question | Bagaimana staf baru bisa memahami SOP tanpa terus bertanya ke atasan? |
| id.result | Atasan tidak lagi menjawab pertanyaan yang sama |
| id.summary (baru) | Staf bertanya lewat WhatsApp dengan bahasa sehari-hari dan mendapat jawaban dari SOP Anda, lengkap dengan sumbernya. |
| id.answer | Dokumen SOP yang sudah Anda punya dijadikan asisten tanya-jawab untuk staf. Staf bertanya lewat WhatsApp dengan bahasa sehari-hari dan mendapat jawaban dari SOP Anda, lengkap dengan bagian dokumen yang menjadi sumbernya. |
| id.pains[0] | Staf baru bertanya hal yang sama berulang kali. |
| id.pains[1] | SOP ada, tetapi jarang dibuka karena panjang. |
| id.steps[0].title | SOP dikumpulkan |
| id.steps[0].body | Dokumen yang sudah ada di Google Drive. |
| id.steps[1].title | Staf bertanya |
| id.steps[1].body | Lewat chat dengan bahasa sehari-hari. |
| id.steps[2].title | Jawaban dari SOP Anda |
| id.steps[2].body | Lengkap dengan bagian dokumen sumbernya. |
| id.steps[3].title | SOP diperbarui |
| id.steps[3].body | Pertanyaan yang belum terjawab menjadi bahan perbaikan SOP. |
| id.compare[0].aspect | Menjawab pertanyaan staf |
| id.compare[0].before | Atasan, berulang kali |
| id.compare[0].after | Asisten, dari SOP |
| id.compare[1].aspect | Memakai SOP |
| id.compare[1].before | Jarang dibuka |
| id.compare[1].after | Ditanya setiap hari |
| id.fit[0] | Usaha dengan pergantian staf yang cukup sering. |
| id.notFit[0] | Usaha yang belum punya SOP tertulis sama sekali. |
| id.prep[0] | Dokumen SOP yang sudah ada |
| id.prep[1] | Daftar pertanyaan yang sering ditanyakan staf |
| id.faq[0].q | Kalau SOP belum lengkap? |
| id.faq[0].a | Pertanyaan yang belum terjawab dicatat, jadi Anda tahu bagian mana yang perlu ditulis. |

### 19.11 stok-menipis

| Field | Teks |
|---|---|
| status | Siap dibuat |
| updated | 30 Okt 2026 (data: ISO) |
| industri | Retail & F&B, Logistik |
| tim | Operasional, Manajemen |
| apps | Google Sheets, WhatsApp |
| id.title | Peringatan stok menipis sebelum habis |
| id.question | Bagaimana tahu stok akan habis sebelum terlambat memesan ulang? |
| id.result | Pesan ulang tepat waktu, stok tidak kosong |
| id.summary (baru) | Stok gudang dipantau setiap hari, dan tim pembelian menerima peringatan WhatsApp sebelum barang habis. |
| id.answer | Stok di tabel gudang dipantau setiap hari. Saat sebuah barang mendekati batas minimum, tim pembelian menerima pesan WhatsApp berisi barang, sisa stok, dan perkiraan kapan habis, sehingga pemesanan ulang bisa dilakukan sebelum stok kosong. |
| id.pains[0] | Stok baru ketahuan habis saat pelanggan memesan. |
| id.pains[1] | Cek stok gudang dilakukan manual dan tidak rutin. |
| id.steps[0].title | Stok tercatat |
| id.steps[0].body | Di tabel gudang yang sudah dipakai. |
| id.steps[1].title | Stok dipantau |
| id.steps[1].body | Setiap hari, tanpa dicek manual. |
| id.steps[2].title | Peringatan dikirim |
| id.steps[2].body | Tim menerima pesan saat stok mendekati batas. |
| id.steps[3].title | Tim memesan ulang |
| id.steps[3].body | Sebelum barang benar-benar habis. |
| id.compare[0].aspect | Mengetahui stok menipis |
| id.compare[0].before | Saat sudah habis |
| id.compare[0].after | Sebelum habis |
| id.compare[1].aspect | Cek gudang |
| id.compare[1].before | Manual, tidak rutin |
| id.compare[1].after | Dipantau setiap hari |
| id.fit[0] | Toko dan gudang dengan banyak jenis barang. |
| id.notFit[0] | Usaha dengan stok yang sangat sedikit jenisnya. |
| id.prep[0] | Tabel stok yang sudah dipakai |
| id.prep[1] | Batas minimum per barang |
| id.faq[0].q | Kalau stok dicatat di aplikasi kasir? |
| id.faq[0].a | Data bisa diambil dari ekspor aplikasi kasir Anda. |

### 19.12 ulasan-pelanggan

| Field | Teks |
|---|---|
| status | Siap dibuat |
| updated | 30 Okt 2026 (data: ISO) |
| industri | Retail & F&B, Klinik, Jasa |
| tim | Layanan pelanggan, Manajemen |
| apps | Google Sheets, Gmail |
| id.title | Keluhan pelanggan terkumpul di satu tempat |
| id.question | Bagaimana pemilik usaha tahu keluhan pelanggan yang paling sering muncul? |
| id.result | Pemilik melihat pola keluhan setiap minggu |
| id.summary (baru) | Keluhan dari chat, email, dan formulir terkumpul di satu tabel, dengan ringkasan topik teratas setiap minggu. |
| id.answer | Keluhan dan ulasan dari chat, email, dan formulir dikumpulkan ke satu tabel, lalu dikelompokkan per topik. Setiap minggu pemilik menerima ringkasan keluhan yang paling sering muncul, sehingga perbaikan bisa diprioritaskan. |
| id.pains[0] | Keluhan tercecer di chat, email, dan media sosial. |
| id.pains[1] | Pemilik tidak tahu masalah mana yang paling sering terjadi. |
| id.steps[0].title | Keluhan masuk |
| id.steps[0].body | Dari chat, email, atau formulir. |
| id.steps[1].title | Keluhan terkumpul |
| id.steps[1].body | Dalam satu tabel, dikelompokkan per topik. |
| id.steps[2].title | Ringkasan mingguan |
| id.steps[2].body | Pemilik menerima topik keluhan teratas. |
| id.steps[3].title | Perbaikan diprioritaskan |
| id.steps[3].body | Tim fokus pada masalah yang paling sering muncul. |
| id.compare[0].aspect | Melihat keluhan |
| id.compare[0].before | Tersebar di banyak tempat |
| id.compare[0].after | Satu tabel |
| id.compare[1].aspect | Menentukan prioritas |
| id.compare[1].before | Berdasarkan ingatan |
| id.compare[1].after | Berdasarkan data mingguan |
| id.fit[0] | Usaha dengan banyak interaksi pelanggan setiap hari. |
| id.notFit[0] | Usaha yang keluhannya sangat jarang. |
| id.prep[0] | Saluran keluhan yang dipakai sekarang |
| id.prep[1] | Topik keluhan yang ingin dipantau |
| id.faq[0].q | Apakah keluhan dibalas otomatis? |
| id.faq[0].a | Tidak harus. Fokus utamanya adalah mengumpulkan dan merangkum. |

