import { Component } from '@angular/core';
import { NgSelectConfig } from '@ng-select/ng-select';
import { RolesService } from './core/services/roles.service';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
})
export class AppComponent {
    constructor(private config: NgSelectConfig, private rolesService: RolesService) {
        this.config.notFoundText = 'Không tồn tại';
    }
    ngOnInit() {
        this.rolesService.fetchRoles();
    }

    title = 'dms-fe';
}
