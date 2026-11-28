import type { AsistenSopCerita, AsistenSopCeritaLocale, AsistenSopPanggung } from "./schema";

const keys = [
  "sebelum",
  "pilih-sop",
  "proses-dokumen",
  "staf-bertanya",
  "jawaban-dan-sumber",
  "di-luar-sop",
  "rancangan-catatan",
  "ringkasan",
  "konsultasi",
];
const staff = "Wulan";
const reference = { version: "1.2", section: "2.1" };

function scenes(rows: [string, string, string][], step: string): AsistenSopCeritaLocale["scenes"] {
  return rows.map(([rail, title, body], i) => ({
    id: keys[i],
    rail,
    title,
    body,
    eyebrow: i >= 1 && i <= 6 ? `${step} ${i} · ${rail}` : rail,
    ...(i === 8 && { cta: true }),
  }));
}

const id: AsistenSopPanggung = {
  staff,
  document: { ...reference, title: "SOP Pendaftaran Pasien", heading: "Kedatangan terjadwal" },
  question: "Kalau pasien datang sesuai jadwal, saya tandai di mana?",
  answer: ["Buka daftar janji.", "Cocokkan nama dan jadwal.", "Tandai Hadir pada baris yang sesuai."],
  followUp: "Kalau pasien datang ke cabang lain dari jadwal?",
  guidance: "Belum tercakup di SOP. Hubungi kepala cabang.",
  logTopic: "Kedatangan di cabang lain",
  labels: {
    folder: "Folder SOP klinik",
    searching: "Bagian mana yang harus saya baca?",
    knowledgeBase: "Basis pengetahuan",
    ready: "Siap dipakai",
    chat: "Chat staf",
    assistant: "AI SOP",
    source: "Bagian",
    outsideSop: "Di luar SOP",
    staffAction: "Wulan menghubungi kepala cabang",
    log: "Topik untuk perbaikan SOP",
    design: "Rancangan",
    topic: "Topik",
    sample: "Contoh alur",
  },
};

const en: AsistenSopPanggung = {
  staff,
  document: { ...reference, title: "Patient Registration SOP", heading: "Scheduled arrivals" },
  question: "Where do I mark a patient who arrives for their appointment?",
  answer: ["Open the appointment list.", "Match the name and appointment time.", "Mark the matching row as Arrived."],
  followUp: "What if a patient arrives at a different branch?",
  guidance: "The SOP does not cover this. Ask the branch manager.",
  logTopic: "Arrival at a different branch",
  labels: {
    folder: "Clinic SOP folder",
    searching: "Which section should I read?",
    knowledgeBase: "Knowledge base",
    ready: "Ready to use",
    chat: "Telegram · Staff chat",
    assistant: "SOP assistant",
    source: "Section",
    outsideSop: "Outside the SOP",
    staffAction: "Wulan contacts the branch manager",
    log: "Topics to add to the SOP",
    design: "Design step",
    topic: "Topic",
    sample: "Example workflow",
  },
};

export const asistenSopStory: AsistenSopCerita = {
  slug: "asisten-sop",
  id: {
    intro:
      "Ikuti dua pertanyaan staf baru di klinik gigi contoh, dari menemukan jawaban SOP sampai menghubungi kepala cabang.",
    scenes: scenes(
      [
        [
          "Sebelum",
          "Wulan perlu menemukan aturan pendaftaran.",
          "Ia baru bekerja di klinik gigi tiga cabang dan belum tahu bagian SOP yang perlu dibaca saat pasien datang.",
        ],
        [
          "Pilih SOP",
          "Staf memilih SOP Pendaftaran Pasien dari folder bersama.",
          "Versi 1.2 menjadi sumber yang akan disiapkan untuk pertanyaan staf.",
        ],
        [
          "Proses dokumen",
          "Versi 1.2 siap dipakai setelah diproses.",
          "Bagian 2.1 tentang kedatangan terjadwal tersedia di basis pengetahuan.",
        ],
        ["Staf bertanya", "Wulan bertanya lewat bot chat staf.", id.question],
        [
          "Jawaban dan sumber",
          "AI menjelaskan cara menandai kehadiran.",
          `${id.answer.join(" ")} Sumbernya SOP Pendaftaran Pasien, Bagian 2.1 · Kedatangan terjadwal.`,
        ],
        [
          "Di luar SOP",
          "Pertanyaan kedua perlu kepala cabang.",
          `${id.followUp} Bagian itu belum tercakup. AI memberi arahan, lalu Wulan menghubungi kepala cabang.`,
        ],
        [
          "Rancangan catatan",
          "Topik yang belum tercakup bisa dicatat.",
          "Dalam rancangan, topik kedatangan di cabang lain masuk ke tabel sebagai bahan untuk melengkapi SOP.",
        ],
        [
          "Ringkasan",
          "Staf bisa mengecek sumber dan tahu siapa yang bisa ditanya.",
          "Jawaban pertama menyebut dokumen dan bagian. Pertanyaan kedua memberi Wulan langkah berikutnya.",
        ],
        [
          "Konsultasi",
          "Mau staf lebih mudah menemukan jawaban dari SOP?",
          "Ceritakan dokumen yang sudah ada dan pertanyaan yang paling sering diajukan stafmu.",
        ],
      ],
      "Langkah",
    ),
    stage: id,
  },
  en: {
    intro:
      "Follow two questions from a new hire at a sample dental clinic, from finding a source in the SOP to contacting the branch manager.",
    scenes: scenes(
      [
        [
          "Before",
          "Wulan needs to find the registration procedure.",
          "She just joined a three-branch dental clinic and is unsure which part of the SOP to read when a patient arrives.",
        ],
        [
          "Choose the SOP",
          "The team selects the Patient Registration SOP from Drive.",
          "They prepare version 1.2 as the source for staff questions.",
        ],
        [
          "Process the document",
          "Version 1.2 is ready once it has been processed.",
          "Section 2.1 on scheduled arrivals is now available in the knowledge base.",
        ],
        ["Staff ask", "Wulan asks in Telegram.", en.question],
        [
          "Answer and source",
          "The assistant explains how to mark an arrival.",
          `${en.answer.join(" ")} The source is the Patient Registration SOP, Section 2.1 · Scheduled arrivals.`,
        ],
        [
          "Outside the SOP",
          "The second question needs the branch manager.",
          `${en.followUp} The SOP does not cover this. The assistant tells Wulan who to ask, and she contacts the branch manager.`,
        ],
        [
          "Proposed log",
          "The team could keep track of topics the SOP misses.",
          "In the proposed workflow, a row in Sheets records arrivals at a different branch so the team can update the SOP.",
        ],
        [
          "Recap",
          "Staff can check the source and know who to ask.",
          "The first reply names the document and section. The second gives Wulan a next step.",
        ],
        [
          "Consultation",
          "Want staff to find answers in your SOPs more easily?",
          "Tell us what documents you have and what your staff ask most often.",
        ],
      ],
      "Step",
    ),
    stage: en,
  },
};
