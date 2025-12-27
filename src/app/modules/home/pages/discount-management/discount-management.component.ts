import { CommonModule } from '@angular/common';
import { Component, Input, OnChanges, OnInit, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { DiscountService } from '../../services/discount.service';
import { CreateOrUpdateDiscount, Discount } from '../../models/home.model';
import { Page } from '../../../../shared/models/page';
import { ToastService } from '../../../../shared/services/toast.service';
import { ErrorResponse } from '../../../../shared/models/errors';
import { InfiniteScrollDirective } from 'ngx-infinite-scroll';

@Component({
  selector: 'app-discount-management',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, InfiniteScrollDirective],
  templateUrl: './discount-management.component.html',
  styleUrl: './discount-management.component.scss'
})
export class DiscountManagementComponent implements OnChanges {
  @Input({ required: true }) employeeId!: string;

  private readonly fb = inject(FormBuilder);
  private readonly discountService = inject(DiscountService);
  private readonly toast = inject(ToastService);

  page = 0;
  isLastPage = false;

  discounts: Discount[] = [];
  editingId: number | null = null;

  discountForm = this.fb.nonNullable.group({
    reason: ['', Validators.required],
    amount: [0, [Validators.required, Validators.min(1)]]
  });

  ngOnChanges() {
    if (!this.employeeId) return;

    this.page = 0;
    this.discounts = [];
    this.isLastPage = false;

    this.loadDiscountsPage();
  }

  loadDiscountsPage() {
    if (this.isLastPage) return;

    this.discountService.getDiscounts(this.employeeId, this.page).subscribe({
      next: (page: Page<Discount>) => {
        this.discounts = [...this.discounts, ...page.items];
        this.page++;
        this.isLastPage = page.lastPage;
      },
      error: (e: ErrorResponse) => this.toast.error(e.message)
    });
  }

  openCreateModal() {
    this.editingId = null;
    this.discountForm.reset({
      reason: '',
      amount: 0
    });
    this.showModal('discount_modal');
  }

  openEditModal(discount: Discount) {
    this.editingId = discount.id;
    this.discountForm.reset({
      reason: discount.reason,
      amount: discount.amount
    });
    this.showModal('discount_modal');
  }

  save() {
    if (this.discountForm.invalid) return;

    const body: CreateOrUpdateDiscount = this.discountForm.getRawValue();

    const request$ = this.editingId
      ? this.discountService.updateDiscount(this.employeeId, this.editingId, body)
      : this.discountService.createDiscount(this.employeeId, body);

    request$.subscribe({
      next: discount => {
        if (this.editingId) {
          this.discounts = this.discounts.map(d =>
            d.id === discount.id ? discount : d
          );
        } else {
          this.discounts = [discount, ...this.discounts];
        }
        this.closeModal('discount_modal');
      },
      error: (e: ErrorResponse) => this.toast.error(e.message)
    });
  }

  delete(discountId: number) {
    if (!confirm('¿Eliminar descuento?')) return;

    this.discountService.deleteDiscount(this.employeeId, discountId).subscribe({
      next: () => {
        this.discounts = this.discounts.filter(d => d.id !== discountId);
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