// S8 (23 Nov 2026): drawn from the public n8n.io templates 4247 (AI fills invoice fields and checks them against
// master data), 4452 (invoices from email, folder or form; approve/reject button), 4376 and 4868 (skip files already
// processed). Payment itself is never automated. Status "ide": the client (set A), quote and metrics are samples.
// N1a added the full ID/EN copy.
import type { Solusi } from "../schema";

export const fakturPemasok: Solusi = {
  slug: "faktur-pemasok",
  status: "ide",
  updated: "2026-11-27",
  industri: ["retail", "logistik"],
  tim: ["keuangan", "operasional"],
  apps: ["gmail", "drive", "sheets", "whatsapp"],
  metricsKind: "example",
  id: {
    title: "Faktur pemasok tercatat dan dicek sebelum dibayar",
    question: "Bagaimana mencatat faktur pemasok tanpa mengetik ulang dan tanpa salah bayar?",
    result: "Faktur tercatat rapi, selisih harga ketahuan sebelum dibayar",
    summary:
      "Faktur dari email atau folder dibaca, dicocokkan dengan daftar harga pemasok, lalu menunggu persetujuan pemilik.",
    answer:
      "Faktur pemasok yang masuk lewat email atau folder bersama dibaca otomatis. AI mengisi nomor faktur, pemasok, tanggal, jatuh tempo, daftar barang, dan total, lalu membandingkan harga setiap barang dengan daftar harga yang disepakati. Faktur tercatat di satu tabel, baris yang tidak cocok ditandai, dan pemilik menyetujui atau menolak pembayaran lewat satu tombol.",
    client: "Toko bangunan (contoh)",
    painsLead:
      "Toko bangunan menerima faktur dari belasan pemasok setiap minggu: semen, besi, cat, dan keramik. Staf admin mengetik ulang setiap faktur ke tabel, dan kenaikan harga beberapa ratus rupiah per sak sering baru ketahuan setelah faktur dibayar.",
    pains: [
      "Faktur diketik ulang ke tabel satu per satu.",
      "Harga yang naik diam-diam baru ketahuan setelah dibayar.",
      "Persetujuan bayar tercecer di chat.",
    ],
    built: {
      h: "Faktur dibaca, dicocokkan, lalu menunggu keputusan pemilik",
      lead: "Staf cukup meneruskan faktur ke satu alamat email atau menyimpannya di satu folder. Faktur itu dicatat dan dicek, sehingga pemilik hanya memutuskan faktur yang sudah rapi.",
      points: [
        "Membaca faktur PDF maupun foto dari email dan folder bersama.",
        "Mengisi nomor faktur, pemasok, tanggal, jatuh tempo, daftar barang, dan total.",
        "Membandingkan harga setiap barang dengan daftar harga pemasok yang disepakati.",
        "Menandai faktur yang berisi selisih harga atau barang yang tidak dikenal.",
        "Melewati faktur yang sudah pernah dicatat, sehingga tidak ada catatan ganda.",
        "Mengirim ringkasan faktur ke pemilik dengan tombol Setujui dan Tolak.",
      ],
    },
    quote: {
      text: "Kenaikan harga semen pernah lolos tiga bulan. Sekarang selisih seperti itu sudah ditandai sebelum faktur sampai ke saya.",
      by: "Pemilik toko bangunan",
    },
    steps: [
      { title: "Faktur masuk", body: "Faktur PDF atau foto masuk lewat email atau folder bersama." },
      { title: "Isi dibaca", body: "AI mengisi nomor, pemasok, tanggal, jatuh tempo, barang, dan total." },
      { title: "Dicocokkan", body: "Harga dibandingkan dengan daftar harga pemasok, dan selisihnya ditandai." },
      { title: "Pemilik menyetujui", body: "Pemilik memilih Setujui atau Tolak, dan statusnya tercatat." },
    ],
    compare: [
      { aspect: "Mencatat faktur", before: "Diketik ulang", after: "Terisi otomatis" },
      { aspect: "Selisih harga", before: "Ketahuan setelah dibayar", after: "Ditandai sebelum dibayar" },
      { aspect: "Persetujuan", before: "Lewat chat", after: "Satu tombol, tercatat" },
    ],
    fit: [
      "Usaha dengan banyak pemasok dan faktur setiap minggu.",
      "Tim keuangan yang sudah punya daftar harga pemasok.",
    ],
    notFit: ["Pengganti faktur pajak atau aplikasi akuntansi.", "Usaha yang hanya punya satu atau dua pemasok tetap."],
    prep: [
      "Contoh faktur dari beberapa pemasok",
      "Daftar harga per pemasok",
      "Alamat email atau folder tempat faktur dikumpulkan",
      "Siapa yang menyetujui pembayaran",
    ],
    metrics: [
      { value: "6", unit: "kolom", label: "terisi dari setiap faktur, dari nomor sampai total" },
      { value: "2", unit: "sumber", label: "faktur: email dan folder bersama" },
      { value: "1", unit: "tombol", label: "untuk menyetujui atau menolak pembayaran" },
    ],
    faq: [
      {
        q: "Apakah pembayaran dijalankan otomatis?",
        a: "Tidak. Faktur hanya dicatat dan dimintakan persetujuan. Pembayaran tetap dilakukan tim keuangan.",
      },
      {
        q: "Bagaimana dengan faktur hasil foto?",
        a: "Foto atau hasil pindai juga bisa dibaca. Faktur yang isinya meragukan ditandai untuk dicek manual.",
      },
      {
        q: "Bagaimana kalau pemasok baru belum punya daftar harga?",
        a: "Faktur dari pemasok itu tetap dicatat dan ditandai untuk dicek manual. Setelah harga disepakati, daftar harganya ditambahkan.",
      },
    ],
  },
  en: {
    title: "Supplier invoices recorded and checked before payment",
    question: "How can a business record supplier invoices without retyping them or paying the wrong amount?",
    result: "Price differences are caught before an invoice is paid",
    summary: "Invoices from email or a folder are read, checked against supplier prices, then wait for owner approval.",
    answer:
      "Supplier invoices that arrive by email or in a shared folder are read automatically. AI fills in the invoice number, supplier, date, due date, item list and total, then compares each item's price with the agreed price list. The invoice is recorded in one table, lines that do not match are flagged, and the owner approves or rejects payment with one button.",
    client: "Building supply store (sample)",
    painsLead:
      "A building supply store receives invoices from a dozen suppliers every week: cement, steel, paint and tiles. The admin retypes every invoice into a table, and a price rise of a few hundred rupiah per bag is often only noticed after the invoice has been paid.",
    pains: [
      "Invoices are retyped into a table one by one.",
      "Quiet price rises are only noticed after payment.",
      "Payment approvals get lost in chat.",
    ],
    built: {
      h: "Invoices read, checked, then waiting for the owner's decision",
      lead: "Staff only forward invoices to one email address or save them in one folder. Each invoice is recorded and checked, so the owner only decides on invoices that are already in order.",
      points: [
        "Reads PDF and photo invoices from email and a shared folder.",
        "Fills in the invoice number, supplier, date, due date, item list and total.",
        "Compares each item's price with the agreed supplier price list.",
        "Flags invoices with a price difference or an unknown item.",
        "Skips invoices that were already recorded, so there are no duplicates.",
        "Sends the owner an invoice summary with Approve and Reject buttons.",
      ],
    },
    quote: {
      text: "A cement price rise once slipped through for three months. Now a difference like that is flagged before the invoice reaches me.",
      by: "Building supply store owner",
    },
    steps: [
      { title: "Invoice arrives", body: "A PDF or photo invoice comes in by email or in a shared folder." },
      { title: "Invoice read", body: "AI fills in the number, supplier, date, due date, items and total." },
      {
        title: "Prices checked",
        body: "Prices are compared with the supplier price list, and differences are flagged.",
      },
      { title: "Owner approves", body: "The owner chooses Approve or Reject, and the status is recorded." },
    ],
    compare: [
      { aspect: "Recording invoices", before: "Retyped", after: "Filled in automatically" },
      { aspect: "Price differences", before: "Noticed after payment", after: "Flagged before payment" },
      { aspect: "Approval", before: "In chat", after: "One button, recorded" },
    ],
    fit: [
      "Businesses with many suppliers and invoices every week.",
      "Finance teams that already keep a supplier price list.",
    ],
    notFit: [
      "A replacement for tax invoices or accounting software.",
      "Businesses with only one or two regular suppliers.",
    ],
    prep: [
      "Sample invoices from a few suppliers",
      "A price list for each supplier",
      "The email address or folder where invoices are collected",
      "Who approves payments",
    ],
    metrics: [
      { value: "6", unit: "fields", label: "filled from every invoice, from number to total" },
      { value: "2", unit: "sources", label: "of invoices: email and a shared folder" },
      { value: "1", unit: "button", label: "to approve or reject payment" },
    ],
    faq: [
      {
        q: "Is payment made automatically?",
        a: "No. Invoices are only recorded and sent for approval. Payment is still made by the finance team.",
      },
      {
        q: "What about invoices that are photos?",
        a: "Photos and scans can be read too. Invoices with doubtful contents are flagged for a manual check.",
      },
      {
        q: "What if a new supplier has no price list yet?",
        a: "Invoices from that supplier are still recorded and flagged for a manual check. Once prices are agreed, the supplier's price list is added.",
      },
    ],
  },
};
