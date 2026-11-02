import { WA_NUMBER } from "./site";

export type WaIntent = "chat" | "meet";

/** wa.me click-to-chat link with a prefilled message. Without a number, wa.me lets the visitor pick a contact. */
export function waHref(message: string) {
  return `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(message)}`;
}
