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

const routes: Routes = [
    {
        path: 'tree',
        component: UserManageComponent,
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
    ],
    imports: [CommonModule, RouterModule.forChild(routes), SharedModule],
})
export class UserManageModule {}
