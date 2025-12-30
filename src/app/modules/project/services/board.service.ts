import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';

import { ApiConfig } from '../../../shared/services/api-config.service';
import { Page } from '../../../shared/models/page';
import { SprintStage, UserStory } from '../models/project.model';

@Injectable({
    providedIn: 'root'
})
export class BoardService {

    private readonly http = inject(HttpClient);
    private readonly apiConfig = inject(ApiConfig);

    getSprintStages(sprintId: string): Observable<SprintStage[]> {
        const params = new HttpParams()
            .set('page', 0)
            .set('size', 1000);

        return this.http.get<SprintStage[]>(
            `${this.apiConfig.API_SPRINT}/${sprintId}/stages`,
            { params }
        )
    }

    createStage(
        sprintId: string,
        payload: Omit<SprintStage, 'id' | 'createdAt' | 'updatedAt'>
    ): Observable<SprintStage> {
        return this.http.post<SprintStage>(
            `${this.apiConfig.API_SPRINT}/${sprintId}/stages`,
            payload
        );
    }

    updateStage(
        sprintId: string,
        stageId: number,
        payload: Partial<SprintStage>
    ): Observable<SprintStage> {
        return this.http.put<SprintStage>(
            `${this.apiConfig.API_SPRINT}/${sprintId}/stages/${stageId}`,
            payload
        );
    }

    deleteStage(sprintId: string, stageId: number): Observable<void> {
        return this.http.delete<void>(
            `${this.apiConfig.API_SPRINT}/${sprintId}/stages/${stageId}`
        );
    }

    getSprintStories(sprintId: string) {
        return this.http
            .get<UserStory[]>(`${this.apiConfig.API_SPRINT}/${sprintId}/stories`)
            .pipe(
                map(stories =>
                    stories.map(story => ({
                        ...story,
                        sprintId
                    }))
                )
            );
    }
}
