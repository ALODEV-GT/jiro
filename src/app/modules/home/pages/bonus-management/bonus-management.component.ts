import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { BonusService } from '../../services/bonus.service';
import { ToastService } from '../../../../shared/services/toast.service';
import { Bonus, CreateOrUpdateBonus, User } from '../../models/home.model';
import { Page } from '../../../../shared/models/page';
import { ErrorResponse } from '../../../../shared/models/errors';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-bonus-management',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './bonus-management.component.html',
  styleUrl: './bonus-management.component.scss'
})
export class BonusManagementComponent implements OnInit {

  private readonly fb = inject(FormBuilder);
  private readonly bonusService = inject(BonusService);
  private readonly userService = inject(UserService);
  private readonly toast = inject(ToastService);

  bonuses = signal<Bonus[]>([]);
  users = signal<User[]>([]);
  selectedEmployeeId = signal<number | null>(null);

  bonusForm = this.fb.nonNullable.group({
    employeeId: [null as number | null, Validators.required],
    amount: [0, [Validators.required, Validators.min(1)]],
    createdAt: ['', Validators.required],
    reason: ['']
  });

  ngOnInit() {
    this.loadUsers();
  }

  loadUsers() {
    this.userService.getUsers(0, 1000).subscribe({
      next: (page: Page<User>) => {
        this.users.set(page.items);
      },
      error: (error: ErrorResponse) => {
        this.toast.error(error.message);
      }
    });
  }

  loadBonuses(employeeId: number) {
    this.selectedEmployeeId.set(employeeId);

    this.bonusService.getBonuses(employeeId).subscribe({
      next: (page: Page<Bonus>) => {
        this.bonuses.set(page.items);
      },
      error: (error: ErrorResponse) => {
        this.toast.error(error.message);
      }
    });
  }

  openCreateModal() {
    this.bonusForm.reset({
      employeeId: this.selectedEmployeeId(),
      amount: 0,
      createdAt: new Date().toISOString().split('T')[0],
      reason: ''
    });

    this.showModal('bonus_modal');
  }

  save() {
    if (this.bonusForm.invalid) return;

    const { employeeId, amount, createdAt, reason } =
      this.bonusForm.getRawValue();

    if (!employeeId) return;

    const body: CreateOrUpdateBonus = {
      amount,
      reason,
      createdAt: new Date(createdAt).toISOString()
    };

    this.bonusService
      .createBonus(employeeId, body)
      .subscribe({
        next: bonus => {
          this.bonuses.update(b => [...b, bonus]);
          this.closeModal('bonus_modal');
        },
        error: (error: ErrorResponse) => {
          this.toast.error(error.message);
        }
      });
  }

  delete(bonusId: number) {
    const employeeId = this.selectedEmployeeId();
    if (!employeeId) return;

    if (!confirm('¿Eliminar este bono?')) return;

    this.bonusService
      .deleteBonus(employeeId, bonusId)
      .subscribe({
        next: () => {
          this.bonuses.update(b => b.filter(x => x.id !== bonusId));
        },
        error: (error: ErrorResponse) => {
          this.toast.error(error.message);
        }
      });
  }

  onEmployeeChange() {
    const employeeId = this.bonusForm.getRawValue().employeeId;
    if (employeeId) {
      this.loadBonuses(employeeId);
    } else {
      this.bonuses.set([]);
    }
  }

  getEmployeeName(id: string) {
    return this.users().find((e: User) => e.id === id)?.firstName ?? '—';
  }

  formatCurrency(value: number): string {
    return new Intl.NumberFormat('es-GT', {
      style: 'currency',
      currency: 'QTZ'
    }).format(value);
  }

  formatDate(date: string): string {
    return new Date(date).toLocaleDateString('es-GT');
  }

  private showModal(id: string) {
    (document.getElementById(id) as HTMLDialogElement)?.showModal();
  }

  closeModal(id: string) {
    (document.getElementById(id) as HTMLDialogElement)?.close();
  }
}
