# Halaman detail solusi v1 (Order Grup): semua copy

| Info | Isi |
|---|---|
| Tanggal | 4 November 2026 |
| Sumber | `prototype/solusi-detail-order-grup-v1.html` (versi final v1 yang disetujui Heru, 4 Nov). Artifact: "Detail Solusi Order Grup Scroll" |
| Solusi contoh | `order-grup` · "Order dari grup WhatsApp tercatat sendiri ke Google Sheets" |
| Pembaca | Wildan (integrasi ke `kreatekno-website-3d`, route `app/[locale]/(pages)/solusi/[slug]/`) |
| Dokumen pasangan | `docs/SOLUSI-DETAIL-ORDER-GRUP-V1-VISUAL.md` (ukuran, warna, bentuk, 3D), `docs/SOLUSI-DETAIL-ORDER-GRUP-V1-LOGIKA.md` (perilaku, rumus, flowchart) |
| Dokumen lama yang dipakai ulang | `docs/SOLUSI-V1-COPY.md`: kunci nav (bagian 2), pop up kontak (bagian 9), template pesan (bagian 12), taksonomi (bagian 13), label tetap halaman detail (bagian 17). Kunci di sana dipakai apa adanya, tidak dibuat ulang |
| Kolom "Jenis" | **TETAP** = teks sama di 12 solusi (masuk `site/messages/id.json`) · **PER SOLUSI** = isinya beda per solusi (masuk file data) |
| Kolom "Kunci / field" | Kunci next-intl di `site/messages/id.json`, atau field di `site/content/solusi/items/<slug>.ts` (`id.<field>`), atau file usulan `site/content/solusi/cerita/<slug>.ts` |
| Kolom "Status" | **ada** = kunci/field sudah ada dengan teks sama · **baru** = kunci baru (sebagian sudah diusulkan di SOLUSI-V1-COPY bagian 17, ditandai "baru (V1-17)") · **data** = field sudah ada di file data, teks sama · **data baru** = field belum ada di schema, perlu ditambah · **prototipe** = hanya di prototipe, jangan dibawa · **hitung** = teks dirakit dari data lain |
| Aturan copy | Sapaan "Anda", tanpa em dash, tanpa janji waktu, hanya aplikasi yang dilihat klien, "Sudah berjalan" disamarkan (`.claude/rules/content.md`). Temuan aturan di bagian 15 |
| Placeholder | `{nama}` dengan format ICU next-intl, contoh `t("story.of", { n: 2, total: 9 })` |

Urutan bagian di halaman: header → hero → cerita 3D ("Cara kerjanya") → Ringkasan + isi → CTA → Solusi terkait → footer. Pop up kontak muncul di atas semuanya.

---

## 1. Metadata dan judul tab

| Lokasi | Teks v1 | Kunci / field | Jenis | Status | Catatan |
|---|---|---|---|---|---|
| `<title>` website | {title} \| Kreatekno Solusi | `meta.solutions.detail.title` | TETAP | baru (V1-01) | `{title}` = `id.title` |
| `<title>` website (hasil) | Order dari grup WhatsApp tercatat sendiri ke Google Sheets \| Kreatekno Solusi | hitung | PER SOLUSI | hitung |  |
| meta description | Asisten order dipasang di grup WhatsApp yang sudah dipakai tim. Setiap order yang ditulis sales dicatat ke Google Sheets, tim diberi kabar di grup, dan pemilik menerima rekap setiap malam. Tim tidak perlu mengubah cara mereka mengirim order. | `id.answer` | PER SOLUSI | data | Usulan: description = `answer` (sudah 2 sampai 4 kalimat). Prototipe tidak punya meta description |
| `<title>` prototipe | Detail Solusi Order Grup Scroll | – | – | prototipe | Judul artifact saja |

## 2. Header (nav)

Sama dengan halaman etalase. Header di website = `components/layout/Header.tsx` (vendor Wildan).

| Lokasi | Teks v1 | Kunci / field | Jenis | Status | Catatan |
|---|---|---|---|---|---|
| Logo (aria-label + alt) | Kreatekno | `nav.home` | TETAP | ada | Prototipe: `aria-label="Kreatekno"`. Header Wildan memakai "Kreatekno, ke beranda" |
| Grup menu (aria-label) | Menu utama | Header Wildan | TETAP | ada | Prototipe saja yang menulis label ini; ikuti Header Wildan |
| Menu 1 | Layanan | `nav.services` | TETAP | ada |  |
| Menu 2 | Cara kerja | `nav.how` | TETAP | ada |  |
| Menu 3 (aktif) | Solusi | `nav.solutions` | TETAP | ada | `aria-current="page"` juga di halaman detail |
| Menu 4 | Artikel | `nav.articles` | TETAP | ada |  |
| Menu 5 | Tentang | `nav.about` | TETAP | ada |  |
| Tombol nav | Konsultasi gratis | `cta.free` | TETAP | ada | Membuka pop up kontak (bagian 12), pesan 13.1 |
| Label header (aria-label `<header>`) | Kreatekno | – | – | prototipe | Ikuti Header Wildan |

## 3. Hero

| Lokasi | Teks v1 | Kunci / field | Jenis | Status | Catatan |
|---|---|---|---|---|---|
| Breadcrumb (aria-label) | Breadcrumb | `pages.solutions.detail.crumb` | TETAP | baru | Usulan teks Indonesia: "Lokasi halaman". v1 memakai kata Inggris "Breadcrumb" |
| Breadcrumb 1 (link ke etalase) | Solusi | `nav.solutions` | TETAP | ada | Link ke `/solusi` |
| Pemisah | / | – | TETAP | – | `aria-hidden="true"` |
| Breadcrumb 2 | Logistik | `INDUSTRI[id.industri[0]].label` | PER SOLUSI | hitung | Label industri pertama (`logistik`) |
| Badge status | Sudah berjalan | `STATUS.jalan` | PER SOLUSI | data | "Siap dibuat" untuk `ide` |
| Chip tim (warna) | Operasional | `TIM[tim[0]].label` | PER SOLUSI | hitung | Hanya tim **pertama**. Warnanya warna tim (VISUAL 2.3) |
| Chip industri 1 | Logistik | `INDUSTRI[industri[0]].label` | PER SOLUSI | hitung | Semua industri, urut data |
| Chip industri 2 | Retail & F&B | `INDUSTRI[industri[1]].label` | PER SOLUSI | hitung | `&` ditulis `&amp;` di HTML |
| Tanggal | Diperbarui 28 Okt 2026 | `pages.solutions.detail.updated` ("Diperbarui {date}") + `updated` | TETAP + PER SOLUSI | baru (V1-17) + data | Data `2026-10-28` → format "28 Okt 2026" (bulan singkat Indonesia). `<time datetime="2026-10-28">` |
| H1 | Order dari grup WhatsApp tercatat sendiri ke Google Sheets | `id.title` | PER SOLUSI | data | Satu-satunya H1 di halaman |
| Pertanyaan kotak jawaban | Bagaimana order dari grup WhatsApp bisa tercatat otomatis? | `id.question` | PER SOLUSI | data | Tampil juga sebagai H2 cerita (bagian 4) |
| Jawaban | Asisten order dipasang di grup WhatsApp yang sudah dipakai tim. Setiap order yang ditulis sales dicatat ke Google Sheets, tim diberi kabar di grup, dan pemilik menerima rekap setiap malam. Tim tidak perlu mengubah cara mereka mengirim order. | `id.answer` | PER SOLUSI | data | Sumber utama AEO/GEO, harus ada di HTML awal |
| Tombol 1 | Konsultasi gratis | `cta.free` | TETAP | ada | Pop up kontak, pesan 13.2 |
| Tombol 2 | Kembali ke etalase | `pages.solutions.results.back` | TETAP | ada | Link ke `/solusi` |

## 4. Cerita 3D: pembuka

Section `#cara-kerja`. Menggantikan daftar langkah (`id.steps`) yang ada di prototipe etalase.

| Lokasi | Teks v1 | Kunci / field | Jenis | Status | Catatan |
|---|---|---|---|---|---|
| Eyebrow | Cara kerjanya | `pages.solutions.detail.steps.eb` | TETAP | baru (V1-17) |  |
| H2 | Bagaimana order dari grup WhatsApp bisa tercatat otomatis? | `id.question` | PER SOLUSI | data | Sama dengan pertanyaan kotak jawaban (sengaja: kalimat pertanyaan untuk AEO) |
| Paragraf, kalimat 1 | Ikuti perjalanan satu order, dari pesan di grup tim sampai rekap malam untuk pemilik. | `cerita.intro` | PER SOLUSI | data baru |  |
| Paragraf, kalimat 2 | Gulir untuk melihat setiap langkahnya. | `pages.solutions.detail.story.scroll` | TETAP | baru |  |
| Paragraf, kalimat 3 | Nama, proyek, dan angka adalah contoh. | `pages.solutions.detail.story.sample` | TETAP | baru | Untuk "Siap dibuat" kalimat ini tetap benar |
| Petunjuk | Gulir, sekitar 1 menit | `pages.solutions.detail.story.hint` | TETAP | baru | Ikon panah bawah. "sekitar 1 menit" = lama membaca, lihat bagian 15 |
| Catatan tanpa 3D | Browser ini tidak bisa menampilkan 3D. Ceritanya tetap bisa dibaca di kartu. | `pages.solutions.detail.story.no3d` | TETAP | baru | Hanya tampil kalau WebGL gagal |
| Rel (aria-label `<nav>`) | Lompat ke adegan | `pages.solutions.detail.story.rail` | TETAP | baru |  |
| Tombol rel (aria-label) | Adegan {n}: {label} | `pages.solutions.detail.story.railItem` | TETAP | baru | Contoh "Adegan 3: AI membaca". `{label}` = `cerita.scenes[i].rail` |
| Nomor di kartu | Adegan {n} dari {total} | `pages.solutions.detail.story.of` | TETAP | baru | Contoh "Adegan 1 dari 9" |
| Tooltip area (hover di lantai 3D) | Lihat: {area} | `pages.solutions.detail.story.look` | TETAP | baru | `{area}` = `cerita.areas[i]`. Hanya mouse |
| Daftar teks dunia 3D (aria-label) | Isi percakapan dan tabel contoh di dunia 3D | `pages.solutions.detail.story.worldLabel` | TETAP | baru | Pembungkus semua teks bagian 6 |

## 5. Cerita 3D: 9 kartu adegan

Field usulan: `cerita.scenes[]` dengan bentuk `{ rail, eb, h, p }` (kartu terakhir boleh punya `cta: true`). Jumlah adegan per solusi boleh beda (usulan 5 sampai 9). Semuanya PER SOLUSI, status **data baru**. `eb` ditulis di HTML sebagai eyebrow, `h` sebagai `<h3>`, `p` sebagai `<p>`.

| No | `rail` (label rel) | `eb` (eyebrow) | `h` (H3) | `p` (paragraf) |
|---|---|---|---|---|
| 1 | Sebelum | Sebelum | Order masuk acak di grup. Admin mengetik ulang satu per satu. | Sekitar 120 order sehari. Revisi tertimbun obrolan, dan beberapa order terlewat. |
| 2 | Pesan masuk | Langkah 1 · Pesan masuk | Tim tetap mengirim order seperti biasa. | Tidak ada format khusus dan tidak ada aplikasi baru untuk dipelajari. |
| 3 | AI membaca | Langkah 2 · AI membaca | AI membaca pesan dan memisahkan data ordernya. | Pelanggan, barang, jumlah, alamat, dan cara bayar diambil dari bahasa sehari-hari. |
| 4 | Tersimpan | Langkah 3 · Tersimpan | Data order masuk ke tabel dengan nomor sendiri. | Revisi seperti "jadi 12 dus ya" mengubah baris yang sama. |
| 5 | Konfirmasi | Langkah 4 · Konfirmasi | Sistem membalas di grup dengan nomor order. | Sales tahu ordernya sudah tercatat tanpa bertanya ke admin. |
| 6 | Status | Langkah 5 · Status | Balasan singkat dari kurir mengubah status order. | Cukup ketik "kirim 0412" atau "selesai 0412" di grup. |
| 7 | Rekap | Langkah 6 · Rekap | Setiap pukul 21.00, pemilik menerima rekap hari itu. | Jumlah order, yang selesai, yang menunggu, dan total nilainya dalam satu pesan. |
| 8 | Hasil | Hasil · angka contoh | Admin berhenti mengetik ulang dan punya waktu untuk pelanggan. | Angka yang tampil adalah contoh sampai data klien boleh ditampilkan. |
| 9 | Untuk Anda | Untuk bisnis Anda | Mau sistem seperti ini untuk bisnis Anda? | Ceritakan alur order Anda. Kami bantu petakan solusinya, gratis. |

| Lokasi | Teks v1 | Kunci / field | Jenis | Status | Catatan |
|---|---|---|---|---|---|
| Tombol di kartu 9 | Konsultasi gratis | `cta.free` | TETAP | ada | Pop up kontak, pesan 13.2 |
| Pola eyebrow langkah | Langkah {n} · {nama} | `pages.solutions.detail.story.stepEb` | TETAP (pola) | baru | Opsional: kalau dipakai, data cukup menyimpan `{nama}`. Kartu 1, 8, 9 tidak memakai pola ini |
| Pemisah eyebrow | · | – | TETAP | – | Titik tengah U+00B7 dengan spasi di kiri kanan |

Catatan: `id.steps` (4 langkah) di data **tidak tampil** di halaman detail v1. Tetap disimpan untuk dipakai di tempat lain (atau dihapus nanti, keputusan Heru).

## 6. Teks di dalam dunia 3D (HTML)

Semua teks ini ada di HTML awal halaman, di dalam `<div class="sr-only" id="wt" aria-label="…">`. Skrip 3D memindahkannya ke lapisan CSS3D dan menempelkannya ke objek. Tanpa JavaScript atau tanpa WebGL, teks tetap ada (tersembunyi secara visual, terbaca mesin pencari, bot AI, dan pembaca layar).

Field usulan: `cerita.world` (objek `id → teks`) di `site/content/solusi/cerita/<slug>.ts`. Semuanya PER SOLUSI, status **data baru**. Kolom "Adegan" = nomor adegan (1 sampai 9) saat elemen terlihat. Kolom "Peran" = struktur HTML.

### 6.1 Papan grup chat

| id | Adegan | Peran | Teks v1 |
|---|---|---|---|
| `w-ghead` | 1–9 | judul (b) | Order Gudang Pekanbaru |
| `w-ghead` | 1–9 | anggota (span) | Andi, Dina, Rudi, Sari, Bayu, dan 9 lainnya |
| `w-count` | 1 | label | 66 order hari ini · semua dibaca manual |

### 6.2 Pesan grup (chat bubble)

Setiap bubble: nama + peran (`<b>`, berwarna sesuai peran), isi (`<span>`), jam (`<time>`). Isi pesan sengaja ditulis gaya chat (huruf kecil, singkatan): jangan "dirapikan".

| id | Adegan | Nama · peran | Isi | Jam |
|---|---|---|---|---|
| `w-m0` | 1 | Rudi · sales | order toko berkah 10 dus gelas 220ml, cod | 08.12 |
| `w-m1` | 1 | Sari · gudang | kak yg pak joko kemarin udh dikirim blm? | 08.14 |
| `w-m2` | 1 | Andi · sales | pak joko 5 galon isi ulang, arifin ahmad gg mawar 3 | 08.15 |
| `w-m3` | 1–9 | Dina · CS | Foto bukti transfer | 08.17 |
| `w-m4` | 1–9 | Rudi · sales | yg toko berkah jadi 12 dus ya, revisi | 08.20 |
| `w-m5` | 1–9 | Dina · CS | warung bu tini minta 2 dus 1500ml, besok pagi aja | 08.24 |
| `w-target` | 2–3 | Andi · sales | Bu Rina pesan 3 dus air mineral 600ml, antar ke Jl. Sudirman No. 12, bayar transfer | 08.31 |
| `w-reply` | 5–7 | Asisten Order | Order #0412 tercatat: Bu Rina, 3 dus air mineral 600ml, transfer. | 08.31 |
| `w-k1` | 6 | Bayu · kurir | kirim 0412 | 10.05 |
| `w-k2` | 6 | Bayu · kurir | selesai 0412 | 10.41 |
| `w-help` | 8–9 | Admin | Halo Bu, ada yang bisa kami bantu? | – (tanpa jam) |

### 6.3 Label kecil (pil)

| id | Adegan | Teks v1 | Catatan |
|---|---|---|---|
| `w-tagA` | 1 | Belum dicatat | Menempel di pesan `w-m2` |
| `w-tagB` | 1 | Terlewat | Menempel di pesan `w-m4` |
| `w-lRudi` | 1–9 | Rudi · sales | Label nama di atas figur |
| `w-lAndi` | 1–4, 8–9 | Andi · sales | Disembunyikan saat "Tercatat" tampil di kepala Andi |
| `w-lSari` | 1–9 | Sari · gudang |  |
| `w-lDina` | 1–9 | Dina · CS |  |
| `w-lAdmin` | 1–2 | Admin · mengetik ulang ke Excel | "Excel" = aplikasi lama yang dipakai klien sebelum solusi, lihat bagian 15 |
| `w-lAdmin2` | 8–9 | Admin melayani pelanggan |  |
| `w-ai` | 3 | AI memisahkan data |  |
| `w-rev` | 4 | Revisi "jadi 12 dus ya" mengubah baris yang sama |  |
| `w-tick` | 5–7 | Tercatat | Di kepala Andi |
| `w-lBayu` | 1–9 | Bayu · kurir |  |
| `w-lOwner` | 1–9 | Pemilik |  |
| `w-clock` | 7 | Pukul 21.00 |  |
| `w-ex` | 8–9 | Angka contoh | Di atas kartu angka |

### 6.4 Label area (lantai)

Juga dipakai sebagai `{area}` di tooltip "Lihat: {area}". Field usulan `cerita.areas[]`.

| id | Teks v1 | Klik membuka adegan |
|---|---|---|
| `w-a0` | Grup chat tim | 2 |
| `w-a1` | Asisten Order | 3 |
| `w-a2` | Tabel order | 4 |
| `w-a3` | Kurir | 6 |
| `w-a4` | Rumah pemilik | 7 |

### 6.5 Balok data (adegan 3, terbang ke tabel di adegan 4)

| id | Label (`<small>`) | Nilai (`<strong>`) |
|---|---|---|
| `w-f0` | Pelanggan | Bu Rina |
| `w-f1` | Barang | Air mineral 600ml |
| `w-f2` | Jumlah | 3 dus |
| `w-f3` | Alamat | Jl. Sudirman No. 12 |
| `w-f4` | Bayar | Transfer |

Label tampil uppercase lewat CSS. Teks aslinya huruf kapital di awal saja.

### 6.6 Tabel order (`w-table`, adegan 1–9)

Tabel HTML asli (`<table>`, `<thead>`, `<tbody>`).

| Bagian | Teks v1 |
|---|---|
| Judul | Tabel order |
| Tanggal | Selasa, 25 Okt |
| Kolom 1 / 2 / 3 / 4 | No / Pelanggan / Barang / Status (uppercase lewat CSS) |

| Baris | No | Pelanggan | Barang | Status |
|---|---|---|---|---|
| `w-row` (baru, muncul di adegan 4) | 0412 | Bu Rina | 3 dus air mineral 600ml | Baru → Dikirim → Selesai (berubah di adegan 6, LOGIKA 7.6) |
| 2 | 0411 | Bu Tini | 2 dus air 1500ml | Baru |
| 3 | 0410 | Pak Joko | 5 galon isi ulang | Dikirim |
| 4 | 0409 | Toko Berkah | 12 dus gelas 220ml | Selesai |

Tiga teks status ("Baru", "Dikirim", "Selesai") = PER SOLUSI (label status di dunia Order Grup), bukan label `STATUS` taksonomi.

### 6.7 Rekap di HP pemilik (`w-recap`, adegan 7–9)

| Bagian | Teks v1 |
|---|---|
| Jam besar | 21.00 |
| Tanggal | Selasa, 25 Oktober |
| Pengirim | Asisten Order |
| Judul pesan | Rekap order hari ini |
| Baris 1 | Order masuk · 118 |
| Baris 2 | Selesai dikirim · 112 |
| Baris 3 | Menunggu dikirim · 6 |
| Baris 4 | Total nilai · Rp 14,2 jt |
| Catatan | Angka contoh |

Baris memakai `<dl>` (`<dt>` label, `<dd>` angka).

### 6.8 Kartu angka (adegan 8–9)

| id | Angka | Satuan | Keterangan | Sumber |
|---|---|---|---|---|
| `w-r0` | 3 | jam | waktu admin kembali setiap hari | `id.metrics[0]` (data) |
| `w-r1` | 120 | order | tercatat sehari tanpa diketik ulang | `id.metrics[1]` (data) |
| `w-r2` | 1 | pesan | rekap untuk pemilik setiap malam | `id.metrics[2]` (data) |

Kartu ini memakai field `metrics` yang sudah ada, jadi tidak perlu diketik dua kali. Angka di HTML awal sudah nilai akhir (3, 120, 1); animasi hitung naik hanya di layar (LOGIKA 7.8).

### 6.9 Teks di layar laptop admin (gambar canvas, bukan HTML)

Satu-satunya teks di dunia 3D yang **bukan** HTML: digambar ke `CanvasTexture` sebagai hiasan, tidak terbaca mesin pencari. Field usulan `cerita.decor.laptop` (PER SOLUSI, data baru), atau langsung di file set 3D karena hanya hiasan.

| Bagian | Teks v1 |
|---|---|
| Kepala | Pelanggan       Barang        Jml (spasi berulang untuk jarak kolom) |
| Baris 1 | 1  Toko Berkah · Gelas 220ml · 10 |
| Baris 2 | 2  Pak Joko · Galon · 5 |
| Baris 3 | 3  Bu Ri (diketik ulang huruf demi huruf di adegan 1: "B", "Bu", "Bu ", "Bu R", "Bu Ri") |

## 7. Aside "Ringkasan"

| Lokasi | Teks v1 | Kunci / field | Jenis | Status | Catatan |
|---|---|---|---|---|---|
| Judul (H2) | Ringkasan | `pages.solutions.detail.summary` | TETAP | baru (V1-17) |  |
| Catatan disamarkan | Nama dan detail klien disamarkan atas permintaan klien. | `pages.solutions.detail.veilLive` | TETAP | baru (V1-17) | Hanya "Sudah berjalan". "Siap dibuat" memakai `veilIdea` (V1-17) |
| Fakta 1 label | Klien | `pages.solutions.detail.client` | TETAP | baru (V1-17) | Hanya kalau ada `client` |
| Fakta 1 isi | Distributor air minum, Pekanbaru | `id.client` | PER SOLUSI | data |  |
| Fakta 2 label | Bidang usaha | `pages.solutions.detail.industri` | TETAP | baru (V1-17) |  |
| Fakta 2 isi | Logistik, Retail & F&B | hitung dari `industri` | PER SOLUSI | hitung | Label digabung ", " |
| Fakta 3 label | Tim | `pages.solutions.detail.tim` | TETAP | baru (V1-17) |  |
| Fakta 3 isi | Operasional, Penjualan | hitung dari `tim` | PER SOLUSI | hitung | Label digabung ", " |
| Fakta 4 label | Hasil utama | `pages.solutions.detail.result` | TETAP | baru (V1-17) |  |
| Fakta 4 isi | Order tercatat tanpa diketik ulang | `id.result` | PER SOLUSI | data |  |

Tidak ada tombol "Tonton cara kerjanya" dan tidak ada daftar isi di v1 ini.

## 8. Isi halaman

### 8.1 Masalahnya

| Lokasi | Teks v1 | Kunci / field | Jenis | Status |
|---|---|---|---|---|
| Eyebrow | Masalahnya | `pages.solutions.detail.pains.eb` | TETAP | baru (V1-17) |
| H2 | Kenapa pekerjaan ini menyita waktu tim? | `pages.solutions.detail.pains.h` | TETAP | baru (V1-17) |
| Lead | Setiap hari sekitar 120 order masuk lewat grup chat tim. Sales menulis order dengan gaya masing-masing. Ada yang lengkap, ada yang hanya menulis nama toko dan jumlah. | `id.painsLead` | PER SOLUSI | data baru |
| Poin 1 | Satu admin membaca seluruh grup lalu mengetik ulang setiap order ke tabel. | `id.pains[0]` | PER SOLUSI | data |
| Poin 2 | Revisi order tertimbun obrolan, sehingga ada order yang terlewat. | `id.pains[1]` | PER SOLUSI | data |
| Poin 3 | Pemilik baru tahu angka penjualan keesokan paginya. | `id.pains[2]` | PER SOLUSI | data |

### 8.2 Yang kami bangun

| Lokasi | Teks v1 | Kunci / field | Jenis | Status |
|---|---|---|---|---|
| Eyebrow | Yang kami bangun | `pages.solutions.detail.built.eb` | TETAP | baru |
| H2 | Grup tetap sama, pencatatannya otomatis | `id.built.h` | PER SOLUSI | data baru |
| Lead | Tim tidak perlu belajar aplikasi baru. Mereka tetap mengirim order ke grup yang sama. Di belakang grup itu, asisten membaca setiap pesan, mengenali pesan yang berisi order, lalu mencatatnya ke tabel order. | `id.built.lead` | PER SOLUSI | data baru |
| Poin 1 | Membaca bahasa sehari-hari, termasuk singkatan dan revisi seperti "jadi 12 dus ya". | `id.built.points[0]` | PER SOLUSI | data baru |
| Poin 2 | Memberi nomor order dan membalas di grup, supaya sales tahu ordernya sudah tercatat. | `id.built.points[1]` | PER SOLUSI | data baru |
| Poin 3 | Menanyakan balik di grup kalau ada data yang kurang, misalnya alamat belum ditulis. | `id.built.points[2]` | PER SOLUSI | data baru |
| Poin 4 | Mengubah status order dari balasan pendek kurir, lalu mengirim rekap ke pemilik setiap malam. | `id.built.points[3]` | PER SOLUSI | data baru |

H2 bagian ini satu-satunya H2 isi yang PER SOLUSI dan bukan kalimat tanya.

### 8.3 Sebelum dan sesudah

| Lokasi | Teks v1 | Kunci / field | Jenis | Status |
|---|---|---|---|---|
| Eyebrow | Sebelum dan sesudah | `pages.solutions.detail.compare.eb` | TETAP | baru (V1-17) |
| H2 | Apa bedanya dengan cara manual? | `pages.solutions.detail.compare.h` | TETAP | baru (V1-17) |
| Kepala kolom 1 | Pekerjaan | `pages.solutions.detail.compare.aspect` | TETAP | baru (V1-17) |
| Kepala kolom 2 | Cara manual | `pages.solutions.detail.compare.before` | TETAP | baru (V1-17) |
| Kepala kolom 3 | Dengan asisten | `pages.solutions.detail.compare.after` | TETAP | baru (V1-17) |

| Baris | `aspect` | `before` | `after` | Status |
|---|---|---|---|---|
| 1 | Mencatat order | Admin mengetik ulang dari chat | Tercatat dari chat yang sama | data |
| 2 | Tahu status pengiriman | Bertanya ke admin atau kurir | Terlihat di tabel | data |
| 3 | Angka harian | Dihitung keesokan pagi | Dikirim malam itu juga | data |

### 8.4 Hasilnya (hanya "Sudah berjalan" dengan `metrics`)

| Lokasi | Teks v1 | Kunci / field | Jenis | Status | Catatan |
|---|---|---|---|---|---|
| Eyebrow | Hasilnya | `pages.solutions.detail.metrics.eb` | TETAP | baru (V1-17) |  |
| H2 | Apa yang berubah setelah berjalan? | `pages.solutions.detail.metrics.h` | TETAP | baru (V1-17) |  |
| Tile 1 | 3 · jam · waktu admin kembali setiap hari | `id.metrics[0]` | PER SOLUSI | data | angka · satuan · keterangan |
| Tile 2 | 120 · order · tercatat sehari tanpa diketik ulang | `id.metrics[1]` | PER SOLUSI | data |  |
| Tile 3 | 1 · pesan · rekap untuk pemilik setiap malam | `id.metrics[2]` | PER SOLUSI | data |  |
| Catatan | Angka contoh. Angka asli dipakai setelah klien memberi izin. | `pages.solutions.detail.metrics.note` | TETAP | baru (V1-17) | Hapus saat angka asli disetujui |
| Kutipan | "Dulu saya baru tahu penjualan besok paginya. Sekarang setiap malam rekapnya sudah ada di HP saya." | `id.quote.text` | PER SOLUSI | data baru | Tanda kutip lurus `"` termasuk di teks v1. Usulan: tanda kutip ditambah oleh komponen, data tanpa tanda kutip |
| Sumber kutipan | Pemilik distributor air minum, Pekanbaru · kutipan contoh | `id.quote.by` + `pages.solutions.detail.metrics.quoteSample` | PER SOLUSI + TETAP | data baru + baru | `by` = "Pemilik distributor air minum, Pekanbaru". "kutipan contoh" dihapus saat kutipan asli disetujui |

### 8.5 Cocok untuk siapa

| Lokasi | Teks v1 | Kunci / field | Jenis | Status |
|---|---|---|---|---|
| Eyebrow | Cocok untuk siapa | `pages.solutions.detail.fit.eb` | TETAP | baru (V1-17) |
| H2 | Apakah solusi ini cocok untuk usaha saya? | `pages.solutions.detail.fit.h` | TETAP | baru (V1-17) |
| Kolom kiri (H3) | Cocok untuk | `pages.solutions.detail.fit.yes` | TETAP | baru (V1-17) |
| Cocok 1 | Usaha yang menerima puluhan order sehari lewat grup chat tim. | `id.fit[0]` | PER SOLUSI | data |
| Cocok 2 | Tim sales dan kurir yang sudah terbiasa memakai WhatsApp. | `id.fit[1]` | PER SOLUSI | data |
| Kolom kanan (H3) | Kurang cocok untuk | `pages.solutions.detail.fit.no` | TETAP | baru (V1-17) |
| Kurang cocok 1 | Usaha yang sudah memakai aplikasi kasir atau order online untuk semua pesanan. | `id.notFit[0]` | PER SOLUSI | data |

### 8.6 Yang perlu disiapkan

| Lokasi | Teks v1 | Kunci / field | Jenis | Status |
|---|---|---|---|---|
| Eyebrow | Yang perlu disiapkan | `pages.solutions.detail.prep.eb` | TETAP | baru (V1-17) |
| H2 | Apa yang perlu saya siapkan? | `pages.solutions.detail.prep.h` | TETAP | baru (V1-17) |
| Poin 1 | Grup WhatsApp yang dipakai untuk order | `id.prep[0]` | PER SOLUSI | data |
| Poin 2 | Daftar produk dan harga | `id.prep[1]` | PER SOLUSI | data |
| Poin 3 | Google Sheets tujuan, atau kami yang buatkan | `id.prep[2]` | PER SOLUSI | data |

### 8.7 Aplikasi yang dipakai

| Lokasi | Teks v1 | Kunci / field | Jenis | Status |
|---|---|---|---|---|
| Eyebrow | Aplikasi yang dipakai | `pages.solutions.detail.apps.eb` | TETAP | baru (V1-17) |
| H2 | Tetap di aplikasi yang tim Anda pakai | `pages.solutions.detail.apps.h` | TETAP | baru (V1-17) |
| Aplikasi 1 | WhatsApp | `APPS.whatsapp.label` (dari `apps[0]`) | PER SOLUSI | data |
| Aplikasi 2 | Google Sheets | `APPS.sheets.label` (dari `apps[1]`) | PER SOLUSI | data |

### 8.8 Pertanyaan umum

| Lokasi | Teks v1 | Kunci / field | Jenis | Status |
|---|---|---|---|---|
| Eyebrow | Pertanyaan umum | `pages.solutions.detail.faq.eb` | TETAP | baru (V1-17) |
| H2 | Yang sering ditanyakan | `pages.solutions.detail.faq.h` | TETAP | baru (V1-17) |
| Tanya 1 | Apakah sales harus menulis order dengan format tertentu? | `id.faq[0].q` | PER SOLUSI | data |
| Jawab 1 | Tidak. Asisten membaca order yang ditulis dengan bahasa sehari-hari, termasuk singkatan. | `id.faq[0].a` | PER SOLUSI | data |
| Tanya 2 | Bagaimana kalau pesan ordernya kurang jelas? | `id.faq[1].q` | PER SOLUSI | data |
| Jawab 2 | Asisten tidak menebak. Tim ditanya dulu, dan order baru dicatat setelah datanya jelas. | `id.faq[1].a` | PER SOLUSI | data |
| Tanya 3 | Di mana data order disimpan? | `id.faq[2].q` | PER SOLUSI | data |
| Jawab 3 | Di Google Sheets milik Anda sendiri, jadi data tetap bisa Anda buka dan bagikan kapan saja. | `id.faq[2].a` | PER SOLUSI | data |

FAQ memakai `<dl>` (`<dt>` tanya, `<dd>` jawab). Usulan untuk Wildan: tambahkan JSON-LD `FAQPage` dari data yang sama (urusan SEO Wildan).

### 8.9 CTA

| Lokasi | Teks v1 | Kunci / field | Jenis | Status | Catatan |
|---|---|---|---|---|---|
| H2 | Mau solusi seperti ini untuk usaha Anda? | `pages.solutions.detail.cta.h` | TETAP | baru (V1-17) |  |
| Paragraf | Ceritakan alur kerja Anda. Kami bantu petakan solusinya, gratis. | `pages.solutions.detail.cta.body` | TETAP | baru (V1-17) | Beda satu kata dengan kartu adegan 9 ("alur order Anda"), sengaja |
| Tombol 1 | Konsultasi gratis | `cta.free` | TETAP | ada | Pesan 13.2 |
| Tombol 2 | Kembali ke etalase | `pages.solutions.results.back` | TETAP | ada |  |

### 8.10 Solusi terkait

| Lokasi | Teks v1 | Kunci / field | Jenis | Status | Catatan |
|---|---|---|---|---|---|
| Eyebrow | Solusi terkait | `pages.solutions.detail.related.eb` | TETAP | baru (V1-17) |  |
| H2 | Biasanya juga dibutuhkan | `pages.solutions.detail.related.h` | TETAP | baru (V1-17) |  |
| Link 1 | Rekap penjualan harian tanpa hitung manual | `title` solusi `rekap-penjualan` | PER SOLUSI | hitung | **Lihat temuan 15.4**: rumus memberi solusi lain |
| Link 2 | Peringatan stok menipis sebelum habis | `title` solusi `stok-menipis` | PER SOLUSI | hitung |  |

## 9. Footer

| Lokasi | Teks v1 | Kunci / field | Jenis | Status | Catatan |
|---|---|---|---|---|---|
| Logo (alt) | Kreatekno | – | TETAP | ada | Footer Wildan |
| Kota | Kreatekno, Pekanbaru | – | – | prototipe | Ikuti Footer Wildan |
| Catatan prototipe | Prototype halaman detail. Nama, proyek, dan angka adalah contoh. | – | – | prototipe | Jangan dibawa. Kata "Prototype" ejaan Inggris |

## 10. Teks aksesibilitas lain

| Lokasi | Teks v1 | Kunci / field | Jenis | Status |
|---|---|---|---|---|
| Ikon di tombol, tile, daftar | – | – | – | `aria-hidden="true"`, tanpa teks |
| Canvas 3D | – | – | – | `aria-hidden="true"` |
| Lapisan CSS3D | – | – | – | `aria-hidden="false"`, teks di dalamnya tetap terbaca |
| Kartu adegan | – | – | – | `<article>` di dalam `<ol>` (urutan cerita) |

## 11. Ringkasan kunci baru (usulan, `site/messages/id.json`)

Kunci yang sudah diusulkan di SOLUSI-V1-COPY bagian 17 tidak diulang di sini. Kunci yang benar-benar baru dari halaman ini:

```json
{
  "pages": {
    "solutions": {
      "detail": {
        "crumb": "Breadcrumb",
        "story": {
          "scroll": "Gulir untuk melihat setiap langkahnya.",
          "sample": "Nama, proyek, dan angka adalah contoh.",
          "hint": "Gulir, sekitar 1 menit",
          "no3d": "Browser ini tidak bisa menampilkan 3D. Ceritanya tetap bisa dibaca di kartu.",
          "rail": "Lompat ke adegan",
          "railItem": "Adegan {n}: {label}",
          "of": "Adegan {n} dari {total}",
          "stepEb": "Langkah {n} · {name}",
          "look": "Lihat: {area}",
          "worldLabel": "Isi percakapan dan tabel contoh di dunia 3D"
        },
        "built": { "eb": "Yang kami bangun" },
        "metrics": { "quoteSample": "kutipan contoh" }
      }
    }
  }
}
```

## 12. Pop up kontak

Sama persis dengan halaman etalase. Semua teks, kunci, dan kontak placeholder: **SOLUSI-V1-COPY bagian 9**. Ringkasnya:

| Lokasi | Teks v1 | Kunci |
|---|---|---|
| Judul | Konsultasi gratis | `cta.free` |
| Paragraf | Pilih cara yang paling nyaman untuk Anda. Tim kami akan membantu memetakan solusinya. | `pages.solutions.contact.body` |
| Tombol X (aria-label) | Tutup | `pages.solutions.contact.close` |
| WhatsApp | WhatsApp · Chat langsung dengan tim kami | `pages.solutions.contact.wa.*` |
| Instagram | Instagram · Kirim pesan langsung ke akun kami | `pages.solutions.contact.ig.*` |
| Email | Email · Ceritakan kebutuhan Anda lewat email | `pages.solutions.contact.email.*` |
| Subjek email | Konsultasi gratis | `pages.solutions.contact.email.subject` |
| Kontak | 6280000000000 · ganti_akun_instagram · ganti-email@contoh.com | `lib/site.ts`, **GANTI** (placeholder) |

## 13. Pesan WhatsApp dan email

| No. | Dipicu dari | Teks v1 | Kunci | Status |
|---|---|---|---|---|
| 13.1 | Tombol "Konsultasi gratis" di header | Halo Kreatekno, saya lihat solusi "Order dari grup WhatsApp tercatat sendiri ke Google Sheets". Saya mau konsultasi solusi serupa untuk bisnis saya. | `pages.solutions.wa.detail` | baru (V1-12.4) |
| 13.2 | Tombol hero, kartu adegan 9, CTA | sama dengan 13.1 | `pages.solutions.wa.detail` | baru (V1-12.4) |

Template: `Halo Kreatekno, saya lihat solusi "{title}". Saya mau konsultasi solusi serupa untuk bisnis saya.` Di prototipe **semua** tombol di halaman detail (termasuk header) memakai pesan ini, karena tidak ada `data-msg` di tombol mana pun (LOGIKA 10). Kalau Header Wildan tetap memakai `wa.chat` (12.1) itu juga boleh: keputusan saat integrasi.

## 14. Bentuk data usulan (ringkas)

Detail bentuk dan aturan validasinya ada di LOGIKA bagian 13. Ringkasnya, per solusi:

| Field | Tempat | Isi Order Grup | Wajib? |
|---|---|---|---|
| `id.painsLead` | `items/<slug>.ts` | lead Masalahnya (8.1) | ya |
| `id.built.h`, `id.built.lead`, `id.built.points[]` | `items/<slug>.ts` | 8.2 | ya |
| `id.quote.text`, `id.quote.by` | `items/<slug>.ts` | 8.4 | tidak (hanya "Sudah berjalan") |
| `intro` | `cerita/<slug>.ts` | 4 | ya |
| `scenes[]` (`rail`, `eb`, `h`, `p`) | `cerita/<slug>.ts` | 5 | ya, 5 sampai 9 |
| `areas[]` | `cerita/<slug>.ts` | 6.4 | ya |
| `world` (id → teks) | `cerita/<slug>.ts` | 6.1 sampai 6.7 | ya |

## 15. Temuan aturan copy (bahan keputusan Heru, halaman tidak diubah)

| No | Temuan | Lokasi | Usulan |
|---|---|---|---|
| 15.1 | Kata "AI" tampil di kartu adegan 3 ("AI membaca") dan label `w-ai`. Aturan hanya melarang **nama** model AI, jadi kata "AI" saja boleh. Tetapi bagian lain halaman memakai kata "asisten" | 5, 6.3 | Tetap, atau ganti "Asisten membaca" supaya satu istilah. Keputusan Heru |
| 15.2 | "Gulir, sekitar 1 menit" adalah lama membaca, bukan janji waktu layanan | 4 | Tetap. Kalau ragu: "Gulir untuk mulai" |
| 15.3 | "Excel" disebut di label admin. Ini aplikasi yang dipakai klien **sebelum** solusi, bukan alat backend | 6.3 | Tetap |
| 15.4 | Solusi terkait di prototipe ditulis tangan (`rekap-penjualan`, `stok-menipis`). Rumus SOLUSI-V1-LOGIKA 13 (skor = 2 × tim sama + industri sama, seri: urutan katalog) memberi **`asisten-sop`** (skor 4, "Staf baru menemukan jawaban SOP sendiri") dan **`stok-menipis`** (skor 4). `rekap-penjualan` skornya 2 | 8.10 | Ikuti rumus di website. Keputusan Heru kalau mau urutan manual |
| 15.5 | Angka contoh berbeda di beberapa tempat: "Sekitar 120 order sehari" (adegan 1), "66 order hari ini" (label papan, siang hari), "Order masuk 118" (rekap malam), tile "120 order". Masuk akal sebagai cerita satu hari, tapi bisa membingungkan | 5, 6 | Tetap, atau samakan saat angka asli ada |
| 15.6 | Kutipan pemilik adalah kutipan contoh. Untuk "Sudah berjalan", kutipan asli harus disetujui klien | 8.4 | Label "kutipan contoh" wajib sampai ada izin |
| 15.7 | Footer prototipe memakai kata Inggris "Prototype" | 9 | Tidak dibawa ke website |
| 15.8 | aria-label breadcrumb memakai kata Inggris "Breadcrumb" | 3 | Usul: "Lokasi halaman" |
