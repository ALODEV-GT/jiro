import { HttpClient, HttpParams } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { ApiConfig } from "../../../shared/services/api-config.service";
import { Observable } from "rxjs";
import { Page } from "../../../shared/models/page";
import { Sprint, UserStory } from "../models/project.model";

@Injectable({
    providedIn: 'root'
})
export class SprintService {
    private readonly http = inject(HttpClient)
    private readonly apiConfig = inject(ApiConfig)
    private readonly SIZE = 100

    getProjectSprints(id: string): Observable<Page<Sprint>> {
        const params = new HttpParams()
            .set('page', 0)
            .set('size', this.SIZE)

        return this.http.get<Page<Sprint>>(`${this.apiConfig.API_PROJECT}/${id}/sprints`, { params })
    }

    update(idProject: string, idSprint: number | string, update: Partial<Sprint>): Observable<Partial<Sprint>> {
        return this.http.put<Partial<Sprint>>(`${this.apiConfig.API_PROJECT}/${idProject}/sprints/${idSprint}`, update)
    }

    create(idProject: string, newSprint: Partial<Sprint>): Observable<Partial<Sprint>> {
        return this.http.post<Partial<Sprint>>(`${this.apiConfig.API_PROJECT}/${idProject}/sprints`, newSprint)
    }

    delete(idProject: string, idSprint: number): Observable<void> {
        return this.http.delete<void>(`${this.apiConfig.API_PROJECT}/${idProject}/sprints/${idSprint}`)
    }

    assignStoryToSprint(projectId: string, storyId: string, sprintId: string): Observable<UserStory> {
        return this.http.patch<UserStory>(
            `${this.apiConfig.API_PROJECT}/${projectId}/stories/${storyId}/sprint`, {
            sprintId
        }
        );
    }
}