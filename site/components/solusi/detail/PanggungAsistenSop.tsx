import {
  BookOpenText,
  CheckCircle,
  FileText,
  FolderOpen,
  PaperPlaneTilt,
  Table,
  UserCircle,
} from "@phosphor-icons/react/ssr";
import type { AsistenSopPanggung } from "@/content/solusi/cerita/schema";

export function PanggungAsistenSop({
  copy,
  metrics,
  scene,
}: {
  copy: AsistenSopPanggung;
  metrics: { value: string; unit: string; label: string }[];
  scene: number;
}) {
  const { document, labels, staff } = copy;
  const file = (
    <div className="as-file">
      <FileText weight="duotone" />
      <b>{document.title}</b>
      <span className="as-tag">v{document.version}</span>
    </div>
  );
  const section = (
    <small>
      {labels.source} {document.section} · {document.heading}
    </small>
  );
  const chatHeading = (
    <div className="as-head">
      <PaperPlaneTilt weight="duotone" /> <b>{labels.chat}</b>
    </div>
  );
  const question = (
    <div className="as-bubble as-staff">
      <b>{staff}</b>
      <p>{copy.question}</p>
    </div>
  );

  return (
    <div className="as-cv" data-scene={scene}>
      <div className="as-panel as-before">
        <div className="as-head">
          <FolderOpen weight="duotone" /> <b>{labels.folder}</b>
        </div>
        {file}
        <div className="as-bubble as-staff">
          <b>{staff}</b>
          <p>{labels.searching}</p>
        </div>
      </div>
      <div className="as-panel as-folder">
        <div className="as-head">
          <FolderOpen weight="duotone" /> <b>{labels.folder}</b>
        </div>
        {file}
      </div>
      <div className="as-panel as-library">
        <div className="as-head">
          <BookOpenText weight="duotone" /> <b>{labels.knowledgeBase}</b>
          <span className="as-tag as-ready">
            <CheckCircle weight="fill" /> {labels.ready}
          </span>
        </div>
        {file}
        <div className="as-excerpt">{section}</div>
      </div>
      <div className="as-panel as-ask">
        {chatHeading}
        {question}
      </div>
      <div className="as-panel as-answered">
        {chatHeading}
        {question}
        <div className="as-bubble as-reply">
          <b>{labels.assistant}</b>
          <ol>
            {copy.answer.map((line) => (
              <li key={line}>{line}</li>
            ))}
          </ol>
        </div>
        <div className="as-source">
          <BookOpenText weight="duotone" />
          <div>
            <b>{document.title}</b>
            {section}
          </div>
        </div>
      </div>
      <div className="as-panel as-outside">
        {chatHeading}
        <div className="as-bubble as-staff">
          <b>{staff}</b>
          <p>{copy.followUp}</p>
        </div>
        <div className="as-bubble as-reply">
          <b>{labels.assistant}</b>
          <span className="as-tag as-outside-tag">{labels.outsideSop}</span>
          <p>{copy.guidance}</p>
        </div>
        <div className="as-staff-action">
          <UserCircle weight="duotone" /> {labels.staffAction}
        </div>
      </div>
      <div className="as-panel as-log">
        <div className="as-head">
          <Table weight="duotone" /> <b>{labels.log}</b>
        </div>
        <div className="as-log-entry">
          <small>{labels.topic}</small>
          <b>{copy.logTopic}</b>
        </div>
        <span className="as-tag as-design">{labels.design}</span>
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
