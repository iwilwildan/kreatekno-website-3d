import {
  ArrowRight,
  ChatCircleDots,
  Clock,
  EnvelopeSimple,
  Faders,
  ListBullets,
  NotePencil,
  Star,
  Table,
  UserCircle,
} from "@phosphor-icons/react/ssr";
import type { UlasanPanggung } from "@/content/solusi/cerita/schema";

const channelIcons = { form: NotePencil, chat: ChatCircleDots, email: EnvelopeSimple };
const topics = ["wait", "taste", "clean"] as const;

export function PanggungUlasan({
  copy,
  metrics,
  scene,
}: {
  copy: UlasanPanggung;
  metrics: { value: string; unit: string; label: string }[];
  scene: number;
}) {
  const { labels, reviews } = copy;
  const example = reviews[0];
  const open = reviews.filter(({ replied }) => !replied);
  const report = topics.map((key) => ({
    key,
    label: labels.topics[key],
    current: reviews.filter(({ topic }) => topic === key).length,
    previous: copy.previousCounts[key],
    tone: key === "taste" ? labels.praise : labels.complaint,
  }));
  const previousTotal = report.reduce((total, { previous }) => total + previous, 0);
  const dates = new Intl.DateTimeFormat(copy.locale, { day: "numeric", month: "short", timeZone: "UTC" });
  const channels = (
    <ul className="up-channels">
      {(Object.keys(channelIcons) as (keyof typeof channelIcons)[]).map((channel) => {
        const Icon = channelIcons[channel];
        return (
          <li key={channel}>
            <Icon weight="duotone" /> <b>{labels.channels[channel]}</b>
          </li>
        );
      })}
    </ul>
  );

  return (
    <div className="up-cv" data-scene={scene}>
      <div className="up-panel up-before">
        <div className="up-head">
          <ChatCircleDots weight="duotone" /> <b>{labels.before}</b>
          <span>{copy.staff}</span>
        </div>
        {channels}
      </div>
      <div className="up-panel up-intake">
        <div className="up-head">
          <Clock weight="duotone" /> <b>{labels.intake}</b>
          <span>{copy.daily}</span>
        </div>
        {channels}
        <div className="up-intake-record">
          <div>
            <b>
              {labels.channels[example.source]} · {labels.branch} {example.branch}
            </b>
            <code>{example.id}</code>
          </div>
          <p>{example.body}</p>
          <span className="up-rating">
            <Star weight="fill" /> {example.rating} {labels.stars}
          </span>
        </div>
      </div>
      <div className="up-panel up-table">
        <div className="up-head">
          <Table weight="duotone" /> <b>{labels.table}</b>
        </div>
        <ul className="up-records">
          {reviews.slice(0, 2).map(({ id, source, branch, date, rating, body }) => (
            <li key={id} data-source={source}>
              <div>
                <code>{id}</code>
                <time dateTime={date}>{dates.format(new Date(date))}</time>
              </div>
              <b>{body}</b>
              <small>
                {labels.channels[source]} · {labels.branch} {branch}
              </small>
              <span className="up-rating">
                {rating === null ? (
                  labels.unrated
                ) : (
                  <>
                    <Star weight="fill" /> {rating} {labels.stars}
                  </>
                )}
              </span>
            </li>
          ))}
        </ul>
      </div>
      <div className="up-panel up-dedupe">
        <div className="up-head">
          <Faders weight="duotone" /> <b>{labels.duplicates}</b>
        </div>
        <div className="up-copy">
          <span>{labels.channels[example.source]}</span>
          <code>{example.id}</code>
        </div>
        <div className="up-copy up-duplicate">
          <span>{labels.channels[example.source]}</span>
          <code>{example.id}</code>
          <small>{labels.duplicateSkipped}</small>
        </div>
        <div className="up-dedup-count">
          <span>
            <b>{reviews.length + 1}</b> {labels.incoming}
          </span>
          <ArrowRight weight="bold" />
          <span>
            <b>{reviews.length}</b> {labels.kept}
          </span>
        </div>
      </div>
      <div className="up-panel up-topics">
        <div className="up-head">
          <ListBullets weight="duotone" /> <b>{labels.grouped}</b>
        </div>
        <ul className="up-topic-list">
          {report.map(({ key, label, current, tone }) => (
            <li key={key} data-topic={key}>
              <div>
                <b>{label}</b>
                <small>
                  {tone}
                  {key === "wait" && ` · ${labels.branch} ${example.branch}`}
                </small>
              </div>
              <span>{current}</span>
            </li>
          ))}
        </ul>
      </div>
      <div className="up-panel up-queue">
        <div className="up-head">
          <ChatCircleDots weight="duotone" /> <b>{labels.queue}</b>
          <span>{open.length}</span>
        </div>
        <ul className="up-records">
          {open.map(({ id, branch, body }) => (
            <li key={id}>
              <div>
                <code>{id}</code>
                <span className="up-pending">{labels.unanswered}</span>
              </div>
              <b>{body}</b>
              <small>
                {labels.branch} {branch}
              </small>
            </li>
          ))}
        </ul>
        <div className="up-staff">
          <UserCircle weight="duotone" /> {labels.followUp}
        </div>
      </div>
      <div className="up-panel up-report">
        <div className="up-head">
          <EnvelopeSimple weight="duotone" /> <b>{labels.report}</b>
          <span>{copy.owner}</span>
        </div>
        <time dateTime={copy.reportDate}>{dates.format(new Date(copy.reportDate))}</time>
        <table>
          <thead>
            <tr>
              <td />
              <th scope="col">
                {labels.previous}
                <small>{copy.previousWeek}</small>
              </th>
              <th scope="col">
                {labels.current}
                <small>{copy.currentWeek}</small>
              </th>
            </tr>
          </thead>
          <tbody>
            {report.map(({ key, label, previous, current }) => (
              <tr key={key} data-topic={key}>
                <th scope="row">
                  {label}
                  {key === "wait" && (
                    <small>
                      {labels.branch} {example.branch}
                    </small>
                  )}
                </th>
                <td>{previous}</td>
                <td>{current}</td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr>
              <th scope="row">{labels.total}</th>
              <td>{previousTotal}</td>
              <td>{reviews.length}</td>
            </tr>
          </tfoot>
        </table>
        <div className="up-action">
          <UserCircle weight="duotone" /> <b>{labels.action}</b>
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
