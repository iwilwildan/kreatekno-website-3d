// Source: Solusi v1 COPY 19; client metrics remain examples.
import type { Solusi } from "../schema";

export const pengingatTagihan: Solusi = {
  slug: "pengingat-tagihan",
  status: "ide",
  updated: "2026-10-30",
  industri: ["jasa", "properti", "logistik"],
  tim: ["keuangan"],
  apps: ["whatsapp", "sheets", "gmail"],
  id: {
    title: "Tagihan jatuh tempo diingatkan otomatis",
    question: "Bagaimana mengingatkan pelanggan soal tagihan tanpa terasa sungkan?",
    result: "Pembayaran lebih tepat waktu tanpa menagih manual",
    summary:
      "Pengingat tagihan terkirim sopan lewat WhatsApp atau email sebelum jatuh tempo, dan status pembayaran diperbarui di Google Sheets.",
    answer:
      "Pengingat tagihan dikirim ke pelanggan lewat WhatsApp atau email sebelum dan saat jatuh tempo, dengan bahasa yang sopan dan sesuai gaya usaha Anda. Status pembayaran diperbarui di Google Sheets, sehingga tim keuangan tahu siapa yang perlu dihubungi langsung.",
    pains: [
      "Tim keuangan menagih satu per satu dan sering merasa sungkan.",
      "Tagihan terlupa karena jadwal jatuh tempo berbeda-beda.",
    ],
    steps: [
      {
        title: "Tagihan tercatat",
        body: "Daftar tagihan dan jatuh tempo ada di Google Sheets.",
      },
      {
        title: "Pengingat dikirim",
        body: "Pelanggan menerima pengingat yang sopan sebelum jatuh tempo.",
      },
      {
        title: "Status diperbarui",
        body: "Tagihan yang sudah dibayar ditandai lunas.",
      },
      {
        title: "Tim menindaklanjuti yang tersisa",
        body: "Tim keuangan hanya menghubungi pelanggan yang belum membayar.",
      },
    ],
    compare: [
      {
        aspect: "Mengingatkan",
        before: "Menagih satu per satu",
        after: "Terkirim sesuai jadwal",
      },
      {
        aspect: "Status pembayaran",
        before: "Dicek manual",
        after: "Terlihat di tabel",
      },
      {
        aspect: "Beban tim",
        before: "Semua pelanggan",
        after: "Hanya yang belum membayar",
      },
    ],
    fit: ["Usaha dengan tagihan rutin bulanan atau termin."],
    notFit: ["Usaha yang semua pembayarannya tunai di tempat."],
    prep: ["Daftar pelanggan dan jadwal tagihan", "Contoh kalimat pengingat yang biasa dipakai"],
    faq: [
      {
        q: "Apakah pelanggan merasa ditagih mesin?",
        a: "Kalimat pengingat mengikuti gaya bahasa usaha Anda dan bisa Anda ubah kapan saja.",
      },
    ],
  },
};
