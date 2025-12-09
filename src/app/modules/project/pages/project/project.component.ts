import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { BoardComponent } from '../../components/board/board.component';
import { SprintsComponent } from '../../components/sprints/sprints.component';

interface Project {
  name: string;
  code: string;
  description: string;
}

@Component({
  selector: 'app-project',
  standalone: true,
  imports: [BoardComponent, SprintsComponent],
  templateUrl: './project.component.html',
  styleUrl: './project.component.scss'
})
export class ProjectComponent {
  project: Project = {
    name: 'Rediseño Frontend',
    code: 'FR-2025-XK9',
    description: 'Nueva interfaz del panel de cliente'
  };

  currentUserName = 'Juan Pérez';
  currentUserInitials = 'JP';

  activeTab: 'board' | 'members' | 'sprints' | 'finances' | 'reports' = 'board';

  constructor(private router: Router) { }

  goBack() {
    this.router.navigate(['/']);
  }

  logout() {
    alert('Sesión cerrada');
    this.router.navigate(['/login']);
  }
}