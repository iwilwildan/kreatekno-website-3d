# Kreatekno Website 3D

Rebuild kreatekno.com dengan Three.js: story Home 18 beat dan Solusi Tonton dibangun sebagai dunia 3D dari kode, halaman lain HTML biasa. Repo ini menggantikan `D:\Danslab\Kreatekno Website` (versi footage, dibekukan 31 Okt 2026).

**Baca dulu `PLAN.md` sampai habis** sebelum menyentuh kode. Status tiap tahap, keputusan dan pertanyaan terbuka ada di sana.

## Aturan kerja (dari user, wajib)

1. Jawab dalam bahasa Indonesia.
2. Di awal tiap tahap: riset internet untuk info terbaru dan best practice. Library atau skill yang dipakai harus aman dan terbukti. Laporkan temuan yang bisa mengubah plan, lalu tanya sampai yakin 98% sebelum membuat plan tahap dan sebelum implementasi.
3. Berhenti di akhir tiap tahap untuk review. Screenshot render, keyframe dan overlay dikirim **hanya di chat**. Gambar keyframe dan master tim tidak boleh masuk halaman preview, artefak, `site/public/` atau git.
4. Google Drive: jangan pakai file Drive lain tanpa izin. Yang sudah disetujui ada di `prototype/k0-k2/HANDOFF.md`. Media tambahan diupload user di chat.
5. Semua dari kode, tanpa model 3D eksternal. Karakter vinyl toy dibuat semirip mungkin dengan turnaround. Fisika gerak tanpa engine.
6. Prioritas referensi kalau bertentangan: keyframe > video > Master Lokasi > dokumen tim. Beat tanpa keyframe dirancang dari dokumen tim dan Master Lokasi, lalu direview tim.
7. Copy: ikuti `docs/SITE-BRIEF.md` bagian 2 ("Anda", tanpa kalimat ambigu, tanpa em dash, teks yang terlihat tidak menyebut nama platform, CTA "Konsultasi gratis"). Copy Home ada di dokumen tim dan `reference/site-nextjs/messages/`.
8. Library yang sudah disetujui: three 0.186.1, three-mesh-bvh 0.9.16, @pixiv/three-vrm-springbone 3.5.5, esbuild 0.28.2; untuk tool lokal: opentype.js 2.0.0, OpenCV, SciPy. Tidak dipakai: detect-gpu, skill three.js komunitas. Library baru harus disetujui user dulu.
9. `refs/` tidak pernah di-commit. Commit dan push hanya kalau user minta.
10. Tiap sesi kerja menambah entri bertanggal di log `PLAN.md` (apa yang berubah, apa yang dicek, apa yang belum).
11. Skill desain di `.claude/skills/` boleh dipakai; launcher biner Impeccable tidak dijalankan, hanya panduan tertulisnya.

## Peta folder

| Path | Isi |
|---|---|
| `PLAN.md` | Plan, keputusan, tahapan, risiko, pertanyaan terbuka, log |
| `docs/` | Dokumen yang dibawa dari repo lama: `SITE-BRIEF.md`, `STORY-STAGE.md`, `COPY.md`, `THREEJS.md`, `SOLUSI.md`, `STACK.md`. `docs/legacy/` berisi `PLAN-v1.md` (plan dan log repo lama) dan `PORTFOLIO.md` (digantikan Solusi) |
| `prototype/k0-k2/` | Take Three.js K0 → K2, tahap 1–2 selesai. `HANDOFF.md` berisi keputusan, ciri tokoh, ID Drive, hasil solver. Hasil build `prototype/k0-k2-3d.html` |
| `prototype/solusi/` | Halaman Solusi (Baca) + Tonton greybox `order-grup`. Hasil build `prototype/kreatekno-solusi.html` + `kreatekno-solusi-3d.js` |
| `prototype/beat2-3d.html` | PoC beat 2 (29 Okt), karakter tingkat 2 |
| `reference/site-nextjs/` | Salinan app Next.js lama (tanpa `node_modules`, `.next`, frame footage). Sumber port untuk i18n, SEO, layout, messages, posisi props |
| `assets/brand/` | Logo dan warna brand (masuk git) |
| `refs/` | Referensi tim: dokumen, turnaround, Master Lokasi, properti, footage, keyframe. Tidak masuk git, lihat `refs/README.md` |
| `site/` | App Next.js baru (dibuat di tahap 1) |

Dokumen di `docs/` dan `HANDOFF.md` masih memakai path repo lama. Terjemahannya:

| Path lama | Path di repo ini |
|---|---|
| `Assets/brand/` | `assets/brand/` |
| `Assets/KARKATER/`, `Assets/Master Lokasi/`, `Assets/Properti/` | `refs/KARKATER/`, `refs/Master Lokasi/`, `refs/Properti/` |
| `Assets/footage/{desktop,mobile}/` | `refs/footage/{desktop,mobile}/` |
| `site/...` (app lama) | `reference/site-nextjs/...` |
| `PLAN.md` lama | `docs/legacy/PLAN-v1.md` |
| `SITE-BRIEF.md`, `STORY-STAGE.md`, dll. | `docs/...` |

## Perintah

- Preview prototype: `preview_start` dengan nama `prototype` (port 8765), lalu buka `/k0-k2-3d.html` atau `/kreatekno-solusi.html#tonton-order-grup`.
- Build prototype: `cd prototype/k0-k2 && npm ci && sh build.sh`; `cd prototype/solusi && npm ci && node build.mjs`.
- App: `preview_start` dengan nama `site` (port 3000), setelah tahap 1.
- ffmpeg 9.0.2 terpasang lewat winget. Kalau tidak ada di PATH: `C:\Users\wilda\AppData\Local\Microsoft\WinGet\Packages\Gyan.FFmpeg_Microsoft.Winget.Source_8wekyb3d8bbwe\ffmpeg-9.0.2-full_build\bin\ffmpeg.exe`.
- Python 3.12 dengan PyMuPDF dan pypdf tersedia (untuk membaca PDF tim). OpenCV dan SciPy untuk solver kamera belum dicek di laptop ini.
- Laptop: RTX 3050 4 GB, tanpa Blender. User punya HP Android murah untuk tes FPS.
