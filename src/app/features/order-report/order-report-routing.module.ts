import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { OrderGeneralComponent } from './components/order-general/order-general.component';
import { OrderReportComponent } from './order-report.component';

const routes: Routes = [
  {
    path: '',
    component: OrderReportComponent,
    children: [
      {
        path: 'summaryOrders',
        component: OrderGeneralComponent,
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OrderReportRoutingModule { }
