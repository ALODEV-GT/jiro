import { CommonModule } from '@angular/common';
import { Component, input, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AdvanceComponent } from '../advance/advance.component';
import { FinanceComponent } from '../finance/finance.component';

export enum ReportType {
  ADVANCE = 'ADVANCE',
  FINANCIAL = 'FINANCIAL',
}

@Component({
  selector: 'report-project',
  standalone: true,
  imports: [CommonModule, FormsModule, AdvanceComponent, FinanceComponent],
  templateUrl: './project-data.component.html',
  styles: ``,
})
export class ProjectDataComponent {
  readonly projectId = input.required<string>();
  readonly report = signal<ReportType>(ReportType.ADVANCE);
  readonly from = signal<Date | undefined>(undefined);
  readonly to = signal<Date | undefined>(undefined);

  readonly ReportType = ReportType;
}
