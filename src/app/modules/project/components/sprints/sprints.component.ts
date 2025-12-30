import { Component, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';

import { Sprint, UserStory } from '../../models/project.model';
import { StoryService } from '../../services/story.service';
import { Page } from '../../../../shared/models/page';
import { ErrorResponse } from '../../../../shared/models/errors';
import { ToastService } from '../../../../shared/services/toast.service';
import { MembersService } from '../../../home/services/members.service';
import { ProjectMember } from '../../../home/models/home.model';
import { BoardService } from '../../services/board.service';
import { SprintService } from '../../services/sprint.service';
import { StoryStageService } from '../../../home/services/story-stage.service';

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
  private readonly boardService = inject(BoardService)
  private readonly storyStageService = inject(StoryStageService);


  employees: ProjectMember[] = []

  projectId!: string;

  sprints: Sprint[] = [];
  backlogStories: UserStory[] = [];
  sprintStories: UserStory[] = []

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
      next: stories => {
        this.backlogStories = stories;
      },
      error: (e: ErrorResponse) =>
        this.toast.error(e.message || 'Error al cargar historias')
    });
  }

  getBacklogStories(): UserStory[] {
    return this.backlogStories;
  }

  getStoriesForSprint(sprintId: number): UserStory[] {
    return this.sprintStories.filter((s: UserStory) => s.sprintId! == sprintId.toString());
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
      next: (page: Page<Sprint>) => {
        this.sprints = page.items
        this.getSprintStories()
      },
      error: (e: ErrorResponse) => this.toast.error(e.message)
    });
  }

  getSprintStories(): void {
    this.sprintStories = [];

    this.sprints.forEach((sprint: Sprint) => {
      this.boardService.getSprintStories(sprint.id.toString()).subscribe({
        next: (stories: UserStory[]) => {
          this.sprintStories = [...this.sprintStories, ...stories];
        },
        error: (e: ErrorResponse) => this.toast.error(e.message)
      });
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
    const e = this.employees.find(emp => emp.id === id);
    return e ? `${e.firstName} ${e.lastName}` : '—';
  }

  assignSprintForm = this.fb.group({
    sprintId: ['', Validators.required]
  });

  assignSprintStoryId = signal<number | null>(null);
  openAssignSprintModal(story: UserStory): void {
    this.assignSprintStoryId.set(story.id);

    this.assignSprintForm.reset({
      sprintId: ''
    });

    (document.getElementById('assign_sprint_modal') as any)?.showModal();
  }

  assignSprint(): void {
    if (this.assignSprintForm.invalid || this.assignSprintStoryId() === null) {
      this.assignSprintForm.markAllAsTouched();
      return;
    }

    const sprintId = this.assignSprintForm.value.sprintId;
    const storyId = this.assignSprintStoryId()!;

    console.log("Before")
    console.log(this.backlogStories)
    console.log(this.sprintStories)

    this.sprintService
      .assignStoryToSprint(
        this.projectId,
        storyId.toString(),
        sprintId!.toString()
      )
      .subscribe({
        next: (response: UserStory) => {
          const story = this.backlogStories.find(s => s.id === storyId);
          if (!story) return;

          this.backlogStories = this.backlogStories.filter(s => s.id !== storyId);

          this.sprintStories = [
            ...this.sprintStories,
            response
          ];

          console.log("After")
          console.log(this.backlogStories)
          console.log(this.sprintStories)


          this.closeModal('assign_sprint_modal');
          this.toast.success('Se agregó la historia al sprint');
        },
        error: (e: ErrorResponse) =>
          this.toast.error(e.message || 'No se pudo agregar la historia al sprint')
      });
  }

  sendStoryToBacklog(story: UserStory): void {
    console.log(story)
    if (!confirm('¿Enviar esta historia nuevamente al backlog?')) return;

    this.storyStageService.updateStoryStage(
      story.stageId!,
      story.id,
      null
    )
      .subscribe({
        next: () => {
          this.sprintStories = this.sprintStories.filter(s => s.id !== story.id);

          this.backlogStories = [
            ...this.backlogStories,
            { ...story, stageId: null }
          ];

          this.toast.success('Historia regresada al backlog');
        },
        error: (e: ErrorResponse) =>
          this.toast.error(e.message || 'No se pudo regresar la historia al backlog')
      });
  }


}
