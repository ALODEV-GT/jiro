import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Contract, CreateOrUpdateContract, Rol, User } from '../../models/home.model';
import { ContractService } from '../../services/contract.service';
import { RolService } from '../../services/rol.service';
import { Page } from '../../../../shared/models/page';
import { ErrorResponse } from '../../../../shared/models/errors';
import { ToastService } from '../../../../shared/services/toast.service';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-employee-management',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './employee-management.component.html'
})
export class EmployeeManagementComponent implements OnInit {

  private readonly fb = inject(FormBuilder)
  private readonly contractService = inject(ContractService)
  private readonly rolService = inject(RolService)
  private readonly toast = inject(ToastService)
  private readonly userService = inject(UserService)

  contracts = signal<Contract[]>([]);
  roles = signal<Rol[]>([])
  users = signal<User[]>([])
  selectedEmployeeId = signal<number>(1);

  terminatingId = signal<number | null>(null);

  contractForm = this.fb.nonNullable.group({
    employeeId: [null as number | null, Validators.required],
    role: [null as string | null, Validators.required],
    baseSalary: [0, [Validators.required, Validators.min(1)]],
    startDate: ['', Validators.required]
  });

  terminateForm = this.fb.nonNullable.group({
    endDate: ['', Validators.required]
  });

  ngOnInit() {
    this.loadCurrentContract();
    this.loadRoles();
    this.loadUsers();
  }

  loadRoles() {
    this.rolService.getRoles('name', 'DESC', 0, 100).subscribe({
      next: (page: Page<Rol>) => {
        this.roles.set(page.items)
      },
      error: (error: ErrorResponse) => {
        this.toast.error(error.message)
      }
    })
  }

  loadUsers() {
    this.userService.getUsers(0, 1000).subscribe({
      next: (page: Page<User>) => {
        this.users.set(page.items)
      },
      error: (error: ErrorResponse) => {
        this.toast.error(error.message)
      }
    })
  }

  loadCurrentContract() {
    this.contractService
      .getCurrentContract(this.selectedEmployeeId())
      .subscribe({
        next: contract => this.contracts.set([contract]),
        error: () => this.contracts.set([])
      });
  }

  openCreateModal() {
    this.loadUsers();

    this.contractForm.reset({
      employeeId: null,
      role: null,
      baseSalary: 0,
      startDate: ''
    });

    this.showModal('contract_modal');
  }


  save() {
    if (this.contractForm.invalid) return;

    const { employeeId, role, baseSalary, startDate } =
      this.contractForm.getRawValue();

    if (!employeeId || !role) return;

    const body: CreateOrUpdateContract = {
      role,
      baseSalary,
      startDate,
      endDate: null,
      status: 'ACTIVE'
    };

    this.contractService
      .createContract(employeeId, body)
      .subscribe(contract => {
        this.contracts.set([contract]);
        this.closeModal('contract_modal');
      });
  }

  openTerminateModal(contractId: number) {
    this.terminatingId.set(contractId);
    this.terminateForm.reset({ endDate: '' });
    this.showModal('terminate_modal');
  }

  terminate() {
    if (this.terminateForm.invalid || !this.terminatingId()) return;

    const contract = this.contracts().find(c => c.id === this.terminatingId());
    if (!contract) return;

    this.contractService.updateContract(
      this.selectedEmployeeId(),
      contract.id,
      {
        baseSalary: contract.baseSalary,
        role: contract.role,
        startDate: contract.startDate,
        endDate: this.terminateForm.getRawValue().endDate,
        status: 'INACTIVE'
      }
    ).subscribe(updated => {
      this.contracts.set([updated]);
      this.closeModal('terminate_modal');
    });
  }

  delete(contractId: number) {
    if (!confirm('¿Eliminar contrato?')) return;

    this.contractService
      .deleteContract(this.selectedEmployeeId(), contractId)
      .subscribe(() => this.contracts.set([]));
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
