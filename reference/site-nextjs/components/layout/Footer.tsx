import { InstagramLogo, LinkedinLogo, TiktokLogo } from "@phosphor-icons/react/ssr";
import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { COMPANY } from "@/lib/site";
import { NAV_ITEMS } from "./nav-items";
import { WhatsAppButton } from "./WhatsAppButton";

const SOCIAL = [
  { key: "instagram", label: "Instagram", Icon: InstagramLogo },
  { key: "linkedin", label: "LinkedIn", Icon: LinkedinLogo },
  { key: "tiktok", label: "TikTok", Icon: TiktokLogo },
] as const;

/** Site footer. In M5 Home swaps it for the last story beat (footer on the night road). */
export async function Footer() {
  const t = await getTranslations("footer");
  const tNav = await getTranslations("nav");
  const social = SOCIAL.filter((s) => COMPANY.social[s.key]);

  const heading = "mb-3 text-xs font-bold tracking-[.12em] text-cyan uppercase";
  const link = "inline-block py-1.5 no-underline hover:text-white";

  return (
    <footer className="bg-navy-3 text-on-night-muted">
      <div className="mx-auto grid max-w-(--container-site) gap-10 px-6 pt-16 pb-10 text-[.9375rem] sm:grid-cols-2 lg:grid-cols-[1.7fr_repeat(3,1fr)]">
        <div className="grid content-start gap-3">
          <Image
            src="/brand/kreatekno-logo-white.webp"
            alt="Kreatekno"
            width={560}
            height={95}
            className="h-7 w-auto self-start"
          />
          <p>{t("tagline")}</p>
        </div>

        <nav aria-labelledby="ft-pages">
          <h2 id="ft-pages" className={heading}>
            {t("pages")}
          </h2>
          <ul>
            <li>
              <Link href="/" className={link}>
                {t("home")}
              </Link>
            </li>
            {NAV_ITEMS.map((item) => (
              <li key={item.key}>
                <Link href={item.href} className={link}>
                  {tNav(item.key)}
                </Link>
              </li>
            ))}
            <li>
              <Link href="/kebijakan-privasi" className={link}>
                {t("privacy")}
              </Link>
            </li>
          </ul>
        </nav>

        <div>
          <h2 className={heading}>{t("contact")}</h2>
          <ul className="grid gap-1.5">
            <li>{t("city")}</li>
            <li>{COMPANY.address.streetAddress || t("address")}</li>
            <li>
              <WhatsAppButton section="footer" variant="text" className="text-on-night" />
            </li>
          </ul>
        </div>

        {social.length > 0 && (
          <div>
            <h2 className={heading}>{t("follow")}</h2>
            <ul className="flex gap-2">
              {social.map(({ key, label, Icon }) => (
                <li key={key}>
                  <a
                    href={COMPANY.social[key]}
                    target="_blank"
                    rel="noopener"
                    aria-label={label}
                    className="grid size-11 place-items-center rounded-full bg-white/8 hover:bg-white/14 hover:text-white"
                  >
                    <Icon aria-hidden className="size-5" />
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
      <div className="mx-auto max-w-(--container-site) border-t border-white/10 px-6 pt-5 pb-[calc(env(safe-area-inset-bottom,0px)+24px)] text-sm">
        <p>{t("copyright")}</p>
      </div>
    </footer>
  );
}
