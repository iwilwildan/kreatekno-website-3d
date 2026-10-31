"use client";

import { useLocale, useTranslations } from "next-intl";
import { useParams } from "next/navigation";
import { getPathname, usePathname } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";

/**
 * Links to the same page in the other language. Plain anchors with the clean URL
 * ("/portofolio", "/en/portfolio"), so crawlers see them and the whole page reloads in the new language.
 */
export function LangSwitch({ tone = "light", className = "" }: { tone?: "light" | "dark"; className?: string }) {
  const t = useTranslations("lang");
  const locale = useLocale();
  const pathname = usePathname();
  const params = useParams();

  const track = tone === "dark" ? "bg-white/10" : "bg-navy/7";
  const idle = tone === "dark" ? "text-on-night-muted hover:text-on-night" : "text-muted hover:text-navy";
  const active = tone === "dark" ? "bg-on-night text-navy" : "bg-paper text-navy shadow-[0_1px_3px_rgba(19,25,81,.18)]";

  return (
    <div role="group" aria-label={t("label")} className={`inline-flex rounded-full p-[3px] ${track} ${className}`}>
      {routing.locales.map((l) => (
        <a
          key={l}
          // Dynamic pages (e.g. /artikel/[slug]) need their params to build the other-language URL.
          href={getPathname({ locale: l, href: { pathname, params } as never })}
          hrefLang={l}
          lang={l}
          aria-label={l === "id" ? t("idName") : t("enName")}
          aria-current={l === locale ? "true" : undefined}
          className={`grid min-h-8 min-w-10 place-items-center rounded-full px-2.5 text-xs font-bold tracking-[.06em] no-underline transition-colors ${l === locale ? active : idle}`}
        >
          {t(l)}
        </a>
      ))}
    </div>
  );
}
