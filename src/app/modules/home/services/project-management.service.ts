import { inject, Injectable } from '@angular/core';
import { Project } from '../models/home.model';
import { HttpClient, HttpParams } from '@angular/common/http';
import { ApiConfig } from '../../../shared/services/api-config.service';
import { Observable } from 'rxjs';
import { Page } from '../../../shared/models/page';

@Injectable({
  providedIn: 'root'
})
export class ProjectManagementService {
  private readonly http = inject(HttpClient)
  private readonly apiConfig = inject(ApiConfig)
  private readonly PAGE_SIZE = 20;

  add(project: Partial<Project>): Observable<Partial<Project>> {
    return this.http.post<Partial<Project>>(`${this.apiConfig.API_PROJECT}`, project)
  }

  update(id: string, project: Partial<Project>): Observable<Partial<Project>> {
    return this.http.put<Partial<Project>>(`${this.apiConfig.API_PROJECT}/${id}`, project)
  }

  closeProject(id: string): Observable<Partial<Project>> {
    return this.http.patch<Project>(`${this.apiConfig.API_PROJECT}/${id}/close`, {})
  }

  delete(id: string): Observable<void> {
    const params = new HttpParams()
      .set('id', id)

    return this.http.delete<void>(`${this.apiConfig.API_PROJECT}`, { params })
  }

  getAll(page: number): Observable<Page<Project>> {
    /*
    //to test infinity scroll
    const items: Project[] = Array.from({ length: this.PAGE_SIZE }, (_, index) => {
      const id: string = (page * this.PAGE_SIZE + index + 1).toString();

      return {
        id,
        name: `Proyecto ${id}`,
        client: "",
        description: 'This is a description',
        active: true,
        monthlyIncome: 45000,
        closedAt: '2025-12-11T20:10:46.700534Z',
        createdAt: '2025-12-11T20:10:46.700534Z',
        updatedAt: '2025-12-11T20:10:46.700534Z'

      };
    });

    return of({
      page,
      size: this.PAGE_SIZE,
      items,
      firstPage: true,
      lastPage: true
    });
    */
    const params = new HttpParams()
      .set('page', page)
      .set('size', this.PAGE_SIZE)

    return this.http.get<Page<Project>>(`${this.apiConfig.API_PROJECT}`, { params })
  }
}