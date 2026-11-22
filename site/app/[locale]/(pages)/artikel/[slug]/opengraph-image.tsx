import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { cacheLife } from "next/cache";
import { ImageResponse } from "next/og";
import { getTranslations } from "next-intl/server";
import { coverOf } from "@/components/articles/ArticleCover";
import { article } from "@/content/articles";
import { ARTICLE_KEYS, ARTICLE_SLUGS, articleKeyOf } from "@/content/articles/slugs";
import type { Locale } from "@/i18n/routing";
import { displayFont } from "@/lib/og";
import { BRAND } from "@/lib/site";

export const alt = "Kreatekno";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export async function generateStaticParams({ params }: { params: { locale: string } }) {
  const locale = params.locale as Locale;
  return ARTICLE_KEYS.map((key) => ({ slug: ARTICLE_SLUGS[key][locale] }));
}

/** Title, category and cover colour of one article, cached so the image is rendered at build time. */
async function imageData(locale: Locale, slug: string) {
  "use cache";
  cacheLife("max");
  const key = articleKeyOf(locale, slug) ?? ARTICLE_KEYS[0];
  const { meta } = article(locale, key);
  const t = await getTranslations({ locale, namespace: "home.articles" });
  const category = t(`${key}.category`);
  const mark = await readFile(join(process.cwd(), "public/brand/kreatekno-mark.png"));
  const font = await displayFont(`Kreatekno${category}${meta.title}`);
  return {
    title: meta.title,
    category,
    cover: coverOf(key),
    markSrc: `data:image/png;base64,${mark.toString("base64")}`,
    font,
  };
}

export default async function Image({ params }: { params: Promise<{ locale: Locale; slug: string }> }) {
  const { locale, slug } = await params;
  const { title, category, cover, markSrc, font } = await imageData(locale, slug);
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: 72,
        background: "#fffdf6",
        borderLeft: `28px solid ${cover}`,
        color: BRAND.navy,
        fontFamily: font ? "Bricolage" : "sans-serif",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={markSrc} width={60} height={60} alt="" />
        <span style={{ fontSize: 34, fontWeight: 700, letterSpacing: 2 }}>KREATEKNO</span>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 22 }}>
        <span style={{ fontSize: 28, color: cover, textTransform: "uppercase", letterSpacing: 3 }}>{category}</span>
        <span style={{ fontSize: title.length > 60 ? 56 : 68, fontWeight: 700, lineHeight: 1.06, letterSpacing: -1.2 }}>
          {title}
        </span>
      </div>
    </div>,
    { ...size, fonts: font ? [{ name: "Bricolage", data: font, weight: 700, style: "normal" }] : undefined },
  );
}
