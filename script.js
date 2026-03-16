// ─── DATA ─────────────────────────────────────────────────────────────────────
const MODULES = [
  { id:"em-waves",  num:"01", title:"Electromagnetic Waves",      level:"Beginner",     icon:"⚡", color:"#00c8ff",
    desc:"Understand the nature of EM waves, Maxwell's equations in simple form, and how radio waves propagate through space and materials.",
    topics:["Nature of EM waves","Maxwell's equations (intuitive)","Wave propagation & polarization","Frequency spectrum overview"],
    lectures:6, sims:3 },
  { id:"t-lines",   num:"02", title:"Transmission Lines",         level:"Beginner",     icon:"〰", color:"#00e5cc",
    desc:"Study microstrip lines and coaxial cables. Understand impedance matching — the backbone of all RF circuit design.",
    topics:["Microstrip & stripline basics","Characteristic impedance (50 Ω)","Standing waves & VSWR","Smith Chart introduction"],
    lectures:5, sims:2 },
  { id:"s-params",  num:"03", title:"S-Parameters & Analysis",    level:"Intermediate", icon:"📊", color:"#e8ff00",
    desc:"Learn scattering parameters — the universal language of RF engineers used to describe signal behavior through components.",
    topics:["S11, S21, S12, S22 explained","Insertion loss & return loss","2-port network analysis","VNA measurement basics"],
    lectures:4, sims:2 },
  { id:"blc",       num:"04", title:"Branch-Line Coupler",         level:"Intermediate", icon:"⊕", color:"#FFD740",
    desc:"Design and analyze a 3 dB 90° hybrid coupler — one of the most critical power-dividing components in radar and comms.",
    topics:["BLC theory & working principle","λ/4 transmission line sections","Design equations (35.4 Ω / 50 Ω)","Simulation with ADS/CST"],
    lectures:5, sims:2 },
  { id:"phase",     num:"05", title:"Phase Shifter Design",        level:"Intermediate", icon:"↻", color:"#B388FF",
    desc:"Explore passive and active phase shifter designs used in phased array antennas and beamforming systems for 5G and radar.",
    topics:["Loaded-line phase shifters","Switched-line phase shifters","All-pass network approach","PIN diode RF switching"],
    lectures:4, sims:1 },
  { id:"crossover", num:"06", title:"RF Crossover Network",        level:"Advanced",     icon:"✕", color:"#FF4081",
    desc:"How two independent RF paths cross on the same layer without coupling — critical for complex PCB design.",
    topics:["Crossover junction theory","Back-to-back BLC arrangement","Isolation & insertion loss specs","Butler matrix application"],
    lectures:3, sims:1 },
  { id:"patch-ant", num:"07", title:"Patch Antenna Design",        level:"Advanced",     icon:"📡", color:"#FF6B6B",
    desc:"Design a microstrip patch antenna from scratch — resonance, radiation patterns, gain, bandwidth for WiFi and 5G bands.",
    topics:["Patch geometry & TM₀₁₀ mode","Resonant frequency formula","Feed methods (edge, probe, inset)","Radiation pattern & gain"],
    lectures:6, sims:2 },
  { id:"wilkinson", num:"08", title:"Wilkinson Power Divider",     level:"Advanced",     icon:"⚖", color:"#64FFDA",
    desc:"Analyze the Wilkinson divider for equal and unequal power splitting with full isolation between output ports.",
    topics:["Power divider concept","Even/odd mode analysis","Isolation resistor role","N-way divider topology"],
    lectures:4, sims:2 },
];

const VIDEOS = [
  { id:"em-intro",    type:"Lecture",    mod:"Module 01", dur:"24:15", icon:"🌊",
    title:"Introduction to Electromagnetic Waves",
    desc:"What EM waves actually are, how they differ from mechanical waves, and how they carry energy through space at light speed." },
  { id:"tline-sim",   type:"Simulation", mod:"Module 02", dur:"31:40", icon:"〰",
    title:"Transmission Line Simulation in ADS",
    desc:"Step-by-step: substrate parameters, microstrip elements, S-parameter simulation in Keysight ADS from scratch." },
  { id:"blc-design",  type:"Tutorial",   mod:"Module 04", dur:"38:20", icon:"⊕",
    title:"Designing a 3 dB Branch Line Coupler",
    desc:"Complete BLC design — equations → line widths → CST layout → full-wave EM simulation verified at 2.4 GHz." },
  { id:"smith",       type:"Lecture",    mod:"Module 02", dur:"28:55", icon:"◎",
    title:"Smith Chart Demystified",
    desc:"Build the Smith Chart intuitively from first principles — constant R circles, X arcs, and impedance matching." },
  { id:"patch-d",     type:"Tutorial",   mod:"Module 07", dur:"42:10", icon:"📡",
    title:"Microstrip Patch Antenna at 2.4 GHz",
    desc:"Full WiFi patch design: dimensions → FR4 → inset feed → CST simulation → radiation pattern 6 dBi gain." },
  { id:"sparams-s",   type:"Simulation", mod:"Module 03", dur:"19:30", icon:"📊",
    title:"S-Parameter Simulation & Interpretation",
    desc:"ADS S-parameter simulation from scratch, frequency sweep, and correct S11/S21 interpretation in dB scale." },
];

const TOOLS = [
  { name:"Keysight ADS",         short:"ADS",   icon:"📐", color:"#00c8ff",
    desc:"Industry-standard circuit and EM simulator. Used for S-parameter sweeps, Smith Chart analysis, and microstrip design throughout this curriculum." },
  { name:"CST Microwave Studio", short:"CST",   icon:"🔷", color:"#00e5cc",
    desc:"Full-wave 3D EM simulator. Used for patch antenna, BLC, and crossover layout simulation with accurate radiation pattern output." },
  { name:"ANSYS HFSS",           short:"HFSS",  icon:"⬡",  color:"#e8ff00",
    desc:"High Frequency Structure Simulator. Source for all E-field distributions and S-parameter SVG exports in the component library." },
  { name:"Smith Chart Tool",     short:"SMITH", icon:"◎",  color:"#FFD740",
    desc:"Free web-based Smith Chart calculator for reflection coefficient plotting, stub matching, and impedance transformation design." },
];

const PATH_STEPS = [
  { n:"01", title:"EM Fundamentals", desc:"Wave propagation, EM spectrum, and how radio waves carry information through space.", tags:["Module 01","~4 weeks"] },
  { n:"02", title:"Transmission Lines & Impedance", desc:"Microstrip lines, 50 Ω standard, VSWR, and the Smith Chart — the foundation for all RF work.", tags:["Module 02","~3 weeks"] },
  { n:"03", title:"S-Parameter Analysis", desc:"Learn the language of RF engineers. Read VNA data and interpret simulation S11 / S21 plots.", tags:["Module 03","~2 weeks"] },
  { n:"04", title:"Passive Component Design", desc:"Design BLC, phase shifter, and RF crossover networks using professional simulation tools.", tags:["Modules 04–06","~4 weeks"] },
  { n:"05", title:"Antenna & Power Division", desc:"Patch antennas for WiFi/5G and Wilkinson dividers for phased array beamforming networks.", tags:["Modules 07–08","~3 weeks"] },
];

const LEVEL_STYLE = {
  "Beginner":    {bg:"rgba(0,255,128,0.07)",  color:"#00ff80",  border:"rgba(0,255,128,0.18)"},
  "Intermediate":{bg:"rgba(0,200,255,0.07)",  color:"#00c8ff",  border:"rgba(0,200,255,0.18)"},
  "Advanced":    {bg:"rgba(232,255,0,0.07)",  color:"#e8ff00",  border:"rgba(232,255,0,0.18)"},
};

const FREQ_SHAPES = {
  "em-waves": [0.05,0.15,0.4,0.75,1.0,0.82,0.55,0.25,0.08,0.02],
  "t-lines":  [0.08,0.25,0.6,0.92,1.0,0.9,0.58,0.22,0.06,0.01],
  "patch-ant":[0.02,0.05,0.14,0.58,1.0,0.58,0.14,0.05,0.02,0.01],
};
const DEFAULT_SHAPE = [0.1,0.3,0.55,0.85,1.0,0.85,0.55,0.3,0.1,0.02];

// ─── CURSOR ───────────────────────────────────────────────────────────────────
const cd = document.getElementById('cd');
const cr = document.getElementById('cr');
const hasFine = window.matchMedia('(pointer: fine)').matches;
let ringPos = {x:-200,y:-200}, curRef = {x:-200,y:-200};

if (hasFine) {
  const lerp = (a,b,t) => a+(b-a)*t;
  const tick = () => {
    ringPos.x = lerp(ringPos.x, curRef.x, 0.1);
    ringPos.y = lerp(ringPos.y, curRef.y, 0.1);
    cr.style.left = ringPos.x + 'px';
    cr.style.top  = ringPos.y + 'px';
    requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
  window.addEventListener('mousemove', e => {
    curRef = {x: e.clientX, y: e.clientY};
    cd.style.left = e.clientX + 'px';
    cd.style.top  = e.clientY + 'px';
  }, {passive:true});
}

function setHov(on) {
  cd.classList.toggle('h', on);
  cr.classList.toggle('h', on);
}
document.querySelectorAll('a,button,.mc,.vc,.tlc,.path-step').forEach(el => {
  el.addEventListener('mouseenter', () => setHov(true));
  el.addEventListener('mouseleave', () => setHov(false));
});

// ─── NAV SCROLL ───────────────────────────────────────────────────────────────
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => nav.classList.toggle('sc', window.scrollY > 40), {passive:true});

// ─── TICKER ───────────────────────────────────────────────────────────────────
const tickItems = ["EM Waves","Transmission Lines","S-Parameters","Branch-Line Coupler","Phase Shifter","RF Crossover","Patch Antenna","Wilkinson Divider","Smith Chart","HFSS Sim"];
const tickEl = document.getElementById('ticker');
const repeated = Array(6).fill(tickItems).flat();
tickEl.innerHTML = repeated.map(t => `<span>${t}<span style="color:var(--ac);margin-left:1rem">✦</span></span>`).join('');

// ─── MODULES GRID ─────────────────────────────────────────────────────────────
const modulesGrid = document.getElementById('modules-grid');
MODULES.forEach((m, i) => {
  const ls = LEVEL_STYLE[m.level];
  const div = document.createElement('div');
  div.className = 'mc au';
  div.style.cssText = `--cc:${m.color};animation-delay:${.04+i*.06}s`;
  div.innerHTML = `
    <div class="mnum">${m.num}</div>
    <div style="font-family:var(--fm);font-size:9px;letter-spacing:.2em;color:var(--mu);text-transform:uppercase;margin-bottom:.1rem">${m.num} · ${m.level}</div>
    <div class="ct">${m.title}</div>
    <div style="display:flex;flex-direction:column;gap:3px;margin-top:.2rem;padding-bottom:.7rem;border-bottom:1px solid var(--b1)">
      ${m.topics.slice(0,3).map(t=>`<div class="tr-row">${t}</div>`).join('')}
    </div>
    <div style="display:flex;justify-content:space-between;align-items:center;margin-top:.1rem">
      <span style="font-family:var(--fm);font-size:9.5px;color:var(--mu)">${m.lectures} lectures · ${m.sims} sims</span>
      <span class="lvbadge" style="background:${ls.bg};color:${ls.color};border-color:${ls.border}">${m.level}</span>
    </div>
    <div class="arr">↗</div>
    <div class="clb" style="background:${m.color}"></div>
  `;
  div.addEventListener('click', () => openModal(m));
  div.addEventListener('mouseenter', () => setHov(true));
  div.addEventListener('mouseleave', () => setHov(false));
  modulesGrid.appendChild(div);
});

// ─── VIDEOS GRID ─────────────────────────────────────────────────────────────
let currentFilter = 'all';

function renderVideos() {
  const grid = document.getElementById('videos-grid');
  grid.innerHTML = '';
  const filtered = currentFilter === 'all' ? VIDEOS : VIDEOS.filter(v => v.type.toLowerCase() === currentFilter);
  filtered.forEach((v, i) => {
    const div = document.createElement('div');
    div.className = 'vc au';
    div.style.animationDelay = `${i*.07}s`;
    div.innerHTML = `
      <div class="vt">
        <div class="vti"><span style="font-size:52px;opacity:.2">${v.icon}</span></div>
        <div class="pbtn">▶</div>
        <div class="vdur">${v.dur}</div>
      </div>
      <div class="vi">
        <div class="vtype">${v.type} · ${v.mod}</div>
        <div class="vtitle">${v.title}</div>
        <div class="vdesc">${v.desc}</div>
      </div>
    `;
    div.addEventListener('mouseenter', () => setHov(true));
    div.addEventListener('mouseleave', () => setHov(false));
    grid.appendChild(div);
  });
}
renderVideos();

document.querySelectorAll('.ftab').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.ftab').forEach(b => b.classList.remove('on'));
    btn.classList.add('on');
    currentFilter = btn.dataset.filter;
    renderVideos();
  });
  btn.addEventListener('mouseenter', () => setHov(true));
  btn.addEventListener('mouseleave', () => setHov(false));
});

// ─── PATH STEPS ───────────────────────────────────────────────────────────────
const pathContainer = document.getElementById('path-steps');
PATH_STEPS.forEach((s, i) => {
  const div = document.createElement('div');
  div.className = 'path-step';
  div.style.transitionDelay = `${i*.11}s`;
  div.innerHTML = `
    <div class="step-num">${s.n}</div>
    <div class="step-body">
      <div style="font-family:var(--fd);font-size:22px;text-transform:uppercase;color:var(--tx);margin-bottom:.25rem">${s.title}</div>
      <div style="font-family:var(--fm);font-size:11px;color:var(--mu);line-height:1.65;margin-bottom:.65rem">${s.desc}</div>
      <div style="display:flex;flex-wrap:wrap;gap:5px">
        ${s.tags.map(t=>`<span style="font-family:var(--fm);font-size:9px;letter-spacing:.14em;text-transform:uppercase;color:var(--tl);background:rgba(0,229,204,0.06);border:1px solid rgba(0,229,204,0.14);padding:.2rem .65rem">${t}</span>`).join('')}
      </div>
    </div>
  `;
  div.addEventListener('mouseenter', () => setHov(true));
  div.addEventListener('mouseleave', () => setHov(false));
  pathContainer.appendChild(div);
});

// IntersectionObserver for path steps
const stepObs = new IntersectionObserver((entries) => {
  entries.forEach(e => { if(e.isIntersecting){ e.target.classList.add('vis'); stepObs.unobserve(e.target); } });
}, {threshold:0.15});
document.querySelectorAll('.path-step').forEach(el => stepObs.observe(el));

// ─── TOOLS GRID ───────────────────────────────────────────────────────────────
const toolsGrid = document.getElementById('tools-grid');
TOOLS.forEach((t, i) => {
  const div = document.createElement('div');
  div.className = 'tlc au';
  div.style.cssText = `--cc3:${t.color};animation-delay:${i*.07}s`;
  div.innerHTML = `
    <div class="tlibox" style="border-color:${t.color}28">${t.icon}</div>
    <div style="font-family:var(--fd);font-size:28px;text-transform:uppercase;color:${t.color};line-height:1">${t.short}</div>
    <div style="font-family:'Syne',sans-serif;font-size:12px;font-weight:700;color:var(--tx)">${t.name}</div>
    <div style="font-family:var(--fm);font-size:11px;color:var(--mu);line-height:1.65">${t.desc}</div>
    <div class="tlarr">Open Tool →</div>
  `;
  div.addEventListener('mouseenter', () => setHov(true));
  div.addEventListener('mouseleave', () => setHov(false));
  toolsGrid.appendChild(div);
});

// ─── FREQ VIZ ─────────────────────────────────────────────────────────────────
function buildFreqViz(id, color) {
  const amps = FREQ_SHAPES[id] || DEFAULT_SHAPE;
  const W=100, H=52;
  const pts = amps.map((a,i) => `${(i/(amps.length-1))*W},${H - a*(H*0.82)}`).join(' ');
  const pi = amps.indexOf(Math.max(...amps));
  const px = (pi/(amps.length-1))*W;
  const gradId = `fvg-${id}`;
  return `<div style="background:#070910;border:1px solid #181818;position:relative;height:80px;overflow:hidden">
    <svg viewBox="0 0 ${W} ${H}" preserveAspectRatio="none" style="width:100%;height:100%;display:block">
      <defs><linearGradient id="${gradId}" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="${color}" stop-opacity="0.3"/>
        <stop offset="100%" stop-color="${color}" stop-opacity="0"/>
      </linearGradient></defs>
      <polygon points="0,${H} ${pts} ${W},${H}" fill="url(#${gradId})"/>
      <polyline points="${pts}" fill="none" stroke="${color}" stroke-width="0.9" stroke-linecap="round" stroke-linejoin="round"/>
      <line x1="${px}" y1="0" x2="${px}" y2="${H}" stroke="${color}" stroke-width="0.35" stroke-dasharray="1.5,2" opacity="0.5"/>
      <text x="${px+1}" y="8" fill="${color}" font-size="4.5" font-family="monospace" opacity="0.8">f₀</text>
    </svg>
    <div style="position:absolute;bottom:0.35rem;right:0.6rem;font-family:monospace;font-size:8px;color:#2a2a2a;letter-spacing:0.14em;text-transform:uppercase">S₁₁</div>
  </div>`;
}

// ─── MODAL ────────────────────────────────────────────────────────────────────
let selectedModule = null;
const modal = document.getElementById('modal');
const modalClose = document.getElementById('modal-close');

function openModal(m) {
  selectedModule = m;
  document.body.style.overflow = 'hidden';

  // Color bar
  document.getElementById('modal-color-bar').style.background = `linear-gradient(90deg,transparent,${m.color},transparent)`;
  document.getElementById('modal-icon').textContent = m.icon;
  document.getElementById('modal-play-label').textContent = `Click to play · ${m.title}`;
  document.getElementById('modal-sub').textContent = `${m.num} — ${m.level}`;
  document.getElementById('modal-title').textContent = m.title;
  document.getElementById('modal-title').style.color = m.color;

  // Layman tab
  document.getElementById('layman-title').textContent = `${m.title} — Simply Explained`;
  document.getElementById('layman-desc').textContent = m.desc;
  document.getElementById('layman-topics').innerHTML = m.topics.map(t =>
    `<div style="display:flex;align-items:center;gap:6px;font-family:var(--fm);font-size:11.5px;line-height:1.5;color:var(--ac);margin-bottom:2px"><span style="font-size:8px;color:${m.color};flex-shrink:0">▸</span>${t}</div>`
  ).join('');

  document.getElementById('freq-viz-container').innerHTML = buildFreqViz(m.id, m.color);
  document.getElementById('meta-level').textContent = m.level;
  document.getElementById('meta-module').textContent = `${m.num} / 08`;
  document.getElementById('meta-lectures').textContent = `${m.lectures} video lectures`;
  document.getElementById('meta-sims').textContent = `${m.sims} guided sims`;

  // Theory tab
  document.getElementById('theory-topics').innerHTML = m.topics.map(t => `<span class="pt">${t}</span>`).join('');
  document.getElementById('code-src').textContent = '`/sim/' + m.id + '_sparams.svg`';
  document.getElementById('code-alt').textContent = '"' + m.title + ' S-parameters"';

  // Simulation tab
  const isPatch = m.id === 'patch-ant';
  document.getElementById('patch-slider-container').style.display = isPatch ? 'block' : 'none';
  if (isPatch) {
    document.documentElement.style.setProperty('--patch-color', m.color);
    initPatchSlider();
  }
  document.getElementById('sim-path1').textContent = `→ /public/sim/${m.id}_sparams.svg`;
  document.getElementById('sim-path2').textContent = `→ /sim/${m.id}_efield.svg`;
  document.getElementById('sim-path3').textContent = `→ /real/${m.id}.webp`;

  // Dots + nav buttons
  const dots = document.getElementById('modal-dots');
  dots.innerHTML = MODULES.map(c =>
    `<div data-id="${c.id}" style="width:6px;height:6px;border-radius:50%;background:${selectedModule.id===c.id?c.color:'var(--b2)'};cursor:none;transition:background .2s" onclick="openModal(MODULES.find(m=>m.id==='${c.id}'))"></div>`
  ).join('');

  const navBtns = document.getElementById('modal-nav-btns');
  const idx = MODULES.findIndex(c => c.id === m.id);
  const prev = MODULES[idx-1], nxt = MODULES[idx+1];
  navBtns.innerHTML = '';
  if (prev) {
    const b = document.createElement('button');
    b.className = 'mtb';
    b.style.cssText = 'border:1px solid var(--b1);border-right:none';
    b.textContent = `← ${prev.num}`;
    b.onclick = () => openModal(prev);
    b.addEventListener('mouseenter', () => setHov(true));
    b.addEventListener('mouseleave', () => setHov(false));
    navBtns.appendChild(b);
  }
  if (nxt) {
    const b = document.createElement('button');
    b.className = 'mtb';
    b.style.cssText = 'border:1px solid var(--ac);color:var(--ac)';
    b.textContent = `${nxt.num} →`;
    b.onclick = () => openModal(nxt);
    b.addEventListener('mouseenter', () => setHov(true));
    b.addEventListener('mouseleave', () => setHov(false));
    navBtns.appendChild(b);
  }

  // Reset tab to layman
  switchTab('layman');
  modal.classList.add('open');
}

function closeModal() {
  modal.classList.remove('open');
  document.body.style.overflow = '';
  selectedModule = null;
}

modalClose.addEventListener('click', closeModal);
modal.addEventListener('click', e => { if(e.target === modal) closeModal(); });
window.addEventListener('keydown', e => { if(e.key === 'Escape') closeModal(); });
modalClose.addEventListener('mouseenter', () => setHov(true));
modalClose.addEventListener('mouseleave', () => setHov(false));

// ─── TABS ─────────────────────────────────────────────────────────────────────
function switchTab(name) {
  document.querySelectorAll('.tab-content').forEach(el => el.classList.remove('active'));
  document.querySelectorAll('.mtb[data-tab]').forEach(btn => btn.classList.toggle('on', btn.dataset.tab === name));
  const el = document.getElementById(`tab-${name}`);
  if (el) { el.classList.add('active'); el.style.animation='none'; void el.offsetWidth; el.style.animation=''; el.classList.add('ai'); }
}

document.querySelectorAll('.mtb[data-tab]').forEach(btn => {
  btn.addEventListener('click', () => switchTab(btn.dataset.tab));
  btn.addEventListener('mouseenter', () => setHov(true));
  btn.addEventListener('mouseleave', () => setHov(false));
});

// ─── PATCH SLIDER ─────────────────────────────────────────────────────────────
function initPatchSlider() {
  const slider = document.getElementById('patch-slider');
  const lenVal = document.getElementById('patch-len-val');
  const freqVal = document.getElementById('patch-freq-val');
  const bwEl = document.getElementById('patch-bw');
  const indicator = document.getElementById('patch-indicator');
  const bgFill = document.getElementById('patch-bg-fill');
  const color = selectedModule ? selectedModule.color : '#FF6B6B';

  function update() {
    const len = Number(slider.value);
    const freq = (3.5 - (len-20)*0.0125).toFixed(3);
    const bw = (1.2 + (80-len)*0.01).toFixed(1);
    const pct = ((len-20)/60)*100;
    lenVal.textContent = len;
    freqVal.textContent = freq;
    bwEl.textContent = bw;
    indicator.style.left = pct + '%';
    bgFill.style.width = pct + '%';
    bgFill.style.background = `linear-gradient(90deg,transparent,${color}10)`;
  }

  slider.addEventListener('input', update);
  update();
}