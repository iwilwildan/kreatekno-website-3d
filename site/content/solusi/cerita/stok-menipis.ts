import type { StokCerita, StokCeritaLocale, StokPanggung } from "./schema";

const sceneIds = [
  "sebelum",
  "catat-keluar",
  "perbarui-stok",
  "bandingkan-minimum",
  "peringatkan-pembelian",
  "pesan-ulang",
  "catat-masuk",
  "ringkasan",
  "konsultasi",
];
const opening = 24;
const outbound = 8;
const minimum = 20;
const ordered = 40;
const weeklyOutflow = 56;
const observedDays = 7;
const remaining = opening - outbound;
const dailyOutflow = weeklyOutflow / observedDays;
const closing = remaining + ordered;
const coverDays = remaining / dailyOutflow;
const stock = {
  opening,
  outbound,
  remaining,
  minimum,
  ordered,
  closing,
  weeklyOutflow,
  observedDays,
  dailyOutflow,
  coverDays,
};
const sample = { sku: "MG-01", clerk: "Bimo", buyer: "Rina", stock };

function scenes(rows: [string, string, string][], step: string): StokCeritaLocale["scenes"] {
  return rows.map(([rail, title, body], index) => ({
    id: sceneIds[index],
    rail,
    title,
    body,
    eyebrow: index >= 1 && index <= 6 ? `${step} ${index} · ${rail}` : rail,
    ...(index === 8 && { cta: true }),
  }));
}

const id: StokPanggung = {
  ...sample,
  item: "Minyak goreng 1 L",
  labels: {
    unit: "karton",
    before: "Catatan gudang",
    movement: "Form pergerakan barang",
    outbound: "Barang keluar",
    received: "Barang diterima",
    inventory: "Tabel stok",
    recorded: "Stok tercatat",
    remaining: "Sisa stok",
    minimum: "Minimum",
    threshold: "Bandingkan dengan minimum",
    below: "Di bawah minimum",
    estimate: `Sekitar ${coverDays} hari`,
    design: "Rancangan",
    estimateBasis: `${weeklyOutflow} karton keluar ÷ ${observedDays} hari = ${dailyOutflow} karton per hari`,
    estimateCondition: "Jika laju keluar tetap.",
    chat: "Chat pembelian",
    alert: "Peringatan stok menipis",
    order: "Pesanan ke pemasok",
    waiting: "Menunggu barang datang",
    sample: "Contoh alur",
  },
};

const en: StokPanggung = {
  ...sample,
  item: "Cooking oil, 1 L",
  labels: {
    unit: "cartons",
    before: "Warehouse notes",
    movement: "Stock movement form",
    outbound: "Goods out",
    received: "Goods received",
    inventory: "Sheets · Stock table",
    recorded: "Recorded stock",
    remaining: "Stock left",
    minimum: "Minimum",
    threshold: "Compare with the minimum",
    below: "Below minimum",
    estimate: `About ${coverDays} days`,
    design: "Design step",
    estimateBasis: `${weeklyOutflow} cartons out ÷ ${observedDays} days = ${dailyOutflow} cartons per day`,
    estimateCondition: "If stock keeps going out at the same rate.",
    chat: "WhatsApp · Purchasing",
    alert: "Low-stock alert",
    order: "Supplier order",
    waiting: "Awaiting delivery",
    sample: "Example workflow",
  },
};

export const stokMenipisStory: StokCerita = {
  slug: "stok-menipis",
  id: {
    intro: "Ikuti satu barang di toko grosir sembako contoh, dari pencatatan stok keluar sampai pesanan baru diterima.",
    scenes: scenes(
      [
        [
          "Sebelum",
          "Bimo masih harus mencocokkan catatan dengan tabel.",
          `Catatan gudang menunjukkan minyak goreng keluar. Tabel masih mencatat ${opening} karton.`,
        ],
        [
          "Catat barang keluar",
          "Bimo mencatat minyak goreng yang keluar.",
          `Ia memilih MG-01 dan mencatat ${outbound} karton keluar di form pergerakan barang.`,
        ],
        [
          "Perbarui stok",
          "Tabel menunjukkan jumlah yang tersisa.",
          `Pengeluaran ${outbound} karton mengubah stok dari ${opening} ke ${remaining} karton.`,
        ],
        [
          "Bandingkan minimum",
          "Stok turun di bawah batas minimum.",
          `Sisa ${remaining} karton dibandingkan dengan minimum ${minimum}. Kartu Rancangan memperkirakan stok bertahan sekitar ${coverDays} hari jika laju keluar tetap.`,
        ],
        [
          "Peringatkan pembelian",
          "Rina menerima peringatan di chat.",
          `Pesan mencantumkan Minyak goreng 1 L, sisa ${remaining} karton, dan minimum ${minimum} karton.`,
        ],
        [
          "Pesan ulang",
          "Rina menentukan jumlah dan memesan ke pemasok.",
          `Ia memesan ${ordered} karton. Tabel masih mencatat ${remaining} karton sambil menunggu barang datang.`,
        ],
        [
          "Catat barang masuk",
          "Stok bertambah setelah barang diterima.",
          `Bimo mencatat ${ordered} karton yang sudah datang. Dalam contoh ini, stok naik dari ${remaining} menjadi ${closing} karton.`,
        ],
        [
          "Ringkasan",
          "Staf bisa melihat perubahan stok dan menindaklanjuti peringatan.",
          "Satu form mencatat barang masuk dan keluar. Batas per barang memicu peringatan dengan tiga informasi untuk pembelian.",
        ],
        [
          "Konsultasi",
          "Mau stafmu tahu saat stok turun di bawah minimum?",
          "Bawa tabel stok, batas minimum per barang, dan nama penerima peringatan.",
        ],
      ],
      "Langkah",
    ),
    stage: id,
  },
  en: {
    intro: "Follow one item at a sample wholesale grocery store, from recording stock out to receiving a new order.",
    scenes: scenes(
      [
        [
          "Before",
          "Bimo still has to reconcile notes and the stock table.",
          `The warehouse notes show cooking oil went out. The table still shows ${opening} cartons.`,
        ],
        [
          "Record goods out",
          "Bimo records the cooking oil that went out.",
          `He selects MG-01 and records ${outbound} cartons leaving in the stock movement form.`,
        ],
        [
          "Update stock",
          "The table shows the amount left.",
          `After ${outbound} cartons go out, the stock drops from ${opening} to ${remaining}.`,
        ],
        [
          "Compare with minimum",
          "Stock falls below the minimum.",
          `The ${remaining} cartons left are below the minimum of ${minimum}. A design example estimates around ${coverDays} days of stock if the outflow stays steady.`,
        ],
        [
          "Alert purchasing",
          "Rina gets a WhatsApp alert.",
          `The message lists Cooking oil, 1 L, the ${remaining} cartons left and the ${minimum}-carton minimum.`,
        ],
        [
          "Reorder",
          "Rina chooses the quantity and orders from the supplier.",
          `She orders ${ordered} cartons. The table still shows ${remaining} available while the delivery is pending.`,
        ],
        [
          "Record goods in",
          "Stock increases after the goods arrive.",
          `Bimo records the ${ordered} cartons that arrived. In this example, stock rises from ${remaining} to ${closing} cartons.`,
        ],
        [
          "Recap",
          "The team can track stock movements and act on alerts.",
          "One form records goods in and out. The minimum for each item triggers a message with three details for purchasing.",
        ],
        [
          "Consultation",
          "Want your team to know when stock falls below the minimum?",
          "Bring the stock table, each item's minimum and who should receive the alerts.",
        ],
      ],
      "Step",
    ),
    stage: en,
  },
};
