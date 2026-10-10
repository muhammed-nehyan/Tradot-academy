// Shared scroll and text animations, wired by data attributes:
//   [data-split]     heading lines slide up from a mask
//   [data-reveal]    element fades up when it enters (siblings stagger)
//   [data-rotate]    cycles its [data-rotate-word] children
//   [data-wordmark]  hero wordmark scales into the nav logo on scroll
//   [data-statement] cyan circle grows with scroll (pinned)
//   [data-img-reveal] clip-path uncover + scale 1.1 → 1
//   [data-cursor]    custom dot cursor (fine pointers only)
// Initial hidden states are set here, so content shows without JS.

import { gsap, ScrollTrigger, SplitText, onPageMotion } from './motion';

onPageMotion(({ reduced }) => {
  if (reduced) return;

  // Text reveals
  gsap.utils.toArray<HTMLElement>('[data-split]').forEach((el) => {
    SplitText.create(el, {
      type: 'lines',
      mask: 'lines',
      autoSplit: true,
      onSplit: (self) =>
        gsap.from(self.lines, {
          yPercent: 100,
          duration: 1,
          ease: 'power4.out',
          stagger: 0.08,
          scrollTrigger: { trigger: el, start: 'top 88%', once: true },
        }),
    });
  });

  // Fade-up reveals, batched so items entering together stagger.
  const reveals = gsap.utils.toArray<HTMLElement>('[data-reveal]');
  gsap.set(reveals, { autoAlpha: 0, y: 32 });
  ScrollTrigger.batch(reveals, {
    start: 'top 90%',
    once: true,
    onEnter: (batch) =>
      gsap.to(batch, { autoAlpha: 1, y: 0, duration: 0.9, ease: 'power3.out', stagger: 0.08, overwrite: true }),
  });
});

// Rotating word: vertical slide every ~2s. Static for reduced motion.
onPageMotion(({ reduced }) => {
  if (reduced) return;
  gsap.utils.toArray<HTMLElement>('[data-rotate]').forEach((wrap) => {
    const words = gsap.utils.toArray<HTMLElement>('[data-rotate-word]', wrap);
    if (words.length < 2) return;

    wrap.classList.add('is-rotating');
    gsap.set(words.slice(1), { yPercent: 110 });
    let i = 0;
    const tl = gsap.timeline({ repeat: -1 });
    words.forEach(() => {
      const cur = words[i];
      const next = words[(i + 1) % words.length];
      tl.to(cur, { yPercent: -110, duration: 0.6, ease: 'power3.inOut' }, '+=1.6')
        .fromTo(next, { yPercent: 110 }, { yPercent: 0, duration: 0.6, ease: 'power3.inOut' }, '<');
      i = (i + 1) % words.length;
    });
    return () => wrap.classList.remove('is-rotating');
  });
});

// Wordmark → nav logo. The wordmark stays in flow; its transform compensates
// for scroll so it travels in a straight line to the nav logo's box.
onPageMotion(({ reduced }) => {
  const word = document.querySelector<HTMLElement>('[data-wordmark]');
  const logo = document.querySelector<HTMLElement>('[data-nav-logo]');
  if (!word || !logo || reduced) return;

  const distance = () => Math.min(window.innerHeight * 0.6, 520);
  // Measure untransformed boxes (page coordinates for the wordmark).
  const box = () => {
    const w = word.getBoundingClientRect();
    const l = logo.getBoundingClientRect();
    return { w: { left: w.left, top: w.top + window.scrollY, width: w.width, height: w.height }, l };
  };
  let m = box();
  // Hand over from wordmark to the real logo at the end of the scrub.
  const swap = (progress: number) => {
    const done = progress > 0.98;
    gsap.set(logo, { autoAlpha: done ? 1 : 0 });
    gsap.set(word, { autoAlpha: done ? 0 : 1 });
  };

  gsap.set(logo, { autoAlpha: 0 });
  gsap.set(word, { transformOrigin: '0 0' });

  gsap.to(word, {
    ease: 'none',
    onUpdate(this: gsap.core.Tween) {
      swap(this.progress());
    },
    x: () => m.l.left - m.w.left,
    y: () => distance() + m.l.top + (m.l.height - m.w.height * (m.l.width / m.w.width)) / 2 - m.w.top,
    scale: () => m.l.width / m.w.width,
    scrollTrigger: {
      trigger: document.body,
      start: 0,
      end: distance,
      scrub: true, // Lenis already smooths; a lagging scrub would break the scroll compensation.
      invalidateOnRefresh: true,
      onRefreshInit: () => {
        // Measure with transforms cleared.
        gsap.set(word, { clearProps: 'transform' });
        m = box();
      },
    },
  });
});

// Scroll-scaled circle (Bermito-style). Reduced motion gets the static cyan section.
// Desktop (mouse, >1000px): pinned scrub. Mobile/touch: the circle grows as the
// section scrolls into view, without pinning, so there's no extra scroll space.
// matchMedia rebuilds the right version (pin spacer included) whenever the
// viewport crosses the breakpoint.
onPageMotion(() => {
  const section = document.querySelector<HTMLElement>('[data-statement]');
  if (!section) return;
  const circle = section.querySelector('[data-statement-circle]');
  const text = section.querySelector('[data-statement-text]');

  const grow = (scrollTrigger: ScrollTrigger.Vars) =>
    gsap
      .timeline({ scrollTrigger })
      .fromTo(circle, { scale: 0.04 }, { scale: 1, ease: 'power2.in', duration: 1 })
      // Text comes in once the circle covers the section, so it never spills past the edge.
      .fromTo(text, { autoAlpha: 0, y: 40 }, { autoAlpha: 1, y: 0, ease: 'power2.out', duration: 0.35 }, 0.8);

  const mm = gsap.matchMedia();
  mm.add(
    {
      desktop: '(min-width: 1001px) and (hover: hover) and (pointer: fine)',
      motion: '(prefers-reduced-motion: no-preference)',
    },
    (ctx) => {
      const { desktop, motion } = ctx.conditions as { desktop: boolean; motion: boolean };
      if (!motion) return;
      if (desktop) grow({ trigger: section, start: 'top top', end: '+=120%', scrub: true, pin: true });
      else grow({ trigger: section, start: 'top 85%', end: 'bottom 75%', scrub: true });
    },
  );
  return () => mm.revert();
});

// Image reveals: uncover with clip-path while the content settles from 1.1 to 1.
onPageMotion(({ reduced }) => {
  if (reduced) return;
  gsap.utils.toArray<HTMLElement>('[data-img-reveal]').forEach((el) => {
    const inner = el.firstElementChild;
    const tl = gsap.timeline({ scrollTrigger: { trigger: el, start: 'top 85%', once: true } });
    tl.fromTo(el, { clipPath: 'inset(100% 0% 0% 0%)' }, { clipPath: 'inset(0% 0% 0% 0%)', duration: 1.2, ease: 'power4.inOut' });
    if (inner) tl.fromTo(inner, { scale: 1.1 }, { scale: 1, duration: 1.6, ease: 'power3.out' }, 0);
  });
});

// Custom cursor: small dot with easing that grows over links and buttons.
// Mouse/trackpad only, never with reduced motion. The native cursor stays.
onPageMotion(({ reduced, finePointer }) => {
  const dot = document.querySelector<HTMLElement>('[data-cursor]');
  if (!dot || reduced || !finePointer) return;

  document.documentElement.classList.add('has-cursor');
  // 44px dot drawn at 10px; hovering scales it up (transform + opacity only).
  const rest = { scale: 10 / 44, opacity: 1 };
  const grown = { scale: 1, opacity: 0.35 };
  gsap.set(dot, { xPercent: -50, yPercent: -50, autoAlpha: 0, ...rest });
  let hovering = false;
  const x = gsap.quickTo(dot, 'x', { duration: 0.35, ease: 'power3.out' });
  const y = gsap.quickTo(dot, 'y', { duration: 0.35, ease: 'power3.out' });
  const interactive = 'a, button, summary, label, input, textarea, [role="button"], [tabindex="0"]';

  const move = (e: PointerEvent) => {
    if (e.pointerType !== 'mouse') return;
    dot.style.visibility = 'visible';
    x(e.clientX);
    y(e.clientY);
    const hover = !!(e.target as Element | null)?.closest?.(interactive);
    if (hover !== hovering || dot.style.opacity === '0') {
      hovering = hover;
      gsap.to(dot, { ...(hover ? grown : rest), duration: 0.35, ease: 'power3.out', overwrite: 'auto' });
    }
  };
  const leave = () => gsap.to(dot, { opacity: 0, duration: 0.2, overwrite: 'auto' });

  window.addEventListener('pointermove', move, { passive: true });
  document.documentElement.addEventListener('pointerleave', leave);
  return () => {
    window.removeEventListener('pointermove', move);
    document.documentElement.removeEventListener('pointerleave', leave);
    document.documentElement.classList.remove('has-cursor');
  };
});
