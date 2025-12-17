import { Component, signal } from '@angular/core';
import { BonusService } from '../../services/bonus.service';
import { EmployeeService } from '../../services/employee.service';
import { ProjectManagementService } from '../../services/project-management.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-bonus-management',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './bonus-management.component.html',
  styleUrl: './bonus-management.component.scss'
})
export class BonusManagementComponent {
  bonuses: any
  employees: any
  projects: any

  form = signal({
    employeeId: 0,
    projectId: 0,
    amount: 0,
    date: new Date().toISOString().split('T')[0],
    description: ''
  });

  constructor(
    private bonusService: BonusService,
    private employeeService: EmployeeService,
    private projectService: ProjectManagementService
  ) {
    this.bonuses = this.bonusService.allBonuses;
    this.employees = this.employeeService.allEmployees;
  }

  save() {
    if (this.form().employeeId && this.form().projectId && this.form().amount > 0) {
      this.bonusService.add({
        employeeId: this.form().employeeId,
        projectId: this.form().projectId,
        amount: this.form().amount,
        date: '2025-01-01',
        description: this.form().description
      });
      this.resetForm();
      this.closeModal();
    }
  }

  delete(id: number) {
    if (confirm('¿Eliminar este bono?')) {
      this.bonusService.delete(id);
    }
  }

  private resetForm() {
    this.form.set({
      employeeId: 0,
      projectId: 0,
      amount: 0,
      date: new Date().toISOString().split('T')[0],
      description: ''
    });
  }

  closeModal() {
    (document.getElementById('bonus_modal') as any)?.close();
  }

  getEmployeeName(id: number) {
    return this.employees().find((e: any) => e.id === id)?.name ?? '—';
  }

  getProjectName(id: number) {
    return this.projects().find((p: any) => p.id === id)?.name ?? '—';
  }

  formatCurrency(value: number) {
    return new Intl.NumberFormat('es-PE', { style: 'currency', currency: 'PEN' }).format(value);
  }

  formatDate(date: Date) {
    return new Date(date).toLocaleDateString('es-PE');
  }

  openCreateModal() {
    this.showModal('bonus_modal');
  }

  private showModal(modalId: string) {
    (document.getElementById(modalId) as any)?.showModal();
  }
}