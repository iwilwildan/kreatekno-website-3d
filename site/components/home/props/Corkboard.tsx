import { Camera } from "@phosphor-icons/react/ssr";
import { getMessages, getTranslations } from "next-intl/server";
import { TestimonialStory } from "./TestimonialStory";

type Testimonial = { quote: string; name: string; business: string };

/**
 * Beat 6 · Testimoni (tahap 7): the heading on the paper strip of the lobby's corkboard (K6), one testimonial on each
 * of its 3 polaroids (issue #17, was 7): photo, quote, name, business. The quotes are the clients' own (Home copy v3,
 * `home.testimonials.items`); the photo stays a placeholder until the client's photo or logo comes in. On the board
 * a quote shows its first lines; the polaroid is a button ("Baca cerita") that opens the whole story in a dialog
 * (TestimonialStory). The stacked version shows the whole quote and no button (lobby.css). Real HTML
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
              <blockquote>
                <p>“{it.quote}”</p>
              </blockquote>
              <figcaption>
                <span className="polaroid-name">{it.name}</span>
                <span className="polaroid-biz">{it.business}</span>
              </figcaption>
              {/* the whole card opens the story; the visible label sits where the photo meets the paper */}
              <button type="button" className="polaroid-more" data-story={i} aria-label={`${t("more")}: ${it.name}`}>
                <span>{t("more")}</span>
              </button>
            </figure>
          </li>
        ))}
      </ul>
      <TestimonialStory items={items} photo={t("photo")} closeLabel={t("close")} />
    </>
  );
}
