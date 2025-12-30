import { Component, inject } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { ErrorResponse } from '../../../../shared/models/errors';
import { ConfirmationRequest, LoginResponse } from '../../models/auth.model';
import { AuthStore } from '../../store/auth.store';

@Component({
  selector: 'app-confirmation',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, RouterModule],
  templateUrl: './confirmation.component.html',
  styleUrl: './confirmation.component.scss'
})
export class ConfirmationComponent {
  private activatedRoute = inject(ActivatedRoute);
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private authService = inject(AuthService);
  private authStore = inject(AuthStore);

  verifyForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    code: ['', [Validators.required, Validators.pattern(/^\d{6}$/)]]
  });


  loading = false;
  errorMessage = '';


  constructor() {
    this.activatedRoute.params.subscribe(params => {
      this.email?.setValue(params['email']);
    });
  }

  ngOnInit() {
  }

  get email() { return this.verifyForm.get('email'); }
  get code() { return this.verifyForm.get('code'); }

  onCodeInput(event: Event) {
    const input = event.target as HTMLInputElement;
    input.value = input.value.replace(/\D/g, '').slice(0, 6);
    this.verifyForm.get('code')?.setValue(input.value, { emitEvent: false });
  }

  async onSubmit() {
    if (this.verifyForm.invalid) {
      this.verifyForm.markAllAsTouched();
      return;
    }

    this.loading = true;
    this.errorMessage = '';

    const request: ConfirmationRequest = {
      email: this.email?.value as string,
      code: this.code?.value as string
    };

    this.authService.confirmation(request).subscribe({
      next: (response: LoginResponse) => {
        this.authStore.loginSuccess(response)
        this.router.navigate(['/app/projects']);
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
}