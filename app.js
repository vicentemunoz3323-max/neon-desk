'use strict';
const $ = (id) => document.getElementById(id);
const azar = (a, b) => a + Math.random() * (b - a);
const elegir = (l) => l[Math.floor(Math.random() * l.length)];
const COLORES = ['#ff6fb3', '#ff9fd2', '#ffd36b', '#7fe7ff', '#b08cff', '#ff5a8a', '#9ef0c8'];

/* ---------- Escalar el escenario para que siempre llene la ventana ---------- */
const stage = $('stage');
function ajustar() {
  const s = Math.min(innerWidth / 1600, innerHeight / 1000);
  stage.style.transform = `translate(${-800 * s}px, ${-500 * s}px) scale(${s})`;
}
addEventListener('resize', ajustar);
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
const FIRMA = 'RealityEngine V3';
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

/* ---------- Actualizaciones ---------- */
const upd = window.actualizador;   // viene de preload.js (no existe si abres el HTML en el navegador)
const btnUpd = $('btn-update');
const toast = $('toast');
let manual = false;        // el usuario apretó el botón (mostramos "ya estás al día" / errores)
let accionOk = null;       // qué hace el botón principal del aviso
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

$('toast-ok').addEventListener('click', () => { if (accionOk) accionOk(); });
$('toast-cerrar').addEventListener('click', ocultarToast);

if (!upd) {
  btnUpd.hidden = true;
} else {
  upd.version().then((v) => { $('version').textContent = 'v' + v; });

  btnUpd.addEventListener('click', () => {
    manual = true;
    upd.buscar();
  });

  upd.alCambiar(({ estado, version, porcentaje, mensaje }) => {
    btnUpd.classList.toggle('girando', estado === 'buscando' || estado === 'descargando');

    switch (estado) {
      case 'buscando':
        if (manual) mostrarToast({ titulo: 'Buscando actualizaciones…', cerrar: false });
        break;

      case 'disponible':
        btnUpd.classList.add('hay-nueva');
        mostrarToast({
          titulo: `¡Nueva versión ${version}!`,
          msg: 'Hay una actualización lista para descargar.',
          ok: 'Descargar',
          accion: () => { upd.descargar(); mostrarToast({ titulo: 'Descargando…', progreso: 0, cerrar: false }); }
        });
        break;

      case 'descargando':
        mostrarToast({ titulo: 'Descargando actualización', msg: porcentaje + '%', progreso: porcentaje, cerrar: false });
        break;

      case 'lista':
        mostrarToast({
          titulo: `Versión ${version} descargada`,
          msg: 'Reinicia para instalarla (o se instalará al cerrar).',
          ok: 'Reiniciar ahora',
          accion: () => upd.instalar()
        });
        break;

      case 'actual':
        btnUpd.classList.remove('hay-nueva');
        if (manual) mostrarToast({ titulo: 'Todo al día', msg: `Ya tienes la última versión (v${version}).`, autoOcultar: 4000 });
        manual = false;
        break;

      case 'dev':
        mostrarToast({ titulo: 'Modo desarrollo', msg: 'Las actualizaciones solo funcionan en la app instalada (npm run build).', autoOcultar: 5000 });
        manual = false;
        break;

      case 'error':
        if (manual) mostrarToast({ titulo: 'No se pudo actualizar', msg: mensaje || 'Revisa tu conexión.', autoOcultar: 6000 });
        manual = false;
        break;
    }
  });
}
