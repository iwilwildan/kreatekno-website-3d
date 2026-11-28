// S8 (23 Nov 2026): drawn from the public n8n.io templates 5201, 4136 and 4020 (receipt photo, typed note or voice
// note parsed into shop, date, total and category; unreadable totals asked again; a morning recap). The templates
// store data in Postgres; this page uses a spreadsheet like the other solutions. Status "ide": this is not client
// work, so the client (user's set A, 23 Nov), quote and metrics are samples. N1a added the full ID/EN copy.
import type { Solusi } from "../schema";

export const catatPengeluaran: Solusi = {
  slug: "catat-pengeluaran",
  status: "ide",
  updated: "2026-11-23",
  industri: ["retail", "jasa"],
  tim: ["keuangan", "manajemen"],
  apps: ["whatsapp", "sheets"],
  metricsKind: "example",
  id: {
    title: "Nota belanja tercatat cukup dengan satu foto",
    seoTitle: "Catat Pengeluaran dari Foto Nota via WhatsApp | Kreatekno",
    seoDescription:
      "Kirim foto nota, ketikan, atau pesan suara ke WhatsApp usaha. AI mencatat toko, tanggal, total, dan kategori ke Google Sheets, lalu rekapnya dikirim tiap pagi.",
    question: "Bagaimana mencatat pengeluaran usaha tanpa mengetik ulang nota satu per satu?",
    result: "Setiap nota tercatat rapi di hari yang sama, lengkap dengan kategorinya",
    summary:
      "Foto nota atau pesan suara dikirim lewat chat, lalu toko, tanggal, total, dan kategorinya tercatat otomatis.",
    answer:
      "Pemilik atau staf mengirim foto nota, ketikan singkat, atau pesan suara ke nomor usaha. AI membaca isinya, lalu menyusun nama toko, tanggal, total, dan kategori pengeluaran. Kalau total tidak terbaca, pengirim diminta mengirim ulang. Setiap catatan masuk ke satu tabel, dan setiap pagi pemilik menerima rekap pengeluaran kemarin.",
    client: "Kedai kopi dua cabang (contoh)",
    painsLead:
      "Kedai kopi berbelanja hampir setiap hari: susu, gula, es batu, gas, dan kemasan. Staf menyimpan notanya di saku atau memotretnya, lalu foto itu terlupa di galeri. Pemilik baru tahu total pengeluaran setelah semua nota diketik ulang di akhir bulan.",
    pains: [
      "Nota menumpuk di dompet dan galeri, baru dicatat akhir bulan.",
      "Kategori pengeluaran ditulis berbeda-beda oleh tiap staf.",
      "Pemilik tidak tahu pengeluaran kemarin sebelum laporan bulanan jadi.",
    ],
    built: {
      h: "Satu nomor untuk semua nota, satu tabel untuk semua pengeluaran",
      lead: "Staf cukup memotret nota setelah berbelanja. Isi nota dibaca dan dirapikan ke tabel pengeluaran, lalu pemilik menerima rekapnya setiap pagi.",
      points: [
        'Menerima foto nota, ketikan singkat seperti "es batu 2 karung 30rb", atau pesan suara.',
        "Membaca nama toko, tanggal, daftar barang, dan total dari foto nota.",
        "Mengelompokkan pengeluaran ke kategori yang kamu tentukan, misalnya bahan baku, operasional, dan kemasan.",
        "Meminta foto ulang kalau total tidak terbaca, supaya tidak ada catatan kosong.",
        "Membalas pengirim dengan ringkasan catatan untuk dicek.",
        "Mengirim rekap pengeluaran kemarin ke pemilik setiap pagi pukul 08.00.",
      ],
    },
    quote: {
      text: "Dulu nota baru diketik akhir bulan dan banyak yang hilang. Sekarang staf cukup memotret, dan pagi harinya saya sudah tahu pengeluaran kemarin.",
      by: "Pemilik kedai kopi",
    },
    steps: [
      { title: "Nota dikirim", body: "Staf mengirim foto, ketikan singkat, atau pesan suara ke nomor usaha." },
      { title: "Isi dibaca", body: "AI menyusun nama toko, tanggal, total, dan kategori pengeluaran." },
      { title: "Tercatat dan dicek", body: "Catatan masuk ke tabel, dan total yang tidak terbaca diminta ulang." },
      { title: "Rekap pagi", body: "Pemilik menerima ringkasan pengeluaran kemarin pukul 08.00." },
    ],
    compare: [
      { aspect: "Mencatat nota", before: "Diketik ulang akhir bulan", after: "Satu foto, hari itu juga" },
      { aspect: "Kategori", before: "Berbeda tiap staf", after: "Seragam" },
      { aspect: "Melihat pengeluaran", before: "Menunggu laporan bulanan", after: "Rekap setiap pagi" },
    ],
    fit: [
      "Usaha dengan banyak belanja kecil harian, misalnya bahan baku, bensin, dan perlengkapan.",
      "Pemilik yang ingin tahu pengeluaran harian tanpa membuka buku kas.",
    ],
    notFit: [
      "Pengganti pembukuan lengkap atau laporan pajak.",
      "Usaha yang semua pembeliannya sudah tercatat otomatis di aplikasi pembelian.",
    ],
    prep: [
      "Daftar kategori pengeluaran yang dipakai",
      "Nomor staf yang boleh mengirim nota",
      "Beberapa contoh nota yang biasa diterima",
      "Jam rekap yang diinginkan",
    ],
    metrics: [
      { value: "1", unit: "foto", label: "cukup untuk mencatat satu nota" },
      { value: "3", unit: "cara", label: "mengirim nota: foto, ketikan, atau pesan suara" },
      { value: "1", unit: "rekap", label: "untuk pemilik setiap pagi, pukul 08.00" },
    ],
    faq: [
      {
        q: "Apakah ini menggantikan pembukuan atau laporan pajak?",
        a: "Tidak. Catatan ini merapikan pengeluaran harian. Pembukuan dan pajak tetap dikerjakan seperti biasa, dengan data yang lebih rapi.",
      },
      {
        q: "Bagaimana kalau foto nota buram?",
        a: "Kalau total tidak terbaca, pengirim diminta mengirim foto yang lebih jelas atau mengetik totalnya.",
      },
      {
        q: "Siapa saja yang bisa mengirim nota?",
        a: "Hanya nomor staf yang sudah didaftarkan. Pesan dari nomor lain tidak dicatat.",
      },
      {
        q: "Bagaimana kalau kategorinya salah?",
        a: "Pengirim menerima ringkasan setiap catatan, jadi kategori yang salah bisa diperbaiki di tabel pada hari yang sama.",
      },
    ],
  },
  en: {
    title: "Receipts recorded with a single photo",
    question: "How can a business record its spending without retyping every receipt?",
    result: "Every receipt is recorded the same day, with its category",
    summary: "Send a receipt photo or voice note in chat, and the shop, date, total and category are recorded.",
    answer:
      "The owner or staff send a receipt photo, a short typed note or a voice note to the business number. AI reads it and sets out the shop name, date, total and spending category. If the total cannot be read, the sender is asked to send it again. Every entry goes into one table, and each morning the owner receives a recap of the previous day's spending.",
    client: "Coffee shop with two branches (sample)",
    painsLead:
      "A coffee shop buys supplies almost every day: milk, sugar, ice, gas and packaging. Staff keep the receipts in their pockets or take photos that get lost in the gallery. The owner only learns the total spending once every receipt has been retyped at the end of the month.",
    pains: [
      "Receipts pile up in wallets and phone galleries until the end of the month.",
      "Each staff member writes spending categories differently.",
      "The owner cannot see yesterday's spending until the monthly report is done.",
    ],
    built: {
      h: "One number for every receipt, one table for all spending",
      lead: "Staff only take a photo of the receipt after buying supplies. The receipt is read and filed into the spending table, and the owner receives a recap every morning.",
      points: [
        'Accepts receipt photos, short notes such as "ice 2 bags 30k", or voice notes.',
        "Reads the shop name, date, item list and total from the receipt photo.",
        "Sorts spending into the categories you set, such as ingredients, operations and packaging.",
        "Asks for a new photo when the total cannot be read, so no entry is left empty.",
        "Replies to the sender with a summary of the entry to check.",
        "Sends the owner a recap of yesterday's spending every morning at 8 am.",
      ],
    },
    quote: {
      text: "We used to type receipts at the end of the month and many went missing. Now staff just take a photo, and by morning I know what we spent yesterday.",
      by: "Coffee shop owner",
    },
    steps: [
      { title: "Receipt sent", body: "Staff send a photo, a short note or a voice note to the business number." },
      { title: "Receipt read", body: "AI sets out the shop name, date, total and spending category." },
      { title: "Recorded and checked", body: "The entry goes into the table, and unreadable totals are asked again." },
      { title: "Morning recap", body: "The owner receives a summary of yesterday's spending at 8 am." },
    ],
    compare: [
      { aspect: "Recording receipts", before: "Retyped at month end", after: "One photo, the same day" },
      { aspect: "Categories", before: "Different for each staff member", after: "Consistent" },
      { aspect: "Seeing spending", before: "Waiting for the monthly report", after: "A recap every morning" },
    ],
    fit: [
      "Businesses with many small daily purchases, such as ingredients, fuel and supplies.",
      "Owners who want to know daily spending without opening the cash book.",
    ],
    notFit: [
      "A replacement for full bookkeeping or tax reports.",
      "Businesses whose purchases are already recorded automatically in a purchasing app.",
    ],
    prep: [
      "The spending categories you use",
      "The staff numbers allowed to send receipts",
      "A few sample receipts you usually receive",
      "The time you want the recap",
    ],
    metrics: [
      { value: "1", unit: "photo", label: "is enough to record one receipt" },
      { value: "3", unit: "ways", label: "to send a receipt: photo, note or voice" },
      { value: "1", unit: "recap", label: "for the owner every morning, at 8 am" },
    ],
    faq: [
      {
        q: "Does this replace bookkeeping or tax reports?",
        a: "No. These entries keep daily spending tidy. Bookkeeping and tax work carry on as usual, with cleaner data.",
      },
      {
        q: "What if the receipt photo is blurry?",
        a: "If the total cannot be read, the sender is asked for a clearer photo or to type the total.",
      },
      {
        q: "Who can send receipts?",
        a: "Only staff numbers that have been registered. Messages from other numbers are not recorded.",
      },
      {
        q: "What if the category is wrong?",
        a: "The sender receives a summary of every entry, so a wrong category can be fixed in the table on the same day.",
      },
    ],
  },
};
