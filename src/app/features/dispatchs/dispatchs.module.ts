import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DispatchsRoutingModule } from './dispatchs-routing.module';
import { DispatchsComponent } from './dispatchs.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { RouterModule } from '@angular/router';
import { SharedModule } from 'src/app/core/shared/shared.module';


@NgModule({
  declarations: [
    DispatchsComponent,
    SidebarComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    SharedModule,
    DispatchsRoutingModule
  ]
})
export class DispatchsModule { }
