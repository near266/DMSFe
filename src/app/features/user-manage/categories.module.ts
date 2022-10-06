import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserManageComponent } from './user-tree/user-manage.component';
import { Router, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'tree',
    component: UserManageComponent
  }
]

@NgModule({
  declarations: [
    UserManageComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ]
})
export class UserManageModule { }
