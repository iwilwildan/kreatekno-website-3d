// Source: Solusi v1 COPY 19, rewritten 21 Nov 2026 (BJ1) to match the real booking workflow of a home-cleaning
// client: bookings are kept in a schedule table and reported to the team group (no calendar app), and every
// reschedule or cancellation is approved by the team. The client stays anonymous; metrics remain examples.
// BJ2 (28 Nov 2026): approval, staff takeover and the AI summary of the takeover chat are spelled out.
import type { Solusi } from "../schema";

export const bookingJasa: Solusi = {
  slug: "booking-jasa",
  status: "jalan",
  updated: "2026-11-28",
  industri: ["jasa"],
  tim: ["cs", "operasional"],
  apps: ["whatsapp", "sheets"],
  metricsKind: "example",
  id: {
    title: "Pelanggan booking jasa lewat chat, jadwal tercatat sendiri",
    seoTitle: "Chatbot WhatsApp untuk Booking Jasa dan Jadwal Otomatis | Kreatekno",
    seoDescription:
      "Pelanggan bertanya harga dan memilih jam kosong lewat WhatsApp, lalu booking tercatat di jadwal. Perubahan diputuskan staf, dan staf bisa ambil alih chat.",
    question: "Bagaimana usaha jasa menerima booking dari chat tanpa staf berjaga terus?",
    result: "Booking terkonfirmasi tanpa menunggu staf",
    summary: "Pelanggan memilih jam yang masih kosong di chat, lalu booking tercatat otomatis di jadwal stafmu.",
    answer:
      "AI menjawab pelanggan di chat, menyebut harga dari daftar layanan, dan menawarkan jam yang masih kosong. Jadwal dicek dengan aturan tetap: minimal sehari sebelumnya, selesai dalam jam kerja, dan tidak bentrok. Booking yang lengkap dicatat ke jadwal staf. Pindah jadwal, pembatalan, dan booking di luar jam biasa diputuskan staf dengan tombol Ya atau Tidak. Staf juga bisa membalas sendiri kapan saja, dan AI langsung diam.",
    client: "Usaha jasa kebersihan rumah",
    painsLead:
      "Hampir semua pelanggan menghubungi lewat chat untuk bertanya harga dan jam kosong. Staf harus membalas satu per satu sambil mengatur jadwal petugas lapangan.",
    pains: [
      "Pelanggan menunggu berjam-jam hanya untuk tahu jadwal yang tersedia.",
      "Jadwal petugas lapangan sering bentrok karena dicatat di beberapa tempat.",
      "Chat di malam hari baru dibalas keesokan paginya.",
    ],
    built: {
      h: "Chat tetap sama, jadwalnya tercatat sendiri",
      lead: "Pelanggan tetap menghubungi nomor usaha seperti biasa. Di belakang nomor itu, AI menjawab dari daftar layanan, mengecek jadwal dengan aturan yang pasti, lalu mencatat booking yang sudah lengkap ke jadwal staf.",
      points: [
        "Menyebut harga dan ketentuan hanya dari daftar layanan usahamu, tanpa menebak.",
        "Mengecek jadwal dengan aturan tetap: minimal sehari sebelumnya, selesai dalam jam kerja, dan tidak bentrok.",
        "Mencatat booking setelah pelanggan mengirim lokasi, lalu melaporkannya ke grup staf dengan ringkasan chat.",
        "Meneruskan pindah jadwal, pembatalan, dan booking di luar jam biasa ke grup staf beserta alasannya. Tombol Ya atau Tidak yang pertama ditekan yang berlaku, dan pelanggan dikabari otomatis.",
        "Berhenti membalas selama 30 menit begitu staf mengambil alih chat dari HP, supaya pelanggan tidak menerima dua jawaban. Grup staf diingatkan kalau pelanggan menunggu terlalu lama.",
        "Merangkum chat yang ditangani staf menjadi satu usulan bertombol, jadi jadwal ikut diperbarui tanpa diketik ulang.",
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
        title: "AI menjawab dan menawarkan jadwal",
        body: "Harga diambil dari daftar layanan, dan pelanggan memilih dari jam yang memang masih kosong.",
      },
      {
        title: "Booking masuk ke jadwal staf",
        body: "Staf melihat booking baru di tabel jadwal dan menerima laporannya di grup staf.",
      },
      {
        title: "Staf memutuskan dengan satu tombol",
        body: "Pindah jadwal, pembatalan, dan permintaan di luar kebiasaan masuk ke grup staf dengan ringkasannya.",
      },
      {
        title: "Staf bisa mengambil alih chat",
        body: "Staf membalas langsung dari HP dan AI diam. Hasil chatnya dirangkum menjadi usulan yang tinggal disetujui.",
      },
    ],
    compare: [
      {
        aspect: "Konfirmasi jadwal",
        before: "Menunggu staf membalas",
        after: "Dijawab saat itu juga",
      },
      {
        aspect: "Jadwal petugas",
        before: "Dicatat di beberapa tempat",
        after: "Satu tabel jadwal bersama",
      },
      {
        aspect: "Chat malam hari",
        before: "Dibalas besok pagi",
        after: "Dilayani malam itu juga",
      },
      {
        aspect: "Perubahan jadwal",
        before: "Dicatat ulang satu per satu",
        after: "Satu tombol, jadwal ikut berubah",
      },
    ],
    fit: [
      "Usaha jasa dengan petugas lapangan dan jadwal kunjungan.",
      "Usaha yang sebagian besar pelanggannya menghubungi lewat chat.",
    ],
    notFit: ["Jasa yang harganya selalu dinegosiasi kasus per kasus."],
    prep: [
      "Daftar layanan, harga, dan perkiraan durasinya",
      "Jam kerja dan kapasitas petugas per hari",
      "Tabel jadwal petugas, atau kami yang buatkan",
    ],
    metrics: [
      {
        value: "24",
        unit: "jam",
        label: "AI aktif, pelanggan bisa booking kapan saja",
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
        q: "Apakah pelanggan tahu sedang dilayani AI?",
        a: "Ya. Kalau ditanya, AI menjawab jujur bahwa ia AI, dan pelanggan bisa menelepon nomor yang sama untuk bicara dengan staf.",
      },
      {
        q: "Bagaimana kalau pelanggan membatalkan atau pindah jadwal?",
        a: "Permintaannya diteruskan ke staf. Setelah staf menekan Ya, jadwal diperbarui, slot lama kembali kosong, dan pelanggan dikabari otomatis.",
      },
      {
        q: "Bisakah booking untuk hari yang sama?",
        a: "Bisa, dengan persetujuan staf. Jadwal hari yang sama, hari Minggu, atau di luar jam kerja diajukan AI ke grup staf, lalu staf memutuskannya dengan satu tombol. Aturan ini bisa disesuaikan dengan usahamu.",
      },
      {
        q: "Bagaimana kalau staf ingin membalas sendiri?",
        a: "Staf cukup membalas dari HP seperti biasa. AI berhenti membalas pelanggan itu selama 30 menit, lalu hasil chatnya dirangkum menjadi usulan yang tinggal disetujui.",
      },
    ],
  },
  en: {
    title: "Service bookings straight from customer chats",
    question: "How can a service business take WhatsApp bookings without an admin on standby?",
    result: "Bookings confirmed without waiting for an admin",
    summary: "Customers pick a free time in the chat, and the booking lands in your team schedule automatically.",
    answer:
      "A booking assistant answers customers on WhatsApp, quotes prices from your service list, checks which times are still free, and records the booking in the team schedule. Reschedules, cancellations and bookings outside normal hours are decided by the team with a Yes or No button. The team can also reply in person at any time, and the assistant steps back.",
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
        "Passes reschedules, cancellations and bookings outside normal hours to the team group with the reason. The first Yes or No tap counts, and the customer is told automatically.",
        "Stops replying for 30 minutes as soon as a team member takes over the chat from their phone, so customers never get two answers. The team group is reminded if the customer waits too long.",
        "Sums up the chat the team handled as one proposal with buttons, so the schedule updates without retyping.",
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
        title: "The team decides with one tap",
        body: "Reschedules, cancellations and unusual requests reach the team group with a summary.",
      },
      {
        title: "The team can take over the chat",
        body: "A team member replies from their phone and the assistant steps back. The chat is then summed up as a proposal to approve.",
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
      {
        aspect: "Schedule changes",
        before: "Re-entered one by one",
        after: "One tap, the schedule follows",
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
        a: "Yes, with the team's approval. Same-day, Sunday or after-hours requests are sent to the team group, and the team decides with one tap. This rule can be adjusted for your business.",
      },
      {
        q: "What if the team wants to reply in person?",
        a: "The team simply replies from their phone as usual. The assistant stops replying to that customer for 30 minutes, then sums up the chat as a proposal to approve.",
      },
    ],
  },
};
