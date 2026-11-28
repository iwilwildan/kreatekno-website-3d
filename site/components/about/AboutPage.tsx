import {
  ArrowUpRight,
  Check,
  Handshake,
  Lifebuoy,
  MapPin,
  PuzzlePiece,
  Quotes,
  UsersThree,
} from "@phosphor-icons/react/ssr";
import Image from "next/image";
import { getLocale, getTranslations } from "next-intl/server";
import { JsonLd } from "@/components/JsonLd";
import { WhatsAppButton } from "@/components/layout/WhatsAppButton";
import { Link } from "@/i18n/navigation";
import { CLIENTS } from "@/lib/clients";
import { aboutPageJsonLd, absoluteUrl, breadcrumbJsonLd } from "@/lib/seo";
import { COMPANY, MAPS_URL, OFFICE_ADDRESS } from "@/lib/site";
import "./about.css";

const FACTS = ["registered", "based", "free", "payment"] as const;
const VALUES = [
  { key: "fit", Icon: PuzzlePiece },
  { key: "partner", Icon: Handshake },
  { key: "meet", Icon: UsersThree },
  { key: "support", Icon: Lifebuoy },
] as const;
const STEPS = ["talk", "map", "build", "launch"] as const;
/** Portraits rendered from the Home world's own cast (tools/render/team.mjs), 1280×1600 WebP with alpha. */
const TEAM = [
  { key: "heru", name: "Heru", role: "founder" },
  { key: "wildan", name: "Wildan", role: "cofounder" },
  { key: "andi", name: "Andi", role: "cofounder" },
] as const;
const PARTNER = { src: "/brand/partners/odoo-logo.png", alt: "Odoo", width: 625, height: 200 };

/**
 * Tentang / About (tahap 14B), plain HTML: hero with the Kreatekno facade still (K5a.6), story, team portraits,
 * beliefs and values on navy, how we work (Home's Cara kerja copy), Trusted By, then the office and the final CTA.
 */
export async function AboutPage() {
  const locale = await getLocale();
  const t = await getTranslations("pages.about");
  const tHome = await getTranslations("home");
  const tFooter = await getTranslations("footer");
  const tLegal = await getTranslations("legal");
  const tCta = await getTranslations("cta");
  const city = `${COMPANY.address.addressLocality}, ${COMPANY.address.addressRegion}`;

  return (
    <div className="about">
      <header className="about-hero">
        <div className="about-inner about-hero-grid">
          <div className="about-hero-copy">
            <p className="about-kicker">{t("kicker")}</p>
            <h1 className="about-title">{t("title")}</h1>
            <p className="about-lead">{t("lead")}</p>
            <ul className="about-facts">
              {FACTS.map((fact) => (
                <li key={fact}>
                  <Check aria-hidden weight="bold" className="about-facts-icon" />
                  {tHome(`about.${fact}`)}
                </li>
              ))}
            </ul>
            <div className="about-actions">
              <WhatsAppButton section="about-hero" />
              <WhatsAppButton section="about-hero" intent="meet" variant="line" className="text-navy" />
            </div>
          </div>
          <figure className="about-facade">
            <picture>
              <source media="(max-width: 639px)" srcSet="/stills/hp/k5a.6.webp" />
              <img
                src="/stills/pc/k5a.6.webp"
                alt={t("facadeAlt")}
                width={1600}
                height={900}
                fetchPriority="high"
                decoding="async"
              />
            </picture>
          </figure>
        </div>
      </header>

      <section className="about-section about-story" aria-labelledby="about-story">
        <div className="about-inner about-split">
          <h2 id="about-story" className="about-h2">
            {t("story.title")}
          </h2>
          <div className="about-story-text">
            <p>{t("story.p1")}</p>
            <p>{t("story.p2")}</p>
            <figure className="about-quote about-reveal">
              <Quotes aria-hidden weight="fill" className="about-quote-mark" />
              <blockquote>
                <p>{t("story.quote")}</p>
              </blockquote>
              <figcaption>{t("story.quoteBody")}</figcaption>
            </figure>
          </div>
        </div>
      </section>

      <section className="about-section about-team" aria-labelledby="about-team">
        <div className="about-inner">
          <div className="about-head">
            <h2 id="about-team" className="about-h2">
              {t("team.title")}
            </h2>
            <p className="about-intro">{t("team.intro")}</p>
          </div>
          <ul className="about-team-grid">
            {TEAM.map((member) => (
              <li key={member.key} className="about-member about-reveal">
                <div className="about-member-photo">
                  <Image
                    src={`/team/${member.key}.webp`}
                    alt={t(`team.${member.key}.alt`)}
                    width={1280}
                    height={1600}
                    sizes="(min-width: 1024px) 360px, (min-width: 768px) 30vw, 136px"
                  />
                </div>
                <div className="about-member-text">
                  <h3>{member.name}</h3>
                  <p className="about-role" data-role={member.role}>
                    {t(`team.${member.role}`)}
                  </p>
                  <p>{t(`team.${member.key}.bio`)}</p>
                </div>
              </li>
            ))}
          </ul>
          <p className="about-note">{t("team.note")}</p>
        </div>
      </section>

      <section className="about-section about-belief" aria-labelledby="about-belief">
        <div className="about-inner">
          <div className="about-head">
            <p className="about-kicker is-night">{t("belief.kicker")}</p>
            <h2 id="about-belief" className="about-h2 about-belief-title">
              {t("belief.title")}
            </h2>
            <p className="about-intro">{t("belief.body")}</p>
          </div>
          <ul className="about-values">
            {VALUES.map(({ key, Icon }) => (
              <li key={key} className="about-reveal">
                <Icon aria-hidden weight="duotone" className="about-value-icon" />
                <h3>{t(`belief.${key}.title`)}</h3>
                <p>{t(`belief.${key}.body`)}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="about-section about-process" aria-labelledby="about-process">
        <div className="about-inner">
          <div className="about-head">
            <p className="about-kicker">{tHome("journey.kicker")}</p>
            <h2 id="about-process" className="about-h2">
              {tHome("journey.title")}
            </h2>
          </div>
          <ol className="about-steps">
            {STEPS.map((step, index) => (
              <li key={step} className="about-reveal">
                <span className="about-step-num" aria-hidden>
                  {index + 1}
                </span>
                <h3>{tHome(`journey.${step}.title`)}</h3>
                <p>{tHome(`journey.${step}.body`)}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="about-section about-trusted" aria-labelledby="about-trusted">
        <div className="about-inner">
          <div className="about-trusted-head">
            <div>
              {/* the same label as the Home plaque (`home.about.trusted`, Home copy v4) */}
              <h2 id="about-trusted" className="about-h2">
                {tHome("about.trusted")}
              </h2>
              <p className="about-intro">{t("trusted.body")}</p>
            </div>
            <div className="about-partner">
              <p>{tFooter("partner")}</p>
              <span className="about-partner-chip">
                <Image src={PARTNER.src} alt={PARTNER.alt} width={PARTNER.width} height={PARTNER.height} />
              </span>
            </div>
          </div>
          <ul className="about-logos">
            {CLIENTS.map((client) => (
              <li key={client.name}>
                <Image src={client.src} alt="" width={client.width} height={client.height} sizes="160px" />
                <span>{client.name}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="about-section about-end" aria-label={t("office.title")}>
        <div className="about-inner about-end-grid">
          <div className="about-office about-reveal">
            <MapPin aria-hidden weight="duotone" className="about-office-icon" />
            <h2 className="about-h3">{t("office.title")}</h2>
            <p>{t("office.body")}</p>
            <dl>
              <dt>{t("office.address")}</dt>
              <dd>
                <address>
                  {COMPANY.legalName}
                  <br />
                  {OFFICE_ADDRESS ? `${OFFICE_ADDRESS}, ${city}` : city}
                  {!OFFICE_ADDRESS && <span className="about-pending"> ({tLegal("addressPending")})</span>}
                </address>
              </dd>
            </dl>
            <div className="about-actions">
              {MAPS_URL ? (
                <a href={MAPS_URL} target="_blank" rel="noopener noreferrer" className="btn btn-line text-navy">
                  {t("office.maps")}
                  <ArrowUpRight aria-hidden weight="bold" className="size-[18px]" />
                </a>
              ) : (
                <p className="about-pending">{t("office.mapsPending")}</p>
              )}
              <WhatsAppButton section="about-office" intent="meet" variant="line" className="text-navy" />
            </div>
          </div>
          <div className="about-cta about-reveal">
            <h2 className="about-h3">{t("cta.title")}</h2>
            <p>{t("cta.body")}</p>
            <div className="about-actions">
              <WhatsAppButton section="about-cta" />
              <Link href="/solusi" className="btn btn-line text-white">
                {tCta("solutions")}
              </Link>
            </div>
          </div>
        </div>
      </section>

      <JsonLd
        data={aboutPageJsonLd({
          locale,
          name: t("title"),
          description: t("lead"),
          founders: TEAM.map((m) => ({ name: m.name, jobTitle: t(`team.${m.role}`) })),
        })}
      />
      <JsonLd
        data={breadcrumbJsonLd([
          { name: tLegal("home"), url: absoluteUrl(locale, "/") },
          { name: t("title"), url: absoluteUrl(locale, "/tentang") },
        ])}
      />
    </div>
  );
}
