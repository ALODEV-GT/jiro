import { inject, Injectable } from '@angular/core';
import { Contract, CreateOrUpdateContract } from '../models/home.model';
import { HttpClient } from '@angular/common/http';
import { ApiConfig } from '../../../shared/services/api-config.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ContractService {

  private readonly http = inject(HttpClient);
  private readonly apiConfig = inject(ApiConfig);

  createContract(
    employeeId: string,
    body: CreateOrUpdateContract
  ): Observable<Contract> {
    return this.http.post<Contract>(
      `${this.apiConfig.API_EMPLOYEES}/${employeeId}/contracts`,
      body
    );
  }

  updateContract(
    employeeId: string,
    contractId: number,
    body: CreateOrUpdateContract
  ): Observable<Contract> {
    return this.http.put<Contract>(
      `${this.apiConfig.API_EMPLOYEES}/${employeeId}/contracts/${contractId}`,
      body
    );
  }

  deleteContract(
    employeeId: string,
    contractId: number
  ): Observable<void> {
    return this.http.delete<void>(
      `${this.apiConfig.API_EMPLOYEES}/${employeeId}/contracts/${contractId}`
    );
  }

  getContract(
    employeeId: string,
    contractId: number
  ): Observable<Contract> {
    return this.http.get<Contract>(
      `${this.apiConfig.API_EMPLOYEES}/${employeeId}/contracts/${contractId}`
    );
  }

  getCurrentContract(
    employeeId: string
  ): Observable<Contract> {
    return this.http.get<Contract>(
      `${this.apiConfig.API_EMPLOYEES}/${employeeId}/contracts/current`
    );
  }
}