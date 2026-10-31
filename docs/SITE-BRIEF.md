# Kreatekno Website — Site Brief

_Last updated: 2026-10-14. Source: Q&A and review rounds with the Kreatekno team, the earlier story prototype, and three reference sites (see section 1)._

This is the source of truth for **what the site says and how it behaves**. `COPY.md` holds every line of copy (ID/EN), `STACK.md` the tech, `PLAN.md` the milestones. Old video and AI-asset material is in `archive/` and is not part of this brief. Working prototype: https://claude.ai/artifact/Ruu3y62oZoj8Jhtd4Nqqm8 (source `prototype/home.src.html`, built with `prototype/build.py`).

> **Changed on 2026-10-16/17, rewrite pending.** Home now follows the team's one-take document (revised 2026-10-25: 18 beats, 19 keyframes). The stage, prop positions and the web/video split are in `STORY-STAGE.md`. Until this brief is rewritten, `STORY-STAGE.md` and the Next.js stage win over these older parts:
> - section 2 "Story", "Layout" and "Mobile" (6 beats, problem-first opening, text zones vs video zones)
> - section 4: the CTA label is now "Konsultasi gratis", visible text names no platform, and there is no sticky phone bar
> - section 5: the separate Capabilities, logo, FAQ and CTA sections are now beats of the story

---

## 1. References

| Reference | What we took from it |
|---|---|
| **madarplatform.com/en** | Very large, light display headlines on a calm field; a scroll-driven stage where labelled moments appear one by one. Used for the big headline moments and the pinned story stage. |
| **getquoti.ai** | Bold, punchy headlines; full-bleed video hero; **tilted "pain" cards with a hard offset shadow** that pile in as you scroll; tactile, slightly playful feel. Used for the story's problem cards. |
| **gezondheidsgids.maglr.com/gids-in-gezondheid-2019/het-grote-breindossier** | Editorial scrollytelling: full-bleed colour bands, drop caps, multi-column text, pull quotes. Used for the Articles pages. |
| **Earlier story prototype** (claude.ai artifact "Kreatekno Story Split", https://claude.ai/artifact/GfA3UShzvqZTTs6LHMxHVW) | Original copy: 3 services, 3-step process, FAQ, article topics, 2 portfolio projects, "Tim kecil dari Pekanbaru…" line. |
| **Current kreatekno.com** | Logo and brand colours, kept as-is. Files and hex values in `Assets/brand/README.md`. |

## 2. Preferences and decisions from review

These came out of the review rounds. Follow them in every new page and every copy change.

### Copy and voice
- Address the reader as **"Anda"**, not "kamu" (fits SME owners in their 30s to 50s in Riau). Keep it warm: short sentences, "Yuk", everyday examples.
- **No ambiguous sentences.** Every sentence needs a clear subject and object. Watch for: "-nya" with an unclear owner, "langsung" that can attach to two verbs, "24 jam" that can read as "within 24 hours" (write "aktif 24 jam"), "jalan" (write "sistem berjalan"), "membesarkan".
- Use the standard verb **"otomatiskan"** ("diotomatiskan"), not "otomatisasi" as a verb.
- **No time promises in headlines.** "About one week" only appears in the FAQ, with its conditions (simple workflow, data and access ready).
- **No em dashes** in visible copy.
- **The hero is not limited to Pekanbaru.** It speaks to SMEs anywhere in Indonesia. Pekanbaru appears in story beat 4, the FAQ, the final CTA, the footer, the About page and the meta description ("Berbasis di Pekanbaru, melayani seluruh Indonesia").
- The claim "tim otomasi AI pertama di Pekanbaru" is **not on the page** (its section was removed). Only use it again once it's confirmed.
- **Approved key lines:**
  - "Tim terbaik Anda terjebak di pekerjaan berulang."
  - "Kenalkan asisten AI yang bekerja 24 jam untuk bisnis Anda."
  - "Tim Anda fokus ke pelanggan, strategi, dan ide baru."
  - "Tim kecil dari Pekanbaru yang bekerja di samping Anda."
  - "Kami dampingi di setiap langkah, dari ngobrol sampai sistem berjalan."
  - "AI membantu tim Anda naik kelas, bukan menggantikan mereka."
  - "Yuk, ceritakan satu pekerjaan yang paling ingin Anda otomatiskan."

### Story
- **Scrollytelling starts with the problem.** The first screen is the problem headline alone; the problem cards come in on the next scroll step, separately, so the problem gets more time.
- The process ("Cara kerja") and the team ("Tim kecil dari Pekanbaru") are **beats inside the story**, not separate sections.
- Each beat can carry one secondary button that leads deeper: Lihat layanan (beat 2), Lihat portofolio (beat 3), Tentang kami (beat 4).
- Removed on request: the purple statement band ("Tim otomasi AI pertama di Pekanbaru") and the comparison table ("Kami bekerja seperti co-founder Anda").

### Layout
- **The video fills the whole screen.** Text sits on top of a calm part of the frame; characters act in the rest (by default the right ~2/3 on desktop).
- **Text positions must vary from beat to beat** on desktop and on phones. The story must never feel like the same slide repeated (see 5.1).
- **Cards: only the fill is transparent, never the text.** Beat 4 card fill `#121640` at opacity 0.5 on its own layer; the text stays 100% opaque.

### Mobile
- **The video half must stay clear.** No cards, sticky bars or prototype tools on top of the character area. Cards become a chip row inside the text half; the WhatsApp bar only appears after the story.
- Phones get their own variation too (beats 4 and 6 put the text at the bottom).

### Way of working
- **Website first.** The story stage background is a clean colour fill. Its media is defined later by the Kreatekno team and must fit the zones in 5.1.
- Iterate in the prototype artifact before moving to Next.js. The "Area video" toggle shows the video zones per beat.
- Design skills are installed per project in `.claude/skills/` (Taste, Emil, Impeccable). Impeccable's binary launcher is not run; only its written guidance is used.

---

## 3. Business and audience

- **What we sell:** We build AI automations (WhatsApp AI agents, n8n workflows) that take repetitive admin off your team.
- **Who:** UMKM / SME owners, starting in **Pekanbaru, Riau**, serving the rest of Indonesia. Main industries: **retail / F&B, clinics, property, logistics**.
- **Their pains (in their words):**
  1. "Admin balas WhatsApp seharian" (admin replies to WhatsApp all day)
  2. "Rekap manual di Excel" (manual recaps in Excel)
  3. "Posting konten itu melelahkan" (posting content is exhausting)
- **Their objections → how the site answers them:**

| Objection | Where the site answers it |
|---|---|
| "I don't know where to use it" | Capabilities section with an **industry switcher**; the free mapping chat is the main CTA |
| "I'm afraid it replaces my staff" | The whole story: _AI membantu tim Anda naik kelas, bukan menggantikan mereka_ |
| "I'm not sure AI is reliable" | Beat 2 (questions it can't answer go to admin), FAQ (tested on the client's own data, ongoing monitoring) |

- **Alternatives:** chatbot SaaS and other agencies.
- **Why Kreatekno:** tailored to each business, works like a partner, **flexible pricing**, **face-to-face meetings in Pekanbaru**, support after launch.
- **No prices on the site.**

## 4. Conversion

- **Primary CTA: WhatsApp click-to-chat** ("Chat WhatsApp") with a prefilled message: _"Halo Kreatekno, saya mau konsultasi otomasi untuk bisnis saya."_
- **Secondary CTA: "Ketemu langsung"** (meet face to face), also through WhatsApp with its own prefilled message.
- One label per intent across the page: "Chat WhatsApp", "Ketemu langsung", "Lihat layanan", "Lihat portofolio", "Tentang kami".
- **No forms in v1.** Later: form → Google Sheet → team notified, via n8n.
- **Tracking:** every WhatsApp click carries the section name (`data-src`), so we can see which section converts.
- The header always has a "Chat WhatsApp" button. On phones, a **sticky bottom WhatsApp bar** appears **after the story stage**.

## 5. Home page

Order: **story stage (6 beats) → Capabilities → Client logos → FAQ → Final CTA → Footer**.

### 5.1 Story stage (pinned, video later)

Pinned length ~720vh on desktop, ~640vh on phones. Text and cards animate with the scroll and reverse cleanly when scrolling back up. The background is a clean colour that shifts from cool to warm (placeholder for the video's light). Progress shows as a column of dots on the right edge.

| Beat | Text (HTML) | Button | UI overlay |
|---|---|---|---|
| **1a · Problem** (first screen) | **H1** = keyword line "Asisten AI dan otomasi WhatsApp untuk UMKM" + "Tim terbaik Anda terjebak di pekerjaan berulang." + pain sentence | Chat WhatsApp | none |
| **1b · Problem cards** | same headline | same | 3 pain cards pile in, tilted and messy, and stay a while |
| **2 · AI steps in** | "Kenalkan asisten AI yang bekerja 24 jam untuk bisnis Anda." + it takes over repetitive work; questions it can't answer go to admin | Lihat layanan (→ `#layanan`) | cards flip to ✓ and line up |
| **3 · Team focuses** | "Tim Anda fokus ke pelanggan, strategi, dan ide baru." + time now goes to customers and growth | Lihat portofolio | cards leave, light warms |
| **4 · Our team** | "Tim kecil dari Pekanbaru yang bekerja di samping Anda." + "Kantor kami dekat dengan Anda. Kita bisa duduk satu meja, membahas alur kerja Anda, lalu membangun solusinya bersama." | Tentang kami | none |
| **5 · How we work** (`#cara-kerja`) | "Kami dampingi di setiap langkah, dari ngobrol sampai sistem berjalan." + 5 steps lighting up one by one | none | none |
| **6 · Growing together** | "AI membantu tim Anda naik kelas, bukan menggantikan mereka." + free mapping offer | Chat WhatsApp + Ketemu langsung | none |

The 5 steps (beat 5): **Ngobrol** (free, in person or online) · **Petakan** (find the work most worth automating) · **Bangun dan uji** (tested on your own data) · **Luncurkan** (team trained until comfortable) · **Dampingi** (monitored and improved continuously).

**Composition per beat** (the video must follow these zones; the prototype's "Area video" toggle draws them):

| Beat | Desktop text | Desktop video action | Phone text | Phone video action |
|---|---|---|---|---|
| 1 Problem | Left column (42%) | Right 58%; cards in a lane around the centre | Top half; cards as a chip row under the headline | Bottom half |
| 2 AI steps in | **Right** column (42%), slides in from the right | **Left** 58% | Top half + chip row | Bottom half |
| 3 Team focuses | **Top-centre**, large centred headline | Lower ~54%, full width | Top half | Bottom half |
| 4 Our team | **Bottom-left caption card**, fill `#121640` at 0.5, white text | Upper right | **Bottom** half, same card | **Top** half |
| 5 How we work | Headline **top-left** + **steps band across the bottom** (white fill at 0.5) | Middle band | Top half; steps as 5 dots in a row | Bottom half |
| 6 Growing together | **Bottom-centre**, biggest statement + CTAs | Upper ~58%, wide shot | **Bottom** half (WhatsApp button in thumb reach) | **Top** half |

Notes:
- The pain/✓ cards are **HTML on top of the video**, not baked into it, so they stay translatable and crawlable, and one video per screen size is enough.
- Keep faces and hands at least 8–10% away from every edge: the video is scaled to cover screens of different shapes, so edges get cropped.

### 5.2 Capabilities (generic use cases, `#layanan`)

A **navy** section with a **bento grid** of 4 capabilities, each with a small animated example:

1. **Agen AI WhatsApp:** answers questions, takes orders and bookings, hands off to admin when needed (chat example)
2. **Otomasi admin:** invoices, sales recaps and payment reminders are created and sent automatically (WhatsApp → AI → Sheets → team flow)
3. **Otomasi konten:** trend research, caption drafts and a posting schedule (week calendar)
4. **Asisten pengetahuan:** the team asks about SOPs and products, the assistant answers from company documents (Q&A with source file)

**Industry switcher** (Retail & F&B · Klinik · Properti · Logistik) changes every example. This answers "I don't know where to use it."

### 5.3 Client logos

A light section with a slowly scrolling logo row ("Dipercaya bisnis di Pekanbaru"). Placeholders until the real logo files and permissions arrive.

### 5.4 FAQ

An accordion with `FAQPage` structured data:

- Apakah saya harus paham teknologi?
- Apakah AI akan menggantikan staf saya?
- Seberapa andal AI-nya? Kalau jawabannya salah bagaimana?
- Bisa pakai nomor WhatsApp yang sudah ada? (yes, via WhatsApp Business API)
- Berapa lama sampai asisten jalan? (about one week for a simple workflow, if data and access are ready)
- Berapa biayanya? (flexible; a clear quote after the free consultation)
- Apakah data bisnis saya aman?
- Bisa ketemu langsung? (yes, in Pekanbaru)

### 5.5 Final CTA

A large **navy** block: "Yuk, ceritakan satu pekerjaan yang paling ingin Anda otomatiskan." + "Kami bantu petakan solusinya, gratis. Lewat chat, atau ketemu langsung di Pekanbaru." Buttons: Chat WhatsApp, Ketemu langsung.

### 5.6 Footer

Logo, short description, Pekanbaru address, WhatsApp, social links, page links, language switch, privacy policy.

---

## 6. Pages and URLs

Indonesian is the default (no prefix). English lives under `/en` with translated slugs. Each page has `hreflang` alternates.

| Page | ID URL | EN URL |
|---|---|---|
| Home | `/` | `/en` |
| Portfolio list | `/portofolio` | `/en/portfolio` |
| Portfolio detail | `/portofolio/[slug]` | `/en/portfolio/[slug]` |
| Articles list | `/artikel` | `/en/articles` |
| Article detail | `/artikel/[slug]` | `/en/articles/[slug]` |
| About | `/tentang` | `/en/about` |
| Privacy policy | `/kebijakan-privasi` | `/en/privacy-policy` |

- **Portfolio:** a grid of real projects, filterable by industry and solution type. Each detail page: client and industry, problem, what we built, the **animated workflow diagram** (from the n8n JSON, sanitized), results, client quote/logo. Known projects so far: a home-cleaning service in Pekanbaru (WhatsApp booking chatbot) and a social-media content research automation.
- **Articles:** written for SEO, one MDX file each (no CMS). **Editorial** layout from the Maglr reference: big title, drop cap, pull quotes, coloured full-bleed bands, a reading-progress bar. Categories: Otomasi, WhatsApp, AI. Starter topics:
  - "5 pekerjaan admin UMKM yang bisa diotomatiskan minggu ini"
  - "Chatbot WhatsApp: kapan perlu, kapan belum"
  - "Asisten AI untuk SOP internal tanpa ribet"
- **About:** the story ("Automate You"), the team (**Founder + 2 Co-founders**, roles shown only as "Founder" and "Co-founder"), how we work (face to face, as a partner), values, office location map, CTA.
- **Privacy policy:** covers WhatsApp conversations, analytics and cookies. Claude drafts it; it should be reviewed before launch.

## 7. Look and feel

- **Colours:** mostly **white**, with **navy** sections for rhythm (`#131951`; card fill `#121640`). Purple `#9F0ED6` for primary buttons and accents; cyan `#35EAFE` and violet `#8C2BFA` for highlights on navy. The old theme blue `#046BD2` is dropped. See `Assets/brand/README.md`.
- **Type:** **Bricolage Grotesque** for headlines, **Plus Jakarta Sans** for body text (both Google Fonts, served with `next/font`).
- **Shapes:** cards 24px radius, story cards 16px, buttons and chips fully rounded.
- **Rhythm below the story:** navy (capabilities) → light (logos) → white (FAQ) → navy (final CTA + footer).
- **Mobile-first:** every section designed at 375px first; tap targets at least 44px; the story stage has its own phone layout.

## 8. Motion (level 3)

- **Heavy, scroll-driven storytelling only in the story stage** (all 6 beats).
- **Lighter everywhere else:** capability examples animate when switched or in view, headings and cards fade or rise in, the logo row scrolls slowly, hover and tap states.
- **`prefers-reduced-motion`:** nothing is pinned; all beats are shown as normal text in order, cards in their final ✓ state.

## 9. SEO

- **Primary keywords (ID):** asisten AI untuk UMKM, chatbot WhatsApp untuk UMKM, otomasi admin UMKM, jasa chatbot WhatsApp Pekanbaru, otomasi bisnis Pekanbaru
- **Secondary keywords:** jasa otomasi n8n, WhatsApp Business API, AI untuk bisnis, otomasi invoice dan rekap penjualan, chatbot WhatsApp klinik / toko / properti
- **EN keywords (smaller volume):** WhatsApp chatbot Indonesia, AI automation agency Indonesia, n8n automation agency
- **H1:** "Asisten AI dan otomasi WhatsApp untuk UMKM" (keyword line) + the problem headline, in one H1. No city in the H1.
- **Local SEO:** `ProfessionalService` / `LocalBusiness` structured data with the Pekanbaru address; a Google Business Profile with name/address/phone matching the site; "Pekanbaru" in the meta description, story beat 4, FAQ, footer and About page.
- **Technical:** static HTML for every page, metadata per page, sitemap and robots file, generated Open Graph images, structured data (`Organization`, `FAQPage`, `Article`, `BreadcrumbList`).

## 10. Tech and hosting

- Next.js (App Router, TypeScript, static build), Tailwind CSS, GSAP + ScrollTrigger, Lenis smooth scroll, `next-intl` for ID/EN, MDX for articles and portfolio entries.
- **Hosting: Vercel (recommended)**; Cloudflare Pages also works via the OpenNext adapter with more setup. Video frames can move to Cloudflare R2 if bandwidth grows.

---

## 11. Still needed from Kreatekno

- [ ] WhatsApp business number
- [ ] Full office address (street, for Google Maps and local SEO)
- [ ] Founder + 2 co-founder names, short bios, photos (placeholders are fine at first)
- [ ] Client logo files + permission to show them
- [ ] Portfolio projects list (at least 2–3) with the n8n workflow JSON for each
- [ ] Social media links (Instagram, LinkedIn, TikTok…)
- [ ] Analytics: GA4 or something else
- [ ] Domain and DNS access (when we deploy)
- [ ] Confirm or drop the claim "tim otomasi AI pertama di Pekanbaru"
