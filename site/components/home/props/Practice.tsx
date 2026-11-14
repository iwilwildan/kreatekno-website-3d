import { getTranslations } from "next-intl/server";

/**
 * Beat 13 · Praktik naik kelas (tahap 9): the slide on the classroom's TV that Wildan is teaching from (K12), the
 * label and one sentence. Real HTML rendered on the server; the world places it on the TV's white screen (anchor
 * "practice") at its size where the camera rests in the classroom, shows it at the K12 hold and hides it (not
 * tabbable) otherwise.
 */
export async function Practice() {
  const t = await getTranslations("home.practice");
  return (
    <div
      data-anchor
      data-landscape="practice"
      data-portrait="practice"
      data-fade
      className="prop-copy practice-copy"
      suppressHydrationWarning
    >
      <h2 id="h-praktik">{t("label")}</h2>
      <p>{t("body")}</p>
    </div>
  );
}
