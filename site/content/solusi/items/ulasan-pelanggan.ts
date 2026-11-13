// Source: Solusi v1 COPY 19; client metrics remain examples.
import type { Solusi } from "../schema";

export const ulasanPelanggan: Solusi = {
  slug: "ulasan-pelanggan",
  status: "ide",
  updated: "2026-10-30",
  industri: ["retail", "klinik", "jasa"],
  tim: ["cs", "manajemen"],
  apps: ["sheets", "gmail"],
  id: {
    title: "Keluhan pelanggan terkumpul di satu tempat",
    question: "Bagaimana pemilik usaha tahu keluhan pelanggan yang paling sering muncul?",
    result: "Pemilik melihat pola keluhan setiap minggu",
    summary:
      "Keluhan dari chat, email, dan formulir terkumpul di satu tabel, dengan ringkasan topik teratas setiap minggu.",
    answer:
      "Keluhan dan ulasan dari chat, email, dan formulir dikumpulkan ke satu tabel, lalu dikelompokkan per topik. Setiap minggu pemilik menerima ringkasan keluhan yang paling sering muncul, sehingga perbaikan bisa diprioritaskan.",
    pains: [
      "Keluhan tercecer di chat, email, dan media sosial.",
      "Pemilik tidak tahu masalah mana yang paling sering terjadi.",
    ],
    steps: [
      {
        title: "Keluhan masuk",
        body: "Dari chat, email, atau formulir.",
      },
      {
        title: "Keluhan terkumpul",
        body: "Dalam satu tabel, dikelompokkan per topik.",
      },
      {
        title: "Ringkasan mingguan",
        body: "Pemilik menerima topik keluhan teratas.",
      },
      {
        title: "Perbaikan diprioritaskan",
        body: "Tim fokus pada masalah yang paling sering muncul.",
      },
    ],
    compare: [
      {
        aspect: "Melihat keluhan",
        before: "Tersebar di banyak tempat",
        after: "Satu tabel",
      },
      {
        aspect: "Menentukan prioritas",
        before: "Berdasarkan ingatan",
        after: "Berdasarkan data mingguan",
      },
    ],
    fit: ["Usaha dengan banyak interaksi pelanggan setiap hari."],
    notFit: ["Usaha yang keluhannya sangat jarang."],
    prep: ["Saluran keluhan yang dipakai sekarang", "Topik keluhan yang ingin dipantau"],
    faq: [
      {
        q: "Apakah keluhan dibalas otomatis?",
        a: "Tidak harus. Fokus utamanya adalah mengumpulkan dan merangkum.",
      },
    ],
  },
};
