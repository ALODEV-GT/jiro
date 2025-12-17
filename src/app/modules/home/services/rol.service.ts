import { HttpClient, HttpParams } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { ApiConfig } from "../../../shared/services/api-config.service";
import { Observable } from "rxjs";
import { Page } from "../../../shared/models/page";
import { Rol } from "../models/home.model";

@Injectable({
    providedIn: 'root'
})
export class RolService {
    private readonly http = inject(HttpClient)
    private readonly apiConfig = inject(ApiConfig)
    private readonly SIZE = 20

    getRoles(sortAttribute: string, order: 'DESC' | 'ASC', page: number): Observable<Page<Rol>> {
        const params = new HttpParams()
            .set('sort', `${sortAttribute},${order}`)
            .set('page', page)
            .set('size', this.SIZE)

        return this.http.get<Page<Rol>>(`${this.apiConfig.API_ROL}`, { params })
    }

    getRol(id: number) {
        return this.http.get<Rol>(`${this.apiConfig.API_ROL}/${id}`)
    }

    createRol(newRol: Partial<Rol>) {
        return this.http.post<Rol>(`${this.apiConfig.API_ROL}`, newRol)
    }

    updateRol(idRol: number, update: Partial<Rol>) {
        return this.http.put<Rol>(`${this.apiConfig.API_ROL}/${idRol}`, update)
    }

    deleteRol(id: number) {
        return this.http.delete<void>(`${this.apiConfig.API_ROL}/${id}`)
    }

    getPermissions(): Observable<Permissions[]> {
        return this.http.get<Permissions[]>(`${this.apiConfig.API_PERMISSIONS}`)
    }

    addPermissionToRol(idRol: number, permissionId: number) {
        return this.http.post<void>(`${this.apiConfig.API_ROL}/${idRol}/permissions`, { permissionId })
    }

    removePermissionToRol(idRol: number, permissionId: number) {
        return this.http.delete<void>(`${this.apiConfig.API_ROL}/${idRol}/permissions/${permissionId}`)
    }
}