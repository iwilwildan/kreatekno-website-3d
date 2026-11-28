# Detail Solusi: Klien baru langsung disambut setelah deal

Per 27 Nov 2026, **Tonton N6 selesai secara teknis dan lulus QA browser 126/126**. Review hasil oleh user dan tes HP fisik masih terbuka.

Induk: [PLAN-KATALOG-N8N](PLAN-KATALOG-N8N.md) bagian 4.5 (sumber, rel draf, temuan, keputusan). Kontrak template, route, mesin dan QA: [PLAN-DETAIL](PLAN-DETAIL.md). Dokumen ini hanya mencatat status dan keputusan khusus `onboarding-klien`.

## 1. Identitas

| Item | Nilai |
|---|---|
| Slug | `onboarding-klien` |
| Status layanan | Siap dibuat (`ide`); bukan pekerjaan klien |
| Route | `/solusi/onboarding-klien` dan `/en/solutions/onboarding-klien` |
| Industri | Jasa, Properti |
| Tim | Penjualan, Operasional |
| Aplikasi | Google Sheets, Gmail, Google Calendar |
| Sumber | Template publik n8n.io [3958](https://n8n.io/workflows/3958), [4448](https://n8n.io/workflows/4448) |
| Data | `site/content/solusi/items/onboarding-klien.ts`, EN katalog di `catalog.ts` |
| Kode Tonton | `ok` (prefix CSS `ok-*`, QA `tools/solusi/ok1-qa.mjs`) |

## 2. Tahapan

| Tahap | Isi | Status |
|---|---|---|
| N0 | Slug, copy katalog ID (pertanyaan, jawaban, masalah, langkah, perbandingan, kecocokan, persiapan, FAQ), ringkasan EN, kartu masalah, kotak etalase | Disetujui 23 Nov |
| N1a | Copy Baca ID/EN lengkap dengan klien, kutipan, dan angka contoh | Disetujui 24 Nov |
| N6 | Storyboard → review → cerita Tonton → QA → review | Implementasi dan QA selesai 27 Nov. Review hasil masih terbuka. |

## 3. Log

- 23 Nov 2026 (N0): item dan subplan dibuat. Copy katalog ditulis dari alur template, tanpa menyalin teks atau prompt template.
- 23 Nov 2026 (N1a): copy ID/EN lengkap dengan klien set A; rincian di PLAN-KATALOG-N8N bagian 10.
- 27 Nov 2026 (N6): user meminta lanjut dari hasil N5. Riset dan draf storyboard dicatat di bagian 4.
- 27 Nov 2026 (N6): user menyetujui storyboard dan copy Baca, lalu meminta implementasi. Tonton ID/EN selesai dan lulus QA browser.

## 4. N6: cerita Tonton Onboarding Klien

### 4.1 Riset 27 Nov 2026

- Template 3958 memperlihatkan personalisasi sambutan, penjadwalan rapat, dan penetapan penanggung jawab. Template 4448 menunjukkan cara memakai baris baru dari formulir dan checklist untuk menyusun sambutan. N6 memakai tabel deal dan checklist per paket yang sudah disepakati di Baca. Staf mengecek draf sebelum mengirim email dan undangan. Dokumentasi Gmail memisahkan tindakan menyimpan, memperbarui, dan mengirim draf. [Template 3958](https://n8n.io/workflows/3958-automate-new-customer-onboarding-with-hubspot-google-calendar-and-ai-powered-gmail/) · [Template 4448](https://n8n.io/workflows/4448-ai-client-onboarding-agent-auto-welcome-email-generator/) · [Dokumentasi draf](https://developers.google.com/workspace/gmail/api/guides/drafts)
- Pengecekan kalender hanya menunjukkan ketersediaan kalender yang diperiksa saat itu. N6 menampilkan slot kosong tim sebagai usulan, lalu staf mengecek ulang sebelum mengirim. Undangan yang terkirim dicatat sebagai **Menunggu respons klien**. Waktu rapat tetap dapat diubah melalui staf, sesuai FAQ Baca. [Dokumentasi cek kalender](https://developers.google.com/workspace/calendar/api/v3/reference/freebusy/query) · [Dokumentasi undangan kalender](https://developers.google.com/workspace/calendar/api/v3/reference/events/insert)
- Kolom `result` di ID/EN saat ini bisa terbaca seolah rapat berlangsung pada hari deal. Untuk menyelaraskan Baca dan Tonton, usulan copy hasil adalah “Sambutan, checklist, dan undangan di hari yang sama” / “Welcome, checklist, and kickoff invite sent the same day”. Contoh N6 mengirim undangan Jumat untuk rapat hari Senin.

### 4.2 Contoh yang diusulkan

- **Rani, Toko Contoh**, memilih paket **Kelola Iklan** dari agensi pemasaran digital contoh. Pada **Jumat, 27 Nov 2026**, staf menandai **OB-024** sebagai Deal selesai. **Nadia** menjadi penanggung jawab klien.
- Checklist paket berisi tiga persiapan, yaitu **akses akun iklan lewat undangan**, **file logo**, dan **materi produk**. Draf menyapa Rani, menyebut paket, dan menampilkan ketiga persiapan itu.
- Kalender tim pada **Senin, 30 Nov 2026** menampilkan slot **09.00–09.30** terisi, **10.00–10.30 WITA** kosong, dan **11.00–11.30** terisi. Slot 10.00 dimasukkan sebagai usulan. Nadia membaca draf, mengecek ulang slot, lalu mengirim email sambutan dan undangan pada hari deal. Catatan OB-024 menunjukkan Nadia sebagai penanggung jawab dan **Menunggu respons klien**.

### 4.3 Rel dan adegan

Rel enam node mengikuti urutan Deal tercatat → Checklist disiapkan → Draf email → Slot diusulkan → Staf cek dan kirim → Penanggung jawab tercatat.

| # | Adegan | Caption draf | Panggung |
|---|---|---|---|
| 1 | Sebelum | Kontrak sudah selesai, tapi klien masih menunggu langkah berikutnya. | Baris deal dan gelembung “Setelah ini saya perlu siapkan apa?” terlihat di antara permintaan logo dan chat mencari jadwal. |
| 2 | Deal tercatat | Paket Rani tercatat saat deal ditandai selesai. | OB-024 terangkat dari tabel berisi Toko Contoh, paket Kelola Iklan, dan label Deal selesai. |
| 3 | Checklist disiapkan | Paket Kelola Iklan membuka daftar persiapan yang sesuai. | Kartu paket membuka tiga baris untuk akses akun iklan lewat undangan, file logo, dan materi produk. |
| 4 | Draf email | AI menyiapkan sambutan untuk Rani. | Nama, paket, dan checklist masuk ke email berlabel Draf. Baris jadwal masih menunggu usulan. |
| 5 | Slot diusulkan | Tim punya slot kosong Senin pukul 10.00 WITA. | Tiga slot diperiksa. Slot 10.00–10.30 berpindah ke draf dengan label Usulan jadwal. |
| 6 | Staf cek dan kirim | Nadia mengecek draf dan jadwal sebelum mengirim. | Draf dan usulan tampil berdampingan dengan pemeriksaan ulang slot. Aksi Nadia mengubah dua status menjadi Email terkirim dan Undangan terkirim. |
| 7 | Penanggung jawab tercatat | Tabel mencatat Nadia dan menunggu respons Rani. | OB-024 kembali ke tabel dengan Nadia, slot yang diundang, dan status Menunggu respons klien. |
| 8 | Ringkasan | Klien menerima sambutan, daftar persiapan, dan undangan. | Tiga angka contoh dari Baca menunjukkan satu draf, satu checklist, dan satu undangan. |
| 9 | Konsultasi | Mau klien baru langsung tahu langkah berikutnya? | Panggung mereda dan tombol “Konsultasi gratis” muncul. |

Panggung pastel siang mengikuti satu kartu deal dari tabel ke checklist, draf, dan kalender. Draf, usulan slot, pengiriman, dan respons klien memakai label berbeda. Caption dan isi panggung disiapkan dalam ID/EN.

### 4.4 Integrasi dan QA setelah review storyboard

- Daftarkan data cerita ID/EN di `site/content/solusi/cerita/`. Gunakan enam node dan sembilan adegan, `PanggungOnboarding.tsx`, `ceritaFilmOnboarding.ts`, serta gaya `ok-*`. Ikuti pola N5 untuk lazy load, reduced motion, dan pose CSS saat GSAP gagal dimuat.
- Validasi nomor deal, paket, checklist, dan konsistensi tanggal serta slot pada draf, undangan, dan tabel. `ok1-qa.mjs` mencakup lima viewport, maju/mundur, rel, EN, CTA, reduced motion, dan pemblokiran GSAP. Uji bahwa draf dan slot terlihat sebelum tindakan staf dan status terkirim baru muncul sesudahnya.
- Cek copy `result` ID/EN di detail dan etalase, build, TypeScript, lint, format berkas yang berubah, tes logika, regresi cerita dan etalase, serta visual desktop dan HP.

### 4.5 Hasil implementasi (27 Nov 2026)

- Tonton ID/EN mengikuti OB-024 dalam sembilan adegan dengan enam node. Checklist Kelola Iklan masuk ke draf sambutan Rani. Nadia mengecek ulang slot 10.00–10.30 WITA, lalu mengirim sambutan dan undangan pada Jumat. Catatan menampilkan rapat Senin serta status Menunggu respons klien.
- Skema memeriksa urutan slot, satu slot kosong, tanggal rapat setelah hari pengiriman, dan kesamaan deal ID/EN. Panggung mengambil usulan dari slot yang sama di kalender, draf, dan tabel. Film GSAP dimuat saat perlu. Reduced motion dan kegagalan pemuatan film memakai pose CSS.
- Copy hasil ID/EN di detail dan etalase menyebut undangan pada hari deal. Build produksi, TypeScript, ESLint, format berkas yang berubah, dan tes logika 24/24 lulus. QA N6 lulus 126/126 tanpa error halaman pada lima viewport, termasuk urutan pemeriksaan draf dan pengiriman, copy detail dan etalase, EN, keyboard, CTA, reduced motion, dan GSAP diblokir. Regresi sembilan cerita sebelumnya lulus 72/72 dan etalase 114/114. Cek visual dilakukan di desktop dan viewport HP. Tes HP fisik belum tercatat.
