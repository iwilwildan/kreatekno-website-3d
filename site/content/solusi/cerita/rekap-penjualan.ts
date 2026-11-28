import type { RekapCerita, RekapCeritaLocale, RekapPanggung } from "./schema";

const sceneIds = [
  "sebelum",
  "baca-tabel",
  "jumlahkan-penjualan",
  "bandingkan-periode",
  "kirim-rekap",
  "pemilik-bertanya",
  "jawab-dari-tabel",
  "ringkasan",
  "konsultasi",
];
const rows: RekapPanggung["rows"] = [
  { product: "tea", area: "north", cartons: 30, amount: 3_600_000 },
  { product: "tea", area: "south", cartons: 20, amount: 2_400_000 },
  { product: "water", area: "north", cartons: 40, amount: 3_200_000 },
  { product: "juice", area: "south", cartons: 20, amount: 2_800_000 },
];
const total = rows.reduce((sum, { amount }) => sum + amount, 0);
const sumArea = (area: "north" | "south") =>
  rows.filter((row) => row.area === area).reduce((sum, row) => sum + row.amount, 0);
const top = (["tea", "water", "juice"] as const)
  .map((product) => ({
    product,
    cartons: rows.filter((row) => row.product === product).reduce((sum, row) => sum + row.cartons, 0),
  }))
  .sort((a, b) => b.cartons - a.cartons)[0];
const sample = {
  date: "2026-11-26",
  clerk: "Bayu",
  owner: "Nita",
  rows,
  total,
  areaTotals: { north: sumArea("north"), south: sumArea("south") },
  top,
};
const comparison = (date: string, amount: number, label: string) => ({
  date,
  amount,
  label,
  change: ((total - amount) / amount) * 100,
});
const history = { product: "tea", north: 140, south: 100, cartons: 140 + 100 } as const;

function scenes(rows: [string, string, string][], step: string): RekapCeritaLocale["scenes"] {
  return rows.map(([rail, title, body], index) => ({
    id: sceneIds[index],
    rail,
    title,
    body,
    eyebrow: index >= 1 && index <= 6 ? `${step} ${index} · ${rail}` : rail,
    ...(index === 8 && { cta: true }),
  }));
}

const id: RekapPanggung = {
  ...sample,
  locale: "id-ID",
  at: "21.00 WIB",
  products: { tea: "Teh melati 350 ml", water: "Air mineral 600 ml", juice: "Sari jeruk 250 ml" },
  areas: { north: "Utara", south: "Selatan" },
  periods: [comparison("2026-11-25", 10_000_000, "Kemarin"), comparison("2026-11-19", 15_000_000, "Kamis lalu")],
  question: "Bulan lalu teh melati terjual berapa karton?",
  history: { ...history, month: "Oktober 2026", source: "Rekap produk Oktober" },
  labels: {
    before: "Catatan Bayu",
    waiting: "Nita menunggu angka hari ini",
    sheet: "Sheets · Tabel penjualan",
    product: "Produk",
    area: "Wilayah",
    cartons: "karton",
    amount: "Nilai",
    grouped: "Rekap per wilayah",
    total: "Total penjualan",
    top: "Terlaris menurut karton",
    compare: "Perbandingan penjualan",
    today: "Hari ini",
    whatsapp: "WhatsApp",
    recap: "Rekap penjualan",
    assistant: "Asisten penjualan",
    source: "Sumber",
    sample: "Contoh alur",
  },
};

const en: RekapPanggung = {
  ...sample,
  locale: "en-GB",
  at: "9:00 pm WIB",
  products: { tea: "Jasmine tea 350 ml", water: "Mineral water 600 ml", juice: "Orange juice 250 ml" },
  areas: { north: "North", south: "South" },
  periods: [comparison("2026-11-25", 10_000_000, "Yesterday"), comparison("2026-11-19", 15_000_000, "Last Thursday")],
  question: "How many cartons of jasmine tea sold last month?",
  history: { ...history, month: "October 2026", source: "October product recap" },
  labels: {
    before: "Bayu's notes",
    waiting: "Nita waits for today's figures",
    sheet: "Sheets · Sales table",
    product: "Product",
    area: "Area",
    cartons: "cartons",
    amount: "Amount",
    grouped: "Sales by area",
    total: "Total sales",
    top: "Top seller by cartons",
    compare: "Sales comparison",
    today: "Today",
    whatsapp: "WhatsApp",
    recap: "Sales recap",
    assistant: "Sales assistant",
    source: "Source",
    sample: "Example workflow",
  },
};

export const rekapPenjualanStory: RekapCerita = {
  slug: "rekap-penjualan",
  id: {
    intro:
      "Ikuti penjualan distributor minuman contoh, dari empat baris di tabel hingga pertanyaan Nita tentang bulan lalu.",
    scenes: scenes(
      [
        [
          "Sebelum",
          "Bayu masih mengumpulkan angka penjualan.",
          "Nita menunggu kabar. Angka per produk dan wilayah sudah tercatat di tabel.",
        ],
        [
          "Baca tabel",
          "Rekap membaca empat baris penjualan pukul 21.00 WIB.",
          "Catatan Kamis, 26 Nov 2026 memuat produk, wilayah, jumlah karton, dan nilai penjualan.",
        ],
        [
          "Jumlahkan penjualan",
          "Total hari ini Rp12 juta.",
          "Utara menyumbang Rp6,8 juta dan Selatan Rp5,2 juta. Teh melati terlaris dengan 50 karton.",
        ],
        [
          "Bandingkan periode",
          "Dua pembanding memberi gambaran yang berbeda.",
          "Penjualan naik 20% dari Rabu, 25 Nov, dan turun 20% dari Kamis sebelumnya, 19 Nov.",
        ],
        [
          "Kirim rekap",
          "Nita menerima satu rekap di WhatsApp.",
          "Pesan malam berisi Rp12 juta, Teh melati 50 karton, dan perubahan terhadap kedua tanggal pembanding.",
        ],
        ["Pemilik bertanya", "Nita ingin tahu penjualan teh melati bulan lalu.", id.question],
        [
          "Jawab dari tabel",
          "Jawaban menyebut 240 karton pada Oktober 2026.",
          "Utara tercatat 140 karton dan Selatan 100. Balasan menyebut tab Sheets Rekap produk Oktober sebagai sumber.",
        ],
        [
          "Ringkasan",
          "Angka harian dan detailnya bisa ditelusuri dari satu rekap.",
          "Pemilik menerima perbandingan dengan kemarin dan hari yang sama minggu lalu, lalu bisa bertanya tentang periode yang tersedia.",
        ],
        [
          "Konsultasi",
          "Mau menerima rekap dari tabel penjualan yang sudah dipakai?",
          "Bawa tabel penjualan, angka yang ingin dilihat, dan jam rekap yang diinginkan.",
        ],
      ],
      "Langkah",
    ),
    stage: id,
  },
  en: {
    intro: "Follow a sample beverage distributor's sales from four table rows to Nita's question about last month.",
    scenes: scenes(
      [
        [
          "Before",
          "Bayu is still pulling together the sales figures.",
          "Nita is waiting for an update. The table already has the figures by product and area.",
        ],
        [
          "Read the table",
          "The recap reads four sales rows at 9:00 pm WIB.",
          "The entries for Thursday, 26 Nov 2026 show the product, area, number of cartons and sales amount.",
        ],
        [
          "Total the sales",
          "Today's total is Rp12 million.",
          "North accounts for Rp6.8 million and South for Rp5.2 million. Jasmine tea sold the most, with 50 cartons.",
        ],
        [
          "Compare dates",
          "The two dates tell different stories.",
          "Sales are up 20% from Wednesday, 25 Nov, and down 20% from the previous Thursday, 19 Nov.",
        ],
        [
          "Send the recap",
          "Nita gets one recap in WhatsApp.",
          "The evening message shows Rp12 million, 50 cartons of jasmine tea, and the changes against both comparison dates.",
        ],
        ["Owner asks", "Nita wants to see last month's jasmine tea sales.", en.question],
        [
          "Answer from the table",
          "The reply shows 240 cartons in October 2026.",
          "North recorded 140 cartons and South 100. The reply cites the October product recap tab in Sheets.",
        ],
        [
          "Recap",
          "The daily figures and their details are easy to trace.",
          "The owner gets comparisons with yesterday and the same day last week and can ask about periods in the table.",
        ],
        [
          "Consultation",
          "Want a recap from the sales table you already use?",
          "Bring your sales table, the figures you want to see and your preferred time for the recap.",
        ],
      ],
      "Step",
    ),
    stage: en,
  },
};
