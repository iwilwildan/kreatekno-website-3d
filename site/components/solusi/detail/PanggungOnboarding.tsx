import {
  CalendarBlank,
  CheckCircle,
  ChatCircleDots,
  Clock,
  EnvelopeSimple,
  ListChecks,
  PaperPlaneTilt,
  Square,
  Table,
} from "@phosphor-icons/react/ssr";
import type { OnboardingPanggung } from "@/content/solusi/cerita/schema";

type Metric = { value: string; unit: string; label: string };

export function PanggungOnboarding({
  copy,
  metrics,
  scene,
}: {
  copy: OnboardingPanggung;
  metrics: Metric[];
  scene: number;
}) {
  const { deal, labels, draft } = copy;
  const formatter = new Intl.DateTimeFormat(copy.locale, {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  });
  const signed = formatter.format(new Date(deal.signed));
  const kickoff = formatter.format(new Date(deal.kickoff));
  const clock = (time: string) => (copy.locale === "id-ID" ? time.replace(":", ".") : time);
  const range = (slot: OnboardingPanggung["slots"][number]) => `${clock(slot.start)}–${clock(slot.end)}`;
  const proposed = `${range(copy.slots.find(({ state }) => state === "free")!)} ${deal.zone}`;

  return (
    <div className="ok-cv" data-scene={scene}>
      <div className="ok-before">
        <div className="ok-panel ok-old-deal">
          <div className="ok-head">
            <Table weight="duotone" />
            <b>{labels.deals}</b>
            <code>{deal.number}</code>
          </div>
          <div className="ok-old-row">
            <b>{deal.company}</b>
            <span className="ok-pill is-won">{labels.won}</span>
          </div>
        </div>
        <ul className="ok-chat-stack">
          {copy.messages.map((message) => (
            <li key={message}>
              <ChatCircleDots weight="duotone" /> {message}
            </li>
          ))}
        </ul>
      </div>

      <div className="ok-panel ok-deal">
        <div className="ok-head">
          <Table weight="duotone" />
          <b>{labels.deals}</b>
          <code>{deal.number}</code>
        </div>
        <div className="ok-company">
          <strong>{deal.company}</strong>
          <span>
            {deal.client} · {signed}
          </span>
        </div>
        <div className="ok-deal-meta">
          <div>
            <small>{labels.package}</small>
            <b>{deal.package}</b>
          </div>
          <span className="ok-pill is-won">
            <CheckCircle weight="fill" /> {labels.won}
          </span>
        </div>
      </div>

      <div className="ok-panel ok-checklist">
        <div className="ok-head">
          <ListChecks weight="duotone" />
          <b>{labels.checklist}</b>
          <code>{deal.number}</code>
        </div>
        <div className="ok-package">
          <small>{labels.package}</small>
          <b>{deal.package}</b>
        </div>
        <ul className="ok-prep">
          {copy.prep.map((item) => (
            <li key={item}>
              <Square weight="bold" /> {item}
            </li>
          ))}
        </ul>
      </div>

      <div className="ok-panel ok-draft">
        <div className="ok-head">
          <EnvelopeSimple weight="duotone" />
          <b>{draft.subject}</b>
          <span className="ok-pill">{labels.draft}</span>
        </div>
        <div className="ok-letter">
          <strong>{draft.greeting}</strong>
          <p>{draft.body}</p>
          <ul>
            {copy.prep.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
        <div className="ok-slot-pending">
          <Clock weight="bold" /> {labels.schedulePending}
        </div>
      </div>

      <div className="ok-panel ok-calendar">
        <div className="ok-head">
          <CalendarBlank weight="duotone" />
          <b>{labels.calendar}</b>
          <code>{deal.zone}</code>
        </div>
        <p>{kickoff}</p>
        <ul className="ok-slots">
          {copy.slots.map((slot) => (
            <li key={slot.start} className={slot.state === "free" ? "is-free" : undefined}>
              <b>{range(slot)}</b>
              <span>{slot.state === "free" ? labels.free : labels.busy}</span>
            </li>
          ))}
        </ul>
      </div>
      <div className="ok-panel ok-proposal">
        <div className="ok-head">
          <EnvelopeSimple weight="duotone" />
          <b>{labels.proposed}</b>
          <span className="ok-pill">{labels.draft}</span>
        </div>
        <p>
          {kickoff} · <strong>{proposed}</strong>
        </p>
      </div>

      <div className="ok-panel ok-review">
        <div className="ok-head">
          <EnvelopeSimple weight="duotone" />
          <b>{labels.review}</b>
          <code>{deal.owner}</code>
        </div>
        <div className="ok-review-draft">
          <span className="ok-pill">{labels.draft}</span>
          <b>{draft.subject}</b>
        </div>
        <div className="ok-review-slot">
          <small>{labels.proposed}</small>
          <b>
            {kickoff} · {proposed}
          </b>
        </div>
        <div className="ok-check-slot">
          <CheckCircle weight="bold" /> {labels.slotChecked}
        </div>
        <div className="ok-send">
          <PaperPlaneTilt weight="bold" /> {labels.send}
        </div>
      </div>
      <div className="ok-panel ok-delivery">
        <div>
          <span>
            <CheckCircle weight="fill" /> {labels.emailSent}
          </span>
          <span>
            <CheckCircle weight="fill" /> {labels.inviteSent}
          </span>
        </div>
        <p>
          {signed} · {deal.client}
        </p>
      </div>

      <div className="ok-panel ok-register">
        <div className="ok-head">
          <Table weight="duotone" />
          <b>{labels.register}</b>
          <code>{deal.number}</code>
        </div>
        <div className="ok-company">
          <strong>{deal.company}</strong>
          <span>
            {deal.client} · {deal.package}
          </span>
        </div>
        <dl className="ok-final-row">
          <div>
            <dt>{labels.owner}</dt>
            <dd>{deal.owner}</dd>
          </div>
          <div>
            <dt>{labels.inviteSent}</dt>
            <dd>
              {kickoff} · {proposed}
            </dd>
          </div>
        </dl>
        <span className="ok-pill ok-awaiting">
          <Clock weight="bold" /> {labels.awaitingReply}
        </span>
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
