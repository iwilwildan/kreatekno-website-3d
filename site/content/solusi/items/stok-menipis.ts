// Source: Solusi v1 COPY 19; client metrics remain examples.
import type { Solusi } from "../schema";

export const stokMenipis: Solusi = {
  slug: "stok-menipis",
  status: "ide",
  updated: "2026-10-30",
  industri: ["retail", "logistik"],
  tim: ["operasional", "manajemen"],
  apps: ["sheets", "whatsapp"],
  id: {
    title: "Peringatan stok menipis sebelum habis",
    question: "Bagaimana tahu stok akan habis sebelum terlambat memesan ulang?",
    result: "Pesan ulang tepat waktu, stok tidak kosong",
    summary: "Stok gudang dipantau setiap hari, dan tim pembelian menerima peringatan WhatsApp sebelum barang habis.",
    answer:
      "Stok di tabel gudang dipantau setiap hari. Saat sebuah barang mendekati batas minimum, tim pembelian menerima pesan WhatsApp berisi barang, sisa stok, dan perkiraan kapan habis, sehingga pemesanan ulang bisa dilakukan sebelum stok kosong.",
    pains: ["Stok baru ketahuan habis saat pelanggan memesan.", "Cek stok gudang dilakukan manual dan tidak rutin."],
    steps: [
      {
        title: "Stok tercatat",
        body: "Di tabel gudang yang sudah dipakai.",
      },
      {
        title: "Stok dipantau",
        body: "Setiap hari, tanpa dicek manual.",
      },
      {
        title: "Peringatan dikirim",
        body: "Tim menerima pesan saat stok mendekati batas.",
      },
      {
        title: "Tim memesan ulang",
        body: "Sebelum barang benar-benar habis.",
      },
    ],
    compare: [
      {
        aspect: "Mengetahui stok menipis",
        before: "Saat sudah habis",
        after: "Sebelum habis",
      },
      {
        aspect: "Cek gudang",
        before: "Manual, tidak rutin",
        after: "Dipantau setiap hari",
      },
    ],
    fit: ["Toko dan gudang dengan banyak jenis barang."],
    notFit: ["Usaha dengan stok yang sangat sedikit jenisnya."],
    prep: ["Tabel stok yang sudah dipakai", "Batas minimum per barang"],
    faq: [
      {
        q: "Kalau stok dicatat di aplikasi kasir?",
        a: "Data bisa diambil dari ekspor aplikasi kasir Anda.",
      },
    ],
  },
};
