import { CommonModule } from '@angular/common';
import { Component, computed, inject } from '@angular/core';
import { ToastService } from '../services/toast.service';
import { Toast, ToastPosition } from '../models/toast.model';

@Component({
    selector: 'app-toast-container',
    standalone: true,
    imports: [CommonModule],
    template: `
    <ng-container *ngFor="let group of grouped()">
      <div class="toast z-40" [ngClass]="positionClass(group.position)" aria-live="polite" aria-atomic="true">
        <div
          *ngFor="let t of group.items"
          class="alert"
          [ngClass]="alertClass(t)"
          role="status"
        >
          <span>{{ t.message }}</span>
          <button
            type="button"
            class="btn btn-ghost btn-xs ml-2"
            (click)="dismiss(t.id)"
            aria-label="Cerrar"
          >
            ✕
          </button>
        </div>
      </div>
    </ng-container>
  `,
})
export class ToastContainerComponent {
    private readonly toast = inject(ToastService);

    readonly grouped = computed(() => {
        const map = new Map<ToastPosition, Toast[]>();
        for (const t of this.toast.toasts()) {
            const list = map.get(t.position) ?? [];
            list.push(t);
            map.set(t.position, list);
        }
        return Array.from(map.entries()).map(([position, items]) => ({ position, items }));
    });

    dismiss(id: string) {
        this.toast.dismiss(id);
    }

    alertClass(t: Toast) {
        return {
            'alert-info': t.type === 'info',
            'alert-success': t.type === 'success',
            'alert-warning': t.type === 'warning',
            'alert-error': t.type === 'error',
        };
    }

    positionClass(pos: ToastPosition) {
        return {
            'toast-top toast-start': pos === 'top-start',
            'toast-top toast-end': pos === 'top-end',
            'toast-bottom toast-start': pos === 'bottom-start',
            'toast-bottom toast-end': pos === 'bottom-end',
        };
    }
}
