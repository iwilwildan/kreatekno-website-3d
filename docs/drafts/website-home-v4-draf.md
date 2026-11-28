# Website: Home v4, konversi (draf untuk review)

Draf 28 Nov 2026, revisi 3 (dipasang ke `site/messages/id.json` dan `en.json` 28 Nov).
- Mode: refrasa
- Sumber "sebelum": `site/messages/id.json` di commit `a28680b` (tidak ada perubahan lokal di file ini), ditambah teks yang ditulis langsung di `components/home/props/Plaque.tsx` ("Trusted By"). `docs/HOME-V1-COPY.md` tidak dipakai sebagai sumber karena sudah tertinggal dari situs (isi Tentang dan jumlah artikel berbeda).
- Masukan yang sudah diterapkan:
  - Revisi 2 (28 Nov): user memilih headline hero opsi B. Deskripsi hero disesuaikan supaya tidak mengulang "tugas rutin" dari headline dan tetap memuat pembeda "cara kerja usahamu". Kalimat bukti "13 usaha dan komunitas" tidak dipakai dulu. Label logo klien memakai "Dipercaya oleh". Judul Cara kerja memakai opsi B. Tentang memakai opsi B, papan kapur opsi A, epilog opsi A, tagline footer opsi B, dan polaroid testimoni menampilkan cuplikan kalimat hasil.
  - Revisi 3 (28 Nov, saat dipasang): cuplikan polaroid dipendekkan menjadi potongan frasa yang dikutip persis karena kalimat penuh terpotong di PC. Label logo juga dipasang di halaman Tentang (keputusan user). Judul Layanan 1 dan catatan Use case memakai opsi A karena belum dipilih.

## Jawaban pertanyaan awal
- Aksi yang diinginkan: Konsultasi gratis.
- Pembaca dan tingkat kesadaran: pemilik UMKM dan founder, campuran tiga tingkat: belum sadar masalah, sadar masalah, dan sedang membandingkan solusi.
- Keberatan calon klien: takut mahal, takut ribet atau gaptek, takut staf diganti AI, ragu AI salah jawab (termasuk keamanan data).
- Seberapa jauh perubahan: sedang. Kalimat dan urutan boleh berubah, panjang kira-kira sama, karena hampir semua copy tampil di props 3D yang ruangnya terbatas.

## Strategi
- Benefit yang membedakan: tugas rutin pindah ke AI yang dibuat khusus untuk cara kerja usahamu, lalu staf yang sudah ada dilatih supaya usaha tumbuh. Tes kompetitor: banyak agensi bisa bilang "AI custom", tapi jarang yang menggabungkannya dengan janji melatih staf yang sudah ada. Gabungan inilah yang dipakai.
- Angle umum yang dibuang:
  - "Hemat biaya, ganti admin dengan AI." Bertentangan dengan posisi brand dan justru memicu keberatan takut staf diganti.
  - "AI canggih untuk masa depan bisnismu." Marketese, menurunkan kredibilitas (NN/g).
  - "Balas chat pelanggan aktif 24 jam." Membuat layanan terdengar seperti chatbot, padahal layanannya custom.
  - "Bisnis siap ekspansi." Abstrak dan tidak bisa dibuktikan oleh pembaca. Kata ini ada di headline live dan dibuang.
- Audiens kedua: pemilik usaha kecil yang stafnya sedikit dan sudah lama ikut. Hambatannya situasional: tidak sempat belajar teknologi di sela mengurus toko, dan sungkan karena membayangkan AI berarti memberhentikan orang yang sudah setia.
- Insight (dugaan, sumber: empat keberatan yang dipilih user, FAQ live nomor 1 dan 3, testimoni RHC): pemilik usaha menunda memakai AI bukan karena tidak butuh, tapi karena merasa harus memilih antara staf yang sudah setia dan alat yang rumit serta mahal.
- Angle utama: kamu tidak perlu memilih. AI mengikuti cara kerja usahamu dan mengambil tugas rutinnya, stafmu naik kelas.

## Aturan gerbang yang dipakai
- Istilah: "AI" (bukan "asisten AI" atau "asisten"), "staf" untuk orang di usaha pembaca, "karyawan" hanya saat bicara merekrut atau memberhentikan, tidak ada "admin" untuk orang, "pekerja", atau "tim".
- Daftar keahlian staf mengikuti brand: berpikir strategis, berkomunikasi, dan memasarkan. Daftar lengkapnya hanya ditulis di dua tempat (Cara kerja langkah 4 dan FAQ 1).
- Frasa kunci paling banyak dua kali di satu halaman: "cara kerja usahamu", "tugas rutin pindah ke AI", "keputusannya tetap di tanganmu".
- Tanpa em dash, titik koma, nama platform, janji waktu di headline, dan Pekanbaru di hero.
- Kutipan testimoni tidak diubah.

---

## 1. Hero (billboard)

**Sebelum**
- Kicker: Asisten AI untuk UMKM
- Headline: Asisten AI yang bekerja, keahlian staf semakin berkembang, bisnis menjadi siap ekspansi.
- Deskripsi: Kami buatkan asisten AI yang mengikuti cara kerja usahamu, lalu memasangnya di aplikasi yang sudah kamu pakai. Setelah itu, staf yang sudah ada kami latih supaya keahliannya bertambah, omzet meningkat, dan usahamu siap ekspansi.
- Tombol: Konsultasi gratis, Lihat layanan

**Tahap 1**
- Tugas section: dalam satu layar menjawab apa (AI yang dibuat untuk usahamu), untuk siapa (UMKM), dan hasilnya (tugas rutin beres, staf naik kelas).
- Masalah copy lama: headline membawa tiga pesan sekaligus. "Asisten AI" adalah istilah terlarang dan dua kali muncul di H1. "Siap ekspansi" abstrak dan muncul dua kali. Belum ada bukti di layar pertama.

**Sesudah**
- Kicker: AI khusus untuk UMKM
- Headline (dipilih user, revisi 2): Tugas rutin dikerjakan AI, stafmu fokus menumbuhkan usaha.
- Deskripsi (dipilih user, revisi 2, tanpa kalimat bukti): Kami pelajari usahamu dulu, lalu membuat AI yang mengikuti cara kerja usahamu dan memasangnya di aplikasi yang sudah kamu pakai. Setelah itu, kami latih stafmu keahlian baru supaya omzet ikut naik.
- Tombol: Konsultasi gratis, Lihat layanan (tetap)

**Alasan**
- Headline memakai F2 (paralel kontras) dan menjawab keberatan takut staf diganti sejak layar pertama. Cocok untuk pembaca yang sadar masalah. Opsi A yang tidak dipilih: "AI yang mengikuti cara kerja usahamu, bukan sebaliknya."
- Karena headline sudah menyebut tugas rutin, deskripsi memuat pembeda yang lain: AI mengikuti cara kerja usahamu. Dengan begitu, pembaca yang sedang membandingkan solusi tetap melihat pembedanya di layar pertama.
- Satu pesan per headline. Sekitar 57% waktu melihat halaman ada di layar pertama (NN/g).
- Deskripsi tidak mengulang daftar keahlian staf supaya daftar itu tidak muncul lebih dari dua kali. "Supaya omzet ikut naik" adalah tujuan, bukan janji angka.
- Kalimat bukti angka (F9) "Sudah dipercaya 13 usaha dan komunitas" ditunda oleh user. Angka 13 diambil dari jumlah logo di `site/lib/clients.ts`, tapi logo itu mencakup komunitas dan mitra. Bukti untuk layar pertama sementara dipegang logo klien di plakat dan testimoni.
- Kicker dan headline sama-sama ada di dalam H1, jadi H1 berubah dari "Asisten AI untuk UMKM Asisten AI yang bekerja..." menjadi kalimat tanpa istilah terlarang.
- Jumlah kata: headline 11 menjadi 9, deskripsi 33 menjadi 34. Selisihnya satu kata, jadi masih muat di billboard PC dengan ukuran 13,5 px. Ini perkiraan dan baru pasti setelah dicek di tampilan.

---

## 2. Plakat meja staf, sebelum (K2.1 dan K2.2)

**Sebelum**
- Sinta: Chat belum dibalas terus bertambah.
- Bayu: Struk menumpuk, rekap belum juga selesai.
- Nadia: Bikin konten tiap hari, ide habis.
- Fajar: Bolak-balik katalog, stok tak ketemu.

**Tahap 1**
- Tugas section: membuka mata pembaca yang belum sadar masalah dengan situasi sehari-hari yang mereka kenali.
- Masalah copy lama: tidak ada. Kalimatnya pendek, konkret, dan sudah berupa situasi, bukan tuduhan.

**Sesudah**
- Tetap.

**Alasan**
- Sesuai tabel kesadaran: pembaca yang belum sadar masalah dibuka dengan situasi sehari-hari. Empat plakat ini sudah melakukannya dan selaras dengan gelembung pikiran tiap staf.

---

## 3. Layanan (leaflet)

**Sebelum**
- Judul: Empat cara kami membantu usahamu
- Layanan 1 judul: Asisten AI
- Layanan 1 isi: AI yang bekerja di balik komputer untuk membantu manajemen, operasional dan pemasaran, tanpa perlu menambah karyawan.
- Layanan 2 judul: Pelatihan AI untuk bisnis
- Layanan 2 isi: Undang kami untuk mengajari kamu dan stafmu memakai AI untuk keperluan usaha, seperti menulis promosi, membuat penawaran, dan merangkum laporan. Di tempatmu atau online.
- Layanan 3 judul: Foto & video dengan AI
- Layanan 3 isi: Kami buatkan foto produk, video iklan, video ulasan gaya kreator, sampai animasi karakter brand, semuanya dengan AI, untuk konten dan promosi usahamu.
- Layanan 4 judul: Kelas keahlian zaman AI
- Layanan 4 isi: Belajar meningkatkan kualitas kerja dengan AI dan mengasah keahlian yang tidak bisa digantikan AI, seperti berkomunikasi dan membuat strategi. Cocok untuk mahasiswa hingga pekerja.
- Layanan 4 tag: Kelas online segera hadir

**Tahap 1**
- Tugas section: menunjukkan bahwa layanan utamanya adalah AI yang dibuat khusus, sementara pelatihan dan konten melengkapinya.
- Masalah copy lama: "Asisten AI" sebagai nama layanan utama. "Di balik komputer" tidak menjelaskan apa yang dikerjakan. Layanan 3 penuh koma. Layanan 4 memakai "pekerja".

**Sesudah**
- Judul: Empat cara kami membantu usahamu (tetap)
- Layanan 1 judul (dipasang, opsi A): AI khusus usahamu
- Layanan 1 judul opsi B (cadangan): AI sesuai kebutuhan
- Layanan 1 isi: AI yang kami buat khusus untuk usahamu, mengerjakan tugas rutin di manajemen, operasional, dan pemasaran tanpa perlu menambah karyawan.
- Layanan 2: tetap.
- Layanan 3 isi: Foto produk, video iklan, video ulasan gaya kreator, sampai animasi karakter brand. Semuanya kami buat dengan AI untuk promosi usahamu.
- Layanan 4 isi: Belajar bekerja lebih baik dengan AI sambil mengasah keahlian yang tidak bisa digantikan AI, seperti berkomunikasi dan membuat strategi. Cocok untuk mahasiswa sampai yang sudah bekerja.
- Layanan 4 tag: tetap.

**Alasan**
- Layanan 1 memakai F7 ringan: fitur teknis ("di balik komputer") diganti fungsi yang dirasakan pembaca (tugas rutin di tiga bidang). "Karyawan" tetap dipakai karena konteksnya merekrut.
- Layanan 3 dipecah jadi dua kalimat supaya mudah dipindai. Kalimat pendek dan aktif (Unbounce, NN/g).
- Layanan 4 hanya mengganti "pekerja" dan merapikan "meningkatkan kualitas kerja" yang abstrak.
- Jumlah kata: layanan 1 isi 17 menjadi 19, layanan 3 isi 22 menjadi 21, layanan 4 isi 24 menjadi 25. Leaflet HP sudah 11 px, jadi layanan 1 dan 4 diberi tanda [perlu dicek di tampilan].

---

## 4. Use case (binder)

**Sebelum**
- Judul: Bagian usaha mana yang bisa dibantu AI?
- Intro: Pekerjaan yang biasanya butuh karyawan tambahan, atau yang menyita waktu stafmu sekarang. Pilih satu bagian.
- Catatan: Pekerjaanmu belum ada di sini? Ceritakan ke kami.
- Jadwal: Pelanggan memilih jadwal kosong langsung di chat dan dicatat otomatis, tanpa menunggu kamu membalas dan mengecek jadwal.
- Karyawan baru: Karyawan baru bertanya cara kerja toko, asisten menjawab dari aturan yang kamu tulis.
- Contoh lain (14 item): seperti di `id.json`.

**Tahap 1**
- Tugas section: membantu pembaca yang sadar masalah menemukan pekerjaan mereka sendiri di daftar contoh.
- Masalah copy lama: intro berupa kalimat tanpa predikat. "Langsung di chat" bisa menempel ke "memilih" atau "dicatat". "Asisten" di contoh Karyawan baru.

**Sesudah**
- Judul: Bagian usaha mana yang bisa dibantu AI? (tetap)
- Intro: Ini pekerjaan yang biasanya butuh karyawan tambahan atau menyita waktu stafmu. Pilih satu bagian.
- Catatan (dipasang, opsi A): Pekerjaanmu belum ada di sini? Ceritakan ke kami, gratis.
- Catatan opsi B (cadangan): Tidak menemukan pekerjaanmu? Ceritakan saat konsultasi gratis.
- Jadwal: Pelanggan memilih jadwal kosong lewat chat dan jadwalnya tercatat otomatis, tanpa menunggu kamu membalas.
- Karyawan baru: Karyawan baru bertanya cara kerja toko, AI menjawab dari aturan yang kamu tulis.
- Contoh lain: tetap.

**Alasan**
- Intro diberi predikat supaya terbaca sebagai kalimat utuh. Bahasa setara kelas 5 sampai 7 SD (Unbounce).
- Catatan adalah titik terdekat dengan keputusan di section ini, jadi diberi pengurang risiko "gratis" (aturan CTA website). Opsi B menyebut nama CTA utama.
- "Langsung" dibuang karena ambigu (aturan gaya). Kalimat Jadwal turun dari 18 menjadi 15 kata.
- Contoh lain tetap karena sudah konkret, menyebut siapa melakukan apa, dan tersebar di empat bagian usaha, jadi tidak condong ke chatbot.

---

## 5. Cara kerja (panel ruko)

**Sebelum**
- Kicker: Cara kerja
- Judul: Dari ngobrol sampai stafmu punya keahlian baru
- Langkah 1 (Ngobrol): Gratis, ketemu langsung di Pekanbaru atau lewat video call. Ceritakan pekerjaan yang menyita waktu dan siapa yang mengerjakannya sekarang.
- Langkah 2 (Pelajari dan rancang): Kami pelajari cara kerja usahamu, pilih pekerjaan yang paling terasa manfaatnya, lalu kamu menerima penawaran yang jelas.
- Langkah 3 (Pasang dan ajari): Asisten AI dicoba dulu dengan pesanan dan pertanyaan pembelimu, dipasang di aplikasi yang sudah kamu pakai, lalu cara memakai asistennya kami ajari gratis.
- Langkah 4 (Latih dan dampingi): Staf yang tugas adminnya diambil AI kami latih keahlian baru untuk mendatangkan omzet, dan asistennya tetap kami pantau.

**Tahap 1**
- Tugas section: menghapus rasa takut ribet dan takut mahal, dan menunjukkan bahwa pengunjung cukup bercerita.
- Masalah copy lama: "asisten" dua kali, "tugas adminnya diambil AI" terdengar seperti ada yang diambil dari staf, keahlian staf tidak disebut, dan judul langkah tidak menunjukkan siapa yang bekerja.

**Sesudah**
- Kicker: Cara kerja (tetap)
- Judul (dipilih user, revisi 2): Kamu cukup cerita, sisanya kami kerjakan.
- Langkah 1 judul: Kamu cerita
- Langkah 1 isi: Gratis, ketemu langsung di Pekanbaru atau lewat video call. Ceritakan pekerjaan yang menyita waktu dan siapa yang mengerjakannya sekarang.
- Langkah 2 judul: Kami pelajari
- Langkah 2 isi: Kami pelajari cara kerja usahamu dan memilih pekerjaan yang paling terasa manfaatnya. Kamu menerima penawaran yang jelas, dan keputusannya tetap di tanganmu.
- Langkah 3 judul: Kami buat dan uji
- Langkah 3 isi: AI diuji dulu dengan pesanan dan pertanyaan pembelimu, lalu dipasang di aplikasi yang sudah kamu pakai. Cara memakainya kami ajari gratis.
- Langkah 4 judul: Kami latih dan dampingi
- Langkah 4 isi: Stafmu kami latih berpikir strategis, berkomunikasi, dan memasarkan, karena merekalah yang paling paham kondisi lapangan. AI-nya tetap kami pantau.

**Alasan**
- Judul memakai F2 (paralel kontras) dan langsung menjawab takut ribet. Kata "cukup" menegaskan bahwa usaha pengunjung kecil, dan "sisanya" menunjukkan bahwa pekerjaan lain ada di pihak Kreatekno. Opsi yang tidak dipilih: "Kamu yang cerita, kami yang kerjakan."
- Judul langkah memakai copy modular ("Kami ..."). Hanya langkah 1 yang dikerjakan pengunjung, jadi usaha untuk bertindak terlihat kecil (Baymard).
- Langkah 2 menjawab takut mahal dengan pesan dua sisi: ada penawaran, tapi pembaca tidak terikat (Eisend 2006).
- Langkah 4 menjawab takut staf diganti tanpa menyebut admin atau asisten. Ini satu dari dua tempat daftar keahlian lengkap.
- Jumlah kata: judul 7 menjadi 6, isi langkah 2 dari 19 menjadi 24, langkah 3 dari 24 menjadi 22, langkah 4 dari 19 menjadi 20. Isi langkah sudah dikecilkan ke 4,2cqw, jadi langkah 2 diberi tanda [perlu dicek di tampilan]. Kalau tidak muat, potong "dan keputusannya tetap di tanganmu".

---

## 6. Testimoni (polaroid)

**Sebelum**
- Judul: Cerita pemilik usaha yang sudah kami bantu
- Tombol: Baca cerita
- Kutipan: tiga kutipan RHC, Nextive Gaming, Jafa Indo Corpora seperti di `id.json`.

**Tahap 1**
- Tugas section: memberi bukti dari pemilik usaha nyata.
- Masalah copy lama: judul dan kutipan sudah baik. Polaroid hanya menampilkan dua baris pertama, dan dua baris pertama tiap kutipan berisi masalah, bukan hasil.

**Sesudah**
- Judul, tombol, dan kutipan lengkap: tetap. Kutipan tidak diubah satu kata pun dan tetap tampil utuh di dialog "Baca cerita".
- Cuplikan polaroid 1 (RHC): "…beban kerja kami berkurang…"
- Cuplikan polaroid 2 (Nextive Gaming): "Jumlah unggahan naik drastis…"
- Cuplikan polaroid 3 (Jafa Indo Corpora): "…semua dokumen jadi otomatis…"

**Alasan**
- Testimoni adalah bukti kuat untuk keputusan berisiko (meta-analisis eWOM).
- Teknik "pilih kutipan hasil" (disetujui user, revisi 2): polaroid menampilkan satu kalimat hasil yang dikutip persis dari kutipan aslinya, bukan dua baris pertama yang berisi masalah. Tidak ada kata yang diubah, ditambah, atau dipotong di tengah kalimat.
- Polaroid 2 tidak memakai kalimat "masuk FYP dengan 153,7 ribu views" walaupun angkanya paling kuat, karena "FYP" merujuk ke satu platform. Kalimat itu tetap ada di kutipan lengkap.
- Polaroid 3 tidak memakai kalimat penutup karena kalimat itu memuat "tim" dan "admin". Kutipan itu sah karena kutipan dikecualikan dari aturan istilah, tapi sebaiknya tidak ditonjolkan.
- Revisi 3 (saat dipasang): cuplikan satu kalimat penuh terpotong oleh `line-clamp` di polaroid PC (2 baris), jadi diganti potongan frasa hasil yang dikutip persis. Tanda "…" menunjukkan bahwa kalimatnya dipotong. Huruf dan kata tidak diubah, dan kutipan lengkap tetap ada di dialog "Baca cerita". Versi EN: "…our workload has gone down…", "We now post far more often…", "…every document is generated automatically…".
- Catatan teknis: kunci `home.testimonials.items[].highlight` tampil di polaroid, sementara `quote` tetap dipakai di dialog dan di versi tumpuk (`lobby.css`).

---

## 7. Logo klien (plakat, teks di kode)

**Sebelum**
- Label: Trusted By

**Tahap 1**
- Tugas section: menguatkan bukti sosial di dekat profil Kreatekno.
- Masalah copy lama: label berbahasa Inggris di halaman Indonesia dan ditulis langsung di `Plaque.tsx`, jadi tidak ikut terjemahan.

**Sesudah**
- Label (dipilih user, revisi 2): Dipercaya oleh

**Alasan**
- Social proof relevan untuk budaya kolektivis seperti Indonesia (Cialdini dkk. 1999).
- Opsi yang tidak dipilih: "Sudah bekerja sama dengan".
- Catatan teknis: label dipindah ke kunci baru `home.about.trusted` (EN "Trusted by"). Label ini menggantikan keputusan 17 Nov (issue #34) bahwa "Trusted By" selalu berbahasa Inggris. Atas keputusan user 28 Nov, halaman Tentang ikut memakai kunci yang sama, dan tes `tools/render/issue34.mjs` ikut diperbarui.

---

## 8. Artikel

**Sebelum**
- Judul: Bacaan untuk pemilik usaha
- Judul artikel: 5 pekerjaan admin yang bisa dikerjakan AI, Asisten AI untuk balas chat pembeli: kapan perlu, kapan belum, Cara melatih staf bekerja bareng AI, Ide konten promosi tiap minggu dengan bantuan AI, Catat penjualan harian otomatis supaya untung rugi terlihat

**Tahap 1**
- Tugas section: memberi bacaan untuk pembaca yang belum siap konsultasi.
- Masalah copy lama: dua judul memakai "admin" dan "asisten AI". Tapi judul ini dipakai juga di halaman artikel, kartu artikel, dan Pustaka.

**Sesudah**
- Tetap.

**Alasan**
- Mengubah judul artikel berarti mengubah halaman artikel dan SEO-nya, jadi dicatat di "Di luar modul konversi".

---

## 9. FAQ (sticky note)

**Sebelum**
- Judul: Yang sering ditanyakan pemilik usaha
- Baris bantuan: Belum terjawab? Tanya langsung.
- 1 jawaban: Tidak perlu. AI mengambil alih tugas admin, lalu kami latih karyawanmu menjual, bernegosiasi, dan menyusun strategi. Keputusannya tetap di tanganmu.
- 2 jawaban: Asisten hanya menjawab dari informasi yang kamu setujui, misalnya daftar harga dan jam buka. Kalau ragu, chat diteruskan ke kamu atau stafmu. Sebelum dipakai, asisten diuji dengan pertanyaan pembelimu.
- 3 jawaban: Bisa. Kamu cukup cerita pekerjaannya. Kami yang memasang, mencoba, dan mengajarimu memakai asistennya sampai lancar, gratis.
- 4 jawaban: Bisa. Asisten AI mengerjakan tugas admin yang biasanya jadi alasan merekrut, jadi kamu bisa berkembang tanpa langsung menambah gaji tetap.
- 5 jawaban: Tidak. Asisten tersambung ke nomor yang sudah dikenal pembelimu, dan proses verifikasinya kami yang urus.
- 6 jawaban: Tergantung pekerjaan yang mau dibantu, karena setiap usaha berbeda. Setelah konsultasi gratis, kamu menerima penawaran yang jelas, dan bisa membandingkannya dengan biaya merekrut satu karyawan untuk pekerjaan yang sama.
- 7 jawaban: Data hanya dipakai untuk menjalankan asistenmu. Yang bisa mengakses dibatasi, dan datanya tetap milikmu.
- 8: Bisa ketemu langsung? Bisa. Kami berbasis di Pekanbaru dan senang datang ke tempat usahamu.

**Tahap 1**
- Tugas section: menjawab empat keberatan dengan pesan dua sisi, dekat dengan CTA.
- Masalah copy lama: "asisten" enam kali, "tugas admin" dua kali, keahlian staf di jawaban 1 tidak sesuai brand, "kalau ragu" tidak jelas siapa yang ragu, jawaban 6 belum menyebut pembayaran fleksibel.

**Sesudah**
- Judul dan baris bantuan: tetap.
- Pertanyaan 1 sampai 8: tetap. Pertanyaan ditulis dengan kata-kata calon klien, jadi "karyawan" dan "saya" dipertahankan.
- 1 jawaban: Tidak perlu. Yang pindah ke AI adalah tugas rutin, bukan orangnya. Stafmu kami latih berpikir strategis, berkomunikasi, dan memasarkan. Keputusannya tetap di tanganmu.
- 2 jawaban: AI hanya menjawab dari informasi yang kamu setujui, misalnya daftar harga dan jam buka. Kalau AI tidak yakin, chat diteruskan ke kamu atau stafmu. Sebelum dipakai, AI diuji dengan pertanyaan pembelimu.
- 3 jawaban: Bisa. Kamu cukup cerita pekerjaannya. Kami yang memasang, menguji, dan mengajarimu memakai AI-nya sampai lancar, gratis.
- 4 jawaban: Bisa. AI mengambil alih tugas rutin yang biasanya jadi alasan merekrut karyawan, jadi usahamu bisa berkembang tanpa harus menambah gaji tetap dulu.
- 5 jawaban: Tidak. Nomor dan aplikasi yang dikenal pembelimu tetap sama, dan proses verifikasi nomornya kami yang urus.
- 6 jawaban: Tergantung pekerjaan yang mau dibantu, karena setiap usaha berbeda. Setelah konsultasi gratis, kamu menerima penawaran yang jelas dan bisa membandingkannya dengan biaya merekrut satu karyawan. Pembayarannya juga fleksibel.
- 7 jawaban: Data hanya dipakai untuk menjalankan AI-mu. Yang bisa mengakses dibatasi, dan datanya tetap milikmu.
- 8 jawaban: tetap.

**Alasan**
- Semua jawaban adalah pesan dua sisi yang mengakui keraguan lalu membantahnya (Eisend 2006).
- Jawaban 1 memakai posisi brand "yang pindah adalah tugas, bukan orang" dan daftar keahlian yang benar. Ini tempat kedua dan terakhir daftar keahlian lengkap.
- Jawaban 2 menyebut subjek "AI" supaya "tidak yakin" tidak ambigu.
- Jawaban 6 menambah fakta "pembayaran fleksibel" dari daftar fakta brand untuk menjawab takut mahal.
- Jumlah kata total jawaban naik dari 167 menjadi 170. Sticky note sempit, jadi jawaban 6 diberi tanda [perlu dicek di tampilan].
- Catatan teknis: JSON-LD FAQPage di `components/home/HomeStage.tsx` membaca `home.faq.items`, jadi ikut berubah tanpa edit kode.

---

## 10. Tentang (plakat)

**Sebelum**
- Judul: Tentang Kreatekno
- Isi: Kreatekno membantu usaha memasang asisten AI, membuat konten dengan AI, dan melatih pekerja agar bisnis tumbuh bersama orang-orangnya.
- Fakta: PT Kreatekno Kreatif Teknologi, badan usaha resmi. Berbasis di Pekanbaru, melayani seluruh Indonesia. Konsultasi gratis. Pembayaran fleksibel.
- Link: Kenali kami lebih jauh

**Tahap 1**
- Tugas section: memberi rasa aman bahwa Kreatekno badan usaha nyata, untuk pembaca yang membandingkan penyedia.
- Masalah copy lama: "asisten AI" dan "pekerja".

**Sesudah**
- Judul, fakta, dan link: tetap.
- Isi (dipilih user, revisi 2): Kreatekno membuat AI untuk tiap usaha dan melatih staf yang sudah ada, supaya usaha tumbuh bersama orang-orangnya.

**Alasan**
- Isi ini fokus pada pembeda dan lebih pendek. Layanan konten tetap terlihat di leaflet Layanan. Opsi yang tidak dipilih: "Kreatekno membuat AI sesuai kebutuhan tiap usaha, memproduksi konten dengan AI, dan melatih staf supaya usaha tumbuh bersama orang-orangnya."
- Jumlah kata: 19 menjadi 17.

---

## 11. Plakat meja staf, sesudah (K13)

**Sebelum**
- Sinta: Tidak ada chat yang menunggu.
- Bayu: Rekap hari ini sudah selesai.
- Nadia: Konten minggu ini sudah siap tayang.
- Fajar: Stok tiap barang tercatat jelas.

**Tahap 1**
- Tugas section: menunjukkan hasil, berpasangan dengan plakat sebelum.

**Sesudah**
- Tetap.

**Alasan**
- Tiap kalimat menjawab plakat sebelumnya dengan hasil konkret. Tunjukkan, jangan hanya bilang (Braddock & Dillard 2016).

---

## 12. Papan kapur (ruang kelas)

**Sebelum**
- Label: Kelas keahlian baru
- Isi: Tugas admin pindah ke AI. Staf pindah ke jualan, negosiasi, dan strategi.

**Tahap 1**
- Tugas section: merangkum janji kedua brand di adegan kelas.
- Masalah copy lama: "tugas admin" dan daftar keahlian yang tidak sesuai brand.

**Sesudah**
- Label: Kelas keahlian baru (tetap)
- Isi (dipilih user, revisi 2): Tugas rutin pindah ke AI. Stafmu belajar keahlian yang menumbuhkan usaha.

**Alasan**
- Isi ini tidak mengulang daftar keahlian karena daftar itu sudah tampil di adegan Cara kerja dan FAQ.
- Opsi yang tidak dipilih: "AI mengerjakan tugasnya, staf mengembangkan usahanya." (F4, rima dua bagian).
- Jumlah kata: 12 menjadi 11.

---

## 13. Footer dan pesan WhatsApp

**Sebelum**
- Epilog: Toko sudah tutup. Asistennya masih merapikan pekerjaan untuk besok.
- Tagline: Asisten AI, konten AI, dan pelatihan untuk usaha dan pekerja.
- Pesan WhatsApp otomatis: Halo Kreatekno, saya mau tanya soal asisten AI dan pelatihan staf untuk usaha saya.

**Tahap 1**
- Tugas section: menutup cerita dengan gambaran hasil, lalu memberi pintu masuk ke konsultasi.
- Masalah copy lama: "asisten" di ketiga elemen dan "pekerja" di tagline.

**Sesudah**
- Epilog (dipilih user, revisi 2): Toko sudah tutup. AI masih merapikan pekerjaan untuk besok.
- Tagline (dipilih user, revisi 2): AI untuk usahamu, pelatihan untuk stafmu.
- Pesan WhatsApp otomatis: Halo Kreatekno, saya mau konsultasi gratis soal AI untuk usaha saya.

**Alasan**
- Epilog hanya mengganti "asistennya" dengan "AI", dan panjangnya sama dengan versi live. Opsi yang tidak dipilih: "Toko sudah tutup dan staf sudah pulang. AI masih merapikan pekerjaan untuk besok."
- Tagline memakai F2, lebih pendek, dan tidak mengulang kata "AI" tiga kali. Opsi yang tidak dipilih: "AI khusus, konten AI, dan pelatihan untuk usaha dan stafnya."
- Catatan sapaan: tagline baru memakai "-mu", padahal halaman Solusi (`pages.solutions`, `meta.solutions`) masih memakai "Anda". Selama copy Solusi belum ditulis ulang, footer di halaman Solusi akan mencampur dua sapaan.
- Pesan WhatsApp ditulis dari sudut pandang pengunjung dan menyebut CTA utama (aturan website).
- Catatan teknis: `footer.tagline` dan `wa.chat` dipakai di semua halaman, jadi perubahan ini ikut tampil di luar Home.

---

## Di luar modul konversi
- Judul artikel "5 pekerjaan admin yang bisa dikerjakan AI" dan "Asisten AI untuk balas chat pembeli: kapan perlu, kapan belum" memakai istilah terlarang. Perlu dikerjakan bersama halaman artikelnya dengan tujuan SEO.
- Meta SEO Home (`meta.*`) belum diubah sejak copy v3.
- Teks alternatif adegan (`home.stage.*`) masih menyebut "COMPANY" dan bukan copy pemasaran. Cocok dicek dari sisi aksesibilitas.
- Versi EN (`en.json`) perlu diterjemahkan ulang setelah draf ini disetujui.
- CTA map ungu (bagian 12 di copy v3) tetap tidak dipasang karena belum ada props-nya.

## Ringkasan perubahan
| Section | Status |
|---|---|
| 1. Hero | Diubah, headline B dipilih, dua opsi deskripsi |
| 2. Plakat meja sebelum | Tetap |
| 3. Layanan | Diubah sebagian (layanan 1, 3, 4) |
| 4. Use case | Diubah sebagian (intro, catatan, dua contoh) |
| 5. Cara kerja | Diubah, judul opsi B dipilih |
| 6. Testimoni | Kutipan tetap, cuplikan hasil untuk polaroid ditambah |
| 7. Logo klien | Diubah, label "Dipercaya oleh" dipilih |
| 8. Artikel | Tetap |
| 9. FAQ | Diubah (tujuh jawaban) |
| 10. Tentang | Diubah, isi opsi B dipilih |
| 11. Plakat meja sesudah | Tetap |
| 12. Papan kapur | Diubah, isi opsi A dipilih |
| 13. Footer dan WhatsApp | Diubah, epilog A dan tagline B dipilih |

## Rencana uji
- Uji 1: headline hero B (dipakai) melawan opsi A sebagai varian. Metrik: klik "Konsultasi gratis" di hero.
- Uji 2 (setelah angka klien dikonfirmasi): deskripsi hero dengan dan tanpa kalimat bukti. Metrik: klik "Konsultasi gratis" di hero.
- Satu elemen per eksperimen supaya hasilnya bisa dibaca.

## Yang perlu diputuskan
Keputusan revisi 1 sudah dijawab semua: headline hero B, tanpa kalimat bukti, label "Dipercaya oleh", judul Cara kerja B, Tentang B, papan kapur A, epilog A, tagline footer B, dan cuplikan hasil di polaroid boleh.

1. Tiga cuplikan hasil untuk polaroid: setuju dengan pilihan kalimatnya?
2. Tagline footer "-mu" juga tampil di halaman Solusi yang masih memakai "Anda": diterima sampai copy Solusi ditulis ulang?
3. Draf disetujui untuk dipasang ke `id.json` (dan `Plaque.tsx`, `Corkboard.tsx`), lalu dicek panjangnya di tampilan PC, tablet, dan HP? Terjemahan EN ikut dibuat di langkah itu.
