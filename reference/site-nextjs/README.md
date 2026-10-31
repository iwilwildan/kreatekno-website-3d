# Kreatekno website (Next.js app)

The new kreatekno.com. What the site says lives in `../SITE-BRIEF.md` and `../STORY-STAGE.md`, the copy in `../COPY.md`, the tech choices in `../STACK.md`, and the milestones in `../PLAN.md`.

## Run it

```bash
npm install
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

- **Next.js 16** with Cache Components and Partial Prefetching (`next.config.ts`). Before writing new code, read the bundled docs in `node_modules/next/dist/docs/` (see `AGENTS.md`), because this version differs from older Next.js.
- **Routing and i18n (next-intl).** `i18n/routing.ts` defines the locales, `localePrefix: "as-needed"` (Indonesian at `/`, English at `/en`) and the translated slugs. `proxy.ts` (the Next 16 name for middleware) rewrites `/portofolio` to `/id/portofolio` internally. `i18n/request.ts` reads the locale from `next/root-params`, so pages don't need `setRequestLocale`. Use `Link`, `getPathname` and the other helpers from `i18n/navigation.ts`, never `next/link`, for internal links.
- **Copy.** All UI text is in `messages/id.json` and `messages/en.json`. `global.d.ts` types the keys from `id.json`, so a missing key fails the typecheck.
- **Tokens.** `styles/globals.css` holds the Tailwind v4 `@theme`, ported from the prototype's `:root`. Tailwind's default palette is switched off, so only brand colours exist (`bg-navy`, `text-purple`, `text-cyan`…). Fonts are Bricolage Grotesque (`font-display`) and Plus Jakarta Sans (`font-body`), loaded with `next/font`.
- **WhatsApp.** `components/layout/WhatsAppButton.tsx` builds the `wa.me` link from `NEXT_PUBLIC_WA_NUMBER` and the prefilled message for the current locale. Every button has a `section` prop, and each click sends a `whatsapp_click` event to Vercel Analytics.
- **SEO.** `lib/seo.ts` builds the per-page metadata (canonical, hreflang, Open Graph) and the `Organization` + `ProfessionalService` JSON-LD. `app/sitemap.ts`, `app/robots.ts` (preview deploys are `disallow`) and `app/[locale]/opengraph-image.tsx` complete it.
- **Business facts** (address, socials) are in `lib/site.ts`, with TODOs until Kreatekno sends them.

## Home story stage

Home is one sticky stage with 16 beats, ported from `../prototype/home.src.html` (see `../STORY-STAGE.md`).

- `components/story/HomeStory.tsx`: the beats and their props, rendered on the server. Each `<Prop>` has its desktop (16:9) and phone (9:16) position in % of the frame.
- `components/story/StoryStage.tsx`: the client engine. A GSAP timeline is scrubbed by scroll (one per orientation), with Lenis smooth wheel scrolling, the fit pass that keeps props inside the visible frame, the progress rail and in-page jump links (`/#layanan`).
- `components/story/beats.ts`: timing, light per keyframe and rest poses.
- `components/story/footage.ts`: the footage clips (WebP image sequences in `public/footage/`, drawn on a canvas under the props and scrubbed by the timeline) and the measured tracks that props printed on a moving surface follow. Steps without a clip keep the placeholder sky and ground.
- `components/story/story.css`: the prototype's CSS, scoped under `.story`. With reduced motion or without JavaScript the beats stack as plain sections.
- Add `?zones=1` to the URL for the video team's "Area video" tool (safe zone, prop boxes, beat readout).

## Status

M4 scaffold done, M5 Home ported. Portofolio, Artikel, Tentang and Kebijakan Privasi are placeholders until M7.
