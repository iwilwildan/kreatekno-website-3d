# Detail Solusi: Klien baru langsung disambut setelah deal

Tanggal: 23 Nov 2026. Status: **N0 disetujui; N1a (copy Baca ID/EN lengkap) selesai teknis, menunggu review, cerita Tonton di N6**.

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
| N1a | Copy ID/EN lengkap seperti FP1: `painsLead`, `built`, kutipan contoh, angka contoh, klien "(contoh)", `en` | Selesai teknis 23 Nov, menunggu review |
| N6 | Storyboard → review → cerita Tonton → QA → review | Belum |

## 3. Log

- 23 Nov 2026 (N0): item dan subplan dibuat. Copy katalog ditulis dari alur template, tanpa menyalin teks atau prompt template.
- 23 Nov 2026 (N1a): copy ID/EN lengkap dengan klien set A; rincian di PLAN-KATALOG-N8N bagian 10.
