import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CustomersRoutingModule } from './customers-routing.module';
import { CustomersComponent } from './customers.component';
import { SharedModule } from 'src/app/core/shared/shared.module';
import { DetailCustomerComponent } from './detail-customer/detail-customer.component';
import { AddCustomerComponent } from './add-customer/add-customer.component';


@NgModule({
  declarations: [
    CustomersComponent,
    DetailCustomerComponent,
    AddCustomerComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    CustomersRoutingModule
  ]
})
export class CustomersModule { }
