"use client";

import { ChatCircleDots, Handshake } from "@phosphor-icons/react/ssr";
import { useLocale, useTranslations } from "next-intl";
import { trackWhatsApp } from "@/lib/analytics";
import { waHref, type WaIntent } from "@/lib/wa";

type Props = {
  /** Where the button sits, sent with the click event (hero, nav, faq, footer...). */
  section: string;
  intent?: WaIntent;
  variant?: "main" | "line" | "text";
  className?: string;
};

/** Click-to-chat link with the prefilled message for the current locale. */
export function WhatsAppButton({ section, intent = "chat", variant = "main", className = "" }: Props) {
  const locale = useLocale();
  const tWa = useTranslations("wa");
  const tCta = useTranslations("cta");
  const label = intent === "meet" ? tCta("meet") : tCta("free");

  const style =
    variant === "text" ? "underline-offset-4 hover:underline" : variant === "line" ? "btn btn-line" : "btn btn-main";

  return (
    <a
      href={waHref(tWa(intent))}
      target="_blank"
      rel="noopener"
      data-src={section}
      onClick={() => trackWhatsApp(section, intent, locale)}
      className={`${style} ${className}`}
    >
      {variant === "line" && intent === "meet" && <Handshake aria-hidden className="size-[18px]" />}
      <span>{label}</span>
      {variant === "main" && (
        <span className="knob">
          <ChatCircleDots aria-hidden weight="bold" className="size-5" />
        </span>
      )}
    </a>
  );
}
