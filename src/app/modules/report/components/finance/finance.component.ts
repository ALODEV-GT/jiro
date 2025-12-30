import { CommonModule } from '@angular/common';
import { Component, effect, inject, input } from '@angular/core';
import { InfiniteScrollDirective } from 'ngx-infinite-scroll';
import { ProjectFinance } from '../../models/project-finance.model';
import { ReportService } from '../../services/report.service';

@Component({
  selector: 'report-finance',
  standalone: true,
  imports: [CommonModule, InfiniteScrollDirective],
  templateUrl: './finance.component.html',
  styles: ``,
})
export class FinanceComponent {
  private readonly reportService = inject(ReportService);

  readonly projectId = input.required<string>();
  readonly incomes = input<boolean>();
  readonly from = input<Date>();
  readonly to = input<Date>();

  rows: ProjectFinance[] = [];
  fetching = false;

  constructor() {
    effect(() => {
      const params = {} as any;
      if (this.projectId()) params['projectId'] = this.projectId();
      if (this.incomes() !== undefined) params['incomes'] = this.incomes();
      if (this.from()) params['from'] = this.from();
      if (this.to()) params['to'] = this.to();

      this.fetching = true;
      this.reportService.getProjectFinance(0, params).subscribe({
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

  category(category: ProjectFinance['category']): string {
    switch (category) {
      case 'INCOME':
        return 'Ingresos';
      case 'SALARY':
        return 'Sueldo';
      case 'BONUS':
        return 'Bono';
      case 'DISCOUNT':
        return 'Descuento';
      case 'OPERATIONAL_EXPENSE':
        return 'Gastos Operacionales';
      default:
        return 'Otros Gastos';
    }
  }
}
