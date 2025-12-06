import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { interval, Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-confirmation',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './confirmation.component.html',
  styleUrl: './confirmation.component.scss'
})
export class ConfirmationComponent implements OnInit, OnDestroy {
  verifyForm: FormGroup;
  loading = false;
  resendLoading = false;
  errorMessage = '';
  successMessage = '';
  countdown = 0;
  userEmail = 'usuario@ejemplo.com';

  private destroy$ = new Subject<void>();

  constructor(
    private fb: FormBuilder,
    private router: Router
  ) {
    this.verifyForm = this.fb.group({
      code: ['', [Validators.required, Validators.pattern(/^\d{6}$/)]]
    });
  }

  ngOnInit() {
    this.startResendCountdown();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

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
    this.successMessage = '';

    try {
      const code = this.verifyForm.get('code')?.value;

      this.successMessage = '¡Correo verificado con éxito!';
      setTimeout(() => {
        this.router.navigate(['/dashboard']);
      }, 1500);

    } catch (error: any) {
      this.errorMessage = error?.message || 'Código incorrecto o expirado';
    } finally {
      this.loading = false;
    }
  }

  async resendCode() {
    this.resendLoading = true;
    this.errorMessage = '';
    try {
      this.successMessage = '¡Nuevo código enviado!';
      this.startResendCountdown();
    } catch (error: any) {
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
        if (this.countdown > 0) {
          this.countdown--;
        }
      });
  }
}