import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiConfig } from '../../../shared/services/api-config.service';
import { Page } from '../../../shared/models/page';
import { UpdateMyUser, User } from '../models/home.model';

@Injectable({
    providedIn: 'root'
})
export class UserService {

    private readonly http = inject(HttpClient);
    private readonly apiConfig = inject(ApiConfig);
    private readonly SIZE = 20;

    getUsers(page: number = 0, size: number = this.SIZE): Observable<Page<User>> {
        const params = new HttpParams()
            .set('page', page)
            .set('size', size);

        return this.http.get<Page<User>>(
            `${this.apiConfig.API_USER}`,
            { params }
        );
    }

    getMyInfo(): Observable<User> {
        return this.http.get<User>(
            `${this.apiConfig.API_USER}/me`
        );
    }

    getUserById(userId: string): Observable<User> {
        return this.http.get<User>(
            `${this.apiConfig.API_USER}/${userId}`
        );
    }

    updateMyInfo(body: UpdateMyUser): Observable<User> {
        return this.http.put<User>(
            `${this.apiConfig.API_USER}`,
            body
        );
    }

    banUser(userId: string): Observable<void> {
        return this.http.patch<void>(
            `${this.apiConfig.API_USER}/${userId}/ban`,
            {}
        );
    }

    changeUserRole(
        userId: string,
        roleId: number
    ): Observable<User> {
        return this.http.patch<User>(
            `${this.apiConfig.API_USER}/${userId}/role`,
            { roleId }
        );
    }

    deleteMyUser(): Observable<void> {
        return this.http.delete<void>(
            `${this.apiConfig.API_USER}`
        );
    }
}
