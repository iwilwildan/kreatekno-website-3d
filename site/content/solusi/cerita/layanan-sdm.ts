import type { SdmCerita, SdmCeritaLocale } from "./schema";

const request = { number: "CT-017", employee: "Dina", date: "2026-12-03", days: 1, before: 5, after: 4 };
const sceneIds = [
  "sebelum",
  "pesan-masuk",
  "pesan-diarahkan",
  "cek-sisa-cuti",
  "ringkasan-atasan",
  "atasan-memutuskan",
  "tercatat-dan-dikabari",
  "ringkasan",
  "konsultasi",
];

function scenes(rows: [string, string, string][], step: string): SdmCeritaLocale["scenes"] {
  return rows.map(([rail, title, body], i) => ({
    id: sceneIds[i],
    rail,
    title,
    body,
    eyebrow: i >= 1 && i <= 6 ? `${step} ${i} · ${rail}` : rail,
    ...(i === 8 && { cta: true }),
  }));
}

export const layananSdmStory: SdmCerita = {
  slug: "layanan-sdm",
  id: {
    intro: "Ikuti pengajuan cuti Dina dari chat sampai kepala toko memutuskan dan Dina menerima kabar.",
    scenes: scenes(
      [
        [
          "Sebelum",
          "Permintaan cuti dan tanya aturan tersebar di chat.",
          "Saat beberapa cabang berganti shift, pertanyaan baru mudah menutupi pengajuan cuti Dina.",
        ],
        [
          "Pesan masuk",
          "Dina mengajukan cuti satu hari lewat chat SDM.",
          "Dina dari Cabang Melati meminta cuti untuk Kamis, 3 Desember 2026. Sistem menyiapkan pengajuan CT-017.",
        ],
        [
          "Pesan diarahkan",
          "Pesan cuti dan tanya aturan masuk jalur masing-masing.",
          "Jawaban tukar shift menyebut Bagian 3.2 Kebijakan Kerja. Pertanyaan soal pengganti dari cabang lain diteruskan ke SDM karena dokumen belum membahasnya.",
        ],
        [
          "Sisa cuti dicek",
          "Sistem menemukan sisa cuti Dina lima hari.",
          "Pengajuan satu hari masih menunggu keputusan. Dina hanya menerima saldo dan status pengajuannya sendiri.",
        ],
        [
          "Ringkasan ke atasan",
          "Kepala toko menerima ringkasan pengajuan Dina.",
          "Ringkasan CT-017 memuat nama, cabang, tanggal, durasi, dan sisa cuti saat ini. Kepala toko dapat memilih Setujui atau Tolak.",
        ],
        [
          "Atasan memutuskan",
          "Kepala toko menyetujui cuti Dina.",
          "Setiap pengajuan diputuskan atasan. Untuk CT-017, kepala toko memilih Setujui. Keputusan ini baru diteruskan ke pencatatan.",
        ],
        [
          "Tercatat dan dikabari",
          "Saldo cuti Dina menjadi empat hari.",
          "Sistem mencatat CT-017 sebagai Disetujui. Dina menerima kabar dan sisa cuti terbaru lewat chat.",
        ],
        [
          "Ringkasan",
          "Satu nomor melayani cuti dan tanya aturan.",
          "Karyawan tahu ke mana harus mengirim pesan. Atasan punya tempat untuk memutuskan, dan keputusan itu tercatat.",
        ],
        [
          "Konsultasi",
          "Mau permintaan cuti dan tanya aturan lebih mudah diurus?",
          "Ceritakan cara karyawanmu mengajukan cuti dan menanyakan aturan kerja.",
        ],
      ],
      "Langkah",
    ),
    stage: {
      locale: "id-ID",
      request: { ...request, branch: "Cabang Melati", manager: "Kepala Toko Melati" },
      messages: [
        { branch: "Cabang Melati", body: "Dina mau ajukan cuti Kamis." },
        { branch: "Cabang Kenanga", body: "Tukar shift lapor ke siapa?" },
        { branch: "Cabang Anggrek", body: "Jadwal Sabtu sudah terbit?" },
      ],
      chat: { title: "Layanan SDM", ask: "Mau ajukan cuti Kamis, 3 Des.", accepted: "Cuti Kamis, 3 Des disetujui." },
      routes: { leave: "Cuti", policy: "Tanya aturan", other: "Ke SDM" },
      policy: {
        question: "Kalau mau tukar shift, harus lapor siapa?",
        answer: "Minta persetujuan kepala toko sebelum jadwal shift diubah.",
        source: "Kebijakan Kerja · Bagian 3.2 Tukar shift",
        followup: "Kalau pengganti dari cabang lain?",
        handoff: "Diteruskan ke SDM",
      },
      labels: {
        schedule: "Jadwal shift",
        leave: "Pengajuan cuti",
        date: "Tanggal cuti",
        requested: "Diminta",
        balance: "Sisa cuti",
        pending: "Menunggu keputusan",
        approved: "Disetujui",
        approve: "Setujui",
        reject: "Tolak",
        register: "Catatan cuti",
        day: "hari",
        days: "hari",
        sample: "Contoh alur",
      },
    },
  },
  en: {
    intro: "Follow Dina's leave request from chat to the store manager's decision and back to Dina.",
    scenes: scenes(
      [
        [
          "Before",
          "Leave requests and questions are scattered across chats.",
          "When several stores change shifts, newer questions can push Dina's leave request out of sight.",
        ],
        [
          "Message arrives",
          "Dina requests one day off through HR chat.",
          "Dina from the Melati branch asks for Thursday, 3 December 2026. The system prepares request CT-017.",
        ],
        [
          "Route message",
          "Leave requests and policy questions follow different paths.",
          "The shift-swap answer cites section 3.2 of the Work Policy. HR takes the cross-branch follow-up because the policy does not cover it.",
        ],
        [
          "Check balance",
          "The system finds five days of leave for Dina.",
          "The one-day request is awaiting a decision. Dina receives only her own balance and request status.",
        ],
        [
          "Send to manager",
          "The store manager gets Dina's request summary.",
          "CT-017 shows the name, branch, date, requested duration, and current balance. The store manager can approve or reject it.",
        ],
        [
          "Manager decides",
          "The store manager approves Dina's leave.",
          "The manager makes every leave decision. For CT-017, the store manager chooses Approve and sends the decision to the register.",
        ],
        [
          "Record and notify",
          "Dina's leave balance drops to four days.",
          "The system records CT-017 as Approved. Dina gets the decision and her updated balance in chat.",
        ],
        [
          "Recap",
          "One number handles leave and policy questions.",
          "Staff know where to ask, managers know where to decide, and each decision is recorded.",
        ],
        [
          "Consultation",
          "Want an easier way to handle leave and policy questions?",
          "Tell us how your employees request leave and ask about work rules.",
        ],
      ],
      "Step",
    ),
    stage: {
      locale: "en-US",
      request: { ...request, branch: "Melati branch", manager: "Melati store manager" },
      messages: [
        { branch: "Melati branch", body: "Dina needs Thursday off." },
        { branch: "Kenanga branch", body: "Who approves shift swaps?" },
        { branch: "Anggrek branch", body: "Is Saturday's roster out?" },
      ],
      chat: {
        title: "HR services",
        ask: "I'd like Thursday, Dec 3 off.",
        accepted: "Your leave on Thu, Dec 3 is approved.",
      },
      routes: { leave: "Leave", policy: "Work rules", other: "Send to HR" },
      policy: {
        question: "Who do I ask about swapping shifts?",
        answer: "Get the store manager's approval before the roster changes.",
        source: "Work Policy · Section 3.2 Shift swaps",
        followup: "What if someone covers from another branch?",
        handoff: "Passed to HR",
      },
      labels: {
        schedule: "Shift roster",
        leave: "Leave request",
        date: "Leave date",
        requested: "Requested",
        balance: "Leave balance",
        pending: "Awaiting decision",
        approved: "Approved",
        approve: "Approve",
        reject: "Reject",
        register: "Leave register",
        day: "day",
        days: "days",
        sample: "Sample workflow",
      },
    },
  },
};
