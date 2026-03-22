/**
 * dataFetch.js — RF Explorer data layer
 */

'use strict';

const GAS_URL   = 'https://script.google.com/macros/s/AKfycbwRsVc1j8L-UshwX0IWUjKAAJVgTZ7PIjlDknj32x0VEqxmU4Nu7Gm2Yujh7_dS6VBp/exec';
const MAX_CARDS = 8;

const CARD_COLOURS = ['#FF6B6B', '#4ECDC4', '#6C5CE7', '#F9CA24', '#10AC84', '#FF8B94', '#45B7D1', '#F0A500'];
const CARD_EMOJI = ['📡','📻','🛰️','📱','🔬','⚡','🌐','🔭'];

async function fetchComponentData() {
  if (!GAS_URL || GAS_URL.startsWith('YOUR_')) return _demo();

  const ctrl = new AbortController();
  const tid  = setTimeout(() => ctrl.abort(), 10_000);
  try {
    const res  = await fetch(GAS_URL, { signal: ctrl.signal, cache: 'no-cache' });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    if (!Array.isArray(data) || !data.length) throw new Error('Empty response');
    return data;
  } catch (err) {
    console.warn('[RFE] Fetch failed — using demo data.', err.message);
    return _demo();
  } finally {
    clearTimeout(tid);
  }
}

function buildCardElements(components, container, onCardClick) {
  if (!container) return;
  const frag = document.createDocumentFragment();

  components.slice(0, MAX_CARDS).forEach((comp, i) => {
    const card  = _makeCard(comp, i);
    card.style.setProperty('--cd', `${i * 70}ms`);

    card.addEventListener('click', () => onCardClick?.(comp, i, card));
    card.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); card.click(); }
    });
    card.setAttribute('tabindex', '0');
    card.setAttribute('role', 'button');
    card.setAttribute('aria-label', `Explore ${comp.ComponentName || 'component'}`);

    frag.appendChild(card);
  });

  container.appendChild(frag);
}

function _makeCard(comp, i) {
  const colour = CARD_COLOURS[i % CARD_COLOURS.length];
  const emoji  = CARD_EMOJI[i % CARD_EMOJI.length];

  const card = document.createElement('article');
  card.className = 'rf-card';
  card.dataset.idx = i;
  card.style.setProperty('--card-c', colour);

  const band = document.createElement('div');
  band.className = 'rf-card__colour';

  const imgWrap = document.createElement('div');
  imgWrap.className = 'rf-card__img';

  const num = document.createElement('span');
  num.className = 'rf-card__n';
  num.textContent = String(i + 1).padStart(2, '0');
  imgWrap.appendChild(num);

  const imgUrl = String(comp.RealLifeImageURL || '').trim();
  if (imgUrl) {
    const img    = document.createElement('img');
    img.src      = imgUrl;
    img.alt      = comp.ComponentName || '';
    img.loading  = 'lazy';
    img.decoding = 'async';
    img.onerror  = () => img.replaceWith(_emojiPh(emoji, colour));
    imgWrap.appendChild(img);
  } else {
    imgWrap.appendChild(_emojiPh(emoji, colour));
  }

  const body = document.createElement('div');
  body.className = 'rf-card__body';

  const name = document.createElement('h2');
  name.className   = 'rf-card__name';
  name.textContent = comp.ComponentName || 'RF Component';

  const preview = document.createElement('p');
  preview.className   = 'rf-card__preview';
  preview.textContent = _trunc(String(comp.RealLifeText || ''), 130);

  body.appendChild(name);
  body.appendChild(preview);

  const foot = document.createElement('div');
  foot.className = 'rf-card__foot';

  const cta = document.createElement('span');
  cta.className = 'rf-card__cta';
  cta.innerHTML = 'Read the story →';

  const ch = document.createElement('span');
  ch.className = 'rf-card__chapters';
  ch.textContent = '4 chapters';

  foot.appendChild(cta);
  foot.appendChild(ch);

  const glare = document.createElement('div');
  glare.className = 'rf-card__glare';
  glare.setAttribute('aria-hidden', 'true');

  card.appendChild(band);
  card.appendChild(imgWrap);
  card.appendChild(body);
  card.appendChild(foot);
  card.appendChild(glare);

  return card;
}

function _emojiPh(emoji, colour) {
  const ph = document.createElement('div');
  ph.className = 'rf-card__img-ph';
  ph.style.background = `linear-gradient(135deg, ${colour}28, ${colour}08)`;
  ph.textContent = emoji;
  return ph;
}

function populateComponentPage(comp) {
  if (!comp) return;
  const name = comp.ComponentName || '—';

  _set('csHook',      'You\'re about to understand something invisible');
  _set('csHeroTitle', name);
  _set('navCompName', name);
  document.title = `RF Explorer — ${name}`;

  _set('realLifeText', comp.RealLifeText || 'Information not available.');
  _fillMedia('realLifeMedia', String(comp.RealLifeImageURL || '').trim(), `${name} real-life`);

  _set('analogyText',  comp.AnalogyText  || 'Information not available.');
  _set('analogyLeft',  name);
  _set('analogyRight', _analogyNoun(String(comp.AnalogyText || '')));
  _fillMedia('analogyMedia', String(comp.AnalogyImageURL || '').trim(), `${name} analogy`);

  const fabGrid = document.getElementById('fabGrid');
  if (fabGrid) {
    fabGrid.innerHTML = '';
    [comp.FabricatedImage1, comp.FabricatedImage2, comp.FabricatedImage3].forEach((url, i) => {
        const tile = _mediaCard(String(url || '').trim(), `${name} specimen ${i+1}`);
        tile.classList.add('io-anim-img');
        tile.style.setProperty('--io-d', `${i * 110}ms`);
        fabGrid.appendChild(tile);
      });
  }

  const hfssGrid = document.getElementById('hfssGrid');
  if (hfssGrid) {
    hfssGrid.innerHTML = '';
    [comp.HFSSImage1, comp.HFSSImage2].forEach((url, i) => {
        const tile = _mediaCard(String(url || '').trim(), `${name} HFSS ${i+1}`);
        tile.classList.add('io-anim-img');
        tile.style.setProperty('--io-d', `${i * 150}ms`);
        hfssGrid.appendChild(tile);
      });
  }

  ['realLifeText','analogyText'].forEach(id => {
    document.getElementById(id)?.classList.add('io-anim');
  });
  document.querySelectorAll('.cs-title, .analogy-chip, .big-num, .cs-hook')
    .forEach((el, i) => {
      el.classList.add('io-anim');
      el.style.setProperty('--io-d', `${i * 0.04}s`);
    });
}

function _fillMedia(id, url, alt) {
  const wrap = document.getElementById(id);
  if (!wrap) return;
  wrap.innerHTML = '';
  if (url) {
    const img    = document.createElement('img');
    img.src      = url; img.alt = alt || ''; img.loading = 'lazy'; img.decoding = 'async';
    wrap.appendChild(img);
  } else {
    const ph = document.createElement('div');
    ph.className = 'media-tile-ph';
    ph.textContent = 'Image coming soon';
    wrap.appendChild(ph);
  }
  wrap.classList.add('io-anim-img');
}

function _mediaCard(url, alt) {
  const tile = document.createElement('div');
  tile.className = 'media-tile';
  if (url) {
    const img    = document.createElement('img');
    img.src      = url; img.alt = alt || ''; img.loading = 'lazy'; img.decoding = 'async';
    tile.appendChild(img);
  } else {
    const ph = document.createElement('div');
    ph.className = 'media-tile-ph';
    ph.textContent = 'Image coming soon';
    tile.appendChild(ph);
  }
  return tile;
}

function storeComp(comp) {
  try { sessionStorage.setItem('rf_sel', JSON.stringify(comp)); } catch (_) {}
}
function getComp() {
  try { const r = sessionStorage.getItem('rf_sel'); return r ? JSON.parse(r) : null; }
  catch (_) { return null; }
}

function _set(id, text) { const el = document.getElementById(id); if (el) el.textContent = text; }
function _trunc(s, n) { return s.length <= n ? s : s.slice(0, n).trimEnd() + '…'; }
function _analogyNoun(text) {
  if (!text) return '—';
  const m = text.match(/(?:like\s+a[n]?\s+|similar\s+to\s+a[n]?\s+|acts?\s+(?:like|as)\s+a[n]?\s+)([A-Za-z][\w\s]{1,20})/i);
  if (m) return m[1].trim().replace(/[.,;].*/, '');
  const cap = text.match(/\b[A-Z][a-z]{3,18}\b/);
  return cap ? cap[0] : 'everyday object';
}

function _demo() {
  return [
    {
      ComponentName:'Waveguide',
      RealLifeText:'Waveguides are the hollow metal tubes that carry microwave signals inside radar systems, satellite ground stations, and particle accelerators.',
      RealLifeImageURL:'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e5/WR-90_waveguide.jpg/640px-WR-90_waveguide.jpg',
      AnalogyText:'Think of a waveguide like a hollow pipe for your garden hose — but instead of water, it carries electromagnetic energy.',
      AnalogyImageURL:'',
      FabricatedImage1:'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e5/WR-90_waveguide.jpg/400px-WR-90_waveguide.jpg',
      FabricatedImage2:'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e5/WR-90_waveguide.jpg/400px-WR-90_waveguide.jpg',
      FabricatedImage3:'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e5/WR-90_waveguide.jpg/400px-WR-90_waveguide.jpg',
      HFSSImage1:'', HFSSImage2:'',
    }
  ];
}

window.RFData = { fetchComponentData, buildCardElements, populateComponentPage, storeComp, getComp };