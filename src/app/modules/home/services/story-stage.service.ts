import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { ApiConfig } from '../../../shared/services/api-config.service';
import { UserStory } from '../../project/models/project.model';

@Injectable({
    providedIn: 'root'
})
export class StoryStageService {

    private readonly http = inject(HttpClient);
    private readonly apiConfig = inject(ApiConfig);

    getStageStories(stageId: number): Observable<UserStory[]> {
        return this.http.get<UserStory[]>(
            `${this.apiConfig.API_STAGE}/${stageId}/stories`
        );
    }

    createStory(
        stageId: number,
        payload: Omit<UserStory, 'id' | 'stageId' | 'projectId'>
    ): Observable<UserStory> {
        return this.http.post<UserStory>(
            `${this.apiConfig.API_STAGE}/${stageId}/stories`,
            payload
        );
    }

    updateStory(
        stageId: number,
        storyId: number,
        payload: Partial<UserStory>
    ): Observable<UserStory> {
        return this.http.put<UserStory>(
            `${this.apiConfig.API_STAGE}/${stageId}/stories/${storyId}`,
            payload
        );
    }

    updateStoryStage(
        stageId: number,
        storyId: number,
        newStageId: number | null
    ): Observable<UserStory> {
        return this.http.patch<UserStory>(
            `${this.apiConfig.API_STAGE}/${stageId}/stories/${storyId}/stage`,
            { stageId: newStageId }
        );
    }

    delete(stageId: string, storyId: number): Observable<void> {
        return this.http.delete<void>(
            `${this.apiConfig.API_STAGE}/${stageId}/stories/${storyId}`
        );
    }
}
