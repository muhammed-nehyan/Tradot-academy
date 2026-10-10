// Shared scroll and text animations, wired by data attributes:
//   [data-split]     heading lines slide up from a mask
//   [data-reveal]    element fades up when it enters (siblings stagger)
//   [data-rotate]    cycles its [data-rotate-word] children
//   [data-wordmark]  hero wordmark scales into the nav logo on scroll
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
