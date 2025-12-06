import { Routes } from '@angular/router';
import { LoginComponent } from './modules/auth/pages/login/login.component';
import { SignupComponent } from './modules/auth/pages/signup/signup.component';
import { ConfirmationComponent } from './modules/auth/pages/confirmation/confirmation.component';
import { FindComponent } from './modules/auth/pages/find/find.component';
import { RecoverComponent } from './modules/auth/pages/recover/recover.component';
import { BoardComponent } from './modules/project/components/board/board.component';

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
        path: '',
        redirectTo: 'login',
        pathMatch: 'full'
    }
];
