import { CommonModule } from '@angular/common';
import { Component, effect, inject, input, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { InfiniteScrollDirective } from 'ngx-infinite-scroll';
import { EmployeeProductivity } from '../../models/employee-productivity.model';
import { ReportService } from '../../services/report.service';

@Component({
  selector: 'report-productivity',
  standalone: true,
  imports: [CommonModule, FormsModule, InfiniteScrollDirective],
  templateUrl: './productivity.component.html',
  styles: ``,
})
export class ProductivityComponent {
  private readonly reportService = inject(ReportService);

  readonly employeeId = input.required<string>();
  readonly from = signal<Date | undefined>(undefined);
  readonly to = signal<Date | undefined>(undefined);

  rows: EmployeeProductivity[] = [];
  fetching = false;

  constructor() {
    effect(() => {
      const params = {} as any;
      if (this.employeeId()) params['developerId'] = this.employeeId();
      if (this.from()) params['from'] = this.from();
      if (this.to()) params['to'] = this.to();

      this.fetching = true;
      this.reportService.getEmployeeProductivity(0, params).subscribe({
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

  // stateToString(state: EmployeeProductivity['sprintStatus']): string {
  //   switch (state) {
  //     case 'ACTIVE':
  //       return 'Activa';
  //     case 'PENDING':
  //       return 'Pendiente';
  //     case 'FINISHED':
  //       return 'Finalizada';
  //     default:
  //       return 'Desconocido';
  //   }
  // }
}
