# Three.js untuk Home: ringkasan

_29 Okt 2026. Bahan diskusi, belum ada keputusan. Saat ini Home memakai footage (frame WebP di canvas)._

## Apa itu Three.js

Library JavaScript untuk menampilkan dan menggerakkan scene 3D di browser lewat WebGL/GPU. Three.js adalah **mesin tampilan**, bukan alat modeling.

## Yang tidak bisa dilakukan Three.js

- **Membuat model yang rumit.** Three.js hanya punya bentuk dasar (kotak, bola, silinder, extrude, teks). Ruko, jalan, billboard dan props sederhana bisa disusun dari kode. Karakter tetap perlu model 3D (GLB) dari Blender, AI image-to-3D (Tripo, Meshy) atau seniman 3D.
- **Mengubah PNG jadi 3D.** Aset di `Assets/KARKATER`, `Master Lokasi` dan `Properti` hanya referensi. PNG bisa ditempel di bidang datar, tapi akan kelihatan tipis kalau kamera berputar.
- **Merig dan menganimasikan karakter.** Three.js hanya memutar animasi yang sudah dibuat. Rig dan gerakannya dibuat di luar (auto-rig Tripo/Meshy, Mixamo, atau animator). Gerakan spesifik seperti membuka pintu atau memegang binder butuh animator.
- **Menyamai kualitas render offline di HP.** Cahaya lembut, bayangan halus dan pantulan seperti di gambar Master harus di-bake ke tekstur di Blender. Cahaya real-time di HP jauh lebih sederhana.

## Trade-off: footage vs Three.js

| | Footage (sekarang) | Three.js |
|---|---|---|
| Ukuran file | Membesar per klip: 7,3 MB desktop untuk 2 dari 18 beat. Perkiraan 40–60 MB kalau semua beat | Kira-kira 5–10 MB untuk seluruh take, setelah dikompres |
| Kualitas visual | Setinggi hasil render tim | Lebih rendah, kecuali lighting di-bake |
| Beban perangkat | Ringan: hanya menggambar gambar | Berat untuk GPU, terutama di Android murah |
| Desktop vs HP | Dua set klip (16:9 dan 9:16), wajah bisa terpotong di HP tinggi | Satu scene; kamera diatur per ukuran layar |
| Copy di dalam scene | Posisinya dilacak frame per frame | Menempel langsung di permukaan 3D |
| Konsistensi | Video AI bisa melompat (contoh: Bu Dewi hilang di K2.2) | Konsisten, karena dunianya satu |
| Revisi kamera | Klip harus dibuat ulang | Cukup ubah kode |
| Alur kerja tim | Tim mengirim video | Tim (atau Claude) harus membuat model 3D |
| Usaha | Sudah berjalan | Besar; panggung hampir dibangun ulang |

## Risiko di HP Android kelas bawah

| Risiko | Akibat | Mitigasi |
|---|---|---|
| GPU lemah (mis. Mali-G52, Adreno 610) | fps turun, scroll patah-patah | Jumlah segitiga di bawah ±150 ribu, draw call sedikit, tanpa bayangan real-time dan post-processing |
| Layar ber-DPR tinggi (2,5–3×) | GPU harus menggambar jauh lebih banyak pixel | Batasi pixel ratio ke 1–1,5 |
| Memori terbatas | Tab crash atau WebGL "context lost" | Tekstur KTX2 maksimal 512–1024 px, geometri Meshopt, tangani event `webglcontextlost` |
| Panas (thermal throttling) | Lancar di awal, lalu melambat setelah 30–60 detik | Render hanya saat scroll berubah (`frameloop="demand"`), tanpa loop terus-menerus |
| Shader dikompilasi saat pertama tampil | Patah sesaat di awal | Pre-compile shader saat loading, material sesedikit mungkin |
| Data seluler lambat | Scene lama muncul | Muat bertahap, tampilkan K0 sebagai gambar dulu |
| Model karakter dari AI terlalu berat | Beberapa karakter dalam satu layar (K2 ada 5+) membebani GPU | Kurangi tiap karakter ke ±5–15 ribu segitiga |
| Browser atau WebView lama | WebGL2 tidak tersedia atau bermasalah | Deteksi kemampuan GPU; jatuh ke versi tumpuk (sudah ada) atau ke footage |

Wajib: tes di HP murah sungguhan (mis. Redmi atau Samsung Galaxy A seri bawah). Emulator di laptop tidak menggambarkan GPU HP.

## PoC beat 2 (29 Okt)

`prototype/beat2-3d.html`, dipublikasikan di https://claude.ai/artifact/BaoivwaavvfCJUFMUD3Uaw. K1 → K2: Heru membuka pintu dan masuk, kamera mengikuti sampai K2. Semua model dari kode (karakter tingkat 2), digerakkan scroll.

| | PoC Three.js | Footage beat 2 |
|---|---|---|
| Ukuran unduhan | ±190 KB (gzip) | 2,5 MB desktop, 2,7 MB HP |
| Draw call | ±140–170 | - |
| Segitiga | ±75–90 ribu | - |

Yang perlu dites: buka link di HP murah dan HP menengah, scroll pelan dari atas ke bawah, catat angka FPS di pojok kiri atas, dengan "Mode hemat" mati dan nyala.

## Rekomendasi

1. **PoC eksterior tanpa karakter (1–2 hari):** deret ruko dari Master 1, 2 dan denah Master 8, crane K0, truck kanan. Diukur ukuran file dan fps di HP murah.
2. **Tes satu karakter** (Bu Dewi) lewat Tripo atau Meshy dan auto-rig.
3. Setelah itu baru diputuskan: Three.js penuh, **hybrid** (3D untuk eksterior, footage untuk interior yang penuh karakter), atau tetap footage.

## Take K0 → K2 (30 Okt, tahap 1–2)

`prototype/k0-k2-3d.html`, sumbernya di `prototype/k0-k2/`. Status, keputusan dan langkah berikutnya ada di `prototype/k0-k2/HANDOFF.md`.

- Dibangun ulang dari keyframe tim (K0, K1, K2 versi pc dan hp). Kamera dan ukuran dunia dihitung dengan OpenCV dan SciPy; meleset ≤0,55% lebar layar di eksterior, ≤0,89% di K2 pc, ≤1,51% di K2 hp.
- Lokasi dibuat dari kode: fasad COMPANY dengan huruf timbul Nunito ExtraBold, awning, billboard, ruko kuning dan mint, interior lengkap. AO dihitung saat load (three-mesh-bvh). Karakter masih placeholder.
- three 0.186.1, dibundel dengan esbuild: 177 KB gzip, tanpa CDN. 34–108 draw call, 57–117 ribu segitiga.
