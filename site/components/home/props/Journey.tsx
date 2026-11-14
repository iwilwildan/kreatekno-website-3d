import { getTranslations } from "next-intl/server";

const STEPS = ["talk", "map", "build", "launch"] as const;

/**
 * Beat 5b · Cara kerja: the customer journey printed on the white panels of the shophouses Heru and Bu Dewi walk past
 * (tahap 6): the fruit shop carries the kicker and the heading, the laundry, shoe shop, food stall and cosmetics
 * shop the four steps (the electronics shop with the "Konsultasi gratis" button was taken out, user 14 Nov). Real
 * HTML rendered on the server; in the film the world places each block on its panel (anchors "journey-*") at the
 * size it has on screen where the camera stops, so the text is sharp there. Hidden (not tabbable) while its panel is
 * off screen.
 */
export async function Journey() {
  const t = await getTranslations("home.journey");
  return (
    <>
      <div
        data-anchor
        data-landscape="journey-intro"
        data-portrait="journey-intro"
        data-fade
        className="prop-copy journey-copy journey-intro"
        suppressHydrationWarning
      >
        <p className="kicker">{t("kicker")}</p>
        <h2 id="h-cara-kerja">{t("title")}</h2>
      </div>
      {STEPS.map((k, i) => (
        <div
          key={k}
          data-anchor
          data-landscape={`journey-${k}`}
          data-portrait={`journey-${k}`}
          data-fade
          data-step={k}
          className="prop-copy journey-copy journey-step"
          suppressHydrationWarning
        >
          <h3>
            <span className="step-num">{i + 1}</span>
            <span>{t(`${k}.title`)}</span>
          </h3>
          <p>{t(`${k}.body`)}</p>
        </div>
      ))}
    </>
  );
}
