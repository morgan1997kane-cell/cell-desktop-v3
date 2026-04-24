import { contextBridge, ipcRenderer } from 'electron';
import type { CapturedCellPayload } from './shared/types';

const cellDesktopApi = {
  submitCapture: (content: string) => {
    ipcRenderer.send('capture:create-cell', content);
  },
  openMainWindow: () => {
    ipcRenderer.send('capture:open-main');
  },
  onCapturedCell: (callback: (payload: CapturedCellPayload) => void) => {
    const listener = (_event: Electron.IpcRendererEvent, payload: CapturedCellPayload) => {
      callback(payload);
    };

    ipcRenderer.on('main:add-cell', listener);

    return () => {
      ipcRenderer.removeListener('main:add-cell', listener);
    };
  },
};

contextBridge.exposeInMainWorld('cellDesktop', cellDesktopApi);
