import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { ApiConfig } from '../../../shared/services/api-config.service';
import { Observable } from 'rxjs';
import { UserStory } from '../models/project.model';

@Injectable({
  providedIn: 'root'
})
export class StoryService {
  private readonly http = inject(HttpClient);
  private readonly apiConfig = inject(ApiConfig);

  getBacklogStories(projectId: string): Observable<UserStory[]> {
    return this.http.get<UserStory[]>(
      `${this.apiConfig.API_PROJECT}/${projectId}/stories`
    );
  }

  create(
    projectId: string,
    payload: Omit<UserStory, 'id' | 'stageId' | 'projectId'>
  ): Observable<UserStory> {
    return this.http.post<UserStory>(
      `${this.apiConfig.API_PROJECT}/${projectId}/stories`,
      payload
    );
  }

  update(
    projectId: string,
    storyId: number,
    payload: Partial<UserStory>
  ): Observable<UserStory> {
    return this.http.put<UserStory>(
      `${this.apiConfig.API_PROJECT}/${projectId}/stories/${storyId}`,
      payload
    );
  }

  delete(projectId: string, storyId: number): Observable<void> {
    return this.http.delete<void>(
      `${this.apiConfig.API_PROJECT}/${projectId}/stories/${storyId}`
    );
  }
}