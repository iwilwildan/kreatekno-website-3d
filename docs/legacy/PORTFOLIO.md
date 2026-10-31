# Kreatekno Portfolio: Plan

> **Digantikan oleh `SOLUSI.md` (31 Okt 2026).** Halaman Portofolio diganti halaman Solusi; dokumen ini disimpan sebagai arsip.

_Drafted 2026-10-25. Status: prototype P1 in review (one project). Prototype: https://claude.ai/artifact/Aph1ui6sWtmXPSHoZui7yH (source `prototype/portfolio.src.html` → `prototype/build.py` → `prototype/kreatekno-portfolio.html`). Covers `/portofolio` and `/portofolio/[slug]` (EN `/en/portfolio`). Replaces the portfolio part of `SITE-BRIEF.md` section 6 and milestone M6/M7 (portfolio half) in `PLAN.md` once approved._

## 1. Idea in one paragraph

Every project is **one data file** that drives **two modes** on the same URL:

- **Tonton** (watch): a **scroll-driven** motion graphic made in HTML and GSAP, not a video file (decided 2026-10-25). It works like the Home story stage: a sticky stage, and scrolling scrubs one timeline forwards and backwards through the scenes (before → each workflow step → results → CTA). Each scene has one short caption (max ~10 words). A workflow rail under the scene lights the step being shown.
- **Baca** (read): an editorial case study with full sections (problem, what we built, step-by-step workflow, results, client quote, tools used). Same look as the Articles pages.

Because the motion is built from data, a new project means writing a new data file, not animating by hand. The same workflow steps feed the animated flow in Tonton and the static diagram in Baca.

## 2. Why HTML motion and not video

| | HTML/SVG + GSAP (recommended) | Rendered video (AE / Remotion → MP4) |
|---|---|---|
| ID/EN captions | Real text, one source | One render per language |
| SEO, accessibility | Captions are crawlable text, screen readers read them | Needs separate transcript |
| Size | A few KB of JSON per project | 3 to 10 MB per project, per aspect ratio |
| Phone vs desktop | Same scenes re-laid out (9:16 / 16:9) | Two renders |
| Updating a number or caption | Edit the data file | Re-render |
| Reuse for Instagram Reels | Record the player at 1080×1920 with Playwright (optional, phase 7) | Native |

GSAP is already in the stack, so no new runtime library is needed.

## 3. Pages

### 3.1 `/portofolio` (list)

- Intro: headline + one sentence (copy in `COPY.md`).
- Mode switch **Tonton | Baca** (segmented control, state in `?mode=`):
  - **Tonton** = a **reel**: one sticky stage that scrolls through every project back to back. A chapter rail shows the project names; each chapter ends on a card "Baca detail" + "Konsultasi gratis".
  - **Baca** = grid of project cards, filterable by industry (Retail & F&B, Klinik, Properti, Logistik) and solution type (Agen AI chat, Otomasi admin, Otomasi konten). Each card: title, industry, one-line result, and a 3 to 4 second silent loop of its flow (plays when in view, static under reduced motion).
- Default mode: **Tonton** on first visit; the choice is remembered in `localStorage` (per visitor only). Reduced motion → Baca.
- Both modes are in the static HTML; Tonton is enhanced on the client.

### 3.2 `/portofolio/[slug]` (detail)

- Top: title, industry chip, solution chips, one-line result. Mode switch under it.
- **Tonton**: the project's scroll stage (section 4.2). The caption sits beside the scene on desktop and above it on phones, never on top of the action (same rule as the Home video half). Ends on an end card: "Mau sistem seperti ini untuk bisnis Anda?" + **Konsultasi gratis** with a prefilled message that names the project, e.g. _"Halo Kreatekno, saya lihat proyek Order otomatis dari grup chat. Saya mau yang serupa untuk bisnis saya."_ + "Baca detail".
- **Baca** sections (from `COPY.md` section 283): Ringkasan · Masalah · Yang kami bangun · Alur kerja (static diagram + one paragraph per step) · Hasil (metrics) · Kata klien · Alat yang dipakai · next project.
- Both modes render server-side. Google gives full weight to text inside tabs, so Baca text stays indexable even when Tonton is showing.
- JSON-LD: `CreativeWork` (or `Article`) + `BreadcrumbList`.

## 4. The motion engine

### 4.1 Scene types

A project's film is a list of scenes. Each scene type is one React component with its own GSAP sub-timeline, laid out for 16:9 and 9:16.

| Scene | What moves | Used by |
|---|---|---|
| `title` | Project name, industry, client type | all |
| `problem` | Pain card(s) with a number counting up (e.g. "180 chat per hari") | all |
| `chat` | Customer / AI / admin bubbles with typing dots; a hand-off moment where the AI passes to the admin | CS |
| `groupChat` | Free-text messages dropping into a group chat | Order tracking |
| `flow` | The project's 4 to 7 workflow steps; a glowing data packet travels node to node, each node lights up and shows what it does | all |
| `extract` | A messy message turns into labelled fields (nama, barang, jumlah, alamat, status) | Order tracking, CS |
| `sheet` | Rows slide into a table; a status cell changes colour | Order tracking |
| `carousel` | Slides are generated one by one: text writes in, image fills, the deck fans out | Carousel |
| `approval` | A preview arrives on the owner's phone, a tap on "Setujui", it is published | Carousel |
| `result` | 2 to 3 metrics counting up, before vs after | all |
| `end` | CTA end card | all |

Rules:
- Chat UIs are drawn in **Kreatekno colours, not WhatsApp/Instagram look-alikes** (no green bubbles, no copied icons), so we never imitate another brand.
- Only `transform` and `opacity` animate (budget in `STACK.md` section 9).
- Each caption is real text in a fixed caption zone, shown together with its scene; captions are always on (the film has no sound).

### 4.2 Stage (scroll-driven, as built in the prototype)

- A tall wrapper (~11 screens for 9 scenes) with a sticky stage; GSAP ScrollTrigger scrubs one timeline, Lenis smooths the scroll. Nothing moves unless the visitor scrolls, so no pause control is needed.
- Each scene has an `in` (transition from the previous scene) and a `hold` (time to read). Captions change halfway through the transition.
- Desktop: caption column left (38%), scene canvas right, workflow rail along the bottom, thin progress bar on top, previous/next buttons that scroll to each scene. Phones: caption on top, canvas in the middle, rail as icons with the current step written under it; the buttons are hidden because scrolling is the control.
- The scene canvas has one fixed design size (440 × 520 px) and is scaled to fit the space, so one composition serves every screen. On a 375px phone it renders at about 0.78×.
- Reduced motion: Baca is the default; in Tonton the stage is not pinned and the previous/next buttons step through the scenes (each jumps to the scene's final frame).
- Without JavaScript the canvas shows the first scene and all captions are listed as text.
- JS for the stage loads only on portfolio pages.

### 4.3 Content model

```
site/content/portfolio/
  cs-whatsapp.ts            project data: meta, metrics, scenes (captions ID/EN)
  carousel-generator.ts
  order-grup.ts
  id/cs-whatsapp.mdx        Baca text, Indonesian
  en/cs-whatsapp.mdx        Baca text, English
site/content/workflows/
  cs-whatsapp.json          sanitized workflow + steps layer (generated, see section 6)
site/components/portfolio/
  ModeSwitch, PortfolioGrid, ProjectCard, CaseStudy (Baca)
  player/ Player, Timeline, scenes/*.tsx
site/components/workflow/WorkflowDiagram.tsx   static diagram (Baca), shared step data with the flow scene
```

Project data shape (validated with zod at build time; a bad entry fails the build):

```ts
{
  slug: "order-grup",
  sample: true,                       // shows a "CONTOH" badge until real data replaces it
  industry: "logistik",
  solutions: ["otomasi-admin"],
  title: { id: "Order otomatis dari grup chat", en: "Orders captured from the group chat" },
  result: { id: "Rekap order tanpa ketik ulang", en: "Order recap with no retyping" },
  metrics: [{ value: 3, unit: { id: "jam/hari", en: "hrs/day" }, label: { id: "waktu admin kembali", en: "admin time back" } }],
  workflow: "order-grup",             // file in content/workflows
  scenes: [
    { type: "problem", caption: { id: "Order masuk acak di grup, admin ketik ulang ke Excel.", en: "..." }, data: { stat: 120, unit: "order/hari" } },
    { type: "groupChat", caption: { id: "Tim tetap kirim order seperti biasa.", en: "..." }, data: { messages: [...] } },
    { type: "extract", caption: { id: "AI membaca pesan dan memisahkan datanya.", en: "..." } },
    { type: "sheet", caption: { id: "Data tersimpan rapi di tabel order.", en: "..." } },
    { type: "flow", caption: { id: "Status berubah, pelanggan langsung dikabari.", en: "..." } },
    { type: "result", caption: { id: "Setiap malam pemilik terima rekap.", en: "..." } },
    { type: "end" }
  ]
}
```

## 5. The three sample projects

All three ship with `sample: true` ("CONTOH" badge), invented but realistic numbers, and no client name, until real data and permission arrive. Captions below are drafts for review (Anda voice, no em dashes, no time promises).

### 5.1 Asisten CS untuk chat pelanggan (`cs-whatsapp`)
- **Industry:** Klinik (switchable to Retail later).
- **Problem:** admin answers the same questions all day (jam buka, harga, jadwal dokter); chats at night wait until morning.
- **Built:** an AI agent on the business number. It answers from the clinic's own price list and FAQ, checks the schedule, takes bookings, and passes questions it cannot answer to the admin with the chat summary.
- **Flow steps:** Pesan masuk → Cek riwayat pelanggan → Agen AI menjawab (pakai daftar harga + jadwal) → Booking tercatat → Pertanyaan sulit diteruskan ke admin → Ringkasan harian.
- **Film (~40 s):** problem (chat counter) → chat (customer asks price, AI answers, books a slot) → chat (hard question, hand-off to admin) → flow → result → end.
- **Caption drafts:** "180 chat masuk setiap hari, jawabannya hampir selalu sama." · "Asisten AI menjawab dari daftar harga klinik Anda." · "Pertanyaan yang sulit diteruskan ke admin, lengkap dengan ringkasan." · "Admin fokus ke pasien yang datang."
- **n8n shape:** WhatsApp Business API trigger → customer lookup (Sheets/DB) → AI Agent node (chat model, memory, tools: price list, schedule, booking) → reply → IF low confidence → admin notification.

### 5.2 Generator carousel Instagram (`carousel-generator`)
- **Industry:** Retail & F&B.
- **Problem:** the owner posts irregularly because making a 6-slide carousel takes hours.
- **Built:** the owner sends a topic (or one is picked from the content calendar); the system researches, writes slide copy in the brand voice, fills the brand template, and sends the preview for approval. Approved decks are scheduled.
- **Flow steps:** Topik masuk → Riset tren → AI menulis isi slide → Slide dibuat dari template brand → Preview ke pemilik → Disetujui, dijadwalkan.
- **Film (~35 s):** problem (blank calendar) → flow → carousel (slides build and fan out) → approval (tap Setujui) → result (posts per week) → end.
- **Caption drafts:** "Satu carousel bisa makan waktu setengah hari." · "Anda cukup kirim satu topik." · "Isi slide ditulis dengan gaya bahasa brand Anda." · "Anda cek, setujui, lalu sistem menjadwalkan."
- **n8n shape:** chat/sheet trigger → web research (HTTP / search) → LLM (structured slide JSON) → image render (template service or HTML-to-image) → Drive → approval message with buttons → Instagram Graph API publish/schedule.

### 5.3 Order otomatis dari grup chat (`order-grup`)
- **Industry:** Logistik (or F&B catering).
- **Problem:** orders arrive as free text in a staff group chat; the admin retypes each one into Excel and misses some.
- **Built:** the system reads every group message, lets AI pull out the order fields, saves them to the order sheet, confirms in the group with an order number, updates status from short replies ("kirim #123"), and sends the owner a nightly recap.
- **Flow steps:** Pesan grup masuk → AI memisahkan data order → Simpan ke tabel order → Konfirmasi nomor order di grup → Update status dari balasan → Rekap malam untuk pemilik.
- **Film (~40 s):** problem (scrolling messy group) → groupChat → extract (message splits into fields) → sheet (rows slide in, status flips) → result → end.
- **Caption drafts:** "Order masuk acak di grup, admin mengetik ulang satu per satu." · "Tim tetap mengirim order seperti biasa." · "AI membaca pesan dan memisahkan datanya." · "Setiap malam pemilik menerima rekap order."
- **n8n shape:** group message webhook (WhatsApp gateway) → filter (order-like messages) → LLM structured extraction → Sheets append/update → reply in group → Schedule trigger 21:00 → summary → owner.

Note on platform names: `PLAN.md` says visible text never names a platform. For the portfolio we suggest captions stay neutral ("chat pelanggan", "grup chat") and only the Baca section "Alat yang dipakai" names the tools (WhatsApp Business API, Instagram, n8n, Google Sheets). Needs a decision (section 9).

## 6. From n8n to the page (when MCP access is in)

1. List the team's production workflows with the n8n MCP and pick one per project.
2. Export each workflow to `Assets/workflows/<slug>.raw.json` (**raw files must be gitignored**; today `.gitignore` does not exclude them).
3. `scripts/sanitize-workflow.ts` keeps only node types, node names and connections. It drops credentials, IDs, URLs, webhook paths, phone numbers, sheet IDs, system prompts and all parameters.
4. A hand-written **steps layer** groups nodes into 4 to 7 plain-language steps (ID/EN) and folds helper nodes (Set, IF, Merge, Code) into their step. Node type → icon, AI nodes get their own style.
5. Real execution counts (with the client's permission) can replace sample metrics, e.g. orders processed per month from the execution history.

Until then the sample `content/workflows/*.json` files are written by hand in the sanitized format, so the pipeline above only swaps the files.

## 7. Phases

| # | Phase | Output | Depends on |
|---|---|---|---|
| P1 | Prototype | One HTML artifact (like the Home prototype): detail page with mode switch, scroll-driven stage, Baca case study, desktop + phone. **First pass done 2026-10-25 with one project (`order-grup`, ID only)**; the other two projects follow after review | decisions in section 9 |
| P2 | Content model | zod schemas, 3 project data files, Baca MDX in ID/EN, sample workflow JSON, copy added to `COPY.md` and messages | P1 review |
| P3 | Baca mode in Next.js | List page with filters, detail case study, `WorkflowDiagram` (elkjs), SEO metadata + JSON-LD, sitemap entries | P2 |
| P4 | Tonton mode in Next.js | Scroll stage, timeline builder, scene components, reel on the list page, card loops, reduced-motion storyboard, analytics | P2, P1 approved |
| P5 | Real data | n8n MCP export → sanitize → steps layer; real metrics, quotes, logos; remove `sample` badges | MCP access, client permission |
| P6 | QA | Playwright screenshots per scene at 375 / 768 / 1440, axe scan, motion review (Emil skill), Lighthouse | P3, P4 |
| P7 (optional) | Social export | `?export=reel` view at 1080×1920 that plays the timeline by itself, recorded to MP4 for Instagram Reels | P4 |

## 8. Analytics

- `portfolio_mode { mode, slug? }` when the mode switches.
- `portfolio_scroll { slug, scene }` when a visitor reaches scenes 3, 6 and the last one (how far people scroll).
- WhatsApp clicks from the end card carry `section: "portfolio-<slug>"`.

## 9. Decisions needed

1. **Prototype first?** Recommended: yes, as with Home, because the motion is the part that needs review.
2. **Default mode** on first visit: Tonton (recommended) or Baca.
3. **Platform names** in portfolio text: neutral captions + tools named only in Baca (recommended), or name WhatsApp/Instagram everywhere.
4. **Industry per sample:** CS → Klinik, Carousel → Retail & F&B, Order → Logistik. Change if the real clients differ.
5. Can sample projects go live with a "CONTOH" badge, or does the portfolio stay hidden until at least 2 real projects are in?
