import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { OrderReportRoutingModule } from './order-report-routing.module';
import { SharedModule } from 'src/app/core/shared/shared.module';
import { OrderReportTableComponent } from './components/order-report-table/order-report-table.component';
import { OrderReportComponent } from './order-report.component';


@NgModule({
  declarations: [
    OrderReportTableComponent,
    OrderReportComponent,
  ],
  imports: [
    CommonModule,
    OrderReportRoutingModule,
    SharedModule,
  ]
})
export class OrderReportModule { }
