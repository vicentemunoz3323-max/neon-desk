const { contextBridge, ipcRenderer } = require('electron');

// Puente seguro entre la página y el proceso principal
contextBridge.exposeInMainWorld('actualizador', {
  version: () => ipcRenderer.invoke('app:version'),
  buscar: () => ipcRenderer.invoke('update:buscar'),
  descargar: () => ipcRenderer.invoke('update:descargar'),
  instalar: () => ipcRenderer.invoke('update:instalar'),
  alCambiar: (fn) => ipcRenderer.on('update:estado', (_e, datos) => fn(datos))
});
