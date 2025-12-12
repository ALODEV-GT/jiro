import { LoginResponse } from "../models/auth.model";

export interface AuthState {
    user: LoginResponse | null;
    isAuthenticated: boolean;
}