"use client";

import { EnvelopeSimple, InstagramLogo, WhatsappLogo, X } from "@phosphor-icons/react/ssr";
import { useLocale, useTranslations } from "next-intl";
import { useEffect, useRef, useState } from "react";
import { trackContact, type ContactChannel } from "@/lib/analytics";
import { CONTACT_EMAIL, INSTAGRAM_URL } from "@/lib/site";
import { waHref } from "@/lib/wa";

type ContactState = { section: string; intent: string; message: string };

export function KontakModal() {
  const dialog = useRef<HTMLDialogElement>(null);
  const close = useRef<HTMLButtonElement>(null);
  const trigger = useRef<HTMLElement | null>(null);
  const [contact, setContact] = useState<ContactState>({ section: "solutions", intent: "chat", message: "" });
  const locale = useLocale();
  const t = useTranslations("pages.solutions.contact");

  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      const target = (event.target as HTMLElement).closest<HTMLElement>("[data-contact]");
      if (!target) return;
      event.preventDefault();
      trigger.current = target;
      setContact({
        section: target.dataset.src || "solutions",
        intent: target.dataset.intent || "chat",
        message: target.dataset.msg || "",
      });
      dialog.current?.showModal();
      requestAnimationFrame(() => close.current?.focus());
    };
    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, []);

  const record = (channel: ContactChannel) => trackContact(channel, contact.section, contact.intent, locale);
  const channelClass = "contact-channel";

  return (
    <dialog
      ref={dialog}
      className="contact-dialog"
      onClose={() => trigger.current?.focus()}
      onClick={(event) => {
        if (event.target === dialog.current) dialog.current.close();
      }}
    >
      <div className="contact-card">
        <button
          ref={close}
          type="button"
          className="contact-close"
          onClick={() => dialog.current?.close()}
          aria-label={t("close")}
        >
          <X aria-hidden weight="bold" />
        </button>
        <p className="solusi-kicker">{t("title")}</p>
        <h2>{t("title")}</h2>
        <p>{t("body")}</p>
        <div className="contact-list">
          <a
            className={channelClass}
            href={waHref(contact.message)}
            target="_blank"
            rel="noopener"
            onClick={() => record("whatsapp")}
          >
            <WhatsappLogo aria-hidden weight="fill" />
            <span>{t("whatsapp")}</span>
          </a>
          {INSTAGRAM_URL ? (
            <a
              className={channelClass}
              href={INSTAGRAM_URL}
              target="_blank"
              rel="noopener"
              onClick={() => record("instagram")}
            >
              <InstagramLogo aria-hidden weight="bold" />
              <span>{t("instagram")}</span>
            </a>
          ) : (
            <span className={`${channelClass} is-disabled`} aria-disabled="true">
              <InstagramLogo aria-hidden />
              <span>
                {t("instagram")}
                <small>{t("unavailable")}</small>
              </span>
            </span>
          )}
          {CONTACT_EMAIL ? (
            <a className={channelClass} href={`mailto:${CONTACT_EMAIL}`} onClick={() => record("email")}>
              <EnvelopeSimple aria-hidden weight="bold" />
              <span>{t("email")}</span>
            </a>
          ) : (
            <span className={`${channelClass} is-disabled`} aria-disabled="true">
              <EnvelopeSimple aria-hidden />
              <span>
                {t("email")}
                <small>{t("unavailable")}</small>
              </span>
            </span>
          )}
        </div>
      </div>
    </dialog>
  );
}
