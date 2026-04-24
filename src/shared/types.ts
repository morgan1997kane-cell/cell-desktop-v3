export type CapturedCellPayload = {
  content: string;
  createdAt: number;
};

export type CellDesktopApi = {
  submitCapture: (content: string) => void;
  openMainWindow: () => void;
  onCapturedCell: (callback: (payload: CapturedCellPayload) => void) => () => void;
};
