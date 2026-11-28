import {
  ArrowBendDownRight,
  ArrowUpRight,
  CheckCircle,
  Clock,
  Headset,
  Package,
  PaperPlaneTilt,
  SkipForward,
  Tag,
} from "@phosphor-icons/react/ssr";
import type { KomentarPanggung } from "@/content/solusi/cerita/schema";

type Metric = { value: string; unit: string; label: string };

export function PanggungKomentar({
  copy,
  metrics,
  scene,
}: {
  copy: KomentarPanggung;
  metrics: Metric[];
  scene: number;
}) {
  const { post, question, history, filter, inbox, log } = copy;
  const questionText = (
    <>
      <mark>{question.keyword}</mark>
      {question.after}
    </>
  );

  return (
    <div className="bk-cv" data-scene={scene}>
      <div className="bk-schedule bk-badge">
        <Clock weight="bold" /> {post.schedule}
      </div>
      <div className="bk-panel bk-post">
        <div className="bk-post-cover">
          <div className="bk-swatches">
            <i />
            <i />
            <i />
          </div>
          <div className="bk-post-names">
            <span>{post.shop}</span>
            <b>{post.collection}</b>
          </div>
        </div>
        <ul className="bk-post-comments">
          {post.otherComments.map((comment) => (
            <li key={comment}>{comment}</li>
          ))}
          <li className="bk-missed">
            <b>{question.who}</b> {questionText}
          </li>
        </ul>
      </div>
      <div className="bk-packing bk-badge">
        <Package weight="duotone" /> {post.packing}
      </div>

      <div className="bk-panel bk-history">
        <b className="bk-panel-title">{history.title}</b>
        <div className="bk-history-row">
          <code>{question.id}</code>
          <span className="bk-badge">{history.pending}</span>
        </div>
        <div className="bk-history-row bk-duplicate">
          <code>{history.duplicateId}</code>
          <span className="bk-badge is-muted">
            <SkipForward weight="fill" /> {history.handled}
          </span>
        </div>
      </div>

      <div className="bk-panel bk-filter">
        <b className="bk-panel-title">{filter.title}</b>
        <ul className="bk-keywords">
          {filter.keywords.map((keyword) => (
            <li
              key={keyword}
              className={keyword.toLowerCase() === question.keyword.toLowerCase() ? "is-match" : undefined}
            >
              <Tag weight="bold" /> {keyword}
            </li>
          ))}
        </ul>
        <div className="bk-ignored">
          <span>{post.otherComments[0]}</span>
          <small>{filter.ignored}</small>
        </div>
      </div>

      <div className="bk-panel bk-public">
        <b className="bk-panel-title">{copy.public.title}</b>
        <div className="bk-reply">
          <ArrowBendDownRight weight="bold" />
          <div>
            <b>{post.shop}</b>
            <p>{copy.public.reply}</p>
          </div>
        </div>
      </div>

      <div className="bk-panel bk-packet">
        <span className="bk-avatar">{question.who[0]}</span>
        <div>
          <b>{question.who}</b>
          <p>{questionText}</p>
        </div>
        <code>{question.id}</code>
      </div>

      <div className="bk-panel bk-inbox">
        <div className="bk-inbox-head">
          <span className="bk-avatar">
            <PaperPlaneTilt weight="fill" />
          </span>
          <b>{inbox.title}</b>
          <span>{question.who}</span>
        </div>
        <div className="bk-message">
          <p>{inbox.message}</p>
          <div className="bk-catalog">
            <div>
              <b>{inbox.catalog}</b>
              <small>{inbox.order}</small>
            </div>
            <ArrowUpRight weight="bold" />
          </div>
        </div>
        <div className="bk-handoff">
          <div className="bk-customer">{inbox.customerReply}</div>
          <div className="bk-staff">
            <b>
              <Headset weight="bold" /> {inbox.staff}
            </b>
            <p>{inbox.staffReply}</p>
          </div>
        </div>
      </div>

      <div className="bk-panel bk-log">
        <b className="bk-panel-title">{log.title}</b>
        <div className="bk-log-row">
          <code>{question.id}</code>
          <span>
            <CheckCircle weight="fill" /> {log.publicStatus}
          </span>
          <span>
            <CheckCircle weight="fill" /> {log.privateStatus}
          </span>
        </div>
      </div>

      <div className="og-mx">
        {metrics.map(({ value, unit, label }) => (
          <div key={label} className="og-m">
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
