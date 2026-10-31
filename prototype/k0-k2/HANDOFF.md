# Three.js K0 → K2: serah-terima antar sesi

_Terakhir diperbarui: 30 Okt 2026, akhir tahap 2. Untuk sesi Claude berikutnya: baca file ini dulu sampai habis sebelum menyentuh kode._

## Status

| Tahap | Isi | Status |
|---|---|---|
| 1 | Kamera dan ukuran dunia dari keyframe K0, K1, K2 (pc dan hp) | ✅ disetujui 30 Okt |
| 2 | Lokasi eksterior dan interior, cahaya, AO saat load, placeholder karakter | ✅ disetujui 30 Okt |
| 3 | Karakter vinyl-toy dari kode (Heru, Bu Dewi, Sinta, Bayu, Nadia, Fajar) dan burung merpati K0 | ⬜ berikutnya |
| 4 | Animasi dan fisika tanpa engine, kamera final dengan inersia | ⬜ |
| 5 | Pengerasan untuk HP murah, tes di HP Android murah milik user | ⬜ |
| 6 | Publish, dokumen (`THREEJS.md`, `PLAN.md`), commit dan push | ⬜ |

- Preview tahap 2: https://claude.ai/artifact/TSFkWQ3P7p4mRcRd3VZwUi (privat, tanpa gambar keyframe di dalamnya). Untuk update dari sesi lain: `Artifact` dengan `url` itu, setelah `action: "read"`.
- Hasil build: `prototype/k0-k2-3d.html` (sekitar 667 KB, 177 KB gzip, tanpa CDN).

## Aturan kerja dari user (wajib)

1. Jawab dalam bahasa Indonesia.
2. Tiap tahap: riset internet dulu untuk info terbaru dan best practice. Library atau skill yang dipakai harus aman dan terbukti. Laporkan temuan yang bisa mengubah plan, lalu tanya sampai yakin 98% sebelum membuat plan dan sebelum implementasi.
3. Berhenti di akhir tiap tahap untuk review: screenshot render, keyframe dan overlay dikirim **hanya di chat**. Gambar keyframe tidak boleh ikut ke halaman preview.
4. Google Drive: **jangan pakai file Drive lain tanpa izin**. Yang sudah disetujui ada di daftar di bawah. Media tambahan diupload user di chat.
5. Semua dari kode, tanpa model 3D eksternal. Karakter harus semirip mungkin dengan turnaround. Fisika gerak tanpa engine.
6. Prioritas referensi kalau bertentangan: keyframe > video > Master Lokasi.

## Keputusan user

| Topik | Keputusan |
|---|---|
| Lingkup | K0 → K1 → K2 dulu (K2.1 dan K2.2 nanti) |
| Ruko kanan COMPANY | Mint (ikut K1 dan denah), bukan biru seperti di Master |
| Billboard K0 | Kosong; copy hero nanti berupa HTML |
| Keset di balik pintu | Kuning (ikut video hp) |
| Font huruf COMPANY | Nunito ExtraBold 800 (OFL), dipilih karena paling mirip |
| AO | Dihitung saat load dengan three-mesh-bvh (sudah jalan) |
| Rambut, hijab, tutup kepala | SDF yang diubah jadi mesh dengan `MarchingCubes` resmi three.js, dibuat saat load; versi sederhana untuk mode hemat |
| Gerak | Pegas dan redaman yang ditulis sendiri. Gerak utama di-bake saat load lalu disampel dari posisi scroll, jadi bisa diputar mundur. Gerak sekunder (rambut, hijab, kuncir, lanyard) memakai pegas live; `@pixiv/three-vrm-springbone` 3.5.5 boleh dipakai |
| Library yang disetujui | three 0.186.1, three-mesh-bvh 0.9.16, @pixiv/three-vrm-springbone 3.5.5; di container saja: opentype.js 2.0.0, OpenCV dan SciPy, esbuild 0.28.2 |
| Tanpa | detect-gpu (kualitas diturunkan dari fps yang terukur), skill three.js komunitas |
| Interior versi HP | Disetujui: ruangan portrait lebih sempit (±5,3 m lawan 8,3 m), kamera K2 hp 2,2 m lebih mundur; layout diblend menurut aspect |
| Skala karakter K1 vs K2 | **Opsi (c)**: Heru tetap 1,8 m seperti di K1, kamera K2 dinaikkan sedikit sampai kepala Heru (dari belakang) muat seperti di K2. Bu Dewi belum dibahas tegas; usulkan tinggi realistis yang sama skalanya dan konfirmasi di awal tahap 3 |
| Cahaya | Sudah cukup (selisih warna rata-rata ±12/255) |
| Review | Berhenti di tiap tahap; user punya HP Android murah untuk tes |

## Referensi

**Drive (disetujui):** folder "Aset Video web Kreatekno" milik akun kreatekno.

| File | Drive ID |
|---|---|
| `KARKATER/HERU.png` | `1-86VP0Z-Poqr2KcRunjajQXV145AU5n5` |
| `KARKATER/BUK DEWI.png` | `1xzEV3zO2cMsJKpJE0BaNyAgmxlyDJQMi` |
| `KARKATER/SINTA.png` | `1GYCxrSkBC0BXLU8vJkimyITub8SQ4oti` |
| `KARKATER/BAYU.png` | `1lSvIcu4tdYvDYvVZf-9y9gkgQrhp-ua1` |
| `KARKATER/NADIA.png` | `1AuzmhPQbX0Yhrqsd0cSSfpJxc4kMFM1R` |
| `KARKATER/FAJAR.png` | `10lOCAXZs2lsT9aTgHIazNNTUfUyB7Gl7` |
| `KARKATER/ALL KARAKTER.png` | `1cBPnUrmgQm-oh_gLVkm9QDxd460BlnSH` |
| `Master Lokasi/(PAGI) EXTERIOR Toko COMPANY.png` | `1yqMrt3bciTcgKrOvpSkcITXTJL4ONOlS` |
| `Master Lokasi/(SIANG) Toko Company.png` | `1yG_mdip4XeTmry2AKCPfD0jwrQGsJYXV` |
| `Master Lokasi/master8_denah.png` | `1fXmLsrJNc0vb4gtxlRe5ZflnY1Pdochr` |
| `Key frame pc/K0 fix.png`, `K1 fix.png`, `K2 fix.png` | `1trm6RLP3dHiRf9hjCi1sAw9o4EFkC2Ty`, `1x4gWL6MN_Rp1Er_m2WmbJYiW5NNqun7k`, `1tNcX7nMiOfCsLf1dCOa9bYKjrAEB1cCG` |
| `Key frame hp/K0 hp.png`, `K1 hp.png` | `1kJvWEM578IkSpYkRUsXvtVcb5ADssmWQ`, `1hYWxbSYoHpsu-aYo58scIO1ti6ACzRR2` |
| `Video web Pc/k0 - k1.mp4` | `1-zbpawQer2Bn0RckNCCUKWpSmFYRJ2I6` |
| `Video web hp/k0 - k1.mp4`, `k1 - k2.mp4` | `1EXQT6kOWH6joCU-IWISXi6MkKISA3LOL`, `1et-mrqTJwgANM-1ZkUzm-CcHBw2RG4D8` |

- Unduh dengan `download_file_content`, **paling banyak 3 file per giliran**: lebih dari itu, koneksi MCP putus. File di atas sekitar 6 MB gagal.
- **Upload dari user** (tidak ada di Drive yang bisa diunduh): `refs-upload/K2_hp_upload.webp` (keyframe K2 hp), `refs-upload/master7_kolase_upload.webp` (deret ruko). Video `k1 - k2.mp4` versi pc (17,7 MB, 1920×1080) perlu diupload ulang oleh user untuk tahap 4.

**Ciri karakter dari turnaround** (vinyl toy, sekitar 4,2 kepala, mata hitam mengkilap tanpa putih, alis tebal, hidung kecil, pipi merona):

| Karakter | Ciri |
|---|---|
| Heru | Rambut hitam bergelombang sebatas dagu dengan belahan samping, kumis tipis dan janggut dagu, blazer ungu dengan kancing manset, kaos putih, lanyard ungu dengan kartu ID, tas selempang hitam, celana dan sepatu abu gelap |
| Bu Dewi | Hijab terakota, tunik krem dengan pinggiran motif oranye, bros bunga oranye, kulot cokelat, sepatu cokelat |
| Sinta | Hijab kuning, rompi kotak cokelat-kuning, pin balon chat kuning, kemeja putih, celana cokelat, sepatu kuning |
| Bayu | Rambut pendek, kacamata bulat, pensil di telinga, baju cokelat berkerah, sarung kotak kuning, celana cokelat, sepatu hitam |
| Nadia | Kuncir kuda dengan ikat rambut merah, atasan pink, tas pinggang merah, celana zigzag merah-pink, sepatu putih |
| Fajar | Tutup kepala lilit hijau zaitun dengan pita emas, kemeja hijau, jogger krem, sepatu hijau |

**Pose di K2:** Sinta mengetik di HP dengan notifikasi hijau, Bayu dengan monitor dan tumpukan kertas, Nadia bertopang dagu di depan laptop, Fajar menggaruk kepala dengan nampan oranye dan tablet, Bu Dewi berdiri dengan kedua tangan di meja kasir.

## Hasil tahap 1 (solver `tools/solve.py`, hasil di `data/solve.json`)

| Keyframe | Rata-rata | Maksimal |
|---|---|---|
| K0 pc / hp | 0,17% / 0,13% | 0,31% / 0,21% |
| K1 pc / hp | 0,14% / 0,28% | 0,32% / 0,55% |
| K2 pc | 0,18% | 0,89% |
| K2 hp | 0,49% | 1,51% |

Angka dalam persen lebar layar.

- **Dunia** dalam meter. Origin di tengah pintu COMPANY, di permukaan trotoar, pada bidang fasad; x menyusuri jalan, y ke atas, z ke arah jalan. Tinggi pintu 2,2 m jadi patokan skala.
- **Kamera:**
  - K1 pc ada di z 15,2 dengan FOV vertikal 20°.
  - K0 pc ada di z 12,9, tinggi 8,7 m.
  - Interior diselesaikan di frame-nya sendiri, lalu digeser sehingga kamera K2 berada 0,6 m di dalam dinding depan (z −0,89).
- **Inkonsistensi keyframe yang sudah diketahui:**
  - Heru 1,8 m di K1, tapi hanya muat sekitar 1,3 m di K2 dengan kamera setinggi 1,69 m. Diselesaikan dengan opsi (c).
  - Bu Dewi di K2 terhitung sekitar 2,2 m.
  - Dari kamera K0, atap terlihat, padahal di keyframe area itu langit; warna atap disamakan dengan langit.
  - Trotoar dari kamera hp hanya sekitar 1,7 m.

## Struktur file

```
prototype/k0-k2-3d.html      hasil build (jangan diedit tangan)
prototype/k0-k2/
  src/scene.js               seluruh scene (impor three, addons, three-mesh-bvh, ./data.json)
  src/page.html              HTML dan HUD; /*BUNDLE*/ diganti hasil esbuild
  src/data.json              dunia, kamera pc/hp, offset interior, posisi figur, awan, burung, glyph COMPANY
  data/solve.json            hasil solver kamera (ext, int, int_hp, error per titik)
  tools/                     solve.py, solve_hp.py, prep.py (data.json), glyphs.mjs, render.js, compare.py, grid.py, orange.py, frames.js, tune.js
  build.sh, package.json     npm ci && sh build.sh
```

- Tool Python membutuhkan folder `kf/` (keyframe dari Drive) dan `meas/`, `render/`, `review/`. Folder-folder itu tidak ada di repo, buat ulang di scratchpad.
- Render uji: `node tools/render.js ../k0-k2-3d.html render pc,hp K0,K1,K2`, memakai Playwright bawaan container dengan SwiftShader.
- URL dev: `?k=K0|K1|K2`, `?fmt=pc|hp`, `?shot`, `?noao`, `?hemat`, `?tone=agx`, `?exp=0.9`. Di window tersedia `window.__k02.setP(p)`, `keyP`, `aoState()` dan `lights`.

## Langkah berikutnya: tahap 3

1. Riset dulu (sesuai aturan), lalu tanya user sampai yakin 98%. Topiknya:
   - teknik karakter vinyl dari kode, SDF dengan MarchingCubes;
   - material clay atau vinyl yang ringan untuk HP;
   - wajah: mata mengkilap dan alis;
   - rig sederhana dengan tulang Object3D dan IK dua tulang.
2. Konfirmasi tinggi Bu Dewi dan seberapa jauh kamera K2 dinaikkan (opsi c). Hitung ulang kamera K2 pc dan hp, lalu ukur errornya terhadap keyframe.
3. Bangun 6 karakter dan burung merpati. Bandingkan berdampingan dengan turnaround dari sudut depan, samping dan belakang, lalu dengan K1 dan K2.
4. Anggaran: sekitar 5–15 ribu segitiga per karakter, total di bawah 150 ribu, draw call di bawah sekitar 120.

## Catatan teknis

- three 0.186 tidak lagi menyediakan `three.module.min.js` (split `three.module.js` + `three.core.js`, 417 KB gzip tanpa minify), jadi kode dibundel dengan esbuild.
- Dari Migration Guide: `Clock` → `Timer` (r183), `PCFSoftShadowMap` → `PCFShadowMap` (r182).
- Cahaya eksterior: matahari rendah dari depan-kiri, ditambah penghalang tak terlihat di seberang jalan (z 20) untuk bayangan diagonal; hemisphere lavender; Neutral tone mapping; eksposur 0,9.
- Di dalam toko, hemisphere dan environment diblend dengan `smoothstep` dari posisi z kamera (adaptasi eksposur).
- AO diproses per potongan kecil di frame loop; sekitar 1,5 s di container, belum diukur di HP.
- Akses push ke `iwilwildan/kreatekno-website` belum ada. Repo publik, jadi clone tetap bisa. Pekerjaan dibawa antar sesi lewat zip atau bundle yang diupload user.
