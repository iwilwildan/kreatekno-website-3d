"use client";

import { ArrowDown, ChatCircleDots } from "@phosphor-icons/react/ssr";
import { useEffect, useRef, useState } from "react";
import type { CeritaLocale } from "@/content/solusi/cerita/schema";

type StoryWorld = { setScene(scene: number): void; dispose(): void };

export function CeritaScroll({
  story,
  labels,
  message,
}: {
  story: CeritaLocale;
  labels: {
    eyebrow: string;
    question: string;
    scroll: string;
    sample: string;
    hint: string;
    rail: string;
    of: string[];
    no3d: string;
    greybox: string;
    consult: string;
  };
  message: string;
}) {
  const body = useRef<HTMLDivElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const worldHost = useRef<HTMLDivElement>(null);
  const steps = useRef<Array<HTMLLIElement | null>>([]);
  const world = useRef<StoryWorld | null>(null);
  const activeRef = useRef(0);
  const [active, setActive] = useState(0);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let frame = 0;
    const sync = () => {
      frame = 0;
      const line =
        innerHeight *
        (matchMedia("(max-width: 759px), (max-width: 1023px) and (orientation: portrait)").matches ? 0.7 : 0.56);
      let next = 0;
      steps.current.forEach((step, index) => {
        if (step && step.getBoundingClientRect().top < line) next = index;
      });
      setActive((current) => {
        activeRef.current = next;
        if (current !== next) world.current?.setScene(next);
        return next;
      });
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(sync);
    };
    sync();
    addEventListener("scroll", schedule, { passive: true });
    addEventListener("resize", schedule);
    return () => {
      removeEventListener("scroll", schedule);
      removeEventListener("resize", schedule);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  useEffect(() => {
    const target = body.current;
    if (!target || !worldHost.current) return;
    let cancelled = false;
    let fontTimer: ReturnType<typeof setTimeout> | undefined;

    const mount = async () => {
      const fontWaitStarted = performance.now();
      const fontsReady = document.fonts?.ready ?? Promise.resolve();
      await Promise.race([
        fontsReady,
        new Promise<void>((resolve) => {
          fontTimer = setTimeout(resolve, 1500);
        }),
      ]);
      if (fontTimer) clearTimeout(fontTimer);
      if (worldHost.current) {
        worldHost.current.dataset.fontWaitMs = String(Math.round(performance.now() - fontWaitStarted));
      }
      if (cancelled || !worldHost.current) return;

      try {
        const { mountOrderGroupStory } = await import("@/world/cerita");
        if (cancelled || !worldHost.current) return;
        world.current = mountOrderGroupStory(worldHost.current, activeRef.current, story, () => {
          if (!cancelled) setFailed(true);
        });
      } catch {
        if (!cancelled) setFailed(true);
      }
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting || world.current) return;
        observer.disconnect();
        void mount();
      },
      { rootMargin: "400px 0px" },
    );
    observer.observe(target);
    return () => {
      cancelled = true;
      if (fontTimer) clearTimeout(fontTimer);
      observer.disconnect();
      world.current?.dispose();
      world.current = null;
    };
  }, [story]);

  const jump = (index: number) => {
    const step = steps.current[index];
    if (!step) return;
    const narrow = matchMedia("(max-width: 759px), (max-width: 1023px) and (orientation: portrait)").matches;
    const rect = step.getBoundingClientRect();
    const y = scrollY + rect.top - (narrow ? innerHeight * 0.6 : (innerHeight - rect.height) / 2) + 2;
    scrollTo({ top: y, behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
  };

  return (
    <section className="detail-story" aria-labelledby="story-title">
      <div className="detail-inner story-intro">
        <p className="detail-eyebrow">{labels.eyebrow}</p>
        <h2 id="story-title">{labels.question}</h2>
        <p>
          {story.intro} {labels.scroll} {labels.sample}
        </p>
        <span className="story-hint">
          <ArrowDown aria-hidden /> {labels.hint}
        </span>
      </div>
      <div ref={body} className="story-body">
        <div className="story-sticky">
          <div ref={stage} className={failed ? "story-stage no3d" : "story-stage"} aria-hidden="true">
            <div ref={worldHost} className="story-world-host" />
            <div className="story-grid" />
            <div className="story-greybox-label">{labels.greybox}</div>
            <div className="story-active-label">
              <b>{story.scenes[active].rail}</b>
              <span>{story.scenes[active].body}</span>
            </div>
            {failed && <div className="story-no3d">{labels.no3d}</div>}
          </div>
          <nav className="story-rail" aria-label={labels.rail}>
            {story.scenes.map((scene, index) => (
              <button
                key={scene.id}
                type="button"
                className={index < active ? "done" : ""}
                aria-current={index === active ? "step" : undefined}
                aria-label={`${labels.of[index]}: ${scene.rail}`}
                onClick={() => jump(index)}
              >
                <span>{scene.rail}</span>
                <i />
              </button>
            ))}
          </nav>
        </div>
        <ol className="story-steps">
          {story.scenes.map((scene, index) => (
            <li
              ref={(node) => {
                steps.current[index] = node;
              }}
              className="story-step"
              id={`scene-${scene.id}`}
              key={scene.id}
            >
              <article className={index === active ? "story-card is-active" : "story-card"}>
                <span className="story-number">{labels.of[index]}</span>
                <p className="detail-eyebrow">{scene.eyebrow}</p>
                <h3>{scene.title}</h3>
                <p>{scene.body}</p>
                {scene.cta && (
                  <button
                    type="button"
                    className="solusi-button is-primary"
                    data-contact
                    data-src="solution-detail-story"
                    data-intent="detail"
                    data-msg={message}
                  >
                    <ChatCircleDots aria-hidden weight="bold" /> {labels.consult}
                  </button>
                )}
              </article>
            </li>
          ))}
        </ol>
      </div>
      <div className="sr-only" aria-label="World example text">
        {Object.entries(story.world).map(([id, value]) => (
          <p key={id}>{value}</p>
        ))}
      </div>
    </section>
  );
}
