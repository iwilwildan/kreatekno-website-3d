import { CalendarBlank, Check, Clock, MapPin, Moon, Sparkle, Wrench } from "@phosphor-icons/react/ssr";
import type { BookingField, BookingPanggung } from "@/content/solusi/cerita/schema";

const FIELD_ICON = { service: Wrench, day: CalendarBlank, time: Clock } as const;

type Metric = { value: string; unit: string; label: string };

function Who({ name, assistant }: { name: string; assistant?: boolean }) {
  return (
    <span className="og-who">
      {assistant && <Sparkle aria-hidden weight="fill" />}
      {name}
    </span>
  );
}

/**
 * Motion-graphic stage for the Booking Jasa story (BJ1 "one booking travels"): one customer chat becomes a
 * priced answer, a schedule check, a numbered booking, a row in the team schedule and an approved change.
 * Server-rendered so every word is in the HTML; `ceritaFilmBooking.ts` animates it. Without the film, CSS
 * shows each scene's end pose from `data-scene`. Shared visuals reuse the Order Grup `og-*` classes.
 */
export function PanggungBooking({ copy, metrics, scene }: { copy: BookingPanggung; metrics: Metric[]; scene: number }) {
  const highlight = (field: BookingField) => ({ "--h": `var(--bj-${field})` }) as React.CSSProperties;
  const { added } = copy.table;
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

      {/* 6-7 · the team schedule, its report and an approved change */}
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
          <span className="bj-svc">{added.service}</span>
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
        <Who name={copy.change.ask.who} />
        {copy.change.ask.text}
      </div>
      <div className="bj-req">
        <b>{copy.change.title}</b>
        <p>
          <span>{copy.change.from}</span>
          <span aria-hidden>→</span>
          <strong>{copy.change.to}</strong>
        </p>
        <div className="bj-btns">
          <span className="bj-yes">
            {copy.change.yes}
            <i className="bj-tick">
              <Check aria-hidden weight="bold" />
            </i>
          </span>
          <span className="bj-no">{copy.change.no}</span>
        </div>
      </div>
      <div className="og-bub is-asisten bj-done">
        <Who name={copy.change.done.who} assistant />
        {copy.change.done.text}
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
