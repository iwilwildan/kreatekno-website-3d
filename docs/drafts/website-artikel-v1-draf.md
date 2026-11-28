# Website: Artikel v1, SEO/AEO/GEO (draf untuk review)

Draf 28 Nov 2026, revisi 1.
- Mode: revisi (refrasa), perubahan sedang
- Sumber "sebelum": `site/messages/id.json` (`meta.articles`, `pages.articles`, `home.articles`) dan `site/content/articles/id/*.mdx` (5 artikel), working tree 28 Nov 2026 di atas commit `8f210a1`
- Pembaca: pemilik UMKM yang **belum sadar** punya masalah. Mereka datang dari pencarian umum dan menganggap pekerjaan admin harian itu wajar.
- Hanya copy Indonesia. Artikel Inggris tidak disentuh.
- Aturan yang sudah diputuskan di draf Solusi ikut berlaku: nama platform dan kata "chatbot" hanya di title tag dan meta description. Untuk artikel, keduanya ditaruh di field baru `seoTitle` dan `seoDescription`.

## Kebutuhan pencari

| Artikel | Kueri terdekat | Intensi |
|---|---|---|
| admin | "pekerjaan admin yang bisa digantikan AI" | Informasional, sering bercampur rasa takut kehilangan pekerjaan |
| service | "chatbot WhatsApp untuk balas chat pembeli", "kapan UMKM perlu chatbot" | Menimbang, perlu atau belum |
| team | "cara melatih karyawan memakai AI", "takut digantikan AI" | Informasional, cara memulai |
| promo | "ide konten promosi mingguan UMKM", "kalender konten dengan AI" | Informasional, butuh contoh |
| money | "cara mencatat penjualan harian UMKM", "untung rugi sederhana" | Informasional, butuh langkah |

**Pembanding (28 Nov 2026):** hasil pencarian diisi artikel media tentang "pekerjaan yang terancam AI", blog vendor software akuntansi, dan blog vendor chat. Hampir semuanya menjelaskan secara umum. Pembeda artikel Kreatekno: batas yang jelas ("AI tidak mengarang jawaban", "yang tetap dipegang staf"), alur per hari, dan contoh konkret (toko kue, "beli tepung 2 karung 340 ribu"). Pembeda ini dipertahankan.

## Audit singkat menurut dampak

1. **"Asisten AI" muncul di hampir setiap paragraf**, termasuk H1 artikel service dan slug URL-nya. Di teks diganti "AI". Slug tidak diubah di sini (lihat Keputusan).
2. **Titik koma di daftar berbutir** (admin, service, team, money). Panduan suara melarang titik koma. Butir diubah menjadi kalimat dengan titik.
3. **Title tag artikel sama dengan H1** (`meta.title | Kreatekno`) dan meta description sama dengan ringkasan yang tampil. Kueri dengan nama platform tidak bisa masuk tanpa field terpisah.
4. **H1 halaman Artikel hanya "Artikel".** Tidak menjelaskan topik halaman.
5. **Pembuka untuk pembaca yang belum sadar.** Sebagian artikel sudah mulai dari situasi sehari-hari (money, promo). Artikel admin dan service dibuka lebih langsung ke solusi, jadi pembukanya diubah supaya pembaca mengenali situasinya dulu.
6. **Keahlian staf di artikel team** tidak sama dengan brand ("teknik menjual, negosiasi, membaca data"). Diselaraskan menjadi berpikir strategis, berkomunikasi, dan memasarkan.
7. **Satu klaim kurang tepat di artikel promo:** "AI juga belajar ide seperti apa yang cocok". AI tidak belajar sendiri dari angka posting tanpa diatur. Kalimat diubah.

## Aturan gerbang yang dipakai

- "kamu/-mu", "AI" (bukan "asisten AI"), "staf". "Pekerjaan admin" tetap dipakai karena itu nama jenis pekerjaan, bukan sebutan untuk orang.
- Tanpa em dash, titik koma, nama platform di teks halaman.
- `keywords` di `meta` tidak tampil di halaman (hanya untuk pencarian pustakawan), jadi tidak diubah kecuali kata "asisten" yang memang masih dicari orang tetap boleh ada.
- Ringkasan (`summary`) maksimal 170 karakter sesuai skema.

---

# Bagian A. Halaman Artikel (`/artikel`)

## 1. Title tag dan meta description halaman Artikel

**Sebelum**
- Title: Artikel Otomasi Bisnis & AI untuk UMKM | Kreatekno
- Description: Panduan praktis otomasi admin, chatbot WhatsApp, dan AI untuk UMKM, ditulis dengan bahasa sederhana untuk pemilik usaha.

**Tahap 1**
Sudah memuat kueri utama dan menjelaskan isi. Panjang aman.

**Sesudah**
Tetap.

**Alasan**
"Chatbot WhatsApp" boleh di meta sebagai kueri asli.

## 2. Hero halaman Artikel

**Sebelum**
- Kicker: Bacaan untuk pemilik usaha
- H1: Artikel
- Lead: Panduan praktis tentang asisten AI, otomasi admin, konten, dan pelatihan staf. Ditulis dengan bahasa sederhana supaya mudah kamu coba di usahamu.

**Tahap 1**
H1 tidak menyebut topik. Lead memakai "asisten AI" dan belum menyebut topik keuangan, padahal ada artikelnya.

**Sesudah**
- Kicker: tetap
- H1 opsi A (utama): Artikel AI dan otomasi untuk pemilik usaha
- H1 opsi B: Bacaan praktis soal AI untuk usahamu
- Lead: Panduan praktis soal AI untuk pekerjaan admin, chat pembeli, konten, catatan keuangan, dan pelatihan staf. Ditulis dengan bahasa sederhana supaya mudah kamu coba di usahamu.

**Alasan**
H1 menjelaskan topik halaman. `pages.articles.title` mungkin juga dipakai di tempat lain (misalnya breadcrumb), jadi dicek saat dipasang [perlu dicek di tampilan]. Lead 22 menjadi 25 kata.

## 3. Label halaman dan detail artikel

**Sebelum**
- author: Ditulis oleh tim Kreatekno dari pengalaman memasang asisten AI dan otomasi untuk usaha kecil.
- Label lain: Artikel pilihan, Artikel lainnya, Baca artikel, {n} menit baca, Tim Kreatekno, Terbit, Kategori, Solusi terkait, Contoh otomasi yang berhubungan dengan artikel ini., Lihat solusi, Baca juga, Semua artikel
- CTA: Mau coba di usahamu? / Ceritakan pekerjaan yang paling menyita waktu stafmu. Kami bantu petakan solusinya, gratis.
- Perpustakaan: Tanya pustakawan, Andi bantu carikan bacaan, dan seterusnya

**Tahap 1**
Hanya kalimat penulis yang memakai "asisten AI". "Tim Kreatekno" merujuk ke orang Kreatekno, bukan staf klien, jadi boleh. Label perpustakaan sudah memakai "kamu".

**Sesudah**
- author: Ditulis oleh tim Kreatekno dari pengalaman memasang AI dan otomasi di usaha kecil.
- Label lain, CTA, dan perpustakaan: tetap.

**Alasan**
Kalimat penulis menjadi sinyal pengalaman (E-E-A-T) yang dibaca mesin pencari, jadi istilahnya harus konsisten.

## 4. Judul artikel di rak Home (`home.articles.*.title`)

**Sebelum**
Judul kelima artikel disalin juga di `home.articles` untuk rak majalah di Home.

**Tahap 1**
Kalau H1 artikel berubah, judul di rak Home harus ikut supaya sama.

**Sesudah**
- service: mengikuti H1 baru di bagian 6.2
- Empat lainnya: tetap, karena H1-nya tetap.

**Alasan**
Kategori rak (Admin, Melayani pembeli, Staf, Promosi, Keuangan) tetap. "Admin" di sini nama jenis pekerjaan.

---

# Bagian B. Artikel admin (`/artikel/pekerjaan-admin-yang-bisa-dikerjakan-ai`)

## 5.1 admin: title tag, H1, ringkasan

**Sebelum**
- H1 dan title: 5 pekerjaan admin yang bisa dikerjakan AI
- Ringkasan dan meta: Lima pekerjaan admin yang paling sering menyita waktu usaha kecil, cara asisten AI mengerjakannya, dan pekerjaan yang tetap dipegang staf.

**Tahap 1**
H1 sudah cocok dengan kueri "pekerjaan admin yang bisa digantikan AI". Ringkasan memakai "asisten AI".

**Sesudah**
- H1: tetap
- seoTitle opsi A (utama): 5 Pekerjaan Admin yang Bisa Dikerjakan AI di Usaha Kecil
- seoTitle opsi B: Pekerjaan Admin yang Bisa Digantikan AI, dan yang Tetap Dipegang Staf
- Ringkasan: Lima pekerjaan admin yang paling sering menyita waktu usaha kecil, cara AI mengerjakannya, dan pekerjaan yang tetap dipegang staf.

**Alasan**
Opsi A menambah "di usaha kecil" supaya hasil pencarian tidak terlihat seperti artikel karier. Opsi B memakai kata "digantikan" yang diketik pencari, tapi langsung menjawab kekhawatirannya. Title tag akhir ditambah " | Kreatekno" oleh kode.

## 5.2 admin: pembuka

**Sebelum**
Setiap hari ada pekerjaan yang datang lagi dan lagi. Pembeli menanyakan harga yang sama, pesanan dari chat disalin ke buku, tagihan dibuat satu per satu, lalu staf masih harus mengingatkan pelanggan yang belum membayar. Semua pekerjaan ini penting. Masalahnya, pekerjaan ini menghabiskan jam kerja staf yang sebenarnya bisa dipakai untuk melayani pelanggan dan mencari penjualan baru.

Asisten AI bisa mengambil alih sebagian besar pekerjaan berulang seperti ini. Berikut lima pekerjaan admin yang paling sering kami temui di usaha kecil, beserta cara asisten AI mengerjakannya.

**Tahap 1**
Pembaca belum sadar. Pembuka sebaiknya mengajak pembaca menghitung pekerjaannya sendiri, baru menyebut masalahnya.

**Sesudah**
Coba hitung berapa kali hari ini stafmu menjawab pertanyaan harga yang sama, menyalin pesanan dari chat ke buku, atau mengingatkan pelanggan yang belum membayar. Pekerjaan seperti ini terasa biasa karena datang setiap hari. Kalau dijumlah, jam kerja staf banyak habis di situ, padahal waktu itu bisa dipakai untuk melayani pelanggan dan mencari penjualan baru.

Sebagian besar pekerjaan berulang ini bisa pindah ke AI. Berikut lima pekerjaan admin yang paling sering kami temui di usaha kecil, cara AI mengerjakannya, dan batasnya.

**Alasan**
Teknik "setuju dulu, lalu jalan pintas": mengakui bahwa pekerjaan ini terasa wajar, lalu menunjukkan biayanya. Paragraf kedua menjadi jawaban singkat yang bisa dikutip. 79 menjadi 80 kata.

## 5.3 admin: lima pekerjaan (H2 1 sampai 5)

**Sebelum**
- H2 1 paragraf: Harga, jam buka, alamat, ongkos kirim, dan ketersediaan stok adalah pertanyaan yang masuk setiap hari. Asisten AI membaca daftar produk dan aturan usahamu, ... / Asisten yang baik tidak mengarang jawaban. Kalau sebuah pertanyaan tidak ada di data usahamu, asisten meneruskan percakapan itu ke staf, lengkap dengan isi chat sebelumnya. Staf tidak perlu bertanya ulang kepada pembeli.
- H2 2 paragraf: Di banyak usaha, pesanan yang masuk lewat chat ditulis ulang ke buku atau spreadsheet. ... / Asisten AI mengambil nama barang, ... Kalau ada data yang kurang, asisten menanyakannya kepada pembeli ...
- H2 4 paragraf: Mengingatkan pelanggan soal pembayaran sering terasa canggung, sehingga sering ditunda. Asisten AI mengirim pengingat yang sopan sesuai jadwal, misalnya satu hari sebelum jatuh tempo, ...
- H2 3 dan 5: tanpa istilah terlarang

**Tahap 1**
Struktur lima H2 sudah cocok dengan pertanyaan pencari. Hanya istilah dan beberapa kalimat dipadatkan.

**Sesudah**
- H2 1 paragraf 1: Harga, jam buka, alamat, ongkos kirim, dan stok ditanyakan setiap hari. AI membaca daftar produk dan aturan usahamu, lalu menjawab pertanyaan pembeli kapan saja, termasuk di luar jam kerja.
- H2 1 paragraf 2: AI yang baik tidak mengarang jawaban. Kalau pertanyaannya tidak ada di data usahamu, AI meneruskan percakapan itu ke staf beserta isi chat sebelumnya, jadi staf tidak perlu bertanya ulang kepada pembeli.
- H2 2 paragraf 1: Di banyak usaha, pesanan dari chat ditulis ulang ke buku atau tabel. Cara ini lambat dan mudah salah, misalnya jumlah barang tertukar atau alamat kirim tidak lengkap.
- H2 2 paragraf 2: AI mengambil nama barang, jumlah, alamat kirim, dan catatan pembeli dari percakapan, lalu menuliskannya ke tabel pesanan. Kalau ada data yang kurang, AI menanyakannya kepada pembeli sebelum pesanan dicatat. Staf cukup memeriksa tabel dan memproses pesanan.
- H2 4 paragraf 1: Menagih pelanggan sering terasa sungkan, jadi sering ditunda. AI mengirim pengingat yang sopan sesuai jadwal, misalnya sehari sebelum jatuh tempo, pada hari jatuh tempo, dan beberapa hari setelahnya.
- H2 3, H2 5, dan Callout "Mulai dari daftar pendek": tetap.

**Alasan**
"Spreadsheet" diganti "tabel" supaya konsisten dengan halaman Solusi. "Sungkan" adalah kata yang dipakai di halaman pengingat-tagihan.

## 5.4 admin: kutipan, yang tetap dipegang staf, cara memulai

**Sebelum**
- PullQuote: Pekerjaan admin tidak hilang. Pekerjaan itu pindah ke asisten AI, dan staf pindah ke pekerjaan yang mendatangkan omzet.
- Pembuka H2: Asisten AI cocok untuk pekerjaan yang aturannya jelas dan berulang. Ada pekerjaan yang tetap lebih baik dipegang manusia:
- Daftar: keputusan harga khusus, diskon, dan negosiasi dengan pelanggan besar; / keluhan pelanggan yang butuh empati dan penyelesaian; / pengecekan akhir sebelum barang dikirim; / ide promosi dan hubungan dengan pelanggan lama.
- Penutup H2: Justru di pekerjaan inilah staf paling berharga. Waktu yang sebelumnya habis untuk menyalin data bisa dipakai untuk menjual, bernegosiasi, dan merawat pelanggan.
- Cara memulai langkah 4: Uji asisten dengan percakapan dan pesanan nyata sebelum dipakai penuh.

**Tahap 1**
Daftar memakai titik koma. Kutipan perlu mengikuti posisi brand "yang pindah adalah tugas, bukan orang".

**Sesudah**
- PullQuote: Pekerjaan admin tidak hilang. Tugasnya pindah ke AI, dan staf punya waktu untuk pekerjaan yang mendatangkan omzet.
- Pembuka H2: AI cocok untuk pekerjaan yang aturannya jelas dan berulang. Pekerjaan berikut tetap lebih baik dipegang staf:
- Daftar:
  - Keputusan harga khusus, diskon, dan negosiasi dengan pelanggan besar.
  - Keluhan pelanggan yang butuh empati dan penyelesaian.
  - Pengecekan akhir sebelum barang dikirim.
  - Ide promosi dan hubungan dengan pelanggan lama.
- Penutup H2: Di pekerjaan inilah staf paling berharga. Waktu yang dulu habis untuk menyalin data bisa dipakai untuk menjual, bernegosiasi, dan merawat pelanggan.
- Cara memulai langkah 4: Uji AI dengan percakapan dan pesanan nyata sebelum dipakai penuh.
- Band "Hitung dulu waktunya", langkah lain, dan penutup: tetap.

**Alasan**
Bagian "Yang tetap dipegang staf" adalah jawaban untuk kekhawatiran di balik kueri "digantikan AI", jadi isinya dipertahankan utuh.

---

# Bagian C. Artikel service (`/artikel/asisten-ai-untuk-balas-chat-pembeli`)

## 6.1 service: title tag dan meta description

**Sebelum**
- Title: Asisten AI untuk balas chat pembeli: kapan perlu, kapan belum | Kreatekno
- Description: Tanda usahamu sudah butuh asisten AI untuk membalas chat pembeli, kapan sebaiknya ditunda dulu, dan apa saja yang perlu disiapkan.

**Tahap 1**
Kueri terdekat memakai "chatbot WhatsApp". Hasil pencarian diisi blog vendor chat yang hampir tidak membahas kapan sebaiknya ditunda. Sisi "kapan belum" adalah pembeda artikel ini.

**Sesudah**
- seoTitle opsi A (utama): Chatbot WhatsApp untuk Balas Chat Pembeli: Kapan Perlu, Kapan Belum
- seoTitle opsi B: Kapan Toko Perlu Chatbot WhatsApp untuk Membalas Pembeli?
- seoDescription: Tanda toko sudah perlu chatbot atau AI untuk membalas chat WhatsApp pembeli, kapan sebaiknya ditunda, dan data apa yang perlu disiapkan dulu.

**Alasan**
Kata "chatbot" dan "WhatsApp" hanya di metadata, sesuai keputusan di draf Solusi. Opsi A 66 karakter sebelum " | Kreatekno", berisiko dipotong. Opsi B lebih pendek.

## 6.2 service: H1, ringkasan, pembuka

**Sebelum**
- H1: Asisten AI untuk balas chat pembeli: kapan perlu, kapan belum
- Ringkasan: Tanda usahamu sudah butuh asisten AI untuk membalas chat pembeli, kapan sebaiknya ditunda dulu, dan apa saja yang perlu disiapkan.
- Pembuka: Chat pembeli adalah pintu masuk penjualan. Balasan yang cepat dan jelas membuat pembeli jadi memesan, sedangkan balasan yang lambat membuat pembeli bertanya ke toko lain. Karena itu banyak pemilik usaha mulai melirik asisten AI untuk membalas chat. / Asisten AI memang bisa sangat membantu. Tapi tidak setiap usaha membutuhkannya sekarang. Artikel ini membantu kamu menilai keadaan usahamu sendiri.

**Tahap 1**
H1 memakai "asisten". Pembuka untuk pembaca yang belum sadar perlu dimulai dari kebiasaan pembeli.

**Sesudah**
- H1 opsi A (utama): AI untuk balas chat pembeli: kapan perlu, kapan belum
- H1 opsi B: Kapan usahamu perlu AI untuk membalas chat pembeli?
- Ringkasan: Tanda usahamu sudah butuh AI untuk membalas chat pembeli, kapan sebaiknya ditunda dulu, dan apa saja yang perlu disiapkan.
- Pembuka paragraf 1: Pembeli yang bertanya lewat chat sering juga bertanya ke toko lain di saat yang sama. Toko yang membalas lebih dulu dengan jawaban yang jelas punya peluang lebih besar mendapat pesanannya. Karena itu banyak pemilik usaha mulai melirik AI untuk membalas chat.
- Pembuka paragraf 2: AI memang bisa sangat membantu, tapi tidak setiap usaha membutuhkannya sekarang. Artikel ini membantumu menilai keadaan usahamu sendiri.

**Alasan**
Pembuka dimulai dari perilaku pembeli yang dikenali pemilik toko. "Peluang lebih besar" dipakai alih-alih "membuat pembeli jadi memesan" supaya tidak terdengar sebagai janji. Slug URL masih memuat "asisten-ai" (lihat Keputusan).

## 6.3 service: tanda perlu dan kapan ditunda

**Sebelum**
- H2: Tanda kamu sudah perlu asisten AI
- Penutup daftar: Kalau dua atau lebih tanda di atas terasa akrab, manfaat asisten AI kemungkinan besar akan cepat terasa bagi stafmu.
- Butir "Setiap chat berbeda": ... Di sini asisten AI paling banyak membantu mencatat, bukan menjawab.
- Butir "Data usaha belum rapi": Asisten AI menjawab dari data usahamu. ...
- Callout: ... bahkan sebelum kamu memakai asisten AI.

**Tahap 1**
Kedua H2 sudah berbentuk pertanyaan pencari. Butir daftar sudah jelas.

**Sesudah**
- H2: Tanda usahamu sudah perlu AI untuk membalas chat
- Penutup daftar: Kalau dua atau lebih tanda di atas terasa akrab, stafmu kemungkinan besar cepat merasakan manfaatnya.
- Butir "Setiap chat berbeda": Setiap chat berbeda dan butuh negosiasi. Misalnya proyek pesanan khusus dengan harga yang selalu dihitung ulang. Di sini AI lebih banyak membantu mencatat, bukan menjawab.
- Butir "Data usaha belum rapi": Data usaha belum rapi. AI menjawab dari data usahamu. Kalau daftar harga dan aturan belum tertulis, rapikan data itu dulu.
- Callout: Daftar harga, aturan pengiriman, dan jawaban untuk pertanyaan umum yang tertulis rapi akan membantu staf baru, bahkan sebelum kamu memakai AI.
- H2 "Kapan sebaiknya ditunda dulu" dan butir lain: tetap.

**Alasan**
H2 pertama menyebut subjek ("usahamu") dan tugasnya ("membalas chat"), sehingga tetap jelas kalau dikutip terpisah.

## 6.4 service: ciri AI yang baik, persiapan, mengukur hasil

**Sebelum**
- H2: Seperti apa asisten AI yang baik
- Pembuka: Asisten AI yang baik bukan sekadar menjawab cepat. Ada tiga hal yang perlu kamu pastikan:
- PullQuote: Asisten AI yang baik tahu kapan harus menyerahkan percakapan kepada manusia.
- Mengukur hasil: Setelah asisten berjalan beberapa minggu, lihat angka-angka ini: berapa lama rata-rata pembeli menunggu balasan pertama; / berapa persen percakapan yang perlu diteruskan ke staf; / berapa chat yang berakhir menjadi pesanan; / pekerjaan apa yang sekarang sempat dikerjakan staf.
- Band: Sebelum asisten dipakai untuk semua pembeli, uji dengan contoh chat dari usahamu sendiri. ...
- Penutup: Kalau angkanya membaik dan staf punya waktu untuk pekerjaan lain, asistenmu sudah bekerja dengan benar. Kalau belum, biasanya masalahnya ada di data yang belum lengkap, bukan di asistennya.

**Tahap 1**
Istilah dan titik koma.

**Sesudah**
- H2: Ciri AI yang baik untuk membalas chat
- Pembuka: AI yang baik bukan sekadar menjawab cepat. Pastikan tiga hal ini:
- Daftar tiga hal: tetap
- PullQuote: AI yang bisa dipercaya tahu kapan harus menyerahkan percakapan kepada staf.
- Yang perlu disiapkan: tetap
- Mengukur hasil: Setelah AI berjalan beberapa minggu, lihat angka-angka ini:
  - Berapa lama rata-rata pembeli menunggu balasan pertama.
  - Berapa persen percakapan yang perlu diteruskan ke staf.
  - Berapa chat yang berakhir menjadi pesanan.
  - Pekerjaan apa yang sekarang sempat dikerjakan staf.
- Band: Sebelum AI dipakai untuk semua pembeli, uji dengan contoh chat dari usahamu sendiri. Dari situ terlihat pertanyaan mana yang sudah terjawab dengan baik dan mana yang perlu ditambah datanya.
- Penutup: Kalau angkanya membaik dan staf punya waktu untuk pekerjaan lain, AI itu sudah bekerja dengan benar. Kalau belum, biasanya masalahnya ada di data yang belum lengkap, bukan di AI-nya.

**Alasan**
"Kepada staf" lebih tepat daripada "kepada manusia" karena itu yang terjadi di alur Kreatekno.

---

# Bagian D. Artikel team (`/artikel/melatih-staf-bekerja-bareng-ai`)

## 7.1 team: title tag, H1, ringkasan

**Sebelum**
- H1 dan title: Cara melatih staf bekerja bareng AI
- Ringkasan: Langkah melatih staf supaya nyaman bekerja bersama asisten AI, dari menjawab rasa takut digantikan sampai memberi peran baru yang mendatangkan omzet.

**Tahap 1**
H1 sudah jelas. Kueri pencari memakai "karyawan" dan "takut digantikan".

**Sesudah**
- H1: tetap
- seoTitle opsi A (utama): Cara Melatih Karyawan Bekerja dengan AI Tanpa Takut Digantikan
- seoTitle opsi B: Cara Melatih Staf Bekerja Bareng AI di Usaha Kecil
- Ringkasan: Langkah melatih staf supaya nyaman bekerja bersama AI, dari menjawab rasa takut digantikan sampai memberi peran baru yang mendatangkan omzet.

**Alasan**
"Karyawan" boleh di sini karena konteksnya kekhawatiran kehilangan pekerjaan, dan itu kata yang diketik pencari.

## 7.2 team: pembuka dan langkah 1 sampai 3

**Sebelum**
- Pembuka: Memasang asisten AI hanya separuh pekerjaan. Separuh lainnya adalah staf: ... setelah pekerjaan admin berpindah ke AI. / Tanpa pelatihan, asisten AI sering berakhir tidak dipakai. ...
- PullQuote langkah 1: Staf yang tahu perannya bertambah penting akan membantu asisten AI berhasil, bukan menghalanginya.
- Langkah 3 pembuka: Asisten AI bisa salah, terutama di minggu-minggu pertama. ...
- Callout langkah 3: ... Catat kesalahannya, lengkapi datanya, dan asisten akan menjawab lebih baik di kesempatan berikutnya.

**Tahap 1**
Hanya istilah. Langkah 1 sudah menjawab rasa takut dengan jujur.

**Sesudah**
- Pembuka paragraf 1: Memasang AI baru separuh pekerjaan. Separuh lainnya ada di staf: apakah mereka mau memakainya, percaya pada hasilnya, dan tahu apa yang dikerjakan setelah tugas admin pindah ke AI.
- Pembuka paragraf 2: Tanpa pelatihan, AI sering berakhir tidak dipakai. Staf kembali mengerjakan semuanya secara manual karena merasa lebih aman. Berikut langkah yang kami pakai saat mendampingi usaha kecil.
- PullQuote: Staf yang tahu perannya bertambah penting akan membantu AI berhasil, bukan menghalanginya.
- Langkah 3 pembuka: AI bisa salah, terutama di minggu-minggu pertama. Staf perlu tahu cara memeriksa hasilnya dan apa yang harus dilakukan kalau ada yang keliru.
- Callout: Setiap jawaban yang salah biasanya berarti ada data yang kurang. Catat kesalahannya, lengkapi datanya, dan AI akan menjawab lebih baik di kesempatan berikutnya.
- Langkah 1 dan 2 lainnya: tetap.

**Alasan**
"Tugas admin pindah ke AI" mengikuti istilah brand "tugasnya pindah ke AI".

## 7.3 team: langkah 4 dan 5, ringkasan akhir

**Sebelum**
- Daftar peran baru: menghubungi pelanggan lama yang sudah lama tidak memesan; / menindaklanjuti pembeli yang bertanya tapi belum jadi memesan; / menyiapkan ide promosi dan konten mingguan; / mempelajari produk baru supaya bisa menawarkan paket yang lebih lengkap.
- Keahlian: Peran baru ini butuh keahlian baru juga, seperti teknik menjual, negosiasi, dan membaca data penjualan sederhana. Sediakan waktu khusus untuk melatihnya.
- Ukuran (bernomor): berapa jam per minggu ...; / berapa pelanggan lama ...; / berapa penjualan ...; / kesalahan apa ...
- Ringkasnya: ... Dengan cara ini asisten AI tidak menggantikan staf. Asisten AI membantu staf naik kelas.

**Tahap 1**
Titik koma di dua daftar. Keahlian staf perlu sama dengan posisi brand.

**Sesudah**
- Daftar peran baru:
  - Menghubungi pelanggan lama yang sudah lama tidak memesan.
  - Menindaklanjuti pembeli yang bertanya tapi belum jadi memesan.
  - Menyiapkan ide promosi dan konten mingguan.
  - Mempelajari produk baru supaya bisa menawarkan paket yang lebih lengkap.
- Keahlian: Peran baru ini butuh keahlian baru, misalnya berpikir strategis, berkomunikasi dengan pelanggan, dan memasarkan produk. Sediakan waktu khusus untuk melatihnya.
- Ukuran:
  1. Berapa jam per minggu yang tidak lagi habis untuk pekerjaan admin.
  2. Berapa pelanggan lama yang berhasil dihubungi kembali.
  3. Berapa penjualan yang datang dari tindak lanjut staf.
  4. Kesalahan apa yang masih sering terjadi dan bagaimana memperbaikinya.
- Ringkasnya: Melatih staf bekerja bareng AI berarti menjawab rasa takut, melibatkan mereka sejak awal, mengajari cara memeriksa hasil, memberi peran baru, dan mengukur kemajuan bersama. Dengan cara ini tugas rutin pindah ke AI, bukan orangnya, dan staf naik kelas.
- Band "Latihan kecil, tapi rutin" dan langkah 5 lainnya: tetap.

**Alasan**
Kalimat penutup memakai posisi brand secara langsung, dan cocok dikutip sebagai jawaban singkat untuk "apakah AI menggantikan karyawan".

---

# Bagian E. Artikel promo (`/artikel/ide-konten-promosi-dengan-ai`)

## 8.1 promo: title tag, H1, ringkasan

**Sebelum**
- H1 dan title: Ide konten promosi tiap minggu dengan bantuan AI
- Ringkasan: Alur mingguan sederhana untuk menyiapkan ide konten promosi dengan bantuan AI, dari mengumpulkan bahan sampai jadwal posting, tanpa kehilangan suara usahamu.

**Tahap 1**
Sudah sesuai aturan. Kueri pencari memakai "kalender konten" dan "UMKM".

**Sesudah**
- H1 dan ringkasan: tetap
- seoTitle opsi A (utama): Ide Konten Promosi Mingguan untuk UMKM dengan Bantuan AI
- seoTitle opsi B: Kalender Konten Mingguan dengan AI untuk Usaha Kecil

**Alasan**
"Mingguan" dan "UMKM" adalah kata yang dipakai di hasil pencarian pembanding.

## 8.2 promo: isi

**Sebelum**
- Paragraf setelah daftar bahan: Asisten AI bisa mengumpulkan bahan-bahan ini setiap minggu dari catatan chat, ulasan, dan rekap penjualan, lalu merangkumnya dalam satu daftar.
- Daftar "Menjaga suara usahamu": tuliskan contoh sapaan ...; / buat daftar kata ...; / tentukan hal yang tidak boleh ditulis, ...; / minta staf yang paling dekat ...
- Penutup: ... Jadikan konten itu contoh untuk minggu-minggu berikutnya. Dengan begitu, AI juga belajar ide seperti apa yang cocok untuk pembelimu.

**Tahap 1**
Istilah, titik koma, dan satu klaim yang terlalu jauh.

**Sesudah**
- Paragraf setelah daftar bahan: AI bisa mengumpulkan bahan-bahan ini setiap minggu dari catatan chat, ulasan, dan rekap penjualan, lalu merangkumnya dalam satu daftar.
- Daftar "Menjaga suara usahamu":
  - Tuliskan contoh sapaan dan gaya bahasa yang biasa dipakai di usahamu.
  - Buat daftar kata atau istilah yang sering dipakai pelanggan.
  - Tentukan hal yang tidak boleh ditulis, misalnya janji yang tidak bisa ditepati.
  - Minta staf yang paling dekat dengan pelanggan membaca draf sebelum diposting.
- Penutup: Setelah sebulan, lihat konten mana yang paling banyak disimpan, dibagikan, atau membuat pembeli bertanya lewat chat. Jadikan konten itu contoh untuk minggu-minggu berikutnya, dan berikan contoh itu ke AI saat meminta ide baru.
- Pembuka, alur mingguan, Callout, contoh rencana toko kue, dan Band: tetap.

**Alasan**
AI tidak belajar sendiri dari performa posting kecuali diberi contohnya. Kalimat baru memberi langkah yang bisa dikerjakan pembaca.

---

# Bagian F. Artikel money (`/artikel/catat-penjualan-harian-otomatis`)

## 9.1 money: title tag, H1, ringkasan

**Sebelum**
- H1 dan title: Catat penjualan harian otomatis supaya untung rugi terlihat
- Ringkasan: Cara mencatat penjualan dan biaya harian secara otomatis, lalu membaca untung rugi sederhana setiap minggu tanpa menunggu akhir bulan.

**Tahap 1**
Sudah sesuai aturan. Kueri pencari: "cara mencatat penjualan harian UMKM".

**Sesudah**
- H1 dan ringkasan: tetap
- seoTitle opsi A (utama): Cara Mencatat Penjualan Harian Otomatis dan Menghitung Untung Rugi UMKM
- seoTitle opsi B: Catat Penjualan Harian UMKM Otomatis, Untung Rugi Terlihat Tiap Minggu

**Alasan**
Opsi A memuat dua kueri, tapi panjang. Opsi B lebih pendek dan menyebut pembeda "tiap minggu".

## 9.2 money: isi

**Sebelum**
- Daftar "Kenapa catatan harian penting": melihat hari dan jam paling ramai, lalu mengatur jadwal staf; / mengetahui produk ...; / menemukan selisih kas ...; / membaca untung rugi setiap minggu, bukan hanya setiap bulan.
- Alur langkah 1: **Pesanan dari chat** dicatat oleh asisten AI ke tabel penjualan saat pembeli mengonfirmasi pesanan.
- Untung rugi: **Penjualan** selama seminggu; / dikurangi **modal barang** yang terjual; / dikurangi **biaya operasional**, seperti gaji, sewa, listrik, dan ongkos kirim; / hasilnya adalah **perkiraan laba** minggu itu.

**Tahap 1**
Titik koma di dua daftar dan satu istilah.

**Sesudah**
- Daftar "Kenapa catatan harian penting":
  - Melihat hari dan jam paling ramai, lalu mengatur jadwal staf.
  - Mengetahui produk yang mulai jarang dibeli sebelum stoknya menumpuk.
  - Menemukan selisih kas lebih cepat, saat kejadiannya masih mudah diingat.
  - Membaca untung rugi setiap minggu, bukan hanya setiap bulan.
- Alur langkah 1: **Pesanan dari chat** dicatat AI ke tabel penjualan saat pembeli mengonfirmasi pesanan.
- Untung rugi (daftar bernomor):
  1. Jumlahkan **penjualan** selama seminggu.
  2. Kurangi dengan **modal barang** yang terjual.
  3. Kurangi lagi dengan **biaya operasional**, seperti gaji, sewa, listrik, dan ongkos kirim.
  4. Hasilnya adalah **perkiraan laba** minggu itu.
- Pembuka, daftar catatan, Callout, PullQuote, Band, kesalahan, dan penutup: tetap.

**Alasan**
Perhitungan untung rugi menjadi langkah bernomor, bentuk yang mudah dikutip mesin jawaban untuk "cara menghitung untung rugi sederhana". Rumusnya sama dengan pembanding (penjualan dikurangi harga pokok dan biaya operasional).

---

## Catatan teknis (di luar teks siap tempel)

- **Field baru `seoTitle` dan `seoDescription`** di `articleMeta` (`content/articles/schema.ts`), opsional, dipakai di `generateMetadata` halaman artikel dengan cadangan ke `title` dan `summary`. `articleMetadata` sudah menambah " | Kreatekno", jadi `seoTitle` ditulis tanpa akhiran itu. JSON-LD `headline` tetap memakai H1.
- **`home.articles.service.title`** harus ikut H1 baru artikel service.
- **`pages.articles.title`** dicek pemakaiannya sebelum diganti, karena bisa juga tampil sebagai label pendek.
- **Slug `asisten-ai-untuk-balas-chat-pembeli`** memuat "asisten". Mengganti URL aktif perlu redirect dan bukan pekerjaan copy.
- **Tanggal `updated`** artikel sebaiknya diganti ke tanggal pemasangan, karena isinya berubah (panduan Google untuk pembaruan substantif).
- **`keywords`** tidak tampil di halaman dan tidak diubah.

## Ringkasan perubahan

| Bagian | Status |
|---|---|
| 1 Metadata halaman Artikel | Tetap |
| 2 Hero halaman Artikel | H1 dan lead baru |
| 3 Label | Kalimat penulis |
| 4 Rak Home | Ikut H1 service |
| 5 admin | seoTitle, pembuka, istilah, daftar tanpa titik koma |
| 6 service | seoTitle/seoDescription, H1 baru, pembuka, istilah, daftar |
| 7 team | seoTitle, istilah, keahlian staf, daftar, penutup |
| 8 promo | seoTitle, istilah, daftar, penutup |
| 9 money | seoTitle, istilah, daftar, untung rugi bernomor |

## Rencana ukur

- Catat tanggal pemasangan. Bandingkan 28 hari sebelum dan sesudah di GSC untuk kelima URL artikel dan `/artikel`: tayangan, klik, CTR, posisi, per kelompok kueri ("pekerjaan admin AI", "chatbot balas chat", "melatih karyawan AI", "ide konten promosi", "catat penjualan harian").
- Observasi manual GEO: tanyakan "pekerjaan admin apa yang bisa dikerjakan AI di usaha kecil" dan "cara menghitung untung rugi usaha kecil tiap minggu" di dua mesin AI, catat tanggal dan apakah URL Kreatekno muncul.

## Yang perlu diputuskan

1. H1 halaman Artikel: opsi A "Artikel AI dan otomasi untuk pemilik usaha" atau opsi B "Bacaan praktis soal AI untuk usahamu"?
2. H1 artikel service: opsi A "AI untuk balas chat pembeli: kapan perlu, kapan belum" atau opsi B "Kapan usahamu perlu AI untuk membalas chat pembeli?"
3. seoTitle tiap artikel: pakai semua opsi A?
4. Tanggal `updated` kelima artikel diganti ke tanggal pemasangan?
5. Setelah disetujui, saya pasang ke `content/articles/id/*.mdx`, `messages/id.json`, dan skema artikel, lalu cek tampilan dan tes?
