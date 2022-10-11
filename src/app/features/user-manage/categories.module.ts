import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserManageComponent } from './user-tree/user-manage.component';
import { Router, RouterModule, Routes } from '@angular/router';
import { SharedModule } from 'src/app/core/shared/shared.module';
import { MenuCollapseComponent } from 'src/app/core/component/common/menu-collapse/menu-collapse.component';
import { ComponentModule } from 'src/app/core/component/component.module';
import { MenuBarComponent } from './user-tree/menu-bar/menu-bar.component';
import { AddUserComponent } from './user-tree/add-user/add-user.component';
import { DetailUserComponent } from './user-tree/detail-user/detail-user.component';
import { InforComponent } from './user-tree/add-user/infor/infor.component';
import { ConfigComponent } from './user-tree/add-user/config/config.component';
import { AppComponent } from './user-tree/add-user/app/app.component';
import { MenuComponent } from './user-tree/add-user/menu/menu.component';
import { TreeModule } from '@circlon/angular-tree-component';
import { UserTreeViewComponent } from './user-tree/user-tree-view/user-tree-view.component';

const routes: Routes = [
    {
        path: 'tree',
        component: UserManageComponent,
    },
];

@NgModule({
    declarations: [
        UserManageComponent,
        MenuBarComponent,
        AddUserComponent,
        DetailUserComponent,
        InforComponent,
        ConfigComponent,
        AppComponent,
        MenuComponent,
        UserTreeViewComponent,
    ],
    imports: [CommonModule, TreeModule, RouterModule.forChild(routes), SharedModule],
})
export class UserManageModule {}
