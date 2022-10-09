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

const routes: Routes = [
  {
    path: 'tree',
    component: UserManageComponent
  }
]

@NgModule({
  declarations: [
    UserManageComponent,
    MenuBarComponent,
    AddUserComponent,
    DetailUserComponent,
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    SharedModule
  ]
})
export class UserManageModule { }
