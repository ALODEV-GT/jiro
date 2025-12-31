import { Component, inject, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ToastContainerComponent } from './shared/components/toast-container.component';
import { PermissionStore } from './shared/store/permission.store';
import { AuthStore } from './modules/auth/store/auth.store';
import { UserService } from './modules/home/services/user.service';
import { User } from './modules/home/models/home.model';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, ToastContainerComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  private permissionStore = inject(PermissionStore);
  private authStore = inject(AuthStore)
  private userService = inject(UserService)

  ngOnInit(): void {
    if (this.authStore.isAuthenticated()) {
      this.userService.getMyInfo().subscribe({
        next: (user: User) => {
          console.log(user)
          this.authStore.updateUserInfo(user)
        },
        error: () => {
          console.log("Ocurrio un error al recuperar los permisos")
        },
      })
    }

    this.permissionStore.load();
  }
}
