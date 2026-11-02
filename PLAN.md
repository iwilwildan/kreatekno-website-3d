# Kreatekno Website 3D: Plan

_Disusun 31 Okt 2026 dari interview dengan user dan dokumen repo lama. Status: tahap 0–4 selesai; plan tahap 5 (beat 3–4) menunggu persetujuan. Serah-terima antar sesi ada di `HANDOFF.md`._

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
| Urutan | Fondasi situs dulu, lalu engine 3D, lalu Home beat demi beat. Solusi menyusul setelah Home |
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
| Solusi | Baca = artefak katalog 12 solusi dipakai apa adanya; Tonton = take 3D per solusi tanpa karakter manusia, ORB satu-satunya aktor, pilot `order-grup`, hanya untuk solusi "Sudah berjalan" | `docs/SOLUSI.md` 2 |
| CMS | Tidak ada. Copy di file messages, artikel di MDX | `docs/STACK.md` 3 |
| Hosting | Vercel (perlu akun Kreatekno) | `docs/STACK.md` 10 |

## 3. Arsitektur

### 3.1 Situs

```
site/
  app/[locale]/
    page.tsx                    Home: copy dirender di server (SEO), panggung 3D di client
    solusi/page.tsx             katalog + cari          (EN: /en/solutions, usulan)
    solusi/[slug]/page.tsx      detail + tombol Tonton (overlay #tonton-<slug>)
    artikel/, tentang/, kebijakan-privasi/
  components/
    layout/                     Header, MobileMenu, LangSwitch, Footer, WhatsAppButton (port)
    home/HomeStage.tsx          wrapper tinggi (±30 layar) + panggung sticky, memuat world secara lazy
    home/props/                 props HTML per beat: Billboard, Leaflet, Binder, ShopPanel, Corkboard,
                                MagazineRack, StickyNotes, Plaque, Chalkboard, PurpleFolder, RoadFooter
    solusi/                     katalog, detail, TontonOverlay
  world/                        engine three vanilla (lihat 3.2)
  messages/{id,en}.json         semua copy UI (port dari reference)
  content/                      artikel MDX, data solusi
  public/stills/{pc,hp}/        gambar diam per keyframe yang dirender dari scene kita sendiri
tools/
  camera-solve/                 solver kamera dari keyframe (dari prototype/k0-k2/tools)
  render/                       render stills dan shot review lewat Playwright
```

- Semua halaman dirender statis. Copy Home ada di HTML server, jadi bisa diindeks dan dibaca screen reader walau 3D belum dimuat.
- `world/` hanya dimuat di Home dan saat overlay Tonton dibuka, lewat `import()` setelah halaman tampil.
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
| 5 | Beat 3–4 | Layanan (leaflet di stand akrilik) dan Use case (binder) di konter kasir | 4 | 🟡 plan menunggu persetujuan |
| 6 | Beat 5a–5b | Keluar pintu, truck right menyusuri 8 ruko dengan panel customer journey, tiba di kantor Kreatekno | 5 | ⬜ |
| 7 | Beat 6–9a | Lobi Kreatekno: dinding gabus, rak majalah, ruang rapat dan sticky note FAQ; Wildan dan Andi | 6 | ⬜ |
| 8 | Beat 9b–11 | Plakat golden hour, naik ke langit, hyperlapse, turun ke pintu COMPANY | 7 | ⬜ |
| 9 | Beat 12–14 | Ruang kelas, praktik saat senja dengan ORB dan pelanggan, papan kapur kecil, CTA map ungu | 8 | ⬜ |
| 10 | Beat 15–16 | Mundur lewat jendela, malam, naik ke langit, footer di jalan gelap | 9 | ⬜ |
| 11 | Pengerasan HP dan fallback | Still semua beat, tingkat kualitas, versi tumpuk, aksesibilitas, tes seluruh take di HP | 10 | ⬜ |
| 12 | Solusi: Baca + pilot Tonton | Katalog dan detail di Next.js, overlay Tonton dengan engine bersama, `order-grup` lengkap | 11 | ⬜ |
| 13 | Solusi: tiga take lain | Tiga solusi "Sudah berjalan" lainnya dari template yang sama | 12 | ⬜ |
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

#### Plan tahap 5 (disusun 1 Nov setelah riset dan jawaban user, menunggu persetujuan)

Keputusan dari riset, dokumen tim dan jawaban user:

| Topik | Keputusan |
|---|---|
| Acuan | Belum ada keyframe dan footage K3/K4. Kamera dan komposisi dirancang dari dokumen tim (beat 3 dan 4), Master 11b dan `docs/STORY-STAGE.md` 3. Beat 3 berangkat dari K2.2 (bukan K2), sesuai catatan untuk tim |
| Sketsa dulu | Sebelum set dibuat detail: sketsa greybox K3 dan K4 (pc dan hp) dengan kotak pengganti properti, tokoh dalam pose kasar, area aman dan area copy, dikirim di chat untuk disetujui |
| Take | Beat 3: K2.2 → K3 0,8 layar + jeda K3 1,2. Beat 4: K3 → K4 0,5 + jeda K4 1,5 (`STORY-STAGE.md` 3). Total 5,8 → 9,8 layar |
| Kamera | K2.2 → K3: arc ±120° dengan rig sendiri (yaw, pitch dan radius di sekitar titik di dekat Bu Dewi, di-ease, lookAt ke titik fokus yang ikut bergeser), lewat celah tengah meja lalu ujung kiri konter, berhenti di belakang-samping bahu kanan Bu Dewi menghadap pintu. K3 → K4: dolly in melewati bahunya. Keduanya berhenti diam di jeda (keyframe pembawa copy) |
| Properti | Stand akrilik, leaflet 40 × 21 cm (putih, strip ungu tipis di atas) tergeletak datar dan binder ungu tertutup sudah ada di konter sejak K2 (kecil di frame, beat 1–2 tidak berubah). Beat 3: Heru menegakkan leaflet ke stand di kiri tablet POS. Beat 4: Heru menggeser stand ke tepi, mengangkat binder, membukanya tegak menghadap Bu Dewi dan kamera; halaman berayun dari ring |
| Heru | Beat 3: berjalan dari dekat pintu lewat celah tengah (antara meja Bayu dan Nadia) ke seberang konter (gait tahap 4), meraih leaflet, menegakkannya (properti menempel di tangan selama dibawa), mundur sedikit, tersenyum, tangan turun. Beat 4: tangan ke stand, lalu kedua tangan memegang binder (IK). Semua disampel dari scroll |
| Bu Dewi | Tetap di lantai kasir dengan tangan di konter, kepala mengikuti Heru, mengangguk di beat 4 (disampel dari scroll) |
| Staf | Aksi loop tahap 4 tetap berjalan; di K3 terlihat dari belakang |
| Set | Ditambah printer format besar dengan tiga cetakan berbingkai di dinding kanan (Master 11b), detail pintu dan jendela depan dilihat dari dalam, ponsel/tablet POS yang sudah ada. Akrilik memakai `MeshStandardMaterial` transparan dengan tepi lebih terang (bukan transmission, terlalu mahal di HP). Bake AO dan still diulang |
| Copy desktop | Wajah leaflet dan halaman binder adalah HTML asli lewat anchor `matrix3d` (seperti billboard). Leaflet: judul layanan + 4 layanan. Binder: halaman kiri judul, intro dan tombol Konsultasi gratis; halaman kanan 4 contoh industri aktif; tab berwarna di tepi kanan adalah tombol tab ARIA (klik dan panah keyboard), port dari `reference/.../Binder.tsx`. Copy muncul hanya saat tidak ada tangan atau tokoh di depannya (akhir gerak), dan mulai pergi saat gerak berikutnya mulai |
| Teks tajam | Kotak HTML diberi ukuran sebesar tampilannya di layar saat jeda K3 dan K4 (yang terbesar), jadi selama gerak hanya mengecil |
| Copy HP | Kartu di pita bawah, tidak ditempel ke 3D. Layanan: 4 layanan digeser satu per satu. Use case (jawaban user): judul pendek, 4 chip industri, 4 contoh digeser satu per satu, tombol Konsultasi gratis; tinggi ±40%. Carousel memakai `overflow-x` + scroll-snap native (tanpa `touch-action: pan-x`, supaya scroll halaman tetap jalan), tombol sebelumnya/berikutnya, panah keyboard, `aria-roledescription="carousel"` |
| Halaman | Placeholder `#layanan` diganti: link menu Layanan melompat ke jeda K3 di take. Versi tumpuk (reduced motion, tanpa JS) mendapat section Layanan dan Use case dengan still K3/K4 dan copy lengkap. Fallback still mendapat K3 dan K4 |

Langkah:

1. Sketsa: kamera K3 dan K4 pc/hp, jalur arc dan dolly, kotak pengganti leaflet, stand, binder, printer; Heru dan Bu Dewi dalam pose kasar; garis area aman dan area copy. **Berhenti untuk review di chat.**
2. Set dan properti: printer + 3 bingkai, stand akrilik, leaflet, binder (sampul, ring, halaman krem, 4 tab), posisinya di konter sejak K2; bake AO ulang.
3. Gerak: Heru (jalan ke konter, leaflet, binder), properti yang dibawa tangan, halaman binder, anggukan dan tolehan Bu Dewi; take dan kamera K3/K4.
4. Copy desktop: komponen Leaflet dan Binder (port), anchor baru (wajah leaflet, halaman kiri dan kanan binder, tab), lapisan cahaya, timing masuk dan keluar.
5. Copy HP: kartu Layanan dan Use case dengan carousel scroll-snap.
6. Halaman: `#layanan` ke K3, versi tumpuk, still K3/K4 pc/hp, fallback.
7. Cek: render jeda K3/K4 pc (1280×720) dan hp (375×812), scroll maju dan mundur, ketajaman teks saat jeda, tab binder dengan mouse dan keyboard, swipe kartu HP tanpa mengganggu scroll halaman, anggaran (draw call < 120, segitiga < 150 ribu), console, `build`, `typecheck`, `lint`, `format:check`.

**Selesai bila** beat 3–4 tampil dan bergerak seperti dokumen tim, copy tajam dan bisa dibaca serta diklik di desktop dan HP, dalam anggaran, dan disetujui user.

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

- **5 (beat 3–4):** busur ±120° ke belakang bahu Bu Dewi, lalu dolly in ke binder. Tab binder adalah tab industri; contoh use case di 40% bawah layar HP. Master 11b.
- **6 (beat 5a–5b):** set jalan ruko diperluas dengan 8 ruko (Master 3–7, denah Master 8). Panel 1–5 dan 8 membawa copy; panel terakhir menunjuk pintu Kreatekno. Di HP satu panel per layar. Ini beat terpanjang (±4,7 layar).
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

- Port mode Baca dari `prototype/solusi/src/page.html` ke halaman Next.js; data 12 solusi jadi satu file konten. Hash route artefak (`#solusi`, `#s-<slug>`, `#cari`) jadi route asli supaya bisa diindeks.
- Overlay Tonton (`<dialog>`, rail langkah, hotspot sebagai tombol HTML) memakai `world/` yang sama dengan Home.
- Lanjutkan tahap 2–4 `docs/SOLUSI.md` untuk `order-grup`: ruko depot air di deret yang sama, props, ORB, cahaya siang ke malam.
- Tahap 13: tiga solusi "Sudah berjalan" lainnya.

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
