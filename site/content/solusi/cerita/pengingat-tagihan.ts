import type { TagihanCerita, TagihanCeritaLocale, TagihanPanggung } from "./schema";

const sceneIds = [
  "sebelum",
  "cek-pagi",
  "ingatkan-h-3",
  "ingatkan-hari-h",
  "ingatkan-h-plus-7",
  "catat-pembayaran",
  "serahkan-h-plus-30",
  "ringkasan",
  "konsultasi",
];
const finance = "Lia";
const owner = "Arif";
const stages = ["H-3", "H", "H+7"] as const;
const offsets = [-3, 0, 7] as const;

function dates(locale: string) {
  const format = new Intl.DateTimeFormat(locale, { day: "numeric", month: "short", timeZone: "UTC" });
  const at = (offset: number) => {
    const date = new Date(Date.UTC(2026, 10, 10 + offset));
    return { iso: date.toISOString().slice(0, 10), label: format.format(date) };
  };
  return { due: at(0), paidOn: at(8), handedOffOn: at(30), sentOn: offsets.map(at) };
}

function invoices(locale: string) {
  const rupiah = new Intl.NumberFormat(locale, { maximumFractionDigits: 0 });
  return {
    primary: { code: "AC-028", customer: "Ruko A", amount: `Rp${rupiah.format(450_000)}` },
    overdue: { code: "AC-029", customer: "Ruko B", amount: `Rp${rupiah.format(600_000)}` },
  };
}

function messages(sentOn: TagihanPanggung["due"][], bodies: [string, string, string]): TagihanPanggung["messages"] {
  return [
    { stage: stages[0], date: sentOn[0], body: bodies[0] },
    { stage: stages[1], date: sentOn[1], body: bodies[1] },
    { stage: stages[2], date: sentOn[2], body: bodies[2] },
  ];
}

function scenes(rows: [string, string, string][], step: string): TagihanCeritaLocale["scenes"] {
  return rows.map(([rail, title, body], index) => ({
    id: sceneIds[index],
    rail,
    title,
    body,
    eyebrow: index >= 1 && index <= 6 ? `${step} ${index} · ${rail}` : rail,
    ...(index === 8 && { cta: true }),
  }));
}

const { sentOn: datesId, ...invoiceDatesId } = dates("id-ID");
const id: TagihanPanggung = {
  ...invoiceDatesId,
  ...invoices("id-ID"),
  finance,
  owner,
  morning: "07.00 WIB",
  messages: messages(datesId, [
    "Halo, tagihan servis AC jatuh tempo pada 10 Nov. Terima kasih.",
    "Halo, tagihan servis AC jatuh tempo hari ini. Terima kasih.",
    "Halo, tagihan servis AC masih tercatat belum lunas. Mohon cek kembali. Terima kasih.",
  ]),
  labels: {
    before: "Catatan Lia",
    history: "Riwayat pesan",
    ledger: "Sheets · Tabel tagihan",
    open: "Belum lunas",
    due: "Jatuh tempo",
    chat: "WhatsApp",
    paymentInstructions: "Lihat petunjuk bayar di invoice.",
    logged: "Riwayat pengingat",
    sent: "Terkirim",
    payment: "Pembayaran dicatat",
    confirmed: "Pembayaran dikonfirmasi",
    paid: "Lunas",
    skipped: "Pengingat berikutnya dilewati",
    handoff: "Tindak lanjut H+30",
    owner: "Pemilik",
    followUp: "Diteruskan untuk dihubungi langsung",
    sample: "Contoh alur",
  },
};

const { sentOn: datesEn, ...invoiceDatesEn } = dates("en-GB");
const en: TagihanPanggung = {
  ...invoiceDatesEn,
  ...invoices("en-GB"),
  finance,
  owner,
  morning: "7:00 am WIB",
  messages: messages(datesEn, [
    "Hello, your AC service invoice is due on 10 Nov. Thank you.",
    "Hello, your AC service invoice is due today. Thank you.",
    "Hello, our records show your AC service invoice is still unpaid. Please check when you can. Thank you.",
  ]),
  labels: {
    before: "Lia's notes",
    history: "Message history",
    ledger: "Sheets · Invoice table",
    open: "Unpaid",
    due: "Due date",
    chat: "WhatsApp",
    paymentInstructions: "See the payment instructions on your invoice.",
    logged: "Reminder history",
    sent: "Sent",
    payment: "Payment recorded",
    confirmed: "Payment confirmed",
    paid: "Paid",
    skipped: "Future reminders skipped",
    handoff: "Day 30 follow-up",
    owner: "Owner",
    followUp: "Handed over for direct follow-up",
    sample: "Example workflow",
  },
};

export const pengingatTagihanStory: TagihanCerita = {
  slug: "pengingat-tagihan",
  id: {
    intro:
      "Ikuti dua tagihan jasa servis AC contoh untuk melihat kapan pelanggan diingatkan dan kapan pemilik menindaklanjuti.",
    scenes: scenes(
      [
        [
          "Sebelum",
          "Lia mencari tanggal dan pesan di tempat terpisah.",
          "Tagihan berikutnya ada di tabel. Riwayat pengingat masih harus dicari di chat.",
        ],
        [
          "Cek pagi",
          "Tabel diperiksa setiap pagi pukul 07.00 WIB.",
          "AC-028 dan AC-029 masih terbuka. Keduanya jatuh tempo 10 Nov 2026.",
        ],
        [
          "H-3",
          "Tiga hari sebelum jatuh tempo, pelanggan diingatkan.",
          "Pada 7 Nov, pesan AC-028 menyebut jatuh tempo 10 Nov, jumlah Rp450.000, dan petunjuk bayar di invoice. Tanggal kirim dicatat.",
        ],
        [
          "Hari jatuh tempo",
          "Pesan berikutnya dikirim pada hari jatuh tempo.",
          "Pada 10 Nov, AC-028 masih terbuka. Pelanggan menerima pengingat bahwa tagihannya jatuh tempo hari ini. Pengingat dicatat lagi sesuai tahapnya.",
        ],
        [
          "H+7",
          "Tujuh hari kemudian, tagihan masih terbuka.",
          "Pada 17 Nov, pelanggan diingatkan bahwa AC-028 masih tercatat belum lunas. Riwayat menyimpan tanggal dan tahap pengingat.",
        ],
        [
          "Catat pembayaran",
          "Lia mengonfirmasi pembayaran dan mencatat Lunas.",
          "Pembayaran AC-028 dikonfirmasi pada 18 Nov. Pemeriksaan berikutnya melewati tagihan ini.",
        ],
        [
          "Serahkan H+30",
          "Arif menerima tagihan yang masih terbuka.",
          "Pada 10 Des, AC-028 tetap Lunas. AC-029 masih terbuka pada H+30, sehingga diteruskan ke Arif untuk dihubungi langsung.",
        ],
        [
          "Ringkasan",
          "Tim tahu tagihan mana yang perlu ditindaklanjuti.",
          "Tiga pengingat tercatat per tahap. Tagihan terbuka diteruskan ke pemilik pada H+30.",
        ],
        [
          "Konsultasi",
          "Mau pengingat tagihan mengikuti jadwal usaha Anda?",
          "Bawa daftar tagihan, tanggal jatuh tempo, dan contoh bahasa pengingat yang biasa dipakai.",
        ],
      ],
      "Langkah",
    ),
    stage: id,
  },
  en: {
    intro: "Follow two sample AC service invoices and see when customers get reminders and when the owner takes over.",
    scenes: scenes(
      [
        [
          "Before",
          "Lia checks dates and messages in separate places.",
          "The next invoice is in the table. She still needs to search the chat for its reminder history.",
        ],
        [
          "Morning check",
          "The table is checked every morning at 7:00 am WIB.",
          "AC-028 and AC-029 are still open. Both are due on 10 Nov 2026.",
        ],
        [
          "Three days before",
          "The customer gets a reminder three days before the due date.",
          "On 7 Nov, the AC-028 message lists the 10 Nov due date, the Rp450,000 amount and where to find payment instructions. The send date is logged.",
        ],
        [
          "Due date",
          "The next reminder goes out on the due date.",
          "On 10 Nov, AC-028 is still open. The customer is told the invoice is due today. The send is logged for this stage.",
        ],
        [
          "Seven days later",
          "Seven days later, the invoice is still open.",
          "On 17 Nov, the customer is reminded that AC-028 is still unpaid. The log records the date and stage of the reminder.",
        ],
        [
          "Record payment",
          "Lia confirms the payment and marks the invoice Paid.",
          "Payment for AC-028 is confirmed on 18 Nov. Later checks skip the invoice.",
        ],
        [
          "Handoff at day 30",
          "Arif takes over the invoice that is still open.",
          "On 10 Dec, AC-028 is still Paid. AC-029 is still open 30 days after the due date, so it goes to Arif for direct follow-up.",
        ],
        [
          "Recap",
          "The team knows which invoices still need attention.",
          "Three reminders are logged by stage. An invoice still open 30 days after the due date goes to the owner.",
        ],
        [
          "Consultation",
          "Want reminders that follow your billing schedule?",
          "Bring your invoice list, due dates and an example of how you usually word a reminder.",
        ],
      ],
      "Step",
    ),
    stage: en,
  },
};
