import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { LangSwitch } from "./LangSwitch";
import { MobileMenu } from "./MobileMenu";
import { NAV_ITEMS } from "./nav-items";
import { WhatsAppButton } from "./WhatsAppButton";

/** Floating pill header, as in the prototype. Under 960px the links move into the menu. */
export async function Header() {
  const t = await getTranslations("nav");

  return (
    <header className="fixed top-(--nav-top) left-1/2 z-30 flex h-(--nav-h) w-[min(var(--container-site),calc(100%-24px))] -translate-x-1/2 items-center gap-4 rounded-full bg-white/86 pr-2 pl-5 shadow-[0_0_0_1px_rgba(19,25,81,.08),0_12px_32px_-18px_rgba(19,25,81,.35)] backdrop-blur-lg backdrop-saturate-140 max-sm:gap-2 max-sm:pl-3.5">
      <Link href="/" aria-label={t("home")} className="flex-none">
        <Image
          src="/brand/kreatekno-logo.webp"
          alt="Kreatekno"
          width={560}
          height={95}
          priority
          className="h-7 w-auto max-[420px]:h-5 max-sm:h-[22px]"
        />
      </Link>

      <nav aria-label={t("main")} className="mx-auto max-[960px]:hidden">
        <ul className="flex gap-0.5">
          {NAV_ITEMS.map((item) => (
            <li key={item.key}>
              <Link
                href={item.href}
                className="block rounded-full px-3 py-[9px] text-[.9375rem] font-semibold text-ink no-underline transition-colors hover:bg-navy/6"
              >
                {t(item.key)}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      <div className="ml-auto flex items-center gap-2">
        <LangSwitch className="max-[960px]:hidden" />
        <WhatsAppButton
          section="nav"
          className="[--t-btn:.9375rem] max-sm:min-h-11 max-sm:[--t-btn:.875rem] max-[420px]:[&_.knob]:hidden"
        />
        <MobileMenu openLabel={t("open")} closeLabel={t("close")}>
          <Image
            src="/brand/kreatekno-logo-white.webp"
            alt="Kreatekno"
            width={560}
            height={95}
            className="mt-3 h-[26px] w-auto self-start"
          />
          <nav aria-label={t("main")} className="mt-11 mb-auto">
            <ul className="grid gap-1">
              {NAV_ITEMS.map((item) => (
                <li key={item.key}>
                  <Link
                    href={item.href}
                    className="block py-2 font-display text-4xl leading-[1.15] font-bold tracking-[-.02em] no-underline"
                  >
                    {t(item.key)}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <LangSwitch tone="dark" className="mb-4 self-start" />
          <WhatsAppButton section="menu" className="self-start" />
        </MobileMenu>
      </div>
    </header>
  );
}
