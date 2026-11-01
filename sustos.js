'use strict';
/* =========================================================
   MIS SUSTOS
   Cargas imágenes de tu computadora (o celular) y salen en el modo terror:
   de golpe en grande, asomándose por la orilla, en la pantalla de la laptop
   o de fondo. Se guardan solo en este equipo (IndexedDB), no se suben a ningún lado.
   ========================================================= */
(() => {
  const CFG_KEY = 'neon_sustos_cfg';
  const BASE = { susto: true, asoma: true, laptop: true, fondo: false, cada: 25 };
  let cfg = { ...BASE };
  try { cfg = { ...BASE, ...JSON.parse(localStorage.getItem(CFG_KEY) || '{}') }; } catch (e) {}
  const guardarCfg = () => { try { localStorage.setItem(CFG_KEY, JSON.stringify(cfg)); } catch (e) {} };
  let imagenes = [];            // [{ id, url }]
  let siguiente = null;

  /* ---------- Guardado local (IndexedDB) ---------- */
  let db = null;
  function abrirDb() {
    return new Promise((res) => {
      try {
        const rq = indexedDB.open('neon-desk', 1);
        rq.onupgradeneeded = () => rq.result.createObjectStore('sustos', { keyPath: 'id' });
        rq.onsuccess = () => { db = rq.result; res(db); };
        rq.onerror = () => res(null);
      } catch (e) { res(null); }
    });
  }
  function tx(modo) { return db.transaction('sustos', modo).objectStore('sustos'); }
  async function cargar() {
    await abrirDb();
    if (!db) return;
    await new Promise((res) => {
      const rq = tx('readonly').getAll();
      rq.onsuccess = () => { for (const it of rq.result || []) imagenes.push({ id: it.id, url: URL.createObjectURL(it.blob) }); res(); };
      rq.onerror = () => res();
    });
    pintarLista();
    ponerFondo();
  }
  function agregar(files) {
    for (const f of files) {
      if (!f.type.startsWith('image/')) continue;
      const id = Date.now() + '-' + Math.random().toString(36).slice(2, 7);
      imagenes.push({ id, url: URL.createObjectURL(f) });
      if (db) try { tx('readwrite').put({ id, blob: f }); } catch (e) {}
    }
    pintarLista();
    ponerFondo();
  }
  function quitar(id) {
    const i = imagenes.findIndex((x) => x.id === id);
    if (i < 0) return;
    URL.revokeObjectURL(imagenes[i].url);
    imagenes.splice(i, 1);
    if (db) try { tx('readwrite').delete(id); } catch (e) {}
    pintarLista();
    ponerFondo();
  }
  const alAzar = () => imagenes[Math.floor(Math.random() * imagenes.length)];

  /* ---------- Formas de aparecer ---------- */
  function susto(img) {
    const el = document.createElement('div');
    el.className = 'ms-susto';
    el.innerHTML = `<img src="${img.url}" alt="">`;
    document.body.appendChild(el);
    document.body.classList.add('sacudir');
    setTimeout(() => document.body.classList.remove('sacudir'), 500);
    setTimeout(() => el.remove(), 1700);
  }
  function asoma(img) {
    const el = document.createElement('div');
    el.className = 'ms-asoma ' + ['izq', 'der', 'abajo'][Math.floor(Math.random() * 3)];
    el.innerHTML = `<img src="${img.url}" alt="">`;
    document.body.appendChild(el);
    requestAnimationFrame(() => requestAnimationFrame(() => el.classList.add('dentro')));
    setTimeout(() => el.classList.remove('dentro'), 3600);
    setTimeout(() => el.remove(), 5000);
  }
  let enLaptop = null;
  function laptop(img) {
    if (!enLaptop) {
      enLaptop = document.createElement('div');
      enLaptop.className = 'ms-laptop';
      document.getElementById('screen').appendChild(enLaptop);
    }
    enLaptop.innerHTML = `<img src="${img.url}" alt="">`;
    enLaptop.classList.add('on');
    setTimeout(() => enLaptop.classList.remove('on'), 2200);
  }
  let fondoEl = null;
  function ponerFondo() {
    if (!fondoEl) { fondoEl = document.createElement('div'); fondoEl.className = 'ms-fondo-img'; document.body.prepend(fondoEl); }
    const usar = cfg.fondo && imagenes.length;
    fondoEl.classList.toggle('on', !!usar);
    if (usar) fondoEl.style.backgroundImage = `url("${alAzar().url}")`;
  }
  function uno() {
    if (!document.body.classList.contains('terror') || !imagenes.length) return;
    const formas = [cfg.susto && susto, cfg.asoma && asoma, cfg.laptop && laptop].filter(Boolean);
    if (!formas.length) return;
    formas[Math.floor(Math.random() * formas.length)](alAzar());
  }
  function programar() {
    clearTimeout(siguiente);
    const ms = cfg.cada * 1000 * (0.6 + Math.random() * 0.8);
    siguiente = setTimeout(() => { uno(); programar(); }, ms);
  }

  /* ---------- Botón y panel ---------- */
  const btn = document.createElement('button');
  btn.type = 'button';
  btn.className = 'btn-sustos';
  btn.textContent = '🖼 Mis sustos';
  btn.title = 'Agregar tus propias imágenes de susto';
  document.body.appendChild(btn);
  const upd = document.getElementById('btn-update');
  if (!upd || upd.hidden) btn.classList.add('sin-upd');

  const fondo = document.createElement('div');
  fondo.className = 'ms-fondo';
  fondo.innerHTML = `
    <div class="ms-panel" role="dialog" aria-modal="true" aria-labelledby="ms-t">
      <h2 id="ms-t">🖼 Mis sustos</h2>
      <p>Agrega imágenes de tu computadora y saldrán en el modo terror. Se quedan guardadas solo en este equipo.</p>
      <div class="ms-lista" id="ms-lista"></div>
      <div class="ms-grupo"><span>Cómo aparecen</span>
        <div class="ms-chips">
          <label><input type="checkbox" data-k="susto"> De golpe en grande</label>
          <label><input type="checkbox" data-k="asoma"> Asomándose por la orilla</label>
          <label><input type="checkbox" data-k="laptop"> En la pantalla de la laptop</label>
          <label><input type="checkbox" data-k="fondo"> De fondo (suave)</label>
        </div></div>
      <div class="ms-grupo"><span>Cada cuánto</span>
        <div class="ms-rango"><input type="range" id="ms-cada" min="5" max="120" step="5"><b id="ms-cada-v"></b></div></div>
      <div class="ms-pie"><button type="button" id="ms-probar">👻 Probar ahora</button><button type="button" class="ms-ok" id="ms-cerrar">Listo</button></div>
    </div>`;
  document.body.appendChild(fondo);
  const $s = (id) => document.getElementById(id);

  function pintarLista() {
    const l = $s('ms-lista');
    l.innerHTML = '';
    for (const im of imagenes) {
      const d = document.createElement('div');
      d.className = 'ms-item';
      d.innerHTML = `<img src="${im.url}" alt=""><button type="button" title="Quitar">×</button>`;
      d.querySelector('button').onclick = () => quitar(im.id);
      l.appendChild(d);
    }
    const a = document.createElement('label');
    a.className = 'ms-agregar';
    a.innerHTML = '<span><b>+</b>Agregar imágenes</span><input type="file" accept="image/*" multiple>';
    a.querySelector('input').onchange = (e) => { agregar(e.target.files); e.target.value = ''; };
    l.appendChild(a);
    if (!imagenes.length) { const v = document.createElement('span'); v.className = 'ms-vacio'; v.textContent = 'Todavía no hay imágenes.'; l.appendChild(v); }
  }
  function pintarCfg() {
    fondo.querySelectorAll('[data-k]').forEach((c) => { c.checked = !!cfg[c.dataset.k]; });
    $s('ms-cada').value = cfg.cada;
    $s('ms-cada-v').textContent = cfg.cada + ' s';
  }
  fondo.querySelectorAll('[data-k]').forEach((c) => c.addEventListener('change', () => { cfg[c.dataset.k] = c.checked; guardarCfg(); ponerFondo(); }));
  $s('ms-cada').addEventListener('input', (e) => { cfg.cada = +e.target.value; $s('ms-cada-v').textContent = cfg.cada + ' s'; guardarCfg(); programar(); });
  const abrir = () => { pintarCfg(); fondo.classList.add('on'); };
  const cerrar = () => fondo.classList.remove('on');
  btn.addEventListener('click', abrir);
  $s('ms-cerrar').addEventListener('click', cerrar);
  fondo.addEventListener('click', (e) => { if (e.target === fondo) cerrar(); });
  $s('ms-probar').addEventListener('click', () => { if (!imagenes.length) return; cerrar(); setTimeout(uno, 300); });
  addEventListener('keydown', (e) => { if (e.key === 'Escape') cerrar(); });
  // que la T del modo terror no se active mientras el panel está abierto
  fondo.addEventListener('keydown', (e) => e.stopPropagation());

  pintarLista();
  cargar();
  window.sustosPropios = { iniciar: () => programar(), uno };
})();
