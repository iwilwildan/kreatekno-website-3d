// Source: Solusi v1 COPY 19, rewritten 21 Nov 2026 (RK1) to match the content-research workflow design on the
// n8n-kreatekno instance: one topic per morning and evening session, AI trend research, the most-liked posts,
// AI reading of audience complaints and content angles, a research table and a team approve/skip. The workflow
// has not run yet, so the status is "ide" and the client, quote and metrics are samples.
import type { Solusi } from "../schema";

export const risetKonten: Solusi = {
  slug: "riset-konten",
  status: "ide",
  updated: "2026-11-21",
  industri: ["retail", "jasa", "klinik"],
  tim: ["marketing"],
  apps: ["threads", "sheets"],
  metricsKind: "example",
  id: {
    title: "Riset konten otomatis dari tren media sosial",
    question: "Bagaimana tim marketing tahu apa yang sedang dibicarakan audiens tanpa riset manual?",
    result: "Riset konten siap dipakai setiap pagi dan malam",
    summary:
      "Setiap pagi dan malam, satu topik usaha Anda diriset dari tren dan post yang ramai, lalu dirangkum untuk tim.",
    answer:
      "Setiap pagi dan malam, satu topik dari daftar topik usaha Anda diriset secara bergiliran. AI merangkum tren terbaru seputar topik itu, post yang paling banyak disukai dikumpulkan, lalu AI membaca keluhan audiens dan sudut konten yang bisa dipakai. Hasilnya tersimpan sebagai satu baris di tabel riset dan dikirim ke grup tim, lalu tim memilih Setuju atau Lewati.",
    client: "Brand edukasi bisnis (contoh)",
    painsLead:
      "Tim marketing tahu harus posting rutin, tetapi ide konten dicari dari nol setiap minggu. Riset dilakukan sambil membuka puluhan post satu per satu, dan hasilnya jarang tercatat.",
    pains: [
      "Tim marketing menghabiskan berjam-jam mencari ide sebelum mulai menulis.",
      "Konten dibuat berdasarkan tebakan, bukan yang sedang dibicarakan audiens.",
      "Hasil riset tersimpan di catatan pribadi, sehingga tim sulit memakainya lagi.",
    ],
    built: {
      h: "Satu topik diriset dua kali sehari, tim tinggal memilih",
      lead: "Anda menentukan daftar topik yang dekat dengan usaha dan audiens Anda. Di setiap sesi, satu topik diriset dari tren terbaru dan post yang paling ramai, lalu hasilnya dirangkum menjadi bahan yang siap ditulis tim.",
      points: [
        "Menggilir topik setiap pagi dan malam, sehingga semua topik Anda diriset secara rutin.",
        "Merangkum tren terbaru, isu yang ramai, dan perubahan cara pandang seputar topik itu.",
        "Mengumpulkan post dengan suka terbanyak dari akun yang paling aktif membahas topik itu.",
        "Membaca keluhan audiens, sudut konten yang bisa dipakai, dan skor seberapa ramai topiknya.",
        "Menyimpan setiap riset di satu tabel dan mengirim ringkasannya ke grup tim untuk disetujui atau dilewati.",
      ],
    },
    quote: {
      text: "Dulu rapat konten dimulai dengan pertanyaan mau membahas apa. Sekarang kami mulai dari keluhan audiens yang sudah dirangkum.",
      by: "Tim marketing brand edukasi bisnis",
    },
    steps: [
      {
        title: "Topik dipilih bergiliran",
        body: "Daftar topik usaha Anda diriset bergantian, satu topik setiap pagi dan malam.",
      },
      {
        title: "Tren dirangkum",
        body: "AI merangkum pembahasan terbaru, lalu post yang paling banyak disukai dikumpulkan.",
      },
      {
        title: "Pola audiens dibaca",
        body: "AI mencatat keluhan audiens, sudut konten, dan skor seberapa ramai topiknya.",
      },
      {
        title: "Tim memilih",
        body: "Ringkasan riset masuk ke grup tim. Riset yang disetujui siap ditulis.",
      },
    ],
    compare: [
      {
        aspect: "Mencari ide",
        before: "Berjam-jam setiap minggu",
        after: "Riset siap setiap pagi dan malam",
      },
      {
        aspect: "Dasar ide",
        before: "Tebakan",
        after: "Keluhan audiens yang sedang ramai",
      },
      {
        aspect: "Hasil riset",
        before: "Tersimpan di catatan pribadi",
        after: "Satu tabel riset untuk seluruh tim",
      },
    ],
    fit: [
      "Usaha yang ingin posting rutin tapi kehabisan ide.",
      "Tim marketing kecil tanpa waktu riset.",
      "Brand yang kontennya menjawab masalah audiens, seperti edukasi atau jasa.",
    ],
    notFit: ["Brand yang kontennya sepenuhnya mengikuti kampanye dari kantor pusat."],
    prep: [
      "Daftar topik yang dekat dengan usaha dan audiens Anda",
      "Kata kunci atau akun referensi, kalau sudah ada",
      "Grup tim untuk menerima ringkasan riset",
    ],
    metrics: [
      {
        value: "14",
        unit: "riset",
        label: "setiap minggu, pagi dan malam",
      },
      {
        value: "10",
        unit: "post",
        label: "teratas dibaca di setiap riset",
      },
      {
        value: "4",
        unit: "jam",
        label: "riset manual per minggu yang tidak perlu lagi",
      },
    ],
    faq: [
      {
        q: "Apakah kontennya ditulis otomatis?",
        a: "Tidak. Yang disiapkan adalah riset: keluhan audiens, sudut konten, dan kata kuncinya. Tim Anda yang menulis dengan gaya brand.",
      },
      {
        q: "Media sosial apa yang dibaca?",
        a: "Post yang dibaca saat ini berasal dari Threads. Hasil risetnya bisa dipakai untuk konten di platform mana pun yang Anda gunakan.",
      },
      {
        q: "Bagaimana kalau topik yang diriset tidak cocok?",
        a: "Tim cukup memilih Lewati. Daftar topik dan jam sesinya juga bisa diubah sesuai kebutuhan usaha Anda.",
      },
    ],
  },
  en: {
    title: "Automatic content research from social media trends",
    question: "How can a marketing team know what its audience is talking about without manual research?",
    result: "Content research ready every morning and evening",
    summary:
      "Every morning and evening, one of your topics is researched from trends and popular posts, then summarised for the team.",
    answer:
      "Every morning and evening, one topic from your topic list is researched in turn. AI summarises the latest trends around that topic, the most-liked posts are collected, and AI then reads the audience's complaints and the content angles worth using. The result is saved as one row in the research table and sent to the team group, where the team chooses Approve or Skip.",
    client: "Business education brand (sample)",
    painsLead:
      "The marketing team knew it had to post regularly, but content ideas started from scratch every week. Research meant opening dozens of posts one by one, and the findings were rarely written down.",
    pains: [
      "The marketing team spent hours looking for ideas before writing anything.",
      "Content was based on guesses, not on what the audience was actually discussing.",
      "Research notes lived in personal notes, so the team could hardly reuse them.",
    ],
    built: {
      h: "One topic researched twice a day, the team only picks",
      lead: "You set a list of topics close to your business and audience. In every session, one topic is researched from the latest trends and the most popular posts, and the result is summarised into material the team can write from.",
      points: [
        "Rotates topics every morning and evening, so every topic on your list is researched regularly.",
        "Summarises the latest trends, hot issues and shifts in opinion around that topic.",
        "Collects the most-liked posts from the accounts that discuss the topic most.",
        "Reads the audience's complaints, usable content angles and a score for how hot the topic is.",
        "Saves every research run in one table and sends its summary to the team group to approve or skip.",
      ],
    },
    quote: {
      text: "Content meetings used to start with the question of what to talk about. Now we start from the audience complaints that are already summarised.",
      by: "Marketing team of a business education brand",
    },
    steps: [
      {
        title: "Topics take turns",
        body: "Your topic list is researched in turn, one topic every morning and evening.",
      },
      {
        title: "Trends are summarised",
        body: "AI summarises the latest discussion, then the most-liked posts are collected.",
      },
      {
        title: "Audience patterns are read",
        body: "AI notes the audience's complaints, content angles and how hot the topic is.",
      },
      {
        title: "The team picks",
        body: "The research summary reaches the team group. Approved research is ready to write.",
      },
    ],
    compare: [
      {
        aspect: "Finding ideas",
        before: "Hours every week",
        after: "Research ready every morning and evening",
      },
      {
        aspect: "Basis for ideas",
        before: "Guesswork",
        after: "Audience complaints that are trending",
      },
      {
        aspect: "Research notes",
        before: "Kept in personal notes",
        after: "One research table for the whole team",
      },
    ],
    fit: [
      "Businesses that want to post regularly but run out of ideas.",
      "Small marketing teams with no time for research.",
      "Brands whose content answers audience problems, such as education or services.",
    ],
    notFit: ["Brands whose content entirely follows campaigns from head office."],
    prep: [
      "A list of topics close to your business and audience",
      "Keywords or reference accounts, if you already have them",
      "A team group to receive the research summaries",
    ],
    metrics: [
      {
        value: "14",
        unit: "runs",
        label: "of research every week, morning and evening",
      },
      {
        value: "10",
        unit: "posts",
        label: "top posts read in every run",
      },
      {
        value: "4",
        unit: "hrs",
        label: "of manual research a week no longer needed",
      },
    ],
    faq: [
      {
        q: "Is the content written automatically?",
        a: "No. What you get is research: audience complaints, content angles and keywords. Your team writes in the brand's own voice.",
      },
      {
        q: "Which social media does it read?",
        a: "The posts it reads currently come from Threads. The research can be used for content on any platform you use.",
      },
      {
        q: "What if a researched topic does not fit?",
        a: "The team simply chooses Skip. The topic list and session times can also be changed to suit your business.",
      },
    ],
  },
};
