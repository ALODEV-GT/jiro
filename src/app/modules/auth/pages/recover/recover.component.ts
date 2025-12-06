import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, AbstractControl, ValidationErrors } from '@angular/forms';
import { Router, RouterLink, ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { interval, Subject, takeUntil } from 'rxjs';

function passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
  const password = control.get('password')?.value;
  const confirm = control.get('confirmPassword')?.value;
  return password && confirm && password !== confirm ? { passwordMismatch: true } : null;
}
@Component({
  selector: 'app-recover',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './recover.component.html',
  styleUrl: './recover.component.scss'
})
export class RecoverComponent implements OnInit, OnDestroy {
  resetForm: FormGroup;
  loading = false;
  resendLoading = false;
  errorMessage = '';
  successMessage = '';
  countdown = 0;
  userEmail = '';

  private destroy$ = new Subject<void>();

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.resetForm = this.fb.group(
      {
        code: ['', [Validators.required, Validators.pattern(/^\d{6}$/)]],
        password: ['', [Validators.required, Validators.minLength(6)]],
        confirmPassword: ['', Validators.required]
      },
      { validators: passwordMatchValidator }
    );

    // Obtener email desde query params (opcional)
    this.route.queryParams.subscribe(params => {
      if (params['email']) {
        this.userEmail = params['email'];
      }
    });
  }

  ngOnInit() {
    this.startResendCountdown();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  // Getters
  get code() { return this.resetForm.get('code'); }
  get password() { return this.resetForm.get('password'); }
  get confirmPassword() { return this.resetForm.get('confirmPassword'); }

  // Auto-formatear código (solo números, máx 6)
  onCodeInput(event: Event) {
    const input = event.target as HTMLInputElement;
    input.value = input.value.replace(/\D/g, '').slice(0, 6);
    this.resetForm.get('code')?.setValue(input.value);
  }

  async onSubmit() {
    if (this.resetForm.invalid) {
      this.resetForm.markAllAsTouched();
      return;
    }

    this.loading = true;
    this.errorMessage = '';
    this.successMessage = '';

    try {
      const { code, password } = this.resetForm.value;

      // Aquí llamas a tu backend
      // await this.authService.resetPassword(code, password);

      this.successMessage = '¡Contraseña cambiada con éxito!';
      setTimeout(() => {
        this.router.navigate(['/login']);
      }, 2000);

    } catch (error: any) {
      this.errorMessage = error?.message || 'Código inválido o expirado';
    } finally {
      this.loading = false;
    }
  }

  async resendCode() {
    this.resendLoading = true;
    this.errorMessage = '';
    try {
      // await this.authService.resendResetCode(this.userEmail);
      this.successMessage = '¡Nuevo código enviado!';
      this.startResendCountdown();
    } catch {
      this.errorMessage = 'Error al reenviar el código';
    } finally {
      this.resendLoading = false;
    }
  }

  private startResendCountdown() {
    this.countdown = 60;
    interval(1000)
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        if (this.countdown > 0) this.countdown--;
      });
  }
}