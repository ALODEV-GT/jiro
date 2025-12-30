import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  CdkDropListGroup,
  CdkDropList,
  CdkDrag,
  CdkDragDrop,
  moveItemInArray,
  transferArrayItem,
} from '@angular/cdk/drag-drop';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

import { BoardService } from '../../services/board.service';
import { StoryStageService } from '../../../home/services/story-stage.service';
import { ErrorResponse } from '../../../../shared/models/errors';
import { ToastService } from '../../../../shared/services/toast.service';
import { Sprint, UserStory } from '../../models/project.model';
import { ProjectMember } from '../../../home/models/home.model';
import { MembersService } from '../../../home/services/members.service';
import { Page } from '../../../../shared/models/page';
import { ActivatedRoute } from '@angular/router';
import { SprintService } from '../../services/sprint.service';

interface Column {
  id: string;              // stage.id
  title: string;           // stage.name
  tasks: UserStory[];
}

@Component({
  selector: 'app-board',
  standalone: true,
  imports: [CommonModule, CdkDropListGroup, CdkDropList, CdkDrag, ReactiveFormsModule],
  templateUrl: './board.component.html',
  styleUrl: './board.component.scss'
})
export class BoardComponent implements OnInit {
  private readonly fb = inject(FormBuilder)
  private readonly boardService = inject(BoardService);
  private readonly storyStageService = inject(StoryStageService);
  private readonly toast = inject(ToastService);
  private readonly memberService = inject(MembersService);
  private readonly route = inject(ActivatedRoute);
  private readonly sprintService = inject(SprintService);

  private sprintId: string = "";
  currentSprint: Sprint | null = null


  projectId!: string;


  employees: ProjectMember[] = []
  sprints: Sprint[] = [];

  getSprints(): void {
    this.sprintService.getProjectSprints(this.projectId).subscribe({
      next: (page: Page<Sprint>) => {
        this.sprints = page.items;

        const activeSprint = this.sprints.find(
          sprint => sprint.status === 'ACTIVE'
        );

        if (!activeSprint) {
          this.toast.warning('No hay un sprint activo');
          return;
        }

        this.sprintId = activeSprint.id.toString();
        this.currentSprint = activeSprint
        this.loadStages();
      },
      error: (e: ErrorResponse) => this.toast.error(e.message)
    });
  }

  columns: Column[] = [];

  currentStageId: number | null = null;
  editingStoryId = signal<number | null>(null);

  storyForm = this.fb.group({
    name: ['', Validators.required],
    description: [''],
    points: [1, [Validators.required, Validators.min(1)]],
    priority: ['MEDIUM', Validators.required],
    productOwnerId: ['', Validators.required],
    developerId: ['', Validators.required],
  });

  ngOnInit(): void {
    this.projectId = this.route.snapshot.paramMap.get('id')!;
    this.getSprints()
    this.loadMembersPage();
  }

  loadMembersPage() {
    this.memberService.getMembers(this.projectId, 0, 1000).subscribe({
      next: (page: Page<ProjectMember>) => {
        this.employees = [...this.employees, ...page.items];
      },
      error: (e: ErrorResponse) => this.toast.error(e.message)
    });
  }

  openCreateStory(stageId: string) {
    this.currentStageId = Number(stageId);
    this.editingStoryId.set(null);

    this.storyForm.reset({
      name: '',
      description: '',
      points: 1,
      priority: 'MEDIUM',
      productOwnerId: '',
      developerId: ''
    });

    this.openModal('story_modal');
  }

  Number = Number

  openEditStory(stageId: number, story: UserStory) {
    this.currentStageId = stageId;
    this.editingStoryId.set(story.id);

    this.storyForm.patchValue({
      name: story.name,
      description: story.description,
      points: story.points,
      priority: story.priority,
      productOwnerId: story.productOwnerId,
      developerId: story.developerId,
    });

    this.openModal('story_modal');
  }

  // =========================
  // Load stages + stories
  // =========================
  private loadStages(): void {
    this.boardService.getSprintStages(this.sprintId).subscribe({
      next: (stages) => {
        this.columns = stages
          .sort((a, b) => a.orderIndex - b.orderIndex)
          .map(stage => ({
            id: stage.id.toString(),
            title: stage.name,
            tasks: []
          }));

        this.columns.forEach(column => {
          this.loadStoriesForStage(Number(column.id));
        });
      },
      error: (error: ErrorResponse) => {
        this.toast.error(error.message)
      }
    });
  }

  private loadStoriesForStage(stageId: number): void {
    const column = this.columns.find(c => Number(c.id) === stageId);
    if (!column) return;

    this.storyStageService.getStageStories(stageId).subscribe({
      next: (stories: UserStory[]) => {
        column.tasks = stories
      },
      error: (error: ErrorResponse) => {
        this.toast.error(error.message)
      }
    });
  }

  saveStory() {
    if (!this.storyForm.valid || this.currentStageId === null) return;

    const payload = this.storyForm.getRawValue();

    // 🆕 Crear
    if (!this.editingStoryId()) {
      this.storyStageService.createStory(this.currentStageId, payload as Omit<UserStory, 'id' | 'stageId' | 'projectId'>)
        .subscribe({
          next: (story) => {
            const column = this.columns.find(
              c => Number(c.id) === this.currentStageId
            );
            if (column) {
              column.tasks.push(story);
            }
            this.closeModal('story_modal');
          },
          error: err => console.error('Error creating story', err)
        });
      return;
    }

    this.storyStageService.updateStory(
      this.currentStageId,
      this.editingStoryId()!,
      payload as Partial<UserStory>
    ).subscribe({
      next: updated => {
        const column = this.columns.find(
          c => Number(c.id) === this.currentStageId
        );
        const task = column?.tasks.find(t => t.id === updated.id);
        if (task) {
          Object.assign(task, {
            title: updated.name,
            description: updated.description,
            points: updated.points,
            priority: updated.priority,
            productOwnerId: updated.productOwnerId,
            developerId: updated.developerId
          });
        }
        this.closeModal('story_modal');
      },
      error: err => console.error('Error updating story', err)
    });
  }

  openModal(id: string) {
    (document.getElementById(id) as HTMLDialogElement)?.showModal();
  }

  closeModal(id: string) {
    (document.getElementById(id) as HTMLDialogElement)?.close();
    this.currentStageId = null;
    this.editingStoryId.set(null);
  }



  // =========================
  // Drag & drop
  // =========================
  get taskListIds(): string[] {
    return this.columns.map(c => 'task-list-' + c.id);
  }

  dropColumn(event: CdkDragDrop<Column[]>) {
    if (event.previousIndex === event.currentIndex) return;

    moveItemInArray(this.columns, event.previousIndex, event.currentIndex);
    this.persistColumnOrder();
  }

  private persistColumnOrder(): void {
    this.columns.forEach((column, index) => {
      this.boardService.updateStage(
        this.sprintId,
        Number(column.id),
        { orderIndex: index }
      ).subscribe({
        error: (error: ErrorResponse) => {
          this.toast.error(error.message)
        }
      });
    });
  }

  dropTask(event: CdkDragDrop<UserStory[]>, targetColumnId: string) {
    if (event.previousContainer === event.container) {
      moveItemInArray(
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
      return;
    }

    const story: UserStory = event.previousContainer.data[event.previousIndex];
    const fromStageId = Number(
      event.previousContainer.id.replace('task-list-', '')
    );
    const toStageId = Number(targetColumnId);

    transferArrayItem(
      event.previousContainer.data,
      event.container.data,
      event.previousIndex,
      event.currentIndex
    );

    this.storyStageService.updateStoryStage(
      fromStageId,
      story.id,
      toStageId
    ).subscribe({
      error: (error: ErrorResponse) => {
        this.toast.error(error.message)

        // rollback visual simple
        transferArrayItem(
          event.container.data,
          event.previousContainer.data,
          event.currentIndex,
          event.previousIndex
        );
      }
    });
  }

  // =========================
  // Columns (Stages)
  // =========================
  addColumn() {
    const name = prompt('Nombre de la nueva columna:');
    if (!name?.trim()) return;

    const orderIndex = this.columns.length;

    this.boardService.createStage(this.sprintId, {
      name: name.trim(),
      description: '',
      orderIndex,
      isDefault: false
    }).subscribe({
      next: (stage) => {
        this.columns.push({
          id: stage.id.toString(),
          title: stage.name,
          tasks: []
        });
      },
      error: err => console.error('Error creating stage', err)
    });
  }

  editColumnName(column: Column) {
    const newName = prompt('Nuevo nombre:', column.title);
    if (!newName?.trim()) return;

    this.boardService.updateStage(
      this.sprintId,
      Number(column.id),
      { name: newName.trim() }
    ).subscribe({
      next: stage => column.title = stage.name,
      error: err => console.error('Error updating stage', err)
    });
  }

  deleteColumn(columnId: string) {
    if (this.columns.length <= 1) {
      alert('Debe haber al menos una columna');
      return;
    }

    if (!confirm('¿Eliminar esta columna y todas sus tareas?')) return;

    this.boardService.deleteStage(this.sprintId, Number(columnId)).subscribe({
      next: () => {
        this.columns = this.columns.filter(c => c.id !== columnId);
        this.persistColumnOrder();
      },
      error: err => console.error('Error deleting stage', err)
    });
  }

  // =========================
  // Tasks (Stories)
  // =========================
  deleteTask(stageId: string, storyId: number): void {
    if (!confirm('¿Eliminar esta historia?')) return;

    const column = this.columns.find(c => c.id === stageId);
    if (!column) return;

    const previousTasks = [...column.tasks];

    column.tasks = column.tasks.filter(s => s.id !== storyId);

    this.storyStageService.delete(stageId, storyId).subscribe({
      next: () => {
        this.toast.success('Historia eliminada');
      },
      error: (e: ErrorResponse) => {
        column.tasks = previousTasks;
        this.toast.error(e.message || 'Error al eliminar historia');
      }
    });
  }

  getEmployeeName(id: string): string {
    const e = this.employees.find(emp => emp.id === id);
    return e ? `${e.firstName} ${e.lastName}` : '—';
  }

  sendToBacklog(): void {
    if (!this.editingStoryId() || this.currentStageId === null) return;

    if (!confirm('¿Enviar esta historia nuevamente al backlog?')) return;

    const fromStageId = this.currentStageId; // 🔒 capturado
    const storyId = this.editingStoryId();

    this.storyStageService.updateStoryStage(
      fromStageId,
      storyId!,
      null // BACKLOG
    ).subscribe({
      next: () => {
        this.removeStoryFromColumn(fromStageId, storyId!);
        this.closeModal('story_modal');
        this.toast.success('Historia enviada al backlog');
      },
      error: (err) => {
        console.error('Error sending story to backlog', err);
        this.toast.error('No se pudo enviar la historia al backlog');
      }
    });
  }


  private removeStoryFromColumn(stageId: number, storyId: number): void {
    const column = this.columns.find(c => Number(c.id) === stageId);
    if (!column) return;

    column.tasks = column.tasks.filter(t => t.id !== storyId);
  }



}
