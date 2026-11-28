# Detail Solusi: Cuti dan pertanyaan karyawan terjawab lewat chat

Per 27 Nov 2026, **Tonton N5 lulus QA browser 121/121 dan review user dicatat selesai**. Tes HP fisik belum tercatat.

Induk: [PLAN-KATALOG-N8N](PLAN-KATALOG-N8N.md) bagian 4.4 (sumber, rel draf, temuan, keputusan). Kontrak template, route, mesin dan QA: [PLAN-DETAIL](PLAN-DETAIL.md). Dokumen ini hanya mencatat status dan keputusan khusus `layanan-sdm`.

## 1. Identitas

| Item | Nilai |
|---|---|
| Slug | `layanan-sdm` |
| Status layanan | Siap dibuat (`ide`); bukan pekerjaan klien |
| Route | `/solusi/layanan-sdm` dan `/en/solutions/layanan-sdm` |
| Industri | Retail & F&B, Jasa, Logistik |
| Tim | SDM, Manajemen |
| Aplikasi | WhatsApp, Google Sheets, Google Drive |
| Sumber | Template publik n8n.io [4975](https://n8n.io/workflows/4975) (cabang cuti dan kebijakan saja) |
| Data | `site/content/solusi/items/layanan-sdm.ts`, EN katalog di `catalog.ts` |
| Kode Tonton | `sd` (prefix CSS `sd-*`, QA `tools/solusi/sd1-qa.mjs`) |

## 2. Tahapan

| Tahap | Isi | Status |
|---|---|---|
| N0 | Slug, copy katalog ID (pertanyaan, jawaban, masalah, langkah, perbandingan, kecocokan, persiapan, FAQ), ringkasan EN, kartu masalah, kotak etalase | Disetujui 23 Nov |
| N1a | Copy Baca ID/EN lengkap dengan klien, kutipan, dan angka contoh | Disetujui 24 Nov |
| N5 | Storyboard → review → cerita Tonton → QA → review | Implementasi, QA, dan review user selesai 27 Nov. |

## 3. Log

- 23 Nov 2026 (N0): item dan subplan dibuat. Copy katalog ditulis dari alur template, tanpa menyalin teks atau prompt template.
- 23 Nov 2026 (N1a): copy ID/EN lengkap dengan klien set A; rincian di PLAN-KATALOG-N8N bagian 10.
- 27 Nov 2026 (N5): user meminta lanjut saat preview N4 terbuka. Riset dan storyboard dicatat di bagian 4.
- 27 Nov 2026 (N5): user menyetujui storyboard dan meminta implementasi. Tonton ID/EN selesai dan lulus QA browser.
- 27 Nov 2026 (N5): setelah hasil dan preview disampaikan, user meminta lanjut. Review N5 dicatat selesai dan N6 dimulai.

## 4. N5: cerita Tonton Layanan SDM

### 4.1 Riset 27 Nov 2026

- Template 4975 mengenali isi pesan dan meneruskan pengajuan cuti serta pertanyaan kebijakan ke alur masing-masing. Storyboard merangkum rute yang disetujui menjadi tiga jenis, yaitu cuti, tanya aturan, dan urusan lain ke SDM. Jawaban aturan menyebut bagian dokumen perusahaan. Pertanyaan yang belum tercakup diteruskan ke staf SDM. [Template 4975](https://n8n.io/workflows/4975-automated-hr-service-system-with-whatsapp-gpt-4-classification-and-google-workspace/)
- Template 12070 memperlihatkan pemisahan ringkasan pengajuan, keputusan atasan, dan kabar ke karyawan. Dokumentasi pengelolaan cuti Oracle juga memisahkan perhitungan sisa cuti dan tindakan menyetujui atau menolak. Cerita memakai aturan yang sudah disepakati untuk Solusi ini. Atasan memutuskan semua pengajuan, termasuk satu hari. Tabel menyimpan perubahan saldo satu kali setelah disetujui. Pengajuan yang ditolak tercatat dengan saldo yang sama. [Template 12070](https://n8n.io/workflows/12070-automate-employee-leave-approvals-with-gpt-gmail-and-calendar-integration/) · [Dokumentasi pengajuan cuti](https://docs.oracle.com/cd/G33000_01/hcm92pbr52/eng/hcm/habs/UnderstandingTheAbsenceRequestTransactions.html)
- Contoh memperlihatkan keputusan dan kabar di hari yang sama. Dalam penerapan WhatsApp Business, pesan keluar di luar 24 jam sejak pesan terakhir penerima memerlukan template yang sudah disetujui. Panggung memakai label saluran yang generik. [Kebijakan berkirim pesan WhatsApp Business](https://business.whatsapp.com/policy/preview?lang=id_ID)

### 4.2 Contoh yang diusulkan

- **Dina, Cabang Melati**, bekerja di jaringan minimarket contoh dengan 40 karyawan. Dari chat “Layanan SDM”, Dina meminta **cuti satu hari pada Kamis, 3 Des 2026**. Nomor pengajuan contoh **CT-017**. Saldo cuti awal **5 hari**, permintaan **1 hari**, dan saldo setelah disetujui **4 hari**.
- Ringkasan untuk **Kepala Toko Melati** menampilkan nama, tanggal, durasi, dan sisa cuti. Kepala toko memilih Setujui. Baris CT-017 berubah dari Menunggu keputusan menjadi Disetujui, lalu Dina menerima status dan saldo cutinya sendiri lewat chat.
- Pada cabang kebijakan, Dina ikut bertanya “Kalau mau tukar shift, harus lapor siapa?” Sistem menjawab “Minta persetujuan kepala toko sebelum jadwal shift diubah” dan menunjukkan sumber **Kebijakan Kerja · Bagian 3.2 Tukar shift**. Ketika Dina bertanya soal pengganti dari cabang lain, panel menampilkan “Diteruskan ke SDM” karena dokumen contoh belum membahasnya. Percakapan dan aturan perusahaan ini ilustrasi.

### 4.3 Rel dan adegan

Rel enam node mengikuti urutan Pesan masuk → Pesan diarahkan → Sisa cuti dicek → Ringkasan ke atasan → Atasan memutuskan → Tercatat dan dikabari.

| # | Adegan | Caption draf | Panggung |
|---|---|---|---|
| 1 | Sebelum | Permintaan cuti dan pertanyaan shift tersebar di chat. | Tiga gelembung pesan dari beberapa cabang menumpuk di sekitar jadwal shift. Pengajuan Dina sempat turun dari daftar teratas. |
| 2 | Pesan masuk | Dina mengajukan cuti satu hari lewat chat SDM. | Pesan “Mau ajukan cuti Kamis, 3 Des” masuk ke chat Layanan SDM. Kartu CT-017 muncul dengan tanggal dan durasi. |
| 3 | Pesan diarahkan | Pengajuan cuti dan pertanyaan aturan masuk jalur masing-masing. | Tiga chip Cuti, Tanya aturan, dan Ke SDM. Pengajuan Dina bergerak ke jalur cuti. Sekilas, pertanyaan tukar shift membuka jawaban bersumber Bagian 3.2 dan pertanyaan lintas cabang diteruskan ke SDM. |
| 4 | Sisa cuti dicek | Sistem menemukan sisa cuti Dina lima hari. | Tabel membuka baris Dina saja. Kartu “Sisa cuti 5 hari” berada di samping “Diminta 1 hari” dan status Menunggu keputusan. |
| 5 | Ringkasan ke atasan | Kepala toko menerima ringkasan pengajuan Dina. | Nama, cabang, tanggal, durasi, dan saldo pindah ke kartu CT-017 untuk Kepala Toko Melati. Tombol Setujui dan Tolak terlihat. |
| 6 | Atasan memutuskan | Kepala toko menyetujui cuti Dina. | Tombol Setujui disorot dan stempel Disetujui muncul. Peralihan ke pencatatan dimulai setelah keputusan itu. |
| 7 | Tercatat dan dikabari | Saldo Dina menjadi empat hari dan ia menerima kabar. | Satu baris CT-017 tercatat. Saldo bergerak dari 5 ke 4, lalu chat Dina menampilkan persetujuan beserta sisa cutinya. |
| 8 | Ringkasan | Pengajuan cuti dan tanya aturan masuk dari satu nomor. | Angka contoh dari Baca merangkum satu nomor, tiga jenis pesan, dan satu tindakan atasan untuk mencatat keputusan. |
| 9 | Konsultasi | Mau permintaan cuti dan tanya aturan lebih mudah diurus? | Panggung mereda dan tombol “Konsultasi gratis” muncul. |

Panggung pastel siang mengikuti satu kartu cuti dari chat ke atasan dan kembali ke Dina. Cabang kebijakan muncul singkat di adegan ketiga. Caption, label, dan percakapan disiapkan dalam ID/EN.

### 4.4 Integrasi dan QA setelah review storyboard

- Daftarkan cerita ID/EN di `site/content/solusi/cerita/`. Gunakan enam node dan sembilan adegan, `PanggungSdm.tsx`, `ceritaFilmSdm.ts`, serta gaya `sd-*`. Ikuti pola N4 untuk lazy load, reduced motion, dan pose CSS saat GSAP gagal dimuat.
- Validasi nomor pengajuan, tanggal, durasi, dan saldo 5 → 4, serta cek bahwa saldo tetap 5 sampai keputusan atasan tercatat. Verifikasi sumber pada jawaban kebijakan dan label eskalasi saat sumbernya kosong. `sd1-qa.mjs` mencakup lima viewport, maju/mundur, rel, EN, CTA, reduced motion, dan pemblokiran GSAP.
- Jalankan build, TypeScript, lint, format berkas yang berubah, tes logika, regresi cerita sebelumnya dan etalase, serta cek visual desktop dan HP.

### 4.5 Hasil implementasi (27 Nov 2026)

- Tonton ID/EN mengikuti CT-017 dalam sembilan adegan dengan enam node. Ringkasan atasan masih menunjukkan saldo lima hari. Catatan dan pesan konfirmasi baru menunjukkan empat hari setelah Kepala Toko Melati memilih Setujui. Cabang tanya aturan menampilkan Bagian 3.2 dan mengarahkan pertanyaan lintas cabang yang belum dijawab ke SDM.
- Skema memeriksa kesamaan nomor, nama, tanggal, dan saldo antarbahasa, serta pengurangan saldo sebesar durasi yang diajukan. `PanggungSdm` memakai data pengajuan yang sama di chat, ringkasan, dan tabel. Film GSAP dimuat saat perlu. Reduced motion dan kegagalan pemuatan film memakai pose CSS.
- Build produksi, TypeScript, ESLint, format berkas yang berubah, dan tes logika 23/23 lulus. `sd1-qa.mjs` lulus 121/121 tanpa error halaman pada lima viewport, termasuk EN, rel dan keyboard, perubahan saldo, sumber aturan, pengalihan ke SDM, CTA, reduced motion, dan GSAP diblokir. Regresi delapan cerita sebelumnya lulus 64/64 dan etalase 114/114. Review visual dilakukan di desktop dan viewport HP. Tes HP fisik belum tercatat.
