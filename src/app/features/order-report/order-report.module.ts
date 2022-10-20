import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { OrderReportRoutingModule } from './order-report-routing.module';
import { OrderGeneralComponent } from './components/order-general/order-general.component';
import { SharedModule } from 'src/app/core/shared/shared.module';
import { OrderGeneralTableComponent } from './components/order-general-table/order-general-table.component';


@NgModule({
  declarations: [
    OrderGeneralComponent,
    OrderGeneralTableComponent
  ],
  imports: [
    CommonModule,
    OrderReportRoutingModule,
    SharedModule,
  ]
})
export class OrderReportModule { }
