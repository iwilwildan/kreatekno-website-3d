// S8 N1b (24 Nov 2026): rewritten from the SOP agent workflow on the n8n-mcp instance (read only, inactive): an SOP
// PDF on Drive is loaded into a knowledge base, staff ask through a Telegram bot, the agent answers only from that
// base in a polite tone and names the document and section it used. For uncovered questions the bot tells staff who
// to contact. Its usage log nodes are not connected, so logging unanswered questions is a design step.
// Supplemented by the public n8n.io templates 4966 (edit the document, answers follow) and 4551 (new files are
// processed automatically). The real workflow is for a government office; per the user's decision (24 Nov) the
// page uses a sample clinic and Telegram as the channel. Status "ide": client, quote and metrics are samples.
import type { Solusi } from "../schema";

export const asistenSop: Solusi = {
  slug: "asisten-sop",
  status: "ide",
  updated: "2026-11-24",
  industri: ["retail", "klinik", "properti", "logistik", "jasa", "perjalanan"],
  tim: ["sdm", "operasional"],
  apps: ["telegram", "drive", "sheets"],
  metricsKind: "example",
  id: {
    title: "Staf baru menemukan jawaban SOP sendiri",
    seoTitle: "Bot SOP untuk Staf, Jawaban dari Dokumen Perusahaan | Kreatekno",
    seoDescription:
      "Staf bertanya lewat bot Telegram internal dan dijawab dari SOP perusahaan, lengkap dengan dokumen dan bagiannya. Di luar SOP diarahkan ke penanggung jawab.",
    question: "Bagaimana staf baru bisa memahami SOP tanpa terus bertanya ke atasan?",
    result: "Atasan tidak lagi menjawab pertanyaan yang sama",
    summary:
      "Staf bertanya lewat chat dengan bahasa sehari-hari dan mendapat jawaban dari SOP-mu, lengkap dengan bagian sumbernya.",
    answer:
      "Dokumen SOP yang sudah kamu punya dijadikan basis pengetahuan. Staf bertanya lewat chat dengan bahasa sehari-hari, dan AI menjawab dari SOP itu, lengkap dengan judul dokumen dan bagiannya. Jika SOP belum mencakup pertanyaannya, AI menyarankan staf menghubungi penanggung jawab. Dalam rancangan, topik tersebut bisa dicatat sebagai bahan perbaikan SOP.",
    client: "Klinik gigi tiga cabang (contoh)",
    painsLead:
      "Klinik gigi dengan tiga cabang punya SOP untuk sterilisasi alat, pendaftaran pasien, dan penanganan keluhan. Dokumennya panjang dan tersimpan di folder bersama, jadi staf baru lebih sering bertanya ke kepala cabang. Kepala cabang menjawab hal yang sama setiap kali ada staf baru.",
    pains: [
      "Staf baru bertanya hal yang sama berulang kali.",
      "SOP ada, tetapi jarang dibuka karena panjang.",
      "Jawaban dari mulut ke mulut bisa berbeda dengan SOP yang berlaku.",
    ],
    built: {
      h: "SOP yang bisa ditanya, dengan sumber yang jelas",
      lead: "Dokumen SOP-mu diproses menjadi basis pengetahuan. Staf bertanya lewat chat, dan setiap jawaban menyebut dokumen dan bagian yang dipakai, sehingga mudah dicek.",
      points: [
        "Memproses dokumen SOP dari folder bersama menjadi basis pengetahuan.",
        "Menerima pertanyaan staf lewat bot chat internal dengan bahasa sehari-hari.",
        "Menjawab hanya dari SOP-mu, dengan bahasa sopan dan langkah yang berurutan.",
        "Menyebut judul dokumen dan bagian yang menjadi sumber setiap jawaban.",
        "Mengarahkan staf ke penanggung jawab kalau jawabannya tidak ada di SOP.",
        "Rancangan: mencatat pertanyaan yang belum terjawab sebagai bahan perbaikan SOP.",
      ],
    },
    quote: {
      text: "Dulu setiap staf baru menanyakan urutan sterilisasi ke saya. Sekarang mereka bertanya ke bot, dan jawabannya menyebut halaman SOP-nya.",
      by: "Kepala cabang klinik gigi",
    },
    steps: [
      { title: "SOP dikumpulkan", body: "Dokumen SOP yang sudah ada diproses menjadi basis pengetahuan." },
      { title: "Staf bertanya", body: "Lewat bot chat internal, dengan bahasa sehari-hari." },
      { title: "Jawaban dari SOP-mu", body: "Lengkap dengan judul dokumen dan bagian sumbernya." },
      {
        title: "Staf diarahkan ke penanggung jawab",
        body: "Jika belum tercakup, AI memberi tahu staf siapa yang bisa dihubungi. Dalam rancangan, topiknya bisa dicatat untuk melengkapi SOP.",
      },
    ],
    compare: [
      { aspect: "Menjawab pertanyaan staf", before: "Atasan, berulang kali", after: "AI, dari SOP" },
      { aspect: "Memakai SOP", before: "Jarang dibuka", after: "Ditanya setiap hari" },
      { aspect: "Sumber jawaban", before: "Ingatan atasan", after: "Bagian SOP yang disebut" },
    ],
    fit: [
      "Usaha dengan pergantian staf yang cukup sering.",
      "Usaha dengan beberapa cabang yang harus menjalankan SOP yang sama.",
    ],
    notFit: ["Usaha yang belum punya SOP tertulis sama sekali."],
    prep: [
      "Dokumen SOP yang sudah ada",
      "Daftar pertanyaan yang sering ditanyakan staf",
      "Penanggung jawab untuk pertanyaan di luar SOP",
    ],
    metrics: [
      { value: "1", unit: "folder", label: "SOP yang menjadi satu-satunya sumber jawaban" },
      { value: "1", unit: "sumber", label: "disebut di setiap jawaban: judul dokumen dan bagiannya" },
      { value: "0", unit: "tebakan", label: "pertanyaan di luar SOP diarahkan ke penanggung jawab" },
    ],
    faq: [
      {
        q: "Kalau SOP belum lengkap?",
        a: "AI menyarankan staf menghubungi penanggung jawab. Dalam rancangan, pertanyaan yang belum terjawab bisa dicatat di tabel untuk membantu melengkapi SOP.",
      },
      {
        q: "Bagaimana kalau SOP diperbarui?",
        a: "Dokumen versi baru diproses ulang, dan jawaban berikutnya memakai isi yang terbaru.",
      },
      {
        q: "Kenapa memakai bot chat khusus staf?",
        a: "Bot di aplikasi chat terpisah mudah dibuat untuk pemakaian internal dan bisa dibatasi hanya untuk staf. Aplikasi chat lain bisa dipakai bila diperlukan.",
      },
    ],
  },
  en: {
    title: "New staff find SOP answers on their own",
    question: "How can new staff understand the SOPs without asking their supervisor again and again?",
    result: "Supervisors stop answering the same questions",
    summary: "Staff ask in chat in everyday language and get answers from your SOPs, with the source section named.",
    answer:
      "Your existing SOP documents become a knowledge base. Staff ask in chat in everyday language, and the assistant answers from the SOPs, naming the document and section it used. If the SOPs do not cover the question, the assistant tells staff who to contact. The proposed workflow can also log the topic so the team can improve the SOPs.",
    client: "Dental clinic with three branches (sample)",
    painsLead:
      "A dental clinic with three branches has SOPs for instrument sterilisation, patient registration and complaint handling. The documents are long and sit in a shared folder, so new staff ask the branch head instead. The branch head answers the same things every time someone new joins.",
    pains: [
      "New staff ask the same questions over and over.",
      "The SOPs exist but are rarely opened because they are long.",
      "Word-of-mouth answers can differ from the SOP in force.",
    ],
    built: {
      h: "SOPs you can ask, with a clear source",
      lead: "Your SOP documents are processed into a knowledge base. Staff ask in chat, and every answer names the document and section it used, so it is easy to check.",
      points: [
        "Processes the SOP documents in a shared folder into a knowledge base.",
        "Takes staff questions in everyday language through an internal chat bot.",
        "Answers only from your SOPs, politely and with steps in order.",
        "Names the document title and section behind every answer.",
        "Points staff to the person in charge when the SOPs have no answer.",
        "Design step: logs unanswered questions so the SOPs can be improved.",
      ],
    },
    quote: {
      text: "Every new staff member used to ask me the sterilisation order. Now they ask the bot, and the answer names the SOP page.",
      by: "Branch head at a dental clinic",
    },
    steps: [
      { title: "SOPs collected", body: "Your existing SOP documents are processed into a knowledge base." },
      { title: "Staff ask", body: "Through an internal chat bot, in everyday language." },
      { title: "Answers from your SOPs", body: "With the document title and source section." },
      {
        title: "Staff are told who to contact",
        body: "When the SOPs do not cover a question, the assistant tells staff who can help. The proposed workflow can log the topic for an SOP update.",
      },
    ],
    compare: [
      {
        aspect: "Answering staff questions",
        before: "The supervisor, again and again",
        after: "The assistant, from the SOPs",
      },
      { aspect: "Using the SOPs", before: "Rarely opened", after: "Asked every day" },
      { aspect: "Source of the answer", before: "The supervisor's memory", after: "The SOP section named" },
    ],
    fit: [
      "Businesses with fairly frequent staff turnover.",
      "Businesses with several branches that must follow the same SOPs.",
    ],
    notFit: ["Businesses with no written SOPs at all."],
    prep: [
      "Your existing SOP documents",
      "A list of questions staff often ask",
      "The person in charge of questions outside the SOPs",
    ],
    metrics: [
      { value: "1", unit: "folder", label: "of SOPs as the only source of answers" },
      { value: "1", unit: "source", label: "named in every answer: document title and section" },
      { value: "0", unit: "guesses", label: "questions outside the SOPs go to the person in charge" },
    ],
    faq: [
      {
        q: "What if the SOPs are incomplete?",
        a: "The assistant tells staff who to contact. The proposed workflow can log unanswered questions in Sheets so the team knows what to add to the SOPs.",
      },
      {
        q: "What happens when an SOP is updated?",
        a: "The new version is processed again, and later answers use the latest content.",
      },
      {
        q: "Why Telegram?",
        a: "A Telegram bot is easy to set up for internal use and can be limited to staff only. Other channels can be used when needed.",
      },
    ],
  },
};
