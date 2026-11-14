# Audit awal etalase Solusi, 7 November 2026

Lingkup sesi: halaman depan `/solusi` dan `/en/solutions`, Cari, Kartu, hasil dan kontak. Tidak mencakup halaman detail, cerita inline atau overlay Tonton. User memajukan prioritas dari setelah Home tahap 11 menjadi mulai sekarang; Home tahap 6 dan perubahan yang belum di-commit dipertahankan.

## Keadaan checkout

- Route Solusi masih `PagePlaceholder`; belum ada komponen toko, route hasil, world Solusi atau data katalog di situs saat audit dimulai.
- Versi di `site/package.json`: three 0.186.1, Next.js 16.4.3, next-intl 4.14.9, Zod 4.6.7. Tool Playwright 1.64.1 dan Node 24.14.0. Tidak ada upgrade atau library tambahan.
- Home punya kualitas adaptif di `world/index.ts`, bukan modul `core/quality.ts` yang diasumsikan sumber lama. Pembangun Heru sudah memakai `buildMember`; refactor kasir perlu mengaudit ulang `heru.ts` saat S3, tidak menyentuhnya di S0/S1.
- Pada S0, `LangSwitch` hanya membangun pathname dan params. S2 kini mempertahankan query/hash khusus route Solusi tanpa mengubah perilaku route lain.
- Nomor bisnis, Instagram dan email asli belum tersedia dari konfigurasi yang dibaca. Kontak contoh prototipe tidak boleh disalin sebagai tujuan aktif. Ini input operasional sebelum kanal kontak diaktifkan, bukan alasan menunda HTML dialog.

## Riset ulang

Sumber primer diperiksa 7 Nov 2026:

- [Manual multiple scenes Three.js](https://threejs.org/manual/pages/multiple-scenes.html) dan [WebGLRenderer](https://threejs.org/docs/pages/WebGLRenderer): satu canvas/scissor tetap cocok. Contoh membersihkan buffer lalu menggambar setiap scene yang terlihat. Konsekuensi untuk implementasi S4/S5: flag kotor hanya menghemat penghitungan rect/transform; setelah full clear, **semua pass yang terlihat harus dirender lagi**. Source `frame()` v1 juga melakukan clear penuh sebelum toko dan `rakFrame()`. Cache geometri tidak menyimpan piksel.
- [Navigasi next-intl](https://next-intl.dev/docs/routing/navigation): query adalah bagian terpisah dari pathname lokal. Slug lokal tetap dibangun oleh helper, query/hash Solusi dibawa secara eksplisit. Hasil dibaca di client agar halaman statis tetap bisa dibangun.
- [WCAG 2.5.7](https://www.w3.org/WAI/WCAG22/Understanding/dragging-movements.html): drag perlu alternatif pointer tanpa drag; keyboard saja tidak cukup. Keputusan tombol Ya/Tidak/Solusi 4 Nov tetap dipakai.
- [Dialog WebKit](https://webkit.org/blog/12209/introducing-the-dialog-element/) dan [MDN dialog](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/dialog): gunakan `showModal()`/`close()`, fokus awal dan pemulihan fokus; jangan mengganti dengan toggle atribut `open` atau trap buatan.
- [TypeScript Node.js](https://nodejs.org/api/typescript.html): type stripping tersedia; resolver runtime tidak membaca alias `tsconfig`. Tes memakai Node bawaan dengan hook lokal untuk impor relatif tanpa ekstensi, tanpa paket runner baru.

Tidak ada keputusan produk baru yang diambil dari riset secara otomatis.

## Keputusan user dalam sesi ini

1. Cari: enam hasil per tampilan, tombol berikutnya; navigasi sebelumnya tersedia. Filter baru kembali ke halaman pertama. Nomor tag 1–6 lokal ke sajian, dengan rentang hasil/jumlah total di HTML pada S2.
2. Kartu: urutan rekomendasi tanpa persentase. Rumus bobot dan penalti v1 tetap dipakai secara internal; tie dipecahkan oleh status berjalan lalu urutan data. Tidak menyebut skor sebagai peluang keberhasilan.

## Kontrak URL untuk S2

- `/solusi#cari` dan `#kartu` tetap mode satu dokumen; tidak membangun ulang toko. Hash asing kembali ke etalase. Hash menjadi satu-satunya sumber mode; listener `hashchange`/`popstate` dibersihkan saat unmount.
- Back/Forward mengembalikan mode. Masuk Kartu dari mode lain memulai sesi baru seperti v1. Isi input/filter Cari tetap selama dokumen hidup; refresh mode Cari mulai struk kosong. Mode/hasil tidak bergantung variabel world.
- Hasil ID `/solusi/hasil?b=retail&y=k1,k5&n=k3`, EN `/en/solutions/results?...`. Query memakai ID taksonomi dan kartu yang sama di kedua bahasa; noindex dan canonical tanpa query. Refresh, tautan berbagi dan Back/Forward membaca query kembali.
- Parser menerima hanya industri dan ID kartu yang dikenal. ID duplikat dihitung sekali, termasuk parameter berulang. ID yang ada sekaligus di `y` dan `n` dikeluarkan dari keduanya; industri ganda/tidak dikenal menjadi kosong. Lebih dari sembilan jawaban unik menghasilkan keadaan tanpa hasil, tidak dipotong menjadi rekomendasi arbitrer. Query kosong menghasilkan keadaan tanpa hasil.
- Ganti bahasa membawa query/hash Solusi, termasuk saat link dibuka di tab baru. Jangan memakai `useSearchParams` pada server lalu membuat route hasil dinamis. Implementasi tautan dan pengujian browser ada di S2; `url.ts` sudah menyediakan parser/serializer yang dites.
- Saat 3D aktif, tag/ringkasan dan tautan detail tetap punya kontrol HTML yang bisa dioperasikan keyboard. Menghilangkan daftar visual fallback tidak boleh menghilangkan akses hasil dari accessibility tree. S5 harus membuktikan ini, bukan sekadar memeriksa canvas.

## Bukti S0

- `tools/solusi/measure.mjs`: menjalankan prototipe asli melalui HTTP lokal sementara; hook pengukuran disisipkan hanya dalam memori. File sumber tidak diubah. Menunggu font dan dua frame sebelum mengukur, RNG 0, reduced motion untuk posisi deterministik, DPR 1.
- 11 viewport VISUAL, 13 keadaan tiap viewport: hero, etalase, struk, 1–6 kotak, kontak, pemilihan industri, deck, hasil. Screenshot 8 keadaan per viewport; kepala/bahu, bibir meja, kamera dan pusat tag tercatat di JSON. Tidak memanggil kanal kontak eksternal.
- Hasil lokal: `C:/Users/wilda/.codex/visualizations/2026/11/07/01a1b4e5-83a5-76d3-b46d-6cca5d360054/solusi-s0/`. Screenshot hanya dikirim di chat, tidak dimasukkan ke situs atau git.
- `compare.mjs` membaca tabel VISUAL langsung, tidak menulis ulang acuan. Kotak utama/font VISUAL 6/8/9/10/11, kamera 7.4 dan semua pusat tag 7.5. Toleransi kotak 1 px, font 0,5 px, kamera 0,002, tag 2 px. Elemen dekor/inner lain dan pemetaan selector situs dilengkapi bersama komponen S2/S5/S7; belum ada klaim visual situs selesai.
- Pengambilan pertama 1920 px terlalu cepat: font belum siap dan tag sajian kedua belum tampak. Diperbaiki dengan `document.fonts.load` dan menunggu semua tag `.on` berukuran 30 px; pengambilan ulang cocok dengan tabel. Semua viewport tanpa page error.

## Hasil S1 dan batas review

- `site/content/solusi/`: 12 item lengkap ID, ringkasan, 24 kartu, taksonomi bilingual draf dan schema Zod. Data dibaca dari AST literal prototipe, bukan `eval`; helper impor menolak menimpa file yang sudah ada. `watch` privat tidak dibawa. Metrik sumber ditandai `metricsKind: "example"`.
- `site/lib/solusi/`: tier, pencarian/filter, pagination enam item, seleksi ronde, ranking, terkait, pesan dan parser URL. Fungsi pemilihan kartu tidak memutasi state dan menerima RNG untuk tes deterministik.
- 10 tes Node lulus: validasi schema/ID, kesamaan seluruh data dengan literal sumber, seluruh field copy bagian 19, tier, filter, semua hasil terjangkau, contoh tiga ronde LOGIKA 11.5, terkait, pesan COPY 12, dan query tak dikenal/duplikat/kontradiktif/terlalu panjang.
- `typecheck`, `lint`, `format:check` lulus. Typecheck pertama tertahan izin cache native SWC Windows; pengulangan di luar sandbox lulus tanpa mengubah dependensi. Build produksi belum dijalankan karena route/komponen belum diubah atau memakai data ini.
- S0/S1 diserahkan untuk review. S2 kemudian dilanjutkan atas instruksi user 7 Nov. S3/S4 tetap menunggu review bentuk kasir/greybox sesuai plan. Tidak ada commit/push.

## Hasil S2 dan batas review

- `/solusi` dan `/en/solutions` kini punya hero serta toko CSS `no3d`, etalase per tim, rak yang bisa digeser/ditarik, mode Cari, mode Kartu, band, dan dialog kontak native. Font struk JetBrains Mono dimuat hanya melalui layout route Solusi.
- Cari menampilkan enam hasil per halaman, rentang/jumlah total, Sebelumnya/Berikutnya, serta kartu HTML yang tetap tersedia tanpa WebGL. Filter baru kembali ke halaman pertama.
- Kartu mendukung tombol ≥44 px, panah keyboard, swipe/drag, tiga ronde × tiga kartu, lalu membuka route hasil berquery. `/solusi/hasil` dan `/en/solutions/results` menampilkan urutan maksimal empat solusi tanpa persentase, chip masalah, ulangi, kembali, dan CTA kontak. Route hasil `noindex` dan tidak masuk sitemap.
- `LangSwitch` mempertahankan `#cari`, `#kartu`, dan query hasil. Parser tetap menolak ID asing, duplikat, kontradiksi, dan lebih dari sembilan jawaban.
- Draf EN tersedia untuk semua UI, 12 judul/hasil/ringkasan katalog, kata kunci pencarian, dan 24 kartu. Terjemahan field detail panjang pada `items/<slug>.ts` tetap pekerjaan S6 karena detail tidak masuk lingkup sesi ini.
- Kontak menampilkan WhatsApp. Instagram dan email dirender nonaktif sampai nilai asli tersedia melalui `NEXT_PUBLIC_INSTAGRAM_URL` dan `NEXT_PUBLIC_CONTACT_EMAIL`; data contoh tidak diaktifkan. Satu event analytics dikirim saat kanal dipilih.
- `tools/solusi/s2-qa.mjs` menjalankan 51 pemeriksaan browser di 11 viewport: H1, overflow, console, pagination 6/12, hash/query lintas bahasa, tiga ronde sampai hasil, tanpa tanda persen, dialog/fokus/Esc, panah keyboard, swipe kartu, drag rak, dan route EN. Endpoint analytics Vercel yang memang tidak tersedia lokal dikecualikan dari pemeriksaan console; error lain tetap menggagalkan skrip.
- Build produksi menghasilkan 54 halaman statis/SSG/PPR, termasuk ID/EN. `typecheck`, `lint`, `format:check`, dan 10 tes logika lulus. Screenshot review tersimpan di scratchpad `solusi-s2`, bukan `public` atau git.
- Placeholder generik dibuat untuk 12 route detail agar link etalase tidak 404. Isinya sengaja hanya judul/ringkasan dan `noindex`; ini bukan implementasi detail S6, Order Grup, atau Tonton.

Perintah dari root checkout:

```powershell
node --import ./tools/solusi/register.mjs --test tools/solusi/logic.test.mjs
node tools/solusi/measure.mjs "<absolute scratch directory>"
node tools/solusi/compare.mjs "<absolute scratch directory>/measurements.json"
```
