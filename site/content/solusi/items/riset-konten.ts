// Source: Solusi v1 COPY 19; client metrics remain examples.
import type { Solusi } from "../schema";

export const risetKonten: Solusi = {
  slug: "riset-konten",
  status: "jalan",
  updated: "2026-10-24",
  industri: ["retail", "jasa", "klinik"],
  tim: ["marketing"],
  apps: ["instagram", "sheets"],
  metricsKind: "example",
  id: {
    title: "Ide konten mingguan dari tren media sosial",
    question: "Bagaimana menemukan ide konten media sosial setiap minggu tanpa riset manual?",
    result: "Daftar ide konten siap pakai setiap minggu",
    summary:
      "Setiap minggu, tren media sosial di bidang Anda disusun menjadi daftar ide konten siap pakai untuk tim marketing.",
    answer:
      "Setiap minggu, tren dan pertanyaan yang ramai di media sosial dikumpulkan sesuai topik usaha Anda, lalu disusun menjadi daftar ide konten di Google Sheets lengkap dengan sudut pandang dan contoh judul. Tim marketing tinggal memilih dan menulis.",
    client: "Brand edukasi bisnis, Jakarta",
    pains: [
      "Tim marketing menghabiskan berjam-jam mencari ide sebelum mulai menulis.",
      "Konten dibuat berdasarkan tebakan, bukan yang sedang dibicarakan audiens.",
    ],
    steps: [
      {
        title: "Topik usaha ditentukan",
        body: "Anda memilih topik dan akun yang ingin dipantau.",
      },
      {
        title: "Tren dikumpulkan",
        body: "Pembahasan yang sedang ramai dirangkum setiap minggu.",
      },
      {
        title: "Ide konten disusun",
        body: "Setiap ide punya sudut pandang dan contoh judul.",
      },
      {
        title: "Tim memilih",
        body: "Ide yang dipilih masuk ke kalender konten.",
      },
    ],
    compare: [
      {
        aspect: "Mencari ide",
        before: "Berjam-jam setiap minggu",
        after: "Daftar siap setiap Senin",
      },
      {
        aspect: "Dasar ide",
        before: "Tebakan",
        after: "Pembahasan yang sedang ramai",
      },
      {
        aspect: "Kalender konten",
        before: "Sering kosong",
        after: "Terisi dari daftar ide",
      },
    ],
    fit: ["Usaha yang ingin posting rutin tapi kehabisan ide.", "Tim marketing kecil tanpa waktu riset."],
    notFit: ["Brand yang kontennya sepenuhnya mengikuti kampanye dari kantor pusat."],
    prep: ["Topik dan audiens utama usaha", "Akun pesaing atau referensi yang ingin dipantau"],
    metrics: [
      {
        value: "20",
        unit: "ide",
        label: "konten baru setiap minggu",
      },
      {
        value: "4",
        unit: "jam",
        label: "riset mingguan yang tidak perlu lagi",
      },
      {
        value: "1",
        unit: "tabel",
        label: "kalender konten untuk seluruh tim",
      },
    ],
    faq: [
      {
        q: "Apakah kontennya ditulis otomatis?",
        a: "Tidak. Yang disiapkan adalah ide dan sudut pandangnya; tim Anda yang menulis dengan gaya brand.",
      },
      {
        q: "Bisa untuk platform apa saja?",
        a: "Ide bisa dipakai untuk Instagram, TikTok, maupun platform lain yang Anda gunakan.",
      },
    ],
  },
};
