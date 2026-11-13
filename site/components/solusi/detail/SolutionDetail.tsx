import {
  ArrowLeft,
  ArrowRight,
  ChatCircleDots,
  Check,
  CheckCircle,
  Table,
  Warning,
  WhatsappLogo,
  X,
} from "@phosphor-icons/react/ssr";
import type { CSSProperties } from "react";
import { storyFor } from "@/content/solusi/cerita";
import { detailLabels } from "@/content/solusi/detail-copy";
import type { Solusi, SolusiLocale } from "@/content/solusi/schema";
import { APPS, INDUSTRI, STATUS, TIM } from "@/content/solusi/taksonomi";
import { Link } from "@/i18n/navigation";
import { detailMessage } from "@/lib/solusi/pesan";
import { related } from "@/lib/solusi/related";
import { SOLUSI } from "@/content/solusi";
import { catalogCopy } from "@/content/solusi/catalog";
import { KontakModal } from "../KontakModal";
import { CeritaScroll } from "./CeritaScroll";

const dateLocale = { id: "id-ID", en: "en-US" } as const;

function iconList(items: string[], kind: "warning" | "check" | "x" = "check") {
  const Icon = kind === "warning" ? Warning : kind === "x" ? X : Check;
  return (
    <ul className={`detail-list is-${kind}`}>
      {items.map((item) => (
        <li key={item}>
          <Icon aria-hidden weight="bold" />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

export function SolutionDetail({ solution, locale }: { solution: Solusi; locale: SolusiLocale }) {
  const labels = detailLabels(locale);
  const copy = locale === "en" && solution.en ? solution.en : solution.id;
  const story = storyFor(solution.slug, locale);
  const message = detailMessage(copy.title, locale);
  const status = STATUS[solution.status][locale];
  const industries = solution.industri.map((id) => INDUSTRI.find((item) => item.id === id)!).filter(Boolean);
  const teams = solution.tim.map((id) => TIM.find((item) => item.id === id)!).filter(Boolean);
  const apps = solution.apps.map((id) => APPS.find((item) => item.id === id)!).filter(Boolean);
  const relatedItems = related(solution, SOLUSI);
  const built = copy.built ?? {
    h: labels.builtTitle,
    lead: copy.answer,
    points: copy.steps.map((step) => `${step.title}: ${step.body}`),
  };
  const faqJson = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: copy.faq.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: { "@type": "Answer", text: item.a },
    })),
  };

  return (
    <main className="solusi-page solusi-detail">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJson).replace(/</g, "\\u003c") }}
      />
      <section className="detail-hero">
        <div className="detail-inner detail-hero-grid">
          <div className="detail-hero-title">
            <nav className="detail-crumb" aria-label={labels.location}>
              <Link href="/solusi">Solusi</Link>
              <span aria-hidden>/</span>
              <span>{industries[0]?.label[locale]}</span>
            </nav>
            <div className="detail-meta">
              <span className={`detail-badge is-${solution.status}`}>{status}</span>
              <span className="detail-chip is-team" style={{ "--team": teams[0]?.color } as CSSProperties}>
                {teams[0]?.label[locale]}
              </span>
              {industries.map((item) => (
                <span className="detail-chip" key={item.id}>
                  {item.label[locale]}
                </span>
              ))}
              <time dateTime={solution.updated}>
                {labels.updated}{" "}
                {new Intl.DateTimeFormat(dateLocale[locale], {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                }).format(new Date(`${solution.updated}T00:00:00Z`))}
              </time>
            </div>
            <h1>{copy.title}</h1>
          </div>
          <div className="detail-hero-answer">
            <div className="detail-answer">
              <strong>{copy.question}</strong>
              <p>{copy.answer}</p>
            </div>
            <div className="detail-actions">
              <button
                type="button"
                className="solusi-button is-primary"
                data-contact
                data-src="solution-detail-hero"
                data-intent="detail"
                data-msg={message}
              >
                <ChatCircleDots aria-hidden weight="bold" /> {labels.consult}
              </button>
              <Link className="solusi-button is-paper" href="/solusi">
                <ArrowLeft aria-hidden /> {labels.back}
              </Link>
            </div>
          </div>
        </div>
      </section>

      {story ? (
        <CeritaScroll
          story={story}
          message={message}
          labels={{
            eyebrow: labels.storyEyebrow,
            question: copy.question,
            scroll: labels.storyScroll,
            sample: labels.storySample,
            hint: labels.storyHint,
            rail: labels.storyRail,
            of: story.scenes.map((_, index) => labels.storyOf(index + 1, story.scenes.length)),
            no3d: labels.no3d,
            greybox: labels.greybox,
            consult: labels.consult,
          }}
        />
      ) : (
        <section className="detail-fallback-story detail-inner">
          <p className="detail-eyebrow">{labels.fallbackStory}</p>
          <h2>{copy.question}</h2>
          <ol>
            {copy.steps.map((step) => (
              <li key={step.title}>
                <strong>{step.title}</strong>
                <p>{step.body}</p>
              </li>
            ))}
          </ol>
        </section>
      )}

      <div className="detail-page detail-inner">
        <aside className="detail-facts">
          <h2>{labels.summary}</h2>
          <p className="detail-veil">
            <CheckCircle aria-hidden /> {solution.status === "jalan" ? labels.veilLive : labels.veilIdea}
          </p>
          {copy.client && (
            <div>
              <span>{labels.client}</span>
              <strong>{copy.client}</strong>
            </div>
          )}
          <div>
            <span>{labels.industry}</span>
            <strong>{industries.map((item) => item.label[locale]).join(", ")}</strong>
          </div>
          <div>
            <span>{labels.team}</span>
            <strong>{teams.map((item) => item.label[locale]).join(", ")}</strong>
          </div>
          <div>
            <span>{labels.result}</span>
            <strong>{copy.result}</strong>
          </div>
        </aside>
        <div className="detail-body">
          <section className="detail-section">
            <p className="detail-eyebrow">{labels.painsEyebrow}</p>
            <h2>{labels.painsTitle}</h2>
            {copy.painsLead && <p className="detail-lead">{copy.painsLead}</p>}
            {iconList(copy.pains, "warning")}
          </section>
          <section className="detail-section">
            <p className="detail-eyebrow">{labels.builtEyebrow}</p>
            <h2>{built.h}</h2>
            <p className="detail-lead">{built.lead}</p>
            {iconList(built.points)}
          </section>
          <section className="detail-section is-wide">
            <p className="detail-eyebrow">{labels.compareEyebrow}</p>
            <h2>{labels.compareTitle}</h2>
            <div className="detail-table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>{labels.aspect}</th>
                    <th>{labels.before}</th>
                    <th>{labels.after}</th>
                  </tr>
                </thead>
                <tbody>
                  {copy.compare.map((row) => (
                    <tr key={row.aspect}>
                      <th>{row.aspect}</th>
                      <td>{row.before}</td>
                      <td>{row.after}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
          {copy.metrics && (
            <section className="detail-section is-wide">
              <p className="detail-eyebrow">{labels.metricsEyebrow}</p>
              <h2>{labels.metricsTitle}</h2>
              <div className="detail-metrics">
                {copy.metrics.map((item) => (
                  <div key={item.label}>
                    <strong>{item.value}</strong>
                    <b>{item.unit}</b>
                    <span>{item.label}</span>
                  </div>
                ))}
              </div>
              <p className="detail-note">{labels.sampleNote}</p>
              {copy.quote && (
                <figure>
                  <blockquote>“{copy.quote.text}”</blockquote>
                  <figcaption>
                    {copy.quote.by} · {labels.sampleQuote}
                  </figcaption>
                </figure>
              )}
            </section>
          )}
          <section className="detail-section is-wide">
            <p className="detail-eyebrow">{labels.fitEyebrow}</p>
            <h2>{labels.fitTitle}</h2>
            <div className="detail-fit">
              <div>
                <h3>
                  <CheckCircle aria-hidden /> {labels.yes}
                </h3>
                {iconList(copy.fit)}
              </div>
              <div>
                <h3>
                  <X aria-hidden /> {labels.no}
                </h3>
                {iconList(copy.notFit, "x")}
              </div>
            </div>
          </section>
          <section className="detail-section">
            <p className="detail-eyebrow">{labels.prepEyebrow}</p>
            <h2>{labels.prepTitle}</h2>
            {iconList(copy.prep)}
          </section>
          <section className="detail-section is-wide">
            <p className="detail-eyebrow">{labels.appsEyebrow}</p>
            <h2>{labels.appsTitle}</h2>
            <div className="detail-apps">
              {apps.map((app) => (
                <div key={app.id}>
                  {app.id === "whatsapp" ? (
                    <WhatsappLogo aria-hidden weight="fill" />
                  ) : (
                    <Table aria-hidden weight="bold" />
                  )}
                  <strong>{app.label[locale]}</strong>
                </div>
              ))}
            </div>
          </section>
          <section className="detail-section">
            <p className="detail-eyebrow">{labels.faqEyebrow}</p>
            <h2>{labels.faqTitle}</h2>
            <dl className="detail-faq">
              {copy.faq.map((item) => (
                <div key={item.q}>
                  <dt>{item.q}</dt>
                  <dd>{item.a}</dd>
                </div>
              ))}
            </dl>
          </section>
          <section className="detail-cta is-wide">
            <h2>{labels.ctaTitle}</h2>
            <p>{labels.ctaBody}</p>
            <div className="detail-actions">
              <button
                type="button"
                className="solusi-button is-light"
                data-contact
                data-src="solution-detail-cta"
                data-intent="detail"
                data-msg={message}
              >
                <ChatCircleDots aria-hidden weight="bold" /> {labels.consult}
              </button>
              <Link className="solusi-button is-outline" href="/solusi">
                {labels.back}
              </Link>
            </div>
          </section>
          <section className="detail-section is-wide">
            <p className="detail-eyebrow">{labels.relatedEyebrow}</p>
            <h2>{labels.relatedTitle}</h2>
            <div className="detail-related">
              {relatedItems.map((item) => (
                <Link key={item.slug} href={{ pathname: "/solusi/[slug]", params: { slug: item.slug } }}>
                  <ArrowRight aria-hidden />
                  <span>{catalogCopy(item, locale).title}</span>
                </Link>
              ))}
            </div>
          </section>
        </div>
      </div>
      <KontakModal />
    </main>
  );
}
