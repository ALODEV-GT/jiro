import { Injectable, signal } from '@angular/core';
import { Toast } from '../models/toast.model';

@Injectable({ providedIn: 'root' })
export class ToastService {
  private readonly _toasts = signal<Toast[]>([]);
  readonly toasts = this._toasts.asReadonly();

  show(
    message: string,
    opts: Partial<Pick<Toast, 'type' | 'durationMs' | 'position'>> = {}
  ) {
    const toast: Toast = {
      id: crypto.randomUUID(),
      message,
      type: opts.type ?? 'info',
      durationMs: opts.durationMs ?? 3000,
      position: opts.position ?? 'bottom-end',
    };

    this._toasts.update((arr) => [...arr, toast]);

    window.setTimeout(() => this.dismiss(toast.id), toast.durationMs);
    return toast.id;
  }

  info(message: string, opts: Partial<Omit<Toast, 'id' | 'message' | 'type'>> = {}) {
    return this.show(message, { ...opts, type: 'info' });
  }
  success(message: string, opts: Partial<Omit<Toast, 'id' | 'message' | 'type'>> = {}) {
    return this.show(message, { ...opts, type: 'success' });
  }
  warning(message: string, opts: Partial<Omit<Toast, 'id' | 'message' | 'type'>> = {}) {
    return this.show(message, { ...opts, type: 'warning' });
  }
  error(message: string, opts: Partial<Omit<Toast, 'id' | 'message' | 'type'>> = {}) {
    return this.show(message, { ...opts, type: 'error' });
  }

  dismiss(id: string) {
    this._toasts.update((arr) => arr.filter((t) => t.id !== id));
  }

  clear() {
    this._toasts.set([]);
  }
}
