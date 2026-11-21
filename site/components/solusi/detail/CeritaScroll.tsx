"use client";

import {
  ArrowDown,
  ArrowRight,
  ArrowsClockwise,
  Bell,
  CalendarCheck,
  ChatCircleDots,
  CheckCircle,
  Heart,
  ListBullets,
  MagnifyingGlass,
  MapPin,
  Sparkle,
  Table,
  Truck,
  UsersThree,
} from "@phosphor-icons/react/ssr";
import { useEffect, useRef, useState } from "react";
import type { StoryEntry } from "@/content/solusi/cerita";
import type { Film } from "./ceritaFilm";
import { TIMING } from "./ceritaTiming";
import { Panggung } from "./Panggung";
import { PanggungBooking } from "./PanggungBooking";
import { PanggungRiset } from "./PanggungRiset";

/** Canvas design size in px (`.og-cv`, `.bj-cv`, `.rk-cv`), scaled to fit the stage. */
const DESIGN = { w: 440, h: 520, max: 1.5 };
/** Pinned scroll length of the story, in screens (as the Tonton prototype). */
const SCREENS = 11;
/** The six workflow steps on the rail are scenes 1-6. */
const LAST_NODE = 6;
/** Per story: rail icons (scenes 1-6), the scene drawn at night, and the lazily loaded film. */
const KIND = {
  "order-grup": {
    icons: [ChatCircleDots, Sparkle, Table, CheckCircle, Truck, Bell],
    night: 6,
    film: () => import("./ceritaFilm"),
  },
  "booking-jasa": {
    icons: [ChatCircleDots, Sparkle, CalendarCheck, MapPin, UsersThree, ArrowsClockwise],
    night: 1,
    film: () => import("./ceritaFilmBooking"),
  },
  "riset-konten": {
    icons: [ListBullets, Sparkle, Heart, MagnifyingGlass, Table, CheckCircle],
    night: 1,
    film: () => import("./ceritaFilmRiset"),
  },
} as const;

/**
 * A solution story in the Tonton layout (OG5c, Order Grup and Booking Jasa): a sticky pastel stage with the
 * scene caption on the left, the motion-graphic canvas on the right and the workflow rail below. Scrolling
 * through the reel maps linearly to the story's timeline. Captions and rail follow React state, so they work
 * without GSAP; the canvas film is lazy.
 */
export function CeritaScroll({
  story,
  labels,
  message,
  metrics,
}: {
  story: StoryEntry;
  labels: {
    /** Section heading ("Cara kerjanya"); the solution question already sits in the hero answer box. */
    title: string;
    scroll: string;
    sample: string;
    hint: string;
    rail: string;
    of: string[];
    consult: string;
    prev: string;
    next: string;
  };
  message: string;
  metrics: Array<{ value: string; unit: string; label: string }>;
}) {
  const reel = useRef<HTMLDivElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const viz = useRef<HTMLDivElement>(null);
  const bar = useRef<HTMLElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const film = useRef<Film | null>(null);
  const position = useRef({ time: 0, scene: 0 });
  const [active, setActive] = useState(0);
  const kind = KIND[story.slug];
  const timing = TIMING[story.slug];
  const copy = story.copy;

  // Reel scroll → timeline time → scene, progress bar and rail packet.
  useEffect(() => {
    let frame = 0;
    const sync = () => {
      frame = 0;
      const host = reel.current;
      if (!host) return;
      const rect = host.getBoundingClientRect();
      const run = rect.height - innerHeight;
      const q = run > 0 ? Math.min(1, Math.max(0, -rect.top / run)) : 0;
      const time = q * timing.TOTAL;
      const scene = timing.sceneAt(time);
      position.current = { time, scene };
      film.current?.seek(time, scene);
      bar.current?.style.setProperty("transform", `scaleX(${q.toFixed(4)})`);
      const packet = timing.packetAt(time);
      track.current?.style.setProperty("--p", String(packet ?? 0));
      track.current?.style.setProperty("--pk", packet === null ? "0" : "1");
      setActive(scene);
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
  }, [timing]);

  // Fit the fixed-size canvas into its grid cell.
  useEffect(() => {
    const area = viz.current;
    if (!area) return;
    const fit = () => {
      const scale = Math.min(area.clientWidth / DESIGN.w, area.clientHeight / DESIGN.h, DESIGN.max);
      if (scale > 0) area.style.setProperty("--og-s", scale.toFixed(3));
    };
    const observer = new ResizeObserver(fit);
    observer.observe(area);
    fit();
    return () => observer.disconnect();
  }, []);

  // Load GSAP only when the story nears the viewport. Without it, CSS shows each scene's end pose.
  useEffect(() => {
    const target = reel.current;
    if (!target || !stage.current) return;
    let cancelled = false;
    let fontTimer: ReturnType<typeof setTimeout> | undefined;

    const mount = async () => {
      // Canvas offsets are measured from text layout, so wait (briefly) for the web fonts.
      await Promise.race([
        document.fonts?.ready ?? Promise.resolve(),
        new Promise<void>((resolve) => {
          fontTimer = setTimeout(resolve, 1500);
        }),
      ]);
      if (fontTimer) clearTimeout(fontTimer);
      if (cancelled || !stage.current) return;
      try {
        const { createFilm } = await kind.film();
        if (cancelled || !stage.current) return;
        const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
        film.current = createFilm(stage.current, reduced);
        film.current.seek(position.current.time, position.current.scene);
      } catch {
        // Static CSS poses stay in place.
      }
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting || film.current) return;
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
      film.current?.dispose();
      film.current = null;
    };
  }, [story, kind]);

  const jump = (scene: number) => {
    const host = reel.current;
    if (!host) return;
    const index = Math.max(0, Math.min(copy.scenes.length - 1, scene));
    const top = scrollY + host.getBoundingClientRect().top;
    const y = top + (timing.restTime(index) / timing.TOTAL) * (host.offsetHeight - innerHeight);
    scrollTo({ top: y, behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
  };

  const last = copy.scenes.length - 1;
  const stateOf = (scene: number) =>
    active > LAST_NODE || active > scene ? "done" : active === scene ? "on" : undefined;

  return (
    <section className="detail-story" aria-labelledby="story-title">
      <div className="detail-inner story-intro">
        <h2 id="story-title">{labels.title}</h2>
        <p>
          {copy.intro} {labels.scroll} {labels.sample}
        </p>
        <span className="story-hint">
          <ArrowDown aria-hidden /> {labels.hint}
        </span>
      </div>
      <div ref={reel} className="story-reel" style={{ "--screens": SCREENS } as React.CSSProperties}>
        <div ref={stage} className={active === kind.night ? "story-stage is-night" : "story-stage"}>
          <div className="story-bar" aria-hidden="true">
            <i ref={bar} />
          </div>
          <div className="story-frame">
            <div className="story-capcol">
              <ol className="story-caps">
                {copy.scenes.map((scene, index) => (
                  <li key={scene.id} id={`scene-${scene.id}`} className={index === active ? "is-live" : undefined}>
                    <p className="story-kick">{scene.eyebrow}</p>
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
                        tabIndex={index === active ? undefined : -1}
                      >
                        <ChatCircleDots aria-hidden weight="bold" /> {labels.consult}
                      </button>
                    )}
                  </li>
                ))}
              </ol>
              <div className="story-ctrl">
                <button type="button" aria-label={labels.prev} disabled={active === 0} onClick={() => jump(active - 1)}>
                  <ArrowRight aria-hidden weight="bold" className="is-back" />
                </button>
                <button
                  type="button"
                  aria-label={labels.next}
                  disabled={active === last}
                  onClick={() => jump(active + 1)}
                >
                  <ArrowRight aria-hidden weight="bold" />
                </button>
                <span>{labels.of[active]}</span>
              </div>
            </div>
            <div ref={viz} className="og-viz" aria-hidden="true">
              {story.slug === "booking-jasa" ? (
                <PanggungBooking copy={story.copy.stage} metrics={metrics} scene={active} />
              ) : story.slug === "riset-konten" ? (
                <PanggungRiset copy={story.copy.stage} metrics={metrics} scene={active} />
              ) : (
                <Panggung copy={story.copy.stage} metrics={metrics} scene={active} />
              )}
            </div>
            <nav className={active === 0 ? "story-flow is-pre" : "story-flow"} aria-label={labels.rail}>
              <div ref={track} className="story-track">
                {kind.icons.map((Icon, index) => {
                  const scene = index + 1;
                  return (
                    <button
                      key={scene}
                      type="button"
                      className="story-node"
                      data-s={stateOf(scene)}
                      aria-current={active === scene ? "step" : undefined}
                      aria-label={`${labels.of[scene]}: ${copy.scenes[scene].rail}`}
                      onClick={() => jump(scene)}
                    >
                      <span className="story-nb">
                        <Icon aria-hidden weight="bold" />
                      </span>
                      <span className="story-nl">{copy.scenes[scene].rail}</span>
                    </button>
                  );
                })}
                <i className="story-pk" aria-hidden="true" />
              </div>
              <p className="story-now" aria-hidden="true">
                {copy.scenes[active].rail}
              </p>
            </nav>
          </div>
        </div>
      </div>
    </section>
  );
}
