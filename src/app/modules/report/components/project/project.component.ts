import { CommonModule } from '@angular/common';
import { Component, effect, inject, input, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { InfiniteScrollDirective } from 'ngx-infinite-scroll';
import { ProjectAdvance } from '../../models/project-advance.model';
import { ReportService } from '../../services/report.service';

@Component({
  selector: 'report-project',
  standalone: true,
  imports: [CommonModule, FormsModule, InfiniteScrollDirective],
  templateUrl: './project.component.html',
  styles: ``,
})
export class ProjectAdvanceComponent {
  private readonly reportService = inject(ReportService);

  readonly projectId = input.required<string>();
  readonly from = signal<Date | undefined>(undefined);
  readonly to = signal<Date | undefined>(undefined);

  rows: ProjectAdvance[] = [];
  fetching = false;

  key(row: ProjectAdvance): string {
    return `${row.projectId}-${row.sprintId}`;
  }

  constructor() {
    effect(() => {
      const params = {} as any;
      if (this.projectId()) params['projectId'] = this.projectId();
      if (this.from()) params['from'] = this.from();
      if (this.to()) params['to'] = this.to();

      this.fetching = true;
      this.reportService.getProjectAdvance(0, params).subscribe({
        next: (page) => {
          this.rows = page.items;
          this.fetching = false;
        },
        error: (e) => {
          this.fetching = false;
          console.error(e);
        },
      });
    });
  }

  stateToString(state: ProjectAdvance['sprintStatus']): string {
    switch (state) {
      case 'ACTIVE':
        return 'Activa';
      case 'PENDING':
        return 'Pendiente';
      case 'FINISHED':
        return 'Finalizada';
      default:
        return 'Desconocido';
    }
  }
}
