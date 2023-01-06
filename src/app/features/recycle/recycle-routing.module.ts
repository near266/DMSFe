import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CustomerComponent } from './components/customer/customer.component';
import { OrderComponent } from './components/order/order.component';
import { OverviewComponent } from './components/overview/overview.component';
import { ProductComponent } from './components/product/product.component';
import { RecycleComponent } from './recycle.component';

const routes: Routes = [
    {
        path: '',
        component: RecycleComponent,
        children: [
            {
                path: '',
                component: OverviewComponent
            },
            {
                path: 'customer',
                component: CustomerComponent
            },
            {
                path: 'order',
                component: OrderComponent
            },
            {
                path: 'product',
                component: ProductComponent
            },
            {
                path: '**',
                pathMatch: 'full',
                redirectTo: ''
            },
        ]
    }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RecycleRoutingModule { }
