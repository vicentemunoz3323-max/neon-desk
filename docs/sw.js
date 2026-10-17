/* Service worker de Neon Desk
   Guarda la app en el celular para que abra sin internet.
   Para publicar una actualización: cambia VERSION (y sube los archivos). */
const VERSION = '1.2.1';
const CACHE = 'neon-desk-' + VERSION;
const ARCHIVOS = [
  './',
  './index.html',
  './style.css',
  './app.js',
  './manifest.webmanifest',
  './icons/icon-192.png',
  './icons/icon-512.png',
  './icons/icon-maskable-512.png',
  './icons/apple-touch-icon.png'
];

// Instalar: descarga todo y lo guarda. No se activa solo; espera a que el usuario toque "Actualizar ahora".
self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(ARCHIVOS.map((u) => new Request(u, { cache: 'reload' })))));
});

// Activar: borra las versiones viejas
self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys()
      .then((nombres) => Promise.all(nombres.filter((n) => n.startsWith('neon-desk-') && n !== CACHE).map((n) => caches.delete(n))))
      .then(() => self.clients.claim())
  );
});

// Mensajes desde la página
self.addEventListener('message', (e) => {
  if (!e.data) return;
  if (e.data.tipo === 'saltar') self.skipWaiting();
  if (e.data.tipo === 'version' && e.ports[0]) e.ports[0].postMessage(VERSION);
});

// Peticiones: primero lo guardado (abre al instante y sin internet), si no existe va a la red
self.addEventListener('fetch', (e) => {
  const req = e.request;
  if (req.method !== 'GET' || new URL(req.url).origin !== self.location.origin) return;

  e.respondWith(
    caches.match(req, { ignoreSearch: true }).then((guardado) => {
      if (guardado) return guardado;
      return fetch(req).then((resp) => {
        if (resp.ok) {
          const copia = resp.clone();
          caches.open(CACHE).then((c) => c.put(req, copia));
        }
        return resp;
      }).catch(() => req.mode === 'navigate' ? caches.match('./index.html') : Response.error());
    })
  );
});
