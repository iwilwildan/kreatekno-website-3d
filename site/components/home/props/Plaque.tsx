import { ArrowRight, Check } from "@phosphor-icons/react/ssr";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";

const FACTS = ["registered", "based", "free", "payment"] as const;

/**
 * Beat 9b · Tentang kami (tahap 8): the wooden plaque left of Kreatekno's door (K9b) in two columns, the heading and
 * the paragraph left, the four facts and the link to /tentang right. Real HTML rendered on the server; the world
 * places each column on the plaque's face (anchors "about-0", "about-1") at its size on screen where the camera reads
 * it (9:16: a stop per column), shows it at the K9b hold and hides it (not tabbable) otherwise.
 */
export async function Plaque() {
  const t = await getTranslations("home.about");
  return (
    <>
      <div
        data-anchor
        data-landscape="about-0"
        data-portrait="about-0"
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
        data-portrait="about-1"
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
    </>
  );
}
