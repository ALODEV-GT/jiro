import { inject, Injectable } from '@angular/core';
import { Bonus, CreateOrUpdateBonus } from '../models/home.model';
import { Observable } from 'rxjs';
import { Page } from '../../../shared/models/page';
import { HttpClient } from '@angular/common/http';
import { ApiConfig } from '../../../shared/services/api-config.service';

@Injectable({
  providedIn: 'root'
})
export class BonusService {
  private readonly http = inject(HttpClient);
  private readonly apiConfig = inject(ApiConfig);

  createBonus(
    employeeId: number,
    body: CreateOrUpdateBonus
  ): Observable<Bonus> {
    return this.http.post<Bonus>(
      `${this.apiConfig.API_EMPLOYEES}/${employeeId}/bonuses`,
      body
    );
  }

  updateBonus(
    employeeId: number,
    bonusId: number,
    body: CreateOrUpdateBonus
  ): Observable<Bonus> {
    return this.http.put<Bonus>(
      `${this.apiConfig.API_EMPLOYEES}/${employeeId}/bonuses/${bonusId}`,
      body
    );
  }

  deleteBonus(
    employeeId: number,
    bonusId: number
  ): Observable<void> {
    return this.http.delete<void>(
      `${this.apiConfig.API_EMPLOYEES}/${employeeId}/bonuses/${bonusId}`
    );
  }

  getBonus(
    employeeId: number,
    bonusId: number
  ): Observable<Bonus> {
    return this.http.get<Bonus>(
      `${this.apiConfig.API_EMPLOYEES}/${employeeId}/bonuses/${bonusId}`
    );
  }

  getBonuses(
    employeeId: number,
    page = 0,
    size = 20
  ): Observable<Page<Bonus>> {
    return this.http.get<Page<Bonus>>(
      `${this.apiConfig.API_EMPLOYEES}/${employeeId}/bonuses`,
      {
        params: {
          page,
          size
        }
      }
    );
  }
}