import { ArrowRight } from "@phosphor-icons/react/ssr";
import { getMessages, getTranslations } from "next-intl/server";
import { WhatsAppButton } from "@/components/layout/WhatsAppButton";
import { HomeTake } from "./HomeTake";
import { Binder, type Industry } from "./props/Binder";
import { Journey } from "./props/Journey";
import { Leaflet } from "./props/Leaflet";
import { placeHero } from "./placeHero";
import stillsData from "./stills.json";
import "./stage.css";

const KEYS = [
  "K0",
  "K1",
  "K2",
  "K2.1",
  "K2.2",
  "K3",
  "K4",
  "K4.1",
  "K5a.1",
  "K5a.2",
  "K5a.2b",
  "K5a.3",
  "K5a.3b",
  "K5a.4",
  "K5a.4b",
  "K5a.6",
] as const;
/** Stills that only exist on 9:16 (the second panel of a hold); on 16:9 they repeat the hold's still. */
const HP_ONLY: Partial<Record<(typeof KEYS)[number], string>> = {
  "K5a.2b": "K5a.2",
  "K5a.3b": "K5a.3",
  "K5a.4b": "K5a.4",
};
/** The stacked version (reduced motion, no JavaScript) shows the beat 5b copy with the K5a.2 still only. */
const STACKED = new Set(["K0", "K1", "K2", "K2.1", "K2.2", "K3", "K4", "K5a.2"]);

/**
 * The Home stage (STORY-STAGE.md, beats 1–4 for now: the hero on the billboard, Layanan on the leaflet and Use
 * case on the binder). The copy is rendered here on the server, so it is indexed
 * and read by screen readers before any 3D loads. The stills are rendered from the same 3D scene by tools/render.
 */
export async function HomeStage() {
  const t = await getTranslations("home.hero");
  const tCta = await getTranslations("cta");
  const tStage = await getTranslations("home.stage");
  const tUse = await getTranslations("home.useCase");
  // the industries are a nested list in the messages (four tabs, four examples each)
  const messages = (await getMessages()) as {
    home: { useCase: { industries: Record<string, Omit<Industry, "key">> } };
  };
  const industries: Industry[] = Object.entries(messages.home.useCase.industries).map(([key, v]) => ({ key, ...v }));

  const stills = KEYS.map((k, i) => (
    <picture key={k} className="take-still" data-still={k} data-stack={STACKED.has(k) ? undefined : "no"}>
      <source media="(max-aspect-ratio: 1/1)" srcSet={`/stills/hp/${k.toLowerCase()}.webp`} width={720} height={1280} />
      <img
        src={`/stills/pc/${(HP_ONLY[k] ?? k).toLowerCase()}.webp`}
        width={1600}
        height={900}
        alt={tStage((HP_ONLY[k] ?? k).toLowerCase().replace(".", "_") as Parameters<typeof tStage>[0])}
        {...(i === 0 ? { fetchPriority: "high" as const } : { loading: "lazy" as const })}
        decoding={i === 0 ? "sync" : "async"}
      />
    </picture>
  ));

  return (
    <>
      <HomeTake
        stills={stills}
        copy={
          <>
            <Leaflet />
            <Binder
              title={tUse("title")}
              intro={tUse("intro")}
              note={tUse("note")}
              tabsLabel={tUse("tabs")}
              industries={industries}
              cta={<WhatsAppButton section="usecase" />}
            />
            <Journey />
          </>
        }
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
