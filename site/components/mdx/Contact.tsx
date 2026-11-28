import { getTranslations } from "next-intl/server";
import { COMPANY, OFFICE_ADDRESS, PRIVACY_EMAIL } from "@/lib/site";

/**
 * Facts that live in env vars (lib/site.ts), used inline in MDX so the text never hard-codes them. Until Kreatekno
 * sends them, a "menyusul" note stands in their place.
 */
export async function PrivacyEmail() {
  const t = await getTranslations("legal");
  if (!PRIVACY_EMAIL) return <span className="prose-pending">{t("emailPending")}</span>;
  return <a href={`mailto:${PRIVACY_EMAIL}`}>{PRIVACY_EMAIL}</a>;
}

export async function OfficeAddress() {
  const t = await getTranslations("legal");
  const { addressLocality, addressRegion } = COMPANY.address;
  const city = `${addressLocality}, ${addressRegion}`;
  if (!OFFICE_ADDRESS) {
    return (
      <>
        {city} <span className="prose-pending">({t("addressPending")})</span>
      </>
    );
  }
  return (
    <>
      {OFFICE_ADDRESS}, {city} {COMPANY.address.postalCode}
    </>
  );
}

export function LegalName() {
  return <>{COMPANY.legalName}</>;
}
