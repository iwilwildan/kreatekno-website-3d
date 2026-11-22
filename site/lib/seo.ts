import type { Metadata } from "next";
import { getPathname } from "@/i18n/navigation";
import { routing, type Locale, type Pathname } from "@/i18n/routing";
import { ARTICLE_SLUGS, type ArticleKey } from "@/content/articles/slugs";
import { COMPANY, SITE_URL } from "./site";

/** Pages without a dynamic segment. */
export type StaticPathname = Exclude<Pathname, `${string}[slug]`>;

export function absoluteUrl(locale: Locale, href: StaticPathname) {
  const path = getPathname({ locale, href });
  return SITE_URL + (path === "/" ? "" : path);
}

/** Canonical URL plus hreflang alternates for every locale (and x-default → Indonesian). */
export function alternates(locale: Locale, href: StaticPathname): Metadata["alternates"] {
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
  href: StaticPathname;
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

/** Absolute URL of a solution detail page (`/solusi/[slug]`, `/en/solutions/[slug]`). */
export function solutionUrl(locale: Locale, slug: string) {
  return SITE_URL + getPathname({ locale, href: { pathname: "/solusi/[slug]", params: { slug } } });
}

export function solutionDetailMetadata({
  locale,
  slug,
  title,
  description,
}: {
  locale: Locale;
  slug: string;
  title: string;
  description: string;
}): Metadata {
  const pathFor = (target: Locale) =>
    getPathname({ locale: target, href: { pathname: "/solusi/[slug]", params: { slug } } });
  const canonical = SITE_URL + pathFor(locale);
  return {
    title: { absolute: title },
    description,
    alternates: {
      canonical,
      languages: {
        id: SITE_URL + pathFor("id"),
        en: SITE_URL + pathFor("en"),
        "x-default": SITE_URL + pathFor("id"),
      },
    },
    openGraph: {
      type: "website",
      siteName: COMPANY.name,
      title,
      description,
      url: canonical,
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

/** BreadcrumbList for a page one or more levels below Home. */
export function breadcrumbJsonLd(items: { name: string; url: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

/** WebPage for a plain content page (privacy policy), tied to the site-wide Organization. */
export function webPageJsonLd({
  locale,
  href,
  name,
  description,
  dateModified,
}: {
  locale: Locale;
  href: StaticPathname;
  name: string;
  description: string;
  dateModified: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name,
    description,
    url: absoluteUrl(locale, href),
    inLanguage: locale === "id" ? "id-ID" : "en-US",
    dateModified,
    publisher: { "@id": `${SITE_URL}/#organization` },
  };
}

/** AboutPage whose main entity is the site-wide Organization, with its founders and founding facts. */
export function aboutPageJsonLd({
  locale,
  name,
  description,
  founders,
}: {
  locale: Locale;
  name: string;
  description: string;
  founders: { name: string; jobTitle: string }[];
}) {
  return {
    "@context": "https://schema.org",
    "@type": "AboutPage",
    name,
    description,
    url: absoluteUrl(locale, "/tentang"),
    inLanguage: locale === "id" ? "id-ID" : "en-US",
    mainEntity: {
      "@type": "Organization",
      "@id": `${SITE_URL}/#organization`,
      name: COMPANY.name,
      legalName: COMPANY.legalName,
      foundingDate: "2025",
      foundingLocation: { "@type": "Place", name: "Pekanbaru, Riau, Indonesia" },
      founder: founders.map((f) => ({ "@type": "Person", ...f, worksFor: { "@id": `${SITE_URL}/#organization` } })),
    },
  };
}

/** Absolute URL of an article (`/artikel/[slug]`, `/en/articles/[slug]`); the slug differs per language. */
export function articleUrl(locale: Locale, key: ArticleKey) {
  return (
    SITE_URL +
    getPathname({ locale, href: { pathname: "/artikel/[slug]", params: { slug: ARTICLE_SLUGS[key][locale] } } })
  );
}

export function articleMetadata({
  locale,
  key,
  title,
  description,
  published,
  updated,
}: {
  locale: Locale;
  key: ArticleKey;
  title: string;
  description: string;
  published: string;
  updated: string;
}): Metadata {
  const canonical = articleUrl(locale, key);
  return {
    title: { absolute: `${title} | ${COMPANY.name}` },
    description,
    alternates: {
      canonical,
      languages: {
        id: articleUrl("id", key),
        en: articleUrl("en", key),
        "x-default": articleUrl("id", key),
      },
    },
    openGraph: {
      type: "article",
      siteName: COMPANY.name,
      title,
      description,
      url: canonical,
      locale: locale === "id" ? "id_ID" : "en_US",
      alternateLocale: locale === "id" ? "en_US" : "id_ID",
      publishedTime: published,
      modifiedTime: updated,
      authors: [SITE_URL],
    },
    twitter: { card: "summary_large_image", title, description },
  };
}

/**
 * BlogPosting by the Kreatekno team (author = the Organization, decision 22 Nov). No `image`: the generated Open Graph
 * image's URL carries a build hash the page can't know; crawlers read it from the og:image tag instead.
 */
export function blogPostingJsonLd({
  locale,
  key,
  title,
  description,
  published,
  updated,
  section,
}: {
  locale: Locale;
  key: ArticleKey;
  title: string;
  description: string;
  published: string;
  updated: string;
  section: string;
}) {
  const url = articleUrl(locale, key);
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: title,
    description,
    url,
    mainEntityOfPage: url,
    inLanguage: locale === "id" ? "id-ID" : "en-US",
    datePublished: published,
    dateModified: updated,
    articleSection: section,
    author: { "@type": "Organization", "@id": `${SITE_URL}/#organization`, name: COMPANY.name, url: SITE_URL },
    publisher: { "@type": "Organization", "@id": `${SITE_URL}/#organization`, name: COMPANY.name },
  };
}
