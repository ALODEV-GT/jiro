import { inject, Injectable } from '@angular/core';
import { LoginCredentials, LoginResponse } from '../models/auth.model';
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
    return this.http.post<LoginResponse>(`${this.apiBase.API_AUTH}`, credentials)
  }

  signup() {

  }

  confirmation() {

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