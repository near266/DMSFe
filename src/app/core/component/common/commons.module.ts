import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MenuCollapseComponent } from './menu-collapse/menu-collapse.component';
import { SharedModule } from '../../shared/shared.module';
import { RouterModule } from '@angular/router';



@NgModule({
  declarations: [MenuCollapseComponent],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule
  ], exports: [
    MenuCollapseComponent
  ]
})
export class CommonsModule { }
