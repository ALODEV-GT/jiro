export type ToastType = 'info' | 'success' | 'warning' | 'error';
export type ToastPosition =
  | 'top-start' | 'top-end' | 'bottom-start' | 'bottom-end';

export interface Toast {
  id: string;
  message: string;
  type: ToastType;
  durationMs: number;
  position: ToastPosition;
}
