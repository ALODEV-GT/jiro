import { Component, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';

import { Sprint, UserStory } from '../../models/project.model';
import { StoryService } from '../../services/story.service';
import { SprintService } from '../../services/sprint.service';
import { Page } from '../../../../shared/models/page';
import { ErrorResponse } from '../../../../shared/models/errors';
import { ToastService } from '../../../../shared/services/toast.service';
import { MembersService } from '../../../home/services/members.service';
import { ProjectMember } from '../../../home/models/home.model';

@Component({
  selector: 'app-sprints',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './sprints.component.html',
  styleUrl: './sprints.component.scss'
})
export class SprintsComponent {

  private readonly fb = inject(FormBuilder);
  private readonly route = inject(ActivatedRoute);
  private readonly sprintService = inject(SprintService);
  private readonly storyService = inject(StoryService);
  private readonly toast = inject(ToastService);
  private readonly memberService = inject(MembersService);
  employees: ProjectMember[] = []

  projectId!: string;

  sprints: Sprint[] = [];
  stories: UserStory[] = [];

  isEdit = false;
  loading = false;

  editingSprintId: number | null = null;
  editingStoryId = signal<number | null>(null);

  // -------------------- SPRINT FORM --------------------
  sprintForm = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
    description: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]],
    startDate: ['', Validators.required],
    endDate: ['', Validators.required],
    status: ['PENDING', Validators.required]
  });

  // -------------------- STORY FORM --------------------
  storyForm = this.fb.group({
    name: ['', Validators.required],
    description: ['', Validators.required],
    points: [1, [Validators.required, Validators.min(1)]],
    priority: ['MEDIUM', Validators.required],
    productOwnerId: ['', Validators.required],
    developerId: ['', Validators.required]
  });

  constructor() {
    this.route.params.subscribe(params => {
      this.projectId = params['id'];
      this.getSprints();
      this.loadStories();
      this.loadMembersPage()
    });
  }

  loadMembersPage() {
    this.memberService.getMembers(this.projectId, 0, 1000).subscribe({
      next: (page: Page<ProjectMember>) => {
        this.employees = [...this.employees, ...page.items];
      },
      error: (e: ErrorResponse) => this.toast.error(e.message)
    });
  }

  // ==================== STORIES ====================

  loadStories(): void {
    this.storyService.getBacklogStories(this.projectId).subscribe({
      next: stories => this.stories = stories,
      error: (e: ErrorResponse) =>
        this.toast.error(e.message || 'Error al cargar historias')
    });
  }

  getBacklogStories(): UserStory[] {
    return this.stories.filter(s => s.stageId === null);
  }

  getStoriesForSprint(stageId: number): UserStory[] {
    return this.stories.filter(s => s.stageId === stageId);
  }

  openStoryModal(isEdit = false, story?: UserStory): void {
    this.editingStoryId.set(isEdit && story ? story.id : null);

    if (isEdit && story) {
      this.storyForm.patchValue({
        name: story.name,
        description: story.description,
        points: story.points,
        priority: story.priority,
        productOwnerId: story.productOwnerId,
        developerId: story.developerId
      });
    } else {
      this.storyForm.reset({
        name: '',
        description: '',
        points: 1,
        priority: 'MEDIUM'
      });
    }

    (document.getElementById('story_modal') as any)?.showModal();
  }

  saveStory(): void {
    if (this.storyForm.invalid) {
      this.storyForm.markAllAsTouched();
      return;
    }

    const payload = this.storyForm.getRawValue();
    const storyId = this.editingStoryId();

    const req$ = storyId
      ? this.storyService.update(this.projectId, storyId, payload as Partial<UserStory>)
      : this.storyService.create(this.projectId, payload as Omit<UserStory, 'id' | 'stageId' | 'projectId'>);

    req$.subscribe({
      next: () => {
        this.toast.success(storyId ? 'Historia actualizada' : 'Historia creada');
        this.loadStories();
        this.closeModal('story_modal');
      },
      error: (e: ErrorResponse) =>
        this.toast.error(e.message || 'Error al guardar historia')
    });
  }

  deleteStory(id: number): void {
    if (!confirm('¿Eliminar esta historia?')) return;

    this.storyService.delete(this.projectId, id).subscribe({
      next: () => {
        this.toast.success('Historia eliminada');
        this.loadStories();
      },
      error: (e: ErrorResponse) =>
        this.toast.error(e.message || 'Error al eliminar historia')
    });
  }

  // ==================== SPRINTS ====================

  getSprints(): void {
    this.sprintService.getProjectSprints(this.projectId).subscribe({
      next: (page: Page<Sprint>) => this.sprints = page.items,
      error: (e: ErrorResponse) => this.toast.error(e.message)
    });
  }

  openCreateSprintModal(): void {
    this.isEdit = false;
    this.editingSprintId = null;

    this.sprintForm.reset({
      name: '',
      description: '',
      startDate: '',
      endDate: '',
      status: 'PENDING'
    });

    this.showSprintModal();
  }

  openEditSprintModal(sprint: Sprint): void {
    this.isEdit = true;
    this.editingSprintId = sprint.id;

    this.sprintForm.patchValue({
      name: sprint.name,
      description: sprint.description,
      startDate: sprint.startDate,
      endDate: sprint.endDate,
      status: sprint.status
    });

    this.showSprintModal();
  }

  saveSprint(): void {
    if (this.sprintForm.invalid) {
      this.sprintForm.markAllAsTouched();
      return;
    }

    const payload = this.sprintForm.getRawValue() as Partial<Sprint>;
    let req$: Observable<Partial<Sprint>>;

    if (this.isEdit && this.editingSprintId !== null) {
      req$ = this.sprintService.update(this.projectId, this.editingSprintId, payload);
    } else {
      req$ = this.sprintService.create(this.projectId, payload);
    }

    req$.subscribe({
      next: () => {
        this.toast.success(this.isEdit ? 'Sprint actualizado' : 'Sprint creado');
        this.getSprints();
        this.closeSprintModal();
      },
      error: (e: ErrorResponse) =>
        this.toast.error(e.message || 'Error al guardar sprint')
    });
  }

  deleteSprint(id: number): void {
    if (!confirm('¿Eliminar este sprint?')) return;

    this.sprintService.delete(this.projectId, id).subscribe({
      next: () => {
        this.toast.success('Sprint eliminado');
        this.getSprints();
      },
      error: (e: ErrorResponse) => this.toast.error(e.message)
    });
  }

  // ==================== UTILS ====================

  showSprintModal(): void {
    (document.getElementById('sprint_modal') as any)?.showModal();
  }

  closeSprintModal(): void {
    (document.getElementById('sprint_modal') as any)?.close();
  }

  closeModal(id: string): void {
    (document.getElementById(id) as any)?.close();
  }

  getEmployeeName(id: string): string {
    return this.employees.find(e => e.id === id)?.firstName ?? '—';
  }
}
