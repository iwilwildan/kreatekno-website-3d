import { Check, Hash, MapPin, Package, Receipt, Sparkle, Truck, UserCircle } from "@phosphor-icons/react/ssr";
import type { Field, Panggung as PanggungCopy } from "@/content/solusi/cerita/schema";

const FIELD_ICON = { customer: UserCircle, item: Package, qty: Hash, address: MapPin, pay: Receipt } as const;

type Metric = { value: string; unit: string; label: string };
type StatusCopy = PanggungCopy["status"];

function Status({ copy, status }: { copy: StatusCopy; status: "new" | "sent" | "done" }) {
  return (
    <span className={`og-s-${status}`}>
      {status === "sent" && <Truck aria-hidden weight="bold" />}
      {status === "done" && <Check aria-hidden weight="bold" />}
      {copy[status]}
    </span>
  );
}

/**
 * Motion-graphic stage for the Order Grup story (OG5b): one order travels from a chat bubble to data chips,
 * a table row, a status change, the nightly recap and the results. Server-rendered so every word is in the
 * HTML; `ceritaFilm.ts` animates it. Without the film, CSS shows each scene's end pose from `data-scene`.
 */
export function Panggung({ copy, metrics, scene }: { copy: PanggungCopy; metrics: Metric[]; scene: number }) {
  const highlight = (field: Field) => ({ "--h": `var(--og-${field})` }) as React.CSSProperties;
  return (
    <div className="og-cv" data-scene={scene}>
      {/* 1 · before: the group keeps scrolling */}
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

      {/* 2-3 · the order, then its data */}
      <div className="og-order">
        <span className="og-ring" />
        <span className="og-who">{copy.order.who}</span>
        <p>
          {copy.order.parts.map((part, index) =>
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
      <ul className="og-chips">
        {copy.chips.map(({ field, value }) => {
          const Icon = FIELD_ICON[field];
          return (
            <li key={field} className="og-chip" data-field={field} style={{ background: `var(--og-${field})` }}>
              <Icon aria-hidden weight="bold" />
              {value}
            </li>
          );
        })}
      </ul>

      {/* 4-6 · the table row, the reply, the courier */}
      <div className="og-tbl">
        <div className="og-tr is-new">
          <span className="og-no">{copy.table.order.no}</span>
          <span className="og-c-customer">{copy.table.order.customer}</span>
          <span className="og-c-item">{copy.table.order.item}</span>
          <span className="og-st is-live">
            <Status copy={copy.status} status="new" />
            <Status copy={copy.status} status="sent" />
            <Status copy={copy.status} status="done" />
          </span>
        </div>
        {copy.table.rows.map((row) => (
          <div key={row.no} className={row.revised ? "og-tr is-revised" : "og-tr"}>
            <span className="og-no">{row.no}</span>
            <span>{row.customer}</span>
            {row.revised ? (
              <span className="og-c-item og-swap">
                <span className="og-was">{row.item}</span>
                <span className="og-now">{row.revised}</span>
              </span>
            ) : (
              <span className="og-c-item">{row.item}</span>
            )}
            <span className="og-st">
              <Status copy={copy.status} status={row.status} />
            </span>
            {row.revised && <span className="og-rev">{copy.table.revision}</span>}
          </div>
        ))}
      </div>
      <div className="og-bub is-asisten og-reply">
        <span className="og-who">
          <Sparkle aria-hidden weight="fill" />
          {copy.reply.who}
        </span>
        {copy.reply.text}
      </div>
      {copy.courier.map((message, index) => (
        <div key={index} className={`og-bub og-courier og-k${index}`}>
          <span className="og-who">{message.who}</span>
          {message.text}
        </div>
      ))}

      {/* 7 · the nightly recap */}
      <div className="og-ntf">
        <div className="og-ntf-h">
          {/* eslint-disable-next-line @next/next/no-img-element -- tiny decorative brand mark */}
          <img src="/brand/kreatekno-mark.png" alt="" width={28} height={28} />
          <b>{copy.recap.title}</b>
          <span>{copy.recap.time}</span>
        </div>
        <dl>
          {copy.recap.lines.map((line) => (
            <div key={line.label}>
              <dt>{line.label}</dt>
              <dd>{line.value}</dd>
            </div>
          ))}
        </dl>
        <span className="og-sample">{copy.sample}</span>
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
