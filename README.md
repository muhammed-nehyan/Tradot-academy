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
- `src/scripts/animations.ts`: text reveals (`data-split`), fade-ups (`data-reveal`), rotating word (`data-rotate`), wordmark → nav logo (`data-wordmark`)
- `src/data/site.ts`: phone, WhatsApp, links, disclaimer
- `src/data/program.ts`: fee, duration, modules, syllabus, FAQ
- `src/data/news.ts`: build-time RSS fetch (Moneycontrol, Investing.com) with graceful fallback
- `src/data/mentors.ts`: placeholder mentors (replace before launch)
- `reference/`: HTML design references (not deployed)

## Still needed from the client

Search the code for `TODO(client)`: trainer names/photos/bios, academy photos, email, full address and map link,
hours, social links, next batch date, the real "our story" copy, syllabus day split, and confirmation of
recordings and doubt support.
