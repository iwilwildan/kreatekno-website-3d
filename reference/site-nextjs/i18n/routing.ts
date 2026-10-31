import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["id", "en"],
  defaultLocale: "id",
  // Indonesian lives at "/", English under "/en".
  localePrefix: "as-needed",
  // "/" is always Indonesian; visitors switch language with the toggle.
  localeDetection: false,
  pathnames: {
    "/": "/",
    "/portofolio": { id: "/portofolio", en: "/portfolio" },
    "/artikel": { id: "/artikel", en: "/articles" },
    "/tentang": { id: "/tentang", en: "/about" },
    "/kebijakan-privasi": { id: "/kebijakan-privasi", en: "/privacy-policy" },
  },
});

export type Locale = (typeof routing.locales)[number];
export type Pathname = keyof typeof routing.pathnames;
