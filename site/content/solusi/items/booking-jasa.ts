// Source: Solusi v1 COPY 19, rewritten 21 Nov 2026 (BJ1) to match the real booking workflow of a home-cleaning
// client: bookings are kept in a schedule table and reported to the team group (no calendar app), and every
// reschedule or cancellation is approved by the team. The client stays anonymous; metrics remain examples.
import type { Solusi } from "../schema";

export const bookingJasa: Solusi = {
  slug: "booking-jasa",
  status: "jalan",
  updated: "2026-11-21",
  industri: ["jasa"],
  tim: ["cs", "operasional"],
  apps: ["whatsapp", "sheets"],
  metricsKind: "example",
  id: {
    title: "Booking jasa langsung dari chat pelanggan",
    question: "Bagaimana usaha jasa menerima booking dari WhatsApp tanpa admin standby?",
    result: "Booking terkonfirmasi tanpa menunggu admin",
    summary:
      "Pelanggan memilih jam yang masih kosong langsung di chat, lalu booking tercatat otomatis di jadwal tim Anda.",
    answer:
      "Asisten booking menjawab pelanggan di WhatsApp, menyebut harga dari daftar layanan, mengecek jam yang masih kosong, lalu mencatat booking ke jadwal tim. Permintaan khusus dan perubahan jadwal diteruskan ke tim lengkap dengan ringkasan chat, sehingga pelanggan tidak perlu mengulang ceritanya.",
    client: "Usaha jasa kebersihan rumah",
    painsLead:
      "Hampir semua pelanggan menghubungi lewat chat untuk bertanya harga dan jam kosong. Admin harus membalas satu per satu sambil mengatur jadwal tim lapangan.",
    pains: [
      "Pelanggan menunggu berjam-jam hanya untuk tahu jadwal yang tersedia.",
      "Jadwal tim lapangan sering bentrok karena dicatat di beberapa tempat.",
      "Chat di malam hari baru dibalas keesokan paginya.",
    ],
    built: {
      h: "Chat tetap sama, jadwalnya tercatat sendiri",
      lead: "Pelanggan tetap menghubungi nomor usaha seperti biasa. Di belakang nomor itu, asisten menjawab dari daftar layanan, mengecek jadwal dengan aturan yang pasti, lalu mencatat booking yang sudah lengkap ke jadwal tim.",
      points: [
        "Menyebut harga dan ketentuan hanya dari daftar layanan usaha Anda, tanpa menebak.",
        "Mengecek jadwal dengan aturan tetap: minimal sehari sebelumnya, selesai dalam jam kerja, dan tidak bentrok.",
        "Mencatat booking setelah pelanggan mengirim lokasi, lalu melaporkannya ke grup tim dengan ringkasan chat.",
        "Meneruskan pindah jadwal dan pembatalan ke tim. Tim cukup menekan Ya atau Tidak, dan pelanggan dikabari otomatis.",
        "Berhenti membalas saat admin mengambil alih chat dari HP, supaya pelanggan tidak menerima dua jawaban.",
      ],
    },
    quote: {
      text: "Dulu chat malam baru saya balas besok pagi. Sekarang pagi-pagi saya tinggal melihat jadwal yang sudah terisi.",
      by: "Pemilik usaha jasa kebersihan rumah",
    },
    steps: [
      {
        title: "Pelanggan bertanya lewat chat",
        body: "Pelanggan menghubungi nomor usaha seperti biasa, kapan saja.",
      },
      {
        title: "Asisten menjawab dan menawarkan jadwal",
        body: "Harga diambil dari daftar layanan, dan pelanggan memilih dari jam yang memang masih kosong.",
      },
      {
        title: "Booking masuk ke jadwal tim",
        body: "Tim melihat booking baru di tabel jadwal dan menerima laporannya di grup tim.",
      },
      {
        title: "Tim memutuskan yang khusus",
        body: "Perubahan jadwal dan permintaan di luar kebiasaan diteruskan ke tim dengan ringkasannya.",
      },
    ],
    compare: [
      {
        aspect: "Konfirmasi jadwal",
        before: "Menunggu admin membalas",
        after: "Dijawab saat itu juga",
      },
      {
        aspect: "Jadwal tim",
        before: "Dicatat di beberapa tempat",
        after: "Satu tabel jadwal bersama",
      },
      {
        aspect: "Chat malam hari",
        before: "Dibalas besok pagi",
        after: "Dilayani malam itu juga",
      },
    ],
    fit: [
      "Usaha jasa dengan tim lapangan dan jadwal kunjungan.",
      "Usaha yang sebagian besar pelanggannya menghubungi lewat WhatsApp.",
    ],
    notFit: ["Jasa yang harganya selalu dinegosiasi kasus per kasus."],
    prep: [
      "Daftar layanan, harga, dan perkiraan durasinya",
      "Jam kerja dan kapasitas tim per hari",
      "Tabel jadwal tim, atau kami yang buatkan",
    ],
    metrics: [
      {
        value: "24",
        unit: "jam",
        label: "asisten aktif, pelanggan bisa booking kapan saja",
      },
      {
        value: "0",
        unit: "bentrok",
        label: "jadwal ganda sejak memakai satu tabel jadwal",
      },
      {
        value: "5",
        unit: "menit",
        label: "rata-rata sampai booking terkonfirmasi",
      },
    ],
    faq: [
      {
        q: "Apakah pelanggan tahu sedang dilayani asisten?",
        a: "Ya. Kalau ditanya, asisten menjawab jujur bahwa ia asisten virtual, dan pelanggan bisa menelepon nomor yang sama untuk bicara dengan admin.",
      },
      {
        q: "Bagaimana kalau pelanggan membatalkan atau pindah jadwal?",
        a: "Permintaannya diteruskan ke tim. Setelah tim menekan Ya, jadwal diperbarui, slot lama kembali kosong, dan pelanggan dikabari otomatis.",
      },
      {
        q: "Bisakah booking untuk hari yang sama?",
        a: "Tidak lewat asisten. Booking minimal sehari sebelumnya, supaya tim sempat menyiapkan petugas. Aturan ini bisa disesuaikan dengan usaha Anda.",
      },
    ],
  },
  en: {
    title: "Service bookings straight from customer chats",
    question: "How can a service business take WhatsApp bookings without an admin on standby?",
    result: "Bookings confirmed without waiting for an admin",
    summary: "Customers pick a free time in the chat, and the booking lands in your team schedule automatically.",
    answer:
      "A booking assistant answers customers on WhatsApp, quotes prices from your service list, checks which times are still free, and records the booking in the team schedule. Special requests and schedule changes go to the team with a chat summary, so customers never have to repeat themselves.",
    client: "Home-cleaning service business",
    painsLead:
      "Almost every customer gets in touch by chat to ask about prices and free times. The admin replied one by one while also juggling the field team's schedule.",
    pains: [
      "Customers waited hours just to learn which times were available.",
      "The field team's schedule often clashed because it lived in several places.",
      "Late-night chats were only answered the next morning.",
    ],
    built: {
      h: "Same chat, a schedule that fills itself",
      lead: "Customers keep contacting the business number as usual. Behind that number, the assistant answers from the service list, checks the schedule with fixed rules, and records complete bookings in the team schedule.",
      points: [
        "Quotes prices and terms only from your own service list, never guesses.",
        "Checks the schedule with fixed rules: a day's notice, finished within working hours, and no clashes.",
        "Records the booking once the customer shares a location, then reports it to the team group with a chat summary.",
        "Passes reschedules and cancellations to the team. The team taps Yes or No, and the customer is told automatically.",
        "Stops replying when an admin takes over the chat from their phone, so customers never get two answers.",
      ],
    },
    quote: {
      text: "Late-night chats used to wait until the next morning. Now I start the day looking at a schedule that is already filled in.",
      by: "Owner of a home-cleaning service business",
    },
    steps: [
      {
        title: "The customer asks in the chat",
        body: "Customers contact the business number as usual, at any time.",
      },
      {
        title: "The assistant answers and offers times",
        body: "Prices come from the service list, and customers choose from times that are actually free.",
      },
      {
        title: "The booking lands in the team schedule",
        body: "The team sees the new booking in the schedule table and gets a report in the team group.",
      },
      {
        title: "The team decides special cases",
        body: "Schedule changes and unusual requests go to the team with a summary.",
      },
    ],
    compare: [
      {
        aspect: "Confirming a time",
        before: "Waiting for an admin to reply",
        after: "Answered on the spot",
      },
      {
        aspect: "Team schedule",
        before: "Kept in several places",
        after: "One shared schedule table",
      },
      {
        aspect: "Late-night chats",
        before: "Answered the next morning",
        after: "Handled that same night",
      },
    ],
    fit: [
      "Service businesses with a field team and scheduled visits.",
      "Businesses whose customers mostly get in touch on WhatsApp.",
    ],
    notFit: ["Services whose price is always negotiated case by case."],
    prep: [
      "Your service list with prices and typical durations",
      "Working hours and daily team capacity",
      "The team schedule table, or we set one up",
    ],
    metrics: [
      {
        value: "24",
        unit: "hrs",
        label: "assistant active, customers can book at any time",
      },
      {
        value: "0",
        unit: "clashes",
        label: "double bookings since moving to one schedule table",
      },
      {
        value: "5",
        unit: "min",
        label: "average time until a booking is confirmed",
      },
    ],
    faq: [
      {
        q: "Do customers know they are talking to an assistant?",
        a: "Yes. When asked, the assistant says honestly that it is a virtual assistant, and customers can call the same number to talk to an admin.",
      },
      {
        q: "What if a customer cancels or reschedules?",
        a: "The request goes to the team. Once the team taps Yes, the schedule is updated, the old slot opens up again and the customer is told automatically.",
      },
      {
        q: "Can customers book for the same day?",
        a: "Not through the assistant. Bookings need a day's notice so the team can prepare staff. This rule can be adjusted for your business.",
      },
    ],
  },
};
