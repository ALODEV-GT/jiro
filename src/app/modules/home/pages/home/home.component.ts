import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Project } from '../../models/home.model';
import { ProjectService } from '../../services/project.service';
import { AuthStore } from '../../../auth/store/auth.store';
import { Page } from '../../../../shared/models/page';
import { ErrorResponse } from '../../../../shared/models/errors';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './home.component.html',
})
export class HomeComponent implements OnInit {
  private readonly projectService = inject(ProjectService)
  private readonly authStore = inject(AuthStore)

  page: number = 1
  projects: Project[] = []


  ngOnInit() {
    this.getProjectPage()
  }

  getProjectPage() {
    this.projectService.getProjectsByUserId(this.authStore.user()?.id!, this.page).subscribe({
      next: (page: Page<Project>) => {
        this.projects = [...this.projects, ...page.items]
        this.page += 1
      },
      error: (error: ErrorResponse) => {

      }
    })
  }

}