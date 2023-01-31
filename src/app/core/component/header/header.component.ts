import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonLogicService } from 'src/app/features/order-manager/services/commonLogic.service';
import { Notification } from '../../model/Notification';
import { AuthService } from '../../services/auth.service';
import { NotificationService } from '../../services/notification.service';
import { RolesService } from '../../services/roles.service';

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
    roles: string;
    listRole: string[] = [];
    isAdmin = false;
    role: string;
    notification: boolean = false;
    listNotify: Notification = {
        list: [],
    };
    annonimousAvatar = './../../../../assets/images/annonimous.jpg';
    constructor(
        private router: Router,
        private authService: AuthService,
        private rolesService: RolesService,
        private commonLogicService: CommonLogicService,
        private notificationService: NotificationService,
        public datePipe: DatePipe,
    ) {}

    ngOnInit(): void {
        this.role = '' + localStorage.getItem('roleMain');
        this.roles = '' + localStorage.getItem('role');
        this.listRole = this.roles.split(',');
        this.listRole.forEach((element) => {
            if (element.includes('SALE_ADMIN')) {
                this.isAdmin = true;
            }
        });
    }

    logout() {
        this.authService.logout();
    }
    requiredRoles(role: string) {
        return this.rolesService.requiredRoles(role);
    }
    requiredRolesList(roles: string[]) {
        return this.rolesService.requiredRolesList(roles);
    }

    onlyRole(role: string) {
        return this.rolesService.onlyRole(role);
    }

    openTree() {
        this.router.navigate(['/categories/tree']);
    }

    resetSearchTextSource() {
        this.commonLogicService.setSearchTextSource('');
    }

    viewNotification() {
        this.notification = !this.notification;
        if(this.notification) {
            this.notificationService.getAll().subscribe((data: Notification) => {
                this.listNotify = data;
            });
        }
    }
}
