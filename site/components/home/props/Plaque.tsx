import { ArrowRight, Check } from "@phosphor-icons/react/ssr";
import { getTranslations } from "next-intl/server";
import Image from "next/image";
import { Link } from "@/i18n/navigation";

const FACTS = ["registered", "based", "free", "payment"] as const;
const CLIENTS = [
  { name: "Kringmie", src: "/brand/clients/kringmie-transparent.png", width: 872, height: 731 },
  {
    name: "Jafa Indo Corpora",
    src: "/brand/clients/jafa-indo-corpora-transparent.png",
    width: 1094,
    height: 793,
  },
  {
    name: "BertuAI Komunitas AI Riau",
    src: "/brand/clients/bertuai-komunitas-ai-riau-transparent.png",
    width: 986,
    height: 303,
  },
  {
    name: "PT Pamor Sapta Dharma",
    src: "/brand/clients/pt-pamor-sapta-dharma-transparent.png",
    width: 865,
    height: 891,
  },
  {
    name: "Threadmation",
    src: "/brand/clients/threadmation-transparent.png",
    width: 1279,
    height: 255,
  },
  {
    name: "Riau Home Cleaning",
    src: "/brand/clients/riau-home-cleaning-transparent.png",
    width: 1254,
    height: 1254,
  },
  {
    name: "Public Speaking Indonesia",
    src: "/brand/clients/public-speaking-indonesia-transparent.png",
    width: 392,
    height: 91,
  },
  {
    name: "Nextive AI",
    src: "/brand/clients/nextive-ai-transparent.png",
    width: 559,
    height: 427,
  },
  {
    name: "Nexman Kopi Ginseng",
    src: "/brand/clients/nexman-kopi-ginseng-transparent.png",
    width: 420,
    height: 133,
  },
  {
    name: "Nextgam Nextive Gaming",
    src: "/brand/clients/nextgam-nextive-gaming-transparent.png",
    width: 1018,
    height: 246,
  },
  {
    name: "Item Kingdom",
    src: "/brand/clients/item-kingdom-transparent.png",
    width: 711,
    height: 807,
  },
  {
    name: "Dance School",
    src: "/brand/clients/dance-school-transparent.png",
    width: 878,
    height: 757,
  },
  {
    name: "Ragamuda Bertuah Logistik",
    src: "/brand/clients/ragamuda-bertuah-logistik-transparent.png",
    width: 1056,
    height: 226,
  },
] as const;

/**
 * Beat 9b · Tentang kami (tahap 8): the wooden plaque left of Kreatekno's door (K9b) in two columns, the heading and
 * the paragraph left, the four facts and the link to /tentang right, and all client logos in the lower half of the
 * same plaque (issue #34). Real HTML rendered on the server; the world places the three areas on the plaque, on phones
 * as three bands across it read at once (user 17 Nov).
 */
export async function Plaque() {
  const t = await getTranslations("home.about");
  return (
    <>
      <div
        data-anchor
        data-landscape="about-0"
        data-portrait="about-hp-0"
        data-fade
        className="prop-copy plaque-copy plaque-main"
        suppressHydrationWarning
      >
        <h2 id="h-tentang">{t("title")}</h2>
        <p>{t("body")}</p>
      </div>
      <div
        data-anchor
        data-landscape="about-1"
        data-portrait="about-hp-1"
        data-fade
        className="prop-copy plaque-copy plaque-facts"
        suppressHydrationWarning
      >
        <ul aria-labelledby="h-tentang">
          {FACTS.map((k) => (
            <li key={k}>
              <Check aria-hidden weight="bold" className="plaque-check" />
              <span>{t(k)}</span>
            </li>
          ))}
        </ul>
        <Link href="/tentang" className="plaque-link">
          <span>{t("link")}</span>
          <ArrowRight aria-hidden weight="bold" />
        </Link>
      </div>
      <div
        data-anchor
        data-landscape="about-2"
        data-portrait="about-hp-2"
        data-fade
        className="prop-copy plaque-copy plaque-trusted"
        suppressHydrationWarning
      >
        <p id="h-trusted" className="plaque-trusted-label">
          Trusted By
        </p>
        <ul aria-labelledby="h-trusted">
          {CLIENTS.map((client) => (
            <li key={client.src} title={client.name}>
              <Image
                src={client.src}
                width={client.width}
                height={client.height}
                sizes="(max-aspect-ratio: 1/1) 18vw, 8vw"
                alt={client.name}
              />
              <span>{client.name}</span>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}
