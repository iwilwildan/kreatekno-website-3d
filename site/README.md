# Kreatekno website (Next.js app)

The new kreatekno.com, rebuilt with a Three.js world for the Home story. Plan, decisions and stage status live in `../PLAN.md`; the brief, copy rules and story in `../docs/`.

## Run it

```bash
npm ci
cp .env.example .env.local   # then fill in the values
npm run dev                  # http://localhost:3000
```

| Script                            | What it does                                                                |
| --------------------------------- | --------------------------------------------------------------------------- |
| `npm run dev`                     | Dev server (Turbopack)                                                      |
| `npm run build`                   | Production build. Every page must prerender as static HTML for both locales |
| `npm run lint`                    | ESLint (Next.js config)                                                     |
| `npm run typecheck`               | Generates route types, then runs `tsc`                                      |
| `npm run format` / `format:check` | Prettier, with Tailwind class sorting                                       |

## How it fits together

- **Next.js 16.4** with Cache Components and Partial Prefetching (`next.config.ts`). `ensureStatic = "navigation"` in `app/[locale]/layout.tsx` fails the build if any page stops being static. Before writing new code, read the bundled docs in `node_modules/next/dist/docs/` (see `AGENTS.md`).
- **Routing and i18n (next-intl).** `i18n/routing.ts` defines the locales, `localePrefix: "as-needed"` (Indonesian at `/`, English at `/en`) and the translated slugs (`/solusi` ↔ `/en/solutions`, `/artikel` ↔ `/en/articles`, `/tentang` ↔ `/en/about`, `/kebijakan-privasi` ↔ `/en/privacy-policy`). `proxy.ts` runs the next-intl middleware. `i18n/request.ts` reads the locale from `next/root-params`, so pages don't need `setRequestLocale`; route handlers such as `opengraph-image` pass the locale explicitly. Use the helpers from `i18n/navigation.ts`, never `next/link`, for internal links.
- **Copy.** All UI text is in `messages/id.json` and `messages/en.json`. `global.d.ts` types the keys from `id.json`, so a missing key fails the typecheck. `home.*` holds the copy of all story beats, from the team document.
- **Tokens.** `styles/globals.css` holds the Tailwind v4 `@theme`. Tailwind's default palette is switched off, so only brand colours exist (`bg-navy`, `text-purple`, `text-cyan`…). Fonts are Bricolage Grotesque (`font-display`) and Plus Jakarta Sans (`font-body`), loaded with `next/font`.
- **WhatsApp.** `components/layout/WhatsAppButton.tsx` builds the `wa.me` link from `NEXT_PUBLIC_WA_NUMBER` and the prefilled message for the current locale. Every button has a `section` prop, and each click sends a `whatsapp_click` event to Vercel Analytics.
- **SEO.** `lib/seo.ts` builds the per-page metadata (canonical, hreflang, Open Graph) and the `Organization` + `ProfessionalService` JSON-LD. `app/sitemap.ts`, `app/robots.ts` (preview deploys are `disallow`) and `app/[locale]/opengraph-image.tsx` complete it.
- **Business facts** (address, socials) are in `lib/site.ts`, with TODOs until Kreatekno sends them.

## Home and the 3D world

- `components/home/HomeStage.tsx` (server) renders the copy and the keyframe stills; `HomeTake.tsx` (client) is the tall section with the sticky stage. The K0 still is the first paint; `world/` is loaded with `import()` once the page is idle and crossfades in. Without WebGL the stills crossfade with the scroll; with reduced motion or without JavaScript the take is stacked (`stage.css`).
- The hero copy sits on the billboard: an inline script (`placeHero.ts`) places it on the K0 still before hydration, then the world reports the billboard's screen quad every frame and the copy follows with `matrix3d`.
- `world/` (three 0.186.1, TypeScript): `core/` (kit, AO, light, anchors, segments, take), `sets/` (street, company front, sky), `cast/` (grey stand-ins until tahap 3), `takes/home/` (solved data from the keyframes, timing, camera).
- Baked assets come from `../tools` and must be regenerated when a set or a camera changes: `public/world/ao/*.png` (`npm run bake-ao`), then `public/stills/` and `components/home/stills.json` (`npm run stills`). Missing AO maps are computed in the browser as a fallback.
- Dev URL flags: `?hud`, `?k=K0|K1|K2`, `?fmt=pc|hp`, `?hemat`, `?noao`, `?shot`, `?bake=<layout step>`; with any of them `window.__world` is exposed.

## Status

Tahap 2 (engine 3D + beat 1–2). Solusi, Artikel, Tentang and Kebijakan Privasi are placeholders.
