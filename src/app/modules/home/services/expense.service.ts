import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { ApiConfig } from '../../../shared/services/api-config.service';
import { Page } from '../../../shared/models/page';
import { Expense, CreateOrUpdateExpense } from '../models/home.model';

@Injectable({
    providedIn: 'root'
})
export class ExpenseService {

    private readonly http = inject(HttpClient);
    private readonly apiConfig = inject(ApiConfig);
    private readonly SIZE = 20;

    createExpense(
        projectId: string,
        body: CreateOrUpdateExpense
    ): Observable<Expense> {
        return this.http.post<Expense>(
            `${this.apiConfig.API_PROJECT_FI}/${projectId}/expenses`,
            body
        );
    }

    updateExpense(
        projectId: string,
        expenseId: number,
        body: CreateOrUpdateExpense
    ): Observable<Expense> {
        return this.http.put<Expense>(
            `${this.apiConfig.API_PROJECT_FI}/${projectId}/expenses/${expenseId}`,
            body
        );
    }

    deleteExpense(
        projectId: string,
        expenseId: number
    ): Observable<void> {
        return this.http.delete<void>(
            `${this.apiConfig.API_PROJECT_FI}/${projectId}/expenses/${expenseId}`
        );
    }

    getExpense(
        projectId: string,
        expenseId: number
    ): Observable<Expense> {
        return this.http.get<Expense>(
            `${this.apiConfig.API_PROJECT_FI}/${projectId}/expenses/${expenseId}`
        );
    }

    getExpenses(
        projectId: string,
        page = 0,
        size = this.SIZE
    ): Observable<Page<Expense>> {
        return this.http.get<Page<Expense>>(
            `${this.apiConfig.API_PROJECT_FI}/${projectId}/expenses`,
            {
                params: {
                    page,
                    size
                }
            }
        );
    }
}
