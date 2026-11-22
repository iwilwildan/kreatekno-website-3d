import type { MDXContent } from "mdx/types";
import type { Locale } from "@/i18n/routing";
import PrivacyEn, * as privacyEn from "./en/privacy-policy.mdx";
import PrivacyId, * as privacyId from "./id/kebijakan-privasi.mdx";
import { legalMeta, type LegalMeta } from "./schema";

export type LegalDoc = { Body: MDXContent; meta: LegalMeta };

// @types/mdx only types the default export; `meta` is the file's own named export.
const metaOf = (mod: object) => legalMeta.parse((mod as { meta?: unknown }).meta);

const PRIVACY: Record<Locale, LegalDoc> = {
  id: { Body: PrivacyId, meta: metaOf(privacyId) },
  en: { Body: PrivacyEn, meta: metaOf(privacyEn) },
};

export function privacyPolicy(locale: Locale): LegalDoc {
  return PRIVACY[locale];
}
