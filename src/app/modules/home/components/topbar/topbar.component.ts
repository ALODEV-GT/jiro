import { Component, computed, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthStore } from '../../../auth/store/auth.store';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-topbar',
  standalone: true,
  imports: [RouterLinkActive, RouterLink, CommonModule],
  templateUrl: './topbar.component.html',
  styleUrl: './topbar.component.scss'
})
export class TopbarComponent {
  private authStore = inject(AuthStore);

  user = computed(() => this.authStore.user());

  initials = computed(() => {
    const user = this.user();
    if (!user) return '';
    return (
      `${user.firstName?.charAt(0) ?? ''}${user.lastName?.charAt(0) ?? ''}` ||
      user.email.charAt(0)
    ).toUpperCase();
  });

  isLightColor(hex: string): boolean {
    const color = hex.replace('#', '');

    const r = parseInt(color.substring(0, 2), 16);
    const g = parseInt(color.substring(2, 4), 16);
    const b = parseInt(color.substring(4, 6), 16);

    const luminance = (0.299 * r + 0.587 * g + 0.114 * b);

    return luminance > 186;
  }

  textColor = computed(() => {
    const color = this.user()?.color;
    if (!color) return '#ffffff';

    return this.isLightColor(color) ? '#000000' : '#ffffff';
  });

  logout(): void {
    this.authStore.logout();
  }
}