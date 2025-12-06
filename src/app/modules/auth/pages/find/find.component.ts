import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-find',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './find.component.html',
  styleUrl: './find.component.scss'
})
export class FindComponent {
  recoverForm: FormGroup;
  loading = false;
  errorMessage = '';
  successMessage = '';

  constructor(
    private fb: FormBuilder,
    private router: Router
  ) {
    this.recoverForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  get email() {
    return this.recoverForm.get('email');
  }

  async onSubmit() {
    if (this.recoverForm.invalid) {
      this.recoverForm.markAllAsTouched();
      return;
    }

    this.loading = true;
    this.errorMessage = '';
    this.successMessage = '';

    try {
      const email = this.recoverForm.get('email')?.value;

      this.successMessage = `¡Código enviado a ${email}! Redirigiendo...`;

      setTimeout(() => {
        this.router.navigate(['/reset-password'], {
          queryParams: { email }
        });
      }, 2000);

    } catch (error: any) {
      this.errorMessage = error?.message || 'No se encontró una cuenta con ese correo';
    } finally {
      this.loading = false;
    }
  }
}