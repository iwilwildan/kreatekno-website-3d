# Kreatekno Website 3D: Plan

_Disusun 31 Okt 2026 dari interview dengan user dan dokumen repo lama. Status: tahap 0–6 selesai (tahap 6 disetujui 7 Nov). Plan induk Solusi ada di [PLAN-SOLUSI.md](PLAN-SOLUSI.md): lingkup etalase disetujui 4 Nov, struktur fondasi detail dan 12 subplan diperbarui 7 Nov; perluasan cerita inline masih draf. Serah-terima antar sesi ada di `HANDOFF.md`._

## 1. Tujuan

Membangun ulang kreatekno.com sebagai website **mobile-first** yang menjelaskan apa yang Kreatekno kerjakan untuk UMKM dan mengubah pengunjung menjadi percakapan "Konsultasi gratis". Bedanya dengan repo lama: story Home tidak lagi memutar footage video dari tim, tapi **dunia 3D Three.js yang dibangun dari kode**, digerakkan scroll, dengan copy HTML yang menempel di permukaan adegan. Dunia yang sama dipakai ulang untuk mode Tonton di halaman Solusi.

## 2. Keputusan

### Dari interview 31 Okt 2026

| Topik | Keputusan |
|---|---|
| Lingkup 3D | Story Home (18 beat) dan Solusi Tonton di Three.js. Artikel, Tentang, Kebijakan Privasi dan Solusi Baca tetap halaman HTML biasa |
| Framework | Next.js (statis) + three vanilla. Engine 3D tidak memakai React; dimuat lazy oleh client component. i18n, SEO, layout dan messages di-port dari `reference/site-nextjs/` |
| Karakter | Dari kode, gaya vinyl toy (SDF + MarchingCubes, rig sendiri), sesuai rencana tahap 3 k0-k2. Tanpa model GLB luar |
| Footage dan keyframe tim | Hanya acuan (kamera, komposisi, cahaya, waktu gerak). Website tidak memutar video |
| Keyframe beat 3–16 | Belum ada dari tim. Kamera dan set dirancang dari dokumen tim + Master Lokasi, lalu direview tim per tahap |
| Repo | GitHub `iwilwildan/kreatekno-website-3d` (remote `origin`, branch `main`), di-push 2 Nov. gh CLI belum terpasang |
| File referensi besar | Disalin ke `refs/`, tidak masuk git |
| Tes HP | PoC atau take k0-k2 sudah dites di HP Android murah user dan lancar. Model HP dan angka FPS belum dicatat |
| Fallback | Kalau 3D tidak sanggup: gambar diam per beat yang dirender dari scene 3D yang sama (WebP) + copy HTML |
| Urutan | Fondasi situs dulu, lalu engine 3D dan Home beat demi beat. **Instruksi user 7 Nov memajukan halaman depan Solusi untuk mulai sekarang**, tanpa mengubah pekerjaan Home yang sedang berjalan. Detail Solusi dan Tonton tetap di tahap terpisah |
| Repo lama | Dibekukan sebagai arsip. Perubahan yang belum di-commit di sana (`SOLUSI.md`, `PORTFOLIO.md`, `prototype/solusi/`) ikut disalin ke sini |
| Target | Tanpa deadline. Kualitas dulu, berhenti untuk review di akhir tiap tahap |

### Dibawa dari repo lama (tetap berlaku)

| Topik | Keputusan | Sumber |
|---|---|---|
| Halaman | Home, Solusi (mengganti Portofolio, 31 Okt), Artikel, Tentang, Kebijakan Privasi | `docs/SITE-BRIEF.md` 6, `docs/SOLUSI.md` |
| Bahasa | Indonesia default (`/`), English di `/en` dengan slug terjemahan | `docs/STACK.md` 4 |
| CTA | "Konsultasi gratis" (WhatsApp click-to-chat), sekunder "Ketemu langsung". Teks yang terlihat tidak menyebut nama platform; hanya title dan meta description SEO yang memuat "WhatsApp" | dokumen tim, `docs/SITE-BRIEF.md` 2 |
| Brand | Logo dan warna sekarang dipertahankan; font Bricolage Grotesque + Plus Jakarta Sans | `assets/brand/README.md` |
| Cerita Home | Dokumen tim "Cerita & Copy Home (one take) · Revisi" (25 Okt): satu take, 18 beat, 19 keyframe, plus K2.1 dan K2.2 yang ditambahkan tim lewat footage 29 Okt | `refs/team/`, `docs/STORY-STAGE.md` |
| Copy di adegan | Desktop: setiap copy adalah props fisik di adegan, ikut cahaya keyframe dan bergerak bersama kamera. HP: kebanyakan copy jadi kartu HTML di pita bawah (35–45% tinggi layar); kicker dan headline hero tetap di billboard, langkah customer journey tetap di panel ruko | `docs/STORY-STAGE.md` 1 |
| Billboard K0 | Kosong di 3D; copy hero berupa HTML | `prototype/k0-k2/HANDOFF.md` |
| Dunia k0-k2 | Satuan meter; origin di tengah pintu COMPANY di permukaan trotoar; x menyusuri jalan, y ke atas, z ke arah jalan. Ruko kanan COMPANY mint, keset kuning, huruf COMPANY Nunito ExtraBold, AO saat load, cahaya sudah disetujui | `prototype/k0-k2/HANDOFF.md` |
| Skala tokoh | Heru 1,8 m; kamera K2 dinaikkan sedikit (opsi c). Tinggi Bu Dewi dikonfirmasi di awal tahap karakter | `prototype/k0-k2/HANDOFF.md` |
| Gerak | Pegas dan redaman sendiri. Gerak utama di-bake saat load lalu disampel dari posisi scroll (bisa diputar mundur); gerak sekunder memakai pegas live | `prototype/k0-k2/HANDOFF.md` |
| Solusi | Etalase v1 (toko 3D dengan kasir Heru, Cari, Kartu masalah) tetap mengacu ke [plan induk](PLAN-SOLUSI.md). Detail dijabarkan dalam fondasi bersama dan 12 subplan. Prototipe detail Order Grup menambah cerita inline; hubungan dengan Tonton lama (overlay, ORB tanpa manusia) belum diputuskan | `docs/SOLUSI.md` 2, `docs/SOLUSI-V1-*.md`, `PLAN-SOLUSI.md` 0 dan 8 |
| CMS | Tidak ada. Copy di file messages, artikel di MDX | `docs/STACK.md` 3 |
| Hosting | Vercel (perlu akun Kreatekno) | `docs/STACK.md` 10 |

## 3. Arsitektur

### 3.1 Situs

```
site/
  app/[locale]/
    page.tsx                    Home: copy dirender di server (SEO), panggung 3D di client
    solusi/page.tsx             katalog + cari          (EN: /en/solutions, usulan)
    solusi/[slug]/page.tsx      detail bersama + cerita opsional per slug (lihat subplan)
    artikel/, tentang/, kebijakan-privasi/
  components/
    layout/                     Header, MobileMenu, LangSwitch, Footer, WhatsAppButton (port)
    home/HomeStage.tsx          wrapper tinggi (±30 layar) + panggung sticky, memuat world secara lazy
    home/props/                 props HTML per beat: Billboard, Leaflet, Binder, ShopPanel, Corkboard,
                                MagazineRack, StickyNotes, Plaque, Chalkboard, PurpleFolder, RoadFooter
    solusi/                     katalog, detail; TontonOverlay lama menunggu keputusan integrasi
  world/                        engine three vanilla (lihat 3.2)
  messages/{id,en}.json         semua copy UI (port dari reference)
  content/                      artikel MDX, data solusi
  public/stills/{pc,hp}/        gambar diam per keyframe yang dirender dari scene kita sendiri
tools/
  camera-solve/                 solver kamera dari keyframe (dari prototype/k0-k2/tools)
  render/                       render stills dan shot review lewat Playwright
```

- Semua halaman dirender statis. Copy Home ada di HTML server, jadi bisa diindeks dan dibaca screen reader walau 3D belum dimuat.
- `world/` dimuat sesuai kebutuhan Home, toko Solusi, dan cerita detail yang disetujui, lewat `import()` setelah HTML tampil. Dunia per detail mengikuti subplan; hubungan dengan overlay Tonton lama dijelaskan di `PLAN-SOLUSI.md` bagian 8.
- GSAP tidak diperlukan untuk panggung 3D (kamera dihitung engine). Lenis dipakai untuk smooth wheel kalau riset tahap 1 tidak menemukan alasan menggantinya.

### 3.2 Engine dunia (`site/world/`)

| Modul | Isi | Asal |
|---|---|---|
| `core/renderer` | WebGLRenderer, batas pixel ratio, render hanya saat ada perubahan, `webglcontextlost`, dispose | `scene.js` k0-k2 |
| `core/kit` | cache material, geometri dasar, `Batch` (merge per material), `canvasTex`, `rng` deterministik | k0-k2 + `solusi/src/tonton/kit.js`, disatukan |
| `core/ao` | bake AO dengan three-mesh-bvh, dipotong per frame | k0-k2 |
| `core/light` | preset cahaya per keyframe, blend sepanjang take, adaptasi eksposur di dalam ruangan | k0-k2 + `KEYFRAMES` di `beats.ts` lama |
| `core/anchors` | permukaan 3D untuk props HTML: posisi, orientasi, ukuran dalam meter, lalu `matrix3d` CSS per frame | baru |
| `core/quality` | pengukur FPS, tingkat kualitas, mode hemat, pindah ke fallback | baru (tanpa detect-gpu) |
| `core/take` | segmen take dalam satuan layar (move + hold), `p` dari scroll, kamera pc/hp, blend menurut aspect | `SEG`, `cameraAt`, `formatT` k0-k2 |
| `sets/*` | set lokasi (lihat 4.1), masing-masing chunk sendiri, dibangun saat kamera mendekat | `scene.js` k0-k2 dipecah |
| `cast/*` | pembangun karakter vinyl, satu file per tokoh, ORB, merpati | tahap karakter |
| `takes/home`, `takes/solusi/*` | titik kamera, cue tokoh dan props per beat | k0-k2, `solusi/takes/order-grup.js` |

- Bahasa: TypeScript strict seperti situsnya. Kode JS prototype di-port bertahap (`allowJs` selama port).
- WebGLRenderer, bukan WebGPURenderer, demi kompatibilitas HP murah. Dicek ulang di riset tahap 2.
- Maksimal dua set hidup bersamaan. Set yang jauh di belakang kamera dilepas dan dibangun ulang kalau pengunjung scroll mundur.

### 3.3 Copy di adegan

- **Desktop:** tiap props punya anchor 3D. Elemen HTML-nya (teks asli, bisa dipilih dan diindeks) ditransformasikan dengan `matrix3d` supaya duduk di permukaan itu dengan perspektif kamera. Lapisan cahaya tipis di atasnya mengikuti preset cahaya keyframe. Props juga punya badan 3D (stand akrilik, binder, papan) supaya terlihat menyatu.
- **HP:** kartu HTML di pita bawah yang tidak ditempel ke 3D, kecuali headline hero di billboard dan panel ruko di beat 5b.
- **Batas:** HTML tidak bisa tertutup objek 3D. Komposisi kamera dijaga supaya tidak ada benda atau tokoh yang lewat di depan copy.
- Posisi awal tiap props diambil dari tabel `docs/STORY-STAGE.md` 3, lalu disesuaikan dengan set 3D.

### 3.4 Loading, kualitas, fallback

| Keadaan | Yang tampil |
|---|---|
| Halaman baru dibuka | Still K0 (WebP, preload, jadi LCP) + hero HTML di billboard. World dimuat di belakang |
| World siap (frame pertama dan AO selesai) | Crossfade dari still ke canvas live |
| Tingkat tinggi | Pixel ratio sampai 2 (desktop) atau 1,5 (HP), AO penuh |
| Mode hemat (otomatis dari FPS, atau dipilih) | Pixel ratio 1, AO kasar, rambut dan hijab versi sederhana, awan dikurangi |
| Fallback (tanpa WebGL2, context lost berulang, FPS tetap rendah di mode hemat) | Still per beat + copy HTML, digerakkan scroll dengan crossfade |
| Reduced motion atau tanpa JavaScript | Versi tumpuk: tiap beat jadi section biasa dengan still-nya |

Still dirender oleh `tools/render` dari scene yang sama di tiap hold keyframe, versi pc dan hp. Still hanya dimuat saat dibutuhkan (kecuali K0).

### 3.5 Anggaran

| Ukuran | Batas |
|---|---|
| LCP mobile (4G, Android menengah) | < 2,5 s |
| JS world pertama (engine + set jalan ruko + set ruang depan COMPANY) | ≤ 350 KB gzip |
| Tiap chunk set berikutnya | ≤ 120 KB gzip |
| Draw call per frame | < 120 |
| Segitiga per frame | < 150 ribu; tiap karakter ±5–15 ribu |
| Lighthouse mobile | ≥ 85 |
| Still fallback | ±60–100 KB per gambar |

### 3.6 Alat dev

- URL: `?hud` (fps, draw call, segitiga, pixel ratio), `?k=K0..K16` (lompat ke keyframe), `?fmt=pc|hp`, `?hemat`, `?shot`, `?noao`, `?zones` (area aman HP). Di window: `__world.setP(p)`, `keyP(i)`.
- `tools/render`: render stills dan shot review per keyframe untuk pc dan hp. Overlay dengan keyframe tim hanya untuk chat.
- `tools/camera-solve`: solver kamera dari keyframe (OpenCV + SciPy), hanya untuk K0 sampai K2.2 yang punya keyframe tim.

## 4. Dunia

### 4.1 Set dan keyframe

Diambil dari dokumen tim (denah, arah kamera per keyframe, master per beat).

| Set | Keyframe | Master | Isi utama |
|---|---|---|---|
| **A. Jalan ruko** | K0, K1, K5a, K5, K9, K10, K11, K15, K16 | 1 (pagi, siang, senja, malam), 2 (+sore), 3–6, 7 (kolase deret), 8 (denah), 9 (siang, sore, malam) | Dari kiri: ruko ujung, COMPANY, 8 ruko (buah, laundry, sepatu, warteg, kosmetik, warnet, warung, elektronik) dengan panel putih di lantai 2, kantor Kreatekno (kaca ungu, pita KREATEKNO, plakat kayu dan lampu kuningan di kiri pintu), ruko ujung. Billboard di atap COMPANY. Jalan dua lajur tanpa pohon, tiang atau kendaraan; sisi seberang tidak pernah masuk frame |
| **B. Ruang depan COMPANY** | K2, K2.1, K2.2, K3, K4, K13, K14 | 11a (+senja), 11b | 4 meja staf melengkung (Sinta, Bayu, Nadia, Fajar), konter kasir oranye sekaligus meja Bu Dewi, rak rim kertas, gulungan banner, rak contoh cetak, printer besar dengan 3 cetakan berbingkai, pintu kayu ke kelas |
| **C. Ruang kelas COMPANY** | K12 | 12 | TV besar di kaki beroda, 4 meja kecil 2 × 2, jendela lebar di kiri, rak map pelatihan |
| **D. Lobi Kreatekno** | K6, K7, K8, K9a | 10a, 10b (+sore) | Dinding gabus menghadap pintu, pojok tunggu (rak majalah, sofa, meja kopi), ruang rapat berdinding kaca di kiri dengan jendela ke taman, meja resepsionis di kanan, cahaya dari fasad kaca |
| **E. Langit** | K0, K10, K16 | 9 | Kubah langit per waktu, awan, matahari, bintang, merpati |

Set A, B (pagi) dan E sudah ada sebagian di `prototype/k0-k2`. Kamera berpindah lokasi hanya lewat pintu, jendela terbuka atau langit (aturan dokumen tim).

### 4.2 Waktu dan cahaya sepanjang take

| Keyframe | Waktu |
|---|---|
| K0–K5 | Pagi, matahari rendah hangat dari kiri (K5a, K5: pagi menjelang siang) |
| K6–K8 | Lobi terang dari fasad kaca; di K8 cahaya sore keemasan hanya lewat jendela ruang rapat |
| K9a, K9 | Golden hour |
| K10, K11, K12 | Sore jingga (hyperlapse di beat 10–11) |
| K13, K14 | Senja, lampu gantung menyala (time-lapse di beat 13) |
| K15, K16 | Malam (hyperlapse di beat 15), langit berbintang, billboard disorot lampu |

Cahaya pada tokoh dan set sama di awal dan akhir satu beat; waktu hanya berubah di beat hyperlapse atau time-lapse, atau bertahap di langit dan jendela latar.

### 4.3 Tokoh

| Tokoh | Muncul | Turnaround |
|---|---|---|
| Heru (Kreatekno) | K1–K9, K13–K14 | `heru.png` |
| Bu Dewi | K2–K9, K13–K14 | `BUK DEWI.png` |
| Sinta, Bayu, Nadia, Fajar | K2–K2.2, K12, K13 | `SINTA.png`, `BAYU.png`, `NADIA.png`, `FAJAR.png` |
| Wildan (pengajar, kemeja ungu, celana putih, lanyard) | K8, K12, K13 | `wildan.png` |
| Andi | K8 | `andi.png` |
| Pelanggan | K13, beat 15 | `CUST 1 WOMEN.png`, `CUST 2 MAN.png` |
| ORB (cahaya cyan, asisten AI) | K13, K15, Solusi Tonton | `ORB.png` |
| Merpati | K0 | - |

Ciri tiap tokoh dan pose di K2 ada di `prototype/k0-k2/HANDOFF.md`.

## 5. Tahapan

_Status: ✅ selesai · 🟡 berjalan · ⬜ belum · ⛔ terhambat._

Setiap tahap dimulai dengan riset dan pertanyaan, dan diakhiri dengan review user (screenshot di chat). Tahap berikutnya baru mulai setelah disetujui.

| # | Tahap | Hasil | Bergantung pada | Status |
|---|---|---|---|---|
| 0 | Repo dan referensi | Folder, git, salinan dokumen, prototype, aset, `PLAN.md`, `CLAUDE.md` | - | ✅ 31 Okt |
| 1 | Fondasi situs | Next.js statis dengan i18n, SEO, layout, semua route sebagai placeholder | 0 | ✅ 31 Okt |
| 2 | Engine 3D + beat 1–2 di situs | Take K0 → K2 dari k0-k2 berjalan di Home, hero di billboard, still K0 sebagai LCP, fallback awal | 1 | ✅ 1 Nov (disetujui user; FPS saat scroll dan kondisi panas tidak dilaporkan) |
| 3 | Karakter vinyl | Heru, Bu Dewi, Sinta, Bayu, Nadia, Fajar, merpati | 2 | ✅ 1 Nov (disetujui user; belum dites di HP) |
| 4 | Animasi beat 1–2 | Heru berjalan dan membuka pintu, aksi staf, burung, kamera K2.1 dan K2.2, inersia kamera | 3 | ✅ 1 Nov (disetujui user; belum dites di HP) |
| 5 | Beat 3–4 | Layanan (leaflet A4 datar di konter) dan Use case (binder terbuka), tampak atas dengan tangan Heru dan Bu Dewi | 4 | ✅ 7 Nov (disetujui user; belum dites di HP Android sungguhan) |
| 6 | Beat 5a–5b | Anggukan Bu Dewi (K4.1), kamera mundur lewat pintu (K4.2), keluar bersama (K5a.1), truck right menyusuri 8 ruko dengan panel customer journey (K5a.2–K5a.5), tiba di pintu Kreatekno (K5a.6) | 5 | ✅ selesai, disetujui 7 Nov |
| 7 | Beat 6–9a | Lobi Kreatekno: dinding gabus, rak majalah, ruang rapat dan sticky note FAQ; Wildan dan Andi | 6 | ⬜ |
| 8 | Beat 9b–11 | Plakat golden hour, naik ke langit, hyperlapse, turun ke pintu COMPANY | 7 | ⬜ |
| 9 | Beat 12–14 | Ruang kelas, praktik saat senja dengan ORB dan pelanggan, papan kapur kecil, CTA map ungu | 8 | ⬜ |
| 10 | Beat 15–16 | Mundur lewat jendela, malam, naik ke langit, footer di jalan gelap | 9 | ⬜ |
| 11 | Pengerasan HP dan fallback | Still semua beat, tingkat kualitas, versi tumpuk, aksesibilitas, tes seluruh take di HP | 10 | ⬜ |
| 12 | Solusi v1 dan detail | Etalase/Cari/Kartu/hasil (S0–S7 di `PLAN-SOLUSI.md`); S6 merujuk fondasi dan 12 subplan detail | 11 | ⬜ etalase disetujui 4 Nov; perluasan detail draf 7 Nov |
| 13 | Solusi: Tonton lama | Rencana overlay pilot `order-grup` dan tiga take lain; hubungan dengan cerita inline diputuskan sebelum T1 | 12 | ⬜ belum mulai; keputusan integrasi terbuka |
| 14 | Halaman lain | Artikel (MDX, 3 artikel awal), Tentang, Kebijakan Privasi | 1, input tim | ⬜ |
| 15 | QA dan tayang | Tes otomatis, audit, analytics, Vercel, domain | semua | ⬜ |

Tahap 14 tidak bergantung pada 3D, jadi bisa dikerjakan kapan saja setelah tahap 1 kalau input tim sudah ada.

### Tahap 1: Fondasi situs

1. Riset: versi terbaru Next.js, next-intl, Tailwind, Lenis, dan perubahan sejak scaffold lama (21 Okt); cara terbaik memuat three vanilla di App Router (client component, `import()` setelah tampil, Turbopack dan `three/addons`).
2. Scaffold `site/` dengan TypeScript strict, ESLint, Prettier.
3. Port dari `reference/site-nextjs/`: `i18n/` (routing, request, navigation), `proxy.ts`, `lib/` (wa, analytics, seo, site, cx), `components/layout/`, `JsonLd`, `styles/globals.css` (token, font), `messages/`, sitemap, robots, gambar OG, not-found, ikon.
4. Route: Home, `/solusi` (mengganti `/portofolio`), `/artikel`, `/tentang`, `/kebijakan-privasi`, plus slug EN. Menu: Portofolio → Solusi.
5. Cek: `next build` statis untuk kedua bahasa, `tsc`, `eslint`, screenshot 375×812 dan 1280×720.
6. Kalau user sudah membuat repo GitHub dan akun Vercel siap: tambah remote dan preview deploy.

**Selesai bila** semua route ter-prerender statis di ID dan EN, header, menu, footer dan tombol Konsultasi gratis berfungsi, dan user menyetujui.

#### Plan tahap 1 (disusun 31 Okt setelah riset, disetujui dan dibangun 31 Okt)

Keputusan dari riset dan jawaban user:

| Topik | Keputusan |
|---|---|
| Versi | next 16.4.3, react/react-dom 19.3.1, next-intl 4.14.9, tailwindcss + `@tailwindcss/turbopack` 4.3.3, typescript 5.x (TS 7 butuh flag eksperimental `useTypeScriptCli`), eslint 9 (cabang maintenance) + eslint-config-next 16.4.3, prettier 3.9.10 + prettier-plugin-tailwindcss 0.8.1, zod 4.6.7, `@vercel/analytics` 2.0.1, `@phosphor-icons/react` 2.1.10 |
| Tidak di-port | GSAP, `@gsap/react`, `components/story/` (versi footage), elkjs |
| Lenis | Ditunda. Tahap 1 memakai scroll native; di tahap 2 dibandingkan dengan damping engine |
| Statis | `cacheComponents` + `partialPrefetching`, plus `ensureStatic = 'navigation'` di layout `[locale]` supaya build gagal kalau ada komponen dinamis |
| i18n | Pola reference tetap (`next/root-params`, tanpa `setRequestLocale`); `opengraph-image` menerima locale eksplisit |
| Slug Solusi | `/solusi` ↔ `/en/solutions` |
| Home | Hero HTML (kicker, headline, CTA) dirender server + wrapper panggung kosong berwarna untuk world di tahap 2 |
| Copy SEO Solusi | Claude membuat draf ID dan EN mengikuti `docs/SITE-BRIEF.md` 2, direview user |

Langkah:

1. Scaffold `site/` (package.json dengan versi di atas, tsconfig strict, ESLint, Prettier, `next.config.ts`, `.env.example`, `.gitignore`).
2. Port `i18n/`, `proxy.ts`, `global.d.ts`, `lib/` (site, wa, analytics, seo, cx), `components/JsonLd`, `components/layout/`, `PagePlaceholder`, `styles/globals.css`, `public/brand/`, ikon, sitemap, robots, OG, not-found, catch-all.
3. Messages: `portfolio` → `solutions`, menu Portofolio → Solusi, draf title/description Solusi; buang kunci story footage yang tidak dipakai.
4. Route: Home (hero + panggung kosong), `/solusi`, `/artikel`, `/tentang`, `/kebijakan-privasi` dan slug EN-nya, semuanya placeholder kecuali Home.
5. Cek: `npm run build` (semua route statis di ID dan EN), `typecheck`, `lint`, `format:check`; preview `site` di 375×812 dan 1280×720; menu HP, pindah bahasa, link Konsultasi gratis, 404.
6. Deploy preview dilewati sampai repo GitHub dan akun Vercel siap.

### Tahap 2: Engine 3D + beat 1–2 di situs

1. Riset: three r18x terbaru dan migration guide sejak 0.186.1, WebGL vs WebGPU di HP murah, CSS3D atau `matrix3d` manual untuk anchor HTML, bake AO di Web Worker atau saat build.
2. Pecah `prototype/k0-k2/src/scene.js` ke modul `world/` (3.2) dan satukan dengan kit Solusi.
3. `HomeStage`: wrapper tinggi, panggung sticky, `p` dari scroll, render saat ada perubahan, resize, blend pc/hp.
4. Anchor props: hero di billboard (desktop), headline di billboard + kartu bawah (HP).
5. Still K0 (pc dan hp) dari `tools/render` sebagai LCP, crossfade ke canvas.
6. Kerangka fallback dan versi tumpuk untuk K0–K2.
7. Pindahkan solver dan tool render ke `tools/`; cek OpenCV dan SciPy di laptop.
8. Cek: render K0, K1, K2 pc dan hp sama dengan `prototype/k0-k2-3d.html`; tidak ada error console; FPS di HP murah user dan HP menengah; Lighthouse mobile pertama.

**Selesai bila** beat 1–2 di situs tampil seperti prototype tahap 2, LCP di bawah 2,5 s, dan user menyetujui setelah tes di HP.

#### Plan tahap 2 (disusun 31 Okt setelah riset, disetujui dan dibangun 31 Okt)

Keputusan dari riset dan jawaban user:

| Topik | Keputusan |
|---|---|
| Versi | three 0.186.1 tetap (r187 mengganti PMREM, cahaya yang disetujui bisa bergeser), @types/three 0.186.0, three-mesh-bvh 0.9.16, ESLint tetap 9 (plugin eslint-config-next belum mendukung 10) |
| Renderer | WebGLRenderer. WebGPURenderer lebih lambat di CPU dan belum didukung banyak GPU HP murah |
| Copy di permukaan | `matrix3d` sendiri dari 4 sudut yang diproyeksikan, dipasang di elemen HTML yang dirender server. Bukan CSS3DRenderer (memindahkan elemen ke containernya sendiri) |
| AO | Di-bake saat build oleh `tools/render`, dikirim sebagai gambar abu-abu kecil per bidang AO. HP tidak menghitung AO |
| Bahasa engine | TypeScript strict langsung saat `scene.js` dipecah |
| Scroll | Native + redaman di engine. Lenis hanya kalau wheel terasa patah-patah saat review |
| Alat | Playwright 1.64.1 (disetujui 31 Okt) di `tools/` untuk still, bake AO dan shot review. OpenCV dipasang di tahap 3 saat kamera K2 dihitung ulang |
| Tes HP | Build produksi di laptop, dibuka dari HP lewat Wi-Fi lokal |
| Lighthouse | Belum dipasang (library baru). Di tahap ini LCP diukur lewat Playwright (PerformanceObserver, CPU dan jaringan diperlambat); Lighthouse atau PageSpeed setelah ada deploy |

Langkah:

1. `site/world/` (TypeScript): `core/` (renderer, kit gabungan k0-k2 + Solusi, light, anchors, quality versi awal: pengukur FPS dan batas pixel ratio, take), `sets/` (A jalan ruko, B ruang depan COMPANY, E langit), `takes/home/` (data.json, segmen K0 → K2), figur abu-abu pengganti Heru seperti prototype. API `mount(host, opts)` → `{ setP, resize, dispose }`, tanpa membaca DOM global.
2. Bake AO: `tools/render` memuat world dengan `?bakeao`, mengambil peta AO tiap bidang, menyimpannya ke `site/public/world/ao/`. Production memuat gambar itu; kalau tidak ada (dev), AO dihitung di browser seperti prototype.
3. `HomeStage`: wrapper setinggi take (4,0 layar), panggung sticky, `p` dari scroll dengan redaman, render hanya saat ada perubahan, berhenti saat panggung tidak terlihat atau tab tersembunyi, resize dan blend pc/hp. World dimuat dengan `import()` setelah halaman tampil.
4. Anchor: wajah billboard → kicker dan headline hero (pc dan hp); di HP body dan tombol tetap kartu di pita bawah. Sebelum world siap, hero memakai posisi % billboard dari `docs/STORY-STAGE.md` supaya tidak melompat saat crossfade.
5. Still K0, K1, K2 pc dan hp (WebP, dari scene sendiri) di `site/public/stills/`. K0 lewat `<picture>` dengan `fetchpriority="high"` sebagai LCP, crossfade ke canvas saat frame pertama siap.
6. Fallback: tanpa WebGL2 atau context lost berulang → still tetap tampil dan berganti per keyframe saat scroll. Reduced motion atau tanpa JavaScript → versi tumpuk K0, K1, K2 dengan still dan copy.
7. Alat dev: `?hud`, `?k=K0|K1|K2`, `?fmt=pc|hp`, `?hemat`, `?noao`, `?shot`; `window.__world`.
8. `tools/`: pindahkan solver (`camera-solve/`) dan render (`render/`, Playwright) dari `prototype/k0-k2/tools/`.
9. Cek: render K0, K1, K2 pc dan hp dibandingkan dengan `prototype/k0-k2-3d.html` (selisih piksel); console bersih; JS world ≤ 350 KB gzip, draw call < 120, segitiga < 150 ribu; LCP terukur; build, typecheck, lint, format; tes FPS di HP Anda lewat Wi-Fi lokal.

### Tahap 3 dan 4: Karakter dan animasi beat 1–2

Mengikuti "Langkah berikutnya: tahap 3" di `prototype/k0-k2/HANDOFF.md`, tapi langsung di `site/world/cast/`:

1. Riset: karakter vinyl dari kode (SDF + MarchingCubes), material clay atau vinyl yang ringan, wajah (mata mengkilap, alis), rig Object3D dan IK dua tulang.
2. Konfirmasi tinggi Bu Dewi dan seberapa jauh kamera K2 dinaikkan; hitung ulang kamera K2 dan ukur errornya.
3. Bangun 6 tokoh + merpati; bandingkan dengan turnaround dari depan, samping, belakang, lalu di K1 dan K2.
4. Tahap 4: gerak utama di-bake dan disampel dari scroll; pegas untuk rambut, hijab, kuncir, lanyard; kamera K2.1 (dolly in + pan kiri ke Sinta dan Bayu) dan K2.2 (whip pan kanan ke Nadia dan Fajar) dari footage; Bu Dewi tetap di konter selama whip pan.

**Selesai bila** beat 1–2 lengkap dengan tokoh dan gerak, dalam anggaran, dan disetujui.

#### Plan tahap 3 (disusun 1 Nov setelah riset dan jawaban user, disetujui dan dibangun 1 Nov)

Keputusan dari riset dan jawaban user:

| Topik | Keputusan |
|---|---|
| Skala | Heru 1,8 m. Bu Dewi 1,60 m, berdiri di lantai kasir kayu yang dinaikkan ±25 cm di balik konter. Staf memakai tinggi realistis yang perbandingannya diambil dari `ALL KARAKTER.png` |
| Kamera K2 | Opsi (c) dihitung ulang dengan solver: Heru 1,8 m dan Bu Dewi di lantai kasir jadi batasan, error dilaporkan. `heruAt` tidak lagi mengecilkan Heru. OpenCV dipasang sebagai `opencv-python-headless` 4.14.0.94 (cabang 4, bukan 5.0 yang baru rilis); SciPy 1.15.3 sudah ada |
| Susunan | Satu `SkinnedMesh` per tokoh dengan bobot kaku per bagian, seperti mainan vinyl bersambungan; sambungan tersembunyi di lengan baju, kerah dan celana. ±20–25 tulang `Bone` (pinggul, 2 tulang belakang, leher, kepala, lengan dan kaki 3 ruas, plus ujung aksesori). Target 2–3 draw call per tokoh |
| Geometri | Badan, lengan, kaki, sepatu dan tangan dari primitif bulat (lathe, kapsul, kotak membulat). Rambut, hijab, tutup kepala dan kuncir dari SDF yang diisi ke `MarchingCubes` resmi three (resolusi ±32–40, mode hemat ±20–24), lalu digabung jadi geometri berindeks. Dibangun saat load |
| Tangan | 4 jari + jempol berupa kapsul pendek yang menyatu ke telapak, tanpa tulang per ruas; beberapa pose tangan tetap (terbuka, menggenggam, menopang dagu, mengetik, menggaruk) |
| Material | `MeshStandardMaterial` (bukan Physical): kulit vinyl agak mengkilap, kain lebih kasar. Satu atlas kanvas per tokoh berisi warna, motif (zigzag Nadia, kotak rompi Sinta dan sarung Bayu, pinggiran tunik Bu Dewi) dan serat kain halus. Wrap lighting lewat `onBeforeCompile` untuk kesan lembut, bisa dimatikan di mode hemat |
| Wajah | Mata hitam mengkilap berupa geometri dengan material sendiri dan titik kilau yang selalu terlihat. Alis, mulut, rona pipi, kumis dan janggut digambar di tekstur kanvas wajah dengan parameter ekspresi. Ekspresi K2 mengikuti footage (cemas atau bingung), turnaround untuk wajah netral |
| Rig dan IK | Tulang `Bone` biasa, pose ditulis di kode. IK dua tulang analitik (hukum cosinus + pole) ditulis sendiri untuk tangan di konter, menopang dagu, menggaruk kepala dan kaki duduk. `CCDIKSolver` tidak dipakai |
| Gerak sekunder | Ujung rambut, hijab, kuncir, lanyard dan tas diberi tulang ujung sekarang. `@pixiv/three-vrm-springbone` 3.5.5 dipasang di tahap 4 (bisa tanpa file VRM, joint dan collider dibuat manual) |
| Merpati | Burung di `sky.ts` dirapikan jadi bentuk dan warna merpati (abu, leher kehijauan, garis sayap gelap), tetap sederhana |
| ARYA, DIMAS, RAKA | Desain lama tim Kreatekno, tidak dibangun |
| Chunk | Kode tokoh di chunk `cast` sendiri (≤ 120 KB gzip), dimuat setelah frame pertama K0; K0 tidak menampilkan tokoh |
| Bayangan dan AO | Tokoh memberi dan menerima bayangan matahari; shadow map tetap diperbarui hanya saat ada perubahan. Tokoh tidak ikut bake AO; set di-bake ulang karena lantai kasir baru |
| Keyframe di git | `prototype/k0-k2/refs-upload/*.webp` dipindah ke `refs/keyframes/` dan commit awal `2cf393c` diubah supaya file itu hilang dari riwayat, saat user minta commit berikutnya, tanpa push |

Langkah:

1. Persiapan: pindahkan `prototype/k0-k2/refs-upload/` ke `refs/keyframes/` (K2 hp) dan `refs/Master Lokasi/` (master 7). Unduh keyframe pc K0, K1, K2 dan hp K0, K1 dari ID Drive yang sudah disetujui (maksimal 3 file per giliran) ke `refs/keyframes/`. Pasang `opencv-python-headless` 4.14.0.94, jalankan solver lama dan pastikan hasilnya sama dengan `data.json`.
2. Skala dan kamera: lantai kasir di `companyFront`, solver K2 pc dan hp dengan batasan Heru 1,8 m dan Bu Dewi 1,60 m + 25 cm, laporkan error per titik, perbarui `data.json`, `heruAt` dan posisi figur.
3. Kerangka `world/cast/`: `rig.ts` (tulang, pose, IK dua tulang), `build.ts` (primitif, SDF ke `MarchingCubes`, bobot kaku, gabung per tokoh), `atlas.ts` (kanvas warna dan motif), `face.ts` (tekstur wajah dan ekspresi), `vinyl.ts` (material dan wrap lighting).
4. Heru (`cast/heru.ts`): render depan, ¾, samping, belakang di latar abu seperti turnaround, berdampingan dengan turnaround, plus di K1 dan K2. **Berhenti untuk review di chat** sebelum tokoh lain dibuat.
5. Bu Dewi, Sinta, Bayu, Nadia, Fajar dengan pembangun yang sama: tiap tokoh dibandingkan dengan turnaround, lalu pose dan ekspresi K2 dari footage (Sinta mengetik di HP dengan notifikasi hijau, Bayu di monitor dengan tumpukan kertas, Nadia menopang dagu di depan laptop, Fajar menggaruk kepala dengan nampan dan tablet, Bu Dewi kedua tangan di konter). Juga dicek di frame akhir footage K2.1 dan K2.2.
6. Merpati di `sky.ts`.
7. Integrasi: ganti figur pengganti, hapus `cast/standIn.ts`, mode hemat (SDF lebih kasar, segmen lebih sedikit, tanpa wrap lighting).
8. Bake AO ulang dan render ulang still K0, K1, K2 pc dan hp.
9. Cek: segitiga per tokoh 5–15 ribu dan total < 150 ribu; draw call < 120 di K1 dan K2 pc/hp; waktu bangun tokoh di profil HP lambat (kalau lebih dari ±50 ms per tokoh, pindah ke Web Worker); chunk `cast` ≤ 120 KB gzip; LCP tidak berubah; overlay K1 dan K2 dengan keyframe (hanya di chat); console bersih; `build`, `typecheck`, `lint`, `format:check`; tes FPS di HP user.

**Selesai bila** Heru, Bu Dewi, Sinta, Bayu, Nadia, Fajar dan merpati mirip turnaround dari depan, samping dan belakang, berpose seperti K2, dalam anggaran, dan disetujui user.

#### Plan tahap 4 (disusun 1 Nov setelah riset dan jawaban user, disetujui dan dibangun 1 Nov)

Keputusan dari riset dan jawaban user:

| Topik | Keputusan |
|---|---|
| Take | K0 jeda 0,9 → crane down 1,0 → K1 jeda 0,3 → masuk 1,2 → K2 jeda 0,3 → dolly in + pan kiri 0,8 → K2.1 tanpa jeda → whip pan 0,7 → K2.2 jeda 0,6 (akhir take sementara). Total 4,0 → 5,8 layar. `KeyName` mendapat `K2.1` dan `K2.2`. **Revisi 1 Nov:** masuk 2,0, total 6,6 layar |
| Gerak dari scroll | Kamera, Heru, pintu dan burung yang keluar frame adalah fungsi murni dari `p` (dihitung tiap frame, otomatis bisa diputar mundur). Tidak memakai `AnimationMixer` |
| Whip pan | Dipicu, bukan disampel. Begitu `p` melewati ambang di segmen K2.1 → K2.2, kamera berputar sendiri ±0,45 s seperti footage; scroll balik melewati ambang memutar balik. Sebelum dan sesudahnya kamera hanya hanyut pelan mengikuti scroll |
| Motion blur | Hanya selama whip (±0,3 s): scene dirender ke target, lalu satu pass blur searah pan yang sebanding kecepatan putar dan sekaligus melakukan tone mapping dan sRGB. Di luar whip render langsung ke layar seperti sekarang. Mati di mode hemat |
| Inersia kamera | Pegas teredam kritis (posisi + kecepatan, solusi tertutup, tidak bergantung FPS) pada `p`, mengganti `shown += (target − shown)·dt·8`. Waktu redam ±0,3 s, disetel saat review (HP sudah punya momentum scroll native). Di K2.1 kecepatan kamera menyambung, tidak berhenti |
| Kamera K2.1, K2.2 | Dihitung dengan solver SciPy dari frame akhir footage `k2 - k2.1` dan `k2.1 - k2.2` (pc dan hp); ruangan tetap, hanya kamera yang dicari; error per titik dilaporkan. Jalur K2 → K2.1 maju melewati atas kepala Heru seperti footage |
| Heru | K1: badan menyerong ke pintu, tangan kiri di gagang batang daun kanan (IK). Masuk: mendorong daun kanan ke dalam dengan satu dorongan, tangan ikut busur pintu lalu lepas, ±4 langkah (stride ±0,7 m), berhenti di posisi K2 menghadap ke dalam. Selama K2 → K2.2 tetap berdiri dekat pintu, napas halus, kepala menoleh ke kiri (Sinta, Bayu) lalu ke kanan (Nadia, Fajar), disampel dari `p`. **Revisi 1 Nov (user):** di K1 Heru menghadap kamera, lalu berbalik dan masuk dengan jam sendiri pada laju alami (lihat log) |
| Gait | Fase langkah dari jarak tempuh, bukan waktu, jadi kaki tidak meluncur saat kecepatan berubah dan berjalan mundur saat scroll naik. Kaki yang menapak dikunci di lantai dengan IK dua tulang (`rig.ik`), pinggul naik-turun dan memutar, lengan berayun berlawanan. Ditulis sendiri |
| Aksi staf | Loop berbasis waktu seperti burung K0: dibatasi 30 fps (20 di hemat), hanya selama ruangan terlihat; mati di `?shot`. Sinta mengetik dengan jempol, layar HP menyala, gelembung chat hijau polos (tanpa logo) muncul dari layar tiap beberapa detik; Bayu mengetik dan sesekali melirik tumpukan slip; Nadia menopang dagu dengan kepala sedikit bergoyang; Fajar menggaruk kepala berulang dengan kepala miring; Bu Dewi tetap di konter (juga selama whip pan), napas dan kepala sedikit mengikuti Heru |
| Wajah | Kedip saja: satu tulang kecil per mata (skala vertikal), kedip acak tiap 3–6 s untuk semua tokoh. Ekspresi tetap seperti tahap 3 |
| Pegas | `@pixiv/three-vrm-springbone` 3.5.5 (disetujui), dipasang versi pas, tanpa file VRM: joint dan collider (bola kepala, kapsul bahu dan dada) dibuat di kode. Dibungkus langkah tetap 60 Hz (maks 4 langkah per frame) karena redamannya per frame; `reset()` + settle untuk `?shot`, still dan lompatan `?k=`. Ikut chunk tokoh (perkiraan +10–15 KB gzip, diukur saat build) |
| Bagian berpegas | Heru: 3 rantai ujung rambut belakang, lanyard + kartu, tas. Nadia: kuncir. Bu Dewi dan Sinta: ujung hijab depan, samping dan belakang (kaku, gerak halus). Fajar tidak punya ujung kain yang menjuntai, jadi tanpa pegas. Tulang ujung ditambah lewat `extraJoints`, bobot mesh SDF dihitung ulang dari posisi vertex (di tahap 3 semuanya masih kaku ke `head`, `chest` atau `spine`) |
| Burung K0 | Terbang ambient tetap di K0. Selama ±35% awal crane down, kawanan ditambah gerak keluar ke kanan atas yang disampel dari `p` seperti footage `k0 - k1`, jadi kembali masuk saat scroll naik |
| Bayangan | Shadow map diperbarui hanya saat Heru atau pintu bergerak, maks 30 Hz. Aksi kecil staf dan pegas tidak memicu update (bayangan sedikit tertinggal, tidak terlihat). Ukuran map tetap 1024 (HP) dan 2048 (desktop) |
| Fallback dan still | Still K2.1 dan K2.2 (pc, hp) ditambah untuk fallback tanpa WebGL. Versi tumpuk tidak berubah (beat 2 tanpa copy) |

Langkah:

1. Persiapan: pasang `@pixiv/three-vrm-springbone@3.5.5` di `site/` (versi pas, cek `npm audit`). Ukur titik ruangan di frame akhir footage K2.1 dan K2.2 (pc dan hp, di scratchpad), tambah solve kamera saja di `tools/camera-solve/`, laporkan error, perbarui `data.json`.
2. Take dan kamera: `timing.ts` (segmen baru, `K2.1`, `K2.2`), `takes/home/index.ts` (jalur K2 → K2.1, hanyut di K2.1, whip, hanyut ke K2.2), keadaan whip berbasis waktu di `world/index.ts`, pegas teredam kritis untuk `p`, `?k=K2.1|K2.2`.
3. Inti gerak: modul `world/motion/` berisi pegas teredam kritis, pembungkus springbone langkah tetap, jam ambient bersama (burung dan staf), gait dari jarak tempuh. Loop ambient 30 fps diperluas dari burung ke ruangan.
4. Heru: pose K1 dengan tangan di gagang, dorong pintu (engsel `street.hinge` ikut tangan), jalan masuk, berhenti, tolehan kepala di K2.x, napas. Lab: `/?lab=heru&walk` untuk melihat siklus jalan dari samping.
5. Staf dan Bu Dewi: aksi loop di atas pose K2 (`poses.ts` jadi pose dasar), gelembung hijau Sinta (sprite kecil, satu draw call), tulang mata dan kedip untuk semua tokoh.
6. Pegas: tulang ujung dan bobot baru untuk Heru, Nadia, Bu Dewi, Sinta; collider; cek tidak ada rambut atau hijab yang menembus bahu saat Heru berjalan.
7. Burung keluar frame saat crane down.
8. Motion blur whip (render target + pass blur, hanya selama whip).
9. Bayangan: update dibatasi seperti di tabel.
10. Still K2.1, K2.2 pc/hp (`tools/render/stills.mjs`), still K1 dirender ulang (pose Heru baru). Bake AO tidak perlu diulang (set tidak berubah).
11. Cek:
    - urutan frame K1 → K2 dan K2 → K2.2 pc/hp berdampingan dengan footage (hanya di chat);
    - kaki yang menapak bergeser < 1 cm di dunia saat scroll maju dan mundur;
    - whip maju dan mundur, scroll cepat dan lambat;
    - FPS di Edge GPU dan profil CPU 4× saat scroll K1 → K2.2 dan saat diam di K2.2;
    - draw call < 120 (pass blur +1), segitiga < 150 ribu, chunk tokoh ≤ 120 KB gzip;
    - console bersih; `build`, `typecheck`, `lint`, `format:check`;
    - tes HP oleh user (FPS saat scroll dan saat diam di K2.2, panas setelah ±1 menit).

**Selesai bila** Heru membuka pintu dan berjalan masuk tanpa kaki meluncur (maju dan mundur), staf bergerak seperti footage, kamera K2.1 dan K2.2 cocok dengan footage dengan whip pan yang terasa cepat, pegas terlihat wajar, dalam anggaran, dan disetujui user.

#### Plan tahap 5 (revisi 2 Nov dari keyframe K3/K4 dan blockout K2.2 → K3, disetujui 2 Nov, sedang dikerjakan)

Versi 1 Nov (arc ke belakang bahu Bu Dewi lalu dolly in, leaflet di stand akrilik, kartu HP di pita bawah) diganti. Acuan baru dari user 2 Nov: keyframe K3 dan K4 pc/hp di `refs/keyframes/` dan blockout `refs/footage/blockout/K2.2 - K3 blockout v3.mp4`. Urutan prioritas: keyframe > blockout > Master 11b > dokumen tim.

Acuan yang terbaca:

| Acuan | Isi |
|---|---|
| Blockout K2.2 → K3 (8 dtk, label dan denah di frame; penanda waktu "Akhir K2.2", "Akhir dolly", "K2.4", "K3") | **0–2 s, dolly lurus + pan kiri:** kamera berjalan di lorong kanan (dilihat dari pintu) ke dekat dinding belakang, naik 1,15 → 1,45 m, menoleh kiri 7° → 102°. **2–4 s, orbit ke bahu kanan Bu Dewi:** lewat belakang konter, di antara Bu Dewi dan dinding belakang, dari kanan ke kirinya; menoleh 129° → 194°, menunduk 0° → 11°, tinggi 1,48 m. **4–5 s, berhenti 1 s (K2.4, over-the-shoulder, menunduk 14°):** Heru meletakkan brosur di konter, Bu Dewi menunduk melihatnya. **5–7,5 s, tilt down + push in di tinggi tetap 1,48 m:** menunduk 15° → 90°, kamera maju melewati bahu kanan Bu Dewi sampai tepat di atas konter; tangan Bu Dewi meraih brosur. **7,5–8 s, diam di K3:** keduanya memegang tepi brosur. Sepanjang take Heru berjalan dari dekat pintu lewat celah tengah ke seberang konter, brosur di tangan kanan; Bu Dewi mengangkat kepala di ±3 s |
| K3 pc | Tampak atas lurus. Leaflet putih ±1,35:1 lanskap, strip ungu tipis dekat tepi atas, memenuhi ±60% lebar dan ±79% tinggi frame. Tangan kanan Heru (kulit lebih gelap) di kiri atas memegang sudut kiri atas; tangan kanan Bu Dewi di kanan bawah memegang sudut kanan bawah. Binder ungu tertutup di tepi kanan atas. Permukaan konter putih keunguan (#f0e6f2) |
| K3 hp | Leaflet potret ±1:1,39, memenuhi ±90% lebar. Tangan Heru dengan manset jas ungu dan kemeja putih di kiri atas, tangan Bu Dewi dengan lengan krem di kanan bawah |
| K4 pc | Binder ungu terbuka di tengah, satu halaman krem: ring perak di kiri, 4 tab di kanan (kuning #fff346, toska #23f5ee, pink #ff9ad8, lila #b986dc), sampul #8442b9 di belakang halaman. Pensil kuning di kiri, pensil pink di kanan. Tangan Heru di kiri atas dan Bu Dewi di kanan bawah, keduanya bertumpu di meja. Permukaan lebih lila (#cfbee1) |
| K4 hp | Binder yang sama terpotong di kiri (ring di tepi kiri), halaman ±80% lebar dan ±64% tinggi frame; tanpa tangan dan pensil |

Di K3/K4 kamera menghadap pintu (menoleh ±182°) dan menunduk 90°, jadi atas frame adalah sisi Heru dan bawah frame sisi Bu Dewi. Tangan di kiri atas adalah tangan kanan Heru, tangan di kanan bawah tangan kanan Bu Dewi. Tulisan leaflet dan binder tegak bagi Bu Dewi dan kamera.

Keputusan (riset dan jawaban user 2 Nov):

| Topik | Keputusan |
|---|---|
| Kamera K2.2 → K3 | Ikut blockout: dolly lurus + pan kiri, orbit di belakang Bu Dewi ke bahu kanannya, melambat di K2.4 saat brosur diletakkan (tanpa copy, bukan jeda penuh), tilt down + push in ke tampak atas. Rig sendiri: posisi dari kurva Catmull-Rom sentripetal melewati titik blockout yang disesuaikan ke ruangan situs; arah dari yaw dan pitch (Euler `YXZ`), bukan `lookAt`, karena `lookAt` tidak stabil saat arah pandang sejajar sumbu up (menunduk 90°). FOV di-blend dari K2.2 ke K3 |
| Kamera K3 → K4 | Tetap tampak atas, truck ke kanan ±35 cm ke arah binder. Heru menarik binder ke tengah dan membukanya; leaflet keluar frame di kiri |
| Kamera K3, K4 | Tanpa solver: bidang datar tanpa titik ruangan, jadi jarak dan FOV saling menggantikan. Sudut kertas diukur di keyframe (skrip kecil di scratchpad), lalu tinggi dihitung dari FOV: jarak = tinggi frame / (2·tan(FOV/2)). Contoh pc: A4 lanskap 21 cm = 79% tinggi frame, jadi frame 26,6 cm; dengan FOV K2.2 (34°) kamera ±0,44 m di atas konter, ±1,44 m dari lantai, dekat 1,48 m di blockout. HP: FOV dipersempit ke ±45° vertikal selama tilt (74° dari K2.2 terlalu cembung untuk tampak atas), tingginya menyesuaikan. Roll 0. `tools/camera-solve` tidak dipakai di tahap ini |
| Durasi | K2.2 → K3 2,0 layar (dolly 0,5, orbit 0,5, melambat di K2.4 0,3, tilt + push 0,7) + jeda K3 1,2; K3 → K4 0,6 + jeda K4 1,5. Take 6,6 → 11,9 layar. `KeyName` mendapat `K2.4`, `K3`, `K4` (`K2.4` titik sambungan seperti `K2.1`) |
| Heru | Jam sendiri seperti beat 1 (laju alami, dikejar pegas kritis dari scroll, bisa diputar mundur). Dari posisi K2 berjalan lewat celah tengah (antara meja Bayu dan Nadia) ke seberang konter, brosur di tangan kanan (menempel ke tulang tangan), meletakkannya datar di konter (IK), tangan tetap memegang sudut kiri atas. Beat 4: tangan kanan menggeser brosur ke kiri keluar frame, kedua tangan menarik binder ke tengah dan membuka sampulnya, lalu tangan kanan bertumpu di kiri atas seperti K4. Wajah Heru tidak terlihat di K3/K4 |
| Bu Dewi | Mengangkat kepala saat Heru mendekat, menunduk melihat brosur, tangan kanan meraih dan memegang sudut kanan bawah (IK), lalu bertumpu di kanan bawah di K4. Ekspresi bergeser dari prihatin (K2) ke tertarik saat brosur diletakkan (terlihat selama orbit). Anggukan dari dokumen tim tidak dipakai karena kamera tampak atas |
| Tangan close-up | Tangan detail untuk tampak atas: SDF + `MarchingCubes` (telapak, 4 jari dengan buku jari, jempol, kuku lebih terang di atlas), manset jas ungu + kemeja putih Heru, lengan krem Bu Dewi; ±3–5 ribu segitiga per tangan. Menggantikan tangan biasa hanya saat kamera menunduk lebih dari ±60°. Pose jari tetap (memegang tepi, bertumpu) |
| Properti | **Leaflet** A4 (29,7 × 21 cm) putih dengan strip ungu tipis dekat tepi atas: lanskap di langkah layout 0–2, potret di 3–4, mengikuti keyframe pc dan hp. **Binder** ring tebal (`refs/Properti/Binder tebal.png`): sampul ungu, 4 ring perak, tumpukan halaman krem, 4 tab warna keyframe di tepi kanan; saat dibuka sampul depan berputar ke bawah binder, jadi yang tampil satu halaman bertab; halaman sedikit melengkung dekat ring. **Pensil** kuning dan pink (heksagonal, ujung kayu dan grafit) di konter sejak K2. Binder tertutup ada di konter sejak K2. Stand akrilik dihapus |
| Set | Printer format besar + 3 cetakan berbingkai di dinding kanan (dilihat dari pintu, Master 11b); jalur dolly lewat di dekatnya, jadi jaraknya dicek di sketsa. Permukaan konter tetap #fbf7f8; nuansa lila keyframe dari preset cahaya close-up. Kalau tidak cukup, alas meja lila di bawah binder diputuskan saat review sketsa. Bake AO ulang |
| Cahaya | Preset close-up K3/K4: lembut dan merata dari atas, bayangan tangan pendek dan lunak seperti keyframe; di-blend dari preset ruangan pagi selama tilt down. Bayangan tangan di kertas dari shadow map kalau cukup halus; kalau tidak, bayangan kontak lembut (decal) di bawah tangan |
| Copy desktop | HTML asli lewat anchor `matrix3d` di wajah leaflet dan halaman binder. Saat jeda kamera tegak lurus ke kertas, jadi transform hampir 2D; kotak diberi ukuran tampilan saat jeda supaya teks tajam. Leaflet: H2 "Empat cara kami membantu usaha Anda" di bawah strip ungu dan di kanan jari Heru, 4 kolom layanan (judul + isi, label "E-course segera hadir" di panel 4). Binder, semua di satu halaman: H2, intro, 4 tab industri di tab berwarna (tombol tab ARIA, teks tegak di tab, klik dan panah keyboard, port dari `reference/site-nextjs/components/story/Binder.tsx`), 4 contoh tab aktif, tombol Konsultasi gratis dan teks di bawahnya |
| Copy HP | Juga di kertas, tanpa kartu pita bawah: di keyframe hp kertas memenuhi layar (leaflet ±336 × 570 px, halaman binder ±300 × 520 px di 375 × 812). Leaflet: H2 + 4 layanan bertumpuk. Binder: H2, contoh tab aktif, tombol. Tab di keyframe hanya ±22 px lebar, jadi area sentuhnya diperluas ke luar halaman sampai ≥ 44 px (WCAG 2.2 AA minimal 24 px). Kalau tidak muat di layar 360 px, contoh digeser dengan scroll-snap seperti plan lama |
| Tangan dan copy | HTML tidak bisa tertutup objek 3D. Tata letak copy menghindari sudut kiri atas (jari Heru) dan kanan bawah (jari Bu Dewi) dengan margin dari posisi tangan saat jeda. Selama gerak, `clip-path: polygon()` sederhana (≤ 8 titik, dari kotak tangan yang diproyeksikan) memotong teks di bawah jari. Copy muncul setelah tangan diam di jeda dan mulai pergi saat gerak berikutnya mulai |
| Staf | Aksi loop dan awan mendung tetap berjalan selama dolly dan orbit (terlihat dari samping dan belakang). Loop ambient berhenti saat kamera tampak atas karena ruangan tidak terlihat |
| Halaman | Placeholder `#layanan` diganti: link menu Layanan melompat ke jeda K3. Versi tumpuk (reduced motion, tanpa JS) mendapat section Layanan dan Use case dengan still K3/K4. Fallback still mendapat K3 dan K4 |
| Anggaran | Draw call < 120 dan segitiga < 150 ribu di setiap titik. Titik terberat adalah orbit (ruangan, 6 tokoh, properti). Di K3/K4 sebagian besar ruangan di luar frustum; tambahannya 2 tangan close-up (±10 ribu), leaflet, binder (±4–6 ribu) dan pensil. Tangan close-up ikut chunk tokoh (≤ 120 KB gzip); still K3/K4 ±60–100 KB |

Catatan untuk tim (dokumen beat 3–4 perlu diperbarui): leaflet A4 datar di konter tanpa stand akrilik, K3/K4 tampak atas dengan tangan Heru dan Bu Dewi, titik K2.4, tanpa anggukan, gerak K3 → K4 (truck kanan) belum ada blockout-nya dan dirancang di sini.

Langkah:

1. Ukur dan sketsa:
   - ukur sudut kertas dan posisi tangan di keyframe K3/K4 (skrip di scratchpad);
   - petakan titik jalur blockout ke ruangan situs: lorong kanan, belakang konter, jarak ke printer, dinding belakang dan kepala Bu Dewi;
   - greybox kamera K2.4, K3, K4 pc/hp dengan kotak pengganti leaflet, binder, pensil dan tangan, plus area copy dan zona tangan;
   - urutan frame K2.2 → K3 berdampingan dengan blockout.

   **Berhenti untuk review di chat.**
2. Set dan properti: printer + 3 bingkai, leaflet (lanskap atau potret per layout), binder bertab yang bisa dibuka, pensil; bake AO ulang.
3. Tangan close-up Heru dan Bu Dewi, dibandingkan dengan keyframe (hanya di chat).
4. Gerak:
   - take dan kamera: `timing.ts`, rig yaw/pitch, titik K2.4/K3/K4, `?k=K2.4|K3|K4`;
   - Heru berjalan ke konter, brosur, binder dan pensil;
   - Bu Dewi: kepala, tangan, ekspresi;
   - cahaya close-up.
5. Copy desktop dan HP: komponen Leaflet dan Binder, anchor baru, clip-path tangan, timing masuk dan keluar.
6. Halaman: `#layanan` ke K3, versi tumpuk, still K3/K4 pc/hp, fallback.
7. Cek:
   - render jeda K3/K4 pc (1280×720) dan hp (375×812 dan 360×640) berdampingan dengan keyframe (hanya di chat);
   - urutan frame K2.2 → K3 berdampingan dengan blockout;
   - scroll maju dan mundur;
   - teks tajam saat jeda, tidak ada teks tertutup jari;
   - tab binder dengan mouse, keyboard dan sentuhan;
   - anggaran: draw call, segitiga, chunk;
   - console bersih;
   - `build`, `typecheck`, `lint`, `format:check`.

**Selesai bila** jalur kamera mengikuti blockout, K3 dan K4 cocok dengan keyframe pc dan hp, copy tajam dan bisa dibaca serta diklik di desktop dan HP, dalam anggaran, dan disetujui user.

#### Plan tahap 6 (disusun 7 Nov dari 8 video tim dan jawaban user, plan disetujui 7 Nov, tahap disetujui 7 Nov)

Acuan: 8 video 16:9 di `refs/footage/tahap6/` (belum ada versi 9:16), Master 1, 2 dan 7, dokumen tim beat 4–5b. Urutan prioritas: keyframe K4 > video > Master > dokumen tim.

**Arah video.** Tujuh nama file berarti "akhir - awal"; hanya `k5a.5 - k5a.6` yang "awal - akhir". Dicek dengan mencocokkan frame akhir dan frame awal video berikutnya (selisih piksel rata-rata 1,4–14, urutan terbalik 31–79). Urutan kontinu:

| Gerak | File | Durasi | Kamera | Isi |
|---|---|---|---|---|
| K4 → K4.1 | `k41 -k4` (1920×1080, 30 fps) | 6,1 s | Dari tampak atas binder kamera naik sambil berputar 180° (gambar berputar searah jarum jam, ±0–3 s), lalu tilt up ke over-the-shoulder di belakang Heru (Heru di tepi kanan, membelakangi kamera). Berhenti | Bu Dewi berdiri di balik konter, kedua tangan di konter, tersenyum lalu mengangguk dengan mata terpejam (±5,5 s). Binder terbuka di tengah konter, leaflet di kanan (dari sisi Heru), rak rim kertas dan pintu kayu kelas di belakangnya. Cahaya pagi hangat ruangan, berkas sinar di lantai |
| K4.1 → K4.2 | `k4.2-k4.1` | 3 s | Dolly mundur lurus dari konter lewat lorong tengah, menembus pintu kaca yang terbuka (±1,0–1,5 s, sangat cepat), terus mundur sampai frontal ke fasad. Berhenti | Heru dan Bu Dewi tetap di konter. Daun pintu menutup setelah kamera lewat. K4.2: fasad COMPANY frontal setinggi mata, pintu tertutup di tengah, kanopi, jendela kiri, pilar mint ruko buah di kanan, papan COMPANY terpotong di atas. Cahaya luar lebih terang dan netral dari K1 |
| K4.2 → K5a.1 | `k5a.1 - k4.2` | 3 s | Dolly out dan sedikit naik, makin lebar. Berhenti | Bayangan Heru dan Bu Dewi di balik kaca buram (±0,5 s), pintu terbuka (±1 s), keduanya keluar. K5a.1: COMPANY di kiri, ruko buah dengan panel putih di kanan, rangka billboard di kiri atas, jalan di bawah; Heru di kiri menahan daun pintu, Bu Dewi di kanan |
| K5a.1 → K5a.2 | `k5a.2 - k5a.1` | 3 s | Truck right dari diam, makin cepat | Keduanya berjalan ke kanan berdampingan. K5a.2: panel ruko buah dan laundry |
| K5a.2 → K5a.3 | `k5a.3 - k5a.2` | 3 s | Truck right rata (±0,3 lebar frame per detik), tidak berhenti | K5a.3: panel sepatu dan warteg |
| K5a.3 → K5a.4 | `k5a.4 - k5a.3` | 3 s | Sama | K5a.4: panel kosmetik dan warnet. Heru dan Bu Dewi bertukar posisi seperti saling menembus (cacat video, tidak diikuti) |
| K5a.4 → K5a.5 | `k5a.5 - k5a.4` | 3 s | Sama | K5a.5: panel warung dan elektronik, tepi kantor Kreatekno di kanan |
| K5a.5 → K5a.6 | `k5a.5 - k5a.6` | 3 s | Truck right melambat sampai berhenti | Heru mendahului, membuka pintu kaca Kreatekno dan berdiri di baliknya; Bu Dewi berjalan ke pintu. K5a.6: kantor Kreatekno (kaca ungu dua lantai, pita KREATEKNO, plakat kayu kosong dan lampu kuningan di kiri pintu), ruko elektronik di tepi kiri, ruko ujung abu-biru muda dengan balkon di kanan |

Deret ruko di video sama dengan Master 7: buah (mint), laundry (krem), sepatu (pink), warteg (cyan muda), kosmetik (hijau), warnet (biru), warung (krem pucat), elektronik (mint toska), Kreatekno (ungu), ruko ujung (abu-biru). Tiap ruko ±7 m, sama dengan ruko buah dan laundry di situs (Master 7: ruko 0,62 × lebar COMPANY 11,6 m). Jadi dari COMPANY ke pintu Kreatekno ±60 m.

**Selisih dengan acuan lain:**

- Dokumen tim tidak punya K4.1, K4.2, K5a.1–K5a.6. K5a.6 setara K5 dokumen tim (beat 6 mulai dari sini). Di K5 dokumen tim panel elektronik (CTA) ada di kiri frame; di video panel itu sudah hampir keluar frame di K5a.6 dan terbaca di K5a.5. Ikut video.
- Dokumen tim: Heru dan Bu Dewi keluar bersama kamera. Video: kamera keluar sendiri dulu (K4.2), keduanya menyusul (K5a.1). Ikut video.
- Anggukan Bu Dewi (dokumen tim beat 4) yang tidak dipakai di tahap 5 sekarang ada di K4.1.
- Master 2 menaruh ruko pink di kiri Kreatekno; video dan Master 7 menaruh ruko elektronik. Ikut video.
- Video K4 memakai 4 alat tulis dan tanpa tangan; situs tetap mengikuti keyframe K4 (pensil kuning dan pink, tangan Heru dan Bu Dewi).
- STORY-STAGE (pertanyaan 2 untuk tim): video bergerak rata, web perlu jeda baca. Jawaban di bawah: hanyut pelan.

Keputusan (jawaban user 7 Nov):

| Topik | Keputusan |
|---|---|
| Keyframe | `KeyName` mendapat `K4.1`, `K4.2`, `K5a.1`–`K5a.6`. Semua dari frame akhir video (pc); HP dirancang sendiri karena belum ada video 9:16 |
| Durasi (±8 layar, take 11,9 → ±19,9) | K4 → K4.1 1,0; jeda K4.1 0,3; K4.1 → K4.2 0,6; K4.2 → K5a.1 0,7 (K4.2 titik lewat yang melambat, tanpa jeda); jeda K5a.1 0,2; lima gerak truck 0,5; empat jeda hanyut di K5a.2–K5a.5 0,6; jeda K5a.6 0,3. Total 8,0. Disetel di review greybox |
| Kamera K4 → K4.1 | Rig yaw/pitch tahap 5: dari tampak atas (yaw ±182°, pitch 90°) kamera naik sambil yaw berputar 180° dengan pitch tetap 90° (gambar berputar seperti video), lalu pitch naik ke ±15° menunduk sambil bergerak ke belakang kiri Heru. FOV di-blend. Copy binder memudar saat kamera mulai bergerak (aturan tahap 5) |
| Kamera K4.1 → K4.2 | Dolly mundur lurus lewat celah tengah dan pintu, lalu ke trotoar. FOV menyempit dari ruangan ke lensa panjang K4.2; diinterpolasi lewat tinggi frustum di bidang fasad (FOV dihitung dari jarak tiap frame), bukan FOV langsung, supaya tidak terasa zoom. Near plane dan daun pintu dicek supaya kamera tidak menembus kusen |
| Kamera K4.2, K5a.1 dan truck | Diukur dari frame akhir video dengan `tools/camera-solve` (fasad COMPANY, pintu, kanopi dan panel ruko punya ukuran yang diketahui). Truck: kamera frontal sejajar fasad (tanpa pan), tinggi dan FOV tetap, x bergerak; panel di layar tidak berubah ukuran, jadi copy tetap 1:1 |
| Ritme truck | **Revisi 7 Nov (user):** kamera berhenti diam di K5a.2–K5a.5 (dulu hanyut pelan ±15–20%); tiap gerak antar jeda mulai dan berhenti halus. Tokoh berjalan dengan jam yang mengejar scroll maju dan mundur (paling cepat 1,5×), dipindah langsung hanya saat di luar layar |
| Jeda tanpa copy | Jeda pendek di K4.1 (anggukan) dan K5a.1 (keluar pintu); K4.2 hanya melambat lalu lanjut |
| Pintu COMPANY | Ikut video: daun pintu menutup sendiri setelah kamera keluar (di situs sekarang tetap terbuka 83° sejak beat 1), lalu ditarik ke dalam oleh Heru di K4.2 → K5a.1 dan ditahan sampai Bu Dewi keluar, menutup lagi setelah keduanya lewat |
| Tokoh | K4.1: Heru berdiri di konter membelakangi kamera, Bu Dewi tersenyum dan mengangguk (kepala + kelopak). Tangan close-up K4 berganti ke tangan biasa saat pitch < 60° (mekanisme tahap 5), tangan tetap di konter. K4.2 → K5a.1: keduanya berjalan dari konter ke pintu di luar frame, keluar. Truck: berdampingan tanpa bertukar, Heru di kiri, Bu Dewi di kanan; di K5a.5 → K5a.6 (panel kosong dan CTA) Heru mempercepat langkah lewat sisi jalan, sampai di pintu Kreatekno, membukanya dan berdiri di baliknya; Bu Dewi berjalan ke pintu |
| Langkah | Campuran: gait dari jarak tempuh (kaki menapak tanpa meluncur) sampai ±2,5 m/s jalan cepat (revisi review greybox 7 Nov, sebelumnya ±1,8); di atas itu irama langkah tetap di batas dan kaki sedikit meluncur (hanya saat scroll cepat). Posisi tokoh dari scroll lewat pegas kritis seperti kamera. Bu Dewi mendapat siklus jalan sendiri (`cast/walk.ts` dibuat umum), hijab dengan pegas tahap 4 |
| Cahaya | Preset luar baru "pagi menjelang siang": matahari lebih tinggi dan lebih netral, tetap dari kiri, langit biru dengan awan low-poly (Master 7). Di-blend saat kamera melewati pintu di K4.1 → K4.2 (luar tidak terlihat sejak K2). Ruangan di K4.1 tetap cahaya pagi tahap 5. Bayangan matahari: kamera bayangan ikut x kamera dengan snapping per texel supaya tidak bergetar |
| Set | Set A diperpanjang ±80 m: 8 ruko dua lantai (pilar, lis, panel putih lantai 2, bagian depan terbuka dengan isi toko sederhana: peti buah, rak baju dan mesin cuci, rak sepatu, etalase lauk dan bangku, rak kosmetik, meja PC, gantungan dan rak jajanan, rak elektronik), kantor Kreatekno (fasad kaca ungu, pita KREATEKNO dari glyph seperti huruf COMPANY, pintu kaca yang bisa dibuka, plakat kosong untuk beat 9b, lampu kuningan, lobi terang samar di balik kaca), ruko ujung, trotoar, kerb dan jalan. Ruko buah dan laundry yang sudah ada dibangun ulang dengan detail yang sama. Lobi dalam dibangun di tahap 7 |
| Chunk dan memori | Deret ruko di chunk `sets/row` sendiri (≤ 120 KB gzip), dibangun saat kamera mendekati K4.1. Geometri digabung per ruko (bukan satu mesh untuk seluruh deret) supaya frustum culling tetap jalan. Maksimal dua set hidup: ruang depan COMPANY dilepas setelah K5a.2 dan dibangun ulang saat scroll mundur. AO di-bake per ruko |
| Copy | Selalu terlihat seperti cetakan di panel, HTML asli lewat anchor `matrix3d` di tiap panel: buah = kicker "Cara kerja" + H2, laundry/sepatu/warteg/kosmetik = langkah 1–4 (nomor, judul, isi, dari `home.journey`), warnet dan warung kosong, elektronik = tombol "Konsultasi gratis" (link WhatsApp) dengan panah ke pintu Kreatekno. Elemen di luar layar disembunyikan (`visibility: hidden`) supaya tidak bisa di-tab saat tidak terlihat |
| HP | Satu panel per jeda: tiap jeda hanyut pc dibagi dua di HP (panel kiri, geser pendek, panel kanan), panel kosong dilewati; linimasa scroll sama dengan pc. Kamera HP dirancang sendiri: K4.1 Bu Dewi di tengah dengan kepala Heru di bawah, K4.2 pintu dan kanopi, K5a.1 pintu dengan kedua tokoh, truck dengan panel ±84% lebar layar. Kalau langkah 2 tidak muat di panel 360 px, panel di layout HP dibuat lebih tinggi (diputuskan di greybox) |
| Halaman | `#cara-kerja` jadi penanda lompat di tengah jeda K5a.2 (section placeholder di `page.tsx` dihapus). Versi tumpuk: section Cara kerja dengan still dan langkah. Still pc K4.1, K5a.1, K5a.2–K5a.6 dan HP per panel; fallback tanpa WebGL dengan copy di still lewat `quadMatrix3d` seperti K3/K4 |
| Anggaran | Draw call < 120 dan segitiga < 150 ribu di setiap titik. Titik terberat diperkirakan K4.1 → K4.2 saat ruangan dan jalan sama-sama terlihat lewat pintu, dan frame truck dengan ±3 ruko berisi barang + 2 tokoh |

Catatan untuk tim: tambahkan K4.1, K4.2, K5a.1–K5a.6 ke dokumen (K5a.6 = K5), urutan keluar (kamera dulu, tokoh menyusul), anggukan pindah ke K4.1, panel CTA terbaca di K5a.5; versi 9:16 untuk beat 5a–5b belum ada; di video Heru dan Bu Dewi saling menembus di K5a.3 → K5a.4.

Langkah:

1. Ukur dan sketsa greybox:
   - solve kamera K4.2, K5a.1 dan satu frame truck (K5a.3) dari video; ukur K4.1 terhadap konter dan Bu Dewi;
   - deret ruko berupa kotak berwarna dengan panel putih dan kotak area copy, kantor Kreatekno dan ruko ujung sebagai kotak;
   - jalur kamera K4 → K5a.6 pc dan HP, posisi tokoh sementara;
   - urutan frame berdampingan dengan video (hanya di chat), K4.1–K5a.6 pc dan HP, cek teks HP di panel 360 px.

   **Berhenti untuk review di chat.**
2. Set: 8 ruko dengan isi toko, kantor Kreatekno, ruko ujung, jalan panjang, chunk `sets/row`, pelepasan set, bayangan yang ikut kamera, bake AO. **Review di chat.**
3. Gerak dan cahaya: `timing.ts`, kamera (putar, dolly lewat pintu, dolly out, truck dengan hanyut), pintu COMPANY dan Kreatekno, anggukan Bu Dewi, keluar pintu, jalan berdampingan dengan langkah campuran, Heru menyalip dan membuka pintu, preset luar. **Review di chat** (urutan frame dan video scroll).
4. Copy dan halaman: komponen panel journey ID/EN, anchor, CTA, HP satu panel per jeda, `#cara-kerja`, versi tumpuk, still dan fallback. **Review di chat.**
5. Cek:
   - jeda dan titik lewat pc (1280×720) dan HP (375×812, 360×640) berdampingan dengan frame video (hanya di chat);
   - scroll maju dan mundur, cepat dan lambat; kaki meluncur hanya di atas ±1,8 m/s;
   - copy tajam (skala 1,000), tidak tertutup benda, CTA bisa diklik dan di-tab;
   - anggaran draw call, segitiga, chunk; memori setelah set dilepas; FPS dengan CPU 4×;
   - console bersih; `build`, `typecheck`, `lint`, `format:check`;
   - tes di HP Android sungguhan (tertunda sejak tahap 2).

**Selesai bila** urutan K4 → K5a.6 mengikuti video, copy customer journey terbaca di pc dan HP, Heru dan Bu Dewi berjalan tanpa terlihat meluncur pada scroll wajar, dalam anggaran, dan disetujui user.

### Tahap 5 sampai 10: Home beat demi beat

Langkah yang sama di tiap tahap:

1. Baca bagian beat itu di dokumen tim (`refs/team/`), master terkait dan `docs/STORY-STAGE.md`.
2. Riset teknik khusus beat itu (misalnya hyperlapse langit, time-lapse cahaya, kaca ruang rapat).
3. Rancang kamera pc dan hp untuk tiap keyframe baru. Kirim sketsa komposisi (render greybox) di chat untuk disetujui sebelum set dibangun detail.
4. Bangun atau perluas set, props 3D dan anchor copy.
5. Cahaya per keyframe dan transisi waktu.
6. Tokoh dan aksi di beat itu.
7. Layout HP: kartu pita bawah, atau anchor di panel.
8. Still pc dan hp untuk keyframe baru.
9. Cek: hold tiap keyframe di 1280×720 dan 375×812, scroll maju dan mundur, anggaran, error console.

Catatan per tahap:

- **5 (beat 3–4):** dolly, orbit ke bahu kanan Bu Dewi, lalu tilt down ke tampak atas leaflet (blockout K2.2 → K3), truck kanan ke binder. Tab binder adalah tab industri; copy HP di kertas. Keyframe K3/K4, Master 11b.
- **6 (beat 5a–5b):** set jalan ruko diperluas dengan 8 ruko (Master 3–7, denah Master 8). Panel 1–5 dan 8 membawa copy; panel terakhir menunjuk pintu Kreatekno. Di HP satu panel per layar. Acuan gerak: 8 video tim di `refs/footage/tahap6/` (K4 → K4.1 → K4.2 → K5a.1 → … → K5a.6); plan di "Plan tahap 6" di atas. ±8 layar.
- **7 (beat 6–9a):** set lobi baru (Master 10a, 10b). Ruang rapat berkaca dengan Wildan dan Andi di balik kaca. Cahaya sore hanya lewat jendela ruang rapat. Tokoh Wildan dan Andi dibuat di sini.
- **8 (beat 9b–11):** plakat Tentang kami (Master 2 golden hour), kamera naik ke atas deret ruko (Master 9 sore), matahari turun, turun lagi ke pintu COMPANY yang terbuka (Master 1 jingga). Beat tanpa copy (10, 11) harus tetap menarik saat di-scroll.
- **9 (beat 12–14):** set kelas baru (Master 12), Wildan mengajar. Mundur keluar kelas saat senja (Master 11a senja), ORB merapikan slip menjadi centang, papan kapur kecil di ujung kiri konter, lalu CTA map ungu di stand dokumen.
- **10 (beat 15–16):** mundur lewat jendela depan, hyperlapse ke malam (Master 1 malam), naik ke langit berbintang (Master 9 malam), billboard disorot lampu tanpa tulisan, footer 4 kolom di jalan gelap.

### Tahap 11: Pengerasan HP dan fallback

- Still semua keyframe, pc dan hp; fallback scroll dengan crossfade.
- Tingkat kualitas dari FPS terukur, mode hemat, tombol "Mode ringan" untuk pengunjung (diputuskan di tahap ini).
- Memori: lepas set yang jauh, tangani context lost, cek panas setelah 60 detik scroll.
- Versi tumpuk (reduced motion, tanpa JavaScript).
- Aksesibilitas: urutan fokus, kontras teks di kartu, tombol header yang melompat ke beat (Layanan, Cara kerja).
- Tes seluruh take di HP murah user dan HP menengah; catat model, FPS rata-rata dan terendah.

### Tahap 12 dan 13: Solusi

Detail di **[PLAN-SOLUSI.md](PLAN-SOLUSI.md)**: sumber v1, arsitektur etalase, data, kasir Heru, tahapan S0–S7 dan indeks 12 subplan. S6 didelegasikan ke [fondasi detail](docs/plans/solusi/PLAN-DETAIL.md), [pilot Order Grup](docs/plans/solusi/PLAN-ORDER-GRUP.md), dan subplan slug lain pada indeks induk. Rencana T1–T3 lama tetap dicatat; apakah cerita inline menggantikan atau berdampingan dengan overlay perlu keputusan eksplisit. **Instruksi terbaru user 7 Nov memajukan halaman depan Solusi: mulai S0 sekarang di sesi terpisah, tanpa menunggu Home tahap 11 dan tanpa mengubah pekerjaan Home.** Lingkup sesi ini etalase, Cari, Kartu, hasil, kontak dan kasir; bukan detail atau Tonton.

### Tahap 14: Halaman lain

- Artikel: layout editorial (referensi Maglr), 3 artikel awal dari `docs/SITE-BRIEF.md` 6.
- Tentang: cerita, tim (Founder + 2 Co-founder), cara kerja, nilai, peta kantor, CTA.
- Kebijakan Privasi: draf Claude, direview sebelum tayang.

### Tahap 15: QA dan tayang

- Playwright: screenshot tiap hold keyframe di 375, 768 dan 1440 px, navigasi, pindah bahasa; axe per halaman.
- Lighthouse, audit Impeccable, review gerak.
- Analytics klik Konsultasi gratis per bagian.
- Vercel production, domain kreatekno.com, Google Business Profile.

## 6. Risiko

| Risiko | Akibat | Mitigasi |
|---|---|---|
| Lingkup besar: 5 set, 6 waktu, ±10 tokoh dari kode | Waktu lama | Tahap per kelompok beat dengan review; kit dan pembangun karakter dipakai ulang |
| Beat 3–16 tanpa keyframe tim | Komposisi tidak sesuai bayangan tim | Sketsa greybox per keyframe disetujui sebelum detail |
| Kemiripan tokoh dari kode terbatas | Tokoh terasa beda dari turnaround | Bandingkan berdampingan di tiap review; versi sederhana untuk mode hemat |
| HTML tidak bisa tertutup objek 3D | Copy tampak melayang di depan benda | Komposisi kamera dijaga; kalau perlu mask per props |
| Take ±30 layar di HP murah | Panas, FPS turun, tab crash | Render hanya saat berubah, maksimal 2 set hidup, tingkat kualitas, fallback still |
| Bundle membesar per set | Loading lambat | Chunk per set, dimuat menjelang dipakai, anggaran per chunk |
| Bake AO makin lama dengan banyak set | Jeda saat masuk set | Bake per set saat dimuat, atau bake saat build (diputuskan di tahap 2) |
| Turnaround Heru, Wildan, Andi belum lengkap | Tahap karakter tertunda | Minta di awal tahap 3 dan 7 |

## 7. Pertanyaan terbuka dan input dari tim

- [ ] Keyframe K0, K1, K2, K2.1, K2.2 (pc dan hp) dari Drive ke `refs/keyframes/` untuk solver dan perbandingan.
- [x] Turnaround Heru, Wildan dan Andi ada di `refs/KARKATER/` (`heru.png`, `wildan.png`, `andi.png`).
- [x] ARYA, DIMAS dan RAKA (`ALL KARAKTER.png` posisi 3, 4, 10) adalah desain lama tim Kreatekno, tidak dibangun (1 Nov). Tiga file `cmvnn*.png` di repo lama belum dicek.
- [ ] Dokumen tim "Kreatekno · Prompt Master Lokasi", terutama bagian "Versi HP 9:16", untuk komposisi HP beat 3–16.
- [ ] Model HP dan angka FPS dari tes yang sudah dilakukan, untuk patokan tahap 2 dan 11.
- [x] URL EN untuk Solusi: `/en/solutions` (31 Okt).
- [x] Repo GitHub: `iwilwildan/kreatekno-website-3d` (2 Nov).
- [ ] Akun Vercel Kreatekno.
- [ ] Dari `docs/SITE-BRIEF.md` 11: nomor WhatsApp bisnis, alamat kantor lengkap, nama dan bio tim, logo klien dan izinnya, link media sosial, analytics, akses domain.

## 8. Log

### 2026-10-31 (tahap 0)

- Folder `D:\Danslab\Kreatekno Website 3D` dibuat sebagai repo git baru. Repo lama `D:\Danslab\Kreatekno Website` dibekukan.
- Interview user: lingkup 3D, framework, karakter, peran footage, repo, file besar, tes HP, fallback, urutan, keyframe beat 3–16, repo lama, target (hasilnya di bagian 2).
- Disalin dari repo lama:
  - dokumen ke `docs/` (`PLAN.md` lama jadi `docs/legacy/PLAN-v1.md`, `PORTFOLIO.md` ke `docs/legacy/`);
  - `prototype/k0-k2/` dan `prototype/solusi/` tanpa `node_modules`, hasil build k0-k2 dan Solusi, `beat2-3d.html`;
  - app Next.js lama ke `reference/site-nextjs/` tanpa `node_modules`, `.next` dan frame footage;
  - `Assets/brand/` ke `assets/brand/`; `.claude/skills/` dan `skills-lock.json`;
  - ke `refs/` (di luar git): KARKATER, Master Lokasi, Properti, footage, dan PDF dokumen tim dari Downloads.
- Tidak disalin: `archive/` (rencana video dan aset AI lama), prototype Home dan Portofolio versi 16 beat, `.playwright-mcp/`.
- Jumlah file di tiap folder salinan sama dengan sumbernya.
- Master per keyframe dan susunan set dipetakan dari dokumen tim (bagian 4).

### 2026-10-31 (tahap 1, riset)

- Riset versi di npm dan docs: Next.js 16.4 (Cache Components dianjurkan, `ensureStatic` baru), advisory keamanan Next.js 2026 (16.4.3 aman), TypeScript 7 belum didukung default oleh Next.js, ESLint 10 baru dan belum dipakai, cara pasang Tailwind v4, next-intl dengan root params.
- User memutuskan: Lenis ditunda ke tahap 2, slug EN Solusi `/en/solutions`, Home tahap 1 berisi hero HTML + panggung kosong, draf copy SEO Solusi dibuat Claude.
- Plan tahap 1 ditulis (bagian 5). Implementasi belum dimulai, menunggu persetujuan.
- Catatan untuk tahap 2: three 0.187.0 rilis 30 Okt; versi yang disetujui masih 0.186.1.
- Pertanyaan terbuka "URL EN untuk Solusi" terjawab.

### 2026-10-31 (tahap 1, implementasi)

- `site/` dibuat dari `reference/site-nextjs/`: config, i18n, `proxy.ts`, `lib/`, layout (Header, MobileMenu, LangSwitch, Footer, WhatsAppButton), JsonLd, PagePlaceholder, globals.css, brand, ikon, sitemap, robots, OG, not-found, catch-all. Versi sesuai plan; `npm audit --omit=dev` bersih.
- Portofolio → Solusi: route `/solusi` ↔ `/en/solutions`, menu, sitemap, kunci messages `solutions` (meta, nav, cta, pages). Draf title dan description Solusi ID/EN menunggu review.
- Home: `components/home/HomeStage.tsx` (langit placeholder pagi, hero kicker + headline + body + 2 tombol; di HP body dan tombol jadi kartu di bawah), lalu target `#layanan` dan `#cara-kerja` sementara, lalu Footer. JSON-LD FAQPage dilepas sampai beat FAQ terlihat di halaman.
- Lenis, GSAP dan `components/story/` tidak di-port; CSS Lenis dan `data-lenis-prevent` dihapus.
- `ensureStatic = "navigation"` dipasang di layout `(pages)` dan Home, tidak di layout `[locale]`, karena catch-all 404 tidak bisa mendaftar semua path.
- `opengraph-image` sekarang dirender saat build (`generateStaticParams` + `use cache`); di reference masih dinamis per request.
- Halaman 404 mendapat title sendiri ("Halaman tidak ditemukan" / "Page not found"); sebelumnya memakai title Home.
- Dicek: `build` (semua halaman ○ statis di ID dan EN, OG ●), `typecheck`, `lint`, `format:check`; preview 1280×720 dan 375×812 tanpa error console; menu HP buka/tutup dan link Solusi; canonical dan hreflang `/solusi` ↔ `/en/solutions`; semua route EN 200; 404 untuk path asing; link `wa.me` dengan pesan per bahasa; `#layanan` dan `#cara-kerja` ada.
- Catatan:
  - ESLint 9.39.5 ditandai npm "no longer supported", dan `npm audit` dev menemukan 16 temuan moderate (ReDoS minimatch di rantai ESLint, tidak ikut ke situs). Usulan: coba ESLint 10 di awal tahap 2.
  - URL `og:image` versi ID mengarah ke `/id/opengraph-image` lalu di-redirect 307 ke `/opengraph-image`; gambarnya tetap terkirim.
  - `/portofolio` sekarang 404; redirect ke `/solusi` hanya perlu kalau URL lama pernah tayang.
- Belum: review user, deploy preview (menunggu repo GitHub dan akun Vercel), commit.

### 2026-10-31 (tahap 1 disetujui, tahap 2 riset)

- User menyetujui tahap 1.
- Riset tahap 2: three r187 (PMREM berbasis cube render target, material bisa sedikit berubah), WebGPU vs WebGL di HP, CSS3DRenderer vs `matrix3d` sendiri, AO dengan three-mesh-bvh (worker, serialize), peer ESLint 10 (plugin react/import/jsx-a11y baru sampai ESLint 9), versi three-mesh-bvh 0.9.17 dan Playwright 1.64.1. OpenCV belum terpasang di laptop; PIL dan numpy ada.
- User memutuskan: three tetap 0.186.1, AO di-bake saat build, Playwright 1.64.1 boleh di `tools/`, tes HP lewat Wi-Fi lokal.
- Plan tahap 2 ditulis (bagian 5). Implementasi belum dimulai, menunggu persetujuan.

### 2026-10-31 (tahap 2, implementasi)

- `site/world/` (TypeScript strict, three 0.186.1, three-mesh-bvh 0.9.16, @types/three 0.186.0): `core/` kit, ao, bake (chunk terpisah), light, anchors (homografi `matrix3d`), segments (tanpa three), take; `sets/` street, companyFront, sky; `cast/standIn`; `takes/home/` data (hasil solver), timing, kamera. API `mount(host, opts)`.
- Interior di-blend pc/hp dalam 5 langkah layout (0, ¼, ½, ¾, 1), masing-masing dengan AO-nya sendiri. Prototype membangun ulang interior tiap selisih 0,08; di 16:9 dan 9:16 hasilnya sama persis.
- `components/home/`: `HomeStage` (server: copy, still `<picture>`, skrip inline `placeHero`), `HomeTake` (client: panggung sticky, scroll, `import()` world saat idle, crossfade 500 ms dengan quad copy ikut di-blend, fallback still, HUD, `window.__world` untuk alat), `stage.css` (versi tumpuk sebagai dasar, film di media `scripting` + `prefers-reduced-motion`). Teks alt still ID/EN ditambah di `home.stage`.
- Copy di billboard: pc kicker + headline di bagian atas wajah, paragraf + tombol di bagian bawah; HP kicker + headline di seluruh wajah, paragraf + tombol kartu di pita bawah yang memudar setelah hold K0.
- `tools/` (Playwright 1.64.1 dengan Edge lokal dan SwiftShader): `render/` bake-ao, stills, shots, diff.py, perf; `camera-solve/` disalin dari `prototype/k0-k2/tools/` (prototype tetap utuh sebagai arsip).
- Hasil bake: 27 peta AO (±125 KB total, ±33 KB per kunjungan). Still WebP: pc 28–48 KB, hp 20–31 KB. Quad billboard di still K0 pc (x 11,6%, y 28,5%, w 45%) cocok dengan tabel `docs/STORY-STAGE.md` (12; 29,6; 43,2).
- `.claude/launch.json`: konfigurasi `site-prod` (build produksi, port 3100, terbuka di jaringan lokal untuk tes HP).
- Dicek:
  - Render situs vs `prototype/k0-k2-3d.html` (SwiftShader): K0 dan K1 pc/hp selisih 0,00–0,02% piksel; K2 1–2% karena kepala figur pengganti staf dan Bu Dewi di prototype tertanam di lantai (bug `g.add(...).position.set` di prototype), di situs sudah di tempatnya.
  - Anggaran: draw call maks 107 (< 120), segitiga maks 118 ribu (< 150 ribu); seluruh JS halaman 333 KB gzip (world + three ±162 KB; tracer AO 15 KB hanya dimuat bila peta hilang).
  - Profil HP lambat (CPU 4×, 150 ms RTT, 1,6 Mbps), 3 kali: LCP 0,8–1,9 s; 3D masuk 7–12 s, selama itu still K0 dengan copy tampil.
  - Versi tumpuk (reduced motion) pc dan HP, fallback tanpa WebGL (still berganti saat scroll), screenshot halaman K0–K2 di 1280×720 dan 375×812, tanpa error console selain skrip Vercel Analytics yang 404 di luar Vercel.
  - `build` (semua halaman statis), `typecheck`, `lint`, `format:check`.
- Belum: tes FPS di HP user lewat Wi-Fi lokal (`http://192.168.1.10:3100`, perlu izin firewall Windows untuk port 3100), review user, commit.

### 2026-10-31 (tahap 2, burung K0 bergerak)

- Permintaan user: burung di K0 bergerak sendiri saat diam (cara 1 dari tiga opsi; gerak terbang keluar frame saat crane down tetap di tahap 4).
- Acuan: video tim `k0 - k1` (pc): burung terbang beriringan ke kanan atas, sekitar 3 kepakan per detik, sayap naik membentuk V lalu turun di bawah badan.
- `world/sets/sky.ts`: sayap jadi mesh terpisah dengan sendi di bahu, lebih panjang, meruncing dan sedikit menyapu ke belakang. Animasi berbasis waktu: kepakan 3,2 Hz dengan jeda melayang (siklus 4,6 s), badan naik saat kepakan turun, geser pelan bolak-balik di sekitar posisi keyframe supaya tidak keluar frame K0. Tiap burung punya fase sendiri.
- `world/index.ts`: loop render ambient dibatasi 30 fps (20 fps di mode hemat), hanya selama kawanan burung terlihat kamera dan panggung terlihat; mati di `?shot` (still dan shot review tetap diam, pose istirahat sayap terlipat). FPS di HUD sekarang menghitung frame yang dirender per detik (30 saat diam di K0).
- Still dirender ulang (pose istirahat sayap berubah). Draw call K0 naik 8 (pc 42, hp 95; maksimal take 107).
- Dicek: urutan frame kepakan (Edge, GPU), render vs prototype (K0 selisih 0,2% piksel, hanya sayap; K1 dan K2 sama seperti sebelumnya), profil HP lambat (LCP 0,9–1,7 s), `build`, `typecheck`, `lint`, `format:check`.
- Belum: tes FPS dan panas di HP user saat diam di K0 dan saat scroll; review user.

### 2026-11-01 (tahap 2, burung K0 terbang melintas)

- Permintaan user: burung di K0 terbang keluar dari tepi kanan frame lalu masuk lagi dari tepi kiri, berulang.
- `world/sets/sky.ts`: geser bolak-balik diganti terbang lurus ke kanan dan sedikit menanjak (arah kawanan di video `k0 - k1`), melintasi frame K0 dalam ±11 s. Titik keluar kanan dan titik masuk kiri tiap burung diukur dari kamera K0 dengan aspect layar saat itu (`setFlight`, dipanggil di resize), dengan jarak lewat tepi supaya lompatan tidak terlihat. Satu kecepatan untuk seluruh kawanan, jadi formasi tetap. Kepakan, jeda melayang dan naik-turun badan tetap. Pada waktu 0 burung ada di posisi keyframe; still dan `?shot` tidak berubah.
- Dicek: rekaman 14 s di 1280×720 dan 375×812 (burung keluar kanan, masuk dari kiri, lewat di belakang billboard), render 30 fps saat diam di K0, tanpa error console; `build`, `typecheck`, `lint`, `format:check`. Build produksi baru berjalan di `site-prod` untuk tes HP.
- Belum: tes FPS dan panas di HP user; review user.

### 2026-11-01 (tahap 2, tes HP user)

- POCO X6, Chrome Android, lewat Wi-Fi lokal (`site-prod`): diam di K0 30 fps (batas ambient tercapai), 85 draw call, 114,1 ribu segitiga, pixel ratio 1,5, AO dari file bake. Layout HP sesuai: headline di billboard, kartu paragraf + tombol di pita bawah, burung terbang.
- Belum diterima: FPS terendah saat scroll K0 → K2, panas setelah ±1 menit. POCO X6 termasuk kelas menengah (Snapdragon 7s Gen 2); tes di HP murah tetap diperlukan untuk patokan tahap 11.

### 2026-11-01 (tahap 2 disetujui, tahap 3 riset)

- User menyetujui tahap 2 (POCO X6, 30 fps diam di K0). FPS saat scroll dan kondisi panas tidak dilaporkan.
- `HANDOFF.md` di root: serah-terima dari sesi tahap 1–2 untuk sesi berikutnya. Tabel tokoh (4.3) dan pertanyaan terbuka (7) diperbarui: turnaround Heru, Wildan dan Andi sudah ada.
- Riset tahap 3:
  - `SDFGeometryGenerator` (surface nets) sudah dihapus dari addon three (PR #29281); `MarchingCubes` masih ada. Kelas itu mengisi grid `field` sendiri di kubus [-1, 1], normal dari gradien field, keluaran tanpa indeks dengan buffer `maxPolyCount`. Bisa diisi dari SDF kita lalu disalin ke geometri statis. Segitiga naik kuadratik terhadap resolusi; bagian seukuran kepala di resolusi 48 sudah ±10 ribu.
  - `MeshPhysicalMaterial` hanya mahal kalau fitur Physical dinyalakan; clearcoat relatif murah, transmission mahal. Biaya per piksel, jadi terasa di close-up K2.2. Wrap lighting lewat `onBeforeCompile` adalah cara murah untuk kesan clay/SSS.
  - `@pixiv/three-vrm-springbone` 3.5.5 (MIT, dependensinya hanya paket tipe, peer three ≥ 0.137) bisa dipakai tanpa file VRM: joint dan collider dibuat manual (contoh `single`, `multiple`, `collider`).
  - IK dua tulang: three hanya punya `CCDIKSolver` (iteratif, untuk SkinnedMesh). Solusi analitik (hukum cosinus + pole) ditulis sendiri.
  - Anggaran HP: batas uniform tulang di GPU murah (±60 tulang aman), skinned mesh per tokoh sebaiknya satu.
- Dicek di repo:
  - Bagian tokoh yang terpisah per material akan menembus batas 120 draw call di K2 (6 tokoh). Perlu satu mesh per tokoh dengan atlas warna/motif.
  - `heruAt` sekarang mengecilkan kepala Heru dari 1,6 m ke 1,06 m selama berjalan K1 → K2; opsi (c) belum diterapkan di kamera. Bu Dewi: pusat kepala 2,01 m, konter 1,0 m. Staf duduk: pusat kepala 1,20–1,43 m.
  - Frame akhir footage K2 dan K2.2: ekspresi staf cemas atau bingung (beda dari turnaround yang tersenyum), wajah Nadia dan Fajar sebesar ±¼ tinggi layar di K2.2.
  - `shadowMap.autoUpdate` mati; tokoh yang bergerak di tahap 4 butuh update bayangan per frame.
  - SciPy 1.15.3 sudah ada, OpenCV belum (terbaru 5.0.0.93, cabang 4 terakhir 4.14.0.94).
  - **Keyframe K2 hp dan master 7 (`prototype/k0-k2/refs-upload/*.webp`) ikut ter-commit di `2cf393c`**, melanggar aturan 3. Belum di-push (belum ada remote).
- Jawaban user: Bu Dewi 1,60 m + lantai kasir ±25 cm; kamera K2 dihitung ulang dengan solver (OpenCV 4.14); satu SkinnedMesh per tokoh; SDF hanya untuk rambut, hijab dan tutup kepala; mata geometri + tekstur wajah dengan ekspresi; ARYA, DIMAS, RAKA desain lama dan diabaikan; merpati cukup dirapikan; tangan 4 jari + jempol sederhana; Heru dibuat dan direview dulu; keyframe di git dipindah ke `refs/` dan commit awal diubah saat commit berikutnya.
- Plan tahap 3 ditulis (bagian 5). Implementasi belum dimulai, menunggu persetujuan.

### 2026-11-01 (tahap 3, plan disetujui, langkah 1–4: Heru)

- User menyetujui plan tahap 3.
- Persiapan: `prototype/k0-k2/refs-upload/` dipindah ke `refs/keyframes/hp/K2_hp_upload.webp` dan `refs/Master Lokasi/master7_kolase_upload.webp` (masih ada di riwayat `2cf393c`, dihapus saat commit berikutnya). Keyframe dari Drive belum diunduh: sesi ini tidak punya alat Drive. Sebagai gantinya frame akhir footage `k0 - k1` dan `k1 - k2` (pc dan hp) dipakai; titik solver K2 pc jatuh tepat di frame itu.
- **OpenCV ternyata tidak diperlukan:** solver hanya memakai SciPy (1.15.3, sudah ada). Solver lama dijalankan ulang dan hasilnya sama persis dengan `data.json`. OpenCV tidak dipasang.
- Kamera K2 (opsi c): `tools/camera-solve/solve_cast.py` menambah kepala Heru 1,8 m (puncak rambut 1,80 m, baris terlebar 1,59 m, lebar 0,40 m) yang diukur di frame akhir footage sebagai batasan, dengan bobot 3 terhadap titik ruangan. `prep.py` menerima hasilnya sebagai argumen ke-4.
  - K2 pc: kamera 1,69 → 2,25 m, FOV 45,9°; error ruangan rata-rata 1,24% (maks 2,86%, sebelumnya 0,18%), kepala Heru 1,6%; Heru 1,49 m di depan kamera.
  - K2 hp: kamera 1,82 → 2,32 m; error ruangan 1,27% (maks 3,67%), kepala Heru 1,67%.
  - `heruAt` tidak lagi mengecilkan Heru.
- Lantai kasir 25 cm × 0,8 m di balik konter, dengan satu anak tangga di ujung kanan (`CASHIER_FLOOR` di `companyFront.ts`). Dengan kamera baru, posisi kepala Bu Dewi di keyframe setara pusat kepala 1,88 m; Bu Dewi 1,60 m di lantai kasir memberi ±1,65 m (±23 cm lebih rendah, ±5% tinggi layar).
- `site/world/cast/`: `sdf.ts` (bentuk SDF + `MarchingCubes`, grid simetris, normal dari gradien), `loft.ts`, `atlas.ts` (warna rgb + kekasaran alpha, satu DataTexture per tokoh, pola serat dari satu ubin), `face.ts` (alis, mulut, pipi, kumis dan janggut di kanvas, parameter ekspresi), `vinyl.ts` (wrap lighting dan kekasaran dari atlas lewat `onBeforeCompile`), `rig.ts` (tulang `Bone`, pose, IK dua tulang analitik), `figure.ts` (satu `SkinnedMesh` per tokoh, bobot kaku atau rantai), `body.ts` (rencana badan bersama: sendi, kepala, telinga, mata, tangan 4 jari + jempol, sepatu, tali), `heru.ts`, `lab.ts` (panggung turnaround khusus dev di `/?lab=heru`, `&view=face`, `&flat`, `&hemat`).
- Heru: ukuran diambil dari `heru.png` (tinggi 1,80 m, kepala 0,42 m dengan rambut). Profil lebar siluet tampak depan dibandingkan per 2,5% tinggi dengan `tools/render/castprofile.py`; kepala dan rambut sekarang selisih ≤ 0,03 tinggi.
  - 13,7 ribu segitiga (hemat 9,2 ribu), 1 draw call + bayangan. Waktu bangun di browser GPU laptop 186 ms pertama kali, ±60 ms berikutnya (Edge SwiftShader jauh lebih lambat untuk kanvas, jadi angka tool tidak dipakai).
  - Dimuat sebagai chunk `cast/heru` setelah set dibangun; crossfade menunggunya. Bayangan diperbarui hanya saat Heru berpindah.
- Alat baru di `tools/render/`: `cast.mjs` (sheet, close-up, versi tanpa bayangan lantai), `castvs.py` (turnaround di atas render), `castprofile.py`, `keys.mjs` (render keyframe). Semua keluaran di scratchpad.
- Dicek: render K0–K2 pc/hp tanpa error (K1 104/106 draw call, K2 93/92; segitiga maks 132 ribu), `typecheck`, `lint`, `format`.
- Belum: review Heru oleh user (dikirim di chat), tokoh lain, merpati, bake AO ulang (lantai kasir) dan still K1/K2 (masih kamera dan figur lama), ukuran chunk, tes HP.

### 2026-11-01 (tahap 3, revisi rambut belakang Heru)

- Permintaan user: revisi rambut belakang Heru.
- Bercak abu di belakang kepala ternyata bukan pantulan: cangkang/helai rambut berporos 1,5 cm di belakang kubah kepala sehingga menonjol sebagai bidang tegak (dicek dengan peta dan lampu dimatikan, lalu dari normal mesh). Porosnya sekarang sama dengan kubah.
- Rambut di belakang telinga sekarang satu cangkang SDF: penuh di pelipis, sedikit masuk di tengkuk, melebar seperti lonceng ke ujung, lekuk helai yang sedikit berpilin ke bawah, dan ujung pipih bergerigi (ujung helai lebih rendah dari celahnya). Bagian bawah terbuka sehingga leher di dalamnya. Lebar dari belakang dijaga ±0,40 m seperti turnaround dan solver K2. Helai kapsul lama dihapus.
- Tekstur rambut 256 px: di bawah pelipis garis lekuk helai mengikuti alur yang sama dengan geometri; di atas pelipis garis menyapu dari belahan samping (poni dari depan, pusaran ubun-ubun dari belakang). Warna rambut sedikit lebih terang (#3b3842), kekasaran 0,56 supaya ada kilau.
- 14,9 ribu segitiga (rambut res 36). K2 93/92 draw call.
- Belum: review user. Kepala Heru di K2 masih ±1,3× lebih lebar dari footage karena kompromi solver (bobot 3); bisa dikurangi dengan bobot lebih tinggi (kamera naik ±6 cm, error ruangan ±1,4%).

### 2026-11-01 (tahap 3, langkah 5–8: Bu Dewi, staf, merpati, integrasi)

- User menyetujui Heru (setelah revisi rambut) dan meminta lanjut.
- **Pembangun bersama `cast/member.ts`:** rig, atlas, wajah, mata, hidung, telinga, leher, tangan, material dan alat bantu pakaian (`torso`, `arms`, `legs`, `shoes`, `soft`). Semua tokoh dimodelkan di ruang badan acuan 1,8 m (ukuran Heru) lalu di-warp ke tinggi tokoh: badan ikut tinggi, kepala ikut akar tinggi (× `head`), seperti lineup tim yang ukuran kepalanya hampir sama. `Figure` menerapkan warp setelah bobot dan uv dihitung.
- Heru dipindah ke `buildMember`: render lab sebelum dan sesudah identik (selisih 0,001% piksel, segitiga sama).
- **Tokoh baru:** `dewi.ts` (1,60 m), `sinta.ts` (1,58 m), `bayu.ts` (1,68 m), `nadia.ts` (1,57 m), `fajar.ts` (1,70 m sampai puncak ikat kepala). `headwear.ts` (hijab: tudung dengan oval wajah yang dipotong lurus ke belakang, jubah dengan kelim depan, samping dan belakang, runcing di belakang), `wardrobe.ts` (potongan baju perempuan, cincin baju dan lengan, pola kotak, sarung, zigzag), `roster.ts`. Warna diambil dari turnaround (median piksel).
- **Pose K2 (`poses.ts`)** dari footage: staf duduk (pinggul diturunkan ke dudukan kursi 0,505 m, kaki dengan IK dan telapak diratakan), Sinta mengetik di HP sambil menunduk, Bayu di keyboard menghadap monitor, Nadia menopang dagu dengan siku di meja, Fajar menggaruk kepala, Bu Dewi kedua tangan di konter. Ekspresi: staf cemas atau bingung, Bu Dewi tersenyum. `Rig` mendapat `point` (arah jari) dan `level` (kaki rata).
- **Set:** figur pengganti dihapus (`cast/standIn.ts`). `companyFront` mengembalikan `spots` (posisi dan arah tiap tokoh per layout); staf duduk 0,25 m di belakang tepi meja (sebelumnya 0,5 m, lengan tidak sampai ke meja), Sinta digeser 16 cm ke kanan monitornya seperti di footage. Tokoh hidup di luar grup ruangan dan dipose ulang setiap layout berganti.
- **Dunia:** chunk `cast/roster` dimuat setelah set; tokoh dibangun satu per satu dengan jeda `setTimeout`. HUD menampilkan waktu bangun tokoh (total dan slice terpanjang).
- **Anggaran:** dengan keenam tokoh K2 sempat 187 ribu segitiga. Resolusi MarchingCubes staf diturunkan ke 24–26 (Heru 30), segmen jari, mata dan kepala dikurangi, dan `G.rbox` di `core/kit.ts` sekarang 2 segmen sudut (300 lawan 588 segitiga per kotak; ratusan kotak di set). Hasil: K0 50/115 ribu, K1 129/132 ribu, K2 126 ribu (pc/hp); draw call maks 97.
- **Merpati:** footage K0 menunjukkan merpati **putih** dengan mata hitam dan paruh kuning, bukan abu. Mengikuti urutan referensi (video di atas usulan), warnanya tetap putih; bentuk dirapikan: kepala lebih bulat, ekor kipas, mata hitam, paruh lebih kuning.
- **Waktu bangun tokoh** (Edge dengan GPU, dev server): awalnya 0,9–1,2 s untuk keenamnya (4,4–4,7 s pada CPU 4×, potongan terpanjang ±1,2 s). Penyebab terbesar adalah pembacaan balik kanvas atlas. Atlas sekarang dua `CanvasTexture` (warna, dan kekasaran separuh resolusi sebagai `roughnessMap`) tanpa `getImageData`; tokoh dibangun bertahap (`buildMemberSliced`, satu slice per bagian SDF). Hasil: 31–47 ms per tokoh hangat; total 0,6–0,7 s (2,0–2,5 s pada CPU 4×), slice terpanjang 92–147 ms (318–447 ms pada CPU 4×). Crossfade 3D tidak lagi menunggu tokoh (kecuali `?shot` dan bake). Web Worker belum dipakai; diputuskan setelah tes HP.
- Bake AO ulang (27 peta, 160 KB) dan still K0–K2 pc/hp (21–59 KB, K2 sekarang dengan tokoh).
- Build produksi: chunk tokoh 16 KB gzip; JS halaman 359 KB gzip (sebelumnya 333). Profil HP lambat (port 3200, build baru): LCP 0,73–1,58 s, 3D masuk 5,5–7 s.
- Server `site-prod` di port 3100 (dijalankan sesi lain) masih menyajikan build lama; `.claude/launch.json` mendapat `site-prod-3200` untuk build baru. Untuk tes HP, `site-prod` perlu dijalankan ulang.
- Dicek: `typecheck`, `lint`, `format:check`, `build`.
- Belum: review user, tes HP (FPS di K2 dengan enam tokoh, waktu bangun tokoh), tahap 4 (gerak).

### 2026-11-01 (tahap 3 disetujui)

- User menyetujui tahap 3 (keenam tokoh, merpati putih, pose K2, anggaran, bake AO dan still).
- Masih terbuka untuk tahap berikutnya: tes HP (FPS di K2 dengan enam tokoh, waktu bangun tokoh; `site-prod` di port 3100 perlu dijalankan ulang dengan build baru), Web Worker untuk meshing SDF kalau HP tersendat, kepala Heru di K2 ±1,3× lebih lebar dari footage (bobot solver), keyframe asli dari Drive untuk mengecek ulang error K2, commit (termasuk menghapus `refs-upload` dari riwayat `2cf393c`).

### 2026-11-01 (tahap 4 riset dan plan)

- Riset: sampling gerak dari scroll (fungsi murni dari `p`, bukan `AnimationMixer.setTime`), gait prosedural (fase dari jarak tempuh, kaki dikunci dengan IK dua tulang), `@pixiv/three-vrm-springbone` 3.5.5 (masih terbaru, MIT, peer three ≥ 0.137, bisa tanpa VRM; redaman per frame sehingga perlu langkah tetap; delta besar membuat simulasi meledak; radius collider tidak ikut skala), shadow map (three 0.186 punya `autoUpdate`/`needsUpdate` per lampu; layer kamera bayangan tidak bisa memisahkan objek statis dan dinamis), motion blur murah untuk whip (blur searah dari kecepatan putar kamera, tanpa buffer kecepatan), pegas teredam kritis untuk inersia.
- Dicek di repo dan referensi:
  - Tulang ujung untuk pegas ternyata belum ada (`extraJoints` tidak dipakai); rambut, kuncir dan hijab masih kaku ke `head`.
  - Heru di K1 masih pose istirahat; dokumen tim dan footage: badan menyerong, tangan kiri di gagang daun kanan, pintu didorong ke dalam, tangan tetap di daun pintu saat masuk (footage hp). Jarak K1 → K2 ±2,7 m (±4 langkah).
  - Footage `k2 - k2.1` dan `k2.1 - k2.2` (3 s, 24 fps): Sinta dengan gelembung chat hijau dari HP dan kedip, Bayu di keyboard, Nadia menopang dagu, Fajar menggaruk berulang; Bu Dewi hilang selama whip pan di pc dan hp (sudah dicatat di `docs/STORY-STAGE.md`). Footage `k0 - k1`: burung keluar ke kanan atas di ±30% awal crane down.
  - Dokumen tim bertentangan soal K2: aturan umum (sambungan tanpa copy terus bergerak) lawan prompt beat 2 (kamera berhenti di K2).
  - Fajar tidak punya ujung kain menjuntai, jadi tanpa pegas.
- Jawaban user: whip pan dipicu dengan durasi tetap, blur searah hanya saat whip, aksi staf loop sendiri saat terlihat, K2 jeda pendek dan K2.1 terus; pegas, library, Heru di K2.x dan wajah mengikuti rekomendasi (semua bagian yang direncanakan, springbone 3.5.5, Heru berdiri dengan kepala menoleh, kedip saja).
- Plan tahap 4 ditulis (bagian 5). Implementasi belum dimulai, menunggu persetujuan.

### 2026-11-01 (tahap 4, implementasi)

- User menyetujui plan tahap 4. `@pixiv/three-vrm-springbone` 3.5.5 dipasang dengan versi pas (`npm audit --omit=dev` bersih).
- **Kamera K2.1 dan K2.2:** `tools/camera-solve/solve_k2x.py`. Solve kamera saja di frame akhir footage, dengan titik: puncak kepala staf (diukur dari tokoh situs di pose K2), sudut depan atas meja, satu sudut konter.
  - Ruangan di footage tidak menjaga proporsi, jadi solve bebas memberi kamera yang aneh (menembus kepala Heru, FOV 0,05°). Prior dipakai: x dekat garis tengah ruangan, tinggi ±1,5 m, FOV dekat K2, K2.2 dekat K2.1, jarak ≥ 0,5 m dari kepala Heru.
  - Hasil:

    | Kamera | Error rata-rata | Error maks | Tinggi | FOV vertikal |
    |---|---|---|---|---|
    | K2.1 pc | 2,08% | 3,26% | 1,34 m | 38° |
    | K2.2 pc | 1,54% | 2,79% | 1,11 m | 34° |
    | K2.1 hp | 2,12% | 3,72% | 1,19 m | 72° |
    | K2.2 hp | 4,21% | 5,82% | 1,03 m | 74° |

  - Masuk `data.json` (`cams.{pc,hp}["K2.1"|"K2.2"]`).
- **Take** (`takes/home/timing.ts`): 5,8 layar dengan segmen K2 jeda 0,3, K2 → K2.1 0,8, K2.1 → K2.2 0,7, K2.2 jeda 0,6. `holdP` memberi posisi sambungan untuk keyframe tanpa jeda (K2.1).
- **Kamera** (`takes/home/index.ts`):
  - K2 → K2.1 melewati 0,2 m di atas kepala Heru (kurva diukur menurut panjang) dan tiba di K2.1 masih bergerak.
  - Setelah K2.1 kamera hanyut dengan kecepatan yang menyambung.
  - Whip pan (`WHIP_AT` 30% segmen) dipicu dan berjalan 0,45 s berbasis waktu di `world/index.ts`, mundur bila scroll kembali melewati ambang. Pose whip adalah campuran "hanyut" dan "masuk ke K2.2", keduanya disampel dari scroll.
- **Inersia:** `motion/damp.ts`, pegas teredam kritis solusi tertutup (ω 8, waktu redam ±0,25 s) pada posisi scroll, menggantikan redaman eksponensial.
- **Heru** (`cast/walk.ts`, `takes/home/heru.ts`):
  - Langkah dihitung dari jarak tempuh, ±7 langkah 0,42 m. Langkah 0,68 m tidak terjangkau kaki vinyl sepanjang 0,64 m, jadi panggul turun 4 cm saat kedua kaki menapak.
  - Kaki menapak dikunci IK; lengan berayun, panggul dan dada memutar.
  - K1: badan menyerong 0,32 rad, tangan kiri di gagang batang daun kanan (IK). Pintu didorong ke dalam, tangan lepas di ±20% gerak, daun terus terbuka sampai 83°.
  - Selama K2.x kepala menoleh kiri lalu kanan mengikuti kamera.
  - Kaki bergeser 0,9 cm (pc) dan 1,2 cm (hp) saat menapak, maju dan mundur, diukur di 400 posisi scroll.
- **Staf** (`cast/acts.ts`, loop berbasis waktu 30 fps (20 di hemat) selama ruangan terlihat, mati di `?shot`):
  - Sinta mengetik dengan jempol dan mengangguk. Ponselnya kini di tangan, dengan layar menyala dan tiga gelembung chat hijau polos yang naik dan memudar; ponsel di meja D1 dihapus.
  - Bayu mengetik dan melirik tumpukan slip.
  - Nadia bergoyang kecil.
  - Fajar menggaruk kepala dalam ledakan pendek.
  - Bu Dewi menoleh ke Heru.
  - Semua bernapas dan berkedip (tulang `eyeL`/`eyeR` di `body.ts`, kedip acak tiap 4,5 s, tidak di 0,5 s pertama). `applyPose` tidak lagi menggambar ulang wajah tiap frame.
- **Pegas** (`motion/springs.ts`, langkah tetap 60 Hz, `reset` + settle 1 s untuk `?shot`):
  - Heru: 3 tulang rambut belakang, lanyard + kartu, tas.
  - Nadia: kuncir 2 ruas.
  - Bu Dewi dan Sinta: 4 tulang ujung hijab (kaku).
  - Collider bola kepala, kapsul bahu dan dada. `Figure` kini menerima bobot 3 tulang (`Figure.hem` membagi kain di antara dua pegas terdekat menurut sudut).
- **Burung K0:** `sky.animate(time, crane)`, kawanan keluar ke kanan atas di 35% awal crane down, disampel dari scroll.
- **Bayangan:** shadow map diperbarui hanya saat badan Heru atau pintu bergerak, maks 30 Hz (HP 20 Hz). Tolehan kepala, napas, aksi staf dan pegas tidak memicunya.
- **Motion blur whip:** `core/whipBlur.ts`, render target HalfFloat tanpa MSAA, satu pass blur 12 sampel searah pan plus tone mapping dan sRGB. Aktif hanya selama whip, mati di mode hemat.
- **Halaman:** still K2.1 dan K2.2 (pc/hp) untuk fallback, crossfade 3,9–4,5 dan 4,62–4,82 layar, alt teks ID/EN (`home.stage.k2_1`, `k2_2`). HUD menampilkan frame dengan bayangan terpisah.
- **Alat:**
  - `tools/render/motion.mjs`: urutan frame dari scroll, whip per 60 ms, cek kaki meluncur, FPS saat scroll dengan `CPU=4`.
  - `tools/render/walk.mjs` + lab `/?lab=heru&walk`: tampak samping berjalan.
  - `keys.mjs` kini menghitung draw call dari frame tanpa pass bayangan.
  - `.claude/launch.json` mendapat `site-prod-3300` (build baru, terbuka di Wi-Fi lokal).
- Bake AO ulang (ponsel meja hilang) dan still K0–K2.2 pc/hp (hp 21–40 KB).
- **Dicek:**
  - Pass utama (frame tanpa update bayangan): pc K0 46, K1 99, K2 88, K2.1 65, K2.2 65 draw call; hp 96/101/87/60/60. Segitiga maks 131,6 ribu.
  - Frame yang juga menggambar ulang shadow map (hanya saat Heru berjalan) ±185 draw call dan ±265 ribu segitiga di desktop: pass bayangan menggambar seluruh set dan keenam tokoh.
  - Chunk tokoh 25,6 KB gzip (sebelumnya 16; springbone ±6 KB).
  - JS halaman 370 KB gzip (sebelumnya 359).
  - Profil HP lambat di build produksi port 3300: LCP 0,75–1,29 s, 3D masuk 7,4–7,8 s.
  - Scroll K1 → K2.2 dalam 6 s dengan CPU 4× (GPU laptop): rata-rata 93 fps rAF, p95 22 ms, terburuk 45 ms.
  - Tanpa error console selain skrip Vercel Analytics (404 di luar Vercel).
  - `typecheck`, `lint`, `format:check`, `build`.
- **Belum:**
  - review user;
  - tes HP: FPS saat scroll K1 → K2.2 dan diam di K2.2, panas. Build baru ada di `site-prod-3300`; server `site-prod` 3100 dan 3200 dari sesi lain masih memakai build lama di memori dan perlu dijalankan ulang.
  - Bila HP berat saat Heru berjalan: turunkan update bayangan ke 15 Hz, atau keluarkan set jalan dari pass bayangan saat kamera di dalam.
  - Kamera K2.1 (pc dan hp) memperlihatkan lampu gantung dan sudut langit-langit yang di footage hampir tidak ada (ruangan footage lebih tinggi).

### 2026-11-01 (tahap 4 disetujui)

- User menyetujui tahap 4 dan meminta lanjut ke tahap 5. FPS di HP belum dilaporkan (build baru di `site-prod-3300`).

### 2026-11-01 (tahap 5 riset dan plan)

- Dibaca: dokumen tim beat 3 dan 4 (K3, K4), `docs/STORY-STAGE.md` 3–5, `docs/COPY.md`, Master 11b, properti `Binder tebal.png` dan `ketas lebar.png`, `reference/site-nextjs/components/story/Binder.tsx` dan CSS leaflet/binder lama, messages `home.services` dan `home.useCase`.
- Dicek di repo: set ruang depan belum punya printer dan tiga bingkai di dinding kanan; stand akrilik, leaflet dan binder belum ada; `#layanan` masih placeholder di bawah take.
- Riset:
  - teks HTML di `matrix3d` buram bila diperbesar (perilaku berbeda per engine; saran yang ada belum konsisten), jadi kotak diberi ukuran sebesar tampilannya saat jeda;
  - carousel horizontal di halaman yang di-scroll vertikal: `touch-action: pan-x` memblokir scroll halaman, `overflow-x` + scroll-snap native lebih aman, dengan tombol, keyboard dan semantik ARIA;
  - kamera arc dengan rig yaw/pitch/radius + lookAt, bukan OrbitControls.
- Jawaban user: leaflet, stand dan binder sudah ada di konter sejak K2; kartu use case HP berupa chip industri + 1 contoh per swipe.
- Plan tahap 5 ditulis (bagian 5). Implementasi belum dimulai, menunggu persetujuan.

### 2026-11-01 (revisi beat 1: Heru menghadap kamera, gerak masuk tanpa getar)

- Masukan user: Heru menghadap depan dulu sebelum masuk; gerak masuk pintu masih bergetar dan patah-patah.
- Diukur (pose disampel tiap langkah scroll, dan scroll mouse wheel sungguhan di Edge):
  - Heru berjalan ±3,4 m dalam 1,2 layar, jadi dengan mouse wheel ia bergerak sampai 5–6 m/s (±14 langkah per detik), satu sentakan per putaran wheel;
  - lutut meloncat 2–6 cm per sampel saat kaki tumpu sampai batas jangkauan IK (kaki lurus penuh);
  - pegas rambut, tas, lanyard dan hijab maju per 60 Hz tanpa interpolasi, jadi di layar 120/144 Hz sebagian frame tidak bergerak;
  - bayangan diperbarui 30 Hz, tertinggal dari badan saat berjalan.
- Jawaban user: Heru menghadap kamera di jeda K1 (wajah terlihat, tangan belum di gagang; berbeda dari keyframe tim atas keputusan user), lalu berbalik saat scroll lanjut; kecepatan jalan alami ditambah jalur lebih panjang.
- Diubah:
  - `takes/home/heru.ts`: Heru punya jam sendiri (detik pada laju alami): berbalik ke kanan dengan tiga langkah kecil 0–1,0 s, tangan ke gagang 0,7–1,2 s, dorong pintu 1,1–2,1 s, lepas 1,5–1,9 s, jalan mulai 1,3 s dengan 1,0 m/s (naik dan turun halus 0,6 s). Scroll menentukan posisi jam tujuan; dunia mengejarnya dengan pegas kritis (ω 3,5) dan paling cepat 1,5 × laju alami. Semua tetap fungsi murni dari jam, jadi scroll ke atas memutar balik. Kamera K1 → K2 dan dolly K2 → K2.1 memakai posisi Heru menurut scroll, jadi jalurnya tidak goyang saat Heru tertinggal;
  - `cast/walk.ts`: panggul turun secukupnya agar kaki paling panjang 98,5% (lutut selalu sedikit menekuk; menggantikan dip tetap −4 cm), `turnStride` (berbalik di tempat dengan tiga langkah), telapak kaki menghadap arah jalurnya sendiri; `rig.level` menerima yaw;
  - `motion/springs.ts`: frame di antara langkah 60 Hz menampilkan campuran dua langkah terakhir;
  - `index.ts`: jam Heru diperbarui tiap frame; bayangan diperbarui tiap frame saat Heru bergerak di desktop, 30 Hz di HP;
  - `timing.ts`: K1 → K2 1,2 → 2,0 layar, take 5,8 → 6,6 layar; `STILL_FADES` di `HomeTake.tsx` digeser.
- Dicek:
  - lonjakan lutut per sampel turun dari 49–59 mm ke ≤5 mm; panggul bergerak rata (langkah maks ±2 × median, sebelumnya ±15 ×);
  - kaki yang menapak bergeser 0,0 mm (tool `motion.mjs` melaporkan 2,4 cm karena ambang 1,5 cm di atas lantai ikut menghitung awal ayunan);
  - scroll mouse wheel: kecepatan panggul naik 0,1 → 1,5 m/s, tertahan 1,5 m/s, turun ke 0, tanpa sentakan;
  - frame K1 → K2 pc dan video wheel pc/HP dikirim di chat; typecheck dan lint lulus; still K0–K2.2 dirender ulang.
- Belum: build produksi dan tes HP.
- User menyetujui revisi ini ("Sudah pas"). Plan tahap 5 masih menunggu persetujuan.

### 2026-11-02 (commit dan push ke GitHub)

- Permintaan user: push ke `https://github.com/iwilwildan/kreatekno-website-3d` (repo kosong).
- Commit awal `2cf393c` di-amend menjadi `4e00b4a` tanpa `prototype/k0-k2/refs-upload/*.webp` (keyframe K2 hp dan master 7), sesuai keputusan "Keyframe di git" dan persetujuan user di chat. Filenya sudah ada di `refs/`.
- Satu commit baru berisi pekerjaan tahap 1 sampai revisi beat 1: `site/`, `tools/`, `HANDOFF.md`, `PLAN.md`, `CLAUDE.md`, `.claude/launch.json`. `__pycache__/` dan `*.pyc` ditambahkan ke `.gitignore`.
- Remote `origin` ditambahkan, `main` di-push.
- Dicek: tidak ada file `refs/` (selain README) atau keyframe tim di commit; `site/public/stills/` adalah render scene sendiri.
- Belum: akun Vercel dan deploy preview; plan tahap 5 masih menunggu persetujuan.

### 2026-11-02 (revisi tahap 4: staf kewalahan oleh kerja manual)

- Masukan user (lewat sesi induk): staf di meja harus terlihat kesulitan karena kerja manual yang menumpuk; pilihan floating emoji, ekspresi wajah, atau bayangan hitam ala anime, kami yang menentukan.
- Dicek: dokumen tim K2 (Sinta alis naik kewalahan dengan ponsel penuh notifikasi, Bayu di antara monitor dan tumpukan tinggi slip dengan alis turun lesu, Nadia bertopang dagu tanpa ide, Fajar menggaruk kepala di samping baki daftar harga; Bu Dewi sedih prihatin) dan keyframe K2 HP. Temuan: Bu Dewi di situs tersenyum, bertentangan dengan dokumen tim dan keyframe. Riset singkat: tetes keringat kecil di pelipis yang diam dibaca sebagai tegang atau lelah; tetes yang menetes dibaca panik.
- Jawaban user: ekspresi + bahasa tubuh + tetes keringat 3D vinyl (tanpa emoji dan tanpa bayangan anime); Bu Dewi prihatin seperti dokumen tim.
- Diubah:
  - `cast/poses.ts`: alis staf lebih miring, mulut lebih turun, Sinta mulut sedikit terbuka; badan lebih membungkuk; field baru `lids` (kelopak berat: Bayu 0,32, Nadia 0,28, Fajar 0,15, Sinta 0,05) yang juga tampil di still; Bu Dewi alis naik di tengah, mulut turun, kepala sedikit miring;
  - `cast/acts.ts`: helaan napas berat tiap 7–8 s, bergantian per staf (dada naik, lalu membungkuk melewati pose dan kembali); kelopak berat digabung dengan kedipan; gelembung notifikasi Sinta 3 → 5 (satu tiap setengah detik), naik menyamping supaya wajahnya tetap terlihat; `createSweat`: tetes keringat lathe biru muda mengkilap ±10 cm di pelipis tiap staf, menempel di tulang kepala, bergoyang kecil tanpa menetes;
  - `sets/companyFront.ts`: tumpukan slip Bayu 11 → 17 dan makin berantakan ke atas, tumpukan kedua di depan dan tiga slip tercecer; empat gumpalan kertas di meja Nadia; baki Fajar penuh kertas dan empat map menunggu di sampingnya. AO di-bake ulang;
  - `index.ts`: tetes keringat ikut diperbarui bersama aksi ruangan.
- Dicek: render K2, K2.1, K2.2 pc dan HP (dikirim di chat). Draw call pass utama pc K2 88 → 95, K2.1 65 → 68, K2.2 65 → 70; HP K2 87 → 93, K2.1 60 → 63, K2.2 60 → 65; segitiga maks 128,4 rb. Typecheck dan lint lulus; still K0–K2.2 dirender ulang.
- Dicek di browser (14 s di K2.2): helaan napas bergantian Sinta ±2 s, Bayu ±4 s, Nadia ±6 s, Fajar ±8 s (dada ±0,07 rad), tetes bergoyang 0,93–1,07, tanpa error.
- Belum: review user; tes HP.

### 2026-11-02 (revisi tahap 4: awan mendung di atas staf)

- Masukan user: masih kurang suram, dan orang yang pertama kali scroll tidak akan sadar staf sedang kesulitan.
- Analisis: di shot lebar K2 (jeda 0,3 layar) wajah dan tetes keringat hanya beberapa piksel; yang terbaca sekilas hanya bentuk besar dan warna.
- Jawaban user: tambah awan mendung di atas kepala; jeda K2 tetap 0,3 layar (bayangan anime, pencahayaan suram dan pose dramatis tidak dipilih).
- Diubah: `cast/acts.ts` `createGloom`: awan low-poly abu gelap (bentuk awan langit K0, `cloudGeo` diekspor dari `sets/sky.ts`) ±0,55 m di atas puncak kepala tiap staf, mengikuti kepala dan bergoyang pelan, dengan 10 rintik hujan biru per awan (satu InstancedMesh) yang jatuh ke rambut; tanpa bayangan. Diperbarui bersama aksi ruangan (`index.ts`).
- Dicek: render K2, K2.1, K2.2 pc dan HP (dikirim di chat): awan terbaca di shot lebar pc dan HP, hujan jatuh ke kepala. Draw call pass utama pc K2 95 → 100, K2.1 68 → 71, K2.2 70 → 73; HP 93 → 98, 63 → 66, 65 → 68; segitiga maks 131,7 rb. Typecheck dan lint lulus; still dirender ulang.
- Belum: tes HP.
- User menyetujui revisi staf kewalahan ("Sudah pas"). Plan tahap 5 masih menunggu persetujuan.

### 2026-11-02 (tahap 5, plan direvisi dari keyframe K3/K4 dan blockout)

- Acuan baru dari user: keyframe K3 dan K4 pc/hp (`refs/keyframes/`) dan blockout kamera `refs/footage/blockout/K2.2 - K3 blockout v3.mp4`, dicatat di `refs/README.md`.
- Dibaca: dokumen tim beat 3–4 dan tabel beat (hlm. 5, 8–9, 15–17, 26), Master 11b, `refs/Properti/` (binder tebal, kertas lebar, map ungu), plan tahap 5 versi 1 Nov. Frame blockout diekstrak dengan ffmpeg ke scratchpad (label dan denah dipotong per 0,5 s).
- Temuan yang mengubah plan:
  - blockout: dolly lurus + pan kiri, orbit di belakang Bu Dewi ke bahu kanannya, berhenti 1 s di titik "K2.4" saat Heru meletakkan brosur, lalu tilt down 15° → 90° + push in di tinggi tetap 1,48 m sampai tampak atas; Heru membawa brosur dari pintu;
  - K3/K4 tampak atas: leaflet ±A4 (lanskap di pc, potret di hp) dan binder terbuka satu halaman, tangan kanan Heru (kiri atas, manset ungu-putih) dan tangan kanan Bu Dewi (kanan bawah); tanpa stand akrilik; pensil kuning dan pink di K4;
  - solver kamera tidak berguna untuk K3/K4 (bidang datar tanpa titik ruangan); tinggi kamera dihitung dari ukuran kertas di frame dan FOV (pc ±1,44 m dengan FOV 34°, dekat 1,48 m blockout).
- Riset singkat: `lookAt` tidak stabil saat menunduk 90° (pakai yaw/pitch atau quaternion langsung); `clip-path: polygon()` per frame untuk HTML yang tertutup objek WebGL (poligon kecil murah); ukuran target sentuh WCAG 2.2 (24 px AA, 44 px aman).
- Jawaban user: ikut blockout (Heru membawa brosur, stand dihapus); K3 → K4 truck kanan ke binder; copy HP di kertas; leaflet A4 lanskap di pc dan potret di hp; durasi K2.2 → K3 2,0 + jeda 1,2, K3 → K4 0,6 + jeda 1,5 (take 11,9 layar); tangan close-up; binder satu halaman; copy menghindari tangan + clip-path saat gerak.
- Plan tahap 5 versi 1 Nov diganti (bagian 5); baris tahap 5 di tabel tahapan dan catatan per tahap diperbarui. Kode `site/` tidak diubah.
- Belum: persetujuan plan oleh user; dokumen tim beat 3–4 perlu diperbarui oleh tim (catatan di plan); baris "Keyframe beat 3–16 belum ada" di bagian 2 dan risiko terkait sekarang hanya berlaku untuk beat 5a–16.

### 2026-11-02 (tahap 5, plan disetujui, langkah 1: ukur dan greybox)

- User menyetujui plan tahap 5 ("plan tahap 5 disetujui"); implementasi dimulai di sesi baru.
- Diukur di keyframe (skrip di scratchpad, ambang warna + cek mata):
  - K3 pc: kertas x 0,203–0,801, y 0,107–0,892 (rasio di layar 1,35:1, sedikit trapesium: kamera ±6° dari tegak lurus); strip ungu ±5% tinggi kertas dari tepi atas; tangan Heru x 0,15–0,34, y 0–0,22; tangan Bu Dewi x 0,69–0,94, y 0,73–1; binder tertutup x 0,94–1, y 0–0,54.
  - K3 hp: kertas x 0,053–0,949, y 0,145–0,848; tangan Heru (dengan manset) x 0,02–0,27, y 0–0,20; Bu Dewi x 0,76–1, y 0,78–1.
  - K4 pc: halaman x 0,316–0,655, y 0,07–0,916 (A4 potret); sampul x 0,306–0,701, y 0,043–0,952; tab x 0,651–0,676 (kuning y 0,08–0,24, toska 0,29–0,42, pink 0,44–0,60, lila 0,63–0,91); pensil kuning (0,17; 0,17)–(0,21; 0,74), pink (0,85; 0,13)–(0,81; 0,73).
  - K4 hp: halaman x 0,085–0,854, y 0,189–0,822; tab x 0,844–0,902.
  - Tinggi frame di kertas: K3 pc 26,8 cm, K3 hp 41,7 cm, K4 pc 35,1 cm, K4 hp 48,6 cm. Dengan FOV 34,2° (pc) dan 45° (hp): kamera 0,43 / 0,50 / 0,57 / 0,59 m di atas konter.
- Dibangun (greybox, tetap dipakai di langkah berikutnya):
  - `takes/home/timing.ts`: `K2.4`, `K3`, `K4`; K2.2 → K2.4 1,15, K2.4 → K3 0,85, jeda K3 1,2, K3 → K4 0,6, jeda K4 1,5. Take 11,9 layar.
  - `takes/home/counter.ts`: letak leaflet, binder dan pensil per langkah layout (`counterLayout`), kamera tampak atas dari ukuran keyframe (layar lebih sempit dari keyframe menjaga lebar, jadi kertas tidak terpotong di 375×812), jalur K2.2 → K3 (Catmull-Rom sentripetal melewati 8 titik dari blockout yang dipetakan ke ruangan situs, waktu dan sudut lewat kubik monoton supaya tidak overshoot, rig yaw/pitch Euler `YXZ`), truck K3 → K4. `data.ts`: `SolvedKey` untuk keyframe yang punya solve.
  - `sets/companyFront.ts`: `layoutParams` dipisah dari `build` dan `counterFrame(step)` (konter, Bu Dewi, lorong Nadia–Fajar, dinding) untuk kamera dan properti.
  - `sets/counterProps.ts`: leaflet dengan blok copy rencana, binder tertutup/terbuka dengan 4 ring dan 4 tab, pensil, tangan pengganti. `index.ts`: properti ditempatkan per layout, `cameraAt` menerima aspect layar.
- Temuan yang mengubah plan (ditanyakan di review):
  - Bu Dewi berdiri di lantai kasir (bahu ±1,55 m), jadi K2.4 di 1,48 m seperti blockout akan melihat punggungnya. K2.4 sekarang ±1,9 m di belakang kanan bahunya, lalu turun ke 1,44 m (pc) selama tilt + push (blockout: tinggi tetap).
  - Truck K3 → K4 pc 0,5 m (bukan 0,35): pensil K4 berada di antara leaflet dan binder, jadi dengan 0,35 pensil kuning terlihat di K3 padahal keyframe K3 kosong. Heru menggeser binder dari dekatnya ke tengah depan Bu Dewi.
  - Konter hp hanya 1,04 m dan mesin kasir masuk frame K3 hp; leaflet hp digeser 3 cm, truck hp 0,27 m, pensil hp di tepi depan konter di luar kedua frame.
  - Kertas putih hampir tidak terpisah dari permukaan konter (#fbf7f8 di bawah cahaya pagi hangat terlihat krem); keyframe: kertas putih di atas permukaan lila.
- Dicek: render K2.4, K3, K4 pc (1280×720) dan hp (450×800 dan 375×812) berdampingan dengan keyframe, urutan frame K2.2 → K3 pc berdampingan dengan blockout dan hp, Heru diganti posisi sementara di depan konter (gerak Heru di langkah 4); semua hanya di chat. Draw call pc K2.4 87, K3 47, K4 61; hp 67/45/56; segitiga maks 131 ribu (orbit). Tanpa error console. `typecheck`, `eslint` dan `prettier` untuk file yang diubah.
- Belum: review greybox oleh user; langkah 2–7.

### 2026-11-02 (tahap 5, langkah 2: set dan properti)

- User menyetujui greybox dengan ketiga rekomendasi ("Ya, lanjut langkah 2"): K2.4 ±1,9 m di belakang bahu kanan Bu Dewi lalu turun ke tinggi K3 selama tilt + push; truck K3 → K4 pc 0,5 m (hp 0,27 m) dengan Heru menggeser binder ke tengah; alas meja lila di bawah leaflet dan binder.
- `sets/companyFront.ts`: printer format besar (kabinet di kaki, unit cetak dengan slot dan cetakan keluar, gulungan kertas di atas) dan 3 bingkai oranye berisi cetakan putih di dinding kanan (dilihat dari pintu), dari Master 11b. Posisinya di depan meja Fajar ke arah pintu (`D4z + 3,0`): di 9:16 printer di sebelah meja Fajar sempat masuk tepi kanan K2 hp, jadi digeser sampai di luar frame K2 dan K2.2 pc/hp. Hanya material yang sudah dipakai ruangan, jadi tidak menambah draw call.
- `sets/counterProps.ts` (menggantikan greybox):
  - alas meja lila (#ddd0ea) dari batas frame K3 sampai K4, tidak sampai ke mesin kasir;
  - leaflet A4 satu material (kanvas putih + strip ungu 3 mm, 11 mm dari tepi atas), lanskap atau potret per layout;
  - binder: sampul belakang, punggung, tumpukan halaman krem dengan halaman atas yang naik 3 mm di dekat ring, 4 tab warna keyframe, batang ring dengan paku keling dan 4 ring baja, sampul depan berengsel di punggung. `setOpen` menutup atau melipat sampul ke bawah (animasi lipat di langkah 4);
  - pensil heksagonal kuning (dua ujung diraut) dan pink (penghapus + cincin logam), dibangun dari posisi ujung per layout;
  - bagian yang bergerak bersama digabung, bagian kecil berwarna lewat vertex color. Properti menambah ±6 draw call di K2 (versi pertama tanpa penggabungan menambah 32 dan K2 pc jadi 132).
  - Leaflet baru muncul di konter mulai K2.4 sampai Heru membawanya (langkah 4).
- `takes/home/counter.ts`: batas alas (`pad`) per layout.
- Bake AO ulang (printer dan bingkai mengubah dinding kanan dan lantai).
- Dicek: K2 dan K2.2 pc/hp dibanding still lama: selisih 0,05% piksel (aksi staf), printer tidak terlihat. Draw call pass utama pc K2 106 (sebelumnya 100), K2.2 76, K2.4 85, K3 44, K4 45; hp K2 104, K2.2 71, K2.4 66, K3 42, K4 45. Segitiga maks 138 ribu (K2). `typecheck`, `eslint`, `prettier` untuk file yang diubah. Render dikirim di chat.
- Belum: still K0–K2.2 belum dirender ulang (alas lila terlihat tipis di konter K2; dirender bersama still K3/K4 di langkah 6); warna kertas dan alas di tampak atas masih memakai cahaya pagi ruangan (preset close-up di langkah 4); di K4 hp keyframe kamera ±1 cm di kanan tengah halaman (ring terpotong di tepi kiri), sekarang kamera di tengah binder (disetel di langkah 4).

### 2026-11-03 (tahap 5, langkah 3: tangan close-up)

- User menyetujui langkah 2 ("Ya, lanjut langkah 3").
- `cast/closeHand.ts`: tangan kanan Heru dan Bu Dewi untuk tampak atas. Satu SDF (telapak dan pangkal telapak, 4 jari 3 ruas dengan buku jari, jempol 2 ruas, pergelangan) di-mesh `MarchingCubes` res 52 (hemat 36), sisi bawah yang menempel di meja dibuang. Kuku berupa elips pipih yang ditanam di ujung jari supaya tepinya tegas (warna per vertex di mesh MarchingCubes memberi tepi bergerigi). Lengan baju dari tabung: Heru jas ungu + manset kemeja putih, Bu Dewi tunik krem dengan pita motif oranye. Kulit, kuku dan lengan memakai vertex color, jadi satu tangan satu draw call. Pose `hold` (K3, ujung jari menekan sudut leaflet) dan `rest` (K4, bertumpu di konter). Proporsi jari disetel dari crop keyframe K3 pc: jari pendek dan gemuk (panjang ±3× lebar), rapat, kuku besar.
- `cast/vinyl.ts`: wrap lighting dipisah jadi `withWrap` (dipakai tangan); `vinylMaterial` tetap sama. `cast/sdf.ts`: `sdfGeometry(..., { merge: false })` untuk mesh yang toh dipakai tanpa indeks.
- `sets/counterProps.ts`: tangan pengganti dibuang; tangan close-up diserahkan dari chunk tokoh (`roster.buildCloseHands`, dibangun per mesh di antara jeda seperti tokoh), ujung jari tengah diletakkan di titik dari keyframe (relatif ke sudut leaflet di K3, ke binder di K4). Tampil hanya saat kamera menunduk lebih dari 60° (`HANDS_PITCH`); perubahan memicu gambar ulang bayangan. Di layout potret tangan diperkecil 0,7 karena keyframe hp menggambar tangan lebih kecil terhadap kertas daripada keyframe pc.
- Waktu bangun (Edge dengan GPU, dev): awalnya 140–170 ms per tangan (680–870 ms di CPU 4×), lebih lama dari potongan tokoh. Penyebab utama `mergeVertices` yang lalu dibatalkan `toNonIndexed`; ditambah jalan pintas SDF di atas tangan dan pemotongan per bagian. Sekarang 37–61 ms per tangan (175–252 ms di CPU 4×); total tokoh + tangan 0,66 s (2,4 s di CPU 4×), potongan terpanjang 61 ms (277 ms di CPU 4×, potongan tokoh).
- Anggaran: segitiga ±9–11 ribu per tangan (perkiraan plan 3–5 ribu); karena hanya tampil di tampak atas, K3 pc 76 ribu, K4 pc 76 ribu, hp 71–80 ribu. Draw call tidak berubah (K3 44, K4 45 pc; tangan menggantikan pengganti). Orbit tetap titik terberat (135,5 ribu).
- Dicek: K3/K4 pc dan K3 hp berdampingan dengan keyframe, crop tangan 1:1 (hanya di chat). `typecheck`, `eslint`, `prettier --check` untuk `world/`.
- Belum: tangan tokoh sendiri (IK) harus tiba di titik yang sama saat kamera melewati 60° supaya tidak meloncat (langkah 4); warna kulit masih di bawah cahaya pagi ruangan (preset close-up di langkah 4); pose transisi tangan (meletakkan, menggeser, membuka binder) di langkah 4.

### 2026-11-03 (tahap 5, langkah 4: gerak dan cahaya)

- User menyetujui langkah 3 ("Ya, lanjut langkah 4").
- `takes/home/counterCast.ts` (baru):
  - Heru punya jam beat 3 sendiri (seperti beat 1; mengejar scroll dengan pegas kritis, paling cepat 1,5× laju alami). Ia berjalan dari titik K2 lewat celah meja Bayu dan Nadia ke depan konter (`Walk`, langkah 0,42 m). Ia tiba di 1,0 layar beat 3, lalu meletakkan leaflet (1,1 s, mulai 0,25 s sebelum berhenti) sampai 1,3 layar; K2.4 jatuh di tengahnya, seperti blockout.
  - Leaflet dibawa di sisi kanan, dipegang di sudutnya dan menggantung dengan muka menghadap keluar-depan. Saat diletakkan, sudut itu berpindah melengkung ke sudut leaflet di konter dan orientasinya di-slerp ke datar; tangan kanan Heru mengikuti dengan IK (`walkPose` sekarang menerima `reachR`). Badan condong saat meletakkan, lalu sedikit tegak supaya kepalanya keluar dari tampak atas.
  - Bu Dewi: kepala naik saat Heru datang (0,55–0,85 layar), menunduk ke leaflet (1,0–1,3), tangan kanan meraih sudut terdekatnya (1,35–1,75), di beat 4 ke sebelah binder. Wajah berganti dari prihatin ke tertarik saat leaflet diletakkan (atlas dilukis ulang sekali). Tolehan ke Heru memudar selama beat 3.
- `sets/counterProps.ts`:
  - Leaflet mengikuti Heru.
  - Beat 4 dari scroll: Bu Dewi melepas (0–0,4), Heru menggeser leaflet keluar frame ke kiri (0,05–0,35), memindah tangan ke binder dan menariknya ke tengah (0,35–0,72), sampul terbuka (0,72–0,95), lalu tangan ke posisi bertumpu K4.
  - Sampul diayun 180° ke kiri di tepi atas punggung, lalu diselipkan ke bawah binder sambil turun (versi pertama memiringkan binder supaya sampul lewat di bawah, dan terlihat aneh).
  - Tangan close-up berpindah pose di tengah lintasan, dengan sedikit terangkat.
- Konflik keyframe: pensil kuning K4 berada tepat di tempat binder tertutup di K3. Binder K3 (pc) digeser sedikit ke kanan sampai bebas dari pensil, jadi strip binder di tepi kanan K3 pc sekarang di luar frame. Pensil hp dipindah 1,5 cm ke tepi depan.
- `core/light.ts`: preset close-up (langit lavender putih, tanah lila muda, matahari lebih lemah dan netral, lingkungan lebih terang), di-blend dari cahaya ruangan saat kamera menunduk 35° → 75°; lampu gantung meredup bersamanya.
- `index.ts`:
  - jam Heru beat 3;
  - pose Bu Dewi dari scroll, juga di still dan di tampak atas;
  - loop ambient ruangan berhenti di tampak atas;
  - di tampak atas lengan bawah kanan Heru dan Bu Dewi dilipat (skala tulang ±0) ke dalam lengan baju tangan close-up. Lipatan diputuskan sebelum pose; bug pertama: IK sempat dihitung dengan lengan terlipat dan tidak diulang, sehingga tangan Heru tidak memegang leaflet.
- `takes/home/heru.ts`: `walkTime`, `walked`, `heruK2Spot` diekspor. `sets/companyFront.ts`: `counterFrame` mendapat `gapX/gapZ`.
- Dicek:
  - urutan frame K2.2 → K3 pc berdampingan dengan blockout, dan hp;
  - beat 4 pc dalam 9 langkah; K3/K4 pc dan hp dengan cahaya close-up berdampingan dengan keyframe (hanya di chat);
  - kaki Heru yang menapak bergeser ≤ 1,5 mm (pc) dan 2,3 mm (hp), maju dan mundur, di 300 posisi scroll;
  - draw call pass utama pc K2.4 86, K3 42, K4 45, maks di orbit 90; hp 67/42/45; segitiga maks 137 ribu;
  - tanpa error console; `typecheck`, `lint`.
  - `format:check` gagal hanya di `components/home/stills.json` (tidak diubah sesi ini; dibuat ulang bersama still di langkah 6).
- Belum: copy HTML (langkah 5); kamera K4 hp tidak digeser (tengah halaman keyframe hp dan pc sama-sama ±1 cm dari tengah binder); tes FPS dan HP.

### 2026-11-04 (plan ulang halaman Solusi)

- Permintaan user: plan ulang halaman Solusi dari Solusi v1 (artefak `AZX3Jy8e9Bmmdnu9tLL8Jb` dan tiga dokumen terlampir); kasir memakai Heru 3D dengan baju berbeda.
- Disalin dari Downloads: `docs/SOLUSI-V1-LOGIKA.md`, `docs/SOLUSI-V1-VISUAL.md`, `docs/SOLUSI-V1-COPY.md`, `prototype/solusi-etalase-v1.html`. Isi artefak sama dengan file HTML (artefak hanya menambah pembungkus runtime).
- Temuan: dokumen v1 merujuk SOLUSI-SPEC dan kode Solusi (`components/solusi/`, `content/solusi/`, `world/sets/toko.ts`) yang tidak ada di repo ini; messages hanya punya `pages.solutions.title`. Raka di v1 ±2,7 m dengan kepala 0,54 m, jadi Heru 1,8 m perlu diskalakan ±1,77 di toko. Kartu masalah tanpa tombol tidak lulus WCAG 2.2 AA (2.5.7).
- Riset: satu canvas + scissor (manual three.js), biaya `getBoundingClientRect` per frame, WCAG 2.5.7/2.5.1, `<dialog>` native, JetBrains Mono lewat `next/font/google`, `node:test` dengan type stripping di Node 24.
- Ditulis `PLAN-SOLUSI.md` (draf); baris tahap 12–13, keputusan Solusi dan bagian "Tahap 12 dan 13" di plan ini sekarang merujuk ke sana. Kode `site/` tidak diubah.
- Jawaban user (dicatat di `PLAN-SOLUSI.md` 9): bangun dari nol tanpa SOLUSI-SPEC; Solusi setelah Home tahap 11; kasir Heru berkaos putih lengan pendek, celemek ungu tepi cyan, kerah cyan, papan nama polos, struk "Kasir: Heru"; nama platform boleh di halaman Solusi; pop up kontak hanya di Solusi; analytics per kanal; penanda kartu jadi tombol; hasil Cari tanpa WebGL berupa daftar HTML; JetBrains Mono; draf EN oleh Claude; selisih v1 lainnya ikut v1.
- User menyetujui plan Solusi ("Setuju").
- Belum: riset dan cek ulang plan saat Solusi dimulai (setelah tahap 11). Commit dokumen v1 dan plan menunggu permintaan user.

### 2026-11-06 (tahap 5, revisi langkah 4: leaflet muncul di konter)

- Masukan user: Heru tidak perlu terlihat menenteng leaflet; leaflet cukup dikeluarkan dari bawah saat ia sudah sampai di meja.
- `takes/home/counterCast.ts`:
  - Heru berjalan dengan tangan kosong (lengan berayun biasa);
  - begitu berhenti (1,0 layar beat 3), tangannya turun ke bawah tepi konter dan leaflet naik dari sana, berdiri di tepi dekatnya, tepat di depan konter, tersembunyi oleh daun konter dari sisi Bu Dewi;
  - leaflet lalu rebah ke depan di atas tepi konter (rotasi di tepi depan) dan digeser ke tempatnya (1,3 layar), jari Heru tetap di sudutnya;
  - lama gerak 1,3 s, mulai tepat saat ia berhenti;
  - leaflet tidak ada sebelum itu;
  - siku kanan diarahkan keluar ke samping setinggi bahu: di konter 9:16 (setinggi dada) siku yang jatuh membuat tangan terlihat seperti di dagu.
- K3 tidak berubah (posisi akhir leaflet dan tangan sama).
- Dicek: urutan frame 0,9–1,45 layar beat 3, pc dan hp (hanya di chat); `typecheck`, `lint`.

### 2026-11-06 (tahap 5, revisi langkah 4: binder tidak terbuka secepat scroll)

- Masukan user: binder terbuka sangat cepat saat di-scroll.
- Penyebab: fase buka (0,72–0,95 dari K3 → K4) hanya ±0,14 layar dan mengikuti scroll langsung; dengan scroll cepat sampul terbuka dalam ±0,15 s.
- `takes/home/counterCast.ts`:
  - beat 4 mendapat jam sendiri, seperti jalan Heru: scroll menentukan tujuan, dunia mengejar paling cepat 1,5× laju alami dan bisa diputar mundur;
  - `B4_SECONDS` 5,5 s pada laju alami, dengan fase `B4_PHASES`: lepas (Bu Dewi), geser leaflet, tangan ke binder, tarik 0,42–0,58, buka 0,58–0,92, tangan bertumpu.
- `sets/counterProps.ts`, `index.ts`: semua gerak beat 4 (leaflet, binder, sampul, tangan close-up, tangan Bu Dewi) memakai jam itu; kamera tetap mengikuti scroll.
- Dicek: scroll langsung dari jeda K3 ke jeda K4 (Edge dengan GPU), sampul terbuka ±1,4 s (sebelumnya ±0,15 s), urutan selesai ±3,8 s setelah lompatan; video dikirim di chat. `typecheck`, `lint`, `prettier --check world`.

### 2026-11-06 (tahap 5, langkah 5: copy desktop dan HP)

- User menyetujui revisi beat 4 dan meminta lanjut ke langkah 5.
- Komponen (`components/home/props/`):
  - `Leaflet.tsx` (server): H2 "Empat cara kami membantu usaha Anda" + 4 layanan (judul, isi, label "E-course segera hadir");
  - `Binder.tsx` (client): H2, intro, contoh tab aktif, tombol Konsultasi gratis + catatan, dan 4 tab industri ARIA (`tablist` vertikal, klik/ketuk, panah, Home, End, fokus ikut). Tiap tombol tab berada di atas tab 3D-nya, dengan nama industri berdiri di tab. Area sentuh diperluas ke luar tepi halaman sampai ≥ 44 px.
  - Dirender di server lewat `HomeStage` → `HomeTake` (`copy`); H2 dan tab ada di HTML prerender ID dan EN.
- World:
  - `core/anchors.ts` `rectAnchorFrom`;
  - `sets/counterProps.ts` `copyAnchors` (wajah leaflet dan halaman binder + strip tab, dari transform mesh tiap frame, jadi copy ikut leaflet yang digeser), `holdAnchors`, dan `fade`: copy leaflet masuk saat kamera tegak 72° → 86° setelah tangan diam, pergi saat leaflet digeser; copy binder masuk setelah sampul terlipat dan tangan bertumpu;
  - `sets/binderLayout.ts` (angka halaman, tab dan area copy tanpa three, dipakai world dan HTML);
  - `index.ts`: `FrameInfo.fade` dan `sizes` (ukuran kotak = ukuran di layar saat jeda, diukur dengan kamera jeda; teks digambar ±1:1 di jeda, jadi tajam).
- `placeHero.ts` `placeAnchors`: elemen `data-fade` diberi ukuran dari world, opacity, `data-shape` (lanskap/potret), dan disembunyikan (`visibility: hidden`, tidak bisa di-tab) saat tidak tampil.
- `stage.css`:
  - versi tumpuk sederhana (section biasa; dirapikan di langkah 6);
  - film: tata letak dalam unit kontainer (`cqw`/`cqh`); leaflet 4 kolom di lanskap dan bertumpuk di potret, keduanya di luar jari Heru (kiri atas) dan Bu Dewi (kanan bawah);
  - halaman binder dengan kolom tab; di halaman sempit (< 300 px, HP) contoh digeser satu per layar dengan scroll-snap.
- Bar header mengambang menutupi judul binder di K4: `counter.ts` `setSafeTop` membuat tampak atas sedikit lebih lebar dan bergeser supaya kertas berada di bawah header (`WorldOptions.safeTop`, dari `HomeTake`). K4 sekarang dibingkai pada halaman (setebal binder di atas konter), seperti keyframe.
- Tangan close-up dan lipatan lengan sekarang per tokoh: tangan Bu Dewi muncul begitu tangannya di sudut (1,75 layar), tidak menunggu leaflet Heru. Di HP sebelumnya lengan aslinya sempat terlihat dari atas.
- Clip-path di bawah jari tidak dipasang: tata letak menghindari jari saat jeda, copy leaflet memudar sebelum tangan Heru pindah ke binder, dan copy binder baru masuk setelah kedua tangan diam. Tidak ada saat ketika tangan melintas di atas teks.
- Dicek:
  - jeda K3/K4 di 1280×720, 375×812 dan 360×640, ID dan EN (hanya di chat);
  - urutan masuk/keluar copy dengan scroll sungguhan di Edge dengan GPU;
  - tab: klik mouse, ketuk di area sentuh di luar tepi halaman (HP), ArrowDown/End/Home dengan fokus ikut;
  - tanpa error console;
  - `typecheck`, `lint`, `format:check` (lulus; `stills.json` ikut dirapikan prettier), `build` (semua halaman statis).
- Belum: langkah 6 (`#layanan` ke K3, versi tumpuk, still K3/K4, fallback).

### 2026-11-06 (tahap 5, revisi langkah 5: leaflet lebih hidup)

- Masukan user: leaflet terlalu hambar (kertas putih dengan teks saja, bagian bawah kosong di pc).
- `props/Leaflet.tsx`: kicker "Layanan" di atas H2 (pesan `nav.services`), tiap layanan dapat ikon garis (SVG inline, `aria-hidden`) dan nomor 01–04.
- `stage.css`:
  - tiap layanan punya warna brand sendiri (ungu, cyan, violet, navy) sebagai aksen dan tint;
  - pc: 4 kartu bertint yang berakhir di atas jari Bu Dewi;
  - HP potret: baris dengan ikon di samping judul dan garis pemisah, tanpa isi kartu (kolomnya terlalu pendek untuk padding, dan isi kartu akan menutupi jari Bu Dewi);
  - `@container (max-height: 440px)` merapatkan baris di 360×640;
  - versi tumpuk ikut memakai kartu yang sama.
- `sets/counterProps.ts`: logo Kreatekno dicetak di tekstur kertas setelah gambarnya termuat. Di lanskap di kaki leaflet dengan garis tipis; di potret di kanan atas, sebaris dengan kicker. Jadi leaflet tidak kosong saat naik dan digeser.
- Dicek:
  - K3 pc 1440×810, HP 375×812 dan 360×640 (ID), pc dan HP (EN), dengan gambar dikirim di chat;
  - copy tetap di dalam kertas dan di luar jari;
  - versi tumpuk (reduced motion);
  - `typecheck`, `lint`, `format:check` lulus.
- Belum: langkah 6. Still K3 nanti dirender dengan cetakan baru.

### 2026-11-06 (tahap 5, langkah 6: halaman, versi tumpuk, still K3/K4, fallback)

- **`#layanan`:** penanda lompat `.take-mark`, anak `.take` di luar panggung.
  - Di film, penanda duduk di posisi scroll tengah jeda K3 (`--at` × 100lvh dari `keyP("K3")`), jadi menu "Layanan" mendarat di leaflet dengan copy sudah masuk.
  - Section placeholder "Layanan" di `page.tsx` dihapus. "Cara kerja" tetap.
- **Lompatan scroll:** `HomeTake` memotong (`world.jump`) kalau scroll berpindah lebih dari 2 layar sekaligus (tautan lompat, tombol End, scrollbar). Dengan begitu kamera tidak terbang melewati seluruh take, dan jam Heru serta beat 4 tidak mengejar beberapa detik.
- **Still:**
  - `tools/render/stills.mjs` dan `lib.mjs` sekarang merender K0–K4 pc/hp, termasuk K0–K2.2 ulang yang kini menampilkan alas lila di konter;
  - posisi leaflet di K3 dan halaman binder di K4 dicatat di `stills.json`;
  - di K0 hanya anchor billboard yang dicatat;
  - ukuran K3/K4: pc 15,0 dan 18,0 KB, hp 9,7 dan 7,1 KB;
  - teks alt `home.stage.k3` dan `k4` (ID/EN) ditambah.
- **Fallback tanpa WebGL:**
  - still berganti ke K3 di 8,2–8,6 layar dan ke K4 di 9,85–10,3 layar;
  - copy leaflet dan halaman binder ditempatkan di still dengan homografi `quadMatrix3d` (`placeHero.ts`, tanpa three.js), ukurannya dari quad di layar, memudar mengikuti scroll.
- **Versi tumpuk (reduced motion, tanpa JS):**
  - `.take` menjadi grid dan `.take-stage` `display: contents`, sehingga urutannya: K2.2, `#layanan`, still K3, kartu layanan, still K4, tab industri, halaman binder;
  - tab di atas halaman: aturan flex pindah ke `.binder-in`, karena sebelumnya ada di kotak luar dan tidak berlaku.
- **Dicek dengan Edge (GPU):**
  - menu "Layanan" di pc dan hash di HP mendarat di K3 dengan copy penuh;
  - fallback tanpa WebGL di K3/K4, pc dan HP;
  - versi tumpuk pc dan HP dengan `#layanan` di bawah header;
  - tanpa error console.
- `tools/render/shots.mjs compare` melewati K3/K4, karena prototype k0-k2 tidak punya keduanya.
- **Belum:** langkah 7 (cek akhir dan review tahap).

### 2026-11-06 (tahap 5: scroll lebih mulus)

- **Masukan user:** gerakan scroll masih patah-patah.
- **Cara ukur:** skrip sementara (Playwright, Edge dengan GPU) men-scroll seluruh take 1.500 px/detik di build produksi, sambil merekam jarak antar frame, long animation frame dan profil CPU. Playwright memakai GPU Intel UHD, bukan RTX, jadi angkanya mewakili laptop tanpa kartu grafis atau browser yang berjalan di iGPU. Skrip dihapus setelah selesai.
- **Penyebab:**
  1. Shader dikompilasi saat objek pertama kali tampil, sehingga scroll macet 0,2–1,5 detik di crane down (1,5 layar), di whip ke K2.2 (5,7 layar) dan di beat 3–4. Situs belum punya pemanasan shader.
  2. Shadow map (109 caster, 193 ribu segitiga, seluruh jalan dan ruangan) digambar ulang di setiap frame scroll. Pemicunya: kunci pose Bu Dewi di luar ruangan dan di tampak atas memakai posisi scroll, jadi ia dipose ulang tiap frame padahal pose-nya tetap.
  3. Di GPU Intel frame tertahan oleh sampling bayangan 2048: dengan bayangan 1024 median turun dari 16,7 ke 11,3 ms.
- **Perubahan:**
  - `world/index.ts` dan `core/whipBlur.ts`, pemanasan:
    - semua tekstur di-upload dan semua shader dikompilasi di latar (`compileAsync`, KHR_parallel_shader_compile) sebelum world crossfade, sementara still K0 tetap tampil;
    - termasuk properti tersembunyi dan varian render target untuk blur whip;
    - diulang setelah tokoh selesai dibangun dan saat ruangan dibangun ulang;
    - diakhiri satu frame yang menggambar semuanya sekali ke scissor 1 px (layar dan target whip, plus bayangan), karena ANGLE D3D11 baru menyusun executable-nya di draw pertama;
    - di produksi `renderer.debug.checkShaderErrors` dimatikan.
  - Kunci pose Bu Dewi memakai isi pose (JSON), bukan posisi scroll.
  - Pembaruan bayangan maksimal 30× per detik di semua perangkat (sebelumnya hanya HP), termasuk dari properti beat 3–4.
  - Tangga kualitas menggantikan penurun dpr lama. Kalau 12 dari 60 frame terakhir meleset dari refresh layar saat kamera bergerak (setelah tokoh selesai dibangun):
    - bayangan turun ke 1024;
    - lalu dpr turun 0,25 sampai 1;
    - tidak pernah naik lagi;
    - still dan shot review tetap kualitas penuh.
  - `placeHero.ts`: `placeAnchors` memakai satu objek `matchMedia`.
- **Hasil di build produksi (scroll wheel, pc 1440×810):**

  | | Sebelum | Sesudah |
  |---|---|---|
  | Median frame | 27,8 ms | 16,7 ms |
  | p99 | 100 ms | 28–33 ms |
  | Frame terpanjang | 1.028–1.455 ms | 55–94 ms |
  | Frame > 25 ms | 54–68% | 2–8% |

  Profil tidak lagi menunjukkan kompilasi saat scroll; jumlah shadow pass turun dari 305 menjadi 151 per scroll penuh, dan nol di 0–2,5 layar. HP 375×812 dengan CPU 4× lebih lambat: median 16,6 ms, frame > 25 ms 2,6%.
- **Dicek:** K2, K2.2, K3, K4 pc dan HP tampil sama, tanpa error console; `typecheck`, `lint`, `format:check`, `build` lulus.
- **Belum:**
  - tes di HP Android sungguhan;
  - wajah Bu Dewi yang dilukis ulang di awal beat 3 (atlas kanvas, ±40 ms sekali);
  - lampu gantung (3 point light) mahal per piksel di iGPU; kandidat untuk tahap 11 kalau HP murah masih berat.

### 2026-11-07 (tahap 5, langkah 7: cek akhir)

- **K3/K4 berdampingan dengan keyframe pc dan HP** (hanya di chat). Komposisinya sesuai. Selisih yang sudah diketahui:
  - tampak atas sedikit lebih lebar dan turun di bawah header (langkah 5);
  - binder tidak tampak di tepi kanan K3 pc (letaknya dipilih di langkah 2 supaya pensil kuning tidak masuk frame K3);
  - kertas dan alas sedikit lebih gelap dari keyframe;
  - K4 HP memperlihatkan binder utuh (keyframe memotong ring di kiri).
- **K2.2 → K3 dibandingkan dengan blockout v3** di 8 titik jalur (0–8 s): dolly di lorong, orbit ke bahu kanan Bu Dewi, jeda K2.4 saat Heru meletakkan leaflet, tilt dan push ke tampak atas. Gambar hanya di chat.
- **Scroll maju lalu mundur, pc dan HP:** copy leaflet tampak di K3, copy binder di K4. Saat kembali ke K3 binder tertutup lagi, dan saat kembali ke K2 leaflet hilang serta Heru dan Bu Dewi kembali ke pose K2.
- **Teks:** di jeda K3/K4 transform copy berskala 1,000 tanpa perspektif (kotak = ukuran di layar), jadi teks digambar 1:1.
- **Tab:** klik (pc), ketuk (HP), End dan ArrowDown dengan fokus ikut; area sentuh 44 px.
- **Anggaran:**
  - pass utama pc K2.4 86 draw call / 135,5 ribu segitiga, K3 45 / 77,0 ribu, K4 46 / 76,1 ribu;
  - HP 74 / 121,0 ribu, 42 / 70,8 ribu, 45 / 79,8 ribu;
  - chunk world 26,3 KB gzip, chunk tokoh 27,0 KB gzip (batas 120 KB), three 82,3 + 67,7 KB gzip.
- **Bug yang ketemu dan diperbaiki:**
  - Frame pemanasan menunggu kamera diam, padahal di mode shot kamera dikunci ke keyframe dan scroll halaman 0, jadi still dan shot tidak pernah siap. Sekarang shot dianggap diam. Ditambah batas 1,5 s supaya pengunjung yang terus men-scroll saat loading tidak menahan world.
  - Tangan close-up ditambahkan dalam keadaan terlihat dan baru disembunyikan saat kunci properti berubah. Di jeda yang diam keempatnya tetap digambar (K2.4 sempat 90 draw call / 183 ribu segitiga). Sekarang tersembunyi sampai update berikutnya menempatkannya.
- **Dicek:** console tanpa error, `format:check`, `typecheck`, `lint`, `build` lulus.
- **Belum:** tes di HP Android sungguhan.
- **Review:** user menyetujui tahap 5 ("Disetujui", 7 Nov). Belum di-commit.

### 2026-11-07 (tahap 6 riset dan plan)

- Acuan baru dari user: 8 video 16:9 di `refs/footage/tahap6/` (dipindah dari Downloads oleh sesi induk). Belum ada versi 9:16.
- Dibaca: `CLAUDE.md`, `PLAN.md`, `HANDOFF.md`, `docs/STORY-STAGE.md`, dokumen tim beat 4–5b dan copy customer journey (hlm. 9–10, 19–20, tabel beat), Master 1, 2, 3–6, 7 dan 8, `sets/street.ts`, `takes/home/timing.ts`, `data.json`, messages `home.journey`.
- Frame tiap video diekstrak dengan ffmpeg ke scratchpad (lembar 12 frame per video, frame awal dan akhir, lebih rapat di K4 → K4.1, K4.1 → K4.2 dan K5a.5 → K5a.6). Kecepatan truck diukur dengan korelasi fase antar frame.
- Temuan:
  - tujuh nama file berarti "akhir - awal", hanya `k5a.5 - k5a.6` "awal - akhir"; urutan kontinu K4 → K4.1 → K4.2 → K5a.1 → … → K5a.6 dicek dari selisih frame akhir dan awal;
  - kamera keluar sendiri dulu (K4.2), Heru dan Bu Dewi menyusul (K5a.1); anggukan Bu Dewi di K4.1;
  - truck rata ±0,3 lebar frame per detik dari K5a.2 sampai K5a.5, tiap keyframe membingkai dua panel; berhenti di K4.1, K4.2, K5a.1 dan K5a.6;
  - deret ruko sama dengan Master 7; ±60 m dari COMPANY ke pintu Kreatekno, jadi tokoh di video berjalan ±4 m/s;
  - K5a.6 setara K5 dokumen tim, tapi panel CTA elektronik sudah hampir keluar frame;
  - cahaya luar lebih terang dan netral dari K1;
  - di video K4 ada 4 alat tulis dan tanpa tangan; di K5a.3 → K5a.4 kedua tokoh saling menembus.
- Riset singkat: penggabungan geometri per klaster supaya frustum culling tetap jalan; tempo scrollytelling dikendalikan pembaca, teks yang bergerak perlu ritme baca; interpolasi dolly zoom lewat tinggi frustum, bukan FOV langsung.
- Jawaban user: hanyut pelan di K5a.2–K5a.5, ±8 layar, HP satu panel per jeda, Heru menyalip menjelang Kreatekno, cahaya pagi menjelang siang, jeda pendek di K4.1 dan K5a.1, copy panel selalu terlihat, pintu COMPANY menutup sendiri seperti video (4 alat tulis dan tangan tetap ikut tahap 5), langkah campuran (dari jarak sampai ±1,8 m/s, di atasnya kaki sedikit meluncur).
- Catatan: rincian durasi di pilihan "±8 layar" yang ditanyakan ternyata berjumlah 9,5 layar; plan memakai potongan yang lebih pendek supaya total 8,0 (take ±19,9 layar), disetel saat review greybox.
- Plan tahap 6 ditulis (bagian 5); baris tahap 6 dan catatan per tahap diperbarui; `refs/README.md` mencatat arah video. Kode `site/` tidak diubah, tidak ada commit.
- Belum: persetujuan plan oleh user; dokumen tim perlu diperbarui (catatan di plan); versi 9:16 beat 5a–5b dari tim.

### 2026-11-07 (tahap 6, plan disetujui, langkah 1: ukur dan greybox)

- User menyetujui plan tahap 6 di sesi induk sebelum plan selesai: "setelah ada hasilnya langsung jalankan sesi baru untuk implementasi". Implementasi dimulai di sesi baru.
- Diukur di frame akhir video (skrip di scratchpad; titik hilang sambungan paving, skala pintu 2,03 × 2,2 m dan ruko 7 m, kedalaman dari kerb). Bangunan di video adalah komposisi AI yang proporsinya tidak sama dengan situs (COMPANY lebih sempit, pintu lebih lebar), jadi set situs tetap dan hanya kamera yang dicari, seperti solve K2.1/K2.2:
  - K4.2: frontal, x +0,62, tinggi 1,40 m, 5,8 m dari fasad, FOV vertikal 43,6°, menengadah 1°. Bukan lensa panjang seperti dugaan plan: FOV hampir sama dengan ruangan, jadi tidak perlu interpolasi tinggi frustum;
  - K5a.1: x 3,82, tinggi 3,27, jarak 10,9, FOV 43,9°;
  - truck: tinggi 3,63, jarak 12,7, FOV 40,3°, datar; pusat frame K5a.2–K5a.5 di batas ruko buah/laundry, sepatu/warteg, kosmetik/warnet, warung/elektronik (tiap keyframe maju 2 ruko = 14,1 m), K5a.6 di 0,42 lebar Kreatekno;
  - K4.1 (tidak ada titik ruangan yang cocok): pc 1,8 m di belakang Heru dan 1,2 m di kirinya, tinggi 2,1, FOV 30°; Heru berdiri tepat di depan Bu Dewi, jadi kamera harus menyamping supaya kepalanya tidak menutupi Bu Dewi;
  - Kreatekno ±12,4 m (1,75 ruko), pintu di 0,52 lebarnya; pintu Kreatekno ±63 m dari pintu COMPANY.
- Dibangun (greybox, tetap dipakai di langkah berikutnya):
  - `takes/home/timing.ts`: `K4.1`, `K4.2`, `K5a.1`–`K5a.6` dan segmen sesuai plan (8,0 layar). Take 11,9 → 19,9 layar.
  - `sets/rowLayout.ts` (angka tanpa three, dipakai world dan halaman nanti): 8 ruko 7 m (warna dari video), panel 5,2 × 2,06 m di y 5,25, bukaan toko 4,9 × 2,75 m, Kreatekno, ruko ujung.
  - `sets/row.ts`: greybox deret ruko (satu grup per ruko, digabung per material), panel dengan rencana copy digambar di kanvas, Kreatekno (kaca ungu, pita nama, plakat, lampu, pintu), ruko ujung, trotoar, kerb dan jalan sampai x ±101. Ruko buah dan laundry dipindah dari `sets/street.ts` ke sini (K0/K1 dicek sama).
  - `takes/home/outside.ts`: kamera beat 5 (naik + putar 180° menunduk, lalu tilt ke belakang Heru; mundur lewat celah meja dan pintu, berhenti sesaat di K4.2 lalu dolly out; truck dengan Hermite: dari diam, hanyut 2,5 m di tiap jeda pc ≈ 18% laju truck, melambat ke K5a.6). HP: tiap jeda dibagi panel kiri, geser 0,16 layar, panel kanan; warnet dan warung dilewati. FOV jalan dilebarkan di layar lebih sempit dari 9:16 supaya lebar panel tetap (`fitFov`). Posisi tokoh sementara: keluar pintu setelah K4.2, lalu ikut kamera dengan offset dari frame video.
  - `world/index.ts`: deret ruko, Heru dan Bu Dewi di jalan (`walkPose` dari jarak, sementara), aksi ruangan berhenti di jalan, awan mendung staf yang dekat kamera disembunyikan saat kamera mundur di atas meja. `core/light.ts` `follow`: kotak bayangan matahari ikut x kamera (dibulatkan per meter).
- Dicek (hanya di chat): keyframe K4.1–K5a.6 pc berdampingan dengan frame akhir video; urutan 5 frame per gerak untuk 8 video, pc dan HP 375×812; K0/K1 pc dan HP sama dengan still. Teks langkah di panel HP muat: panel 303 × 120 px di 360×640 (316 × 125 di 375×812), isi terpanjang (langkah 1/2 ID) butuh 95 px dengan judul 16 px dan isi 13 px, jadi panel HP tidak perlu dibuat lebih tinggi.
- Anggaran (pass utama): K4.1 64 draw call / 64,5 rb segitiga; K4.2 121 / 143 rb; K5a.1 134 / 149 rb; K5a.2 118 / 126 rb; K5a.3–K5a.6 28–45 / 27–34 rb (HP K5a.2–K5a.6 16–49). K4.2 sampai K5a.2 melewati batas 120 karena ruangan COMPANY dan tokohnya ikut digambar di balik fasad. Rencana langkah 2: sembunyikan ruangan saat kamera di luar dan pintu tertutup, lepas set setelah K5a.2 seperti plan.
- Temuan yang perlu diputuskan di review: kecepatan jalan tokoh (±13,6 m per layar scroll, jadi di scroll wajar 1 layar per 2 detik ±7 m/s); bayangan diagonal penghalang K1 jatuh ke ruko; K4.1 HP kamera di kanan Heru (lampu gantung tepat di antara Heru dan Bu Dewi di ruangan 9:16).
- `typecheck`, `eslint world`, `prettier` untuk file yang diubah lulus; console tanpa error.
- Belum: review greybox oleh user; langkah 2–5. Pintu COMPANY masih terbuka (langkah 3), cahaya luar masih pagi K1.

### 2026-11-07 (tahap 6, langkah 2: set)

- User menyetujui greybox dengan rekomendasinya ("Ya, lanjut langkah 2"):
  - ruangan COMPANY disembunyikan saat kamera di luar (beat 5), lalu dilepas setelah K5a.2;
  - penghalang bayangan diagonal K1 dibatasi ke sekitar COMPANY bersama preset cahaya luar (langkah 3);
  - langkah tokoh: irama dan panjang langkah dari jarak tempuh sampai jalan cepat ±2,5 m/s (bukan 1,8), di atasnya kaki boleh meluncur.
- Dibangun:
  - `sets/shop.ts` (bundle utama): satu ruko detail: dinding depan berbentuk dengan bukaan (material sendiri untuk peta AO), pilar dengan alas dan kepala, lis atas, pita lantai, kap di atas bukaan, panel putih berbingkai, pintu lipat putih di kedua sisi bukaan, ruang toko sedalam 1,9 m (lantai AO, dinding belakang, plafon dengan lampu strip) dan barang dari video: peti buah bertingkat dengan pisang, rak baju lipat + gantungan + mesin cuci, rak sepatu, etalase lauk + bangku, rak kosmetik + meja, meja PC + kursi, rak jajanan + renceng, rak elektronik. Barang dan isi toko satu mesh warna per vertex (`Tint`). ±6 draw call per ruko, di-cull per ruko. Ruko buah dan laundry dibangun bersama jalan (terlihat sejak K0/K1).
  - `sets/row.ts` (chunk sendiri, 2,6 KB gzip, dimuat 1,5 layar sebelum K4.1, atau langsung untuk still/shot/bake): ruko sepatu sampai elektronik, kantor Kreatekno (fasad ungu, jendela panjang lantai 2 berbingkai dengan pilaster tengah, pita nama dengan tulisan KREATEKNO memakai font display situs, etalase kaca dengan pintu dua daun yang daun kanannya berengsel untuk langkah 3, dinding dengan plakat kayu kosong untuk beat 9b dan lampu kuningan, lobi terang samar di balik kaca), ruko ujung (balkon dengan pagar, rolling door), trotoar per ruko (bidang AO, ubin selaras dengan trotoar jalan), kerb, jalan dan marka sampai x ±101.
  - `sets/street.ts`: pola ubin trotoar diekspor (`drawPaveTiles`), latar ruang depan di balik pintu (tampil saat ruangan tidak digambar).
  - `world/index.ts`: ruangan, properti konter, staf, awan mendung dan HP Sinta tidak digambar saat kamera di luar di beat 5 (Heru dan Bu Dewi tampil lagi begitu keluar); ruangan dilepas mulai jeda K5a.2 dan dibangun ulang saat scroll kembali sebelum K5a.1.
  - `core/light.ts` `follow`: kotak bayangan matahari digeser di bidang cahaya per 28 texel (±1 m, sama untuk peta 1024 dan 2048), jadi grid texel tidak bergeser di set statis dan peta digambar ulang sekitar sekali per meter.
  - `tools/render/bake-ao.mjs`: peta `row-*` di-bake bersama langkah 0. Bake ulang langkah 0: 33 peta (26 baru untuk deret ruko, 98 KB) dalam 12,7 s; `ext-pave` ikut berubah sedikit di depan ruko buah.
- Dicek (hanya di chat): K5a.1–K5a.6 pc berdampingan dengan video dan HP 375×812 dengan AO; K1 pc dan HP sama dengan still yang ada; scroll lompat ke K5a.3 lalu kembali ke K4.1: ruangan dibangun ulang, staf tampil lagi.
- Anggaran (pass utama, pc / HP): K1 119 draw call · 146 rb segitiga / 118 · 144 rb (sebelumnya 118 · 141 rb); K4.2 35 · 62 rb; K5a.1 47 · 83 rb / 37 · 74 rb; K5a.2 42 · 98 rb; K5a.3–K5a.6 34–42 · 30–63 rb; HP K5a.2–K5a.6 19–27 · 12–53 rb. Chunk world 13,5 KB gzip, chunk tokoh 27,6 KB, chunk deret ruko 2,6 KB.
- `typecheck`, `lint`, `format:check`, `build` lulus; console tanpa error.
- Belum: pintu COMPANY menutup, pintu Kreatekno dibuka Heru, cahaya luar baru dan pembatasan penghalang bayangan K1 (diagonal masih jatuh ke ruko), gerak tokoh (langkah 3); copy panel (langkah 4).

### 2026-11-07 (tahap 6, revisi ritme beat 5b, langkah 3: gerak dan cahaya)

- Permintaan user setelah review set: kamera berhenti di setiap ruko sementara tokoh tetap berjalan dengan kecepatan normal; tokoh tidak perlu selalu di tengah frame. Jawaban user atas dua pertanyaan:
  - kamera pc berhenti diam di tiap keyframe K5a.2–K5a.5 (tetap dua ruko per frame seperti video; HP tetap satu panel per jeda, juga berhenti diam). Hanyut pelan di jeda dihapus; panjang take tetap;
  - Heru dan Bu Dewi berjalan dengan jam sendiri begitu keluar pintu (±1,3 m/s, ±48 detik sampai Kreatekno), tidak menunggu scroll. Kalau scroll lebih cepat dari mereka, mereka tertinggal lalu menyusul paling cepat 1,5×; di K5a.6 kamera menunggu sampai mereka tiba dan Heru membuka pintu. Scroll mundur sampai sebelum titik keluar memutar balik.
- Akibatnya kaki tidak pernah meluncur (laju maksimum 1,5 × 1,3 ≈ 2,0 m/s, di bawah batas jalan cepat 2,5 m/s), jadi langkah selalu dari jarak tempuh.
- Plan tahap 6 (tabel keputusan "Ritme truck", "Langkah", "Tokoh") diperbarui sesuai ini.
- **Kamera:** di `takes/home/outside.ts` hanyut pelan dihapus. Kamera pc berhenti diam di K5a.2–K5a.5. Di HP, kamera berhenti diam di panel kiri, bergeser 0,16 layar, lalu berhenti diam di panel kanan. Tiap gerak antar jeda mulai dan berhenti halus (Hermite dengan kecepatan 0 di ujung). Jalur K4 → K4.1 dirapikan supaya kamera lewat di bawah tudung lampu gantung (dari 2,2 m), tidak menembusnya.
- **Tokoh** (`takes/home/outsideCast.ts`, baru), semuanya fungsi murni dari jam keluar (detik):
  - Heru keluar duluan, mendorong daun pintu kiri COMPANY ke luar, lalu menahan tepinya dengan tangan kanan (IK) sampai Bu Dewi lewat. Daun pintu menutup sendiri, dan Bu Dewi menunggu sebentar sampai Heru di sampingnya.
  - Mereka berjalan berdampingan 1,3 m/s; Heru di sisi toko, Bu Dewi di sisi jalan. Sesekali mereka saling menoleh.
  - 11 m sebelum Kreatekno, Heru mempercepat ke 1,8 m/s dan memutar lewat sisi jalan. Ia mendorong pintu Kreatekno ke dalam, masuk, lalu berbalik menghadap Bu Dewi. Bu Dewi berjalan sampai ke pintu dan menghadapnya.
  - Langkah memakai `Walk` dari jarak tempuh dengan laju yang diintegrasikan (`TimedWalk`, akselerasi 1,6 m/s²), jadi kaki tidak pernah meluncur. Tiap ruas diakhiri kedua kaki rapat, jadi tidak ada kaki menggantung saat berhenti.
  - Jam (`stepOutClock`): mulai 0,15 layar setelah K4.2. Jam berjalan 1× menurut waktu; kalau tertinggal dari posisi scroll (`scrollClock`), menyusul paling cepat 1,5×. Kalau scroll mundur sampai sebelum titik keluar, jam diputar balik (atau langsung ke 0 kalau mereka sudah jauh). Kalau kamera kembali ke dalam, mereka langsung di konter. Still, shot dan lompatan memakai `scrollClock`, yang menaruh mereka di frame tiap jeda.
- **Pintu:**
  - daun kanan COMPANY (terbuka sejak beat 1) menutup setelah kamera mundur melewatinya;
  - daun kiri sekarang ikut bergerak (`street.leafL`);
  - daun kanan Kreatekno digerakkan dari jam keluar.
- **Bu Dewi di K4.1:** mengangguk sekali dengan mata terpejam dan senyum lebih lebar. Anggukan berjalan menurut waktu (1,4 s) begitu scroll sampai jeda K4.1, dan berbalik kalau scroll naik.
- **Cahaya** (`core/light.ts`): preset luar "pagi menjelang siang" (matahari lebih tinggi dan netral dari kiri, langit lebih biru), di-blend saat kamera keluar lewat pintu (beat 5). Arah matahari ikut berubah; kotak bayangan memakai arah yang sedang aktif. Penghalang bayangan diagonal K1 dipotong di x 5. Dicek: diagonal di COMPANY utuh, dan deret ruko tidak terkena.
- **Bug ditemukan dan diperbaiki:** bake AO di langkah 2 merusak peta ruangan `int-0` (wilayah gelap besar di dinding belakang dan lantai K2). Penyebabnya, occluder baru (dinding ruko, lantai toko, trotoar) dikirim sebagai geometri berindeks, padahal tracer AO hanya membaca posisi. Sekarang dikirim lewat `clean` dan sudah di-bake ulang. K0–K4 pc dan HP kembali sama dengan still (rata-rata selisih 1,4–2,1 dari 255; piksel berbeda > 40 paling banyak 0,34% di K1). Render street langkah 2 tidak terpengaruh, tapi wilayah gelap di K4.1 pada render sebelumnya berasal dari bug ini.
- **Dicek** (hanya di chat):
  - urutan frame pc;
  - video scroll sungguhan pc 1280×720 dan HP 375×812: dari K4, jeda baca 2–3,5 s di tiap keyframe, berhenti 10 s di K5a.6. Direkam dengan screencast CDP dan ffmpeg lokal, karena perekam video Playwright butuh unduhan ffmpeg sendiri.
  - draw call pc K4.1 63, K4.2 35, K5a.1 46, K5a.2–K5a.6 34–41;
  - `typecheck`, `eslint` lulus.
- **Belum:**
  - copy panel dan halaman (langkah 4);
  - hijab Bu Dewi saat berjalan baru mengikuti pegas tahap 4, belum dicek dari dekat;
  - siluet di balik kaca buram sebelum pintu terbuka (video) tidak dibuat; tokoh baru terlihat saat daun pintu terbuka.

### 2026-11-07 (struktur plan detail Solusi per slug)

- Permintaan user: `PLAN-SOLUSI.md` menjadi induk yang mereferensikan subplan masing-masing detail solusi, setelah mempelajari prototipe detail Order Grup dan tiga dokumen lampiran.
- Diubah hanya dokumentasi: induk sekarang punya indeks 12 slug dan batas tanggung jawab; S6 merujuk fondasi detail bersama dan tahapan per slug. `docs/plans/solusi/PLAN-DETAIL.md` memiliki kontrak template/schema/route/mesin/fallback/QA; `PLAN-ORDER-GRUP.md` menjabarkan pilot 9 adegan. Sebelas subplan lain memakai data dan langkah HTML dari COPY katalog, dengan cerita 3D belum tersedia.
- Tiga sumber `SOLUSI-DETAIL-ORDER-GRUP-V1-{LOGIKA,VISUAL,COPY}.md` disalin dari Downloads ke `docs/` tanpa perubahan; SHA-256 salinan cocok. HTML artifact belum disimpan ke repo.
- Status persetujuan dibedakan: lingkup etalase 4 Nov tetap tercatat disetujui; perluasan detail dan keputusan desain/anggaran baru adalah draf. Urutan Solusi sesudah Home tahap 11 dipertahankan. Hubungan inline vs overlay Tonton, figur/robot vs ORB, layout tablet, dan kebijakan konten ditulis sebagai keputusan terbuka, bukan diasumsikan dari lampiran.
- Riset resmi dicatat di fondasi: batas zoom CSS3DRenderer, prerender locale/slug, ukuran target sentuh beserta pengecualiannya. Klaim repo di sumber dikoreksi pada lapisan plan: three aktual `0.186.1`, helper WA di `lib/wa.ts`, script `size` dan `core/quality.ts` belum tersedia.
- Validasi dokumen: indeks mencakup 12 slug katalog tepat satu kali, semua tautan markdown lokal pada plan baru/perubahan menunjuk file yang ada, serta data identitas/langkah 11 subplan cocok dengan sumber. Kode dan aset website tidak diubah dalam pekerjaan ini; build/runtime test tidak dijalankan karena perubahan hanya markdown.
- Belum: review keputusan terbuka, ekspor HTML prototype detail, implementasi S0–S7/D0–D4/OG0–OG4, dan benchmark perangkat. Tidak ada commit/push.

### 2026-11-07 (tahap 6, revisi langkah 3: tokoh ikut scroll mundur)

- Masukan user atas video: kalau scroll ke atas, tokoh harus ikut mundur. Usul saya, jam yang mengejar scroll (pola Heru beat 1 dan 3), disetujui ("Ya, ubah begitu").
- `takes/home/outsideCast.ts` `stepOutClock`:
  - jam keluar sekarang mengejar `scrollClock` maju dan mundur dengan `followClock` dari `heru.ts` (pegas kritis, paling cepat 1,5× laju 1,3 m/s);
  - kalau scroll berhenti, tokoh berjalan sampai titik scroll lalu berhenti; kalau scroll naik, mereka berjalan mundur;
  - kalau jarak ke titik scroll lebih dari 3 detik jalan dan tokoh di luar pandangan kamera, jam dipindah langsung ke titik 1,5–12 detik sebelum tujuan yang juga di luar pandangan. Sisanya mereka jalani dalam pandangan, jadi lompatan tidak pernah terlihat;
  - `world/index.ts` mengecek pandangan dengan frustum kamera frame sebelumnya (bola 1,1 m di tubuh tiap tokoh).
- Plan tahap 6, baris "Ritme truck": tokoh kini ikut scroll, tidak lagi memakai jam bebas.

### 2026-11-07 (tahap 6, revisi K4.1: posisi tokoh)

- Masukan user (tangkapan layar K4.1 di layar 952×846, di antara 16:9 dan 9:16): posisi tokoh aneh. Ada dua penyebab:
  - kamera pc di kiri Heru dan kamera HP di kanan Heru di-blend, jadi pada rasio di antaranya kamera tepat di belakang Heru dan Bu Dewi tertutup kepalanya;
  - lengan kanan Heru dan Bu Dewi masih terjulur ke titik tangan close-up di samping binder (beat 4), padahal dari samping posisi itu terlihat janggal.
- `takes/home/outside.ts` `k41View`: kamera selalu di kiri Heru (pc 1,2 m, 9:16 1,0 m), jadi kepalanya di kanan frame dan tidak menutupi Bu Dewi di semua rasio. Di 9:16 kamera lebih rendah (1,9 m), di bawah tudung lampu gantung.
- `b5Relax`: selama kamera naik dari tampak atas ke K4.1, tangan Heru lepas dari binder dan lengannya turun; kedua tangan Bu Dewi kembali di konter seperti K2 (video K4.1), dan badannya tegak (`poseHeru3` dan `dewiPose3` mendapat parameter `relax`).
- Dicek (hanya di chat): K4.1 di 1280×720, 952×846 dan 375×812; `typecheck`, `eslint`.

### 2026-11-07 (tahap 6: kamera ditahan di copy, perbaikan pemindahan tokoh)

- **Bug pemindahan tokoh:** saat tokoh di luar layar dan jauh dari titik scroll, jamnya dipindah ulang ke titik yang sama setiap frame, jadi mereka berhenti di luar layar (misalnya tidak pernah tiba di K5a.6). Sekarang pemindahan hanya dilakukan kalau membuat mereka lebih dekat ke tujuan. Dicek: setelah scroll cepat ke K5a.6 dan kembali ke K5a.3, mereka berjalan masuk frame.
- **Masukan user:** setiap kali copy tampil, layar ditahan sebentar walaupun pengunjung terus scroll. Saat ini copy leaflet dan binder belum sempat terlihat ketika adegan sudah lanjut, begitu juga di ruko. Hanya tokoh yang terus ikut scroll, sedangkan kamera tertahan di bangunan. Jawaban user: ditahan 1,5 detik sejak copy terlihat penuh, hanya saat scroll maju.
- **`world/index.ts` dwell:**
  - saat scroll maju, kamera berhenti di awal jeda K3 (leaflet), K4 (halaman binder) dan tiap panel ruko K5a.2–K5a.5 (di 9:16 tiap panel), meskipun scroll sudah lewat;
  - kamera dilepas 1,5 s setelah copy terlihat penuh (K3/K4 menunggu fade copy = 1, jadi di K4 menunggu sampul selesai terbuka), atau paling lama 8 s;
  - scroll yang terkumpul selama ditahan dijalankan sesudahnya dengan pegas kamera biasa;
  - scroll mundur tidak ditahan, dan titik henti aktif lagi kalau kamera kembali 0,3 layar sebelumnya;
  - lompatan scroll (menu, End) tetap memotong;
  - di jalan, tokoh mengikuti posisi scroll, bukan kamera yang ditahan;
  - ini juga mengubah K3/K4 tahap 5 (sudah disetujui sebelumnya); di luar dwell perilakunya sama.
- `takes/home/outside.ts` `panelArrivals`: titik tiba kamera di tiap panel (pc dan 9:16).
- **Dicek:** scroll terus 1 layar per 0,6 s dari K2.2. Kamera tertahan di K4 3,6 s (menunggu sampul terbuka + 1,5 s), lalu di K5a.2 dan K5a.3 masing-masing ±2,4 s. `typecheck`, `eslint` lulus.

### 2026-11-07 (tahap 6, langkah 4: copy dan halaman)

- User menyetujui gerak dan dwell ("Ya, lanjut langkah 4").
- **`components/home/props/Journey.tsx`** (server): copy customer journey di panel ruko. Teksnya HTML asli yang dirender di server, jadi H2 "Cara kerja" (`#h-cara-kerja`) dan keempat langkah ada di HTML prerender ID dan EN.
  - ruko buah: kicker + H2;
  - laundry, sepatu, warteg, kosmetik: langkah 1–4 (nomor bulat berwarna brand, H3, isi);
  - elektronik: tombol "Konsultasi gratis" (WhatsApp, `section="journey"`) dengan panah ke arah pintu Kreatekno;
  - warnet dan warung kosong.
- **World** (`world/index.ts`): anchor `journey-*` di wajah panel, 8 cm ke dalam dari tepi.
  - Kotak copy berukuran sama dengan ukurannya di layar saat kamera berhenti di panel itu, jadi teks digambar 1:1 di sana. Ukuran pc sekitar 390 × 147 px, 9:16 sekitar 285 × 110 px.
  - Copy tampil selama panelnya di layar dan kamera sudah di jalan, atau tersembunyi (`visibility: hidden`, tidak bisa di-tab) di luar itu. Panel ruko 2–7 menunggu chunk deret ruko.
- **CSS** (`stage.css`): tata letak dalam unit kontainer dengan batas bawah untuk HP (judul langkah ≥ 16 px, isi ≥ 13 px). Di 360×640 dan 375×812 semua langkah muat, termasuk langkah 1 dan 2 yang terpanjang.
- **Halaman:**
  - `#cara-kerja` jadi penanda lompat di awal jeda K5a.2 (+0,06 layar), bukan di tengahnya, karena di 9:16 tengah jeda jatuh di antara dua panel. Menu "Cara kerja" mendarat di K5a.2 dengan judul tampil.
  - Section placeholder "Cara kerja" di `page.tsx` dihapus.
  - Teks alt still `home.stage.k4_1`, `k5a_1` … `k5a_6` ditambahkan (ID/EN).
- **Still** (`tools/render`):
  - pc K4.1, K5a.1–K5a.6 (25–46 KB);
  - 9:16 juga, tapi diambil saat kamera berhenti di panel, plus `K5a.2b` dan `K5a.3b` untuk panel kedua (14–32 KB);
  - posisi copy panel per still dicatat di `stills.json`;
  - K0–K4 dirender ulang bersama, tanpa perubahan isi.
- **Fallback tanpa WebGL** (`HomeTake.tsx`): still beat 5 bergantian mengikuti scroll, dan copy tiap panel ditempatkan di still-nya (homografi) sampai still berikutnya masuk. Di 16:9, still "b" sama dengan still jedanya.
- **Versi tumpuk** (reduced motion, tanpa JS): penanda `#cara-kerja`, still K5a.2, judul, empat langkah, tombol; still beat 5 lainnya tidak tampil di versi ini.
- **Dicek** (hanya di chat):
  - halaman pc 1280×720 (ID, EN) dan 9:16 375×812 serta 360×640 (ID, EN) di setiap panel;
  - fallback tanpa WebGL pc dan HP;
  - versi tumpuk;
  - tautan `#cara-kerja` pc dan HP;
  - `typecheck`, `lint`, `format:check`, `build` lulus; console tanpa error.
- **Belum:** langkah 5 (cek akhir tahap: anggaran di semua titik, FPS CPU 4×, memori setelah set dilepas, tes HP sungguhan).

### 2026-11-07 (tahap 6: ruko kosong dihapus)

- **Masukan user:** ruko yang kosong dihilangkan saja. Jawaban user atas pertanyaan K5a.5: digabung ke K5a.4.
- **Perubahan:**
  - deret ruko tinggal 6: buah, laundry, sepatu, warteg, kosmetik, elektronik, lalu Kreatekno. Warnet dan warung, yang panelnya kosong, dihapus dari `sets/rowLayout.ts` beserta barangnya di `sets/shop.ts`;
  - pintu Kreatekno kini ±49 m dari pintu COMPANY (sebelumnya ±63 m);
  - `K5a.5` dihapus dari `timing.ts`. K5a.4 membingkai kosmetik (langkah 4) dan elektronik (Konsultasi gratis) berdampingan, lalu kamera lanjut ke K5a.6. Take 19,9 → 18,8 layar (beat 5a–5b 6,9 layar);
  - di HP, K5a.4 sekarang dua panel: kosmetik, lalu elektronik;
  - still `K5a.5` dihapus; `K5a.4b` (HP, panel elektronik) ditambahkan; teks alt `k5a_4` diperbarui dan `k5a_5` dihapus;
  - AO deret ruko di-bake ulang (27 peta);
  - still dirender ulang.
- Plan tahap 6, perlu disesuaikan dengan keputusan ini:
  - tabel gerak, baris K5a.4 → K5a.5 dan K5a.5 → K5a.6 dari video, sekarang menjadi satu gerak K5a.4 → K5a.6;
  - catatan untuk tim: urutan keyframe sekarang K5a.1–K5a.4, K5a.6.

### 2026-11-07 (tahap 6, langkah 5: cek akhir)

- **Anggaran** (pass utama, setiap 0,1 layar sepanjang take, shot):
  - pc 1280×720: titik terberat tetap K1 (119 draw call / 146,7 rb segitiga, sama seperti sebelum tahap 6); beat 5 paling banyak 89 / 126 rb;
  - HP 375×812: K1 118 / 143,9 rb; beat 5 paling banyak 85 / 126 rb;
  - chunk world 13,2 KB gzip, chunk deret ruko 2,7 KB.
- **Memori:**
  - melepas ruangan (jeda K5a.2) membebaskan 61 geometri dan 5 tekstur (peta AO);
  - tiga siklus lepas–bangun ulang memberi angka yang sama (199 → 138 → 199 geometri, 62 → 57 → 62 tekstur), jadi tidak ada kebocoran.
- **Copy:** di setiap perhentian pc dan HP, transform copy panel berskala 1,000 tanpa perspektif (teks 1:1). Tombol CTA bisa difokus saat panelnya di layar dan tersembunyi (tidak bisa di-tab) saat di luar layar.
- **Diperbaiki saat profil:**
  - lampu gantung ruangan kini tinggal di world, tidak di dalam ruangan. Sebelumnya, melepas atau membangun ulang ruangan mengubah jumlah lampu dan membuat semua shader dikompilasi ulang (tersendat di K5a.2 dan saat kembali);
  - ruangan, properti dan staf yang tersembunyi tidak lagi diperbarui matriksnya;
  - panel, pintu lipat dan barang di dalam toko tidak lagi menggambar bayangan.
- **FPS** (build produksi, scroll rata 1 layar per 1,5 s, Playwright memakai GPU Intel; tangga kualitas menurunkan dpr ke 1). Angka ini lebih tinggi dari tahap 5 karena keadaan mesin dan harness berbeda, jadi yang dipakai adalah perbandingan di sesi yang sama:

  | | beat 1–4 (K1 → K4) | beat 5 (K4 → K5a.6) |
  |---|---|---|
  | pc, CPU 1× (median / p95) | 22,1 / 33,4 ms | 22,0 / 27,9 ms |
  | pc, CPU 4× (median / p95) | 38,9 / 66,7 ms | 38,9 / 72,3 ms |
  | HP 375×812, CPU 4× (median / p95) | 27,7 / 44,5 ms | 22,2 / 44,4 ms |

  Beat 5 tidak lebih berat dari beat 1–4. Satu kali halaman crash saat dimuat di tengah rangkaian run berturut-turut, dan tidak terulang di run berikutnya.
- **Render** (hanya di chat):
  - K0–K4 pc dan HP sama dengan still (rata-rata selisih 1,4–2,0; piksel berbeda > 40 paling banyak 0,05%);
  - jeda K4.1–K5a.6 pc berdampingan dengan frame akhir video;
  - HP 375×812 di setiap perhentian.
- `typecheck`, `lint`, `format:check`, `build` lulus; console tanpa error.
- **Belum:** tes di HP Android sungguhan (tertunda sejak tahap 2, hanya bisa dilakukan user).

### 2026-11-07 (tahap 6 disetujui, push ke GitHub untuk Vercel)

- User: "tahap 6 disetujui. push ke github main pekerjaan homepage. saya mau deploy ke vercel".
- Satu commit di `main` berisi pekerjaan Home sejak commit `ebdc5af`: revisi tahap 4, tahap 5 (beat 3–4), tahap 6 (beat 5a–5b), still, peta AO, tool render, `PLAN.md` dan `refs/README.md`.
- Tidak ikut commit: pekerjaan Solusi yang masih berjalan (`PLAN-SOLUSI.md`, `docs/SOLUSI-*`, `docs/plans/`, `site/content/`, `site/lib/solusi/`, `tools/solusi/`, `prototype/solusi-etalase-v1.html`) dan screenshot debug `tools/hash_*.png`. Kode Home tidak mengimpor file Solusi.
- Dicek: tidak ada keyframe tim atau isi `refs/` (selain README) di commit; build bersih dari isi commit (salinan terpisah, `npm ci` lalu `build`) lulus.
- Belum: tes di HP Android sungguhan; deploy Vercel dilakukan user (Root Directory `site`).

### 2026-11-09 (perbaikan issue GitHub #1: Heru bolak-balik di HP)

- Issue #1 (dibuat user 8 Nov): di HP, saat Heru berjalan ke meja Bu Dewi (K2.2 → K2.4), ia berbalik arah lalu kembali lagi.
- Penyebab: jalur di `takes/home/counterCast.ts` melewati celah meja Bayu–Nadia lalu titik ancang-ancang 0,7 m di depan konter. Di layout HP ruangan lebih rapat, jadi celah meja sejajar dengan titik berdiri Heru (z −8,39), sedangkan titik ancang-ancang ada di z −7,68. Heru melewati celah, mundur 0,7 m ke titik ancang-ancang, lalu berbalik lagi. Di step 2 mundurnya ±5 cm, di step 3 ±38 cm. Step 0–1 (desktop) tidak terkena.
- Diubah: kalau celah tidak minimal 0,25 m di depan titik ancang-ancang, kedua titik digabung menjadi satu titik (x celah, z ancang-ancang). Titik tengah jalur memakai z yang lebih dekat ke pintu. Jalur desktop tetap sama.
- Dicek: posisi pinggul Heru disampel dengan Playwright (lompatan scroll deterministik dan scroll berjalan 3 s) di 375×812, 360×640, 700×800, 800×700 dan 960×540. Tidak ada titik balik; titik akhir di konter tidak berubah. Frame HP K2.2 → K2.4 dicek visual (hanya di scratchpad). Typecheck, ESLint, Prettier lulus.
- Komentar penyebab dan perbaikan dipasang di issue #1. Atas permintaan user, perbaikan di-commit ke `main` (hanya `counterCast.ts` dan entri log ini; pekerjaan Solusi tidak ikut) lalu di-push.
- Belum: tes di HP Android sungguhan; issue #1 masih open.

### 2026-11-09 (alur menyelesaikan issue GitHub)

- Issue #1 ditutup (completed) setelah commit `04612e6` di-push; status dicek lewat API GitHub.
- Atas permintaan user, alur resolve issue dijadikan panduan proyek di `CLAUDE.md` (bagian "Alur menyelesaikan issue GitHub"): cek issue → investigasi dan reproduksi → komentar penyebab dan perbaikan → implementasi → tes dan verifikasi → konfirmasi user → commit ke `main` dengan tag issue dan push → tutup issue.
- Atas permintaan user, `CLAUDE.md` dan entri log ini di-commit ke `main` lalu di-push (pekerjaan Solusi tidak ikut).

### 2026-11-09 (issue GitHub #3: awan hujan diganti gelembung pikiran)

- Issue #3 (CR): awan hujan di atas kepala staf dihilangkan. Penggantinya harus tetap terbaca sekilas di shot lebar K2 (alasan awan dipasang 2 Nov).
- Riset singkat: uap dari kepala umumnya dibaca sebagai marah, jadi tidak dipilih. Opacity per instance tidak ada di InstancedMesh bawaan, jadi semua prototipe opak gaya vinyl.
- Prototipe yang dirender dan direview di chat (K2 lebar PC, sebagian K2.2): uap, pusaran kertas, baterai, jam pasir, gelembung pikiran, benang kusut. Pelajaran: yang terbaca di shot lebar adalah siluet gelap atau warna kuat di depan dinding pucat. Alternatif dan penjelasannya dikomentari di issue #3 (gambar ditambahkan user).
- Pilihan user: gelembung pikiran dengan isi berbeda per staf, mengikuti pose K2 dan empat kartu layanan di `COPY.md`: Sinta balon chat hijau bertumpuk dengan titik merah (Agen AI WhatsApp), Bayu tumpukan slip dan struk panjang (Otomasi admin), Nadia bohlam padam di antara kertas diremas (Otomasi konten), Fajar map SOP dan tanda tanya (Asisten pengetahuan). Tanpa teks dan logo platform.
- Diubah:
  - `cast/acts.ts`: `createGloom` dan konstanta `RAIN` dihapus; `createThought` baru. Gelembung: bola pipih bertepi gelap (bola sendiri sedikit lebih besar, back face) dengan dua bola kecil ke kepala, di sisi kepala yang berlawanan dengan tetes keringat; tepi dan gelembung instanced per sisi, isi per staf satu mesh (vertex colour), tanpa bayangan. Gelembung bernapas pelan, isinya bergoyang. Gelembung Nadia 6 cm lebih tinggi supaya bola kecilnya tidak menempel di pita sanggul;
  - `cast/roster.ts`: ekspor `createThought` menggantikan `createGloom`;
  - `world/index.ts`: `gloom` jadi `thoughts`, `cloudGeo` tidak diimpor lagi (tetap dipakai langit di `sets/sky.ts`). Gelembung tetap disembunyikan dekat kamera saat beat 5 mundur di atas meja dan saat ruangan tidak digambar;
  - still K2, K2.1, K2.2 pc dan HP di `site/public/stills/` dirender ulang (hanya tiga key ini, still lain tidak disentuh).
- Dicek: render K2, K2.1, K2.2, K3, K4, K5a.1 pc dan HP, dan 10 frame K4 → K5a.1 (dikirim di chat); draw call pass utama pc K2 100 → 108, K2.1 71 → 82, K2.2 73 → 81; HP K2 98 → 106; segitiga maks 159,4 rb (awan 131,7 rb). Typecheck, ESLint, Prettier untuk file yang diubah lulus; `build` lulus; console hanya 404 skrip analytics Vercel lokal.
- Belum: animasi isi gelembung (chat bertambah, tumpukan goyah); tes FPS di HP Android sungguhan; konfirmasi user, commit dan penutupan issue.

### 2026-11-09 (issue GitHub #2: kamera mengikuti tokoh di jalan ruko)

- Issue #2 (CR, dibuat user 8 Nov): kamera berhenti di setiap ruko untuk copy. Diminta: kamera mengikuti tokoh, tokoh selalu di tengah, dan tokoh berjalan karena scroll.
- Reproduksi (Playwright `?hud`, scroll rata 2 s per layar K5a.1 → K5a.6, posisi tengah pasangan di layar dalam NDC): pc 1280×720 kamera diam di x 11,8 / 25,9 / 40,0 / 52,3 dan tengah tokoh di −0,4 sampai −1,4 (113 dari 127 sampel lebih dari 0,25 dari tengah); HP 375×812 kamera tertahan dwell sementara tokoh sudah sampai +10 NDC, kamera menyusul ±6 s setelah scroll berhenti.
- Jawaban user: tokoh terikat langsung ke scroll (panjang take tetap, jadi ±12 m per layar), lensa truck tetap (frontal seperti video, panel utuh, copy 1:1), pusat frame di tengah pasangan.
- Diubah:
  - `takes/home/outsideCast.ts`: mulai akhir jeda K5a.1, jam keluar mengikuti `scrollClock` dengan pegas kaku (12/s) tanpa batas laju. Pegas hanya menutup sisa jeda dari jalan keluar pintu yang masih dibatasi laju. `pairX(c)`: tengah Heru dan Bu Dewi per jam, dihaluskan ±0,6 s dan tidak pernah mundur selama mereka maju.
  - `takes/home/outside.ts`: kurva Hermite dengan jeda diam di K5a.2–K5a.4 dihapus. `truckX` mengikuti `pairX` (smooth max dengan x K5a.1, smooth min dengan framing K5a.6), jadi kamera diam di K5a.1 sampai tokoh masuk ke tengah, mengikuti mereka, lalu berhenti di framing K5a.6.
  - `takes/home/index.ts` `cameraAt`: parameter jam keluar (default dari scroll, untuk still dan shot).
  - `world/index.ts`: dwell di panel ruko dihapus (dwell K3 dan K4 tetap); jam tokoh mengikuti scroll yang tampil, kamera memakai jam tokoh.
- Dicek:
  - ukur ulang: tengah pasangan 0,000 NDC di sepanjang jalan pada 1280×720, 1920×1080 (build produksi), 768×1024, 375×812 dan 360×640 (build produksi); hanya bergeser di K5a.1 (keyframe, −0,47) dan framing akhir K5a.6 (+0,15–0,18);
  - scroll maju 0,5 layar lalu berhenti: tokoh berhenti ±0,6 s kemudian (inersia kamera); scroll mundur: kembali ke titik semula, tetap di tengah (pc, HP, tablet);
  - tautan `#cara-kerja` mendarat dengan judul "Cara kerja" di tengah di pc, HP dan tablet;
  - frame pc dan HP sepanjang jalan dicek visual (hanya di scratchpad dan chat);
  - typecheck, ESLint, Prettier untuk file yang diubah lulus; `build` lulus; console hanya 404 skrip analytics Vercel lokal.
- Belum: still fallback tanpa WebGL beat 5 masih framing per panel (jadi crossfade still → live saat halaman dimuat di tengah jalan ruko berpindah framing); tes di HP Android sungguhan; konfirmasi user, commit dan penutupan issue.

### 2026-11-09 (issue GitHub #3: awan hujan diganti gelembung pikiran)

- Issue #3 (CR): awan hujan di atas kepala staf dihilangkan. Penggantinya harus tetap terbaca sekilas di shot lebar K2 (alasan awan dipasang 2 Nov).
- Riset singkat: uap dari kepala umumnya dibaca sebagai marah, jadi tidak dipilih. Opacity per instance tidak ada di InstancedMesh bawaan, jadi semua prototipe opak gaya vinyl.
- Prototipe yang dirender dan direview di chat (K2 lebar PC, sebagian K2.2): uap, pusaran kertas, baterai, jam pasir, gelembung pikiran, benang kusut. Pelajaran: yang terbaca di shot lebar adalah siluet gelap atau warna kuat di depan dinding pucat. Alternatif dan penjelasannya dikomentari di issue #3 (gambar ditambahkan user).
- Pilihan user: gelembung pikiran dengan isi berbeda per staf, mengikuti pose K2 dan empat kartu layanan di `COPY.md`: Sinta balon chat hijau bertumpuk dengan titik merah (Agen AI WhatsApp), Bayu tumpukan slip dan struk panjang (Otomasi admin), Nadia bohlam padam di antara kertas diremas (Otomasi konten), Fajar map SOP dan tanda tanya (Asisten pengetahuan). Tanpa teks dan logo platform.
- Diubah:
  - `cast/acts.ts`: `createGloom` dan konstanta `RAIN` dihapus; `createThought` baru. Gelembung: bola pipih bertepi gelap (bola sendiri sedikit lebih besar, back face) dengan dua bola kecil ke kepala, di sisi kepala yang berlawanan dengan tetes keringat; tepi dan gelembung instanced per sisi, isi per staf satu mesh (vertex colour), tanpa bayangan. Gelembung bernapas pelan, isinya bergoyang. Gelembung Nadia 6 cm lebih tinggi supaya bola kecilnya tidak menempel di pita sanggul;
  - `cast/roster.ts`: ekspor `createThought` menggantikan `createGloom`;
  - `world/index.ts`: `gloom` jadi `thoughts`, `cloudGeo` tidak diimpor lagi (tetap dipakai langit di `sets/sky.ts`). Gelembung tetap disembunyikan dekat kamera saat beat 5 mundur di atas meja dan saat ruangan tidak digambar;
  - still K2, K2.1, K2.2 pc dan HP di `site/public/stills/` dirender ulang (hanya tiga key ini, still lain tidak disentuh).
- Dicek: render K2, K2.1, K2.2, K3, K4, K5a.1 pc dan HP, dan 10 frame K4 → K5a.1 (dikirim di chat); draw call pass utama pc K2 100 → 108, K2.1 71 → 82, K2.2 73 → 81; HP K2 98 → 106; segitiga maks 159,4 rb (awan 131,7 rb). Typecheck, ESLint, Prettier untuk file yang diubah lulus; `build` lulus; console hanya 404 skrip analytics Vercel lokal.
- Belum: animasi isi gelembung (chat bertambah, tumpukan goyah); tes FPS di HP Android sungguhan.
- Setelah konfirmasi user: di-commit ke `main` sebagai `d443b2d` (hanya bagian issue #3 dari `world/index.ts`, `cast/roster.ts` dan `PLAN.md`; pekerjaan issue #2 dan Solusi tidak ikut) lalu di-push. Issue #3 ditutup (completed), dicek lewat API GitHub.

### 2026-11-09 (investigasi issue GitHub #4: scroll leaflet dan binder)

- Lingkup permintaan: investigasi dan usulan solusi; belum implementasi. Pemeriksaan memakai source `main` dan build produksi lokal yang sudah tersedia, bukan build ulang. Pekerjaan Solusi yang belum di-commit tetap dipertahankan.
- Penyebab: `world/index.ts` menahan kamera di K3/K4 sampai opacity copy >= 0,99, lalu 1,5 detik lagi (batas tunggu 8 detik). `timing.ts` juga mengalokasikan hold K3 1,2 layar dan K4 1,5 layar. Animasi binder memakai jam 5,5 detik dengan batas laju 1,5×; copy baru muncul di fase akhir saat tangan beristirahat. Copy leaflet dan data semua tab binder sudah disediakan dari halaman awal, bukan diambil lewat jaringan saat beat tampil.
- Reproduksi Playwright `?hud`, setelah world dan cast siap: scroll dari 8,2 ke 12,7 layar pada 2 detik/layar. Kamera diam di K3 selama 1,92–2,07 detik dan K4 selama 5,13–5,16 detik pada 375×812, 768×1024, dan 1280×720. Di HP pada 1 detik/layar, kamera K4 diam 5,75 detik; viewport berhenti scroll pada 4,5 detik, kamera baru stabil di tujuan sekitar 10,28 detik. Permintaan jaringan selama pengukuran hanya chunk ruko dan AO ruko berikutnya; tidak ada permintaan copy K3/K4. Tidak ada pageerror. Bukti JSON dan skrip hanya di scratchpad visualizations. Pembacaan opacity pada tiga run pertama tidak memperhitungkan visibility; angka opacity tersebut tidak dipakai sebagai bukti keterlihatan. Run HP cepat sudah membaca keduanya.
- Usulan: hapus forced dwell K3/K4; hilangkan 2,7 layar hold sehingga take 18,8 menjadi 16,1 layar jika durasi move dipertahankan; sinkronkan fase props/tangan/copy dengan progress scroll yang ditampilkan agar copy siap ketika kamera tiba. Sesuaikan fade fallback, anchor dan tool stills yang memakai angka layar tetap. Perlu review keterbacaan dan interaksi tab saat pengunjung menghentikan scroll.
- Loading: pertahankan still hero dan persiapan GPU yang sudah ada (`initTexture`, `compileAsync`, warm draw). Perkuat readiness K0–K4 agar menunggu cast/tangan, font, AO dan warm-up selesai sebelum transisi live, dengan fallback bila gagal. Preload aset ruko berikutnya di latar selama intro; memuat seluruh website di awal tidak diperlukan untuk bug ini. Cache jaringan tidak menggantikan konstruksi geometri dan persiapan GPU pada sesi baru.
- Belum: implementasi, pengukuran sesudah perbaikan, visual QA solusi, tes jaringan lambat dan HP fisik. Tidak ada perubahan source aplikasi, komentar GitHub, commit, push, atau deploy.

### 2026-11-10 (verifikasi ulang investigasi issue GitHub #4)

- Lingkup: memeriksa ulang temuan 9 Nov terhadap kode `HEAD` (698083d) dan build produksi `HEAD` yang dibuat terpisah dari working tree (worktree sementara di scratchpad, port 3400, sudah dihapus). Skrip ukur ditulis baru, terpisah dari `tools/render/issue4.mjs`, dan hanya ada di scratchpad: posisi dan rotasi kamera per frame, opacity dan visibility copy, request jaringan. Viewport 375×812 (mobile), 768×1024 (mobile) dan 1280×720; scroll rata 8,2 → 12,7 layar pada 2 dan 1 detik per layar.
- Terbukti dari kode `HEAD`: dwell di `world/index.ts` (`DWELL_S` 1,5, `DWELL_MAX_S` 8, titik K3 `fade.leaflet` dan K4 `fade.page` >= 0,99); hold K3 1,2 dan K4 1,5 layar di `timing.ts` (take 18,8); jam beat 4 `B4_SECONDS` 5,5 dengan batas `PACE` 1,5×, copy halaman binder baru muncul di fase `rest` (0,88–1).
- Pengukuran ulang (kamera diam selagi scroll masih jalan): K3 2,04–2,12 s dan K4 5,12–5,14 s pada 2 s/layar, sama dengan angka 9 Nov. Pada 1 s/layar K3 1,59–1,64 s dan K4 5,72–6,70 s; kamera baru diam di tujuan 5,7–6,9 s setelah scroll berhenti. Tidak ada pageerror.
- Koreksi tafsiran: angka K3 dan K4 tadi mencakup hold bawaan, bukan dwell saja. Hold K3 1,2 layar sudah membuat kamera diam ±2,4 s pada 2 s/layar. Dibanding waktu lepas tanpa dwell (akhir hold + lag pegas ±0,25 s), dwell menambah: K3 ±0 s pada 2 s/layar dan ±0,9 s pada 1 s/layar; K4 ±2,3–2,5 s pada 2 s/layar dan ±5,1–6,2 s pada 1 s/layar. Jadi penambah utama adalah dwell K4, karena menunggu sampul binder selesai terbuka.
- Klaim jaringan terbukti: teks leaflet dan keempat tab binder (termasuk isi tab Klinik) sudah ada di HTML awal. Selama scroll hanya ada request AO ruko berikutnya (`row-*.png`) dan satu chunk; tidak ada request copy. Copy terlambat karena menunggu animasi, bukan unduhan, jadi preload dan cache saja tidak memperbaiki issue ini.
- Catatan keputusan: hold K3 1,2 dan K4 1,5 berasal dari durasi tahap 5 yang disetujui user, sedangkan dwell dari masukan 7 Nov. Issue hanya membatalkan dwell. Menghapus hold juga (perbaikan di working tree) mengubah durasi yang sudah disetujui, jadi perlu persetujuan user.
- Belum: pengukuran build perbaikan di working tree, cek visual, tes HP fisik. Tidak ada perubahan source, komentar GitHub, commit atau push.

### 2026-11-10 (issue GitHub #4: verifikasi perbaikan, dwell dan hold dihapus)

- Keputusan user: dwell dan hold K3/K4 dihapus. Perbaikan yang sudah ada di working tree dipakai: `timing.ts` (hold K3 1,2 dan K4 1,5 dihapus, take 16,1 layar), `world/index.ts` (dwell dihapus; jam beat 3–4 mengikuti scroll yang tampil, tanpa batas laju; tampil live setelah cast, tangan close-up, logo leaflet, font, AO dan warm-up siap; ruko dimuat di latar 0,8 s setelah tampil; dispose dan abort), `counterCast.ts`, `counterProps.ts` (`ready` logo leaflet), `core/ao.ts` (abort), `HomeTake.tsx` (angka stills dan copy fallback ikut take baru, batas boot 20 s ke stills, mulai setelah first paint), `tools/render/lib.mjs` (`HP_AT`).
- Dicek: `npm run typecheck` dan ESLint lulus; Prettier lulus untuk file situs (`tools/render/lib.mjs` sudah tidak lolos Prettier sejak HEAD, bukan dari perbaikan ini). `npm run build` lulus; `site-prod-3300`.
- Ukur (skrip scratchpad yang sama dengan verifikasi HEAD, scroll 8,2 → 10,0 layar, setara 8,2 → 12,7 di take lama): kamera tidak pernah diam selagi scroll berjalan di 375×812, 768×1024, 1280×720; kamera berhenti di tujuan 1,05–1,15 s setelah scroll berhenti (HEAD 2,1–6,9 s). Tidak ada request jaringan selama scroll (AO ruko sudah dimuat saat intro), tidak ada pageerror.
- Temuan baru, keterbacaan: tanpa hold, copy tampil penuh hanya di rentang scroll sempit. Leaflet 8,63–8,81 layar (0,17 layar; 0,34 s pada 2 s/layar), binder 9,33–9,84 (0,5 layar; ±1 s). HEAD: leaflet tampil penuh ±3,2 s dan binder ±2 s. Frame diam di K3 dan K4 (hp dan pc) rapi; di 8,95 leaflet sudah hilang dan binder masih tertutup. Screenshot hanya di chat.
- Belum: keputusan user soal keterbacaan (tanpa hold atau hold pendek tanpa dwell), komentar GitHub, tes HP fisik, commit, push.

### 2026-11-10 (issue GitHub #4: hold pendek tanpa dwell)

- Keputusan user: hold pendek tanpa dwell. `timing.ts`: hold K3 0,4 dan K4 0,5 layar (sebelum issue 1,2 dan 1,5); take 17,0 layar. Angka layar tetap ikut digeser: `HomeTake.tsx` `STILL_FADES` (K4 9,05–9,5; K4.1 dan seterusnya +0,9 dari versi tanpa hold) dan `STILL_COPY.page` 9,4–9,6; `tools/render/lib.mjs` `HP_AT` +0,9; `tools/render/issue4.mjs` take 17,0, rentang scroll 8,2–10,9, binder fallback di 9,6. Turunan lain (`B5`, `keyHoldStart`, beat 3–4) dihitung dari segmen.
- Dicek: typecheck, ESLint, Prettier (file situs dan `issue4.mjs`), `npm run build` lulus. Ukur 8,2 → 10,9 layar di 375×812, 768×1024, 1280×720: kamera hanya diam selama hold (K3 0,82 s, K4 1,0 s pada 2 s/layar); berhenti 1,03–1,15 s setelah scroll berhenti; copy leaflet penuh 0,58 layar (1,15 s pada 2 s/layar), binder 1,0 layar (2,0 s); tanpa request jaringan dan pageerror. `issue4.mjs` 73/73 dan `issue4-loading.mjs` 25/25 lulus. Run pertama `issue4.mjs` sekali gagal di scroll mundur 1 s/layar hp-small karena satu frame macet ±2 s; tidak terulang di 6 percobaan terpisah (frame terburuk 17–44 ms) maupun di 2 run penuh berikutnya. Visual K3/K4 hp dan pc rapi; di tengah transisi K3 → K4 frame sempat kosong dan saat naik ke K4.1 copy binder terlihat terbalik, keduanya sudah ada sebelum perbaikan. Screenshot hanya di chat.
- Komentar Penyebab, Perbaikan, Dicek, Belum dikirim di issue #4 (issuecomment-6754389670).
- Belum: tes HP fisik dan konfirmasi user, commit, push, tutup issue.

### 2026-11-10 (issue GitHub #4: rencana loading screen dan kunci scroll)

- Masukan user: perlu loading screen yang mencegah scroll sebelum world siap. Sekarang selama mode `boot` halaman bisa discroll; pengunjung melewati take dengan still K0 diam, lalu world melompat ke posisi scroll saat siap.
- Ukur (build `site-prod-3300`, hold pendek): browser pane biasa di laptop (16 core): JS siap ±1,9 s, world mulai dimuat 5,3 s (menunggu idle), mount 7,0 s, AO 8,4 s, cast dan tangan 9,9 s, live 14,4 s (kompilasi shader dan warm ±4,5 s). Playwright headless GPU tanpa cache: CPU 1× live 12,4–15,7 s; CPU 4× (setara HP murah) mount 15,5 s, AO 18,8 s, cast belum selesai saat `BOOT_TIMEOUT_MS` 20 s habis, jadi jatuh ke stills. Batas 20 s ini berasal dari perbaikan issue #4 di working tree; `main` belum punya batas.
- Riset: `overflow: hidden` pada html dan body ditambah `scrollbar-gutter` untuk menghindari geser layout; iOS Safari perlu cadangan (`touchmove`/`wheel` preventDefault) karena overflow pada body tidak selalu dihormati; loader memakai `role="progressbar"`, `aria-valuenow` dan `aria-busy` pada area yang dimuat; reduced motion tanpa animasi. Sumber: webflow.com/blog/prevent-page-scroll-webflow-modal, pqina.nl/blog/how-to-prevent-scrolling-the-page-on-ios-safari, gsap.com/docs/v3/HelperFunctions/helpers/stopOverscroll, design.sis.gov.uk/components/skeleton/accessibility, modus.trimble.com/elements/progress-bars.
- Keputusan user: hero K0 dan headline tetap tampil, ditambah bar progres persentase kecil ("Memuat 60%"); scroll dikunci, paling lama 15 s sejak halaman dibuka, lalu dilepas ke stills; boot dipercepat dulu (mulai tanpa menunggu idle, shader dikompilasi paralel selama tokoh dibangun) dengan target laptop di bawah 8 s; semuanya masuk perbaikan issue #4.
- Belum: rencana implementasi disetujui user, implementasi, pengukuran.

### 2026-11-10 (issue GitHub #4: loading screen, kunci scroll, boot dipercepat)

- Disetujui user ("Ya, kerjakan"): rencana di entri sebelumnya.
- Profil boot (`performance.mark` `take:*` dan `world:*`, Playwright headless GPU, browser baru tiap run): laptop CPU 1× world tampil 5,2–5,8 s; angka 14,4 s pagi ini dari pane browser aplikasi Claude yang berbagi CPU, bukan wakil pengunjung. CPU 4×: 16–28 s; waktu habis di menunggu hydration/idle (1,7–12 s), set 3–5 s, AO 3–6 s, cast 4–5 s, shader ±3 s setelah cast.
- `world/index.ts`: `onProgress` (bobot per langkah: sets, aoExt, aoRoom, tiap tokoh, hands, props, fonts, compile, blur, draw; tiap langkah sekali, ada `performance.mark("world:<langkah>")`); shader set dikompilasi setelah AO set selesai sambil cast dibangun (`warm()` awal), `warm(true)` terakhir hanya sisa program cast. Sesudahnya kompilasi setelah cast 0,5–1,2 s di CPU 4× (sebelumnya ±3 s).
- `HomeTake.tsx`: world mulai dimuat di frame pertama setelah hydration (tanpa `requestIdleCallback`); batas `BOOT_LIMIT_MS` 15 s dihitung dari awal navigasi (menggantikan 20 s dari `start`), lalu stills; bar progres ditulis langsung ke DOM (2% mulai, 8% kode world, sisanya dari `onProgress`); `bootUnlock()` saat live, stills, atau unmount; `performance.mark` `take:start/imported/mounted/live`.
- `components/home/bootLock.ts` (baru) dan `HomeStage.tsx`: skrip inline sebelum take mengunci scroll (`html[data-booting]`, `overflow: hidden` + `scrollbar-gutter: stable` di `stage.css`; cadangan iOS: `wheel`, `touchmove`, tombol scroll dibatalkan kecuali di dialog menu dan kontrol). Tidak aktif untuk reduced motion dan `?lab/?shot/?bake`. Lepas sendiri 1 s setelah batas kalau halaman tidak pernah hydrate. `app/[locale]/layout.tsx`: `suppressHydrationWarning` pada `<html>` karena atribut ini dipasang sebelum hydration.
- Loader: `.take-loader` (`role="progressbar"`, label `home.stage.loading` "Memuat"/"Loading" + persen), pil putih di tengah bawah stage; di 9:16 di bawah header karena kartu hero mengisi bagian bawah (versi pertama menutupi tombol "Lihat layanan"). Disembunyikan tanpa JS, reduced motion, dan setelah selesai.
- Dicek: typecheck, ESLint, Prettier, build lulus. Tes kunci (skrip scratchpad, browser baru tiap profil): pc live 8,0 s, HP CPU 1× 8,9 s, HP CPU 4× 12,2 s, HP CPU 6× stills di 15,9 s; selama boot scroll roda, End/PageDown/Space dan usapan jari tertahan; bar naik monoton; setelah selesai kunci lepas, bar hilang, bisa scroll; reduced motion tidak dikunci; `?k=K3` tetap di K3 selama terkunci; tanpa pageerror. Screenshot loader hp/pc/EN hanya di chat.
- Regresi: `tools/render/issue4.mjs` 73/73 dan `issue4-loading.mjs` 25/25 lulus pada build ini.
- Belum: tes HP fisik dan konfirmasi user, komentar tambahan di issue #4 (loading screen), commit, push, tutup issue. Bobot `onProgress` diukur di laptop; di HP bar bisa melompat di tahap tokoh.

### 2026-11-10 (issue GitHub #5: K0 → K1 dipendekkan)

- Issue #5: dari hero di billboard (K0) sampai Heru di pintu COMPANY (K1) butuh 1,9 layar. Diukur ulang di build produksi (scroll rata 2 s/layar, skrip scratchpad, posisi kamera, headline dan kartu hero per frame): kamera baru mulai turun di 1,10 layar dan tiba di K1 di 1,96 layar pada 1280×720 (1.411 px, ±14 putaran roda), 1920×1080 (2.130 px), 768×1024, 375×812 (1.594 px) dan 360×640. Penyebab: hold K0 0,9 + crane 1,0 layar di `timing.ts`. Copy hero dibaca saat halaman diam di posisi 0 (scroll terkunci selama loading), jadi hold panjang hanya menunda efek scroll.
- Keputusan user: K0 → K1 1,0 layar (hold 0,3 + crane 0,7, pilihan yang direkomendasikan). Instruksi user lewat sesi induk: pertanyaan berikutnya di issue ini memakai rekomendasi; tidak ada pertanyaan lanjutan.
- Diubah:
  - `takes/home/timing.ts`: hold K0 0,9 → 0,3, crane K0 → K1 1,0 → 0,7; take 17,0 → 16,1 layar.
  - `components/home/HomeTake.tsx`: `HERO_OUT` dihitung dari segmen (akhir hold − 0,05 sampai sepertiga awal crane; sekarang 0,25–0,545, sebelumnya 0,85–1,25), jadi kartu hero HP tetap memudar di akhir hold dan tombol hero tetap disembunyikan setelahnya. `STILL_FADES` K1 dipetakan ke crane baru (0,51–0,93), lainnya −0,9; `STILL_COPY` −0,9.
  - `tools/render/lib.mjs` `HP_AT` −0,9; `tools/render/issue4.mjs` take 16,1, rentang 7,3–10,0, fallback leaflet 7,7 dan binder 8,7.
  - Tidak diubah: burung (`craneAt` relatif ke crane, keluar di 35% awal), still K0 dan crossfade (kamera hold sama), tautan `#layanan`/`#cara-kerja` (dihitung dari segmen), Heru berbalik dan pintu (#6, #10).
- Dicek:
  - ukur ulang di build produksi (port 3302): kamera mulai turun 0,48–0,49 layar dan tiba di K1 1,08–1,09 layar di kelima viewport (1280×720 784 px ±8 putaran, 1920×1080 1.177 px, 375×812 880 px). Kartu hero HP penuh sampai 0,27 layar, hilang di 0,53; headline HP lepas dari billboard 0,82–1,00. Tanpa pageerror;
  - frame PC dan HP di 0, 0,3, 0,45, 0,55, 0,7, 0,85 dan 1,15 layar (hanya di chat): hero utuh selama hold, burung keluar saat crane, Heru di K1;
  - still dirender dari build baru dan dibandingkan dengan `site/public/stills/`: K0–K5a.1 dan K5a.6 sama (selisih rata-rata 1,5–3,1 dari kompresi WebP). K5a.2–K5a.4 berbeda karena still itu masih framing per panel dari sebelum issue #2, bukan karena perbaikan ini. Still tidak dirender ulang;
  - `#layanan` mendarat di K3 (7,9) dengan copy leaflet tampil, `#cara-kerja` di 12,56 dengan judul di layar (1280×720, 768×1024, 375×812);
  - `tools/render/issue4.mjs` 73/73 dan `issue4-loading.mjs` 25/25 lulus; typecheck, ESLint, Prettier (`tools/render/lib.mjs` sudah tidak lolos Prettier sejak HEAD), `npm run build` lulus.
- Dikonfirmasi user setelah tes di HP ("Ok tested", diteruskan sesi induk). Di-commit ke `main` (Refs #5; hanya `timing.ts`, `HomeTake.tsx`, `tools/render/lib.mjs`, `tools/render/issue4.mjs` dan entri log ini; pekerjaan Solusi dan entri tes UX 10 Nov tidak ikut), lalu di-push.
- Belum: komentar Penyebab/Perbaikan/Dicek/Belum di issue #5 dan penutupan issue, karena Claude in Chrome tidak tersambung dan browser bawaan belum login GitHub (draf komentar di scratchpad sesi).

### 2026-11-11 (issue GitHub #6 dan #10: Heru berbalik dan pintu, kamera menunggu Heru)

- Issue #6: setelah K1, Heru berbalik dan membuka pintu butuh terlalu banyak scroll. Issue #10: pada scroll cepat kamera menembus pintu yang belum terbuka dan mendahului Heru. Diukur ulang setelah #5 (build produksi, skrip scratchpad, kamera, pinggul Heru dan daun pintu per frame): dari akhir hold K1 sampai pintu terbuka penuh 1,24 layar (1280×720), 1,26 (768×1024), 1,34 (375×812) pada 2 s/layar. Scroll cepat: daun kanan −0,17 rad (pc, 1 s/layar) dan 0 (HP, 0,6 s/layar) saat kamera lewat, Heru masih di trotoar.
- Penyebab: jam Heru ±4,7 s dibentang rata di gerak 2,0 layar; jam mengikuti scroll yang sudah diredam, lalu diredam lagi `FOLLOW` 3,5 (±0,57 s) dan dibatasi 1,5×; kamera maju mengikuti scroll, bukan jam Heru.
- Keputusan user: gerak K1 → K2 1,2 layar, #10 ikut diperbaiki, laju Heru di pintu sampai 2×.
- Diubah:
  - `takes/home/timing.ts`: gerak K1 → K2 2,0 → 1,2; take 16,1 → 15,3 layar.
  - `takes/home/heru.ts`: `heruClock` sedikit lebih cepat di awal (`LEAD` 0,2) dengan kebalikan `heruClockP`; `followDoorClock` (laju 2×, pegas 6) untuk pintu, `followClock` jalan ruko tetap 1,5×/3,5; `heruGate`: kamera paling jauh 0,15 layar dari posisi jam Heru sampai ia selesai (lepas 0,15 s dari ujung jam).
  - `world/index.ts`: jam Heru mengikuti `target` (scroll), kamera menuju `heruGate`; setelah menunggu, kamera mengejar scroll paling cepat 2 layar/s (`CATCH_UP`); `jump` mengatur ulang.
  - `components/home/HomeTake.tsx`: `STILL_FADES` K2 dipetakan ke gerak baru (1,72–2,38), lainnya −0,8; `STILL_COPY` −0,8. `tools/render/lib.mjs` `HP_AT` −0,8; `tools/render/issue4.mjs` take 15,3, rentang 6,5–9,2, fallback leaflet 6,9 dan binder 7,9.
- Dicek:
  - 2 s/layar: pintu penuh 0,63 layar setelah hold di pc, tablet dan HP; K2 1,2 layar setelah hold; kamera berhenti 0,6–0,7 s setelah scroll (sama dengan sebelum); saat kamera lewat pintu daun terbuka penuh dan Heru 1,1–1,2 m di dalam (sebelumnya 0,2–0,4); jarak kamera ke kepala Heru paling dekat 0,93–1,0 m (sebelumnya 0,47–0,49);
  - scroll cepat maju dan mundur (pc 1 s, HP 0,6 s/layar) dan swipe jauh sampai 5,5: tidak ada frame kamera di ambang pintu dengan daun < 1,2 rad (sebelumnya 6–7 frame); kamera tiba 1,8 s (pc) dan 2,5 s (HP) setelah scroll berhenti, karena menunggu Heru; scroll mundur mengembalikan Heru ke K1 dan pintu tertutup;
  - frame pc dan HP scroll rata dan cepat dicek visual (hanya di chat);
  - `#layanan` mendarat di 7,1 (K3), `#cara-kerja` di 11,76 dengan judul terlihat (1280×720, 768×1024, 375×812);
  - `tools/render/issue4.mjs` 73/73 dan `issue4-loading.mjs` 25/25 lulus; typecheck, ESLint, Prettier (kecuali `tools/render/lib.mjs`, sudah tidak lolos sejak HEAD), `npm run build` lulus; console hanya 404 skrip analytics Vercel lokal.
- Temuan, belum diperbaiki: swipe sangat cepat melewati K2.1 → K2.2 masih memotong whip pan saat masuk hold K2.2 (kamera melompat ±0,5 m dalam satu frame). Pola ini sudah ada sebelum perbaikan (hold K2.2 tidak menunggu whip yang berjalan dengan waktu).
- Belum: komentar di issue #6 dan #10 (Chrome tidak tersambung; draf di scratchpad sesi), tes HP fisik, konfirmasi user, commit, push, tutup issue. Still tidak dirender ulang (kamera hold sama).
- Dikonfirmasi user ("Ok, commit dan push"). Di-commit ke `main` (Refs #6, Refs #10; hanya `timing.ts`, `heru.ts`, `takes/home/index.ts`, `world/index.ts`, `HomeTake.tsx`, `tools/render/lib.mjs`, `tools/render/issue4.mjs` dan entri log ini; pekerjaan Solusi dan entri tes UX 10 Nov tidak ikut).

### 2026-11-11 (issue GitHub #8: Bu Dewi keluar lewat daun kanan yang terbuka)

- Issue #8: saat keluar dari COMPANY, Bu Dewi menembus daun kanan yang sudah tertutup. Direproduksi di build produksi (skrip scratchpad, Playwright `?hud`, scroll rata 2 s/layar dari 9 sampai 12,5): daun kanan menutup di 10,0–10,2 layar setelah kamera keluar; Bu Dewi melewati bidang pintu di 11,24 pada x 0,37–0,40 dengan daun kanan 0; jarak tubuhnya ke daun 0,00 m. Sama di 1280×720, 768×1024 dan 375×812. Frame PC dan HP (hanya di chat): ia muncul dari balik kaca daun kanan.
- Penyebab: `world/index.ts` menutup daun kanan saat kamera mundur keluar (video k4.2 - k4.1), dan tidak ada yang membukanya lagi. Heru hanya membuka daun kiri dan berdiri di separuh kiri, sedangkan jalur `D1` Bu Dewi lewat separuh kanan. Di video k5a.1 - k4.2 kedua daun terbuka: Heru di kiri menahan daun kiri, Bu Dewi keluar lewat kanan.
- Keputusan user: daun kanan dibuka lagi, terbuka bersama daun kiri tanpa tangan yang terlihat menariknya (pilihan yang direkomendasikan).
- Diubah:
  - `takes/home/outsideCast.ts`: `rightLeafOpen(c)` (0–1) dari jam keluar, dengan jadwal yang sama dengan daun kiri (`T.leafOpen`, `T.leafShut`);
  - `world/index.ts`: daun kanan = `h.door × max(tutup oleh kamera, rightLeafOpen)`. K4.2 tetap pintu tertutup. Jalur tokoh, timing kamera dan daun kiri tidak berubah.
- Dicek (build produksi, port 3100):
  - scroll rata 2 s/layar di 1280×720, 768×1024 dan 375×812: daun kanan terbuka lagi di 10,70 dan penuh (−1,45) di 10,92, bersama daun kiri; Bu Dewi lewat di 11,24 dengan daun kanan −1,45; jarak terdekat titik tubuhnya ke daun kanan 0,20–0,23 m (sebelumnya 0); kedua daun tertutup di 11,36;
  - scroll cepat (PC 1 s/layar, HP 0,6 s/layar): daun penuh di 11,23 / 11,29, Bu Dewi lewat di 11,31 / 11,41 dengan daun terbuka, jarak 0,22–0,23 m;
  - scroll mundur (PC dan HP 2 s/layar, HP 0,6 s/layar): daun membuka lagi lalu tokoh kembali, seperti putaran balik;
  - frame PC dan HP di 10,3 (K4.2 pintu tertutup), 10,8–11,1 (kedua daun terbuka, Bu Dewi di separuh kanan) dan 11,42 (tertutup) dicek visual, hanya di chat;
  - `tools/render/issue4.mjs` 73/73 dan `issue4-loading.mjs` 25/25; typecheck, ESLint, Prettier (file yang diubah) dan `npm run build` lulus.
- Temuan, sudah ada sebelum perbaikan: saat scroll mundur 2 s/layar, jam keluar tertinggal dari scroll, lalu di-reset ke 0 begitu scroll < `K42_PASS` (`stepOutClock`). Akibatnya di ±10,3 layar Heru dan Bu Dewi yang masih di ambang pintu hilang dalam satu frame dan pintu langsung tertutup, padahal kamera masih di depan fasad. Dulu yang ikut menutup mendadak hanya daun kiri; sekarang daun kanan juga.
- Komentar Penyebab, Perbaikan, Dicek, Belum dikirim di issue #8 lewat Chrome (issuecomment-6782596150).
- Revisi user ("pintunya terbuka keluar dua duanya"; jawaban: hanya saat keluar, beat 1 tetap): daun kanan sekarang membuka ke luar seperti daun kiri saat keduanya keluar (`rightLeaf`, sudut +1,4 rad). Di beat 1 Heru tetap mendorongnya ke dalam, dan saat kamera keluar daun tetap menutup dari dalam. Karena ujung daun kanan yang terbuka sampai z 0,83, jalur `D1` Bu Dewi lurus keluar di x ±0,36 sampai z ±1,2 baru belok ke kanan (sebelumnya belok dari z 0,45). Jalannya ±0,3 m lebih panjang, jadi jadwal jam keluar sesudahnya (`T.h2`, `leafShut`, `d2`, ...) bergeser ±0,2 s.
- Dicek ulang (build produksi, port 3100): scroll rata 2 s/layar di PC, tablet dan HP, mundur di PC dan HP, cepat di PC 1 s/layar dan HP 0,6 s/layar (maju dan mundur). Daun kanan terbuka ke luar di 10,69 dan penuh (+1,4) di 10,91, bersama daun kiri. Bu Dewi lewat di 11,23–11,39 dengan kedua daun terbuka penuh. Jarak terdekat titik tubuhnya ke daun kanan 0,16–0,19 m (versi pertama belokan ini 0,06–0,11 m, jadi belokan digeser) dan ke daun kiri ≥ 0,89 m. Jarak 3D ke Heru tetap 0,20 m, sama dengan sebelum perbaikan. Frame PC dan HP dicek visual (hanya di chat). `issue4.mjs` 73/73, `issue4-loading.mjs` 25/25, typecheck, ESLint, Prettier dan `build` lulus. Lompatan saat scroll mundur di ±10,3 layar (temuan di atas) tetap ada.
- Komentar revisi dikirim di issue #8 (issuecomment-6783124647).
- Keputusan user: "Commit saja". Di-commit ke `main` (Refs #8; hanya `world/index.ts`, `takes/home/outsideCast.ts` dan entri log ini; pekerjaan Solusi dan entri log lain tidak ikut). Belum di-push; issue #8 tetap open sampai push.
- Belum: still K5a.1 tidak dirender ulang (daun kanan di still masih tertutup); tes di HP Android sungguhan; konfirmasi user, commit, push, tutup issue.

### 2026-11-11 (issue GitHub #14: tangan Bu Dewi kembali ke badannya di K3 → K4)

- Issue #14 (revisi user di komentar: tangan Bu Dewi tidak ke samping binder, tangan Heru tetap). Direproduksi di build produksi (port 3300, skrip scratchpad, Playwright `?hud`, posisi tiap 0,1 layar): di tampak atas lengan bawah kanan Bu Dewi dilipat dan diganti tangan close-up, yang ujung lengan bajunya berjarak 0,27 m (PC) / 0,17 m (HP) dari sikunya di K3, lalu 0,55 / 0,35 m setelah tangannya pindah ke samping binder di K3 → K4. Di K3 dan jeda K4 celah itu di luar frame; saat kamera naik dan berputar ke K4.1 (8,9–9,02 layar) tangan close-up masih tampil, jadi lengannya terlihat putus (lengan dari atas di kiri binder, badan di kanan atas), di PC dan HP.
- Keputusan user: pilihan A (tangan kembali ke badannya, keluar frame, lengan asli utuh lagi).
- Diubah:
  - `sets/counterProps.ts`: saat Bu Dewi melepas leaflet (`letGo`, 0–35% beat 4) tangan close-up-nya ditarik mundur 0,5 m menyusuri lengan bajunya (`DEWI_DRAW_BACK`) sampai keluar dari bawah frame, lalu dimatikan; `HAND_AT.dewi.rest` dihapus.
  - `takes/home/counterCast.ts`: `dewiCloseHand(s, k4)` (dari memegang sudut leaflet sampai `letGo` selesai); `dewiPose3` mengembalikan tangan kanan aslinya ke konter di depannya (pose K2) saat melepas, bukan ke samping binder.
  - `world/index.ts`: lengan bawah Bu Dewi dilipat hanya selama `dewiCloseHand`.
  - `site/public/stills/pc/k4.webp` dirender ulang (tanpa tangan Bu Dewi). K4 HP sama persis; K4.1 tidak dirender ulang (selisihnya gelembung pikiran issue #3, bukan dari perbaikan ini).
  - Tangan Heru, kamera, timing dan copy tidak berubah.
- Dicek (build produksi, port 3300):
  - posisi tiap 0,05 layar 7,2–9,2 di 1280×720, 768×1024 dan 375×812: tangan close-up keluar frame di 7,40 dan dimatikan di ±7,51; jeda K4 tanpa tangan Bu Dewi dan ujung jari tangan aslinya tidak masuk frame (pergelangan di 1,59 / 1,25 / 1,08 tinggi layar); naik ke K4.1 lengannya utuh;
  - scroll mulus maju lalu mundur 7,0 ↔ 9,3 (2 s/layar di ketiga viewport, 1 s/layar PC, 0,6 s/layar HP): 0 frame tangan muncul atau hilang di dalam frame; lipatan lengan selalu sejalan dengan tangan close-up; tanpa pageerror;
  - frame PC, tablet dan HP dicek visual (hanya di chat);
  - `tools/render/issue4.mjs` 73/73 dan `issue4-loading.mjs` 25/25; typecheck, ESLint, Prettier (file yang diubah) dan `npm run build` lulus.
- Komentar Penyebab, Perbaikan, Dicek, Belum dikirim di issue #14 lewat Chrome (issuecomment-6787693135).
- Keputusan user: "Ok, commit saja". Di-commit ke `main` (Refs #14; hanya `world/index.ts`, `sets/counterProps.ts`, `takes/home/counterCast.ts`, still `pc/k4.webp` dan entri log ini; pekerjaan Solusi dan entri log lain tidak ikut). Belum di-push; issue #14 tetap open sampai push.
- Belum: tes di HP Android sungguhan, push, tutup issue.
