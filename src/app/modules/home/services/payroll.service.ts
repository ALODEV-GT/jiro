import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiConfig } from '../../../shared/services/api-config.service';
import { Page } from '../../../shared/models/page';
import { CreateOrUpdatePayroll, Payroll } from '../models/home.model';

@Injectable({
  providedIn: 'root'
})
export class PayrollService {

  private readonly http = inject(HttpClient);
  private readonly apiConfig = inject(ApiConfig);
  private readonly SIZE = 20;

  createPayroll(
    employeeId: string,
    body: CreateOrUpdatePayroll
  ): Observable<Payroll> {
    return this.http.post<Payroll>(
      `${this.apiConfig.API_EMPLOYEES}/${employeeId}/payrolls`,
      body
    );
  }

  updatePayroll(
    employeeId: string,
    payrollId: number,
    body: CreateOrUpdatePayroll
  ): Observable<Payroll> {
    return this.http.put<Payroll>(
      `${this.apiConfig.API_EMPLOYEES}/${employeeId}/payrolls/${payrollId}`,
      body
    );
  }

  deletePayroll(
    employeeId: string,
    payrollId: number
  ): Observable<void> {
    return this.http.delete<void>(
      `${this.apiConfig.API_EMPLOYEES}/${employeeId}/payrolls/${payrollId}`
    );
  }

  getPayrolls(
    employeeId: string,
    page: number
  ): Observable<Page<Payroll>> {
    const params = new HttpParams()
      .set('page', page)
      .set('size', this.SIZE);

    return this.http.get<Page<Payroll>>(
      `${this.apiConfig.API_EMPLOYEES}/${employeeId}/payrolls`,
      { params }
    );
  }
}
