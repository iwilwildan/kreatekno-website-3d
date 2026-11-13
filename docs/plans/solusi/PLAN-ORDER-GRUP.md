# Detail Solusi: Order Grup

Tanggal: 8 Nov 2026. Status: **OG0–OG4 selesai teknis; QA pilot menunggu review final user**.

Induk: [PLAN-SOLUSI](../../../PLAN-SOLUSI.md). Kontrak bersama: [PLAN-DETAIL](PLAN-DETAIL.md). Urutan kerja mengikuti induk; dokumen ini tidak memulai implementasi.

## 1. Identitas dan sumber

| Item                         | Nilai                                                                                                                                                           |
| ---------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Slug                         | `order-grup`                                                                                                                                                    |
| Judul                        | Order dari grup WhatsApp tercatat sendiri ke Google Sheets                                                                                                      |
| Status layanan dalam katalog | Sudah berjalan; status pengerjaan website tetap belum                                                                                                           |
| Route target                 | `/solusi/order-grup` dan `/en/solutions/order-grup`                                                                                                             |
| Tim / industri               | Operasional, Penjualan / Logistik, Retail & F&B                                                                                                                 |
| Aplikasi                     | WhatsApp, Google Sheets                                                                                                                                         |
| Prototipe                    | [Detail Solusi Order Grup Scroll](https://claude.ai/artifact/VBVY47Dr2AuRdz3YkBwwgC)                                                                            |
| Spesifikasi                  | [LOGIKA](../../SOLUSI-DETAIL-ORDER-GRUP-V1-LOGIKA.md), [VISUAL](../../SOLUSI-DETAIL-ORDER-GRUP-V1-VISUAL.md), [COPY](../../SOLUSI-DETAIL-ORDER-GRUP-V1-COPY.md) |
| Data katalog lama            | [COPY katalog bagian 19.1](../../SOLUSI-V1-COPY.md#191-order-grup)                                                                                              |

Dokumen sumber bertanggal 4 Nov; user menyerahkannya di chat 7 Nov. Salinan markdown disimpan persis. Artifact sudah ditinjau langsung: navigasi adegan, pemisahan data, status pengiriman, rekap malam, layout desktop/HP, dan modal kontak. HTML sumber artifact belum tersedia di repo; jangan menyebut `prototype/solusi-detail-order-grup-v1.html` sebagai file yang sudah ada.

## 2. Lingkup pilot

Target rencana: satu halaman detail ID/EN dengan cerita inline 9 adegan, konten HTML lengkap, kontak, solusi terkait, fallback dan reduced motion. Ini bukan kode otomasi WhatsApp/Sheets yang benar-benar memproses order; seluruh perjalanan di halaman adalah ilustrasi.

Prototipe memakai figur manusia sederhana, robot ungu, papan chat/tabel, mobil kurir dan rumah pemilik. Pilihan mempertahankan figur tersebut atau mengadaptasi karakter Home/ORB belum diputuskan untuk implementasi. Jangan mengganti diam-diam karena gaya yang berbeda akan memengaruhi komposisi, pose, dan anggaran.

Overlay Tonton lama belum otomatis dibatalkan. OG0 harus menyelesaikan hubungannya dengan inline sebelum ada implementasi cerita ganda. Untuk 11 solusi lain, konten dan storyboard Order Grup tidak diwariskan.

## 3. Konten HTML dan bukti

- Hero: judul, status/tim/industri/tanggal, pertanyaan dan jawaban ringkas, konsultasi dan kembali ke etalase.
- Cerita: pembuka, 9 kartu, rel, teks dunia HTML. Struktur isi berikutnya mengikuti template fondasi.
- Tambahan konten: `painsLead`, `built`, kutipan opsional, `cerita.intro`, `scenes`, `areas`, `world`; semua ID/EN. Angka hasil menggunakan data `metrics` yang sama di dunia dan bagian hasil.
- Contoh order utama: Bu Rina, 3 dus air mineral 600ml, Jl. Sudirman No. 12, transfer, nomor 0412. Contoh revisi "jadi 12 dus ya" merujuk order Toko Berkah yang berbeda; jangan menerapkannya ke Bu Rina.
- Angka contoh: 3 jam, sekitar 120 order/hari, 1 rekap/malam. Rekap satu hari: 118 masuk, 112 selesai, 6 menunggu, Rp14,2 jt. Label papan 66 order mewakili keadaan lebih awal. Putuskan konsistensi narasi; jangan menyatakan semuanya metrik terverifikasi.
- Kutipan pemilik dan data proyek diberi penanda contoh sesuai sumber sampai ada persetujuan data nyata. Frasa "disamarkan" tidak menggantikan penanda contoh.
- Solusi terkait prototipe (`rekap-penjualan`, `stok-menipis`) berbeda dari hasil rumus (`asisten-sop`, `stok-menipis`). Pilihan editorial vs algoritme dicatat di OG0.

## 4. Storyboard dari prototipe

Angka timing adalah baseline sumber, bukan jaminan hasil render repo. Scroll memilih adegan, lalu jam lokal memutar aksi; kembali ke adegan mengulang aksi. Tabel kamera lengkap tetap di LOGIKA 5.3; dimensi/set/anchor di VISUAL 9 agar tidak ada dua salinan angka yang menyimpang.

| # / ID usulan   | Fokus dan aksi                                                            | Keadaan akhir / yang harus diuji                                                          |
| --------------- | ------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------- |
| 1 `sebelum`     | Papan chat berantakan, 6 bubble, label terlewat, admin mengetik ulang     | Keadaan awal manual; gerak ambient mati saat reduced motion                               |
| 2 `pesan-masuk` | Pesan Andi membawa order Bu Rina; terbang ke papan pada 0,3–1,5 dtk       | Bubble utuh di slot, isi dapat dibaca                                                     |
| 3 `ai-membaca`  | Pesan masuk robot; 5 field muncul bertahap sekitar 1,4–2,74 dtk           | Pelanggan/barang/jumlah/alamat/bayar tepat; tidak ada data tersisa dari adegan sebelumnya |
| 4 `tersimpan`   | Field menuju tabel; baris 0412 muncul 1,35 dtk, penjelasan revisi 1,6 dtk | Order 0412 berstatus Baru, revisi tidak membuat order duplikat dalam narasi               |
| 5 `konfirmasi`  | Balasan Asisten Order terbang ke grup, label Tercatat muncul 1,6 dtk      | Nomor, pelanggan dan barang sama dengan tabel                                             |
| 6 `status`      | Bayu mengirim `kirim 0412`, mobil bergerak, lalu `selesai 0412`           | Baru → Dikirim (1,15 dtk) → Selesai (2,55 dtk); mundur ke adegan 4 mengembalikan Baru     |
| 7 `rekap`       | Langit malam, amplop menuju HP, rekap muncul sekitar 1,4–2 dtk            | 118 = 112 + 6, angka contoh terbaca; layar HP tidak terpotong                             |
| 8 `hasil`       | Angka naik pada 0,3–1,8 dtk, laptop ditutup, admin melayani               | 3/120/1 dengan label contoh; reduced motion langsung angka akhir                          |
| 9 `untuk-anda`  | Kamera membuka pandangan seluruh dunia, CTA pada kartu                    | Keadaan akhir lengkap walaupun langsung melompat dari adegan 1; CTA bisa diklik/keyboard  |

Lima area klik: grup → adegan 2, asisten → 3, tabel → 4, kurir → 6, rumah → 7. Rel HTML menyediakan akses setara tanpa raycast. Teks penting adalah konten HTML; teks laptop hanya dekorasi.

## 5. Penyesuaian yang perlu direview

| ID   | Temuan / pertanyaan keputusan                              | Usulan atau langkah pembuktian                                                                                                                |
| ---- | ---------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------- |
| OG-A | Inline vs Tonton overlay lama                              | Tentukan penggantian, koeksistensi dengan fungsi berbeda, atau pengembangan berikutnya; jangan menganggap lampiran membatalkan keputusan lama |
| OG-B | Figur/robot prototipe vs karakter Home/ORB                 | Setujui gaya dan peran sebelum greybox dikunci; jika berubah, ukur ulang komposisi/anggaran                                                   |
| OG-C | Tablet tegak 768–1024 px kurang ruang; teks HP kecil       | Uji layout bertumpuk untuk semua tablet tegak yang perlu, termasuk 1024 px; perbesar fokus teks atau sediakan bacaan HTML setara              |
| OG-D | CSS3D zoom dan node DOM dikelola React                     | Buktikan D3 pada navigate/unmount/zoom; jangan memindahkan node secara ad hoc                                                                 |
| OG-E | Tombol rel prototipe 19×28 px                              | Usulan hitbox ≥24×28 px, tetap muat di 360 px; titik visual boleh kecil                                                                       |
| OG-F | Teks rekap terpotong pada ukuran tertentu                  | Koreksi kamera/anchor pada adegan 7; toleransi lama tidak berlaku untuk bug yang sengaja diperbaiki                                           |
| OG-G | Label AI/asisten, warna platform, angka dan kutipan contoh | Review copy/brand; jangan mengubah sumber asli atau mengubah contoh menjadi klaim nyata                                                       |
| OG-H | Solusi terkait manual vs rumus                             | Pilih satu kebijakan; jika override, data eksplisit dan validasi slug, bukan hardcode di komponen                                             |
| OG-I | Semua CTA termasuk header memakai pesan detail             | Usulan ikuti prototipe dengan judul solusi; konfirmasi konsistensi komponen kontak bersama                                                    |
| OG-J | Bahan HTML sumber belum disimpan                           | Dapatkan ekspor sumber artifact sebelum port persis; bila membangun dari spesifikasi, catat pendekatan dan baseline yang tersedia             |

Poin-poin ini belum merupakan keputusan user. Pilihan yang berdampak pada desain disajikan bersama hasil audit/greybox konkret, bukan meminta persetujuan untuk setiap detail rutin.

## 6. Tahapan pilot

| Tahap                    | Dependensi                                              | Pekerjaan dan bukti selesai                                                                                                                      | Status                                                                                               |
| ------------------------ | ------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------ | ---------------------------------------------------------------------------------------------------- |
| OG0 — Bahan dan batas    | D0, sumber tersedia                                     | Verifikasi repo/ekspor artifact, selesaikan OG-A/B dan kebijakan konten, kunci anggaran serta daftar viewport; catat sumber keputusan            | Selesai teknis 8 Nov; artifact HTML tetap tidak tersedia, implementasi memakai tiga spesifikasi repo |
| OG1 — Detail HTML        | D1–D2, OG0                                              | Isi ID/EN, 9 kartu dan teks dunia, bagian hasil/contoh, CTA dan terkait; screenshot HP/desktop; alur bisa dipakai tanpa 3D                       | Selesai teknis 8 Nov                                                                                 |
| OG2 — Greybox dan kamera | OG1, kontrak D3                                         | Lima area, 9 framing, rig kamera; uji tablet tegak, header/rel, CSS3D/zoom dan keterbacaan; review sebelum material/gerak final                  | Selesai teknis 8 Nov; HTML overlay diuji, CSS3D final sengaja belum dikunci                          |
| OG3 — Koreografi         | OG2 direview; kontrak dan implementasi awal D3 tersedia | Semua aksi tabel storyboard, siang/malam, label/tabel/rekap, lompatan maju/mundur dan input cepat; sekaligus memvalidasi D3; review rekaman alur | Disetujui user 8 Nov melalui “lanjut”; 21/21 cek koreografi lulus                                    |
| OG4 — QA pilot           | OG3, D3; checklist bersama                              | Fallback, reduced motion, lifecycle, route/bahasa/kontak, perangkat nyata, build dan anggaran; bukti serta review final                          | Selesai teknis 8 Nov; 47/47 cek lulus, perangkat fisik dan kanal kontak asli tetap batas prarilis    |

Hasil OG4 menjadi masukan D4; OG4 tidak menunggu regresi seluruh slug selesai.

Target performa awal mewarisi PLAN-DETAIL bagian 6; baseline sumber 61–114 draw call/±11–23 ribu segitiga. Material dan bayangan prototipe memakai NeutralToneMapping dan PCFShadowMap; jangan menerapkan preset etalase tanpa pengujian karena sumber keduanya berbeda.

## 7. Kriteria selesai khusus

- [ ] Checklist bersama PLAN-DETAIL terpenuhi; HTML dan cerita dilaporkan terpisah.
- [ ] Setiap order/field/nomor/status konsisten; contoh revisi tidak tertukar dengan order utama.
- [ ] Adegan 1 → 9 → 4 → 7 menghasilkan keadaan benar; masuk ulang memutar dari awal; submit kontak tidak mengganggu state.
- [ ] Font lambat, load chunk lambat/gagal, resize saat animasi, keluar route sebelum mount, context lost dan reduced motion tetap memberi pengalaman yang dapat dibaca.
- [ ] Teks penting setiap adegan terbaca; rekap tidak terpotong, kontrol rel dapat diketuk, kartu tidak menutup informasi utama.
- [ ] Angka/kutipan tetap berlabel contoh sampai bukti dan izin tersedia; CTA memakai kontak asli sebelum rilis.
- [ ] OG-A sampai OG-J ditutup dengan keputusan atau batas yang eksplisit; tidak ada persetujuan yang diasumsikan dari lampiran.
- [ ] Bukti akhir mencantumkan build, bahasa, ukuran layar, perangkat, performa dan tanggal review.

## 8. Log

- 7 Nov 2026: prototipe dan tiga dokumen dipelajari; subplan pilot disusun atas permintaan pemisahan plan. Dokumen sumber disalin tanpa perubahan. Belum membuat halaman/engine, belum mengukur performa repo, dan belum mengubah status persetujuan desain.
- 8 Nov 2026: OG0 menetapkan cerita inline sebagai pengalaman utama pilot; overlay Tonton lama tidak dibuat ganda dan tetap pengembangan tersendiri. Figur greybox abstrak dipakai tanpa mengunci gaya final. OG1 menambah copy ID/EN, sembilan kartu, label contoh, CTA detail dan terkait berbasis algoritme. OG2 menambah lima area kode-native, sembilan framing kamera, layout tablet tegak bertumpuk, rel minimum 24×28 px dan lazy WebGL. QA browser 39/39 lulus pada 1440, 1024 tegak, 390 dan 360 px; OG3 menunggu review user.
- 8 Nov 2026: user menyetujui checkpoint greybox melalui “lanjut”. OG3 menambah material/cahaya, CSS3D presentasional, bubble/field terbang, pembentukan tabel, konfirmasi, status Baru→Dikirim→Selesai, mobil kurir, langit malam, amplop/rekap, angka naik, laptop tertutup, hover/raycast lima area, pause/resume loop dan cleanup. QA `s6-og3.mjs` lulus 21/21; adegan 9 memakai 53 draw call/8.252 segitiga. OG4 belum dimulai.
- 8 Nov 2026: user menyetujui OG3 melalui “lanjut”. OG4 menyatukan fallback gagal chunk dan context lost, membatasi tunggu font 1,5 detik, menguji resize/reflow 200%, ID/EN/kontak/riwayat, tiga siklus lifecycle, serta benchmark emulasi HP 60 detik. `s6-og4.mjs` lulus 47/47; detail bukti di `REVIEW-S6-OG4.md`. Perangkat Android/iOS fisik dan suhu belum diuji; nomor WhatsApp, email, dan Instagram produksi belum dikonfigurasi.
