import { CommonModule } from '@angular/common';
import { Component, inject, Input, OnChanges, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Contract, CreateOrUpdateContract, Rol } from '../../models/home.model';
import { ContractService } from '../../services/contract.service';
import { RolService } from '../../services/rol.service';
import { Page } from '../../../../shared/models/page';
import { ErrorResponse } from '../../../../shared/models/errors';
import { ToastService } from '../../../../shared/services/toast.service';

@Component({
  selector: 'app-contract-management',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './contract-management.component.html'
})
export class ContractManagementComponent implements OnChanges {
  @Input({ required: true }) employeeId!: string;

  private fb = inject(FormBuilder);
  private contractService = inject(ContractService);
  private rolService = inject(RolService);
  private toast = inject(ToastService);

  contracts = signal<Contract[]>([]);
  roles = signal<Rol[]>([]);
  terminatingId = signal<number | null>(null);

  contractForm = this.fb.nonNullable.group({
    role: [null as string | null, Validators.required],
    baseSalary: [0, [Validators.required, Validators.min(1)]],
    startDate: ['', Validators.required]
  });

  terminateForm = this.fb.nonNullable.group({
    endDate: ['', Validators.required]
  });

  ngOnChanges() {
    if (this.employeeId) {
      this.loadCurrentContract();
      this.loadRoles();
    }
  }

  loadRoles() {
    this.rolService.getRoles('name', 'ASC', 0, 100).subscribe({
      next: (page: Page<Rol>) => this.roles.set(page.items),
      error: (e: ErrorResponse) => this.toast.error(e.message)
    });
  }

  loadCurrentContract() {
    this.contractService.getCurrentContract(this.employeeId).subscribe({
      next: c => this.contracts.set(c ? [c] : []),
      error: () => this.contracts.set([])
    });
  }

  openCreateModal() {
    this.contractForm.reset({
      role: null,
      baseSalary: 0,
      startDate: ''
    });
    this.showModal('contract_modal');
  }

  save() {
    if (this.contractForm.invalid) return;

    const { role, baseSalary, startDate } = this.contractForm.getRawValue();

    if (!role) {
      this.toast.error('Debe seleccionar un rol');
      return;
    }

    const body: CreateOrUpdateContract = {
      role,
      baseSalary,
      startDate,
      endDate: null,
      status: 'ACTIVE'
    };

    this.contractService.createContract(this.employeeId, body).subscribe({
      next: contract => {
        this.contracts.set([contract]);
        this.closeModal('contract_modal');
      },
      error: error => this.toast.error(error.message)
    });
  }


  openTerminateModal(contractId: number) {
    this.terminatingId.set(contractId);
    this.terminateForm.reset();
    this.showModal('terminate_modal');
  }

  terminate() {
    if (!this.terminatingId()) return;

    const contract = this.contracts()[0];

    this.contractService.updateContract(
      this.employeeId,
      contract.id,
      {
        ...contract,
        endDate: this.terminateForm.value.endDate!,
        status: 'INACTIVE'
      }
    ).subscribe({
      next: updated => {
        this.contracts.set([updated]);
        this.closeModal('terminate_modal');
      },
      error: (e: ErrorResponse) => this.toast.error(e.message)
    });
  }

  delete(contractId: number) {
    if (!confirm('¿Eliminar contrato?')) return;

    this.contractService.deleteContract(this.employeeId, contractId).subscribe({
      next: () => this.contracts.set([]),
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
