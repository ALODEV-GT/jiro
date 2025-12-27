import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiConfig } from '../../../shared/services/api-config.service';
import { Page } from '../../../shared/models/page';
import {
  Suspension,
  CreateOrUpdateSuspension
} from '../models/home.model';

@Injectable({
  providedIn: 'root'
})
export class SuspensionService {

  private readonly http = inject(HttpClient);
  private readonly apiConfig = inject(ApiConfig);

  createSuspension(
    employeeId: string,
    body: CreateOrUpdateSuspension
  ): Observable<Suspension> {
    return this.http.post<Suspension>(
      `${this.apiConfig.API_EMPLOYEES}/${employeeId}/suspensions`,
      body
    );
  }

  updateSuspension(
    employeeId: string,
    suspensionId: number,
    body: CreateOrUpdateSuspension
  ): Observable<Suspension> {
    return this.http.put<Suspension>(
      `${this.apiConfig.API_EMPLOYEES}/${employeeId}/suspensions/${suspensionId}`,
      body
    );
  }

  deleteSuspension(
    employeeId: string,
    suspensionId: number
  ): Observable<void> {
    return this.http.delete<void>(
      `${this.apiConfig.API_EMPLOYEES}/${employeeId}/suspensions/${suspensionId}`
    );
  }

  getSuspension(
    employeeId: string,
    suspensionId: number
  ): Observable<Suspension> {
    return this.http.get<Suspension>(
      `${this.apiConfig.API_EMPLOYEES}/${employeeId}/suspensions/${suspensionId}`
    );
  }

  getSuspensions(
    employeeId: string,
    page = 0,
    size = 20
  ): Observable<Page<Suspension>> {
    return this.http.get<Page<Suspension>>(
      `${this.apiConfig.API_EMPLOYEES}/${employeeId}/suspensions`,
      {
        params: {
          page,
          size
        }
      }
    );
  }
}
