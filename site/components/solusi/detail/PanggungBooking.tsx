import {
  CalendarBlank,
  Check,
  Clock,
  DeviceMobile,
  HandPalm,
  MapPin,
  Moon,
  Sparkle,
  Wrench,
} from "@phosphor-icons/react/ssr";
import type { BookingField, BookingPanggung } from "@/content/solusi/cerita/schema";

const FIELD_ICON = { service: Wrench, day: CalendarBlank, time: Clock } as const;

type Metric = { value: string; unit: string; label: string };

function Who({ name, assistant, staff }: { name: string; assistant?: boolean; staff?: boolean }) {
  return (
    <span className="og-who">
      {assistant && <Sparkle aria-hidden weight="fill" />}
      {staff && <DeviceMobile aria-hidden weight="bold" />}
      {name}
    </span>
  );
}

/** Yes/No pair with a tick that pops on Yes once it counts. */
function Buttons({ yes, no, children }: { yes: string; no: string; children?: React.ReactNode }) {
  return (
    <div className="bj-btns">
      <span className="bj-yes">
        {yes}
        <i className="bj-tick">
          <Check aria-hidden weight="bold" />
        </i>
        {children}
      </span>
      <span className="bj-no">{no}</span>
    </div>
  );
}

/**
 * Motion-graphic stage for the Booking Jasa story (BJ1 "one booking travels", BJ2 approval and takeover): one
 * customer chat becomes a priced answer, a schedule check, a numbered booking and a row in the team schedule.
 * The team approves a reschedule (the first tap counts), a staff member takes the chat over while the AI pauses,
 * and the AI's summary of that chat updates the same row once approved. Server-rendered so every word is in the
 * HTML; `ceritaFilmBooking.ts` animates it. Without the film, CSS shows each scene's end pose from `data-scene`.
 * Shared visuals reuse the Order Grup `og-*` classes.
 */
export function PanggungBooking({ copy, metrics, scene }: { copy: BookingPanggung; metrics: Metric[]; scene: number }) {
  const highlight = (field: BookingField) => ({ "--h": `var(--bj-${field})` }) as React.CSSProperties;
  const { added } = copy.table;
  const { change, takeover, summary } = copy;
  return (
    <div className="bj-cv" data-scene={scene}>
      {/* 1 · before: chats wait for an admin */}
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

      {/* 2-3 · one late-night question, its data and the priced answer */}
      <span className="bj-clock">
        <Moon aria-hidden weight="fill" />
        {copy.clock}
      </span>
      <div className="og-order bj-ask">
        <span className="og-ring" />
        <Who name={copy.ask.who} />
        <p>
          {copy.ask.parts.map((part, index) =>
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
      <ul className="og-chips bj-chips">
        {copy.chips.map(({ field, value }) => {
          const Icon = FIELD_ICON[field];
          return (
            <li key={field} className="og-chip" data-field={field} style={{ background: `var(--bj-${field})` }}>
              <Icon aria-hidden weight="bold" />
              {value}
            </li>
          );
        })}
      </ul>
      <div className="og-bub is-asisten bj-reply">
        <Who name={copy.reply.who} assistant />
        {copy.reply.text}
      </div>

      {/* 4 · the schedule check */}
      <div className="bj-day">
        <b className="bj-day-h">
          <CalendarBlank aria-hidden weight="bold" />
          {copy.day.title}
        </b>
        {copy.day.slots.map((slot) => (
          <div key={slot.time} className={`bj-slot is-${slot.state}`}>
            <span className="bj-t">{slot.time}</span>
            <span className="bj-pill">
              {slot.state === "taken" || slot.state === "asked" ? copy.day.taken : copy.day.free}
            </span>
          </div>
        ))}
      </div>
      <ul className="bj-rules">
        {copy.rules.map((rule) => (
          <li key={rule}>
            <Check aria-hidden weight="bold" />
            {rule}
          </li>
        ))}
      </ul>
      <div className="og-bub is-asisten bj-offer">
        <Who name={copy.offer.who} assistant />
        {copy.offer.text}
      </div>

      {/* 5 · location, then the saved booking */}
      <div className="og-bub bj-loc">
        <Who name={copy.location.who} />
        <span className="bj-loc-t">
          <MapPin aria-hidden weight="fill" />
          {copy.location.text}
        </span>
      </div>
      <div className="bj-card">
        <div className="bj-card-h">
          <b>{copy.card.no}</b>
          <span className="bj-ok">
            <Check aria-hidden weight="bold" />
            {copy.card.status}
          </span>
        </div>
        <dl>
          {copy.card.lines.map((line) => (
            <div key={line.label}>
              <dt>{line.label}</dt>
              <dd>{line.value}</dd>
            </div>
          ))}
        </dl>
      </div>

      {/* 6-7, 9 · the team schedule, its report, an approved change and the approved summary */}
      <div className="bj-tbl">
        {copy.table.rows.map((row) => (
          <div key={row.time} className="bj-tr">
            <span className="bj-d">{row.day}</span>
            <span className="bj-t">{row.time}</span>
            <span>{row.customer}</span>
            <span className="bj-svc">{row.service}</span>
          </div>
        ))}
        <div className="bj-tr is-new">
          <span className="bj-d og-swap">
            <span className="og-was">{added.day}</span>
            <span className="og-now">{added.moved}</span>
          </span>
          <span className="bj-t">{added.time}</span>
          <span>{added.customer}</span>
          <span className="bj-svc og-swap">
            <span className="bj-svc-was">{added.service}</span>
            <span className="bj-svc-now">{added.merged}</span>
          </span>
        </div>
      </div>
      <div className="bj-toast">
        {/* eslint-disable-next-line @next/next/no-img-element -- tiny decorative brand mark */}
        <img src="/brand/kreatekno-mark.png" alt="" width={28} height={28} />
        <div>
          <b>{copy.toast.title}</b>
          <span>{copy.toast.text}</span>
        </div>
      </div>
      <div className="og-bub bj-ask2">
        <Who name={change.ask.who} />
        {change.ask.text}
      </div>
      <div className="bj-req">
        <b>{change.title}</b>
        <p>
          <span>{change.from}</span>
          <span aria-hidden>→</span>
          <strong>{change.to}</strong>
        </p>
        <small className="bj-why">{change.reason}</small>
        <Buttons yes={change.yes} no={change.no}>
          <em className="bj-tap is-first">{change.first}</em>
          <em className="bj-tap is-second">{change.second}</em>
        </Buttons>
        <span className="bj-decided">
          <Clock aria-hidden weight="bold" />
          {change.decided}
        </span>
      </div>
      <div className="og-bub is-asisten bj-done">
        <Who name={change.done.who} assistant />
        {change.done.text}
      </div>

      {/* 8 · a staff member takes the chat over from their phone; the AI pauses */}
      <div className="og-bub bj-tk-ask">
        <Who name={takeover.ask.who} />
        {takeover.ask.text}
      </div>
      <div className="og-bub is-staf bj-tk-staff">
        <Who name={takeover.staff.who} staff />
        {takeover.staff.text}
      </div>
      <div className="bj-pause">
        <HandPalm aria-hidden weight="fill" />
        <span>{takeover.pause}</span>
        <i className="bj-pause-bar" />
      </div>
      <div className="og-bub is-staf bj-tk-price">
        <Who name={takeover.price.who} staff />
        {takeover.price.text}
      </div>
      <div className="og-bub bj-tk-agree">
        <Who name={takeover.agree.who} />
        {takeover.agree.text}
      </div>

      {/* 9 · the AI's summary of that chat, approved with the same buttons */}
      <div className="bj-sum">
        <b className="bj-sum-h">
          <Sparkle aria-hidden weight="fill" />
          {summary.title}
        </b>
        <dl>
          <div>
            <dt>{summary.agreedLabel}</dt>
            <dd>{summary.agreed}</dd>
          </div>
          <div>
            <dt>{summary.proposalLabel}</dt>
            <dd>
              {summary.proposal} · <strong>{summary.price}</strong>
            </dd>
          </div>
        </dl>
        <Buttons yes={change.yes} no={change.no} />
      </div>

      {/* 10-11 · results */}
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
