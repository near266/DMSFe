import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { OrderReportRoutingModule } from './order-report-routing.module';
import { OrderGeneralComponent } from './components/order-general/order-general.component';
import { SharedModule } from 'src/app/core/shared/shared.module';


@NgModule({
  declarations: [
    OrderGeneralComponent
  ],
  imports: [
    CommonModule,
    OrderReportRoutingModule,
    SharedModule,
  ]
})
export class OrderReportModule { }
