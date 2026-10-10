// Global motion setup: GSAP + ScrollTrigger + SplitText, Lenis smooth scroll,
// and lifecycle hooks for Astro's <ClientRouter />.
//
// Pages add their animations with `onPageMotion(setup)`. Each setup runs inside
// a gsap.context() on every `astro:page-load` and is reverted on
// `astro:before-swap`, so nothing is duplicated across page transitions.
// Content is visible without JS: set hidden start states inside setup (e.g.
// gsap.from), never in CSS.

import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';
import Lenis from 'lenis';

gsap.registerPlugin(ScrollTrigger, SplitText);

export { gsap, ScrollTrigger, SplitText };

export type MotionEnv = {
  /** User prefers reduced motion: show content immediately, skip scrubs/splits. */
  reduced: boolean;
  /** Mouse/trackpad device: safe for the cursor and heavy scrubs. */
  finePointer: boolean;
  lenis: Lenis | null;
};

type Setup = (env: MotionEnv) => void | (() => void);

const setups = new Set<Setup>();
let contexts: gsap.Context[] = [];
let lenis: Lenis | null = null;
let tick: ((time: number) => void) | null = null;
let pageReady = false;

const reducedQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
const fineQuery = window.matchMedia('(hover: hover) and (pointer: fine)');

export const getLenis = () => lenis;

function env(): MotionEnv {
  return { reduced: reducedQuery.matches, finePointer: fineQuery.matches, lenis };
}

function runSetup(setup: Setup) {
  const e = env();
  contexts.push(gsap.context(() => setup(e)));
}

/** Register page animations. Safe to call from any page or component script. */
export function onPageMotion(setup: Setup) {
  setups.add(setup);
  // Scripts can load after the first page-load event has fired.
  if (pageReady) runSetup(setup);
}

function startLenis() {
  if (reducedQuery.matches) return;
  lenis = new Lenis({ autoRaf: false, anchors: true });
  lenis.on('scroll', ScrollTrigger.update);
  tick = (time) => lenis?.raf(time * 1000);
  gsap.ticker.add(tick);
  gsap.ticker.lagSmoothing(0);
}

function stopLenis() {
  if (tick) gsap.ticker.remove(tick);
  lenis?.destroy();
  lenis = null;
  tick = null;
}

function initNav() {
  const nav = document.querySelector<HTMLElement>('[data-nav]');
  const toggle = nav?.querySelector<HTMLButtonElement>('[data-nav-toggle]');
  if (!nav || !toggle) return;

  const setOpen = (open: boolean) => {
    nav.classList.toggle('is-open', open);
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    if (open) lenis?.stop();
    else lenis?.start();
  };

  toggle.addEventListener('click', () => setOpen(!nav.classList.contains('is-open')));
  nav.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && nav.classList.contains('is-open')) {
      setOpen(false);
      toggle.focus();
    }
  });

  // Solid background once the page leaves the top.
  const onScroll = () => nav.classList.toggle('is-scrolled', window.scrollY > 40);
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });
  return () => window.removeEventListener('scroll', onScroll);
}

document.addEventListener('astro:page-load', () => {
  startLenis();
  pageReady = true;
  runSetup(initNav);
  setups.forEach(runSetup);
  ScrollTrigger.refresh();
});

document.addEventListener('astro:before-swap', () => {
  pageReady = false;
  contexts.forEach((ctx) => ctx.revert());
  contexts = [];
  ScrollTrigger.getAll().forEach((st) => st.kill());
  stopLenis();
});

// Fonts change line lengths; re-measure triggers once they're in.
document.fonts?.ready.then(() => ScrollTrigger.refresh());
