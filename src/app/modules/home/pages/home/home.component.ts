import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

interface Project {
  name: string;
  description: string;
  code: string;
  isOwner: boolean;
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './home.component.html',
})
export class HomeComponent {
  projects: Project[] = [
    { name: 'Rediseño Frontend', description: 'Nueva interfaz del panel de cliente', code: 'FR-2025-XK9', isOwner: true },
    { name: 'Backend App Móvil', description: 'API en Node.js para la app móvil', code: 'MAB-2025-Z3M', isOwner: false },
  ];

  newProjectName = '';
  newProjectDescription = '';
  generatedCode: string | null = null;
  joinCode = '';

  openCreateProjectModal() {
    this.generatedCode = null;
    this.newProjectName = '';
    this.newProjectDescription = '';
    (document.getElementById('create_project_modal') as HTMLDialogElement)?.showModal();
  }

  openJoinProjectModal() {
    this.joinCode = '';
    (document.getElementById('join_project_modal') as HTMLDialogElement)?.showModal();
  }

  closeModal(modalId: string) {
    (document.getElementById(modalId) as HTMLDialogElement)?.close();
  }

  createProject() {
    if (!this.newProjectName.trim()) return;

    const code = this.generateCode();
    this.generatedCode = code;

  }

  joinProject() {
    if (this.joinCode.trim()) {
      alert(`Uniéndote al proyecto con código: ${this.joinCode}`);
      this.joinCode = '';
    }
  }

  copyCode(code: string) {
    navigator.clipboard.writeText(code);
  }

  goToProject(code: string) {
    console.log('Navegar al proyecto:', code);
  }

  private generateCode(): string {
    const prefix = this.newProjectName
      .split(' ')
      .map(w => w[0])
      .join('')
      .substring(0, 3)
      .toUpperCase() || 'PRJ';

    const random = Math.random().toString(36).substring(2, 7).toUpperCase();
    return `${prefix}-${new Date().getFullYear()}-${random}`;
  }
}