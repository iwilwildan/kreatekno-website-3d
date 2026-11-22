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
    result: "Customer documents arrive in the right folder with their status recorded.",
    summary: "Collect, label and check customer files without sorting chat attachments by hand.",
    keywords: "documents files drive upload customer admin travel property",
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
    result: "Every morning the team knows who to contact and already has a draft message.",
    summary: "Prospects quiet for more than three days are found every morning, with a draft from their last chat.",
    keywords: "lead prospect sales property site visit follow up reminder draft message",
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
