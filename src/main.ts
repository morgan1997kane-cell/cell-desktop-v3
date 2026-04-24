import { app, BrowserWindow, ipcMain } from 'electron';
import path from 'node:path';
import started from 'electron-squirrel-startup';

declare const MAIN_WINDOW_VITE_DEV_SERVER_URL: string | undefined;
declare const MAIN_WINDOW_VITE_NAME: string;
declare const CAPTURE_WINDOW_VITE_DEV_SERVER_URL: string | undefined;
declare const CAPTURE_WINDOW_VITE_NAME: string;

if (started) {
  app.quit();
}

let mainWindow: BrowserWindow | null = null;
let captureWindow: BrowserWindow | null = null;

const preloadPath = () => path.join(__dirname, 'preload.js');

const loadRenderer = (
  window: BrowserWindow,
  devServerUrl: string | undefined,
  rendererName: string,
  htmlFile: string,
) => {
  if (devServerUrl) {
    window.loadURL(`${devServerUrl}/${htmlFile}`);
    return;
  }

  window.loadFile(path.join(__dirname, `../renderer/${rendererName}/${htmlFile}`));
};

const createMainWindow = () => {
  if (mainWindow && !mainWindow.isDestroyed()) {
    mainWindow.show();
    mainWindow.focus();
    return mainWindow;
  }

  mainWindow = new BrowserWindow({
    width: 1120,
    height: 740,
    minWidth: 920,
    minHeight: 620,
    backgroundColor: '#050706',
    title: 'Cell 母体',
    autoHideMenuBar: true,
    show: false,
    webPreferences: {
      preload: preloadPath(),
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  loadRenderer(
    mainWindow,
    MAIN_WINDOW_VITE_DEV_SERVER_URL,
    MAIN_WINDOW_VITE_NAME,
    'main.html',
  );

  mainWindow.once('ready-to-show', () => {
    mainWindow?.show();
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  return mainWindow;
};

const createCaptureWindow = () => {
  if (captureWindow && !captureWindow.isDestroyed()) {
    captureWindow.show();
    captureWindow.focus();
    return captureWindow;
  }

  captureWindow = new BrowserWindow({
    width: 520,
    height: 236,
    minWidth: 460,
    minHeight: 212,
    maxWidth: 720,
    maxHeight: 360,
    backgroundColor: '#050706',
    title: 'Cell 捕捉',
    autoHideMenuBar: true,
    resizable: true,
    show: false,
    webPreferences: {
      preload: preloadPath(),
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  loadRenderer(
    captureWindow,
    CAPTURE_WINDOW_VITE_DEV_SERVER_URL,
    CAPTURE_WINDOW_VITE_NAME,
    'capture.html',
  );

  captureWindow.once('ready-to-show', () => {
    captureWindow?.show();
  });

  captureWindow.on('closed', () => {
    captureWindow = null;
  });

  return captureWindow;
};

app.on('ready', () => {
  createMainWindow();
  createCaptureWindow();
});

ipcMain.on('capture:create-cell', (_event, content: string) => {
  const trimmedContent = content.trim();

  if (!trimmedContent) {
    return;
  }

  const targetWindow = createMainWindow();
  targetWindow.webContents.send('main:add-cell', {
    content: trimmedContent,
    createdAt: Date.now(),
  });
});

ipcMain.on('capture:open-main', () => {
  createMainWindow();
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createMainWindow();
    createCaptureWindow();
  }
});
