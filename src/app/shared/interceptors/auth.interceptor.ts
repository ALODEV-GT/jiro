import { inject } from '@angular/core';
import {
    HttpEvent,
    HttpHandlerFn,
    HttpInterceptorFn,
    HttpRequest
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthStore } from '../../modules/auth/store/auth.store';

export const authInterceptor: HttpInterceptorFn = (
    req: HttpRequest<any>,
    next: HttpHandlerFn
): Observable<HttpEvent<any>> => {
    const authStore = inject(AuthStore);

    let token = authStore.user()?.token;

    if (!token && typeof localStorage !== 'undefined') {
        const raw = localStorage.getItem('session');
        if (raw) {
            try {
                token = JSON.parse(raw).token;
            } catch { }
        }
    }

    if (!token) {
        return next(req);
    }

    const authReq = req.clone({
        setHeaders: {
            Authorization: `Bearer ${token}`
        }
    });

    return next(authReq);
};
