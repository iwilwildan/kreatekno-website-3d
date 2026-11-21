// Source: Solusi v1 COPY 19, rewritten 21 Nov 2026 (CK1) to match the customer-service agent workflow on the
// n8n-mcp instance: chat in, an AI agent that remembers each number's conversation, a price lookup in the
// service table, a calendar check that offers at most three other times, a calendar booking, and the reply
// sent while the chat summary is saved to a patient table. The workflow serves another business, so the status
// stays "ide" and the clinic, quote and metrics are samples. Passing medical questions to the staff is a design
// step for clinics that the workflow does not have yet, and the copy says so.
import type { Solusi } from "../schema";

export const csKlinik: Solusi = {
  slug: "cs-klinik",
  status: "ide",
  updated: "2026-11-21",
  industri: ["klinik"],
  tim: ["cs"],
  apps: ["whatsapp", "calendar", "sheets"],
  metricsKind: "example",
  id: {
    title: "Pertanyaan pasien terjawab di luar jam kerja",
    question: "Bagaimana klinik menjawab chat pasien di malam hari tanpa menambah staf?",
    result: "Chat pasien dibalas kapan saja, janji temu tersusun sebelum klinik buka",
    summary:
      "Pertanyaan harga dan jadwal dijawab dari data klinik, janji temu dicatat, dan pertanyaan medis diteruskan ke staf.",
    answer:
      "Asisten CS membalas chat pasien kapan saja, termasuk setelah klinik tutup. Harga diambil dari tabel layanan klinik dan jadwal dicek sampai seminggu ke depan. Kalau jam yang diminta penuh, pasien mendapat paling banyak tiga pilihan jam lain, lalu janji temu masuk ke kalender klinik. Setiap percakapan diringkas di tabel pasien, dan pertanyaan medis diteruskan ke staf.",
    client: "Klinik gigi (contoh)",
    painsLead:
      "Sebagian besar chat pasien berisi pertanyaan yang sama: harga, jam praktik, dan jadwal kosong. Chat yang masuk setelah klinik tutup baru dibalas keesokan paginya, dan sebagian pasien sudah memilih klinik lain.",
    pains: [
      "Admin menjawab pertanyaan yang sama puluhan kali sehari.",
      "Chat yang masuk malam hari baru dibalas keesokan paginya.",
      "Janji temu dicatat manual dari chat, sehingga jadwal mudah bentrok.",
    ],
    built: {
      h: "Satu asisten CS yang menjawab dari data klinik sendiri",
      lead: "Klinik cukup menyiapkan tabel layanan dan jadwal praktik. Asisten membaca setiap chat pasien, menjawab dengan data itu, lalu mencatat janji temu dan ringkasan percakapannya.",
      points: [
        "Membalas chat pasien kapan saja dengan bahasa yang sopan dan singkat.",
        "Mengingat percakapan dengan setiap nomor, sehingga pasien tidak perlu mengulang.",
        "Mengambil harga dari tabel layanan klinik, tidak pernah menebak angka.",
        "Mengecek jadwal sampai seminggu ke depan dan menawarkan paling banyak tiga jam lain saat jadwal penuh.",
        "Mencatat janji temu di kalender dan ringkasan chat di tabel pasien.",
        "Rancangan untuk klinik: pertanyaan medis diteruskan ke staf, yang membalas dari nomor yang sama.",
      ],
    },
    quote: {
      text: "Dulu pagi kami habis untuk membalas chat semalam. Sekarang admin tinggal mengecek janji temu yang sudah tercatat.",
      by: "Admin klinik gigi",
    },
    steps: [
      {
        title: "Pasien bertanya lewat chat",
        body: "Lewat nomor WhatsApp klinik yang sudah dikenal pasien, kapan saja.",
      },
      {
        title: "Asisten menjawab dari data klinik",
        body: "Harga dari tabel layanan, jam kosong dari jadwal klinik.",
      },
      {
        title: "Janji temu tercatat",
        body: "Pasien memilih jam, janji temu masuk ke kalender, dan ringkasan chat masuk ke tabel pasien.",
      },
      {
        title: "Staf menangani pertanyaan medis",
        body: "Rancangan untuk klinik: pertanyaan medis tidak dijawab asisten dan diteruskan ke staf.",
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
        after: "Dibalas saat chat masuk",
      },
      {
        aspect: "Janji temu",
        before: "Dicatat manual dari chat",
        after: "Masuk ke kalender klinik",
      },
    ],
    fit: [
      "Klinik yang menerima banyak pertanyaan berulang lewat WhatsApp.",
      "Klinik dengan jadwal praktik per jam, seperti klinik gigi atau kecantikan.",
    ],
    notFit: ["Layanan yang membutuhkan diagnosis lewat chat."],
    prep: [
      "Daftar layanan dan harga",
      "Jadwal praktik dan durasi setiap layanan",
      "Pertanyaan yang paling sering diajukan pasien",
    ],
    metrics: [
      {
        value: "1",
        unit: "menit",
        label: "balasan pertama, termasuk malam hari",
      },
      {
        value: "3",
        unit: "pilihan jam",
        label: "ditawarkan saat jadwal penuh",
      },
      {
        value: "1",
        unit: "baris",
        label: "catatan per pasien, dengan ringkasan chat",
      },
    ],
    faq: [
      {
        q: "Apakah asisten memberi saran medis?",
        a: "Tidak. Dalam rancangan untuk klinik, pertanyaan medis tidak dijawab asisten dan selalu diteruskan ke staf klinik.",
      },
      {
        q: "Apakah pasien bisa bicara dengan manusia?",
        a: "Bisa. Staf membalas dari nomor WhatsApp yang sama, dan ringkasan chat pasien tetap tersimpan di tabel.",
      },
      {
        q: "Bagaimana kalau harga atau jadwal berubah?",
        a: "Cukup ubah tabel layanan dan jadwal klinik. Asisten selalu membaca data terbaru saat menjawab.",
      },
    ],
  },
  en: {
    title: "Patient questions answered after hours",
    question: "How can a clinic answer patient chats at night without adding staff?",
    result: "Patient chats are answered at any hour, and appointments are lined up before the clinic opens",
    summary:
      "Price and schedule questions are answered from clinic data, appointments are booked, and medical questions go to staff.",
    answer:
      "The customer-service assistant replies to patient chats at any hour, including after the clinic closes. Prices come from the clinic's service table and the schedule is checked up to a week ahead. If the requested time is taken, the patient gets at most three other times, and the appointment then goes into the clinic calendar. Every conversation is summarised in the patient table, and medical questions are passed to the staff.",
    client: "Dental clinic (sample)",
    painsLead:
      "Most patient chats ask the same things: prices, opening hours and free slots. Chats that arrived after closing were answered the next morning, and some patients had already chosen another clinic.",
    pains: [
      "The admin answers the same questions dozens of times a day.",
      "Chats that arrive at night are answered the next morning.",
      "Appointments are copied from chats by hand, so the schedule easily clashes.",
    ],
    built: {
      h: "One customer-service assistant that answers from the clinic's own data",
      lead: "The clinic only prepares its service table and practice schedule. The assistant reads every patient chat, answers with that data, then records the appointment and a summary of the conversation.",
      points: [
        "Replies to patient chats at any hour, politely and briefly.",
        "Remembers the conversation with each number, so patients do not repeat themselves.",
        "Takes prices from the clinic's service table and never guesses a figure.",
        "Checks the schedule up to a week ahead and offers at most three other times when it is full.",
        "Records the appointment in the calendar and the chat summary in the patient table.",
        "Designed for clinics: medical questions go to the staff, who reply from the same number.",
      ],
    },
    quote: {
      text: "Our mornings used to go on answering last night's chats. Now the admin only checks the appointments that are already recorded.",
      by: "Dental clinic admin",
    },
    steps: [
      {
        title: "Patients ask by chat",
        body: "Through the clinic WhatsApp number patients already know, at any hour.",
      },
      {
        title: "The assistant answers from clinic data",
        body: "Prices from the service table, free times from the clinic schedule.",
      },
      {
        title: "The appointment is recorded",
        body: "The patient picks a time, the appointment goes into the calendar and the chat summary into the patient table.",
      },
      {
        title: "Staff handle medical questions",
        body: "Designed for clinics: the assistant does not answer medical questions and passes them to the staff.",
      },
    ],
    compare: [
      {
        aspect: "Routine questions",
        before: "Answered one by one by the admin",
        after: "Answered right away",
      },
      {
        aspect: "Night-time chats",
        before: "Answered the next morning",
        after: "Answered when the chat arrives",
      },
      {
        aspect: "Appointments",
        before: "Copied from chats by hand",
        after: "Added to the clinic calendar",
      },
    ],
    fit: [
      "Clinics that receive many repeated questions on WhatsApp.",
      "Clinics with hourly practice slots, such as dental or beauty clinics.",
    ],
    notFit: ["Services that require a diagnosis by chat."],
    prep: [
      "A list of services and prices",
      "The practice schedule and the length of each service",
      "The questions patients ask most often",
    ],
    metrics: [
      {
        value: "1",
        unit: "min",
        label: "to the first reply, also at night",
      },
      {
        value: "3",
        unit: "time options",
        label: "offered when the schedule is full",
      },
      {
        value: "1",
        unit: "row",
        label: "per patient, with a chat summary",
      },
    ],
    faq: [
      {
        q: "Does the assistant give medical advice?",
        a: "No. In the design for clinics, the assistant does not answer medical questions and always passes them to the clinic staff.",
      },
      {
        q: "Can patients talk to a person?",
        a: "Yes. Staff reply from the same WhatsApp number, and the patient's chat summary stays in the table.",
      },
      {
        q: "What if prices or the schedule change?",
        a: "Just update the service table and the clinic schedule. The assistant always reads the latest data when it answers.",
      },
    ],
  },
};
