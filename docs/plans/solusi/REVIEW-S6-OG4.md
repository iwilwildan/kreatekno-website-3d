# Review S6 checkpoint: QA pilot Order Grup

Tanggal: 8 November 2026. Status: selesai teknis, menunggu review final user sebelum perluasan sebelas detail lain.

## Pengerasan

- Cerita menunggu `document.fonts.ready` paling lama 1,5 detik sebelum memasang world; durasi gerbang dicatat terpisah dari waktu unduh chunk dan inisialisasi renderer.
- Gagal memuat chunk dan kehilangan konteks WebGL memakai jalur fallback React yang sama. Sembilan kartu HTML dan rel tetap dapat dibaca/dipakai.
- Listener context-loss sekarang bernama dan dilepas saat dispose. Keluar route sebelum mount, resize saat animasi, dan mount–unmount berulang tidak meninggalkan canvas atau layer CSS3D.

## Bukti otomatis

`tools/solusi/s6-og4.mjs`: **47/47 pemeriksaan lulus**.

- Slow chunk 1.817 ms tetap menampilkan kartu HTML lalu pulih; chunk gagal menampilkan fallback dan mempertahankan sembilan adegan.
- Font lambat: gerbang font 1.513 ms; canvas siap dalam 2.802 ms pada run final. Keluar route saat gerbang pending tidak memasang renderer terlambat.
- Context loss terkontrol menampilkan pesan fallback, menyembunyikan host 3D, dan rel HTML tetap bekerja.
- Resize desktop → tablet → HP saat animasi mempertahankan status akhir, ukuran canvas 390×464 sama dengan stage, tanpa overflow.
- Reflow setara 200% pada basis 720 px menghasilkan viewport CSS 360 px tanpa overflow; hitbox rel 24×28 px, kartu 16–344 px, dan rekap tetap di dalam viewport.
- Route ID/EN, slug, copy EN, pesan WhatsApp detail, fokus modal, Escape, pemulihan fokus, dan Back ke ID lulus.
- Tiga siklus mount–unmount masing-masing menyisakan 0 layer.

Regresi: `s6-og3.mjs` **21/21**, `s6-greybox.mjs` **39/39**, dan tes logika **11/11** lulus. ESLint, Prettier, TypeScript melalui build, dan build produksi 54 halaman lulus.

## Bundle dan performa

- Tiga chunk lazy cerita mentransfer total **159.235 byte** cold-cache, di bawah target 300 KB gzip/transfer.
- Benchmark browser desktop dengan viewport emulasi HP 390×844 berlangsung **60,06 detik**: rata-rata **32,22 fps**, di atas target 30 fps. Tercatat 621 dari 1.935 frame di atas 33,34 ms (32,09%); dua sampel rata-rata 30,49 dan 33,94 fps.
- Scene yang tersisa pada akhir benchmark memakai 37 draw call/2.182 segitiga. Bukti OG3 untuk pandangan luas adegan 9 tetap 53 draw call/8.252 segitiga; keduanya di bawah 120/35 ribu.

## Keputusan OG-A sampai OG-J

- OG-A: cerita inline adalah pengalaman utama; overlay Tonton tetap pengembangan terpisah.
- OG-B: figur abstrak/prototipe dipertahankan untuk pilot yang direview; migrasi ke karakter Home/ORB adalah perubahan desain baru.
- OG-C–F: tablet/HP, host CSS3D, target rel, zoom/reflow dan rekap sudah dibuktikan oleh OG2–OG4.
- OG-G: label asisten, angka, kutipan, dan identitas klien tetap bertanda contoh.
- OG-H: solusi terkait memakai algoritme bersama, bukan override hardcode.
- OG-I: CTA halaman memakai pesan yang menyertakan judul detail.
- OG-J: HTML artifact sumber tidak tersedia; implementasi memakai tiga spesifikasi repo dan baseline visual yang sudah ditinjau.

## Batas prarilis

- Benchmark dilakukan di Edge/Chrome desktop dengan emulasi viewport, bukan Android/iOS fisik. Suhu, throttling, dan frame pacing perangkat nyata belum diukur.
- `NEXT_PUBLIC_WA_NUMBER`, `NEXT_PUBLIC_CONTACT_EMAIL`, dan `NEXT_PUBLIC_INSTAGRAM_URL` masih kosong. Dialog berfungsi dan pesan benar, tetapi kanal produksi harus diisi sebelum rilis.
- D4 belum dimulai karena P0–P2 untuk sebelas slug lain belum selesai. OG4 tidak mengubah atau menganggap cerita Order Grup berlaku untuk slug lain.
- Tidak ada commit, push, deploy, atau publish. Build produksi tetap berjalan di localhost:3000.

Screenshot dan laporan JSON berada di scratchpad lokal `solusi-s6-og4`, termasuk fallback chunk, fallback context-loss, dan rekap 360 px.
