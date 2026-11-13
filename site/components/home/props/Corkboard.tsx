import { Camera } from "@phosphor-icons/react/ssr";
import { getMessages, getTranslations } from "next-intl/server";

type Testimonial = { quote: string; name: string; business: string };

/**
 * Beat 6 · Testimoni (tahap 7): the heading on the paper strip of the lobby's corkboard (K6), one testimonial on each
 * of its 3 polaroids (issue #17, was 7): photo, quote, name, business. Until real quotes come in (with the client's permission, team
 * document) each card is a placeholder stamped CONTOH, replaced one by one in `home.testimonials.items`. Real HTML
 * rendered on the server; in the film the world places each block on its prop (anchors "board-strip", "testi-0..2")
 * at its size on screen where the camera reads it, shows it at the K6 hold and hides it (not tabbable) otherwise.
 */
export async function Corkboard() {
  const t = await getTranslations("home.testimonials");
  const messages = (await getMessages()) as { home: { testimonials: { items: Testimonial[] } } };
  const items = messages.home.testimonials.items;
  return (
    <>
      <div
        data-anchor
        data-landscape="board-strip"
        data-portrait="board-strip"
        data-fade
        className="prop-copy lobby-copy board-strip"
        suppressHydrationWarning
      >
        <h2 id="h-testimoni">{t("title")}</h2>
      </div>
      <ul className="lobby-list testi-list" aria-labelledby="h-testimoni">
        {items.map((it, i) => (
          <li
            key={i}
            data-anchor
            data-landscape={`testi-${i}`}
            data-portrait={`testi-${i}`}
            data-fade
            data-tone={i % 4}
            className="prop-copy lobby-copy polaroid"
            suppressHydrationWarning
          >
            <figure>
              {/* the photo's place on the polaroid (covers the printed grey of the 3D card) */}
              <div className="polaroid-photo" aria-hidden>
                <Camera className="polaroid-cam" weight="duotone" />
                <span>{t("photo")}</span>
              </div>
              <span className="polaroid-stamp">{t("stamp")}</span>
              <blockquote>
                <p>“{it.quote}”</p>
              </blockquote>
              <figcaption>
                <span className="polaroid-name">{it.name}</span>
                <span className="polaroid-biz">{it.business}</span>
              </figcaption>
            </figure>
          </li>
        ))}
      </ul>
    </>
  );
}
