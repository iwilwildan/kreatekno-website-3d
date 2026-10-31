# Kreatekno Website 3D: Plan

_Disusun 31 Okt 2026 dari interview dengan user dan dokumen repo lama. Status: tahap 0 selesai, tahap 1 berikutnya._

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
| Repo | Git lokal dulu. Remote GitHub ditambahkan setelah user membuat repo kosong (gh CLI belum terpasang) |
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
| Heru (Kreatekno) | K1–K9, K13–K14 | `HERU.png` di Drive (belum ada di `refs/`) |
| Bu Dewi | K2–K9, K13–K14 | `BUK DEWI.png` |
| Sinta, Bayu, Nadia, Fajar | K2–K2.2, K12, K13 | `SINTA.png`, `BAYU.png`, `NADIA.png`, `FAJAR.png` |
| Wildan (pengajar, kemeja ungu, celana putih, lanyard) | K8, K12, K13 | belum jelas |
| Andi | K8 | belum jelas |
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
| 1 | Fondasi situs | Next.js statis dengan i18n, SEO, layout, semua route sebagai placeholder | 0 | ⬜ berikutnya |
| 2 | Engine 3D + beat 1–2 di situs | Take K0 → K2 dari k0-k2 berjalan di Home, hero di billboard, still K0 sebagai LCP, fallback awal | 1 | ⬜ |
| 3 | Karakter vinyl | Heru, Bu Dewi, Sinta, Bayu, Nadia, Fajar, merpati | 2 | ⬜ |
| 4 | Animasi beat 1–2 | Heru berjalan dan membuka pintu, aksi staf, burung, kamera K2.1 dan K2.2, inersia kamera | 3 | ⬜ |
| 5 | Beat 3–4 | Layanan (leaflet di stand akrilik) dan Use case (binder) di konter kasir | 4 | ⬜ |
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

### Tahap 3 dan 4: Karakter dan animasi beat 1–2

Mengikuti "Langkah berikutnya: tahap 3" di `prototype/k0-k2/HANDOFF.md`, tapi langsung di `site/world/cast/`:

1. Riset: karakter vinyl dari kode (SDF + MarchingCubes), material clay atau vinyl yang ringan, wajah (mata mengkilap, alis), rig Object3D dan IK dua tulang.
2. Konfirmasi tinggi Bu Dewi dan seberapa jauh kamera K2 dinaikkan; hitung ulang kamera K2 dan ukur errornya.
3. Bangun 6 tokoh + merpati; bandingkan dengan turnaround dari depan, samping, belakang, lalu di K1 dan K2.
4. Tahap 4: gerak utama di-bake dan disampel dari scroll; pegas untuk rambut, hijab, kuncir, lanyard; kamera K2.1 (dolly in + pan kiri ke Sinta dan Bayu) dan K2.2 (whip pan kanan ke Nadia dan Fajar) dari footage; Bu Dewi tetap di konter selama whip pan.

**Selesai bila** beat 1–2 lengkap dengan tokoh dan gerak, dalam anggaran, dan disetujui.

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
- [ ] `HERU.png` dari Drive ke `refs/KARKATER/`.
- [ ] Siapa ARYA, DIMAS, RAKA dan tiga file `cmvnn*.png` di `KARKATER`? Di mana turnaround Wildan dan Andi?
- [ ] Dokumen tim "Kreatekno · Prompt Master Lokasi", terutama bagian "Versi HP 9:16", untuk komposisi HP beat 3–16.
- [ ] Model HP dan angka FPS dari tes yang sudah dilakukan, untuk patokan tahap 2 dan 11.
- [ ] URL EN untuk Solusi: usulan `/en/solutions`.
- [ ] Repo GitHub kosong (nama dan akun) dan akun Vercel Kreatekno.
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
