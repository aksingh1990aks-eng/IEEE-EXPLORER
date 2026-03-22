/**
 * main.js — RF Explorer page coordinator
 */

'use strict';

const PAGE = document.body.classList.contains('page-home')      ? 'home'
           : document.body.classList.contains('page-cards')     ? 'cards'
           : document.body.classList.contains('page-component') ? 'component'
           : null;
document.addEventListener('DOMContentLoaded', () => {
  _fadeIn();
  if (PAGE === 'home')      _home();
  if (PAGE === 'cards')     _cards();
  if (PAGE === 'component') _component();
});

function _home() {
  if (ObserverModule) ObserverModule.initHomeObserver();
  if (MagneticModule) MagneticModule.init();
  if (ParallaxModule) ParallaxModule.init();

  document.getElementById('btnStart')?.addEventListener('click', e => {
    e.preventDefault();
    _go('cards.html');
  });

  document.getElementById('btnDown')?.addEventListener('click', () => {
    document.getElementById('secRoadmap')?.scrollIntoView({ behavior:'smooth', block:'start' });
  });

  const wrap = document.getElementById('homeSnap');
  document.addEventListener('keydown', e => {
    if (!wrap) return;
    if (e.key === 'ArrowDown') { e.preventDefault(); wrap.scrollBy({ top: window.innerHeight, behavior:'smooth' }); }
    if (e.key === 'ArrowUp')   { e.preventDefault(); wrap.scrollBy({ top:-window.innerHeight, behavior:'smooth' }); }
  });
}

async function _cards() {
  if (ObserverModule) ObserverModule.initCardsObserver();

  const loading  = document.getElementById('cardsLoading');
  const error    = document.getElementById('cardsError');
  const errorMsg = document.getElementById('errorMsg');
  const grid     = document.getElementById('cardsGrid');

  document.getElementById('btnRetry')?.addEventListener('click', () => {
    error?.classList.add('hidden');
    loading?.classList.remove('hidden');
    _loadCards(loading, error, errorMsg, grid);
  });

  await _loadCards(loading, error, errorMsg, grid);
}

async function _loadCards(loading, error, errorMsg, grid) {
  loading?.classList.remove('hidden');
  grid?.classList.add('hidden');
  error?.classList.add('hidden');

  let data;
  try {
    data = await RFData.fetchComponentData();
  } catch (err) {
    loading?.classList.add('hidden');
    error?.classList.remove('hidden');
    if (errorMsg) errorMsg.textContent = err.message;
    return;
  }

  loading?.classList.add('hidden');
  if (grid) { grid.innerHTML = ''; grid.classList.remove('hidden'); }

  RFData.buildCardElements(data, grid, (comp, idx, cardEl) => {
    RFData.storeComp(comp);
    if (FlipModule) {
      FlipModule.expand(cardEl, () => { window.location.href = 'component.html'; });
    } else {
      window.location.href = 'component.html';
    }
  });

  const cards = grid?.querySelectorAll('.rf-card');
  if (cards?.length) {
    if (TiltModule) TiltModule.init(cards);
    if (CursorModule) CursorModule.reAttach();
  }
}

async function _component() {
  let comp = RFData.getComp();

  if (!comp) {
    try { const all = await RFData.fetchComponentData(); comp = all[0] ?? null; }
    catch (_) {}
  }
  if (!comp) { window.location.href = 'cards.html'; return; }

  RFData.populateComponentPage(comp);

  if (FlipModule) FlipModule.enter();
  if (ObserverModule) ObserverModule.initComponentObservers();
  if (SlideModule) SlideModule.initNavButtons();
  if (ParallaxModule) ParallaxModule.init();

  setTimeout(() => {
    document.getElementById('navbar')?.classList.add('is-visible');
    if (CursorModule) CursorModule.reAttach();
  }, 900);

  document.addEventListener('keydown', e => {
    const dots   = document.querySelectorAll('.p-dot');
    const active = [...dots].findIndex(d => d.classList.contains('is-a'));
    const total  = document.querySelectorAll('.cs').length;
    if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
      e.preventDefault(); if (SlideModule) SlideModule.scrollTo(Math.min(active+1, total-1));
    }
    if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
      e.preventDefault(); if (SlideModule) SlideModule.scrollTo(Math.max(active-1, 0));
    }
    if (e.key === 'Escape') _go('cards.html');
  });

  const hfssGrid = document.getElementById('hfssGrid');
  if (hfssGrid && TiltModule) {
    const observer = new MutationObserver(() => {
      const hfssTiles = hfssGrid.querySelectorAll('.media-tile');
      if (hfssTiles.length > 0) {
        TiltModule.init(hfssTiles);
        observer.disconnect(); 
      }
    });
    observer.observe(hfssGrid, { childList: true });
  }
}

function _go(href) {
  const veil = document.getElementById('pageVeil');
  if (!veil) { window.location.href = href; return; }
  veil.classList.add('is-visible');
  setTimeout(() => { window.location.href = href; }, 500);
}

function _fadeIn() {
  const veil = document.getElementById('pageVeil');
  if (!veil) return;
  veil.style.opacity    = '1';
  veil.style.transition = 'none';
  veil.getBoundingClientRect();
  veil.style.transition = 'opacity 480ms var(--ease-o)';
  veil.style.opacity    = '0';
}