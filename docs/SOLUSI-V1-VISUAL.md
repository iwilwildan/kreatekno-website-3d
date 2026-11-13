# Halaman Solusi v1: spesifikasi visual

| Info | Isi |
|---|---|
| Tanggal | 4 November 2026 |
| Sumber | `prototype/solusi-etalase-v1.html` (versi final v1 yang disetujui Heru) |
| Pembaca | Wildan (integrasi ke `kreatekno-website-3d`) |
| Dokumen pasangan | `docs/SOLUSI-V1-LOGIKA.md` (perilaku, rumus, flowchart), `docs/SOLUSI-V1-COPY.md` (semua teks) |
| Cara ukur | Playwright + Chromium, `deviceScaleFactor` 1, font Google termuat. Angka = hasil `getBoundingClientRect()` dan `getComputedStyle()` dalam CSS px |
| Format sel tabel ukuran | `lebar×tinggi` · `font-size/line-height weight` (font dalam px). `x` = jarak dari kiri viewport, `y` = jarak dari atas dokumen |
| Viewport desktop | 1920×1080, 1440×900, 1280×800 |
| Viewport tablet | 1180×820 (iPad landscape), 1024×1366 (iPad Pro), 820×1180 (iPad Air), 768×1024 (iPad mini). Diukur apa adanya, tanpa usulan |
| Viewport HP | 414×896, 390×844, 375×812, 360×740 |

> **Penting untuk tablet.** v1 hanya punya satu breakpoint layout utama: **≤ 760 px = layout HP**, di atasnya layout desktop. Semua iPad (768 px ke atas) memakai layout desktop. Di ≤ 960 px link menu nav disembunyikan. Tablet diuji dengan layar sentuh (`hasTouch`), jadi kepala kasir tidak mengikuti kursor dan ringkasan kotak dibuka dengan tap.

---

## 1. Peta ke repo

| Bagian visual | Prototipe (selector / fungsi) | Tempat di repo |
|---|---|---|
| Token warna dan font yang sudah ada | `:root` | `site/styles/globals.css` (vendor Wildan, jangan diubah). Nama: `--color-ink`, `--color-navy`, dll. |
| Token baru khusus Solusi | `:root` (`--receipt`, `--wash`, `--navy-2`, `--line`, status, `--counter`, `--plinth`) | `site/components/solusi/toko.css` (di bawah `.solusi-page`) |
| Tombol `.btn` | `.btn`, `.btn-main`, `.btn-dark`, `.btn-line` | Kelas yang sama sudah dipakai `WhatsAppButton` Wildan. Pakai yang ada |
| Nav | `.nav` | `site/components/layout/Header.tsx` (vendor) |
| Hero toko | `.toko`, `.hero-copy`, `.screen` | `site/components/solusi/HeroToko.tsx` + `toko.css` |
| Adegan 3D toko | bagian `/* --- the shop scene --- */` | `site/world/sets/toko.ts` |
| Kasir | `kasirRoot`, `POSES` | `site/world/cast/kasir.ts`, `kasirPose.ts` (Heru vinyl, bukan bentuk "Raka" di prototipe) |
| Kamera | `heroTarget()`, `camTarget()` | `site/world/takes/solusi/kamera.ts` |
| Kotak di meja | `makeProduct()`, `counterLayout()` | `site/world/takes/solusi/kotak.ts` |
| Etalase HTML | `.etalase`, `.counter`, `.frame`, `.tier`, `.track`, `.prod` | `site/components/solusi/Etalase.tsx` + `LabelRak.tsx` |
| Etalase 3D (ortho) | `rakFrame()` | `site/world/solusi.ts` (pass etalase) |
| Struk cari, bar, tag, ringkasan | `.paper`, `.pbar`, `.tags`, `.sum` | `site/components/solusi/StrukCari.tsx` (nama di SOLUSI-SPEC bagian 5) |
| Pop up kontak | `.modal` | komponen baru, misalnya `site/components/solusi/KontakModal.tsx` |
| Kartu masalah | `.deckwrap`, `.sheet`, `.pc`, `.cue` | `site/components/solusi/DekKartu.tsx` |
| Halaman hasil | `#v-hasil`, `.res` | `site/app/solusi/hasil/page.tsx` + `HasilKartu.tsx` |
| Halaman detail | `#v-detail` | fase 2 Wildan: `app/[locale]/(pages)/solusi/[slug]/` |
| Footer | `.foot` | `site/components/layout/Footer.tsx` (vendor) |

---

## 2. Warna

### 2.1 Token CSS

| Token prototipe | Hex | Di `globals.css` Wildan | Dipakai untuk |
|---|---|---|---|
| `--wall` | `#131951` | `--color-navy` | Latar body, dinding toko, `body::before` (safe area) |
| `--paper` | `#FFFFFF` | `--color-paper` | Kartu ringkasan, pop up, kartu masalah, halaman detail |
| `--receipt` | `#FFFDF7` | **tidak ada** | Kertas struk, bar hasil, kertas bidang usaha |
| `--wash` | `#F4F4FA` | **tidak ada** | Chip, latar baris kontak, kotak jawaban detail, FAQ |
| `--ink` | `#121640` | `--color-ink` | Teks utama |
| `--muted` | `#565B81` | `--color-muted` | Teks sekunder |
| `--navy` | `#131951` | `--color-navy` | Teks judul gelap, tag nomor, tombol gelap |
| `--navy-2` | `#1A2160` | **tidak ada** | Hover `.btn-dark`, latar band, badan mesin kasir 3D |
| `--navy-3` | `#0B0F3A` | `--color-navy-3` | Lantai di bawah etalase, footer, layar TV HP |
| `--purple` | `#9F0ED6` | `--color-purple` | Tombol utama, celemek, kap lampu |
| `--purple-deep` | `#7C07A8` | `--color-purple-deep` | Hover tombol utama, link aktif |
| `--violet` | `#8C2BFA` | `--color-violet` | Outline fokus, awal gradien progres |
| `--cyan` | `#35EAFE` | `--color-cyan` | Eyebrow hero, kerah kasir, layar kasir, outline fokus kotak etalase |
| `--on-night` | `#F3F4FF` | `--color-on-night` | Teks di latar gelap |
| `--on-night-muted` | `#B6BBE2` | `--color-on-night-muted` | Paragraf hero, paragraf band, teks footer |
| `--line` | `rgba(19,25,81,.12)` | **tidak ada** | Garis tipis, ring tombol bulat |
| `--run` / `--run-bg` | `#06606C` / `#DDF9FD` | **tidak ada** | Titik badge "Sudah berjalan" |
| `--idea` / `--idea-bg` | `#5B1BB5` / `#EDE3FF` | **tidak ada** | Titik badge "Siap dibuat", filter aktif, hover baris kontak |
| `--ok` / `--ok-bg` | `#1C7A43` / `#E1F4E8` | **tidak ada** | Stempel "Ya", ikon cocok, kolom "Dengan asisten" |
| `--no` / `--no-bg` | `#B4233A` / `#FDE6E9` | **tidak ada** (Wildan punya `--color-alert #e5484d`, beda) | Stempel "Tidak", ikon masalah |

### 2.2 Warna etalase dan meja (CSS)

| Bagian | Hex | Selector |
|---|---|---|
| Badan meja (depan, tempat jendela rak) | `#C2B8DF` | `.etalase { --counter }`, `.counter` |
| Alas meja (plinth) | `#AA9FCD` | `.etalase { --plinth }`, `.plinth` |
| Latar jendela rak (rongga) | `#2A2F6B` | `.frame` |
| Ruang di sekitar meja | `#131951` | `.etalase` (gradien bagian atas) |
| Lantai (60 px terbawah section) | `#0B0F3A` | `.etalase` (gradien bagian bawah), `.band-wrap` |
| Papan rak (versi tanpa 3D) | `#B4A9D5` | `.no3d .plank` |
| Input dan select di struk | `#F1EEF9` | `.paper input`, `.flt select`, `.ind` |
| Placeholder input | `#6E7296` | `.paper input::placeholder` |
| Hover tombol putih hero | `#ECE8FA` | `.hero-btns .btn-dark:hover` |
| Ring layar TV (HP) | `#2A2F5E` | `.screen` di ≤ 760 px |

### 2.3 Warna per tim (kotak produk)

Warna kotak = warna **tim pertama** solusi (`s.tim[0]`). Kotak dekor (slot kosong) memakai warna tim yang sama, dicampur ke putih. Campuran dihitung three.js di ruang warna linear, jadi hex hasil di bawah sudah dikonversi ke sRGB.

| Tim (id) | Warna kotak | Kotak dekor (campur putih 28%) | Pita dekor (campur putih 62%) |
|---|---|---|---|
| Operasional (`operasional`) | `#87CFD7` | `#B4DEE3` | `#DCEEF1` |
| Layanan pelanggan (`cs`) | `#AD96DD` | `#C9BBE7` | `#E4DFF3` |
| Marketing (`marketing`) | `#DC96C4` | `#E7BBD7` | `#F2DFEB` |
| Keuangan & admin (`keuangan`) | `#90CCB7` | `#B8DCCF` | `#DDEDE7` |
| Manajemen (`manajemen`) | `#94A2D9` | `#BAC2E4` | `#DEE2F1` |
| Penjualan (`penjualan`) | `#C894DB` | `#D9BAE6` | `#ECDEF2` |
| SDM (`sdm`) | `#DF9DAE` | `#E9BFC9` | `#F3E0E5` |

Cadangan kalau tim tidak dikenal: `#CDB8F8`.

### 2.4 Warna adegan 3D toko

| Objek | Hex | Material |
|---|---|---|
| Dinding | `#131951` | Basic (tanpa cahaya) |
| Wainscot | `#131951` | Basic |
| Rail dinding | `#232B77` | Basic |
| Permukaan meja | `#CFC5E8` | Standard, roughness .45 |
| Depan meja | `#C2B8DF` | Basic (sama persis dengan `.counter` di CSS supaya menyambung) |
| Bayangan bibir meja | `#AFA4D2` | Basic |
| Badan mesin kasir | `#1A2160` | Standard, roughness .5 |
| Tombol dan tiang mesin kasir | `#2A3277` | Standard |
| Layar mesin kasir | `#0B0F3A` + emissive `#35EAFE` intensitas .35 | Standard |
| Papan rak dinding | `#B8ADD9` | Standard |
| 8 kotak stok di rak dinding (kiri ke kanan, atas lalu bawah) | `#87CFD7`, `#94A2D9`, `#DC96C4`, `#90CCB7`, `#AD96DD`, `#C894DB`, `#87CFD7`, `#DF9DAE` | Standard, roughness .6 |
| Kabel lampu | `#2A2F5E` | Basic |
| Kap lampu | `#9F0ED6` | Standard, roughness .4, dua sisi |
| Bola lampu | `#FFF6D8` | Basic |
| Kartu / kertas yang dibagikan kasir | sisi `#E9E4F5`, atas `#FFFFFF` (kertas bidang usaha `#FFFDF7`), bawah `#9F0ED6` | Basic |
| Papan rak etalase (ortho) | `#B4A9D5` | Standard, roughness .55 |
| Panel putih sampul kotak | `#FFFFFF` | Standard, roughness .45 (etalase) / .5 (meja) |
| Bayangan kontak di bawah kotak etalase | `#05071F` dengan tekstur gradien | Basic, transparan |

### 2.5 Warna kasir "Raka" (prototipe)

| Bagian | Hex |
|---|---|
| Kulit | `#B7794E` |
| Kaos | `#F7F7FF` |
| Celemek dan tali | `#9F0ED6` |
| Papan nama | `#FFFFFF` |
| Kerah | `#35EAFE` |
| Rambut | `#1B1B2E` |
| Mata | `#121640` |
| Mulut (senyum dan "O") | `#5A2A1A` |

Di website kasirnya **Heru vinyl** (SOLUSI-SPEC bagian 6). Warna celemek ungu `#9F0ED6` + tepi cyan sudah diputuskan Heru 3 Nov. Warna kulit, rambut dan wajah ikut Heru vinyl, bukan tabel ini.

---

## 3. Tipografi

### 3.1 Keluarga font

| Variabel | Font | Weight yang dimuat | Dipakai untuk | Di repo |
|---|---|---|---|---|
| `--display` | Bricolage Grotesque (opsz 12..96) | 400–800 | H1, H2, H3, angka tile | `--font-display` (`--font-bricolage` dari `next/font`) |
| `--body` | Plus Jakarta Sans | 400–700 (+ italic) | Teks, tombol, label | `--font-body` (`--font-jakarta`) |
| `--mono` | JetBrains Mono | 500, 700 | Struk, tag nomor, eyebrow HP, pesan bar | **belum ada di repo.** Perlu ditambah lewat `next/font/google` (tanpa paket npm baru) atau diganti font yang ada; keputusan Heru |

Aturan global judul: `h1,h2,h3 { font-family: display; weight 700; letter-spacing -.02em; line-height 1.1; text-wrap: balance; font-variation-settings: "opsz" 96 }`. Body: 16 px, line-height 1.55, `-webkit-font-smoothing: antialiased`.

### 3.2 Skala teks (aturan CSS)

| Elemen | Font | Ukuran (aturan) | Weight | Lainnya |
|---|---|---|---|---|
| H1 hero desktop | display | `clamp(2.4rem, 4.6vw, 4.1rem)` | 700 | putih, letter-spacing -.035em |
| H1 hero HP | display | `clamp(1.6rem, 7.4vw, 2.1rem)` | 700 | putih |
| Paragraf hero desktop | body | `clamp(1.0625rem, 1.3vw, 1.2rem)` | 400 | `--on-night-muted`, max 44ch |
| Paragraf hero HP | body | .9375rem (15 px) | 400 | |
| Eyebrow hero | body (desktop) / mono 500 (HP) | .75rem (12 px) | 700 | uppercase, letter-spacing .12em, cyan |
| Link nav | body | .9375rem | 600 | |
| Tombol `.btn` | body | `var(--t-btn, 1rem)` | 600 | line-height 1 |
| Judul etalase `.counter-h` | display | `clamp(1.25rem, 2.2vw, 1.75rem)` | 700 | letter-spacing -.01em, navy, rata tengah |
| Teks sampul kotak `.cover` | body | .8125rem (13 px), line-height 1.28 | 700 | navy, `text-wrap: balance`, **selalu 2 baris** (dicek di semua viewport) |
| Badge status `.st` | body | .625rem (10 px) | 700 | letter-spacing .02em |
| Label tim di papan | body | .75rem (12 px) | 700 | letter-spacing .02em |
| H2 band | display | `clamp(1.4rem, 2.6vw, 2rem)` | 700 | putih |
| Kepala struk | mono 500 | .75rem / 1.4 | 500 | `KREATEKNO`: mono 700 .9375rem letter-spacing .06em |
| Label input struk | mono | .75rem | 700 | uppercase, letter-spacing .06em |
| Input struk | body | 1rem | 500 | |
| Select filter | body | .8125rem | 600 | |
| Tag nomor | mono | .8125rem | 700 | |
| Pesan bar | mono | .8125rem / 1.3 | 700 | |
| Judul ringkasan | display | 1.0625rem / 1.2 | 700 | |
| Chip platform | body | .75rem | 600 | |
| Teks ringkasan | body | .875rem / 1.5 | 400 | muted |
| Judul pop up | display | 1.5rem | 700 | |
| Pertanyaan kartu | display | `clamp(1.45rem, 4.4vw, 1.85rem)` | 700 | letter-spacing -.025em |
| Baris atas kartu `.k` | body | .6875rem (11 px) | 700 | uppercase, letter-spacing .1em |
| Stempel | body | .8125rem | 800 | uppercase, letter-spacing .08em |
| Penanda (cue) | body | .75rem | 700 | |
| Petunjuk swipe | body | .8125rem | 600 | navy |
| H1 detail | display | `clamp(2.1rem, 5vw, 4rem)` | 700 | max 18ch |
| H2 section detail | display | `clamp(1.6rem, 3vw, 2.3rem)` | 700 | |
| H1 hasil | display | `clamp(1.9rem, 4.4vw, 3rem)` | 700 | rata tengah |

Nilai terukur per viewport ada di tabel ukuran bagian 6 sampai 13.

---

## 4. Layout global

### 4.1 Breakpoint

| Kondisi | Yang berubah |
|---|---|
| `min-width: 700px` | Gutter kiri/kanan 16 → 32 px |
| `max-width: 640px` | Tinggi nav 64 → 56 px |
| `max-width: 420px` | Nav: padding kiri 14, logo 24 px, tombol 14 px |
| `max-width: 760px` | **Layout HP**: hero dengan kartu TV, struk jadi lembar bawah, ringkasan di atas bar, kartu masalah sempit-tinggi, track rak 228 px tanpa panah. Juga dipakai JS (`isPhone()`) |
| `max-width: 960px` | Link menu nav disembunyikan |
| `min-width: 860px` | Band: dua kolom (teks + tombol) |
| `min-width: 1000px` | Detail: aside 300 px + isi, aside sticky |
| `min-width: 720px` | Detail: langkah dan cocok/tidak cocok dua kolom |
| `min-width: 640px` | Detail: tile angka 3 kolom, daftar aplikasi 2 kolom |
| `prefers-reduced-motion: reduce` | Semua transisi 1 ms, animasi mati |

### 4.2 Ukuran dasar

| Token | Nilai |
|---|---|
| `--maxw` | 1200 px (wrap = 1200 + 64 px gutter) |
| `--gl`, `--gr` | `max(16px, safe-area)`, 32 px mulai 700 px |
| `--nav-h` | 64 px (56 px di ≤ 640) |
| `--nav-top` | `safe-area-inset-top + 12px` |
| Lebar badan meja etalase | penuh, isi dibatasi 1240 px (padding `max(gutter, (100% − 1240px)/2)`) |
| Easing utama | `--ease-out: cubic-bezier(.23, 1, .32, 1)` |

### 4.3 Urutan lapisan (z-index)

| z-index | Elemen |
|---|---|
| 1 | Canvas WebGL `#gl` (fixed, menutup layar, transparan, `pointer-events: none`) |
| 2 | Isi etalase (`.pk`, `.plank`, `.counter-h`), halaman detail/hasil, footer |
| 3 | Semua anak `.toko` (hero, struk, bar, deck) |
| 4 | Panah rak `.arr`, penanda kartu `.cue` |
| 6 | Kartu ringkasan `.sum` |
| 30 | Nav |
| 40 | `body::before` (pengisi safe area atas) |
| 60 | Pop up kontak |

Canvas ada di bawah semua teks HTML. Teks sampul kotak etalase adalah HTML yang menempel di depan kotak 3D.

---

## 5. Tombol dan komponen kecil

| Komponen | Ukuran | Bentuk | Warna | Shadow |
|---|---|---|---|---|
| `.btn` dasar | min-height 48, padding `6px 6px 6px 20px`, gap 10 | pil (radius 999) | | aktif: `scale(.97)` 160 ms |
| `.btn .knob` | 36×36 (ikon 20) | lingkaran | `rgba(255,255,255,.18)` | |
| `.btn-main` | | | `#9F0ED6`, teks putih, hover `#7C07A8` | `0 10px 22px -12px rgba(124,7,168,.75)` |
| `.btn-dark` | | | `#131951`, hover `#1A2160`, knob `rgba(255,255,255,.12)` | |
| `.btn-dark` di hero | tinggi 52 | | **putih**, teks navy, knob `rgba(19,25,81,.08)`, hover `#ECE8FA` | |
| `.btn-line` | padding `0 20px`, ikon 18 | | transparan, garis `inset 0 0 0 1.5px currentColor` | |
| Tombol nav | padding kiri 18, knob 34, font 15 | | `.btn-main` | |
| Tombol hero HP | padding `0 14px`, font 15, **knob disembunyikan**, grid 2 kolom gap 8 | | | |
| Tombol bar hasil | min-height 46, padding `0 12px`, font 15, gap 8 | | kiri `.btn-line` navy, kanan `.btn-main` | |
| Tombol "Lihat detail" | min-height 42, font 14, padding `4px 4px 4px 16px`, knob 32 | | `.btn-main` | |
| `.exit` "Kembali ke etalase" | min-height 44, padding `0 16px 0 12px`, ikon 18 diputar 180° | pil | `rgba(255,255,255,.92)`, teks navy 15/700 | `0 0 0 1px var(--line), 0 10px 24px -16px rgba(19,25,81,.6)` |
| Panah rak `.arr` | 40×40, ikon 18 | lingkaran | putih, ikon navy | `0 0 0 1px var(--line), 0 10px 20px -12px rgba(0,0,0,.6)`, aktif `scale(.94)` |
| Chip `.chip` | padding `5px 10px`, font 13/600 | pil | `--wash`, teks navy | |
| Fokus keyboard | outline 3 px `#8C2BFA`, offset 3, radius 8 | | Kotak etalase: outline 3 px cyan di sampul, offset 4 | |

---

## 6. Nav dan hero toko

### 6.1 Bentuk

| Bagian | Nilai |
|---|---|
| Nav | fixed, tengah, `width: min(1200px, 100% − 24px − safe-area)`, tinggi 64, pil, putih .9 + `backdrop-filter: blur(16px) saturate(1.4)`, padding `0 8px 0 20px`, shadow `0 0 0 1px rgba(19,25,81,.08), 0 12px 32px -18px rgba(19,25,81,.35)` |
| Logo nav | tinggi 28 (24 di ≤ 420), gambar 280×48 |
| Link nav | padding `9px 12px`, pil, hover `rgba(19,25,81,.06)`, aktif `rgba(159,14,214,.1)` teks `#7C07A8` |
| Stage `.toko` desktop | tinggi `clamp(600px, 88svh, 800px)`, overflow hidden |
| Stage `.toko` HP | tinggi `max(680px, 100svh)` |
| Stage saat mode Cari/Kartu | `100svh`, min 600 |
| `.hero-copy` desktop | kiri = kiri konten (`max(gutter, (100% − 1200)/2)`), atas = `nav-top + nav-h + 6%`, lebar `min(520px, 46%)`, gap 22 |
| `.hero-copy` HP | kiri/kanan gutter, atas `nav-top + nav-h + 14px`, gap 14 |
| Kartu TV `.screen` (HP saja) | padding `18px 18px 20px`, radius 18, latar `#0B0F3A`, shadow `0 0 0 6px #2A2F5E, 0 20px 36px -22px rgba(11,15,58,.7)`, gap 10 |
| Grup tombol hero | flex wrap gap 10 (HP: grid 2 kolom gap 8) |
| Saat mode fokus | `.hero-copy` opacity 0 + `translateY(-16px)`, transisi opacity 300 ms + transform 400 ms ease-out |

### 6.2 Ukuran terukur

**Desktop**

| Elemen | 1920×1080 | 1440×900 | 1280×800 |
|---|---|---|---|
| Toko (stage hero) | 1920×800 | 1440×792 | 1280×704 |
| Nav (pil) | x 360 · 1200×64 | x 120 · 1200×64 | x 40 · 1200×64 |
| Logo nav | 165×28 | 165×28 | 165×28 |
| Link nav (1 item) | 83.9×41.3 · 15/23.3 600 | 83.9×41.3 · 15/23.3 600 | 83.9×41.3 · 15/23.3 600 |
| Tombol nav "Konsultasi gratis" | 186.4×48 · 15/15 600 | 186.4×48 · 15/15 600 | 186.4×48 · 15/15 600 |
| Knob tombol nav | 34×34 | 34×34 | 34×34 |
| Blok hero-copy | x 360 · 520×419.7 · y 124 | x 120 · 520×388.4 · y 123.5 | x 40 · 520×360.9 · y 118.2 |
| Screen (kartu TV di HP) | 520×345.7 | 520×314.4 | 520×286.9 |
| Eyebrow "Solusi" | 520×12 · 12/12 700 | 520×12 · 12/12 700 | 520×12 · 12/12 700 |
| H1 | 520×216.4 · 65.6/72.2 700 | 520×216.4 · 65.6/72.2 700 | 520×194.3 · 58.9/64.8 700 |
| Paragraf hero | 520×89.3 · 19.2/29.8 400 | 520×58 · 18.7/29 400 | 520×52.7 · 17/26.4 400 |
| Tombol "Cari solusi" | 150.1×52 · 16/16 600 | 150.1×52 · 16/16 600 | 150.1×52 · 16/16 600 |
| Tombol "Kartu masalah" | 180.4×52 · 16/16 600 | 180.4×52 · 16/16 600 | 180.4×52 · 16/16 600 |
| Knob tombol hero | 36×36 | 36×36 | 36×36 |


**Tablet**

| Elemen | 1180×820 | 1024×1366 | 820×1180 | 768×1024 |
|---|---|---|---|---|
| Toko (stage hero) | 1180×721.6 | 1024×800 | 820×800 | 768×800 |
| Nav (pil) | x 12 · 1156×64 | x 12 · 1000×64 | x 12 · 796×64 | x 12 · 744×64 |
| Logo nav | 165×28 | 165×28 | 165×28 | 165×28 |
| Link nav (1 item) | 83.9×41.3 · 15/23.3 600 | 83.9×41.3 · 15/23.3 600 | tersembunyi | tersembunyi |
| Tombol nav "Konsultasi gratis" | 186.4×48 · 15/15 600 | 186.4×48 · 15/15 600 | 186.4×48 · 15/15 600 | 186.4×48 · 15/15 600 |
| Knob tombol nav | 34×34 | 34×34 | 34×34 | 34×34 |
| Blok hero-copy | x 32 · 520×345.8 · y 119.3 | x 32 · 471×322.1 · y 124 | x 32 · 377.2×319.7 · y 124 | x 32 · 353.3×319.7 · y 124 |
| Screen (kartu TV di HP) | 520×271.8 | 471×248.1 | 377.2×245.7 | 353.3×245.7 |
| Eyebrow "Solusi" | 520×12 · 12/12 700 | 471×12 · 12/12 700 | 377.2×12 · 12/12 700 | 353.3×12 · 12/12 700 |
| H1 | 520×179.1 · 54.3/59.7 700 | 471×155.4 · 47.1/51.8 700 | 377.2×126.7 · 38.4/42.2 700 | 353.3×126.7 · 38.4/42.2 700 |
| Paragraf hero | 520×52.7 · 17/26.4 400 | 471×52.7 · 17/26.4 400 | 377.2×79 · 17/26.4 400 | 353.3×79 · 17/26.4 400 |
| Tombol "Cari solusi" | 150.1×52 · 16/16 600 | 150.1×52 · 16/16 600 | 150.1×52 · 16/16 600 | 150.1×52 · 16/16 600 |
| Tombol "Kartu masalah" | 180.4×52 · 16/16 600 | 180.4×52 · 16/16 600 | 180.4×52 · 16/16 600 | 180.4×52 · 16/16 600 |
| Knob tombol hero | 36×36 | 36×36 | 36×36 | 36×36 |


**HP**

| Elemen | 414×896 | 390×844 | 375×812 | 360×740 |
|---|---|---|---|---|
| Toko (stage hero) | 414×896 | 390×844 | 375×812 | 360×740 |
| Nav (pil) | x 12 · 390×56 | x 12 · 366×56 | x 12 · 351×56 | x 12 · 336×56 |
| Logo nav | 141.5×24 | 141.5×24 | 138.5×24 | 123.5×24 |
| Link nav (1 item) | tersembunyi | tersembunyi | tersembunyi | tersembunyi |
| Tombol nav "Konsultasi gratis" | 174.5×48 · 14/14 600 | 174.5×48 · 14/14 600 | 174.5×48 · 14/14 600 | 174.5×48 · 14/14 600 |
| Knob tombol nav | 34×34 | 34×34 | 34×34 | 34×34 |
| Blok hero-copy | x 16 · 382×273.2 · y 82 | x 16 · 358×269.2 · y 82 | x 16 · 343×266.8 · y 82 | x 16 · 328×264.3 · y 82 |
| Screen (kartu TV di HP) | 382×207.2 | 358×203.2 | 343×200.8 | 328×198.3 |
| Eyebrow "Solusi" | 346×12 · 12/12 500 | 322×12 · 12/12 500 | 307×12 · 12/12 500 | 292×12 · 12/12 500 |
| H1 | 346×67.4 · 30.6/33.7 700 | 322×63.5 · 28.9/31.7 700 | 307×61 · 27.8/30.5 700 | 292×58.6 · 26.6/29.3 700 |
| Paragraf hero | 346×69.8 · 15/23.3 400 | 322×69.8 · 15/23.3 400 | 307×69.8 · 15/23.3 400 | 292×69.8 · 15/23.3 400 |
| Tombol "Cari solusi" | 187×52 · 15/15 600 | 175×52 · 15/15 600 | 167.5×52 · 15/15 600 | 160×52 · 15/15 600 |
| Tombol "Kartu masalah" | 187×52 · 15/15 600 | 175×52 · 15/15 600 | 167.5×52 · 15/15 600 | 160×52 · 15/15 600 |
| Knob tombol hero | tersembunyi | tersembunyi | tersembunyi | tersembunyi |

---

## 7. Adegan 3D toko

### 7.1 Renderer dan cahaya

| Item | Nilai |
|---|---|
| Renderer | `WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' })`, clear color hitam alpha 0, `outputColorSpace = SRGB`, tanpa tone mapping, tanpa bayangan |
| Pixel ratio | `min(devicePixelRatio, 1.5)` di HP (≤ 760), `min(devicePixelRatio, 2)` di desktop |
| Satu canvas | fixed, ukuran viewport. Toko digambar dengan scissor + viewport seukuran `.toko`; etalase digambar di pass lain (bagian 8.4) |
| Cahaya toko | Hemisphere `#FFFFFF` / `#B9B2DC` intensitas 1.7 · Directional `#FFFFFF` 1.5 di (−3, 6, 5) · Directional `#C9F6FF` .5 di (4, 2, 3) |
| Material default | `MeshStandardMaterial` roughness .8, metalness 0 |

Satuan meter, Y ke atas. Koordinat di bawah adalah koordinat prototipe (bibir depan meja di z ≈ 1.9). Di repo, `world/sets/toko.ts` menggeser semuanya supaya bibir depan meja di z = 0: **z repo = z prototipe − 1.9** (contoh kasir −.95 → −2.85).

### 7.2 Objek set

| Objek | Geometri (m) | Posisi pusat | Rotasi |
|---|---|---|---|
| Dinding | plane 40 × 14 | (0, 4, −2.3) | |
| Wainscot | plane 40 × 1.5 | (0, .95, −2.29) | |
| Rail | box 40 × .05 × .05 | (0, 1.72, −2.27) | |
| Permukaan meja | box 40 × .12 × 2.6 | (0, 1.0, .6) → atas di y 1.06, depan di z 1.9 | |
| Depan meja | box 40 × 6 × 2.5 | (0, −2.07, .6) → atas di y .93 | |
| Bayangan bibir meja | plane 40 × .06 | (0, .91, 1.851) | |
| Mesin kasir (grup) | | (.55, 1.06, −.12), x bergeser saat mode Cari (LOGIKA) | y .32 |
| · badan | box .78 × .34 × .58 | (0, .17, 0) | |
| · tombol | box .6 × .04 × .3 | (0, .36, .1) | x −.25 |
| · tiang | silinder r .025, t .34 | (0, .5, −.16) | |
| · layar | box .5 × .3 × .04 | (0, .72, −.14) | x −.15 |
| Rak dinding (grup) | | (3.75, 0, −2.05) | |
| · 2 papan | box 2.1 × .06 × .4 | y 2.75 dan 2.05 | |
| · 8 kotak stok | box .32 × .42 × .26 | x = −.75 + k × .5 (k 0..3), y = papan + .24 | y +.1 (k genap) / −.12 (k ganjil) |
| Lampu gantung (grup) | | (−.6, 3.65, −.5) | ayun z = sin(t × .8) × .03 |
| · kabel | silinder r .01, t 2.2 | y 1.1 | |
| · kap | kerucut terbuka r .32, t .3, 24 segmen | y 0 | |
| · bola | bola r .09 | y −.12 | |

### 7.3 Kasir "Raka" (acuan bentuk dan pose)

| Bagian | Geometri | Posisi (relatif induk) |
|---|---|---|
| Root | grup | (1.95, 0, −.95) |
| Pinggul `hips` | grup | y .95 (+ napas, + pose) |
| Badan | kapsul r .32, panjang .52 | y .62 |
| Celemek | box .5 × .66 × .05 | (0, .48, .3) |
| Tali celemek | box .05 × .4 × .03 | (±.17, .95, .25), rotasi z ±.25 |
| Papan nama | box .16 × .07 × .02 | (.12, .66, .335) |
| Kerah | torus r .13, tabung .035 | y 1.18, rotasi x 90° |
| Kepala (grup) | | y 1.5 |
| · kepala | bola r .27 | 0 |
| · rambut | setengah bola r .285 | y .03, rotasi x −.25 |
| · telinga | bola r .055 | (±.27, −.02, 0) |
| · mata | bola r .032 | (±.09, .02, .245) (bergeser saat melihat kursor) |
| · senyum | setengah torus r .07, tabung .014 | (0, −.08, .25), rotasi z 180° |
| · mulut "O" (saat dipukul) | torus r .034, tabung .016 | (0, −.1, .255), tersembunyi |
| Bahu (grup) | | (±.43, 1.04, 0) |
| · lengan atas | kapsul r .09, panjang .3 | y −.23 |
| · siku (grup) | | y −.45 |
| · lengan bawah | kapsul r .075, panjang .26 | y −.2 |
| · tangan | bola r .09 | y −.41 |

Pose (radian; `l`/`r` = [rotasi x bahu, buka ke samping], `le`/`re` = siku):

| Pose | y pinggul | condong | kepala | lengan kiri | lengan kanan | siku kiri | siku kanan | Dipakai saat |
|---|---|---|---|---|---|---|---|---|
| idle | 0 | 0 | 0 | [0, .12] | [0, .12] | −.25 | −.25 | diam |
| ready | −.95 | .18 | .3 | [−.4, .05] | [−.4, .05] | −.15 | −.15 | jongkok di bawah meja saat mengetik / sebelum menyerahkan |
| lift | .02 | .14 | −.02 | [−1.25, .08] | [−1.25, .08] | −.3 | −.3 | mengangkat kotak ke meja / mengambil kembali |
| offer | 0 | .2 | .12 | [−.95, .1] | [−.95, .1] | −.55 | −.55 | menyerahkan kartu |
| wave | 0 | 0 | −.05 | [0, .12] | [0, 2.6] | −.25 | −.35 | menyapa saat masuk mode Cari |
| shrug | 0 | 0 | .16 | [−.25, .8] | [−.25, .8] | −1.6 | −1.6 | pencarian tanpa hasil |
| nod | 0 | .06 | .2 | [0, .12] | [0, .12] | −.25 | −.25 | kartu dijawab "Ya" |

Gerak tambahan: napas (y pinggul ± .012), kedip setiap 4.2 s (mata skala y .15 selama .12 s), kepala menoleh pelan sin(t × .45) × .14. Rumus lengkap, ikut kursor dan reaksi dipukul ada di LOGIKA.

### 7.4 Kamera

| Keadaan | Layout | pos (x, y, z) | look (x, y, z) | fov |
|---|---|---|---|---|
| Hero (dasar, sebelum disesuaikan) | desktop | .32, 2.3, 6.5 | .32, 2.12, 0 | 35° |
| Hero (dasar) | HP | 1.95, 3.1, 7.2 | 1.95, 2.85, 0 | 41° |
| Fokus (Cari dan Kartu) | desktop | 1.4, 3.9, 6.3 | 1.4, 1.35, .15 | 36° |
| Fokus | HP | 1.95, 4.3, 5.6 | 1.95, 1.45, −.2 | 46° |
| Fokus setelah kotak disajikan | HP | 1.95, 3.45, 4.75 | 1.95, 1.3, −.1 | 46° |

Kamera hero digeser naik/turun supaya bibir meja (y .88) tepat 8 px di atas tepi bawah stage, sehingga depan meja menyambung ke etalase. Hasil terukur per viewport:

| Viewport | Tinggi toko (heroH) | Layout | pos (x, y, z) | look (x, y, z) | fov |
|---|---|---|---|---|---|
| 1920×1080 | 800 px | desktop | 0.32, 2.429, 6.5 | 0.32, 2.249, 0 | 35° |
| 1440×900 | 792 px | desktop | 0.32, 2.428, 6.5 | 0.32, 2.248, 0 | 35° |
| 1280×800 | 704 px | desktop | 0.32, 2.425, 6.5 | 0.32, 2.245, 0 | 35° |
| 1180×820 | 721.6 px | desktop | 0.32, 2.426, 6.5 | 0.32, 2.246, 0 | 35° |
| 1024×1366 | 800 px | desktop | 0.32, 2.429, 6.5 | 0.32, 2.249, 0 | 35° |
| 820×1180 | 800 px | desktop | 0.32, 2.429, 6.5 | 0.32, 2.249, 0 | 35° |
| 768×1024 | 800 px | desktop | 0.32, 2.429, 6.5 | 0.32, 2.249, 0 | 35° |
| 414×896 | 896 px | HP | 1.95, 3.010, 7.2 | 1.95, 2.760, 0 | 41° |
| 390×844 | 844 px | HP | 1.95, 3.008, 7.2 | 1.95, 2.758, 0 | 41° |
| 375×812 | 812 px | HP | 1.95, 3.007, 7.2 | 1.95, 2.757, 0 | 41° |
| 360×740 | 740 px | HP | 1.95, 3.003, 7.2 | 1.95, 2.753, 0 | 41° |

### 7.5 Kotak di atas meja (mode Cari)

| Item | Nilai |
|---|---|
| Kotak | RoundedBox .78 × .4 × .44 m, 3 segmen, radius .045, warna tim (Standard roughness .6) |
| Panel sampul | bentuk rounded rect .624 × .208 m (80% × 52%), radius .035, putih, di depan kotak (y +.032, z +.223) |
| Skala | .4 sampai .8 (desktop) / .72 (HP), mengikuti lebar area kosong (rumus di LOGIKA) |
| Rotasi | y +.12 (kotak genap) / −.12 (ganjil) |
| Jumlah | maksimal 6. 1–3 kotak satu baris; 4–6 dua baris, baris belakang digeser setengah kotak |
| Tag nomor | HTML 30×30, radius 10, navy, teks putih mono 13/700, ring putih 2 px + `0 8px 16px -8px rgba(11,15,58,.8)`, hover ungu. Melayang .16 m di atas kotak |

Posisi tengah tag nomor (px dari kiri dan atas layar) setelah disajikan, sesuai jumlah hasil. Kata kunci: "stok" 1, "dokumen" 2, "pemilik" 3, "jadwal" 4, "pelanggan" 5, kosong 6:

| Viewport | 1 hasil | 2 hasil | 3 hasil | 4 hasil | 5 hasil | 6 hasil |
|---|---|---|---|---|---|---|
| 1920×1080 | (960,577) | (860,577) (1060,577) | (760,577) (960,577) (1160,577) | (810,577) (1010,577) (916,491) (1092,491) | (710,577) (910,577) (1110,577) (828,491) (1004,491) | (710,577) (910,577) (1110,577) (828,491) (1004,491) (1181,491) |
| 1440×900 | (720,481) | (637,481) (803,481) | (553,481) (720,481) (887,481) | (595,481) (762,481) (683,409) (830,409) | (512,481) (678,481) (845,481) (610,409) (757,409) | (512,481) (678,481) (845,481) (610,409) (757,409) (904,409) |
| 1280×800 | (640,428) | (566,428) (714,428) | (492,428) (640,428) (788,428) | (529,428) (677,428) (607,364) (738,364) | (455,428) (603,428) (751,428) (542,364) (673,364) | (455,428) (603,428) (751,428) (542,364) (673,364) (803,364) |
| 1180×820 | (590,438) | (514,438) (666,438) | (438,438) (590,438) (742,438) | (476,438) (628,438) (557,373) (691,373) | (400,438) (552,438) (704,438) (490,373) (624,373) | (400,438) (552,438) (704,438) (490,373) (624,373) (758,373) |
| 1024×1366 | (512,730) | (385,730) (639,730) | (259,730) (512,730) (765,730) | (322,730) (575,730) (456,621) (679,621) | (200,732) (450,732) (699,732) (347,623) (567,623) | (200,732) (450,732) (699,732) (347,623) (567,623) (787,623) |
| 820×1180 | (410,631) | (301,631) (519,631) | (191,631) (410,631) (629,631) | (246,631) (465,631) (362,537) (555,537) | (161,639) (360,639) (560,639) (278,544) (454,544) | (161,639) (360,639) (560,639) (278,544) (454,544) (630,544) |
| 768×1024 | (384,547) | (289,547) (479,547) | (194,547) (384,547) (574,547) | (242,547) (431,547) (342,466) (510,466) | (150,548) (337,548) (524,548) (260,467) (425,467) | (150,548) (337,548) (524,548) (260,467) (425,467) (590,467) |
| 414×896 | (207,455) | (136,455) (278,455) | (74,459) (207,459) (340,459) | (101,455) (242,455) (176,395) (300,395) | (66,467) (179,467) (292,467) (133,406) (232,406) | (66,467) (179,467) (292,467) (133,406) (232,406) (330,406) |
| 390×844 | (195,429) | (128,429) (262,429) | (71,433) (195,433) (319,433) | (95,429) (228,429) (166,372) (282,372) | (63,440) (169,440) (274,440) (126,382) (218,382) | (63,440) (169,440) (274,440) (126,382) (218,382) (310,382) |
| 375×812 | (188,413) | (123,413) (252,413) | (69,417) (188,417) (306,417) | (91,413) (220,413) (160,358) (272,358) | (61,424) (162,424) (263,424) (121,368) (210,368) | (61,424) (162,424) (263,424) (121,368) (210,368) (298,368) |
| 360×740 | (180,376) | (122,376) (239,376) | (66,377) (180,377) (294,377) | (92,376) (209,376) (154,326) (257,326) | (59,384) (156,384) (252,384) (117,334) (201,334) | (59,384) (156,384) (252,384) (117,334) (201,334) (285,334) |

---

## 8. Etalase

### 8.1 Susunan lapisan (atas ke bawah)

| Lapisan | Elemen | Bentuk |
|---|---|---|
| Ruang | `.etalase` | latar `#131951`, 60 px terbawah `#0B0F3A` (lantai) |
| Badan meja | `.counter` | lebar penuh, `#C2B8DF`, padding atas 14 / bawah 24 (HP: 12 / 18, kiri-kanan 10) |
| Judul | `.counter-h` | H2 rata tengah, margin bawah 14 |
| Jendela rak | `.frame` | radius 10, `#2A2F6B`, padding `2px 0 8px`, bayangan dalam (8.2) |
| Tier | `.tier` | satu per tim, padding `0 10px 28px` (HP `0 8px 28px`) |
| Track | `.track` | grid kolom otomatis, gap 14, padding atas 20 (HP 16), scroll x dengan snap, scrollbar disembunyikan |
| Slot | `.slot` / `.prod` | link ke detail (`#s-<slug>`) |
| Kotak | `.pk` | tinggi 142, naik 6 px saat hover/fokus (200 ms ease-out) |
| Papan | `.plank` | absolute di dasar tier, tinggi 24, label tim padding kiri 14 |
| Alas | `.plinth` | tinggi 20, `#AA9FCD`, lebar penuh |

Lebar kolom track: `max(216px, (100% − 4 × 14px) / 5)` (desktop dan tablet), **228 px** tetap di HP. Desktop lebar menampilkan 5 slot per tier; slot yang kosong diisi kotak dekor sampai 5.

### 8.2 Bayangan dan bentuk jendela rak

| Bagian | Nilai |
|---|---|
| Bayangan dalam jendela | `inset 0 46px 40px -16px rgba(3,4,24,.96)` (atas), `inset 34px 0 34px -20px rgba(3,4,24,.9)` (kiri), `inset -34px 0 34px -20px rgba(3,4,24,.9)` (kanan), `inset 0 -20px 28px -14px rgba(3,4,24,.7)` (bawah) |
| Garis tepi luar | `0 1px 0 rgba(255,255,255,.3)` (bawah, terang), `0 -3px 0 rgba(19,25,81,.22)` (atas, gelap) |
| Kaca | **tidak ada** (dihapus di v1) |

### 8.3 Isi kotak (HTML di depan kotak 3D)

| Bagian | Posisi di dalam `.pk` | Bentuk |
|---|---|---|
| Badge status `.st` | atas 9, kanan 10 | tinggi 18, pil putih, padding `0 8px`, gap 5, shadow `0 1px 0 rgba(19,25,81,.14)`, titik 6 px (`#06606C` jalan / `#5B1BB5` ide) |
| Sampul `.cover` | kiri/kanan 8, atas 36, tinggi 58, padding `0 8px` | teks 13/700 navy, 2 baris, rata kiri, vertikal tengah |
| Ikon aplikasi `.apps` | kiri 10, bawah 12, gap 6 | lingkaran putih 24 px, ikon navy 14 px, shadow `0 1px 0 rgba(19,25,81,.14)` |

### 8.4 Etalase 3D (pass orthographic)

| Item | Nilai |
|---|---|
| Kamera | `OrthographicCamera(0, W, 0, −H, 1, 4000)`, z 2000. **1 unit = 1 CSS px** dari viewport |
| Cahaya | Hemisphere `#FFFFFF` / `#E6DEFC` 2.35 · Directional `#FFFFFF` .95 di (−.35, .9, 1) |
| Kemiringan | Semua bagian diputar **x .2 rad (11.46°)** di sekitar muka depannya, supaya sisi atas terlihat. Tinggi geometri = tinggi kotak HTML / cos(.2), jadi muka depan tetap tepat di atas kotak HTML |
| Papan rak | RoundedBox seukuran `.plank` × kedalaman 52, radius 4, `#B4A9D5`, z +8 |
| Kotak produk | RoundedBox seukuran `.pk` (lebar slot × 142) × kedalaman 64, radius 11, warna tim |
| Panel sampul | rounded rect seukuran `.cover` (× 58), radius 9, putih, tanpa depth test, di depan kotak |
| Kotak dekor | 4 kotak 2×2 per slot dekor: lebar (slot − 6)/2, tinggi 71, kedalaman 56, radius 8, warna dekor (2.3). Label putih 62% × 26% lebar/tinggi kotak (radius 5) di 19%/20% dari kiri/atas; pita (lebar − 14) × 13% (radius 3) di 64% dari atas |
| Bayangan kontak | plane, tekstur 128×32 gradien radial (pusat `rgba(0,0,0,.95)`, 50% `.7`, tepi 0), warna `#05071F`. Posisi: tengah x kotak, 8 px di bawah dasar slot. Ukuran: lebar kotak × 1.24 × k, tinggi 40. k = 1 − min(1, naik/6) × .25 (bayangan mengecil 25% saat kotak naik 6 px) |
| Draw call | papan 1, kotak 1, panel 1, dekor 3, bayangan 1 (instanced) |
| Pemotongan | Kotak digambar per track (scissor seluas track ∩ jendela), jadi kotak yang tergeser keluar tidak tampil di luar jendela |

### 8.5 Versi tanpa WebGL (`html.no3d`)

| Bagian | Nilai |
|---|---|
| Stage toko | gradien: `#131951` 0–72%, `#CFC5E8` 72–76%, `#C2B8DF` 76% ke bawah |
| Papan | `#B4A9D5` |
| Kotak | latar warna tim (`--c`), radius 12 |
| Sampul | latar putih, radius 8 |

### 8.6 Band

| Bagian | Nilai |
|---|---|
| `.band-wrap` | `#0B0F3A`, padding bawah `clamp(40px, 6vw, 72px)` |
| `.band` | radius 24, `#1A2160`, padding `clamp(22px, 4vw, 36px)`, gap 16, ring dalam `inset 0 0 0 1px rgba(182,187,226,.22)`. Mulai 860 px: grid `1fr auto` |

### 8.7 Ukuran terukur

**Desktop**

| Elemen | 1920×1080 | 1440×900 | 1280×800 |
|---|---|---|---|
| Section etalase | 1920×1502.8 | 1440×1502.8 | 1280×1502.8 |
| Badan meja (.counter) | 1920×1422.8 | 1440×1422.8 | 1280×1422.8 |
| Judul "Pilih solusi…" | 1240×30.8 · 28/30.8 700 | 1240×30.8 · 28/30.8 700 | 1216×30.8 · 28/30.8 700 |
| Jendela rak (.frame) | 1240×1340 | 1240×1340 | 1216×1340 |
| Satu tier | 1240×190 | 1240×190 | 1216×190 |
| Track (area scroll) | 1220×162 | 1220×162 | 1196×162 |
| Slot produk | 232.8×142 | 232.8×142 | 228×142 |
| Kotak produk (.pk) | 232.8×142 | 232.8×142 | 228×142 |
| Badge status | 101.6×18 · 10/10 700 | 101.6×18 · 10/10 700 | 101.6×18 · 10/10 700 |
| Sampul (teks cover) | 216.8×58 · 13/16.6 700 | 216.8×58 · 13/16.6 700 | 212×58 · 13/16.6 700 |
| Baris ikon aplikasi | 84×24 | 84×24 | 84×24 |
| Lingkaran ikon aplikasi | 24×24 | 24×24 | 24×24 |
| Papan rak (.plank) | 1240×24 | 1240×24 | 1216×24 |
| Label tim di papan | 116.9×12 · 12/12 700 | 116.9×12 · 12/12 700 | 116.9×12 · 12/12 700 |
| Plinth (alas) | 1920×20 | 1440×20 | 1280×20 |
| Panah geser (next) | tersembunyi | tersembunyi | tersembunyi |
| Band "Masalah Anda…" | 1200×162.8 | 1200×162.8 | 1200×162.8 |
| Judul band | 913.8×35.2 · 32/35.2 700 | 913.8×35.2 · 32/35.2 700 | 913.8×35.2 · 32/35.2 700 |
| Paragraf band | 609×49.6 · 16/24.8 400 | 609×49.6 · 16/24.8 400 | 609×49.6 · 16/24.8 400 |
| Tombol band | 198.3×48 · 16/16 600 | 198.3×48 · 16/16 600 | 198.3×48 · 16/16 600 |
| Footer | 1920×76.1 | 1440×76.1 | 1280×76.1 |
| Logo footer | 129.7×22 | 129.7×22 | 129.7×22 |


**Tablet**

| Elemen | 1180×820 | 1024×1366 | 820×1180 | 768×1024 |
|---|---|---|---|---|
| Section etalase | 1180×1500.5 | 1024×1496.8 | 820×1494 | 768×1494 |
| Badan meja (.counter) | 1180×1420.5 | 1024×1416.8 | 820×1414 | 768×1414 |
| Judul "Pilih solusi…" | 1116×28.5 · 26/28.6 700 | 960×24.8 · 22.5/24.8 700 | 756×22 · 20/22 700 | 704×22 · 20/22 700 |
| Jendela rak (.frame) | 1116×1340 | 960×1340 | 756×1340 | 704×1340 |
| Satu tier | 1116×190 | 960×190 | 756×190 | 704×190 |
| Track (area scroll) | 1096×162 | 940×162 | 736×162 | 684×162 |
| Slot produk | 216×142 | 216×142 | 216×142 | 216×142 |
| Kotak produk (.pk) | 216×142 | 216×142 | 216×142 | 216×142 |
| Badge status | 101.6×18 · 10/10 700 | 101.6×18 · 10/10 700 | 101.6×18 · 10/10 700 | 101.6×18 · 10/10 700 |
| Sampul (teks cover) | 200×58 · 13/16.6 700 | 200×58 · 13/16.6 700 | 200×58 · 13/16.6 700 | 200×58 · 13/16.6 700 |
| Baris ikon aplikasi | 84×24 | 84×24 | 84×24 | 84×24 |
| Lingkaran ikon aplikasi | 24×24 | 24×24 | 24×24 | 24×24 |
| Papan rak (.plank) | 1116×24 | 960×24 | 756×24 | 704×24 |
| Label tim di papan | 116.9×12 · 12/12 700 | 116.9×12 · 12/12 700 | 116.9×12 · 12/12 700 | 116.9×12 · 12/12 700 |
| Plinth (alas) | 1180×20 | 1024×20 | 820×20 | 768×20 |
| Panah geser (next) | 40×40 | 40×40 | 40×40 | 40×40 |
| Band "Masalah Anda…" | 1116×161.3 | 960×156.9 | 756×209.8 | 704×205.7 |
| Judul band | 829.8×33.8 · 30.7/33.7 700 | 673.8×29.3 · 26.6/29.3 700 | 690.4×24.6 · 22.4/24.6 700 | 642.6×24.6 · 22.4/24.6 700 |
| Paragraf band | 609×49.6 · 16/24.8 400 | 609×49.6 · 16/24.8 400 | 609×49.6 · 16/24.8 400 | 609×49.6 · 16/24.8 400 |
| Tombol band | 198.3×48 · 16/16 600 | 198.3×48 · 16/16 600 | 690.4×48 · 16/16 600 | 642.6×48 · 16/16 600 |
| Footer | 1180×76.1 | 1024×76.1 | 820×110.1 | 768×110.1 |
| Logo footer | 129.7×22 | 129.7×22 | 129.7×22 | 129.7×22 |


**HP**

| Elemen | 414×896 | 390×844 | 375×812 | 360×740 |
|---|---|---|---|---|
| Section etalase | 414×1458 | 390×1458 | 375×1458 | 360×1480 |
| Badan meja (.counter) | 414×1378 | 390×1378 | 375×1378 | 360×1400 |
| Judul "Pilih solusi…" | 394×22 · 20/22 700 | 370×22 · 20/22 700 | 355×22 · 20/22 700 | 340×44 · 20/22 700 |
| Jendela rak (.frame) | 394×1312 | 370×1312 | 355×1312 | 340×1312 |
| Satu tier | 394×186 | 370×186 | 355×186 | 340×186 |
| Track (area scroll) | 386×158 | 362×158 | 347×158 | 332×158 |
| Slot produk | 228×142 | 228×142 | 228×142 | 228×142 |
| Kotak produk (.pk) | 228×142 | 228×142 | 228×142 | 228×142 |
| Badge status | 101.6×18 · 10/10 700 | 101.6×18 · 10/10 700 | 101.6×18 · 10/10 700 | 101.6×18 · 10/10 700 |
| Sampul (teks cover) | 212×58 · 13/16.6 700 | 212×58 · 13/16.6 700 | 212×58 · 13/16.6 700 | 212×58 · 13/16.6 700 |
| Baris ikon aplikasi | 84×24 | 84×24 | 84×24 | 84×24 |
| Lingkaran ikon aplikasi | 24×24 | 24×24 | 24×24 | 24×24 |
| Papan rak (.plank) | 394×24 | 370×24 | 355×24 | 340×24 |
| Label tim di papan | 116.9×12 · 12/12 700 | 116.9×12 · 12/12 700 | 116.9×12 · 12/12 700 | 116.9×12 · 12/12 700 |
| Plinth (alas) | 414×20 | 390×20 | 375×20 | 360×20 |
| Panah geser (next) | tersembunyi | tersembunyi | tersembunyi | tersembunyi |
| Band "Masalah Anda…" | 382×213 | 358×237.7 | 343×237.7 | 328×237.7 |
| Judul band | 338×24.6 · 22.4/24.6 700 | 314×49.3 · 22.4/24.6 700 | 299×49.3 · 22.4/24.6 700 | 284×49.3 · 22.4/24.6 700 |
| Paragraf band | 338×74.4 · 16/24.8 400 | 314×74.4 · 16/24.8 400 | 299×74.4 · 16/24.8 400 | 284×74.4 · 16/24.8 400 |
| Tombol band | 338×48 · 16/16 600 | 314×48 · 16/16 600 | 299×48 · 16/16 600 | 284×48 · 16/16 600 |
| Footer | 414×162.4 | 390×162.4 | 375×162.4 | 360×162.4 |
| Logo footer | 129.7×22 | 129.7×22 | 129.7×22 | 129.7×22 |

Lebar track dan rak yang bisa digeser (7 tier, 12 solusi):

| Viewport | Lebar track | Lebar slot | Tier yang overflow (panah/scroll aktif) |
|---|---|---|---|
| 1920×1080 | 1220 px | 232.8 px | tidak ada |
| 1440×900 | 1220 px | 232.8 px | tidak ada |
| 1280×800 | 1196 px | 228 px | tidak ada |
| 1180×820 | 1096 px | 216 px | semua 7 tier · panah tampil |
| 1024×1366 | 940 px | 216 px | semua 7 tier · panah tampil |
| 820×1180 | 736 px | 216 px | semua 7 tier · panah tampil |
| 768×1024 | 684 px | 216 px | semua 7 tier · panah tampil |
| 414×896 | 386 px | 228 px | semua 7 tier · panah disembunyikan (HP), geser jari |
| 390×844 | 362 px | 228 px | semua 7 tier · panah disembunyikan (HP), geser jari |
| 375×812 | 347 px | 228 px | semua 7 tier · panah disembunyikan (HP), geser jari |
| 360×740 | 332 px | 228 px | semua 7 tier · panah disembunyikan (HP), geser jari |

Teks sampul: 12 dari 12 sampul **2 baris** di semua 11 viewport.

---

## 9. Mode Cari

### 9.1 Bentuk

| Bagian | Desktop dan tablet | HP |
|---|---|---|
| Kertas struk `.paper` | kiri = kiri konten, atas `nav-top + nav-h + 74px`, lebar `min(380px, 40%)`, max-height `100% − nav − 100px`, padding `20px 20px 26px`, latar `#FFFDF7`, radius `6px 6px 0 0`, **rotasi −1.5°**, tepi bawah bergerigi (mask segitiga 16×10 px), shadow `0 28px 40px -26px rgba(11,15,58,.55), 0 0 0 1px rgba(19,25,81,.06)` | lembar bawah: kiri/kanan gutter, bawah 12, tanpa rotasi, max-height 54% |
| Kepala struk | grid gap 4, rata tengah, padding bawah 12, garis putus-putus 1.5 px `rgba(19,25,81,.25)` | sama |
| Input | tinggi 48, radius 10, `#F1EEF9`, padding `0 14px` | sama |
| Filter | grid 2 kolom gap 8, select tinggi 40, radius 10, padding `0 28px 0 12px`, ikon caret 12 px di kanan 10. Aktif: `#EDE3FF`, teks `#5B1BB5`, ring dalam 1.5 px `rgba(91,27,181,.35)` | sama |
| Tombol kirim | lebar penuh | sama |
| Bar hasil `.pbar` | tengah bawah 16, lebar `min(460px, 100% − 32px)`, padding 12, radius 18, `#FFFDF7`, shadow `0 22px 40px -22px rgba(11,15,58,.7), 0 0 0 1px rgba(19,25,81,.06)`, 2 tombol grid 2 kolom gap 8 | bawah 12 |
| Kartu ringkasan `.sum` | lebar 320, padding `16px 16px 14px`, radius 18, putih, shadow `0 24px 44px -20px rgba(11,15,58,.75), 0 0 0 1px rgba(19,25,81,.08)`, diletakkan di atas kotak (`translate(−50%, −100%)`), panah 14×14 di bawah (diputar 45°, radius sudut 3) | kiri/kanan 16, di atas bar (bawah = tinggi bar + 12), padding kanan 52, **tanpa panah**, tombol tutup 36×36 (`--wash`, ikon 16) di kanan atas 10 |
| Chip platform | pil, padding `4px 9px`, `--wash`, ikon 14 | sama |
| Mesin kasir 3D | bergeser ke belakang kertas struk | keluar layar ke kiri |

### 9.2 Ukuran terukur

Catatan: di desktop dan tablet kertas struk diputar −1.5°, jadi lebar/tinggi elemen di dalamnya adalah kotak luar setelah diputar (sedikit lebih besar dari nilai CSS: input 48 px terbaca ±56 px, select 40 px terbaca ±44 px).

**Desktop**

| Elemen | 1920×1080 | 1440×900 | 1280×800 |
|---|---|---|---|
| Tombol "Kembali ke etalase" | x 360 · 189.7×44 · 15/23.3 700 | x 120 · 189.7×44 · 15/23.3 700 | x 40 · 189.7×44 · 15/23.3 700 |
| Kertas struk (.paper) | x 355.3 · 389.4×372.4 · y 145.1 | x 115.3 · 389.4×372.4 · y 145.1 | x 35.3 · 389.4×372.4 · y 145.1 |
| Kepala struk | 341.8×81.5 · 12/16.8 500 | 341.8×81.5 · 12/16.8 500 | 341.8×81.5 · 12/16.8 500 |
| "KREATEKNO" di struk | 340.4×26.9 · 15/18 700 | 340.4×26.9 · 15/18 700 | 340.4×26.9 · 15/18 700 |
| Label "Cari solusi" | 341.6×74.9 · 12/12 700 | 341.6×74.9 · 12/12 700 | 341.6×74.9 · 12/12 700 |
| Input pencarian | 341.1×56.9 · 16/normal 500 | 341.1×56.9 · 16/normal 500 | 341.1×56.9 · 16/normal 500 |
| Grid filter | 342.2×96.9 | 342.2×96.9 | 342.2×96.9 |
| Select filter | 167×44.3 · 13/normal 600 | 167×44.3 · 13/normal 600 | 167×44.3 · 13/normal 600 |
| Tombol "Ambilkan solusinya" | 341.1×56.9 · 16/16 600 | 341.1×56.9 · 16/16 600 | 341.1×56.9 · 16/16 600 |
| Bar hasil (.pbar) | x 730 · 460×70 · y 994 | x 490 · 460×70 · y 814 | x 410 · 460×70 · y 714 |
| Tombol "Cari kembali" | 214×46 · 15/15 600 | 214×46 · 15/15 600 | 214×46 · 15/15 600 |
| Tombol "Belum dapat solusi" | 214×46 · 15/15 600 | 214×46 · 15/15 600 | 214×46 · 15/15 600 |
| Tag nomor di atas kotak | 30×30 · 13/13 700 | 30×30 · 13/13 700 | 30×30 · 13/13 700 |
| Kartu ringkasan (.sum) | x 554.9 · 320×232.4 · y 353.9 | x 353.5 · 320×232.4 · y 248.8 | x 296.4 · 320×232.4 · y 192 |
| Judul ringkasan | 288×40.8 · 17/20.4 700 | 288×40.8 · 17/20.4 700 | 288×40.8 · 17/20.4 700 |
| Chip platform | 99.3×26.6 · 12/18.6 600 | 99.3×26.6 · 12/18.6 600 | 99.3×26.6 · 12/18.6 600 |
| Teks ringkasan | 288×63 · 14/21 400 | 288×63 · 14/21 400 | 288×63 · 14/21 400 |
| Tombol "Lihat detail" | 135.8×42 · 14/14 600 | 135.8×42 · 14/14 600 | 135.8×42 · 14/14 600 |
| Tombol tutup ringkasan (HP) | tersembunyi | tersembunyi | tersembunyi |


**Tablet**

| Elemen | 1180×820 | 1024×1366 | 820×1180 | 768×1024 |
|---|---|---|---|---|
| Tombol "Kembali ke etalase" | x 32 · 189.7×44 · 15/23.3 700 | x 32 · 189.7×44 · 15/23.3 700 | x 32 · 189.7×44 · 15/23.3 700 | x 32 · 189.7×44 · 15/23.3 700 |
| Kertas struk (.paper) | x 27.3 · 389.4×372.4 · y 145.1 | x 27.3 · 389.4×372.4 · y 145.1 | x 27.3 · 337.4×371.1 · y 145.8 | x 27.3 · 316.6×370.5 · y 146 |
| Kepala struk | 341.8×81.5 · 12/16.8 500 | 341.8×81.5 · 12/16.8 500 | 289.8×80.1 · 12/16.8 500 | 269×79.6 · 12/16.8 500 |
| "KREATEKNO" di struk | 340.4×26.9 · 15/18 700 | 340.4×26.9 · 15/18 700 | 288.4×25.5 · 15/18 700 | 267.6×25 · 15/18 700 |
| Label "Cari solusi" | 341.6×74.9 · 12/12 700 | 341.6×74.9 · 12/12 700 | 289.6×73.5 · 12/12 700 | 268.8×73 · 12/12 700 |
| Input pencarian | 341.1×56.9 · 16/normal 500 | 341.1×56.9 · 16/normal 500 | 289.2×55.5 · 16/normal 500 | 268.4×55 · 16/normal 500 |
| Grid filter | 342.2×96.9 | 342.2×96.9 | 290.2×95.5 | 269.4×95 |
| Select filter | 167×44.3 · 13/normal 600 | 167×44.3 · 13/normal 600 | 141×43.7 · 13/normal 600 | 130.6×43.4 · 13/normal 600 |
| Tombol "Ambilkan solusinya" | 341.1×56.9 · 16/16 600 | 341.1×56.9 · 16/16 600 | 289.2×55.5 · 16/16 600 | 268.4×55 · 16/16 600 |
| Bar hasil (.pbar) | x 360 · 460×70 · y 734 | x 282 · 460×70 · y 1280 | x 180 · 460×70 · y 1094 | x 154 · 460×70 · y 938 |
| Tombol "Cari kembali" | 214×46 · 15/15 600 | 214×46 · 15/15 600 | 214×46 · 15/15 600 | 214×46 · 15/15 600 |
| Tombol "Belum dapat solusi" | 214×46 · 15/15 600 | 214×46 · 15/15 600 | 214×46 · 15/15 600 | 214×46 · 15/15 600 |
| Tag nomor di atas kotak | 30×30 · 13/13 700 | 30×30 · 13/13 700 | 30×30 · 13/13 700 | 30×30 · 13/13 700 |
| Kartu ringkasan (.sum) | x 241.8 · 320×232.4 · y 203.3 | x 46.8 · 320×232.4 · y 518.3 | x 16 · 320×232.4 · y 416 | x 16 · 320×232.4 · y 320.2 |
| Judul ringkasan | 288×40.8 · 17/20.4 700 | 288×40.8 · 17/20.4 700 | 288×40.8 · 17/20.4 700 | 288×40.8 · 17/20.4 700 |
| Chip platform | 99.3×26.6 · 12/18.6 600 | 99.3×26.6 · 12/18.6 600 | 99.3×26.6 · 12/18.6 600 | 99.3×26.6 · 12/18.6 600 |
| Teks ringkasan | 288×63 · 14/21 400 | 288×63 · 14/21 400 | 288×63 · 14/21 400 | 288×63 · 14/21 400 |
| Tombol "Lihat detail" | 135.8×42 · 14/14 600 | 135.8×42 · 14/14 600 | 135.8×42 · 14/14 600 | 135.8×42 · 14/14 600 |
| Tombol tutup ringkasan (HP) | tersembunyi | tersembunyi | tersembunyi | tersembunyi |


**HP**

| Elemen | 414×896 | 390×844 | 375×812 | 360×740 |
|---|---|---|---|---|
| Tombol "Kembali ke etalase" | x 16 · 189.7×44 · 15/23.3 700 | x 16 · 189.7×44 · 15/23.3 700 | x 16 · 189.7×44 · 15/23.3 700 | x 16 · 189.7×44 · 15/23.3 700 |
| Kertas struk (.paper) | x 16 · 382×362.6 · y 521.4 | x 16 · 358×362.6 · y 469.4 | x 16 · 343×362.6 · y 437.4 | x 16 · 328×362.6 · y 365.4 |
| Kepala struk | 342×72.6 · 12/16.8 500 | 318×72.6 · 12/16.8 500 | 303×72.6 · 12/16.8 500 | 288×72.6 · 12/16.8 500 |
| "KREATEKNO" di struk | 342×18 · 15/18 700 | 318×18 · 15/18 700 | 303×18 · 15/18 700 | 288×18 · 15/18 700 |
| Label "Cari solusi" | 342×66 · 12/12 700 | 318×66 · 12/12 700 | 303×66 · 12/12 700 | 288×66 · 12/12 700 |
| Input pencarian | 342×48 · 16/normal 500 | 318×48 · 16/normal 500 | 303×48 · 16/normal 500 | 288×48 · 16/normal 500 |
| Grid filter | 342×88 | 318×88 | 303×88 | 288×88 |
| Select filter | 167×40 · 13/normal 600 | 155×40 · 13/normal 600 | 147.5×40 · 13/normal 600 | 140×40 · 13/normal 600 |
| Tombol "Ambilkan solusinya" | 342×48 · 16/16 600 | 318×48 · 16/16 600 | 303×48 · 16/16 600 | 288×48 · 16/16 600 |
| Bar hasil (.pbar) | x 16 · 382×70 · y 814 | x 16 · 358×70 · y 762 | x 16 · 343×70 · y 730 | x 16 · 328×70 · y 658 |
| Tombol "Cari kembali" | 175×46 · 15/15 600 | 163×46 · 15/15 600 | 151.3×46 · 15/15 600 | 139.3×46 · 15/15 600 |
| Tombol "Belum dapat solusi" | 175×46 · 15/15 600 | 163×46 · 15/15 600 | 159.8×46 · 15/15 600 | 159.8×46 · 15/15 600 |
| Tag nomor di atas kotak | 30×30 · 13/13 700 | 30×30 · 13/13 700 | 30×30 · 13/13 700 | 30×30 · 13/13 700 |
| Kartu ringkasan (.sum) | x 16 · 382×232.4 · y 569.6 | x 16 · 358×232.4 · y 517.6 | x 16 · 343×232.4 · y 485.6 | x 16 · 328×253.4 · y 392.6 |
| Judul ringkasan | 314×40.8 · 17/20.4 700 | 290×40.8 · 17/20.4 700 | 275×40.8 · 17/20.4 700 | 260×40.8 · 17/20.4 700 |
| Chip platform | 99.3×26.6 · 12/18.6 600 | 99.3×26.6 · 12/18.6 600 | 99.3×26.6 · 12/18.6 600 | 99.3×26.6 · 12/18.6 600 |
| Teks ringkasan | 314×63 · 14/21 400 | 290×63 · 14/21 400 | 275×63 · 14/21 400 | 260×84 · 14/21 400 |
| Tombol "Lihat detail" | 135.8×42 · 14/14 600 | 135.8×42 · 14/14 600 | 135.8×42 · 14/14 600 | 135.8×42 · 14/14 600 |
| Tombol tutup ringkasan (HP) | 36×36 | 36×36 | 36×36 | 36×36 |

---

## 10. Pop up kontak

| Bagian | Nilai |
|---|---|
| Latar | fixed penuh, `rgba(11,15,58,.62)` + `backdrop-filter: blur(4px)`, padding 16, isi di tengah |
| Kartu | lebar `min(400px, 100%)`, padding `26px 22px 22px`, radius 24, putih, gap 14, shadow `0 30px 60px -30px rgba(0,0,0,.7)` |
| Tombol X | 40×40, kanan/atas 14, lingkaran `--wash`, ikon 18 navy |
| Baris kontak `.ct` | grid `44px 1fr 18px`, gap 12, padding `12px 14px`, radius 16, `--wash`, hover `#EDE3FF`, aktif `scale(.98)` |
| Ikon kanal | 44×44, radius 12, ikon putih 22. WhatsApp `#1C7A43`, Instagram `#9F0ED6`, Email `#131951` |
| Panah kanan | 18 px muted |

**Desktop**

| Elemen | 1920×1080 | 1440×900 | 1280×800 |
|---|---|---|---|
| Kartu pop up | x 760.1 · 399.9×371.6 · y 354.4 | x 520 · 400×371.7 · y 264.1 | x 440 · 400×371.7 · y 214.1 |
| Judul pop up | 355.9×26.4 · 24/26.4 700 | 356×26.4 · 24/26.4 700 | 356×26.4 · 24/26.4 700 |
| Paragraf pop up | 355.9×46.5 · 15/23.3 400 | 356×46.5 · 15/23.3 400 | 356×46.5 · 15/23.3 400 |
| Tombol X | 40×40 | 40×40 | 40×40 |
| Baris kontak | 355.9×68.9 | 356×68.9 | 356×68.9 |
| Ikon kontak | 44×44 | 44×44 | 44×44 |
| Nama kanal | 241.9×24.8 · 16/24.8 700 | 242×24.8 · 16/24.8 700 | 242×24.8 · 16/24.8 700 |
| Keterangan kanal | 241.9×20.1 · 13/20.1 500 | 242×20.1 · 13/20.1 500 | 242×20.1 · 13/20.1 500 |


**Tablet**

| Elemen | 1180×820 | 1024×1366 | 820×1180 | 768×1024 |
|---|---|---|---|---|
| Kartu pop up | x 390 · 400×371.7 · y 224.1 | x 312 · 400×371.7 · y 497.1 | x 210 · 400×371.7 · y 404.1 | x 184 · 400×371.7 · y 326.1 |
| Judul pop up | 356×26.4 · 24/26.4 700 | 356×26.4 · 24/26.4 700 | 356×26.4 · 24/26.4 700 | 356×26.4 · 24/26.4 700 |
| Paragraf pop up | 356×46.5 · 15/23.3 400 | 356×46.5 · 15/23.3 400 | 356×46.5 · 15/23.3 400 | 356×46.5 · 15/23.3 400 |
| Tombol X | 40×40 | 40×40 | 40×40 | 40×40 |
| Baris kontak | 356×68.9 | 356×68.9 | 356×68.9 | 356×68.9 |
| Ikon kontak | 44×44 | 44×44 | 44×44 | 44×44 |
| Nama kanal | 242×24.8 · 16/24.8 700 | 242×24.8 · 16/24.8 700 | 242×24.8 · 16/24.8 700 | 242×24.8 · 16/24.8 700 |
| Keterangan kanal | 242×20.1 · 13/20.1 500 | 242×20.1 · 13/20.1 500 | 242×20.1 · 13/20.1 500 | 242×20.1 · 13/20.1 500 |


**HP**

| Elemen | 414×896 | 390×844 | 375×812 | 360×740 |
|---|---|---|---|---|
| Kartu pop up | x 16 · 382×391.8 · y 252.1 | x 16 · 358×435.2 · y 204.4 | x 16 · 343×455.4 · y 178.3 | x 16 · 328×455.4 · y 142.3 |
| Judul pop up | 338×26.4 · 24/26.4 700 | 314×26.4 · 24/26.4 700 | 299×26.4 · 24/26.4 700 | 284×26.4 · 24/26.4 700 |
| Paragraf pop up | 338×46.5 · 15/23.3 400 | 314×69.8 · 15/23.3 400 | 299×69.8 · 15/23.3 400 | 284×69.8 · 15/23.3 400 |
| Tombol X | 40×40 | 40×40 | 40×40 | 40×40 |
| Baris kontak | 338×68.9 | 314×68.9 | 299×89.1 | 284×89.1 |
| Ikon kontak | 44×44 | 44×44 | 44×44 | 44×44 |
| Nama kanal | 224×24.8 · 16/24.8 700 | 200×24.8 · 16/24.8 700 | 185×24.8 · 16/24.8 700 | 170×24.8 · 16/24.8 700 |
| Keterangan kanal | 224×20.1 · 13/20.1 500 | 200×20.1 · 13/20.1 500 | 185×40.3 · 13/20.1 500 | 170×40.3 · 13/20.1 500 |

---

## 11. Kartu masalah

### 11.1 Bentuk

| Bagian | Desktop dan tablet | HP |
|---|---|---|
| Wadah `.deckwrap` | tengah, bawah 6%, lebar `min(380px, 100% − 32px)`, gap 14 | bawah 14 |
| Deck | lebar 100%, tinggi `clamp(250px, 40svh, 320px)` | lebar `min(263px, 100% − 80px)`, tinggi `clamp(300px, 46svh, 370px)` |
| Kartu `.pc` | grid 3 baris, gap 12, padding 22, radius 24, putih, shadow `0 30px 50px -28px rgba(11,15,58,.7), 0 0 0 1px rgba(19,25,81,.06)`, kursor grab | baris atas `.k` jadi 2 baris (kolom, gap 5) |
| Kartu kedua dan ketiga | `translateY(10px) scale(.96)` opacity .9 · `translateY(20px) scale(.92)` opacity .7 | sama |
| Stempel | atas 20, padding `6px 12px`, radius 10, ring dalam 2.5 px warna teks. Ya: kiri 20, hijau, −8°. Tidak: kanan 20, merah, +8°. Lihat solusi: bawah 20 tengah, ungu | sama |
| Penanda atas "Solusi" | atas −74, tengah, padding `8px 16px`, ikon panah atas 34 ungu | atas −64 |
| Penanda kiri "Tidak" / kanan "Ya" | tengah vertikal, kiri/kanan −92, ikon 26 (merah diputar 180° / hijau) | bawah 22, kiri/kanan −50, padding `6px 7px`, ikon 22 |
| Bentuk penanda | pil radius 16, padding `8px 10px`, putih .94, shadow `0 10px 20px -12px rgba(11,15,58,.7)`, teks 12/700 navy, tidak bisa diklik | sama |
| Animasi penanda | panah bergeser 5 px setiap 1.6 s (mati saat reduced motion) | sama |
| Kertas bidang usaha `.sheet` | padding 20, radius 8, `#FFFDF7`, rotasi 1°, gap 14, 6 tombol grid 3 kolom gap 8 | sama |
| Tombol bidang usaha | padding `12px 6px`, radius 14, `#F1EEF9`, hover `#EDE3FF`, ikon 22 ungu, teks 13/700 | sama |
| Progres | kanan atas (`nav + 26px`), teks 13/600 on-night, bar 110×5 radius 5, isi gradien `#8C2BFA → #35EAFE` | kiri gutter, atas `nav + 68px` |

### 11.2 Ukuran terukur

**Desktop**

| Elemen | 1920×1080 | 1440×900 | 1280×800 |
|---|---|---|---|
| Wadah deck (bidang usaha) | x 770 · 380×324 · y 691.2 | x 530 · 380×324 · y 522 | x 450 · 380×324 · y 428 |
| Kertas bidang usaha | 385.6×330.6 | 385.6×330.6 | 385.6×330.6 |
| Judul kertas | 340.4×30.1 · 22/24.2 700 | 340.4×30.1 · 22/24.2 700 | 340.4×30.1 · 22/24.2 700 |
| Paragraf kertas | 340.7×49.3 · 14/21.7 400 | 340.7×49.3 · 14/21.7 400 | 340.7×49.3 · 14/21.7 400 |
| Tombol bidang usaha | 109.2×74 · 13/20.1 700 | 109.2×74 · 13/20.1 700 | 109.2×74 · 13/20.1 700 |
| Link "Lewati…" | 171.2×25.1 · 13/20.1 600 | 171.2×25.1 · 13/20.1 600 | 171.2×25.1 · 13/20.1 600 |
| Wadah deck (kartu) | x 770 · 380×374.3 · y 640.9 | x 530 · 380×374.3 · y 471.7 | x 450 · 380×374.3 · y 377.7 |
| Deck | 380×320 | 380×320 | 380×320 |
| Kartu teratas | x 770 · 380×320 · y 640.9 | x 530 · 380×320 · y 471.7 | x 450 · 380×320 · y 377.7 |
| Baris "Ronde… / Apakah ini terjadi?" | 336×11 · 11/11 700 | 336×11 · 11/11 700 | 336×11 · 11/11 700 |
| Pertanyaan kartu (h2) | 336×65.1 · 29.6/32.6 700 | 336×65.1 · 29.6/32.6 700 | 336×97.6 · 29.6/32.6 700 |
| Chip tag kartu | 96.4×30.1 · 13/20.1 600 | 96.4×30.1 · 13/20.1 600 | 96.4×30.1 · 13/20.1 600 |
| Stempel | tersembunyi | tersembunyi | tersembunyi |
| Penanda atas "Solusi" | x 926.5 · 66.9×64 · y 566.9 · 12/12 700 | x 686.5 · 66.9×64 · y 397.7 · 12/12 700 | x 606.5 · 66.9×64 · y 303.7 · 12/12 700 |
| Penanda kiri "Tidak" | x 678 · 51.5×56 · y 770.9 · 12/12 700 | x 438 · 51.5×56 · y 601.7 · 12/12 700 | x 358 · 51.5×56 · y 507.7 · 12/12 700 |
| Penanda kanan "Ya" | x 1196 · 46×56 · y 770.9 · 12/12 700 | x 956 · 46×56 · y 601.7 · 12/12 700 | x 876 · 46×56 · y 507.7 · 12/12 700 |
| Petunjuk swipe | 380×40.3 · 13/20.1 600 | 380×40.3 · 13/20.1 600 | 380×40.3 · 13/20.1 600 |
| Progres "Kartu x dari 9" | x 1359.6 · 200.4×20.1 · 13/20.1 600 | x 1119.6 · 200.4×20.1 · 13/20.1 600 | x 1039.6 · 200.4×20.1 · 13/20.1 600 |
| Bar progres | 110×5 | 110×5 | 110×5 |


**Tablet**

| Elemen | 1180×820 | 1024×1366 | 820×1180 | 768×1024 |
|---|---|---|---|---|
| Wadah deck (bidang usaha) | x 400 · 380×324 · y 446.8 | x 322 · 380×324 · y 960.1 | x 220 · 380×324 · y 785.2 | x 194 · 380×324 · y 638.6 |
| Kertas bidang usaha | 385.6×330.6 | 385.6×330.6 | 385.6×330.6 | 385.6×330.6 |
| Judul kertas | 340.4×30.1 · 22/24.2 700 | 340.4×30.1 · 22/24.2 700 | 340.4×30.1 · 22/24.2 700 | 340.4×30.1 · 22/24.2 700 |
| Paragraf kertas | 340.7×49.3 · 14/21.7 400 | 340.7×49.3 · 14/21.7 400 | 340.7×49.3 · 14/21.7 400 | 340.7×49.3 · 14/21.7 400 |
| Tombol bidang usaha | 109.2×74 · 13/20.1 700 | 109.2×74 · 13/20.1 700 | 109.2×74 · 13/20.1 700 | 109.2×74 · 13/20.1 700 |
| Link "Lewati…" | 171.2×25.1 · 13/20.1 600 | 171.2×25.1 · 13/20.1 600 | 171.2×25.1 · 13/20.1 600 | 171.2×25.1 · 13/20.1 600 |
| Wadah deck (kartu) | x 400 · 380×374.3 · y 396.5 | x 322 · 380×374.3 · y 909.8 | x 220 · 380×374.3 · y 734.9 | x 194 · 380×374.3 · y 588.3 |
| Deck | 380×320 | 380×320 | 380×320 | 380×320 |
| Kartu teratas | x 400 · 380×320 · y 396.5 | x 322 · 380×320 · y 909.8 | x 220 · 380×320 · y 734.9 | x 194 · 380×320 · y 588.3 |
| Baris "Ronde… / Apakah ini terjadi?" | 336×11 · 11/11 700 | 336×11 · 11/11 700 | 336×11 · 11/11 700 | 336×11 · 11/11 700 |
| Pertanyaan kartu (h2) | 336×65.1 · 29.6/32.6 700 | 336×65.1 · 29.6/32.6 700 | 336×65.1 · 29.6/32.6 700 | 336×65.1 · 29.6/32.6 700 |
| Chip tag kartu | 96.4×30.1 · 13/20.1 600 | 96.4×30.1 · 13/20.1 600 | 96.4×30.1 · 13/20.1 600 | 96.4×30.1 · 13/20.1 600 |
| Stempel | tersembunyi | tersembunyi | tersembunyi | tersembunyi |
| Penanda atas "Solusi" | x 556.5 · 66.9×64 · y 322.5 · 12/12 700 | x 478.5 · 66.9×64 · y 835.8 · 12/12 700 | x 376.5 · 66.9×64 · y 660.9 · 12/12 700 | x 350.5 · 66.9×64 · y 514.3 · 12/12 700 |
| Penanda kiri "Tidak" | x 308 · 51.5×56 · y 526.5 · 12/12 700 | x 230 · 51.5×56 · y 1039.8 · 12/12 700 | x 128 · 51.5×56 · y 864.9 · 12/12 700 | x 102 · 51.5×56 · y 718.3 · 12/12 700 |
| Penanda kanan "Ya" | x 826 · 46×56 · y 526.5 · 12/12 700 | x 748 · 46×56 · y 1039.8 · 12/12 700 | x 646 · 46×56 · y 864.9 · 12/12 700 | x 620 · 46×56 · y 718.3 · 12/12 700 |
| Petunjuk swipe | 380×40.3 · 13/20.1 600 | 380×40.3 · 13/20.1 600 | 380×40.3 · 13/20.1 600 | 380×40.3 · 13/20.1 600 |
| Progres "Kartu x dari 9" | x 947.6 · 200.4×20.1 · 13/20.1 600 | x 791.6 · 200.4×20.1 · 13/20.1 600 | x 587.6 · 200.4×20.1 · 13/20.1 600 | x 535.6 · 200.4×20.1 · 13/20.1 600 |
| Bar progres | 110×5 | 110×5 | 110×5 | 110×5 |


**HP**

| Elemen | 414×896 | 390×844 | 375×812 | 360×740 |
|---|---|---|---|---|
| Wadah deck (bidang usaha) | x 17 · 380×324 · y 558 | x 16 · 358×348.2 · y 481.8 | x 16 · 343×348.2 · y 449.8 | x 16 · 328×348.2 · y 377.8 |
| Kertas bidang usaha | 385.6×330.6 | 364×354.4 | 349×354.1 | 334×353.8 |
| Judul kertas | 340.4×30.1 · 22/24.2 700 | 318.8×53.9 · 22/24.2 700 | 303.8×53.7 · 22/24.2 700 | 288.8×53.4 · 22/24.2 700 |
| Paragraf kertas | 340.7×49.3 · 14/21.7 400 | 318.7×48.9 · 14/21.7 400 | 303.7×48.7 · 14/21.7 400 | 288.7×48.4 · 14/21.7 400 |
| Tombol bidang usaha | 109.2×74 · 13/20.1 700 | 101.9×73.9 · 13/20.1 700 | 96.9×73.8 · 13/20.1 700 | 91.9×73.7 · 13/20.1 700 |
| Link "Lewati…" | 171.2×25.1 · 13/20.1 600 | 171.2×25.1 · 13/20.1 600 | 171.2×25.1 · 13/20.1 600 | 171.2×25.1 · 13/20.1 600 |
| Wadah deck (kartu) | x 17 · 380×424.3 · y 457.7 | x 16 · 358×424.3 · y 405.7 | x 16 · 343×424.3 · y 373.7 | x 16 · 328×394.7 · y 331.3 |
| Deck | 263×370 | 263×370 | 263×370 | 248×340.4 |
| Kartu teratas | x 75.5 · 263×370 · y 457.7 | x 63.5 · 263×370 · y 405.7 | x 56 · 263×370 · y 373.7 | x 56 · 248×340.4 · y 331.3 |
| Baris "Ronde… / Apakah ini terjadi?" | 219×27 · 11/11 700 | 219×27 · 11/11 700 | 219×27 · 11/11 700 | 204×27 · 11/11 700 |
| Pertanyaan kartu (h2) | 219×51 · 23.2/25.5 700 | 219×51 · 23.2/25.5 700 | 219×51 · 23.2/25.5 700 | 204×76.5 · 23.2/25.5 700 |
| Chip tag kartu | 96.4×30.1 · 13/20.1 600 | 96.4×30.1 · 13/20.1 600 | 96.4×30.1 · 13/20.1 600 | 96.4×30.1 · 13/20.1 600 |
| Stempel | tersembunyi | tersembunyi | tersembunyi | tersembunyi |
| Penanda atas "Solusi" | x 173.5 · 66.9×52 · y 393.7 · 12/12 700 | x 161.5 · 66.9×52 · y 341.7 · 12/12 700 | x 154 · 66.9×52 · y 309.7 · 12/12 700 | x 146.5 · 66.9×52 · y 267.3 · 12/12 700 |
| Penanda kiri "Tidak" | x 25.5 · 45.5×48 · y 757.7 · 12/12 700 | x 13.5 · 45.5×48 · y 705.7 · 12/12 700 | x 6 · 45.5×48 · y 673.7 · 12/12 700 | x 6 · 45.5×48 · y 601.7 · 12/12 700 |
| Penanda kanan "Ya" | x 352.5 · 36×48 · y 757.7 · 12/12 700 | x 340.5 · 36×48 · y 705.7 · 12/12 700 | x 333 · 36×48 · y 673.7 · 12/12 700 | x 318 · 36×48 · y 601.7 · 12/12 700 |
| Petunjuk swipe | 380×40.3 · 13/20.1 600 | 358×40.3 · 13/20.1 600 | 343×40.3 · 13/20.1 600 | 328×40.3 · 13/20.1 600 |
| Progres "Kartu x dari 9" | x 16 · 200.4×20.1 · 13/20.1 600 | x 16 · 200.4×20.1 · 13/20.1 600 | x 16 · 200.4×20.1 · 13/20.1 600 | x 16 · 200.4×20.1 · 13/20.1 600 |
| Bar progres | 110×5 | 110×5 | 110×5 | 110×5 |

---

## 12. Halaman detail dan hasil

| Bagian | Nilai |
|---|---|
| `.page` | latar putih, padding atas `nav-top + nav-h`, bawah `clamp(56px, 8vw, 96px)` |
| Kotak jawaban | max 70ch, padding `20px 22px`, radius 22, `--wash`, garis kiri ungu 3 px (`inset 3px 0 0`) |
| Aside ringkasan | radius 24, `--wash`, padding `20px 20px 6px`, sticky mulai 1000 px. Catatan disamarkan: putih, radius 14, ikon 16 ungu. Tombol video: navy radius 16, ikon cyan |
| Kartu langkah | radius 18, ring 1 px `--line`, padding 16, nomor 40×40 radius 12 `--wash` angka ungu display 800 18 px |
| Tabel banding | radius 18, ring 1 px, min-width 520, sel padding `13px 16px`, kepala `--wash` 12 px uppercase, kolom "Dengan asisten" hijau 600 |
| Tile angka | radius 20, `--wash`, padding 18, angka display 800 2.4rem, satuan ungu 1.05rem |
| FAQ | radius 20, `--wash`, padding `18px 20px` |
| CTA detail | radius 26, navy, padding `clamp(22px, 4vw, 36px)` |
| Halaman hasil | max 760, tengah. Kartu hasil: radius 22, putih, ring 1 px, padding 18, hover ring 1.5 px `rgba(159,14,214,.4)` |

**Desktop**

| Elemen | 1920×1080 | 1440×900 | 1280×800 |
|---|---|---|---|
| Breadcrumb | 1200×69.7 · 14/21.7 400 | 1200×69.7 · 14/21.7 400 | 1200×69.7 · 14/21.7 400 |
| H1 detail | 684.3×211.2 · 64/70.4 700 | 684.3×211.2 · 64/70.4 700 | 684.3×211.2 · 64/70.4 700 |
| Kotak jawaban | 819.8×160.7 | 819.8×160.7 | 819.8×160.7 |
| Pertanyaan di kotak jawaban | 775.8×21.6 · 16/21.6 700 | 775.8×21.6 · 16/21.6 700 | 775.8×21.6 · 16/21.6 700 |
| Jawaban | 775.8×89.1 · 18/29.7 400 | 775.8×89.1 · 18/29.7 400 | 775.8×89.1 · 18/29.7 400 |
| Kolom ringkasan (aside) | x 360 · 300×446.8 | x 120 · 300×446.8 | x 40 · 300×446.8 |
| Kolom isi | x 724 · 836×3033.2 | x 484 · 836×3033.2 | x 404 · 836×3033.2 |
| H2 section | 819.8×40.5 · 36.8/40.5 700 | 819.8×40.5 · 36.8/40.5 700 | 819.8×40.5 · 36.8/40.5 700 |
| Eyebrow section | 819.8×12 · 12/12 700 | 819.8×12 · 12/12 700 | 819.8×12 · 12/12 700 |
| Kartu langkah | 403.9×104.6 | 403.9×104.6 | 403.9×104.6 |
| Tabel banding | 819.8×195.3 | 819.8×195.3 | 819.8×195.3 |
| Tile angka | 265.3×128.9 | 265.3×128.9 | 265.3×128.9 |
| Angka tile | 229.3×38.4 · 38.4/38.4 800 | 229.3×38.4 · 38.4/38.4 800 | 229.3×38.4 · 38.4/38.4 800 |
| Item FAQ | 819.8×89.7 | 819.8×89.7 | 819.8×89.7 |
| Kotak CTA detail | 836×211.5 | 836×211.5 | 836×211.5 |
| Judul CTA detail | 764×38.7 · 35.2/38.7 700 | 764×38.7 · 35.2/38.7 700 | 764×38.7 · 35.2/38.7 700 |
| Halaman hasil (.res) | x 580 · 760×457.2 | x 340 · 760×457.2 | x 260 · 760×457.2 |
| H1 hasil | 696×105.6 · 48/52.8 700 | 696×105.6 · 48/52.8 700 | 696×105.6 · 48/52.8 700 |
| Kotak "belum ada" | 696×92.3 | 696×92.3 | 696×92.3 |


**Tablet**

| Elemen | 1180×820 | 1024×1366 | 820×1180 | 768×1024 |
|---|---|---|---|---|
| Breadcrumb | 1116×68.9 · 14/21.7 400 | 960×62.6 · 14/21.7 400 | 756×54.5 · 14/21.7 400 | 704×52.4 · 14/21.7 400 |
| H1 detail | 630.8×194.7 · 59/64.9 700 | 547.3×168.9 · 51.2/56.3 700 | 438.4×135.3 · 41/45.1 700 | 410.5×126.7 · 38.4/42.2 700 |
| Kotak jawaban | 819.8×160.7 | 819.8×160.7 | 756×190.3 | 704×190.3 |
| Pertanyaan di kotak jawaban | 775.8×21.6 · 16/21.6 700 | 775.8×21.6 · 16/21.6 700 | 712×21.6 · 16/21.6 700 | 660×21.6 · 16/21.6 700 |
| Jawaban | 775.8×89.1 · 18/29.7 400 | 775.8×89.1 · 18/29.7 400 | 712×118.8 · 18/29.7 400 | 660×118.8 · 18/29.7 400 |
| Kolom ringkasan (aside) | x 32 · 300×446.8 | x 32 · 300×446.8 | x 32 · 756×428 | x 32 · 704×428 |
| Kolom isi | x 396 · 752×3041.1 | x 396 · 596×3264.7 | x 32 · 756×2753.6 | x 32 · 704×2823.8 |
| H2 section | 752×38.9 · 35.4/38.9 700 | 596×33.8 · 30.7/33.8 700 | 756×28.1 · 25.6/28.2 700 | 704×28.1 · 25.6/28.2 700 |
| Eyebrow section | 752×12 · 12/12 700 | 596×12 · 12/12 700 | 756×12 · 12/12 700 | 704×12 · 12/12 700 |
| Kartu langkah | 370×127.8 | 292×173.2 | 372×127.8 | 346×149.9 |
| Tabel banding | 752×195.3 | 596×241.8 | 756×195.3 | 704×195.3 |
| Tile angka | 242.7×128.9 | 190.7×128.9 | 244×128.9 | 226.7×128.9 |
| Angka tile | 206.7×38.4 · 38.4/38.4 800 | 154.7×38.4 · 38.4/38.4 800 | 208×38.4 · 38.4/38.4 800 | 190.7×38.4 · 38.4/38.4 800 |
| Item FAQ | 752×89.7 | 596×115.3 | 756×89.7 | 704×115.3 |
| Kotak CTA detail | 752×211.5 | 596×206.6 | 756×193.4 | 704×188.6 |
| Judul CTA detail | 680×38.7 · 35.2/38.7 700 | 524×33.8 · 30.7/33.8 700 | 690.4×27 · 24.6/27.1 700 | 642.6×26.4 · 24/26.4 700 |
| Halaman hasil (.res) | x 210 · 760×455.6 | x 132 · 760×436.7 | x 30 · 760×360.9 | x 4 · 760×354.3 |
| H1 hasil | 696×105.6 · 48/52.8 700 | 696×99.1 · 45.1/49.6 700 | 696×39.7 · 36.1/39.7 700 | 696×37.2 · 33.8/37.2 700 |
| Kotak "belum ada" | 696×92.3 | 696×92.3 | 696×92.3 | 696×92.3 |


**HP**

| Elemen | 414×896 | 390×844 | 375×812 | 360×740 |
|---|---|---|---|---|
| Breadcrumb | 382×45.7 · 14/21.7 400 | 358×45.7 · 14/21.7 400 | 343×45.7 · 14/21.7 400 | 328×45.7 · 14/21.7 400 |
| H1 detail | 359×110.9 · 33.6/37 700 | 358×110.9 · 33.6/37 700 | 343×110.9 · 33.6/37 700 | 328×147.8 · 33.6/37 700 |
| Kotak jawaban | 382×330.7 | 358×330.7 | 343×330.7 | 328×330.7 |
| Pertanyaan di kotak jawaban | 338×43.2 · 16/21.6 700 | 314×43.2 · 16/21.6 700 | 299×43.2 · 16/21.6 700 | 284×43.2 · 16/21.6 700 |
| Jawaban | 338×237.5 · 18/29.7 400 | 314×237.5 · 18/29.7 400 | 299×237.5 · 18/29.7 400 | 284×237.5 · 18/29.7 400 |
| Kolom ringkasan (aside) | x 16 · 382×446.8 | x 16 · 358×446.8 | x 16 · 343×446.8 | x 16 · 328×446.8 |
| Kolom isi | x 16 · 382×4035.7 | x 16 · 358×4220.6 | x 16 · 343×4300.8 | x 16 · 328×4357.6 |
| H2 section | 382×56.3 · 25.6/28.2 700 | 358×56.3 · 25.6/28.2 700 | 343×56.3 · 25.6/28.2 700 | 328×56.3 · 25.6/28.2 700 |
| Eyebrow section | 382×12 · 12/12 700 | 358×12 · 12/12 700 | 343×12 · 12/12 700 | 328×12 · 12/12 700 |
| Kartu langkah | 382×104.6 | 358×126.7 | 343×149.9 | 328×149.9 |
| Tabel banding | 520×265.1 | 520×265.1 | 520×265.1 | 520×265.1 |
| Tile angka | 382×105.7 | 358×105.7 | 343×105.7 | 328×105.7 |
| Angka tile | 346×38.4 · 38.4/38.4 800 | 322×38.4 · 38.4/38.4 800 | 307×38.4 · 38.4/38.4 800 | 292×38.4 · 38.4/38.4 800 |
| Item FAQ | 382×163 | 358×163 | 343×163 | 328×163 |
| Kotak CTA detail | 382×280.4 | 358×280.4 | 343×280.4 | 328×280.4 |
| Judul CTA detail | 338×52.8 · 24/26.4 700 | 314×52.8 · 24/26.4 700 | 299×52.8 · 24/26.4 700 | 284×52.8 · 24/26.4 700 |
| Halaman hasil (.res) | x 0 · 414×470.8 | x 0 · 390×470.8 | x 0 · 375×470.8 | x 0 · 360×470.8 |
| H1 hasil | 382×66.9 · 30.4/33.4 700 | 358×66.9 · 30.4/33.4 700 | 343×66.9 · 30.4/33.4 700 | 328×66.9 · 30.4/33.4 700 |
| Kotak "belum ada" | 382×134.5 | 358×134.5 | 343×134.5 | 328×134.5 |

---

## 13. Footer

| Bagian | Nilai |
|---|---|
| `.foot` | `#0B0F3A`, teks on-night-muted 13 px, padding `24px` (+ safe area bawah) |
| Logo | tinggi 22 (gambar 240×41) |
| Pilihan bahasa | tombol pil padding `4px 8px`, aktif `rgba(255,255,255,.1)` putih |
| Mode fokus | footer disembunyikan |

---

## 14. Animasi dan transisi (visual)

| Nama | Durasi | Easing | Gerak |
|---|---|---|---|
| Kotak etalase hover/fokus | 200 ms | ease-out | `translateY(-6px)`, bayangan kontak mengecil 25% |
| Tombol aktif | 160 ms | ease-out | `scale(.97)` (`.act` .92, `.arr` .94, `.ct` .98) |
| Hero keluar saat mode fokus | 300 ms opacity, 400 ms transform | ease-out | naik 16 px + hilang |
| Kertas struk masuk (desktop) `slipIn` | 520 ms | ease-out | dari `translateY(40px) rotate(-6deg)` opacity 0 |
| Kertas struk masuk (HP) `slipUp` | 520 ms | ease-out | dari `translateY(40px)` opacity 0 |
| Bar hasil masuk `barIn` | 360 ms | ease-out | naik 24 px + muncul |
| Ringkasan muncul `sumIn` | 200 ms | ease-out | margin-top 6 → 0 + muncul |
| Pop up `modalIn` | 260 ms | ease-out | `translateY(12px) scale(.98)` → normal |
| Tag nomor | 200 ms | ease / ease-out | opacity |
| Kartu masalah kembali ke tengah | 380 ms | ease-out | transform + opacity |
| Bar progres | 300 ms | ease-out | lebar |
| Penanda kartu | 1.6 s berulang | ease-out | panah geser 5 px |
| Lampu gantung | terus | sinus | ayun ±.03 rad |

Durasi gerak 3D (kotak terbang, kartu dibagikan, kamera) ada di LOGIKA.

---

## 15. Ikon

Semua ikon dari **Phosphor, weight regular**, digambar sebagai SVG sprite di prototipe. Di repo pakai `@phosphor-icons/react` (sudah dipakai Wildan, biasanya `weight="bold"`; v1 memakai regular).

| Id di prototipe | Komponen Phosphor | Dipakai di |
|---|---|---|
| `i-chat-circle-dots` | `ChatCircleDots` | knob "Konsultasi gratis" |
| `i-search` | `MagnifyingGlass` | knob "Cari solusi" |
| `i-cards` | `Cards` | knob "Kartu masalah" |
| `i-arrow-right` | `ArrowRight` | knob submit, panah rak, "Kembali" (diputar 180°), penanda kiri/kanan, baris kontak, "Lihat detail", solusi terkait |
| `i-arrow-up` | `ArrowUp` | penanda "Solusi" |
| `i-return` | `ArrowCounterClockwise` | "Cari kembali", "Ulangi" |
| `i-caret-down` | `CaretDown` | select filter |
| `i-x` | `X` | tutup pop up, tutup ringkasan, "Kurang cocok" |
| `i-whatsapp-logo` | `WhatsappLogo` | aplikasi, kanal pop up |
| `i-table` | `Table` | Google Sheets |
| `i-instagram-logo` | `InstagramLogo` | Instagram, kanal pop up |
| `i-mail` | `Envelope` | Gmail, kanal email |
| `i-calendar-dots` | `CalendarDots` | Google Calendar |
| `i-folder` | `Folder` | Google Drive |
| `i-storefront`, `i-first-aid`, `i-buildings`, `i-truck`, `i-handshake`, `i-globe-simple` | `Storefront`, `FirstAid`, `Buildings`, `Truck`, `Handshake`, `GlobeSimple` | tombol bidang usaha |
| `i-check-circle` | `CheckCircle` | badge "Sudah berjalan" (detail/hasil), "Cocok untuk" |
| `i-sparkle` | `Sparkle` | badge "Siap dibuat" (detail/hasil) |
| `i-seal-check` | `SealCheck` | catatan disamarkan |
| `i-warn` | `WarningCircle` | daftar masalah |
| `i-check` | `Check` | yang perlu disiapkan |
| `i-play` | `Play` | tonton cara kerja |

Logo Kreatekno: file brand Wildan (`site/public/brand/`), bukan data URI prototipe.

---

## 16. Beda v1 dengan repo dan SOLUSI-SPEC saat ini (visual)

Daftar ini **bukan keputusan**. Ini selisih yang terlihat antara v1 dan isi repo per 4 Nov, untuk diputuskan Heru sebelum integrasi.

| Topik | v1 (prototipe final) | Repo / SOLUSI-SPEC sekarang |
|---|---|---|
| Dinding toko | navy `#131951` | lavender `#EEEAFB` (`world/sets/toko.ts` → `P.wall`) |
| Meja | atas `#CFC5E8`, depan `#C2B8DF`, tanpa trim ungu dan strip cyan | atas `#F7F4FD`, trim ungu, strip cyan, depan navy |
| Etalase | jendela rak di badan meja, satu tier per tim, teks hasil di sampul kotak, tanpa kaca dan legenda | "kaca" dengan judul, jumlah, legenda, label rak di bawah kotak (`Etalase.tsx`, `LabelRak.tsx`) |
| Warna kotak | warna tim pertama (2.3) | warna aplikasi pertama (`APPS[].color`, SOLUSI-SPEC bagian 2) |
| Kotak "Siap dibuat" | padat, dibedakan dengan badge | garis tepi atau transparan (SOLUSI-SPEC bagian 6) |
| Gerak kotak etalase | hanya naik 6 px saat hover | ayun idle + putar saat hover |
| Hero HP | judul di kartu gelap mirip layar TV | "tanpa TV" (SOLUSI-SPEC 4.2) |
| Kasir | bentuk dasar "Raka" (acuan pose dan perilaku) | Heru vinyl dengan celemek (tetap) |
| Kotak etalase | link ke detail | belum bisa diklik, "Detail segera hadir" |
| Font mono | JetBrains Mono | belum ada |
| CTA | pop up WhatsApp / Instagram / Email | `WhatsAppButton` langsung |
