import { Component, effect, inject, input, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivityLogService } from '../../services/activity-log.service';
import { ActivityLog, ProjectEvent, SprintEvent, StoryEvent } from '../../../home/models/home.model';

@Component({
  selector: 'app-log-activity',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './log-activity.component.html',
  styleUrl: './log-activity.component.scss',
})
export class LogActivityComponent {
  readonly projectId = input.required<string>();

  private readonly activityLogService = inject(ActivityLogService);

  readonly logs = signal<ActivityLog[]>([]);
  readonly loading = signal(true);

  ngOnInit(): void {
    this.loading.set(true);
    this.activityLogService.fetchLogs(this.projectId()).subscribe({
      next: (logs) => {
        this.logs.set(logs);
        this.loading.set(false);
      },
      error: () => {
        this.logs.set([]);
        this.loading.set(false);
      },
    });
  }

  getBadgeLabel(log: ActivityLog): string {
    if (log.eventType.startsWith('story.')) return 'Historia';
    if (log.eventType.startsWith('sprint.')) return 'Sprint';
    if (log.eventType.startsWith('project.')) return 'Proyecto';
    return 'Evento';
  }

  getBadgeClass(log: ActivityLog): string {
    if (log.eventType.startsWith('story.')) return 'badge-primary';
    if (log.eventType.startsWith('sprint.')) return 'badge-success';
    if (log.eventType.startsWith('project.')) return 'badge-warning';
    return 'badge-outline';
  }

  getDetails(log: ActivityLog): string {
    const eventType = log.details?.audit?.eventType;
    if (!eventType) return '';

    const resolver = this.EVENT_MESSAGES[eventType];
    return resolver ? resolver(log.details) : '';
  }


  EVENT_MESSAGES: Record<string, (details: any) => string> = {
    'story.created': (d) =>
      `Se creó la historia y se agregó en el estado ${d.stage}`,

    'story.moved': (d) =>
      `Se movió la historia al estado ${d.stage}`,

    'story.updated': () =>
      'Se actualizó la historia',

    'story.deleted': () =>
      'Se eliminó la historia',

    'sprint.created': () =>
      'Se creó el sprint',

    'sprint.updated': () =>
      'Se actualizó el sprint',

    'sprint.deleted': () =>
      'Se eliminó el sprint',

    'project.created': () =>
      'Se creó el proyecto',

    'project.closed': () =>
      'Se cerró el proyecto',

    'project.updated': () =>
      'Se actualizó el proyecto',

    'project.deleted': () =>
      'Se eliminó el proyecto',
  };

}
