// S8 (23 Nov 2026): drawn from the leave and policy-question branches of the public n8n.io template 4975.
// Attendance, complaints and CV screening are left out (user decision 23 Nov). The template auto-approves leave
// under two days; this page has every request decided by the manager (UU PDP article 10 on decisions made solely by
// automated processing). Status "ide": the client (set A), quote and metrics are samples. N1a added the full ID/EN copy.
import type { Solusi } from "../schema";

export const layananSdm: Solusi = {
  slug: "layanan-sdm",
  status: "ide",
  updated: "2026-11-27",
  industri: ["retail", "jasa", "logistik"],
  tim: ["sdm", "manajemen"],
  apps: ["whatsapp", "sheets", "drive"],
  metricsKind: "example",
  id: {
    title: "Cuti dan pertanyaan karyawan terjawab lewat chat",
    seoTitle: "Pengajuan Cuti dan Tanya Aturan Kerja lewat WhatsApp | Kreatekno",
    seoDescription:
      "Karyawan mengajukan cuti atau bertanya aturan kerja lewat WhatsApp. Sisa cuti dicek, atasan memutuskan lewat tombol, dan aturan dijawab dari dokumen kebijakan.",
    question:
      "Bagaimana bagian SDM melayani cuti dan pertanyaan aturan kerja tanpa menjawab hal yang sama berulang kali?",
    result: "Jawaban cepat, cuti disetujui atasan lewat tombol",
    summary:
      "Karyawan mengajukan cuti atau bertanya aturan lewat chat. Sisa cuti dicek, atasan memutuskan, jawaban diambil dari dokumen kebijakan.",
    answer:
      "Karyawan mengirim pesan ke satu nomor. Pengajuan cuti dikenali, sisa cuti dicek di tabel, lalu ringkasannya dikirim ke atasan, yang menyetujui atau menolak lewat tombol. Tabel cuti diperbarui, dan karyawan menerima kabar keputusannya. Pertanyaan aturan kerja dijawab dari dokumen kebijakan perusahaan, dan pertanyaan yang tidak ada jawabannya diteruskan ke bagian SDM.",
    client: "Jaringan minimarket, 40 karyawan (contoh)",
    painsLead:
      "Di jaringan minimarket dengan beberapa cabang dan shift, karyawan menanyakan hal yang sama ke SDM: sisa cuti, aturan tukar shift, dan tanggal gajian. Pengajuan cuti dikirim ke chat pribadi kepala toko dan sering terlupa, lalu sisa cuti dihitung ulang secara manual.",
    pains: [
      "SDM menjawab pertanyaan yang sama tentang cuti dan aturan kerja setiap minggu.",
      "Pengajuan cuti dikirim ke chat pribadi atasan dan mudah terlupa.",
      "Sisa cuti dihitung manual.",
    ],
    built: {
      h: "Satu nomor untuk urusan cuti dan aturan kerja",
      lead: "Karyawan bertanya atau mengajukan cuti lewat chat. Sisa cuti dicek dan diringkas untuk atasan, dan pertanyaan aturan kerja dijawab dari dokumen kebijakan perusahaan.",
      points: [
        "Mengenali apakah pesan karyawan berisi pengajuan cuti, pertanyaan aturan, atau urusan lain.",
        "Mengecek sisa cuti karyawan di tabel sebelum pengajuan diteruskan.",
        "Mengirim ringkasan pengajuan ke atasan dengan tombol Setujui dan Tolak.",
        "Memperbarui tabel cuti dan mengabari karyawan setelah atasan memutuskan.",
        "Menjawab pertanyaan aturan kerja dari dokumen kebijakan, dengan menyebut bagian dokumen yang dipakai.",
        "Meneruskan pertanyaan yang tidak ada di dokumen ke bagian SDM.",
      ],
    },
    quote: {
      text: "Dulu separuh chat saya berisi pertanyaan sisa cuti. Sekarang karyawan menerima jawabannya sendiri, dan saya hanya menangani yang memang perlu.",
      by: "Staf SDM jaringan minimarket",
    },
    steps: [
      { title: "Karyawan mengirim pesan", body: "Pengajuan cuti atau pertanyaan aturan kerja dikirim ke satu nomor." },
      { title: "Pesan dikenali", body: "Sisa cuti dicek, dan pertanyaan dicari jawabannya di dokumen kebijakan." },
      { title: "Atasan memutuskan", body: "Ringkasan cuti dikirim ke atasan, yang memilih Setujui atau Tolak." },
      { title: "Karyawan menerima kabar", body: "Tabel cuti diperbarui, dan keputusannya dikirim ke karyawan." },
    ],
    compare: [
      { aspect: "Pengajuan cuti", before: "Chat pribadi atasan", after: "Satu alur, tercatat" },
      { aspect: "Sisa cuti", before: "Dihitung manual", after: "Dicek otomatis" },
      { aspect: "Pertanyaan aturan", before: "Ditanyakan ke SDM", after: "Dijawab dari dokumen kebijakan" },
    ],
    fit: [
      "Usaha dengan puluhan karyawan di beberapa lokasi atau shift.",
      "Bagian SDM yang sudah punya aturan cuti dan dokumen kebijakan tertulis.",
    ],
    notFit: [
      "Perusahaan yang sudah memakai aplikasi SDM lengkap untuk cuti dan absensi.",
      "Usaha yang belum punya aturan cuti tertulis.",
    ],
    prep: [
      "Aturan dan jatah cuti",
      "Daftar karyawan dan atasannya",
      "Sisa cuti setiap karyawan saat ini",
      "Dokumen kebijakan perusahaan",
    ],
    metrics: [
      { value: "1", unit: "nomor", label: "untuk pengajuan cuti dan pertanyaan aturan kerja" },
      { value: "3", unit: "jenis pesan", label: "dikenali: cuti, aturan kerja, dan urusan lain" },
      { value: "1", unit: "tombol", label: "untuk atasan menyetujui atau menolak cuti" },
    ],
    faq: [
      {
        q: "Apakah cuti disetujui otomatis?",
        a: "Tidak. Semua pengajuan diputuskan atasan. Sistem hanya mengecek sisa cuti dan menyiapkan ringkasannya.",
      },
      {
        q: "Bagaimana kalau pertanyaannya tidak ada di dokumen?",
        a: "Pertanyaan itu diteruskan ke bagian SDM, dan bisa menjadi bahan untuk melengkapi dokumen kebijakan.",
      },
      {
        q: "Apakah karyawan bisa melihat data karyawan lain?",
        a: "Tidak. Setiap karyawan hanya menerima sisa cuti dan status pengajuannya sendiri.",
      },
      {
        q: "Apakah ini juga mengurus absensi dan penggajian?",
        a: "Tidak. Solusi ini hanya mencakup cuti dan pertanyaan aturan kerja.",
      },
    ],
  },
  en: {
    title: "Leave requests and staff questions answered in chat",
    question: "How can an HR team handle leave and policy questions without answering the same things again and again?",
    result: "Quick answers, and leave approved by managers with one tap",
    summary: "Employees request leave or ask about rules in chat. Leave balance is checked and the manager decides.",
    answer:
      "Employees send a message to one number. A leave request is recognised, the leave balance is checked in the table, and a summary goes to the manager, who approves or rejects it with a button. The leave table is updated and the employee is told the decision. Policy questions are answered from the company's policy document, and questions it does not cover are passed to the HR team.",
    client: "Minimarket chain, 40 employees (sample)",
    painsLead:
      "In a minimarket chain with several branches and shifts, employees ask HR the same things: leave balance, shift-swap rules and payday. Leave requests go to the store manager's personal chat and are easily forgotten, and leave balances are recalculated by hand.",
    pains: [
      "HR answers the same questions about leave and work rules every week.",
      "Leave requests go to a manager's personal chat and are easily forgotten.",
      "Leave balances are calculated by hand.",
    ],
    built: {
      h: "One number for leave and work-rule questions",
      lead: "Employees ask questions or request leave in chat. The leave balance is checked and summarised for the manager, and policy questions are answered from the company's policy document.",
      points: [
        "Recognises whether a message is a leave request, a policy question or something else.",
        "Checks the employee's leave balance in the table before passing the request on.",
        "Sends the manager a request summary with Approve and Reject buttons.",
        "Updates the leave table and tells the employee once the manager decides.",
        "Answers policy questions from the policy document and names the section it used.",
        "Passes questions the document does not cover to the HR team.",
      ],
    },
    quote: {
      text: "Half my chats used to be about leave balances. Now employees get the answer themselves, and I only handle what really needs me.",
      by: "HR staff at a minimarket chain",
    },
    steps: [
      { title: "Employee messages", body: "A leave request or policy question is sent to one number." },
      {
        title: "Message recognised",
        body: "The leave balance is checked, and questions are looked up in the policy document.",
      },
      { title: "Manager decides", body: "A leave summary goes to the manager, who chooses Approve or Reject." },
      { title: "Employee is told", body: "The leave table is updated and the decision is sent to the employee." },
    ],
    compare: [
      { aspect: "Leave requests", before: "A manager's personal chat", after: "One recorded flow" },
      { aspect: "Leave balance", before: "Calculated by hand", after: "Checked automatically" },
      { aspect: "Policy questions", before: "Asked to HR", after: "Answered from the policy document" },
    ],
    fit: [
      "Businesses with dozens of employees across several locations or shifts.",
      "HR teams that already have written leave rules and a policy document.",
    ],
    notFit: [
      "Companies that already use a full HR app for leave and attendance.",
      "Businesses without written leave rules yet.",
    ],
    prep: [
      "Leave rules and allowances",
      "A list of employees and their managers",
      "Each employee's current leave balance",
      "The company policy document",
    ],
    metrics: [
      { value: "1", unit: "number", label: "for leave requests and work-rule questions" },
      { value: "3", unit: "message types", label: "recognised: leave, work rules and other matters" },
      { value: "1", unit: "button", label: "for the manager to approve or reject leave" },
    ],
    faq: [
      {
        q: "Is leave approved automatically?",
        a: "No. Every request is decided by the manager. The system only checks the leave balance and prepares the summary.",
      },
      {
        q: "What if the question is not in the document?",
        a: "The question is passed to the HR team, and it can help fill gaps in the policy document.",
      },
      {
        q: "Can employees see other employees' data?",
        a: "No. Each employee only receives their own leave balance and request status.",
      },
      {
        q: "Does this also handle attendance and payroll?",
        a: "No. This solution only covers leave and work-rule questions.",
      },
    ],
  },
};
