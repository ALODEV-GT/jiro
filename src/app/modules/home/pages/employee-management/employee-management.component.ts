import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { InfiniteScrollDirective } from 'ngx-infinite-scroll';
import { ErrorResponse } from '../../../../shared/models/errors';
import { Page } from '../../../../shared/models/page';
import { ToastService } from '../../../../shared/services/toast.service';
import { EmployeesComponent } from "../../../report/components/employees/employees.component";
import { Rol, User } from '../../models/home.model';
import { ColorService } from '../../services/color.service';
import { RolService } from '../../services/rol.service';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-employee-management',
  standalone: true,
  imports: [InfiniteScrollDirective, CommonModule, EmployeesComponent],
  templateUrl: './employee-management.component.html',
  styleUrl: './employee-management.component.scss'
})
export class EmployeeManagementComponent {
  private readonly userService = inject(UserService);
  private readonly toast = inject(ToastService);
  private readonly router = inject(Router)
  private readonly rolService = inject(RolService)
  colorService = inject(ColorService)

  private isLastPage = false;
  private page = 0
  users: User[] = [];
  roles: Rol[] = [];
  rolesMap = new Map<string, Rol>();

  ngOnInit(): void {
    this.getRoles()
    this.getUserPage()
  }

  getUserPage() {
    if (!this.isLastPage) {
      this.userService.getUsers(this.page).subscribe({
        next: (page: Page<User>) => {
          this.users = [...this.users, ...page.items]
          this.page += 1
          this.isLastPage = page.lastPage
        },
        error: (error: ErrorResponse) => {
          this.toast.error(error.message)
        }
      })
    }
  }

  getRoles() {
    this.rolService.getRoles('name', 'ASC', 0, 1000).subscribe({
      next: (page: Page<Rol>) => {
        this.roles = page.items;

        this.rolesMap = new Map(
          page.items.map(role => [role.id.toString(), role])
        );
      },
      error: (error: ErrorResponse) => {
        this.toast.error(error.message);
      }
    });
  }

  getRoleName(roleId: string): string {
    return this.rolesMap.get(roleId ?? -1)?.name ?? '—';
  }

  view(userId: string) {
    this.router.navigate(['app/employee', userId]);
  }

  resetPagination() {
    this.users = []
    this.page = 0
    this.isLastPage = false
    this.getUserPage()
  }

  showReportModal() {
    (document.getElementById("report_modal") as HTMLDialogElement)?.showModal();
  }

  delete(id: string) {
    const confirmed = confirm('¿Estás seguro de que deseas bloquear el usuario?');

    if (!confirmed) {
      return;
    }

    this.userService.banUser(id).subscribe({
      next: () => {
        this.toast.success('Se ha bloqueado el usuario');
        this.resetPagination()
      },
      error: () => {
        this.toast.error('Ocurrion un error al bloquear al usuario');
      }
    })
  }
}
