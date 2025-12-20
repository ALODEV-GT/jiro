import {
    signalStore,
    withState,
    withMethods,
    withComputed,
    patchState
} from '@ngrx/signals';
import { inject, computed } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { Permission } from '../../modules/home/models/home.model';
import { PermissionService } from '../../modules/home/services/permissions.service';

export interface PermissionState {
    permissions: Permission[];
    loading: boolean;
    loaded: boolean;
}

const initialState: PermissionState = {
    permissions: [],
    loading: false,
    loaded: false,
};

export const PermissionStore = signalStore(
    { providedIn: 'root' },

    withState(initialState),

    withMethods((store) => {
        const service = inject(PermissionService);

        return {
            async load() {
                if (store.loaded() || store.loading()) return;

                patchState(store, { loading: true });

                try {
                    const permissions = await firstValueFrom(
                        service.getPermissions()
                    );

                    patchState(store, {
                        permissions,
                        loaded: true,
                        loading: false,
                    });
                } catch {
                    patchState(store, { loading: false });
                }
            },
        };
    }),

    withComputed((store) => ({
        hasPermission: computed(
            () => (key: string) =>
                store.permissions().some(p => p.key === key)
        ),
    }))
);
