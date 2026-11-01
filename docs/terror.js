'use strict';
/* =========================================================
   MODO TERROR
   Botón 🎃 (o tecla T) para prenderlo y apagarlo; se recuerda.
   Rayos, apagones, sangre escurriendo, telarañas, araña, murciélagos,
   fantasma, ojos en la oscuridad, calabazas, niebla y mensajes en la laptop.
   ========================================================= */
(() => {
  const r = (a, b) => a + Math.random() * (b - a);
  const COLORES_NORMAL = COLORES.slice();
  const COLORES_TERROR = ['#ff2b2b', '#b3001b', '#ff5a5a', '#7a0010', '#9dff4a', '#ff8a3d', '#5c0a14'];
  const FIRMA_TERROR = 'no estás solo...';
  const MENSAJES = ['DETRÁS DE TI', 'NO VOLTEES', 'TE ESTOY VIENDO', 'SAL DE AQUÍ', 'ERROR 666', 'YA ES TARDE'];
  const SVGNS = 'http://www.w3.org/2000/svg';

  /* ---------- Capa ---------- */
  const capa = document.createElement('div');
  capa.id = 'terror';
  capa.setAttribute('aria-hidden', 'true');
  capa.innerHTML = `
    <div class="t-niebla"></div><div class="t-niebla n2"></div>
    <svg class="t-sangre" viewBox="0 0 1000 260" preserveAspectRatio="none" id="t-sangre"></svg>
    <svg class="t-tela izq" viewBox="0 0 200 200">${telarana()}</svg>
    <svg class="t-tela der" viewBox="0 0 200 200">${telarana()}</svg>
    <div class="t-arana"><i class="hilo"></i>
      <svg width="70" height="60" viewBox="0 0 70 60">
        <g class="patas" stroke="#111" stroke-width="3" fill="none" stroke-linecap="round">
          <path d="M28 30 Q14 18 4 24"/><path d="M28 34 Q12 30 2 38"/><path d="M28 38 Q14 42 6 54"/><path d="M30 40 Q22 50 18 58"/>
          <path d="M42 30 Q56 18 66 24"/><path d="M42 34 Q58 30 68 38"/><path d="M42 38 Q56 42 64 54"/><path d="M40 40 Q48 50 52 58"/></g>
        <ellipse cx="35" cy="38" rx="12" ry="14" fill="#151012"/><circle cx="35" cy="22" r="8" fill="#1d1416"/>
        <circle cx="31.5" cy="21" r="2.4" fill="#ff2020"/><circle cx="38.5" cy="21" r="2.4" fill="#ff2020"/>
        <path d="M30 40 Q35 46 40 40" stroke="#b3001b" stroke-width="2" fill="none"/>
      </svg></div>
    <div class="t-vineta"></div>
    <svg class="t-calabaza izq" viewBox="0 0 200 170">${calabaza()}</svg>
    <svg class="t-calabaza der" viewBox="0 0 200 170">${calabaza()}</svg>
    <div class="t-apagon" id="t-apagon"></div>
    <div class="t-rayo" id="t-rayo"></div>`;
  document.body.appendChild(capa);

  function telarana() {
    let d = '';
    const rayos = [0, 15, 30, 45, 60, 75, 90];
    for (const a of rayos) { const t = a * Math.PI / 180; d += `<path d="M0 0 L${(Math.cos(t) * 210).toFixed(1)} ${(Math.sin(t) * 210).toFixed(1)}"/>`; }
    for (let k = 1; k <= 6; k++) {
      const rad = k * 30;
      let p = '';
      rayos.forEach((a, i) => {
        const t = a * Math.PI / 180, x = Math.cos(t) * rad, y = Math.sin(t) * rad;
        if (!i) p += `M${x.toFixed(1)} ${y.toFixed(1)}`;
        else { const tm = (a - 7.5) * Math.PI / 180, cx = Math.cos(tm) * rad * .82, cy = Math.sin(tm) * rad * .82; p += ` Q${cx.toFixed(1)} ${cy.toFixed(1)} ${x.toFixed(1)} ${y.toFixed(1)}`; }
      });
      d += `<path d="${p}"/>`;
    }
    return d;
  }
  function calabaza() {
    return `<defs><radialGradient id="cz" cx=".5" cy=".55" r=".6"><stop offset="0" stop-color="#ff9a2e"/><stop offset="1" stop-color="#b84a00"/></radialGradient>
      <radialGradient id="cl" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#fff3a0"/><stop offset=".5" stop-color="#ffb300"/><stop offset="1" stop-color="#ff5a00"/></radialGradient></defs>
      <path d="M96 30 Q92 12 104 4 Q108 14 104 30 Z" fill="#3d5a1a"/>
      <ellipse cx="60" cy="100" rx="52" ry="62" fill="url(#cz)"/><ellipse cx="140" cy="100" rx="52" ry="62" fill="url(#cz)"/>
      <ellipse cx="100" cy="100" rx="56" ry="66" fill="url(#cz)"/>
      <path d="M100 36 Q86 100 100 164 M100 36 Q114 100 100 164" stroke="#a84300" stroke-width="2" fill="none" opacity=".6"/>
      <g class="luz" fill="url(#cl)">
        <path d="M58 76 L84 70 L74 96 Z"/><path d="M142 76 L116 70 L126 96 Z"/><path d="M96 98 L104 98 L100 112 Z"/>
        <path d="M50 120 Q100 150 150 120 L140 130 L128 122 L116 136 L100 126 L84 136 L72 122 L60 130 Z"/></g>`;
  }

  /* ---------- Sangre escurriendo ---------- */
  function hacerSangre() {
    const s = document.getElementById('t-sangre');
    let borde = 'M0 0 H1000 V14 ';
    const gotas = [];
    for (let x = 1000; x > 0; x -= r(18, 46)) {
      borde += `Q${(x - 8).toFixed(0)} ${r(16, 30).toFixed(0)} ${(x - 18).toFixed(0)} ${r(10, 20).toFixed(0)} `;
      if (Math.random() < .35) gotas.push(x - r(4, 14));
    }
    borde += 'V0 Z';
    let html = `<path d="${borde}" fill="#7a0010"/>`;
    for (const gx of gotas) {
      const largo = r(40, 240), ancho = r(5, 12);
      html += `<path class="gota" style="--d:${r(6, 14).toFixed(1)}s;--r:${(-r(0, 14)).toFixed(1)}s" d="M${gx - ancho / 2} 10 L${gx - ancho / 2} ${largo} Q${gx} ${largo + ancho * 1.4} ${gx + ancho / 2} ${largo} L${gx + ancho / 2} 10 Z" fill="#8a0012"/>`;
    }
    s.innerHTML = html;
  }
  hacerSangre();

  /* ---------- Murciélagos ---------- */
  function murcielago() {
    const el = document.createElement('div');
    el.className = 't-murcielago';
    const w = r(50, 110);
    el.style.width = w + 'px';
    el.innerHTML = `<svg viewBox="0 0 120 60" width="100%"><g fill="#0b0508">
      <path class="ala i" d="M58 26 Q40 6 4 14 Q18 20 16 30 Q28 24 32 34 Q42 26 46 38 Q52 30 58 32 Z"/>
      <path class="ala d" d="M62 26 Q80 6 116 14 Q102 20 104 30 Q92 24 88 34 Q78 26 74 38 Q68 30 62 32 Z"/>
      <ellipse cx="60" cy="32" rx="9" ry="12"/><path d="M53 22 L55 12 L58 21 M67 22 L65 12 L62 21"/></g>
      <circle cx="56.5" cy="27" r="1.6" fill="#ff2020"/><circle cx="63.5" cy="27" r="1.6" fill="#ff2020"/></svg>`;
    capa.appendChild(el);
    const izq = Math.random() < .5, W = innerWidth, H = innerHeight;
    const x0 = izq ? -w : W + w, x1 = izq ? W + w : -w;
    const y0 = r(H * .05, H * .55), dur = r(4, 8) * 1000, amp = r(20, 70), t0 = performance.now();
    (function vuela(t) {
      const p = (t - t0) / dur;
      if (p >= 1 || !document.body.classList.contains('terror')) return el.remove();
      const x = x0 + (x1 - x0) * p, y = y0 + Math.sin(p * 12) * amp - p * r(0, 2);
      el.style.transform = `translate(${x}px, ${y}px) scaleX(${izq ? 1 : -1})`;
      requestAnimationFrame(vuela);
    })(t0);
  }

  /* ---------- Fantasma ---------- */
  function fantasma() {
    const el = document.createElement('div');
    el.className = 't-fantasma';
    el.innerHTML = `<svg viewBox="0 0 150 180" width="100%">
      <path class="falda" d="M20 80 Q20 10 75 10 Q130 10 130 80 L130 160 Q118 146 106 162 Q94 176 84 160 Q75 146 66 160 Q56 176 44 162 Q32 146 20 160 Z" fill="rgba(240,246,255,.9)"/>
      <ellipse cx="56" cy="70" rx="10" ry="15" fill="#0b0508"/><ellipse cx="94" cy="70" rx="10" ry="15" fill="#0b0508"/>
      <ellipse cx="75" cy="110" rx="12" ry="16" fill="#0b0508"/></svg>`;
    capa.appendChild(el);
    const W = innerWidth, H = innerHeight;
    const x0 = r(W * .1, W * .8), y0 = r(H * .15, H * .55), dx = r(-200, 200), dur = r(6, 10) * 1000, t0 = performance.now();
    (function flota(t) {
      const p = (t - t0) / dur;
      if (p >= 1 || !document.body.classList.contains('terror')) return el.remove();
      const op = p < .2 ? p / .2 : p > .8 ? (1 - p) / .2 : 1;
      el.style.opacity = (op * .75).toFixed(2);
      el.style.transform = `translate(${x0 + dx * p}px, ${y0 + Math.sin(p * 9) * 24}px) scale(${.8 + p * .3})`;
      requestAnimationFrame(flota);
    })(t0);
  }

  /* ---------- Ojos en la oscuridad ---------- */
  function ojos() {
    const el = document.createElement('div');
    el.className = 't-ojos';
    el.innerHTML = '<i></i><i></i>';
    const W = innerWidth, H = innerHeight;
    // cerca de las orillas, donde está más oscuro
    const orilla = Math.random();
    const x = orilla < .5 ? (Math.random() < .5 ? r(10, W * .12) : r(W * .86, W - 70)) : r(W * .1, W * .9);
    const y = orilla < .5 ? r(H * .2, H * .85) : (Math.random() < .5 ? r(H * .02, H * .1) : r(H * .88, H - 30));
    el.style.left = x + 'px'; el.style.top = y + 'px';
    el.style.transform = `scale(${r(.6, 1.3).toFixed(2)})`;
    capa.appendChild(el);
    setTimeout(() => el.remove(), 5200);
  }

  /* ---------- Rayo, apagones y mensajes en la laptop ---------- */
  function rayo() {
    const el = document.getElementById('t-rayo');
    el.classList.remove('on'); void el.offsetWidth; el.classList.add('on');
    document.body.classList.add('sacudir');
    setTimeout(() => document.body.classList.remove('sacudir'), 500);
  }
  function apagon() {
    const el = document.getElementById('t-apagon');
    const pasos = [.85, .1, .95, .3, .9, 0];
    pasos.forEach((o, i) => setTimeout(() => { el.style.opacity = o; }, i * r(60, 140)));
  }
  const glitch = document.createElement('div');
  glitch.className = 't-glitch';
  glitch.innerHTML = '<b></b>';
  document.getElementById('screen').appendChild(glitch);
  function mensaje() {
    glitch.querySelector('b').textContent = MENSAJES[Math.floor(Math.random() * MENSAJES.length)];
    glitch.classList.add('on');
    setTimeout(() => glitch.classList.remove('on'), r(500, 1100));
  }
  function gotita() {
    const g = document.createElement('i');
    g.className = 't-gotita';
    g.style.left = r(2, 98) + 'vw'; g.style.top = r(4, 14) + 'vh';
    capa.appendChild(g);
    setTimeout(() => g.remove(), 1500);
  }

  /* ---------- Teléfono: latido del corazón (electrocardiograma) ---------- */
  let ecgFase = 0;
  function ecg() {
    ecgFase = (ecgFase + 6) % 60;
    const pts = [];
    for (let x = 0; x <= 120; x += 2) {
      const u = (x + ecgFase) % 60;
      let y = 34;
      if (u > 18 && u < 22) y = 30;              // onda P
      else if (u >= 26 && u < 28) y = 40;        // Q
      else if (u >= 28 && u < 30) y = 4;         // R (pico)
      else if (u >= 30 && u < 32) y = 50;        // S
      else if (u > 40 && u < 46) y = 27;         // onda T
      pts.push((x ? 'L' : 'M') + x + ' ' + y);
    }
    return pts.join(' ');
  }
  // app.js usa window.lineaTelefono si existe; solo existe en modo terror
  Object.defineProperty(window, 'lineaTelefono', { get: () => (document.body.classList.contains('terror') ? ecg : undefined), configurable: true });

  /* ---------- Tableta ---------- */
  const titulo = document.querySelector('.tablet-title');
  const tituloNormal = titulo ? titulo.innerHTML : '';

  /* ---------- Prender / apagar ---------- */
  const timers = [];
  function cada(min, max, fn) {
    let id;
    const tick = () => { fn(); id = setTimeout(tick, r(min, max) * 1000); timers[i] = id; };
    const i = timers.length;
    id = setTimeout(tick, r(min, max) * 1000 * .5);
    timers.push(id);
  }
  function aplicar(on) {
    document.body.classList.toggle('terror', on);
    try { localStorage.setItem('neon_terror', on ? '1' : '0'); } catch (e) {}
    COLORES.splice(0, COLORES.length, ...(on ? COLORES_TERROR : COLORES_NORMAL));
    FIRMA = on ? FIRMA_TERROR : FIRMA_NORMAL;
    letras = 0;
    document.querySelector('.autor').classList.remove('listo');
    for (const l of document.querySelectorAll('#screen .sl')) l.remove();
    if (titulo) titulo.innerHTML = on ? 'R.I.P<br>......' : tituloNormal;
    btn.textContent = on ? '💡 Normal' : '🎃 Terror';
    btn.title = on ? 'Volver al modo normal (T)' : 'Modo terror (T)';
    for (const t of timers) clearTimeout(t);
    timers.length = 0;
    if (on) {
      cada(9, 22, rayo);
      cada(14, 30, apagon);
      cada(5, 11, murcielago);
      cada(12, 24, fantasma);
      cada(3, 7, ojos);
      cada(8, 16, mensaje);
      cada(2, 5, gotita);
      setTimeout(murcielago, 800); setTimeout(ojos, 1500); setTimeout(rayo, 2500);
    }
  }

  const btn = document.createElement('button');
  btn.type = 'button';
  btn.className = 'btn-tema';
  document.body.appendChild(btn);
  const upd = document.getElementById('btn-update');
  if (!upd || upd.hidden) btn.classList.add('solo-tema');
  btn.addEventListener('click', () => aplicar(!document.body.classList.contains('terror')));
  addEventListener('keydown', (e) => { if ((e.key === 't' || e.key === 'T') && !e.ctrlKey && !e.metaKey && !e.altKey) aplicar(!document.body.classList.contains('terror')); });
  addEventListener('resize', () => { if (document.body.classList.contains('terror')) hacerSangre(); });

  let guardado = null;
  try { guardado = localStorage.getItem('neon_terror'); } catch (e) {}
  aplicar(guardado === null ? true : guardado === '1');   // la primera vez arranca en terror
  const hint = document.getElementById('hint');
  if (hint) hint.textContent += ' · T: modo terror';
})();
