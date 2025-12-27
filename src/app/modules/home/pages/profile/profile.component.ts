import { Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ErrorResponse } from '../../../../shared/models/errors';
import { UserService } from '../../services/user.service';
import { UpdateMyUser, User } from '../../models/home.model';
import { ToastService } from '../../../../shared/services/toast.service';
import { ContractManagementComponent } from '../contract-management/contract-management.component';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [FormsModule, ContractManagementComponent],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})
export class ProfileComponent {

  private activatedRoute = inject(ActivatedRoute);
  private userService = inject(UserService);
  private toast = inject(ToastService);

  user: User | null = null;

  editing = false;

  editForm: UpdateMyUser = {
    firstName: '',
    lastName: '',
    password: ''
  };

  activeTab: 'income' | 'discount' | 'bonus' | 'suspension' | 'contract' = 'income';

  constructor() {
    this.activatedRoute.params.subscribe(params => {
      this.getPersonalInfo(params['id']);
    });
  }

  getPersonalInfo(userId: string) {
    this.userService.getUserById(userId).subscribe({
      next: (user) => {
        this.user = user;
      },
      error: (error: ErrorResponse) => {
        this.toast.error(error.message);
      }
    });
  }

  enableEdit() {
    if (!this.user) return;

    this.editing = true;
    this.editForm = {
      firstName: this.user.firstName,
      lastName: this.user.lastName,
      password: ''
    };
  }

  cancelEdit() {
    this.editing = false;
    this.editForm.password = '';
  }

  saveProfile() {
    const body: UpdateMyUser = {
      firstName: this.editForm.firstName,
      lastName: this.editForm.lastName,
      ...(this.editForm.password ? { password: this.editForm.password } : {})
    };

    this.userService.updateMyInfo(body).subscribe({
      next: (updatedUser) => {
        this.user = updatedUser;
        this.editing = false;
        this.toast.success('Perfil actualizado correctamente');
      },
      error: (error: ErrorResponse) => {
        this.toast.error(error.message);
      }
    });
  }
}
