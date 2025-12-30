import { CommonModule } from '@angular/common';
import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
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
}
