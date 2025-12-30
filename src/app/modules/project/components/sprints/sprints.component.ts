import { Component, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Sprint, UserStory } from '../../models/project.model';
import { StoryService } from '../../services/story.service';
import { ActivatedRoute } from '@angular/router';
import { SprintService } from '../../services/sprint.service';
import { Page } from '../../../../shared/models/page';
import { ErrorResponse } from '../../../../shared/models/errors';
import { ToastService } from '../../../../shared/services/toast.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-sprints',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './sprints.component.html',
  styleUrl: './sprints.component.scss'
})
export class SprintsComponent {
  private readonly fb = inject(FormBuilder)
  private activatedRoute = inject(ActivatedRoute);
  private readonly sprintService = inject(SprintService)
  private readonly toast = inject(ToastService)

  private projectId: string = ''

  isEdit = false;
  loading = false;
  formError = ''

  userStories: any
  sprints: Sprint[] = []
  employees: any

  editingStoryId = signal<number | null>(null);
  editingSprintId: number | null = null;

  sprintForm = this.fb.group({
    name: ["", [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
    description: ["", [Validators.required, Validators.minLength(3), Validators.maxLength(100)]],
    startDate: ["", [Validators.required]],
    endDate: ["", [Validators.required]],
    status: ["", [Validators.required]]
  })

  constructor(
    private userStoryService: StoryService,
  ) {
    this.userStories = this.userStoryService.allUserStories;

    this.activatedRoute.params.subscribe(params => {
      this.projectId = params['id']
      this.getSprints()
    });
  }

  openCreateSprintModal() {
    this.isEdit = false;
    this.editingSprintId = null;
    this.formError = '';
    this.loading = false;

    this.sprintForm.enable({ emitEvent: false });

    this.sprintForm.reset({
      name: '',
      description: '',
      startDate: new Date().toString(),
      endDate: new Date().toString()
    });

    this.showSprintModal();
  }

  openEditSprintModal(sprint: Sprint) {
    this.isEdit = true;
    this.editingSprintId = sprint.id;
    this.formError = '';
    this.loading = false;

    this.sprintForm.patchValue({
      name: sprint.name ?? '',
      description: sprint.description ?? '',
      startDate: sprint.startDate,
      endDate: sprint.endDate,
      status: sprint.status
    });

    this.showSprintModal();
  }

  saveSprint() {
    this.formError = '';

    if (this.sprintForm.invalid) {
      Object.keys(this.sprintForm.controls).forEach(key => {
        const control = this.sprintForm.get(key);

        if (control?.invalid) {
          console.log(`❌ Campo inválido: ${key}`, {
            value: control.value,
            errors: control.errors,
            touched: control.touched,
            dirty: control.dirty
          });
        }
      });

      this.sprintForm.markAllAsTouched();
      return;
    }


    this.loading = true;

    const payload = this.sprintForm.getRawValue() as Partial<Sprint>;

    let req$: Observable<Partial<Sprint>>;

    if (this.isEdit && this.editingSprintId != null) {
      req$ = this.sprintService.update(this.projectId, this.editingSprintId, payload);
    }
    else {
      req$ = this.sprintService.create(this.projectId, payload);
    }

    req$.subscribe({
      next: () => {
        let message = 'Se ha creado el sprint';

        if (this.isEdit) {
          message = 'Sprint actualizado';
        }

        this.toast.success(message);
        this.resetPaginationSprint()
        this.closeSprintModal();
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

  resetPaginationSprint() {
    this.sprints = []
    this.getSprints()
  }

  showSprintModal() {
    (document.getElementById('sprint_modal') as any)?.showModal();
  }

  closeSprintModal() {
    (document.getElementById('sprint_modal') as any)?.close();
  }

  getSprints() {
    this.sprintService.getProjectSprints(this.projectId).subscribe({
      next: (page: Page<Sprint>) => {
        this.sprints = page.items
      },
      error: (error: ErrorResponse) => {
        this.toast.error(error.message)
      }
    })
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

  private emptySprintForm() {
    // return {
    //   name: '',
    //   description: '',
    //   startDate: new Date('2025-12-09'),
    //   status: 'Pendiente',
    //   endDate: new Date('2025-12-25')
    // };
  }

  openStoryModal(isEdit = false, story?: UserStory) {
    // this.editingStoryId.set(isEdit && story ? story.id : null);
    // this.storyForm.set(isEdit && story ? { ...story } : this.emptyStoryForm());
    // (document.getElementById('story_modal') as any)?.showModal();
  }

  saveStory() {
    // const data = this.storyForm();
    // if (!data.name || data.points! <= 0 || !data.productOwnerId || !data.assigneeId) return;

    // if (this.editingStoryId()) {
    //   this.userStoryService.update(this.editingStoryId()!, data as UserStory);
    // } else {
    //   this.userStoryService.add(data as Omit<UserStory, 'id'>);
    // }
    // this.closeModal('story_modal');
  }

  deleteStory(id: number) {
    if (confirm('¿Eliminar esta historia?')) {
      this.userStoryService.delete(id);
    }
  }

  openSprintModal(isEdit = false, sprint?: Sprint) {
    // this.editingSprintId.set(isEdit && sprint ? sprint.id : null);
    // this.sprintForm.set(isEdit && sprint ? { ...sprint } : this.emptySprintForm());
    // (document.getElementById('sprint_modal') as any)?.showModal();
  }



  deleteSprint(id: number) {
    if (confirm('¿Eliminar este sprint? Esto no afectará las historias asignadas.')) {
      this.sprintService.delete(this.projectId, id).subscribe({
        next: () => {
          this.toast.success("Sprint eliminado")
          this.resetPaginationSprint()
        },
        error: (error: ErrorResponse) => {
          this.toast.error(error.message)
        }
      })
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

  getSprintName(id: number | undefined): void {
    // if (!id) return 'Backlog';
    // return this.sprints().find((s: any) => s.id === id)?.name ?? '—';
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