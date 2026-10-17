const { app, BrowserWindow, ipcMain, Notification } = require('electron');
const { autoUpdater } = require('electron-updater');
const path = require('path');

let win = null;

/* ---------- Actualizaciones ---------- */
autoUpdater.autoDownload = false;          // primero preguntamos al usuario
autoUpdater.autoInstallOnAppQuit = true;   // si ya se descargó, se instala al cerrar

function enviar(estado, datos = {}) {
  if (win && !win.isDestroyed()) win.webContents.send('update:estado', { estado, ...datos });
}

autoUpdater.on('checking-for-update', () => enviar('buscando'));
autoUpdater.on('update-not-available', () => enviar('actual', { version: app.getVersion() }));
autoUpdater.on('update-available', (info) => {
  enviar('disponible', { version: info.version });
  if (Notification.isSupported()) {
    new Notification({ title: 'Neon Desk', body: `Nueva versión ${info.version} disponible` }).show();
  }
});
autoUpdater.on('download-progress', (p) => enviar('descargando', { porcentaje: Math.round(p.percent) }));
autoUpdater.on('update-downloaded', (info) => enviar('lista', { version: info.version }));
autoUpdater.on('error', (e) => enviar('error', { mensaje: e ? e.message : 'Error desconocido' }));

async function buscarActualizaciones() {
  if (!app.isPackaged) return enviar('dev');   // en "npm start" no hay nada que actualizar
  try { await autoUpdater.checkForUpdates(); }
  catch (e) { enviar('error', { mensaje: e.message }); }
}

ipcMain.handle('app:version', () => app.getVersion());
ipcMain.handle('update:buscar', () => buscarActualizaciones());
ipcMain.handle('update:descargar', async () => {
  try { await autoUpdater.downloadUpdate(); }
  catch (e) { enviar('error', { mensaje: e.message }); }
});
ipcMain.handle('update:instalar', () => autoUpdater.quitAndInstall());

/* ---------- Ventana ---------- */
function crearVentana() {
  win = new BrowserWindow({
    width: 1280,
    height: 800,
    minWidth: 640,
    minHeight: 400,
    backgroundColor: '#071a44',
    autoHideMenuBar: true,
    title: 'Neon Desk',
    webPreferences: {
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js')
    }
  });
  win.loadFile(path.join(__dirname, 'index.html'));

  // F11 pantalla completa, Esc para salir de ella
  win.webContents.on('before-input-event', (_e, input) => {
    if (input.type !== 'keyDown') return;
    if (input.key === 'F11') win.setFullScreen(!win.isFullScreen());
    if (input.key === 'Escape' && win.isFullScreen()) win.setFullScreen(false);
  });

  // Revisión automática al abrir (solo en la app instalada)
  win.webContents.once('did-finish-load', () => {
    if (app.isPackaged) setTimeout(buscarActualizaciones, 3000);
  });
}

app.whenReady().then(() => {
  crearVentana();
  // y otra revisión cada hora
  setInterval(() => { if (app.isPackaged) buscarActualizaciones(); }, 60 * 60 * 1000);
  app.on('activate', () => { if (BrowserWindow.getAllWindows().length === 0) crearVentana(); });
});

app.on('window-all-closed', () => { if (process.platform !== 'darwin') app.quit(); });
