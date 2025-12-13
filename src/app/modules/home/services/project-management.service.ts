import { inject, Injectable, signal } from '@angular/core';
import { Project } from '../models/home.model';
import { HttpClient } from '@angular/common/http';
import { ApiConfig } from '../../../shared/services/api-config.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProjectManagementService {
  private readonly htpp = inject(HttpClient)
  private readonly apiConfig = inject(ApiConfig)

  private projects = signal<Project[]>([
    {
      id: 1,
      name: 'Edificio Centro',
      description: 'Construcción de 20 pisos en el centro',
      active: true,
      client: "",
      monthlyIncome: 450000.00
    }
  ]);

  add(project: Partial<Project>): Observable<Partial<Project>> {
    return this.htpp.post<Partial<Project>>(`${this.apiConfig.API_PROJECT}`, project)
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