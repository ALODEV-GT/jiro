import { CommonModule } from '@angular/common';
import { Component, OnInit, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { DiscountService } from '../../services/discount.service';
import { ProjectManagementService } from '../../services/project-management.service';
import { Discount } from '../../models/home.model';
import { Page } from '../../../../shared/models/page';
import { ToastService } from '../../../../shared/services/toast.service';
import { ErrorResponse } from '../../../../shared/models/errors';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-discount-management',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './discount-management.component.html',
  styleUrl: './discount-management.component.scss'
})
export class DiscountManagementComponent implements OnInit {

  private readonly fb = inject(FormBuilder);
  private readonly discountService = inject(DiscountService);
  private readonly userService = inject(UserService);
  private readonly projectService = inject(ProjectManagementService);
  private readonly toast = inject(ToastService);

  deductions = signal<Discount[]>([]);
  employees = signal<any[]>([]);
  projects = signal<any[]>([]);

  /** Empleado seleccionado para listar descuentos */
  selectedEmployeeId = signal<number | null>(null);

  form = this.fb.nonNullable.group({
    employeeId: [null as number | null, Validators.required],
    projectId: [null as number | null, Validators.required],
    amount: [0, [Validators.required, Validators.min(1)]],
    date: ['', Validators.required],
    reason: ['']
  });

  ngOnInit() {
    this.loadEmployees();
    this.loadProjects();
  }

  /* ===================== LOADERS ===================== */

  loadEmployees() {
    this.userService.getUsers(0, 1000).subscribe({
      next: (page: Page<any>) => {
        this.employees.set(page.items);
      },
      error: (error: ErrorResponse) => {
        this.toast.error(error.message);
      }
    });
  }

  loadProjects() {
    this.projectService.getAll(0, 1000).subscribe({
      next: page => {
        this.projects.set(page.items);
      },
      error: (error: ErrorResponse) => {
        this.toast.error(error.message);
      }
    });
  }

  loadDiscounts(employeeId: number) {
    this.selectedEmployeeId.set(employeeId);

    this.discountService.getDiscounts(employeeId).subscribe({
      next: (page: Page<Discount>) => {
        this.deductions.set(page.items);
      },
      error: (error: ErrorResponse) => {
        this.deductions.set([]);
        this.toast.error(error.message);
      }
    });
  }

  /* ===================== ACTIONS ===================== */

  openCreateModal() {
    this.form.reset({
      employeeId: null,
      projectId: null,
      amount: 0,
      date: new Date().toISOString().split('T')[0],
      reason: ''
    });

    this.showModal('discount_modal');
  }

  save() {
    if (this.form.invalid) return;

    const { employeeId, amount, date, reason } = this.form.getRawValue();

    if (!employeeId) return;

    this.discountService.createDiscount(employeeId, {
      amount,
      reason: reason ?? '',
      createdAt: date
    }).subscribe({
      next: discount => {
        this.deductions.update(list => [discount, ...list]);
        this.closeModal();
      },
      error: (error: ErrorResponse) => {
        this.toast.error(error.message);
      }
    });
  }

  delete(discountId: number) {
    const employeeId = this.selectedEmployeeId();
    if (!employeeId) return;

    if (!confirm('¿Eliminar este descuento?')) return;

    this.discountService.deleteDiscount(employeeId, discountId).subscribe({
      next: () => {
        this.deductions.update(list =>
          list.filter(d => d.id !== discountId)
        );
      },
      error: (error: ErrorResponse) => {
        this.toast.error(error.message);
      }
    });
  }

  /* ===================== HELPERS ===================== */

  getEmployeeName(id: number) {
    return this.employees().find(e => e.id === id)?.name ?? '—';
  }

  getProjectName(id: number) {
    return this.projects().find(p => p.id === id)?.name ?? '—';
  }

  formatCurrency(value: number) {
    return new Intl.NumberFormat('es-PE', {
      style: 'currency',
      currency: 'PEN'
    }).format(value);
  }

  formatDate(date: string) {
    return new Date(date).toLocaleDateString('es-PE');
  }

  closeModal() {
    (document.getElementById('discount_modal') as HTMLDialogElement)?.close();
  }

  private showModal(id: string) {
    (document.getElementById(id) as HTMLDialogElement)?.showModal();
  }
}
