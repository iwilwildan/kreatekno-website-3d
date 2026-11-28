import {
  CalendarBlank,
  ChatCircleDots,
  CheckCircle,
  Clock,
  FileText,
  ListChecks,
  Phone,
  Table,
  UserCircle,
} from "@phosphor-icons/react/ssr";
import type { TagihanPanggung } from "@/content/solusi/cerita/schema";

export function PanggungTagihan({
  copy,
  metrics,
  scene,
}: {
  copy: TagihanPanggung;
  metrics: { value: string; unit: string; label: string }[];
  scene: number;
}) {
  const { primary, overdue, labels } = copy;
  const due = <time dateTime={copy.due.iso}>{copy.due.label}</time>;
  return (
    <div className="pt-cv" data-scene={scene}>
      <div className="pt-panel pt-before">
        <div className="pt-head">
          <FileText weight="duotone" /> <b>{labels.before}</b>
        </div>
        <div className="pt-card">
          <FileText weight="duotone" />
          <b>{primary.code}</b>
          <span>
            {labels.due} · {due}
          </span>
        </div>
        <div className="pt-card">
          <ChatCircleDots weight="duotone" />
          <b>{labels.history}</b>
        </div>
      </div>
      <div className="pt-panel pt-morning">
        <div className="pt-head">
          <Table weight="duotone" /> <b>{labels.ledger}</b>
        </div>
        <div className="pt-clock">
          <Clock weight="bold" /> {copy.morning}
        </div>
        <ul className="pt-invoices">
          {[primary, overdue].map(({ code, customer, amount }) => (
            <li key={code}>
              <div>
                <b>{customer}</b>
                <small>
                  {code} · {amount}
                </small>
              </div>
              <span className="pt-tag is-open">{labels.open}</span>
            </li>
          ))}
        </ul>
        <div className="pt-due">
          <CalendarBlank weight="duotone" /> {labels.due} · {due}
        </div>
      </div>
      {copy.messages.map(({ stage, date, body }, index) => (
        <div className="pt-panel pt-reminder" data-reminder={index} key={stage}>
          <div className="pt-head">
            <ChatCircleDots weight="duotone" />{" "}
            <b>
              {labels.chat} · {primary.customer}
            </b>
            <span className="pt-tag">{stage}</span>
          </div>
          <div className="pt-message">
            <b>
              {primary.code} · {primary.amount}
            </b>
            <p>{body}</p>
            <small>{labels.paymentInstructions}</small>
          </div>
          <div className="pt-log">
            <div>
              <Table weight="duotone" /> <b>{labels.logged}</b>
            </div>
            <span className="pt-log-row">
              <code>{primary.code}</code>
              <span>
                {stage} · <time dateTime={date.iso}>{date.label}</time>
              </span>
              <span className="pt-tag is-sent">{labels.sent}</span>
            </span>
          </div>
        </div>
      ))}
      <div className="pt-panel pt-payment">
        <div className="pt-head">
          <Table weight="duotone" /> <b>{labels.payment}</b>
          <time dateTime={copy.paidOn.iso}>{copy.paidOn.label}</time>
        </div>
        <div className="pt-confirm">
          <CheckCircle weight="fill" />
          <div>
            <b>{copy.finance}</b>
            <small>{labels.confirmed}</small>
          </div>
        </div>
        <div className="pt-paid-row">
          <div>
            <b>{primary.customer}</b>
            <small>
              {primary.code} · {primary.amount}
            </small>
          </div>
          <span className="pt-tag is-paid">{labels.paid}</span>
        </div>
        <div className="pt-skip">
          <CheckCircle weight="bold" /> {labels.skipped}
        </div>
      </div>
      <div className="pt-panel pt-handoff">
        <div className="pt-head">
          <ListChecks weight="duotone" /> <b>{labels.handoff}</b>
          <time dateTime={copy.handedOffOn.iso}>{copy.handedOffOn.label}</time>
        </div>
        <ul className="pt-invoices">
          <li className="pt-retained">
            <div>
              <b>{primary.customer}</b>
              <small>{primary.code}</small>
            </div>
            <span className="pt-tag is-paid">{labels.paid}</span>
          </li>
          <li>
            <div>
              <b>{overdue.customer}</b>
              <small>
                {overdue.code} · {overdue.amount}
              </small>
            </div>
            <span className="pt-tag is-open">{labels.open}</span>
          </li>
        </ul>
        <div className="pt-owner">
          <UserCircle weight="duotone" />
          <div>
            <b>
              {copy.owner} · {labels.owner}
            </b>
            <small>{labels.followUp}</small>
          </div>
          <Phone weight="duotone" />
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
