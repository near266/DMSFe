import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { RolesService } from '../services/roles.service';

@Injectable({
    providedIn: 'root',
})
export class CategoryGuard implements CanActivate {
    constructor(private rolesService: RolesService, private router: Router) {}
    canActivate(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot,
    ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
        return this.rolesService.requiredRoles('SALE_ADMIN');
    }
}
