import { track } from "@vercel/analytics";
import type { WaIntent } from "./wa";

/** One event per WhatsApp click, so we can see which section converts. */
export function trackWhatsApp(section: string, intent: WaIntent, locale: string) {
  track("whatsapp_click", { section, intent, locale });
}

export type ContactChannel = "whatsapp" | "instagram" | "email";

/** One conversion event per chosen contact channel on the Solutions experience. */
export function trackContact(channel: ContactChannel, section: string, intent: string, locale: string) {
  track("solutions_contact_click", { channel, section, intent, locale });
}
