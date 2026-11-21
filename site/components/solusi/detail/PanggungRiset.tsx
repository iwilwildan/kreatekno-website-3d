import { ArrowDown, Check, Hash, Heart, MagnifyingGlass, Moon, Question, Sparkle } from "@phosphor-icons/react/ssr";
import type { RisetPanggung } from "@/content/solusi/cerita/schema";

type Metric = { value: string; unit: string; label: string };

/** The three keyword pastels, shared by the highlighted phrase and its chip. */
const KW = ["var(--rk-k0)", "var(--rk-k1)", "var(--rk-k2)"];

/**
 * Motion-graphic stage for the Riset Konten story (RK1 "one topic travels"): idea notes become a topic list,
 * the picked topic becomes a trend summary, its key phrases become keywords, the keywords pull in the most-liked
 * posts, the posts fold into an audience-pattern card, the card becomes a row in the research table, and the
 * team approves it. Server-rendered so every word is in the HTML; `ceritaFilmRiset.ts` animates it. Without the
 * film, CSS shows each scene's end pose from `data-scene`. Shared visuals reuse the `og-*` and `bj-*` classes.
 */
export function PanggungRiset({ copy, metrics, scene }: { copy: RisetPanggung; metrics: Metric[]; scene: number }) {
  const { analysis, table, notify } = copy;
  // Keyword number of each highlighted phrase, in reading order.
  const kwAt = copy.research.parts.map((part, index, all) =>
    typeof part === "string" ? -1 : all.slice(0, index).filter((p) => typeof p !== "string").length,
  );
  return (
    <div className="rk-cv" data-scene={scene}>
      {/* 1 · before: idea notes and the hours they cost */}
      <ul className="rk-notes">
        {copy.notes.map((note) => (
          <li key={note} className="rk-note">
            <Question aria-hidden weight="bold" />
            {note}
          </li>
        ))}
      </ul>
      <div className="og-count">
        <b className="og-cnt" data-to={copy.counter.value}>
          {copy.counter.value}
        </b>
        <small>{copy.counter.label}</small>
      </div>

      {/* 2 · the evening session picks the next topic */}
      <span className="rk-clock">
        <Moon aria-hidden weight="fill" />
        {copy.clock}
      </span>
      <ol className="rk-topics" style={{ "--i": copy.pick } as React.CSSProperties}>
        <i className="rk-sel" />
        {copy.topics.map((topic, index) => (
          <li key={topic} className={index === copy.pick ? "is-pick" : undefined}>
            <span className="rk-n">{index + 1}</span>
            {topic}
          </li>
        ))}
      </ol>

      {/* 3 · the trend summary and its keywords */}
      <span className="rk-topic">
        <Hash aria-hidden weight="bold" />
        {copy.topics[copy.pick]}
      </span>
      <div className="rk-sum">
        <b className="rk-h">
          <Sparkle aria-hidden weight="fill" />
          {copy.research.title}
        </b>
        <p>
          {copy.research.parts.map((part, index) => {
            if (typeof part === "string") return part;
            const i = kwAt[index];
            return (
              <span key={index} className="og-hl" data-k={i} style={{ "--h": KW[i] } as React.CSSProperties}>
                {part.kw}
              </span>
            );
          })}
        </p>
      </div>
      <ul className="og-chips rk-kws">
        {copy.keywords.map((keyword, index) => (
          <li key={keyword} className="og-chip" data-k={index} style={{ background: KW[index] }}>
            <MagnifyingGlass aria-hidden weight="bold" />
            {keyword}
          </li>
        ))}
      </ul>

      {/* 4 · the most-liked posts, sorted */}
      <ul className="rk-posts">
        {copy.posts.map((post) => (
          <li key={post.who} className="rk-post">
            <span className="og-who">{post.who}</span>
            <p>{post.text}</p>
            <span className="rk-likes">
              <Heart aria-hidden weight="fill" />
              {post.likes}
            </span>
          </li>
        ))}
      </ul>
      <span className="rk-sort">
        <ArrowDown aria-hidden weight="bold" />
        {copy.sort}
      </span>

      {/* 5 · the audience pattern */}
      <div className="rk-ana">
        <div className="rk-ana-h">
          <b className="rk-h">
            <Sparkle aria-hidden weight="fill" />
            {analysis.title}
          </b>
          <div className="rk-score">
            <b>
              <span className="rk-sc" data-to={analysis.score}>
                {analysis.score}
              </span>
              <small>{analysis.of}</small>
            </b>
            <span>{analysis.scoreLabel}</span>
          </div>
        </div>
        <p className="rk-lbl">{analysis.complaintsLabel}</p>
        <ul className="rk-cmp">
          {analysis.complaints.map((complaint) => (
            <li key={complaint}>{complaint}</li>
          ))}
        </ul>
        <p className="rk-lbl">{analysis.angleLabel}</p>
        <p className="rk-angle">{analysis.angle}</p>
      </div>

      {/* 6-7 · the research table and the team's choice */}
      <div className="rk-tbl">
        {table.rows.map((row) => (
          <div key={row.topic} className="rk-tr">
            <span className="rk-tp">
              <b>{row.topic}</b>
              <small>{row.angle}</small>
            </span>
            <span className="rk-scr">{row.score}</span>
            <span className={`rk-st is-${row.status}`}>{copy.status[row.status]}</span>
          </div>
        ))}
        <div className="rk-tr is-new">
          <span className="rk-tp">
            <b>{table.added.topic}</b>
            <small>{table.added.angle}</small>
          </span>
          <span className="rk-scr">{table.added.score}</span>
          <span className="og-swap">
            <span className="og-was rk-st is-new">{copy.status.new}</span>
            <span className="og-now rk-st is-approved">{copy.status.approved}</span>
          </span>
        </div>
      </div>
      <div className="rk-ntf">
        <div className="rk-ntf-h">
          {/* eslint-disable-next-line @next/next/no-img-element -- tiny decorative brand mark */}
          <img src="/brand/kreatekno-mark.png" alt="" width={28} height={28} />
          <b>{notify.title}</b>
          <span>{notify.score}</span>
        </div>
        <p>
          <b>{notify.topic}</b>
          {notify.angle}
        </p>
        <div className="bj-btns">
          <span className="bj-yes">
            {notify.yes}
            <i className="bj-tick">
              <Check aria-hidden weight="bold" />
            </i>
          </span>
          <span className="bj-no">{notify.no}</span>
        </div>
      </div>

      {/* 8-9 · results */}
      <div className="og-mx">
        {metrics.map((metric) => (
          <div key={metric.label} className="og-m">
            <b>
              <span className="og-num" data-to={/^\d+$/.test(metric.value) ? metric.value : undefined}>
                {metric.value}
              </span>
              <small>{metric.unit}</small>
            </b>
            <p>{metric.label}</p>
          </div>
        ))}
        <span className="og-sample">{copy.sample}</span>
      </div>
    </div>
  );
}
