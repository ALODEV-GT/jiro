import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiConfig } from '../../../shared/services/api-config.service';
import { Page } from '../../../shared/models/page';
import { Income, CreateOrUpdateIncome } from '../models/home.model';

@Injectable({
    providedIn: 'root'
})
export class IncomeService {

    private readonly http = inject(HttpClient);
    private readonly apiConfig = inject(ApiConfig);
    private readonly SIZE = 20;

    createIncome(
        projectId: string,
        body: CreateOrUpdateIncome
    ): Observable<Income> {
        return this.http.post<Income>(
            `${this.apiConfig.API_PROJECT_FI}/${projectId}/incomes`,
            body
        );
    }

    updateIncome(
        projectId: string,
        incomeId: number,
        body: CreateOrUpdateIncome
    ): Observable<Income> {
        return this.http.put<Income>(
            `${this.apiConfig.API_PROJECT_FI}/${projectId}/incomes/${incomeId}`,
            body
        );
    }

    deleteIncome(
        projectId: string,
        incomeId: number
    ): Observable<void> {
        return this.http.delete<void>(
            `${this.apiConfig.API_PROJECT_FI}/${projectId}/incomes/${incomeId}`
        );
    }

    getIncome(
        projectId: string,
        incomeId: number
    ): Observable<Income> {
        return this.http.get<Income>(
            `${this.apiConfig.API_PROJECT_FI}/${projectId}/incomes/${incomeId}`
        );
    }

    getIncomes(
        projectId: string,
        page = 0,
        size = this.SIZE
    ): Observable<Page<Income>> {
        return this.http.get<Page<Income>>(
            `${this.apiConfig.API_PROJECT_FI}/${projectId}/incomes`,
            {
                params: {
                    page,
                    size
                }
            }
        );
    }
}
