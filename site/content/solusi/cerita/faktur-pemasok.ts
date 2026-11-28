import type { FakturCerita, FakturCeritaLocale } from "./schema";

const example = { number: "FP-028", total: 1740000, agreedTotal: 1710000 };
const cement = { quantity: 20, billed: 64500, agreed: 63000 };
const coating = { quantity: 4, billed: 112500, agreed: 112500 };

const ids = [
  "sebelum",
  "faktur-masuk",
  "isi-dibaca",
  "kolom-terisi",
  "harga-dicocokkan",
  "masuk-tabel",
  "keputusan-pemilik",
  "ringkasan",
  "konsultasi",
];

type Scene = FakturCeritaLocale["scenes"][number];

function scenes(rows: [rail: string, title: string, body: string][], step: string): Scene[] {
  return rows.map(([rail, title, body], index) => ({
    id: ids[index],
    rail,
    eyebrow: index > 0 && index < 7 ? `${step} ${index} · ${rail}` : rail,
    title,
    body,
    ...(index === 8 && { cta: true }),
  }));
}

export const fakturPemasokStory: FakturCerita = {
  slug: "faktur-pemasok",
  id: {
    intro: "Ikuti satu faktur semen, dari lampiran email sampai keputusan pemilik toko bangunan.",
    scenes: scenes(
      [
        [
          "Sebelum",
          "Selisih kecil per sak mudah terlewat.",
          "Saat staf mengetik ulang banyak faktur, harga semen yang berubah bisa luput sampai faktur dibayar.",
        ],
        [
          "Faktur masuk",
          "Faktur PDF tiba lewat email.",
          "Toko mengumpulkan faktur dari email dan folder bersama. Salinan FP-028 juga tersimpan di folder dengan nama file lain.",
        ],
        [
          "Isi dibaca",
          "Sistem mengambil teks dari faktur.",
          "Nomor, pemasok, tanggal, jatuh tempo, baris barang, dan total dibaca dari dokumen.",
        ],
        [
          "Kolom terisi",
          "AI mengisi enam kolom dari isi faktur.",
          "Data FP-028 masuk ke kolom yang sama dengan faktur pemasok lain, sehingga staf bisa memeriksanya di satu tempat.",
        ],
        [
          "Harga dicocokkan",
          "Harga semen berbeda Rp1.500 per sak.",
          "Harga pelapis cocok. Harga semen di faktur Rp64.500 per sak, sedangkan daftar pemasok mencatat Rp63.000. Untuk 20 sak, selisihnya Rp30.000.",
        ],
        [
          "Masuk tabel",
          "FP-028 tercatat sekali dengan tanda selisih.",
          "Sistem menemukan pemasok, nomor, tanggal, dan total yang sama pada salinan dari folder. Tabel tetap berisi satu baris untuk faktur ini.",
        ],
        [
          "Keputusan pemilik",
          "Pemilik memilih Tolak karena harga semen berbeda.",
          "Tabel mencatat status Ditolak · perlu koreksi. Staf bisa meminta faktur koreksi, dan bagian keuangan menangani pembayaran setelah ada persetujuan.",
        ],
        [
          "Ringkasan",
          "Faktur, selisih, dan keputusan ada di satu catatan.",
          "Staf bisa melihat angka yang diperiksa dan keputusan pemilik tanpa mencari percakapan lama.",
        ],
        [
          "Konsultasi",
          "Mau selisih harga pemasok kelihatan sebelum bayar?",
          "Ceritakan cara kamu menerima dan memeriksa faktur pemasok.",
        ],
      ],
      "Langkah",
    ),
    stage: {
      locale: "id-ID",
      invoice: {
        ...example,
        supplier: "Pemasok S-02",
        issued: "25 Nov 2026",
        due: "9 Des 2026",
        lines: [
          { ...cement, item: "Semen 50 kg", unit: "sak" },
          { ...coating, item: "Pelapis antibocor", unit: "ember" },
        ],
      },
      labels: {
        number: "Nomor faktur",
        supplier: "Pemasok",
        issued: "Tanggal",
        due: "Jatuh tempo",
        items: "Daftar barang",
        total: "Total faktur",
      },
      source: { email: "Email", folder: "Folder bersama", pdf: "FP-028.pdf", copy: "Semen November.pdf" },
      compare: {
        title: "Cek harga per unit",
        billed: "Di faktur",
        agreed: "Daftar harga",
        match: "Cocok",
        difference: "Selisih",
      },
      ledger: {
        title: "Tabel faktur",
        pending: "Menunggu keputusan",
        rejected: "Ditolak · perlu koreksi",
        duplicate: "Sudah tercatat",
      },
      approval: {
        title: "Keputusan pemilik",
        accept: "Setujui",
        reject: "Tolak",
        reason: "Harga semen berbeda dari daftar harga.",
      },
      manual: "Ketik ulang faktur",
      document: "Faktur pemasok",
      extracted: "Enam kolom terisi",
      sample: "Contoh alur",
    },
  },
  en: {
    intro: "Follow one cement invoice from an email attachment to a building supply store owner's decision.",
    scenes: scenes(
      [
        [
          "Before",
          "Small price differences per bag are easy to miss.",
          "When staff retype several invoices, a change in cement prices can go unnoticed until after payment.",
        ],
        [
          "Invoice arrives",
          "The PDF invoice arrives by email.",
          "The store collects invoices by email and in a shared folder. A copy of FP-028 is saved in the folder under another filename.",
        ],
        [
          "Read document",
          "The system reads the text on the invoice.",
          "It reads the number, supplier, dates, line items, and total from the document.",
        ],
        [
          "Fill fields",
          "AI fills six fields using the invoice.",
          "FP-028 goes into the same fields as the other supplier invoices, so staff can review it in one place.",
        ],
        [
          "Check prices",
          "Cement costs Rp1,500 more per bag on the invoice.",
          "The coating price matches. Cement is Rp64,500 per bag on the invoice and Rp63,000 on the agreed price list. For 20 bags, the difference is Rp30,000.",
        ],
        [
          "Record invoice",
          "FP-028 is recorded once and flagged.",
          "The copy in the folder has the same supplier, number, date, and total. The table keeps one row for the invoice.",
        ],
        [
          "Owner decides",
          "The owner rejects the invoice over the cement price.",
          "The table records Rejected · needs correction. Staff can request a corrected invoice, and finance handles payment once approval is in place.",
        ],
        [
          "Recap",
          "The invoice, variance, and decision are in one place.",
          "Staff can see which figures were checked and what the owner decided without searching old chats.",
        ],
        [
          "Consultation",
          "Want to spot supplier price differences before paying?",
          "Tell us how you receive and check supplier invoices.",
        ],
      ],
      "Step",
    ),
    stage: {
      locale: "en-US",
      invoice: {
        ...example,
        supplier: "Supplier S-02",
        issued: "25 Nov 2026",
        due: "9 Dec 2026",
        lines: [
          { ...cement, item: "Cement 50 kg", unit: "bags" },
          { ...coating, item: "Waterproof coating", unit: "pails" },
        ],
      },
      labels: {
        number: "Invoice number",
        supplier: "Supplier",
        issued: "Invoice date",
        due: "Due date",
        items: "Line items",
        total: "Invoice total",
      },
      source: { email: "Email", folder: "Shared folder", pdf: "FP-028.pdf", copy: "November cement.pdf" },
      compare: {
        title: "Unit price check",
        billed: "On invoice",
        agreed: "Price list",
        match: "Match",
        difference: "Difference",
      },
      ledger: {
        title: "Invoice register",
        pending: "Awaiting decision",
        rejected: "Rejected · needs correction",
        duplicate: "Already recorded",
      },
      approval: {
        title: "Owner decision",
        accept: "Approve",
        reject: "Reject",
        reason: "The cement price differs from the price list.",
      },
      manual: "Retype invoice",
      document: "Supplier invoice",
      extracted: "Six fields filled",
      sample: "Sample workflow",
    },
  },
};
