import { Component, signal, computed } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';

type SprintStatus = 'planned' | 'active' | 'completed';

interface Sprint {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  status: SprintStatus;
  progress: number;
  totalIssues: number;
  completedIssues: number;
  storyPoints: number;
  goal?: string;
}
@Component({
  selector: 'app-sprints',
  standalone: true,
  imports: [CommonModule, FormsModule, DatePipe],
  templateUrl: './sprints.component.html',
  styleUrl: './sprints.component.scss'
})
export class SprintsComponent {
  sprints = signal<Sprint[]>([
    {
      id: 's1',
      name: 'Sprint 11 - Autenticación',
      startDate: '2025-11-25',
      endDate: '2025-12-08',
      status: 'active' as const,
      progress: 68,
      totalIssues: 25,
      completedIssues: 17,
      storyPoints: 45,
      goal: 'Implementar login con OAuth y recuperación de contraseña'
    },
    {
      id: 's2',
      name: 'Sprint 10 - Dashboard',
      startDate: '2025-11-11',
      endDate: '2025-11-24',
      status: 'completed' as const,
      progress: 100,
      totalIssues: 20,
      completedIssues: 20,
      storyPoints: 38
    }
  ]);

  // Formulario modal
  editingSprint = signal<Sprint | null>(null);
  sprintForm = {
    name: '',
    durationWeeks: 2,
    startDate: '',
    goal: ''
  };

  openCreateSprintModal() {
    this.editingSprint.set(null);
    this.sprintForm = { name: '', durationWeeks: 2, startDate: this.nextMonday(), goal: '' };
    this.showModal();
  }

  editSprint(sprint: Sprint) {
    this.editingSprint.set(sprint);
    this.sprintForm = {
      name: sprint.name,
      durationWeeks: this.weeksBetween(sprint.startDate, sprint.endDate),
      startDate: sprint.startDate,
      goal: sprint.goal || ''
    };
    this.showModal();
  }

  saveSprint() {
    const start = new Date(this.sprintForm.startDate);
    const end = new Date(start);
    end.setDate(start.getDate() + (this.sprintForm.durationWeeks * 7) - 1);

    const newSprint: Sprint = {
      id: this.editingSprint()?.id || Date.now().toString(),
      name: this.sprintForm.name,
      startDate: start.toISOString().split('T')[0],
      endDate: end.toISOString().split('T')[0],
      status: 'planned' as const,
      progress: 0,
      totalIssues: 0,
      completedIssues: 0,
      storyPoints: 0,
      goal: this.sprintForm.goal
    };

    if (this.editingSprint()) {
      this.sprints.update(sprints =>
        sprints.map(s => s.id === this.editingSprint()!.id ? { ...s, ...newSprint } : s)
      );
    } else {
      this.sprints.update(sprints => [...sprints, newSprint]);
    }

    this.closeSprintModal();
  }

  startSprint(sprint: Sprint) {
    this.sprints.update(sprints =>
      sprints.map(s => s.id === sprint.id ? { ...s, status: 'active' as const } : s)
    );
  }

  completeSprint(sprint: Sprint) {
    this.sprints.update(sprints =>
      sprints.map(s => s.id === sprint.id
        ? { ...s, status: 'completed' as const, progress: 100 }
        : s
      )
    );
  }

  // Helpers
  sprintStatusLabel(status: SprintStatus): string {
    return { planned: 'Planificado', active: 'Activo', completed: 'Completado' }[status];
  }

  sprintDuration(sprint: Sprint): string {
    const days = this.weeksBetween(sprint.startDate, sprint.endDate) * 7;
    return `${days} días`;
  }

  calculatedEndDate(): string {
    if (!this.sprintForm.startDate) return '';
    const start = new Date(this.sprintForm.startDate);
    const end = new Date(start);
    end.setDate(start.getDate() + (this.sprintForm.durationWeeks * 7) - 1);
    return end.toISOString().split('T')[0];
  }

  private nextMonday(): string {
    const d = new Date();
    const day = d.getDay();
    const diff = day === 0 ? 1 : 8 - day;
    d.setDate(d.getDate() + diff);
    return d.toISOString().split('T')[0];
  }

  private weeksBetween(start: string, end: string): number {
    const diff = (new Date(end).getTime() - new Date(start).getTime()) / (1000 * 3600 * 24);
    return Math.round(diff / 7);
  }

  private showModal() {
    (document.getElementById('sprint_modal') as HTMLDialogElement)?.showModal();
  }

  closeSprintModal() {
    (document.getElementById('sprint_modal') as HTMLDialogElement)?.close();
  }
}