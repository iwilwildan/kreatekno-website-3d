import {
  ChatCircleDots,
  Check,
  Funnel,
  House,
  PaperPlaneTilt,
  Sparkle,
  Sun,
  UserList,
  UsersThree,
} from "@phosphor-icons/react/ssr";
import type { ProspekField, ProspekPanggung } from "@/content/solusi/cerita/schema";

const FIELD_ICON = { unit: House, reason: ChatCircleDots } as const;

type Metric = { value: string; unit: string; label: string };

/**
 * Motion-graphic stage for the Follow-up Prospek story (FP1 "one prospect row travels"): prospects who asked for
 * time pile up, the morning check reads the prospect table, two filters keep the one row that is still pending
 * and quiet for more than three days, its chat summary lifts out two chips that become a short AI draft, the
 * draft lands with the marketing team who send it, and the row is marked as contacted (a design step).
 * Server-rendered so every word is in the HTML; `ceritaFilmProspek.ts` animates it. Without the film, CSS shows
 * each scene's end pose from `data-scene`. Shared visuals reuse the Order Grup `og-*` classes.
 */
export function PanggungProspek({ copy, metrics, scene }: { copy: ProspekPanggung; metrics: Metric[]; scene: number }) {
  const highlight = (field: ProspekField) => ({ "--h": `var(--fp-${field})` }) as React.CSSProperties;
  const { table, status, team, update } = copy;
  return (
    <div className="fp-cv" data-scene={scene}>
      {/* 1 · before: prospects who asked for time, never contacted again */}
      <div className="og-pile">
        <div className="og-list">
          {[...copy.messages, ...copy.messages].map((message, index) => (
            <div key={index} className={index % 2 ? "og-bub is-alt" : "og-bub"}>
              <span className="og-who">{message.who}</span>
              {message.text}
              {message.tag && index < copy.messages.length && <span className="og-tag">{message.tag}</span>}
            </div>
          ))}
        </div>
      </div>
      <div className="og-count">
        <b className="og-cnt" data-to={copy.counter.value}>
          {copy.counter.value}
        </b>
        <small>{copy.counter.label}</small>
      </div>

      {/* 2 · every morning */}
      <div className="fp-alarm">
        <Sun aria-hidden weight="fill" />
        <b>{copy.alarm.time}</b>
        <small>{copy.alarm.label}</small>
      </div>

      {/* 3-4, 7 · the prospect table, the filters, then the row marked as contacted */}
      <ul className="og-chips fp-filters">
        {copy.filters.map((filter) => (
          <li key={filter} className="og-chip">
            <Funnel aria-hidden weight="bold" />
            {filter}
          </li>
        ))}
      </ul>
      <div className="fp-table">
        <div className="fp-th">
          <b>
            <UserList aria-hidden weight="bold" />
            {table.title}
          </b>
          <small>{table.time}</small>
          <span className="og-sample">{update.tag}</span>
        </div>
        {table.rows.map((row, index) => {
          const pick = index === table.pick;
          return (
            <div key={row.name} className={pick ? "fp-tr is-pick" : "fp-tr"} data-status={row.status}>
              {pick && <i className="ck-glow fp-glow" />}
              <span className="fp-who">
                <b>{row.name}</b>
                <small>{row.summary}</small>
              </span>
              {pick ? (
                <>
                  <span className="og-swap fp-stc">
                    <span className="og-was fp-st">{status[row.status]}</span>
                    <span className="og-now fp-st is-done">{update.status}</span>
                  </span>
                  <span className="og-swap fp-last">
                    <span className="og-was">{row.last}</span>
                    <span className="og-now">{update.last}</span>
                  </span>
                </>
              ) : (
                <>
                  <span className="fp-stc">
                    <span className="fp-st">{status[row.status]}</span>
                  </span>
                  <span className="fp-last">{row.last}</span>
                </>
              )}
            </div>
          );
        })}
      </div>

      {/* 5 · AI reads the picked row and writes one short message */}
      <div className="og-order fp-lead">
        <span className="og-who">{copy.lead.name}</span>
        <p>
          {copy.lead.parts.map((part, index) =>
            typeof part === "string" ? (
              part
            ) : (
              <span key={index} className="og-hl" data-field={part.field} style={highlight(part.field)}>
                {part.text}
              </span>
            ),
          )}
        </p>
      </div>
      <ul className="og-chips fp-chips">
        {copy.chips.map(({ field, value }) => {
          const Icon = FIELD_ICON[field];
          return (
            <li key={field} className="og-chip" data-field={field} style={{ background: `var(--fp-${field})` }}>
              <Icon aria-hidden weight="bold" />
              {value}
            </li>
          );
        })}
      </ul>

      {/* 6 · the draft goes to the marketing team, who send it */}
      <div className="fp-team">
        <div className="fp-team-h">
          <span className="fp-team-i">
            <UsersThree aria-hidden weight="bold" />
          </span>
          <span className="fp-team-t">
            <b>{team.title}</b>
            <small>{team.line}</small>
          </span>
        </div>
        <div className="fp-slot" />
        <div className="og-swap fp-act">
          <span className="fp-send">
            <PaperPlaneTilt aria-hidden weight="bold" />
            {team.send}
          </span>
          <span className="fp-sent">
            <Check aria-hidden weight="bold" />
            {team.sent}
          </span>
        </div>
      </div>
      <div className="og-bub is-asisten fp-draft">
        <span className="og-who">
          <Sparkle aria-hidden weight="fill" />
          {copy.draft.who}
        </span>
        {copy.draft.text}
      </div>

      {/* 8-9 · results */}
      <div className="og-mx">
        {metrics.map((metric) => (
          <div key={metric.label} className="og-m">
            <b>
              <span className="og-num" data-to={/^\d+$/.test(metric.value) ? metric.value : undefined}>
                {metric.value}
              </span>
              <small>{metric.unit}</small>
            </b>
            <p>{metric.label}</p>
          </div>
        ))}
        <span className="og-sample">{copy.sample}</span>
      </div>
    </div>
  );
}
