import { InstagramLogo, LinkedinLogo, TiktokLogo } from "@phosphor-icons/react/ssr";
import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { COMPANY } from "@/lib/site";
import { FooterOffice } from "./FooterOffice";
import { NAV_ITEMS } from "./nav-items";
import { WhatsAppButton } from "./WhatsAppButton";

const SOCIAL = [
  { key: "instagram", label: "Instagram", Icon: InstagramLogo },
  { key: "linkedin", label: "LinkedIn", Icon: LinkedinLogo },
  { key: "tiktok", label: "TikTok", Icon: TiktokLogo },
] as const;

/**
 * Kreatekno is an Odoo Official Partner. The logo is Odoo's own file in its own colours (not redrawn, at least
 * 20 px tall), on a white chip because its purple "o" is too dark on the footer's navy.
 */
const PARTNER = { src: "/brand/partners/odoo-logo.png", alt: "Odoo", width: 625, height: 200 };

/**
 * Site footer. Phones and tablets: logo, tagline, Odoo partner logo and the mini office, then the link columns.
 * Desktop (issue #38): two rows of text, logo and tagline beside the pages in a row, the Odoo partner logo under the
 * logo beside the contact line, then the mini office across the footer's container and the copyright.
 *
 * On Home it follows the night road of beat 16 (tahap 10), whose epilogue fades into its colour.
 */
export async function Footer() {
  const t = await getTranslations("footer");
  const tNav = await getTranslations("nav");
  const social = SOCIAL.filter((s) => COMPANY.social[s.key]);

  const heading = "mb-3 text-xs font-bold tracking-[.12em] text-cyan uppercase";
  const link = "inline-block py-1.5 no-underline hover:text-white";

  return (
    <footer id="kontak" className="bg-navy-3 text-on-night-muted">
      <div className="mx-auto grid max-w-(--container-site) gap-10 px-6 pt-16 pb-10 text-[.9375rem] sm:grid-cols-2 lg:grid-cols-[17rem_minmax(0,1fr)_auto] lg:gap-x-12 lg:gap-y-9 xl:grid-cols-[19rem_minmax(0,1fr)_auto] xl:gap-x-16">
        <div className="grid content-start gap-3 lg:contents">
          <div className="grid content-start gap-3 lg:col-start-1 lg:row-start-1">
            <Image
              src="/brand/kreatekno-logo-white.webp"
              alt="Kreatekno"
              width={560}
              height={95}
              className="h-7 w-auto self-start"
            />
            <p>{t("tagline")}</p>
          </div>
          <div className="mt-3 lg:col-start-1 lg:row-start-2 lg:mt-0">
            <h2 className={heading}>{t("partner")}</h2>
            <span className="inline-flex rounded-xl bg-white px-4 py-2.5">
              <Image
                src={PARTNER.src}
                alt={PARTNER.alt}
                width={PARTNER.width}
                height={PARTNER.height}
                className="h-6 w-auto"
              />
            </span>
          </div>
          <FooterOffice />
        </div>

        <nav aria-labelledby="ft-pages" className="lg:col-span-2 lg:col-start-2 lg:row-start-1">
          <h2 id="ft-pages" className={heading}>
            {t("pages")}
          </h2>
          <ul className="lg:flex lg:flex-wrap lg:gap-x-6 xl:gap-x-7">
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

        <div className="lg:col-start-2 lg:row-start-2">
          <h2 className={heading}>{t("contact")}</h2>
          <ul className="grid gap-1.5 lg:flex lg:flex-wrap lg:items-baseline lg:gap-x-6 xl:gap-x-7">
            <li>{t("city")}</li>
            <li>{COMPANY.address.streetAddress || t("address")}</li>
            <li>
              <WhatsAppButton section="footer" variant="text" className="text-on-night" />
            </li>
          </ul>
        </div>

        {social.length > 0 && (
          <div className="lg:col-start-3 lg:row-start-2">
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
