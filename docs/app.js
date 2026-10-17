'use strict';
const $ = (id) => document.getElementById(id);
const azar = (a, b) => a + Math.random() * (b - a);
const elegir = (l) => l[Math.floor(Math.random() * l.length)];
const COLORES = ['#ff6fb3', '#ff9fd2', '#ffd36b', '#7fe7ff', '#b08cff', '#ff5a8a', '#9ef0c8'];

/* ---------- Escalar el escenario para que siempre llene la pantalla ----------
   En horizontal se escala igual que en escritorio.
   En vertical (celular parado) el escritorio se gira 90° para aprovechar toda la pantalla. */
const stage = $('stage');
function ajustar() {
  const w = innerWidth, h = innerHeight;
  const vertical = h > w * 1.15;
  document.body.classList.toggle('vertical', vertical);
  if (vertical) {
    const s = Math.min(h / 1600, w / 1000);
    stage.style.transform = `rotate(90deg) scale(${s}) translate(-800px, -500px)`;
  } else {
    const s = Math.min(w / 1600, h / 1000);
    stage.style.transform = `scale(${s}) translate(-800px, -500px)`;
  }
}
addEventListener('resize', ajustar);
addEventListener('orientationchange', () => setTimeout(ajustar, 200));
ajustar();

/* ---------- Bokeh ---------- */
for (let i = 0; i < 18; i++) {
  const b = document.createElement('div');
  const t = azar(40, 220);
  b.className = 'bk';
  Object.assign(b.style, { width: t + 'px', height: t + 'px', left: azar(-5, 100) + '%', top: azar(-5, 100) + '%', opacity: azar(.3, 1) });
  b.style.setProperty('--d', azar(8, 18) + 's');
  b.style.setProperty('--x', azar(-80, 80) + 'px');
  b.style.setProperty('--y', azar(-80, 80) + 'px');
  $('bokeh').appendChild(b);
}

/* ---------- Columnas de código que suben ---------- */
function lineaCodigo(ancho) {
  const l = document.createElement('div');
  l.className = 'cl';
  let resto = ancho * azar(.35, 1);
  l.style.paddingLeft = (Math.random() < .4 ? azar(8, 30) : 0) + 'px';
  while (resto > 12) {
    const w = Math.min(resto, azar(10, 60));
    const b = document.createElement('b');
    b.style.width = w + 'px';
    b.style.background = elegir(COLORES);
    b.style.opacity = azar(.65, 1);
    l.appendChild(b);
    resto -= w + 6;
  }
  return l;
}
for (const col of document.querySelectorAll('.code-col')) {
  const ancho = col.clientWidth;
  const scroll = document.createElement('div');
  scroll.className = 'code-scroll';
  const n = Math.ceil(col.clientHeight / 16) + 6;
  const lineas = Array.from({ length: n }, () => lineaCodigo(ancho));
  for (const l of lineas) scroll.appendChild(l);
  for (const l of lineas) scroll.appendChild(l.cloneNode(true));   // copia para que el ciclo no brinque
  scroll.style.setProperty('--d', azar(14, 26) + 's');
  col.appendChild(scroll);
}

/* ---------- Teclado: teclas que se encienden ---------- */
const kb = $('keyboard');
const filas = [14, 13, 13, 12, 9];
filas.forEach((n, f) => {
  for (let i = 0; i < n; i++) {
    const k = document.createElement('div');
    k.className = 'key';
    if (f === 1 && i === 0) k.classList.add('wide');
    if (f === 2 && i === 12) k.classList.add('wide');
    if (f === 3 && (i === 0 || i === 11)) k.classList.add('wide');
    if (f === 4 && i === 4) k.classList.add('space');
    kb.appendChild(k);
  }
});
const teclas = [...kb.children];
function pulsar() {
  const k = elegir(teclas);
  k.classList.add('on');
  setTimeout(() => k.classList.remove('on'), 140);
}

/* ---------- Pantalla de la laptop: código que se escribe ---------- */
const screen = $('screen');
const cursor = $('typing');
let lineaActual = null, restante = 0, sangria = 0;

/* Firma: se escribe letra por letra y luego arranca el código */
const FIRMA = 'RealityEngine siliconmovil V3';
let letras = 0;
function escribirFirma() {
  $('autor-txt').textContent = FIRMA.slice(0, ++letras);
  pulsar();
  if (letras >= FIRMA.length) document.querySelector('.autor').classList.add('listo');
}

function escribir() {
  if (letras < FIRMA.length) return escribirFirma();
  if (!lineaActual || restante <= 0) {
    if (screen.querySelectorAll('.sl').length >= 19) {
      for (const l of screen.querySelectorAll('.sl')) l.remove();
      sangria = 0;
    }
    sangria = Math.max(0, Math.min(3, sangria + elegir([-1, 0, 0, 1])));
    lineaActual = document.createElement('div');
    lineaActual.className = 'sl';
    lineaActual.style.paddingLeft = sangria * 22 + 'px';
    screen.insertBefore(lineaActual, cursor);
    restante = azar(2, 6) | 0;
  }
  const b = document.createElement('b');
  b.style.width = azar(14, 70) + 'px';
  b.style.background = elegir(COLORES);
  lineaActual.appendChild(b);
  restante--;
  pulsar();
}

/* ---------- Cables punteados con pulsos ---------- */
const RUTAS = [
  ['M 300 125 H 322', 'cyan'],
  ['M 386 125 H 452', 'cyan'],
  ['M 582 118 H 820', ''],
  ['M 960 112 H 1132 V 66', 'cyan'],
  ['M 1178 66 H 1300 V 192', ''],
  ['M 1384 192 H 1520 V 500 H 1500', ''],
  ['M 1132 342 H 1166', 'cyan'],
  ['M 1212 342 H 1360 V 540', ''],
  ['M 980 130 V 600 H 1190', ''],
  ['M 440 470 H 340 V 610', 'cyan'],
  ['M 340 690 V 760 H 224', ''],
  ['M 1150 700 H 1372', 'cyan'],
  ['M 450 640 H 260 V 880', ''],
  ['M 1265 710 V 900 H 860', 'cyan']
];
const svgNS = 'http://www.w3.org/2000/svg';
const pulsos = [];
for (const [d, cls] of RUTAS) {
  const p = document.createElementNS(svgNS, 'path');
  p.setAttribute('d', d);
  p.setAttribute('class', 'wire ' + cls);
  $('wire-paths').appendChild(p);
  const largo = p.getTotalLength();
  const n = largo > 400 ? 2 : 1;
  for (let i = 0; i < n; i++) {
    const c = document.createElementNS(svgNS, 'circle');
    c.setAttribute('r', '4.5');
    c.setAttribute('fill', cls ? '#9ff3ff' : '#b4ffd2');
    $('wire-pulses').appendChild(c);
    pulsos.push({ p, c, largo, pos: Math.random(), vel: azar(90, 170) / largo });
  }
}

/* ---------- Gráficas ---------- */
const datosTel = Array.from({ length: 24 }, () => azar(10, 50));
const datosMini = Array.from({ length: 14 }, () => azar(10, 50));
function camino(datos, ancho, alto, area) {
  const paso = ancho / (datos.length - 1);
  let d = datos.map((v, i) => (i ? 'L' : 'M') + (i * paso).toFixed(1) + ' ' + (alto - v).toFixed(1)).join(' ');
  if (area) d += ` L ${ancho} ${alto} L 0 ${alto} Z`;
  return d;
}
function moverDatos(datos) {
  datos.shift();
  const ult = datos[datos.length - 1];
  datos.push(Math.max(6, Math.min(54, ult + azar(-14, 14))));
}

/* ---------- Ecualizador ---------- */
const eq = $('eq');
for (let i = 0; i < 60; i++) eq.appendChild(document.createElement('i'));
const barras = [...eq.children];
function ecualizar(t) {
  barras.forEach((b, i) => {
    const v = Math.abs(Math.sin(t / 380 + i * .45) * Math.cos(t / 900 + i * .13));
    b.style.height = 6 + v * 44 + 'px';
  });
}

/* ---------- Bucle principal ---------- */
let antes = performance.now(), accEscribir = 0, accGraf = 0, accEq = 0;
function cuadro(ahora) {
  const dt = Math.min(0.1, (ahora - antes) / 1000);
  antes = ahora;

  for (const o of pulsos) {
    o.pos = (o.pos + o.vel * dt) % 1;
    const pt = o.p.getPointAtLength(o.pos * o.largo);
    o.c.setAttribute('cx', pt.x);
    o.c.setAttribute('cy', pt.y);
    o.c.setAttribute('opacity', Math.sin(o.pos * Math.PI).toFixed(2));
  }

  accEscribir += dt;
  if (accEscribir > azar(.07, .16)) { accEscribir = 0; escribir(); }

  accGraf += dt;
  if (accGraf > .35) {
    accGraf = 0;
    moverDatos(datosTel); moverDatos(datosMini);
    $('phone-line').setAttribute('d', camino(datosTel, 120, 60, false));
    $('mini-area').setAttribute('d', camino(datosMini, 130, 60, true));
  }

  accEq += dt;
  if (accEq > .05) { accEq = 0; ecualizar(ahora); }

  requestAnimationFrame(cuadro);
}
$('phone-line').setAttribute('d', camino(datosTel, 120, 60, false));
$('mini-area').setAttribute('d', camino(datosMini, 130, 60, true));
requestAnimationFrame(cuadro);

setTimeout(() => { $('hint').style.opacity = 0; }, 4000);


/* ---------- Pantalla completa al tocar (y mantener la pantalla encendida) ---------- */
let wakeLock = null;
async function mantenerEncendida() {
  try { if ('wakeLock' in navigator && !wakeLock) {
    wakeLock = await navigator.wakeLock.request('screen');
    wakeLock.addEventListener('release', () => { wakeLock = null; });
  } } catch (_) { /* no soportado o sin permiso */ }
}
$('fondo').addEventListener('click', () => {
  const d = document;
  if (!d.fullscreenElement && d.documentElement.requestFullscreen) {
    d.documentElement.requestFullscreen({ navigationUI: 'hide' }).catch(() => {});
  } else if (d.fullscreenElement && d.exitFullscreen) {
    d.exitFullscreen().catch(() => {});
  }
  mantenerEncendida();
});
document.addEventListener('visibilitychange', () => {
  if (document.visibilityState === 'visible' && document.fullscreenElement) mantenerEncendida();
});

/* ---------- Avisos ---------- */
const btnUpd = $('btn-update');
const toast = $('toast');
let accionOk = null;
let timerToast = null;

function mostrarToast({ titulo, msg = '', ok = null, accion = null, progreso = null, cerrar = true, autoOcultar = 0 }) {
  clearTimeout(timerToast);
  $('toast-titulo').textContent = titulo;
  $('toast-msg').textContent = msg;
  $('toast-ok').textContent = ok || '';
  $('toast-ok').hidden = !ok;
  $('toast-cerrar').hidden = !cerrar;
  accionOk = accion;
  $('toast-barra').hidden = progreso === null;
  if (progreso !== null) $('toast-prog').style.width = progreso + '%';
  toast.classList.add('visible');
  if (autoOcultar) timerToast = setTimeout(ocultarToast, autoOcultar);
}
function ocultarToast() { toast.classList.remove('visible'); }

$('toast-ok').addEventListener('click', (e) => { e.stopPropagation(); if (accionOk) accionOk(); });
$('toast-cerrar').addEventListener('click', (e) => { e.stopPropagation(); ocultarToast(); });

/* ---------- Instalar en el celular ---------- */
const instalada = matchMedia('(display-mode: standalone)').matches || navigator.standalone === true;
let promptInstalar = null;

addEventListener('beforeinstallprompt', (e) => {      // Android / Chrome
  e.preventDefault();
  promptInstalar = e;
  setTimeout(() => mostrarToast({
    titulo: 'Instalar Neon Desk',
    msg: 'Agrégala a tu pantalla de inicio y ábrela como app, incluso sin internet.',
    ok: 'Instalar',
    accion: async () => {
      ocultarToast();
      promptInstalar.prompt();
      await promptInstalar.userChoice;
      promptInstalar = null;
    }
  }), 2500);
});
addEventListener('appinstalled', () => {
  mostrarToast({ titulo: '¡Listo!', msg: 'Neon Desk quedó instalada en tu pantalla de inicio.', autoOcultar: 4000 });
});

// iPhone / iPad: Safari no tiene botón de instalar, hay que explicarlo
const esIOS = /iphone|ipad|ipod/i.test(navigator.userAgent) ||
  (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
if (esIOS && !instalada) {
  let visto = false;
  try { visto = localStorage.getItem('neon-ios-aviso') === '1'; } catch (_) {}
  if (!visto) setTimeout(() => {
    mostrarToast({
      titulo: 'Instálala en tu iPhone',
      msg: 'En Safari toca Compartir (el cuadro con flecha) y luego "Agregar a inicio".',
      ok: 'Entendido',
      accion: () => { try { localStorage.setItem('neon-ios-aviso', '1'); } catch (_) {} ocultarToast(); }
    });
  }, 2500);
}

/* ---------- Funcionar sin internet + actualizaciones (service worker) ---------- */
if (!('serviceWorker' in navigator)) {
  btnUpd.hidden = true;
} else {
  let manual = false;
  let recargando = false;

  function pedirVersion(sw) {
    if (!sw) return;
    const canal = new MessageChannel();
    canal.port1.onmessage = (e) => { $('version').textContent = 'v' + e.data; };
    sw.postMessage({ tipo: 'version' }, [canal.port2]);
  }

  function ofrecerNueva(sw) {
    btnUpd.classList.add('hay-nueva');
    btnUpd.classList.remove('girando');
    mostrarToast({
      titulo: '¡Nueva versión disponible!',
      msg: 'Ya se descargó. Toca para aplicarla.',
      ok: 'Actualizar ahora',
      accion: () => {
        mostrarToast({ titulo: 'Actualizando…', progreso: 100, cerrar: false });
        sw.postMessage({ tipo: 'saltar' });
      }
    });
  }

  // cuando el nuevo service worker toma el control, recargamos una sola vez
  navigator.serviceWorker.addEventListener('controllerchange', () => {
    if (recargando) return;
    recargando = true;
    location.reload();
  });

  navigator.serviceWorker.register('sw.js').then((reg) => {
    pedirVersion(reg.active || navigator.serviceWorker.controller);
    if (reg.waiting && navigator.serviceWorker.controller) ofrecerNueva(reg.waiting);

    reg.addEventListener('updatefound', () => {
      const nuevo = reg.installing;
      if (!nuevo) return;
      btnUpd.classList.add('girando');
      if (manual) mostrarToast({ titulo: 'Descargando actualización…', progreso: 50, cerrar: false });
      nuevo.addEventListener('statechange', () => {
        if (nuevo.state === 'installed') {
          if (navigator.serviceWorker.controller) ofrecerNueva(nuevo);
          else {                                    // primera instalación
            btnUpd.classList.remove('girando');
            pedirVersion(nuevo);
            mostrarToast({ titulo: 'Lista para usar sin internet', msg: 'Neon Desk quedó guardada en tu dispositivo.', autoOcultar: 4000 });
          }
        }
        if (nuevo.state === 'redundant') btnUpd.classList.remove('girando');
      });
    });

    btnUpd.addEventListener('click', async (e) => {
      e.stopPropagation();
      if (!navigator.onLine) {
        mostrarToast({ titulo: 'Sin conexión', msg: 'Conéctate a internet para buscar actualizaciones.', autoOcultar: 4000 });
        return;
      }
      manual = true;
      btnUpd.classList.add('girando');
      mostrarToast({ titulo: 'Buscando actualizaciones…', cerrar: false });
      try {
        await reg.update();
        // si no apareció nada nuevo en unos segundos, estás al día
        setTimeout(() => {
          if (!reg.installing && !reg.waiting) {
            btnUpd.classList.remove('girando', 'hay-nueva');
            mostrarToast({ titulo: 'Todo al día', msg: `Ya tienes la última versión (${$('version').textContent || 'actual'}).`, autoOcultar: 4000 });
            manual = false;
          }
        }, 1500);
      } catch (err) {
        btnUpd.classList.remove('girando');
        mostrarToast({ titulo: 'No se pudo actualizar', msg: 'Revisa tu conexión.', autoOcultar: 5000 });
        manual = false;
      }
    });

    // revisar solo cada hora mientras está abierta
    setInterval(() => { if (navigator.onLine) reg.update().catch(() => {}); }, 60 * 60 * 1000);
  }).catch(() => { btnUpd.hidden = true; });
}
