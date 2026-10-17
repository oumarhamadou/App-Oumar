/* Frame-accurate motion design timeline for the "Hard Times" reel.
   Everything is a pure function of t (seconds); renderFrame(f) sets the DOM for frame f. */
const FPS = 30, NF = 1047, SRC_W = 1224, SRC_H = 1080;
const CARD = { x: 30, y: 450, w: 1020, h: 1050 };
const $ = (id) => document.getElementById(id);

// ---------- math ----------
const clamp = (x, a = 0, b = 1) => Math.min(b, Math.max(a, x));
const lerp = (a, b, u) => a + (b - a) * u;
const p = (t, a, b) => clamp((t - a) / (b - a));
const eo3 = (x) => 1 - Math.pow(1 - x, 3);
const eo5 = (x) => 1 - Math.pow(1 - x, 5);
const ei2 = (x) => x * x;
const eio3 = (x) => (x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2);
const eoBack = (x, s = 1.70158) => 1 + (s + 1) * Math.pow(x - 1, 3) + s * Math.pow(x - 1, 2);
const win = (t, a, b, din = 0.25, dout = 0.22) => Math.min(p(t, a, a + din), 1 - p(t, b - dout, b));
const hash = (n) => { const x = Math.sin(n * 127.1 + 311.7) * 43758.5453; return x - Math.floor(x); };
const pingpong = (x, len) => { const m = x % (2 * len); return m < len ? m : 2 * len - m; };
const hex2rgb = (h) => [parseInt(h.slice(1, 3), 16), parseInt(h.slice(3, 5), 16), parseInt(h.slice(5, 7), 16)];
const mix = (a, b, u) => a.map((v, i) => Math.round(lerp(v, b[i], u)));
const rgba = (c, a) => `rgba(${c[0]},${c[1]},${c[2]},${a})`;
const COL = { b: '#0A84FF', g: '#30D158', o: '#FF9F0A', r: '#FF453A', y: '#FFD60A', t: '#64D2FF', w: '#FFFFFF' };

// ---------- footage: shots & framing ----------
// frame boundaries of the original cuts (scene detection) and where the face is in each shot
const SHOTS = [
  { f0: 0,   fx: 580,  fy: 270, ay: 0.30 },  // guest medium
  { f0: 439, fx: 1076, fy: 300, ay: 0.30 },  // wide two-shot
  { f0: 569, fx: 602,  fy: 300, ay: 0.32 },  // host
  { f0: 605, fx: 560,  fy: 290, ay: 0.30 },  // guest medium
  { f0: 701, fx: 556,  fy: 420, ay: 0.40 },  // guest close-up
];
const shotAt = (f) => { let s = SHOTS[0]; for (const x of SHOTS) if (f >= x.f0) s = x; return s; };
function cover(bw, bh, k, fx, fy, ax, ay) {
  const s = Math.max(bw / SRC_W, bh / SRC_H) * k;
  const x = clamp(bw * ax - fx * s, bw - SRC_W * s, 0);
  const y = clamp(bh * ay - fy * s, bh - SRC_H * s, 0);
  return { s, x, y };
}
// punch-in / push-in schedule for the main card (keeps the original edit, adds camera energy)
function kMain(t) {
  if (t < 4.40) return lerp(1.0, 1.07, eio3(p(t, 0.3, 4.4)));
  if (t < 4.70) return lerp(1.07, 1.9, ei2(p(t, 4.40, 4.66)));
  if (t < 14.633) return lerp(1.10, 1.04, eo3(p(t, 13.85, 14.5)));
  if (t < 17.45) return lerp(1.14, 1.0, eo3(p(t, 14.633, 15.2))) + 0.03 * p(t, 15.2, 16.3);
  if (t < 18.967) return lerp(1.06, 1.10, p(t, 17.45, 18.967));
  if (t < 20.167) return lerp(1.0, 1.05, p(t, 18.967, 20.167));
  if (t < 20.24) return 1.0;
  if (t < 21.18) return lerp(1.0, 1.2, eo5(p(t, 20.24, 20.34))) + 0.02 * p(t, 20.34, 21.18);
  if (t < 23.367) return lerp(1.22, 1.08, eo3(p(t, 21.18, 21.5))) + 0.04 * p(t, 21.5, 23.367);
  if (t < 25.4) return lerp(1.0, 1.07, p(t, 23.367, 25.4));
  if (t < 28.6) return lerp(1.07, 1.12, p(t, 25.4, 28.6));
  if (t < 31.4) return lerp(1.12, 1.14, p(t, 28.6, 31.4));
  if (t < 33.68) return lerp(1.2, 1.02, eo3(p(t, 31.4, 31.75))) + 0.10 * eio3(p(t, 31.75, 33.66));
  return lerp(1.24, 1.16, eo3(p(t, 33.68, 34.9)));
}
// camera shake impulses [t0, amplitude px, decay]
const SHAKES = [[9.76, 10, 7], [16.24, 22, 5], [17.40, 16, 7], [20.24, 8, 9], [24.04, 9, 8], [28.45, 6, 9], [33.68, 18, 4.5]];
function shakeAt(t, f) {
  let x = 0, y = 0;
  for (const [t0, a, d] of SHAKES) {
    if (t < t0 || t > t0 + 1.2) continue;
    const e = a * Math.exp(-(t - t0) * d);
    x += (hash(f * 1.3 + t0) - 0.5) * 2 * e; y += (hash(f * 2.7 + t0 * 3) - 0.5) * 2 * e;
  }
  return [x, y];
}

// ---------- background ----------
const bg = $('bg').getContext('2d');
const grid = document.createElement('canvas'); grid.width = 1080; grid.height = 1920 + 288;
(function buildGrid() {
  const g = grid.getContext('2d'), c = 72;
  for (let x = 0; x <= 1080; x += c) { g.fillStyle = (x / c) % 4 === 3 ? 'rgba(255,255,255,.085)' : 'rgba(255,255,255,.045)'; g.fillRect(x - 0.5 + 18, 0, 1.5, grid.height); }
  for (let y = 0; y <= grid.height; y += c) { g.fillStyle = (y / c) % 4 === 0 ? 'rgba(255,255,255,.085)' : 'rgba(255,255,255,.045)'; g.fillRect(0, y - 0.5, 1080, 1.5); }
  g.fillStyle = 'rgba(255,255,255,.28)';
  for (let x = 18 + 3 * c; x <= 1080; x += 4 * c) for (let y = 0; y <= grid.height; y += 4 * c) { g.fillRect(x - 7, y - 1, 14, 2); g.fillRect(x - 1, y - 7, 2, 14); }
})();
const ACC = [ // [t0, t1, colorKey] — the ambient glow follows the story
  [4.45, 6.0, 'b'], [6.0, 7.7, 'g'], [7.7, 9.5, 'o'], [9.5, 11.2, 'r'], [11.2, 12.4, 'b'],
  [16.2, 17.5, 'r'], [19.55, 20.2, 'r'], [22.2, 23.5, 'r'], [24.0, 25.3, 'o'], [27.8, 28.95, 'y'],
  [29.5, 31.5, 't'], [33.66, 35, 'r'],
];
function accentAt(t) {
  let c = [64, 160, 255], best = 0;
  for (const [a, b, k] of ACC) { const w = win(t, a, b, 0.3, 0.3); if (w > best) { best = w; c = mix([64, 160, 255], hex2rgb(COL[k]), w); } }
  return c;
}
function drawBG(t, acc) {
  bg.fillStyle = '#06070A'; bg.fillRect(0, 0, 1080, 1920);
  const off = (t * 12) % 288;
  bg.drawImage(grid, 0, -off);
  const gx = 190 + Math.sin(t * 0.35) * 60, gy = 360 + Math.cos(t * 0.3) * 40;
  let g = bg.createRadialGradient(gx, gy, 0, gx, gy, 820);
  g.addColorStop(0, rgba(acc, 0.30)); g.addColorStop(0.45, rgba(acc, 0.10)); g.addColorStop(1, rgba(acc, 0));
  bg.fillStyle = g; bg.fillRect(0, 0, 1080, 1920);
  const hx = 930 + Math.cos(t * 0.27) * 50, hy = 1660 + Math.sin(t * 0.33) * 50;
  g = bg.createRadialGradient(hx, hy, 0, hx, hy, 900);
  g.addColorStop(0, 'rgba(255,128,52,.20)'); g.addColorStop(0.5, 'rgba(255,128,52,.06)'); g.addColorStop(1, 'rgba(255,128,52,0)');
  bg.fillStyle = g; bg.fillRect(0, 0, 1080, 1920);
  // fade the grid towards the edges
  g = bg.createRadialGradient(540, 900, 300, 540, 900, 1250);
  g.addColorStop(0, 'rgba(6,7,10,0)'); g.addColorStop(1, 'rgba(6,7,10,.85)');
  bg.fillStyle = g; bg.fillRect(0, 0, 1080, 1920);
}

// ---------- header ----------
const HEAD = [['History'], ['runs'], ['in'], ['a'], ['4-step', 'b'], ['loop.', 'b'], ['<br>'], ['We’re'], ['in'], ['step 4.', 'b red']];
const headWords = [];
(function buildHeader() {
  const h = $('headline');
  for (const [w, cls] of HEAD) {
    if (w === '<br>') { h.appendChild(document.createElement('br')); continue; }
    const s = document.createElement('span'); s.className = 'w' + (cls ? ' ' + cls : ''); s.textContent = w;
    h.appendChild(s); h.appendChild(document.createTextNode(' ')); headWords.push(s);
  }
})();
function renderHeader(t) {
  const pill = $('pill'), a = eo3(p(t, 0.05, 0.4));
  pill.style.opacity = a; pill.style.transform = `translateY(${(1 - a) * 20}px)`;
  pill.querySelector('.live').style.opacity = 0.45 + 0.55 * (0.5 + 0.5 * Math.cos(t * 5));
  headWords.forEach((s, i) => {
    const u = p(t, 0.12 + i * 0.06, 0.42 + i * 0.06), e = eoBack(u, 1.2);
    s.style.opacity = clamp(u * 1.6);
    let sc = 1;
    if (s.classList.contains('red')) {
      const pulse = Math.max(win(t, 22.24, 22.9, 0.08, 0.4), win(t, 33.68, 34.95, 0.08, 0.2));
      sc = 1 + 0.08 * pulse;
      s.style.textShadow = `0 0 ${28 + 40 * pulse}px rgba(255,69,58,${0.55 + 0.4 * pulse})`;
    }
    s.style.transform = `translateY(${(1 - e) * 34}px) scale(${sc})`;
  });
}

// ---------- canvas scene (workflow nodes) ----------
const R = 900, DELTA = 0.43;
const NODES = [
  { n: '01', title: 'Strong men', sub: 'make good times  →', c: 'b', emo: 'biceps', x: 0, y: -R, show: 4.45, base: 0, len: 104, t0: 4.45 },
  { n: '02', title: 'Good times', sub: 'make weak men  →', c: 'g', emo: 'glasses', x: R, y: 0, show: 6.05, base: 105, len: 104, t0: 6.05 },
  { n: '03', title: 'Weak men', sub: 'make hard times  →', c: 'o', emo: 'couch', x: 0, y: R, show: 7.75, base: 216, len: 98, t0: 7.75 },
  { n: '04', title: 'Hard times', sub: 'make strong men  ↻', c: 'r', emo: 'storm', x: -R, y: 0, show: 9.50, base: 0, len: 0, t0: 9.5 },
];
const ACTIVE = [[4.45, 6.02, 0], [6.02, 7.72, 1], [7.72, 9.45, 2], [9.45, 11.22, 3], [11.22, 12.45, 0]];
const ARCS = [[5.92, 6.30], [7.62, 8.00], [9.35, 9.75], [11.10, 11.50]];
const SVGNS = 'http://www.w3.org/2000/svg';
const sv = (tag, attrs, parent) => { const e = document.createElementNS(SVGNS, tag); for (const k in attrs) e.setAttribute(k, attrs[k]); parent && parent.appendChild(e); return e; };
const nodeEls = [], arcEls = [];
let comet = [];
(function buildScene() {
  const svg = $('ringsvg'), defs = sv('defs', {}, svg);
  const glow = sv('filter', { id: 'glow', x: '-50%', y: '-50%', width: '200%', height: '200%' }, defs);
  sv('feGaussianBlur', { stdDeviation: '10', result: 'b' }, glow);
  const m = sv('feMerge', {}, glow); sv('feMergeNode', { in: 'b' }, m); sv('feMergeNode', { in: 'SourceGraphic' }, m);
  sv('circle', { cx: 0, cy: 0, r: R, fill: 'none', stroke: 'rgba(255,255,255,.13)', 'stroke-width': 5, 'stroke-dasharray': '2 22', 'stroke-linecap': 'round' }, svg);
  for (let i = 0; i < 4; i++) {
    const a0 = -Math.PI / 2 + i * Math.PI / 2 + DELTA, a1 = -Math.PI / 2 + (i + 1) * Math.PI / 2 - DELTA;
    const P = (a) => [R * Math.cos(a), R * Math.sin(a)];
    const [x0, y0] = P(a0), [x1, y1] = P(a1);
    const gid = 'g' + i, lg = sv('linearGradient', { id: gid, gradientUnits: 'userSpaceOnUse', x1: x0, y1: y0, x2: x1, y2: y1 }, defs);
    sv('stop', { offset: '0', 'stop-color': COL[NODES[i].c] }, lg); sv('stop', { offset: '1', 'stop-color': COL[NODES[(i + 1) % 4].c] }, lg);
    const path = sv('path', { d: `M${x0} ${y0} A${R} ${R} 0 0 1 ${x1} ${y1}`, fill: 'none', stroke: `url(#${gid})`, 'stroke-width': 10, 'stroke-linecap': 'round', filter: 'url(#glow)' }, svg);
    const L = R * (a1 - a0);
    path.setAttribute('stroke-dasharray', `${L} ${L}`);
    const head = sv('polygon', { points: '-26,-22 18,0 -26,22 -16,0', fill: COL[NODES[(i + 1) % 4].c] }, svg);
    const pk = sv('circle', { r: 16, fill: '#fff', filter: 'url(#glow)' }, svg);
    arcEls.push({ path, head, pk, a0, a1, L });
  }
  for (let j = 0; j < 14; j++) comet.push(sv('circle', { r: 26 - j * 1.5, fill: '#fff', opacity: 0, filter: j === 0 ? 'url(#glow)' : '' }, svg));
  const wrap = $('nodes');
  NODES.forEach((N) => {
    const d = document.createElement('div'); d.className = 'node';
    d.innerHTML = `<div class="top"><span class="chip" style="background:${COL[N.c]}26;color:${COL[N.c]}"><i style="background:${COL[N.c]};box-shadow:0 0 12px ${COL[N.c]}"></i>STEP ${N.n}</span><span class="dotsmenu">•••</span></div>
      <div class="media"><img class="m"></div><img class="emo" src="assets/emoji/${N.emo}.png">
      <div class="title">${N.title}</div><div class="sub">${N.sub}</div>`;
    wrap.appendChild(d); nodeEls.push({ d, img: d.querySelector('img.m'), emo: d.querySelector('.emo') });
  });
})();
const CAMK = [
  [4.45, 0, -R, 1.9], [4.95, 0, -R, 1.0, 'eo'], [5.85, 0, -R, 1.03, 'lin'], [6.30, R, 0, 1.0, 'pan'],
  [7.55, R, 0, 1.03, 'lin'], [8.00, 0, R, 1.0, 'pan'], [9.30, 0, R, 1.03, 'lin'], [9.75, -R, 0, 1.0, 'pan'],
  [11.05, -R, 0, 1.03, 'lin'], [11.50, 0, -R, 1.0, 'pan'], [12.30, 0, -R, 1.04, 'lin'], [12.95, 0, 70, 0.325, 'eio'], [13.95, 0, 70, 0.35, 'lin'],
];
function camAt(t) {
  if (t <= CAMK[0][0]) return { cx: CAMK[0][1], cy: CAMK[0][2], z: CAMK[0][3], rot: 0 };
  for (let i = 1; i < CAMK.length; i++) {
    const [t1, x1, y1, z1, mode] = CAMK[i], [t0, x0, y0, z0] = CAMK[i - 1];
    if (t <= t1) {
      const u0 = p(t, t0, t1);
      const u = mode === 'lin' ? u0 : mode === 'eo' ? eo5(u0) : eio3(u0);
      let z = lerp(z0, z1, u); if (mode === 'pan') z *= 1 - 0.2 * Math.sin(Math.PI * u);
      return { cx: lerp(x0, x1, u), cy: lerp(y0, y1, u), z, rot: 12 * eio3(p(t, 12.6, 13.95)) };
    }
  }
  const L = CAMK[CAMK.length - 1]; return { cx: L[1], cy: L[2], z: L[3], rot: 12 };
}
function renderScene(t, loads) {
  const op = Math.min(p(t, 4.42, 4.58), 1 - p(t, 13.58, 13.82));
  const sc = $('scene'); sc.style.opacity = op; sc.style.display = op > 0 ? 'block' : 'none';
  if (op <= 0) return;
  const c = camAt(t), c2 = camAt(t - 1 / FPS);
  const speed = Math.hypot((c.cx - c2.cx) * c.z, (c.cy - c2.cy) * c.z) + Math.abs(c.z - c2.z) * 900;
  const cam = $('cam');
  cam.style.transform = `translate(510px,450px) rotate(${c.rot}deg) scale(${c.z}) translate(${-c.cx}px,${-c.cy}px)`;
  const blur = clamp(speed / 22 - 0.6, 0, 7);
  cam.style.filter = blur > 0.2 ? `blur(${blur.toFixed(2)}px)` : 'none';
  let act = -1; for (const [a, b, i] of ACTIVE) if (t >= a && t < b) act = i;
  const over = p(t, 12.45, 12.9);
  NODES.forEach((N, i) => {
    const { d, img, emo } = nodeEls[i];
    const ap = p(t, N.show, N.show + 0.42);
    if (ap <= 0) { d.style.display = 'none'; return; }
    d.style.display = 'block';
    const isA = act === i, aw = Math.max(isA ? 1 : 0, over);
    const s = (0.55 + 0.45 * eoBack(ap, 2.2)) * (0.93 + 0.07 * aw);
    d.style.transform = `translate(-50%,-50%) translate(${N.x}px,${N.y}px) scale(${s}) rotate(${-c.rot}deg)`;
    d.style.left = '0px'; d.style.top = '0px';
    d.style.opacity = clamp(ap * 2) * (0.5 + 0.5 * aw);
    const col = COL[N.c];
    d.style.borderColor = aw > 0.5 ? col : 'rgba(255,255,255,.1)';
    d.style.boxShadow = aw > 0.5 ? `0 0 0 6px ${col}33, 0 0 70px ${col}55, 0 40px 90px rgba(0,0,0,.55)` : '0 40px 90px rgba(0,0,0,.55)';
    emo.style.transform = `translateY(${Math.sin(t * 3 + i) * 8}px) rotate(${Math.sin(t * 2 + i) * 6}deg) scale(${0.4 + 0.6 * eoBack(p(t, N.show + 0.12, N.show + 0.5), 3)})`;
    let fr;
    if (i === 3) { fr = 315 + pingpong(clamp(55 + (t - 9.85) * 30, 0, 999), 104); img.style.filter = 'brightness(1.55) contrast(1.2) saturate(1.2)'; }
    else fr = N.base + pingpong(Math.max(0, (t - N.t0) * 30), N.len);
    setSrc(img, `frames/broll/${String(Math.round(fr)).padStart(4, '0')}.jpg`, loads);
  });
  arcEls.forEach((A, i) => {
    const [a, b] = ARCS[i], u = eio3(p(t, a, b));
    A.path.style.display = u > 0 ? 'block' : 'none';
    A.path.setAttribute('stroke-dashoffset', A.L * (1 - u));
    const ang = lerp(A.a0, A.a1, u), x = R * Math.cos(ang), y = R * Math.sin(ang);
    A.pk.setAttribute('cx', x); A.pk.setAttribute('cy', y); A.pk.setAttribute('opacity', u > 0 && u < 1 ? 1 : 0);
    A.head.setAttribute('transform', `translate(${R * Math.cos(A.a1)},${R * Math.sin(A.a1)}) rotate(${(A.a1 + Math.PI / 2) * 180 / Math.PI})`);
    A.head.setAttribute('opacity', clamp((u - 0.92) * 12));
  });
  // comet around the loop once we zoom out ("and so it goes")
  const cu = p(t, 12.55, 13.9), turns = 1.7 * Math.pow(cu, 1.6);
  comet.forEach((cEl, j) => {
    const ang = -Math.PI / 2 + 2 * Math.PI * Math.max(0, turns - j * 0.012);
    cEl.setAttribute('cx', R * Math.cos(ang)); cEl.setAttribute('cy', R * Math.sin(ang));
    cEl.setAttribute('opacity', cu > 0 ? (1 - j / 14) * clamp(cu * 8) : 0);
  });
  const ol = $('overLabel'), ou = eoBack(p(t, 12.7, 13.1), 1.6);
  ol.style.opacity = clamp(p(t, 12.7, 12.95));
  ol.style.transform = `translate(-50%,-50%) translate(0px,${-40}px) rotate(${-c.rot}deg) scale(${0.6 + 0.4 * ou})`;
  ol.querySelector('img').style.transform = `rotate(${-360 * eio3(p(t, 12.7, 13.8))}deg)`;
}

// ---------- palette ----------
function renderPalette(t) {
  const el = $('palette'), vis = t > 2.6 && t < 4.62;
  el.style.display = vis ? 'block' : 'none'; if (!vis) return;
  const a = eo3(p(t, 2.62, 2.86)), out = p(t, 4.40, 4.60);
  el.style.opacity = a * (1 - out);
  el.style.transform = `translateY(${(1 - a) * 30}px) scale(${(0.94 + 0.06 * a) * (1 + 0.14 * ei2(out))})`;
  el.style.filter = out > 0 ? `blur(${out * 10}px)` : 'none';
  const txt = 'lovely quote', n = Math.floor(p(t, 3.26, 4.02) * txt.length + 0.0001);
  const typed = $('palTyped');
  if (n === 0) { typed.textContent = 'Search quotes…'; typed.className = 'typed ph'; } else { typed.textContent = txt.slice(0, n); typed.className = 'typed'; }
  $('palCaret').style.opacity = (n > 0 && n < txt.length) || Math.floor(t * 2.6) % 2 === 0 ? 1 : 0;
  const r1 = eo3(p(t, 3.95, 4.15)), r2 = eo3(p(t, 4.03, 4.23));
  $('palSec').style.opacity = r1;
  $('palR1').style.opacity = r1; $('palR1').style.transform = `translateY(${(1 - r1) * 18}px)`;
  $('palR2').style.opacity = r2 * 0.75; $('palR2').style.transform = `translateY(${(1 - r2) * 18}px)`;
  $('palSec').style.display = $('palR1').style.display = $('palR2').style.display = r1 > 0 ? '' : 'none';
  const click = win(t, 4.32, 4.5, 0.03, 0.15);
  $('palR1').style.background = `rgba(10,132,255,${0.22 + 0.35 * click})`;
}
function renderCursor(t) {
  const el = $('cursor'), vis = t > 3.95 && t < 4.62;
  el.style.display = vis ? 'block' : 'none'; if (!vis) return;
  const u = eio3(p(t, 3.97, 4.30));
  const x = lerp(1010, 560, u), y = lerp(1470, 870, u) - Math.sin(Math.PI * u) * 60;
  const s = 1 - 0.16 * win(t, 4.32, 4.44, 0.03, 0.08);
  el.style.opacity = clamp(p(t, 3.95, 4.05)) * (1 - p(t, 4.45, 4.6));
  el.style.transform = `translate(${x}px,${y}px) scale(${s})`;
}

// ---------- status page ----------
const ST_ROWS = [['Economy', 'DEGRADED', 'o'], ['Politics', 'DEGRADED', 'o'], ['Leadership', 'PARTIAL OUTAGE', 'o'], ['Stability', 'OPERATIONAL', 'g']];
const stBars = [];
(function buildStatus() {
  const wrap = $('stRows');
  ST_ROWS.forEach((r, i) => {
    const d = document.createElement('div'); d.className = 'r';
    d.innerHTML = `<div class="rl"><span>${r[0]}</span><b></b></div><div class="bars"></div>`;
    const bars = d.querySelector('.bars'), arr = [];
    for (let j = 0; j < 34; j++) { const b = document.createElement('i'); bars.appendChild(b); arr.push(b); }
    wrap.appendChild(d); stBars.push({ lab: d.querySelector('b'), arr });
  });
})();
function renderStatus(t) {
  const el = $('status'), vis = t > 14.95 && t < 18.9;
  el.style.display = vis ? 'block' : 'none'; if (!vis) return;
  const a = eo3(p(t, 15.0, 15.32)), out = eo3(p(t, 18.55, 18.85));
  const sh = Math.sin(t * 90) * 10 * Math.exp(-Math.max(0, t - 16.28) * 6) * (t > 16.28 ? 1 : 0);
  el.style.opacity = a * (1 - out);
  el.style.transform = `translate(${sh}px,${(1 - a) * -30 + out * -24}px) scale(${0.95 + 0.05 * a})`;
  const bad = t >= 16.3;
  const stc = bad ? COL.r : COL.o;
  const st = $('stState');
  st.style.background = stc + '2a'; st.style.color = stc;
  st.querySelector('i').style.background = stc; st.querySelector('i').style.boxShadow = `0 0 ${10 + (bad ? 8 * (0.5 + 0.5 * Math.sin(t * 14)) : 0)}px ${stc}`;
  st.querySelector('span').textContent = bad ? 'MAJOR OUTAGE' : 'DEGRADED';
  $('stFav').style.background = stc;
  $('stTitle').textContent = 'World status';
  stBars.forEach((R_, i) => {
    const ft = 16.32 + i * 0.14, flipped = t >= ft;
    R_.lab.textContent = flipped ? 'OUTAGE' : ST_ROWS[i][1];
    R_.lab.style.color = flipped ? COL.r : COL[ST_ROWS[i][2]];
    R_.arr.forEach((b, j) => {
      const rnd = hash(i * 50 + j);
      let c = rnd > 0.9 ? COL.o : rnd > 0.84 && j > 20 ? COL.o : COL.g;
      if (i === 3) c = rnd > 0.95 ? COL.o : COL.g;
      const fj = ft + (33 - j) * 0.012;
      if (t >= fj) c = j > 6 || rnd > 0.5 ? COL.r : COL.o;
      b.style.background = c; b.style.opacity = t >= fj && t < fj + 0.06 ? 1 : 0.88;
      b.style.transform = t >= fj && t < fj + 0.08 ? 'scaleY(1.35)' : 'none';
    });
  });
}

// ---------- stepper (phase tracker) ----------
const STEPS = [['Strong men', 'b'], ['Good times', 'g'], ['Weak men', 'o'], ['Hard times', 'r']];
function buildStepper(id) {
  const el = $(id);
  el.innerHTML = `<div class="track"></div><div class="fill"></div>` +
    STEPS.map((s, i) => `<div class="st" style="left:${150 + i * 220 - 120}px"><div class="c">${i + 1}</div><div class="lb">${s[0]}</div></div>`).join('') +
    `<div class="pulse"></div><div class="pulse"></div><img class="pin" src="assets/emoji/pin.png"><div class="here">YOU ARE HERE</div><div class="here next" style="background:${COL.b};box-shadow:0 10px 30px rgba(10,132,255,.5)">NEXT ↻</div>`;
  return { el, fill: el.querySelector('.fill'), cs: [...el.querySelectorAll('.c')], lbs: [...el.querySelectorAll('.lb')], pulses: [...el.querySelectorAll('.pulse')], pin: el.querySelector('.pin'), here: el.querySelector('.here'), next: el.querySelector('.next') };
}
const STP1 = buildStepper('stepper'), STP2 = buildStepper('stepper2');
$('stepper2').style.top = '40px';
function renderStepper(S, t, t0, t1, prog0, prog1, pinT, nextT) {
  const vis = t > t0 && t < t1;
  S.el.style.display = vis ? 'block' : 'none'; if (!vis) return;
  const a = eo3(p(t, t0, t0 + 0.24)), out = eo3(p(t, t1 - 0.25, t1));
  S.el.style.opacity = a * (1 - out);
  S.el.style.transform = `translateY(${(1 - a) * -26 - out * 20}px) scale(${0.95 + 0.05 * a})`;
  const pr = lerp(0, 1, eio3(p(t, prog0, prog1)));
  S.fill.style.width = `${660 * pr}px`;
  S.cs.forEach((c, i) => {
    const on = pr >= i / 3 - 0.001, col = COL[STEPS[i][1]];
    c.style.background = on ? col : '#1b1d24'; c.style.borderColor = on ? col : 'rgba(255,255,255,.2)';
    c.style.boxShadow = on ? `0 0 24px ${col}88` : 'none';
    const isHere = i === 3 && t >= pinT;
    c.style.transform = `scale(${isHere ? 1 + 0.12 * win(t, pinT, pinT + 0.5, 0.06, 0.3) : 1})`;
    S.lbs[i].style.fontWeight = isHere ? 860 : 400; S.lbs[i].style.color = isHere ? COL.r : 'rgba(255,255,255,.7)';
  });
  S.pulses.forEach((pl, k) => {
    const ph = ((t - pinT) / 0.9 + k * 0.5) % 1;
    pl.style.display = t >= pinT ? 'block' : 'none';
    pl.style.left = `${810 - 31}px`; pl.style.top = `${56}px`;
    pl.style.transform = `scale(${1 + ph * 1.4})`; pl.style.opacity = (1 - ph) * 0.8;
  });
  const pu = p(t, pinT, pinT + 0.42);
  const drop = pu <= 0 ? -200 : -120 * (1 - eoBack(pu, 2.4));
  S.pin.style.display = pu > 0 ? 'block' : 'none';
  S.pin.style.left = `${810 - 30}px`; S.pin.style.top = `${-22 + drop}px`;
  S.pin.style.opacity = clamp(pu * 4);
  const hu = eo3(p(t, pinT + 0.12, pinT + 0.4));
  S.here.style.right = `${960 - 778 + (1 - hu) * -30}px`; S.here.style.top = "4px"; S.here.style.opacity = hu;
  const nu = nextT ? eoBack(p(t, nextT, nextT + 0.3), 2) : 0;
  S.next.style.display = nextT && t >= nextT ? 'flex' : 'none';
  S.next.style.left = `${150 - 70}px`; S.next.style.top = '-8px'; S.next.style.opacity = clamp(nu);
  S.next.style.transform = `scale(${0.6 + 0.4 * nu})`;
  if (nextT && t >= nextT) {
    const c0 = S.cs[0], pul = 0.5 + 0.5 * Math.sin((t - nextT) * 12);
    c0.style.boxShadow = `0 0 ${20 + 26 * pul}px ${COL.b}, 0 0 0 ${4 + 6 * pul}px ${COL.b}44`;
    S.lbs[0].style.fontWeight = 860; S.lbs[0].style.color = COL.b;
  }
}

// ---------- difficulty selector ----------
function renderDiff(t) {
  const el = $('diff'), vis = t > 23.6 && t < 25.45;
  el.style.display = vis ? 'block' : 'none'; if (!vis) return;
  const a = eo3(p(t, 23.62, 23.86)), out = eo3(p(t, 25.2, 25.42));
  const sh = t > 24.04 ? Math.sin((t - 24.04) * 70) * 12 * Math.exp(-(t - 24.04) * 7) : 0;
  el.style.opacity = a * (1 - out);
  el.style.transform = `translate(${sh}px,${(1 - a) * -26 - out * 20}px) scale(${0.95 + 0.05 * a})`;
  const pos = t < 23.92 ? 0 : t < 24.02 ? lerp(0, 1, eo3(p(t, 23.92, 24.0))) : lerp(1, 2, eoBack(p(t, 24.02, 24.14), 2));
  const segW = (720 - 56) / 3, sel = $('diffSel');
  sel.style.left = `${7 + pos * segW}px`; sel.style.width = `${segW - 14}px`;
  const hard = pos > 1.5;
  sel.style.background = hard ? COL.r : 'rgba(255,255,255,.16)';
  sel.style.boxShadow = hard ? `0 0 34px ${COL.r}aa` : 'none';
  ['d0', 'd1', 'd2'].forEach((id, i) => { const o = $(id), on = Math.round(pos) === i; o.style.fontWeight = on ? 860 : 400; o.style.color = on ? '#fff' : 'rgba(255,255,255,.55)'; });
  const v = $('diffVal'); v.textContent = ['EASY', 'NORMAL', 'HARD'][Math.round(pos)]; v.style.color = hard ? COL.r : '#fff';
}

// ---------- search: "leadership" → 0 results ----------
function renderSearch(t) {
  const el = $('search'), vis = t > 26.28 && t < 29.08;
  el.style.display = vis ? 'block' : 'none'; if (!vis) return;
  const a = eo3(p(t, 26.3, 26.56)), out = eo3(p(t, 28.82, 29.06));
  const sh = t > 28.46 ? Math.sin((t - 28.46) * 62) * 18 * Math.exp(-(t - 28.46) * 6) : 0;
  el.style.opacity = a * (1 - out);
  el.style.transform = `translate(${sh}px,${(1 - a) * -26 - out * 20}px) scale(${0.95 + 0.05 * a})`;
  const txt = 'leadership', n = Math.floor(p(t, 27.45, 28.22) * txt.length + 0.0001), ty = $('seTyped');
  if (n === 0) { ty.textContent = 'Search…'; ty.style.color = 'rgba(255,255,255,.35)'; } else { ty.textContent = txt.slice(0, n); ty.style.color = '#fff'; }
  $('seCaret').style.opacity = t < 28.25 && ((n > 0 && n < txt.length) || Math.floor(t * 2.6) % 2 === 0) ? 1 : 0;
  const sp = $('spinner'); sp.style.opacity = win(t, 28.24, 28.48, 0.04, 0.05); sp.style.transform = `rotate(${t * 900}deg)`;
  const r = eo3(p(t, 28.45, 28.66)); $('seRes').style.height = `${170 * r}px`; $('seRes').style.opacity = r;
  $('seRes').style.borderTopColor = 'rgba(255,255,255,.1)';
}

// ---------- globe ----------
let world = null, graticule = null, sphere = { type: 'Sphere' };
const gctx = $('globe').getContext('2d');
const PINS = [[-98, 39], [2, 47], [37, 55], [78, 22], [116, 36], [-58, -15], [24, 2], [135, -25], [-3, 40], [46, 30]];
function renderGlobe(t) {
  const L = $('globeLayer'), vis = t > 29.5 && t < 31.65;
  L.style.display = vis ? 'block' : 'none'; if (!vis || !world) return;
  const a = eo3(p(t, 29.52, 29.85)), out = p(t, 31.36, 31.62);
  L.style.opacity = a * (1 - eo3(out));
  const gs = (0.55 + 0.45 * eoBack(p(t, 29.52, 29.95), 1.4)) * (1 + 1.8 * ei2(out));
  const cvs = $('globe'); cvs.style.transform = `scale(${gs})`;
  $('globeDim').style.opacity = 1 - out;
  const lam = 20 - (t - 29.5) * 24, phi = -16;
  const proj = d3.geoOrthographic().scale(700).translate([800, 800]).rotate([lam, phi]).clipAngle(90);
  const path = d3.geoPath(proj, gctx);
  gctx.clearRect(0, 0, 1600, 1600);
  // atmosphere
  let g = gctx.createRadialGradient(800, 800, 640, 800, 800, 790);
  g.addColorStop(0, 'rgba(100,210,255,.0)'); g.addColorStop(0.6, 'rgba(100,210,255,.20)'); g.addColorStop(1, 'rgba(100,210,255,0)');
  gctx.fillStyle = g; gctx.beginPath(); gctx.arc(800, 800, 790, 0, Math.PI * 2); gctx.fill();
  g = gctx.createRadialGradient(620, 560, 50, 800, 800, 720);
  g.addColorStop(0, '#16304f'); g.addColorStop(1, '#070d18');
  gctx.fillStyle = g; gctx.beginPath(); path(sphere); gctx.fill();
  gctx.strokeStyle = 'rgba(100,190,255,.28)'; gctx.lineWidth = 2; gctx.beginPath(); path(graticule); gctx.stroke();
  gctx.fillStyle = 'rgba(160,215,255,.16)'; gctx.strokeStyle = 'rgba(200,235,255,.55)'; gctx.lineWidth = 1.6;
  gctx.beginPath(); path(world); gctx.fill(); gctx.stroke();
  gctx.strokeStyle = 'rgba(100,210,255,.8)'; gctx.lineWidth = 4; gctx.beginPath(); path(sphere); gctx.stroke();
  // scan line
  const sy = 120 + ((t - 29.5) * 520) % 1360;
  g = gctx.createLinearGradient(0, sy - 60, 0, sy + 4); g.addColorStop(0, 'rgba(100,210,255,0)'); g.addColorStop(1, 'rgba(100,210,255,.16)');
  gctx.save(); gctx.beginPath(); path(sphere); gctx.clip(); gctx.fillStyle = g; gctx.fillRect(0, sy - 60, 1600, 64); gctx.restore();
  const center = [-lam, -phi];
  PINS.forEach((pt, i) => {
    const ti = 29.95 + i * 0.13; if (t < ti) return;
    if (d3.geoDistance(pt, center) > Math.PI / 2 - 0.08) return;
    const [x, y] = proj(pt), u = eoBack(p(t, ti, ti + 0.3), 3);
    for (let k = 0; k < 2; k++) {
      const ph = ((t - ti) / 1.0 + k * 0.5) % 1;
      gctx.strokeStyle = `rgba(255,69,58,${(1 - ph) * 0.9})`; gctx.lineWidth = 4;
      gctx.beginPath(); gctx.arc(x, y, 14 + ph * 56, 0, Math.PI * 2); gctx.stroke();
    }
    gctx.fillStyle = '#FF453A'; gctx.shadowColor = '#FF453A'; gctx.shadowBlur = 30;
    gctx.beginPath(); gctx.arc(x, y, 14 * u, 0, Math.PI * 2); gctx.fill(); gctx.shadowBlur = 0;
    gctx.fillStyle = '#fff'; gctx.beginPath(); gctx.arc(x, y, 5 * u, 0, Math.PI * 2); gctx.fill();
  });
  const lat = (16 + Math.sin(t) * 3).toFixed(2), lon = (((-lam % 360) + 540) % 360 - 180).toFixed(2);
  $('hudCoord').textContent = `${lat}° ${lon}°`;
}

// ---------- captions ----------
const PAGES = [
  [0.08, 2.62, [["There's", 0.08], ['something', 0.32], ['about', 0.64], ['the…', 0.88]]],
  [2.62, 4.45, [["What's", 2.64], ['that', 3.04], ['lovely', 3.28, 'y'], ['quote?', 3.60, 'y']]],
  [4.74, 7.12, [['Strong', 4.80, 'b'], ['men', 5.28, 'b'], ['make', 5.92], ['good', 6.24, 'g'], ['times,', 6.56, 'g']]],
  [7.12, 8.80, [['good', 7.12, 'g'], ['times', 7.36, 'g'], ['make', 7.68], ['weak', 7.92, 'o'], ['men,', 8.32, 'o']]],
  [8.80, 10.56, [['weak', 8.80, 'o'], ['men', 9.20, 'o'], ['make', 9.52], ['hard', 9.76, 'r'], ['times,', 10.00, 'r']]],
  [10.56, 12.64, [['hard', 10.56, 'r'], ['times', 10.88, 'r'], ['make', 11.36], ['strong', 11.60, 'b'], ['men.', 12.08, 'b']]],
  [12.64, 13.90, [['And', 12.64], ['so', 12.88], ['it', 13.12], ['goes.', 13.28, 'y']]],
  [13.90, 15.18, [['And', 13.92], ['I', 14.16], ['think', 14.24], ["there's", 14.40], ['something', 14.64], ['about…', 14.88]]],
  [15.18, 16.22, [["we're", 15.20], ['in', 15.52], ['a', 15.76], ['very', 15.92]]],
  [16.22, 17.84, [['tumultuous', 16.24, 'r'], ['time', 17.28], ['now.', 17.52, 'y']]],
  [17.84, 20.20, [['Do', 17.86], ['you', 18.0], ['think', 18.12], ['this', 18.40], ['is', 18.58], ['hard', 19.60, 'r'], ['times?', 19.84, 'r']]],
  [20.20, 21.18, [['Yeah.', 20.24, 'y']]],
  [21.18, 23.12, [['I', 21.20], ['think', 21.28], ['this', 21.68], ['is', 22.08], ['hard', 22.24, 'r'], ['times.', 22.48, 'r']]],
  [23.12, 24.30, [['I', 23.12], ['think', 23.28], ["it's", 23.44], ['very', 23.84], ['tough', 24.00, 'o']]],
  [24.30, 25.36, [['out', 24.32], ['there', 24.48], ['for', 24.64], ['people.', 24.80, 'w']]],
  [25.36, 26.86, [['And', 25.36], ['I', 26.24], ['think', 26.48], ['that', 26.64]]],
  [26.86, 28.56, [["there's", 26.88], ['a', 27.20], ['lack', 27.28, 'w'], ['of', 27.60], ['leadership.', 27.84, 'y']]],
  [28.56, 29.84, [['and,', 28.56], ['you', 29.52], ['know,', 29.60]]],
  [29.84, 30.40, [['you', 29.84], ['look', 29.92], ['at', 30.08], ['how', 30.24]]],
  [30.40, 31.40, [['countries', 30.40, 't'], ['are', 30.72], ['being', 30.80], ['run…', 31.04, 't']]],
  [31.40, 32.86, [["it's…", 31.40], ['yeah,', 32.08]]],
  [32.86, 33.66, [["it's", 32.88], ['clearly', 33.20, 'w']]],
  [33.66, 35.0, [['these', 33.68], ['are', 33.84], ['hard', 34.40, 'r'], ['times.', 34.56, 'r']]],
];
let curPage = -1, capWords = [];
function renderCaptions(t) {
  let idx = -1; PAGES.forEach((P, i) => { if (t >= P[0] && t < P[1]) idx = i; });
  const cap = $('cap');
  if (idx !== curPage) {
    curPage = idx; cap.innerHTML = ''; capWords = [];
    if (idx >= 0) for (const [w, ws, k] of PAGES[idx][2]) {
      const s = document.createElement('span'); s.className = 'w' + (k ? ' k' : ''); s.textContent = w;
      if (k) { s.style.color = COL[k]; }
      cap.appendChild(s); cap.appendChild(document.createTextNode(' ')); capWords.push({ s, ws, k });
    }
  }
  if (idx < 0) return;
  const last = PAGES[idx][1];
  capWords.forEach(({ s, ws, k }, i) => {
    const u = p(t, ws, ws + 0.16);
    s.style.opacity = u > 0 ? clamp(u * 3) : 0;
    const big = k ? 0.08 * win(t, ws, ws + 0.5, 0.08, 0.3) : 0;
    s.style.transform = `translateY(${(1 - eo3(u)) * 18}px) scale(${(0.78 + 0.22 * eoBack(u, 2.2)) * (1 + big)})`;
    if (k) s.style.textShadow = `0 4px 22px rgba(0,0,0,.65),0 2px 5px rgba(0,0,0,.7),0 0 ${18 + 30 * big / 0.08}px ${COL[k]}${k === 'w' ? '00' : '88'}`;
  });
  const out = p(t, last - 0.05, last);
  cap.style.opacity = 1 - out;
  // the final line lands bigger
  cap.style.fontSize = idx === PAGES.length - 1 ? '86px' : idx === 11 ? '96px' : '74px';
}

// ---------- footage, loom bubble, glitch ----------
const vid = $('vid'), sea = $('sea'), loom = $('loom'), loomImg = $('loomImg');
const LOOM_S = { x: 920 - 110, y: 582 - 110, w: 220, h: 220 };
const glitchEls = (() => {
  const g = $('glitch'), r = document.createElement('img'), c = document.createElement('img');
  r.style.filter = 'url(#onlyR)'; c.style.filter = 'url(#onlyGB)';
  g.appendChild(c); g.appendChild(r);
  const slices = [];
  for (let i = 0; i < 5; i++) { const d = document.createElement('div'); d.className = 'slice'; const im = document.createElement('img'); d.appendChild(im); g.appendChild(d); slices.push({ d, im }); }
  return { g, r, c, slices };
})();
function setSrc(img, src, loads) { if (img._src !== src) { img._src = src; img.src = src; loads.push(img.decode().catch(() => {})); } }
function place(img, cv, dx = 0, dy = 0) { img.style.transform = `translate(${cv.x + dx}px,${cv.y + dy}px) scale(${cv.s})`; }

function renderFootage(t, f, loads) {
  const sh = shotAt(f), src = `frames/src/${String(f).padStart(4, '0')}.jpg`;
  const k = kMain(t), [jx, jy] = shakeAt(t, f);
  const kk = k * (jx || jy ? 1.04 : 1);
  const cv = cover(CARD.w, CARD.h, kk, sh.fx, sh.fy, 0.5, sh.ay);
  setSrc(vid, src, loads); place(vid, cv, jx, jy);
  const zt = p(t, 4.40, 4.66);
  $('vidwrap').style.filter = zt > 0 && t < 4.7 ? `blur(${zt * 14}px)` : 'none';
  // stormy-sea cutaway on "tumultuous"
  const seaOn = t >= 16.30 && t < 17.45;
  $('seawrap').style.opacity = seaOn ? 1 : 0;
  let seaCv = null;
  if (seaOn) {
    const fr = 420 + Math.round((t - 16.30) * 30);
    setSrc(sea, `frames/broll/${String(fr).padStart(4, '0')}.jpg`, loads);
    const s = 1050 / 1080 * (1.08 - 0.05 * p(t, 16.3, 17.45));
    seaCv = { s, x: (1020 - 1080 * s) / 2, y: (1050 - 1080 * s) / 2 };
    sea.style.transform = `translate(${seaCv.x + jx}px,${seaCv.y + jy}px) scale(${s})`;
    $('seaTint').style.opacity = 0.6 + 0.4 * Math.sin(t * 12);
  }
  // RGB-split glitch around the cutaway
  const gOn = (t >= 16.22 && t < 16.40) || (t >= 17.38 && t < 17.53);
  const G = glitchEls; G.g.style.display = gOn ? 'block' : 'none';
  if (gOn) {
    const useSea = seaOn, gsrc = useSea ? sea._src : src, gcv = useSea ? seaCv : cv;
    const amp = 18 + 22 * hash(f);
    for (const im of [G.r, G.c]) { setSrc(im, gsrc, loads); }
    G.r.style.width = G.c.style.width = useSea ? '1080px' : '1224px';
    place(G.r, gcv, amp + jx, jy); place(G.c, gcv, -amp + jx, jy);
    G.slices.forEach((S, i) => {
      const top = Math.floor(hash(f * 7 + i) * 980), hgt = 20 + Math.floor(hash(f * 11 + i) * 90);
      S.d.style.top = `${top}px`; S.d.style.height = `${hgt}px`;
      setSrc(S.im, gsrc, loads);
      place(S.im, gcv, (hash(f * 13 + i) - 0.5) * 140, -top);
      S.d.style.display = hash(f * 3 + i) > 0.35 ? 'block' : 'none';
    });
  }
  // red alert ring
  const al = Math.max(win(t, 16.28, 17.5, 0.05, 0.3) * (0.6 + 0.4 * Math.sin(t * 16)), win(t, 33.68, 34.95, 0.06, 0.2) * 0.7);
  $('alert').style.opacity = al;
  $('alert').style.boxShadow = `inset 0 0 0 5px ${COL.r}, inset 0 0 90px rgba(255,69,58,.55)`;
  // the card itself: intro reveal
  const ci = eo3(p(t, 0, 0.45));
  const card = $('card');
  card.style.opacity = clamp(p(t, 0, 0.2));
  card.style.transform = `translateY(${(1 - ci) * 60}px) scale(${0.92 + 0.08 * ci})`;
  card.style.filter = t < 0.35 ? `blur(${(1 - p(t, 0, 0.35)) * 12}px)` : 'none';
  // loom bubble during the canvas section, expanding back into the card at the end
  const lo = t >= 4.48 && t < 13.86;
  loom.style.display = lo ? 'block' : 'none'; $('loomRing').style.display = lo && t < 13.55 ? 'block' : 'none';
  if (lo) {
    const ap = eoBack(p(t, 4.50, 4.82), 2.0), ex = eio3(p(t, 13.55, 13.85));
    const box = { x: lerp(LOOM_S.x, CARD.x, ex), y: lerp(LOOM_S.y, CARD.y, ex), w: lerp(LOOM_S.w, CARD.w, ex), h: lerp(LOOM_S.h, CARD.h, ex) };
    const rad = lerp(110, 46, ex);
    const sc = ex > 0 ? 1 : ap;
    loom.style.left = `${box.x}px`; loom.style.top = `${box.y}px`; loom.style.width = `${box.w}px`; loom.style.height = `${box.h}px`;
    loom.style.borderRadius = `${rad}px`; loom.style.opacity = clamp(ap * 2);
    loom.style.transform = `scale(${sc})`;
    const lk = lerp(2.1, kMain(13.86), ex), lay = lerp(0.42, sh.ay, ex);
    const lcv = cover(box.w, box.h, lk, sh.fx, sh.fy, 0.5, lay);
    setSrc(loomImg, src, loads); place(loomImg, lcv);
    const ring = $('loomRing');
    ring.style.left = `${box.x - 7}px`; ring.style.top = `${box.y - 7}px`; ring.style.width = `${box.w + 14}px`; ring.style.height = `${box.h + 14}px`;
    ring.style.opacity = clamp(ap * 2) * (1 - p(t, 13.5, 13.56));
    ring.style.transform = `scale(${sc})`;
    const acc = accentAt(t);
    ring.style.border = `5px solid ${rgba(acc, 1)}`; ring.style.boxShadow = `0 0 30px ${rgba(acc, 0.7)}`;
  }
  // host label
  const hv = win(t, 19.02, 20.15, 0.25, 0.08), ht = $('hosttag');
  ht.style.opacity = hv; ht.style.transform = `translateX(${(1 - eo3(p(t, 19.02, 19.3))) * -40}px)`;
}

function renderFlash(t) {
  const fl = Math.max(0.35 * win(t, 4.42, 4.62, 0.04, 0.15), 0.55 * win(t, 33.66, 33.86, 0.02, 0.18), 0.25 * win(t, 13.8, 13.95, 0.03, 0.12), 0.18 * win(t, 31.4, 31.55, 0.03, 0.12));
  $('flash').style.opacity = fl;
}

// ---------- main ----------
window.renderFrame = async (f) => {
  const t = f / FPS, loads = [];
  drawBG(t, accentAt(t));
  renderHeader(t);
  renderFootage(t, f, loads);
  renderScene(t, loads);
  renderPalette(t); renderCursor(t);
  renderStatus(t);
  renderStepper(STP1, t, 21.85, 23.62, 21.95, 22.24, 22.28, 0);
  renderStepper(STP2, t, 33.66, 35.5, 33.62, 33.64, 33.80, 34.25);
  renderDiff(t); renderSearch(t); renderGlobe(t);
  renderCaptions(t); renderFlash(t);
  $('grain').style.backgroundPosition = `${Math.floor(hash(f) * 540)}px ${Math.floor(hash(f + 99) * 960)}px`;
  await Promise.all(loads);
  return true;
};
window.READY = (async () => {
  const topo = await (await fetch('assets/vendor/countries-110m.json')).json();
  world = topojson.feature(topo, topo.objects.countries);
  graticule = d3.geoGraticule10();
  await document.fonts.ready;
  await Promise.all([...document.images].filter((i) => i.src).map((i) => i.decode().catch(() => {})));
  return true;
})();
