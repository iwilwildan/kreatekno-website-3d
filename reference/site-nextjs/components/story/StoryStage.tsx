"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import { useEffect, useRef, useState, useSyncExternalStore, type CSSProperties, type ReactNode } from "react";
import { preload } from "react-dom";
import { BEAT_COUNT, ENTER, EXIT, FILM_QUERY, lightVars, REST, TIMED, TOTAL, type Cam, type TimedBeat } from "./beats";
import { createReel, OPENING, trackFor } from "./footage";
import "./story.css";
import { cx } from "@/lib/cx";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const noop = () => () => {};
const hasZonesParam = () => new URLSearchParams(window.location.search).has("zones");

type Api = { fit: () => void; paint: (force?: boolean) => void };

/**
 * The Home story stage: one sticky frame, 18 beats scrubbed by scroll (ported from the prototype).
 * The beats themselves are server-rendered children; this component only drives them.
 * `?zones=1` adds the team's "Area video" tool.
 */
export function StoryStage({ children }: { children: ReactNode }) {
  const root = useRef<HTMLDivElement>(null);
  const api = useRef<Api | null>(null);
  const zonesTool = useSyncExternalStore(noop, hasZonesParam, () => false);
  const [zones, setZones] = useState(false);
  // the first footage frame is the first thing on screen: fetch it with the page
  OPENING.forEach(({ href, media }) => preload(href, { as: "image", fetchPriority: "high", media }));

  useGSAP(
    () => {
      const el = root.current;
      if (!el) return;
      const film = setupFilm(el);
      api.current = film.api;
      return () => {
        film.destroy();
        api.current = null;
      };
    },
    { scope: root },
  );

  useEffect(() => {
    api.current?.fit();
    api.current?.paint(true);
  }, [zones]);

  return (
    <div ref={root} className={cx("story", zones && "show-zones")}>
      <div className="probe" aria-hidden="true" />
      <div className="reel" style={{ "--screens": TOTAL + 1 } as CSSProperties}>
        <div className="stage">
          <div className="frame">
            {/* Placeholder for the one-take footage: sky + ground following the light of each keyframe */}
            <div className="scene" aria-hidden="true" />
            {/* The footage itself, where a clip exists (footage.ts) */}
            <canvas className="footage" aria-hidden="true" />
            {children}
            <div className="zones" aria-hidden="true">
              <div className="z-safe">
                <span>Zona aman (wajah, tangan, permukaan)</span>
              </div>
              <div className="z-list" />
            </div>
          </div>
          <ol className="rail" aria-hidden="true" />
          <div className="hud" aria-live="off" />
        </div>
      </div>
      {zonesTool && (
        <button type="button" className="zone-toggle" aria-pressed={zones} onClick={() => setZones((z) => !z)}>
          <i />
          <span>Area video</span>
          <span className="bt" />
        </button>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------------------------------------ */

type El = HTMLElement;
type Beat = TimedBeat & { el: El | null };

function setupFilm(root: El) {
  const $ = <T extends El = El>(s: string, r: ParentNode = root) => r.querySelector<T>(s)!;
  const $$ = <T extends El = El>(s: string, r: ParentNode = root) => Array.from(r.querySelectorAll<T>(s));

  const stage = $(".stage");
  const frame = $(".frame");
  const reel = $(".reel");
  const probe = $(".probe");
  const rail = $(".rail");
  const hud = $(".hud");
  const zList = $(".z-list");
  const canvas = $<HTMLCanvasElement>("canvas.footage");
  const pieces = $$(".pc");
  const beats: Beat[] = TIMED.map((b) => ({ ...b, el: b.id ? root.querySelector<El>(`#${b.id}`) : null }));
  const isZones = () => root.classList.contains("show-zones");
  const cleanups: (() => void)[] = [];
  const on = <K extends keyof WindowEventMap>(
    type: K,
    fn: (e: WindowEventMap[K]) => void,
    opts?: AddEventListenerOptions,
  ) => {
    window.addEventListener(type, fn, opts);
    cleanups.push(() => window.removeEventListener(type, fn, opts));
  };

  let filmOn = false;
  let lenis: Lenis | null = null;
  let st: ScrollTrigger | null = null;
  let time = 0;
  let lastBeat = -1;
  const portrait = () => window.matchMedia("(orientation: portrait)").matches;

  /* ---------- Zone boxes (team tool): one per prop ---------- */
  const zoneOf = new Map<El, El>();
  pieces.forEach((pc) => {
    const box = document.createElement("div");
    box.className = "z-box";
    box.dataset.beat = pc.closest<El>(".sf")?.dataset.beat;
    box.appendChild(document.createElement("span"));
    zList.appendChild(box);
    zoneOf.set(pc, box);
  });
  cleanups.push(() => zList.replaceChildren());

  /* ---------- Keep every piece readable: shift it inside the visible part of the frame ---------- */
  const pct = (v: number) => Math.round(v * 10) / 10;
  function fit() {
    if (!filmOn) return;
    const nav = document.querySelector("header");
    const sw = stage.clientWidth;
    const sh = stage.clientHeight;
    const fw = frame.offsetWidth;
    const fh = frame.offsetHeight;
    const ox = (fw - sw) / 2;
    const oy = (fh - sh) / 2;
    const ps = getComputedStyle(probe);
    const padL = Math.max(16, parseFloat(ps.paddingLeft) || 0);
    const padR = Math.max(16, parseFloat(ps.paddingRight) || 0);
    const top = (nav ? nav.getBoundingClientRect().bottom : 0) + 12;
    const bottom = sh - 14 - (parseFloat(ps.paddingBottom) || 0);
    frame.style.setProperty("--crop-x", `${ox}px`);
    frame.style.setProperty("--vis-w", `${sw}px`);
    const avail = sw - padL - padR;
    const bottomVar = portrait() ? "--mb" : "--db";

    // 1) measure every piece at its frame position (narrowed to the visible width when the frame is cropped)
    const m = pieces.map((pc) => {
      pc.style.setProperty("--cx", "0px");
      pc.style.setProperty("--cy", "0px");
      pc.style.removeProperty("--wmax");
      if (!("fullX" in pc.dataset) && pc.offsetWidth > avail) pc.style.setProperty("--wmax", `${avail}px`);
      return {
        pc,
        x: pc.offsetLeft - ox,
        y: pc.offsetTop - oy,
        w: pc.offsetWidth,
        h: pc.offsetHeight,
        sf: pc.closest(".sf"),
        bottom: pc.style.getPropertyValue(bottomVar) !== "",
        sy: 0,
        dx: 0,
        dy: 0,
      };
    });
    // 2) bottom-anchored pieces of one beat stack upwards in DOM order (the copy cards on phones);
    //    then horizontal: each piece on its own; vertical: the pieces of one beat move together
    const groups = new Map<Element | null, typeof m>();
    m.forEach((r) => {
      if (!groups.has(r.sf)) groups.set(r.sf, []);
      groups.get(r.sf)!.push(r);
    });
    groups.forEach((list) => {
      let acc = 0;
      list
        .filter((r) => r.bottom)
        .reverse()
        .forEach((r) => {
          r.sy = -acc;
          r.y -= acc;
          acc += r.h + 10;
        });
      const gTop = Math.min(...list.map((r) => r.y));
      const gBot = Math.max(...list.map((r) => r.y + r.h));
      let gdy = 0;
      if (gBot - gTop > bottom - top || gTop < top) gdy = top - gTop;
      else if (gBot > bottom) gdy = bottom - gBot;
      list.forEach((r) => {
        let dx = 0;
        if (!("fullX" in r.pc.dataset)) {
          if (r.w >= avail || r.x < padL) dx = padL - r.x;
          else if (r.x + r.w > sw - padR) dx = sw - padR - (r.x + r.w);
        }
        r.dx = dx;
        r.dy = gdy;
      });
    });
    m.forEach(({ pc, w, h, sy, dx, dy }) => {
      pc.style.setProperty("--cx", `${dx}px`);
      pc.style.setProperty("--cy", `${sy + dy}px`);
      const shifted = Math.abs(dx) > 1 || Math.abs(dy) > 1;
      const L = (pc.offsetLeft / fw) * 100;
      const T = (pc.offsetTop / fh) * 100;
      const W = (w / fw) * 100;
      const H = (h / fh) * 100;
      const z = zoneOf.get(pc)!;
      z.style.cssText = `left:${L}%;top:${T}%;width:${W}%;height:${H}%`;
      z.classList.toggle("shifted", shifted);
      z.firstChild!.textContent = `${pc.dataset.prop} · x ${pct(L)}–${pct(L + W)}% · y ${pct(T)}–${pct(T + H)}%${shifted ? " · digeser agar terbaca" : ""}`;
    });
  }

  /* ---------- Rail, live beats, zones readout ---------- */
  const railBeats = beats.filter((b) => b.el && b.n !== "13");
  const beatAt = (t: number) => {
    let i = 0;
    beats.forEach((b, k) => {
      if (t >= b.t0 - 1e-6) i = k;
    });
    return i;
  };
  function paint(force = false) {
    if (!filmOn) return;
    const i = beatAt(time);
    const b = beats[i];
    // a beat's props take clicks only while they stand in the frame
    beats.forEach((x) => {
      if (!x.el) return;
      x.el.classList.toggle("live", time >= x.t1 - 0.04 && time <= x.t2 + 0.04);
    });
    const ri = railBeats.reduce((acc, x, k) => (time >= x.t1 - 0.1 ? k : acc), 0);
    Array.from(rail.children).forEach((li, k) => {
      li.classList.toggle("on", k === ri);
      li.classList.toggle("done", k < ri);
    });
    const bt = document.querySelector(".zone-toggle .bt");
    const label = `Beat ${b.n} · ${b.name}`;
    if (bt) bt.textContent = label;
    if (i !== lastBeat || force) {
      lastBeat = i;
      zoneOf.forEach((z) => z.classList.toggle("on", z.dataset.beat === b.n));
    }
    if (!isZones()) return;
    const moving = time < b.t1 && b.move > 0;
    const p = moving ? (time - b.t0) / b.move : 1;
    const phase = moving
      ? `Gerak kamera ${Math.round(p * 100)}%`
      : `Tahan di ${b.k}${b.el ? " · copy tampil" : " · tanpa copy"}${i === 0 ? " · tampilan pertama saat halaman dibuka" : ""}`;
    const port = portrait();
    const cropX = Math.round((frame.offsetWidth - stage.clientWidth) / 2);
    const cropY = Math.round((frame.offsetHeight - stage.clientHeight) / 2);
    const line = (text: string, cls?: string) => {
      const s = document.createElement("span");
      if (cls) s.className = cls;
      s.textContent = text;
      return s;
    };
    const title = document.createElement("b");
    title.textContent = `${label} (${BEAT_COUNT} beat)`;
    const bar = document.createElement("div");
    bar.className = "bar";
    const fill = document.createElement("i");
    fill.style.width = `${Math.round(p * 100)}%`;
    bar.appendChild(fill);
    hud.replaceChildren(
      title,
      line(b.move ? `${b.cam} · ${b.from} → ${b.k}` : `${b.cam} · ${b.k}`),
      bar,
      line(phase),
      line(b.kf, "dim"),
      ...(port && b.phone ? [line(b.phone, "dim")] : []),
      ...(!port && b.desk ? [line(b.desk, "dim")] : []),
      line(
        `Video ${port ? "9:16" : "16:9"} · ${frame.offsetWidth}×${frame.offsetHeight} px · terpotong ${
          cropX > 0 ? `${cropX} px kiri dan kanan` : `${cropY} px atas dan bawah`
        }`,
        "dim",
      ),
    );
  }

  /* ---------- Props move with the camera ---------- */
  type Vars = gsap.TweenVars;
  const FW = () => frame.offsetWidth;
  const FH = () => frame.offsetHeight;
  const blurs = (pc: El) => pc.dataset.blur !== "0";
  const side = (pc: El) => (pc.offsetLeft + pc.offsetWidth / 2 - FW() / 2 >= 0 ? 1 : -1);
  const sideY = (pc: El) => (pc.offsetTop + pc.offsetHeight / 2 - FH() / 2 >= 0 ? 1 : -1);
  function rest(pc: El): Vars {
    const r = REST[pc.dataset.kind ?? ""] ?? {};
    const v: Vars = {
      x: 0,
      y: 0,
      scale: 1,
      rotationX: r.rx ?? 0,
      rotationY: r.ry ?? 0,
      rotation: r.rz ?? 0,
      transformOrigin: `${r.ox ?? "50%"} ${r.oy ?? "50%"}`,
    };
    if (blurs(pc)) v.filter = "blur(0px)";
    return v;
  }
  function cam(pc: El, type: Cam, dir: "in" | "out"): Vars {
    const R = rest(pc);
    const rx = R.rotationX as number;
    const ry = R.rotationY as number;
    const d = Number(pc.dataset.depth ?? 1);
    const blur = (px: number) => (blurs(pc) ? { filter: `blur(${px}px)` } : {});
    const v = (obj: Vars) => ({ ...R, ...obj });
    switch (type) {
      case "craneDown": // camera comes down to eye level: the prop rises into place, first seen from above
        return dir === "in"
          ? v({ y: () => FH() * 0.42, rotationX: rx - 26, scale: 0.8, ...blur(2) })
          : v({ y: () => -FH() * 0.55, rotationX: rx + 18, ...blur(3) });
      case "craneUp": // camera rises: the ground and its props sink out of the frame
        return dir === "in"
          ? v({ y: () => FH() * 0.3, ...blur(2) })
          : v({ y: () => FH() * 0.85, rotationX: rx + 16, ...blur(3) });
      case "throughIn": // camera flies forward through a door or window
        return dir === "in"
          ? v({ scale: 0.55, y: () => -FH() * 0.04, ...blur(5) })
          : v({ scale: 2.3, x: () => side(pc) * FW() * 0.55, y: () => sideY(pc) * FH() * 0.22, ...blur(12) });
      case "throughOut": // camera backs out through a door or window
        return dir === "in"
          ? v({ scale: 1.9, x: () => side(pc) * FW() * 0.35, ...blur(10) })
          : v({ scale: 0.5, x: () => -side(pc) * FW() * 0.1, ...blur(4) });
      case "dollyIn":
        return dir === "in"
          ? v({ scale: 0.74, ...blur(3) })
          : v({ scale: 1.75, x: () => side(pc) * FW() * 0.45, y: () => sideY(pc) * FH() * 0.2, ...blur(10) });
      case "dollyOut": // camera backs away: the prop comes from behind the camera and settles smaller
        return dir === "in"
          ? v({ scale: 1.45, y: () => sideY(pc) * FH() * 0.12, ...blur(6) })
          : v({ scale: 0.6, ...blur(3) });
      case "track": // the beat's own action moves the props (shop panels); the prop itself stays put
        return v({});
      case "arc": // camera orbits around the prop
        return dir === "in"
          ? v({ x: () => FW() * 0.3 * d, rotationY: ry - 38, ...blur(3) })
          : v({ x: () => -FW() * 0.3 * d, rotationY: ry + 38, ...blur(3) });
      case "truckRight": // camera slides right: the scene slides left, nearer props faster
        return v({ x: () => (dir === "in" ? 1 : -1) * FW() * 0.85 * d, ...blur(4) });
      case "truckLeft":
        return v({ x: () => (dir === "in" ? -1 : 1) * FW() * 0.85 * d, ...blur(4) });
    }
  }

  /* Small actions inside a shot, timed to the end of the camera move */
  const ACT: Record<string, (tl: gsap.core.Timeline, sf: El, b: Beat, port: boolean) => void> = {
    // Heru opens the binder: the page swings over from the rings
    "use-case": (tl, sf, b) => {
      tl.fromTo(
        $(".page", sf),
        { rotationY: -100, transformOrigin: "0% 50%", transformPerspective: 1400 },
        { rotationY: 0, duration: b.move * 0.5, ease: "power2.out", immediateRender: false },
        b.t1 - b.move * 0.5,
      );
    },
    // Truck right along the shophouses: the row of second-floor panels slides past and slows down at every
    // panel that carries copy. Desktop: the fruit shop's panel (title) starts on the right as in K5a and the
    // electronics shop's panel (CTA) ends on the left as in K5. Phone: each panel stops in the middle.
    "cara-kerja": (tl, sf, b, port) => {
      const track = $(".shops-track", sf);
      const stops = $$(".shop:not(.blank)", sf);
      const last = stops.length - 1;
      // track offset that puts a panel's left edge at a share of the visible width
      const at = (p: El, share: number | "mid") => () => {
        const sw = stage.clientWidth;
        const ox = (FW() - sw) / 2;
        const left = share === "mid" ? (sw - p.offsetWidth) / 2 : sw * share;
        return ox + left - p.offsetLeft;
      };
      const seq = port
        ? [at(stops[0], 0.74), ...stops.map((p) => at(p, "mid"))]
        : [at(stops[0], 0.58), ...stops.slice(1, last).map((p) => at(p, "mid")), at(stops[last], 0.08)];
      // the first panel comes in with the end of beat 5a, then one eased segment per stop
      const fx = { immediateRender: false };
      tl.fromTo(
        track,
        { x: () => seq[0]() + stage.clientWidth * 0.3 },
        { x: seq[0], duration: 0.5, ease: "power1.out", ...fx },
        b.t0 - 0.5,
      );
      const seg = b.move / (seq.length - 1);
      seq.slice(1).forEach((x, k) => {
        tl.fromTo(track, { x: seq[k] }, { x, duration: seg, ease: "power2.inOut", ...fx }, b.t0 + seg * k);
      });
    },
  };

  /* ---------- Jump links: scroll to the moment a beat's props have settled ---------- */
  function scrollToBeat(b: Beat, smooth: boolean) {
    if (!st) return false;
    // the hero opens on its hold and the shop panels are read along the truck, so both land at their start
    const t = !b.move || b.tail === "track" ? b.t0 : b.t1 + Math.min(0.15, b.hold * 0.3);
    const y = st.start + (t / TOTAL) * (st.end - st.start);
    if (lenis) lenis.scrollTo(y, smooth ? { duration: 1.6 } : { immediate: true });
    else window.scrollTo({ top: y, behavior: smooth ? "smooth" : "auto" });
    return true;
  }
  const beatForHash = (hash: string) => beats.find((b) => b.id && `#${b.id}` === hash);

  // Capture phase, so Next's <Link> sees defaultPrevented and doesn't navigate to the hash.
  on(
    "click",
    (e) => {
      if (!filmOn || e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const a = (e.target as Element).closest?.("a");
      if (!a || (a.target && a.target !== "_self")) return;
      const url = new URL(a.href, window.location.href);
      if (url.origin !== window.location.origin || url.pathname !== window.location.pathname) return;
      const b = url.hash ? beatForHash(url.hash) : beats[0];
      if (b && scrollToBeat(b, true)) e.preventDefault();
    },
    { capture: true },
  );
  // keyboard: tabbing into copy that is off screen brings its beat on screen
  const onFocus = (e: FocusEvent) => {
    const sf = (e.target as Element).closest?.<El>(".sf");
    const b = sf && beats.find((x) => x.el === sf);
    if (filmOn && b && !sf.classList.contains("live")) scrollToBeat(b, false);
  };
  root.addEventListener("focusin", onFocus);
  cleanups.push(() => root.removeEventListener("focusin", onFocus));

  /* ---------- The timeline, one per orientation ---------- */
  const mm = gsap.matchMedia();
  mm.add(
    { port: `${FILM_QUERY} and (orientation: portrait)`, land: `${FILM_QUERY} and (orientation: landscape)` },
    (ctx) => {
      const port = !!ctx.conditions?.port;
      if (!port && !ctx.conditions?.land) return;
      filmOn = true;

      // smooth wheel scrolling (touch keeps the native feel), synced to ScrollTrigger
      lenis = new Lenis({ lerp: 0.09, smoothWheel: true });
      lenis.on("scroll", ScrollTrigger.update);
      const raf = (t: number) => lenis?.raf(t * 1000);
      gsap.ticker.add(raf);
      gsap.ticker.lagSmoothing(0);

      rail.replaceChildren(
        ...railBeats.map(() => document.createElement("li").appendChild(document.createElement("i")).parentElement!),
      );

      const tl = gsap.timeline({ defaults: { ease: "none" } });
      // the page opens on K0 with the hero copy already on the billboard
      gsap.set(frame, lightVars(beats[0].k));
      beats.forEach((b, i) => {
        // the light of the footage follows the camera from keyframe to keyframe
        if (b.move)
          tl.fromTo(
            frame,
            lightVars(b.from),
            { ...lightVars(b.k), duration: b.move, ease: "power1.inOut", immediateRender: false },
            b.t0,
          );
        if (!b.el) return;
        const next = beats[i + 1];
        $$(".pc", b.el).forEach((pc) => {
          const R = rest(pc);
          if (!b.move) {
            gsap.set(pc, { ...R, opacity: 1 });
          } else if (b.tail === "track") {
            // fades in with the end of the previous move; the beat's action slides it along
            gsap.set(pc, { ...R, opacity: 0 });
            tl.fromTo(pc, { opacity: 0 }, { opacity: 1, duration: 0.25, immediateRender: false }, b.t0 - 0.5);
          } else {
            const d = b.move * ENTER;
            const at = b.t1 - d;
            const from = cam(pc, b.tail, "in");
            gsap.set(pc, { ...from, opacity: 0 });
            tl.fromTo(pc, from, { ...R, duration: d, ease: "power2.out", immediateRender: false }, at).fromTo(
              pc,
              { opacity: 0 },
              { opacity: 1, duration: d * 0.4, immediateRender: false },
              at,
            );
          }
          // a prop printed on a surface of the footage rides on that surface's measured track
          const ride = next && trackFor(next.k, port ? pc.dataset.trackPhone : pc.dataset.trackDesk, port);
          if (next && ride) {
            const per = next.move / (ride.frames - 1);
            tl.to(
              pc,
              {
                keyframes: ride.track.slice(1).map(([f, dx, dy], k) => ({
                  x: () => (dx * FW()) / 100,
                  y: () => (dy * FH()) / 100,
                  duration: (f - ride.track[k][0]) * per,
                  ease: "none",
                })),
                immediateRender: false,
              },
              next.t0,
            );
            // off the frame with its surface: gone before the footage hands over to the next shot
            tl.set(pc, { opacity: 0 }, next.t0 + ride.track[ride.track.length - 1][0] * per);
          } else if (next) {
            const d = Math.max(0.3, next.move * EXIT);
            tl.fromTo(
              pc,
              R,
              { ...cam(pc, next.lead, "out"), duration: d, ease: "power2.in", immediateRender: false },
              b.t2,
            ).fromTo(pc, { opacity: 1 }, { opacity: 0, duration: d * 0.4, immediateRender: false }, b.t2 + d * 0.6);
          }
        });
        if (b.id && ACT[b.id]) ACT[b.id](tl, b.el, b, port);
      });
      tl.set({}, {}, TOTAL);
      const footage = createReel(canvas, beats, port, (on) => root.classList.toggle("footage-on", on));
      tl.eventCallback("onUpdate", () => {
        time = tl.time();
        footage.draw(time);
        paint();
      });
      st = ScrollTrigger.create({
        trigger: reel,
        start: "top top",
        end: "bottom bottom",
        scrub: 0.45,
        animation: tl,
        invalidateOnRefresh: true,
      });

      fit();
      time = tl.time();
      footage.draw(time);
      paint(true);

      // arriving with a hash (/#layanan from another page): go straight to that beat
      const target = beatForHash(window.location.hash);
      if (target) requestAnimationFrame(() => scrollToBeat(target, false));

      return () => {
        footage.destroy();
        gsap.ticker.remove(raf);
        gsap.ticker.lagSmoothing(500, 33);
        lenis?.destroy();
        lenis = null;
        st = null;
        filmOn = false;
        rail.replaceChildren();
        beats.forEach((b) => b.el?.classList.remove("live"));
        pieces.forEach((pc) => ["--cx", "--cy", "--wmax"].forEach((p) => pc.style.removeProperty(p)));
      };
    },
  );

  let rz = 0;
  on("resize", () => {
    cancelAnimationFrame(rz);
    rz = requestAnimationFrame(() => {
      fit();
      paint(true);
    });
  });
  const refresh = () => {
    fit();
    ScrollTrigger.refresh();
  };
  on("story:refit" as keyof WindowEventMap, () => fit());
  on("load", refresh);
  let alive = true;
  document.fonts?.ready.then(() => alive && refresh());
  cleanups.push(() => {
    alive = false;
    cancelAnimationFrame(rz);
  });

  return {
    api: { fit, paint } satisfies Api,
    destroy() {
      mm.revert();
      cleanups.forEach((c) => c());
    },
  };
}
