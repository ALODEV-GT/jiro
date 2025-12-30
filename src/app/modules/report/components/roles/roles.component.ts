import { CommonModule } from '@angular/common';
import { Component, effect, inject, input } from '@angular/core';
import { InfiniteScrollDirective } from 'ngx-infinite-scroll';
import { UserRole } from '../../models/roles.model';
import { ReportService } from '../../services/report.service';

@Component({
  selector: 'report-roles',
  standalone: true,
  imports: [CommonModule, InfiniteScrollDirective],
  templateUrl: './roles.component.html',
  styles: ``,
})
export class RolesComponent {
  private readonly reportService = inject(ReportService);

  readonly from = input<Date>();
  readonly to = input<Date>();

  rows: UserRole[] = [];
  fetching = false;

  constructor() {
    effect(() => {
      const params = {} as any;
      if (this.from()) params['from'] = this.from();
      if (this.to()) params['to'] = this.to();

      this.fetching = true;
      this.reportService.getUserRoles(0, params).subscribe({
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
}
