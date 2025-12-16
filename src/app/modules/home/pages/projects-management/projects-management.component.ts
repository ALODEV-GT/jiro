import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Project } from '../../models/home.model';
import { ProjectManagementService } from '../../services/project-management.service';
import { ErrorResponse } from '../../../../shared/models/errors';
import { ToastService } from '../../../../shared/services/toast.service';
import { Page } from '../../../../shared/models/page';
import { InfiniteScrollDirective } from 'ngx-infinite-scroll';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-projects-management',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, InfiniteScrollDirective],
  templateUrl: './projects-management.component.html',
  styleUrl: './projects-management.component.scss'
})
export class ProjectsManagementComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly projectManagementService = inject(ProjectManagementService);
  private readonly toast = inject(ToastService);

  isEdit = false;
  loading = false;
  private isLastPage = false;
  private page = 1
  formError = '';
  projects: Project[] = [];
  private editingId: string | null = null;

  projectForm = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(40)]],
    description: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(250)]],
    client: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(25)]],
    monthlyIncome: [0, [Validators.required, Validators.min(1)]],
    active: [false],
  });

  ngOnInit(): void {
    this.getProjectPage()
  }

  getProjectPage() {
    if (!this.isLastPage) {
      this.projectManagementService.getAll(this.page).subscribe({
        next: (page: Page<Project>) => {
          this.projects = [...this.projects, ...page.items]
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

    this.projectForm.enable({ emitEvent: false });

    this.projectForm.reset({
      name: '',
      description: '',
      client: '',
      monthlyIncome: 0,
      active: true,
    });

    this.active?.disable(); 
    this.monthlyIncome?.enable();

    this.showModal();
  }

  openEditModal(project: Project) {
    this.isEdit = true;
    this.editingId = project.id;
    this.formError = '';
    this.loading = false;

    this.projectForm.patchValue({
      name: project.name ?? '',
      description: project.description ?? '',
      client: project.client ?? '',
      monthlyIncome: project.monthlyIncome ?? 0,
      active: project.active ?? true,
    });

    this.monthlyIncome?.disable();

    if (project.active === false) {
      this.projectForm.disable({ emitEvent: false });
    } else {
      this.projectForm.enable({ emitEvent: false });
      this.monthlyIncome?.disable();
    }

    this.showModal();
  }


  save() {
    this.formError = '';

    if (this.projectForm.invalid) {
      this.projectForm.markAllAsTouched();
      return;
    }

    this.loading = true;

    const payload = this.projectForm.getRawValue() as Partial<Project>;
    const isClosingProject = this.isEdit && payload.active === false;

    let req$: Observable<Partial<Project>>;

    if (this.isEdit && this.editingId != null) {
      if (isClosingProject) {
        req$ = this.closeProject(this.editingId);
      }
      else {
        req$ = this.projectManagementService.update(this.editingId, payload);
      }
    }
    else {
      req$ = this.projectManagementService.add(payload);
    }

    req$.subscribe({
      next: () => {
        let message = 'Se ha creado el proyecto';

        if (this.isEdit) {
          message = isClosingProject
            ? 'Proyecto cerrado correctamente'
            : 'Proyecto actualizado';
        }

        this.toast.success(message);
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

  delete(id: string) {
    this.projectManagementService.delete(id).subscribe({
      next: () => {
        this.toast.success('Se ha eliminado el proyecto');
      },
      error: () => {
        this.toast.error('Ocurrion un error al eliminar el proyecto');
      }
    })
  }

  closeProject(id: string) {
    return this.projectManagementService.closeProject(id);
  }


  get name() { return this.projectForm.get('name'); }
  get description() { return this.projectForm.get('description'); }
  get client() { return this.projectForm.get('client'); }
  get monthlyIncome() { return this.projectForm.get('monthlyIncome'); }
  get active() { return this.projectForm.get('active'); }

  private showModal() {
    (document.getElementById('project_modal') as any)?.showModal();
  }

  closeModal() {
    (document.getElementById('project_modal') as any)?.close();
    this.loading = false;
  }
}
