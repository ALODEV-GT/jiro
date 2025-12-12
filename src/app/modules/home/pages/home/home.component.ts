import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Project } from '../../models/home.model';
import { ProjectService } from '../../services/project.service';
import { AuthStore } from '../../../auth/store/auth.store';
import { Page } from '../../../../shared/models/page';
import { ErrorResponse } from '../../../../shared/models/errors';
import { InfiniteScrollDirective } from 'ngx-infinite-scroll';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [FormsModule, InfiniteScrollDirective],
  templateUrl: './home.component.html',
})
export class HomeComponent implements OnInit {
  private readonly projectService = inject(ProjectService)
  private readonly authStore = inject(AuthStore)

  page: number = 1
  isLastPage = false
  projects: Project[] = []

  /** 
  projects: Project[] = [
    { id: 1, name: 'Rediseño Frontend', description: 'Nueva interfaz del panel de cliente', active: true, monthlyIncome: 0 },
    { id: 2, name: 'Backend App Móvil', description: 'API en Node.js para la app móvil', active: false, monthlyIncome: 0 }
  ];
  */

  ngOnInit() {
    this.getProjectPage()
  }

  getProjectPage() {
    if (!this.isLastPage) {
      this.projectService.getProjectsByUserId(this.authStore.user()?.id!, this.page).subscribe({
        next: (page: Page<Project>) => {
          this.projects = [...this.projects, ...page.items]
          this.page += 1
          this.isLastPage = page.lastPage
        },
        error: (error: ErrorResponse) => {
          //TODO: Handle error
        }
      })
    }
  }

}