import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RecycleRoutingModule } from './recycle-routing.module';
import { RecycleComponent } from './recycle.component';
import { RouterModule } from '@angular/router';
import { SharedModule } from 'src/app/core/shared/shared.module';
import { OverviewComponent } from './components/overview/overview.component';
import { OrderComponent } from './components/order/order.component';
import { CustomerComponent } from './components/customer/customer.component';
import { ProductComponent } from './components/product/product.component';
import { HeaderRecycleComponent } from './components/header-recycle/header-recycle.component';
import { TableRecycleComponent } from './components/table-recycle/table-recycle.component';
import { PaginationComponent } from './components/pagination/pagination.component';


@NgModule({
  declarations: [
    RecycleComponent,
    OverviewComponent,
    OrderComponent,
    CustomerComponent,
    ProductComponent,
    HeaderRecycleComponent,
    TableRecycleComponent,
    PaginationComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    SharedModule,
    RecycleRoutingModule
  ]
})
export class RecycleModule { }
