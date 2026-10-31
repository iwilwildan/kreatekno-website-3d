import {
  ArrowRight,
  ChalkboardTeacher,
  Compass,
  Handshake,
  Image as ImageIcon,
  InstagramLogo,
  LinkedinLogo,
  MapPin,
  Palette,
  Receipt,
  SealCheck,
  Sparkle,
  TiktokLogo,
  Users,
} from "@phosphor-icons/react/ssr";
import Image from "next/image";
import { getMessages, getTranslations } from "next-intl/server";
import { LangSwitch } from "@/components/layout/LangSwitch";
import { NAV_ITEMS } from "@/components/layout/nav-items";
import { WhatsAppButton } from "@/components/layout/WhatsAppButton";
import { Link } from "@/i18n/navigation";
import { COMPANY } from "@/lib/site";
import { Binder, type Industry } from "./Binder";
import { FaqNotes } from "./FaqNotes";
import { Lit, Prop } from "./Prop";
import { StoryStage } from "./StoryStage";

/*
 * The Home page: 18 beats in one take (STORY-STAGE.md). On desktop every piece of copy is a prop in the
 * scene; on phones most of it becomes a card in the empty band at the bottom of the frame (the hero stays
 * on the billboard, the journey steps stay on the shop panels). Beats 2, 5a, 9a, 10, 11, 12 and 15 have no
 * copy: only the footage moves.
 */
export async function HomeStory() {
  return (
    <StoryStage>
      <main id="main" className="layer">
        <Hero />
        <Services />
        <UseCase />
        <Journey />
        <Testimonials />
        <Articles />
        <Faq />
        <About />
        <Practice />
        <Contact />
      </main>
      <RoadFooter />
    </StoryStage>
  );
}

function AFrameStand() {
  return (
    <span className="af-stand deco" aria-hidden="true">
      <i className="af-leg bl wood-tex" />
      <i className="af-leg br wood-tex" />
      <i className="af-leg l wood-tex" />
      <i className="af-leg r wood-tex" />
      <i className="af-shadow" />
    </span>
  );
}

/*
 * Beat 1 · Hero · copy printed on the blank billboard on the roof of COMPANY, in the first frame of the page
 * (K0). The footage draws the billboard's frame and truss; on the way down the copy rides on the face.
 * On phones the face is too small for everything, so the body and the buttons become a card at the bottom.
 */
async function Hero() {
  const t = await getTranslations("home.hero");
  const tCta = await getTranslations("cta");
  return (
    <section className="sf" id="beranda" data-beat="1" aria-labelledby="h-hero">
      <Prop
        kind="billboard"
        label="Billboard di atap COMPANY"
        noBlur
        track="billboard"
        desk={{ x: 12, y: 29.6, w: 43.2, h: 36.2 }}
        phone={{ x: 13.2, y: 43.9, w: 72.4, h: 18.8 }}
      >
        {/* stand-ins for the steel frame and the lamps until the footage has loaded */}
        <span className="bb-truss deco" aria-hidden="true">
          <i className="leg l" />
          <i className="leg r" />
          <i className="brace a" />
          <i className="brace b" />
        </span>
        <span className="bb-lamps deco" aria-hidden="true">
          <i />
          <i />
          <i />
        </span>
        <div className="bb-face">
          <h1 id="h-hero">
            <span className="kick">{t("kicker")}</span>
            <span>{t("headline")}</span>
          </h1>
          <Lit />
        </div>
      </Prop>
      <Prop
        kind="hero-card"
        label="Billboard: paragraf dan tombol"
        noBlur
        track={{ desk: "billboard" }}
        desk={{ x: 12, b: 34.2, w: 43.2 }}
        phone={{ x: 4, b: 3, w: 92 }}
      >
        <p>{t("body")}</p>
        <div className="cta-row">
          <WhatsAppButton section="hero" />
          <a className="btn btn-line" href="#layanan">
            <span>{tCta("services")}</span>
            <ArrowRight className="ic" aria-hidden />
          </a>
        </div>
        <Lit />
      </Prop>
    </section>
  );
}

/* Beat 3 · Layanan · flat landscape leaflet standing in an acrylic stand on the till counter (K3) */
async function Services() {
  const t = await getTranslations("home.services");
  const panels = [
    { key: "assistants", Icon: Sparkle },
    { key: "strategy", Icon: Compass },
    { key: "content", Icon: Palette },
    { key: "training", Icon: ChalkboardTeacher },
  ] as const;
  return (
    <section className="sf" id="layanan" data-beat="3" aria-labelledby="h-svc">
      <Prop
        kind="leaflet"
        label="Leaflet di stand akrilik"
        noBlur
        desk={{ x: 35, y: 15, w: 54 }}
        phone={{ x: 4, b: 3, w: 92 }}
      >
        <i className="lf-stand deco" aria-hidden="true" />
        <div className="lf-paper">
          <h2 id="h-svc">{t("title")}</h2>
          <ul className="panels">
            {panels.map(({ key, Icon }) => (
              <li key={key} className="panel">
                <Icon className="ic" aria-hidden />
                <h3>{t(`${key}.title`)}</h3>
                <p>{t(`${key}.body`)}</p>
                {key === "training" && <span className="soon">{t("training.tag")}</span>}
              </li>
            ))}
          </ul>
          <Lit />
        </div>
      </Prop>
    </section>
  );
}

/* Beat 4 · Use case · open ring binder with coloured tabs (K4) */
async function UseCase() {
  const t = await getTranslations("home.useCase");
  const { home } = await getMessages();
  const industries: Industry[] = Object.entries(home.useCase.industries).map(([key, v]) => ({ key, ...v }));
  return (
    <section className="sf" id="use-case" data-beat="4" aria-labelledby="h-uc">
      <Binder
        title={t("title")}
        intro={t("intro")}
        note={t("note")}
        tabsLabel={t("tabs")}
        industries={industries}
        cta={<WhatsAppButton section="use-case" />}
      />
    </section>
  );
}

/*
 * Beat 5b · Cara kerja · the white second-floor panels of the eight shophouses between COMPANY and the
 * Kreatekno office (K5a → K5). Fruit shop: title; laundry, shoes, warteg, cosmetics: steps 1 to 4; internet
 * café and warung: blank; electronics, next to Kreatekno: the CTA with an arrow to the office door.
 */
async function Journey() {
  const t = await getTranslations("home.journey");
  const steps = ["talk", "map", "build", "launch"] as const;
  return (
    <section className="sf" id="cara-kerja" data-beat="5b" aria-labelledby="h-jr">
      <Prop
        kind="shops"
        label="Panel putih lantai 2 ruko"
        fullX
        desk={{ x: 0, y: 14, w: 100 }}
        phone={{ x: 0, y: 14, w: 100 }}
      >
        <div className="shops-track">
          <div className="shop">
            <div className="shop-panel">
              <span className="kick">{t("kicker")}</span>
              <h2 id="h-jr">{t("title")}</h2>
              <Lit />
            </div>
          </div>
          <ol className="steps">
            {steps.map((key, i) => (
              <li key={key} className="shop">
                <div className="shop-panel">
                  <span className="no" aria-hidden="true">
                    {i + 1}
                  </span>
                  <h3>{t(`${key}.title`)}</h3>
                  <p>{t(`${key}.body`)}</p>
                  <Lit />
                </div>
              </li>
            ))}
          </ol>
          {[0, 1].map((i) => (
            <div key={i} className="shop blank deco" aria-hidden="true">
              <div className="shop-panel" />
            </div>
          ))}
          <div className="shop cta">
            <div className="shop-panel">
              <WhatsAppButton section="journey" />
              <ArrowRight className="ic arrow deco" aria-hidden />
              <Lit />
            </div>
          </div>
        </div>
      </Prop>
    </section>
  );
}

/* Beat 6 · Testimoni · paper strip + polaroids on the lobby corkboard (K6) */
async function Testimonials() {
  const t = await getTranslations("home.testimonials");
  return (
    <section className="sf" id="testimoni" data-beat="6" aria-labelledby="h-ts">
      <Prop kind="strip" label="Strip kertas" desk={{ x: 31, y: 11, w: 38 }} phone={{ x: 6, b: 3, w: 88 }}>
        <i className="pin3d l deco" aria-hidden="true" />
        <i className="pin3d r deco" aria-hidden="true" />
        <h2 id="h-ts">{t("title")}</h2>
        <Lit />
      </Prop>
      <Prop
        kind="polas"
        label="Dinding gabus + kartu polaroid"
        fullX
        desk={{ x: 15, y: 27, w: 70 }}
        phone={{ x: 0, b: 3, w: 100 }}
      >
        {/* Placeholders until real client quotes with permission come in */}
        {[0, 1, 2].map((i) => (
          <figure key={i} className="pola">
            <i className="pin3d deco" aria-hidden="true" />
            <span className="stamp">{t("stamp")}</span>
            <div className="photo">
              <ImageIcon className="ic" aria-hidden />
              <span>{t("photo")}</span>
            </div>
            <blockquote>{t("quote")}</blockquote>
            <figcaption>
              <b>{t("name")}</b>
              <span>{t("business")}</span>
            </figcaption>
          </figure>
        ))}
        <Lit />
      </Prop>
    </section>
  );
}

/* Beat 7 · Artikel · small wooden sign + three magazines standing in the rack (K7) */
async function Articles() {
  const t = await getTranslations("home.articles");
  const mags = [
    { key: "admin", Icon: Receipt },
    { key: "service", Icon: Sparkle },
    { key: "team", Icon: Users },
  ] as const;
  return (
    <section className="sf" id="artikel" data-beat="7" aria-labelledby="h-ar">
      <Prop
        kind="woodboard"
        className="wood-tex"
        label="Papan kayu kecil"
        depth={0.9}
        desk={{ x: 37, y: 12, w: 26 }}
        phone={{ x: 12, b: 3, w: 76 }}
      >
        <h2 id="h-ar">{t("title")}</h2>
        <Lit />
      </Prop>
      <Prop
        as="ul"
        kind="mags"
        label="Rak + 3 sampul majalah"
        desk={{ x: 22, y: 25, w: 56 }}
        phone={{ x: 5, b: 3, w: 90 }}
      >
        {/* TODO (M7): link each cover to its article */}
        {mags.map(({ key, Icon }, i) => (
          <li key={key}>
            <Link className={`mag m${i + 1}`} href="/artikel">
              <span className="mast">
                <span className="sr-only">{t("category")}</span> {t(`${key}.category`)}
              </span>
              <span className="art deco" aria-hidden="true">
                <Icon className="ic" />
              </span>
              <h3>{t(`${key}.title`)}</h3>
              <span className="read">
                <span>{t("read")}</span>
                <ArrowRight className="ic" aria-hidden />
              </span>
            </Link>
          </li>
        ))}
      </Prop>
      <Prop
        kind="more"
        label="Tombol di bawah rak"
        depth={1.1}
        desk={{ x: 38, y: 74, w: 24 }}
        phone={{ x: 15, b: 3, w: 70 }}
      >
        <Link className="btn-paper btn" href="/artikel">
          <span>{t("all")}</span>
          <ArrowRight className="ic" aria-hidden />
        </Link>
      </Prop>
    </section>
  );
}

/* Beat 8 · FAQ · vinyl title on the meeting-room glass, one sticky note per question (K8) */
async function Faq() {
  const t = await getTranslations("home.faq");
  return (
    <section className="sf" id="faq" data-beat="8" aria-labelledby="h-fq">
      <Prop kind="glass-title" label="Kaca: judul" desk={{ x: 9, y: 27, w: 25 }} phone={{ x: 6, y: 9, w: 88 }}>
        <h2 id="h-fq">{t("title")}</h2>
        <Lit />
      </Prop>
      <Prop kind="notes-wrap" label="Kaca: 8 sticky note" desk={{ x: 37, y: 19, w: 54 }} phone={{ x: 5, b: 3, w: 90 }}>
        <FaqNotes items={t.raw("items") as { q: string; a: string }[]} closeLabel={t("close")} />
        <div className="notes-help">
          <p>{t("help")}</p>
          <WhatsAppButton section="faq" />
        </div>
      </Prop>
    </section>
  );
}

/* Beat 9b · Tentang kami · wooden plaque beside the office door at golden hour (K9) */
async function About() {
  const t = await getTranslations("home.about");
  const facts = [
    { key: "registered", Icon: SealCheck },
    { key: "based", Icon: MapPin },
    { key: "free", Icon: Handshake },
    { key: "payment", Icon: Receipt },
  ] as const;
  return (
    <section className="sf" id="tentang" data-beat="9b" aria-labelledby="h-ab">
      <Prop kind="plaque" label="Plakat kayu" desk={{ x: 10, y: 21, w: 36 }} phone={{ x: 4, b: 3, w: 92 }}>
        <i className="lamp-glow deco" aria-hidden="true" />
        <h2 id="h-ab">{t("title")}</h2>
        <p>{t("body")}</p>
        <ul className="facts">
          {facts.map(({ key, Icon }) => (
            <li key={key}>
              <Icon className="ic" aria-hidden />
              <span>{t(key)}</span>
            </li>
          ))}
        </ul>
        <Link className="link" href="/tentang">
          <span>{t("link")}</span>
          <ArrowRight className="ic" aria-hidden />
        </Link>
        <Lit />
      </Prop>
    </section>
  );
}

/* Beat 13 · Praktik naik kelas · small tabletop chalkboard at the left end of the till counter (K13) */
async function Practice() {
  const t = await getTranslations("home.practice");
  return (
    <section className="sf" id="praktik" data-beat="13" aria-label={t("label")}>
      <Prop
        kind="easel"
        className="aframe"
        label="Papan kapur kecil di ujung kiri konter kasir"
        desk={{ x: 28, y: 33, w: 21 }}
        phone={{ x: 11, b: 4, w: 78 }}
      >
        <AFrameStand />
        <div className="af-wood wood-tex">
          <div className="af-slate">
            <p className="chalk">{t("body")}</p>
          </div>
          <Lit />
        </div>
      </Prop>
    </section>
  );
}

/* Beat 14 · CTA · white paper in the open purple folder standing in a document stand on the till (K14) */
async function Contact() {
  const t = await getTranslations("home.cta");
  return (
    <section className="sf" id="kontak" data-beat="14" aria-labelledby="h-cta">
      <Prop
        kind="folder"
        label="Map ungu di stand dokumen di konter"
        desk={{ x: 29, b: 6, w: 42 }}
        phone={{ x: 4, b: 3, w: 92 }}
      >
        <i className="folder-stand deco" aria-hidden="true" />
        <i className="clip deco" aria-hidden="true" />
        <div className="sheet">
          <h2 id="h-cta">{t("title")}</h2>
          <p>{t("body")}</p>
          <div className="cta-row">
            <WhatsAppButton section="cta" />
            <WhatsAppButton section="cta" intent="meet" variant="line" />
          </div>
        </div>
        <Lit />
      </Prop>
    </section>
  );
}

/* Beat 16 · Footer · dark road in the lower third of the night frame (K16) */
async function RoadFooter() {
  const t = await getTranslations("footer");
  const tHome = await getTranslations("home.footer");
  const tNav = await getTranslations("nav");
  const social = (
    [
      { key: "instagram", label: "Instagram", Icon: InstagramLogo },
      { key: "linkedin", label: "LinkedIn", Icon: LinkedinLogo },
      { key: "tiktok", label: "TikTok", Icon: TiktokLogo },
    ] as const
  ).filter((s) => COMPANY.social[s.key]);

  return (
    <footer className="sf" id="footer" data-beat="16">
      <Prop kind="road" label="Pita gelap jalan" desk={{ x: 7, b: 3, w: 86 }} phone={{ x: 5, b: 2, w: 90 }}>
        <div className="foot">
          <div className="f-brand">
            <Image src="/brand/kreatekno-logo-white.webp" alt="Kreatekno" width={560} height={95} />
            <p className="epi">{tHome("epilogue")}</p>
            <p className="f-tag">{t("tagline")}</p>
          </div>
          <nav className="f-col" aria-labelledby="f-pages">
            <h2 id="f-pages">{t("pages")}</h2>
            <ul>
              {NAV_ITEMS.map((item) => (
                <li key={item.key}>
                  <Link href={item.href}>{tNav(item.key)}</Link>
                </li>
              ))}
              <li>
                <Link href="/kebijakan-privasi">{t("privacy")}</Link>
              </li>
            </ul>
          </nav>
          <div className="f-col">
            <h2>{t("contact")}</h2>
            <ul>
              <li>{t("city")}</li>
              <li>{COMPANY.address.streetAddress || t("address")}</li>
              <li>
                <WhatsAppButton section="footer" variant="text" />
              </li>
            </ul>
          </div>
          <div className="f-col f-follow">
            {social.length > 0 && (
              <>
                <h2>{t("follow")}</h2>
                <ul className="social">
                  {social.map(({ key, label, Icon }) => (
                    <li key={key}>
                      <a href={COMPANY.social[key]} target="_blank" rel="noopener" aria-label={label}>
                        <Icon className="ic" aria-hidden />
                      </a>
                    </li>
                  ))}
                </ul>
              </>
            )}
            <LangSwitch tone="dark" />
          </div>
        </div>
        <p className="copy">{t("copyright")}</p>
      </Prop>
    </footer>
  );
}
