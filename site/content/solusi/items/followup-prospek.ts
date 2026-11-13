// Source: Solusi v1 COPY 19; client metrics remain examples.
import type { Solusi } from "../schema";

export const followupProspek: Solusi = {
  slug: "followup-prospek",
  status: "ide",
  updated: "2026-10-30",
  industri: ["properti"],
  tim: ["penjualan", "marketing"],
  apps: ["whatsapp", "sheets"],
  id: {
    title: "Calon pembeli properti tidak lagi lupa di-follow-up",
    question: "Bagaimana tim marketing properti menindaklanjuti setiap calon pembeli tepat waktu?",
    result: "Setiap prospek dihubungi kembali sesuai jadwal",
    summary:
      "Calon pembeli dari iklan dan survei tercatat rapi, dan tim marketing diingatkan kapan harus menghubungi kembali.",
    answer:
      "Setiap calon pembeli yang masuk dari iklan atau survei lokasi tercatat di Google Sheets beserta minatnya. Tim marketing menerima pengingat kapan harus menghubungi kembali, dan pesan lanjutan bisa disiapkan sesuai tipe unit yang diminati.",
    pains: ["Prospek dari iklan tercecer di banyak chat.", "Calon pembeli lupa dihubungi kembali setelah survei."],
    steps: [
      {
        title: "Prospek masuk",
        body: "Dari iklan, chat, atau survei lokasi.",
      },
      {
        title: "Prospek tercatat",
        body: "Nama, minat, dan sumbernya tersimpan di tabel.",
      },
      {
        title: "Pengingat follow-up",
        body: "Tim menerima pengingat sesuai jadwal.",
      },
      {
        title: "Tim menghubungi",
        body: "Pesan lanjutan sesuai unit yang diminati.",
      },
    ],
    compare: [
      {
        aspect: "Mencatat prospek",
        before: "Tercecer di chat",
        after: "Satu tabel",
      },
      {
        aspect: "Follow-up",
        before: "Mengandalkan ingatan",
        after: "Ada pengingat",
      },
    ],
    fit: ["Developer dan agen properti dengan banyak prospek dari iklan."],
    notFit: ["Penjualan yang seluruhnya lewat agen luar."],
    prep: ["Sumber prospek yang dipakai sekarang", "Daftar unit dan tipe"],
    faq: [
      {
        q: "Apakah pesan follow-up dikirim otomatis?",
        a: "Bisa otomatis atau hanya disiapkan untuk dikirim tim, sesuai pilihan Anda.",
      },
    ],
  },
};
