import {
  ArrowDownRight,
  ArrowUpRight,
  ChartBar,
  ChatCircleDots,
  Clock,
  FileText,
  Table,
  Trophy,
} from "@phosphor-icons/react/ssr";
import type { RekapPanggung } from "@/content/solusi/cerita/schema";

export function PanggungRekap({
  copy,
  metrics,
  scene,
}: {
  copy: RekapPanggung;
  metrics: { value: string; unit: string; label: string }[];
  scene: number;
}) {
  const { labels, products, areas, total, top, history } = copy;
  const format = new Intl.NumberFormat(copy.locale, { maximumFractionDigits: 0 });
  const money = (value: number) => `Rp${format.format(value)}`;
  const dateFormat = new Intl.DateTimeFormat(copy.locale, { day: "numeric", month: "short", timeZone: "UTC" });
  const day = (iso: string) => <time dateTime={iso}>{dateFormat.format(new Date(iso))}</time>;
  const percent = (value: number) => {
    const sign = value < 0 ? "−" : "+";
    return `${sign}${format.format(Math.abs(value))}%`;
  };
  const chatHead = (
    <div className="rp-head">
      <ChatCircleDots weight="duotone" />{" "}
      <b>
        {labels.whatsapp} · {copy.owner}
      </b>
    </div>
  );
  const question = (
    <div className="rp-bubble rp-question">
      <b>{copy.owner}</b>
      <p>{copy.question}</p>
    </div>
  );

  return (
    <div className="rp-cv" data-scene={scene}>
      <div className="rp-panel rp-before">
        <div className="rp-head">
          <FileText weight="duotone" /> <b>{labels.before}</b>
        </div>
        <div className="rp-before-row">
          <Table weight="duotone" /> {labels.sheet}
        </div>
        <div className="rp-before-row">
          <Clock weight="duotone" /> {labels.waiting}
        </div>
      </div>
      <div className="rp-panel rp-sheet">
        <div className="rp-head">
          <Table weight="duotone" /> <b>{labels.sheet}</b>
          <span>{copy.clerk}</span>
        </div>
        <div className="rp-run">
          {day(copy.date)}
          <span>{copy.at}</span>
        </div>
        <table>
          <thead>
            <tr>
              <th scope="col">{labels.product}</th>
              <th scope="col">{labels.area}</th>
              <th scope="col">{labels.cartons}</th>
              <th scope="col">{labels.amount}</th>
            </tr>
          </thead>
          <tbody>
            {copy.rows.map(({ product, area, cartons, amount }) => (
              <tr key={`${product}-${area}`}>
                <th scope="row">{products[product]}</th>
                <td>{areas[area]}</td>
                <td>{cartons}</td>
                <td>{money(amount)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="rp-panel rp-sum">
        <div className="rp-head">
          <ChartBar weight="duotone" /> <b>{labels.grouped}</b>
          {day(copy.date)}
        </div>
        <div className="rp-total">
          <span>{labels.total}</span>
          <b>{money(total)}</b>
        </div>
        <dl className="rp-facts">
          {(["north", "south"] as const).map((area) => (
            <div key={area}>
              <dt>{areas[area]}</dt>
              <dd>{money(copy.areaTotals[area])}</dd>
            </div>
          ))}
        </dl>
        <div className="rp-top">
          <Trophy weight="duotone" />
          <div>
            <small>{labels.top}</small>
            <b>{products[top.product]}</b>
          </div>
          <strong>
            {top.cartons} {labels.cartons}
          </strong>
        </div>
      </div>
      <div className="rp-panel rp-comparison">
        <div className="rp-head">
          <ChartBar weight="duotone" /> <b>{labels.compare}</b>
        </div>
        <div className="rp-total">
          <span>
            {labels.today} · {day(copy.date)}
          </span>
          <b>{money(total)}</b>
        </div>
        <ul className="rp-periods">
          {copy.periods.map(({ label, date, amount, change }) => {
            const Direction = change < 0 ? ArrowDownRight : ArrowUpRight;
            return (
              <li key={date}>
                <div>
                  <b>{label}</b>
                  {day(date)}
                </div>
                <strong>{money(amount)}</strong>
                <span className={change < 0 ? "rp-change is-down" : "rp-change"}>
                  <Direction weight="bold" /> {percent(change)}
                </span>
              </li>
            );
          })}
        </ul>
      </div>
      <div className="rp-panel rp-recap">
        {chatHead}
        <div className="rp-bubble">
          <div className="rp-recap-title">
            <b>{labels.recap}</b>
            <span>
              {day(copy.date)} · {copy.at}
            </span>
          </div>
          <div className="rp-total">
            <span>{labels.total}</span>
            <b>{money(total)}</b>
          </div>
          <dl className="rp-facts">
            <div>
              <dt>{products[top.product]}</dt>
              <dd>
                {top.cartons} {labels.cartons}
              </dd>
            </div>
            {copy.periods.map(({ label, date, change }) => (
              <div key={date}>
                <dt>
                  {label} · {day(date)}
                </dt>
                <dd>{percent(change)}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
      <div className="rp-panel rp-ask">
        {chatHead}
        {question}
      </div>
      <div className="rp-panel rp-answer">
        {chatHead}
        {question}
        <div className="rp-bubble rp-response">
          <small>{labels.assistant}</small>
          <p>
            {products[history.product]} · {history.month}
          </p>
          <strong>
            {history.cartons} {labels.cartons}
          </strong>
          <dl className="rp-facts">
            <div>
              <dt>{areas.north}</dt>
              <dd>
                {history.north} {labels.cartons}
              </dd>
            </div>
            <div>
              <dt>{areas.south}</dt>
              <dd>
                {history.south} {labels.cartons}
              </dd>
            </div>
          </dl>
        </div>
        <div className="rp-source">
          <Table weight="duotone" />
          <div>
            <small>{labels.source} · Sheets</small>
            <b>{history.source}</b>
          </div>
        </div>
      </div>
      <div className="og-mx">
        {metrics.map(({ value, unit, label }) => (
          <div className="og-m" key={label}>
            <b>
              {value}
              <small>{unit}</small>
            </b>
            <p>{label}</p>
          </div>
        ))}
        <span className="og-sample">{labels.sample}</span>
      </div>
    </div>
  );
}
