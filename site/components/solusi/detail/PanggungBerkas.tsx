import {
  ChatCircleDots,
  CheckCircle,
  Clock,
  FilePdf,
  FolderOpen,
  ImageSquare,
  MagnifyingGlass,
  PaperPlaneTilt,
  Table,
  UserCircle,
  WarningCircle,
} from "@phosphor-icons/react/ssr";
import type { BerkasPanggung } from "@/content/solusi/cerita/schema";

type Attachment = { name: string; label: string; format: "photo" | "pdf" };

function Attachments({ files }: { files: Attachment[] }) {
  return (
    <ul className="bd-files">
      {files.map(({ name, label, format }) => {
        const Icon = format === "photo" ? ImageSquare : FilePdf;
        return (
          <li key={name} data-format={format}>
            <Icon weight="duotone" />
            <div>
              <b>{label}</b>
              <small>{name}</small>
            </div>
          </li>
        );
      })}
    </ul>
  );
}

export function PanggungBerkas({
  copy,
  metrics,
  scene,
}: {
  copy: BerkasPanggung;
  metrics: { value: string; unit: string; label: string }[];
  scene: number;
}) {
  const { reference, customer, reviewer, labels } = copy;
  const { identity, certificate, family } = copy.documents;
  const firstBatch = [
    { label: identity.label, name: identity.first, format: "photo" },
    { label: certificate.label, name: certificate.file, format: "pdf" },
  ] satisfies Attachment[];
  const latestBatch = [
    { label: identity.label, name: identity.replacement, format: "photo" },
    { label: family.label, name: family.file, format: "pdf" },
  ] satisfies Attachment[];
  const checklist = [
    { name: identity.label, state: "is-resend", label: labels.resend, detail: labels.unreadable },
    { name: family.label, state: "is-missing", label: labels.missing },
    { name: certificate.label, state: "is-read", label: labels.read },
  ];
  const readCount = checklist.filter(({ state }) => state === "is-read").length;

  return (
    <div className="bd-cv" data-scene={scene}>
      <div className="bd-panel bd-before">
        <div className="bd-head">
          <ChatCircleDots weight="duotone" /> <b>{labels.before}</b>
        </div>
        <ul className="bd-inbox">
          <li>
            <ImageSquare weight="duotone" /> {identity.label}
          </li>
          <li>
            <MagnifyingGlass weight="duotone" /> {labels.searching}
          </li>
          <li>
            <FilePdf weight="duotone" /> {certificate.label}
          </li>
        </ul>
      </div>
      <div className="bd-panel bd-receive">
        <div className="bd-head">
          <ChatCircleDots weight="duotone" />{" "}
          <b>
            {labels.chat} · {customer}
          </b>
        </div>
        <p className="bd-label">{labels.firstBatch}</p>
        <Attachments files={firstBatch} />
      </div>
      <div className="bd-panel bd-folder">
        <div className="bd-head">
          <FolderOpen weight="duotone" /> <b>{labels.folder}</b>
          <code>{reference}</code>
        </div>
        <Attachments files={firstBatch} />
      </div>
      <div className="bd-panel bd-read">
        <div className="bd-head">
          <Table weight="duotone" /> <b>{labels.checklist}</b>
          <code>{reference}</code>
        </div>
        <ul className="bd-checklist">
          {checklist.map(({ name, label, state, detail }) => (
            <li key={name}>
              <div>
                <b>{name}</b>
                {detail && <small>{detail}</small>}
              </div>
              <span className={`bd-tag ${state}`}>{label}</span>
            </li>
          ))}
        </ul>
        <div className="bd-summary">
          <b className="bd-count">
            {readCount}/{checklist.length} {labels.read}
          </b>
          <span className="bd-tag is-resend">
            <WarningCircle weight="fill" /> {labels.needsMore}
          </span>
        </div>
      </div>
      <div className="bd-panel bd-request">
        <div className="bd-head">
          <ChatCircleDots weight="duotone" />{" "}
          <b>
            {labels.chat} · {customer}
          </b>
        </div>
        <div className="bd-bubble">
          <b>
            <PaperPlaneTilt weight="duotone" /> {reviewer}
          </b>
          <p>{copy.request}</p>
        </div>
      </div>
      <div className="bd-panel bd-update">
        <div className="bd-head">
          <FolderOpen weight="duotone" /> <b>{labels.folder}</b>
          <code>{reference}</code>
        </div>
        <p className="bd-label">{labels.newFiles}</p>
        <Attachments files={latestBatch} />
        <div className="bd-update-heading">
          <Table weight="duotone" /> <b>{labels.checklist}</b>
        </div>
        <ul className="bd-checklist bd-updated-checklist">
          {checklist.map(({ name }) => (
            <li key={name}>
              <b>{name}</b>
              <span className="bd-tag is-read">{labels.read}</span>
            </li>
          ))}
        </ul>
        <div className="bd-summary">
          <b className="bd-count">
            {checklist.length}/{checklist.length} {labels.read}
          </b>
          <span className="bd-tag is-ready">
            <Clock weight="bold" /> {labels.ready}
          </span>
        </div>
      </div>
      <div className="bd-panel bd-review">
        <div className="bd-head">
          <UserCircle weight="duotone" /> <b>{labels.review}</b>
          <code>{reference}</code>
        </div>
        <div className="bd-review-note">
          <b>{reviewer}</b>
          <p>{labels.compareData}</p>
        </div>
        <div className="bd-verification">
          <CheckCircle weight="fill" /> {labels.checked}
        </div>
        <div className="bd-complete">
          <span className="bd-tag is-complete">
            <CheckCircle weight="fill" /> {labels.complete}
          </span>
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
