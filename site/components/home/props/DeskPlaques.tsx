import { getTranslations } from "next-intl/server";

const WHO = ["sinta", "bayu", "nadia", "fajar"] as const;

/** Sentences longer than this (characters) get a smaller size on the panel, three lines in place of two. */
const LONG = 46;

/**
 * Beat 2 and K13 · the plaques on the front panels of the four staff desks (issue #30; copy v3, HOME-V1-COPY.md
 * parts 2 and 10): Sinta's phone, Bayu's monitor, Nadia's laptop, Fajar's price tray. Real HTML rendered on the
 * server; the world places each on its desk's front panel (anchors "desk-before-*" and "desk-after-*") at its size
 * on screen where the camera reads it, shows the before ones in beat 2 (K2.1, K2.2) and the after ones at K13, and
 * hides them (not tabbable) otherwise. Stacked version: each set as a short list after its still.
 */
export async function DeskPlaques() {
  const t = await getTranslations("home.desks");
  return (["before", "after"] as const).map((phase) =>
    WHO.map((who) => {
      const text = t(`${phase}.${who}`);
      return (
        <p
          key={`${phase}-${who}`}
          data-anchor
          data-landscape={`desk-${phase}-${who}`}
          data-portrait={`desk-${phase}-${who}`}
          data-fade
          data-long={text.length > LONG || undefined}
          className={`prop-copy desk-copy desk-${phase}`}
          suppressHydrationWarning
        >
          <span>{text}</span>
        </p>
      );
    }),
  );
}
