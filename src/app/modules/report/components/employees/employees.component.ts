import { CommonModule } from '@angular/common';
import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { ContractedComponent } from '../contracted/contracted.component';
import { FinishedComponent } from '../finished/finished.component';
import { RolesComponent } from '../roles/roles.component';

export enum ReportType {
  CONTRACTS = 'CONTRACTS',
  FINISHED = 'FINISHED',
  ROLES = 'ROLES',
}

@Component({
  selector: 'report-employees',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ContractedComponent,
    FinishedComponent,
    RolesComponent,
  ],
  templateUrl: './employees.component.html',
  styles: ``,
})
export class EmployeesComponent {
  readonly report = signal<ReportType>(ReportType.CONTRACTS);
  readonly from = signal<Date | undefined>(undefined);
  readonly to = signal<Date | undefined>(undefined);

  readonly ReportType = ReportType;

  export() {
    const doc = new jsPDF('l', 'mm', 'a4');
    autoTable(doc, {
      html:
        this.report() === ReportType.CONTRACTS
          ? '#contracts-report'
          : this.report() === ReportType.FINISHED
          ? '#finished-report'
          : '#roles-report',
    });
    doc.save('employees-report.pdf');
  }
}
