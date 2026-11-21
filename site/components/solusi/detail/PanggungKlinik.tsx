import { CalendarBlank, Check, Clock, FirstAid, Headset, Moon, Sparkle, Tag, Tooth } from "@phosphor-icons/react/ssr";
import type { KlinikField, KlinikPanggung } from "@/content/solusi/cerita/schema";

const FIELD_ICON = { service: Tooth, time: Clock } as const;

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
 * Motion-graphic stage for the CS Klinik story (CK1 "one patient chat travels"): a late-night patient chat
 * becomes two chips, the service chip finds its price in the service table, the time chip lands on a taken
 * slot and three other times light up, the picked time becomes an appointment, the reply goes out while the
 * day folds into the patient's row, and a medical question goes to the staff. Server-rendered so every word
 * is in the HTML; `ceritaFilmKlinik.ts` animates it. Without the film, CSS shows each scene's end pose from
 * `data-scene`. Shared visuals reuse the Order Grup `og-*` and Booking Jasa `bj-*` classes.
 */
export function PanggungKlinik({ copy, metrics, scene }: { copy: KlinikPanggung; metrics: Metric[]; scene: number }) {
  const highlight = (field: KlinikField) => ({ "--h": `var(--ck-${field})` }) as React.CSSProperties;
  const { prices, day, leads, medical } = copy;
  const picked = prices.rows[prices.pick];
  return (
    <div className="ck-cv" data-scene={scene}>
      {/* 1 · before: patient chats wait for the morning */}
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

      {/* 2-3 · one late-night chat and the two things it asks for */}
      <span className="bj-clock ck-clock">
        <Moon aria-hidden weight="fill" />
        {copy.clock}
      </span>
      <div className="og-order ck-ask">
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
      <ul className="og-chips ck-chips">
        {copy.chips.map(({ field, value }) => {
          const Icon = FIELD_ICON[field];
          return (
            <li key={field} className="og-chip" data-field={field} style={{ background: `var(--ck-${field})` }}>
              <Icon aria-hidden weight="bold" />
              {value}
            </li>
          );
        })}
      </ul>

      {/* 4 · the price comes from the service table */}
      <div className="ck-prices">
        <b className="ck-h">
          <Tag aria-hidden weight="bold" />
          {prices.title}
        </b>
        {prices.rows.map((row, index) => (
          <div key={row.name} className={index === prices.pick ? "ck-pr is-pick" : "ck-pr"}>
            {index === prices.pick && <i className="ck-glow" />}
            <span>{row.name}</span>
            <b>{row.price}</b>
          </div>
        ))}
      </div>
      <span className="ck-price">
        <Tag aria-hidden weight="bold" />
        {picked.name} · {picked.price}
      </span>

      {/* 5-6 · the schedule check, three other times, then the appointment */}
      <div className="bj-day ck-day">
        <b className="bj-day-h">
          <CalendarBlank aria-hidden weight="bold" />
          {day.title}
        </b>
        {day.slots.map((slot) => (
          <div key={slot.time} className={`bj-slot ck-slot is-${slot.state}`}>
            {slot.state !== "asked" && <i className="ck-glow" />}
            <span className="bj-t">{slot.time}</span>
            <span className="bj-pill">{slot.state === "asked" ? day.taken : day.free}</span>
            {slot.state === "pick" && (
              <span className="ck-ev">
                <Check aria-hidden weight="bold" />
                {day.booked}
              </span>
            )}
          </div>
        ))}
      </div>
      <div className="og-bub is-asisten ck-offer">
        <Who name={copy.offer.who} assistant />
        {copy.offer.text}
      </div>
      <div className="og-bub ck-choose">
        <Who name={copy.choose.who} />
        {copy.choose.text}
      </div>

      {/* 7 · the reply goes out while the patient's row is saved */}
      <div className="og-bub is-asisten ck-reply">
        <Who name={copy.reply.who} assistant />
        {copy.reply.text}
      </div>
      <div className="ck-leads">
        {leads.rows.map((row) => (
          <div key={row.no} className="ck-tr">
            <span className="ck-no">{row.no}</span>
            <span className="ck-last">{row.last}</span>
            <span className="ck-sum">{row.summary}</span>
          </div>
        ))}
        <div className="ck-tr is-new">
          <span className="ck-no">{leads.added.no}</span>
          <span className="ck-last">{leads.added.last}</span>
          <span className="ck-sum og-swap">
            <span className="og-was">{leads.added.summary}</span>
            <span className="og-now">{leads.added.next}</span>
          </span>
        </div>
      </div>

      {/* 8 · a medical question goes to the staff (design step) */}
      <div className="og-bub ck-med">
        <Who name={medical.ask.who} />
        {medical.ask.text}
      </div>
      <span className="og-chip ck-medchip">
        <FirstAid aria-hidden weight="bold" />
        {medical.chip}
      </span>
      <div className="ck-staff">
        <span className="ck-staff-i">
          <Headset aria-hidden weight="bold" />
        </span>
        <span className="ck-staff-t">
          <b>{medical.staff}</b>
          <small>{medical.line}</small>
        </span>
        <span className="og-sample">{medical.tag}</span>
      </div>

      {/* 9-10 · results */}
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
