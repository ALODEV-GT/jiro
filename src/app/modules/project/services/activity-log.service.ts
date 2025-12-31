import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { ApiConfig } from '../../../shared/services/api-config.service';
import { Page } from '../../../shared/models/page';
import { ActivityLog } from '../../home/models/home.model';

@Injectable({
    providedIn: 'root',
})
export class ActivityLogService {
    private readonly http = inject(HttpClient);
    private readonly apiConfig = inject(ApiConfig);

    fetchLogs(projectId: string): Observable<ActivityLog[]> {
        console.log("Project id: ", projectId)
        const params = new HttpParams()
            .set('page', 0)
            .set('size', 10000);

        return this.http
            .get<Page<ActivityLog>>(`${this.apiConfig.API_ACTIVITY}/logs`, { params })
            .pipe(
                map((page) =>
                    page.items.filter(log => this.belongsToProject(log, projectId))
                )
            );
    }

    private belongsToProject(log: ActivityLog, projectId: string): boolean {
        if (log.eventType.startsWith('project.')) {
            return log.details.id === projectId;
        }

        return log.details?.projectId === projectId;
    }
}
