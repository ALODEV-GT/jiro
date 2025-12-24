import { Component } from '@angular/core';
import { TopbarComponent } from '../../components/topbar/topbar.component';

@Component({
  selector: 'app-employee-management',
  standalone: true,
  imports: [TopbarComponent],
  templateUrl: './employee-management.component.html',
  styleUrl: './employee-management.component.scss'
})
export class EmployeeManagementComponent {
  activeTab: 'income' | 'discount' | 'bonus' | 'suspension' | 'contract' = 'income';

  constructor() {

  }
}
