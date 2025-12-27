import { Component, inject, OnInit } from '@angular/core';
import { RolService } from '../../services/rol.service';
import { Rol } from '../../models/home.model';
import { Page } from '../../../../shared/models/page';
import { ErrorResponse } from '../../../../shared/models/errors';
import { ToastService } from '../../../../shared/services/toast.service';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { CommonModule } from '@angular/common';
import { ColorService } from '../../services/color.service';

@Component({
  selector: 'app-rol-management',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './rol-management.component.html',
  styleUrl: './rol-management.component.scss'
})
export class RolManagementComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly rolService = inject(RolService)
  private readonly toast = inject(ToastService)
  public colorService = inject(ColorService)

  isEdit = false;
  loading = false;
  private isLastPage = false;
  private page = 0
  formError = ''
  roles: Rol[] = []
  private editingId: number | null = null;

  rolForm = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(40)]],
    description: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(250)]],
    color: ['', [Validators.required]]
  });

  ngOnInit(): void {
    this.getRolPage()
  }

  getRolPage() {
    if (!this.isLastPage) {
      this.rolService.getRoles('id', 'DESC', this.page).subscribe({
        next: (page: Page<Rol>) => {
          this.roles = [...this.roles, ...page.items]
          this.page += 1
          this.isLastPage = page.lastPage
        },
        error: (error: ErrorResponse) => {
          this.toast.error(error.message)
        }
      })
    }
  }

  openCreateModal() {
    this.isEdit = false;
    this.editingId = null;
    this.formError = '';
    this.loading = false;
    this.rolForm.get('name')?.enable()
    this.showModal();
  }

  openEditModal(rol: Rol) {
    this.isEdit = true;
    this.editingId = rol.id;
    this.formError = '';
    this.loading = false;

    this.rolService.getRol(rol.id).subscribe({
      next: (rol: Rol) => {
        this.rolForm.patchValue({
          name: rol.name ?? '',
          description: rol.description ?? '',
          color: rol.color ?? '',
        });
        this.rolForm.get('name')?.disable()
        this.showModal();
      },
      error: (error: ErrorResponse) => {
        this.toast.error(error.message)
      }
    })


  }

  save() {
    this.formError = '';

    if (this.rolForm.invalid) {
      this.rolForm.markAllAsTouched();
      return;
    }

    this.loading = true;

    const payload = this.rolForm.getRawValue() as Partial<Rol>;

    let req$: Observable<Partial<Rol>>;

    if (this.isEdit && this.editingId != null) {
      req$ = this.rolService.updateRol(this.editingId, payload);
    }
    else {
      req$ = this.rolService.createRol(payload);
    }

    req$.subscribe({
      next: () => {
        this.toast.success('Rol actualizado');
        this.resetPagination()
        this.closeModal();
      },
      error: (error: ErrorResponse) => {
        this.formError = error.message || 'Ocurrió un error';
        this.toast.error(this.formError);
      },
      complete: () => {
        this.loading = false;
      }
    });
  }

  resetPagination() {
    this.roles = []
    this.page = 0
    this.isLastPage = false
    this.getRolPage()
  }

  deleteRol(rol: Rol) {
    this.rolService.deleteRol(rol.id).subscribe({
      next: () => {
        this.toast.info("Se elimino el rol")
      },
      error: (error: ErrorResponse) => {
        this.toast.info(error.message)
      }
    })
  }

  showModal() {
    (document.getElementById('role_modal') as any)?.showModal();
  }

  closeModal() {
    (document.getElementById('role_modal') as any)?.close();
  }

  confirmDelete() {
    alert('No se puede eliminar roles del sistema base');
  }
}