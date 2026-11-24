// S8 (23 Nov 2026): drawn from the public n8n.io templates 3958 (new client in the CRM, a personal welcome email, a
// calendar agent finds a free slot and sends the invite, an owner is assigned) and 4448 (new form row, onboarding
// checklist, AI welcome email). The CRM is replaced by a table. Per the user's decision (23 Nov) the AI email is a
// draft that staff check and send, unlike the templates. Status "ide": the client (set A), quote and metrics are
// samples. N1a added the full ID/EN copy.
import type { Solusi } from "../schema";

export const onboardingKlien: Solusi = {
  slug: "onboarding-klien",
  status: "ide",
  updated: "2026-11-23",
  industri: ["jasa", "properti"],
  tim: ["penjualan", "operasional"],
  apps: ["sheets", "gmail", "calendar"],
  metricsKind: "example",
  id: {
    title: "Klien baru langsung disambut setelah deal",
    question: "Bagaimana memastikan setiap klien baru tahu langkah berikutnya setelah deal?",
    result: "Sambutan, daftar persiapan, dan rapat awal di hari yang sama",
    summary:
      "Setelah deal, email sambutan dan daftar persiapan disiapkan untuk dicek staf, dan rapat awal dijadwalkan di slot kosong.",
    answer:
      "Begitu klien baru tercatat di tabel deal, checklist onboarding disiapkan sesuai paketnya. AI menulis draf email sambutan yang menyebut nama klien, paket, dan hal yang perlu disiapkan, beserta usulan jadwal rapat awal dari slot kosong di kalender tim. Staf mengecek draf itu, lalu mengirim email dan undangan rapat. Penanggung jawab klien tercatat di tabel.",
    client: "Agensi pemasaran digital (contoh)",
    painsLead:
      "Setelah klien menandatangani kontrak, agensi butuh akses akun iklan, logo, dan materi produk sebelum kampanye bisa dimulai. Tanpa sambutan yang jelas, klien menunggu kabar, materi diminta berkali-kali, dan jadwal rapat awal diatur lewat chat bolak-balik.",
    pains: [
      'Setelah deal, klien menunggu kabar dan bertanya "selanjutnya apa?".',
      "Materi yang dibutuhkan diminta berkali-kali.",
      "Jadwal rapat awal diatur lewat chat bolak-balik.",
    ],
    built: {
      h: "Sambutan, daftar persiapan, dan jadwal rapat dalam satu draf",
      lead: "Staf cukup menandai deal sebagai selesai di tabel. Draf email sambutan beserta daftar persiapan dan usulan jadwal rapat sudah siap untuk dicek.",
      points: [
        "Membaca deal baru dari tabel atau form, lengkap dengan paket yang dipilih klien.",
        "Menyiapkan checklist onboarding sesuai paket, misalnya akses akun iklan, logo, dan materi produk.",
        "Menulis draf email sambutan yang menyebut nama klien, paket, dan daftar persiapan.",
        "Mencari slot kosong di kalender tim dan mengusulkannya di draf email.",
        "Mengirim email dan undangan rapat awal setelah staf menyetujui draf.",
        "Mencatat penanggung jawab dan status onboarding klien di tabel.",
      ],
    },
    quote: {
      text: "Klien baru sekarang menerima sambutan dan daftar materi di hari yang sama dengan tanda tangan kontrak. Rapat awal juga tidak perlu diatur lewat chat lagi.",
      by: "Account manager agensi pemasaran digital",
    },
    steps: [
      { title: "Klien tercatat", body: "Deal baru dari tabel atau form, lengkap dengan paketnya." },
      { title: "Checklist disiapkan", body: "Daftar persiapan disusun sesuai paket yang dipilih klien." },
      { title: "Draf email disiapkan", body: "AI menulis sambutan, daftar persiapan, dan usulan jadwal rapat." },
      { title: "Staf mengirim", body: "Staf mengecek draf, lalu mengirim email dan undangan rapat awal." },
    ],
    compare: [
      { aspect: "Kabar setelah deal", before: "Menunggu dihubungi", after: "Hari yang sama" },
      { aspect: "Daftar persiapan", before: "Diminta berkali-kali", after: "Sekali, lengkap" },
      { aspect: "Jadwal rapat", before: "Chat bolak-balik", after: "Diusulkan dari slot kosong" },
    ],
    fit: [
      "Usaha jasa dengan proses awal yang sama untuk setiap klien.",
      "Tim yang sudah mencatat deal di satu tabel atau form.",
    ],
    notFit: ["Usaha yang hanya mendapat beberapa klien baru dalam setahun."],
    prep: [
      "Checklist onboarding per paket",
      "Contoh email sambutan yang biasa dikirim",
      "Kalender tim yang dipakai",
      "Tabel atau form tempat deal dicatat",
    ],
    metrics: [
      { value: "1", unit: "draf", label: "email sambutan untuk dicek staf sebelum dikirim" },
      { value: "1", unit: "checklist", label: "per paket, dipakai ulang untuk setiap klien" },
      { value: "1", unit: "undangan", label: "rapat awal di slot kosong tim" },
    ],
    faq: [
      {
        q: "Apakah email dikirim tanpa dicek?",
        a: "Tidak. AI hanya menyiapkan draf. Staf mengecek dan mengubahnya bila perlu, lalu mengirimnya.",
      },
      {
        q: "Bagaimana kalau klien ingin jadwal lain?",
        a: "Klien cukup membalas undangan, lalu staf mengubah jadwalnya.",
      },
      {
        q: "Bagaimana kalau paketnya berbeda-beda?",
        a: "Setiap paket punya checklist sendiri, jadi daftar persiapan di email mengikuti paket yang dipilih klien.",
      },
    ],
  },
  en: {
    title: "New clients welcomed right after the deal",
    question: "How can every new client know the next step as soon as the deal is signed?",
    result: "A welcome, a prep list and a kickoff meeting on the same day",
    summary:
      "After a deal, a welcome email and prep list are drafted for your staff, and a kickoff meeting is proposed.",
    answer:
      "Once a new client is recorded in the deals table, an onboarding checklist is prepared for their package. AI drafts a welcome email that names the client, the package and what the client needs to prepare, with a proposed kickoff time from a free slot in the team calendar. Your staff check the draft, then send the email and the meeting invite. The client's account owner is recorded in the table.",
    client: "Digital marketing agency (sample)",
    painsLead:
      "After a client signs, the agency needs ad account access, the logo and product material before a campaign can start. Without a clear welcome, the client waits for news, material is requested again and again, and the kickoff meeting is arranged through back-and-forth chat.",
    pains: [
      'After the deal, the client waits for news and asks "what happens next?".',
      "The material needed is requested again and again.",
      "The kickoff meeting is arranged through back-and-forth chat.",
    ],
    built: {
      h: "A welcome, a prep list and a meeting time in one draft",
      lead: "Staff only mark the deal as won in the table. A welcome email draft with the prep list and a proposed meeting time is ready to check.",
      points: [
        "Reads new deals from a table or form, with the package the client chose.",
        "Prepares an onboarding checklist for the package, such as ad account access, logo and product material.",
        "Drafts a welcome email that names the client, the package and the prep list.",
        "Finds a free slot in the team calendar and proposes it in the draft.",
        "Sends the email and the kickoff invite once your staff approve the draft.",
        "Records the account owner and onboarding status in the table.",
      ],
    },
    quote: {
      text: "New clients now get a welcome and a list of materials on the day they sign. The kickoff meeting no longer needs to be arranged in chat.",
      by: "Account manager at a digital marketing agency",
    },
    steps: [
      { title: "Client recorded", body: "A new deal from a table or form, with its package." },
      { title: "Checklist prepared", body: "A prep list is put together for the package the client chose." },
      { title: "Email drafted", body: "AI writes the welcome, the prep list and a proposed meeting time." },
      { title: "Staff send", body: "Staff check the draft, then send the email and the kickoff invite." },
    ],
    compare: [
      { aspect: "News after the deal", before: "Waiting to be contacted", after: "The same day" },
      { aspect: "Prep list", before: "Requested again and again", after: "Once, complete" },
      { aspect: "Meeting time", before: "Back-and-forth chat", after: "Proposed from a free slot" },
    ],
    fit: [
      "Service businesses with the same first steps for every client.",
      "Teams that already record deals in one table or form.",
    ],
    notFit: ["Businesses that only win a few new clients a year."],
    prep: [
      "An onboarding checklist for each package",
      "A sample of the welcome email you usually send",
      "The team calendar you use",
      "The table or form where deals are recorded",
    ],
    metrics: [
      { value: "1", unit: "draft", label: "welcome email for staff to check before sending" },
      { value: "1", unit: "checklist", label: "per package, reused for every client" },
      { value: "1", unit: "invite", label: "for the kickoff meeting in a free team slot" },
    ],
    faq: [
      {
        q: "Is the email sent without a check?",
        a: "No. AI only prepares a draft. Your staff check and edit it if needed, then send it.",
      },
      {
        q: "What if the client wants another time?",
        a: "The client only needs to reply to the invite, and your staff change the time.",
      },
      {
        q: "What if packages differ?",
        a: "Each package has its own checklist, so the prep list in the email follows the package the client chose.",
      },
    ],
  },
};
