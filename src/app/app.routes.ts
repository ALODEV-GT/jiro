import { Routes } from '@angular/router';
import { LoginComponent } from './modules/auth/pages/login/login.component';
import { SignupComponent } from './modules/auth/pages/signup/signup.component';
import { ConfirmationComponent } from './modules/auth/pages/confirmation/confirmation.component';
import { FindComponent } from './modules/auth/pages/find/find.component';
import { RecoverComponent } from './modules/auth/pages/recover/recover.component';
import { BoardComponent } from './modules/project/components/board/board.component';
import { HomeComponent } from './modules/home/pages/home/home.component';
import { ProjectComponent } from './modules/project/pages/project/project.component';
import { HomeLayoutComponent } from './modules/home/components/home-layout/home-layout.component';
import { ProjectsManagementComponent } from './modules/home/pages/projects-management/projects-management.component';
import { EmployeeManagementComponent } from './modules/home/pages/employee-management/employee-management.component';

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
        path: 'confirmation',
        component: ConfirmationComponent
    },
    {
        path: 'find',
        component: FindComponent
    },
    {
        path: 'recover',
        component: RecoverComponent
    },
    {
        path: 'board',
        component: BoardComponent
    },
    {
        path: 'home',
        component: HomeLayoutComponent,
        children: [
            {
                path: 'projects',
                component: ProjectsManagementComponent
            },
            {
                path: 'employee',
                component: EmployeeManagementComponent
            },
            {
                path: '',
                redirectTo: 'projects',
                pathMatch: 'full'
            }
        ]
    },
    {
        path: 'project/:id',
        component: ProjectComponent
    },
    {
        path: '',
        redirectTo: 'login',
        pathMatch: 'full'
    }
];
