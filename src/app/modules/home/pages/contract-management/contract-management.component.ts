import { CommonModule } from '@angular/common';
import { Component, inject, Input, OnChanges, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Contract, CreateOrUpdateContract, Rol } from '../../models/home.model';
import { ContractService } from '../../services/contract.service';
import { RolService } from '../../services/rol.service';
import { Page } from '../../../../shared/models/page';
import { ErrorResponse } from '../../../../shared/models/errors';
import { ToastService } from '../../../../shared/services/toast.service';
import { InfiniteScrollDirective } from 'ngx-infinite-scroll';

@Component({
  selector: 'app-contract-management',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, InfiniteScrollDirective],
  templateUrl: './contract-management.component.html'
})
export class ContractManagementComponent implements OnChanges {

  @Input({ required: true }) employeeId!: string;

  private readonly fb = inject(FormBuilder);
  private readonly contractService = inject(ContractService);
  private readonly rolService = inject(RolService);
  private readonly toast = inject(ToastService);

  page = 0;
  isLastPage = false;

  contracts: Contract[] = [];
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
    if (!this.employeeId) return;

    this.page = 0;
    this.contracts = [];
    this.isLastPage = false;

    this.loadRoles();
    this.loadContractsPage();
  }

  loadRoles() {
    this.rolService.getRoles('name', 'ASC', 0, 100).subscribe({
      next: (page: Page<Rol>) => this.roles.set(page.items),
      error: (e: ErrorResponse) => this.toast.error(e.message)
    });
  }

  loadContractsPage() {
    if (this.isLastPage) return;

    this.contractService
      .getUserContracts(this.employeeId, this.page)
      .subscribe({
        next: (page: Page<Contract>) => {
          this.contracts = [...this.contracts, ...page.items];
          this.page++;
          this.isLastPage = page.lastPage;
        },
        error: (e: ErrorResponse) => this.toast.error(e.message)
      });
  }

  resetPagination() {
    this.contracts = []
    this.page = 0
    this.isLastPage = false
    this.loadContractsPage()
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
        this.contracts = [contract, ...this.contracts];
        this.closeModal('contract_modal');
      },
      error: (e: ErrorResponse) => this.toast.error(e.message)
    });
  }

  openTerminateModal(contractId: number) {
    this.terminatingId.set(contractId);
    this.terminateForm.reset();
    this.showModal('terminate_modal');
  }

  terminate() {
    const id = this.terminatingId();
    if (!id || this.terminateForm.invalid) return;

    const contract = this.contracts.find(c => c.id === id);
    if (!contract) return;

    this.contractService.updateContract(
      this.employeeId,
      contract.id,
      {
        role: contract.role,
        baseSalary: contract.baseSalary,
        startDate: contract.startDate,
        endDate: this.terminateForm.getRawValue().endDate,
        status: 'INACTIVE'
      }
    ).subscribe({
      next: updated => {
        this.contracts = this.contracts.map(c =>
          c.id === updated.id ? updated : c
        );
        this.closeModal('terminate_modal');
      },
      error: (e: ErrorResponse) => this.toast.error(e.message)
    });
  }

  delete(contractId: number) {
    if (!confirm('¿Eliminar contrato?')) return;

    this.contractService.deleteContract(this.employeeId, contractId).subscribe({
      next: () => {
        this.contracts = this.contracts.filter(c => c.id !== contractId);
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
