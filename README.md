# Tradot Academy website

Static Astro site for Tradot Academy, Kalamassery, Kochi. See `CLAUDE.md` for scope, design and build order.

```sh
npm install
npm run dev      # localhost:4321
npm run build    # static output in dist/
```

- `src/layouts/Base.astro`: head, fonts, nav, footer, WhatsApp button, `<ClientRouter />`
- `src/scripts/motion.ts`: GSAP + ScrollTrigger + SplitText, Lenis. Add page animations with `onPageMotion(setup)`.
- `src/styles/tokens.css`: design tokens and base styles
- `src/scripts/animations.ts`: text reveals, fade-ups, rotating word, wordmark → nav logo, scroll circle, image reveals, custom cursor (see the header comment)
- `src/data/site.ts`: phone, WhatsApp, links, disclaimer
- `src/data/program.ts`: fee, duration, modules, syllabus, FAQ
- `src/data/news.ts`: build-time RSS fetch (Moneycontrol, Investing.com) with graceful fallback
- `src/data/mentors.ts`: placeholder mentors (replace before launch)
- `src/layouts/Legal.astro`: shared shell for Privacy, Terms and Disclaimer
- `src/pages/sitemap.xml.ts`, `robots.txt.ts`, `news.json.ts`: generated at build
- `reference/`: HTML design references (not deployed)

Deployment, domain and scheduled news rebuilds: see [DEPLOY.md](DEPLOY.md).

## Still needed from the client

Search the code for `TODO(client)`: trainer names/photos/bios, academy photos, email, full address and map link,
hours, social links, next batch date, the real "our story" copy, syllabus day split, confirmation of
recordings and doubt support, refund rules, and a legal/compliance review of the Privacy, Terms and Disclaimer pages.
Also set the real domain (`SITE_URL`).
