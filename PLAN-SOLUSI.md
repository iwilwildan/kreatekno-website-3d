# Kreatekno Solusi: Plan induk

_Disusun 4 Nov 2026 dari Solusi v1 (prototipe etalase yang disetujui Heru) dan isi repo. Status: **plan etalase disetujui user 4 Nov; prioritas dimajukan oleh user 7 Nov, mulai S0 sekarang tanpa menunggu Home tahap 11.** Pekerjaan Home tetap dipertahankan. Plan umum, aturan kerja dan log tetap di `PLAN.md`; dokumen ini menggantikan isi "Tahap 12 dan 13: Solusi" di sana._

_Pembaruan 7 Nov 2026: atas permintaan user, rencana detail dipisah menjadi fondasi bersama dan subplan per solusi. Persetujuan 4 Nov berlaku untuk lingkup lama; perluasan cerita inline dan keputusan terbuka di subplan masih draf untuk review. Pembaruan ini hanya dokumentasi, bukan awal implementasi atau perubahan urutan Home._

## 0. Peta rencana dan cara membaca

Dokumen ini mengatur etalase, Cari, Kartu masalah, hasil, kontak, dependensi, dan integrasi seluruh halaman Solusi. Rincian detail tidak diduplikasi di sini:

- [Fondasi semua halaman detail](docs/plans/solusi/PLAN-DETAIL.md): layout, schema, route ID/EN, mesin cerita, fallback, aksesibilitas, SEO, dan kriteria kelulusan bersama.
- Subplan per slug pada tabel berikut: isi layanan, sumber, kesiapan cerita, kebutuhan khusus, tahapan, keputusan, dan bukti review masing-masing.
- [Plan proyek](PLAN.md): prioritas Home/Solusi, QA/tayang dan log lintas sesi. Halaman depan Solusi dimajukan 7 Nov; Home tetap berjalan.
- [Audit S0 dan hasil S1](docs/plans/solusi/AUDIT-S0.md): keadaan checkout, riset ulang, kontrak URL, bukti ukur dan validasi.

Status layanan dari katalog ("Sudah berjalan" / "Siap dibuat") **bukan** status pengerjaan website. Semua detail website di bawah belum diimplementasikan. Tabel ini mencatat kesiapan bahan; checklist pelaksanaan disimpan hanya di subplan masing-masing.

| Solusi / subplan                                                 | Status layanan dalam sumber | Kesiapan rencana detail                                                  |
| ---------------------------------------------------------------- | --------------------------- | ------------------------------------------------------------------------ |
| [Order Grup](docs/plans/solusi/PLAN-ORDER-GRUP.md)               | Sudah berjalan              | OG0–OG4 selesai teknis 8 Nov; QA pilot 47/47, menunggu review final user |
| [Booking Jasa](docs/plans/solusi/PLAN-BOOKING-JASA.md)           | Sudah berjalan              | Rencana HTML dari katalog; cerita 3D belum tersedia                      |
| [Berkas Dokumen](docs/plans/solusi/PLAN-BERKAS-DOKUMEN.md)       | Sudah berjalan              | Rencana HTML dari katalog; cerita 3D belum tersedia                      |
| [Riset Konten](docs/plans/solusi/PLAN-RISET-KONTEN.md)           | Sudah berjalan              | Rencana HTML dari katalog; cerita 3D belum tersedia                      |
| [CS Klinik](docs/plans/solusi/PLAN-CS-KLINIK.md)                 | Siap dibuat                 | Rencana HTML dari katalog; cerita 3D belum tersedia                      |
| [Pengingat Tagihan](docs/plans/solusi/PLAN-PENGINGAT-TAGIHAN.md) | Siap dibuat                 | Rencana HTML dari katalog; cerita 3D belum tersedia                      |
| [Rekap Penjualan](docs/plans/solusi/PLAN-REKAP-PENJUALAN.md)     | Siap dibuat                 | Rencana HTML dari katalog; cerita 3D belum tersedia                      |
| [Follow-up Prospek](docs/plans/solusi/PLAN-FOLLOWUP-PROSPEK.md)  | Siap dibuat                 | Rencana HTML dari katalog; cerita 3D belum tersedia                      |
| [Carousel Konten](docs/plans/solusi/PLAN-CAROUSEL-KONTEN.md)     | Siap dibuat                 | Rencana HTML dari katalog; cerita 3D belum tersedia                      |
| [Asisten SOP](docs/plans/solusi/PLAN-ASISTEN-SOP.md)             | Siap dibuat                 | Rencana HTML dari katalog; cerita 3D belum tersedia                      |
| [Stok Menipis](docs/plans/solusi/PLAN-STOK-MENIPIS.md)           | Siap dibuat                 | Rencana HTML dari katalog; cerita 3D belum tersedia                      |
| [Ulasan Pelanggan](docs/plans/solusi/PLAN-ULASAN-PELANGGAN.md)   | Siap dibuat                 | Rencana HTML dari katalog; cerita 3D belum tersedia                      |

Urutan baca: induk → fondasi detail → subplan slug → spesifikasi sumber yang dirujuk. Perubahan lintas solusi masuk fondasi; keputusan kamera, adegan, dan isi satu solusi masuk subplannya. Setiap keputusan mencatat tanggal dan asal persetujuan. Usulan di dokumen sumber bukan persetujuan otomatis.

## 1. Sumber

| Sumber                               | Path di repo                                                                                                                                                 | Isi                                                                                                                   |
| ------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------ | --------------------------------------------------------------------------------------------------------------------- |
| Prototipe v1 (final, disetujui Heru) | `prototype/solusi-etalase-v1.html` (versi artefak `AZX3Jy8e9Bmmdnu9tLL8Jb` 13 Nov; versi 4 Nov di `prototype/solusi-etalase-v1-2026-11-04.html`)            | Satu file: three 0.170 dari CDN, toko 3D, kasir "Raka", etalase, Cari, Kartu, hasil, detail, pop up kontak. Versi 13 Nov hanya mengubah kotak etalase dan kotak di meja ([revisi etalase](docs/plans/solusi/PLAN-REVISI-ETALASE.md)) |
| Logika v1                            | `docs/SOLUSI-V1-LOGIKA.md`                                                                                                                                   | Routing, loop render, kamera, kasir, etalase, pencarian, ringkasan, kartu masalah, kontak, a11y, reduced motion       |
| Visual v1                            | `docs/SOLUSI-V1-VISUAL.md`                                                                                                                                   | Warna, font, layout, ukuran terukur di 11 viewport (desktop, tablet, HP), set 3D, pose kasir, kamera                  |
| Copy v1                              | `docs/SOLUSI-V1-COPY.md`                                                                                                                                     | Semua teks, usulan kunci next-intl, isi 12 solusi, 24 kartu, template pesan                                           |
| Rencana Solusi lama                  | `docs/SOLUSI.md`                                                                                                                                             | Mode Baca + Tonton (31 Okt). Baca digantikan v1; riwayat Tonton dan keputusan integrasi dengan inline ada di bagian 8 |
| Tokoh Heru                           | `site/world/cast/heru.ts`, `member.ts`, `rig.ts`                                                                                                             | Dasar kasir (bagian 5)                                                                                                |
| Prototipe detail Order Grup          | [Artifact Detail Solusi Order Grup Scroll](https://claude.ai/artifact/VBVY47Dr2AuRdz3YkBwwgC)                                                                | Cerita inline 9 adegan; sudah ditinjau di browser 7 Nov; HTML sumber belum disalin ke repo                            |
| Spesifikasi detail Order Grup        | [LOGIKA](docs/SOLUSI-DETAIL-ORDER-GRUP-V1-LOGIKA.md), [VISUAL](docs/SOLUSI-DETAIL-ORDER-GRUP-V1-VISUAL.md), [COPY](docs/SOLUSI-DETAIL-ORDER-GRUP-V1-COPY.md) | Salinan dokumen yang diberikan user; sumber subplan pilot, bukan instruksi untuk mengubah repo secara otomatis        |

Prioritas kalau bertentangan: **dokumen v1 dan prototipe v1 > `docs/SOLUSI.md` > dokumen tim lain.** Antara dokumen v1 dan prototipe, angka di dokumen menang kalau prototipe jelas hanya sisa versi lama (contoh: tombol "Lihat daftar dan filter").

Aturan prioritas di atas untuk etalase. Untuk detail, gunakan sumber khusus slug dan keputusan integrasi di subplan; konflik dengan keputusan user yang tercatat tetap harus diselesaikan secara eksplisit. Spesifikasi Order Grup tidak otomatis menetapkan cerita atau kamera 11 solusi lain.

### 1.1 Temuan dari membaca dokumen v1 terhadap repo ini

Dokumen v1 ditulis untuk keadaan repo yang **tidak ada di repo ini**:

- Dokumen merujuk `SOLUSI-SPEC`, `site/components/solusi/` (`Toko.tsx`, `Etalase.tsx`, `LabelRak.tsx`, `StrukCari.tsx`, `DekKartu.tsx`, `HasilKartu.tsx`), `site/world/solusi.ts`, `site/world/sets/toko.ts`, `site/content/solusi/` (`taksonomi.ts`, `kartu.ts`, `items/<slug>.ts`), `lib/solusi/schema.ts` dan `.claude/rules/content.md`. Tidak satu pun ada di `main` (lokal maupun `origin`).
- `site/messages/id.json` hanya punya `pages.solutions.title`. Kunci yang di COPY ditandai "ada" (`pages.solutions.hero.*`, `band.*`, `meta.solutions.results.*`) belum ada di sini.
- `/solusi` di situs masih `PagePlaceholder`.

Keputusan 4 Nov: semuanya **dibangun dari nol**, dengan data dan teks diambil dari prototipe v1 dan COPY. SOLUSI-SPEC tidak dipakai.

### 1.2 Temuan riset (4 Nov) yang bisa mengubah plan

| Temuan                                                                                                                                                                                                                                                                                                                                                                                    | Akibat untuk plan                                                                                                                                                                                                                                      |
| ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Satu canvas penuh layar + `setScissor`/`setViewport` per area adalah pola resmi three.js untuk beberapa adegan di satu halaman ([manual three.js](https://threejs.org/manual/pages/multiple-scenes.html)). Membaca `getBoundingClientRect` setiap frame punya biaya; drei `View` menyediakan opsi untuk tidak membacanya tiap frame ([drei View](https://drei.docs.pmnd.rs/portals/view)) | Pola v1 (satu canvas, scissor toko + pass ortho etalase) dipakai. **Koreksi teknis S0 7 Nov:** flag kotor mengatur pembacaan rect/transform, bukan mempertahankan piksel. Setelah clear canvas, semua pass yang terlihat digambar lagi. Lihat audit S0 |
| WCAG 2.2 SC 2.5.7 (Dragging Movements, AA) dan 2.5.1 (Pointer Gestures): aksi yang hanya bisa dilakukan dengan drag atau swipe harus punya alternatif satu ketukan; keyboard dinilai terpisah ([W3C Understanding 2.5.7](https://www.w3.org/WAI/WCAG22/Understanding/dragging-movements))                                                                                                 | Kartu masalah v1 hanya bisa dijawab dengan swipe/drag atau panah keyboard (keputusan Heru). Itu **tidak lulus AA**. Diputuskan 4 Nov: penanda "Tidak", "Ya", "Solusi" yang sudah tampil di sekitar kartu dijadikan tombol (tampilan sama)              |
| `<dialog>` dengan `showModal()` sudah mengunci fokus, membuat halaman di belakangnya inert, dan menutup dengan Esc; menambah focus trap JavaScript di atasnya tidak dianjurkan ([web.dev inert](https://web.dev/articles/inert))                                                                                                                                                          | Pop up kontak memakai `<dialog>` native, bukan focus trap manual seperti di prototipe. Fokus awal ke tombol X dan kembali ke pemicu tetap ditulis sendiri                                                                                              |
| JetBrains Mono tersedia di `next/font/google` sebagai variable font, tanpa paket npm ([docs Next.js font](https://nextjs.org/docs/app/api-reference/components/font))                                                                                                                                                                                                                     | Font mono struk ditambah lewat `next/font/google` dengan variabel `--font-mono`, hanya dimuat di halaman Solusi                                                                                                                                        |
| Node 24.14 di laptop menjalankan TypeScript langsung (type stripping) dan punya `node:test`                                                                                                                                                                                                                                                                                               | Tes fungsi murni (cari, skor kartu, tier) bisa jalan tanpa Vitest, jadi tanpa library baru                                                                                                                                                             |
| Prototipe memakai three 0.170, repo 0.186.1                                                                                                                                                                                                                                                                                                                                               | `RoundedBoxGeometry` ada di keduanya; kit repo sudah punya `G.rbox`. Tidak ada API v1 yang hilang di 0.186                                                                                                                                             |

## 2. Lingkup

**Masuk:** halaman `/solusi` (ID) dan `/en/solutions` (EN) seperti v1: hero toko 3D dengan kasir Heru, etalase rak per tim, band, mode Cari (struk, filter, kotak di meja, tag nomor, kartu ringkasan), mode Kartu masalah (bidang usaha, 3 ronde × 3 kartu, kartu 3D dibagikan kasir), halaman hasil, pop up kontak, halaman detail 12 solusi, versi tanpa WebGL dan reduced motion.

**Perluasan detail yang direncanakan 7 Nov:** fondasi detail bersama, pilot cerita inline Order Grup, dan 11 halaman HTML dari data katalog. Tahapan dan batasnya ada di subplan, bukan digabung menjadi satu pekerjaan S6 kecil. Cerita 3D untuk solusi lain membutuhkan bahan dan review per slug.

**Terpisah:** overlay Tonton lama (bagian 8). Hubungannya dengan cerita inline harus diputuskan sebelum pekerjaan T1 dimulai; prototipe baru tidak otomatis membatalkan keputusan lama.

**Komponen bersama:** Header dan Footer dipakai ulang; di halaman Solusi tombol "Konsultasi gratis" di Header membuka pop up kontak (lewat prop atau atribut `data-contact`; di halaman lain tetap langsung ke WhatsApp). Integrasi LangSwitch dan route detail mengikuti fondasi detail; masalah query/hash halaman hasil dicatat di bagian 10.

## 3. Arsitektur

### 3.1 Route dan mode

| v1 (hash)   | Situs ID                                      | Situs EN                    | Render                                 |
| ----------- | --------------------------------------------- | --------------------------- | -------------------------------------- |
| `#solusi`   | `/solusi`                                     | `/en/solutions`             | statis                                 |
| `#cari`     | `/solusi#cari`                                | `/en/solutions#cari`        | statis, mode dari hash                 |
| `#kartu`    | `/solusi#kartu`                               | `/en/solutions#kartu`       | statis, mode dari hash                 |
| `#hasil`    | `/solusi/hasil?b=<industri>&y=<k1,k5>&n=<k3>` | `/en/solutions/results?...` | statis, query dibaca di client         |
| `#s-<slug>` | `/solusi/<slug>`                              | `/en/solutions/<slug>`      | statis, `generateStaticParams` 12 slug |

- Mode Cari dan Kartu tetap hash, bukan route: halaman tetap satu dokumen statis, tombol back browser kembali ke etalase seperti v1, toko 3D tidak dibangun ulang. Debug `?mode=cari` tidak dipakai.
- Hasil memakai query (bukan memori seperti v1) supaya bisa dimuat ulang dan dibagikan. Query dibaca di client (`window.location.search` di komponen client), karena `searchParams` di server membuat halaman dinamis dan `ensureStatic` akan menggagalkan build. Tanpa query: judul "belum ada" seperti v1.
- `/solusi/hasil` diberi `noindex` (isi bergantung query). Detail masuk sitemap.

### 3.2 Struktur file

```
site/
  app/[locale]/(pages)/solusi/
    page.tsx                 toko + etalase + band (server: semua teks, kotak etalase sebagai link)
    hasil/page.tsx           halaman hasil (server: kerangka; client: isi dari query)
    [slug]/page.tsx          detail solusi
  components/solusi/
    toko.css                 token Solusi (--receipt, --wash, --navy-2, --line, status, --counter, --plinth) di bawah .solusi-page
    SolusiPage.tsx           client: state mode (hash), kelas focus/mode-cari/mode-kartu/served, memuat world
    HeroToko.tsx             hero (kartu TV di HP)
    Etalase.tsx              server: tier, slot, slot dekor, papan, plinth
    RakTrack.tsx             client kecil: panah, drag mouse, snap, sync
    StrukCari.tsx            form role=search, 4 select, bar hasil, tag nomor, kartu ringkasan
    DekKartu.tsx             kertas bidang usaha, deck 3 kartu, swipe, keyboard, progres
    HasilKartu.tsx           daftar hasil, chip masalah, CTA
    KontakModal.tsx          <dialog> 3 kanal (WhatsApp, Instagram, Email)
    detail/                  section halaman detail
  content/solusi/
    schema.ts                zod: Solusi, Kartu, taksonomi (field baru summary)
    taksonomi.ts             INDUSTRI, TIM, APPS, STATUS (+ warna tim, ikon Phosphor)
    kartu.ts                 24 kartu
    items/<slug>.ts          12 solusi, id + en
    cerita/<slug>.ts         data cerita opsional; hanya slug dengan materi yang sudah direview
  lib/solusi/
    tiers.ts                 tier etalase (LOGIKA 6)
    search.ts                filter dan kata kunci (LOGIKA 9.1)
    kartu.ts                 cardScore, pickRound, results (LOGIKA 11.2–11.4), rng bisa disuntik
    related.ts               solusi terkait (LOGIKA 13)
    pesan.ts                 template pesan WA/email (COPY 12)
    *.test.ts                node:test
  lib/contact.ts             usulan helper bersama; waHref saat ini ada di lib/wa.ts
  world/
    solusi/index.ts          mountToko(host, opts) → { setMode, serve, recall, deal, dispose, ... }
    solusi/kamera.ts         target kamera, rumus bibir meja (LOGIKA 4)
    solusi/kasir.ts          sistem pose, ikut kursor, reaksi dipukul (LOGIKA 5)
    solusi/kotak.ts          kotak di meja, layout, terbang (LOGIKA 9.3–9.4), mesin kasir bergeser
    solusi/rak.ts            pass ortho etalase (LOGIKA 8, VISUAL 8.4)
    solusi/kartu3d.ts        kartu/kertas yang dibagikan (LOGIKA 11.7)
    sets/toko.ts             dinding, meja, mesin kasir, rak dinding, lampu (VISUAL 7.2)
    cast/heruKasir.ts        Heru berbaju kasir (bagian 5)
    cast/kasirPose.ts        pose idle, ready, lift, offer, wave, shrug, nod
    cerita/                 usulan entry/detail engine; kontrak dan struktur di subplan fondasi
```

- `world/solusi/` adalah entry kedua di samping Home (`world/index.ts`), memakai `core/kit`, `cast/` dan `motion/` yang sama. Dimuat dengan `import()` setelah halaman tampil, seperti Home.
- Entry cerita detail terpisah dari toko. Batas scene, kamera, teks, lifecycle, dan pemuatan per slug dirinci di [fondasi detail](docs/plans/solusi/PLAN-DETAIL.md); jangan memuat semua dunia detail dari halaman katalog.
- Nama file kasir mengikuti gaya nama di `cast/` (`closeHand.ts`, `counterProps.ts`): `heruKasir.ts`, bukan `heru-kasir.ts`.
- GSAP tidak dipakai (tidak di-port di tahap 1). Gerak pose, kamera dan mesin kasir memakai rumus v1 (lerp eksponensial `1 − e^(−dt·k)`), jadi nilai akhirnya otomatis sama dengan v1. Ini menjawab selisih "Gerak pose" di LOGIKA 17.

### 3.3 Lapisan dan render

- Satu canvas fixed seukuran viewport, `aria-hidden`, `pointer-events: none`, z 1, di bawah semua HTML (VISUAL 4.3).
- Pass toko: scissor + viewport seukuran `.toko`, hanya saat stage terlihat. Pass etalase: kamera ortho 1 unit = 1 CSS px, scissor per track, hanya saat etalase terlihat dan bukan mode fokus.
- **Loop:** v1 menggambar setiap frame. Di sini: 30 fps saat hanya gerak idle (napas, kedip, menoleh, lampu ayun), seperti loop ambient Home; laju penuh selama kamera, kasir, kotak atau kartu bergerak dan selama kepala ikut kursor; berhenti saat tab tersembunyi atau stage dan etalase di luar layar. Flag kotor mengatur penghitungan rect/transform (scroll, resize, scroll track, hover); setiap frame yang membersihkan canvas wajib menggambar kembali semua pass yang terlihat. Selama transisi hover 200 ms, transform tetap diperbarui sampai selesai.
- Pixel ratio `min(dpr, 1.5)` di HP (≤ 760 px), `min(dpr, 2)` di desktop, seperti v1. Pengukur kualitas Home (`core/quality`) dipasang di tahap S7, bukan di awal.
- Hitbox kasir untuk kursor pointer dan reaksi dipukul memakai kapsul/bola sederhana yang mengikuti tulang (definisi collider springbone yang sudah ada di spec Heru), bukan raycast ke SkinnedMesh 15 ribu segitiga setiap `pointermove`.

### 3.4 Sebelum 3D siap dan tanpa WebGL

| Keadaan                                     | Tampil                                                                                                                                                                                                                                           |
| ------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| HTML baru dimuat                            | Stage memakai gaya `no3d` (VISUAL 8.5: gradien dinding dan meja, papan, kotak warna tim) + semua teks. H1 hero jadi LCP                                                                                                                          |
| World siap (kasir terbangun, frame pertama) | Crossfade 300 ms dari stage CSS ke canvas                                                                                                                                                                                                        |
| WebGL gagal                                 | Kelas `no3d` tetap, tanpa loop render. Cari dan Kartu tetap jalan; tag nomor dan ringkasan kotak 3D tidak ada, jadi hasil Cari tampil sebagai daftar kartu HTML (judul, ringkasan, Lihat detail). v1 tidak menampilkan apa pun; diputuskan 4 Nov |
| Reduced motion                              | Semua tween langsung, aksi kasir 0 ms, tanpa napas, menoleh dan lampu ayun, kartu 3D dilewati (LOGIKA 15)                                                                                                                                        |

Still WebP toko (pc/hp) sebagai poster seperti Home dipertimbangkan di S7 kalau crossfade dari stage CSS terasa melompat (kasir muncul tiba-tiba).

### 3.5 Anggaran etalase

Batas di bawah untuk toko/kasir, bukan untuk semua dunia detail. Target dan pengukuran detail ada di subplan fondasi dan masing-masing slug.

| Ukuran                                        | Batas                                                                     |
| --------------------------------------------- | ------------------------------------------------------------------------- |
| LCP mobile (profil HP lambat seperti tahap 2) | < 2,5 s                                                                   |
| JS halaman tanpa world                        | ≤ 120 KB gzip                                                             |
| Chunk world Solusi (three + toko + kasir)     | ≤ 230 KB gzip (three dan core dipakai bersama Home lewat chunk yang sama) |
| Draw call per frame                           | < 60 (toko ±20, kasir 1–2, kotak meja instanced, etalase ±8 instanced)    |
| Segitiga per frame                            | < 80 ribu (Heru ±15 ribu)                                                 |
| Waktu bangun kasir                            | ≤ 150 ms di GPU laptop, dipotong per slice seperti Home                   |

## 4. Data dan copy

- **Data:** 12 solusi (`SOLUSI`), ringkasan (`RINGKAS`), 24 kartu (`KARTU`), taksonomi (`INDUSTRI`, `TIM`, `APPS`, `STATUS`) dan warna tim (`TEAMCOL`) diambil dari blok skrip `prototype/solusi-etalase-v1.html` lewat skrip satu kali di scratchpad, lalu ditulis sebagai TypeScript dengan schema zod. Teks dicocokkan otomatis dengan COPY 14–19. Tanggal disimpan ISO, diformat di UI ("28 Okt 2026"). Field `watch` tidak dipasang (privat).
- **Messages:** semua kunci "baru" dan "ubah" di COPY masuk `messages/id.json` di bawah `pages.solutions.*`. Kunci "tidak dipakai v1" dan "prototipe" tidak dibuat.
- **EN:** draf terjemahan messages dan data 12 solusi + 24 kartu dibuat Claude, direview user.
- **Aturan copy** (`docs/SITE-BRIEF.md` 2): sapaan "Anda", tanpa em dash, CTA "Konsultasi gratis". Dicek otomatis dengan grep di S1. **Pengecualian Solusi (4 Nov):** nama platform boleh tampil seperti v1 (kanal pop up, chip aplikasi, filter Aplikasi, isi solusi). Halaman lain tetap tanpa nama platform.
- **Struk:** baris kasir "Etalase Solusi · Kasir: Heru" (`pages.solutions.search.receiptLine`, ICU `{name}` dengan nilai Heru).
- **Analytics:** satu event per kanal kontak (WhatsApp, Instagram, Email) dengan `section` dan `intent`, perluasan `trackWhatsApp` di `lib/analytics.ts`.
- **Kontak:** nomor WhatsApp dari `NEXT_PUBLIC_WA_NUMBER` (sudah ada), akun Instagram dan email ditambah ke `lib/site.ts` (masih kosong; input tim di `PLAN.md` 7).

## 5. Kasir: Heru berbaju kasir (`cast/heruKasir.ts`)

### 5.1 Bentuk

| Bagian                                            | Asal                                             | Catatan                                                                      |
| ------------------------------------------------- | ------------------------------------------------ | ---------------------------------------------------------------------------- |
| Badan, kepala, wajah, rambut, tinggi 1,80 m       | `HERU`, `heruFace()`, `hairSdf()` dari `heru.ts` | Sama persis dengan Heru di Home                                              |
| Kaos putih `#F7F7FF` lengan pendek                | v1 Raka                                          | `c.arms(..., { end })` sudah mendukung lengan pendek dengan lengan telanjang |
| Celemek ungu `#9F0ED6` dengan tepi cyan `#35EAFE` | keputusan Heru 3 Nov (VISUAL 2.5)                | Panel loft di depan badan, tali leher dan tali pinggang, satu warna atlas    |
| Papan nama putih di dada kanan                    | v1 Raka                                          | Kotak kecil polos, tanpa tulisan (4 Nov)                                     |
| Kerah cyan                                        | v1 Raka                                          | Cincin di leher kaos                                                         |
| Celana dan sepatu                                 | Heru                                             | Hampir selalu tertutup meja; tetap dibangun karena pose `ready` berjongkok   |
| Tanpa jas, lanyard, tas                           |                                                  | Pegas hanya 3 rantai rambut                                                  |

### 5.2 Refactor `heru.ts`

`HERU_SPEC.dress` sekarang satu fungsi panjang. Dipecah tanpa mengubah hasil: `heruHair(c)`, `heruLegs(c)` (celana, sepatu) dan konstanta `HAIR_SPRINGS`, kolider kepala/dada diekspor. `HERU_SPEC` memanggilnya, `HERU_KASIR_SPEC` memakai rambut dan kaki yang sama dengan baju kasir. Syarat: render lab Heru sebelum dan sesudah refactor identik (selisih ≤ 0,001% piksel, segitiga sama), seperti saat Heru dipindah ke `buildMember`.

### 5.3 Skala di toko

Raka di v1 jauh lebih besar dari manusia: pinggul y 0,95, puncak kepala ±2,72 m, kepala berdiameter 0,54 m, sedangkan meja 1,06 m. Heru 1,8 m dengan kepala ±0,30 m akan terlihat kecil di kamera v1.

Usulan: koordinat set dan kamera v1 dipakai **apa adanya** (semua rumus dan tabel v1 bisa dicek langsung), dan root kasir diskalakan `k`. Kalau puncak kepala dan pinggul Heru disamakan dengan Raka, `k ≈ 1,77` dan diameter kepala Heru jadi ±0,53 m, hampir sama dengan Raka. Root Heru turun ke y ±−0,47 supaya pinggulnya di 0,95 (lantai di balik meja tidak pernah terlihat). Radius kolider springbone tidak ikut skala, jadi dikalikan `k` saat dibangun. Nilai `k` final ditentukan di greybox S4 dari kotak layar Raka yang diukur di prototipe (kepala, bahu, garis meja) di 11 viewport.

### 5.4 Pose dan gerak

- Tujuh pose v1 (VISUAL 7.3) diterjemahkan ke rig Heru di `cast/kasirPose.ts`. Bahu Heru lebih sempit dan lebih rendah dari Raka (±0,32 lawan ±0,43, dalam satuan toko), jadi sudut `lift` dan `offer` disetel ulang di lab supaya tangan sampai ke kotak dan kartu.
- `ready` (jongkok di bawah meja): pinggul turun 0,95 satuan toko (±0,54 m bagi Heru), kaki dikunci di lantai dengan IK dua tulang, badan condong 0,18. Kepala harus hilang di bawah bibir meja; dicek di semua kamera.
- Sistem `base`/`pose`/`want`/`act`, napas, kedip (tulang mata yang sudah ada), menoleh idle, lambai, angguk: rumus LOGIKA 5.1.
- Kepala ikut kursor (LOGIKA 5.2): yaw ±35°, pitch ±15° ke tulang `head` (+ sedikit ke `neck`). Mata Heru berupa geometri di tulang `eyeL`/`eyeR`; geser ±1 cm di permukaan wajah sebagai ganti `x mata ± yaw × .045`.
- Reaksi dipukul (LOGIKA 5.3): amplop, getar, pinggul miring, kepala mendongak, lengan terbuka, mata terpejam lewat skala tulang mata. Mulut "O": wajah Heru dilukis di kanvas, jadi usulan pertama melukis ulang sel wajah dua kali per reaksi (mulai dan selesai) dan mengukur biayanya; kalau > 4 ms, mulut senyum dan "O" dibuat geometri kecil yang ditukar seperti Raka.
- Ekspresi dasar: senyum ramah (bukan prihatin seperti Bu Dewi di Home).

## 6. Tahapan

_Status: ✅ selesai · 🟡 berjalan · ⬜ belum._ Setiap tahap mulai dengan riset kecil dan pertanyaan, berakhir dengan review (screenshot di chat). Render v1 hanya dipakai di chat untuk perbandingan.

| #     | Tahap                         | Hasil                                                                          | Status                                                                                                       |
| ----- | ----------------------------- | ------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------ |
| S0    | Persiapan                     | Dokumen v1 di repo, ukuran acuan dari prototipe, jawaban bagian 9              | 🟡 audit/ukur selesai teknis 7 Nov: 11 viewport, 1.771 pemeriksaan lulus; siap review                        |
| S1    | Data dan logika murni         | `content/solusi/`, `lib/solusi/`, tes `node:test`                              | 🟡 implementasi ID selesai teknis 7 Nov, 10 tes + typecheck/lint/format lulus; siap review; EN lengkap di S2 |
| S2    | Halaman HTML tanpa 3D         | `/solusi`, `/solusi/hasil`, mode Cari dan Kartu, pop up, semua di versi `no3d` | 🟡 selesai teknis 7 Nov: build statis, 51 cek browser/11 viewport lulus; siap review user                    |
| S3    | Kasir Heru                    | `heruKasir.ts`, `kasirPose.ts`, lab                                            | ✅ disetujui 7 Nov; regresi Home identik, 7 pose, 11.750 tris, median 99 ms                                  |
| S4    | Toko 3D                       | set, kamera, kasir di toko, interaksi kasir                                    | ✅ disetujui 8 Nov; 88 cek kamera/layout + 26 cek interaksi/performa lulus                                   |
| S5    | Etalase 3D, Cari 3D, Kartu 3D | pass ortho, kotak di meja, tag, ringkasan, kartu dibagikan                     | ✅ disetujui user 8 Nov melalui “lanjutkan”; 122 cek browser lulus                                           |
| S5b   | Revisi etalase v1 13 Nov      | Kotak etalase 216×305, tanpa dekor, kotak meja baru; [subplan](docs/plans/solusi/PLAN-REVISI-ETALASE.md) | ✅ disetujui 14 Nov; 13 selisih di luar etalase menunggu keputusan (subplan 8.1) |
| S6    | Program halaman detail        | Fondasi D0–D4 + subplan 12 slug, pilot Order Grup terlebih dahulu              | 🟡 D0–D3 + OG0–OG4 selesai teknis 8 Nov; pilot 47/47 dan regresi lulus, P0–P2 sebelas slug serta D4 belum    |
| S7    | Pengerasan                    | HP, a11y, reduced motion, anggaran, ukur ulang vs v1                           | ⬜                                                                                                           |
| T1–T3 | Tonton lama                   | Lihat bagian 8; hubungan dengan cerita inline harus diputuskan                 | ⬜ belum mulai                                                                                               |

### S0. Persiapan

1. Salin dokumen v1 ke `docs/` dan prototipe ke `prototype/` (sudah, 4 Nov).
2. Jalankan prototipe di Playwright (Edge lokal, 11 viewport VISUAL) dan simpan ke scratchpad: kotak layar Raka (puncak kepala, bahu, garis meja), posisi tag kotak, screenshot tiap view. Ini acuan skala kasir (5.3) dan pembanding di S2–S7.
3. Skrip `tools/solusi/measure.mjs`: mengukur elemen yang sama dengan VISUAL (selector v1 dipetakan ke selector situs) di 11 viewport dan membandingkan dengan tabel VISUAL, toleransi ±1 px untuk kotak dan ±0,5 px untuk font. Dipakai lagi di akhir S2, S5 dan S7.
4. Jawaban bagian 9 (4 Nov, diperbarui 7 Nov). Prioritas dimajukan saat Home tahap 6: riset S0 dan audit engine dilakukan sekarang; perubahan Home yang belum di-commit tidak diubah.

**Selesai bila** acuan ukur tersimpan dan plan dicek ulang terhadap repo saat itu.

### S1. Data dan logika murni

1. Ekstrak data dari prototipe (skrip scratchpad, prototipe dibaca sebagai teks, tidak dijalankan), tulis `content/solusi/` dengan schema zod; field baru `summary`.
2. `lib/solusi/`: `tiers` (urutan tier dan slot dekor, LOGIKA 6), `search` (LOGIKA 9.1), `kartu` (skor, ronde, hasil; angka acak lewat parameter), `related`, `pesan`.
3. Tes `node:test` (tanpa library baru):
   - tier: hasil persis tabel LOGIKA 6 (7 tier, jumlah solusi dan dekor);
   - cari: "stok" 1 hasil, "dokumen" 2, "pemilik" 3, "jadwal" 4, "pelanggan" 5, kosong 12 (2 halaman × 6 sesuai keputusan 7 Nov), plus kombinasi filter;
   - kartu: contoh LOGIKA 11.5 dengan acak 0 memberi kartu k1, k3, k5 / k6, k17, k20 / k24, k4, k22 dan urutan cs-klinik, booking-jasa, order-grup (skor internal 7 / 5,5 / 2, tanpa persentase sesuai keputusan 7 Nov);
   - pesan WA: 12.1–12.4 per karakter.
4. Pencocokan teks data dengan COPY 14–19 dan grep aturan copy (em dash, "kamu").

**Selesai bila** semua tes lulus, `typecheck`, `lint`, `format:check` bersih. Review singkat di chat (tanpa screenshot).

### S2. Halaman HTML tanpa 3D

1. Font mono (`next/font/google`, `--font-mono`), `toko.css` dengan token VISUAL 2.1–2.2 di bawah `.solusi-page`, tanpa mengubah `globals.css`.
2. `/solusi`: hero (desktop, tablet, HP dengan kartu TV), etalase (frame, tier, track, slot, slot dekor, papan, plinth) dengan kotak versi `no3d`, band, footer. Kotak etalase link ke detail (halaman detail sementara placeholder sampai S6).
3. `RakTrack`: panah (tampil kalau overflow, nonaktif di ujung), drag mouse 6 px, snap ke slot, klik dibatalkan 300 ms setelah drag, scroll native untuk sentuh (LOGIKA 7).
4. Mode: `SolusiPage` membaca hash, memasang kelas `focus`, `mode-cari`, `mode-kartu`, `served`, alur route LOGIKA 2.2 (tanpa bagian 3D).
5. Cari: struk (nomor struk, input, 4 select dengan gaya aktif), submit, bar hasil, "Cari kembali", "Belum dapat solusi"; hasil tampil sebagai daftar kartu HTML selama 3D belum ada. Enam hasil per halaman dengan sebelumnya/berikutnya dan rentang/jumlah hasil; submit baru mulai halaman pertama (keputusan 7 Nov).
6. Kartu: kertas bidang usaha, deck 3 kartu, swipe/drag, keyboard, penanda "Tidak", "Ya", "Solusi" sebagai tombol (`<button>` dengan tampilan penanda v1, target sentuh ≥ 44 px), stempel, progres, ke hasil dengan query.
7. `/solusi/hasil`: urutan rekomendasi tanpa persentase (keputusan 7 Nov), chip masalah, Konsultasi gratis dengan pesan 12.3, Ulangi, Kembali. Kontrak query/refresh/Back/Forward/ganti bahasa di [audit S0](docs/plans/solusi/AUDIT-S0.md).
8. `KontakModal` dengan `<dialog>`; pemicu `data-contact`/`data-msg`, termasuk tombol Header di halaman Solusi; event analytics per kanal.
9. Messages ID + draf EN, metadata, sitemap, `noindex` hasil.
10. Cek: `measure.mjs` di 11 viewport (hero, etalase, struk, bar, deck, pop up, hasil) dibanding VISUAL; axe; keyboard (Tab, Esc, panah kartu); drag rak dengan mouse, sentuh, touchpad; `build` statis ID/EN, `typecheck`, `lint`, `format:check`. Screenshot desktop, tablet, HP di chat berdampingan dengan v1.

**Selesai bila** semua view v1 jalan tanpa 3D, ukuran sesuai VISUAL dalam toleransi, dan user menyetujui.

### S3. Kasir Heru

1. Refactor `heru.ts` (5.2), cek render Home identik.
2. `heruKasir.ts` (5.1), daftar di `roster.ts` sebagai `heruKasir`; lab `/?lab=heruKasir` dan `&view=face`.
3. `kasirPose.ts`: 7 pose di lab, berdampingan dengan render Raka dari prototipe untuk pose yang sama (hanya di chat).
4. Cek: segitiga ≤ 16 ribu, 1–2 draw call, waktu bangun, `typecheck`, `lint`. Render depan, ¾, samping, belakang dan 7 pose di chat.

**Selesai bila** user menyetujui bentuk, baju dan pose.

### S4. Toko 3D

1. Greybox: `sets/toko.ts` (VISUAL 7.2), kamera hero dengan rumus bibir meja (LOGIKA 4.2) dan kamera fokus, kasir di root dengan skala `k` sementara. Render di 11 viewport berdampingan dengan v1 (chat), lalu `k` dan posisi kasir disepakati. **Berhenti untuk review.**
2. Set detail: material dan cahaya VISUAL 2.4 dan 7.1 (tanpa tone mapping, tanpa bayangan seperti v1), mesin kasir, rak dinding dengan 8 kotak, lampu ayun.
3. `world/solusi/index.ts`: mount, satu canvas, scissor, loop (3.3), resize, `dispose` yang melepas semua listener (LOGIKA 16), crossfade dari `no3d`.
4. Kasir di toko: pose dari mode (masuk Cari melambai, mengetik `ready`, kosong `idle`), ikut kursor (hanya `hover: hover` dan `pointer: fine`), kursor pointer di atas kasir, reaksi dipukul, mesin kasir bergeser (LOGIKA 5.4).
5. Cek: kamera hero di 11 viewport sama dengan tabel VISUAL 7.4 (±0,002), bibir meja 8 px di atas tepi bawah stage, kepala kasir hilang di `ready`, reduced motion, FPS (Edge GPU dan CPU 4×), anggaran, console bersih.

**Selesai bila** toko dan kasir terlihat dan bereaksi seperti v1 di desktop, tablet dan HP, dan user menyetujui.

### S5. Etalase 3D, Cari 3D, Kartu 3D

1. `rak.ts`: pass ortho (VISUAL 8.4): papan, kotak warna tim, panel sampul, kotak dekor 2×2, bayangan kontak, kemiringan 0,2 rad, instanced; scissor per track; hover naik 6 px dan bayangan mengecil.
2. `kotak.ts`: layout meja (LOGIKA 9.4), terbang sajikan dan ambil kembali (9.3), tag nomor diproyeksikan, layout ulang saat resize (debounce 250 ms).
3. Kartu ringkasan: hover desktop, tap sentuh, posisi dan panah (LOGIKA 10), Esc.
4. `kartu3d.ts`: kertas bidang usaha dan kartu yang dibagikan kasir (LOGIKA 11.7), angguk saat "Ya".
5. Daftar kartu HTML visual dari S2 menjadi fallback `no3d`; saat 3D aktif, tag/ringkasan/tautan HTML tetap menyediakan akses seluruh hasil lewat keyboard dan pembaca layar. Jangan menyembunyikan satu-satunya representasi hasil dari accessibility tree.
6. Cek: posisi tag di 11 viewport dibanding VISUAL 7.5 untuk 1–6 hasil (±2 px), ringkasan di desktop/tablet/HP, `measure.mjs`, anggaran, FPS saat kotak terbang, console bersih. Video pendek alur Cari dan Kartu di chat.

**Selesai bila** alur Cari dan Kartu lengkap seperti v1 dan user menyetujui.

### S6. Halaman detail

S6 menjadi penghubung ke subplan, bukan daftar implementasi semua detail dalam satu tahap.

1. Mulai [fondasi detail D0–D2](docs/plans/solusi/PLAN-DETAIL.md): audit keputusan, kontrak data/route, template HTML dan kontak. Dependensi minimal S1 (data) dan S2 (kontak/navigasi). Urutan default tetap sesudah S5; memajukan pilot HTML ke S2 adalah usulan, bukan perubahan jadwal yang sudah disetujui.
2. Kerjakan [Order Grup OG0–OG2](docs/plans/solusi/PLAN-ORDER-GRUP.md) untuk bahan, HTML, dan greybox. Mesin D3 divalidasi dengan greybox ini, lalu lanjut koreografi OG3 dan QA OG4.
3. Terapkan template ke 11 slug lain melalui subplan masing-masing. Detail HTML boleh selesai tanpa dunia 3D; jangan mengarang storyboard untuk menutup kekurangan sumber.
4. Jalankan D4 (regresi lintas route, bahasa, aksesibilitas, bundle) sebelum S7. Cerita hanya aktif pada slug yang memenuhi kriteria subplannya.

**Status 8 Nov:** D0–D3 dan OG0–OG4 selesai teknis. Cerita inline dipilih sebagai pengalaman utama pilot; overlay Tonton lama tetap menjadi pengembangan terpisah dan tidak dibuat ganda. Koreografi, CSS3D, state deterministik, fallback, reduced motion, lifecycle, reflow dan benchmark browser sudah lulus. Pilot menunggu review final user; perangkat fisik dan kanal kontak produksi tetap prarilis. P0–P2 sebelas slug lain serta D4 belum dimulai.

**Selesai bila** 12 detail ID/EN lulus checklist HTML bersama, pilot Order Grup lulus lingkup yang disepakati pada OG0, keputusan Tonton tercatat, dan status implementasi/review tiap slug jelas. Bila lingkup pilot berubah, catat keputusan baru di induk dan subplan; jangan diam-diam menganggap HTML saja memenuhi pilot 3D.

### S7. Pengerasan

- Tes HP: POCO X6 dan HP murah user (FPS diam, saat Cari/Kartu, panas ±1 menit, waktu bangun kasir).
- Pengukur kualitas dari Home kalau FPS HP rendah; poster WebP toko kalau crossfade terasa melompat.
- A11y: axe semua view, pembaca layar di mode Kartu (penanda tombol), fokus, kontras.
- Reduced motion, tanpa WebGL, tanpa JavaScript (etalase dan detail tetap bisa dibaca dan diklik).
- Analytics: cek event per kanal terkirim di preview Vercel.
- Ukur ulang semua tabel VISUAL dengan `measure.mjs`; anggaran; `build`, `typecheck`, `lint`, `format:check`.
- Sertakan hasil D4 dan checklist per slug. Pastikan angka/kutipan contoh berlabel, kanal kontak asli sudah terisi, draf EN direview, serta status layanan tidak tertukar dengan status pengerjaan website.

**Selesai bila** halaman lulus semua cek, dites di HP user, dan disetujui.

## 7. Risiko

| Risiko                                                            | Akibat                                    | Mitigasi                                                                                                      |
| ----------------------------------------------------------------- | ----------------------------------------- | ------------------------------------------------------------------------------------------------------------- |
| Heru jauh lebih kecil dan proporsinya beda dari Raka              | Komposisi hero dan pose tidak seperti v1  | Skala `k` dari ukuran Raka di prototipe, greybox disetujui sebelum detail                                     |
| Pose `lift`/`offer` tidak sampai ke kotak karena bahu Heru sempit | Tangan tidak menyentuh kotak              | Pose disetel di lab dengan kotak pengganti; IK tangan ke kotak kalau perlu                                    |
| Melukis ulang wajah saat dipukul memicu jank                      | Patah saat reaksi                         | Ukur; ganti mulut geometri                                                                                    |
| Membaca rect etalase setiap frame                                 | FPS turun di HP saat scroll               | Flag kotor untuk rect/transform; semua pass terlihat digambar kembali setelah clear canvas                    |
| Dua entry world (Home dan Solusi)                                 | Bundle ganda                              | Chunk three dan core bersama, dicek di build                                                                  |
| Solusi dimajukan saat Home tahap 6                                | Engine/cast masih berubah dalam sesi Home | Audit S0 tercatat; cek ulang kontrak Heru di S3 dan hindari refactor bersama sebelum baseline render tersedia |
| Penanda kartu sebagai tombol mengubah rasa v1                     | Heru tidak setuju                         | Tampilan tetap sama; dicatat sebagai selisih dari v1 untuk Heru                                               |

## 8. Tonton lama dan cerita inline (keputusan integrasi terbuka)

Rencana yang disetujui sebelumnya: `docs/SOLUSI.md` 2–5, overlay layar penuh `#tonton-<slug>` setelah S7, tanpa karakter manusia (ORB satu-satunya aktor), pilot `order-grup`, lalu tiga solusi "Sudah berjalan" lainnya. Riwayat ini dipertahankan.

Prototipe detail yang diberikan 7 Nov membawa pengalaman berbeda: cerita inline, figur manusia sederhana dan robot asisten, tanpa tombol Tonton. **Keputusan D0/OG0 pada 8 Nov:** cerita inline menjadi pengalaman utama pilot; overlay Tonton lama tetap pengembangan terpisah dan tidak dibuat ganda. Greybox figur abstrak belum mengunci gaya karakter final. Tahap lama di bawah belum dimulai; labelnya tidak boleh dipakai untuk menandai pekerjaan inline selesai.

| #   | Tahap                                                             | Status |
| --- | ----------------------------------------------------------------- | ------ |
| T1  | Pilot `order-grup`: overlay, set ruko depot air, props, ORB, take | ⬜     |
| T2  | HP, mode hemat, fallback                                          | ⬜     |
| T3  | Tiga take "Sudah berjalan" lainnya                                | ⬜     |

## 9. Keputusan (jawaban user 4 Nov)

| #   | Topik                   | Keputusan                                                                                                                                                                                                   |
| --- | ----------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | Repo Heru               | Dibangun dari nol dari prototipe v1 dan dokumen v1. SOLUSI-SPEC dan kode Solusi Heru tidak dipakai                                                                                                          |
| 2   | Urutan                  | Keputusan 4 Nov: setelah Home tahap 11. **Diganti instruksi user 7 Nov: mulai halaman depan Solusi sekarang**, di checkout yang sama, tanpa mengubah pekerjaan Home. Detail dan Tonton tidak masuk sesi ini |
| 3   | Baju kasir              | Kaos putih lengan pendek, celemek ungu tepi cyan, kerah cyan, papan nama putih; tanpa jas, lanyard, tas                                                                                                     |
| 4   | Nama kasir              | Struk "Kasir: Heru", papan nama di dada polos                                                                                                                                                               |
| 5   | Nama platform           | Boleh tampil di halaman Solusi seperti v1 (pop up, chip, filter, isi solusi). Halaman lain tetap tanpa nama platform                                                                                        |
| 6   | Pop up kontak           | Hanya di halaman Solusi (termasuk tombol Header di sana). Halaman lain tetap langsung ke WhatsApp                                                                                                           |
| 7   | Analytics               | Satu event per kanal kontak                                                                                                                                                                                 |
| 8   | Kartu masalah           | Penanda "Tidak", "Ya", "Solusi" jadi tombol yang bisa diketuk, tampilan sama dengan v1 (WCAG 2.2 AA)                                                                                                        |
| 9   | Cari tanpa WebGL        | Hasil tampil sebagai daftar kartu HTML                                                                                                                                                                      |
| 10  | Font mono               | JetBrains Mono lewat `next/font/google`, hanya di Solusi                                                                                                                                                    |
| 11  | Bahasa Inggris          | Draf Claude untuk semua copy, 12 solusi dan 24 kartu, direview user                                                                                                                                         |
| 12  | Selisih v1 lainnya      | Ikut v1 semua (LOGIKA 17, VISUAL 16)                                                                                                                                                                        |
| 13  | Hasil Cari > 6 (7 Nov)  | Enam per tampilan, dengan tombol halaman berikutnya; akses kembali ke halaman sebelumnya tersedia                                                                                                           |
| 14  | Kecocokan Kartu (7 Nov) | Urutan rekomendasi tanpa persentase. Rumus bobot/penalti tetap sebagai ranking internal, bukan peluang keberhasilan                                                                                         |
| 15  | Etalase (13 Nov)        | Ikuti artefak v1 13 Nov persis, termasuk judul etalase sesuai COPY v1. Lihat [revisi etalase](docs/plans/solusi/PLAN-REVISI-ETALASE.md)                                                                    |
| 16  | Slot dekor (13 Nov)     | Dihapus, ikut artefak                                                                                                                                                                                       |
| 17  | Kotak di meja (13 Nov)  | Proporsi dan badge ikut artefak; desktop/tablet satu baris, HP (≤ 760 px) dua baris. Selisih dari v1 untuk Heru                                                                                            |
| 18  | Commit (13 Nov)         | Tidak commit sebelum revisi etalase                                                                                                                                                                          |

Selisih dari v1 yang perlu diketahui Heru: penanda kartu bisa diketuk (8), hasil Cari tanpa WebGL (9), hasil kartu lewat query, pop up kontak memakai `<dialog>` native.

## 10. Pembaruan dan temuan review 7 Nov 2026

- Permintaan user: plan induk mereferensikan subplan yang menjabarkan masing-masing detail solusi. Struktur tersebut diterapkan pada dokumen; belum ada kode website yang dibuat.
- Ditambahkan fondasi bersama dan 12 subplan. Order Grup punya bahan cerita lengkap; 11 lainnya baru memakai konten katalog yang tersedia. Storyboard, kamera, model, dan hasil nyata tidak boleh diasumsikan dari Order Grup.
- Salinan LOGIKA/VISUAL/COPY detail Order Grup disimpan sebagai referensi asli, tanpa mengubah klaim atau arahan di dalamnya. Fakta repo diverifikasi terpisah: three `0.186.1`, belum ada script `size`, belum ada `world/core/quality.ts`, dan struktur detail masih rencana.

Temuan sebelumnya tetap terlihat sebagai pekerjaan review, bukan perubahan produk yang diam-diam disetujui:

| Temuan                                                            | Tindak lanjut / keputusan                                                                                                                                                                  |
| ----------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Cari hanya menyajikan 6 dari 12 hasil                             | Diputuskan user 7 Nov: enam per tampilan dengan halaman berikutnya. UI S2 menampilkan rentang/total serta Sebelumnya/Berikutnya; diuji 6 hasil per halaman dan halaman kedua mulai nomor 7 |
| Persentase kecocokan relatif terhadap hasil teratas               | Diputuskan user 7 Nov: urutan rekomendasi tanpa persentase. Bobot/penalti internal tetap; S1 dites                                                                                         |
| LangSwitch menghilangkan query/hash; jawaban hasil perlu validasi | S2 membawa query/hash khusus route Solusi. Browser membuktikan `#cari` dan query hasil bertahan saat tautan EN dibangun                                                                    |
| Pass etalase hanya digambar ketika berubah                        | Audit `frame()` v1 + manual resmi: clear penuh menghapus piksel; flag hanya untuk rect/transform. Implementasi dan bukti render S4/S5                                                      |
| Daftar HTML hasil hilang saat 3D aktif                            | Pastikan tag/tautan HTML setara tetap dapat dioperasikan keyboard dan pembaca layar di S5                                                                                                  |
| Detail baru memperbesar S6                                        | Gunakan subplan; ukuran, fallback, perf, sumber klaim, dan review per slug menjadi bukti selesai                                                                                           |

Keputusan produk baru dan persetujuan tiap tahap dicatat di dokumen yang memilikinya, lalu ringkas perubahan lintas lingkup di sini dan di log `PLAN.md`.
