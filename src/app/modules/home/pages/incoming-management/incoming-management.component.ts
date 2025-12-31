import { Component, inject, Input, OnChanges, SimpleChanges } from '@angular/core';
import { IncomeService } from '../../services/income.service';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { CreateOrUpdateIncome, Income } from '../../models/home.model';
import { Page } from '../../../../shared/models/page';
import { ErrorResponse } from '../../../../shared/models/errors';
import { ToastService } from '../../../../shared/services/toast.service';
import { CommonModule } from '@angular/common';
import { InfiniteScrollDirective } from 'ngx-infinite-scroll';
import { AuthStore } from '../../../auth/store/auth.store';

@Component({
  selector: 'app-incoming-management',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, InfiniteScrollDirective],
  templateUrl: './incoming-management.component.html',
  styleUrl: './incoming-management.component.scss'
})
export class IncomingManagementComponent {

  @Input({ required: true }) projectId!: string;

  private readonly fb = inject(FormBuilder);
  private readonly incomeService = inject(IncomeService);
  private readonly toast = inject(ToastService);
  readonly authStore = inject(AuthStore);

  page = 0;
  isLastPage = false;

  incomes: Income[] = [];
  editingId: number | null = null;

  incomeForm = this.fb.nonNullable.group({
    amount: [0, [Validators.required, Validators.min(1)]],
    type: ['FIXED_PRICE', Validators.required],
    description: ['', Validators.required],
    billingDate: ['', Validators.required]
  });

  loadIncomesPage() {
    if (this.isLastPage) return;

    this.incomeService.getIncomes(this.projectId, this.page).subscribe({
      next: (page: Page<Income>) => {
        this.incomes = [...this.incomes, ...page.items];
        this.page++;
        this.isLastPage = page.lastPage;
      },
      error: (e: ErrorResponse) => this.toast.error(e.message)
    });
  }

  openCreateModal() {
    this.editingId = null;
    this.incomeForm.reset({
      amount: 0,
      type: 'FIXED_PRICE',
      description: '',
      billingDate: ''
    });
    this.showModal('income_modal');
  }

  openEditModal(income: Income) {
    this.editingId = income.id;
    this.incomeForm.reset({
      amount: income.amount,
      type: income.type,
      description: income.description,
      billingDate: income.billingDate
    });
    this.showModal('income_modal');
  }

  save() {
    if (this.incomeForm.invalid) return;

    const body: CreateOrUpdateIncome = this.incomeForm.getRawValue();

    const request$ = this.editingId
      ? this.incomeService.updateIncome(this.projectId, this.editingId, body)
      : this.incomeService.createIncome(this.projectId, body);

    request$.subscribe({
      next: income => {
        if (this.editingId) {
          this.incomes = this.incomes.map(i =>
            i.id === income.id ? income : i
          );
        } else {
          this.incomes = [income, ...this.incomes];
        }
        this.closeModal('income_modal');
      },
      error: (e: ErrorResponse) => this.toast.error(e.message)
    });
  }

  delete(incomeId: number) {
    if (!confirm('¿Eliminar ingreso?')) return;

    this.incomeService.deleteIncome(this.projectId, incomeId).subscribe({
      next: () => {
        this.incomes = this.incomes.filter(i => i.id !== incomeId);
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