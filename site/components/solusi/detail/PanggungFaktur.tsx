import {
  CheckCircle,
  Copy,
  EnvelopeSimple,
  FilePdf,
  FolderOpen,
  Keyboard,
  Sparkle,
  WarningCircle,
  XCircle,
} from "@phosphor-icons/react/ssr";
import type { FakturPanggung } from "@/content/solusi/cerita/schema";

type Metric = { value: string; unit: string; label: string };

export function PanggungFaktur({ copy, metrics, scene }: { copy: FakturPanggung; metrics: Metric[]; scene: number }) {
  const { invoice, labels, source, compare, ledger, approval } = copy;
  const number = new Intl.NumberFormat(copy.locale);
  const money = (value: number) => `Rp${number.format(value)}`;
  const variance = invoice.total - invoice.agreedTotal;
  const fields = [
    [labels.number, invoice.number],
    [labels.supplier, invoice.supplier],
    [labels.issued, invoice.issued],
    [labels.due, invoice.due],
    [labels.items, invoice.lines.map(({ item }) => item).join(", ")],
    [labels.total, money(invoice.total)],
  ];

  return (
    <div className="fk-cv" data-scene={scene}>
      <div className="fk-before">
        <div className="fk-pile">
          <i />
          <i />
          <div>
            <FilePdf weight="duotone" />
            <b>{invoice.number}</b>
          </div>
        </div>
        <div className="fk-panel fk-manual">
          <b>
            <Keyboard weight="duotone" /> {copy.manual}
          </b>
          {invoice.lines.map((line) => (
            <div key={line.item}>
              <span>{line.item}</span>
              <span>{money(line.billed)}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="fk-sources">
        <div className="fk-panel fk-source is-email">
          <EnvelopeSimple weight="duotone" />
          <b>{source.email}</b>
          <span>{source.pdf}</span>
        </div>
        <div className="fk-panel fk-source">
          <FolderOpen weight="duotone" />
          <b>{source.folder}</b>
          <span>{source.copy}</span>
        </div>
      </div>
      <div className="fk-panel fk-file">
        <FilePdf weight="duotone" />
        <div>
          <b>{source.pdf}</b>
          <span>{invoice.supplier}</span>
        </div>
        <code>{invoice.number}</code>
      </div>

      <div className="fk-panel fk-document">
        <div className="fk-panel-head">
          <FilePdf weight="duotone" />
          <b>{copy.document}</b>
          <code className="fk-read">{invoice.number}</code>
        </div>
        <dl className="fk-document-meta">
          {fields.slice(1, 4).map(([label, value]) => (
            <div key={label}>
              <dt>{label}</dt>
              <dd className="fk-read">{value}</dd>
            </div>
          ))}
        </dl>
        <table className="fk-document-table">
          <tbody>
            {invoice.lines.map((line) => (
              <tr key={line.item}>
                <th scope="row">
                  <span className="fk-read">{line.item}</span>
                  <small>
                    {line.quantity} {line.unit} × {money(line.billed)}
                  </small>
                </th>
                <td>{money(line.quantity * line.billed)}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="fk-total">
          <span>{labels.total}</span>
          <b className="fk-read">{money(invoice.total)}</b>
        </div>
        <i className="fk-scan" />
      </div>

      <div className="fk-panel fk-fields">
        <div className="fk-panel-head">
          <Sparkle weight="duotone" />
          <b>{copy.extracted}</b>
        </div>
        <dl>
          {fields.map(([label, value]) => (
            <div key={label}>
              <dt>{label}</dt>
              <dd>{value}</dd>
            </div>
          ))}
        </dl>
      </div>

      <div className="fk-panel fk-compare">
        <div className="fk-panel-head">
          <b>{compare.title}</b>
          <code>{invoice.number}</code>
        </div>
        {invoice.lines.map((line) => {
          const delta = line.billed - line.agreed;
          return (
            <div className={delta ? "fk-price-row is-variance" : "fk-price-row"} key={line.item}>
              <div className="fk-price-name">
                <b>{line.item}</b>
                <span>
                  {delta ? <WarningCircle weight="fill" /> : <CheckCircle weight="fill" />}{" "}
                  {delta ? compare.difference : compare.match}
                </span>
              </div>
              <div className="fk-prices">
                <span>
                  {compare.billed}
                  <b>{money(line.billed)}</b>
                </span>
                <span>
                  {compare.agreed}
                  <b>{money(line.agreed)}</b>
                </span>
              </div>
              {delta !== 0 && (
                <div className="fk-variance">
                  <span>
                    {line.quantity} {line.unit} × {money(delta)}
                  </span>
                  <strong>{money(line.quantity * delta)}</strong>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="fk-panel fk-ledger">
        <div className="fk-panel-head">
          <b>{ledger.title}</b>
        </div>
        <div className="fk-record">
          <div>
            <code>{invoice.number}</code>
            <span>{invoice.supplier}</span>
          </div>
          <div>
            <b>{money(invoice.total)}</b>
            <span className="fk-record-variance">
              {compare.difference} {money(variance)}
            </span>
          </div>
          <div className="fk-status">
            <b className="fk-pending">{ledger.pending}</b>
            <b className="fk-rejected">
              <XCircle weight="fill" /> {ledger.rejected}
            </b>
          </div>
        </div>
      </div>
      <div className="fk-panel fk-duplicate">
        <Copy weight="duotone" />
        <div>
          <b>{source.copy}</b>
          <span>
            {invoice.number} · {invoice.supplier}
          </span>
        </div>
        <strong>{ledger.duplicate}</strong>
      </div>

      <div className="fk-panel fk-decision">
        <div className="fk-panel-head">
          <b>{approval.title}</b>
          <code>{invoice.number}</code>
        </div>
        <div className="fk-total">
          <span>{labels.total}</span>
          <b>{money(invoice.total)}</b>
        </div>
        <div className="fk-decision-variance">
          <WarningCircle weight="fill" /> {compare.difference} <b>{money(variance)}</b>
        </div>
        <div className="fk-actions">
          <span>
            <CheckCircle weight="bold" /> {approval.accept}
          </span>
          <span className="fk-reject">
            <XCircle weight="bold" /> {approval.reject}
          </span>
        </div>
        <p className="fk-reason">{approval.reason}</p>
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
        <span className="og-sample">{copy.sample}</span>
      </div>
    </div>
  );
}
