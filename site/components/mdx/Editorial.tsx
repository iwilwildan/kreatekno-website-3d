import { getTranslations } from "next-intl/server";
import type { ReactNode } from "react";
import { WhatsAppButton } from "@/components/layout/WhatsAppButton";

/** A sentence pulled out of the text in large type (`<PullQuote>…</PullQuote>`). */
export function PullQuote({ children }: { children: ReactNode }) {
  return (
    <figure className="prose-pull">
      <blockquote>{children}</blockquote>
    </figure>
  );
}

/**
 * A full-bleed colour band inside the text (the Maglr reference's bands): `<Band title="…">…</Band>`.
 * The colour follows the article's cover (`--band` set by the article page).
 */
export function Band({ title, children }: { title?: string; children: ReactNode }) {
  return (
    <section className="prose-band">
      <div className="prose-band-in">
        {title && <p className="prose-band-title">{title}</p>}
        {children}
      </div>
    </section>
  );
}

/** Free consultation card inside an article; `section` is sent with the click (e.g. "artikel-admin"). */
export async function Cta({ section }: { section: string }) {
  const t = await getTranslations("pages.articles.cta");
  return (
    <aside className="prose-cta">
      <p className="prose-cta-title">{t("title")}</p>
      <p>{t("body")}</p>
      <WhatsAppButton section={section} />
    </aside>
  );
}
