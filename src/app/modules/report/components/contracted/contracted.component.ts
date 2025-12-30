import { CommonModule } from '@angular/common';
import { Component, effect, inject, input } from '@angular/core';
import { InfiniteScrollDirective } from 'ngx-infinite-scroll';
import { EmployeeEvent } from '../../models/employee-event.model';
import { ReportService } from '../../services/report.service';

@Component({
  selector: 'report-contracted',
  standalone: true,
  imports: [CommonModule, InfiniteScrollDirective],
  templateUrl: './contracted.component.html',
  styles: ``,
})
export class ContractedComponent {
  private readonly reportService = inject(ReportService);

  readonly from = input<Date>();
  readonly to = input<Date>();

  rows: EmployeeEvent[] = [];
  fetching = false;

  constructor() {
    effect(() => {
      const params = { eventType: 'HIRE' } as any;
      if (this.from()) params['from'] = this.from();
      if (this.to()) params['to'] = this.to();

      this.fetching = true;
      this.reportService.getEmployeeEvents(0, params).subscribe({
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
