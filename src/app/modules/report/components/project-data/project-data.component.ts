import { CommonModule } from '@angular/common';
import { Component, input, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { jsPDF } from 'jspdf';
import { autoTable } from 'jspdf-autotable';
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
  readonly incomes = signal<boolean | undefined>(undefined);
  readonly from = signal<Date | undefined>(undefined);
  readonly to = signal<Date | undefined>(undefined);

  readonly ReportType = ReportType;

  export() {
    const doc = new jsPDF('l', 'mm', 'a4');
    autoTable(doc, {
      html:
        this.report() === ReportType.ADVANCE
          ? '#advance-report'
          : '#finance-report',
    });
    doc.save('project-report.pdf');
  }
}
