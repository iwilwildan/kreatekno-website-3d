import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { getTranslations } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
import { BRAND } from "@/lib/site";

export const alt = "Kreatekno · Automate You";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/** Bricolage Grotesque as TTF (Satori can't read woff2). Falls back to the default font when offline. */
async function displayFont(text: string) {
  try {
    const css = await fetch(
      `https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@96,700&text=${encodeURIComponent(text)}`,
    ).then((r) => r.text());
    const url = css.match(/src: url\((.+?)\) format\('(?:opentype|truetype)'\)/)?.[1];
    if (!url) return null;
    return await fetch(url).then((r) => r.arrayBuffer());
  } catch {
    return null;
  }
}

export default async function Image({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "home.hero" });
  const kicker = t("kicker");
  const headline = t("headline");

  const mark = await readFile(join(process.cwd(), "public/brand/kreatekno-mark.png"));
  const markSrc = `data:image/png;base64,${mark.toString("base64")}`;
  const font = await displayFont(`Kreatekno${kicker}${headline}`);

  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: 72,
        background: `radial-gradient(circle at 85% 15%, ${BRAND.violet}55, transparent 45%), ${BRAND.navy}`,
        color: "#F3F4FF",
        fontFamily: font ? "Bricolage" : "sans-serif",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={markSrc} width={72} height={72} alt="" />
        <span style={{ fontSize: 40, fontWeight: 700, letterSpacing: 2 }}>KREATEKNO</span>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
        <span style={{ fontSize: 28, color: BRAND.cyan, textTransform: "uppercase", letterSpacing: 3 }}>{kicker}</span>
        <span style={{ fontSize: 72, fontWeight: 700, lineHeight: 1.05, letterSpacing: -1.5 }}>{headline}</span>
      </div>
    </div>,
    { ...size, fonts: font ? [{ name: "Bricolage", data: font, weight: 700, style: "normal" }] : undefined },
  );
}
