# Website: Solusi v1, 15 halaman detail, SEO/AEO/GEO (draf untuk review)

Draf 28 Nov 2026, revisi 1. Lanjutan dari `website-solusi-v1-draf.md` (pilot etalase, label bersama, kartu, `order-grup`, `cs-klinik`).
- Mode: revisi (refrasa), perubahan sedang
- Sumber "sebelum": `site/content/solusi/items/*.ts` dan `site/content/solusi/cerita/*.ts`, commit `8f210a1` (28 Nov 2026)
- Masukan yang sudah diterapkan (28 Nov 2026): H1 baru memakai opsi A. Nama platform hanya di title tag dan meta description. Bagian "Aplikasi yang dipakai" tetap menjadi pengecualian. Kutipan contoh boleh disunting mengikuti istilah brand. Pola pilot dipakai untuk semua solusi.
- Hanya copy Indonesia.

## Pola yang dipakai di semua solusi

Supaya draf ini bisa dibaca, perubahan istilah yang berulang ditulis sekali di sini, lalu setiap solusi hanya mencantumkan elemen yang berubah. Elemen yang tidak disebut berarti tetap.

| Lama | Baru | Catatan |
|---|---|---|
| Anda, usaha Anda, -nya Anda | kamu, usahamu, -mu | |
| asisten, Asisten booking, asisten virtual | AI | |
| admin (orang) | staf | |
| tim, tim marketing, tim SDM, tim keuangan (orang di usaha klien) | staf, staf marketing, bagian SDM, bagian keuangan | |
| grup tim | grup staf | |
| jadwal tim, kalender tim | jadwal staf, kalender bersama | |
| Untuk bisnis Anda (eyebrow adegan terakhir) | Untuk usahamu | |
| WhatsApp, Google Sheets, Sheets, Drive, Telegram, Instagram, Threads, Excel | aplikasi chat, nomor chat, tabel, folder bersama, media sosial | Hanya di title tag dan meta tetap disebut |
| rentang waktu dengan tanda pisah (10.00–10.30) | "10.00 sampai 10.30" | Aturan tanpa em dash, tanda pisah ikut dihindari |

Setiap solusi juga mendapat **title tag** dan **meta description** sendiri. Field ini perlu ditambahkan ke skema (`seoTitle`, `seoDescription`), lihat catatan teknis di draf pilot.

**Catatan ruang:** judul (H1) juga tampil di kotak rak 3D (`RakBox.tsx`) dan kartu hasil. H1 yang lebih panjang dari versi live ditandai [perlu dicek di tampilan].

---

# 1. booking-jasa (Sudah berjalan)

## 1.1 booking-jasa: title tag dan meta description

**Sebelum**
- Title: Booking jasa langsung dari chat pelanggan | Kreatekno Solusi
- Description: diambil dari `answer` (284 karakter)

**Tahap 1**
Kueri terdekat: "chatbot WhatsApp booking", "booking jadwal otomatis usaha jasa". Pembeda: jadwal dicek dengan aturan pasti, bukan tebakan AI, dan perubahan jadwal diputuskan staf.

**Sesudah**
- Title opsi A (utama): Chatbot WhatsApp untuk Booking Jasa dan Jadwal Otomatis | Kreatekno
- Title opsi B: Booking Jasa lewat WhatsApp, Jadwal Tercatat Otomatis | Kreatekno
- Description: Pelanggan bertanya harga dan memilih jam kosong lewat WhatsApp, lalu booking tercatat di jadwal. Pindah jadwal dan batal diputuskan staf dengan satu tombol.

**Alasan**
Opsi A 67 karakter, memuat dua kueri. Description 156 karakter.

## 1.2 booking-jasa: H1, pertanyaan, jawaban, ringkasan

**Sebelum**
- H1: Booking jasa langsung dari chat pelanggan
- Pertanyaan: Bagaimana usaha jasa menerima booking dari WhatsApp tanpa admin standby?
- Result: Booking terkonfirmasi tanpa menunggu admin
- Summary: Pelanggan memilih jam yang masih kosong langsung di chat, lalu booking tercatat otomatis di jadwal tim Anda.
- Jawaban: Asisten booking menjawab pelanggan di WhatsApp, menyebut harga dari daftar layanan, mengecek jam yang masih kosong, lalu mencatat booking ke jadwal tim. Permintaan khusus dan perubahan jadwal diteruskan ke tim lengkap dengan ringkasan chat, sehingga pelanggan tidak perlu mengulang ceritanya.

**Tahap 1**
"Langsung" di H1 dan summary rawan ambigu. Jawaban perlu menyebut aturan jadwal, karena itu pembeda yang bisa dikutip.

**Sesudah**
- H1 opsi A (utama, dipilih): Pelanggan booking jasa lewat chat, jadwal tercatat sendiri [perlu dicek di tampilan]
- H1 opsi B: Booking jasa dari chat pelanggan, tanpa menunggu staf
- Pertanyaan: Bagaimana usaha jasa menerima booking dari chat tanpa staf berjaga terus?
- Result: Booking terkonfirmasi tanpa menunggu staf
- Summary: Pelanggan memilih jam yang masih kosong di chat, lalu booking tercatat otomatis di jadwal stafmu. (16 kata)
- Jawaban: AI menjawab pelanggan di chat, menyebut harga dari daftar layanan, dan menawarkan jam yang masih kosong. Jadwal dicek dengan aturan tetap: minimal sehari sebelumnya, selesai dalam jam kerja, dan tidak bentrok. Booking yang lengkap dicatat ke jadwal staf. Pindah jadwal dan permintaan khusus diteruskan ke staf beserta ringkasan chat, jadi pelanggan tidak perlu mengulang ceritanya.

**Alasan**
Jawaban sekarang memuat aturan jadwal, sehingga tetap akurat saat dikutip sendiri. Jawaban naik dari 41 ke 57 kata.

## 1.3 booking-jasa: isi mode Baca

**Sebelum**
- painsLead: ...Admin harus membalas satu per satu sambil mengatur jadwal tim lapangan.
- pains 2: Jadwal tim lapangan sering bentrok karena dicatat di beberapa tempat.
- built.lead: ...asisten menjawab dari daftar layanan, ... ke jadwal tim.
- built.points 1, 3, 4, 5: ...usaha Anda... / ...ke grup tim... / ...ke tim. Tim cukup menekan Ya atau Tidak... / Berhenti membalas saat admin mengambil alih chat dari HP...
- steps 2 judul: Asisten menjawab dan menawarkan jadwal
- steps 3: Booking masuk ke jadwal tim / Tim melihat booking baru di tabel jadwal dan menerima laporannya di grup tim.
- steps 4: Tim memutuskan yang khusus / ...diteruskan ke tim dengan ringkasannya.
- compare: Menunggu admin membalas · aspek "Jadwal tim"
- fit: Usaha jasa dengan tim lapangan dan jadwal kunjungan. · ...menghubungi lewat WhatsApp.
- prep: Jam kerja dan kapasitas tim per hari · Tabel jadwal tim, atau kami yang buatkan
- metrics 1: asisten aktif, pelanggan bisa booking kapan saja
- FAQ 1: Apakah pelanggan tahu sedang dilayani asisten? / Ya. Kalau ditanya, asisten menjawab jujur bahwa ia asisten virtual, dan pelanggan bisa menelepon nomor yang sama untuk bicara dengan admin.
- FAQ 2 jawaban: Permintaannya diteruskan ke tim. Setelah tim menekan Ya, ...
- FAQ 3 jawaban: Tidak lewat asisten. Booking minimal sehari sebelumnya, supaya tim sempat menyiapkan petugas. Aturan ini bisa disesuaikan dengan usaha Anda.

**Tahap 1**
Hanya istilah. Isi sudah spesifik.

**Sesudah**
- painsLead: Hampir semua pelanggan menghubungi lewat chat untuk bertanya harga dan jam kosong. Staf harus membalas satu per satu sambil mengatur jadwal petugas lapangan.
- pains 2: Jadwal petugas lapangan sering bentrok karena dicatat di beberapa tempat.
- built.lead: Pelanggan tetap menghubungi nomor usaha seperti biasa. Di belakang nomor itu, AI menjawab dari daftar layanan, mengecek jadwal dengan aturan yang pasti, lalu mencatat booking yang sudah lengkap ke jadwal staf.
- built.points 1: Menyebut harga dan ketentuan hanya dari daftar layanan usahamu, tanpa menebak.
- built.points 3: Mencatat booking setelah pelanggan mengirim lokasi, lalu melaporkannya ke grup staf dengan ringkasan chat.
- built.points 4: Meneruskan pindah jadwal dan pembatalan ke staf. Staf cukup menekan Ya atau Tidak, dan pelanggan dikabari otomatis.
- built.points 5: Berhenti membalas saat staf mengambil alih chat dari HP, supaya pelanggan tidak menerima dua jawaban.
- steps 2 judul: AI menjawab dan menawarkan jadwal
- steps 3: Booking masuk ke jadwal staf / Staf melihat booking baru di tabel jadwal dan menerima laporannya di grup staf.
- steps 4: Staf memutuskan yang khusus / Perubahan jadwal dan permintaan di luar kebiasaan diteruskan ke staf dengan ringkasannya.
- compare: Menunggu staf membalas · aspek "Jadwal petugas"
- fit: Usaha jasa dengan petugas lapangan dan jadwal kunjungan. · Usaha yang sebagian besar pelanggannya menghubungi lewat chat.
- prep: Jam kerja dan kapasitas petugas per hari · Tabel jadwal petugas, atau kami yang buatkan
- metrics 1: AI aktif 24 jam, pelanggan bisa booking kapan saja
- FAQ 1: Apakah pelanggan tahu sedang dilayani AI? / Ya. Kalau ditanya, AI menjawab jujur bahwa ia AI, dan pelanggan bisa menelepon nomor yang sama untuk bicara dengan staf.
- FAQ 2 jawaban: Permintaannya diteruskan ke staf. Setelah staf menekan Ya, jadwal diperbarui, slot lama kembali kosong, dan pelanggan dikabari otomatis.
- FAQ 3 jawaban: Tidak lewat AI. Booking minimal sehari sebelumnya, supaya ada waktu menyiapkan petugas. Aturan ini bisa disesuaikan dengan usahamu.

**Alasan**
"Petugas lapangan" lebih tepat daripada "staf lapangan" untuk jasa kebersihan dan sama dengan kartu k7. Label angka memakai "aktif 24 jam" sesuai panduan gaya (nilai angkanya sudah 24 jam).

## 1.4 booking-jasa: Tonton

**Sebelum**
- Intro: ...sampai jadwal tim yang rapi.
- Adegan 1 judul: Chat booking menunggu admin. Jadwal tim dicatat di beberapa tempat.
- Adegan 3 isi: Harga dan ketentuan hanya diambil dari daftar layanan usaha Anda. Pertanyaan di luar daftar diteruskan ke tim.
- Adegan 6: Langkah 5 · Tim menerima / Tim melihat booking baru di tabel jadwal dan di grup tim. / ...jadi tim tidak perlu bertanya ulang.
- Adegan 7: Pindah jadwal atau batal diputuskan tim dengan satu tombol. / Tim menekan Ya atau Tidak. ...
- Adegan 8 judul: Pelanggan mendapat jawaban saat itu, dan admin fokus ke permintaan khusus.
- Adegan 9: Untuk bisnis Anda / Mau booking otomatis seperti ini untuk usaha Anda? / Ceritakan cara Anda menerima booking sekarang. ...

**Tahap 1**
Adegan 2, 4, 5 tetap.

**Sesudah**
- Intro: Ikuti perjalanan satu booking, dari chat pelanggan di malam hari sampai jadwal petugas yang rapi.
- Adegan 1 judul: Chat booking menunggu staf. Jadwal petugas dicatat di beberapa tempat.
- Adegan 3 isi: Harga dan ketentuan hanya diambil dari daftar layanan usahamu. Pertanyaan di luar daftar diteruskan ke staf.
- Adegan 6: Langkah 5 · Staf menerima / Staf melihat booking baru di tabel jadwal dan di grup staf. / Laporannya memuat layanan, harga, lokasi, dan ringkasan chat, jadi staf tidak perlu bertanya ulang.
- Adegan 7: Pindah jadwal atau batal diputuskan staf dengan satu tombol. / Staf menekan Ya atau Tidak. Jadwal diperbarui, dan pelanggan dikabari otomatis.
- Adegan 8 judul: Pelanggan mendapat jawaban saat itu, dan staf fokus ke permintaan khusus.
- Adegan 9: Untuk usahamu / Mau booking dari chat tercatat seperti ini? / Ceritakan cara usahamu menerima booking sekarang. Kami bantu petakan solusinya, gratis.

**Alasan**
Jumlah kata tiap adegan sama atau selisih satu.

---

# 2. berkas-dokumen (Siap dibuat)

## 2.1 berkas-dokumen: title tag dan meta description

**Sebelum**
- Title: Berkas dokumen pelanggan dirapikan otomatis | Kreatekno Solusi
- Description: diambil dari `answer` (330 karakter)

**Tahap 1**
Kueri terdekat: "kumpulkan dokumen pelanggan dari WhatsApp", "simpan file WhatsApp ke Google Drive otomatis".

**Sesudah**
- Title opsi A (utama): Kumpulkan Dokumen Pelanggan dari WhatsApp ke Google Drive | Kreatekno
- Title opsi B: Rapikan Berkas Dokumen Pelanggan dari Chat Otomatis | Kreatekno
- Description: Foto dan PDF dari WhatsApp tersimpan per pelanggan di Google Drive, isinya dibaca, dan kelengkapan tercatat di tabel. Dokumen buram diminta kirim ulang.

**Alasan**
Opsi A 69 karakter, mungkin dipotong di HP, opsi B lebih aman. Description 152 karakter.

## 2.2 berkas-dokumen: H1, pertanyaan, jawaban, ringkasan

**Sebelum**
- H1: Berkas dokumen pelanggan dirapikan otomatis
- Pertanyaan dan jawaban: tanpa istilah terlarang

**Tahap 1**
H1, pertanyaan, jawaban, result, dan summary sudah sesuai aturan.

**Sesudah**
- H1 opsi A (utama): tetap
- H1 opsi B: Dokumen pelanggan dari chat tersimpan rapi per orang
- Pertanyaan, jawaban, result, summary: tetap

**Alasan**
Jawaban sudah menjawab di kalimat pertama dan menyebut batas (dokumen dicek staf).

## 2.3 berkas-dokumen: isi mode Baca

**Sebelum**
- fit 2: Tim kecil yang memproses berkas untuk pengajuan ke pihak lain.
- FAQ 1 jawaban: Dokumen disimpan di penyimpanan milik usaha Anda dengan akses yang Anda atur sendiri, dan tidak dibagikan lewat link publik.

**Tahap 1**
Hanya istilah.

**Sesudah**
- fit 2: Usaha kecil dengan beberapa staf yang memproses berkas untuk pengajuan ke pihak lain.
- FAQ 1 jawaban: Dokumen disimpan di penyimpanan milik usahamu dengan akses yang kamu atur sendiri, dan tidak dibagikan lewat link publik.

**Alasan**
Fit 2 bertambah 3 kata, tapi tetap satu baris di daftar.

## 2.4 berkas-dokumen: Tonton

**Sebelum**
- Intro: Ikuti berkas Maya dari kiriman WhatsApp sampai Sari memeriksanya di kantor notaris dan PPAT contoh.
- Adegan 2 judul: Maya mengirim foto dan PDF lewat WhatsApp.

**Tahap 1**
Hanya nama platform.

**Sesudah**
- Intro: Ikuti berkas Maya dari kiriman di chat sampai Sari memeriksanya di kantor notaris dan PPAT contoh.
- Adegan 2 judul: Maya mengirim foto dan PDF lewat chat.

**Alasan**
Adegan lain tetap. Adegan terakhir sudah memakai CTA tanpa "Anda".

---

# 3. riset-konten (Siap dibuat)

## 3.1 riset-konten: title tag dan meta description

**Sebelum**
- Title: Riset konten otomatis dari tren media sosial | Kreatekno Solusi
- Description: diambil dari `answer` (374 karakter)

**Tahap 1**
Kueri terdekat: "riset ide konten otomatis", "cari ide konten dari tren Threads". Pembeda: riset bergiliran dua kali sehari dan staf memilih Setuju atau Lewati.

**Sesudah**
- Title opsi A (utama): Riset Ide Konten Otomatis dari Tren Threads dengan AI | Kreatekno
- Title opsi B: Riset Konten Otomatis dari Tren Media Sosial dengan AI | Kreatekno
- Description: Setiap pagi dan malam, AI meriset satu topik dari tren dan post Threads yang ramai, lalu merangkum keluhan audiens dan sudut konten untuk staf marketing.

**Alasan**
"Threads" hanya di metadata, sesuai FAQ yang menyebut sumber post saat ini. Opsi A 65 karakter. Description 153 karakter.

## 3.2 riset-konten: H1, pertanyaan, jawaban, ringkasan

**Sebelum**
- H1: Riset konten otomatis dari tren media sosial
- Pertanyaan: Bagaimana tim marketing tahu apa yang sedang dibicarakan audiens tanpa riset manual?
- Summary: Setiap pagi dan malam, satu topik usaha Anda diriset dari tren dan post yang ramai, lalu dirangkum untuk tim.
- Jawaban: Setiap pagi dan malam, satu topik dari daftar topik usaha Anda diriset secara bergiliran. AI merangkum tren terbaru seputar topik itu, post yang paling banyak disukai dikumpulkan, lalu AI membaca keluhan audiens dan sudut konten yang bisa dipakai. Hasilnya tersimpan sebagai satu baris di tabel riset dan dikirim ke grup tim, lalu tim memilih Setuju atau Lewati.

**Tahap 1**
H1 tetap. Pertanyaan, summary, dan jawaban memakai "tim" dan "Anda".

**Sesudah**
- H1: tetap
- Pertanyaan: Bagaimana staf marketing tahu apa yang sedang dibicarakan audiens tanpa riset manual?
- Summary: Setiap pagi dan malam, satu topik usahamu diriset dari tren dan post yang ramai, lalu dirangkum untuk staf. (19 kata)
- Jawaban: Setiap pagi dan malam, satu topik dari daftar topik usahamu diriset bergiliran. AI merangkum tren terbaru seputar topik itu, mengumpulkan post yang paling banyak disukai, lalu mencatat keluhan audiens dan sudut konten yang bisa dipakai. Hasilnya tersimpan sebagai satu baris di tabel riset dan dikirim ke grup staf marketing, yang memilih Setuju atau Lewati.

**Alasan**
Jawaban memakai AI sebagai subjek untuk semua langkah riset supaya jelas siapa yang mengerjakan. 59 menjadi 55 kata.

## 3.3 riset-konten: isi mode Baca

**Sebelum**
- painsLead: Tim marketing tahu harus posting rutin, ...
- pains 1: Tim marketing menghabiskan berjam-jam mencari ide sebelum mulai menulis.
- pains 3: ...sehingga tim sulit memakainya lagi.
- built.h: Satu topik diriset dua kali sehari, tim tinggal memilih
- built.lead: Anda menentukan daftar topik yang dekat dengan usaha dan audiens Anda. ...bahan yang siap ditulis tim.
- built.points 1: ...semua topik Anda diriset secara rutin.
- built.points 5: ...ke grup tim untuk disetujui atau dilewati.
- quote.by: Tim marketing brand edukasi bisnis
- steps 1 isi: Daftar topik usaha Anda diriset bergantian, ...
- steps 4: Tim memilih / Ringkasan riset masuk ke grup tim. ...
- compare 3 sesudah: Satu tabel riset untuk seluruh tim
- fit 2: Tim marketing kecil tanpa waktu riset.
- prep 1 dan 3: ...usaha dan audiens Anda · Grup tim untuk menerima ringkasan riset
- FAQ 1 jawaban: ...Tim Anda yang menulis dengan gaya brand.
- FAQ 2 jawaban: Post yang dibaca saat ini berasal dari Threads. Hasil risetnya bisa dipakai untuk konten di platform mana pun yang Anda gunakan.
- FAQ 3 jawaban: Tim cukup memilih Lewati. ...sesuai kebutuhan usaha Anda.

**Tahap 1**
Hanya istilah dan satu nama platform di FAQ 2.

**Sesudah**
- painsLead: Staf marketing tahu harus posting rutin, tetapi ide konten dicari dari nol setiap minggu. Riset dilakukan sambil membuka puluhan post satu per satu, dan hasilnya jarang tercatat.
- pains 1: Staf marketing menghabiskan berjam-jam mencari ide sebelum mulai menulis.
- pains 3: Hasil riset tersimpan di catatan pribadi, sehingga sulit dipakai lagi oleh staf lain.
- built.h: Satu topik diriset dua kali sehari, staf tinggal memilih
- built.lead: Kamu menentukan daftar topik yang dekat dengan usaha dan audiensmu. Di setiap sesi, satu topik diriset dari tren terbaru dan post yang paling ramai, lalu hasilnya dirangkum menjadi bahan yang siap ditulis staf.
- built.points 1: Menggilir topik setiap pagi dan malam, sehingga semua topikmu diriset secara rutin.
- built.points 5: Menyimpan setiap riset di satu tabel dan mengirim ringkasannya ke grup staf untuk disetujui atau dilewati.
- quote.by: Staf marketing brand edukasi bisnis
- steps 1 isi: Daftar topik usahamu diriset bergantian, satu topik setiap pagi dan malam.
- steps 4: Staf memilih / Ringkasan riset masuk ke grup staf. Riset yang disetujui siap ditulis.
- compare 3 sesudah: Satu tabel riset untuk semua staf
- fit 2: Bagian marketing kecil tanpa waktu riset.
- prep 1 dan 3: Daftar topik yang dekat dengan usaha dan audiensmu · Grup staf untuk menerima ringkasan riset
- FAQ 1 jawaban: Tidak. Yang disiapkan adalah riset: keluhan audiens, sudut konten, dan kata kuncinya. Stafmu yang menulis dengan gaya brand.
- FAQ 2 jawaban: Saat ini post dibaca dari satu media sosial berbasis teks. Hasil risetnya bisa dipakai untuk konten di media sosial mana pun yang kamu gunakan.
- FAQ 3 jawaban: Staf cukup memilih Lewati. Daftar topik dan jam sesinya juga bisa diubah sesuai kebutuhan usahamu.

**Alasan**
FAQ 2 menyebut sumber secara umum (keputusan 28 Nov 2026). Nama itu tetap ada di title tag, meta, dan bagian "Aplikasi yang dipakai".

## 3.4 riset-konten: Tonton

**Sebelum**
- Intro: ...sampai riset yang disetujui tim.
- Adegan 1 isi: Tim membuka puluhan post satu per satu, ...
- Adegan 2 isi: Daftar topik usaha Anda diriset bergiliran. ...
- Adegan 6 isi: ...sehingga tim bisa membuka lagi riset minggu lalu kapan saja.
- Adegan 7: Langkah 6 · Tim memilih / Ringkasan riset masuk ke grup tim. Tim tinggal memilih. / Tim memilih Setuju atau Lewati. ...
- Adegan 8 judul: Tim mulai menulis dari riset, bukan dari tebakan.
- Adegan 9: Untuk bisnis Anda / Mau riset konten otomatis seperti ini untuk usaha Anda? / Ceritakan topik dan audiens usaha Anda. ...

**Tahap 1**
Adegan 3, 4, 5 tetap.

**Sesudah**
- Intro: Ikuti perjalanan satu topik, dari daftar topik usaha sampai riset yang disetujui staf.
- Adegan 1 isi: Staf membuka puluhan post satu per satu, lalu menebak topik mana yang sedang dibicarakan audiens.
- Adegan 2 isi: Daftar topik usahamu diriset bergiliran. Sesi malam memakai topik yang berbeda dari sesi pagi.
- Adegan 6 isi: Semua riset ada di satu tabel, sehingga staf bisa membuka lagi riset minggu lalu kapan saja.
- Adegan 7: Langkah 6 · Staf memilih / Ringkasan riset masuk ke grup staf. Staf tinggal memilih. / Staf memilih Setuju atau Lewati. Riset yang disetujui siap ditulis menjadi konten.
- Adegan 8 judul: Staf mulai menulis dari riset, bukan dari tebakan.
- Adegan 9: Untuk usahamu / Mau ide konten diriset setiap hari seperti ini? / Ceritakan topik dan audiens usahamu. Kami bantu petakan solusinya, gratis.

**Alasan**
Panjang adegan sama.

---

# 4. pengingat-tagihan (Siap dibuat)

## 4.1 pengingat-tagihan: title tag dan meta description

**Sebelum**
- Title: Tagihan jatuh tempo diingatkan otomatis | Kreatekno Solusi
- Description: diambil dari `answer` (366 karakter)

**Tahap 1**
Kueri terdekat: "pengingat tagihan otomatis WhatsApp", "reminder jatuh tempo pelanggan". Artikel pembanding menyarankan pengingat sebelum, pada, dan setelah jatuh tempo, sama dengan tahap di halaman ini.

**Sesudah**
- Title opsi A (utama): Pengingat Tagihan Otomatis via WhatsApp dan Email | Kreatekno
- Title opsi B: Reminder Jatuh Tempo Tagihan Otomatis untuk UMKM | Kreatekno
- Description: Tagihan belum lunas dicek setiap pagi. Pelanggan diingatkan lewat WhatsApp atau email pada H-3, hari jatuh tempo, dan H+7. Tagihan H+30 diteruskan ke pemilik.

**Alasan**
Description menyebut ketiga tahap dalam angka, bentuk yang mudah dikutip. 158 karakter.

## 4.2 pengingat-tagihan: H1, pertanyaan, jawaban, ringkasan

**Sebelum**
- H1: Tagihan jatuh tempo diingatkan otomatis
- Pertanyaan, jawaban, result, summary: tanpa istilah terlarang

**Tahap 1**
Sudah sesuai. Jawaban sudah menyebut tahap dan batas H+30.

**Sesudah**
- H1 opsi A (utama): tetap
- H1 opsi B: Pelanggan diingatkan tagihannya, tanpa kamu menagih sendiri
- Lainnya: tetap

**Alasan**
Opsi B menjawab keberatan "sungkan menagih", tapi lebih panjang.

## 4.3 pengingat-tagihan: isi mode Baca

**Sebelum**
- FAQ 1: Apa syarat mengirim pengingat lewat WhatsApp? / Minta izin pelanggan untuk menerima pesan WhatsApp. Pengingat memakai template pesan yang sudah disetujui, sesuai ketentuan WhatsApp untuk pesan yang dimulai bisnis atau dikirim di luar jendela layanan 24 jam.
- FAQ 3 jawaban: ...disesuaikan dengan cara kerja usaha Anda.

**Tahap 1**
FAQ 1 penting secara hukum dan teknis. Isinya dipertahankan tanpa nama platform.

**Sesudah**
- FAQ 1: Apa syarat mengirim pengingat lewat aplikasi chat? / Minta izin pelanggan lebih dulu untuk menerima pesan dari usahamu. Pengingat memakai template pesan yang sudah disetujui penyedia aplikasi chat, karena pesan yang dimulai usaha atau dikirim lebih dari 24 jam setelah pesan terakhir pelanggan wajib memakai template.
- FAQ 3 jawaban: Bisa. Jumlah tahap, jaraknya dari jatuh tempo, dan isi pesannya disesuaikan dengan cara kerja usahamu.

**Alasan**
"Jendela layanan 24 jam" diganti penjelasan biasa supaya tidak ambigu. Fakta aturannya tetap.

## 4.4 pengingat-tagihan: Tonton

**Sebelum**
- Adegan 8 judul: Tim tahu tagihan mana yang perlu ditindaklanjuti.
- Adegan 9 judul: Mau pengingat tagihan mengikuti jadwal usaha Anda?

**Tahap 1**
Adegan lain tetap.

**Sesudah**
- Adegan 8 judul: Staf tahu tagihan mana yang perlu ditindaklanjuti.
- Adegan 9 judul: Mau pengingat tagihan mengikuti jadwal usahamu?

**Alasan**
Hanya istilah.

---

# 5. rekap-penjualan (Siap dibuat)

## 5.1 rekap-penjualan: title tag dan meta description

**Sebelum**
- Title: Rekap penjualan harian tanpa hitung manual | Kreatekno Solusi
- Description: diambil dari `answer` (303 karakter)

**Tahap 1**
Kueri terdekat: "rekap penjualan harian otomatis", "laporan penjualan dari Google Sheets ke WhatsApp". Pembeda: angka dihitung dulu, AI hanya menulis kalimat.

**Sesudah**
- Title opsi A (utama): Rekap Penjualan Harian Otomatis ke WhatsApp Pemilik | Kreatekno
- Title opsi B: Laporan Penjualan Harian dari Google Sheets, Tanpa Hitung Manual | Kreatekno
- Description: Setiap malam angka di Google Sheets dijumlahkan dan dibandingkan dengan kemarin dan minggu lalu, lalu dikirim ke WhatsApp pemilik. AI hanya menulis kalimatnya.

**Alasan**
Kalimat terakhir menjawab keraguan "angka dari AI bisa dipercaya?". Opsi A 63 karakter, opsi B 76 karakter dan berisiko dipotong. Description 159 karakter.

## 5.2 rekap-penjualan: H1, pertanyaan, jawaban, ringkasan

**Sebelum**
- H1: Rekap penjualan harian tanpa hitung manual
- Jawaban: Setiap malam angka dari tabel penjualan staf dijumlahkan per hari, produk, dan wilayah. ...

**Tahap 1**
Sudah sesuai aturan.

**Sesudah**
Tetap.

**Alasan**
Jawaban sudah menyebut bahwa angka dihitung sebelum AI menulis.

## 5.3 rekap-penjualan: isi mode Baca

**Sebelum**
- painsLead: ...Pemilik baru tahu angka penjualan setelah admin selesai menghitung keesokan harinya, dan laporan mingguan sering terlambat karena admin sibuk dengan pesanan.
- pains 1: Pemilik baru tahu angka penjualan setelah admin selesai menghitung.
- compare 1 sebelum: Menunggu admin
- FAQ 2: Apakah rekap malam boleh dikirim lewat WhatsApp? / Pemilik menyetujui penerimaan rekap lewat WhatsApp. Pesan terjadwal memakai template yang disetujui. Balasan bebas untuk pertanyaan pemilik mengikuti jendela layanan 24 jam sejak pesan terakhir dari pemilik.

**Tahap 1**
Istilah dan nama platform.

**Sesudah**
- painsLead: Distributor minuman mencatat pengiriman ke puluhan toko setiap hari dalam satu tabel. Pemilik baru tahu angka penjualan setelah staf selesai menghitung keesokan harinya, dan laporan mingguan sering terlambat karena staf sibuk dengan pesanan.
- pains 1: Pemilik baru tahu angka penjualan setelah staf selesai menghitung.
- compare 1 sebelum: Menunggu staf
- FAQ 2: Apakah rekap malam boleh dikirim lewat aplikasi chat? / Boleh, asalkan pemilik setuju menerimanya. Rekap terjadwal memakai template pesan yang sudah disetujui. Pertanyaan balik dari pemilik dijawab bebas selama masih dalam 24 jam sejak pesan terakhir pemilik.

**Alasan**
FAQ 2 dibuka dengan jawaban "Boleh" supaya langsung menjawab pertanyaan.

## 5.4 rekap-penjualan: Tonton

**Sebelum**
- Adegan 5 judul: Nita menerima satu rekap di WhatsApp.
- Adegan 7 isi: Utara tercatat 140 karton dan Selatan 100. Balasan menyebut tab Sheets Rekap produk Oktober sebagai sumber.

**Tahap 1**
Nama platform.

**Sesudah**
- Adegan 5 judul: Nita menerima satu rekap di chat.
- Adegan 7 isi: Utara tercatat 140 karton dan Selatan 100. Balasan menyebut tab Rekap produk Oktober di tabel penjualan sebagai sumber.

**Alasan**
Adegan lain tetap.

---

# 6. followup-prospek (Siap dibuat)

## 6.1 followup-prospek: title tag dan meta description

**Sebelum**
- Title: Calon pembeli properti tidak lagi lupa di-follow-up | Kreatekno Solusi
- Description: diambil dari `answer` (334 karakter)

**Tahap 1**
Kueri terdekat: "follow up prospek properti", "cara follow up calon pembeli rumah". Pembeda: draf pesan menyambung chat terakhir, dikirim staf sendiri.

**Sesudah**
- Title opsi A (utama): Follow-up Prospek Properti Otomatis dengan Draf Pesan AI | Kreatekno
- Title opsi B: Calon Pembeli Properti Tidak Lagi Lupa Di-follow-up | Kreatekno
- Description: Setiap pagi, prospek properti yang diam lebih dari tiga hari dipilih dari tabel, lalu AI menulis draf pesan dari chat terakhirnya untuk dikirim staf marketing.

**Alasan**
Opsi A 68 karakter. Description 159 karakter.

## 6.2 followup-prospek: H1, pertanyaan, jawaban, ringkasan

**Sebelum**
- H1: Calon pembeli properti tidak lagi lupa di-follow-up
- Pertanyaan: Bagaimana tim marketing properti menindaklanjuti setiap calon pembeli tepat waktu?
- Jawaban: ...Tim marketing menerima pengingat beserta drafnya, lalu mengirimnya dari nomor tim sendiri.

**Tahap 1**
H1 tetap. Pertanyaan dan jawaban memakai "tim".

**Sesudah**
- H1 opsi A (utama): tetap
- H1 opsi B: Setiap calon pembeli properti dihubungi lagi tepat waktu
- Pertanyaan: Bagaimana staf marketing properti menindaklanjuti setiap calon pembeli tepat waktu?
- Jawaban: Setiap pagi, tabel prospek dibaca dan disaring: hanya calon pembeli yang masih menunggu dan sudah diam lebih dari tiga hari. Untuk setiap prospek itu, AI menulis satu pesan pendek yang menyambung chat terakhirnya, misalnya unit yang diminati dan alasan menunda. Staf marketing menerima pengingat beserta drafnya, lalu mengirimnya dari nomor kantor yang sudah dikenal prospek.

**Alasan**
"Nomor kantor yang sudah dikenal prospek" menjelaskan kenapa pesan tidak dikirim otomatis. Kata naik dari 56 ke 58.

## 6.3 followup-prospek: isi mode Baca

**Sebelum**
- painsLead: ...dan tim marketing harus ingat sendiri kapan menghubungi lagi. ...
- pains 2: Tim tidak tahu prospek mana yang sudah terlalu lama diam.
- built.h: Satu pengecekan pagi yang menyiapkan follow-up untuk tim
- built.lead: Tim cukup mengisi satu tabel prospek ... dan tim menerima draf pesan yang siap dikirim.
- built.points 5: Draf dikirim ke tim marketing, yang mengirimnya dari nomor tim sendiri.
- quote.by: Tim marketing perumahan
- steps 1 isi: Tim mengisi nama, ringkasan chat, dan status ...
- steps 4: Tim menghubungi / Tim marketing mengirim draf dari nomor tim, dan status prospek diperbarui.
- fit 2: Tim marketing yang sudah mencatat prospek, ...
- FAQ 1 jawaban: Dalam rancangan ini tidak. Draf dikirim ke tim marketing, yang mengirimnya dari nomor tim. Pengiriman langsung ke calon pembeli hanya bisa memakai template pesan yang sudah disetujui, karena aturan WhatsApp Business membatasi pesan ke pelanggan yang lebih dari sehari tidak membalas.
- FAQ 3 jawaban: ...disesuaikan dengan cara kerja tim Anda.

**Tahap 1**
Istilah dan nama platform. FAQ 1 juga memakai "langsung" yang rawan ambigu.

**Sesudah**
- painsLead: Banyak calon pembeli tidak langsung memutuskan setelah survei lokasi. Mereka minta waktu untuk berdiskusi atau menunggu cicilan, dan staf marketing harus ingat sendiri kapan menghubungi lagi. Di tengah chat baru setiap hari, prospek yang diam mudah terlupa.
- pains 2: Staf tidak tahu prospek mana yang sudah terlalu lama diam.
- built.h: Satu pengecekan pagi yang menyiapkan follow-up untuk staf
- built.lead: Staf cukup mengisi satu tabel prospek setelah chat atau survei lokasi. Setiap pagi, tabel itu dibaca, prospek yang perlu disapa dipilih, dan staf menerima draf pesan yang siap dikirim.
- built.points 5: Draf dikirim ke staf marketing, yang mengirimnya dari nomor kantor.
- quote.by: Staf marketing perumahan
- steps 1 isi: Staf mengisi nama, ringkasan chat, dan status setelah chat atau survei lokasi.
- steps 4: Staf menghubungi / Staf marketing mengirim draf dari nomor kantor, dan status prospek diperbarui.
- fit 2: Staf marketing yang sudah mencatat prospek, atau siap mulai mencatat di satu tabel.
- FAQ 1 jawaban: Dalam rancangan ini tidak. Draf dikirim ke staf marketing, yang mengirimnya dari nomor kantor. Kalau pesan dikirim otomatis ke calon pembeli, pesannya wajib memakai template yang sudah disetujui, karena aplikasi chat untuk bisnis membatasi pesan ke pelanggan yang lebih dari sehari tidak membalas.
- FAQ 3 jawaban: Bisa. Batas hari dan jam pengecekan disesuaikan dengan cara kerja stafmu.

**Alasan**
"Langsung" di painsLead tetap karena hanya menempel ke satu kata kerja ("memutuskan").

## 6.4 followup-prospek: Tonton

**Sebelum**
- Adegan 1 isi: Tim marketing mengandalkan ingatan. ...
- Adegan 2 isi: Tim tidak perlu mengingat siapa yang harus dihubungi. ...
- Adegan 3 isi: Tabel prospek diisi tim setelah chat atau survei lokasi. ...
- Adegan 6: Langkah 5 · Draf ke tim / Tim marketing menerima pengingat dan draf pesan, lalu mengirimnya sendiri. / Pesan dikirim dari nomor tim yang sudah dikenal prospek. Tim masih bisa mengubah draf sebelum mengirim.
- Adegan 8: Setiap pagi, tim tahu siapa yang perlu dihubungi. / ...belum dipakai tim penjualan properti.
- Adegan 9: Untuk bisnis Anda / ... / Ceritakan cara tim Anda mencatat prospek sekarang. ...

**Tahap 1**
Adegan 4, 5, 7 tetap.

**Sesudah**
- Adegan 1 isi: Staf marketing mengandalkan ingatan. Setelah survei lokasi, prospek yang belum memberi kabar tenggelam di antara chat baru.
- Adegan 2 isi: Staf tidak perlu mengingat siapa yang harus dihubungi. Pengecekan berjalan sendiri setiap hari.
- Adegan 3 isi: Tabel prospek diisi staf setelah chat atau survei lokasi. Ringkasan chat terakhir menjadi bahan pesan berikutnya.
- Adegan 6: Langkah 5 · Draf ke staf / Staf marketing menerima pengingat dan draf pesan, lalu mengirimnya sendiri. / Pesan dikirim dari nomor kantor yang sudah dikenal prospek. Staf masih bisa mengubah draf sebelum mengirim.
- Adegan 8: Setiap pagi, staf tahu siapa yang perlu dihubungi. / Angka yang tampil adalah contoh, karena sistem ini belum dipakai usaha properti.
- Adegan 9: Untuk usahamu / Mau setiap calon pembeli dihubungi tepat waktu? (tetap) / Ceritakan cara stafmu mencatat prospek sekarang. Kami bantu petakan solusinya, gratis.

**Alasan**
Panjang adegan sama.

---

# 7. carousel-konten (Siap dibuat)

## 7.1 carousel-konten: title tag dan meta description

**Sebelum**
- Title: Carousel konten dari satu topik | Kreatekno Solusi
- Description: diambil dari `answer` (398 karakter)

**Tahap 1**
Kueri terdekat: "buat carousel Instagram dengan AI", "carousel otomatis".

**Sesudah**
- Title opsi A (utama): Buat Carousel Instagram dengan AI dari Satu Topik | Kreatekno
- Title opsi B: Draf Carousel dan Caption Otomatis dengan Bingkai Brand | Kreatekno
- Description: Tulis satu topik di tabel, lalu AI menyusun slide carousel di atas bingkai brand, lengkap dengan caption. Draf menunggu dicek staf sebelum diposting.

**Alasan**
Opsi A 61 karakter. Description 149 karakter.

## 7.2 carousel-konten: H1, pertanyaan, jawaban, ringkasan

**Sebelum**
- H1: Carousel konten dari satu topik
- Summary: Anda menulis satu topik di tabel. Slide dan caption dibuat dengan bingkai brand Anda, lalu dikirim untuk dicek.
- Jawaban: Anda menulis judul, isi singkat, dan jenis konten di satu tabel: berita, edukasi, atau promosi. ...lengkap dengan logo dan warna Anda. Caption ikut ditulis. Hasilnya disimpan di satu folder, dikirim ke grup tim, dan menunggu dicek sebelum diposting.

**Tahap 1**
H1 terlalu pendek untuk menjelaskan hasil (draf yang siap dicek).

**Sesudah**
- H1 opsi A (utama, dipilih): Draf carousel lengkap dengan caption dari satu topik [perlu dicek di tampilan]
- H1 opsi B: tetap
- Summary: Kamu menulis satu topik di tabel. Slide dan caption dibuat dengan bingkai brandmu, lalu dikirim untuk dicek. (18 kata)
- Jawaban: Kamu menulis judul, isi singkat, dan jenis konten di satu tabel: berita, edukasi, atau promosi. AI menyusun isi setiap slide, dari pembuka yang menarik sampai ajakan di slide terakhir, lalu membuat gambarnya di atas bingkai brand yang sama, lengkap dengan logo dan warnamu. Caption ikut ditulis. Hasilnya disimpan di satu folder, dikirim ke grup staf, dan menunggu dicek sebelum diposting.

**Alasan**
Opsi A menyebut apa yang diterima pembaca. Jawaban hanya berubah istilah.

## 7.3 carousel-konten: isi mode Baca

**Sebelum**
- built.lead: Tim cukup mengisi topik di tabel. ...
- built.points 4: ...dengan logo dan warna Anda.
- built.points 6: ...mengirimnya ke grup tim, ...
- quote.by: Tim marketing brand kopi
- steps 1 judul: Anda menulis topik
- steps 4 judul: Anda mengecek
- FAQ 1 jawaban: Tidak. Setiap carousel menunggu dicek dan disetujui tim sebelum diposting.

**Tahap 1**
Hanya istilah.

**Sesudah**
- built.lead: Staf cukup mengisi topik di tabel. Isi slide, gambar, dan caption disiapkan dengan gaya brand yang sama, lalu dikumpulkan untuk dicek.
- built.points 4: Membuat gambar setiap slide di atas bingkai brand yang sama, dengan logo dan warnamu.
- built.points 6: Menyimpan hasil ke satu folder, mengirimnya ke grup staf, dan menandai statusnya siap dicek.
- quote.by: Staf marketing brand kopi
- steps 1 judul: Kamu menulis topik
- steps 4 judul: Kamu mengecek
- FAQ 1 jawaban: Tidak. Setiap carousel menunggu dicek dan disetujui staf sebelum diposting.

**Alasan**
Langkah 1 dan 4 tetap menunjukkan bahwa pembaca hanya mengerjakan awal dan akhir.

## 7.4 carousel-konten: Tonton

**Sebelum**
- Intro: Ikuti satu topik dari tabel konten sampai tim Kopi Contoh menerima draf carousel lengkap.
- Adegan 7 judul: Draf sampai ke tim dan menunggu dicek.
- Adegan 8 isi: Tim mendapat slide dengan bingkai yang sama dan caption dalam satu folder.

**Tahap 1**
Adegan 9 sudah memakai "kamu".

**Sesudah**
- Intro: Ikuti satu topik dari tabel konten sampai staf Kopi Contoh menerima draf carousel lengkap.
- Adegan 7 judul: Draf sampai ke staf dan menunggu dicek.
- Adegan 8 isi: Staf mendapat slide dengan bingkai yang sama dan caption dalam satu folder.

**Alasan**
Hanya istilah.

---

# 8. asisten-sop (Siap dibuat)

## 8.1 asisten-sop: title tag dan meta description

**Sebelum**
- Title: Staf baru menemukan jawaban SOP sendiri | Kreatekno Solusi
- Description: diambil dari `answer` (344 karakter)

**Tahap 1**
Kueri terdekat: "chatbot SOP karyawan", "bot Telegram internal perusahaan". Slug `asisten-sop` memuat "asisten". Mengganti URL bukan pekerjaan copy, jadi dicatat di Keputusan.

**Sesudah**
- Title opsi A (utama): Bot SOP untuk Staf, Jawaban dari Dokumen Perusahaan | Kreatekno
- Title opsi B: Chatbot SOP Karyawan di Telegram, Lengkap dengan Sumbernya | Kreatekno
- Description: Staf bertanya lewat bot Telegram internal dan dijawab dari SOP perusahaan, lengkap dengan dokumen dan bagiannya. Di luar SOP diarahkan ke penanggung jawab.

**Alasan**
Opsi A 63 karakter. Description 155 karakter.

## 8.2 asisten-sop: H1, pertanyaan, jawaban, ringkasan

**Sebelum**
- H1: Staf baru menemukan jawaban SOP sendiri
- Summary: Staf bertanya lewat chat dengan bahasa sehari-hari dan mendapat jawaban dari SOP Anda, lengkap dengan bagian sumbernya.
- Jawaban: Dokumen SOP yang sudah Anda punya dijadikan basis pengetahuan. Staf bertanya lewat chat dengan bahasa sehari-hari, dan asisten menjawab dari SOP itu, lengkap dengan judul dokumen dan bagiannya. Jika SOP belum mencakup pertanyaannya, asisten menyarankan staf menghubungi penanggung jawab. Dalam rancangan, topik tersebut bisa dicatat sebagai bahan perbaikan SOP.

**Tahap 1**
H1 tetap.

**Sesudah**
- H1: tetap
- Summary: Staf bertanya lewat chat dengan bahasa sehari-hari dan mendapat jawaban dari SOP-mu, lengkap dengan bagian sumbernya. (17 kata)
- Jawaban: Dokumen SOP yang sudah kamu punya dijadikan basis pengetahuan. Staf bertanya lewat chat dengan bahasa sehari-hari, dan AI menjawab dari SOP itu, lengkap dengan judul dokumen dan bagiannya. Jika SOP belum mencakup pertanyaannya, AI menyarankan staf menghubungi penanggung jawab. Dalam rancangan, topik tersebut bisa dicatat sebagai bahan perbaikan SOP.

**Alasan**
Hanya istilah.

## 8.3 asisten-sop: isi mode Baca

**Sebelum**
- built.lead: Dokumen SOP Anda diproses menjadi basis pengetahuan. ...
- built.points 3: Menjawab hanya dari SOP Anda, ...
- steps 3 judul: Jawaban dari SOP Anda
- steps 4 isi: Jika belum tercakup, asisten memberi tahu staf siapa yang bisa dihubungi. ...
- compare 1 sesudah: Asisten, dari SOP
- FAQ 1 jawaban: Asisten menyarankan staf menghubungi penanggung jawab. Dalam rancangan, pertanyaan yang belum terjawab bisa dicatat di Sheets untuk membantu tim melengkapi SOP.
- FAQ 3: Kenapa lewat Telegram? / Bot Telegram mudah dibuat untuk pemakaian internal dan bisa dibatasi hanya untuk staf. Kanal lain bisa dipakai bila diperlukan.

**Tahap 1**
FAQ 3 seluruhnya tentang nama platform. Pertanyaannya tetap berguna (kenapa tidak di aplikasi chat yang biasa dipakai pelanggan), jadi diubah ke bentuk umum.

**Sesudah**
- built.lead: Dokumen SOP-mu diproses menjadi basis pengetahuan. Staf bertanya lewat chat, dan setiap jawaban menyebut dokumen dan bagian yang dipakai, sehingga mudah dicek.
- built.points 3: Menjawab hanya dari SOP-mu, dengan bahasa sopan dan langkah yang berurutan.
- steps 3 judul: Jawaban dari SOP-mu
- steps 4 isi: Jika belum tercakup, AI memberi tahu staf siapa yang bisa dihubungi. Dalam rancangan, topiknya bisa dicatat untuk melengkapi SOP.
- compare 1 sesudah: AI, dari SOP
- FAQ 1 jawaban: AI menyarankan staf menghubungi penanggung jawab. Dalam rancangan, pertanyaan yang belum terjawab bisa dicatat di tabel untuk membantu melengkapi SOP.
- FAQ 3: Kenapa memakai bot chat khusus staf? / Bot di aplikasi chat terpisah mudah dibuat untuk pemakaian internal dan bisa dibatasi hanya untuk staf. Aplikasi chat lain bisa dipakai bila diperlukan.

**Alasan**
Nama aplikasinya tetap terlihat di bagian "Aplikasi yang dipakai", sesuai keputusan pengecualian.

## 8.4 asisten-sop: Tonton

**Sebelum**
- Adegan 2 judul: Tim memilih SOP Pendaftaran Pasien dari Drive.
- Adegan 4 judul: Wulan bertanya lewat Telegram.
- Adegan 5 judul: Asisten menjelaskan cara menandai kehadiran.
- Adegan 6 isi: ...Asisten memberi arahan, lalu Wulan menghubungi kepala cabang.
- Adegan 7 isi: Dalam rancangan, topik kedatangan di cabang lain masuk ke Sheets sebagai bahan untuk melengkapi SOP.

**Tahap 1**
Adegan lain tetap.

**Sesudah**
- Adegan 2 judul: Staf memilih SOP Pendaftaran Pasien dari folder bersama.
- Adegan 4 judul: Wulan bertanya lewat bot chat staf.
- Adegan 5 judul: AI menjelaskan cara menandai kehadiran.
- Adegan 6 isi: Kalau pasien datang ke cabang lain dari jadwal? Bagian itu belum tercakup. AI memberi arahan, lalu Wulan menghubungi kepala cabang.
- Adegan 7 isi: Dalam rancangan, topik kedatangan di cabang lain masuk ke tabel sebagai bahan untuk melengkapi SOP.

**Alasan**
Adegan 2 dan 4 bertambah satu sampai dua kata [perlu dicek di tampilan].

---

# 9. stok-menipis (Siap dibuat)

## 9.1 stok-menipis: title tag dan meta description

**Sebelum**
- Title: Peringatan stok menipis sebelum habis | Kreatekno Solusi
- Description: diambil dari `answer` (281 karakter)

**Tahap 1**
Kueri terdekat: "notifikasi stok menipis otomatis", "reminder stok habis Google Sheets".

**Sesudah**
- Title opsi A (utama): Notifikasi Stok Menipis Otomatis ke WhatsApp | Kreatekno
- Title opsi B: Peringatan Stok Menipis dari Google Sheets Sebelum Habis | Kreatekno
- Description: Barang masuk dan keluar dicatat lewat form, stok di Google Sheets diperbarui, dan staf pembelian menerima peringatan WhatsApp saat stok di bawah batas minimum.

**Alasan**
Opsi A 56 karakter. Description 159 karakter.

## 9.2 stok-menipis: H1, pertanyaan, jawaban, ringkasan

**Sebelum**
- H1: Peringatan stok menipis sebelum habis
- Jawaban: ...Saat stok turun di bawah batas minimum yang Anda tentukan, ...

**Tahap 1**
H1 tetap.

**Sesudah**
- H1: tetap
- Jawaban: Setiap barang masuk dan keluar dicatat lewat form singkat, lalu tabel stok diperbarui. Saat stok turun di bawah batas minimum yang kamu tentukan, staf pembelian menerima peringatan berisi nama barang, sisa stok, dan batas minimumnya. Staf menentukan jumlah dan waktu pemesanan ulang.

**Alasan**
Hanya istilah.

## 9.3 stok-menipis: isi mode Baca

**Sebelum**
- metrics 1 label: minimum per barang, Anda yang menentukan
- FAQ 1 jawaban: Data bisa diambil dari ekspor aplikasi kasir Anda, sehingga staf tidak mencatat dua kali.

**Tahap 1**
Hanya istilah.

**Sesudah**
- metrics 1 label: minimum per barang, kamu yang menentukan
- FAQ 1 jawaban: Data bisa diambil dari ekspor aplikasi kasirmu, sehingga staf tidak mencatat dua kali.

**Alasan**
Panjang sama.

## 9.4 stok-menipis: Tonton

**Sebelum**
- Adegan 5 judul: Rina menerima peringatan di WhatsApp.
- Adegan 8 judul: Tim bisa melihat perubahan stok dan menindaklanjuti peringatan.
- Adegan 9 judul: Mau tim tahu saat stok turun di bawah minimum?

**Tahap 1**
Adegan lain tetap.

**Sesudah**
- Adegan 5 judul: Rina menerima peringatan di chat.
- Adegan 8 judul: Staf bisa melihat perubahan stok dan menindaklanjuti peringatan.
- Adegan 9 judul: Mau stafmu tahu saat stok turun di bawah minimum?

**Alasan**
Hanya istilah.

---

# 10. ulasan-pelanggan (Siap dibuat)

## 10.1 ulasan-pelanggan: title tag dan meta description

**Sebelum**
- Title: Keluhan pelanggan terkumpul di satu tempat | Kreatekno Solusi
- Description: diambil dari `answer` (383 karakter)

**Tahap 1**
Kueri terdekat: "rekap keluhan pelanggan", "cara mengelola ulasan pelanggan restoran".

**Sesudah**
- Title opsi A (utama): Rekap Keluhan dan Ulasan Pelanggan Mingguan Otomatis | Kreatekno
- Title opsi B: Kumpulkan Keluhan Pelanggan dari Banyak Kanal di Satu Tabel | Kreatekno
- Description: Masukan dari formulir, chat, dan email terkumpul di satu tabel tanpa catatan ganda. Pemilik menerima ringkasan keluhan dan pujian teratas setiap minggu.

**Alasan**
Opsi A 64 karakter. Description 152 karakter.

## 10.2 ulasan-pelanggan: H1, pertanyaan, jawaban, ringkasan

**Sebelum**
- H1: Keluhan pelanggan terkumpul di satu tempat
- Lainnya: tanpa istilah terlarang

**Tahap 1**
Sudah sesuai.

**Sesudah**
Tetap.

**Alasan**
Jawaban sudah menyebut kanal yang tercakup dan bahwa staf yang menindaklanjuti.

## 10.3 ulasan-pelanggan: isi mode Baca

**Sebelum**
- FAQ 2 jawaban: Mulai dari formulir saran, chat layanan, dan email milik usaha Anda. ...

**Tahap 1**
Hanya istilah.

**Sesudah**
- FAQ 2 jawaban: Mulai dari formulir saran, chat layanan, dan email milik usahamu. Sumber eksternal dapat ditambahkan bila tersedia akses dan ketentuan sumber mengizinkan data diolah serta diringkas.

**Alasan**
Batas sumber eksternal dipertahankan.

## 10.4 ulasan-pelanggan: Tonton

**Sebelum**
- Adegan 7 isi: Ringkasan 16–22 Nov membandingkan minggu sebelumnya. ...
- Adegan 8 judul: Tim tahu topik yang perlu diperbaiki dan ulasan yang perlu dibalas.

**Tahap 1**
Tanda pisah di rentang tanggal.

**Sesudah**
- Adegan 7 isi: Ringkasan 16 sampai 22 Nov membandingkan minggu sebelumnya. Keluhan waktu tunggu Cabang 2 naik dari satu ke tiga. Fajar menambah satu staf pada jam makan siang.
- Adegan 8 judul: Staf tahu topik yang perlu diperbaiki dan ulasan yang perlu dibalas.

**Alasan**
Adegan lain tetap.

---

# 11. catat-pengeluaran (Siap dibuat)

## 11.1 catat-pengeluaran: title tag dan meta description

**Sebelum**
- Title: Nota belanja tercatat cukup dengan satu foto | Kreatekno Solusi
- Description: diambil dari `answer` (300 karakter)

**Tahap 1**
Kueri terdekat: "catat pengeluaran dari foto nota", "pencatatan pengeluaran usaha lewat WhatsApp".

**Sesudah**
- Title opsi A (utama): Catat Pengeluaran dari Foto Nota via WhatsApp | Kreatekno
- Title opsi B: Pencatatan Pengeluaran Usaha Otomatis dari Foto Nota | Kreatekno
- Description: Kirim foto nota, ketikan, atau pesan suara ke WhatsApp usaha. AI mencatat toko, tanggal, total, dan kategori ke Google Sheets, lalu rekapnya dikirim tiap pagi.

**Alasan**
Opsi A 57 karakter. Description 159 karakter.

## 11.2 catat-pengeluaran: H1, pertanyaan, jawaban, ringkasan

**Sebelum**
- H1: Nota belanja tercatat cukup dengan satu foto
- Lainnya: tanpa istilah terlarang

**Tahap 1**
Sudah sesuai.

**Sesudah**
Tetap.

**Alasan**
Jawaban sudah lengkap dengan batas (total tidak terbaca diminta ulang).

## 11.3 catat-pengeluaran: isi mode Baca

**Sebelum**
- built.points 3: Mengelompokkan pengeluaran ke kategori yang Anda tentukan, ...

**Tahap 1**
Hanya istilah.

**Sesudah**
- built.points 3: Mengelompokkan pengeluaran ke kategori yang kamu tentukan, misalnya bahan baku, operasional, dan kemasan.

**Alasan**
Panjang sama.

## 11.4 catat-pengeluaran: Tonton

**Sebelum**
- Adegan 4 isi: ...Kategorinya dipilih dari daftar yang Anda tentukan, misalnya bahan baku.
- Adegan 9: Untuk bisnis Anda / ... / Ceritakan cara usaha Anda mencatat pengeluaran sekarang. ...

**Tahap 1**
Hanya istilah.

**Sesudah**
- Adegan 4 isi: Nama toko, tanggal, dan total diambil dari nota. Kategorinya dipilih dari daftar yang kamu tentukan, misalnya bahan baku.
- Adegan 9: Untuk usahamu / Mau nota belanja tidak lagi menumpuk? (tetap) / Ceritakan cara usahamu mencatat pengeluaran sekarang. Kami bantu petakan solusinya, gratis.

**Alasan**
Panjang sama.

---

# 12. balas-komentar (Siap dibuat)

## 12.1 balas-komentar: title tag dan meta description

**Sebelum**
- Title: Komentar "harga?" tidak ada yang terlewat | Kreatekno Solusi
- Description: diambil dari `answer` (322 karakter)

**Tahap 1**
Kueri terdekat: "auto reply komentar Instagram", "kirim DM otomatis dari komentar".

**Sesudah**
- Title opsi A (utama): Auto Reply Komentar Instagram dan DM Katalog | Kreatekno
- Title opsi B: Balas Komentar "Harga?" Otomatis dan Kirim Katalog | Kreatekno
- Description: Komentar Instagram berisi kata kunci seperti "harga" dibalas singkat, dan penulisnya menerima satu DM berisi katalog. Komentar lain tetap dibalas staf.

**Alasan**
Opsi A 56 karakter. Description 151 karakter.

## 12.2 balas-komentar: H1, pertanyaan, jawaban, ringkasan

**Sebelum**
- H1: Komentar "harga?" tidak ada yang terlewat
- Lainnya: tanpa istilah terlarang

**Tahap 1**
H1 sudah memakai kata yang diketik calon pembeli.

**Sesudah**
Tetap.

**Alasan**
Jawaban sudah menyebut jarak pengecekan dan peran staf.

## 12.3 balas-komentar: isi mode Baca

**Sebelum**
- painsLead: ...Admin membalasnya satu per satu di sela mengemas pesanan, ...
- built.lead: Anda menentukan kata kunci dan isi pesannya satu kali. ...
- built.points 1: Mengecek komentar baru di postingan yang Anda pilih setiap 15 menit.
- quote: "Waktu peluncuran koleksi, komentar bisa ratusan. Sekarang setiap orang yang bertanya harga sudah menerima katalog, tanpa admin membalas satu per satu." Admin toko hijab online
- steps 2 isi: Hanya komentar dengan kata kunci pilihan Anda yang belum pernah dibalas.
- compare 1 sebelum: Menunggu admin sempat
- FAQ 1 jawaban: Tidak. Hanya komentar yang berisi kata kunci pilihan Anda. ...
- FAQ 2 jawaban: Satu pesan untuk setiap komentar, paling lambat tujuh hari setelah komentar dibuat, sesuai aturan Instagram. ...

**Tahap 1**
Kutipan contoh disunting sesuai keputusan.

**Sesudah**
- painsLead: Setiap koleksi baru diunggah, kolom komentar penuh pertanyaan "harga?" dan "ready kak?". Staf membalasnya satu per satu di sela mengemas pesanan, dan komentar yang masuk malam hari baru terbaca besok pagi.
- built.lead: Kamu menentukan kata kunci dan isi pesannya satu kali. Setelah itu setiap komentar yang cocok dibalas dan penulisnya menerima katalog, sementara staf menangani obrolan yang berlanjut.
- built.points 1: Mengecek komentar baru di postingan yang kamu pilih setiap 15 menit.
- quote: "Waktu peluncuran koleksi, komentar bisa ratusan. Sekarang setiap orang yang bertanya harga sudah menerima katalog, tanpa staf membalas satu per satu." Staf toko hijab online
- steps 2 isi: Hanya komentar dengan kata kunci pilihanmu yang belum pernah dibalas.
- compare 1 sebelum: Menunggu staf sempat
- FAQ 1 jawaban: Tidak. Hanya komentar yang berisi kata kunci pilihanmu. Komentar lain dan keluhan tetap dibalas staf.
- FAQ 2 jawaban: Satu pesan untuk setiap komentar, paling lambat tujuh hari setelah komentar dibuat, sesuai aturan media sosialnya. Kalau calon pembeli membalas, obrolan bisa berlanjut seperti biasa.

**Alasan**
Batas tujuh hari tetap disebut karena itu syarat yang menentukan.

## 12.4 balas-komentar: Tonton

**Sebelum**
Tanpa istilah terlarang. Adegan 9 sudah memakai "kamu".

**Tahap 1**
Sudah sesuai.

**Sesudah**
Tetap.

**Alasan**
Tidak ada perubahan.

---

# 13. faktur-pemasok (Siap dibuat)

## 13.1 faktur-pemasok: title tag dan meta description

**Sebelum**
- Title: Faktur pemasok tercatat dan dicek sebelum dibayar | Kreatekno Solusi
- Description: diambil dari `answer` (345 karakter)

**Tahap 1**
Kueri terdekat: "cek faktur pemasok", "otomatis input faktur ke Excel atau Google Sheets".

**Sesudah**
- Title opsi A (utama): Cek Faktur Pemasok Otomatis Sebelum Dibayar | Kreatekno
- Title opsi B: Input Faktur Pemasok Otomatis dari Email ke Google Sheets | Kreatekno
- Description: Faktur dari email atau folder dibaca AI, dicocokkan dengan daftar harga pemasok, dan selisihnya ditandai. Pemilik menyetujui atau menolak bayar lewat tombol.

**Alasan**
Opsi A 55 karakter. Description 157 karakter.

## 13.2 faktur-pemasok: H1, pertanyaan, jawaban, ringkasan

**Sebelum**
- H1: Faktur pemasok tercatat dan dicek sebelum dibayar
- Lainnya: tanpa istilah terlarang

**Tahap 1**
Sudah sesuai.

**Sesudah**
Tetap.

**Alasan**
Jawaban sudah menyebut keenam kolom dan tombol persetujuan.

## 13.3 faktur-pemasok: isi mode Baca

**Sebelum**
- painsLead: ...Staf admin mengetik ulang setiap faktur ke tabel, ...
- fit 2: Tim keuangan yang sudah punya daftar harga pemasok.
- FAQ 1 jawaban: ...Pembayaran tetap dilakukan tim keuangan.

**Tahap 1**
Hanya istilah.

**Sesudah**
- painsLead: Toko bangunan menerima faktur dari belasan pemasok setiap minggu: semen, besi, cat, dan keramik. Staf mengetik ulang setiap faktur ke tabel, dan kenaikan harga beberapa ratus rupiah per sak sering baru ketahuan setelah faktur dibayar.
- fit 2: Bagian keuangan yang sudah punya daftar harga pemasok.
- FAQ 1 jawaban: Tidak. Faktur hanya dicatat dan dimintakan persetujuan. Pembayaran tetap dilakukan bagian keuangan.

**Alasan**
Panjang sama atau berkurang.

## 13.4 faktur-pemasok: Tonton

**Sebelum**
- Adegan 1 isi: Saat admin mengetik ulang banyak faktur, ...
- Adegan 4 isi: ...sehingga admin bisa memeriksanya di satu tempat.
- Adegan 7 isi: ...Admin bisa meminta faktur koreksi, ...
- Adegan 8 isi: Admin bisa melihat angka yang diperiksa ...

**Tahap 1**
Hanya istilah.

**Sesudah**
- Adegan 1 isi: Saat staf mengetik ulang banyak faktur, harga semen yang berubah bisa luput sampai faktur dibayar.
- Adegan 4 isi: Data FP-028 masuk ke kolom yang sama dengan faktur pemasok lain, sehingga staf bisa memeriksanya di satu tempat.
- Adegan 7 isi: Tabel mencatat status Ditolak · perlu koreksi. Staf bisa meminta faktur koreksi, dan bagian keuangan menangani pembayaran setelah ada persetujuan.
- Adegan 8 isi: Staf bisa melihat angka yang diperiksa dan keputusan pemilik tanpa mencari percakapan lama.

**Alasan**
Panjang sama.

---

# 14. layanan-sdm (Siap dibuat)

## 14.1 layanan-sdm: title tag dan meta description

**Sebelum**
- Title: Cuti dan pertanyaan karyawan terjawab lewat chat | Kreatekno Solusi
- Description: diambil dari `answer` (365 karakter)

**Tahap 1**
Kueri terdekat: "pengajuan cuti lewat WhatsApp", "chatbot HR karyawan".

**Sesudah**
- Title opsi A (utama): Pengajuan Cuti dan Tanya Aturan Kerja lewat WhatsApp | Kreatekno
- Title opsi B: Chatbot HR untuk Cuti Karyawan dan Aturan Kerja | Kreatekno
- Description: Karyawan mengajukan cuti atau bertanya aturan kerja lewat WhatsApp. Sisa cuti dicek, atasan memutuskan lewat tombol, dan aturan dijawab dari dokumen kebijakan.

**Alasan**
Opsi A 64 karakter. Description 159 karakter.

## 14.2 layanan-sdm: H1, pertanyaan, jawaban, ringkasan

**Sebelum**
- H1: Cuti dan pertanyaan karyawan terjawab lewat chat
- Pertanyaan: Bagaimana tim SDM melayani cuti dan pertanyaan aturan kerja tanpa menjawab hal yang sama berulang kali?
- Jawaban: ...dan pertanyaan yang tidak ada jawabannya diteruskan ke tim SDM.

**Tahap 1**
"Karyawan" tepat di sini karena konteks cuti.

**Sesudah**
- H1: tetap
- Pertanyaan: Bagaimana bagian SDM melayani cuti dan pertanyaan aturan kerja tanpa menjawab hal yang sama berulang kali?
- Jawaban: Karyawan mengirim pesan ke satu nomor. Pengajuan cuti dikenali, sisa cuti dicek di tabel, lalu ringkasannya dikirim ke atasan, yang menyetujui atau menolak lewat tombol. Tabel cuti diperbarui, dan karyawan menerima kabar keputusannya. Pertanyaan aturan kerja dijawab dari dokumen kebijakan perusahaan, dan pertanyaan yang tidak ada jawabannya diteruskan ke bagian SDM.

**Alasan**
Hanya istilah.

## 14.3 layanan-sdm: isi mode Baca

**Sebelum**
- built.points 6: Meneruskan pertanyaan yang tidak ada di dokumen ke tim SDM.
- fit 2: Tim SDM yang sudah punya aturan cuti dan dokumen kebijakan tertulis.
- FAQ 2 jawaban: Pertanyaan itu diteruskan ke tim SDM, ...

**Tahap 1**
Hanya istilah.

**Sesudah**
- built.points 6: Meneruskan pertanyaan yang tidak ada di dokumen ke bagian SDM.
- fit 2: Bagian SDM yang sudah punya aturan cuti dan dokumen kebijakan tertulis.
- FAQ 2 jawaban: Pertanyaan itu diteruskan ke bagian SDM, dan bisa menjadi bahan untuk melengkapi dokumen kebijakan.

**Alasan**
Panjang sama.

## 14.4 layanan-sdm: Tonton

**Sebelum**
Tanpa istilah terlarang. Adegan 9 sudah memakai "karyawanmu".

**Tahap 1**
Sudah sesuai.

**Sesudah**
Tetap.

**Alasan**
Tidak ada perubahan.

---

# 15. onboarding-klien (Siap dibuat)

## 15.1 onboarding-klien: title tag dan meta description

**Sebelum**
- Title: Klien baru langsung disambut setelah deal | Kreatekno Solusi
- Description: diambil dari `answer` (343 karakter)

**Tahap 1**
Kueri terdekat: "onboarding klien agensi", "email sambutan klien baru otomatis".

**Sesudah**
- Title opsi A (utama): Onboarding Klien Otomatis: Email Sambutan dan Rapat Awal | Kreatekno
- Title opsi B: Klien Baru Disambut di Hari yang Sama dengan Deal | Kreatekno
- Description: Setelah deal tercatat, AI menyiapkan email sambutan, checklist sesuai paket, dan usulan rapat awal dari slot kosong kalender. Staf mengecek sebelum mengirim.

**Alasan**
Opsi A 68 karakter. Description 157 karakter.

## 15.2 onboarding-klien: H1, pertanyaan, jawaban, ringkasan

**Sebelum**
- H1: Klien baru langsung disambut setelah deal
- Jawaban: ...beserta usulan jadwal rapat awal dari slot kosong di kalender tim. ...

**Tahap 1**
"Langsung" bisa dibaca "tanpa dicek staf", padahal email dicek staf dulu.

**Sesudah**
- H1 opsi A (utama, dipilih): Klien baru disambut di hari yang sama dengan deal [perlu dicek di tampilan]
- H1 opsi B: Klien baru tahu langkah berikutnya setelah deal
- Jawaban: Begitu klien baru tercatat di tabel deal, checklist onboarding disiapkan sesuai paketnya. AI menulis draf email sambutan yang menyebut nama klien, paket, dan hal yang perlu disiapkan, beserta usulan jadwal rapat awal dari slot kosong di kalender bersama. Staf mengecek draf itu, lalu mengirim email dan undangan rapat. Penanggung jawab klien tercatat di tabel.

**Alasan**
Opsi A cocok dengan result "di hari yang sama" dan tidak menyiratkan pengiriman tanpa cek.

## 15.3 onboarding-klien: isi mode Baca

**Sebelum**
- built.points 4: Mencari slot kosong di kalender tim ...
- fit 2: Tim yang sudah mencatat deal di satu tabel atau form.
- prep 3: Kalender tim yang dipakai
- metrics 3 label: rapat awal di slot kosong tim

**Tahap 1**
Hanya istilah.

**Sesudah**
- built.points 4: Mencari slot kosong di kalender bersama dan mengusulkannya di draf email.
- fit 2: Usaha yang sudah mencatat deal di satu tabel atau form.
- prep 3: Kalender bersama yang dipakai staf
- metrics 3 label: rapat awal di slot kosong kalender

**Alasan**
Panjang sama atau selisih satu kata.

## 15.4 onboarding-klien: Tonton

**Sebelum**
- Adegan 4 isi: ...Usulan jadwal akan ditambahkan setelah kalender tim diperiksa.
- Adegan 5: Tim punya slot kosong Senin pukul 10.00 WITA. / Dari tiga pilihan, 10.00–10.30 WITA kosong di kalender tim. ...

**Tahap 1**
Istilah dan tanda pisah.

**Sesudah**
- Adegan 4 isi: Draf menyebut Rani, paket yang dipilih, dan tiga persiapan. Usulan jadwal akan ditambahkan setelah kalender bersama diperiksa.
- Adegan 5: Ada slot kosong Senin pukul 10.00 WITA. / Dari tiga pilihan, pukul 10.00 sampai 10.30 WITA kosong di kalender bersama. Waktu itu masuk ke draf sebagai usulan rapat awal.

**Alasan**
Adegan lain tetap.

---

## Di luar copy

- **Panggung Tonton** (gelembung chat, tabel contoh) masih belum ditinjau. Nama pengirim seperti "Admin" atau "Asisten" di panggung perlu dicek di `stage` tiap cerita.
- **Slug `asisten-sop`** memuat kata "asisten" di URL. Mengganti URL aktif perlu redirect dan bukan pekerjaan copy.
- **Pesan WhatsApp `detailMessage`** memakai H1. Untuk H1 yang berubah (booking-jasa, carousel-konten, onboarding-klien) pesannya tetap terbaca wajar.

## Ringkasan perubahan

| Solusi | Metadata | H1 | Jawaban | Baca | Tonton |
|---|---|---|---|---|---|
| booking-jasa | Baru | Diubah | Diubah | Istilah | Istilah |
| berkas-dokumen | Baru | Tetap | Tetap | Istilah | Platform |
| riset-konten | Baru | Tetap | Diubah | Istilah | Istilah |
| pengingat-tagihan | Baru | Tetap | Tetap | FAQ 1 | Istilah |
| rekap-penjualan | Baru | Tetap | Tetap | Istilah, FAQ 2 | Platform |
| followup-prospek | Baru | Tetap | Istilah | Istilah, FAQ 1 | Istilah |
| carousel-konten | Baru | Diubah | Istilah | Istilah | Istilah |
| asisten-sop | Baru | Tetap | Istilah | Istilah, FAQ 3 | Istilah, platform |
| stok-menipis | Baru | Tetap | Istilah | Istilah | Istilah, platform |
| ulasan-pelanggan | Baru | Tetap | Tetap | Istilah | Istilah |
| catat-pengeluaran | Baru | Tetap | Tetap | Istilah | Istilah |
| balas-komentar | Baru | Tetap | Tetap | Istilah, kutipan | Tetap |
| faktur-pemasok | Baru | Tetap | Tetap | Istilah | Istilah |
| layanan-sdm | Baru | Tetap | Istilah | Istilah | Tetap |
| onboarding-klien | Baru | Diubah | Istilah | Istilah | Istilah |

## Yang perlu diputuskan

1. ~~H1 baru.~~ Diputuskan 28 Nov 2026: opsi A untuk booking-jasa, carousel-konten, dan onboarding-klien. Panjangnya dicek di kotak rak 3D saat dipasang.
2. ~~FAQ 2 riset-konten.~~ Diputuskan: sumber disebut umum.
3. ~~Kata "Chatbot".~~ Diputuskan: boleh di title tag dan meta, H1 dan isi tetap "AI".
4. ~~Petugas lapangan.~~ Diputuskan: dipakai.
5. Setelah kedua draf disetujui, saya terapkan ke `messages/id.json`, `detail-copy.ts`, `kartu.ts`, `items/*.ts`, `cerita/*.ts`, plus field `seoTitle` dan `seoDescription`?
