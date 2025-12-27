import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { ApiConfig } from "../../../shared/services/api-config.service";
import { Observable } from "rxjs";
import { Page } from "../../../shared/models/page";
import { AddMemberRequest, ProjectMember } from "../models/home.model";

@Injectable({
    providedIn: 'root'
})
export class MembersService {
    private readonly http = inject(HttpClient);
    private readonly apiConfig = inject(ApiConfig);
    private readonly SIZE = 20;

    addMember(
        projectId: string,
        body: AddMemberRequest
    ): Observable<void> {
        return this.http.post<void>(
            `${this.apiConfig.API_PROJECT}/${projectId}/members`,
            body
        );
    }

    removeMember(
        projectId: string,
        userId: string
    ): Observable<void> {
        return this.http.delete<void>(
            `${this.apiConfig.API_PROJECT}/${projectId}/members/${userId}`
        );
    }

    getMembers(
        projectId: string,
        page = 0,
        size = this.SIZE
    ): Observable<Page<ProjectMember>> {
        return this.http.get<Page<ProjectMember>>(
            `${this.apiConfig.API_PROJECT}/${projectId}/members`,
            {
                params: {
                    page,
                    size
                }
            }
        );
    }
}