import { Injectable } from '@angular/core';
import { of } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
    providedIn: 'root',
})
export class RolesService {
    private currentRoleList: string[] = [];
    constructor(private authService: AuthService) {}

    fetchRoles() {
        const roleString = localStorage.getItem('role') || null;
        if (roleString) {
            //convert string separate by comma to array
            const array: string[] = roleString.split(',');
            this.currentRoleList = array;
        } else {
            this.authService.logout();
        }
    }

    requiredRoles(role: string) {
        return of(this.currentRoleList.includes(role.toUpperCase()));
    }
}
