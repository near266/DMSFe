import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DispatchsRoutingModule } from './dispatchs-routing.module';
import { DispatchsComponent } from './dispatchs.component';
import { SidebarComponent } from './sidebar/sidebar.component';


@NgModule({
  declarations: [
    DispatchsComponent,
    SidebarComponent
  ],
  imports: [
    CommonModule,
    DispatchsRoutingModule
  ]
})
export class DispatchsModule { }
