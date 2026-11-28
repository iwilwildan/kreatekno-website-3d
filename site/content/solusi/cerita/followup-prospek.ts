// FP1 (22 Nov 2026): scenes follow the sales follow-up workflow on the n8n-mcp instance (daily morning schedule,
// prospect table read, filter on pending prospects quiet for more than three days, an AI agent that writes one
// short message from the last chat summary, then the message is sent). The workflow is a generic sales test, so
// the property developer, names and units here are samples. Two choices follow the user's decisions: the draft
// goes to the marketing team, who send it from their own number (outside the 24-hour window a business may only
// send approved templates), and step 6 (marking the row as contacted) is a design step the workflow does not
// have yet; the caption says so.
import type { ProspekCerita } from "./schema";

const ids = [
  "sebelum",
  "setiap-pagi",
  "ambil-prospek",
  "saring",
  "ai-menulis",
  "draf-ke-tim",
  "tabel-diperbarui",
  "hasil",
  "untuk-anda",
] as const;

export const followupProspekStory: ProspekCerita = {
  slug: "followup-prospek",
  id: {
    intro: "Ikuti perjalanan satu calon pembeli, dari baris di tabel prospek sampai pesan lanjutan yang terkirim.",
    scenes: [
      {
        id: ids[0],
        rail: "Sebelum",
        eyebrow: "Sebelum",
        title: "Calon pembeli yang minta waktu berpikir sering lupa dihubungi lagi.",
        body: "Staf marketing mengandalkan ingatan. Setelah survei lokasi, prospek yang belum memberi kabar tenggelam di antara chat baru.",
      },
      {
        id: ids[1],
        rail: "Setiap pagi",
        eyebrow: "Langkah 1 · Setiap pagi",
        title: "Pukul sepuluh pagi, daftar prospek dibaca.",
        body: "Staf tidak perlu mengingat siapa yang harus dihubungi. Pengecekan berjalan sendiri setiap hari.",
      },
      {
        id: ids[2],
        rail: "Ambil prospek",
        eyebrow: "Langkah 2 · Ambil prospek",
        title: "Setiap prospek punya satu baris: nama, ringkasan chat, status, dan tanggal.",
        body: "Tabel prospek diisi staf setelah chat atau survei lokasi. Ringkasan chat terakhir menjadi bahan pesan berikutnya.",
      },
      {
        id: ids[3],
        rail: "Saring",
        eyebrow: "Langkah 3 · Saring",
        title: "Hanya prospek yang masih menunggu dan diam lebih dari tiga hari.",
        body: "Prospek yang sudah deal, batal, atau baru saja dihubungi dilewati, sehingga tidak ada yang disapa terlalu cepat.",
      },
      {
        id: ids[4],
        rail: "AI menulis",
        eyebrow: "Langkah 4 · AI menulis",
        title: "AI menulis satu pesan pendek yang menyambung obrolan terakhir.",
        body: "Pesannya menyebut unit dan alasan prospek menunda, dengan nada santai dan sopan. Tujuannya menanyakan kabar, bukan mendesak.",
      },
      {
        id: ids[5],
        rail: "Draf ke staf",
        eyebrow: "Langkah 5 · Draf ke staf",
        title: "Staf marketing menerima pengingat dan draf pesan, lalu mengirimnya sendiri.",
        body: "Pesan dikirim dari nomor kantor yang sudah dikenal prospek. Staf masih bisa mengubah draf sebelum mengirim.",
      },
      {
        id: ids[6],
        rail: "Tabel diperbarui",
        eyebrow: "Langkah 6 · Tabel diperbarui",
        title: "Prospek yang sudah disapa tidak disapa lagi besok.",
        body: "Langkah ini rancangan kami dan belum ada di sistem aslinya. Status dan tanggal di tabel diperbarui setelah pesan terkirim.",
      },
      {
        id: ids[7],
        rail: "Hasil",
        eyebrow: "Hasil · angka contoh",
        title: "Setiap pagi, staf tahu siapa yang perlu dihubungi.",
        body: "Angka yang tampil adalah contoh, karena sistem ini belum dipakai usaha properti.",
      },
      {
        id: ids[8],
        rail: "Untukmu",
        eyebrow: "Untuk usahamu",
        title: "Mau setiap calon pembeli dihubungi tepat waktu?",
        body: "Ceritakan cara stafmu mencatat prospek sekarang. Kami bantu petakan solusinya, gratis.",
        cta: true,
      },
    ],
    stage: {
      messages: [
        { who: "Pak Dimas", text: "Diskusi dulu sama istri ya" },
        { who: "Kak Yoga", text: "Nanti saya kabari" },
        { who: "Bu Lestari", text: "Kirim brosurnya dulu kak", tag: "Belum disapa" },
        { who: "Pak Hendra", text: "Saya pikir-pikir dulu" },
        { who: "Bu Ratna", text: "Minggu depan saya survei" },
        { who: "Mas Rio", text: "Cicilannya berapa per bulan?" },
      ],
      counter: { value: 9, label: "prospek belum dihubungi lagi" },
      alarm: { time: "10.00", label: "Setiap pagi" },
      table: {
        title: "Daftar prospek",
        time: "Hari ini · 10.00",
        rows: [
          { name: "Bu Ratna", summary: "DP rumah tipe 36", status: "deal", last: "5 hari lalu", days: 5 },
          {
            name: "Pak Dimas",
            summary: "Sudah survei rumah tipe 45, mau diskusi dengan istri dulu.",
            status: "pending",
            last: "4 hari lalu",
            days: 4,
          },
          { name: "Kak Yoga", summary: "Tanya cicilan tipe 36", status: "pending", last: "2 hari lalu", days: 2 },
          { name: "Pak Hendra", summary: "Memilih proyek lain", status: "lost", last: "6 hari lalu", days: 6 },
        ],
        pick: 1,
      },
      status: { pending: "Menunggu", deal: "Deal", lost: "Batal" },
      filters: ["Masih menunggu", "Diam lebih dari 3 hari"],
      quietDays: 3,
      lead: {
        name: "Pak Dimas",
        parts: [
          "Sudah survei ",
          { field: "unit", text: "rumah tipe 45" },
          ", mau ",
          { field: "reason", text: "diskusi dengan istri" },
          " dulu.",
        ],
      },
      chips: [
        { field: "unit", value: "Rumah tipe 45" },
        { field: "reason", value: "Diskusi dengan istri" },
      ],
      draft: {
        who: "Draf AI",
        text: "Halo Pak Dimas, bagaimana hasil diskusi dengan istri soal rumah tipe 45? Kalau mau survei lagi, kabari saya ya.",
      },
      team: {
        title: "Staf marketing",
        line: "Pengingat pagi · Pak Dimas",
        send: "Kirim",
        sent: "Terkirim dari nomor kantor",
      },
      update: { status: "Sudah disapa", last: "Hari ini", tag: "Rancangan" },
      sample: "Contoh",
    },
  },
  en: {
    intro: "Follow one prospective buyer, from a row in the prospect table to the follow-up message that goes out.",
    scenes: [
      {
        id: ids[0],
        rail: "Before",
        eyebrow: "Before",
        title: "Buyers who ask for time to think are often never contacted again.",
        body: "The marketing team relies on memory. After a site visit, prospects who have not replied sink under newer chats.",
      },
      {
        id: ids[1],
        rail: "Every morning",
        eyebrow: "Step 1 · Every morning",
        title: "At ten in the morning, the prospect list is read.",
        body: "Nobody has to remember who to contact. The check runs by itself every day.",
      },
      {
        id: ids[2],
        rail: "Read prospects",
        eyebrow: "Step 2 · Read prospects",
        title: "Each prospect has one row: name, chat summary, status and date.",
        body: "The team fills the prospect table after each chat or site visit. The summary of the last chat feeds the next message.",
      },
      {
        id: ids[3],
        rail: "Filter",
        eyebrow: "Step 3 · Filter",
        title: "Only prospects who are still pending and quiet for more than three days.",
        body: "Prospects who have bought, dropped out or were contacted recently are skipped, so nobody is chased too soon.",
      },
      {
        id: ids[4],
        rail: "AI writes",
        eyebrow: "Step 4 · AI writes",
        title: "AI writes one short message that picks up the last conversation.",
        body: "The message mentions the unit and the reason the prospect paused, in a relaxed and polite tone. It asks for news, it does not push.",
      },
      {
        id: ids[5],
        rail: "Draft to team",
        eyebrow: "Step 5 · Draft to team",
        title: "The marketing team gets a reminder and a draft, then sends it themselves.",
        body: "The message goes out from the team number the prospect already knows. The team can still edit the draft before sending.",
      },
      {
        id: ids[6],
        rail: "Table updated",
        eyebrow: "Step 6 · Table updated",
        title: "A prospect who was contacted today is not contacted again tomorrow.",
        body: "This step is our design and is not in the original system yet. The status and date in the table are updated once the message is sent.",
      },
      {
        id: ids[7],
        rail: "Results",
        eyebrow: "Results · sample figures",
        title: "Every morning, the team knows who to contact.",
        body: "The figures shown are samples, because no property sales team uses this system yet.",
      },
      {
        id: ids[8],
        rail: "For you",
        eyebrow: "For your business",
        title: "Want every prospective buyer contacted on time?",
        body: "Tell us how your team records prospects today. We will map the solution with you, free of charge.",
        cta: true,
      },
    ],
    stage: {
      messages: [
        { who: "Pak Dimas", text: "Let me ask my wife" },
        { who: "Kak Yoga", text: "I'll let you know" },
        { who: "Bu Lestari", text: "Send the brochure first", tag: "No follow-up" },
        { who: "Pak Hendra", text: "I'll think it over" },
        { who: "Bu Ratna", text: "Visiting the site next week" },
        { who: "Mas Rio", text: "What's the monthly instalment?" },
      ],
      counter: { value: 9, label: "prospects not contacted again" },
      alarm: { time: "10.00 am", label: "Every morning" },
      table: {
        title: "Prospect list",
        time: "Today · 10.00 am",
        rows: [
          { name: "Bu Ratna", summary: "Paid deposit, type 36 house", status: "deal", last: "5 days ago", days: 5 },
          {
            name: "Pak Dimas",
            summary: "Visited the type 45 house, wants to talk it over at home first.",
            status: "pending",
            last: "4 days ago",
            days: 4,
          },
          {
            name: "Kak Yoga",
            summary: "Asked about type 36 instalments",
            status: "pending",
            last: "2 days ago",
            days: 2,
          },
          { name: "Pak Hendra", summary: "Chose another project", status: "lost", last: "6 days ago", days: 6 },
        ],
        pick: 1,
      },
      status: { pending: "Pending", deal: "Won", lost: "Lost" },
      filters: ["Still pending", "Quiet over 3 days"],
      quietDays: 3,
      lead: {
        name: "Pak Dimas",
        parts: [
          "Visited the ",
          { field: "unit", text: "type 45 house" },
          ", wants to ",
          { field: "reason", text: "talk it over at home" },
          " first.",
        ],
      },
      chips: [
        { field: "unit", value: "Type 45 house" },
        { field: "reason", value: "Talk it over at home" },
      ],
      draft: {
        who: "AI draft",
        text: "Hi Pak Dimas, did you talk it over at home about the type 45 house? Happy to arrange another visit.",
      },
      team: {
        title: "Marketing team",
        line: "Morning reminder · Pak Dimas",
        send: "Send",
        sent: "Sent from the team number",
      },
      update: { status: "Contacted", last: "Today", tag: "Design" },
      sample: "Sample",
    },
  },
};
