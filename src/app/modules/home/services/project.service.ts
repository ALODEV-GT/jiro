import { HttpClient, HttpParams } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { ApiConfig } from "../../../shared/services/api-config.service";
import { Observable, of } from "rxjs";
import { Page } from "../../../shared/models/page";
import { Project } from "../models/home.model";

@Injectable({
    providedIn: 'root'
})
export class ProjectService {
    private readonly http = inject(HttpClient)
    private readonly apiConfig = inject(ApiConfig)
    private readonly SIZE = 20

    getProjectsByUserId(userId: string, page: number): Observable<Page<Project>> {

        /*
        //to test infinity scroll
        const items = Array.from({ length: this.SIZE }, (_, index) => {
            const id = page * this.SIZE + index + 1;

            return {
                id,
                name: `Proyecto ${id}`,
                description: 'This is a description',
                active: true,
                monthlyIncome: 0,
            };
        });

        return of({
            page,
            size: this.SIZE,
            items,
            isLastPage: false
        });
        */

        const params = new HttpParams()
            .set('page', page)
            .set('size', this.SIZE)
            .set('id', userId)

        return this.http.get<Page<Project>>(`${this.apiConfig.API_PROJECT}`, { params })
    }
}