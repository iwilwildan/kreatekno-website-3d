import { ArrowRight } from "@phosphor-icons/react/ssr";
import { getTranslations } from "next-intl/server";
import { WhatsAppButton } from "@/components/layout/WhatsAppButton";
import { HomeTake } from "./HomeTake";
import { placeHero } from "./placeHero";
import stillsData from "./stills.json";
import "./stage.css";

const KEYS = ["K0", "K1", "K2", "K2.1", "K2.2"] as const;

/**
 * The Home stage (STORY-STAGE.md, beats 1–2 for now). The copy is rendered here on the server, so it is indexed
 * and read by screen readers before any 3D loads. The stills are rendered from the same 3D scene by tools/render.
 */
export async function HomeStage() {
  const t = await getTranslations("home.hero");
  const tCta = await getTranslations("cta");
  const tStage = await getTranslations("home.stage");

  const stills = KEYS.map((k, i) => (
    <picture key={k} className="take-still" data-still={k}>
      <source media="(max-aspect-ratio: 1/1)" srcSet={`/stills/hp/${k.toLowerCase()}.webp`} width={720} height={1280} />
      <img
        src={`/stills/pc/${k.toLowerCase()}.webp`}
        width={1600}
        height={900}
        alt={tStage(k.toLowerCase().replace(".", "_") as "k0" | "k1" | "k2" | "k2_1" | "k2_2")}
        {...(i === 0 ? { fetchPriority: "high" as const } : { loading: "lazy" as const })}
        decoding={i === 0 ? "sync" : "async"}
      />
    </picture>
  ));

  return (
    <>
      <HomeTake
        stills={stills}
        headline={
          <h1 id="h-hero">
            <span className="hero-kicker">{t("kicker")}</span>
            <span className="hero-title">{t("headline")}</span>
          </h1>
        }
        body={
          <>
            <p className="hero-text">{t("body")}</p>
            <div className="hero-ctas">
              <WhatsAppButton section="hero" />
              <a href="#layanan" className="btn btn-line text-navy">
                <span>{tCta("services")}</span>
                <ArrowRight aria-hidden className="size-[18px]" />
              </a>
            </div>
          </>
        }
      />
      {/* Puts the copy on the billboard of the K0 still before React and the world load. */}
      <script
        dangerouslySetInnerHTML={{
          __html: `(${placeHero.toString()})(document.getElementById("beranda"),${JSON.stringify(stillsData)})`,
        }}
      />
    </>
  );
}
