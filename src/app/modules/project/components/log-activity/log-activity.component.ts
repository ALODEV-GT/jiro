import { Component, inject, input, signal, computed, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivityLogService } from '../../services/activity-log.service';
import { ActivityLog, Rol } from '../../../home/models/home.model';
import { RolService } from '../../../home/services/rol.service';
import { ToastService } from '../../../../shared/services/toast.service';
import { ColorService } from '../../../home/services/color.service';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-log-activity',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './log-activity.component.html',
  styleUrl: './log-activity.component.scss',
})
export class LogActivityComponent implements OnInit {
  readonly projectId = input.required<string>();

  private readonly rolService = inject(RolService);
  private readonly activityLogService = inject(ActivityLogService);
  private readonly toast = inject(ToastService);
  readonly colorService = inject(ColorService);

  readonly logs = signal<ActivityLog[]>([]);
  readonly roles = signal<Rol[]>([]);
  readonly loading = signal(true);

  readonly roleColorMap = computed(() =>
    new Map(this.roles().map(r => [r.name, r.color]))
  );

  ngOnInit(): void {
    this.loadData();
  }

  private loadData(): void {
    this.loading.set(true);

    forkJoin({
      roles: this.rolService.getRoles('name', 'DESC', 0, 10000),
      logs: this.activityLogService.fetchLogs(this.projectId()),
    }).subscribe({
      next: ({ roles, logs }) => {
        this.roles.set(roles.items);
        this.logs.set(logs);
        this.loading.set(false);
      },
      error: (e) => {
        this.toast.error(e.message || 'Error cargando actividad');
        this.logs.set([]);
        this.loading.set(false);
      },
    });
  }

  /* ================== Helpers ================== */

  getInitials(fullName: string): string {
    return fullName
      ?.trim()
      .split(/\s+/)
      .slice(0, 2)
      .map(n => n[0].toUpperCase())
      .join('') ?? '';
  }

  getRoleBgColor(roleName: string): string {
    return this.roleColorMap().get(roleName) ?? '#e5e7eb';
  }

  getBadgeLabel(eventType: string): string {
    if (eventType.startsWith('story.')) return 'Historia';
    if (eventType.startsWith('sprint.')) return 'Sprint';
    if (eventType.startsWith('project.')) return 'Proyecto';
    return 'Evento';
  }

  getBadgeClass(eventType: string): string {
    if (eventType.startsWith('story.')) return 'badge-primary';
    if (eventType.startsWith('sprint.')) return 'badge-success';
    if (eventType.startsWith('project.')) return 'badge-warning';
    return 'badge-outline';
  }

  getDetails(log: ActivityLog): string {
    const resolver = this.EVENT_MESSAGES[log.details?.audit?.eventType ?? ''];
    return resolver?.(log.details) ?? '';
  }

  readonly EVENT_MESSAGES: Record<string, (d: any) => string> = {
    'story.created': d => `Se creó la historia en ${d.stage}`,
    'story.moved': d => `Se movió la historia a ${d.stage}`,
    'story.updated': () => 'Se actualizó la historia',
    'story.deleted': () => 'Se eliminó la historia',

    'sprint.created': () => 'Se creó el sprint',
    'sprint.updated': () => 'Se actualizó el sprint',
    'sprint.deleted': () => 'Se eliminó el sprint',

    'project.created': () => 'Se creó el proyecto',
    'project.closed': () => 'Se cerró el proyecto',
    'project.updated': () => 'Se actualizó el proyecto',
    'project.deleted': () => 'Se eliminó el proyecto',
  };
}
