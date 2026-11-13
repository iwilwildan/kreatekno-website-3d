// Source: Solusi v1 COPY 19; client metrics remain examples.
import type { Solusi } from "../schema";

export const bookingJasa: Solusi = {
  slug: "booking-jasa",
  status: "jalan",
  updated: "2026-10-27",
  industri: ["jasa"],
  tim: ["cs", "operasional"],
  apps: ["whatsapp", "calendar", "sheets"],
  metricsKind: "example",
  id: {
    title: "Booking jasa langsung dari chat pelanggan",
    question: "Bagaimana usaha jasa menerima booking dari WhatsApp tanpa admin standby?",
    result: "Booking terkonfirmasi tanpa menunggu admin",
    summary:
      "Pelanggan memilih jadwal kosong langsung di chat WhatsApp, lalu booking tercatat otomatis ke kalender tim Anda.",
    answer:
      "Asisten booking menjawab pelanggan di WhatsApp, menawarkan jadwal yang masih kosong, lalu mencatat booking ke kalender tim. Pertanyaan yang tidak bisa dijawab diteruskan ke admin lengkap dengan ringkasan chat, sehingga pelanggan tidak perlu mengulang ceritanya.",
    client: "Usaha jasa perawatan rumah, Riau",
    pains: [
      "Pelanggan menunggu berjam-jam hanya untuk tahu jadwal yang tersedia.",
      "Jadwal tim lapangan sering bentrok karena dicatat di beberapa tempat.",
      "Chat di malam hari baru dibalas keesokan paginya.",
    ],
    steps: [
      {
        title: "Pelanggan bertanya lewat chat",
        body: "Pelanggan menghubungi nomor usaha seperti biasa.",
      },
      {
        title: "Asisten menawarkan jadwal",
        body: "Pelanggan memilih dari jadwal yang memang masih kosong.",
      },
      {
        title: "Booking masuk ke kalender",
        body: "Tim melihat booking baru di Google Calendar dan tabel booking.",
      },
      {
        title: "Admin menangani yang khusus",
        body: "Permintaan di luar kebiasaan diteruskan ke admin dengan ringkasannya.",
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
        after: "Satu kalender bersama",
      },
      {
        aspect: "Chat malam hari",
        before: "Dibalas besok pagi",
        after: "Langsung dilayani",
      },
    ],
    fit: [
      "Usaha jasa dengan tim lapangan dan jadwal kunjungan.",
      "Usaha yang sebagian besar pelanggannya menghubungi lewat WhatsApp.",
    ],
    notFit: ["Jasa yang harganya selalu dinegosiasi kasus per kasus."],
    prep: ["Daftar layanan dan harga", "Jam kerja dan kapasitas tim per hari", "Kalender tim, atau kami yang buatkan"],
    metrics: [
      {
        value: "24",
        unit: "jam",
        label: "pelanggan bisa booking kapan saja",
      },
      {
        value: "0",
        unit: "bentrok",
        label: "jadwal ganda sejak memakai satu kalender",
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
        a: "Ya. Asisten memperkenalkan diri dan pelanggan bisa meminta bicara dengan admin kapan saja.",
      },
      {
        q: "Bagaimana kalau pelanggan membatalkan?",
        a: "Pembatalan tercatat dan slotnya kembali tersedia untuk pelanggan lain.",
      },
    ],
  },
};
