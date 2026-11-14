import type { Solusi, SolusiLocale, Industri, Tim, App } from "../../content/solusi/schema";
import { catalogCopy } from "../../content/solusi/catalog";
import { liveFirst } from "./tiers";

export type SearchFilters = {
  term?: string;
  industri?: Industri | "";
  tim?: Tim | "";
  app?: App | "";
  status?: Solusi["status"] | "";
};
export const PAGE_SIZE = 6;

/** Literal phrase matching, like v1. Results keep source order within each status. */
export function searchList(items: readonly Solusi[], filters: SearchFilters = {}, locale: SolusiLocale = "id") {
  const term = (filters.term || "").trim().toLowerCase();
  return items
    .filter((s) => {
      const copy = catalogCopy(s, locale);
      return (
        (!filters.industri || s.industri.includes(filters.industri)) &&
        (!filters.tim || s.tim.includes(filters.tim)) &&
        (!filters.app || s.apps.includes(filters.app)) &&
        (!filters.status || s.status === filters.status) &&
        (!term || [copy.title, copy.result, copy.summary, copy.keywords].join(" ").toLowerCase().includes(term))
      );
    })
    .sort(liveFirst);
}

/** Page is 1-based. No matches: page 1, pageCount 0, no navigation. */
export function searchPage(
  items: readonly Solusi[],
  filters: SearchFilters = {},
  requestedPage = 1,
  locale: SolusiLocale = "id",
) {
  const matches = searchList(items, filters, locale);
  const pageCount = Math.ceil(matches.length / PAGE_SIZE);
  const page = Math.min(
    Math.max(1, Number.isFinite(requestedPage) ? Math.trunc(requestedPage) : 1),
    Math.max(1, pageCount),
  );
  return {
    items: matches.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE),
    total: matches.length,
    page,
    pageCount,
    hasPrevious: page > 1,
    hasNext: page < pageCount,
  };
}
