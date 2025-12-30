import { signalStore, withState, withMethods, patchState } from '@ngrx/signals';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { LoginResponse } from '../models/auth.model';

export interface AuthState {
    user: LoginResponse | null;
    isAuthenticated: boolean;
}

const STORAGE_KEY = 'session';

function getInitialAuthState(): AuthState {
    if (typeof window === 'undefined' || typeof localStorage === 'undefined') {
        return {
            user: null,
            isAuthenticated: false,
        };
    }

    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
        return {
            user: null,
            isAuthenticated: false,
        };
    }

    try {
        const user = JSON.parse(raw) as LoginResponse;
        return {
            user,
            isAuthenticated: true,
        };
    } catch {
        return {
            user: null,
            isAuthenticated: false,
        };
    }
}

const initialState: AuthState = getInitialAuthState();

export const AuthStore = signalStore(
    { providedIn: 'root' },
    withState(initialState),

    withMethods((store) => {
        const router = inject(Router);

        return {
            loginSuccess(payload: LoginResponse) {
                patchState(store, {
                    user: payload,
                    isAuthenticated: true,
                });

                if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
                    localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
                }
            },

            logout() {
                patchState(store, {
                    user: null,
                    isAuthenticated: false,
                });

                if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
                    localStorage.removeItem(STORAGE_KEY);
                }

                router.navigate(['/login']);
            },

            hasPermission(permission: string): boolean {
                const user = store.user();

                if (!user || !user.permissions) {
                    return false;
                }

                return user.permissions.includes(permission);
            },
        };
    })
);
