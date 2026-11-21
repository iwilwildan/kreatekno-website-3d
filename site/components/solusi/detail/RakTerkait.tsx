"use client";

import { SOLUSI } from "@/content/solusi";
import type { SolusiLocale, SolusiSlug } from "@/content/solusi/schema";
import { TIM } from "@/content/solusi/taksonomi";
import { RakBox } from "../RakBox";
import { RakTrack } from "../RakTrack";

/**
 * "Solusi terkait" as one etalase shelf (RT1, 21 Nov 2026): the same boxes as `/solusi`, each in its own team
 * colour, standing on one plank in the dark display window of the lilac counter. No 3D world on detail pages:
 * `detail.css` (`.etalase.is-mini`) paints the lit box faces, the contact shadows and the plank the 3D pass
 * draws on the etalase, measured from its render.
 */
export function RakTerkait({
  slugs,
  locale,
  labels,
}: {
  slugs: SolusiSlug[];
  locale: SolusiLocale;
  labels: { shelf: string; previous: string; next: string };
}) {
  const href = (slug: string) => (locale === "id" ? `/solusi/${slug}` : `/en/solutions/${slug}`);
  const items = slugs.map((slug) => SOLUSI.find((s) => s.slug === slug)!).filter(Boolean);
  return (
    <div className="etalase is-mini">
      <div className="counter">
        <div className="frame">
          <div className="tiers">
            <div className="tier">
              <RakTrack previous={labels.previous} next={labels.next}>
                {items.map((solution) => (
                  <RakBox
                    key={solution.slug}
                    solution={solution}
                    locale={locale}
                    href={href(solution.slug)}
                    color={TIM.find((team) => team.id === solution.tim[0])?.color ?? "#CDB8F8"}
                  />
                ))}
              </RakTrack>
              <div className="plank">
                <span>{labels.shelf}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="plinth" />
    </div>
  );
}
