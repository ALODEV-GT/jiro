import { Injectable, signal } from '@angular/core';
import { Project } from '../models/home.model';

@Injectable({
  providedIn: 'root'
})
export class ProjectManagementService {
  private projects = signal<Project[]>([
    {
      id: 1,
      name: 'Edificio Centro',
      description: 'Construcción de 20 pisos en el centro',
      active: true,
      monthlyIncome: 450000
    }
  ]);

  allProjects = this.projects.asReadonly();

  add(project: Omit<Project, 'id' | 'createdAt'>) {
    const newProject: Project = {
      ...project,
      id: Math.max(...this.projects().map(p => p.id), 0) + 1,
      createdAt: new Date()
    };
    this.projects.update((list: any) => [...list, newProject]);
  }

  update(id: number, changes: Pick<Project, 'name' | 'description' | 'active'>) {
    this.projects.update((list: any) =>
      list.map((p: any) => p.id === id ? { ...p, ...changes } : p)
    );
  }

  delete(id: number) {
    this.projects.update((list: any) => list.filter((p: any) => p.id !== id));
  }

  getById(id: number): Project | undefined {
    return this.projects().find((p: any) => p.id === id);
  }
}