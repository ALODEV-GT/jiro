import { Component, inject, Input, OnChanges } from '@angular/core';
import { ErrorResponse } from '../../../../shared/models/errors';
import { CreateOrUpdateExpense, Expense, ExpenseType, User } from '../../models/home.model';
import { Page } from '../../../../shared/models/page';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ExpenseService } from '../../services/expense.service';
import { ToastService } from '../../../../shared/services/toast.service';
import { InfiniteScrollDirective } from 'ngx-infinite-scroll';
import { CommonModule } from '@angular/common';
import { UserService } from '../../services/user.service';
import { AuthStore } from '../../../auth/store/auth.store';

@Component({
  selector: 'app-expense-management',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, InfiniteScrollDirective],
  templateUrl: './expense-management.component.html',
  styleUrl: './expense-management.component.scss'
})
export class ExpenseManagementComponent {
  @Input({ required: true }) projectId!: string;

  private readonly fb = inject(FormBuilder);
  private readonly expenseService = inject(ExpenseService);
  private readonly toast = inject(ToastService);
  private readonly userService = inject(UserService);
  readonly authStore = inject(AuthStore);

  page = 0;
  isLastPage = false;

  expenses: Expense[] = [];
  users: User[] = []

  expenseTypes: ExpenseType[] = ['SALARY', 'OPERATIONAL'];

  expenseForm = this.fb.nonNullable.group({
    employeeId: [null as string | null],
    description: ['', Validators.required],
    amount: [0, [Validators.required, Validators.min(1)]],
    type: ['OPERATIONAL' as ExpenseType, Validators.required],
    expenseDate: ['', Validators.required]
  });

  ngOnInit() {
    this.expenseForm.controls.type.valueChanges.subscribe(type => {
      if (type === 'SALARY') {
        this.expenseForm.controls.employeeId.setValidators([Validators.required]);
        if (this.users.length === 0) {
          this.loadUsers();
        }
      } else {
        this.expenseForm.controls.employeeId.clearValidators();
        this.expenseForm.controls.employeeId.setValue(null);
      }

      this.expenseForm.controls.employeeId.updateValueAndValidity();
    });
  }

  loadUsers() {
    this.userService.getUsers(0, 1000).subscribe({
      next: (page: Page<User>) => {
        this.users = page.items
      },
      error: (error: ErrorResponse) => {
        this.toast.error(error.message)
      }
    })
  }

  loadExpensesPage() {
    if (this.isLastPage) return;

    this.expenseService.getExpenses(this.projectId, this.page).subscribe({
      next: (page: Page<Expense>) => {
        this.expenses = [...this.expenses, ...page.items];
        this.page++;
        this.isLastPage = page.lastPage;
      },
      error: (e: ErrorResponse) => this.toast.error(e.message)
    });
  }

  openCreateModal() {
    this.expenseForm.reset({
      employeeId: null,
      description: '',
      amount: 0,
      type: 'OPERATIONAL',
      expenseDate: ''
    });
    this.showModal('expense_modal');
  }

  save() {
    if (this.expenseForm.invalid) return;

    const body: CreateOrUpdateExpense = this.expenseForm.getRawValue();

    this.expenseService.createExpense(this.projectId, body).subscribe({
      next: expense => {
        this.expenses = [expense, ...this.expenses];
        this.closeModal('expense_modal');
      },
      error: (e: ErrorResponse) => this.toast.error(e.message)
    });
  }

  delete(expenseId: number) {
    if (!confirm('¿Eliminar gasto?')) return;

    this.expenseService.deleteExpense(this.projectId, expenseId).subscribe({
      next: () => {
        this.expenses = this.expenses.filter(e => e.id !== expenseId);
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