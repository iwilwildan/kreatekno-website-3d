import type { Metadata } from "next";
import { getPathname } from "@/i18n/navigation";
import { routing, type Locale, type Pathname } from "@/i18n/routing";
import { COMPANY, SITE_URL } from "./site";

export function absoluteUrl(locale: Locale, href: Pathname) {
  const path = getPathname({ locale, href });
  return SITE_URL + (path === "/" ? "" : path);
}

/** Canonical URL plus hreflang alternates for every locale (and x-default → Indonesian). */
export function alternates(locale: Locale, href: Pathname): Metadata["alternates"] {
  const languages: Record<string, string> = {};
  for (const l of routing.locales) languages[l] = absoluteUrl(l, href);
  languages["x-default"] = absoluteUrl(routing.defaultLocale, href);
  return { canonical: absoluteUrl(locale, href), languages };
}

export function pageMetadata({
  locale,
  href,
  title,
  description,
}: {
  locale: Locale;
  href: Pathname;
  title: string;
  description: string;
}): Metadata {
  return {
    title: { absolute: title },
    description,
    alternates: alternates(locale, href),
    openGraph: {
      type: "website",
      siteName: COMPANY.name,
      title,
      description,
      url: absoluteUrl(locale, href),
      locale: locale === "id" ? "id_ID" : "en_US",
      alternateLocale: locale === "id" ? "en_US" : "id_ID",
    },
    twitter: { card: "summary_large_image", title, description },
  };
}

/** Organization + ProfessionalService, rendered on every page. */
export function organizationJsonLd(locale: Locale, description: string) {
  const sameAs = Object.values(COMPANY.social).filter(Boolean);
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": `${SITE_URL}/#organization`,
        name: COMPANY.name,
        legalName: COMPANY.legalName,
        slogan: COMPANY.slogan,
        url: SITE_URL,
        logo: SITE_URL + COMPANY.logo,
        ...(sameAs.length ? { sameAs } : {}),
      },
      {
        "@type": "ProfessionalService",
        "@id": `${SITE_URL}/#business`,
        name: COMPANY.name,
        description,
        url: absoluteUrl(locale, "/"),
        image: SITE_URL + COMPANY.logo,
        parentOrganization: { "@id": `${SITE_URL}/#organization` },
        address: {
          "@type": "PostalAddress",
          ...Object.fromEntries(Object.entries(COMPANY.address).filter(([, v]) => v)),
        },
        areaServed: { "@type": "Country", name: "Indonesia" },
      },
    ],
  };
}
