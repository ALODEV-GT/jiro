import { Injectable } from "@angular/core";
import { environment } from "../../../environments/environment";

@Injectable({
    providedIn: 'root'
})
export class ApiConfig {
    private readonly API_BASE = environment.API_BASE;

    public readonly API_AUTH = `${this.API_BASE}/auth`
    public readonly API_PROJECT = `${this.API_BASE}/projects`
    public readonly API_ROL = `${this.API_BASE}/roles`
    public readonly API_PERMISSIONS = `${this.API_BASE}/permissions`
    
}