import { getTranslations } from "next-intl/server";

/** The closing line over the night road at K16, immediately before the site footer. */
export async function RoadEpilogue() {
  const t = await getTranslations("home.footer");
  return (
    <p
      data-anchor
      data-landscape=""
      data-portrait=""
      data-fade
      data-fade-by="epilogue"
      className="take-epilogue"
      suppressHydrationWarning
    >
      {t("epilogue")}
    </p>
  );
}
