// S8 N1b (24 Nov 2026): rewritten from the public n8n.io templates 14313 (every morning unpaid invoices are sorted by
// stage, before and on the due date, overdue and long overdue, each stage gets its own message, and the send is
// recorded) and 9879 (the invoice goes to the customer's chat after an order; numbers are cleaned first and results
// logged). The template's legal-notice stage is replaced by handing the account to the owner. Per the user's
// decision (24 Nov) reminders go straight to customers using approved message templates, because a business may only
// send approved templates outside the 24-hour window. Status "ide": client (set A), quote and metrics are samples.
import type { Solusi } from "../schema";

export const pengingatTagihan: Solusi = {
  slug: "pengingat-tagihan",
  status: "ide",
  updated: "2026-11-24",
  industri: ["jasa", "properti", "logistik"],
  tim: ["keuangan"],
  apps: ["whatsapp", "sheets", "gmail"],
  metricsKind: "example",
  id: {
    title: "Tagihan jatuh tempo diingatkan otomatis",
    question: "Bagaimana mengingatkan pelanggan soal tagihan tanpa terasa sungkan?",
    result: "Pembayaran lebih tepat waktu tanpa menagih manual",
    summary:
      "Setiap pagi tagihan yang belum lunas dicek, lalu pelanggan menerima pengingat sopan sesuai tahap jatuh temponya.",
    answer:
      "Setiap pagi tabel tagihan dibaca, dan hanya tagihan yang belum lunas yang dipilih. Pelanggan menerima pengingat tiga hari sebelum jatuh tempo, pada hari jatuh tempo, dan tujuh hari setelahnya. Tanggal dan tahap pengingat dicatat di tabel. Jika tagihan masih belum lunas pada hari ke-30 setelah jatuh tempo, catatannya diteruskan ke pemilik untuk ditindaklanjuti langsung.",
    client: "Jasa servis AC kontrak bulanan (contoh)",
    painsLead:
      "Jasa servis AC punya puluhan pelanggan kontrak bulanan, dari kantor sampai ruko, dengan tanggal jatuh tempo yang berbeda-beda. Staf keuangan menagih satu per satu lewat chat dan sering merasa sungkan, sehingga tagihan yang terlambat baru ditanyakan saat kas menipis.",
    pains: [
      "Staf keuangan menagih satu per satu dan sering merasa sungkan.",
      "Tagihan terlupa karena jadwal jatuh tempo berbeda-beda.",
      "Tidak jelas pelanggan mana yang sudah diingatkan dan kapan.",
    ],
    built: {
      h: "Pengingat bertahap yang sopan, tanpa menagih satu per satu",
      lead: "Staf keuangan cukup menjaga tabel tagihan tetap terbaru. Setiap pagi tagihan yang belum lunas dipilah per tahap, dan pengingat yang sesuai terkirim sendiri.",
      points: [
        "Membaca tabel tagihan setiap pagi pukul 07.00 dan memilih yang belum lunas.",
        "Memilah tagihan per tahap: tiga hari sebelum jatuh tempo, hari jatuh tempo, dan lewat tujuh hari.",
        "Mengirim pengingat dengan template pesan yang sudah disetujui, berisi nomor tagihan, jumlah, dan cara bayar.",
        "Mengirim lewat email untuk pelanggan yang tidak memakai chat.",
        "Mencatat tanggal dan tahap setiap pengingat di tabel tagihan.",
        "Menyerahkan tagihan yang masih belum lunas pada hari ke-30 setelah jatuh tempo ke pemilik.",
      ],
    },
    quote: {
      text: "Kami tidak lagi sungkan menagih, karena pengingatnya datang sendiri dengan bahasa yang sopan. Saya cukup menelepon pelanggan yang sudah lewat sebulan.",
      by: "Staf keuangan jasa servis AC",
    },
    steps: [
      { title: "Tagihan dicek setiap pagi", body: "Hanya tagihan yang belum lunas yang dipilih." },
      { title: "Tahap ditentukan", body: "Tiga hari sebelum, hari jatuh tempo, atau lewat tujuh hari." },
      { title: "Pengingat dikirim", body: "Pesan sopan sesuai tahapnya, dan tanggalnya dicatat." },
      {
        title: "Pemilik menindaklanjuti",
        body: "Pada hari ke-30 setelah jatuh tempo, tagihan yang masih belum lunas diteruskan ke pemilik.",
      },
    ],
    compare: [
      { aspect: "Mengingatkan", before: "Menagih satu per satu", after: "Terkirim sesuai tahap" },
      { aspect: "Riwayat pengingat", before: "Tidak tercatat", after: "Tanggal dan tahap di tabel" },
      {
        aspect: "Tindak lanjut langsung",
        before: "Staf menghubungi pelanggan satu per satu",
        after: "Pemilik menerima tagihan yang masih terbuka pada H+30",
      },
    ],
    fit: [
      "Usaha dengan tagihan rutin bulanan atau termin.",
      "Usaha dengan banyak pelanggan dan tanggal jatuh tempo yang berbeda-beda.",
    ],
    notFit: ["Usaha yang semua pembayarannya tunai di tempat.", "Penagihan utang yang memerlukan proses hukum."],
    prep: [
      "Daftar tagihan dan tanggal jatuh tempo",
      "Nomor chat atau email setiap pelanggan",
      "Isi pesan untuk setiap tahap pengingat",
    ],
    metrics: [
      { value: "3", unit: "tahap", label: "pengingat: H-3, hari jatuh tempo, lewat 7 hari" },
      { value: "07.00", unit: "WIB", label: "tagihan dicek setiap pagi" },
      { value: "30", unit: "hari", label: "setelah jatuh tempo, tagihan yang masih terbuka diteruskan ke pemilik" },
    ],
    faq: [
      {
        q: "Apa syarat mengirim pengingat lewat WhatsApp?",
        a: "Minta izin pelanggan untuk menerima pesan WhatsApp. Pengingat memakai template pesan yang sudah disetujui, sesuai ketentuan WhatsApp untuk pesan yang dimulai bisnis atau dikirim di luar jendela layanan 24 jam.",
      },
      {
        q: "Bagaimana kalau pelanggan sudah membayar?",
        a: "Cukup tandai lunas di tabel. Tagihan yang sudah lunas tidak lagi diingatkan.",
      },
      {
        q: "Apakah tahap dan isi pesan bisa diubah?",
        a: "Bisa. Jumlah tahap, jaraknya dari jatuh tempo, dan isi pesannya disesuaikan dengan cara kerja usaha Anda.",
      },
    ],
  },
  en: {
    title: "Due invoices reminded automatically",
    question: "How can a business remind customers about invoices without feeling awkward?",
    result: "Payments arrive on time without manual chasing",
    summary:
      "Each morning unpaid invoices are checked, and customers get a polite reminder for their stage of the due date.",
    answer:
      "The invoice table is checked each morning for unpaid invoices. Customers get reminders three days before the due date, on the due date, and seven days after. The date and stage of each reminder are recorded. If an invoice is still unpaid 30 days after the due date, it goes to the owner for direct follow-up.",
    client: "Air-conditioner service on monthly contracts (sample)",
    painsLead:
      "An air-conditioner service has dozens of monthly contract customers, from offices to shophouses, each with a different due date. Finance staff chase each one in chat and often feel awkward, so late invoices only get followed up when cash runs low.",
    pains: [
      "Finance staff chase invoices one by one and often feel awkward.",
      "Invoices are forgotten because due dates differ.",
      "It is unclear which customers have been reminded, and when.",
    ],
    built: {
      h: "Polite reminders in stages, without chasing one by one",
      lead: "Finance staff only keep the invoice table up to date. Each morning unpaid invoices are sorted by stage, and the right reminder goes out on its own.",
      points: [
        "Reads the invoice table every morning at 7 am and picks unpaid invoices.",
        "Sorts invoices by stage: three days before the due date, on the due date and seven days overdue.",
        "Sends reminders using approved message templates with the invoice number, amount and how to pay.",
        "Sends by email to customers who do not use chat.",
        "Records the date and stage of every reminder in the invoice table.",
        "Hands invoices that are still unpaid 30 days after the due date to the owner.",
      ],
    },
    quote: {
      text: "We no longer feel awkward about chasing payments, because the reminders go out on their own in polite words. I only call customers who are a month late.",
      by: "Finance staff at an air-conditioner service",
    },
    steps: [
      { title: "Invoices checked each morning", body: "Only unpaid invoices are picked." },
      { title: "Stage decided", body: "Three days before, on the due date, or seven days overdue." },
      { title: "Reminder sent", body: "A polite message for that stage, with the date recorded." },
      { title: "Owner follows up", body: "Invoices still unpaid 30 days after the due date go to the owner." },
    ],
    compare: [
      { aspect: "Reminding", before: "Chasing one by one", after: "Sent by stage" },
      { aspect: "Reminder history", before: "Not recorded", after: "Date and stage in the table" },
      {
        aspect: "Direct follow-up",
        before: "Staff contact customers one by one",
        after: "The owner gets invoices still open 30 days after they were due",
      },
    ],
    fit: [
      "Businesses with regular monthly or instalment invoices.",
      "Businesses with many customers and different due dates.",
    ],
    notFit: ["Businesses paid entirely in cash on the spot.", "Debt collection that needs legal action."],
    prep: [
      "A list of invoices and due dates",
      "Each customer's chat number or email",
      "The message for each reminder stage",
    ],
    metrics: [
      { value: "3", unit: "stages", label: "of reminders: 3 days before, due date, 7 days overdue" },
      { value: "7", unit: "am", label: "invoices are checked every morning (WIB)" },
      { value: "30", unit: "days", label: "after the due date, invoices still open go to the owner" },
    ],
    faq: [
      {
        q: "What do I need to send reminders on WhatsApp?",
        a: "Get the customer's permission to receive WhatsApp messages. Reminders use approved message templates, as required when the business starts a conversation or messages outside the 24-hour customer service window.",
      },
      {
        q: "What if the customer has already paid?",
        a: "Just mark it paid in the table. Paid invoices are no longer reminded.",
      },
      {
        q: "Can the stages and messages be changed?",
        a: "Yes. The number of stages, their distance from the due date and the messages are set to fit how your business works.",
      },
    ],
  },
};
