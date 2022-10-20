import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserManageComponent } from './user-tree/user-manage.component';
import { Router, RouterModule, Routes } from '@angular/router';
import { SharedModule } from 'src/app/core/shared/shared.module';
import { ComponentModule } from 'src/app/core/component/component.module';
import { AddUserComponent } from './user-tree/add-user/add-user.component';
import { DetailUserComponent } from './user-tree/detail-user/detail-user.component';
import { InforComponent } from './user-tree/add-user/infor/infor.component';
import { ConfigComponent } from './user-tree/add-user/config/config.component';
import { AppComponent } from './user-tree/add-user/app/app.component';

import { MenuComponent } from './user-tree/add-user/menu/menu.component';
import { UserTreeViewComponent } from './user-tree/user-tree-view/user-tree-view.component';
import { ResetPasswordComponent } from './user-tree/detail-user/reset-password/reset-password.component';
import { DeleteUserComponent } from './user-tree/detail-user/delete-user/delete-user.component';
import { NgxPaginationModule } from 'ngx-pagination';
import { WarehousesComponent } from './warehouses/warehouses.component';
import { AddManagerComponent } from './user-tree/add-manager/add-manager.component';
import { AddAccountantComponent } from './user-tree/add-accountant/add-accountant.component';
import { AddSalesTeamComponent } from './user-tree/add-sales-team/add-sales-team.component';
import { AddEmployeeComponent } from './user-tree/add-employee/add-employee.component';
import { AddUnitComponent } from './user-tree/add-unit/add-unit.component';

const routes: Routes = [
    {
        path: 'tree',
        component: UserManageComponent,
    },
    {
      path: 'warehouses',
      component: WarehousesComponent,
    },
];

@NgModule({
    declarations: [
        UserManageComponent,
        AddUserComponent,
        DetailUserComponent,
        InforComponent,
        ConfigComponent,
        AppComponent,
        MenuComponent,

        UserTreeViewComponent,
        ResetPasswordComponent,
        DeleteUserComponent,
        WarehousesComponent,
        AddManagerComponent,
        AddAccountantComponent,
        AddSalesTeamComponent,
        AddEmployeeComponent,
        AddUnitComponent,
    ],
    imports: [CommonModule, RouterModule.forChild(routes), SharedModule, NgxPaginationModule],
    exports: [UserTreeViewComponent]
})
export class UserManageModule {}
