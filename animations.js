/**
 * animations.js — RF Explorer animation engine
 * ──────────────────────────────────────────────────────────────────
 * All runtime animation relies ONLY on:
 *   • transform   (GPU-composited, no layout)
 *   • opacity     (GPU-composited, no layout)
 *   • filter      (GPU-composited — used for hue-rotate in CSS)
 *
 * JS writes CSS custom properties; CSS reads them in transform rules.
 *
 * Modules:
 *  CursorModule   — dot + lagging ring, lerp(.12), hover expand
 *  TiltModule     — 3D card tilt via mouse delta maths
 *  ObserverModule — IntersectionObserver for slide reveals + home
 *  FlipModule     — FLIP paper-stretch card → hero transition
 *  SlideModule    — progress dots + snav button wiring
 */

'use strict';

/* ═══════════════════════════════════════════════════════════════════
   CURSOR MODULE
   ──────────────────────────────────────────────────────────────────
   #cd  = small dot, snaps to mouse position exactly every frame
   #cr  = large ring, lerps toward cursor at t=0.12 per frame
           giving a smooth "lag" trailing feel

   lerp(a, b, t) = a + (b − a) × t
     at t=0.12: each frame the ring moves 12% of remaining distance
     → exponential decay → feels organic, never overshoots

   On pointer:fine devices only (not touch).
   ═══════════════════════════════════════════════════════════════════ */
const CursorModule = (() => {
  const cd = document.getElementById('cd');
  const cr = document.getElementById('cr');
  if (!cd || !cr) return { setHov: () => {}, attach: () => {} };

  const hasFine = window.matchMedia('(pointer: fine)').matches;
  let ringPos = { x: -200, y: -200 };
  let curRef  = { x: -200, y: -200 };
  let raf;

  const lerp = (a, b, t) => a + (b - a) * t;

  if (hasFine) {
    const tick = () => {
      ringPos.x = lerp(ringPos.x, curRef.x, 0.12);
      ringPos.y = lerp(ringPos.y, curRef.y, 0.12);
      cr.style.left = ringPos.x + 'px';
      cr.style.top  = ringPos.y + 'px';
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    window.addEventListener('mousemove', e => {
      curRef.x = e.clientX;
      curRef.y = e.clientY;
      cd.style.left = e.clientX + 'px';
      cd.style.top  = e.clientY + 'px';
    }, { passive: true });
  }

  const setHov = (on) => {
    cd.classList.toggle('h', on);
    cr.classList.toggle('h', on);
  };

  const attach = () => {
    document.querySelectorAll(
      'a, button, .rf-card, .rnode, .stat-tile, .media-tile, .snav, .p-dot'
    ).forEach(el => {
      el.addEventListener('mouseenter', () => setHov(true),  { passive: true });
      el.addEventListener('mouseleave', () => setHov(false), { passive: true });
    });
  };

  /* Re-attach after dynamic DOM changes (new cards rendered) */
  const reAttach = () => attach();

  document.addEventListener('DOMContentLoaded', attach);

  return { setHov, attach, reAttach };
})();


/* ═══════════════════════════════════════════════════════════════════
   TILT MODULE  — 3D Card Tilt
   ──────────────────────────────────────────────────────────────────
   MATHS (per card, on every mousemove):

     rect     = card.getBoundingClientRect()
     centreX  = rect.left + rect.width  / 2
     centreY  = rect.top  + rect.height / 2

     deltaX   = clientX − centreX    (+ve → cursor right of centre)
     deltaY   = clientY − centreY    (+ve → cursor below centre)

   Normalise to [−1, +1]:
     nx = deltaX / (width  / 2)
     ny = deltaY / (height / 2)

   Clamp and map to degrees:
     rotateY  = +nx × MAX     (tilt right when cursor moves right)
     rotateX  = −ny × MAX     (tilt up   when cursor moves below)

   Glare hotspot (% for CSS radial-gradient centre):
     gx = (nx × 0.5 + 0.5) × 100   → 0 – 100 %
     gy = (ny × 0.5 + 0.5) × 100   → 0 – 100 %

   All values written as CSS custom properties → CSS reads them.
   rAF is throttled per-card via WeakMap to avoid duplicate frames.
   ═══════════════════════════════════════════════════════════════════ */
const TiltModule = (() => {
  const MAX   = 13;   // max degrees of tilt
  const HOVER = 1.04; // scale on hover
  const rafMap = new WeakMap();

  const clamp = (v, lo, hi) => Math.min(Math.max(v, lo), hi);

  const onEnter = function() {
    this.style.transition = 'transform 80ms var(--ease-o), border-color 250ms, box-shadow 350ms';
  };

  const onMove = function(e) {
    const card = this;
    if (rafMap.has(card)) cancelAnimationFrame(rafMap.get(card));

    rafMap.set(card, requestAnimationFrame(() => {
      const r  = card.getBoundingClientRect();
      const W  = r.width, H = r.height;
      const dx = e.clientX - (r.left + W * 0.5);
      const dy = e.clientY - (r.top  + H * 0.5);

      const nx = clamp(dx / (W * 0.5), -1, 1);
      const ny = clamp(dy / (H * 0.5), -1, 1);

      card.style.setProperty('--ry',  `${nx * MAX}deg`);
      card.style.setProperty('--rx',  `${-ny * MAX}deg`);
      card.style.setProperty('--sc',  HOVER);
      card.style.setProperty('--gx',  `${(nx * 0.5 + 0.5) * 100}%`);
      card.style.setProperty('--gy',  `${(ny * 0.5 + 0.5) * 100}%`);
      rafMap.delete(card);
    }));
  };

  const onLeave = function() {
    if (rafMap.has(this)) { cancelAnimationFrame(rafMap.get(this)); rafMap.delete(this); }
    this.style.transition = 'transform 400ms var(--ease-o), border-color 250ms, box-shadow 350ms';
    this.style.setProperty('--rx', '0deg');
    this.style.setProperty('--ry', '0deg');
    this.style.setProperty('--sc', '1');
  };

  const init = (cards) => {
    cards.forEach(card => {
      card.addEventListener('mouseenter', onEnter, { passive: true });
      card.addEventListener('mousemove',  onMove,  { passive: true });
      card.addEventListener('mouseleave', onLeave, { passive: true });
    });
  };

  return { init };
})();


/* ═══════════════════════════════════════════════════════════════════
   OBSERVER MODULE  — IntersectionObserver reveals
   ═══════════════════════════════════════════════════════════════════ */
const ObserverModule = (() => {
  let elemObs  = null;
  let slideObs = null;
  let homeObs  = null;

  /* ── Component page: element reveals + slide tracking ── */
  const initComponentObservers = () => {
    const root = document.getElementById('compScroll');
    if (!root) return;

    /* Reveal .io-anim and .io-anim-img when they scroll into view */
    const animEls = root.querySelectorAll('.io-anim, .io-anim-img');
    if (animEls.length) {
      elemObs = new IntersectionObserver(entries => {
        entries.forEach(e => {
          if (e.isIntersecting) {
            e.target.classList.add('is-vis');
            elemObs.unobserve(e.target); // fire once
          }
        });
      }, { root, threshold: 0.12 });
      animEls.forEach(el => elemObs.observe(el));
    }

    /* Track active slide → update progress dots + navbar */
    const slides = root.querySelectorAll('.cs');
    if (slides.length) {
      slideObs = new IntersectionObserver(entries => {
        entries.forEach(e => {
          if (!e.isIntersecting) return;
          const idx = Number(e.target.dataset.slide ?? 0);
          SlideModule.updateDots(idx);
          const nav = document.getElementById('navbar');
          if (nav) nav.classList.toggle('is-visible', idx > 0);
        });
      }, { root, threshold: 0.55 });
      slides.forEach(s => slideObs.observe(s));
      SlideModule.buildDots(slides.length);
    }
  };

  /* ── Home page: section observer for roadmap + chapter label ── */
  const initHomeObserver = () => {
    const wrap = document.getElementById('homeSnap');
    const navChapter = document.getElementById('navChapter');
    if (!wrap) return;

    const sections = wrap.querySelectorAll('.hs');
    homeObs = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (!e.isIntersecting) return;
        /* Update navbar chapter label */
        if (navChapter) {
          navChapter.style.transition = 'opacity 250ms';
          navChapter.style.opacity = '0';
          setTimeout(() => {
            navChapter.textContent = e.target.dataset.chapter || '';
            navChapter.style.opacity = '1';
          }, 260);
        }
        /* Activate roadmap drawing */
        if (e.target.classList.contains('hs-roadmap')) {
          e.target.classList.add('is-active');
        }
      });
    }, { root: wrap, threshold: 0.5 });
    sections.forEach(s => homeObs.observe(s));

    /* Navbar scrolled state */
    const hero = wrap.querySelector('.hs-hero');
    if (hero) {
      new IntersectionObserver(([entry]) => {
        document.getElementById('navbar')?.classList.toggle('is-scrolled', !entry.isIntersecting);
      }, { root: wrap, threshold: 0.05 }).observe(hero);
    }
  };

  /* ── Cards page: navbar scrolled ── */
  const initCardsObserver = () => {
    const hd = document.querySelector('.cards-hd');
    if (!hd) return;
    new IntersectionObserver(([entry]) => {
      document.getElementById('navbar')?.classList.toggle('is-scrolled', !entry.isIntersecting);
    }, { threshold: 0.1 }).observe(hd);
  };

  return { initComponentObservers, initHomeObserver, initCardsObserver };
})();


/* ═══════════════════════════════════════════════════════════════════
   SLIDE MODULE  — progress dots + nav button wiring
   ═══════════════════════════════════════════════════════════════════ */
const SlideModule = (() => {
  const scrollTo = (idx) => {
    const wrap   = document.getElementById('compScroll');
    const slides = document.querySelectorAll('.cs');
    if (wrap && slides[idx]) slides[idx].scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const buildDots = (count) => {
    const container = document.getElementById('progDots');
    if (!container) return;
    container.innerHTML = '';
    for (let i = 0; i < count; i++) {
      const d = document.createElement('button');
      d.className = `p-dot${i === 0 ? ' is-a' : ''}`;
      d.setAttribute('aria-label', `Go to slide ${i + 1}`);
      d.dataset.t = i;
      d.addEventListener('click', () => scrollTo(i));
      container.appendChild(d);
    }
    /* Re-attach cursor hover to new dots */
    CursorModule.reAttach();
  };

  const updateDots = (activeIdx) => {
    document.querySelectorAll('.p-dot').forEach((d, i) => {
      d.classList.toggle('is-a', i === activeIdx);
    });
  };

  const initNavButtons = () => {
    document.querySelectorAll('.snav').forEach(btn => {
      btn.addEventListener('click', () => scrollTo(Number(btn.dataset.target ?? 0)));
    });
    document.getElementById('btnBegin')?.addEventListener('click', () => scrollTo(1));
  };

  return { scrollTo, buildDots, updateDots, initNavButtons };
})();


/* ═══════════════════════════════════════════════════════════════════
   FLIP MODULE  — paper-stretch cross-page transition
   ──────────────────────────────────────────────────────────────────
   TECHNIQUE: FLIP (First → Last → Invert → Play)

   SENDER (cards.html):
   ─────────────────────
   1. Capture card.getBoundingClientRect()                = FIRST
   2. Ghost is position:fixed 0,0, width:100vw, h:100dvh = LAST (natural)
   3. Apply INVERSE transform so ghost VISUALLY sits at card:
        transform-origin: top left
        translateX(cardX) translateY(cardY) scaleX(cW/vw) scaleY(cH/vh)
   4. Force reflow (getBoundingClientRect)
   5. Add class → CSS transition fires from FIRST to LAST state
      (remove transform → ghost animates to full screen)

   RECEIVER (component.html):
   ───────────────────────────
   Same inverse transform applied to .entry-ghost.
   Transition to transform:none (expand to full screen).
   Then fade ghost opacity → 0 to reveal real content underneath.

   Only transform + opacity → always composited, never triggers layout.
   ═══════════════════════════════════════════════════════════════════ */
const FlipModule = (() => {
  const STORE   = 'rf_flip_rect';
  const FLIP_MS = 580;

  /* Called on card click in cards.html */
  const expand = (cardEl, afterFn) => {
    const rect = cardEl.getBoundingClientRect();
    try {
      sessionStorage.setItem(STORE, JSON.stringify({
        x: rect.left, y: rect.top, w: rect.width, h: rect.height,
      }));
    } catch (_) {}

    const overlay = document.getElementById('flipOverlay');
    const ghost   = document.getElementById('flipGhost');
    if (!overlay || !ghost) { afterFn?.(); return; }

    const vw = window.innerWidth;
    const vh = window.innerHeight;

    /* Place ghost at card rect (INVERT) */
    ghost.style.transition      = 'none';
    ghost.style.opacity         = '1';
    ghost.style.width           = '100vw';
    ghost.style.height          = '100dvh';
    ghost.style.transform       = `translateX(${rect.left}px) translateY(${rect.top}px) scaleX(${rect.width/vw}) scaleY(${rect.height/vh})`;
    ghost.style.transformOrigin = 'top left';
    ghost.style.borderRadius    = '20px';

    overlay.style.opacity = '1';
    overlay.classList.add('is-active');

    /* Force reflow, then PLAY */
    ghost.getBoundingClientRect();
    ghost.classList.add('is-expanding');

    setTimeout(() => afterFn?.(), FLIP_MS + 40);
  };

  /* Called on component.html load */
  const enter = () => {
    const content = document.getElementById('csHeroContent');
    const ghost   = document.getElementById('entryGhost');

    let stored = null;
    try {
      const raw = sessionStorage.getItem(STORE);
      if (raw) { stored = JSON.parse(raw); sessionStorage.removeItem(STORE); }
    } catch (_) {}

    if (!stored || !ghost) {
      content?.classList.add('is-vis');
      return;
    }

    const vw = window.innerWidth;
    const vh = window.innerHeight;

    /* Place entry ghost at card rect (INVERT) */
    ghost.style.transition      = 'none';
    ghost.style.opacity         = '1';
    ghost.style.width           = '100vw';
    ghost.style.height          = '100dvh';
    ghost.style.transform       = `translateX(${stored.x}px) translateY(${stored.y}px) scaleX(${stored.w/vw}) scaleY(${stored.h/vh})`;
    ghost.style.transformOrigin = 'top left';
    ghost.style.borderRadius    = '20px';

    /* Reflow then PLAY */
    ghost.getBoundingClientRect();
    ghost.classList.add('is-expanding');

    /* After expanding to full screen, fade ghost to reveal content */
    setTimeout(() => {
      ghost.classList.add('is-fading');
      setTimeout(() => {
        content?.classList.add('is-vis');
        ghost.style.display = 'none';
      }, 340);
    }, FLIP_MS);
  };

  return { expand, enter };
})();

/* ═══════════════════════════════════════════════════════════════════
   MAGNETIC MODULE  — Buttons pull towards cursor
   ═══════════════════════════════════════════════════════════════════ */
   /* ═══════════════════════════════════════════════════════════════════
   PARALLAX MODULE  — Backgrounds react to cursor movement
   ═══════════════════════════════════════════════════════════════════ */
const ParallaxModule = (() => {
  let rafId = null;
  let targetX = 0, targetY = 0;
  let currentX = 0, currentY = 0;

  const init = () => {
    /* Target the rings on the home page and component page */
    const backdrops = document.querySelectorAll('.hero-rings, .cs-hero-rings');
    if (!backdrops.length) return;

    window.addEventListener('mousemove', (e) => {
      /* Calculate offset: max movement is +/- 25px */
      targetX = (e.clientX / window.innerWidth - 0.5) * -50;
      targetY = (e.clientY / window.innerHeight - 0.5) * -50;
    }, { passive: true });

    /* Smooth lerp for the parallax */
    const tick = () => {
      currentX += (targetX - currentX) * 0.08;
      currentY += (targetY - currentY) * 0.08;
      
      backdrops.forEach(bg => {
        bg.style.transform = `translate3d(${currentX}px, ${currentY}px, 0)`;
      });
      rafId = requestAnimationFrame(tick);
    };
    tick();
  };

  return { init };
})();
const MagneticModule = (() => {
  const init = () => {
    const magnets = document.querySelectorAll('.btn-fill, .btn-outline');
    
    magnets.forEach(btn => {
      btn.addEventListener('mousemove', (e) => {
        const rect = btn.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        
        /* Gently pull the button 20% towards the mouse */
        btn.style.transform = `translate(${x * 0.2}px, ${y * 0.2}px)`;
      });

      btn.addEventListener('mouseleave', () => {
        /* Snap back to center */
        btn.style.transform = `translate(0px, 0px)`;
      });
    });
  };

  return { init };
})();
/* ─── PUBLIC API ─────────────────────────────────────────────────── */
window.RFAnimations = {
  CursorModule,
  TiltModule,
  ObserverModule,
  FlipModule,
  SlideModule,
  MagneticModule,
  ParallaxModule 
};
