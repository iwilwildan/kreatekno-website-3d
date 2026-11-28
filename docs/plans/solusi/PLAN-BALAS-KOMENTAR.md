# Detail Solusi: Komentar "harga?" tidak ada yang terlewat

Per 27 Nov 2026, **Tonton N3 lulus QA browser 130/130 dan sudah direview user**. Tes HP fisik belum tercatat.

Induk: [PLAN-KATALOG-N8N](PLAN-KATALOG-N8N.md) bagian 4.2 (sumber, rel draf, temuan, keputusan). Kontrak template, route, mesin dan QA: [PLAN-DETAIL](PLAN-DETAIL.md). Dokumen ini hanya mencatat status dan keputusan khusus `balas-komentar`.

## 1. Identitas

| Item | Nilai |
|---|---|
| Slug | `balas-komentar` |
| Status layanan | Siap dibuat (`ide`); bukan pekerjaan klien |
| Route | `/solusi/balas-komentar` dan `/en/solutions/balas-komentar` |
| Industri | Retail & F&B, Jasa |
| Tim | Marketing, Penjualan |
| Aplikasi | Instagram, Google Sheets |
| Sumber | Template publik n8n.io [5941](https://n8n.io/workflows/5941), [3896](https://n8n.io/workflows/3896) |
| Data | `site/content/solusi/items/balas-komentar.ts`, EN katalog di `catalog.ts` |
| Kode Tonton | `bk` (prefix CSS `bk-*`, QA `tools/solusi/bk1-qa.mjs`) |

## 2. Tahapan

| Tahap | Isi | Status |
|---|---|---|
| N0 | Slug, copy katalog ID (pertanyaan, jawaban, masalah, langkah, perbandingan, kecocokan, persiapan, FAQ), ringkasan EN, kartu masalah, kotak etalase | Disetujui 23 Nov |
| N1a | Copy Baca ID/EN lengkap, dengan klien, kutipan, dan angka contoh | Disetujui 24 Nov |
| N3 | Storyboard → review → cerita Tonton → QA → review | Implementasi, QA, dan review user selesai 27 Nov. |

## 3. Log

- 23 Nov 2026 (N0): item dan subplan dibuat. Copy katalog ditulis dari alur template, tanpa menyalin teks atau prompt template.
- 23 Nov 2026 (N1a): copy ID/EN lengkap dengan klien set A; rincian di PLAN-KATALOG-N8N bagian 10.
- 27 Nov 2026 (N3): user menyatakan N2 sudah direview dan meminta N3 dimulai. Riset dan rancangan adegan ada di bagian 4.
- 27 Nov 2026 (N3): setelah preview lokal dibuka, user mengatakan “oke lanjutkan”. N3 dicatat sudah direview dan N4 dimulai.

## 4. N3: cerita Tonton Balas Komentar

### 4.1 Riset 27 Nov 2026

- Meta menyediakan balasan publik dan balasan pribadi sebagai dua aksi terpisah. Untuk komentar pada postingan atau reel, akun profesional dapat mengirim satu balasan pribadi per komentar dalam tujuh hari. Pesan lanjutan lewat API baru dapat dikirim setelah penerima membalas, dalam 24 jam sejak balasan itu. Adegan staf dimulai setelah calon pembeli membalas. [Comment Moderation](https://developers.facebook.com/documentation/instagram-platform/comment-moderation) · [Private Replies](https://developers.facebook.com/documentation/instagram-platform/private-replies)
- Polling 15 menit di Baca adalah contoh interval pengecekan. Template 5941 memakai jadwal dan pencatatan, sehingga dua bagian itu bisa menjadi acuan visual. Untuk membedakan balasan publik dari pesan pribadi, gunakan dokumentasi Meta dan contoh 16300 sebagai pembanding yang memperlihatkan kedua aksi. Template 16300 memakai webhook. Halaman 3896 belum bisa diverifikasi ulang, dan workflow internal “Instagram Comment → DM” belum tersedia untuk dibaca dari sesi ini. [Schedule Trigger](https://docs.n8n.io/integrations/builtin/core-nodes/n8n-nodes-base.scheduletrigger/) · [Template 5941](https://n8n.io/workflows/5941) · [Template 16300](https://n8n.io/workflows/16300)
- N2 memakai panggung HTML/CSS dan timeline GSAP yang dicari posisinya dari scroll. Caption dan rel tetap berjalan saat GSAP gagal dimuat. N3 memakai kontrak yang sama untuk navigasi maju/mundur, keyboard, dan reduced motion. [Timeline seek](https://gsap.com/docs/v3/GSAP/Timeline/seek()/)

### 4.2 Contoh untuk review

- Toko hijab online contoh meluncurkan **Koleksi Pashmina**. Calon pembeli bernama **Nisa** menulis “Harga, Kak?”. Kata kunci mengikuti Baca, yaitu `harga`, `info`, dan `pricelist`. Kata `harga` disorot pada komentar Nisa. “Bagus warnanya!” menunjukkan komentar yang tetap di kolom publik tanpa balasan otomatis.
- Balasan publik contoh “Hai, Kak! Cek pesan pribadimu untuk katalog, ya.” Pesan pribadi contoh “Hai, Nisa! Ini katalog Pashmina dan link pemesanan.” Panggung memakai satu kartu bertuliskan “Lihat katalog” dengan penanda pemesanan sebagai ilustrasi tautan.
- Nisa membalas “Warna sage masih ada?” Staf masuk ke percakapan dan membalas “Masih ada, Kak. Mau aku bantu pesan?” Tabel menyimpan ID komentar dan status balasan publik serta pesan pribadi. Saat ID yang sama terbaca lagi, sistem melihat status sebelumnya dan melewati pengiriman ulang. Seluruh tokoh, produk, dan percakapan adalah contoh.

### 4.3 Rel dan adegan

Rel enam node mengikuti urutan Komentar baru → Cek riwayat → Cek kata kunci → Balas publik → Kirim pesan → Catat dan teruskan.

| # | Adegan | Caption draf | Panggung |
|---|---|---|---|
| 1 | Sebelum | Saat koleksi baru diluncurkan, pertanyaan harga bisa tenggelam di kolom komentar. | Kartu postingan Pashmina muncul. Komentar “Harga, Kak?” tertutup komentar baru saat staf sedang mengemas pesanan. |
| 2 | Komentar baru | Sistem mengecek komentar baru di postingan pilihan setiap 15 menit. | Jam berlabel “Cek setiap 15 menit”. Komentar Nisa terangkat dari postingan sebagai kartu yang diikuti sepanjang cerita. |
| 3 | Cek riwayat | Sistem mengecek apakah komentar ini sudah ditangani. | Kartu Nisa melewati catatan dengan label “Belum dibalas”. Contoh kedua dengan ID yang sudah tercatat berhenti di label “Sudah ditangani”. |
| 4 | Cek kata kunci | Kata “harga” cocok dengan daftar yang dipilih toko. | Tiga chip kata kunci muncul. Chip “harga” menempel ke kartu Nisa dan “Bagus warnanya!” tetap di kolom komentar. |
| 5 | Balas publik | Balasan singkat muncul di bawah pertanyaan Nisa. | Utas komentar terbuka. Balasan toko masuk tepat di bawah pertanyaan Nisa. |
| 6 | Kirim pesan | Nisa menerima satu pesan pribadi berisi katalog dan link pemesanan. | Kartu Nisa bergerak dari utas ke panel “Pesan pribadi”. Satu gelembung pesan dan kartu katalog muncul. |
| 7 | Catat dan teruskan | Sistem mencatat balasan. Staf melanjutkan obrolan setelah Nisa membalas. | Satu baris catatan terisi. Gelembung masuk “Warna sage masih ada?” muncul sebelum label “Ditangani staf” dan jawaban staf. |
| 8 | Ringkasan | Toko menyiapkan kata kunci dan isi pesan sebelum pengecekan dimulai. | Tiga kartu dari Baca, dengan konteks di tiap kartu: 15 menit interval cek contoh, 1 pesan pribadi per komentar yang cocok, 7 hari batas kirim. |
| 9 | Konsultasi | Mau pertanyaan harga lebih mudah ditangani saat postingan ramai? | Panggung mereda dan tombol “Konsultasi gratis” muncul. |

Panggung pastel siang dengan kartu postingan generik, swatch kain, utas komentar, dan panel chat. Label “Komentar publik” dan “Pesan pribadi” membedakan dua kanal di semua ukuran layar. Caption dan isi panggung disiapkan dalam ID/EN. Gunakan balasan yang sudah disiapkan toko dan penyaringan kata kunci sesuai alur Baca.

### 4.4 Integrasi dan QA setelah review storyboard

- Tambahkan data cerita ID/EN dan validasi di `site/content/solusi/cerita/`. Daftarkan `balas-komentar` di registry dan gunakan `makeTiming` untuk sembilan adegan dan enam node. Tambahkan `PanggungKomentar.tsx`, `ceritaFilmKomentar.ts`, dan gaya `bk-*` dengan film yang dimuat melalui konfigurasi `CeritaScroll.tsx`.
- Ikuti `cp1-qa.mjs` untuk `bk1-qa.mjs`. Cek lima viewport, scroll maju/mundur, tombol dan rel, reduced motion, GSAP diblokir, dan ID/EN. Cek urutan balasan publik, satu pesan pribadi, jawaban calon pembeli, dan staf. Pastikan contoh ID berulang berhenti di cek riwayat.
- Jalankan tes logika, build, typecheck, lint, format, regresi enam cerita sebelumnya, rak Solusi Terkait, etalase, dan Baca S8. Cek visual desktop dan HP dari build produksi.

### 4.5 Hasil implementasi (27 Nov 2026)

- User meminta N3 dikerjakan sampai selesai. Tonton Balas Komentar memakai contoh toko hijab dan konfigurasi yang sudah ditulis di Baca. Komentar Nisa berpindah dari postingan ke cek riwayat dan kata kunci, lalu dibalas publik dan dikirimi satu pesan pribadi. Catatan mempertahankan ID komentar yang sama. Staf muncul setelah balasan Nisa.
- Panggung HTML/CSS tersedia di detail ID dan EN. `CeritaScroll` memakai rel, caption, navigasi adegan, dan CTA bersama. Film GSAP dimuat saat mendekati panggung. Reduced motion memakai pose CSS sejak awal. Pose yang sama tersedia bila chunk GSAP gagal dimuat.
- Build produksi menghasilkan 75 halaman. TypeScript, ESLint, format berkas N3, dan tes logika 21/21 lulus. Regresi enam cerita sebelumnya lulus 48/48 di desktop ID dan HP EN. Baca S8 lulus 1.320/1.320, rak Solusi Terkait 41/41, dan etalase 114/114. `format:check` seluruh situs masih melaporkan 65 berkas lama di luar perubahan N3.
- `bk1-qa.mjs` lulus 130/130 tanpa error halaman. Cakupannya sembilan adegan maju dan mundur di lima viewport, rel lewat keyboard, tombol sebelumnya dan berikutnya, urutan balasan, CTA kontak, reduced motion, fallback ketika chunk GSAP diblokir, dan versi EN. Review visual desktop dan HP dilakukan dari build produksi. Pengujian HP fisik belum tercatat.
