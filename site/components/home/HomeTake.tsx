"use client";

import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import { clamp01, scrollAtScreens, screensAtScroll, segmentStart, smoothstep } from "@/world/core/segments";
import { SEG, TAKE_SCREENS, TAKE_SCROLL, keyP, type KeyName } from "@/world/takes/home/timing";
import { placeAnchors, placeHero, PORTRAIT_QUERY, quadMatrix3d, type Quad, type StillsData } from "./placeHero";
import { BOOT_LIMIT_MS, bootUnlock } from "./bootLock";
import { LOBBY_STILLS, lobbyMarks, lobbyStillFades } from "./lobbyStills";
import { PLAQUE_STILLS, plaqueMark, plaqueStillFades } from "./plaqueStills";
import stillsData from "./stills.json";

const STILLS = stillsData as unknown as StillsData;
type Mode = "boot" | "live" | "stills";
type WorldModule = typeof import("@/world");
type World = Awaited<ReturnType<WorldModule["mount"]>>;

/** Screens of scroll over which the hero leaves (end of the K0 hold into the first third of the crane down). */
const HERO_OUT = [SEG[0].screens - 0.05, SEG[0].screens + 0.35 * SEG[1].screens];
/**
 * Stills fallback: crossfade into K1 during the crane down, into K2 during the walk through the door, into K2.1
 * during the dolly in, into K2.2 at the whip pan, into K3 at the end of the tilt down, into K4 during the truck.
 */
const STILL_FADES: Record<string, [number, number]> = {
  K1: [0.51, 0.93],
  K2: [1.72, 2.38],
  "K2.1": [3, 3.6],
  "K2.2": [3.72, 3.92],
  K3: [6.5, 6.9],
  K4: [7.35, 7.8],
  // beats 5a–5b: K4.1 as the camera tilts up, K5a.1 out of the door, then each stop along the row (on 9:16 the
  // "b" stills are the second panel of a hold; on 16:9 they repeat the hold's still, so nothing changes there)
  "K4.1": [8.8, 9.4],
  "K5a.1": [10.4, 11],
  "K5a.2": [11.3, 11.7],
  "K5a.2b": [11.9, 12.08],
  "K5a.3": [12.4, 12.8],
  "K5a.3b": [13, 13.18],
  "K5a.4": [13.5, 13.9],
  "K5a.4b": [14.1, 14.28],
  "K5a.6": [14.6, 15],
  // beats 6–9a (tahap 7): each hold's still as the camera settles, on 9:16 one per stop, K9.1 at the turn
  ...lobbyStillFades(),
  // beats 9b–11 (tahap 8): the plaque as the dolly reaches it (9:16 its right column after), COMPANY's door
  ...plaqueStillFades(),
};
/** Stills of the row in order, per format: the journey's copy on one still fades out as the next comes in. */
const ROW_STILLS = {
  pc: ["K5a.2", "K5a.3", "K5a.4", "K5a.6"],
  hp: ["K5a.2", "K5a.2b", "K5a.3", "K5a.3b", "K5a.4", "K5a.4b", "K5a.6"],
};
/** Stills fallback: the leaflet's copy comes in on the K3 still and goes as the K4 still comes; the page's after. */
// Both copies are fully visible at their keyframe, including when reached by a section link.
const STILL_COPY = { leaflet: [6.7, 6.9], page: [7.7, 7.9] } as const;
/** Screens where the hold on keyframe k starts. */
const holdStart = (k: KeyName) =>
  segmentStart(
    SEG,
    SEG.findIndex((g) => g.type === "hold" && g.from === k),
  );
/** A scroll step longer than this (screens; a jump link, the End key, the scrollbar) cuts instead of flying. */
const JUMP_SCREENS = 2;
/**
 * Jump marks: menu links to sections told inside the take land on their keyframe's hold (its middle). Placed in
 * screens of scroll from the take's own timeline: right while they come before the lobby, where the two formats'
 * timelines part (tahap 7).
 */
const LOBBY_MARK_IDS = { K6: "testimoni", K7: "artikel", K8: "faq" } as const;
const MARKS: { id: string; key: KeyName; at: number; atHp?: number }[] = [
  { id: "layanan", key: "K3", at: keyP("K3") * TAKE_SCREENS },
  // "Cara kerja" lands where the camera arrives on the first panel (on 9:16 the hold's middle is between panels)
  { id: "cara-kerja", key: "K5a.2", at: holdStart("K5a.2") + 0.06 },
  // the lobby's (tahap 7): where the two formats' timelines part, each has its own scroll position (16:9 the
  // keyframe, 9:16 the hold's first stop), turned from the take's timeline into screens of scroll
  ...lobbyMarks().map((m) => ({
    id: LOBBY_MARK_IDS[m.key],
    key: m.key,
    at: scrollAtScreens(SEG, m.pc, false),
    atHp: scrollAtScreens(SEG, m.hp, true),
  })),
  // the plaque's (tahap 8), the same way
  ...[plaqueMark()].map((m) => ({
    id: "tentang",
    key: m.key,
    at: scrollAtScreens(SEG, m.pc, false),
    atHp: scrollAtScreens(SEG, m.hp, true),
  })),
];
const CROSSFADE_MS = 500;
/** Share of the loading bar before the world reports its own steps: the take started, the world's code loaded. */
const BAR_START = 0.02,
  BAR_IMPORTED = 0.08;

/**
 * The Home take: a tall section with a sticky stage. The K0 still is the first paint (LCP); the 3D world loads
 * after the page is visible and crossfades in. Without WebGL the stills crossfade with the scroll instead.
 * Reduced motion and no-JS get the stacked version from CSS (stage.css).
 */
export function HomeTake({
  loadingLabel,
  stills,
  headline,
  body,
  copy,
}: {
  /** "Memuat" / "Loading": the loading bar's label, followed by the share done. */
  loadingLabel: string;
  stills: ReactNode;
  headline: ReactNode;
  body: ReactNode;
  /** Copy on the props of beats 3–4 (leaflet, binder), placed and faded by the world. */
  copy?: ReactNode;
}) {
  const root = useRef<HTMLElement>(null);
  const host = useRef<HTMLDivElement>(null);
  const loader = useRef<HTMLDivElement>(null);
  const [mode, setMode] = useState<Mode>("boot");
  const [live, setLive] = useState(false);
  const [hud, setHud] = useState<string | null>(null);

  useEffect(() => {
    const el = root.current,
      canvasHost = host.current;
    if (!el || !canvasHost) return;
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const stage = el.querySelector<HTMLElement>("[data-stage]")!;
    const params = new URLSearchParams(location.search);
    if (params.has("lab")) {
      // dev-only turnaround stage for the cast (tahap 3); the world is not loaded
      let stop: (() => void) | undefined,
        gone = false;
      void import("@/world/cast/lab").then((m) => {
        if (!gone) stop = m.mountLab(params);
      });
      return () => {
        gone = true;
        stop?.();
      };
    }
    const dev = ["hud", "shot", "bake", "k", "fmt"].some((k) => params.has(k));
    let world: World | null = null,
      worldMod: WorldModule | null = null,
      current: Mode = "boot",
      disposed = false,
      abandoned = false,
      liveAt = 0,
      lastQuads: Record<string, Quad | null> = {};
    let bootTimer: ReturnType<typeof setTimeout> | undefined;
    let hudTimer: ReturnType<typeof setInterval> | undefined;
    let cancelStart = () => {};

    const switchMode = (m: Mode) => {
      current = m;
      setMode(m);
      // live or stills: the scroll is the visitor's again
      if (m !== "boot") bootUnlock();
    };
    /** The loading bar (written directly: no re-render of the take for each step). */
    let barShare = 0;
    const setBar = (share: number) => {
      const bar = loader.current;
      if (!bar || share <= barShare) return;
      barShare = share;
      const pct = Math.round(share * 100);
      bar.style.setProperty("--boot", share.toFixed(3));
      bar.setAttribute("aria-valuenow", String(pct));
      const text = bar.querySelector(".take-loader-text");
      if (text) text.textContent = `${loadingLabel} ${pct}%`;
    };
    // landscape and portrait have their own timelines in the lobby (tahap 7): the stage's height follows the same
    // query (stage.css), and the scroll is mapped onto the take's own timeline (9:16) for the world
    const portraitMq = matchMedia(PORTRAIT_QUERY);
    const fmtNow = () => (portraitMq.matches ? "hp" : "pc");
    /** Where the take is: screens on its own timeline. */
    const readS = () => {
      const r = el.getBoundingClientRect(),
        max = r.height - stage.clientHeight,
        f = fmtNow();
      return screensAtScroll(SEG, (max > 0 ? clamp01(-r.top / max) : 0) * TAKE_SCROLL[f], f === "hp");
    };
    const readP = () => readS() / TAKE_SCREENS;
    /** Scroll top at which the take is at p (0..1 on its own timeline). */
    const scrollTopAt = (p: number) => {
      const f = fmtNow();
      return (
        el.offsetTop +
        (scrollAtScreens(SEG, p * TAKE_SCREENS, f === "hp") / TAKE_SCROLL[f]) * (el.offsetHeight - stage.clientHeight)
      );
    };
    /** Anchors on a still where it covers the stage (object-fit: cover, centred), in stage pixels. */
    const stillQuads = (key = "K0") => {
      const portrait = matchMedia(PORTRAIT_QUERY).matches,
        s = portrait ? STILLS.hp : STILLS.pc;
      const W = stage.clientWidth,
        H = stage.clientHeight,
        k = Math.max(W / s.w, H / s.h),
        ox = (W - s.w * k) / 2,
        oy = (H - s.h * k) / 2;
      const out: Record<string, Quad> = {};
      const on = s[key];
      if (typeof on === "object")
        for (const [name, q] of Object.entries(on))
          out[name] = q.map(([u, v]) => [ox + u * s.w * k, oy + v * s.h * k]) as Quad;
      return out;
    };
    /**
     * Stills fallback: the copy of beats 3–4 on the K3 and K4 stills and the journey's on the stills of the row,
     * boxed at its size there, faded by scroll.
     */
    const stillCopy = (s: number) => {
      const fmt = matchMedia(PORTRAIT_QUERY).matches ? "hp" : "pc",
        row = ROW_STILLS[fmt];
      const quads = { ...stillQuads("K0"), ...stillQuads("K3"), ...stillQuads("K4") };
      // the journey's copy shows with its still, until the next still of the row comes in; the lobby's the same way
      // with the lobby's stills (tahap 7)
      const journeyFade: Record<string, number> = {};
      for (const list of [row, LOBBY_STILLS[fmt], PLAQUE_STILLS[fmt]])
        list.forEach((k, i) => {
          const here = stillQuads(k),
            next = STILL_FADES[list[i + 1]],
            o = smoothstep(STILL_FADES[k][0], STILL_FADES[k][1], s) * (next ? 1 - smoothstep(next[0], next[1], s) : 1);
          Object.assign(quads, here);
          for (const n of Object.keys(here)) journeyFade[n] = o;
        });
      const sizes: Record<string, { w: number; h: number }> = {};
      for (const n of ["leaflet", "page", ...Object.keys(journeyFade)]) {
        const q = quads[n];
        if (q)
          sizes[n] = {
            w: Math.hypot(q[1][0] - q[0][0], q[1][1] - q[0][1]),
            h: Math.hypot(q[2][0] - q[0][0], q[2][1] - q[0][1]),
          };
      }
      const fade = {
        leaflet:
          smoothstep(STILL_COPY.leaflet[0], STILL_COPY.leaflet[1], s) *
          (1 - smoothstep(STILL_FADES.K4[0], STILL_FADES.K4[0] + 0.2, s)),
        page:
          smoothstep(STILL_COPY.page[0], STILL_COPY.page[1], s) *
          (1 - smoothstep(STILL_FADES["K4.1"][0], STILL_FADES["K4.1"][1], s)),
        ...journeyFade,
      };
      placeAnchors(el, quads, STILLS.aspect, quadMatrix3d, { fade, sizes });
    };
    let lastS = 0;
    const onScroll = () => {
      const s = readS(),
        p = s / TAKE_SCREENS;
      el.style.setProperty("--hero-out", smoothstep(HERO_OUT[0], HERO_OUT[1], s).toFixed(3));
      el.toggleAttribute("data-hero-gone", s >= HERO_OUT[1]);
      if (world && Math.abs(s - lastS) > JUMP_SCREENS) world.jump(p);
      else world?.setTarget(p);
      lastS = s;
      if (current === "stills") {
        for (const [k, [a, b]] of Object.entries(STILL_FADES))
          el.querySelector<HTMLElement>(`[data-still="${k}"]`)?.style.setProperty(
            "opacity",
            smoothstep(a, b, s).toFixed(3),
          );
        stillCopy(s);
      }
    };
    const onResize = () => {
      if (current === "stills") stillCopy(readS());
      else if (current !== "live") placeHero(el, STILLS);
      // turning the device changes the timeline and the stage's height under the same scroll
      onScroll();
    };
    addEventListener("scroll", onScroll, { passive: true });
    addEventListener("resize", onResize);
    onResize();

    // jump links for review (?k=K1) work without the world too
    const kq = params.get("k") as KeyName | null;
    if (kq && !params.has("shot")) scrollTo(0, scrollTopAt(keyP(kq)));

    const toStills = () => {
      if (disposed) return;
      abandoned = true;
      clearTimeout(bootTimer);
      clearInterval(hudTimer);
      world?.dispose();
      world = null;
      setLive(false);
      switchMode("stills");
      placeHero(el, STILLS);
      onScroll();
    };

    const gl = document.createElement("canvas").getContext("webgl2");
    if (!gl) {
      toStills();
    } else {
      gl.getExtension("WEBGL_lose_context")?.loseContext();
      // A slow phone or a stalled download gets the stills, at most BOOT_LIMIT_MS after the page was opened
      // (the scroll is locked until then): the visitor never waits on the loading bar longer than that.
      if (!params.has("shot") && !params.has("bake"))
        bootTimer = setTimeout(toStills, Math.max(0, BOOT_LIMIT_MS - performance.now()));
      const start = async () => {
        if (disposed || abandoned) return;
        performance.mark("take:start");
        setBar(BAR_START);
        try {
          worldMod = await import("@/world");
          if (disposed || abandoned) return;
          performance.mark("take:imported");
          setBar(BAR_IMPORTED);
          const aspect = worldMod.anchorAspects();
          world = await worldMod.mount(canvasHost, {
            fmt: (params.get("fmt") as "pc" | "hp" | null) ?? undefined,
            key: params.has("shot") ? (kq ?? undefined) : undefined,
            saver: params.has("hemat"),
            // the floating header covers the top of the stage; the top views of beats 3–4 keep clear of it
            safeTop: () => (document.querySelector("header")?.getBoundingClientRect().bottom ?? 0) + 8,
            noAO: params.has("noao"),
            shot: params.has("shot") || params.has("bake"),
            bake: params.has("bake") ? Number(params.get("bake")) : undefined,
            onFrame: (f) => {
              lastQuads = f.anchors;
              if (current !== "live" || !worldMod) return;
              const t = Math.min(1, (performance.now() - liveAt) / CROSSFADE_MS);
              let quads = f.anchors;
              if (t < 1) {
                const from = stillQuads();
                quads = Object.fromEntries(
                  Object.entries(f.anchors).map(([n, q]) => [n, q && from[n] ? worldMod!.mixQuad(from[n], q, t) : q]),
                );
              }
              placeAnchors(el, quads, aspect, worldMod.quadToMatrix3d, f);
            },
            onReady: () => {
              if (disposed || abandoned) return;
              performance.mark("take:live");
              clearTimeout(bootTimer);
              liveAt = performance.now();
              switchMode("live");
              setLive(true);
              world?.jump(params.has("shot") && kq ? keyP(kq) : readP());
            },
            onContextLost: (n) => {
              if (n >= 2) toStills();
            },
            onProgress: (share) => setBar(BAR_IMPORTED + (1 - BAR_IMPORTED) * share),
            onError: (error) => {
              if (disposed || abandoned) return;
              console.error(error);
              toStills();
            },
          });
          if (disposed || abandoned) {
            world.dispose();
            world = null;
            return;
          }
          performance.mark("take:mounted");
          world.setTarget(readP());
          if (dev) {
            const w = world;
            Object.assign(window, {
              __world: {
                world: w,
                keyP,
                ready: () => current === "live",
                aoDone: w.aoDone,
                aoExport: w.aoExport,
                aspect,
                anchors: () => lastQuads,
                stage: () => ({ w: stage.clientWidth, h: stage.clientHeight }),
                canvasPNG: () => w.canvas.toDataURL("image/png"),
              },
            });
          }
          if (params.has("hud")) {
            hudTimer = setInterval(() => {
              if (!world) return;
              const s = world.stats();
              setHud(
                `${s.key} · ${s.fps} fps · ${s.calls} draw call · ${(s.triangles / 1000).toFixed(1)} rb segitiga (dengan bayangan ${s.shadow.calls}) · dpr ${s.pixelRatio.toFixed(2)} · AO ${s.ao} · tokoh ${s.cast.ms} ms (maks ${s.cast.longest})`,
              );
            }, 500);
          }
        } catch (e) {
          console.error(e);
          if (!disposed) toStills();
        }
      };
      // Right after the first paint (the K0 still and the hero copy are on screen), prepare the world: the
      // visitor waits on the loading bar meanwhile, so waiting for an idle main thread only adds to it (measured
      // 10 Nov: up to 10 s on a slow phone). Cancelled on navigation.
      const firstPaint = requestAnimationFrame(() => void start());
      cancelStart = () => cancelAnimationFrame(firstPaint);
    }

    const io = new IntersectionObserver(([e]) => world?.setRunning(e.isIntersecting));
    io.observe(el);

    return () => {
      disposed = true;
      bootUnlock();
      cancelStart();
      clearTimeout(bootTimer);
      clearInterval(hudTimer);
      io.disconnect();
      removeEventListener("scroll", onScroll);
      removeEventListener("resize", onResize);
      world?.dispose();
    };
    // the label comes from the server and never changes for this take
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <section
      ref={root}
      id="beranda"
      aria-labelledby="h-hero"
      className="take"
      data-mode={mode}
      style={{ "--take": TAKE_SCROLL.pc, "--take-hp": TAKE_SCROLL.hp } as CSSProperties}
    >
      {MARKS.map(({ id, key, at, atHp }) => (
        <span
          key={id}
          id={id}
          className="take-mark"
          data-at={key}
          style={{ "--at": at.toFixed(3), "--at-hp": (atHp ?? at).toFixed(3) } as CSSProperties}
        />
      ))}
      <div className="take-stage" data-stage>
        {stills}
        <div ref={host} className="take-canvas" data-live={live || undefined} />
        {/* placed by the inline boot script before hydration, so their style differs from the server HTML */}
        <div data-anchor data-landscape="faceTop" data-portrait="face" className="hero-head" suppressHydrationWarning>
          {headline}
        </div>
        <div data-anchor data-landscape="faceBottom" data-portrait="" className="hero-body" suppressHydrationWarning>
          {body}
        </div>
        {copy}
        {/* Shown only while the scroll is locked (html[data-booting], stage.css); its share is set by setBar. */}
        <div
          ref={loader}
          className="take-loader"
          data-done={mode !== "boot" || undefined}
          role="progressbar"
          aria-label={loadingLabel}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={0}
          suppressHydrationWarning
        >
          <span className="take-loader-track" aria-hidden>
            <span className="take-loader-fill" />
          </span>
          <span className="take-loader-text" aria-hidden suppressHydrationWarning>
            {loadingLabel} 0%
          </span>
        </div>
        {hud && (
          <p className="font-mono fixed bottom-3 left-3 z-20 rounded-lg bg-white/90 px-3 py-2 text-xs text-ink">
            {hud}
          </p>
        )}
      </div>
    </section>
  );
}
