import { Component, inject, Input, OnChanges } from '@angular/core';
import { ErrorResponse } from '../../../../shared/models/errors';
import { AddMemberRequest, ProjectMember, User } from '../../models/home.model';
import { Page } from '../../../../shared/models/page';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MembersService } from '../../services/members.service';
import { ToastService } from '../../../../shared/services/toast.service';
import { InfiniteScrollDirective } from 'ngx-infinite-scroll';
import { CommonModule } from '@angular/common';
import { ColorService } from '../../services/color.service';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-member-management',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, InfiniteScrollDirective],
  templateUrl: './member-management.component.html',
  styleUrl: './member-management.component.scss'
})
export class MemberManagementComponent implements OnChanges {

  @Input({ required: true }) projectId!: string;

  private readonly fb = inject(FormBuilder);
  private readonly memberService = inject(MembersService);
  private readonly toast = inject(ToastService);
  public colorService = inject(ColorService)
  private readonly userService = inject(UserService);


  page = 0;
  isLastPage = false;

  members: ProjectMember[] = [];
  users: User[] = []


  memberForm = this.fb.nonNullable.group({
    userId: ['', Validators.required]
  });

  ngOnChanges() {
    if (!this.projectId) return;

    this.page = 0;
    this.members = [];
    this.isLastPage = false;

    this.loadMembersPage();
  }

  loadUsers() {
    this.userService.getUsers(0, 1000).subscribe({
      next: (page: Page<User>) => {
        this.users = page.items
      },
      error: (error: ErrorResponse) => {
        this.toast.error(error.message)
      }
    })
  }

  loadMembersPage() {
    if (this.isLastPage) return;

    this.memberService.getMembers(this.projectId, this.page).subscribe({
      next: (page: Page<ProjectMember>) => {
        this.members = [...this.members, ...page.items];
        this.page++;
        this.isLastPage = page.lastPage;
      },
      error: (e: ErrorResponse) => this.toast.error(e.message)
    });
  }

  openCreateModal() {
    this.memberForm.reset({ userId: '' });

    if (this.users.length === 0) {
      this.loadUsers();
    }

    this.showModal('member_modal');
  }

  get availableUsers(): User[] {
    const memberIds = new Set(this.members.map(m => m.id));
    return this.users.filter(u => !memberIds.has(u.id));
  }

  addMember() {
    if (this.memberForm.invalid) return;

    const body: AddMemberRequest = this.memberForm.getRawValue();

    this.memberService.addMember(this.projectId, body).subscribe({
      next: () => {
        this.page = 0;
        this.members = [];
        this.isLastPage = false;
        this.loadMembersPage();
        this.closeModal('member_modal');
      },
      error: (e: ErrorResponse) => this.toast.error(e.message)
    });
  }

  removeMember(userId: string) {
    if (!confirm('¿Eliminar miembro del proyecto?')) return;

    this.memberService.removeMember(this.projectId, userId).subscribe({
      next: () => {
        this.members = this.members.filter(m => m.id !== userId);
      },
      error: (e: ErrorResponse) => this.toast.error(e.message)
    });
  }

  private showModal(id: string) {
    (document.getElementById(id) as HTMLDialogElement)?.showModal();
  }

  closeModal(id: string) {
    (document.getElementById(id) as HTMLDialogElement)?.close();
  }
}