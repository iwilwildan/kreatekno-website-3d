import {
  ArrowRight,
  BookOpen,
  CalendarBlank,
  CheckCircle,
  ChatCircleDots,
  Clock,
  Headset,
  UserCircle,
  XCircle,
} from "@phosphor-icons/react/ssr";
import type { SdmPanggung } from "@/content/solusi/cerita/schema";

type Metric = { value: string; unit: string; label: string };
const rosterCells = Array.from({ length: 14 }, (_, index) => index);

export function PanggungSdm({ copy, metrics, scene }: { copy: SdmPanggung; metrics: Metric[]; scene: number }) {
  const { request, labels, chat, routes, policy } = copy;
  const date = new Intl.DateTimeFormat(copy.locale, {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(request.date));
  const days = (count: number) => `${count} ${count === 1 ? labels.day : labels.days}`;

  return (
    <div className="sd-cv" data-scene={scene}>
      <div className="sd-before">
        <div className="sd-panel sd-roster">
          <div className="sd-head">
            <CalendarBlank weight="duotone" />
            <b>{labels.schedule}</b>
          </div>
          <div className="sd-roster-cells">
            {rosterCells.map((cell) => (
              <i key={cell} />
            ))}
          </div>
        </div>
        <ul className="sd-branches">
          {copy.messages.map(({ branch, body }) => (
            <li key={branch}>
              <b>{branch}</b>
              <span>{body}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="sd-panel sd-inbox">
        <div className="sd-head">
          <ChatCircleDots weight="duotone" />
          <b>{chat.title}</b>
        </div>
        <div className="sd-message">
          <b>{request.employee}</b>
          <p>{chat.ask}</p>
        </div>
      </div>
      <div className="sd-panel sd-packet">
        <div className="sd-head">
          <CalendarBlank weight="duotone" />
          <b>{labels.leave}</b>
          <code>{request.number}</code>
        </div>
        <div className="sd-packet-date">
          <span>{date}</span>
          <strong>{days(request.days)}</strong>
        </div>
      </div>

      <div className="sd-route">
        <div className="sd-route-chips">
          <span className="sd-leave-route">
            <CalendarBlank weight="bold" /> {routes.leave}
          </span>
          <span>
            <BookOpen weight="bold" /> {routes.policy}
          </span>
          <span>
            <Headset weight="bold" /> {routes.other}
          </span>
        </div>
        <div className="sd-panel sd-policy">
          <p className="sd-policy-question">{policy.question}</p>
          <div className="sd-policy-answer">
            <p>{policy.answer}</p>
            <small className="sd-source">
              <BookOpen weight="bold" /> {policy.source}
            </small>
          </div>
          <div className="sd-policy-followup">
            <p>{policy.followup}</p>
            <small className="sd-handoff">
              <Headset weight="bold" /> {policy.handoff}
            </small>
          </div>
        </div>
        <div className="sd-route-ticket">
          <code>{request.number}</code>
          <ArrowRight weight="bold" /> <b>{routes.leave}</b>
        </div>
      </div>

      <div className="sd-panel sd-balance">
        <div className="sd-head">
          <UserCircle weight="duotone" />
          <b>{request.employee}</b>
          <code>{request.number}</code>
        </div>
        <p className="sd-branch-meta">{request.branch}</p>
        <div className="sd-balances">
          <div>
            <span>{labels.balance}</span>
            <strong className="sd-original">{days(request.before)}</strong>
          </div>
          <div>
            <span>{labels.requested}</span>
            <strong>{days(request.days)}</strong>
          </div>
        </div>
        <span className="sd-pill sd-pending">
          <Clock weight="bold" /> {labels.pending}
        </span>
      </div>

      <div className="sd-panel sd-manager">
        <div className="sd-head">
          <UserCircle weight="duotone" />
          <b>{request.manager}</b>
          <code>{request.number}</code>
        </div>
        <div className="sd-employee">
          <strong>{request.employee}</strong>
          <span>{request.branch}</span>
        </div>
        <dl className="sd-summary">
          <div>
            <dt>{labels.date}</dt>
            <dd>{date}</dd>
          </div>
          <div>
            <dt>{labels.requested}</dt>
            <dd>{days(request.days)}</dd>
          </div>
          <div>
            <dt>{labels.balance}</dt>
            <dd className="sd-original">{days(request.before)}</dd>
          </div>
        </dl>
        <div className="sd-manager-status">
          <span className="sd-pill sd-pending">
            <Clock weight="bold" /> {labels.pending}
          </span>
          <span className="sd-pill sd-stamp">
            <CheckCircle weight="fill" /> {labels.approved}
          </span>
        </div>
        <div className="sd-actions">
          <span className="sd-approve">
            <CheckCircle weight="bold" /> {labels.approve}
          </span>
          <span>
            <XCircle weight="bold" /> {labels.reject}
          </span>
        </div>
      </div>

      <div className="sd-panel sd-register">
        <div className="sd-head">
          <CalendarBlank weight="duotone" />
          <b>{labels.register}</b>
        </div>
        <div className="sd-record">
          <code>{request.number}</code>
          <strong>{request.employee}</strong>
          <span className="sd-pill">
            <CheckCircle weight="fill" /> {labels.approved}
          </span>
        </div>
        <div className="sd-change">
          <span>{labels.balance}</span>
          <s>{days(request.before)}</s>
          <ArrowRight weight="bold" />
          <strong>{days(request.after)}</strong>
        </div>
      </div>
      <div className="sd-panel sd-confirm">
        <div className="sd-head">
          <ChatCircleDots weight="duotone" />
          <b>{chat.title}</b>
          <span>{request.employee}</span>
        </div>
        <div className="sd-message">
          <p>{chat.accepted}</p>
          <strong>
            {labels.balance} · {days(request.after)}
          </strong>
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
