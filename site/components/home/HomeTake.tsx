"use client";

import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import { clamp01, smoothstep } from "@/world/core/segments";
import { SEG, TAKE_SCREENS, keyP, type KeyName } from "@/world/takes/home/timing";
import { segmentStart } from "@/world/core/segments";
import { placeAnchors, placeHero, PORTRAIT_QUERY, quadMatrix3d, type Quad, type StillsData } from "./placeHero";
import stillsData from "./stills.json";

const STILLS = stillsData as unknown as StillsData;
type Mode = "boot" | "live" | "stills";
type WorldModule = typeof import("@/world");
type World = Awaited<ReturnType<WorldModule["mount"]>>;

/** Screens of scroll over which the hero leaves (end of the K0 hold into the crane down). */
const HERO_OUT = [0.85, 1.25];
/**
 * Stills fallback: crossfade into K1 during the crane down, into K2 during the walk through the door, into K2.1
 * during the dolly in, into K2.2 at the whip pan, into K3 at the end of the tilt down, into K4 during the truck.
 */
const STILL_FADES: Record<string, [number, number]> = {
  K1: [1.2, 1.8],
  K2: [2.9, 4.0],
  "K2.1": [4.7, 5.3],
  "K2.2": [5.42, 5.62],
  K3: [8.2, 8.6],
  K4: [9.85, 10.3],
  // beats 5a–5b: K4.1 as the camera tilts up, K5a.1 out of the door, then each stop along the row (on 9:16 the
  // "b" stills are the second panel of a hold; on 16:9 they repeat the hold's still, so nothing changes there)
  "K4.1": [12.3, 12.9],
  "K5a.1": [13.9, 14.5],
  "K5a.2": [14.8, 15.2],
  "K5a.2b": [15.4, 15.58],
  "K5a.3": [15.9, 16.3],
  "K5a.3b": [16.5, 16.68],
  "K5a.4": [17.0, 17.4],
  "K5a.4b": [17.6, 17.78],
  "K5a.6": [18.1, 18.5],
};
/** Stills of the row in order, per format: the journey's copy on one still fades out as the next comes in. */
const ROW_STILLS = {
  pc: ["K5a.2", "K5a.3", "K5a.4", "K5a.6"],
  hp: ["K5a.2", "K5a.2b", "K5a.3", "K5a.3b", "K5a.4", "K5a.4b", "K5a.6"],
};
/** Stills fallback: the leaflet's copy comes in on the K3 still and goes as the K4 still comes; the page's after. */
const STILL_COPY = { leaflet: [8.6, 8.9], page: [10.3, 10.6] } as const;
/** A scroll step longer than this (screens; a jump link, the End key, the scrollbar) cuts instead of flying. */
const JUMP_SCREENS = 2;
/** Jump marks: menu links to sections told inside the take land on their keyframe's hold (its middle). */
const MARKS: { id: string; key: KeyName; at?: number }[] = [
  { id: "layanan", key: "K3" },
  // "Cara kerja" lands where the camera arrives on the first panel (on 9:16 the hold's middle is between panels)
  { id: "cara-kerja", key: "K5a.2", at: 0.06 },
];
const CROSSFADE_MS = 500;
/** Screens where the hold on keyframe k starts. */
const holdStart = (k: KeyName) =>
  segmentStart(
    SEG,
    SEG.findIndex((g) => g.type === "hold" && g.from === k),
  );

/**
 * The Home take: a tall section with a sticky stage. The K0 still is the first paint (LCP); the 3D world loads
 * after the page is visible and crossfades in. Without WebGL the stills crossfade with the scroll instead.
 * Reduced motion and no-JS get the stacked version from CSS (stage.css).
 */
export function HomeTake({
  stills,
  headline,
  body,
  copy,
}: {
  stills: ReactNode;
  headline: ReactNode;
  body: ReactNode;
  /** Copy on the props of beats 3–4 (leaflet, binder), placed and faded by the world. */
  copy?: ReactNode;
}) {
  const root = useRef<HTMLElement>(null);
  const host = useRef<HTMLDivElement>(null);
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
      liveAt = 0,
      lastQuads: Record<string, Quad | null> = {};

    const switchMode = (m: Mode) => {
      current = m;
      setMode(m);
    };
    const readP = () => {
      const r = el.getBoundingClientRect(),
        max = r.height - stage.clientHeight;
      return max > 0 ? clamp01(-r.top / max) : 0;
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
      // the journey's copy shows with its still, until the next still of the row comes in
      const journeyFade: Record<string, number> = {};
      row.forEach((k, i) => {
        const here = stillQuads(k),
          next = STILL_FADES[row[i + 1]],
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
      const p = readP(),
        s = p * TAKE_SCREENS;
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
      if (current === "stills") stillCopy(readP() * TAKE_SCREENS);
      else if (current !== "live") placeHero(el, STILLS);
    };
    addEventListener("scroll", onScroll, { passive: true });
    addEventListener("resize", onResize);
    onResize();
    onScroll();

    // jump links for review (?k=K1) work without the world too
    const kq = params.get("k") as KeyName | null;
    if (kq && !params.has("shot")) scrollTo(0, el.offsetTop + keyP(kq) * (el.offsetHeight - stage.clientHeight));

    const toStills = () => {
      world?.dispose();
      world = null;
      switchMode("stills");
      placeHero(el, STILLS);
      onScroll();
    };

    const gl = document.createElement("canvas").getContext("webgl2");
    if (!gl) {
      toStills();
    } else {
      const start = async () => {
        try {
          worldMod = await import("@/world");
          if (disposed) return;
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
              if (disposed) return;
              liveAt = performance.now();
              switchMode("live");
              setLive(true);
              world?.jump(params.has("shot") && kq ? keyP(kq) : readP());
            },
            onContextLost: (n) => {
              if (n >= 2) toStills();
            },
          });
          if (disposed) {
            world.dispose();
            return;
          }
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
            const id = setInterval(() => {
              if (!world) return clearInterval(id);
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
      // after the first paint and the LCP image, when the main thread is idle
      const idle = (cb: () => void) =>
        "requestIdleCallback" in window ? requestIdleCallback(cb, { timeout: 2000 }) : setTimeout(cb, 300);
      if (document.readyState === "complete") idle(start);
      else addEventListener("load", () => idle(start), { once: true });
    }

    const io = new IntersectionObserver(([e]) => world?.setRunning(e.isIntersecting));
    io.observe(el);

    return () => {
      disposed = true;
      io.disconnect();
      removeEventListener("scroll", onScroll);
      removeEventListener("resize", onResize);
      world?.dispose();
    };
  }, []);

  return (
    <section
      ref={root}
      id="beranda"
      aria-labelledby="h-hero"
      className="take"
      data-mode={mode}
      style={{ "--take": TAKE_SCREENS } as CSSProperties}
    >
      {MARKS.map(({ id, key, at }) => (
        <span
          key={id}
          id={id}
          className="take-mark"
          data-at={key}
          style={{ "--at": (at != null ? holdStart(key) + at : keyP(key) * TAKE_SCREENS).toFixed(3) } as CSSProperties}
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
        {hud && (
          <p className="font-mono fixed bottom-3 left-3 z-20 rounded-lg bg-white/90 px-3 py-2 text-xs text-ink">
            {hud}
          </p>
        )}
      </div>
    </section>
  );
}
