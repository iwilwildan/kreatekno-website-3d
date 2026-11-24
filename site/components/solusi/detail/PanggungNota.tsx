import {
  CalendarBlank,
  Camera,
  ChatCircleDots,
  CheckCircle,
  Microphone,
  Money,
  Sparkle,
  Storefront,
  Sun,
  Table,
  TextAa,
  XCircle,
} from "@phosphor-icons/react/ssr";
import type { NotaField, NotaPanggung } from "@/content/solusi/cerita/schema";

/** Digits of a shown amount ("Rp186.500" / "Rp186,500"). Local copy of the schema helper: the stage is part of a
 * client component, and importing the schema module at runtime would pull zod into the page bundle. */
const rupiah = (value: string) => Number(value.replace(/\D/g, ""));

const FIELD_ICON = { shop: Storefront, date: CalendarBlank, total: Money, category: Sparkle } as const;
const WAY_ICON = { photo: Camera, text: TextAa, voice: Microphone } as const;

type Metric = { value: string; unit: string; label: string };

/** A small receipt drawn in CSS: the shop on top, three item lines, a total line. `blur` = unreadable. */
function Thumb({ shop, blur = false }: { shop: string; blur?: boolean }) {
  return (
    <div className={blur ? "cp-thumb is-blur" : "cp-thumb"}>
      <b>{shop}</b>
      <i />
      <i />
      <i />
      <span />
      <i className="is-total" />
    </div>
  );
}

/**
 * Motion-graphic stage for the Catat Pengeluaran story (CP1 "one receipt travels"): receipts pile up until the end
 * of the month, Rina picks the photo out of three ways to send and sends it, the receipt is read line by line, AI
 * lifts out the shop, date and total and adds a category, a blurry receipt from another branch is asked again while
 * Rina's passes, the entry becomes a row in the spending table with a confirmation, and the owner gets the morning
 * recap. Server-rendered so every word is in the HTML; `ceritaFilmNota.ts` animates it. Without the film, CSS shows
 * each scene's end pose from `data-scene`. Shared visuals reuse the Order Grup `og-*` classes.
 */
export function PanggungNota({ copy, metrics, scene }: { copy: NotaPanggung; metrics: Metric[]; scene: number }) {
  const { receipt, check, table, recap, categories } = copy;
  const highlight = (field: NotaField | "item") => ({ "--h": `var(--cp-${field})` }) as React.CSSProperties;
  const word = (field: NotaField, value: string) => (
    <span className="og-hl" data-field={field} style={highlight(field)}>
      {value}
    </span>
  );
  const recapTotal = rupiah(recap.total);
  return (
    <div className="cp-cv" data-scene={scene}>
      {/* 1 · before: receipts pile up until the end of the month */}
      <div className="og-pile">
        <div className="og-list">
          {[...copy.slips, ...copy.slips].map((slip, index) => (
            <div key={index} className={index % 2 ? "og-bub cp-slip is-alt" : "og-bub cp-slip"}>
              <span className="og-who">{slip.who}</span>
              {slip.text}
              {slip.tag && index < copy.slips.length && <span className="og-tag">{slip.tag}</span>}
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

      {/* 2 · three ways to send; Rina's photo arrives in the chat */}
      <ul className="cp-ways">
        {copy.ways.map(({ kind, label }) => {
          const Icon = WAY_ICON[kind];
          return (
            <li key={kind} className={kind === "photo" ? "is-pick" : undefined}>
              {kind === "photo" && <i className="ck-glow cp-pick" />}
              <Icon aria-hidden weight="bold" />
              {label}
            </li>
          );
        })}
      </ul>
      <div className="cp-chat">
        <div className="cp-chat-h">
          <span className="cp-chat-i">
            <ChatCircleDots aria-hidden weight="bold" />
          </span>
          <b>{copy.chat.title}</b>
        </div>
        <div className="og-bub cp-msg">
          <span className="og-who">{copy.chat.sender}</span>
          <Thumb shop={receipt.shop} />
          <small>{copy.chat.photo}</small>
        </div>
      </div>

      {/* 3-4 · the receipt is read line by line; AI lifts out four chips */}
      <div className="cp-receipt">
        <i className="cp-scan" />
        <b className="cp-shop">{word("shop", receipt.shop)}</b>
        <small className="cp-date">{word("date", receipt.date)}</small>
        <hr />
        {receipt.items.map((item) => (
          <span key={item.name} className="cp-item">
            <span className="og-hl" data-field="item" style={highlight("item")}>
              <span>{item.name}</span>
              <span>{item.price}</span>
            </span>
          </span>
        ))}
        <hr />
        <span className="cp-sum">
          <span>{receipt.totalLabel}</span>
          {word("total", receipt.total)}
        </span>
      </div>
      <ul className="og-chips cp-chips">
        {copy.chips.map(({ field, value }) => {
          const Icon = FIELD_ICON[field];
          return (
            <li key={field} className="og-chip" data-field={field} style={{ background: `var(--cp-${field})` }}>
              <Icon aria-hidden weight={field === "category" ? "fill" : "bold"} />
              {value}
            </li>
          );
        })}
      </ul>

      {/* 5 · checked: Rina's receipt passes, a blurry one is asked again */}
      <div className="cp-card cp-ok">
        <span className="og-who">{copy.chat.sender}</span>
        <Thumb shop={receipt.shop} />
        <span className="cp-pill is-ok">
          <CheckCircle aria-hidden weight="fill" />
          {check.ok}
        </span>
      </div>
      <div className="cp-card cp-bad">
        <span className="og-who">{check.blurWho}</span>
        <Thumb shop={receipt.shop} blur />
        <span className="cp-pill is-bad">
          <XCircle aria-hidden weight="fill" />
          {check.bad}
        </span>
      </div>
      <div className="og-bub is-asisten cp-ask">
        <span className="og-who">
          <Sparkle aria-hidden weight="fill" />
          {check.ask.who}
        </span>
        {check.ask.text}
      </div>

      {/* 6 · recorded: a new row in the spending table, and a confirmation for Rina */}
      <div className="cp-table">
        <div className="cp-th">
          <b>
            <Table aria-hidden weight="bold" />
            {table.title}
          </b>
          <small>{table.time}</small>
        </div>
        {[...table.rows, table.added].map((row, index) => {
          const added = index === table.rows.length;
          return (
            <div key={row.shop} className={added ? "cp-tr is-new" : "cp-tr"}>
              {added && <i className="ck-glow cp-glow" />}
              <span className="cp-who">
                <b>{row.shop}</b>
                <small>{row.meta}</small>
              </span>
              <span className="cp-cat" data-category={row.category}>
                {categories[row.category]}
              </span>
              <span className="cp-amt">{row.total}</span>
            </div>
          );
        })}
      </div>
      <div className="og-bub is-asisten cp-confirm">
        <span className="og-who">
          <Sparkle aria-hidden weight="fill" />
          {copy.confirm.who}
        </span>
        {copy.confirm.text}
      </div>

      {/* 7 · morning recap for the owner */}
      <div className="cp-clock">
        <Sun aria-hidden weight="fill" />
        <b>{recap.time}</b>
        <small>{recap.to}</small>
      </div>
      <div className="cp-recap">
        <div className="cp-recap-h">
          <b>{recap.title}</b>
          <small>{recap.date}</small>
        </div>
        <b className="cp-recap-total">{recap.total}</b>
        {recap.lines.map((line) => (
          <div key={line.category} className="cp-bar" data-category={line.category}>
            <span className="cp-bar-l">
              <span>{categories[line.category]}</span>
              <b>{line.value}</b>
            </span>
            <span className="cp-bar-t">
              <i style={{ width: `${Math.round((rupiah(line.value) / recapTotal) * 100)}%` }} />
            </span>
          </div>
        ))}
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
