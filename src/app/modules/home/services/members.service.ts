import { HttpClient, HttpParams } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { ApiConfig } from "../../../shared/services/api-config.service";
import { Observable } from "rxjs";
import { Page } from "../../../shared/models/page";
import { Member } from "../../project/models/project.model";

@Injectable({
    providedIn: 'root'
})
export class MembersService {
    private readonly http = inject(HttpClient)
    private readonly apiConfig = inject(ApiConfig)
    private readonly SIZE = 100

    getProjectMembers(id: string): Observable<Page<Member>> {
        const params = new HttpParams()
            .set('page', 0)
            .set('size', this.SIZE)

        return this.http.get<Page<Member>>(`${this.apiConfig.API_PROJECT}/${id}/members`, { params })
    }
}