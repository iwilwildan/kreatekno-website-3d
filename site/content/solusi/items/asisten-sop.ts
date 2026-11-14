// Source: Solusi v1 COPY 19; client metrics remain examples.
import type { Solusi } from "../schema";

export const asistenSop: Solusi = {
  slug: "asisten-sop",
  status: "ide",
  updated: "2026-10-30",
  industri: ["retail", "klinik", "properti", "logistik", "jasa", "perjalanan"],
  tim: ["sdm", "operasional"],
  apps: ["whatsapp", "drive"],
  id: {
    title: "Staf baru menemukan jawaban SOP sendiri",
    question: "Bagaimana staf baru bisa memahami SOP tanpa terus bertanya ke atasan?",
    result: "Atasan tidak lagi menjawab pertanyaan yang sama",
    summary:
      "Staf bertanya lewat WhatsApp dengan bahasa sehari-hari dan mendapat jawaban dari SOP Anda, lengkap dengan sumbernya.",
    answer:
      "Dokumen SOP yang sudah Anda punya dijadikan asisten tanya-jawab untuk staf. Staf bertanya lewat WhatsApp dengan bahasa sehari-hari dan mendapat jawaban dari SOP Anda, lengkap dengan bagian dokumen yang menjadi sumbernya.",
    pains: ["Staf baru bertanya hal yang sama berulang kali.", "SOP ada, tetapi jarang dibuka karena panjang."],
    steps: [
      {
        title: "SOP dikumpulkan",
        body: "Dokumen yang sudah ada di Google Drive.",
      },
      {
        title: "Staf bertanya",
        body: "Lewat chat dengan bahasa sehari-hari.",
      },
      {
        title: "Jawaban dari SOP Anda",
        body: "Lengkap dengan bagian dokumen sumbernya.",
      },
      {
        title: "SOP diperbarui",
        body: "Pertanyaan yang belum terjawab menjadi bahan perbaikan SOP.",
      },
    ],
    compare: [
      {
        aspect: "Menjawab pertanyaan staf",
        before: "Atasan, berulang kali",
        after: "Asisten, dari SOP",
      },
      {
        aspect: "Memakai SOP",
        before: "Jarang dibuka",
        after: "Ditanya setiap hari",
      },
    ],
    fit: ["Usaha dengan pergantian staf yang cukup sering."],
    notFit: ["Usaha yang belum punya SOP tertulis sama sekali."],
    prep: ["Dokumen SOP yang sudah ada", "Daftar pertanyaan yang sering ditanyakan staf"],
    faq: [
      {
        q: "Kalau SOP belum lengkap?",
        a: "Pertanyaan yang belum terjawab dicatat, jadi Anda tahu bagian mana yang perlu ditulis.",
      },
    ],
  },
};
