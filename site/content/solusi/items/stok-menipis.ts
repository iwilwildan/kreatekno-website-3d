// S8 N1b (24 Nov 2026): rewritten from the public n8n.io templates 3979 (goods in and out recorded through forms,
// stock tables updated, stock under the minimum triggers an alert, issue requests approved by button) and 11055
// (stock counted by voice message per shelf location). N10 uses a below-minimum alert and shows the estimated
// time until stock runs out as a design step. Status "ide": the client
// (set A, 24 Nov), quote and metrics are samples.
import type { Solusi } from "../schema";

export const stokMenipis: Solusi = {
  slug: "stok-menipis",
  status: "ide",
  updated: "2026-11-24",
  industri: ["retail", "logistik"],
  tim: ["operasional", "manajemen"],
  apps: ["sheets", "whatsapp"],
  metricsKind: "example",
  id: {
    title: "Peringatan stok menipis sebelum habis",
    seoTitle: "Notifikasi Stok Menipis Otomatis ke WhatsApp | Kreatekno",
    seoDescription:
      "Barang masuk dan keluar dicatat lewat form, stok di Google Sheets diperbarui, dan staf pembelian menerima peringatan WhatsApp saat stok di bawah batas minimum.",
    question: "Bagaimana tahu stok akan habis sebelum terlambat memesan ulang?",
    result: "Peringatan stok rendah untuk pesan ulang",
    summary:
      "Stok diperbarui saat barang bergerak. Staf pembelian menerima peringatan saat stok turun di bawah batas minimum.",
    answer:
      "Setiap barang masuk dan keluar dicatat lewat form singkat, lalu tabel stok diperbarui. Saat stok turun di bawah batas minimum yang kamu tentukan, staf pembelian menerima peringatan berisi nama barang, sisa stok, dan batas minimumnya. Staf menentukan jumlah dan waktu pemesanan ulang.",
    client: "Toko grosir sembako (contoh)",
    painsLead:
      "Toko grosir sembako menjual ratusan jenis barang, dari beras dan minyak goreng sampai gula. Stok baru dicek saat ada waktu, sering saat barang sudah kosong di rak. Pelanggan grosir yang datang lalu membeli di toko lain.",
    pains: [
      "Stok baru ketahuan habis saat pelanggan memesan.",
      "Cek stok gudang dilakukan manual dan tidak rutin.",
      "Barang keluar tidak selalu dicatat, jadi angka di tabel tidak cocok dengan rak.",
    ],
    built: {
      h: "Stok tercatat setiap kali barang bergerak",
      lead: "Staf mencatat barang masuk dan keluar lewat form singkat. Tabel stok mengikuti catatan itu, dan peringatan dikirim saat stok turun di bawah batas minimum.",
      points: [
        "Mencatat barang masuk dari pemasok dan barang keluar lewat form singkat.",
        "Memperbarui sisa stok di tabel setiap kali ada barang masuk atau keluar.",
        "Membandingkan sisa stok dengan batas minimum setiap barang.",
        "Mengirim peringatan berisi nama barang, sisa stok, dan batas minimum ke staf pembelian.",
        "Mencatat hitungan stok berkala lewat pesan suara per lokasi rak.",
        "Rancangan: memperkirakan kapan stok habis dari rata-rata barang keluar seminggu terakhir.",
      ],
    },
    quote: {
      text: "Dulu kami baru tahu minyak goreng habis saat pelanggan grosir menanyakannya. Sekarang peringatannya datang lebih dulu.",
      by: "Pemilik toko grosir sembako",
    },
    steps: [
      { title: "Barang bergerak tercatat", body: "Barang masuk dan keluar dicatat lewat form singkat." },
      { title: "Stok diperbarui", body: "Sisa stok di tabel selalu terbaru." },
      { title: "Peringatan dikirim", body: "Staf pembelian menerima pesan saat stok turun di bawah batas minimum." },
      { title: "Staf memesan ulang", body: "Staf menentukan jumlah dan waktu pemesanan." },
    ],
    compare: [
      { aspect: "Mengetahui stok menipis", before: "Saat sudah habis", after: "Sebelum habis" },
      { aspect: "Cek gudang", before: "Manual, tidak rutin", after: "Diperbarui setiap barang bergerak" },
      { aspect: "Hitung stok fisik", before: "Ditulis di kertas", after: "Pesan suara per rak" },
    ],
    fit: ["Toko dan gudang dengan banyak jenis barang.", "Usaha yang ingin stok di tabel sama dengan isi rak."],
    notFit: [
      "Usaha dengan stok yang sangat sedikit jenisnya.",
      "Usaha yang sudah memakai aplikasi kasir dengan peringatan stok sendiri.",
    ],
    prep: ["Tabel stok yang sudah dipakai", "Batas minimum per barang", "Siapa yang menerima peringatan"],
    metrics: [
      { value: "1", unit: "batas", label: "minimum per barang, kamu yang menentukan" },
      { value: "3", unit: "isi", label: "peringatan: nama barang, sisa stok, batas minimum" },
      { value: "1", unit: "form", label: "untuk barang masuk dan keluar" },
    ],
    faq: [
      {
        q: "Kalau stok dicatat di aplikasi kasir?",
        a: "Data bisa diambil dari ekspor aplikasi kasirmu, sehingga staf tidak mencatat dua kali.",
      },
      {
        q: "Apakah barang dipesan otomatis ke pemasok?",
        a: "Tidak. Peringatan hanya dikirim ke staf pembelian, yang memutuskan jumlah dan waktu pemesanan.",
      },
      {
        q: "Bagaimana dengan hitung stok fisik?",
        a: "Staf bisa menyebut lokasi rak dan jumlah barang lewat pesan suara, lalu angkanya dicatat ke tabel.",
      },
    ],
  },
  en: {
    title: "Low-stock alerts before items run out",
    question: "How can a business know stock will run out before it is too late to reorder?",
    result: "Low-stock alerts for reordering",
    summary: "Stock updates as goods move. Purchasing staff get an alert when stock falls below the minimum.",
    answer:
      "Goods in and out are recorded through a short form, and the stock table is updated. When stock falls below the minimum you set, purchasing staff get an alert with the item name, remaining stock and minimum. Staff decide how much to reorder and when.",
    client: "Wholesale grocery store (sample)",
    painsLead:
      "A wholesale grocery store sells hundreds of items, from rice and cooking oil to sugar. Stock is only checked when there is time, often after an item is already gone from the shelf. Wholesale customers who come in then buy elsewhere.",
    pains: [
      "Empty stock is only noticed when a customer orders.",
      "Warehouse stock is checked by hand and not regularly.",
      "Goods going out are not always recorded, so the table does not match the shelves.",
    ],
    built: {
      h: "Stock recorded every time goods move",
      lead: "Staff record goods in and out through a short form. The stock table reflects those records, and an alert is sent when stock falls below the minimum.",
      points: [
        "Records goods in from suppliers and goods out through a short form.",
        "Updates remaining stock in the table whenever goods come in or go out.",
        "Compares remaining stock with each item's minimum level.",
        "Sends purchasing staff an alert with the item name, remaining stock and minimum.",
        "Records periodic stock counts by voice message per shelf location.",
        "Design step: estimates when stock will run out from the past week's average outflow.",
      ],
    },
    quote: {
      text: "We used to find out cooking oil had run out when a wholesale customer asked for it. Now the alert comes first.",
      by: "Wholesale grocery store owner",
    },
    steps: [
      { title: "Movements recorded", body: "Goods in and out are recorded through a short form." },
      { title: "Stock updated", body: "Remaining stock in the table is always current." },
      { title: "Alert sent", body: "Purchasing staff get a message when stock falls below the minimum." },
      { title: "Staff reorder", body: "Staff decide how much to order and when." },
    ],
    compare: [
      { aspect: "Spotting low stock", before: "Once it has run out", after: "Before it runs out" },
      { aspect: "Warehouse checks", before: "By hand, irregular", after: "Updated whenever goods move" },
      { aspect: "Physical stock counts", before: "Written on paper", after: "A voice message per shelf" },
    ],
    fit: [
      "Shops and warehouses with many kinds of items.",
      "Businesses that want the stock table to match what is on the shelves.",
    ],
    notFit: [
      "Businesses with very few kinds of stock.",
      "Businesses whose point-of-sale app already sends its own stock alerts.",
    ],
    prep: ["The stock table you already use", "A minimum level for each item", "Who receives the alerts"],
    metrics: [
      { value: "1", unit: "minimum", label: "level per item, set by you" },
      { value: "3", unit: "details", label: "in each alert: item, remaining stock, minimum" },
      { value: "1", unit: "form", label: "for goods in and out" },
    ],
    faq: [
      {
        q: "What if stock is recorded in a point-of-sale app?",
        a: "Data can be taken from your point-of-sale export, so staff do not record it twice.",
      },
      {
        q: "Are items ordered from suppliers automatically?",
        a: "No. Alerts only go to purchasing staff, who decide how much to order and when.",
      },
      {
        q: "What about physical stock counts?",
        a: "Staff can say the shelf location and quantity in a voice message, and the number is recorded in the table.",
      },
    ],
  },
};
