// Source: Solusi v1 COPY 19; client metrics remain examples.
import type { Solusi } from "../schema";

export const csKlinik: Solusi = {
  slug: "cs-klinik",
  status: "ide",
  updated: "2026-10-30",
  industri: ["klinik"],
  tim: ["cs"],
  apps: ["whatsapp", "calendar"],
  id: {
    title: "Pertanyaan pasien terjawab di luar jam kerja",
    question: "Bagaimana klinik menjawab chat pasien di malam hari tanpa menambah staf?",
    result: "Pasien dilayani 24 jam, admin fokus ke pasien yang datang",
    summary:
      "Pertanyaan pasien soal jam praktik, harga, dan jadwal dokter terjawab di luar jam kerja, pertanyaan medis tetap diteruskan.",
    answer:
      "Asisten CS menjawab pertanyaan pasien yang paling sering muncul, seperti jam praktik, harga, dan jadwal dokter, dari data klinik Anda sendiri. Pasien bisa langsung membuat janji temu, dan pertanyaan medis selalu diteruskan ke staf klinik.",
    pains: [
      "Admin menjawab pertanyaan yang sama puluhan kali sehari.",
      "Chat yang masuk malam hari baru dibalas keesokan paginya.",
    ],
    steps: [
      {
        title: "Pasien bertanya lewat chat",
        body: "Lewat nomor WhatsApp klinik yang sudah dikenal pasien.",
      },
      {
        title: "Asisten menjawab dari data klinik",
        body: "Jam praktik, harga, dan jadwal dokter sesuai data Anda.",
      },
      {
        title: "Janji temu tercatat",
        body: "Pasien memilih jadwal dan janji temu masuk ke kalender.",
      },
      {
        title: "Staf menangani pertanyaan medis",
        body: "Pertanyaan medis selalu diteruskan ke staf klinik.",
      },
    ],
    compare: [
      {
        aspect: "Pertanyaan rutin",
        before: "Dijawab admin satu per satu",
        after: "Dijawab saat itu juga",
      },
      {
        aspect: "Chat malam hari",
        before: "Dibalas besok pagi",
        after: "Dilayani langsung",
      },
      {
        aspect: "Janji temu",
        before: "Dicatat manual",
        after: "Masuk ke kalender",
      },
    ],
    fit: ["Klinik yang menerima banyak pertanyaan berulang lewat WhatsApp."],
    notFit: ["Layanan yang membutuhkan diagnosis lewat chat."],
    prep: ["Daftar layanan, harga, dan jadwal dokter", "Pertanyaan yang paling sering diajukan pasien"],
    faq: [
      {
        q: "Apakah asisten memberi saran medis?",
        a: "Tidak. Pertanyaan medis selalu diteruskan ke staf klinik.",
      },
      {
        q: "Apakah pasien bisa bicara dengan manusia?",
        a: "Bisa, kapan saja. Asisten meneruskan chat ke admin.",
      },
    ],
  },
};
