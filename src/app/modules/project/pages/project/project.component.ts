import { Component, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BoardComponent } from '../../components/board/board.component';
import { SprintsComponent } from '../../components/sprints/sprints.component';
import { LogActivityComponent } from '../../components/log-activity/log-activity.component';
import { ProjectManagementService } from '../../../home/services/project-management.service';
import { ErrorResponse } from '../../../../shared/models/errors';
import { ToastService } from '../../../../shared/services/toast.service';
import { Project } from '../../../home/models/home.model';
import { Member } from '../../models/project.model';
import { CommonModule } from '@angular/common';
import { MembersService } from '../../../home/services/members.service';
import { Page } from '../../../../shared/models/page';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-project',
  standalone: true,
  imports: [BoardComponent, SprintsComponent, LogActivityComponent, CommonModule, ReactiveFormsModule],
  templateUrl: './project.component.html',
  styleUrl: './project.component.scss'
})
export class ProjectComponent {
  private fb = inject(FormBuilder);
  private activatedRoute = inject(ActivatedRoute);
  private projectService = inject(ProjectManagementService)
  private memberService = inject(MembersService)
  private toast = inject(ToastService)

  members: Member[] = []
  project: Project | null = null

  activeTab: 'board' | 'members' | 'sprints' | 'finances' | 'reports' | 'activity' = 'sprints';


  isEditingProject = false;

  projectForm = this.fb.nonNullable.group({
    name: ['', Validators.required],
    description: ['', Validators.required],
    client: ['', Validators.required],
    monthlyIncome: [0, [Validators.required, Validators.min(0)]]
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
          this.getMembers(project.id);
        },
        error: (error: ErrorResponse) => {
          this.toast.error(error.message)
        }
      })
    });
  }

  enableEdit() {
    if (!this.project) return;
    this.isEditingProject = true;
  }

  cancelEdit() {
    if (!this.project) return;

    this.projectForm.patchValue({
      name: this.project.name,
      description: this.project.description,
      client: this.project.client,
      monthlyIncome: this.project.monthlyIncome
    });

    this.isEditingProject = false;
  }

  saveProject() {
    if (!this.project || this.projectForm.invalid) return;

    const body = this.projectForm.getRawValue();

    this.projectService.update(this.project.id, body).subscribe({
      next: (updated: Project) => {
        this.project = updated;
        this.isEditingProject = false;
        this.toast.success('Proyecto actualizado correctamente');
      },
      error: (error: ErrorResponse) => {
        this.toast.error(error.message);
      }
    });
  }

  getMembers(id: string) {
    this.memberService.getProjectMembers(id).subscribe({
      next: (page: Page<Member>) => {
        this.members = page.items
      },
      error: (error: ErrorResponse) => {
        this.toast.error(error.message)
      }
    })
  }
}