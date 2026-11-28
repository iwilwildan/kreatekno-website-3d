import {
  BookmarkSimple,
  ChatCircleDots,
  Clock,
  Coffee,
  FileText,
  FolderOpen,
  FrameCorners,
  Images,
  ListBullets,
  PaperPlaneTilt,
  Table,
} from "@phosphor-icons/react/ssr";
import type { CarouselPanggung } from "@/content/solusi/cerita/schema";

export function PanggungCarousel({
  copy,
  metrics,
  scene,
}: {
  copy: CarouselPanggung;
  metrics: { value: string; unit: string; label: string }[];
  scene: number;
}) {
  const { brand, labels, slides, number } = copy;
  return (
    <div className="cr-cv" data-scene={scene}>
      <div className="cr-panel cr-before">
        <div className="cr-head">
          <Coffee weight="duotone" /> <b>{labels.before}</b>
        </div>
        <ul className="cr-materials">
          <li>
            <FileText weight="duotone" /> {labels.notes}
          </li>
          <li>
            <FrameCorners weight="duotone" /> {labels.design}
          </li>
          <li>
            <ChatCircleDots weight="duotone" /> {labels.caption}
          </li>
        </ul>
      </div>
      <div className="cr-panel cr-topics">
        <div className="cr-head">
          <Table weight="duotone" /> <b>{labels.table}</b>
          <code>{number}</code>
        </div>
        <div className="cr-brief">
          <b>{slides[0].title}</b>
          <p>{copy.brief}</p>
        </div>
        <div className="cr-meta">
          <span className="cr-tag">{labels.education}</span>
          <span className="cr-tag">{labels.slideCount}</span>
          <strong>{copy.owner}</strong>
        </div>
      </div>
      <div className="cr-panel cr-outline">
        <div className="cr-head">
          <ListBullets weight="duotone" /> <b>{labels.outline}</b>
        </div>
        <ol>
          {slides.map(({ kind, title }, index) => (
            <li key={kind}>
              <span>{index + 1}</span> {title}
            </li>
          ))}
        </ol>
      </div>
      <div className="cr-panel cr-frame-sample">
        <div className="cr-head">
          <FrameCorners weight="duotone" /> <b>{labels.frame}</b>
        </div>
        <div className="cr-frame">
          <b className="cr-brand">{brand}</b>
          <div className="cr-swatches">
            <i />
            <i />
            <i />
          </div>
          <span className="cr-footer">{labels.footer}</span>
        </div>
      </div>
      <div className="cr-panel cr-gallery">
        <div className="cr-head">
          <Images weight="duotone" /> <b>{labels.slides}</b>
          <span className="cr-tag">{labels.slideCount}</span>
        </div>
        <ol>
          {slides.map(({ kind, title, body }) => (
            <li className="cr-frame" key={kind} data-kind={kind}>
              <b className="cr-brand">{brand}</b>
              <div className="cr-art">
                {kind === "cover" ? (
                  <Coffee weight="duotone" />
                ) : kind === "save" ? (
                  <BookmarkSimple weight="duotone" />
                ) : (
                  <i />
                )}
              </div>
              <b className="cr-slide-title">{title}</b>
              <p>{body}</p>
              <span className="cr-footer">{labels.footer}</span>
            </li>
          ))}
        </ol>
      </div>
      <div className="cr-panel cr-caption">
        <div className="cr-head">
          <ChatCircleDots weight="duotone" /> <b>{labels.caption}</b>
        </div>
        <div className="cr-caption-body">
          <b>{brand}</b>
          <p>{copy.caption}</p>
          <span>{copy.hashtags.join(" ")}</span>
        </div>
      </div>
      <div className="cr-panel cr-handoff">
        <div className="cr-handoff-folder">
          <div className="cr-head">
            <FolderOpen weight="duotone" /> <b>{labels.folder}</b>
            <code>{number}</code>
          </div>
          <div className="cr-files">
            <span>
              <Images weight="duotone" /> {labels.slideCount}
            </span>
            <span>
              <FileText weight="duotone" /> {labels.caption}
            </span>
          </div>
        </div>
        <div className="cr-handoff-chat">
          <div className="cr-head">
            <PaperPlaneTilt weight="duotone" /> <b>{labels.group}</b>
          </div>
          <div className="cr-sent-preview">
            <p>{labels.preview}</p>
            <div className="cr-preview-strip">
              {slides.map(({ kind }, index) => (
                <span key={kind}>{index + 1}</span>
              ))}
            </div>
          </div>
        </div>
        <div className="cr-handoff-status">
          <div className="cr-head">
            <Table weight="duotone" /> <b>{labels.table}</b>
            <code>{number}</code>
          </div>
          <span className="cr-tag cr-review">
            <Clock weight="bold" /> {labels.review}
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
