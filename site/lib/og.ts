// Shared by the Open Graph images (app/[locale]/opengraph-image.tsx and the articles').

/** Bricolage Grotesque as TTF (Satori can't read woff2). Falls back to the default font when offline. */
export async function displayFont(text: string) {
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
