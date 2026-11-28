# Solusi dari template n8n.io: 5 halaman baru + 7 cerita Tonton

Per 28 Nov 2026, **seluruh implementasi S8 tersedia. Review N2–N5 dan N7–N12 selesai. N6 dan N13 lulus QA browser dan menunggu review.**

Induk: [PLAN-SOLUSI](../../../PLAN-SOLUSI.md) (tahap S8). Kontrak template detail, mesin cerita dan QA bersama: [PLAN-DETAIL](PLAN-DETAIL.md). Pola kerja per cerita mengikuti FP1 ([PLAN-FOLLOWUP-PROSPEK](PLAN-FOLLOWUP-PROSPEK.md) bagian 7).

## 1. Permintaan dan keputusan user (23 Nov 2026)

Permintaan: pelajari workflow di katalog n8n.io yang cocok untuk halaman Solusi, lalu jadikan semuanya halaman Solusi.

| Topik | Keputusan |
|---|---|
| Lingkup | 12 halaman: **5 Solusi baru** + **7 halaman lama** yang belum punya cerita Tonton (`asisten-sop`, `carousel-konten`, `berkas-dokumen`, `stok-menipis`, `pengingat-tagihan`, `ulasan-pelanggan`, `rekap-penjualan`). `cs-klinik`, `followup-prospek`, `booking-jasa`, `order-grup`, `riset-konten` tidak diubah |
| Sumber | Kalau ada workflow nyata di instance kita (`asisten-sop`, `carousel-konten`, `berkas-dokumen`), workflow itu sumber utama dan template n8n.io pelengkap. Halaman lain memakai template n8n.io |
| Kedalaman | Baca (copy ID/EN lengkap) untuk 12 halaman dulu, termasuk 5 kotak baru di etalase. Setelah itu cerita Tonton satu halaman per tahap, masing-masing direview |
| Label bukti | Seperti FP1: status `ide` ("Siap dibuat"), klien "(contoh)", kutipan dan angka contoh berlabel contoh (`metricsKind: "example"`) |
| Slug baru | `catat-pengeluaran`, `balas-komentar`, `faktur-pemasok`, `layanan-sdm`, `onboarding-klien` |
| Komentar IG | Komentar dengan kata kunci dibalas singkat di publik, lalu dikirimi 1 DM. Kalau orangnya membalas, chat lanjut ke tim |
| SDM | Satu halaman `layanan-sdm`: cuti + tanya kebijakan. Saring CV tidak dimasukkan |
| Urutan Tonton | 5 baru dulu (`catat-pengeluaran` → `balas-komentar` → `faktur-pemasok` → `layanan-sdm` → `onboarding-klien`), lalu `asisten-sop` → `carousel-konten` → `berkas-dokumen` → `stok-menipis` → `pengingat-tagihan` → `ulasan-pelanggan` → `rekap-penjualan` |

## 2. Cara template dipelajari

30 template diunduh dari API publik n8n.io (`api.n8n.io/api/templates/workflows/<id>`) ke scratchpad sesi, lalu diringkas per node: pemicu, jadwal, kondisi, prompt AI (dipotong), operasi Sheets/Drive/Gmail, URL layanan dan catatan sticky. Tidak ada template yang diimpor atau dijalankan. Isi template (prompt, teks) tidak disalin ke halaman; halaman hanya memakai alurnya dengan kata-kata sendiri, dan tidak menyebut template sebagai pekerjaan klien.

## 3. Temuan riset yang mengubah plan

- **Template 5941 tidak mengirim DM.** Deskripsinya menyebut DM, tapi node-nya memanggil endpoint balas komentar (upload-post.com, API pihak ketiga). DM dari komentar di API resmi Meta disebut *private reply*: **hanya 1 pesan per komentar, dalam 7 hari** sejak komentar dibuat (Instagram Live: hanya selama siaran). Percakapan lanjut kalau orangnya membalas (jendela 24 jam) ([Meta: Private Replies](https://developers.facebook.com/docs/instagram-platform/private-replies/)). Halaman `balas-komentar` memakai batas ini dan API resmi, bukan layanan pihak ketiga.
- **Kebijakan WhatsApp Business sejak 15 Jan 2026** melarang asisten AI serbaguna di Business API; bot untuk fungsi bisnis tertentu (CS, FAQ, pesanan) tetap boleh ([TechCrunch](https://techcrunch.com/2025/10/18/whatssapp-changes-its-terms-to-bar-general-purpose-chatbots-from-its-platform/), [respond.io](https://respond.io/blog/whatsapp-chatbot-policy-2026)). Semua halaman menggambarkan bot dengan tugas sempit (catat nota, cuti dan kebijakan, SOP), tidak sebagai "asisten yang bisa ditanya apa saja".
- **Jendela 24 jam WhatsApp** (sudah jadi temuan FP1) berlaku juga untuk pesan terjadwal ke pemilik, tim, dan pelanggan: rekap penjualan malam, peringatan stok, pengingat tagihan, laporan ulasan. Di luar 24 jam hanya template pesan yang disetujui. Copy dan FAQ halaman-halaman itu menyebutnya; `pengingat-tagihan` ke pelanggan memakai template pesan yang disetujui.
- **UU PDP Pasal 10**: subjek data berhak keberatan atas keputusan yang hanya diambil lewat pemrosesan otomatis. Saring CV sudah dikeluarkan dari lingkup. Untuk cuti, template 4975 menyetujui otomatis cuti < 2 hari; halaman memakai rancangan yang lebih aman: **semua pengajuan diputuskan atasan lewat tombol**, AI hanya mengecek sisa cuti dan menyiapkan ringkasan.
- **Template banyak memakai layanan di luar app yang kita pakai** (Postgres, NocoDB, HubSpot, Airtable, Supabase, Mistral OCR, PostGrid, Slack). Halaman memakai padanan yang sudah ada di skema `apps` (WhatsApp, Sheets, Gmail, Calendar, Drive, Instagram) supaya konsisten dengan Solusi lain.
- **Community node** di beberapa template (GOWA di 6474, Rapiwa di 9879, Tesseract di 4020) tidak dipakai sebagai acuan teknis.

## 4. Rancangan per halaman

Rel = langkah workflow yang nanti jadi node rel di Tonton. Jumlah dan isi adegan diputuskan di tahap Tonton masing-masing (storyboard direview dulu), tidak di sini.

### 4.1 `catat-pengeluaran` (baru)

| Item | Isi |
|---|---|
| Sumber | [5201](https://n8n.io/workflows/5201) (teks, foto nota, pesan suara; daftarkan pengguna otomatis; tanya laporan), [4136](https://n8n.io/workflows/4136) (rekap harian 08.00), [4020](https://n8n.io/workflows/4020) (foto struk, kategori, minta ulang kalau total 0, prompt sudah dwibahasa ID/EN) |
| Industri / tim / apps | retail, jasa / keuangan, manajemen / whatsapp, sheets |
| Masalah | Nota menumpuk di dompet dan galeri, pengeluaran baru dicatat akhir bulan, kategori tidak seragam |
| Rel draf | 1 Nota dikirim (foto, teks, atau pesan suara) → 2 Isi dibaca (teks dari foto atau suara) → 3 AI menyusun (toko, tanggal, total, kategori) → 4 Dicek (total kosong atau tak terbaca: minta kirim ulang) → 5 Tercatat di tabel + balasan konfirmasi → 6 Rekap pagi ke pemilik |
| Catatan | Template menyimpan di Postgres; halaman memakai Sheets. Tidak menggantikan pembukuan atau pajak (FAQ). Rekap pagi memakai template pesan yang disetujui |

### 4.2 `balas-komentar` (baru)

| Item | Isi |
|---|---|
| Sumber | [5941](https://n8n.io/workflows/5941) (cek komentar tiap 15 menit, tabel anti dobel, catat hasil), [3896](https://n8n.io/workflows/3896) (Graph API resmi: baca komentar, balas, DM) |
| Industri / tim / apps | retail, jasa / marketing, penjualan / instagram, sheets |
| Masalah | Komentar "harga?" dan "info" tidak sempat dibalas, calon pembeli pindah ke toko lain |
| Rel draf | 1 Komentar baru → 2 Sudah pernah dibalas? (tabel) → 3 Kata kunci cocok → 4 Balasan publik singkat → 5 1 DM berisi katalog atau link → 6 Tercatat + kalau dibalas, chat lanjut ke tim |
| Catatan | 1 DM per komentar, maksimal 7 hari (FAQ). Pakai API resmi. Komentar tanpa kata kunci dan komentar negatif tidak dibalas otomatis |

### 4.3 `faktur-pemasok` (baru)

| Item | Isi |
|---|---|
| Sumber | [4247](https://n8n.io/workflows/4247) (AI isi kolom faktur, cocokkan ke data master barang, tandai yang tidak cocok), [4452](https://n8n.io/workflows/4452) (faktur dari email, folder, atau form; persetujuan lewat tombol; notifikasi ditolak), [4376](https://n8n.io/workflows/4376), [4868](https://n8n.io/workflows/4868) (lewati file yang sudah diproses; kolom diambil dari baris judul tabel) |
| Industri / tim / apps | retail, logistik / keuangan, operasional / gmail, drive, sheets, whatsapp |
| Masalah | Faktur pemasok diketik ulang, salah harga atau barang tidak ketahuan, persetujuan bayar lewat chat yang tercecer |
| Rel draf | 1 Faktur masuk (email atau folder) → 2 Teks dibaca → 3 AI mengisi kolom (nomor, pemasok, tanggal, jatuh tempo, item, total) → 4 Dicocokkan dengan daftar harga pemasok → 5 Tercatat, yang tidak cocok ditandai → 6 Pemilik menyetujui atau menolak lewat tombol |
| Catatan | Tidak menggantikan faktur pajak/e-Faktur (FAQ). Pembayaran tidak dijalankan otomatis |

### 4.4 `layanan-sdm` (baru)

| Item | Isi |
|---|---|
| Sumber | [4975](https://n8n.io/workflows/4975), hanya cabang cuti (cek dan perbarui tabel cuti, eskalasi ke atasan, tombol persetujuan) dan tanya kebijakan (jawab dari dokumen kebijakan). Absensi lokasi, keluhan dan saring CV tidak dipakai |
| Industri / tim / apps | retail, jasa, logistik / sdm, manajemen / whatsapp, sheets, drive |
| Masalah | HR menjawab pertanyaan yang sama berulang kali, pengajuan cuti lewat chat pribadi atasan dan sisa cuti dihitung manual |
| Rel draf | 1 Karyawan chat → 2 Jenis dikenali (cuti / tanya kebijakan / lainnya ke HR) → 3a Cuti: sisa cuti dicek, ringkasan ke atasan → 4a Atasan menyetujui lewat tombol → 5a Tabel cuti diperbarui + kabar ke karyawan; 3b Kebijakan: jawaban dari dokumen kebijakan, tidak ketemu → ke HR |
| Catatan | Semua cuti diputuskan atasan (UU PDP Pasal 10). Bedanya dengan `asisten-sop`: SDM = urusan karyawan (cuti, aturan kepegawaian), SOP = cara kerja operasional. Cerita Tonton memilih satu jalur utama (cuti) dan menyebut jalur kebijakan singkat |

### 4.5 `onboarding-klien` (baru)

| Item | Isi |
|---|---|
| Sumber | [3958](https://n8n.io/workflows/3958) (klien baru di CRM → email sambutan personal → AI kalender mencari slot kosong dan membuat undangan → PIC ditetapkan), [4448](https://n8n.io/workflows/4448) (baris baru dari form → checklist onboarding → email sambutan AI) |
| Industri / tim / apps | jasa, properti / penjualan, operasional / sheets, gmail, calendar |
| Masalah | Setelah deal, klien menunggu kabar, dokumen yang dibutuhkan diminta berkali-kali, rapat awal dijadwalkan lewat chat bolak-balik |
| Rel draf | 1 Klien baru tercatat (form atau tabel deal) → 2 Checklist sesuai paket → 3 AI menulis email sambutan + daftar yang perlu disiapkan → 4 Slot kosong dicari di kalender → 5 Undangan rapat awal dikirim → 6 PIC dan status tercatat |
| Catatan | CRM template (HubSpot) diganti tabel. Email dikirim otomatis atau sebagai draf diputuskan saat copy (pertanyaan terbuka 7) |

### 4.6 `asisten-sop` (lama, workflow nyata)

- Sumber utama: catatan audit workflow agen SOP di bagian 11. Dokumen Drive diproses manual, jawaban Telegram menyebut sumber, dan bot memberi arahan untuk menghubungi penanggung jawab saat perlu. Catatan Sheets masih berupa rancangan.
- Riset dan storyboard N7 memakai Telegram sesuai keputusan N1b. Pertanyaan pertama dijawab dengan sumber. Pada pertanyaan kedua, staf diarahkan ke kepala cabang. [Storyboard Asisten SOP](PLAN-ASISTEN-SOP.md#7-n7-cerita-tonton-asisten-sop)

### 4.7 `carousel-konten` (lama, workflow nyata)

- Sumber utama adalah catatan audit N1b untuk workflow generator carousel yang menyimpan slide dan caption, mengirim pratinjau ke tim, lalu menandai baris `Pending Review`.
- Storyboard N8 mempertahankan satu bingkai brand untuk lima slide dan berakhir ketika tim menerima draf dengan status Menunggu dicek. [Storyboard Carousel Konten](PLAN-CAROUSEL-KONTEN.md#7-n8-carousel-konten)

### 4.8 `berkas-dokumen` (lama, status `ide`, bersumber dari template)

- Keputusan N1b memakai template 4868 dan 4827 dengan kantor notaris dan PPAT contoh. Status layanan Siap dibuat.
- Storyboard N9 mengikuti foto buram dan satu dokumen yang masih kurang sampai kiriman baru terbaca dan staf menandai berkas lengkap. [Storyboard Berkas Dokumen](PLAN-BERKAS-DOKUMEN.md#7-n9-berkas-dokumen)

### 4.9 `stok-menipis` (lama)

- Storyboard N10 memakai pencatatan pergerakan barang dan ambang di bawah minimum dari template 3979. Tim menerima peringatan, memesan ulang, dan mencatat barang saat diterima. Template 11055 menjadi rujukan hitung fisik berkala di Baca.
- N10 mempertahankan perkiraan sebagai Rancangan dan menyamakan copy ambang di Baca serta etalase. [Storyboard Stok Menipis](PLAN-STOK-MENIPIS.md#7-n10-stok-menipis)

### 4.10 `pengingat-tagihan` (lama)

- Storyboard N11 memakai jadwal pagi dan riwayat per tahap dari template 14313, serta keputusan N1b untuk H-3, H, H+7, dan serah terima internal pada H+30.
- Contoh mengikuti satu tagihan yang ditandai Lunas setelah pembayaran dicatat dan satu tagihan terbuka yang diteruskan ke pemilik pada H+30. [Storyboard Pengingat Tagihan](PLAN-PENGINGAT-TAGIHAN.md#7-n11-pengingat-tagihan)

### 4.11 `ulasan-pelanggan` (lama)

- Sumber: [6112](https://n8n.io/workflows/6112) (tiap hari 10.00 ulasan dari beberapa sumber diseragamkan, duplikat dibuang, disimpan), [4032](https://n8n.io/workflows/4032) (AI merangkum keluhan dan pujian yang berulang), [9290](https://n8n.io/workflows/9290) (laporan mingguan: dibanding minggu lalu dan rata-rata 12 minggu, tingkat balasan, ringkasan satu kalimat).
- Rel draf: ulasan dikumpulkan tiap hari → diseragamkan (bintang, teks, tanggal, sumber) → disimpan tanpa duplikat → mingguan AI mengelompokkan tema → laporan ke manajemen + daftar ulasan yang belum dibalas.
- N12 memakai formulir, chat layanan dan email yang dikelola restoran. Baca memperjelas izin penggunaan sumber eksternal dan rating yang tersedia. [Storyboard Ulasan Pelanggan](PLAN-ULASAN-PELANGGAN.md#7-n12-ulasan-pelanggan)

### 4.12 `rekap-penjualan` (lama)

- N13 memakai pola perbandingan periode dari template 6679 dan pengiriman rekap harian dari template 13486. Storyboard membandingkan kemarin dan hari yang sama minggu lalu, lalu menelusuri penjualan produk bulan sebelumnya dari Sheets. [Storyboard Rekap Penjualan](PLAN-REKAP-PENJUALAN.md#7-n13-rekap-penjualan)

## 5. Tahapan

Setiap tahap: riset singkat dan pertanyaan di awal, berhenti untuk review di akhir, screenshot hanya di chat, tanpa commit sampai diminta.

| Tahap | Isi | Selesai bila |
|---|---|---|
| **N0 Data dan etalase** | `SlugSchema` + 5 slug; `items/<slug>.ts` kerangka; `catalog.ts` EN; `taksonomi.ts`; pemetaan 5 slug baru ke kartu masalah yang ada (`kartu.ts`); `related()` dicek untuk 17 solusi; etalase 3D 17 kotak (batas `MAX_BOXES` 24, rak cukup); subplan `PLAN-<SLUG>.md` untuk 5 slug baru; baris indeks di PLAN-SOLUSI; `logic.test.mjs` dan `etalase-qa.mjs` diperbarui (jumlah "Siap dibuat" 9 → 14) | Etalase, Cari, Kartu dan hasil menampilkan 17 solusi di ID/EN; tes lulus |
| **N1a Baca 5 baru** | Copy ID/EN lengkap seperti FP1: `title`, `question`, `result`, `summary` ≤ 20 kata, `answer`, `client` contoh, `painsLead`, `pains`, `built`, kutipan contoh, `steps`, `compare`, `fit`, `notFit`, `prep`, `metrics` contoh, FAQ (termasuk batas aturan platform) | Review copy user; halaman tanpa Tonton tampil rapi di 5 viewport |
| **N1b Baca 7 lama** | Copy ditulis ulang dari workflow nyata (3) atau template (4), seperti `followup-prospek`. Workflow nyata hanya dibaca | Sama dengan N1a |
| **N2–N13 Tonton** | Satu slug per tahap, urutan di bagian 1. Tiap tahap: baca sumber → draf rel dan adegan → **review storyboard** → `cerita/<slug>.ts`, `Panggung<Nama>.tsx`, `ceritaFilm<Nama>.ts`, gaya CSS ber-prefix, konfigurasi di `ceritaTiming.ts` dan `CeritaScroll.tsx` → `tools/solusi/<kode>-qa.mjs` | QA cerita lulus (5 viewport maju/mundur, node dan tombol, reduced motion, GSAP diblokir, EN), regresi cerita lain dan etalase lulus, review user |

Kode tahap Tonton (prefix CSS dan nama QA): `cp` catat-pengeluaran, `bk` balas-komentar, `fk` faktur-pemasok, `sd` layanan-sdm, `ok` onboarding-klien, `as` asisten-sop, `cr` carousel-konten, `bd` berkas-dokumen, `sm` stok-menipis, `pt` pengingat-tagihan, `up` ulasan-pelanggan, `rp` rekap-penjualan.

Cek di setiap tahap: typecheck, ESLint, Prettier, `logic.test.mjs`, `next build`; HTML server tanpa nama klien asli, nomor, prompt, nama model, em dash; teks yang terlihat sesuai `docs/SITE-BRIEF.md` bagian 2. Tidak ada library baru.

## 6. Risiko

- **Ukuran pekerjaan.** 12 cerita × ±1 sesi (pola FP1) + 2 tahap Baca. Mesin cerita (`CeritaScroll`, `ceritaTiming`) makin banyak cabang per slug; kalau mulai sulit dirawat, refactor konfigurasi per slug jadi data sebelum N8.
- **Bundle dan CSS.** Tiap cerita menambah komponen Panggung dan gaya. Cek ukuran chunk halaman detail di N0 dan setiap tahap Tonton; Panggung tetap dimuat hanya di slug-nya.
- **Klaim berlebihan.** Template sering menjanjikan lebih dari node-nya (contoh 5941). Copy hanya memuat langkah yang ada di sumber atau ditandai "Rancangan".
- **Tumpang tindih.** `layanan-sdm` vs `asisten-sop`, `catat-pengeluaran` vs `faktur-pemasok`, `balas-komentar` vs `cs-klinik`. Pembeda ditulis di `fit`/`notFit` masing-masing.
- **Regresi etalase.** 17 kotak mengubah jumlah baris rak di HP; `etalase-qa.mjs` dan cek visual di N0.

## 7. Pertanyaan terbuka (dijawab di tahap terkait)

1. N0: kartu masalah baru untuk 5 slug baru (perlu mengubah batas `k1`–`k24` dan layout Kartu 3D) atau cukup dipetakan ke kartu yang ada? Usulan: cukup kartu yang ada.
2. N1a: nama klien contoh dan contoh data per slug baru.
3. N1b / tahap `asisten-sop`: Telegram disetujui 24 Nov. Review N7 ditutup saat user meminta lanjut ke tahap berikutnya pada 27 Nov.
4. Tahap `stok-menipis`: kartu perkiraan ditampilkan dengan label Rancangan sesuai storyboard yang dilanjutkan user.
5. Tahap `pengingat-tagihan`: H-3, H, H+7, serta serah terima ke pemilik pada H+30 diputuskan di N1b dan ditampilkan di N11.
6. Tahap `balas-komentar`: daftar kata kunci contoh dan isi DM contoh.
7. Tahap `onboarding-klien`: email sambutan dikirim otomatis atau sebagai draf ke tim.

## 8. Log

- 23 Nov 2026: plan ditulis setelah 30 template dibaca dan riset aturan Meta, WhatsApp dan UU PDP; keputusan user di bagian 1. Belum ada kode, commit atau push.
- 23 Nov 2026 (N0): lihat bagian 9.
- 27 Nov 2026: user menyatakan N2 sudah direview. Riset dan storyboard N3 dicatat di [Balas Komentar](PLAN-BALAS-KOMENTAR.md#4-n3-cerita-tonton-balas-komentar).
- 27 Nov 2026: Tonton N3 Balas Komentar selesai secara teknis dan lulus QA 130/130. [Hasil N3](PLAN-BALAS-KOMENTAR.md#45-hasil-implementasi-27-nov-2026)
- 27 Nov 2026: user meminta lanjut setelah membuka preview N3. Riset dan storyboard N4 dicatat di [Faktur Pemasok](PLAN-FAKTUR-PEMASOK.md#4-n4-cerita-tonton-faktur-pemasok).
- 27 Nov 2026: Tonton N4 Faktur Pemasok selesai secara teknis dan lulus QA 121/121. [Hasil N4](PLAN-FAKTUR-PEMASOK.md#45-hasil-implementasi-27-nov-2026)
- 27 Nov 2026: user meminta lanjut saat preview N4 terbuka. Riset dan storyboard N5 dicatat di [Layanan SDM](PLAN-LAYANAN-SDM.md#4-n5-cerita-tonton-layanan-sdm).
- 27 Nov 2026: Tonton N5 Layanan SDM selesai secara teknis dan lulus QA 121/121. [Hasil N5](PLAN-LAYANAN-SDM.md#45-hasil-implementasi-27-nov-2026)
- 27 Nov 2026: user meminta lanjut dari hasil N5. Riset dan storyboard N6 dicatat di [Onboarding Klien](PLAN-ONBOARDING-KLIEN.md#4-n6-cerita-tonton-onboarding-klien).
- 27 Nov 2026: Tonton N6 Onboarding Klien selesai secara teknis dan lulus QA 126/126. [Hasil N6](PLAN-ONBOARDING-KLIEN.md#45-hasil-implementasi-27-nov-2026)
- 27 Nov 2026: etalase N6 lulus 114/114 dan review N6 masih terbuka. Riset dan storyboard N7 Asisten SOP siap direview. [Storyboard N7](PLAN-ASISTEN-SOP.md#73-rel-dan-adegan)
- 27 Nov 2026: user menyetujui storyboard dan penyesuaian Baca N7. Tonton Asisten SOP lulus QA 128/128. [Hasil N7](PLAN-ASISTEN-SOP.md#75-hasil-implementasi-27-nov-2026)
- 27 Nov 2026: user meminta lanjut setelah preview N7 tersedia. Review N7 ditutup. Riset dan storyboard N8 siap direview. [Storyboard N8](PLAN-CAROUSEL-KONTEN.md#73-rel-dan-adegan)
- 27 Nov 2026: user meminta lanjut setelah storyboard N8 siap. Tonton Carousel Konten tersedia untuk ID/EN dan lulus QA 130/130. [Hasil N8](PLAN-CAROUSEL-KONTEN.md#75-hasil-implementasi-27-nov-2026)
- 28 Nov 2026: user meminta lanjut setelah preview N8 tersedia. Review N8 ditutup. Riset dan storyboard N9 siap direview. [Storyboard N9](PLAN-BERKAS-DOKUMEN.md#73-rel-dan-adegan)
- 28 Nov 2026: user menyetujui storyboard N9. Tonton Berkas Dokumen tersedia untuk ID/EN dan lulus QA 135/135. [Hasil N9](PLAN-BERKAS-DOKUMEN.md#75-hasil-implementasi-28-nov-2026)
- 28 Nov 2026: user meminta lanjut setelah preview N9 tersedia. Review N9 ditutup. Riset, storyboard, dan usulan penyesuaian Baca N10 siap direview. [Storyboard N10](PLAN-STOK-MENIPIS.md#73-rel-dan-adegan)
- 28 Nov 2026: user meminta lanjut setelah storyboard N10 siap. Tonton Stok Menipis serta penyesuaian Baca dan etalase tersedia untuk ID/EN dan lulus QA 137/137. [Hasil N10](PLAN-STOK-MENIPIS.md#76-hasil-implementasi-28-nov-2026)
- 28 Nov 2026: user meminta lanjut setelah preview N10 tersedia. Review N10 ditutup. Riset, storyboard, dan usulan penyesuaian Baca N11 siap direview. [Storyboard N11](PLAN-PENGINGAT-TAGIHAN.md#73-rel-dan-adegan)
- 28 Nov 2026: user meminta lanjut setelah storyboard N11 siap. Tonton Pengingat Tagihan dan penyesuaian Baca tersedia untuk ID/EN dan lulus QA 135/135. [Hasil N11](PLAN-PENGINGAT-TAGIHAN.md#76-hasil-implementasi-28-nov-2026)
- 28 Nov 2026: user meminta lanjut setelah preview N11 tersedia. Review N11 ditutup. Riset, storyboard dan usulan copy Baca N12 siap direview. [Storyboard N12](PLAN-ULASAN-PELANGGAN.md#73-rel-dan-adegan)
- 28 Nov 2026: user meminta lanjut setelah storyboard N12 siap. Tonton Ulasan Pelanggan dan penyesuaian Baca tersedia untuk ID/EN dan lulus QA 134/134. [Hasil N12](PLAN-ULASAN-PELANGGAN.md#76-hasil-implementasi-28-nov-2026)
- 28 Nov 2026: user meminta lanjut setelah preview N12 tersedia. Review N12 ditutup. Riset, storyboard, dan usulan copy Baca N13 siap direview. [Storyboard N13](PLAN-REKAP-PENJUALAN.md#73-rel-dan-adegan)
- 28 Nov 2026: user menyetujui storyboard N13 dan penyesuaian Baca. Tonton Rekap Penjualan tersedia untuk ID/EN dan lulus QA 134/134. [Hasil N13](PLAN-REKAP-PENJUALAN.md#76-hasil-implementasi-28-nov-2026)

## 9. N0: data dan etalase (selesai teknis 23 Nov, menunggu review)

- Baru: `site/content/solusi/items/{catat-pengeluaran,balas-komentar,faktur-pemasok,layanan-sdm,onboarding-klien}.ts` (copy katalog ID setara halaman `ide` lama: judul, pertanyaan, hasil, ringkasan, jawaban, masalah, 4 langkah, perbandingan, kecocokan, persiapan, FAQ; tanpa `en`, kutipan dan angka, yang menyusul di N1a); subplan `PLAN-{CATAT-PENGELUARAN,BALAS-KOMENTAR,FAKTUR-PEMASOK,LAYANAN-SDM,ONBOARDING-KLIEN}.md`.
- Diubah: `schema.ts` (5 slug), `index.ts` (17 solusi, 5 baru di akhir), `catalog.ts` (judul, hasil, ringkasan, kata kunci EN), `kartu.ts`, `tools/solusi/logic.test.mjs`, `tools/solusi/etalase-qa.mjs`; indeks di `PLAN-SOLUSI.md`.
- Kartu masalah (pertanyaan terbuka 1, usulan "cukup kartu yang ada" ikut disetujui bersama plan): k2 +faktur-pemasok 2, +catat-pengeluaran 1; k6 +balas-komentar 2; k17 +balas-komentar 2; k24 +balas-komentar 1; k18 +layanan-sdm 2; k19 +layanan-sdm 1; k8 dan k10 +onboarding-klien 1. Bobot kartu lama tidak berubah. `catat-pengeluaran` dan `onboarding-klien` hanya punya bobot kecil, jadi jarang muncul di hasil Kartu.
- Etalase: 17 kotak di 7 rak. Rak diurutkan dari yang paling penuh, dan kalau sama banyak mengikuti urutan tim, sehingga **rak teratas sekarang Marketing** (Riset Konten, Carousel, Balas Komentar), bukan Layanan pelanggan. Rak Keuangan dan Marketing masing-masing jadi 3 kotak, Penjualan dan SDM 2.
- Cari: 3 halaman hasil (6 + 6 + 5). Kata kunci uji diganti supaya tetap 1–5 hasil: stok 1, foto 2, rekap 3, dokumen 4, pemilik 5.
- Perbaikan dari cek etalase: judul `layanan-sdm` dipendekkan (isi kotak meluap 5 px), hasil `balas-komentar`, `layanan-sdm`, `onboarding-klien` dan judul `onboarding-klien` dipendekkan (teks hasil terpotong "…"). Hasil EN keempat slug baru juga dipendekkan. Di EN, 5 kotak lama (riset-konten, cs-klinik, pengingat-tagihan, followup-prospek, rekap-penjualan) sudah terpotong sebelumnya; tidak diubah.
- Tes `logic.test.mjs`: tes baru S8 (status `ide`, tanpa kata template/n8n, judul sampai jawaban tanpa nama platform, tiap slug ada di kartu); kesamaan sumber v1 dan kartu mengabaikan tambahan S8.
- Dicek di build produksi (`next build` lulus setelah diulang; peringatan kerentanan Next.js yang sama, upgrade tidak dijalankan): `etalase-qa.mjs` 114/114 (satu run sebelumnya 113/114: cek reduced motion HP gagal karena jeda 250 ms, lulus saat diulang), `rt1-qa.mjs` 41/41 (17 detail × ID/EN), regresi cerita `og5` 106/106, `fp1` 107/107, `ck1` 114/114, `rk1` 106/106, `bj1` 106/106 (error console hanya 404 analytics Vercel lokal dan GSAP yang sengaja diblokir); `logic.test.mjs` 18/18; typecheck, Prettier; ESLint untuk `content/solusi`. Etalase ID/EN dan detail `catat-pengeluaran` dicek visual (screenshot hanya di chat).
- Belum: review user, N1a. Tidak ada commit/push.

## 10. N1a: copy Baca ID/EN 5 halaman baru (selesai teknis 23 Nov, menunggu review)

- Keputusan user (23 Nov): klien contoh **set A**: kedai kopi dua cabang (`catat-pengeluaran`), toko hijab online (`balas-komentar`), toko bangunan (`faktur-pemasok`), jaringan minimarket 40 karyawan (`layanan-sdm`), agensi pemasaran digital (`onboarding-klien`). Email sambutan `onboarding-klien` berupa **draf yang dicek staf** sebelum dikirim, bersama undangan rapat (pertanyaan terbuka 2 dan 7 terjawab).
- Lima item mendapat copy lengkap seperti FP1: `client` "(contoh)", `painsLead`, `built` (6 poin), kutipan contoh, `metrics` contoh dengan `metricsKind: "example"`, FAQ 3–4, dan `en` lengkap. Angka contoh adalah aturan rancangan (15 menit, 1 pesan, 7 hari, 08.00, 6 kolom, dll.), bukan klaim hasil.
- Judul `balas-komentar` diganti jadi 'Komentar "harga?" tidak ada yang terlewat' karena judul lama menjanjikan waktu ("dalam hitungan menit"), dilarang `SITE-BRIEF.md` bagian 2. Ringkasan EN katalog `onboarding-klien` mengikuti alur draf.
- Bug lama diperbaiki: di halaman detail, ikon Instagram, Gmail dan Drive tampil sebagai ikon tabel karena `SolutionDetail.tsx` hanya mengenal WhatsApp, Threads dan Kalender. Sekarang glyph mengikuti ikon taksonomi seperti kotak etalase (warna latar tidak diubah). Halaman lama yang ikut berubah ikonnya: `carousel-konten`, `asisten-sop`, `berkas-dokumen`, `pengingat-tagihan`, `ulasan-pelanggan`.
- Tes: `logic.test.mjs` (tes S8 diperluas: `en`, kutipan, angka contoh, klien contoh, ringkasan ≤ 20 kata; kata kunci uji 4 hasil diganti dari "dokumen" ke "harga"), QA baru `tools/solusi/s8-qa.mjs` (5 slug × ID/EN × 5 viewport: 200, satu h1, canonical, klien, kutipan, angka, poin, FAQ, tanpa scroll samping, tanpa em dash dan nama template, console bersih).
- Dicek di build produksi (`next build` lulus setelah diulang; peringatan kerentanan Next.js yang sama, upgrade tidak dijalankan): `s8-qa.mjs` 550/550, `rt1-qa.mjs` 41/41, `etalase-qa.mjs` 114/114, `logic.test.mjs` 18/18; typecheck, ESLint, Prettier. Ikon aplikasi di detail dan halaman `balas-komentar` desktop dicek visual (screenshot hanya di chat).
- **Belum lulus: QA cerita** `og5` 74–78/106, `bj1` 80/106, `rk1` 80/106, `ck1` 86/114, `fp1` 77/107; caption dan elemen panggung tertinggal satu adegan saat scroll. Bukan dari perubahan N1a: dengan `SolutionDetail.tsx` versi HEAD hasilnya sama (og5 75/106). Saat itu laptop memakai baterai (`BatteryStatus` 1) dengan beban CPU 50%, dan build 2,5× lebih lambat dari biasanya (10,6 dtk vs 4,0 dtk); di N0 kelima QA ini lulus penuh. Perlu diulang dengan charger terpasang.
- 24 Nov (charger terpasang): QA cerita diulang. Dengan CPU masih 29–56% (proses lain), og5 102/106 lalu 100/106, bj1 101/106, rk1 102/106, ck1 112/114, fp1 107/107; adegan yang gagal berpindah antar run, karena QA memberi jeda tetap 1,1 detik setelah scroll. Dengan CPU 11–15%: **og5 106/106, bj1 106/106, rk1 106/106, ck1 114/114**, fp1 107/107 (error console hanya GSAP yang sengaja diblokir dan 404 analytics lokal). Regresi cerita lulus; QA cerita perlu dijalankan saat mesin sepi.
- Belum: review user, N1b. Tidak ada commit/push.

## 11. N1b: copy Baca ID/EN 7 halaman lama (selesai teknis 24 Nov, menunggu review)

Workflow nyata yang dibaca (hanya baca, tidak dijalankan atau diubah):

| Halaman | Workflow | Temuan |
|---|---|---|
| `asisten-sop` | `n8n-mcp`, agen SOP untuk sebuah instansi (17 node, nonaktif; nama klien tidak dicatat) | Satu PDF SOP kepegawaian sebuah instansi dari Drive dimasukkan manual ke basis pengetahuan; bot Telegram menjawab hanya dari basis itu dengan bahasa resmi, wajib menyebut pasal dan judul dokumen; kalau perlu manusia, bot hanya membalas "tanyakan ke bagian kepegawaian" (ringkasan tidak dikirim ke siapa pun); node log harian di Sheets tidak tersambung. Halaman: klinik gigi contoh, Telegram, log pertanyaan sebagai rancangan |
| `carousel-konten` | `n8n-kreatekno`, generator carousel untuk sebuah brand kopi, versi 2 (40 node, nonaktif; nama klien tidak dicatat) + `n8n-mcp` "Carousel Automation" (12 node, nonaktif) | Baris tabel "Pending Generation" (judul, isi, jenis BERITA/EDUKASI/MARKETING, jumlah slide, gambar acuan opsional) → folder per run → bingkai brand tetap (logo, warna, footer) → AI menulis perintah gambar per slide → caption < 450 karakter + tagar → gambar per slide dengan bingkai sebagai acuan, perintah yang ditolak diperbaiki lalu diulang → gambar ke folder dan grup Telegram tim → status "Pending Review". Tidak ada posting otomatis. "Threads Carousel Posting" di `n8n-mcp` ternyata posting rangkaian teks Threads, bukan carousel gambar |
| `berkas-dokumen` | `n8n-kreatekno`, sub-workflow potong visa milik klien agen perjalanan (14 node, aktif) | Hanya mengubah PDF e-visa jadi gambar dan memotong bagian visa; tidak ada folder per pelanggan atau tabel kelengkapan seperti janji copy lama. Temuan keamanan pada workflow ini sudah dilaporkan ke user di chat (rincian tidak dicatat di repo publik). Tidak dipakai |

Keputusan user (24 Nov): `berkas-dokumen` memakai template (4868, 4827), status `jalan` → `ide`, klien contoh (dipilih Claude: kantor notaris dan PPAT, supaya tidak terkait klien agen perjalanan), industri + `properti`; `asisten-sop` lewat Telegram (aplikasi `telegram` ditambah ke `AppSchema`/`APPS`, ikon `TelegramLogo`, warna #0077B5); klien contoh set A (klinik gigi tiga cabang, brand kopi kemasan, toko grosir sembako, jasa servis AC kontrak bulanan, restoran keluarga dua cabang, distributor minuman); `pengingat-tagihan` langsung ke pelanggan dengan template pesan yang disetujui (H-3, hari H, lewat 7 hari; lewat 30 hari ke pemilik).

Hasil:
- Tujuh item ditulis ulang dengan copy ID/EN lengkap seperti FP1 (`client` contoh, `painsLead`, `built`, kutipan dan angka contoh, FAQ 3, `en`). Klaim yang tidak ada di sumber dibuang atau ditandai "Rancangan": perkiraan kapan stok habis (`stok-menipis`), log pertanyaan yang belum terjawab (`asisten-sop`). Angka hasil lama `berkas-dokumen` ("60% waktu berkurang", "0 berkas terselip") dihapus.
- Judul `carousel-konten` jadi "Carousel konten dari satu topik" (judul lama menyebut nama platform). `catalog.ts` EN ketujuh slug diperbarui.
- Dampak: "Sudah berjalan" tinggal `order-grup` dan `booking-jasa`; etalase 15 "Siap dibuat". Filter Aplikasi di Cari punya pilihan Telegram.
- Tes: `logic.test.mjs` (tujuh slug keluar dari tes kesamaan sumber v1, sisa 41 kolom `order-grup`; tes baru N1b; jumlah `jalan` 2; kata kunci uji 5 hasil "pemilik" → "jadwal"), `etalase-qa.mjs` (15 Siap dibuat), `s8-qa.mjs` diperluas ke 12 slug (regex nama vendor tidak lagi melarang kata "template", karena "template pesan" dipakai di FAQ).
- Temuan sampingan untuk N3: `n8n-mcp` punya workflow aktif "Instagram Comment → DM" (34 node). Dibaca di awal tahap Tonton `balas-komentar`.
- Dicek di build produksi (charger terpasang, CPU 5–27%): `s8-qa.mjs` 1320/1320 (12 slug × ID/EN × 5 viewport), `rt1-qa.mjs` 41/41, `etalase-qa.mjs` 114/114, cerita `og5` 106/106, `bj1` 106/106, `rk1` 106/106, `ck1` 114/114, `fp1` 107/107 (error console hanya GSAP yang sengaja diblokir dan 404 analytics lokal); `logic.test.mjs` 19/19; typecheck, ESLint, Prettier. Ikon Telegram di detail `asisten-sop` dicek visual (screenshot hanya di chat).
- Belum: review user, rencana tahap Tonton N2 (`catat-pengeluaran`). Tidak ada commit/push.

## 12. Verifikasi seluruh S8 pada build N13 (28 Nov 2026)

- Dua belas halaman S8 menyediakan Baca dan Tonton ID/EN di build yang sama. Enam belas cerita sebelumnya tetap dapat dibuka dalam kedua bahasa. QA N13 lulus 134/134 tanpa error halaman, regresi cerita sebelumnya 128/128, QA 12 detail S8 1.320/1.320, dan etalase 114/114.
- Build produksi, TypeScript, ESLint, format berkas yang berubah di N13, dan tes logika 31/31 lulus. Tes HP fisik masih terbuka.
- Review user yang masih terbuka adalah N6 dan N13. [Preview N6](http://localhost:3324/solusi/onboarding-klien#story-title) · [Preview N13](http://localhost:3324/solusi/rekap-penjualan#story-title)
