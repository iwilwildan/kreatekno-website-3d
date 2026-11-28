import {
  ArrowUpRight,
  Certificate,
  ChalkboardTeacher,
  Check,
  Lifebuoy,
  MapPin,
  Plant,
  Receipt,
  SealCheck,
  ShieldCheck,
  UsersThree,
} from "@phosphor-icons/react/ssr";
import Image from "next/image";
import { getLocale, getTranslations } from "next-intl/server";
import { JsonLd } from "@/components/JsonLd";
import { WhatsAppButton } from "@/components/layout/WhatsAppButton";
import { Link } from "@/i18n/navigation";
import { CLIENTS } from "@/lib/clients";
import { aboutPageJsonLd, absoluteUrl, breadcrumbJsonLd } from "@/lib/seo";
import { COMPANY, OFFICE_ADDRESS } from "@/lib/site";
import "./about.css";

const FACTS = ["registered", "based", "free", "payment"] as const;
/** Company Profile Kreatekno 2026 (Sekilas, Visi Misi & Nilai, Layanan, Tim, Lampiran Legalitas). */
const FACT_ROWS = ["entity", "brand", "legal", "seat", "area", "field"] as const;
const LEGAL = [
  { key: "pt", Icon: Certificate },
  { key: "oss", Icon: ShieldCheck },
  { key: "tax", Icon: Receipt },
] as const;
const VALUES = [
  { key: "honest", Icon: SealCheck },
  { key: "guide", Icon: Lifebuoy },
  { key: "grow", Icon: Plant },
  { key: "near", Icon: UsersThree },
  { key: "share", Icon: ChalkboardTeacher },
] as const;
const SERVICES = ["agent", "strategy", "build", "training"] as const;
const STEPS = ["talk", "map", "build", "launch"] as const;
/** Group photo from the Company Profile (page 9), left to right as seated: Wildan, Riandi (standing), Heru. */
const TEAM_PHOTO = { src: "/team/tim-kreatekno.webp", width: 1600, height: 900 };
const TEAM = [
  { key: "wildan", name: "Wildan Adli" },
  { key: "riandi", name: "Riandi Darman" },
  { key: "heru", name: "Heru Nuraditya", founder: true },
] as const;
const PARTNER = { src: "/brand/partners/odoo-logo.png", alt: "Odoo", width: 625, height: 200 };

/**
 * Tentang / About (tahap 14B, isi dari Company Profile 2026), plain HTML: hero with the Kreatekno facade still
 * (K5a.6), Sekilas (facts, why we exist, legal), team group photo, vision, mission and values on navy, services, how
 * we work (Home's Cara kerja copy), Trusted By, then the office and the final CTA.
 */
export async function AboutPage() {
  const locale = await getLocale();
  const t = await getTranslations("pages.about");
  const tHome = await getTranslations("home");
  const tFooter = await getTranslations("footer");
  const tLegal = await getTranslations("legal");
  const tCta = await getTranslations("cta");
  const city = `${COMPANY.address.addressLocality}, ${COMPANY.address.addressRegion} ${COMPANY.address.postalCode}`;

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
        <div className="about-inner">
          <div className="about-split">
            <div>
              <p className="about-kicker">{t("story.kicker")}</p>
              <h2 id="about-story" className="about-h2">
                {t("story.title")}
              </h2>
            </div>
            <div className="about-story-text">
              <p>{t("story.p1")}</p>
              <p>{t("story.p2")}</p>
              <dl className="about-profile">
                {FACT_ROWS.map((row) => (
                  <div key={row}>
                    <dt>{t(`story.facts.${row}.label`)}</dt>
                    <dd>{t(`story.facts.${row}.value`)}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>

          <div className="about-why about-reveal">
            <div className="about-why-stat">
              <h3 className="about-why-title">{t("story.why.title")}</h3>
              <p className="about-why-num">{t("story.why.stat")}</p>
              <p>{t("story.why.statBody")}</p>
            </div>
            <div className="about-why-body">
              <p>{t("story.why.body")}</p>
            </div>
          </div>

          <h3 className="about-legal-title">{t("story.legalTitle")}</h3>
          <ul className="about-legal">
            {LEGAL.map(({ key, Icon }) => (
              <li key={key}>
                <Icon aria-hidden weight="duotone" className="about-legal-icon" />
                <div>
                  <p className="about-legal-name">{t(`story.legalItems.${key}.title`)}</p>
                  <p>{t(`story.legalItems.${key}.body`)}</p>
                </div>
              </li>
            ))}
          </ul>
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
          <div className="about-team-body">
            <figure className="about-team-photo">
              <Image
                src={TEAM_PHOTO.src}
                alt={t("team.photoAlt")}
                width={TEAM_PHOTO.width}
                height={TEAM_PHOTO.height}
                sizes="(min-width: 1280px) 1200px, (min-width: 640px) calc(100vw - 48px), 150vw"
              />
            </figure>
            <ul className="about-team-grid">
              {TEAM.map((member) => (
                <li key={member.key} className="about-member about-reveal" data-founder={"founder" in member}>
                  <p className="about-position">{t(`team.${member.key}.position`)}</p>
                  <h3>{member.name}</h3>
                  <p className="about-role">{t(`team.${member.key}.role`)}</p>
                  <p className="about-bio">{t(`team.${member.key}.bio`)}</p>
                </li>
              ))}
            </ul>
          </div>
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
          <div className="about-vm">
            <div className="about-vm-card about-reveal">
              <h3>{t("belief.vision.label")}</h3>
              <p>{t("belief.vision.body")}</p>
            </div>
            <div className="about-vm-card about-reveal">
              <h3>{t("belief.mission.label")}</h3>
              <p>{t("belief.mission.body")}</p>
              <ul className="about-vm-points">
                {(t.raw("belief.mission.points") as string[]).map((point) => (
                  <li key={point}>
                    <Check aria-hidden weight="bold" className="about-vm-check" />
                    {point}
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <h3 className="about-values-title">{t("belief.valuesTitle")}</h3>
          <ol className="about-values">
            {VALUES.map(({ key, Icon }, index) => (
              <li key={key} className="about-reveal">
                <div className="about-value-top">
                  <Icon aria-hidden weight="duotone" className="about-value-icon" />
                  <span aria-hidden>{String(index + 1).padStart(2, "0")}</span>
                </div>
                <h4>{t(`belief.${key}.title`)}</h4>
                <p>{t(`belief.${key}.body`)}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="about-section about-services" aria-labelledby="about-services">
        <div className="about-inner">
          <div className="about-head">
            <p className="about-kicker">{t("services.kicker")}</p>
            <h2 id="about-services" className="about-h2">
              {t("services.title")}
            </h2>
            <p className="about-intro">{t("services.intro")}</p>
          </div>
          <ul className="about-service-grid">
            {SERVICES.map((key, index) => (
              <li key={key} className="about-service about-reveal" data-main={index === 0}>
                {index === 0 && <p className="about-service-tag">{t("services.main")}</p>}
                <h3>{t(`services.${key}.title`)}</h3>
                <p>{t(`services.${key}.body`)}</p>
                <ul>
                  {(t.raw(`services.${key}.items`) as string[]).map((item) => (
                    <li key={item}>
                      <Check aria-hidden weight="bold" className="about-service-check" />
                      {item}
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
          <div className="about-actions">
            <Link href="/solusi" className="btn btn-line text-navy">
              {tCta("solutions")}
              <ArrowUpRight aria-hidden weight="bold" className="size-[18px]" />
            </Link>
          </div>
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
          founders: TEAM.filter((m) => "founder" in m).map((m) => ({
            name: m.name,
            jobTitle: t(`team.${m.key}.role`),
          })),
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
