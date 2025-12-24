import { Component, inject } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { LoginCredentials, LoginResponse } from '../../models/auth.model';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ErrorResponse } from '../../../../shared/models/errors';
import { AuthStore } from '../../store/auth.store';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);
  private authStore = inject(AuthStore);

  loginForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]]
  });

  loading = false;
  errorMessage = '';

  onSubmit() {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.loading = true;
    this.errorMessage = '';

    const credentials: LoginCredentials = this.loginForm.getRawValue() as LoginCredentials;

    this.authService.login(credentials).subscribe({
      next: (response: LoginResponse) => {
        this.authStore.loginSuccess(response)
        if (response.role == "ADMIN") {
          this.router.navigate(['/home/projects']);
        } else {
          this.router.navigate(['/home/welcome']);
        }
      },
      error: (err: ErrorResponse) => {
        this.loading = false;
        this.errorMessage = err.message;
      },
      complete: () => {
        this.loading = false;
      }
    });
  }

  get email() { return this.loginForm.get('email'); }
  get password() { return this.loginForm.get('password'); }
}