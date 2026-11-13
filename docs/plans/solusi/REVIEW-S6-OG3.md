# Review S6 checkpoint: koreografi Order Grup

Tanggal: 8 November 2026. Status: disetujui user melalui “lanjut”; OG4 sudah dijalankan.

## Hasil

- Sembilan adegan memakai kamera yang disetujui pada OG2 dan state deterministik: lompat maju/mundur selalu membentuk keadaan yang benar.
- Adegan 1–5: enam bubble berantakan, order Bu Rina bergerak ke papan dan asisten, lima field terbentuk lalu menuju tabel, baris 0412 muncul, dan balasan konfirmasi kembali ke grup.
- Adegan 6: bubble kurir muncul, mobil maju, dan status berubah Baru → Dikirim → Selesai.
- Adegan 7: langit malam, jendela menyala, amplop menuju HP, lalu rekap contoh tampil.
- Adegan 8–9: angka contoh naik ke 3 jam/120 order/1 pesan, laptop tertutup, lalu kamera membuka seluruh dunia.
- Teks dunia memakai CSS3D presentasional di host DOM khusus. Kartu HTML tetap menjadi sumber bacaan dan kontrol rel tetap menyediakan alternatif keyboard.
- Lima area lantai mendukung hover/tooltip dan klik menuju adegan; loop berhenti di luar viewport atau saat tab tersembunyi, lalu seluruh renderer/resource dibersihkan saat unmount.

## Bukti otomatis

`tools/solusi/s6-og3.mjs`: **21/21 pemeriksaan lulus**.

- Layer WebGL/CSS3D, bubble, field, tabel, status, kurir, rekap, metrik, CTA, dan console bersih.
- Lompatan 1 → 9 → 4 → 7 mengembalikan status dan rekap yang benar.
- Reduced motion langsung menghasilkan status dan angka akhir.
- Navigasi keluar menghapus canvas serta layer CSS3D.
- HP 390 px tidak overflow dan stage/rekap tetap terlihat.
- CTA header tetap utuh selama compositing CSS3D (teks, ukuran, warna, dan opacity diperiksa dari DOM).
- Adegan 9: **53 draw call dan 8.252 segitiga**, di bawah target 120/35 ribu.

Regresi `tools/solusi/s6-greybox.mjs`: **39/39 lulus**. Tes logika: **11/11 lulus**. TypeScript, ESLint, Prettier, dan build produksi 54 halaman lulus.

Screenshot berada di scratchpad lokal `solusi-s6-og3`: adegan 1, 3, 6, 7, 8, 9, serta rekap HP.

## Batas tahap saat checkpoint

- OG4 belum dimulai: zoom/reflow menyeluruh, context-loss terkontrol, font lambat, route/bahasa/kontak lengkap, benchmark durasi panjang, serta perangkat Android/iOS nyata masih perlu QA pilot.
- Gaya figur tetap abstrak/prototipe sesuai persetujuan lanjut dari greybox; perubahan ke karakter Home/ORB akan menjadi perubahan desain baru.
- Tidak ada commit, push, deploy, atau publish. Localhost memakai build produksi terbaru.
