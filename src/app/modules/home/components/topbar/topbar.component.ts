import { Component, computed, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthStore } from '../../../auth/store/auth.store';
import { CommonModule } from '@angular/common';
import { ColorService } from '../../services/color.service';

@Component({
  selector: 'app-topbar',
  standalone: true,
  imports: [RouterLinkActive, RouterLink, CommonModule],
  templateUrl: './topbar.component.html',
  styleUrl: './topbar.component.scss'
})
export class TopbarComponent {
  private authStore = inject(AuthStore);
  colorService = inject(ColorService)

  user = computed(() => this.authStore.user());

  initials = computed(() => {
    const user = this.user();
    if (!user) return '';
    return (
      `${user.firstName?.charAt(0) ?? ''}${user.lastName?.charAt(0) ?? ''}` ||
      user.email.charAt(0)
    ).toUpperCase();
  });

  logout(): void {
    this.authStore.logout();
  }
}