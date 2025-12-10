import { Component } from '@angular/core';

@Component({
  selector: 'app-rol-management',
  standalone: true,
  imports: [],
  templateUrl: './rol-management.component.html',
  styleUrl: './rol-management.component.scss'
})
export class RolManagementComponent {
  openModal() {
    (document.getElementById('role_modal') as any)?.showModal();
  }

  closeModal() {
    (document.getElementById('role_modal') as any)?.close();
  }

  confirmDelete() {
    alert('No se puede eliminar roles del sistema base');
  }
}