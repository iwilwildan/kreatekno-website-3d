// Source: Solusi v1 COPY 19; client metrics remain examples.
import type { Solusi } from "../schema";

export const orderGrup: Solusi = {
  slug: "order-grup",
  status: "jalan",
  updated: "2026-10-28",
  industri: ["logistik", "retail"],
  tim: ["operasional", "penjualan"],
  apps: ["whatsapp", "sheets"],
  metricsKind: "example",
  id: {
    title: "Order dari grup WhatsApp tercatat sendiri ke Google Sheets",
    question: "Bagaimana order dari grup WhatsApp bisa tercatat otomatis?",
    result: "Order tercatat tanpa diketik ulang",
    summary:
      "Order yang ditulis sales di grup WhatsApp otomatis tercatat ke Google Sheets, dan pemilik menerima rekap setiap malam.",
    answer:
      "Asisten order dipasang di grup WhatsApp yang sudah dipakai tim. Setiap order yang ditulis sales dicatat ke Google Sheets, tim diberi kabar di grup, dan pemilik menerima rekap setiap malam. Tim tidak perlu mengubah cara mereka mengirim order.",
    client: "Distributor air minum, Pekanbaru",
    painsLead:
      "Setiap hari sekitar 120 order masuk lewat grup chat tim. Sales menulis order dengan gaya masing-masing. Ada yang lengkap, ada yang hanya menulis nama toko dan jumlah.",
    pains: [
      "Satu admin membaca seluruh grup lalu mengetik ulang setiap order ke tabel.",
      "Revisi order tertimbun obrolan, sehingga ada order yang terlewat.",
      "Pemilik baru tahu angka penjualan keesokan paginya.",
    ],
    built: {
      h: "Grup tetap sama, pencatatannya otomatis",
      lead: "Tim tidak perlu belajar aplikasi baru. Mereka tetap mengirim order ke grup yang sama. Di belakang grup itu, asisten membaca setiap pesan, mengenali pesan yang berisi order, lalu mencatatnya ke tabel order.",
      points: [
        'Membaca bahasa sehari-hari, termasuk singkatan dan revisi seperti "jadi 12 dus ya".',
        "Memberi nomor order dan membalas di grup, supaya sales tahu ordernya sudah tercatat.",
        "Menanyakan balik di grup kalau ada data yang kurang, misalnya alamat belum ditulis.",
        "Mengubah status order dari balasan pendek kurir, lalu mengirim rekap ke pemilik setiap malam.",
      ],
    },
    quote: {
      text: "Dulu saya baru tahu penjualan besok paginya. Sekarang setiap malam rekapnya sudah ada di HP saya.",
      by: "Pemilik distributor air minum, Pekanbaru",
    },
    steps: [
      {
        title: "Tim mengirim order seperti biasa",
        body: "Sales tetap menulis di grup WhatsApp yang sama, tanpa format khusus.",
      },
      {
        title: "Asisten mencatat ordernya",
        body: "Order tersusun rapi di Google Sheets. Kalau ada yang kurang jelas, tim ditanya dulu.",
      },
      {
        title: "Status selalu terbaru",
        body: "Kurir cukup membalas di grup, dan status di tabel ikut berubah.",
      },
      {
        title: "Pemilik menerima rekap",
        body: "Setiap malam, ringkasan order hari itu dikirim ke pemilik.",
      },
    ],
    compare: [
      {
        aspect: "Mencatat order",
        before: "Admin mengetik ulang dari chat",
        after: "Tercatat dari chat yang sama",
      },
      {
        aspect: "Tahu status pengiriman",
        before: "Bertanya ke admin atau kurir",
        after: "Terlihat di tabel",
      },
      {
        aspect: "Angka harian",
        before: "Dihitung keesokan pagi",
        after: "Dikirim malam itu juga",
      },
    ],
    fit: [
      "Usaha yang menerima puluhan order sehari lewat grup chat tim.",
      "Tim sales dan kurir yang sudah terbiasa memakai WhatsApp.",
    ],
    notFit: ["Usaha yang sudah memakai aplikasi kasir atau order online untuk semua pesanan."],
    prep: [
      "Grup WhatsApp yang dipakai untuk order",
      "Daftar produk dan harga",
      "Google Sheets tujuan, atau kami yang buatkan",
    ],
    metrics: [
      {
        value: "3",
        unit: "jam",
        label: "waktu admin kembali setiap hari",
      },
      {
        value: "120",
        unit: "order",
        label: "tercatat sehari tanpa diketik ulang",
      },
      {
        value: "1",
        unit: "pesan",
        label: "rekap untuk pemilik setiap malam",
      },
    ],
    faq: [
      {
        q: "Apakah sales harus menulis order dengan format tertentu?",
        a: "Tidak. Asisten membaca order yang ditulis dengan bahasa sehari-hari, termasuk singkatan.",
      },
      {
        q: "Bagaimana kalau pesan ordernya kurang jelas?",
        a: "Asisten tidak menebak. Tim ditanya dulu, dan order baru dicatat setelah datanya jelas.",
      },
      {
        q: "Di mana data order disimpan?",
        a: "Di Google Sheets milik Anda sendiri, jadi data tetap bisa Anda buka dan bagikan kapan saja.",
      },
    ],
  },
  en: {
    title: "Group-chat orders captured automatically in Google Sheets",
    question: "How can orders from a WhatsApp group be captured automatically?",
    result: "Orders are captured without retyping",
    summary: "Orders shared in WhatsApp are captured in Google Sheets, with a nightly recap for the owner.",
    answer:
      "An order assistant is added behind the WhatsApp group the team already uses. It records each sales order in Google Sheets, confirms it in the group, and sends the owner a nightly recap. The team does not need to change how it submits orders.",
    client: "Beverage distributor, Pekanbaru",
    painsLead:
      "About 120 orders arrive in the team chat every day. Each salesperson writes differently: some messages are complete, while others contain only a shop name and quantity.",
    pains: [
      "One admin reads the entire group and retypes every order into a table.",
      "Order changes get buried in chat, so some orders are missed.",
      "The owner only sees the sales figures the following morning.",
    ],
    built: {
      h: "The group stays the same while capture becomes automatic",
      lead: "The team keeps using the same group. Behind it, the assistant reads each message, identifies orders, and records them in an order table.",
      points: [
        "Reads everyday language, abbreviations, and changes such as ‘make that 12 cases’.",
        "Assigns an order number and replies in the group so sales knows it was captured.",
        "Asks the team when information such as an address is missing.",
        "Updates status from short courier replies and sends the owner a nightly recap.",
      ],
    },
    quote: {
      text: "I used to see sales the next morning. Now the recap is already on my phone every night.",
      by: "Owner of a beverage distributor, Pekanbaru",
    },
    steps: [
      {
        title: "The team sends orders as usual",
        body: "Sales keeps writing in the same WhatsApp group, with no special format.",
      },
      {
        title: "The assistant captures the order",
        body: "Orders are organized in Google Sheets, and unclear details are checked first.",
      },
      { title: "Status stays current", body: "A short courier reply updates the status in the table." },
      { title: "The owner receives a recap", body: "A summary of the day’s orders is sent every night." },
    ],
    compare: [
      { aspect: "Capturing orders", before: "An admin retypes chat messages", after: "Captured from the same chat" },
      { aspect: "Knowing delivery status", before: "Ask an admin or courier", after: "Visible in the table" },
      { aspect: "Daily figures", before: "Calculated the next morning", after: "Sent that same night" },
    ],
    fit: [
      "Businesses receiving dozens of daily orders through a team chat.",
      "Sales and courier teams already comfortable with WhatsApp.",
    ],
    notFit: ["Businesses already routing every order through a point-of-sale or online ordering system."],
    prep: [
      "The WhatsApp group used for orders",
      "A product and price list",
      "A destination Google Sheet, or we can prepare one",
    ],
    metrics: [
      { value: "3", unit: "hours", label: "returned to the admin each day" },
      { value: "120", unit: "orders", label: "captured daily without retyping" },
      { value: "1", unit: "message", label: "nightly recap for the owner" },
    ],
    faq: [
      {
        q: "Must sales use a specific order format?",
        a: "No. The assistant reads everyday language, including abbreviations.",
      },
      {
        q: "What if an order message is unclear?",
        a: "The assistant does not guess. It asks the team and records the order only after the details are clear.",
      },
      {
        q: "Where is order data stored?",
        a: "In your own Google Sheets file, so you can open and share it at any time.",
      },
    ],
  },
};
