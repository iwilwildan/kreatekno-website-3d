# Detail Solusi: Faktur pemasok tercatat dan dicek sebelum dibayar

Per 27 Nov 2026, **Tonton N4 lulus QA browser 121/121 dan sudah direview user**. Tes HP fisik belum tercatat.

Induk: [PLAN-KATALOG-N8N](PLAN-KATALOG-N8N.md) bagian 4.3 (sumber, rel draf, temuan, keputusan). Kontrak template, route, mesin dan QA: [PLAN-DETAIL](PLAN-DETAIL.md). Dokumen ini hanya mencatat status dan keputusan khusus `faktur-pemasok`.

## 1. Identitas

| Item | Nilai |
|---|---|
| Slug | `faktur-pemasok` |
| Status layanan | Siap dibuat (`ide`); bukan pekerjaan klien |
| Route | `/solusi/faktur-pemasok` dan `/en/solutions/faktur-pemasok` |
| Industri | Retail & F&B, Logistik |
| Tim | Keuangan & admin, Operasional |
| Aplikasi | Gmail, Google Drive, Google Sheets, WhatsApp |
| Sumber | Template publik n8n.io [4247](https://n8n.io/workflows/4247), [4452](https://n8n.io/workflows/4452), [4376](https://n8n.io/workflows/4376), [4868](https://n8n.io/workflows/4868) |
| Data | `site/content/solusi/items/faktur-pemasok.ts`, EN katalog di `catalog.ts` |
| Kode Tonton | `fk` (prefix CSS `fk-*`, QA `tools/solusi/fk1-qa.mjs`) |

## 2. Tahapan

| Tahap | Isi | Status |
|---|---|---|
| N0 | Slug, copy katalog ID (pertanyaan, jawaban, masalah, langkah, perbandingan, kecocokan, persiapan, FAQ), ringkasan EN, kartu masalah, kotak etalase | Disetujui 23 Nov |
| N1a | Copy Baca ID/EN lengkap dengan klien, kutipan, dan angka contoh | Disetujui 24 Nov |
| N4 | Storyboard → review → cerita Tonton → QA → review | Implementasi, QA, dan review user selesai 27 Nov. |

## 3. Log

- 23 Nov 2026 (N0): item dan subplan dibuat. Copy katalog ditulis dari alur template, tanpa menyalin teks atau prompt template.
- 23 Nov 2026 (N1a): copy ID/EN lengkap dengan klien set A; rincian di PLAN-KATALOG-N8N bagian 10.
- 27 Nov 2026 (N4): user meminta lanjut setelah membuka preview N3. Riset dan storyboard dicatat di bagian 4.
- 27 Nov 2026 (N4): user meminta lanjut setelah menerima storyboard. Cerita ID/EN diimplementasikan dan diuji di preview produksi lokal.
- 27 Nov 2026 (N4): user mengatakan “lanjutkan” saat preview N4 terbuka. N4 dicatat sudah direview dan N5 dimulai.

## 4. N4: cerita Tonton Faktur Pemasok

### 4.1 Riset 27 Nov 2026

- Template 4247 memisahkan pembacaan dan pengisian data dari pencocokan nama barang dan biaya ke data master. Template 4452 memperlihatkan faktur masuk dari beberapa sumber, keputusan manusia, dan pencatatan hasil. Storyboard memakai dua sumber sesuai Baca, email dan folder bersama. [Template 4247](https://n8n.io/workflows/4247) · [Template 4452](https://n8n.io/workflows/4452)
- Pemeriksaan faktur ganda perlu memakai isi dokumen agar salinan yang berganti nama atau masuk lewat kanal lain tetap dikenali. Pada contoh N4, sistem mengenali salinan dengan pemasok dan nomor yang sama, lalu mengonfirmasi tanggal dan total. Bila nomor sama tetapi isi penting berubah, staf meninjau dokumen itu sebagai kemungkinan koreksi. Ini keputusan rancangan untuk cerita, berdasarkan pembanding bahwa sistem faktur dapat memeriksa beberapa atribut sekaligus. Sumber historis 4376 dan 4868 belum dapat diverifikasi ulang dalam sesi ini. [Dokumentasi pemeriksaan duplikat Oracle](https://docs.oracle.com/en/cloud/saas/financials/26a/fappp/how-can-i-find-duplicate-invoices-without-considering-the.html)
- Selisih satu baris dihitung dari selisih harga per unit dikali jumlah barang. Storyboard memakai daftar harga yang sudah disepakati toko, sesuai Baca. Setelah pemilik memilih Setujui atau Tolak, keputusan masuk tabel dan pembayaran ditangani bagian keuangan. [Rumus selisih harga Oracle](https://docs.oracle.com/en/cloud/saas/financials/25d/fappp/what-s-the-difference-between-performing-a-price-correction-and.html) · [Template persetujuan](https://n8n.io/workflows/4452)

### 4.2 Contoh yang diusulkan

Toko bangunan menerima PDF faktur **FP-028** dari **Pemasok S-02** melalui email. Faktur bertanggal 25 Nov 2026 dan jatuh tempo 9 Des 2026. Admin menyimpan salinannya dengan nama lain di folder bersama.

| Barang | Jumlah | Harga per unit di faktur | Harga yang disepakati | Selisih baris |
|---|---:|---:|---:|---:|
| Semen 50 kg | 20 sak | Rp64.500 | Rp63.000 | Rp30.000 |
| Pelapis antibocor | 4 ember | Rp112.500 | Rp112.500 | Rp0 |

Total faktur Rp1.740.000. Total berdasarkan daftar harga Rp1.710.000. Selisih Rp30.000 berasal dari baris semen.

Pemilik memilih **Tolak** karena harga semen berbeda. Status tabel berubah dari **Menunggu keputusan** menjadi **Ditolak · perlu koreksi**. Admin bisa memakai status dan rincian selisih untuk meminta faktur koreksi ke pemasok.

### 4.3 Rel dan adegan

Rel enam node mengikuti urutan Faktur masuk → Isi dibaca → Kolom terisi → Harga dicocokkan → Masuk tabel → Keputusan pemilik.

| # | Adegan | Caption draf | Panggung |
|---|---|---|---|
| 1 | Sebelum | Selisih kecil per sak bisa luput saat faktur diketik ulang. | Tumpukan PDF dan tabel ketikan manual. Baris harga semen muncul di antara baris barang lain. |
| 2 | Faktur masuk | Faktur PDF tiba lewat email. | Dua sumber terlihat berdampingan. Kartu FP-028 keluar dari email, sementara satu salinan dengan nama file lain terlihat di folder. |
| 3 | Isi dibaca | Sistem mengambil teks dari faktur. | PDF membuka lembar faktur. Nomor, tanggal, baris barang, dan total disorot berurutan. |
| 4 | Kolom terisi | AI mengisi enam kolom dari isi faktur. | Informasi beralih ke kartu terstruktur berisi nomor, pemasok, tanggal, jatuh tempo, daftar barang, dan total. |
| 5 | Harga dicocokkan | Harga semen di faktur berbeda Rp1.500 per sak. | Matriks dua baris membandingkan harga faktur dan daftar pemasok. Pelapis cocok. Baris semen menampilkan 20 sak × Rp1.500 dan penanda selisih Rp30.000. |
| 6 | Masuk tabel | FP-028 tercatat sekali dengan tanda selisih. | Satu baris masuk tabel dan menunjukkan status menunggu keputusan. Salinan dari folder menampilkan nomor dan pemasok yang sama lalu berhenti di label “Sudah tercatat”. |
| 7 | Keputusan pemilik | Pemilik menolak faktur dan mencatat alasan. | Ringkasan memperlihatkan Rp1.740.000 dan selisih Rp30.000. Tombol Setujui dan Tolak muncul. Pilihan Tolak mengubah status baris menjadi “Ditolak · perlu koreksi”. |
| 8 | Ringkasan | Faktur, selisih, dan keputusan bisa dilihat di satu catatan. | Tiga angka contoh dari Baca merangkum enam kolom, dua sumber, dan satu pilihan untuk mencatat keputusan. |
| 9 | Konsultasi | Mau selisih harga pemasok kelihatan sebelum bayar? | Panggung mereda dan tombol “Konsultasi gratis” muncul. |

Panggung pastel siang memakai satu dokumen yang berubah menjadi tabel dan kartu keputusan. Baris yang cocok dan baris yang berselisih memakai label dan ikon selain warna. Caption dan isi panggung disiapkan dalam ID/EN.

### 4.4 Integrasi dan QA setelah review storyboard

- Daftarkan data cerita ID/EN di `site/content/solusi/cerita/`, gunakan `makeTiming` untuk sembilan adegan dan enam node, lalu tambahkan `PanggungFaktur.tsx`, `ceritaFilmFaktur.ts`, dan gaya `fk-*`. Pakai pola N3 untuk lazy load dan pose CSS pada reduced motion atau saat GSAP gagal dimuat.
- Validasi subtotal per baris, total faktur, total daftar harga, dan selisih. Cek bahwa nomor faktur yang sama muncul di dokumen, tabel, dan kartu keputusan. `fk1-qa.mjs` mencakup lima viewport, scroll maju/mundur, tombol rel, EN, CTA, reduced motion, dan GSAP diblokir. Pastikan salinan tidak menambah baris dan keputusan pemilik mengubah status yang benar.
- Jalankan build, TypeScript, lint, format berkas yang berubah, tes logika, regresi cerita sebelumnya dan etalase, serta cek visual desktop dan HP.

### 4.5 Hasil implementasi (27 Nov 2026)

- Cerita ID/EN mengikuti FP-028 dalam sembilan adegan. Dokumen terbuka dari lampiran email dan berubah menjadi enam kolom. Perbandingan menampilkan selisih Rp1.500 per sak semen, atau Rp30.000 untuk 20 sak. Tabel menyimpan satu baris dan melewati salinan. Status berubah menjadi Ditolak · perlu koreksi setelah pemilik memilih Tolak.
- `PanggungFaktur` menghitung subtotal dan selisih dari nominal dalam satu contoh faktur, sehingga nomor dan total konsisten dari dokumen hingga keputusan. Skema memeriksa kedua total dan pola satu baris berselisih serta satu baris cocok. Film dimuat saat mendekati panggung. Reduced motion dan kegagalan GSAP memakai pose CSS.
- Build produksi, TypeScript, ESLint, format berkas N4, dan tes logika 22/22 lulus. Regresi tujuh cerita sebelumnya lulus 56/56 di desktop ID dan HP EN. Regresi etalase lulus 114/114.
- `fk1-qa.mjs` lulus 121/121 tanpa error halaman pada build akhir. Cek mencakup lima viewport maju/mundur, EN, keyboard dan tombol rel, penolakan faktur, salinan yang dilewati, CTA, reduced motion, dan fallback ketika GSAP diblokir. Cek visual desktop dan HP dilakukan dari build produksi. Kolom dokumen dirapikan agar kode pemasok terbaca dalam satu baris. Tes HP fisik belum tercatat.
