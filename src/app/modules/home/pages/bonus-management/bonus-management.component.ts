import { CommonModule } from '@angular/common';
import { Component, inject, Input, OnChanges, OnInit, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { BonusService } from '../../services/bonus.service';
import { ToastService } from '../../../../shared/services/toast.service';
import { Bonus, CreateOrUpdateBonus, User } from '../../models/home.model';
import { Page } from '../../../../shared/models/page';
import { ErrorResponse } from '../../../../shared/models/errors';
import { UserService } from '../../services/user.service';
import { InfiniteScrollDirective } from 'ngx-infinite-scroll';
import { AuthStore } from '../../../auth/store/auth.store';

@Component({
  selector: 'app-bonus-management',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, InfiniteScrollDirective],
  templateUrl: './bonus-management.component.html',
  styleUrl: './bonus-management.component.scss'
})
export class BonusManagementComponent implements OnChanges {

  @Input({ required: true }) employeeId!: string;

  private readonly fb = inject(FormBuilder);
  private readonly bonusService = inject(BonusService);
  private readonly toast = inject(ToastService);
  readonly authStore = inject(AuthStore);
  

  bonuses: Bonus[] = [];
  page = 0;
  isLastPage = false;

  editingId: number | null = null;

  bonusForm = this.fb.nonNullable.group({
    amount: [0, [Validators.required, Validators.min(1)]],
    reason: ['', Validators.required]
  });

  ngOnChanges() {
    if (!this.employeeId) return;

    this.page = 0;
    this.bonuses = [];
    this.isLastPage = false;

    this.loadBonuses();
  }

  loadBonuses() {
    if (this.isLastPage) return;

    this.bonusService.getBonuses(this.employeeId, this.page).subscribe({
      next: (page: Page<Bonus>) => {
        this.bonuses = [...this.bonuses, ...page.items];
        this.page++;
        this.isLastPage = page.lastPage;
      },
      error: (e: ErrorResponse) => this.toast.error(e.message)
    });
  }

  openCreateModal() {
    this.editingId = null;
    this.bonusForm.reset({ amount: 0, reason: '' });
    this.showModal('bonus_modal');
  }

  openEditModal(bonus: Bonus) {
    this.editingId = bonus.id;
    this.bonusForm.reset({
      amount: bonus.amount,
      reason: bonus.reason
    });
    this.showModal('bonus_modal');
  }

  save() {
    if (this.bonusForm.invalid) return;

    const body: CreateOrUpdateBonus = this.bonusForm.getRawValue();

    const request$ = this.editingId
      ? this.bonusService.updateBonus(this.employeeId, this.editingId, body)
      : this.bonusService.createBonus(this.employeeId, body);

    request$.subscribe({
      next: bonus => {
        if (this.editingId) {
          this.bonuses = this.bonuses.map(b =>
            b.id === bonus.id ? bonus : b
          );
        } else {
          this.bonuses = [bonus, ...this.bonuses];
        }
        this.closeModal('bonus_modal');
      },
      error: (e: ErrorResponse) => this.toast.error(e.message)
    });
  }

  delete(bonusId: number) {
    if (!confirm('¿Eliminar bono?')) return;

    this.bonusService.deleteBonus(this.employeeId, bonusId).subscribe({
      next: () => {
        this.bonuses = this.bonuses.filter(b => b.id !== bonusId);
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