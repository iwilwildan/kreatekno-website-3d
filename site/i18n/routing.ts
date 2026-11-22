import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["id", "en"],
  defaultLocale: "id",
  // Indonesian lives at "/", English under "/en".
  localePrefix: "as-needed",
  // "/" is always Indonesian; visitors switch language with the toggle.
  localeDetection: false,
  // Without locale detection next-intl never reads its NEXT_LOCALE cookie, so it isn't set at all: the privacy
  // policy says the site sets no cookies (tahap 14A).
  localeCookie: false,
  pathnames: {
    "/": "/",
    "/solusi": { id: "/solusi", en: "/solutions" },
    "/solusi/hasil": { id: "/solusi/hasil", en: "/solutions/results" },
    "/solusi/[slug]": { id: "/solusi/[slug]", en: "/solutions/[slug]" },
    "/artikel": { id: "/artikel", en: "/articles" },
    // Article slugs differ per language (content/articles/slugs.ts); LangSwitch translates them.
    "/artikel/[slug]": { id: "/artikel/[slug]", en: "/articles/[slug]" },
    "/tentang": { id: "/tentang", en: "/about" },
    "/kebijakan-privasi": { id: "/kebijakan-privasi", en: "/privacy-policy" },
  },
});

export type Locale = (typeof routing.locales)[number];
export type Pathname = keyof typeof routing.pathnames;
