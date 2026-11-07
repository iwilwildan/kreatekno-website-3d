import { getTranslations } from "next-intl/server";
import type { ReactNode } from "react";

const SERVICES = ["assistants", "strategy", "content", "training"] as const;

/** Line icons (24 × 24, stroke), one per service: a chat assistant, a route plan, a pen, a mortarboard. */
const ICONS: Record<(typeof SERVICES)[number], ReactNode> = {
  assistants: (
    <>
      <path d="M5 5h14a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2h-7l-4.5 3.5V17H5a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2Z" />
      <path d="M8.5 11h.01M12 11h.01M15.5 11h.01" strokeWidth="3" />
    </>
  ),
  strategy: (
    <>
      <circle cx="6" cy="18" r="2.2" />
      <circle cx="18" cy="6" r="2.2" />
      <path d="M8.2 18H14a3 3 0 0 0 0-6h-4a3 3 0 0 1 0-6h5.8" />
    </>
  ),
  content: (
    <>
      <path d="m15 4.5 4.5 4.5L9 19.5H4.5V15Z" />
      <path d="m12.5 7 4.5 4.5" />
    </>
  ),
  training: (
    <>
      <path d="m2.5 9 9.5-4.5L21.5 9 12 13.5Z" />
      <path d="M6.5 11v4.5c1.5 1.5 3.5 2.2 5.5 2.2s4-.7 5.5-2.2V11M21.5 9v5" />
    </>
  ),
};

/**
 * Beat 3 · Layanan: the copy printed on the A4 leaflet Heru lays on the counter (K3). Real HTML, rendered on the
 * server; in the film the world places it on the leaflet's top (anchor "leaflet") and fades it in at the hold.
 * Its layout follows the sheet: four cards on the landscape sheet (16:9), stacked on the portrait one (9:16),
 * clear of Heru's fingers (top left) and Bu Dewi's (bottom right). The logo and the rules are printed on the
 * sheet itself (counterProps), so the leaflet is not blank while it is brought up and slid away.
 */
export async function Leaflet() {
  const t = await getTranslations("home.services");
  const tNav = await getTranslations("nav");
  return (
    <div
      data-anchor
      data-landscape="leaflet"
      data-portrait="leaflet"
      data-fade
      className="prop-copy leaflet-copy"
      suppressHydrationWarning
    >
      <p className="kicker">{tNav("services")}</p>
      <h2 id="h-layanan">{t("title")}</h2>
      <ul className="services">
        {SERVICES.map((k, i) => (
          <li key={k} data-svc={k}>
            <span className="svc-head" aria-hidden="true">
              <svg
                className="svc-icon"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                {ICONS[k]}
              </svg>
              <span className="svc-num">{String(i + 1).padStart(2, "0")}</span>
            </span>
            <h3>{t(`${k}.title`)}</h3>
            <p>{t(`${k}.body`)}</p>
            {k === "training" && <span className="tag">{t("training.tag")}</span>}
          </li>
        ))}
      </ul>
    </div>
  );
}
