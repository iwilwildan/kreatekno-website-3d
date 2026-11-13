// Source: Solusi v1 COPY 19; client metrics remain examples.
import type { Solusi } from "../schema";

export const rekapPenjualan: Solusi = {
  slug: "rekap-penjualan",
  status: "ide",
  updated: "2026-10-30",
  industri: ["retail", "logistik"],
  tim: ["manajemen", "keuangan"],
  apps: ["sheets", "whatsapp"],
  id: {
    title: "Rekap penjualan harian tanpa hitung manual",
    question: "Bagaimana pemilik usaha menerima rekap penjualan setiap hari tanpa menghitung sendiri?",
    result: "Angka penjualan sampai di HP pemilik setiap malam",
    summary:
      "Setiap malam pemilik menerima rekap penjualan di WhatsApp: total, produk terlaris, dan perbandingan dengan hari sebelumnya.",
    answer:
      "Data penjualan dari tabel yang sudah dipakai tim dirangkum setiap malam menjadi satu pesan WhatsApp untuk pemilik: total penjualan, produk terlaris, dan perbandingan dengan hari sebelumnya. Pemilik tidak perlu membuka laptop atau menunggu laporan admin.",
    pains: [
      "Pemilik baru tahu angka penjualan setelah admin selesai menghitung.",
      "Laporan mingguan sering terlambat atau tidak dibuat.",
    ],
    steps: [
      {
        title: "Penjualan tercatat seperti biasa",
        body: "Tim tetap memakai tabel atau catatan yang sudah ada.",
      },
      {
        title: "Angka dirangkum",
        body: "Total, produk terlaris, dan perbandingan harian disusun.",
      },
      {
        title: "Rekap dikirim",
        body: "Pemilik menerima satu pesan setiap malam.",
      },
      {
        title: "Pemilik memutuskan",
        body: "Keputusan stok dan promosi diambil dari angka hari itu.",
      },
    ],
    compare: [
      {
        aspect: "Melihat angka harian",
        before: "Menunggu admin",
        after: "Langsung di HP",
      },
      {
        aspect: "Laporan mingguan",
        before: "Sering terlambat",
        after: "Terbentuk dari rekap harian",
      },
    ],
    fit: ["Pemilik toko atau distributor yang ingin memantau penjualan dari HP."],
    notFit: ["Usaha yang belum mencatat penjualan sama sekali."],
    prep: ["Tabel penjualan yang sudah dipakai tim", "Angka apa saja yang ingin dilihat pemilik"],
    faq: [
      {
        q: "Kalau data penjualan masih di buku tulis?",
        a: "Kami bantu pindahkan ke tabel sederhana lebih dulu.",
      },
    ],
  },
};
