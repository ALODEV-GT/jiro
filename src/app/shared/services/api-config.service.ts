import { Injectable } from "@angular/core";
import { environment } from "../../../environments/environment";

@Injectable({
    providedIn: 'root'
})
export class ApiConfig {
    private readonly API_BASE = environment.API_BASE;

    public readonly API_AUTH = `${this.API_BASE}/id/auth`
    public readonly API_PERMISSIONS = `${this.API_BASE}/id/permissions`
    public readonly API_ROL = `${this.API_BASE}/id/roles`
    public readonly API_USER = `${this.API_BASE}/id/users`
    public readonly API_PROJECT = `${this.API_BASE}/sc/projects`
    public readonly API_PROJECT_FI = `${this.API_BASE}/fi/projects`
    public readonly API_EMPLOYEES = `${this.API_BASE}/fi/employees`
    
    public readonly API_REPORT = `${this.API_BASE}/in`
    
}