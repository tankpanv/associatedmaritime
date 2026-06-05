'use client';
import { usePathname } from 'next/navigation';
import { useEffect } from 'react';

// Replicates the original GSAP scroll reveals (vendor.js, dead on the live host)
// with the Web Animations API: JS-driven like GSAP, expo easing + stagger.
const EASE = 'cubic-bezier(0.16, 1, 0.3, 1)'; // ≈ GSAP expo.out / power4.out
const STAGGER = 85; // ms between staggered children

export default function Reveal() {
  const pathname = usePathname();

  useEffect(() => {
    if (typeof window === 'undefined') return;
    document.body.classList.add('rx-anim');
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const run = (el, frames, opts) => {
      try {
        const a = el.animate(frames, { fill: 'both', easing: EASE, ...opts });
        a.onfinish = () => { try { a.commitStyles(); a.cancel(); } catch {} };
      } catch {}
    };
    const fadeUp = (el, i, dy = 38, dur = 1000) =>
      run(el, [{ opacity: 0, transform: `translateY(${dy}px)` }, { opacity: 1, transform: 'none' }],
        { duration: dur, delay: i * STAGGER });

    const reveal = (el) => {
      if (el.dataset.rxDone) return;
      el.dataset.rxDone = '1';
      if (reduce) return; // CSS already shows everything under reduced-motion

      // masked title: words wipe up from behind the clip, staggered
      if (el.classList.contains('mask-bottom') || el.classList.contains('mask-top')) {
        const spans = el.querySelectorAll(':scope span');
        spans.forEach((s, i) =>
          run(s, [{ opacity: 0, transform: 'translateY(110%)' }, { opacity: 1, transform: 'none' }],
            { duration: 850, delay: i * STAGGER }));
        const ul = el.querySelector('i'); // page-title underline grows after the text
        if (ul) run(ul, [{ width: '0px' }, { width: '45px' }],
          { duration: 650, delay: 200 + spans.length * STAGGER * 0.4 });
        return;
      }
      // plain page title (e.g. services h1) — just grow the underline
      if (el.classList.contains('page-title')) {
        const ul = el.querySelector('i');
        if (ul) run(ul, [{ width: '0px' }, { width: '45px' }], { duration: 650, delay: 150 });
        return;
      }
      // home service grid — tiles fade up, staggered
      if (el.classList.contains('home-services')) {
        el.querySelectorAll(':scope > li').forEach((li, i) => fadeUp(li, i, 42, 900));
        return;
      }
      // a service section — title + copy fade up, photo scales in
      if (el.matches('.services > li')) {
        el.querySelectorAll('.service-title h2, .service-title p, .service-desc > *')
          .forEach((t, i) => fadeUp(t, i, 30, 900));
        const img = el.querySelector('.service-image');
        if (img) run(img, [{ opacity: 0, transform: 'scale(1.07)' }, { opacity: 1, transform: 'none' }],
          { duration: 1100 });
        return;
      }
      // generic reveal / reveal-left / reveal-right — children, staggered
      const left = el.classList.contains('reveal-left');
      const right = el.classList.contains('reveal-right');
      const from = left ? 'translateX(-50px)' : right ? 'translateX(50px)' : 'translateY(38px)';
      const kids = el.children.length ? Array.from(el.children) : [el];
      kids.forEach((k, i) =>
        run(k, [{ opacity: 0, transform: from }, { opacity: 1, transform: 'none' }],
          { duration: 1000, delay: i * STAGGER }));
    };

    const SEL = '.reveal, .reveal-left, .reveal-right, .mask-bottom, .mask-top, .page-title, .home-services, .services > li';
    const targets = Array.from(document.querySelectorAll(SEL));

    let io = null;
    if ('IntersectionObserver' in window) {
      io = new IntersectionObserver((entries) => {
        entries.forEach((e) => { if (e.isIntersecting) { reveal(e.target); io.unobserve(e.target); } });
      }, { rootMargin: '0px 0px -10% 0px', threshold: 0.12 });
      targets.forEach((t) => io.observe(t));
    } else {
      targets.forEach(reveal);
    }
    // safety net so nothing can stay hidden
    const fallback = setTimeout(() => targets.forEach(reveal), 2500);

    return () => { if (io) io.disconnect(); clearTimeout(fallback); };
  }, [pathname]);

  return null;
}
