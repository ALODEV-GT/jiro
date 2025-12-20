import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { ApiConfig } from "../../../shared/services/api-config.service";
import { Observable } from "rxjs";
import { Permission } from "../models/home.model";


@Injectable({
    providedIn: 'root'
})
export class PermissionService {
    private readonly http = inject(HttpClient)
    private readonly apiConfig = inject(ApiConfig)

    getPermissions(): Observable<Permission[]> {
        return this.http.get<Permission[]>(`${this.apiConfig.API_PERMISSIONS}`)
    }
} 