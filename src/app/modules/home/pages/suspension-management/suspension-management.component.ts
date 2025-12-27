import { Component, inject, Input, OnChanges } from '@angular/core';
import { ErrorResponse } from '../../../../shared/models/errors';
import { CreateOrUpdateSuspension, Suspension } from '../../models/home.model';
import { Page } from '../../../../shared/models/page';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { SuspensionService } from '../../services/suspension.service';
import { ToastService } from '../../../../shared/services/toast.service';
import { CommonModule } from '@angular/common';
import { InfiniteScrollDirective } from 'ngx-infinite-scroll';

@Component({
  selector: 'app-suspension-management',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, InfiniteScrollDirective],
  templateUrl: './suspension-management.component.html',
  styleUrl: './suspension-management.component.scss'
})
export class SuspensionManagementComponent implements OnChanges {

  @Input({ required: true }) employeeId!: string;

  private readonly fb = inject(FormBuilder);
  private readonly suspensionService = inject(SuspensionService);
  private readonly toast = inject(ToastService);

  page = 0;
  isLastPage = false;

  suspensions: Suspension[] = [];
  editingId: number | null = null;

  suspensionForm = this.fb.nonNullable.group({
    amount: [0, [Validators.required, Validators.min(1)]],
    reason: ['', Validators.required],
    startDate: ['', Validators.required],
    endDate: ['', Validators.required]
  });

  ngOnChanges() {
    if (!this.employeeId) return;

    this.page = 0;
    this.suspensions = [];
    this.isLastPage = false;

    this.loadSuspensionsPage();
  }

  loadSuspensionsPage() {
    if (this.isLastPage) return;

    this.suspensionService
      .getSuspensions(this.employeeId, this.page)
      .subscribe({
        next: (page: Page<Suspension>) => {
          this.suspensions = [...this.suspensions, ...page.items];
          this.page++;
          this.isLastPage = page.lastPage;
        },
        error: (e: ErrorResponse) => this.toast.error(e.message)
      });
  }

  openCreateModal() {
    this.editingId = null;
    this.suspensionForm.reset({
      amount: 0,
      reason: '',
      startDate: '',
      endDate: ''
    });
    this.showModal('suspension_modal');
  }

  openEditModal(suspension: Suspension) {
    this.editingId = suspension.id;
    this.suspensionForm.reset({
      amount: suspension.amount,
      reason: suspension.reason,
      startDate: suspension.startDate,
      endDate: suspension.endDate
    });
    this.showModal('suspension_modal');
  }

  save() {
    if (this.suspensionForm.invalid) return;

    const body: CreateOrUpdateSuspension = {
      ...this.suspensionForm.getRawValue(),
      createdAt: new Date().toISOString()
    };

    if (this.editingId) {
      this.suspensionService
        .updateSuspension(this.employeeId, this.editingId, body)
        .subscribe({
          next: updated => {
            this.suspensions = this.suspensions.map(s =>
              s.id === updated.id ? updated : s
            );
            this.closeModal('suspension_modal');
          },
          error: (e: ErrorResponse) => this.toast.error(e.message)
        });
      return;
    }

    this.suspensionService
      .createSuspension(this.employeeId, body)
      .subscribe({
        next: suspension => {
          this.suspensions = [suspension, ...this.suspensions];
          this.closeModal('suspension_modal');
        },
        error: (e: ErrorResponse) => this.toast.error(e.message)
      });
  }

  delete(suspensionId: number) {
    if (!confirm('¿Eliminar suspensión?')) return;

    this.suspensionService
      .deleteSuspension(this.employeeId, suspensionId)
      .subscribe({
        next: () => {
          this.suspensions = this.suspensions.filter(s => s.id !== suspensionId);
        },
        error: (e: ErrorResponse) => this.toast.error(e.message)
      });
  }

  private showModal(id: string) {
    (document.getElementById(id) as HTMLDialogElement)?.showModal();
  }

  closeModal(id: string) {
    (document.getElementById(id) as HTMLDialogElement)?.close();
  }
}