# Home v1: Copy

_Draf tim 14 Nov 2026, versi 3. Bahasa Indonesia. Dipasang di situs 14 Nov 2026 (`site/messages/id.json`, terjemahan EN di `en.json`)._

Sumber copy Home yang berlaku. `docs/COPY.md` bagian 3 sampai 8 (copy Home versi footage) tidak dipakai lagi untuk Home.

| Info | Isi |
|---|---|
| Sapaan | "kamu" / "-mu" (keputusan user 14 Nov 2026, menggantikan "Anda" di Home). Halaman lain masih "Anda" sampai copy-nya ditulis ulang |
| Ejaan | Dirapikan saat dipasang: "di balik komputer", "adminnya", tanda kutip lengkung. Kutipan testimoni dipakai persis |
| Bagian usaha (bagian 4) | Kunci `home.useCase.teams.{promo,service,money,monitor}` (sebelumnya `home.useCase.industries.*`), masing-masing `name` dan `uses` (4 × `label`, `text`) |
| Testimoni (bagian 6) | `home.testimonials.items` (3 item). Cap CONTOH dan kunci `home.testimonials.stamp` dihapus. Kutipan ±60 kata tidak muat di polaroid (keputusan user 15 Nov): polaroid menampilkan 2 baris pertama (3 di HP) dengan "…", seluruh polaroid jadi tombol `home.testimonials.more` ("Baca cerita") yang membuka dialog berisi kutipan lengkap (`home.testimonials.close` = "Tutup"). Versi tumpuk menampilkan kutipan penuh tanpa tombol. Foto masih pengganti `[Foto]` sampai foto atau logo klien masuk |
| Plakat meja (bagian 2 dan 10) | Kunci `home.desks.before.*` dan `home.desks.after.*` sudah ada di messages, tapi belum dirender di panel depan meja (K2.1, K2.2, K13). Gelembung pikiran K13 belum dicek terhadap plakat |
| CTA (bagian 12) | Tidak dipasang: billboard CTA malam dan kunci `home.cta` sudah dihapus di issue #25 (14 Nov), jadi tidak ada tempatnya. Tombol `cta.free`/`cta.meet` tetap. Perlu keputusan tim kalau "map ungu" mau dibuat sebagai props baru |
| Ukuran huruf | Copy v3 lebih panjang, jadi beberapa elemen dikecilkan supaya muat (diukur 15 Nov di PC 1280×720, tablet 768×1024, HP 375×812 dan 360×740, ID dan EN): isi hero di billboard PC 14,5 → 13,5 px; panel Cara kerja (judul pembuka 10 → 9,2cqw, isi langkah 4,9 → 4,2cqw); isi plakat Tentang 5,6 → 4,9cqw; leaflet HP (isi 12 → 11,5 px, 11 px di HP ≤ 360, jarak baris dirapatkan); nama tab binder di HP pecah jadi dua kolom rapat kalau lebih panjang dari tabnya ("Layani pembeli", "Serve customers") |
| Lain-lain | Pesan WhatsApp otomatis = `wa.chat`. Alt still `home.stage.k4` ikut berubah ke "per bagian usaha". Meta SEO (`meta.*`) belum diubah |


## 1. Hero (billboard)

- **Kicker** (`home.hero.kicker`): Asisten AI untuk UMKM
- **Headline** (`home.hero.headline`): Asisten AI yang bekerja, keahlian staf semakin berkembang, bisnis menjadi siap ekspansi.
- **Deskripsi** (`home.hero.body`): Kami buatkan asisten AI yang mengikuti cara kerja usahamu, lalu memasangnya di aplikasi yang sudah kamu pakai. Setelah itu, staf yang sudah ada kami latih supaya keahliannya bertambah, omzet meningkat, dan usahamu siap ekspansi.

## 2. Plakat meja staf (K2.1 dan K2.2)

_Catatan untuk Wildan: copy di sisi depan meja yang menghadap kamera (panel depan dari issue #15), bukan di atas meja. Desktop dan HP memakai kalimat yang sama dan tetap menempel di meja. Kalimat selaras dengan isi gelembung pikiran tiap staf. Nama staf hanya penanda meja, tidak tampil di copy. Kunci di bawah hanya usulan._

- **Meja Sinta, HP** (`home.desks.before.sinta`): Chat belum dibalas terus bertambah.
- **Meja Bayu, monitor** (`home.desks.before.bayu`): Struk menumpuk, rekap belum juga selesai.
- **Meja Nadia, laptop** (`home.desks.before.nadia`): Bikin konten tiap hari, ide habis.
- **Meja Fajar, baki harga** (`home.desks.before.fajar`): Bolak-balik katalog, stok tak ketemu.

## 3. Layanan (leaflet)

- **Judul** (`home.services.title`): Empat cara kami membantu usahamu

**Layanan 1**
- **Judul** (`home.services.assistants.title`): Asisten AI
- **Isi** (`home.services.assistants.body`): AI yang bekerja di balik komputer untuk membantu manajemen, operasional dan pemasaran, tanpa perlu menambah karyawan.

**Layanan 2**
- **Judul** (`home.services.strategy.title`): Pelatihan AI untuk bisnis
- **Isi** (`home.services.strategy.body`): Undang kami untuk mengajari kamu dan stafmu memakai AI untuk keperluan usaha, seperti menulis promosi, membuat penawaran, dan merangkum laporan. Di tempatmu atau online.

**Layanan 3**
- **Judul** (`home.services.content.title`): Foto & video dengan AI
- **Isi** (`home.services.content.body`): Kami buatkan foto produk, video iklan, video ulasan gaya kreator, sampai animasi karakter brand, semuanya dengan AI, untuk konten dan promosi usahamu.

**Layanan 4**
- **Judul** (`home.services.training.title`): Kelas keahlian zaman AI
- **Isi** (`home.services.training.body`): Belajar meningkatkan kualitas kerja dengan AI dan mengasah keahlian yang tidak bisa digantikan AI, seperti berkomunikasi dan membuat strategi. Cocok untuk mahasiswa hingga pekerja.
- **Tag** (`home.services.training.tag`): Kelas online segera hadir

## 4. Use case (binder)

- **Judul** (`home.useCase.title`): Bagian usaha mana yang bisa dibantu AI?
- **Intro** (`home.useCase.intro`): Pekerjaan yang biasanya butuh karyawan tambahan, atau yang menyita waktu stafmu sekarang. Pilih satu bagian.
- **Catatan** (`home.useCase.note`): Pekerjaanmu belum ada di sini? Ceritakan ke kami.
- **Label tab** (`home.useCase.tabs`): Bagian usaha

_Catatan untuk Wildan: tab berganti dari jenis usaha ke bagian usaha. Kunci `home.useCase.industries.*` perlu diganti nama, misalnya `home.useCase.teams.*`. Jumlah tab tetap 4, masing-masing 4 contoh._

**Tab 1: Promosi**
- **Ide posting**: Setiap minggu kamu menerima daftar ide posting dari tren yang sedang ramai di bidangmu.
- **Bahan posting**: Kirim satu topik, draf isi posting disiapkan sesuai gaya usahamu, tinggal kamu setujui.
- **Calon pembeli**: Calon pembeli yang pernah bertanya dicatat, lalu kamu diingatkan kapan harus menghubungi lagi.
- **Pelanggan lama**: Kabar promo dikirim ke pelanggan lama, supaya mereka ingat untuk belanja lagi.

**Tab 2: Layani pembeli**
- **Pertanyaan pembeli**: Pertanyaan harga, stok, dan layanan dijawab otomatis, termasuk malam hari.
- **Pesanan**: Pesanan yang masuk lewat chat tercatat sendiri, tidak perlu diketik ulang.
- **Jadwal**: Pelanggan memilih jadwal kosong langsung di chat dan dicatat otomatis, tanpa menunggu kamu membalas dan mengecek jadwal.
- **Stok**: Kamu diingatkan sebelum barang habis, jadi masih sempat belanja stok.

**Tab 3: Urus uang**
- **Tagihan**: Pembeli yang belum bayar diingatkan dengan sopan, jadi kamu tidak perlu sungkan menagih sendiri.
- **Bukti bayar**: Bukti transfer dari pembeli dicek, lalu pesanannya ditandai lunas.
- **Uang keluar**: Cukup kirim pesan seperti “beli gas 25 ribu”, pengeluaran langsung tercatat.
- **Nota & berkas**: Foto nota dan dokumen yang dikirim lewat chat disimpan rapi per pelanggan.

**Tab 4: Pantau usaha**
- **Rekap harian**: Total jualan hari ini dan barang terlaris sampai di HP-mu setiap malam.
- **Keluhan**: Keluhan pembeli dari berbagai chat dikumpulkan, jadi kamu tahu apa yang paling sering dikeluhkan.
- **Karyawan baru**: Karyawan baru bertanya cara kerja toko, asisten menjawab dari aturan yang kamu tulis.
- **Ringkasan mingguan**: Setiap minggu kamu menerima ringkasan hari paling ramai dan barang yang jarang laku.

## 5. Cara kerja (panel ruko)

- **Kicker** (`home.journey.kicker`): Cara kerja
- **Judul** (`home.journey.title`): Dari ngobrol sampai stafmu punya keahlian baru

**Langkah 1**
- **Judul** (`home.journey.talk.title`): Ngobrol
- **Isi** (`home.journey.talk.body`): Gratis, ketemu langsung di Pekanbaru atau lewat video call. Ceritakan pekerjaan yang menyita waktu dan siapa yang mengerjakannya sekarang.

**Langkah 2**
- **Judul** (`home.journey.map.title`): Pelajari dan rancang
- **Isi** (`home.journey.map.body`): Kami pelajari cara kerja usahamu, pilih pekerjaan yang paling terasa manfaatnya, lalu kamu menerima penawaran yang jelas.

**Langkah 3**
- **Judul** (`home.journey.build.title`): Pasang dan ajari
- **Isi** (`home.journey.build.body`): Asisten AI dicoba dulu dengan pesanan dan pertanyaan pembelimu, dipasang di aplikasi yang sudah kamu pakai, lalu cara memakai asistennya kami ajari gratis.

**Langkah 4**
- **Judul** (`home.journey.launch.title`): Latih dan dampingi
- **Isi** (`home.journey.launch.body`): Staf yang tugas adminnya diambil AI kami latih keahlian baru untuk mendatangkan omzet, dan asistennya tetap kami pantau.

## 6. Testimoni (polaroid)

- **Judul** (`home.testimonials.title`): Cerita pemilik usaha yang sudah kami bantu

**Polaroid 1**
- **Foto**: [Foto Abdul Aziz Azhari atau logo RHC]
- **Kutipan**: “Dulu kami kewalahan membalas chat satu per satu, sampai banyak pelanggan mengeluh karena slow respon. Semenjak ada AI agent, beban kerja kami berkurang dan pertanyaan pelanggan bisa dijawab dengan cepat. Responnya seperti manusia asli, bukan chatbot robot, dan kami sudah order lagi yang kedua untuk laporan keuangan.”
- **Nama**: Abdul Aziz Azhari, Owner & Direktur
- **Usaha**: CV Riau Home Cleaning, Pekanbaru

**Polaroid 2**
- **Foto**: [Foto Wisnu atau logo Nextive Gaming]
- **Kutipan**: “Produksi konten carousel sekarang jauh lebih efisien berkat sistem AI buatan Kreatekno. Alurnya sudah disesuaikan dengan branding dan selera kami, jadi sekali dibuat hasilnya langsung rapi dan siap tayang. Salah satu kontennya bahkan masuk FYP dengan 153,7 ribu views dan lebih dari 2.700 likes. Jumlah unggahan naik drastis tanpa mengorbankan kualitas visual maupun isi.”
- **Nama**: Wisnu, Creative Director
- **Usaha**: Nextive Gaming, Jakarta

**Polaroid 3**
- **Foto**: [Foto Lily Sofrina atau logo PT Jafa Indo Corpora]
- **Kutipan**: “Sebelum pakai Kreatekno, bagian paling melelahkan di agensi kami adalah menyiapkan dokumen pendukung untuk puluhan klien setiap hari. Salah sedikit di gelar atau format nama saja harus diedit ulang dari awal. Sekarang kami cukup kirim datanya lewat chat, dan semua dokumen jadi otomatis dengan format yang benar. Kapasitas kerja tim naik drastis tanpa perlu tambah admin.”
- **Nama**: Lily Sofrina, Direktur
- **Usaha**: PT Jafa Indo Corpora, Medan

## 7. Artikel

- **Judul** (`home.articles.title`): Bacaan untuk pemilik usaha
- **Label kategori** (`home.articles.category`): Kategori:
- **Tombol baca** (`home.articles.read`): Baca artikel
- **Tombol semua** (`home.articles.all`): Lihat semua artikel

**Artikel 1**
- **Kategori** (`home.articles.admin.category`): Admin
- **Judul** (`home.articles.admin.title`): 5 pekerjaan admin yang bisa dikerjakan AI

**Artikel 2**
- **Kategori** (`home.articles.service.category`): Melayani pembeli
- **Judul** (`home.articles.service.title`): Asisten AI untuk balas chat pembeli: kapan perlu, kapan belum

**Artikel 3**
- **Kategori** (`home.articles.team.category`): Staf
- **Judul** (`home.articles.team.title`): Cara melatih staf bekerja bareng AI

## 8. FAQ (sticky note)

- **Judul** (`home.faq.title`): Yang sering ditanyakan pemilik usaha
- **Baris bantuan** (`home.faq.help`): Belum terjawab? Tanya langsung.
- **Tombol tutup** (`home.faq.close`): Tutup

1. **Kalau pakai AI, karyawan saya harus diberhentikan?**
   Tidak perlu. AI mengambil alih tugas admin, lalu kami latih karyawanmu menjual, bernegosiasi, dan menyusun strategi. Keputusannya tetap di tanganmu.

2. **Kalau AI-nya salah jawab gimana?**
   Asisten hanya menjawab dari informasi yang kamu setujui, misalnya daftar harga dan jam buka. Kalau ragu, chat diteruskan ke kamu atau stafmu. Sebelum dipakai, asisten diuji dengan pertanyaan pembelimu.

3. **Saya gaptek, bisa pakai?**
   Bisa. Kamu cukup cerita pekerjaannya. Kami yang memasang, mencoba, dan mengajarimu memakai asistennya sampai lancar, gratis.

4. **Saya belum punya karyawan. Bisa langsung pakai AI?**
   Bisa. Asisten AI mengerjakan tugas admin yang biasanya jadi alasan merekrut, jadi kamu bisa berkembang tanpa langsung menambah gaji tetap.

5. **Harus ganti nomor atau aplikasi?**
   Tidak. Asisten tersambung ke nomor yang sudah dikenal pembelimu, dan proses verifikasinya kami yang urus.

6. **Berapa biayanya?**
   Tergantung pekerjaan yang mau dibantu, karena setiap usaha berbeda. Setelah konsultasi gratis, kamu menerima penawaran yang jelas, dan bisa membandingkannya dengan biaya merekrut satu karyawan untuk pekerjaan yang sama.

7. **Data usaha saya aman?**
   Data hanya dipakai untuk menjalankan asistenmu. Yang bisa mengakses dibatasi, dan datanya tetap milikmu.

8. **Bisa ketemu langsung?**
   Bisa. Kami berbasis di Pekanbaru dan senang datang ke tempat usahamu.

## 9. Tentang (plakat)

- **Judul** (`home.about.title`): Tentang Kreatekno
- **Isi** (`home.about.body`): Kreatekno adalah agensi AI dari Pekanbaru yang memasang asisten AI, membuat foto dan video dengan AI, serta melatih pemilik usaha dan pekerja. Kami percaya AI seharusnya membuat usaha tumbuh tanpa mengorbankan orang: usaha tanpa karyawan bisa berkembang tanpa langsung merekrut, dan staf yang sudah ada mendapat keahlian baru.
- **Fakta 1** (`home.about.registered`): PT Kreatekno Kreatif Teknologi, badan usaha resmi
- **Fakta 2** (`home.about.based`): Berbasis di Pekanbaru, melayani seluruh Indonesia
- **Fakta 3** (`home.about.free`): Konsultasi gratis
- **Fakta 4** (`home.about.payment`): Pembayaran fleksibel
- **Link** (`home.about.link`): Kenali kami lebih jauh

## 10. Plakat meja staf, sesudah (K13)

_Catatan untuk Wildan: plakat yang sama saat kamera menyusuri meja di K13. Hanya kalimat selesai, tanpa logo dan tanpa menyebut AI. Kalau gelembung pikiran masih tampil di K13, isinya perlu disesuaikan supaya tidak bertentangan dengan plakat._

- **Meja Sinta, HP** (`home.desks.after.sinta`): Tidak ada chat yang menunggu.
- **Meja Bayu, monitor** (`home.desks.after.bayu`): Rekap hari ini sudah selesai.
- **Meja Nadia, laptop** (`home.desks.after.nadia`): Konten minggu ini sudah siap tayang.
- **Meja Fajar, baki harga** (`home.desks.after.fajar`): Stok tiap barang tercatat jelas.

## 11. Papan kapur (ruang kelas)

- **Label** (`home.practice.label`): Kelas keahlian baru
- **Isi** (`home.practice.body`): Tugas admin pindah ke AI. Staf pindah ke jualan, negosiasi, dan strategi.

## 12. CTA (map ungu)

- **Judul** (`home.cta.title`): Punya staf atau belum, yuk ceritakan satu pekerjaan yang paling menyita waktu.
- **Isi** (`home.cta.body`): Kami bantu petakan bagian mana yang bisa dikerjakan AI dan keahlian apa yang dibutuhkan stafmu, gratis. Lewat chat, atau ngobrol langsung di Pekanbaru.
- **Tombol 1** (`cta.free`): Konsultasi gratis
- **Tombol 2** (`cta.meet`): Ketemu langsung

## 13. Footer

- **Epilog** (`home.footer.epilogue`): Toko sudah tutup. Asistennya masih merapikan pekerjaan untuk besok.
- **Tagline** (`footer.tagline`): Asisten AI, konten AI, dan pelatihan untuk usaha dan pekerja.
- **Hak cipta** (`footer.copyright`): © 2026 PT Kreatekno Kreatif Teknologi.
- **Pesan WhatsApp otomatis**: Halo Kreatekno, saya mau tanya soal asisten AI dan pelatihan staf untuk usaha saya.
