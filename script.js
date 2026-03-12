/* ─────────────────────────────────────────────────────────────────────────────
   IEEE MTT-S RF Learning Hub  ·  script.js
   ───────────────────────────────────────────────────────────────────────────── */

// ─── DATA ──────────────────────────────────────────────────────────────────────

const MODULES = [
  {
    id: "em-waves", num: "01", title: "Electromagnetic Waves",
    level: "Beginner", icon: "⚡", color: "#00c8ff",
    desc: "Understand the nature of EM waves, Maxwell's equations in simple form, and how radio waves propagate through space and materials.",
    topics: ["Nature of EM waves", "Maxwell's equations (intuitive)", "Wave propagation & polarization", "Frequency spectrum overview"],
    lectures: 6, sims: 3
  },
  {
    id: "t-lines", num: "02", title: "Transmission Lines",
    level: "Beginner", icon: "〰", color: "#00e5cc",
    desc: "Study microstrip lines and coaxial cables. Understand impedance matching — the backbone of all RF circuit design.",
    topics: ["Microstrip & stripline basics", "Characteristic impedance (50 Ω)", "Standing waves & VSWR", "Smith Chart introduction"],
    lectures: 5, sims: 2
  },
  {
    id: "s-params", num: "03", title: "S-Parameters & Analysis",
    level: "Intermediate", icon: "📊", color: "#e8ff00",
    desc: "Learn scattering parameters — the universal language of RF engineers used to describe signal behavior through components.",
    topics: ["S11, S21, S12, S22 explained", "Insertion loss & return loss", "2-port network analysis", "VNA measurement basics"],
    lectures: 4, sims: 2
  },
  {
    id: "blc", num: "04", title: "Branch-Line Coupler",
    level: "Intermediate", icon: "⊕", color: "#FFD740",
    desc: "Design and analyze a 3 dB 90° hybrid coupler — one of the most critical power-dividing components in radar and comms.",
    topics: ["BLC theory & working principle", "λ/4 transmission line sections", "Design equations (35.4 Ω / 50 Ω)", "Simulation with ADS/CST"],
    lectures: 5, sims: 2
  },
  {
    id: "phase", num: "05", title: "Phase Shifter Design",
    level: "Intermediate", icon: "↻", color: "#B388FF",
    desc: "Explore passive and active phase shifter designs used in phased array antennas and beamforming systems for 5G and radar.",
    topics: ["Loaded-line phase shifters", "Switched-line phase shifters", "All-pass network approach", "PIN diode RF switching"],
    lectures: 4, sims: 1
  },
  {
    id: "crossover", num: "06", title: "RF Crossover Network",
    level: "Advanced", icon: "✕", color: "#FF4081",
    desc: "How two independent RF paths cross on the same layer without coupling — critical for complex PCB design.",
    topics: ["Crossover junction theory", "Back-to-back BLC arrangement", "Isolation & insertion loss specs", "Butler matrix application"],
    lectures: 3, sims: 1
  },
  {
    id: "patch-ant", num: "07", title: "Patch Antenna Design",
    level: "Advanced", icon: "📡", color: "#FF6B6B",
    desc: "Design a microstrip patch antenna from scratch — resonance, radiation patterns, gain, bandwidth for WiFi and 5G bands.",
    topics: ["Patch geometry & TM₀₁₀ mode", "Resonant frequency formula", "Feed methods (edge, probe, inset)", "Radiation pattern & gain"],
    lectures: 6, sims: 2
  },
  {
    id: "wilkinson", num: "08", title: "Wilkinson Power Divider",
    level: "Advanced", icon: "⚖", color: "#64FFDA",
    desc: "Analyze the Wilkinson divider for equal and unequal power splitting with full isolation between output ports.",
    topics: ["Power divider concept", "Even/odd mode analysis", "Isolation resistor role", "N-way divider topology"],
    lectures: 4, sims: 2
  },
];

const VIDEOS = [
  {
    id: "em-intro", type: "Lecture", mod: "Module 01", dur: "24:15", icon: "🌊",
    title: "Introduction to Electromagnetic Waves",
    desc: "What EM waves actually are, how they differ from mechanical waves, and how they carry energy through space at light speed."
  },
  {
    id: "tline-sim", type: "Simulation", mod: "Module 02", dur: "31:40", icon: "〰",
    title: "Transmission Line Simulation in ADS",
    desc: "Step-by-step: substrate parameters, microstrip elements, S-parameter simulation in Keysight ADS from scratch."
  },
  {
    id: "blc-design", type: "Tutorial", mod: "Module 04", dur: "38:20", icon: "⊕",
    title: "Designing a 3 dB Branch Line Coupler",
    desc: "Complete BLC design — equations → line widths → CST layout → full-wave EM simulation verified at 2.4 GHz."
  },
  {
    id: "smith", type: "Lecture", mod: "Module 02", dur: "28:55", icon: "◎",
    title: "Smith Chart Demystified",
    desc: "Build the Smith Chart intuitively from first principles — constant R circles, X arcs, and impedance matching."
  },
  {
    id: "patch-d", type: "Tutorial", mod: "Module 07", dur: "42:10", icon: "📡",
    title: "Microstrip Patch Antenna at 2.4 GHz",
    desc: "Full WiFi patch design: dimensions → FR4 → inset feed → CST simulation → radiation pattern 6 dBi gain."
  },
  {
    id: "sparams-s", type: "Simulation", mod: "Module 03", dur: "19:30", icon: "📊",
    title: "S-Parameter Simulation & Interpretation",
    desc: "ADS S-parameter simulation from scratch, frequency sweep, and correct S11/S21 interpretation in dB scale."
  },
];

const TOOLS = [
  {
    name: "Keysight ADS", short: "ADS", icon: "📐", color: "#00c8ff",
    desc: "Industry-standard circuit and EM simulator. Used for S-parameter sweeps, Smith Chart analysis, and microstrip design throughout this curriculum."
  },
  {
    name: "CST Microwave Studio", short: "CST", icon: "🔷", color: "#00e5cc",
    desc: "Full-wave 3D EM simulator. Used for patch antenna, BLC, and crossover layout simulation with accurate radiation pattern output."
  },
  {
    name: "ANSYS HFSS", short: "HFSS", icon: "⬡", color: "#e8ff00",
    desc: "High Frequency Structure Simulator. Source for all E-field distributions and S-parameter SVG exports in the component library."
  },
  {
    name: "Smith Chart Tool", short: "SMITH", icon: "◎", color: "#FFD740",
    desc: "Free web-based Smith Chart calculator for reflection coefficient plotting, stub matching, and impedance transformation design."
  },
];

const PATH_STEPS = [
  { n: "01", title: "EM Fundamentals",                 desc: "Wave propagation, EM spectrum, and how radio waves carry information through space.",                              tags: ["Module 01", "~4 weeks"] },
  { n: "02", title: "Transmission Lines & Impedance",  desc: "Microstrip lines, 50 Ω standard, VSWR, and the Smith Chart — the foundation for all RF work.",                    tags: ["Module 02", "~3 weeks"] },
  { n: "03", title: "S-Parameter Analysis",            desc: "Learn the language of RF engineers. Read VNA data and interpret simulation S11 / S21 plots.",                      tags: ["Module 03", "~2 weeks"] },
  { n: "04", title: "Passive Component Design",        desc: "Design BLC, phase shifter, and RF crossover networks using professional simulation tools.",                         tags: ["Modules 04–06", "~4 weeks"] },
  { n: "05", title: "Antenna & Power Division",        desc: "Patch antennas for WiFi/5G and Wilkinson dividers for phased array beamforming networks.",                         tags: ["Modules 07–08", "~3 weeks"] },
];

const LEVEL_STYLE = {
  "Beginner":     { bg: "rgba(0,255,128,0.07)",  color: "#00ff80", border: "rgba(0,255,128,0.18)"  },
  "Intermediate": { bg: "rgba(0,200,255,0.07)",  color: "#00c8ff", border: "rgba(0,200,255,0.18)"  },
  "Advanced":     { bg: "rgba(232,255,0,0.07)",  color: "#e8ff00", border: "rgba(232,255,0,0.18)"  },
};

// ─── STATE ─────────────────────────────────────────────────────────────────────

let selectedModule = null;
let currentTab     = "layman";
let vidFilter      = "all";
let patchLen       = 50;

// ─── CUSTOM CURSOR ────────────────────────────────────────────────────────────

const dot  = document.getElementById('cursor-dot');
const ring = document.getElementById('cursor-ring');
let ringX = -200, ringY = -200, curX = -200, curY = -200;
const fine = window.matchMedia("(pointer: fine)").matches;

if (fine) {
  const lerp = (a, b, t) => a + (b - a) * t;

  const tick = () => {
    ringX = lerp(ringX, curX, 0.1);
    ringY = lerp(ringY, curY, 0.1);
    ring.style.left = ringX + "px";
    ring.style.top  = ringY + "px";
    requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);

  window.addEventListener("mousemove", e => {
    curX = e.clientX; curY = e.clientY;
    dot.style.left = e.clientX + "px";
    dot.style.top  = e.clientY + "px";
  }, { passive: true });
}

function hoverOn()  { dot.classList.add('h');    ring.classList.add('h');    }
function hoverOff() { dot.classList.remove('h'); ring.classList.remove('h'); }

// ─── NAV SCROLL ───────────────────────────────────────────────────────────────

const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  const scrolled = window.scrollY > 40;
  navbar.style.background     = scrolled ? 'rgba(10,10,10,0.96)' : 'transparent';
  navbar.style.borderBottomColor = scrolled ? 'var(--b1)'        : 'transparent';
  navbar.style.backdropFilter = scrolled ? 'blur(16px)'          : 'none';
}, { passive: true });

function scrollTo(id) {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
}

// Attach hover effects to all interactive nav elements
document.querySelectorAll('.navlink, [onclick]').forEach(el => {
  el.addEventListener('mouseenter', hoverOn);
  el.addEventListener('mouseleave', hoverOff);
});

// ─── TICKER ───────────────────────────────────────────────────────────────────

const tickerTerms = [
  "EM Waves", "Transmission Lines", "S-Parameters", "Branch-Line Coupler",
  "Phase Shifter", "RF Crossover", "Patch Antenna", "Wilkinson Divider",
  "Smith Chart", "HFSS Sim"
];
const tickerEl = document.getElementById('ticker');
tickerEl.innerHTML = Array(6)
  .fill(tickerTerms)
  .flat()
  .map(t => `<span>${t}<span style="color:var(--ac);margin-left:1rem">✦</span></span>`)
  .join('');

// ─── MODULES GRID ─────────────────────────────────────────────────────────────

function renderModules() {
  const grid = document.getElementById('modules-grid');
  grid.innerHTML = MODULES.map((m, i) => {
    const ls = LEVEL_STYLE[m.level];
    return `
      <div class="mc au" style="--cc:${m.color}; animation-delay:${0.04 + i * 0.06}s"
        onclick="openModal('${m.id}')"
        onmouseenter="hoverOn()" onmouseleave="hoverOff()">
        <div class="mnum">${m.num}</div>
        <div style="font-family:var(--fm);font-size:9px;letter-spacing:.2em;color:var(--mu);text-transform:uppercase;margin-bottom:.1rem">${m.num} · ${m.level}</div>
        <div class="ct">${m.title}</div>
        <div style="display:flex;flex-direction:column;gap:3px;margin-top:.2rem;padding-bottom:.7rem;border-bottom:1px solid var(--b1)">
          ${m.topics.slice(0, 3).map(t => `<div class="tr-row">${t}</div>`).join('')}
        </div>
        <div style="display:flex;justify-content:space-between;align-items:center;margin-top:.1rem">
          <span style="font-family:var(--fm);font-size:9.5px;color:var(--mu)">${m.lectures} lectures · ${m.sims} sims</span>
          <span class="lvbadge" style="background:${ls.bg};color:${ls.color};border-color:${ls.border}">${m.level}</span>
        </div>
        <div class="arr">↗</div>
        <div class="clb" style="background:${m.color}"></div>
      </div>`;
  }).join('');
}
renderModules();

// ─── VIDEOS GRID ──────────────────────────────────────────────────────────────

function renderVideos() {
  const grid     = document.getElementById('videos-grid');
  const filtered = vidFilter === "all" ? VIDEOS : VIDEOS.filter(v => v.type.toLowerCase() === vidFilter);
  grid.innerHTML = filtered.map((v, i) => `
    <div class="vc au" style="animation-delay:${i * 0.07}s"
      onmouseenter="hoverOn()" onmouseleave="hoverOff()">
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
    </div>`).join('');
}
renderVideos();

function setFilter(btn, filter) {
  vidFilter = filter;
  document.querySelectorAll('.ftab').forEach(b => b.classList.remove('on'));
  btn.classList.add('on');
  renderVideos();
}

// ─── TOOLS GRID ───────────────────────────────────────────────────────────────

document.getElementById('tools-grid').innerHTML = TOOLS.map((t, i) => `
  <div class="tlc au" style="--cc3:${t.color}; animation-delay:${i * 0.07}s"
    onmouseenter="hoverOn()" onmouseleave="hoverOff()">
    <div class="tlibox" style="border-color:${t.color}28">${t.icon}</div>
    <div style="font-family:var(--fd);font-size:28px;text-transform:uppercase;color:${t.color};line-height:1">${t.short}</div>
    <div style="font-family:var(--fs);font-size:12px;font-weight:700;color:var(--tx)">${t.name}</div>
    <div style="font-family:var(--fm);font-size:11px;color:var(--mu);line-height:1.65">${t.desc}</div>
    <div class="tlarr">Open Tool →</div>
  </div>`).join('');

// ─── LEARNING PATH ────────────────────────────────────────────────────────────

document.getElementById('path-steps').innerHTML = PATH_STEPS.map((s, i) => `
  <div class="path-step" data-delay="${i * 110}"
    onmouseenter="hoverOn()" onmouseleave="hoverOff()">
    <div style="width:54px;height:54px;border-radius:50%;background:var(--s2);border:1px solid var(--cy);
      display:flex;align-items:center;justify-content:center;font-family:var(--fd);font-size:22px;
      color:var(--cy);flex-shrink:0;position:relative;z-index:1;box-shadow:0 0 18px rgba(0,200,255,0.18)">
      ${s.n}
    </div>
    <div style="background:var(--s1);border:1px solid var(--b1);padding:1rem 1.35rem;flex:1">
      <div style="font-family:var(--fd);font-size:22px;text-transform:uppercase;color:var(--tx);margin-bottom:.25rem">${s.title}</div>
      <div style="font-family:var(--fm);font-size:11px;color:var(--mu);line-height:1.65;margin-bottom:.65rem">${s.desc}</div>
      <div style="display:flex;flex-wrap:wrap;gap:5px">
        ${s.tags.map(t => `
          <span style="font-family:var(--fm);font-size:9px;letter-spacing:.14em;text-transform:uppercase;
            color:var(--tl);background:rgba(0,229,204,0.06);border:1px solid rgba(0,229,204,0.14);padding:.2rem .65rem">
            ${t}
          </span>`).join('')}
      </div>
    </div>
  </div>`).join('');

// IntersectionObserver for scroll-in animation
const stepObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      const delay = parseInt(e.target.dataset.delay) || 0;
      setTimeout(() => e.target.classList.add('vis'), delay);
      stepObs.unobserve(e.target);
    }
  });
}, { threshold: 0.15 });

document.querySelectorAll('.path-step').forEach(s => stepObs.observe(s));

// ─── MODAL ────────────────────────────────────────────────────────────────────

function openModal(id) {
  selectedModule = MODULES.find(m => m.id === id);
  if (!selectedModule) return;
  currentTab = "layman";
  document.getElementById('modal').classList.remove('hidden');
  document.body.style.overflow = "hidden";
  renderModal();
}

function closeModal() {
  document.getElementById('modal').classList.add('hidden');
  document.body.style.overflow = "";
  selectedModule = null;
}

function handleModalBg(e) {
  if (e.target === e.currentTarget) closeModal();
}

window.addEventListener('keydown', e => { if (e.key === "Escape") closeModal(); });

function renderModal() {
  const m = selectedModule;
  if (!m) return;

  document.getElementById('modal-icon').textContent       = m.icon;
  document.getElementById('modal-play-label').textContent = `Click to play · ${m.title}`;
  document.getElementById('modal-color-bar').style.background =
    `linear-gradient(90deg, transparent, ${m.color}, transparent)`;
  document.getElementById('modal-meta').textContent       = `${m.num} — ${m.level}`;

  const titleEl   = document.getElementById('modal-title');
  titleEl.textContent  = m.title;
  titleEl.style.color  = m.color;

  // Sync tab button states
  const tabNames = ['layman', 'theory', 'simulation'];
  document.querySelectorAll('.mtb').forEach((b, i) => {
    b.classList.toggle('on', tabNames[i] === currentTab);
  });

  renderTabContent();
  renderDotNav();
  renderPrevNext();
}

function setTab(tabName, btn) {
  currentTab = tabName;
  document.querySelectorAll('.mtb').forEach(b => b.classList.remove('on'));
  btn.classList.add('on');
  renderTabContent();
}

// ─── FREQUENCY VIZ SVG ────────────────────────────────────────────────────────

function freqVizHTML(color, id) {
  const shapes = {
    "em-waves":  [0.05, 0.15, 0.4,  0.75, 1.0, 0.82, 0.55, 0.25, 0.08, 0.02],
    "t-lines":   [0.08, 0.25, 0.6,  0.92, 1.0, 0.9,  0.58, 0.22, 0.06, 0.01],
    "patch-ant": [0.02, 0.05, 0.14, 0.58, 1.0, 0.58, 0.14, 0.05, 0.02, 0.01],
  };
  const amps = shapes[id] || [0.1, 0.3, 0.55, 0.85, 1.0, 0.85, 0.55, 0.3, 0.1, 0.02];
  const W = 100, H = 52;
  const pts = amps.map((a, i) => `${(i / (amps.length - 1)) * W},${H - a * (H * 0.82)}`).join(" ");
  const pi  = amps.indexOf(Math.max(...amps));
  const px  = (pi / (amps.length - 1)) * W;

  return `
    <div style="background:#070910;border:1px solid #181818;position:relative;height:80px;overflow:hidden">
      <svg viewBox="0 0 ${W} ${H}" preserveAspectRatio="none" style="width:100%;height:100%;display:block">
        <defs>
          <linearGradient id="fvg-${id}" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stop-color="${color}" stop-opacity="0.3"/>
            <stop offset="100%" stop-color="${color}" stop-opacity="0"/>
          </linearGradient>
        </defs>
        <polygon points="0,${H} ${pts} ${W},${H}" fill="url(#fvg-${id})"/>
        <polyline points="${pts}" fill="none" stroke="${color}" stroke-width="0.9" stroke-linecap="round" stroke-linejoin="round"/>
        <line x1="${px}" y1="0" x2="${px}" y2="${H}" stroke="${color}" stroke-width="0.35" stroke-dasharray="1.5,2" opacity="0.5"/>
        <text x="${px + 1}" y="8" fill="${color}" font-size="4.5" font-family="monospace" opacity="0.8">f₀</text>
      </svg>
      <div style="position:absolute;bottom:.35rem;right:.6rem;font-family:monospace;font-size:8px;color:#2a2a2a;letter-spacing:.14em;text-transform:uppercase">S₁₁</div>
    </div>`;
}

// ─── PATCH SLIDER ─────────────────────────────────────────────────────────────

function patchSliderHTML(color) {
  const freq = (3.5 - (patchLen - 20) * 0.0125).toFixed(3);
  const bw   = (1.2 + (80 - patchLen) * 0.01).toFixed(1);
  const pct  = ((patchLen - 20) / 60) * 100;

  return `
    <div style="background:#0c0e13;border:1px solid #1a1a1a;padding:1.4rem">
      <div style="font-family:monospace;font-size:9px;letter-spacing:.2em;color:#3a3a3a;text-transform:uppercase;margin-bottom:1.1rem">
        ◈ Interactive: Patch Length → Resonant Frequency
      </div>
      <div style="display:flex;justify-content:space-between;align-items:flex-end;margin-bottom:1.25rem;flex-wrap:wrap;gap:1rem">
        <div>
          <div style="font-family:monospace;font-size:9px;color:#3e3e3e;margin-bottom:.15rem">Patch Length L</div>
          <div style="font-family:'Bebas Neue',sans-serif;font-size:46px;line-height:1;color:${color}">
            ${patchLen}<span style="font-size:18px;margin-left:3px;color:#444">mm</span>
          </div>
        </div>
        <div style="text-align:right">
          <div style="font-family:monospace;font-size:9px;color:#3e3e3e;margin-bottom:.15rem">Resonant fᵣ</div>
          <div style="font-family:'Bebas Neue',sans-serif;font-size:46px;line-height:1;color:${color}">
            ${freq}<span style="font-size:18px;margin-left:3px;color:#444">GHz</span>
          </div>
        </div>
      </div>
      <input type="range" min="20" max="80" value="${patchLen}" oninput="updatePatch(this.value)"
        style="width:100%;-webkit-appearance:none;height:2px;background:#222;outline:none;cursor:pointer;accent-color:${color};margin-bottom:.45rem"/>
      <div style="display:flex;justify-content:space-between;font-family:monospace;font-size:8px;color:#333;margin-bottom:1.1rem">
        <span>20mm — high freq</span><span>80mm — low freq</span>
      </div>
      <div style="height:40px;background:#08090c;border:1px solid #181818;position:relative;overflow:hidden">
        <div style="position:absolute;left:${pct}%;top:0;bottom:0;width:2px;background:${color};box-shadow:0 0 12px ${color};transition:left .12s ease"></div>
        <div style="position:absolute;left:0;top:0;bottom:0;width:${pct}%;background:linear-gradient(90deg,transparent,${color}18);transition:width .12s ease"></div>
        <div style="position:absolute;inset:0;display:flex;align-items:center;padding-left:1rem;font-family:monospace;font-size:9px;color:#252525;letter-spacing:.08em">
          Resonance window · BW ≈ ${bw}%
        </div>
        <div style="position:absolute;right:.7rem;top:50%;transform:translateY(-50%);font-family:monospace;font-size:10px;color:${color}">←→</div>
      </div>
    </div>`;
}

function updatePatch(val) {
  patchLen = Number(val);
  const sliderArea = document.getElementById('patch-slider-area');
  if (sliderArea) sliderArea.innerHTML = patchSliderHTML(selectedModule.color);
}

// ─── ASSET PLACEHOLDER ────────────────────────────────────────────────────────

function assetPH(label, path, h = 200, icon = "⚡") {
  return `
    <div style="height:${h}px;background:#08090d;border:1px dashed #1c1c1c;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:.55rem;padding:1rem">
      <div style="width:36px;height:36px;border:1px solid #1e1e1e;display:flex;align-items:center;justify-content:center;font-size:15px">${icon}</div>
      <div style="font-family:monospace;font-size:9.5px;color:#3a3a3a;letter-spacing:.1em;text-align:center">${label}</div>
      <div style="font-family:monospace;font-size:8px;color:#252525;text-align:center">→ ${path}</div>
    </div>`;
}

// ─── TAB CONTENT ─────────────────────────────────────────────────────────────

function renderTabContent() {
  const m  = selectedModule;
  const el = document.getElementById('tab-content');

  if (currentTab === "layman") {
    el.innerHTML = `
      <div class="ai">
        <div class="sl">Physical Intuition — No Math Required</div>
        <h3 style="font-family:var(--fd);font-size:clamp(24px,3.5vw,40px);text-transform:uppercase;line-height:1;letter-spacing:-.01em;margin-bottom:.9rem">
          ${m.title} — Simply Explained
        </h3>
        <p style="font-family:var(--fm);font-size:12px;color:#bcbcbc;line-height:1.88;margin-bottom:.5rem">${m.desc}</p>
        <div class="an">
          <div style="font-size:8.5px;letter-spacing:.25em;text-transform:uppercase;opacity:.5;margin-bottom:.3rem">Topics In This Module</div>
          ${m.topics.map(t => `
            <div style="display:flex;align-items:center;gap:6px;font-family:var(--fm);font-size:11.5px;line-height:1.5;color:var(--ac);margin-bottom:2px">
              <span style="font-size:8px;color:${m.color};flex-shrink:0">▸</span>${t}
            </div>`).join('')}
        </div>
        <div style="margin-top:1.75rem">
          <div class="sl">Frequency Response Preview</div>
          ${freqVizHTML(m.color, m.id)}
          <div style="display:flex;justify-content:space-between;margin-top:.32rem;font-family:monospace;font-size:8.5px;color:var(--mu)">
            <span>Low →</span><span>f₀ (resonance)</span><span>← High</span>
          </div>
        </div>
        <div style="margin-top:1.75rem;display:grid;grid-template-columns:1fr 1fr;gap:1px;background:var(--b1)">
          ${[["Level", m.level], ["Module", m.num + " / 08"], ["Lectures", m.lectures + " video lectures"], ["Simulations", m.sims + " guided sims"]].map(([k, v]) => `
            <div style="background:var(--s2);padding:.8rem 1.05rem">
              <div style="font-family:var(--fm);font-size:8.5px;color:var(--mu);letter-spacing:.18em;text-transform:uppercase;margin-bottom:.22rem">${k}</div>
              <div style="font-family:'Syne',sans-serif;font-size:12.5px;font-weight:700">${v}</div>
            </div>`).join('')}
        </div>
      </div>`;

  } else if (currentTab === "theory") {
    el.innerHTML = `
      <div class="ai">
        <div class="sl">Engineering Theory</div>
        <h3 style="font-family:var(--fd);font-size:clamp(22px,3.5vw,38px);text-transform:uppercase;line-height:1;margin-bottom:.9rem">Technical Deep-Dive</h3>
        <p style="font-family:var(--fm);font-size:12px;color:#bcbcbc;line-height:1.88">
          Full theoretical treatment begins with fundamental EM principles and builds to circuit-level analysis.
          Design equations are derived and verified through simulation at the standard 50 Ω reference impedance.
        </p>
        <div style="margin-top:1.5rem">
          <div class="sl">Key Equations</div>
          ${["Design frequency: 2.4 GHz (WiFi / ISM band)", "Z₀ = 50 Ω (universal RF reference impedance)", "λ/4 section: electrical length = 90° at f₀", "S-matrix satisfies [S]ᵀ = [S] (reciprocal)"]
            .map(eq => `<div class="eq">${eq}</div>`).join('')}
        </div>
        <div style="margin-top:1.5rem">
          <div class="sl">Design Parameters</div>
          <div>${m.topics.map(p => `<span class="pt">${p}</span>`).join('')}</div>
        </div>
        <div style="margin-top:1.5rem">
          <div class="sl">Next.js Image Injection (Asset-Ready)</div>
          <div class="cb"><span class="cm">// Lazy-loaded, optimized HFSS export</span>
<span class="tg">&lt;Image</span>
  <span class="at">src</span>={<span class="s">\`/sim/${m.id}_sparams.svg\`</span>}
  <span class="at">alt</span>=<span class="s">"${m.title} S-parameters"</span>
  <span class="at">fill</span> <span class="at">priority</span> <span class="at">quality</span>={90}
<span class="tg">/&gt;</span></div>
        </div>
      </div>`;

  } else if (currentTab === "simulation") {
    el.innerHTML = `
      <div class="ai">
        <div class="sl">HFSS / CST Simulation Assets</div>
        <h3 style="font-family:var(--fd);font-size:clamp(22px,3.5vw,38px);text-transform:uppercase;line-height:1;margin-bottom:1.2rem">Sim Results</h3>
        ${m.id === "patch-ant" ? `
          <div style="margin-bottom:1.75rem">
            <div class="sl">Interactive Geometry Tuner</div>
            <div id="patch-slider-area">${patchSliderHTML(m.color)}</div>
          </div>` : ''}
        <div class="sl">S-Parameter Plot (HFSS Export)</div>
        ${assetPH("S-Parameter Frequency Response", `/public/sim/${m.id}_sparams.svg`, 180, "📈")}
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:1px;background:var(--b1);margin-top:1px">
          ${assetPH("E-Field Distribution", `/sim/${m.id}_efield.svg`, 128, "⚡")}
          ${assetPH("PCB Photograph",       `/real/${m.id}.webp`,      128, "🔬")}
        </div>
        <div style="margin-top:1.2rem;background:var(--s2);border:1px solid var(--b1);padding:.95rem;display:flex;gap:.8rem;align-items:flex-start">
          <div style="color:var(--ac);font-size:15px;flex-shrink:0">◈</div>
          <div>
            <div style="font-family:var(--fm);font-size:9.5px;color:var(--ac);letter-spacing:.15em;text-transform:uppercase;margin-bottom:.25rem">Vercel Deployment Ready</div>
            <div style="font-family:var(--fm);font-size:10.5px;color:var(--mu);line-height:1.7">
              Files in <span style="color:#ccc">/public/sim/</span> and <span style="color:#ccc">/public/real/</span>
              are auto-optimized by Next.js Image CDN. SVG served with long-cache headers.
            </div>
          </div>
        </div>
      </div>`;
  }
}

// ─── DOT NAV & PREV / NEXT ────────────────────────────────────────────────────

function renderDotNav() {
  document.getElementById('dot-nav').innerHTML = MODULES.map(m => `
    <div onclick="openModal('${m.id}')" onmouseenter="hoverOn()" onmouseleave="hoverOff()"
      style="width:6px;height:6px;border-radius:50%;background:${selectedModule.id === m.id ? m.color : 'var(--b2)'};cursor:pointer;transition:background .2s">
    </div>`).join('');
}

function renderPrevNext() {
  const el  = document.getElementById('prev-next');
  const idx  = MODULES.findIndex(m => m.id === selectedModule.id);
  const prev = MODULES[idx - 1];
  const nxt  = MODULES[idx + 1];

  el.innerHTML = '';
  if (prev) el.innerHTML += `<button class="mtb" onclick="openModal('${prev.id}')" onmouseenter="hoverOn()" onmouseleave="hoverOff()" style="border:1px solid var(--b1);border-right:none">← ${prev.num}</button>`;
  if (nxt)  el.innerHTML += `<button class="mtb" onclick="openModal('${nxt.id}')"  onmouseenter="hoverOn()" onmouseleave="hoverOff()" style="border:1px solid var(--ac);color:var(--ac)">${nxt.num} →</button>`;
}
