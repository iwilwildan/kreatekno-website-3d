// Business facts used across pages, metadata and structured data.
// Fill the TODOs once Kreatekno sends them (SITE-BRIEF.md section 11).

export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || "https://kreatekno.com").replace(/\/$/, "");

/** WhatsApp number in international format, digits only, e.g. "62812xxxxxxx". */
export const WA_NUMBER = (process.env.NEXT_PUBLIC_WA_NUMBER || "").replace(/\D/g, "");
export const CONTACT_EMAIL = process.env.NEXT_PUBLIC_CONTACT_EMAIL || "";
export const INSTAGRAM_URL = process.env.NEXT_PUBLIC_INSTAGRAM_URL || "";

/** Street address of the office (street, number, district). Empty until Kreatekno sends it. */
export const OFFICE_ADDRESS = process.env.NEXT_PUBLIC_OFFICE_ADDRESS || "";
/** Google Maps link of the office (a link, never an embed: an embed would set third-party cookies). */
export const MAPS_URL = process.env.NEXT_PUBLIC_MAPS_URL || "";
/** Inbox for privacy requests (access, correction, deletion). Falls back to the general contact inbox. */
export const PRIVACY_EMAIL = process.env.NEXT_PUBLIC_PRIVACY_EMAIL || CONTACT_EMAIL;

export const COMPANY = {
  name: "Kreatekno",
  legalName: "PT Kreatekno Kreatif Teknologi",
  slogan: "Automate You",
  logo: "/brand/kreatekno-logo.png",
  address: {
    streetAddress: OFFICE_ADDRESS,
    addressLocality: "Pekanbaru",
    addressRegion: "Riau",
    addressCountry: "ID",
  },
  social: {
    instagram: INSTAGRAM_URL,
    linkedin: "", // TODO
    tiktok: "", // TODO
  },
} as const;

export const BRAND = {
  navy: "#131951",
  ink: "#121640",
  purple: "#9F0ED6",
  violet: "#8C2BFA",
  cyan: "#35EAFE",
} as const;
