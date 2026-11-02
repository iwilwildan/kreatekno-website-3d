import { track } from "@vercel/analytics";
import type { WaIntent } from "./wa";

/** One event per WhatsApp click, so we can see which section converts. */
export function trackWhatsApp(section: string, intent: WaIntent, locale: string) {
  track("whatsapp_click", { section, intent, locale });
}
