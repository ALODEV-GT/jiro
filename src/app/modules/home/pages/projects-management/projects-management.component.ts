import { Component, inject, OnInit, signal } from '@angular/core';
import { Project } from '../../models/home.model';
import { ProjectManagementService } from '../../services/project-management.service';
import { FormBuilder, FormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ErrorResponse } from '../../../../shared/models/errors';
import { ToastService } from '../../../../shared/services/toast.service';

@Component({
  selector: 'app-projects-management',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './projects-management.component.html',
  styleUrl: './projects-management.component.scss'
})
export class ProjectsManagementComponent implements OnInit {
  private readonly fb = inject(FormBuilder)
  private readonly projectManagementService = inject(ProjectManagementService)
  private readonly toast = inject(ToastService);

  isEdit: boolean = false
  projects: Project[] = []

  projectForm = this.fb.group({
    name: ["", [Validators.required, Validators.minLength(3), Validators.maxLength(40)]],
    description: ["", [Validators.required, Validators.minLength(3), Validators.maxLength(250)]],
    monthlyIncome: [0, [Validators.required, Validators.min(1)]],
    active: [true, []]
  })

  ngOnInit(): void {

  }

  openCreateModal() {
    this.showModal();
  }

  openEditModal(project: Project) {
    this.showModal();
  }

  save() {
    if (this.projectForm.invalid) {
      return
    }

    const newProject: Partial<Project> = this.projectForm.getRawValue() as Partial<Project>;

    this.projectManagementService.add(newProject).subscribe({
      next: (response: Partial<Project>) => {
        this.toast.success('Se ha creado el proyecto')
      },
      error: (error: ErrorResponse) => {
        this.toast.error(`${error.message}`)
      }
    })

    this.closeModal();
  }

  delete(id: number) {
  }

  private showModal() {
    (document.getElementById('project_modal') as any)?.showModal();
  }

  closeModal() {
    (document.getElementById('project_modal') as any)?.close();
  }
}