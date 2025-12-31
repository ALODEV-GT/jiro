import { Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BoardComponent } from '../../components/board/board.component';
import { SprintsComponent } from '../../components/sprints/sprints.component';
import { ProjectManagementService } from '../../../home/services/project-management.service';
import { ErrorResponse } from '../../../../shared/models/errors';
import { ToastService } from '../../../../shared/services/toast.service';
import { Project } from '../../../home/models/home.model';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { IncomingManagementComponent } from '../../../home/pages/incoming-management/incoming-management.component';
import { ExpenseManagementComponent } from "../../../home/pages/expense-management/expense-management.component";
import { MemberManagementComponent } from '../../../home/pages/member-management/member-management.component';
import { ProjectDataComponent } from "../../../report/components/project-data/project-data.component";
import { AuthStore } from '../../../auth/store/auth.store';
import { LogActivityComponent } from '../../components/log-activity/log-activity.component';

@Component({
  selector: 'app-project',
  standalone: true,
  imports: [
    BoardComponent,
    SprintsComponent,
    CommonModule,
    ReactiveFormsModule,
    IncomingManagementComponent,
    ExpenseManagementComponent,
    MemberManagementComponent,
    ProjectDataComponent,
    LogActivityComponent
  ],
  templateUrl: './project.component.html',
  styleUrl: './project.component.scss'
})
export class ProjectComponent {
  private fb = inject(FormBuilder);
  private activatedRoute = inject(ActivatedRoute);
  private projectService = inject(ProjectManagementService)
  private toast = inject(ToastService)
  readonly authStore = inject(AuthStore);

  project: Project | null = null

  activeTab: 'board' | 'members' | 'sprints' | 'income' | 'expense' | 'reports' | 'activity' = 'board';

  isEditingProject = false;

  projectForm = this.fb.nonNullable.group({
    name: [{ value: '', disabled: true }, Validators.required],
    description: [{ value: '', disabled: true }, Validators.required],
    client: [{ value: '', disabled: true }, Validators.required],
    monthlyIncome: [{ value: 0, disabled: true }, [Validators.required, Validators.min(0)]]
  });


  constructor() {
    this.activatedRoute.params.subscribe(params => {
      this.projectService.getProject(params['id']).subscribe({
        next: (project: Project) => {
          this.project = project;
          this.projectForm.patchValue({
            name: project.name,
            description: project.description,
            client: project.client,
            monthlyIncome: project.monthlyIncome
          });
        },
        error: (error: ErrorResponse) => {
          this.toast.error(error.message)
        }
      })
    });
  }

  enableEdit() {
    if (!this.project) return;

    this.projectForm.enable();
    this.isEditingProject = true;
  }


  cancelEdit() {
    if (!this.project) return;

    this.projectForm.reset({
      name: this.project.name,
      description: this.project.description,
      client: this.project.client,
      monthlyIncome: this.project.monthlyIncome
    });

    this.projectForm.disable();
    this.isEditingProject = false;
  }


  saveProject() {
    if (!this.project || this.projectForm.invalid) return;

    const body = this.projectForm.getRawValue();

    this.projectService.update(this.project.id, body).subscribe({
      next: (updated: Project) => {
        this.project = updated;
        this.projectForm.disable();
        this.isEditingProject = false;
        this.toast.success('Proyecto actualizado correctamente');
      },
      error: (error: ErrorResponse) => {
        this.toast.error(error.message);
      }
    });
  }
}