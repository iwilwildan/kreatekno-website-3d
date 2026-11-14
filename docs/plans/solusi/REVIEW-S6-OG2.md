# Review S6 checkpoint: fondasi detail + greybox Order Grup

Tanggal: 8 November 2026. Status: **disetujui user melalui instruksi “lanjut”; OG3 dimulai**.

## Hasil

- Template detail bersama tersedia untuk 12 slug. Solusi tanpa cerita memakai daftar langkah HTML; Order Grup memakai cerita inline sembilan adegan.
- Order Grup memiliki copy panjang ID/EN, metadata, FAQ JSON-LD, ringkasan, masalah, yang dibangun, perbandingan, angka/kutipan contoh, cocok/tidak, persiapan, aplikasi, FAQ, CTA, dan solusi terkait.
- Cerita tetap terbaca dari kartu dan teks HTML awal. WebGL dimuat lazy dan hanya menjadi presentasi greybox.
- Greybox berisi lima area: grup chat, asisten, tabel order, kurir, dan rumah pemilik. Sembilan framing mengikuti tabel kamera sumber.
- Desktop menempatkan kartu di kiri dan fokus dunia di area bebas. Tablet tegak/HP menaruh stage 55svh di atas kartu. Rel HP minimum 24×28 px.
- CTA hero, adegan 9, dan penutup membuka dialog kontak bersama dengan pesan berjudul solusi aktif.

## Bukti

`tools/solusi/s6-greybox.mjs`: **39/39 pemeriksaan lulus**.

- Viewport: 1440×900, 1024×1366, 390×844, dan 360×800.
- Satu H1, sembilan kartu, sembilan kontrol rel, tidak ada overflow horizontal, canvas WebGL terpasang, target rel cukup besar, adegan Rekap aktif saat dipilih, dan console aplikasi bersih.
- Route EN, sembilan adegan EN, modal kontak, pesan detail, Esc, reduced motion menuju adegan 9, dan slug asing 404 lulus.
- 10/10 tes logika lama tetap lulus. TypeScript, ESLint, Prettier, dan build produksi 54 halaman lulus.
- Screenshot desktop dan HP berada di scratchpad lokal `solusi-s6`, bukan di `public/` atau Git.

## Yang perlu direview user

1. Komposisi lima area dan sembilan framing sebelum material serta animasi final.
2. Arah figur: lanjutkan figur abstrak/prototipe atau adaptasi karakter Home/ORB.
3. Kepadatan stage HP/tablet tegak dan posisi panel teks contoh.

## Batas tahap

- Belum ada koreografi bubble/data/status, perubahan siang-malam, material/bayangan final, CSS3D final, atau raycast area.
- OG3 hanya dimulai setelah review checkpoint ini.
- Tidak ada commit, push, deploy, atau publish. Localhost memakai build produksi terbaru.
