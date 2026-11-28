import type { Solusi, SolusiLocale, SolusiSlug } from "./schema";

type CatalogCopy = Pick<Solusi["id"], "title" | "result" | "summary"> & { keywords: string };

const EN: Record<SolusiSlug, CatalogCopy> = {
  "order-grup": {
    title: "Group order assistant",
    result: "Orders from group chats are captured and recapped automatically.",
    summary: "Turn scattered group-chat orders into a clean, ready-to-process list.",
    keywords: "group chat orders spreadsheet recap sales admin whatsapp",
  },
  "booking-jasa": {
    title: "Service booking assistant",
    result: "Customers see available times and book without waiting for an admin.",
    summary: "Let customers book available slots while your team's schedule stays in sync.",
    keywords: "booking schedule slot appointment customer service field team reschedule",
  },
  "berkas-dokumen": {
    title: "Document collection assistant",
    result: "Complete, tidy files for each customer.",
    summary:
      "Customers send document photos or PDFs in chat, files are stored per customer and completeness is tracked.",
    keywords: "documents files folder upload customer admin notary property travel completeness id card",
  },
  "riset-konten": {
    title: "Content research assistant",
    result: "Your team receives audience complaints and usable content angles every morning and evening.",
    summary: "Research one topic per session from trends and popular posts, then let the team approve or skip it.",
    keywords: "content research ideas trends social media marketing threads audience",
  },
  "cs-klinik": {
    title: "Clinic customer-service assistant",
    result: "Patient chats are answered at any hour, and appointments are lined up before the clinic opens.",
    summary:
      "Answer price and schedule questions from your own data, book appointments and pass medical questions to staff.",
    keywords: "clinic patient customer service questions whatsapp hours price appointment booking calendar",
  },
  "pengingat-tagihan": {
    title: "Invoice reminder assistant",
    result: "Payments arrive on time without manual chasing.",
    summary: "Each morning unpaid invoices are checked, and customers get a polite reminder for their due-date stage.",
    keywords: "invoice payment reminder finance admin whatsapp email overdue due date stages",
  },
  "rekap-penjualan": {
    title: "Sales recap assistant",
    result: "Sales figures reach the owner's phone every night.",
    summary:
      "Every night the owner gets a sales recap with top products and comparisons, and can ask follow-up questions.",
    keywords: "sales recap report spreadsheet management distributor retail logistics nightly comparison",
  },
  "followup-prospek": {
    title: "Lead follow-up assistant",
    result: "Every morning the team knows who to contact and already has a draft message.",
    summary: "Prospects quiet for more than three days are found every morning, with a draft from their last chat.",
    keywords: "lead prospect sales property site visit follow up reminder draft message",
  },
  "carousel-konten": {
    title: "Carousel content assistant",
    result: "A carousel draft with its caption, ready to check.",
    summary: "Write one topic in a table, and slides with a caption are made on your brand frame for checking.",
    keywords: "carousel content social media instagram design marketing brand caption slides",
  },
  "asisten-sop": {
    title: "SOP assistant",
    result: "Supervisors stop answering the same questions.",
    summary: "Staff ask in chat and get answers from your SOPs, with the document and section named.",
    keywords: "sop staff training human resources operations knowledge assistant telegram clinic branches",
  },
  "stok-menipis": {
    title: "Low-stock alert assistant",
    result: "Low-stock alerts for reordering",
    summary: "Stock updates as goods move. Purchasing staff get an alert when stock falls below the minimum.",
    keywords: "stock inventory reorder warehouse retail grocery logistics operations minimum alert",
  },
  "ulasan-pelanggan": {
    title: "Customer feedback assistant",
    result: "The owner sees complaint patterns every week.",
    summary:
      "Reviews and complaints from many places are gathered in one table, with the top topics summarised weekly.",
    keywords: "reviews feedback complaints customer service management restaurant branches weekly summary",
  },
  "catat-pengeluaran": {
    title: "Expense receipt assistant",
    result: "Every receipt is recorded the same day, with its category.",
    summary: "Send a receipt photo or voice note in chat, and the shop, date, total and category are recorded.",
    keywords: "expenses receipts photo voice note bookkeeping finance owner daily recap spending",
  },
  "balas-komentar": {
    title: "Comment reply assistant",
    result: "Everyone who asks in the comments gets the details right away.",
    summary:
      "Comments with a keyword get a short reply, then the commenter receives one private message with a catalog.",
    keywords: "comments price questions social media instagram private message catalog marketing sales",
  },
  "faktur-pemasok": {
    title: "Supplier invoice assistant",
    result: "Price differences are caught before an invoice is paid.",
    summary: "Invoices from email or a folder are read, checked against supplier prices, then wait for owner approval.",
    keywords: "supplier invoices bills purchasing price check approval finance operations email folder",
  },
  "layanan-sdm": {
    title: "HR chat assistant",
    result: "Quick answers, and leave approved by managers with one tap.",
    summary: "Employees request leave or ask about rules in chat. Leave balance is checked and the manager decides.",
    keywords: "human resources leave request employees policy questions manager approval staff",
  },
  "onboarding-klien": {
    title: "Client onboarding assistant",
    result: "Welcome, checklist, and kickoff invite sent the same day",
    summary:
      "After a deal, a welcome email and prep list are drafted for your staff, and a kickoff meeting is proposed.",
    keywords: "client onboarding welcome email checklist kickoff meeting calendar services sales",
  },
};

export function catalogCopy(solution: Solusi, locale: SolusiLocale): CatalogCopy {
  if (locale === "id") {
    return {
      title: solution.id.title,
      result: solution.id.result,
      summary: solution.id.summary,
      keywords: [solution.id.question, solution.id.answer, ...solution.id.pains].join(" "),
    };
  }
  return EN[solution.slug];
}
