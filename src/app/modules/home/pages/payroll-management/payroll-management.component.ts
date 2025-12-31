import { Component, inject, Input } from '@angular/core';
import { ErrorResponse } from '../../../../shared/models/errors';
import { CreateOrUpdatePayroll, Payroll } from '../../models/home.model';
import { Page } from '../../../../shared/models/page';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { PayrollService } from '../../services/payroll.service';
import { ToastService } from '../../../../shared/services/toast.service';
import { CommonModule } from '@angular/common';
import { InfiniteScrollDirective } from 'ngx-infinite-scroll';
import { AuthStore } from '../../../auth/store/auth.store';

@Component({
  selector: 'app-payroll-management',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, InfiniteScrollDirective],
  templateUrl: './payroll-management.component.html',
  styleUrl: './payroll-management.component.scss'
})
export class PayrollManagementComponent {
  @Input({ required: true }) employeeId!: string;

  private readonly fb = inject(FormBuilder);
  private readonly payrollService = inject(PayrollService);
  private readonly toast = inject(ToastService);
  readonly authStore = inject(AuthStore);

  page = 0;
  isLastPage = false;

  payrolls: Payroll[] = [];
  editingId: number | null = null;

  payrollForm = this.fb.nonNullable.group({
    baseSalary: [0, [Validators.required, Validators.min(0)]],
    totalBonuses: [0, [Validators.required, Validators.min(0)]],
    totalDiscounts: [0, [Validators.required, Validators.min(0)]],
    paymentDate: ['', Validators.required],
    fromDate: ['', Validators.required],
    toDate: ['', Validators.required]
  });

  ngOnChanges() {
    if (!this.employeeId) return;

    this.page = 0;
    this.payrolls = [];
    this.isLastPage = false;

    this.loadPayrollsPage();
  }

  loadPayrollsPage() {
    if (this.isLastPage) return;

    this.payrollService.getPayrolls(this.employeeId, this.page).subscribe({
      next: (page: Page<Payroll>) => {
        this.payrolls = [...this.payrolls, ...page.items];
        this.page++;
        this.isLastPage = page.lastPage;
      },
      error: (e: ErrorResponse) => this.toast.error(e.message)
    });
  }

  openCreateModal() {
    this.editingId = null;
    this.payrollForm.reset({
      baseSalary: 0,
      totalBonuses: 0,
      totalDiscounts: 0,
      paymentDate: '',
      fromDate: '',
      toDate: ''
    });
    this.showModal('payroll_modal');
  }

  openEditModal(payroll: Payroll) {
    this.editingId = payroll.id;
    this.payrollForm.reset({
      baseSalary: payroll.baseSalary,
      totalBonuses: payroll.totalBonuses,
      totalDiscounts: payroll.totalDiscounts,
      paymentDate: payroll.paymentDate,
      fromDate: payroll.fromDate,
      toDate: payroll.toDate
    });
    this.showModal('payroll_modal');
  }

  save() {
    if (this.payrollForm.invalid) return;

    const body: CreateOrUpdatePayroll = this.payrollForm.getRawValue();

    const request$ = this.editingId
      ? this.payrollService.updatePayroll(this.employeeId, this.editingId, body)
      : this.payrollService.createPayroll(this.employeeId, body);

    request$.subscribe({
      next: payroll => {
        if (this.editingId) {
          this.payrolls = this.payrolls.map(p =>
            p.id === payroll.id ? payroll : p
          );
        } else {
          this.payrolls = [payroll, ...this.payrolls];
        }
        this.closeModal('payroll_modal');
      },
      error: (e: ErrorResponse) => this.toast.error(e.message)
    });
  }

  delete(payrollId: number) {
    if (!confirm('¿Eliminar planilla?')) return;

    this.payrollService.deletePayroll(this.employeeId, payrollId).subscribe({
      next: () => {
        this.payrolls = this.payrolls.filter(p => p.id !== payrollId);
      },
      error: (e: ErrorResponse) => this.toast.error(e.message)
    });
  }

  formatCurrency(value: number): string {
    return new Intl.NumberFormat('es-GT', {
      style: 'currency',
      currency: 'QTZ'
    }).format(value);
  }

  private showModal(id: string) {
    (document.getElementById(id) as HTMLDialogElement)?.showModal();
  }

  closeModal(id: string) {
    (document.getElementById(id) as HTMLDialogElement)?.close();
  }
}