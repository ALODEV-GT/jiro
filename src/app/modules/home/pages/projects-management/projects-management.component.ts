import { Component, signal } from '@angular/core';
import { Project } from '../../models/home.model';
import { ProjectManagementService } from '../../services/project-management.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-projects-management',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './projects-management.component.html',
  styleUrl: './projects-management.component.scss'
})
export class ProjectsManagementComponent {
  formData = signal<Partial<Project>>(this.emptyForm());
  editingId = signal<number | null>(null);
  projects: any
  constructor(private service: ProjectManagementService) {
    this.projects = this.service.allProjects;
  }

  private emptyForm(): Partial<Project> {
    return {
      name: '',
      description: '',
      active: true,
      monthlyIncome: 0
    };
  }

  openCreateModal() {
    this.editingId.set(null);
    this.formData.set(this.emptyForm());
    this.showModal();
  }

  openEditModal(project: Project) {
    this.editingId.set(project.id);
    this.formData.set({ ...project });
    this.showModal();
  }

  save() {
    const data = this.formData();
    if (!data.name?.trim() || data.monthlyIncome == null || data.monthlyIncome < 0) {
      return;
    }

    if (this.editingId()) {
      this.service.update(this.editingId()!, {
        name: data.name.trim(),
        description: data.description?.trim() ?? '',
        active: data.active as boolean
      });
    } else {
      this.service.add({
        name: data.name.trim(),
        description: data.description?.trim() ?? '',
        active: data.active as boolean,
        monthlyIncome: data.monthlyIncome
      });
    }

    this.closeModal();
  }

  delete(id: number) {
    if (confirm('¿Estás seguro de eliminar este proyecto?')) {
      this.service.delete(id);
    }
  }

  private showModal() {
    (document.getElementById('project_modal') as any)?.showModal();
  }

  closeModal() {
    (document.getElementById('project_modal') as any)?.close();
  }

  formatCurrency(value: number): string {
    return new Intl.NumberFormat('es-GT', {
      style: 'currency',
      currency: 'QTZ',
      minimumFractionDigits: 0
    }).format(value);
  }
}