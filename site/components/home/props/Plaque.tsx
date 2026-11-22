import { ArrowRight, Check } from "@phosphor-icons/react/ssr";
import { getTranslations } from "next-intl/server";
import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { CLIENTS } from "@/lib/clients";

const FACTS = ["registered", "based", "free", "payment"] as const;

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
