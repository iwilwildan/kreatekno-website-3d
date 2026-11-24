# Detail Solusi: Cuti dan pertanyaan karyawan terjawab lewat chat

Tanggal: 23 Nov 2026. Status: **N0 disetujui; N1a (copy Baca ID/EN lengkap) selesai teknis, menunggu review, cerita Tonton di N5**.

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
| N1a | Copy ID/EN lengkap seperti FP1: `painsLead`, `built`, kutipan contoh, angka contoh, klien "(contoh)", `en` | Selesai teknis 23 Nov, menunggu review |
| N5 | Storyboard → review → cerita Tonton → QA → review | Belum |

## 3. Log

- 23 Nov 2026 (N0): item dan subplan dibuat. Copy katalog ditulis dari alur template, tanpa menyalin teks atau prompt template.
- 23 Nov 2026 (N1a): copy ID/EN lengkap dengan klien set A; rincian di PLAN-KATALOG-N8N bagian 10.
