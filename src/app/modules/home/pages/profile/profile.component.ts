import { Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ErrorResponse } from '../../../../shared/models/errors';
import { UserService } from '../../services/user.service';
import { UpdateMyUser, User } from '../../models/home.model';
import { ToastService } from '../../../../shared/services/toast.service';
import { ContractManagementComponent } from '../contract-management/contract-management.component';
import { AuthStore } from '../../../auth/store/auth.store';
import { LoginResponse } from '../../../auth/models/auth.model';
import { PayrollManagementComponent } from '../payroll-management/payroll-management.component';
import { DiscountManagementComponent } from '../discount-management/discount-management.component';
import { BonusManagementComponent } from '../bonus-management/bonus-management.component';
import { SuspensionManagementComponent } from '../suspension-management/suspension-management.component';
import { ProductivityComponent } from "../../../report/components/productivity/productivity.component";

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    FormsModule,
    ContractManagementComponent,
    PayrollManagementComponent,
    DiscountManagementComponent,
    BonusManagementComponent,
    SuspensionManagementComponent,
    ProductivityComponent
],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})
export class ProfileComponent {

  private activatedRoute = inject(ActivatedRoute);
  private userService = inject(UserService);
  private toast = inject(ToastService);
  private readonly authStore = inject(AuthStore);

  user: User | null = null;
  editing = false;

  editForm: UpdateMyUser = {
    firstName: '',
    lastName: '',
    password: ''
  };

  activeTab: 'income' | 'discount' | 'bonus' | 'suspension' | 'contract' | 'reports' = 'suspension';

  canEdit(): boolean {
    const authUser: LoginResponse = this.authStore.user()!;
    return !!authUser && !!this.user && authUser.id == this.user.id;
  }

  constructor() {
    this.activatedRoute.params.subscribe(params => {
      this.getPersonalInfo(params['id']);
    });
  }

  getPersonalInfo(userId: string) {
    this.userService.getUserById(userId).subscribe({
      next: (user) => {
        this.user = user;
        this.editing = false;
      },
      error: (error: ErrorResponse) => {
        this.toast.error(error.message);
      }
    });
  }

  enableEdit() {
    if (!this.user || !this.canEdit()) return;

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
    if (!this.canEdit()) return;

    const body: UpdateMyUser = {
      firstName: this.editForm.firstName,
      lastName: this.editForm.lastName,
      ...(this.editForm.password ? { password: this.editForm.password } : {})
    };

    this.userService.updateMyInfo(body).subscribe({
      next: updatedUser => {
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
