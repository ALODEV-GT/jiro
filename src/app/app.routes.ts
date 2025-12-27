import { Routes } from '@angular/router';
import { LoginComponent } from './modules/auth/pages/login/login.component';
import { SignupComponent } from './modules/auth/pages/signup/signup.component';
import { ConfirmationComponent } from './modules/auth/pages/confirmation/confirmation.component';
import { FindComponent } from './modules/auth/pages/find/find.component';
import { RecoverComponent } from './modules/auth/pages/recover/recover.component';
import { HomeComponent } from './modules/home/pages/home/home.component';
import { ProjectComponent } from './modules/project/pages/project/project.component';
import { HomeLayoutComponent } from './modules/home/components/home-layout/home-layout.component';
import { ProjectsManagementComponent } from './modules/home/pages/projects-management/projects-management.component';
import { RolManagementComponent } from './modules/home/pages/rol-management/rol-management.component';
import { authGuard } from './shared/guards/auth.guard';
import { EmployeeManagementComponent } from './modules/home/pages/employee-management/employee-management.component';
import { ProfileComponent } from './modules/home/pages/profile/profile.component';

export const routes: Routes = [
    {
        path: 'login',
        component: LoginComponent
    },
    {
        path: 'signup',
        component: SignupComponent
    },
    {
        path: 'confirmation/:email',
        component: ConfirmationComponent
    },
    {
        path: 'find',
        component: FindComponent
    },
    {
        path: 'recover',
        component: RecoverComponent,
    },
    {
        path: 'app',
        component: HomeLayoutComponent,
        canActivate: [authGuard],
        children: [
            {
                path: 'welcome',
                component: HomeComponent
            },
            {
                path: 'projects',
                component: ProjectsManagementComponent
            },
            {
                path: 'employee/:id',
                component: ProfileComponent
            },
            {
                path: 'employee',
                component: EmployeeManagementComponent
            },
            {
                path: 'rol',
                component: RolManagementComponent
            },
            {
                path: 'project/:id',
                component: ProjectComponent,
                canActivate: [authGuard]
            },
            {
                path: '',
                redirectTo: 'welcome',
                pathMatch: 'full'
            },
        ]
    },
    {
        path: '',
        redirectTo: 'login',
        pathMatch: 'full'
    }
];
