// S8 N1b (24 Nov 2026): rewritten from the public n8n.io templates 4868 (files dropped in a folder are read and the
// fields named in the table header are filled in; files already processed are skipped) and 4827 (photos, PDFs and
// other files arriving in chat are handled). Until 24 Nov this page was "jalan" for a travel-agency client; its only
// real workflow crops visa images, does not keep a folder per customer or a completeness table, and the user
// cancelled pages from that client (21 Nov). Per the user's decision (24 Nov) the status is "ide" with a sample
// client (a notary office), quote and metrics.
import type { Solusi } from "../schema";

export const berkasDokumen: Solusi = {
  slug: "berkas-dokumen",
  status: "ide",
  updated: "2026-11-24",
  industri: ["jasa", "properti", "perjalanan"],
  tim: ["operasional", "keuangan"],
  apps: ["whatsapp", "drive", "sheets"],
  metricsKind: "example",
  id: {
    title: "Berkas dokumen pelanggan dirapikan otomatis",
    question: "Bagaimana mengumpulkan dokumen pelanggan dari chat tanpa berantakan?",
    result: "Berkas lengkap dan rapi per pelanggan",
    summary:
      "Pelanggan mengirim foto atau PDF dokumen lewat chat. Berkas disimpan per pelanggan, dan kelengkapannya tercatat di tabel.",
    answer:
      "Pelanggan mengirim foto atau PDF dokumennya lewat chat. Setiap file disimpan ke folder milik pelanggan itu dengan nama yang seragam, lalu isinya dibaca untuk mengenali jenis dokumen dan data pentingnya, misalnya nama dan nomor identitas. Tabel kelengkapan diperbarui, dan pelanggan diberi tahu dokumen apa yang masih kurang atau perlu dikirim ulang.",
    client: "Kantor notaris dan PPAT (contoh)",
    painsLead:
      "Kantor notaris meminta banyak dokumen untuk setiap akta: KTP, kartu keluarga, NPWP, dan sertifikat. Klien mengirimnya bertahap lewat chat, sebagian miring atau buram. Staf menyimpan dan memberi nama file satu per satu, lalu menghitung sendiri dokumen mana yang belum ada.",
    pains: [
      "Foto dokumen dikirim miring, buram, atau terpotong.",
      "Staf menyimpan dan memberi nama file satu per satu.",
      "Sulit melihat pelanggan mana yang berkasnya belum lengkap.",
    ],
    built: {
      h: "Satu folder per pelanggan, satu tabel untuk kelengkapan",
      lead: "Pelanggan cukup mengirim dokumen lewat chat seperti biasa. File disimpan dan dibaca, lalu staf melihat dari satu tabel berkas mana yang sudah lengkap.",
      points: [
        "Menerima foto, PDF, dan file lain yang dikirim pelanggan lewat chat.",
        "Menyimpan setiap file ke folder milik pelanggan dengan nama yang seragam.",
        "Membaca isi dokumen untuk mengenali jenisnya dan mengisi data penting ke tabel.",
        "Melewati file yang sudah pernah diproses, sehingga tidak ada catatan ganda.",
        "Menandai dokumen yang buram atau tidak terbaca untuk dikirim ulang.",
        "Mengabari pelanggan daftar dokumen yang masih kurang.",
      ],
    },
    quote: {
      text: "Dulu kami menggulir chat untuk mencari KTP klien. Sekarang semua berkas ada di foldernya, dan tabel menunjukkan apa yang masih kurang.",
      by: "Staf administrasi kantor notaris",
    },
    steps: [
      { title: "Pelanggan mengirim dokumen", body: "Foto atau PDF lewat chat, tanpa aplikasi tambahan." },
      { title: "Berkas disimpan", body: "Setiap file masuk ke folder pelanggan dengan nama yang seragam." },
      { title: "Isi dibaca", body: "Jenis dokumen dan data pentingnya dicatat di tabel." },
      { title: "Staf melihat kelengkapan", body: "Tabel menunjukkan berkas yang sudah lengkap dan yang masih kurang." },
    ],
    compare: [
      { aspect: "Menyimpan file", before: "Satu per satu di komputer", after: "Otomatis ke folder pelanggan" },
      { aspect: "Mencari berkas", before: "Menggulir chat lama", after: "Satu folder per pelanggan" },
      { aspect: "Cek kelengkapan", before: "Dihitung manual", after: "Terlihat di tabel" },
    ],
    fit: [
      "Usaha yang mengumpulkan dokumen dari banyak pelanggan sekaligus.",
      "Tim kecil yang memproses berkas untuk pengajuan ke pihak lain.",
    ],
    notFit: ["Dokumen yang wajib diserahkan dalam bentuk fisik asli."],
    prep: [
      "Daftar dokumen yang dibutuhkan per layanan",
      "Aturan nama file yang ingin dipakai",
      "Data yang perlu diambil dari setiap dokumen",
    ],
    metrics: [
      { value: "1", unit: "folder", label: "per pelanggan, nama file seragam" },
      { value: "1", unit: "tabel", label: "kelengkapan untuk semua pelanggan" },
      { value: "2", unit: "format", label: "dokumen diterima: foto dan PDF" },
    ],
    faq: [
      {
        q: "Apakah dokumen pelanggan aman?",
        a: "Dokumen disimpan di penyimpanan milik usaha Anda dengan akses yang Anda atur sendiri, dan tidak dibagikan lewat link publik.",
      },
      {
        q: "Bagaimana kalau fotonya buram?",
        a: "Dokumen yang tidak terbaca ditandai, dan pelanggan diminta mengirim ulang sebelum berkas dianggap lengkap.",
      },
      {
        q: "Apakah data dari dokumen selalu benar?",
        a: "Data yang dibaca otomatis tetap dicek staf sebelum dipakai, terutama nomor identitas.",
      },
    ],
  },
  en: {
    title: "Customer documents organised automatically",
    question: "How can a business collect customer documents from chat without the mess?",
    result: "Complete, tidy files for each customer",
    summary:
      "Customers send document photos or PDFs in chat. Files are stored per customer, and completeness is tracked in a table.",
    answer:
      "Customers send photos or PDFs of their documents in chat. Each file is saved to that customer's folder with a consistent name, then read to recognise the document type and key data, such as the name and ID number. The completeness table is updated, and the customer is told which documents are still missing or need resending.",
    client: "Notary office (sample)",
    painsLead:
      "A notary office asks for many documents for every deed: ID card, family card, tax number and land certificate. Clients send them in stages through chat, some tilted or blurry. Staff save and name each file by hand, then count which documents are still missing.",
    pains: [
      "Document photos arrive tilted, blurry or cut off.",
      "Staff save and name files one by one.",
      "It is hard to see which customers still have incomplete files.",
    ],
    built: {
      h: "One folder per customer, one table for completeness",
      lead: "Customers just send documents in chat as usual. Files are saved and read, and staff see in one table which files are complete.",
      points: [
        "Accepts photos, PDFs and other files customers send in chat.",
        "Saves each file to that customer's folder with a consistent name.",
        "Reads each document to recognise its type and fill key data into the table.",
        "Skips files that were already processed, so there are no duplicates.",
        "Flags blurry or unreadable documents to be resent.",
        "Tells the customer which documents are still missing.",
      ],
    },
    quote: {
      text: "We used to scroll through chats to find a client's ID card. Now every file is in its folder, and the table shows what is still missing.",
      by: "Administrative staff at a notary office",
    },
    steps: [
      { title: "Customer sends documents", body: "Photos or PDFs in chat, with no extra app." },
      { title: "Files saved", body: "Each file goes into the customer's folder with a consistent name." },
      { title: "Contents read", body: "The document type and key data are recorded in the table." },
      { title: "Staff see completeness", body: "The table shows which files are complete and which are missing." },
    ],
    compare: [
      { aspect: "Saving files", before: "One by one on a computer", after: "Automatically to the customer's folder" },
      { aspect: "Finding files", before: "Scrolling old chats", after: "One folder per customer" },
      { aspect: "Checking completeness", before: "Counted by hand", after: "Visible in the table" },
    ],
    fit: [
      "Businesses that collect documents from many customers at once.",
      "Small teams that prepare files for submission to other parties.",
    ],
    notFit: ["Documents that must be handed over as physical originals."],
    prep: [
      "A list of the documents needed for each service",
      "The file naming rule you want to use",
      "The data to take from each document",
    ],
    metrics: [
      { value: "1", unit: "folder", label: "per customer, with consistent file names" },
      { value: "1", unit: "table", label: "of completeness for every customer" },
      { value: "2", unit: "formats", label: "accepted: photos and PDFs" },
    ],
    faq: [
      {
        q: "Are customer documents safe?",
        a: "Documents are stored in your own business storage with access you control, and are never shared through public links.",
      },
      {
        q: "What if a photo is blurry?",
        a: "Unreadable documents are flagged, and the customer is asked to resend them before the file counts as complete.",
      },
      {
        q: "Is the data read from documents always right?",
        a: "Staff still check automatically read data before using it, especially ID numbers.",
      },
    ],
  },
};
