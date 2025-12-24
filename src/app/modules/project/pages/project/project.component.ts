import { Component, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BoardComponent } from '../../components/board/board.component';
import { SprintsComponent } from '../../components/sprints/sprints.component';
import { TopbarComponent } from '../../../home/components/topbar/topbar.component';
import { LogActivityComponent } from '../../components/log-activity/log-activity.component';
import { ProjectManagementService } from '../../../home/services/project-management.service';
import { ErrorResponse } from '../../../../shared/models/errors';
import { ToastService } from '../../../../shared/services/toast.service';
import { Project } from '../../../home/models/home.model';
import { Member } from '../../models/project.model';
import { CommonModule } from '@angular/common';
import { MembersService } from '../../../home/services/members.service';
import { Page } from '../../../../shared/models/page';

@Component({
  selector: 'app-project',
  standalone: true,
  imports: [BoardComponent, SprintsComponent, LogActivityComponent, CommonModule],
  templateUrl: './project.component.html',
  styleUrl: './project.component.scss'
})
export class ProjectComponent {
  private activatedRoute = inject(ActivatedRoute);
  private projectService = inject(ProjectManagementService)
  private memberService = inject(MembersService)
  private toast = inject(ToastService)

  members: Member[] = []
  project: Project | null = null

  activeTab: 'board' | 'members' | 'sprints' | 'finances' | 'reports' | 'activity' = 'sprints';

  constructor() {
    this.activatedRoute.params.subscribe(params => {
      this.projectService.getProject(params['id']).subscribe({
        next: (project: Project) => {
          this.project = project
          this.getMembers(this.project.id)
        },
        error: (error: ErrorResponse) => {
          this.toast.error(error.message)
        }
      })
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