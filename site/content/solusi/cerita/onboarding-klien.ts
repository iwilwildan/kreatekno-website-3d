import type { OnboardingCerita, OnboardingCeritaLocale, OnboardingPanggung } from "./schema";

const deal = {
  number: "OB-024",
  client: "Rani",
  company: "Toko Contoh",
  owner: "Nadia",
  signed: "2026-11-27",
  kickoff: "2026-11-30",
  zone: "WITA",
} as const;
const slots: OnboardingPanggung["slots"] = [
  { start: "09:00", end: "09:30", state: "busy" },
  { start: "10:00", end: "10:30", state: "free" },
  { start: "11:00", end: "11:30", state: "busy" },
];
const ids = [
  "sebelum",
  "deal-tercatat",
  "checklist-disiapkan",
  "draf-email",
  "slot-diusulkan",
  "staf-cek-dan-kirim",
  "penanggung-jawab-tercatat",
  "ringkasan",
  "konsultasi",
];

function scenes(rows: [string, string, string][], step: string): OnboardingCeritaLocale["scenes"] {
  return rows.map(([rail, title, body], i) => ({
    id: ids[i],
    rail,
    title,
    body,
    eyebrow: i >= 1 && i <= 6 ? `${step} ${i} · ${rail}` : rail,
    ...(i === 8 && { cta: true }),
  }));
}

export const onboardingKlienStory: OnboardingCerita = {
  slug: "onboarding-klien",
  id: {
    intro: "Ikuti satu deal baru dari tabel penjualan sampai staf mengirim sambutan dan undangan rapat awal.",
    scenes: scenes(
      [
        [
          "Sebelum",
          "Kontrak selesai, tapi klien masih menunggu.",
          "Rani belum tahu apa yang perlu disiapkan. Staf meminta logo dan mencari jadwal lewat chat terpisah.",
        ],
        [
          "Deal tercatat",
          "Paket Rani tercatat saat deal ditandai selesai.",
          "Pada Jumat, 27 November, staf menandai OB-024 sebagai Deal selesai. Toko Contoh memilih paket Kelola Iklan.",
        ],
        [
          "Checklist disiapkan",
          "Paket Kelola Iklan membuka checklist yang sesuai.",
          "Rani perlu menyiapkan akses akun iklan lewat undangan, file logo, dan materi produk.",
        ],
        [
          "Draf email",
          "AI menyiapkan sambutan untuk Rani.",
          "Draf menyebut Rani, paket yang dipilih, dan tiga persiapan. Usulan jadwal akan ditambahkan setelah kalender bersama diperiksa.",
        ],
        [
          "Slot diusulkan",
          "Ada slot kosong Senin pukul 10.00 WITA.",
          "Dari tiga pilihan, pukul 10.00 sampai 10.30 WITA kosong di kalender bersama. Waktu itu masuk ke draf sebagai usulan rapat awal.",
        ],
        [
          "Staf cek dan kirim",
          "Nadia mengecek draf dan jadwal sebelum mengirim.",
          "Nadia membaca sambutan, memeriksa ulang slot, lalu mengirim email dan undangan pada Jumat, 27 November.",
        ],
        [
          "Penanggung jawab tercatat",
          "Tabel mencatat Nadia dan menunggu respons Rani.",
          "OB-024 menyimpan penanggung jawab, waktu rapat yang diundang, dan status Menunggu respons klien.",
        ],
        [
          "Ringkasan",
          "Klien menerima langkah berikutnya setelah deal.",
          "Satu sambutan membawa daftar persiapan. Undangan rapat menyusul dari slot yang sudah dicek staf.",
        ],
        [
          "Konsultasi",
          "Mau klien baru langsung tahu langkah berikutnya?",
          "Ceritakan apa yang perlu klien siapkan setelah deal dengan timmu.",
        ],
      ],
      "Langkah",
    ),
    stage: {
      locale: "id-ID",
      deal: { ...deal, package: "Kelola Iklan" },
      slots,
      prep: ["Akses akun iklan lewat undangan", "File logo", "Materi produk"],
      messages: ["Setelah ini saya perlu siapkan apa?", "File logo bisa dikirim hari ini?", "Kapan bisa rapat?"],
      draft: {
        subject: "Selamat datang di paket Kelola Iklan",
        greeting: "Halo, Rani!",
        body: "Siapkan tiga hal ini untuk paket Kelola Iklan:",
      },
      labels: {
        deals: "Tabel deal",
        won: "Deal selesai",
        package: "Paket",
        checklist: "Checklist persiapan",
        draft: "Draf",
        schedulePending: "Jadwal menyusul",
        calendar: "Kalender bersama",
        busy: "Terisi",
        free: "Kosong",
        proposed: "Usulan jadwal",
        review: "Pemeriksaan staf",
        slotChecked: "Slot dicek ulang",
        send: "Kirim sambutan dan undangan",
        emailSent: "Email terkirim",
        inviteSent: "Undangan terkirim",
        register: "Catatan onboarding",
        owner: "Penanggung jawab",
        awaitingReply: "Menunggu respons klien",
        sample: "Contoh alur",
      },
    },
  },
  en: {
    intro: "Follow one new deal from the sales table to the welcome email and kickoff invite sent by staff.",
    scenes: scenes(
      [
        [
          "Before",
          "The deal is signed. The client is still waiting.",
          "Rani needs to know what to prepare. Staff ask for the logo and look for a meeting time in separate chats.",
        ],
        [
          "Record deal",
          "The team records Rani's package when the deal is won.",
          "On Friday, November 27, staff mark OB-024 as Deal won. Toko Contoh chose the Ad Management package.",
        ],
        [
          "Prepare checklist",
          "Ad Management opens the checklist for that package.",
          "Rani needs to prepare ad account access through an invitation, a logo file, and product materials.",
        ],
        [
          "Draft email",
          "AI drafts a welcome email for Rani.",
          "The draft names Rani and her package and lists three things to prepare. A time goes in once the team calendar is checked.",
        ],
        [
          "Propose a time",
          "The team has an opening on Monday at 10:00 WITA.",
          "Of the three options, 10:00–10:30 WITA is free on the team calendar. The draft now lists it as the proposed kickoff time.",
        ],
        [
          "Review and send",
          "Nadia checks the draft and the time before sending.",
          "Nadia reads the welcome email, checks the slot again, and sends the email and invitation on Friday, November 27.",
        ],
        [
          "Record owner",
          "The table records Nadia and waits for Rani's reply.",
          "OB-024 records the account owner, the meeting time on the invite, and the status Awaiting client response.",
        ],
        [
          "Recap",
          "The client gets clear next steps after the deal.",
          "The welcome email carries the prep list. The kickoff invite uses a slot that staff have checked.",
        ],
        [
          "Consultation",
          "Want your new clients to know what comes next?",
          "Tell us what clients need to prepare after they sign with your team.",
        ],
      ],
      "Step",
    ),
    stage: {
      locale: "en-US",
      deal: { ...deal, package: "Ad Management" },
      slots,
      prep: ["Ad account access by invitation", "Logo file", "Product materials"],
      messages: ["What should I prepare next?", "Could you send your logo today?", "When can the team meet?"],
      draft: {
        subject: "Welcome to Ad Management",
        greeting: "Hi, Rani!",
        body: "Here's what to prepare for Ad Management:",
      },
      labels: {
        deals: "Deals table",
        won: "Deal won",
        package: "Package",
        checklist: "Prep checklist",
        draft: "Draft",
        schedulePending: "Time to be proposed",
        calendar: "Team calendar",
        busy: "Busy",
        free: "Free",
        proposed: "Proposed time",
        review: "Staff review",
        slotChecked: "Slot checked again",
        send: "Send welcome and invite",
        emailSent: "Email sent",
        inviteSent: "Invite sent",
        register: "Onboarding record",
        owner: "Account owner",
        awaitingReply: "Awaiting client response",
        sample: "Sample workflow",
      },
    },
  },
};
