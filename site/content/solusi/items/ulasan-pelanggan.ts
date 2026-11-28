// S8 N1b (24 Nov 2026): rewritten from the public n8n.io templates 6112 (every day at 10.00 reviews from several
// sources are put in one format, duplicates removed and stored), 4032 (AI reads the collected reviews and pulls out
// recurring complaints and praise) and 9290 (a weekly report comparing this week with last week and the 12-week
// average, including how many reviews were answered). Status "ide": the client (set A, 24 Nov), quote and metrics
// are samples.
import type { Solusi } from "../schema";

export const ulasanPelanggan: Solusi = {
  slug: "ulasan-pelanggan",
  status: "ide",
  updated: "2026-11-24",
  industri: ["retail", "klinik", "jasa"],
  tim: ["cs", "manajemen"],
  apps: ["sheets", "gmail"],
  metricsKind: "example",
  id: {
    title: "Keluhan pelanggan terkumpul di satu tempat",
    seoTitle: "Rekap Keluhan dan Ulasan Pelanggan Mingguan Otomatis | Kreatekno",
    seoDescription:
      "Masukan dari formulir, chat, dan email terkumpul di satu tabel tanpa catatan ganda. Pemilik menerima ringkasan keluhan dan pujian teratas setiap minggu.",
    question: "Bagaimana pemilik usaha tahu keluhan pelanggan yang paling sering muncul?",
    result: "Pemilik melihat pola keluhan setiap minggu",
    summary:
      "Ulasan dan keluhan dari berbagai tempat terkumpul di satu tabel, dengan ringkasan topik teratas setiap minggu.",
    answer:
      "Setiap hari masukan dari formulir saran, chat layanan, dan email usaha dikumpulkan ke satu tabel. Isinya mencakup tanggal, sumber, cabang, dan rating bila tersedia. Catatan dengan sumber dan ID kiriman yang sama dihitung sekali. Setiap minggu pemilik menerima ringkasan keluhan dan pujian dari kanal yang tercakup, dibandingkan dengan minggu lalu. Staf menindaklanjuti ulasan yang ditandai.",
    client: "Restoran keluarga dua cabang (contoh)",
    painsLead:
      "Restoran keluarga dengan dua cabang menerima masukan lewat formulir, chat layanan, dan email. Setiap kanal dibaca orang yang berbeda. Pemilik kesulitan melihat ketika pelanggan di satu cabang berulang kali mengeluhkan waktu tunggu.",
    pains: [
      "Keluhan tercecer di chat, email, dan formulir.",
      "Pemilik tidak tahu masalah mana yang paling sering terjadi.",
      "Ulasan yang belum dibalas mudah terlewat.",
    ],
    built: {
      h: "Satu tabel ulasan dan satu ringkasan setiap minggu",
      lead: "Masukan dari kanal yang tercakup dikumpulkan setiap hari. Setiap minggu pemilik menerima ringkasan topik yang paling sering muncul.",
      points: [
        "Mengumpulkan masukan dari kanal yang tercakup setiap hari pukul 10.00 WIB.",
        "Menyeragamkan isi, tanggal, sumber, cabang, dan rating bila tersedia.",
        "Melewati kiriman yang sumber dan ID-nya sudah tercatat.",
        "Mengelompokkan keluhan dan pujian per topik, misalnya waktu tunggu, rasa, dan kebersihan.",
        "Mengirim ringkasan mingguan ke pemilik, dibandingkan dengan minggu lalu.",
        "Menandai ulasan yang belum dibalas supaya staf bisa membalasnya.",
      ],
    },
    quote: {
      text: "Ringkasan minggu lalu menunjukkan waktu tunggu dikeluhkan di cabang kedua. Kami menambah satu staf dapur, dan keluhannya turun.",
      by: "Pemilik restoran keluarga",
    },
    steps: [
      { title: "Ulasan dikumpulkan", body: "Dari beberapa tempat setiap hari, dalam format yang sama." },
      { title: "Keluhan terkumpul", body: "Dalam satu tabel, tanpa ulasan ganda." },
      { title: "Ringkasan mingguan", body: "Pemilik menerima topik keluhan dan pujian teratas." },
      { title: "Perbaikan diprioritaskan", body: "Staf fokus pada masalah yang paling sering muncul." },
    ],
    compare: [
      { aspect: "Melihat keluhan", before: "Tersebar di banyak tempat", after: "Satu tabel" },
      { aspect: "Menentukan prioritas", before: "Berdasarkan ingatan", after: "Berdasarkan ringkasan mingguan" },
      { aspect: "Ulasan belum dibalas", before: "Sering terlewat", after: "Ditandai untuk staf" },
    ],
    fit: [
      "Usaha dengan banyak interaksi pelanggan setiap hari.",
      "Usaha dengan beberapa cabang atau beberapa tempat ulasan.",
    ],
    notFit: ["Usaha yang keluhannya sangat jarang."],
    prep: [
      "Tempat ulasan dan saluran keluhan yang dipakai sekarang",
      "Topik keluhan yang ingin dipantau",
      "Siapa yang menerima ringkasan mingguan",
    ],
    metrics: [
      { value: "1", unit: "tabel", label: "untuk masukan dari kanal yang tercakup" },
      { value: "1", unit: "ringkasan", label: "topik keluhan dan pujian setiap minggu" },
      { value: "10.00", unit: "WIB", label: "ulasan baru dikumpulkan setiap hari" },
    ],
    faq: [
      {
        q: "Apakah keluhan dibalas otomatis?",
        a: "Tidak. Keluhan dan ulasan tetap dibalas staf. Sistem hanya mengumpulkan, mengelompokkan, dan menandai yang belum dibalas.",
      },
      {
        q: "Dari mana saja ulasan bisa dikumpulkan?",
        a: "Mulai dari formulir saran, chat layanan, dan email milik usahamu. Sumber eksternal dapat ditambahkan bila tersedia akses dan ketentuan sumber mengizinkan data diolah serta diringkas.",
      },
      {
        q: "Apakah ringkasan bisa dipisah per cabang?",
        a: "Bisa. Setiap ulasan dicatat dengan cabangnya, jadi ringkasan bisa dibuat per cabang atau gabungan.",
      },
    ],
  },
  en: {
    title: "Customer complaints gathered in one place",
    question: "How can an owner know which customer complaints come up most often?",
    result: "The owner sees complaint patterns every week",
    summary:
      "Reviews and complaints from many places are gathered in one table, with the top topics summarised weekly.",
    answer:
      "Feedback from your business's forms, support chat and email is gathered in one table each day. Each record includes the date, source, branch and a rating when available. Records with the same source and submission ID are counted once. Each week the owner gets the top complaints and praise from the covered channels, compared with the previous week. Staff follow up on flagged reviews.",
    client: "Family restaurant with two branches (sample)",
    painsLead:
      "A family restaurant with two branches receives feedback through forms, support chat and email. Different staff read each channel. The owner has trouble spotting repeated complaints about waiting time at one branch.",
    pains: [
      "Complaints are scattered across chat, email and forms.",
      "The owner does not know which problems happen most often.",
      "Unanswered reviews are easily missed.",
    ],
    built: {
      h: "One review table and one summary each week",
      lead: "Feedback from the covered channels is gathered daily. Each week the owner gets a summary of the most frequent topics.",
      points: [
        "Gathers feedback from the covered channels every day at 10 am WIB.",
        "Uses one format for text, date, source, branch and rating when available.",
        "Skips submissions whose source and ID are already recorded.",
        "Groups complaints and praise by topic, such as waiting time, taste and cleanliness.",
        "Sends the owner a weekly summary compared with the previous week.",
        "Flags reviews that have not been answered so staff can reply.",
      ],
    },
    quote: {
      text: "Last week's summary showed waiting time was the main complaint at our second branch. We added one kitchen staff member, and the complaints dropped.",
      by: "Family restaurant owner",
    },
    steps: [
      { title: "Reviews gathered", body: "From several places every day, in the same format." },
      { title: "Complaints collected", body: "In one table, with no duplicate reviews." },
      { title: "Weekly summary", body: "The owner receives the top complaint and praise topics." },
      { title: "Fixes prioritised", body: "Staff focus on the problems that come up most." },
    ],
    compare: [
      { aspect: "Seeing complaints", before: "Spread across many places", after: "One table" },
      { aspect: "Setting priorities", before: "Based on memory", after: "Based on the weekly summary" },
      { aspect: "Unanswered reviews", before: "Often missed", after: "Flagged for staff" },
    ],
    fit: [
      "Businesses with many customer interactions every day.",
      "Businesses with several branches or several review sites.",
    ],
    notFit: ["Businesses that rarely receive complaints."],
    prep: [
      "The review sites and complaint channels you use now",
      "The complaint topics you want to track",
      "Who receives the weekly summary",
    ],
    metrics: [
      { value: "1", unit: "table", label: "for feedback from the covered channels" },
      { value: "1", unit: "summary", label: "of complaint and praise topics each week" },
      { value: "10", unit: "am", label: "new reviews are gathered every day" },
    ],
    faq: [
      {
        q: "Are complaints answered automatically?",
        a: "No. Complaints and reviews are still answered by your staff. The system only gathers, groups and flags the unanswered ones.",
      },
      {
        q: "Where can reviews be gathered from?",
        a: "Start with your business's feedback forms, support chat and email. External sources can be added when access is available and the source allows processing and summarising its data.",
      },
      {
        q: "Can the summary be split by branch?",
        a: "Yes. Each review is recorded with its branch, so summaries can be per branch or combined.",
      },
    ],
  },
};
