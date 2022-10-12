import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CustomersRoutingModule } from './customers-routing.module';
import { CustomersComponent } from './customers.component';
import { MenuBarComponent } from './menu-bar/menu-bar.component';
import { SharedModule } from 'src/app/core/shared/shared.module';
import { DetailCustomerComponent } from './detail-customer/detail-customer.component';


@NgModule({
  declarations: [
    CustomersComponent,
    MenuBarComponent,
    DetailCustomerComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    CustomersRoutingModule
  ]
})
export class CustomersModule { }
