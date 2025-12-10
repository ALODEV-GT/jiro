import { Component, signal, computed } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Sprint, UserStory } from '../../models/project.model';
import { UserStoryService } from '../../services/user-story.service';
import { SprintService } from '../../services/sprint.service';
import { EmployeeService } from '../../../home/services/employee.service';

@Component({
  selector: 'app-sprints',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './sprints.component.html',
  styleUrl: './sprints.component.scss'
})
export class SprintsComponent {
  userStories: any
  sprints: any
  employees: any

  storyForm = signal<Partial<UserStory>>(this.emptyStoryForm());
  sprintForm = signal<Partial<Sprint>>(this.emptySprintForm());
  editingStoryId = signal<number | null>(null);
  editingSprintId = signal<number | null>(null);

  constructor(
    private userStoryService: UserStoryService,
    private sprintService: SprintService,
    private employeeService: EmployeeService
  ) {
    this.userStories = this.userStoryService.allUserStories;
    this.sprints = this.sprintService.allSprints;
    this.employees = this.employeeService.allEmployees;
  }

  private emptyStoryForm(): Partial<UserStory> {
    return {
      name: '',
      description: '',
      points: 0,
      priority: 'Media',
      productOwnerId: 0,
      assigneeId: 0,
      sprintId: undefined
    };
  }

  private emptySprintForm(): Partial<Sprint> {
    return {
      name: '',
      description: '',
      startDate: new Date('2025-12-09'),
      durationWeeks: 2,
      status: 'Pendiente'
    };
  }

  openStoryModal(isEdit = false, story?: UserStory) {
    this.editingStoryId.set(isEdit && story ? story.id : null);
    this.storyForm.set(isEdit && story ? { ...story } : this.emptyStoryForm());
    (document.getElementById('story_modal') as any)?.showModal();
  }

  saveStory() {
    const data = this.storyForm();
    if (!data.name || data.points! <= 0 || !data.productOwnerId || !data.assigneeId) return;

    if (this.editingStoryId()) {
      this.userStoryService.update(this.editingStoryId()!, data as UserStory);
    } else {
      this.userStoryService.add(data as Omit<UserStory, 'id'>);
    }
    this.closeModal('story_modal');
  }

  deleteStory(id: number) {
    if (confirm('¿Eliminar esta historia?')) {
      this.userStoryService.delete(id);
    }
  }

  openSprintModal(isEdit = false, sprint?: Sprint) {
    this.editingSprintId.set(isEdit && sprint ? sprint.id : null);
    this.sprintForm.set(isEdit && sprint ? { ...sprint } : this.emptySprintForm());
    (document.getElementById('sprint_modal') as any)?.showModal();
  }

  saveSprint() {
    const data = this.sprintForm();
    if (!data.name || !data.startDate || !data.durationWeeks) return;

    if (this.editingSprintId()) {
      this.sprintService.update(this.editingSprintId()!, data as Sprint);
    } else {
      this.sprintService.add(data as Omit<Sprint, 'id' | 'endDate'>);
    }
    this.closeModal('sprint_modal');
  }

  deleteSprint(id: number) {
    if (confirm('¿Eliminar este sprint? Esto no afectará las historias asignadas.')) {
      this.sprintService.delete(id);
    }
  }

  calculateEndDate(start: Date, weeks: number): Date {
    const end = new Date(start);
    end.setDate(end.getDate() + weeks * 7);
    return end;
  }

  closeModal(modalId: string) {
    (document.getElementById(modalId) as any)?.close();
  }

  getEmployeeName(id: number): string {
    return this.employees().find((e: any) => e.id === id)?.name ?? '—';
  }

  getSprintName(id: number | undefined): string {
    if (!id) return 'Backlog';
    return this.sprints().find((s: any) => s.id === id)?.name ?? '—';
  }

  formatDate(date: Date): string {
    return new Date(date).toLocaleDateString('es-PE');
  }

  getStoriesForSprint(sprintId: number): UserStory[] {
    return this.userStories().filter((s: any) => s.sprintId === sprintId);
  }

  getBacklogStories(): UserStory[] {
    return this.userStories().filter((s: any) => !s.sprintId);
  }
}