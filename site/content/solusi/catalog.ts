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
    summary: "Let customers book available slots while your team's calendar stays in sync.",
    keywords: "booking schedule calendar appointment customer service field team",
  },
  "berkas-dokumen": {
    title: "Document collection assistant",
    result: "Customer documents arrive in the right folder with their status recorded.",
    summary: "Collect, label and check customer files without sorting chat attachments by hand.",
    keywords: "documents files drive upload customer admin travel property",
  },
  "riset-konten": {
    title: "Content research assistant",
    result: "Your team receives relevant content ideas with usable angles each week.",
    summary: "Research topics and turn them into a practical weekly content queue.",
    keywords: "content research ideas social media marketing instagram",
  },
  "cs-klinik": {
    title: "Clinic customer-service assistant",
    result: "Routine patient questions are answered consistently, including after hours.",
    summary: "Answer common clinic questions and route cases that need a human.",
    keywords: "clinic patient customer service questions whatsapp hours price",
  },
  "pengingat-tagihan": {
    title: "Invoice reminder assistant",
    result: "Payment reminders go out on schedule without awkward manual follow-ups.",
    summary: "Send polite, timely invoice reminders and keep the follow-up status visible.",
    keywords: "invoice payment reminder finance admin whatsapp overdue",
  },
  "rekap-penjualan": {
    title: "Sales recap assistant",
    result: "Owners receive a clear sales recap without waiting for tomorrow's spreadsheet.",
    summary: "Combine daily sales records into a timely summary for the people who need it.",
    keywords: "sales recap report spreadsheet management retail logistics",
  },
  "followup-prospek": {
    title: "Lead follow-up assistant",
    result: "Every lead gets recorded and followed up at the right time.",
    summary: "Keep promising leads from disappearing after an ad, chat or site visit.",
    keywords: "lead prospect sales property ads follow up customer",
  },
  "carousel-konten": {
    title: "Carousel content assistant",
    result: "A brief becomes a structured carousel draft your team can refine.",
    summary: "Speed up carousel production from first outline to a review-ready draft.",
    keywords: "carousel content social media instagram design marketing",
  },
  "asisten-sop": {
    title: "SOP assistant",
    result: "Staff can ask questions and receive answers grounded in approved SOPs.",
    summary: "Make operating procedures easier to find and use during everyday work.",
    keywords: "sop staff training human resources operations knowledge assistant",
  },
  "stok-menipis": {
    title: "Low-stock alert assistant",
    result: "Your team is warned before important stock runs out.",
    summary: "Watch stock levels and prompt reordering before a shortage disrupts sales.",
    keywords: "stock inventory reorder warehouse retail logistics operations",
  },
  "ulasan-pelanggan": {
    title: "Customer feedback assistant",
    result: "Feedback from different channels becomes a clear list of recurring issues.",
    summary: "Collect customer feedback and surface the themes your team should address first.",
    keywords: "reviews feedback complaints customer service management sentiment",
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
