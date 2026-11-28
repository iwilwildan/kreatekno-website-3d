import type { UlasanCerita, UlasanCeritaLocale, UlasanPanggung } from "./schema";

const sceneIds = [
  "sebelum",
  "kumpulkan-masukan",
  "seragamkan-data",
  "lewati-duplikat",
  "kelompokkan-topik",
  "tandai-belum-dibalas",
  "kirim-ringkasan",
  "ringkasan",
  "konsultasi",
];
const sample = {
  staff: "Dita",
  owner: "Fajar",
  previousCounts: { wait: 1, taste: 2, clean: 1 },
  reportDate: "2026-11-23",
};
const entries = [
  { id: "UP-031", source: "form", branch: 2, date: "2026-11-16", rating: 2, topic: "wait", replied: false },
  { id: "UP-032", source: "chat", branch: 2, date: "2026-11-17", rating: null, topic: "wait", replied: true },
  { id: "UP-033", source: "email", branch: 2, date: "2026-11-18", rating: null, topic: "wait", replied: true },
  { id: "UP-034", source: "form", branch: 1, date: "2026-11-19", rating: 5, topic: "taste", replied: true },
  { id: "UP-035", source: "chat", branch: 2, date: "2026-11-20", rating: null, topic: "taste", replied: true },
  { id: "UP-036", source: "email", branch: 1, date: "2026-11-21", rating: null, topic: "clean", replied: true },
] satisfies Omit<UlasanPanggung["reviews"][number], "body">[];

function reviews(bodies: [string, string, string, string, string, string]): UlasanPanggung["reviews"] {
  return entries.map((entry, index) => ({ ...entry, body: bodies[index] }));
}

function scenes(rows: [string, string, string][], step: string): UlasanCeritaLocale["scenes"] {
  return rows.map(([rail, title, body], index) => ({
    id: sceneIds[index],
    rail,
    title,
    body,
    eyebrow: index >= 1 && index <= 6 ? `${step} ${index} · ${rail}` : rail,
    ...(index === 8 && { cta: true }),
  }));
}

const id: UlasanPanggung = {
  ...sample,
  locale: "id-ID",
  daily: "10.00 WIB",
  currentWeek: "16–22 Nov",
  previousWeek: "9–15 Nov",
  reviews: reviews([
    "Menunggu lama saat makan siang.",
    "Pesanan makan siang lama keluar.",
    "Pesanan kami lama datang.",
    "Bumbu ayamnya enak.",
    "Rasa supnya pas.",
    "Meja belum dibersihkan.",
  ]),
  labels: {
    channels: { form: "Formulir saran", chat: "Chat layanan", email: "Email" },
    topics: { wait: "Waktu tunggu", taste: "Rasa", clean: "Kebersihan" },
    branch: "Cabang",
    before: "Masukan tersebar",
    intake: "Pengumpulan harian",
    table: "Sheets · Catatan ulasan",
    stars: "bintang",
    unrated: "Tanpa rating",
    duplicates: "Cek kiriman yang sama",
    duplicateSkipped: "Duplikat dilewati",
    incoming: "kiriman",
    kept: "catatan unik",
    grouped: "Topik minggu ini",
    complaint: "Keluhan",
    praise: "Pujian",
    queue: "Daftar tindak lanjut",
    unanswered: "Belum dibalas",
    followUp: "Dita membuka catatan untuk ditindaklanjuti",
    report: "Gmail · Ringkasan mingguan",
    current: "Minggu ini",
    previous: "Minggu lalu",
    total: "Total catatan",
    action: "Fajar menambah satu staf saat makan siang di Cabang 2.",
    sample: "Contoh alur",
  },
};

const en: UlasanPanggung = {
  ...sample,
  locale: "en-GB",
  daily: "10:00 am WIB",
  currentWeek: "16–22 Nov",
  previousWeek: "9–15 Nov",
  reviews: reviews([
    "We waited a long time at lunch.",
    "Our lunch order took a long time.",
    "Our food was slow to arrive.",
    "The chicken seasoning was delicious.",
    "The soup tasted great.",
    "The table had not been cleaned.",
  ]),
  labels: {
    channels: { form: "Feedback form", chat: "Support chat", email: "Email" },
    topics: { wait: "Waiting time", taste: "Taste", clean: "Cleanliness" },
    branch: "Branch",
    before: "Feedback in different places",
    intake: "Daily import",
    table: "Sheets · Review log",
    stars: "stars",
    unrated: "No rating",
    duplicates: "Check repeat submissions",
    duplicateSkipped: "Duplicate skipped",
    incoming: "submissions",
    kept: "unique records",
    grouped: "Topics this week",
    complaint: "Complaint",
    praise: "Praise",
    queue: "Follow-up list",
    unanswered: "Needs a reply",
    followUp: "Dita opens the record to follow up",
    report: "Gmail · Weekly summary",
    current: "This week",
    previous: "Last week",
    total: "Total records",
    action: "Fajar adds one person to the lunch shift at Branch 2.",
    sample: "Example workflow",
  },
};

export const ulasanPelangganStory: UlasanCerita = {
  slug: "ulasan-pelanggan",
  id: {
    intro:
      "Ikuti masukan dari dua cabang restoran keluarga contoh sampai pemilik memilih tindakan dari ringkasan mingguan.",
    scenes: scenes(
      [
        [
          "Sebelum",
          "Dita membuka tiga kanal secara terpisah.",
          "Masukan dari dua cabang datang lewat formulir saran, chat layanan, dan email.",
        ],
        [
          "Kumpulkan masukan",
          "Masukan baru diperiksa pukul 10.00 WIB.",
          "Salah satu kiriman adalah UP-031 dari formulir Cabang 2. Pelanggan memberi 2 bintang dan menyebut waktu tunggu saat makan siang.",
        ],
        [
          "Seragamkan data",
          "Setiap catatan memakai format yang sama.",
          "Isi, tanggal, sumber, dan cabang mudah dilihat. Masukan chat tanpa bintang ditampilkan sebagai Tanpa rating.",
        ],
        [
          "Lewati duplikat",
          "Tujuh kiriman menjadi enam catatan unik.",
          "Dua salinan UP-031 berasal dari formulir yang sama. Salinan kedua dilewati agar keluhan dihitung satu kali.",
        ],
        [
          "Kelompokkan topik",
          "Waktu tunggu menjadi keluhan terbanyak.",
          "Enam catatan berisi tiga keluhan waktu tunggu di Cabang 2, dua pujian rasa, dan satu keluhan kebersihan.",
        ],
        [
          "Tandai belum dibalas",
          "Dita menemukan satu masukan yang perlu ditindaklanjuti.",
          "UP-031 masih berstatus Belum dibalas. Dita membuka catatan itu untuk menyiapkan tindak lanjut.",
        ],
        [
          "Kirim ringkasan",
          "Fajar melihat kenaikan keluhan pada jam makan siang.",
          "Ringkasan 16–22 Nov membandingkan minggu sebelumnya. Keluhan waktu tunggu Cabang 2 naik dari satu ke tiga. Fajar menambah satu staf pada jam makan siang.",
        ],
        [
          "Ringkasan",
          "Tim tahu topik yang perlu diperbaiki dan ulasan yang perlu dibalas.",
          "Satu tabel menyatukan catatan dari kanal yang tercakup. Ringkasan mingguan menunjukkan perubahan per topik.",
        ],
        [
          "Konsultasi",
          "Mau melihat pola masukan pelanggan tiap minggu?",
          "Bawa daftar kanal, topik yang ingin dipantau, dan nama penerima ringkasan.",
        ],
      ],
      "Langkah",
    ),
    stage: id,
  },
  en: {
    intro:
      "Follow feedback from two branches of a sample family restaurant until the owner acts on the weekly summary.",
    scenes: scenes(
      [
        [
          "Before",
          "Dita checks three channels separately.",
          "Feedback from two branches comes through a form, support chat and email.",
        ],
        [
          "Gather feedback",
          "New feedback is checked at 10:00 am WIB.",
          "One submission is UP-031 from the Branch 2 form. The customer gives 2 stars and mentions waiting at lunch.",
        ],
        [
          "Standardise the records",
          "Every record uses the same format.",
          "The text, date, source and branch are easy to see. A chat message without stars is marked No rating.",
        ],
        [
          "Skip duplicates",
          "Seven submissions become six unique records.",
          "Both copies of UP-031 come from the same form. The second is skipped so the complaint is counted once.",
        ],
        [
          "Group the topics",
          "Waiting time is the most common complaint.",
          "The six records include three waiting time complaints at Branch 2, two compliments on taste, and one cleanliness complaint.",
        ],
        [
          "Flag unanswered feedback",
          "Dita finds one item that needs a reply.",
          "UP-031 still needs a reply. Dita opens it to prepare her follow-up.",
        ],
        [
          "Send the summary",
          "Fajar sees more complaints about the lunch wait.",
          "The 16–22 Nov report compares the previous week. Waiting time complaints at Branch 2 rise from one to three. Fajar adds one person to the lunch shift.",
        ],
        [
          "Recap",
          "The team knows what to improve and what needs a reply.",
          "One table gathers feedback from the covered channels. The weekly summary shows what changed by topic.",
        ],
        [
          "Consultation",
          "Want to see customer feedback patterns each week?",
          "Bring your channel list, the topics to track and who should get the summary.",
        ],
      ],
      "Step",
    ),
    stage: en,
  },
};
