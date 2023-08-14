import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CustomersRoutingModule } from './customers-routing.module';
import { CustomersComponent } from './customers.component';
import { SharedModule } from 'src/app/core/shared/shared.module';
import { DetailCustomerComponent } from './detail-customer/detail-customer.component';
import { AddCustomerComponent } from './add-customer/add-customer.component';
import { ChangeRouteComponent } from './change-route/change-route.component';
import { AddRouteComponent } from './add-route/add-route.component';
import { FieldsDialogComponent } from './fields-dialog/fields-dialog.component';
import { HistoryComponent } from './history/history.component';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { HistoryVisitedComponent } from './history-visited/history-visited.component';


@NgModule({
  declarations: [
    CustomersComponent,
    DetailCustomerComponent,
    AddCustomerComponent,
    ChangeRouteComponent,
    AddRouteComponent,
    FieldsDialogComponent,
    HistoryComponent,
    HistoryVisitedComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    ScrollingModule,
    CustomersRoutingModule
  ]
})
export class CustomersModule { }
