# Detail Solusi: Faktur pemasok tercatat dan dicek sebelum dibayar

Tanggal: 23 Nov 2026. Status: **N0 disetujui; N1a (copy Baca ID/EN lengkap) selesai teknis, menunggu review, cerita Tonton di N4**.

Induk: [PLAN-KATALOG-N8N](PLAN-KATALOG-N8N.md) bagian 4.3 (sumber, rel draf, temuan, keputusan). Kontrak template, route, mesin dan QA: [PLAN-DETAIL](PLAN-DETAIL.md). Dokumen ini hanya mencatat status dan keputusan khusus `faktur-pemasok`.

## 1. Identitas

| Item | Nilai |
|---|---|
| Slug | `faktur-pemasok` |
| Status layanan | Siap dibuat (`ide`); bukan pekerjaan klien |
| Route | `/solusi/faktur-pemasok` dan `/en/solutions/faktur-pemasok` |
| Industri | Retail & F&B, Logistik |
| Tim | Keuangan & admin, Operasional |
| Aplikasi | Gmail, Google Drive, Google Sheets, WhatsApp |
| Sumber | Template publik n8n.io [4247](https://n8n.io/workflows/4247), [4452](https://n8n.io/workflows/4452), [4376](https://n8n.io/workflows/4376), [4868](https://n8n.io/workflows/4868) |
| Data | `site/content/solusi/items/faktur-pemasok.ts`, EN katalog di `catalog.ts` |
| Kode Tonton | `fk` (prefix CSS `fk-*`, QA `tools/solusi/fk1-qa.mjs`) |

## 2. Tahapan

| Tahap | Isi | Status |
|---|---|---|
| N0 | Slug, copy katalog ID (pertanyaan, jawaban, masalah, langkah, perbandingan, kecocokan, persiapan, FAQ), ringkasan EN, kartu masalah, kotak etalase | Disetujui 23 Nov |
| N1a | Copy ID/EN lengkap seperti FP1: `painsLead`, `built`, kutipan contoh, angka contoh, klien "(contoh)", `en` | Selesai teknis 23 Nov, menunggu review |
| N4 | Storyboard → review → cerita Tonton → QA → review | Belum |

## 3. Log

- 23 Nov 2026 (N0): item dan subplan dibuat. Copy katalog ditulis dari alur template, tanpa menyalin teks atau prompt template.
- 23 Nov 2026 (N1a): copy ID/EN lengkap dengan klien set A; rincian di PLAN-KATALOG-N8N bagian 10.
