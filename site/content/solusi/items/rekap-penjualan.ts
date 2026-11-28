// S8 N1b (24 Nov 2026): rewritten from the public n8n.io template 6679 (sales and costs in a spreadsheet compared
// across the current period, last month and last year, summarised by AI, and open to questions in chat), adapted to
// a nightly recap. The nightly message goes out as an approved message template (outside the 24-hour window only
// approved templates are allowed); free questions work once the owner replies. Status "ide": the client (set A,
// 24 Nov), quote and metrics are samples.
import type { Solusi } from "../schema";

export const rekapPenjualan: Solusi = {
  slug: "rekap-penjualan",
  status: "ide",
  updated: "2026-11-24",
  industri: ["retail", "logistik"],
  tim: ["manajemen", "keuangan"],
  apps: ["sheets", "whatsapp"],
  metricsKind: "example",
  id: {
    title: "Rekap penjualan harian tanpa hitung manual",
    question: "Bagaimana pemilik usaha menerima rekap penjualan setiap hari tanpa menghitung sendiri?",
    result: "Angka penjualan sampai di HP pemilik setiap malam",
    summary:
      "Setiap malam pemilik menerima rekap penjualan: total, produk terlaris, dan perbandingan dengan hari dan minggu sebelumnya.",
    answer:
      "Setiap malam angka dari tabel penjualan staf dijumlahkan per hari, produk, dan wilayah. Totalnya dibandingkan dengan kemarin dan hari yang sama minggu lalu sebelum AI menulis ringkasan. Pemilik menerima total, produk terlaris, dan perbandingannya di HP. Pertanyaan lanjutan dijawab dari periode yang tersedia di tabel.",
    client: "Distributor minuman (contoh)",
    painsLead:
      "Distributor minuman mencatat pengiriman ke puluhan toko setiap hari dalam satu tabel. Pemilik baru tahu angka penjualan setelah admin selesai menghitung keesokan harinya, dan laporan mingguan sering terlambat karena admin sibuk dengan pesanan.",
    pains: [
      "Pemilik baru tahu angka penjualan setelah admin selesai menghitung.",
      "Laporan mingguan sering terlambat atau tidak dibuat.",
      "Penurunan penjualan satu produk baru terlihat setelah beberapa minggu.",
    ],
    built: {
      h: "Satu ringkasan setiap malam, dengan angka pembanding",
      lead: "Staf tetap mencatat penjualan di tabel yang sama. Setiap malam angkanya dirangkum dan dibandingkan, lalu pemilik menerima ringkasan pendek yang bisa ditanya balik.",
      points: [
        "Membaca tabel penjualan setiap malam pukul 21.00 WIB.",
        "Menjumlahkan penjualan per hari, produk, dan wilayah.",
        "Membandingkan angka hari ini dengan kemarin dan dengan hari yang sama minggu lalu.",
        "Menyusun ringkasan pendek dengan AI dari total, produk terlaris, dan perubahan yang sudah dihitung.",
        "Mengirim ringkasan ke pemilik setiap malam.",
        "Menjawab pertanyaan pemilik dari periode yang tersedia di tabel.",
      ],
    },
    quote: {
      text: "Sekarang saya tahu angka hari ini sebelum tidur. Kalau ada produk yang turun, saya tanya balik dan langsung melihat perbandingannya dengan bulan lalu.",
      by: "Pemilik distributor minuman",
    },
    steps: [
      { title: "Penjualan tercatat seperti biasa", body: "Staf tetap memakai tabel yang sudah ada." },
      { title: "Angka dirangkum", body: "Total, produk terlaris, dan perbandingan disusun setiap malam." },
      { title: "Ringkasan dikirim", body: "Pemilik menerima satu pesan setiap malam." },
      { title: "Pemilik bertanya balik", body: "Angka periode lain bisa ditanyakan lewat chat." },
    ],
    compare: [
      { aspect: "Melihat angka harian", before: "Menunggu admin", after: "Di HP setiap malam" },
      { aspect: "Laporan mingguan", before: "Sering terlambat", after: "Terbentuk dari rekap harian" },
      { aspect: "Membandingkan periode", before: "Membuka banyak file", after: "Cukup bertanya" },
    ],
    fit: [
      "Pemilik toko atau distributor yang ingin memantau penjualan dari HP.",
      "Usaha yang sudah mencatat penjualan harian di satu tabel.",
    ],
    notFit: ["Usaha yang belum mencatat penjualan sama sekali."],
    prep: [
      "Tabel penjualan yang sudah dipakai staf",
      "Angka apa saja yang ingin dilihat pemilik",
      "Jam rekap yang diinginkan",
    ],
    metrics: [
      { value: "21.00", unit: "WIB", label: "ringkasan penjualan dikirim setiap malam" },
      { value: "2", unit: "pembanding", label: "kemarin dan hari yang sama minggu lalu" },
      { value: "1", unit: "pesan", label: "ringkasan untuk pemilik, bisa ditanya balik" },
    ],
    faq: [
      {
        q: "Kalau data penjualan masih di buku tulis?",
        a: "Penjualan perlu dicatat di tabel lebih dulu. Kami bisa membantu menyiapkan tabel atau form pencatatan yang sederhana.",
      },
      {
        q: "Apakah rekap malam boleh dikirim lewat WhatsApp?",
        a: "Pemilik menyetujui penerimaan rekap lewat WhatsApp. Pesan terjadwal memakai template yang disetujui. Balasan bebas untuk pertanyaan pemilik mengikuti jendela layanan 24 jam sejak pesan terakhir dari pemilik.",
      },
      {
        q: "Apakah angka yang ditulis AI bisa dipercaya?",
        a: "Angka dijumlahkan dari tabel sebelum AI menulis ringkasan. AI hanya menyusun kalimatnya, bukan menghitung.",
      },
    ],
  },
  en: {
    title: "Daily sales recap without manual counting",
    question: "How can an owner get a daily sales recap without counting it themselves?",
    result: "Sales figures reach the owner's phone every night",
    summary: "Every night the owner receives a sales recap: total, top products and a comparison with earlier days.",
    answer:
      "Each evening, figures from the staff sales table are totalled by day, product and area. They are compared with yesterday and the same day last week before AI writes the recap. The owner gets the total, top products and comparisons on their phone. Follow-up answers use periods available in the table.",
    client: "Beverage distributor (sample)",
    painsLead:
      "A beverage distributor records deliveries to dozens of shops every day in one table. The owner only learns the sales figures after the admin finishes counting the next day, and the weekly report is often late because the admin is busy with orders.",
    pains: [
      "The owner only sees sales figures after the admin finishes counting.",
      "Weekly reports are often late or never made.",
      "A drop in one product's sales only shows after several weeks.",
    ],
    built: {
      h: "One summary every night, with figures to compare",
      lead: "Staff keep recording sales in the same table. Every night the figures are summarised and compared, and the owner receives a short summary they can ask about.",
      points: [
        "Reads the sales table every night at 9 pm WIB.",
        "Totals sales by day, product and area.",
        "Compares today with yesterday and with the same day last week.",
        "Has AI summarise the totals, top products and changes already calculated from the table.",
        "Sends the summary to the owner every night.",
        "Answers the owner's questions using periods available in the sales table.",
      ],
    },
    quote: {
      text: "Now I know today's figures before bed. If a product drops, I ask and see the comparison with last month straight away.",
      by: "Beverage distributor owner",
    },
    steps: [
      { title: "Sales recorded as usual", body: "Staff keep using the table they already have." },
      { title: "Figures summarised", body: "Total, top products and comparisons are prepared every night." },
      { title: "Summary sent", body: "The owner receives one message every night." },
      { title: "Owner asks back", body: "Figures for other periods can be asked in chat." },
    ],
    compare: [
      { aspect: "Seeing daily figures", before: "Waiting for the admin", after: "On the phone every night" },
      { aspect: "Weekly report", before: "Often late", after: "Built from the daily recaps" },
      { aspect: "Comparing periods", before: "Opening many files", after: "Just ask" },
    ],
    fit: [
      "Shop owners or distributors who want to follow sales from their phone.",
      "Businesses that already record daily sales in one table.",
    ],
    notFit: ["Businesses that do not record sales at all yet."],
    prep: [
      "The sales table your staff already use",
      "The figures the owner wants to see",
      "The time you want the recap",
    ],
    metrics: [
      { value: "9", unit: "pm", label: "the sales summary is sent every night (WIB)" },
      { value: "2", unit: "comparisons", label: "yesterday and the same day last week" },
      { value: "1", unit: "message", label: "summary for the owner, open to questions" },
    ],
    faq: [
      {
        q: "What if sales are still written in a notebook?",
        a: "Sales need to be recorded in a table first. We can help set up a simple table or entry form.",
      },
      {
        q: "Can the nightly recap be sent on WhatsApp?",
        a: "The owner agrees to receive recaps on WhatsApp. Scheduled messages use approved templates. Free-form answers to the owner's questions follow the 24-hour customer service window from the owner's latest message.",
      },
      {
        q: "Can the figures written by AI be trusted?",
        a: "Figures are totalled from the table before AI writes the summary. AI only writes the sentences, it does not do the counting.",
      },
    ],
  },
};
