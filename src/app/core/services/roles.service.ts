import { Injectable } from '@angular/core';
import { of } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
    providedIn: 'root',
})
export class RolesService {
    private currentRoleList: string[] = [];
    private currentRole: string;
    constructor(private authService: AuthService) {}

    fetchRoles() {
        const roleString = localStorage.getItem('role') || null;
        const mainRole = localStorage.getItem('roleMain') || null;
        if (roleString) {
            //convert string separate by comma to array
            const array: string[] = roleString.split(',');
            this.currentRoleList = array;
        } else {
            this.authService.logout();
        }
        if (mainRole) {
            //convert string separate by comma to array
            this.currentRole = mainRole.toUpperCase();
        } else {
            this.authService.logout();
        }
    }

    requiredRoles(role: string) {
        return of(this.currentRoleList.includes(role.toUpperCase()));
    }
    onlyRole(role: string) {
        return of(this.currentRole === role.toUpperCase());
    }
}
