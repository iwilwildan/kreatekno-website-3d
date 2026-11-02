"use client";

import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import { clamp01, smoothstep } from "@/world/core/segments";
import { TAKE_SCREENS, keyP, type KeyName } from "@/world/takes/home/timing";
import { placeAnchors, placeHero, PORTRAIT_QUERY, type Quad, type StillsData } from "./placeHero";
import stillsData from "./stills.json";

const STILLS = stillsData as unknown as StillsData;
type Mode = "boot" | "live" | "stills";
type WorldModule = typeof import("@/world");
type World = Awaited<ReturnType<WorldModule["mount"]>>;

/** Screens of scroll over which the hero leaves (end of the K0 hold into the crane down). */
const HERO_OUT = [0.85, 1.25];
/**
 * Stills fallback: crossfade into K1 during the crane down, into K2 during the walk through the door, into K2.1
 * during the dolly in, into K2.2 at the whip pan.
 */
const STILL_FADES: Record<"K1" | "K2" | "K2.1" | "K2.2", [number, number]> = {
  K1: [1.2, 1.8],
  K2: [2.9, 4.0],
  "K2.1": [4.7, 5.3],
  "K2.2": [5.42, 5.62],
};
const CROSSFADE_MS = 500;

/**
 * The Home take: a tall section with a sticky stage. The K0 still is the first paint (LCP); the 3D world loads
 * after the page is visible and crossfades in. Without WebGL the stills crossfade with the scroll instead.
 * Reduced motion and no-JS get the stacked version from CSS (stage.css).
 */
export function HomeTake({ stills, headline, body }: { stills: ReactNode; headline: ReactNode; body: ReactNode }) {
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
    const stillQuads = () => {
      const portrait = matchMedia(PORTRAIT_QUERY).matches,
        s = portrait ? STILLS.hp : STILLS.pc;
      const W = stage.clientWidth,
        H = stage.clientHeight,
        k = Math.max(W / s.w, H / s.h),
        ox = (W - s.w * k) / 2,
        oy = (H - s.h * k) / 2;
      const out: Record<string, Quad> = {};
      for (const [name, q] of Object.entries(s.K0))
        out[name] = q.map(([u, v]) => [ox + u * s.w * k, oy + v * s.h * k]) as Quad;
      return out;
    };
    const onScroll = () => {
      const p = readP(),
        s = p * TAKE_SCREENS;
      el.style.setProperty("--hero-out", smoothstep(HERO_OUT[0], HERO_OUT[1], s).toFixed(3));
      el.toggleAttribute("data-hero-gone", s >= HERO_OUT[1]);
      world?.setTarget(p);
      if (current === "stills")
        for (const [k, [a, b]] of Object.entries(STILL_FADES))
          el.querySelector<HTMLElement>(`[data-still="${k}"]`)?.style.setProperty(
            "opacity",
            smoothstep(a, b, s).toFixed(3),
          );
    };
    const onResize = () => {
      if (current !== "live") placeHero(el, STILLS);
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
              placeAnchors(el, quads, aspect, worldMod.quadToMatrix3d);
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
        {hud && (
          <p className="font-mono fixed bottom-3 left-3 z-20 rounded-lg bg-white/90 px-3 py-2 text-xs text-ink">
            {hud}
          </p>
        )}
      </div>
    </section>
  );
}
