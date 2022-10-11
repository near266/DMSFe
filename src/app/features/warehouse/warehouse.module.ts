import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { WarehouseRoutingModule } from './warehouse-routing.module';
import { WarehouseComponent } from './warehouse.component';
import { SharedModule } from 'src/app/core/shared/shared.module';
import { RouterModule } from '@angular/router';
import { SidebarComponent } from './sidebar/sidebar.component';
import { CommonsModule } from 'src/app/core/component/common/commons.module';
import { MainComponent } from 'src/app/core/layouts/main/main.component';
import { MainModule } from 'src/app/core/layouts/main/main.module';


@NgModule({
  declarations: [
    WarehouseComponent,
    SidebarComponent
  ],
  imports: [
    CommonModule,
    CommonsModule,
    SharedModule,
    RouterModule,
    WarehouseRoutingModule
  ]
})
export class WarehouseModule { }
