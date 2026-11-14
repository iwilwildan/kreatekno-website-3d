import { getTranslations } from "next-intl/server";
import { WhatsAppButton } from "@/components/layout/WhatsAppButton";

/**
 * Beats 14–16 (tahap 10): the CTA on the lit billboard at night (K15.1, the hero's K0 framing, so the take ends where
 * it began) and the epilogue over the dark road (K16), before the site's footer. Real HTML rendered on the server.
 * The world places the title and the paragraph with the buttons on the billboard's face in the hero's boxes (16:9:
 * anchors "cta-top", "cta-bottom"); on 9:16 the title takes the whole face ("cta-face") and the paragraph with the
 * buttons is a card at the bottom of the screen, faded with it. The epilogue is set straight on the screen over the
 * road's band and fades in at K16. Hidden (not tabbable) away from their holds.
 */
export async function NightCta() {
  const t = await getTranslations("home.cta");
  const tEnd = await getTranslations("home.footer");
  return (
    <>
      <div
        data-anchor
        data-landscape="cta-top"
        data-portrait="cta-face"
        data-fade
        data-fixed
        className="prop-copy cta-copy cta-head"
        suppressHydrationWarning
      >
        <h2 id="h-kontak">{t("title")}</h2>
      </div>
      <div
        data-anchor
        data-landscape="cta-bottom"
        data-portrait=""
        data-fade
        data-fixed
        data-fade-by="cta-face"
        className="prop-copy cta-copy cta-body"
        suppressHydrationWarning
      >
        <p>{t("body")}</p>
        <div className="cta-actions">
          <WhatsAppButton section="cta" />
          <WhatsAppButton section="cta" intent="meet" variant="line" className="text-navy" />
        </div>
      </div>
      <p
        data-anchor
        data-landscape=""
        data-portrait=""
        data-fade
        data-fade-by="epilogue"
        className="take-epilogue"
        suppressHydrationWarning
      >
        {tEnd("epilogue")}
      </p>
    </>
  );
}
