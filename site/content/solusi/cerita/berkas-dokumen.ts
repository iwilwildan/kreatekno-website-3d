import type { BerkasCerita, BerkasCeritaLocale, BerkasPanggung } from "./schema";

const sceneIds = [
  "sebelum",
  "terima-berkas",
  "simpan-ke-folder",
  "baca-dan-catat",
  "minta-dilengkapi",
  "perbarui-berkas",
  "periksa-kelengkapan",
  "ringkasan",
  "konsultasi",
];
const sample = { reference: "BD-031", customer: "Maya", reviewer: "Sari" };
const files = {
  identity: { first: "KTP-foto-01.jpg", replacement: "KTP-foto-02.jpg" },
  family: { file: "KK-01.pdf" },
  certificate: { file: "Sertifikat-01.pdf" },
};

function scenes(rows: [string, string, string][], step: string): BerkasCeritaLocale["scenes"] {
  return rows.map(([rail, title, body], index) => ({
    id: sceneIds[index],
    rail,
    title,
    body,
    eyebrow: index >= 1 && index <= 6 ? `${step} ${index} · ${rail}` : rail,
    ...(index === 8 && { cta: true }),
  }));
}

const id: BerkasPanggung = {
  ...sample,
  documents: {
    identity: { ...files.identity, label: "KTP" },
    family: { ...files.family, label: "Kartu Keluarga" },
    certificate: { ...files.certificate, label: "Sertifikat tanah" },
  },
  request: "Mohon kirim ulang foto KTP yang lebih jelas dan lampirkan PDF Kartu Keluarga.",
  labels: {
    before: "Riwayat chat Maya",
    searching: "Sari mencari lampiran",
    chat: "WhatsApp",
    firstBatch: "Kiriman pertama",
    folder: "Drive · Folder pelanggan",
    checklist: "Sheets · Kelengkapan",
    unreadable: "Foto buram",
    missing: "Belum masuk",
    read: "terbaca",
    resend: "Kirim ulang",
    needsMore: "Perlu dilengkapi",
    ready: "Siap dicek staf",
    checked: "Dicek staf",
    complete: "Lengkap untuk diproses",
    newFiles: "Kiriman terbaru",
    review: "Pemeriksaan staf",
    compareData: "Sari mencocokkan data dengan dokumen terbaru.",
    sample: "Contoh alur",
  },
};

const en: BerkasPanggung = {
  ...sample,
  documents: {
    identity: { ...files.identity, label: "ID card" },
    family: { ...files.family, label: "Family card" },
    certificate: { ...files.certificate, label: "Land certificate" },
  },
  request: "Please resend a clearer photo of your ID card and attach the family card PDF.",
  labels: {
    before: "Maya's chat history",
    searching: "Sari looks for attachments",
    chat: "WhatsApp",
    firstBatch: "First submission",
    folder: "Drive · Customer folder",
    checklist: "Sheets · Checklist",
    unreadable: "Blurry photo",
    missing: "Missing",
    read: "readable",
    resend: "Please resend",
    needsMore: "More documents needed",
    ready: "Ready for staff review",
    checked: "Checked by staff",
    complete: "Complete for processing",
    newFiles: "New submission",
    review: "Staff review",
    compareData: "Sari checks the recorded details against the latest files.",
    sample: "Example workflow",
  },
};

export const berkasDokumenStory: BerkasCerita = {
  slug: "berkas-dokumen",
  id: {
    intro: "Ikuti berkas Maya dari kiriman WhatsApp sampai Sari memeriksanya di kantor notaris dan PPAT contoh.",
    scenes: scenes(
      [
        [
          "Sebelum",
          "Sari mencari lampiran satu per satu.",
          "Kiriman Maya tersebar di riwayat chat. Sari mencocokkannya dengan catatan untuk mencari berkas yang masih kurang.",
        ],
        [
          "Terima berkas",
          "Maya mengirim foto dan PDF lewat WhatsApp.",
          "Kiriman pertama berisi foto KTP dan PDF sertifikat tanah.",
        ],
        [
          "Simpan ke folder",
          "Dua lampiran masuk ke folder BD-031.",
          "Nama file mengikuti pola yang sama agar staf bisa menemukan jenis dokumen dan urutan kiriman.",
        ],
        [
          "Baca dan catat",
          "Satu dari tiga dokumen terbaca.",
          "Sertifikat terbaca. Foto KTP buram dan perlu dikirim ulang, sementara Kartu Keluarga belum masuk.",
        ],
        ["Minta dilengkapi", "Sari mengirim satu pesan untuk melengkapi berkas.", id.request],
        [
          "Perbarui berkas",
          "Kiriman baru memperbarui daftar yang sama.",
          "Foto KTP yang lebih jelas dan PDF Kartu Keluarga masuk ke BD-031. Tiga dokumen terbaca dan statusnya Siap dicek staf.",
        ],
        [
          "Periksa kelengkapan",
          "Sari memeriksa data sebelum menandai lengkap.",
          "Sari mencocokkan data yang tercatat dengan dokumen terbaru. Setelah diperiksa, BD-031 berstatus Lengkap untuk diproses.",
        ],
        [
          "Ringkasan",
          "Berkas dan status mudah ditemukan.",
          "Staf membuka satu folder berisi foto dan PDF, lalu melihat kelengkapan dari satu tabel.",
        ],
        [
          "Konsultasi",
          "Mau merapikan kiriman dokumen pelanggan?",
          "Bawa daftar dokumen yang dibutuhkan dan aturan penamaan file yang ingin dipakai.",
        ],
      ],
      "Langkah",
    ),
    stage: id,
  },
  en: {
    intro: "Follow Maya's documents from a WhatsApp submission to Sari's review at a sample notary office.",
    scenes: scenes(
      [
        [
          "Before",
          "Sari searches for attachments one by one.",
          "Maya's files are scattered through the chat. Sari compares them with her notes to find what is missing.",
        ],
        [
          "Receive files",
          "Maya sends a photo and a PDF in WhatsApp.",
          "The first submission contains a photo of her ID card and a land certificate PDF.",
        ],
        [
          "Save to folder",
          "Both attachments go into folder BD-031.",
          "The names use the same pattern so staff can identify the document type and submission order.",
        ],
        [
          "Read and record",
          "One of three documents is readable.",
          "The certificate is readable. The blurry ID photo needs resending, and the family card is missing.",
        ],
        ["Request files", "Sari asks for both files in one message.", en.request],
        [
          "Update the files",
          "The new files update the same checklist.",
          "A clearer ID photo and a family card PDF go into BD-031. All three documents are readable and the case is Ready for staff review.",
        ],
        [
          "Review completeness",
          "Sari checks the data before marking the case complete.",
          "Sari compares the recorded details with the latest documents. After her check, BD-031 is marked Complete for processing.",
        ],
        [
          "Recap",
          "The files and their status are easy to find.",
          "Staff open one folder with photos and PDFs and see what is complete in one checklist.",
        ],
        [
          "Consultation",
          "Want to organise customer documents as they arrive?",
          "Bring a list of required documents and the file naming rule you want to use.",
        ],
      ],
      "Step",
    ),
    stage: en,
  },
};
