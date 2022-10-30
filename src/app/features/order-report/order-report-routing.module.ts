import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { OrderReportComponent } from './order-report.component';

const routes: Routes = [
  {
    path: '',
    component: OrderReportComponent,
  }
];

@NgModule({
  declarations: [
  ],
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OrderReportRoutingModule { }
