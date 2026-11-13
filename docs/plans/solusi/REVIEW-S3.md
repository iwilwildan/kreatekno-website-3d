# Review S3: Heru kasir

Tanggal: 7 November 2026. Status: selesai teknis, menunggu persetujuan visual user. S4 toko 3D belum dimulai.

## Perubahan

- `heru.ts` dipecah menjadi helper rambut dan kaki yang bisa dipakai ulang. Joint, spring, dan collider rambut/kepala/dada diekspor tanpa mengubah mesh Home.
- `heruKasir.ts` membangun varian Heru untuk toko Solusi: kaos putih lengan pendek, kerah cyan, celemek ungu dengan tepi cyan, tali leher/pinggang, papan nama putih kosong, celana dan sepatu Heru. Tidak ada jas, lanyard, kartu ID, atau tas.
- `kasirPose.ts` menyediakan tujuh pose: `idle`, `ready`, `lift`, `offer`, `wave`, `shrug`, dan `nod`. Dev lab menerima `?lab=heruKasir`, `&view=face`, pose tunggal, atau `&pose=all`.
- `roster.ts` mendaftarkan `heruKasir`. Belum ada impor karakter ini dari halaman Solusi publik; integrasi toko ada di S4.

## Bukti regresi Home

Render Heru sebelum/sesudah refactor di 1400×788 identik byte-for-byte:

| Render | SHA-256 sebelum/sesudah |
|---|---|
| Sheet | `CCB43381F9ABFA86D8ABBD4A7A2E5952E2A8DBC8927B43C24F6073AD5DABD7C5` |
| Face | `B4FC6D2825D66466D35732C1AF0B518A7A43029B89B62294E34D629F77330FFD` |
| Flat | `1B71095F2DD5E3128014AF458644ED2BF19122EA47CE719B2D94364E8A48C0A5` |

Segitiga Heru Home tetap 11.314 dan urutan `partTris` tidak berubah.

## Anggaran kasir

`tools/render/cast-bench.mjs heruKasir 7` pada build produksi, browser lokal hangat:

- waktu bangun: 90, 94, 98, 99, 106, 117, 152 ms;
- median 99 ms, p95 117 ms;
- 11.750 segitiga, di bawah batas 16 ribu;
- 2 render call di lab satu figur: satu karakter dan satu lantai. Karakter tetap satu `SkinnedMesh`/draw call.

Build produksi 54 route, typecheck, lint, dan format lulus. Screenshot berada di scratchpad `solusi-s3`, bukan `public` atau git.

## Batas checkpoint

- Pose menerjemahkan siluet/acuan Raka ke proporsi Heru; titik tangan `lift` dan `offer` baru bisa disetel persis ke kotak/kartu setelah set meja S4 tersedia.
- Skala root usulan ±1,77, posisi di toko, kepala hilang saat `ready`, kamera, reaksi klik, kedip, napas, follow-cursor, dan koreografi masih S4.
- Persetujuan user diperlukan untuk bentuk, warna pakaian, dan rasa tujuh pose sebelum S4.

