import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiConfig } from '../../../shared/services/api-config.service';
import { Page } from '../../../shared/models/page';
import { Discount, CreateOrUpdateDiscount } from '../models/home.model';

@Injectable({
  providedIn: 'root'
})
export class DiscountService {

  private readonly http = inject(HttpClient);
  private readonly apiConfig = inject(ApiConfig);

  createDiscount(
    employeeId: number,
    body: CreateOrUpdateDiscount
  ): Observable<Discount> {
    return this.http.post<Discount>(
      `${this.apiConfig.API_EMPLOYEES}/${employeeId}/discounts`,
      body
    );
  }

  updateDiscount(
    employeeId: number,
    discountId: number,
    body: CreateOrUpdateDiscount
  ): Observable<Discount> {
    return this.http.put<Discount>(
      `${this.apiConfig.API_EMPLOYEES}/${employeeId}/discounts/${discountId}`,
      body
    );
  }

  deleteDiscount(
    employeeId: number,
    discountId: number
  ): Observable<void> {
    return this.http.delete<void>(
      `${this.apiConfig.API_EMPLOYEES}/${employeeId}/discounts/${discountId}`
    );
  }

  getDiscount(
    employeeId: number,
    discountId: number
  ): Observable<Discount> {
    return this.http.get<Discount>(
      `${this.apiConfig.API_EMPLOYEES}/${employeeId}/discounts/${discountId}`
    );
  }

  getDiscounts(
    employeeId: number,
    page = 0,
    size = 20
  ): Observable<Page<Discount>> {
    return this.http.get<Page<Discount>>(
      `${this.apiConfig.API_EMPLOYEES}/${employeeId}/discounts`,
      {
        params: {
          page,
          size
        }
      }
    );
  }
}
