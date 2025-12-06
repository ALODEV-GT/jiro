import { Injectable } from '@angular/core';
import { LoginCredentials, LoginResponse } from '../models/auth.model';
import { BehaviorSubject, Observable, of, tap, delay, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<LoginResponse['user'] | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();
  public isLoggedIn$ = this.currentUser$.pipe(tap(user => !!user));

  login(credentials: LoginCredentials): Observable<LoginResponse> {
    const validEmail = 'brayan.quialo@gmail.com';
    const validPassword = 'password';

    if (credentials.email !== validEmail || credentials.password !== validPassword) {
      return throwError(() => new Error('Credenciales incorrectas'));
    }

    const fakeResponse: LoginResponse = {
      token: 'fake-jwt-token.' + btoa(credentials.email),
      user: {
        id: '1',
        email: credentials.email,
        name: 'Brayan'
      }
    };

    return of(fakeResponse).pipe(
      delay(800),
      tap(response => {
        localStorage.setItem('access_token', response.token);
        this.currentUserSubject.next(response.user);
      })
    );
  }
}