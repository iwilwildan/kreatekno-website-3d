import { ArrowRight } from "@phosphor-icons/react/ssr";
import { getMessages, getTranslations } from "next-intl/server";
import { JsonLd } from "@/components/JsonLd";
import { WhatsAppButton } from "@/components/layout/WhatsAppButton";
import { BOOT_LIMIT_MS, bootLock } from "./bootLock";
import { HomeTake } from "./HomeTake";
import { Binder, type Industry } from "./props/Binder";
import { Journey } from "./props/Journey";
import { Leaflet } from "./props/Leaflet";
import { placeHero } from "./placeHero";
import { Corkboard } from "./props/Corkboard";
import { MagazineRack } from "./props/MagazineRack";
import { StickyNotes } from "./props/StickyNotes";
import { Plaque } from "./props/Plaque";
import { PLAQUE_KEYS } from "./plaqueStills";
import { Practice } from "./props/Practice";
import { CLASS_KEYS } from "./classStills";
import { LOBBY_KEYS } from "./lobbyStills";
import stillsData from "./stills.json";
import "./stage.css";
import "./lobby.css";
import "./plaque.css";
import "./practice.css";

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
  // the lobby (tahap 7): on 9:16 one still per stop of a hold (K6: the strip, then the 3 polaroids; K7: the sign, the
  // 3 books, the button; K8: the left and the right two columns of notes)
  ...LOBBY_KEYS,
  "K9.1",
  // beats 9b–11 (tahap 8): the plaque (on 9:16 a still per column) and COMPANY's door
  ...PLAQUE_KEYS,
  // beats 12–13 (tahap 9): the class at the TV, the front room at dusk
  ...CLASS_KEYS,
] as const;
type Key = (typeof KEYS)[number];
/** Stills that only exist on 9:16 (a later stop of a hold); on 16:9 they repeat the hold's still. */
const HP_ONLY: Partial<Record<Key, string>> = {
  "K5a.2b": "K5a.2",
  "K5a.3b": "K5a.3",
  "K5a.4b": "K5a.4",
  ...Object.fromEntries(LOBBY_KEYS.filter((k) => !/\d$/.test(k)).map((k) => [k, k.replace(/[b-h]$/, "")])),
  "K9b-2": "K9b",
};
/**
 * The stacked version (reduced motion, no JavaScript) shows the beat 5b copy with the K5a.2 still only, the lobby's
 * with the K6, K7 and K8 stills, the plaque's (tahap 8) with the K9b still, the TV's (tahap 9) with the K12 still.
 */
const STACKED = new Set(["K0", "K1", "K2", "K2.1", "K2.2", "K3", "K4", "K5a.2", "K6", "K7", "K8", "K9b", "K12"]);

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
  const tFaq = await getTranslations("home.faq");
  // the industries are a nested list in the messages (four tabs, four examples each), the FAQ a list of 8
  const messages = (await getMessages()) as {
    home: {
      useCase: { industries: Record<string, Omit<Industry, "key">> };
      faq: { items: { q: string; a: string }[] };
    };
  };
  const faq = messages.home.faq.items;
  const industries: Industry[] = Object.entries(messages.home.useCase.industries).map(([key, v]) => ({ key, ...v }));

  const stills = KEYS.map((k, i) => (
    <picture key={k} className="take-still" data-still={k} data-stack={STACKED.has(k) ? undefined : "no"}>
      <source media="(max-aspect-ratio: 1/1)" srcSet={`/stills/hp/${k.toLowerCase()}.webp`} width={720} height={1280} />
      <img
        src={`/stills/pc/${(HP_ONLY[k] ?? k).toLowerCase()}.webp`}
        width={1600}
        height={900}
        alt={tStage((HP_ONLY[k] ?? k).toLowerCase().replaceAll(".", "_") as Parameters<typeof tStage>[0])}
        {...(i === 0 ? { fetchPriority: "high" as const } : { loading: "lazy" as const })}
        decoding={i === 0 ? "sync" : "async"}
      />
    </picture>
  ));

  return (
    <>
      {/* Locks the scroll while the world boots, before the take is parsed (bootLock.ts). */}
      <script dangerouslySetInnerHTML={{ __html: `(${bootLock.toString()})(${BOOT_LIMIT_MS})` }} />
      <HomeTake
        loadingLabel={tStage("loading")}
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
            <Corkboard />
            <MagazineRack />
            <StickyNotes title={tFaq("title")} help={tFaq("help")} closeLabel={tFaq("close")} items={faq} />
            <Plaque />
            <Practice />
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
      {/* The 8 questions of the FAQ beat (K8), the same text as on the sticky notes. */}
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: faq.map((f) => ({
            "@type": "Question",
            name: f.q,
            acceptedAnswer: { "@type": "Answer", text: f.a },
          })),
        }}
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
