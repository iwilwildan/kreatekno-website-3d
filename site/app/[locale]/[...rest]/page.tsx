import { notFound } from "next/navigation";

// Always a 404, so there is nothing for instant-navigation validation to render.
export const instant = false;

// Unknown paths under a locale render the localized not-found page.
export default function CatchAll() {
  notFound();
}
