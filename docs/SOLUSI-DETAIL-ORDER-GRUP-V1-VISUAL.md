# Halaman detail solusi v1 (Order Grup): spesifikasi visual

| Info | Isi |
|---|---|
| Tanggal | 4 November 2026 |
| Sumber | `prototype/solusi-detail-order-grup-v1.html` (versi final v1 yang disetujui Heru, 4 Nov). Artifact: "Detail Solusi Order Grup Scroll" |
| Pembaca | Wildan (integrasi ke `kreatekno-website-3d`) |
| Dokumen pasangan | `docs/SOLUSI-DETAIL-ORDER-GRUP-V1-LOGIKA.md` (perilaku, rumus, timing), `docs/SOLUSI-DETAIL-ORDER-GRUP-V1-COPY.md` (semua teks) |
| Dokumen lama yang dipakai ulang | `docs/SOLUSI-V1-VISUAL.md`: token (bagian 2.1), warna tim (2.3), font (3.1), tombol (5), pop up kontak (10), aturan halaman detail fase 2 (12) |
| Cara ukur | Playwright + Chromium (WebGL lewat SwiftShader), `deviceScaleFactor` 1, font Google termuat, `prefers-reduced-motion: reduce` (supaya setiap adegan langsung di pose akhir). Angka = `getBoundingClientRect()` dan `getComputedStyle()` dalam px CSS |
| Format | Ukuran `lebar×tinggi` (px). Font `ukuran/line-height weight` (px). `x` = jarak dari kiri viewport, `y` = jarak dari atas dokumen. Satuan 3D = meter (m), Y ke atas, sudut dalam radian kecuali ditulis "derajat" |
| Viewport desktop | 1920×1080, 1440×900, 1280×800 |
| Viewport tablet | 1180×820 (iPad landscape), 1024×1366 (iPad Pro tegak), 820×1180 (iPad Air tegak), 768×1024 (iPad mini tegak). Diukur apa adanya; masalah dicatat di bagian 16 |
| Viewport HP | 390×844, 360×800 |
| Kolom "Jenis" | **TETAP** = sama di 12 solusi · **PER SOLUSI** = beda per solusi |

---

## 1. Peta ke repo

| Bagian visual | Prototipe (selector) | Tempat di repo (usulan) | Jenis |
|---|---|---|---|
| Token warna dan font | `:root` | `site/styles/globals.css` (vendor Wildan) + token Solusi di `site/components/solusi/toko.css` (lihat 2.1) | TETAP |
| Token khusus halaman detail | `--wall` (versi detail), `--team`, `--team-soft`, latar cerita | file CSS baru, misalnya `site/components/solusi/detail.css` di bawah `.solusi-detail` | TETAP (warna tim PER SOLUSI) |
| Header | `.nav` | `site/components/layout/Header.tsx` (vendor) | TETAP |
| Hero | `.hero`, `.crumb`, `.meta`, `.answer` | `site/components/solusi/detail/DetailHero.tsx` | TETAP |
| Cerita: pembuka, sticky, kartu, rel | `.story-intro`, `.sticky`, `.stage`, `.steps`, `.rail` | `site/components/solusi/detail/CeritaScroll.tsx` + `CeritaRel.tsx` | TETAP |
| Teks HTML di dunia 3D | `.w3`, `.bub`, `.pill`, `.field`, `.ghead`, `.tbl3`, `.recap`, `.res` | `site/components/solusi/detail/DuniaTeks.tsx` + `detail.css` | Kelas TETAP, isi PER SOLUSI |
| Dunia 3D | modul, bagian `// area 1` sampai `// results` | `site/world/sets/cerita/order-grup.ts` | PER SOLUSI |
| Mesin 3D (renderer, cahaya, lantai, figur, CSS3D) | modul, bagian umum | `site/world/cerita.ts` + helper figur di `site/world/core/` | TETAP |
| Ringkasan dan isi | `.page`, `.layout`, `.facts`, `.sec`… | `site/components/solusi/detail/*.tsx` | TETAP |
| Pop up kontak | `.modal` | komponen bersama etalase (`KontakModal.tsx`) | TETAP |
| Footer | `.foot` | `site/components/layout/Footer.tsx` (vendor) | TETAP |

---

## 2. Warna

### 2.1 Token CSS halaman detail

Halaman detail memakai **tema terang** (latar putih), beda dengan etalase (latar navy). Hanya ada satu tampilan (tanpa mode gelap), sama seperti website.

| Token prototipe | Hex | Sama dengan | Dipakai untuk |
|---|---|---|---|
| `--paper` | `#FFFFFF` | `--color-paper` | Latar halaman, hero, pembuka cerita, kartu adegan, pop up |
| `--wash` | `#F4F4FA` | token Solusi `--wash` | Chip, kotak jawaban, aside, tile, FAQ, kotak cocok, latar baris kontak, tombol X |
| `--wall` | `#EEEAFB` | **bentrok nama**: di etalase `--wall` = `#131951` (temuan 16.7) | Latar kutipan |
| `--ink` | `#121640` | `--color-ink` | Teks utama |
| `--muted` | `#565B81` | `--color-muted` | Teks sekunder, paragraf kartu, label tabel |
| `--line` | `rgba(19,25,81,.12)` | token Solusi `--line` | Garis tabel, garis aside, ring kartu |
| `--navy` | `#131951` | `--color-navy` | Judul, CTA, tooltip |
| `--navy-2` | `#1A2160` | token Solusi | (tidak terlihat di halaman ini) |
| `--navy-3` | `#0B0F3A` | `--color-navy-3` | Footer |
| `--purple` | `#9F0ED6` | `--color-purple` | Tombol utama, eyebrow, ring kartu aktif, titik rel aktif, aksen kotak jawaban |
| `--purple-deep` | `#7C07A8` | `--color-purple-deep` | Hover tombol, pertanyaan kotak jawaban, petunjuk gulir, link nav aktif |
| `--violet` | `#8C2BFA` | `--color-violet` | Outline fokus |
| `--cyan` | `#35EAFE` | `--color-cyan` | (dipakai di dunia 3D saja) |
| `--on-night` / `--on-night-muted` | `#F3F4FF` / `#B6BBE2` | `--color-on-night*` | Teks CTA navy, footer |
| `--run` / `--run-bg` | `#06606C` / `#DDF9FD` | token Solusi | Badge "Sudah berjalan" |
| `--idea` / `--idea-bg` | `#5B1BB5` / `#EDE3FF` | token Solusi | Badge "Siap dibuat" (solusi lain), hover baris kontak |
| `--ok` / `--ok-bg` | `#1C7A43` / `#E1F4E8` | token Solusi | Ikon cocok, kolom "Dengan asisten", titik rel selesai, label hijau di 3D |
| `--no` | `#B4233A` | token Solusi | Ikon masalah, ikon kurang cocok, label merah di 3D |
| `--team` | `#87CFD7` | warna tim Operasional (SOLUSI-V1-VISUAL 2.3) | Kotak kecil di chip tim. **PER SOLUSI**: warna tim pertama |
| `--team-soft` | `#DCEEF1` | pita dekor Operasional (2.3) | Latar chip tim. **PER SOLUSI**: pita dekor tim pertama |
| Latar cerita / area 3D siang | `#E9E4F8` | – | `.story`, `.stage`, `scene.background` |
| Latar area 3D malam | `#3B3F86` | – | Adegan 7 (campuran ke warna ini) |

### 2.2 Warna peran (orang di dunia 3D)

Warna badan figur dan warna teks nama di bubble. Warna teks sengaja lebih gelap dari warna badan untuk peran yang warnanya terang, supaya kontras di latar putih.

| Peran | Warna badan figur | Warna teks nama (bubble, label) | Jenis |
|---|---|---|---|
| Sales (Rudi, Andi) | `#3B6FE0` | `#3B6FE0` | PER SOLUSI |
| Gudang (Sari) | `#E0A11B` | `#B7800A` | PER SOLUSI |
| CS (Dina) | `#C2307A` | `#C2307A` | PER SOLUSI |
| Kurir (Bayu) | `#F2742F` | `#C2560F` | PER SOLUSI |
| Admin | `#12B5A6` | `#0E7F74` | PER SOLUSI |
| Pemilik | `#2A3277` | `#2A3277` | PER SOLUSI |
| Asisten (robot, pengirim balasan) | `#9F0ED6` | `#9F0ED6` | TETAP (warna brand) |
| Kulit semua figur | `#C68B59` | – | TETAP |
| Rambut semua figur | `#1B1B2E` | – | TETAP |

### 2.3 Warna teks HTML di dunia 3D

| Elemen | Latar | Teks | Lainnya |
|---|---|---|---|
| Bubble pesan `.bub` | `#FFFFFF` | isi `--navy`, jam `--muted` | Bayangan `0 18px 30px -18px rgba(19,25,81,.55)` + ring `0 0 0 1px rgba(19,25,81,.06)` |
| Bubble balasan/admin `.bub.mine` | `#E9FBF6` | sama | sama |
| Bubble target `.bub.hi` | `#FFFFFF` | sama | Ring ungu `0 0 0 5px #9F0ED6` + bayangan |
| Pil biasa `.pill` | `#FFFFFF` | warna peran atau `--navy` | Bayangan `0 10px 20px -14px rgba(19,25,81,.5)` |
| Pil `.dark` / `.red` / `.green` / `.purple` | `#131951` / `#B4233A` / `#1C7A43` / `#9F0ED6` | `#FFFFFF` | sama |
| Pil `.gold` | `#FFD983` | `--navy` | sama |
| Pil area `.pill.area` | `rgba(255,255,255,.95)` | `--navy` | sama |
| Balok data `.field` | Pelanggan `#EADCFD`, Barang `#D6F6FD`, Jumlah `#FFE2EE`, Alamat `#FFF1C9`, Bayar `#FBD9DF` | label `--muted`, nilai `--navy` | Bayangan `0 12px 20px -14px rgba(19,25,81,.5)` |
| Kepala grup `.ghead` | `#12B5A6` | `#FFFFFF` (anggota opacity .9) | – |
| Tabel `.tbl3` | `#FFFFFF`, kepala `#2E9E5B` | kepala `#FFFFFF`, sel `--navy`, label kolom `--muted` | Garis baris `#E4E2EE`. Baris baru: latar `rgba(159,14,214,.08)`, nomor `#9F0ED6` |
| Status `.st` | Baru `#EADCFD` · Dikirim `#DDF0FF` · Selesai `#E1F4E8` | Baru `#5B1BB5` · Dikirim `#1D5FB8` · Selesai `#1C7A43` | – |
| Rekap `.recap` | `#161B55`, kotak pesan `#FFFFFF` | jam dan tanggal `#FFFFFF` (tanggal opacity .85), pengirim `#9F0ED6`, label `--muted`, angka `--navy` | Garis `#E4E2EE` |
| Kartu angka `.res` | `#FFFFFF` | angka `--navy`, satuan `#9F0ED6`, keterangan `--muted` | Bayangan seperti bubble |

### 2.4 Warna objek 3D

Material default `MeshStandardMaterial` roughness .72, metalness 0. Lainnya ditulis di tabel bagian 9.

| Objek | Hex | Material |
|---|---|---|
| Lantai dunia | `#F4F1FC` | Standard, roughness .9 |
| Garis tepi lantai | `#9F0ED6` | Standard |
| Lingkaran area: grup chat, asisten, tabel, kurir, rumah | `#E7E1FA`, `#F0E4FD`, `#E2F4E8`, `#FDEBDD`, `#E3E6F8` | Standard, roughness .9 |
| Titik jalur | `#C5B8F0` | Standard |
| Bingkai papan grup | `#131951` | Standard, roughness .45 |
| Isi papan grup | `#F6F4FC` | Standard, roughness .8 |
| Kaki papan, alas robot, antena, atap rumah | `#2A3277` | Standard (alas robot roughness .4, atap .6) |
| Meja admin / kaki meja | `#E9C49B` / `#CF9C6C` | Standard |
| Laptop alas / tutup | `#C9C6D6` / `#8F8A99` | Standard |
| Layar laptop | tekstur canvas (putih, kepala `#2E9E5B`, teks `#131951`, garis `#D6EBDD`) | Basic |
| Kertas | `#FFFFFF` | Standard |
| Badan robot | `#9F0ED6` | Standard, roughness .45 |
| Wajah robot | `#0B0F3A` + emissive `#35EAFE` (.25, menyala .8) | Standard, roughness .3 |
| Mata robot | `#35EAFE` + emissive `#35EAFE` 1 | Standard |
| Bola antena | `#35EAFE` emissive .8 · saat membaca `#FFD983` emissive 1 | Standard |
| Papan tabel | `#FFFFFF` | Standard, roughness .6 |
| Mobil kurir: bak / kabin dan garis / kaca / roda | `#FFFFFF` / `#F2742F` / `#9FD9F5` / `#2D2C33` | Standard (bak dan kabin roughness .5, kaca .2) |
| Rumah dinding / pintu | `#F6E19A` / `#9F0ED6` | Standard (dinding roughness .8) |
| Jendela rumah | `#BDEFF8` + emissive `#FFD983` (0, malam 1.2) | Standard, roughness .3 |
| HP pemilik | `#0B0F3A` | Standard, roughness .35 |
| Amplop / tutup amplop | `#FFFFFF` / `#EADCFD` | Standard |
| Bulan | `#FFF6D8` + emissive .9 | Standard |

---

## 3. Tipografi

### 3.1 Keluarga font

Sama dengan etalase (SOLUSI-V1-VISUAL 3.1), **tanpa** JetBrains Mono (halaman detail tidak memakai mono).

| Variabel | Font | Weight dimuat | Dipakai untuk |
|---|---|---|---|
| `--display` | Bricolage Grotesque (opsz 12..96) | 500–800 | H1, H2, H3, pertanyaan kotak jawaban, nomor kartu, kutipan, FAQ tanya, angka tile, jam rekap, angka kartu 3D |
| `--body` | Plus Jakarta Sans | 400–700 | Semua teks lain, termasuk bubble dan tabel di 3D |

Aturan global: `h1,h2,h3 { display 700; letter-spacing −.02em; line-height 1.1; text-wrap: balance }`. Body 16 px, line-height 1.55, antialiased.

### 3.2 Skala teks (aturan CSS)

| Elemen | Font | Ukuran | Weight | Lainnya |
|---|---|---|---|---|
| H1 hero | display | `clamp(2.1rem, 5vw, 4rem)` | 700 | navy, letter-spacing −.035em, max 18ch |
| Pertanyaan kotak jawaban | display | 1rem / 1.35 | 700 | purple-deep |
| Teks jawaban | body | 1.125rem / 1.65 | 400 | navy |
| Breadcrumb | body | .875rem | 400 (link 600) | muted |
| Badge status | body | .6875rem / 1 | 700 | uppercase, letter-spacing .08em |
| Chip | body | .8125rem | 600 | |
| Tanggal | body | .8125rem | 400 | muted |
| Eyebrow (cerita dan section) | body | .75rem / 1 | 700 | uppercase, letter-spacing .12em, purple |
| H2 pembuka cerita, H2 section | display | `clamp(1.6rem, 3vw, 2.3rem)` | 700 | navy. H2 cerita max 28ch |
| Paragraf pembuka cerita | body | 1.0625rem | 400 | muted, max 70ch |
| Petunjuk gulir | body | .875rem | 600 | purple-deep, ikon 16 |
| Nomor kartu adegan | display | .8rem / 1 | 800 | muted, angka tabular |
| H3 kartu adegan | display | `clamp(1.35rem, 2.1vw, 1.75rem)` | 700 | navy |
| Paragraf kartu | body | 1rem / 1.6 | 400 | muted |
| Label rel | body | .78rem / 1 | 600 | navy |
| Tooltip | body | .8rem | 600 | putih di navy |
| Judul aside | display | 1.0625rem | 700 | |
| Label fakta / isi fakta | body | .6875rem 700 uppercase ls .08em / .9375rem 600 | | muted / navy |
| Catatan disamarkan | body | .8125rem / 1.45 | 400 | muted |
| Lead section | body | 1.125rem / 1.65 | 400 | navy |
| Poin daftar | body | 1.0625rem / 1.6 | 400 | |
| Tabel banding | body | .9375rem; kepala .75rem uppercase ls .06em | 400; kolom 1 700, kolom 3 600 | |
| H3 kotak cocok | display | 1.0625rem | 700 | |
| Angka tile / satuan / keterangan | display 800 2.4rem ls −.04em / 1.05rem / body .9375rem 1.5 | | | navy / purple / muted |
| Kutipan / sumber | display 600 1.15rem / 1.5 · body .85rem | | | navy / muted |
| Nama aplikasi | body | 1rem | 700 | |
| FAQ tanya / jawab | display 700 1.0625rem / 1.3 · body 1rem / 1.6 | | | navy / muted |
| H2 CTA | display | `clamp(1.5rem, 3vw, 2.2rem)` | 700 | putih |
| Footer | body | .8125rem | 400 | on-night-muted |
| Judul pop up | display | 1.5rem | 700 | |

### 3.3 Skala teks HTML di dunia 3D (px CSS sebelum diskalakan)

Ukuran di layar = ukuran di tabel × skala objek (`K × k × s × boost`, LOGIKA 6.1). Hasil terukur per viewport: tabel W1 bagian 9.7.

| Elemen | Bagian | Font | Ukuran | Weight | Lainnya |
|---|---|---|---|---|---|
| Bubble | nama | body | 17 px | 800 | warna peran, margin bawah 4 |
| Bubble | isi | body | 22 px / 1.35 | 600 | |
| Bubble | jam | body | 14 px | 400 | rata kanan, margin atas 4 |
| Pil | – | body | 22 px | 700 | nowrap |
| Pil area | – | body | 26 px | 700 | |
| Balok data | label / nilai | body | 14 px 800 uppercase ls .08em / 24 px 700 | | |
| Kepala grup | judul / anggota | body | 28 px 800 / 18 px | | |
| Tabel | judul / tanggal | body | 30 px 700 / 20 px | | |
| Tabel | label kolom / sel / status | body | 14 px uppercase ls .08em / 21 px (nomor 800) / 17 px 800 | | |
| Rekap | jam / tanggal | display 800 64 px / 1 · body 16 px | | | |
| Rekap | pengirim / judul / baris / catatan | body | 14 px 800 / 20 px 700 / 16 px (angka 800) / 13 px | | |
| Kartu angka | angka / satuan / keterangan | display 800 72 px / 1, ls −.04em, tabular · 30 px · body 20 px | | | |

---

## 4. Layout global

| Item | Nilai |
|---|---|
| `.wrap` | max 1328 px, tengah. Padding kiri kanan `max(16px, safe-area)`; mulai 700 px: `max(32px, safe-area)` |
| `.in` | max 1264 px, tengah |
| Safe area atas | `body::before` fixed setinggi `env(safe-area-inset-top)`, latar putih, z 41 |
| Body | `margin: 0`, `overflow-x: clip` |
| Tinggi nav | `--nav-h` 64 px; ≤ 640 px: 56 px. `--nav-top` 12 px |

Titik ganti (breakpoint) yang dipakai:

| Lebar | Yang berubah |
|---|---|
| ≤ 420 | Nav: padding kiri 14, logo tinggi 24, tombol .875rem padding kiri 14 |
| ≤ 640 | Tinggi nav 56 |
| ≥ 640 | Tile hasil 3 kolom; daftar aplikasi 2 kolom |
| ≥ 700 | Gutter 32 |
| ≥ 720 | Kotak cocok / kurang cocok 2 kolom |
| ≤ 759 | **Tampilan HP cerita**: sticky 55svh di atas, kartu lewat di bawah, rel jadi baris di bawah area 3D |
| ≤ 960 | Menu nav disembunyikan |
| ≥ 1000 | Hero 2 kolom; layout isi 2 kolom (aside 300 px sticky) |
| ≥ 1400 | Kartu adegan sejajar tepi kiri `.in`: padding kiri `(100vw − 1264px) / 2` |

---

## 5. Tombol dan komponen kecil

| Komponen | Nilai |
|---|---|
| `.btn` | inline-flex, gap 10, `600 1rem/1`, radius 999, padding `6px 6px 6px 20px`, min tinggi 48. Transisi transform 160 ms `cubic-bezier(.23,1,.32,1)` dan warna 200 ms. Ditekan: `scale(.97)` |
| `.knob` (lingkaran ikon) | 36×36, radius 999, `rgba(255,255,255,.18)`, ikon 20×20 |
| `.btn-main` | purple, teks putih, bayangan `0 10px 22px -12px rgba(124,7,168,.75)`. Hover purple-deep |
| `.btn-line` | transparan, warna teks ikut induk, ring `inset 0 0 0 1.5px currentColor`, padding `0 20px` |
| `.badge` | inline-flex gap 6, padding `6px 9px`, radius 999, titik 6×6 warna teks |
| `.chip` | padding `5px 10px`, radius 999, `--wash`, teks navy. `.chip.team`: latar `--team-soft`, kotak 10×10 radius 3 warna `--team` di depan |
| Fokus | outline 3 px violet, offset 3 px, radius 8 |
| Ikon tombol "Konsultasi gratis" | bubble chat dengan 3 titik (SVG 24, stroke 2) |

---

## 6. Header (nav)

Sama dengan etalase (SOLUSI-V1-VISUAL 6, Header vendor Wildan). Ringkasan prototipe:

| Item | Nilai |
|---|---|
| Posisi | fixed, z 40, tengah, top `safe-area + 12` |
| Ukuran | lebar `min(1264px, 100% − 24px)`, tinggi `--nav-h` |
| Bentuk | radius 999, latar `rgba(255,255,255,.92)` + `blur(16px) saturate(1.4)` |
| Bayangan | `0 0 0 1px rgba(19,25,81,.08), 0 12px 32px -18px rgba(19,25,81,.35)` |
| Isi | logo tinggi 28; menu gap 2, link padding `9px 12px` radius 999 600 .9375rem (hover `rgba(19,25,81,.06)`, aktif `rgba(159,14,214,.1)` purple-deep); tombol `.btn-main` .9375rem, padding kiri 18, knob 34 |

**Tabel L1. Header dan hero (terukur)**

| Viewport | Nav (w×h) | Nav x | Tombol nav | Menu | Tinggi hero | Padding hero | Kolom hero (px) | Tinggi dokumen |
|---|---|---|---|---|---|---|---|---|
| 1920x1080 | 1264×64 | 328 | 186.4×48 | tampil | 517.4 | 104px 32px 48px | 632.75 575.25 | 12966 |
| 1440x900 | 1264×64 | 88 | 186.4×48 | tampil | 517.4 | 104px 32px 48px | 632.75 575.25 | 11498 |
| 1280x800 | 1256×64 | 12 | 186.4×48 | tampil | 517.4 | 104px 32px 48px | 607.609 552.391 | 10682 |
| 1180x820 | 1156×64 | 12 | 186.4×48 | tampil | 523.5 | 104px 32px 48px | 555.234 504.766 | 10861 |
| 1024x1366 | 1000×64 | 12 | 186.4×48 | tampil | 489.2 | 104px 32px 48px | 473.516 430.484 | 15581 |
| 820x1180 | 796×64 | 12 | 186.4×48 | sembunyi | 641.5 | 104px 32px 48px | 756 | 14053 |
| 768x1024 | 744×64 | 12 | 186.4×48 | sembunyi | 632.9 | 104px 32px 48px | 704 | 12864 |
| 390x844 | 366×56 | 12 | 174.5×48 | sembunyi | 882.5 | 96px 16px 48px | 358 | 11473 |
| 360x800 | 336×56 | 12 | 174.5×48 | sembunyi | 882.5 | 96px 16px 48px | 328 | 11315 |

---

## 7. Hero

| Item | Nilai |
|---|---|
| Padding | atas `safe + 12 + nav-h + 28`, bawah 48 |
| Grid | gap 18. Mulai 1000 px: 2 kolom `minmax(0,1.1fr) minmax(0,1fr)`, gap kolom 56, rata bawah |
| Kiri | breadcrumb → baris meta (badge, chip tim, chip industri, tanggal) → H1, gap 16 |
| Kanan | kotak jawaban → baris tombol, gap 14 |
| Kotak jawaban | grid gap 10, max 70ch, padding `20px 22px`, radius 22, `--wash`, garis kiri ungu 3 px (`inset 3px 0 0`) |
| Baris tombol | flex wrap gap 10 |

**Tabel L2. Isi hero (terukur)**

| Viewport | H1 (w×h · font) | Kotak jawaban | Teks jawaban | Pertanyaan | Tombol utama | Tombol garis | y H1 / y jawaban |
|---|---|---|---|---|---|---|---|
| 1920x1080 | 632.8×281.6 · 64/70.4 700 | 575.3×190.3 | 18/29.7 400 | 531.3×21.6 · 16/21.6 700 | 198.3×48 | 183.7×48 | 187.8 / 217 |
| 1440x900 | 632.8×281.6 · 64/70.4 700 | 575.3×190.3 | 18/29.7 400 | 531.3×21.6 · 16/21.6 700 | 198.3×48 | 183.7×48 | 187.8 / 217 |
| 1280x800 | 607.6×281.6 · 64/70.4 700 | 552.4×220 | 18/29.7 400 | 508.4×21.6 · 16/21.6 700 | 198.3×48 | 183.7×48 | 187.8 / 187.4 |
| 1180x820 | 555.2×259.6 · 59/64.9 700 | 504.8×241.6 | 18/29.7 400 | 460.8×43.2 · 16/21.6 700 | 198.3×48 | 183.7×48 | 216 / 171.9 |
| 1024x1366 | 473.5×225.3 · 51.2/56.3 700 | 430.5×271.3 | 18/29.7 400 | 386.5×43.2 · 16/21.6 700 | 198.3×48 | 183.7×48 | 216 / 107.9 |
| 820x1180 | 473.8×135.3 · 41/45.1 700 | 756×190.3 | 18/29.7 400 | 712×21.6 · 16/21.6 700 | 198.3×48 | 183.7×48 | 187.8 / 341.1 |
| 768x1024 | 445×126.7 · 38.4/42.2 700 | 704×190.3 | 18/29.7 400 | 660×21.6 · 16/21.6 700 | 198.3×48 | 183.7×48 | 187.8 / 332.5 |
| 390x844 | 358×147.8 · 33.6/37 700 | 358×330.7 | 18/29.7 400 | 314×43.2 · 16/21.6 700 | 198.3×48 | 183.7×48 | 218 / 383.8 |
| 360x800 | 328×147.8 · 33.6/37 700 | 328×330.7 | 18/29.7 400 | 284×43.2 · 16/21.6 700 | 198.3×48 | 183.7×48 | 218 / 383.8 |

---

## 8. Cerita 3D (section "Cara kerjanya")

### 8.1 Struktur dan latar

| Bagian | Nilai |
|---|---|
| `.story` | latar `#E9E4F8` |
| `.story-intro` | latar putih, padding `56px` atas `36px` bawah, isi grid gap 12 |
| `.sticky` desktop | sticky top 0, tinggi `100svh`, overflow hidden |
| `.sticky` HP | tinggi `55svh`, z 5 |
| `.stage` | absolute inset 0, latar ikut langit (`#E9E4F8` siang, campuran ke `#3B3F86` malam) |
| Canvas | absolute inset 0, 100% × 100% |
| Lapisan CSS3D `.css3d` | absolute inset 0, `pointer-events: none` |
| Catatan tanpa 3D | absolute kiri kanan bawah 16, z 5, padding `10px 14px`, radius 14, `rgba(255,255,255,.9)`, navy 600. Hanya saat `html.no3d` |

**Tabel C1. Pembuka cerita (terukur)**

| Viewport | Tinggi | Padding | H2 | Paragraf (lebar · font) | Petunjuk | y mulai |
|---|---|---|---|---|---|---|
| 1920x1080 | 295.3 | 56px 32px 36px | 665.6×80.9 · 36.8/40.5 700 | 871.1 · 17/26.4 400 | 14/21.7 600 | 517.4 |
| 1440x900 | 295.3 | 56px 32px 36px | 665.6×80.9 · 36.8/40.5 700 | 871.1 · 17/26.4 400 | 14/21.7 600 | 517.4 |
| 1280x800 | 295.3 | 56px 32px 36px | 665.6×80.9 · 36.8/40.5 700 | 871.1 · 17/26.4 400 | 14/21.7 600 | 517.4 |
| 1180x820 | 292.3 | 56px 32px 36px | 641.1×77.9 · 35.4/38.9 700 | 871.1 · 17/26.4 400 | 14/21.7 600 | 523.5 |
| 1024x1366 | 281.9 | 56px 32px 36px | 559.9×67.6 · 30.7/33.8 700 | 871.1 · 17/26.4 400 | 14/21.7 600 | 489.2 |
| 820x1180 | 270.7 | 56px 32px 36px | 469.4×56.3 · 25.6/28.2 700 | 756 · 17/26.4 400 | 14/21.7 600 | 641.5 |
| 768x1024 | 270.7 | 56px 32px 36px | 469.4×56.3 · 25.6/28.2 700 | 704 · 17/26.4 400 | 14/21.7 600 | 632.9 |
| 390x844 | 351.5 | 56px 16px 36px | 358×84.4 · 25.6/28.2 700 | 358 · 17/26.4 400 | 14/21.7 600 | 882.5 |
| 360x800 | 377.8 | 56px 16px 36px | 328×84.4 · 25.6/28.2 700 | 328 · 17/26.4 400 | 14/21.7 600 | 882.5 |

### 8.2 Kartu adegan

| Item | Desktop (> 759) | HP (≤ 759) |
|---|---|---|
| Blok `.step` | flex, rata tengah vertikal. Tinggi min 88svh, blok 1 dan 9 100svh. Padding kiri `max(32px, safe)` (≥ 1400: `(100vw − 1264px)/2`), kanan 16 | rata atas, tinggi min 62svh (blok 9 50svh), padding `18px 16px 40px` |
| Lapisan `.steps` | z 4, `margin-top: −100svh`, `pointer-events: none` (kartu `auto`) | z 1, latar putih, tanpa margin |
| Kartu `.card` | lebar `min(370px, 100%)`, grid gap 10, padding `22px 24px`, radius 24, `rgba(255,255,255,.96)` | lebar 100% |
| Bayangan kartu | `0 0 0 1px var(--line), 0 24px 50px -30px rgba(19,25,81,.5)` | hanya ring 1 px `--line` |
| Kartu aktif `.on` | ring 2 px `--purple` + bayangan, transisi 200 ms | sama |
| Isi | nomor → eyebrow → H3 → paragraf (→ tombol di kartu 9, padding atas 4) | sama |

**Tabel C3. Blok dan kartu adegan (terukur)**

| Viewport | Blok 1 (h) | Blok 2–8 (h) | Blok 9 (h) | Padding blok | Nomor | Eyebrow | H3 (lebar · font) | Paragraf | Tombol kartu 9 |
|---|---|---|---|---|---|---|---|---|---|
| 1920x1080 | 1080 | 950.4 | 1080 | 0px 16px 0px 328px | 12.8/12.8 800 | 12/12 700 | 322 · 28/30.8 700 | 16/25.6 400 | 198.3×48 |
| 1440x900 | 900 | 792 | 900 | 0px 16px 0px 88px | 12.8/12.8 800 | 12/12 700 | 322 · 28/30.8 700 | 16/25.6 400 | 198.3×48 |
| 1280x800 | 800 | 704 | 800 | 0px 16px 0px 32px | 12.8/12.8 800 | 12/12 700 | 322 · 26.9/29.6 700 | 16/25.6 400 | 198.3×48 |
| 1180x820 | 820 | 721.6 | 820 | 0px 16px 0px 32px | 12.8/12.8 800 | 12/12 700 | 322 · 24.8/27.3 700 | 16/25.6 400 | 198.3×48 |
| 1024x1366 | 1366 | 1202.1 | 1366 | 0px 16px 0px 32px | 12.8/12.8 800 | 12/12 700 | 322 · 21.6/23.8 700 | 16/25.6 400 | 198.3×48 |
| 820x1180 | 1180 | 1038.4 | 1180 | 0px 16px 0px 32px | 12.8/12.8 800 | 12/12 700 | 322 · 21.6/23.8 700 | 16/25.6 400 | 198.3×48 |
| 768x1024 | 1024 | 901.1 | 1024 | 0px 16px 0px 32px | 12.8/12.8 800 | 12/12 700 | 322 · 21.6/23.8 700 | 16/25.6 400 | 198.3×48 |
| 390x844 | 523.3 | 523.3 | 422 | 18px 16px 40px | 12.8/12.8 800 | 12/12 700 | 310 · 21.6/23.8 700 | 16/25.6 400 | 198.3×48 |
| 360x800 | 496 | 496 | 400 | 18px 16px 40px | 12.8/12.8 800 | 12/12 700 | 280 · 21.6/23.8 700 | 16/25.6 400 | 198.3×48 |

### 8.3 Area bebas untuk 3D (desktop)

Kartu menutupi kiri layar. Proyeksi kamera digeser supaya pusat adegan ada di tengah area kanan kartu (LOGIKA 5.2). Angka per viewport:

**Tabel C2. Area 3D, kartu, dan area bebas (terukur + rumus LOGIKA 5)**

| Viewport | Sticky / stage (w×h) | Tinggi `.story-body` | Kartu (w×h, x) | Tepi kanan kartu | Lebar bebas | Geser X | Geser Y | fa = bebas / H | fit |
|---|---|---|---|---|---|---|---|---|---|
| 1920x1080 | 1920×1080 | 8812.7 | 370×211.6 x328 | 698 | 1152 | 314 | 0 | 1.07 | 1.03 |
| 1440x900 | 1440×900 | 7344 | 370×211.6 x88 | 458 | 912 | 194 | 0 | 1.01 | 1.07 |
| 1280x800 | 1280×800 | 6528 | 370×209.1 x32 | 402 | 808 | 166 | 0 | 1.01 | 1.08 |
| 1180x820 | 1180×820 | 6691.2 | 370×204.5 x32 | 402 | 708 | 166 | 0 | 0.86 | 1.23 |
| 1024x1366 | 1024×1366 | 11146.5 | 370×197.5 x32 | 402 | 552 | 166 | 0 | 0.40 | 2.34 |
| 820x1180 | 820×1180 | 9628.7 | 370×197.5 x32 | 402 | 348 | 166 | 0 | 0.29 | 3.06 |
| 768x1024 | 768×1024 | 8355.8 | 370×197.5 x32 | 402 | 300 | 166 | 0 | 0.29 | 3.08 |
| 390x844 | 390×464.2 | 5072.3 | 358×197.5 x16 | – | 390 | 0 | 34 | 0.84 | 1.26 |
| 360x800 | 360×440 | 4808 | 328×197.5 x16 | – | 360 | 0 | 34 | 0.82 | 1.29 |

### 8.4 Rel titik

| Item | Desktop | HP |
|---|---|---|
| Posisi | kanan `max(18px, safe)`, tengah vertikal, grid gap 4, z 6 | bawah 10, tengah horizontal, flex gap 2, padding `4px 8px`, radius 999, `rgba(255,255,255,.85)` |
| Tombol | flex rata kanan, gap 10, tinggi min 32, padding `4px 6px` | tinggi min 28, padding `4px 5px` |
| Label | padding `5px 9px`, radius 999, `rgba(255,255,255,.92)`. Tersembunyi (opacity 0, geser 6 px), tampil saat hover/fokus/aktif, 160 ms | tidak tampil |
| Titik | 12×12, radius 99, `rgba(19,25,81,.22)`, ring `0 0 0 3px rgba(255,255,255,.7)` | 9×9 |
| Titik aktif | purple, `scale(1.35)` | sama |
| Titik selesai (`done`) | `--ok` | sama |

**Tabel C4. Rel titik (terukur, adegan 1 aktif: titik 1 diskalakan 1.35)**

| Viewport | Rel (w×h, x) | Display | Tombol | Titik aktif | Padding rel | Latar rel |
|---|---|---|---|---|---|---|
| 1920x1080 | 130×320 x1772 | grid | 130×32 | 16.2×16.2 | 0px | rgba(0, 0, 0, 0) |
| 1440x900 | 130×320 x1292 | grid | 130×32 | 16.2×16.2 | 0px | rgba(0, 0, 0, 0) |
| 1280x800 | 130×320 x1132 | grid | 130×32 | 16.2×16.2 | 0px | rgba(0, 0, 0, 0) |
| 1180x820 | 130×320 x1032 | grid | 130×32 | 16.2×16.2 | 0px | rgba(0, 0, 0, 0) |
| 1024x1366 | 130×320 x876 | grid | 130×32 | 16.2×16.2 | 0px | rgba(0, 0, 0, 0) |
| 820x1180 | 130×320 x672 | grid | 130×32 | 16.2×16.2 | 0px | rgba(0, 0, 0, 0) |
| 768x1024 | 130×320 x620 | grid | 130×32 | 16.2×16.2 | 0px | rgba(0, 0, 0, 0) |
| 390x844 | 203×36 x93.5 | flex | 19×28 | 12.1×12.1 | 4px 8px | rgba(255, 255, 255, 0.85) |
| 360x800 | 203×36 x78.5 | flex | 19×28 | 12.1×12.1 | 4px 8px | rgba(255, 255, 255, 0.85) |

### 8.5 Tooltip area

absolute, z 5, padding `6px 10px`, radius 10, navy, teks putih .8rem 600. Muncul opacity 0 → 1 dalam 120 ms. Posisi kursor + (14, −40) px, x maks. `W − 220`.

---

## 9. Dunia 3D (contoh Order Grup)

### 9.1 Renderer, cahaya, langit (TETAP)

| Item | Nilai |
|---|---|
| Renderer | `WebGLRenderer({ antialias: true })`, pixel ratio `min(dpr, 1.5)`, sRGB, `NeutralToneMapping` exposure .95 |
| Bayangan | `PCFShadowMap`, peta 2048, kamera bayangan kiri −11 kanan 11 atas 7 bawah −7, near 1 far 30, bias −.0005, normalBias .04 |
| Hemisphere | langit `#F6F2FF`, tanah `#CFC6EE`, intensitas 1.55 (malam .8) |
| Directional (matahari, memberi bayangan) | `#FFF7EE`, 2.1 (malam .6), posisi (−4, 9, 7), target (−1.5, 0, 1) |
| Langit | siang `#E9E4F8`, malam `#3B3F86` |
| Kamera | perspektif, fov 32 derajat, near .1, far 120 (posisi per adegan: LOGIKA 5.3) |
| Lantai | rounded box 24 × .3 × 11 (radius .12) di (−.5, −.15, .8), atas lantai di y 0. Garis tepi ungu 24.2 × .06 × 11.2 (radius .08) di (−.5, −.3, .8). Tidak memberi bayangan, menerima bayangan |
| Semua objek lain | memberi dan menerima bayangan, kecuali yang ditulis "tanpa bayangan" |

### 9.2 Figur orang (TETAP)

| Bagian | Geometri | Posisi relatif figur |
|---|---|---|
| Badan | kapsul radius .2, panjang .42 (6 × 16 segmen), warna peran, roughness .6 | (0, .42, 0) |
| Kepala | bola radius .17 (20 × 14), kulit `#C68B59`, roughness .7 | (0, .98, 0) |
| Rambut | setengah bola radius .175, sudut vertikal 0 sampai .45π, `#1B1B2E` | (0, 1.0, −.01), rotasi x −.2 |
| Tinggi total | ±1.15 m | |

### 9.3 Area dan objek (PER SOLUSI)

Koordinat dunia (m). Grup memakai posisi induk; anak ditulis relatif.

**Lingkaran area** (silinder tinggi .04, 64 segmen, tanpa bayangan, y .02; hover +.03):

| Area | Pusat (x, z) | Radius | Warna | Label area (posisi) |
|---|---|---|---|---|
| Grup chat tim | (−6.2, .2) | 2.7 | `#E7E1FA` | (−6.2, .25, 2.75) |
| Asisten Order | (−1.6, −.1) | 1.6 | `#F0E4FD` | (−1.6, .25, 1.35) |
| Tabel order | (2.5, −.6) | 2.0 | `#E2F4E8` | (2.5, .25, 1.25) |
| Kurir | (3.4, 3.0) | 1.6 | `#FDEBDD` | (3.4, .25, 4.45) |
| Rumah pemilik | (6.9, −.4) | 1.9 | `#E3E6F8` | (6.9, .25, 1.35) |

**Titik jalur** (silinder radius .06, tinggi .02, 12 segmen, `#C5B8F0`, y .05, tanpa bayangan): dibagi rata di 4 garis: (−3.6, .1) → (−3.1, −.1) 2 titik · (−.1, −.2) → (.6, −.4) 3 titik · (3.0, 1.3) → (3.3, 1.6) 2 titik · (4.5, −.5) → (5.1, −.45) 2 titik.

**Area 1: grup chat**

| Objek | Geometri (m) | Posisi | Rotasi / catatan |
|---|---|---|---|
| Papan (grup) | | (−6.0, 0, −1.3) | |
| · bingkai | rounded box 3.1 × 4.2 × .1, radius .14, `#131951` | (0, 2.45, 0) | atas papan y 4.55 |
| · isi | rounded box 2.94 × 4.04 × .02, radius .1, `#F6F4FC` | (0, 2.45, .055) | tanpa bayangan |
| · 2 kaki | rounded box .08 × .45 × .08, radius .02, `#2A3277` | (±1.25, .225, 0) | |
| Rudi (sales) | figur | (−7.5, 0, .9) | rotasi y = `atan2(−6.0 − x, −1.3 − z) × .6` (menghadap papan, 60%) |
| Andi (sales) | figur | (−6.3, 0, 1.6) | sama |
| Sari (gudang) | figur | (−5.1, 0, 1.4) | sama |
| Dina (CS) | figur | (−4.2, 0, .7) | sama |
| Meja admin | rounded box 1.3 × .06 × .7, radius .02, `#E9C49B` | (−8.7, .72, −.6) | |
| · 4 kaki | rounded box .05 × .7 × .05, `#CF9C6C` | (−8.7 ± .58, .35, −.6 ± .28) | |
| Laptop (grup) | | (−8.7, .76, −.72) | |
| · alas | rounded box .62 × .02 × .42, `#C9C6D6` | (0, 0, .1) | |
| · tutup (grup engsel) | | (0, .01, −.1) | rotasi x −.15 (terbuka), 1.45 (tertutup, adegan 8–9) |
| · · panel tutup | rounded box .62 × .42 × .02, `#8F8A99` | (0, .21, 0) | |
| · · layar | plane .58 × .38, `CanvasTexture` 400 × 260 | (0, .21, .012) | Basic, tanpa bayangan |
| Tumpukan kertas | 6 × rounded box .26 × .012 × .34, `#FFFFFF` | (−8.25, .76, −.55) + (sin(2i) × .03, i × .014, cos(3i) × .03) | rotasi y i × .2. Hilang di adegan 8–9 |
| Admin | figur `#12B5A6` | (−8.7, 0, .02) | rotasi y π (menghadap laptop) |

**Layar laptop (canvas 400 × 260 px)**: latar putih; bar kepala 400 × 34 `#2E9E5B`; teks kepala putih `700 18px Plus Jakarta Sans` di (14, 23); 3 baris `600 18px` `#131951` di y 70, 122, 174, kolom x 14 / 170 / 330; garis `#D6EBDD` 1 px di y + 16 dari x 10 sampai 390. Teksnya: COPY 6.9.

**Area 2: asisten**

| Objek | Geometri (m) | Posisi | Catatan |
|---|---|---|---|
| Robot (grup) | | (−1.6, 0, −.3) | Bergetar naik .03 saat membaca |
| · alas | silinder atas .62 bawah .7, tinggi .3, 40 segmen, `#2A3277` roughness .4 | (0, .15, 0) | |
| · badan | rounded box 1.0 × 1.05 × .8, radius .22, `#9F0ED6` roughness .45 | (0, .85, 0) | |
| · wajah | rounded box .74 × .5 × .04, radius .1 | (0, .92, .41) | tanpa bayangan, warna dan emissive di 2.4 |
| · 2 mata | kapsul radius .045, panjang .08 | (±.15, .95, .44) | tanpa bayangan. Kedip: skala y .2 |
| · antena | silinder radius .02, tinggi .25, `#2A3277` | (0, 1.5, 0) | |
| · bola antena | bola radius .07 | (0, 1.65, 0) | tanpa bayangan |
| Mulut (titik tujuan) | – | (−1.6, .95, .15) | tempat bubble masuk dan balasan keluar |
| Tumpukan balok data | – | balok i di (−.25, .6 + (4 − i) × .44, .05) | i 0 paling atas (y 2.36) sampai i 4 (y .6) |

**Area 3: tabel order**

| Objek | Geometri (m) | Posisi | Catatan |
|---|---|---|---|
| Papan (grup) | | (2.6, 0, −1.3) | |
| · panel | rounded box 3.7 × 2.7 × .1, radius .12, `#FFFFFF` roughness .6 | (0, 1.85, 0) | atas y 3.2, bawah y .5 |
| · 2 kaki | rounded box .08 × .6 × .08, `#2A3277` | (±1.5, .3, 0) | |
| Tujuan balok (baris tabel) | – | (2.2, 2.174, −1.1) | |

**Area 4: kurir**

| Objek | Geometri (m) | Posisi | Catatan |
|---|---|---|---|
| Mobil (grup) | | (4.1, 0, 2.8), rotasi y −π/2 | x maju ke 5.7 di adegan 6 |
| · bak | rounded box 1.3 × .75 × .8, radius .1, `#FFFFFF` roughness .5 | (−.2, .62, 0) | |
| · kabin | rounded box .55 × .6 × .8, radius .1, `#F2742F` roughness .5 | (.68, .5, 0) | |
| · kaca | rounded box .04 × .3 × .66, radius .02, `#9FD9F5` roughness .2 | (.95, .62, 0) | tanpa bayangan |
| · garis | rounded box 1.0 × .12 × .02, `#F2742F` | (−.2, .62, .41) | tanpa bayangan |
| · 4 roda | silinder radius .17, tebal .12, 20 segmen, `#2D2C33` | (−.5 / .6, .17, ±.4), rotasi x π/2 | |
| Bayu (kurir) | figur `#F2742F` | (2.7, 0, 3.3) | rotasi y −2.4 |

**Area 5: rumah pemilik**

| Objek | Geometri (m) | Posisi | Catatan |
|---|---|---|---|
| Rumah (grup) | | (6.3, 0, −.9) | |
| · dinding | rounded box 1.6 × 1.2 × 1.2, radius .05, `#F6E19A` roughness .8 | (0, .6, 0) | |
| · atap | kerucut radius 1.25, tinggi .7, 4 sisi, `#2A3277` roughness .6 | (0, 1.55, 0) | rotasi y π/4, skala z .8 |
| · jendela | rounded box .42 × .38 × .03, radius .02 | (−.35, .7, .61) | tanpa bayangan, menyala malam |
| · pintu | rounded box .3 × .6 × .03, `#9F0ED6` | (.35, .3, .61) | tanpa bayangan |
| Pemilik | figur `#2A3277` | (7.6, 0, −.2) | rotasi y −.5 |
| HP pemilik (grup) | rounded box 1.36 × 2.36 × .08, radius .16, `#0B0F3A` roughness .35 | (8.65, 2.2, −.5) | skala 0 → 1 di adegan 7; selalu menghadap kamera (sumbu y) |
| Amplop (grup) | badan rounded box .5 × .32 × .05 radius .03 `#FFFFFF`; tutup kerucut radius .3 tinggi .16, 4 sisi, `#EADCFD` di (0, .07, .03) rotasi (π/2, π/4, 0) | terbang (LOGIKA 7.7) | tutup tanpa bayangan |
| Bulan | bola radius .35 (24 × 16) | (5.2, 4.8, −2.6) | tanpa bayangan, hanya malam |

### 9.4 Bentuk teks HTML di dunia 3D (kelas CSS, TETAP)

| Kelas | Lebar | Padding | Radius | Lainnya |
|---|---|---|---|---|
| `.bub` | 340 px | `14px 18px 16px` | `24px 24px 24px 8px` (ekor kiri bawah) | `.mine`: radius `24px 24px 8px 24px` (ekor kanan bawah) |
| `.pill` | otomatis | `8px 16px` | 999 | `.area`: padding `10px 20px` |
| `.field` | 330 px | `10px 16px` | 16 | |
| `.ghead` | 660 px | `16px 22px` | `14px 14px 0 0` | |
| `.tbl3` | 820 px | kepala `16px 24px`; label kolom `12px 16px 8px`; sel `14px 16px` | 18 (overflow hidden) | kepala flex, judul kiri tanggal kanan; status `.st` padding `5px 14px` radius 999 |
| `.recap` | 300 px | `22px 18px 18px`; kotak pesan padding 16, margin atas 16 | 40; kotak pesan 22 | baris `dl` padding `7px 0`, garis atas 1 px |
| `.res` | 400 px | `18px 22px` | 24 | satuan margin kiri 6; keterangan margin atas 8 |

### 9.5 Tempat menempel teks HTML (PER SOLUSI)

`Sprite` = selalu menghadap kamera. `Datar` = menempel di bidang objek. Skala layar = `.0042 × k × s × boost` (LOGIKA 6.1).

| id | Jenis | `k` | Posisi (m) | Catatan |
|---|---|---|---|---|
| `w-a0`…`w-a4` | Sprite | 1 | tabel 9.3 "Label area" | |
| `w-ghead` | Datar | 1 | (−6.0, 4.298, −1.225) | atas isi papan; lebar 2.77 m |
| `w-lRudi`, `w-lAndi`, `w-lSari`, `w-lDina` | Sprite | .85 | (x figur, 1.45, z figur) | |
| `w-lAdmin`, `w-lAdmin2` | Sprite | .85 | (−8.7, 1.55, 0) | bergantian |
| `w-m0`…`w-m5` adegan 1 | Sprite | 1, skala 1.1 | (−7.1, 2.7, .3) · (−5.0, 3.0, .5) · (−6.5, 1.9, .9) · (−4.5, 2.1, .4) · (−7.7, 1.6, .6) · (−5.3, 1.3, 1.1) | miring `rotation2D` .1 · −.08 · .05 · −.12 · .1 · −.05 rad |
| `w-m3`…`w-m5` adegan 2–9 | Sprite | 1 | (−6.0, 3.73, −1.05) · (−6.0, 3.11, −1.05) · (−6.0, 2.49, −1.05) | slot papan, jarak .62 |
| `w-m0`…`w-m2` adegan 2–9 | Sprite | skala 0 | (−6.0, 4.23, −1.1) | mengecil dan hilang |
| `w-tagA`, `w-tagB` | Sprite | .8 | bubble `w-m2` + (.55, .38, .1), bubble `w-m4` + (.6, .38, .1) | |
| `w-count` | Sprite | .9 | (−6.0, 4.9, −1.1) | di atas papan |
| `w-target` | Sprite | 1 | kepala Andi (−6.3, 1.9, 1.6) → slot (−6.0, 1.45, −1.0) → mulut | skala .5 → .9 → .18 |
| `w-ai` | Sprite | .9 | (−.25, 2.75, .05) | di atas tumpukan balok |
| `w-f0`…`w-f4` | Sprite | .95 | tumpukan 9.3 area 2 | |
| `w-table` | Datar | 1.0337 (= 3.56 m / (820 × .0042)) | (2.6, 1.85, −1.24) | lebar 3.56 m, papan 3.7 m |
| `w-rev` | Sprite | .8 | (2.6, .25, −.95) | di bawah papan tabel |
| `w-reply` | Sprite | 1 | slot balasan (−5.95, 1.5, −.98) | |
| `w-tick` | Sprite | .85 | (−6.3, 1.95, 1.6) | kepala Andi |
| `w-lBayu` | Sprite | .85 | (2.7, 1.45, 3.3) | |
| `w-k1`, `w-k2` | Sprite | .8 | (3.85, 1.95, 3.6), (3.85, 1.38, 3.6) | kanan Bayu |
| `w-lOwner` | Sprite | .85 | (7.6, 1.45, −.2) | |
| `w-clock` | Sprite | 1.1 | (6.3, 2.5, −.9) | di atas atap rumah |
| `w-recap` | Datar | 1.0 (= 1.26 m / (300 × .0042)) | HP pemilik + .05 m ke depan, ikut rotasi HP | lebar 1.26 m, HP 1.36 m |
| `w-r0`, `w-r1`, `w-r2` | Datar | 1.5 | (−3.3, 5.1 / 3.85 / 2.6, 1.7) | menghadap kamera (sumbu y), naik turun ±.04 |
| `w-ex` | Sprite | 1 | (−3.3, 6.05, 1.7) | |
| `w-help` | Sprite | .85 | (−8.4, 2.2, 0) | |

HP: semua sprite dikali 1.35. Objek datar tidak.

### 9.6 Ukuran kerja untuk solusi baru

| Aturan | Nilai Order Grup |
|---|---|
| 1 px CSS teks dunia | .0042 m |
| Bubble standar | 1.43 m lebar (340 px) |
| Jarak slot bubble di papan | .62 m |
| Lebar dunia | ±16 m (x −8.7 sampai 8.65), kedalaman ±5 m |
| Tinggi tertinggi | papan 4.55 m, kartu angka 5.1 + .6 m |
| Jarak kamera adegan dekat | 7.4 sampai 10 m; pandangan luas 13 sampai 19 m |

### 9.7 Ukuran teks dunia di layar (terukur)

**Tabel W1. Ukuran huruf di layar untuk teks utama tiap adegan (px CSS, ✂ = sebagian keluar area 3D)**

| Viewport | 1: `w-m2` (isi bubble, 22 px) | 2: `w-m5` (isi bubble, 22 px) | 3: `w-f1` (nilai balok, 24 px) | 4: `w-table` (sel tabel, 21 px) | 5: `w-reply` (isi balasan, 22 px) | 6: `w-k1` (isi bubble kurir, 22 px) | 7: `w-recap` (baris rekap, 16 px) | 8: `w-r1` (angka kartu, 72 px) | 9: `w-table` (sel tabel, 21 px) |
|---|---|---|---|---|---|---|---|---|---|
| 1920x1080 | 20.4 | 18.1 | 21.7 | 19.7 | 15.6 | 21.7 | 17.1 | 75.5 | 8.6 |
| 1440x900 | 16.2 | 14.5 | 17.3 | 15.8 | 12.5 | 17.0 | 10.4 ✂ | 59.7 | 6.8 |
| 1280x800 | 14.4 | 12.8 | 15.3 | 14.0 | 11.1 | 15.1 | 12.1 | 52.9 | 6.1 |
| 1180x820 | 12.8 | 11.7 | 13.7 | 12.6 | 10.1 | 12.9 | 10.8 | 46.4 | 5.5 |
| 1024x1366 | 10.9 | 10.7 | 11.8 | 11.3 | 9.3 | 9.8 | 9.3 | 37.9 | 4.8 |
| 820x1180 | 7.1 | 7.2 | 7.8 | 7.5 | 6.2 | 6.2 | 6.1 | 24.6 | 3.2 |
| 768x1024 | 6.2 | 6.2 | 6.7 | 6.5 | 5.3 | 5.4 | 5.3 | 21.2 | 2.8 |
| 390x844 | 9.5 | 8.7 | 10.2 | 8.4 | 7.6 | 8.4 | 7.2 | 25.6 | 3.0 |
| 360x800 | 8.8 | 8.1 | 9.5 | 7.8 | 7.0 | 7.7 | 6.7 | 23.6 | 2.8 |

**Tabel W2. Teks dunia 3D yang terpotong tepi area 3D per adegan (terukur, keadaan akhir)**

| Viewport | Adegan 1 | Adegan 2 | Adegan 3 | Adegan 4 | Adegan 5 | Adegan 6 | Adegan 7 | Adegan 8 | Adegan 9 |
|---|---|---|---|---|---|---|---|---|---|
| 1920x1080 | – | – | `w-table` | `w-a1` | `w-a1` | `w-a1`, `w-a4` | `w-a4`, `w-table` | `w-a1` | – |
| 1440x900 | – | – | `w-ghead`, `w-table` | – | `w-a1` | `w-a1`, `w-a4` | `w-a1`, `w-a4`, `w-recap` | – | – |
| 1280x800 | – | – | `w-ghead`, `w-table` | `w-a1` | `w-a1` | `w-a4` | `w-a4`, `w-table` | – | `w-a4` |
| 1180x820 | – | – | `w-ghead`, `w-table` | – | – | `w-a1`, `w-a3`, `w-a4` | `w-table` | – | `w-a4` |
| 1024x1366 | – | – | `w-a0`, `w-ghead`, `w-lAndi`, `w-table` | – | – | `w-a1`, `w-a4`, `w-lOwner` | `w-a2`, `w-table`, `w-lBayu` | `w-a1` | – |
| 820x1180 | – | – | `w-table` | `w-ghead` | – | `w-a4`, `w-lOwner` | `w-table` | – | `w-a4` |
| 768x1024 | – | – | `w-table` | `w-ghead`, `w-lSari`, `w-m3`, `w-m4`, `w-m5` | – | `w-a4`, `w-lDina`, `w-lOwner` | – | – | `w-a4` |
| 390x844 | `w-a0`, `w-m3` | `w-lAdmin` | `w-table` | `w-lBayu` | `w-a0`, `w-a1`, `w-tick` | `w-a4`, `w-table`, `w-lOwner` | `w-clock` | `w-a1` | `w-a0`, `w-ghead`, `w-lAndi`, `w-m3`, `w-m4`, `w-m5` |
| 360x800 | `w-a0`, `w-m3` | `w-lAdmin` | `w-table` | `w-lBayu` | `w-a0`, `w-a1`, `w-tick` | `w-a4`, `w-table`, `w-lOwner` | `w-clock` | `w-a1` | `w-a0`, `w-ghead`, `w-lAndi`, `w-m3`, `w-m4`, `w-m5` |

Catatan: label area dan label nama di tepi yang terpotong adalah wajar (dunia lebih lebar dari layar). Yang perlu diperhatikan: teks utama adegan (tabel W1 bertanda ✂) dan semua angka di bawah ±9 px.

---

## 10. Ringkasan (aside) dan isi

| Bagian | Nilai |
|---|---|
| `.page` | padding atas 64, bawah 80 |
| `.layout` | grid gap 40. Mulai 1000 px: kolom `300px minmax(0,1fr)`, gap 64, rata atas |
| Aside `.facts` | radius 24, `--wash`, padding `20px 20px 6px`. Mulai 1000 px sticky, top `12 + nav-h + 20` |
| Catatan disamarkan | flex gap 8, margin `6px 0 12px`, padding `10px 12px`, radius 14, putih, ikon centang lingkaran 16 ungu |
| Baris fakta | padding `11px 0`, garis atas 1 px `--line`. Label lalu isi (margin atas 3) |
| `.body` | grid gap `clamp(48px, 6vw, 64px)` |
| `.sec` | grid gap 14, max 70ch, `scroll-margin-top: 96px`. `.sec.wide` (terkait): tanpa max |
| Daftar poin `.ticks` | grid gap 10. Baris grid `22px minmax(0,1fr)` gap 10. Ikon 20×20, margin atas 4. Masalah dan kurang cocok: segitiga peringatan / silang `--no`. Cocok: centang lingkaran `--ok`. Persiapan dan "yang kami bangun": centang `--purple` |
| Tabel banding | wrapper overflow-x auto, radius 18, ring dalam 1 px `--line`. Tabel min-width 520, sel padding `13px 16px`, garis bawah 1 px; kepala `--wash`; baris terakhir tanpa garis |
| Dua kolom cocok | grid gap 12 (≥ 720: 2 kolom). Kotak padding 18, radius 20, `--wash`, grid gap 10 |
| Tile hasil | grid gap 12 (≥ 640: 3 kolom). Tile padding 18, radius 20, `--wash`. Keterangan margin atas 8 |
| Kutipan | `<figure>` margin 0, padding `20px 22px`, radius 20, `--wall` (`#EEEAFB`), grid gap 8 |
| Aplikasi | grid gap 10 (≥ 640: 2 kolom). Baris flex gap 12, padding `14px 16px`, radius 18, ring dalam 1 px. Kotak ikon 34×34 radius 10: WhatsApp `#12B5A6` (ikon bubble), Google Sheets `#2E9E5B` (ikon tabel), ikon putih 20 |
| FAQ | grid gap 12. Kotak padding `18px 20px`, radius 20, `--wash`. Jawaban margin atas 6 |
| CTA | grid gap 14, padding `clamp(22px, 4vw, 36px)`, radius 26, navy, teks `--on-night`, paragraf `--on-night-muted`, tombol garis warna `--on-night` |
| Solusi terkait | grid gap 10. Baris grid `22px 1fr` gap 10, ikon panah kanan 20 ungu (margin atas 3), link 700 navy bergaris bawah (default browser) |
| Footer | `--navy-3`, teks `--on-night-muted` .8125rem. Isi flex wrap, rata antara, gap 12, padding `24px 0`, logo tinggi 22 |

**Tabel B1. Ringkasan dan isi (terukur)**

| Viewport | Kolom layout (px) | Aside (w×h) | Posisi aside | Lebar isi | H2 section | Lead | Poin | Tile (w×h) | Angka tile |
|---|---|---|---|---|---|---|---|---|---|
| 1920x1080 | 300 900 | 300×385.6 | sticky | 900 | 36.8/40.5 700 | 18/29.7 400 | 17/27.2 400 | 265.3×127.4 | 38.4/38.4 800 |
| 1440x900 | 300 900 | 300×385.6 | sticky | 900 | 36.8/40.5 700 | 18/29.7 400 | 17/27.2 400 | 265.3×127.4 | 38.4/38.4 800 |
| 1280x800 | 300 852 | 300×385.6 | sticky | 852 | 36.8/40.5 700 | 18/29.7 400 | 17/27.2 400 | 265.3×127.4 | 38.4/38.4 800 |
| 1180x820 | 300 752 | 300×385.6 | sticky | 752 | 35.4/38.9 700 | 18/29.7 400 | 17/27.2 400 | 242.7×127.4 | 38.4/38.4 800 |
| 1024x1366 | 300 596 | 300×385.6 | sticky | 596 | 30.7/33.8 700 | 18/29.7 400 | 17/27.2 400 | 190.7×127.4 | 38.4/38.4 800 |
| 820x1180 | 756 | 756×366.7 | static | 756 | 25.6/28.2 700 | 18/29.7 400 | 17/27.2 400 | 244×127.4 | 38.4/38.4 800 |
| 768x1024 | 704 | 704×366.7 | static | 704 | 25.6/28.2 700 | 18/29.7 400 | 17/27.2 400 | 226.7×127.4 | 38.4/38.4 800 |
| 390x844 | 358 | 358×385.6 | static | 358 | 25.6/28.2 700 | 18/29.7 400 | 17/27.2 400 | 358×104.9 | 38.4/38.4 800 |
| 360x800 | 328 | 328×385.6 | static | 328 | 25.6/28.2 700 | 18/29.7 400 | 17/27.2 400 | 328×104.9 | 38.4/38.4 800 |

**Tabel B2. Tabel, dua kolom, aplikasi, FAQ, CTA, footer (terukur)**

| Viewport | Tabel banding | Kepala tabel | Sel | Dua kolom (gtc) | Kotak cocok | Baris aplikasi | Kotak FAQ | CTA | H2 CTA | Footer |
|---|---|---|---|---|---|---|---|---|---|---|
| 1920x1080 | 819.8×195.3 | 12/18.6 700 | 15/23.2 700 | 367.906px | 403.9×183.4 | 404.9×62 | 819.8×89.7 | 900×211.5 pad 36px | 35.2/38.7 700 | 1920×70 |
| 1440x900 | 819.8×195.3 | 12/18.6 700 | 15/23.2 700 | 367.906px | 403.9×183.4 | 404.9×62 | 819.8×89.7 | 900×211.5 pad 36px | 35.2/38.7 700 | 1440×70 |
| 1280x800 | 819.8×195.3 | 12/18.6 700 | 15/23.2 700 | 367.906px | 403.9×183.4 | 404.9×62 | 819.8×89.7 | 852×211.5 pad 36px | 35.2/38.7 700 | 1280×70 |
| 1180x820 | 752×195.3 | 12/18.6 700 | 15/23.2 700 | 334px | 370×183.4 | 371×62 | 752×89.7 | 752×211.5 pad 36px | 35.2/38.7 700 | 1180×70 |
| 1024x1366 | 596×241.8 | 12/18.6 700 | 15/23.2 700 | 256px | 292×237.8 | 293×62 | 596×115.3 | 596×240.4 pad 36px | 30.7/33.8 700 | 1024×70 |
| 820x1180 | 756×195.3 | 12/18.6 700 | 15/23.2 700 | 336px | 372×183.4 | 373×62 | 756×89.7 | 756×193.4 pad 32.8px | 24.6/27.1 700 | 820×70 |
| 768x1024 | 704×195.3 | 12/18.6 700 | 15/23.2 700 | 310px | 346×183.4 | 347×62 | 704×115.3 | 704×188.6 pad 30.72px | 24/26.4 700 | 768×70 |
| 390x844 | 358×265.1 | 12/18.6 700 | 15/23.2 700 | 322px | 358×183.4 | 358×62 | 358×163 | 358×280.4 pad 22px | 24/26.4 700 | 390×122.3 |
| 360x800 | 328×265.1 | 12/18.6 700 | 15/23.2 700 | 292px | 328×183.4 | 328×62 | 328×163 | 328×280.4 pad 22px | 24/26.4 700 | 360×122.3 |

---

## 11. Pop up kontak

Sama dengan etalase (SOLUSI-V1-VISUAL 10).

| Bagian | Nilai |
|---|---|
| Latar | fixed inset 0, z 60, grid tengah, padding 16, `rgba(11,15,58,.62)` + `blur(4px)` |
| Kartu | `min(400px, 100%)`, grid gap 14, padding `26px 22px 22px`, radius 24, putih, bayangan `0 30px 60px -30px rgba(0,0,0,.7)` |
| Judul | padding kanan 44 (ruang tombol X) |
| Tombol X | 40×40 di kanan 14 atas 14, radius 99, `--wash`, ikon 18 |
| Baris kanal `.ct` | grid `44px minmax(0,1fr) 18px`, gap 12, padding `12px 14px`, radius 16, `--wash`. Hover `#EDE3FF`. Ditekan `scale(.98)` |
| Kotak ikon | 44×44, radius 12, ikon putih 22. WhatsApp `#1C7A43`, Instagram `#9F0ED6`, Email `#131951` |
| Panah | 18×18 `--muted` |

**Tabel P1. Pop up kontak (terukur)**

| Viewport | Kartu | Judul | Tinggi paragraf | Tombol X | Baris kanal | Ikon kanal | Nama / keterangan | Fokus awal |
|---|---|---|---|---|---|---|---|---|
| 1920x1080 | 400×383.7 x760 y348.1 | 24px 700 | 46.5 (15px) | 40×40 | 356×68.9 | 44×44 | 16px 700 / 13px 500 | ct-x |
| 1440x900 | 400×383.7 x520 y258.1 | 24px 700 | 46.5 (15px) | 40×40 | 356×68.9 | 44×44 | 16px 700 / 13px 500 | ct-x |
| 1280x800 | 400×383.7 x440 y208.1 | 24px 700 | 46.5 (15px) | 40×40 | 356×68.9 | 44×44 | 16px 700 / 13px 500 | ct-x |
| 1180x820 | 400×383.7 x390 y218.1 | 24px 700 | 46.5 (15px) | 40×40 | 356×68.9 | 44×44 | 16px 700 / 13px 500 | ct-x |
| 1024x1366 | 400×383.7 x312 y491.1 | 24px 700 | 46.5 (15px) | 40×40 | 356×68.9 | 44×44 | 16px 700 / 13px 500 | ct-x |
| 820x1180 | 400×383.7 x210 y398.1 | 24px 700 | 46.5 (15px) | 40×40 | 356×68.9 | 44×44 | 16px 700 / 13px 500 | ct-x |
| 768x1024 | 400×383.7 x184 y320.1 | 24px 700 | 46.5 (15px) | 40×40 | 356×68.9 | 44×44 | 16px 700 / 13px 500 | ct-x |
| 390x844 | 358×447.2 x16 y198.4 | 24px 700 | 69.8 (15px) | 40×40 | 314×68.9 | 44×44 | 16px 700 / 13px 500 | ct-x |
| 360x800 | 328×467.4 x16 y166.3 | 24px 700 | 69.8 (15px) | 40×40 | 284×89.1 | 44×44 | 16px 700 / 13px 500 | ct-x |

---

## 12. Animasi dan transisi (visual)

| Elemen | Transisi |
|---|---|
| Tombol | transform 160 ms `cubic-bezier(.23,1,.32,1)`, warna 200 ms ease |
| Kartu adegan aktif | box-shadow 200 ms |
| Label dan titik rel | opacity, transform, warna 160 ms |
| Tooltip | opacity 120 ms |
| Baris kontak | warna 160 ms, transform 160 ms |
| Teks dunia 3D | tanpa transisi CSS; opacity dan skala diatur per frame dari JavaScript (LOGIKA 6 dan 7) |
| Reduced motion | semua transisi CSS 1 ms; 3D langsung ke pose akhir |

---

## 13. Anggaran 3D (terukur)

**Tabel A1. Draw call / segitiga per frame per adegan (terukur, termasuk pass bayangan)**

| Viewport | Adegan 1 | Adegan 2 | Adegan 3 | Adegan 4 | Adegan 5 | Adegan 6 | Adegan 7 | Adegan 8 | Adegan 9 |
|---|---|---|---|---|---|---|---|---|---|
| 1920x1080 | 90 / 18.8k | 90 / 18.8k | 82 / 16.1k | 84 / 14.5k | 97 / 19.7k | 91 / 16.3k | 71 / 13.2k | 86 / 19.7k | 113 / 22.6k |
| 1440x900 | 90 / 18.8k | 90 / 18.8k | 80 / 15.7k | 80 / 14.2k | 97 / 19.7k | 90 / 15.9k | 71 / 13.2k | 86 / 19.7k | 114 / 22.7k |
| 1280x800 | 90 / 18.8k | 90 / 18.8k | 80 / 15.7k | 80 / 14.2k | 97 / 19.7k | 90 / 15.9k | 71 / 13.2k | 86 / 19.7k | 114 / 22.7k |
| 1180x820 | 90 / 18.8k | 90 / 18.8k | 81 / 16.1k | 83 / 14.7k | 97 / 19.7k | 92 / 16.4k | 73 / 13.9k | 86 / 19.7k | 114 / 22.7k |
| 1024x1366 | 90 / 18.8k | 90 / 18.8k | 83 / 17.2k | 82 / 14.5k | 97 / 19.7k | 92 / 16.4k | 83 / 15.8k | 86 / 19.7k | 113 / 22.7k |
| 820x1180 | 90 / 18.8k | 90 / 18.8k | 99 / 19.1k | 93 / 16.4k | 97 / 19.7k | 96 / 16.7k | 84 / 15.8k | 86 / 19.7k | 114 / 22.7k |
| 768x1024 | 90 / 18.8k | 90 / 18.8k | 103 / 20.1k | 97 / 18.1k | 97 / 19.7k | 100 / 18.2k | 85 / 15.9k | 86 / 19.7k | 114 / 22.7k |
| 390x844 | 88 / 18.5k | 87 / 18.5k | 72 / 12.8k | 61 / 11.4k | 77 / 16.8k | 80 / 15.0k | 64 / 12.6k | 85 / 19.6k | 92 / 18.5k |
| 360x800 | 88 / 18.5k | 87 / 18.5k | 72 / 12.8k | 61 / 11.4k | 77 / 16.8k | 80 / 15.0k | 64 / 12.6k | 85 / 19.6k | 92 / 18.5k |

| Item | Nilai |
|---|---|
| Ringkas | Draw call 61 sampai 114 per frame, segitiga ±11 sampai 23 ribu (adegan 9, pandangan luas, paling berat). Sebanding dengan prototipe detail 3 Nov (31 sampai 65 draw call, LOG 3 Nov) |
| Canvas | 1 (di `.stage`) + 1 canvas tekstur laptop 400 × 260 |
| Lapisan CSS3D | 1, berisi ±50 elemen HTML |
| Pixel ratio | maks. 1.5 di semua ukuran |
| Peta bayangan | 1 × 2048² |
| File eksternal | tidak ada (semua 3D dari kode, sesuai aturan repo) |
| Ukuran chunk | belum diukur (prototipe memuat three dari CDN). Ukur dengan `npm --prefix site run size` setelah integrasi |

---

## 14. Ikon (SVG inline, viewBox 24, stroke `currentColor`, stroke 2, ujung bulat)

| Ikon | Dipakai di | Bentuk |
|---|---|---|
| Bubble chat 3 titik | tombol "Konsultasi gratis" | bubble bulat dengan ekor kiri bawah + 3 titik |
| Panah bawah | petunjuk gulir | garis tegak + kepala panah (stroke 2.2) |
| Centang lingkaran | catatan disamarkan, poin cocok | lingkaran r 9 + centang |
| Segitiga peringatan | poin masalah | segitiga + garis + titik |
| Centang | poin persiapan dan "yang kami bangun" | centang |
| Silang | poin kurang cocok, tombol X | dua garis silang (X: stroke 2.2) |
| Bubble chat | WhatsApp (aplikasi, pop up) | bubble tanpa titik |
| Tabel | Google Sheets | kotak + garis kepala + garis kolom |
| Instagram | pop up | kotak radius 5 + lingkaran r 4 + titik |
| Amplop | pop up | kotak + garis V |
| Panah kanan | solusi terkait | garis + kepala (stroke 2.2) |
| Chevron kanan | baris kanal pop up | chevron (stroke 2.2) |

Di repo, ikon bisa diganti Phosphor (`@phosphor-icons/react`, sudah ada) dengan bentuk setara: ChatCircleDots, ArrowDown, CheckCircle, Warning, Check, X, WhatsappLogo/ChatCircle, Table, InstagramLogo, Envelope, ArrowRight, CaretRight.

---

## 15. Template untuk solusi lain

| Bagian | TETAP | PER SOLUSI |
|---|---|---|
| Warna | token 2.1, kelas 2.3, material default | warna tim (chip), warna peran figur, warna objek dunia |
| Tipografi | semua | – |
| Layout halaman, kartu, rel, pop up | semua | jumlah adegan (5 sampai 9) |
| Dunia 3D | renderer, cahaya, langit siang/malam, lantai, figur, aturan K = .0042, kelas teks HTML | area, objek, posisi teks, kamera |

---

## 16. Temuan visual (bahan v2, prototipe tidak diubah)

| No | Viewport | Temuan | Usulan |
|---|---|---|---|
| 16.1 | 768×1024, 820×1180 (iPad tegak) | Masih tampilan desktop (> 759 px). Area bebas di kanan kartu hanya ±300 px dari 768, jadi kamera mundur jauh (fit ±3): teks dunia 3D tinggal ±5 sampai 8 px (tabel W1), sulit dibaca. Separuh atas dan bawah area 3D kosong | Pakai tampilan HP sampai ±1023 px untuk layar tegak (`max-width: 1023px and (orientation: portrait)`), atau kartu di bawah 3D seperti HP |
| 16.2 | 1024×1366 (iPad Pro tegak) | Berjalan, tapi teks dunia ±11 px dan banyak ruang kosong di atas dan bawah | Sama dengan 16.1 |
| 16.3 | 1180×820, 1280×800 | Baik. Papan tabel kadang menyentuh rel di kanan (adegan 3) | Tetap |
| 16.4 | 390, 360 (HP) | Teks utama ±7 sampai 10 px karena tinggi 3D hanya 55svh. Adegan 9 (pandangan luas) teks ±3 px (memang gambaran umum) | Bubble bisa dibaca dari kartu di bawah. v2: naikkan `boost` HP atau tinggi sticky |
| 16.5 | Semua | Teks HTML selalu di depan objek 3D (CSS3D tidak bisa tertutup). Contoh: bubble kurir bisa menutupi mobil | Sesuai keputusan 4 Nov |
| 16.6 | Semua | Kepala grup `#12B5A6` dan kepala tabel `#2E9E5B` mirip warna WhatsApp dan Google Sheets. Aturan repo: layar di dalam 3D netral (warna Kreatekno, tanpa logo platform). Tidak ada logo, tapi warnanya mengarah ke platform | Keputusan Heru: tetap (membantu pengunjung mengenali) atau ganti ke warna Kreatekno |
| 16.7 | – | Nama token `--wall` di halaman detail (`#EEEAFB`) bentrok dengan `--wall` etalase (`#131951`) | Ganti nama, misalnya `--lilac` |
| 16.9 | 390, 360 (HP) | Tombol rel di HP hanya 19×28 px, di bawah ukuran sentuh minimum 24×24 px (WCAG 2.2, 2.5.8) | Lebarkan padding tombol jadi ±24×28 (rel tetap muat: 9 × 24 = 216 px) |
| 16.8 | Desktop | Teks dunia di kiri area bebas tertutup kartu (kartu di atas 3D). Kamera sudah menggeser pusat adegan ke kanan, jadi isi utama tidak tertutup | Tetap |
