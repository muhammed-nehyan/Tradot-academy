# Tradot Academy Website

Freelance project: a marketing website for **Tradot Academy**, a stock market trading academy in Kalamassery, Kochi, Kerala.
Developer: Nehyan. This is his first freelance project, so scope discipline and on-time delivery matter.

## Deadline and payment

| Item | Detail |
|---|---|
| Delivery | **15 Oct 2026** |
| Total | ₹15,000 |
| Payments | 30% advance, 30% after design approval, 40% on completion |
| Revisions | 2 design rounds included |
| Not in scope | Blog/CMS, student login, online payments, content writing, logo redesign, ongoing maintenance |

## Client facts (from his poster; treat as the source of truth)

- **One program**, not multiple courses: a trading class, "Basic to Advance Level"
- **Fee:** ₹16,500
- **Duration:** 25 days
- **Mode:** online and offline batches
- **Live sessions from day 1**, with expert mentorship
- **Modules:**
  1. Trading Basics: understand the market from the ground up
  2. Analysis & Chart Reading: how charts work and what drives the market
  3. Technical Analysis: read charts and find high-probability setups
  4. Risk Management: protect capital, trade with confidence
  5. Trading Psychology: build the mindset to be a consistent trader
- **Registration / WhatsApp:** +91 96458 86344
- **Location:** Kalamassery, Kochi, Kerala
- **Brand look he likes:** dark background with cyan accents. His poster uses the same style as the current design.

Still placeholders (ask the client): trainer names, photos and bios; academy photos; email address; full street address; Google Maps link; social media links; real testimonials; next batch date.

## Tech stack

- **Astro** (latest), TypeScript strict, minimal template
- **Fully static output.** No backend code.
- **Hosting:** Cloudflare Pages, free tier (it allows commercial use). The domain is registered in the client's name.
- **Fonts:** self-hosted via `@fontsource/archivo` (weight 800, plus italic) and `@fontsource-variable/plus-jakarta-sans`
- **Animations:** GSAP with ScrollTrigger and SplitText (`gsap` package; all plugins are free), plus **Lenis** (`lenis` package) for smooth scrolling. Page transitions use Astro's `<ClientRouter />`.
- **No React or other UI framework** unless a specific component truly needs one.

## Key implementation decisions

### Contact form: no API
- On submit, the form builds a message and opens `https://wa.me/919645886344?text=...` with the details prefilled.
- Fields: name, phone, batch (Online / Offline at Kalamassery), message.
- **Optional backup:** a hosted form service (Web3Forms or Formspree) for email delivery. Only add it if the client confirms.
- The quotation promised "contact form with email delivery, spam protection," so tell the client about this change.

### Market news: Moneycontrol and Investing.com
- Use their **public RSS feeds** only. Never scrape their pages.
- Fetch the feeds at **build time**. Browsers can't fetch them directly because of CORS.
- Rebuild every 30 minutes via a Cloudflare deploy hook triggered on a schedule.
- Show only **headline, source, time, and a link to the original article**. Never reproduce article text; it's copyrighted.
- **Fail gracefully:** if a feed fails, keep the last good data or show "News unavailable." A feed failure must never break the build.
- Attribution note on the page: "Headlines are sourced from Moneycontrol and Investing.com and link to the original articles. News is for information only and is not investment advice."

### Compliance and trust
- Footer disclaimer on every page: "Tradot Academy provides stock market education only. We do not offer investment advice, tips or guaranteed returns. Trading in securities involves risk."
- **No live price tickers or charts with real market data.** SEBI rules restrict education providers from showing recent live market data, so the client must confirm with his compliance advisor first. Decorative charts are fine.
- **No fake testimonials go live.** Use real student quotes or remove the section.
- Legal pages: Privacy Policy, Terms & Conditions, Disclaimer.

## Design references

- **Figma:** https://www.figma.com/design/3OyZGSZdarRDuZJ2F3q4Q5. "Home — Desktop" is complete; reusable components are in the "Components" section. (Starter plan: Figma MCP is capped at about 6 calls/month, so don't rely on it.)
- **HTML references** for the other pages: `reference/*.html` (about, courses, course-detail, market-news, contact). Copy them into the project's `reference/` folder. They were built for six courses; adapt them to the single program.

### Color tokens

```css
--ink: #0B1117;            /* dark section background */
--ink-raised: #131C25;     /* cards on dark */
--surface: #FFFFFF;
--subtle: #F3F7F9;         /* alternate light section */
--cyan: #00B8D4;           /* brand accent, primary button */
--cyan-soft: #E3F8FB;      /* icon badges on light */
--text: #0F171F;
--muted: #5B6670;
--on-dark: #FFFFFF;
--on-dark-muted: #9AA8B4;
--border: #E2E9ED;
--border-dark: #26323D;
--whatsapp: #25D366;
```

### Typography

- **Display and headings:** Archivo 800. One accent word per headline in Archivo 800 italic, cyan, e.g. "Trade with *clarity*, not guesswork."
- **Body and UI:** Plus Jakarta Sans, weights 400–700.
- **Desktop sizes:** H1 60px, H2 48px, card title 22px, body 15–18px, eyebrow 14px uppercase with 0.12em tracking in cyan.
- **Mobile sizes:** H1 40px, H2 32px.

### Layout rules (client requirement)

- **Each section fills one screen on desktop:** `min-height: 100vh` (designed at 800px), with content vertically centered.
- **The hero includes the nav**, and the two together fit one screen.
- **The last screen is the CTA band plus the footer together.**
- **On mobile, sections take their natural height.** No forced full-screen sections.
- **Container:** max-width 1200px, 24px side padding on mobile, no horizontal scroll at 390px.
- **Section backgrounds alternate** between dark, white and subtle, as on the homepage.

### Components

- **Button:** Primary (cyan background, dark text), Dark (dark background, white text), Outline Light (white border, for dark sections). Padding 16px × 28px, 10px radius, bold 15px.
- **Nav:** white logo on dark; links Home / About / Course / Market News / Contact; "Enroll Now" button.
- **Feature item:** cyan-soft icon badge, title, description. Icons are Lucide-style inline SVGs.
- **News card:** dark raised card with source label, headline, and time.
- **Step item:** large cyan number, rule line, title, description.
- **Module card / accordion:** for the 5 program modules.
- **CTA band:** cyan, 28px radius, headline plus a dark button.
- **Footer:** logo, quick links, legal links, contact details, disclaimer box, copyright.
- **Floating WhatsApp button:** bottom right, links to wa.me.

## Pages

1. **Home:** hero, Why Tradot (4 features), program preview (₹16,500, 25 days, online/offline), how it works (4 steps), market news preview (4 cards), testimonials (only if real), CTA, footer.
2. **About:** story and values, mentors (3 cards), how classes work (online/offline, live from day 1, recordings, doubt support).
3. **Course (single program page):** replaces the multi-course listing. Hero with a fee card (₹16,500, Enroll / Ask on WhatsApp), what you'll learn (the 5 modules), who it's for, syllabus accordion across 25 days, mentor, FAQ.
4. **Market News:** source filter (All / Moneycontrol / Investing.com), top 6 cards, more-headlines list, attribution note.
5. **Contact:** phone, WhatsApp, email, Kalamassery address and hours; the WhatsApp form; map embed.
6. **Legal pages:** Privacy Policy, Terms & Conditions, Disclaimer.

## Design direction (quality bar)

The client wants the site to feel as polished as these references. The current Figma/HTML designs are the **content and structure** reference; this section sets the **look and motion**, and wins where they conflict.

| Site | What to take from it |
|---|---|
| curbstudio.in (**main reference**) | Huge full-width wordmark hero that shrinks into the nav logo on scroll; Lenis smooth scroll; small custom dot cursor; rotating word in a headline; big text list where the hovered item turns dark and the rest stay grey, with a preview image beside it; small monospace uppercase labels; lots of white space; giant uppercase CTA above a minimal footer. |
| bermito.com | Full-bleed video/photo hero with centered headline; scrolling marquee announcement bar; a circle that scales up as you scroll to reveal a statement; warm, confident, not generic. |
| lushlineuae.com | GSAP ScrollTrigger reveals; elegant serif display type; alternating large photo + text rows; nav that changes background on scroll; floating WhatsApp button. |
| bayroot.vercel.app | Nehyan's own earlier site, which the client liked. Match its overall polish. (Couldn't be inspected in-browser; check it locally.) |

**What makes them look premium, and what to avoid:**
- **Real photography** is the biggest factor. Push the client for trainer, classroom and student photos. No illustrated person placeholders, glows, fake dashboards or stock-looking 3D in production.
- **Restraint:** one accent color, lots of space, few borders and shadows. Avoid card-grid-everywhere layouts and gradient blobs, which read as AI-generated.
- **Typographic contrast:** very large display type against small monospace labels.
- Keep the brand cyan `#00B8D4` and charcoal from the logo, but use them sparingly against plenty of white or near-black space.
- Add a monospace font for labels and eyebrows (`@fontsource/dm-mono` or `@fontsource/jetbrains-mono`).

## Animations (modelled on curbstudio.in)

Motion should feel smooth and confident, never gimmicky. Build these in priority order; stop when time runs out before the 15 Oct deadline.

1. **Lenis smooth scroll**, synced with ScrollTrigger (`lenis.on('scroll', ScrollTrigger.update)` and drive Lenis from `gsap.ticker`).
2. **Wordmark hero → nav logo:** the hero shows "TRADOT" edge to edge; on scroll it scales down and moves into the nav logo position (ScrollTrigger scrub). Below it, a one-line statement and the CTAs.
3. **Text reveals:** headings split into lines with SplitText and slide up from a mask (`overflow: hidden`, `yPercent: 100 → 0`, stagger 0.08) when they enter the viewport.
4. **Rotating word:** "Trade with [clarity / discipline / a plan / confidence]," cycling every ~2s with a vertical slide.
5. **Modules hover list:** the 5 modules as large text lines, grey by default; the hovered line turns full ink and a preview (image or short description) appears beside it. On mobile, show as a simple list.
6. **Marquee strip:** "Online & Offline · Live from Day 1 · 25 Days · Basic to Advance · Kalamassery, Kochi", looping horizontally (CSS animation, pause on hover).
7. **Scroll-scaled reveal (Bermito-style):** a cyan circle that grows with scroll to reveal the fee/program statement ("₹16,500 · 25 days · Basic to Advance").
8. **Image reveals:** photos uncover with a `clip-path: inset()` animation and a slight scale from 1.1 to 1.
9. **Custom cursor:** small dot that follows the mouse with easing and grows over links and buttons. Desktop and fine pointers only (`@media (pointer: fine)`).
10. **Big footer CTA:** giant uppercase line, e.g. "START TRADING WITH A PLAN.", with the text reveal.
11. **Page transitions:** `<ClientRouter />` fade. Re-initialise GSAP, ScrollTrigger and Lenis on `astro:page-load` and kill them on `astro:before-swap` to avoid duplicates.

**Rules:**
- Respect `prefers-reduced-motion`: disable Lenis, the cursor, scrubbed and split-text animations, and show content immediately.
- Animate only `transform` and `opacity` (plus `clip-path` for reveals). No layout-triggering properties.
- Content must be visible without JavaScript: set initial hidden states from JS, not in CSS.
- Test on a mid-range Android phone; turn off the cursor and heavy scrubs on touch devices.

## Suggested structure

```
src/
  layouts/Base.astro        head, fonts, nav, footer, WhatsApp float, GSAP setup
  components/               Button, Nav, Footer, Section, FeatureItem, NewsCard,
                            StepItem, CtaBand, ContactForm, Accordion
  data/program.ts           fee, duration, modules, FAQ (single source of truth)
  data/news.ts              build-time RSS fetch + parse + fallback
  pages/                    index, about, course, market-news, contact, privacy, terms, disclaimer
  styles/tokens.css         design tokens + base styles
public/
  logo-white.png            for dark backgrounds
  logo.png                  original colors, for light backgrounds
reference/                  HTML design references (not deployed)
```

## Build order (to hit 15 Oct)

1. Scaffold, tokens, fonts, Base layout, nav, footer, **Lenis + GSAP setup** (so every page is built with motion in mind)
2. Home, including animations 1–6 from the list
3. Course, About, Contact
4. Market News with the build-time RSS fetch
5. Legal pages; SEO (per-page title and meta, sitemap, Open Graph image); favicon
6. Remaining animations (7–11)
7. Mobile QA at 390px, reduced-motion check, Lighthouse check, deploy to Cloudflare Pages, connect the domain

## Working preferences

- Direct, actionable answers. Keep explanations short.
- Minimal, targeted changes. Don't refactor what works.
- Ask before adding dependencies beyond those listed above.