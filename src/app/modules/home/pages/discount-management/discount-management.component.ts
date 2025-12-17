import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DiscountService } from '../../services/discount.service';
import { EmployeeService } from '../../services/employee.service';
import { ProjectManagementService } from '../../services/project-management.service';

@Component({
  selector: 'app-discount-management',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './discount-management.component.html',
  styleUrl: './discount-management.component.scss'
})
export class DiscountManagementComponent {
  deductions: any
  employees: any
  projects: any

  form = signal({
    employeeId: 0,
    projectId: 0,
    amount: 0,
    date: new Date().toISOString().split('T')[0],
    reason: ''
  });

  constructor(
    private deductionService: DiscountService,
    private employeeService: EmployeeService,
    private projectService: ProjectManagementService
  ) {
    this.deductions = this.deductionService.allDeductions;
    this.employees = this.employeeService.allEmployees;
  }

  save() {
    if (this.form().employeeId && this.form().projectId && this.form().amount > 0) {
      this.deductionService.add({
        employeeId: this.form().employeeId,
        projectId: this.form().projectId,
        amount: this.form().amount,
        date: '2025-01-01',
        reason: this.form().reason
      });
      this.resetForm();
      this.closeModal();
    }
  }

  delete(id: number) {
    if (confirm('¿Eliminar este descuento?')) {
      this.deductionService.delete(id);
    }
  }

  private resetForm() {
    this.form.set({
      employeeId: 0,
      projectId: 0,
      amount: 0,
      date: new Date().toISOString().split('T')[0],
      reason: ''
    });
  }

  closeModal() {
    (document.getElementById('discount_modal') as any)?.close();
  }

  openCreateModal() {
    this.showModal('discount_modal');
  }

  private showModal(modalId: string) {
    (document.getElementById(modalId) as any)?.showModal();
  }

  getEmployeeName(id: number) { return this.employees().find((e: any) => e.id === id)?.name ?? '—'; }
  getProjectName(id: number) { return this.projects().find((p: any) => p.id === id)?.name ?? '—'; }

  formatCurrency(value: number) {
    return new Intl.NumberFormat('es-PE', { style: 'currency', currency: 'PEN' }).format(value);
  }

  formatDate(date: Date) {
    return new Date(date).toLocaleDateString('es-PE');
  }
}