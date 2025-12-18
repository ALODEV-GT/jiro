import { inject, Injectable } from '@angular/core';
import { ConfirmationRequest, LoginCredentials, LoginResponse, SignupRequest, SignupResponse } from '../models/auth.model';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { ApiConfig } from '../../../shared/services/api-config.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly apiBase = inject(ApiConfig)
  private readonly http = inject(HttpClient)

  login(credentials: LoginCredentials): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiBase.API_AUTH}/sign-in`, credentials)
  }

  signup(request: SignupRequest): Observable<SignupResponse> {
    return this.http.post<SignupResponse>(`${this.apiBase.API_AUTH}/sign-up`, request)
  }

  confirmation(request: ConfirmationRequest): Observable<LoginResponse> {
    return this.http.put<LoginResponse>(`${this.apiBase.API_AUTH}/sign-up`, request)
  }

  find() {

  }

  recover() {

  }

  resendConfirmationCode() {

  }

  resendResetPasswordCode() {

  }
}