import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { ApiConfig } from '../../../shared/services/api-config.service';
import { Page } from '../../../shared/models/page';
import { Sprint, UserStory } from '../../project/models/project.model';
import { CreateOrUpdateSprint } from '../models/home.model';

@Injectable({
    providedIn: 'root'
})
export class SprintService {

    private readonly http = inject(HttpClient);
    private readonly apiConfig = inject(ApiConfig);
    private readonly SIZE = 20;

    getSprints(
        projectId: string,
        page = 0,
        size = this.SIZE
    ): Observable<Page<Sprint>> {
        return this.http.get<Page<Sprint>>(
            `${this.apiConfig.API_PROJECT}/${projectId}/sprints`,
            {
                params: {
                    page,
                    size
                }
            }
        );
    }

    createSprint(
        projectId: string,
        body: CreateOrUpdateSprint
    ): Observable<Sprint> {
        return this.http.post<Sprint>(
            `${this.apiConfig.API_PROJECT}/${projectId}/sprints`,
            body
        );
    }

    updateSprint(
        projectId: string,
        sprintId: string,
        body: CreateOrUpdateSprint
    ): Observable<Sprint> {
        return this.http.put<Sprint>(
            `${this.apiConfig.API_PROJECT}/${projectId}/sprints/${sprintId}`,
            body
        );
    }

    deleteSprint(
        projectId: string,
        sprintId: string
    ): Observable<void> {
        return this.http.delete<void>(
            `${this.apiConfig.API_PROJECT}/${projectId}/sprints/${sprintId}`
        );
    }
}
