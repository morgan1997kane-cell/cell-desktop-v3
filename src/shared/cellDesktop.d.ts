import type { CellDesktopApi } from './types';

declare global {
  interface Window {
    cellDesktop: CellDesktopApi;
  }
}

export {};
