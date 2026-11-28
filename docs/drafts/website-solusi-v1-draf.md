# Website: Solusi v1, SEO/AEO/GEO (draf pilot untuk review)

Draf 28 Nov 2026, revisi 1.
- Mode: revisi (refrasa), perubahan sedang
- Sumber "sebelum": `site/messages/id.json`, `site/content/solusi/items/*.ts`, `site/content/solusi/cerita/*.ts`, `site/content/solusi/kartu.ts`, `site/content/solusi/detail-copy.ts`, commit `8f210a1` (28 Nov 2026)
- Cakupan pilot: metadata dan etalase Solusi, label bersama halaman detail, 24 kartu masalah, lalu dua solusi penuh (Baca + Tonton): `order-grup` (status Sudah berjalan) dan `cs-klinik` (status Siap dibuat). 15 solusi lain menyusul memakai pola yang disetujui di sini.
- Hanya copy Indonesia. Copy Inggris (`en`) tidak disentuh.
- Masukan yang sudah diterapkan (28 Nov 2026): nama platform hanya di title tag dan meta description. H1 etalase memakai opsi A. Bagian "Aplikasi yang dipakai" dan filter "Aplikasi" menjadi pengecualian aturan nama platform. Kutipan contoh boleh disunting mengikuti istilah brand, testimoni resmi tetap persis. Dua usulan FAQ baru dibuang. Pola pilot dipakai untuk 15 solusi lain di `website-solusi-v1-detail-draf.md`.
- Data GSC belum diberikan. Semua keputusan di bawah berdasarkan isi halaman dan pengecekan hasil pencarian 28 Nov 2026, jadi statusnya hipotesis.

## Kebutuhan pencari

- **Pembaca:** pemilik UMKM. Sebagian sadar masalah ("order dari grup chat sering terlewat"), sebagian belum sadar (menganggap mengetik ulang itu wajar), sebagian siap memakai dan hanya perlu yakin.
- **Intensi utama etalase:** "contoh otomasi AI untuk usaha", "otomasi WhatsApp untuk UMKM". Pembaca ingin melihat pekerjaan apa saja yang bisa dipindah ke AI.
- **Intensi utama halaman detail:** satu masalah spesifik, misalnya "catat order WhatsApp ke Google Sheets otomatis" atau "chatbot WhatsApp klinik di luar jam kerja". Pembaca ingin tahu cara kerjanya, syaratnya, dan batasnya.
- **Pembanding di hasil pencarian (28 Nov 2026):** kueri order dan booking dipenuhi template alat otomasi dan halaman vendor chat dalam bahasa Inggris. Kueri klinik dan tagihan diisi artikel vendor Indonesia yang umum. Hampir tidak ada halaman yang menjelaskan satu alur nyata dari awal sampai akhir, lengkap dengan batas (misalnya "AI tidak menebak, pesan yang kurang jelas ditanyakan dulu"). Itu celah yang bisa diisi halaman detail Kreatekno.

## Audit singkat menurut dampak

1. **H1 detail menyebut nama platform** ("...grup WhatsApp tercatat sendiri ke Google Sheets"). Panduan suara melarang nama platform di teks yang terlihat. Kueri asli dipindah ke title tag dan meta description, yang diizinkan modul SEO.
2. **Title tag detail dibentuk otomatis dari H1** (`${title} | Kreatekno Solusi`) dan meta description diambil dari `answer` (lebih dari 250 karakter, akan dipotong Google). Perlu field metadata sendiri. Lihat "Catatan teknis".
3. **Istilah lama di seluruh halaman:** "Anda", "asisten", "admin" dan "tim" untuk orang di usaha klien. Diganti "kamu/-mu", "AI", "staf", atau peran spesifik (sales, kurir).
4. **H1 etalase tidak menyebut topik.** "Masalah berulang punya jalan keluar." tidak menjelaskan bahwa halaman berisi contoh AI untuk usaha.
5. **Jawaban di bagian atas detail sudah baik untuk AEO.** Pola pertanyaan + jawaban langsung di bawah H1 dipertahankan. Jawaban dirapikan supaya tetap akurat kalau dikutip tersendiri, termasuk batas dan status rancangan.
6. **Angka contoh tampil seperti fakta di teks.** Misalnya "sekitar 120 order" di `painsLead`. Tirai halaman sudah menyebut angka sebagai contoh, tapi kutipan AI bisa mengambil kalimatnya tanpa konteks. Diberi tanda [perlu konfirmasi].

## Aturan gerbang yang dipakai

- "kamu/-mu" untuk pembaca, "kami" untuk Kreatekno.
- "AI" menggantikan "asisten". "Staf" menggantikan "admin" dan "tim" untuk orang di usaha klien. "Karyawan" hanya di konteks cuti dan merekrut.
- Nama platform (WhatsApp, Google Sheets, Excel, Telegram, Instagram) hanya di title tag dan meta description. Di teks halaman diganti "grup chat", "nomor chat", "tabel".
- Kalimat pertanyaan yang ditulis dari sudut pandang pengunjung ("usaha saya") boleh tetap, karena itu suara pencari.
- Tanpa em dash, titik koma, janji waktu di headline.
- CTA utama tetap "Konsultasi gratis".

---

# Bagian A. Etalase Solusi (`/solusi`)

## 1. Title tag etalase

**Sebelum**
Solusi Otomasi AI & WhatsApp untuk UMKM | Kreatekno

**Tahap 1**
Judul sudah memuat kueri utama ("otomasi", "AI", "WhatsApp", "UMKM"). Yang kurang: tanda bahwa halaman berisi contoh nyata per masalah, yang membedakannya dari halaman vendor.

**Sesudah**
- Opsi A (utama): Contoh Otomasi AI & WhatsApp untuk UMKM | Kreatekno
- Opsi B: Solusi Otomasi AI & WhatsApp untuk UMKM, Lengkap Cara Kerjanya | Kreatekno

**Alasan**
"Contoh" cocok dengan kueri informasional seperti "contoh otomasi AI untuk UMKM" yang hasilnya diisi artikel daftar. Opsi A 51 karakter, aman dari pemotongan. Opsi B lebih panjang (77 karakter) dan berisiko dipotong.

## 2. Meta description etalase

**Sebelum**
Kumpulan solusi asisten AI dan otomasi WhatsApp untuk UMKM. Cari masalah yang mirip dengan usaha Anda, lalu lihat cara kerja tiap solusi.

**Tahap 1**
Menyebut "asisten AI" (boleh di meta karena kueri), tapi tidak menyebut contoh pekerjaan apa pun. Pencari tidak tahu apakah masalahnya ada di sini.

**Sesudah**
- Opsi A (utama): 17 contoh otomasi AI untuk UMKM: catat order dari grup WhatsApp, booking jadwal, pengingat tagihan, rekap penjualan, dan lainnya. Cari dari masalah usahamu.
- Opsi B: Lihat cara AI mengerjakan tugas rutin usaha: mencatat order WhatsApp, menjawab chat pelanggan, mengingatkan tagihan, sampai merekap penjualan. Gratis konsultasi.

**Alasan**
Menyebut empat pekerjaan konkret yang juga menjadi kueri. Angka 17 diambil dari `SOLUSI` di `content/solusi/index.ts` dan harus ikut diubah kalau jumlah solusi berubah. Opsi A 157 karakter.

## 3. Hero etalase

**Sebelum**
- Kicker: Etalase solusi
- H1: Masalah berulang punya jalan keluar.
- Lead: Lihat contoh otomasi yang sudah berjalan dan ide yang siap dibuat untuk usaha Anda.
- Tombol: Cari dari masalah Anda · Cocokkan lewat kartu

**Tahap 1**
H1 harus menyebut topik halaman. Lead sudah menjelaskan dua status solusi, tapi masih "Anda".

**Sesudah**
- Kicker: Etalase solusi (tetap)
- H1 opsi A (utama, dipilih): Contoh AI untuk pekerjaan rutin usahamu
- H1 opsi B: Pekerjaan berulang di usahamu, dikerjakan AI
- Lead: Lihat AI yang sudah berjalan di usaha klien dan ide yang siap kami buat untuk usahamu. Cari dari masalahnya, atau cocokkan lewat kartu.
- Tombol: Cari dari masalahmu · Cocokkan lewat kartu

**Alasan**
H1 menjelaskan apa yang didapat pengunjung (contoh) dan topiknya (AI untuk pekerjaan rutin). Kalimat kedua lead mengarahkan ke dua tombol di bawahnya. Lead naik dari 14 ke 24 kata [perlu dicek di tampilan]. Kalau terlalu panjang, kalimat kedua bisa dibuang.

## 4. Rak katalog

**Sebelum**
- H2: Pilih solusi sesuai kebutuhan bisnis Anda
- Label: Lihat detail · Halaman detail menyusul · Sudah berjalan · Siap dibuat · Cocok untuk · Semua bidang usaha · Aplikasi: {list}

**Tahap 1**
Hanya istilah. Label status sudah jelas.

**Sesudah**
- H2: Pilih solusi sesuai kebutuhan usahamu
- Label lain tetap. "Aplikasi: {list}" tetap sebagai pengecualian aturan nama platform.

**Alasan**
"Usaha" konsisten dengan copy Home. Panjang sama.

## 5. Band "Belum tahu mulai dari mana?"

**Sebelum**
- H2: Belum tahu mulai dari mana?
- Isi: Ceritakan masalahnya lewat pencarian, atau jawab sembilan kartu singkat.
- Tombol: Mulai Cari · Mulai Kartu

**Tahap 1**
Sudah jelas dan sesuai suara.

**Sesudah**
Tetap.

**Alasan**
Tidak ada istilah terlarang. Satu pesan per section.

## 6. Mode Cari

**Sebelum**
- H2: Ceritakan pekerjaan yang bikin repot
- Field: Masalah atau pekerjaan · Bidang usaha · Tim · Aplikasi · Status
- Kosong: Belum dapat solusi yang pas. / Coba kurangi filter, ganti kata, atau ceritakan langsung kepada kami.

**Tahap 1**
Filter "Tim" memakai "tim" untuk orang di usaha klien. Isinya bagian kerja (Marketing, Penjualan, CS, dan seterusnya).

**Sesudah**
- Field "Tim" menjadi: Bagian
- Label rak `catalog.previous/next` ikut: Geser rak {team} ke kiri (tidak berubah, {team} berisi nama bagian)
- Lainnya tetap.

**Alasan**
"Bagian" adalah padanan umum untuk divisi di usaha kecil. Label "Tim" juga tampil di chip halaman detail (`detail-copy.ts`, `team`), jadi ikut diganti.

## 7. Mode Kartu dan hasilnya

**Sebelum**
- Intro: Pilih bidang usaha, lalu jawab tiga ronde. Tidak ada jawaban salah.
- Label: Bidang usaha Anda
- Hasil H2: Urutan solusi untuk Anda
- Hasil isi: Urutan ini berdasarkan masalah yang Anda tandai, bukan persentase keberhasilan.
- Kosong: Mulai lagi dan jawab kartu yang paling dekat dengan keadaan usaha Anda.
- Label: Masalah yang Anda tandai
- Meta hasil: Urutan solusi yang paling dekat dengan masalah yang Anda pilih di kartu masalah Kreatekno.

**Tahap 1**
Hanya istilah.

**Sesudah**
- Label: Bidang usahamu
- Hasil H2: Urutan solusi untukmu
- Hasil isi: Urutan ini berdasarkan masalah yang kamu tandai, bukan persentase keberhasilan.
- Kosong: Mulai lagi dan jawab kartu yang paling dekat dengan keadaan usahamu.
- Label: Masalah yang kamu tandai
- Meta hasil: Urutan solusi yang paling dekat dengan masalah yang kamu pilih di kartu masalah Kreatekno.

**Alasan**
Mengikuti sapaan "kamu". Panjang sama.

## 8. Kontak

**Sebelum**
- H2: Lanjutkan obrolan
- Isi: Pilih kanal yang paling nyaman. Konsultasi awal gratis.

**Tahap 1**
Sudah jelas.

**Sesudah**
Tetap.

**Alasan**
Menyebut gratis dekat tombol, tanpa istilah terlarang.

## 9. Teks 24 kartu masalah (`kartu.ts`)

**Sebelum**
Lihat kolom Sebelum di tabel.

**Tahap 1**
Teks kartu yang dijawab "Ya" disalin ke pesan WhatsApp pengunjung (`cardsMessage` di `lib/solusi/pesan.ts`) dalam suara pengunjung: "Masalah di usaha saya: - ...". Karena itu kartu sebaiknya tidak memakai kata ganti orang sama sekali, bukan "Anda" dan bukan "kamu". Hanya kartu dengan istilah terlarang, nama platform, atau kata ganti yang diubah.

**Sesudah**

| Kartu | Sebelum | Sesudah |
|---|---|---|
| k2 | Admin mengetik ulang pesanan ke Excel setiap hari? | Staf mengetik ulang pesanan ke tabel setiap hari? |
| k3 | Angka penjualan baru Anda ketahui keesokan harinya? | Angka penjualan baru ketahuan keesokan harinya? |
| k7 | Jadwal tim lapangan sering bentrok? | Jadwal petugas lapangan sering bentrok? |
| k24 | Anda sendiri masih ikut membalas chat setiap hari? | Pemilik usaha masih ikut membalas chat setiap hari? |

20 kartu lain tetap (k1, k4 sampai k6, k8 sampai k23).

**Alasan**
Kartu k24 dalam pesan WhatsApp sebelumnya berbunyi "- Anda sendiri masih ikut membalas chat setiap hari", yang janggal dari mulut pengunjung. Versi baru terbaca wajar di kartu dan di pesan. Jumlah kata tiap kartu sama atau berkurang, jadi aman untuk kartu 3D.

---

# Bagian B. Label bersama halaman detail (`detail-copy.ts`)

## 10. Label section detail

**Sebelum**
- painsTitle: Kenapa pekerjaan ini menyita waktu tim?
- after (kolom tabel): Dengan asisten
- team (chip): Tim
- appsTitle: Tetap di aplikasi yang tim Anda pakai
- ctaTitle: Mau solusi seperti ini untuk usaha Anda?
- ctaBody: Ceritakan alur kerja Anda. Kami bantu petakan solusinya, gratis.
- Label lain (Ringkasan, Hasil utama, Cocok untuk, Yang sering ditanyakan, dan seterusnya)

**Tahap 1**
H2 di halaman detail ikut menjadi kerangka jawaban yang dibaca mesin pencari. Yang berbentuk pertanyaan pencari ("Apakah solusi ini cocok untuk usaha saya?", "Apa yang perlu saya siapkan?") dipertahankan karena itu kalimat yang memang diketik orang.

**Sesudah**
- painsTitle: Kenapa pekerjaan ini menyita waktu stafmu?
- after: Dengan AI
- team: Bagian
- appsTitle: Tetap di aplikasi yang sudah dipakai stafmu
- ctaTitle opsi A (utama): Mau AI seperti ini untuk usahamu?
- ctaTitle opsi B: Mau pekerjaan ini pindah ke AI di usahamu?
- ctaBody: Ceritakan cara kerja usahamu sekarang. Kami bantu petakan AI yang cocok, gratis.
- Label lain tetap.

**Alasan**
"Dengan AI" lebih pendek dari "Dengan asisten", aman untuk kolom tabel. CTA tetap mengarah ke tombol Konsultasi gratis yang sama. Opsi B memakai posisi brand "tugasnya pindah ke AI".

---

# Bagian C. Detail `order-grup` (Sudah berjalan)

## 11. Title tag dan meta description

**Sebelum**
- Title: Order dari grup WhatsApp tercatat sendiri ke Google Sheets | Kreatekno Solusi
- Description (dari `answer`, 263 karakter): Asisten order dipasang di grup WhatsApp yang sudah dipakai tim. Setiap order yang ditulis sales dicatat ke Google Sheets, ...

**Tahap 1**
Kueri yang paling dekat: "catat order WhatsApp ke Google Sheets otomatis". Hasil pencarian diisi template alat otomasi berbahasa Inggris. Pembeda halaman ini: grup tetap sama, tanpa format khusus, data yang kurang ditanyakan, rekap malam.

**Sesudah**
- Title opsi A (utama): Catat Order Grup WhatsApp ke Google Sheets Otomatis | Kreatekno
- Title opsi B: Order Grup WhatsApp Tercatat Otomatis, Tanpa Format Khusus | Kreatekno
- Description: Order sales di grup WhatsApp tercatat otomatis ke Google Sheets, tanpa format khusus. Data yang kurang ditanyakan dulu, dan pemilik menerima rekap tiap malam.

**Alasan**
Nama platform dipakai karena kueri asli dan isi halaman memang menjawabnya (pengecualian title tag dan meta di modul SEO). Opsi A 63 karakter. Description 158 karakter, tidak lagi terpotong.

## 12. Hero: H1, pertanyaan, dan jawaban

**Sebelum**
- H1: Order dari grup WhatsApp tercatat sendiri ke Google Sheets
- Pertanyaan: Bagaimana order dari grup WhatsApp bisa tercatat otomatis?
- Jawaban: Asisten order dipasang di grup WhatsApp yang sudah dipakai tim. Setiap order yang ditulis sales dicatat ke Google Sheets, tim diberi kabar di grup, dan pemilik menerima rekap setiap malam. Tim tidak perlu mengubah cara mereka mengirim order.

**Tahap 1**
H1 menyebut dua nama platform. Jawaban sudah menjawab di kalimat pertama, tapi memakai "asisten" dan "tim", dan "tim diberi kabar" kurang jelas (kabar apa).

**Sesudah**
- H1 opsi A (utama): Order di grup chat sales tercatat sendiri, tanpa diketik ulang
- H1 opsi B: Order dari grup chat tercatat otomatis ke tabel
- Pertanyaan: Bagaimana order dari grup chat bisa tercatat otomatis?
- Jawaban: AI kami pasang di grup chat yang sudah dipakai sales dan kurir. Setiap order yang ditulis sales dicatat ke tabel order, sales mendapat nomor order di grup, dan pemilik menerima rekap setiap malam. Sales tetap menulis order seperti biasa, tanpa format khusus.

**Alasan**
H1 opsi A menyebut hasil yang dicari ("tanpa diketik ulang") dan cocok dengan `result`. Jawaban tetap akurat kalau dikutip tersendiri: siapa yang menulis, ke mana tercatat, apa yang diterima sales dan pemilik. Jumlah kata jawaban 45 menjadi 46.

## 13. Ringkasan kartu dan hasil utama

**Sebelum**
- Result: Order tercatat tanpa diketik ulang
- Summary: Order yang ditulis sales di grup WhatsApp otomatis tercatat ke Google Sheets, dan pemilik menerima rekap setiap malam.
- Klien: Distributor air minum, Pekanbaru

**Tahap 1**
Summary tampil di kartu katalog. Batas skema 20 kata.

**Sesudah**
- Result: tetap
- Summary: Order yang ditulis sales di grup chat tercatat otomatis ke tabel, dan pemilik menerima rekap setiap malam. (18 kata)
- Klien: tetap

**Alasan**
Hanya nama platform yang diganti. Panjang turun dari 19 ke 18 kata.

## 14. Masalahnya

**Sebelum**
- Pembuka: Setiap hari sekitar 120 order masuk lewat grup chat tim. Sales menulis order dengan gaya masing-masing. Ada yang lengkap, ada yang hanya menulis nama toko dan jumlah.
- Poin: Satu admin membaca seluruh grup lalu mengetik ulang setiap order ke tabel. · Revisi order tertimbun obrolan, sehingga ada order yang terlewat. · Pemilik baru tahu angka penjualan keesokan paginya.

**Tahap 1**
"120 order" tampil sebagai fakta, padahal angka di halaman ini masih contoh.

**Sesudah**
- Pembuka: Setiap hari sekitar 120 order masuk lewat grup chat sales [perlu konfirmasi: angka asli atau tetap contoh]. Sales menulis order dengan gaya masing-masing. Ada yang lengkap, ada yang hanya menulis nama toko dan jumlah.
- Poin 1: Satu staf membaca seluruh grup lalu mengetik ulang setiap order ke tabel.
- Poin 2 dan 3: tetap.

**Alasan**
Istilah "admin" diganti tanpa mengubah fakta. Angka ditandai karena GEO bisa mengutip kalimat ini lepas dari tirai "angka contoh".

## 15. Yang kami bangun

**Sebelum**
- H3: Grup tetap sama, pencatatannya otomatis
- Pembuka: Tim tidak perlu belajar aplikasi baru. Mereka tetap mengirim order ke grup yang sama. Di belakang grup itu, asisten membaca setiap pesan, mengenali pesan yang berisi order, lalu mencatatnya ke tabel order.
- Poin: 4 poin (membaca bahasa sehari-hari, memberi nomor order, menanyakan balik, mengubah status dan rekap)

**Tahap 1**
Hanya istilah. Keempat poin sudah spesifik dan bisa dikutip.

**Sesudah**
- H3: tetap
- Pembuka: Sales dan kurir tidak perlu belajar aplikasi baru. Mereka tetap mengirim order ke grup yang sama. Di belakang grup itu, AI membaca setiap pesan, mengenali pesan yang berisi order, lalu mencatatnya ke tabel order.
- Poin: tetap.

**Alasan**
Menyebut peran yang memakai grup, bukan "tim".

## 16. Kutipan

**Sebelum**
"Dulu saya baru tahu penjualan besok paginya. Sekarang setiap malam rekapnya sudah ada di HP saya." Pemilik distributor air minum, Pekanbaru

**Tahap 1**
Kutipan contoh. Tidak ada istilah terlarang.

**Sesudah**
Tetap.

**Alasan**
Kutipan tidak diubah.

## 17. Langkah kerja

**Sebelum**
1. Tim mengirim order seperti biasa: Sales tetap menulis di grup WhatsApp yang sama, tanpa format khusus.
2. Asisten mencatat ordernya: Order tersusun rapi di Google Sheets. Kalau ada yang kurang jelas, tim ditanya dulu.
3. Status selalu terbaru: Kurir cukup membalas di grup, dan status di tabel ikut berubah.
4. Pemilik menerima rekap: Setiap malam, ringkasan order hari itu dikirim ke pemilik.

**Tahap 1**
Langkah 1 dan 2 memuat istilah terlarang dan nama platform.

**Sesudah**
1. Sales mengirim order seperti biasa: Sales tetap menulis di grup chat yang sama, tanpa format khusus.
2. AI mencatat ordernya: Order tersusun rapi di tabel. Kalau ada yang kurang jelas, sales ditanya dulu.
3. Tetap.
4. Tetap.

**Alasan**
Copy modular dengan subjek di depan (Sales, AI, Status, Pemilik) memperlihatkan siapa mengerjakan apa.

## 18. Sebelum dan sesudah (tabel)

**Sebelum**
- Mencatat order: Admin mengetik ulang dari chat → Tercatat dari chat yang sama
- Tahu status pengiriman: Bertanya ke admin atau kurir → Terlihat di tabel
- Angka harian: Dihitung keesokan pagi → Dikirim malam itu juga

**Tahap 1**
Hanya istilah.

**Sesudah**
- Mencatat order: Staf mengetik ulang dari chat → Tercatat dari chat yang sama
- Tahu status pengiriman: Bertanya ke staf atau kurir → Terlihat di tabel
- Angka harian: tetap

**Alasan**
Panjang sel sama.

## 19. Cocok, kurang cocok, persiapan

**Sebelum**
- Cocok: Usaha yang menerima puluhan order sehari lewat grup chat tim. · Tim sales dan kurir yang sudah terbiasa memakai WhatsApp.
- Kurang cocok: Usaha yang sudah memakai aplikasi kasir atau order online untuk semua pesanan.
- Persiapan: Grup WhatsApp yang dipakai untuk order · Daftar produk dan harga · Google Sheets tujuan, atau kami yang buatkan

**Tahap 1**
Bagian ini menjawab pertanyaan "cocok tidak untuk saya", yang penting untuk AEO. Isinya sudah tepat, hanya istilah dan nama platform.

**Sesudah**
- Cocok: Usaha yang menerima puluhan order sehari lewat grup chat. · Sales dan kurir yang sudah terbiasa mengirim pesan di grup chat.
- Kurang cocok: tetap.
- Persiapan: Grup chat yang dipakai untuk order · Daftar produk dan harga · Tabel order tujuan, atau kami yang buatkan

**Alasan**
Syarat tetap jelas tanpa nama platform. Nama aplikasi tetap terlihat di bagian "Aplikasi yang dipakai" (lihat Keputusan nomor 3).

## 20. Angka hasil

**Sebelum**
3 jam waktu admin kembali setiap hari · 120 order tercatat sehari tanpa diketik ulang · 1 pesan rekap untuk pemilik setiap malam

**Tahap 1**
Label "Angka contoh" sudah ada di section.

**Sesudah**
- 3 jam waktu staf kembali setiap hari
- Dua angka lain tetap.

**Alasan**
Hanya istilah.

## 21. FAQ

**Sebelum**
1. Apakah sales harus menulis order dengan format tertentu? / Tidak. Asisten membaca order yang ditulis dengan bahasa sehari-hari, termasuk singkatan.
2. Bagaimana kalau pesan ordernya kurang jelas? / Asisten tidak menebak. Tim ditanya dulu, dan order baru dicatat setelah datanya jelas.
3. Di mana data order disimpan? / Di Google Sheets milik Anda sendiri, jadi data tetap bisa Anda buka dan bagikan kapan saja.

**Tahap 1**
Pertanyaan sudah berupa kalimat pencari. Jawaban perlu tetap lengkap kalau dikutip satu per satu. JSON-LD FAQPage dibentuk dari daftar ini, jadi ikut berubah otomatis.

**Sesudah**
1. Pertanyaan tetap. / Tidak. AI membaca order yang ditulis dengan bahasa sehari-hari, termasuk singkatan dan revisi seperti "jadi 12 dus ya".
2. Pertanyaan tetap. / AI tidak menebak. Sales ditanya dulu di grup, dan order baru dicatat setelah datanya jelas.
3. Pertanyaan tetap. / Di tabel milikmu sendiri, jadi data order tetap bisa kamu buka dan bagikan kapan saja.

**Alasan**
Jawaban 1 sekarang membawa contoh revisi, yang menjadi pembeda dari template alat otomasi.

## 22. Tonton: teks adegan

**Sebelum**
- Intro: Ikuti perjalanan satu order, dari pesan di grup tim sampai rekap malam untuk pemilik.
- Adegan 1: Order masuk acak di grup. Admin mengetik ulang satu per satu.
- Adegan 2: Tim tetap mengirim order seperti biasa.
- Adegan 5: Sistem membalas di grup dengan nomor order. / Sales tahu ordernya sudah tercatat tanpa bertanya ke admin.
- Adegan 8: Admin berhenti mengetik ulang dan punya waktu untuk pelanggan.
- Adegan 9: Untuk bisnis Anda / Mau sistem seperti ini untuk bisnis Anda? / Ceritakan alur order Anda. Kami bantu petakan solusinya, gratis.

**Tahap 1**
Teks adegan tampil di HTML (bukan hanya kanvas), jadi ikut terbaca mesin pencari. Adegan 3, 4, 6, 7 sudah sesuai dan tetap.

**Sesudah**
- Intro: Ikuti perjalanan satu order, dari pesan di grup sales sampai rekap malam untuk pemilik.
- Adegan 1: Order masuk acak di grup. Staf mengetik ulang satu per satu.
- Adegan 2: Sales tetap mengirim order seperti biasa.
- Adegan 5: AI membalas di grup dengan nomor order. / Sales tahu ordernya sudah tercatat tanpa bertanya ke staf.
- Adegan 8: Staf berhenti mengetik ulang dan punya waktu untuk pelanggan.
- Adegan 9: Untuk usahamu / Mau order di grup chat tercatat seperti ini? / Ceritakan alur order di usahamu. Kami bantu petakan solusinya, gratis.

**Alasan**
Jumlah kata tiap adegan sama atau selisih satu kata, aman untuk panel Tonton. Adegan 9 menyebut hasil spesifik, bukan "sistem seperti ini".

---

# Bagian D. Detail `cs-klinik` (Siap dibuat)

## 23. Title tag dan meta description

**Sebelum**
- Title: Pertanyaan pasien terjawab di luar jam kerja | Kreatekno Solusi
- Description (dari `answer`, 352 karakter): Asisten CS membalas chat pasien kapan saja, ...

**Tahap 1**
Kueri yang paling dekat: "chatbot WhatsApp klinik", "balas chat pasien di luar jam kerja". Hasil pencarian diisi artikel vendor chat. Pembeda: harga diambil dari tabel klinik, maksimal tiga pilihan jam, pertanyaan medis tidak dijawab AI.

**Sesudah**
- Title opsi A (utama): Chatbot WhatsApp Klinik untuk Chat Pasien di Luar Jam Kerja | Kreatekno
- Title opsi B: Balas Chat Pasien Klinik di Malam Hari dengan AI | Kreatekno
- Description: AI membalas chat WhatsApp pasien kapan saja. Harga dari tabel layanan, jadwal kosong seminggu ke depan, janji temu ke kalender. Pertanyaan medis diteruskan ke staf.

**Alasan**
"Chatbot" hanya di title tag sebagai kueri asli. Panduan suara tidak ingin chatbot terdengar sebagai layanan utama, dan halaman ini memang satu contoh layanan. Opsi A 71 karakter, mungkin dipotong di HP. Opsi B 60 karakter, lebih aman tapi tanpa kata "WhatsApp". Description 164 karakter.

## 24. Hero: H1, pertanyaan, dan jawaban

**Sebelum**
- H1: Pertanyaan pasien terjawab di luar jam kerja
- Pertanyaan: Bagaimana klinik menjawab chat pasien di malam hari tanpa menambah staf?
- Jawaban: Asisten CS membalas chat pasien kapan saja, termasuk setelah klinik tutup. Harga diambil dari tabel layanan klinik dan jadwal dicek sampai seminggu ke depan. Kalau jam yang diminta penuh, pasien mendapat paling banyak tiga pilihan jam lain, lalu janji temu masuk ke kalender klinik. Setiap percakapan diringkas di tabel pasien, dan pertanyaan medis diteruskan ke staf.

**Tahap 1**
H1 sudah menyebut topik tanpa nama platform. Pertanyaan memakai "menambah staf", padahal konteksnya merekrut. Jawaban tidak menyebut bahwa penerusan pertanyaan medis masih rancangan, sehingga kutipan AI bisa salah menangkap status.

**Sesudah**
- H1 opsi A (utama): tetap
- H1 opsi B: Chat pasien terjawab, juga setelah klinik tutup
- Pertanyaan: Bagaimana klinik menjawab chat pasien di malam hari tanpa menambah karyawan?
- Jawaban: AI membalas chat pasien kapan saja, termasuk setelah klinik tutup. Harga diambil dari tabel layanan klinik, dan jadwal dicek sampai seminggu ke depan. Kalau jam yang diminta penuh, pasien mendapat paling banyak tiga pilihan jam lain, lalu janji temu masuk ke kalender klinik. Setiap percakapan diringkas di tabel pasien. Dalam rancangan kami, AI meneruskan pertanyaan medis ke staf klinik.

**Alasan**
"Karyawan" dipakai karena konteksnya menambah orang. Kalimat terakhir jawaban sekarang membawa status rancangan, sesuai FAQ dan adegan 8. Jawaban naik dari 56 ke 59 kata.

## 25. Ringkasan kartu dan hasil utama

**Sebelum**
- Result: Chat pasien dibalas kapan saja, janji temu tersusun sebelum klinik buka
- Summary: Pertanyaan harga dan jadwal dijawab dari data klinik, janji temu dicatat, dan pertanyaan medis diteruskan ke staf.
- Klien: Klinik gigi (contoh)

**Tahap 1**
Sudah tanpa istilah terlarang.

**Sesudah**
Tetap.

**Alasan**
Summary sudah spesifik dan di bawah 20 kata.

## 26. Masalahnya

**Sebelum**
- Pembuka: Sebagian besar chat pasien berisi pertanyaan yang sama: harga, jam praktik, dan jadwal kosong. Chat yang masuk setelah klinik tutup baru dibalas keesokan paginya, dan sebagian pasien sudah memilih klinik lain.
- Poin: Admin menjawab pertanyaan yang sama puluhan kali sehari. · Chat yang masuk malam hari baru dibalas keesokan paginya. · Janji temu dicatat manual dari chat, sehingga jadwal mudah bentrok.

**Tahap 1**
Poin 1 memakai "admin".

**Sesudah**
- Pembuka: tetap
- Poin 1: Staf menjawab pertanyaan yang sama puluhan kali sehari.
- Poin 2 dan 3: tetap.

**Alasan**
Hanya istilah.

## 27. Yang kami bangun

**Sebelum**
- H3: Satu asisten CS yang menjawab dari data klinik sendiri
- Pembuka: Klinik cukup menyiapkan tabel layanan dan jadwal praktik. Asisten membaca setiap chat pasien, menjawab dengan data itu, lalu mencatat janji temu dan ringkasan percakapannya.
- Poin: 6 poin

**Tahap 1**
H3 dan pembuka memakai "asisten". Poin sudah spesifik.

**Sesudah**
- H3 opsi A (utama): AI yang menjawab pasien dari data klinik sendiri
- H3 opsi B: Jawaban untuk pasien, diambil dari data klinik sendiri
- Pembuka: Klinik cukup menyiapkan tabel layanan dan jadwal praktik. AI membaca setiap chat pasien, menjawab dengan data itu, lalu mencatat janji temu dan ringkasan percakapannya.
- Poin: tetap.

**Alasan**
H3 opsi A menjaga pembeda "data klinik sendiri" yang tidak dimiliki artikel vendor.

## 28. Kutipan

**Sebelum**
"Dulu pagi kami habis untuk membalas chat semalam. Sekarang admin tinggal mengecek janji temu yang sudah tercatat." Admin klinik gigi

**Tahap 1**
Kutipan contoh untuk solusi yang belum dipakai klien. Memakai "admin" dua kali.

**Sesudah**
"Dulu pagi kami habis untuk membalas chat semalam. Sekarang staf tinggal mengecek janji temu yang sudah tercatat." Staf klinik gigi

**Alasan**
Kutipan contoh boleh disunting (keputusan 28 Nov 2026). Hanya "admin" yang diganti, isi kutipan tetap.

## 29. Langkah kerja

**Sebelum**
1. Pasien bertanya lewat chat: Lewat nomor WhatsApp klinik yang sudah dikenal pasien, kapan saja.
2. Asisten menjawab dari data klinik: Harga dari tabel layanan, jam kosong dari jadwal klinik.
3. Janji temu tercatat: ...
4. Staf menangani pertanyaan medis: Rancangan untuk klinik: pertanyaan medis tidak dijawab asisten dan diteruskan ke staf.

**Tahap 1**
Nama platform dan "asisten".

**Sesudah**
1. Pasien bertanya lewat chat: Lewat nomor chat klinik yang sudah dikenal pasien, kapan saja.
2. AI menjawab dari data klinik: Harga dari tabel layanan, jam kosong dari jadwal klinik.
3. Tetap.
4. Staf menangani pertanyaan medis: Rancangan untuk klinik: AI meneruskan pertanyaan medis ke staf.

**Alasan**
Hanya istilah.

## 30. Sebelum dan sesudah (tabel)

**Sebelum**
- Pertanyaan rutin: Dijawab admin satu per satu → Dijawab saat itu juga
- Chat malam hari: Dibalas besok pagi → Dibalas saat chat masuk
- Janji temu: Dicatat manual dari chat → Masuk ke kalender klinik

**Tahap 1**
Hanya istilah.

**Sesudah**
- Pertanyaan rutin: Dijawab staf satu per satu → Dijawab saat itu juga
- Dua baris lain tetap.

**Alasan**
Panjang sel sama.

## 31. Cocok, kurang cocok, persiapan, angka

**Sebelum**
- Cocok: Klinik yang menerima banyak pertanyaan berulang lewat WhatsApp. · Klinik dengan jadwal praktik per jam, seperti klinik gigi atau kecantikan.
- Kurang cocok: Layanan yang membutuhkan diagnosis lewat chat.
- Persiapan: Daftar layanan dan harga · Jadwal praktik dan durasi setiap layanan · Pertanyaan yang paling sering diajukan pasien
- Angka: 1 menit balasan pertama · 3 pilihan jam · 1 baris catatan per pasien

**Tahap 1**
Hanya nama platform di poin Cocok 1.

**Sesudah**
- Cocok 1: Klinik yang menerima banyak pertanyaan berulang lewat chat.
- Lainnya tetap.

**Alasan**
Syarat tetap jelas.

## 32. FAQ

**Sebelum**
1. Apakah asisten memberi saran medis? / Tidak. Dalam rancangan untuk klinik, pertanyaan medis tidak dijawab asisten dan selalu diteruskan ke staf klinik.
2. Apakah pasien bisa bicara dengan manusia? / Bisa. Staf membalas dari nomor WhatsApp yang sama, dan ringkasan chat pasien tetap tersimpan di tabel.
3. Bagaimana kalau harga atau jadwal berubah? / Cukup ubah tabel layanan dan jadwal klinik. Asisten selalu membaca data terbaru saat menjawab.

**Tahap 1**
FAQ 1 adalah pertanyaan paling penting untuk klinik dan menjadi kutipan yang paling mungkin diambil AI pencarian. Isinya sudah tepat.

**Sesudah**
1. Apakah AI memberi saran medis? / Tidak. Dalam rancangan untuk klinik, pertanyaan medis tidak dijawab AI dan selalu diteruskan ke staf klinik.
2. Pertanyaan tetap. / Bisa. Staf membalas dari nomor chat klinik yang sama, dan ringkasan chat pasien tetap tersimpan di tabel.
3. Pertanyaan tetap. / Cukup ubah tabel layanan dan jadwal klinik. AI selalu membaca data terbaru saat menjawab.

**Alasan**
Hanya istilah dan nama platform. FAQ 1 dipertahankan karena itu pertanyaan paling penting untuk klinik.

## 33. Tonton: teks adegan

**Sebelum**
- Adegan 1: Chat pasien yang masuk malam baru dibalas besok pagi. / Admin menjawab pertanyaan yang sama berulang kali. ...
- Adegan 2: ... Asisten CS mulai bekerja begitu chat masuk.
- Adegan 4: ... Asisten selalu menjawab dengan harga terbaru dari tabel itu.
- Adegan 5: ... Asisten melihat jadwal klinik sampai seminggu ke depan. ...
- Adegan 6: ... tercatat di jadwal tanpa diketik ulang oleh admin.
- Adegan 7: Balasan terkirim, ringkasan chat tercatat untuk admin.
- Adegan 9: Admin datang pagi, janji temu sudah tersusun.
- Adegan 10: Untuk bisnis Anda / Mau chat pasien terjawab di luar jam kerja? / Ceritakan layanan dan jadwal klinik Anda. Kami bantu petakan solusinya, gratis.

**Tahap 1**
Adegan 3 dan 8 sudah sesuai dan tetap.

**Sesudah**
- Adegan 1 isi: Staf menjawab pertanyaan yang sama berulang kali. Chat yang masuk setelah klinik tutup menunggu sampai jam kerja.
- Adegan 2 kalimat akhir: AI mulai membalas begitu chat masuk.
- Adegan 4 kalimat akhir: AI selalu menjawab dengan harga terbaru dari tabel itu.
- Adegan 5 kalimat awal: AI melihat jadwal klinik sampai seminggu ke depan.
- Adegan 6 kalimat akhir: ...tercatat di jadwal tanpa diketik ulang oleh staf.
- Adegan 7 judul: Balasan terkirim, ringkasan chat tercatat untuk staf.
- Adegan 9 judul: Staf datang pagi, janji temu sudah tersusun.
- Adegan 10: Untuk klinikmu / Mau chat pasien terjawab di luar jam kerja? / Ceritakan layanan dan jadwal klinikmu. Kami bantu petakan solusinya, gratis.

**Alasan**
Jumlah kata sama atau berkurang satu, aman untuk panel Tonton.

---

## Catatan teknis (di luar teks siap tempel)

- **Field metadata baru.** Title tag dan meta description di atas butuh field sendiri, misalnya `seoTitle` dan `seoDescription` di `SolusiCopySchema`, dipakai di `generateMetadata` (`app/[locale]/(pages)/solusi/[slug]/page.tsx`) dengan cadangan ke pola lama. Ini perubahan kode, dikerjakan setelah draf disetujui.
- **Label "Tim" di taksonomi.** Diganti di `messages/id.json` (`search.team`) dan `detail-copy.ts` (`team`). Nama bagiannya (Marketing, Penjualan, CS, dan seterusnya) tetap.
- **Teks di panggung Tonton** (gelembung chat, tabel contoh di `stage`) tidak masuk pilot. Isinya data contoh pendek (maks 5 kata). Pengirim berperan "admin" atau "asisten" perlu dicek terpisah.
- **Pesan WhatsApp otomatis** di `lib/solusi/pesan.ts` memakai judul solusi (`detailMessage`). Setelah H1 berubah, pesannya menjadi: Halo Kreatekno, saya lihat solusi "Order di grup chat sales tercatat sendiri, tanpa diketik ulang". Saya mau konsultasi solusi serupa untuk bisnis saya. Masih wajar. Kata "bisnis" di pesan pengunjung boleh tetap.
- **JSON-LD FAQPage** dibentuk otomatis dari `faq`, jadi ikut berubah tanpa kerja tambahan. Google menghentikan FAQ rich result sejak 7 Mei 2026, tapi FAQ tetap berguna untuk pembaca dan kutipan AI.
- **`detailPlaceholder`** di `messages/id.json` tidak dipakai halaman mana pun, jadi tidak direfrasa.

## Ringkasan perubahan

| Bagian | Status |
|---|---|
| 1–2 Metadata etalase | Diubah |
| 3 Hero etalase | Diubah (H1 baru) |
| 4 Rak katalog | Istilah |
| 5 Band | Tetap |
| 6 Mode Cari | Istilah ("Tim" jadi "Bagian") |
| 7 Mode Kartu dan hasil | Istilah |
| 8 Kontak | Tetap |
| 9 Kartu masalah | 4 dari 24 diubah |
| 10 Label detail | Istilah dan CTA |
| 11–22 order-grup | Metadata baru, H1 baru, istilah |
| 23–33 cs-klinik | Metadata baru, jawaban diperjelas, istilah |

## Rencana ukur

- Setelah tayang, catat tanggal penerapan. Bandingkan 28 hari sebelum dan sesudah di GSC untuk URL `/solusi`, `/solusi/order-grup`, `/solusi/cs-klinik`: tayangan, klik, CTR, posisi, per kelompok kueri ("order whatsapp sheets", "chatbot klinik", "otomasi umkm").
- Untuk GEO, cek laporan Generative AI di GSC kalau sudah tersedia untuk properti ini. Observasi manual: tanyakan "bagaimana mencatat order dari grup WhatsApp otomatis" dan "chatbot klinik untuk malam hari" di dua mesin AI, catat tanggal dan apakah URL Kreatekno muncul.

## Yang perlu diputuskan

1. ~~Nama platform di H1 dan isi halaman.~~ Diputuskan 28 Nov 2026: ikuti aturan suara, nama platform hanya di title tag dan meta description.
2. ~~H1 etalase.~~ Diputuskan: opsi A "Contoh AI untuk pekerjaan rutin usahamu".
3. ~~Bagian "Aplikasi yang dipakai".~~ Diputuskan: pengecualian, nama dan logo aplikasi tetap tampil di bagian itu dan di filter.
4. ~~Kutipan contoh.~~ Diputuskan: boleh disunting mengikuti istilah brand.
5. **Angka "sekitar 120 order"** di order-grup: angka asli klien yang boleh disebut, atau tetap contoh?
6. ~~Dua usulan FAQ baru.~~ Diputuskan 28 Nov 2026: dibuang, FAQ tetap tiga per solusi.
7. **Field `seoTitle` dan `seoDescription`:** setuju ditambahkan ke skema setelah copy disetujui?
8. ~~Pola pilot.~~ Diputuskan: dipakai untuk 15 solusi lain.
