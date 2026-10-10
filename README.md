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
- `src/data/site.ts`: phone, WhatsApp, links, disclaimer
- `reference/`: HTML design references (not deployed)
