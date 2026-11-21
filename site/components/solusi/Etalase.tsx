"use client";

import { useTranslations } from "next-intl";
import { useMemo } from "react";
import { SOLUSI } from "@/content/solusi";
import type { SolusiLocale } from "@/content/solusi/schema";
import { buildTiers } from "@/lib/solusi/tiers";
import { RakBox } from "./RakBox";
import { RakTrack } from "./RakTrack";

/** Etalase as in the v1 prototype of 13 Nov: one tier per team, tall boxes, no decor slots. */
export function Etalase({ locale, detailHref }: { locale: SolusiLocale; detailHref: (slug: string) => string }) {
  const t = useTranslations("pages.solutions.catalog");
  const tiers = useMemo(() => buildTiers(SOLUSI), []);

  return (
    <section className="etalase" aria-labelledby="et-h">
      <div className="room">
        <div className="counter">
          <h2 className="counter-h" id="et-h">
            {t("title")}
          </h2>
          <div className="frame">
            <div className="tiers">
              {tiers.map(({ team, solutions }) => {
                const teamName = team.label[locale];
                return (
                  <section
                    className="tier"
                    key={team.id}
                    data-team={team.id}
                    style={{ "--c": team.color } as React.CSSProperties}
                    aria-labelledby={`t-${team.id}`}
                  >
                    <RakTrack previous={t("previous", { team: teamName })} next={t("next", { team: teamName })}>
                      {solutions.map((solution) => (
                        <RakBox
                          key={solution.slug}
                          solution={solution}
                          locale={locale}
                          href={detailHref(solution.slug)}
                          color={team.color}
                        />
                      ))}
                    </RakTrack>
                    <div className="plank">
                      <h3 id={`t-${team.id}`}>{teamName}</h3>
                    </div>
                  </section>
                );
              })}
            </div>
          </div>
        </div>
        <div className="plinth" />
      </div>
    </section>
  );
}
