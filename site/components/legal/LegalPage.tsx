import { CaretDown, CheckCircle, NotePencil } from "@phosphor-icons/react/ssr";
import { getLocale, getTranslations } from "next-intl/server";
import { JsonLd } from "@/components/JsonLd";
import { Prose } from "@/components/mdx/Prose";
import type { LegalDoc } from "@/content/legal";
import { Link } from "@/i18n/navigation";
import { absoluteUrl, breadcrumbJsonLd, type StaticPathname, webPageJsonLd } from "@/lib/seo";
import { slugify } from "@/lib/slug";
import { TocSpy } from "./TocSpy";
import "./legal.css";

/**
 * Long legal text from MDX (content/legal/): title and summary card, then the text beside a sticky table of
 * contents on desktop. On phones the table of contents folds into a <details> above the text.
 */
export async function LegalPage({
  doc,
  href,
  description,
}: {
  doc: LegalDoc;
  href: StaticPathname;
  description: string;
}) {
  const { Body, meta } = doc;
  const locale = await getLocale();
  const t = await getTranslations("legal");
  const date = (iso: string) =>
    new Intl.DateTimeFormat(locale === "id" ? "id-ID" : "en-GB", { dateStyle: "long", timeZone: "UTC" }).format(
      new Date(`${iso}T00:00:00Z`),
    );
  const toc = meta.sections.map((title) => ({ title, id: slugify(title) }));
  const tocList = (
    <ol className="legal-toc-list">
      {toc.map((item, index) => (
        <li key={item.id}>
          <a href={`#${item.id}`}>
            <span className="legal-toc-num" aria-hidden>
              {String(index + 1).padStart(2, "0")}
            </span>
            {item.title}
          </a>
        </li>
      ))}
    </ol>
  );

  return (
    <article className="legal">
      <header className="legal-hero">
        <div className="legal-inner legal-hero-grid">
          <div>
            <nav aria-label={t("breadcrumb")} className="legal-crumbs">
              <Link href="/">{t("home")}</Link>
              <span aria-hidden>/</span>
              <span aria-current="page">{meta.title}</span>
            </nav>
            <h1 className="legal-title">{meta.title}</h1>
            <p className="legal-lead">{meta.lead}</p>
            <p className="legal-dates">
              <span>
                {t("effective")} <time dateTime={meta.effective}>{date(meta.effective)}</time>
              </span>
              <span>
                {t("updated")} <time dateTime={meta.updated}>{date(meta.updated)}</time>
              </span>
            </p>
            {meta.status === "draft" && (
              <p className="legal-draft" role="note">
                <NotePencil aria-hidden weight="duotone" className="legal-draft-icon" />
                <span>
                  <strong>{t("draftTitle")}.</strong> {t("draftBody")}
                </span>
              </p>
            )}
          </div>
          <section className="legal-summary" aria-labelledby="legal-summary-title">
            <h2 id="legal-summary-title">{t("summary")}</h2>
            <ul>
              {meta.summary.map((line) => (
                <li key={line}>
                  <CheckCircle aria-hidden weight="fill" className="legal-summary-icon" />
                  {line}
                </li>
              ))}
            </ul>
          </section>
        </div>
      </header>

      <div className="legal-inner legal-body">
        <nav id="legal-toc" className="legal-toc" aria-labelledby="legal-toc-title">
          <details className="legal-toc-fold">
            <summary>
              <span id="legal-toc-title">{t("toc")}</span>
              <CaretDown aria-hidden weight="bold" className="legal-toc-caret" />
            </summary>
            {tocList}
          </details>
          <div className="legal-toc-side">
            <p className="legal-toc-heading" aria-hidden>
              {t("toc")}
            </p>
            {tocList}
          </div>
        </nav>
        <Prose className="legal-text">
          <Body />
        </Prose>
      </div>

      <TocSpy tocId="legal-toc" />
      <JsonLd data={webPageJsonLd({ locale, href, name: meta.title, description, dateModified: meta.updated })} />
      <JsonLd
        data={breadcrumbJsonLd([
          { name: t("home"), url: absoluteUrl(locale, "/") },
          { name: meta.title, url: absoluteUrl(locale, href) },
        ])}
      />
    </article>
  );
}
