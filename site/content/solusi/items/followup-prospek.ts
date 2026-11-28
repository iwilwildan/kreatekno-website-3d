// Source: Solusi v1 COPY 19, rewritten 22 Nov 2026 (FP1) to match the sales follow-up workflow on the n8n-mcp
// instance: a daily morning schedule reads the prospect table, keeps prospects that are still pending and quiet
// for more than three days, and an AI agent writes one short message from the last chat summary. The workflow is
// a generic test, so the status stays "ide" and the developer, quote and metrics are samples. Per the user's
// decisions the draft goes to the marketing team, who send it themselves (outside the 24-hour window a business
// may only send approved templates), and marking the row as contacted is a design step the workflow lacks.
import type { Solusi } from "../schema";

export const followupProspek: Solusi = {
  slug: "followup-prospek",
  status: "ide",
  updated: "2026-11-22",
  industri: ["properti"],
  tim: ["penjualan", "marketing"],
  apps: ["whatsapp", "sheets"],
  metricsKind: "example",
  id: {
    title: "Calon pembeli properti tidak lagi lupa di-follow-up",
    seoTitle: "Follow-up Prospek Properti Otomatis dengan Draf Pesan AI | Kreatekno",
    seoDescription:
      "Setiap pagi, prospek properti yang diam lebih dari tiga hari dipilih dari tabel, lalu AI menulis draf pesan dari chat terakhirnya untuk dikirim staf marketing.",
    question: "Bagaimana staf marketing properti menindaklanjuti setiap calon pembeli tepat waktu?",
    result: "Prospek dihubungi lagi sesuai jadwal, dengan draf pesan yang sudah siap",
    summary:
      "Prospek yang diam lebih dari tiga hari terdeteksi setiap pagi, lengkap dengan draf pesan dari chat terakhirnya.",
    answer:
      "Setiap pagi, tabel prospek dibaca dan disaring: hanya calon pembeli yang masih menunggu dan sudah diam lebih dari tiga hari. Untuk setiap prospek itu, AI menulis satu pesan pendek yang menyambung chat terakhirnya, misalnya unit yang diminati dan alasan menunda. Staf marketing menerima pengingat beserta drafnya, lalu mengirimnya dari nomor kantor yang sudah dikenal prospek.",
    client: "Developer perumahan (contoh)",
    painsLead:
      "Banyak calon pembeli tidak langsung memutuskan setelah survei lokasi. Mereka minta waktu untuk berdiskusi atau menunggu cicilan, dan staf marketing harus ingat sendiri kapan menghubungi lagi. Di tengah chat baru setiap hari, prospek yang diam mudah terlupa.",
    pains: [
      'Prospek yang bilang "nanti saya kabari" jarang dihubungi lagi.',
      "Staf tidak tahu prospek mana yang sudah terlalu lama diam.",
      "Pesan follow-up ditulis ulang satu per satu dan sering terdengar sama.",
    ],
    built: {
      h: "Satu pengecekan pagi yang menyiapkan follow-up untuk staf",
      lead: "Staf cukup mengisi satu tabel prospek setelah chat atau survei lokasi. Setiap pagi, tabel itu dibaca, prospek yang perlu disapa dipilih, dan staf menerima draf pesan yang siap dikirim.",
      points: [
        "Membaca tabel prospek setiap pagi pukul 10.00, tanpa perlu diingatkan.",
        "Hanya memilih prospek yang masih menunggu dan sudah diam lebih dari tiga hari.",
        "Menulis satu pesan pendek yang menyebut unit dan alasan prospek menunda.",
        "Nada pesannya santai dan sopan, menanyakan kabar tanpa mendesak.",
        "Draf dikirim ke staf marketing, yang mengirimnya dari nomor kantor.",
        "Rancangan: status dan tanggal prospek diperbarui setelah pesan terkirim.",
      ],
    },
    quote: {
      text: "Dulu kami baru ingat prospek setelah mereka membeli di tempat lain. Sekarang setiap pagi daftar dan drafnya sudah siap.",
      by: "Staf marketing perumahan",
    },
    steps: [
      {
        title: "Prospek tercatat",
        body: "Staf mengisi nama, ringkasan chat, dan status setelah chat atau survei lokasi.",
      },
      {
        title: "Pengecekan pagi",
        body: "Setiap pagi, prospek yang masih menunggu dan diam lebih dari tiga hari dipilih.",
      },
      {
        title: "Draf pesan disiapkan",
        body: "AI menulis satu pesan pendek yang menyambung chat terakhir prospek.",
      },
      {
        title: "Staf menghubungi",
        body: "Staf marketing mengirim draf dari nomor kantor, dan status prospek diperbarui.",
      },
    ],
    compare: [
      {
        aspect: "Mencatat prospek",
        before: "Tercecer di chat",
        after: "Satu tabel",
      },
      {
        aspect: "Jadwal follow-up",
        before: "Mengandalkan ingatan",
        after: "Dicek setiap pagi",
      },
      {
        aspect: "Pesan follow-up",
        before: "Ditulis ulang satu per satu",
        after: "Draf siap dari chat terakhir",
      },
    ],
    fit: [
      "Developer dan agen properti dengan banyak prospek dari iklan dan survei lokasi.",
      "Staf marketing yang sudah mencatat prospek, atau siap mulai mencatat di satu tabel.",
    ],
    notFit: ["Penjualan yang seluruhnya lewat agen luar."],
    prep: [
      "Daftar prospek yang ada sekarang",
      "Daftar unit dan tipe yang dijual",
      "Berapa hari prospek boleh diam sebelum disapa lagi",
    ],
    metrics: [
      {
        value: "3",
        unit: "hari",
        label: "batas diam sebelum prospek disapa lagi",
      },
      {
        value: "1",
        unit: "pesan",
        label: "per prospek, menyambung chat terakhir",
      },
      {
        value: "1",
        unit: "kali",
        label: "pengecekan setiap pagi, pukul 10.00",
      },
    ],
    faq: [
      {
        q: "Apakah pesan follow-up dikirim otomatis ke calon pembeli?",
        a: "Dalam rancangan ini tidak. Draf dikirim ke staf marketing, yang mengirimnya dari nomor kantor. Kalau pesan dikirim otomatis ke calon pembeli, pesannya wajib memakai template yang sudah disetujui, karena aplikasi chat untuk bisnis membatasi pesan ke pelanggan yang lebih dari sehari tidak membalas.",
      },
      {
        q: "Bagaimana kalau prospek sudah deal atau batal?",
        a: "Cukup ubah statusnya di tabel. Hanya prospek yang masih menunggu yang dipilih saat pengecekan pagi.",
      },
      {
        q: "Apakah batas tiga hari bisa diubah?",
        a: "Bisa. Batas hari dan jam pengecekan disesuaikan dengan cara kerja stafmu.",
      },
    ],
  },
  en: {
    title: "Property buyers are no longer forgotten after the first chat",
    question: "How can a property marketing team follow up every prospective buyer on time?",
    result: "Every morning the team knows who to contact and already has a draft message",
    summary:
      "Prospects quiet for more than three days are found every morning, with a draft message from their last chat.",
    answer:
      "Every morning the prospect table is read and filtered: only buyers who are still pending and have been quiet for more than three days. For each of them, AI writes one short message that picks up the last chat, such as the unit they liked and the reason they paused. The marketing team gets a reminder with the draft, then sends it from the team's own number.",
    client: "Housing developer (sample)",
    painsLead:
      "Many buyers do not decide right after a site visit. They ask for time to talk it over or wait for an instalment plan, and the marketing team has to remember when to get back to them. With new chats every day, quiet prospects are easily forgotten.",
    pains: [
      'Prospects who say "I\'ll let you know" are rarely contacted again.',
      "The team cannot see which prospects have been quiet too long.",
      "Follow-up messages are rewritten one by one and often sound the same.",
    ],
    built: {
      h: "One morning check that prepares follow-ups for the team",
      lead: "The team only fills one prospect table after each chat or site visit. Every morning that table is read, the prospects who need a nudge are picked, and the team gets a draft message ready to send.",
      points: [
        "Reads the prospect table every morning at 10.00 am, without anyone remembering to.",
        "Only picks prospects who are still pending and have been quiet for more than three days.",
        "Writes one short message that mentions the unit and the reason the prospect paused.",
        "Keeps a relaxed, polite tone that asks for news without pushing.",
        "Sends the draft to the marketing team, who send it from the team number.",
        "Design step: the prospect's status and date are updated once the message is sent.",
      ],
    },
    quote: {
      text: "We used to remember a prospect only after they had bought elsewhere. Now the list and the drafts are ready every morning.",
      by: "Housing marketing team",
    },
    steps: [
      {
        title: "Prospects are recorded",
        body: "The team fills in the name, chat summary and status after each chat or site visit.",
      },
      {
        title: "Morning check",
        body: "Every morning, prospects who are still pending and quiet for more than three days are picked.",
      },
      {
        title: "A draft is prepared",
        body: "AI writes one short message that picks up the prospect's last chat.",
      },
      {
        title: "The team gets in touch",
        body: "The marketing team sends the draft from the team number, and the prospect's status is updated.",
      },
    ],
    compare: [
      {
        aspect: "Recording prospects",
        before: "Scattered across chats",
        after: "One table",
      },
      {
        aspect: "When to follow up",
        before: "Down to memory",
        after: "Checked every morning",
      },
      {
        aspect: "Follow-up message",
        before: "Rewritten one by one",
        after: "Drafted from the last chat",
      },
    ],
    fit: [
      "Developers and property agents with many prospects from ads and site visits.",
      "Marketing teams that already record prospects, or are ready to keep one table.",
    ],
    notFit: ["Sales handled entirely by outside agents."],
    prep: [
      "Your current list of prospects",
      "The units and types you sell",
      "How many quiet days before a prospect is contacted again",
    ],
    metrics: [
      {
        value: "3",
        unit: "days",
        label: "of silence before a prospect is contacted again",
      },
      {
        value: "1",
        unit: "message",
        label: "per prospect, picking up the last chat",
      },
      {
        value: "1",
        unit: "check",
        label: "every morning, at 10.00 am",
      },
    ],
    faq: [
      {
        q: "Are follow-up messages sent to buyers automatically?",
        a: "Not in this design. The draft goes to the marketing team, who send it from the team number. Sending straight to buyers needs pre-approved message templates, because WhatsApp Business limits messages to customers who have not replied for more than a day.",
      },
      {
        q: "What if a prospect has already bought or dropped out?",
        a: "Just change the status in the table. Only prospects who are still pending are picked in the morning check.",
      },
      {
        q: "Can the three-day limit be changed?",
        a: "Yes. The number of days and the time of the check are set to fit how your team works.",
      },
    ],
  },
};
