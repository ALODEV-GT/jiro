import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Page } from '../../../shared/models/page';
import { ApiConfig } from '../../../shared/services/api-config.service';
import { ProjectAdvance } from '../models/project-advance.model';
import { ProjectFinance } from '../models/project-finance.model';

@Injectable({
  providedIn: 'root',
})
export class ReportService {
  private readonly http = inject(HttpClient);
  private readonly reportApi = inject(ApiConfig).API_REPORT;
  private readonly SIZE = 2000;

  getProjectAdvance(
    page: number,
    params: any
  ): Observable<Page<ProjectAdvance>> {
    return this.http.get<Page<ProjectAdvance>>(
      `${this.reportApi}/project/advances`,
      { params: { page, size: this.SIZE, ...params } }
    );
  }

  getProjectFinance(
    page: number,
    params: any
  ): Observable<Page<ProjectFinance>> {
    return this.http.get<Page<ProjectFinance>>(
      `${this.reportApi}/financial/movements`,
      { params: { page, size: this.SIZE, ...params } }
    );
  }
}
