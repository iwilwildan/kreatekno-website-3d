# Kreatekno Website: Tech Stack

_Last updated: 2026-10-21. Versions are the latest on npm as of 2026-10-14; the scaffold (2026-10-21) installed Next.js 16.4.2, React 19.3, next-intl 4.14.9, GSAP 3.15, Lenis 1.3.27. `site/package.json` is the source of truth._

What the site says and how it behaves: `SITE-BRIEF.md`. All copy: `COPY.md`. Milestones: `PLAN.md`. Behaviour reference: the home prototype in `prototype/`.

---

## 1. Libraries

| Layer | Choice | Version | Why |
|---|---|---|---|
| Framework | **Next.js** (App Router), static generation | 16.4.x | Every page ships as static HTML: fast first paint, fully crawlable |
| UI | React | 19.x | Comes with Next.js |
| Language | TypeScript, `strict` | as installed by Next.js | |
| Styling | **Tailwind CSS v4** (CSS-first `@theme` tokens) | 4.3.x | Tokens copied from the prototype's `:root` block |
| Fonts | `next/font/google`: Bricolage Grotesque (headings), Plus Jakarta Sans (body) | built in | Self-hosted, no layout shift |
| Motion | **GSAP + ScrollTrigger**, `@gsap/react` (`useGSAP`) | 3.15.x | Pinned story stage, scrubbed timelines, `matchMedia` per breakpoint |
| Smooth scroll | Lenis | 1.3.x | Synced to ScrollTrigger |
| i18n | **next-intl** | 4.14.x | ID default without prefix, EN under `/en`, translated slugs |
| Long-form content | MDX (`@next/mdx`) + frontmatter validated with **zod** | 16.4.x / 4.x | Articles and portfolio entries as files in the repo, no CMS |
| Icons | `@phosphor-icons/react` (SSR import) | 2.1.x | Same icon set as the prototype |
| Workflow diagrams | **elkjs** for layout + hand-rendered SVG | 0.12.x | Auto layout left→right on desktop, top→bottom on phones |
| Analytics | `@vercel/analytics`; GA4 optional | 2.0.x | WhatsApp clicks tracked per section |
| Testing | Playwright + `@axe-core/playwright` | 1.64.x | Story beats at 375 / 768 / 1440px, accessibility checks |

## 2. Folder structure

The Next.js app lives in **`site/`** so it stays separate from the docs, the prototype and the brand files.

```
site/
  app/
    [locale]/
      layout.tsx              html lang, fonts, Nav, Footer, analytics
      page.tsx                Home
      portofolio/page.tsx     list            (EN path: /en/portfolio)
      portofolio/[slug]/page.tsx
      artikel/page.tsx        list            (EN path: /en/articles)
      artikel/[slug]/page.tsx
      tentang/page.tsx        About           (EN path: /en/about)
      kebijakan-privasi/page.tsx              (EN path: /en/privacy-policy)
    sitemap.ts
    robots.ts
    opengraph-image.tsx
  components/
    layout/      Nav, MobileMenu, LangSwitch, Footer, WhatsAppButton, MobileWhatsAppBar
    story/       HomeStory (the 18 beats, server), StoryStage (client: GSAP, Lenis, fit pass, rail, zones tool),
                 beats.ts (timing, light per keyframe, rest poses), Prop, Binder, FaqNotes, story.css
    home/        Capabilities, IndustrySwitcher, LogoMarquee, Faq, FinalCta
    workflow/    WorkflowDiagram
    mdx/         components available inside MDX (PullQuote, Callout, Figure)
  content/
    articles/{id,en}/*.mdx
    portfolio/{id,en}/*.mdx
    workflows/*.json          sanitized n8n workflows (generated, safe to publish)
  messages/
    id.json                   all UI copy, generated from COPY.md
    en.json
  i18n/
    routing.ts                locales, default locale, translated pathnames
    request.ts                locale from next/root-params, loads messages
    navigation.ts             Link, getPathname... bound to the routing
  proxy.ts                    next-intl middleware (Next 16 "proxy")
  global.d.ts                 types message keys from messages/id.json
  lib/
    wa.ts                     WhatsApp link builder (number from env, prefilled text per locale)
    analytics.ts              trackWhatsApp(section, locale)
    seo.ts                    metadata helpers, JSON-LD builders
    content.ts                MDX loading + zod schemas
  styles/globals.css          Tailwind v4 @theme tokens
  public/brand/               logo files from Assets/brand
  scripts/
    sanitize-workflow.ts      Assets/workflows/*.json → content/workflows/*.json
    copy-to-messages.ts       COPY.md tables → messages/{id,en}.json
  tests/e2e/
```

## 3. Content model

- **UI copy** (nav, story beats, cards, capabilities, FAQ, CTAs, footer, WhatsApp messages, SEO metadata) lives in `messages/id.json` and `messages/en.json`. `COPY.md` stays the human-editable source; a script turns its tables into the two JSON files so they never drift.
- **Industry examples** (chat, admin, calendar, knowledge Q&A per industry) are part of the messages, keyed by industry.
- **Articles** (MDX), frontmatter: `title`, `summary`, `category` (otomasi / whatsapp / ai), `date`, `cover?`, `translationOf?`.
- **Portfolio entries** (MDX), frontmatter: `title`, `client`, `clientLogo?`, `industry`, `solutions[]`, `summary`, `result`, `workflow?` (name of a sanitized workflow file), `quote?`, `date`.
- All frontmatter is validated with zod at build time; a bad entry fails the build.

## 4. Routing and i18n

- next-intl with `defaultLocale: 'id'`, `localePrefix: 'as-needed'` (Indonesian at `/`, English at `/en`), `localeDetection: false` (`/` is always Indonesian, no redirect by browser language).
- `proxy.ts` (Next 16's name for middleware) runs next-intl's middleware. `i18n/request.ts` reads the locale with `next/root-params`, so pages don't call `setRequestLocale`. `generateStaticParams` for the locales lives in `app/[locale]/layout.tsx`.
- Cache Components is on (`cacheComponents` + `partialPrefetching` in `next.config.ts`). Avoid `new Date()`, `Math.random()` and request APIs in server components unless they sit behind `'use cache'` or `<Suspense>`, or the static shell breaks.
- Translated pathnames: `/portofolio` ↔ `/en/portfolio`, `/artikel` ↔ `/en/articles`, `/tentang` ↔ `/en/about`, `/kebijakan-privasi` ↔ `/en/privacy-policy`.
- `generateStaticParams` for both locales and every slug, so the whole site is static.
- The language switch keeps the visitor on the same page in the other language.
- Every page sets `alternates.languages` (hreflang) and a canonical URL.

## 5. Home page implementation notes

**Story stage** (`components/story/StoryStage.tsx`, client component)
- One section with a tall wrapper (~720vh desktop, ~640vh phones) and a `position: sticky` stage inside it. GSAP drives one timeline from the wrapper's scroll progress (no `pin`, so sticky and ScrollTrigger never fight).
- `beats.ts` holds the 18 beats as steps of the take (camera move, hold, keyframe they end on, keyframe notes), the light per keyframe (K0 to K16 plus K5a and K9a) and each prop's rest pose. Prop positions are props on `<Prop desk={…} phone={…}>` in `HomeStory.tsx` and follow `STORY-STAGE.md` section 3.
- `story.css` is the prototype's CSS, scoped under `.story`. The base rules are the stacked fallback; the film lives in `@media (scripting: enabled) and (prefers-reduced-motion: no-preference)`, the same query as `FILM_QUERY` in `beats.ts`.
- `gsap.matchMedia()` builds separate timelines for desktop (≥768px) and phones, and cleans them up on resize.
- Problem cards: two faces (problem / ✓), flipped with `rotationY`. On phones they become a chip row placed under the headline (measured after fonts load and on every `ScrollTrigger` refresh).
- Process steps (beat 5) light up one by one inside the same timeline.
- The containers of all beats overlap, so containers get `pointer-events: none` and the visible beat gets `pointer-events: auto`.
- `prefers-reduced-motion`: no sticky stage, all beats rendered as normal sections in order, cards in their ✓ state.
- **Zones overlay**: the prototype's "Area video" tool, shown only when the URL has `?zones=1` (for the team, never linked publicly).
- **MediaSlot**: the full-bleed background layer of the stage. For now a colour fill that shifts from cool to warm. It takes a source later (format and assets are decided by the Kreatekno team); whatever goes in must be scaled to cover the stage, load progressively, and pause when off screen.

**Other sections**
- Capabilities: industry switcher as an accessible tab list (arrow keys), examples swapped with a short fade.
- Logo marquee: CSS animation, paused on hover, static under reduced motion.
- FAQ: native `<details>` plus `FAQPage` JSON-LD from the same data.
- Mobile WhatsApp bar: appears after the story stage, hides at the final CTA.
- Scroll reveals use IntersectionObserver, never a scroll listener.

## 6. WhatsApp and analytics

- `NEXT_PUBLIC_WA_NUMBER` (international format, digits only) feeds every link: `https://wa.me/<number>?text=<prefilled message in the current locale>`.
- Each button carries a section name (`hero`, `story-end`, `faq`, `final`, `nav`, `mobile-bar`, `footer`…). A click sends `whatsapp_click { section, locale }`.
- Vercel Analytics needs no cookie banner. If GA4 is added, add a consent banner (decline non-essential by default).

## 7. SEO (technical)

- `generateMetadata` per page from the SEO table in `COPY.md`.
- `app/sitemap.ts` lists both locales with alternates; `app/robots.ts`.
- Open Graph images generated with `next/og` (logo + headline, brand colours).
- JSON-LD: `Organization` and `ProfessionalService` (Pekanbaru address, phone, opening hours) on every page; `FAQPage` on Home; `Article` on articles; `BreadcrumbList` on detail pages.
- One H1 per page. Home's H1 = keyword line + problem headline (see `SITE-BRIEF.md` 9).

## 8. Workflow diagrams (portfolio)

- `scripts/sanitize-workflow.ts` reads an exported n8n workflow from `Assets/workflows/` and keeps only node types, names and connections. Credentials, IDs, URLs, webhook paths and parameters are dropped. **Raw exports are never published.**
- A hand-edited story layer groups nodes into 4–7 plain-language steps (ID + EN) and folds helper nodes (Set, IF, Merge, Code) into their step.
- `WorkflowDiagram` lays the steps out with elkjs and renders SVG; node types map to app icons, with a distinct AI node style. Steps light up in order when scrolled into view; static under reduced motion.

## 9. Performance and accessibility budget

- Lighthouse mobile ≥ 85; LCP < 2.5s on 4G mid-range Android; CLS < 0.1.
- No layout-affecting animation: only `transform` and `opacity`.
- Blur effects only on small, fixed or sticky elements (nav, story cards).
- Tap targets ≥ 44px; visible focus states; WCAG AA contrast for all text, including text on the semi-transparent story cards.
- JavaScript for the story stage and GSAP loads only on the Home page.

## 10. Quality and deploy

- ESLint (Next.js config) + Prettier; TypeScript strict; `next build` must pass with zod-validated content.
- Playwright: screenshots of each story beat at 375, 768 and 1440px; navigation and language-switch tests; axe accessibility scan per page.
- **Vercel**: project root `site/`, preview deploy per branch, production on `main`. Domain `kreatekno.com` pointed at Vercel when ready.
- Environment variables: `NEXT_PUBLIC_SITE_URL`, `NEXT_PUBLIC_WA_NUMBER`, `NEXT_PUBLIC_GA_ID` (optional).
- Design and QA skills installed in `.claude/skills/` (Taste, Emil, Impeccable) are used for the visual pass, the motion review and the final audit.
