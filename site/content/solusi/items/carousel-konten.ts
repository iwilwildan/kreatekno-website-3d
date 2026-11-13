// Source: Solusi v1 COPY 19; client metrics remain examples.
import type { Solusi } from "../schema";

export const carouselKonten: Solusi = {
  slug: "carousel-konten",
  status: "ide",
  updated: "2026-10-30",
  industri: ["retail", "klinik"],
  tim: ["marketing"],
  apps: ["instagram", "drive"],
  id: {
    title: "Carousel Instagram dari satu topik",
    question: "Bagaimana membuat carousel Instagram lebih cepat tanpa desainer?",
    result: "Draf carousel siap disetujui dalam hitungan menit",
    summary: "Anda cukup mengirim satu topik. Isi slide ditulis sesuai gaya brand Anda, lalu dikirim untuk disetujui.",
    answer:
      "Anda cukup mengirim satu topik. Isi slide ditulis dengan gaya bahasa brand Anda, diisi ke template desain milik Anda, lalu dikirim sebagai pratinjau untuk disetujui. Yang disetujui disimpan ke Google Drive dan siap diposting.",
    pains: ["Satu carousel bisa makan waktu setengah hari.", "Posting jadi tidak rutin karena prosesnya panjang."],
    steps: [
      {
        title: "Anda mengirim topik",
        body: "Satu kalimat sudah cukup.",
      },
      {
        title: "Isi slide ditulis",
        body: "Mengikuti gaya bahasa brand Anda.",
      },
      {
        title: "Slide dibuat dari template",
        body: "Memakai warna dan font brand Anda.",
      },
      {
        title: "Anda menyetujui",
        body: "Carousel yang disetujui siap diposting.",
      },
    ],
    compare: [
      {
        aspect: "Membuat carousel",
        before: "Setengah hari",
        after: "Draf dalam hitungan menit",
      },
      {
        aspect: "Konsistensi desain",
        before: "Tergantung siapa yang membuat",
        after: "Selalu memakai template brand",
      },
    ],
    fit: ["Usaha yang rutin membuat konten edukasi atau promosi."],
    notFit: ["Konten yang selalu membutuhkan foto produk baru."],
    prep: ["Template desain brand", "Contoh konten yang pernah disukai audiens"],
    faq: [
      {
        q: "Apakah langsung terposting?",
        a: "Tidak. Setiap carousel menunggu persetujuan Anda.",
      },
    ],
  },
};
