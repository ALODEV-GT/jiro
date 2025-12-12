import { CommonModule } from '@angular/common';
import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Contract } from '../../models/home.model';
import { ContractService } from '../../services/contract.service';
import { EmployeeService } from '../../services/employee.service';
import { ProjectManagementService } from '../../services/project-management.service';

@Component({
  selector: 'app-employee-management',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './employee-management.component.html',
  styleUrl: './employee-management.component.scss'
})
export class EmployeeManagementComponent {
  contracts: any
  employees: any
  projects: any

  formData = signal<Partial<Contract>>(this.emptyForm());
  editingId = signal<number | null>(null);
  terminatingId = signal<number | null>(null);
  terminationDate: any

  constructor(
    private contractService: ContractService,
    private employeeService: EmployeeService,
    private projectService: ProjectManagementService
  ) {
    this.contracts = this.contractService.allContracts;
    this.employees = this.employeeService.allEmployees;
    this.projects = this.projectService.allProjects;
  }

  private emptyForm(): Partial<Contract> {
    return {
      employeeId: undefined,
      projectId: undefined,
      baseSalary: 0,
      role: 'Project Manager',
      startDate: new Date()
    };
  }

  openCreateModal() {
    this.editingId.set(null);
    this.formData.set(this.emptyForm());
    this.showModal('contract_modal');
  }

  openTerminateModal(id: number) {
    this.terminatingId.set(id);
    this.terminationDate.set(new Date());
    this.showModal('terminate_modal');
  }

  save() {
    const data = this.formData();
    if (!data.employeeId || !data.projectId || data.baseSalary == null || data.baseSalary <= 0 || !data.startDate) {
      return;
    }

    this.contractService.add({
      employeeId: data.employeeId,
      projectId: data.projectId,
      baseSalary: data.baseSalary,
      role: data.role as Contract['role'],
      startDate: data.startDate
    });

    this.closeModal('contract_modal');
  }

  terminate() {
    if (this.terminatingId() && this.terminationDate()) {
      this.contractService.terminate(this.terminatingId()!, this.terminationDate());
    }
    this.closeModal('terminate_modal');
  }

  delete(id: number) {
    if (confirm('¿Estás seguro de eliminar este contrato?')) {
      this.contractService.delete(id);
    }
  }

  private showModal(modalId: string) {
    (document.getElementById(modalId) as any)?.showModal();
  }

  closeModal(modalId: string) {
    (document.getElementById(modalId) as any)?.close();
  }

  formatCurrency(value: number): string {
    return new Intl.NumberFormat('es-GT', {
      style: 'currency',
      currency: 'QTZ',
      minimumFractionDigits: 0
    }).format(value);
  }

  formatDate(date: Date | undefined): string {
    return date ? new Date(date).toLocaleDateString('es-GT') : '-';
  }

  getEmployeeName(id: number): string {
    return this.employees().find((e: any) => e.id === id)?.name ?? 'Desconocido';
  }

  getProjectName(id: number): string {
    return this.projects().find((p: any) => p.id === id)?.name ?? 'Desconocido';
  }
}
